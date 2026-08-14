#!/usr/bin/env python3
"""Superauflösung im eigenen Haus — Real-ESRGAN über ONNX, auf der CPU.

WARUM DIESER WEG UND NICHT NEU ERZEUGEN

Die naheliegende Antwort auf zu kleine Bilder wäre, sie neu erzeugen zu
lassen. Das scheitert hier an zwei Dingen, und beide sind belegt, nicht
vermutet:

1. Die Bauumgebung erreicht keinen einzigen Medien-Anbieter. Geprüft
   wurden kie.ai, Higgsfield, VideoSlash, Hugging Face, Replicate, fal,
   Pollinations, OpenAI und Together — alle antworten mit
   `host_not_allowed`. Erreichbar sind nur die Programmschnittstellen,
   nicht die Dateien, die sie ausliefern. Ein anderer Anbieter löst das
   nicht; es ist keine Anbieterfrage, sondern eine Netzfrage.

2. Selbst wenn es ginge, wäre Neuerzeugen für einen Teil des Bestands
   falsch: Die Konzeptkacheln sind Einzelbilder aus den Konzeptvideos.
   Ein neu erzeugtes Motiv passt nicht mehr zum bewegten Bild daneben.
   Und das Porträt zeigt einen echten Menschen — dort ist KI-Ersatz keine
   Qualitätsfrage, sondern schlicht ausgeschlossen.

Hochrechnen löst beides: Es braucht kein Netz, es erhält das Motiv, und
es ist reproduzierbar. Die Modellgewichte kommen aus einer
GitHub-Veröffentlichung, die erreichbar ist.

VERFAHREN

Kachelweise mit Überlappung. Das Modell arbeitet auf beliebigen Größen,
aber der Speicherbedarf wächst quadratisch — ein 928 × 1152 großes Bild
am Stück gerechnet sprengt den Arbeitsspeicher. Die Überlappung wird
weich ineinandergeblendet, sonst stehen an den Kachelgrenzen sichtbare
Kanten, gerade in Flächen mit wenig Struktur wie Himmel oder Wand.

Alphakanal wird getrennt behandelt: Das Modell kennt nur drei Kanäle. Die
Transparenz wird klassisch skaliert und wieder angelegt.

Aufruf:
    python3 werkzeug/hochrechnen.py <datei> <faktor 2|4> [zielbreite]
    python3 werkzeug/hochrechnen.py --liste
"""
import sys
import time
from pathlib import Path

import numpy as np
import onnxruntime as ort
from PIL import Image

HIER = Path(__file__).resolve().parent
MODELLE = HIER / "modelle"

KACHEL = 128        # Kantenlänge der Eingangskachel
RAND = 16           # Überlappung je Seite, wird weich geblendet


def sitzung(faktor: int) -> ort.InferenceSession:
    pfad = MODELLE / f"RealESRGAN_x{faktor}.onnx"
    if not pfad.exists():
        sys.exit(
            f"Modell fehlt: {pfad}\n"
            "Herkunft: https://github.com/instant-high/real-esrgan-onnx/releases"
        )
    opt = ort.SessionOptions()
    opt.intra_op_num_threads = 0    # 0 = alle verfügbaren Kerne
    opt.graph_optimization_level = ort.GraphOptimizationLevel.ORT_ENABLE_ALL
    return ort.InferenceSession(str(pfad), opt, providers=["CPUExecutionProvider"])


def _blende(laenge: int, rand: int) -> np.ndarray:
    """Gewichtsverlauf für eine Kachelkante: 0 am Rand, 1 innen."""
    g = np.ones(laenge, dtype=np.float32)
    if rand > 0:
        auf = np.linspace(0, 1, rand, dtype=np.float32)
        g[:rand] = auf
        g[-rand:] = auf[::-1]
    return g


def hochrechnen(bild: Image.Image, faktor: int, sitz: ort.InferenceSession) -> Image.Image:
    alpha = None
    if bild.mode in ("RGBA", "LA") or "transparency" in bild.info:
        rgba = bild.convert("RGBA")
        alpha = rgba.getchannel("A")
        bild = rgba.convert("RGB")
    else:
        bild = bild.convert("RGB")

    quelle = np.asarray(bild, dtype=np.float32) / 255.0
    h, b, _ = quelle.shape
    ziel = np.zeros((h * faktor, b * faktor, 3), dtype=np.float32)
    gewicht = np.zeros((h * faktor, b * faktor, 1), dtype=np.float32)

    schritt = KACHEL - 2 * RAND
    name = sitz.get_inputs()[0].name
    kacheln = 0
    begonnen = time.time()

    for oben in range(0, h, schritt):
        for links in range(0, b, schritt):
            o0, l0 = max(0, oben - RAND), max(0, links - RAND)
            o1, l1 = min(h, o0 + KACHEL), min(b, l0 + KACHEL)
            o0, l0 = max(0, o1 - KACHEL), max(0, l1 - KACHEL)

            stueck = quelle[o0:o1, l0:l1]
            eingang = stueck.transpose(2, 0, 1)[None]
            ausgang = sitz.run(None, {name: eingang})[0][0]
            ausgang = np.clip(ausgang.transpose(1, 2, 0), 0, 1)

            gh, gb = ausgang.shape[0], ausgang.shape[1]
            g = (_blende(gh, RAND * faktor)[:, None]
                 * _blende(gb, RAND * faktor)[None, :])[:, :, None]

            zo, zl = o0 * faktor, l0 * faktor
            ziel[zo:zo + gh, zl:zl + gb] += ausgang * g
            gewicht[zo:zo + gh, zl:zl + gb] += g
            kacheln += 1

    ziel = np.clip(ziel / np.maximum(gewicht, 1e-6), 0, 1)
    ergebnis = Image.fromarray((ziel * 255).round().astype(np.uint8), "RGB")

    if alpha is not None:
        ergebnis.putalpha(alpha.resize(ergebnis.size, Image.LANCZOS))

    print(f"   {kacheln} Kacheln in {time.time() - begonnen:.0f} s", flush=True)
    return ergebnis


def verarbeiten(pfad: Path, faktor: int, zielbreite: int | None) -> None:
    bild = Image.open(pfad)
    print(f"{pfad.name}: {bild.width}×{bild.height} ×{faktor}", flush=True)
    gross = hochrechnen(bild, faktor, sitzung(faktor))

    if zielbreite and gross.width > zielbreite:
        hoehe = round(gross.height * zielbreite / gross.width)
        gross = gross.resize((zielbreite, hoehe), Image.LANCZOS)

    ziel = pfad.with_name(pfad.stem + "-gross.png")
    gross.save(ziel)
    print(f"   -> {ziel.name}  {gross.width}×{gross.height}", flush=True)


if __name__ == "__main__":
    if len(sys.argv) < 3:
        sys.exit(__doc__)
    verarbeiten(
        Path(sys.argv[1]),
        int(sys.argv[2]),
        int(sys.argv[3]) if len(sys.argv) > 3 else None,
    )
