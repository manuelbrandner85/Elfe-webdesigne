#!/usr/bin/env bash
# Baut aus einem erzeugten Clip eine nahtlose Schleife.
#
# WARUM NUR DER ANFANG
#
# Veo liefert acht Sekunden. Bei diesem Clip sind die ersten gut zwei
# davon genau das, was gebraucht wurde: einzelne Goldkoerner, die durch
# einen Lichtstrahl treiben. Danach wird daraus eine Rauchwolke - schoen,
# aber es liest sich als Nebel, nicht als Staub, und es zieht Blicke vom
# Text weg. Also wird geschnitten statt neu erzeugt: kostet nichts und
# nimmt genau den Teil, der stimmt.
#
# WARUM PALINDROM
#
# Ein Clip, der am Ende zum Anfang zurueckspringt, hat immer einen
# sichtbaren Sprung. Vorwaerts und rueckwaerts hintereinander gehaengt
# laeuft dagegen endlos ohne Kante - bei treibendem Staub faellt die
# Umkehr nicht auf, weil es keine gerichtete Bewegung gibt.
#
# Aufruf: bash werkzeug/schleife.sh <eingabe.mp4> <name> <sekunden>
set -e
EIN="$1"; NAME="${2:-schleife}"; DAUER="${3:-2.4}"; SCHNITT="${4:-crop=1280:560:0:80}"
ZIEL="public/videos"
mkdir -p "$ZIEL"

# Schwarze Balken weg (der Clip kommt im Breitwandformat in einem
# 16:9-Rahmen), auf 1280 begrenzen, 24 Bilder je Sekunde.
FILTER="$SCHNITT,scale=1280:-2,fps=24"

ffmpeg -v error -y -t "$DAUER" -i "$EIN" \
  -filter_complex "[0:v]$FILTER,split[a][b];[b]reverse[r];[a][r]concat=n=2:v=1:a=0" \
  -an -c:v libx264 -crf 32 -preset veryslow -pix_fmt yuv420p -movflags +faststart \
  "$ZIEL/$NAME.mp4"

ffmpeg -v error -y -t "$DAUER" -i "$EIN" \
  -filter_complex "[0:v]$FILTER,split[a][b];[b]reverse[r];[a][r]concat=n=2:v=1:a=0" \
  -an -c:v libvpx-vp9 -crf 45 -b:v 0 -row-mt 1 \
  "$ZIEL/$NAME.webm"

# Standbild fuer das Poster-Attribut: erstes Bild, gleiche Beschneidung.
ffmpeg -v error -y -ss 0.2 -i "$EIN" -vf "$FILTER" -frames:v 1 "/tmp/$NAME-poster.png"

for f in "$ZIEL/$NAME".mp4 "$ZIEL/$NAME".webm; do
  echo "$(basename "$f")  $(du -h "$f" | cut -f1)"
done
