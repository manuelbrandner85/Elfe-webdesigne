import { medien } from "@/lib/pfad";
export const site = {
  name: "Webdesign Elfe",
  url: "https://webdesign-elfe.de",
  title: "Webdesign Elfe – Webdesign & Logodesign für kleine Unternehmen",
  description:
    "Individuelles Webdesign, Logodesign und Websitebetreuung aus einer Hand. Für Handwerksbetriebe, Selbstständige und Existenzgründer – persönlich betreut, mobiloptimiert und suchmaschinenfreundlich.",
  keywords: [
    "Webdesign",
    "Webdesigner",
    "Logodesign",
    "Website erstellen lassen",
    "Homepage erstellen lassen",
    "Webdesign für Handwerksbetriebe",
    "Website für Selbstständige",
    "Existenzgründer Website",
    "Onepager",
    "Website Relaunch",
  ],
};

export const nav = [
  { href: "#leistungen", label: "Leistungen" },
  { href: "#ablauf", label: "Ablauf" },
  { href: "#zielgruppen", label: "Für wen" },
  { href: "#portfolio", label: "Referenzen" },
  { href: "#preise", label: "Preise" },
  { href: "#faq", label: "FAQ" },
  { href: "#ueber", label: "Über mich" },
  { href: "#kontakt", label: "Kontakt" },
];

export const hero = {
  eyebrow: "Webdesign & Logodesign aus einer Hand",
  lede:
    "Vom ersten Logoentwurf bis zur fertigen, suchmaschinenfreundlichen Website entwickle ich Ihren digitalen Auftritt aus einer Hand – persönlich betreut, technisch sauber umgesetzt und auf jedem Endgerät überzeugend.",
  proof: [
    "Persönliche Betreuung",
    "Feste Preise",
    "Mobil optimiert",
    "Auffindbar bei Google",
  ],
};

/* Optionales Foto je Leistung. Sobald eine Datei unter
   /images/leistung-*.webp liegt, hier eintragen — sonst zeigt die Karte
   automatisch das Goldmedaillon mit Symbol. */
export type Service = {
  icon: string;
  title: string;
  text: string;
  points: string[];
  image?: string;
  href?: string;
};

export const services: Service[] = [
  {
    icon: "sparkles",
    href: "/logodesign",
    title: "Logo & Corporate Design",
    image: medien("/images/tiles/foto-leistung-logo-640.webp"),
    text:
      "Ein unverwechselbares Erscheinungsbild als Fundament Ihrer Marke: Wortmarke, Farbwelt und Typografie – konsequent aufeinander abgestimmt.",
    points: ["Logoentwicklung", "Farb- & Schriftkonzept", "Geschäftsausstattung"],
  },
  {
    icon: "layout",
    href: "/webdesign",
    title: "Webdesign",
    image: medien("/images/tiles/foto-leistung-webdesign-640.webp"),
    text:
      "Individuelles Seitendesign statt Baukasten von der Stange. Klar strukturiert, auf Ihre Zielgruppe zugeschnitten und auf jedem Bildschirm stimmig.",
    points: ["Individuelles Design", "Responsive Layout", "Barrierearme Umsetzung"],
  },
  {
    icon: "code",
    title: "Entwicklung & Technik",
    image: medien("/images/tiles/foto-leistung-technik-640.webp"),
    href: "/entwicklung",
    text:
      "Sauber programmierte Websites mit kurzen Ladezeiten, sicherer Technik und einer Struktur, die Suchmaschinen zuverlässig erfassen können.",
    points: ["Schnelle Ladezeiten", "SEO-Grundlagen", "SSL & DSGVO-konform"],
  },
  {
    icon: "sun",
    title: "Pflege & Betreuung",
    image: medien("/images/tiles/foto-leistung-betreuung-640.webp"),
    href: "/betreuung",
    text:
      "Nach dem Launch bleibe ich Ihr fester Ansprechpartner: Inhalte aktualisieren, Erweiterungen umsetzen, Technik im Blick behalten.",
    points: ["Inhaltspflege", "Updates & Backups", "Erweiterungen"],
  },
];

export const process = [
  {
    number: "01",
    title: "Erstgespräch",
    text:
      "Wir klären in Ruhe, was Ihre Website leisten soll, wen sie erreichen muss und welches Budget realistisch ist. Kostenlos und unverbindlich.",
  },
  {
    number: "02",
    title: "Konzept & Design",
    text:
      "Sie erhalten einen Entwurf mit Struktur, Gestaltung und – auf Wunsch – passendem Logo. Angepasst wird, bis es stimmig ist.",
  },
  {
    number: "03",
    title: "Umsetzung",
    text:
      "Die Website wird sauber programmiert, für Suchmaschinen aufbereitet und auf allen gängigen Geräten und Browsern getestet.",
  },
  {
    number: "04",
    title: "Launch & Betreuung",
    text:
      "Veröffentlichung inklusive Einrichtung von Domain und E-Mail. Danach bleibe ich für Änderungen und Fragen erreichbar.",
  },
];

/* Bewusst wenige Einträge mit einem Satz Nutzen statt einer langen Liste:
   Eine Aufzählung von zehn Begriffen liest niemand, sechs klare Fälle
   schon. */
export const audiences: { titel: string; nutzen: string; bild: string }[] = [
  {
    titel: "Handwerk & Bau",
    bild: medien("/images/tiles/foto-wen-handwerk-640.webp"),
    nutzen: "Sichtbar für Kunden, die in Ihrer Region nach Ihrem Gewerk suchen.",
  },
  {
    titel: "Selbstständige & Freiberufler",
    bild: medien("/images/tiles/foto-wen-selbststaendig-640.webp"),
    nutzen: "Ein Auftritt, der Ihre Arbeit so ernst nimmt wie Sie selbst.",
  },
  {
    titel: "Gastronomie & Hotellerie",
    bild: medien("/images/tiles/foto-wen-gastro-640.webp"),
    nutzen: "Speisekarte, Öffnungszeiten und Reservierung ohne Umwege.",
  },
  {
    titel: "Existenzgründung",
    bild: medien("/images/tiles/foto-wen-gruendung-640.webp"),
    nutzen: "Vom Logo bis zur Website — alles aus einer Hand, von Anfang an.",
  },
  {
    titel: "Praxen & Beratung",
    bild: medien("/images/tiles/foto-wen-praxis-640.webp"),
    nutzen: "Vertrauen entsteht vor dem ersten Termin, auf Ihrer Seite.",
  },
  {
    titel: "Vereine & Kultur",
    bild: medien("/images/tiles/foto-wen-verein-640.webp"),
    nutzen: "Termine, Mitglieder und Förderer an einem Ort gebündelt.",
  },
];

export const faqItems = [
  {
    q: "Was kostet eine professionelle Website?",
    a: "Der Preis richtet sich nach Umfang und Funktionen. Eine einseitige Website beginnt bei 399 €, der mehrseitige Auftritt bei 699 €, der komplette Markenauftritt mit Logo bei 1.099 € — jeweils zuzüglich des monatlichen Beitrags für Hosting und Betreuung. Sie erhalten nach dem Erstgespräch ein schriftliches Festpreisangebot – ohne Stundenabrechnung und ohne versteckte Kosten.",
  },
  {
    q: "Wie lange dauert die Erstellung einer Website?",
    a: "Ein Onepager ist in der Regel in zwei bis drei Wochen fertig, umfangreichere Projekte mit Logoentwicklung benötigen vier bis acht Wochen. Den größten Einfluss auf den Zeitplan haben erfahrungsgemäß die Zulieferung von Texten und Bildern sowie die Abstimmungsrunden.",
  },
  {
    q: "Kann meine bestehende Website überarbeitet werden?",
    a: "Ja. Bei einem Relaunch prüfe ich zunächst, was erhalten bleiben sollte – etwa gut funktionierende Inhalte oder bestehende Suchmaschinen-Platzierungen – und was ein Update braucht. Vorhandene Adressen werden sauber weitergeleitet, damit Ihre Sichtbarkeit bei Google nicht verloren geht.",
  },
  {
    q: "Wird die Website bei Google gefunden?",
    a: "Jede Website wird mit sauberer technischer Grundlage übergeben: durchdachte Seitenstruktur, aussagekräftige Seitentitel und Beschreibungen, schnelle Ladezeiten, mobile Optimierung und eine Sitemap für Suchmaschinen. Auf Wunsch richte ich zusätzlich Ihr Google-Unternehmensprofil ein, das für lokale Suchanfragen besonders wichtig ist.",
  },
  {
    q: "Kann ich Inhalte später selbst ändern?",
    a: "Auf Wunsch ja – ich richte die Website so ein, dass Sie Texte und Bilder selbst pflegen können, und zeige Ihnen die Bedienung. Wenn Sie sich lieber nicht damit befassen möchten, übernehme ich die Pflege dauerhaft für Sie.",
  },
  {
    q: "Sind Hosting, Domain und E-Mail inbegriffen?",
    a: "Ja. In allen drei Paketen übernehme ich Webspace, SSL-Verschlüsselung, tägliche Sicherungen und die Veröffentlichung — dafür fällt der monatliche Beitrag an. Die Domain läuft dabei immer auf Ihren Namen, nicht auf meinen: Sie bleiben jederzeit Eigentümerin und könnten den Anbieter wechseln, ohne mich fragen zu müssen. Wer Hosting lieber selbst führt, kann den Monatsbeitrag weglassen und bekommt stattdessen eine Anleitung für den eigenen Anbieter.",
  },
  {
    q: "Ist die Website DSGVO-konform?",
    a: "Ja. Verschlüsselte Übertragung, datensparsame Einbindung externer Dienste und vorbereitete Seiten für Impressum und Datenschutzerklärung gehören zum Standard. Für die rechtliche Endprüfung der Texte empfehle ich ergänzend eine anwaltliche Beratung.",
  },
];

