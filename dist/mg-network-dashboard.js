/*
 * mg-network-dashboard.js
 * Ablage:    /config/www/glow-dashboard/mg-network-dashboard.js
 * Ressource: /local/glow-dashboard/mg-network-dashboard.js?v=1  (Typ: JavaScript-Modul)
 * YAML:      type: custom:mg-network-dashboard
 *            variant: 1      # 1 = Geräte-Kacheln, 2 = Übersicht mit aufklappbaren Geräten
 *
 * Server (ThinkCentre), NAS (Synology), Netzwerk (UniFi) und Drucker (HP) im Glow-Stil.
 * Alle Entitäten sind unten in DEFAULT_DEVICES vorbelegt und lassen sich per YAML (`devices:`) ersetzen.
 */

window.customCards = window.customCards || [];
const VERSION = "1.1.0";
const FONT_FILE = "/local/glow-dashboard/Outfit.woff2";   // Schrift „Outfit“ (SIL OFL 1.1) liegt lokal neben den Karten

const C = {
  gold: "#f7b733", cyan: "#38bdf8", green: "#34d399", violet: "#a78bfa",
  orange: "#fb923c", red: "#f87171", blue: "#60a5fa", dim: "#5d6373",
};

// ---------------------------------------------------------------------------
// Standard-Konfiguration (aus dem alten Dashboard übernommen)
//  meters : Balken   {entity,name,icon,max,unit,decimals,color,warn,crit,invert,ring}
//  chips  : Kacheln  {entity,name,icon,ok:[Zustände],labels:{zustand:text},format:'since'|'ago',toggle,dialog,low:{warn,crit}}
//  chart  : Verlauf  {hours, series:[{entity,name,color,min,max}]}
//  extras : {type:'rssi'|'entities', entity}
// ---------------------------------------------------------------------------
const PCT = { max: 100, unit: "%" };
const DEFAULT_DEVICES = [
  {
    id: "server", name: "ThinkCentre", sub: "Home Assistant Host", icon: "mdi:server",
    image: "/local/img/thinkcentre.jpg",
    meters: [
      { entity: "sensor.system_monitor_processor_use", name: "CPU", icon: "mdi:cpu-64-bit", color: C.gold, warn: 70, crit: 90, ring: true, ...PCT },
      { entity: "sensor.system_monitor_memory_use_percent", name: "RAM", icon: "mdi:memory", color: C.violet, warn: 80, crit: 92, ring: true, ...PCT },
      { entity: "sensor.system_monitor_processor_temperature", name: "System", icon: "mdi:thermometer", color: C.green, warn: 65, crit: 80, max: 100, unit: "°C", ring: true },
      { entity: "sensor.system_monitor_disk_use_percent", name: "HDD %", icon: "mdi:harddisk", color: C.blue, warn: 80, crit: 92, ...PCT },
      { entity: "sensor.system_monitor_disk_use", name: "HDD GB", icon: "mdi:harddisk", color: C.blue, max: 225, unit: "GB" },
      { entity: "sensor.home_assistant_v2_db_grosse", name: "Datenbank", icon: "mdi:database", color: C.green, max: 15000, unit: "MB" },
    ],
    chips: [
      { entity: "binary_sensor.remote_ui", name: "Status", icon: "mdi:cloud-check-outline", ok: ["on"], labels: { on: "Verbunden", off: "Getrennt" }, status: true },
      { entity: "update.home_assistant_core_update", name: "Update", icon: "mdi:update", ok: ["off"], labels: { off: "Aktuell", on: "Verfügbar" } },
      { entity: "sensor.uptime", name: "Online seit", icon: "mdi:clock-outline", format: "since" },
      { entity: "sensor.serverschrank_switch_0_power", name: "Serverschrank", icon: "mdi:lightning-bolt-outline", decimals: 0 },
      { entity: "binary_sensor.auto_backup_successful", name: "Backup", icon: "mdi:backup-restore", ok: ["off"], labels: { off: "OK", on: "Fehler" } },
      { entity: "sensor.auto_backup_last_success", name: "Letztes Backup", icon: "mdi:harddisk", format: "ago" },
    ],
    chart: { hours: 96, series: [
      { entity: "sensor.system_monitor_memory_use_percent", name: "RAM", color: C.violet, min: 0, max: 100 },
      { entity: "sensor.system_monitor_processor_temperature", name: "CPU Temp", color: C.red, min: 0, max: 100 },
      { entity: "sensor.system_monitor_processor_use", name: "CPU", color: C.cyan, min: 0, max: 100 },
    ] },
    extras: [{ type: "entities", entity: "sensor.domain_counter" }],
  },
  {
    id: "nas", name: "Synology NAS", sub: "Familien-NAS", icon: "mdi:nas",
    image: "/local/img/synology_nas.jpg",
    meters: [
      { entity: "sensor.familiennas_cpu_auslastung_gesamt", name: "CPU", icon: "mdi:cpu-64-bit", color: C.gold, warn: 70, crit: 90, ring: true, ...PCT },
      { entity: "sensor.familiennas_speichernutzung_real", name: "RAM", icon: "mdi:memory", color: C.violet, warn: 80, crit: 92, ring: true, ...PCT },
      { entity: "sensor.familiennas_temperatur", name: "System", icon: "mdi:thermometer", color: C.green, warn: 60, crit: 75, max: 100, unit: "°C", ring: true },
      { entity: "sensor.familiennas_drive_1_temperatur", name: "HDD 1", icon: "mdi:thermometer", color: C.green, warn: 50, crit: 60, max: 100, unit: "°C" },
      { entity: "sensor.familiennas_drive_2_temperatur", name: "HDD 2", icon: "mdi:thermometer", color: C.green, warn: 50, crit: 60, max: 100, unit: "°C" },
      { entity: "sensor.familiennas_volume_1_verwendetes_volumen", name: "Volumen", icon: "mdi:harddisk", color: C.blue, warn: 80, crit: 92, ...PCT },
    ],
    chips: [
      { entity: "sensor.familiennas_volume_1_status", name: "Status", icon: "mdi:check-network-outline", ok: ["normal"], status: true },
      { entity: "binary_sensor.familiennas_sicherheitsstatus", name: "Sicherheit", icon: "mdi:shield-check-outline", ok: ["off"], labels: { off: "OK", on: "Warnung" } },
      { entity: "sensor.familiennas_drive_1_status_smart", name: "Status HDD 1", icon: "mdi:harddisk", ok: ["normal"] },
      { entity: "sensor.familiennas_drive_2_status_smart", name: "Status HDD 2", icon: "mdi:harddisk", ok: ["normal"] },
    ],
    chart: { hours: 96, series: [
      { entity: "sensor.familiennas_speichernutzung_real", name: "RAM", color: C.violet, min: 0, max: 100 },
      { entity: "sensor.familiennas_temperatur", name: "CPU Temp", color: C.red, min: 0, max: 100 },
      { entity: "sensor.familiennas_cpu_auslastung_gesamt", name: "CPU", color: C.cyan, min: 0, max: 100 },
    ] },
  },
  {
    id: "network", name: "UniFi", sub: "Gateway & WLAN", icon: "mdi:router-network",
    image: "/local/img/unifi.jpg",
    meters: [
      { entity: "sensor.u6_1_og_cpu_utilization", name: "CPU", icon: "mdi:cpu-64-bit", color: C.gold, warn: 70, crit: 90, ring: true, ...PCT },
      { entity: "sensor.u6_1_og_memory_utilization", name: "RAM", icon: "mdi:memory", color: C.violet, warn: 80, crit: 92, ring: true, ...PCT },
      { entity: "sensor.temperatur_server_temperatur", name: "Temp", icon: "mdi:thermometer", color: C.green, warn: 45, crit: 60, max: 100, unit: "°C", ring: true },
      { entity: "sensor.speedtest_download", name: "Download", icon: "mdi:download", color: C.cyan, max: 1000, unit: "Mbit/s" },
      { entity: "sensor.speedtest_upload", name: "Upload", icon: "mdi:upload", color: C.green, max: 100, unit: "Mbit/s" },
      { entity: "sensor.speedtest_ping", name: "Ping", icon: "mdi:speedometer", color: C.gold, max: 100, unit: "ms" },
    ],
    chips: [
      { entity: "sensor.ucg_ultra_state", name: "Status", icon: "mdi:lan-connect", ok: ["connected"], labels: { connected: "Verbunden" }, status: true },
      { entity: "update.ucg_ultra", name: "Update", icon: "mdi:update", ok: ["off"], labels: { off: "Aktuell", on: "Verfügbar" } },
      { entity: "sensor.ucg_ultra_uplink_mac", name: "Externe MAC", icon: "mdi:ethernet" },
      { entity: "sensor.ucg_ultra_uptime", name: "Uptime", icon: "mdi:clock-check-outline", format: "since" },
      { entity: "switch.nurmalebenwasgucken", name: "Gast-WLAN", icon: "mdi:wifi", toggle: true, labels: { on: "An", off: "Aus" } },
      { entity: "image.nurmalebenwasgucken_qr_code", name: "QR-Code", icon: "mdi:qrcode-scan", dialog: "qr", staticText: "Anzeigen" },
    ],
    chart: { hours: 96, series: [
      { entity: "sensor.speedtest_download", name: "Download", color: C.cyan },
      { entity: "sensor.speedtest_upload", name: "Upload", color: C.green },
      { entity: "sensor.speedtest_ping", name: "Ping", color: C.gold },
    ] },
    extras: [{ type: "rssi", entity: "sensor.rssi_werte_kleiner_90" }],
  },
  {
    id: "printer", parent: "nas", name: "HP LaserJet", sub: "Pro M404dn", icon: "mdi:printer",
    meters: [
      { entity: "sensor.hp_laserjet_pro_m404dn_192_168_178_67_black_toner_level_2", name: "Toner", icon: "mdi:water", color: C.green, invert: true, warn: 25, crit: 10, ring: true, ...PCT },
    ],
    chips: [
      { entity: "sensor.hp_laserjet_pro_m404dn_192_168_178_67_status_2", name: "Status", icon: "mdi:printer-check", status: true },
      { entity: "binary_sensor.hp_laserjet_pro_m404dn_192_168_178_67_eprint_status_2", name: "ePrint", icon: "mdi:network-outline", ok: ["on"], labels: { on: "Online", off: "Offline" } },
      { entity: "sensor.hp_laserjet_pro_m404dn_192_168_178_67_printer_gesamtseiten_2", name: "Gesamtseiten", icon: "mdi:file-document-multiple-outline", decimals: 0 },
      { entity: "sensor.hp_laserjet_pro_m404dn_192_168_178_67_black_toner_verbleibend_2", name: "Seiten übrig", icon: "mdi:water", low: { warn: 200, crit: 100 }, decimals: 0 },
    ],
  },
];

