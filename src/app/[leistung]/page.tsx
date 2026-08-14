import type { Metadata } from "next";
import Verweis from "@/components/Verweis";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import SplitHeading from "@/components/SplitHeading";
import StickyCta from "@/components/StickyCta";
import BackToTop from "@/components/BackToTop";
import { subPages, faqItems, site } from "@/data/content";

export function generateStaticParams() {
  return subPages.map((p) => ({ leistung: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ leistung: string }>;
}): Promise<Metadata> {
  const { leistung } = await params;
  const page = subPages.find((p) => p.slug === leistung);
  if (!page) return {};
  return {
    title: page.metaTitle,
    description: page.metaDescription,
    alternates: { canonical: `/${page.slug}/` },
    openGraph: {
      title: page.metaTitle,
      description: page.metaDescription,
      url: `${site.url}/${page.slug}/`,
    },
  };
}

export default async function LeistungPage({
  params,
}: {
  params: Promise<{ leistung: string }>;
}) {
  const { leistung } = await params;
  const page = subPages.find((p) => p.slug === leistung);
  if (!page) return null;

  const faqs = page.faqRefs.map((i) => faqItems[i]).filter(Boolean);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        name: page.title,
        description: page.metaDescription,
        serviceType: page.title,
        provider: { "@id": `${site.url}/#business` },
        areaServed: { "@type": "Country", name: "Deutschland" },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Startseite", item: site.url },
          {
            "@type": "ListItem",
            position: 2,
            name: page.title,
            item: `${site.url}/${page.slug}/`,
          },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
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
        <section className="pt-[150px] pb-20 lg:pb-24">
          <div className="max-w-3xl mx-auto px-6 lg:px-8">
            <nav aria-label="Brotkrumen" className="mb-8 text-[0.75rem] text-silver">
              <Verweis href="/" className="hover:text-gold-bright transition-colors">
                Startseite
              </Verweis>
              <span className="mx-2 text-gold/60">/</span>
              <span className="text-gold-text">{page.title}</span>
            </nav>

            <p className="text-[0.78rem] tracking-[0.22em] uppercase text-gold-text mb-4">
              {page.kicker}
            </p>
            <SplitHeading
              as="h1"
              text={page.title}
              className="font-serif-display text-shadow-elegant text-[clamp(2.2rem,5vw,3.6rem)] text-parchment mb-6"
            />
            <div className="rule-gold w-24 mb-7" />
            <p className="text-silver text-lg leading-relaxed">{page.lead}</p>
          </div>
        </section>

        {page.sections.map((sec, i) => (
          <section
            key={sec.h2}
            className={`py-16 lg:py-20 ${i % 2 === 1 ? "bg-[rgba(0,0,0,0.10)] fade-edges" : ""}`}
          >
            <div className="max-w-3xl mx-auto px-6 lg:px-8">
              <h2 className="font-serif-display text-[clamp(1.5rem,2.8vw,2.1rem)] text-parchment mb-4">
                {sec.h2}
              </h2>
              <p className="text-silver leading-relaxed">{sec.text}</p>
              {sec.points && (
                <ul className="mt-6 grid sm:grid-cols-3 gap-3">
                  {sec.points.map((pt) => (
                    <li
                      key={pt}
                      className="panel rounded-sm px-4 py-3 text-[0.85rem] text-silver"
                    >
                      {pt}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        ))}

        <section className="py-16 lg:py-20">
          <div className="max-w-3xl mx-auto px-6 lg:px-8">
            <h2 className="font-serif-display text-[clamp(1.5rem,2.8vw,2.1rem)] text-parchment mb-8">
              Häufige Fragen
            </h2>
            <dl className="space-y-6">
              {faqs.map((f) => (
                <div key={f.q} className="panel rounded-md p-6">
                  <dt className="font-serif-display text-lg text-parchment mb-2">
                    {f.q}
                  </dt>
                  <dd className="text-silver text-sm leading-relaxed">{f.a}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-12 flex flex-wrap gap-4">
              <Verweis
                href="/#kontakt"
                className="inline-flex items-center gap-2 border border-gold/70 text-gold-bright text-[0.8rem] tracking-[0.14em] uppercase px-8 py-4 rounded-sm bg-[linear-gradient(160deg,rgba(201,162,39,0.16),rgba(0,0,0,0.18))] hover:bg-[linear-gradient(160deg,#f2d894,#c9a227)] hover:text-[#2b2723] transition-all duration-400"
              >
                Unverbindlich anfragen
              </Verweis>
              <Verweis
                href="/#preise"
                className="inline-flex items-center gap-2 border border-line text-silver-bright text-[0.8rem] tracking-[0.14em] uppercase px-8 py-4 rounded-sm bg-[linear-gradient(160deg,rgba(255,250,240,0.05),rgba(0,0,0,0.16))] hover:border-gold/70 hover:text-gold-bright transition-all duration-400"
              >
                Preise ansehen
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
