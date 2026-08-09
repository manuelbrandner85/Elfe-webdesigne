"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import { ArrowUp } from "lucide-react";

export default function BackToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 1.5);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <m.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.25 }}
          onClick={() =>
            window.scrollTo({
              top: 0,
              behavior: window.matchMedia("(prefers-reduced-motion: reduce)")
                .matches
                ? "auto"
                : "smooth",
            })
          }
          aria-label="Zurück nach oben"
          className="fixed right-5 bottom-24 min-[1140px]:bottom-6 z-[130] w-12 h-12 rounded-full flex items-center justify-center border border-gold/60 text-gold-bright bg-[rgba(53,49,44,0.88)] backdrop-blur-md shadow-[0_10px_26px_rgba(0,0,0,0.4)] hover:bg-[linear-gradient(160deg,#f2d894,#c9a227)] hover:text-[#2b2723] transition-colors duration-300"
        >
          <ArrowUp size={19} strokeWidth={2} />
        </m.button>
      )}
    </AnimatePresence>
  );
}
