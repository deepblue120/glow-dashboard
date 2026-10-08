/*
 * mg-school-card.js
 * Ablage:    /config/www/glow-dashboard/mg-school-card.js
 * Ressource: /local/glow-dashboard/mg-school-card.js?v=4  (Typ: JavaScript)
 * YAML:      type: custom:mg-school-card
 */

window.customCards = window.customCards || [];
const OFFLINE = ["unavailable", "unknown"];
const VERSION = "2.34.0";
const FONT_URL = "https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap";

const WD = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];
const WD_LONG = ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"];
const MON = ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"];
const MON_LONG = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];

const COND = {
  "clear-night":     { t: "Klar",            i: "mdi:weather-night",          c: "#c4b5fd" },
  cloudy:            { t: "Bewölkt",         i: "mdi:weather-cloudy",         c: "#e5e7eb" },
  fog:               { t: "Nebel",           i: "mdi:weather-fog",            c: "#cbd5e1" },
  hail:              { t: "Hagel",           i: "mdi:weather-hail",           c: "#93c5fd" },
  lightning:         { t: "Gewitter",        i: "mdi:weather-lightning",      c: "#fcd34d" },
  "lightning-rainy": { t: "Gewitter",        i: "mdi:weather-lightning-rainy",c: "#fcd34d" },
  partlycloudy:      { t: "Teils bewölkt",   i: "mdi:weather-partly-cloudy",  c: "#f7b733" },
  pouring:           { t: "Starkregen",      i: "mdi:weather-pouring",        c: "#60a5fa" },
  rainy:             { t: "Regen",           i: "mdi:weather-rainy",          c: "#60a5fa" },
  snowy:             { t: "Schnee",          i: "mdi:weather-snowy",          c: "#e0f2fe" },
  "snowy-rainy":     { t: "Schneeregen",     i: "mdi:weather-snowy-rainy",    c: "#bae6fd" },
  sunny:             { t: "Sonnig",          i: "mdi:weather-sunny",          c: "#f7b733" },
  windy:             { t: "Windig",          i: "mdi:weather-windy",          c: "#cbd5e1" },
  "windy-variant":   { t: "Windig",          i: "mdi:weather-windy-variant",  c: "#cbd5e1" },
  exceptional:       { t: "Unwetter",        i: "mdi:alert-circle-outline",   c: "#f87171" },
};

const DEFAULT_CONFIG = {
  show_date: true,
  fit_screen: true,   // Desktop/Laptop: Dashboard passt sich der Fensterhöhe an (kein Scrollen der Seite)
  energy: {
    title: "Energie",
    view: "tabs",           // "tabs" = umschaltbar Leistung/Heute, "both" = beide Grafiken untereinander

    // --- Leistung (live, W/kW) ---
    solar: "sensor.strom_pv_leistung_gesamt_inkl_bkw",
    grid_import: "sensor.alpha_ess_netzbezug_leistung_vom_netz",
    grid_export: "sensor.strom_pv_einspeisung_einspeisung_ins_netz_inkl_bkw",
    battery_charge: "sensor.speicher_leistung_in_speicher",
    battery_discharge: "sensor.speicher_leistung_aus_speicher",
    battery_soc: "sensor.speicher_soc_in_speicher",
    home: "sensor.strom_leistung_haus_gesamt_inkl_bkw_und_marstek",
    car_power: "sensor.shelly_wallbox_power",
    car_soc: "sensor.e_c3_batterie",
    autarky_now: "sensor.strom_pv_autarkiegrad_aktuell",   // Autarkie jetzt (Kopfzeile "Leistung")

    // --- Energie heute (kWh) ---
    autarky: "sensor.strom_pv_autarkiegrad_heute",         // Autarkie heute (Solar-Kreis + Kopfzeile "Heute")
    solar_today: "sensor.alpha_ess_pv_erzeugte_energie_taglich",
    used_today: "sensor.strom_verbrauch_haus_gesamt_inkl_bkw_taglich",
    grid_today: "sensor.alpha_ess_netzbezug_gesamtenergieverbrauch_aus_dem_netz_taglich",
    export_today: "sensor.alpha_ess_einspeisung_gesamtenergieeinspeisung_ins_netz_taglich",
    battery_in_today: "sensor.photovoltaik_speicher_energie_in_speicher_taglich",
    battery_out_today: "sensor.photovoltaik_speicher_energie_aus_speicher_taglich",
    car_today: "sensor.shelly_wallbox_energie_taglich",

    // --- Preise ---
    price: 0.2841,          // €/kWh Bezug
    price_export: 0.082,    // €/kWh Einspeisevergütung
    currency: "€",
  },
  weather: { entity: "weather.forecast_home_2", sun: "sun.sun" },
  quick_actions: [
    { name: "Licht", count: "sensor.lichter_an",
      text_one: "Licht an", text_many: "Lichter an", text_zero: "Alle aus",
      icon: "mdi:lightbulb-off", icon_on: "mdi:lightbulb-on",
      color: "#fb923c", color_zero: "#8b91a1",
      navigate: "/dashboard-laptop/licht" },
    { name: "Klima", icon: "mdi:air-conditioner", color: "#38bdf8",
      heat: "sensor.heizung_anzahl_heizen", cool: "sensor.klima_anzahl_kuhlen",
      heat_name: "Heizung", heat_icon: "mdi:heat-wave", heat_color: "#f87171",
      navigate: "/dashboard-laptop/heizung" },
    { name: "Batterien", icon: "mdi:battery", entity: "input_boolean.low_battery", color: "#fb923c" },
    { name: "Bluetooth", match: "uberfallig", match_domain: "binary_sensor",   // zählt alle binary_sensor.*uberfallig* mit Zustand "on"
      text_one: "überfällig", text_many: "überfällig", text_zero: "Alle OK",
      icon: "mdi:wifi", icon_on: "mdi:wifi-alert", color: "#f87171", color_zero: "#34d399",
      dom_event: {                       // wie tap_action: fire-dom-event (browser_mod-Popup)
        browser_mod: {
          service: "browser_mod.popup",
          data: {
            title: "Sensoren",
            content: {
              type: "custom:battery-state-card",
              title: "",
              filter: { include: [{ name: "entity_id", value: "binary_sensor.*uberfallig*" }] },
              sort: { by: "state" },
              icon: "{state|equals(off,mdi:check-circle)|equals(on,mdi:alert-circle)}",
              secondary_info: "{attributes.last_seen|reltime()}",
              state_map: [
                { from: "off", to: 100, display: "OK" },
                { from: "on", to: 0, display: "Problem" },
              ],
              colors: { steps: [{ value: 0, color: "firebrick" }, { value: 100, color: "seagreen" }] },
              collapse: [{ name: "OK ({count})", icon: "mdi:check-circle", filter: [{ name: "state", value: "off" }] }],
            },
          },
        },
      } },
    { name: "Haustür", lock: "lock.nuki_haustur", contact: "binary_sensor.haustur_window" },
    { name: "Fenster", windows_open: "sensor.fenster_offen_ohne_kipp", windows_tilt: "sensor.fenster_kipp_anzahl",
      navigate: "#fenster" },
    { name: "Rollläden", count: "sensor.rollladen_offen_anzahl",
      text_one: "auf", text_many: "auf", text_zero: "Alle zu",
      icon: "mdi:window-shutter", icon_on: "mdi:window-shutter-open",
      color: "#60a5fa", color_zero: "#34d399",
      navigate: "/dashboard-laptop/rollladen" },
    { name: "Garage", status: "sensor.garage_status",
      toggle: "switch.garagentor_switch_0",   // Tippen schaltet das Tor
      confirm: false,                         // true = vor dem Schalten nachfragen
      states: {
        closed:  { text: "Tor zu",       icon: "mdi:garage-variant-lock",  color: "#34d399", calm: true },
        open:    { text: "Tor auf",      icon: "mdi:garage-open-variant",  color: "#f87171" },
        opening: { text: "Tor öffnet",   icon: "mdi:arrow-up",             color: "#eab308", pulse: true },
        closing: { text: "Tor schließt", icon: "mdi:arrow-down",           color: "#eab308", pulse: true },
        default: { text: "Nicht erreichbar", icon: "mdi:garage-alert-variant", color: "#f87171" },
      } },
  ],
  rooms: [
    { tab: "Wohnen", rooms: [
      { name: "Küche", icon: "mdi:silverware-fork-knife", light: "light.kueche", temp: "sensor.kueche_temperatur" },
      { name: "Wohnzimmer", icon: "mdi:television", light: "light.wohnzimmer", status: "media_player.fernseher", status_on: "TV an" },
      { name: "Esszimmer", icon: "mdi:table-chair", light: "light.esszimmer", temp: "sensor.esszimmer_temperatur" },
      { name: "Büro", icon: "mdi:desk", light: "light.buero", temp: "sensor.buero_temperatur" },
      { name: "Hauswirtschaft", icon: "mdi:washing-machine", light: "light.hauswirtschaft" },
      { name: "Garage", icon: "mdi:garage-variant", status: "cover.garagentor", status_on: "Tor offen", status_off: "Tor geschlossen" },
    ] },
    { tab: "Schlafen & Bad", rooms: [
      { name: "Schlafzimmer", icon: "mdi:bed-king-outline", light: "light.schlafzimmer", temp: "sensor.schlafzimmer_temperatur" },
      { name: "Bad", icon: "mdi:shower", light: "light.bad", temp: "sensor.bad_temperatur" },
      { name: "Kinderzimmer", icon: "mdi:teddy-bear", light: "light.kinderzimmer", temp: "sensor.kinderzimmer_temperatur" },
    ] },
  ],
  calendar: {
    entities: [
      { entity: "calendar.familie",                   name: "Familie", color: "#38bdf8" },
      { entity: "calendar.marcogerke78_gmail_com",    name: "Marco",   color: "#f7b733" },
      { entity: "calendar.manuelagerke79_gmail_com",  name: "Manuela", color: "#f472b6" },
      { entity: "calendar.lena_gerke",                name: "Lena",    color: "#a78bfa" },
      { entity: "calendar.tom_gerke",                 name: "Tom",     color: "#34d399" },
      { entity: "calendar.msv_duisburg",              name: "MSV",     color: "#60a5fa" },
    ],
    highlight: "calendar.msv_duisburg",
    days: 14,
    max: 3,        // so viele Termine werden insgesamt geladen/angezeigt
    visible: 3,    // so viele sind ohne Scrollen sichtbar, der Rest ist scrollbar
  },
  quick_title: "Kontrolle",  // Überschrift der oberen Kacheln
  actions: {                 // Schnellzugriff (mittlere Spalte unten) – auf jedem Gerät per Stift anpassbar
    title: "Schnellzugriff",
    entities: [
      { entity: "cover.rollladen_alle", name: "Rollos" },
      { entity: "cover.rollladen_eg", name: "Rollo EG" },
      { entity: "cover.rollladen_1_og", name: "Rollo OG" },
      { entity: "cover.rollladen_2_og", name: "Rollo DG" },
      { entity: "cover.markise", name: "Markise", icon: "mdi:storefront-outline" },
      { entity: "light.licht_esszimmer_tisch", name: "Esstisch", icon: "mdi:table-furniture" },
      { entity: "light.licht_ambiente_wohnzimmer", name: "Ambiente", icon: "mdi:led-strip-variant" },
      { entity: "light.licht_terrasse_switch_0", name: "Terrasse", icon: "mdi:bulkhead-light" },
      { entity: "light.licht_garage_switch_0", name: "Garage", icon: "mdi:led-strip" },
      { entity: "switch.gartenpumpe_switch_0", name: "Pumpe", icon: "mdi:water-pump" },
    ],
  },
  school: {},                // Schulkarte unter dem Kalender (false = ausblenden), Einstellungen wie bei custom:mg-school-card
  car: {
    name: "Citroën ë-C3",
    soc: "sensor.e_c3_batterie",
    range: "sensor.e_c3_reichweite",
    status: "binary_sensor.e_c3_motor",
    status_on: "Motor an",          // Text bei status = on
    status_off: "Geparkt",          // Text bei status = off
    cable: "binary_sensor.warp3_2ee3_cable",   // on = eingesteckt, off = abgesteckt
    limit: "number.wallbox_ladestrom",
    mode: "select.evcc_warp3_mode",                 // EVCC-Lademodus: Aus / Smart / Schnell
    always: "select.evcc_warp3_always_charge",      // nur bei Smart: Aus / Ein / Einmalig
    // Zuordnung der Select-Werte (Groß-/Kleinschreibung egal, mehrere Schreibweisen möglich)
    mode_styles: {
      "aus|off":           { label: "Aus",     icon: "mdi:power-off",      color: "#8b91a1" },
      "smart|pv|minpv":    { label: "Smart",   icon: "mdi:solar-power",    color: "#34d399" },
      "schnell|fast|now":  { label: "Schnell", icon: "mdi:lightning-bolt", color: "#fb923c" },
    },
    always_when: "smart|pv|minpv",                  // bei diesen Modi erscheint "Immer laden"
    always_label: "Immer laden",
    always_icon_only: true,                         // Chip zeigt nur das Symbol
    always_styles: {
      "aus|off|false":     { label: "Aus",      icon: "mdi:close",    color: "#8b91a1" },
      "ein|on|true":       { label: "Immer",    icon: "mdi:infinity", color: "#38bdf8" },
      "einmalig|once":     { label: "Einmalig", glyph: "1×",          color: "#a78bfa" },
    },
    image: "/local/auto.png",
    // --- evcc (Ladepunkt) ---
    evcc: {
      charging: "binary_sensor.evcc_warp3_charging",
      connected: "binary_sensor.evcc_warp3_connected",
      power: "sensor.evcc_warp3_charge_power",
      session_energy: "sensor.evcc_warp3_session_energy",
      session_solar: "sensor.evcc_warp3_session_solar_percentage",
      session_price: "sensor.evcc_warp3_session_price",
      remaining: "sensor.evcc_warp3_charge_remaining_duration",
      duration: "sensor.evcc_warp3_charge_duration",
      finish: "sensor.e_c3_batterie_ladezeit_ende",
      limit_soc: "select.evcc_warp3_limit_soc",                              // z. B. number.evcc_warp3_limit_soc (Ladeziel, Markierung im Balken)
      min_soc: "input_number.evcc_auto_soc_schwelle_minpv",   // Markierung „bis hier immer laden“
      solar_total: "sensor.evcc_stat_total_solar_percentage",
      last_charge: "sensor.e_c3_letzte_ladung",
    },
    // --- ev_assistant: "auto" sucht die Entitäten selbst (Integration ev_assistant), sonst { schluessel: entity_id } ---
    ev_assistant: "auto",
    stats: ["vehicle_avg_consumption", "odo_month_km", "cost_month", "savings"],   // Kennzahlen auf der Auto-Seite (oben)
    manual_mode: "input_select.evcc_lademodus_manuell",   // eigene Vorgabe (automatisch / manuell), leer lassen wenn nicht vorhanden
    navigate: "auto",          // Tippen auf die Auto-Karte der Startseite öffnet diese Ansicht (relativ zum Dashboard oder /pfad)
    trips: "sensor.e_c3_fahrtenbuch_2",   // Fahrtenbuch (Attribut "trips")
    trips_max: 25,
    history_hours: 24,                 // Verlauf: Zeitraum bis jetzt (Stunden), per Knopf umschaltbar
    history_ranges: [6, 24, 72, 168, 720],   // Auswahl im Verlauf (Stunden)
    bars_from_hours: 24,               // ab diesem Zeitraum: geladene kWh als Balken (Netz/PV), bis 7 T stündlich, darüber täglich
    split_grid: null,                  // Netzbezug (Leistung) für die Aufteilung, Standard: energy.grid_import
    split_home: null,                  // Hausverbrauch inkl. Auto (Leistung), Standard: energy.home
  },
};