const ENTITY_DOMAINS = [
  ["automation", "Automatisierungen", C.gold], ["binary_sensor", "Binäre Sensoren", C.cyan],
  ["device_tracker", "Geräte-Tracker", C.violet], ["light", "Licht", C.orange],
  ["sensor", "Sensoren", C.green], ["switch", "Schalter", C.blue], ["other", "Rest", C.dim],
];

const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const fmtNum = (n, d = 0) => Number(n).toLocaleString("de-DE", { maximumFractionDigits: d, minimumFractionDigits: 0 });
const fmtDur = (ms) => {
  const m = Math.max(0, Math.floor(ms / 60000)), d = Math.floor(m / 1440), h = Math.floor((m % 1440) / 60), mi = m % 60;
  return d ? `${d} T ${h} Std` : h ? `${h} Std ${mi} Min` : `${mi} Min`;
};

class MgNetworkDashboard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._ui = { open: null, exp: {} };
    this._hist = {};
    this._histAt = 0;
    this._histBusy = false;
    this._sig = "";
    this.shadowRoot.innerHTML = `<style>${STYLE}</style><div id="root"></div>
      <dialog class="dlg" id="dlg"><div class="dpan"><div class="dhd"><div class="dico"><ha-icon id="dicon"></ha-icon></div>
      <div class="rtx"><div class="rname" id="dname"></div><div class="rsub" id="dsub"></div></div>
      <button class="dx" data-act="close" aria-label="Schließen"><ha-icon icon="mdi:close"></ha-icon></button></div>
      <div class="dbody" id="dbody"></div></div></dialog>`;
    const root = this.shadowRoot.getElementById("root");
    this.shadowRoot.addEventListener("click", (e) => this._click(e));
    this._root = root;
    this._dlg = this.shadowRoot.getElementById("dlg");
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

  // Desktop/Laptop: Karte passt sich der Fensterhöhe an, der Inhalt scrollt in der Karte
  _fit() {
    const wrap = this._root.querySelector(".wrap");
    if (!wrap) return;
    const on = this._cfg?.fit_screen && this.clientWidth > 1180;
    if (!on) { wrap.classList.remove("fit"); return; }
    const top = this.getBoundingClientRect().top + window.scrollY;
    wrap.style.setProperty("--fit-h", Math.max(560, Math.floor(window.innerHeight - top)) + "px");
    wrap.classList.add("fit");
  }

  // @font-face wirkt nicht im Shadow DOM, deshalb einmalig in den Seitenkopf (entfällt, wenn eine andere Karte „Outfit“ schon einbindet)
  _ensureFont(url) {
    const font = url || FONT_FILE;
    if (!font || ["mg-car-font", "mg-tablet-font", "glow-energy-font", "mg-rooms-font", "mg-network-font"].some((id) => document.getElementById(id))) return;
    const f = document.createElement("style");
    f.id = "mg-network-font";
    f.textContent = `@font-face{font-family:"Outfit";font-style:normal;font-display:swap;font-weight:100 900;src:url("${font}") format("woff2")}`;
    document.head.appendChild(f);
  }

  static getStubConfig() { return { variant: 1 }; }
  getCardSize() { return 14; }

  setConfig(config) {
    const cfg = config || {};
    let devices = Array.isArray(cfg.devices) ? cfg.devices : DEFAULT_DEVICES;
    const hide = cfg.hide || [];
    devices = devices.filter((d) => !hide.includes(d.id));
    this._cfg = {
      title: cfg.title ?? "",
      fit_screen: cfg.fit_screen !== false,
      tabs: !!cfg.tabs,
      variant: [2, "2", "b", "B"].includes(cfg.variant) ? 2 : 1,
      internet: cfg.internet || { download: "sensor.speedtest_download", upload: "sensor.speedtest_upload", ping: "sensor.speedtest_ping" },
      offline: cfg.offline_entity ?? "sensor.unavailable_entities",
      devices,
    };
    this._sig = "";
    this._ui = { open: devices[0]?.id ?? null, exp: {} };
    this._ensureFont(cfg.font_url);
    if (this._tab == null || !(this._tab === "all" || devices.some((d) => d.id === this._tab))) {
      let saved = null;
      try { saved = cfg.remember_tab === false ? null : localStorage.getItem("mg-network-tab"); } catch (e) { /* ohne Speicher */ }
      this._tab = saved === "all" || devices.some((d) => d.id === saved) ? saved : "all";
    }
    if (this._hass) this._render();
  }

  set hass(hass) {
    this._hass = hass;
    if (!this._cfg) return;
    const ids = this._ids();
    const sig = ids.map((id) => hass.states[id]?.state).join("|") + "#" + Math.floor(Date.now() / 60000) +
      "#" + (this._cfg.offline && hass.states[this._cfg.offline]?.state) + "#" + this._histAt;
    if (sig !== this._sig) { this._sig = sig; this._render(); }
    if (Date.now() - this._histAt > 15 * 60000) this._loadHist();
  }

  _ids() {
    const ids = [this._cfg.offline];
    Object.values(this._cfg.internet).forEach((e) => ids.push(e));
    for (const d of this._cfg.devices) {
      (d.meters || []).forEach((m) => ids.push(m.entity));
      (d.chips || []).forEach((c) => ids.push(c.entity));
      (d.extras || []).forEach((x) => ids.push(x.entity));
    }
    return ids.filter(Boolean);
  }

  // ---- Daten ---------------------------------------------------------------
  _st(id) { return this._hass?.states?.[id]; }
  _num(id) { const s = this._st(id); if (!s) return null; const n = parseFloat(s.state); return Number.isFinite(n) ? n : null; }
  _unit(m) { return m.unit ?? this._st(m.entity)?.attributes?.unit_of_measurement ?? ""; }
  _fmt(s, dec) {
    const n = parseFloat(s.state);
    if (Number.isFinite(n) && /^-?[\d.]+$/.test(String(s.state).trim())) {
      const u = s.attributes?.unit_of_measurement;
      return fmtNum(n, dec ?? 1) + (u ? ` ${u}` : "");
    }
    if (dec === undefined && this._hass?.formatEntityState) { try { return this._hass.formatEntityState(s); } catch (e) { /* weiter */ } }
    return s.state;
  }

  _tone(m, v) {
    if (v == null) return C.dim;
    if (m.invert) return m.crit != null && v <= m.crit ? C.red : m.warn != null && v <= m.warn ? C.orange : m.color;
    return m.crit != null && v >= m.crit ? C.red : m.warn != null && v >= m.warn ? C.orange : m.color;
  }

  _chipVal(c) {
    const s = this._st(c.entity);
    if (!s) return { txt: "–", tone: "na" };
    const raw = s.state;
    if (raw === "unavailable" || raw === "unknown") return { txt: "n/v", tone: c.ok || c.status ? "bad" : "na" };
    let txt;
    if (c.staticText) txt = c.staticText;
    else if (c.labels && c.labels[raw] != null) txt = c.labels[raw];
    else if (c.format === "since" || c.format === "ago") {
      const t = Date.parse(raw);
      if (!isNaN(t) && !/^\d+(\.\d+)?$/.test(raw)) txt = (c.format === "ago" ? "vor " : "") + fmtDur(Date.now() - t);
      else if (c.format === "since" && Number.isFinite(+raw) && s.attributes?.unit_of_measurement === "s") txt = fmtDur(+raw * 1000);
      else txt = this._fmt(s, c.decimals);
    } else txt = this._fmt(s, c.decimals);
    let tone = "neutral";
    if (c.ok) tone = c.ok.includes(raw) ? "ok" : "bad";
    else if (c.low) { const n = parseFloat(raw); tone = !Number.isFinite(n) ? "na" : n <= c.low.crit ? "bad" : n <= c.low.warn ? "warn" : "ok"; }
    else if (c.toggle) tone = raw === "on" ? "ok" : "off";
    return { txt, tone };
  }

  _problems() {
    const out = [];
    const off = this._num(this._cfg.offline);
    if (off > 0) out.push({ txt: `${fmtNum(off)} Sensoren offline`, e: this._cfg.offline });
    for (const d of this._cfg.devices) {
      for (const c of d.chips || []) {
        const t = this._chipVal(c).tone;
        if (t === "bad" || t === "warn") out.push({ txt: `${d.name}: ${c.name}`, e: c.entity, warn: t === "warn" });
      }
      for (const m of d.meters || []) {
        const v = this._num(m.entity);
        if (v != null && this._tone(m, v) === C.red) out.push({ txt: `${d.name}: ${m.name} kritisch`, e: m.entity });
      }
    }
    return out;
  }

  async _loadHist() {
    if (this._histBusy || !this._hass?.callWS) return;
    const ids = [...new Set(this._cfg.devices.flatMap((d) => (d.chart?.series || []).map((s) => s.entity)))];
    if (!ids.length) return;
    this._histBusy = true;
    const hours = Math.max(...this._cfg.devices.map((d) => d.chart?.hours || 0), 24);
    const end = new Date(), start = new Date(end - hours * 3600000), N = 120, step = (hours * 3600000) / N;
    try {
      const res = await this._hass.callWS({
        type: "history/history_during_period", start_time: start.toISOString(), end_time: end.toISOString(),
        entity_ids: ids, include_start_time_state: true, significant_changes_only: false, minimal_response: true, no_attributes: true,
      });
      const hist = {};
      for (const id of ids) {
        const sum = new Array(N).fill(0), cnt = new Array(N).fill(0);
        for (const x of res[id] || []) {
          const t = x.lu != null ? x.lu * 1000 : x.lc != null ? x.lc * 1000 : Date.parse(x.last_updated);
          const v = parseFloat(x.s ?? x.state);
          if (!Number.isFinite(t) || !Number.isFinite(v)) continue;
          const i = Math.min(N - 1, Math.max(0, Math.floor((t - +start) / step)));
          sum[i] += v; cnt[i]++;
        }
        let last = null;
        hist[id] = sum.map((s, i) => (cnt[i] ? (last = s / cnt[i]) : last));
      }
      this._hist = hist;
    } catch (e) { this._hist = {}; }
    this._histAt = Date.now();
    this._histBusy = false;
    this._sig = "";
    this.hass = this._hass;
  }

  // ---- Bausteine -----------------------------------------------------------
  _meter(m, plain) {
    const v = this._num(m.entity), max = m.max || 100;
    const p = v == null ? 0 : Math.max(0, Math.min(100, (v / max) * 100));
    const col = this._tone(m, v);
    const tag = plain ? "div" : "button", at = plain ? "" : ` data-act="more" data-e="${esc(m.entity)}"`;
    return `<${tag} class="mt${plain ? " plain" : ""}"${at}>
      <ha-icon icon="${esc(m.icon || "mdi:gauge")}"></ha-icon><span class="mn">${esc(m.name)}</span>
      <span class="mbar"><span style="width:${p.toFixed(1)}%;background:${col};box-shadow:0 0 10px ${col}66"></span></span>
      <b>${v == null ? "–" : fmtNum(v, m.decimals ?? 0)}<small>${esc(this._unit(m))}</small></b></${tag}>`;
  }

  _ring(m) {
    const v = this._num(m.entity), max = m.max || 100, R = 22, L = 2 * Math.PI * R;
    const p = v == null ? 0 : Math.max(0, Math.min(1, v / max)), col = this._tone(m, v);
    return `<button class="ring" data-act="more" data-e="${esc(m.entity)}">
      <span class="rg"><svg viewBox="0 0 56 56"><circle class="rgt" cx="28" cy="28" r="${R}"/>
      <circle class="rgv" cx="28" cy="28" r="${R}" stroke="${col}" stroke-dasharray="${(p * L).toFixed(1)} ${L.toFixed(1)}" transform="rotate(-90 28 28)"/></svg>
      <b>${v == null ? "–" : fmtNum(v, m.decimals ?? 0)}<small>${esc(this._unit(m))}</small></b></span><i>${esc(m.name)}</i></button>`;
  }

  _chip(c) {
    const { txt, tone } = this._chipVal(c);
    const act = c.toggle ? "toggle" : c.dialog === "qr" ? "qr" : "more";
    return `<button class="chip2 t-${tone}" data-act="${act}" data-e="${esc(c.entity)}">
      <span class="ci"><ha-icon icon="${esc(c.icon || "mdi:information-outline")}"></ha-icon></span>
      <span class="ct"><i>${esc(c.name)}</i><b>${esc(txt)}</b></span></button>`;
  }

  _chart(d) {
    const ch = d.chart;
    if (!ch) return "";
    const W = 300, H = 84, ser = ch.series || [];
    let paths = "", legend = "";
    ser.forEach((s, k) => {
      const arr = this._hist[s.entity];
      const now = this._num(s.entity);
      legend += `<span><i style="background:${s.color}"></i>${esc(s.name)} <b>${now == null ? "–" : fmtNum(now, 1)}</b></span>`;
      if (!arr) return;
      const vals = arr.filter((v) => v != null);
      if (vals.length < 2) return;
      let lo = s.min ?? Math.min(...vals), hi = s.max ?? Math.max(...vals);
      if (hi === lo) { hi += 1; lo -= 1; }
      const n = arr.length, pts = [];
      arr.forEach((v, i) => { if (v != null) pts.push([(i / (n - 1)) * W, H - 4 - ((v - lo) / (hi - lo)) * (H - 12)]); });
      const line = pts.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join("");
      const gid = `g-${d.id}-${k}`;
      paths += `<defs><linearGradient id="${gid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${s.color}" stop-opacity=".28"/><stop offset="1" stop-color="${s.color}" stop-opacity="0"/></linearGradient></defs>
        <path d="${line}L${pts[pts.length - 1][0].toFixed(1)} ${H}L${pts[0][0].toFixed(1)} ${H}Z" fill="url(#${gid})"/>
        <path d="${line}" fill="none" stroke="${s.color}" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round" vector-effect="non-scaling-stroke"/>`;
    });
    const span = ch.hours >= 48 ? `${Math.round(ch.hours / 24)} Tage` : `${ch.hours} Std`;
    const body = this._histAt && paths ? `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none">${paths}</svg>`
      : `<div class="empty">${this._histAt ? "Verlauf nicht verfügbar" : "Verlauf wird geladen …"}</div>`;
    return `<div class="chart"><div class="cv">${body}</div>
      <div class="cax"><span>vor ${span}</span><span>jetzt</span></div><div class="clg">${legend}</div></div>`;
  }

  _extra(d, x) {
    if (x.type === "rssi") {
      const n = this._num(x.entity);
      const icon = n == null ? "mdi:signal-off" : n > 4 ? "mdi:signal-cellular-outline" : n > 0 ? "mdi:signal-cellular-2" : "mdi:signal-cellular-3";
      const col = n == null ? C.dim : n > 4 ? C.red : n > 0 ? C.orange : C.green;
      const txt = n == null ? "–" : n > 0 ? `${fmtNum(n)} Geräte schwach` : "Alles top";
      return `<button class="xrow" data-act="rssi" style="--xc:${col}"><span class="xi"><ha-icon icon="${icon}"></ha-icon></span>
        <span class="xt"><i>Signalstärke</i><b>${txt}</b></span><ha-icon class="xa" icon="mdi:chevron-right"></ha-icon></button>`;
    }
    if (x.type === "entities") {
      const s = this._st(x.entity);
      const open = !!this._ui.exp[`${d.id}-ent`];
      const head = `<button class="xrow" data-act="exp" data-k="${d.id}-ent" style="--xc:${C.cyan}"><span class="xi"><ha-icon icon="mdi:shape-outline"></ha-icon></span>
        <span class="xt"><i>Entitäten</i><b>${s ? fmtNum(ENTITY_DOMAINS.reduce((a, [k]) => a + (+s.attributes?.[k] || 0), 0)) : "–"}</b></span>
        <ha-icon class="xa" icon="mdi:chevron-${open ? "up" : "down"}"></ha-icon></button>`;
      if (!open || !s) return head;
      const parts = ENTITY_DOMAINS.map(([k, name, col]) => ({ name, col, v: +s.attributes?.[k] || 0 })).filter((p) => p.v > 0);
      const total = parts.reduce((a, p) => a + p.v, 0) || 1, R = 38, L = 2 * Math.PI * R;
      let off = 0, segs = "";
      parts.forEach((p) => {
        const len = (p.v / total) * L;
        segs += `<circle cx="50" cy="50" r="${R}" fill="none" stroke="${p.col}" stroke-width="12" stroke-dasharray="${Math.max(0, len - 1.5).toFixed(1)} ${L.toFixed(1)}" stroke-dashoffset="${(-off).toFixed(1)}" transform="rotate(-90 50 50)"/>`;
        off += len;
      });
      return head + `<div class="donut"><svg viewBox="0 0 100 100">${segs}<text x="50" y="52" text-anchor="middle" class="dt">${fmtNum(total)}</text></svg>
        <div class="dlg2">${parts.map((p) => `<span><i style="background:${p.col}"></i>${esc(p.name)}<b>${fmtNum(p.v)}</b></span>`).join("")}</div></div>`;
    }
    return "";
  }

  _devStatus(d) {
    const c = (d.chips || []).find((x) => x.status);
    if (!c) return { tone: "na", txt: "" };
    const v = this._chipVal(c);
    return { tone: v.tone, txt: v.txt };
  }

  _avatar(d) {
    return `<div class="av"><ha-icon icon="${esc(d.icon || "mdi:server")}"></ha-icon>${d.image ? `<img src="${esc(d.image)}" alt="" onerror="this.remove()">` : ""}</div>`;
  }

  _body(d) {
    const meters = (d.meters || []).map((m) => this._meter(m)).join("");
    const chips = (d.chips || []).map((c) => this._chip(c)).join("");
    const extras = (d.extras || []).map((x) => this._extra(d, x)).join("");
    return `${meters ? `<div class="meters">${meters}</div>` : ""}${chips ? `<div class="chips">${chips}</div>` : ""}${this._chart(d)}${extras ? `<div class="extras">${extras}</div>` : ""}`;
  }

  _devBad(d) {
    return (d.chips || []).some((c) => ["bad", "warn"].includes(this._chipVal(c).tone))
      || (d.meters || []).some((m) => { const v = this._num(m.entity); return v != null && this._tone(m, v) === C.red; });
  }

  // ---- Kopfzeile: Reiter + Hinweis-Chips (wie bei den Räumen) -------------------
  _tabs() {
    const tabs = [["all", "mdi:lan", "Alle"], ...this._cfg.devices.map((d) => [d.id, d.icon, d.short || d.name])];
    return tabs.map(([id, ic, name]) => {
      const bad = id !== "all" && this._devBad(this._cfg.devices.find((d) => d.id === id));
      return `<button class="rtab ${this._tab === id ? "sel" : ""}" data-act="tab" data-v="${esc(id)}"><ha-icon icon="${esc(ic || "mdi:server")}"></ha-icon><span>${esc(name)}</span>${bad ? '<i class="tdot red"></i>' : ""}</button>`;
    }).join("");
  }

  _summary() {
    const p = this._problems(), I = this._cfg.internet;
    const chip = (c, i, t, e) => `<button class="sumchip" style="--c:${c}"${e ? ` data-act="more" data-e="${esc(e)}"` : ""}><ha-icon icon="${i}"></ha-icon>${t}</button>`;
    const out = [p.length ? chip(C.red, "mdi:alert-circle-outline", `${p.length} ${p.length === 1 ? "Hinweis" : "Hinweise"}`, p[0].e) : chip(C.green, "mdi:check-circle-outline", "Alles OK")];
    if (this._cfg.variant === 1) {
      const num = (e, u, ic, c) => { const v = this._num(e); if (v != null) out.push(chip(c, ic, `${fmtNum(v, 0)} ${u}`, e)); };
      num(I.download, "Mbit/s", "mdi:download", C.cyan); num(I.upload, "Mbit/s", "mdi:upload", C.green); num(I.ping, "ms", "mdi:speedometer", C.gold);
    }
    return out.join("");
  }

  // ---- Variante 1: drei Geräte nebeneinander wie in der alten Karte ---------------
  _panel(d, kids = []) {
    const st = this._devStatus(d);
    const photo = d.image ? `<div class="photo"><img src="${esc(d.image)}" alt="" onerror="this.parentNode.remove()"></div>` : "";
    const sub = kids.map((k) => `<div class="subp"><div class="subh"><ha-icon icon="${esc(k.icon || "mdi:printer")}"></ha-icon>${esc(k.name)}<span>${esc(k.sub || "")}</span></div>${this._body(k)}</div>`).join("");
    return `<section class="panel dev" id="p-${esc(d.id)}">
      <div class="hd">${this._avatar(d)}<div class="rtx"><div class="ttl">${esc(d.name)}</div><div class="rsub">${esc(d.sub || "")}</div></div>
      ${st.txt ? `<span class="pill t-${st.tone}"><i></i>${esc(st.txt)}</span>` : ""}</div>${photo}${this._body(d)}${sub}</section>`;
  }

  _v1(devs) {
    const all = this._cfg.devices;
    const top = devs.filter((d) => !d.parent || !all.some((x) => x.id === d.parent));
    return `<div class="grid3">${top.map((d) => `<div class="col">${this._panel(d, all.filter((k) => k.parent === d.id))}</div>`).join("")}</div>`;
  }

  // ---- Variante 2: Übersicht mit aufklappbaren Geräten --------------------------
  _v2(devs) {
    const I = this._cfg.internet;
    const kpi = (e, label, icon, col, max, dec) => {
      const v = this._num(e), s = this._st(e), u = s?.attributes?.unit_of_measurement || "";
      const p = v == null ? 0 : Math.min(100, (v / max) * 100);
      return `<button class="kpi" data-act="more" data-e="${esc(e)}" style="--kc:${col}"><span class="kl"><ha-icon icon="${icon}"></ha-icon>${label}</span>
        <b>${v == null ? "–" : fmtNum(v, dec)}<small>${esc(u)}</small></b><span class="kb"><span style="width:${p}%"></span></span></button>`;
    };
    const p = this._problems();
    const health = p.length
      ? `<div class="hl warn"><ha-icon icon="mdi:alert-circle-outline"></ha-icon><div><b>${p.length} ${p.length === 1 ? "Hinweis" : "Hinweise"}</b>
         <span class="plist">${p.slice(0, 5).map((x) => `<button data-act="more" data-e="${esc(x.e)}" class="${x.warn ? "w" : ""}">${esc(x.txt)}</button>`).join("")}</span></div></div>`
      : `<div class="hl ok"><ha-icon icon="mdi:check-circle-outline"></ha-icon><div><b>Alles in Ordnung</b><span class="hs">${this._cfg.devices.length} Geräte online</span></div></div>`;
    const hero = `<section class="panel hero"><div class="hd"><div class="ttl">Internet</div></div>
      <div class="kpis">${kpi(I.download, "Download", "mdi:download", C.cyan, 1000, 0)}${kpi(I.upload, "Upload", "mdi:upload", C.green, 100, 0)}${kpi(I.ping, "Ping", "mdi:speedometer", C.gold, 100, 0)}</div>${health}</section>`;
    const rows = devs.map((d) => {
      const st = this._devStatus(d), open = this._ui.open === d.id || devs.length === 1;
      const rings = (d.meters || []).filter((m) => m.ring).map((m) => this._ring(m)).join("");
      return `<section class="panel drow${open ? " open" : ""}"><button class="dh" data-act="open" data-k="${esc(d.id)}" aria-expanded="${open}">
        ${this._avatar(d)}<div class="rtx"><div class="ttl">${esc(d.name)}</div><div class="rsub">${esc(d.sub || "")}</div></div>
        ${st.txt ? `<span class="pill t-${st.tone}"><i></i>${esc(st.txt)}</span>` : ""}<ha-icon class="xa" icon="mdi:chevron-${open ? "up" : "down"}"></ha-icon></button>
        ${rings ? `<div class="rings">${rings}</div>` : ""}${open ? `<div class="dd">${this._body({ ...d, meters: (d.meters || []).filter((m) => !m.ring) })}</div>` : ""}</section>`;
    }).join("");
    return `<div class="v2">${this._tab === "all" ? hero : ""}<div class="rows${devs.length === 1 ? " one" : ""}">${rows}</div></div>`;
  }

  _render() {
    if (!this._cfg || !this._hass) return;
    const old = this._root.querySelector(".wrap");
    const sc = this._root.querySelector(".rbody")?.scrollTop || 0;
    const tabs = this._cfg.variant === 2 || this._cfg.tabs;
    if (!tabs) this._tab = "all";
    const devs = this._tab === "all" ? this._cfg.devices : this._cfg.devices.filter((d) => d.id === this._tab);
    const body = this._cfg.variant === 2 ? this._v2(devs) : this._v1(devs);
    this._root.innerHTML = `<div class="${(old?.className || "wrap").replace(/\s*big/, "")}${this._cfg.variant === 1 ? " big" : ""}" style="${old?.getAttribute("style") || ""}">
      ${this._cfg.title ? `<div class="top"><div class="ttl big">${esc(this._cfg.title)}</div></div>` : ""}
      <div class="rhead">${tabs ? `<div class="rtabs">${this._tabs()}</div>` : ""}<div class="csum">${this._summary()}</div></div>
      <div class="rbody">${body}</div></div>`;
    const nb = this._root.querySelector(".rbody");
    if (nb) nb.scrollTop = sc;
    requestAnimationFrame(() => this._fit());
  }

  // ---- Interaktion ---------------------------------------------------------------
  _click(e) {
    if (e.target === this._dlg) { this._dlg.close(); return; }
    const el = e.target.closest?.("[data-act]");
    if (!el) return;
    const act = el.dataset.act, ent = el.dataset.e;
    if (act === "more") this.dispatchEvent(new CustomEvent("hass-more-info", { detail: { entityId: ent }, bubbles: true, composed: true }));
    else if (act === "toggle") this._hass.callService("homeassistant", "toggle", { entity_id: ent });
    else if (act === "open") { this._ui.open = this._ui.open === el.dataset.k ? null : el.dataset.k; this._render(); }
    else if (act === "exp") { this._ui.exp[el.dataset.k] = !this._ui.exp[el.dataset.k]; this._render(); }
    else if (act === "close") this._dlg.close();
    else if (act === "tab") {
      this._tab = el.dataset.v;
      try { if (this._cfg.remember_tab !== false) localStorage.setItem("mg-network-tab", this._tab); } catch (x) { /* ohne Speicher */ }
      this._render();
    }
    else if (act === "qr") this._dialog("mdi:qrcode-scan", this._st(ent)?.attributes?.friendly_name || "QR-Code", "Zum Verbinden scannen",
      `<div class="qr">${this._st(ent)?.attributes?.entity_picture ? `<img src="${esc(this._st(ent).attributes.entity_picture)}" alt="QR-Code">` : '<div class="empty">Kein Bild verfügbar</div>'}</div>`);
    else if (act === "rssi") this._rssiDialog();
  }

  _dialog(icon, name, sub, html) {
    const r = this.shadowRoot;
    r.getElementById("dicon").setAttribute("icon", icon);
    r.getElementById("dname").textContent = name;
    r.getElementById("dsub").textContent = sub;
    r.getElementById("dbody").innerHTML = html;
    if (!this._dlg.open) this._dlg.showModal();
  }

  _rssiDialog() {
    const rows = Object.values(this._hass.states)
      .filter((s) => /rssi|signal_strength/.test(s.entity_id) && !/aarlo|rssi_werte/.test(s.entity_id) && Number.isFinite(parseFloat(s.state)))
      .map((s) => ({ id: s.entity_id, v: Math.abs(parseFloat(s.state)),
        name: (s.attributes.friendly_name || s.entity_id).replace(/\s*(rssi|signal strength)\s*/i, " ").trim() }))
      .sort((a, b) => b.v - a.v);
    const col = (v) => (v > 90 ? C.red : v > 70 ? C.orange : v > 50 ? C.gold : C.green);
    const html = rows.length ? rows.map((r) => `<button class="mt" data-act="more" data-e="${esc(r.id)}"><ha-icon icon="mdi:signal-cellular-${r.v > 90 ? "outline" : r.v > 70 ? 1 : r.v > 50 ? 2 : 3}"></ha-icon>
      <span class="mn wide">${esc(r.name)}</span><span class="mbar"><span style="width:${Math.max(4, Math.min(100, 100 - (r.v - 30) * 1.4))}%;background:${col(r.v)}"></span></span><b>−${r.v}<small>dBm</small></b></button>`).join("")
      : `<div class="empty">Keine RSSI-Sensoren gefunden</div>`;
    this._dialog("mdi:signal", "Signalstärke", `${rows.length} Geräte, schwächste zuerst`, `<div class="meters">${html}</div>`);
  }
}

