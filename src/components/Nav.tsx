"use client";

import { medien } from "@/lib/pfad";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, m } from "framer-motion";
import { Menu, X } from "lucide-react";
import { nav } from "@/data/content";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Zeigt an, in welchem Abschnitt man sich gerade befindet. */
  useEffect(() => {
    const ids = nav.map((n) => n.href.slice(1));
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive("#" + visible.target.id);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.25, 0.5] }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-[var(--ebene-kopfzeile)] transition-all duration-400 ${
          scrolled
            ? "bg-[rgba(53,49,44,0.86)] backdrop-blur-xl py-3.5 shadow-[0_10px_30px_rgba(0,0,0,0.4)] border-b border-[rgba(201,162,39,0.22)]"
            : "py-5.5"
        } ${menuOpen ? "opacity-0 pointer-events-none" : "opacity-100"}`}
      >
        <div className="max-w-6xl mx-auto px-6 lg:px-8 flex items-center justify-between gap-6">
          <a href="#top" className="flex items-center gap-3 shrink-0">
            <Image
              src={medien("/images/logo-klein.webp")}
              alt="Webdesign Elfe Logo"
              width={42}
              height={42}
              className="rounded-full"
              priority
            />
            <span className="font-serif-display text-[1.35rem] tracking-wide">
              Webdesign{" "}
              <span className="font-script text-gold-bright text-[1.5rem] -ml-0.5 align-[-3px]">
                Elfe
              </span>
            </span>
          </a>

          <nav className="hidden min-[1140px]:flex items-center gap-6 text-[0.8rem] tracking-wide">
            {nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                aria-current={active === item.href ? "true" : undefined}
                className={`relative py-1 transition-colors ${
                  active === item.href
                    ? "text-gold-bright"
                    : "text-silver hover:text-gold-bright"
                }`}
              >
                {item.label}
                <span
                  className={`absolute left-0 -bottom-0.5 h-px bg-gold-bright transition-all duration-300 ${
                    active === item.href ? "w-full opacity-100" : "w-0 opacity-0"
                  }`}
                />
              </a>
            ))}
          </nav>

          <a
            data-magnetisch href="#kontakt"
            className="hidden min-[1140px]:inline-flex items-center gap-2 border border-gold/70 text-gold-bright text-[0.76rem] tracking-[0.14em] uppercase px-6 py-3 rounded-sm bg-[linear-gradient(160deg,rgba(201,162,39,0.16),rgba(0,0,0,0.18))] shadow-[0_1px_0_rgba(255,250,240,0.08)_inset,0_8px_20px_rgba(0,0,0,0.3)] hover:bg-[linear-gradient(160deg,#f2d894,#c9a227)] hover:text-[#2b2723] transition-all duration-400"
          >
            Projekt starten
          </a>

          <button
            aria-label="Menü öffnen"
            onClick={() => setMenuOpen(true)}
            className="min-[1140px]:hidden text-parchment -mr-2 w-11 h-11 inline-flex items-center justify-center"
          >
            <Menu size={26} aria-hidden />
          </button>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-200 bg-[#35312c] flex flex-col items-center justify-center gap-10"
          >
            <button
              aria-label="Menü schließen"
              onClick={() => setMenuOpen(false)}
              className="absolute top-6 right-7 text-parchment"
            >
              <X size={28} />
            </button>
            {nav.map((item, i) => (
              <m.a
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * i, duration: 0.4 }}
                className="font-serif-display text-2xl text-parchment hover:text-gold-bright transition-colors"
              >
                {item.label}
              </m.a>
            ))}
            <m.a
              href="#kontakt"
              onClick={() => setMenuOpen(false)}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * nav.length, duration: 0.4 }}
              className="border border-gold text-gold-bright text-[0.82rem] tracking-[0.06em] uppercase px-7 py-3.5 rounded-sm"
            >
              Projekt starten
            </m.a>
          </m.div>
        )}
      </AnimatePresence>
    </>
  );
}
