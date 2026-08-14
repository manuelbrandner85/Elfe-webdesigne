import Verweis from "@/components/Verweis";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { contact } from "@/data/content";

export const metadata = {
  title: "Impressum — Webdesign Elfe",
  description:
    "Anbieterkennzeichnung nach § 5 DDG für Webdesign Elfe, Ulrike Elferich, Jork.",
  robots: { index: true, follow: true },
};

/* Hinweis zur Gestaltung dieser Seite:

   1. Der früher übliche Verweis auf die EU-Plattform zur Online-
      Streitbeilegung fehlt bewusst. Die Plattform wurde zum 20. Juli 2025
      abgeschaltet; ein Link liefe ins Leere und gilt als irreführend —
      genau dafür wird inzwischen abgemahnt.

   2. Die Steuernummer steht hier bewusst NICHT. Vorgeschrieben wäre nur
      eine Umsatzsteuer-Identifikationsnummer, sofern vorhanden — bei der
      Kleinunternehmerregelung gibt es in der Regel keine. Die Steuernummer
      gehört nicht ins Impressum und wird gelegentlich für Betrugsversuche
      missbraucht. */

const zeile = "text-silver leading-relaxed";
const ueberschrift =
  "font-serif-display text-shadow-elegant text-[1.35rem] text-parchment mt-10 mb-3";

export default function Impressum() {
  return (
    <>
      <Nav />
      <main className="flex-1 pt-40 pb-24 max-w-3xl mx-auto px-6 lg:px-8">
        <p className="text-[0.78rem] tracking-[0.2em] uppercase text-gold-text mb-3">
          Rechtliches
        </p>
        {/* Kleinere Grundgröße und Silbentrennung: „Datenschutzerklärung“
            ist bei 36 Pixeln breiter als ein 320er Bildschirm und würde
            sonst die ganze Seite auseinanderziehen. */}
        <h1
          lang="de"
          className="font-serif-display text-shadow-elegant text-3xl sm:text-4xl text-parchment mb-4 hyphens-auto [overflow-wrap:anywhere]"
        >
          Impressum
        </h1>
        <div className="rule-gold w-24 mb-10" />

        <h2 className={ueberschrift}>Angaben gemäß § 5 DDG</h2>
        <p className={zeile}>
          Ulrike Elferich
          <br />
          Webdesign Elfe
          <br />
          Auf dem Kamp 20
          <br />
          21635 Jork
        </p>

        <h2 className={ueberschrift}>Kontakt</h2>
        <p className={zeile}>
          Telefon:{" "}
          <a
            href="tel:+4915774214544"
            className="text-gold-bright hover:underline"
          >
            0157 74214544
          </a>
          <br />
          E-Mail:{" "}
          <a
            href={`mailto:${contact.email}`}
            className="text-gold-bright hover:underline"
          >
            {contact.email}
          </a>
        </p>

        <h2 className={ueberschrift}>Umsatzsteuer</h2>
        <p className={zeile}>
          Gemäß § 19 UStG wird keine Umsatzsteuer berechnet
          (Kleinunternehmerregelung).
        </p>
        <h2 className={ueberschrift}>
          Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV
        </h2>
        <p className={zeile}>
          Ulrike Elferich, Auf dem Kamp 20, 21635 Jork
        </p>

        <h2 className={ueberschrift}>Verbraucherstreitbeilegung</h2>
        <p className={zeile}>
          Ich bin nicht bereit und nicht verpflichtet, an
          Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle
          teilzunehmen.
        </p>

        <h2 className={ueberschrift}>Haftung für Inhalte</h2>
        <p className={zeile}>
          Als Diensteanbieterin bin ich für eigene Inhalte auf diesen Seiten
          nach den allgemeinen Gesetzen verantwortlich. Ich bin jedoch nicht
          verpflichtet, übermittelte oder gespeicherte fremde Informationen zu
          überwachen oder nach Umständen zu forschen, die auf eine
          rechtswidrige Tätigkeit hinweisen. Verpflichtungen zur Entfernung
          oder Sperrung der Nutzung von Informationen nach den allgemeinen
          Gesetzen bleiben hiervon unberührt. Sobald mir konkrete
          Rechtsverletzungen bekannt werden, entferne ich diese Inhalte
          umgehend.
        </p>

        <h2 className={ueberschrift}>Haftung für Links</h2>
        <p className={zeile}>
          Mein Angebot enthält Links zu externen Websites Dritter, auf deren
          Inhalte ich keinen Einfluss habe. Für diese fremden Inhalte kann ich
          keine Gewähr übernehmen; verantwortlich ist stets der jeweilige
          Anbieter. Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung
          auf mögliche Rechtsverstöße überprüft. Bei Bekanntwerden von
          Rechtsverletzungen entferne ich derartige Links umgehend.
        </p>

        <h2 className={ueberschrift}>Urheberrecht</h2>
        <p className={zeile}>
          Die durch mich erstellten Inhalte und Werke auf diesen Seiten
          unterliegen dem deutschen Urheberrecht. Vervielfältigung,
          Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der
          Grenzen des Urheberrechts bedürfen meiner schriftlichen Zustimmung.
          Soweit die Inhalte auf dieser Seite nicht von mir erstellt wurden,
          werden die Urheberrechte Dritter beachtet und entsprechend
          gekennzeichnet.
        </p>

        <p className="text-silver text-sm mt-14">
          <Verweis href="/" className="text-gold-bright hover:underline">
            ← Zurück zur Startseite
          </Verweis>
        </p>
      </main>
      <Footer />
    </>
  );
}
