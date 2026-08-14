import Verweis from "@/components/Verweis";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { contact } from "@/data/content";

export const metadata = {
  title: "Datenschutzerklärung — Webdesign Elfe",
  description:
    "Informationen zur Verarbeitung personenbezogener Daten auf webdesign-elfe.de — ohne Cookies, ohne Tracking, ohne fremde Dienste.",
  robots: { index: true, follow: true },
};

/* Diese Erklärung beschreibt, was die Seite tatsächlich tut — nicht, was
   eine Vorlage vermutet. Gemessen wurde: keine Cookies, kein Speicher im
   Browser, keine Verbindung zu fremden Servern. Die Schriften liegen im
   Projekt, das Formular überträgt nichts an einen Server.

   Ändert sich daran etwas — etwa durch einen Formular-Dienst, eine
   Kartenanzeige oder Statistik —, muss dieser Text mitwachsen. */

const zeile = "text-silver leading-relaxed";
const ueberschrift =
  "font-serif-display text-shadow-elegant text-[1.35rem] text-parchment mt-10 mb-3";

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

        {/* Das Wichtigste zuerst — wer nur eine Frage hat, findet die
            Antwort ohne zu suchen. */}
        <div className="rounded-sm border border-gold/35 bg-[linear-gradient(160deg,rgba(201,162,39,0.10),rgba(0,0,0,0.20))] p-6">
          <p className="text-parchment leading-relaxed">
            Diese Website verwendet <strong>keine Cookies</strong>, kein
            Tracking, keine Analysewerkzeuge und bindet keine Inhalte fremder
            Anbieter ein. Auch die Schriften werden vom eigenen Server
            ausgeliefert. Es findet keine Datenübermittlung in Länder außerhalb
            der EU statt.
          </p>
        </div>

        <h2 className={ueberschrift}>1. Verantwortliche</h2>
        <p className={zeile}>
          Ulrike Elferich
          <br />
          Webdesign Elfe
          <br />
          Auf dem Kamp 20, 21635 Jork
          <br />
          Telefon:{" "}
          <a href="tel:+4915774214544" className="text-gold-bright hover:underline">
            0157 74214544
          </a>
          <br />
          E-Mail:{" "}
          <a
            href={`mailto:${contact.email}`}
            className="text-gold-bright hover:underline"
          >
            {contact.email}
          </a>
        </p>

        <h2 className={ueberschrift}>2. Server-Logdateien</h2>
        <p className={zeile}>
          Beim Aufruf dieser Website erhebt der Hostinganbieter automatisch
          Daten, die Ihr Browser übermittelt: aufgerufene Seite, Datum und
          Uhrzeit des Zugriffs, übertragene Datenmenge, verwendeter Browser und
          Betriebssystem, die zuvor besuchte Seite sowie die IP-Adresse.
        </p>
        <p className={zeile}>
          Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO. Das berechtigte
          Interesse liegt im sicheren und störungsfreien Betrieb der Website.
          Diese Daten werden nicht mit anderen Datenquellen zusammengeführt und
          nicht zur Auswertung des Nutzungsverhaltens verwendet.
        </p>

        <h2 className={ueberschrift}>3. Hosting</h2>
        <p className={zeile}>
          Die Website wird gehostet bei der Strato AG, Otto-Ostrowski-Straße 7,
          10249 Berlin. Die Server stehen in Deutschland. Mit dem Anbieter
          besteht ein Vertrag über die Auftragsverarbeitung nach Art. 28 DSGVO.
        </p>

        <h2 className={ueberschrift}>4. Kontaktformular</h2>
        <p className={zeile}>
          Das Formular auf dieser Seite überträgt{" "}
          <strong>keine Daten an einen Server</strong>. Ihre Eingaben werden
          ausschließlich in Ihrem Browser zusammengestellt und in Ihr eigenes
          E-Mail-Programm übernommen. Ob Sie die fertige Nachricht abschicken,
          entscheiden Sie selbst — erst dann erreichen mich Ihre Angaben, und
          zwar als gewöhnliche E-Mail.
        </p>
        <p className={zeile}>
          Pflichtangaben sind nur Name, E-Mail-Adresse und Ihre Nachricht. Alle
          weiteren Felder — Telefon, Betrieb, Anschrift — sind freiwillig und
          dienen allein dazu, Rückfragen zu ersparen.
        </p>

        <h2 className={ueberschrift}>5. Anfragen per E-Mail, Telefon und Post</h2>
        <p className={zeile}>
          Wenn Sie mich kontaktieren, verarbeite ich Ihren Namen, Ihre
          Kontaktdaten und den Inhalt Ihrer Anfrage, um diese zu bearbeiten.
          Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO, sofern die Anfrage der
          Anbahnung oder Erfüllung eines Vertrags dient, andernfalls Art. 6
          Abs. 1 lit. f DSGVO aufgrund des berechtigten Interesses an der
          Beantwortung. Das E-Mail-Postfach wird bei der Strato AG betrieben.
        </p>
        <p className={zeile}>
          Ihre Daten werden gelöscht, sobald der zugrunde liegende Vorgang
          abgeschlossen ist und keine gesetzlichen Aufbewahrungspflichten
          entgegenstehen. Bei geschäftlichen Vorgängen bestehen handels- und
          steuerrechtliche Aufbewahrungsfristen von sechs beziehungsweise zehn
          Jahren.
        </p>

        <h2 className={ueberschrift}>6. Ihre Rechte</h2>
        <p className={zeile}>
          Sie haben jederzeit das Recht auf Auskunft über die zu Ihrer Person
          gespeicherten Daten (Art. 15 DSGVO), auf Berichtigung (Art. 16), auf
          Löschung (Art. 17), auf Einschränkung der Verarbeitung (Art. 18), auf
          Datenübertragbarkeit (Art. 20) sowie auf Widerspruch gegen die
          Verarbeitung (Art. 21). Eine erteilte Einwilligung können Sie
          jederzeit mit Wirkung für die Zukunft widerrufen.
        </p>
        <p className={zeile}>
          Für die Ausübung genügt eine formlose Nachricht an{" "}
          <a
            href={`mailto:${contact.email}`}
            className="text-gold-bright hover:underline"
          >
            {contact.email}
          </a>
          .
        </p>

        <h2 className={ueberschrift}>7. Beschwerderecht</h2>
        <p className={zeile}>
          Sie können sich bei einer Aufsichtsbehörde beschweren. Zuständig ist
          die Landesbeauftragte für den Datenschutz Niedersachsen, Prinzenstraße
          5, 30159 Hannover.
        </p>

        <h2 className={ueberschrift}>8. Verschlüsselte Übertragung</h2>
        <p className={zeile}>
          Diese Website wird verschlüsselt übertragen (SSL/TLS). Sie erkennen
          das am Schlosssymbol in der Adresszeile Ihres Browsers. Bei
          verschlüsselter Verbindung können Ihre Eingaben nicht von Dritten
          mitgelesen werden.
        </p>

        <h2 className={ueberschrift}>9. Änderungen</h2>
        <p className={zeile}>
          Diese Erklärung beschreibt den Stand der Website zum Zeitpunkt der
          Veröffentlichung. Ändert sich der Funktionsumfang, wird sie
          entsprechend angepasst.
        </p>

        <p className="text-silver text-sm mt-14">
          <Verweis href="/" className="text-gold-bright hover:underline">
            ← Zurück zur Startseite
          </Verweis>
        </p>
      </main>
      <Footer />
    </>
  );
}
