"use client";

import { useRef, useState, type FormEvent } from "react";
import { Check, ArrowRight, ArrowLeft, ShieldCheck } from "lucide-react";
import Verweis from "@/components/Verweis";
import { anfrage, contact } from "@/data/content";

/* Das Anfrageformular.

   WARUM DREI SCHRITTE UND NICHT EINE LANGE SEITE

   Vorher standen elf Felder untereinander, darunter Straße, Postleitzahl
   und Ort. Wer das sieht, überschlägt den Aufwand, bevor er anfängt —
   und viele fangen dann gar nicht erst an. Drei kurze Schritte zeigen
   immer nur, was gerade dran ist.

   WARUM ÜBERWIEGEND ANKLICKEN

   Tippen kostet Überwindung, besonders auf dem Telefon. Wer auf drei
   Felder tippen muss statt auf zwölf, bricht seltener ab. Und die
   Antworten werden vergleichbar, statt in Freitext zu versickern.

   WARUM DIE KONTAKTDATEN ZULETZT KOMMEN

   Wer schon zwei Schritte beantwortet hat, gibt seinen Namen eher
   heraus als jemand, der noch gar nichts investiert hat. Umgekehrt
   wirkt die Frage nach der E-Mail-Adresse als Erstes wie eine Schranke.

   WAS PFLICHT IST

   Name, E-Mail und die Einwilligung. Sonst nichts. Jedes weitere
   Pflichtfeld wäre ein zusätzlicher Grund abzubrechen — und was für die
   Beantwortung nicht nötig ist, darf nach der
   Datenschutz-Grundverordnung ohnehin nicht verlangt werden. */

/* Ist hier eine Adresse hinterlegt, geht die Anfrage direkt dorthin.
   Bleibt das Feld leer, öffnet sich das E-Mail-Programm mit der fertig
   zusammengestellten Nachricht — dann verlässt kein Byte den Browser,
   und genau das steht auch in der Datenschutzerklärung. */
const FORM_ENDPOINT = "";

const leer = {
  was: "",
  ziele: [] as string[],
  bestehend: "",
  url: "",
  problem: "",
  start: "",
  budget: "",
  freitext: "",
  name: "",
  email: "",
  telefon: "",
  betrieb: "",
};

type Antworten = typeof leer;

/* ---------- Bausteine ---------- */

