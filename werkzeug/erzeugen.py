#!/usr/bin/env python3
"""Erzeugt die Galeriefotos der Designkonzepte über kie.ai.

WARUM ES DIESEN UMWEG GIBT

Diese Bauumgebung erreicht `api.kie.ai`, aber keinen einzigen
Dateihost — weder `tempfile.aiquickdraw.com` noch die signierte
Cloudflare-Adresse, die kie.ai über `/common/download-url` herausgibt.
Beides antwortet mit `host_not_allowed`.

Erzeugt wird deshalb hier, heruntergeladen wird von einem
GitHub-Actions-Läufer: `.github/workflows/dateien-holen.yml`. Dieses
Skript schreibt am Ende die Eingabe für diesen Arbeitsablauf.

REGEL

Vor jedem einzelnen Auftrag wird das Guthaben geprüft. kie.ai bucht bei
jedem POST auf einen Erzeugungs-Endpunkt sofort ab, es gibt keinen
Probelauf. Und jede Auftragskennung wird sofort mitgeschrieben — ein
Auftrag, dessen Kennung verloren geht, ist bezahlt und unerreichbar.
Genau das ist zu Beginn dieses Projekts einmal passiert.

BILDSPRACHE

Als Referenz dient das vorhandene Standbild des jeweiligen Konzepts,
abgerufen über raw.githubusercontent.com — die einzige Dateiquelle, die
kie.ai von außen sicher erreichen kann. So bleiben Licht, Farbe und
Körnung der neuen Aufnahmen bei denen des Konzepts.

Aufruf:  python3 werkzeug/erzeugen.py [--nur nordwerk]
"""
import argparse
import json
import pathlib
import sys
import time
import urllib.request

BASIS = "https://api.kie.ai/api/v1"
SCHLUESSEL = "c0210aab717d0f34a0995c5449028ff9"
MINDEST = 60.0
ROH = "https://raw.githubusercontent.com/manuelbrandner85/Elfe-webdesigne/main"

HIER = pathlib.Path(__file__).resolve().parent
BUCH = HIER / "auftraege.txt"


def ruf(pfad, daten=None, methode="GET"):
    kopf = {"Authorization": f"Bearer {SCHLUESSEL}", "Content-Type": "application/json"}
    leib = json.dumps(daten).encode() if daten is not None else None
    a = urllib.request.Request(BASIS + pfad, data=leib, headers=kopf, method=methode)
    with urllib.request.urlopen(a, timeout=120) as r:
        return json.loads(r.read())


def guthaben() -> float:
    return float(ruf("/chat/credit")["data"])


STIL = (
    "Match the reference photograph in lighting, colour grade, grain and mood. "
    "Photographed on a full-frame camera with a fast prime, natural light, shallow "
    "depth of field, filmic colour, fine grain. No text, no lettering, no signage, "
    "no logos, no watermarks, no visible faces."
)

AUFTRAEGE = {
    "nordwerk": [
        ("dachstuhl",
         "A newly raised oak roof truss over an old town house, seen from below at "
         "golden hour. Clean pegged mortise-and-tenon joints, pale fresh timber "
         "against a deep dusk sky."),
        ("innenausbau",
         "A finished attic conversion: exposed dark oak beams, pale oiled oak "
         "floorboards, a wall of built-in joinery with flush doors, warm low evening "
         "light from a dormer window. Quiet and empty."),
        ("fachwerk",
         "Close view of a restored half-timbered facade: dark oak framing, freshly "
         "lime-rendered infill panels, a small leaded window, late afternoon sun "
         "raking across the surface."),
    ],
    "verde": [
        ("antipasti",
         "An overhead-angled still life of Sicilian antipasti on a worn wooden table: "
         "marinated olives, caponata, cured ham, pecorino, grilled peppers in small "
         "terracotta dishes, warm window light from the left."),
        ("pasta",
         "A bowl of pasta alla Norma on a linen napkin: rigatoni with tomato, fried "
         "aubergine, ricotta salata and basil, warm side light, rustic wooden table, "
         "a glass of red wine blurred behind."),
        ("dolci",
         "Sicilian cannoli on a small ceramic plate, dusted with icing sugar, "
         "candied orange and pistachio at the ends, warm afternoon light, rustic "
         "table, espresso cup blurred behind."),
    ],
    "atelier": [
        ("lobby",
         "A hotel lobby at dusk: dark panelled walls, a brass and glass chandelier, "
         "deep velvet seating in plum, a tall arched window with a blue city skyline "
         "beyond, warm pools of lamplight."),
        ("privathaus",
         "A private living room at dusk: dark green walls, an open fireplace, a low "
         "linen sofa, oak floor, brass floor lamp, tall windows with heavy curtains, "
         "warm intimate light."),
        # Ohne Referenzbild und bewusst anders gebaut: Mit der Referenz
        # zog es das Modell zurueck in dieselbe Bar wie bei der Lobby -
        # zwei Bilder, ein Raum. Genau das sollte hier abgestellt werden.
        ("restaurant",
         "A narrow bistro dining room at lunchtime, warm daylight from a large "
         "street window on the left. Bottle-green leather banquette along one wall, "
         "small round marble tables with bentwood chairs, white tablecloths, a "
         "black-and-white chequerboard tile floor, aged mirror panels and brass "
         "picture lights on the far wall. No bar, no bar stools, no chandelier, "
         "no armchairs, no city skyline, no evening light."),
    ],
}


