"use client";

import SplitHeading from "@/components/SplitHeading";
import {
  Hammer,
  Briefcase,
  UtensilsCrossed,
  Rocket,
  Stethoscope,
  Users,
} from "lucide-react";
import { audiences } from "@/data/content";

/* Sechs Karten mit einem Satz Nutzen statt zehn Schlagwörtern:
   Eine lange Aufzählung wirkt überfüllt und wird überflogen. Wenige
   klare Fälle mit konkretem Nutzen bleiben hängen. */
const icons = [Hammer, Briefcase, UtensilsCrossed, Rocket, Stethoscope, Users];

export default function Audience() {
  return (
    <section id="zielgruppen" className="py-24 lg:py-32 scroll-mt-[100px]">
      <div className="max-w-5xl mx-auto px-6 lg:px-8">
        <div
          className="auftritt text-center mb-14"
        >
          <p className="text-[0.78rem] tracking-[0.2em] uppercase text-gold-text mb-3">
            Für wen
          </p>
          <SplitHeading
            as="h2"
            text="Für wen ich gestalte"
            className="font-serif-display text-shadow-elegant text-[clamp(2rem,3.5vw,2.8rem)] text-parchment mb-5"
          />
          <div className="rule-gold w-24 mx-auto mb-5" />
          <p className="text-silver leading-relaxed max-w-xl mx-auto">
            Kleine Betriebe und Selbstständige, die einen Auftritt brauchen, der
            ihre Arbeit angemessen vertritt — ohne Agenturaufschlag.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {audiences.map((a, i) => {
            const Icon = icons[i % icons.length];
            return (
              <article
                key={a.titel}
                className="auftritt group relative rounded-sm border border-line bg-[linear-gradient(160deg,rgba(255,250,240,0.045),rgba(0,0,0,0.22))] px-6 py-7 hover:border-gold/50 transition-colors duration-500"
        style={{ ["--stufe" as string]: i }}>
                <span className="inline-flex items-center justify-center w-11 h-11 rounded-full border border-gold/35 bg-[radial-gradient(circle_at_35%_30%,rgba(242,216,148,0.16),transparent_70%)] mb-4">
                  <Icon
                    size={19}
                    strokeWidth={1.4}
                    className="text-gold-bright"
                    aria-hidden
                  />
                </span>
                <h3 className="font-serif-display text-[1.15rem] text-parchment mb-2">
                  {a.titel}
                </h3>
                <p className="text-silver text-[0.92rem] leading-relaxed">
                  {a.nutzen}
                </p>
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-x-6 bottom-0 h-px bg-[linear-gradient(90deg,transparent,rgba(201,162,39,0.5),transparent)] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                />
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
