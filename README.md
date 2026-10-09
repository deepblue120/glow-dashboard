# Glow Dashboard

Custom Lovelace cards for Home Assistant — dark, modern, card-based.

## Karten

| Karte | Beschreibung |
|-------|-------------|
| `custom:mg-car-dashboard` | Auto-Seite mit evcc, ev_assistant, Fahrtenbuch |

## Installation

### Über HACS (empfohlen)

1. **HACS → ⋮ → Benutzerdefinierte Repositories**
2. Repository `https://github.com/deepblue120/glow-dashboard`, Typ **Dashboard** → **Hinzufügen**
3. „Glow Dashboard“ in HACS öffnen → **Herunterladen**
4. Browser neu laden (Strg+F5)

HACS legt die Datei unter `/config/www/community/glow-dashboard/` ab und trägt die Ressource
`/hacsfiles/glow-dashboard/mg-car-dashboard.js` automatisch ein (bei Dashboards im YAML-Modus von Hand eintragen).

> **Wichtig:** Bei jedem Update über HACS wird die Datei ersetzt. Eigene Sensoren und Einstellungen
> deshalb nicht in der Datei ändern, sondern per YAML in der Kartenkonfiguration angeben (siehe unten).

### Manuell

1. `dist/mg-car-dashboard.js` nach `/config/www/glow-dashboard/` kopieren.
2. **Einstellungen → Dashboards → ⋮ → Ressourcen** → Eintrag hinzufügen (Typ: **JavaScript-Modul**):
   `/local/glow-dashboard/mg-car-dashboard.js?v=8`
   (die Zahl hinter `?v=` nach jedem Update erhöhen, damit der Browser die neue Datei lädt)

## Datenquellen

Die Karte holt sich alles, was möglich ist, aus **ev_assistant** – es reicht also in der Regel:

```yaml
type: custom:mg-car-dashboard
```

| Bereich | Quelle |
|---|---|
| Fahrzeugname, Ladestand | in ev_assistant konfigurierter SoC-Sensor (über die Panel-Konfiguration von ev_assistant) |
| Reichweite | ev_assistant „Reichweite (real)“ |
| Laden (lädt, verbunden, Leistung, Sitzung, Ladeziel, Mindestladung, PV-Anteil) | evcc-Live-Werte, die ev_assistant mitliefert |
| Letzte Ladung, Alle Ladungen | evcc-Ladelogbuch und Fremdladungen über ev_assistant |
| Fahrtenbuch | ev_assistant |
| Lademodus umschalten | ev_assistant (Auto / Smart / Immer / Schnell) |
| Kennzahlen, Ladeplan, Vollladung | ev_assistant |

Einstellungen mit `eva:` stehen für diese automatischen Quellen. Jeder Wert lässt sich durch eine eigene
Entity-ID ersetzen. Nicht aus ev_assistant kommen: **Ladestrom** (`car.limit`), **Motor/Stecker**
(gibt ev_assistant bisher nicht weiter), **Bild** und für den **Verlauf** ein Ladeleistungs-Sensor mit
Langzeitstatistik (`energy.car_power`) sowie Netzbezug/Hausverbrauch für die Aufteilung Netz/PV.
Mit `debug: true` zeigt die Browser-Konsole, welche Quelle für welchen Wert verwendet wird.

### Einbettung in ev_assistant

Das ev_assistant-Panel kann die Karte einbetten und übergibt dann seine Panel-Konfiguration direkt:

```js
card.setConfig({ ev_assistant_panel: panel.config });
```

Als eigenständige Karte liest sie dieselbe Konfiguration selbst über `get_panels` (klassisches oder Glow-Panel
von ev_assistant). Erwartete Felder: `config_entry_id`, `name`, `evcc_vehicle_name`, `entities` (eigene Entitäten
von ev_assistant sowie `soc_entity`, `home_entity`, `power_entity`, `plug_entity`, `motor_entity`,
`wallbox_connected_entity`, `wallbox_charging_entity`), optional `vehicles` (mehrere Fahrzeuge, Auswahl per
`car.ev_assistant_entry`) und `api_version`. Die Karte unterstützt `api_version: 1` und warnt bei Abweichung.

### Beispiel mit eigenen Sensoren

