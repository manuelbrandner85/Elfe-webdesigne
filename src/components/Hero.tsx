"use client";

import { medien } from "@/lib/pfad";

import dynamic from "next/dynamic";
import Bild from "@/components/Bild";
import { useRef } from "react";
import {
  m,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  type Variants,
} from "framer-motion";
import KopfSchleife from "@/components/KopfSchleife";
import { hero } from "@/data/content";
import { Check } from "lucide-react";

const GoldDust = dynamic(() => import("@/components/GoldDust"), { ssr: false });

/* Die Eröffnung dauert 900 Millisekunden. Genau so lange lief der
   Auftritt des Kopfbereichs bisher dahinter ab — unsichtbar, hinter dem
   Vorhang. Wer die Seite zum ersten Mal öffnete, sah den Vorhang
   aufgehen und darunter eine Seite, die bereits fertig dastand.

   Der Vorlauf verschiebt die Kette so, dass sie beginnt, wenn der
   Vorhang verschwindet. Wer die Eröffnung schon gesehen hat oder
   reduzierte Bewegung eingestellt hat, bekommt sie nicht — dann ist der
   Vorlauf null. Die Entscheidung trifft dasselbe Skript im Kopf der
   Seite, das auch den Vorhang steuert; hier wird sie nur gelesen. */
const VORHANG_MS = 900;

function vorlauf(): number {
  if (typeof document === "undefined") return 0;
  const k = document.documentElement.classList;
  return k.contains("ohne-eroeffnung") || k.contains("eroeffnung-fertig")
    ? 0
    : VORHANG_MS / 1000;
}

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 26 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      delay: vorlauf() + i * 0.12,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  }),
};

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  /* Unterschiedliche Geschwindigkeiten erzeugen räumliche Tiefe. */
  const textY = useTransform(scrollYProgress, [0, 1], [0, -70]);
  const artY = useTransform(scrollYProgress, [0, 1], [0, -170]);
  const heroFade = useTransform(scrollYProgress, [0, 0.85], [1, 0]);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 110, damping: 18 });
  const sy = useSpring(my, { stiffness: 110, damping: 18 });
  const rotateY = useTransform(sx, [-0.5, 0.5], ["-11deg", "11deg"]);
  const rotateX = useTransform(sy, [-0.5, 0.5], ["9deg", "-9deg"]);

  function handleTilt(e: React.MouseEvent<HTMLDivElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  }
  function resetTilt() {
    mx.set(0);
    my.set(0);
  }

  return (
    <section
      ref={heroRef}
      id="top"
      className="relative min-h-screen flex items-center pt-[112px] pb-16 overflow-hidden"
    >
      {/* Bewegter Goldschimmer statt starrem Verlauf. Bei reduzierter
          Bewegung und ohne WebGL bleibt der Steinton stehen. */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,252,245,0.05),transparent_62%)]" />
      <KopfSchleife />

      <div className="max-w-6xl mx-auto px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-10 items-center relative z-10 w-full">
        <m.div style={{ y: textY, opacity: heroFade }} className="text-center lg:text-left">
          <m.p
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={0}
            className="text-[0.78rem] tracking-[0.2em] uppercase text-gold-text mb-4"
          >
            {hero.eyebrow}
          </m.p>

          <m.h1
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={1}
            className="font-serif-display text-shadow-elegant text-[clamp(2.15rem,4.1vw,3.5rem)] leading-[1.22] text-parchment my-4"
          >
            Ihre Marke, von
            <br />
            Grund auf gestaltet
            <br />
            und{" "}
            <span className="font-script text-gold-gradient text-[1.15em] inline-block px-0.5">
              zum Leben
            </span>{" "}
            erweckt.
          </m.h1>

          <m.p
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={2}
            className="text-silver text-[0.98rem] sm:text-base max-w-xl mx-auto lg:mx-0 leading-relaxed mb-7"
          >
{hero.lede}
          </m.p>

          <m.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={3}
            className="flex flex-wrap gap-4 justify-center lg:justify-start"
          >
            <a
              data-magnetisch href="#kontakt"
              className="inline-flex items-center gap-2 border border-gold/70 text-gold-bright text-[0.8rem] tracking-[0.14em] uppercase px-8 py-4 rounded-sm bg-[linear-gradient(160deg,rgba(201,162,39,0.16),rgba(0,0,0,0.18))] shadow-[0_1px_0_rgba(255,250,240,0.08)_inset,0_10px_24px_rgba(0,0,0,0.34)] hover:bg-[linear-gradient(160deg,#f2d894,#c9a227)] hover:text-[#2b2723] hover:border-gold-bright hover:shadow-[0_14px_32px_rgba(201,162,39,0.28)] transition-all duration-400"
            >
              Kostenloses Erstgespräch
            </a>
            <a
              data-magnetisch href="#portfolio"
              className="inline-flex items-center gap-2 border border-line text-silver-bright text-[0.8rem] tracking-[0.14em] uppercase px-8 py-4 rounded-sm bg-[linear-gradient(160deg,rgba(255,250,240,0.05),rgba(0,0,0,0.16))] shadow-[0_1px_0_rgba(255,250,240,0.06)_inset,0_10px_24px_rgba(0,0,0,0.3)] hover:border-gold/70 hover:text-gold-bright transition-all duration-400"
            >
              Referenzen ansehen
            </a>
          </m.div>

          <m.ul
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={4}
            className="mt-7 flex flex-wrap gap-x-6 gap-y-3 justify-center lg:justify-start"
          >
            {hero.proof.map((p) => (
              <li key={p} className="flex items-center gap-2 text-[0.8rem] text-silver">
                <Check size={14} className="text-gold shrink-0" strokeWidth={2.5} />
                {p}
              </li>
            ))}
          </m.ul>
        </m.div>

        <m.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.1, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          style={{ y: artY }}
          onMouseMove={handleTilt}
          onMouseLeave={resetTilt}
          className="relative h-[260px] sm:h-[330px] lg:h-[420px] order-first lg:order-last [perspective:1100px]"
        >
          <div className="absolute inset-0">
            <GoldDust />
          </div>

          <m.div
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <m.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
              className="relative w-[68%] max-w-[330px] aspect-square"
            >
              <Bild
                src={medien("/images/logo.webp")}
                alt="Webdesign Elfe"
                fill
                sizes="(max-width: 768px) 70vw, 330px"
                className="object-contain drop-shadow-[0_24px_48px_rgba(0,0,0,0.5)]"
                priority
              />
            </m.div>
          </m.div>
        </m.div>
      </div>

      <a
        href="#leistungen"
        aria-label="Zu den Leistungen scrollen"
        className="hidden lg:flex absolute bottom-7 left-1/2 -translate-x-1/2 flex-col items-center gap-2.5 text-[0.68rem] tracking-[0.3em] uppercase text-silver hover:text-gold-bright transition-colors"
      >
        <span>Entdecken</span>
        <span className="w-px h-8 bg-gradient-to-b from-gold to-transparent animate-pulse" />
      </a>
    </section>
  );
}
