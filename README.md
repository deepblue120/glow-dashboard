# Glow Dashboard

Custom Lovelace cards for Home Assistant — dark, modern, card-based.

## Karten

| Karte | Beschreibung |
|-------|-------------|
| `custom:mg-car-dashboard` | Auto-Seite mit evcc, ev_assistant, Fahrtenbuch |

## Screenshots

Alle Bilder sind mit Beispieldaten erstellt.

### Übersicht
Ladestand und Fahrzeug, laufende Ladung mit PV-Anteil, Lademanagement mit ev_assistant, Verlauf (Ladeleistung, Netz/PV, Ladestand), Fahrtenbuch und Leasing-Budget.

<img src="https://raw.githubusercontent.com/deepblue120/glow-dashboard/main/docs/screenshots/uebersicht.png" alt="Übersicht">

### Profil & Analyse
Nutzungsprofil der Woche, Empfehlung für morgen, Analyse (Batterie, Verbrauch nach Temperatur, Kosten, Autarkie, Ladeorte, Schnellladen, Anbieter) und Netz-Zuschuss.

<img src="https://raw.githubusercontent.com/deepblue120/glow-dashboard/main/docs/screenshots/profil-analyse.png" alt="Profil & Analyse">

### Laden & Kosten
Geladene Energie nach Quelle (Heim PV, Heim Netz, Fremd AC/DC) für Tag, Woche, Monat, Jahr oder Gesamt, alle Ladungen des Zeitraums sortierbar, Aufschlüsselung und Vergleich mit einem Verbrenner.

<img src="https://raw.githubusercontent.com/deepblue120/glow-dashboard/main/docs/screenshots/laden-kosten.png" alt="Laden & Kosten">

### Einstellungen
Wartung mit Countdown bis zum nächsten Termin, Ladekarten, Urlaubsmodus, Fahrzeugbild, Datensicherung, Fahrtenbuch-Export/-Import und Ereignisprotokoll.

<img src="https://raw.githubusercontent.com/deepblue120/glow-dashboard/main/docs/screenshots/einstellungen.png" alt="Einstellungen">

### Fenster und Menüs

| Alle Ladungen | Alle Fahrten |
|:---:|:---:|
| <img src="https://raw.githubusercontent.com/deepblue120/glow-dashboard/main/docs/screenshots/dlg-ladungen.png" alt="Alle Ladungen"> | <img src="https://raw.githubusercontent.com/deepblue120/glow-dashboard/main/docs/screenshots/dlg-fahrten.png" alt="Alle Fahrten"> |
| **Autarkie und Ersparnis** | **Fremdladung bestätigen** |
| <img src="https://raw.githubusercontent.com/deepblue120/glow-dashboard/main/docs/screenshots/dlg-autarkie.png" alt="Autarkie"> | <img src="https://raw.githubusercontent.com/deepblue120/glow-dashboard/main/docs/screenshots/dlg-bestaetigen.png" alt="Fremdladung bestätigen"> |
| **Lademodus wählen** | **English** |
| <img src="https://raw.githubusercontent.com/deepblue120/glow-dashboard/main/docs/screenshots/menu-lademodus.png" alt="Lademodus wählen"> | <img src="https://raw.githubusercontent.com/deepblue120/glow-dashboard/main/docs/screenshots/overview-en.png" alt="Overview in English"> |

### Handy

<p>
  <img src="https://raw.githubusercontent.com/deepblue120/glow-dashboard/main/docs/screenshots/handy.png" alt="Übersicht auf dem Handy" width="300">
  &nbsp;
  <img src="https://raw.githubusercontent.com/deepblue120/glow-dashboard/main/docs/screenshots/handy-kosten.png" alt="Laden & Kosten auf dem Handy" width="300">
</p>

