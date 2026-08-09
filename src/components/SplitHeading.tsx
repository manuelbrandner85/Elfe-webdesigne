"use client";

import { useEffect, useRef } from "react";
import type { ElementType } from "react";
import { useReduzierteBewegung } from "@/lib/bewegung";
import { inZeilenTeilen } from "@/lib/zeilen";

/* Enthüllt eine Überschrift Zeile für Zeile von unten.

   Ohne Bewegungsbibliothek: Der Browser kennt seine Zeilenumbrüche, die
   Bewegung läuft über CSS-Keyframes, und ausgelöst wird sie von einem
   Beobachter, den der Browser mitbringt. Das spart rund 60 KB gegenüber
   der vorherigen Lösung mit GSAP — bei gleichem Ergebnis.

   Der Text steht vollständig im Quelltext. Zerlegt wird erst nach dem
   Laden der Schriften; vorher stünden die Umbrüche an falscher Stelle. */
export default function SplitHeading({
  text,
  as: Tag = "h2",
  className = "",
  delay = 0,
}: {
  text: string;
  as?: ElementType;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLElement>(null);
  const reduziert = useReduzierteBewegung();

  useEffect(() => {
    const el = ref.current;
    if (!el || reduziert) return;

    let beobachter: IntersectionObserver | undefined;
    let abgebrochen = false;

    (async () => {
      try {
        await document.fonts.ready;
      } catch {
        /* ältere Browser — dann eben sofort */
      }
      if (abgebrochen || !ref.current) return;

      if (!inZeilenTeilen(el)) return;
      el.style.setProperty("--verzug", `${delay}s`);
      el.dataset.geteilt = "ja";

      beobachter = new IntersectionObserver(
        (eintraege) => {
          for (const e of eintraege) {
            if (e.isIntersecting) {
              el.dataset.sichtbar = "ja";
              beobachter?.disconnect();
            }
          }
        },
        {
          /* Früher auslösen: Der negative Wert ließ die Überschrift erst
             erscheinen, wenn sie schon weit im Bild stand — beim schnellen
             Scrollen sah man den Auftritt dadurch gar nicht, sondern nur
             das Ergebnis. */
          rootMargin: "0px 0px 8% 0px",
        }
      );
      beobachter.observe(el);
    })();

    return () => {
      abgebrochen = true;
      beobachter?.disconnect();
    };
  }, [text, delay, reduziert]);

  const Heading = Tag as ElementType;
  return (
    <Heading ref={ref} className={className} data-reveal>
      {text}
    </Heading>
  );
}