/* Derzeit keine veröffentlichten Kundenprojekte im Portfolio.
   Sobald eines dazukommt, hier eintragen — die Darstellung passt sich an. */
export const realProjects: {
  name: string;
  tag: string;
  image: string;
  alt: string;
  caption: string;
}[] = [];

export type DemoConcept = {
  slug: string;
  title: string;
  tag: string;
  domain: string;
  headline: string;
  sub: string;
  cta: string;
  ctaAlt: string;
  navItems: string[];
  theme: {
    bg: string;
    surface: string;
    accent: string;
    accentText: string;
    text: string;
    muted: string;
    serif: boolean;
    uppercase: boolean;
    heroImage: string;
    radius: string;
  };
  section: {
    kicker: string;
    items: { title: string; meta: string }[];
  };
  showcase: "gallery" | "menu" | "stats";
  /* Optional: echtes Foto/Video im Hero des Mockups.
     Sind beide gesetzt, ersetzt das Medium den Farbverlauf. */
  media?: { poster: string; video?: string; videoWebm?: string };
  /* Unterseiten, durch die das Mockup automatisch blättert. */
  screens: Screen[];
  tiles: string[];
  /* Eigene Aufnahmen fuer die Galerie-Ansicht, in der Reihenfolge der
     Galerie-Eintraege. Die `tiles` daneben bleiben Ausschnitte aus dem
     Konzeptvideo und tragen die uebrigen Ansichten. */
  galerie: string[];
  /* Verweist auf eine Fallbeispiel-Seite unter /referenzen/<slug>/ */
  hasCase?: boolean;
};

export type Screen =
  | { nav: string; type: "hero" }
  | { nav: string; type: "gallery"; kicker: string; items: { title: string; meta: string }[] }
  | { nav: string; type: "list"; kicker: string; items: { title: string; meta: string }[] }
  | { nav: string; type: "stats"; kicker: string; items: { title: string; meta: string }[] }
  | { nav: string; type: "contact"; kicker: string; lines: string[]; cta: string };

export const demoConcepts: DemoConcept[] = [
  {
    slug: "atelier",
    hasCase: true,
    title: "Atelier Nocturne",
    tag: "Kreativstudio",
    domain: "atelier-nocturne.de",
    headline: "Räume, die\nGeschichten erzählen",
    sub: "Innenarchitektur und Szenografie für Hotellerie, Gastronomie und private Auftraggeber.",
    cta: "Projekte ansehen",
    ctaAlt: "Studio",
    navItems: ["Studio", "Arbeiten", "Journal", "Kontakt"],
    theme: {
      bg: "#0f0f12",
      surface: "#191920",
      accent: "#e8d9a8",
      accentText: "#0f0f12",
      text: "#f4f1ea",
      muted: "rgba(244,241,234,0.5)",
      serif: true,
      uppercase: false,
      heroImage:
        "radial-gradient(120% 90% at 30% 15%, #3a3550 0%, transparent 55%), radial-gradient(100% 80% at 80% 70%, #6b4a3a 0%, transparent 60%), linear-gradient(160deg, #1b1a24, #0f0f12)",
      radius: "0px",
    },
    section: {
      kicker: "Ausgewählte Projekte",
      items: [
        { title: "Hotel Lumière", meta: "Lobby & Bar" },
        { title: "Casa Verde", meta: "Privathaus" },
        { title: "Nordlicht", meta: "Restaurant" },
      ],
    },
    showcase: "gallery",
    media: { poster: medien("/images/poster-atelier.webp"), video: medien("/videos/konzept-atelier.mp4"), videoWebm: medien("/videos/konzept-atelier.webm") },
    tiles: [medien("/images/tiles/atelier-1-640.webp"), medien("/images/tiles/atelier-2-640.webp"), medien("/images/tiles/atelier-3-640.webp"), medien("/images/tiles/atelier-4-640.webp"), medien("/images/tiles/atelier-5-640.webp"), medien("/images/tiles/atelier-6-640.webp")],
    galerie: [medien("/images/tiles/foto-atelier-lobby-640.webp"), medien("/images/tiles/foto-atelier-privathaus-640.webp"), medien("/images/tiles/foto-atelier-restaurant-640.webp")],
    screens: [
      { nav: "Studio", type: "hero" },
      {
        nav: "Arbeiten",
        type: "gallery",
        /* Drei Projekte, drei eigene Aufnahmen.

           Zwischenzeitlich stand hier ein Fallbeispiel mit drei Blicken,
           weil alle Kacheln aus derselben Videoszene stammten - drei
           Auftraege zu behaupten und dreimal denselben Raum zu zeigen,
           waere durchschaubar gewesen. Jetzt liegen drei eigenstaendige
           Aufnahmen vor, also darf die Galerie wieder das sein, was sie
           bei einem Innenarchitekturbuero waere. */
        kicker: "Ausgewählte Projekte",
        items: [
          { title: "Hotel Lumière", meta: "Lobby & Bar" },
          { title: "Casa Verde", meta: "Privathaus" },
          { title: "Nordlicht", meta: "Restaurant" },
        ],
      },
      {
        nav: "Kontakt",
        type: "contact",
        kicker: "Kontakt",
        lines: ["Atelier Nocturne", "Chausseestraße 12, Berlin", "studio@atelier-nocturne.de"],
        cta: "Anfrage senden",
      },
    ],
  },
  {
    slug: "verde",
    hasCase: true,
    title: "Verde Trattoria",
    tag: "Restaurant & Gastronomie",
    domain: "verde-trattoria.de",
    headline: "Sizilien auf\ndem Teller",
    sub: "Familienrezepte seit 1974. Täglich frische Pasta, Weine aus der Region und Gastfreundschaft.",
    cta: "Tisch reservieren",
    ctaAlt: "Speisekarte",
    navItems: ["Karte", "Weine", "Über uns", "Reservieren"],
    theme: {
      bg: "#fbf7ee",
      surface: "#f1e8d6",
      accent: "#7a5c2e",
      accentText: "#fbf7ee",
      text: "#2b2417",
      muted: "rgba(43,36,23,0.55)",
      serif: true,
      uppercase: false,
      heroImage:
        "radial-gradient(110% 90% at 25% 20%, #e6c98a 0%, transparent 55%), radial-gradient(100% 80% at 85% 75%, #8fa05e 0%, transparent 60%), linear-gradient(150deg, #f7ecd2, #e8dcc0)",
      radius: "3px",
    },
    section: {
      kicker: "Aus unserer Küche",
      items: [
        { title: "Antipasti della casa", meta: "9,50 €" },
        { title: "Pasta alla Norma", meta: "14,50 €" },
        { title: "Cannoli siciliani", meta: "7,50 €" },
      ],
    },
    showcase: "menu",
    media: { poster: medien("/images/poster-verde.webp"), video: medien("/videos/konzept-verde.mp4"), videoWebm: medien("/videos/konzept-verde.webm") },
    tiles: [medien("/images/tiles/verde-1-640.webp"), medien("/images/tiles/verde-2-640.webp"), medien("/images/tiles/verde-3-640.webp"), medien("/images/tiles/verde-4-640.webp"), medien("/images/tiles/verde-5-640.webp"), medien("/images/tiles/verde-6-640.webp")],
    galerie: [medien("/images/tiles/foto-verde-antipasti-640.webp"), medien("/images/tiles/foto-verde-pasta-640.webp"), medien("/images/tiles/foto-verde-dolci-640.webp")],
    screens: [
      { nav: "Karte", type: "hero" },
      {
        nav: "Gerichte",
        type: "gallery",
        kicker: "Aus unserer Küche",
        items: [
          { title: "Antipasti", meta: "della casa" },
          { title: "Pasta", meta: "alla Norma" },
          { title: "Dolci", meta: "Cannoli" },
        ],
      },
      {
        nav: "Reservieren",
        type: "contact",
        kicker: "Tisch reservieren",
        lines: ["Verde Trattoria", "Di–So ab 17:30 Uhr", "reservierung@verde-trattoria.de"],
        cta: "Tisch anfragen",
      },
    ],
  },
  {
    slug: "nordwerk",
    hasCase: true,
    title: "Nordwerk Handwerk",
    tag: "Handwerksbetrieb",
    domain: "nordwerk-handwerk.de",
    headline: "Meisterarbeit seit\ndrei Generationen",
    sub: "Zimmerei, Innenausbau und Sanierung – termintreu ausgeführt von einem eingespielten Team.",
    cta: "Angebot anfragen",
    ctaAlt: "Referenzen",
    navItems: ["Leistungen", "Referenzen", "Team", "Kontakt"],
    theme: {
      bg: "#12181c",
      surface: "#1b242a",
      accent: "#d9a441",
      accentText: "#12181c",
      text: "#eef1f2",
      muted: "rgba(238,241,242,0.5)",
      serif: false,
      uppercase: true,
      heroImage:
        "radial-gradient(120% 90% at 70% 20%, #3c4a52 0%, transparent 55%), radial-gradient(90% 70% at 20% 80%, #6a5433 0%, transparent 60%), linear-gradient(155deg, #1d262c, #12181c)",
      radius: "2px",
    },
    section: {
      kicker: "Zahlen, die für uns sprechen",
      items: [
        { title: "40+", meta: "Jahre Erfahrung" },
        { title: "250", meta: "Projekte" },
        { title: "12", meta: "Mitarbeiter" },
      ],
    },
    showcase: "stats",
    media: { poster: medien("/images/poster-nordwerk.webp"), video: medien("/videos/konzept-nordwerk.mp4"), videoWebm: medien("/videos/konzept-nordwerk.webm") },
    tiles: [medien("/images/tiles/nordwerk-1-640.webp"), medien("/images/tiles/nordwerk-2-640.webp"), medien("/images/tiles/nordwerk-3-640.webp"), medien("/images/tiles/nordwerk-4-640.webp"), medien("/images/tiles/nordwerk-5-640.webp"), medien("/images/tiles/nordwerk-6-640.webp")],
    galerie: [medien("/images/tiles/foto-nordwerk-dachstuhl-640.webp"), medien("/images/tiles/foto-nordwerk-innenausbau-640.webp"), medien("/images/tiles/foto-nordwerk-fachwerk-640.webp")],
    screens: [
      { nav: "Leistungen", type: "hero" },
      {
        nav: "Referenzen",
        type: "gallery",
        kicker: "Aus der Werkstatt",
        items: [
          { title: "Dachstuhl", meta: "Altbau, Lübeck" },
          { title: "Innenausbau", meta: "Praxisräume" },
          { title: "Sanierung", meta: "Fachwerk" },
        ],
      },
      {
        nav: "Kontakt",
        type: "stats",
        kicker: "Zahlen, die für uns sprechen",
        items: [
          { title: "40+", meta: "Jahre" },
          { title: "250", meta: "Projekte" },
          { title: "12", meta: "Mitarbeiter" },
        ],
      },
    ],
  },
];

