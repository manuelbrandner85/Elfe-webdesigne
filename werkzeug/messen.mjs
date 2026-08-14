/* Messung statt Gefuehl.

   Jeder Eingriff in die Bewegung wird vorher und nachher gemessen. Der
   Grund ist unbequem, aber einfach: Mehr Bewegung fuehlt sich beim Bauen
   immer gut an, weil man auf einem schnellen Rechner sitzt und weiss,
   worauf man achten muss. Ob sie fluessig LAEUFT, sagt nur die Zahl.

   Gemessen wird waehrend eines gescripteten Scrolldurchlaufs:

   - lange Frames   (>50 ms) — jeder einzelne ist ein sichtbarer Ruckler
   - Bildabstaende  (95. Perzentil) — wo die Bewegung stockt
   - LCP, CLS       — was der Besucher als Ladezeit und Sprung erlebt
   - uebertragen    — Bytes ueber die Leitung, nicht auf der Platte

   Aufruf:  node werkzeug/messen.mjs [name]
   Ergebnis: werkzeug/messungen/<name>.json  und eine Zeile auf der Konsole
*/
import { chromium } from "playwright";
import { mkdirSync, writeFileSync, existsSync, readFileSync } from "node:fs";

const NAME = process.argv[2] || "lauf";
const ZIEL = "werkzeug/messungen";
const ADRESSE = process.env.ADRESSE || "http://127.0.0.1:8099/";
mkdirSync(ZIEL, { recursive: true });

const GERAETE = [
  { name: "laptop", breite: 1440, hoehe: 900, dpr: 2, bremse: 1 },
  // Vierfache Bremse: naeher an einem drei Jahre alten Android als an
  // dem Rechner, auf dem gebaut wird.
  { name: "handy", breite: 390, hoehe: 844, dpr: 3, bremse: 4 },
];

const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM || "/home/claude/chromium",
  /* WebGL2 muss an sein, sonst misst man eine Seite ohne Atmosphaere und
     ohne die Werkstatt-Kamerafahrt — also nicht die Seite, die
     ausgeliefert wird. In dieser Umgebung gibt es keine Grafikkarte,
     gerechnet wird auf der CPU. Das ist ein sehr harter Grenzfall: Jedes
     echte Geraet ist um ein Vielfaches schneller. Die Zahlen taugen zum
     Vergleich vorher/nachher, nicht als absolute Aussage. */
  args: [
    "--no-sandbox",
    "--force-color-profile=srgb",
    "--use-angle=swiftshader",
    "--enable-unsafe-swiftshader",
    "--ignore-gpu-blocklist",
    "--disable-gpu-sandbox",
  ],
});

const ergebnis = {};

