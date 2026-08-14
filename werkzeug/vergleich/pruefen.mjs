/* Browserprüfung des Vergleichs.

   Geprüft wird nicht „sieht gut aus“, sondern: Laden ohne Fehler, Regler
   reagiert auf Zeiger und Tastatur, Schnittkante bewegt sich tatsächlich,
   Bilder werden geladen, und der Abschnitt bricht auf keiner Breite. */
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const ZIEL = "/home/claude/work/pruefung";
mkdirSync(ZIEL, { recursive: true });

const GROESSEN = [
  ["gross", 1920, 1080],
  ["laptop", 1440, 900],
  ["tablet", 834, 1112],
  ["handy", 390, 844],
];

const browser = await chromium.launch({
  executablePath: "/home/claude/chromium",
  args: ["--no-sandbox", "--force-color-profile=srgb"],
});

let fehlerhaft = false;

for (const [name, breite, hoehe] of GROESSEN) {
  const seite = await browser.newPage({
    viewport: { width: breite, height: hoehe },
    deviceScaleFactor: 2,
  });
  const meldungen = [];
  seite.on("console", (m) => m.type() === "error" && meldungen.push("Konsole: " + m.text()));
  seite.on("pageerror", (e) => meldungen.push("Laufzeit: " + e.message));
  seite.on("requestfailed", (r) =>
    meldungen.push("Abruf: " + r.url().split("/").pop() + " — " + r.failure()?.errorText),
  );

  await seite.goto("http://127.0.0.1:8099/", { waitUntil: "load" });

  const abschnitt = seite.locator('section[aria-label="Vorher-Nachher-Vergleich"]');
  await abschnitt.scrollIntoViewIfNeeded();
  await seite.waitForTimeout(1200);

  const regler = abschnitt.getByRole("slider");
  const rahmen = abschnitt.locator("div.panel");
  const kasten = await rahmen.boundingBox();

  /* Bilder wirklich geladen? naturalWidth ist der einzige ehrliche Beleg. */
  const bilder = await abschnitt.locator("img").evaluateAll((els) =>
    els.map((e) => ({ src: e.currentSrc.split("/").pop(), breite: e.naturalWidth })),
  );
  const ungeladen = bilder.filter((b) => b.breite === 0);

  /* Zeiger: von der Mitte nach rechts ziehen */
  const vorher = await regler.getAttribute("aria-valuenow");
  await seite.mouse.move(kasten.x + kasten.width * 0.4, kasten.y + kasten.height / 2);
  await seite.mouse.down();
  await seite.mouse.move(kasten.x + kasten.width * 0.75, kasten.y + kasten.height / 2, { steps: 12 });
  await seite.mouse.up();
  await seite.waitForTimeout(200);
  const nachZug = Number(await regler.getAttribute("aria-valuenow"));

  /* Tastatur */
  await regler.focus();
  await seite.keyboard.press("Home");
  await seite.waitForTimeout(120);
  const nachHome = Number(await regler.getAttribute("aria-valuenow"));
  await seite.keyboard.press("ArrowRight");
  await seite.waitForTimeout(120);
  const nachPfeil = Number(await regler.getAttribute("aria-valuenow"));

  /* Schnittkante: schreibt der Bewegungswert wirklich in den Stil? */
  await seite.keyboard.press("End");
  await seite.waitForTimeout(150);
  const schnitt = await abschnitt
    .locator("div[style*='clip-path'], div[style*='clipPath']")
    .first()
    .evaluate((e) => getComputedStyle(e).clipPath);

  await seite.mouse.move(kasten.x + kasten.width / 2, kasten.y + kasten.height / 2);
  await seite.screenshot({ path: `${ZIEL}/${name}.png` });

  const gut =
    meldungen.length === 0 &&
    ungeladen.length === 0 &&
    nachZug > 70 &&
    nachHome === 0 &&
    nachPfeil === 2 &&
    /inset\(0(px)? 0(px)?/.test(schnitt);

  console.log(
    `${gut ? "OK " : "!! "}${name} ${breite}×${hoehe}  Zug ${vorher}→${nachZug}  Home ${nachHome}  Pfeil ${nachPfeil}  Schnitt ${schnitt}`,
  );
  if (bilder.length) console.log(`     Bilder: ${bilder.map((b) => b.src + " " + b.breite + "px").join(", ")}`);
  if (meldungen.length) console.log("     " + meldungen.slice(0, 4).join("\n     "));
  if (!gut) fehlerhaft = true;

  await seite.close();
}

await browser.close();
process.exit(fehlerhaft ? 1 : 0);