def erzeugen(konzept, name, prompt, aufloesung="2K"):
    stand = guthaben()
    print(f"  [Guthaben] {stand:.1f}", flush=True)
    if stand < MINDEST:
        sys.exit(f"Abbruch: Guthaben {stand:.1f} unter Puffer {MINDEST}.")

    eingabe = {
        "prompt": prompt + " " + STIL,
        "image_input": ([] if konzept == "plan" or name == "restaurant"
                        else [f"{ROH}/public/images/concept-{konzept}.webp"]),
        "aspect_ratio": "4:3",
        "resolution": aufloesung,
        "output_format": "png",
    }
    auf = ruf("/jobs/createTask", {"model": "nano-banana-2", "input": eingabe}, "POST")
    tid = auf["data"]["taskId"]
    with BUCH.open("a", encoding="utf-8") as f:
        f.write(f"{time.strftime('%F %T')}  {konzept}-{name}  {tid}\n")
    print(f"  [{konzept}-{name}] Auftrag {tid}", flush=True)

    for _ in range(72):
        time.sleep(5)
        satz = ruf(f"/jobs/recordInfo?taskId={tid}")["data"]
        z = satz.get("state") or satz.get("status")
        if z in ("success", "SUCCESS"):
            erg = satz.get("resultJson") or satz.get("result")
            if isinstance(erg, str):
                erg = json.loads(erg)
            return erg["resultUrls"][0]
        if z in ("fail", "FAIL", "failed"):
            print(f"  [{konzept}-{name}] fehlgeschlagen: {satz.get('failMsg')}")
            return None
    print(f"  [{konzept}-{name}] Zeitüberschreitung")
    return None


if __name__ == "__main__":
    p = argparse.ArgumentParser()
    p.add_argument("--nur", default=None)
    p.add_argument("--ohne", default="", help="Namen, die uebersprungen werden")
    p.add_argument("--plan", default=None, help="JSON-Datei mit Auftraegen")
    args = p.parse_args()

    if args.plan:
        import json as _j
        plan = _j.loads(pathlib.Path(args.plan).read_text(encoding="utf-8"))
        dateien = []
        for a in plan["auftraege"]:
            if args.nur and not a["name"].startswith(args.nur):
                continue
            if a["name"] in args.ohne.split(","):
                continue
            u = erzeugen("plan", a["name"], a["prompt"] + " " + plan["stil"], plan["aufloesung"])
            if u:
                dateien.append({"url": u, "ziel": f"werkzeug/roh/{a['name']}.png"})
                print(f"  -> {u}", flush=True)
        ziel = HIER / "holen-eingabe.json"
        ziel.write_text(_j.dumps(dateien, ensure_ascii=False, indent=1), encoding="utf-8")
        print(f"\n{len(dateien)} Adressen in {ziel}")
        print(f"Guthaben am Ende: {guthaben():.1f}")
        raise SystemExit

    dateien = []
    for konzept, liste in AUFTRAEGE.items():
        if args.nur and konzept != args.nur:
            continue
        print(f"== {konzept}")
        for name, prompt in liste:
            if f"{konzept}-{name}" in args.ohne.split(","):
                print(f"  [{konzept}-{name}] uebersprungen")
                continue
            u = erzeugen(konzept, name, prompt)
            if u:
                dateien.append({"url": u, "ziel": f"werkzeug/roh/{konzept}-{name}.png"})
                print(f"  -> {u}", flush=True)

    ziel = HIER / "holen-eingabe.json"
    ziel.write_text(json.dumps(dateien, ensure_ascii=False, indent=1), encoding="utf-8")
    print(f"\n{len(dateien)} Adressen in {ziel}")
    print(f"Guthaben am Ende: {guthaben():.1f}")
