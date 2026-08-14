"use client";

import { useEffect, useRef } from "react";
import { useReduzierteBewegung } from "@/lib/bewegung";

/* Die Atmosphäre hinter der ganzen Seite.

   WARUM ÜBERHAUPT

   Siebzehn Bildschirme Inhalt standen bisher auf einer einzigen flachen
   Rauschtextur. Oben wie unten derselbe Graubraun, kein Licht, keine
   Tiefe, keine Veränderung über die Strecke. Genau daran erkennt man
   eine gut gemachte Seite gegenüber einer, die etwas kostet: nicht an
   der Typografie — die stimmte schon — sondern daran, ob der Raum
   dahinter existiert.

   Und die alte Ebene war teuer für das, was sie leistete: Sie lag als
   `mix-blend-mode: overlay` über der Seite. Ein fester, bildschirm-
   füllender Mischmodus zwingt den Browser, alles in einer Ebene zu
   halten und bei jedem Scrollbild neu zu verrechnen. Dieselbe Falle ist
   in globals.css beim Vorhang schon einmal dokumentiert worden — hier
   stand sie noch.

   WARUM PROZEDURAL UND NICHT ALS BILD

   Weil ein Bild nicht atmen kann. Ein Verlauf ist entweder oben warm
   oder unten warm; ein Shader ist über den Scroll hinweg beides und
   dazwischen alles. Und praktisch: Diese Bauumgebung erreicht keinen
   einzigen Medien-Anbieter — geprüft und mit `host_not_allowed`
   beantwortet. Was nicht heruntergeladen werden kann, muss gerechnet
   werden. Das ist hier kein Notbehelf: Zwölf Kilobyte Shader liefern
   eine Tiefe, für die ein Bild ein Megabyte bräuchte und die es
   trotzdem nicht hätte, weil sie sich bewegt.

   WAS ER TUT

   Vier Lichtstimmungen als Anker über die Seitenlänge, dazwischen
   interpoliert: warm und tief im Kopfbereich, kühl und klar bei den
   Arbeiten, wieder warm zum Kontakt. Kapitel durch Licht statt durch
   Überschriften. Darüber wandernde Nebelbänke aus zweifach verzerrtem
   Rauschen, ein weicher Lichtschacht, Tiefe zu den Rändern und
   Filmkorn.

   WAS ER KOSTET

   Gerechnet wird auf 55 Prozent der Fläche und mit 30 Bildern je
   Sekunde — ein Hintergrund, der sich in Zehntelsekunden kaum ändert,
   braucht weder jeden Pixel noch jedes Bild. Bleibt die Bildrate
   trotzdem unter dem Ziel, sinkt erst die Auflösung, dann hört die
   Ebene ganz auf und die alte Textur trägt weiter. Kein WebGL2,
   reduzierte Bewegung, versteckter Tab: dasselbe.

   Der Verzicht ist Teil der Gestaltung, nicht ihre Rücknahme. */

const VERTEX = `#version 300 es
in vec2 lage;
void main() { gl_Position = vec4(lage, 0.0, 1.0); }`;

