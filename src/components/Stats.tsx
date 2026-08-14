"use client";

import { m } from "framer-motion";
import { stats } from "@/data/content";

/* Eine Ziffernwalze: die Spalte 0–9 fährt auf die Zielziffer. */
function Digit({ value, delay }: { value: number; delay: number }) {
  return (
    <span
      className="inline-block overflow-hidden align-bottom"
      style={{ height: "1em", lineHeight: "1em" }}
    >
      <m.span
        className="flex flex-col"
        initial={{ y: 0 }}
        whileInView={{ y: `-${value}em` }}
        viewport={{ once: true, margin: "80px" }}
        transition={{ duration: 1.3, delay, ease: [0.22, 1, 0.36, 1] }}
      >
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((d) => (
          <span key={d} style={{ height: "1em", lineHeight: "1em" }}>
            {d}
          </span>
        ))}
      </m.span>
    </span>
  );
}

function Counter({ to, suffix }: { to: number; suffix: string }) {
  const digits = String(to).split("");
  return (
    <span className="inline-flex items-end">
      <span className="sr-only">
        {to}
        {suffix}
      </span>
      <span aria-hidden className="inline-flex items-end">
        {digits.map((d, i) => (
          <Digit key={i} value={Number(d)} delay={0.1 + i * 0.12} />
        ))}
        {suffix}
      </span>
    </span>
  );
}

export default function Stats() {
  return (
    <section aria-label="Kennzahlen" className="py-16 border-y border-line">
      <div className="max-w-5xl mx-auto px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-3 gap-10 sm:gap-6 text-center">
        {stats.map((s, i) => (
          <div className="auftritt"
            key={s.label}
        style={{ ["--stufe" as string]: i }}>
            <p className="font-serif-display text-[2.6rem] leading-none text-gold-gradient mb-3">
              <Counter to={s.value} suffix={s.suffix} />
            </p>
            <p className="text-[0.82rem] text-silver leading-relaxed max-w-[16rem] mx-auto">
              {s.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
