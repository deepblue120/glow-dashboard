// Erstellt die Screenshots in docs/screenshots mit Beispieldaten (shots.html).
// Aufruf im Repository-Wurzelverzeichnis: node docs/screenshots/generator/shots.mjs
// Braucht Playwright mit Chromium (npm i -D playwright, npx playwright install chromium).
import { chromium } from "playwright";
import http from "http"; import fs from "fs"; import path from "path";
const root=process.cwd(), OUT="docs/screenshots";
const srv=http.createServer((q,r)=>{const p=path.join(root,decodeURIComponent(q.url.split("?")[0])); fs.readFile(p,(e,d)=>{if(e){r.writeHead(404);r.end();return;} r.writeHead(200,{"content-type":p.endsWith(".js")?"text/javascript":"text/html"}); r.end(d);});}).listen(8802);
const errs=[];
const shot=async (name,q,{w=1600,h=900,dsf=1,lang="de",act}={})=>{
  const b=await chromium.launch({args:[`--lang=${lang==="de"?"de-DE":"en-US"}`],env:{...process.env,LANG:lang==="de"?"de_DE.UTF-8":"en_US.UTF-8"}});
  const pg=await b.newPage({viewport:{width:w,height:h},deviceScaleFactor:dsf,locale:lang==="de"?"de-DE":"en-US"});
  pg.on("pageerror",e=>errs.push(name+": "+e.message)); pg.on("console",m=>{if(m.type()==="error")errs.push(name+": "+m.text())});
  await pg.goto(`http://localhost:8802/docs/screenshots/generator/shots.html?lang=${lang}&${q}`); await pg.waitForTimeout(2500);
  if (act) { await pg.evaluate(act); await pg.waitForTimeout(700); }
  await pg.screenshot({path:`${OUT}/${name}.png`}); await b.close();
};
const sr="window.__el.shadowRoot";
await shot("uebersicht","p=main&hh=168");
await shot("profil-analyse","p=prof&chg=0");
await shot("laden-kosten","p=cost&cp=month");
await shot("einstellungen","p=set&chg=0");
await shot("dlg-ladungen","p=main&hh=168",{act:`${sr}.querySelector('[data-act="charges"]').click()`});
await shot("dlg-fahrten","p=main&hh=168",{act:`${sr}.querySelector('#trips [data-act="trips"]').click()`});
await shot("dlg-autarkie","p=prof&chg=0",{act:`window.__el._openAna("aut")`});
await shot("dlg-bestaetigen","p=main&hh=168&chg=0&pend=1",{act:`${sr}.querySelector('.cpend').click()`});
await shot("menu-lademodus","p=main&hh=168",{act:`${sr}.querySelector('[data-act="evamanmenu"]').click()`});
await shot("handy","p=main&hh=24",{w:430,h:932,dsf:2});
await shot("handy-kosten","p=cost&cp=month",{w:430,h:932,dsf:2});
await shot("overview-en","p=main&hh=168",{lang:"en"});
console.log(errs.length?errs:"ok"); srv.close();
