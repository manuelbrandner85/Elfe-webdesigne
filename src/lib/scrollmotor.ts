"use client";

import type Lenis from "lenis";

/* Hält die laufende Lenis-Instanz fest.

   Zweck: GSAP soll NICHT geladen werden, nur um die Scroll-Glättung mit
   ScrollTrigger zu takten. Bisher zog die Glättung GSAP auf jeder Seite
   mit — auf Seiten ohne gepinnte Abschnitte völlig umsonst.

   Jetzt läuft Lenis mit eigenem Taktgeber. Erst wenn ein Bauteil
   ScrollTrigger wirklich braucht, meldet es sich hier an und übernimmt
   den gemeinsamen Takt. */
let instanz: Lenis | null = null;
const wartende: ((l: Lenis) => void)[] = [];

export function motorSetzen(l: Lenis | null) {
  instanz = l;
  if (l) {
    while (wartende.length) wartende.shift()?.(l);
  }
}

export function motorHolen(rueckruf: (l: Lenis) => void) {
  if (instanz) rueckruf(instanz);
  else wartende.push(rueckruf);
}
