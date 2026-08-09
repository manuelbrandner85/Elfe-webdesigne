"use client";

import { useState, FormEvent } from "react";
import { m } from "framer-motion";
import { contact } from "@/data/content";

/* Für echten Versand im Hintergrund hier die Adresse eines Formular-Dienstes
   eintragen (z. B. Formspree oder Web3Forms). Bleibt das Feld leer, öffnet das
   Formular stattdessen das E-Mail-Programm mit fertiger Nachricht. */
const FORM_ENDPOINT = "";

/* Pflicht sind nur Name, E-Mail und Nachricht. Alles Weitere ist
   freiwillig: Nach der Datenschutz-Grundverordnung dürfen nur Daten
   erhoben werden, die für den Zweck wirklich nötig sind — für eine erste
   Anfrage ist die Anschrift das nicht. Wer sie freiwillig angibt, erspart
   sich später eine Rückfrage. */
const leeresFormular = {
  name: "",
  email: "",
  telefon: "",
  firma: "",
  strasse: "",
  plz: "",
  ort: "",
  paket: "",
  message: "",
};

type Formular = typeof leeresFormular;

const PAKETE = [
  "Start – 399 €",
  "Profi – 699 €",
  "Marke – 1.099 €",
  "Nur Betreuung / Hosting",
  "Weiß ich noch nicht",
];

export default function Contact() {
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState<Formular>(leeresFormular);
  const [einwilligung, setEinwilligung] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    // Wenn ein Formular-Dienst hinterlegt ist, wird direkt dorthin gesendet.
    if (FORM_ENDPOINT) {
      setSending(true);
      try {
        const res = await fetch(FORM_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(form),
        });
        if (!res.ok) throw new Error("Fehler beim Senden");
        setSent(true);
      } catch {
        setError(
          "Das Senden hat leider nicht geklappt. Bitte schreiben Sie mir direkt an " +
            contact.email + "."
        );
      } finally {
        setSending(false);
      }
      return;
    }

    // Ohne Dienst: E-Mail-Programm mit fertig ausgefüllter Nachricht öffnen.
    const subject = encodeURIComponent(`Anfrage über webdesign-elfe.de – ${form.name}`);
    /* Nur ausgefüllte Felder übernehmen — sonst stünden in der Mail
       lauter leere Zeilen. */
    const zeilen = [
      ["Name", form.name],
      ["E-Mail", form.email],
      ["Telefon", form.telefon],
      ["Betrieb", form.firma],
      ["Straße", form.strasse],
      ["PLZ / Ort", [form.plz, form.ort].filter(Boolean).join(" ")],
      ["Interesse", form.paket],
    ]
      .filter(([, wert]) => wert && String(wert).trim() !== "")
      .map(([bez, wert]) => `${bez}: ${wert}`)
      .join("\n");

    const body = encodeURIComponent(`${zeilen}\n\n${form.message}`);
    window.location.href = `mailto:${contact.email}?subject=${subject}&body=${body}`;
    setSent(true);
  }

  return (
    <section id="kontakt" className="py-24 lg:py-28 scroll-mt-[100px]">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <m.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "80px" }}
          transition={{ duration: 0.7 }}
          className="text-center mb-10"
        >
          <p className="text-[0.78rem] tracking-[0.2em] uppercase text-gold-text mb-3">
            {contact.kicker}
          </p>
          <h2 className="font-serif-display text-shadow-elegant text-[clamp(2rem,3.5vw,2.8rem)] text-parchment mb-5">
            {contact.h2}
          </h2>
          <p className="text-silver max-w-xl mx-auto">
{contact.intro}
          </p>
        </m.div>

        <m.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "80px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex flex-wrap gap-4 justify-center mb-14"
        >
          <a
            data-magnetisch href="#kontaktformular"
            className="inline-flex items-center gap-2 border border-gold/70 text-gold-bright text-[0.8rem] tracking-[0.14em] uppercase px-8 py-4 rounded-sm bg-[linear-gradient(160deg,rgba(201,162,39,0.16),rgba(0,0,0,0.18))] shadow-[0_1px_0_rgba(255,250,240,0.08)_inset,0_10px_24px_rgba(0,0,0,0.34)] hover:bg-[linear-gradient(160deg,#f2d894,#c9a227)] hover:text-[#2b2723] hover:border-gold-bright hover:shadow-[0_14px_32px_rgba(201,162,39,0.28)] transition-all duration-400"
          >
            Unverbindliche Anfrage senden
          </a>
          <a
            data-magnetisch href={`mailto:${contact.email}`}
            className="inline-flex items-center gap-2 border border-line text-silver-bright text-[0.8rem] tracking-[0.14em] uppercase px-8 py-4 rounded-sm bg-[linear-gradient(160deg,rgba(255,250,240,0.05),rgba(0,0,0,0.16))] shadow-[0_1px_0_rgba(255,250,240,0.06)_inset,0_10px_24px_rgba(0,0,0,0.3)] hover:border-gold/70 hover:text-gold-bright transition-all duration-400"
          >
            Kontakt aufnehmen
          </a>
        </m.div>

        <div
          id="kontaktformular"
          className="panel grid grid-cols-1 md:grid-cols-2 gap-0 scroll-mt-[100px] rounded-md overflow-hidden"
        >
          <m.div
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "80px" }}
            transition={{ duration: 0.6 }}
            className="p-8 md:p-10 border-b md:border-b-0 md:border-r border-line"
          >
            <p className="text-silver text-sm leading-relaxed mb-7">
