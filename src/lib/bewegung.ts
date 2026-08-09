"use client";

import { useEffect, useState } from "react";

/* Gibt zurück, ob das Gerät auf reduzierte Bewegung eingestellt ist.

   Der Rückgabewert ist bewusst dreiwertig:
     null  = noch nicht bekannt (erster Aufbau, Serverseite)
     true  = reduzieren
     false = normale Bewegung

   Warum das wichtig ist: Gäbe der Haken anfangs "false" zurück, würden
   Effekte in der ersten Millisekunde starten — bevor feststeht, ob der
   Mensch sie überhaupt sehen will. Genau dieser Fehler ließ die
   Eröffnungssequenz trotz Einstellung anlaufen. Aufrufer prüfen deshalb
   ausdrücklich auf "false" und tun bei "null" nichts.

   Die Einstellung kann sich zur Laufzeit ändern, deshalb wird sie
   beobachtet, nicht einmalig gelesen. */
export function useReduzierteBewegung(): boolean | null {
  const [reduziert, setReduziert] = useState<boolean | null>(null);

  useEffect(() => {
    const abfrage = window.matchMedia("(prefers-reduced-motion: reduce)");
    const setzen = () => setReduziert(abfrage.matches);
    setzen();
    abfrage.addEventListener("change", setzen);
    return () => abfrage.removeEventListener("change", setzen);
  }, []);

  return reduziert;
}
