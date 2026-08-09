"use client";

import { useEffect, useRef, useState } from "react";
import { useReduzierteBewegung } from "@/lib/bewegung";

/* Die Werkstatt: eine Kamerafahrt durch drei Entwürfe im Raum.

   Der Unterschied zur vorherigen Fassung ist nicht kosmetisch. Vorher lag
   ein Bild flach auf der Fläche und wurde durch ein zweites ersetzt. Jetzt
   stehen drei Tafeln versetzt hintereinander, die Kamera fährt daran
   vorbei — mit Perspektive, Tiefenstaffelung und Verdeckung. Erst das ist
   räumliche Darstellung.

   Warum weiterhin ohne Bibliothek: Diese Seite ist die Arbeitsprobe einer
   Webdesignerin. Three.js kostet rund 155 KB und nimmt einem die
   Entscheidungen ab. Der ganze Raum hier — Projektion, Kamera, Tiefentest,
   Nebel — ist eigener Code im niedrigen zweistelligen Kilobyte-Bereich.
   Das ist der Unterschied zwischen eine Bibliothek bedienen und verstehen,
   was sie tut.

   Grenzen: Geladen wird erst bei Annäherung. Ohne WebGL2 oder bei
   reduzierter Bewegung erscheint nichts — die Entwurfskarten darunter
   tragen den Abschnitt dann allein. */

const VERTEX = `#version 300 es
in vec3 lage;
in vec2 texLage;

uniform mat4 projektion;
uniform mat4 sicht;
uniform mat4 modell;

out vec2 uv;
out float tiefe;

void main() {
  vec4 imRaum = sicht * modell * vec4(lage, 1.0);
  uv = texLage;
  tiefe = -imRaum.z;
  gl_Position = projektion * imRaum;
}`;

const FRAGMENT = `#version 300 es
precision highp float;

in vec2 uv;
in float tiefe;
out vec4 farbe;

uniform sampler2D bild;
uniform float zeit;
uniform vec3 grundton;

void main() {
  vec3 c = texture(bild, uv).rgb;

  /* Goldene Kante: Die Tafel bleibt als Objekt im Raum lesbar und wirkt
     nicht wie ein Loch in der Fläche. */
  vec2 rand = min(uv, 1.0 - uv);
  float d = min(rand.x, rand.y);
  float kante = 1.0 - smoothstep(0.0, 0.014, d);
  vec3 gold = vec3(0.949, 0.847, 0.580);
  c = mix(c, gold, kante * 0.9);

  /* Wandernder Lichtstreif — als läge Glas davor */
  float streif = smoothstep(0.4, 0.55, sin(uv.x * 2.2 - uv.y * 1.1 + zeit * 0.25));
  c += gold * streif * 0.05;

  /* Nebel: Entferntes tritt in den Grundton zurück. Das ist der
     wirksamste Tiefenhinweis — stärker als Perspektive allein. */
  float nebel = smoothstep(2.4, 10.0, tiefe);
  c = mix(c, grundton, nebel);

  float korn = (fract(sin(dot(uv * 1024.0, vec2(12.9898, 78.233))) * 43758.5) - 0.5) * 0.018;
  farbe = vec4(c + korn, 1.0);
}`;

/* ---------- Matrizen ----------
   Drei Funktionen genügen. Spaltenweise gespeichert, wie WebGL erwartet. */
function projektionBauen(sichtwinkel: number, seite: number, nah: number, fern: number) {
  const f = 1 / Math.tan(sichtwinkel / 2);
  const nf = 1 / (nah - fern);
  return new Float32Array([
    f / seite, 0, 0, 0,
    0, f, 0, 0,
    0, 0, (fern + nah) * nf, -1,
    0, 0, 2 * fern * nah * nf, 0,
  ]);
}

function sichtBauen(x: number, y: number, z: number, schwenk: number) {
  const c = Math.cos(schwenk);
  const s = Math.sin(schwenk);
  return new Float32Array([
    c, 0, -s, 0,
    0, 1, 0, 0,
    s, 0, c, 0,
    -(c * x + s * z), -y, -(-s * x + c * z), 1,
  ]);
}

function modellBauen(
  x: number, y: number, z: number,
  breite: number, hoehe: number,
  drehung: number
) {
  const c = Math.cos(drehung);
  const s = Math.sin(drehung);
  return new Float32Array([
    c * breite, 0, -s * breite, 0,
    0, hoehe, 0, 0,
    s, 0, c, 0,
    x, y, z, 1,
  ]);
}

type Tafel = { x: number; y: number; z: number; drehung: number };

/* Versetzt statt hintereinander: abwechselnd links und rechts, jede tiefer
   und zur Kamera gedreht. Eine Reihe genau hintereinander sähe aus wie ein
   Stapel, nicht wie ein Raum. */