const STYLE = `
:host{
  --bg:#0b0d12; --panel:#14171e; --line:rgba(255,255,255,.065); --tile:rgba(255,255,255,.032); --tileb:rgba(255,255,255,.07);
  --text:#f3f5f9; --muted:#8b91a1; --dim:#5d6373;
  --gold:#f7b733; --cyan:#38bdf8; --green:#34d399; --violet:#a78bfa; --orange:#fb923c; --red:#f87171; --blue:#60a5fa;
  display:block; container-type:inline-size;
  font-family:'Outfit','Plus Jakarta Sans','Segoe UI',system-ui,sans-serif; color:var(--text); -webkit-font-smoothing:antialiased;
}
*{box-sizing:border-box}
button{font:inherit;color:inherit;background:none;border:0;padding:0;cursor:pointer;text-align:left}
button:focus-visible{outline:2px solid var(--cyan);outline-offset:2px}
ha-icon{--mdc-icon-size:20px;display:inline-flex}
.wrap{background:var(--bg);padding:18px 22px 24px;border-radius:var(--ha-card-border-radius,12px)}
.top{display:flex;align-items:center;margin-bottom:14px;min-height:30px}
.ttl{font-size:15px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:var(--muted);white-space:nowrap}
.ttl.big{font-size:18px;color:var(--text)}
.rsub{font-size:13px;color:var(--muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.rtx{flex:1;min-width:0;display:flex;flex-direction:column}
.empty{color:var(--dim);font-size:14px;padding:12px 2px}
.panel{background:linear-gradient(180deg,#161920,#12151b);border:1px solid var(--line);border-radius:30px;padding:20px 22px;position:relative;overflow:hidden}
.hd{display:flex;align-items:center;gap:12px;min-height:44px;margin-bottom:14px}
.grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:20px;align-items:start}
.col{display:flex;flex-direction:column;gap:20px;min-width:0}

/* Symbol / Bild */
.av{position:relative;width:46px;height:46px;border-radius:16px;flex:none;display:grid;place-items:center;overflow:hidden;
  background:rgba(56,189,248,.12);color:var(--cyan);border:1px solid rgba(56,189,248,.22)}
.av img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:.9}
.pill{display:inline-flex;align-items:center;gap:7px;height:30px;padding:0 12px;border-radius:12px;font-size:13.5px;font-weight:600;
  background:rgba(255,255,255,.05);border:1px solid var(--line);color:var(--muted);white-space:nowrap;flex:none}
.pill i{width:8px;height:8px;border-radius:50%;background:currentColor}
.pill.t-ok{color:var(--green);background:rgba(52,211,153,.1);border-color:rgba(52,211,153,.3)}
.pill.t-bad{color:var(--red);background:rgba(248,113,113,.1);border-color:rgba(248,113,113,.35)}
.pill.t-bad i{animation:blink 1.6s ease infinite}
.pill.t-warn{color:var(--orange);background:rgba(251,146,60,.1);border-color:rgba(251,146,60,.3)}

/* Hinweisleiste */
.banner{display:flex;align-items:center;flex-wrap:wrap;gap:6px 12px;padding:12px 18px;border-radius:20px;margin-bottom:20px;border:1px solid var(--line);font-size:14.5px}
.banner b{font-weight:600}.banner span{color:var(--muted)}
.banner.ok{background:rgba(52,211,153,.07);border-color:rgba(52,211,153,.25)}.banner.ok ha-icon,.banner.ok b{color:var(--green)}
.banner.warn{background:rgba(248,113,113,.07);border-color:rgba(248,113,113,.3)}.banner.warn ha-icon,.banner.warn b{color:var(--red)}
.plist{display:inline-flex;flex-wrap:wrap;gap:6px}
.plist button{padding:4px 11px;border-radius:11px;background:rgba(248,113,113,.12);border:1px solid rgba(248,113,113,.3);color:var(--red);font-size:13px;font-weight:600}
.plist button.w{background:rgba(251,146,60,.12);border-color:rgba(251,146,60,.3);color:var(--orange)}

/* Balken */
.meters{display:flex;flex-direction:column;gap:4px;margin-bottom:14px}
.mt{display:grid;grid-template-columns:22px 78px minmax(0,1fr) auto;align-items:center;gap:10px;padding:6px 4px;border-radius:12px;min-height:34px}
.mt:hover{background:rgba(255,255,255,.03)}
.mt ha-icon{--mdc-icon-size:18px;color:var(--dim)}
.mn{font-size:13.5px;font-weight:600;color:var(--muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.mn.wide{grid-column:auto}
.mbar{height:10px;border-radius:6px;background:rgba(255,255,255,.07);overflow:hidden}
.mbar span{display:block;height:100%;border-radius:6px;transition:width .6s}
.mt b{font-size:14.5px;font-weight:700;font-variant-numeric:tabular-nums;text-align:right;min-width:62px;white-space:nowrap}
.mt small{font-size:11.5px;color:var(--muted);font-weight:500;margin-left:3px}

/* Status-Kacheln */
.chips{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin-bottom:14px}
.chip2{display:flex;align-items:center;gap:10px;padding:9px 11px;border-radius:16px;background:var(--tile);border:1px solid var(--tileb);min-width:0}
.chip2:hover{background:rgba(255,255,255,.055)}
.ci{width:34px;height:34px;border-radius:50%;flex:none;display:grid;place-items:center;background:rgba(255,255,255,.07);color:var(--muted)}
.ci ha-icon{--mdc-icon-size:18px}
.ct{display:flex;flex-direction:column;min-width:0}
.ct i{font-style:normal;font-size:11.5px;letter-spacing:.05em;text-transform:uppercase;font-weight:600;color:var(--muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ct b{font-size:15px;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-variant-numeric:tabular-nums}
.t-ok .ci{background:rgba(52,211,153,.16);color:var(--green)}
.t-warn .ci{background:rgba(251,146,60,.16);color:var(--orange)}.t-warn .ct b{color:var(--orange)}
.t-bad .ci{background:rgba(248,113,113,.16);color:var(--red);animation:blink 1.8s ease infinite}.t-bad .ct b{color:var(--red)}
.t-off .ci{background:rgba(255,255,255,.05);color:var(--dim)}.t-off .ct b{color:var(--muted)}
@keyframes blink{50%{opacity:.45}}

/* Verlauf */
.chart{margin:2px 0 12px;padding:10px 12px 8px;border-radius:18px;background:var(--tile);border:1px solid var(--tileb)}
.cv{height:84px}.cv svg{width:100%;height:100%;display:block}
.cax{display:flex;justify-content:space-between;font-size:11px;color:var(--dim);margin:2px 0 6px}
.clg{display:flex;flex-wrap:wrap;gap:4px 14px;font-size:12.5px;color:var(--muted)}
.clg span{display:inline-flex;align-items:center;gap:6px}.clg i{width:9px;height:9px;border-radius:3px}
.clg b{color:var(--text);font-variant-numeric:tabular-nums}

/* Zusatzzeilen */
.extras{display:flex;flex-direction:column;gap:8px}
.xrow{display:flex;align-items:center;gap:12px;padding:9px 12px;border-radius:16px;background:var(--tile);border:1px solid var(--tileb);width:100%}
.xrow:hover{background:rgba(255,255,255,.055)}
.xi{width:34px;height:34px;border-radius:50%;display:grid;place-items:center;background:color-mix(in srgb,var(--xc) 18%,transparent);color:var(--xc);flex:none}
.xt{flex:1;display:flex;flex-direction:column;min-width:0}
.xt i{font-style:normal;font-size:11.5px;letter-spacing:.05em;text-transform:uppercase;font-weight:600;color:var(--muted)}
.xt b{font-size:15px;font-weight:700}
.xa{color:var(--dim)}
.donut{display:flex;align-items:center;gap:16px;padding:12px 8px 4px}
.donut svg{width:112px;height:112px;flex:none}
.dt{fill:var(--text);font-size:18px;font-weight:700}
.dlg2{display:flex;flex-direction:column;gap:4px;font-size:13px;color:var(--muted);flex:1;min-width:0}
.dlg2 span{display:flex;align-items:center;gap:8px}.dlg2 i{width:9px;height:9px;border-radius:3px;flex:none}
.dlg2 b{margin-left:auto;color:var(--text);font-variant-numeric:tabular-nums}

/* Variante 2 */
.v2{display:flex;flex-direction:column;gap:20px}
.kpis{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;margin-bottom:14px}
.kpi{display:flex;flex-direction:column;gap:6px;padding:14px 16px;border-radius:20px;background:var(--tile);border:1px solid var(--tileb)}
.kl{display:flex;align-items:center;gap:8px;font-size:12px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:var(--muted)}
.kl ha-icon{--mdc-icon-size:17px;color:var(--kc)}
.kpi b{font-size:38px;font-weight:800;line-height:1.05;letter-spacing:-.02em;font-variant-numeric:tabular-nums}
.kpi small{font-size:14px;font-weight:600;color:var(--muted);margin-left:5px;letter-spacing:0}
.kb{height:6px;border-radius:4px;background:rgba(255,255,255,.07);overflow:hidden}
.kb span{display:block;height:100%;border-radius:4px;background:var(--kc);box-shadow:0 0 10px var(--kc)}
.hl{display:flex;align-items:center;gap:12px;padding:12px 16px;border-radius:18px;border:1px solid var(--line)}
.hl>div{display:flex;flex-direction:column;gap:6px}.hl b{font-weight:600;font-size:15px}.hs{font-size:13px;color:var(--muted)}
.hl.ok{background:rgba(52,211,153,.07);border-color:rgba(52,211,153,.25)}.hl.ok ha-icon,.hl.ok b{color:var(--green)}
.hl.warn{background:rgba(248,113,113,.07);border-color:rgba(248,113,113,.3)}.hl.warn ha-icon,.hl.warn b{color:var(--red)}
.rows{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:20px;align-items:start}
.drow{padding:0}
.dh{display:flex;align-items:center;gap:12px;width:100%;padding:18px 22px}
.dh:hover{background:rgba(255,255,255,.02)}
.rings{display:flex;gap:6px;padding:0 22px 18px;justify-content:space-around}
.ring{display:flex;flex-direction:column;align-items:center;gap:6px;padding:4px 8px;border-radius:14px}
.ring:hover{background:rgba(255,255,255,.03)}
.rg{position:relative;width:76px;height:76px;display:grid;place-items:center}
.rg svg{position:absolute;inset:0;width:100%;height:100%}
.rgt{fill:none;stroke:rgba(255,255,255,.07);stroke-width:5}
.rgv{fill:none;stroke-width:5;stroke-linecap:round;filter:drop-shadow(0 0 4px currentColor);transition:stroke-dasharray .6s}
.rg b{position:relative;font-size:17px;font-weight:700;font-variant-numeric:tabular-nums}
.rg small{font-size:10.5px;color:var(--muted);margin-left:1px;font-weight:500}
.ring i{font-style:normal;font-size:12px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:var(--muted)}
.dd{padding:6px 22px 20px;border-top:1px solid var(--line);margin-top:2px;padding-top:16px}

/* Kopfzeile: Reiter + Chips */
.rhead{display:flex;align-items:center;gap:14px;margin:0 2px 16px;flex-wrap:wrap}
.rtabs{display:flex;gap:4px;background:rgba(255,255,255,.03);border:1px solid var(--line);border-radius:18px;padding:4px;flex-wrap:wrap}
.rtab{position:relative;height:40px;padding:0 16px 0 13px;border-radius:14px;display:flex;align-items:center;gap:8px;font-size:15px;font-weight:600;color:var(--muted);white-space:nowrap}
.rtab ha-icon{--mdc-icon-size:18px}
.rtab:hover{color:var(--text)}
.rtab.sel{background:rgba(255,255,255,.08);color:var(--text)}
.rtab.sel ha-icon{color:var(--gold)}
.tdot{position:absolute;top:8px;right:7px;width:6px;height:6px;border-radius:50%;background:var(--gold);box-shadow:0 0 8px var(--gold)}
.tdot.red{background:var(--red);box-shadow:0 0 8px var(--red)}
.csum{display:flex;gap:8px;flex-wrap:wrap;margin-left:auto}
.sumchip{display:inline-flex;align-items:center;gap:7px;padding:6px 13px;border-radius:14px;background:color-mix(in srgb,var(--c) 10%,transparent);border:1px solid color-mix(in srgb,var(--c) 25%,transparent);font-size:14px;font-weight:600;color:var(--c)}
.sumchip ha-icon{--mdc-icon-size:16px}

/* Kacheln (Variante 1) */
.rgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(400px,1fr));gap:16px}
.v1one{max-width:620px}
.rt{container-type:inline-size;position:relative;border-radius:26px;background:linear-gradient(180deg,#161920,#12151b);border:1px solid var(--line);padding:16px 16px 14px;display:flex;flex-direction:column;gap:12px;cursor:pointer;min-width:0;transition:border-color .25s,box-shadow .25s}
.rt:hover{border-color:rgba(255,255,255,.12)}
.rt.alert{border-color:rgba(248,113,113,.65);box-shadow:0 0 24px rgba(248,113,113,.16)}
.rtop{display:flex;align-items:center;gap:14px;min-width:0}
.rico{width:52px;height:52px;border-radius:17px;background:rgba(56,189,248,.12);display:grid;place-items:center;color:var(--cyan);flex:none}
.rico ha-icon{--mdc-icon-size:28px}
.rt.alert .rico{color:var(--red);background:rgba(248,113,113,.12)}
.rname{font-size:18px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.rt .rsub{display:flex;align-items:center;gap:7px;font-size:13.5px;overflow:hidden;font-variant-numeric:tabular-nums}
.rt .rsub b{color:rgba(243,245,249,.9);font-weight:600}
.rsub .dot{width:3px;height:3px;border-radius:50%;background:var(--dim);flex:none}
.rgo{color:var(--dim);flex:none;display:grid;place-items:center}
.rt:hover .rgo{color:var(--text)}
.meters.tm{margin:0;gap:2px}
.mt.plain{cursor:inherit}.mt.plain:hover{background:none}
.rsens{display:flex;gap:6px;flex-wrap:wrap}
.sc{height:30px;min-width:34px;padding:0 8px;border-radius:10px;display:inline-flex;align-items:center;justify-content:center;gap:5px;background:rgba(255,255,255,.035);color:var(--dim);font-size:12.5px;font-weight:700}
.sc ha-icon{--mdc-icon-size:17px}
.sc.soft{color:color-mix(in srgb,var(--cc) 80%,transparent)}
.sc.on{color:var(--cc);background:color-mix(in srgb,var(--cc) 14%,transparent);box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--cc) 30%,transparent)}
.sc.al{color:#0f1116;background:var(--cc);box-shadow:0 0 14px color-mix(in srgb,var(--cc) 55%,transparent)}
.sc.na{opacity:.45}
.rctl{display:flex;gap:8px;flex-wrap:wrap}
.cb{display:inline-flex;align-items:center;gap:8px;height:42px;padding:0 14px 0 12px;border-radius:15px;background:rgba(255,255,255,.045);border:1px solid var(--line);font-size:14px;font-weight:600;color:var(--muted);min-width:0;max-width:100%}
.cb span{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.cb ha-icon{--mdc-icon-size:20px;flex:none}
.cb:hover{background:rgba(255,255,255,.07);color:var(--text)}
.cb.on{background:color-mix(in srgb,var(--cc) 17%,transparent);border-color:color-mix(in srgb,var(--cc) 55%,transparent);color:var(--text)}
.cb.on ha-icon{color:var(--cc)}
.rows.one{grid-template-columns:1fr;max-width:760px}

/* Variante 1: groß, drei Spalten */
.grid3{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:20px;align-items:start}
.big .panel{padding:24px}
.big .hd{min-height:64px;gap:16px;margin-bottom:16px}
.big .av{width:60px;height:60px;border-radius:20px}.big .av ha-icon{--mdc-icon-size:30px}
.big .ttl{font-size:19px}.big .rsub{font-size:15px}
.big .pill{height:36px;font-size:15px;padding:0 14px}
.photo{height:150px;margin:0 0 18px;border-radius:22px;background:radial-gradient(90% 90% at 50% 40%,rgba(255,255,255,.07),rgba(255,255,255,.015));border:1px solid var(--line);display:grid;place-items:center;overflow:hidden}
.photo img{max-width:92%;max-height:92%;object-fit:contain;filter:drop-shadow(0 8px 14px rgba(0,0,0,.5))}
.big .meters{gap:6px;margin-bottom:18px}
.big .mt{grid-template-columns:26px 92px minmax(0,1fr) auto;min-height:46px;gap:12px}
.big .mt ha-icon{--mdc-icon-size:22px}.big .mn{font-size:16px}
.big .mbar{height:14px;border-radius:8px}.big .mbar span{border-radius:8px}
.big .mt b{font-size:18px;min-width:90px}.big .mt small{font-size:13px}
.big .chips{gap:10px;margin-bottom:18px}
.big .chip2{padding:12px 14px;border-radius:20px;gap:12px}
.big .ci{width:42px;height:42px}.big .ci ha-icon{--mdc-icon-size:22px}
.big .ct i{font-size:12.5px}.big .ct b{font-size:17px}
.big .chart{padding:14px 16px 10px;border-radius:22px}.big .cv{height:130px}
.big .cax{font-size:12px}.big .clg{font-size:14px}
.big .xrow{padding:12px 14px}.big .xi{width:40px;height:40px}.big .xt i{font-size:12.5px}.big .xt b{font-size:17px}
.subp{margin-top:22px;padding-top:20px;border-top:1px solid var(--line)}
.subh{display:flex;align-items:center;gap:10px;font-size:15px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:var(--muted);margin-bottom:16px}
.subh span{margin-left:auto;font-size:13px;letter-spacing:0;text-transform:none;font-weight:500;color:var(--dim)}
@container (max-width:1000px){.grid3{grid-template-columns:1fr}}

/* Fensterhöhe (fit_screen) */
.wrap.fit{height:var(--fit-h);min-height:0;display:flex;flex-direction:column;overflow:hidden;padding-top:12px;padding-bottom:14px}
.wrap.fit .rhead{flex:none}
.wrap.fit .rbody{flex:1;min-height:0;overflow-y:auto;overscroll-behavior:contain;scrollbar-width:thin;scrollbar-color:rgba(255,255,255,.15) transparent;padding-right:4px;margin-right:-6px}

/* Fenster */
.dlg{outline:none;padding:0;border:0;background:transparent;max-width:min(560px,calc(100vw - 32px));width:100%;max-height:calc(100vh - 48px);overflow:visible;color:var(--text);font-family:inherit}
.dlg::backdrop{background:rgba(5,6,9,.62);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px)}
.dpan{background:linear-gradient(180deg,#171a21,#111419);border:1px solid rgba(255,255,255,.09);border-radius:30px;box-shadow:0 30px 80px rgba(0,0,0,.6);display:flex;flex-direction:column;max-height:calc(100vh - 48px);overflow:hidden}
.dhd{display:flex;align-items:center;gap:14px;padding:18px 20px;border-bottom:1px solid var(--line)}
.dico{width:48px;height:48px;border-radius:16px;display:grid;place-items:center;background:rgba(56,189,248,.14);color:var(--cyan)}
.rname{font-size:20px;font-weight:600}
.dx{width:44px;height:44px;border-radius:15px;background:rgba(255,255,255,.06);border:1px solid var(--line);display:grid;place-items:center}
.dbody{overflow:auto;padding:16px 20px 22px}
.qr{display:grid;place-items:center;padding:8px}.qr img{width:min(320px,100%);border-radius:18px;background:#fff;padding:10px}

@container (max-width:1180px){
  .grid{grid-template-columns:repeat(2,minmax(0,1fr))}
  .grid .col:nth-child(3){grid-column:1 / -1}
  .rows{grid-template-columns:1fr}
}
@container (max-width:720px){
  .wrap{padding:12px}
  .rgrid{grid-template-columns:1fr;gap:12px}.rhead .csum{margin-left:0}
  .rtabs{width:100%;flex-wrap:nowrap;overflow-x:auto;scrollbar-width:none}.rtab{padding:0 12px 0 10px}
  .panel{border-radius:24px;padding:16px}
  .dh{padding:14px 16px}.rings{padding:0 12px 14px}.dd{padding:14px 16px 16px}
  .kpis{grid-template-columns:1fr 1fr 1fr;gap:8px}.kpi{padding:10px 12px}.kpi b{font-size:26px}
  .chips{grid-template-columns:1fr 1fr}
}
@media (prefers-reduced-motion:reduce){.pill i,.t-bad .ci{animation:none}.mbar span,.rgv{transition:none}}
`;

if (!customElements.get("mg-network-dashboard")) customElements.define("mg-network-dashboard", MgNetworkDashboard);
if (!window.customCards.some((c) => c.type === "mg-network-dashboard")) {
  window.customCards.push({ type: "mg-network-dashboard", name: "MG Netzwerk", description: "Server, NAS, UniFi und Drucker im Glow-Stil (2 Layouts)" });
}
console.info(`%c MG-NETWORK-DASHBOARD %c ${VERSION} `, "background:#38bdf8;color:#0b0d12;font-weight:700", "background:#14171e;color:#f3f5f9");
