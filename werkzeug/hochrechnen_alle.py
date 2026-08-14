#!/usr/bin/env python3
"""Rechnet den gesamten zu kleinen Bildbestand hoch.

Die Faktoren stehen nicht willkuerlich da, sondern folgen der
Darstellungsgroesse mal Geraetedichte:

  Konzeptbilder  720 x 402   laufen im Portfolio ueber die volle Breite
                             und dienen als Standbild der Konzeptvideos
                             -> x4, danach auf 1920 begrenzt
  Portraet       928 x 1152  wird bei 420 px dargestellt, auf einem
                             Telefon also bei 1260 px -> x2
  Kacheln        360 x 270   werden bei 140 px dargestellt, also 420 px
                             -> x2

Mehr waere verschenkt: Ein Bild groesser auszuliefern, als es je
dargestellt wird, kostet Bytes ohne einen einzigen sichtbaren Pixel.
"""
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent))
from hochrechnen import hochrechnen, sitzung
from PIL import Image

BILDER = Path("public/images")

AUFTRAEGE = (
    [(BILDER / f"concept-{n}.webp", 4, 1920) for n in ("nordwerk", "atelier", "verde")]
    + [(BILDER / "portrait.webp", 2, 1500)]
    + [(BILDER / f"tiles/{m}-{i}.webp", 2, None)
       for m in ("nordwerk", "atelier", "verde") for i in range(1, 7)]
)

sitze = {}
for pfad, faktor, breite in AUFTRAEGE:
    if not pfad.exists():
        print("fehlt:", pfad, flush=True); continue
    ziel = pfad.with_name(pfad.stem + "-gross.png")
    if ziel.exists():
        print("schon da:", ziel.name, flush=True); continue
    if faktor not in sitze:
        sitze[faktor] = sitzung(faktor)
    bild = Image.open(pfad)
    print(f"{pfad.name}: {bild.width}x{bild.height} x{faktor}", flush=True)
    gross = hochrechnen(bild, faktor, sitze[faktor])
    if breite and gross.width > breite:
        gross = gross.resize((breite, round(gross.height * breite / gross.width)), Image.LANCZOS)
    gross.save(ziel)
    print(f"   -> {ziel.name} {gross.width}x{gross.height}", flush=True)
print("FERTIG", flush=True)
