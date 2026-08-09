"use client";

import { useEffect, useRef, useState } from "react";
import { heroChapters } from "@/data/content";
import MonitorStage from "@/components/MonitorStage";
import Hero from "@/components/Hero";

/* Scrollgesteuerte Eröffnung nach dem Vorbild großer Produktseiten:
   Der Bereich bleibt am Bildschirm stehen, während das Gerät im Bild
   bleibt und die Kapitel nacheinander erscheinen. Nichts läuft von
   allein — die Bewegung folgt genau der Scrollposition.

   Die Bilder der Kamerafahrt liefert OrbitStage. */

const SCROLL_VH = 3.4; // Länge der gesamten Sequenz

/* Zwei Fassungen: quer für den Rechner, hochkant fürs Handy.
   Liegt keine Datei vor, übernimmt der gezeichnete Laptop. */

function smooth(t: number) {
  const p = Math.min(1, Math.max(0, t));
  return p * p * (3 - 2 * p);
}

export default function CinematicHero() {
  /* Die Seite wird im Laptop-Bildschirm noch einmal geladen. In dieser
     Fassung entfällt die Eröffnung, sonst entstünde eine Endlosschleife. */
  const [embedded, setEmbedded] = useState(false);
  useEffect(() => {
    setEmbedded(new URLSearchParams(window.location.search).has("screen"));
  }, []);
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [progress, setProgress] = useState(0);
  const [source, setSource] = useState<{ video: string; poster: string } | null>(
    null
  );
  const [ready, setReady] = useState(false);
  const [reduce, setReduce] = useState(false);
  const [narrow, setNarrow] = useState(false);
  /* Liegt ein Gerätefoto vor, wird es verwendet — sonst der gezeichnete
     Laptop. Die Seite funktioniert in beiden Fällen. */
  const [photoMissing, setPhotoMissing] = useState(false);

  useEffect(() => {
    setReduce(window.matchMedia("(prefers-reduced-motion: reduce)").matches);

    setNarrow(window.innerWidth < 768);
  }, []);

  useEffect(() => {
    /* In der eingebetteten Fassung (im Laptop-Bildschirm) gibt es keine
       Szene. Ohne dieses Entfernen bliebe die Kennung vom ersten Aufbau
       stehen und würde den Seitenanfang dauerhaft ausblenden — der
       Bildschirm im Laptop wäre leer. */
    if (embedded) {
      document.documentElement.classList.remove("szene-laeuft");
      return;
    }
    const sec = sectionRef.current;
    if (!sec) return;
    let raf = 0;

    const update = () => {
      raf = 0;
      const rect = sec.getBoundingClientRect();
      const total = sec.offsetHeight - window.innerHeight;
      const p = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 0;
      setProgress(p);

      /* Solange die Szene läuft, bleiben Navigation und Schaltflächen
         verborgen — man kommt erst danach in die Seite. Gesperrt wird
         dabei nichts: Der Abschnitt ist ein echter Teil des Dokuments,
         das Scrollen bleibt völlig normal. */
      /* Bei reduzierter Bewegung entfällt die Szene — dann darf sie den
         Zugang auch nicht sperren. */
      /* Die Sperre endet, sobald der echte Seitenanfang übernimmt — nicht
         erst am Abschnittsende. Sonst bliebe er ausgeblendet, obwohl er
         schon sichtbar sein soll, und die Kopfzeile fehlte. */
      document.documentElement.classList.toggle(
        "szene-laeuft",
        !reduce && (() => {
          const tg = Math.min(1, p / 0.86);
          const eg = tg < 0.5 ? 4 * tg ** 3 : 1 - Math.pow(-2 * tg + 2, 3) / 2;
          return eg < 0.95;
        })()
      );

      const v = videoRef.current;
      if (v && v.readyState >= 2 && v.duration) {
        /* Abspielzeit an die Scrollposition koppeln */
        const t = p * (v.duration - 0.05);
        if (Math.abs(v.currentTime - t) > 0.02) v.currentTime = t;
      }
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      document.documentElement.classList.remove("szene-laeuft");
    };
  }, [source, embedded, reduce]);

  /* Kamerafahrt des gezeichneten Laptops, falls keine Aufnahme vorliegt */
  /* Auf schmalen Bildschirmen steht das Gerät näher — sonst wirkt es
     verloren. */
  const camIn = smooth(Math.min(1, progress / 0.42));
  const startW = narrow ? 86 : 58;
  const startZ = narrow ? -520 : -1250;
  const lidW = startW + camIn * (104 - startW);
  const camZ = startZ - camIn * startZ;
  const camX = 14 - camIn * 14;
  const lidOpen = -10 + camIn * 10;

  /* Ans Ende der Szene springen — mit normalem Scrollen, damit das
     Verhalten für Hilfstechnologien vorhersehbar bleibt. */
  const ueberspringen = () => {
    const sec = sectionRef.current;
    if (!sec) return;
    const ziel = sec.offsetTop + sec.offsetHeight - window.innerHeight;
    window.scrollTo({ top: ziel, behavior: reduce ? "auto" : "smooth" });
    window.setTimeout(() => {
      document.getElementById("main")?.focus();
    }, reduce ? 0 : 700);
  };

  /* Escape führt ebenfalls hinaus — erwartetes Verhalten bei Überlagerungen */
  useEffect(() => {
    const taste = (e: KeyboardEvent) => {
      if (e.key === "Escape") ueberspringen();
    };
    window.addEventListener("keydown", taste);
    return () => window.removeEventListener("keydown", taste);
  });

  const chapters = heroChapters;
  const seg = 1 / chapters.length;

  /* In der eingebetteten Fassung — der Ansicht im Monitor — gibt es keine
     Szene, aber der Seitenanfang muss dort stehen. Ohne ihn begänne die
     Seite im Bildschirm mit den Kennzahlen: im Monitor liefe der falsche
     Abschnitt, und beim Heranfahren füllte er riesig das Bild. */
  if (embedded) return <Hero />;

  return (
    <section
      ref={sectionRef}
      aria-label="Eröffnung"
      className="relative"
      style={{ height: reduce ? "auto" : `${SCROLL_VH * 100}dvh` }}
    >
      <div
        className={`${
          reduce ? "relative" : "sticky top-0"
        } h-[100dvh] overflow-hidden flex items-center justify-center`}
      >
        {/* Bühne: Aufnahme oder gezeichneter Laptop */}
        {!photoMissing ? (
          <MonitorStage
            progress={progress}
            onMissing={() => setPhotoMissing(true)}
          />
        ) : source ? (
          <>
            <video
              ref={videoRef}
              src={source.video}
              poster={source.poster}
              muted
              playsInline
              /* Damit das Spulen auch auf dem Handy sofort greift, wird die
                 Aufnahme vollständig vorgeladen. */
              preload="auto"
              aria-hidden
              onLoadedData={() => setReady(true)}
              className="absolute inset-0 w-full h-full object-cover"
            />
            {!ready && (
              <span
                aria-hidden
                className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[0.62rem] tracking-[0.24em] uppercase text-silver/70"
              >
                Lädt …
              </span>
            )}
          </>
        ) : (
          <div
            aria-hidden
            className="absolute inset-0 flex justify-center items-start md:items-center pt-[14vh] md:pt-0"
            style={{ perspective: "1500px", perspectiveOrigin: "50% 40%" }}
          >
            <div
              className="relative"
              data-device
              style={{
                width: `${lidW}vw`,
                transformStyle: "preserve-3d",
                transform: `translateZ(${camZ}px) rotateX(${camX}deg)`,
              }}
            >
              {/* Deckel mit Bildschirm */}
              <div
                className="relative overflow-hidden"
                data-lid
                style={{
                  height: `${lidW * 0.5625}vw`,
                  transformOrigin: "50% 100%",
                  transform: `rotateX(${lidOpen}deg)`,
                  border: `${Math.max(0, 12 - camIn * 12)}px solid #23201d`,
                  borderRadius: `${Math.max(0, 12 - camIn * 12)}px`,
                  boxShadow:
                    "0 0 0 1px rgba(201,162,39,0.28), 0 60px 120px rgba(0,0,0,0.6)",
                  background:
                    "radial-gradient(120% 100% at 50% 30%, #4a453f, #2c2926)",
                }}
              >
                {/* Bildschirminhalt: Logo und Lichtstimmung */}
                <span
                  className="absolute inset-0"
                  style={{
                    background:
                      "radial-gradient(60% 60% at 50% 45%, rgba(242,216,148,0.16), transparent 70%)",
                  }}
                />
                <span
                  className="absolute inset-0 bg-[url('/images/logo.webp')] bg-no-repeat bg-center"
                  style={{
                    backgroundSize: "34%",
                    opacity: 0.5 + camIn * 0.3,
                  }}
                />
                <span
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(115deg, rgba(255,255,255,0.12), transparent 40%)",
                  }}
                />
              </div>

              {/* Tastaturteil */}
              <div
                style={{
                  position: "absolute",
                  left: "50%",
                  top: `${lidW * 0.5625}vw`,
                  width: "100%",
                  height: `${lidW * 0.42}vw`,
                  transform: "translateX(-50%) rotateX(76deg)",
                  transformOrigin: "50% 0",
                  background:
                    "linear-gradient(180deg,#3b3630 0%,#2a2622 35%,#1d1a17 100%)",
                  borderRadius: "0 0 14px 14px",
                  boxShadow: "0 40px 80px rgba(0,0,0,0.55)",
                  opacity: Math.max(0, 1 - camIn * 1.5),
                }}
              />
            </div>
          </div>
        )}

        {/* Bei vorhandenem Gerätefoto bleibt der Blick beim Laptop —
            kein Text, keine Abdunklung. Fehlt das Foto, übernehmen die
            Kapitel wie zuvor. */}
        {/* Kapitel über der Kamerafahrt.

            Das ist der Teil, der einen Auftritt teuer wirken lässt: nicht
            die Bewegung allein, sondern wenige Sätze, die im Takt der
            Bewegung erscheinen und wieder gehen. Der Text steht links,
            wo der Raum dunkel ist — der Monitor bleibt frei. */}
        {/* Schleier nur auf der Textseite: Ohne ihn liegt die Schrift auf
            Gesicht und Haar und wird unruhig. Ein Abdunkeln des ganzen
            Bildes wäre der falsche Weg — der Monitor soll hell bleiben. */}
        {!reduce && (
          <span
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{
              opacity: (() => {
                const t = Math.min(1, progress / 0.86);
                const e = t < 0.5 ? 4 * t ** 3 : 1 - Math.pow(-2 * t + 2, 3) / 2;
                return Math.max(0, 1 - Math.max(0, (e - 0.42) / 0.1));
              })(),
              background:
                "linear-gradient(100deg, rgba(16,14,12,0.88) 0%, rgba(16,14,12,0.66) 26%, rgba(16,14,12,0.18) 46%, transparent 62%)",
            }}
          />
        )}

        {!reduce && (
          <div className="absolute inset-0 pointer-events-none">
            {chapters.map((c, i) => {
              /* Die Kapitel teilen sich die ersten 72 Prozent der Fahrt.
                 Danach beginnt das Hineinfahren in den Bildschirm — dort
                 stört Text. Ohne diese Aufteilung erreichten die letzten
                 Kapitel nie ihre volle Deckkraft. */
              /* An die Kamerafahrt gekoppelt, nicht an eine feste Marke:
                 Auf schmalen Bildschirmen füllt der Monitor das Fenster
                 viel früher — dort lagen die Kapitel sonst über dem
                 herangezoomten Bildschirm. */
              const t = Math.min(1, progress / 0.86);
              const e = t < 0.5 ? 4 * t ** 3 : 1 - Math.pow(-2 * t + 2, 3) / 2;
              const kp = Math.min(1, e / 0.42);
              const start = i * seg;
              const inP = i === 0 ? 1 : smooth((kp - start) / (seg * 0.34));
              const outP = smooth((kp - (start + seg * 0.74)) / (seg * 0.26));
              const abgang = smooth((e - 0.42) / 0.1);
              const opacity = inP * (1 - outP) * (1 - abgang);
              /* Alle Kapitel bleiben im Quelltext stehen und werden nur
                 unsichtbar geschaltet. Würden sie entfernt, stünde in der
                 Einzeldatei-Vorschau nur das erste — und Suchmaschinen
                 sähen die übrigen Texte gar nicht. */
              return (
                <div
                  key={c.title}
                  data-chapter={i}
                  className="absolute left-6 lg:left-[7vw] max-w-[30rem]"
                  style={{
                    opacity,
                    visibility: opacity < 0.01 ? "hidden" : "visible",
                    transform: `translateY(${(1 - inP) * 22 - outP * 22}px)`,
                    top: narrow ? "auto" : "50%",
                    bottom: narrow ? "16vh" : "auto",
                    marginTop: narrow ? 0 : "-7rem",
                  }}
                >
                  <p className="text-[0.72rem] tracking-[0.26em] uppercase text-gold-text mb-4">
                    {c.kicker}
                  </p>
                  <h2 className="font-serif-display text-shadow-elegant text-[clamp(1.9rem,4.2vw,3.4rem)] leading-[1.14] text-parchment whitespace-pre-line mb-5">
                    {c.title}
                  </h2>
                  <div className="rule-gold w-20 mb-5" />
                  <p className="text-silver text-[0.98rem] leading-relaxed max-w-sm">
                    {c.sub}
                  </p>
                </div>
              );
            })}
          </div>
        )}

        {/* Der echte Seitenanfang liegt in der Szene und übernimmt am Ende
            der Fahrt. Dadurch ist die Kopfzeile im herangezoomten Bildschirm
            die echte: alle Schaltflächen anklickbar, kein Sprung, keine
            zweite Kopfzeile. Vorher lag hier nur ein Abbild im
            eingebetteten Rahmen. */}
        {!reduce &&
          (() => {
            /* Der Seitenanfang tritt genau dann auf, wenn die Fahrt endet */
            const tA = Math.min(1, progress / 0.86);
            const eA = tA < 0.5 ? 4 * tA ** 3 : 1 - Math.pow(-2 * tA + 2, 3) / 2;
            const auftritt = smooth((eA - 0.9) / 0.1);
            if (auftritt < 0.01) return null;
            return (
              <div
                className="absolute inset-0 overflow-hidden"
                style={{
                  opacity: auftritt,
                  pointerEvents: auftritt > 0.85 ? "auto" : "none",
                }}
              >
                <Hero />
              </div>
            );
          })()}

        {/* Dezenter Hinweis am Anfang */}
        {!photoMissing && !reduce && (
          <div
            className="absolute inset-x-0 bottom-8 flex flex-col items-center gap-3 pointer-events-none"
            style={{ opacity: Math.max(0, 1 - progress * 14) }}
          >
            <span className="text-[0.66rem] tracking-[0.26em] uppercase text-silver">
              Scrollen
            </span>
            <span className="block w-px h-9 bg-[linear-gradient(to_bottom,rgba(242,216,148,0.85),transparent)]" />
          </div>
        )}

        {/* Kapitelanzeige */}
        {!reduce && (
          <div className="absolute right-6 lg:right-10 top-1/2 -translate-y-1/2 flex flex-col gap-3">
            {chapters.map((c, i) => (
              <span
                key={c.title}
                aria-hidden
                className="w-px h-8 transition-colors duration-300"
                style={{
                  background:
                    progress >= i * seg && progress < (i + 1) * seg
                      ? "var(--color-gold-bright)"
                      : "var(--color-line)",
                }}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
