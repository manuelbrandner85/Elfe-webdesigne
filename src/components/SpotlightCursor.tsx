"use client";

import { useEffect, useState } from "react";

/* Sehr dezenter warmer Lichtschein, der dem Mauszeiger folgt.
   Nur an Geräten mit Maus und nur ohne reduzierte Bewegung. */
export default function SpotlightCursor() {
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    const onMove = (e: MouseEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setPos({ x: e.clientX, y: e.clientY }));
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  if (!pos) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[var(--ebene-grund)] hidden min-[1140px]:block"
      style={{
        background: `radial-gradient(420px circle at ${pos.x}px ${pos.y}px, rgba(242,216,148,0.055), transparent 70%)`,
      }}
    />
  );
}
