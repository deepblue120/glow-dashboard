# Glow Dashboard

Custom Lovelace cards for Home Assistant — dark, modern, card-based.

## Karten

| Karte | Beschreibung |
|-------|-------------|
| `custom:mg-home-dashboard` | Startseite mit Energie, Kalender, Wetter |
| `custom:mg-car-dashboard` | Auto-Seite mit evcc, ev_assistant, Fahrtenbuch |
| `custom:mg-climate-dashboard` | Klima & Heizung |
| `custom:mg-rooms-dashboard` | Räume mit Detailansicht |
| `custom:mg-school-card` | Schulstundenplan |

## Installation

1. Alle `.js`-Dateien aus dem Ordner `dist/` nach `/config/www/glow-dashboard/` kopieren.
2. In Home Assistant: **Einstellungen → Dashboards → Ressourcen** → folgende Einträge hinzufügen (Typ: **JavaScript**):

```
/local/glow-dashboard/mg-home-dashboard.js
/local/glow-dashboard/mg-car-dashboard.js
/local/glow-dashboard/mg-climate-dashboard.js
/local/glow-dashboard/mg-rooms-dashboard.js
/local/glow-dashboard/mg-school-card.js
```

## YAML-Beispiel

```yaml
# Startseite (Panel-Ansicht)
type: custom:mg-home-dashboard
weather:
  entity: weather.forecast_home

# Auto-Seite
type: custom:mg-car-dashboard
# Sensor-IDs können in mg-car-dashboard.js unter CAR_DEFAULTS angepasst werden
# oder hier per YAML überschrieben werden:
car:
  soc: sensor.e_c3_batterie
  range: sensor.e_c3_reichweite

# Klima
type: custom:mg-climate-dashboard

# Räume
type: custom:mg-rooms-dashboard

# Schule
type: custom:mg-school-card
```

## Konfiguration Auto-Karte

Alle Sensoren, Pfade und Optionen stehen am Anfang von `mg-car-dashboard.js` im Block `CAR_DEFAULTS`.
Jeder Wert lässt sich dort ändern oder per YAML überschreiben (gleiche Struktur):

```yaml
type: custom:mg-car-dashboard
car:
  image: /local/mein_auto.png
  soc: sensor.mein_auto_batterie
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
| `car.soc`, `range`, `status`, `cable` | Ladestand, Reichweite, Fahrstatus, Ladekabel |
| `car.status_on` / `status_off` | Text für fahrend / geparkt |
| `car.limit`, `mode`, `always`, `manual_mode` | Ladestrom, evcc-Lademodus, „Immer laden“, eigene Vorgabe |
| `car.evcc.*` | evcc-Sensoren (Leistung, Sitzung, Ladeziel, Mindestladung …) |
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
| 3.1.0  | mg-car-dashboard.js (eigenständig) |
