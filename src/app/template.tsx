"use client";

/* Der Inhaltsbereich jeder Seite.

   Hier lag bisher ein Goldschimmer plus Einblenden bei jedem Wechsel —
   ein Effekt ÜBER dem Wechsel, während die Seite darunter trotzdem
   schlagartig ausgetauscht wurde. Der Übergang selbst liegt jetzt in
   globals.css und läuft über die View-Transitions-Schnittstelle.

   Warum hier kein eigener Übergangsname sitzt: Ein Element mit
   `view-transition-name` bildet in Chromium einen Bezugsrahmen für
   fest positionierte Nachfahren. Ein Wrapper um den gesamten Inhalt
   hätte also jedes `position: fixed` darin an sich gebunden — und
   `display: contents` scheidet ohnehin aus, weil ein Element ohne
   eigenen Kasten gar nicht erfasst werden kann.

   Stattdessen bekommen umgekehrt die bleibenden Teile — Kopfzeile,
   Fußzeile — eigene Namen und werden stillgestellt. Was übrig bleibt,
   ist der Inhalt, und genau der bewegt sich. */
export default function Template({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
