/* Legt Schriften und Fotos bereit, die die Mockups brauchen.

   Beides sind abgeleitete Dateien und gehoeren deshalb nicht ins
   Repository: Die Schriften liegen ohnehin in node_modules, die Fotos
   entstehen aus public/images. Was hier landet, ist reproduzierbar. */
import sharp from "sharp";
import { copyFileSync, existsSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const HIER = dirname(fileURLToPath(import.meta.url));
const WURZEL = join(HIER, "..", "..");
mkdirSync(join(HIER, "schrift"), { recursive: true });
mkdirSync(join(HIER, "fotos"), { recursive: true });

const SCHRIFTEN = [
  ["jost", "jost-latin-400-normal.woff2"],
  ["jost", "jost-latin-500-normal.woff2"],
  ["jost", "jost-latin-600-normal.woff2"],
  ["jost", "jost-latin-700-normal.woff2"],
];
for (const [paket, datei] of SCHRIFTEN) {
  copyFileSync(
    join(WURZEL, "node_modules", "@fontsource", paket, "files", datei),
    join(HIER, "schrift", datei),
  );
}

/* Quelle ist das vorhandene Werkstattbild des Konzepts Nordwerk — damit
   der Vergleich in derselben Bildwelt bleibt wie der Rest der Seite.

   Bevorzugt die hochgerechnete Fassung: Das Original hat 720 x 402 und
   wurde fuer die Aufnahme auf 3200 Pixel gestreckt — im Buehnenbild
   deutlich weich. werkzeug/hochrechnen.py liefert dieselbe Aufnahme mit
   1920 Pixeln Breite, echtes Detail statt Interpolation. */
const HOCH = join(WURZEL, "public", "images", "concept-nordwerk-gross.png");
const QUELLE = existsSync(HOCH)
  ? HOCH
  : join(WURZEL, "public", "images", "concept-nordwerk.webp");
const ZIEL = join(HIER, "fotos");

await sharp(QUELLE).resize(2400, 1350, { fit: "cover", kernel: "lanczos3" })
  .jpeg({ quality: 88 }).toFile(join(ZIEL, "hero.jpg"));

/* Dasselbe Foto, behandelt wie 2011: klein gerechnet, hart komprimiert.
   Der Unterschied im Vergleich soll aus der Gestaltung kommen, nicht aus
   zwei verschiedenen Motiven. */
await sharp(QUELLE).resize(320, 240, { fit: "cover" })
  .jpeg({ quality: 32 }).toFile(join(ZIEL, "hero-alt.jpg"));

/* Die Ausschnitte sind in Anteilen der Quelle angegeben, nicht in
   Pixeln: Sonst zeigt derselbe Aufruf bei 720 und bei 1920 Pixeln
   Quellbreite zwei verschiedene Bildausschnitte. */
const ANTEILE = [[0, 0.05, 0.42, 0.56], [0.32, 0.20, 0.42, 0.56], [0.57, 0.15, 0.42, 0.56]];
const masse = await sharp(QUELLE).metadata();
for (let i = 0; i < ANTEILE.length; i++) {
  const [al, at, ab, ah] = ANTEILE[i];
  const left = Math.round(al * masse.width);
  const top = Math.round(at * masse.height);
  const width = Math.round(ab * masse.width);
  const height = Math.round(ah * masse.height);
  const teil = () => sharp(QUELLE).extract({ left, top, width, height });
  await teil().resize(900, 675, { kernel: "lanczos3" })
    .jpeg({ quality: 86 }).toFile(join(ZIEL, `g${i + 1}.jpg`));
  await teil().resize(110, 82)
    .jpeg({ quality: 28 }).toFile(join(ZIEL, `g${i + 1}-alt.jpg`));
}

console.log("Schriften und Fotos bereit.");
