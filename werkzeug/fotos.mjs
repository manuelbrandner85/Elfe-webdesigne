/* Wandelt die erzeugten Konzeptfotos in Auslieferungsformate.

   Getrennt von kacheln.mjs, und das mit Absicht: Dort entstehen
   Ausschnitte aus einer vorhandenen Aufnahme - hier liegen echte,
   eigenstaendige Motive vor. Beide in dieselbe Namensreihe zu werfen
   hiesse, dass ein spaeterer Lauf des einen Skripts die Arbeit des
   anderen ueberschreibt. Deshalb die eigene Reihe `foto-*`.

   Aufruf: node werkzeug/fotos.mjs
*/
import sharp from "sharp";
import { readdirSync, mkdirSync } from "node:fs";

const QUELLE = "werkzeug/roh";
const ZIEL = "public/images/tiles";
mkdirSync(ZIEL, { recursive: true });

/* Die Galeriekacheln erscheinen bei rund 210 Pixeln Breite, auf einem
   Telefon bei dreifacher Dichte also bei 630. Mehr auszuliefern kostet
   Bytes ohne einen einzigen sichtbaren Punkt. */
const BREITEN = [640, 360];

let vorher = 0;
let nachher = 0;

for (const datei of readdirSync(QUELLE).filter((f) => f.endsWith(".png"))) {
  const name = datei.replace(/\.png$/, "");
  const m = await sharp(`${QUELLE}/${datei}`).metadata();
  vorher += m.size ?? 0;

  for (const breite of BREITEN) {
    const kern = sharp(`${QUELLE}/${datei}`)
      .resize(breite, Math.round((breite * 3) / 4), { fit: "cover", kernel: "lanczos3" })
      .sharpen({ sigma: 0.6, m1: 0.4, m2: 0.9 });
    const a = `${ZIEL}/foto-${name}-${breite}.avif`;
    const w = `${ZIEL}/foto-${name}-${breite}.webp`;
    await kern.clone().avif({ quality: 56, effort: 6 }).toFile(a);
    const info = await kern.clone().webp({ quality: 80, effort: 6 }).toFile(w);
    if (breite === 640) nachher += info.size;
  }
  console.log(`foto-${name}  ${m.width}x${m.height} -> 640 und 360`);
}

console.log(`\nRohmaterial ${(vorher / 1048576).toFixed(1)} MB, ausgeliefert je Motiv rund ${(nachher / readdirSync(QUELLE).length / 1024).toFixed(0)} KB`);
