/*
 * mg-rooms-dashboard.js
 * Ablage:    /config/www/glow-dashboard/mg-rooms-dashboard.js
 * Ressource: /local/glow-dashboard/mg-rooms-dashboard.js?v=4  (Typ: JavaScript)
 * YAML:      type: custom:mg-rooms-dashboard
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
const CLIMATE_DEFAULT = {
  title: "Klima & Heizung",
  fit_screen: true,
  tilt_threshold: 1,          // Rotation > Wert = gekippt
  burn_threshold: 30,         // Therme-Leistung > W = brennt
  floors: [
    { name: "Erdgeschoss", icon: "mdi:sofa", rooms: [
      { name: "WZ Tür", climate: "climate.heizung_wohn_tur_thermostat", temp: "sensor.temperatur_wohnzimmer_temperature", humidity: "sensor.temperatur_wohnzimmer_humidity",
        windows: [{ contact: "binary_sensor.tur_wohnzimmer_window", tilt: "sensor.tur_wohnzimmer_rotation" }] },
      { name: "WZ Fenster", climate: "climate.heizung_wohn_fenster_thermostat", temp: "sensor.temperatur_wohnzimmer_temperature", humidity: "sensor.temperatur_wohnzimmer_humidity" },
      { name: "Gäste WC", climate: "climate.heizung_gaste_wc_thermostat", temp: "sensor.temperatur_gaste_wc_temperature", humidity: "sensor.temperatur_gaste_wc_humidity",
        windows: [{ contact: "binary_sensor.fenster_gaste_wc_window", tilt: "sensor.fenster_gaste_wc_rotation" }] },
      { name: "Küche", climate: "climate.heizung_kuche_thermostat", temp: "sensor.kuche_temperature", humidity: "sensor.kuche_humidity",
        windows: [{ contact: "binary_sensor.fenster_kuche_window", tilt: "sensor.fenster_kuche_rotation" }] },
      { name: "Treppenhaus", climate: "climate.shellytrv_b4e3f9d9cf3f", temp: "sensor.temperatur_vorratsraum_temperatur", humidity: "sensor.temperatur_vorratsraum_luftfeuchtigkeit",
        windows: [{ contact: "binary_sensor.fenster_keller_window", tilt: "sensor.fenster_keller_rotation" }] },
    ] },
    { name: "Obergeschoss", icon: "mdi:bed", extras: ["therme", "dehumidifier"], rooms: [
      { name: "Bad 1.OG", climate: "climate.heizung_bad_1_og", temp: "sensor.temperatur_bad_temperatur", humidity: "sensor.temperatur_bad_luftfeuchtigkeit",
        windows: [{ contact: "binary_sensor.fenster_bad_1_og_window", tilt: "sensor.fenster_bad_1_og_rotation" }] },
      { name: "Büro", climate: "climate.heizung_buro_thermostat", temp: "sensor.temperatur_az_temperature", humidity: "sensor.temperatur_az_humidity",
        windows: [{ contact: "binary_sensor.fenster_arbeitszimmer_window", tilt: "sensor.fenster_arbeitszimmer_rotation" }] },
    ] },
    { name: "Dachgeschoss", icon: "mdi:home-roof", rooms: [
      { name: "Bad Kinder", climate: "climate.heizung_bad_kinder", temp: "sensor.temperatur_bad_kinder_temperatur", humidity: "sensor.temperatur_bad_kinder_luftfeuchtigkeit",
        windows: [{ contact: "binary_sensor.fenster_bad_kinder_window", tilt: "sensor.fenster_bad_kinder_rotation" }],
        extra: { name: "Bodenheizung", icon: "mdi:heating-coil", entity: "switch.bad_kinder_bodenheizung_switch_1", power: "sensor.bad_kinder_bodenheizung_switch_1_power" } },
      { name: "Lena", climate: "climate.heizung_lena_thermostat", temp: "sensor.temperatur_lena_temperature", humidity: "sensor.temperatur_lena_humidity",
        windows: [{ contact: "binary_sensor.fenster_lena_window", tilt: "sensor.fenster_lena_rotation" }] },
      { name: "Klima Lena", climate: "climate.daikin_lena_mqtt_hvac", temp: "sensor.temperatur_lena_temperature", humidity: "sensor.temperatur_lena_humidity",
        windows: [{ contact: "binary_sensor.fenster_lena_window", tilt: "sensor.fenster_lena_rotation" }] },
      { name: "Tom", climate: "climate.heizung_tom_thermostat", temp: "sensor.temperatur_tom_temperatur", humidity: "sensor.temperatur_tom_luftfeuchtigkeit",
        windows: [{ contact: "binary_sensor.fenster_tom_rechts", name: "rechts" }, { contact: "binary_sensor.fenster_tom_links", name: "links" }] },
      { name: "Klima Tom", climate: "climate.daikin_tom_mqtt_hvac", temp: "sensor.temperatur_tom_temperatur", humidity: "sensor.temperatur_tom_luftfeuchtigkeit",
        windows: [{ contact: "binary_sensor.fenster_tom_rechts", name: "rechts" }, { contact: "binary_sensor.fenster_tom_links", name: "links" }] },
    ] },
  ],
  therme: {
    name: "Therme",
    power: "sensor.brennwerttherme_switch_0_power",
    mode: "select.gasverbrauch_modus_therme",
    winter: "input_boolean.therme_wintermodus",
    values: [
      { name: "Vorlauf",     entity: "sensor.temperatur_heizung_vorlauf_temperature",  icon: "mdi:thermometer-chevron-up",   color: "#f87171" },
      { name: "Rücklauf",    entity: "sensor.temperatur_heizung_nachlauf_temperature", icon: "mdi:thermometer-chevron-down", color: "#fdba74" },
      { name: "Wasser",      entity: "sensor.shellyplus1pm_d48afc779fe0_temperature",  icon: "mdi:water-thermometer",        color: "#60a5fa" },
      { name: "Garten",      entity: "sensor.temperatursensor_garten_temperature",     icon: "mdi:sun-thermometer",          color: "#f7b733" },
      { name: "Sollvorlauf", entity: "input_number.therme_einstellung_vorlauf",        icon: "mdi:thermometer-check",        color: "#34d399" },
      { name: "Heizkurve",   entity: "input_number.therme_einstellung_kurve",          icon: "mdi:chart-bell-curve-cumulative", color: "#34d399", unit: "" },
      { name: "Fühler",      entity: "sensor.temperatur_fuhler_therme_temperatur",     icon: "mdi:thermometer-lines",        color: "#34d399" },
    ],
  },
  dehumidifier: {
    name: "Luftentfeuchter",
    power: "sensor.luftentfeuchter_keller_power",
    threshold: 3,
    temp: "sensor.ht_keller_temperatur_keller",
    humidity: "sensor.ht_keller_luftfeuchtigkeit_keller",
    windows: [{ contact: "binary_sensor.fenster_keller_window" }],
  },
};

const KIND = {
  heat: { t: "Heizt",           c: "#f87171" },
  cool: { t: "Kühlt",           c: "#38bdf8" },
  dry:  { t: "Entfeuchtet",     c: "#a78bfa" },
  fan:  { t: "Lüftet",          c: "#94a3b8" },
  idle: { t: "Bereit",          c: "#fb923c" },
  off:  { t: "Aus",             c: "#8b91a1" },
  na:   { t: "Nicht verfügbar", c: "#f87171" },
};

class MgClimateDashboard extends HTMLElement {
  static getStubConfig() { return {}; }
  getCardSize() { return 12; }

  setConfig(config) {
    this._config = merge(CLIMATE_DEFAULT, config || {});
    this._pending = {};
    this._sig = null;
    if (this._hass) this._render(true);
  }

  set hass(h) {
    this._hass = h;
    if (!this.shadowRoot) {
      this.attachShadow({ mode: "open" });
      this.shadowRoot.addEventListener("click", (e) => this._click(e));
      if (!document.querySelector(`link[href="${FONT_URL}"]`)) {
        const l = document.createElement("link"); l.rel = "stylesheet"; l.href = FONT_URL; document.head.appendChild(l);
      }
    }
    this._render();
  }

  connectedCallback() {
    if (!this._onResize) {
      this._onResize = () => { cancelAnimationFrame(this._fitRaf); this._fitRaf = requestAnimationFrame(() => this._fit()); };
      this._ro = new ResizeObserver(this._onResize);
    }
    window.addEventListener("resize", this._onResize);
    this._ro.observe(this);
    this._onResize();
  }
  disconnectedCallback() {
    if (this._onResize) { window.removeEventListener("resize", this._onResize); this._ro.disconnect(); }
  }

  _fit() {
    const wrap = this.shadowRoot?.querySelector(".wrap");
    if (!wrap) return;
    const on = this._config?.fit_screen !== false && this.clientWidth > 1180;
    if (!on) { wrap.classList.remove("fit"); return; }
    const top = this.getBoundingClientRect().top + window.scrollY;
    wrap.style.setProperty("--fit-h", Math.max(560, Math.floor(window.innerHeight - top)) + "px");
    wrap.classList.add("fit");
  }

  _st(id) { return id ? this._hass?.states[id] : undefined; }
  _num(id) { const s = this._st(id); const v = s ? parseFloat(s.state) : NaN; return v; }

  _allIds() {
    const c = this._config, ids = [];
    for (const f of c.floors) for (const r of f.rooms) {
      ids.push(r.climate, r.temp, r.humidity, r.extra?.entity, r.extra?.power);
      for (const w of r.windows || []) ids.push(w.contact, w.tilt);
    }
    const t = c.therme; if (t) ids.push(t.power, t.mode, t.winter, ...(t.values || []).map((v) => v.entity));
    const d = c.dehumidifier; if (d) { ids.push(d.power, d.temp, d.humidity); for (const w of d.windows || []) ids.push(w.contact, w.tilt); }
    return ids.filter(Boolean);
  }

  /* ---------- Bausteine ---------- */
  _window(w) {
    const s = this._st(w.contact), tilt = this._num(w.tilt);
    if (!s || ["unavailable", "unknown"].includes(s.state)) return { k: "na", t: "?", c: "#8b91a1", i: "mdi:window-closed-variant" };
    if (!isNaN(tilt) && tilt > this._config.tilt_threshold) return { k: "tilt", t: "gekippt", c: "#eab308", i: "mdi:window-open-variant" };
    if (s.state === "on") return { k: "open", t: "offen", c: "#f87171", i: "mdi:window-open-variant" };
    return { k: "zu", t: "zu", c: "#34d399", i: "mdi:window-closed-variant" };
  }

  _winChips(list) {
    return (list || []).map((w) => {
      const x = this._window(w);
      return `<button class="cchip w" style="--cc:${x.c}" data-act="more" data-entity="${esc(w.contact)}">${icon(x.i)}${w.name ? `<span class="wn">${esc(w.name)}</span>` : ""}${x.t}</button>`;
    }).join("");
  }

  _valChip(id, ic, color, unit, dec = 1) {
    const v = this._num(id);
    if (!id || !this._st(id)) return "";
    return `<button class="cchip" style="--cc:${color}" data-act="more" data-entity="${esc(id)}">${icon(ic)}${isNaN(v) ? "–" : de(v, dec)}${unit}</button>`;
  }

  _kind(c) {
    if (!c || ["unavailable", "unknown"].includes(c.state)) return "na";
    const a = c.attributes.hvac_action, s = c.state;
    const m = a || s;
    if (["heating", "preheating", "heat"].includes(m)) return a || s === "heat" ? (a ? "heat" : "heat") : "heat";
    if (["cooling", "cool"].includes(m)) return "cool";
    if (["drying", "dry"].includes(m)) return "dry";
    if (["fan", "fan_only"].includes(m)) return "fan";
    if (m === "off" || s === "off") return "off";
    return "idle";
  }

  _room(r) {
    const c = this._st(r.climate), kind = this._kind(c), K = KIND[kind];
    const modes = c?.attributes?.hvac_modes || [];
    const isAC = r.ac ?? modes.includes("cool");
    const ic = kind === "cool" ? "mdi:snowflake" : kind === "dry" ? "mdi:water-percent" : isAC ? "mdi:air-conditioner" : kind === "off" || kind === "na" ? "mdi:radiator-off" : "mdi:radiator";
    const cur = c?.attributes?.current_temperature;
    const wins = (r.windows || []).map((w) => this._window(w));
    const openWin = wins.some((w) => w.k === "open" || w.k === "tilt");
    let sub = K.t + (cur != null && kind !== "na" ? ` · ${de(cur, 1)} °C` : "");
    const warn = openWin && (kind === "heat" || kind === "cool");
    if (warn) sub = `${K.t} · Fenster ${wins.find((w) => w.k === "open") ? "offen" : "gekippt"}!`;

    const pend = this._pending[r.climate];
    const target = pend ? pend.value : c?.attributes?.temperature;
    const tgt = target != null && kind !== "na" ? `<div class="tgt">
        <button class="tb" data-act="tset" data-entity="${esc(r.climate)}" data-d="-1" aria-label="kälter">−</button>
        <span class="tv">${de(target, 1)}</span>
        <button class="tb" data-act="tset" data-entity="${esc(r.climate)}" data-d="1" aria-label="wärmer">+</button></div>` : "";

    let extra = "";
    if (r.extra) {
      const p = this._num(r.extra.power), on = !isNaN(p) && p > 1;
      extra = `<button class="rx ${on ? "on" : ""}" data-act="more" data-entity="${esc(r.extra.entity)}">${icon(r.extra.icon || "mdi:power")}<span>${esc(r.extra.name)}</span>
        <b>${isNaN(p) ? "–" : Math.round(p) + " W"}</b></button>`;
    }
    return `<div class="croom ${kind} ${warn ? "warnb" : ""}" style="--a:${K.c}" data-act="more" data-entity="${esc(r.climate)}">
      <div class="crow">
        <span class="cic">${icon(ic)}</span>
        <span class="ctxt"><span class="cname">${esc(r.name)}</span><span class="csub ${warn ? "warn" : ""}">${esc(sub)}</span></span>
        ${tgt}
      </div>
      ${extra}
      <div class="cchips">
        ${this._valChip(r.temp, "mdi:thermometer", "#fb923c", " °C")}
        ${this._valChip(r.humidity, "mdi:water-percent", "#60a5fa", " %", 0)}
        ${this._winChips(r.windows)}
      </div>
    </div>`;
  }

  _therme() {
    const t = this._config.therme; if (!t) return "";
    const p = this._num(t.power), on = !isNaN(p) && p > this._config.burn_threshold;
    const winter = this._st(t.winter)?.state === "on", mode = this._st(t.mode);
    const modeChip = mode ? `<button class="chip sel" style="--cc:${winter ? "#f87171" : "#8b91a1"}" data-act="more" data-entity="${esc(t.mode)}">${icon(winter ? "mdi:snowflake-thermometer" : "mdi:weather-sunny")}${esc(mode.state)}</button>` : "";
    const vals = (t.values || []).map((v) => {
      const s = this._st(v.entity), n = this._num(v.entity);
      const unit = v.unit ?? (s?.attributes?.unit_of_measurement || "°C");
      return `<button class="tval" style="--cc:${v.color || "var(--muted)"}" data-act="more" data-entity="${esc(v.entity)}">
        ${icon(v.icon || "mdi:thermometer")}<b>${isNaN(n) ? "–" : de(n, 1)}<small>${esc(unit === "°C" ? "°" : unit)}</small></b><span>${esc(v.name)}</span></button>`;
    }).join("");
    return `<section class="panel therme ${on ? "burn" : ""}">
      <div class="hd"><span class="ttl">${icon("mdi:gas-burner")}${esc(t.name)}</span><span class="lbl"></span>${modeChip}</div>
      <div class="crow tstat" data-act="more" data-entity="${esc(t.power)}">
        <span class="cic">${icon("mdi:fire")}</span>
        <span class="ctxt"><span class="cname">${on ? "Brennt" : "Standby"}</span><span class="csub">${isNaN(p) ? "–" : Math.round(p) + " W"}${winter ? " · Wintermodus" : ""}</span></span>
      </div>
      <div class="tvals">${vals}</div>
    </section>`;
  }

  _dehum() {
    const d = this._config.dehumidifier; if (!d) return "";
    const p = this._num(d.power), on = !isNaN(p) && p > (d.threshold ?? 3);
    return `<section class="panel dehum">
      <div class="croom ${on ? "heat" : "off"}" style="--a:${on ? "#a78bfa" : "#8b91a1"}" data-act="more" data-entity="${esc(d.power)}">
        <div class="crow">
          <span class="cic">${icon("mdi:air-humidifier")}</span>
          <span class="ctxt"><span class="cname">${esc(d.name)}</span><span class="csub">${on ? "Läuft" : "Aus"} · ${isNaN(p) ? "–" : de(p, 1) + " W"}</span></span>
        </div>
        <div class="cchips">
          ${this._valChip(d.temp, "mdi:thermometer", "#fb923c", " °C")}
          ${this._valChip(d.humidity, "mdi:water-percent", "#60a5fa", " %", 0)}
          ${this._winChips(d.windows)}
        </div>
      </div>
    </section>`;
  }

  _summary() {
    const rooms = this._config.floors.flatMap((f) => f.rooms);
    let heat = 0, cool = 0; const seenW = new Set(), seenT = new Set(); let open = 0, tilt = 0, tsum = 0, tn = 0;
    for (const r of rooms) {
      const k = this._kind(this._st(r.climate));
      if (k === "heat") heat++; if (k === "cool") cool++;
      for (const w of r.windows || []) { if (seenW.has(w.contact)) continue; seenW.add(w.contact); const x = this._window(w); if (x.k === "open") open++; if (x.k === "tilt") tilt++; }
      if (r.temp && !seenT.has(r.temp)) { seenT.add(r.temp); const v = this._num(r.temp); if (!isNaN(v)) { tsum += v; tn++; } }
    }
    const chip = (c, i, t) => `<span class="sumchip" style="--c:${c}">${icon(i)}${t}</span>`;
    return [
      heat ? chip("#f87171", "mdi:radiator", `${heat} ${heat === 1 ? "heizt" : "heizen"}`) : "",
      cool ? chip("#38bdf8", "mdi:snowflake", `${cool} ${cool === 1 ? "kühlt" : "kühlen"}`) : "",
      !heat && !cool ? chip("#8b91a1", "mdi:power-off", "Alles aus") : "",
      open ? chip("#f87171", "mdi:window-open-variant", `${open} offen`) : "",
      tilt ? chip("#eab308", "mdi:window-open-variant", `${tilt} gekippt`) : "",
      !open && !tilt ? chip("#34d399", "mdi:window-closed-variant", "Fenster zu") : "",
      tn ? chip("#fb923c", "mdi:home-thermometer", `Ø ${de(tsum / tn, 1)} °C`) : "",
    ].join("");
  }

  _render(force = false) {
    if (!this._hass || !this._config || !this.shadowRoot) return;
    const sig = this._allIds().map((id) => { const s = this._st(id); return s ? s.state + s.last_updated : "-"; }).join("|") + JSON.stringify(this._pending);
    if (!force && sig === this._sig) return;
    this._sig = sig;
    const r = this.shadowRoot;
    const scrolls = [...r.querySelectorAll(".col")].map((e) => e.scrollTop);
    const cols = this._config.floors.map((f) => `
      <div class="col">
        <section class="panel floor">
          <div class="hd"><span class="ttl">${icon(f.icon || "mdi:home")}${esc(f.name)}</span></div>
          <div class="fbody">${f.rooms.map((x) => this._room(x)).join("")}</div>
        </section>
        ${(f.extras || []).map((x) => (x === "therme" ? this._therme() : x === "dehumidifier" ? this._dehum() : "")).join("")}
      </div>`).join("");
    const wasFit = r.querySelector(".wrap")?.className || "wrap clim";
    r.innerHTML = `<style>${STYLE}${CLIMATE_STYLE}</style>
      <div class="${wasFit}" style="${r.querySelector(".wrap")?.getAttribute("style") || ""}">
        <div class="chead"><span class="ctitle">${esc(this._config.title)}</span><div class="csum">${this._summary()}</div></div>
        <div class="grid">${cols}</div>
      </div>`;
    r.querySelectorAll(".col").forEach((e, i) => { e.scrollTop = scrolls[i] || 0; });
    requestAnimationFrame(() => this._fit());
  }

  _click(e) {
    const el = e.composedPath().find((n) => n.dataset && n.dataset.act);
    if (!el) return;
    e.stopPropagation();
    const { act, entity } = el.dataset;
    if (!entity) return;
    if (act === "more") {
      const ev = new Event("hass-more-info", { bubbles: true, composed: true });
      ev.detail = { entityId: entity }; this.dispatchEvent(ev);
    } else if (act === "tset") {
      const c = this._st(entity); if (!c) return;
      const a = c.attributes, step = a.target_temp_step || (a.hvac_modes?.includes("cool") ? 0.5 : 0.5);
      const cur = this._pending[entity]?.value ?? a.temperature;
      let v = Math.round((cur + Number(el.dataset.d) * step) / step) * step;
      if (a.min_temp != null) v = Math.max(a.min_temp, v);
      if (a.max_temp != null) v = Math.min(a.max_temp, v);
      const p = this._pending[entity] || {};
      clearTimeout(p.timer);
      p.value = v;
      p.timer = setTimeout(() => {           // kurz warten, damit mehrere Klicks ein Aufruf werden
        this._hass.callService("climate", "set_temperature", { entity_id: entity, temperature: v });
        setTimeout(() => { delete this._pending[entity]; this._render(true); }, 1500);
      }, 700);
      this._pending[entity] = p;
      this._render(true);
    }
  }
}

