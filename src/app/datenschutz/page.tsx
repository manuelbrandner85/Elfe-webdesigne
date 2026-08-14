import Verweis from "@/components/Verweis";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { contact } from "@/data/content";

export const metadata = {
  title: "Datenschutzerklärung — Webdesign Elfe",
  description:
    "Informationen zur Verarbeitung personenbezogener Daten auf webdesign-elfe.de.",
  robots: { index: true, follow: true },
};

/* Diese Erklärung ist die von der IT-Recht-Kanzlei erstellte Fassung.

   Sie ersetzt einen zuvor selbst geschriebenen Text. Der war gut lesbar,
   aber an einer Stelle schlicht falsch: Er nannte die Strato AG als
   Hostinganbieter mit Servern in Deutschland und schloss eine
   Übermittlung außerhalb der EU ausdrücklich aus. Ausgeliefert wird die
   Seite derzeit jedoch über GitHub Pages, und davor liegt das
   Auslieferungsnetz von Fastly mit Sitz in den USA. Eine
   Datenschutzerklärung, die den tatsächlichen Anbieter verschweigt, ist
   schlechter als gar keine — deshalb der Wechsel auf die anwaltliche
   Fassung.

   Der juristische Text ist wortgetreu übernommen. Er duzt, weil er so
   beauftragt wurde; die übrige Seite siezt. Das ist eine bewusst offene
   Stelle, keine Nachlässigkeit — die Anrede eines anwaltlich gepflegten
   Textes ändert man nicht nebenbei, dafür gibt es im Mandantenportal die
   Sie-Variante.

   Zwei Ergänzungen sind als solche gekennzeichnet und stehen dort, wo
   die Vorlage allgemein bleibt, die Seite aber etwas Konkretes tut:
   das Verhalten des Kontaktformulars und die zuständige Aufsichts-
   behörde. Beide erweitern, sie ändern nichts. */

const zeile = "text-silver leading-relaxed";
const ueberschrift =
  "font-serif-display text-shadow-elegant text-[1.35rem] text-parchment mt-10 mb-3";
const unter = "text-parchment font-medium mt-6 mb-2";
const liste = "text-silver leading-relaxed list-disc pl-5 space-y-1 my-3";

/* Eigene Anmerkungen sichtbar vom anwaltlichen Text trennen — wer prüft,
   muss auf einen Blick sehen, was aus der Vorlage stammt. */
function Anmerkung({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-4 border-l-2 border-gold/45 pl-4">
      <p className="text-[0.7rem] uppercase tracking-[0.18em] text-gold-text mb-1">
        Ergänzung zu dieser Website
      </p>
      <p className={zeile}>{children}</p>
    </div>
  );
}