export const about = {
  kicker: "Über mich",
  h2: "Persönliche Betreuung statt anonymer Agentur",
  p1:
    "Bei mir sprechen Sie direkt mit der Person, die Ihre Website auch tatsächlich gestaltet und umsetzt. Kein wechselnder Ansprechpartner, keine Warteschleife: Ich nehme mir Zeit für Ihr Vorhaben, höre zu und entwickle daraus einen Auftritt, der zu Ihnen und Ihren Kunden passt.",
  quote:
    "Jedes Projekt bekommt die gleiche Sorgfalt — als wäre es das einzige, an dem ich gerade arbeite.",
  p2:
    "Ob erste eigene Website, Relaunch eines veralteten Auftritts oder ein Logo, das endlich zum Betrieb passt: Sie bekommen eine ehrliche Einschätzung, feste Preise und eine Umsetzung, die auch in zwei Jahren noch gut aussieht.",
  cta: "Lernen wir uns kennen",
};

export const contact = {
  kicker: "Kontakt",
  h2: "Sprechen wir über Ihr Projekt",
  intro:
    "Sie planen eine neue Website, möchten Ihren bestehenden Auftritt modernisieren oder brauchen ein Logo? Schreiben Sie mir kurz, worum es geht – Sie erhalten zeitnah eine ehrliche Einschätzung und ein unverbindliches Festpreisangebot.",
  email: "info@webdesign-elfe.de",
  phone: "Auf Anfrage",
  whatsapp: "Auf Anfrage",
  region: "Auf Anfrage",
  hours: "Montag bis Freitag, Samstag nach Vereinbarung",
};

/* ---------- Kennzahlen ---------- */
export const stats = [
  { value: 100, suffix: " %", label: "Feste Preise, keine Stundenabrechnung" },
  { value: 48, suffix: " h", label: "Antwortzeit auf Anfragen" },
  { value: 1, suffix: "", label: "Fester Ansprechpartner von Anfang bis Ende" },
];

/* ---------- Preispakete ----------
   Preise als Orientierung – bitte an die eigene Kalkulation anpassen. */
export const pricing = [
  {
    name: "Start",
    from: "399 €",
    monthly: "zzgl. 19 € / Monat",
    text: "Eine Seite, die alles Wichtige zeigt — mit Hosting und Betreuung ab dem ersten Tag.",
    features: [
      "Einseitige Website",
      "Individuelles Design",
      "Mobil optimiert",
      "Kontaktformular",
      "SEO-Grundlagen",
      "Hosting & SSL inklusive",
      "Tägliche Sicherung",
      "Veröffentlichung übernehme ich",
    ],
    highlight: false,
  },
  {
    name: "Profi",
    from: "699 €",
    monthly: "zzgl. 39 € / Monat",
    text: "Der klassische Auftritt mit eigenen Unterseiten — und einer Ansprechpartnerin für alles.",
    features: [
      "Bis zu 6 Unterseiten",
      "Individuelles Design",
      "Mobil optimiert",
      "Kontaktformular",
      "SEO-Grundlagen",
      "Hosting, SSL & E-Mail-Postfächer",
      "Tägliche Sicherung",
      "Änderungen bis 30 Min. im Monat",
    ],
    highlight: true,
  },
  {
    name: "Marke",
    from: "1.099 €",
    monthly: "zzgl. 79 € / Monat",
    text: "Kompletter Markenauftritt: Logo, Farbwelt, Website — und die Technik dauerhaft aus einer Hand.",
    features: [
      "Alles aus „Profi“",
      "Logoentwicklung",
      "Farb- & Schriftkonzept",
      "Dateien für Druck & Web",
      "Änderungen bis 2 Std. im Monat",
      "Jährlicher Durchgang",
      "Bevorzugte Bearbeitung",
    ],
    highlight: false,
  },
];

/* Zusatzleistungen, die zu jedem Paket hinzugebucht werden können.
   Preise sind Orientierungswerte und bitte an die eigene Kalkulation
   anzupassen. */
export type Paket = {
  name: string;
  from: string;
  monthly?: string;
  text: string;
  features: string[];
  highlight: boolean;
};

export type Addon = {
  title: string;
  price: string;
  text: string;
  points: string[];
  icon: "server" | "book";
  included?: boolean;
  /* Herunterladbare Anleitung, falls vorhanden. Erzeugt aus
     werkzeug/anleitung/anleitung.html. */
  datei?: { pfad: string; name: string; groesse: string };
};

export const addons: Addon[] = [
  {
    icon: "server",
    title: "Betreuung für bestehende Seiten",
    price: "ab 19 € / Monat",
    text: "Ihre Website steht bereits? Ich übernehme Umzug, Hosting und Pflege — auch wenn die Seite von jemand anderem stammt.",
    points: [
      "Umzug und Einrichtung einmalig ab 90 €",
      "Hosting, SSL und tägliche Sicherung",
      "Updates und Erreichbarkeitsprüfung",
      "Störungen innerhalb eines Werktages",
    ],
  },
  {
    icon: "book",
    title: "Lieber alles selbst in der Hand",
    price: "Ohne Aufpreis",
    text: "Sie möchten Hosting und Vertrag selbst führen? Dann entfällt der Monatsbeitrag und Sie erhalten eine verständliche Anleitung für Ihren Anbieter.",
    points: [
      "Bebilderte Schritt-für-Schritt-Anleitung",
      "Zum Projekt zusätzlich auf Ihren Anbieter zugeschnitten",
      "Die Domain läuft ohnehin immer auf Sie",
    ],
    included: true,
    datei: {
      pfad: medien("/downloads/hosting-anleitung.pdf"),
      name: "Hosting selbst in der Hand",
      groesse: "PDF, 6 Seiten",
    },
  },
];

export const addonNote =
  "Den Hosting-Anbieter wählen Sie frei — Domain und Vertrag bleiben dadurch in Ihrem Namen. Die laufenden Gebühren zahlen Sie direkt dort.";

export const pricingNote =
  "Alle Preise sind Endpreise — gemäß § 19 UStG wird keine Umsatzsteuer berechnet. Sie erhalten nach dem Erstgespräch ein verbindliches Festpreisangebot. Der monatliche Beitrag deckt Hosting, Sicherung und Betreuung; die Domaingebühr Ihres Anbieters (meist unter 20 € im Jahr) läuft weiterhin auf Ihren Namen.";

/* ---------- Kundenstimmen ----------
   PLATZHALTER – bitte durch echte Zitate ersetzen. */
/* Kundenstimmen: erst echte, dann veröffentlichen.

   Hier standen drei erfundene Zitate mit „Platzhalter" als Namen — darunter
   Sätze wie „Seit dem Relaunch kommen deutlich mehr Anfragen". Auf einer
   Seite, die mit persönlicher Betreuung wirbt, sind erfundene Kundenurteile
   nicht nur unglaubwürdig, sondern als irreführende Werbung angreifbar.

   Bis echte Stimmen vorliegen, steht hier, was tatsächlich zugesagt wird —
   jede Zeile aus den Paketbedingungen belegt. */
/* ---------- Anfrageformular ----------

   Warum die Fragen hier stehen und nicht im Bauteil: Sie werden sich
   ändern, sobald die ersten Anfragen zeigen, welche Antwort niemand
   anklickt. Wer Text ändern will, soll nicht durch JSX suchen müssen.

   ZWEI BEWUSSTE ABWEICHUNGEN VON DER ÜBLICHEN VORLAGE

   1. Die Budgetstufen. In fast jeder Formularvorlage stehen Spannen bis
      „10.000 € und mehr". Hier reicht die Preisliste von 399 bis 1.099 €
      — jemanden nach zehntausend Euro zu fragen, hieße, alle
      wegzuschicken, die tatsächlich anfragen sollen, und die übrigen zu
      verwirren. Die Stufen folgen deshalb der eigenen Preisliste.

   2. Die Anrede. Die ganze Seite siezt. Ein Formular, das plötzlich
      duzt, liest sich wie von woanders kopiert — genau der Eindruck,
      den eine Arbeitsprobe nicht machen darf.

   Was NICHT gefragt wird: Anschrift, Straße, PLZ. Für eine erste Anfrage
   sind sie unnötig, und was unnötig ist, darf nach der
   Datenschutz-Grundverordnung nicht erhoben werden. Jedes Feld weniger
   ist außerdem ein Grund weniger abzubrechen. */
