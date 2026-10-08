/*
 * mg-car-dashboard.js
 * Ablage:    /config/www/glow-dashboard/mg-car-dashboard.js
 * Ressource: /local/glow-dashboard/mg-car-dashboard.js?v=4  (Typ: JavaScript)
 * YAML:      type: custom:mg-car-dashboard
 */

window.customCards = window.customCards || [];
const OFFLINE = ["unavailable", "unknown"];
const VERSION = "2.37.5";
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
      limit_soc: "select.evcc_warp3_limit_soc",
      ev_assistant_weekly: "",       // input_boolean der wöchentlichen Vollladung aus ev_assistant (leer = Service direkt)                              // z. B. number.evcc_warp3_limit_soc (Ladeziel, Markierung im Balken)
      min_soc: "input_number.evcc_auto_soc_schwelle_minpv",   // Markierung „bis hier immer laden“
      solar_total: "sensor.evcc_stat_total_solar_percentage",
      last_charge: "sensor.e_c3_letzte_ladung",
    },
    // --- ev_assistant: "auto" sucht die Entitäten selbst (Integration ev_assistant), sonst { schluessel: entity_id } ---
    ev_assistant: "auto",
    stats: ["vehicle_avg_consumption", "odo", "cost_year", "savings"],   // Kennzahlen auf der Auto-Seite (oben)
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

class MgHomeDashboard extends HTMLElement {
  static getStubConfig() { return {}; }

  setConfig(config) {
    this._config = merge(DEFAULT_CONFIG, config || {});
    this._tab = 0;
    this._sig = {};
    this._events = [];
    this._forecast = null;
    if (this._built) { this._built = false; this._nodesBound = false; this._build(); if (this._hass) this._update(true); }
  }

  getCardSize() { return 12; }

  set hass(h) {
    const first = !this._hass;
    this._hass = h;
    if (!this._built) this._build();
    if (this._school) this._school.hass = h;
    if (first) { this._subscribeForecast(); this._loadEvents(); }
    this._update();
  }

  connectedCallback() {
    if (!this._onResize) {
      this._onResize = () => { cancelAnimationFrame(this._fitRaf); this._fitRaf = requestAnimationFrame(() => this._fit()); };
      this._ro = new ResizeObserver(this._onResize);
    }
    window.addEventListener("resize", this._onResize);
    this._ro.observe(this);
    this._onResize();
    if (!this._calTimer) this._calTimer = setInterval(() => this._loadEvents(), 15 * 60 * 1000);
    if (this._hass && !this._unsubForecast) this._subscribeForecast();
  }

  disconnectedCallback() {
    if (this._onResize) { window.removeEventListener("resize", this._onResize); this._ro.disconnect(); }
    clearInterval(this._calTimer); this._calTimer = null;
    if (this._unsubForecast) { Promise.resolve(this._unsubForecast).then((u) => u && u()); this._unsubForecast = null; }
  }

  /* ---------- Werte ---------- */
  _st(id) { return id ? this._hass?.states[id] : undefined; }
  _num(id) { const s = this._st(id); const v = s ? parseFloat(s.state) : NaN; return isNaN(v) ? 0 : v; }
  _w(id) { const s = this._st(id); if (!s) return 0; const u = (s.attributes.unit_of_measurement || "").toLowerCase(); return this._num(id) * (u === "kw" ? 1000 : 1); }
  _power(w) { w = Math.abs(w); return w >= 1000 ? { v: de(w / 1000, 1), u: "kW" } : { v: String(Math.round(w)), u: "W" }; }
  _on(id) { const s = this._st(id)?.state; return !!s && !["off", "unavailable", "unknown", "idle", "closed", "docked", "standby", "paused", "locked"].includes(s); }

  /* ---------- Aufbau ---------- */
  _build() {
    if (!document.querySelector(`link[href="${FONT_URL}"]`)) {
      const l = document.createElement("link"); l.rel = "stylesheet"; l.href = FONT_URL; document.head.appendChild(l);
    }
    if (!this.shadowRoot) this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `<style>${STYLE}</style>
      <div class="wrap">
        <div class="date" id="date"></div>
        <div class="grid">
          <div class="col">
            <section class="panel energy" id="energy">
              <div class="hd"><span class="ttl">${esc(this._config.energy.title)}</span><span class="lbl" id="autarky"></span>
                <button class="arrow" data-act="more" data-entity="${esc(this._config.energy.home)}">${icon("mdi:chevron-right")}</button></div>
              <div class="eseg">
                <button class="eopt" data-act="eview" data-v="power">${icon("mdi:flash")}Leistung</button>
                <button class="eopt" data-act="eview" data-v="energy">${icon("mdi:calendar-today")}Heute</button>
              </div>
              <div class="ev-p"><div class="ecap">Leistung</div>${flowSvg("p-")}</div>
              <div class="ev-e"><div class="ecap">Energie heute</div>${flowSvg("e-")}</div>
            </section>
            <section class="panel car grow" id="car"></section>
            <dialog class="dlg" id="cardlg"></dialog>
          </div>
          <div class="col">
            <section class="panel" id="qa"></section>
            <section class="panel grow" id="act"></section>
          </div>
          <div class="col">
            <section class="panel grow" id="cal"></section>
            <section class="panel" id="weather"></section>
          </div>
        </div>
      </div>`;
    this._school = null;
    if (this._config.school !== false) {
      this._school = document.createElement("mg-school-card");
      this._school.setAttribute("embedded", "");
      this._school.setAttribute("bare", "");      // ohne eigenen Rahmen/Überschrift, sitzt in der Kalenderkachel
      this._school.setConfig(this._config.school || {});
    }
    this.shadowRoot.addEventListener("click", (e) => this._click(e));
    // langes Drücken auf eine Aktion = Detailansicht
    this.shadowRoot.addEventListener("pointerdown", (e) => {
      const el = e.composedPath().find((n) => n.dataset?.hold);
      clearTimeout(this._holdT); this._held = null;
      if (!el) return;
      this._holdT = setTimeout(() => {
        this._held = el;
        const ev = new Event("hass-more-info", { bubbles: true, composed: true }); ev.detail = { entityId: el.dataset.entity }; this.dispatchEvent(ev);
      }, 550);
    });
    for (const t of ["pointerup", "pointercancel", "pointerleave"]) this.shadowRoot.addEventListener(t, () => clearTimeout(this._holdT), true);
    this.shadowRoot.addEventListener("contextmenu", (e) => { if (e.composedPath().some((n) => n.dataset?.hold)) e.preventDefault(); });
    this.shadowRoot.addEventListener("keydown", (e) => {
      const t = e.composedPath()[0];
      if (t?.classList?.contains("aein")) {
        t.classList.remove("bad");
        if (e.key === "Enter") this._actAction(t.classList.contains("qlink") ? "aelink" : "aeaddok", t);
        if (e.key === "Escape") { this._actAdd = false; this._update(true); }
        return;
      }
      if (t?.classList?.contains("qain")) {
        t.classList.remove("bad");
        if (e.key === "Enter") this._qaAction(t.classList.contains("qlink") ? "qalink" : "qaaddok", t);
        if (e.key === "Escape") { this._qaAdd = false; this._update(true); }
      }
    });
    this._built = true;
    requestAnimationFrame(() => this._fit());
  }

  _update(force = false) {
    if (!this._hass || !this._built) return;
    const c = this._config;
    this._renderDate();
    this._renderEnergy();

    const panels = {
      weather: [c.weather.entity, c.weather.sun],
      qa: this._qaAll().map((x) => x.q).flatMap((q) => [q.entity, q.sub_entity, q.heat, q.cool, q.lock, q.contact, q.windows_open, q.windows_tilt, q.count, q.status, ...this._matchIds(q), ...(q.entities || []), ...this._members(q.entity)]),
      act: this._actAll().map((x) => x.entity).filter(Boolean),
      cal: [],
      car: [c.car.soc, c.car.range, c.car.status, c.car.cable, c.car.limit, c.car.mode, c.car.always, c.energy.car_power,
        ...Object.values(c.car.evcc || {}), ...Object.values(this._eva())],
    };
    const extra = {
      weather: JSON.stringify(this._forecast || []),
      act: JSON.stringify(this._actLayout()) + (this._actEdit ? "e" : "") + (this._actAdd ? "a" : ""),
      qa: JSON.stringify(this._qaLayout()) + (this._qaEdit ? "e" : "") + (this._qaAdd ? "a" : ""),
      cal: JSON.stringify(this._events) + Math.floor(Date.now() / 60000),
    };
    for (const [key, ids] of Object.entries(panels)) {
      const sig = ids.filter(Boolean).map((id) => { const s = this._st(id); return s ? s.state + s.last_updated : "-"; }).join("|") + (extra[key] ?? "");
      if (force || sig !== this._sig[key]) { this._sig[key] = sig; this["_render_" + key](); }
    }
  }

  _matchIds(q) {
    if (!q.match || !this._hass) return [];
    const dom = q.match_domain ? q.match_domain + "." : "";
    return Object.keys(this._hass.states).filter((id) => (!dom || id.startsWith(dom)) && id.includes(q.match));
  }

  /* Bildschirm-Anpassung: auf breiten Bildschirmen genau Fensterhöhe, Inhalte skalieren/scrollen innen */
  _fit() {
    const wrap = this.shadowRoot?.querySelector(".wrap");
    if (!wrap) return;
    const on = this._config?.fit_screen !== false && this.clientWidth > 1180;
    if (!on) { wrap.classList.remove("fit"); return; }
    const top = this.getBoundingClientRect().top + window.scrollY;
    const h = Math.max(560, Math.floor(window.innerHeight - top));
    wrap.style.setProperty("--fit-h", h + "px");
    wrap.classList.add("fit");
    wrap.classList.toggle("compact", h < 860);   // niedrige Fenster: alles etwas kompakter
    this._school?.toggleAttribute("compact", h < 860);
  }

  _members(id) { const m = this._st(id)?.attributes?.entity_id; return Array.isArray(m) ? m : []; }

  _hd(title, label = "", entity = null, labelCls = "") {
    return `<div class="hd"><span class="ttl">${esc(title)}</span><span class="lbl ${labelCls}">${label}</span>
      ${entity ? `<button class="arrow" data-act="more" data-entity="${esc(entity)}">${icon("mdi:chevron-right")}</button>` : ""}</div>`;
  }

  /* ---------- Datum ---------- */
  _renderDate() {
    const el = this.shadowRoot.getElementById("date");
    if (!this._config.show_date) { el.style.display = "none"; return; }
    const d = new Date();
    el.textContent = `${WD_LONG[d.getDay()]}, ${d.getDate()}. ${MON_LONG[d.getMonth()]}`;
  }

  /* ---------- Energie ---------- */
  _kwh(id) {
    const s = this._st(id); if (!s) return NaN;
    const v = parseFloat(s.state); if (isNaN(v)) return NaN;
    const u = (s.attributes.unit_of_measurement || "").toLowerCase();
    return u === "wh" ? v / 1000 : u === "mwh" ? v * 1000 : v;
  }

  _renderEnergy() {
    const e = this._config.energy, r = this.shadowRoot, T = 15, E = 0.05;
    const view = this._eview || (e.view === "both" ? "both" : "power");
    const panel = r.getElementById("energy");
    if (panel.dataset.view !== view) panel.dataset.view = view;
    r.querySelectorAll(".eopt").forEach((b) => b.classList.toggle("sel", b.dataset.v === view));

    const set = (id, v) => { const n = r.getElementById(id); if (n && n.textContent !== v) n.textContent = v; };
    const txt = (id, v, color) => { const n = r.getElementById(id); if (!n) return; if (n.textContent !== v) n.textContent = v; n.style.fill = color ? `var(${color})` : ""; n.style.fontWeight = color ? "600" : ""; };
    const cls = (id, on, extra = {}) => {
      const n = r.getElementById(id); if (!n) return;
      n.classList.toggle("on", on);
      for (const [k, v] of Object.entries(extra)) n.classList.toggle(k, v);
    };
    const bind = (P, map) => { for (const [k, id] of Object.entries(map)) r.getElementById(`${P}n-${k}`)?.setAttribute("data-entity", id || ""); };
    if (!this._nodesBound) {
      this._nodesBound = true;
      bind("p-", { solar: e.solar, home: e.home, grid: e.grid_import, bat: e.battery_soc, car: e.car_soc });
      bind("e-", { solar: e.solar_today, home: e.used_today, grid: e.grid_today, bat: e.battery_in_today || e.battery_soc, car: e.car_today });
    }

    /* ===== Leistung (live) ===== */
    {
      const P = "p-";
      const solar = this._w(e.solar), gin = this._w(e.grid_import), gout = this._w(e.grid_export);
      const bch = this._w(e.battery_charge), bdis = this._w(e.battery_discharge), home = this._w(e.home), car = this._w(e.car_power);
      const soc = this._num(e.battery_soc), csoc = this._num(e.car_soc);

      let p = this._power(solar); set(P + "v-solar", p.v); set(P + "u-solar", p.u);
      cls(P + "n-solar", solar > T); cls(P + "l-solar", solar > T);
      txt(P + "s-solar-1", solar > T ? "Erzeugt" : "Keine Erzeugung", solar > T && "--e-solar"); txt(P + "s-solar-2", "");

      p = this._power(home); set(P + "v-home", p.v); set(P + "u-home", p.u); cls(P + "n-home", true);

      const exp = gout > T && gin <= T, gridW = gin > T ? gin : gout > T ? gout : 0;
      p = this._power(gridW); set(P + "v-grid", p.v); set(P + "u-grid", p.u);
      cls(P + "n-grid", gridW > 0, { exp }); cls(P + "l-grid", gridW > 0, { rev: exp, exp });
      txt(P + "s-grid-1", gin > T ? "Bezug" : gout > T ? "Einspeisung" : "Ruht", gridW > 0 && (exp ? "--e-grid-out" : "--e-grid-in"));
      txt(P + "s-grid-2", ""); txt(P + "s-grid-3", "");

      set(P + "v-bat", String(Math.round(soc))); set(P + "u-bat", "%");
      const bw = bch > T ? bch : bdis > T ? bdis : 0, bp = this._power(bw), dis = !(bch > T);
      const bc = bw > 0 && (dis ? "--e-bat-out" : "--e-bat-in");
      cls(P + "n-bat", bw > 0 || soc > 0, { dis }); cls(P + "l-bat", bw > 0, { rev: bdis > T && bch <= T, dis });
      txt(P + "s-bat-1", bch > T ? "Lädt" : bdis > T ? "Entlädt" : "Ruht", bc);
      txt(P + "s-bat-2", bw ? `${bp.v} ${bp.u}` : "", bc); txt(P + "s-bat-3", "");

      set(P + "v-car", String(Math.round(csoc))); set(P + "u-car", "%");
      const cp = this._power(car);
      cls(P + "n-car", car > T); cls(P + "l-car", car > T);
      txt(P + "s-car-1", car > T ? `Lädt ${cp.v} ${cp.u}` : "Lädt nicht", car > T && "--e-car"); txt(P + "s-car-2", "");

      let autNow;
      if (e.autarky_now && this._st(e.autarky_now)) autNow = this._num(e.autarky_now);
      else autNow = home > T ? (1 - Math.min(gin, home) / home) * 100 : gin > T ? 0 : 100;
      this._autNow = Math.round(Math.max(0, Math.min(100, autNow)));
    }

    /* ===== Energie (heute) ===== */
    {
      const P = "e-", k = (v) => (isNaN(v) ? "–" : de(v, 1));
      const sol = this._kwh(e.solar_today), used = this._kwh(e.used_today), gin = this._kwh(e.grid_today), gout = this._kwh(e.export_today);
      const bin = this._kwh(e.battery_in_today), bout = this._kwh(e.battery_out_today), car = this._kwh(e.car_today);
      const autDay = this._st(e.autarky) ? Math.round(this._num(e.autarky)) : null;
      this._autDay = autDay;

      set(P + "v-solar", k(sol)); set(P + "u-solar", "kWh");
      cls(P + "n-solar", sol > E); cls(P + "l-solar", sol > E);
      txt(P + "s-solar-1", "Erzeugt", sol > E && "--e-solar");
      txt(P + "s-solar-2", autDay != null ? `${autDay} % autark` : "", "--e-solar");

      set(P + "v-home", k(used)); set(P + "u-home", "kWh"); cls(P + "n-home", true);

      set(P + "v-grid", k(gin)); set(P + "u-grid", "kWh");
      cls(P + "n-grid", gin > E || gout > E, { exp: !(gin > E) && gout > E }); cls(P + "l-grid", gin > E);
      const cost = (gin || 0) * (e.price || 0), earn = (gout || 0) * (e.price_export || 0);
      txt(P + "s-grid-1", gin > E ? `≈ ${de(cost, 2)} ${e.currency}` : "Kein Bezug", gin > E && "--e-grid-in");
      txt(P + "s-grid-2", gout > E ? `↑ ${de(gout, 1)} kWh` : "", "--e-grid-out");
      txt(P + "s-grid-3", gout > E && e.price_export ? `+ ${de(earn, 2)} ${e.currency}` : "", "--e-grid-out");

      const hasBat = !isNaN(bin) || !isNaN(bout);
      set(P + "v-bat", hasBat ? k(bin) : "–"); set(P + "u-bat", hasBat ? "kWh" : "");
      const bOn = bin > E || bout > E, bDis = !(bin >= (bout || 0)) || !(bin > E);
      cls(P + "n-bat", bOn, { dis: !(bin > E) }); cls(P + "l-bat", bOn, { dis: bDis, rev: bDis });
      txt(P + "s-bat-1", hasBat ? "Geladen" : "Sensoren fehlen", bin > E && "--e-bat-in");
      txt(P + "s-bat-2", bout > E ? "Entladen" : "", "--e-bat-out");
      txt(P + "s-bat-3", bout > E ? `${de(bout, 1)} kWh` : "", "--e-bat-out");

      set(P + "v-car", k(car)); set(P + "u-car", "kWh");
      cls(P + "n-car", car > E); cls(P + "l-car", car > E);
      txt(P + "s-car-1", car > E ? "Geladen" : "Nicht geladen", car > E && "--e-car"); txt(P + "s-car-2", "");
    }

    const lbl = view === "power" ? `${this._autNow} % autark jetzt`
      : view === "energy" ? (this._autDay != null ? `${this._autDay} % autark heute` : "")
      : `${this._autNow} % jetzt${this._autDay != null ? ` · ${this._autDay} % heute` : ""}`;
    set("autarky", lbl);
  }

  /* ---------- Wetter ---------- */
  async _subscribeForecast() {
    const id = this._config.weather.entity;
    if (!this._hass?.connection || !id || this._unsubForecast) return;
    try {
      this._unsubForecast = this._hass.connection.subscribeMessage(
        (ev) => { this._forecast = ev.forecast; this._update(); },
        { type: "weather/subscribe_forecast", forecast_type: "daily", entity_id: id });
    } catch (err) { console.warn("mg-home-dashboard: Vorhersage", err); }
  }

  _render_weather() {
    const w = this._config.weather, s = this._st(w.entity), el = this.shadowRoot.getElementById("weather");
    if (!s) { el.innerHTML = this._hd("Wetter") + `<div class="empty">${esc(w.entity)} nicht gefunden</div>`; return; }
    const a = s.attributes, c = COND[s.state] || COND.cloudy;
    const fc = (this._forecast || a.forecast || []).slice(0, 5);
    const sa = this._st(w.sun)?.attributes || {};
    const hm = (v) => { if (!v) return ""; const d = new Date(v); return isNaN(d) ? "" : `${pad(d.getHours())}:${pad(d.getMinutes())}`; };
    const rise = hm(sa.next_rising), set = hm(sa.next_setting);
    const info = [a.humidity != null ? `${Math.round(a.humidity)} % Feuchte` : "", a.wind_speed != null ? `Wind ${Math.round(a.wind_speed)} ${a.wind_speed_unit || "km/h"}` : ""].filter(Boolean).join(" · ");

    const days = fc.map((f, i) => {
      const d = new Date(f.datetime), fcnd = COND[f.condition] || COND.cloudy;
      return `<div class="fday"><span class="fd">${i === 0 ? "Heute" : WD[d.getDay()]}</span>
        <ha-icon class="fi" style="color:${fcnd.c}" icon="${fcnd.i}"></ha-icon>
        <span class="fh">${Math.round(f.temperature)}°</span>
        <span class="fl">${f.templow != null ? Math.round(f.templow) + "°" : ""}</span>
        ${f.precipitation ? `<span class="fp">${de(f.precipitation, 1)} mm</span>` : ""}</div>`;
    }).join("");

    el.innerHTML = this._hd("Wetter", esc(info), w.entity) + `
      <div class="wnow">
        <ha-icon class="wicon" style="color:${c.c}" icon="${c.i}"></ha-icon>
        <div class="wmain"><div class="wtemp">${Math.round(a.temperature)}<sup>°</sup></div>
          <div class="wcond">${c.t}</div></div>
        ${rise || set ? `<div class="wsun">
          ${rise ? `<span class="pill">${icon("mdi:weather-sunset-up")}${rise}</span>` : ""}
          ${set ? `<span class="pill">${icon("mdi:weather-sunset-down")}${set}</span>` : ""}</div>` : ""}
      </div>
      <div class="fc">${days}</div>`;
  }