const CLIMATE_STYLE = `
.wrap.clim .grid{grid-template-columns:repeat(3,1fr)}
.chead{display:flex;align-items:center;gap:14px;margin:0 4px 14px;flex-wrap:wrap}
.ctitle{font-size:16px;color:var(--muted);font-weight:500}
.csum{display:flex;gap:8px;flex-wrap:wrap;margin-left:auto}
.sumchip{display:inline-flex;align-items:center;gap:7px;padding:6px 13px;border-radius:14px;background:color-mix(in srgb,var(--c) 10%,transparent);border:1px solid color-mix(in srgb,var(--c) 25%,transparent);font-size:14px;font-weight:600;color:var(--c)}
.sumchip ha-icon{--mdc-icon-size:16px}
.ttl ha-icon{--mdc-icon-size:18px;margin-right:10px;vertical-align:-3px;color:var(--muted)}
.floor .fbody{display:flex;flex-direction:column;gap:12px}
.croom{border-radius:22px;background:var(--tile);border:1px solid var(--tileb);padding:14px 16px;display:flex;flex-direction:column;gap:12px;cursor:pointer;transition:background .25s,border-color .25s}
.crow{display:flex;align-items:center;gap:14px;min-width:0}
.cic{width:44px;height:44px;border-radius:14px;background:rgba(255,255,255,.055);display:grid;place-items:center;color:var(--dim);flex:none}
.ctxt{flex:1;min-width:0;display:flex;flex-direction:column}
.cname{font-size:17px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.csub{font-size:13.5px;color:var(--muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.csub.warn{color:var(--red)!important;font-weight:700}
.tgt{display:flex;align-items:center;gap:2px;background:rgba(255,255,255,.04);border:1px solid var(--line);border-radius:14px;padding:3px;flex:none}
.tb{width:34px;height:34px;border-radius:11px;display:grid;place-items:center;font-size:20px;font-weight:500;color:var(--muted);text-align:center}
.tb:hover{background:rgba(255,255,255,.07);color:var(--text)}
.tv{min-width:50px;text-align:center;font-size:18px;font-weight:700;font-variant-numeric:tabular-nums}
.cchips{display:flex;gap:8px;flex-wrap:wrap}
.cchip{display:inline-flex;align-items:center;gap:6px;padding:6px 11px;border-radius:12px;background:rgba(255,255,255,.045);font-size:13.5px;font-weight:600;color:var(--text);font-variant-numeric:tabular-nums}
.cchip ha-icon{--mdc-icon-size:16px;color:var(--cc)}
.cchip.w{color:var(--cc);background:color-mix(in srgb,var(--cc) 11%,transparent)}
.cchip .wn{color:var(--muted);font-weight:500}
.croom.heat,.croom.cool,.croom.dry{background:linear-gradient(160deg,color-mix(in srgb,var(--a) 20%,transparent),color-mix(in srgb,var(--a) 4%,transparent));border-color:color-mix(in srgb,var(--a) 65%,transparent);box-shadow:0 0 22px color-mix(in srgb,var(--a) 12%,transparent)}
.croom.heat .cic,.croom.cool .cic,.croom.dry .cic{background:var(--a);color:#0f1116;box-shadow:0 0 16px color-mix(in srgb,var(--a) 55%,transparent)}
.croom.heat .csub,.croom.cool .csub,.croom.dry .csub{color:var(--a);font-weight:600}
.croom.idle{border-color:color-mix(in srgb,var(--a) 30%,transparent)}
.croom.idle .cic{color:var(--a);background:color-mix(in srgb,var(--a) 12%,transparent)}
.croom.na{border-style:dashed;border-color:rgba(248,113,113,.35)}
.croom.na .csub{color:var(--red)}
.croom.warnb{border-color:var(--red);box-shadow:0 0 22px rgba(248,113,113,.25)}
.rx{display:flex;align-items:center;gap:10px;padding:9px 12px;border-radius:14px;background:rgba(255,255,255,.035);border:1px solid var(--line);font-size:14px;font-weight:600;color:var(--muted)}
.rx ha-icon{--mdc-icon-size:18px}
.rx b{margin-left:auto;color:var(--text);font-variant-numeric:tabular-nums}
.rx.on{color:var(--orange);border-color:rgba(251,146,60,.35);background:rgba(251,146,60,.08)}
.therme .tstat{cursor:pointer;margin-bottom:12px}
.therme.burn{background:radial-gradient(110% 60% at 50% 0%,rgba(248,113,113,.14),transparent 60%),linear-gradient(180deg,#171a20,#12151b)}
.therme.burn .tstat .cic{background:#f87171;color:#0f1116;box-shadow:0 0 16px rgba(248,113,113,.55)}
.therme.burn .tstat .csub{color:#f87171;font-weight:600}
.therme .hd .chip{margin-left:auto}
.tvals{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}
.tval{display:flex;flex-direction:column;align-items:center;gap:3px;padding:10px 4px;border-radius:16px;background:var(--tile);border:1px solid var(--tileb);min-width:0;text-align:center}
.tval ha-icon{--mdc-icon-size:20px;color:var(--cc)}
.tval b{font-size:17px;font-weight:700;font-variant-numeric:tabular-nums}
.tval b small{font-size:11px;color:var(--muted);font-weight:500;margin-left:1px}
.tval span{font-size:11.5px;color:var(--muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%}
.dehum{padding:12px}
.dehum .croom{background:none;border:0;box-shadow:none;padding:4px}
.dehum .croom.heat .csub{color:var(--violet)}
.wrap.clim.fit .col{overflow-y:auto;scrollbar-width:thin;scrollbar-color:rgba(255,255,255,.15) transparent;padding-right:2px}
.wrap.clim.fit .panel{flex:none}
@container (max-width:1180px){.wrap.clim .grid{grid-template-columns:1fr 1fr}.wrap.clim .col:nth-child(2){grid-column:auto;order:0}}
@container (max-width:720px){.wrap.clim .grid{grid-template-columns:1fr}.tvals{grid-template-columns:repeat(3,1fr)}}
`;

if (!customElements.get("mg-climate-dashboard")) customElements.define("mg-climate-dashboard", MgClimateDashboard);
if (!window.customCards.some((c) => c.type === "mg-climate-dashboard"))
  window.customCards.push({ type: "mg-climate-dashboard", name: "MG Klima & Heizung", description: "Heizung, Klima, Fenster, Temperatur und Feuchte pro Raum im Glow-Stil" });


