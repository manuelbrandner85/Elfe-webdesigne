/* Pfad zu einer mitgelieferten Datei.

   Warum das nötig ist: GitHub Pages liefert Projektseiten unter
   /<Repository>/ aus, Strato unter der Wurzel. Next setzt diesen Unterpfad
   von selbst — aber nur bei eigenen Bauteilen (next/image, next/link,
   /_next). Pfade, die als Zeichenkette im Code stehen — Videoquellen,
   Vorschaubilder, WebGL-Texturen — bleiben unberührt.

   Sie nachträglich in den fertigen Dateien umzuschreiben war der falsche
   Weg: Dann unterscheidet sich das ausgelieferte HTML von dem, was der
   Browser erzeugt, und React bricht die Übernahme mit einem
   Hydration-Fehler ab. Die Seite bleibt dann halb unsichtbar.

   Hier greift der Wert zur Bauzeit — auf beiden Seiten derselbe. */
const BASIS = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function medien(pfad: string): string {
  return BASIS + pfad;
}
