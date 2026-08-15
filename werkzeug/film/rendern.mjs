/* Rendert den Erklärfilm Bild für Bild und kodiert ihn.

   WARUM BILD FÜR BILD UND NICHT MITSCHNEIDEN

   Ein Bildschirmmitschnitt haengt an der Rechenleistung: Ruckelt die
   Maschine, ruckelt der Film - und beim naechsten Lauf an anderer
   Stelle. Hier wird stattdessen die Abspielzeit ALLER Animationen je
   Bild exakt gesetzt und dann fotografiert. Das Ergebnis ist bei jedem
   Lauf identisch, unabhaengig davon, wie langsam die Maschine gerade
   ist. Nur so laesst sich ein Film ueberhaupt korrigieren.

   Aufruf: node werkzeug/film/rendern.mjs [sekunden] [bilder-je-sekunde]
*/
import { chromium } from "playwright";
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const HIER = dirname(fileURLToPath(import.meta.url));
const DAUER = Number(process.argv[2] || 56);
const FPS = Number(process.argv[3] || 25);
const BILDER = join("/tmp", "film-bilder");
const ZIEL = join(HIER, "..", "..", "public", "videos");

rmSync(BILDER, { recursive: true, force: true });
mkdirSync(BILDER, { recursive: true });
mkdirSync(ZIEL, { recursive: true });

const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM || "/home/claude/chromium",
  args: ["--no-sandbox", "--force-color-profile=srgb", "--font-render-hinting=none"],
});
const seite = await browser.newPage({
  viewport: { width: 1280, height: 720 },
  deviceScaleFactor: 1,
});
const fehler = [];
seite.on("console", (m) => m.type() === "error" && fehler.push(m.text()));
seite.on("requestfailed", (r) => fehler.push("Ladefehler: " + r.url()));

await seite.goto("file://" + join(HIER, "film.html"), { waitUntil: "networkidle" });
await seite.evaluate(() => document.fonts.ready);

const gesamt = Math.round(DAUER * FPS);
for (let i = 0; i < gesamt; i++) {
  const t = (i / FPS) * 1000;
  await seite.evaluate((ms) => {
    /* Eine Verzoegerung gehoert zur eigenen Zeitachse einer Animation.
       Alle auf denselben Wert zu setzen ergibt deshalb eine einzige
       gemeinsame Zeitleiste - genau das, was ein Schnittprogramm tut. */
    for (const a of document.getAnimations()) {
      a.pause();
      a.currentTime = ms;
    }
  }, t);
  /* KEIN `animations: "disabled"`.

     Die Einstellung setzt CSS-Animationen fuer die Aufnahme zurueck -
     also genau das, was hier vorher von Hand exakt positioniert wurde.
     Der erste Durchlauf lieferte deshalb 1400 leere Bilder: Hintergrund
     und Fortschrittsbalken, sonst nichts. Angehalten sind die
     Animationen ohnehin schon. */
  await seite.screenshot({
    path: join(BILDER, String(i).padStart(5, "0") + ".png"),
  });
  if (i % 100 === 0) console.log(`  ${i} / ${gesamt}`);
}
await browser.close();

if (fehler.length) {
  console.error("Fehler beim Aufbau:", fehler.slice(0, 5));
  process.exit(1);
}

const b = join(BILDER, "%05d.png");
/* Zwei Formate: VP9 ist meist deutlich kleiner, H.264 laeuft ueberall.
   Ohne Ton - der Film traegt seinen Inhalt in der Schrift. */
execSync(`ffmpeg -v error -y -framerate ${FPS} -i ${b} -an -c:v libx264 -crf 26 -preset slow -pix_fmt yuv420p -movflags +faststart ${join(ZIEL, "anleitung-film.mp4")}`);
execSync(`ffmpeg -v error -y -framerate ${FPS} -i ${b} -an -c:v libvpx-vp9 -crf 36 -b:v 0 -row-mt 1 ${join(ZIEL, "anleitung-film.webm")}`);
execSync(`ffmpeg -v error -y -i ${join(BILDER, "00025.png")} -frames:v 1 /tmp/film-poster.png`);

console.log("fertig:");
execSync(`ls -la ${join(ZIEL, "anleitung-film.mp4")} ${join(ZIEL, "anleitung-film.webm")}`, { stdio: "inherit" });
