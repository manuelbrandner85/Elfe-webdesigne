import type { Metadata } from "next";
import Link from "next/link";
import { paketBedingungen, pricing, site } from "@/data/content";

/* Allgemeine Geschäftsbedingungen.

   Bewusst in einfacher Sprache und ohne Klauseln, die vor Gericht ohnehin
   fallen würden. Zwei Grundsätze:

   Erstens: Jede Angabe stimmt mit dem überein, was auf der Startseite
   steht — Laufzeit, Korrekturrunden, Zahlung, Kündigung. Widersprüche
   zwischen Werbeaussage und Vertragstext sind der häufigste Streitpunkt
   und wären hier besonders peinlich.

   Zweitens: Der Kunde ist meist ein Kleinbetrieb, kein Konzern mit
   Rechtsabteilung. Wer nicht versteht, was er unterschreibt, unterschreibt
   nicht — oder ärgert sich später. */

export const metadata: Metadata = {
  title: "Allgemeine Geschäftsbedingungen",
  description:
    "Die Bedingungen für Gestaltung, Umsetzung und Betreuung von Websites durch Webdesign Elfe — in verständlicher Sprache.",
  alternates: { canonical: `${site.url}/agb/` },
};

function Absatz({
  nummer,
  titel,
  children,
}: {
  nummer: string;
  titel: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-11">
      <h2 className="font-serif-display text-[1.35rem] text-parchment mb-4 hyphens-auto">
        <span className="text-gold-text mr-2">{nummer}</span>
        {titel}
      </h2>
      <div className="space-y-3 text-silver text-[0.97rem] leading-relaxed">
        {children}
      </div>
    </section>
  );
}

