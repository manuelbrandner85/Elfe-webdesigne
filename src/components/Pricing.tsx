"use client";

import SplitHeading from "@/components/SplitHeading";
import { Check, HardDrive, BookOpen, Download } from "lucide-react";
import { pricing, pricingNote, addons, addonNote } from "@/data/content";

export default function Pricing() {
  return (
    <section id="preise" className="py-24 lg:py-32 scroll-mt-[100px] bg-[rgba(0,0,0,0.10)] fade-edges">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <header
          className="auftritt text-center max-w-2xl mx-auto mb-14"
        >
          <p className="text-[0.78rem] tracking-[0.22em] uppercase text-gold-text mb-4">
            Preise
          </p>
          <SplitHeading as="h2" text="Transparente Festpreise" className="font-serif-display text-shadow-elegant text-[clamp(2rem,3.6vw,2.9rem)] text-parchment mb-5" />
          <div className="rule-gold w-24 mx-auto mb-5" />
          <p className="text-silver leading-relaxed">
            Sie wissen vorher, was Ihr Auftritt kostet — keine Stundenabrechnung,
            keine Überraschungen auf der Schlussrechnung.
          </p>
        </header>

        {/* Bewusst KEIN Stapel-Effekt auf dem Handy: Die Karten sind
            durchscheinend gestaltet, und beim Übereinanderschieben las man
            zwei Preise gleichzeitig. Ein Effekt, der die Kernaussage
            unleserlich macht, ist keiner. */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {pricing.map((p, i) => (
            <div
              key={p.name}
              className={`auftritt panel panel-hover rounded-sm p-8 h-full flex flex-col relative ${
                p.highlight ? "border-gold/55" : ""
              }`}
        style={{ ["--stufe" as string]: i }}>
              {p.highlight && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[0.6rem] tracking-[0.18em] uppercase px-3 py-1 rounded-full bg-[linear-gradient(160deg,#f2d894,#c9a227)] text-[#2b2723] font-medium whitespace-nowrap">
                  Am häufigsten gewählt
                </span>
              )}

              <h3 className="font-serif-display text-xl text-parchment mb-2">
                {p.name}
              </h3>
              <p className="font-serif-display text-[1.9rem] text-gold-gradient leading-none mb-1">
                {p.from}
              </p>
              {/* Der Monatsbeitrag steht direkt unter dem Einmalpreis:
                  Wer ihn erst im Kleingedruckten findet, fühlt sich
                  überrumpelt — das kostet Vertrauen. */}
              {p.monthly && (
                <p className="text-[0.82rem] text-silver mb-4">{p.monthly}</p>
              )}
              <p className="text-silver text-sm leading-relaxed mb-6">{p.text}</p>

              <ul className="space-y-2.5 border-t border-line pt-5 mb-7">
                {p.features.map((f) => (
                  <li
                    key={f}
                    className="text-[0.82rem] text-silver flex items-start gap-2.5"
                  >
                    <Check
                      size={13}
                      className="text-gold shrink-0 mt-[3px]"
                      strokeWidth={2.6}
                    />
                    {f}
                  </li>
                ))}
              </ul>

              <a
                data-magnetisch href="#kontakt"
                className={`mt-auto inline-flex items-center justify-center gap-2 text-[0.78rem] tracking-[0.14em] uppercase px-6 py-3.5 rounded-sm transition-all duration-400 ${
                  p.highlight
                    ? "bg-[linear-gradient(160deg,#f2d894,#c9a227)] text-[#2b2723] border border-gold-bright hover:shadow-[0_14px_32px_rgba(201,162,39,0.28)]"
                    : "border border-gold/70 text-gold-bright bg-[linear-gradient(160deg,rgba(201,162,39,0.16),rgba(0,0,0,0.18))] hover:bg-[linear-gradient(160deg,#f2d894,#c9a227)] hover:text-[#2b2723]"
                }`}
              >
                Anfrage senden
              </a>
              {/* Zweiter, ruhiger Weg: Wer noch nicht anfragen will, soll
                  nicht abspringen müssen, sondern nachlesen können. */}
              <a
                href={`/pakete/${p.name.toLowerCase()}`}
                className="mt-3 block text-center text-[0.75rem] tracking-[0.12em] uppercase text-silver hover:text-gold-bright transition-colors"
              >
                Was ist enthalten?
              </a>
            </div>
          ))}
        </div>

        <p className="text-center text-[0.78rem] text-silver max-w-2xl mx-auto mt-10 leading-relaxed">
          {pricingNote}{" "}
          {/* Der Verweis steht bewusst direkt bei den Preisen: Laufzeit,
              Zahlungsweise und Kündigung gehören zur Kaufentscheidung, nicht
              ins Kleingedruckte am Seitenende. */}
          <a
            href="/agb"
            className="text-gold-text underline underline-offset-4 hover:text-parchment transition-colors"
          >
            Laufzeit, Zahlung und Kündigung im Detail
          </a>
          .
        </p>

        {/* Zusatzleistung: Einrichtung beim Hosting-Anbieter */}
        <div className="mt-20">
          <div className="mb-8 flex items-center gap-4">
            <h3 className="text-[0.72rem] tracking-[0.24em] uppercase text-gold-text shrink-0">
              Hosting &amp; Veröffentlichung
            </h3>
            <span className="rule-gold flex-1" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            {addons.map((a, i) => {
              const Icon = a.icon === "server" ? HardDrive : BookOpen;
              return (
                <div
                  key={a.title}
                  className={`auftritt panel panel-hover rounded-sm p-8 h-full flex flex-col ${
                    a.included ? "" : "border-gold/45"
                  }`}
        style={{ ["--stufe" as string]: i }}>
                  <div className="flex flex-wrap items-start justify-between gap-3 mb-5">
                    <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[radial-gradient(circle_at_30%_25%,rgba(242,216,148,0.22),rgba(0,0,0,0.25))] border border-gold/35 shrink-0">
                      <Icon size={19} strokeWidth={1.5} className="text-gold-bright" />
                    </span>
                    <span
                      className={`text-[0.66rem] sm:text-[0.72rem] tracking-[0.1em] uppercase px-3 py-1.5 rounded-full max-w-full ${
                        a.included
                          ? "text-silver border border-line"
                          : "text-[#2b2723] bg-[linear-gradient(160deg,#f2d894,#c9a227)] font-medium"
                      }`}
                    >
                      {a.price}
                    </span>
                  </div>

                  <h4 className="font-serif-display text-xl text-parchment mb-2.5">
                    {a.title}
                  </h4>
                  <p className="text-silver text-sm leading-relaxed mb-6">{a.text}</p>

                  {/* Die Anleitung liegt zum Ansehen bereit, bevor jemand
                      sich entscheidet. Wer selbst hosten will, will vorher
                      wissen, worauf er sich einlässt - eine Aufzählung mit
                      drei Stichpunkten beantwortet das nicht.

                      Das Ziel-Attribut, weil ein PDF sonst die Seite
                      ersetzt und der Zurück-Weg im Betrachter endet. */}
                  {a.datei && (
                    <a
                      href={a.datei.pfad}
                      target="_blank"
                      rel="noopener"
                      download
                      className="group mb-6 flex items-center gap-3 rounded-sm border border-gold/40 bg-[linear-gradient(160deg,rgba(201,162,39,0.10),rgba(0,0,0,0.18))] px-4 py-3 transition-colors duration-300 hover:border-gold/75"
                    >
                      <Download
                        size={16}
                        strokeWidth={1.8}
                        className="text-gold-bright shrink-0 transition-transform duration-300 group-hover:translate-y-0.5"
                      />
                      <span className="min-w-0">
                        <span className="block text-[0.84rem] text-parchment truncate">
                          {a.datei.name}
                        </span>
                        <span className="block text-[0.72rem] text-silver">
                          Anleitung ansehen · {a.datei.groesse}
                        </span>
                      </span>
                    </a>
                  )}

                  <ul className="space-y-2 border-t border-line pt-5 mt-auto">
                    {a.points.map((pt) => (
                      <li
                        key={pt}
                        className="text-[0.82rem] text-silver flex items-start gap-2.5"
                      >
                        <Check size={13} className="text-gold shrink-0 mt-[3px]" strokeWidth={2.6} />
                        {pt}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>

          <p className="text-center text-[0.78rem] text-silver max-w-2xl mx-auto mt-8 leading-relaxed">
            {addonNote}
          </p>
        </div>
      </div>
    </section>
  );
}
