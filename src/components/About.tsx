"use client";

import { medien } from "@/lib/pfad";

import Bild from "@/components/Bild";
import SplitHeading from "@/components/SplitHeading";
import { about } from "@/data/content";

export default function About() {
  return (
    <section id="ueber" className="py-24 lg:py-28 scroll-mt-[100px] bg-[rgba(0,0,0,0.10)] fade-edges watermark">
      <div className="max-w-6xl mx-auto px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
        <figure
          className="enthuellung enthuellung-weit relative w-full max-w-[400px] mx-auto lg:mx-0"
        >
          {/* Rahmen: äußere Goldlinie, Passepartout aus Stein, feine
              Lichtkante innen — das Porträt sitzt darin wie ein gerahmtes
              Bild an der Wand. */}
          <div className="relative rounded-sm p-[10px] bg-[linear-gradient(160deg,rgba(255,250,240,0.09),rgba(0,0,0,0.26))] border border-gold/40 shadow-[0_1px_0_rgba(255,250,240,0.14)_inset,0_30px_64px_rgba(0,0,0,0.5)]">
            <div className="relative overflow-hidden rounded-[2px] border border-line bg-[linear-gradient(180deg,#6b665f_0%,#565149_58%,#453f39_100%)]">
              <Bild
                src={medien("/images/portrait.webp")}
                alt="Ulrike Elferich, Inhaberin von Webdesign Elfe"
                width={928}
                height={1152}
                sizes="(max-width: 1024px) 82vw, 420px"
                className="w-full h-auto block"
              />
            </div>

            {/* Goldene Eckwinkel */}
            {[
              "top-1.5 left-1.5 border-t border-l",
              "top-1.5 right-1.5 border-t border-r",
              "bottom-1.5 left-1.5 border-b border-l",
              "bottom-1.5 right-1.5 border-b border-r",
            ].map((pos) => (
              <span
                key={pos}
                aria-hidden
                className={`pointer-events-none absolute w-4 h-4 border-gold-bright/70 ${pos}`}
              />
            ))}
          </div>

          <figcaption className="mt-5 text-center lg:text-left">
            <span className="block font-serif-display text-lg text-parchment">
              Ulrike Elferich
            </span>
            <span className="block text-[0.72rem] tracking-[0.16em] uppercase text-gold-text mt-1">
              Ihre Ansprechpartnerin
            </span>
          </figcaption>
        </figure>

        <div className="text-center lg:text-left">
          <p
            className="auftritt text-[0.78rem] tracking-[0.2em] uppercase text-gold-text mb-3"
          >
            {about.kicker}
          </p>
          <h2
            className="auftritt font-serif-display text-shadow-elegant text-[clamp(2rem,3.5vw,2.8rem)] text-parchment mb-6"
            style={{ ["--stufe" as string]: 1 }}
          >
            {about.h2}
          </h2>
          <p
            className="auftritt text-silver leading-relaxed mb-6"
            style={{ ["--stufe" as string]: 2 }}
          >
{about.p1}
          </p>
          <blockquote
            className="auftritt border-l-2 border-gold pl-5 my-6 text-left"
            style={{ ["--stufe" as string]: 3 }}
          >
            <p className="font-serif-display italic text-lg text-gold-bright">
„{about.quote}“
            </p>
          </blockquote>
          <p
            className="auftritt text-silver leading-relaxed mb-8"
            style={{ ["--stufe" as string]: 4 }}
          >
{about.p2}
          </p>
          <a
            href="#kontakt"
            className="auftritt inline-flex items-center gap-2 border border-gold/70 text-gold-bright text-[0.8rem] tracking-[0.14em] uppercase px-8 py-4 rounded-sm bg-[linear-gradient(160deg,rgba(201,162,39,0.16),rgba(0,0,0,0.18))] shadow-[0_1px_0_rgba(255,250,240,0.08)_inset,0_10px_24px_rgba(0,0,0,0.34)] hover:bg-[linear-gradient(160deg,#f2d894,#c9a227)] hover:text-[#2b2723] hover:border-gold-bright hover:shadow-[0_14px_32px_rgba(201,162,39,0.28)] transition-all duration-400"
            style={{ ["--stufe" as string]: 5 }}
          >
            {about.cta}
          </a>
        </div>
      </div>

    </section>
  );
}