const QA_ICON = { light: "mdi:lightbulb", switch: "mdi:power-socket-eu", cover: "mdi:window-shutter", lock: "mdi:lock", fan: "mdi:fan",
  input_boolean: "mdi:toggle-switch-outline", script: "mdi:script-text-play", scene: "mdi:palette", climate: "mdi:thermostat",
  media_player: "mdi:television", vacuum: "mdi:robot-vacuum", button: "mdi:gesture-tap-button" };
const QA_COLOR = { light: "#f7b733", switch: "#fb923c", cover: "#60a5fa", lock: "#34d399", fan: "#38bdf8", climate: "#f87171",
  media_player: "#a78bfa", script: "#34d399", scene: "#a78bfa", vacuum: "#38bdf8" };

const OFFLINE_HD = ["unavailable", "unknown", "none", ""];

/* ---------------- Helfer ---------------- */
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const de = (v, d = 1) => Number(v).toLocaleString("de-DE", { minimumFractionDigits: d, maximumFractionDigits: d });
const pad = (n) => String(n).padStart(2, "0");
const isObj = (o) => o && typeof o === "object" && !Array.isArray(o);
const merge = (a, b) => {
  const out = { ...a };
  for (const k of Object.keys(b || {})) out[k] = isObj(a?.[k]) && isObj(b[k]) ? merge(a[k], b[k]) : b[k];
  return out;
};
const icon = (i, cls = "") => `<ha-icon class="${cls}" icon="${esc(i)}"></ha-icon>`;

