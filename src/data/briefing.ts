/* Fragen und Texte des Projekt-Briefings.

   WARUM SECHS SCHRITTE UND NICHT ZEHN

   Die Vorlage sah zehn Schritte mit rund sechzig Fragen vor. Der eigene
   Anspruch lautete: „darf sich nicht wie Arbeit anfühlen." Sechzig
   Fragen fühlen sich nach Arbeit an, weil sie welche sind. Verdichtet
   auf sechs Schritte — Zielgruppe und Ziele gehören zusammen,
   Funktionen und Auffindbarkeit ebenso.

   WAS GESTRICHEN IST

   Der Technikschritt mit der Zugriffsmatrix (wer hat Zugang zu Domain,
   Hosting, CMS, E-Mail, Analytics). Das klärt ein Telefonat in fünf
   Minuten, und im Formular beantwortet es ohnehin kaum jemand richtig.
   Geblieben ist die eine Frage, die wirklich vorab hilft: Womit läuft
   die Seite heute.

   ZUGANGSDATEN

   Werden nirgends abgefragt. Der Hinweis darauf steht sichtbar im
   Formular — nicht als Fußnote, sondern damit niemand auf die Idee
   kommt, ein Passwort in ein Textfeld zu schreiben. */

export type Feldart = "text" | "lang" | "einfach" | "mehrfach" | "datum";

export type Feld = {
  id: string;
  frage: string;
  art: Feldart;
  hinweis?: string;
  platzhalter?: string;
  optionen?: string[];
  pflicht?: boolean;
  /* Zeigt das Feld nur, wenn ein anderes Feld einen bestimmten Wert hat. */
  wenn?: { id: string; ist: string };
};

export type Schritt = { titel: string; hinweis: string; felder: Feld[] };

