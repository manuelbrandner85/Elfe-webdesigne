"use client";

import { useEffect, useState } from "react";
import { m, useScroll, useSpring } from "framer-motion";

/* Fortschrittsbalken.

   Kann der Browser Scroll-Zeitleisten (die meisten seit 2024), läuft der
   Balken rein über CSS auf dem Compositor — ohne eine einzige Berechnung
   im Hauptthread. Das ist spürbar flüssiger und kostet nichts.

   Ältere Browser bekommen weiterhin die bisherige Lösung mit Federung.
   Beides gleichzeitig darf nicht laufen, sonst überlagern sich zwei
   Maßstäbe und der Balken zuckt. */
export default function ScrollProgress() {
  const [ohneSkript, setOhneSkript] = useState<boolean | null>(null);

  useEffect(() => {
    setOhneSkript(
      typeof CSS !== "undefined" &&
        CSS.supports("animation-timeline", "scroll()")
    );
  }, []);

  const gestaltung =
    "fixed top-0 left-0 right-0 h-[2px] origin-left z-[150] bg-[linear-gradient(to_right,#8a6d1f,#c9a227,#f2d894)]";

  if (ohneSkript === null) return null;

  if (ohneSkript) {
    return (
      <div
        aria-hidden
        className={`scroll-fortschritt scroll-fortschritt-css ${gestaltung}`}
      />
    );
  }

  return <MitFederung className={`scroll-fortschritt ${gestaltung}`} />;
}

function MitFederung({ className }: { className: string }) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 26,
    restDelta: 0.001,
  });
  return <m.div style={{ scaleX }} aria-hidden className={className} />;
}
