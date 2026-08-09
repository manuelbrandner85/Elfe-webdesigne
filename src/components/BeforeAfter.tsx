"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import GoldSaum from "@/components/GoldSaum";
import { m, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { MoveHorizontal } from "lucide-react";

/* Beispielhafte Gegenüberstellung: links ein typischer veralteter Auftritt,
   rechts eine zeitgemäße Umsetzung. Bei echten Projektbildern lassen sich
   die beiden Blöcke 1:1 durch <Image /> ersetzen. */

function OldSite() {
  return (
    <div className="absolute inset-0 bg-[#e9e9e4] text-[#1a1a1a] font-[Arial,sans-serif] overflow-hidden">
      <div className="h-7 bg-[#2a4a7a] flex items-center px-3">
        <span className="text-[9px] text-white font-bold tracking-wide">
          MUSTERBETRIEB GMBH
        </span>
      </div>
      <div className="h-5 bg-[#3d6099] flex items-center gap-3 px-3">
        {["Startseite", "Über uns", "Leistungen", "Kontakt", "Impressum"].map((n) => (
          <span key={n} className="text-[7px] text-white underline">
            {n}
          </span>
        ))}
      </div>
      <div className="p-3">
        <div className="text-[13px] font-bold text-[#2a4a7a] mb-1.5 underline">
          Herzlich Willkommen auf unserer Homepage!
        </div>
        <div className="text-[7.5px] leading-[1.5] mb-2 max-w-[85%]">
          Wir freuen uns, dass Sie den Weg auf unsere Internetpräsenz gefunden
          haben. Seit über 40 Jahren sind wir Ihr zuverlässiger Partner rund um
          Zimmerei und Innenausbau. Bitte beachten Sie unsere Öffnungszeiten.
        </div>
        <div className="flex gap-2 mb-2">
          <div className="w-16 h-12 bg-[#b9b9b0] border border-[#8a8a80]" />
          <div className="w-16 h-12 bg-[#b9b9b0] border border-[#8a8a80]" />
          <div className="w-16 h-12 bg-[#b9b9b0] border border-[#8a8a80]" />
        </div>
        <div className="text-[7px] text-[#0000ee] underline mb-1">
          » Hier klicken für mehr Informationen
        </div>
        <div className="text-[6.5px] text-[#666]">
          Letzte Aktualisierung: 14.03.2011 | Besucher: 004821
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-6 bg-[#2a4a7a] flex items-center justify-center">
        <span className="text-[6px] text-white">
          © 2011 Musterbetrieb GmbH – Alle Rechte vorbehalten
        </span>
      </div>
    </div>
  );
}

function NewSite() {
  return (
    <div className="absolute inset-0 bg-[#12181c] overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#d9a44122]">
        <span className="text-[9px] font-semibold tracking-[0.16em] text-[#d9a441]">
          MUSTERBETRIEB
        </span>
        <div className="flex items-center gap-2.5">
          {["Leistungen", "Referenzen", "Kontakt"].map((n) => (
            <span key={n} className="text-[6.5px] text-[#eef1f280]">
              {n}
            </span>
          ))}
          <span className="text-[6px] px-2 py-[3px] rounded-sm bg-[#d9a441] text-[#12181c]">
            Angebot
          </span>
        </div>
      </div>
      <div className="relative h-[118px]">
        <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_70%_20%,#3c4a52_0%,transparent_55%),radial-gradient(90%_70%_at_20%_80%,#6a5433_0%,transparent_60%),linear-gradient(155deg,#1d262c,#12181c)]" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.7),rgba(0,0,0,0.3)_55%,transparent)]" />
        <div className="relative h-full flex flex-col justify-center px-4 max-w-[72%]">
          <span className="text-[5.5px] tracking-[0.28em] text-[#d9a441] mb-1.5">
            ZIMMEREI &amp; INNENAUSBAU
          </span>
          <p className="text-[12.5px] font-bold uppercase leading-[1.16] text-[#eef1f2] mb-1.5">
            Meisterarbeit seit
            <br />
            drei Generationen
          </p>
          <p className="text-[6px] leading-[1.7] text-[#eef1f280] mb-2.5">
            Termintreu ausgeführt von einem eingespielten Team aus der Region.
          </p>
          <div className="flex gap-1.5">
            <span className="text-[6px] px-2.5 py-[5px] rounded-sm bg-[#d9a441] text-[#12181c] font-medium">
              Angebot anfragen
            </span>
            <span className="text-[6px] px-2.5 py-[5px] rounded-sm border border-[#d9a44166] text-[#eef1f2]">
              Referenzen
            </span>
          </div>
        </div>
      </div>
      <div className="px-4 py-3.5">
        <div className="grid grid-cols-3 gap-2">
          {[
            ["40+", "Jahre"],
            ["250", "Projekte"],
            ["12", "Mitarbeiter"],
          ].map(([v, l]) => (
            <div
              key={l}
              className="py-2 text-center rounded-sm bg-[#1b242a] border border-[#d9a4411f]"
            >
              <div className="text-[11px] font-bold text-[#d9a441] leading-none mb-1">
                {v}
              </div>
              <div className="text-[5px] uppercase tracking-[0.14em] text-[#eef1f280]">
                {l}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function BeforeAfter() {
  const [pos, setPos] = useState(4);
  const ref = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const dragging = useRef(false);
  const touched = useRef(false);
  const reduce = useReducedMotion();

  /* Der Bereich bleibt beim Scrollen stehen, der Regler wandert dabei
     von links nach rechts — sobald jemand selbst zieht, übernimmt er. */
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const driven = useTransform(scrollYProgress, [0.12, 0.78], [4, 96]);

  useEffect(() => {
    if (reduce) {
      setPos(50);
      return;
    }
    return driven.on("change", (v) => {
      if (!touched.current) setPos(Math.max(0, Math.min(100, v)));
    });
  }, [driven, reduce]);

  const setFromClientX = useCallback((clientX: number) => {
    if (!ref.current) return;
    touched.current = true;
    const r = ref.current.getBoundingClientRect();
    setPos(Math.min(100, Math.max(0, ((clientX - r.left) / r.width) * 100)));
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-label="Vorher-Nachher-Vergleich"
      className="relative bg-[rgba(0,0,0,0.10)] fade-edges h-auto lg:h-[230vh]"
    >
      <div className="lg:sticky lg:top-0 lg:h-screen lg:flex lg:items-center py-24 lg:py-0">
      <div className="max-w-5xl mx-auto px-6 lg:px-8 w-full">
        <m.header
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "80px" }}
          transition={{ duration: 0.7 }}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <p className="text-[0.78rem] tracking-[0.22em] uppercase text-gold-text mb-4">
            Relaunch
          </p>
          <h2 className="font-serif-display text-shadow-elegant text-[clamp(2rem,3.6vw,2.9rem)] text-parchment mb-5">
            Aus alt wird zeitgemäß
          </h2>
          <div className="rule-gold w-24 mx-auto mb-5" />
          <p className="text-silver leading-relaxed">
            Ziehen Sie den Regler, um den Unterschied zu sehen — links ein
            typischer Auftritt von vor zehn Jahren, rechts eine heutige Umsetzung.
          </p>
        </m.header>

        <m.div
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "80px" }}
          transition={{ duration: 0.7 }}
          ref={ref}
          onMouseDown={(e) => {
            dragging.current = true;
            setFromClientX(e.clientX);
          }}
          onMouseMove={(e) => dragging.current && setFromClientX(e.clientX)}
          onMouseUp={() => (dragging.current = false)}
          onMouseLeave={() => (dragging.current = false)}
          onTouchStart={(e) => setFromClientX(e.touches[0].clientX)}
          onTouchMove={(e) => setFromClientX(e.touches[0].clientX)}
          role="group"
          aria-label="Vergleich: alte gegenüber neuer Website"
          className="panel relative rounded-lg overflow-hidden aspect-[16/9] select-none cursor-ew-resize touch-none"
        >
          <NewSite />
          <div
            className="absolute inset-0 overflow-hidden"
            style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
          >
            <OldSite />
          </div>

          <span className="absolute top-3 left-3 text-[0.58rem] tracking-[0.16em] uppercase bg-black/60 backdrop-blur-sm text-silver-bright px-2.5 py-1 rounded-full border border-line pointer-events-none">
            Vorher
          </span>
          <span className="absolute top-3 right-3 text-[0.58rem] tracking-[0.16em] uppercase bg-black/60 backdrop-blur-sm text-gold-bright px-2.5 py-1 rounded-full border border-gold/30 pointer-events-none">
            Nachher
          </span>


          {/* Der Goldstaub am Schnitt — der eine überraschende Moment:

              Der alte Auftritt zerfällt zu Gold, aus dem der neue entsteht. */}

          <GoldSaum position={pos} />


          <div
            className="absolute top-0 bottom-0 w-px bg-gold-bright pointer-events-none"
            style={{ left: `${pos}%` }}
          >
            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[linear-gradient(160deg,#f2d894,#c9a227)] shadow-[0_6px_18px_rgba(0,0,0,0.45)] flex items-center justify-center">
              <MoveHorizontal size={17} className="text-[#2b2723]" strokeWidth={2.2} />
            </span>
          </div>

          <input
            type="range"
            min={0}
            max={100}
            value={pos}
            onChange={(e) => { touched.current = true; setPos(Number(e.target.value)); }}
            aria-label="Vergleich zwischen alter und neuer Website"
            className="absolute inset-x-0 bottom-0 w-full opacity-0 h-10 cursor-ew-resize focus-visible:opacity-100"
          />
        </m.div>

        <p className="text-center text-[0.76rem] text-silver mt-5">
          Beispielhafte Gegenüberstellung zur Veranschaulichung — weiterscrollen
          oder den Regler selbst ziehen.
        </p>
      </div>
      </div>
    </section>
  );
}
