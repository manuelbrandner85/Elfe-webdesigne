#!/usr/bin/env python3
"""Videos ueber Kling 3.0 - Bild zu Bewegung, zum Bruchteil des Preises.

WARUM NICHT VEO

Der Referenzmodus von Veo 3.1 (REFERENCE_2_VIDEO) hat 240 Credits je
Achtsekuender gekostet - das Vierfache der Text-zu-Video-Fassung und
weit ueber dem, was die Preisliste vermuten liess. Gemessen, nicht
geschaetzt: 460,5 vor dem Auftrag, 220,5 danach.

Kling 3.0 im Standardmodus nimmt ebenfalls ein Startbild, laeuft ohne
Ton und kostet laut Liste rund ein Fuenftel. Genau deshalb wird der
Preis hier nach dem ERSTEN Auftrag geprueft, bevor weitere folgen.

Aufruf: python3 werkzeug/video-kling.py <name> "<prompt>" <startbild-url>
"""
import json, pathlib, sys, time, urllib.request

K = "c0210aab717d0f34a0995c5449028ff9"
BASIS = "https://api.kie.ai/api/v1"
MINDEST = 80.0
HIER = pathlib.Path(__file__).resolve().parent


def ruf(pfad, daten=None, methode="GET"):
    kopf = {"Authorization": f"Bearer {K}", "Content-Type": "application/json"}
    leib = json.dumps(daten).encode() if daten is not None else None
    a = urllib.request.Request(BASIS + pfad, data=leib, headers=kopf, method=methode)
    with urllib.request.urlopen(a, timeout=120) as r:
        return json.loads(r.read())


def guthaben():
    return float(ruf("/chat/credit")["data"])


if __name__ == "__main__":
    name, prompt, bild = sys.argv[1], sys.argv[2], sys.argv[3]
    vorher = guthaben()
    print(f"[Guthaben vorher] {vorher:.1f}", flush=True)
    if vorher < MINDEST:
        sys.exit(f"Abbruch: {vorher:.1f} unter Puffer {MINDEST}")

    auf = ruf("/jobs/createTask", {"model": "kling-3.0/video", "input": {
        "prompt": prompt,
        "image_urls": [bild],
        "duration": "5",
        "mode": "std",
        "sound": False,
        "multi_shots": False,
    }}, "POST")
    tid = auf["data"]["taskId"]
    with (HIER / "auftraege.txt").open("a", encoding="utf-8") as f:
        f.write(f"{time.strftime('%F %T')}  kling-{name}  {tid}\n")
    print(f"[{name}] Auftrag {tid}", flush=True)

    for _ in range(120):
        time.sleep(10)
        satz = ruf(f"/jobs/recordInfo?taskId={tid}")["data"]
        z = satz.get("state")
        if z == "success":
            e = satz.get("resultJson")
            if isinstance(e, str):
                e = json.loads(e)
            u = e["resultUrls"][0]
            nachher = guthaben()
            print(f"[{name}] fertig: {u}")
            print(f"[Kosten] {vorher - nachher:.1f} Credits, Rest {nachher:.1f}")
            (HIER / "holen-eingabe.json").write_text(json.dumps(
                [{"url": u, "ziel": f"werkzeug/roh/{name}.mp4"}], indent=1), encoding="utf-8")
            break
        if z == "fail":
            sys.exit(f"fehlgeschlagen: {satz.get('failMsg')}")
        print(f"  ... {z}", flush=True)