for (const g of GERAETE) {
  const kontext = await browser.newContext({
    viewport: { width: g.breite, height: g.hoehe },
    deviceScaleFactor: g.dpr,
  });
  const seite = await kontext.newPage();
  const cdp = await kontext.newCDPSession(seite);
  if (g.bremse > 1) await cdp.send("Emulation.setCPUThrottlingRate", { rate: g.bremse });

  let bytes = 0;
  /* Nach Art getrennt, weil eine Gesamtzahl nichts erklaert: Ob 200 KB
     aus einem Bild oder aus vorgeladenen Unterseiten stammen, sind zwei
     voellig verschiedene Befunde. */
  const nachArt = {};
  const fehler = [];
  seite.on("response", async (r) => {
    const l = r.headers()["content-length"];
    if (!l) return;
    bytes += Number(l);
    const art = r.request().resourceType();
    nachArt[art] = (nachArt[art] || 0) + Number(l);
  });
  seite.on("pageerror", (e) => fehler.push(e.message));
  seite.on("console", (m) => m.type() === "error" && fehler.push(m.text()));

  await seite.addInitScript(() => {
    window.__mess = { lang: [], lcp: 0, cls: 0, frames: [] };
    try {
      new PerformanceObserver((l) => {
        for (const e of l.getEntries()) if (e.duration > 50) window.__mess.lang.push(Math.round(e.duration));
      }).observe({ type: "long-animation-frame", buffered: true });
    } catch { /* aeltere Browser kennen den Typ nicht */ }
    new PerformanceObserver((l) => {
      const e = l.getEntries(); window.__mess.lcp = Math.round(e[e.length - 1].startTime);
    }).observe({ type: "largest-contentful-paint", buffered: true });
    /* Sprungquellen mitschreiben, nicht nur die Summe.

       Eine CLS-Zahl allein ist unbrauchbar: Sie sagt, dass etwas
       gesprungen ist, aber nicht was. Ein Ausreisser laesst sich ohne
       den Verursacher nicht nachstellen — und ein Ausreisser, den man
       nicht nachstellen kann, geht am Ende doch live. */
    window.__mess.spruenge = [];
    new PerformanceObserver((l) => {
      for (const e of l.getEntries()) {
        if (e.hadRecentInput) continue;
        window.__mess.cls += e.value;
        if (e.value > 0.01)
          window.__mess.spruenge.push({
            wert: +e.value.toFixed(4),
            zeit: Math.round(e.startTime),
            wer: (e.sources || []).map((q) => {
              const n = q.node;
              if (!n) return "?";
              return (
                (n.tagName || "") + "." + String(n.className || "").slice(0, 46) +
                " [" + Math.round(q.previousRect.top) + ">" + Math.round(q.currentRect.top) + "]"
              );
            }),
          });
      }
    }).observe({ type: "layout-shift", buffered: true });
    let vorher = 0;
    const takt = (t) => { if (vorher) window.__mess.frames.push(t - vorher); vorher = t; requestAnimationFrame(takt); };
    requestAnimationFrame(takt);
  });

  await seite.goto(ADRESSE, { waitUntil: "load" });
  await seite.waitForTimeout(1500);
  await seite.evaluate(() => { window.__mess.frames.length = 0; window.__mess.lang.length = 0; });

  /* Langsam durch die ganze Seite scrollen — so, wie jemand liest. */
  const hoehe = await seite.evaluate(() => document.body.scrollHeight);
  const schritte = 60;
  for (let i = 1; i <= schritte; i++) {
    await seite.evaluate((y) => window.scrollTo({ top: y, behavior: "instant" }), (hoehe * i) / schritte);
    await seite.waitForTimeout(90);
  }

  const m = await seite.evaluate(() => window.__mess);
  const sortiert = m.frames.slice().sort((a, b) => a - b);
  const p95 = sortiert[Math.floor(sortiert.length * 0.95)] || 0;

  ergebnis[g.name] = {
    langeFrames: m.lang.length,
    langeFramesMax: Math.max(0, ...m.lang),
    bildabstandP95: Math.round(p95),
    bilderProSekunde: Math.round(1000 / (sortiert[Math.floor(sortiert.length / 2)] || 16.7)),
    lcp: m.lcp,
    cls: Number(m.cls.toFixed(4)),
    uebertragenKB: Math.round(bytes / 1024),
    bilderKB: Math.round((nachArt.image || 0) / 1024),
    skriptKB: Math.round((nachArt.script || 0) / 1024),
    vorabKB: Math.round((nachArt.fetch || 0) / 1024),
    medienKB: Math.round((nachArt.media || 0) / 1024),
    fehler: fehler.length,
    spruenge: m.spruenge || [],
  };
  await kontext.close();
}

const pfad = `${ZIEL}/${NAME}.json`;
writeFileSync(pfad, JSON.stringify(ergebnis, null, 2));

for (const [gname, w] of Object.entries(ergebnis)) {
  console.log(
    `${gname.padEnd(7)} lange Frames ${String(w.langeFrames).padStart(3)} (max ${w.langeFramesMax} ms)  ` +
    `p95 ${String(w.bildabstandP95).padStart(3)} ms  ${w.bilderProSekunde} B/s  ` +
    `LCP ${w.lcp} ms  CLS ${w.cls}  ${w.uebertragenKB} KB ` +
    `(Bild ${w.bilderKB} / JS ${w.skriptKB} / vorab ${w.vorabKB} / Video ${w.medienKB})  Fehler ${w.fehler}`,
  );
  for (const s of w.spruenge)
    console.log(`        Sprung ${s.wert} bei ${s.zeit} ms: ${s.wer.join(" | ")}`);
}

/* Vergleich mit der letzten Grundmessung, falls vorhanden */
const grund = `${ZIEL}/grundlage.json`;
if (NAME !== "grundlage" && existsSync(grund)) {
  const a = JSON.parse(readFileSync(grund, "utf8"));
  console.log("\ngegen die Grundlage:");
  for (const g of Object.keys(ergebnis)) {
    const d = (s) => {
      const v = ergebnis[g][s] - a[g][s];
      return (v > 0 ? "+" : "") + (typeof v === "number" ? v.toFixed(s === "cls" ? 4 : 0) : v);
    };
    console.log(`  ${g.padEnd(7)} lange Frames ${d("langeFrames")}  p95 ${d("bildabstandP95")} ms  LCP ${d("lcp")} ms  ${d("uebertragenKB")} KB`);
  }
}

await browser.close();