```yaml
type: custom:mg-car-dashboard
energy:
  car_power: sensor.shelly_wallbox_power
  grid_import: sensor.alpha_ess_netzbezug_leistung_vom_netz
  home: sensor.strom_leistung_haus_gesamt_inkl_bkw_und_marstek
car:
  image: /local/auto.png
  status: binary_sensor.e_c3_motor
  cable: binary_sensor.warp3_2ee3_cable
  limit: number.wallbox_ladestrom
  # optional: evcc-Modus über die evcc-Integration statt über ev_assistant
  # mode: select.evcc_warp3_mode
  # always: select.evcc_warp3_always_charge
  # evcc:
  #   limit_soc: select.evcc_warp3_limit_soc   # Ladeziel auswählbar
```

## Konfiguration Auto-Karte

Alle Optionen stehen am Anfang von `mg-car-dashboard.js` im Block `CAR_DEFAULTS` und lassen sich per YAML
überschreiben (gleiche Struktur):

```yaml
type: custom:mg-car-dashboard
car:
  history_ranges:
    - { hours: 6, label: "6 h" }
    - { hours: 24, label: "Tag" }
    - { hours: 168, label: "Woche" }
    - { hours: 720, label: "Monat" }
    - { hours: 2160, label: "Quartal" }
```

| Option | Bedeutung |
|--------|-----------|
| `fit_screen` | Seite an die Fensterhöhe anpassen (Desktop) |
| `debug` | Diagnose-Meldungen in der Browser-Konsole |
| `energy.car_power` / `grid_import` / `home` | Ladeleistung, Netzbezug, Hausverbrauch für den Verlauf (Aufteilung Netz/PV) |
| `car.name`, `car.image` | Name und Bild des Autos |
| `car.soc`, `range`, `status`, `cable` | Ladestand, Reichweite, Fahrstatus, Ladekabel (Standard: aus ev_assistant) |
| `car.status_on` / `status_off` | Text für fahrend / geparkt |
| `car.limit`, `mode`, `always`, `manual_mode` | Ladestrom, evcc-Lademodus, „Immer laden“, eigene Vorgabe |
| `car.evcc.*` | Ladepunkt-Werte (Standard: evcc-Live-Werte aus ev_assistant, oder eigene Sensoren) |
| `car.evcc_vehicle` | nur Ladungen dieses evcc-Fahrzeugs in „Alle Ladungen“ |
| `car.ev_assistant` | einzelne ev_assistant-Entitäten fest vorgeben (sonst automatisch gefunden) |
| `car.ev_assistant_entry` | config_entry_id von ev_assistant (sonst automatisch) |
| `car.stats` | Kennzahlen in der Auto-Kachel (ev_assistant-Schlüssel oder Entity-IDs) |
| `car.trips` | Fahrtenbuch-Sensor (Attribut `trips`) |
| `car.trips_visible` | Fahrten in der Kachel, wenn die Seite nicht an die Fensterhöhe angepasst ist (sonst so viele, wie hineinpassen) |
| `car.trips_max` | Fahrten im Fenster „Alle Fahrten“ |
| `car.history_ranges` | Zeiträume im Verlauf: Stunden oder `{ hours, label }` |
| `car.history_hours` | Zeitraum beim ersten Öffnen |
| `car.bars_from_hours` | ab diesem Zeitraum Balken statt Linie (0 = immer Balken) |
| `car.bars_daily_from_hours` | ab diesem Zeitraum Tagesbalken, darunter stündlich (Standard 72 = 3 Tage) |
| `car.bars_weekly_from_hours` | ab diesem Zeitraum Wochenbalken Mo–So (Standard 744 = 31 Tage) |
| `car.split_grid` / `split_home` | abweichende Sensoren für die Aufteilung Netz/PV |
| `car.session_days` / `session_stats_days` | Suchzeitraum für „Letzte Ladung“ (Verlauf / Langzeitstatistik) |
| `car.mode_styles`, `always_styles`, `manual_styles` | Beschriftung, Symbol und Farbe der Auswahlwerte |

## Versionen

| Version | Datei |
|---------|-------|
| 2.37.x | mg-home-dashboard.js, mg-climate-dashboard.js, mg-rooms-dashboard.js, mg-school-card.js |
| 3.2.0  | mg-car-dashboard.js (eigenständig) |
