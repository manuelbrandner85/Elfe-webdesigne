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
import Bild from "@/components/Bild";
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
                className="auftritt group relative overflow-hidden rounded-sm border border-line bg-[linear-gradient(160deg,rgba(255,250,240,0.045),rgba(0,0,0,0.22))] hover:border-gold/50 transition-colors duration-500"
        style={{ ["--stufe" as string]: i }}>
                {/* Ein Bild sagt in einer halben Sekunde, was ein Piktogramm
                    erst nach dem Lesen der Überschrift sagt. Ein Tischler
                    erkennt eine Werkbank; ein Hammer-Zeichen erkennt er als
                    Zeichen. Das Symbol bleibt trotzdem — als Medaillon auf
                    dem Bild, damit die Karte ihre Ordnung behält. */}
                <div className="relative h-36 overflow-hidden">
                  <Bild
                    src={a.bild}
                    alt=""
                    fill
                    breiten={[360, 640]}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                  />
                  <span
                    aria-hidden
                    className="absolute inset-0 bg-[linear-gradient(to_top,rgba(30,27,24,0.94),rgba(30,27,24,0.30)_58%,transparent)]"
                  />
                  <span
                    aria-hidden
                    className="absolute inset-x-0 bottom-0 h-px bg-[linear-gradient(to_right,transparent,rgba(201,162,39,0.5),transparent)]"
                  />
                  <span className="absolute bottom-4 left-6 inline-flex items-center justify-center w-11 h-11 rounded-full border border-gold/45 bg-[radial-gradient(circle_at_35%_30%,rgba(242,216,148,0.22),rgba(0,0,0,0.45))] backdrop-blur-[2px]">
                    <Icon
                      size={19}
                      strokeWidth={1.4}
                      className="text-gold-bright"
                      aria-hidden
                    />
                  </span>
                </div>

                <div className="px-6 pt-5 pb-7">
                <h3 className="font-serif-display text-[1.15rem] text-parchment mb-2">
                  {a.titel}
                </h3>
                <p className="text-silver text-[0.92rem] leading-relaxed">
                  {a.nutzen}
                </p>
                </div>
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
