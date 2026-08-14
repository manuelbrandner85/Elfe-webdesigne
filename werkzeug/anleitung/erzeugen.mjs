/* Druckt die Anleitung als PDF.

   Warum über den Browser und nicht über eine PDF-Bibliothek: Das
   Dokument soll die Schriften und die Anmutung der Marke tragen. Mit
   Chromium ist die Quelle eine HTML-Datei, die man ansehen und ändern
   kann, ohne Koordinaten zu rechnen — und Kopf- und Fußzeile samt
   Seitenzahl kommen mit.

   Aufruf: node werkzeug/anleitung/erzeugen.mjs
*/
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const HIER = dirname(fileURLToPath(import.meta.url));
const ZIEL = join(HIER, "..", "..", "public", "downloads");
mkdirSync(ZIEL, { recursive: true });

const stand = new Date().toLocaleDateString("de-DE", {
  month: "long", year: "numeric",
});

const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM || "/home/claude/chromium",
  args: ["--no-sandbox", "--font-render-hinting=none"],
});
const seite = await browser.newPage();
const fehler = [];
seite.on("console", (m) => m.type() === "error" && fehler.push(m.text()));
seite.on("requestfailed", (r) => fehler.push("Ladefehler: " + r.url()));

await seite.goto("file://" + join(HIER, "anleitung.html"), { waitUntil: "networkidle" });
await seite.evaluate(() => document.fonts.ready);

/* Die Fußzeile trägt den Stand. Ein Dokument über Preise und
   Oberflächen ohne Datum ist in einem Jahr wertlos, weil niemand mehr
   weiß, ob es noch gilt. */
await seite.pdf({
  path: join(ZIEL, "hosting-anleitung.pdf"),
  format: "A4",
  printBackground: true,
  displayHeaderFooter: true,
  headerTemplate: "<div></div>",
  footerTemplate: `
    <div style="width:100%;font-family:sans-serif;font-size:7.5pt;color:#8b857c;
                padding:0 18mm;display:flex;justify-content:space-between;">
      <span>Webdesign Elfe · Hosting selbst in der Hand · Stand ${stand}</span>
      <span class="pageNumber"></span>
    </div>`,
  margin: { top: "20mm", bottom: "22mm", left: "18mm", right: "18mm" },
});

await browser.close();

if (fehler.length) {
  console.error("Fehler beim Aufbau:", fehler.slice(0, 5));
  process.exit(1);
}
console.log("hosting-anleitung.pdf erzeugt, Stand " + stand);
