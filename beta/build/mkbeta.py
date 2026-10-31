# Erzeugt beta/mg-car-dashboard-beta.js aus dist/mg-car-dashboard.js plus den Änderungen in patch.py
# (Handy-Cockpit) – mit eigenem Kartennamen, damit beide Karten nebeneinander laufen.
#   python3 beta/build/mkbeta.py            → beta/mg-car-dashboard-beta.js
#   python3 beta/build/mkbeta.py OUT --merge → Änderungen ohne Umbenennen (zum Übernehmen in dist/)
import sys, runpy, json, os
D = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(D, '..', '..'))
SRC = os.path.join(ROOT, 'dist', 'mg-car-dashboard.js')
OUT = sys.argv[1] if len(sys.argv) > 1 and not sys.argv[1].startswith('--') else os.path.join(ROOT, 'beta', 'mg-car-dashboard-beta.js')
beta = '--merge' not in sys.argv
s = open(SRC, encoding='utf-8').read()
P = runpy.run_path(os.path.join(D, 'patch.py'))
bad = 0
for item in P['R']:
    old, new = item[0], item[1]; n = item[2] if len(item) > 2 else 1
    c = s.count(old)
    if c != n: print(f'!! {c}x (erwartet {n}): {old[:100]!r}'); bad += 1; continue
    s = s.replace(old, new)
a = '    "Ladeplan konnte nicht gesetzt werden:": "Charge plan could not be set:",\n'
assert s.count(a) == 1
s = s.replace(a, a + ''.join(f'    {json.dumps(k, ensure_ascii=False)}: {json.dumps(v, ensure_ascii=False)},\n' for k, v in P['EN'].items() if f'"{k}":' not in s))
if beta:
    for x, y in [('customElements.get("mg-car-dashboard")) customElements.define("mg-car-dashboard", MgCarDashboard);', 'customElements.get("mg-car-dashboard-beta")) customElements.define("mg-car-dashboard-beta", MgCarDashboard);'),
                 ('window.customCards.push({ type: "mg-car-dashboard", name: "Glow Auto",', 'window.customCards.push({ type: "mg-car-dashboard-beta", name: "Glow Auto (Beta: Handy-Cockpit)",'),
                 ('const VERSION = "', 'const VERSION = "beta4-'),
                 ('c.type === "mg-car-dashboard"))', 'c.type === "mg-car-dashboard-beta"))'),
                 (' * Ablage:    /config/www/glow-dashboard/mg-car-dashboard.js\n * Ressource: /local/glow-dashboard/mg-car-dashboard.js', ' * Ablage:    /config/www/glow-dashboard/mg-car-dashboard-beta.js\n * Ressource: /local/glow-dashboard/mg-car-dashboard-beta.js'),
                 (' * YAML:      type: custom:mg-car-dashboard\n', ' * YAML:      type: custom:mg-car-dashboard-beta\n'),
                 ('`%c GLOW AUTO (mg-car-dashboard) %c ${VERSION} `', '`%c GLOW AUTO BETA (mg-car-dashboard-beta) %c ${VERSION} `'),
                 (' * mg-car-dashboard.js\n', ' * mg-car-dashboard-beta.js – Testversion: Handy-Cockpit (Vorschlag B). Läuft neben der normalen Karte\n * als custom:mg-car-dashboard-beta, nur zum Ausprobieren. Wird nach dem Test in mg-car-dashboard.js übernommen.\n * Grundlage: mg-car-dashboard.js\n')]:
        if s.count(x) != 1: print('!! Umbenennen:', x[:80]); bad += 1
        s = s.replace(x, y)
if bad: print(bad, 'Fehler'); sys.exit(1)
os.makedirs(os.path.dirname(OUT), exist_ok=True)
open(OUT, 'w', encoding='utf-8').write(s); print('ok →', OUT)
