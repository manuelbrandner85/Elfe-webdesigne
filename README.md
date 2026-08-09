# Webdesign Elfe

Website von Ulrike Elferich — Webdesign, Logodesign und laufende Betreuung
für kleine Betriebe in Jork und Umgebung.

**Live:** https://www.webdesign-elfe.de

---

## Was diese Seite ausmacht

Sie ist die Arbeitsprobe der Gestalterin. Deshalb geht sie an mehreren
Stellen über das hinaus, was eine Visitenkartenseite bräuchte — aber nur
dort, wo es etwas zeigt:

- **Werkstatt-Passage** — eine Kamerafahrt durch drei Entwürfe im Raum,
  direkt gegen WebGL2 geschrieben. Kein Three.js, keine Bibliothek:
  eigene Projektions-, Sicht- und Modellmatrix, Tiefentest und Nebel.
- **Gepinnte Kapitel** — der Text bleibt stehen, die Beispiele laufen durch.
- **Goldstaub am Schnitt** — beim Vorher-Nachher-Vergleich zerfällt der
  alte Auftritt zu Gold, aus dem der neue entsteht.
- **Zeilenweise Überschriften** — ohne Bewegungsbibliothek: Der Browser
  kennt seine Zeilenumbrüche, man muss ihn nur fragen.

## Grundsätze im Code

**Eine Eigenschaft, ein System.** GSAP bewegt, Lenis glättet nur, CSS
übernimmt einfache Verläufe, React verwaltet Zustand. Keine Eigenschaft
wird von zwei Systemen angefasst.

**Bewegung ist abschaltbar.** Alles fragt `useReduzierteBewegung()`. Bei
„Bewegung reduzieren" im Betriebssystem entfallen Eröffnung,
Zeilenauftritte, Scroll-Glättung und die WebGL-Passage — die Seite bleibt
vollständig lesbar.

**Keine fremden Server.** Schriften liegen im Projekt, keine Cookies, kein
Tracking, keine eingebetteten Dienste. Nachgemessen: null Verbindungen nach
außen.

**Schweres lädt spät.** GSAP kommt erst, wenn die gepinnten Kapitel in
Sichtweite sind. Erstes Bild: rund 220 KB JavaScript (gzip).

## Stack

| | |
|---|---|
| Next.js 16 | statischer Export (`output: "export"`) |
| React 19 · TypeScript | |
| Tailwind CSS v4 | |
| GSAP + ScrollTrigger | nur für gepinnte Passagen, bedarfsweise geladen |
| Lenis | Scroll-Glättung, eigener Taktgeber |
| WebGL2 | eigene Umsetzung, ohne Bibliothek |
| Canvas 2D | Goldstaub |

## Entwickeln

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # erzeugt out/
```

Der Bau schreibt nach `out/` — reines HTML, CSS und JavaScript, ohne
Server. Dieser Ordner wird bei Strato in das Web-Verzeichnis geladen.

## Aufbau

```
src/
├── app/            Seiten: Start, Pakete, Impressum, Datenschutz
├── components/     Bausteine (ein Zweck je Datei)
├── lib/            Bewegungsabfrage, Zeilenteiler, Scrollmotor
└── data/content.ts Alle Texte an einer Stelle
```

Texte, Preise und Pakete stehen ausschließlich in `src/data/content.ts`.
Wer Inhalte ändert, fasst keine Komponente an.

## Rechtliches

Impressum nach § 5 DDG und Datenschutzerklärung sind gepflegt und
beschreiben den gemessenen Ist-Zustand, keine Vorlage. Der Hinweis auf die
EU-Streitschlichtungsplattform fehlt bewusst — sie wurde zum 20. Juli 2025
abgeschaltet, ein Link dorthin gilt als irreführend.