  /* ---------- Schnellzugriff ---------- */
  _qaInfo(q) {
    if (!q.link && q.navigate && !["entity", "entities", "count", "heat", "cool", "lock", "windows_open", "windows_tilt", "status", "match"].some((k) => q[k])) q = { ...q, link: true };
    if (q.link) return { sub: q.sub || (/^https?:/i.test(q.navigate) ? "Webseite öffnen" : "Öffnen"), icon: q.icon, color: q.color, active: false, calm: false, name: q.name, tap: "nav" };
    // Status-Zuordnung (z. B. Garage): pro Zustand Text, Icon, Farbe
    if (q.status && q.states) {
      const s = this._st(q.status)?.state;
      const m = q.states[s] || q.states.default || {};
      return {
        sub: m.text ?? s ?? "Nicht gefunden",
        icon: m.icon || q.icon, color: m.color || q.color,
        active: !m.calm, calm: !!m.calm, pulse: !!m.pulse,
        name: q.name, tap: q.toggle ? "toggle" : q.navigate ? "nav" : "more",
        tapEntity: q.toggle || q.status,
      };
    }
    // Allgemeiner Zähler (z. B. Rollläden): ein Sensor mit Anzahl, 0 = ruhig/grün, >0 = leuchtend
    if (q.count || q.match) {
      const ids = q.match ? this._matchIds(q) : [];
      const n = q.match ? ids.filter((id) => this._st(id)?.state === "on").length : Math.round(this._num(q.count)), on = n > 0;
      return {
        sub: on ? `${n} ${n === 1 ? (q.text_one || "an") : (q.text_many || q.text_one || "an")}` : (q.text_zero || "Alle aus"),
        icon: on ? (q.icon_on || q.icon) : q.icon,
        color: on ? (q.color || "#60a5fa") : (q.color_zero || "#34d399"),
        active: on, calm: !on,
        name: q.name, tap: q.dom_event ? "dom" : q.navigate ? "nav" : "more",
        tapEntity: q.count || ids.find((id) => this._st(id)?.state === "on") || ids[0],
      };
    }
    // Fenster: Anzahl offen (ohne Kipp) + Anzahl gekippt
    if (q.windows_open || q.windows_tilt) {
      const o = Math.round(this._num(q.windows_open)), k = Math.round(this._num(q.windows_tilt));
      const parts = [];
      if (o > 0) parts.push(`${o} offen`);
      if (k > 0) parts.push(`${k} gekippt`);
      const color = o > 0 ? (q.color_open || "#f87171") : k > 0 ? (q.color_tilt || "#eab308") : (q.color_closed || "#34d399");
      return {
        sub: parts.length ? parts.join(" · ") : "Alle zu",
        icon: o > 0 || k > 0 ? "mdi:window-open-variant" : "mdi:window-closed-variant",
        color, active: o > 0 || k > 0, calm: !(o > 0 || k > 0),
        name: q.name || "Fenster", tap: q.navigate ? "nav" : "more",
      };
    }
    // Haustür: Schloss (lock) + optional Türkontakt (contact, on = offen)
    if (q.lock) {
      const ls = this._st(q.lock)?.state, open = this._st(q.contact)?.state === "on";
      const C = { green: q.color_locked || "#34d399", orange: q.color_unlocked || "#fb923c", red: q.color_alert || "#f87171" };
      let r;
      if (ls === "opening")                  r = { sub: "Öffnet …",       icon: "mdi:door-open",       color: C.red,    active: true };
      else if (open)                         r = { sub: "Tür offen",      icon: "mdi:lock-open-alert", color: C.red,    active: true };
      else if (ls === "unlocked")            r = { sub: "Entriegelt",     icon: "mdi:lock-open",       color: C.orange, active: true };
      else if (ls === "unlocking")           r = { sub: "Entriegelt …",   icon: "mdi:lock-open",       color: C.orange, active: true };
      else if (ls === "locking")             r = { sub: "Verriegelt …",   icon: "mdi:lock",            color: C.orange, active: true };
      else if (ls === "locked")              r = { sub: "Verriegelt",     icon: "mdi:lock",            color: C.green,  active: false, calm: true };
      else if (ls === "jammed")              r = { sub: "Blockiert",      icon: "mdi:lock-alert",      color: C.red,    active: true };
      else                                   r = { sub: ls === "unavailable" ? "Nicht erreichbar" : "Unbekannt", icon: "mdi:help", color: C.red, active: true };
      return { ...r, name: q.name || "Haustür", tap: q.navigate ? "nav" : "more" };
    }
    // Heizung/Klima-Zähler: heat/cool sind Sensoren mit der Anzahl aktiver Geräte
    if (q.heat || q.cool) {
      const h = Math.round(this._num(q.heat)), k = Math.round(this._num(q.cool));
      const parts = [];
      if (h > 0) parts.push(`${h} ${h === 1 ? "heizt" : "heizen"}`);
      if (k > 0) parts.push(`${k} ${k === 1 ? "kühlt" : "kühlen"}`);
      const heating = h > 0;
      return {
        sub: parts.length ? parts.join(" · ") : "Alles aus",
        active: h > 0 || k > 0,
        tap: q.navigate ? "nav" : "more",
        name: heating ? (q.heat_name || "Heizung") : (q.name || "Klima"),
        icon: heating ? (q.heat_icon || "mdi:heat-wave") : (q.icon || "mdi:air-conditioner"),
        color: heating ? (q.heat_color || "#f87171") : (q.color || "#38bdf8"),
      };
    }
    const st = this._st(q.entity), dom = (q.entity || "").split(".")[0];
    let sub = "", active = false;
    if (q.entities) {
      const n = q.entities.filter((e) => this._on(e)).length;
      sub = `${n} von ${q.entities.length} an`; active = n > 0;
    } else if (!st) {
      sub = "Nicht gefunden";
    } else {
      const s = st.state;
      switch (dom) {
        case "light": {
          const m = this._members(q.entity);
          const n = m.length ? m.filter((e) => this._st(e)?.state === "on").length : s === "on" ? 1 : 0;
          active = s === "on"; sub = active ? `${n} an` : "Alle aus"; break;
        }
        case "script": case "scene": sub = s === "on" ? "Läuft" : "Tippen zum Starten"; active = s === "on"; break;
        case "vacuum":
          sub = { docked: "Angedockt", cleaning: "Saugt", returning: "Fährt heim", idle: "Bereit", paused: "Pausiert", error: "Fehler" }[s] || s;
          active = ["cleaning", "returning"].includes(s); break;
        case "cover":
          sub = { open: "Offen", closed: "Geschlossen", opening: "Öffnet", closing: "Schließt" }[s] || s;
          active = ["open", "opening", "closing"].includes(s); break;
        case "lock":
          sub = { locked: "Verriegelt", unlocked: "Entriegelt", locking: "Verriegelt …", unlocking: "Entriegelt …", open: "Geöffnet", jammed: "Blockiert" }[s] || s;
          active = s !== "locked"; break;
        case "binary_sensor": {
          const dc = st.attributes.device_class;
          const openClose = ["door", "window", "garage_door", "opening"].includes(dc);
          active = s === "on";
          sub = s === "unavailable" ? "Nicht erreichbar" : openClose ? (active ? "Offen" : "Geschlossen") : (active ? "An" : "Aus");
          break;
        }
        case "climate": active = s !== "off"; sub = active ? `${st.attributes.temperature ?? ""}° · an` : "Aus"; break;
        default: active = s === "on"; sub = active ? "An" : "Aus";
      }
    }
    if (q.sub_entity && this._st(q.sub_entity)) sub = `${Math.round(this._num(q.sub_entity))}° · ${sub}`;
    if (q.sub) sub = q.sub;
    const tap = q.navigate ? "nav" : q.tap || (["script", "scene"].includes(dom) ? "run" : ["light", "switch", "fan", "input_boolean"].includes(dom) && !q.entities ? "toggle" : "more");
    const iconOn = dom === "binary_sensor" ? st?.state === "on" : active;   // Tür-Icon nur bei offener Tür
    return { sub, active, tap, icon: iconOn && q.icon_on ? q.icon_on : undefined };
  }

