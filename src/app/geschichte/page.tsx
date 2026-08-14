import Verweis from "@/components/Verweis";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { medien } from "@/lib/pfad";
import { site } from "@/data/content";

export const metadata = {
  title: "Man muss nicht groß anfangen — Meine Geschichte | Webdesign Elfe",
  description:
    "Eine Philosophie, ein Weg, eine Geschichte: warum jeder große Erfolg mit einem kleinen Anfang beginnt — und was das für Ihr eigenes Vorhaben bedeutet.",
  alternates: { canonical: `${site.url}/geschichte/` },
  openGraph: {
    title: "Man muss nicht groß anfangen, um Großes zu erreichen",
    description: "Eine Philosophie. Ein Weg. Meine Geschichte.",
    url: `${site.url}/geschichte/`,
    type: "article",
  },
};

/* Die Geschichte hinter dem Betrieb.

   WARUM DER TEXT AUF DER SEITE STEHT UND NICHT NUR IM BILD

   Die beiden Vorlagen tragen den kompletten Text als Pixel. Für das Auge
   ist das schön, für alles andere ist es ein Loch: Suchmaschinen lesen
   dort nichts, Vorleseprogramme lesen dort nichts, kopieren lässt sich
   nichts, und bei 1024 Pixeln Breite ist die Feinschrift auf einem
   Telefon schlicht nicht lesbar. Ein Text, der Menschen erreichen soll,
   darf nicht in einer Bilddatei eingesperrt sein.

   Deshalb steht die Erzählung hier als echter Text — in ihrem Wortlaut,
   unverändert. Die beiden Bilder bleiben, was sie sind: die Entwürfe zum
   Film, zwei Fassungen derselben Geschichte. Sie illustrieren, sie
   tragen nicht mehr die Last der Information.

   WARUM NICHT HOCHGERECHNET

   Die Vorlagen liegen bei 1024 × 1536. Hochrechnen wäre möglich — das
   Werkzeug dafür liegt im Projekt —, aber Real-ESRGAN ist auf Fotos
   trainiert und verschmiert feine Schrift eher, als dass es sie schärft.
   Bei Bildern, die zu drei Vierteln aus Typografie bestehen, wäre das
   ein Rückschritt. Stattdessen werden sie in der Größe gezeigt, in der
   sie scharf sind, mit einem Weg zur Originaldatei für alle, die die
   Feinschrift lesen wollen. */

const KAPITEL = [
  {
    zeit: "00:00 – 00:07",
    titel: "Der Anfang",
    zeilen: [
      "Manchmal beginnt eine große Geschichte ganz unscheinbar.",
      "Nicht mit einem riesigen Plan. Nicht mit viel Geld.",
      "Nicht mit perfekten Voraussetzungen.",
    ],
  },
  {
    zeit: "00:08 – 00:16",
    titel: "Der erste Schritt",
    zeilen: [
      "Manchmal beginnt sie mit einem kleinen Schritt, einer kleinen Idee –",
      "und vielleicht tatsächlich mit ein paar kleinen Brötchen.",
    ],
  },
  {
    zeit: "00:17 – 00:27",
    titel: "Der Beweis",
    zeilen: [
      "Denn wer bereit ist, klein anzufangen,",
      "der beweist etwas Entscheidendes: Er gibt nicht auf.",
    ],
  },
  {
    zeit: "00:28 – 00:40",
    titel: "Der Weg entsteht",
    zeilen: [
      "Aus einem kleinen Anfang kann Erfahrung entstehen.",
      "Aus Erfahrung entsteht Selbstvertrauen.",
      "Aus Selbstvertrauen entsteht Mut.",
      "Und aus Mut kann irgendwann etwas ganz Großes werden.",
    ],
  },
  {
    zeit: "00:41 – 00:55",
    titel: "Die Überzeugung",
    zeilen: [
      "Ich glaube nicht daran, dass man alles sofort können oder haben muss.",
      "Ich glaube daran, dass man anfangen muss.",
    ],
    hervorgehoben: true,
  },
  {
    zeit: "00:56 – 01:10",
    titel: "Zweifel und Umwege",
    zeilen: [
      "Vielleicht ist der erste Schritt klein.",
      "Vielleicht dauert der Weg länger als gedacht.",
      "Vielleicht muss man zwischendurch noch einmal ganz von vorne anfangen.",
    ],
  },
  {
    zeit: "01:11 – 01:22",
    titel: "Dranbleiben",
    zeilen: ["Aber solange man weitergeht, ist man nicht gescheitert."],
    hervorgehoben: true,
  },
  {
    zeit: "01:23 – 01:38",
    titel: "Aus klein wird groß",
    zeilen: [
      "Denn auch ein großes Unternehmen hat einmal mit einer einzigen Idee angefangen.",
      "Auch ein langer Weg beginnt mit dem ersten Schritt.",
      "Und auch aus kleinen Brötchen kann irgendwann eine ganze Bäckerei werden.",
    ],
  },
];