const TAFELN: Tafel[] = [
  { x: -0.5, y: 0.05, z: -2.4, drehung: 0.34 },
  { x: 0.58, y: -0.04, z: -5.1, drehung: -0.3 },
  { x: -0.44, y: 0.06, z: -7.9, drehung: 0.28 },
];

export default function WerkstattGL({
  bilder,
  beschriftungen,
}: {
  bilder: string[];
  beschriftungen: string[];
}) {
  const huelle = useRef<HTMLDivElement>(null);
  const flaeche = useRef<HTMLCanvasElement>(null);
  const [laeuft, setLaeuft] = useState(false);
  const [schritt, setSchritt] = useState(0);
  const reduziert = useReduzierteBewegung();

  useEffect(() => {
    if (reduziert !== false) return;
    const el = huelle.current;
    const cv = flaeche.current;
    if (!el || !cv) return;

    let aufraeumen: (() => void) | undefined;
    const naehe = new IntersectionObserver(
      (eintraege) => {
        if (!eintraege.some((e) => e.isIntersecting)) return;
        naehe.disconnect();
        aufraeumen = starten(el, cv, bilder, setLaeuft, setSchritt);
      },
      { rootMargin: "500px 0px" }
    );
    naehe.observe(el);

    return () => {
      naehe.disconnect();
      aufraeumen?.();
    };
  }, [reduziert, bilder]);

  return (
    <div ref={huelle} className="relative">
      <div className="relative overflow-hidden rounded-sm border border-line">
        <canvas
          ref={flaeche}
          aria-hidden
          className="block h-[54vh] min-h-[300px] w-full lg:h-[66vh]"
          style={{ opacity: laeuft ? 1 : 0, transition: "opacity 800ms ease" }}
        />
        {!laeuft && (
          <div className="absolute inset-0 bg-[linear-gradient(150deg,#2b2723,#15120f)]" />
        )}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(16,14,12,0.8),transparent_42%)]"
        />
        <div className="pointer-events-none absolute bottom-5 left-6 right-6 flex items-end justify-between gap-4">
          <p className="text-[0.72rem] tracking-[0.22em] uppercase text-gold-text">
            {beschriftungen[schritt] ?? beschriftungen[0]}
          </p>
          <p className="hidden sm:block text-[0.62rem] tracking-[0.18em] uppercase text-silver/60">
            Kamerafahrt — scrollen
          </p>
        </div>
      </div>
    </div>
  );
}