export const briefing = {
  kicker: "Projekt-Briefing",
  h1: "Erzählen Sie mir von Ihrem Betrieb",
  intro:
    "Sechs kurze Schritte, überwiegend zum Anklicken — etwa fünf bis zehn Minuten. Ihre Antworten bleiben beim Ausfüllen auf Ihrem Gerät gespeichert; Sie können also pausieren und später weitermachen.",

  hinweisZugang:
    "Bitte tragen Sie hier keine Passwörter oder Zugangsdaten ein. Falls ich welche brauche, melde ich mich mit einem sicheren Weg dafür.",

  schritte: [
    {
      titel: "Ihr Betrieb",
      hinweis: "Damit ich verstehe, worum es geht.",
      felder: [
        { id: "firma", frage: "Wie heißt Ihr Betrieb?", art: "text", pflicht: true, platzhalter: "Name des Unternehmens" },
        { id: "angebot", frage: "Was bieten Sie an?", art: "lang", platzhalter: "Zwei, drei Sätze genügen — so, wie Sie es einem Nachbarn erklären würden." },
        { id: "unterschied", frage: "Was machen Sie anders als andere in Ihrer Branche?", art: "lang", hinweis: "Der wichtigste Satz für die spätere Startseite.", platzhalter: "Zum Beispiel: seit drei Generationen im Ort, eigene Werkstatt, Festpreise." },
        { id: "worte", frage: "Ihr Betrieb in drei bis fünf Worten", art: "text", platzhalter: "bodenständig, handwerklich, verlässlich" },
        { id: "hatSeite", frage: "Gibt es schon eine Website?", art: "einfach", optionen: ["Ja", "Nein"] },
        { id: "seiteUrl", frage: "Wie lautet die Adresse?", art: "text", platzhalter: "ihr-betrieb.de", wenn: { id: "hatSeite", ist: "Ja" } },
        { id: "uebernehmen", frage: "Was davon soll erhalten bleiben?", art: "lang", platzhalter: "Texte, Bilder, einzelne Seiten — oder nichts.", wenn: { id: "hatSeite", ist: "Ja" } },
      ],
    },
    {
      titel: "Kunden und Ziele",
      hinweis: "Für wen die Seite arbeiten soll.",
      felder: [
        { id: "kundenart", frage: "Wer sind Ihre Kunden?", art: "einfach", optionen: ["Privatkunden", "Geschäftskunden", "Beides", "Andere"] },
        { id: "problem", frage: "Welches Problem lösen Sie für diese Kunden?", art: "lang", platzhalter: "Womit kommen die Leute zu Ihnen? Was wollen sie loswerden?" },
        { id: "ziele", frage: "Was soll die Website vor allem erreichen?", art: "mehrfach", hinweis: "Mehrfachauswahl — aber bitte nicht alles.", optionen: ["Mehr Anfragen bekommen", "Mehr Anrufe bekommen", "Termine bekommen", "Produkte verkaufen", "Leistungen zeigen", "Professioneller auftreten", "Bei Google gefunden werden", "Anderes"] },
        { id: "handlung", frage: "Was soll ein Besucher tun, bevor er die Seite verlässt?", art: "einfach", optionen: ["Anrufen", "Formular ausfüllen", "Termin buchen", "Schreiben oder WhatsApp", "Etwas kaufen", "Noch offen"] },
        { id: "problemAlt", frage: "Was stört Sie an der heutigen Seite am meisten?", art: "lang", platzhalter: "Sieht veraltet aus, funktioniert nicht auf dem Handy, bringt keine Anfragen …", wenn: { id: "hatSeite", ist: "Ja" } },
      ],
    },
    {
      titel: "Seiten und Inhalte",
      hinweis: "Was auf die Seite kommt.",
      felder: [
        { id: "seiten", frage: "Welche Seiten brauchen Sie?", art: "mehrfach", optionen: ["Startseite", "Über uns", "Leistungen", "Einzelne Leistungsseiten", "Referenzen", "Galerie", "Team", "Häufige Fragen", "Blog", "Kontakt", "Stellenangebote", "Shop", "Andere"] },
        { id: "texte", frage: "Wer schreibt die Texte?", art: "einfach", optionen: ["Ich selbst", "Bitte übernehmen Sie das", "Gemeinsam", "Noch offen"] },
        { id: "vorhanden", frage: "Was ist schon da?", art: "mehrfach", hinweis: "Nur ankreuzen, was tatsächlich vorliegt.", optionen: ["Texte", "Eigene Fotos", "Fotos vom Fotografen", "Logo", "Videos", "Prospekte oder PDFs", "Nichts davon"] },
      ],
    },
    {
      titel: "Gestaltung",
      hinweis: "Damit der Entwurf zu Ihnen passt.",
      felder: [
        { id: "wirkung", frage: "Wie soll Ihre Seite wirken?", art: "mehrfach", hinweis: "Höchstens drei bis vier — sonst wird es beliebig.", optionen: ["Modern", "Schlicht", "Hochwertig", "Seriös", "Elegant", "Kreativ", "Lebendig", "Vertrauenswürdig", "Technisch", "Persönlich", "Bodenständig"] },
        { id: "marke", frage: "Was gibt es bereits an Erscheinungsbild?", art: "mehrfach", optionen: ["Logo", "Feste Farben", "Feste Schriften", "Gestaltungshandbuch", "Nichts davon"] },
        { id: "vorbilder", frage: "Welche Websites gefallen Ihnen?", art: "lang", hinweis: "Zwei bis drei genügen — gern mit einem Wort dazu, was Ihnen daran gefällt.", platzhalter: "beispiel.de — die ruhigen Bilder\nnochwas.de — die klare Preisübersicht" },
        { id: "abneigung", frage: "Was möchten Sie auf keinen Fall?", art: "lang", hinweis: "Oft hilfreicher als alles andere.", platzhalter: "Keine Schnörkel, keine Stockfotos mit lachenden Menschen, nichts Grelles …" },
      ],
    },
    {
      titel: "Funktionen und Auffindbarkeit",
      hinweis: "Was die Seite können muss.",
      felder: [
        { id: "funktionen", frage: "Welche Funktionen brauchen Sie?", art: "mehrfach", optionen: ["Kontaktformular", "Terminbuchung", "Newsletter", "Blog", "Suche", "Mehrsprachig", "Onlineshop", "Kundenbereich", "Karte / Anfahrt", "Soziale Netzwerke", "Bewertungen", "WhatsApp", "Downloads", "Rechner oder Konfigurator", "Andere"] },
        { id: "mussFunktion", frage: "Was davon ist unverzichtbar?", art: "text", platzhalter: "Wenn Sie sich für eines entscheiden müssten." },
        { id: "gefunden", frage: "Wofür sollen Sie bei Google gefunden werden?", art: "lang", platzhalter: "Leistungen und Orte, zum Beispiel: Zimmerei Lübeck, Dachstuhl Altbau Stormarn" },
        { id: "rankings", frage: "Gibt es bestehende Google-Platzierungen, die erhalten bleiben müssen?", art: "einfach", optionen: ["Ja", "Nein", "Weiß ich nicht"], wenn: { id: "hatSeite", ist: "Ja" } },
      ],
    },
    {
      titel: "Zeitplan und Material",
      hinweis: "Zum Schluss das Organisatorische.",
      felder: [
        { id: "start", frage: "Wann möchten Sie starten?", art: "einfach", optionen: ["So bald wie möglich", "In ein bis zwei Monaten", "In drei bis sechs Monaten", "Noch offen"] },
        { id: "terminFest", frage: "Gibt es einen festen Termin, zu dem die Seite stehen muss?", art: "einfach", optionen: ["Ja", "Nein"] },
        { id: "terminDatum", frage: "Zu welchem Datum?", art: "datum", wenn: { id: "terminFest", ist: "Ja" } },
        { id: "terminGrund", frage: "Was hängt an diesem Termin?", art: "text", platzhalter: "Messe, Eröffnung, Saisonstart …", wenn: { id: "terminFest", ist: "Ja" } },
        { id: "system", frage: "Womit läuft Ihre Seite heute?", art: "einfach", optionen: ["WordPress", "Wix", "Jimdo", "Shopify", "Squarespace", "Weiß ich nicht", "Etwas anderes"], wenn: { id: "hatSeite", ist: "Ja" } },
        { id: "entscheider", frage: "Wer entscheidet am Ende?", art: "text", hinweis: "Nur wenn es nicht Sie selbst sind.", platzhalter: "Name, Rolle" },
        { id: "materialLink", frage: "Wo liegt Ihr Material?", art: "text", hinweis: "Falls Sie Logo, Bilder oder Texte schon irgendwo abgelegt haben — ein Link genügt (WeTransfer, Dropbox, Drive). Sonst melde ich mich dafür.", platzhalter: "Link zum Ordner oder zur Übertragung" },
        { id: "sonstiges", frage: "Gibt es sonst etwas, das ich wissen sollte?", art: "lang", platzhalter: "Freiwillig." },
      ],
    },
  ] as Schritt[],

  kontakt: {
    titel: "Ihre Angaben",
    hinweis: "Damit ich das Briefing zuordnen kann.",
  },

  knopf: { weiter: "Weiter", zurueck: "Zurück", senden: "Briefing abschicken" },

  danke: {
    titel: "Ihr Briefing ist angekommen",
    text:
      "Vielen Dank — das war schon der aufwendigste Teil. Ich gehe Ihre Angaben durch und bereite mich gezielt auf Ihr Projekt vor. Eine Bestätigung liegt gleich in Ihrem Postfach.",
    terminTitel: "Möchten Sie direkt einen Termin?",
    terminText:
      "Für das Erstgespräch brauchen wir etwa dreißig Minuten. Sie können auch einfach warten, bis ich mich melde.",
    terminKnopf: "Erstgespräch vereinbaren",
    /* Platzhalter: Sobald ein Kalender eingerichtet ist (Cal.com,
       Calendly oder ein eigener), kommt die Adresse hier hinein. Bis
       dahin führt der Knopf auf den Kontaktbereich. */
    terminZiel: "",
  },
};
