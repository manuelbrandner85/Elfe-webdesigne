# Seite wieder online schalten

Am 15.08.2026 wurde die Seite bewusst offline genommen. Der Code ist
davon unberührt — es wurde nur die Auslieferung abgeschaltet.

## Was abgeschaltet wurde

1. **Der Veröffentlichungs-Ablauf** („Website bauen und veröffentlichen",
   `.github/workflows/deploy.yml`) steht auf *disabled_manually*. Ein
   Push löst damit keine Veröffentlichung mehr aus.
2. **GitHub Pages** ist gelöscht. Unter der Domain wird nichts mehr
   ausgeliefert.

## Zustand vor dem Abschalten

| | |
|---|---|
| Eigene Domain | `webdesign-elfe.de` |
| Quelle | GitHub Actions (`workflow`) |
| HTTPS-Zwang | aus |
| Zertifikat | `dns_changed` (war noch in Ausstellung) |

Die DNS-Einträge bei Strato wurden **nicht** angefasst:
`webdesign-elfe.de` → A auf `185.199.108.153`, `www` → CNAME auf den Apex.

## Wieder einschalten

Über die Oberfläche:

1. `Settings → Pages` → Source auf **GitHub Actions** stellen
2. Custom domain wieder auf `webdesign-elfe.de` setzen
3. `Actions → Website bauen und veröffentlichen` → **Enable workflow**
4. Einmal auf `main` pushen oder den Ablauf von Hand starten

Über die Schnittstelle (Token mit Pages- und Actions-Rechten):

```bash
# Pages neu anlegen, Quelle Actions
curl -X POST -H "Authorization: Bearer $GH_TOKEN" \
  -H "Accept: application/vnd.github+json" \
  https://api.github.com/repos/manuelbrandner85/Elfe-webdesigne/pages \
  -d '{"build_type":"workflow"}'

# Eigene Domain setzen
curl -X PUT -H "Authorization: Bearer $GH_TOKEN" \
  -H "Accept: application/vnd.github+json" \
  https://api.github.com/repos/manuelbrandner85/Elfe-webdesigne/pages \
  -d '{"cname":"webdesign-elfe.de"}'

# Veroeffentlichung wieder erlauben
curl -X PUT -H "Authorization: Bearer $GH_TOKEN" \
  https://api.github.com/repos/manuelbrandner85/Elfe-webdesigne/actions/workflows/330667272/enable
```

## Womit zu rechnen ist

Das Zertifikat muss neu ausgestellt werden — GitHub beginnt damit erst,
wenn die Domain wieder gesetzt ist. Bis dahin ist die Seite nur über
`http://` erreichbar. Das war schon vor dem Abschalten so.
