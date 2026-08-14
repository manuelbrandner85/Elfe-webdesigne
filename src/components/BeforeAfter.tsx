"use client";

import { useCallback, useEffect, useRef } from "react";
import {
  m,
  useMotionTemplate,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "framer-motion";
import { MoveHorizontal } from "lucide-react";
import GoldSaum, { type GoldSaumGriff } from "@/components/GoldSaum";
import { useReduzierteBewegung } from "@/lib/bewegung";
import { medien } from "@/lib/pfad";

/* Der Vorher-Nachher-Vergleich.

   Gezeigt wird derselbe erfundene Betrieb zweimal: „Nordwerk Handwerk“ im
   Zustand von 2011 und im heutigen Konzept, das auf dieser Seite ohnehin
   schon vorkommt. Das ist der Grund, warum der Vergleich überhaupt etwas
   beweist — zwei fremde Seiten nebeneinander zeigen nur zwei Geschmäcker,
   derselbe Betrieb vorher und nachher zeigt eine Entscheidung.

   Warum echte Bilder und kein nachgebautes DOM:

   Die frühere Fassung zeichnete beide Auftritte als HTML nach — bei sechs
   bis neun Pixeln Schriftgröße, damit es in den Rahmen passte. Das war auf
   dem Handy unlesbar, brach bei jeder anderen Rahmenbreite anders um und
   kostete bei jedem Aufbau Rechenzeit für zwei komplette Seitenlayouts.
   Jetzt liegen zwei Aufnahmen vor, in echter Größe gesetzt und erst danach
   verkleinert. Zusammen rund 90 KB in AVIF, für beide Seiten, gegen null
   Layoutarbeit im Browser.

   Nachgebaut bleibt allein die Fensterleiste — als DOM, weil ihre Schrift
   scharf bleiben soll und weil sie die einzige Stelle ist, an der beide
   Seiten dieselbe Adresse tragen: derselbe Betrieb, nicht zwei. */

/* Der Abschnitt beginnt beim alten Auftritt und endet beim neuen.

   Vorher lief es andersherum: Die Seite zeigte zuerst den neuen Auftritt,
   und beim Scrollen schob sich der alte darüber. Erzählt wurde damit "aus
   neu wird alt" — das Gegenteil der Überschrift. Die Kante wandert jetzt
   von rechts nach links und wischt das Alte weg. */
const ANFANG = 94;

/* Bis 640 Pixel greift eine eigene Bildfassung, siehe Aufnahme(). */
const SCHMAL = "(max-width: 639.98px)";
const MASS_SCHMAL = "calc(100vw - 3rem)";
const MASS_BREIT = "(min-width: 1024px) min(62rem, (100vh - 26rem) * 1.6), calc(100vw - 3rem)";

/* Winzige, stark unscharfe Standbilder. Sie liegen als Zeichenkette im
   Aufbau statt als eigene Datei, weil ein zusätzlicher Netzabruf für 200
   Byte teurer wäre als die Bytes selbst. */
const STANDBILD: Record<Seite, string> = {
  vorher:
    "data:image/webp;base64,UklGRkAAAABXRUJQVlA4IDQAAAAwAgCdASoQAAoAA4BaJZQCdIIjGAHzZQKGAAD2l0dCy8sa4fxNQGqe67oAciHWKRV6oEAA",
  nachher:
    "data:image/webp;base64,UklGRjYAAABXRUJQVlA4ICoAAADQAQCdASoQAAoAA4BaJZwAAujbg7njQAD+8Wpv7PiDVbMzopSRMk/wAAA=",
};

type Seite = "vorher" | "nachher";

/* Fensterleiste. Beide Seiten haben dieselbe Geometrie und unterscheiden
   sich nur in Haut und Adresse — dadurch bleibt der Schnitt beim Ziehen
   durchgehend, statt an der Oberkante zu springen.

   Maße in cqw, weil die Leiste Teil des abgebildeten Fensters ist und
   deshalb mit dem Bild skalieren muss. Die Beschriftungen weiter unten
   sind dagegen unser Kommentar zum Bild und bleiben in rem. */
function Leiste({ seite }: { seite: Seite }) {
  const alt = seite === "vorher";
  return (
    <div
      aria-hidden
      className={`flex h-[max(19px,3.4cqw)] shrink-0 items-center gap-[max(6px,1.1cqw)] px-[max(8px,1.5cqw)] ${
        alt
          ? "bg-[#dedbd4] text-[#4a463f]"
          : "bg-[#0c1216] text-[rgba(238,241,242,0.52)]"
      }`}
    >
      <span className="flex gap-[max(3px,0.55cqw)]">
        {(alt
          ? ["#b9b5ac", "#b9b5ac", "#b9b5ac"]
          : ["#3a4249", "#3a4249", "#3a4249"]
        ).map((farbe, i) => (
          <span
            key={i}
            className="block h-[max(4px,0.75cqw)] w-[max(4px,0.75cqw)] rounded-full"
            style={{ background: farbe }}
          />
        ))}
      </span>
      <span
        className={`flex-1 truncate rounded-[2px] px-[max(5px,0.9cqw)] py-[max(2px,0.35cqw)] text-[max(6.5px,1.02cqw)] leading-none ${
          alt ? "bg-[#f4f3ef] text-[#55514a]" : "bg-[#151d22]"
        }`}
      >
        {alt
          ? "http://www.nordwerk-handwerk.de/index.htm"
          : "nordwerk-handwerk.de"}
      </span>
    </div>
  );
}

/* Zwei Bildfassungen, nicht eine skalierte.

   Ein auf 340 Pixel geschrumpftes Bildschirmfoto vom Rechner zeigt nichts
   — und verschenkt das stärkste Argument: Der alte Auftritt wird auf dem
   Handy genau so ausgeliefert, wie ein Telefon eine Seite ohne eigene
   Sichtfeldangabe ausliefert, nämlich 980 Pixel breit in den Bildschirm
   gequetscht. Der neue hat dort eine eigene Ordnung. Die Umschaltung
   übernimmt <picture media> — ohne JavaScript, ohne Sprung im Aufbau. */
function Aufnahme({ seite, alt }: { seite: Seite; alt: string }) {
  const breit = medien(`/images/vergleich/${seite}`);
  const schmal = medien(`/images/vergleich/${seite}-handy`);
  return (
    <div
      className="relative flex-1 overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: `url(${STANDBILD[seite]})` }}
    >
      <picture className="block h-full w-full">
        <source
          media={SCHMAL}
          type="image/avif"
          sizes={MASS_SCHMAL}
          srcSet={`${schmal}-480.avif 480w, ${schmal}-900.avif 900w`}
        />
        <source
          media={SCHMAL}
          type="image/webp"
          sizes={MASS_SCHMAL}
          srcSet={`${schmal}-480.webp 480w, ${schmal}-900.webp 900w`}
        />
        <source
          type="image/avif"
          sizes={MASS_BREIT}
          srcSet={`${breit}-900.avif 900w, ${breit}-1600.avif 1600w`}
        />
        <source
          type="image/webp"
          sizes={MASS_BREIT}
          srcSet={`${breit}-900.webp 900w, ${breit}-1600.webp 1600w`}
        />
        <img
          src={`${breit}-1600.webp`}
          alt={alt}
          width={1600}
          height={1000}
          loading="lazy"
          decoding="async"
          draggable={false}
          className="h-full w-full object-cover object-top"
        />
      </picture>
    </div>
  );
}

export default function BeforeAfter() {
  const abschnitt = useRef<HTMLElement>(null);
  const rahmen = useRef<HTMLDivElement>(null);
  const knopf = useRef<HTMLButtonElement>(null);
  const saum = useRef<GoldSaumGriff>(null);
  const ziehen = useRef(false);
  const uebernommen = useRef(false);
  const reduziert = useReduzierteBewegung();

  /* Die Reglerstellung ist bewusst kein React-Zustand.

     Sie ändert sich bei jedem Bild, während jemand zieht. Als Zustand
     hätte das den ganzen Abschnitt sechzigmal je Sekunde neu abgeglichen —
     für eine Zahl, die genau drei Dinge interessiert: eine Schnittkante,
     eine Position und den Goldstaub. Alle drei werden direkt geschrieben. */
  const stand = useMotionValue(ANFANG);
  const rest = useTransform(stand, (v) => 100 - v);
  const schnitt = useMotionTemplate`inset(0 ${rest}% 0 0)`;
  /* Die Kante wandert per transform, nicht per left.

     `left` in Prozent ist eine Layout-Eigenschaft: Jede Bewegung erzeugt
     einen Layoutdurchlauf und wird vom Browser als Layout-Sprung gezählt
     — im Messlauf tauchte der Griff tatsächlich als CLS-Beitrag auf.
     `translateX` läuft im Compositor, kostet keinen Durchlauf und
     erscheint in keiner Sprungmessung.

     cqw statt %, weil der Rahmen ein Größenkontext ist: 1cqw ist ein
     Prozent seiner Breite — dieselbe Zahl, aber als Länge, und damit
     in transform überhaupt erst zulässig. */
  const kante = useMotionTemplate`translateX(${stand}cqw)`;

  /* Der Abschnitt bleibt beim Scrollen stehen, der Regler wandert dabei
     von links nach rechts — sobald jemand selbst zieht, übernimmt er. */
  const { scrollYProgress } = useScroll({
    target: abschnitt,
    offset: ["start start", "end end"],
  });
  const gefuehrt = useTransform(scrollYProgress, [0.12, 0.78], [ANFANG, 4]);

  /* Eine sehr langsame Annäherung über den ganzen Abschnitt — 2,5 Prozent,
     mehr nicht. Ein Standbild, das exakt stillsteht, wirkt tot; eines,
     das sichtbar zoomt, wirkt billig. Der Wert liegt bewusst an der
     Wahrnehmungsschwelle.

     Beide Ebenen bekommen denselben Wert. Bekämen sie verschiedene, sähe
     es räumlicher aus — und wäre gelogen: Der Vergleich lebt davon, dass
     beide Aufnahmen exakt deckungsgleich liegen. */
  const atem = useTransform(scrollYProgress, [0, 1], [1.025, 1]);

  useMotionValueEvent(gefuehrt, "change", (v) => {
    if (!uebernommen.current && reduziert === false) stand.set(v);
  });

  /* Eine Quelle, drei Empfänger. Die Vorlesehilfe bekommt ihren Wert hier
     als Attribut statt über React — aus demselben Grund wie oben. */
  useMotionValueEvent(stand, "change", (v) => {
    saum.current?.saeen(v);
    const el = knopf.current;
    if (!el) return;
    const ganz = Math.round(v);
    el.setAttribute("aria-valuenow", String(ganz));
    el.setAttribute("aria-valuetext", `${ganz} Prozent des alten Auftritts sichtbar`);
  });

  useEffect(() => {
    if (reduziert) stand.set(50);
  }, [reduziert, stand]);

  const setzen = useCallback(
    (wert: number) => {
      uebernommen.current = true;
      stand.set(Math.min(100, Math.max(0, wert)));
    },
    [stand],
  );

  const ausX = useCallback(
    (clientX: number) => {
      const r = rahmen.current?.getBoundingClientRect();
      if (!r || r.width === 0) return;
      setzen(((clientX - r.left) / r.width) * 100);
    },
    [setzen],
  );

  /* Zeigerereignisse statt getrennter Maus- und Berührungspfade: Ein Weg
     für Maus, Stift und Finger. Das Einfangen des Zeigers ist der Punkt —
     ohne es reißt der Zug ab, sobald die Maus den Rahmen verlässt. */
  const beginnen = (e: React.PointerEvent<HTMLElement>) => {
    ziehen.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    ausX(e.clientX);
  };
  const bewegen = (e: React.PointerEvent<HTMLElement>) => {
    if (ziehen.current) ausX(e.clientX);
  };
  const beenden = (e: React.PointerEvent<HTMLElement>) => {
    ziehen.current = false;
    if (e.currentTarget.hasPointerCapture(e.pointerId))
      e.currentTarget.releasePointerCapture(e.pointerId);
  };

  const taste = (e: React.KeyboardEvent) => {
    const schritt = e.shiftKey ? 10 : 2;
    const jetzt = stand.get();
    const ziele: Record<string, number> = {
      ArrowLeft: jetzt - schritt,
      ArrowRight: jetzt + schritt,
      ArrowDown: jetzt - schritt,
      ArrowUp: jetzt + schritt,
      PageDown: jetzt - 20,
      PageUp: jetzt + 20,
      Home: 0,
      End: 100,
    };
    if (!(e.key in ziele)) return;
    e.preventDefault();
    setzen(ziele[e.key]);
  };

  return (
    <section
      ref={abschnitt}
      aria-label="Vorher-Nachher-Vergleich"
      className="relative h-auto bg-[rgba(0,0,0,0.10)] fade-edges lg:h-[230vh]"
    >
      <div className="py-24 lg:sticky lg:top-0 lg:flex lg:h-screen lg:items-center lg:py-0 lg:pt-20">
        <div className="mx-auto w-full max-w-5xl px-6 lg:px-8">
          <header className="auftritt mx-auto mb-10 max-w-2xl text-center lg:mb-8">
            <p className="mb-4 text-[0.78rem] uppercase tracking-[0.22em] text-gold-text">
              Relaunch
            </p>
            <h2 className="font-serif-display text-shadow-elegant mb-5 text-[clamp(2rem,3.6vw,2.9rem)] text-parchment">
              Aus alt wird zeitgemäß
            </h2>
            <div className="rule-gold mx-auto mb-5 w-24" />
            <p className="leading-relaxed text-silver">
              Derselbe Betrieb, dieselbe Adresse, fünfzehn Jahre dazwischen.
              Ziehen Sie den Regler — oder scrollen Sie einfach weiter.
            </p>
          </header>

          {/* Die Breite ist am Rechner an die verfügbare Höhe gekoppelt.

              Grund: Der Abschnitt steht beim Scrollen fest. Passte der
              Rahmen nicht in den Bildschirm, schöbe er die Überschrift
              unter die Kopfzeile — und niemand könnte weiterscrollen, um
              sie zu sehen, weil der Abschnitt ja gerade steht. */}
          <div className="enthuellung enthuellung-weit mx-auto lg:max-w-[calc((100vh-26rem)*1.6)]">
            <m.div
              ref={rahmen}
              onPointerDown={(e) => {
                /* Auf dem Handy soll ein Wisch über das Bild weiterhin die
                   Seite scrollen. Deshalb löst dort nur der Griff den Zug aus. */
                if (e.pointerType !== "touch") beginnen(e);
              }}
              onPointerMove={bewegen}
              onPointerUp={beenden}
              onPointerCancel={beenden}
              style={{ containerType: "inline-size", touchAction: "pan-y" }}
              className="relative aspect-[9/16] cursor-ew-resize select-none sm:aspect-[16/10]"
            >
              {/* Beschnitten wird nur hier drin — der Griff liegt bewusst
                  außerhalb, sonst wäre er an beiden Enden halb abgesägt. */}
              <div className="panel vignette absolute inset-0 overflow-hidden rounded-lg">
                {/* Der heutige Auftritt liegt unten und ist immer vollständig da */}
                <m.div
                  className="absolute inset-0 flex flex-col"
                  style={{ scale: atem }}
                >
                  <Leiste seite="nachher" />
                  <Aufnahme
                    seite="nachher"
                    alt="Der heutige Auftritt von Nordwerk Handwerk: ein großflächiges Werkstattfoto, eine ruhige Überschrift und ein sichtbarer Weg zur Anfrage."
                  />
                </m.div>

                {/* Der alte Auftritt liegt darüber und wird beschnitten */}
                <m.div
                  className="absolute inset-0 flex flex-col"
                  style={{ clipPath: schnitt, scale: atem }}
                >
                  <Leiste seite="vorher" />
                  <Aufnahme
                    seite="vorher"
                    alt="Der frühere Auftritt desselben Betriebs von 2011: eine schmale Textspalte auf blauem Kachelhintergrund, kleine gequetschte Fotos, Besucherzähler und Gästebuch."
                  />
                </m.div>

                {/* Der Goldstaub am Schnitt — der eine überraschende Moment:
                    Der alte Auftritt zerfällt zu Gold, aus dem der neue entsteht. */}
                <GoldSaum ref={saum} />

                <span className="pointer-events-none absolute bottom-3 left-3 z-[var(--ebene-ueberlagerung)] rounded-full border border-line bg-black/60 px-2.5 py-1 text-[0.58rem] uppercase tracking-[0.16em] text-silver-bright backdrop-blur-sm">
                  Vorher · 2011
                </span>
                <span className="pointer-events-none absolute bottom-3 right-3 z-[var(--ebene-ueberlagerung)] rounded-full border border-gold/30 bg-black/60 px-2.5 py-1 text-[0.58rem] uppercase tracking-[0.16em] text-gold-bright backdrop-blur-sm">
                  Nachher · heute
                </span>
              </div>

              <m.div
                className="pointer-events-none absolute top-0 bottom-0 left-0 z-[var(--ebene-ueberlagerung)] w-px"
                style={{ transform: kante }}
              >
                {/* Die Kante ist kein Strich, sondern eine Materialkante.

                    Drei Lagen: ein warmer Lichtsaum links, wo der alte
                    Auftritt aufliegt; die Lichtlinie selbst; und rechts
                    ein weicher Schlagschatten auf den neuen Auftritt.
                    Erst der Schatten macht aus zwei übereinanderliegenden
                    Bildern eine Lage mit Dicke — ohne dass die beiden
                    Aufnahmen ihre Deckungsgleichheit verlieren, die den
                    Vergleich überhaupt glaubwürdig macht. */}
                <span
                  aria-hidden
                  className="absolute inset-y-0 right-0 w-[max(10px,1.6cqw)] bg-[linear-gradient(90deg,transparent,rgba(242,216,148,0.14))]"
                />
                <span aria-hidden className="absolute inset-y-0 left-0 w-px bg-gold-bright/85" />
                <span
                  aria-hidden
                  className="absolute inset-y-0 left-px w-[max(18px,2.6cqw)] bg-[linear-gradient(90deg,rgba(0,0,0,0.42),transparent)]"
                />
                <button
                  ref={knopf}
                  type="button"
                  role="slider"
                  aria-label="Vergleich zwischen dem Auftritt von 2011 und heute"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={ANFANG}
                  aria-valuetext={`${ANFANG} Prozent des alten Auftritts sichtbar`}
                  onPointerDown={beginnen}
                  onPointerMove={bewegen}
                  onPointerUp={beenden}
                  onPointerCancel={beenden}
                  onKeyDown={taste}
                  style={{ touchAction: "none" }}
                  className="pointer-events-auto absolute top-1/2 left-1/2 flex h-[max(40px,4.6cqw)] w-[max(40px,4.6cqw)] -translate-x-1/2 -translate-y-1/2 cursor-ew-resize items-center justify-center rounded-full bg-[linear-gradient(160deg,#f2d894,#c9a227)] shadow-[0_6px_18px_rgba(0,0,0,0.45)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold-bright"
                >
                  <MoveHorizontal
                    className="h-[45%] w-[45%] text-[#2b2723]"
                    strokeWidth={2.2}
                  />
                </button>
              </m.div>
            </m.div>
          </div>

          <p className="mx-auto mt-5 max-w-xl lg:mt-4 text-center text-[0.76rem] text-silver">
            „Nordwerk Handwerk“ ist ein erfundener Betrieb — die Gegenüberstellung
            zeigt das Vorgehen, nicht einen echten Auftrag.
          </p>
        </div>
      </div>
    </section>
  );
}
