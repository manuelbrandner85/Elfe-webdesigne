#!/usr/bin/env bash
# Liefert out/ auf 8099 aus.
#
# ThreadingHTTPServer, nicht der einfache http.server: Browser holen
# Video ueber mehrere gleichzeitige Bereichsanfragen. Ein einstraengiger
# Server bricht die zusaetzlichen Verbindungen ab, im Protokoll steht
# dann net::ERR_ABORTED bei jeder .webm-Datei — ein Fehler, den es auf
# GitHub Pages gar nicht gibt, der aber jede Pruefung rot faerbt.
# Alles beenden, was auf 8099 haengt — egal wie es gestartet wurde.
fuser -k 8099/tcp 2>/dev/null
pkill -f "werkzeug-server" 2>/dev/null
pkill -f "http.server 8099" 2>/dev/null
sleep 2
cd "$(dirname "$0")/../out" || exit 1
setsid python3 -c "
import http.server, socketserver, sys
sys.argv[0] = 'werkzeug-server'
class Leise(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a): pass
socketserver.ThreadingTCPServer.allow_reuse_address = True
with socketserver.ThreadingTCPServer(('127.0.0.1', 8099), Leise) as s:
    s.serve_forever()
" >/tmp/srv.log 2>&1 < /dev/null &
sleep 3
curl -s -o /dev/null -w "Server: HTTP %{http_code}\n" http://127.0.0.1:8099/
