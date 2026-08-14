#!/usr/bin/env bash
# Liefert out/ auf 8099 aus. Als eigenes Skript, weil ein im Hintergrund
# gestarteter Server die Sitzung ueberlebt, aber nicht jeden Aufruf.
pkill -f "http.server 8099" 2>/dev/null
sleep 1
cd "$(dirname "$0")/../out" || exit 1
setsid python3 -m http.server 8099 >/tmp/srv.log 2>&1 < /dev/null &
sleep 3
curl -s -o /dev/null -w "Server: HTTP %{http_code}\n" http://127.0.0.1:8099/
