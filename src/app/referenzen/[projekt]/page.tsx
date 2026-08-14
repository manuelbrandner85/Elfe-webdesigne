import type { Metadata } from "next";
import Verweis from "@/components/Verweis";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import SplitHeading from "@/components/SplitHeading";
import StickyCta from "@/components/StickyCta";
import BackToTop from "@/components/BackToTop";
import Bild from "@/components/Bild";
import { medien } from "@/lib/pfad";
import { caseStudies, demoConcepts, site } from "@/data/content";

export function generateStaticParams() {
  return caseStudies.map((c) => ({ projekt: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ projekt: string }>;
}): Promise<Metadata> {
  const { projekt } = await params;
  const c = caseStudies.find((x) => x.slug === projekt);
  if (!c) return {};
  return {
    title: c.metaTitle,
    description: c.metaDescription,
    alternates: { canonical: `/referenzen/${c.slug}/` },
    openGraph: {
      title: c.metaTitle,
      description: c.metaDescription,
      url: `${site.url}/referenzen/${c.slug}/`,
      /* Ohne Bild zeigt jede geteilte Verknüpfung nur graue Schrift —
         bei einem Fallbeispiel, das von Gestaltung handelt, ist das
         die denkbar schlechteste Visitenkarte. */
      images: [{ url: `${site.url}/images/poster-${c.slug}.webp`, width: 1280, height: 720 }],
    },
  };
}

export default async function CasePage({
  params,
}: {
  params: Promise<{ projekt: string }>;
}) {
  const { projekt } = await params;
  const c = caseStudies.find((x) => x.slug === projekt);
  const concept = demoConcepts.find((d) => d.slug === projekt);
  if (!c || !concept) return null;

  /* Die Unterschriften stehen im Konzept, nicht in der Fallstudie — so
     bleibt es bei EINER Quelle, und Bild und Text koennen nicht
     auseinanderlaufen. */
  const galerieSchirm = concept.screens.find((x) => x.type === "gallery");
  const galerie =
    galerieSchirm && "items" in galerieSchirm && concept.galerie.length
      ? galerieSchirm.items
      : [];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: c.metaTitle,
        description: c.metaDescription,
        inLanguage: "de-DE",
        author: { "@id": `${site.url}/#inhaberin` },
        publisher: { "@id": `${site.url}/#business` },
        mainEntityOfPage: `${site.url}/referenzen/${c.slug}/`,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Startseite", item: site.url },
          {
            "@type": "ListItem",
            position: 2,
            name: "Referenzen",
            item: `${site.url}/#portfolio`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: concept.title,
            item: `${site.url}/referenzen/${c.slug}/`,
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Nav />
      <main id="main" className="flex-1">
        <section className="pt-[150px] pb-16">
          <div className="max-w-3xl mx-auto px-6 lg:px-8">
            <nav aria-label="Brotkrumen" className="mb-8 text-[0.75rem] text-silver">
              <Verweis href="/" className="hover:text-gold-bright transition-colors">
                Startseite
              </Verweis>
              <span className="mx-2 text-gold/60">/</span>
              <Verweis href="/#portfolio" className="hover:text-gold-bright transition-colors">
                Referenzen
              </Verweis>
              <span className="mx-2 text-gold/60">/</span>
              <span className="text-gold-text">{concept.title}</span>
            </nav>

            <p className="text-[0.78rem] tracking-[0.22em] uppercase text-gold-text mb-4">
              Fallbeispiel · {concept.tag}
            </p>
            <SplitHeading
              as="h1"
              text={concept.title}
              className="font-serif-display text-shadow-elegant text-[clamp(2.2rem,5vw,3.4rem)] text-parchment mb-6"
            />
            <div className="rule-gold w-24 mb-7" />
            <p className="text-silver text-lg leading-relaxed">{c.aufgabe}</p>

            <p className="mt-8 panel rounded-sm px-5 py-4 text-[0.82rem] text-silver leading-relaxed">
              Hinweis: {concept.title} ist ein erfundener Betrieb. Das Beispiel
              zeigt das Vorgehen und die Gestaltungsentscheidungen — nicht einen
              realen Auftrag.
            </p>
          </div>

          {/* Ein Fallbeispiel über Gestaltung, das keine Gestaltung zeigt,
              ist ein Widerspruch. Bis hierher stand auf diesen Seiten von
              oben bis unten nur Text.

              Das Bild steht breiter als die Textspalte, aber nicht ganz
              über die Seite: So bleibt der Lesefluss erhalten und das Bild
              bekommt trotzdem Gewicht. */}
          <figure className="enthuellung enthuellung-weit mx-auto mt-14 max-w-5xl px-6 lg:px-8">
            <div className="relative overflow-hidden rounded-sm border border-gold/30 shadow-[0_1px_0_rgba(255,250,240,0.12)_inset,0_30px_64px_rgba(0,0,0,0.45)]">
              <Bild
                src={medien(`/images/poster-${c.slug}.webp`)}
                alt={`Startseite des Designkonzepts ${concept.title} — ${concept.headline.replace(/\n/g, " ")}`}
                width={1280}
                height={720}
                sizes="(min-width: 1024px) 62rem, calc(100vw - 3rem)"
                priority
                className="block w-full h-auto"
              />
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(30,27,24,0.35),transparent_45%)]"
              />
            </div>
            <figcaption className="mt-3 text-[0.78rem] text-silver/80">
              {concept.domain} — Startseite des Konzepts
            </figcaption>
          </figure>
        </section>

        <section className="py-16 bg-[rgba(0,0,0,0.10)] fade-edges">
          <div className="max-w-3xl mx-auto px-6 lg:px-8">
            <h2 className="font-serif-display text-[clamp(1.5rem,2.8vw,2.1rem)] text-parchment mb-4">
              Ausgangslage
            </h2>
            <p className="text-silver leading-relaxed">{c.ausgangslage}</p>
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-3xl mx-auto px-6 lg:px-8">
            <h2 className="font-serif-display text-[clamp(1.5rem,2.8vw,2.1rem)] text-parchment mb-8">
              Vorgehen
            </h2>
            <ol className="space-y-6">
              {c.vorgehen.map((v, i) => (
                <li key={v.schritt} className="panel rounded-md p-6 flex gap-5">
                  <span className="shrink-0 w-10 h-10 rounded-full border border-gold/50 bg-stone-950 flex items-center justify-center font-serif-display text-gold-bright">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="font-serif-display text-lg text-parchment mb-1.5">
                      {v.schritt}
                    </h3>
                    <p className="text-silver text-sm leading-relaxed">{v.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="py-16 bg-[rgba(0,0,0,0.10)] fade-edges">
          <div className="max-w-3xl mx-auto px-6 lg:px-8">
            <h2 className="font-serif-display text-[clamp(1.5rem,2.8vw,2.1rem)] text-parchment mb-8">
              Warum so entschieden
            </h2>
            <dl className="space-y-5">
              {c.entscheidungen.map((e) => (
                <div key={e.was} className="panel rounded-md p-6">
                  <dt className="font-serif-display text-lg text-parchment mb-1.5">
                    {e.was}
                  </dt>
                  <dd className="text-silver text-sm leading-relaxed">{e.warum}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-3xl mx-auto px-6 lg:px-8">
            <h2 className="font-serif-display text-[clamp(1.5rem,2.8vw,2.1rem)] text-parchment mb-4">
              Ergebnis
            </h2>
            <p className="text-silver leading-relaxed mb-10">{c.ergebnis}</p>
          </div>

          {/* Die drei Aufnahmen aus der Galerie des Konzepts, mit denselben
              Unterschriften. Sie belegen den Text, statt ihn zu wiederholen. */}
          {galerie.length > 0 && (
            <div className="max-w-5xl mx-auto px-6 lg:px-8 mb-12">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {galerie.map((g, i) => (
                  <figure
                    key={g.title}
                    className="enthuellung"
                    style={{ ["--stufe" as string]: i }}
                  >
                    <div className="relative overflow-hidden rounded-sm border border-line">
                      <Bild
                        src={concept.galerie[i]}
                        alt={`${g.title} — ${g.meta}, Aufnahme aus dem Designkonzept ${concept.title}`}
                        width={640}
                        height={480}
                        breiten={[360, 640]}
                        sizes="(min-width: 640px) 20rem, calc(100vw - 3rem)"
                        className="block w-full h-auto"
                      />
                    </div>
                    <figcaption className="mt-2.5">
                      <span className="block text-[0.9rem] text-parchment">{g.title}</span>
                      <span className="block text-[0.78rem] text-silver/80">{g.meta}</span>
                    </figcaption>
                  </figure>
                ))}
              </div>
            </div>
          )}

          <div className="max-w-3xl mx-auto px-6 lg:px-8">

            <div className="flex flex-wrap gap-4">
              <Verweis
                href="/#kontakt"
                className="inline-flex items-center gap-2 border border-gold/70 text-gold-bright text-[0.8rem] tracking-[0.14em] uppercase px-8 py-4 rounded-sm bg-[linear-gradient(160deg,rgba(201,162,39,0.16),rgba(0,0,0,0.18))] hover:bg-[linear-gradient(160deg,#f2d894,#c9a227)] hover:text-[#2b2723] transition-all duration-400"
              >
                Projekt besprechen
              </Verweis>
              <Verweis
                href="/#portfolio"
                className="inline-flex items-center gap-2 border border-line text-silver-bright text-[0.8rem] tracking-[0.14em] uppercase px-8 py-4 rounded-sm bg-[linear-gradient(160deg,rgba(255,250,240,0.05),rgba(0,0,0,0.16))] hover:border-gold/70 hover:text-gold-bright transition-all duration-400"
              >
                Weitere Arbeiten
              </Verweis>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <StickyCta />
      <BackToTop />
    </>
  );
}