export default function AGB() {
  const heute = new Date().toLocaleDateString("de-DE", {
    month: "long",
    year: "numeric",
  });

  return (
    <main className="pt-32 pb-24">
      <div className="max-w-3xl mx-auto px-6 lg:px-8">
        <p className="text-[0.72rem] tracking-[0.26em] uppercase text-gold-text mb-4">
          Rechtliches
        </p>
        <h1 className="font-serif-display text-shadow-elegant text-[clamp(2rem,4.4vw,3rem)] text-parchment mb-6 hyphens-auto">
          Allgemeine Geschäftsbedingungen
        </h1>
        <div className="rule-gold w-24 mb-10" />

        <div className="panel rounded-sm p-7 mb-12">
          <p className="text-silver text-[0.97rem] leading-relaxed">
            Diese Bedingungen sind bewusst kurz und ohne Fachsprache
            geschrieben. Was hier steht, steht auch auf der Startseite — es
            gibt keine Klausel, die etwas anderes sagt als das Angebot.
            Wenn etwas unklar ist, fragen Sie bitte, bevor Sie
            unterschreiben.
          </p>
        </div>

        <Absatz nummer="§ 1" titel="Wer hier Vertragspartner ist">
          <p>
            Anbieterin ist Ulrike Elferich, Auf dem Kamp 20, 21635 Jork
            (nachfolgend „Auftragnehmerin"). Kunde ist, wer einen Auftrag
            erteilt (nachfolgend „Auftraggeber").
          </p>
          <p>
            Diese Bedingungen gelten für alle Aufträge zu Gestaltung,
            Umsetzung und Betreuung von Websites sowie zu Logo- und
            Corporate Design. Abweichende Bedingungen des Auftraggebers
            gelten nur, wenn sie ausdrücklich schriftlich vereinbart wurden.
          </p>
        </Absatz>

        <Absatz nummer="§ 2" titel="Wie ein Auftrag zustande kommt">
          <p>
            Die Darstellung der Pakete auf dieser Website ist noch kein
            Angebot im rechtlichen Sinn, sondern eine Einladung, eines
            anzufragen. Ein Vertrag kommt zustande, wenn die
            Auftragnehmerin ein schriftliches Angebot erstellt und der
            Auftraggeber es annimmt — per E-Mail genügt.
          </p>
          <p>
            Im Angebot stehen Leistungsumfang, Preis und ein voraussichtlicher
            Zeitrahmen. Was dort nicht steht, ist nicht enthalten.
          </p>
        </Absatz>

        <Absatz nummer="§ 3" titel="Preise und Umsatzsteuer">
          <p>
            Alle genannten Preise sind Endpreise. Die Auftragnehmerin ist
            Kleinunternehmerin nach § 19 UStG und weist keine Umsatzsteuer
            aus.
          </p>
          <ul className="mt-4 space-y-2">
            {pricing.map((p) => (
              <li key={p.name} className="text-silver">
                <span className="text-parchment">{p.name}:</span> {p.from}{" "}
                einmalig, {p.monthly.replace("zzgl. ", "")}
              </li>
            ))}
          </ul>
          <p className="mt-4">
            Der einmalige Betrag deckt Gestaltung und Umsetzung ab, der
            monatliche Beitrag Hosting, Sicherung, technische Pflege und
            Inhaltsänderungen im vereinbarten Umfang.
          </p>
        </Absatz>

        <Absatz nummer="§ 4" titel="Zahlung">
          <p>{paketBedingungen.zahlung}</p>
          <p>
            Rechnungen sind innerhalb von 14 Tagen ohne Abzug zu zahlen.
            Bleibt eine Zahlung länger als 30 Tage offen, kann die
            Auftragnehmerin die Arbeit aussetzen, bis der Betrag beglichen
            ist — sie kündigt das vorher an.
          </p>
        </Absatz>

        <Absatz nummer="§ 5" titel="Mitwirkung des Auftraggebers">
          <p>
            Für die Arbeit werden Inhalte benötigt: Texte, Bilder, Logos,
            Angaben zu Leistungen und Ansprechpartnern. Der Auftraggeber
            stellt sie rechtzeitig und vollständig bereit.
          </p>
          <p>
            Verzögert sich die Zulieferung, verschiebt sich der Zeitrahmen
            entsprechend. Das ist keine Vertragsstrafe, sondern eine
            Selbstverständlichkeit: Ohne Inhalte kann eine Seite nicht
            fertig werden.
          </p>
        </Absatz>

        <Absatz nummer="§ 6" titel="Rechte an Inhalten">
          <p>
            Der Auftraggeber versichert, dass er die Rechte an allen
            gelieferten Inhalten besitzt — insbesondere an Fotos und Texten.
            Werden Inhalte ohne Erlaubnis verwendet und macht ein Dritter
            Ansprüche geltend, trägt der Auftraggeber die Folgen und stellt
            die Auftragnehmerin davon frei.
          </p>
          <p>
            Die Auftragnehmerin weist darauf hin, wenn ihr Zweifel an der
            Herkunft eines Inhalts kommen, ist aber nicht verpflichtet,
            jedes Bild zu prüfen.
          </p>
        </Absatz>

        <Absatz nummer="§ 7" titel="Korrekturen und Änderungen">
          <p>{paketBedingungen.korrekturen}</p>
          <p>
            Änderungswünsche, die den vereinbarten Leistungsumfang
            erweitern — etwa zusätzliche Unterseiten oder ein zweites
            Gestaltungskonzept — werden vorher gesondert angeboten.
          </p>
        </Absatz>

        <Absatz nummer="§ 8" titel="Nutzungsrechte an der fertigen Arbeit">
          <p>
            Mit vollständiger Bezahlung erhält der Auftraggeber das
            zeitlich, räumlich und inhaltlich unbeschränkte Recht, die
            gestalteten Arbeiten für seinen Betrieb zu nutzen. Das gilt für
            Website, Logo und Gestaltungselemente gleichermaßen.
          </p>
          <p>
            Die Auftragnehmerin darf die Arbeiten als Referenz zeigen — auf
            dieser Website, in Angeboten und in sozialen Netzwerken. Wenn
            der Auftraggeber das nicht möchte, genügt ein Hinweis; es
            entstehen dadurch keine Nachteile.
          </p>
        </Absatz>

        <Absatz nummer="§ 9" titel="Laufzeit und Kündigung">
          <p>{paketBedingungen.laufzeit}</p>
          <p>{paketBedingungen.kuendigung}</p>
          <p>
            Die Kündigung bedarf der Textform — eine E-Mail genügt. Das
            Recht zur außerordentlichen Kündigung aus wichtigem Grund
            bleibt für beide Seiten unberührt.
          </p>
        </Absatz>

        <Absatz nummer="§ 10" titel="Verfügbarkeit und Störungen">
          <p>
            Die Website wird bei Strato gehostet. Eine ununterbrochene
            Erreichbarkeit kann niemand zusichern — Wartungen, Störungen
            beim Rechenzentrum oder Ausfälle im Netz liegen außerhalb des
            Einflusses der Auftragnehmerin.
          </p>
          <p>
            Störungen, die die Auftragnehmerin beheben kann, bearbeitet sie
            innerhalb eines Werktags nach Kenntnis. Für Schäden durch
            Ausfälle des Hosters haftet sie nicht.
          </p>
        </Absatz>

        <Absatz nummer="§ 11" titel="Datenschutz">
          <p>
            Betreut die Auftragnehmerin eine Website, auf der
            personenbezogene Daten verarbeitet werden, schließen beide
            Seiten einen Vertrag zur Auftragsverarbeitung nach Art. 28
            DSGVO. Eine Vorlage stellt die Auftragnehmerin bereit.
          </p>
          <p>
            Wie diese Website selbst mit Daten umgeht, steht in der{" "}
            <Link
              href="/datenschutz/"
              className="text-gold-text underline underline-offset-4 hover:text-parchment transition-colors"
            >
              Datenschutzerklärung
            </Link>
            .
          </p>
        </Absatz>

        <Absatz nummer="§ 12" titel="Haftung">
          <p>
            Die Auftragnehmerin haftet unbeschränkt für Vorsatz und grobe
            Fahrlässigkeit sowie für Schäden aus der Verletzung des Lebens,
            des Körpers oder der Gesundheit.
          </p>
          <p>
            Bei einfacher Fahrlässigkeit haftet sie nur, wenn eine Pflicht
            verletzt wird, auf deren Erfüllung der Auftraggeber vertrauen
            darf und die für den Vertrag wesentlich ist. In diesem Fall ist
            die Haftung auf den Schaden begrenzt, mit dem bei
            Vertragsschluss typischerweise zu rechnen war.
          </p>
          <p>
            Für Inhalte, die der Auftraggeber selbst einstellt oder
            einstellen lässt, haftet sie nicht.
          </p>
        </Absatz>

        <Absatz nummer="§ 13" titel="Widerrufsrecht für Verbraucher">
          <p>
            Verbraucher haben bei Verträgen, die ausschließlich per E-Mail,
            Telefon oder über diese Website geschlossen werden, ein
            Widerrufsrecht von 14 Tagen. Die Frist beginnt mit dem
            Vertragsschluss.
          </p>
          <p>
            Soll die Arbeit vor Ablauf dieser Frist beginnen, ist dazu die
            ausdrückliche Zustimmung des Auftraggebers nötig. Widerruft er
            danach, ist die bis dahin erbrachte Leistung anteilig zu
            vergüten.
          </p>
          <p>
            Für Unternehmer — also die meisten Auftraggeber hier — gilt
            dieses Widerrufsrecht nicht.
          </p>
        </Absatz>

        <Absatz nummer="§ 14" titel="Schlussbestimmungen">
          <p>
            Es gilt deutsches Recht. Ist der Auftraggeber Unternehmer, ist
            Gerichtsstand der Sitz der Auftragnehmerin.
          </p>
          <p>
            Sollte eine Bestimmung dieser Bedingungen unwirksam sein,
            bleiben die übrigen davon unberührt.
          </p>
          <p>
            Ein Hinweis auf die EU-Plattform zur Online-Streitbeilegung
            entfällt: Sie wurde zum 20. Juli 2025 abgeschaltet.
          </p>
        </Absatz>

        <div className="border-t border-line pt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
          <p className="text-[0.85rem] text-silver/70 mr-auto">Stand: {heute}</p>
          {/* Rückweg zu den Paketen: Wer die Bedingungen gelesen hat, will
              meist wissen, worauf sie sich beziehen. */}
          <Link
            href="/#preise"
            className="text-[0.8rem] tracking-[0.12em] uppercase text-gold-text hover:text-parchment transition-colors"
          >
            Pakete im Überblick
          </Link>
          <Link
            href="/#kontakt"
            className="text-[0.8rem] tracking-[0.12em] uppercase text-gold-text hover:text-parchment transition-colors"
          >
            Frage stellen
          </Link>
        </div>
      </div>
    </main>
  );
}
