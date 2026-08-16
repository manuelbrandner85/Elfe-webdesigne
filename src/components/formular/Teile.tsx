"use client";

import { Check } from "lucide-react";

/* Gemeinsame Bausteine für Anfrage und Briefing.

   Sie standen zuerst im Anfrageformular. Als das Briefing dazukam,
   hätte ich sie kopieren können — und hätte damit zwei Stellen gehabt,
   an denen dieselbe Auswahlfläche gepflegt werden muss. Bei einem
   Designsystem, das aus genau drei Elementen besteht, ist Kopieren der
   sichere Weg, dass die beiden Formulare in einem halben Jahr
   unterschiedlich aussehen. */

export function Chip({
  text,
  aktiv,
  onClick,
}: {
  text: string;
  aktiv: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={aktiv}
      className={`group relative flex items-center gap-2.5 rounded-sm border px-4 py-3 text-left text-[0.88rem] leading-snug transition-all duration-300 ${
        aktiv
          ? "border-gold/80 bg-[linear-gradient(160deg,rgba(201,162,39,0.20),rgba(0,0,0,0.20))] text-parchment"
          : "border-line bg-[linear-gradient(160deg,rgba(255,250,240,0.04),rgba(0,0,0,0.18))] text-silver hover:border-gold/50 hover:text-parchment"
      }`}
    >
      <span
        aria-hidden
        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-[2px] border transition-colors duration-300 ${
          aktiv ? "border-gold bg-gold/90" : "border-line group-hover:border-gold/60"
        }`}
      >
        {aktiv && <Check size={11} strokeWidth={3} className="text-[#2b2723]" />}
      </span>
      {text}
    </button>
  );
}

export function Frage({
  frage,
  hinweis,
  pflicht,
  children,
}: {
  frage: string;
  hinweis?: string;
  /* Nur das Briefing kennzeichnet einzelne Fragen als Pflicht. */
  pflicht?: boolean;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="mb-8 border-0 p-0">
      <legend className="mb-1 font-serif-display text-[1.15rem] text-parchment">
        {frage} {pflicht && <span className="text-gold-bright">*</span>}
      </legend>
      {hinweis && <p className="mb-3 text-[0.78rem] text-silver/70">{hinweis}</p>}
      <div className={hinweis ? "" : "mt-3"}>{children}</div>
    </fieldset>
  );
}

export function Textfeld({
  id,
  label,
  wert,
  setzen,
  platzhalter,
  hinweis,
  pflicht,
  typ = "text",
  autoComplete,
  inputMode,
  fehler,
}: {
  id: string;
  /* Im Briefing steht die Frage schon darueber - dort waere eine
     zweite Beschriftung nur Wiederholung. */
  label?: string;
  wert: string;
  setzen: (v: string) => void;
  platzhalter?: string;
  hinweis?: string;
  pflicht?: boolean;
  typ?: string;
  autoComplete?: string;
  inputMode?: "text" | "tel" | "email" | "url";
  /* Gepruefte Eingabe: Steht hier ein Text, faerbt sich die Linie und
     der Hinweis wird vorgelesen statt nur eingefaerbt. */
  fehler?: string;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-[0.68rem] uppercase tracking-[0.15em] text-gold-text"
      >
        {label} {pflicht && <span className="text-gold-bright">*</span>}
      </label>
      <input
        id={id}
        type={typ}
        required={pflicht}
        value={wert}
        inputMode={inputMode}
        autoComplete={autoComplete}
        placeholder={platzhalter}
        aria-invalid={fehler ? true : undefined}
        aria-describedby={fehler ? `${id}-fehler` : undefined}
        onChange={(e) => setzen(e.target.value)}
        className={`w-full border-b bg-transparent py-2 text-parchment outline-none transition-colors placeholder:text-silver/40 ${
          fehler ? "border-[#d98a72]" : "border-line focus:border-gold"
        }`}
      />
      {fehler && (
        <p id={`${id}-fehler`} className="mt-1.5 text-[0.76rem] text-[#e0a08c]">
          {fehler}
        </p>
      )}
      {hinweis && <p className="mt-1.5 text-[0.74rem] text-silver/60">{hinweis}</p>}
    </div>
  );
}

export function Textbereich({
  id,
  label,
  wert,
  setzen,
  platzhalter,
  zeilen = 3,
}: {
  id: string;
  label?: string;
  wert: string;
  setzen: (v: string) => void;
  platzhalter?: string;
  zeilen?: number;
}) {
  return (
    <div>
      {label && (
        <label
          htmlFor={id}
          className="mb-2 block text-[0.68rem] uppercase tracking-[0.15em] text-gold-text"
        >
          {label}
        </label>
      )}
      <textarea
        id={id}
        rows={zeilen}
        value={wert}
        onChange={(e) => setzen(e.target.value)}
        placeholder={platzhalter}
        className="w-full resize-none border-b border-line bg-transparent py-2 text-parchment outline-none transition-colors placeholder:text-silver/40 focus:border-gold"
      />
    </div>
  );
}

/* Fortschritt. Wer sieht, dass nur noch ein Schritt fehlt, bricht
   seltener ab als jemand, der nicht weiß, wie lang es noch dauert. */
export function Fortschritt({
  schritte,
  aktiv,
}: {
  schritte: { titel: string; hinweis?: string }[];
  aktiv: number;
}) {
  return (
    <div className="mb-8">
      <div className="mb-3 flex items-baseline justify-between gap-4">
        <p className="font-serif-display text-[1.35rem] text-parchment">
          {schritte[aktiv].titel}
        </p>
        <p className="shrink-0 text-[0.72rem] uppercase tracking-[0.16em] text-gold-text">
          Schritt {aktiv + 1} von {schritte.length}
        </p>
      </div>
      <div className="flex gap-1.5" aria-hidden>
        {schritte.map((s, i) => (
          <span
            key={s.titel}
            className={`h-[3px] flex-1 rounded-full transition-colors duration-500 ${
              i <= aktiv ? "bg-gold" : "bg-line"
            }`}
          />
        ))}
      </div>
      {schritte[aktiv].hinweis && (
        <p className="mt-3 text-[0.82rem] text-silver/70">{schritte[aktiv].hinweis}</p>
      )}
    </div>
  );
}