/* browser_mod-Popup mit Fernbedienung (wie bisher im Dashboard) */
const remotePopup = (title, media, remote) => {
  const t = { entity_id: remote };
  const send = (command, extra = {}) => ({ action: "call-service", service: "remote.send_command", data: { command, ...extra }, target: t });
  const b = (ic, cmd, hold) => ({ type: "custom:button-card", icon: ic, tap_action: send(cmd),
    hold_action: hold ? (typeof hold === "string" ? send(hold) : send(cmd, { hold_secs: 0.5 })) : { action: "none" } });
  const blank = { type: "custom:button-card", show_icon: false, tap_action: { action: "none" }, hold_action: { action: "none" } };
  const grid = (cards) => ({ type: "grid", columns: 3, square: false, cards });
  const app = (ic, color, activity) => ({ type: "custom:mushroom-template-card", icon: ic, icon_color: color,
    tap_action: { action: "call-service", service: "remote.turn_on", data: { activity }, target: t }, hold_action: { action: "none" } });
  return { browser_mod: { service: "browser_mod.popup", data: { title, content: { type: "vertical-stack", cards: [
    { type: "custom:mini-media-player", entity: media, toggle_power: true, sound_mode: "full", source: "icon", artwork: "cover",
      hide: { volume: true, source: true, power: true, controls: true, runtime: false, icon_state: false } },
    grid([b("mdi:power", "POWER"), b("mdi:arrow-up-bold", "DPAD_UP"), blank,
          b("mdi:arrow-left-bold", "DPAD_LEFT"), b("mdi:circle", "DPAD_CENTER", true), b("mdi:arrow-right-bold", "DPAD_RIGHT"),
          b("mdi:arrow-left", "BACK", true), b("mdi:arrow-down-bold", "DPAD_DOWN"), b("mdi:home-outline", "HOME", true)]),
    grid([b("mdi:skip-previous", "MEDIA_PREVIOUS", "MEDIA_REWIND"), b("mdi:play-pause", "MEDIA_PLAY_PAUSE", "MEDIA_STOP"), b("mdi:skip-next", "MEDIA_NEXT", "MEDIA_FAST_FORWARD"),
          b("mdi:volume-off", "MUTE"), b("mdi:volume-medium", "VOLUME_DOWN"), b("mdi:volume-high", "VOLUME_UP")]),
    grid([app("mdi:youtube", "red", "https://www.youtube.com"), app("mdi:netflix", "red", "com.netflix.ninja"), app("mdi:aws", "blue", "com.amazon.amazonvideo.livingroom")]),
  ] } } } };
};

const W = (contact, tilt, name) => ({ type: "window", entity: contact, tilt, name });
const ROOMS_DEFAULT = {
  fit_screen: true,
  tilt_threshold: 1,            // Rotation > Wert = gekippt
  remember_floor: true,         // gewählten Reiter im Browser merken
  popup_path: null,
  auto_area: true,              // Geräte aus den Home-Assistant-Bereichen automatisch im Raum-Detail anzeigen
  areas: {                      // Raum → HA-Bereich (ID oder Name). Fehlt ein Raum hier, wird nach Namen gesucht.
    // "Badezimmer": "bad_1_og",
    // "Gäste WC · Flur": ["gaste_wc", "flur"],
  },
  auto_domains: ["light", "switch", "cover", "climate", "media_player", "fan", "lock", "vacuum", "humidifier", "input_boolean"],
  exclude: [],                  // Entitäten, die nie automatisch erscheinen sollen             // z. B. "/dashboard-laptop/raume-handy": Pop-ups (#wohnzimmer …) liegen in dieser Ansicht
  floors: [
    { name: "Erdgeschoss", short: "EG", icon: "mdi:home-floor-0", rooms: [
      { name: "Wohnzimmer", icon: "mdi:sofa",
        energy: "sensor.raum_wohnzimmer_taglich", energy_year: "sensor.raum_wohnzimmer_jahrlich",
        more: [
          { entity: "light.licht_wz_couch", icon: "mdi:lightbulb-spot", name: "Couch" },
          { entity: "light.wz_licht_multimedia_switch_0", icon: "mdi:earth", name: "Lichtkugel" },
          { entity: "light.shelly1mini_348518e07550_switch_0", icon: "mdi:led-strip-variant", name: "Kranz" },
          { entity: "light.ambilight_wohnzimmer_couch", icon: "mdi:led-strip-variant", name: "Ambilight Couch" },
          { entity: "switch.steckdose_weihnachtsbeleuchtung_schalter", icon: "mdi:power-socket-eu", name: "Steckdose Treppe" },
          { entity: "media_player.wohnzimmer_2", icon: "mdi:television", name: "Fernseher",
            dom_event: remotePopup("Wohnzimmer", "media_player.wohnzimmer_2", "remote.wohnzimmer") }],
        temp: "sensor.temperatur_wohnzimmer_temperature", humidity: "sensor.temperatur_wohnzimmer_humidity", power: "sensor.gesamtleistung_raum_wohnzimmer",
        sensors: [W("binary_sensor.tur_wohnzimmer_window", "sensor.tur_wohnzimmer_rotation", "Tür"),
          { type: "climate", entity: "climate.heizung_wohn_fenster_thermostat", name: "Heizung Fenster" },
          { type: "climate", entity: "climate.heizung_wohn_tur_thermostat", name: "Heizung Tür" },
          { type: "cover", entity: "cover.rollladen_wz_tur", name: "Rollladen Tür" },
          { type: "cover", entity: "cover.shellyplus2pm_90380c386700", name: "Rollladen Fenster" },
          { type: "smoke", entity: "sensor.rauchmelder_wohnzimmer_rssi_level" }],
        controls: [
          { entity: "light.licht_ambiente_wohnzimmer", icon: "mdi:led-strip-variant", name: "Ambiente" },
          { entity: "light.licht_wz_tv", icon: "mdi:television-ambient-light", name: "TV" },
          { entity: "switch.multimedia_switch_0", state_entity: "media_player.wohnzimmer_2", icon: "mdi:speaker", name: "Medien",
            tap: "dom", dom_event: remotePopup("Wohnzimmer", "media_player.wohnzimmer_2", "remote.wohnzimmer"), hold: "toggle" }] },
      { name: "Esszimmer", icon: "mdi:silverware-fork-knife",
        energy: "sensor.raum_wohnzimmer_taglich", energy_year: "sensor.raum_wohnzimmer_jahrlich",
        more: [
          { entity: "switch.ladestation_handy", icon: "mdi:cellphone", name: "Ladestation Handy" },
          { entity: "switch.ladestation_steuerzentrale", icon: "mdi:tablet", name: "Ladestation Tablet" }],
        temp: "sensor.temperatur_wohnzimmer_temperature", humidity: "sensor.temperatur_wohnzimmer_humidity", power: "sensor.gesamtleistung_raum_wohnzimmer",
        sensors: [W("binary_sensor.tur_wohnzimmer_window", "sensor.tur_wohnzimmer_rotation", "Tür"),
          { type: "climate", entity: "climate.heizung_wohn_fenster_thermostat", name: "Heizung Fenster" },
          { type: "climate", entity: "climate.heizung_wohn_tur_thermostat", name: "Heizung Tür" },
          { type: "cover", entity: "cover.rollladen_esszimmer", name: "Rollladen" }],
        controls: [
          { entity: "light.licht_esszimmer", icon: "mdi:wall-sconce-flat", name: "Wand" },
          { entity: "light.licht_esszimmer_tisch", icon: "mdi:table-furniture", name: "Tisch" },
          { entity: "light.licht_treppe_eg_switch_0", icon: "mdi:stairs", name: "Treppe" }] },
      { name: "Küche", icon: "mdi:pot-mix",
        energy: "sensor.raum_kuche_taglich", energy_year: "sensor.raum_kuche_jahrlich",
        more: [
          { entity: "switch.siebtrager_schalter", icon: "mdi:coffee-maker", name: "Siebträger" },
          { entity: "switch.herd", icon: "mdi:stove", name: "Herd" },
          { entity: "switch.backofen_schalter", icon: "mdi:microwave", name: "Backofen" },
          { entity: "switch.dunstabzugshaube_schalter", icon: "mdi:fan", name: "Dunstabzug" },
          { entity: "switch.kuhlschrank_kuche_schalter", icon: "mdi:fridge", name: "Kühlschrank", alert_off: true },
          { entity: "light.display_kuche_display_backlight", icon: "mdi:tablet-dashboard", name: "Display" },
          { entity: "media_player.nest_mini", icon: "mdi:speaker", name: "Radio" }],
        temp: "sensor.kuche_temperature", humidity: "sensor.kuche_humidity", power: "sensor.gesamtleistung_raum_kuche",
        sensors: [W("binary_sensor.fenster_kuche_window", "sensor.fenster_kuche_rotation"),
          { type: "climate", entity: "climate.heizung_kuche_thermostat" },
          { type: "cover", entity: "cover.kuche", name: "Rollladen" },
          { type: "smoke", entity: "sensor.rauchmelder_kuche_rssi_level" },
          { type: "leak", entity: "binary_sensor.wassersensor_kuche_feuchte" }],
        controls: [
          { entity: "light.shellyplus2pm_fcb467a5efe0_switch_0", icon: "mdi:led-strip", name: "Schrank" },
          { entity: "light.shellyplus2pm_fcb467a5efe0_switch_1", icon: "mdi:ceiling-light", name: "Decke" },
          { entity: "switch.kuche_steckdose_switch_0", icon: "mdi:egg", name: "Steckdose" }] },
      { name: "Gäste WC · Flur", icon: "mdi:toilet",
        energy: "sensor.raum_gaste_wc_taglich", energy_year: "sensor.raum_gaste_wc_jahrlich",
        more: [{ entity: "lock.nuki_haustur", icon: "mdi:lock", name: "Haustür" }],
        temp: "sensor.temperatur_gaste_wc_temperature", humidity: "sensor.temperatur_gaste_wc_humidity", power: "sensor.gesamtleistung_raum_gaste_wc",
        sensors: [W("binary_sensor.fenster_gaste_wc_window", "sensor.fenster_gaste_wc_rotation"),
          { type: "door", entity: "binary_sensor.haustur_window", lock: "lock.nuki_haustur", name: "Haustür" },
          { type: "climate", entity: "climate.heizung_gaste_wc_thermostat" },
          { type: "cover", entity: "cover.rollladen_gaste_wc", name: "Rollladen" },
          { type: "smoke", entity: "sensor.rauchmelder_eingangsbereich_rssi_level" }],
        controls: [
          { entity: "light.shellyplus2pm_e86beae5a2cc_switch_1", icon: "mdi:hanger", name: "Garderobe" },
          { entity: "light.shellyplus2pm_e86beae5a2cc_switch_0", icon: "mdi:ceiling-light", name: "Flur" },
          { entity: "switch.licht_gaste_wc_switch_0", icon: "mdi:toilet", name: "WC", light: true }] },
    ] },
    { name: "Obergeschoss", short: "1.OG", icon: "mdi:home-floor-1", rooms: [
      { name: "Badezimmer", icon: "mdi:shower",
        energy: "sensor.raum_bad_1_og_taglich", energy_year: "sensor.raum_bad_1_og_jahrlich",
        more: [{ entity: "media_player.nest_mini", icon: "mdi:speaker", name: "Radio" }],
        temp: "sensor.temperatur_bad_temperatur", humidity: "sensor.temperatur_bad_luftfeuchtigkeit", power: "sensor.gesamtleistung_bad_1og",
        sensors: [W("binary_sensor.fenster_bad_1_og_window", "sensor.fenster_bad_1_og_rotation"),
          { type: "climate", entity: "climate.heizung_bad_1_og" },
          { type: "cover", entity: "cover.rollladen_bad_1_og", name: "Rollladen" }],
        controls: [
          { entity: "light.shellyplus2pm_a0a3b35d1ed4_switch_0", icon: "mdi:mirror-rectangle", name: "Spiegel" },
          { entity: "light.shellyplus2pm_a0a3b35d1ed4_switch_1", icon: "mdi:ceiling-light", name: "Decke" }] },
      { name: "Arbeitszimmer", icon: "mdi:laptop-account",
        energy: "sensor.raum_arbeitszimmer_taglich", energy_year: "sensor.raum_arbeitszimmer_jahrlich",
        temp: "sensor.temperatur_az_temperature", humidity: "sensor.temperatur_az_humidity", power: "sensor.gesamtleistung_raum_arbeitszimmer",
        sensors: [W("binary_sensor.fenster_arbeitszimmer_window", "sensor.fenster_arbeitszimmer_rotation"),
          { type: "climate", entity: "climate.heizung_buro_thermostat" },
          { type: "cover", entity: "cover.rollladen_arbeitszimmer", name: "Rollladen" },
          { type: "smoke", entity: "sensor.rauchmelder_buro_rssi_level" }],
        controls: [
          { entity: "switch.buro_schalter", icon: "mdi:desk", name: "Schreibtisch", tap: "more-info" }] },
      { name: "Schlafzimmer", icon: "mdi:bed",
        energy: "sensor.raum_schlafzimmer_taglich", energy_year: "sensor.raum_schlafzimmer_jahrlich",
        more: [
          { entity: "switch.tv_schlafzimmer_schalter", icon: "mdi:television", name: "Multimedia" },
          { entity: "switch.warmeunterlage_manu", icon: "mdi:heat-wave", name: "Wärmebett" }],
        temp: "sensor.temperatur_wz_temperature", humidity: "sensor.temperatur_wz_humidity", power: "sensor.gesamtleistung_raum_schlafzimmer",
        sensors: [W("binary_sensor.schlafzimmer_links_window", "sensor.schlafzimmer_links_rotation", "links"),
          W("binary_sensor.schlafzimmer_rechts_window", "sensor.schlafzimmer_rechts_rotation", "rechts"),
          { type: "cover", entity: "cover.shellyplus2pm_fcb467a57a58", name: "Rollladen links" },
          { type: "cover", entity: "cover.rollladen_sz_rechts", name: "Rollladen rechts" },
          { type: "smoke", entity: "sensor.rauchmelder_schlafzimmer_rssi_level" }],
        controls: [
          { entity: "light.shellyplus1pm_d48afc77a12c_switch_0", icon: "mdi:floor-lamp", name: "Nachtlicht" },
          { entity: "light.ikea_gluhlampe_licht", icon: "mdi:lightbulb", name: "Decke" },
          { entity: "media_player.schlafzimmer_2", icon: "mdi:multimedia", name: "TV",
            tap: "dom", dom_event: remotePopup("Schlafzimmer", "media_player.schlafzimmer_2", "remote.schlafzimmer") }] },
    ] },
    { name: "Dachgeschoss", short: "DG", icon: "mdi:home-floor-2", rooms: [
      { name: "Bad Kinder", icon: "mdi:bathtub",
        energy: "sensor.raum_bad_kinder_taglich", energy_year: "sensor.raum_bad_kinder_jahrlich",
        temp: "sensor.temperatur_bad_kinder_temperatur", humidity: "sensor.temperatur_bad_kinder_luftfeuchtigkeit", power: "sensor.gesamtleistung_raum_bad_kinder",
        sensors: [W("binary_sensor.fenster_bad_kinder_window", "sensor.fenster_bad_kinder_rotation"),
          { type: "climate", entity: "climate.heizung_bad_kinder" },
          { type: "cover", entity: "cover.rollladen_bad_kinder", name: "Rollladen" },
          { type: "smoke", entity: "sensor.rauchmelder_bad_kinder_rssi_level" }],
        controls: [
          { entity: "switch.bad_kinder_licht_switch_0", icon: "mdi:light-flood-down", name: "Licht", light: true },
          { entity: "switch.bad_kinder_bodenheizung_switch_1", power: "sensor.bad_kinder_bodenheizung_switch_1_power", icon: "mdi:heat-wave", name: "Boden" }] },
      { name: "Lena", icon: "mdi:horse-human",
        energy: "sensor.raum_lena_taglich", energy_year: "sensor.raum_lena_jahrlich",
        more: [{ entity: "media_player.tv_lena_2", icon: "mdi:television", name: "TV" }],
        temp: "sensor.temperatur_lena_temperature", humidity: "sensor.temperatur_lena_humidity", power: "sensor.gesamtleistung_raum_lena",
        sensors: [W("binary_sensor.fenster_lena_window", "sensor.fenster_lena_rotation"),
          { type: "climate", entity: "climate.heizung_lena_thermostat" },
          { type: "ac", entity: "climate.daikin_lena_mqtt_hvac", name: "Klima" },
          { type: "smoke", entity: "sensor.rauchmelder_lena_rssi_level" }],
        controls: [
          { entity: "light.ambilight_lena", icon: "mdi:led-strip-variant", name: "Ambilight" },
          { entity: "switch.multimedia_lena_switch_0", icon: "mdi:television", name: "Multimedia", tap: "more-info" }] },
      { name: "Tom", icon: "mdi:weight-lifter",
        energy: "sensor.raum_tom_taglich", energy_year: "sensor.raum_tom_jahrlich",
        more: [{ entity: "media_player.tv_tom", icon: "mdi:television", name: "TV" }],
        temp: "sensor.temperatur_tom_temperatur", humidity: "sensor.temperatur_tom_luftfeuchtigkeit", power: "sensor.gesamtleistung_raum_tom",
        sensors: [W("binary_sensor.fenster_tom_links", null, "links"), W("binary_sensor.fenster_tom_rechts", null, "rechts"),
          { type: "climate", entity: "climate.heizung_tom_thermostat" },
          { type: "ac", entity: "climate.daikin_tom_mqtt_hvac", name: "Klima" },
          { type: "smoke", entity: "sensor.rauchmelder_tom_rssi_level" }],
        controls: [
          { entity: "light.tom_ambilight", icon: "mdi:television-ambient-light", name: "Ambilight" },
          { entity: "switch.multimedia_tom_schalter", icon: "mdi:sony-playstation", name: "Multimedia", tap: "more-info" }] },
    ] },
    { name: "Keller", short: "Keller", icon: "mdi:home-floor-negative-1", rooms: [
      { name: "Waschkeller", icon: "mdi:washing-machine",
        energy: "sensor.raum_keller_taglich", energy_year: "sensor.raum_keller_jahrlich",
        more: [
          { entity: "switch.serverschrank_switch_0", icon: "mdi:server", name: "Serverschrank", tap: "more-info", alert_off: true },
          { entity: "switch.luftentfeuchter_keller_schalter", icon: "mdi:air-humidifier", name: "Luftentfeuchter" },
          { entity: "binary_sensor.basisstation_connected", icon: "mdi:fire-alert", name: "Rauchmelder-Basis" }],
        temp: "sensor.ht_keller_temperatur_keller", humidity: "sensor.ht_keller_luftfeuchtigkeit_keller", power: "sensor.gesamtleistung_raum_keller",
        sensors: [W("binary_sensor.fenster_keller_window", "sensor.fenster_keller_rotation"),
          { type: "smoke", entity: "sensor.rauchmelder_waschkeller_rssi_level" },
          { type: "leak", entity: "binary_sensor.wassersensor_keller_feuchte" }],
        controls: [
          { entity: "light.licht_keller_switch_0", icon: "mdi:lightbulb-fluorescent-tube", name: "Licht" },
          { entity: "switch.waschmaschine_switch_0", power: "sensor.waschmaschine_switch_0_power", icon: "mdi:washing-machine", name: "Waschen", tap: "more-info" },
          { entity: "switch.trockner_switch_0", power: "sensor.trockner_switch_0_power", icon: "mdi:tumble-dryer", name: "Trockner", tap: "more-info" }] },
      { name: "Kino · Heizung", icon: "mdi:theater",
        energy: "sensor.raum_kino_taglich", energy_year: "sensor.raum_kino_jahrlich",
        more: [{ entity: "switch.brennwerttherme_switch_0", icon: "mdi:gas-burner", name: "Therme", tap: "more-info", alert_off: true }],
        temp: "sensor.temperatur_kino_temperature", humidity: "sensor.temperatur_kino_humidity",
        power: ["sensor.gesamtleistung_raum_kino", "sensor.gesamtleistung_raum_heizungsraum"],
        sensors: [W("binary_sensor.fenster_kino_window", "sensor.fenster_kino_rotation"),
          { type: "smoke", entity: "sensor.rauchmelder_heizungsraum_rssi_level" }],
        controls: [
          { entity: "switch.shellyplusplugs_d4d4da361dac_switch_0", icon: "mdi:bike", name: "Pain Cave" },
          { entity: "media_player.heimkino", icon: "mdi:television", name: "Heimkino" }] },
      { name: "Vorratsraum", icon: "mdi:food-apple",
        energy: "sensor.raum_vorratsraum_taglich", energy_year: "sensor.raum_vorratsraum_jahrlich",
        temp: "sensor.temperatur_vorratsraum_temperatur", humidity: "sensor.temperatur_vorratsraum_luftfeuchtigkeit", power: "sensor.gesamtleistung_raum_vorratsraum",
        sensors: [{ type: "climate", entity: "climate.shellytrv_b4e3f9d9cf3f", name: "Heizung Treppenhaus" }],
        controls: [
          { entity: "light.licht_vorratsraum", icon: "mdi:lightbulb", name: "Licht" },
          { entity: "switch.kuhltruhe_keller_schalter", icon: "mdi:fridge", name: "Eisfach", tap: "more-info", alert_off: true }] },
    ] },
    { name: "Garten & Garage", short: "Außen", icon: "mdi:home-group", rooms: [
      { name: "Garten", icon: "mdi:grass",
        energy: "sensor.raum_garten_taglich", energy_year: "sensor.raum_garten_jahrlich",
        more: [
          { entity: "light.licht_terrasse_links_switch_0", icon: "mdi:wall-sconce", name: "Terrasse links" },
          { entity: "switch.steckdose_garten_switch_0", icon: "mdi:power-socket-eu", name: "Steckdose Garten" }],
        temp: "sensor.temperatur_fuhler_therme_temperatur", humidity: "sensor.wetterstation_garten_humidity", power: "sensor.gesamtleistung_raum_garten",
        sensors: [{ type: "door", entity: "binary_sensor.garagentur_window", lock: "binary_sensor.garagentur_schlussel_window", name: "Garagentür" },
          { type: "cover", entity: "cover.markise", name: "Markise", icon: "mdi:storefront-outline" }],
        controls: [
          { entity: "light.licht_terrasse_switch_0", icon: "mdi:bulkhead-light", name: "Terrasse" },
          { entity: "light.wiz_terrassenlicht", icon: "mdi:wall", name: "Wand" },
          { entity: "switch.gartenpumpe_switch_0", icon: "mdi:water-pump", name: "Pumpe" }] },
      { name: "Garage", icon: "mdi:garage",
        energy: "sensor.raum_garage_taglich", energy_year: "sensor.raum_garage_jahrlich",
        more: [
          { entity: "switch.steckdose_garage_vorne_switch_0", icon: "mdi:scooter-electric", name: "Roller" },
          { entity: "switch.grill_switch_0", icon: "mdi:grill", name: "Grill" },
          { entity: "switch.balkonkraftwerk", icon: "mdi:solar-panel", name: "BKW" },
          { entity: "switch.balkonkraftwerk_zwei", icon: "mdi:solar-panel", name: "BKW 2" },
          { entity: "cover.markise", icon: "mdi:storefront-outline", name: "Markise" }],
        temp: "sensor.temperatur_fuhler_therme_temperatur", humidity: "sensor.wetterstation_garten_humidity", power: "sensor.gesamtleistung_raum_garage",
        sensors: [{ type: "garage", entity: "sensor.garage_status", name: "Tor" },
          { type: "door", entity: "binary_sensor.garagentur_window", lock: "binary_sensor.garagentur_schlussel_window", name: "Garagentür" },
          { type: "smoke", entity: "sensor.rauchmelder_garage_rssi_level" }],
        controls: [
          { entity: "light.licht_garage_switch_0", icon: "mdi:led-strip", name: "Licht" },
          { entity: "switch.garagentor_switch_0", state_entity: "sensor.garage_status", on_states: "open|opening|closing",
            icon: "mdi:garage-open-variant", name: "Tor", confirm: true },
          { entity: "switch.kuhlschrank_garage_switch_0", icon: "mdi:fridge-outline", name: "Kühlschrank", tap: "more-info", alert_off: true }] },
    ] },
  ],
};


