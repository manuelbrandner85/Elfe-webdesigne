"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowLeft, ArrowRight, CalendarCheck, Lock, RotateCcw } from "lucide-react";
import { Chip, Frage, Textfeld, Textbereich, Fortschritt } from "@/components/formular/Teile";
import Verweis from "@/components/Verweis";
import { briefing, type Feld } from "@/data/briefing";
import { contact } from "@/data/content";

/* Das Projekt-Briefing.

   ES GIBT KEINEN SERVER

   Die Seite ist ein statischer Export auf GitHub Pages: keine
   API-Routen, keine Datenbank, kein Versanddienst. Getragen wird der
   Versand deshalb von einem Formulardienst — dessen Adresse steht in
   ZIEL_ADRESSE. Solange die leer ist, öffnet sich das E-Mail-Programm
   mit der fertigen Zusammenfassung. Beides funktioniert, das eine
   automatisch, das andere mit einem Klick des Kunden.

   KEINE DATEI-UPLOADS

   Bewusst nicht gebaut. Die kostenlosen Stufen der Formulardienste
   nehmen keine oder nur wenige Megabyte an Anhängen — ein Feld, das
   eine Bildersammlung stillschweigend verschluckt, ist schlimmer als
   keines. Stattdessen wird gefragt, WAS vorliegt, plus ein Feld für
   einen Übertragungslink. Das ist ohnehin der Weg, den Kunde und
   Gestalterin am Ende gehen.

   ZWISCHENSTAND AUF DEM GERÄT

   Ein Briefing dauert fünf bis zehn Minuten. Wer dabei unterbrochen
   wird und alles verliert, macht nicht weiter. Die Antworten liegen
   deshalb im Speicher des Browsers — auf dem Gerät des Kunden, nicht
   bei uns. Nach dem Absenden werden sie dort gelöscht. */

const ZIEL_ADRESSE = "";

const SPEICHER = "elfe-briefing-v1";

type Antworten = Record<string, string | string[]>;