  /* ---------- Links (zu Dashboards, Ansichten, Webseiten) ---------- */
  _linkTargets() {
    const p = this._hass?.panels || {}, out = [];
    for (const x of Object.values(p)) {
      if (!x.url_path) continue;
      const title = x.title ? (this._hass.localize?.(`panel.${x.title}`) || x.title) : x.url_path;
      out.push([`/${x.url_path}`, title]);
    }
    return out.sort((a, b) => a[0].localeCompare(b[0]));
  }
  _linkForm(pre) {
    const opts = this._linkTargets().map(([u, t]) => `<option value="${esc(u)}">${esc(t)}</option>`).join("");
    const extra = pre === "ae" ? " aein" : "";
    return `<div class="qaddrow qlinkrow">
        <span class="qbl">${icon("mdi:link-variant")}Link zu Dashboard, Ansicht oder Webseite</span>
        <input class="qain qlink qln${extra}" placeholder="Name, z. B. Strom" autocomplete="off">
        <input class="qain qlink qlt${extra}" list="${pre}-links" placeholder="Ziel: /dashboard-strom/pv oder https://…" autocomplete="off">
        <datalist id="${pre}-links">${opts}</datalist>
        <input class="qain qlink qli${extra}" placeholder="Symbol (optional), z. B. mdi:solar-power" autocomplete="off">
        <button class="qbtn" data-act="${pre}link">${icon("mdi:plus")}Link hinzufügen</button>
      </div>`;
  }
  _readLink(root) {
    const g = (c) => root.querySelector(c)?.value.trim() || "";
    const name = g(".qln"), nav = g(".qlt"), ic = g(".qli");
    if (!nav || !(nav.startsWith("/") || nav.startsWith("#") || /^https?:\/\//i.test(nav))) { root.querySelector(".qlt")?.classList.add("bad"); return null; }
    root.querySelectorAll(".qlink").forEach((i) => { i.value = ""; i.blur(); });
    return { link: true, nav, name: name || nav.replace(/^\/|^https?:\/\//g, ""), icon: ic && ic.includes(":") ? ic : "" };
  }

  /* ---------- Schnellzugriff: Anordnung pro Gerät (im Browser gespeichert) ---------- */
  _qaKey() { return "mg-qa-layout-" + (this._config.quick_layout_key || "default"); }
  _qaLayout() {
    if (this._qaL) return this._qaL;
    let l = null;
    try { l = JSON.parse(localStorage.getItem(this._qaKey()) || "null"); } catch (e) {}
    this._qaL = l || { ...(this._config.quick_layout || {}) };
    return this._qaL;
  }
  _qaSave(l) {
    this._qaL = l;
    try { localStorage.setItem(this._qaKey(), JSON.stringify(l)); } catch (e) {}
    this._update(true);
  }
  _qaId(q, i) { return q.id || q.name || "qa" + i; }

  /* alle Kacheln (Konfiguration + selbst hinzugefügte) in gespeicherter Reihenfolge */
  _qaAll() {
    const l = this._qaLayout();
    const base = this._config.quick_actions.map((q, i) => ({ q, id: this._qaId(q, i) }));
    const custom = (l.custom || []).map((c) => {
      if (c.link) return { id: "c:l:" + c.nav, custom: true, q: { link: true, name: c.name, navigate: c.nav, icon: c.icon || "mdi:link-variant", color: c.color || "#94a3b8" } };
      const st = this._st(c.entity), dom = c.entity.split(".")[0];
      return { id: "c:" + c.entity, custom: true, q: {
        name: c.name || st?.attributes?.friendly_name || c.entity, entity: c.entity,
        icon: c.icon || st?.attributes?.icon || QA_ICON[dom] || "mdi:gesture-tap-button",
        color: c.color || QA_COLOR[dom] || "#fb923c" } };
    });
    const all = base.concat(custom), ord = l.order || [];
    const pos = (x) => { const k = ord.indexOf(x.id); return k < 0 ? 1000 + all.indexOf(x) : k; };
    return all.sort((a, b) => pos(a) - pos(b));
  }

  _render_qa() {
    const el = this.shadowRoot.getElementById("qa");
    const act = this.shadowRoot.activeElement;
    if (this._qaAdd && act && act.classList?.contains("qain") && !act.classList.contains("aein") && act.value) return;   // beim Tippen nicht neu zeichnen
    const l = this._qaLayout(), hidden = new Set(l.hidden || []), edit = this._qaEdit;
    const all = this._qaAll(), list = all.filter((x) => !hidden.has(x.id));
    this._qaItems = list;
    const cols = l.cols ? `style="--qa-cols:${l.cols}"` : "";
    const tiles = list.map((x, idx) => {
      const q = x.q, i = this._qaInfo(q);
      const ent = i.tapEntity || q.lock || q.entity || q.count || q.heat || q.cool || q.windows_open || q.windows_tilt;
      const inner = `<span class="qi">${icon(i.icon || q.icon || "mdi:help")}</span>
        <span class="qn">${esc(i.name || q.name)}</span><span class="qs">${esc(i.sub)}</span>`;
      const cls = `qa ${i.active ? "active" : ""} ${i.calm ? "calm" : ""} ${i.pulse && !edit ? "pulse" : ""}`;
      const style = `--a:${esc(i.color || q.color || "#8b91a1")}`;
      const lk = q.link || (i.tap === "nav" && i.sub && /^(Öffnen|Webseite öffnen)$/.test(i.sub));
      if (!edit) return `<button class="${cls} ${lk ? "qlinkt" : ""}" style="${style}" data-act="${i.tap}" data-qa="${idx}" data-entity="${esc(ent)}"${q.navigate ? ` data-nav="${esc(q.navigate)}"` : ""}${q.confirm ? ` data-confirm="${esc(q.name)}"` : ""}>${inner}${lk ? icon(/^https?:/i.test(q.navigate) ? "mdi:open-in-new" : "mdi:arrow-top-right", "qlk") : ""}</button>`;
      return `<div class="${cls} qedit" style="${style}">
        ${inner}
        <span class="qtools">
          <button class="qt" data-act="qamove" data-id="${esc(x.id)}" data-d="-1" aria-label="nach vorne">${icon("mdi:chevron-left")}</button>
          <button class="qt" data-act="qamove" data-id="${esc(x.id)}" data-d="1" aria-label="nach hinten">${icon("mdi:chevron-right")}</button>
          <button class="qt del" data-act="qadel" data-id="${esc(x.id)}" aria-label="Löschen">${icon("mdi:delete-outline")}</button>
        </span></div>`;
    }).join("");

    const shown = all.filter((x) => !hidden.has(x.id)).length;
    const pencil = `<button class="arrow ${edit ? "on" : ""}" data-act="qaedit" aria-label="${edit ? "Fertig" : "Bearbeiten"}" title="${edit ? "Fertig" : "Kacheln bearbeiten"}">${icon(edit ? "mdi:check" : "mdi:pencil-outline")}</button>`;
    let bar = "";
    if (edit) {
      const cur = l.cols || 0;
      const seg = [0, 2, 3, 4, 5, 6].map((n) => `<button class="qseg ${cur === n ? "sel" : ""}" data-act="qacols" data-n="${n}">${n || "Auto"}</button>`).join("");
      const doms = ["light", "switch", "cover", "lock", "fan", "input_boolean", "script", "scene", "climate", "media_player", "vacuum", "button"];
      const opts = this._qaAdd ? Object.keys(this._hass.states).filter((id) => doms.includes(id.split(".")[0])).sort()
        .map((id) => `<option value="${esc(id)}">${esc(this._st(id).attributes.friendly_name || "")}</option>`).join("") : "";
      bar = `<div class="qbar">
          <span class="qbl">Spalten</span><div class="qsegs">${seg}</div>
          <button class="qbtn" data-act="qaadd">${icon("mdi:plus")}Kachel</button>
          <button class="qbtn ghost" data-act="qareset">${icon("mdi:restore")}Zurücksetzen</button>
        </div>
        ${this._qaAdd ? `<div class="qadd">
          ${all.some((x) => hidden.has(x.id)) ? `<div class="qrest"><span class="qbl">Gelöschte Kacheln</span>${all.filter((x) => hidden.has(x.id)).map((x) =>
            `<button class="qchip" data-act="qarestore" data-id="${esc(x.id)}" style="--a:${esc(x.q.color || "#8b91a1")}">${icon(x.q.icon || "mdi:help")}${esc(x.q.name || x.id)}${icon("mdi:plus", "qplus")}</button>`).join("")}</div>` : ""}
          <div class="qaddrow"><input class="qain" list="qa-ents" placeholder="Neues Gerät suchen, z. B. light.stehlampe" autocomplete="off">
          <datalist id="qa-ents">${opts}</datalist>
          <button class="qbtn" data-act="qaaddok">${icon("mdi:check")}Hinzufügen</button>
          <button class="qbtn ghost" data-act="qaadd">Fertig</button></div>
          ${this._linkForm("qa")}</div>` : ""}
        <div class="qhint">Pfeile ändern die Reihenfolge · Papierkorb löscht · über „＋ Kachel“ wieder hinzufügen · gilt nur für dieses Gerät</div>`;
    }
    el.innerHTML = `<div class="hd"><span class="ttl">${esc(this._config.quick_title || "Kontrolle")}</span><span class="lbl">${edit ? `${shown} ${shown === 1 ? "Kachel" : "Kacheln"}` : ""}</span>${pencil}</div>
      ${bar}<div class="qagrid" ${cols}>${tiles}</div>`;
    if (this._qaAdd && this._qaFocus) { this._qaFocus = false; el.querySelector(".qain")?.focus(); }
  }

  _qaAction(act, el) {
    const l = JSON.parse(JSON.stringify(this._qaLayout()));
    const all = this._qaAll().map((x) => x.id);
    if (act === "qaedit") { this._qaEdit = !this._qaEdit; this._qaAdd = false; this._update(true); return; }
    if (act === "qavis") {
      const h = new Set(l.hidden || []), id = el.dataset.id;
      h.has(id) ? h.delete(id) : h.add(id); l.hidden = [...h];
    } else if (act === "qamove") {
      const ord = all.slice(), i = ord.indexOf(el.dataset.id), j = i + Number(el.dataset.d);
      if (j < 0 || j >= ord.length) return;
      [ord[i], ord[j]] = [ord[j], ord[i]]; l.order = ord;
    } else if (act === "qacols") { l.cols = Number(el.dataset.n) || undefined; }
    else if (act === "qaadd") { this._qaAdd = !this._qaAdd; this._qaFocus = this._qaAdd; this._update(true); return; }
    else if (act === "qaaddok") {
      const inp = this.shadowRoot.querySelector(".qain:not(.aein)"), v = inp?.value.trim();
      inp?.blur(); this._qaFocus = true;
      if (!v || !this._st(v)) { this.shadowRoot.querySelector(".qain")?.classList.add("bad"); return; }
      l.custom = (l.custom || []).filter((c) => c.entity !== v).concat([{ entity: v }]);
      l.order = (l.order && l.order.length ? l.order : this._qaAll().map((x) => x.id)).filter((x) => x !== "c:" + v).concat(["c:" + v]);
    } else if (act === "qadel") {
      const id = el.dataset.id;
      if (id.startsWith("c:")) {           // selbst hinzugefügt: ganz entfernen
        l.custom = (l.custom || []).filter((c) => (c.link ? "c:l:" + c.nav : "c:" + c.entity) !== id);
        l.hidden = (l.hidden || []).filter((x) => x !== id);
      } else l.hidden = [...new Set([...(l.hidden || []), id])];   // vorgegeben: in „Gelöschte Kacheln“
      l.order = (l.order || []).filter((x) => x !== id);
    } else if (act === "qalink") {
      const lk = this._readLink(this.shadowRoot.getElementById("qa"));
      if (!lk) return;
      l.custom = (l.custom || []).filter((c) => !(c.link && c.nav === lk.nav)).concat([lk]);
      l.order = (l.order && l.order.length ? l.order : this._qaAll().map((x) => x.id)).filter((x) => x !== "c:l:" + lk.nav).concat(["c:l:" + lk.nav]);
    } else if (act === "qarestore") {
      this.shadowRoot.activeElement?.blur?.();
      l.hidden = (l.hidden || []).filter((x) => x !== el.dataset.id);
      l.order = (l.order || []).filter((x) => x !== el.dataset.id).concat([el.dataset.id]);
    } else if (act === "qareset") {
      if (!window.confirm("Schnellzugriff auf diesem Gerät zurücksetzen?")) return;
      try { localStorage.removeItem(this._qaKey()); } catch (e) {}
      this._qaL = null; this._update(true); return;
    }
    this._qaSave(l);
  }

  /* ---------- Schnellzugriff (Aktionen) ---------- */
  _actKey() { return "mg-act-layout-" + (this._config.quick_layout_key || "default"); }
  _actLayout() {
    if (this._actL) return this._actL;
    let l = null;
    try { l = JSON.parse(localStorage.getItem(this._actKey()) || "null"); } catch (e) {}
    this._actL = l || { ...(this._config.actions?.layout || {}) };
    return this._actL;
  }
  _actSave(l) { this._actL = l; try { localStorage.setItem(this._actKey(), JSON.stringify(l)); } catch (e) {} this._update(true); }

  _actAll() {
    const l = this._actLayout();
    const base = (this._config.actions?.entities || []).map((x) => (typeof x === "string" ? { entity: x } : x));
    const custom = (l.custom || []).map((c) => ({ ...c, custom: true }));
    const seen = new Set(), all = [];
    for (const x of base.concat(custom)) {
      const id = x.link || x.navigate ? "l:" + (x.nav || x.navigate) : x.entity;
      if (!id || seen.has(id)) continue; seen.add(id);
      all.push({ ...x, id, ...(x.navigate && !x.nav ? { link: true, nav: x.navigate } : {}) });
    }
    const ord = l.order || [], pos = (x) => { const k = ord.indexOf(x.id); return k < 0 ? 1000 + all.indexOf(x) : k; };
    return all.sort((a, b) => pos(a) - pos(b));
  }

  _actInfo(x) {
    if (x.link) return { name: x.name || x.nav, color: x.color || "#94a3b8", on: false, sub: /^https?:/i.test(x.nav) ? "Webseite öffnen" : "Öffnen",
      ic: x.icon || "mdi:link-variant", tap: "nav", svc: "", na: false, dom: "link" };
    const st = this._st(x.entity), dom = x.entity.split(".")[0], v = st?.state, a = st?.attributes || {};
    const name = x.name || a.friendly_name || x.entity;
    const na = !st || ["unavailable", "unknown"].includes(v);
    let color = x.color || QA_COLOR[dom] || "#fb923c", on = false, sub = "", ic = x.icon || a.icon || QA_ICON[dom] || "mdi:gesture-tap-button";
    let tap = "atog", svc = "";
    if (["light", "switch", "fan", "input_boolean", "automation"].includes(dom)) {
      on = v === "on";
      sub = on ? (a.brightness != null ? `An · ${Math.round(a.brightness / 2.55)} %` : "An") : "Aus";
      if (dom === "automation") sub = on ? "Aktiv" : "Inaktiv";
      if (dom === "light" && on && Array.isArray(a.rgb_color)) { const [r, g, b] = a.rgb_color; if (r + g + b > 60) color = `rgb(${r},${g},${b})`; }
      if (dom === "switch" && !x.icon && !a.icon) ic = "mdi:power-socket-eu";
    } else if (dom === "cover") {
      const pos = a.current_position, moving = v === "opening" || v === "closing";
      on = v === "open" || moving;
      sub = { open: pos != null && pos < 100 ? `${pos} % offen` : "Offen", closed: "Zu", opening: "Fährt hoch …", closing: "Fährt runter …" }[v] || v;
      if (!x.icon && !a.icon) ic = moving ? (v === "opening" ? "mdi:arrow-up" : "mdi:arrow-down") : v === "closed" ? "mdi:window-shutter" : "mdi:window-shutter-open";
      tap = "asvc"; svc = moving ? "cover.stop_cover" : v === "closed" ? "cover.open_cover" : "cover.close_cover";
    } else if (["script", "scene", "button", "input_button"].includes(dom)) {
      on = v === "on" || this._actFlash === x.entity;
      sub = this._actFlash === x.entity ? "Ausgeführt ✓" : dom === "script" ? (v === "on" ? "Läuft …" : "Tippen zum Starten") : dom === "scene" ? "Szene" : "Auslösen";
      tap = "arun";
    } else if (dom === "media_player") {
      on = !["off", "standby", "idle", "unavailable", "unknown"].includes(v);
      sub = a.media_title || { playing: "Spielt", paused: "Pausiert", on: "An", off: "Aus", idle: "Bereit" }[v] || v;
      tap = "aplay";
    } else { sub = v; tap = "more"; }
    if (na) { sub = "Nicht erreichbar"; on = false; tap = "more"; }
    return { name, color, on, sub, ic, tap, svc, na, dom };
  }

  _actTile(x, edit) {
    const i = this._actInfo(x);
    const inner = `<span class="qi">${icon(i.ic)}</span><span class="qn">${esc(i.name)}</span><span class="qs">${esc(i.sub)}</span>`;
    const cls = `qa ${i.on ? "active" : ""} ${i.na ? "qna" : ""}`;
    if (edit) return `<div class="${cls} qedit" style="--a:${i.color}">${inner}
        <span class="qtools">
          <button class="qt" data-act="aemove" data-id="${esc(x.id)}" data-d="-1" aria-label="nach vorne">${icon("mdi:chevron-left")}</button>
          <button class="qt" data-act="aemove" data-id="${esc(x.id)}" data-d="1" aria-label="nach hinten">${icon("mdi:chevron-right")}</button>
          <button class="qt del" data-act="aedel" data-id="${esc(x.id)}" aria-label="Löschen">${icon("mdi:delete-outline")}</button>
        </span></div>`;
    if (x.link) return `<button class="${cls} qlinkt" style="--a:${i.color}" data-act="nav" data-nav="${esc(x.nav)}">${inner}${icon(/^https?:/i.test(x.nav) ? "mdi:open-in-new" : "mdi:arrow-top-right", "qlk")}</button>`;
    return `<button class="${cls}" style="--a:${i.color}" data-act="${i.tap}" data-entity="${esc(x.entity)}" data-hold="1"${i.svc ? ` data-svc="${i.svc}"` : ""}${x.confirm ? ` data-confirm="${esc(i.name)}"` : ""}>${inner}</button>`;
  }

  _render_act() {
    const el = this.shadowRoot.getElementById("act");
    if (!el) return;
    const act = this.shadowRoot.activeElement;
    if (this._actAdd && act && act.classList?.contains("aein") && act.value) return;
    const cfg = this._config.actions || {}, l = this._actLayout(), hidden = new Set(l.hidden || []), edit = this._actEdit;
    const all = this._actAll(), list = all.filter((x) => !hidden.has(x.id));
    const tiles = list.map((x) => this._actTile(x, edit)).join("") || `<div class="empty">Noch keine Aktionen – über den Stift hinzufügen</div>`;
    let bar = "";
    if (edit) {
      const cur = l.cols || 0;
      const seg = [0, 2, 3, 4, 5, 6].map((n) => `<button class="qseg ${cur === n ? "sel" : ""}" data-act="aecols" data-n="${n}">${n || "Auto"}</button>`).join("");
      const doms = ["light", "switch", "cover", "script", "scene", "fan", "input_boolean", "button", "input_button", "media_player", "automation"];
      const used = new Set(all.filter((x) => !hidden.has(x.id)).map((x) => x.entity));
      const opts = this._actAdd ? Object.keys(this._hass.states).filter((id) => doms.includes(id.split(".")[0]) && !used.has(id)).sort()
        .map((id) => `<option value="${esc(id)}">${esc(this._st(id).attributes.friendly_name || "")}</option>`).join("") : "";
      const removed = all.filter((x) => hidden.has(x.id));
      bar = `<div class="qbar"><span class="qbl">Spalten</span><div class="qsegs">${seg}</div>
          <button class="qbtn" data-act="aeadd">${icon("mdi:plus")}Aktion</button>
          <button class="qbtn ghost" data-act="aereset">${icon("mdi:restore")}Zurücksetzen</button></div>
        ${this._actAdd ? `<div class="qadd">
          ${removed.length ? `<div class="qrest"><span class="qbl">Gelöschte Aktionen</span>${removed.map((x) => { const i = this._actInfo(x);
            return `<button class="qchip" data-act="aerestore" data-id="${esc(x.id)}" style="--a:${i.color}">${icon(i.ic)}${esc(i.name)}${icon("mdi:plus", "qplus")}</button>`; }).join("")}</div>` : ""}
          <div class="qaddrow"><input class="qain aein" list="act-ents" placeholder="Licht, Rollladen, Skript, Szene … suchen" autocomplete="off">
          <datalist id="act-ents">${opts}</datalist>
          <button class="qbtn" data-act="aeaddok">${icon("mdi:check")}Hinzufügen</button>
          <button class="qbtn ghost" data-act="aeadd">Fertig</button></div>
          ${this._linkForm("ae")}</div>` : ""}
        <div class="qhint">Pfeile ändern die Reihenfolge · Papierkorb löscht · über „＋ Aktion“ wieder hinzufügen · gilt nur für dieses Gerät</div>`;
    }
    const sc = el.querySelector(".qagrid")?.scrollTop || 0;
    el.innerHTML = `<div class="hd"><span class="ttl">${esc(cfg.title || "Schnellzugriff")}</span><span class="lbl">${edit ? `${list.length} ${list.length === 1 ? "Aktion" : "Aktionen"}` : ""}</span>
        <button class="arrow ${edit ? "on" : ""}" data-act="aeedit" aria-label="${edit ? "Fertig" : "Bearbeiten"}" title="${edit ? "Fertig" : "Aktionen bearbeiten"}">${icon(edit ? "mdi:check" : "mdi:pencil-outline")}</button></div>
      ${bar}<div class="qagrid" ${l.cols ? `style="--qa-cols:${l.cols}"` : ""}>${tiles}</div>`;
    const g = el.querySelector(".qagrid"); if (g) g.scrollTop = sc;
    if (this._actAdd && this._actFocus) { this._actFocus = false; el.querySelector(".aein")?.focus(); }
  }

  _actAction(a, el) {
    const h = this._hass, id = el.dataset.entity;
    if (a === "atog" || a === "arun" || a === "aplay" || a === "asvc") {
      if (el.dataset.confirm && !window.confirm(`${el.dataset.confirm} wirklich schalten?`)) return;
      const dom = id.split(".")[0];
      if (a === "atog") h.callService("homeassistant", "toggle", { entity_id: id });
      else if (a === "aplay") h.callService("media_player", "media_play_pause", { entity_id: id });
      else if (a === "asvc") { const [d, svc] = el.dataset.svc.split("."); h.callService(d, svc, { entity_id: id }); }
      else {
        if (dom === "button" || dom === "input_button") h.callService(dom, "press", { entity_id: id });
        else h.callService(dom, "turn_on", { entity_id: id });
        this._actFlash = id; this._update(true);
        setTimeout(() => { if (this._actFlash === id) { this._actFlash = null; this._update(true); } }, 1200);
      }
      return;
    }
    const l = JSON.parse(JSON.stringify(this._actLayout())), all = this._actAll().map((x) => x.id);
    if (a === "aeedit") { this._actEdit = !this._actEdit; this._actAdd = false; this._update(true); return; }
    if (a === "aerestore") {
      this.shadowRoot.activeElement?.blur?.();
      l.hidden = (l.hidden || []).filter((x) => x !== el.dataset.id);
      l.order = (all.length ? all : []).filter((x) => x !== el.dataset.id).concat([el.dataset.id]);
    } else if (a === "aemove") {
      const ord = all.slice(), i = ord.indexOf(el.dataset.id), j = i + Number(el.dataset.d);
      if (j < 0 || j >= ord.length) return;
      [ord[i], ord[j]] = [ord[j], ord[i]]; l.order = ord;
    } else if (a === "aecols") l.cols = Number(el.dataset.n) || undefined;
    else if (a === "aeadd") { this._actAdd = !this._actAdd; this._actFocus = this._actAdd; this._update(true); return; }
    else if (a === "aeaddok") {
      const inp = this.shadowRoot.querySelector(".aein"), v = inp?.value.trim();
      if (!v || !this._st(v)) { inp?.classList.add("bad"); return; }
      inp.blur(); this._actFocus = true;
      const base = (this._config.actions?.entities || []).some((x) => (x.entity || x) === v);
      if (!base) l.custom = (l.custom || []).filter((c) => c.entity !== v).concat([{ entity: v }]);
      l.hidden = (l.hidden || []).filter((x) => x !== v);
      l.order = all.filter((x) => x !== v).concat([v]);
      inp.value = "";
    } else if (a === "aelink") {
      const lk = this._readLink(this.shadowRoot.getElementById("act"));
      if (!lk) return;
      l.custom = (l.custom || []).filter((c) => !(c.link && c.nav === lk.nav)).concat([lk]);
      l.hidden = (l.hidden || []).filter((x) => x !== "l:" + lk.nav);
      l.order = all.filter((x) => x !== "l:" + lk.nav).concat(["l:" + lk.nav]);
    } else if (a === "aedel") {
      const id = el.dataset.id;
      const cid = (c) => (c.link ? "l:" + c.nav : c.entity);
      if ((l.custom || []).some((c) => cid(c) === id)) { l.custom = l.custom.filter((c) => cid(c) !== id); l.hidden = (l.hidden || []).filter((x) => x !== id); }
      else l.hidden = [...new Set([...(l.hidden || []), id])];
      l.order = (l.order || []).filter((x) => x !== id);
    } else if (a === "aereset") {
      if (!window.confirm("Schnellzugriff auf diesem Gerät zurücksetzen?")) return;
      try { localStorage.removeItem(this._actKey()); } catch (e) {}
      this._actL = null; this._update(true); return;
    }
    this._actSave(l);
  }

  /* ---------- Räume ---------- */
  _render_rooms() {
    const tabs = this._config.rooms, all = tabs.flatMap((t) => t.rooms);
    const lit = (r) => r.light && this._st(r.light)?.state === "on";
    const n = all.filter(lit).length;
    const tabBar = tabs.map((t, i) => {
      const c = t.rooms.filter(lit).length;
      return `<button class="tab ${i === this._tab ? "sel" : ""}" data-act="tab" data-tab="${i}">${esc(t.tab)}${c ? `<span class="badge">${c}</span>` : ""}</button>`;
    }).join("");
    const rooms = (tabs[this._tab]?.rooms || []).map((r) => {
      const on = lit(r), parts = [];
      if (r.temp && this._st(r.temp) && !isNaN(parseFloat(this._st(r.temp).state))) parts.push(`${Math.round(this._num(r.temp))}°`);
      if (on) {
        const m = this._members(r.light); const k = m.length ? m.filter((e) => this._st(e)?.state === "on").length : 1;
        parts.push(`${k} ${k === 1 ? "Licht" : "Lichter"}`);
      }
      const statusOn = r.status && this._on(r.status);
      if (r.status && (statusOn || r.status_off)) parts.push(statusOn ? (r.status_on || "An") : r.status_off);
      if (!on && !statusOn && !r.status_off) parts.push("Aus");
      const alert = r.status && statusOn && !r.light;
      return `<div class="room ${on ? "active" : ""} ${alert ? "alert" : ""}" data-act="more" data-entity="${esc(r.light || r.status)}">
        <span class="ri">${icon(r.icon || "mdi:home")}</span>
        <span class="rt"><span class="rn">${esc(r.name)}</span><span class="rs">${esc(parts.join(" · "))}</span></span>
        ${r.light ? `<button class="bulb" data-act="toggle" data-entity="${esc(r.light)}">${icon(on ? "mdi:lightbulb" : "mdi:lightbulb-outline")}</button>` : ""}
      </div>`;
    }).join("");
    this.shadowRoot.getElementById("rooms").innerHTML =
      this._hd("Räume", `${n} ${n === 1 ? "Raum" : "Räume"} an`) + `<div class="tabs">${tabBar}</div><div class="roomgrid">${rooms}</div>`;
  }

  /* ---------- Kalender ---------- */
  _cals() {
    return (this._config.calendar.entities || []).map((x) => (typeof x === "string" ? { entity: x } : x));
  }

  async _loadEvents() {
    const c = this._config.calendar, cals = this._cals();
    if (!this._hass || !cals.length) return;
    const start = new Date(); start.setHours(0, 0, 0, 0);
    const end = new Date(start.getTime() + c.days * 86400000);
    const q = `?start=${encodeURIComponent(start.toISOString())}&end=${encodeURIComponent(end.toISOString())}`;
    const res = await Promise.all(cals.map((cal) =>
      this._hass.callApi("GET", `calendars/${cal.entity}${q}`).then((l) => l.map((ev) => ({ ...ev, cal: cal.entity }))).catch(() => [])));
    this._events = res.flat().map((ev) => {
      const allDay = !!ev.start.date;
      const s = allDay ? new Date(ev.start.date + "T00:00:00") : new Date(ev.start.dateTime);
      const e = ev.end
        ? (allDay ? new Date(ev.end.date + "T00:00:00") : new Date(ev.end.dateTime))
        : new Date(s.getTime() + (allDay ? 86400000 : 3600000));
      return { summary: ev.summary, allDay, ts: s.getTime(), te: e.getTime(), cal: ev.cal };
    }).sort((a, b) => a.ts - b.ts);
    this._update();
  }

  _render_cal() {
    const c = this._config.calendar, now = Date.now();
    const today0 = new Date(); today0.setHours(0, 0, 0, 0);
    const today1 = today0.getTime() + 86400000;
    const cals = Object.fromEntries(this._cals().map((x) => [x.entity, x]));
    const calName = (id) => cals[id]?.name || this._st(id)?.attributes?.friendly_name || id;

    const upcoming = this._events.filter((e) => e.te > now);            // vorbei = ausgeblendet
    const hl = upcoming.find((e) => e.cal === c.highlight && e.ts < today1);

    const rows = upcoming.slice(0, c.max).map((e) => {
      const d = new Date(Math.max(e.ts, today0.getTime()));              // mehrtägig: ab heute anzeigen
      const running = !e.allDay && e.ts <= now;
      const time = e.allDay ? "Ganztägig" : running ? "Jetzt" : `${pad(new Date(e.ts).getHours())}:${pad(new Date(e.ts).getMinutes())}`;
      const color = cals[e.cal]?.color || "var(--muted)";
      return `<div class="ev ${e.cal === c.highlight ? "hl" : ""}" style="--cc:${esc(color)}" data-act="more" data-entity="${esc(e.cal)}">
        <span class="evd"><b>${d.getDate()}</b><small>${MON[d.getMonth()]}</small></span>
        <span class="evt"><span class="evn">${esc(e.summary)}</span>
          <span class="evs"><i class="dot"></i>${WD[d.getDay()]} · ${esc(calName(e.cal))}</span></span>
        <span class="evtime ${e.allDay ? "allday" : ""} ${running ? "now" : ""}">${time}</span></div>`;
    }).join("") || `<div class="empty">Keine Termine in den nächsten ${c.days} Tagen</div>`;

    const el = this.shadowRoot.getElementById("cal");
    const oldList = el.querySelector(".evs-list");
    const scrollTop = oldList ? oldList.scrollTop : 0;                 // Scrollposition beim Neuzeichnen behalten
    const count = Math.min(upcoming.length, c.max);
    const vis = Math.max(1, c.visible || c.max);
    const scroll = count > vis;

    // Kopf und Liste neu zeichnen, die Schul-Zeilen darunter bleiben unangetastet (Pop-up bleibt offen)
    let body = el.querySelector(".calbody");
    if (!body) {
      el.innerHTML = `<div class="calbody"></div>`;
      body = el.querySelector(".calbody");
      if (this._school) { const slot = document.createElement("div"); slot.className = "calschool"; slot.appendChild(this._school); el.appendChild(slot); }
    }
    body.innerHTML = this._hd("Kalender", hl ? `${esc(hl.summary)} heute` : "", this._cals()[0]?.entity, "warn") +
      `<div class="evs-list ${scroll ? "scroll" : ""}" style="--vis:${vis}">${rows}</div>`;

    const list = el.querySelector(".evs-list");
    if (scroll) {
      list.scrollTop = scrollTop;
      const edge = () => list.classList.toggle("end", list.scrollTop + list.clientHeight >= list.scrollHeight - 2);
      list.addEventListener("scroll", edge, { passive: true });
      requestAnimationFrame(edge);
    }
  }

  /* ---------- Auto ---------- */
  /* ev_assistant-Entitäten finden (Integration „ev_assistant“, über translation_key) */
  _eva() {
    const cfg = this._config.car.ev_assistant;
    if (cfg && typeof cfg === "object") return cfg;
    const reg = this._hass?.entities;
    if (!reg) return {};
    if (this._evaCache?.ref === reg) return this._evaCache.map;
    const map = {};
    for (const e of Object.values(reg)) if (e.platform === "ev_assistant" && e.translation_key) map[e.translation_key] = e.entity_id;
    this._evaCache = { ref: reg, map };
    return map;
  }

  /* Wert mit Einheit hübsch formatieren */
  _fmt(id, dec, raw) {
    const s = this._st(id);
    if (!s || (raw == null && OFFLINE_HD.includes(s.state))) return null;
    const u = s.attributes.unit_of_measurement || "", v = parseFloat(raw ?? s.state);
    if (isNaN(v)) return { v: s.state, u: "" };
    if (s.attributes.device_class === "duration" || ["h", "min", "s"].includes(u)) {
      const m = u === "h" ? v * 60 : u === "s" ? v / 60 : v;
      return { v: m >= 60 ? `${Math.floor(m / 60)}:${pad(Math.round(m % 60))}` : `${Math.round(m)}`, u: m >= 60 ? "h" : "min" };
    }
    const d = dec ?? (Math.abs(v) >= 1000 ? 0 : Math.abs(v) >= 100 ? 0 : Math.abs(v) >= 10 ? 1 : 2);
    return { v: de(v, Math.min(d, 2)).replace(/,0+$/, ""), u };
  }

  _carState() {
    const c = this._config.car, ev = c.evcc || {};
    const pw = ev.power ? this._w(ev.power) : this._w(this._config.energy.car_power);
    const charging = this._st(ev.charging)?.state === "on" || pw > 50;
    const plugged = this._st(ev.connected)?.state === "on" || this._st(c.cable)?.state === "on";
    const driving = this._st(c.status)?.state === "on";
    return { charging, plugged, driving, pw };
  }

  _render_car() {
    const c = this._config.car, ev = c.evcc || {}, E = this._eva();
    const soc = Math.max(0, Math.min(100, this._num(c.soc)));
    const { charging, plugged, driving, pw } = this._carState();
    const range = this._st(c.range), rEst = this._fmt(E.range_estimate, 0);
    const status = charging ? "Lädt" : driving ? (c.status_on || "Unterwegs") : plugged ? "Angesteckt" : (c.status_off || "Geparkt");

    // Markierungen im Balken: Ladeziel (evcc) und Mindest-SoC (immer laden bis …)
    const lim = ev.limit_soc && this._st(ev.limit_soc) ? this._num(ev.limit_soc) : null;
    const min = ev.min_soc && this._st(ev.min_soc) ? this._num(ev.min_soc) : null;
    const marks = [min != null && min > 0 && min < 100 ? `<i class="bm min" style="left:${min}%" title="Mindestladung ${Math.round(min)} %"></i>` : "",
      lim != null && lim > 0 && lim < 100 ? `<i class="bm lim" style="left:${lim}%" title="Ladeziel ${Math.round(lim)} %"></i>` : ""].join("");

    // Infozeile: beim Laden Leistung/Energie/PV/Fertig, sonst letzte Fahrt bzw. letzte Ladung
    let line = "";
    if (charging) {
      const p = this._power(pw), se = this._fmt(ev.session_energy, 1), sp = this._fmt(ev.session_solar, 0), rem = this._fmt(ev.remaining);
      const fin = this._st(ev.finish), finD = fin && !OFFLINE_HD.includes(fin.state) ? new Date(fin.state) : null;
      line = `<div class="cline charge">
        <span>${icon("mdi:flash")}<b>${p.v}</b> ${p.u}</span>
        ${se ? `<span>${icon("mdi:battery-plus-variant")}<b>${se.v}</b> ${se.u || "kWh"}</span>` : ""}
        ${sp ? `<span class="pv">${icon("mdi:solar-power-variant")}<b>${sp.v}</b> %</span>` : ""}
        ${finD && !isNaN(finD) ? `<span>${icon("mdi:flag-checkered")}<b>${pad(finD.getHours())}:${pad(finD.getMinutes())}</b></span>` : rem ? `<span>${icon("mdi:timer-sand")}<b>${rem.v}</b> ${rem.u}</span>` : ""}
      </div>`;
    } else {
      const lt = this._fmt(E.last_trip_km, 0), lc = this._st(ev.last_charge);
      const lcD = lc && !OFFLINE_HD.includes(lc.state) ? new Date(lc.state) : null;
      const parts = [];
      if (lt) parts.push(`<span>${icon("mdi:map-marker-path")}Letzte Fahrt <b>${lt.v}</b> km</span>`);
      if (lcD && !isNaN(lcD)) parts.push(`<span>${icon("mdi:ev-station")}Geladen <b>${this._ago(lcD)}</b></span>`);
      if (parts.length) line = `<div class="cline">${parts.join("")}</div>`;
    }

    // drei Kennzahlen aus ev_assistant
    const LBL = { vehicle_avg_consumption: "Ø Verbrauch", trip_avg_consumption: "Ø Fahrten", odo_month_km: "km Monat", odo_day_km: "km heute",
      odo_week_km: "km Woche", odo_year_km: "km Jahr", cost_month: "Kosten Monat", cost_year: "Kosten Jahr", cost_week: "Kosten Woche",
      savings: "Ersparnis gesamt", kwh_month: "kWh Monat", odo_avg_day: "Ø km/Tag", odo: "km-Stand", range_estimate: "Reichweite",
      total_trip_km: "km gesamt", cost_year: "Kosten gesamt" };
    const stats = (c.stats || []).map((k) => {
      const id = E[k] || (k.includes(".") ? k : null), f = this._fmt(id);
      if (!f) return "";
      return `<button class="cstat" data-act="more" data-entity="${esc(id)}"><span>${esc(LBL[k] || this._st(id)?.attributes?.friendly_name || k)}</span><b>${esc(f.v)}<small>${esc(f.u.replace("kWh/100km", "kWh/100"))}</small></b></button>`;
    }).join("");

    // Hinweise von ev_assistant (Fremdladung/Fahrt erfassen, Wartung)
    const flags = [];
    if (this._st(E.pending)?.state === "on") flags.push(["mdi:ev-station", "Fremdladung erfassen", E.pending]);
    if (this._st(E.trip_pending)?.state === "on") flags.push(["mdi:map-marker-question", "Fahrt erfassen", E.trip_pending]);
    const wf = this._st(E.wartung_faellig);
    if (wf && ["on", "true", "ja", "fällig"].includes(String(wf.state).toLowerCase())) flags.push(["mdi:wrench", "Wartung fällig", E.wartung_faellig]);

    // Kabel-Chip
    let cableChip = "";
    const cab = this._st(c.cable) || this._st(ev.connected);
    if (cab) {
      const known = ["on", "off"].includes(cab.state), on = cab.state === "on";
      cableChip = `<button class="chip ${!known ? "" : on ? "ok" : "bad"}" data-act="more" data-entity="${esc(c.cable || ev.connected)}">${icon(on ? "mdi:ev-plug-type2" : "mdi:power-plug-off-outline")}${!known ? "Kabel ?" : on ? "Eingesteckt" : "Abgesteckt"}</button>`;
    }

    this.shadowRoot.getElementById("car").innerHTML = `
      <div class="hd"><span class="ttl">${esc(c.name)}</span><span class="lbl ${charging ? "chg" : ""}">${charging ? `${icon("mdi:lightning-bolt")} ` : ""}${esc(status)}</span>
        <button class="arrow" data-act="cardetail" aria-label="Details">${icon("mdi:chevron-right")}</button></div>
      <div class="carbody" data-act="cardetail">
        <div><div class="soc">${Math.round(soc)}<sup>%</sup></div>
          <div class="range">${range ? `${Math.round(this._num(c.range))} km` : rEst ? `${rEst.v} km` : ""}${range && rEst ? `<small> · real ≈ ${rEst.v} km</small>` : ""}</div></div>
        ${c.image ? `<img class="carimg" src="${esc(c.image)}" alt="" onerror="this.style.display='none'">` : ""}
      </div>
      <div class="bar">${marks}<span style="width:${soc}%" class="${charging ? "charging" : ""}"></span></div>
      ${line}
      ${flags.length ? `<div class="cflags">${flags.map(([i, t, id]) => `<button class="chip warn" data-act="more" data-entity="${esc(id)}">${icon(i)}${t}</button>`).join("")}</div>` : ""}
      ${stats && this._carPage ? `<div class="cstats">${stats}</div>` : ""}
      ${this._carPage ? "" : `<div class="chips">${cableChip}${this._selChip(c.mode, c.mode_styles)}${
        this._matches(this._st(c.mode)?.state, c.always_when) ? this._selChip(c.always, c.always_styles, c.always_label, c.always_icon_only) : ""}${
        this._st(c.limit) ? `<button class="chip" data-act="more" data-entity="${esc(c.limit)}">${icon("mdi:speedometer")}${esc(this._st(c.limit).state)} ${esc(this._st(c.limit).attributes.unit_of_measurement || "")}</button>` : ""}</div>`}`;
    if (this._menu && !this.shadowRoot.contains(this._menu.anchorEl)) this._closeMenu();
    const d = this.shadowRoot.getElementById("cardlg");
    if (d?.open && d.dataset.mode === "car") { const sc = d.querySelector(".dbody")?.scrollTop || 0; d.innerHTML = this._carDetail(); const b = d.querySelector(".dbody"); if (b) b.scrollTop = sc; }
  }

  _ago(d) {
    const m = Math.round((Date.now() - d.getTime()) / 60000);
    if (m < 60) return `vor ${Math.max(1, m)} min`;
    if (m < 24 * 60) return `vor ${Math.round(m / 60)} h`;
    const days = Math.round(m / 1440);
    return days === 1 ? "gestern" : `vor ${days} Tagen`;
  }

  /* Detailfenster Auto */
  _carDetail() {
    const c = this._config.car, ev = c.evcc || {}, E = this._eva();
    const tile = (lbl, id, dec) => { const f = this._fmt(id, dec); return f ? `<button class="cdt" data-act="more" data-entity="${esc(id)}"><span>${esc(lbl)}</span><b>${esc(f.v)}<small>${esc(f.u)}</small></b></button>` : ""; };
    const sect = (t, ic, html) => html.replace(/\s/g, "") ? `<section class="ds"><div class="dsh">${icon(ic)}${t}</div><div class="cdgrid">${html}</div></section>` : "";
    const { charging, pw } = this._carState();
    const p = this._power(pw);
    const plan = this._st(E.evcc_charge_plan), mode = this._st(E.evcc_mode_control), rec = this._st(E.charge_before_pv_recommended);
    const info = [
      plan && !OFFLINE_HD.includes(plan.state) ? `<div class="cdinfo" data-act="more" data-entity="${esc(E.evcc_charge_plan)}">${icon("mdi:calendar-clock")}<span><small>Ladeplan</small>${esc(plan.state)}</span></div>` : "",
      mode && !OFFLINE_HD.includes(mode.state) ? `<div class="cdinfo" data-act="more" data-entity="${esc(E.evcc_mode_control)}">${icon("mdi:robot-outline")}<span><small>Modus-Steuerung</small>${esc(mode.state)}</span></div>` : "",
      rec?.state === "on" ? `<div class="cdinfo warn" data-act="more" data-entity="${esc(E.charge_before_pv_recommended)}">${icon("mdi:weather-cloudy-alert")}<span><small>Empfehlung</small>Laden vor PV sinnvoll</span></div>` : "",
    ].join("");
    return `<div class="dpan">
      <div class="dhd"><span class="dico">${icon("mdi:car-electric")}</span>
        <span class="rtx"><span class="rname">${esc(c.name)}</span><span class="rsub">${Math.round(this._num(c.soc))} % · ${charging ? `lädt mit ${p.v} ${p.u}` : "lädt nicht"}</span></span>
        <button class="dx" data-act="cardclose" aria-label="Schließen">${icon("mdi:close")}</button></div>
      <div class="dbody">
        ${info ? `<div class="cdinfos">${info}</div>` : ""}
        ${sect("Laden (evcc)", "mdi:ev-station", [
          charging ? `<button class="cdt hot" data-act="more" data-entity="${esc(ev.power || "")}"><span>Leistung</span><b>${p.v}<small>${p.u}</small></b></button>` : "",
          tile("Sitzung", ev.session_energy, 1), tile("PV-Anteil Sitzung", ev.session_solar, 0), tile("Kosten Sitzung", ev.session_price, 2),
          tile("Restzeit", ev.remaining), tile("Ladedauer", ev.duration), tile("PV-Anteil gesamt", ev.solar_total, 0)].join(""))}
        ${sect("Fahren", "mdi:road-variant", [
          tile("Kilometerstand", E.odo, 0), tile("Heute", E.odo_day_km, 0), tile("Woche", E.odo_week_km, 0), tile("Monat", E.odo_month_km, 0),
          tile("Jahr", E.odo_year_km, 0), tile("Ø km/Tag", E.odo_avg_day, 0), tile("Erwartet (Jahr)", E.odo_year_projected, 0),
          tile("Letzte Fahrt", E.last_trip_km, 0), tile("Fahrten", E.trip_count, 0)].join(""))}
        ${sect("Verbrauch & Akku", "mdi:battery-heart-variant", [
          tile("Ø Fahrzeug", E.vehicle_avg_consumption, 1), tile("Ø Fahrtenbuch", E.trip_avg_consumption, 1), tile("Reichweite (real)", E.range_estimate, 0),
          tile("Verfügbar", E.available_kwh, 1), tile("Kapazität (gemessen)", E.battery_capacity, 1), tile("Vollzyklen", E.equivalent_full_cycles, 1),
          tile("Ladewirkungsgrad", E.measured_efficiency, 0)].join(""))}
        ${sect("Kosten & Energie", "mdi:cash-multiple", [
          tile("Kosten heute", E.cost_day, 2), tile("Kosten Monat", E.cost_month, 2), tile("Kosten Jahr", E.cost_year, 0),
          tile("kWh Monat", E.kwh_month, 0), tile("kWh Jahr", E.kwh_year, 0), tile("Heimladen", E.home_kwh, 0),
          tile("Fremdladen", E.total_kwh, 0), tile("Ersparnis ggü. Verbrenner", E.savings, 0), tile("CO₂-Ersparnis", E.co2_savings, 0)].join(""))}
      </div></div>`;
  }

  /* Wert gegen "a|b|c" prüfen, ohne Groß-/Kleinschreibung */
  _matches(v, keys) { return v != null && String(keys || "").toLowerCase().split("|").map((k) => k.trim()).includes(String(v).toLowerCase()); }
  _styleFor(styles, v) {
    for (const [k, m] of Object.entries(styles || {})) if (this._matches(v, k)) return m;
    return {};
  }
  _label(m, v) { return m.label || (v ? String(v).charAt(0).toUpperCase() + String(v).slice(1) : ""); }

  /* Chip für ein select.* mit Auswahlmenü */
  _selChip(id, styles = {}, label = "", iconOnly = false) {
    const st = this._st(id);
    if (!st) return "";
    const v = st.state, m = this._styleFor(styles, v);
    const txt = ["unavailable", "unknown"].includes(v) ? "–" : this._label(m, v);
    const sym = m.glyph ? `<span class="glyph">${esc(m.glyph)}</span>` : icon(m.icon || "mdi:form-dropdown");
    if (iconOnly) return `<button class="chip sel ico" style="--cc:${esc(m.color || "var(--text)")}" data-act="menu" data-entity="${esc(id)}" title="${esc(label ? label + ": " : "")}${esc(txt)}" aria-label="${esc(label ? label + ": " : "")}${esc(txt)}">${sym}</button>`;
    return `<button class="chip sel" style="--cc:${esc(m.color || "var(--text)")}" data-act="menu" data-entity="${esc(id)}">
      ${icon(m.icon || "mdi:form-dropdown")}${label ? `<span class="chl">${esc(label)}</span>` : ""}${esc(txt)}${icon("mdi:chevron-down", "chv")}</button>`;
  }

  _openMenu(anchor) {
    const id = anchor.dataset.entity, st = this._st(id);
    this._closeMenu();
    if (!st) return;
    const styles = id === this._config.car.mode ? this._config.car.mode_styles : id === this._config.car.always ? this._config.car.always_styles : {};
    const wrap = this.shadowRoot.querySelector(".wrap");
    const menu = document.createElement("div");
    menu.className = "menu";
    menu.innerHTML = (st.attributes.options || []).map((o) => {
      const m = this._styleFor(styles, o);
      return `<button class="mg-menu-item mi ${o === st.state ? "cur" : ""}" style="--cc:${esc(m.color || "var(--text)")}" data-act="pick" data-entity="${esc(id)}" data-opt="${esc(o)}">
        ${m.glyph ? `<span class="glyph">${esc(m.glyph)}</span>` : icon(m.icon || "mdi:circle-small")}<span>${esc(this._label(m, o))}</span>${o === st.state ? icon("mdi:check", "ck") : ""}</button>`;
    }).join("");
    this._openMenuAt(anchor, menu);
  }

  _openMenuAt(anchor, menu) {
    this._closeMenu();
    // An body anhängen damit kein overflow:hidden abschneidet
    // Styles inline setzen da das Element außerhalb des Shadow-DOM ist
    document.body.appendChild(menu);
    if (!document.getElementById("mg-menu-styles")) {
      const st = document.createElement("style");
      st.id = "mg-menu-styles";
      st.textContent = `.mg-menu-item{display:flex;align-items:center;gap:10px;padding:9px 12px;border-radius:12px;cursor:pointer;font-size:14px;font-weight:500;color:#94a3b8;background:none;border:0;width:100%;text-align:left;white-space:nowrap}.mg-menu-item:hover{background:rgba(255,255,255,.06);color:#e2e8f0}.mg-menu-item.cur{background:rgba(255,255,255,.08);color:#e2e8f0}.mg-menu-item ha-icon{--mdc-icon-size:17px}.mg-menu-item .glyph{font-size:15px}.mg-menu-item .ck{margin-left:auto;--mdc-icon-size:16px;color:#34d399}`;
      document.head.appendChild(st);
    }
    Object.assign(menu.style, {
      position: "fixed", zIndex: "99999",
      background: "#1c2029", border: "1px solid rgba(255,255,255,.1)",
      borderRadius: "16px", padding: "6px",
      boxShadow: "0 16px 40px rgba(0,0,0,.55)",
      display: "flex", flexDirection: "column", gap: "2px",
      fontFamily: "inherit", fontSize: "14px", color: "#e2e8f0"
    });
    const ar = anchor.getBoundingClientRect();
    const mw = Math.max(ar.width, 160);
    menu.style.minWidth = mw + "px";
    // Horizontal: links am Anker, aber nicht über Bildschirmrand
    let left = ar.left;
    if (left + mw > window.innerWidth - 8) left = window.innerWidth - mw - 8;
    menu.style.left = Math.max(8, left) + "px";
    // Vertikal: unterhalb wenn Platz, sonst oberhalb
    const spaceBelow = window.innerHeight - ar.bottom - 6;
    const spaceAbove = ar.top - 6;
    const mh = Math.min(menu.scrollHeight, Math.max(spaceBelow, spaceAbove, 120));
    menu.style.maxHeight = mh + "px";
    menu.style.overflowY = "auto";
    // Immer nach unten öffnen, außer unten zu wenig Platz
    const below = spaceBelow >= Math.min(mh, 120) || spaceBelow >= spaceAbove;
    menu.style.top = (below ? ar.bottom + 4 : ar.top - mh - 4) + "px";
    // Aktuellen Wert in Sicht scrollen
    const cur = menu.querySelector(".cur");
    if (cur) setTimeout(() => cur.scrollIntoView({ block: "nearest" }), 0);
    menu.anchorEl = anchor; this._menu = menu;
    this._menuClose = (e) => { if (!e.composedPath().includes(menu) && !e.composedPath().includes(anchor)) this._closeMenu(); };
    setTimeout(() => window.addEventListener("click", this._menuClose), 0);
  }

  _closeMenu() {
    if (this._menuClose) window.removeEventListener("click", this._menuClose);
    this._menu?.remove(); this._menu = null; this._menuClose = null;
  }

  /* ---------- Klicks ---------- */
  _click(e) {
    const el = e.composedPath().find((n) => n.dataset && n.dataset.act);
    if (!el) return;
    e.stopPropagation();
    const { act, entity } = el.dataset, h = this._hass;
    if (act === "tab") { this._tab = Number(el.dataset.tab); this._update(); return; }
    if (this._held && (this._held === el || this._held.contains?.(el))) { this._held = null; return; }   // war langes Drücken
    if (act.startsWith("qa")) { e.stopPropagation(); this._qaAction(act, el); return; }
    if (["atog", "arun", "aplay", "asvc"].includes(act) || act.startsWith("ae")) {
      this._actAction(act, el); return;
    }
    if (act === "menu") { this._openMenu(el); return; }
    if (act === "cardetail" && this._config.car.navigate && !this._carPage) {
      const n = this._config.car.navigate;
      const url = n.startsWith("/") ? n : `/${location.pathname.split("/").filter(Boolean)[0] || "lovelace"}/${n}`;
      history.pushState(null, "", url);
      window.dispatchEvent(new CustomEvent("location-changed", { detail: { replace: false } }));
      return;
    }
    if (act === "charges") { this._openCharges(); return; }
    if (act === "mset") {
      this._closeMenu();
      const id = el.dataset.entity;
      if (this._st(id)?.state !== el.dataset.opt) this._hass.callService(id.split(".")[0], "select_option", { entity_id: id, option: el.dataset.opt });
      return;
    }
    if (act === "mnum") { this._mnum(el); return; }
    if (act === "malways") {
      this._closeMenu();
      const c = this._config.car;
      if (this._st(c.mode)?.state !== el.dataset.mode) this._hass.callService(c.mode.split(".")[0], "select_option", { entity_id: c.mode, option: el.dataset.mode });
      if (this._st(c.always)?.state !== el.dataset.opt) this._hass.callService(c.always.split(".")[0], "select_option", { entity_id: c.always, option: el.dataset.opt });
      // manual_mode von Auto weg
      if (c.manual_mode && this._st(c.manual_mode) && /^auto/i.test(this._st(c.manual_mode).state)) {
        const opts = this._st(c.manual_mode).attributes.options || [];
        const t = opts.find((o) => /^pv$|^min/i.test(o)) || opts.find((o) => !/^auto/i.test(o));
        if (t) this._hass.callService(c.manual_mode.split(".")[0], "select_option", { entity_id: c.manual_mode, option: t });
      }
      return;
    }
    if (act === "limmenu") { this._openLimMenu(el); return; }
    if (act === "limset") {
      this._closeMenu();
      const id = el.dataset.entity, v = el.dataset.v, dom = id.split(".")[0];
      console.info("mg-car: Ladeziel →", id, JSON.stringify(v), dom);
      if (dom === "select" || dom === "input_select") this._hass.callService(dom, "select_option", { entity_id: id, option: String(v) });
      else this._hass.callService(dom, "set_value", { entity_id: id, value: Number(v) });
      return;
    }
    if (act === "vorgabemenu") {
      this._closeMenu();
      const c = this._config.car, st = this._st(c.manual_mode);
      if (!st) return;
      const MSTY = { "automatisch|auto": { label: "Auto", icon: "mdi:robot-outline", color: "#38bdf8" }, "aus|off": { label: "Aus", icon: "mdi:power-off", color: "#8b91a1" },
        "pv": { label: "PV", icon: "mdi:solar-power", color: "#34d399" }, "min + pv|min+pv|minpv": { label: "Min+PV", icon: "mdi:transmission-tower", color: "#f7b733" },
        "schnell|now|fast": { label: "Schnell", icon: "mdi:lightning-bolt", color: "#fb923c" } };
      const wrap = this.shadowRoot.querySelector(".wrap") || this.shadowRoot.querySelector(".carpage");
      const menu = document.createElement("div"); menu.className = "menu";
      menu.innerHTML = (st.attributes.options || []).map((o) => {
        const m = this._styleFor(MSTY, o), cur = o === st.state;
        return `<button class="mg-menu-item mi ${cur ? "cur" : ""}" style="--cc:${m.color || "var(--text)"}" data-act="mset" data-entity="${esc(c.manual_mode)}" data-opt="${esc(o)}">
          ${icon(m.icon || "mdi:circle-small")}<span>${esc(this._label(m, o))}</span>${cur ? icon("mdi:check", "ck") : ""}</button>`;
      }).join("");
      this._openMenuAt(el, menu);
      return;
    }
    if (act === "msetmode") {
      const c = this._config.car, id = el.dataset.entity;
      if (this._st(id)?.state !== el.dataset.opt) this._hass.callService(id.split(".")[0], "select_option", { entity_id: id, option: el.dataset.opt });
      // manual_mode von Auto wegnehmen, damit der Modus nicht überschrieben wird
      if (c.manual_mode && this._st(c.manual_mode)) {
        const opts = this._st(c.manual_mode).attributes.options || [], cur = this._st(c.manual_mode).state;
        if (/^auto/i.test(cur)) {
          // Passendes Pendant suchen (aus→aus, smart→pv, schnell→schnell)
          const map = {"off":"aus","pv":"pv","now":"schnell"};
          const target = opts.find((o) => o.toLowerCase() === (map[el.dataset.opt] || el.dataset.opt).toLowerCase()) || opts.find((o) => !/^auto/i.test(o));
          if (target) this._hass.callService(c.manual_mode.split(".")[0], "select_option", { entity_id: c.manual_mode, option: target });
        }
      }
      return;
    }
    if (act === "smartmenu") {
      this._closeMenu();
      const c = this._config.car, ast = this._st(c.always), mst = this._st(c.mode);
      if (!ast || !mst) return;
      const mode = el.dataset.mode, wrap = this.shadowRoot.querySelector(".wrap") || this.shadowRoot.querySelector(".carpage");
      const menu = document.createElement("div"); menu.className = "menu";
      menu.innerHTML = (ast.attributes.options || []).map((ao) => {
        const am = this._styleFor(c.always_styles || {}, ao);
        const mLabel = this._styleFor(c.mode_styles || {}, mode);
        const cur = mst.state === mode && ast.state === ao;
        return `<button class="mg-menu-item mi ${cur ? "cur" : ""}" style="--cc:${am.color || "var(--cyan)"}" data-act="malways" data-mode="${esc(mode)}" data-opt="${esc(ao)}">
          ${am.glyph ? `<span class="glyph">${esc(am.glyph)}</span>` : icon(am.icon || "mdi:circle-small")}<span>${esc(this._label(mLabel, mode))} · ${esc(this._label(am, ao))}</span>${cur ? icon("mdi:check", "ck") : ""}</button>`;
      }).join("");
      this._openMenuAt(el, menu);
      return;
    }
    if (act === "mbal") {
      // Optimistisches Update: sofort in UI anzeigen, dann Service aufrufen
      const enable = el.dataset.v === "1";
      this._balOptimistic = enable;
      this._render_mgmt();
      console.info("mg-car: Vollladung →", enable, "entry:", this._evaEntryId());
      this._evaCall("set_weekly_full_charge_enabled", { enabled: enable });
      // Nach 5 s wieder auf echten Sensorwert vertrauen (Integration hat dann reloaded)
      clearTimeout(this._balTimer);
      this._balTimer = setTimeout(() => { this._balOptimistic = null; this._render_mgmt(); }, 5000);
      return;
    }
    if (act === "mpause") { this._evaCall("set_evcc_mode_control_pause", { paused: el.dataset.v === "1" }); return; }
    if (act === "mplanclear") { if (window.confirm("Ladeplan löschen?")) this._evaCall("clear_evcc_charge_plan", {}); return; }
    if (act === "mplansoc") { this._planSoc = Math.max(10, Math.min(100, (this._planSoc ?? 80) + Number(el.dataset.d))); this._planTime = this.shadowRoot.querySelector("#mgmt .pin")?.value; this._render_mgmt(); return; }
    if (act === "mplanset") {
      const v = this.shadowRoot.querySelector("#mgmt .pin")?.value, t = v ? new Date(v).getTime() : NaN;
      if (isNaN(t) || t < Date.now() + 10 * 60000) { window.alert("Bitte eine Zielzeit in der Zukunft wählen."); return; }
      this._evaCall("set_evcc_charge_plan", { target_soc: this._planSoc ?? 80, target_time: Math.round(t / 1000) });
      this._planTime = null; return;
    }
    if (act === "none") return;
    if (act === "chfilter") { this._chFilter = el.dataset.v; this._renderCharges(); this.shadowRoot.querySelector("#cardlg .dbody")?.scrollTo(0, 0); return; }
    if (act === "hrange") {
      this._hh = Number(el.dataset.h);
      try { localStorage.setItem("mg-car-hist-hours", String(this._hh)); } catch (x) {}
      this._carHist = null; this._update(true); this._loadCarHist(); return;
    }
    if (act === "cardetail" && this._carPage) {
      const ev = new Event("hass-more-info", { bubbles: true, composed: true }); ev.detail = { entityId: this._config.car.soc }; this.dispatchEvent(ev); return;
    }
    if (act === "cardetail") {
      const d = this.shadowRoot.getElementById("cardlg");
      d.dataset.mode = "car";
      d.innerHTML = this._carDetail();
      if (!d._bound) { d._bound = true; d.addEventListener("click", (ev) => { if (ev.target === d) d.close(); }); }
      try { d.showModal(); } catch (x) { d.setAttribute("open", ""); }
      return;
    }
    if (act === "cardclose") { this.shadowRoot.getElementById("cardlg")?.close(); return; }
    if (act === "pick") {
      h.callService("select", "select_option", { entity_id: entity, option: el.dataset.opt });
      this._closeMenu(); return;
    }
    if (act === "eview") { this._eview = el.dataset.v; this._renderEnergy(); return; }
    if (act === "nav") {
      const nav = el.dataset.nav;
      if (/^https?:\/\//i.test(nav)) { window.open(nav, "_blank", "noopener"); return; }   // externe Adresse
      const url = nav.startsWith("#") ? location.pathname + location.search + nav : nav;   // "#fenster" = Popup auf derselben Seite
      history.pushState(null, "", url);
      window.dispatchEvent(new CustomEvent("location-changed", { detail: { replace: false } }));
      if (nav.startsWith("#")) window.dispatchEvent(new HashChangeEvent("hashchange"));
      return;
    }
    if (act === "dom") {   // entspricht tap_action: fire-dom-event (z. B. browser_mod.popup)
      const q = this._qaItems?.[Number(el.dataset.qa)]?.q;
      if (!q?.dom_event) return;
      this.dispatchEvent(new CustomEvent("ll-custom", { bubbles: true, composed: true, detail: q.dom_event }));
      return;
    }
    if (!entity) return;
    if (el.dataset.confirm && !window.confirm(`${el.dataset.confirm} wirklich schalten?`)) return;
    if (act === "more") {
      const ev = new Event("hass-more-info", { bubbles: true, composed: true });
      ev.detail = { entityId: entity }; this.dispatchEvent(ev);
    } else if (act === "toggle") {
      h.callService("homeassistant", "toggle", { entity_id: entity });
    } else if (act === "run") {
      const dom = entity.split(".")[0];
      h.callService(dom, "turn_on", { entity_id: entity });
    }
  }
}


/* ---------------- Energiefluss-Grafik (P = Präfix: "p-" Leistung, "e-" Energie heute) ---------------- */
const node = (P, key, cx, cy, r, ic) => `
  <g class="node ${key}" id="${P}n-${key}" data-act="more" data-entity="">
    <circle class="core" cx="${cx}" cy="${cy}" r="${r}"/>
    ${key === "solar" || key === "home" ? `<circle class="glow" cx="${cx}" cy="${cy}" r="${r}" fill="url(#${P}g-${key})"/>` : ""}
    <circle class="ring" cx="${cx}" cy="${cy}" r="${r}"/>
    <foreignObject x="${cx - 10}" y="${cy - r * (P === "e-" && key !== "home" ? 0.8 : 0.62)}" width="20" height="20"><div class="ni">${icon(ic)}</div></foreignObject>
    ${P === "e-" && key !== "home"
      ? `<text class="nv sm" x="${cx}" y="${cy + 8}"><tspan id="${P}v-${key}">0</tspan><tspan class="nu" id="${P}u-${key}" x="${cx}" dy="15">kWh</tspan></text>`
      : `<text class="nv ${key === "home" ? "big" : ""}" x="${cx}" y="${cy + (key === "home" ? 12 : 10)}"><tspan id="${P}v-${key}">0</tspan><tspan class="nu" id="${P}u-${key}" dx="2">W</tspan></text>`}
    ${key === "home" ? `<text class="nl" x="${cx}" y="${cy + 32}">HAUS</text>` : ""}
  </g>`;

const flowSvg = (P) => `
<svg class="flow" viewBox="0 0 440 404" role="img" aria-label="Energiefluss">
  <defs>
    <radialGradient id="${P}g-home" cx="50%" cy="50%" r="50%"><stop offset="0%" class="st-home" stop-opacity=".22"/><stop offset="100%" class="st-home" stop-opacity="0"/></radialGradient>
    <radialGradient id="${P}g-solar" cx="50%" cy="50%" r="50%"><stop offset="0%" class="st-solar" stop-opacity=".2"/><stop offset="100%" class="st-solar" stop-opacity="0"/></radialGradient>
  </defs>
  <line class="ln solar" id="${P}l-solar" x1="220" y1="98" x2="220" y2="122"/>
  <line class="ln grid" id="${P}l-grid" x1="86" y1="176" x2="164" y2="176"/>
  <line class="ln bat" id="${P}l-bat" x1="276" y1="176" x2="352" y2="176"/>
  <line class="ln car" id="${P}l-car" x1="220" y1="232" x2="220" y2="262"/>
  ${node(P, "solar", 220, 58, 38, "mdi:white-balance-sunny")}
  ${node(P, "home", 220, 176, 54, "mdi:home-outline")}
  ${node(P, "grid", 48, 176, 36, "mdi:transmission-tower")}
  ${node(P, "bat", 390, 176, 36, "mdi:battery-high")}
  ${node(P, "car", 220, 300, 36, "mdi:car-outline")}
  <text class="lab start" x="268" y="54">SOLAR</text>
  <text class="sub start" id="${P}s-solar-1" x="268" y="73"></text>
  <text class="sub start" id="${P}s-solar-2" x="268" y="92"></text>
  <text class="lab" x="48" y="234">NETZ</text>
  <text class="sub" id="${P}s-grid-1" x="48" y="253"></text>
  <text class="sub" id="${P}s-grid-2" x="48" y="272"></text>
  <text class="sub" id="${P}s-grid-3" x="48" y="291"></text>
  <text class="lab" x="390" y="234">SPEICHER</text>
  <text class="sub" id="${P}s-bat-1" x="390" y="253"></text>
  <text class="sub" id="${P}s-bat-2" x="390" y="272"></text>
  <text class="sub" id="${P}s-bat-3" x="390" y="291"></text>
  <text class="lab" x="220" y="358">AUTO</text>
  <text class="sub" id="${P}s-car-1" x="220" y="377"></text>
  <text class="sub" id="${P}s-car-2" x="220" y="396"></text>
</svg>`;

/* ---------------- Styles ---------------- */
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
.menu{position:fixed;z-index:20;min-width:170px;background:#1c2029;border:1px solid rgba(255,255,255,.1);border-radius:16px;padding:6px;box-shadow:0 16px 40px rgba(0,0,0,.55);display:flex;flex-direction:column;gap:2px}
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

if (!customElements.get("mg-home-dashboard")) customElements.define("mg-home-dashboard", MgHomeDashboard);
if (!window.customCards.some((c) => c.type === "mg-home-dashboard"))
  window.customCards.push({ type: "mg-home-dashboard", name: "MG Home Dashboard", description: "Komplettes Home-Dashboard im Glow-Stil" });

class MgCarDashboard extends MgHomeDashboard {
  getCardSize() { return 14; }
  set hass(h) {
    const first = !this._hass;
    this._hass = h;
    if (!this._built) this._build();
    if (first) { this._loadCarHist(); this._loadLastSession(); }
    this._update();
  }
  connectedCallback() {
    if (!this._onResize) {
      this._onResize = () => { cancelAnimationFrame(this._fitRaf); this._fitRaf = requestAnimationFrame(() => this._fit()); };
      this._ro = new ResizeObserver(this._onResize);
    }
    window.addEventListener("resize", this._onResize);
    this._ro.observe(this); this._onResize();
    if (!this._histTimer) this._histTimer = setInterval(() => { this._loadCarHist(); this._loadLastSession(); }, 15 * 60000);
  }
  disconnectedCallback() {
    if (this._onResize) { window.removeEventListener("resize", this._onResize); this._ro.disconnect(); }
    clearInterval(this._histTimer); this._histTimer = null;
  }

  _build() {
    if (!document.querySelector(`link[href="${FONT_URL}"]`)) { const l = document.createElement("link"); l.rel = "stylesheet"; l.href = FONT_URL; document.head.appendChild(l); }
    if (!this.shadowRoot) {
      this.attachShadow({ mode: "open" });
      this.shadowRoot.addEventListener("click", (e) => this._click(e));
    }
    this._carPage = true;
    if (!this._pinBound) { this._pinBound = true; this.shadowRoot.addEventListener("change", (e) => { const t = e.composedPath()[0]; if (t?.classList?.contains("pin")) { this._planTime = t.value; t.blur(); } }); }
    if (!this._hoverBound) {
      this._hoverBound = true;
      this.shadowRoot.addEventListener("pointermove", (e) => this._barHover(e));
      this.shadowRoot.addEventListener("pointerdown", (e) => this._barHover(e));
      this.shadowRoot.addEventListener("pointerleave", () => { const t = this.shadowRoot.querySelector(".gtip"); if (t) t.hidden = true; this.shadowRoot.querySelector(".hl")?.setAttribute("width", 0); }, true);
    }
    this.shadowRoot.innerHTML = `<style>${STYLE}${CAR_STYLE}</style>
      <div class="wrap carpage">
        <div class="grid">
          <div class="col"><section class="panel car" id="car"></section><section class="panel grow" id="trips"></section></div>
          <div class="col"><section class="panel" id="live"></section><section class="panel" id="mgmt"></section></div>
          <div class="col"><section class="panel grow" id="hist"></section></div>
        </div>
      </div><dialog class="dlg" id="cardlg"></dialog>`;
    this._built = true;
    requestAnimationFrame(() => this._fit());
  }

  _update(force = false) {
    if (!this._hass || !this._built) return;
    const c = this._config.car, E = this._eva();
    const ids = [c.soc, c.range, c.status, c.cable, c.limit, c.mode, c.always, c.trips, c.manual_mode, this._config.energy.car_power,
      ...Object.values(c.evcc || {}), ...Object.values(E)].filter(Boolean);
    const sig = ids.map((id) => { const s = this._st(id); return s ? s.state + s.last_updated : "-"; }).join("|") + (this._carHist?.t || "") + Math.floor(Date.now() / 60000);
    if (!force && sig === this._sigCar) return;
    this._sigCar = sig;
    if (this._menu) return;   // Auswahlmenü offen: nicht neu zeichnen
    this._render_car();
    this._render_live();
    this._render_mgmt();
    this._render_trips();
    this._render_hist();
  }

  /* evcc setzt die Sitzungswerte nach dem Laden auf 0 → letzte echte Sitzung aus dem Verlauf holen */
  async _loadLastSession() {
    const ev = this._config.car.evcc || {}, eid = ev.session_energy;
    if (!eid || !this._st(eid) || !this._hass?.callApi) return;
    const ids = [eid, ev.session_solar, ev.session_price, ev.duration].filter((x) => x && this._st(x));
    const start = new Date(Date.now() - (this._config.car.session_days || 30) * 86400000).toISOString();
    try {
      const res = await this._hass.callApi("GET", `history/period/${start}?filter_entity_id=${ids.join(",")}&end_time=${encodeURIComponent(new Date().toISOString())}&minimal_response&no_attributes`);
      const hist = {};
      for (const l of res || []) if (l.length) hist[l[0].entity_id] = l.map((x) => [new Date(x.last_changed || x.last_updated).getTime(), parseFloat(x.state)]).filter((x) => !isNaN(x[1]));
      const en = hist[eid] || [];
      let end = null;
      for (let i = en.length - 1; i >= 0; i--) if (en[i][1] > 0) { end = en[i + 1]?.[0] ?? en[i][0]; break; }   // Zeitpunkt des Zurücksetzens = Sitzungsende
      if (end == null) {   // im Verlauf (Recorder, meist 10 Tage) nichts → Langzeitstatistik (Stundenmaxima) durchsuchen
        const st = await this._statsLastSession(ids);
        this._lastSess = st || { none: true, days: Math.round((Date.now() - new Date(start).getTime()) / 86400000) };
        console.info("mg-car-dashboard: letzte Ladung", this._lastSess);
        return this._update(true);
      }
      const vals = {};
      for (const id of ids) {
        const l = (hist[id] || []).filter((x) => x[0] < end);
        const v = l.length ? l[l.length - 1][1] : null;
        if (v != null) vals[id] = v;
      }
      this._lastSess = { end, vals, src: "history" };
    } catch (e) { this._lastSess = { err: true }; }
    console.info("mg-car-dashboard: letzte Ladung", this._lastSess);
    this._update(true);
  }

  async _statsLastSession(ids) {
    if (!this._hass.callWS) return null;
    const days = this._config.car.session_stats_days || 120;
    try {
      const st = await this._hass.callWS({ type: "recorder/statistics_during_period", start_time: new Date(Date.now() - days * 86400000).toISOString(),
        end_time: new Date().toISOString(), statistic_ids: ids, period: "hour", types: ["max", "mean", "state"] });
      const ts = (v) => (typeof v === "number" ? v : new Date(v).getTime());
      const val = (x) => x.max ?? x.state ?? x.mean;
      const en = st?.[ids[0]] || [];
      let k = -1;
      for (let i = en.length - 1; i >= 0; i--) if (val(en[i]) > 0) { k = i; break; }
      if (k < 0) return null;
      const end = ts(en[k].end ?? en[k].start + 3600000), hour = ts(en[k].start), vals = {};
      for (const id of ids) {
        const row = (st?.[id] || []).filter((x) => ts(x.start) <= hour && val(x) != null).pop();
        if (row) vals[id] = val(row);
      }
      return { end, vals, src: "stats" };
    } catch (e) { return null; }
  }

  /* --- Alle Ladungen (ev_assistant: evcc-Ladelogbuch + Fremdladungen) --- */
  _evaEntryId() {
    if (this._config.car.ev_assistant_entry) return this._config.car.ev_assistant_entry;
    if (this._evaEntryCache) return this._evaEntryCache;
    const reg = this._hass?.entities || {}, dev = this._hass?.devices || {};
    for (const id of Object.values(this._eva())) {
      const e = reg[id]; if (!e) continue;
      if (e.config_entry_id) { this._evaEntryCache = e.config_entry_id; return e.config_entry_id; }
      const d = dev[e.device_id]; if (d?.config_entries?.length) { this._evaEntryCache = d.config_entries[0]; return d.config_entries[0]; }
    }
    // Fallback: über alle Entitäten mit platform ev_assistant
    for (const e of Object.values(reg)) {
      if (e.platform === "ev_assistant" && e.config_entry_id) { this._evaEntryCache = e.config_entry_id; return e.config_entry_id; }
    }
    return null;
  }

  async _loadCharges(force) {
    if (!force && this._charges && Date.now() - this._charges.t < 5 * 60000) return;
    const id = this._evaEntryId(), out = { t: Date.now(), list: [], err: null };
    if (!id || !this._hass.callWS) { out.err = "ev_assistant nicht gefunden"; this._charges = out; return this._renderCharges(); }
    const [home, ext] = await Promise.all([
      this._hass.callWS({ type: "ev_assistant/evcc_sessions", config_entry_id: id }).catch((e) => ({ error: e })),
      this._hass.callWS({ type: "ev_assistant/charges", config_entry_id: id }).catch((e) => ({ error: e })),
    ]);
    const veh = (this._config.car.evcc_vehicle || "").toLowerCase();
    for (const x of home?.sessions || []) {
      if (veh && x.vehicle && String(x.vehicle).toLowerCase() !== veh) continue;
      const ts = x.created ? Date.parse(x.created) : null, te = x.finished ? Date.parse(x.finished) : null;
      if (!ts) continue;
      const dur = typeof x.chargeDuration === "number" && x.chargeDuration > 0 ? x.chargeDuration / 1e9 / 60 : te && te > ts ? (te - ts) / 60000 : null;
      out.list.push({ type: "home", ts, te, kwh: x.chargedEnergy ?? null, pv: x.solarPercentage ?? null, cost: x.price ?? null,
        per: x.pricePerKWh ?? null, dur, s0: x.socStart ?? null, s1: x.socEnd ?? null, who: x.vehicle || "" });
    }
    for (const x of ext?.charges || []) {
      const t = (x.start_ts || x.erfasst_ts) ? (x.start_ts || x.erfasst_ts) * 1000 : (x.datum ? Date.parse(x.datum) : null);
      if (!t) continue;
      out.list.push({ type: "ext", ts: t, te: null, kwh: x.kwh ?? null, pv: null, cost: x.kosten ?? null, per: x.preis_kwh ?? null,
        dur: x.dauer_min ?? null, s0: x.soc_start ?? null, s1: x.soc_end ?? null, who: x.anbieter || "Fremdladung", ac: x.ac_dc || x.typ || "" });
    }
    out.list.sort((a, b) => b.ts - a.ts);
    if (home?.error && ext?.error) out.err = "Abruf bei ev_assistant fehlgeschlagen";
    this._charges = out;
    this._renderCharges();
  }

  _openCharges() {
    const d = this.shadowRoot.getElementById("cardlg");
    this._chOpen = true;
    d.dataset.mode = "charges";
    if (!d._bound) { d._bound = true; d.addEventListener("click", (ev) => { if (ev.target === d) d.close(); }); d.addEventListener("close", () => { this._chOpen = false; }); }
    this._renderCharges();
    try { d.showModal(); } catch (x) { d.setAttribute("open", ""); }
    this._loadCharges();
  }

  _renderCharges() {
    const d = this.shadowRoot.getElementById("cardlg");
    if (!d || !this._chOpen) return;
    const C = this._charges, f = this._chFilter || "all";
    const all = C?.list || [], list = all.filter((x) => f === "all" || x.type === f);
    const sum = (arr, k) => arr.reduce((a, x) => a + (x[k] || 0), 0);
    const kwh = sum(list, "kwh"), cost = sum(list, "cost");
    const pvK = list.reduce((a, x) => a + (x.pv != null && x.kwh ? x.kwh * x.pv / 100 : 0), 0), pvBase = list.reduce((a, x) => a + (x.pv != null && x.kwh ? x.kwh : 0), 0);
    const nH = all.filter((x) => x.type === "home").length, nE = all.filter((x) => x.type === "ext").length;
    const seg = [["all", `Alle ${all.length}`], ["home", `Zuhause ${nH}`], ["ext", `Fremd ${nE}`]]
      .map(([k, l]) => `<button class="hseg ${f === k ? "sel" : ""}" data-act="chfilter" data-v="${k}">${l}</button>`).join("");
    let lastM = "";
    const rows = list.map((x) => {
      const dt = new Date(x.ts), m = `${MON_LONG[dt.getMonth()]} ${dt.getFullYear()}`;
      const mh = m !== lastM ? `<div class="chm">${m}</div>` : ""; lastM = m;
      const dur = x.dur == null ? "" : x.dur >= 60 ? `${Math.floor(x.dur / 60)}:${pad(Math.round(x.dur % 60))} h` : `${Math.round(x.dur)} min`;
      const per = x.per != null ? x.per : x.cost != null && x.kwh > 0.05 ? x.cost / x.kwh : null;
      const pv = x.pv != null ? Math.max(0, Math.min(100, x.pv)) : null;
      return `${mh}<div class="chr ${x.type}">
        <span class="chi">${icon(x.type === "home" ? "mdi:home-lightning-bolt" : "mdi:ev-station")}</span>
        <span class="chd"><b>${WD[dt.getDay()]} ${dt.getDate()}. ${MON[dt.getMonth()]}</b><small>${pad(dt.getHours())}:${pad(dt.getMinutes())} Uhr${dur ? ` · ${dur}` : ""}${x.type === "ext" ? ` · ${esc(x.who)}` : ""}</small></span>
        <span class="chpv">${pv != null ? `<i class="pvbar"><i style="width:${pv}%"></i></i><small>${Math.round(pv)} % PV</small>` : x.s0 != null && x.s1 != null ? `<small>${Math.round(x.s0)} → ${Math.round(x.s1)} %</small>` : ""}</span>
        <span class="chk"><b>${x.kwh == null ? "–" : de(x.kwh, 1)}</b><small>kWh</small></span>
        <span class="chc"><b>${x.cost == null ? "–" : de(x.cost, 2) + " €"}</b><small>${per != null ? `${de(per * 100, 1)} ct/kWh` : ""}</small></span>
      </div>`;
    }).join("");
    const body = !C ? `<div class="empty">Lädt …</div>` : C.err && !all.length ? `<div class="empty">${esc(C.err)}</div>`
      : !list.length ? `<div class="empty">Keine Ladungen</div>` : `<div class="chlist">${rows}</div>`;
    const sc = d.querySelector(".dbody")?.scrollTop || 0;
    d.innerHTML = `<div class="dpan chpan">
      <div class="dhd"><span class="dico">${icon("mdi:ev-station")}</span>
        <span class="rtx"><span class="rname">Alle Ladungen</span><span class="rsub">evcc-Ladelogbuch und Fremdladungen aus ev_assistant</span></span>
        <button class="dx" data-act="cardclose" aria-label="Schließen">${icon("mdi:close")}</button></div>
      <div class="chsum">
        <div><span>Ladungen</span><b>${list.length}</b></div>
        <div><span>Energie</span><b>${de(kwh, kwh >= 100 ? 0 : 1)}<small>kWh</small></b></div>
        <div><span>Kosten</span><b>${de(cost, 2)}<small>€</small></b></div>
        <div><span>Ø Preis</span><b>${kwh > 0.1 && cost ? de(cost / kwh * 100, 1) : "–"}<small>ct/kWh</small></b></div>
        <div class="pv"><span>PV-Anteil</span><b>${pvBase > 0.1 ? Math.round(pvK / pvBase * 100) : "–"}<small>%</small></b></div>
        <div class="hsegs">${seg}</div>
      </div>
      <div class="dbody">${body}</div></div>`;
    const b = d.querySelector(".dbody"); if (b) b.scrollTop = sc;
  }

  /* --- Lademanagement: Vorgabe, evcc-Modus (inkl. Immer laden), Ladestrom, Mindestladung, Ladeplan + Vollladung (ev_assistant) --- */
  _render_mgmt() {
    const el = this.shadowRoot.getElementById("mgmt"); if (!el) return;
    if (this.shadowRoot.activeElement?.classList?.contains("pin")) return;   // während der Eingabe nicht neu zeichnen
    const c = this._config.car, ev = c.evcc || {}, E = this._eva();
    const segs = (id, styles) => {
      const st = this._st(id); if (!st) return "";
      return `<div class="mseg">${(st.attributes.options || []).map((o) => {
        const m = this._styleFor(styles || {}, o), sel = o === st.state;
        return `<button class="msb ${sel ? "sel" : ""}" style="--cc:${m.color || "var(--gold)"}" data-act="mset" data-entity="${esc(id)}" data-opt="${esc(o)}">${m.icon ? icon(m.icon) : ""}<span>${esc(this._label(m, o))}</span></button>`;
      }).join("")}</div>`;
    };
    const step = (lbl, ic, id, unit) => {
      const st = this._st(id); if (!st) return "";
      const a = st.attributes, pend = this._pendingNum?.[id], v = pend != null ? pend : parseFloat(st.state), u = unit ?? a.unit_of_measurement ?? "";
      return `<div class="mstep"><span class="msl">${icon(ic)}${lbl}</span>
        <div class="tgt"><button class="tb" data-act="mnum" data-entity="${esc(id)}" data-d="-1" aria-label="weniger">−</button>
        <span class="tv">${isNaN(v) ? "–" : de(v, (a.step || 1) < 1 ? 1 : 0)}<small> ${esc(u)}</small></span>
        <button class="tb" data-act="mnum" data-entity="${esc(id)}" data-d="1" aria-label="mehr">+</button></div></div>`;
    };
    const sw = (on, act, lbl, sub, ic, dis) => `<button class="mtog ${on ? "on" : ""} ${dis ? "dis" : ""}" data-act="${act}" data-v="${on ? "0" : "1"}">${icon(ic)}<span><b>${lbl}</b>${sub ? `<small>${sub}</small>` : ""}</span><i class="msw"><i></i></i></button>`;

    // Vorgabe (eigener Helfer)
    const manual = this._st(c.manual_mode), auto = manual && /^auto/i.test(manual.state);
    const MSTY = { "automatisch|auto": { label: "Auto", icon: "mdi:robot-outline", color: "#38bdf8" }, "aus|off": { label: "Aus", icon: "mdi:power-off", color: "#8b91a1" },
      "pv": { label: "PV", icon: "mdi:solar-power", color: "#34d399" }, "min + pv|min+pv|minpv": { label: "Min+PV", icon: "mdi:transmission-tower", color: "#f7b733" },
      "schnell|now|fast": { label: "Schnell", icon: "mdi:lightning-bolt", color: "#fb923c" } };

    // evcc-Modus als Kacheln, „Immer laden“ als Auswahl in der Smart-Kachel
    const mst = this._st(c.mode), ast = this._st(c.always);
    // Modus-Zeile: [Vorgabe ▼] [Aus] [Smart ▼] [Schnell]
    const modeTiles = (() => {
      if (!mst) return "";
      const opts = mst.attributes.options || [], curM = mst.state;
      const tiles = [];
      // Vorgabe-Dropdown (manual_mode) – zeigt aktuellen Wert, rot wenn nicht Auto
      if (manual) {
        const curV = manual.state, isAuto = /^auto/i.test(curV);
        const vm = this._styleFor(MSTY, curV);
        tiles.push(`<button class="mmode vorgabe ${isAuto ? "" : "manual"}" style="--cc:${isAuto ? "#38bdf8" : "#ef4444"}" data-act="vorgabemenu">
          <span class="mmh">${icon(vm.icon || "mdi:cog")}<b>${esc(this._label(vm, curV))}</b>${icon("mdi:chevron-down", "mchv")}</span></button>`);
      }
      // evcc-Modi: immer nach aktuellem evcc-State hervorgehoben
      for (const o of opts) {
        const m = this._styleFor(c.mode_styles || {}, o), sel = o === curM, smart = this._matches(o, c.always_when);
        if (smart && ast) {
          const am = this._styleFor(c.always_styles || {}, ast.state);
          const alwaysOff = /^aus$|^off$/i.test(ast.state);
          const smartIco = sel && !alwaysOff ? (am.glyph ? `<span class="glyph">${esc(am.glyph)}</span>` : icon(am.icon || m.icon || "mdi:ev-station")) : icon(m.icon || "mdi:ev-station");
          tiles.push(`<button class="mmode ${sel ? "sel" : ""}" style="--cc:${m.color || "var(--gold)"}" data-act="smartmenu" data-mode="${esc(o)}">
            <span class="mmh">${smartIco}<b>${esc(this._label(m, o))}</b>${sel ? icon("mdi:chevron-down", "mchv") : ""}</span></button>`);
        } else {
          tiles.push(`<button class="mmode ${sel ? "sel" : ""}" style="--cc:${m.color || "var(--gold)"}" data-act="msetmode" data-entity="${esc(c.mode)}" data-opt="${esc(o)}">
            <span class="mmh">${icon(m.icon || "mdi:ev-station")}<b>${esc(this._label(m, o))}</b></span></button>`);
        }
      }
      return `<div class="mmodes">${tiles.join("")}</div>`;
    })();

    // ev_assistant: Ladeplan, Vollladung, Pause
    const plan = this._st(E.evcc_charge_plan), pa = plan?.attributes || {}, mc = this._st(E.evcc_mode_control), ma = mc?.attributes || {};
    const planD = plan && !OFFLINE_HD.includes(plan.state) ? new Date(plan.state) : null, hasPlan = planD && !isNaN(planD);
    const fmtD = (d) => `${WD[d.getDay()]} ${d.getDate()}. ${MON[d.getMonth()]}, ${pad(d.getHours())}:${pad(d.getMinutes())}`;
    const entry = this._evaEntryId();
    let planHtml = "";
    if (entry || plan) {
      if (hasPlan) {
        const ps = pa.projected_start ? new Date(pa.projected_start) : null, pe = pa.projected_end ? new Date(pa.projected_end) : null;
        planHtml = `<div class="mplan act">
          <div class="mph">${icon("mdi:calendar-clock")}<span><b>${pa.target_soc != null ? `${Math.round(pa.target_soc)} %` : "Ladeplan"} bis ${fmtD(planD)}</b>
            ${ps && !isNaN(ps) ? `<small>Laden voraussichtlich ${pad(ps.getHours())}:${pad(ps.getMinutes())}${pe && !isNaN(pe) ? `–${pad(pe.getHours())}:${pad(pe.getMinutes())}` : ""} Uhr</small>` : ""}</span>
            <button class="qbtn ghost" data-act="mplanclear">${icon("mdi:delete-outline")}Löschen</button></div>
          ${pa.erwartung ? `<div class="mpe">${icon("mdi:information-outline")}${esc(pa.erwartung)}</div>` : ""}</div>`;
      } else {
        const def = new Date(); def.setDate(def.getDate() + 1); def.setHours(7, 0, 0, 0);
        const val = this._planTime || `${def.getFullYear()}-${pad(def.getMonth() + 1)}-${pad(def.getDate())}T07:00`;
        const soc = this._planSoc ?? 80;
        planHtml = `<div class="mplan">
          <div class="mph">${icon("mdi:calendar-plus")}<span><b>Ladeplan anlegen</b><small>evcc lädt bis zur Zielzeit auf den Ziel-Ladestand – PV-/tarifoptimiert</small></span></div>
          <div class="mpf">
            <label>Ziel<div class="tgt"><button class="tb" data-act="mplansoc" data-d="-5">−</button><span class="tv">${soc}<small> %</small></span><button class="tb" data-act="mplansoc" data-d="5">+</button></div></label>
            <label>bis<input class="pin" type="datetime-local" value="${esc(val)}" data-act="none"></label>
            <button class="qbtn" data-act="mplanset"${entry ? "" : " disabled"}>${icon("mdi:check")}Plan setzen</button>
          </div></div>`;
      }
    }
    const nextFull = ma.naechste_vollladung_faellig_ts ? new Date(ma.naechste_vollladung_faellig_ts * (ma.naechste_vollladung_faellig_ts < 1e12 ? 1000 : 1)) : null;
    const balSub = ma.balancing_aktiv ? "lädt gerade auf 100 %" : ma.balancing_faellig ? "fällig – lädt beim nächsten Anstecken auf 100 %" : nextFull && !isNaN(nextFull) ? `nächste ${fmtD(nextFull)}` : "einmal pro Woche auf 100 % fürs Zellbalancing";
    const toggles = entry ? [
      ma.aktiv ? sw(!!ma.pausiert, "mpause", "Automatik pausieren", ma.pausiert ? "ev_assistant schreibt nichts nach evcc" : `Steuerung aktiv${mc?.state ? ` · ${mc.state}` : ""}`, "mdi:pause-circle-outline") : "",
    ].join("") : "";

    const rec = this._st(E.charge_before_pv_recommended);
    el.innerHTML = this._hd("Lademanagement", manual ? (auto ? `<span class="mauto">${icon("mdi:robot-outline")}Automatik</span>` : `<span class="mman">${icon("mdi:hand-back-right-outline")}Manuell</span>`) : "") + `
      ${modeTiles ? `<div class="mgrp"><span class="mgl">${manual ? "Lademodus" : "evcc-Modus"}</span>${modeTiles}</div>` : ""}
      <div class="msteps">${step("Ladestrom", "mdi:speedometer", c.limit)}</div>
      ${this._renderLimitRow(c, ev, E, ma)}
      ${planHtml || toggles ? `<div class="mgrp"><span class="mgl">ev_assistant</span>${planHtml}${toggles}</div>` : ""}
      ${rec?.state === "on" ? `<div class="lrows"><button class="lrow warn" data-act="more" data-entity="${esc(E.charge_before_pv_recommended)}">${icon("mdi:weather-cloudy-alert")}<span>Empfehlung</span><b>Laden vor PV sinnvoll</b></button></div>` : ""}`;
  }

  _renderLimitRow(c, ev, E, ma) {
    const entry = this._evaEntryId();
    // Ladeziel als Dropdown
    let limBtn = "";
    if (ev.limit_soc) {
      const limSt = this._st(ev.limit_soc);
      if (!limSt) console.warn("mg-car: limit_soc", ev.limit_soc, "nicht in hass.states gefunden");
      const v = limSt?.state;
      limBtn = `<button class="mbtn lim" data-act="limmenu" data-entity="${esc(ev.limit_soc)}">
        ${icon("mdi:battery-check-outline")}<div class="mtx"><b>${v != null && !OFFLINE_HD.includes(v) ? esc(String(v).replace(/ ?%$/, "")) + " %" : "–"}</b><span>Ladeziel</span></div>${icon("mdi:chevron-down", "mchv")}</button>`;
    }
    // Vollladung als Knopf
    const balOptimistic = this._balOptimistic;
    const balOn = balOptimistic != null ? balOptimistic : !!ma.balancing_enabled;
    const balAkt = !!ma.balancing_aktiv, balF = !!ma.balancing_faellig;
    const nextFull = ma.naechste_vollladung_faellig_ts ? new Date(ma.naechste_vollladung_faellig_ts * (ma.naechste_vollladung_faellig_ts < 1e12 ? 1000 : 1)) : null;
    const balSub = balAkt ? "lädt auf 100 %" : balF ? "fällig" : nextFull && !isNaN(nextFull) ? `nächste ${WD[nextFull.getDay()]} ${nextFull.getDate()}.` : "";
    let balBtn = "";
    if (entry) {
      balBtn = `<button class="mbtn bal ${balOn ? "on" : ""} ${balAkt ? "act" : ""}" data-act="mbal" data-v="${balOn ? "0" : "1"}">
        ${icon(balAkt ? "mdi:battery-sync" : "mdi:battery-sync-outline")}<div class="mtx"><b>Vollladung</b><span>${balOn ? (balSub || "aktiv") : "aus"}</span></div></button>`;
    }
    if (!limBtn && !balBtn) return "";
    return `<div class="mbottom">${limBtn}${balBtn}</div>`;
  }

  _openLimMenu(anchor) {
    this._closeMenu();
    const id = anchor.dataset.entity, st = this._st(id);
    console.info("mg-car: limmenu", id, st?.state, st?.attributes?.options?.slice(0,3));
    if (!st) return;
    const a = st.attributes, cur = st.state;
    const opts = a.options || [];
    const wrap = this.shadowRoot.querySelector(".wrap") || this.shadowRoot.querySelector(".carpage");
    const menu = document.createElement("div"); menu.className = "menu limm";
    if (!st) { console.warn("mg-car: Ladeziel-Entity nicht gefunden:", id); this._closeMenu(); return; }
    if (opts.length) {
      menu.innerHTML = opts.map((v) => `<button class="mg-menu-item mi ${String(v) === String(cur) ? "cur" : ""}" data-act="limset" data-entity="${esc(id)}" data-v="${esc(v)}"><span>${esc(v)}</span>${String(v) === String(cur) ? icon("mdi:check", "ck") : ""}</button>`).join("");
    } else {
      const stp = Number(a.step) || 5, mn = Number(a.min) || 20, mx = Number(a.max) || 100;
      let numOpts = []; for (let v = mn; v <= mx; v += stp) numOpts.push(v);
      menu.innerHTML = numOpts.map((v) => `<button class="mg-menu-item mi ${v === parseFloat(cur) ? "cur" : ""}" data-act="limset" data-entity="${esc(id)}" data-v="${v}"><span>${v} %</span>${v === parseFloat(cur) ? icon("mdi:check", "ck") : ""}</button>`).join("");
    }
    this._openMenuAt(anchor, menu);
    const sel = menu.querySelector(".cur"); if (sel) sel.scrollIntoView({ block: "center" });
  }

  _evaCall(service, data) {
    const id = this._evaEntryId();
    if (!id) { console.warn("mg-car: ev_assistant config_entry_id nicht gefunden. Trage car.ev_assistant_entry ein."); return; }
    console.info("mg-car: ev_assistant →", service, { config_entry_id: id, ...data });
    this._hass.callService("ev_assistant", service, { config_entry_id: id, ...data });
  }

  _mnum(el) {
    const id = el.dataset.entity, st = this._st(id); if (!st) return;
    const a = st.attributes, stp = Number(a.step) || 1;
    this._pendingNum = this._pendingNum || {}; this._numT = this._numT || {};
    const cur = this._pendingNum[id] ?? parseFloat(st.state);
    let v = Math.round((cur + Number(el.dataset.d) * stp) / stp) * stp;
    if (a.min != null) v = Math.max(Number(a.min), v); if (a.max != null) v = Math.min(Number(a.max), v);
    this._pendingNum[id] = v;
    clearTimeout(this._numT[id]);
    this._numT[id] = setTimeout(() => {
      this._hass.callService(id.split(".")[0], "set_value", { entity_id: id, value: v });
      setTimeout(() => { delete this._pendingNum[id]; this._render_mgmt(); }, 1500);
    }, 700);
    this._render_mgmt();
  }

  /* --- Laden: live oder letzte Ladung --- */
  _render_live() {
    const c = this._config.car, ev = c.evcc || {}, E = this._eva();
    const { charging, plugged, pw } = this._carState(), p = this._power(pw);
    if (this._wasCharging && !charging) setTimeout(() => this._loadLastSession(), 5000);   // gerade fertig geworden
    this._wasCharging = charging;
    const num = (id) => { const v = parseFloat(this._st(id)?.state); return isNaN(v) ? null : v; };
    const L = !charging && this._lastSess?.vals ? this._lastSess : null;
    const val = (id) => (charging ? num(id) : L?.vals?.[id] ?? null);
    const kwh = val(ev.session_energy), pvp = val(ev.session_solar), cost = val(ev.session_price), dur = val(ev.duration);
    const durU = (this._st(ev.duration)?.attributes?.unit_of_measurement || "min").toLowerCase();
    const durMin = dur == null ? null : durU === "h" ? dur * 60 : durU === "s" ? dur / 60 : dur;
    const durTxt = durMin == null ? "–" : durMin >= 60 ? `${Math.floor(durMin / 60)}:${pad(Math.round(durMin % 60))} h` : `${Math.round(durMin)} min`;
    const cur = this._st(ev.session_price)?.attributes?.unit_of_measurement || "€";

    // Kopf: Status
    const stTxt = charging ? "Lädt" : plugged ? "Bereit" : "Abgesteckt";
    const stCls = charging ? "on" : plugged ? "ready" : "";

    // links: große Zahl + Zeitangabe
    let kicker = "", when = "";
    if (charging) {
      kicker = `Lädt${durMin != null ? ` seit ${durTxt}` : ""}`;
      const fin = this._st(ev.finish), finD = fin && !OFFLINE_HD.includes(fin.state) ? new Date(fin.state) : null, rem = this._fmt(ev.remaining);
      when = `${icon("mdi:flash")}<b>${p.v} ${p.u}</b>${finD && !isNaN(finD) ? ` · fertig ${pad(finD.getHours())}:${pad(finD.getMinutes())} Uhr` : rem ? ` · noch ${rem.v} ${rem.u}` : ""}`;
    } else if (L) {
      const d = new Date(L.end);
      kicker = `Letzte Ladung · ${this._ago(d)}`;
      when = `${icon("mdi:calendar-clock")}${WD_LONG[d.getDay()]}, ${d.getDate()}. ${MON[d.getMonth()]} · ${pad(d.getHours())}:${pad(d.getMinutes())} Uhr`;
    } else kicker = this._lastSess?.none ? "Keine Ladung im gespeicherten Verlauf" : "Letzte Ladung";

    // rechts: PV-Ring
    const pvv = pvp == null ? null : Math.max(0, Math.min(100, pvp));
    const R = 34, C = 2 * Math.PI * R, arc = pvv == null ? 0 : (pvv / 100) * C;
    const ring = `<svg class="lring" viewBox="0 0 84 84"><circle cx="42" cy="42" r="${R}" class="rbg"/>
      <circle cx="42" cy="42" r="${R}" class="rgr" style="stroke-dasharray:${C - arc} ${C};stroke-dashoffset:${-arc}"/>
      <circle cx="42" cy="42" r="${R}" class="rpv" style="stroke-dasharray:${arc} ${C}"/></svg>
      <div class="lringt"><b>${pvv == null ? "–" : Math.round(pvv)}<small>%</small></b><span>PV</span></div>`;

    // Aufteilung PV/Netz in kWh
    const pvK = kwh != null && pvv != null ? kwh * pvv / 100 : null, grK = pvK != null ? kwh - pvK : null;
    const split = pvK != null && kwh > 0.01 ? `<div class="lsplit"><span class="pv" style="flex:${Math.max(pvK, 0.001)}"></span><span class="gr" style="flex:${Math.max(grK, 0.001)}"></span></div>
      <div class="lsplitl"><span class="pv">${icon("mdi:solar-power-variant")}PV <b>${de(pvK, 1)} kWh</b></span><span class="gr">${icon("mdi:transmission-tower")}Netz <b>${de(grK, 1)} kWh</b></span></div>` : "";

    // Kennzahlen
    const per = cost != null && kwh > 0.05 ? cost / kwh : null, avgP = kwh != null && durMin > 1 ? kwh / (durMin / 60) : null;
    const fact = (lbl, v) => `<div class="lfact"><span>${lbl}</span><b>${v}</b></div>`;
    const facts = [
      fact("Dauer", durTxt, ev.duration),
      fact("Kosten", cost == null ? "–" : `${de(cost, 2)} ${esc(cur)}`, ev.session_price),
      fact("Preis", per == null ? "–" : `${de(per * 100, 1)} ct/kWh`),
      fact("Ø Leistung", avgP == null ? "–" : `${de(avgP, 1)} kW`),
    ].join("");

    // Plan, Modus, Hinweise als schmale Zeilen
    const plan = this._st(E.evcc_charge_plan), mode = this._st(E.evcc_mode_control), rec = this._st(E.charge_before_pv_recommended), tot = this._fmt(ev.solar_total, 0);
    const row = (ic, lbl, v, id, cls = "") => `<button class="lrow ${cls}" data-act="more" data-entity="${esc(id)}">${icon(ic)}<span>${lbl}</span><b>${esc(v)}</b></button>`;
    const rows = [
      plan && !OFFLINE_HD.includes(plan.state) ? row("mdi:calendar-clock", "Ladeplan", plan.state, E.evcc_charge_plan) : "",
      mode && !OFFLINE_HD.includes(mode.state) ? row("mdi:robot-outline", "Steuerung", mode.state, E.evcc_mode_control) : "",
      rec?.state === "on" ? row("mdi:weather-cloudy-alert", "Empfehlung", "Laden vor PV sinnvoll", E.charge_before_pv_recommended, "warn") : "",
    ].join("");

    this.shadowRoot.getElementById("live").innerHTML = `
      <div class="hd"><span class="ttl">Laden</span><span class="lst ${stCls}">${icon(charging ? "mdi:lightning-bolt" : plugged ? "mdi:ev-plug-type2" : "mdi:power-plug-off-outline")}${stTxt}</span>
        <button class="arrow" data-act="charges" aria-label="Alle Ladungen" title="Alle Ladungen">${icon("mdi:format-list-bulleted")}</button></div>
      <div class="lclick" data-act="charges" title="Alle Ladungen anzeigen">
      <div class="lhero ${charging ? "chg" : ""}">
        <div class="lhl">
          <span class="lkick">${esc(kicker)}</span>
          <div class="lbig"><b>${kwh == null ? "–" : de(kwh, 1)}</b><small>kWh</small></div>
          ${when ? `<span class="lwhen">${when}</span>` : ""}
        </div>
        <div class="lringw">${ring}</div>
      </div>
      ${split}
      <div class="lfacts">${facts}</div></div>
`;
  }

  /* --- Fahrtenbuch --- */
  _render_trips() {
    const c = this._config.car, st = this._st(c.trips), el = this.shadowRoot.getElementById("trips");
    let trips = st?.attributes?.trips || [];
    if (!Array.isArray(trips)) trips = [];
    const dt = (v) => { const d = new Date(v); return isNaN(d) ? null : d; };
    const place = (x) => ({ home: "Zuhause", zuhause: "Zuhause", Home: "Zuhause", not_home: "unterwegs", "außerhalb": "unterwegs" }[x] || x || "?");
    const list = trips.slice().sort((a, b) => (dt(b.start)?.getTime() || 0) - (dt(a.start)?.getTime() || 0)).slice(0, c.trips_max || 25);
    let lastDay = "";
    const rows = list.map((t) => {
      const s = dt(t.start), day = s ? `${WD[s.getDay()]}, ${s.getDate()}. ${MON[s.getMonth()]}` : "";
      const head = day !== lastDay ? `<div class="tday">${esc(day)}</div>` : ""; lastDay = day;
      const km = parseFloat(t.strecke), kwh = parseFloat(t.verbrauch_kwh), avg = parseFloat(t.avg_verbrauch);
      return `${head}<div class="trip">
        <span class="ttime">${s ? `${pad(s.getHours())}:${pad(s.getMinutes())}` : ""}</span>
        <span class="troute"><b>${esc(place(t.start_ort))}</b>${icon("mdi:arrow-right")}<b>${esc(place(t.ziel_ort))}</b><small>${t.dauer != null ? `${esc(t.dauer)} min` : ""}${t.avg_speed ? ` · Ø ${de(parseFloat(t.avg_speed), 0)} km/h` : ""}</small></span>
        <span class="tkm"><b>${isNaN(km) ? "–" : de(km, 0)}</b><small>km</small></span>
        <span class="tkwh"><b>${isNaN(kwh) ? "–" : de(kwh, 1)}</b><small>kWh${!isNaN(avg) ? ` · ${de(avg, 1)}/100` : ""}</small></span>
      </div>`;
    }).join("");
    const sumKm = list.reduce((a, t) => a + (parseFloat(t.strecke) || 0), 0);
    el.innerHTML = this._hd("Fahrtenbuch", list.length ? `${list.length} Fahrten · ${de(sumKm, 0)} km` : "", c.trips) +
      (rows ? `<div class="tlist">${rows}</div>` : `<div class="empty">Keine Fahrten gefunden${c.trips ? ` (${esc(c.trips)})` : ""}</div>`);
  }

  /* --- Verlauf bis jetzt: SoC + Ladeleistung, Zeitraum wählbar --- */
  _histHours() {
    if (this._hh) return this._hh;
    let v = null; try { v = Number(localStorage.getItem("mg-car-hist-hours")); } catch (e) {}
    return (this._hh = v > 0 ? v : this._config.car.history_hours || 24);
  }
  _rangeLbl(h) { return h < 48 ? `${h} h` : h % 24 === 0 ? `${h / 24} T` : `${h} h`; }

  async _loadCarHist() {
    const c = this._config.car, ev = c.evcc || {}, ids = [c.soc, ev.power || this._config.energy.car_power].filter((x) => x && this._st(x));
    if (!ids.length || !this._hass) return;
    const hrs = this._histHours(), req = (this._histReq = (this._histReq || 0) + 1);
    const t1 = Date.now(), t0 = t1 - hrs * 3600000, data = {}, src = {};
    const ts = (v) => (typeof v === "number" ? v : new Date(v).getTime());
    // 1) Langzeitstatistik (Stundenwerte, bleibt dauerhaft erhalten) – für längere Zeiträume
    if (hrs > 48 && this._hass.callWS) {
      try {
        const st = await this._hass.callWS({ type: "recorder/statistics_during_period", start_time: new Date(t0 - 3600000).toISOString(),
          end_time: new Date(t1).toISOString(), statistic_ids: ids, period: "hour", types: ["mean", "max"] });
        for (const id of ids) {
          const l = (st?.[id] || []).map((x) => [ts(x.start), x.mean ?? x.max]).filter((x) => x[1] != null && !isNaN(x[1]));
          if (l.length) { data[id] = l; src[id] = "Statistik"; }
        }
      } catch (e) { /* Statistik nicht verfügbar → Verlauf */ }
    }
    // 2) Zustandsverlauf (genau, aber nur so lange wie der Recorder speichert, Standard 10 Tage)
    const miss = ids.filter((id) => !data[id]);
    if (miss.length && this._hass.callApi) {
      try {
        const res = await this._hass.callApi("GET", `history/period/${new Date(t0).toISOString()}?filter_entity_id=${miss.join(",")}&end_time=${encodeURIComponent(new Date(t1).toISOString())}&minimal_response&no_attributes`);
        for (const l of res || []) if (l.length) {
          const pts = l.map((x) => [new Date(x.last_changed || x.last_updated).getTime(), parseFloat(x.state)]).filter((x) => !isNaN(x[1]) && !isNaN(x[0]));
          if (pts.length) { data[l[0].entity_id] = pts; src[l[0].entity_id] = "Verlauf"; }
        }
      } catch (e) {}
    }
    let bars = null;
    bars = await this._loadBars(t0, t1, hrs);
    if (req !== this._histReq) return;
    this._carHist = { t: Date.now(), hrs, data, src, ids, bars };
    this._update(true);
  }

  /* Stündlich geladene kWh, aufgeteilt nach Netz und PV/Speicher (aus Langzeitstatistik) */
  async _loadBars(t0, t1, hrs) {
    const c = this._config.car, ev = c.evcc || {}, e = this._config.energy;
    const pid = ev.power || e.car_power, gid = c.split_grid || e.grid_import, hid = c.split_home || e.home;
    if (!this._hass.callWS || !this._st(pid)) return null;
    const ids = [pid, gid, hid, c.soc].filter((x) => x && this._st(x));
    try {
      const st = await this._hass.callWS({ type: "recorder/statistics_during_period", start_time: new Date(t0).toISOString(),
        end_time: new Date(t1).toISOString(), statistic_ids: ids, period: "hour", types: ["mean"] });
      const ts = (v) => (typeof v === "number" ? v : new Date(v).getTime());
      const toKW = (id) => { const u = (this._st(id)?.attributes?.unit_of_measurement || "").toLowerCase(); return u === "kw" ? 1 : u === "mw" ? 1000 : 0.001; };
      const map = (id) => { const m = new Map(); for (const x of st?.[id] || []) if (x.mean != null) m.set(ts(x.start), x.mean); return m; };
      const P = map(pid), G = map(gid), Hm = map(hid), S = map(c.soc);
      const fp = toKW(pid), fg = toKW(gid), fh = toKW(hid);
      let rows = [];
      for (const [t, v] of P) {
        const kwh = Math.max(0, v * fp);
        const home = (Hm.get(t) ?? 0) * fh, grid = Math.max(0, (G.get(t) ?? 0) * fg);
        // Anteil Netz = Netzbezug / Gesamtverbrauch der Stunde (Auto im Hausverbrauch enthalten)
        const share = home > 0.01 ? Math.min(1, grid / Math.max(home, kwh)) : (G.has(t) ? 1 : 0);
        rows.push({ t, kwh, grid: kwh * share, pv: kwh * (1 - share), soc: S.get(t) });
      }
      rows.sort((a, b) => a.t - b.t);
      let unit = "h";
      if (hrs > 168) {   // über 7 Tage: Tagessummen
        const days = new Map();
        for (const r of rows) {
          const d = new Date(r.t); d.setHours(0, 0, 0, 0); const k = d.getTime();
          const x = days.get(k) || { t: k, kwh: 0, grid: 0, pv: 0, soc: null };
          x.kwh += r.kwh; x.grid += r.grid; x.pv += r.pv; if (r.soc != null) x.soc = r.soc;
          days.set(k, x);
        }
        rows = [...days.values()]; unit = "d";
      }
      return { rows, unit, split: !!(gid && this._st(gid) && hid && this._st(hid)) };
    } catch (e) { return null; }
  }

  _barsSvg(H, t0, t1, W, Ht, X, soc, nowS) {
    const B = H.bars, hrs = this._histHours(), step = B.unit === "d" ? 86400000 : 3600000;
    const rows = B.rows.filter((r) => r.t + step > t0);
    const maxK = Math.max(B.unit === "d" ? 5 : 1, ...rows.map((r) => r.kwh));
    const bw = Math.max(1, (step / (t1 - t0)) * W - (step / (t1 - t0) * W > 6 ? 2 : 0.4));
    const Y = (v) => Ht - (v / maxK) * (Ht - 12);
    this._barRows = rows; this._barStep = step; this._barT = [t0, t1];
    const bars = rows.map((r, i) => {
      const x = X(r.t) + (B.unit === "d" ? 1 : 0.2), yp = Y(r.pv), yg = Y(r.pv + r.grid);
      return r.kwh < 0.005 ? "" : `<g class="bar" data-i="${i}">
        <rect x="${x.toFixed(1)}" y="${yp.toFixed(1)}" width="${bw.toFixed(1)}" height="${(Ht - yp).toFixed(1)}" class="bpv"/>
        <rect x="${x.toFixed(1)}" y="${yg.toFixed(1)}" width="${bw.toFixed(1)}" height="${(yp - yg).toFixed(1)}" class="bgr"/></g>`;
    }).join("");
    // Ladestand als Linie darüber
    const S = (v) => (Ht - (v / 100) * (Ht - 10)).toFixed(1);
    const sp0 = soc.concat([[t1, nowS]]);
    let sp = ""; if (sp0.length > 1) { sp = `M${X(sp0[0][0]).toFixed(1)},${S(sp0[0][1])}`; for (const [t, v] of sp0.slice(1)) sp += `L${X(t).toFixed(1)},${S(v)}`; }
    const ticks = [], tstep = hrs <= 24 ? 3 : hrs <= 72 ? 12 : hrs <= 168 ? 24 : 24 * 5;
    const first = new Date(t0); first.setMinutes(0, 0, 0);
    if (tstep >= 24) first.setHours(0); else first.setHours(Math.ceil(first.getHours() / tstep) * tstep);
    for (let t = first.getTime(); t <= t1; t += tstep * 3600000) if (t >= t0) {
      const d = new Date(t);
      ticks.push([X(t) / W * 100, tstep >= 24 ? `${WD[d.getDay()]} ${d.getDate()}.` : tstep >= 12 && d.getHours() === 0 ? WD[d.getDay()] : `${pad(d.getHours())}:00`]);
    }
    const grid = ticks.map(([x]) => `<line x1="${(x / 100) * W}" x2="${(x / 100) * W}" y1="0" y2="${Ht}" class="gl"/>`).join("");
    const sum = rows.reduce((a, r) => ({ k: a.k + r.kwh, g: a.g + r.grid, p: a.p + r.pv }), { k: 0, g: 0, p: 0 });
    return `<div class="chwrap bars">
        <svg class="chist" viewBox="0 0 ${W} ${Ht}" preserveAspectRatio="none">${grid}${bars}
          ${sp ? `<path d="${sp}" class="gs" vector-effect="non-scaling-stroke"/>` : ""}
          <line x1="${W}" x2="${W}" y1="0" y2="${Ht}" class="gnow"/><rect class="hl" x="0" y="0" width="0" height="${Ht}"/></svg>
        <div class="gax">${ticks.filter(([x]) => x < 90).map(([x, l]) => `<span class="${x < 4 ? "st" : ""}" style="left:${x}%">${l}</span>`).join("")}<span class="now" style="left:100%">jetzt</span></div>
        <div class="gtip" hidden></div>
        <span class="gmax">${de(maxK, 1)} kWh${B.unit === "d" ? "/Tag" : "/h"}</span></div>
      <div class="glg"><span class="pvl">PV/Speicher ${de(sum.p, 1)} kWh</span>${B.split ? `<span class="grl">Netz ${de(sum.g, 1)} kWh</span>` : ""}<span class="s">Ladestand ${Math.round(nowS)} %</span>
<span class="src">${B.unit === "d" ? "Tageswerte" : "Stundenwerte"}</span></div>`;
  }

  /* Maus/Finger über den Balken: Werte anzeigen */
  _barHover(e) {
    const wrap = e.composedPath().find((n) => n.classList?.contains("chwrap") && n.classList.contains("bars"));
    const tip = this.shadowRoot.querySelector(".chwrap.bars .gtip"), hl = this.shadowRoot.querySelector(".chwrap.bars .hl");
    if (!wrap || !this._barRows) { if (tip) tip.hidden = true; if (hl) hl.setAttribute("width", 0); return; }
    const svg = wrap.querySelector("svg"), r = svg.getBoundingClientRect();
    const fx = (e.clientX - r.left) / r.width; if (fx < 0 || fx > 1) { tip.hidden = true; return; }
    const [t0, t1] = this._barT, t = t0 + fx * (t1 - t0), step = this._barStep;
    const row = this._barRows.find((x) => t >= x.t && t < x.t + step);
    if (!row) { tip.hidden = true; hl.setAttribute("width", 0); return; }
    const d = new Date(row.t), d2 = new Date(row.t + step);
    const when = step >= 86400000 ? `${WD_LONG[d.getDay()]}, ${d.getDate()}. ${MON[d.getMonth()]}` : `${WD[d.getDay()]} ${d.getDate()}. ${MON[d.getMonth()]} · ${pad(d.getHours())}–${pad(d2.getHours())} Uhr`;
    const pvp = row.kwh > 0 ? Math.round((row.pv / row.kwh) * 100) : 0;
    tip.innerHTML = `<b>${when}</b>
      <div><i class="pvd"></i>PV/Speicher<span>${de(row.pv, 2)} kWh</span></div>
      <div><i class="grd"></i>Netz<span>${de(row.grid, 2)} kWh</span></div>
      <div class="tot">Geladen<span>${de(row.kwh, 2)} kWh${row.kwh > 0.005 ? ` · ${pvp} % PV` : ""}</span></div>
      ${row.soc != null ? `<div class="tsoc">Ladestand<span>${Math.round(row.soc)} %</span></div>` : ""}`;
    tip.hidden = false;
    const W = 700, x0 = ((row.t - t0) / (t1 - t0)) * W, w = (step / (t1 - t0)) * W;
    hl.setAttribute("x", Math.max(0, x0)); hl.setAttribute("width", Math.max(2, w));
    const px = e.clientX - wrap.getBoundingClientRect().left, ww = wrap.clientWidth;
    tip.style.left = Math.min(Math.max(px - tip.offsetWidth / 2, 0), ww - tip.offsetWidth) + "px";
  }

  _render_hist() {
    const c = this._config.car, ev = c.evcc || {}, el = this.shadowRoot.getElementById("hist");
    const hrs = this._histHours(), H = this._carHist?.hrs === hrs ? this._carHist : null;
    const W = 700, Ht = 150, t1 = Date.now(), t0 = t1 - hrs * 3600000;
    const X = (t) => ((Math.max(t, t0) - t0) / (t1 - t0)) * W;
    const pid = ev.power || this._config.energy.car_power;
    // nur den Zeitraum zeigen: letzter Wert vor Beginn wird zum Startwert
    const clip = (arr) => { const pre = arr.filter((p) => p[0] <= t0).pop(); return (pre ? [[t0, pre[1]]] : []).concat(arr.filter((p) => p[0] > t0)); };
    const soc = clip(H?.data?.[c.soc] || []), pw = clip(H?.data?.[pid] || []);
    const kw = this._st(pid)?.attributes?.unit_of_measurement?.toLowerCase() === "kw" ? 1 : 0.001;
    // aktuellen Wert bis "jetzt" fortschreiben
    const nowP = this._w(pid) / 1000, nowS = this._num(c.soc);
    const seg = (c.history_ranges || [6, 24, 72, 168, 720]).map((h) =>
      `<button class="hseg ${h === hrs ? "sel" : ""}" data-act="hrange" data-h="${h}">${this._rangeLbl(h)}</button>`).join("");
    let body;
    if (!H) body = `<div class="empty">Lädt …</div>`;
    else if (H.bars?.rows?.length && hrs >= (c.bars_from_hours ?? 24)) body = this._barsSvg(H, t0, t1, W, Ht, X, soc, nowS);
    else if (!(H.data?.[c.soc]?.length) && !(H.data?.[pid]?.length)) body = `<div class="empty hdiag">Keine Verlaufsdaten für ${(H.ids || []).map((x) => `<code>${esc(x)}</code>`).join(" und ")} im Zeitraum.<br>
      Für lange Zeiträume braucht der Sensor <code>state_class: measurement</code> (Langzeitstatistik), sonst speichert der Recorder standardmäßig nur 10 Tage.</div>`;
    else {
      const pts = pw.map((x) => [x[0], x[1] * kw]).concat([[t1, nowP]]);
      const maxP = Math.max(3.7, ...pts.map((x) => x[1]));
      const Y = (v) => (Ht - (v / maxP) * (Ht - 10)).toFixed(1);
      // Wert vor Fensterbeginn als Startwert
      let ap = `M0,${Ht}V${Y(pts[0][0] <= t0 ? pts[0][1] : 0)}`;
      for (const [t, v] of pts) ap += `H${X(t).toFixed(1)}V${Y(v)}`;
      ap += `H${W}V${Ht}Z`;
      const sp0 = soc.concat([[t1, nowS]]);
      const S = (v) => (Ht - (v / 100) * (Ht - 10)).toFixed(1);
      let sp = `M${X(sp0[0][0]).toFixed(1)},${S(sp0[0][1])}`;
      for (const [t, v] of sp0.slice(1)) sp += `L${X(t).toFixed(1)},${S(v)}`;
      // Zeitachse: Stunden bei kurzen, Tage bei langen Zeiträumen
      const ticks = [], step = hrs <= 6 ? 1 : hrs <= 24 ? 3 : hrs <= 72 ? 12 : hrs <= 168 ? 24 : 24 * 5;
      const first = new Date(t0); first.setMinutes(0, 0, 0);
      if (step >= 24) first.setHours(0); else first.setHours(Math.ceil(first.getHours() / step) * step);
      for (let t = first.getTime(); t <= t1; t += step * 3600000) if (t >= t0) {
        const d = new Date(t);
        ticks.push([X(t) / W * 100, step >= 24 ? `${WD[d.getDay()]} ${d.getDate()}.` : step >= 12 && d.getHours() === 0 ? `${WD[d.getDay()]}` : `${pad(d.getHours())}:00`]);
      }
      const grid = ticks.map(([x]) => `<line x1="${(x / 100) * W}" x2="${(x / 100) * W}" y1="0" y2="${Ht}" class="gl"/>`).join("");
      const kwh = pw.length ? (() => { let e = 0; for (let i = 0; i < pts.length - 1; i++) { const a = Math.max(pts[i][0], t0), b = pts[i + 1][0]; if (b > a) e += pts[i][1] * (b - a) / 3600000; } return e; })() : 0;
      body = `<div class="chwrap"><svg class="chist" viewBox="0 0 ${W} ${Ht}" preserveAspectRatio="none">${grid}
          <path d="${ap}" class="gp"/><path d="${sp}" class="gs" vector-effect="non-scaling-stroke"/>
          <line x1="${W}" x2="${W}" y1="0" y2="${Ht}" class="gnow"/></svg>
        <div class="gax">${ticks.filter(([x]) => x < 90).map(([x, l]) => `<span class="${x < 4 ? "st" : ""}" style="left:${x}%">${l}</span>`).join("")}<span class="now" style="left:100%">jetzt</span></div></div>
        <div class="glg"><span class="s">Ladestand ${Math.round(nowS)} %</span><span class="p">Ladeleistung (max ${de(maxP, 1)} kW)</span>${Object.values(H.src || {}).includes("Statistik") ? `<span class="src">Stundenmittel</span>` : ""}</div>`;
    }
    // Summe und gemessener PV-Anteil des Zeitraums in die Kopfzeile
    let head = "";
    if (H) {
      const rows = (H.bars?.rows || []).filter((r) => r.t + (H.bars.unit === "d" ? 86400000 : 3600000) > t0);
      let k = rows.reduce((a, r) => a + r.kwh, 0), pv = rows.reduce((a, r) => a + r.pv, 0);
      if (!rows.length && pw.length) {   // keine Statistik: Energie aus der Leistungskurve
        const pts = pw.map((x) => [x[0], x[1] * kw]).concat([[t1, nowP]]);
        k = 0; for (let i = 0; i < pts.length - 1; i++) k += pts[i][1] * (pts[i + 1][0] - Math.max(pts[i][0], t0)) / 3600000;
        pv = null;
      }
      if (k > 0.05) head = `<span class="hsum"><b>${de(k, 1)}</b> kWh${pv != null && H.bars?.split ? `<span class="hpv">${icon("mdi:solar-power-variant")}${Math.round((pv / k) * 100)} % PV</span>` : ""}</span>`;
      else head = `<span class="hsum dim">nicht geladen</span>`;
    }
    el.innerHTML = `<div class="hd"><span class="ttl">Verlauf</span>${head}<div class="hsegs">${seg}</div></div>` + body;
  }

  /* --- Kennzahlen (ev_assistant) --- */
  _render_stats() {
    const E = this._eva();
    const t = (lbl, id, dec) => { const f = this._fmt(id, dec); return f ? `<button class="cdt" data-act="more" data-entity="${esc(id)}"><span>${esc(lbl)}</span><b>${esc(f.v)}<small>${esc(f.u)}</small></b></button>` : ""; };
    const sec = (title, ic, html) => html.replace(/\s/g, "") ? `<section class="panel"><div class="hd"><span class="ttl">${icon(ic)}${title}</span></div><div class="cdgrid">${html}</div></section>` : "";
    const html = [
      sec("Fahren", "mdi:road-variant", [t("Kilometerstand", E.odo, 0), t("Heute", E.odo_day_km, 0), t("Woche", E.odo_week_km, 0), t("Monat", E.odo_month_km, 0),
        t("Jahr", E.odo_year_km, 0), t("Ø km/Tag", E.odo_avg_day, 0), t("Erwartet (Jahr)", E.odo_year_projected, 0), t("Fahrten", E.trip_count, 0)].join("")),
      sec("Verbrauch & Akku", "mdi:battery-heart-variant", [t("Ø Fahrzeug", E.vehicle_avg_consumption, 1), t("Ø Fahrtenbuch", E.trip_avg_consumption, 1),
        t("Reichweite (real)", E.range_estimate, 0), t("Verfügbar", E.available_kwh, 1), t("Kapazität", E.battery_capacity, 1), t("Vollzyklen", E.equivalent_full_cycles, 1),
        t("Wirkungsgrad", E.measured_efficiency, 0)].join("")),
      sec("Kosten & Energie", "mdi:cash-multiple", [t("Heute", E.cost_day, 2), t("Woche", E.cost_week, 2), t("Monat", E.cost_month, 2), t("Jahr", E.cost_year, 0),
        t("kWh Monat", E.kwh_month, 0), t("kWh Jahr", E.kwh_year, 0), t("Heimladen", E.home_kwh, 0), t("Fremdladen", E.total_kwh, 0),
        t("Ersparnis", E.savings, 0), t("CO₂ gespart", E.co2_savings, 0)].join("")),
    ].join("");
    this.shadowRoot.getElementById("stats").innerHTML = html || `<section class="panel"><div class="empty">Keine ev_assistant-Daten gefunden</div></section>`;
  }
}

const CAR_STYLE = `
.wrap.carpage .grid{grid-template-columns:1fr 1.15fr 1.15fr}
#hist{display:flex;flex-direction:column;flex:none!important}
#hist .hd{flex-wrap:wrap;row-gap:10px}
#hist .hsegs{order:3;margin-left:0;width:100%}
#hist .hseg{flex:1;text-align:center}
#hist .chist{height:200px}
.wrap.carpage.fit #hist{flex:none;min-height:0}
.carpage .panel.car .carbody{cursor:default}
.carpage .soc{font-size:76px}
.carpage .carimg{max-height:120px}
.chgl{color:var(--green);font-weight:700;display:inline-flex;align-items:center;gap:4px}
.chgl ha-icon{--mdc-icon-size:16px}
.cdgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(130px,1fr));gap:8px}
.cdt{display:flex;flex-direction:column;gap:3px;padding:10px 12px;border-radius:15px;background:var(--tile);border:1px solid var(--tileb);min-width:0}
.cdt span{font-size:12px;color:var(--muted);font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.cdt b{font-size:19px;font-weight:700;font-variant-numeric:tabular-nums;white-space:nowrap}
.cdt small{font-size:12px;color:var(--muted);font-weight:500;margin-left:3px}
.cdt.hot{border-color:rgba(52,211,153,.45);background:rgba(52,211,153,.08)}
.cdt.hot b{color:var(--green)}
.cdinfos{display:flex;flex-direction:column;gap:8px;margin-bottom:10px}
/* Lademanagement */
.mauto,.mman{display:inline-flex;align-items:center;gap:6px;font-size:13.5px;font-weight:600}
.mauto{color:var(--cyan)}.mman{color:var(--orange)}
.mauto ha-icon,.mman ha-icon{--mdc-icon-size:16px}
.mgrp{display:flex;flex-direction:column;gap:6px;margin-bottom:12px}
.mgl{font-size:12px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:var(--muted)}
.mgl small{letter-spacing:0;text-transform:none;font-weight:500;color:var(--dim)}
.mgrp.dim .mseg{opacity:.6}
.mgrp.off .mseg{opacity:.35;pointer-events:none}
.mseg{display:flex;gap:4px;padding:4px;border-radius:16px;background:rgba(255,255,255,.03);border:1px solid var(--line)}
.msb{flex:1;min-width:0;height:40px;border-radius:12px;display:flex;align-items:center;justify-content:center;gap:6px;font-size:14px;font-weight:600;color:var(--muted);white-space:nowrap}
.msb ha-icon{--mdc-icon-size:17px}
.msb span{overflow:hidden;text-overflow:ellipsis}
.msb:hover{background:rgba(255,255,255,.05);color:var(--text)}
.msb.sel{background:color-mix(in srgb,var(--cc) 18%,transparent);color:var(--cc);box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--cc) 50%,transparent)}
.msteps{display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:8px;margin-bottom:12px}
.mstep{display:flex;flex-direction:column;gap:8px;padding:10px 12px;border-radius:16px;background:var(--tile);border:1px solid var(--tileb)}
.msl{display:flex;align-items:center;gap:7px;font-size:12.5px;color:var(--muted);font-weight:600}
.msl ha-icon{--mdc-icon-size:16px;color:var(--dim)}
.mstep .tgt{display:flex;align-items:center;justify-content:space-between;gap:2px;background:rgba(255,255,255,.04);border:1px solid var(--line);border-radius:13px;padding:3px}
.mstep .tb{width:36px;height:34px;border-radius:10px;display:grid;place-items:center;font-size:20px;color:var(--muted);text-align:center}
.mstep .tb:hover{background:rgba(255,255,255,.07);color:var(--text)}
.mstep .tv{font-size:18px;font-weight:700;font-variant-numeric:tabular-nums}
.mstep .tv small{font-size:12px;color:var(--muted);font-weight:500}
#mgmt .lrows{margin-top:0}
.mmodes{display:flex;gap:6px}
.mmode{flex:1;min-width:0;display:flex;flex-direction:column;gap:8px;padding:10px 12px;border-radius:16px;background:var(--tile);border:1px solid var(--tileb);cursor:pointer;transition:all .2s}

.mmode:hover{border-color:rgba(255,255,255,.16)}
.mmh{display:flex;align-items:center;gap:8px;font-size:15px;color:var(--muted)}
.mmh ha-icon{--mdc-icon-size:20px}
.mmode.sel{background:linear-gradient(160deg,color-mix(in srgb,var(--cc) 20%,transparent),color-mix(in srgb,var(--cc) 4%,transparent));border-color:color-mix(in srgb,var(--cc) 60%,transparent)}
.mmode.sel .mmh{color:var(--cc)}
.mchv{--mdc-icon-size:18px;opacity:.6;margin-left:auto}
.mmode.vorgabe{flex:none;min-width:0}
.mmode.vorgabe.manual{background:linear-gradient(160deg,rgba(239,68,68,.18),rgba(239,68,68,.04));border-color:rgba(239,68,68,.55)}
.mmode.vorgabe.manual .mmh{color:#ef4444}
.mal{font-size:11px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:var(--dim)}
.malw{display:flex;gap:4px}
.mab{flex:1;min-width:0;height:32px;border-radius:10px;display:flex;align-items:center;justify-content:center;gap:5px;font-size:12.5px;font-weight:600;color:var(--muted);background:rgba(255,255,255,.04);white-space:nowrap}
.mab ha-icon{--mdc-icon-size:15px}
.mab .glyph{font-size:14px;color:inherit}
.mab ha-icon{--mdc-icon-size:17px}
.mab span{overflow:hidden;text-overflow:ellipsis}
.mab:hover{color:var(--text)}
.mab.sel{background:color-mix(in srgb,var(--cc) 20%,transparent);color:var(--cc);box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--cc) 50%,transparent)}
.mmode:not(.sel) .mab{opacity:.55}
.mplan{display:flex;flex-direction:column;gap:10px;padding:12px 14px;border-radius:16px;background:var(--tile);border:1px solid var(--tileb);margin-bottom:8px}
.mplan.act{border-color:rgba(56,189,248,.45);background:linear-gradient(160deg,rgba(56,189,248,.12),rgba(56,189,248,.02))}
.mph{display:flex;align-items:center;gap:10px}
.mph > ha-icon{--mdc-icon-size:22px;color:var(--cyan);flex:none}
.mph span{flex:1;min-width:0;display:flex;flex-direction:column}
.mph b{font-size:15px;font-weight:600}
.mph small{font-size:12.5px;color:var(--muted)}
.mpe{display:flex;gap:8px;font-size:13px;color:var(--muted);line-height:1.4}
.mpe ha-icon{--mdc-icon-size:16px;color:var(--dim);flex:none;margin-top:1px}
.mpf{display:flex;flex-wrap:wrap;align-items:flex-end;gap:10px}
.mpf label{display:flex;flex-direction:column;gap:5px;font-size:11.5px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:var(--muted)}
.mpf .tgt{display:flex;align-items:center;gap:2px;background:rgba(255,255,255,.04);border:1px solid var(--line);border-radius:12px;padding:2px}
.mpf .tb{width:32px;height:32px;border-radius:9px;font-size:18px;color:var(--muted);text-align:center}
.mpf .tv{min-width:52px;text-align:center;font-size:16px;font-weight:700;letter-spacing:0;text-transform:none;color:var(--text)}
.pin{height:38px;border-radius:12px;border:1px solid var(--line);background:rgba(255,255,255,.05);color:var(--text);padding:0 10px;font:inherit;font-size:14px;color-scheme:dark}
.mpf .qbtn{margin-left:auto}
.qbtn[disabled]{opacity:.4;pointer-events:none}
.mtog{display:flex;align-items:center;gap:12px;width:100%;padding:11px 14px;border-radius:16px;background:var(--tile);border:1px solid var(--tileb);margin-bottom:8px;text-align:left}
.mtog > ha-icon{--mdc-icon-size:21px;color:var(--muted);flex:none}
.mtog span{flex:1;min-width:0;display:flex;flex-direction:column}
.mtog b{font-size:15px;font-weight:600}
.mtog small{font-size:12.5px;color:var(--muted)}
.mtog.on{border-color:rgba(52,211,153,.4)}
.mtog.on > ha-icon{color:var(--green)}
.msw{width:44px;height:26px;border-radius:13px;background:rgba(255,255,255,.1);position:relative;flex:none;transition:background .2s}
.msw i{position:absolute;top:3px;left:3px;width:20px;height:20px;border-radius:50%;background:#c9ced8;transition:transform .2s}
.mtog.on .msw{background:#22a37a}
.mtog.on .msw i{transform:translateX(18px);background:#fff}
.mbottom{display:flex;gap:8px;margin-top:4px;margin-bottom:12px}
.mbtn{flex:1;display:flex;flex-direction:row;align-items:center;gap:8px;padding:8px 14px;border-radius:14px;background:var(--tile);border:1px solid var(--tileb);cursor:pointer;transition:border-color .2s}
.mbtn:hover{border-color:rgba(255,255,255,.16)}
.mbtn .mtx{display:flex;flex-direction:column;gap:1px;flex:1;min-width:0}
.mbtn ha-icon:first-child{--mdc-icon-size:18px;color:var(--muted);flex:none}
.mbtn b{font-size:15px;font-weight:700;font-variant-numeric:tabular-nums;white-space:nowrap}
.mbtn span{font-size:10.5px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:var(--muted);white-space:nowrap}
.mbtn .mchv{--mdc-icon-size:14px;opacity:.4;margin-left:auto;flex:none}
.mbtn.lim b{color:var(--cyan)}
.mbtn.lim ha-icon:first-child{color:var(--cyan)}
.mbtn.bal.on{border-color:rgba(52,211,153,.4)}
.mbtn.bal.on ha-icon{color:var(--green)}
.mbtn.bal.on b{color:var(--green)}
.mbtn.bal.act{animation:mgpulse 1.4s ease-in-out infinite}
.limm{scrollbar-width:thin;scrollbar-color:rgba(255,255,255,.15) transparent}
/* Laden */
.lclick{cursor:pointer;border-radius:22px}
.lclick:hover .lhero{border-color:rgba(255,255,255,.16)}
#live .hd .arrow{margin-left:10px}
/* Alle Ladungen */
.chpan{max-width:980px}
.chsum{display:flex;flex-wrap:wrap;align-items:center;gap:8px;padding:14px 20px;border-bottom:1px solid var(--line)}
.chsum > div:not(.hsegs){display:flex;flex-direction:column;padding:8px 14px;border-radius:14px;background:var(--tile);border:1px solid var(--tileb);min-width:92px}
.chsum span{font-size:11.5px;color:var(--muted);font-weight:600;letter-spacing:.06em;text-transform:uppercase}
.chsum b{font-size:19px;font-weight:700;font-variant-numeric:tabular-nums}
.chsum b small{font-size:12px;color:var(--muted);font-weight:500;margin-left:3px}
.chsum .pv b{color:var(--e-solar)}
.chsum .hsegs{margin-left:auto}
.chlist{display:flex;flex-direction:column;gap:6px}
.chm{font-size:12px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:var(--dim);margin:10px 4px 2px}
.chm:first-child{margin-top:0}
.chr{display:grid;grid-template-columns:40px minmax(0,1.4fr) minmax(0,1fr) 80px 96px;align-items:center;gap:12px;padding:9px 14px 9px 10px;border-radius:16px;background:var(--tile);border:1px solid var(--tileb)}
.chi{width:40px;height:40px;border-radius:13px;display:grid;place-items:center;background:rgba(52,211,153,.12);color:var(--green)}
.chr.ext .chi{background:rgba(251,146,60,.13);color:var(--orange)}
.chi ha-icon{--mdc-icon-size:20px}
.chd{display:flex;flex-direction:column;min-width:0}
.chd b{font-size:15px;font-weight:600}
.chd small{font-size:12.5px;color:var(--muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.chpv{display:flex;flex-direction:column;gap:4px;min-width:0}
.chpv .pvbar{display:block;height:6px;border-radius:4px;background:var(--e-grid-in);overflow:hidden}
.chpv .pvbar i{display:block;height:100%;background:var(--e-solar)}
.chpv small{font-size:12px;color:var(--muted)}
.chk,.chc{display:flex;flex-direction:column;align-items:flex-end;font-variant-numeric:tabular-nums}
.chk b{font-size:17px;font-weight:700;color:var(--cyan)}
.chc b{font-size:15px;font-weight:700}
.chk small,.chc small{font-size:11.5px;color:var(--muted);white-space:nowrap}
@container (max-width:720px){}
@media (max-width:760px){.chr{grid-template-columns:36px minmax(0,1fr) 64px 78px}.chpv{display:none}.chsum .hsegs{width:100%;margin-left:0}}
.lst{margin-left:auto;display:inline-flex;align-items:center;gap:6px;padding:5px 11px;border-radius:12px;font-size:13.5px;font-weight:600;background:rgba(255,255,255,.05);color:var(--muted)}
.lst ha-icon{--mdc-icon-size:16px}
.lst.on{background:rgba(52,211,153,.14);color:var(--green)}
.lst.on ha-icon{animation:mgpulse 1.4s ease-in-out infinite}
.lst.ready{background:rgba(56,189,248,.12);color:var(--cyan)}
@keyframes mgpulse{50%{opacity:.4}}
.lhero{display:flex;align-items:center;gap:16px;padding:16px 18px;border-radius:22px;background:var(--tile);border:1px solid var(--tileb);margin-bottom:12px}
.lhero.chg{background:radial-gradient(120% 120% at 0% 0%,rgba(52,211,153,.16),transparent 60%),var(--tile);border-color:rgba(52,211,153,.4)}
.lhl{flex:1;min-width:0;display:flex;flex-direction:column;gap:2px}
.lkick{font-size:12px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:var(--muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.lbig{display:flex;align-items:baseline;gap:6px}
.lbig b{font-size:46px;font-weight:800;line-height:1.05;letter-spacing:-.02em;font-variant-numeric:tabular-nums}
.lhero.chg .lbig b{color:var(--green)}
.lbig small{font-size:16px;color:var(--muted);font-weight:600}
.lwhen{display:flex;align-items:center;gap:6px;font-size:14px;color:var(--muted);flex-wrap:wrap}
.lwhen ha-icon{--mdc-icon-size:16px;color:var(--dim)}
.lwhen b{color:var(--text)}
.lhero.chg .lwhen ha-icon{color:var(--green)}
.lringw{position:relative;width:96px;height:96px;flex:none}
.lring{width:100%;height:100%;transform:rotate(-90deg)}
.lring circle{fill:none;stroke-width:9;stroke-linecap:butt}
.lring .rbg{stroke:rgba(255,255,255,.06)}
.lring .rpv{stroke:var(--e-solar);filter:drop-shadow(0 0 5px color-mix(in srgb,var(--e-solar) 50%,transparent))}
.lring .rgr{stroke:var(--e-grid-in)}
.lringt{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;line-height:1}
.lringt b{font-size:22px;font-weight:800;color:var(--e-solar)}
.lringt small{font-size:12px;font-weight:600;margin-left:1px}
.lringt span{font-size:11px;font-weight:700;letter-spacing:.12em;color:var(--muted);margin-top:3px}
.lsplit{display:flex;height:10px;border-radius:6px;overflow:hidden;gap:2px;margin:0 2px 6px}
.lsplit .pv{background:var(--e-solar)}.lsplit .gr{background:var(--e-grid-in)}
.lsplitl{display:flex;justify-content:space-between;font-size:13px;color:var(--muted);margin:0 2px 12px}
.lsplitl span{display:inline-flex;align-items:center;gap:5px}
.lsplitl ha-icon{--mdc-icon-size:15px}
.lsplitl .pv ha-icon{color:var(--e-solar)}.lsplitl .gr ha-icon{color:var(--e-grid-in)}
.lsplitl b{color:var(--text);font-variant-numeric:tabular-nums}
.lfacts{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px;margin-bottom:12px}
.lfact{display:flex;flex-direction:column;gap:2px;padding:9px 11px;border-radius:14px;background:var(--tile);border:1px solid var(--tileb);min-width:0}
.lfact span{font-size:11.5px;color:var(--muted);font-weight:600;white-space:nowrap}
.lfact b{font-size:15.5px;font-weight:700;font-variant-numeric:tabular-nums;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.lrows{display:flex;flex-direction:column;border-radius:16px;background:var(--tile);border:1px solid var(--tileb);overflow:hidden}
.lrow{display:flex;align-items:center;gap:10px;padding:10px 14px;font-size:14px;color:var(--muted)}
.lrow + .lrow{border-top:1px solid var(--line)}
.lrow ha-icon{--mdc-icon-size:18px;color:var(--cyan)}
.lrow b{margin-left:auto;color:var(--text);font-weight:600;text-align:right;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.lrow.warn ha-icon,.lrow.warn b{color:var(--orange)}
.wrap.compact .lbig b{font-size:36px}.wrap.compact .lringw{width:80px;height:80px}.wrap.compact .lhero{padding:12px 14px}
@container (max-width:720px){.lfacts{grid-template-columns:repeat(2,minmax(0,1fr))}}
.cdinfo{display:flex;align-items:center;gap:10px;padding:10px 14px;border-radius:15px;background:var(--tile);border:1px solid var(--tileb);cursor:pointer}
.cdinfo ha-icon{--mdc-icon-size:20px;color:var(--cyan)}
.cdinfo span{display:flex;flex-direction:column;font-size:14.5px;font-weight:600}
.cdinfo small{font-size:11.5px;color:var(--muted);font-weight:600;letter-spacing:.06em;text-transform:uppercase}
.cdinfo.warn{border-color:rgba(251,146,60,.35)}
.cdinfo.warn ha-icon{color:var(--orange)}
.carpage .cstats{grid-template-columns:repeat(2,minmax(0,1fr))}
#stats{gap:20px}
#stats .ttl ha-icon{--mdc-icon-size:18px;margin-right:10px;vertical-align:-3px;color:var(--muted)}
#trips{display:flex;flex-direction:column}
.tlist{display:flex;flex-direction:column;gap:6px}
.tday{font-size:12px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:var(--dim);margin:8px 4px 2px}
.tday:first-child{margin-top:0}
.trip{display:grid;grid-template-columns:52px 1fr auto auto;align-items:center;gap:12px;padding:10px 14px;border-radius:16px;background:var(--tile);border:1px solid var(--tileb)}
.ttime{font-size:15px;font-weight:700;font-variant-numeric:tabular-nums;color:rgba(243,245,249,.85)}
.troute{display:flex;flex-wrap:wrap;align-items:center;gap:4px 6px;min-width:0;font-size:15px}
.troute b{font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:140px}
.troute ha-icon{--mdc-icon-size:15px;color:var(--dim)}
.troute small{width:100%;font-size:12.5px;color:var(--muted)}
.tkm,.tkwh{display:flex;flex-direction:column;align-items:flex-end;font-variant-numeric:tabular-nums;min-width:56px}
.tkm b,.tkwh b{font-size:17px;font-weight:700}
.tkwh b{color:var(--cyan)}
.tkm small,.tkwh small{font-size:11.5px;color:var(--muted);white-space:nowrap}
.chwrap{position:relative;padding-bottom:20px}
.glg .src{margin-left:auto;color:var(--dim)}
.glg .src::before{display:none}
.hdiag{line-height:1.5}
.hdiag code{font-size:12px;background:rgba(255,255,255,.06);padding:1px 6px;border-radius:6px;color:var(--text)}
.chist{width:100%;height:170px;display:block;overflow:visible}
.chist .gnow{stroke:rgba(255,255,255,.35);stroke-width:1;stroke-dasharray:3 3}
.gax{position:absolute;left:0;right:0;bottom:0;height:16px}
.gax span{position:absolute;transform:translateX(-50%);font-size:11.5px;color:var(--dim);white-space:nowrap;font-variant-numeric:tabular-nums}
.gax span.st{transform:none}
.gax span.now{transform:translateX(-100%);color:var(--muted);font-weight:600}
.hsegs{margin-left:auto;display:flex;background:rgba(255,255,255,.03);border:1px solid var(--line);border-radius:12px;padding:3px}
.hseg{height:30px;padding:0 8px;border-radius:9px;font-size:13px;font-weight:600;color:var(--muted);white-space:nowrap}
.hseg.sel{background:rgba(255,255,255,.09);color:var(--text)}
.glg .e{color:var(--green);font-weight:600}
.hsum{display:inline-flex;align-items:center;gap:10px;font-size:14.5px;color:var(--muted);white-space:nowrap;margin-left:4px}
.hsum b{color:var(--green);font-size:17px;font-variant-numeric:tabular-nums}
.hsum.dim{color:var(--dim)}
.hpv{display:inline-flex;align-items:center;gap:4px;color:var(--e-solar);font-weight:700;padding:3px 9px;border-radius:10px;background:color-mix(in srgb,var(--e-solar) 12%,transparent)}
.hpv ha-icon{--mdc-icon-size:15px}
@container (max-width:720px){#hist .hd{flex-wrap:wrap}#hist .hsegs{width:100%;margin-left:0}}
.chist .bpv{fill:rgba(255,152,0,.85)}
.chist .bgr{fill:rgba(72,143,194,.9)}
.chist .hl{fill:rgba(255,255,255,.08);pointer-events:none}
.chwrap.bars{cursor:crosshair;touch-action:pan-y}
.gmax{position:absolute;top:-2px;left:4px;font-size:11px;color:var(--dim);pointer-events:none}
.glg .pvl::before{background:rgba(255,152,0,.85)!important}
.glg .grl::before{background:rgba(72,143,194,.9)!important}
.glg .pvl,.glg .grl{}
.glg .pvl::before,.glg .grl::before{content:"";display:inline-block;width:10px;height:10px;border-radius:3px;margin-right:6px;vertical-align:-1px}
.gtip{position:absolute;top:6px;z-index:5;min-width:190px;max-width:240px;background:#1c2029;border:1px solid rgba(255,255,255,.12);border-radius:13px;padding:9px 12px;font-size:12.5px;color:var(--muted);box-shadow:0 10px 26px rgba(0,0,0,.5);pointer-events:none}
.gtip b{display:block;color:var(--text);font-size:13px;margin-bottom:5px}
.gtip div{display:flex;align-items:center;gap:6px;line-height:1.6}
.gtip div span{margin-left:auto;color:var(--text);font-weight:600;font-variant-numeric:tabular-nums;padding-left:12px}
.gtip i{width:9px;height:9px;border-radius:3px;display:inline-block}
.gtip .pvd{background:rgba(255,152,0,.9)}.gtip .grd{background:rgba(72,143,194,.95)}
.gtip .tot{border-top:1px solid var(--line);margin-top:4px;padding-top:4px}
.gtip .tot span{color:var(--green)}
.glg .e::before{display:none}
.chist .gl{stroke:rgba(255,255,255,.06);stroke-width:1}
.chist .gt{fill:var(--dim);font-size:12px;font-family:inherit}
.chist .gp{fill:rgba(52,211,153,.22);stroke:rgba(52,211,153,.7);stroke-width:1}
.chist .gs{fill:none;stroke:#38bdf8;stroke-width:2.2}
.glg{display:flex;flex-wrap:wrap;gap:4px 16px;font-size:12.5px;color:var(--muted);margin-top:6px}
.glg span{white-space:nowrap}
.glg span::before{content:"";display:inline-block;width:10px;height:10px;border-radius:3px;margin-right:6px;vertical-align:-1px}
.glg .s::before{background:#38bdf8}.glg .p::before{background:rgba(52,211,153,.6)}
.wrap.carpage.fit .col{overflow-y:auto;scrollbar-width:thin;scrollbar-color:rgba(255,255,255,.15) transparent;padding-right:2px}
.wrap.carpage.fit .panel{flex:none}
.wrap.carpage.fit #trips{flex:1 1 0;min-height:260px}
.wrap.carpage.fit #trips .tlist{flex:1;min-height:0;overflow-y:auto;scrollbar-width:thin;scrollbar-color:rgba(255,255,255,.15) transparent;padding-right:4px;margin-right:-8px}
@container (max-width:1180px){.wrap.carpage .grid{grid-template-columns:1fr 1fr}.wrap.carpage .col:nth-child(2){grid-column:1 / -1;order:1}}
@container (max-width:720px){.wrap.carpage .grid{grid-template-columns:1fr}.carpage .soc{font-size:60px}.trip{grid-template-columns:44px 1fr auto;}.tkwh{display:none}.cstats{grid-template-columns:repeat(2,minmax(0,1fr))}}
`;

if (!customElements.get("mg-car-dashboard")) customElements.define("mg-car-dashboard", MgCarDashboard);
if (!window.customCards.some((c) => c.type === "mg-car-dashboard"))
  window.customCards.push({ type: "mg-car-dashboard", name: "MG Auto", description: "Auto-Seite mit evcc, ev_assistant und Fahrtenbuch im Glow-Stil" });

console.info(`%c MG-HOME-DASHBOARD %c ${VERSION} `, "background:#f7b733;color:#111;font-weight:700", "background:#14171e;color:#f7b733");