const FRAGMENT = `#version 300 es
precision highp float;

out vec4 farbe;

uniform vec2  uFlaeche;   // Zeichenfläche in Pixeln
uniform float uZeit;      // Sekunden seit Beginn
uniform float uScroll;    // 0 oben, 1 unten
uniform vec2  uZeiger;    // gedämpfte Zeigerposition, -1 bis 1
uniform float uStaerke;   // Einblendung beim Start, 0 bis 1

/* --- Rauschen ---------------------------------------------------------
   Wertrauschen mit Hermite-Glättung. Bewusst kein Simplex: Der
   Unterschied ist bei vier Oktaven und dieser Weichzeichnung nicht zu
   sehen, kostet aber spürbar mehr Rechenzeit je Bildpunkt. */
float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float rauschen(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x),
             mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
}

/* Drei Oktaven, nicht vier.

   Die vierte Oktave liegt bei dieser Skalierung unterhalb dessen, was
   nach der Weichzeichnung und bei 45 Prozent Rechenauflösung noch
   sichtbar wird — sie kostet ein Viertel der Rechenzeit für nichts. */
float fbm(vec2 p) {
  float summe = 0.0;
  float gewicht = 0.5;
  for (int i = 0; i < 3; i++) {
    summe += gewicht * rauschen(p);
    p *= 2.03;          // kein glattes 2.0 — sonst legen sich die
    gewicht *= 0.5;     // Oktaven sichtbar aufeinander
  }
  return summe;
}

/* Verzerrtes Rauschen: Das Feld verschiebt sich selbst. Erst dadurch
   entstehen Schwaden mit Richtung statt gleichmäßiger Flecken.

   EINE Verzerrungsstufe, nicht zwei. Die zweite Stufe kostete allein
   das Doppelte des gesamten übrigen Shaders — zusammen kam der
   Hintergrund auf rund vierzig Rauschabfragen je Bildpunkt. Für eine
   Fläche, die absichtlich unscharf ist und sich in Zehntelsekunden kaum
   ändert, ist das keine Qualität, sondern Verschwendung. Mit einer
   Stufe sind es neun. Der Unterschied ist im Standbild nicht zu
   benennen; im Bildabstand war er der Unterschied zwischen flüssig und
   nicht. */
float schwaden(vec2 p, float t) {
  vec2 q = vec2(fbm(p + vec2(0.0, t * 0.05)),
                fbm(p + vec2(5.2, 1.3) - t * 0.04));
  return fbm(p + 2.6 * q);
}

/* --- Lichtstimmungen --------------------------------------------------
   Vier Anker über die Seitenlänge. Die Farben stammen aus der Marke:
   Stein als Grundton, Gold als Licht. */
vec3 stimmung(float s) {
  /* Die Werte liegen bewusst nahe am bisherigen Steinton (#5e5a55 =
     0.369). Der erste Versuch lag rund vierzig Prozent tiefer: Das sah
     für sich genommen eindrucksvoller aus, verschob aber die ganze
     Marke ins Dunkle und stellte jeden Kontrast in Frage, der auf den
     Karten sorgfältig eingestellt war. Tiefe entsteht hier durch das
     Gefälle innerhalb des Bildes, nicht dadurch, dass alles dunkler
     wird. */
  vec3 a = vec3(0.392, 0.368, 0.339);   // Kopfbereich — warm, offen
  vec3 b = vec3(0.352, 0.348, 0.336);   // Leistungen — neutral
  vec3 c = vec3(0.330, 0.336, 0.342);   // Arbeiten — kühl, zurückhaltend
  vec3 d = vec3(0.404, 0.372, 0.330);   // Kontakt — wieder warm
  float t = clamp(s, 0.0, 1.0) * 3.0;
  vec3 f = mix(a, b, smoothstep(0.0, 1.0, t));
  f = mix(f, c, smoothstep(1.0, 2.0, t));
  f = mix(f, d, smoothstep(2.0, 3.0, t));
  return f;
}

vec3 lichtfarbe(float s) {
  vec3 warm = vec3(1.000, 0.878, 0.639);   // Goldlicht
  vec3 kuehl = vec3(0.788, 0.851, 0.902);  // Tageslicht
  float t = clamp(s, 0.0, 1.0);
  return mix(warm, kuehl, smoothstep(0.25, 0.62, t) * (1.0 - smoothstep(0.75, 1.0, t)));
}

void main() {
  vec2 uv = gl_FragCoord.xy / uFlaeche;
  float seitig = uFlaeche.x / uFlaeche.y;
  vec2 p = (uv - 0.5) * vec2(seitig, 1.0);

  float t = uZeit;
  vec3 grund = stimmung(uScroll);
  vec3 licht = lichtfarbe(uScroll);

  /* Zwei Nebelebenen mit verschiedener Geschwindigkeit — daraus entsteht
     Parallaxe, also Tiefe. Der Scroll verschiebt sie unterschiedlich
     stark: die ferne kaum, die nahe deutlich. */
  float fern = schwaden(p * 1.15 + vec2(0.0, uScroll * 0.55), t * 0.9);
  float nah  = schwaden(p * 2.60 + vec2(1.7, uScroll * 1.60), t * 1.4);

  /* Lichtschacht: eine breite, weiche Quelle oben, die mit dem Scroll
     und minimal mit dem Zeiger wandert. Nicht als harter Kegel — es
     soll wie Licht durch Staub wirken, nicht wie eine Taschenlampe. */
  vec2 quelle = vec2(0.10 + uZeiger.x * 0.10, 0.62 - uScroll * 0.28 + uZeiger.y * 0.05);
  float abstand = length((p - quelle) * vec2(0.62, 1.0));
  float schacht = exp(-abstand * 1.85);
  schacht *= 0.55 + 0.45 * fern;

  /* Tiefe: unten schwerer, zu den Rändern dunkler. */
  float hoehe = smoothstep(-0.55, 0.62, p.y);
  float rand = 1.0 - smoothstep(0.35, 1.05, length(p * vec2(0.78, 1.0)));

  vec3 c = grund;
  c *= 0.88 + 0.18 * hoehe;
  c += grund * (fern - 0.5) * 0.30;                  // Bänke im Grundton
  c += licht * schacht * 0.085;                      // Lichtschacht
  c += licht * pow(max(nah - 0.58, 0.0), 1.7) * 0.07; // helle Schwaden
  c *= 0.84 + 0.19 * rand;                           // Vignette

  /* Filmkorn. Bewusst fein und mit der Helligkeit skaliert: In den
     Tiefen soll es körnen, in den Lichtern nicht rauschen. */
  float korn = hash(gl_FragCoord.xy + fract(t) * 137.0) - 0.5;
  c += korn * 0.016 * (0.35 + 0.65 * (1.0 - hoehe));

  farbe = vec4(c * uStaerke, 1.0);
}`;

