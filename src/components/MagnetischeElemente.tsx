"use client";

import { useEffect } from "react";
import { useReduzierteBewegung } from "@/lib/bewegung";

/* Schaltflächen ziehen den Mauszeiger leicht an.

   Bewusst zurückhaltend: höchstens 8 Pixel Auslenkung. Stärker wirkt es
   wie ein Spielzeug und erschwert das Treffen — der Knopf weicht aus,
   während man ihn anklicken will.

   Nur mit echtem Zeigegerät. Auf Touch-Geräten gibt es keinen Zeiger, den
   man anziehen könnte, und die Berechnung liefe nutzlos mit. */
const AUSLENKUNG = 8;

export default function MagnetischeElemente() {
  const reduziert = useReduzierteBewegung();

  useEffect(() => {
    if (reduziert !== false) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const ziele = Array.from(
      document.querySelectorAll<HTMLElement>("[data-magnetisch]")
    );
    if (!ziele.length) return;

    const zustand = new Map<HTMLElement, { x: number; y: number }>();
    let raf = 0;

    const bewegt = (e: MouseEvent) => {
      for (const el of ziele) {
        const r = el.getBoundingClientRect();
        const mx = e.clientX - (r.left + r.width / 2);
        const my = e.clientY - (r.top + r.height / 2);
        const naehe = Math.hypot(mx, my);
        const reichweite = Math.max(r.width, r.height) * 0.9;
        if (naehe < reichweite) {
          const staerke = 1 - naehe / reichweite;
          zustand.set(el, {
            x: (mx / reichweite) * AUSLENKUNG * staerke,
            y: (my / reichweite) * AUSLENKUNG * staerke,
          });
        } else {
          zustand.set(el, { x: 0, y: 0 });
        }
      }
      if (!raf) raf = requestAnimationFrame(zeichnen);
    };

    const zeichnen = () => {
      raf = 0;
      for (const [el, z] of zustand) {
        el.style.transform = `translate3d(${z.x.toFixed(2)}px, ${z.y.toFixed(2)}px, 0)`;
      }
    };

    window.addEventListener("mousemove", bewegt, { passive: true });
    return () => {
      window.removeEventListener("mousemove", bewegt);
      if (raf) cancelAnimationFrame(raf);
      for (const el of ziele) el.style.transform = "";
    };
  }, [reduziert]);

  return null;
}