class MgRoomsDashboard extends MgClimateDashboard {
  getCardSize() { return 14; }

  setConfig(config) {
    // floors werden komplett ersetzt, wenn sie in der Konfiguration stehen
    const c = merge(ROOMS_DEFAULT, config || {});
    if (config?.floors) c.floors = config.floors;
    this._config = c;
    this._pending = {};
    this._sig = null;
    if (this._floor == null) {
      let saved = null;
      try { saved = c.remember_floor ? localStorage.getItem("mg-rooms-floor") : null; } catch (e) {}
      this._floor = saved != null && (saved === "all" || c.floors[Number(saved)]) ? saved : (c.default_floor ?? "all");
    }
    if (this._hass) this._render(true);
  }

  _allIds() {
    const ids = [];
    for (const f of this._config.floors) for (const r of f.rooms) {
      ids.push(r.temp, r.humidity, ...[].concat(r.power || []));
      for (const s of r.sensors || []) ids.push(s.entity, s.tilt, s.lock);
      for (const c of r.controls || []) ids.push(c.entity, c.power, c.state_entity);
      for (const c of r.more || []) ids.push(typeof c === "string" ? c : c.entity, c.power);
      ids.push(r.energy, r.energy_year);
      const au = this._auto(r);
      for (const x of [...au.items, ...au.sec, ...au.clim]) ids.push(x.entity);
    }
    return ids.filter(Boolean).concat(this._hass?.entities ? [] : []);
  }

  _match(v, keys) { return String(keys).toLowerCase().split("|").includes(String(v).toLowerCase()); }

  /* ---------- Home-Assistant-Bereiche ---------- */
  _norm(x) { return String(x || "").toLowerCase().replace(/ä/g, "a").replace(/ö/g, "o").replace(/ü/g, "u").replace(/ß/g, "ss").replace(/[^a-z0-9]/g, ""); }

  _entArea(id) {
    const e = this._hass?.entities?.[id];
    if (!e) return null;
    return e.area_id || this._hass.devices?.[e.device_id]?.area_id || null;
  }

  /* Bereiche eines Raums: aus areas-Zuordnung, room.area oder per Namensvergleich */
  _roomAreas(room) {
    const areas = this._hass?.areas;
    if (!areas || room.area === false) return [];
    this._areaCache = this._areaCache?.ref === areas ? this._areaCache : { ref: areas, map: new Map() };
    if (this._areaCache.map.has(room)) return this._areaCache.map.get(room);
    const list = Object.values(areas);
    const find = (key) => {
      const n = this._norm(key);
      return list.find((a) => a.area_id === key || this._norm(a.area_id) === n || this._norm(a.name) === n)
        || list.find((a) => n.length >= 4 && (this._norm(a.name).startsWith(n) || this._norm(a.area_id).startsWith(n)));
    };
    const wanted = [].concat(room.area || this._config.areas?.[room.name] || room.name.split(/[·•|,]/).map((x) => x.trim()));
    const res = [...new Set(wanted.map(find).filter(Boolean).map((a) => a.area_id))];
    this._areaCache.map.set(room, res);
    return res;
  }

  /* Alle Bereichs-IDs, die irgendeinem Raum gehören */
  _claimed() {
    const ref = this._hass?.areas;
    if (this._claimCache?.ref === ref) return this._claimCache.set;
    const set = new Set();
    for (const f of this._config.floors) for (const r of f.rooms) this._roomAreas(r).forEach((a) => set.add(a));
    this._claimCache = { ref, set };
    return set;
  }

  /* Gehört eine fest eingetragene Entität (noch) in diesen Raum? Wurde sie in HA in einen anderen Raum verschoben, nicht mehr. */
  _inRoom(id, room) {
    if (!this._config.auto_area || !id) return true;
    const a = this._entArea(id), mine = this._roomAreas(room);
    if (!a || !mine.length || mine.includes(a)) return true;
    return !this._claimed().has(a);
  }

  /* Automatisch gefundene Entitäten eines Raums */
  _auto(room) {
    if (!this._config.auto_area || !this._hass?.entities) return { items: [], sec: [], clim: [] };
    const key = this._hass.entities;
    this._autoCache = this._autoCache?.ref === key && this._autoCache.areas === this._hass.areas ? this._autoCache : { ref: key, areas: this._hass.areas, map: new Map() };
    if (this._autoCache.map.has(room)) return this._autoCache.map.get(room);
    const mine = this._roomAreas(room), out = { items: [], sec: [], clim: [] };
    if (mine.length) {
      const known = new Set([...(room.controls || []), ...(room.more || [])].map((c) => (typeof c === "string" ? c : c.entity))
        .concat((room.sensors || []).flatMap((x) => [x.entity, x.lock, x.tilt]), [].concat(room.power || []), [room.temp, room.humidity]));
      for (const c of room.controls || []) if (c.state_entity) known.add(c.state_entity);
      const ex = new Set(this._config.exclude || []), doms = this._config.auto_domains || [];
      const areaNames = mine.map((a) => this._hass.areas[a]?.name).filter(Boolean);
      for (const [id, e] of Object.entries(this._hass.entities)) {
        if (known.has(id) || ex.has(id) || e.hidden || e.entity_category || !this._st(id)) continue;
        if (!mine.includes(this._entArea(id))) continue;
        const dom = id.split(".")[0], st = this._st(id);
        let name = st.attributes.friendly_name || id;
        for (const an of areaNames) if (name.toLowerCase().startsWith(an.toLowerCase() + " ")) name = name.slice(an.length + 1);
        if (dom === "climate") { out.clim.push({ type: (st.attributes.hvac_modes || []).includes("cool") ? "ac" : "climate", entity: id, name, auto: true }); continue; }
        if (dom === "binary_sensor") {
          const t = { window: "window", door: "door", garage_door: "door", opening: "window", smoke: "smoke", gas: "smoke", moisture: "leak" }[st.attributes.device_class];
          if (t) out.sec.push({ type: t, entity: id, name, auto: true });
          continue;
        }
        if (doms.includes(dom)) out.items.push({ entity: id, name, icon: st.attributes.icon, auto: true, tap: dom === "lock" ? "more-info" : undefined });
      }
      out.items.sort((a, b) => a.name.localeCompare(b.name, "de"));
    }
    this._autoCache.map.set(room, out);
    return out;
  }

