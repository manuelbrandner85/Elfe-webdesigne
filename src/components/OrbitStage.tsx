"use client";

import { useEffect, useRef, useState } from "react";

/* Halbrunde Kamerafahrt von links auf den Laptop zu, während der Deckel
   aufklappt — als Bildtafel, nicht als Video.

   Warum kein Video: In App-internen Browsern (etwa innerhalb von Messenger-
   oder Social-Apps) ist die Videowiedergabe grundsätzlich gesperrt. Ein
   Bild lädt dort immer. Die 24 Einzelbilder liegen deshalb als eine
   einzige Bilddatei vor und werden je nach Scrollposition gezeichnet —
   das Verfahren hinter Apples Produktseiten. */

/* Zwei Fassungen derselben Kamerafahrt: quer für breite Bildschirme,
   hochkant fürs Handy. So muss auf dem Handy nichts beschnitten oder
   hochskaliert werden — das Bild ist von vornherein im richtigen Format. */
type Fassung = {
  tafel: string;
  endbild: string;
  spalten: number;
  zeilen: number;
  anzahl: number;
  screen: { left: number; top: number; width: number; height: number };
  verhaeltnis: number;
};

const QUER: Fassung = {
  tafel: "/images/laptop-tafel.webp",
  endbild: "/images/laptop-endbild.webp",
  spalten: 6,
  zeilen: 4,
  anzahl: 24,
  screen: { left: 23.52, top: 8.66, width: 55.45, height: 57.96 },
  /* Seitenverhältnis der Bildschirmfläche (Breite/Höhe), aus dem Bild
     gerechnet: 1284 × 0,5545 zu 716 × 0,5796. Ohne diesen Wert säße die
     Seite nicht bündig im Display. */
  verhaeltnis: (1284 * 0.5545) / (716 * 0.5796),
};

const HOCH: Fassung = {
  tafel: "/images/laptop-tafel-hoch.webp",
  endbild: "/images/laptop-endbild-hoch.webp",
  spalten: 4,
  zeilen: 6,
  anzahl: 24,
  screen: { left: 7.4, top: 37.46, width: 76.54, height: 29.75 },
  verhaeltnis: (716 * 0.7654) / (1284 * 0.2975),
};

/* Wo steht das Gerät in jedem Bild? Ausgemessen, damit der Ausschnitt auf
   schmalen Bildschirmen mitwandern kann. */
const SCHWERPUNKT = [
  0.248, 0.249, 0.247, 0.245, 0.242, 0.243, 0.25, 0.262, 0.266, 0.266, 0.272,
  0.29, 0.333, 0.398, 0.443, 0.468, 0.472, 0.462, 0.444, 0.44, 0.427, 0.4,
  0.394, 0.4,
];

const DESKTOP_WIDTH = 1440;
const FAHRT_ENDE = 0.55;

