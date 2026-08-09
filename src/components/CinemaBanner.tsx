"use client";

import { medien } from "@/lib/pfad";

import { useEffect, useRef } from "react";
import { m, useInView, useScroll, useTransform } from "framer-motion";

/* Ein Designkonzept als großflächige Kinoleinwand: das Video läuft über die
   volle Fensterbreite, während man daran vorbeiscrollt. */
export default function CinemaBanner() {
  const ref = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const inView = useInView(ref, { margin: "5%" });

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const scale = useTransform(scrollYProgress, [0, 1], [1.12, 1]);
  const y = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (inView) void v.play().catch(() => {});
    else v.pause();
  }, [inView]);

  return (
    <section
      ref={ref}
      aria-label="Designkonzept im Großformat"
      className="relative h-[75vh] min-h-[420px] overflow-hidden"
    >
      <m.div style={{ scale, y }} className="absolute inset-[-6%]">
        <video
          ref={videoRef}
          poster={medien("/images/concept-atelier.webp")}
          muted
          loop
          playsInline
          preload="none"
          aria-hidden
          className="w-full h-full object-cover"
        >
          <source src={medien("/videos/concept-atelier.webm")} type="video/webm" />
          <source src={medien("/videos/concept-atelier.mp4")} type="video/mp4" />
        </video>
      </m.div>

      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(20,18,16,0.86),rgba(20,18,16,0.45)_55%,rgba(20,18,16,0.2))]" />
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-stone-950 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-stone-950 to-transparent" />

      <div className="relative h-full flex items-center">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 w-full">
          <m.div
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "80px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-xl"
          >
            <p className="text-[0.72rem] tracking-[0.24em] uppercase text-gold-text mb-4">
              Designkonzept
            </p>
            <h2 className="font-serif-display text-shadow-elegant text-[clamp(1.9rem,4vw,3.1rem)] leading-[1.2] text-parchment mb-5">
              Jedes Projekt bekommt seine
              <br />
              eigene Bildsprache
            </h2>
            <div className="rule-gold w-24 mb-5" />
            <p className="text-silver leading-relaxed mb-8">
              Farben, Typografie und Bildwelt entstehen aus Ihrer Branche und
              Ihrer Zielgruppe — nicht aus einer Vorlage. So entsteht ein
              Auftritt, der wirklich nach Ihnen aussieht.
            </p>
            <a
              href="#portfolio"
              className="inline-flex items-center gap-2 border border-gold/70 text-gold-bright text-[0.8rem] tracking-[0.14em] uppercase px-8 py-4 rounded-sm bg-[linear-gradient(160deg,rgba(201,162,39,0.16),rgba(0,0,0,0.28))] hover:bg-[linear-gradient(160deg,#f2d894,#c9a227)] hover:text-[#2b2723] transition-all duration-400"
            >
              Konzepte ansehen
            </a>
          </m.div>
        </div>
      </div>
    </section>
  );
}