  _roomLit(r) {
    return (r.controls || []).some((c) => this._inRoom(c.entity, r) && (() => { const k = this._ctrl(c); return k.isLight && k.on; })())
      || this._auto(r).items.some((c) => c.entity.startsWith("light.") && this._st(c.entity)?.state === "on");
  }

  /* ---------- Statussymbole (lvl 0 = ruhig, 1 = aktiv, 2 = Alarm) ---------- */
  _sensor(s) {
    const st = this._st(s.entity), v = st?.state, n = s.name ? s.name + ": " : "";
    const R = (i, c, lvl, tip, txt = "", extra = {}) => ({ i: s.icon && lvl === 0 ? s.icon : i, c, lvl, tip: n + tip, txt, ...extra });
    if (!st) return R("mdi:help-circle-outline", "#5d6373", 0, "Entität fehlt", "", { na: true });
    switch (s.type) {
      case "window": {
        const x = this._window({ contact: s.entity, tilt: s.tilt });
        if (x.k === "na") return R("mdi:window-closed-variant", "#8b91a1", 0, "nicht erreichbar", "", { na: true });
        if (x.k === "tilt") return R("mdi:window-open-variant", "#eab308", 1, "gekippt", "gekippt", { win: true });
        if (x.k === "open") return R("mdi:window-open-variant", "#f87171", 1, "offen", "offen", { win: true });
        return R("mdi:window-closed-variant", "#8b91a1", 0, "Fenster zu");
      }
      case "climate": {
        const k = this._kind(st), t = st.attributes?.temperature;
        if (k === "na") return R("mdi:radiator-disabled", "#8b91a1", 0, "Heizung nicht erreichbar", "", { na: true });
        if (k === "heat") return R("mdi:radiator", "#f87171", 1, `heizt${t != null ? " auf " + de(t, 1) + " °C" : ""}`, t != null ? de(t, 1) + "°" : "", { heat: true });
        if (k === "off") return R("mdi:radiator-off", "#8b91a1", 0, "Heizung aus");
        return R("mdi:radiator", "#fb923c", 0.5, `bereit${t != null ? " · " + de(t, 1) + " °C" : ""}`);
      }
      case "ac": {
        const t = st.attributes?.temperature;
        if (OFFLINE.includes(v)) return R("mdi:snowflake-alert", "#8b91a1", 0, "Klima nicht erreichbar", "", { na: true });
        if (v === "off") return R("mdi:snowflake-off", "#8b91a1", 0, "Klima aus");
        const m = { cool: ["mdi:snowflake", "#38bdf8", "kühlt"], dry: ["mdi:water-percent", "#a78bfa", "entfeuchtet"], heat: ["mdi:fire", "#f87171", "heizt"], fan_only: ["mdi:fan", "#94a3b8", "lüftet"] }[v]
          || ["mdi:air-conditioner", "#38bdf8", v];
        return R(m[0], m[1], 1, `${m[2]}${t != null ? " auf " + de(t, 1) + " °C" : ""}`, t != null ? de(t, 1) + "°" : "", { heat: v === "heat", cool: v === "cool" });
      }
      case "smoke":
        if (OFFLINE.includes(v)) return R("mdi:fire-alert", "#f87171", 2, "Rauchmelder offline", "offline");
        if (v === "on") return R("mdi:fire-alert", "#f87171", 2, "Rauch erkannt!", "Rauch!");
        return R("mdi:fire", "#34d399", 0, "Rauchmelder OK");
      case "leak":
        if (v === "on") return R("mdi:water-alert", "#f87171", 2, "Wasser erkannt!", "Wasser!");
        if (OFFLINE.includes(v)) return R("mdi:water-alert", "#8b91a1", 0, "Wassersensor offline", "", { na: true });
        return R("mdi:water-off", "#34d399", 0, "Kein Wasser");
      case "door": {
        const lk = this._st(s.lock), lv = lk?.state, isLock = s.lock?.startsWith("lock.");
        if (v === "on") return R("mdi:door-open", "#f87171", 1, "offen", "offen");
        const unl = isLock ? lv === "unlocked" || lv === "open" : lv === "on";
        if (lk && OFFLINE.includes(lv)) return R("mdi:lock-alert", "#f87171", 1, "Schloss nicht erreichbar", "?");
        if (unl) return R("mdi:door-closed", "#fb923c", 1, "zu, nicht abgeschlossen", "auf");
        return R(lk ? "mdi:door-closed-lock" : "mdi:door-closed", "#34d399", 0, lk ? "abgeschlossen" : "zu");
      }
      case "garage":
        if (v === "closed") return R("mdi:garage-variant-lock", "#34d399", 0, "Tor zu");
        if (v === "open") return R("mdi:garage-open-variant", "#f87171", 1, "Tor offen", "offen");
        if (v === "opening" || v === "closing") return R(v === "opening" ? "mdi:arrow-up" : "mdi:arrow-down", "#eab308", 1, v === "opening" ? "Tor öffnet" : "Tor schließt", v === "opening" ? "öffnet" : "schließt", { pulse: true });
        return R("mdi:garage-alert-variant", "#f87171", 1, "Tor nicht erreichbar", "?");
      case "cover": {
        const pos = st.attributes?.current_position, ic = s.icon || "mdi:window-shutter";
        if (OFFLINE.includes(v)) return R(ic, "#8b91a1", 0, "nicht erreichbar", "", { na: true });
        if (v === "opening" || v === "closing") return R(v === "opening" ? "mdi:arrow-up" : "mdi:arrow-down", "#60a5fa", 1, v === "opening" ? "fährt hoch" : "fährt runter", "", { pulse: true });
        if (v === "open") return R(s.icon || "mdi:window-shutter-open", "#60a5fa", 1, pos != null && pos < 100 ? `${pos} % offen` : "offen", pos != null && pos < 100 ? pos + "%" : "");
        return R(ic, "#8b91a1", 0, "zu");
      }
      default:
        return R(s.icon || "mdi:information-outline", "#8b91a1", v === "on" ? 1 : 0, v);
    }
  }

  /* ---------- Schaltflächen ---------- */
  _ctrl(c) {
    const st = this._st(c.entity), dom = (c.entity || "").split(".")[0];
    const src = c.state_entity ? this._st(c.state_entity) : st, v = src?.state;
    const isLight = dom === "light" || c.light;
    const out = { on: false, run: false, bad: false, na: false, c: isLight ? "#f7b733" : "#fb923c", label: c.name || "", isLight };
    if (!st || OFFLINE.includes(st.state)) { out.na = true; return out; }
    out.on = c.on_states ? this._match(v, c.on_states) : ["on", "playing", "paused", "open", "heat", "cool"].includes(v);
    if (isLight && out.on && Array.isArray(st.attributes?.rgb_color)) {
      const [r, g, b] = st.attributes.rgb_color;
      if (r + g + b > 60) out.c = `rgb(${r},${g},${b})`;
    }
    if (c.power) {
      const p = this._num(c.power);
      if (!isNaN(p) && p > (c.threshold ?? 1)) { out.run = true; out.on = true; out.c = "#f87171"; out.label += ` · ${p >= 1000 ? de(p / 1000, 1) + " kW" : Math.round(p) + " W"}`; }
    }
    if (c.alert_off && st.state === "off") { out.bad = true; out.c = "#f87171"; }
    return out;
  }

  _defTap(c) {
    if (c.tap) return c.tap === "more" ? "more-info" : c.tap;
    const dom = (c.entity || "").split(".")[0];
    return ["light", "switch", "fan", "input_boolean"].includes(dom) ? "toggle" : ["script", "scene"].includes(dom) ? "run" : "more-info";
  }

  _fmtPow(id) {
    const p = this._num(id);
    return isNaN(p) ? "–" : p >= 1000 ? de(p / 1000, 1) + " kW" : Math.round(p) + " W";
  }

  _tile(r, fi, ri) {
    const nav = r.navigate && r.navigate.startsWith("#") && this._config.popup_path ? this._config.popup_path + r.navigate : r.navigate;
    const sens = (r.sensors || []).map((s) => ({ s, x: this._sensor(s) }));
    const ctrls = (r.controls || []).map((c, ci) => ({ c, ci, x: this._ctrl(c) })).filter((k) => this._inRoom(k.c.entity, r));
    const lit = this._roomLit(r);
    const warmCold = sens.some((k) => k.x.heat || k.x.cool);
    const winOpen = sens.some((k) => k.x.win);
    const alert = sens.some((k) => k.x.lvl >= 2) || ctrls.some((k) => k.x.bad) || (winOpen && warmCold);
    const sub = [];
    const t = this._num(r.temp), h = this._num(r.humidity);
    if (r.temp) sub.push(`<span><b>${isNaN(t) ? "–" : de(t, 1)}</b> °C</span>`);
    if (r.humidity) sub.push(`<span><b>${isNaN(h) ? "–" : de(h, 0)}</b> %</span>`);
    for (const p of [].concat(r.power || [])) sub.push(`<span><b>${this._fmtPow(p).replace(/ (k?W)$/, "</b> $1")}</span>`);
    const warn = winOpen && warmCold ? `<div class="rwarn">${icon("mdi:alert")}Fenster offen und ${sens.some((k) => k.x.cool) ? "Klima kühlt" : "Heizung an"}</div>` : "";

    const chips = sens.map(({ s, x }) => `<button class="sc ${x.lvl >= 2 ? "al" : x.lvl >= 1 ? "on" : x.lvl > 0 ? "soft" : ""} ${x.na ? "na" : ""} ${x.pulse ? "pulse" : ""}"
        style="--cc:${x.c}" data-act="more" data-entity="${esc(s.entity)}" title="${esc(x.tip)}" aria-label="${esc(x.tip)}">${icon(x.i)}${x.txt ? `<span>${esc(x.txt)}</span>` : ""}</button>`).join("");
    const btns = ctrls.map(({ c, ci, x }) => {
      const tap = this._defTap(c), hold = c.hold || "more-info";
      return `<button class="cb ${x.on ? "on" : ""} ${x.run ? "run" : ""} ${x.bad ? "bad" : ""} ${x.na ? "na" : ""}" style="--cc:${x.c}"
        data-act="ctl" data-f="${fi}" data-r="${ri}" data-c="${ci}" data-tap="${tap}" data-hold="${hold}" data-entity="${esc(c.entity)}"
        title="${esc(c.name || c.entity)}${x.na ? " – nicht erreichbar" : ""}">${icon(c.icon || "mdi:power")}<span>${esc(x.label)}</span></button>`;
    }).join("");

    return `<div class="rt ${lit ? "lit" : ""} ${alert ? "alert" : ""}" ${nav ? `data-act="nav" data-nav="${esc(nav)}"` : `data-act="room" data-f="${fi}" data-r="${ri}"`}>
      <div class="rtop">
        <span class="rico">${icon(r.icon || "mdi:home")}</span>
        <span class="rtx"><span class="rname">${esc(r.name)}</span><span class="rsub">${sub.join('<i class="dot"></i>')}</span></span>
        <span class="rgo">${icon("mdi:chevron-right")}</span>
      </div>
      ${chips ? `<div class="rsens">${chips}</div>` : ""}
      ${warn}
      ${btns ? `<div class="rctl">${btns}</div>` : ""}
    </div>`;
  }

  _summary(floors) {
    const seenL = new Set(), seenW = new Set(), seenS = new Set();
    let lights = 0, open = 0, tilt = 0, smokeBad = 0, leak = 0, heat = 0;
    for (const f of floors) for (const r of f.rooms) {
      for (const c of [...(r.controls || []).filter((c) => this._inRoom(c.entity, r)), ...this._auto(r).items]) {
        if (seenL.has(c.entity)) continue; seenL.add(c.entity);
        const x = this._ctrl(c); if (x.isLight && x.on) lights++;
      }
      for (const s of r.sensors || []) {
        const key = s.type + s.entity; if (seenS.has(key)) continue; seenS.add(key);
        const x = this._sensor(s);
        if (s.type === "window" && !seenW.has(s.entity)) { seenW.add(s.entity); if (x.txt === "offen") open++; if (x.txt === "gekippt") tilt++; }
        if (s.type === "smoke" && x.lvl >= 2) smokeBad++;
        if (s.type === "leak" && x.lvl >= 2) leak++;
        if (s.type === "climate" && x.heat) heat++;
      }
    }
    const chip = (c, i, t) => `<span class="sumchip" style="--c:${c}">${icon(i)}${t}</span>`;
    return [
      chip(lights ? "#f7b733" : "#8b91a1", lights ? "mdi:lightbulb-on" : "mdi:lightbulb-off", lights ? `${lights} ${lights === 1 ? "Licht" : "Lichter"} an` : "Licht aus"),
      open ? chip("#f87171", "mdi:window-open-variant", `${open} offen`) : "",
      tilt ? chip("#eab308", "mdi:window-open-variant", `${tilt} gekippt`) : "",
      !open && !tilt ? chip("#34d399", "mdi:window-closed-variant", "Fenster zu") : "",
      heat ? chip("#f87171", "mdi:radiator", `${heat} ${heat === 1 ? "heizt" : "heizen"}`) : "",
      smokeBad ? chip("#f87171", "mdi:fire-alert", `${smokeBad} Rauchmelder`) : chip("#34d399", "mdi:fire", "Rauchmelder OK"),
      leak ? chip("#f87171", "mdi:water-alert", "Wasser!") : "",
    ].join("");
  }

