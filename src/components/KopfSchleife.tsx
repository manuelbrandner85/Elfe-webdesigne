"use client";

import { useEffect, useRef, useState } from "react";
import { medien } from "@/lib/pfad";
import { useReduzierteBewegung } from "@/lib/bewegung";

/* Der Goldstaub hinter dem Kopfbereich.

   WARUM ÜBERHAUPT BEWEGTES BILD

   Das Logo zeigt eine Elfe, die Goldstaub bläst. Bisher stand das nur
   als Zeichnung da — die Seite dahinter war eine ruhige Fläche. Diese
   Schleife nimmt das Motiv auf: echte Körner, die durch einen
   Lichtstrahl treiben. Kein Effekt aus dem Katalog, sondern das, was
   die Marke ohnehin behauptet, nur in Bewegung.

   WARUM SO ZURÜCKHALTEND

   Es liegt hinter Text. Ein Hintergrund, der um Aufmerksamkeit
   konkurriert, ist ein Fehler, kein Feature. Deshalb: niedrige
   Deckkraft, dunkler Schleier darüber, langsame Einblendung — und die
   Bewegung endet an der Kante des Kopfbereichs.

   WAS ES NICHT TUT

   Es lädt nicht, wenn jemand reduzierte Bewegung eingestellt hat. Es
   lädt nicht, wenn der Kopfbereich nicht im Bild ist. Und es hält an,
   sobald der Reiter in den Hintergrund geht — ein Video, das in einem
   unsichtbaren Reiter weiterdekodiert, verbraucht Akku für nichts.

   Das Standbild trägt die Fläche, bis das Video läuft: 15 KB gegen
   436 KB, und es steht sofort. */
export default function KopfSchleife() {
  const ref = useRef<HTMLVideoElement>(null);
  const reduziert = useReduzierteBewegung();
  const [breitGenug, setBreitGenug] = useState(false);

  /* Auf dem Telefon bleibt es beim Standbild.

     Gemessen: Die Schleife bringt 524 KB mit. Auf einem Laptop faellt
     das nicht ins Gewicht, auf Mobilfunk schon — und dort ist der
     Kopfbereich halb so gross, der Staub also ohnehin kaum zu sehen.
     524 KB fuer eine Feinheit, die niemand bemerkt, waeren fremdes Geld
     ausgegeben. Das Standbild wiegt 18 KB und steht sofort. */
  useEffect(() => {
    const m = window.matchMedia("(min-width: 768px)");
    const setzen = () => setBreitGenug(m.matches);
    setzen();
    m.addEventListener("change", setzen);
    return () => m.removeEventListener("change", setzen);
  }, []);

  useEffect(() => {
    const v = ref.current;
    if (!v || reduziert !== false || !breitGenug) return;

    /* Erst laden, wenn der Kopfbereich wirklich zu sehen ist. Auf der
       Startseite ist das sofort — auf einer Unterseite, die zum Anker
       springt, eben nicht. */
    const beobachter = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          v.play().catch(() => {
            /* Autostart abgelehnt: Dann bleibt das Standbild stehen.
               Kein Grund für eine Fehlermeldung. */
          });
        } else {
          v.pause();
        }
      },
      { threshold: 0.05 },
    );
    beobachter.observe(v);

    const beiSichtwechsel = () => {
      if (document.hidden) v.pause();
      else if (v.getBoundingClientRect().bottom > 0) v.play().catch(() => {});
    };
    document.addEventListener("visibilitychange", beiSichtwechsel);

    return () => {
      beobachter.disconnect();
      document.removeEventListener("visibilitychange", beiSichtwechsel);
    };
  }, [reduziert, breitGenug]);

  /* Solange unklar ist, ob reduzierte Bewegung gilt, wird nichts
     ausgeliefert — lieber eine Zehntelsekunde später als ein Video, das
     jemand ausdrücklich nicht wollte. */
  if (reduziert !== false) return null;

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {breitGenug && (
      <video
        ref={ref}
        muted
        loop
        playsInline
        preload="none"
        poster={medien("/images/kopf-staub.webp")}
        className="absolute inset-0 h-full w-full object-cover opacity-[0.30] mix-blend-screen"
      >
        <source src={medien("/videos/kopf-staub-schleife.webm")} type="video/webm" />
        <source src={medien("/videos/kopf-staub-schleife.mp4")} type="video/mp4" />
      </video>
      )}

      {/* Ohne Video traegt das Standbild die Flaeche — dieselbe Stimmung,
          ein Vierzigstel des Gewichts. */}
      {!breitGenug && (
        <span
          className="absolute inset-0 bg-cover bg-center opacity-[0.30] mix-blend-screen"
          style={{ backgroundImage: `url(${medien("/images/kopf-staub.webp")})` }}
        />
      )}

      {/* Zwei Schleier: einer nimmt dem Bild die Mitte, damit die
          Überschrift steht; einer schließt die Unterkante, damit die
          Bewegung nicht in den nächsten Abschnitt läuft. */}
      {/* Der Schleier ist links dichter als rechts: Dort steht die
          Überschrift, dort darf nichts flimmern. Rechts, neben dem Logo,
          bleibt der Staub sichtbar — genau da, wo die Elfe ihn bläst. */}
      <span className="absolute inset-0 bg-[radial-gradient(ellipse_at_28%_52%,rgba(30,27,24,0.94),rgba(30,27,24,0.62)_46%,rgba(30,27,24,0.20)_72%,transparent_88%)]" />
      <span className="absolute inset-x-0 top-0 h-32 bg-[linear-gradient(to_bottom,var(--color-stone-950),transparent)]" />
      <span className="absolute inset-x-0 bottom-0 h-40 bg-[linear-gradient(to_top,var(--color-stone-950),transparent)]" />
    </div>
  );
}
