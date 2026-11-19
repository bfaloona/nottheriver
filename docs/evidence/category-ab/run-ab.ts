// A/B of the nearby map searches: the model's own wording against the store types of the
// category list (IDEA-1). The plan, measures and budget are in README.md beside this file.
// Runs the real Worker pipeline locally against live Brave and OpenRouter. Keys are read from
// the files named in infra/deploy.local.env and never printed or saved.
//   npx tsx docs/evidence/category-ab/run-ab.ts
//   ROUNDS=2        rounds per arm
//   MAX_BRAVE=100   stop before a live Brave call past this count
//   DEPLOY_ENV=...  the deploy.local.env file to read (default: infra/deploy.local.env)
import fs from 'node:fs';
import path from 'node:path';
import type { KvStore, Normalized, SearchResponse } from '../../../proxy/src/contract';
import { runSearch } from '../../../proxy/src/pipeline';
import { ARMS, OUT, ROOT, jobs, json, listPair, type Arm, type CallsFile, type PlaceRow, type Query } from './lib';


const rounds = Number(process.env.ROUNDS ?? 2);
const maxBrave = Number(process.env.MAX_BRAVE ?? 100);

const conf = Object.fromEntries(
  fs.readFileSync(process.env.DEPLOY_ENV ?? path.join(ROOT, 'infra/deploy.local.env'), 'utf8').split('\n').filter((l) => /^[A-Z_]+=/.test(l)).map((l) => [l.slice(0, l.indexOf('=')), l.slice(l.indexOf('=') + 1).trim()]),
);
const readKey = (name: string) => fs.readFileSync(conf[name]!.replace(/^~/, process.env.HOME!), 'utf8').trim();

interface Zips { zip: string[]; city: string[]; state: string[]; lat: number[]; lon: number[]; ruca: (number | null)[] }
const zips = json<Zips>('public/zips.json');
const r2 = (x: number) => Math.round(x * 100) / 100;
function placeFor(zip: string) {
  const i = zips.zip.indexOf(zip);
  if (i < 0) throw new Error(`zip ${zip} not in public/zips.json`);
  const ruca = zips.ruca[i];
  return { city: zips.city[i]!, state: zips.state[i]!, lat: r2(zips.lat[i]!), lon: r2(zips.lon[i]!), ...(ruca != null && { ruca }) };
}

// One reading per product for the whole run: an in-memory stand-in for the Workers KV binding.
const store = new Map<string, string>();
const cacheFor = (arm: Arm, product: string): KvStore => ({
  get: async (key) => {
    if (!store.has(key)) return null;
    const value = JSON.parse(store.get(key)!) as unknown;
    // The list arm reads the same reply with only the two nearby searches replaced.
    return arm === 'list' && key.startsWith('normalize:') ? { ...(value as Normalized), local_queries: listPair(product) } : value;
  },
  put: async (key, value) => void store.set(key, value),
});

const env = {
  BRAVE_API_KEY: readKey('BRAVE_API_KEY_FILE'),
  OPENROUTER_API_KEY: readKey('OPENROUTER_API_KEY_FILE'),
  ALLOWED_ORIGIN: conf.ALLOWED_ORIGIN!,
  SITE_NAME: 'nottheriver',
  SITE_URL: conf.SITE_URL!,
};

let capHit = false;
let braveLive = 0;
let braveReplayed = 0;
const calls: CallsFile = { ran: new Date().toISOString(), rounds, brave_live_calls: 0, brave_replayed_calls: 0, searches: [], place_calls: [] };
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });
const save = () => fs.writeFileSync(path.join(OUT, 'calls.json'), JSON.stringify({ ...calls, brave_live_calls: braveLive, brave_replayed_calls: braveReplayed }, null, 1));

async function searchOnce(job: Query, arm: Arm, round: number, replay: Map<string, { status: number; text: string }>) {
  const t0 = performance.now();
  const before = { live: braveLive, replayed: braveReplayed };
  const recordingFetch: typeof fetch = async (input, init) => {
    const url = new URL(typeof input === 'string' ? input : (input as Request).url);
    if (url.host !== 'api.search.brave.com') return fetch(input, init);
    const key = `${job.id} ${url.href}`;
    let reply = replay.get(key);
    const replayed = reply !== undefined;
    if (!reply) {
      // The Brave client turns any fetch error into an upstream error, so the stop is a flag the loop reads.
      if (braveLive >= maxBrave) {
        capHit = true;
        throw new Error('MAX_BRAVE reached');
      }
      braveLive++;
      const res = await fetch(input, init);
      reply = { status: res.status, text: await res.text() };
      if (res.status === 200) replay.set(key, reply);
    } else {
      braveReplayed++;
    }
    if (url.pathname.endsWith('/local/place_search')) {
      let results: PlaceRow[] = [];
      try {
        // Name, website and place type only: enough to match a baseline shop, with no address.
        results = ((JSON.parse(reply.text) as { results?: PlaceRow[] }).results ?? []).map(({ title, url: site, icon_category, categories, distance }) => ({ title, url: site, icon_category, categories, distance }));
      } catch { /* an error body: no results */ }
      calls.place_calls.push({ id: job.id, arm, round, q: url.searchParams.get('q') ?? '', replayed, status: reply.status, results });
    }
    return new Response(reply.text, { status: reply.status, headers: { 'Content-Type': 'application/json' } });
  };
  const request = { product: job.product, ...placeFor(job.zip) };
  let status = 200;
  let body: SearchResponse | { error: string };
  try {
    body = await runSearch(request, { ...env, NORMALIZE_CACHE: cacheFor(arm, job.product) }, { fetch: recordingFetch, now: () => Date.now(), log: () => {} });
  } catch (e) {
    status = 502;
    body = { error: (e as Error).name };
  }
  if (capHit) throw new Error(`stopped: ${braveLive} live Brave calls reached MAX_BRAVE; this search is not saved`);
  const elapsed = Math.round(performance.now() - t0);
  // A list search that did not read the shared reading would run on the model's own wording.
  if (arm === 'list' && status === 200 && JSON.stringify((body as SearchResponse).query.local_queries) !== JSON.stringify(listPair(job.product))) {
    throw new Error(`stopped: the list arm of ${job.id} did not send the list pair`);
  }
  const dir = path.join(OUT, `${arm}-r${round}`, 'responses');
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, `${job.id}.json`), JSON.stringify({ id: job.id, checked: new Date().toISOString(), request, status, elapsed_ms: elapsed, body }, null, 2));
  calls.searches.push({ id: job.id, arm, round, status, elapsed_ms: elapsed, brave_live: braveLive - before.live, brave_replayed: braveReplayed - before.replayed });
  save();
  const queries = status === 200 ? (body as SearchResponse).query.local_queries : [];
  console.log(`r${round} ${job.id} ${arm}: ${status} in ${elapsed} ms, nearby searches ${JSON.stringify(queries)}, Brave live ${braveLive - before.live} replayed ${braveReplayed - before.replayed}`);
}

for (let round = 1; round <= rounds; round++) {
  for (const [n, job] of jobs.entries()) {
    // A new map per search and round: each round pays for its Brave calls again.
    const replay = new Map<string, { status: number; text: string }>();
    // Round 1 runs the model arm first, because it makes the reading both arms share. Later rounds alternate.
    const order = round === 1 || (n + round) % 2 === 0 ? ARMS : [...ARMS].reverse();
    for (const arm of order) await searchOnce(job, arm, round, replay);
  }
}
save();
console.log(`done: ${braveLive} live Brave calls, ${braveReplayed} replayed`);
