// Generates tools.json from ../apify-actors/*/.actor/{actor.json,input_schema.json}
import fs from 'node:fs';
import path from 'node:path';
const root = new URL('../apify-actors/', import.meta.url).pathname;
const KEEP = new Set(['type','description','default','enum','items','minimum','maximum','minLength','maxLength','properties','required','minItems','maxItems','pattern','format']);
function clean(s) {
  if (Array.isArray(s)) return s.map(clean);
  if (!s || typeof s !== 'object') return s;
  const o = {};
  for (const [k, v] of Object.entries(s)) {
    if (k === 'properties') { o.properties = Object.fromEntries(Object.entries(v).map(([n, p]) => [n, clean(p)])); }
    else if (KEEP.has(k)) o[k] = (k === 'items') ? clean(v) : v;
  }
  return o;
}
const tools = [];
for (const d of fs.readdirSync(root).sort()) {
  const ap = path.join(root, d, '.actor', 'actor.json');
  const sp = path.join(root, d, '.actor', 'input_schema.json');
  if (!fs.existsSync(ap) || !fs.existsSync(sp)) continue;
  const a = JSON.parse(fs.readFileSync(ap, 'utf8'));
  const s = clean(JSON.parse(fs.readFileSync(sp, 'utf8')));
  tools.push({
    actor: a.name, title: a.title, description: `${a.title}. ${a.description}`.slice(0, 1500),
    name: a.name.replace(/-/g, '_'),
    inputSchema: { type: 'object', properties: s.properties || {}, ...(s.required ? { required: s.required } : {}) },
  });
}
fs.writeFileSync(new URL('./tools.json', import.meta.url), JSON.stringify(tools, null, 2));
console.log(`wrote ${tools.length} tools`);
