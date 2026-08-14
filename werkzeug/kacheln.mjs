/* Schneidet die Konzeptkacheln aus den Standbildern.

   WARUM UEBERHAUPT NEU

   Die bisherigen sechs Kacheln je Konzept waren sechs Einzelbilder aus
   demselben fuenf Sekunden langen Video - und dieses Video ist eine
   einzige langsame Kamerafahrt auf eine einzige Szene. Die Kacheln waren
   deshalb praktisch identisch. In der Galerie des Nordwerk-Entwurfs
   standen drei Bilder nebeneinander, die dasselbe zeigten, mit den
   Unterschriften "Dachstuhl", "Innenausbau" und "Sanierung". Das faellt
   jedem auf, der zwei Sekunden hinsieht, und es ist genau der Eindruck,
   den eine Arbeitsprobe nicht machen darf.

   WAS STATTDESSEN

   Aus EINER Aufnahme lassen sich sehr wohl verschiedene Bilder gewinnen -
   so arbeitet jeder Fotograf: eine Totale, eine Halbtotale, ein Detail.
   Die Ausschnitte hier sind benannte Bereiche der Szene, die tatsaechlich
   etwas Verschiedenes zeigen. Und die Unterschriften in content.ts
   benennen jetzt das, was zu sehen ist, statt etwas zu behaupten, was das
   Bild nicht hergibt.

   QUELLE

   Nicht das Video (720 Pixel breit), sondern das hochgerechnete Standbild
   in public/images (1600 Pixel). Ein Ausschnitt daraus hat mehr echte
   Bildinformation als ein Vollbild aus dem Video.

   Aufruf: node werkzeug/kacheln.mjs
*/
import sharp from "sharp";
import { mkdirSync } from "node:fs";

const ZIEL = "public/images/tiles";
mkdirSync(ZIEL, { recursive: true });

/* Bereiche in Anteilen der Bildflaeche: links, oben, rechts, unten.
   Das Seitenverhaeltnis wird anschliessend auf 4:3 gezogen, mittig um
   den Bereich - so bleibt der gemeinte Gegenstand im Bild, auch wenn
   der Ausschnitt etwas wachsen muss. */
const KONZEPTE = {
  nordwerk: [
    ["werkbank",   0.16, 0.40, 0.62, 0.98],
    ["werkzeug",   0.26, 0.02, 0.52, 0.36],
    ["holzlager",  0.38, 0.06, 0.78, 0.58],
    ["licht",      0.01, 0.00, 0.32, 0.52],
    ["zuschnitt",  0.60, 0.36, 1.00, 0.88],
    ["spaene",     0.04, 0.68, 0.42, 1.00],
  ],
  verde: [
    ["pasta",      0.26, 0.42, 0.64, 0.98],
    ["oel",        0.00, 0.28, 0.30, 0.92],
    ["wein",       0.32, 0.02, 0.58, 0.58],
    ["brot",       0.50, 0.22, 0.86, 0.68],
    ["basilikum",  0.06, 0.52, 0.32, 0.92],
    ["gedeck",     0.54, 0.58, 0.94, 1.00],
  ],
  atelier: [
    ["fenster",    0.64, 0.00, 1.00, 0.78],
    ["bar",        0.08, 0.08, 0.46, 0.72],
    ["leuchte",    0.28, 0.00, 0.62, 0.42],
    ["sessel",     0.18, 0.52, 0.70, 1.00],
    ["kamin",      0.48, 0.28, 0.76, 0.78],
    ["boden",      0.00, 0.68, 0.42, 1.00],
  ],
};

/* Die Kacheln erscheinen im Entwurf bei rund 210 Pixeln Breite. Bei
   dreifacher Geraetedichte sind das 630 - mehr waere verschenkt. */
const BREITEN = [640, 360];
const VERHAELTNIS = 4 / 3;

for (const [konzept, bereiche] of Object.entries(KONZEPTE)) {
  const quelle = `public/images/concept-${konzept}.webp`;
  const { width: B, height: H } = await sharp(quelle).metadata();

  for (let i = 0; i < bereiche.length; i++) {
    const [name, l, o, r, u] = bereiche[i];
    let x = Math.round(l * B);
    let y = Math.round(o * H);
    let b = Math.round((r - l) * B);
    let h = Math.round((u - o) * H);

    /* Auf 4:3 bringen, um die Mitte des Bereichs herum, und im Bild
       halten - ein Ausschnitt, der ueber den Rand ragt, laesst sharp
       fehlschlagen statt einfach zu klemmen. */
    const mx = x + b / 2;
    const my = y + h / 2;
    if (b / h > VERHAELTNIS) h = Math.round(b / VERHAELTNIS);
    else b = Math.round(h * VERHAELTNIS);
    b = Math.min(b, B);
    h = Math.min(h, H);
    x = Math.max(0, Math.min(B - b, Math.round(mx - b / 2)));
    y = Math.max(0, Math.min(H - h, Math.round(my - h / 2)));

    for (const breite of BREITEN) {
      const kern = sharp(quelle)
        .extract({ left: x, top: y, width: b, height: h })
        .resize(breite, Math.round(breite / VERHAELTNIS), { kernel: "lanczos3" })
        .sharpen({ sigma: 0.7, m1: 0.4, m2: 0.9 });
      const datei = `${ZIEL}/${konzept}-${i + 1}`;
      await kern.clone().avif({ quality: 56, effort: 6 }).toFile(`${datei}-${breite}.avif`);
      await kern.clone().webp({ quality: 80, effort: 6 }).toFile(`${datei}-${breite}.webp`);
    }
    console.log(`${konzept}-${i + 1} (${name}): ${b}x${h} aus ${B}x${H}`);
  }
}