export default function OrbitStage({
  progress,
  onMissing,
}: {
  progress: number;
  onMissing: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const screenRef = useRef<HTMLDivElement>(null);
  const tafelRef = useRef<HTMLImageElement | null>(null);
  const endbildRef = useRef<HTMLImageElement | null>(null);
  const glattRef = useRef(0);
  const zielRef = useRef(0);
  const rafRef = useRef(0);
  const mausRef = useRef({ x: 0, y: 0 });

  const [bereit, setBereit] = useState(false);
  const [frameScale, setFrameScale] = useState(0.2);
  const [fassung, setFassung] = useState<Fassung>(QUER);
  const [rahmenHoehe, setRahmenHoehe] = useState(
    Math.round(DESKTOP_WIDTH / QUER.verhaeltnis)
  );

  zielRef.current = progress;

  useEffect(() => {
    /* Hochkant nur auf schmalen, hochformatigen Bildschirmen */
    const hoch =
      window.matchMedia("(max-width: 820px) and (orientation: portrait)").matches;
    setFassung(hoch ? HOCH : QUER);
  }, []);

  useEffect(() => {
    const tafel = document.querySelector(
      "img[data-orbit-tafel]"
    ) as HTMLImageElement | null;
    const endbild = document.querySelector(
      "img[data-orbit-endbild]"
    ) as HTMLImageElement | null;

    if (!tafel) {
      onMissing();
      return;
    }

    const fertig = () => {
      tafelRef.current = tafel;
      endbildRef.current =
        endbild && endbild.naturalWidth > 0 ? endbild : null;
      setBereit(true);
    };

    /* Das Bild kann längst geladen sein, bevor dieser Code läuft — dann
       tritt kein Ereignis mehr ein. Deshalb zuerst den Zustand prüfen. */
    if (tafel.complete && tafel.naturalWidth > 0) fertig();
    else {
      tafel.addEventListener("load", fertig, { once: true });
      tafel.addEventListener("error", () => onMissing(), { once: true });
    }
  }, [onMissing]);

  useEffect(() => {
    if (!bereit) return;

    const zeichne = () => {
      rafRef.current = requestAnimationFrame(zeichne);
      const c = canvasRef.current;
      const tafel = tafelRef.current;
      if (!c || !tafel) return;
      const ctx = c.getContext("2d");
      if (!ctx) return;

      /* Scrollglättung: die Kamera zieht sanft nach */
      glattRef.current += (zielRef.current - glattRef.current) * 0.11;
      const p = glattRef.current;

      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const w = c.clientWidth;
      const h = c.clientHeight;
      if (c.width !== Math.round(w * dpr) || c.height !== Math.round(h * dpr)) {
        c.width = Math.round(w * dpr);
        c.height = Math.round(h * dpr);
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      /* Welches Blatt geladen wurde, verrät sein Seitenverhältnis — das
         ist verlässlicher als eine Annahme, weil der Browser die Datei
         selbst auswählt. */
      const istHoch = tafel.naturalHeight > tafel.naturalWidth;
      const f = istHoch ? HOCH : QUER;
      const soll = Math.round(DESKTOP_WIDTH / f.verhaeltnis);
      if (soll !== rahmenHoehe) setRahmenHoehe(soll);
      const bw = tafel.naturalWidth / f.spalten;
      const bh = tafel.naturalHeight / f.zeilen;

      const fahrtP = Math.min(1, p / FAHRT_ENDE);
      const nr = Math.min(
        f.anzahl - 1,
        Math.max(0, Math.round(fahrtP * (f.anzahl - 1)))
      );

      const zoomP = Math.max(0, Math.min(1, (p - FAHRT_ENDE) / (0.92 - FAHRT_ENDE)));
      const zoomE =
        zoomP < 0.5 ? 4 * zoomP ** 3 : 1 - Math.pow(-2 * zoomP + 2, 3) / 2;
      const zoom = 1 + zoomE * (100 / f.screen.width - 1);

      /* Am Ende auf das scharfe Standbild wechseln */
      const amEnde = fahrtP > 0.985 && endbildRef.current;
      const quelle = amEnde
        ? (endbildRef.current as HTMLImageElement)
        : tafel;
      const qw = amEnde ? (quelle as HTMLImageElement).naturalWidth : bw;
      const qh = amEnde ? (quelle as HTMLImageElement).naturalHeight : bh;
      const sx = amEnde ? 0 : (nr % f.spalten) * bw;
      const sy = amEnde ? 0 : Math.floor(nr / f.spalten) * bh;

      /* Die Aufnahme wird nicht formatfüllend gestreckt, sondern in
         voller Größe hineingelegt — dadurch bleibt sie scharf. Der Rest
         der Fläche wird mit einer stark unscharfen, vergrößerten Fassung
         desselben Bildes gefüllt. Das wirkt wie geringe Schärfentiefe
         statt nach Notlösung und vermeidet das Hochskalieren, das die
         Pixel sichtbar machte. */
      const einpassen = Math.min(w / qw, h / qh);
      const fuellen = Math.max(w / qw, h / qh);
      /* Beim Hineinzoomen geht die Einpassung in Formatfüllung über */
      const grund = einpassen + (fuellen - einpassen) * zoomE;
      const skala = grund * zoom;
      const zw = qw * skala;
      const zh = qh * skala;

      /* Der Ausschnitt wandert nur bei der Querfassung mit, wenn sie auf
         einem schmalen Bildschirm beschnitten wird. Die Hochformat-Fassung
         passt ohnehin. */
      const folgt =
        !istHoch && zw > w ? SCHWERPUNKT[nr] : 0.5;
      const zielX = 0.5 + (folgt - 0.5) * (1 - zoomE);
      const zx = f.screen.left / 100 + f.screen.width / 200;
      const zy = f.screen.top / 100 + f.screen.height / 200;

      const par = (1 - zoomE) * 12;
      let ox =
        w / 2 - zw * (zoomE * zx + (1 - zoomE) * zielX) + mausRef.current.x * par;
      let oy =
        h / 2 - zh * (zoomE * zy + (1 - zoomE) * 0.5) +
        mausRef.current.y * par * 0.45;

      ox = zw >= w ? Math.min(0, Math.max(w - zw, ox)) : (w - zw) / 2;
      oy = zh >= h ? Math.min(0, Math.max(h - zh, oy)) : (h - zh) / 2;

      ctx.clearRect(0, 0, w, h);

      /* Unscharfer Hintergrund, solange das Bild die Fläche nicht füllt */
      if (zw < w - 1 || zh < h - 1) {
        const bs = Math.max(w / qw, h / qh) * 1.18;
        const bwid = qw * bs;
        const bhig = qh * bs;
        ctx.save();
        ctx.filter = "blur(34px) brightness(0.55) saturate(0.9)";
        ctx.drawImage(
          quelle,
          sx,
          sy,
          qw,
          qh,
          (w - bwid) / 2,
          (h - bhig) / 2,
          bwid,
          bhig
        );
        ctx.restore();
      }

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(quelle, sx, sy, qw, qh, ox, oy, zw, zh);

      /* Bildschirmfläche für die eingebettete Seite mitführen */
      const el = screenRef.current;
      if (el) {
        const l = ox + (f.screen.left / 100) * zw;
        const t = oy + (f.screen.top / 100) * zh;
        const sw = (f.screen.width / 100) * zw;
        const sh = (f.screen.height / 100) * zh;
        el.style.left = `${l}px`;
        el.style.top = `${t}px`;
        el.style.width = `${sw}px`;
        el.style.height = `${sh}px`;
        el.style.opacity = String(
          Math.max(0, Math.min(1, (fahrtP - 0.9) / 0.1))
        );
        if (sw > 0) {
          const s = sw / DESKTOP_WIDTH;
          if (Math.abs(s - frameScale) > 0.005) setFrameScale(s);
        }
      }
    };

    rafRef.current = requestAnimationFrame(zeichne);
    return () => cancelAnimationFrame(rafRef.current);
  }, [bereit, frameScale, fassung, rahmenHoehe]);

  useEffect(() => {
    const bewegt = (e: MouseEvent) => {
      mausRef.current = {
        x: (e.clientX / window.innerWidth - 0.5) * -2,
        y: (e.clientY / window.innerHeight - 0.5) * -2,
      };
    };
    window.addEventListener("mousemove", bewegt);
    return () => window.removeEventListener("mousemove", bewegt);
  }, []);

  const uebergabe = Math.max(0, Math.min(1, (progress - 0.93) / 0.07));

  return (
    <div
      className="absolute inset-0 overflow-hidden bg-black"
      style={{
        opacity: 1 - uebergabe,
        /* Sobald die Seite übernimmt, darf die Bühne keine Klicks mehr
           abfangen — sonst wären die Schaltflächen darunter unerreichbar,
           obwohl nichts mehr zu sehen ist. */
        pointerEvents: uebergabe > 0.5 ? "none" : "auto",
        visibility: uebergabe >= 1 ? "hidden" : "visible",
      }}
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* Die Bilder stehen im HTML — so kann die Einzeldatei-Vorschau sie
          einbetten, und sie laden auch dort, wo Videos gesperrt sind. */}
      <picture>
        <source
          media="(max-width: 820px) and (orientation: portrait)"
          srcSet={HOCH.tafel}
        />
        <img
          data-orbit-tafel
          src={QUER.tafel}
          alt=""
          aria-hidden
          decoding="async"
        style={{
          position: "absolute",
          width: 2,
          height: 2,
          opacity: 0.01,
          pointerEvents: "none",
            left: 0,
            bottom: 0,
          }}
        />
      </picture>
      <picture>
        <source
          media="(max-width: 820px) and (orientation: portrait)"
          srcSet={HOCH.endbild}
        />
        <img
          data-orbit-endbild
          src={QUER.endbild}
          alt=""
          aria-hidden
          decoding="async"
          style={{
            position: "absolute",
            width: 2,
            height: 2,
            opacity: 0.01,
            pointerEvents: "none",
            left: 0,
            bottom: 0,
          }}
        />
      </picture>

      {/* Die echte Website im Bildschirm */}
      <div
        ref={screenRef}
        className="absolute overflow-hidden pointer-events-none"
        style={{ opacity: 0, background: "var(--color-stone-950)" }}
      >
        <iframe
          src="/?screen=1"
          title="Die Website im Bildschirm"
          tabIndex={-1}
          scrolling="no"
          className="border-0"
          style={{
            width: `${DESKTOP_WIDTH}px`,
            height: `${rahmenHoehe}px`,
            transform: `scale(${frameScale})`,
            transformOrigin: "0 0",
            pointerEvents: "none",
            filter: "brightness(1.24) contrast(1.03)",
          }}
        />
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(112deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.03) 24%, transparent 46%)",
          }}
        />
      </div>

      {!bereit && (
        <span
          aria-hidden
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[0.62rem] tracking-[0.24em] uppercase text-silver/70"
        >
          Lädt …
        </span>
      )}
    </div>
  );
}
