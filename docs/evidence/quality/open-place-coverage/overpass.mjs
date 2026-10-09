// Step 3: for each distinct expected location, one Overpass query for every node, way or
// relation whose name or brand matches any of that location's shop patterns, within the
// widest accept radius of the group plus half a mile. One request at a time, a pause between
// requests, back-off on 429 and 504 (Overpass usage policy). `out center meta` carries the
// last-edit timestamp; `user` and `uid` are stripped before saving. Raw replies are cached per
// place in raw/overpass/; delete a file to redo it.
//   node docs/evidence/quality/open-place-coverage/overpass.mjs
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { setTimeout as sleep } from 'node:timers/promises';
import { acceptRadiusMi } from './radius.mjs';

const DIR = 'docs/evidence/quality/open-place-coverage';
const RAW = `${DIR}/raw/overpass`;
const UA = 'nottheriver-coverage-check/0.1';
// Tried in order; a request moves to the next mirror after a 504, a gateway error or a dispatcher
// error (overpass-api.de answered every query that way on 2026-10-09). Each reply records which
// mirror served it and its data timestamp (`reply.osm3s.timestamp_osm_base`).
const ENDPOINTS = ['https://lz4.overpass-api.de/api/interpreter', 'https://z.overpass-api.de/api/interpreter', 'https://overpass.kumi.systems/api/interpreter'];

/** @type {Array<{place: string, radius_mi: number, name_re: string}>} */
const shops = JSON.parse(readFileSync(`${DIR}/shops.json`, 'utf8'));
/** @type {Record<string, {fallback: boolean, used: string, hit: {lat: number, lon: number}|null}>} */
const geo = JSON.parse(readFileSync(`${DIR}/raw/nominatim.json`, 'utf8'));
mkdirSync(RAW, { recursive: true });

const slug = (/** @type {string} */ s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

/** @param {string} ql @returns {Promise<{endpoint: string, reply: object}>} */
async function query(ql) {
  let last = '';
  for (let attempt = 0; attempt < 6; attempt++) {
    for (const endpoint of ENDPOINTS) {
      let status = 0;
      try {
        const res = await fetch(endpoint, { method: 'POST', headers: { 'User-Agent': UA, 'Content-Type': 'application/x-www-form-urlencoded' }, body: 'data=' + encodeURIComponent(ql) });
        status = res.status;
        const body = await res.text();
        if (res.ok && body.trimStart().startsWith('{')) return { endpoint, reply: JSON.parse(body) };
        last = `${endpoint} ${res.status}: ${body.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').slice(0, 200)}`;
      } catch (err) {
        last = `${endpoint} network error: ${err?.cause?.code ?? err?.code ?? err.message}`;
      }
      console.log(`  ${last}`);
      await sleep(status === 429 ? 60_000 : 20_000);
    }
  }
  throw new Error(`overpass failed on every mirror: ${last}`);
}

/** @param {{place: string}[]} group */
async function run(place, group) {
  const file = `${RAW}/${slug(place)}.json`;
  if (existsSync(file)) return;
  const g = geo[place];
  if (!g?.hit) {
    console.log(`${place}: no geocode, skipped`);
    return;
  }
  const radiusMi = Math.max(...group.map((s) => acceptRadiusMi(s, g))) + 0.5;
  const pattern = [...new Set(group.map((s) => s.name_re))].join('|');
  // Spatial filter first, regex second: a regex filter with a spatial filter in one statement
  // scans the global name index and timed out at 90 s even for a 1.5 mi radius. A bounding box
  // (the same box the Overture step uses) rather than `around`, which has to resolve way
  // geometry and took 46 s for one suburb; the match step applies the circular radius.
  const dlat = radiusMi / 69;
  const dlon = radiusMi / (69 * Math.cos((g.hit.lat * Math.PI) / 180));
  const bbox = [g.hit.lat - dlat, g.hit.lon - dlon, g.hit.lat + dlat, g.hit.lon + dlon].map((x) => x.toFixed(4)).join(',');
  const ql = `[out:json][timeout:120][bbox:${bbox}];\n(nwr[name];nwr[brand];)->.a;\n(nwr.a[name~"${pattern}",i];nwr.a[brand~"${pattern}",i];);\nout center meta;`;
  const t0 = Date.now();
  const { endpoint, reply } = await query(ql);
  if (reply.remark && /timed out|out of memory/i.test(reply.remark)) throw new Error(`${place}: ${reply.remark}`);
  for (const el of reply.elements ?? []) {
    delete el.user;
    delete el.uid;
    delete el.nodes;
    delete el.members;
  }
  writeFileSync(file, JSON.stringify({ place, radius_mi: radiusMi, center: g.hit, query: ql, endpoint, fetched: new Date().toISOString(), reply }, null, 1) + '\n');
  console.log(`${place}: ${reply.elements?.length ?? 0} elements in ${((Date.now() - t0) / 1000).toFixed(1)}s (r=${radiusMi} mi)`);
  await sleep(3000);
}

/** @type {Map<string, object[]>} */
const groups = new Map();
for (const s of shops) groups.set(s.place, [...(groups.get(s.place) ?? []), s]);
for (const [place, group] of groups) await run(place, group);
