/* Rendert das Erklärvideo Bild für Bild.

   Nicht über CSS-Animationen und Bildschirmaufnahme: Die laufen in
   Echtzeit, und was dabei herauskommt, hängt davon ab, wie ausgelastet
   die Maschine gerade ist. Hier setzt der Renderer die Zeit, macht ein
   Bild, setzt die nächste. Bildgenau, reproduzierbar, unabhängig von
   der Last.

   Aufruf: node werkzeug/erklaervideo/rendern.mjs
*/
import { chromium } from "playwright";
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const HIER = dirname(fileURLToPath(import.meta.url));
const BILDER = join(HIER, "bilder");
const ZIEL = join(HIER, "..", "..", "public", "videos");
const BILDZIEL = join(HIER, "..", "..", "public", "images");

const FPS = 25;

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

await seite.goto("file://" + join(HIER, "szene.html"), { waitUntil: "networkidle" });
await seite.evaluate(() => document.fonts.ready);

const gesamt = await seite.evaluate(() => window.__gesamt);
const anzahl = Math.round(gesamt * FPS);
console.log(`${gesamt} s bei ${FPS} Bildern je Sekunde = ${anzahl} Bilder`);

for (let i = 0; i < anzahl; i++) {
  await seite.evaluate((t) => window.__zeichne(t), i / FPS);
  await seite.screenshot({
    path: join(BILDER, String(i).padStart(5, "0") + ".png"),
    animations: "disabled",
  });
  if (i % 250 === 0) console.log(`  ${i} / ${anzahl}`);
}
await browser.close();

if (fehler.length) {
  console.error("Fehler beim Aufbau:", fehler.slice(0, 5));
  process.exit(1);
}

/* Zwei Formate, weil kein einzelnes überall das günstigere ist, und
   ohne Ton — es gibt keinen. */
const ein = `-framerate ${FPS} -i ${join(BILDER, "%05d.png")}`;
execSync(`ffmpeg -v error -y ${ein} -an -c:v libx264 -crf 26 -preset slow -pix_fmt yuv420p -movflags +faststart ${join(ZIEL, "erklaervideo.mp4")}`);
execSync(`ffmpeg -v error -y ${ein} -an -c:v libvpx-vp9 -crf 36 -b:v 0 -row-mt 1 ${join(ZIEL, "erklaervideo.webm")}`);

/* Standbild fürs Poster-Attribut: ein Bild aus der ersten Szene, in dem
   der Titel schon steht. */
execSync(`ffmpeg -v error -y -i ${join(BILDER, String(Math.round(3 * FPS)).padStart(5, "0") + ".png")} -vf scale=1280:-2 ${join(BILDZIEL, "erklaervideo.webp")}`);
execSync(`ffmpeg -v error -y -i ${join(BILDER, String(Math.round(3 * FPS)).padStart(5, "0") + ".png")} -vf scale=1280:-2 ${join(BILDZIEL, "erklaervideo.avif")}`);

rmSync(BILDER, { recursive: true, force: true });
console.log("erklaervideo.mp4 und .webm erzeugt");
