"use client";

import { LazyMotion, domAnimation } from "framer-motion";
import type { ReactNode } from "react";

/* Lädt nur den kleinen Funktionsumfang der Bewegungsbibliothek.

   Der volle Umfang bringt Dinge mit, die diese Seite nicht braucht —
   Layout-Animationen, Ziehen, 3D-Transformationen. Mit „domAnimation"
   bleibt, was tatsächlich benutzt wird: Ein- und Ausblenden, Verschieben,
   Scroll-Auslöser.

   Voraussetzung dafür ist, dass alle Bauteile „m" statt „motion"
   verwenden — sonst lädt React doch wieder alles. */
export default function BewegungsRahmen({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      {children}
    </LazyMotion>
  );
}
