"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ComponentProps } from "react";
import { useReduzierteBewegung } from "@/lib/bewegung";

/* Seitenwechsel als Bewegung statt als Überblendung.

   Was vorher lief: ein Goldschimmer und ein kurzes Einblenden ÜBER dem
   Wechsel. Die alte Seite verschwand trotzdem schlagartig, die neue
   erschien schlagartig, und darüber lag ein Effekt, der so tat, als
   hinge das zusammen. View Transitions machen aus zwei Zuständen
   tatsächlich einen Übergang: Der Browser fotografiert den alten Stand,
   lässt React den neuen bauen und blendet beide gegeneinander — mit
   echter Kontrolle über Richtung und Kurve.

   Warum von Hand und nicht über das Gerüst: Next 16.3 kennt kein
   `experimental.viewTransition`, und React 19.2.8 gibt kein
   `ViewTransition` heraus. Beides geprüft, beides nicht vorhanden.

   Die heikle Stelle ist das Ende. `startViewTransition` hält das
   Standbild so lange, bis das übergebene Versprechen eingelöst ist.
   React sagt uns nicht, wann es fertig gemalt hat — deshalb zwei Bilder
   abwarten UND eine Notbremse nach 500 ms. Ohne die Notbremse stünde
   die Seite bei einem hängenden Wechsel eingefroren da, und zwar mit
   einem Standbild, an dem kein Klick mehr ankommt. Ein Übergang, der zu
   früh endet, blitzt kurz. Ein Übergang, der nie endet, ist ein
   kaputter Auftritt. */
export default function Verweis({
  href,
  onClick,
  ...rest
}: ComponentProps<typeof Link>) {
  const router = useRouter();
  const reduziert = useReduzierteBewegung();

  const klick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented) return;

    /* Alles, was der Mensch bewusst anders meint, bleibt unangetastet:
       neuer Tab, neues Fenster, Herunterladen, fremdes Ziel. */
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    if (typeof href !== "string" || !href.startsWith("/")) return;
    if (reduziert !== false) return;
    if (!document.startViewTransition) return;

    e.preventDefault();
    document.startViewTransition(
      () =>
        new Promise<void>((fertig) => {
          const notbremse = setTimeout(fertig, 500);
          router.push(href);
          requestAnimationFrame(() =>
            requestAnimationFrame(() => {
              clearTimeout(notbremse);
              fertig();
            }),
          );
        }),
    );
  };

  return <Link href={href} onClick={klick} {...rest} />;
}
