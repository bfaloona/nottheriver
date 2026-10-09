// Step 2: geocode each distinct expected location in shops.json with Nominatim (one request a
// second, generic User-Agent, no operator identity). A landmark or address that Nominatim cannot
// find falls back to its city, and the fallback is recorded so the match step can widen the
// accept radius. Results are cached in raw/nominatim.json; delete an entry to redo it.
//   node docs/evidence/quality/open-place-coverage/geocode.mjs
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { setTimeout as sleep } from 'node:timers/promises';

const DIR = 'docs/evidence/quality/open-place-coverage';
const CACHE = `${DIR}/raw/nominatim.json`;
const UA = 'nottheriver-coverage-check/0.1';

/** @type {Array<{place: string}>} */
const shops = JSON.parse(readFileSync(`${DIR}/shops.json`, 'utf8'));
/** @type {Record<string, object>} */
const cache = existsSync(CACHE) ? JSON.parse(readFileSync(CACHE, 'utf8')) : {};

/** @param {string} q @returns {Promise<object|null>} The first Nominatim hit, trimmed. */
async function lookup(q) {
  const url = new URL('https://nominatim.openstreetmap.org/search');
  url.searchParams.set('q', q);
  url.searchParams.set('format', 'jsonv2');
  url.searchParams.set('countrycodes', 'us');
  url.searchParams.set('limit', '1');
  const res = await fetch(url, { headers: { 'User-Agent': UA, Accept: 'application/json' } });
  await sleep(1100);
  if (!res.ok) throw new Error(`nominatim ${res.status} for ${q}`);
  const hits = await res.json();
  if (!hits.length) return null;
  const h = hits[0];
  return { lat: Number(h.lat), lon: Number(h.lon), osm_type: h.osm_type, osm_id: h.osm_id, category: h.category, type: h.type, display_name: h.display_name };
}

/** Drop the most specific part: "Ansley Mall, Midtown, Atlanta, GA" -> "Midtown, Atlanta, GA". @param {string} place */
function widen(place) {
  const parts = place.split(',').map((s) => s.trim());
  if (parts.length <= 2) return place;
  return parts.slice(1).join(', ').replace(/\s+\d{5}$/, '');
}

for (const place of new Set(shops.map((s) => s.place))) {
  if (cache[place]) continue;
  let hit = await lookup(place);
  let used = place;
  while (!hit && widen(used) !== used) {
    used = widen(used);
    hit = await lookup(used);
  }
  cache[place] = { queried: place, used, fallback: used !== place, hit, fetched: new Date().toISOString() };
  console.log(`${place} -> ${hit ? `${hit.type} ${hit.lat},${hit.lon}` : 'NOT FOUND'}${used !== place ? ` (fallback ${used})` : ''}`);
  writeFileSync(CACHE, JSON.stringify(cache, null, 1) + '\n');
}
console.log(`${Object.keys(cache).length} places cached`);
