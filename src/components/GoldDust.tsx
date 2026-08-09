"use client";

import { useEffect, useRef } from "react";

/* Goldstaub im Hero — bewusst als schlanke Zeichenfläche statt über eine
   3D-Bibliothek: dasselbe Bild bei rund einem Vierhundertstel der Datenmenge.
   Läuft nur, solange der Bereich sichtbar ist, und ruht bei reduzierter
   Bewegung vollständig. */
type Mote = {
  x: number;
  y: number;
  z: number;
  r: number;
  drift: number;
  phase: number;
};

export default function GoldDust() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext("2d", { alpha: true });
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    let motes: Mote[] = [];
    let raf = 0;
    let visible = true;

    const seed = () => {
      /* Auf Telefonen deutlich weniger Teilchen: Dieselbe Menge kostet
         dort spürbar Rechenzeit und Akku, ohne dass man den Unterschied
         sieht — die Fläche ist kleiner, die Teilchen liegen dichter. */
      const schmal = w < 768;
      const obergrenze = schmal ? 90 : 260;
      const teiler = schmal ? 5200 : 2600;
      const count = Math.round(Math.min(obergrenze, (w * h) / teiler));
      motes = Array.from({ length: count }, () => {
        const z = 0.35 + Math.random() * 0.65;
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          z,
          r: (0.5 + Math.random() * 1.5) * z,
          drift: (0.06 + Math.random() * 0.22) * z,
          phase: Math.random() * Math.PI * 2,
        };
      });
    };

    const resize = () => {
      const rect = cv.getBoundingClientRect();
      w = Math.max(1, rect.width);
      h = Math.max(1, rect.height);
      cv.width = Math.round(w * dpr);
      cv.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";
      for (const m of motes) {
        const sway = Math.sin(t * 0.0004 + m.phase) * 8 * m.z;
        const y = m.y - ((t * m.drift * 0.03) % (h + 40));
        const py = y < -20 ? y + h + 40 : y;
        const alpha = 0.18 + 0.42 * m.z;

        const g = ctx.createRadialGradient(
          m.x + sway,
          py,
          0,
          m.x + sway,
          py,
          m.r * 4
        );
        g.addColorStop(0, `rgba(245,226,171,${alpha})`);
        g.addColorStop(1, "rgba(245,226,171,0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(m.x + sway, py, m.r * 4, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalCompositeOperation = "source-over";
      if (visible && !reduce) raf = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize);

    if (reduce) {
      draw(0);
    } else {
      raf = requestAnimationFrame(draw);
    }

    const io = new IntersectionObserver(
      ([e]) => {
        visible = e.isIntersecting;
        if (visible && !reduce && !raf) raf = requestAnimationFrame(draw);
        if (!visible) {
          cancelAnimationFrame(raf);
          raf = 0;
        }
      },
      { threshold: 0 }
    );
    io.observe(cv);

    /* Auch anhalten, wenn der Tab in den Hintergrund geht. Ohne das rechnet
       die Zeichenfläche weiter, obwohl niemand hinsieht — das kostet Akku. */
    const tabWechsel = () => {
      if (document.hidden) {
        if (raf) cancelAnimationFrame(raf);
        raf = 0;
      } else if (visible && !reduce && !raf) {
        raf = requestAnimationFrame(draw);
      }
    };
    document.addEventListener("visibilitychange", tabWechsel);

    return () => {
      document.removeEventListener("visibilitychange", tabWechsel);
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      io.disconnect();
    };
  }, []);

  return <canvas ref={ref} aria-hidden className="w-full h-full block" />;
}
