"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Pause } from "lucide-react";
import { medien } from "@/lib/pfad";
import { useReduzierteBewegung } from "@/lib/bewegung";

/* Der Erklärfilm zur Hosting-Anleitung.

   WARUM ER NICHT VON SELBST LÄUFT

   Er trägt Inhalt, keine Stimmung. Ein Film, der ungefragt startet,
   zwingt zum Mitlesen in fremdem Tempo — und wer gerade die Preise
   vergleicht, wird davon nur abgelenkt. Deshalb: Standbild, ein
   deutlicher Knopf, und der Mensch entscheidet.

   Das ist zugleich der billigste Weg: Ohne Klick werden 700 KB gar
   nicht erst geholt.

   OHNE TON

   Auf einer Website laufen Filme stumm. Der Inhalt steht deshalb in der
   Schrift — das macht ihn ohne Untertitel zugänglich und in jeder
   Umgebung lesbar. */
export default function AnleitungFilm() {
  const ref = useRef<HTMLVideoElement>(null);
  const [laeuft, setLaeuft] = useState(false);
  const [gestartet, setGestartet] = useState(false);
  const reduziert = useReduzierteBewegung();

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const an = () => setLaeuft(true);
    const aus = () => setLaeuft(false);
    v.addEventListener("play", an);
    v.addEventListener("pause", aus);
    v.addEventListener("ended", aus);
    return () => {
      v.removeEventListener("play", an);
      v.removeEventListener("pause", aus);
      v.removeEventListener("ended", aus);
    };
  }, []);

  const schalten = () => {
    const v = ref.current;
    if (!v) return;
    setGestartet(true);
    if (v.paused) v.play().catch(() => {});
    else v.pause();
  };

  return (
    <figure className="enthuellung enthuellung-weit">
      <div className="relative overflow-hidden rounded-sm border border-gold/35 bg-black shadow-[0_1px_0_rgba(255,250,240,0.12)_inset,0_30px_64px_rgba(0,0,0,0.45)]">
        <video
          ref={ref}
          playsInline
          muted
          /* Erst auf Klick laden: Ohne diese Zeile holt der Browser den
             Film auch dann, wenn ihn niemand ansieht. */
          preload="none"
          poster={medien("/images/film-poster.webp")}
          className="block w-full h-auto"
          aria-label="Erklärfilm: Hosting selbst in der Hand, fünf Schritte in knapp einer Minute"
        >
          <source src={medien("/videos/anleitung-film.webm")} type="video/webm" />
          <source src={medien("/videos/anleitung-film.mp4")} type="video/mp4" />
        </video>

        <button
          type="button"
          onClick={schalten}
          aria-label={laeuft ? "Film anhalten" : "Film abspielen"}
          className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
            laeuft ? "opacity-0 hover:opacity-100" : "opacity-100"
          }`}
        >
          {/* Der Schleier verschwindet, sobald der Film läuft — sonst
              läge er über dem Inhalt, den er ankündigt. */}
          <span
            aria-hidden
            className={`absolute inset-0 transition-opacity duration-500 ${
              gestartet ? "opacity-0" : "bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.30),rgba(0,0,0,0.62))]"
            }`}
          />
          <span className="relative flex h-16 w-16 items-center justify-center rounded-full bg-[linear-gradient(160deg,#f2d894,#c9a227)] shadow-[0_8px_26px_rgba(0,0,0,0.5)] transition-transform duration-300 hover:scale-105">
            {laeuft ? (
              <Pause size={22} strokeWidth={2} className="text-[#2b2723]" />
            ) : (
              <Play size={22} strokeWidth={2} className="text-[#2b2723] translate-x-[2px]" />
            )}
          </span>
        </button>
      </div>

      <figcaption className="mt-3 text-[0.78rem] text-silver">
        Erklärfilm · 56 Sekunden · ohne Ton
        {reduziert === true && " · startet nicht von selbst"}
      </figcaption>
    </figure>
  );
}
