"use client";

import { useEffect, useRef, useState } from "react";

/* Eröffnungsszene: Der Blick beginnt am Schreibtisch und fährt in den
   Monitor hinein, bis die Seite das Fenster ausfüllt.

   Der Unterschied zur bisherigen Fassung: Im Bildschirm liegt kein
   eingebackenes Bildschirmfoto, sondern die echte, lebende Seite. Sie wird
   perspektivisch in die schräge Bildschirmfläche eingepasst und richtet
   sich beim Heranfahren auf. Dadurch bleibt sie in jeder Zoomstufe scharf
   — ein Foto würde beim Vergrößern zerfallen. */

const BILD = "/images/szene-arbeitsplatz.webp";

/* Ecken der Anzeigefläche in Prozent des Bildes.

   Nicht abgelesen, sondern ausgemessen: Die Fläche wurde geradegezogen,
   bis die Navigationsleiste waagerecht stand (von 1,50 auf 0,00 Grad),
   dann die tatsächlichen Ränder der Anzeige bestimmt und zurückgerechnet.
   Ein abgelesener Rahmen enthielt noch Gehäuse und Haare. */
const SCHIRM = [
  [49.263, 5.4],
  [93.727, 5.342],
  [94.532, 61.511],
  [49.575, 63.159],
] as const;

const BILD_VERHAELTNIS = 1599 / 892;
const FAHRT_ENDE = 0.86;

/* Rechnet die Abbildung eines Rechtecks auf vier beliebige Punkte aus.
   Ergebnis ist eine 3×3-Matrix, die CSS als matrix3d entgegennimmt. */
function homographie(
  b: number,
  h: number,
  z: number[][]
): number[] | null {
  const q = [
    [0, 0],
    [b, 0],
    [b, h],
    [0, h],
  ];
  const A: number[][] = [];
  const rhs: number[] = [];
  for (let i = 0; i < 4; i++) {
    const [x, y] = q[i];
    const [u, v] = z[i];
    A.push([x, y, 1, 0, 0, 0, -u * x, -u * y]);
    rhs.push(u);
    A.push([0, 0, 0, x, y, 1, -v * x, -v * y]);
    rhs.push(v);
  }
  /* Gauß-Verfahren mit Spaltenpivotisierung — ohne Pivotisierung
     scheitert die Rechnung, sobald ein Hauptelement null wird. */
  const m = A.map((r, i) => [...r, rhs[i]]);
  for (let c = 0; c < 8; c++) {
    let best = c;
    for (let r = c + 1; r < 8; r++)
      if (Math.abs(m[r][c]) > Math.abs(m[best][c])) best = r;
    if (Math.abs(m[best][c]) < 1e-9) return null;
    [m[c], m[best]] = [m[best], m[c]];
    for (let r = 0; r < 8; r++) {
      if (r === c) continue;
      const f = m[r][c] / m[c][c];
      for (let k = c; k <= 8; k++) m[r][k] -= f * m[c][k];
    }
  }
  const s = m.map((r, i) => r[8] / m[i][i]);
  return [s[0], s[1], s[2], s[3], s[4], s[5], s[6], s[7], 1];
}

