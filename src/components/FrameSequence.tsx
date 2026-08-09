"use client";

import { useEffect, useRef, useState } from "react";

/* Bildfolge auf einer Zeichenfläche — dasselbe Verfahren, das Apple auf
   seinen Produktseiten einsetzt. Der Grund ist nicht Ästhetik, sondern
   Verlässlichkeit: Auf iPhones weigert sich Safari regelmäßig, während des
   Scrollens in einem Video zu springen. Einzelbilder zu zeichnen
   funktioniert dagegen auf jedem Gerät.

   Die Bilder liegen als eine einzige Datei (Bildtafel) vor — ein Abruf
   statt vieler, und der Browser kann sie in einem Rutsch dekodieren. */

export type SheetInfo = {
  src: string;
  frames: number;
  cols: number;
  frameWidth: number;
  frameHeight: number;
};

export default function FrameSequence({
  sheet,
  progress,
  onReady,
  className = "",
}: {
  sheet: SheetInfo;
  progress: number; // 0 … 1
  onReady?: () => void;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const zielRef = useRef(0);
  const istRef = useRef(0);
  const rafRef = useRef(0);
  const [geladen, setGeladen] = useState(false);

  /* Bildtafel laden */
  useEffect(() => {
    let abgebrochen = false;
    const img = new Image();
    img.decoding = "async";
    img.onload = () => {
      if (abgebrochen) return;
      imgRef.current = img;
      setGeladen(true);
      onReady?.();
    };
    img.src = sheet.src;
    return () => {
      abgebrochen = true;
    };
  }, [sheet.src, onReady]);

  /* Zielwert aus dem Scrollen übernehmen */
  useEffect(() => {
    zielRef.current = Math.min(1, Math.max(0, progress));
  }, [progress]);

  /* Zeichenschleife mit Scrollglättung: Die Kamera zieht der
     Scrollposition sanft nach, statt hart zu folgen. Genau das
     unterscheidet eine hochwertige Umsetzung von einer groben. */
  useEffect(() => {
    if (!geladen) return;
    const cv = canvasRef.current;
    const img = imgRef.current;
    if (!cv || !img) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) istRef.current = zielRef.current;

    const groesse = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const r = cv.getBoundingClientRect();
      cv.width = Math.round(r.width * dpr);
      cv.height = Math.round(r.height * dpr);
    };
    groesse();
    window.addEventListener("resize", groesse);

    const zeichne = () => {
      const glaettung = reduce ? 1 : 0.14;
      istRef.current += (zielRef.current - istRef.current) * glaettung;

      const i = Math.min(
        sheet.frames - 1,
        Math.max(0, Math.round(istRef.current * (sheet.frames - 1)))
      );
      const sx = (i % sheet.cols) * sheet.frameWidth;
      const sy = Math.floor(i / sheet.cols) * sheet.frameHeight;

      /* Bildausschnitt formatfüllend zeichnen */
      const zw = cv.width;
      const zh = cv.height;
      const skal = Math.max(zw / sheet.frameWidth, zh / sheet.frameHeight);
      const bw = sheet.frameWidth * skal;
      const bh = sheet.frameHeight * skal;
      ctx.clearRect(0, 0, zw, zh);
      ctx.drawImage(
        img,
        sx,
        sy,
        sheet.frameWidth,
        sheet.frameHeight,
        (zw - bw) / 2,
        (zh - bh) / 2,
        bw,
        bh
      );

      rafRef.current = requestAnimationFrame(zeichne);
    };
    rafRef.current = requestAnimationFrame(zeichne);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", groesse);
    };
  }, [geladen, sheet]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={`block w-full h-full ${className}`}
    />
  );
}