export const anfrage = {
  kicker: "Projektanfrage",
  h2: "Erzählen Sie mir von Ihrem Vorhaben",
  intro:
    "Sechs Fragen, überwiegend zum Anklicken — in zwei Minuten erledigt. Je mehr ich vorab weiß, desto konkreter kann ich Ihnen im Erstgespräch antworten.",

  schritte: [
    { titel: "Ihr Vorhaben", hinweis: "Womit fangen wir an?" },
    { titel: "Rahmen", hinweis: "Damit ich realistisch planen kann." },
    { titel: "Kontakt", hinweis: "Wohin darf die Antwort?" },
  ],

  was: {
    frage: "Was möchten Sie umsetzen?",
    optionen: [
      "Neue Website",
      "Bestehende Website überarbeiten",
      "Onlineshop",
      "Landingpage",
      "Logo oder Erscheinungsbild",
      "Etwas anderes",
    ],
  },

  ziel: {
    frage: "Was soll die Website vor allem erreichen?",
    hinweis: "Mehrfachauswahl möglich.",
    optionen: [
      "Mehr Kunden und Anfragen gewinnen",
      "Leistungen und Angebot zeigen",
      "Produkte verkaufen",
      "Professioneller auftreten",
      "Bei Google gefunden werden",
      "Etwas anderes",
    ],
  },

  bestehend: {
    frage: "Haben Sie bereits eine Website?",
    optionen: ["Ja", "Nein"],
    urlLabel: "Wie lautet die Adresse?",
    urlPlatzhalter: "ihr-betrieb.de",
    problemFrage: "Was stört Sie daran am meisten?",
    problemPlatzhalter:
      "Zum Beispiel: sieht veraltet aus, funktioniert auf dem Handy nicht, bringt keine Anfragen.",
  },

  start: {
    frage: "Wann möchten Sie starten?",
    optionen: [
      "So bald wie möglich",
      "In ein bis zwei Monaten",
      "In drei bis sechs Monaten",
      "Noch offen",
    ],
  },

  budget: {
    frage: "Womit rechnen Sie ungefähr?",
    hinweis:
      "Nur eine Einordnung — ein festes Angebot bekommen Sie nach dem Erstgespräch. Meine Pakete beginnen bei 399 €.",
    optionen: [
      "Bis 500 €",
      "500 bis 1.000 €",
      "1.000 bis 2.000 €",
      "Mehr als 2.000 €",
      "Weiß ich noch nicht",
    ],
  },

  freitext: {
    frage: "Worauf kommt es Ihnen an?",
    hinweis: "Freiwillig — aber es hilft mir sehr.",
    platzhalter:
      "Erzählen Sie mir kurz von Ihrem Vorhaben, Ihren Vorstellungen oder Ihren bisherigen Erfahrungen.",
  },

  kontakt: {
    name: "Ihr Name",
    namePlatzhalter: "Vor- und Nachname",
    email: "E-Mail",
    emailPlatzhalter: "ihre@adresse.de",
    telefon: "Telefon",
    telefonHinweis: "Freiwillig — für kurze Rückfragen oft der schnellste Weg.",
    telefonPlatzhalter: "0157 …",
    betrieb: "Betrieb",
    betriebPlatzhalter: "Freiwillig",
  },

  knopf: { weiter: "Weiter", zurueck: "Zurück", senden: "Anfrage abschicken" },

  vertrauen: [
    "Unverbindlich und kostenlos",
    "Antwort innerhalb von 48 Stunden",
    "Keine Weitergabe Ihrer Daten",
  ],

  danke: {
    titel: "Ihre Anfrage ist unterwegs",
    text:
      "Vielen Dank — ich habe alles, was ich für den Anfang brauche. Ich sehe mir Ihr Vorhaben in Ruhe an und melde mich innerhalb von 48 Stunden persönlich bei Ihnen, in der Regel schneller.",
    naechstes: [
      "Ich lese Ihre Angaben und schaue mir Ihre bisherige Website an, falls vorhanden.",
      "Sie bekommen eine erste ehrliche Einschätzung — auch dann, wenn ich nicht die Richtige für Ihr Vorhaben bin.",
      "Passt es, vereinbaren wir ein Gespräch. Danach erhalten Sie ein schriftliches Festpreisangebot.",
    ],
    ohneDienst:
      "Ihr E-Mail-Programm hat sich mit der fertigen Nachricht geöffnet. Bitte einmal auf Senden klicken — erst dann erreicht mich Ihre Anfrage.",
  },
};

/* ---------- Projekt-Briefing ----------

   Kommt NACH der Anfrage: Wer hier ankommt, ist schon Kunde oder kurz
   davor. Deshalb dürfen die Fragen tiefer gehen als im Anfrageformular.

   WARUM SECHS SCHRITTE UND NICHT ZEHN

   Die Vorlage sah zehn Schritte mit rund sechzig Fragen vor. Der eigene
   Anspruch daneben lautete: „darf sich nicht wie Arbeit anfühlen".
   Sechzig Fragen fühlen sich nach Arbeit an, weil sie welche sind — und
   ein Briefing, das zu zwei Dritteln ausgefüllt liegen bleibt, ist
   wertlos.

   Weggefallen ist der Technikschritt (Domain, Hosting, wer hat Zugriff
   worauf). Das klärt ein Telefonat in fünf Minuten, und im Formular
   führt es dazu, dass jemand mit „weiß ich nicht" abbricht, statt
   nachzufragen.

   Zusammengelegt: Zielgruppe und Ziele, Seiten und Inhalte, Zeitplan
   und Ansprechpartner. */
