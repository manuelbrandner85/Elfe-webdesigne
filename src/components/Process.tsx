"use client";

import { useRef } from "react";
import SplitHeading from "@/components/SplitHeading";
import { m, useScroll, useTransform } from "framer-motion";
import { process } from "@/data/content";

export default function Process() {
  const gridRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: gridRef,
    offset: ["start 0.85", "end 0.55"],
  });
  const lineWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section id="ablauf" className="py-24 lg:py-28 scroll-mt-[100px] bg-[rgba(0,0,0,0.10)] fade-edges">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div
          className="auftritt text-center max-w-2xl mx-auto mb-16"
        >
          <p className="text-[0.78rem] tracking-[0.2em] uppercase text-gold-text mb-3">
            Ablauf
          </p>
          <SplitHeading as="h2" text="In vier Schritten zur neuen Website" className="font-serif-display text-shadow-elegant text-[clamp(2rem,3.5vw,2.8rem)] text-parchment mb-5" />
          <div className="rule-gold w-24 mx-auto mb-5" />
          <p className="text-silver leading-relaxed">
            Ein klarer Ablauf mit festen Ansprechpartnern, planbaren Terminen und
            transparenten Kosten — von der ersten Idee bis zur Veröffentlichung.
          </p>
        </div>

        <div ref={gridRef} className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-12 gap-x-6">
          <div className="hidden lg:block absolute top-6 left-[12.5%] right-[12.5%] h-px bg-line overflow-hidden">
            <m.span
              style={{ width: lineWidth }}
              className="block h-full bg-[linear-gradient(to_right,rgba(201,162,39,0.35),#f2d894)]"
            />
          </div>
          {process.map((step, i) => (
            <div
              key={step.number}
              className="auftritt relative text-center lg:text-left"
        style={{ ["--stufe" as string]: i }}>
              <div className="relative z-10 w-12 h-12 rounded-full border border-gold/50 bg-stone-950 flex items-center justify-center font-serif-display text-base text-gold-bright mx-auto lg:mx-0 mb-5">
                {step.number}
              </div>
              <h3 className="font-serif-display text-xl text-parchment mb-2">
                {step.title}
              </h3>
              <p className="text-silver text-sm leading-relaxed">{step.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
