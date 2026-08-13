"use client";

import { useEffect, useRef } from "react";
import { useReduzierteBewegung } from "@/lib/bewegung";

/* Der Goldstaub am Schnitt zwischen alt und neu.

   Dies ist der eine überraschende Moment der Seite — und er trägt eine
   Aussage: Beim Ziehen zerfällt der alte Auftritt nicht einfach, er löst
   sich in Gold auf, aus dem der neue entsteht.

   Zwei getrennte Zuständigkeiten, und das ist der Kern:

   Der Aufbau (Zeichenfläche, Schleife) läuft EINMAL beim Einhängen. Das
   Erzeugen neuer Körner hängt an der Reglerstellung. Lägen beide im
   selben Effekt, würde jede Reglerbewegung die Schleife abräumen, bevor
   sie ein Bild zeichnen kann — dann entstehen Körner, aber man sieht nie
   eines. Genau dieser Fehler war in meinem ersten Versuch drin.

   Zurückhaltung: Körner entstehen nur, während sich der Griff bewegt.
   Bleibt er stehen, versiegt der Strom in Zehntelsekunden. Die Schleife
   hält an, sobald das letzte Korn erloschen ist. */
type Korn = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  leben: number;
  groesse: number;
};

const HOECHSTZAHL = 160;

export default function GoldSaum({ position }: { position: number }) {
  const flaeche = useRef<HTMLCanvasElement>(null);
  const saeen = useRef<((pos: number) => void) | null>(null);
  const reduziert = useReduzierteBewegung();

  /* Aufbau — genau einmal */
  useEffect(() => {
    if (reduziert) return;
    const cv = flaeche.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let b = 1;
    let h = 1;
    let koerner: Korn[] = [];
    let raf = 0;
    let letzte = -1;

    const messen = () => {
      const r = cv.getBoundingClientRect();
      b = Math.max(1, r.width);
      h = Math.max(1, r.height);
      cv.width = Math.round(b * dpr);
      cv.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    messen();
    const beobachter = new ResizeObserver(messen);
    beobachter.observe(cv);

    const zeichnen = () => {
      ctx.clearRect(0, 0, b, h);
      const lebende: Korn[] = [];
      for (const k of koerner) {
        k.leben -= 0.02;
        if (k.leben <= 0) continue;
        k.x += k.vx;
        k.y += k.vy;
        k.vy += 0.014;
        k.vx *= 0.985;
        ctx.beginPath();
        ctx.fillStyle = `rgba(242, 216, 148, ${Math.min(1, k.leben * 1.7) * 0.9})`;
        ctx.arc(k.x, k.y, k.groesse, 0, Math.PI * 2);
        ctx.fill();
        lebende.push(k);
      }
      koerner = lebende;
      raf = lebende.length ? requestAnimationFrame(zeichnen) : 0;
    };

    saeen.current = (pos: number) => {
      if (letzte < 0) {
        letzte = pos;
        return;
      }
      const strecke = Math.abs(pos - letzte);
      letzte = pos;
      if (strecke < 0.2) return;

      const x = (pos / 100) * b;
      const anzahl = Math.min(14, Math.round(strecke * 2.4));
      for (let i = 0; i < anzahl; i++) {
        if (koerner.length >= HOECHSTZAHL) break;
        koerner.push({
          x: x + (Math.random() - 0.5) * 5,
          y: Math.random() * h,
          vx: (Math.random() - 0.3) * 1.8,
          vy: (Math.random() - 0.55) * 1.1,
          leben: 0.55 + Math.random() * 0.75,
          groesse: 0.6 + Math.random() * 1.5,
        });
      }
      if (!raf) raf = requestAnimationFrame(zeichnen);
    };

    return () => {
      beobachter.disconnect();
      if (raf) cancelAnimationFrame(raf);
      saeen.current = null;
    };
  }, [reduziert]);

  /* Auslösung — bei jeder Reglerbewegung */
  useEffect(() => {
    saeen.current?.(position);
  }, [position]);

  if (reduziert) return null;

  return (
    <canvas
      ref={flaeche}
      aria-hidden
      className="pointer-events-none absolute inset-0 z-[var(--ebene-ueberlagerung)] h-full w-full"
    />
  );
}