export const briefing = {
  kicker: "Projekt-Briefing",
  h2: "Erzählen Sie mir von Ihrem Betrieb",
  intro:
    "Sechs Schritte, überwiegend zum Anklicken. Rechnen Sie mit fünf bis zehn Minuten. Ihre Antworten werden im Browser zwischengespeichert — Sie können jederzeit unterbrechen und später weitermachen.",

  schritte: [
    { titel: "Ihr Betrieb", hinweis: "Wer sind Sie, und was machen Sie?" },
    { titel: "Ihre Kunden", hinweis: "Wen soll die Website erreichen?" },
    { titel: "Ziele", hinweis: "Woran messen wir, ob es funktioniert hat?" },
    { titel: "Inhalte", hinweis: "Was kommt auf die Seite — und wer liefert es?" },
    { titel: "Gestaltung", hinweis: "Wie soll es wirken?" },
    { titel: "Rahmen", hinweis: "Zeitplan und Ansprechpartner." },
  ],

  betrieb: {
    name: { label: "Name des Betriebs", pflicht: true, platzhalter: "Nordwerk Handwerk GmbH" },
    tun: {
      frage: "Was machen Sie?",
      hinweis: "Zwei, drei Sätze genügen — so, wie Sie es einem Nachbarn erzählen würden.",
      platzhalter: "Wir bauen Dachstühle, machen Innenausbau und sanieren Fachwerk.",
    },
    anders: {
      frage: "Was können Sie besser als andere in Ihrer Gegend?",
      hinweis: "Der wichtigste Satz für die spätere Startseite.",
      platzhalter: "Wir arbeiten in dritter Generation und machen alles selbst — kein Subunternehmer.",
    },
    worte: {
      frage: "Ihr Betrieb in drei bis fünf Worten",
      platzhalter: "bodenständig, gründlich, seit 1981",
    },
    website: { frage: "Gibt es schon eine Website?", optionen: ["Ja", "Nein"] },
    url: { label: "Adresse", platzhalter: "ihr-betrieb.de" },
    uebernehmen: {
      label: "Was davon soll bleiben?",
      platzhalter: "Zum Beispiel Texte, Bilder, die Referenzen — oder nichts.",
    },
  },

  kunden: {
    wer: { frage: "Wer sind Ihre Kunden?", optionen: ["Privatkunden", "Geschäftskunden", "Beides", "Anders"] },
    beschreibung: {
      frage: "Wen möchten Sie vor allem erreichen?",
      platzhalter: "Hausbesitzer im Alten Land, die einen Altbau sanieren.",
    },
    problem: {
      frage: "Was beschäftigt diese Menschen, bevor sie anrufen?",
      hinweis: "Sorgen, Fragen, schlechte Erfahrungen — das bestimmt, was auf der Seite stehen muss.",
      platzhalter: "Angst vor Kostenexplosion, Zweifel, ob der Handwerker Termine hält.",
    },
    fragen: {
      frage: "Welche Fragen bekommen Sie immer wieder?",
      hinweis: "Die stehen später als Antworten auf der Seite — das spart Ihnen Anrufe.",
      platzhalter: "Was kostet das ungefähr? Wie lange dauert es? Kommen Sie auch nach Stade?",
    },
  },

  ziele: {
    wichtigstes: {
      frage: "Was soll die Website vor allem bewirken?",
      hinweis: "Mehrfachauswahl möglich — aber je klarer, desto besser wird die Seite.",
      optionen: [
        "Mehr Anfragen",
        "Mehr Anrufe",
        "Termine bekommen",
        "Produkte verkaufen",
        "Leistungen zeigen",
        "Professioneller wirken",
        "Bei Google gefunden werden",
        "Mitarbeiter finden",
      ],
    },
    handlung: {
      frage: "Was soll ein Besucher am Ende tun?",
      optionen: ["Anrufen", "Formular ausfüllen", "E-Mail schreiben", "Termin buchen", "Etwas kaufen", "Weiß ich noch nicht"],
    },
    erfolg: {
      frage: "Woran würden Sie in einem Jahr merken, dass es sich gelohnt hat?",
      platzhalter: "Zum Beispiel: zwei ernsthafte Anfragen im Monat statt zwei im Jahr.",
    },
    regionen: {
      label: "In welchen Orten möchten Sie gefunden werden?",
      hinweis: "Nur nötig, wenn Sie regional arbeiten.",
      platzhalter: "Jork, Stade, Buxtehude, Hamburg-Süd",
    },
  },

  inhalte: {
    seiten: {
      frage: "Welche Seiten brauchen Sie?",
      hinweis: "Mehrfachauswahl. Im Zweifel weniger — jede Seite will gepflegt werden.",
      optionen: [
        "Startseite",
        "Über uns",
        "Leistungen",
        "Einzelne Leistungsseiten",
        "Referenzen",
        "Team",
        "Häufige Fragen",
        "Preise",
        "Blog",
        "Stellenangebote",
        "Kontakt",
        "Shop",
      ],
    },
    texte: {
      frage: "Wer schreibt die Texte?",
      optionen: ["Ich selbst", "Bitte übernehmen Sie das", "Gemeinsam", "Noch offen"],
    },
    material: {
      frage: "Was haben Sie schon da?",
      hinweis: "Mehrfachauswahl.",
      optionen: [
        "Logo",
        "Professionelle Fotos",
        "Eigene Handyfotos",
        "Videos",
        "Texte",
        "Prospekte oder PDFs",
        "Nichts davon",
      ],
    },
    funktionen: {
      frage: "Brauchen Sie etwas darüber hinaus?",
      hinweis: "Mehrfachauswahl. Alles Weitere besprechen wir im Gespräch.",
      optionen: [
        "Kontaktformular",
        "Terminbuchung",
        "Karte / Anfahrt",
        "Newsletter",
        "Bewertungen",
        "WhatsApp",
        "Downloads",
        "Mehrsprachig",
        "Onlineshop",
        "Nichts davon",
      ],
    },
  },

  gestaltung: {
    wirkung: {
      frage: "Wie soll Ihre Website wirken?",
      hinweis: "Bis zu drei — mehr verwässert das Ergebnis.",
      optionen: [
        "Bodenständig",
        "Hochwertig",
        "Modern",
        "Schlicht",
        "Seriös",
        "Warm und persönlich",
        "Handwerklich",
        "Technisch",
      ],
    },
    vorbilder: {
      frage: "Websites, die Ihnen gefallen",
      hinweis: "Zwei bis drei Adressen und je ein Satz, was Ihnen daran gefällt. Muss nicht aus Ihrer Branche sein.",
      platzhalter: "beispiel.de — mag ich, weil man sofort sieht, was die machen",
    },
    abneigung: {
      frage: "Was möchten Sie auf keinen Fall?",
      platzhalter: "Zum Beispiel: bunt, verspielt, Stockfotos mit lachenden Menschen im Anzug.",
    },
    marke: {
      frage: "Gibt es feste Vorgaben?",
      hinweis: "Mehrfachauswahl.",
      optionen: ["Logo vorhanden", "Feste Farben", "Feste Schriften", "Gestaltungsrichtlinien", "Nichts davon"],
    },
  },

  rahmen: {
    start: {
      frage: "Wann soll es losgehen?",
      optionen: ["So bald wie möglich", "In ein bis zwei Monaten", "In drei bis sechs Monaten", "Noch offen"],
    },
    termin: {
      label: "Gibt es einen festen Termin?",
      hinweis: "Zum Beispiel eine Eröffnung, eine Messe, ein Jubiläum.",
      platzhalter: "Datum und Anlass",
    },
    ansprech: { label: "Wer ist mein Ansprechpartner?", platzhalter: "Name, falls abweichend" },
    entscheidung: {
      frage: "Wer entscheidet am Ende?",
      optionen: ["Ich allein", "Gemeinsam mit Partner oder Familie", "Ein Team", "Noch offen"],
    },
    sonstiges: {
      label: "Gibt es sonst noch etwas, das ich wissen sollte?",
      platzhalter: "Alles, was oben nicht gepasst hat.",
    },
  },

  /* Dateien: Auf einer statischen Seite gibt es keinen Server, der sie
     annehmen könnte. Statt einen Hochladebereich zu bauen, der nicht
     funktioniert, steht hier der Weg, der heute schon funktioniert. */
  dateien: {
    titel: "Dateien schicken Sie mir einfach zu",
    text:
      "Logo, Fotos, Prospekte, alte Texte — antworten Sie dazu einfach auf meine Bestätigungsmail und hängen Sie an, was Sie haben. Das ist für Sie der kürzeste Weg, und ich habe alles im selben Verlauf.",
    hinweis:
      "Größere Sammlungen gern über einen Link zu Ihrer Cloud. Passwörter oder Zugangsdaten bitte nie per Formular oder E-Mail — dafür finden wir im Gespräch einen sicheren Weg.",
  },

  knopf: { weiter: "Weiter", zurueck: "Zurück", senden: "Briefing abschicken" },

  danke: {
    titel: "Ihr Briefing ist angekommen",
    text:
      "Vielen Dank — damit kann ich mich gezielt auf Ihr Projekt vorbereiten. Ich melde mich innerhalb von zwei Werktagen bei Ihnen, mit ersten Gedanken und den Fragen, die offengeblieben sind.",
    ohneDienst:
      "Ihr E-Mail-Programm hat sich mit dem fertigen Briefing geöffnet. Bitte einmal auf Senden klicken — erst dann erreicht es mich.",
    terminTitel: "Möchten Sie direkt einen Termin ausmachen?",
    terminText: "Zwanzig Minuten am Telefon reichen für den Anfang.",
    terminKnopf: "Erstgespräch vereinbaren",
    /* Platzhalter: Sobald ein Kalenderdienst eingerichtet ist, hier die
       Adresse eintragen. Bleibt das Feld leer, führt der Knopf zur
       E-Mail-Adresse — das funktioniert immer. */
    terminAdresse: "",
    postfach: "Eine Kopie Ihrer Angaben liegt in Ihrem gesendeten Postfach.",
  },
};

export const testimonials: { quote: string; name: string; role: string }[] = [];

export const zusagen = [
  {
    titel: "Feste Preise",
    text: "Der Preis steht vor dem ersten Entwurf fest. Keine Stundenabrechnung, keine Überraschung auf der Schlussrechnung.",
  },
  {
    titel: "Zwei Korrekturrunden inklusive",
    text: "Darin ändern wir gemeinsam, was Ihnen am Entwurf nicht gefällt. Weitere Wünsche kosten 60 € je Stunde — die geschätzte Zeit erfahren Sie vorher.",
  },
  {
    titel: "Ihre Dateien gehören Ihnen",
    text: "Bei einer Kündigung bekommen Sie alle Dateien und Hilfe beim Umzug. Die Domain läuft ohnehin immer auf Sie.",
  },
  {
    titel: "Eine Ansprechpartnerin",
    text: "Kein wechselndes Team, keine Warteschleife: Sie sprechen mit der Person, die Ihre Website auch gestaltet und umsetzt.",
  },
];

/* ---------- Eigenständige Unterseiten ----------
   Jede Seite hat einen eigenen Titel und eigene Beschreibung, damit sie
   bei Google einzeln gefunden werden kann. */
export type SubPage = {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  kicker: string;
  lead: string;
  sections: { h2: string; text: string; points?: string[] }[];
  faqRefs: number[];
};

