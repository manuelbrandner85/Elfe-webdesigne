"use client";

import { useEffect, useRef, useState } from "react";
import LaptopSequence from "@/components/LaptopSequence";

/* Führt die Kamerafahrt und die eingesetzte Website zusammen:
   1. Die Kamera fährt von links im Bogen heran, der Deckel klappt auf.
   2. Steht der Deckel offen, erscheint im Bildschirm die echte Seite.
   3. Die Kamera fährt hinein, bis die Seite übernimmt. */

const OPEN_END = 0.55;
const DESKTOP_WIDTH = 1440; // die Seite lädt stets in Rechnerbreite

/* Bildschirmfläche im letzten Bild der Fahrt, in Prozent */
const SCREEN_QUER = { left: 26.3, top: 15.0, width: 47.5, height: 54.0 };
const SCREEN_HOCH = { left: 12.0, top: 34.0, width: 76.0, height: 30.0 };

export default function LaptopScene({
  progress,
  onMissing,
}: {
  progress: number;
  onMissing: () => void;
}) {
  const screenRef = useRef<HTMLDivElement>(null);
  const [hoch, setHoch] = useState(false);
  const [frameScale, setFrameScale] = useState(0.2);

  useEffect(() => {
    setHoch(window.matchMedia("(max-aspect-ratio: 3/4)").matches);
  }, []);

  useEffect(() => {
    const fit = () => {
      const el = screenRef.current;
      if (!el) return;
      const w = el.getBoundingClientRect().width;
      if (w > 0) setFrameScale(w / DESKTOP_WIDTH);
    };
    fit();
    window.addEventListener("resize", fit);
    const id = window.setInterval(fit, 250);
    return () => {
      window.removeEventListener("resize", fit);
      window.clearInterval(id);
    };
  }, [progress]);

  const S = hoch ? SCREEN_HOCH : SCREEN_QUER;

  const openP = Math.min(1, progress / OPEN_END);
  /* Die Seite erscheint erst bei ganz offenem Deckel */
  const sichtbar = Math.max(0, Math.min(1, (openP - 0.94) / 0.06));

  const zoomP = Math.max(0, Math.min(1, (progress - OPEN_END) / (0.93 - OPEN_END)));
  const zoomE = zoomP < 0.5 ? 4 * zoomP ** 3 : 1 - Math.pow(-2 * zoomP + 2, 3) / 2;
  const zoom = 1 + zoomE * (100 / S.width - 1);
  const uebergabe = Math.max(0, Math.min(1, (progress - 0.94) / 0.06));

  return (
    <div
      className="absolute inset-0 overflow-hidden bg-black"
      style={{ opacity: 1 - uebergabe }}
    >
      <div
        className="absolute inset-0"
        style={{
          transform: `scale(${zoom})`,
          transformOrigin: `${S.left + S.width / 2}% ${S.top + S.height / 2}%`,
          willChange: "transform",
        }}
      >
        <LaptopSequence
          progress={progress}
          openEnd={OPEN_END}
          onMissing={onMissing}
        />

        {/* Die echte Website im Bildschirm */}
        <div
          ref={screenRef}
          className="absolute overflow-hidden"
          style={{
            left: `${S.left}%`,
            top: `${S.top}%`,
            width: `${S.width}%`,
            height: `${S.height}%`,
            opacity: sichtbar,
            background: "var(--color-stone-950)",
            filter: `brightness(${(1.3 - zoomE * 0.3).toFixed(2)}) contrast(1.04)`,
            boxShadow: `0 0 ${70 * (1 - zoomE)}px rgba(242,216,148,0.18)`,
          }}
        >
          <iframe
            src="/?screen=1"
            title="Die Website im Bildschirm"
            tabIndex={-1}
            scrolling="no"
            className="border-0"
            style={{
              width: `${DESKTOP_WIDTH}px`,
              height: `${Math.round(DESKTOP_WIDTH * 0.63)}px`,
              transform: `scale(${frameScale})`,
              transformOrigin: "0 0",
              pointerEvents: "none",
            }}
          />
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(112deg, rgba(255,255,255,0.13) 0%, rgba(255,255,255,0.04) 24%, transparent 46%)",
              opacity: (1 - zoomE) * sichtbar,
            }}
          />
        </div>

        {/* Lichtschein des Bildschirms in den Raum */}
        <span
          aria-hidden
          className="pointer-events-none absolute"
          style={{
            left: `${S.left - 14}%`,
            top: `${S.top - 8}%`,
            width: `${S.width + 28}%`,
            height: `${S.height + 36}%`,
            background:
              "radial-gradient(ellipse at center, rgba(242,216,148,0.22), transparent 66%)",
            filter: "blur(44px)",
            opacity: sichtbar * (1 - zoomE * 0.8),
            mixBlendMode: "screen",
          }}
        />
      </div>
    </div>
  );
}