function Chip({
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

function Frage({
  frage,
  hinweis,
  children,
}: {
  frage: string;
  hinweis?: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="mb-8 border-0 p-0">
      <legend className="mb-1 font-serif-display text-[1.15rem] text-parchment">
        {frage}
      </legend>
      {hinweis && <p className="mb-3 text-[0.78rem] text-silver/70">{hinweis}</p>}
      <div className={hinweis ? "" : "mt-3"}>{children}</div>
    </fieldset>
  );
}

function Textfeld({
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
}: {
  id: string;
  label: string;
  wert: string;
  setzen: (v: string) => void;
  platzhalter?: string;
  hinweis?: string;
  pflicht?: boolean;
  typ?: string;
  autoComplete?: string;
  inputMode?: "text" | "tel" | "email" | "url";
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
        onChange={(e) => setzen(e.target.value)}
        className="w-full border-b border-line bg-transparent py-2 text-parchment outline-none transition-colors placeholder:text-silver/40 focus:border-gold"
      />
      {hinweis && <p className="mt-1.5 text-[0.74rem] text-silver/60">{hinweis}</p>}
    </div>
  );
}

/* ---------- Formular ---------- */

export default function Anfrageformular() {
  const [schritt, setSchritt] = useState(0);
  const [a, setA] = useState<Antworten>(leer);
  const [einwilligung, setEinwilligung] = useState(false);
  const [gesendet, setGesendet] = useState(false);
  const [sendet, setSendet] = useState(false);
  const [fehler, setFehler] = useState("");
  const kopf = useRef<HTMLDivElement>(null);

  const setzen = (teil: Partial<Antworten>) => setA({ ...a, ...teil });
  const zielUm = (z: string) =>
    setzen({
      ziele: a.ziele.includes(z) ? a.ziele.filter((x) => x !== z) : [...a.ziele, z],
    });

  const weiter = () => {
    setSchritt((s) => Math.min(2, s + 1));
    /* Ohne diesen Sprung stünde der neue Schritt außerhalb des Bildes,
       wenn das Formular weiter unten auf der Seite liegt. */
    kopf.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const zurueck = () => {
    setSchritt((s) => Math.max(0, s - 1));
    kopf.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  /* Die Nachricht führt nur auf, was tatsächlich beantwortet wurde —
     sonst stünden im Postfach lauter leere Zeilen. */
  const nachricht = () => {
    const zeilen: [string, string][] = [
      ["Vorhaben", a.was],
      ["Ziele", a.ziele.join(", ")],
      ["Website vorhanden", a.bestehend],
      ["Adresse", a.url],
      ["Größte Schwierigkeit", a.problem],
      ["Start", a.start],
      ["Budgetrahmen", a.budget],
      ["Betrieb", a.betrieb],
      ["Telefon", a.telefon],
    ];
    const kopfteil = zeilen
      .filter(([, w]) => w && w.trim())
      .map(([b, w]) => `${b}: ${w}`)
      .join("\n");
    return a.freitext.trim() ? `${kopfteil}\n\n${a.freitext.trim()}` : kopfteil;
  };

  async function absenden(e: FormEvent) {
    e.preventDefault();
    setFehler("");

    if (FORM_ENDPOINT) {
      setSendet(true);
      try {
        const r = await fetch(FORM_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(a),
        });
        if (!r.ok) throw new Error();
        setGesendet(true);
      } catch {
        setFehler(
          `Das Senden hat leider nicht geklappt. Schreiben Sie mir gern direkt an ${contact.email}.`,
        );
      } finally {
        setSendet(false);
      }
      return;
    }

    const betreff = encodeURIComponent(`Projektanfrage über webdesign-elfe.de – ${a.name}`);
    const rumpf = encodeURIComponent(nachricht());
    window.location.href = `mailto:${contact.email}?subject=${betreff}&body=${rumpf}`;
    setGesendet(true);
  }

  if (gesendet) {
    return (
      <div className="panel rounded-md p-8 text-center md:p-12">
        <p className="mb-3 font-serif-display text-[1.6rem] text-gold-bright">
          {anfrage.danke.titel}
        </p>
        <p className="mx-auto mb-8 max-w-md leading-relaxed text-silver">
          {FORM_ENDPOINT ? anfrage.danke.text : anfrage.danke.ohneDienst}
        </p>

        <div className="mx-auto max-w-md text-left">
          <p className="mb-4 text-[0.72rem] uppercase tracking-[0.18em] text-gold-text">
            Wie es weitergeht
          </p>
          <ol className="space-y-4">
            {anfrage.danke.naechstes.map((n, i) => (
              <li key={n} className="flex gap-4 text-[0.9rem] leading-relaxed text-silver">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-gold/50 font-serif-display text-[0.78rem] text-gold-bright">
                  {i + 1}
                </span>
                {n}
              </li>
            ))}
          </ol>
        </div>
      </div>
    );
  }

  return (
    <div ref={kopf} className="panel scroll-mt-[110px] rounded-md p-7 md:p-10">
      {/* Fortschritt: Wer sieht, dass nur noch ein Schritt fehlt, bricht
          seltener ab als jemand, der nicht weiß, wie lang es noch dauert. */}
      <div className="mb-8">
        <div className="mb-3 flex items-baseline justify-between gap-4">
          <p className="font-serif-display text-[1.35rem] text-parchment">
            {anfrage.schritte[schritt].titel}
          </p>
          <p className="shrink-0 text-[0.72rem] uppercase tracking-[0.16em] text-gold-text">
            Schritt {schritt + 1} von 3
          </p>
        </div>
        <div className="flex gap-1.5" aria-hidden>
          {anfrage.schritte.map((s, i) => (
            <span
              key={s.titel}
              className={`h-[3px] flex-1 rounded-full transition-colors duration-500 ${
                i <= schritt ? "bg-gold" : "bg-line"
              }`}
            />
          ))}
        </div>
        <p className="mt-3 text-[0.82rem] text-silver/70">
          {anfrage.schritte[schritt].hinweis}
        </p>
      </div>

      <form onSubmit={absenden}>
        {schritt === 0 && (
          <>
            <Frage frage={anfrage.was.frage}>
              <div className="grid gap-2.5 sm:grid-cols-2">
                {anfrage.was.optionen.map((o) => (
                  <Chip key={o} text={o} aktiv={a.was === o} onClick={() => setzen({ was: o })} />
                ))}
              </div>
            </Frage>

            <Frage frage={anfrage.ziel.frage} hinweis={anfrage.ziel.hinweis}>
              <div className="grid gap-2.5 sm:grid-cols-2">
                {anfrage.ziel.optionen.map((o) => (
                  <Chip key={o} text={o} aktiv={a.ziele.includes(o)} onClick={() => zielUm(o)} />
                ))}
              </div>
            </Frage>

            <Frage frage={anfrage.bestehend.frage}>
              <div className="flex flex-wrap gap-2.5">
                {anfrage.bestehend.optionen.map((o) => (
                  <Chip
                    key={o}
                    text={o}
                    aktiv={a.bestehend === o}
                    onClick={() => setzen({ bestehend: o, url: "", problem: "" })}
                  />
                ))}
              </div>

              {/* Adresse und Schwierigkeit erscheinen erst, wenn sie
                  überhaupt zutreffen — zwei Felder, die niemand sieht,
                  der sie nicht braucht. */}
              {a.bestehend === "Ja" && (
                <div className="mt-5 space-y-5 border-l-2 border-gold/40 pl-5">
                  <Textfeld
                    id="af-url"
                    label={anfrage.bestehend.urlLabel}
                    wert={a.url}
                    setzen={(v) => setzen({ url: v })}
                    platzhalter={anfrage.bestehend.urlPlatzhalter}
                    inputMode="url"
                    autoComplete="url"
                  />
                  <div>
                    <label
                      htmlFor="af-problem"
                      className="mb-2 block text-[0.68rem] uppercase tracking-[0.15em] text-gold-text"
                    >
                      {anfrage.bestehend.problemFrage}
                    </label>
                    <textarea
                      id="af-problem"
                      rows={2}
                      value={a.problem}
                      onChange={(e) => setzen({ problem: e.target.value })}
                      placeholder={anfrage.bestehend.problemPlatzhalter}
                      className="w-full resize-none border-b border-line bg-transparent py-2 text-parchment outline-none transition-colors placeholder:text-silver/40 focus:border-gold"
                    />
                  </div>
                </div>
              )}
            </Frage>
          </>
        )}

        {schritt === 1 && (
          <>
            <Frage frage={anfrage.start.frage}>
              <div className="grid gap-2.5 sm:grid-cols-2">
                {anfrage.start.optionen.map((o) => (
                  <Chip key={o} text={o} aktiv={a.start === o} onClick={() => setzen({ start: o })} />
                ))}
              </div>
            </Frage>

            <Frage frage={anfrage.budget.frage} hinweis={anfrage.budget.hinweis}>
              <div className="grid gap-2.5 sm:grid-cols-2">
                {anfrage.budget.optionen.map((o) => (
                  <Chip key={o} text={o} aktiv={a.budget === o} onClick={() => setzen({ budget: o })} />
                ))}
              </div>
            </Frage>

            <Frage frage={anfrage.freitext.frage} hinweis={anfrage.freitext.hinweis}>
              <textarea
                id="af-frei"
                rows={4}
                value={a.freitext}
                onChange={(e) => setzen({ freitext: e.target.value })}
                placeholder={anfrage.freitext.platzhalter}
                className="w-full resize-none border-b border-line bg-transparent py-2 text-parchment outline-none transition-colors placeholder:text-silver/40 focus:border-gold"
              />
            </Frage>
          </>
        )}

        {schritt === 2 && (
          <div className="space-y-6">
            <Textfeld
              id="af-name"
              label={anfrage.kontakt.name}
              pflicht
              wert={a.name}
              setzen={(v) => setzen({ name: v })}
              platzhalter={anfrage.kontakt.namePlatzhalter}
              autoComplete="name"
            />
            <div className="grid gap-6 sm:grid-cols-2">
              <Textfeld
                id="af-mail"
                label={anfrage.kontakt.email}
                pflicht
                typ="email"
                inputMode="email"
                wert={a.email}
                setzen={(v) => setzen({ email: v })}
                platzhalter={anfrage.kontakt.emailPlatzhalter}
                autoComplete="email"
              />
              <Textfeld
                id="af-tel"
                label={anfrage.kontakt.telefon}
                typ="tel"
                inputMode="tel"
                wert={a.telefon}
                setzen={(v) => setzen({ telefon: v })}
                platzhalter={anfrage.kontakt.telefonPlatzhalter}
                hinweis={anfrage.kontakt.telefonHinweis}
                autoComplete="tel"
              />
            </div>
            <Textfeld
              id="af-betrieb"
              label={anfrage.kontakt.betrieb}
              wert={a.betrieb}
              setzen={(v) => setzen({ betrieb: v })}
              platzhalter={anfrage.kontakt.betriebPlatzhalter}
              autoComplete="organization"
            />

            <label className="flex cursor-pointer items-start gap-3 text-[0.82rem] leading-relaxed text-silver">
              <input
                type="checkbox"
                required
                checked={einwilligung}
                onChange={(e) => setEinwilligung(e.target.checked)}
                className="mt-1 h-4 w-4 shrink-0 accent-[#c9a227]"
              />
              <span>
                Ich bin damit einverstanden, dass meine Angaben zur Bearbeitung
                meiner Anfrage verarbeitet werden. Weitere Hinweise in der{" "}
                <Verweis href="/datenschutz/" className="text-gold-bright hover:underline">
                  Datenschutzerklärung
                </Verweis>
                .
              </span>
            </label>

            <p className="text-[0.75rem] text-silver/70">
              Mit <span className="text-gold-bright">*</span> gekennzeichnete Felder
              sind Pflicht. Alles andere ist freiwillig.
            </p>
          </div>
        )}

        {fehler && (
          <p className="mt-5 text-[0.82rem] leading-relaxed text-gold-bright">{fehler}</p>
        )}

        <div className="mt-9 flex flex-wrap items-center gap-4 border-t border-line pt-7">
          {schritt > 0 && (
            <button
              type="button"
              onClick={zurueck}
              className="inline-flex items-center gap-2 text-[0.8rem] uppercase tracking-[0.14em] text-silver transition-colors hover:text-gold-bright"
            >
              <ArrowLeft size={15} strokeWidth={1.8} />
              {anfrage.knopf.zurueck}
            </button>
          )}

          <div className="ml-auto">
            {schritt < 2 ? (
              <button
                type="button"
                data-magnetisch
                onClick={weiter}
                className="inline-flex items-center gap-2 rounded-sm border border-gold/70 bg-[linear-gradient(160deg,rgba(201,162,39,0.16),rgba(0,0,0,0.18))] px-8 py-4 text-[0.8rem] uppercase tracking-[0.14em] text-gold-bright transition-all duration-400 hover:border-gold-bright hover:bg-[linear-gradient(160deg,#f2d894,#c9a227)] hover:text-[#2b2723]"
              >
                {anfrage.knopf.weiter}
                <ArrowRight size={15} strokeWidth={1.8} />
              </button>
            ) : (
              <button
                type="submit"
                disabled={sendet}
                data-magnetisch
                className="inline-flex items-center gap-2 rounded-sm border border-gold/70 bg-[linear-gradient(160deg,rgba(201,162,39,0.16),rgba(0,0,0,0.18))] px-8 py-4 text-[0.8rem] uppercase tracking-[0.14em] text-gold-bright transition-all duration-400 hover:border-gold-bright hover:bg-[linear-gradient(160deg,#f2d894,#c9a227)] hover:text-[#2b2723] disabled:opacity-60"
              >
                {sendet ? "Wird gesendet …" : anfrage.knopf.senden}
                <ArrowRight size={15} strokeWidth={1.8} />
              </button>
            )}
          </div>
        </div>

        {/* Die drei Zusagen stehen direkt beim Knopf, nicht irgendwo
            oben: Der Zweifel kommt genau in dem Moment, in dem geklickt
            werden soll. */}
        <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
          {anfrage.vertrauen.map((v) => (
            <li key={v} className="flex items-center gap-2 text-[0.78rem] text-silver/80">
              <ShieldCheck size={13} strokeWidth={1.8} className="text-gold" />
              {v}
            </li>
          ))}
        </ul>
      </form>
    </div>
  );
}
