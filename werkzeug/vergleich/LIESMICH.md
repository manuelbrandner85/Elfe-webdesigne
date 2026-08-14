# Vorher-Nachher-Vergleich — Bildstrecke

Die vier Bilder in `public/images/vergleich/` sind **keine Handarbeit in
Photoshop**, sondern Aufnahmen zweier echter HTML-Seiten. Dieser Ordner
enthält die Quellen dazu, damit sie sich jederzeit neu erzeugen lassen —
etwa wenn sich Farben, Schrift oder das Foto ändern.

## Warum überhaupt Bilder

Die frühere Fassung des Bauteils zeichnete beide Auftritte als DOM nach,
bei sechs bis neun Pixeln Schriftgröße. Das war auf dem Handy unlesbar,
brach bei jeder anderen Rahmenbreite anders um und kostete bei jedem
Seitenaufbau zwei komplette Layoutdurchläufe. Als Bild liegt die Typografie
in echter Größe vor und wird erst danach verkleinert.

## Warum vier Bilder und nicht zwei

Ein auf 340 Pixel geschrumpftes Bildschirmfoto vom Rechner zeigt nichts.
Deshalb gibt es je eine eigene Fassung fürs Handy:

- `vorher-handy` entsteht bei **980 Pixeln** Sichtfeldbreite. Das ist die
  Breite, die Telefone für Seiten ohne eigene Sichtfeldangabe annehmen —
  der alte Auftritt wird also genau so klein, wie er es auf einem echten
  Telefon wäre.
- `nachher-handy` entsteht bei **390 Pixeln**, also echter Telefonbreite,
  weil die heutige Fassung dort eine eigene Ordnung hat.

Die Umschaltung im Bauteil übernimmt `<picture media>` — ohne JavaScript.

## Neu erzeugen

```bash
npm i -D playwright sharp     # nur für diesen Lauf, keine Laufzeitabhängigkeit
npx playwright install chromium

node werkzeug/vergleich/vorbereiten.mjs   # Schriften + Fotos ableiten
node werkzeug/vergleich/aufnehmen.mjs     # vier Aufnahmen -> ausgabe/
cp werkzeug/vergleich/../../ausgabe/* public/images/vergleich/
```

Danach die Platzhalter-Zeichenketten (`STANDBILD` in `BeforeAfter.tsx`)
aus der Ausgabe von `aufnehmen.mjs` übernehmen.

## Prüfen

```bash
npm run build && npx serve out -l 8099
node werkzeug/vergleich/pruefen.mjs
```

Geprüft wird über vier Breiten: keine Konsolenfehler, keine
fehlgeschlagenen Abrufe, Bilder nachweislich geladen (`naturalWidth`),
Regler reagiert auf Zeiger und Tastatur, Schnittkante bewegt sich.

## Offen

Der Werkstatt-Hero stammt derzeit aus `concept-nordwerk.webp` und ist mit
720 × 402 Pixeln für die Aufnahme zu klein — sichtbar weich. Ersatz durch
eine eigene Aufnahme in 2K steht aus.