const STYLE = `
:host{
  --bg:#0b0d12; --panel:#14171e; --panel2:#11141a; --line:rgba(255,255,255,.065);
  --tile:rgba(255,255,255,.032); --tileb:rgba(255,255,255,.07);
  --text:#f3f5f9; --muted:#8b91a1; --dim:#5d6373;
  --e-grid-in:var(--energy-grid-consumption-color,#488fc2); --e-grid-out:var(--energy-grid-return-color,#8353d1);
  --e-solar:var(--energy-solar-color,#ff9800); --e-bat-in:var(--energy-battery-in-color,#f06292);
  --e-bat-out:var(--energy-battery-out-color,#4db6ac); --e-home:#38bdf8; --e-car:#38bdf8;
  --gold:#f7b733; --cyan:#38bdf8; --green:#34d399; --violet:#a78bfa; --orange:#fb923c; --red:#f87171; --blue:#60a5fa;
  display:block; container-type:inline-size;
  font-family:'Outfit','Plus Jakarta Sans','Segoe UI',system-ui,sans-serif; color:var(--text);
  -webkit-font-smoothing:antialiased;
}
*{box-sizing:border-box}
button{font:inherit;color:inherit;background:none;border:0;padding:0;cursor:pointer;text-align:left}
button:focus-visible{outline:2px solid var(--cyan);outline-offset:2px}
ha-icon{--mdc-icon-size:22px;display:inline-flex}
.wrap{background:var(--bg);padding:18px 22px 24px;min-height:100%;position:relative}
.date{color:var(--muted);font-size:16px;font-weight:500;margin:0 4px 14px}
.grid{display:grid;grid-template-columns:1fr 1.32fr .96fr;gap:20px;align-items:stretch}
.col{display:flex;flex-direction:column;gap:20px;min-width:0}
.grow{flex:1}
.panel{background:linear-gradient(180deg,#161920,#12151b);border:1px solid var(--line);border-radius:30px;padding:20px 22px;position:relative;overflow:hidden}
.panel.energy{background:radial-gradient(120% 55% at 50% 0%,rgba(247,183,51,.17),transparent 62%),linear-gradient(180deg,#171a20,#12151b)}
.hd{display:flex;align-items:center;gap:12px;min-height:40px;margin-bottom:14px}
.ttl{font-size:15px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:var(--muted);white-space:nowrap}
.lbl{margin-left:auto;font-size:15px;color:rgba(243,245,249,.78);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.lbl.warn{color:var(--orange);font-weight:600}
.arrow{width:42px;height:42px;border-radius:14px;background:rgba(255,255,255,.05);border:1px solid var(--line);display:grid;place-items:center;color:var(--text);flex:none}
.hd .lbl:empty + .arrow{margin-left:auto}
.empty{color:var(--dim);font-size:14px;padding:12px 2px}

/* Energiefluss */
.flow{width:100%;height:auto;display:block;overflow:visible;margin-top:-6px}
.flow .node{cursor:pointer}
.flow .core{fill:#12151b}
.flow .ring{fill:none;stroke:rgba(255,255,255,.16);stroke-width:2.5;transition:stroke .4s}
.flow .ni{color:var(--muted);display:flex;justify-content:center}
.flow .ni ha-icon{--mdc-icon-size:18px}
.flow .nv{fill:var(--text);font-size:21px;font-weight:700;text-anchor:middle}
.flow .nv.big{font-size:27px}
.flow .nv.sm{font-size:19px}
.flow .nu{font-size:12px;font-weight:500;fill:var(--muted)}
.flow .nl{fill:var(--muted);font-size:11px;letter-spacing:.14em;text-anchor:middle;font-weight:600}
.flow .lab{fill:var(--muted);font-size:12px;letter-spacing:.12em;font-weight:600;text-anchor:middle}
.flow .sub{fill:var(--muted);font-size:14.5px;font-weight:500;text-anchor:middle}
.flow .sub.strong{font-weight:700}
.flow .start{text-anchor:start}
/* HA-Energiefarben (aus dem Theme, sonst HA-Standard) */
.flow .solar{--c:var(--e-solar)}
.flow .grid{--c:var(--e-grid-in)}
.flow .grid.exp{--c:var(--e-grid-out)}
.flow .bat{--c:var(--e-bat-in)}
.flow .bat.dis{--c:var(--e-bat-out)}
.flow .home{--c:var(--e-home)}
.flow .car{--c:var(--e-car)}
.st-solar{stop-color:var(--e-solar)}
.st-home{stop-color:var(--e-home)}
.node .glow{pointer-events:none;transition:opacity .4s}
.node.solar:not(.on) .glow{opacity:0}
.flow .sub.on{fill:var(--c);font-weight:600}
.node.on .ring{stroke:var(--c);stroke-width:3.5;filter:drop-shadow(0 0 9px color-mix(in srgb,var(--c) 70%,transparent))}
.node.on .ni{color:var(--c)}
.node.solar.on .ring{stroke-width:4}
.node.home .ring{stroke:var(--c);stroke-width:4.5;filter:drop-shadow(0 0 12px color-mix(in srgb,var(--c) 70%,transparent))}
.node.home .ni{color:color-mix(in srgb,var(--c) 45%,#fff)}
.ln{stroke:rgba(255,255,255,.12);stroke-width:2.5;stroke-linecap:round}
.ln.on{stroke:var(--c);stroke-width:3.5;stroke-dasharray:7 8;animation:flow 1.1s linear infinite}
.ln.on.rev{animation-direction:reverse}
@keyframes flow{from{stroke-dashoffset:30}to{stroke-dashoffset:0}}

/* Umschalter Leistung / Heute */
.eseg{display:grid;grid-auto-flow:column;grid-auto-columns:1fr;background:rgba(255,255,255,.03);border:1px solid var(--line);border-radius:16px;padding:4px;margin:-4px 0 6px}
.eopt{height:36px;border-radius:12px;display:flex;align-items:center;justify-content:center;gap:7px;font-size:14.5px;font-weight:600;color:var(--muted)}
.eopt ha-icon{--mdc-icon-size:16px}
.eopt.sel{background:rgba(255,255,255,.07);color:var(--text)}
.ecap{display:none;font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:var(--dim);font-weight:600;margin:6px 2px 0}
.energy[data-view="power"] .ev-e,.energy[data-view="energy"] .ev-p{display:none}
.energy[data-view="both"] .eseg{display:none}
.energy[data-view="both"] .ecap{display:block}
.energy[data-view="both"] .ev-e{border-top:1px solid var(--line);margin-top:6px;padding-top:6px}
.stats{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-top:10px}
.stat{background:var(--tile);border:1px solid var(--tileb);border-radius:18px;padding:11px 10px;display:flex;flex-direction:column;gap:2px;cursor:pointer;min-width:0}
.sn{font-size:12px;letter-spacing:.1em;text-transform:uppercase;color:var(--muted);font-weight:600}
.sv{font-size:21px;font-weight:700;white-space:nowrap}
.sv small{font-size:12px;color:var(--muted);font-weight:500;margin-left:2px}
.sc{font-size:12.5px;color:var(--gold);font-weight:600;line-height:1.2}
.sc.earn{color:var(--green)}
.sc.car{color:var(--cyan);display:inline-flex;align-items:center;gap:4px}
.sc.car ha-icon{--mdc-icon-size:14px}

/* Wetter */
.wnow{display:flex;align-items:flex-start;gap:18px;margin:4px 0 18px}
.wicon{--mdc-icon-size:64px;margin-top:8px;filter:drop-shadow(0 0 14px rgba(247,183,51,.35))}
.wmain{flex:1}
.wtemp{font-size:62px;font-weight:700;line-height:1;letter-spacing:-.02em}
.wtemp sup{font-size:22px;font-weight:500;vertical-align:top;margin-left:2px}
.wcond{font-size:20px;font-weight:600;margin-top:6px}
.whl{font-size:16px;color:var(--muted);margin-top:2px}
.pill{background:rgba(255,255,255,.05);border:1px solid var(--line);border-radius:14px;padding:7px 13px;font-size:14px;font-weight:600;white-space:nowrap;flex:none;display:inline-flex;align-items:center;gap:7px;font-variant-numeric:tabular-nums}
.pill ha-icon{--mdc-icon-size:18px;color:var(--gold)}
.wsun{display:flex;flex-direction:row;gap:6px;align-items:center;flex:none;margin-left:auto}
.wsun .pill{padding:6px 10px;gap:5px}
.wrap.compact .pill ha-icon{--mdc-icon-size:15px}
.wmain{min-width:0}
.fc{display:grid;grid-template-columns:repeat(5,1fr);gap:10px}
.fday{background:var(--tile);border:1px solid var(--tileb);border-radius:18px;padding:12px 4px 10px;display:flex;flex-direction:column;align-items:center;gap:4px;min-width:0}
.fd{font-size:15px;color:rgba(243,245,249,.8);font-weight:500}
.fi{--mdc-icon-size:28px}
.fh{font-size:18px;font-weight:700}
.fl{font-size:14px;color:var(--dim)}
.fp{font-size:12.5px;color:var(--blue);font-weight:600}

/* Schnellzugriff */
.qagrid{display:grid;grid-template-columns:repeat(var(--qa-cols,4),minmax(0,1fr));gap:12px}
.arrow.on{background:var(--gold);color:#16130a;border-color:var(--gold)}
.qbar{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin:-4px 0 12px}
.qbl{font-size:13px;color:var(--muted);font-weight:600}
.qsegs{display:flex;background:rgba(255,255,255,.03);border:1px solid var(--line);border-radius:13px;padding:3px}
.qseg{min-width:38px;height:32px;padding:0 9px;border-radius:10px;font-size:14px;font-weight:600;color:var(--muted);text-align:center}
.qseg.sel{background:rgba(255,255,255,.09);color:var(--text)}
.qbtn{display:inline-flex;align-items:center;gap:6px;height:38px;padding:0 13px;border-radius:13px;background:rgba(247,183,51,.14);border:1px solid rgba(247,183,51,.35);color:var(--gold);font-size:14px;font-weight:600;white-space:nowrap}
.qbtn ha-icon{--mdc-icon-size:18px}
.qbtn.ghost{background:rgba(255,255,255,.04);border-color:var(--line);color:var(--muted)}
.qbar .qbtn:first-of-type{margin-left:auto}
.qadd{display:flex;flex-direction:column;gap:10px;margin:0 0 12px}
.qaddrow{display:flex;gap:8px;flex-wrap:wrap}
.qlinkrow{display:grid;grid-template-columns:1fr 1fr auto;grid-template-areas:"lb lb lb" "ln li li" "lt lt bt";gap:8px;padding-top:10px;border-top:1px solid var(--line)}
.qlinkrow .qbl{grid-area:lb;display:inline-flex;align-items:center;gap:6px}
.qlinkrow .qbl ha-icon{--mdc-icon-size:16px}
.qlinkrow .qln{grid-area:ln;min-width:0}.qlinkrow .qli{grid-area:li;min-width:0}.qlinkrow .qlt{grid-area:lt;min-width:0}
.qlinkrow .qbtn{grid-area:bt}
.qa.qlinkt{position:relative}
.qa .qlk{position:absolute;top:14px;right:14px;--mdc-icon-size:16px;color:var(--dim)}
.qa.qlinkt:hover .qlk{color:var(--text)}
.qrest{display:flex;flex-wrap:wrap;align-items:center;gap:6px}
.qrest .qbl{width:100%;margin-bottom:2px}
.qchip{display:inline-flex;align-items:center;gap:7px;height:34px;padding:0 10px 0 9px;border-radius:12px;background:rgba(255,255,255,.04);border:1px dashed rgba(255,255,255,.18);font-size:13.5px;font-weight:600;color:var(--text)}
.qchip ha-icon{--mdc-icon-size:17px;color:var(--a)}
.qchip .qplus{color:var(--gold);--mdc-icon-size:16px}
.qchip:hover{border-color:var(--gold);background:rgba(247,183,51,.08)}
.qa.qna{opacity:.5;border-style:dashed}
.qain{flex:1;min-width:200px;height:40px;border-radius:13px;border:1px solid var(--line);background:rgba(255,255,255,.05);color:var(--text);padding:0 14px;font:inherit;font-size:15px;outline:none}
.qain:focus{border-color:rgba(247,183,51,.6)}
.qain.bad{border-color:var(--red)}
.qhint{font-size:12.5px;color:var(--dim);margin:-4px 2px 12px}
.qa.qedit{position:relative;cursor:default;outline:1px dashed rgba(255,255,255,.18);outline-offset:-1px}
.qa.qoff{opacity:.35;filter:grayscale(.7)}
.qtools{position:absolute;top:8px;right:8px;display:flex;gap:3px}
.qa.qedit .qi{width:34px;height:34px;border-radius:11px}
.qa.qedit .qi ha-icon{--mdc-icon-size:18px}
.qt{width:25px;height:25px;border-radius:8px;background:rgba(0,0,0,.45);border:1px solid rgba(255,255,255,.12);display:grid;place-items:center;color:var(--text)}
.qt ha-icon{--mdc-icon-size:15px}
.qt.del{color:var(--red)}
.qeye{position:absolute;bottom:10px;right:10px;color:var(--muted)}
.qeye ha-icon{--mdc-icon-size:18px}
.qa{height:126px;border-radius:22px;background:var(--tile);border:1px solid var(--tileb);padding:15px 16px;display:flex;flex-direction:column;align-items:flex-start;transition:background .25s,border-color .25s;min-width:0}
.qi{width:42px;height:42px;border-radius:14px;background:rgba(255,255,255,.055);display:grid;place-items:center;color:var(--a)}
.qn{margin-top:auto;font-size:17.5px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%}
.qs{font-size:14.5px;color:var(--muted);margin-top:2px;overflow:hidden;max-width:100%;line-height:1.25;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical}
.qa.active{background:linear-gradient(160deg,color-mix(in srgb,var(--a) 24%,transparent),color-mix(in srgb,var(--a) 5%,transparent));border-color:color-mix(in srgb,var(--a) 75%,transparent);box-shadow:0 0 22px color-mix(in srgb,var(--a) 16%,transparent),inset 0 0 0 1px color-mix(in srgb,var(--a) 25%,transparent)}
.qa.active .qi{background:var(--a);color:#0f1116;box-shadow:0 0 16px color-mix(in srgb,var(--a) 55%,transparent)}
.qa.active .qs{color:var(--a);font-weight:600}
.qa.calm{border-color:color-mix(in srgb,var(--a) 38%,transparent)}
.qa.calm .qi{background:color-mix(in srgb,var(--a) 14%,transparent)}
.qa.calm .qs{color:var(--a);font-weight:600}
.qa.pulse .qi{animation:qpulse 1.2s ease-in-out infinite}
@keyframes qpulse{50%{transform:scale(1.12);box-shadow:0 0 22px color-mix(in srgb,var(--a) 70%,transparent)}}

/* Schnellzugriff (Aktionen) */
.agrid{display:grid;grid-template-columns:repeat(var(--act-cols,2),minmax(0,1fr));gap:10px}
.actt{position:relative;display:flex;align-items:center;gap:12px;min-height:66px;padding:10px 12px 10px 10px;border-radius:19px;background:var(--tile);border:1px solid var(--tileb);cursor:pointer;min-width:0;user-select:none;-webkit-user-select:none;-webkit-touch-callout:none;transition:background .2s,border-color .2s}
.actt:hover{border-color:rgba(255,255,255,.14)}
.aico{width:42px;height:42px;border-radius:14px;background:rgba(255,255,255,.055);display:grid;place-items:center;color:var(--a);flex:none;transition:all .2s}
.aico ha-icon{--mdc-icon-size:21px}
.atx{flex:1;min-width:0;display:flex;flex-direction:column}
.atx b{font-size:15.5px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.atx span{font-size:13px;color:var(--muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.actt.on{background:linear-gradient(160deg,color-mix(in srgb,var(--a) 20%,transparent),color-mix(in srgb,var(--a) 4%,transparent));border-color:color-mix(in srgb,var(--a) 60%,transparent)}
.actt.on .aico{background:var(--a);color:#0f1116;box-shadow:0 0 14px color-mix(in srgb,var(--a) 50%,transparent)}
.actt.on .atx span{color:var(--a);font-weight:600}
.actt.na{opacity:.5;border-style:dashed}
.asw{width:44px;height:26px;border-radius:13px;background:rgba(255,255,255,.1);position:relative;flex:none;transition:background .2s}
.asw i{position:absolute;top:3px;left:3px;width:20px;height:20px;border-radius:50%;background:#c9ced8;transition:transform .2s}
.asw.on{background:color-mix(in srgb,var(--a) 75%,#000)}
.asw.on i{transform:translateX(18px);background:#fff}
.abtns{display:flex;gap:4px;flex:none}
.abtn{width:34px;height:34px;border-radius:11px;background:rgba(255,255,255,.06);border:1px solid var(--line);display:grid;place-items:center;color:var(--text)}
.abtn:hover{background:rgba(255,255,255,.12)}
.abtn ha-icon{--mdc-icon-size:18px}
.arun{width:34px;height:34px;border-radius:11px;background:color-mix(in srgb,var(--a) 14%,transparent);color:var(--a);display:grid;place-items:center;flex:none}
.arun ha-icon{--mdc-icon-size:18px}
.actt.edit{outline:1px dashed rgba(255,255,255,.18);outline-offset:-1px}
.actt.edit.off{opacity:.35;filter:grayscale(.7)}
.aetools{display:flex;align-items:center;gap:4px;flex:none}
.aetools .qeye{position:static;margin-left:4px}
.wrap.compact .agrid{gap:8px}
.wrap.compact .actt{min-height:54px;padding:7px 10px 7px 8px;border-radius:16px;gap:10px}
.wrap.compact .aico{width:36px;height:36px;border-radius:12px}
.wrap.compact .atx b{font-size:14.5px}.wrap.compact .atx span{font-size:12px}
.wrap.compact .abtn,.wrap.compact .arun{width:30px;height:30px}

/* Räume */
.tabs{display:grid;grid-auto-flow:column;grid-auto-columns:1fr;background:rgba(255,255,255,.03);border:1px solid var(--line);border-radius:20px;padding:5px;margin-bottom:14px}
.tab{height:50px;border-radius:15px;display:flex;align-items:center;justify-content:center;gap:10px;font-size:17px;font-weight:600;color:var(--muted);text-align:center}
.tab.sel{background:rgba(255,255,255,.065);color:var(--text)}
.badge{min-width:22px;height:22px;border-radius:11px;background:rgba(247,183,51,.22);color:var(--gold);font-size:12.5px;font-weight:700;display:grid;place-items:center;padding:0 6px}
.roomgrid{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.room{height:104px;border-radius:22px;background:var(--tile);border:1px solid var(--tileb);padding:0 16px 0 18px;display:flex;align-items:center;gap:14px;cursor:pointer;min-width:0;transition:background .25s,border-color .25s}
.ri{color:var(--muted);flex:none;width:34px;display:grid;place-items:center}
.rt{display:flex;flex-direction:column;flex:1;min-width:0}
.rn{font-size:18.5px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.rs{font-size:14.5px;color:var(--dim);margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.bulb{width:56px;height:56px;border-radius:17px;background:rgba(255,255,255,.045);border:1px solid var(--line);display:grid;place-items:center;color:var(--dim);flex:none}
.room.active{background:linear-gradient(160deg,rgba(247,183,51,.2),rgba(247,183,51,.04));border-color:rgba(247,183,51,.7);box-shadow:0 0 24px rgba(247,183,51,.12)}
.room.active .ri{color:var(--gold)}
.room.active .rs{color:var(--gold);font-weight:600}
.room.active .bulb{background:var(--gold);border-color:var(--gold);color:#16130a;box-shadow:0 0 18px rgba(247,183,51,.5)}
.room.alert{border-color:rgba(248,113,113,.55)}
.room.alert .rs{color:var(--red)}

/* Kalender */
.evs-list{display:flex;flex-direction:column;gap:10px;--rowh:82px;--gap:10px}
.evs-list.scroll{max-height:calc(var(--vis) * var(--rowh) + (var(--vis) - 1) * var(--gap) + 30px);overflow-y:auto;overscroll-behavior:contain;
  -webkit-overflow-scrolling:touch;scrollbar-width:thin;scrollbar-color:rgba(255,255,255,.18) transparent;padding-right:4px;margin-right:-8px;
  -webkit-mask-image:linear-gradient(180deg,#000 calc(100% - 34px),transparent);mask-image:linear-gradient(180deg,#000 calc(100% - 34px),transparent)}
#cal.grow{display:flex;flex-direction:column}
#cal.grow .evs-list.scroll{flex:1 1 0;min-height:calc(var(--vis) * var(--rowh) + (var(--vis) - 1) * var(--gap) + 30px);max-height:none}
.evs-list.scroll.end{-webkit-mask-image:none;mask-image:none}
.evs-list.scroll::-webkit-scrollbar{width:4px}
.evs-list.scroll::-webkit-scrollbar-thumb{background:rgba(255,255,255,.18);border-radius:4px}
.ev{display:flex;align-items:center;gap:16px;background:var(--tile);border:1px solid var(--tileb);border-radius:20px;padding:12px 16px;cursor:pointer;height:var(--rowh,82px);flex:none;min-width:0}
.evd{width:52px;height:56px;border-radius:15px;background:rgba(255,255,255,.04);border:1px solid var(--line);display:flex;flex-direction:column;align-items:center;justify-content:center;flex:none}
.evd b{font-size:22px;font-weight:700;line-height:1}
.evd small{font-size:11.5px;color:var(--muted);text-transform:uppercase;letter-spacing:.06em;margin-top:3px}
.evt{display:flex;flex-direction:column;min-width:0;flex:1}
.evn{font-size:17.5px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.evs{font-size:14.5px;color:var(--muted);display:flex;align-items:center;gap:7px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.dot{width:8px;height:8px;border-radius:50%;background:var(--cc);flex:none;box-shadow:0 0 6px var(--cc)}
.evtime{margin-left:auto;padding-left:10px;font-size:17px;font-weight:600;color:rgba(243,245,249,.9);white-space:nowrap;font-variant-numeric:tabular-nums}
.evtime.allday{font-size:13.5px;font-weight:500;color:var(--muted)}
.evtime.now{color:var(--green)}
.ev.hl .evd{border-color:rgba(251,146,60,.5)}
.ev.hl .evd b{color:var(--orange)}

/* Auto */
.panel.car .lbl.chg{color:var(--green);font-weight:600}
.panel.car .lbl ha-icon{--mdc-icon-size:16px;vertical-align:-2px}
.carbody{cursor:pointer}
.range small{color:var(--muted);font-size:.85em}
.bar{position:relative;overflow:visible}
.bar span{position:relative;z-index:1}
.bm{position:absolute;top:-4px;width:3px;height:18px;border-radius:2px;transform:translateX(-1px);z-index:2}
.bm.min{background:var(--orange)}
.bm.lim{background:#fff}
.cline{display:flex;flex-wrap:wrap;gap:6px 14px;margin:-4px 0 14px;font-size:14.5px;color:var(--muted)}
.cline span{display:inline-flex;align-items:center;gap:5px;white-space:nowrap}
.cline ha-icon{--mdc-icon-size:16px;color:var(--dim)}
.cline b{color:var(--text);font-weight:700;font-variant-numeric:tabular-nums}
.cline.charge ha-icon{color:var(--green)}
.cline.charge .pv ha-icon,.cline.charge .pv b{color:var(--e-solar)}
.cflags{display:flex;gap:8px;flex-wrap:wrap;margin:0 0 12px}
.chip.warn{color:var(--orange);background:rgba(251,146,60,.1);border-color:rgba(251,146,60,.3)}
.cstats{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;margin:0 0 14px}
.cstat{display:flex;flex-direction:column;gap:2px;padding:9px 11px;border-radius:15px;background:var(--tile);border:1px solid var(--tileb);min-width:0}
.cstat span{font-size:11.5px;letter-spacing:.06em;text-transform:uppercase;color:var(--muted);font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.cstat b{font-size:18px;font-weight:700;font-variant-numeric:tabular-nums;white-space:nowrap}
.cstat small{font-size:11.5px;color:var(--muted);font-weight:500;margin-left:3px}
.wrap.compact .cline{font-size:13px;margin:-2px 0 10px}
.wrap.compact .cstats{margin-bottom:10px;gap:6px}
.wrap.compact .cstat{padding:6px 9px;border-radius:12px}
.wrap.compact .cstat b{font-size:15.5px}
.wrap.compact .cstat span{font-size:10.5px}
/* Detailfenster */
.dlg{padding:0;border:0;background:transparent;max-width:min(980px,calc(100vw - 32px));width:100%;max-height:calc(100vh - 48px);overflow:visible;color:var(--text);font-family:inherit}
.dlg::backdrop{background:rgba(5,6,9,.62);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px)}
.dpan{background:linear-gradient(180deg,#171a21,#111419);border:1px solid rgba(255,255,255,.09);border-radius:30px;box-shadow:0 30px 80px rgba(0,0,0,.6);display:flex;flex-direction:column;max-height:calc(100vh - 48px);overflow:hidden}
.dhd{display:flex;align-items:center;gap:14px;padding:18px 20px;border-bottom:1px solid var(--line)}
.dico{width:48px;height:48px;border-radius:16px;display:grid;place-items:center;background:rgba(52,211,153,.14);color:var(--green)}
.rtx{flex:1;min-width:0;display:flex;flex-direction:column}
.rname{font-size:20px;font-weight:600}
.rsub{font-size:13.5px;color:var(--muted)}
.dx{width:44px;height:44px;border-radius:15px;background:rgba(255,255,255,.06);border:1px solid var(--line);display:grid;place-items:center}
.dbody{overflow:auto;padding:16px 20px 22px;display:flex;flex-direction:column;gap:14px}
.ds{background:rgba(255,255,255,.022);border:1px solid var(--line);border-radius:22px;padding:14px}
.dsh{display:flex;align-items:center;gap:9px;font-size:12.5px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:var(--muted);margin:0 2px 12px}
.dsh ha-icon{--mdc-icon-size:16px;color:var(--dim)}
.cdgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:8px}
.cdt{display:flex;flex-direction:column;gap:3px;padding:10px 12px;border-radius:15px;background:var(--tile);border:1px solid var(--tileb);min-width:0}
.cdt span{font-size:12px;color:var(--muted);font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.cdt b{font-size:19px;font-weight:700;font-variant-numeric:tabular-nums}
.cdt small{font-size:12px;color:var(--muted);font-weight:500;margin-left:3px}
.cdt.hot{border-color:rgba(52,211,153,.45);background:rgba(52,211,153,.08)}
.cdt.hot b{color:var(--green)}
.cdinfos{display:flex;flex-wrap:wrap;gap:8px}
.cdinfo{display:flex;align-items:center;gap:10px;padding:10px 14px;border-radius:15px;background:var(--tile);border:1px solid var(--tileb);cursor:pointer;flex:1;min-width:220px}
.cdinfo ha-icon{--mdc-icon-size:20px;color:var(--cyan)}
.cdinfo span{display:flex;flex-direction:column;font-size:14.5px;font-weight:600}
.cdinfo small{font-size:11.5px;color:var(--muted);font-weight:600;letter-spacing:.06em;text-transform:uppercase}
.cdinfo.warn{border-color:rgba(251,146,60,.35)}
.cdinfo.warn ha-icon{color:var(--orange)}
@media (max-width:760px){.dlg{max-width:100vw;max-height:100vh;height:100%;margin:0}.dpan{height:100vh;max-height:100vh;border-radius:0}}
.panel.car{display:flex;flex-direction:column}
.panel.car .chips{margin-top:auto}
.carbody{display:flex;align-items:center;justify-content:space-between;gap:10px}
.soc{font-size:64px;font-weight:800;line-height:1;letter-spacing:-.02em}
.soc sup{font-size:24px;font-weight:600;vertical-align:top;margin-left:2px}
.range{font-size:17px;color:rgba(243,245,249,.8);margin-top:6px}
.carimg{max-width:48%;max-height:96px;object-fit:contain;filter:drop-shadow(0 8px 14px rgba(0,0,0,.5))}
.bar{height:10px;border-radius:6px;background:rgba(255,255,255,.07);margin:18px 0 16px;overflow:hidden}
.bar span{display:block;height:100%;border-radius:6px;background:linear-gradient(90deg,#22c58f,#5eead4);box-shadow:0 0 12px rgba(52,211,153,.55)}
.bar span.charging{background:linear-gradient(90deg,#22c58f,#5eead4,#22c58f);background-size:200% 100%;animation:charge 2.4s linear infinite}
@keyframes charge{to{background-position:-200% 0}}
.chips{display:flex;gap:10px;flex-wrap:wrap}
.chip{display:inline-flex;align-items:center;gap:8px;padding:9px 16px;border-radius:16px;background:rgba(255,255,255,.045);border:1px solid var(--line);font-size:16px;font-weight:600}
.chip ha-icon{--mdc-icon-size:18px}
.chip.ok{color:var(--green);background:rgba(52,211,153,.1);border-color:rgba(52,211,153,.2)}
.chip.sel{color:var(--cc);background:color-mix(in srgb,var(--cc) 10%,transparent);border-color:color-mix(in srgb,var(--cc) 28%,transparent)}
.chip.ico{padding:0;width:42px;justify-content:center}
.wrap.compact .chip.ico{width:34px}
.glyph{font-size:15px;font-weight:800;line-height:1;min-width:18px;text-align:center;color:var(--cc)}
.chip ha-icon[icon="mdi:infinity"]{--mdc-icon-size:22px}
.chip .chl{color:var(--muted);font-weight:500;margin-right:-2px}
.chip .chv{--mdc-icon-size:16px;opacity:.7;margin-left:-2px}
.menu{position:absolute;z-index:20;min-width:170px;background:#1c2029;border:1px solid rgba(255,255,255,.1);border-radius:16px;padding:6px;box-shadow:0 16px 40px rgba(0,0,0,.55);display:flex;flex-direction:column;gap:2px}
.mi{display:flex;align-items:center;gap:10px;width:100%;padding:10px 12px;border-radius:11px;font-size:15px;font-weight:600;color:var(--text)}
.mi ha-icon{--mdc-icon-size:18px;color:var(--cc)}
.mi:hover{background:rgba(255,255,255,.05)}
.mi.cur{background:color-mix(in srgb,var(--cc) 12%,transparent);color:var(--cc)}
.mi .ck{margin-left:auto}
.chip.bad{color:var(--red);background:rgba(248,113,113,.1);border-color:rgba(248,113,113,.25)}

/* Fensterhöhe (fit_screen) */
.wrap.fit{height:var(--fit-h);min-height:0;display:flex;flex-direction:column;overflow:hidden;padding-top:12px;padding-bottom:14px}
.wrap.fit .date{margin-bottom:10px;flex:none}
.wrap.fit .grid{flex:1;min-height:0;grid-template-rows:minmax(0,1fr)}
.wrap.fit .col{min-height:0}
.wrap.fit .panel{min-height:0;flex:none}
.wrap.fit .energy{flex:1 1 0;display:flex;flex-direction:column}
.wrap.fit .energy .ev-p,.wrap.fit .energy .ev-e{flex:1 1 0;min-height:0;display:flex;flex-direction:column}
.wrap.fit .energy[data-view="power"] .ev-e,.wrap.fit .energy[data-view="energy"] .ev-p{display:none}
.wrap.fit .energy .flow{flex:1;min-height:0;width:100%;height:100%;margin-top:0}
.wrap.fit #rooms{flex:1 1 0;display:flex;flex-direction:column}
.wrap.fit #act{flex:1 1 0;display:flex;flex-direction:column}
.wrap.fit #act .qagrid{flex:1;min-height:0;overflow-y:auto;overscroll-behavior:contain;align-content:start;scrollbar-width:thin;scrollbar-color:rgba(255,255,255,.18) transparent;padding-right:4px;margin-right:-8px}
.wrap.fit #rooms .roomgrid{flex:1;min-height:0;overflow-y:auto;overscroll-behavior:contain;align-content:start;scrollbar-width:thin;scrollbar-color:rgba(255,255,255,.18) transparent;padding-right:4px;margin-right:-8px}
.wrap.fit #cal{flex:1 0 auto}
.wrap.fit #cal .evs-list:not(.scroll){flex:none;overflow:visible}
.calbody{display:flex;flex-direction:column;flex:none;min-height:0}
.calschool{flex:none;min-width:0;margin-top:14px;padding-top:12px;border-top:1px solid var(--line)}
.wrap.compact .calschool{margin-top:10px;padding-top:8px}
#cal{display:flex;flex-direction:column}
.wrap.fit #cal .evs-list{flex:1 1 0;min-height:0;max-height:none;overflow-y:auto}
.wrap.fit #car .chips{margin-top:0}
/* kompakt bei niedriger Fensterhöhe */
.wrap.compact .grid,.wrap.compact .col{gap:14px}
.wrap.compact .panel{padding:14px 16px;border-radius:24px}
.wrap.compact .hd{min-height:34px;margin-bottom:10px}
.wrap.compact .arrow{width:34px;height:34px;border-radius:11px}
.wrap.compact .ttl{font-size:13px}.wrap.compact .lbl{font-size:13.5px}
.wrap.compact .eopt{height:30px;font-size:13.5px}
.wrap.compact .qagrid,.wrap.compact .roomgrid{gap:10px}
.wrap.compact .qa{height:96px;padding:11px 13px;border-radius:18px}
.wrap.compact .qi{width:34px;height:34px;border-radius:11px}
.wrap.compact .qi ha-icon{--mdc-icon-size:19px}
.wrap.compact .qn{font-size:15px}.wrap.compact .qs{font-size:12.5px}
.wrap.compact .tabs{margin-bottom:10px}.wrap.compact .tab{height:40px;font-size:15px}
.wrap.compact .room{height:80px;border-radius:18px}
.wrap.compact .rn{font-size:16px}.wrap.compact .rs{font-size:13px}
.wrap.compact .bulb{width:44px;height:44px;border-radius:13px}
.wrap.compact .evs-list{--rowh:64px;--gap:8px}
.wrap.compact .ev{padding:8px 12px;border-radius:16px;gap:12px}
.wrap.compact .evd{width:44px;height:46px;border-radius:12px}
.wrap.compact .evd b{font-size:18px}
.wrap.compact .evn{font-size:15.5px}.wrap.compact .evs{font-size:13px}.wrap.compact .evtime{font-size:15px}
.wrap.compact .wnow{margin:0 0 10px;gap:12px}
.wrap.compact .wicon{--mdc-icon-size:44px}
.wrap.compact .wtemp{font-size:44px}.wrap.compact .wtemp sup{font-size:18px}
.wrap.compact .wcond{font-size:16px;margin-top:2px}.wrap.compact .whl{font-size:13.5px}
.wrap.compact .pill{font-size:12.5px;padding:5px 10px}
.wrap.compact .fc{gap:8px}.wrap.compact .fday{padding:7px 2px;border-radius:14px;gap:2px}
.wrap.compact .fi{--mdc-icon-size:22px}.wrap.compact .fh{font-size:15px}.wrap.compact .fd,.wrap.compact .fl{font-size:12.5px}
.wrap.compact .soc{font-size:48px}.wrap.compact .soc sup{font-size:18px}
.wrap.compact .range{font-size:14.5px;margin-top:2px}
.wrap.compact .carimg{max-height:70px}
.wrap.compact .bar{margin:10px 0}
.wrap.compact .chip{padding:6px 12px;font-size:14px}

/* Responsive */
@container (max-width:1700px) and (min-width:1181px){
  .qn{font-size:16px}.qs{font-size:13px}.qa{padding:13px}
  .rn{font-size:16.5px}.rs{font-size:13.5px}.room{gap:10px;padding:0 12px}.bulb{width:48px;height:48px}
  .wtemp{font-size:52px}.wicon{--mdc-icon-size:52px}
}
@container (max-width:1180px){
  .grid{grid-template-columns:1fr 1fr}
  .col:nth-child(2){grid-column:1 / -1;order:-1}
}
@container (max-width:720px){
  .wrap{padding:12px}
  .grid{grid-template-columns:1fr;gap:14px}
  .col{gap:14px}
  .col:nth-child(2){grid-column:auto}
  .qagrid{grid-template-columns:repeat(var(--qa-cols,2),minmax(0,1fr))}
  .stats{grid-template-columns:repeat(2,1fr)}
  .roomgrid{grid-template-columns:1fr}

  .panel{border-radius:24px;padding:16px}
}
@media (prefers-reduced-motion:reduce){.ln.on,.bar span.charging,.qa.pulse .qi{animation:none}}
`;
const SCHOOL_DEFAULT = {
  title: "Schule",
  days: 7,                     // so weit wird der Stundenplan geladen
  kids: [
    { name: "Tom", color: "#34d399", icon: "mdi:soccer",
      start: "sensor.webuntis_tom_heutiger_schulbeginn", end: "sensor.webuntis_tom_heutiges_schulende",
      start_tomorrow: "sensor.tom_schulstart_morgen", end_tomorrow: "sensor.tom_schulende_morgen",
      calendar: "calendar.webuntis_tom" },
    { name: "Lena", color: "#a78bfa", icon: "mdi:horse-variant",
      start: "sensor.len_gerke_heutiger_schulbeginn", end: "sensor.len_gerke_heutiges_schulende",
      start_tomorrow: "sensor.lena_schulstart_morgen", end_tomorrow: "sensor.lena_schulende_morgen",
      calendar: "calendar.len_gerke" },
  ],
};

