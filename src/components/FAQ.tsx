"use client";

import { useState } from "react";
import { m, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import { faqItems } from "@/data/content";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-24 lg:py-28 scroll-mt-[100px] bg-[rgba(0,0,0,0.10)] fade-edges watermark">
      <div className="max-w-3xl mx-auto px-6 lg:px-8">
        <m.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "80px" }}
          transition={{ duration: 0.7 }}
          className="text-center mb-12"
        >
          <p className="text-[0.78rem] tracking-[0.2em] uppercase text-gold-text mb-3">
            FAQ
          </p>
          <h2 className="font-serif-display text-shadow-elegant text-[clamp(2rem,3.5vw,2.8rem)] text-parchment mb-5">
            Häufige Fragen zu Webdesign &amp; Kosten
          </h2>
          <div className="rule-gold w-24 mx-auto" />
        </m.div>

        <div className="flex flex-col gap-3.5">
          {faqItems.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <m.div
                key={item.q}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "80px" }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="panel rounded-md overflow-hidden transition-colors duration-300 hover:border-gold/35"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full flex items-center justify-between gap-4 px-6 py-5.5 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="font-serif-display text-lg text-parchment">
                    {item.q}
                  </span>
                  <m.span
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="shrink-0 text-gold"
                  >
                    <Plus size={20} />
                  </m.span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <m.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <p className="px-6 pb-5.5 text-silver text-sm leading-relaxed">
                        {item.a}
                      </p>
                    </m.div>
                  )}
                </AnimatePresence>
              </m.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