export default function Datenschutz() {
  return (
    <>
      <Nav />
      <main className="flex-1 pt-40 pb-24 max-w-3xl mx-auto px-6 lg:px-8">
        <p className="text-[0.78rem] tracking-[0.2em] uppercase text-gold-text mb-3">
          Rechtliches
        </p>
        {/* Kleinere Grundgröße und Silbentrennung: „Datenschutzerklärung“
            ist bei 36 Pixeln breiter als ein 320er Bildschirm und würde
            sonst die ganze Seite auseinanderziehen. */}
        <h1
          lang="de"
          className="font-serif-display text-shadow-elegant text-3xl sm:text-4xl text-parchment mb-4 hyphens-auto [overflow-wrap:anywhere]"
        >
          Datenschutzerklärung
        </h1>
        <div className="rule-gold w-24 mb-10" />

        <h2 className={ueberschrift}>
          1) Einleitung und Kontaktdaten des Verantwortlichen
        </h2>
        <p className={zeile}>
          1.1 Wir freuen uns, dass du unsere Website besuchst und bedanken uns
          für dein Interesse. Im Folgenden informieren wir dich über den Umgang
          mit deinen personenbezogenen Daten bei der Nutzung unserer Website.
          Personenbezogene Daten sind hierbei alle Daten, mit denen du
          persönlich identifiziert werden kannst.
        </p>
        <p className={zeile}>
          1.2 Verantwortlicher für die Datenverarbeitung auf dieser Website im
          Sinne der Datenschutz-Grundverordnung (DSGVO) ist Ulrike Elferich,
          www.webdesign-elfe.de, Auf dem Kamp 20, 21635 Jork, Deutschland, Tel.:{" "}
          <a href="tel:+4915774214544" className="text-gold-bright hover:underline">
            015774214544
          </a>
          , E-Mail:{" "}
          <a
            href={`mailto:${contact.email}`}
            className="text-gold-bright hover:underline"
          >
            {contact.email}
          </a>
          . Der für die Verarbeitung von personenbezogenen Daten Verantwortliche
          ist diejenige natürliche oder juristische Person, die allein oder
          gemeinsam mit anderen über die Zwecke und Mittel der Verarbeitung von
          personenbezogenen Daten entscheidet.
        </p>

        <h2 className={ueberschrift}>2) Datenerfassung beim Besuch unserer Website</h2>
        <p className={zeile}>
          2.1 Bei der bloß informatorischen Nutzung unserer Website, also wenn
          du dich nicht registrierst oder uns anderweitig Informationen
          übermittelst, erheben wir nur solche Daten, die dein Browser an den
          Seitenserver übermittelt (sog. „Server-Logfiles“). Wenn du unsere
          Website aufrufst, erheben wir die folgenden Daten, die für uns
          technisch erforderlich sind, um dir die Website anzuzeigen:
        </p>
        <ul className={liste}>
          <li>Unsere besuchte Website</li>
          <li>Datum und Uhrzeit zum Zeitpunkt des Zugriffs</li>
          <li>Menge der gesendeten Daten in Byte</li>
          <li>Quelle/Verweis, von welchem du auf die Seite gelangtest</li>
          <li>Verwendeter Browser</li>
          <li>Verwendetes Betriebssystem</li>
          <li>Verwendete IP-Adresse (ggf.: in anonymisierter Form)</li>
        </ul>
        <p className={zeile}>
          Die Verarbeitung erfolgt gemäß Art. 6 Abs. 1 lit. f DSGVO auf Basis
          unseres berechtigten Interesses an der Verbesserung der Stabilität und
          Funktionalität unserer Website. Eine Weitergabe oder anderweitige
          Verwendung der Daten findet nicht statt. Wir behalten uns allerdings
          vor, die Server-Logfiles nachträglich zu überprüfen, sollten konkrete
          Anhaltspunkte auf eine rechtswidrige Nutzung hinweisen.
        </p>
        <p className={zeile}>
          2.2 Diese Website nutzt aus Sicherheitsgründen und zum Schutz der
          Übertragung personenbezogener Daten und anderer vertraulicher Inhalte
          (z.B. Bestellungen oder Anfragen an uns) eine SSL- bzw.
          TLS-Verschlüsselung. Du kannst eine verschlüsselte Verbindung an der
          Zeichenfolge „https://“ und dem Schloss-Symbol in deiner Browserzeile
          erkennen.
        </p>

        <h2 className={ueberschrift}>3) Hosting &amp; Content-Delivery-Network</h2>
        <p className={unter}>Fastly</p>
        <p className={zeile}>
          Wir nutzen ein Content Delivery Network des folgenden Anbieters:
          Fastly Inc., 475 Brannan St. #300, San Francisco, CA 94107, USA
        </p>
        <p className={zeile}>
          Dieser Dienst ermöglicht uns, große Mediendateien wie Grafiken,
          Seiteninhalte oder Skripte über ein Netz regional verteilter Server
          schneller auszuliefern. Die Verarbeitung erfolgt zur Wahrung unseres
          berechtigten Interesses an der Verbesserung der Stabilität und
          Funktionalität unserer Website gem. Art. 6 Abs. 1 lit. f DSGVO. Wir
          haben mit dem Anbieter einen Auftragsverarbeitungsvertrag geschlossen,
          der den Schutz der Daten unserer Seitenbesucher sicherstellt und eine
          unberechtigte Weitergabe an Dritte untersagt.
        </p>
        <p className={zeile}>
          Für Datenübermittlungen in die USA hat sich der Anbieter dem
          EU-US-Datenschutzrahmen (EU-US Data Privacy Framework) angeschlossen,
          das auf Basis eines Angemessenheitsbeschlusses der Europäischen
          Kommission die Einhaltung des europäischen Datenschutzniveaus
          sicherstellt.
        </p>

        <h2 className={ueberschrift}>4) Kontaktaufnahme</h2>
        <p className={zeile}>
          Im Rahmen der Kontaktaufnahme mit uns (z.B. per Kontaktformular oder
          E-Mail) werden personenbezogene Daten erhoben. Welche Daten im Falle
          der Nutzung eines Kontaktformulars erhoben werden, ist aus dem
          jeweiligen Kontaktformular ersichtlich. Diese Daten werden
          ausschließlich zum Zweck der Beantwortung deines Anliegens bzw. für
          die Kontaktaufnahme und die damit verbundene technische Administration
          gespeichert und verwendet.
        </p>
        <p className={zeile}>
          Rechtsgrundlage für die Verarbeitung dieser Daten ist unser
          berechtigtes Interesse an der Beantwortung deines Anliegens gemäß
          Art. 6 Abs. 1 lit. f DSGVO. Zielt deine Kontaktierung auf den Abschluss
          eines Vertrages ab, so ist zusätzliche Rechtsgrundlage für die
          Verarbeitung Art. 6 Abs. 1 lit. b DSGVO. Deine Daten werden nach
          abschließender Bearbeitung deiner Anfrage gelöscht. Dies ist der Fall,
          wenn sich aus den Umständen entnehmen lässt, dass der betroffene
          Sachverhalt abschließend geklärt ist und sofern keine gesetzlichen
          Aufbewahrungspflichten entgegenstehen.
        </p>
        <Anmerkung>
          Das Formular auf dieser Seite überträgt deine Eingaben{" "}
          <strong>nicht an einen Server</strong>. Sie werden ausschließlich in
          deinem Browser zu einer Nachricht zusammengesetzt und an dein eigenes
          E-Mail-Programm übergeben. Ob du sie absendest, entscheidest du
          selbst — erst dann erreichen uns deine Angaben, und zwar als
          gewöhnliche E-Mail. Pflichtangaben sind nur Name, E-Mail-Adresse und
          die Nachricht; alle weiteren Felder sind freiwillig.
        </Anmerkung>

        <h2 className={ueberschrift}>5) Rechte des Betroffenen</h2>
        <p className={zeile}>
          5.1 Das geltende Datenschutzrecht gewährt dir gegenüber uns als
          Verantwortlichen hinsichtlich der Verarbeitung deiner
          personenbezogenen Daten die nachstehenden Betroffenenrechte
          (Auskunfts- und Interventionsrechte), wobei für die jeweiligen
          Ausübungsvoraussetzungen auf die angeführte Rechtsgrundlage verwiesen
          wird:
        </p>
        <ul className={liste}>
          <li>Auskunftsrecht gemäß Art. 15 DSGVO;</li>
          <li>Recht auf Berichtigung gemäß Art. 16 DSGVO;</li>
          <li>Recht auf Löschung gemäß Art. 17 DSGVO;</li>
          <li>Recht auf Einschränkung der Verarbeitung gemäß Art. 18 DSGVO;</li>
          <li>Recht auf Unterrichtung gemäß Art. 19 DSGVO;</li>
          <li>Recht auf Datenübertragbarkeit gemäß Art. 20 DSGVO;</li>
          <li>Recht auf Widerruf erteilter Einwilligungen gemäß Art. 7 Abs. 3 DSGVO;</li>
          <li>Recht auf Beschwerde gemäß Art. 77 DSGVO.</li>
        </ul>
        <Anmerkung>
          Für eine Beschwerde nach Art. 77 DSGVO ist die Landesbeauftragte für
          den Datenschutz Niedersachsen zuständig, Prinzenstraße 5, 30159
          Hannover. Für die Ausübung aller übrigen Rechte genügt eine formlose
          Nachricht an{" "}
          <a
            href={`mailto:${contact.email}`}
            className="text-gold-bright hover:underline"
          >
            {contact.email}
          </a>
          .
        </Anmerkung>

        <p className={unter}>5.2 Widerspruchsrecht</p>
        {/* Die Vorlage setzt diesen Abschnitt in Großbuchstaben, weil das
            Gesetz eine hervorgehobene Darstellung verlangt. Versalien über
            mehrere Absätze sind allerdings messbar schlechter lesbar und
            werden von Vorleseprogrammen teils buchstabiert. Die
            Hervorhebung übernimmt deshalb der Rahmen, der Text bleibt
            gemischt — inhaltlich unverändert. */}
        <div className="rounded-sm border border-gold/35 bg-[linear-gradient(160deg,rgba(201,162,39,0.10),rgba(0,0,0,0.20))] p-6 space-y-4">
          <p className="text-parchment leading-relaxed">
            Wenn wir im Rahmen einer Interessenabwägung deine personenbezogenen
            Daten aufgrund unseres überwiegenden berechtigten Interesses
            verarbeiten, hast du das jederzeitige Recht, aus Gründen, die sich
            aus deiner besonderen Situation ergeben, gegen diese Verarbeitung
            Widerspruch mit Wirkung für die Zukunft einzulegen.
          </p>
          <p className="text-parchment leading-relaxed">
            Machst du von deinem Widerspruchsrecht Gebrauch, beenden wir die
            Verarbeitung der betroffenen Daten. Eine Weiterverarbeitung bleibt
            aber vorbehalten, wenn wir zwingende schutzwürdige Gründe für die
            Verarbeitung nachweisen können, die deine Interessen, Grundrechte
            und Grundfreiheiten überwiegen, oder wenn die Verarbeitung der
            Geltendmachung, Ausübung oder Verteidigung von Rechtsansprüchen
            dient.
          </p>
          <p className="text-parchment leading-relaxed">
            Werden deine personenbezogenen Daten von uns verarbeitet, um
            Direktwerbung zu betreiben, hast du das Recht, jederzeit
            Widerspruch gegen die Verarbeitung dich betreffender
            personenbezogener Daten zum Zwecke derartiger Werbung einzulegen. Du
            kannst den Widerspruch wie oben beschrieben ausüben.
          </p>
          <p className="text-parchment leading-relaxed">
            Machst du von deinem Widerspruchsrecht Gebrauch, beenden wir die
            Verarbeitung der betroffenen Daten zu Direktwerbezwecken.
          </p>
        </div>

        <h2 className={ueberschrift}>
          6) Dauer der Speicherung personenbezogener Daten
        </h2>
        <p className={zeile}>
          Die Dauer der Speicherung von personenbezogenen Daten bemisst sich
          anhand der jeweiligen Rechtsgrundlage, am Verarbeitungszweck und –
          sofern einschlägig – zusätzlich anhand der jeweiligen gesetzlichen
          Aufbewahrungsfrist (z.B. handels- und steuerrechtliche
          Aufbewahrungsfristen).
        </p>
        <p className={zeile}>
          Bei der Verarbeitung von personenbezogenen Daten auf Grundlage einer
          ausdrücklichen Einwilligung gemäß Art. 6 Abs. 1 lit. a DSGVO werden
          die betroffenen Daten so lange gespeichert, bis du deine Einwilligung
          widerrufst.
        </p>
        <p className={zeile}>
          Existieren gesetzliche Aufbewahrungsfristen für Daten, die im Rahmen
          rechtsgeschäftlicher bzw. rechtsgeschäftsähnlicher Verpflichtungen auf
          der Grundlage von Art. 6 Abs. 1 lit. b DSGVO verarbeitet werden,
          werden diese Daten nach Ablauf der Aufbewahrungsfristen routinemäßig
          gelöscht, sofern sie nicht mehr zur Vertragserfüllung oder
          Vertragsanbahnung erforderlich sind und/oder unsererseits kein
          berechtigtes Interesse an der Weiterspeicherung fortbesteht.
        </p>
        <p className={zeile}>
          Bei der Verarbeitung von personenbezogenen Daten auf Grundlage von
          Art. 6 Abs. 1 lit. f DSGVO werden diese Daten so lange gespeichert, bis
          du dein Widerspruchsrecht nach Art. 21 Abs. 1 DSGVO ausübst, es sei
          denn, wir können zwingende schutzwürdige Gründe für die Verarbeitung
          nachweisen, die deine Interessen, Rechte und Freiheiten überwiegen,
          oder die Verarbeitung dient der Geltendmachung, Ausübung oder
          Verteidigung von Rechtsansprüchen.
        </p>
        <p className={zeile}>
          Bei der Verarbeitung von personenbezogenen Daten zum Zwecke der
          Direktwerbung auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO werden diese
          Daten so lange gespeichert, bis du dein Widerspruchsrecht nach Art. 21
          Abs. 2 DSGVO ausübst.
        </p>
        <p className={zeile}>
          Sofern sich aus den sonstigen Informationen dieser Erklärung über
          spezifische Verarbeitungssituationen nichts anderes ergibt, werden
          gespeicherte personenbezogene Daten im Übrigen dann gelöscht, wenn sie
          für die Zwecke, für die sie erhoben oder auf sonstige Weise verarbeitet
          wurden, nicht mehr notwendig sind.
        </p>

        <p className="text-silver/70 text-[0.78rem] leading-relaxed mt-12 pt-6 border-t border-line">
          Copyright © 2026, IT-Recht-Kanzlei GmbH &amp; Co. KG · Alter
          Messeplatz 2 · 80339 München ·{" "}
          <a
            href="https://www.it-recht-kanzlei.de"
            rel="noopener noreferrer"
            target="_blank"
            className="text-gold-bright hover:underline"
          >
            www.it-recht-kanzlei.de
          </a>
        </p>

        <p className="text-silver text-sm mt-10">
          <Verweis href="/" className="text-gold-bright hover:underline">
            ← Zurück zur Startseite
          </Verweis>
        </p>
      </main>
      <Footer />
    </>
  );
}