export default function Briefingformular() {
  const [schritt, setSchritt] = useState(0);
  const [a, setA] = useState<Antworten>({});
  const [name, setName] = useState("");
  const [mail, setMail] = useState("");
  const [telefon, setTelefon] = useState("");
  const [einwilligung, setEinwilligung] = useState(false);
  const [mailFehler, setMailFehler] = useState("");
  const [gesendet, setGesendet] = useState(false);
  const [sendet, setSendet] = useState(false);
  const [fehler, setFehler] = useState("");
  const [wiederhergestellt, setWiederhergestellt] = useState(false);
  const kopf = useRef<HTMLDivElement>(null);

  const anzahl = briefing.schritte.length + 1; // + Kontaktschritt
  const istKontakt = schritt === briefing.schritte.length;

  /* Zwischenstand laden — einmal, beim ersten Aufbau.

     Der Aufruf liegt in einem Zeitgeber und nicht direkt im Effekt: Der
     Zustand fünf Mal nacheinander zu setzen, während React noch im
     Effekt steckt, löst eine Kette von Neuberechnungen aus. Ein Sprung
     in die nächste Runde kostet nichts und vermeidet sie. */
  useEffect(() => {
    let roh: string | null = null;
    try {
      roh = window.localStorage.getItem(SPEICHER);
    } catch {
      /* Speicher gesperrt — dann eben ohne Zwischenstand. */
    }
    if (!roh) return;

    const kennung = window.setTimeout(() => {
      try {
        const g = JSON.parse(roh!);
        if (g?.a && Object.keys(g.a).length) {
          setA(g.a);
          setName(g.name || "");
          setMail(g.mail || "");
          setTelefon(g.telefon || "");
          setWiederhergestellt(true);
        }
      } catch {
        /* Beschädigter Zwischenstand: dann eben von vorn. */
      }
    }, 0);
    return () => window.clearTimeout(kennung);
  }, []);

  useEffect(() => {
    if (gesendet) return;
    try {
      window.localStorage.setItem(SPEICHER, JSON.stringify({ a, name, mail, telefon }));
    } catch {
      /* Nicht schlimm: Es geht nur der Komfort verloren, nicht das Formular. */
    }
  }, [a, name, mail, telefon, gesendet]);

  const setzen = (id: string, wert: string | string[]) => setA((v) => ({ ...v, [id]: wert }));
  const wert = (id: string) => a[id];
  const text = (id: string) => (typeof a[id] === "string" ? (a[id] as string) : "");
  const liste = (id: string) => (Array.isArray(a[id]) ? (a[id] as string[]) : []);

  const sichtbar = (f: Feld) => !f.wenn || text(f.wenn.id) === f.wenn.ist;

  const springen = (ziel: number) => {
    setSchritt(ziel);
    kopf.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  /* Nur eine einzige Pflichtangabe je Schritt kann fehlen — mehr
     Pflichtfelder hieße mehr Abbrüche. */
  const fehlend = () => {
    if (istKontakt) return "";
    for (const f of briefing.schritte[schritt].felder) {
      if (f.pflicht && sichtbar(f) && !text(f.id).trim()) return f.frage;
    }
    return "";
  };

  const weiter = () => {
    const f = fehlend();
    if (f) {
      setFehler(`Bitte noch beantworten: „${f}"`);
      return;
    }
    setFehler("");
    springen(Math.min(anzahl - 1, schritt + 1));
  };

  /* Die Zusammenfassung ist nach Themen geordnet und hebt hervor, was
     fehlt oder drängt — eine bloße Liste aller Antworten wäre beim
     zehnten Briefing unlesbar. */
  const zusammenfassung = () => {
    const zeilen: string[] = [];
    const flaggen: string[] = [];

    zeilen.push("PROJEKT-BRIEFING");
    zeilen.push("");
    zeilen.push(`Kunde:     ${name}`);
    zeilen.push(`Betrieb:   ${text("firma") || "—"}`);
    zeilen.push(`E-Mail:    ${mail}`);
    if (telefon) zeilen.push(`Telefon:   ${telefon}`);
    zeilen.push(`Eingang:   ${new Date().toLocaleString("de-DE")}`);

    for (const s of briefing.schritte) {
      const eintraege = s.felder
        .filter((f) => sichtbar(f))
        .map((f) => {
          const w = wert(f.id);
          const t = Array.isArray(w) ? w.join(", ") : (w || "").toString().trim();
          return t ? `  ${f.frage}\n    ${t.replace(/\n/g, "\n    ")}` : "";
        })
        .filter(Boolean);
      if (!eintraege.length) continue;
      zeilen.push("");
      zeilen.push(`── ${s.titel.toUpperCase()}`);
      zeilen.push(...eintraege);
    }

    /* Merker: Was beim ersten Blick auffallen muss. */
    if (text("terminFest") === "Ja")
      flaggen.push(`FESTER TERMIN: ${text("terminDatum") || "Datum fehlt"} — ${text("terminGrund") || "Grund unbekannt"}`);
    if (text("start") === "So bald wie möglich") flaggen.push("EILT: Start so bald wie möglich");
    if (liste("vorhanden").includes("Nichts davon") || !liste("vorhanden").length)
      flaggen.push("MATERIAL FEHLT: keine Texte, Bilder oder Logo vorhanden");
    if (!text("materialLink")) flaggen.push("Kein Link zum Material — Übertragungsweg anbieten");
    if (text("rankings") === "Ja") flaggen.push("BESTEHENDE PLATZIERUNGEN: Adressen beim Umzug erhalten");
    if (text("texte") === "Bitte übernehmen Sie das") flaggen.push("TEXTE: Erstellung eingeplant?");
    if (liste("funktionen").some((f) => ["Onlineshop", "Kundenbereich", "Rechner oder Konfigurator", "Mehrsprachig"].includes(f)))
      flaggen.push("TECHNISCH AUFWENDIG: " + liste("funktionen").filter((f) => ["Onlineshop", "Kundenbereich", "Rechner oder Konfigurator", "Mehrsprachig"].includes(f)).join(", "));
    if (!text("unterschied")) flaggen.push("OFFEN: Alleinstellung nicht beantwortet — im Gespräch klären");

    if (flaggen.length) {
      zeilen.splice(6, 0, "", "── ACHTUNG", ...flaggen.map((f) => `  ! ${f}`));
    }
    return zeilen.join("\n");
  };

  async function absenden(e: FormEvent) {
    e.preventDefault();
    setFehler("");

    if (!name.trim()) {
      setFehler("Bitte tragen Sie noch Ihren Namen ein.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(mail)) {
      setMailFehler("Bitte prüfen Sie die Adresse — so kann ich nicht antworten.");
      return;
    }
    setMailFehler("");
    if (!einwilligung) {
      setFehler("Ohne Ihr Einverständnis darf ich die Angaben nicht verarbeiten.");
      return;
    }

    const fertig = () => {
      try {
        window.localStorage.removeItem(SPEICHER);
      } catch {
        /* Egal — der Zwischenstand ist ab jetzt ohnehin gegenstandslos. */
      }
      setGesendet(true);
    };

    if (ZIEL_ADRESSE) {
      setSendet(true);
      try {
        const r = await fetch(ZIEL_ADRESSE, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({
            _subject: `Projekt-Briefing: ${text("firma") || name}`,
            name,
            email: mail,
            telefon,
            zusammenfassung: zusammenfassung(),
            antworten: a,
          }),
        });
        if (!r.ok) throw new Error();
        fertig();
      } catch {
        setFehler(
          `Das Senden hat leider nicht geklappt. Schreiben Sie mir gern direkt an ${contact.email} — Ihre Antworten bleiben so lange gespeichert.`,
        );
      } finally {
        setSendet(false);
      }
      return;
    }

    const betreff = encodeURIComponent(`Projekt-Briefing: ${text("firma") || name}`);
    const rumpf = encodeURIComponent(zusammenfassung());
    window.location.href = `mailto:${contact.email}?subject=${betreff}&body=${rumpf}`;
    fertig();
  }

  /* ---------- Abschluss ---------- */
  if (gesendet) {
    return (
      <div className="panel rounded-md p-8 text-center md:p-12">
        <p className="mb-4 font-serif-display text-[1.7rem] text-gold-bright">
          {briefing.danke.titel}
        </p>
        <p className="mx-auto mb-10 max-w-lg leading-relaxed text-silver">
          {ZIEL_ADRESSE
            ? briefing.danke.text
            : "Ihr E-Mail-Programm hat sich mit der fertigen Zusammenfassung geöffnet. Bitte einmal auf Senden klicken — erst dann erreicht mich Ihr Briefing."}
        </p>

        <div className="mx-auto max-w-md rounded-sm border border-gold/35 bg-[linear-gradient(160deg,rgba(201,162,39,0.10),rgba(0,0,0,0.20))] p-6">
          <p className="mb-2 font-serif-display text-[1.15rem] text-parchment">
            {briefing.danke.terminTitel}
          </p>
          <p className="mb-5 text-[0.88rem] leading-relaxed text-silver">
            {briefing.danke.terminText}
          </p>
          {/* Platzhalter bis ein Kalender eingerichtet ist: Der Knopf
              führt so lange zum Kontaktbereich, statt ins Leere. */}
          <Verweis
            href={briefing.danke.terminZiel || "/#kontakt"}
            data-magnetisch
            className="inline-flex items-center gap-2 rounded-sm border border-gold/70 bg-[linear-gradient(160deg,rgba(201,162,39,0.16),rgba(0,0,0,0.18))] px-7 py-3.5 text-[0.8rem] uppercase tracking-[0.14em] text-gold-bright transition-all duration-400 hover:border-gold-bright hover:bg-[linear-gradient(160deg,#f2d894,#c9a227)] hover:text-[#2b2723]"
          >
            <CalendarCheck size={15} strokeWidth={1.8} />
            {briefing.danke.terminKnopf}
          </Verweis>
        </div>
      </div>
    );
  }

  /* ---------- Formular ---------- */
  const s = istKontakt ? null : briefing.schritte[schritt];

  return (
    <div ref={kopf} className="panel scroll-mt-[110px] rounded-md p-7 md:p-10">
      <Fortschritt
        aktiv={schritt}
        schritte={[
          ...briefing.schritte.map((x) => ({ titel: x.titel, hinweis: x.hinweis })),
          { titel: briefing.kontakt.titel, hinweis: briefing.kontakt.hinweis },
        ]}
      />

      {wiederhergestellt && schritt === 0 && (
        <p className="mb-7 flex items-start gap-3 rounded-sm border border-line bg-[rgba(255,250,240,0.04)] px-4 py-3 text-[0.82rem] leading-relaxed text-silver">
          <RotateCcw size={15} strokeWidth={1.8} className="mt-0.5 shrink-0 text-gold" />
          <span>
            Ihre bisherigen Antworten waren noch da — Sie können einfach
            weitermachen.{" "}
            <button
              type="button"
              onClick={() => {
                setA({});
                setName("");
                setMail("");
                setTelefon("");
                setWiederhergestellt(false);
                try {
                  window.localStorage.removeItem(SPEICHER);
                } catch {
                  /* dann bleibt der Zwischenstand eben liegen */
                }
              }}
              className="text-gold-bright underline underline-offset-2"
            >
              Von vorn beginnen
            </button>
          </span>
        </p>
      )}

      {/* noValidate: Die eingebaute Prüfung des Browsers greift vor der
          eigenen und zeigt ihre eigene Meldung — sachlich richtig, aber
          in fremdem Ton und ohne Bezug zur Frage. Geprüft wird deshalb
          hier, mit denselben Worten wie der Rest der Seite. */}
      <form onSubmit={absenden} noValidate>
        {s &&
          s.felder.filter(sichtbar).map((f) => (
            <Frage key={f.id} frage={f.frage} hinweis={f.hinweis} pflicht={f.pflicht}>
              {f.art === "mehrfach" && (
                <div className="grid gap-2.5 sm:grid-cols-2">
                  {f.optionen!.map((o) => (
                    <Chip
                      key={o}
                      text={o}
                      aktiv={liste(f.id).includes(o)}
                      onClick={() =>
                        setzen(
                          f.id,
                          liste(f.id).includes(o)
                            ? liste(f.id).filter((x) => x !== o)
                            : [...liste(f.id), o],
                        )
                      }
                    />
                  ))}
                </div>
              )}

              {f.art === "einfach" && (
                <div className="grid gap-2.5 sm:grid-cols-2">
                  {f.optionen!.map((o) => (
                    <Chip
                      key={o}
                      text={o}
                      aktiv={text(f.id) === o}
                      onClick={() => setzen(f.id, o)}
                    />
                  ))}
                </div>
              )}

              {f.art === "text" && (
                <Textfeld
                  id={`bf-${f.id}`}
                  wert={text(f.id)}
                  setzen={(v) => setzen(f.id, v)}
                  platzhalter={f.platzhalter}
                />
              )}

              {f.art === "datum" && (
                <Textfeld
                  id={`bf-${f.id}`}
                  typ="date"
                  wert={text(f.id)}
                  setzen={(v) => setzen(f.id, v)}
                />
              )}

              {f.art === "lang" && (
                <Textbereich
                  id={`bf-${f.id}`}
                  wert={text(f.id)}
                  setzen={(v) => setzen(f.id, v)}
                  platzhalter={f.platzhalter}
                />
              )}
            </Frage>
          ))}

        {istKontakt && (
          <div className="space-y-6">
            <Textfeld
              id="bf-name"
              label="Ihr Name"
              pflicht
              wert={name}
              setzen={setName}
              platzhalter="Vor- und Nachname"
              autoComplete="name"
            />
            <div className="grid gap-6 sm:grid-cols-2">
              <Textfeld
                id="bf-mail"
                label="E-Mail"
                pflicht
                typ="email"
                inputMode="email"
                wert={mail}
                setzen={(v) => {
                  setMail(v);
                  if (mailFehler) setMailFehler("");
                }}
                platzhalter="ihre@adresse.de"
                autoComplete="email"
                fehler={mailFehler}
              />
              <Textfeld
                id="bf-tel"
                label="Telefon"
                typ="tel"
                inputMode="tel"
                wert={telefon}
                setzen={setTelefon}
                platzhalter="Freiwillig"
                autoComplete="tel"
              />
            </div>

            <p className="flex items-start gap-3 rounded-sm border border-line bg-[rgba(255,250,240,0.03)] px-4 py-3 text-[0.8rem] leading-relaxed text-silver">
              <Lock size={14} strokeWidth={1.8} className="mt-0.5 shrink-0 text-gold" />
              {briefing.hinweisZugang}
            </p>

            <label className="flex cursor-pointer items-start gap-3 text-[0.82rem] leading-relaxed text-silver">
              <input
                type="checkbox"
                required
                checked={einwilligung}
                onChange={(e) => setEinwilligung(e.target.checked)}
                className="mt-1 h-4 w-4 shrink-0 accent-[#c9a227]"
              />
              <span>
                Ich bin damit einverstanden, dass meine Angaben zur Vorbereitung
                meines Projekts verarbeitet werden. Weitere Hinweise in der{" "}
                <Verweis href="/datenschutz/" className="text-gold-bright hover:underline">
                  Datenschutzerklärung
                </Verweis>
                .
              </span>
            </label>
          </div>
        )}

        {fehler && (
          <p className="mt-5 text-[0.82rem] leading-relaxed text-[#e0a08c]">{fehler}</p>
        )}

        <div className="mt-9 flex flex-wrap items-center gap-4 border-t border-line pt-7">
          {schritt > 0 && (
            <button
              type="button"
              onClick={() => springen(schritt - 1)}
              className="inline-flex items-center gap-2 text-[0.8rem] uppercase tracking-[0.14em] text-silver transition-colors hover:text-gold-bright"
            >
              <ArrowLeft size={15} strokeWidth={1.8} />
              {briefing.knopf.zurueck}
            </button>
          )}
          <div className="ml-auto">
            {!istKontakt ? (
              <button
                type="button"
                data-magnetisch
                onClick={weiter}
                className="inline-flex items-center gap-2 rounded-sm border border-gold/70 bg-[linear-gradient(160deg,rgba(201,162,39,0.16),rgba(0,0,0,0.18))] px-8 py-4 text-[0.8rem] uppercase tracking-[0.14em] text-gold-bright transition-all duration-400 hover:border-gold-bright hover:bg-[linear-gradient(160deg,#f2d894,#c9a227)] hover:text-[#2b2723]"
              >
                {briefing.knopf.weiter}
                <ArrowRight size={15} strokeWidth={1.8} />
              </button>
            ) : (
              <button
                type="submit"
                disabled={sendet}
                data-magnetisch
                className="inline-flex items-center gap-2 rounded-sm border border-gold/70 bg-[linear-gradient(160deg,rgba(201,162,39,0.16),rgba(0,0,0,0.18))] px-8 py-4 text-[0.8rem] uppercase tracking-[0.14em] text-gold-bright transition-all duration-400 hover:border-gold-bright hover:bg-[linear-gradient(160deg,#f2d894,#c9a227)] hover:text-[#2b2723] disabled:opacity-60"
              >
                {sendet ? "Wird gesendet …" : briefing.knopf.senden}
                <ArrowRight size={15} strokeWidth={1.8} />
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
