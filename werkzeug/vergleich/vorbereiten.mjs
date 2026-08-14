/* Legt Schriften und Fotos bereit, die die Mockups brauchen.

   Beides sind abgeleitete Dateien und gehoeren deshalb nicht ins
   Repository: Die Schriften liegen ohnehin in node_modules, die Fotos
   entstehen aus public/images. Was hier landet, ist reproduzierbar. */
import sharp from "sharp";
import { copyFileSync, mkdirSync } from "node:fs";
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
   der Vergleich in derselben Bildwelt bleibt wie der Rest der Seite. */
const QUELLE = join(WURZEL, "public", "images", "concept-nordwerk.webp");
const ZIEL = join(HIER, "fotos");

await sharp(QUELLE).resize(2400, 1350, { fit: "cover", kernel: "lanczos3" })
  .jpeg({ quality: 88 }).toFile(join(ZIEL, "hero.jpg"));

/* Dasselbe Foto, behandelt wie 2011: klein gerechnet, hart komprimiert.
   Der Unterschied im Vergleich soll aus der Gestaltung kommen, nicht aus
   zwei verschiedenen Motiven. */
await sharp(QUELLE).resize(320, 240, { fit: "cover" })
  .jpeg({ quality: 32 }).toFile(join(ZIEL, "hero-alt.jpg"));

const AUSSCHNITTE = [[0, 20, 300, 225], [230, 80, 300, 225], [410, 60, 300, 225]];
for (let i = 0; i < AUSSCHNITTE.length; i++) {
  const [left, top, width, height] = AUSSCHNITTE[i];
  const teil = () => sharp(QUELLE).extract({ left, top, width, height });
  await teil().resize(900, 675, { kernel: "lanczos3" })
    .jpeg({ quality: 86 }).toFile(join(ZIEL, `g${i + 1}.jpg`));
  await teil().resize(110, 82)
    .jpeg({ quality: 28 }).toFile(join(ZIEL, `g${i + 1}-alt.jpg`));
}

console.log("Schriften und Fotos bereit.");