const FASSUNGEN = [
  {
    datei: "fassung-broetchen",
    titel: "Fassung I — Brötchen und Bäckerei",
    text:
      "Die persönliche Fassung. Sie erzählt in Bildern vom Schreibtisch, vom ersten Konzept und vom eigenen Laden — und behält das Bild von den kleinen Brötchen bis zum Schluss bei.",
    alt:
      "Entwurf zum Film „Man muss nicht groß anfangen“, Fassung I: Ein Bildraster aus zwölf Szenen in warmem Abendlicht — Schreibtisch mit Laptop, Brötchen und Kaffeetasse mit Logo, ein Keimling in Erde, ein handgezeichnetes Website-Konzept, ein Notizzettel, ein Sonnenuntergang am Meer und ein eigenes Ladengeschäft. Jede Szene trägt Zeitangabe und Text.",
  },
  {
    datei: "fassung-bleistift",
    titel: "Fassung II — Bleistift und Skizze",
    text:
      "Die zweite Fassung nimmt denselben Text und erzählt ihn entlang der Arbeit selbst: vom ersten Strich auf Papier über Zweifel und Fehlerseiten bis zur fertigen Website. Kapitel statt Zeitangaben.",
    alt:
      "Entwurf zum Film, Fassung II: Zwölf Szenen mit Kapitelüberschriften — ein Bleistift auf einem Notizbuch, eine Hand beim Zeichnen eines Seitenrasters, ein Ablaufdiagramm, ein Bildschirm mit Fehlerseite, eine fertige Website mit Bergpanorama. Jede Szene trägt Zeitangabe, Kapiteltitel und Text.",
  },
];

