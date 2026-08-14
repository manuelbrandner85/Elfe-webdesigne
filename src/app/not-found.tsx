import Verweis from "@/components/Verweis";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata = { title: "Seite nicht gefunden" };

export default function NotFound() {
  return (
    <>
      <Nav />
      <main className="flex-1 flex items-center justify-center px-6 py-40 text-center">
        <div className="max-w-lg">
          <p className="font-serif-display text-gold-gradient text-[clamp(4rem,12vw,7rem)] leading-none mb-4">
            404
          </p>
          <h1 className="font-serif-display text-shadow-elegant text-[clamp(1.6rem,3vw,2.2rem)] text-parchment mb-4">
            Diese Seite gibt es nicht
          </h1>
          <div className="rule-gold w-24 mx-auto mb-5" />
          <p className="text-silver leading-relaxed mb-9">
            Vielleicht wurde die Adresse geändert oder hat sich ein Tippfehler
            eingeschlichen. Von der Startseite aus finden Sie alles Weitere.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Verweis
              href="/"
              className="inline-flex items-center gap-2 border border-gold/70 text-gold-bright text-[0.8rem] tracking-[0.14em] uppercase px-8 py-4 rounded-sm bg-[linear-gradient(160deg,rgba(201,162,39,0.16),rgba(0,0,0,0.18))] hover:bg-[linear-gradient(160deg,#f2d894,#c9a227)] hover:text-[#2b2723] transition-all duration-400"
            >
              Zur Startseite
            </Verweis>
            <Verweis
              href="/#kontakt"
              className="inline-flex items-center gap-2 border border-line text-silver-bright text-[0.8rem] tracking-[0.14em] uppercase px-8 py-4 rounded-sm bg-[linear-gradient(160deg,rgba(255,250,240,0.05),rgba(0,0,0,0.16))] hover:border-gold/70 hover:text-gold-bright transition-all duration-400"
            >
              Kontakt
            </Verweis>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
