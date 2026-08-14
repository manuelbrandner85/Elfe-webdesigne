"use client";

import { useState } from "react";
import Bild from "@/components/Bild";
import { Sparkles, LayoutTemplate, Code2, Sun } from "lucide-react";
import SplitHeading from "@/components/SplitHeading";
import Verweis from "@/components/Verweis";
import { services } from "@/data/content";

const icons = { sparkles: Sparkles, layout: LayoutTemplate, code: Code2, sun: Sun };

/* Zeigt ein Foto, sobald eines vorhanden ist — sonst ein Goldmedaillon
   mit dem Symbol. So bleibt die Karte immer vollständig. */
function CardVisual({
  src,
  Icon,
}: {
  src?: string;
  Icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;
}) {
  const [failed, setFailed] = useState(false);

  if (src && !failed) {
    return (
      <div className="relative -mx-8 -mt-8 mb-7 h-40 overflow-hidden">
        <Bild
          src={src}
          alt=""
          fill
          sizes="(max-width: 640px) 100vw, 25vw"
          onError={() => setFailed(true)}
          className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
        />
        <span className="absolute inset-0 bg-[linear-gradient(to_top,rgba(30,27,24,0.92),rgba(30,27,24,0.25)_55%,transparent)]" />
        <span className="absolute inset-x-0 bottom-0 h-px bg-[linear-gradient(to_right,transparent,rgba(201,162,39,0.5),transparent)]" />
      </div>
    );
  }

  return (
    <div className="relative mb-7">
      <span className="relative inline-flex items-center justify-center w-14 h-14 rounded-full bg-[radial-gradient(circle_at_30%_25%,rgba(242,216,148,0.22),rgba(0,0,0,0.25))] border border-gold/35 shadow-[0_8px_22px_rgba(0,0,0,0.35),0_1px_0_rgba(255,250,240,0.12)_inset]">
        <Icon size={22} strokeWidth={1.4} className="text-gold-bright" />
      </span>
      <span className="absolute left-16 top-1/2 h-px w-[calc(100%-4.5rem)] -translate-y-1/2 bg-[linear-gradient(to_right,rgba(201,162,39,0.35),transparent)]" />
    </div>
  );
}

export default function Services() {
  return (
    <section id="leistungen" className="py-24 lg:py-28 scroll-mt-[100px]">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div
          className="auftritt text-center max-w-2xl mx-auto mb-14"
        >
          <p className="text-[0.78rem] tracking-[0.2em] uppercase text-gold-text mb-3">
            Leistungen
          </p>
          <SplitHeading
            as="h2"
            text="Leistungen für Ihren Auftritt"
            className="font-serif-display text-shadow-elegant text-[clamp(2rem,3.5vw,2.8rem)] text-parchment mb-4"
          />
          <div className="rule-gold w-24 mx-auto mb-5" />
          <p className="text-silver leading-relaxed">
            Logo, Website und laufende Betreuung aus einer Hand — abgestimmt auf
            Ihre Branche, Ihre Zielgruppe und Ihr Budget.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {services.map((s, i) => {
            const Icon = icons[s.icon as keyof typeof icons];
            return (
              <article
                key={s.title}
                className="enthuellung panel panel-hover group rounded-sm p-8 h-full flex flex-col overflow-hidden"
        style={{ ["--stufe" as string]: i }}>
                <CardVisual src={s.image} Icon={Icon} />

                <h3 className="font-serif-display text-xl text-parchment mb-2.5">
                  {s.title}
                </h3>
                <p className="text-silver text-sm leading-relaxed mb-5">{s.text}</p>

                {s.href && (
                  <Verweis
                    href={s.href}
                    className="text-[0.78rem] tracking-[0.12em] uppercase text-gold-text hover:text-gold-bright transition-colors mb-4 inline-flex items-center gap-1.5"
                  >
                    Mehr erfahren <span aria-hidden>→</span>
                  </Verweis>
                )}
                <ul className="space-y-1.5 border-t border-line pt-4 mt-auto">
                  {s.points.map((pt) => (
                    <li
                      key={pt}
                      className="text-[0.78rem] text-silver flex items-center gap-2"
                    >
                      <span className="w-1 h-1 rounded-full bg-gold shrink-0" />
                      {pt}
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