class MgSchoolCard extends HTMLElement {
  static getStubConfig() { return {}; }
  getCardSize() { return 4; }
  setConfig(c) {
    this._config = { ...SCHOOL_DEFAULT, ...(c || {}), kids: c?.kids || SCHOOL_DEFAULT.kids };
    this._events = {};
    this._sig = null;
    if (this._hass) { this._load(); this._render(true); }
  }
  set hass(h) {
    const first = !this._hass;
    this._hass = h;
    if (!this.shadowRoot) {
      this.attachShadow({ mode: "open" });
      this.shadowRoot.innerHTML = `<style>${STYLE}${SCHOOL_STYLE}</style><div id="main"></div><dialog class="dlg" id="dlg"></dialog>`;
      this.shadowRoot.addEventListener("click", (e) => this._click(e));
      const d = this.shadowRoot.getElementById("dlg");
      d.addEventListener("click", (e) => { if (e.target === d) d.close(); });
      d.addEventListener("close", () => { this._open = null; });
      if (!document.querySelector(`link[href="${FONT_URL}"]`)) { const l = document.createElement("link"); l.rel = "stylesheet"; l.href = FONT_URL; document.head.appendChild(l); }
    }
    if (first) this._load();
    this._render();
  }
  connectedCallback() {
    if (!this._tick) this._tick = setInterval(() => this._render(true), 60000);
    if (!this._cal) this._cal = setInterval(() => this._load(), 15 * 60000);
  }
  disconnectedCallback() { clearInterval(this._tick); clearInterval(this._cal); this._tick = this._cal = null; }