export default function Geschichte() {
  return (
    <>
      <Nav />
      <main className="flex-1">
        {/* Auftakt */}
        <section className="pt-40 pb-20 max-w-3xl mx-auto px-6 lg:px-8 text-center">
          <p className="text-[0.78rem] tracking-[0.2em] uppercase text-gold-text mb-5">
            Eine Philosophie. Ein Weg. Meine Geschichte.
          </p>
          <h1 className="font-serif-display text-shadow-elegant text-[clamp(2.1rem,5.2vw,3.6rem)] leading-[1.14] text-parchment mb-6">
            Man muss nicht groß anfangen,
            <br />
            um{" "}
            <span className="font-script text-gold-gradient text-[1.12em] inline-block px-0.5">
              Großes
            </span>{" "}
            zu erreichen.
          </h1>
          <div className="rule-gold mx-auto w-24 mb-8" />
          <p className="text-silver leading-relaxed text-lg">
            Jeder große Erfolg beginnt mit einem kleinen Anfang. Dies ist der
            Text eines kurzen Films — und zugleich das, woran ich bei jedem
            Projekt glaube.
          </p>
        </section>

        {/* Der Text des Films, Kapitel für Kapitel */}
        <section
          aria-label="Der Text des Films"
          className="py-16 border-y border-line bg-[rgba(0,0,0,0.12)] fade-edges"
        >
          <div className="max-w-3xl mx-auto px-6 lg:px-8">
            {KAPITEL.map((k, i) => (
              <article
                key={k.zeit}
                className="auftritt grid grid-cols-1 sm:grid-cols-[7.5rem_1fr] gap-x-8 gap-y-2 py-8 border-t border-line first:border-t-0"
                style={{ ["--stufe" as string]: i % 3 }}
              >
                <p className="text-[0.72rem] tracking-[0.16em] uppercase text-gold-text pt-1 tabular-nums">
                  {k.zeit}
                </p>
                <div>
                  <h2 className="font-serif-display text-[1.3rem] text-parchment mb-3">
                    {k.titel}
                  </h2>
                  {/* Der Zeilenfall stammt aus der Vorlage und ist Teil des
                      Rhythmus — deshalb bleibt er erhalten, statt zu
                      Fließtext zusammengezogen zu werden. */}
                  <p
                    className={
                      k.hervorgehoben
                        ? "font-serif-display italic text-[1.15rem] leading-relaxed text-gold-bright"
                        : "text-silver leading-relaxed"
                    }
                  >
                    {k.zeilen.map((z, j) => (
                      <span key={j}>
                        {z}
                        {j < k.zeilen.length - 1 && <br />}
                      </span>
                    ))}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Die beiden Entwürfe */}
        <section
          aria-label="Entwürfe zum Film"
          className="py-20 max-w-6xl mx-auto px-6 lg:px-8"
        >
          <header className="auftritt max-w-2xl mx-auto text-center mb-12">
            <p className="text-[0.78rem] tracking-[0.2em] uppercase text-gold-text mb-4">
              Zwei Fassungen
            </p>
            <h2 className="font-serif-display text-shadow-elegant text-[clamp(1.8rem,3.4vw,2.6rem)] text-parchment mb-5">
              Derselbe Text, zwei Wege
            </h2>
            <div className="rule-gold mx-auto w-24 mb-5" />
            <p className="text-silver leading-relaxed">
              Bevor ein Film entsteht, entsteht ein Entwurf: Szene für Szene,
              mit Zeitangabe und Text. Hier sind beide — die Fassung, die vom
              eigenen Anfang erzählt, und die, die der Arbeit selbst folgt.
            </p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12">
            {FASSUNGEN.map((f, i) => {
              const pfad = medien(`/images/geschichte/${f.datei}`);
              return (
                <figure
                  key={f.datei}
                  className="enthuellung enthuellung-weit"
                  style={{ ["--stufe" as string]: i }}
                >
                  {/* Der Verweis führt auf die Originaldatei. Die Feinschrift
                      in den Entwürfen ist bei Darstellungsgröße bewusst nicht
                      lesbar — wer sie lesen will, soll sie öffnen können,
                      ohne dass die Seite dafür ein Fenster nachbauen muss. */}
                  <a
                    href={`${pfad}-1024.webp`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block relative rounded-sm p-[10px] bg-[linear-gradient(160deg,rgba(255,250,240,0.09),rgba(0,0,0,0.26))] border border-gold/40 shadow-[0_1px_0_rgba(255,250,240,0.14)_inset,0_30px_64px_rgba(0,0,0,0.5)] transition-colors duration-300 hover:border-gold/70"
                  >
                    <picture className="block overflow-hidden rounded-[2px] border border-line">
                      <source
                        type="image/avif"
                        sizes="(min-width: 1024px) 500px, calc(100vw - 3.5rem)"
                        srcSet={`${pfad}-640.avif 640w, ${pfad}-1024.avif 1024w`}
                      />
                      <source
                        type="image/webp"
                        sizes="(min-width: 1024px) 500px, calc(100vw - 3.5rem)"
                        srcSet={`${pfad}-640.webp 640w, ${pfad}-1024.webp 1024w`}
                      />
                      <img
                        src={`${pfad}-1024.webp`}
                        alt={f.alt}
                        width={1024}
                        height={1536}
                        loading="lazy"
                        decoding="async"
                        className="block w-full h-auto"
                      />
                    </picture>
                    <span className="mt-4 mb-1 flex items-center justify-center gap-2 text-[0.72rem] tracking-[0.16em] uppercase text-gold-text transition-colors duration-300 group-hover:text-gold-bright">
                      Entwurf in voller Größe öffnen
                      <span aria-hidden>↗</span>
                    </span>
                  </a>
                  <figcaption className="mt-5">
                    <h3 className="font-serif-display text-[1.2rem] text-parchment mb-2">
                      {f.titel}
                    </h3>
                    <p className="text-silver leading-relaxed text-[0.95rem]">
                      {f.text}
                    </p>
                  </figcaption>
                </figure>
              );
            })}
          </div>
        </section>

        {/* Schluss */}
        <section className="py-20 border-t border-line bg-[rgba(0,0,0,0.12)] fade-edges">
          <div className="auftritt max-w-2xl mx-auto px-6 lg:px-8 text-center">
            <p className="font-serif-display text-[clamp(1.7rem,3.6vw,2.4rem)] leading-[1.35] text-parchment mb-6">
              Klein anfangen.
              <br />
              <span className="font-script text-gold-gradient text-[1.15em]">
                Groß denken.
              </span>
              <br />
              Dranbleiben.
            </p>
            <p className="text-silver leading-relaxed mb-4">
              Und niemals unterschätzen, was aus einem kleinen Anfang entstehen
              kann. Denn manchmal ist das, was heute noch klein aussieht,
              bereits der Anfang von etwas ganz Großem.
            </p>
            <p className="text-[0.78rem] tracking-[0.2em] uppercase text-gold-text mb-10">
              Deine Geschichte. Dein Weg. Deine Zukunft.
            </p>

            <Verweis
              href="/#kontakt"
              data-magnetisch
              className="inline-flex items-center gap-2 border border-gold/70 text-gold-bright px-7 py-3 rounded-sm text-[0.82rem] tracking-[0.16em] uppercase transition-colors duration-300 hover:bg-gold/10"
            >
              Erzählen Sie mir Ihren Anfang
            </Verweis>

            <p className="text-silver text-sm mt-12">
              <Verweis href="/#ueber" className="text-gold-bright hover:underline">
                ← Zurück zu „Über mich“
              </Verweis>
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
