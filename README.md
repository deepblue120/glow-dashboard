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

Alle Sensor-IDs am Anfang der Datei `mg-car-dashboard.js` unter `CAR_DEFAULTS` anpassen.

```javascript
const CAR_DEFAULTS = {
  soc:   "sensor.e_c3_batterie",   // Ladestand (%)
  range: "sensor.e_c3_reichweite", // Reichweite (km)
  // ...
};
```

## Versionen

| Version | Datei |
|---------|-------|
| 2.37.x | mg-home-dashboard.js, mg-climate-dashboard.js, mg-rooms-dashboard.js, mg-school-card.js |
| 3.0.0  | mg-car-dashboard.js (eigenständig) |