  _render(force = false) {
    if (!this._hass || !this._config || !this.shadowRoot) return;
    if (!this._holdBound) this._bindHold();
    if (this._drag && !force) { this._dirty = true; return; }   // Schieberegler wird gerade bedient
    const sig = this._allIds().map((id) => { const s = this._st(id); return s ? s.state + s.last_updated : "-"; }).join("|")
      + this._regSig() + this._floor + JSON.stringify(this._pending) + (this._open ? this._open.f + "/" + this._open.r + (this._hist?.[this._hkey()]?.t || "") : "");
    if (!force && sig === this._sig) return;
    this._sig = sig;
    const r = this.shadowRoot, fl = this._config.floors;
    if (!r.getElementById("main")) {
      r.innerHTML = `<style>${STYLE}${CLIMATE_STYLE}${ROOMS_STYLE}</style><div id="main"></div><dialog class="dlg" id="dlg"></dialog>`;
      const d = r.getElementById("dlg");
      d.addEventListener("close", () => { this._open = null; this._render(true); });
      d.addEventListener("click", (e) => { if (e.target === d) d.close(); });
      r.addEventListener("pointerdown", (e) => { if (e.composedPath()[0]?.classList?.contains("sl")) this._drag = true; }, true);
      const up = () => { if (this._drag) { this._drag = false; if (this._dirty) { this._dirty = false; setTimeout(() => this._render(true), 400); } } };
      window.addEventListener("pointerup", up); window.addEventListener("pointercancel", up);
      r.addEventListener("input", (e) => { const t = e.composedPath()[0]; if (t?.classList?.contains("sl")) { t.style.setProperty("--v", t.value + "%"); const l = t.closest(".dr")?.querySelector(".dval"); if (l) l.textContent = t.value + " %"; } });
      r.addEventListener("change", (e) => { const t = e.composedPath()[0]; if (t?.classList?.contains("sl")) this._hass.callService("light", "turn_on", { entity_id: t.dataset.entity, brightness_pct: Number(t.value) }); });
    }
    const sel = this._floor === "all" ? fl.map((f, i) => [f, i]) : [[fl[Number(this._floor)], Number(this._floor)]].filter((x) => x[0]);
    const tabs = [`<button class="rtab ${this._floor === "all" ? "sel" : ""}" data-act="floor" data-v="all">${icon("mdi:home-city-outline")}<span>Alle</span></button>`,
      ...fl.map((f, i) => {
        const lit = f.rooms.some((x) => this._roomLit(x));
        return `<button class="rtab ${String(i) === String(this._floor) ? "sel" : ""}" data-act="floor" data-v="${i}">${icon(f.icon || "mdi:home")}<span>${esc(f.short || f.name)}</span>${lit ? '<i class="tdot"></i>' : ""}</button>`;
      })].join("");
    const body = sel.map(([f, fi]) => `
      <section class="rfloor">
        ${this._floor === "all" ? `<div class="rfl">${icon(f.icon || "mdi:home")}<span>${esc(f.name)}</span></div>` : ""}
        <div class="rgrid">${f.rooms.map((x, ri) => this._tile(x, fi, ri)).join("")}</div>
      </section>`).join("");
    const main = r.getElementById("main");
    const sc = main.querySelector(".rbody")?.scrollTop || 0;
    const old = main.querySelector(".wrap");
    main.innerHTML = `<div class="${old?.className || "wrap rooms"}" style="${old?.getAttribute("style") || ""}">
        <div class="rhead"><div class="rtabs">${tabs}</div><div class="csum">${this._summary(sel.map((x) => x[0]))}</div></div>
        <div class="rbody">${body}</div>
      </div>`;
    const nb = main.querySelector(".rbody"); if (nb) nb.scrollTop = this._resetScroll ? 0 : sc;
    this._resetScroll = false;

    const d = r.getElementById("dlg");
    if (this._open) {
      const ds = d.querySelector(".dbody")?.scrollTop || 0;
      d.innerHTML = this._detail(this._open.f, this._open.r);
      const db = d.querySelector(".dbody"); if (db) db.scrollTop = ds;
      if (!d.open) { try { d.showModal(); } catch (x) { d.setAttribute("open", ""); } }
    } else if (d.open) d.close();
    requestAnimationFrame(() => this._fit());
  }

  _regSig() {
    const h = this._hass;
    if (h.entities !== this._rE || h.devices !== this._rD || h.areas !== this._rA) { this._rE = h.entities; this._rD = h.devices; this._rA = h.areas; this._regN = (this._regN || 0) + 1; }
    return "#" + (this._regN || 0);
  }

  /* ================= Raum-Detail (ersetzt die Bubble-Card-Pop-ups) ================= */
  _hkey() { return this._open ? this._open.f + "-" + this._open.r : ""; }

  _openRoom(f, r) {
    this._open = { f, r };
    this._render(true);
    this._loadHist();
  }

  async _loadHist() {
    const key = this._hkey(), room = this._config.floors[this._open.f].rooms[this._open.r];
    this._hist = this._hist || {};
    const c = this._hist[key];
    if (c && Date.now() - c.t < 5 * 60000) return;
    const ids = [room.temp, room.humidity, ...[].concat(room.power || [])].filter((x) => x && this._st(x));
    if (!ids.length) return;
    const start = new Date(Date.now() - 24 * 3600000).toISOString();
    try {
      const res = await this._hass.callApi("GET", `history/period/${start}?filter_entity_id=${ids.join(",")}&end_time=${encodeURIComponent(new Date().toISOString())}&minimal_response&no_attributes`);
      const out = {};
      for (const list of res || []) {
        if (!list.length) continue;
        const id = list[0].entity_id;
        out[id] = list.map((x) => [new Date(x.last_changed || x.lu * 1000).getTime(), parseFloat(x.state ?? x.s)]).filter((x) => !isNaN(x[1]) && !isNaN(x[0]));
      }
      this._hist[key] = { t: Date.now(), data: out };
    } catch (e) {
      this._hist[key] = { t: Date.now(), data: {}, err: true };
    }
    if (this._hkey() === key) this._render(true);
  }

  _spark(pts, color, area = false) {
    if (!pts || pts.length < 2) return "";
    const W = 600, H = 90, t0 = Date.now() - 24 * 3600000, t1 = Date.now();
    const vs = pts.map((p) => p[1]); let lo = Math.min(...vs), hi = Math.max(...vs);
    if (area) lo = Math.min(0, lo);
    if (hi - lo < 0.5) { hi += 0.5; lo -= 0.5; }
    const X = (t) => ((Math.max(t, t0) - t0) / (t1 - t0)) * W, Y = (v) => H - 4 - ((v - lo) / (hi - lo)) * (H - 8);
    let d = `M${X(pts[0][0]).toFixed(1)},${Y(pts[0][1]).toFixed(1)}`;
    for (let i = 1; i < pts.length; i++) d += `H${X(pts[i][0]).toFixed(1)}V${Y(pts[i][1]).toFixed(1)}`;
    d += `H${W}`;
    const fill = area ? `<path d="${d}V${H}H0Z" fill="${color}" opacity=".16"/>` : "";
    return `<svg class="spark" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none">${fill}<path d="${d}" fill="none" stroke="${color}" stroke-width="2.2" vector-effect="non-scaling-stroke" stroke-linejoin="round"/></svg>`;
  }

  _chart(label, id, color, unit, dec, area) {
    const h = this._hist?.[this._hkey()], pts = h?.data?.[id];
    const cur = this._num(id);
    const vs = (pts || []).map((p) => p[1]);
    const mm = vs.length ? `<span>min <b>${de(Math.min(...vs), dec)}</b></span><span>max <b>${de(Math.max(...vs), dec)}</b></span>` : "";
    return `<button class="dch" style="--cc:${color}" data-act="more" data-entity="${esc(id)}">
      <div class="dchh"><span class="dchl">${esc(label)}</span><span class="dchv">${isNaN(cur) ? "–" : de(cur, dec)}<small>${unit}</small></span></div>
      ${pts ? (pts.length > 1 ? this._spark(pts, color, area) : `<div class="dch0">Keine Daten</div>`) : `<div class="dch0">${h?.err ? "Verlauf nicht verfügbar" : "Lädt …"}</div>`}
      <div class="dchm">${mm}</div></button>`;
  }

  _sw(on, entity, extra = "") { return `<button class="dsw ${on ? "on" : ""}" data-act="dtog" data-entity="${esc(entity)}" ${extra} aria-label="Schalten"><i></i></button>`; }

