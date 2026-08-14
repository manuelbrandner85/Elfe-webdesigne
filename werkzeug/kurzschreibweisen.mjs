/* Sucht Variablen, die in Kurzschreibweisen stecken und leer sein koennten.

   Anlass: `--kurve-haupt: var(--kurve-haupt)` - eine Variable, die sich
   selbst als Wert setzt, ist nach Norm ungueltig und wird leer. In einer
   LANGSCHREIBWEISE faellt sie dann nur auf den Anfangswert zurueck; in
   einer KURZSCHREIBWEISE faellt die GANZE Deklaration weg. Genau deshalb
   waren sechs Abschnittsueberschriften unsichtbar, waehrend die
   Scroll-Auftritte daneben scheinbar liefen.

   Der Fehler ist lautlos: kein Bau bricht ab, keine Warnung, nichts im
   Protokoll. Nur ein Element, das nicht da ist. Deshalb dieses Skript.

   Geprueft wird:
   1. Selbstbezuege - direkt und ueber Umwege
   2. Variablen, die in einer Kurzschreibweise stehen, aber nirgends
      definiert sind
   3. Kurzschreibweisen mit Variablen ohne Ersatzwert - dort waere ein
      Ersatzwert die billige Versicherung

   Aufruf: node werkzeug/kurzschreibweisen.mjs
*/
import { readFileSync } from "node:fs";

const DATEI = "src/app/globals.css";
const css = readFileSync(DATEI, "utf-8");

/* Kurzschreibweisen, bei denen eine leere Variable alles mitreisst. */
const KURZ = ["animation", "transition", "background", "border", "font",
              "grid-area", "flex", "mask", "outline", "box-shadow", "inset"];

const definiert = new Map();
for (const m of css.matchAll(/^\s*(--[a-z0-9-]+)\s*:\s*([^;]+);/gim)) {
  definiert.set(m[1], m[2].trim());
}

const fehler = [];

// 1) Selbstbezug, auch ueber Umwege
const aufloesen = (name, kette = new Set()) => {
  if (kette.has(name)) return [...kette, name];
  const wert = definiert.get(name);
  if (!wert) return null;
  kette.add(name);
  for (const v of wert.matchAll(/var\(\s*(--[a-z0-9-]+)/gi)) {
    const r = aufloesen(v[1], new Set(kette));
    if (r) return r;
  }
  return null;
};
for (const name of definiert.keys()) {
  const ring = aufloesen(name);
  if (ring) fehler.push(`SELBSTBEZUG  ${name}  (${ring.join(" -> ")})`);
}

// 2 und 3) Variablen in Kurzschreibweisen
const zeilen = css.split("\n");
zeilen.forEach((z, i) => {
  const m = z.match(/^\s*([a-z-]+)\s*:\s*(.+);/i);
  if (!m) return;
  const [, eigenschaft, wert] = m;
  if (!KURZ.includes(eigenschaft)) return;
  for (const v of wert.matchAll(/var\(\s*(--[a-z0-9-]+)\s*(,)?/gi)) {
    const name = v[1];
    const hatErsatz = Boolean(v[2]);
    /* Aus JavaScript gesetzte Variablen stehen nicht in der Datei. Sie
       sind damit nicht falsch, aber besonders anfaellig: Faellt das
       Skript aus, ist die Variable leer - und die Kurzschreibweise
       verschwindet. Fuer sie ist ein Ersatzwert Pflicht. */
    const ausSkript = ["--logo-quelle"].includes(name);
    const bekannt = definiert.has(name) || ausSkript ||
                    name.startsWith("--color") || name.startsWith("--tw");
    if (!bekannt) {
      fehler.push(`UNDEFINIERT  ${name} in "${eigenschaft}" (Zeile ${i + 1})`);
    } else if (!hatErsatz) {
      fehler.push(`OHNE ERSATZWERT  ${name} in "${eigenschaft}" (Zeile ${i + 1})`);
    }
  }
});

console.log(`${definiert.size} Variablen, ${zeilen.length} Zeilen geprueft\n`);
if (fehler.length) {
  console.log("FEHLER:");
  for (const f of fehler) console.log("  " + f);
} else {
  console.log("Keine leeren Variablen in Kurzschreibweisen.");
}
process.exit(fehler.length ? 1 : 0);
