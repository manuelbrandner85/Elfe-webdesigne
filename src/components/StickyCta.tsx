"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import { Mail, MessageSquare } from "lucide-react";
import { contact } from "@/data/content";

export default function StickyCta() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const past = window.scrollY > window.innerHeight * 0.8;
      const contactEl = document.getElementById("kontakt");
      const nearContact = contactEl
        ? contactEl.getBoundingClientRect().top < window.innerHeight
        : false;
      setShow(past && !nearContact);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <m.div
          initial={{ y: 70, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 70, opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="min-[1140px]:hidden fixed bottom-0 left-0 right-0 z-[var(--ebene-leiste)] px-3 pb-3 pt-2 bg-[rgba(53,49,44,0.92)] backdrop-blur-xl border-t border-[rgba(201,162,39,0.25)]"
        >
          <div id="sticky-cta" className="flex gap-2.5">
            <a
              href="#kontakt"
              className="flex-1 inline-flex items-center justify-center gap-2 border border-gold/70 text-[0.76rem] tracking-[0.12em] uppercase px-4 py-3 rounded-sm bg-[linear-gradient(160deg,#f2d894,#c9a227)] text-[#2b2723] font-medium"
            >
              <MessageSquare size={15} strokeWidth={2} />
              Anfrage senden
            </a>
            <a
              href={`mailto:${contact.email}`}
              aria-label="E-Mail schreiben"
              className="inline-flex items-center justify-center border border-line text-gold-bright px-4 py-3 rounded-sm bg-black/20"
            >
              <Mail size={16} strokeWidth={1.8} />
            </a>
          </div>
        </m.div>
      )}
    </AnimatePresence>
  );
}