  _st(id) { return id ? this._hass?.states[id] : undefined; }
  _time(v) { if (!v || OFFLINE.includes(v) || v === "schulfrei") return null; const d = new Date(v); return isNaN(d) ? null : d; }
  _hm(d) { return `${pad(d.getHours())}:${pad(d.getMinutes())}`; }
  _dur(ms) { const m = Math.max(0, Math.round(ms / 60000)), h = Math.floor(m / 60); return h ? `${h} h ${pad(m % 60)} min` : `${m} min`; }

  async _load() {
    const c = this._config;
    if (!this._hass) return;
    const s = new Date(); s.setHours(0, 0, 0, 0);
    const e = new Date(s.getTime() + c.days * 86400000);
    const q = `?start=${encodeURIComponent(s.toISOString())}&end=${encodeURIComponent(e.toISOString())}`;
    await Promise.all(c.kids.filter((k) => k.calendar).map((k) =>
      this._hass.callApi("GET", `calendars/${k.calendar}${q}`).then((l) => {
        this._events[k.calendar] = l.map((ev) => ({
          summary: ev.summary || "", location: ev.location || "", desc: ev.description || "",
          ts: new Date(ev.start.dateTime || ev.start.date + "T00:00:00").getTime(),
          te: new Date(ev.end?.dateTime || (ev.end?.date ? ev.end.date + "T00:00:00" : ev.start.dateTime)).getTime(),
          allDay: !!ev.start.date,
        })).sort((a, b) => a.ts - b.ts);
      }).catch(() => { this._events[k.calendar] = this._events[k.calendar] || []; })));
    this._render(true);
  }

