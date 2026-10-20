// Prüft die Übersetzungen der Karte: jeder Text aus T("…") / N("…") braucht einen Eintrag in I18N.en,
// und jeder Eintrag in I18N.en muss noch verwendet werden. Aufruf: node scripts/check-i18n.mjs
import { readFileSync } from "node:fs";

const file = new URL("../dist/mg-car-dashboard.js", import.meta.url);
const src = readFileSync(file, "utf8");

const start = src.indexOf("const I18N = {");
if (start < 0) { console.error("I18N-Katalog nicht gefunden"); process.exit(1); }
const end = src.indexOf("\n};\n", start);
const catalogSrc = src.slice(start, end + 3);
const code = src.slice(0, start) + src.slice(end + 3);

// Katalog ohne Ausführen der Karte auswerten
const I18N = new Function(`${catalogSrc}; return I18N;`)();

// Schlüssel im Code: erstes Argument von T("…") bzw. N("…") als Zeichenkette in doppelten Anführungszeichen
const used = new Set();
for (const m of code.matchAll(/\b[TN]\("((?:[^"\\]|\\.)*)"/g)) {
  const k = JSON.parse(`"${m[1]}"`);
  if (k !== "…") used.add(k);   // Beispiel im Kommentar am Dateianfang
}

let bad = 0;
for (const [lang, cat] of Object.entries(I18N)) {
  const keys = new Set(Object.keys(cat));
  const missing = [...used].filter((k) => !keys.has(k));
  const unused = [...keys].filter((k) => !used.has(k));
  // Platzhalter müssen in beiden Sprachen gleich sein
  const ph = (s) => [...s.matchAll(/\{(\w+)\}/g)].map((x) => x[1]).sort().join(",");
  const phDiff = [...keys].filter((k) => used.has(k) && ph(k) !== ph(cat[k]));
  for (const k of missing) console.error(`[${lang}] fehlt: ${JSON.stringify(k)}`);
  for (const k of unused) console.error(`[${lang}] nicht verwendet: ${JSON.stringify(k)}`);
  for (const k of phDiff) console.error(`[${lang}] andere Platzhalter: ${JSON.stringify(k)} → ${JSON.stringify(cat[k])}`);
  bad += missing.length + unused.length + phDiff.length;
  console.log(`${lang}: ${keys.size} Einträge, ${used.size} Texte im Code`);
}
if (bad) { console.error(`${bad} Problem(e)`); process.exit(1); }
console.log("Übersetzungen vollständig.");
