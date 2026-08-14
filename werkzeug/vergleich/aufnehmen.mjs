/* Nimmt die beiden Mockups auf — je einmal für den Rechner und einmal
   für das Handy — und liefert fertige Webbilder.

   Warum echte Browser-Aufnahmen statt nachgebautem DOM im Bauteil:
   Die frühere Fassung zeichnete beide Auftritte als HTML nach, bei sechs
   bis neun Pixeln Schriftgröße, damit es in den Rahmen passte. Das war
   unlesbar, brach bei jeder anderen Rahmenbreite anders um und kostete
   bei jedem Aufbau zwei komplette Seitenlayouts. Jetzt liegt Typografie
   in echter Größe vor und wird erst danach verkleinert.

   Warum eigene Handy-Aufnahmen:
   Ein Bildschirmfoto vom Rechner, auf 340 Pixel geschrumpft, zeigt nichts.
   Und es verschenkt das stärkste Argument: Der alte Auftritt wird auf dem
   Handy so ausgeliefert, wie ein Telefon eine Seite ohne Sichtfeldangabe
   ausliefert — 980 Pixel breit, in den Bildschirm gequetscht. Genau das
   ist der Zustand, den Kunden kennen. Deshalb entsteht "vorher" bei 980
   Pixeln und wird erst durch die Verkleinerung klein, waehrend "nachher"
   bei echter Telefonbreite entsteht. */
import { chromium } from "playwright";
import sharp from "sharp";
import { mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const HIER = dirname(fileURLToPath(import.meta.url));
const ZIEL = join(HIER, "..", "ausgabe");
mkdirSync(ZIEL, { recursive: true });

/* Rahmen am Rechner: 16:10. Rahmen am Handy: 9:16. */
const AUFNAHMEN = [
  { datei: "vorher",  name: "vorher",        breite: 1280, hoehe: 800,  schaerfe: 2.5, ausgaben: [1600, 900] },
  { datei: "nachher", name: "nachher",       breite: 1280, hoehe: 800,  schaerfe: 2.5, ausgaben: [1600, 900] },
  { datei: "vorher",  name: "vorher-handy",  breite: 980,  hoehe: 1742, schaerfe: 1.6, ausgaben: [900, 480] },
  { datei: "nachher", name: "nachher-handy", breite: 390,  hoehe: 693,  schaerfe: 3,   ausgaben: [900, 480] },
];

const browser = await chromium.launch({
  executablePath: "/home/claude/chromium",
  args: ["--no-sandbox", "--force-color-profile=srgb", "--font-render-hinting=none"],
});

let fehlerhaft = false;

for (const auf of AUFNAHMEN) {
  const seite = await browser.newPage({
    viewport: { width: auf.breite, height: auf.hoehe },
    deviceScaleFactor: auf.schaerfe,
  });
  const fehler = [];
  seite.on("console", (m) => m.type() === "error" && fehler.push(m.text()));
  seite.on("requestfailed", (r) => fehler.push("Ladefehler: " + r.url()));

  await seite.goto("file://" + join(HIER, `${auf.datei}.html`), { waitUntil: "networkidle" });
  await seite.evaluate(() => document.fonts.ready);
  const roh = await seite.screenshot({ type: "png" });
  await seite.close();

  if (fehler.length) {
    console.error(`[${auf.name}] ${fehler.length} Fehler:`, fehler.slice(0, 5));
    fehlerhaft = true;
  }

  for (const breite of auf.ausgaben) {
    /* Leichtes Nachschaerfen nach dem Verkleinern: Lanczos gibt sonst eine
       halbe Pixelbreite Weichheit ab, die bei Schrift sofort auffaellt. */
    const kern = sharp(roh)
      .resize(breite, null, { kernel: "lanczos3" })
      .sharpen({ sigma: 0.6, m1: 0.4, m2: 0.9 });
    await kern.clone().webp({ quality: 82, effort: 6 })
      .toFile(join(ZIEL, `${auf.name}-${breite}.webp`));
    await kern.clone().avif({ quality: 55, effort: 6 })
      .toFile(join(ZIEL, `${auf.name}-${breite}.avif`));
  }
  console.log(`[${auf.name}] ${auf.breite}x${auf.hoehe} @${auf.schaerfe} aufgenommen`);
}

for (const name of ["vorher", "nachher", "vorher-handy", "nachher-handy"]) {
  const klein = await sharp(join(ZIEL, `${name}-900.webp`))
    .resize(16).blur(1.2).webp({ quality: 40 }).toBuffer();
  console.log(`  ${name}: data:image/webp;base64,${klein.toString("base64")}`);
}

await browser.close();
process.exit(fehlerhaft ? 1 : 0);
