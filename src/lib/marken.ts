/* Zentrale Marken für Bewegung, Ebenen und Kurven.

   Vorher lagen diese Werte verstreut im Quellcode: acht verschiedene
   z-Index-Zahlen ohne erkennbare Ordnung, dieselbe Kurve in zwei
   Schreibweisen, siebzehn Stellen mit `duration: 0.6`. Solche Zahlen sind
   einzeln harmlos und in Summe der Grund, warum ein Auftritt mit der Zeit
   auseinanderfällt: Niemand weiß mehr, ob 0.7 Absicht war oder Zufall.

   Die Werte sind nach Zweck benannt, nicht nach Größe. `EBENE.vorhang`
   sagt, wofür es steht — `z-[400]` sagt nur, dass es größer ist als 300. */

/* ---------- Bewegung ----------
   Vier Stufen, nach Aufgabe getrennt. Wer eine neue Animation baut, wählt
   die Stufe, nicht die Zahl. */
export const DAUER = {
  /** Hover, Fokus, magnetische Anziehung — muss unmittelbar wirken */
  mikro: 0.2,
  /** Karten, Schaltflächen, Seitenübergänge */
  ui: 0.4,
  /** Inhalte, die beim Scrollen erscheinen */
  inhalt: 0.6,
  /** Überschriften, Kamerafahrten, Eröffnung */
  filmisch: 0.9,
} as const;

/* Millisekunden für CSS und Zeitgeber — dieselben Werte, andere Einheit */
export const DAUER_MS = {
  mikro: DAUER.mikro * 1000,
  ui: DAUER.ui * 1000,
  inhalt: DAUER.inhalt * 1000,
  filmisch: DAUER.filmisch * 1000,
} as const;

/* ---------- Kurven ----------
   Eine Hauptkurve für alles: schneller Antritt, langes Ausschwingen. Das
   ist die Bewegung, die physikalisch plausibel wirkt — Dinge beschleunigen
   schnell und kommen langsam zur Ruhe.

   `weich` ist minimal härter und bleibt Zeilenaufritten vorbehalten, wo der
   Text sonst nachzufedern scheint. */
export const KURVE = {
  haupt: "cubic-bezier(0.22, 1, 0.36, 1)",
  weich: "cubic-bezier(0.16, 1, 0.3, 1)",
} as const;

/* Dieselben Kurven als Stützpunkte für Bewegungsbibliotheken */
export const KURVE_PUNKTE = {
  haupt: [0.22, 1, 0.36, 1],
  weich: [0.16, 1, 0.3, 1],
} as const;

/* ---------- Ebenen ----------
   In Hunderterschritten und nach Zweck benannt. Die Lücken dazwischen sind
   Absicht: Wer später etwas einschieben muss, braucht Platz und muss nicht
   alles umnummerieren. */
export const EBENE = {
  /** Hintergründe innerhalb eines Abschnitts */
  grund: 1,
  /** Überlagerungen in Karten, etwa der Goldstaub am Schnitt */
  ueberlagerung: 10,
  /** Feste Kopfzeile */
  kopfzeile: 100,
  /** Feste Anfrage-Leiste auf schmalen Geräten */
  leiste: 140,
  /** Fortschrittsbalken — liegt über der Kopfzeile */
  fortschritt: 150,
  /** Aufklappmenü */
  menue: 200,
  /** Dialoge */
  dialog: 300,
  /** Eröffnungsvorhang — muss alles verdecken */
  vorhang: 400,
} as const;

/* ---------- Auslöseschwellen ----------
   Wie früh Inhalte erscheinen, wenn sie ins Bild kommen. Positiv heißt:
   auslösen, bevor das Element den Rand erreicht. Negative Werte ließen
   Blöcke beim schnellen Scrollen halbtransparent stehen. */
export const SCHWELLE = {
  /** Standard für Inhalte */
  inhalt: "80px",
  /** Für hohe Abschnitte, die früher greifen sollen */
  abschnitt: "5%",
  /** Für schwere Bausteine, die vorgeladen werden müssen */
  vorladen: "500px",
} as const;

/* ---------- Gerätestufen ----------
   Nicht jedes Gerät verkraftet dieselbe Last. Die Einteilung erfolgt nach
   messbaren Merkmalen, nicht nach Bildschirmbreite allein: Ein Tablet mit
   schwacher Grafikeinheit ist kein kleiner Rechner. */
export type Geraetestufe = "hoch" | "mittel" | "gering";

export function geraetestufeErmitteln(): Geraetestufe {
  if (typeof window === "undefined") return "mittel";

  const schmal = window.innerWidth < 768;
  const kerne = navigator.hardwareConcurrency ?? 4;
  /* Nicht überall verfügbar, deshalb vorsichtig gelesen */
  const speicher =
    (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 4;

  if (schmal || kerne <= 4 || speicher <= 2) return "gering";
  if (kerne <= 8 || speicher <= 4) return "mittel";
  return "hoch";
}

/* Was die Stufen konkret bedeuten */
export const QUALITAET = {
  hoch: { teilchen: 260, punktdichte: 1.6, magnetik: true },
  mittel: { teilchen: 160, punktdichte: 1.4, magnetik: true },
  gering: { teilchen: 90, punktdichte: 1, magnetik: false },
} as const;
