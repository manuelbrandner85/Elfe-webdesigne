"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Bild from "@/components/Bild";
import Verweis from "@/components/Verweis";
import { m, useInView } from "framer-motion";
import type { DemoConcept } from "@/data/content";

const SCREEN_MS = 3200;

export default function DemoConceptCard({
  concept,
  index,
}: {
  concept: DemoConcept;
  index: number;
}) {
  const t = concept.theme;
  const wrapRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const inView = useInView(wrapRef, { margin: "5%" });
  const [ready, setReady] = useState(false);
  const [step, setStep] = useState(0);
  const [clicking, setClicking] = useState(false);
  const reduce = useRef(false);
  const inViewRef = useRef(false);
  const navBarRef = useRef<HTMLDivElement>(null);
  const navRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });

  /* Sichtbarkeit in einem Ref mitführen, damit der Startbefehl unten
     auch beim späteren Einbau des Videos den aktuellen Stand kennt. */
  useEffect(() => {
    inViewRef.current = inView;
  }, [inView]);

  /* Das Video wird beim Seitenwechsel aus- und wieder eingebaut.
     Deshalb wird es genau in dem Moment gestartet, in dem es entsteht —
     ein Effekt käme zu früh, solange die Übergangsanimation noch läuft. */
  const attachVideo = useCallback((el: HTMLVideoElement | null) => {
    videoRef.current = el;
    if (el && inViewRef.current && !reduce.current) {
      void el.play().catch(() => {});
    }
  }, []);

  const headFont = t.serif
    ? "var(--font-serif), serif"
    : "var(--font-sans), sans-serif";
  const screens = concept.screens;

  /* Helle Themen brauchen einen hellen Lesbarkeitsverlauf, dunkle einen
     dunklen — an der Helligkeit gemessen statt an einer festen Farbe. */
  const isLight = (() => {
    const hex = t.bg.replace("#", "");
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255 > 0.5;
  })();
  const current = screens[step % screens.length];

  useEffect(() => {
    reduce.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  /* Zeiger auf die Mitte des nächsten Menüpunkts setzen — gemessen,
     nicht geschätzt, damit er wirklich auf dem Wort landet. */
  useEffect(() => {
    const bar = navBarRef.current;
    const next = navRefs.current[(step + 1) % screens.length];
    if (!bar || !next) return;
    const b = bar.getBoundingClientRect();
    const n = next.getBoundingClientRect();
    setCursor({
      x: n.left - b.left + n.width / 2,
      y: n.top - b.top + n.height / 2,
    });
  }, [step, screens.length]);

  /* Blättert automatisch weiter, solange die Karte sichtbar ist. */
  useEffect(() => {
    if (!inView || reduce.current) return;
    const id = setInterval(() => {
      setClicking(true);
      setTimeout(() => {
        setStep((s) => s + 1);
        setClicking(false);
      }, 420);
    }, SCREEN_MS);
    return () => clearInterval(id);
  }, [inView]);

  /* Beim Verlassen des Sichtbereichs anhalten. */
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (inView && !reduce.current) {
      void v.play().catch(() => {});
    } else {
      v.pause();
    }
  }, [inView]);

  const tileFor = (i: number) =>
    concept.tiles.length ? concept.tiles[i % concept.tiles.length] : null;

  /* Jede Unterseite nutzt einen anderen Startpunkt in der Bildreihe,
     damit nicht überall dieselben Motive auftauchen. */
  const tileOffset = (screenIndex: number) => screenIndex * 2;

  return (
    <m.figure
      ref={wrapRef}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "80px" }}
      transition={{ duration: 0.7, delay: index * 0.08 }}
      className="group relative flex flex-col"
    >
      <div className="panel panel-hover relative rounded-lg overflow-hidden flex flex-col flex-1">
        {/* Browserleiste */}
        <div
          className="flex items-center gap-2.5 px-4 py-3 border-b shrink-0"
          style={{ backgroundColor: t.surface, borderColor: `${t.accent}1f` }}
        >
          <div className="flex gap-1.5 shrink-0">
            <span className="w-[9px] h-[13px] rounded-full bg-[#ff5f57]" />
            <span className="w-[9px] h-[13px] rounded-full bg-[#febc2e]" />
            <span className="w-[9px] h-[13px] rounded-full bg-[#28c840]" />
          </div>
          <div
            className="flex-1 flex items-center gap-1.5 rounded-full px-2.5 py-[3px] min-w-0"
            style={{ background: t.bg, border: `1px solid ${t.accent}22` }}
          >
            <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke={t.accent} strokeWidth="3">
              <rect x="4" y="11" width="16" height="10" rx="2" />
              <path d="M8 11V7a4 4 0 118 0v4" />
            </svg>
            <span className="text-[9px] truncate" style={{ color: t.muted }}>
              {concept.domain}
              <span data-url-suffix style={{ opacity: 0.7 }}>
                {current.type !== "hero" ? `/${current.nav.toLowerCase()}` : ""}
              </span>
            </span>
          </div>
        </div>

        <div className="flex flex-col flex-1 min-h-0" style={{ backgroundColor: t.bg }}>
          {/* Seitennavigation mit aktivem Punkt */}
          <div
            ref={navBarRef}
            className="relative flex items-center justify-between gap-3 px-4 sm:px-6 py-3.5 shrink-0 overflow-hidden"
            style={{ borderBottom: `1px solid ${t.accent}1a` }}
          >
            <span
              className="text-[10.5px] font-semibold tracking-[0.14em]"
              style={{ color: t.accent, fontFamily: headFont }}
            >
              {concept.title.split(" ")[0].toUpperCase()}
            </span>
            <div className="flex items-center gap-2 sm:gap-2.5 min-w-0 shrink">
              {screens.map((s, i) => (
                <span
                  key={s.nav}
                  data-nav={i}
                  ref={(el) => {
                    navRefs.current[i] = el;
                  }}
                  className="relative text-[8.5px] transition-colors duration-300"
                  style={{ color: i === step % screens.length ? t.accent : t.muted }}
                >
                  {s.nav}
                  {/* Der Unterstrich wandert per CSS-Übergang mit, statt über
                      eine Layout-Animation. Grund: layoutId erzwingt den
                      vollen Umfang der Bewegungsbibliothek — für einen
                      wandernden Strich ein unverhältnismäßiger Preis. */}
                  <span
                    aria-hidden
                    className="absolute -bottom-[3px] left-0 right-0 h-px origin-left transition-transform duration-500 ease-[var(--kurve-haupt)]"
                    style={{
                      background: t.accent,
                      transform:
                        i === step % screens.length ? "scaleX(1)" : "scaleX(0)",
                    }}
                  />
                </span>
              ))}
              <span
                className="text-[8px] px-2 py-[3px]"
                style={{ background: t.accent, color: t.accentText, borderRadius: t.radius }}
              >
                {concept.ctaAlt}
              </span>
            </div>

            {/* Mauszeiger wandert zum nächsten Menüpunkt und klickt */}
            {!reduce.current && (
              <m.span
                aria-hidden
                className="absolute z-20 pointer-events-none"
                style={{ left: 0, top: 0 }}
                animate={{
                  x: cursor.x + (clicking ? 1 : 0),
                  y: cursor.y + (clicking ? 3 : 6),
                  scale: clicking ? 0.82 : 1,
                }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              >
                <svg width="12" height="15" viewBox="0 0 12 15" fill="none">
                  <path
                    d="M1 1l9.5 6.2-4.2.8 2.3 4.4-1.9 1-2.3-4.4-2.6 3.1z"
                    fill="#fff"
                    stroke="rgba(0,0,0,.5)"
                    strokeWidth="0.8"
                  />
                </svg>
                {clicking && (
                  <m.span
                    className="absolute -inset-2 rounded-full border"
                    style={{ borderColor: t.accent }}
                    initial={{ scale: 0.4, opacity: 0.9 }}
                    animate={{ scale: 1.6, opacity: 0 }}
                    transition={{ duration: 0.42 }}
                  />
                )}
              </m.span>
            )}
          </div>

          {/* Bühne: hier wechseln die Unterseiten */}
          <div
            className="relative flex-1 min-h-[330px] overflow-hidden"
            data-stage={concept.slug}
          >
            {screens.map((current, si) => {
              const activeScreen = si === step % screens.length;
              return (
              <div
                key={current.nav}
                data-screen={si}
                aria-hidden={!activeScreen}
                className="absolute inset-0 transition-[opacity,transform] duration-400 ease-out"
                style={{
                  opacity: activeScreen ? 1 : 0,
                  transform: activeScreen ? "translateX(0)" : "translateX(14px)",
                  pointerEvents: activeScreen ? "auto" : "none",
                }}
              >
                {current.type === "hero" && (
                  <div className="relative h-full">
                    <div
                      aria-hidden
                      className="absolute inset-0 bg-cover bg-center"
                      style={
                        concept.media
                          ? { backgroundImage: `url(${concept.media.poster})` }
                          : { background: t.heroImage }
                      }
                    />
                    {concept.media?.video && (
                      <video
                        ref={attachVideo}
                        poster={concept.media.poster}
                        muted
                        loop
                        playsInline
                        preload="metadata"
                        aria-hidden
                        onPlaying={() => setReady(true)}
                        style={{ opacity: ready ? 1 : 0, transition: "opacity .6s ease" }}
                        className="absolute inset-0 w-full h-full object-cover"
                      >
                        {concept.media.videoWebm && (
                          <source src={concept.media.videoWebm} type="video/webm" />
                        )}
                        {concept.media.video && (
                          <source src={concept.media.video} type="video/mp4" />
                        )}
                      </video>
                    )}
                    <div
                      className="absolute inset-0"
                      style={{
                        background: isLight
                          ? `linear-gradient(90deg, ${t.bg}f2 0%, ${t.bg}d9 42%, ${t.bg}66 68%, transparent 88%)`
                          : "linear-gradient(90deg, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.48) 48%, transparent 82%)",
                      }}
                    />
                    <div className="relative h-full flex flex-col justify-center px-4 max-w-[62%]">
                      <span className="text-[7px] tracking-[0.28em] mb-1.5" style={{ color: t.accent }}>
                        {concept.tag.toUpperCase()}
                      </span>
                      <h4
                        className={`leading-[1.16] mb-1.5 whitespace-pre-line ${t.uppercase ? "uppercase" : ""}`}
                        style={{
                          color: t.text,
                          fontFamily: headFont,
                          fontSize: t.serif ? "21px" : "17px",
                          fontWeight: t.serif ? 500 : 700,
                        }}
                      >
                        {concept.headline}
                      </h4>
                      <p className="text-[8px] leading-[1.7] mb-2.5" style={{ color: t.muted }}>
                        {concept.sub}
                      </p>
                      <div className="flex gap-1.5">
                        <span
                          className="text-[8px] px-2.5 py-[5px] font-medium"
                          style={{ background: t.accent, color: t.accentText, borderRadius: t.radius }}
                        >
                          {concept.cta}
                        </span>
                        <span
                          className="text-[8px] px-2.5 py-[5px]"
                          style={{ border: `1px solid ${t.accent}66`, color: t.text, borderRadius: t.radius }}
                        >
                          {concept.ctaAlt}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {current.type === "gallery" && (
                  <div className="h-full px-6 py-5 flex flex-col">
                    <SectionTitle t={t} label={current.kicker} />
                    {/* Die Kacheln fuellen die Hoehe, die uebrig ist.

                        Vorher standen sie auf festem 4:3 im oberen
                        Drittel, darunter blieb ein Handbreit leere
                        Flaeche — der Entwurf sah aus, als fehlte etwas.
                        Jetzt waechst die Reihe mit dem Fenster. */}
                    <div className="grid grid-cols-3 gap-2 mt-2.5 flex-1 min-h-0">
                      {current.items.map((it, i) => (
                        <div key={it.title} className="flex flex-col min-h-0">
                          <Tile
                            src={tileFor(tileOffset(si) + i)}
                            t={t}
                            alt={`${it.title} – ${it.meta}, Bildbeispiel aus dem Designkonzept ${concept.title}`}
                            className="flex-1 min-h-0 mb-1"
                          />
                          <div className="text-[7px] truncate" style={{ color: t.text, fontFamily: headFont }}>
                            {it.title}
                          </div>
                          <div className="text-[6.5px]" style={{ color: t.muted }}>
                            {it.meta}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center gap-1.5 pt-2.5">
                      <span className="h-px flex-1" style={{ background: `${t.accent}33` }} />
                      <span className="text-[6.5px]" style={{ color: t.muted }}>
                        Weitere Projekte
                      </span>
                    </div>
                  </div>
                )}

                {current.type === "stats" && (
                  <div className="h-full px-6 py-5 flex flex-col">
                    <SectionTitle t={t} label={current.kicker} />
                    <div className="grid grid-cols-3 gap-2 mt-3">
                      {current.items.map((it) => (
                        <div
                          key={it.meta}
                          className="py-3 text-center"
                          style={{ background: t.surface, borderRadius: t.radius, border: `1px solid ${t.accent}1f` }}
                        >
                          <div className="text-[19px] font-bold leading-none mb-1" style={{ color: t.accent }}>
                            {it.title}
                          </div>
                          <div className="text-[6.5px] uppercase tracking-[0.14em]" style={{ color: t.muted }}>
                            {it.meta}
                          </div>
                        </div>
                      ))}
                    </div>
                    <Tile
                      src={tileFor(tileOffset(si) + 3)}
                      t={t}
                      alt={`Stimmungsbild aus dem Designkonzept ${concept.title}`}
                      className="mt-3 flex-1"
                    />
                  </div>
                )}

                {current.type === "contact" && (
                  <div className="h-full px-6 py-5 flex flex-col">
                    <SectionTitle t={t} label={current.kicker} />
                    <div className="grid grid-cols-2 gap-3 mt-3 flex-1">
                      <div className="space-y-1.5">
                        {current.lines.map((l, i) => (
                          <div
                            key={l}
                            className="text-[8px]"
                            style={{
                              color: i === 0 ? t.text : t.muted,
                              fontFamily: i === 0 ? headFont : undefined,
                            }}
                          >
                            {l}
                          </div>
                        ))}
                        <Tile
                          src={tileFor(tileOffset(si) + 1)}
                          t={t}
                          alt={`Eindruck aus dem Designkonzept ${concept.title}`}
                          className="mt-2 aspect-[5/3]"
                        />
                      </div>
                      <div className="space-y-2">
                        {["Name", "E-Mail"].map((f) => (
                          <div key={f}>
                            <div className="text-[6.5px] mb-1" style={{ color: t.accent }}>
                              {f}
                            </div>
                            <div
                              className="h-[13px]"
                              style={{ background: t.surface, borderRadius: t.radius, border: `1px solid ${t.accent}22` }}
                            />
                          </div>
                        ))}
                        <div>
                          <div className="text-[6.5px] mb-1" style={{ color: t.accent }}>
                            Nachricht
                          </div>
                          <div
                            className="h-[34px]"
                            style={{ background: t.surface, borderRadius: t.radius, border: `1px solid ${t.accent}22` }}
                          />
                        </div>
                        <span
                          className="inline-block text-[8px] px-2.5 py-[5px] font-medium"
                          style={{ background: t.accent, color: t.accentText, borderRadius: t.radius }}
                        >
                          {current.cta}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              );
            })}
          </div>

          {/* Fußzeile mit Seitenanzeige */}
          <div
            className="px-6 py-3 flex items-center justify-between shrink-0"
            style={{ background: t.surface, borderTop: `1px solid ${t.accent}1a` }}
          >
            <span className="text-[6.5px]" style={{ color: t.muted }}>
              © {concept.title}
            </span>
            <div className="flex gap-1.5">
              {screens.map((s, i) => (
                <span
                  key={s.nav}
                  data-dot={i}
                  className="w-[6px] h-[6px] rounded-full transition-colors duration-300"
                  style={{
                    background: i === step % screens.length ? t.accent : "transparent",
                    border: `1px solid ${t.accent}66`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,0.10),transparent_38%)] opacity-70" />
        <span className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-[0.56rem] tracking-[0.16em] uppercase text-gold-bright bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-full border border-gold/30">
          Designkonzept
        </span>
      </div>

      <figcaption className="mt-4 flex items-baseline justify-between gap-3">
        <div>
          <h3 className="font-serif-display text-lg text-parchment leading-tight">
            {concept.hasCase ? (
              <Verweis
                href={`/referenzen/${concept.slug}/`}
                className="hover:text-gold-bright transition-colors"
              >
                {concept.title}
              </Verweis>
            ) : (
              concept.title
            )}
          </h3>
          <p className="text-[0.72rem] tracking-[0.14em] uppercase text-gold-text mt-1">
            {concept.tag}
          </p>
        </div>
        {concept.hasCase ? (
          <Verweis
            href={`/referenzen/${concept.slug}/`}
            className="text-[0.7rem] text-gold-text hover:text-gold-bright transition-colors shrink-0 inline-flex items-center gap-1"
          >
            Fallbeispiel <span aria-hidden>→</span>
          </Verweis>
        ) : (
          <span className="text-[0.7rem] text-silver shrink-0">{concept.domain}</span>
        )}
      </figcaption>
    </m.figure>
  );
}

function Tile({
  src,
  t,
  alt,
  className = "",
}: {
  src: string | null;
  t: DemoConcept["theme"];
  alt: string;
  className?: string;
}) {
  if (!src) {
    return (
      <span
        className={`block ${className}`}
        style={{ background: t.surface, border: `1px solid ${t.accent}22`, borderRadius: t.radius }}
      />
    );
  }
  return (
    <span className={`relative block overflow-hidden ${className}`} style={{ borderRadius: t.radius }}>
      <Bild
        src={src}
        alt={alt}
        fill
        breiten={[360, 640]}
        sizes="(max-width: 640px) 24vw, 210px"
        className="object-cover"
      />
    </span>
  );
}

function SectionTitle({
  t,
  label,
}: {
  t: DemoConcept["theme"];
  label: string;
}) {
  return (
    <div className="flex items-center gap-2 shrink-0">
      <span className="h-px w-5" style={{ background: t.accent }} />
      <span className="text-[7px] tracking-[0.24em]" style={{ color: t.accent }}>
        {label.toUpperCase()}
      </span>
    </div>
  );
}
