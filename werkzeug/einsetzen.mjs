/* Setzt die hochgerechneten Bilder an die Stelle der alten.

   Die PNG-Zwischenstufe aus hochrechnen.py ist verlustfrei und riesig.
   Ausgeliefert wird daraus WebP und AVIF in der Groesse, die tatsaechlich
   dargestellt wird — mehr waere verschenkt: Ein Bild groesser
   auszuliefern, als es je erscheint, kostet Bytes ohne einen sichtbaren
   Pixel. Danach verschwindet die Zwischenstufe.

   Aufruf: node werkzeug/einsetzen.mjs
*/
import sharp from "sharp";
import { readdirSync, statSync, unlinkSync } from "node:fs";
import { join } from "node:path";

const ORDNER = ["public/images", "public/images/tiles"];

/* Zielbreiten nach Darstellungsgroesse mal Geraetedichte. */
const BREITE = (rel) => {
  if (rel.startsWith("tiles/")) return 720;      // 140 px Anzeige, x3 Dichte
  if (rel.startsWith("concept-")) return 1600;   // volle Spaltenbreite
  if (rel.startsWith("portrait")) return 1400;   // 420 px Anzeige, x3 Dichte
  return 1600;
};

let vorher = 0, nachher = 0, anzahl = 0;

for (const ordner of ORDNER) {
  for (const datei of readdirSync(ordner)) {
    if (!datei.endsWith("-gross.png")) continue;
    const stamm = datei.replace("-gross.png", "");
    const rel = (ordner.endsWith("tiles") ? "tiles/" : "") + stamm;
    const quelle = join(ordner, datei);
    const webp = join(ordner, stamm + ".webp");
    const avif = join(ordner, stamm + ".avif");

    let alt = 0;
    try { alt = statSync(webp).size; } catch { /* neu */ }

    const kern = sharp(quelle).resize(BREITE(rel), null, {
      withoutEnlargement: true, kernel: "lanczos3",
    });
    await kern.clone().webp({ quality: 80, effort: 6 }).toFile(webp + ".tmp");
    await kern.clone().avif({ quality: 52, effort: 6 }).toFile(avif + ".tmp");

    const { renameSync } = await import("node:fs");
    renameSync(webp + ".tmp", webp);
    renameSync(avif + ".tmp", avif);
    unlinkSync(quelle);

    const neu = statSync(webp).size + statSync(avif).size;
    const m = await sharp(webp).metadata();
    console.log(
      `${rel.padEnd(26)} ${m.width}x${m.height}  ` +
      `WebP ${(statSync(webp).size / 1024).toFixed(0)} KB  ` +
      `AVIF ${(statSync(avif).size / 1024).toFixed(0)} KB  (vorher ${(alt / 1024).toFixed(0)} KB)`,
    );
    vorher += alt; nachher += neu; anzahl++;
  }
}
console.log(`\n${anzahl} Bilder ersetzt: ${(vorher / 1024).toFixed(0)} KB -> ${(nachher / 1024).toFixed(0)} KB (beide Formate)`);
