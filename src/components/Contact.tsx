"use client";

import { m } from "framer-motion";
import Anfrageformular from "@/components/Anfrageformular";
import { contact } from "@/data/content";

/* Für echten Versand im Hintergrund hier die Adresse eines Formular-Dienstes
   eintragen (z. B. Formspree oder Web3Forms). Bleibt das Feld leer, öffnet das
   Formular stattdessen das E-Mail-Programm mit fertiger Nachricht. */

/* Pflicht sind nur Name, E-Mail und Nachricht. Alles Weitere ist
   freiwillig: Nach der Datenschutz-Grundverordnung dürfen nur Daten
   erhoben werden, die für den Zweck wirklich nötig sind — für eine erste
   Anfrage ist die Anschrift das nicht. Wer sie freiwillig angibt, erspart
   sich später eine Rückfrage. */



export default function Contact() {
  return (
    <section id="kontakt" className="py-24 lg:py-28 scroll-mt-[100px]">
      <div className="max-w-5xl mx-auto px-6 lg:px-8">
        <div
          className="auftritt text-center mb-10"
        >
          <p className="text-[0.78rem] tracking-[0.2em] uppercase text-gold-text mb-3">
            {contact.kicker}
          </p>
          <h2 className="font-serif-display text-shadow-elegant text-[clamp(2rem,3.5vw,2.8rem)] text-parchment mb-5">
            {contact.h2}
          </h2>
          <p className="text-silver max-w-xl mx-auto">
{contact.intro}
          </p>
        </div>

        <div
          className="auftritt flex flex-wrap gap-4 justify-center mb-14"
        >
          <a
            data-magnetisch href="#kontaktformular"
            className="inline-flex items-center gap-2 border border-gold/70 text-gold-bright text-[0.8rem] tracking-[0.14em] uppercase px-8 py-4 rounded-sm bg-[linear-gradient(160deg,rgba(201,162,39,0.16),rgba(0,0,0,0.18))] shadow-[0_1px_0_rgba(255,250,240,0.08)_inset,0_10px_24px_rgba(0,0,0,0.34)] hover:bg-[linear-gradient(160deg,#f2d894,#c9a227)] hover:text-[#2b2723] hover:border-gold-bright hover:shadow-[0_14px_32px_rgba(201,162,39,0.28)] transition-all duration-400"
          >
            Unverbindliche Anfrage senden
          </a>
          <a
            data-magnetisch href={`mailto:${contact.email}`}
            className="inline-flex items-center gap-2 border border-line text-silver-bright text-[0.8rem] tracking-[0.14em] uppercase px-8 py-4 rounded-sm bg-[linear-gradient(160deg,rgba(255,250,240,0.05),rgba(0,0,0,0.16))] shadow-[0_1px_0_rgba(255,250,240,0.06)_inset,0_10px_24px_rgba(0,0,0,0.3)] hover:border-gold/70 hover:text-gold-bright transition-all duration-400"
          >
            Kontakt aufnehmen
          </a>
        </div>

        <div
          id="kontaktformular"
          className="scroll-mt-[100px]"
        >
          <m.div
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "80px" }}
            transition={{ duration: 0.6 }}
            className="panel rounded-md p-7 md:p-8 mb-6"
          >
            {/* Die Kontaktangaben stehen als Streifen ÜBER dem Formular,
                nicht mehr als schmale Spalte daneben.

                Grund: Das Formular arbeitet jetzt mit Auswahlfeldern.
                In einer halben Spalte brach „Mehr Kunden und Anfragen
                gewinnen" über vier Zeilen um — gemessen, nicht vermutet.
                Auswahlfelder brauchen Breite, Kontaktangaben nicht. */}
            <p className="text-silver text-sm leading-relaxed mb-7">
              Ein unverbindliches Erstgespräch klärt in wenigen Minuten, ob wir
              zueinander passen — ohne Verpflichtung. Lieber direkt schreiben
              oder anrufen? Auch gut:
            </p>

            <dl className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <dt className="text-[0.68rem] tracking-[0.15em] uppercase text-gold-text mb-1">
                  Telefon
                </dt>
                <dd className="text-parchment text-sm">{contact.phone}</dd>
              </div>
              <div>
                <dt className="text-[0.68rem] tracking-[0.15em] uppercase text-gold-text mb-1">
                  E-Mail
                </dt>
                <dd>
                  <a
                    href={`mailto:${contact.email}`}
                    className="text-parchment text-sm hover:text-gold-bright transition-colors inline-flex items-center min-h-[44px] -my-3"
                  >
                    {contact.email}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-[0.68rem] tracking-[0.15em] uppercase text-gold-text mb-1">
                  WhatsApp
                </dt>
                <dd className="text-parchment text-sm">{contact.whatsapp}</dd>
              </div>
              <div>
                <dt className="text-[0.68rem] tracking-[0.15em] uppercase text-gold-text mb-1">
                  Adresse / Region
                </dt>
                <dd className="text-parchment text-sm">{contact.region}</dd>
              </div>
              <div>
                <dt className="text-[0.68rem] tracking-[0.15em] uppercase text-gold-text mb-1">
                  Erreichbarkeit
                </dt>
                <dd className="text-parchment text-sm">{contact.hours}</dd>
              </div>
            </dl>
          </m.div>

          <div>
            {/* Das Formular liegt in einem eigenen Bauteil: Es hat
                eigenen Zustand über drei Schritte, und Kontaktdaten
                daneben sind reine Anzeige. Zusammen in einer Datei
                hätte jeder Klick im Formular auch die Kontaktspalte
                neu durchgerechnet. */}
            <Anfrageformular />
          </div>
        </div>
      </div>
    </section>
  );
}

/* Ein Eingabefeld in der Gestaltung der Seite. */
