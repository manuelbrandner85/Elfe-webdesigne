"use client";

import { useEffect } from "react";
import { useReduzierteBewegung } from "@/lib/bewegung";
import { motorSetzen } from "@/lib/scrollmotor";

/* Sanftes Scrollen mit Lenis — ohne GSAP.

   Lenis ersetzt das Scrollen nicht, es glättet es: Ankerlinks,
   Tastaturbedienung, „position: sticky" und die Bildlaufleiste
   funktionieren weiter.

   Der eigene Taktgeber ist der Punkt: Vorher lief die Glättung über
   gsap.ticker — und zog damit GSAP auf jede Seite, auch auf solche ohne
   eine einzige gepinnte Passage. Rund 60 KB für nichts. */
export default function SanftesScrollen() {
  const reduziert = useReduzierteBewegung();

  useEffect(() => {
    if (reduziert) return;

    let stopp: (() => void) | undefined;
    let abgebrochen = false;

    (async () => {
      const { default: Lenis } = await import("lenis");
      if (abgebrochen) return;

      const lenis = new Lenis({
        duration: 1.05,
        easing: (t: number) => 1 - Math.pow(1 - t, 3),
        smoothWheel: true,
        touchMultiplier: 1.6,
      });
      motorSetzen(lenis);

      let raf = 0;
      const takt = (zeit: number) => {
        lenis.raf(zeit);
        raf = requestAnimationFrame(takt);
      };
      raf = requestAnimationFrame(takt);

      stopp = () => {
        cancelAnimationFrame(raf);
        motorSetzen(null);
        lenis.destroy();
      };
    })();

    return () => {
      abgebrochen = true;
      stopp?.();
    };
  }, [reduziert]);

  return null;
}