Die Bilder erstellt `node docs/screenshots/generator/shots.mjs` (Playwright mit Chromium) neu.

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
   `/local/glow-dashboard/mg-car-dashboard.js?v=58`
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
| Lademodus umschalten | ev_assistant (Auto / Smart mit „immer laden“ aus · immer · 1x / Schnell); „1x“ über die Auswahl „Mit min. laden“ der evcc-Integration |
| Kennzahlen, Ladeplan, Vollladung, Automatik pausieren | ev_assistant |
| Ladeziel (einstellbar) und „Ziel jetzt“ | ev_assistant (`target_soc_max` / `target_soc`), ohne aktive ev_assistant-Steuerung das Ladeziel-Select der evcc-Integration |
| Nutzung (km/kWh/Kosten je Zeitraum, Ø km/Tag, Hochrechnung, €/100 km, CO₂, Ladeorte) | ev_assistant |
| Leasing-Kilometerbudget | ev_assistant „km vor Rücklauf“ (Status, Soll/Ist, Restbudget; Balken mit Vertragsgrenze und Toleranzband) |
| Verlauf (geladene kWh) | „Wallbox Ladeleistung“ aus ev_assistant (ab 0.99.34), sonst das evcc-Ladelogbuch |
| PV-Anteil im Verlauf | evcc (PV-Anteil der jeweiligen Ladesitzung) |

Einstellungen mit `eva:` stehen für diese automatischen Quellen. Jeder Wert lässt sich durch eine eigene
Entity-ID ersetzen. Bei mehreren Ladepunkten in der evcc-Integration wählt `car.evcc_loadpoint` (Teil der Entity-ID) den richtigen. Das **Bild** kommt aus ev_assistant (Entität „Fahrzeugbild“, ab 0.99.45, im ev_assistant-Panel hochladen); ein eigenes Bild per `car.image` hat Vorrang. Den Ladestrom zeigt die Karte nur mit `car.limit` an (`eva:max_current` = Select der evcc-Integration). Den Strom je Phase zeigt sie beim Laden hinter der Ladeleistung: aus evccs `chargeCurrents`, sofern ev_assistant sie in den evcc-Live-Werten (`charge_currents`) mitliefert, sonst aus den Sensoren „Ladestrom P1–P3“ der evcc-Integration (dort standardmäßig deaktiviert) oder mit `car.evcc.currents: [sensor.l1, sensor.l2, sensor.l3]`.
Motor, Stecker und Ladeleistung gibt ev_assistant ab Version 0.99.34 weiter. Ohne evcc lässt sich der PV-Anteil
über Netzbezug und Hausverbrauch (Leistung) berechnen: `energy.grid_import`, `energy.home`.
Mit `debug: true` zeigt die Browser-Konsole, welche Quelle für welchen Wert verwendet wird.

### Mehrere Autos

Sind in ev_assistant mehrere Fahrzeuge eingerichtet, erscheint neben dem Namen ein Pfeil zur Auswahl. Alle Werte
(ev_assistant-Sensoren, evcc-Live-Werte, Fahrtenbuch, Ladungen, Verlauf) kommen dann vom gewählten Auto. Die Auswahl
merkt sich der Browser; `car.ev_assistant_entry` legt das Auto beim ersten Öffnen fest. Eigene Werte je Auto:

```yaml
type: custom:mg-car-dashboard
vehicles:
  "Citroën ë-C3": { image: /local/c3.png }
  "Renault Zoe":  { image: /local/zoe.png, evcc_loadpoint: carport }
```

Schlüssel ist der Fahrzeugname aus ev_assistant oder die `config_entry_id`; erlaubt sind alle `car`-Optionen
(und `energy`). `evcc_loadpoint` wählt bei mehreren Ladepunkten das Ladeziel-Select der evcc-Integration.

### Unterseite „Profil & Analyse“

Oben rechts schaltet die Karte zwischen **Übersicht**, **Profil & Analyse** und **Einstellungen** um (die Auswahl merkt sich der Browser).
Die Unterseite zeigt die Daten aus den ev_assistant-Reitern „Nutzungsprofil“ und „Analyse“:

