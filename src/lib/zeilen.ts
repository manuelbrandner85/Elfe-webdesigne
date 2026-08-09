/* Zerlegt einen Textknoten in seine sichtbaren Zeilen.

   Warum selbst gebaut statt SplitText: Für diese eine Aufgabe lädt sonst
   GSAP mit ScrollTrigger und SplitText auf jeder Seite mit — rund 60 KB,
   nur damit Überschriften zeilenweise erscheinen. Der Browser weiß
   ohnehin, wo er umbrochen hat; man muss ihn nur fragen.

   Das Verfahren: Zeichen für Zeichen die Position messen. Springt sie
   nach unten, beginnt eine neue Zeile. Danach wird jede Zeile in zwei
   Hüllen gelegt — die äußere beschneidet, die innere bewegt sich. */
export function inZeilenTeilen(el: HTMLElement): boolean {
  const text = el.textContent ?? "";
  if (!text.trim()) return false;

  const bereich = document.createRange();
  const knoten = document.createTextNode(text);
  el.textContent = "";
  el.appendChild(knoten);

  const grenzen: number[] = [];
  let letzteHoehe = -1;

  for (let i = 0; i < text.length; i++) {
    bereich.setStart(knoten, i);
    bereich.setEnd(knoten, i + 1);
    const kaesten = bereich.getClientRects();
    if (!kaesten.length) continue;
    const oben = Math.round(kaesten[0].top);
    if (letzteHoehe === -1) {
      letzteHoehe = oben;
    } else if (oben > letzteHoehe + 2) {
      grenzen.push(i);
      letzteHoehe = oben;
    }
  }

  const zeilen: string[] = [];
  let start = 0;
  for (const g of grenzen) {
    zeilen.push(text.slice(start, g));
    start = g;
  }
  zeilen.push(text.slice(start));

  if (zeilen.length === 0) return false;

  el.textContent = "";
  zeilen.forEach((z, i) => {
    const huelle = document.createElement("span");
    huelle.className = "zeile-huelle";
    const inhalt = document.createElement("span");
    inhalt.className = "zeile";
    inhalt.style.setProperty("--zeile", String(i));
    inhalt.textContent = z;
    huelle.appendChild(inhalt);
    el.appendChild(huelle);
  });

  return true;
}
