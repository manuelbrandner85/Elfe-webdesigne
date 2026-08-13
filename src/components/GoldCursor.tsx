"use client";

import { useEffect, useRef, useState } from "react";

/* Feiner Goldring, der dem Zeiger folgt und über Schaltflächen aufgeht.
   Nur an Geräten mit Maus, nur ohne reduzierte Bewegung — der echte
   Mauszeiger bleibt sichtbar, damit nichts an Bedienbarkeit verloren geht. */
export default function GoldCursor() {
  const ring = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setOn(true);

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let cx = x;
    let cy = y;
    let scale = 1;
    let target = 1;
    let raf = 0;

    const move = (e: MouseEvent) => {
      x = e.clientX;
      y = e.clientY;
      const el = e.target as HTMLElement | null;
      target = el?.closest("a,button,[role=button],input,textarea") ? 1.9 : 1;
    };

    const loop = () => {
      cx += (x - cx) * 0.18;
      cy += (y - cy) * 0.18;
      scale += (target - scale) * 0.14;
      const el = ring.current;
      if (el) {
        el.style.transform = `translate3d(${cx - 16}px, ${cy - 16}px, 0) scale(${scale.toFixed(3)})`;
        el.style.opacity = scale > 1.4 ? "0.9" : "0.55";
      }
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", move, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("mousemove", move);
      cancelAnimationFrame(raf);
    };
  }, []);

  if (!on) return null;

  return (
    <div
      ref={ring}
      aria-hidden
      className="pointer-events-none fixed top-0 left-0 z-[var(--ebene-menue)] w-8 h-8 rounded-full border border-gold-bright/70 mix-blend-screen transition-opacity duration-300"
      style={{ willChange: "transform" }}
    />
  );
}
