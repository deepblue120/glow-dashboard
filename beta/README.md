# Testversion: Handy-Cockpit

`mg-car-dashboard-beta.js` ist die normale Auto-Karte plus einer neuen Ansicht für das Handy
(Karte bis 600 px breit). Sie läuft als eigene Karte `custom:mg-car-dashboard-beta` neben der
normalen Karte und ändert an dieser nichts. Auf dem Desktop sieht sie aus wie die normale Karte.

## Was sich auf dem Handy ändert

- **Cockpit-Kachel:** Auto und Laden in einer Kachel – Ladestand als Ring mit Reichweite, daneben die
  laufende Ladung (kWh, Leistung, PV-Anteil, Kosten, Ziel) bzw. die letzte Ladung. Antippen des Rings
  öffnet die Details zum Ladestand, Antippen der Ladung „Alle Ladungen“.
- **Lademanagement direkt darunter:** Automatik · Manuell · Vollladung als Umschalter, darunter
  Ladeziel, PV-Anteil und Puffer. Der Ladeplan ist eine Zeile und klappt beim Antippen auf
  (ein aktiver Plan wird wie bisher angezeigt).
- **Fahrtenbuch, Verlauf, Leasing/Nutzung, Kennzahlen** als Zeilen mit dem wichtigsten Wert.
  Fahrtenbuch öffnet „Alle Fahrten“, die anderen klappen beim Antippen auf.

## Einbinden (von Hand)

1. `mg-car-dashboard-beta.js` nach `/config/www/glow-dashboard/` kopieren.
2. **Einstellungen → Dashboards → ⋮ → Ressourcen → Ressource hinzufügen**:
   `/local/glow-dashboard/mg-car-dashboard-beta.js?v=1` (Typ: JavaScript-Modul).
   Nach jedem neuen Stand die Zahl hinter `?v=` erhöhen.
3. Ein Dashboard (oder eine Ansicht) mit der Testkarte anlegen – gleiche Konfiguration wie die
   normale Karte, nur mit anderem Typ:

   ```yaml
   type: custom:mg-car-dashboard-beta
   ```

Die Konsole meldet die Testkarte als `GLOW AUTO BETA`.

## Neu erzeugen

`python3 beta/build/mkbeta.py` baut die Testkarte aus `dist/mg-car-dashboard.js` und
`beta/build/patch.py`. Wenn die Ansicht passt, werden dieselben Änderungen in
`dist/mg-car-dashboard.js` übernommen und der Ordner `beta/` entfernt.
