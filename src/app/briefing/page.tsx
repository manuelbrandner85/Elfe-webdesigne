import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Briefingformular from "@/components/Briefingformular";
import { briefing } from "@/data/briefing";
import { site } from "@/data/content";

export const metadata = {
  title: "Projekt-Briefing — Webdesign Elfe",
  description:
    "Das Briefing für Ihr Website-Projekt: sechs kurze Schritte, überwiegend zum Anklicken.",
  alternates: { canonical: `${site.url}/briefing/` },
  /* Diese Seite gehört nicht in die Suchergebnisse: Sie ist der zweite
     Schritt nach einer Anfrage, nicht ein Einstieg. Wer sie über Google
     fände, stünde vor Fragen zu einem Projekt, das es noch nicht gibt. */
  robots: { index: false, follow: false },
};

export default function BriefingSeite() {
  return (
    <>
      <Nav />
      <main className="flex-1 pt-40 pb-24">
        <div className="mx-auto max-w-3xl px-6 lg:px-8">
          <header className="auftritt mb-12 text-center">
            <p className="mb-4 text-[0.78rem] uppercase tracking-[0.2em] text-gold-text">
              {briefing.kicker}
            </p>
            <h1 className="font-serif-display text-shadow-elegant mb-5 text-[clamp(2rem,4.4vw,3rem)] leading-[1.12] text-parchment">
              {briefing.h1}
            </h1>
            <div className="rule-gold mx-auto mb-6 w-24" />
            <p className="mx-auto max-w-xl leading-relaxed text-silver">
              {briefing.intro}
            </p>
          </header>

          <Briefingformular />
        </div>
      </main>
      <Footer />
    </>
  );
}