/* Zielbildrate. Ein Hintergrund, dessen Schwaden Sekunden brauchen, um
   sich merklich zu bewegen, gewinnt bei 60 Bildern nichts — kostet aber
   doppelt. */
const ZIEL_BILDER = 24;
const ZIEL_ABSTAND = 1000 / ZIEL_BILDER;

export default function Atmosphaere() {
  const flaeche = useRef<HTMLCanvasElement>(null);
  const reduziert = useReduzierteBewegung();

  useEffect(() => {
    if (reduziert === null) return;
    const cv = flaeche.current;
    if (!cv) return;

    const gl = cv.getContext("webgl2", {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: "low-power",
      preserveDrawingBuffer: false,
    });
    if (!gl) return;

    const uebersetzen = (art: number, quelle: string) => {
      const s = gl.createShader(art)!;
      gl.shaderSource(s, quelle);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        console.error("Atmosphäre:", gl.getShaderInfoLog(s));
        return null;
      }
      return s;
    };

    const vs = uebersetzen(gl.VERTEX_SHADER, VERTEX);
    const fs = uebersetzen(gl.FRAGMENT_SHADER, FRAGMENT);
    if (!vs || !fs) return;

    const prog = gl.createProgram()!;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error("Atmosphäre:", gl.getProgramInfoLog(prog));
      return;
    }
    gl.useProgram(prog);

    /* Ein Dreieck, kein Viereck: Es deckt den Bildschirm ebenso ab, ohne
       die Naht in der Mitte, an der zwei Dreiecke doppelt gezeichnet
       werden. */
    const puffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, puffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const lage = gl.getAttribLocation(prog, "lage");
    gl.enableVertexAttribArray(lage);
    gl.vertexAttribPointer(lage, 2, gl.FLOAT, false, 0, 0);

    const uFlaeche = gl.getUniformLocation(prog, "uFlaeche");
    const uZeit = gl.getUniformLocation(prog, "uZeit");
    const uScroll = gl.getUniformLocation(prog, "uScroll");
    const uZeiger = gl.getUniformLocation(prog, "uZeiger");
    const uStaerke = gl.getUniformLocation(prog, "uStaerke");

    let skala = 0.45;              // Anteil der echten Auflösung
    let breite = 1;
    let hoehe = 1;

    /* Deckel über die Fläche, nicht nur über den Faktor.

       Ein fester Anteil bedeutet auf einem 5K-Bildschirm das
       Sechsfache der Rechenarbeit eines Laptops — bei einem
       Hintergrund, der auf beiden gleich aussieht. Über der Grenze
       sinkt der Faktor so weit, dass die Fläche eingehalten wird. */
    const HOECHSTFLAECHE = 900_000;

    const messen = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      let f = skala;
      const roh = window.innerWidth * dpr * window.innerHeight * dpr;
      if (roh * f * f > HOECHSTFLAECHE) f = Math.sqrt(HOECHSTFLAECHE / roh);
      breite = Math.max(2, Math.round(window.innerWidth * dpr * f));
      hoehe = Math.max(2, Math.round(window.innerHeight * dpr * f));
      cv.width = breite;
      cv.height = hoehe;
      gl.viewport(0, 0, breite, hoehe);
      gl.uniform2f(uFlaeche, breite, hoehe);
    };
    messen();

    /* Scroll und Zeiger werden gelesen, nicht abonniert: Ein Zustand in
       React würde bei jedem Bild den Baum durchrechnen — für zwei Zahlen,
       die ausschließlich die Grafikkarte interessieren. */
    let scrollZiel = 0;
    let scrollWert = 0;
    let zeigerZielX = 0;
    let zeigerZielY = 0;
    let zeigerX = 0;
    let zeigerY = 0;

    const beimScrollen = () => {
      const weg = document.documentElement.scrollHeight - window.innerHeight;
      scrollZiel = weg > 0 ? window.scrollY / weg : 0;
    };
    const beimZeiger = (e: PointerEvent) => {
      zeigerZielX = (e.clientX / window.innerWidth) * 2 - 1;
      zeigerZielY = 1 - (e.clientY / window.innerHeight) * 2;
    };

    beimScrollen();
    window.addEventListener("scroll", beimScrollen, { passive: true });
    window.addEventListener("resize", messen);
    window.addEventListener("pointermove", beimZeiger, { passive: true });

    const start = performance.now();
    let letzte = start;
    let raf = 0;
    let staerke = 0;

    /* Wächter: Läuft es dauerhaft zu langsam, sinkt erst die Auflösung
       und dann hört die Ebene auf. Gemessen wird der gleitende Mittelwert
       über zwei Sekunden — einzelne Ausreißer sind normal und dürfen
       nicht dazu führen, dass die Atmosphäre flackernd abschaltet. */
    let summe = 0;
    let zaehler = 0;
    let gedrosselt = false;
    let aus = false;

    const bild = (jetzt: number) => {
      raf = requestAnimationFrame(bild);
      const abstand = jetzt - letzte;
      if (abstand < ZIEL_ABSTAND) return;
      letzte = jetzt;

      if (document.hidden) return;

      summe += abstand;
      zaehler++;
      if (zaehler >= ZIEL_BILDER * 2) {
        const mittel = summe / zaehler;
        summe = 0;
        zaehler = 0;
        if (mittel > ZIEL_ABSTAND * 1.9) {
          if (!gedrosselt) {
            gedrosselt = true;
            skala = 0.38;
            messen();
          } else if (!aus) {
            aus = true;
            cancelAnimationFrame(raf);
            cv.style.opacity = "0";
            document.documentElement.classList.remove("mit-atmosphaere");
            return;
          }
        }
      }

      /* Dämpfung statt harter Übernahme — beim Scroll wie beim Zeiger.
         Ohne sie springt das Licht mit dem Rad, und genau daran erkennt
         man einen Effekt als aufgesetzt. */
      scrollWert += (scrollZiel - scrollWert) * 0.06;
      zeigerX += (zeigerZielX - zeigerX) * 0.035;
      zeigerY += (zeigerZielY - zeigerY) * 0.035;
      /* Einblendung über die Zeit, nicht über die Zahl der Bilder.

         Zuerst stand hier ein fester Zuwachs je Bild. Das koppelt die
         Dauer an die Bildrate: Auf einem schnellen Rechner war die Ebene
         nach anderthalb Sekunden da, auf einem langsamen Gerät nach
         sechs — und bis dahin stand die Seite auf fast Schwarz. Gemessen
         mit rgb(32,30,28) statt der beabsichtigten rgb(80,76,72). Genau
         die Geräte, die den Effekt am wenigsten vertragen, hätten am
         längsten im Dunkeln gestanden. */
      staerke = Math.min(1, (jetzt - start) / 900);

      gl.uniform1f(uZeit, (jetzt - start) / 1000);
      gl.uniform1f(uScroll, scrollWert);
      gl.uniform2f(uZeiger, zeigerX, zeigerY);
      gl.uniform1f(uStaerke, staerke);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    if (reduziert) {
      /* Reduzierte Bewegung heißt nicht: kein Raum. Ein einziges Bild,
         stehend — die Tiefe bleibt, die Bewegung entfällt. */
      gl.uniform1f(uZeit, 12.0);
      gl.uniform1f(uScroll, 0.12);
      gl.uniform2f(uZeiger, 0, 0);
      gl.uniform1f(uStaerke, 1);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    } else {
      raf = requestAnimationFrame(bild);
    }

    document.documentElement.classList.add("mit-atmosphaere");

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", beimScrollen);
      window.removeEventListener("resize", messen);
      window.removeEventListener("pointermove", beimZeiger);
      document.documentElement.classList.remove("mit-atmosphaere");
      gl.deleteBuffer(puffer);
      gl.deleteProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [reduziert]);

  return (
    <canvas
      ref={flaeche}
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-[3] h-full w-full"
      style={{ transition: "opacity 600ms ease" }}
    />
  );
}