  _kid(k, i) {
    const now = Date.now();
    const s = this._time(this._st(k.start)?.state), e = this._time(this._st(k.end)?.state);
    const sT = this._st(k.start_tomorrow), eT = this._st(k.end_tomorrow);
    const ts = this._time(sT?.attributes?.start_time || (sT?.state && !isNaN(new Date(sT.state)) ? sT.state : null));
    const te = this._time(eT?.attributes?.end_time || (eT?.state && !isNaN(new Date(eT.state)) ? eT.state : null));
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const isToday = s && s.getTime() >= today.getTime() && s.getTime() < today.getTime() + 86400000;

    let state = "free", chip = "Schulfrei", ic = "mdi:sleep";
    if (isToday && e) {
      if (now < s) { state = "before"; chip = `Beginn ${this._hm(s)}`; ic = "mdi:clock-outline"; }
      else if (now < e) { state = "now"; chip = "In der Schule"; ic = "mdi:school"; }
      else { state = "done"; chip = "Schule aus"; ic = "mdi:home-account"; }
    }
    const lessons = (this._events[k.calendar] || []).filter((x) => !x.allDay);
    const todayL = lessons.filter((x) => x.ts >= today.getTime() && x.ts < today.getTime() + 86400000);
    const cur = todayL.find((x) => x.ts <= now && x.te > now), next = todayL.find((x) => x.ts > now);

    let prog = "";
    if (isToday && e) {
      const p = Math.max(0, Math.min(100, ((now - s) / (e - s)) * 100));
      const label = state === "now" ? `noch ${this._dur(e - now)}` : state === "before" ? `in ${this._dur(s - now)}` : "geschafft";
      prog = `<div class="sprog"><div class="sbar"><span style="width:${state === "before" ? 0 : p}%"></span>${state === "now" ? `<i style="left:${p}%"></i>` : ""}</div>
        <div class="sbl"><span>${this._hm(s)}</span><b>${label}</b><span>${this._hm(e)}</span></div></div>`;
    }
    const lesson = (lbl, x, cls = "") => x ? `<div class="sles ${cls}"><span class="slt">${lbl}</span><span class="sln">${esc(x.summary)}</span>
      <span class="slz">${this._hm(new Date(x.ts))}–${this._hm(new Date(x.te))}${x.location ? " · " + esc(x.location) : ""}</span></div>` : "";
    const lessonsHtml = state === "now" || state === "before" ? lesson(state === "now" ? "Jetzt" : "Erste Stunde", state === "now" ? cur : todayL[0], "cur") + (state === "now" ? lesson("Danach", next) : "") : "";

    const row = (lbl, a, b, freeTxt) => `<div class="srow"><span class="srl">${lbl}</span>${a && b
      ? `<span class="srv"><b>${this._hm(a)}</b> – <b>${this._hm(b)}</b></span><span class="srd">${this._dur(b - a)}</span>`
      : `<span class="srv free">${freeTxt}</span>`}</div>`;
    const tomorrowName = WD_LONG[new Date(now + 86400000).getDay()];

    const tm = (a, b) => a && b ? `<b>${this._hm(a)}</b><span class="sdash">–</span><b>${this._hm(b)}</b>` : `<em>schulfrei</em>`;
    if (this.hasAttribute("embedded"))
      return `<div class="strow ${state}" style="--kc:${k.color || "#38bdf8"}" data-act="week" data-i="${i}" title="Stundenplan öffnen">
        <span class="stn"><i class="sdot"></i>${esc(k.name)}</span>
        <span class="srv">${tm(isToday ? s : null, isToday ? e : null)}</span>
        <span class="srv">${tm(ts, te)}</span></div>`;
    return `<div class="skid ${state}" style="--kc:${k.color || "#38bdf8"}" data-act="week" data-i="${i}" title="Stundenplan öffnen">
      <span class="sav">${icon(state === "free" ? "mdi:sleep" : k.icon || "mdi:school")}</span>
      <span class="snm">${esc(k.name)}</span>
      <span class="srl">Heute</span><span class="srv">${tm(isToday ? s : null, isToday ? e : null)}</span>
      <span class="srl">Morgen</span><span class="srv">${tm(ts, te)}</span>
    </div>`;
  }