export const subPages: SubPage[] = [
  {
    slug: "webdesign",
    title: "Webdesign",
    metaTitle: "Webdesign für kleine Unternehmen – individuell statt Baukasten",
    metaDescription:
      "Individuelles Webdesign für Handwerksbetriebe, Selbstständige und kleine Unternehmen: klar strukturiert, mobil optimiert, suchmaschinenfreundlich und persönlich betreut.",
    kicker: "Leistung",
    lead: "Eine Website ist kein Prospekt, sondern Ihr Verkäufer, der rund um die Uhr arbeitet. Ich gestalte sie so, dass Besucher schnell verstehen, was Sie anbieten — und wissen, was sie als Nächstes tun sollen.",
    sections: [
      {
        h2: "Individuell statt von der Stange",
        text: "Baukastenseiten sehen austauschbar aus, weil sie es sind. Ihr Auftritt entsteht aus Ihrer Branche, Ihrer Zielgruppe und Ihren Inhalten — Farben, Schrift und Aufbau werden für Sie entwickelt, nicht ausgewählt.",
        points: [
          "Aufbau nach Ihren wichtigsten Kundenfragen",
          "Eigene Farb- und Schriftwelt",
          "Klare Handlungsaufforderung auf jeder Seite",
        ],
      },
      {
        h2: "Auf jedem Gerät überzeugend",
        text: "Die Mehrheit Ihrer Besucher kommt über das Handy. Jede Seite wird deshalb von der kleinsten Bildschirmbreite an entwickelt und auf allen gängigen Geräten geprüft — nicht nur am großen Bildschirm.",
        points: [
          "Getestet von 320 Pixel bis zum großen Monitor",
          "Ausreichend große Schaltflächen für den Daumen",
          "Kurze Ladezeiten auch im Mobilfunknetz",
        ],
      },
      {
        h2: "Von Anfang an auffindbar",
        text: "Suchmaschinenoptimierung ist kein Zusatzpaket, sondern gehört zur sauberen Umsetzung: sprechende Seitentitel, sinnvolle Überschriftenstruktur, schnelle Ladezeiten und eine Sitemap, die Google den Weg weist.",
        points: [
          "Seitentitel und Beschreibungen je Seite",
          "Strukturierte Daten für Google",
          "Sitemap und saubere Adressen",
        ],
      },
    ],
    faqRefs: [0, 1, 3],
  },
  {
    slug: "logodesign",
    title: "Logodesign",
    metaTitle: "Logodesign & Corporate Design – unverwechselbar auftreten",
    metaDescription:
      "Logodesign und Corporate Design für kleine Unternehmen: Wortmarke, Farbwelt und Typografie aus einer Hand — mit allen Dateien für Druck und Web.",
    kicker: "Leistung",
    lead: "Ein Logo ist das Erste, woran sich Kunden erinnern. Es muss auf dem Lieferwagen genauso funktionieren wie im Briefkopf und als kleines Symbol im Browser-Tab.",
    sections: [
      {
        h2: "Mehr als ein Bildzeichen",
        text: "Zu einem tragfähigen Auftritt gehören Wortmarke, Bildmarke, Farbwelt und Schriften — aufeinander abgestimmt, damit alles aus einem Guss wirkt. Sie erhalten ein Logo, das in jeder Größe lesbar bleibt.",
        points: [
          "Wort- und Bildmarke",
          "Farb- und Schriftkonzept",
          "Varianten für helle und dunkle Untergründe",
        ],
      },
      {
        h2: "Alle Dateien, die Sie brauchen",
        text: "Sie bekommen Ihr Logo in allen gängigen Formaten — verlustfrei skalierbar für die Druckerei, komprimiert fürs Web und als Symbol für den Browser. So kann jede Druckerei und jede Agentur damit arbeiten.",
        points: [
          "Vektordateien für die Druckerei",
          "Web-Dateien in mehreren Größen",
          "Browser-Symbol und Profilbilder",
        ],
      },
      {
        h2: "Auf Wunsch mit passender Website",
        text: "Logo und Website aus einer Hand ersparen Ihnen Abstimmungsschleifen zwischen zwei Dienstleistern — und sorgen dafür, dass beides tatsächlich zusammenpasst.",
      },
    ],
    faqRefs: [0, 1, 2],
  },
  {
    slug: "entwicklung",
    title: "Entwicklung & Technik",
    metaTitle: "Websites sauber programmiert — schnell, sicher, auffindbar",
    metaDescription:
      "Handgeschriebener Code statt aufgeblähter Baukasten: kurze Ladezeiten, saubere Struktur für Suchmaschinen, verschlüsselte Übertragung und tägliche Sicherung.",
    kicker: "Leistung",
    lead:
      "Was unter der Oberfläche passiert, sieht niemand — bis es hakt. Eine Seite, die drei Sekunden zum Laden braucht, verliert Besucher, bevor sie den ersten Satz gelesen haben. Deshalb baue ich Websites von Hand, statt einen Baukasten zu füllen.",
    sections: [
      {
        h2: "Warum die Ladezeit über Anfragen entscheidet",
        text: "Die meisten Besucher kommen über das Handy, oft mit mittelmäßigem Empfang. Jede Sekunde Wartezeit kostet Interessenten. Baukastenseiten laden schnell mehrere Megabyte, weil sie alles mitbringen, was irgendjemand brauchen könnte. Ihre Seite lädt nur, was sie tatsächlich zeigt.",
        points: [
          "Bilder in modernen Formaten, auf die tatsächliche Anzeigegröße gerechnet",
          "Schriften liegen auf dem Server, keine Nachladeschleife",
          "Kein fremder Code, der still im Hintergrund mitläuft",
        ],
      },
      {
        h2: "Struktur, die Suchmaschinen lesen können",
        text: "Google bewertet nicht, wie hübsch eine Seite aussieht, sondern ob es sie versteht. Überschriften in richtiger Reihenfolge, sprechende Adressen, Beschreibungen für jede Seite und maschinenlesbare Angaben zu Ihrem Betrieb sind die Grundlage dafür — nicht ein Zusatzmodul, das man später kauft.",
        points: [
          "Saubere Überschriftenhierarchie statt optischer Größenwahl",
          "Eigener Titel und eigene Beschreibung je Seite",
          "Strukturierte Daten zu Betrieb, Adresse und Leistungen",
          "Sitemap und robots.txt von Anfang an",
        ],
      },
      {
        h2: "Sicherheit, ohne dass Sie sich kümmern müssen",
        text: "Verschlüsselte Übertragung ist Pflicht, nicht Zusatzleistung — ohne sie warnen Browser Ihre Besucher. Dazu kommt eine tägliche Sicherung: Falls doch etwas schiefgeht, ist der Stand von gestern in Minuten wieder da.",
        points: [
          "SSL-Verschlüsselung eingerichtet und verlängert",
          "Tägliche Sicherung der gesamten Seite",
          "Störungen behebe ich innerhalb eines Werktags",
        ],
      },
      {
        h2: "Auf jedem Gerät geprüft, nicht gehofft",
        text: "Eine Seite kann am großen Bildschirm überzeugen und auf dem Telefon auseinanderfallen. Deshalb prüfe ich jede Seite auf mehreren Bildschirmgrößen und in verschiedenen Browsern, bevor sie online geht — vom kleinen Telefon bis zum breiten Monitor.",
      },
    ],
    faqRefs: [0, 1, 3],
  },
  {
    slug: "betreuung",
    title: "Pflege & Betreuung",
    metaTitle: "Website-Betreuung ab 19 € im Monat — feste Ansprechpartnerin",
    metaDescription:
      "Laufende Betreuung für Ihre Website: Inhalte aktualisieren, Technik im Blick behalten, tägliche Sicherung und eine feste Ansprechpartnerin statt Warteschleife.",
    kicker: "Leistung",
    lead:
      "Die meisten Websites veralten nicht, weil sie schlecht gebaut wären, sondern weil sich niemand mehr kümmert. Nach dem Livegang bleibe ich Ihre Ansprechpartnerin — für neue Öffnungszeiten genauso wie für die Technik im Hintergrund.",
    sections: [
      {
        h2: "Was in der Betreuung enthalten ist",
        text: "Der Monatsbeitrag deckt alles ab, was eine Website am Laufen hält: den Platz auf dem Server, die verschlüsselte Übertragung, die tägliche Sicherung und Ihre E-Mail-Postfächer. Dazu kommen Inhaltsänderungen im vereinbarten Umfang.",
        points: [
          "Hosting, SSL und E-Mail-Postfächer",
          "Tägliche Sicherung, Wiederherstellung im Fall der Fälle",
          "Inhaltsänderungen je nach Paket bis 30 Minuten im Monat",
          "Erreichbarkeitsprüfung, damit Ausfälle nicht Ihnen auffallen",
        ],
      },
      {
        h2: "Eine Ansprechpartnerin, kein Ticketsystem",
        text: "Sie schreiben oder rufen an, und es meldet sich die Person, die Ihre Website gebaut hat. Kein wechselndes Team, keine Nummer, keine Warteschleife. Das ist der Grund, warum ich nur so viele Betriebe betreue, wie ich tatsächlich betreuen kann.",
      },
      {
        h2: "Auch für Seiten, die jemand anderes gebaut hat",
        text: "Ihre Website steht bereits, aber niemand pflegt sie mehr? Ich übernehme Umzug und Betreuung — einmalig ab 90 € für die Übernahme, danach ab 19 € im Monat. Vorher sehe ich mir an, in welchem Zustand die Seite ist, und sage Ihnen ehrlich, ob sich das lohnt oder ob ein Neuaufbau der bessere Weg wäre.",
        points: [
          "Umzug und Einrichtung einmalig ab 90 €",
          "Betreuung ab 19 € im Monat",
          "Ehrliche Einschätzung vorher, ob sich die Übernahme lohnt",
        ],
      },
      {
        h2: "Sie bleiben jederzeit unabhängig",
        text: "Der monatliche Beitrag läuft zwölf Monate, danach monatlich kündbar mit einem Monat Frist. Bei einer Kündigung bekommen Sie alle Dateien und Hilfe beim Umzug zum neuen Anbieter. Ihre Domain läuft ohnehin immer auf Sie — nicht auf mich.",
      },
    ],
    faqRefs: [4, 5, 6],
  },
];

/* ---------- Fallbeispiele ----------
   Zeigt das Vorgehen statt nur Bilder — für Kunden nachvollziehbar und
   für Suchmaschinen echter Text. Die Konzepte sind erfundene Betriebe und
   auf den Seiten deutlich als solche gekennzeichnet. */
