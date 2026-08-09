import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import SplitHeading from "@/components/SplitHeading";
import StickyCta from "@/components/StickyCta";
import BackToTop from "@/components/BackToTop";
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
              <Link href="/" className="hover:text-gold-bright transition-colors">
                Startseite
              </Link>
              <span className="mx-2 text-gold/60">/</span>
              <Link href="/#portfolio" className="hover:text-gold-bright transition-colors">
                Referenzen
              </Link>
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

            <div className="flex flex-wrap gap-4">
              <Link
                href="/#kontakt"
                className="inline-flex items-center gap-2 border border-gold/70 text-gold-bright text-[0.8rem] tracking-[0.14em] uppercase px-8 py-4 rounded-sm bg-[linear-gradient(160deg,rgba(201,162,39,0.16),rgba(0,0,0,0.18))] hover:bg-[linear-gradient(160deg,#f2d894,#c9a227)] hover:text-[#2b2723] transition-all duration-400"
              >
                Projekt besprechen
              </Link>
              <Link
                href="/#portfolio"
                className="inline-flex items-center gap-2 border border-line text-silver-bright text-[0.8rem] tracking-[0.14em] uppercase px-8 py-4 rounded-sm bg-[linear-gradient(160deg,rgba(255,250,240,0.05),rgba(0,0,0,0.16))] hover:border-gold/70 hover:text-gold-bright transition-all duration-400"
              >
                Weitere Arbeiten
              </Link>
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
