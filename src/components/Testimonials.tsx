"use client";

import SplitHeading from "@/components/SplitHeading";
import { Check, Quote } from "lucide-react";
import { testimonials, zusagen } from "@/data/content";

export default function Testimonials() {
  return (
    <section aria-label="Kundenstimmen" className="py-24 lg:py-28">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <header
          className="auftritt text-center max-w-2xl mx-auto mb-14"
        >
          <p className="text-[0.78rem] tracking-[0.22em] uppercase text-gold-text mb-4">
            {testimonials.length ? "Kundenstimmen" : "Was Sie erwarten können"}
          </p>
          <SplitHeading
            as="h2"
            text={testimonials.length ? "Was Kunden sagen" : "Vier Zusagen, die vorher feststehen"} className="font-serif-display text-shadow-elegant text-[clamp(2rem,3.6vw,2.9rem)] text-parchment mb-5" />
          <div className="rule-gold w-24 mx-auto" />
        </header>

        {/* Erst wenn echte Stimmen vorliegen, werden sie gezeigt. Bis dahin
            stehen hier Zusagen, die jede für sich aus den Paketbedingungen
            belegt sind — statt erfundener Zitate, die als irreführende
            Werbung angreifbar wären. */}
        {testimonials.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {testimonials.map((t, i) => (
            <figure
              key={i}
              className="auftritt panel panel-hover rounded-sm p-8 h-full flex flex-col"
        style={{ ["--stufe" as string]: i }}>
              <Quote
                size={22}
                className="text-gold/70 mb-5 shrink-0"
                strokeWidth={1.5}
              />
              <blockquote className="font-serif-display italic text-[1.05rem] leading-relaxed text-parchment mb-6">
                „{t.quote}“
              </blockquote>
              <figcaption className="mt-auto border-t border-line pt-4">
                <span className="block text-sm text-parchment">{t.name}</span>
                <span className="block text-[0.75rem] tracking-[0.12em] uppercase text-gold-text mt-1">
                  {t.role}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-stretch">
            {zusagen.map((z, i) => (
              <div
                key={z.titel}
                className="auftritt panel panel-hover rounded-sm p-8 h-full flex flex-col text-left"
        style={{ ["--stufe" as string]: i }}>
                <Check
                  size={20}
                  className="text-gold/80 mb-5 shrink-0"
                  strokeWidth={1.6}
                />
                <h3 className="font-serif-display text-[1.15rem] text-parchment mb-3">
                  {z.titel}
                </h3>
                <p className="text-silver text-[0.95rem] leading-relaxed">
                  {z.text}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
