#!/usr/bin/env python3
"""Erzeugt Videos ueber kie.ai (Veo 3.1 Fast).

Veo laeuft NICHT ueber /jobs/createTask wie die Bildmodelle, sondern hat
einen eigenen Endpunkt: /veo/generate und /veo/record-info.

Kosten: Ein Achtsekuender in der Fast-Fassung liegt bei rund 60 Credits.
Die Quality-Fassung kostet etwa das Siebenfache - fuer Hintergrundbilder,
die hinter einem Schleier und unter Text liegen, waere das verschwendet.

Wie bei den Bildern: Guthaben VOR jedem Auftrag, Kennung sofort ins Buch.

Aufruf: python3 werkzeug/video.py <name> "<prompt>" [seitenverhaeltnis]
"""
import json, pathlib, sys, time, urllib.request

K = "c0210aab717d0f34a0995c5449028ff9"
BASIS = "https://api.kie.ai/api/v1"
MINDEST = 80.0
HIER = pathlib.Path(__file__).resolve().parent
BUCH = HIER / "auftraege.txt"


def ruf(pfad, daten=None, methode="GET"):
    kopf = {"Authorization": f"Bearer {K}", "Content-Type": "application/json"}
    leib = json.dumps(daten).encode() if daten is not None else None
    a = urllib.request.Request(BASIS + pfad, data=leib, headers=kopf, method=methode)
    with urllib.request.urlopen(a, timeout=120) as r:
        return json.loads(r.read())


def guthaben():
    return float(ruf("/chat/credit")["data"])


def erzeugen(name, prompt, verhaeltnis="16:9"):
    stand = guthaben()
    print(f"[Guthaben] {stand:.1f}", flush=True)
    if stand < MINDEST:
        sys.exit(f"Abbruch: {stand:.1f} unter Puffer {MINDEST}")

    auf = ruf("/veo/generate", {
        "prompt": prompt,
        "model": "veo3_fast",
        "aspectRatio": verhaeltnis,
        "generationType": "TEXT_2_VIDEO",
    }, "POST")
    print(json.dumps(auf)[:300], flush=True)
    tid = (auf.get("data") or {}).get("taskId")
    if not tid:
        sys.exit("keine Auftragskennung erhalten")
    with BUCH.open("a", encoding="utf-8") as f:
        f.write(f"{time.strftime('%F %T')}  video-{name}  {tid}\n")
    print(f"[{name}] Auftrag {tid}", flush=True)

    for _ in range(120):
        time.sleep(10)
        satz = ruf(f"/veo/record-info?taskId={tid}").get("data") or {}
        z = satz.get("successFlag")
        if z == 1 or satz.get("status") == "success":
            urls = ((satz.get("response") or {}).get("resultUrls")
                    or satz.get("resultUrls") or [])
            if urls:
                print(f"[{name}] fertig: {urls[0]}", flush=True)
                print(f"[Guthaben danach] {guthaben():.1f}")
                return urls[0]
        if z in (2, 3):
            sys.exit(f"[{name}] fehlgeschlagen: {satz.get('errorMessage')}")
        print(f"  ... {z}", flush=True)
    sys.exit("Zeitueberschreitung")


if __name__ == "__main__":
    name, prompt = sys.argv[1], sys.argv[2]
    verh = sys.argv[3] if len(sys.argv) > 3 else "16:9"
    u = erzeugen(name, prompt, verh)
    ziel = HIER / "holen-eingabe.json"
    ziel.write_text(json.dumps(
        [{"url": u, "ziel": f"werkzeug/roh/{name}.mp4"}], indent=1), encoding="utf-8")
    print(f"Adresse in {ziel}")
