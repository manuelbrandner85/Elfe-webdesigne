"use client";

import { m } from "framer-motion";

/* Sanfter Übergang beim Wechsel zwischen Seiten. */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Goldschimmer, der beim Seitenwechsel einmal durchläuft */}
      <m.span
        aria-hidden
        initial={{ opacity: 0.9, x: "-30%" }}
        animate={{ opacity: 0, x: "130%" }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="pointer-events-none fixed inset-y-0 left-0 w-1/3 z-[var(--ebene-menue)] bg-[linear-gradient(90deg,transparent,rgba(242,216,148,0.16),transparent)]"
      />
      <m.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="contents"
      >
        {children}
      </m.div>
    </>
  );
}