| Bereich | Inhalt (Quelle: ev_assistant) |
|---|---|
| Deine Woche | je Wochentag Ø Bedarf des Autos (ca. km, sonst kWh), Hausverbrauch, Steckdauer und typische Abfahrt; heute und morgen markiert |
| Morgen | Ladeempfehlung, verfügbar / Bedarf / Puffer (per Auswahl 0–300 km einstellbar) / PV fürs Auto (Prognose minus Hausverbrauch laut Hausprofil; km, kWh daneben) und wie weit der Akku laut Profil reicht |
| Analyse | Kacheln für Batterie, Verbrauch bei aktueller Temperatur, Kosten, Autarkie, Ladeorte, Schnellladen und Top-Anbieter – antippen öffnet die Details |
| Netz-Zuschuss | Skala von Einspeisevergütung bis Netzpreis mit Schwelle und aktuellem Mischpreis (Tarife aus evcc) |

Fehlende Werte blendet die Karte aus bzw. zeigt „–“ (z. B. ohne Hauszähler oder Außentemperatur in ev_assistant).

### Unterseite „Laden & Kosten“

Zeitraum oben rechts wie im Energiedashboard: **Tag · Woche · Monat · Jahr · Gesamt**, mit ‹ › zum Blättern.
Alle Werte rechnet die Karte aus den Heimladungen (evcc-Ladelogbuch), den Fremdladungen und dem Fahrtenbuch von ev_assistant.

| Bereich | Inhalt |
|---|---|
| Geladen | kWh je Stunde/Tag/Monat, gestapelt nach Heim PV, Heim Netz, Fremd AC, Fremd DC; Energie, Kosten (mit Vergleich zum Vorzeitraum), Ø Preis, Strecke, Verbrauch, €/100 km |
| Ladungen im Zeitraum | alle Ladungen des Zeitraums in einer scrollbaren Liste (lädt beim Scrollen nach), sortierbar nach Datum, Menge oder Kosten; Fremdladungen antippen zum Bearbeiten |
| Aufschlüsselung | kWh, € und ct/kWh je Quelle plus anteilige Ladekarten-Grundgebühren (Heim-PV mit der Einspeisevergütung bewertet) |
| Vergleich Verbrenner | gespart im Zeitraum und seit Einrichtung, Elektro vs. Verbrenner, €/100 km, Liter, CO₂ – Verbrennerkosten je km aus dem ev_assistant-Vergleich seit Einrichtung |

### Unterseite „Einstellungen“

Die dritte Seite bündelt die ev_assistant-Reiter „Wartung“, „Ladekarten“ und „Einstellungen“. Anlegen und Bearbeiten
laufen in einem Popup über die Dienste von ev_assistant (für das gerade gewählte Fahrzeug):

| Bereich | Inhalt / Aktionen |
|---|---|
| Wartung | Wartungspunkte mit Countdown bis zum nächsten Termin (Zeit und km) und Fortschrittsbalken – gelb, ab 500 km / 4 Wochen orange, ab 100 km / 1 Woche rot; erledigte Termine grün; abweichendes Erstintervall (ev_assistant ab 0.99.57); anlegen (mit Vorlagen HU und Inspektion), bearbeiten, als erledigt markieren, löschen |
| Ladekarten | aufgelaufene Grundgebühren gesamt, je Karte aktuelle Gebühr, Zeitraum und Preisstufen; anlegen, bearbeiten, Preisänderung hinzufügen/entfernen, löschen |
| Fahrzeugbild | Bild hochladen (JPEG/PNG/WebP bis 10 MB) oder entfernen |
| Urlaub | Urlaubsmodus ein/aus (schaltet die Urlaubs-Entität aus den ev_assistant-Optionen), rückwirkend ab einem Zeitpunkt |
| Daten | Fahrtenbuch als CSV exportieren, Fahrten importieren (CSV/JSON mit Vorschau), Backup erstellen (Download), Backup wiederherstellen (mit Bestätigung „WIEDERHERSTELLEN“), Kennzahlen seit Einrichtung zurücksetzen |
| Ereignisprotokoll | die letzten ca. 14 Tage mit Filter nach Kategorie und Suche; als Textdatei herunterladen |

Die „Sichtbare Tabs“-Einstellung betrifft nur das ev_assistant-Panel und fehlt deshalb hier.

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
  car_power: sensor.shelly_wallbox_power   # nur nötig mit ev_assistant vor 0.99.34
