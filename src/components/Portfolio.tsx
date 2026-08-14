"use client";

import { medien } from "@/lib/pfad";

import WerkstattGL from "@/components/WerkstattGL";
import { realProjects, demoConcepts } from "@/data/content";
import KonzeptKapitel from "@/components/KonzeptKapitel";
import ProjectFrame from "@/components/ProjectFrame";
import SplitHeading from "@/components/SplitHeading";

export default function Portfolio() {
  return (
    <section id="portfolio" className="py-24 lg:py-32 scroll-mt-[100px]">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <header
          className="auftritt text-center max-w-2xl mx-auto mb-16"
        >
          <p className="text-[0.78rem] tracking-[0.22em] uppercase text-gold-text mb-4">
            Referenzen
          </p>
          <SplitHeading
            as="h2"
            text="Arbeiten &amp; Designkonzepte"
            className="font-serif-display text-shadow-elegant text-[clamp(2rem,3.6vw,2.9rem)] text-parchment mb-5"
          />
          <div className="rule-gold w-24 mx-auto mb-5" />
          <p className="text-silver leading-relaxed">
            Eigene Designkonzepte, die zeigen, wie unterschiedlich ein Auftritt je
            nach Branche und Zielgruppe aussehen kann — vom ersten Entwurf bis zur
            fertigen Seite.
          </p>
        </header>

        {/* Kundenprojekte — der Block erscheint nur, wenn eines vorliegt.
            Eine leere Rubrik mit Überschrift wirkt wie eine Lücke. */}
        {realProjects.length > 0 && (
          <>
            <div className="mb-10 flex items-center gap-4">
              <h3 className="text-[0.72rem] tracking-[0.24em] uppercase text-gold-text shrink-0">
                {realProjects.length === 1 ? "Kundenprojekt" : "Kundenprojekte"}
              </h3>
              <span className="rule-gold flex-1" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
              {realProjects.map((pr, i) => (
                <ProjectFrame
                  key={pr.name}
                  index={i}
                  title={pr.name}
                  tag={pr.tag}
                  image={pr.image}
                  alt={pr.alt}
                  note={pr.caption}
                  surface="#12100c"
                  fit="contain"
                />
              ))}
            </div>
          </>
        )}

        {/* Designkonzepte — großformatig, damit die Gestaltung wirkt */}
        <div className="mb-10 flex items-center gap-4">
          <h3 className="text-[0.72rem] tracking-[0.24em] uppercase text-gold-text shrink-0">
            Designkonzepte
          </h3>
          <span className="rule-gold flex-1" />
        </div>

        {/* Die Entwürfe zuerst als bewegte Fläche — beim Scrollen geht
            einer in den nächsten über. Diese Passage ist die Arbeitsprobe
            in der Arbeitsprobe: Sie zeigt, was über CSS hinaus möglich
            ist. Darunter bleiben die Karten mit allen Angaben, damit
            nichts allein von WebGL abhängt. */}
        <div className="mb-16">
          <WerkstattGL
            bilder={demoConcepts.map((k) => medien(`/images/concept-${k.slug}.webp`))}
            beschriftungen={demoConcepts.map((k) => `${k.title} — ${k.tag}`)}
          />
        </div>

        <KonzeptKapitel konzepte={demoConcepts} />
      </div>
    </section>
  );
}