export type CaseStudy = {
  slug: string;
  metaTitle: string;
  metaDescription: string;
  aufgabe: string;
  ausgangslage: string;
  vorgehen: { schritt: string; text: string }[];
  ergebnis: string;
  entscheidungen: { was: string; warum: string }[];
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "atelier",
    metaTitle: "Fallbeispiel: Website für ein Innenarchitektur-Studio",
    metaDescription:
      "Wie ein Auftritt für ein Innenarchitektur-Studio entsteht: dunkle Bildsprache, ruhige Typografie und ein Aufbau, der die Projekte in den Vordergrund stellt.",
    aufgabe:
      "Ein Studio für Innenarchitektur und Szenografie braucht einen Auftritt, bei dem die Räume wirken — nicht die Website.",
    ausgangslage:
      "Kreativbetriebe stehen vor einem Zielkonflikt: Der eigene Auftritt soll Können zeigen, darf den Arbeiten aber nicht die Aufmerksamkeit stehlen. Wird die Seite zu laut, wirken die Projekte kleiner, als sie sind.",
    vorgehen: [
      {
        schritt: "Zurücknahme statt Effekt",
        text: "Die Gestaltung tritt bewusst zurück: tiefes Anthrazit, warmes Licht, viel Raum zum Atmen. Die Bilder liefern die Farbe, die Seite gibt nur den Rahmen.",
      },
      {
        schritt: "Projekte zuerst",
        text: "Schon auf der Startseite führt der Weg in die Arbeiten. Wer Räume beauftragt, will Räume sehen — nicht zuerst über das Studio lesen.",
      },
      {
        schritt: "Ruhige Typografie",
        text: "Eine Serifenschrift mit großzügigem Zeilenabstand. Sie wirkt handwerklich und lässt den Bildern den Vortritt.",
      },
    ],
    ergebnis:
      "Ein Auftritt, der wie ein gut gestalteter Katalog funktioniert: Man blättert, bleibt hängen und fragt an — ohne dass die Website sich in den Vordergrund drängt.",
    entscheidungen: [
      {
        was: "Dunkler Hintergrund",
        warum: "Innenaufnahmen mit warmem Kunstlicht wirken auf dunklem Grund plastischer und weniger wie ein Möbelkatalog.",
      },
      {
        was: "Kein automatisches Bildkarussell",
        warum: "Selbsttätig wechselnde Bilder nehmen Besuchern die Kontrolle. Eine ruhige Übersicht führt häufiger zur Anfrage.",
      },
    ],
  },
  {
    slug: "verde",
    metaTitle: "Fallbeispiel: Website für ein Restaurant",
    metaDescription:
      "Wie eine Restaurant-Website entsteht, die Gäste bringt: Speisekarte ohne Umwege, Reservierung immer erreichbar und Bilder, die Appetit machen.",
    aufgabe:
      "Ein Familienrestaurant braucht eine Seite, die Gäste vom Handy aus zur Reservierung führt — nicht zu einem PDF-Download.",
    ausgangslage:
      "Gastronomie-Seiten scheitern meist an denselben drei Punkten: Die Speisekarte liegt als PDF vor, die Öffnungszeiten sind versteckt, und auf dem Handy ist nichts davon bedienbar. Dabei suchen Gäste fast immer unterwegs.",
    vorgehen: [
      {
        schritt: "Speisekarte als Teil der Seite",
        text: "Kein Download, kein Zoomen. Die Karte steht direkt auf der Seite, ist lesbar und lässt sich in Minuten selbst aktualisieren.",
      },
      {
        schritt: "Reservieren immer in Reichweite",
        text: "Auf dem Handy bleibt die Schaltfläche zum Reservieren dauerhaft sichtbar. Der häufigste Besuchsgrund braucht keinen Suchvorgang.",
      },
      {
        schritt: "Echte Bilder statt Bilddatenbank",
        text: "Helles Naturlicht, echte Teller aus der eigenen Küche. Gäste erkennen den Unterschied sofort.",
      },
    ],
    ergebnis:
      "Eine Seite, die die drei häufigsten Fragen — Was gibt es? Wann offen? Wie reservieren? — innerhalb weniger Sekunden beantwortet.",
    entscheidungen: [
      {
        was: "Heller Hintergrund",
        warum: "Speisen wirken auf hellem Grund appetitlicher; dunkle Gastronomie-Seiten lassen Gerichte oft schwer erscheinen.",
      },
      {
        was: "Preise sichtbar",
        warum: "Versteckte Preise kosten Reservierungen. Wer offen kalkuliert, wirkt selbstbewusst.",
      },
    ],
  },
  {
    slug: "nordwerk",
    metaTitle: "Fallbeispiel: Website für einen Handwerksbetrieb",
    metaDescription:
      "Wie ein Handwerksbetrieb online Vertrauen aufbaut: Referenzen, Zahlen und ein kurzer Weg zur Anfrage — auch für Kunden ohne Technikerfahrung.",
    aufgabe:
      "Ein Zimmereibetrieb in dritter Generation braucht eine Seite, die Vertrauen aufbaut und Anfragen bringt — von Bauherren, die ihn noch nicht kennen.",
    ausgangslage:
      "Handwerksbetriebe leben von Empfehlungen. Online fehlt dieser Vertrauensvorschuss: Wer die Firma nicht kennt, sucht nach Belegen — abgeschlossene Projekte, Erfahrung, echte Menschen.",
    vorgehen: [
      {
        schritt: "Belege nach vorn",
        text: "Jahre, Projekte und Mitarbeiterzahl stehen direkt sichtbar. Solche Zahlen ersetzen die persönliche Empfehlung, die online fehlt.",
      },
      {
        schritt: "Arbeiten statt Werbetexte",
        text: "Fotos aus der Werkstatt und von fertigen Projekten wirken stärker als jede Selbstbeschreibung.",
      },
      {
        schritt: "Anfrage ohne Hürde",
        text: "Ein kurzes Formular mit drei Feldern. Jedes zusätzliche Pflichtfeld kostet Anfragen.",
      },
    ],
    ergebnis:
      "Ein Auftritt, der auch bei Bauherren funktioniert, die den Betrieb vorher nicht kannten — und der auf dem Handy genauso überzeugt wie am Rechner.",
    entscheidungen: [
      {
        was: "Kräftige Versalien",
        warum: "Passt zur handwerklichen Tonalität und bleibt auf kleinen Bildschirmen gut lesbar.",
      },
      {
        was: "Keine Preisliste",
        warum: "Bauprojekte sind zu unterschiedlich. Statt Preisen führt der Weg zum Beratungsgespräch.",
      },
    ],
  },
];

/* ---------- Scrollgesteuerte Eröffnung ----------
   Kapitel, die beim Scrollen nacheinander erscheinen, während das Gerät
   im Bild bleibt. Kurze Zeilen — sie sollen gelesen, nicht studiert werden. */
export type Chapter = { kicker: string; title: string; sub: string };

export const heroChapters: Chapter[] = [
  {
    kicker: "Webdesign & Logodesign",
    title: "Ihre Marke,\nzum Leben erweckt",
    sub: "Vom ersten Logoentwurf bis zur fertigen Website — aus einer Hand.",
  },
  {
    kicker: "Individuell statt Baukasten",
    title: "Gestaltet für\nIhre Kunden",
    sub: "Farben, Schrift und Aufbau entstehen aus Ihrer Branche, nicht aus einer Vorlage.",
  },
  {
    kicker: "Auf jedem Gerät",
    title: "Überzeugend,\nwo immer man schaut",
    sub: "Vom Handy bis zum großen Bildschirm — geprüft, nicht gehofft.",
  },
  {
    kicker: "Persönlich betreut",
    title: "Eine Ansprechpartnerin,\nvon Anfang bis Ende",
    sub: "Feste Preise, ehrliche Einschätzung, erreichbar auch nach dem Launch.",
  },
];

/* ---------- Einzelheiten zu den Paketen ----------
   Eigene Unterseiten statt Aufklappbereiche: So lässt sich ein Paket per
   Link verschicken, und Suchmaschinen finden die Inhalte. Die Bedingungen
   (Laufzeit, Korrekturrunden, Zahlung) stehen bewusst auf jeder Seite —
   wer sie erst im Angebot liest, fühlt sich überrumpelt. */
export type PaketDetail = {
  slug: string;
  name: string;
  preis: string;
  monatlich: string;
  fuerWen: string;
  dauer: string;
  enthalten: { titel: string; text: string }[];
  nichtEnthalten: string;
  ablauf: { schritt: string; text: string }[];
  fragen: { q: string; a: string }[];
};

/* Bedingungen, die für alle Pakete gelten — an einer Stelle gepflegt,
   damit sie nicht auseinanderlaufen. */
export const paketBedingungen = {
  laufzeit:
    "Der monatliche Beitrag läuft zwölf Monate. Danach ist er monatlich kündbar mit einer Frist von einem Monat. Der einmalige Betrag für die Gestaltung ist davon unabhängig.",
  korrekturen:
    "Zwei Korrekturrunden sind enthalten. Darin ändern wir gemeinsam, was Ihnen am Entwurf nicht gefällt. Weitere Änderungswünsche rechne ich mit 60 € je Stunde ab — Sie erfahren vorher, wie viel Zeit ich schätze.",
  zahlung:
    "Die Hälfte des Einmalbetrags bei Auftragserteilung, die zweite Hälfte, wenn die Seite online ist. Der Monatsbeitrag beginnt mit dem Livegang.",
  kuendigung:
    "Wenn Sie kündigen, bekommen Sie alle Dateien Ihrer Website und ich helfe beim Umzug zu einem anderen Anbieter. Die Domain läuft ohnehin auf Ihren Namen — Sie sind zu keinem Zeitpunkt von mir abhängig.",
};