export default function MonitorStage({
  progress,
  onMissing,
}: {
  progress: number;
  onMissing: () => void;
}) {
  const bildRef = useRef<HTMLImageElement>(null);
  const rahmenRef = useRef<HTMLIFrameElement>(null);
  const buehneRef = useRef<HTMLDivElement>(null);
  const glasRef = useRef<HTMLSpanElement>(null);
  const dunkelRef = useRef<HTMLSpanElement>(null);
  const glattRef = useRef(0);
  const zielRef = useRef(0);
  const rafRef = useRef(0);
  const [bereit, setBereit] = useState(false);

  zielRef.current = progress;

  useEffect(() => {
    const img = bildRef.current;
    if (!img) return;
    const fertig = () => setBereit(true);
    if (img.complete && img.naturalWidth > 0) fertig();
    else {
      img.addEventListener("load", fertig, { once: true });
      img.addEventListener("error", () => onMissing(), { once: true });
    }
  }, [onMissing]);

  useEffect(() => {
    if (!bereit) return;

    const zeichne = () => {
      rafRef.current = requestAnimationFrame(zeichne);
      const buehne = buehneRef.current;
      const img = bildRef.current;
      const rahmen = rahmenRef.current;
      if (!buehne || !img || !rahmen) return;

      /* Scrollglättung: die Kamera zieht sanft nach */
      glattRef.current += (zielRef.current - glattRef.current) * 0.11;
      const p = glattRef.current;

      const W = buehne.clientWidth;
      const H = buehne.clientHeight;
      if (!W || !H) return;

      /* Das Bild deckt die Fläche vollständig ab */
      const bw = Math.max(W, H * BILD_VERHAELTNIS);
      const bh = bw / BILD_VERHAELTNIS;

      /* Ecken der Bildschirmfläche in Bildkoordinaten */
      const roh = SCHIRM.map(([x, y]) => [(x / 100) * bw, (y / 100) * bh]);
      const mx = roh.reduce((a, c) => a + c[0], 0) / 4;
      const my = roh.reduce((a, c) => a + c[1], 0) / 4;

      /* Kamerafahrt in zwei Zügen — wie zuvor beim Laptop:
         zuerst seitlich am Schreibtisch entlang zum Monitor,
         dann hinein, bis die Bildschirmfläche das Fenster füllt.
         Ein Standbild lässt das zu, weil sich Blickpunkt und Maßstab
         getrennt führen lassen. */
      const t = Math.min(1, p / FAHRT_ENDE);
      const e = t < 0.5 ? 4 * t ** 3 : 1 - Math.pow(-2 * t + 2, 3) / 2;

      const breiteSchirm = Math.hypot(roh[1][0] - roh[0][0], roh[1][1] - roh[0][1]);
      /* Auf schmalen, hochformatigen Bildschirmen deckt das querformatige
         Bild die Fläche nur mit starkem Maßstab ab — dann bliebe vom Raum
         nur ein Ausschnitt übrig und der Monitor läge außerhalb. Dort
         beginnt die Fahrt deshalb weiter weg und näher am Bildschirm. */
      const hochkant = H / W > 1.2;
      const zoomStart = hochkant ? 1.0 : 1.06;
      /* Die Fahrt endet, wenn die Bildschirmfläche die volle Fensterbreite
         einnimmt. Weiter hineinzugehen schnitt auf schmalen Geräten die
         Schrift ab. Die Leere darunter entsteht nicht, weil der echte
         Seitenanfang genau an diesem Punkt übernimmt. */
      const zoomEnde = W / breiteSchirm;
      const zoom = zoomStart + e * (zoomEnde - zoomStart);

      /* Blickpunkt wandert von der Lampe und ihrem Gesicht zum Bildschirm */
      const startX = bw * (hochkant ? 0.52 : 0.26);
      const startY = bh * (hochkant ? 0.42 : 0.46);
      const bx = startX + (mx - startX) * e;
      const by = startY + (my - startY) * e;

      let ox = W / 2 - bx * zoom;
      let oy = H / 2 - by * zoom;

      /* Der Ausschnitt darf nie über den Bildrand hinauslaufen — sonst
         entstehen schwarze Balken. Am Ende der Fahrt ist das Bild größer
         als das Fenster, dort greift die Begrenzung von selbst. */
      const zw = bw * zoom;
      const zh = bh * zoom;
      ox = zw >= W ? Math.min(0, Math.max(W - zw, ox)) : (W - zw) / 2;
      oy = zh >= H ? Math.min(0, Math.max(H - zh, oy)) : (H - zh) / 2;
      img.style.width = `${bw}px`;
      img.style.height = `${bh}px`;
      img.style.transform = `translate(${ox}px, ${oy}px) scale(${zoom})`;
      img.style.transformOrigin = "0 0";

      const dunkel = dunkelRef.current;
      if (dunkel) dunkel.style.opacity = String(Math.min(0.9, e * 1.15));

      /* Zielpunkte der Seite: genau die vier Ecken der Bildschirmfläche */
      const inFenster = roh.map(([x, y]) => [ox + x * zoom, oy + y * zoom]);
      /* Der Rahmen übernimmt das Seitenverhältnis der Bildschirmfläche.
         Nur so sitzt die Seite passgenau im Monitor. Beim Aufrichten wird
         dieses Verhältnis beibehalten und der Ausschnitt beschnitten —
         Strecken würde die Schrift verziehen. */
      const schirmB = Math.hypot(roh[1][0] - roh[0][0], roh[1][1] - roh[0][1]);
      const schirmH = Math.hypot(roh[3][0] - roh[0][0], roh[3][1] - roh[0][1]);
      const verhaeltnis = schirmB / schirmH;

      /* Der Monitor zeigt eine Rechner-Ansicht, keine Handy-Ansicht —
         alles andere sähe im Gehäuse falsch aus. Deshalb feste Breite.

         Und kein Aufrichten mehr: Die Seite bleibt exakt in der
         Bildschirmfläche, bis der echte Seitenanfang übernimmt. Die
         frühere Rechnung streckte sie auf schmalen Geräten auf das
         Dreifache — daher das riesige Logo. */
      const RAHMEN_BREITE = 1280;
      const hoehe = Math.round(RAHMEN_BREITE / verhaeltnis);
      const ziel = inFenster;

      const m = homographie(RAHMEN_BREITE, hoehe, ziel);
      if (m) {
        rahmen.style.width = `${RAHMEN_BREITE}px`;
        rahmen.style.height = `${hoehe}px`;
        rahmen.style.transformOrigin = "0 0";
        rahmen.style.transform = `matrix3d(${m[0]},${m[3]},0,${m[6]},${m[1]},${m[4]},0,${m[7]},0,0,1,0,${m[2]},${m[5]},0,1)`;
        rahmen.style.opacity = "1";

        /* Sobald die echte Kopfzeile erscheint, wird die im Rahmen
           abgeschaltet — sonst stünden beide übereinander. Der Rahmen
           liegt auf derselben Herkunft, deshalb ist das direkt möglich. */
        try {
          const dok = rahmen.contentDocument;
          if (dok) {
            const aus = zielRef.current > 0.84;
            let regel = dok.getElementById("kopf-aus");
            if (aus && !regel) {
              regel = dok.createElement("style");
              regel.id = "kopf-aus";
              regel.textContent = "header{opacity:0 !important}";
              dok.head.appendChild(regel);
            } else if (!aus && regel) {
              regel.remove();
            }
          }
        } catch {
          /* Fremde Herkunft — dann bleibt es beim bisherigen Verhalten. */
        }
        rahmen.style.filter = `brightness(${(0.9 + e * 0.1).toFixed(3)}) saturate(${(0.94 + e * 0.06).toFixed(3)})`;

        const glas = glasRef.current;
        if (glas) {
          glas.style.width = `${RAHMEN_BREITE}px`;
          glas.style.height = `${hoehe}px`;
          glas.style.transformOrigin = "0 0";
          glas.style.transform = rahmen.style.transform;
          glas.style.opacity = String(Math.max(0, 1 - e * 1.6));
          glas.style.background =
            "linear-gradient(114deg, rgba(255,246,225,0.16) 0%, rgba(255,246,225,0.05) 22%, transparent 46%)";
          glas.style.boxShadow = "inset 0 0 90px rgba(60,40,15,0.5)";
        }
      }
    };

    rafRef.current = requestAnimationFrame(zeichne);
    return () => cancelAnimationFrame(rafRef.current);
  }, [bereit]);

    /* Die Bühne ist verschwunden, bevor die Seite übernimmt. Überlappen
     beide, steht die Kopfzeile für einen Moment doppelt da — einmal im
     Bildschirm, einmal auf der Seite. */
  /* Übergabe folgt der Fahrt, nicht einer festen Marke: Sonst stand die
     Szene nach dem Ende der Bewegung noch mehrere Scrollmeter still. */
  const tU = Math.min(1, progress / FAHRT_ENDE);
  const eU = tU < 0.5 ? 4 * tU ** 3 : 1 - Math.pow(-2 * tU + 2, 3) / 2;
  const uebergabe = Math.max(0, Math.min(1, (eU - 0.9) / 0.1));

  return (
    <div
      ref={buehneRef}
      className="absolute inset-0 overflow-hidden bg-black"
      style={{
        opacity: 1 - uebergabe,
        pointerEvents: uebergabe > 0.5 ? "none" : "auto",
        visibility: uebergabe >= 1 ? "hidden" : "visible",
      }}
    >
      {/* Bewusst ohne picture/srcset: In der Einzeldatei-Vorschau werden
          Bilder als Daten-URI eingebettet, und die enthalten ein Komma.
          srcset ist aber eine kommagetrennte Liste — die Zuordnung
          zerbricht daran, und auf manchen Browsern bleibt die Fläche leer.
          Die kleinere Fassung wird deshalb per Kennzeichen mitgegeben und
          nach dem Start gewählt. */}
      <img
        ref={bildRef}
        data-szene-bild
        src={BILD}
        alt=""
        aria-hidden
        decoding="async"
        className="absolute top-0 left-0 max-w-none will-change-transform"
      />

      {/* Der Raum tritt beim Heranfahren zurück: Sonst bliebe am Rand ein
          angeschnittener Bildausschnitt stehen, während der Bildschirm
          schon fast das Fenster füllt. So wandert die Aufmerksamkeit
          dorthin, wo sie hin soll. */}
      <span
        ref={dunkelRef}
        aria-hidden
        className="absolute inset-0 pointer-events-none bg-[#100e0c]"
        style={{ opacity: 0 }}
      />


      {/* Die echte Seite, perspektivisch in die Bildschirmfläche gelegt */}
      <iframe
        ref={rahmenRef}
        src="/?screen=1"
        title="Die Website auf dem Bildschirm"
        tabIndex={-1}
        scrolling="no"
        className="absolute top-0 left-0 border-0 pointer-events-none opacity-0"
        style={{ willChange: "transform" }}
      />

      {/* Glasspiegelung und warmer Ton legen sich über die Seite, solange
          sie im Monitor sitzt — ohne das wirkt sie aufgeklebt statt
          angezeigt. Beim Heranfahren verschwindet beides. */}
      <span
        ref={glasRef}
        aria-hidden
        className="absolute top-0 left-0 pointer-events-none"
        style={{ opacity: 0 }}
      />

      {!bereit && (
        <span
          aria-hidden
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[0.62rem] tracking-[0.24em] uppercase text-silver/70"
        >
          Lädt …
        </span>
      )}
    </div>
  );
}
