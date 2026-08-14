"use client";

import { m } from "framer-motion";
import { stats } from "@/data/content";

/* Eine Ziffernwalze: die Spalte 0–9 fährt auf die Zielziffer.

   Der Goldverlauf sitzt an jeder einzelnen Ziffer, nicht am Absatz
   darüber. Das ist keine Stilfrage, sondern die Behebung eines Fehlers:

   `.text-gold-gradient` arbeitet mit `background-clip: text` und trägt
   zusätzlich ein `filter: drop-shadow`. Ein Filter zwingt das Element in
   eine eigene Malebene. Ein Nachfahre mit eigenem `transform` — und
   genau das ist die fahrende Walze — landet in einer weiteren Ebene,
   die den beschnittenen Hintergrund des Vorfahren nicht mehr sieht.
   Ergebnis: `color: transparent` bleibt stehen, der Verlauf kommt nicht
   an, die Ziffer ist unsichtbar.

   Sichtbar wurde das nur an den Ziffern, die sich tatsächlich bewegt
   haben. Die Null blieb bei `transform: none` und wurde gemalt — deshalb
   stand auf der Seite „oo %" statt „100 %" und „ h" statt „48 h": Die
   einzigen sichtbaren Ziffern waren die, die gar nicht gefahren sind.

   Jede Ziffer bringt ihren Verlauf jetzt selbst mit. Über eine einzelne
   Glyphe läuft er zwar kürzer, dafür bei allen Ziffern identisch — und
   er wird gemalt.

   `clip-path` zusätzlich zu `overflow`, weil der Filter auch das
   Beschneiden aufweicht: Die Nachbarziffern schimmerten unter- und
   oberhalb des Fensters durch. */
function Digit({ value, delay }: { value: number; delay: number }) {
  return (
    <span
      className="inline-block overflow-hidden align-bottom"
      style={{ height: "1em", lineHeight: "1em", clipPath: "inset(0)" }}
    >
      <m.span
        className="flex flex-col"
        initial={{ y: 0 }}
        whileInView={{ y: `-${value}em` }}
        viewport={{ once: true, margin: "80px" }}
        transition={{ duration: 1.3, delay, ease: [0.22, 1, 0.36, 1] }}
      >
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((d) => (
          <span
            key={d}
            className="text-gold-gradient"
            style={{ height: "1em", lineHeight: "1em" }}
          >
            {d}
          </span>
        ))}
      </m.span>
    </span>
  );
}

function Counter({ to, suffix }: { to: number; suffix: string }) {
  const digits = String(to).split("");
  return (
    <span className="inline-flex items-end">
      <span className="sr-only">
        {to}
        {suffix}
      </span>
      <span aria-hidden className="inline-flex items-end">
        {digits.map((d, i) => (
          <Digit key={i} value={Number(d)} delay={0.1 + i * 0.12} />
        ))}
        {/* Der Abstand zur Einheit kommt aus dem Stil, nicht aus einem
            Leerzeichen im Text: Als Flex-Element fällt führender
            Leerraum weg, deshalb klebte das „h" am „48", während das
            „%" durch seine eigene Seitenfläche zufällig Luft hatte. */}
        {suffix.trim() && (
          <span className="text-gold-gradient" style={{ marginLeft: "0.14em" }}>
            {suffix.trim()}
          </span>
        )}
      </span>
    </span>
  );
}

export default function Stats() {
  return (
    <section aria-label="Kennzahlen" className="py-16 border-y border-line">
      <div className="max-w-5xl mx-auto px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-3 gap-10 sm:gap-6 text-center">
        {stats.map((s, i) => (
          <div className="auftritt"
            key={s.label}
        style={{ ["--stufe" as string]: i }}>
            <p className="font-serif-display text-[2.6rem] leading-none mb-3">
              <Counter to={s.value} suffix={s.suffix} />
            </p>
            <p className="text-[0.82rem] text-silver leading-relaxed max-w-[16rem] mx-auto">
              {s.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