  _detail(fi, ri) {
    const room = this._config.floors[fi]?.rooms[ri];
    if (!room) return "";
    const seen = new Set(), items = [];
    const au = this._auto(room);
    for (const c of [...(room.controls || []), ...(room.more || []).map((m) => (typeof m === "string" ? { entity: m } : m)), ...au.items]) {
      if (!c.entity || seen.has(c.entity) || !this._inRoom(c.entity, room)) continue; seen.add(c.entity); items.push(c);
      if (c.state_entity?.startsWith("media_player.") && !seen.has(c.state_entity) && !(room.more || []).some((m) => (m.entity || m) === c.state_entity)) {
        seen.add(c.state_entity); items.push({ entity: c.state_entity, icon: "mdi:television", name: c.name, dom_event: c.dom_event });
      }
    }
    const dom = (id) => id.split(".")[0];
    const lights = items.filter((c) => dom(c.entity) === "light" || c.light);
    const media = items.filter((c) => dom(c.entity) === "media_player");
    const devices = items.filter((c) => !lights.includes(c) && !media.includes(c) && dom(c.entity) !== "cover");
    const covers = [...(room.sensors || []).filter((s) => s.type === "cover").map((s) => ({ entity: s.entity, name: s.name, icon: s.icon })),
      ...items.filter((c) => dom(c.entity) === "cover" && !(room.sensors || []).some((s) => s.entity === c.entity))];
    const clim = [...(room.sensors || []).filter((s) => (s.type === "climate" || s.type === "ac") && this._inRoom(s.entity, room)), ...au.clim];
    const sec = [...(room.sensors || []).filter((s) => ["window", "door", "smoke", "leak", "garage"].includes(s.type) && this._inRoom(s.entity, room)), ...au.sec];
    this._dlgItems = items;

    const nm = (c) => c.name || this._st(c.entity)?.attributes?.friendly_name || c.entity;
    const na = (st) => !st || OFFLINE.includes(st.state);
    const sect = (title, ic, html) => html ? `<section class="ds"><div class="dsh">${icon(ic)}${title}</div><div class="dsl">${html}</div></section>` : "";

    const lightRows = lights.map((c) => {
      const st = this._st(c.entity), x = this._ctrl(c), on = x.on;
      const modes = st?.attributes?.supported_color_modes || [];
      const dim = dom(c.entity) === "light" && (modes.some((m) => m !== "onoff") || st?.attributes?.brightness != null);
      const pct = st?.attributes?.brightness != null ? Math.round(st.attributes.brightness / 2.55) : on ? 100 : 0;
      return `<div class="dr light ${on ? "on" : ""} ${na(st) ? "na" : ""}" style="--cc:${x.c}">
        <button class="dic" data-act="more" data-entity="${esc(c.entity)}">${icon(c.icon || "mdi:lightbulb")}</button>
        <div class="dtx"><b>${esc(nm(c))}</b><span>${na(st) ? "nicht erreichbar" : on ? `an${dim ? ` · <em class="dval">${pct} %</em>` : ""}` : "aus"}</span></div>
        ${na(st) ? "" : this._sw(on, c.entity)}
        ${dim && on && !na(st) ? `<input class="sl" type="range" min="1" max="100" value="${Math.max(1, pct)}" style="--v:${on ? pct : 0}%" data-entity="${esc(c.entity)}" aria-label="Helligkeit ${esc(nm(c))}">` : ""}
      </div>`;
    }).join("");

    const coverRows = covers.map((c) => {
      const st = this._st(c.entity), v = st?.state, pos = st?.attributes?.current_position;
      const txt = na(st) ? "nicht erreichbar" : { open: pos != null && pos < 100 ? `${pos} % offen` : "offen", closed: "geschlossen", opening: "fährt hoch …", closing: "fährt runter …" }[v] || v;
      const b = (svc, ic, lbl) => `<button class="dbtn" data-act="dsvc" data-svc="cover.${svc}" data-entity="${esc(c.entity)}" aria-label="${lbl}">${icon(ic)}</button>`;
      return `<div class="dr ${v === "open" || v === "opening" ? "on" : ""}" style="--cc:#60a5fa">
        <button class="dic" data-act="more" data-entity="${esc(c.entity)}">${icon(c.icon || (v === "open" ? "mdi:window-shutter-open" : "mdi:window-shutter"))}</button>
        <div class="dtx"><b>${esc(nm(c))}</b><span>${esc(txt)}</span></div>
        <div class="dbtns">${b("open_cover", "mdi:arrow-up", "Hoch")}${b("stop_cover", "mdi:stop", "Stopp")}${b("close_cover", "mdi:arrow-down", "Runter")}</div>
      </div>`;
    }).join("");

    const climRows = clim.map((s) => {
      const st = this._st(s.entity), x = this._sensor(s), k = this._kind(st);
      const pend = this._pending[s.entity], t = pend ? pend.value : st?.attributes?.temperature, cur = st?.attributes?.current_temperature;
      const modes = st?.attributes?.hvac_modes || [];
      const onMode = s.type === "ac" ? (modes.includes("cool") ? "cool" : modes.find((m) => m !== "off")) : (modes.includes("heat") ? "heat" : modes.find((m) => m !== "off"));
      const isOff = st?.state === "off";
      const sub = na(st) ? "nicht erreichbar" : `${KIND[k]?.t || st.state}${cur != null ? ` · Raum ${de(cur, 1)} °C` : ""}`;
      return `<div class="dr ${x.lvl >= 1 ? "on" : ""} ${na(st) ? "na" : ""}" style="--cc:${x.c}">
        <button class="dic" data-act="more" data-entity="${esc(s.entity)}">${icon(x.i)}</button>
        <div class="dtx"><b>${esc(s.name || (s.type === "ac" ? "Klima" : "Heizung"))}</b><span>${esc(sub)}</span></div>
        ${t != null && !na(st) && !isOff ? `<div class="tgt">
          <button class="tb" data-act="tset" data-entity="${esc(s.entity)}" data-d="-1" aria-label="kälter">−</button>
          <span class="tv">${de(t, 1)}</span>
          <button class="tb" data-act="tset" data-entity="${esc(s.entity)}" data-d="1" aria-label="wärmer">+</button></div>` : ""}
        ${na(st) || !onMode ? "" : `<button class="dsw ${isOff ? "" : "on"}" data-act="hvac" data-entity="${esc(s.entity)}" data-mode="${isOff ? onMode : "off"}" aria-label="Ein/Aus"><i></i></button>`}
      </div>`;
    }).join("");

    const mediaRows = media.map((c) => {
      const st = this._st(c.entity), v = st?.state, on = v && !["off", "standby", "unavailable", "unknown"].includes(v);
      const a = st?.attributes || {};
      const sub = na(st) ? "nicht erreichbar" : [a.media_title, a.media_artist || a.app_name].filter(Boolean).join(" · ") || { playing: "spielt", paused: "pausiert", idle: "bereit", on: "an", off: "aus" }[v] || v;
      const b = (svc, ic, lbl) => `<button class="dbtn" data-act="dsvc" data-svc="media_player.${svc}" data-entity="${esc(c.entity)}" aria-label="${lbl}">${icon(ic)}</button>`;
      const idx = items.indexOf(c);
      return `<div class="dr ${on ? "on" : ""} ${na(st) ? "na" : ""}" style="--cc:#a78bfa">
        <button class="dic" data-act="more" data-entity="${esc(c.entity)}">${icon(c.icon || "mdi:television")}</button>
        <div class="dtx"><b>${esc(nm(c))}</b><span>${esc(sub)}</span></div>
        <div class="dbtns">${on ? b("media_previous_track", "mdi:skip-previous", "Zurück") + b("media_play_pause", v === "playing" ? "mdi:pause" : "mdi:play", "Play/Pause") + b("media_next_track", "mdi:skip-next", "Weiter") : ""}
          ${c.dom_event ? `<button class="dbtn" data-act="ddom" data-i="${idx}" aria-label="Fernbedienung">${icon("mdi:remote")}</button>` : ""}
          ${b("toggle", "mdi:power", "Ein/Aus")}</div>
      </div>`;
    }).join("");

    const devRows = devices.map((c) => {
      const st = this._st(c.entity), x = this._ctrl(c), d = dom(c.entity), v = st?.state;
      let sub = na(st) ? "nicht erreichbar" : v === "on" ? "an" : v === "off" ? "aus" : v;
      if (c.power) { const p = this._num(c.power); if (!isNaN(p)) sub += ` · ${p >= 1000 ? de(p / 1000, 1) + " kW" : Math.round(p) + " W"}`; }
      if (c.state_entity) { const sv = this._st(c.state_entity)?.state; sub = { playing: "spielt", paused: "pausiert", idle: "bereit", on: "an", off: "aus", standby: "Standby", open: "offen", closed: "zu", opening: "öffnet …", closing: "schließt …" }[sv] || sv || sub; }
      if (x.bad) sub = "aus – bitte prüfen!";
      let right = "";
      if (na(st)) right = "";
      else if (d === "lock") {
        const locked = v === "locked";
        sub = { locked: "abgeschlossen", unlocked: "aufgeschlossen", open: "geöffnet", jammed: "blockiert" }[v] || v;
        right = `<button class="dpill" data-act="dsvc" data-svc="lock.${locked ? "unlock" : "lock"}" data-entity="${esc(c.entity)}" data-confirm="1">${icon(locked ? "mdi:lock-open-variant" : "mdi:lock")}${locked ? "Aufschließen" : "Abschließen"}</button>`;
      } else if (["switch", "input_boolean", "fan"].includes(d)) {
        right = this._sw(x.on || v === "on", c.entity, c.confirm || c.alert_off || c.tap === "more-info" ? 'data-confirm="1"' : "");
      }
      return `<div class="dr ${x.on ? "on" : ""} ${x.run ? "run" : ""} ${x.bad ? "bad" : ""} ${na(st) ? "na" : ""}" style="--cc:${x.c}">
        <button class="dic" data-act="more" data-entity="${esc(c.entity)}">${icon(c.icon || "mdi:power")}</button>
        <div class="dtx"><b>${esc(nm(c))}</b><span>${esc(sub)}</span></div>${right}
      </div>`;
    }).join("");

    const TL = { window: "Fenster", door: "Tür", smoke: "Rauchmelder", leak: "Wassersensor", garage: "Garagentor" };
    const secRows = sec.map((s) => {
      const x = this._sensor(s);
      const tip = x.tip.replace(/^[^:]*: /, "");
      return `<button class="dchip ${x.lvl >= 2 ? "al" : x.lvl >= 1 ? "on" : ""} ${x.na ? "na" : ""}" style="--cc:${x.c}" data-act="more" data-entity="${esc(s.entity)}">
        ${icon(x.i)}<span><b>${esc(s.name ? (s.type === "window" && !/^fenster/i.test(s.name) ? "Fenster " + s.name : s.name) : TL[s.type])}</b><small>${esc(tip)}</small></span></button>`;
    }).join("");

    const charts = [
      room.temp ? this._chart("Temperatur", room.temp, "#fb923c", " °C", 1) : "",
      room.humidity ? this._chart("Luftfeuchte", room.humidity, "#60a5fa", " %", 0) : "",
      ...[].concat(room.power || []).map((p, i, a) => this._chart(a.length > 1 ? `Leistung ${i + 1}` : "Leistung", p, "#34d399", " W", 0, true)),
    ].join("");

    const eT = this._num(room.energy), eY = this._num(room.energy_year);
    const energy = (room.energy && this._st(room.energy)) || (room.energy_year && this._st(room.energy_year)) ? `<div class="den">
      ${room.energy && this._st(room.energy) ? `<button class="dst" data-act="more" data-entity="${esc(room.energy)}"><small>Heute</small><b>${isNaN(eT) ? "–" : de(eT, 2)}<em>kWh</em></b></button>` : ""}
      ${room.energy_year && this._st(room.energy_year) ? `<button class="dst" data-act="more" data-entity="${esc(room.energy_year)}"><small>${new Date().getFullYear()}</small><b>${isNaN(eY) ? "–" : de(eY, 0)}<em>kWh</em></b></button>` : ""}
    </div>` : "";

    const t = this._num(room.temp), h = this._num(room.humidity);
    const head = [room.temp ? `${isNaN(t) ? "–" : de(t, 1)} °C` : "", room.humidity ? `${isNaN(h) ? "–" : de(h, 0)} %` : "",
      ...[].concat(room.power || []).map((p) => this._fmtPow(p))].filter(Boolean).join(" · ");
    const lit = lights.some((c) => this._ctrl(c).on);
    const hist = charts || energy ? `<section class="ds dhist"><div class="dsh">${icon("mdi:chart-line")}Verlauf 24 h</div><div class="dcharts">${charts}</div>${energy}</section>` : "";
    const histLeft = lights.length + covers.length + clim.length * 1.2 + 1 < media.length + devices.length;

    return `<div class="dpan ${lit ? "lit" : ""}">
      <div class="dhd">
        <span class="rico">${icon(room.icon || "mdi:home")}</span>
        <span class="rtx"><span class="rname">${esc(room.name)}</span><span class="rsub">${esc(head)}</span></span>
        ${lights.length > 1 && lit ? `<button class="dpill" data-act="alloff">${icon("mdi:lightbulb-off")}Alle aus</button>` : ""}
        ${this._config.auto_area && this._hass.user?.is_admin !== false ? (() => {
          const ar = this._roomAreas(room);
          return ar.length
            ? `<button class="dpill dedit" data-act="nav" data-nav="/config/areas/area/${esc(ar[0])}" title="Geräte zuordnen: Bereich ${esc(ar.map((a) => this._hass.areas[a]?.name).join(", "))}">${icon("mdi:pencil")}<span>${esc(ar.map((a) => this._hass.areas[a]?.name).join(" · "))}</span></button>`
            : `<button class="dpill dedit warn" data-act="nav" data-nav="/config/areas/dashboard" title="Kein Home-Assistant-Bereich gefunden">${icon("mdi:map-marker-question")}<span>Kein Bereich</span></button>`;
        })() : ""}
        <button class="dx" data-act="dclose" aria-label="Schließen">${icon("mdi:close")}</button>
      </div>
      <div class="dbody">
        ${secRows ? `<div class="dchips">${secRows}</div>` : ""}
        <div class="dcols">
          <div class="dcol">
            ${sect("Licht", "mdi:lightbulb-group", lightRows)}
            ${sect("Rollläden", "mdi:window-shutter", coverRows)}
            ${sect("Klima", "mdi:thermostat", climRows)}
            ${histLeft ? hist : ""}
          </div>
          <div class="dcol">
            ${sect("Medien", "mdi:multimedia", mediaRows)}
            ${sect("Geräte", "mdi:power-socket-eu", devRows)}
            ${histLeft ? "" : hist}
          </div>
        </div>
      </div>
    </div>`;
  }

  /* langes Drücken = hold-Aktion */
  _bindHold() {
    this._holdBound = true;
    const root = this.shadowRoot;
    root.addEventListener("pointerdown", (e) => {
      const el = e.composedPath().find((n) => n.dataset && n.dataset.act === "ctl");
      if (!el) return;
      clearTimeout(this._holdT);
      this._held = null;
      this._holdT = setTimeout(() => { this._held = el; this._doCtl(el, el.dataset.hold); }, 500);
    });
    const cancel = () => clearTimeout(this._holdT);
    root.addEventListener("pointerup", cancel);
    root.addEventListener("pointercancel", cancel);
    root.addEventListener("pointerleave", cancel, true);
    root.addEventListener("contextmenu", (e) => { if (e.composedPath().some((n) => n.dataset?.act === "ctl")) e.preventDefault(); });
  }

  _doCtl(el, action) {
    const c = this._config.floors[+el.dataset.f]?.rooms[+el.dataset.r]?.controls?.[+el.dataset.c];
    if (!c) return;
    const h = this._hass, id = c.entity;
    const more = (eid) => { const ev = new Event("hass-more-info", { bubbles: true, composed: true }); ev.detail = { entityId: eid }; this.dispatchEvent(ev); };
    if (action === "none") return;
    if (action === "dom" && c.dom_event) { this.dispatchEvent(new CustomEvent("ll-custom", { bubbles: true, composed: true, detail: c.dom_event })); return; }
    if (action === "more-info") { more(c.more_entity || c.state_entity || id); return; }
    if (action === "run") { h.callService(id.split(".")[0], "turn_on", { entity_id: id }); return; }
    if (action === "toggle") {
      if (c.confirm && !window.confirm(`${c.name || id} wirklich schalten?`)) return;
      h.callService("homeassistant", "toggle", { entity_id: id });
    }
  }

  _dlgAct(el, act) {
    const h = this._hass, id = el.dataset.entity;
    const nm = this._st(id)?.attributes?.friendly_name || id;
    if (el.dataset.confirm && !window.confirm(`${nm} wirklich schalten?`)) return;
    if (act === "dtog") h.callService("homeassistant", "toggle", { entity_id: id });
    else if (act === "dsvc") { const [d, svc] = el.dataset.svc.split("."); h.callService(d, svc, { entity_id: id }); }
    else if (act === "hvac") h.callService("climate", "set_hvac_mode", { entity_id: id, hvac_mode: el.dataset.mode });
    else if (act === "ddom") { const c = this._dlgItems?.[+el.dataset.i]; if (c?.dom_event) this.dispatchEvent(new CustomEvent("ll-custom", { bubbles: true, composed: true, detail: c.dom_event })); }
    else if (act === "alloff") {
      const room = this._config.floors[this._open.f].rooms[this._open.r];
      const ids = (this._dlgItems || []).filter((c) => (c.entity.startsWith("light.") || c.light) && this._ctrl(c).on).map((c) => c.entity);
      if (ids.length) h.callService("homeassistant", "turn_off", { entity_id: ids });
    }
  }

