"use client";

import { useEffect, useRef } from "react";
import DemoConceptCard from "@/components/DemoConceptCard";
import { useReduzierteBewegung } from "@/lib/bewegung";
import { motorHolen } from "@/lib/scrollmotor";
import type { demoConcepts } from "@/data/content";

type Konzept = (typeof demoConcepts)[number];

/* Die Designkonzepte als gepinnte Kapitel.

   Der Text auf der linken Seite bleibt stehen, während rechts die
   Beispiele durchlaufen. Das ist der Aufbau, den hochwertige Auftritte
   für Erzählpassagen nutzen: Man liest einmal und sieht dabei mehrere
   Belege, statt dreimal dasselbe Muster zu überfliegen.

   Zwei bewusste Grenzen:

   Erstens nur ab Tablet-Breite. Auf dem Handy ist kein Platz für zwei
   Spalten; dort bleiben die Karten schlicht untereinander — das liest
   sich besser als ein zusammengequetschtes Nebeneinander.

   Zweitens kein Abfangen des Scrollens. Gepinnt wird über ScrollTrigger
   auf dem echten Scrollverlauf; wer schnell scrollt, kommt schnell
   durch. Verfahren, die das Rad umdeuten, gelten zu Recht als Ärgernis. */
export default function KonzeptKapitel({ konzepte }: { konzepte: Konzept[] }) {
  const huelle = useRef<HTMLDivElement>(null);
  const text = useRef<HTMLDivElement>(null);
  const reduziert = useReduzierteBewegung();

  useEffect(() => {
    const el = huelle.current;
    const festerText = text.current;
    if (!el || !festerText || reduziert !== false) return;

    let aufraeumen: (() => void) | undefined;
    let abgebrochen = false;

    /* GSAP erst holen, wenn der Abschnitt in Sichtweite kommt.

       Vorher lud es beim Seitenaufbau — 44 KB für eine Passage, die die
       meisten Besucher erst nach mehreren Bildschirmhöhen erreichen und
       manche nie. */
    let starten: (() => void) | null = null;
    const naeheBeobachter = new IntersectionObserver(
      (eintraege) => {
        if (eintraege.some((e) => e.isIntersecting)) {
          naeheBeobachter.disconnect();
          starten?.();
        }
      },
      { rootMargin: "600px 0px" }
    );

    starten = () => {
    (async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (abgebrochen) return;
      gsap.registerPlugin(ScrollTrigger);

      /* Erst hier — wo ScrollTrigger tatsächlich gebraucht wird — bekommt
         die Scroll-Glättung ihren gemeinsamen Takt mit GSAP. Zwei
         getrennte Schleifen liefen minimal versetzt und ließen gepinnte
         Abschnitte zittern. */
      motorHolen((lenis) => {
        lenis.on("scroll", ScrollTrigger.update);
      });

      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px)", () => {
        const st = ScrollTrigger.create({
          trigger: el,
          start: "top 120px",
          end: () => `+=${el.scrollHeight - window.innerHeight + 200}`,
          pin: festerText,
          pinSpacing: false,
          anticipatePin: 1,
        });
        return () => st.kill();
      });

      aufraeumen = () => mm.revert();
    })();
    };

    naeheBeobachter.observe(el);

    return () => {
      naeheBeobachter.disconnect();
      abgebrochen = true;
      aufraeumen?.();
    };
  }, [reduziert]);

  return (
    <div
      ref={huelle}
      className="grid grid-cols-1 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] gap-10 lg:gap-16 items-start"
    >
      {/* Die Einleitung bleibt stehen, solange die Entwürfe laufen.

          Vorher stand sie oben und war nach dem ersten Entwurf durch —
          daneben blieben über anderthalb Bildschirme leere Fläche und
          zwei Entwürfe ohne jede Erklärung. Wer beim dritten Entwurf
          ankommt, hat den Satz, warum es drei sind, längst aus dem Bild
          verloren. Als stehende Spalte begleitet sie alle drei.

          Nur ab „lg": Darunter liegen die Entwürfe ohnehin untereinander,
          und eine klebende Textspalte auf dem Telefon nimmt dem Inhalt
          den halben Bildschirm. */}
      <div
        ref={text}
        className="min-w-0 lg:pt-6 lg:sticky lg:top-[136px] lg:self-start"
      >
        <p className="text-[0.72rem] tracking-[0.24em] uppercase text-gold-text mb-4">
          Drei Richtungen
        </p>
        <h3 className="font-serif-display text-shadow-elegant text-[clamp(1.5rem,2.4vw,2rem)] text-parchment leading-[1.2] mb-5">
          Dieselbe Sorgfalt,
          <br />
          drei Handschriften
        </h3>
        <div className="rule-gold w-16 mb-5" />
        <p className="text-silver text-[0.95rem] leading-relaxed">
          Ein Hofcafé braucht eine andere Sprache als ein Tischler und dieser
          eine andere als eine Gärtnerei. Farbe, Schrift und Aufbau entstehen
          aus dem Betrieb — nicht aus einer Vorlage.
        </p>
        <p className="text-silver/75 text-[0.82rem] leading-relaxed mt-5">
          Die gezeigten Betriebe sind erfunden und dienen der Veranschaulichung.
        </p>
      </div>

      {/* min-w-0 ist hier nicht kosmetisch: Rasterzellen schrumpfen
          standardmäßig nicht unter die Breite ihres Inhalts. Der
          Browserfenster-Nachbau ist breiter als ein 320-Pixel-Bildschirm
          und schob die ganze Seite zur Seite. */}
      <div className="grid gap-10 min-w-0">
        {konzepte.map((konzept, i) => (
          <DemoConceptCard key={konzept.slug} concept={konzept} index={i} />
        ))}
      </div>
    </div>
  );
}