export const paketDetails: PaketDetail[] = [
  {
    slug: "start",
    name: "Start",
    preis: "399 €",
    monatlich: "19 € im Monat",
    fuerWen:
      "Für Selbstständige und kleine Betriebe, die endlich im Netz auffindbar sein wollen — mit allem Wichtigen auf einer Seite: was Sie anbieten, für wen, und wie man Sie erreicht.",
    dauer: "1 bis 2 Wochen, sobald Ihre Texte und Bilder vorliegen",
    enthalten: [
      {
        titel: "Eine Seite, die alles Wichtige zeigt",
        text: "Aufgeteilt in klare Abschnitte: Leistungen, über Sie, Kontakt. Der Besucher scrollt einmal durch und weiß Bescheid.",
      },
      {
        titel: "Gestaltung für Ihre Branche",
        text: "Farben, Schrift und Bildsprache entstehen aus Ihrem Handwerk, nicht aus einer Vorlage. Sie sehen einen Entwurf, bevor gebaut wird.",
      },
      {
        titel: "Auf jedem Gerät lesbar",
        text: "Am Handy genauso wie am großen Bildschirm — geprüft, nicht gehofft.",
      },
      {
        titel: "Kontaktformular",
        text: "Anfragen landen direkt in Ihrem Postfach. Telefonnummer und E-Mail sind mit einem Fingertipp erreichbar.",
      },
      {
        titel: "Auffindbar bei Google",
        text: "Seitentitel, Beschreibungen und Aufbau so gesetzt, dass Suchmaschinen verstehen, worum es geht. Dazu ein Eintrag, der Ihren Ort nennt.",
      },
      {
        titel: "Hosting, Sicherung und Betreuung",
        text: "Webspace, Verschlüsselung und tägliche Sicherungen sind im Monatsbeitrag enthalten. Bei Störungen kümmere ich mich innerhalb eines Werktages.",
      },
    ],
    nichtEnthalten:
      "Nicht enthalten sind das Verfassen neuer Texte (vorhandene überarbeite ich gern), Fotoaufnahmen vor Ort, Shop-Funktionen, mehrsprachige Fassungen und die Domaingebühr Ihres Anbieters. Weitere Unterseiten kosten 90 € je Seite.",
    ablauf: [
      { schritt: "Erstgespräch", text: "Kostenlos und unverbindlich, meist 20 Minuten am Telefon. Danach wissen wir beide, ob es passt." },
      { schritt: "Entwurf", text: "Sie sehen die Gestaltung, bevor gebaut wird. Zwei Korrekturrunden sind enthalten." },
      { schritt: "Umsetzung", text: "Ich baue die Seite, richte Hosting und Verschlüsselung ein und teste auf mehreren Geräten." },
      { schritt: "Livegang", text: "Die Seite geht online. Sie bekommen eine kurze Einweisung — und mich als Ansprechpartnerin." },
    ],
    fragen: [
      { q: "Ich habe noch keine Texte. Was nun?", a: "Das ist der Normalfall. Ich schicke Ihnen einen Leitfaden mit Fragen — Ihre Antworten in Stichpunkten reichen mir, den Rest formuliere ich in Form." },
      { q: "Kann ich später auf ein größeres Paket wechseln?", a: "Ja. Die Differenz zum größeren Paket wird angerechnet, Sie zahlen nicht doppelt." },
      { q: "Was, wenn ich später mehr Seiten brauche?", a: "Jede weitere Unterseite kostet 90 €. Ab drei zusätzlichen Seiten lohnt sich das Paket Profi." },
    ],
  },
  {
    slug: "profi",
    name: "Profi",
    preis: "699 €",
    monatlich: "39 € im Monat",
    fuerWen:
      "Für Betriebe, die mehr zu zeigen haben als eine Seite: mehrere Leistungen, Referenzen, ein Team, eine Anfahrt. Wer nach etwas Bestimmtem sucht, soll die passende Seite finden.",
    dauer: "2 bis 3 Wochen, sobald Ihre Texte und Bilder vorliegen",
    enthalten: [
      {
        titel: "Bis zu sechs Unterseiten",
        text: "Zum Beispiel Startseite, Leistungen, Referenzen, über uns, Anfahrt und Kontakt — aufeinander abgestimmt statt aneinandergereiht.",
      },
      {
        titel: "Gestaltung für Ihre Branche",
        text: "Farben, Schrift und Bildsprache entstehen aus Ihrem Gewerbe. Sie sehen einen Entwurf, bevor gebaut wird.",
      },
      {
        titel: "Auf jedem Gerät lesbar",
        text: "Vom kleinsten Handy bis zum großen Bildschirm — an mehreren Geräten geprüft.",
      },
      {
        titel: "Kontaktformular und E-Mail-Postfächer",
        text: "Anfragen landen in Ihrem Postfach. Dazu Adressen auf Ihre eigene Domain, etwa info@ihrbetrieb.de — das wirkt anders als eine Freemail-Adresse.",
      },
      {
        titel: "Auffindbar bei Google",
        text: "Jede Unterseite bekommt eigene Titel und Beschreibungen. So kann jede für sich gefunden werden, nicht nur die Startseite.",
      },
      {
        titel: "Änderungen bis 30 Minuten im Monat",
        text: "Neue Öffnungszeiten, ein ausgetauschtes Foto, ein Absatz Text — ein Anruf genügt, ohne Zusatzkosten.",
      },
      {
        titel: "Hosting, Sicherung und Betreuung",
        text: "Webspace, Verschlüsselung, tägliche Sicherungen und Aktualisierungen. Bei Störungen kümmere ich mich innerhalb eines Werktages.",
      },
    ],
    nichtEnthalten:
      "Nicht enthalten sind Logoentwicklung (siehe Paket Marke), das Verfassen umfangreicher Texte, Fotoaufnahmen vor Ort, Shop-Funktionen, Buchungssysteme, mehrsprachige Fassungen und die Domaingebühr. Weitere Unterseiten über sechs hinaus kosten 90 € je Seite.",
    ablauf: [
      { schritt: "Erstgespräch", text: "Kostenlos und unverbindlich. Wir klären, welche Unterseiten Sie wirklich brauchen — oft sind es weniger als gedacht." },
      { schritt: "Aufbau und Entwurf", text: "Erst die Gliederung, dann die Gestaltung. Zwei Korrekturrunden sind enthalten." },
      { schritt: "Umsetzung", text: "Ich baue alle Seiten, richte Hosting und Postfächer ein und teste auf mehreren Geräten." },
      { schritt: "Livegang", text: "Die Seite geht online, Sie bekommen eine Einweisung. Ab hier läuft die Betreuung." },
    ],
    fragen: [
      { q: "Reichen sechs Seiten?", a: "Für die meisten Betriebe ja. Falls nicht, kostet jede weitere 90 € — wir besprechen das im Erstgespräch, nicht hinterher." },
      { q: "Kann ich Inhalte selbst ändern?", a: "Kleine Änderungen erledige ich für Sie im Rahmen der 30 Minuten. Wenn Sie lieber selbst pflegen möchten, richte ich das ein und weise Sie ein." },
      { q: "Was ist mit meiner bestehenden Domain?", a: "Die behalten Sie. Ich übernehme den Umzug, ohne dass Ihre E-Mails ausfallen." },
    ],
  },
  {
    slug: "marke",
    name: "Marke",
    preis: "1.099 €",
    monatlich: "79 € im Monat",
    fuerWen:
      "Für alle, die bei null anfangen oder ihren Auftritt grundlegend erneuern: Logo, Farbwelt und Website entstehen zusammen und passen deshalb zueinander — auf dem Firmenwagen genauso wie auf dem Bildschirm.",
    dauer: "3 bis 4 Wochen, sobald Ihre Inhalte vorliegen",
    enthalten: [
      {
        titel: "Alles aus dem Paket Profi",
        text: "Bis zu sechs Unterseiten, Kontaktformular, E-Mail-Postfächer, Hosting und Betreuung.",
      },
      {
        titel: "Logoentwicklung",
        text: "Mehrere Entwürfe zur Auswahl, danach Feinschliff an dem, der Ihnen zusagt.",
      },
      {
        titel: "Farb- und Schriftkonzept",
        text: "Ein festgelegter Satz aus Farben und Schriften, damit Visitenkarte, Fahrzeug und Website zusammen wirken.",
      },
      {
        titel: "Dateien für Druck und Web",
        text: "Ihr Logo in allen gängigen Formaten — auch als Vektor, damit es auf einem Transporter genauso scharf ist wie auf einem Stift.",
      },
      {
        titel: "Änderungen bis zwei Stunden im Monat",
        text: "Genug für neue Referenzen, saisonale Angebote oder wechselnde Inhalte.",
      },
      {
        titel: "Jährlicher Durchgang",
        text: "Einmal im Jahr sehe ich mir Ihre Seite durch: veraltete Angaben, Ladezeit, Auffindbarkeit — und melde mich mit konkreten Vorschlägen.",
      },
      {
        titel: "Bevorzugte Bearbeitung",
        text: "Ihre Anfragen kommen zuerst dran.",
      },
    ],
    nichtEnthalten:
      "Nicht enthalten sind Fotoaufnahmen vor Ort, Druckkosten für Geschäftsausstattung, Shop-Funktionen, Buchungssysteme, mehrsprachige Fassungen und die Domaingebühr. Die Anmeldung einer Marke beim Patentamt gehört nicht dazu — ich sage Ihnen aber, worauf zu achten ist.",
    ablauf: [
      { schritt: "Erstgespräch", text: "Kostenlos und unverbindlich. Wir sprechen über Ihr Vorhaben, Ihre Kunden und darüber, wofür Sie stehen wollen." },
      { schritt: "Logo und Farbwelt", text: "Mehrere Entwürfe, dann Feinschliff. Erst wenn das Logo steht, beginnt die Website." },
      { schritt: "Website", text: "Aufbau, Gestaltung, Umsetzung — zwei Korrekturrunden sind enthalten." },
      { schritt: "Livegang und Übergabe", text: "Die Seite geht online, Sie erhalten alle Logodateien und eine Einweisung." },
    ],
    fragen: [
      { q: "Was, wenn mir kein Logoentwurf gefällt?", a: "Dann entwerfe ich neu. Erst wenn Sie zufrieden sind, geht es weiter — das ist der Sinn des Ablaufs." },
      { q: "Gehört das Logo dann mir?", a: "Ja. Mit der Schlusszahlung gehen die Nutzungsrechte vollständig auf Sie über, für alle Zwecke und ohne zeitliche Begrenzung." },
      { q: "Ich habe schon ein Logo. Wird es günstiger?", a: "Dann ist das Paket Profi das richtige. Wenn Ihr vorhandenes Logo nur aufgefrischt werden soll, sprechen wir im Erstgespräch über den Aufwand." },
    ],
  },
];
