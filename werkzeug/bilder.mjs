/* Legt zu jedem ausgelieferten Bild eine AVIF-Fassung daneben.

   Warum nicht einfach next/image: Der Bau ist ein statischer Export mit
   `images.unoptimized`. next/image gibt dann ein schlichtes <img> aus und
   kann kein zweites Format anbieten. Zwei Formate brauchen <picture> —
   deshalb das eigene Bauteil Bild.tsx und dieses Skript dazu.

   Warum AVIF und nicht nur WebP: Bei den Fotos dieser Seite liegt der
   Gewinn zwischen 30 und 55 Prozent. Beim Logo — feine metallische
   Koernung mit Transparenz, also der ungeguenstigste Fall — sind es
   161 auf 76 KB. Das ist die groesste einzelne Datei der Startseite.

   Gueten sind nach Inhalt getrennt: Fotos vertragen mehr Verlust als
   Grafik mit harten Kanten, und Bilder mit Transparenz brauchen einen
   eigenen Wert, weil AVIF die Alphaebene getrennt kodiert.

   Aufruf: node werkzeug/bilder.mjs
*/
import sharp from "sharp";
import { readdirSync, statSync, existsSync } from "node:fs";
import { join, extname } from "node:path";

const WURZEL = "public/images";

/* Diese liegen bereits als AVIF vor (eigene Aufnahmestrecke) und werden
   von werkzeug/vergleich/aufnehmen.mjs erzeugt. */
const AUSGENOMMEN = /^vergleich\//;

const dateien = [];
const sammeln = (ordner, praefix = "") => {
  for (const eintrag of readdirSync(ordner)) {
    const pfad = join(ordner, eintrag);
    if (statSync(pfad).isDirectory()) sammeln(pfad, praefix + eintrag + "/");
    else if (/\.(webp|jpe?g|png)$/i.test(eintrag)) dateien.push({ pfad, rel: praefix + eintrag });
  }
};
sammeln(WURZEL);

let vorher = 0;
let nachher = 0;
let uebersprungen = 0;

for (const { pfad, rel } of dateien) {
  if (AUSGENOMMEN.test(rel)) { uebersprungen++; continue; }
  const ziel = pfad.replace(extname(pfad), ".avif");
  const bild = sharp(pfad);
  const m = await bild.metadata();

  /* Transparenz: eigener Wert, sonst franst die Alphakante aus.
     Sehr grosse Blaetter (Bildstreifen) bleiben unangetastet — sie werden
     nicht als <img> ausgeliefert, sondern als Textur gelesen. */
  if (m.width > 4000) { uebersprungen++; continue; }
  const guete = m.hasAlpha ? 50 : 52;

  await sharp(pfad).avif({ quality: guete, effort: 6, chromaSubsampling: "4:2:0" }).toFile(ziel);

  const a = statSync(pfad).size;
  const b = statSync(ziel).size;
  vorher += a;
  nachher += b;
  const zeichen = b < a ? "" : "  (groesser — AVIF bringt hier nichts)";
  console.log(
    `${rel.padEnd(32)} ${String((a / 1024).toFixed(0)).padStart(5)} KB -> ` +
    `${String((b / 1024).toFixed(0)).padStart(5)} KB${zeichen}`,
  );
}

console.log(
  `\n${dateien.length - uebersprungen} Bilder: ` +
  `${(vorher / 1024).toFixed(0)} KB -> ${(nachher / 1024).toFixed(0)} KB ` +
  `(${(100 - (nachher / vorher) * 100).toFixed(0)} % weniger), ${uebersprungen} uebersprungen`,
);