  _week(i) {
    const k = this._config.kids[i], lessons = this._events[k.calendar] || [];
    const days = new Map();
    for (const x of lessons) {
      const d = new Date(x.ts); d.setHours(0, 0, 0, 0);
      if (!days.has(d.getTime())) days.set(d.getTime(), []);
      days.get(d.getTime()).push(x);
    }
    const now = Date.now();
    const cols = [...days.entries()].map(([t, l]) => {
      const d = new Date(t), isT = new Date().toDateString() === d.toDateString();
      return `<div class="wday ${isT ? "today" : ""}"><div class="wdh"><b>${WD[d.getDay()]}</b><span>${d.getDate()}. ${MON[d.getMonth()]}</span></div>
        ${l.map((x) => `<div class="wles ${x.allDay ? "ad" : ""} ${x.ts <= now && x.te > now ? "cur" : ""} ${x.te < now ? "past" : ""}">
          <span class="wt">${x.allDay ? "ganztägig" : `${this._hm(new Date(x.ts))}–${this._hm(new Date(x.te))}`}</span>
          <span class="wn">${esc(x.summary)}</span>${x.location ? `<span class="wl">${esc(x.location)}</span>` : ""}</div>`).join("")}</div>`;
    }).join("") || `<div class="empty">Keine Stunden in den nächsten ${this._config.days} Tagen</div>`;
    return `<div class="dpan" style="--kc:${k.color}">
      <div class="dhd"><span class="sav">${icon(k.icon || "mdi:account-school")}</span>
        <span class="rtx"><span class="rname">Stundenplan ${esc(k.name)}</span><span class="rsub">nächste ${this._config.days} Tage</span></span>
        <button class="dx" data-act="dclose" aria-label="Schließen">${icon("mdi:close")}</button></div>
      <div class="dbody"><div class="wgrid">${cols}</div></div></div>`;
  }