function starten(
  huelle: HTMLElement,
  cv: HTMLCanvasElement,
  BILDER: string[],
  setLaeuft: (b: boolean) => void,
  setSchritt: (n: number) => void
): (() => void) | undefined {
  const gl = cv.getContext("webgl2", {
    antialias: true,
    alpha: false,
    powerPreference: "low-power",
  });
  if (!gl) return undefined;

  const bauen = (typ: number, quelle: string) => {
    const s = gl.createShader(typ)!;
    gl.shaderSource(s, quelle);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      console.warn("Shader:", gl.getShaderInfoLog(s));
      return null;
    }
    return s;
  };
  const v = bauen(gl.VERTEX_SHADER, VERTEX);
  const f = bauen(gl.FRAGMENT_SHADER, FRAGMENT);
  if (!v || !f) return undefined;
  const programm = gl.createProgram()!;
  gl.attachShader(programm, v);
  gl.attachShader(programm, f);
  gl.linkProgram(programm);
  if (!gl.getProgramParameter(programm, gl.LINK_STATUS)) {
    console.warn("Programm:", gl.getProgramInfoLog(programm));
    return undefined;
  }
  gl.useProgram(programm);

  const daten = new Float32Array([
    -1, -1, 0, 0, 0,
     1, -1, 0, 1, 0,
    -1,  1, 0, 0, 1,
     1, -1, 0, 1, 0,
     1,  1, 0, 1, 1,
    -1,  1, 0, 0, 1,
  ]);
  const puffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, puffer);
  gl.bufferData(gl.ARRAY_BUFFER, daten, gl.STATIC_DRAW);

  const aLage = gl.getAttribLocation(programm, "lage");
  const aTex = gl.getAttribLocation(programm, "texLage");
  gl.enableVertexAttribArray(aLage);
  gl.vertexAttribPointer(aLage, 3, gl.FLOAT, false, 20, 0);
  gl.enableVertexAttribArray(aTex);
  gl.vertexAttribPointer(aTex, 2, gl.FLOAT, false, 20, 12);

  const ort = {
    projektion: gl.getUniformLocation(programm, "projektion"),
    sicht: gl.getUniformLocation(programm, "sicht"),
    modell: gl.getUniformLocation(programm, "modell"),
    bild: gl.getUniformLocation(programm, "bild"),
    zeit: gl.getUniformLocation(programm, "zeit"),
    grundton: gl.getUniformLocation(programm, "grundton"),
  };

  gl.enable(gl.DEPTH_TEST);
  gl.clearColor(0.082, 0.071, 0.059, 1);

  const texturen: WebGLTexture[] = [];
  let geladen = 0;
  BILDER.forEach((quelle, i) => {
    const t = gl.createTexture()!;
    texturen[i] = t;
    gl.bindTexture(gl.TEXTURE_2D, t);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
      new Uint8Array([43, 39, 35, 255]));
    const bild = new Image();
    bild.onload = () => {
      gl.bindTexture(gl.TEXTURE_2D, t);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, bild);
      gl.generateMipmap(gl.TEXTURE_2D);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      geladen++;
      if (geladen === BILDER.length) setLaeuft(true);
    };
    bild.src = quelle;
  });

  const schmal = cv.clientWidth < 768;
  const dpr = Math.min(window.devicePixelRatio || 1, schmal ? 1 : 1.6);
  let seite = 16 / 9;
  const messen = () => {
    const b = Math.max(1, Math.round(cv.clientWidth * dpr));
    const h = Math.max(1, Math.round(cv.clientHeight * dpr));
    if (cv.width !== b || cv.height !== h) {
      cv.width = b;
      cv.height = h;
      gl.viewport(0, 0, b, h);
    }
    seite = b / h;
  };
  const beobachter = new ResizeObserver(messen);
  beobachter.observe(cv);
  messen();

  const zeiger = { x: 0, y: 0, zx: 0, zy: 0 };
  const aufZeiger = (e: PointerEvent) => {
    const r = cv.getBoundingClientRect();
    zeiger.zx = ((e.clientX - r.left) / r.width - 0.5) * 2;
    zeiger.zy = ((e.clientY - r.top) / r.height - 0.5) * 2;
  };
  const zeigerRaus = () => {
    zeiger.zx = 0;
    zeiger.zy = 0;
  };
  cv.addEventListener("pointermove", aufZeiger, { passive: true });
  cv.addEventListener("pointerleave", zeigerRaus, { passive: true });

  let raf = 0;
  let sichtbar = true;
  const sicht = new IntersectionObserver(
    (e) => {
      sichtbar = e.some((x) => x.isIntersecting);
      if (sichtbar && !raf) raf = requestAnimationFrame(zeichnen);
    },
    { threshold: 0 }
  );
  sicht.observe(cv);

  let letzter = -1;
  let kameraZ = 0.6;

  function zeichnen(t: number) {
    raf = sichtbar ? requestAnimationFrame(zeichnen) : 0;
    if (!gl || geladen < BILDER.length) return;

    const r = huelle.getBoundingClientRect();
    const gesamt = r.height + window.innerHeight;
    const p = Math.min(1, Math.max(0, (window.innerHeight - r.top) / gesamt));

    /* Die Kamera fährt von vor der ersten bis hinter die letzte Tafel.
       Nachgeführt statt gesetzt — sonst ruckelt die Fahrt im Takt der
       Scroll-Ereignisse statt zu gleiten. */
    const ziel = 0.6 - p * 9.4;
    kameraZ += (ziel - kameraZ) * 0.09;

    zeiger.x += (zeiger.zx - zeiger.x) * 0.06;
    zeiger.y += (zeiger.zy - zeiger.y) * 0.06;

    const projektion = projektionBauen((52 * Math.PI) / 180, seite, 0.1, 26);
    const sichtM = sichtBauen(zeiger.x * 0.22, -zeiger.y * 0.12, kameraZ, zeiger.x * 0.05);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.uniformMatrix4fv(ort.projektion, false, projektion);
    gl.uniformMatrix4fv(ort.sicht, false, sichtM);
    gl.uniform1f(ort.zeit, t * 0.001);
    gl.uniform3f(ort.grundton, 0.082, 0.071, 0.059);

    let naechste = 0;
    let kleinster = Infinity;
    for (let i = TAFELN.length - 1; i >= 0; i--) {
      const tf = TAFELN[i];
      const abstand = Math.abs(tf.z - kameraZ);
      if (abstand < kleinster) {
        kleinster = abstand;
        naechste = i;
      }
      gl.uniformMatrix4fv(ort.modell, false,
        modellBauen(tf.x, tf.y, tf.z, 0.92, 0.52, tf.drehung));
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, texturen[i]);
      gl.uniform1i(ort.bild, 0);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    }

    if (naechste !== letzter) {
      letzter = naechste;
      setSchritt(naechste);
    }
  }
  raf = requestAnimationFrame(zeichnen);

  return () => {
    if (raf) cancelAnimationFrame(raf);
    beobachter.disconnect();
    sicht.disconnect();
    cv.removeEventListener("pointermove", aufZeiger);
    cv.removeEventListener("pointerleave", zeigerRaus);
    texturen.forEach((t) => gl.deleteTexture(t));
    gl.deleteBuffer(puffer);
    gl.deleteProgram(programm);
  };
}
