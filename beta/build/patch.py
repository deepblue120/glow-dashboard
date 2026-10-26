# Handy-Cockpit (Vorschlag B). Wird auf dist/mg-car-dashboard.js angewendet.
R = [
# --- Kennzahlen und Hinweise der Auto-Kachel als eigene Methoden (für die Handy-Kachel wiederverwendet) ---
('''    // drei Kennzahlen aus ev_assistant
    const LBL = {''', '''    const stats = this._carStats(), { pendBtn, flags } = this._carFlags();

    const html = `
      <div class="hd">${this._carTitle(name)}<span class="lbl ${charging ? "chg" : ""}">${charging ? `${icon("mdi:lightning-bolt")} ` : ""}${esc(status)}</span>
        ${pendBtn}</div>
      <div class="carbody" data-act="cardetail">
        <div><div class="soc">${hasSoc ? Math.round(soc) : "–"}<sup>%</sup></div>
          <div class="range">${range ? `${Math.round(this._num(c.range))} km` : rEst ? `${rEst.v} km` : ""}${range && rEst ? `<small> · ${T("real")} ≈ ${rEst.v} km</small>` : ""}</div></div>
        ${img ? `<img class="carimg" src="${esc(img)}" alt="">` : ""}
      </div>
      <div class="bar">${marks}<span style="width:${soc}%" class="${charging ? "charging" : ""}"></span></div>
      ${line}
      ${this._carFlagChips(flags)}
      ${stats ? `<div class="cstats">${stats}</div>` : ""}`;
    // nur bei Änderungen neu aufbauen (sonst lädt z. B. das Bild jedes Mal neu)
    const el = this.shadowRoot.getElementById("car");
    if (el._html !== html) { el.innerHTML = html; el._html = html; }
    if (this._menu && !this.shadowRoot.contains(this._menu.anchorEl)) this._closeMenu();
  }

  _carTitle(name) {
    return (this._evaVehicles || []).length > 1
      ? `<button class="ttl vsel" data-act="vehmenu" title="${T("Fahrzeug wählen")}">${esc(name)}${icon("mdi:chevron-down", "vchv")}</button>`
      : `<span class="ttl">${esc(name)}</span>`;
  }
  _carFlagChips(flags) {
    return flags.length ? `<div class="cflags">${flags.map(([i, t, id]) => `<button class="chip warn" data-act="more" data-entity="${esc(id)}">${icon(i)}${t}</button>`).join("")}</div>` : "";
  }

  // Kennzahlen aus ev_assistant (car.stats)
  _carStats() {
    const c = this._config.car, E = this._eva();
    const LBL = {'''),
('''      return `<button class="cstat" data-act="more" data-entity="${esc(id)}"><span>${esc(LBL[k] ? T(LBL[k]) : this._st(id)?.attributes?.friendly_name || k)}</span><b>${esc(f.v)}<small>${esc(f.u.replace("kWh/100km", "kWh/100"))}</small></b></button>`;
    }).join("");

    // Hinweise von ev_assistant (Fremdladung/Fahrt erfassen, Wartung)
    const flags = [];''', '''      return `<button class="cstat" data-act="more" data-entity="${esc(id)}"><span>${esc(LBL[k] ? T(LBL[k]) : this._st(id)?.attributes?.friendly_name || k)}</span><b>${esc(f.v)}<small>${esc(f.u.replace("kWh/100km", "kWh/100"))}</small></b></button>`;
    }).join("");
  }

  // Hinweise von ev_assistant (Fremdladung/Fahrt erfassen, Wartung)
  _carFlags() {
    const E = this._eva(), flags = [];'''),
('''    if (wf && ["on", "true", "ja", "fällig"].includes(String(wf.state).toLowerCase())) flags.push(["mdi:wrench", T("Wartung fällig"), E.wartung_faellig]);

    const html = `
      <div class="hd">${(this._evaVehicles || []).length > 1
        ? `<button class="ttl vsel" data-act="vehmenu" title="${T("Fahrzeug wählen")}">${esc(name)}${icon("mdi:chevron-down", "vchv")}</button>`
        : `<span class="ttl">${esc(name)}</span>`}<span class="lbl ${charging ? "chg" : ""}">${charging ? `${icon("mdi:lightning-bolt")} ` : ""}${esc(status)}</span>
        ${pendBtn}</div>
      <div class="carbody" data-act="cardetail">
        <div><div class="soc">${hasSoc ? Math.round(soc) : "–"}<sup>%</sup></div>
          <div class="range">${range ? `${Math.round(this._num(c.range))} km` : rEst ? `${rEst.v} km` : ""}${range && rEst ? `<small> · ${T("real")} ≈ ${rEst.v} km</small>` : ""}</div></div>
        ${img ? `<img class="carimg" src="${esc(img)}" alt="">` : ""}
      </div>
      <div class="bar">${marks}<span style="width:${soc}%" class="${charging ? "charging" : ""}"></span></div>
      ${line}
      ${flags.length ? `<div class="cflags">${flags.map(([i, t, id]) => `<button class="chip warn" data-act="more" data-entity="${esc(id)}">${icon(i)}${t}</button>`).join("")}</div>` : ""}
      ${stats ? `<div class="cstats">${stats}</div>` : ""}`;
    // nur bei Änderungen neu aufbauen (sonst lädt z. B. das Bild jedes Mal neu)
    const el = this.shadowRoot.getElementById("car");
    if (el._html !== html) { el.innerHTML = html; el._html = html; }
    if (this._menu && !this.shadowRoot.contains(this._menu.anchorEl)) this._closeMenu();
  }
''', '''    if (wf && ["on", "true", "ja", "fällig"].includes(String(wf.state).toLowerCase())) flags.push(["mdi:wrench", T("Wartung fällig"), E.wartung_faellig]);
    return { pendBtn, flags };
  }

  /* Handy: Cockpit-Kachel – Ladestand als Ring, daneben die laufende bzw. letzte Ladung (Werte aus _render_live) */
  _render_car_mob() {
    const img = this._carImage(), c = this._config.car, ev = c.evcc || {}, E = this._eva(), V = this._lv || {};
    const hasSoc = !!this._st(c.soc), soc = Math.max(0, Math.min(100, this._num(c.soc)));
    const { charging, plugged, driving } = this._carState();
    const rEst = this._fmt(E.range_estimate, 0), range = this._st(c.range) ? `${Math.round(this._num(c.range))} km` : rEst ? `${rEst.v} km` : "";
    const name = c.name || this._evaPanel?.name || T("Auto");
    const status = charging ? T("Lädt") : driving ? (c.status_on ? T(c.status_on) : T("Unterwegs")) : plugged ? T("Angesteckt") : (c.status_off ? T(c.status_off) : T("Geparkt"));
    const lim = ev.limit_soc && this._st(ev.limit_soc) ? this._num(ev.limit_soc) : null, min = ev.min_soc && this._st(ev.min_soc) ? this._num(ev.min_soc) : null;
    // Ring: Ladestand, dazu Striche für Ladeziel (weiß) und Mindestladung (orange)
    const RR = 51, CC = 2 * Math.PI * RR, mark = (v, cls) => (v > 0 && v < 100 ? `<circle cx="59" cy="59" r="${RR}" class="${cls}" style="stroke-dasharray:2.5 ${CC};stroke-dashoffset:${-((v / 100) * CC) + 1.25}"/>` : "");
    const ring = `<button class="mring" data-act="cardetail"><svg viewBox="0 0 118 118"><circle cx="59" cy="59" r="${RR}" class="rbg"/><circle cx="59" cy="59" r="${RR}" class="rsoc${charging ? " chg" : ""}" style="stroke-dasharray:${((soc / 100) * CC).toFixed(1)} ${CC.toFixed(1)}"/>${mark(min, "rmin")}${mark(lim, "rlim")}</svg>
      <span><b>${hasSoc ? Math.round(soc) : "–"}<sup>%</sup></b><small>${esc(range)}</small></span></button>`;
    const kv = (l, v, cls = "") => `<span>${l} <b class="${cls}">${v}</b></span>`;
    const pv = V.pvv == null ? "–" : `${Math.round(V.pvv)} %`, cost = V.cost == null ? "–" : `${de(V.cost, 2)} ${esc(V.cur || "€")}`;
    let side;
    if (charging) side = `<div class="ml1"><b>${V.kwh == null ? "–" : de(V.kwh, 1)}</b><small>kWh${V.durTxt && V.durTxt !== "–" ? ` · ${T("seit {d}", { d: V.durTxt })}` : ""}</small></div>
      <div class="mkv">${kv(T("Leistung"), V.p ? `${V.p.v} ${V.p.u}` : "–")}${kv("PV", pv, "o")}${kv(T("Kosten"), cost)}${kv(T("Ziel"), lim ? `${Math.round(lim)} %` : "–")}</div>`;
    else if (V.last) side = `<div class="mlk">${esc(V.kicker || "")}</div><div class="ml1"><b>${V.kwh == null ? "–" : de(V.kwh, 1)}</b><small>kWh</small></div>
      <div class="mkv">${kv("PV", pv, "o")}${kv(T("Kosten"), cost)}${kv(T("Dauer"), esc(V.durTxt || "–"))}${kv(T("Preis"), V.per == null ? "–" : `${de(V.per * 100, 1)} ct`)}</div>`;
    else side = `<div class="mlk">${esc(V.kicker || T("Letzte Ladung"))}</div>`;
    const split = V.pvK != null && V.kwh > 0.01 ? `<div class="msplit"><i class="pv" style="flex:${Math.max(V.pvK, 0.001)}"></i><i class="gr" style="flex:${Math.max(V.grK, 0.001)}"></i></div>` : "";
    const lt = this._fmt(E.last_trip_km, 0);
    const foot = V.pvK != null || lt ? `<div class="mfoot"><span>${V.pvK != null ? `PV <b>${de(V.pvK, 1)} kWh</b> · ${T("Netz")} <b>${de(V.grK, 1)} kWh</b>` : ""}</span>${lt ? `<span>${T("Letzte Fahrt")} <b>${lt.v} km</b></span>` : ""}</div>` : "";
    const { pendBtn, flags } = this._carFlags();
    const chip = charging ? `<span class="lbl mchip">${icon("mdi:lightning-bolt")}${esc(T("Lädt"))}${V.kickEnd ? ` · ${esc(V.kickEnd)}` : ""}</span>` : `<span class="lbl">${esc(status)}</span>`;
    const html = `${img ? `<img class="mcar" src="${esc(img)}" alt="">` : ""}
      <div class="hd">${this._carTitle(name)}${pendBtn || chip}</div>
      <div class="mtop">${ring}<button class="mside" data-act="charges" title="${T("Alle Ladungen anzeigen")}">${side}</button></div>
      ${split}${foot}${this._carFlagChips(flags)}`;
    const el = this.shadowRoot.getElementById("car");
    el.classList.toggle("mhero", true); el.classList.toggle("chg", charging);
    if (el._html !== html) { el.innerHTML = html; el._html = html; }
    if (this._menu && !this.shadowRoot.contains(this._menu.anchorEl)) this._closeMenu();
  }

  /* Handy: Fahrtenbuch, Verlauf, Leasing/Nutzung und Kennzahlen als Zeilen – Antippen öffnet bzw. klappt auf */
  _render_mrows() {
    const el = this.shadowRoot.getElementById("mrows"), wrap = this.shadowRoot.querySelector(".wrap");
    if (!el || !wrap) return;
    if (!this._mob) { if (el._html) { el.innerHTML = ""; el._html = ""; } delete wrap.dataset.mx; return; }
    const mx = this._mx || "", E = this._eva();
    if (mx) wrap.dataset.mx = mx; else delete wrap.dataset.mx;
    // jede Zeile mit eigener Reihenfolge, damit der aufgeklappte Inhalt direkt darunter steht (Verlauf 5, Leasing 7, Kennzahlen 9)
    const ORD = { trips: 3, hist: 4, lease: 6, stats: 8 };
    const row = (k, ic, lbl, val, open = true) => `<button class="mrow${mx === k ? " open" : ""}" style="order:${ORD[k]}" data-act="mrow" data-k="${k}">${icon(ic)}<b>${lbl}</b><span>${val}</span>${icon(!open ? "mdi:chevron-right" : mx === k ? "mdi:chevron-up" : "mdi:chevron-down", "mrc")}</button>`;
    const rows = [];
    // Fahrtenbuch: letzte Fahrt, Antippen öffnet „Alle Fahrten“
    const t = this._tripList()[0], place = (x) => ({ home: T("Zuhause"), zuhause: T("Zuhause"), Home: T("Zuhause"), not_home: T("unterwegs") }[x] || x || "?");
    rows.push(row("trips", "mdi:map-marker-path", T("Fahrtenbuch"), t ? `${esc(place(t.start_ort))} → ${esc(place(t.ziel_ort))}${parseFloat(t.strecke) ? ` · ${de(parseFloat(t.strecke), 0)} km` : ""}` : "", false));
    // Verlauf: Zeitraum, geladene kWh und PV-Anteil
    const hs = this._histSum, rl = this._ranges().find((r) => r.h === this._histHours())?.label || "";
    rows.push(row("hist", "mdi:chart-line", T("Verlauf"), [esc(rl), hs?.k > 0.05 ? `${de(hs.k, 1)} kWh` : "", hs?.pv != null ? `${hs.pv} % PV` : ""].filter(Boolean).join(" · ")));
    // Leasing bzw. Nutzung (was die Karte in der rechten Spalte zeigen würde)
    if (this._leaseOk) { const L = this._leaseSum || {}; rows.push(row("lease", "mdi:car-clock", T("Leasing"), `${L.t ? `<em style="color:${L.c}">${esc(L.t)}</em> · ` : ""}${L.km != null ? `${L.km > 0 ? "+" : ""}${de(L.km, 0)} km` : ""}`)); }
    else if (this._config.car.usage !== false && this._config.car.usage !== "") { const o = this._fmt(E.odo, 0); if (o || this._fmt(E.odo_month_km, 0)) rows.push(row("lease", "mdi:speedometer", T("Nutzung"), o ? `${o.v} km` : "")); }
    // Kennzahlen der Auto-Kachel
    const stats = this._carStats();
    if (stats) { const a = this._fmt(E.vehicle_avg_consumption), s = this._fmt(E.savings, 0);
      rows.push(row("stats", "mdi:gauge", T("Kennzahlen"), [a && `${esc(a.v)} kWh/100`, s && `${esc(s.v)} € ${T("gespart")}`].filter(Boolean).join(" · ")));
      if (mx === "stats") rows.push(`<div class="cstats mstat">${stats}</div>`); }
    const html = rows.join("");
    if (el._html !== html) { el.innerHTML = html; el._html = html; }
  }
'''),
('''  _render_car() {
    const img = this._carImage();''', '''  _render_car() {
    const carEl = this.shadowRoot.getElementById("car");
    if (this._mob) return this._render_car_mob();
    carEl?.classList.remove("mhero", "chg");
    const img = this._carImage();'''),
# --- Werte der Ladung für die Handy-Kachel merken ---
('''    this.shadowRoot.getElementById("live").innerHTML = `
      <div class="hd"><span class="ttl">${T("Laden")}</span>''', '''    this._lv = { kwh, pvv, pvK, grK, cost, cur, per, durTxt, kicker, kickEnd, p, last: L };   // für die Cockpit-Kachel (Handy)
    this.shadowRoot.getElementById("live").innerHTML = `
      <div class="hd"><span class="ttl">${T("Laden")}</span>'''),
('''    this._render_car();
    this._render_live();
    this._render_mgmt();''', '''    this._render_live();   // vor der Auto-Kachel: die Handy-Ansicht zeigt die Ladung darin
    this._render_car();
    this._render_mgmt();'''),
('''    if (this._dlg === "pend") this._renderPend();
    requestAnimationFrame(() => this._fitHist());''', '''    if (this._dlg === "pend") this._renderPend();
    this._render_mrows();
    requestAnimationFrame(() => this._fitHist());'''),
('if (k > 0.05) head = `<span class="hsum">', 'this._histSum = { k, pv: pv != null && H.bars?.split && k > 0.05 ? Math.round((pv / k) * 100) : null };   // für die Zeile „Verlauf“ (Handy)\n      if (k > 0.05) head = `<span class="hsum">'),
('    const html = this._statHd("lease", stTxt ?', '    this._leaseSum = { t: stTxt, c: stCol, km };   // für die Zeile „Leasing“ (Handy)\n    const html = this._statHd("lease", stTxt ?'),
# --- Handy erkennen ---
('''    wrap.classList.toggle("sat", top < 30);   // ganz oben (ohne HA-Kopfzeile): Abstand zur iPhone-Statusleiste''', '''    wrap.classList.toggle("sat", top < 30);   // ganz oben (ohne HA-Kopfzeile): Abstand zur iPhone-Statusleiste
    // Handy (Karte bis 600 px breit): Cockpit-Ansicht – Auto und Laden in einer Kachel, Lademanagement darunter, der Rest als Zeilen
    const mob = this.clientWidth > 0 && this.clientWidth <= 600;
    if (mob !== !!this._mob) {
      this._mob = mob; wrap.classList.toggle("mob", mob);
      const car = this.shadowRoot.getElementById("car"); if (car) car._html = null;
      if (this._hass && this._built) Promise.resolve().then(() => this._update(true));
    }'''),
('''    this._built = true;
    // nur bei geändertem HTML neu schreiben''', '''    this._built = true;
    if (this._mob) this.shadowRoot.querySelector(".wrap").classList.add("mob");
    // nur bei geändertem HTML neu schreiben'''),
('<div class="col"><section class="panel car" id="car"></section><section class="panel grow" id="trips"></section></div>', '<div class="col"><section class="panel car" id="car"></section><section class="panel grow" id="trips"></section><div class="mrows" id="mrows"></div></div>'),
# --- Klicks ---
('''    if (act === "pendopen") { this._openPend(); return; }''', '''    if (act === "pendopen") { this._openPend(); return; }
    if (act === "mrow") {   // Handy: Zeile antippen
      const k = el.dataset.k;
      if (k === "trips") { this._openTrips(); return; }
      this._mx = this._mx === k ? null : k;
      this._update(true);
      // aufgeklappten Inhalt sanft ins Bild holen (nur so weit wie nötig, die Zeile bleibt an ihrer Stelle)
      if (this._mx) requestAnimationFrame(() => {
        const sr = this.shadowRoot, box = k === "hist" ? sr.getElementById("hist") : k === "stats" ? sr.querySelector(".mstat")
          : [sr.getElementById("lease"), sr.getElementById("usage")].find((x) => x && !x.hidden);
        box?.scrollIntoView({ block: "nearest", behavior: "smooth" });
      });
      return;
    }
    if (act === "mplanopen") { this._planOpen = true; this._render_mgmt(); return; }'''),
('if (act === "mplancancel") { this._planEdit = false; this._planReq = null; this._render_mgmt(); return; }', 'if (act === "mplancancel") { this._planEdit = false; this._planOpen = false; this._planReq = null; this._render_mgmt(); return; }'),
# --- Lademanagement: Ladeplan auf dem Handy zugeklappt ---
('''if (pi?.date && pr?.target && Math.abs(pi.date.getTime() - pr.target) < 90000) { clearTimeout(pr.timer); this._planReq = null; this._planEdit = false; }''', '''if (pi?.date && pr?.target && Math.abs(pi.date.getTime() - pr.target) < 90000) { clearTimeout(pr.timer); this._planReq = null; this._planEdit = false; this._planOpen = false; }'''),
('''    } else {
      // Ziel: Auswahl wie beim Ladeziel (Menü), Wert und Umrechnung im Button''', '''    } else if (this._mob && !pi && !this._planOpen && !pr?.busy && !pr?.err) {
      // Handy: ohne Plan nur eine Zeile, das Formular klappt beim Antippen auf
      planBox = `<button class="mplanrow" data-act="mplanopen">${icon("mdi:calendar-plus")}<b>${T("Ladeplan setzen")}</b><span>${T("Ziel und Uhrzeit wählen")}</span></button>${reqMsg}`;
    } else {
      // Ziel: Auswahl wie beim Ladeziel (Menü), Wert und Umrechnung im Button'''),
('''        ${pi ? `<div class="mpb end"><button class="qbtn ghost" data-act="mplancancel">${T("Abbrechen")}</button></div>` : ""}''', '''        ${pi || (this._mob && this._planOpen) ? `<div class="mpb end"><button class="qbtn ghost" data-act="mplancancel">${T("Abbrechen")}</button></div>` : ""}'''),
# --- CSS ---
('''const CAR_STYLE = `
''', '''const CAR_STYLE = `
/* ---------- Handy: Cockpit-Ansicht (.wrap.mob, Karte bis 600 px breit) ---------- */
.mrows{display:none}
.wrap.mob{padding:10px 10px 18px}
.wrap.mob .pages{margin:0 0 10px}
.wrap.mob .pages > .hsegs{overflow-x:auto;scrollbar-width:none;max-width:100%;justify-self:stretch}.wrap.mob .pages > .hsegs::-webkit-scrollbar{display:none}
.wrap.mob .pages .hseg{flex:none;font-size:13px;padding:7px 11px}
.wrap.mob #pmain:not([hidden]){display:flex;flex-direction:column;gap:10px}
.wrap.mob #pmain .col{display:contents}
.wrap.mob .panel{border-radius:22px;padding:14px}
.wrap.mob .panel .hd{margin-bottom:10px}
.wrap.mob #car{order:1}.wrap.mob #mgmt{order:2}.wrap.mob #mrows{display:contents}
.wrap.mob #hist{order:5}.wrap.mob #lease,.wrap.mob #usage{order:7}
.wrap.mob .mrow + .mrow{margin-top:-4px}
.mstat{order:9;padding:12px;border-radius:18px;background:linear-gradient(180deg,#161920,#12151b);border:1px solid var(--line)}
.wrap.mob #live,.wrap.mob #trips{display:none}
.wrap.mob:not([data-mx="hist"]) #hist{display:none!important}
.wrap.mob:not([data-mx="lease"]) #lease,.wrap.mob:not([data-mx="lease"]) #usage{display:none!important}
/* Cockpit-Kachel */
#car.mhero{background:radial-gradient(120% 90% at 100% 0%,rgba(52,211,153,.10),transparent 60%),linear-gradient(180deg,#161920,#12151b)}
#car.mhero.chg{background:radial-gradient(120% 90% at 100% 0%,rgba(52,211,153,.18),transparent 60%),linear-gradient(180deg,#161920,#12151b)}
#car.mhero .hd{position:relative;z-index:1}
#car.mhero .mchip{display:inline-flex;align-items:center;gap:4px;padding:3px 10px;border-radius:999px;background:rgba(52,211,153,.13);color:var(--green);font-size:13px;font-weight:600}
#car.mhero .mchip ha-icon{--mdc-icon-size:15px}
#car.mhero .mcar{position:absolute;right:-48px;top:92px;width:200px;opacity:.08;pointer-events:none;filter:none}
.mtop{display:grid;grid-template-columns:118px minmax(0,1fr);gap:14px;align-items:center;position:relative}
.mring{position:relative;width:118px;height:118px;display:block}
.mring svg{width:118px;height:118px;transform:rotate(-90deg);display:block}
.mring circle{fill:none;stroke-width:10}
.mring .rbg{stroke:rgba(255,255,255,.07)}
.mring .rsoc{stroke:#34d399;stroke-linecap:round;transition:stroke-dasharray .6s}
.mring .rsoc.chg{stroke:#5eead4}
.mring .rlim{stroke:#fff;stroke-width:13}.mring .rmin{stroke:var(--orange);stroke-width:13}
.mring > span{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center}
.mring b{font-size:36px;font-weight:800;line-height:1;letter-spacing:-.02em}.mring b sup{font-size:15px;font-weight:600;margin-left:1px}
.mring small{font-size:13px;color:var(--muted);margin-top:3px}
.mside{display:flex;flex-direction:column;gap:6px;min-width:0;text-align:left}
.mlk{font-size:11px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:var(--muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ml1{display:flex;align-items:baseline;gap:6px;min-width:0}.ml1 b{font-size:28px;font-weight:700;color:var(--green);letter-spacing:-.01em}.ml1 small{font-size:13px;color:var(--muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.mkv{display:grid;grid-template-columns:1fr 1fr;gap:4px 10px;font-size:12.5px;color:var(--muted)}.mkv span{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.mkv b{color:var(--text);font-weight:600}.mkv b.o{color:var(--e-solar,#ff9800)}
.msplit{display:flex;height:6px;border-radius:4px;overflow:hidden;margin:12px 0 0;position:relative}.msplit i{display:block}.msplit .pv{background:var(--e-solar,#ff9800)}.msplit .gr{background:var(--e-grid-in,#488fc2)}
.mfoot{display:flex;justify-content:space-between;gap:10px;font-size:12px;color:var(--muted);margin-top:6px;position:relative}.mfoot b{color:var(--text);font-weight:600}
#car.mhero .cflags{margin-top:10px}#car.mhero .cstats{margin-top:12px}
/* Zeilen */
.mrow{display:flex;align-items:center;gap:10px;width:100%;padding:12px 14px;border-radius:16px;background:linear-gradient(180deg,#161920,#12151b);border:1px solid var(--line);font-size:14.5px;text-align:left}
.mrow > ha-icon:first-child{--mdc-icon-size:19px;color:var(--muted);flex:none}
.mrow b{font-weight:600;flex:none}
.mrow span{margin-left:auto;min-width:0;color:var(--muted);font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;text-align:right}
.mrow span em{font-style:normal;font-weight:600}
.mrow .mrc{--mdc-icon-size:17px;color:var(--dim);flex:none}
.mrow.open{border-color:rgba(255,255,255,.16)}
/* Lademanagement */
.wrap.mob #mgmt .mbottom.m3{grid-template-columns:repeat(3,minmax(0,1fr));gap:6px;margin:0 0 8px}
.wrap.mob #mgmt .mbottom.m3 .mbtn:first-child{grid-column:auto}
.wrap.mob #mgmt .mgrp > .mbottom.m3:first-child{padding:4px;gap:4px;border-radius:16px;background:rgba(0,0,0,.22);border:1px solid var(--tileb)}
.wrap.mob #mgmt .mgrp > .mbottom.m3:first-child .mbtn{flex-direction:column;justify-content:center;gap:3px;padding:8px 4px;border-radius:12px;text-align:center}
.wrap.mob #mgmt .mgrp > .mbottom.m3:first-child .mbtn:not(.on):not(.run){background:transparent;border-color:transparent}
.wrap.mob #mgmt .mgrp > .mbottom.m3:first-child .mtx{align-items:center;flex:none}
.wrap.mob #mgmt .mgrp > .mbottom.m3:first-child .mbtn b{font-size:14px}
.wrap.mob #mgmt .mgrp > .mbottom.m3:first-child .mchv{display:none!important}
.wrap.mob #mgmt .mgrp > .mbottom.m3:nth-child(2) .mbtn{padding:8px 10px}
.wrap.mob #mgmt .mgrp > .mbottom.m3:nth-child(2) .mbtn > ha-icon:first-child{display:none!important}
.wrap.mob #mgmt .mgrp > .mbottom.m3:nth-child(2) .mtx{flex-direction:column-reverse}
.wrap.mob #mgmt .mgrp > .mbottom.m3:nth-child(2) .mbtn b{font-size:16px}
.mplanrow{display:flex;align-items:center;gap:8px;width:100%;padding:10px 12px;border-radius:14px;border:1px dashed rgba(247,183,51,.45);color:var(--gold);font-size:14px;text-align:left}
.mplanrow ha-icon{--mdc-icon-size:19px;flex:none}.mplanrow b{font-weight:600}.mplanrow span{margin-left:auto;color:var(--muted);font-size:12.5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.wrap.mob #mgmt .mplan{margin-bottom:0}
@container (max-width:370px){.mtop{grid-template-columns:100px minmax(0,1fr);gap:10px}.mring,.mring svg{width:100px;height:100px}.mring b{font-size:31px}.mkv{font-size:11.5px;gap:4px 6px}.ml1 b{font-size:25px}}
'''),
]
R.append(('    const stats = (c.stats || []).map((k) => {', '    return (c.stats || []).map((k) => {'))
EN = {"Leistung": "Power", "Kennzahlen": "Statistics", "Ladeplan setzen": "Set charge plan", "Ziel und Uhrzeit wählen": "choose target and time"}