car:
  image: /local/auto.png
  status: binary_sensor.e_c3_motor
  cable: binary_sensor.warp3_2ee3_cable
  # optional: evcc-Modus über die evcc-Integration statt über ev_assistant
  # mode: select.evcc_warp3_mode
  # always: select.evcc_warp3_always_charge
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
| `language` | Sprache der Karte: `de` oder `en`. Ohne Angabe die Sprache von Home Assistant (Englisch bei `en…`, sonst Deutsch). Datum und Zeit folgen der Sprache, Zahlen zusätzlich dem Zahlenformat im HA-Profil |
| `fit_screen` | Seite an die Fensterhöhe anpassen (Desktop) |
| `debug` | Diagnose-Meldungen in der Browser-Konsole |
| `energy.car_power` / `grid_import` / `home` | Ladeleistung, Netzbezug, Hausverbrauch für den Verlauf (Aufteilung Netz/PV) |
| `car.name`, `car.image` | Name und Bild des Autos (Bild ohne Angabe: Fahrzeugbild aus ev_assistant) |
| `car.soc`, `range`, `status`, `cable` | Ladestand, Reichweite, Fahrstatus, Ladekabel (Standard: aus ev_assistant) |
| `car.status_on` / `status_off` | Text für fahrend / geparkt |
| `car.limit`, `mode`, `always`, `manual_mode` | Ladestrom, evcc-Lademodus, „Immer laden“, eigene Vorgabe |
| `car.evcc.*` | Ladepunkt-Werte (Standard: evcc-Live-Werte aus ev_assistant, oder eigene Sensoren) |
| `car.evcc_vehicle` | nur Ladungen dieses evcc-Fahrzeugs in „Alle Ladungen“ |
| `car.ev_assistant` | einzelne ev_assistant-Entitäten fest vorgeben (sonst automatisch gefunden) |
| `car.ev_assistant_entry` | config_entry_id von ev_assistant (sonst automatisch) |
| `car.stats` | Kennzahlen in der Auto-Kachel (ev_assistant-Schlüssel oder Entity-IDs) |
| `car.leasing` | Leasing-Kachel: Sensor „km vor Rücklauf“ aus ev_assistant (Standard), eigene Entity-ID oder `""` = aus. Ohne Leasing-Vertrag in ev_assistant automatisch ausgeblendet |
| `car.usage` | Nutzungs-Kachel (Standard `true`). Mit Leasing-Vertrag wird im Kachelkopf zwischen Leasing und Nutzung umgeschaltet, sonst nur die Nutzung gezeigt. `false` = aus |
| `car.trips` | Fahrtenbuch-Sensor (Attribut `trips`) |
| `car.trips_visible` | Fahrten in der Kachel, wenn die Seite nicht an die Fensterhöhe angepasst ist (sonst so viele, wie hineinpassen) |
| `car.trips_max` | höchstens so viele Fahrten berücksichtigen (Standard 0 = alle) |
| `car.list_page` | „Alle Fahrten“ / „Alle Ladungen“: so viele Einträge zuerst, beim Scrollen jeweils weitere (Standard 30) |
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
| 3.5.4  | mg-car-dashboard.js (eigenständig) |
| 3.5.28 | Auswahllisten einheitlich (Ladeplan-Ziel, Puffer und PV auf Profil & Analyse, Protokoll-Kategorie), Datumsfelder öffnen den Kalender |
| 3.5.29 | Englische Oberfläche (Sprache aus Home Assistant oder `language`), Schrift „Outfit“ in der Karte enthalten statt von Google geladen |
| 3.5.30 | Profil & Analyse: Fenster „Autarkie“ mit Autarkiegrad und Ersparnis beim Heimladen gegenüber reinem Netzstrom |
| 3.5.31 | Analyse rechnet Autarkie, Ladeorte, Kosten, AC/DC und Anbieter aus allen Ladungen (evcc-Ladelogbuch + Fremdladungen) – dieselben Werte wie „Laden & Kosten“ |
| 3.5.32 | Screenshots in der Beschreibung, englische Kachel „Mode“ statt „Charging mode“ |
| 3.5.27 | Lademanagement: PV-Anteil wieder orange, Puffer grün |
| 3.5.26 | Übersicht ohne Scrollbalken rechts, PV-Anteil/Puffer mit Auswahl wie Ladeziel, Laden & Kosten bündig |
| 3.5.25 | Lademanagement: Automatik · Manuell · Vollladung / Ladeziel · PV-Anteil · Puffer, „Plan setzen“ mittig |
| 3.5.24 | Laden & Kosten: Sortierung in der Kopfzeile der Ladungsliste |
| 3.5.23 | Laden & Kosten: Ladungen nach Datum, Menge oder Kosten sortieren |
| 3.5.22 | Laden & Kosten: alle Ladungen des Zeitraums in einer scrollbaren Liste (lädt beim Scrollen nach) |
| 3.5.21 | Einstellungen: Urlaubsmodus, Fahrtenbuch als CSV exportieren und Fahrten importieren |
| 3.5.20 | Ladeplan überarbeitet (Auswahl für Ziel-% / Ziel-km, aktiver Plan wird angezeigt), Seiten-Tabs mittig |
| 3.5.19 | Neue Unterseite „Laden & Kosten“: Ladeaufschlüsselung nach Zeitraum, Verbrenner-Vergleich |
| 3.5.19 | Ladeplan: Löschen wird sofort angezeigt |
| 3.5.18 | Ladeplan: „Plan setzen“ oben neben der Überschrift |
| 3.5.17 | Ladeplan: Ziel wahlweise in % (direkt an evcc) oder km (über ev_assistant) |
| 3.5.16 | Wartung: verständliche Hinweise zum Erstintervall; Kachel nennt den Grund, wenn keine Fälligkeit berechenbar ist |
| 3.5.15 | Wartung: Countdown bis zum nächsten Termin, Farben gelb/orange/rot, erledigte grün, abweichendes Erstintervall |
| 3.5.14 | Fahrten und Fremdladungen bearbeiten/löschen, erkannte Ladungen/Fahrten auf der Hauptkachel bestätigen |
| 3.5.13 | iOS: Seite springt nicht mehr nach oben (Abschnitte nur bei Änderung neu zeichnen, #20) |
| 3.5.12 | Lademanagement: Auto + Modus-Auswahl, „Laden ab PV-Anteil“ einstellbar (ev_assistant ab 0.99.57); evcc-Zeile und Überschrift entfernt |
| 3.5.11 | Laden: Ladeende aus evcc oben beim Laden; Lademanagement ohne „Aus“ |
| 3.5.10 | Laden-Kachel: Ø Leistung in der Zeile statt als Kachel, SoC-Kachel entfernt |
| 3.5.9  | Ladungen: Ø Ladeleistung und Start-/End-SoC bei der letzten Ladung und in „Alle Ladungen“ |
| 3.5.8  | Einstellungen: Ereignisprotokoll links unten |
| 3.5.7  | Unterseite „Einstellungen“ (Wartung, Ladekarten, Fahrzeugbild, Daten, Ereignisprotokoll) |
| 3.5.6  | Profil & Analyse: PV morgen abzüglich Hausverbrauch, Puffer (0–300 km) direkt einstellbar |
| 3.5.5  | Unterseite „Profil & Analyse“ |

## Übersetzungen

Die Texte der Auto-Karte stehen auf Deutsch im Code (`T("…")`), die englischen Entsprechungen im Katalog `I18N`
am Ende von `mg-car-dashboard.js`. Neue Texte dort ergänzen; die Prüfung meldet fehlende oder nicht mehr verwendete
Einträge und unterschiedliche Platzhalter:

```sh
node scripts/check-i18n.mjs
```

Texte aus ev_assistant (z. B. Kategorien im Ereignisprotokoll, Modusnamen der Wallbox) bleiben unübersetzt.

## Schrift

Die Schrift [Outfit](https://github.com/Outfitio/Outfit-Fonts) (SIL Open Font License 1.1) ist in `mg-car-dashboard.js`
eingebettet (lateinischer Zeichensatz, Variable Font). Lizenztext: [`dist/OFL-Outfit.txt`](dist/OFL-Outfit.txt). Die Karte lädt nichts von Google oder anderen Servern nach.
