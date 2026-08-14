#!/usr/bin/env python3
"""Sammelt die Ergebnisadressen aller im Auftragsbuch vermerkten Auftraege.

Das Buch ist der Grund, warum ein abgebrochener Lauf hier nichts kostet:
Jeder Auftrag ist bezahlt, sobald er abgeschickt wurde - aber solange
seine Kennung notiert ist, laesst sich das Ergebnis jederzeit nachholen.
"""
import json, pathlib, sys, urllib.request

BASIS = "https://api.kie.ai/api/v1"
K = "c0210aab717d0f34a0995c5449028ff9"
HIER = pathlib.Path(__file__).resolve().parent

def ruf(pfad):
    a = urllib.request.Request(BASIS + pfad, headers={"Authorization": f"Bearer {K}"})
    with urllib.request.urlopen(a, timeout=60) as r:
        return json.loads(r.read())

eintraege = {}
for zeile in (HIER / "auftraege.txt").read_text(encoding="utf-8").splitlines():
    t = zeile.split()
    if len(t) < 4: continue
    name, tid = t[2], t[3]
    eintraege[name] = tid          # spaeterer Auftrag gewinnt

dateien = []
for name, tid in eintraege.items():
    try:
        satz = ruf(f"/jobs/recordInfo?taskId={tid}")["data"]
    except Exception as e:
        print(f"{name:24} Abfragefehler {e}"); continue
    z = satz.get("state") or satz.get("status")
    if z not in ("success", "SUCCESS"):
        print(f"{name:24} {z}"); continue
    erg = satz.get("resultJson") or satz.get("result")
    if isinstance(erg, str): erg = json.loads(erg)
    u = erg["resultUrls"][0]
    dateien.append({"url": u, "ziel": f"werkzeug/roh/{name}.png"})
    print(f"{name:24} OK")

(HIER / "holen-eingabe.json").write_text(json.dumps(dateien, ensure_ascii=False, indent=1), encoding="utf-8")
print(f"\n{len(dateien)} Adressen gesammelt")
