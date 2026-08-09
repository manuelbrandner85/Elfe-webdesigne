"use client";

import Image from "next/image";
import { m } from "framer-motion";

/* Browserfenster für echte Kundenprojekte — gleicher Rahmen wie bei den
   Designkonzepten, damit das Portfolio einheitlich wirkt. */
export default function ProjectFrame({
  title,
  tag,
  image,
  alt,
  href,
  domain,
  note,
  fit = "cover",
  surface = "#0f0f12",
  index = 0,
}: {
  title: string;
  tag: string;
  image: string;
  alt: string;
  href?: string;
  domain?: string;
  note?: string;
  fit?: "cover" | "contain";
  surface?: string;
  index?: number;
}) {
  const Frame = href ? m.a : m.div;

  return (
    <m.figure
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "80px" }}
      transition={{ duration: 0.7, delay: index * 0.08 }}
      className="group relative flex flex-col"
    >
      <Frame
        {...(href
          ? { href, target: "_blank", rel: "noopener" }
          : {})}
        className="panel panel-hover relative rounded-lg overflow-hidden flex flex-col flex-1"
      >
        {/* Browserleiste */}
        <div
          className="flex items-center gap-2.5 px-3 py-2.5 border-b shrink-0"
          style={{ backgroundColor: surface, borderColor: "rgba(201,162,39,0.12)" }}
        >
          <div className="flex gap-1.5 shrink-0">
            <span className="w-[7px] h-[7px] rounded-full bg-[#ff5f57]" />
            <span className="w-[7px] h-[7px] rounded-full bg-[#febc2e]" />
            <span className="w-[7px] h-[7px] rounded-full bg-[#28c840]" />
          </div>
          <div
            className="flex-1 flex items-center gap-1.5 rounded-full px-2.5 py-[3px] min-w-0"
            style={{
              background: "rgba(0,0,0,0.35)",
              border: "1px solid rgba(201,162,39,0.16)",
            }}
          >
            {domain ? (
              <>
                <svg width="7" height="7" viewBox="0 0 24 24" fill="none" stroke="#c9a227" strokeWidth="3">
                  <rect x="4" y="11" width="16" height="10" rx="2" />
                  <path d="M8 11V7a4 4 0 118 0v4" />
                </svg>
                <span className="text-[7px] truncate text-silver/70">{domain}</span>
              </>
            ) : (
              <span className="text-[7px] truncate text-silver/50">{note}</span>
            )}
          </div>
        </div>

        {/* Projektbild */}
        <div
          className="relative flex-1 min-h-[260px] sm:min-h-[300px] lg:min-h-0"
          style={{ backgroundColor: surface }}
        >
          <Image
            src={image}
            alt={alt}
            fill
            loading="lazy"
            sizes="(max-width: 768px) 100vw, 33vw"
            className={`${
              fit === "cover"
                ? "object-cover object-top transition-transform duration-700 group-hover:scale-[1.05]"
                : "object-contain p-4 transition-transform duration-700 group-hover:scale-[1.04]"
            }`}
          />
        </div>

        <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,0.08),transparent_38%)] opacity-70" />

        {href && (
          <span className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-[0.56rem] tracking-[0.16em] uppercase text-gold-bright bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-full border border-gold/30">
            Website besuchen
          </span>
        )}
      </Frame>

      <figcaption className="mt-4 flex items-baseline justify-between gap-3">
        <div>
          <h3 className="font-serif-display text-lg text-parchment leading-tight">
            {title}
          </h3>
          <p className="text-[0.72rem] tracking-[0.14em] uppercase text-gold-text mt-1">
            {tag}
          </p>
        </div>
        <span className="text-[0.7rem] text-silver/85 shrink-0">
          {domain || note}
        </span>
      </figcaption>
    </m.figure>
  );
}
