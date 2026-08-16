# Anfrage- und Briefing-Strecke einschalten

Alles ist gebaut und läuft — nur der automatische Versand fehlt, weil
die Seite ein statischer Export ohne Server ist. Beides sind Einzeiler,
sobald ein Zugang da ist.

## 1 · Dienst anlegen

Konto bei **Formspree** oder **Web3Forms** anlegen (beide haben eine
kostenlose Stufe) und zwei Formulare erstellen:

| Formular | Zweck |
|---|---|
| Anfrage | die kurze Projektanfrage von der Startseite |
| Briefing | das ausführliche Briefing |

## 2 · Adressen eintragen

Je eine Zeile:

- `src/components/Anfrageformular.tsx` → `const FORM_ENDPOINT = "…"`
- `src/components/Briefingformular.tsx` → `const ZIEL_ADRESSE = "…"`

Solange sie leer sind, öffnet sich das E-Mail-Programm des Besuchers mit
der fertigen Nachricht. Das funktioniert, verlangt aber einen zusätzlichen
Klick — und wer den vergisst, hat umsonst ausgefüllt.

## 3 · Automatische Antwort einrichten

Im Dienst unter „Autoresponse" den Inhalt von `bestaetigung.html`
einsetzen. Der Platzhalter `{{name}}` wird dort ersetzt; heißt das Feld
anders, im Text anpassen.

Als Absendername „Webdesign Elfe" eintragen und als Antwortadresse
`info@webdesign-elfe.de`, damit Rückfragen ankommen.

## 4 · Terminbuchung (optional)

In `src/data/briefing.ts` unter `danke.terminZiel` die Adresse des
Kalenders eintragen (Cal.com, Calendly). Solange sie leer ist, führt der
Knopf auf den Kontaktbereich — er läuft also nie ins Leere.

## 5 · Was rechtlich nachgezogen werden muss

Sobald ein Dienst eingetragen ist, stimmt die Datenschutzerklärung nicht
mehr: Dort steht ausdrücklich, dass das Formular nichts an einen Server
überträgt. Zu ergänzen sind dann mindestens

- der Dienst als Empfänger, mit Sitz und Rechtsgrundlage
- ein Auftragsverarbeitungsvertrag mit dem Anbieter
- eine Löschfrist für die eingegangenen Anfragen

Die Fassung stammt von der IT-Recht-Kanzlei — die Ergänzung gehört
dorthin, nicht in dieses Repository. **Das ist keine Rechtsberatung.**

## Was das System heute schon kann

- Anfrage in drei Schritten, Briefing in sieben
- Zwischenstand des Briefings im Browser des Kunden; nach dem Absenden
  gelöscht
- Prüfung der E-Mail-Adresse während der Eingabe
- Interne Zusammenfassung nach Themen geordnet, mit einem Block
  **ACHTUNG** ganz oben: fester Termin, Eile, fehlendes Material,
  bestehende Google-Platzierungen, aufwendige Funktionen, offene Fragen
- Keine Passwortfelder; ein sichtbarer Hinweis darauf im Formular

## Was bewusst fehlt

**Datei-Uploads.** Die kostenlosen Stufen der Formulardienste nehmen
keine oder nur wenige Megabyte an Anhängen. Ein Feld, das eine
Bildersammlung stillschweigend verschluckt, ist schlimmer als keines.
Stattdessen fragt das Briefing, *was* vorliegt, und bietet ein Feld für
einen Übertragungslink.

Sollen echte Uploads dazukommen, führt kein Weg an einem Server vorbei —
dann wäre ein Umzug auf Vercel oder Netlify der nächste Schritt.