  _render(force = false) {
    if (!this._hass || !this.shadowRoot) return;
    const ids = this._config.kids.flatMap((k) => [k.start, k.end, k.start_tomorrow, k.end_tomorrow]);
    const sig = ids.map((id) => { const s = this._st(id); return s ? s.state + s.last_updated : "-"; }).join("|");
    if (!force && sig === this._sig) return;
    this._sig = sig;
    const anyNow = this._config.kids.some((k) => { const s = this._time(this._st(k.start)?.state), e = this._time(this._st(k.end)?.state); return s && e && Date.now() >= s && Date.now() < e; });
    this.shadowRoot.getElementById("main").innerHTML = `<section class="panel school">
      <div class="hd"><span class="ttl">${esc(this._config.title)}</span><span class="lbl">${anyNow ? "Unterricht läuft" : ""}</span></div>
      ${this.hasAttribute("embedded")
        ? `<div class="stab"><div class="sth"><span></span><span>Heute</span><span>Morgen <small>${WD[new Date(Date.now() + 86400000).getDay()]}</small></span></div>${this._config.kids.map((k, i) => this._kid(k, i)).join("")}</div>`
        : `<div class="sgrid">${this._config.kids.map((k, i) => this._kid(k, i)).join("")}</div>`}</section>`;
    const d = this.shadowRoot.getElementById("dlg");
    if (this._open != null) { const sc = d.querySelector(".dbody")?.scrollTop || 0; d.innerHTML = this._week(this._open); const b = d.querySelector(".dbody"); if (b) b.scrollTop = sc; }
  }

  _click(e) {
    const el = e.composedPath().find((n) => n.dataset && n.dataset.act);
    if (!el) return;
    const d = this.shadowRoot.getElementById("dlg");
    if (el.dataset.act === "week") {
      this._open = Number(el.dataset.i);
      d.innerHTML = this._week(this._open);
      try { d.showModal(); } catch (x) { d.setAttribute("open", ""); }
      setTimeout(() => d.querySelector(".wday.today")?.scrollIntoView({ block: "nearest", inline: "start" }), 50);
    } else if (el.dataset.act === "dclose") d.close();
  }
}

const SCHOOL_STYLE = `
.sgrid{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:10px}
.skid{display:grid;grid-template-columns:auto 1fr;grid-template-areas:"av nm" "av nm";column-gap:12px;row-gap:2px;align-items:center;
  grid-template-rows:auto;border-radius:20px;background:var(--tile);border:1px solid var(--tileb);padding:12px 14px;cursor:pointer;min-width:0;transition:border-color .25s}
.skid{grid-template-columns:42px auto 1fr;grid-template-areas:"av nm nm" "av l1 v1" "av l2 v2"}
.sav{grid-area:av;width:42px;height:42px;border-radius:14px;display:grid;place-items:center;align-self:center;background:rgba(255,255,255,.05);color:var(--dim)}
.sav ha-icon{--mdc-icon-size:22px}
.snm{grid-area:nm;font-size:16.5px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-bottom:2px}
.srl{font-size:12.5px;color:var(--muted);font-weight:600;padding-right:10px}
.skid .srl:nth-of-type(1){grid-area:l1}.skid .srl:nth-of-type(2){grid-area:l2}
.skid .srv:nth-of-type(1){grid-area:v1}.skid .srv:nth-of-type(2){grid-area:v2}
.srv{font-size:14.5px;font-variant-numeric:tabular-nums;white-space:nowrap;color:var(--text)}
.srv b{font-weight:700}
.srv em{font-style:normal;color:var(--dim);font-weight:500}
.sdash{color:var(--dim);margin:0 4px}
.skid.before,.skid.now,.skid.done{border-color:color-mix(in srgb,var(--kc) 45%,transparent)}
.skid.before .sav,.skid.done .sav{background:color-mix(in srgb,var(--kc) 16%,transparent);color:var(--kc)}
.skid.now{background:linear-gradient(160deg,color-mix(in srgb,var(--kc) 16%,transparent),color-mix(in srgb,var(--kc) 3%,transparent));box-shadow:0 0 18px color-mix(in srgb,var(--kc) 10%,transparent)}
.skid.now .sav{background:var(--kc);color:#0f1116;box-shadow:0 0 14px color-mix(in srgb,var(--kc) 50%,transparent)}
.skid:hover{border-color:color-mix(in srgb,var(--kc) 70%,transparent)}
/* eingebettet (Startseite): kompakter */
:host([embedded]) .panel.school{padding:14px 16px 16px;border-radius:26px}
:host([embedded]) .panel.school .hd{min-height:30px;margin-bottom:10px}
:host([embedded]) .sgrid{gap:8px}
:host([embedded]) .skid{padding:9px 12px;border-radius:17px;grid-template-columns:36px auto 1fr;column-gap:11px}
:host([embedded]) .sav{width:36px;height:36px;border-radius:12px}
:host([embedded]) .sav ha-icon{--mdc-icon-size:19px}
:host([embedded]) .snm{font-size:15.5px;margin-bottom:0}
:host([embedded]) .srv{font-size:14px}
.stab{display:flex;flex-direction:column;gap:6px}
:host([bare]) .panel.school{background:none;border:0;border-radius:0;padding:0;overflow:visible}
:host([bare]) .panel.school > .hd{display:none}
:host([bare]) .sth{padding-top:0}
:host([compact]) .panel.school{padding:12px 14px 13px;border-radius:24px}
:host([compact]) .panel.school .hd{min-height:26px;margin-bottom:6px}
:host([compact]) .panel.school .ttl{font-size:13px}
:host([compact]) .panel.school .lbl{font-size:13.5px}
:host([compact]) .stab{gap:5px}
:host([compact]) .strow{padding:6px 12px;border-radius:13px}
:host([compact]) .stn{font-size:14.5px}
:host([compact]) .strow .srv{font-size:13.5px}
.sth,.strow{display:grid;grid-template-columns:minmax(70px,1fr) minmax(0,1.25fr) minmax(0,1.25fr);align-items:center;column-gap:8px}
.sth{font-size:11.5px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:var(--dim);padding:0 12px}
.sth small{letter-spacing:0;text-transform:none;margin-left:2px}
.strow{padding:9px 12px;border-radius:15px;background:var(--tile);border:1px solid var(--tileb);cursor:pointer}
.strow .srv{font-size:14.5px}
.stn{display:flex;align-items:center;gap:9px;font-size:15.5px;font-weight:600;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.sdot{width:9px;height:9px;border-radius:50%;background:var(--kc);flex:none;opacity:.45}
.strow.before,.strow.done{border-color:color-mix(in srgb,var(--kc) 40%,transparent)}
.strow.before .sdot,.strow.done .sdot{opacity:1}
.strow.now{border-color:color-mix(in srgb,var(--kc) 60%,transparent);background:linear-gradient(90deg,color-mix(in srgb,var(--kc) 16%,transparent),color-mix(in srgb,var(--kc) 3%,transparent))}
.strow.now .sdot{opacity:1;box-shadow:0 0 8px var(--kc);animation:mgpulse 1.6s ease-in-out infinite}
.strow:hover{border-color:color-mix(in srgb,var(--kc) 70%,transparent)}
@keyframes mgpulse{50%{opacity:.45}}
/* Dialog */
.dlg{padding:0;border:0;background:transparent;max-width:min(1100px,calc(100vw - 32px));width:100%;max-height:calc(100vh - 48px);overflow:visible;color:var(--text);font-family:inherit}
.dlg::backdrop{background:rgba(5,6,9,.62);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px)}
.dpan{background:linear-gradient(180deg,#171a21,#111419);border:1px solid rgba(255,255,255,.09);border-radius:30px;box-shadow:0 30px 80px rgba(0,0,0,.6);display:flex;flex-direction:column;max-height:calc(100vh - 48px);overflow:hidden}
.dhd{display:flex;align-items:center;gap:14px;padding:18px 20px;border-bottom:1px solid var(--line)}
.rtx{flex:1;min-width:0;display:flex;flex-direction:column}
.rname{font-size:20px;font-weight:600}
.rsub{font-size:13.5px;color:var(--muted)}
.dx{width:44px;height:44px;border-radius:15px;background:rgba(255,255,255,.06);border:1px solid var(--line);display:grid;place-items:center}
.dbody{overflow:auto;padding:16px 20px 22px}
.wgrid{display:grid;grid-auto-flow:column;grid-auto-columns:minmax(170px,1fr);gap:10px}
.wday{display:flex;flex-direction:column;gap:6px;min-width:0}
.wdh{display:flex;align-items:baseline;gap:8px;padding:4px 6px 6px}
.wdh b{font-size:16px}
.wdh span{font-size:12.5px;color:var(--muted)}
.wday.today .wdh b{color:var(--kc)}
.wles{display:flex;flex-direction:column;padding:8px 10px;border-radius:13px;background:var(--tile);border:1px solid var(--tileb)}
.wles.cur{border-color:var(--kc);background:color-mix(in srgb,var(--kc) 12%,transparent)}
.wles.past{opacity:.45}
.wles.ad{border-style:dashed}
.wt{font-size:12px;color:var(--muted);font-variant-numeric:tabular-nums}
.wn{font-size:14.5px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.wl{font-size:12px;color:var(--dim)}
@media (max-width:760px){.dlg{max-width:100vw;max-height:100vh;height:100%;margin:0}.dpan{height:100vh;max-height:100vh;border-radius:0}.wgrid{grid-auto-flow:row;grid-auto-columns:auto}}
`;

if (!customElements.get("mg-school-card")) customElements.define("mg-school-card", MgSchoolCard);
if (!window.customCards.some((c) => c.type === "mg-school-card"))
  window.customCards.push({ type: "mg-school-card", name: "MG Schule", description: "Stundenplan und Schulzeiten der Kinder im Glow-Stil" });
