"use client";

import { useEffect, useRef, useState } from "react";

/* Kamerafahrt als Bildfolge auf einer Zeichenfläche.
 *
 * Warum keine Videodatei: Auf iPhones verweigert Safari während des
 * Scrollens häufig das Springen im Video. Einzelbilder auf eine
 * Zeichenfläche zu zeichnen funktioniert dagegen überall zuverlässig —
 * genau deshalb setzen große Produktseiten dieses Verfahren ein.
 *
 * Die Bilder liegen als ein einziges Blatt (Sprite Sheet) vor, damit nur
 * eine Datei geladen werden muss.
 */

type Blatt = {
  quelle: string;
  spalten: number;
  zeilen: number;
  anzahl: number;
  breite: number; // Breite eines Einzelbildes
  hoehe: number;
  /* Bildschirmfläche im letzten Bild, in Prozent des Einzelbildes */
  screen: { left: number; top: number; width: number; height: number };
};

const QUER: Blatt = {
  quelle: "/images/laptop-fahrt.webp",
  spalten: 6,
  zeilen: 5,
  anzahl: 30,
  breite: 640,
  hoehe: 360,
  screen: { left: 26.3, top: 15.0, width: 47.5, height: 54.0 },
};

const HOCH: Blatt = {
  quelle: "/images/laptop-fahrt-hoch.webp",
  spalten: 5,
  zeilen: 6,
  anzahl: 30,
  breite: 360,
  hoehe: 640,
  screen: { left: 12.0, top: 34.0, width: 76.0, height: 30.0 },
};

export default function LaptopSequence({
  progress,
  openEnd = 0.55,
  onMissing,
}: {
  progress: number;
  openEnd?: number;
  onMissing: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const blattRef = useRef<HTMLImageElement | null>(null);
  const zielRef = useRef(0); // wohin die Kamera soll
  const istRef = useRef(0); // wo sie gerade ist (geglättet)
  const mausRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef(0);

  const [blatt, setBlatt] = useState<Blatt | null>(null);
  const [geladen, setGeladen] = useState(false);
  const [fehlt, setFehlt] = useState(false);

  /* Format wählen und Blatt laden */
  useEffect(() => {
    const hoch = window.matchMedia("(max-aspect-ratio: 3/4)").matches;
    const b = hoch ? HOCH : QUER;

    const img = new Image();
    img.decoding = "async";
    img.onload = () => {
      blattRef.current = img;
      setBlatt(b);
      setGeladen(true);
    };
    img.onerror = () => {
      setFehlt(true);
      onMissing();
    };
    img.src = b.quelle;
  }, [onMissing]);

  /* Zielwert aus dem Scrollen; die Glättung übernimmt die Schleife */
  useEffect(() => {
    zielRef.current = Math.min(1, progress / openEnd);
  }, [progress, openEnd]);

  /* Leichte Kameraverschiebung mit dem Zeiger */
  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const onMove = (e: MouseEvent) => {
      mausRef.current = {
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      };
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  /* Zeichenschleife mit Scrollglättung */
  useEffect(() => {
    if (!geladen || !blatt) return;
    const canvas = canvasRef.current;
    const img = blattRef.current;
    if (!canvas || !img) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let letztesBild = -1;

    const groesse = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.round(canvas.clientWidth * dpr);
      canvas.height = Math.round(canvas.clientHeight * dpr);
      letztesBild = -1;
    };
    groesse();
    window.addEventListener("resize", groesse);

    const zeichne = () => {
      rafRef.current = requestAnimationFrame(zeichne);

      /* Glättung: die Kamera zieht der Scrollposition nach.
         Ohne sie wirkt die Fahrt hart und mechanisch. */
      const ziel = zielRef.current;
      istRef.current = reduce
        ? ziel
        : istRef.current + (ziel - istRef.current) * 0.12;
      const p = istRef.current;

      const nr = Math.min(blatt.anzahl - 1, Math.round(p * (blatt.anzahl - 1)));

      const versatzX = reduce ? 0 : mausRef.current.x * 8;
      const versatzY = reduce ? 0 : mausRef.current.y * 5;

      if (nr === letztesBild && versatzX === 0 && versatzY === 0) return;
      letztesBild = nr;

      const sx = (nr % blatt.spalten) * blatt.breite;
      const sy = Math.floor(nr / blatt.spalten) * blatt.hoehe;

      /* Bild formatfüllend einpassen (wie object-cover) */
      const cw = canvas.width;
      const ch = canvas.height;
      const skala = Math.max(cw / blatt.breite, ch / blatt.hoehe);
      const zw = blatt.breite * skala;
      const zh = blatt.hoehe * skala;
      const zx = (cw - zw) / 2 + versatzX;
      const zy = (ch - zh) / 2 + versatzY;

      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, cw, ch);
      ctx.drawImage(img, sx, sy, blatt.breite, blatt.hoehe, zx, zy, zw, zh);
    };

    rafRef.current = requestAnimationFrame(zeichne);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", groesse);
    };
  }, [geladen, blatt]);

  if (fehlt) return null;

  return (
    <>
      <canvas
        ref={canvasRef}
        aria-hidden
        className="absolute inset-0 w-full h-full"
      />
      {!geladen && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-stone-950">
          <span className="text-[0.62rem] tracking-[0.26em] uppercase text-silver/70">
            Lädt …
          </span>
          <span className="block w-24 h-px bg-line overflow-hidden">
            <span className="block h-full w-1/3 bg-gold-bright animate-[slide_1.2s_ease-in-out_infinite]" />
          </span>
        </div>
      )}
    </>
  );
}