Ein unverbindliches Erstgespräch klärt in wenigen Minuten, ob wir zueinander passen — ohne Verpflichtung.
            </p>

            <dl className="space-y-5">
              <div>
                <dt className="text-[0.68rem] tracking-[0.15em] uppercase text-gold-text mb-1">
                  Telefon
                </dt>
                <dd className="text-parchment text-sm">{contact.phone}</dd>
              </div>
              <div>
                <dt className="text-[0.68rem] tracking-[0.15em] uppercase text-gold-text mb-1">
                  E-Mail
                </dt>
                <dd>
                  <a
                    href={`mailto:${contact.email}`}
                    className="text-parchment text-sm hover:text-gold-bright transition-colors inline-flex items-center min-h-[44px] -my-3"
                  >
                    {contact.email}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-[0.68rem] tracking-[0.15em] uppercase text-gold-text mb-1">
                  WhatsApp
                </dt>
                <dd className="text-parchment text-sm">{contact.whatsapp}</dd>
              </div>
              <div>
                <dt className="text-[0.68rem] tracking-[0.15em] uppercase text-gold-text mb-1">
                  Adresse / Region
                </dt>
                <dd className="text-parchment text-sm">{contact.region}</dd>
              </div>
              <div>
                <dt className="text-[0.68rem] tracking-[0.15em] uppercase text-gold-text mb-1">
                  Erreichbarkeit
                </dt>
                <dd className="text-parchment text-sm">{contact.hours}</dd>
              </div>
            </dl>
          </m.div>

          <m.div
            initial={{ opacity: 0, x: 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "80px" }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="p-8 md:p-10"
          >
            {sent ? (
              <div className="h-full flex items-center justify-center text-center py-10">
                <div>
                  <p className="font-serif-display text-xl text-gold-bright mb-3">
                    Vielen Dank ✦
                  </p>
                  <p className="text-silver text-sm leading-relaxed max-w-xs mx-auto">
                    {FORM_ENDPOINT
                      ? "Ihre Nachricht ist angekommen. Sie erhalten in der Regel innerhalb von 48 Stunden eine Antwort."
                      : "Ihr E-Mail-Programm sollte sich nun mit der fertigen Nachricht geöffnet haben. Bitte einmal auf Senden klicken."}
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                {/* Ein Hilfsbaustein statt neunmal dasselbe Markup:
                    weniger Stellen, an denen sich Fehler einschleichen. */}
                <Feld
                  id="kf-name"
                  label="Name"
                  pflicht
                  autoComplete="name"
                  placeholder="Ihr Name"
                  value={form.name}
                  onChange={(v) => setForm({ ...form, name: v })}
                />

                <div className="grid sm:grid-cols-2 gap-5">
                  <Feld
                    id="kf-email"
                    label="E-Mail"
                    pflicht
                    type="email"
                    autoComplete="email"
                    placeholder="ihre@email.de"
                    value={form.email}
                    onChange={(v) => setForm({ ...form, email: v })}
                  />
                  <Feld
                    id="kf-tel"
                    label="Telefon"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    placeholder="Für schnelle Rückfragen"
                    value={form.telefon}
                    onChange={(v) => setForm({ ...form, telefon: v })}
                  />
                </div>

                <Feld
                  id="kf-firma"
                  label="Betrieb oder Firma"
                  autoComplete="organization"
                  placeholder="Optional"
                  value={form.firma}
                  onChange={(v) => setForm({ ...form, firma: v })}
                />

                <Feld
                  id="kf-strasse"
                  label="Straße und Hausnummer"
                  autoComplete="street-address"
                  placeholder="Optional"
                  value={form.strasse}
                  onChange={(v) => setForm({ ...form, strasse: v })}
                />

                <div className="grid grid-cols-[7rem_1fr] gap-5">
                  <Feld
                    id="kf-plz"
                    label="PLZ"
                    inputMode="numeric"
                    autoComplete="postal-code"
                    placeholder="Optional"
                    value={form.plz}
                    onChange={(v) => setForm({ ...form, plz: v })}
                  />
                  <Feld
                    id="kf-ort"
                    label="Ort"
                    autoComplete="address-level2"
                    placeholder="Optional"
                    value={form.ort}
                    onChange={(v) => setForm({ ...form, ort: v })}
                  />
                </div>

                <div>
                  <label
                    htmlFor="kf-paket"
                    className="block text-[0.68rem] tracking-[0.15em] uppercase text-gold-text mb-2"
                  >
                    Interesse an
                  </label>
                  <select
                    id="kf-paket"
                    name="paket"
                    value={form.paket}
                    onChange={(e) => setForm({ ...form, paket: e.target.value })}
                    className="w-full bg-transparent border-b border-line focus:border-gold outline-none py-2 text-parchment transition-colors"
                  >
                    <option value="" className="bg-[#2b2723]">
                      Bitte wählen (optional)
                    </option>
                    {PAKETE.map((x) => (
                      <option key={x} value={x} className="bg-[#2b2723]">
                        {x}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="kf-msg"
                    className="block text-[0.68rem] tracking-[0.15em] uppercase text-gold-text mb-2"
                  >
                    Nachricht <span className="text-gold-bright">*</span>
                  </label>
                  <textarea
                    required
                    id="kf-msg"
                    name="message"
                    rows={4}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Worum geht es? Kurze Stichpunkte genügen."
                    className="w-full bg-transparent border-b border-line focus:border-gold outline-none py-2 text-parchment placeholder:text-silver/40 transition-colors resize-none"
                  />
                </div>

                {/* Einwilligung: Ohne Hinweis auf die Verarbeitung wäre die
                    Erhebung nicht sauber. Der Verweis führt zur
                    Datenschutzerklärung. */}
                <label className="flex items-start gap-3 text-[0.82rem] text-silver leading-relaxed cursor-pointer">
                  <input
                    type="checkbox"
                    required
                    checked={einwilligung}
                    onChange={(e) => setEinwilligung(e.target.checked)}
                    className="mt-1 accent-[#c9a227] w-4 h-4 shrink-0"
                  />
                  <span>
                    Ich bin damit einverstanden, dass meine Angaben zur
                    Bearbeitung meiner Anfrage gespeichert werden. Weitere
                    Hinweise in der{" "}
                    <a
                      href="/datenschutz"
                      className="text-gold-bright hover:underline"
                    >
                      Datenschutzerklärung
                    </a>
                    .
                  </span>
                </label>

                <p className="text-[0.75rem] text-silver/70">
                  Mit <span className="text-gold-bright">*</span> gekennzeichnete
                  Felder sind Pflicht. Alles andere ist freiwillig.
                </p>

                {error && (
                  <p className="text-[0.8rem] text-gold-bright leading-relaxed">{error}</p>
                )}
                <button
                  type="submit"
                  disabled={sending}
                  className="mt-2 disabled:opacity-60 inline-flex items-center justify-center gap-2 border border-gold/70 text-gold-bright text-[0.8rem] tracking-[0.14em] uppercase px-8 py-4 rounded-sm bg-[linear-gradient(160deg,rgba(201,162,39,0.16),rgba(0,0,0,0.18))] shadow-[0_1px_0_rgba(255,250,240,0.08)_inset,0_10px_24px_rgba(0,0,0,0.34)] hover:bg-[linear-gradient(160deg,#f2d894,#c9a227)] hover:text-[#2b2723] hover:border-gold-bright hover:shadow-[0_14px_32px_rgba(201,162,39,0.28)] transition-all duration-400"
                >
                  {sending ? "Wird gesendet …" : "Nachricht senden"}
                </button>
              </form>
            )}
          </m.div>
        </div>
      </div>
    </section>
  );
}

/* Ein Eingabefeld in der Gestaltung der Seite. */
function Feld({
  id,
  label,
  value,
  onChange,
  pflicht = false,
  type = "text",
  ...rest
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  pflicht?: boolean;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
  inputMode?: "text" | "tel" | "numeric" | "email";
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-[0.68rem] tracking-[0.15em] uppercase text-gold-text mb-2"
      >
        {label} {pflicht && <span className="text-gold-bright">*</span>}
      </label>
      <input
        id={id}
        name={id.replace("kf-", "")}
        type={type}
        required={pflicht}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-transparent border-b border-line focus:border-gold outline-none py-2 text-parchment placeholder:text-silver/40 transition-colors"
        {...rest}
      />
    </div>
  );
}