  _click(e) {
    const el = e.composedPath().find((n) => n.dataset && n.dataset.act);
    if (!el) return;
    e.stopPropagation();
    const { act, entity } = el.dataset;
    if (act === "room") { this._openRoom(+el.dataset.f, +el.dataset.r); return; }
    if (act === "dclose") { this.shadowRoot.getElementById("dlg")?.close(); return; }
    if (act === "tset") { super._click(e); return; }
    if (act === "dtog" || act === "dsvc" || act === "hvac" || act === "ddom" || act === "alloff") { this._dlgAct(el, act); return; }
    if (act === "floor") {
      this._resetScroll = true;
      this._floor = el.dataset.v;
      try { if (this._config.remember_floor) localStorage.setItem("mg-rooms-floor", this._floor); } catch (x) {}
      this._render(true);
      return;
    }
    if (act === "ctl") {
      if (this._held === el) { this._held = null; return; }   // war langes Drücken
      clearTimeout(this._holdT);
      this._doCtl(el, el.dataset.tap);
      return;
    }
    if (act === "nav") {
      const nav = el.dataset.nav;
      if (/^https?:\/\//i.test(nav)) { window.open(nav, "_blank", "noopener"); return; }
      if (this._open != null && this.shadowRoot.getElementById("dlg")?.open) { this._open = null; this.shadowRoot.getElementById("dlg").close(); }
      const url = nav.startsWith("#") ? location.pathname + location.search + nav : nav;
      history.pushState(null, "", url);
      window.dispatchEvent(new CustomEvent("location-changed", { detail: { replace: false } }));
      if (nav.startsWith("#")) window.dispatchEvent(new HashChangeEvent("hashchange"));
      return;
    }
    if (act === "more" && entity) {
      const ev = new Event("hass-more-info", { bubbles: true, composed: true });
      ev.detail = { entityId: entity }; this.dispatchEvent(ev);
    }
  }
}

const ROOMS_STYLE = `
.rhead{display:flex;align-items:center;gap:14px;margin:0 2px 16px;flex-wrap:wrap}
.rtabs{display:flex;gap:4px;background:rgba(255,255,255,.03);border:1px solid var(--line);border-radius:18px;padding:4px;flex-wrap:wrap}
.rtab{position:relative;height:40px;padding:0 16px 0 13px;border-radius:14px;display:flex;align-items:center;gap:8px;font-size:15px;font-weight:600;color:var(--muted);white-space:nowrap}
.rtab ha-icon{--mdc-icon-size:18px}
.rtab:hover{color:var(--text)}
.rtab.sel{background:rgba(255,255,255,.08);color:var(--text)}
.rtab.sel ha-icon{color:var(--gold)}
.tdot{position:absolute;top:8px;right:7px;width:6px;height:6px;border-radius:50%;background:var(--gold);box-shadow:0 0 8px var(--gold)}
.rfloor+.rfloor{margin-top:22px}
.rfl{display:flex;align-items:center;gap:10px;margin:0 4px 12px;font-size:14px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:var(--muted)}
.rfl ha-icon{--mdc-icon-size:18px;color:var(--dim)}
.rfl::after{content:"";flex:1;height:1px;background:var(--line);margin-left:6px}
.rgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(400px,1fr));gap:16px}
.rt{container-type:inline-size;position:relative;border-radius:26px;background:linear-gradient(180deg,#161920,#12151b);border:1px solid var(--line);padding:16px 16px 14px;display:flex;flex-direction:column;gap:12px;cursor:pointer;min-width:0;transition:border-color .25s,box-shadow .25s}
.rt:hover{border-color:rgba(255,255,255,.12)}
.rt.lit{background:radial-gradient(130% 110% at 0% 0%,rgba(247,183,51,.17),transparent 58%),linear-gradient(180deg,#171a20,#12151b);border-color:rgba(247,183,51,.42);box-shadow:0 0 24px rgba(247,183,51,.08)}
.rt.alert{border-color:rgba(248,113,113,.65);box-shadow:0 0 24px rgba(248,113,113,.16)}
.rtop{display:flex;align-items:center;gap:14px;min-width:0}
.rico{width:52px;height:52px;border-radius:17px;background:rgba(255,255,255,.05);display:grid;place-items:center;color:var(--muted);flex:none;transition:all .25s}
.rico ha-icon{--mdc-icon-size:28px}
.rt.lit .rico{background:var(--gold);color:#16130a;box-shadow:0 0 18px rgba(247,183,51,.45)}
.rt.alert .rico{color:var(--red)}
.rt.alert.lit .rico{color:#16130a}
.rtx{flex:1;min-width:0;display:flex;flex-direction:column;gap:2px}
.rname{font-size:18px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.rsub{display:flex;align-items:center;gap:7px;font-size:13.5px;color:var(--muted);white-space:nowrap;overflow:hidden;font-variant-numeric:tabular-nums}
.rsub b{color:rgba(243,245,249,.9);font-weight:600}
.rsub .dot{width:3px;height:3px;border-radius:50%;background:var(--dim);flex:none}
.rgo{color:var(--dim);flex:none;display:grid;place-items:center}
.rt:hover .rgo{color:var(--text)}
.rsens{display:flex;gap:6px;flex-wrap:wrap}
.sc{height:30px;min-width:34px;padding:0 8px;border-radius:10px;display:inline-flex;align-items:center;justify-content:center;gap:5px;background:rgba(255,255,255,.035);color:var(--dim);font-size:12.5px;font-weight:700}
.sc ha-icon{--mdc-icon-size:17px}
.sc:not(.on):not(.al):not(.soft):not(.na) ha-icon{color:color-mix(in srgb,var(--cc) 50%,#5d6373)}
.sc.soft{color:color-mix(in srgb,var(--cc) 80%,transparent)}
.sc.on{color:var(--cc);background:color-mix(in srgb,var(--cc) 14%,transparent);box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--cc) 30%,transparent)}
.sc.al{color:#0f1116;background:var(--cc);box-shadow:0 0 14px color-mix(in srgb,var(--cc) 55%,transparent)}
.sc.na{opacity:.45;box-shadow:inset 0 0 0 1px rgba(255,255,255,.12)}
.sc.pulse{animation:mgpulse 1.4s ease-in-out infinite}
.rwarn{display:flex;align-items:center;gap:8px;font-size:13.5px;font-weight:700;color:var(--red)}
.rwarn ha-icon{--mdc-icon-size:17px}
.rctl{display:flex;gap:8px;flex-wrap:wrap;margin-top:auto}
.cb{display:inline-flex;align-items:center;gap:8px;height:42px;padding:0 14px 0 12px;border-radius:15px;background:rgba(255,255,255,.045);border:1px solid var(--line);font-size:14px;font-weight:600;color:var(--muted);min-width:0;max-width:100%;user-select:none;-webkit-user-select:none;-webkit-touch-callout:none;transition:all .2s}
.cb span{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.cb ha-icon{--mdc-icon-size:20px;flex:none}
.cb:hover{background:rgba(255,255,255,.07);color:var(--text)}
.cb.on{background:color-mix(in srgb,var(--cc) 17%,transparent);border-color:color-mix(in srgb,var(--cc) 55%,transparent);color:var(--text)}
.cb.on ha-icon{color:var(--cc);filter:drop-shadow(0 0 6px color-mix(in srgb,var(--cc) 60%,transparent))}
.cb.run ha-icon{animation:mgpulse 1.6s ease-in-out infinite}
.cb.bad{border-color:var(--red);color:var(--red);background:rgba(248,113,113,.1)}
.cb.na{border-style:dashed;opacity:.5}
@keyframes mgpulse{50%{opacity:.45}}
/* ---------- Raum-Detail ---------- */
.dlg{padding:0;border:0;background:transparent;max-width:min(1060px,calc(100vw - 32px));width:100%;max-height:calc(100vh - 48px);overflow:visible;color:var(--text);font-family:inherit}
.dlg::backdrop{background:rgba(5,6,9,.62);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px)}
.dlg[open]{animation:dlgin .18s ease-out}
@keyframes dlgin{from{opacity:0;transform:translateY(12px) scale(.985)}}
.dpan{background:linear-gradient(180deg,#171a21,#111419);border:1px solid rgba(255,255,255,.09);border-radius:30px;box-shadow:0 30px 80px rgba(0,0,0,.6);display:flex;flex-direction:column;max-height:calc(100vh - 48px);overflow:hidden}
.dpan.lit{background:radial-gradient(90% 40% at 0% 0%,rgba(247,183,51,.14),transparent 60%),linear-gradient(180deg,#171a21,#111419)}
.dhd{display:flex;align-items:center;gap:14px;padding:20px 20px 16px 22px;border-bottom:1px solid var(--line);flex:none}
.dhd .rico{width:56px;height:56px}
.dpan.lit .dhd .rico{background:var(--gold);color:#16130a;box-shadow:0 0 18px rgba(247,183,51,.45)}
.dhd .rname{font-size:22px}
.dhd .rsub{font-size:14.5px;gap:0}
.dx{width:44px;height:44px;border-radius:15px;background:rgba(255,255,255,.06);border:1px solid var(--line);display:grid;place-items:center;flex:none;margin-left:8px}
.dx:hover{background:rgba(255,255,255,.1)}
.dpill{display:inline-flex;align-items:center;gap:8px;height:40px;padding:0 14px;border-radius:14px;background:rgba(255,255,255,.05);border:1px solid var(--line);font-size:14px;font-weight:600;white-space:nowrap;flex:none}
.dpill ha-icon{--mdc-icon-size:18px}
.dhd .dpill{margin-left:auto}
.dhd .dpill + .dx{margin-left:0}
.dhd .dpill + .dpill{margin-left:0}
.dbody{overflow-y:auto;padding:16px 20px 22px;overscroll-behavior:contain;scrollbar-width:thin;scrollbar-color:rgba(255,255,255,.15) transparent}
.dchips{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:16px}
.dchip{display:inline-flex;align-items:center;gap:10px;padding:8px 14px 8px 11px;border-radius:15px;background:rgba(255,255,255,.035);border:1px solid var(--line)}
.dchip ha-icon{--mdc-icon-size:20px;color:color-mix(in srgb,var(--cc) 60%,#5d6373)}
.dchip span{display:flex;flex-direction:column;line-height:1.2}
.dchip b{font-size:13.5px;font-weight:600}
.dchip small{font-size:12px;color:var(--muted)}
.dchip.on{border-color:color-mix(in srgb,var(--cc) 45%,transparent);background:color-mix(in srgb,var(--cc) 10%,transparent)}
.dchip.on ha-icon,.dchip.on small{color:var(--cc)}
.dchip.al{background:var(--cc);border-color:var(--cc);color:#0f1116}
.dchip.al ha-icon,.dchip.al small{color:#0f1116}
.dchip.na{opacity:.5;border-style:dashed}
.dcols{display:grid;grid-template-columns:1fr 1fr;gap:16px;align-items:start}
.dcol{display:flex;flex-direction:column;gap:16px;min-width:0}
.ds{background:rgba(255,255,255,.022);border:1px solid var(--line);border-radius:22px;padding:14px}
.dsh{display:flex;align-items:center;gap:9px;font-size:12.5px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:var(--muted);margin:0 2px 12px}
.dsh ha-icon{--mdc-icon-size:16px;color:var(--dim)}
.dsl{display:flex;flex-direction:column;gap:8px}
.dr{display:grid;grid-template-columns:auto 1fr auto auto;grid-template-areas:"i t r s";align-items:center;column-gap:12px;row-gap:10px;padding:10px 10px 10px 10px;border-radius:17px;background:var(--tile);border:1px solid var(--tileb);min-width:0}
.dr.light{grid-template-areas:"i t r s" "sl sl sl sl"}
.dr.light:not(:has(.sl)){grid-template-areas:"i t r s"}
.dic{grid-area:i;width:42px;height:42px;border-radius:14px;background:rgba(255,255,255,.05);display:grid;place-items:center;color:var(--muted)}
.dic ha-icon{--mdc-icon-size:21px}
.dtx{grid-area:t;min-width:0;display:flex;flex-direction:column}
.dtx b{font-size:15.5px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.dtx span{font-size:13px;color:var(--muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.dtx em{font-style:normal}
.dr.on{border-color:color-mix(in srgb,var(--cc) 40%,transparent);background:color-mix(in srgb,var(--cc) 8%,transparent)}
.dr.on .dic{background:var(--cc);color:#0f1116;box-shadow:0 0 14px color-mix(in srgb,var(--cc) 45%,transparent)}
.dr.on .dtx span{color:var(--cc);font-weight:600}
.dr.run .dic{animation:mgpulse 1.6s ease-in-out infinite}
.dr.bad{border-color:var(--red)}
.dr.bad .dtx span{color:var(--red);font-weight:700}
.dr.na{opacity:.55;border-style:dashed}
.dedit{color:var(--muted)}
.dedit span{max-width:220px;overflow:hidden;text-overflow:ellipsis}
.dedit.warn{color:var(--orange);border-color:rgba(251,146,60,.35)}
.dr .tgt{grid-area:r}
.dsw{grid-area:s;width:52px;height:30px;border-radius:15px;background:rgba(255,255,255,.1);position:relative;flex:none;transition:background .2s}
.dsw i{position:absolute;top:3px;left:3px;width:24px;height:24px;border-radius:50%;background:#c9ced8;transition:transform .2s,background .2s}
.dsw.on{background:color-mix(in srgb,var(--cc,#f7b733) 75%,#000)}
.dsw.on i{transform:translateX(22px);background:#fff}
.dbtns{grid-area:r;display:flex;gap:6px;grid-column:3 / 5}
.dbtn{width:40px;height:40px;border-radius:13px;background:rgba(255,255,255,.05);border:1px solid var(--line);display:grid;place-items:center;color:var(--text)}
.dbtn:hover,.dpill:hover{background:rgba(255,255,255,.1)}
.dbtn ha-icon{--mdc-icon-size:20px}
.dr > .dpill{grid-area:r;grid-column:3 / 5}
.sl{grid-area:sl;-webkit-appearance:none;appearance:none;width:100%;height:34px;border-radius:12px;margin:0;cursor:pointer;
  background:linear-gradient(90deg,color-mix(in srgb,var(--cc) 70%,transparent) var(--v),rgba(255,255,255,.07) var(--v))}
.sl::-webkit-slider-thumb{-webkit-appearance:none;width:8px;height:22px;border-radius:4px;background:#fff;box-shadow:0 0 0 3px rgba(0,0,0,.25)}
.sl::-moz-range-thumb{width:8px;height:22px;border:0;border-radius:4px;background:#fff}
.dcharts{display:flex;flex-direction:column;gap:8px}
.dch{display:block;width:100%;padding:10px 12px 8px;border-radius:17px;background:var(--tile);border:1px solid var(--tileb)}
.dchh{display:flex;align-items:baseline;justify-content:space-between}
.dchl{font-size:13px;color:var(--muted);font-weight:600}
.dchv{font-size:19px;font-weight:700;color:var(--cc);font-variant-numeric:tabular-nums}
.dchv small{font-size:12px;color:var(--muted);font-weight:500;margin-left:2px}
.spark{display:block;width:100%;height:64px;margin:4px 0 2px}
.dch0{height:64px;display:grid;place-items:center;font-size:13px;color:var(--dim)}
.dchm{display:flex;gap:14px;font-size:12px;color:var(--dim);font-variant-numeric:tabular-nums}
.dchm b{color:var(--muted);font-weight:600}
.den{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:8px}
.dst{display:flex;flex-direction:column;padding:10px 12px;border-radius:17px;background:var(--tile);border:1px solid var(--tileb)}
.dst small{font-size:12px;color:var(--muted);font-weight:600;letter-spacing:.08em;text-transform:uppercase}
.dst b{font-size:20px;font-weight:700;font-variant-numeric:tabular-nums}
.dst em{font-style:normal;font-size:12px;color:var(--muted);font-weight:500;margin-left:3px}
@media (max-width:760px){
  .dlg{max-width:100vw;max-height:100vh;height:100%;margin:0;border-radius:0}
  .dpan{max-height:100vh;height:100vh;border-radius:0;border:0}
  .dcols{display:flex;flex-direction:column;gap:12px}
  .dcol{display:contents}
  .dhist{order:9}
  .dhd{padding:14px 14px 12px}
  .dbody{padding:12px 12px 24px}
  .dhd .dpill span,.dhd .dpill{font-size:0;padding:0 10px;gap:0}
}
@container (max-width:340px){.cb span{display:none}.cb{padding:0 11px}.cb.run span{display:inline}}
.wrap.rooms.fit .rbody{flex:1;min-height:0;overflow-y:auto;overscroll-behavior:contain;scrollbar-width:thin;scrollbar-color:rgba(255,255,255,.15) transparent;padding-right:4px;margin-right:-6px}
.wrap.rooms.fit .rhead{flex:none}
@container (max-width:720px){.rgrid{grid-template-columns:1fr;gap:12px}.rhead .csum{margin-left:0}.rtabs{width:100%;flex-wrap:nowrap;overflow-x:auto;scrollbar-width:none}.rtab{padding:0 12px 0 10px}}
@media (prefers-reduced-motion:reduce){.sc.pulse,.cb.run ha-icon{animation:none}}
`;

if (!customElements.get("mg-rooms-dashboard")) customElements.define("mg-rooms-dashboard", MgRoomsDashboard);
if (!window.customCards.some((c) => c.type === "mg-rooms-dashboard"))
  window.customCards.push({ type: "mg-rooms-dashboard", name: "MG Räume", description: "Alle Räume mit Licht, Fenstern, Heizung, Rollläden und Sensoren im Glow-Stil" });

