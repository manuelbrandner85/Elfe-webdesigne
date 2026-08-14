import Verweis from "@/components/Verweis";
import { notFound } from "next/navigation";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { paketDetails, paketBedingungen } from "@/data/content";

export function generateStaticParams() {
  return paketDetails.map((p) => ({ paket: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ paket: string }>;
}) {
  const { paket } = await params;
  const d = paketDetails.find((x) => x.slug === paket);
  if (!d) return {};
  return {
    title: `Paket ${d.name} — ${d.preis}`,
    description: `${d.fuerWen} ${d.preis} einmalig, ${d.monatlich} für Hosting und Betreuung.`,
    alternates: { canonical: `/pakete/${d.slug}` },
  };
}

const ueberschrift =
  "font-serif-display text-shadow-elegant text-[1.5rem] text-parchment mt-14 mb-5";

export default async function PaketSeite({
  params,
}: {
  params: Promise<{ paket: string }>;
}) {
  const { paket } = await params;
  const d = paketDetails.find((x) => x.slug === paket);
  if (!d) notFound();

  return (
    <>
      <Nav />
      <main className="flex-1 pt-40 pb-24 max-w-3xl mx-auto px-6 lg:px-8">
        <p className="text-[0.78rem] tracking-[0.2em] uppercase text-gold-text mb-3">
          Paket
        </p>
        <h1
          lang="de"
          className="font-serif-display text-shadow-elegant text-3xl sm:text-4xl text-parchment mb-3 hyphens-auto [overflow-wrap:anywhere]"
        >
          {d.name}
        </h1>

        {/* Preis und Monatsbeitrag gleich unter dem Namen — wer erst
            scrollen muss, um die Kosten zu finden, wird misstrauisch. */}
        <p className="font-serif-display text-[2rem] text-gold-gradient leading-none">
          {d.preis}
        </p>
        <p className="text-silver mb-6">zzgl. {d.monatlich}</p>
        <div className="rule-gold w-24 mb-8" />

        <p className="text-silver text-lg leading-relaxed">{d.fuerWen}</p>

        <p className="mt-6 text-silver">
          <span className="text-gold-text">Zeitrahmen:</span> {d.dauer}
        </p>

        <h2 className={ueberschrift}>Was enthalten ist</h2>
        <div className="grid gap-5">
          {d.enthalten.map((e) => (
            <div
              key={e.titel}
              className="rounded-sm border border-line bg-[linear-gradient(160deg,rgba(255,250,240,0.04),rgba(0,0,0,0.2))] px-6 py-5"
            >
              <h3 className="font-serif-display text-[1.1rem] text-parchment mb-2">
                {e.titel}
              </h3>
              <p className="text-silver text-[0.95rem] leading-relaxed">
                {e.text}
              </p>
            </div>
          ))}
        </div>

        {/* Bewusst deutlich sichtbar: Wer hier abspringt, hätte sonst
            später enttäuscht dagestanden. */}
        <h2 className={ueberschrift}>Was nicht enthalten ist</h2>
        <div className="rounded-sm border border-gold/30 bg-[linear-gradient(160deg,rgba(201,162,39,0.08),rgba(0,0,0,0.2))] px-6 py-5">
          <p className="text-silver leading-relaxed">{d.nichtEnthalten}</p>
        </div>

        <h2 className={ueberschrift}>So läuft es ab</h2>
        <ol className="grid gap-5">
          {d.ablauf.map((s, i) => (
            <li key={s.schritt} className="flex gap-5">
              <span className="shrink-0 w-9 h-9 rounded-full border border-gold/40 flex items-center justify-center font-serif-display text-gold-bright">
                {i + 1}
              </span>
              <div>
                <h3 className="font-serif-display text-[1.1rem] text-parchment mb-1">
                  {s.schritt}
                </h3>
                <p className="text-silver text-[0.95rem] leading-relaxed">
                  {s.text}
                </p>
              </div>
            </li>
          ))}
        </ol>

        <h2 className={ueberschrift}>Laufzeit, Zahlung und Kündigung</h2>
        <dl className="grid gap-5">
          {[
            ["Laufzeit", paketBedingungen.laufzeit],
            ["Korrekturrunden", paketBedingungen.korrekturen],
            ["Zahlung", paketBedingungen.zahlung],
            ["Wenn Sie kündigen", paketBedingungen.kuendigung],
          ].map(([titel, text]) => (
            <div key={titel}>
              <dt className="text-[0.72rem] tracking-[0.18em] uppercase text-gold-text mb-1">
                {titel}
              </dt>
              <dd className="text-silver leading-relaxed">{text}</dd>
            </div>
          ))}
        </dl>

        {/* Die vier Punkte oben sind die Kurzfassung. Wer den vollen
            Wortlaut lesen will, soll ihn nicht suchen müssen — und beide
            Texte stammen ohnehin aus derselben Quelle, können also nicht
            auseinanderlaufen. */}
        <p className="mt-6 text-[0.92rem] text-silver">
          Der vollständige Wortlaut steht in den{" "}
          <Verweis
            href="/agb"
            className="text-gold-text underline underline-offset-4 hover:text-parchment transition-colors"
          >
            Allgemeinen Geschäftsbedingungen
          </Verweis>
          .
        </p>

        <h2 className={ueberschrift}>Fragen zu diesem Paket</h2>
        <div className="grid gap-5">
          {d.fragen.map((f) => (
            <div key={f.q}>
              <p className="text-parchment mb-1">{f.q}</p>
              <p className="text-silver text-[0.95rem] leading-relaxed">{f.a}</p>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-wrap gap-4">
          <Verweis
            href="/#kontakt"
            className="inline-flex items-center gap-2 border border-gold/70 text-gold-bright text-[0.8rem] tracking-[0.14em] uppercase px-8 py-4 rounded-sm bg-[linear-gradient(160deg,rgba(201,162,39,0.16),rgba(0,0,0,0.28))] hover:bg-[linear-gradient(160deg,#f2d894,#c9a227)] hover:text-[#2b2723] transition-all duration-400"
          >
            Kostenloses Erstgespräch
          </Verweis>
          <Verweis
            href="/#preise"
            className="inline-flex items-center gap-2 border border-line text-silver-bright text-[0.8rem] tracking-[0.14em] uppercase px-8 py-4 rounded-sm hover:border-gold/70 hover:text-gold-bright transition-all duration-400"
          >
            Pakete vergleichen
          </Verweis>
        </div>

        <p className="text-silver text-sm mt-12">
          <Verweis href="/" className="text-gold-bright hover:underline">
            ← Zurück zur Startseite
          </Verweis>
        </p>
      </main>
      <Footer />
    </>
  );
}
