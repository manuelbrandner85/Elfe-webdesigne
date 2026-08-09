import type { Metadata } from "next";
import { medien } from "@/lib/pfad";
import SanftesScrollen from "@/components/SanftesScrollen";
import BewegungsRahmen from "@/components/BewegungsRahmen";
import MagnetischeElemente from "@/components/MagnetischeElemente";

/* Schriften werden mitgeliefert, nicht von Google geladen.
   Das vermeidet die Übertragung der IP-Adresse jedes Besuchers in die USA
   — genau dafür wurde 2022 vor dem Landgericht München Schadenersatz
   zugesprochen. Nebeneffekt: Die Seite lädt schneller, weil eine fremde
   Verbindung entfällt. */
import "@fontsource/cormorant-garamond/400.css";
import "@fontsource/cormorant-garamond/500.css";
import "@fontsource/cormorant-garamond/600.css";
import "@fontsource/cormorant-garamond/700.css";
import "@fontsource/cormorant-garamond/400-italic.css";
import "@fontsource/cormorant-garamond/500-italic.css";
import "@fontsource/jost/300.css";
import "@fontsource/jost/400.css";
import "@fontsource/jost/500.css";
import "@fontsource/jost/600.css";
import "@fontsource/tangerine/400.css";
import "@fontsource/tangerine/700.css";
import "./globals.css";
import { site, faqItems, pricing, addons } from "@/data/content";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.title,
    template: "%s | Webdesign Elfe",
  },
  description: site.description,
  keywords: site.keywords,
  authors: [{ name: site.name }],
  creator: site.name,
  publisher: site.name,
  alternates: { canonical: "/", languages: { "de-DE": "/" } },
  /* Die Vorschau bei GitHub Pages darf nicht in den Suchindex.

     Sonst konkurriert eine zweite, identische Fassung mit der echten Seite —
     und schlimmer: Sie trägt eine kanonische Angabe auf
     www.webdesign-elfe.de, obwohl dort womöglich noch nichts steht. Google
     folgt dann einem Verweis ins Leere.

     Erkennungsmerkmal ist der Unterpfad; er wird nur im Vorschau-Bau
     gesetzt. */
  robots: process.env.NEXT_PUBLIC_BASE_PATH
    ? { index: false, follow: false, googleBot: { index: false, follow: false } }
    : {
        index: true,
        follow: true,
        googleBot: { index: true, follow: true, "max-image-preview": "large" },
      },
  openGraph: {
    type: "website",
    locale: "de_DE",
    url: site.url,
    siteName: site.name,
    title: site.title,
    description: site.description,
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Webdesign Elfe – Webdesign und Logodesign aus einer Hand",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
    images: ["/images/og-image.jpg"],
  },
  icons: { icon: "/favicon.ico" },
  category: "Webdesign",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ProfessionalService",
      "@id": `${site.url}/#business`,
      name: site.name,
      description: site.description,
      url: site.url,
      email: "info@webdesign-elfe.de",
      image: `${site.url}/images/logo.webp`,
      logo: `${site.url}/images/logo.webp`,
      areaServed: { "@type": "Country", name: "Deutschland" },
      priceRange: "€€",
      knowsLanguage: "de",
      /* HINWEIS: Sobald die Region feststeht, hier eintragen — für lokale
         Suchanfragen („Webdesigner + Ort") ist das entscheidend:
         address: { "@type": "PostalAddress", addressLocality: "…",
                    postalCode: "…", addressCountry: "DE" } */
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Leistungen",
        itemListElement: [
          ...pricing.map((p) => ({
            "@type": "Offer",
            name: p.name,
            description: p.text,
            priceSpecification: {
              "@type": "PriceSpecification",
              priceCurrency: "EUR",
              minPrice: Number(p.from.replace(/[^0-9]/g, "")) || undefined,
              valueAddedTaxIncluded: false,
            },
            itemOffered: { "@type": "Service", name: p.name },
          })),
          ...addons
            .filter((a) => !a.included)
            .map((a) => ({
              "@type": "Offer",
              name: a.title,
              description: a.text,
              itemOffered: { "@type": "Service", name: a.title },
            })),
        ],
      },
    },
    {
      "@type": "Person",
      "@id": `${site.url}/#inhaberin`,
      name: "Ulrike Elferich",
      jobTitle: "Webdesignerin",
      worksFor: { "@id": `${site.url}/#business` },
      image: `${site.url}/images/portrait.webp`,
    },
    {
      "@type": "WebSite",
      "@id": `${site.url}/#website`,
      url: site.url,
      name: site.name,
      inLanguage: "de-DE",
      publisher: { "@id": `${site.url}/#business` },
    },
    {
      "@type": "FAQPage",
      "@id": `${site.url}/#faq`,
      mainEntity: faqItems.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="de"
      className="h-full scroll-smooth"
      /* Der Unterpfad wird einmal als Variable durchgereicht — CSS kann
         Umgebungswerte nicht selbst lesen. */
      style={{ ["--logo-quelle" as string]: `url('${medien("/images/logo.webp")}')` }}
    >
      <head>
        {/* Entscheidet VOR dem ersten Bild, ob die Eröffnung läuft, und
            beendet sie. Ein React-Bauteil käme dafür zu spät: gemessen
            erschien es erst nach 600 Millisekunden — da war die Seite
            längst sichtbar. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){try{var h=document.documentElement;" +
              "if(location.hash||sessionStorage.getItem('elfe-eroeffnung')==='1'||" +
              "matchMedia('(prefers-reduced-motion: reduce)').matches){h.className+=' ohne-eroeffnung';return;}" +
              "sessionStorage.setItem('elfe-eroeffnung','1');" +
              "var f=function(){h.className+=' eroeffnung-fertig';};" +
              "['pointerdown','keydown','wheel','touchstart'].forEach(function(e){" +
              "addEventListener(e,f,{once:true,passive:true});});" +
              "setTimeout(f,900);}catch(e){document.documentElement.className+=' ohne-eroeffnung';}})()",
          }}
        />
        <link
          rel="preload"
          as="image"
          href={medien("/images/logo.webp")}
          type="image/webp"
          fetchPriority="high"
        />
        {/* Schriften blockieren den Seitenaufbau nicht mehr: Sie werden
            nachgeladen und erst dann angewendet. */}
        <noscript>
        </noscript>
        <script
          dangerouslySetInnerHTML={{
            __html:
              "document.addEventListener('DOMContentLoaded',function(){var l=document.querySelector('link[media=\"print\"]');if(l)l.media='all';});",
          }}
        />
        <meta name="theme-color" content="#5e5a55" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-stone-950 text-parchment antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-[300] focus:bg-stone-900 focus:text-gold-bright focus:px-4 focus:py-2 focus:rounded"
        >
          Zum Inhalt springen
        </a>
        {/* Eröffnung: Der Vorhang steht direkt im ausgelieferten HTML und
            läuft über CSS. Ein React-Bauteil erschien erst nach der
            Hydration — also rund eine halbe Sekunde nachdem die Seite
            bereits sichtbar war. Ein Vorhang, der sich über eine schon
            gesehene Seite legt, ist schlimmer als keiner. */}
        <div className="eroeffnung" aria-hidden>
          <span className="eroeffnung-staub" />
          <span
            className="eroeffnung-logo"
            style={{ backgroundImage: `url('${medien("/images/logo.webp")}')` }}
          />
          <span className="eroeffnung-linie" />
        </div>

        <SanftesScrollen />
        <MagnetischeElemente />
        <BewegungsRahmen>{children}</BewegungsRahmen>
      </body>
    </html>
  );
}
