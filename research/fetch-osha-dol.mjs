// Fetches OSHA inspection records from DOL's open-data API, which robots.txt allows
// (osha.gov/ords/ is disallowed). The key is read here so it never appears in a command
// line or in saved output.
//   node research/fetch-osha-dol.mjs metadata               -> prints the inspection dataset's field names
//   node research/fetch-osha-dol.mjs probe                  -> prints one inspection row
//   node research/fetch-osha-dol.mjs name <pattern> [limit] -> inspections whose establishment name matches (SQL like)
//   node research/fetch-osha-dol.mjs fetch <activity_nr>... -> saves raw/osha-dol/<activity_nr>.json (inspection + violations)
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { homedir } from 'node:os';
import { URLSearchParams } from 'node:url';
import { setTimeout as sleep } from 'node:timers/promises';

const ROOT = new URL('.', import.meta.url).pathname;
const KEY = readFileSync(join(homedir(), 'dev/secrets/nottheriver-dol-api-key.txt'), 'utf8').trim();
const BASE = 'https://apiprod.dol.gov/v4/get/OSHA';
const redact = (s) => s.split(KEY).join('<key>');

async function get(path, params = {}) {
  const qs = new URLSearchParams({ ...params, 'X-API-KEY': KEY });
  for (let attempt = 1; ; attempt++) {
    const res = await fetch(`${BASE}/${path}?${qs}`);
    const text = redact(await res.text());
    // The API rate-limits after about 8 calls and the limit outlasts 90 s, so without a
    // Retry-After header, back off in minutes.
    if (res.status === 429 && attempt <= 4) {
      const retryAfter = Number(res.headers.get('retry-after'));
      await sleep(retryAfter > 0 ? retryAfter * 1000 : 120000 * attempt);
      continue;
    }
    if (!res.ok) throw new Error(`HTTP ${res.status} for ${path}: ${text.slice(0, 200)}`);
    return text ? JSON.parse(text) : { data: [], empty_body_status: res.status };
  }
}

const mode = process.argv[2];
if (mode === 'metadata') {
  const meta = await get('inspection/json/metadata');
  console.log(JSON.stringify(meta).slice(0, 3000));
} else if (mode === 'probe') {
  const one = await get('inspection/json', { limit: 1 });
  console.log(JSON.stringify(one).slice(0, 1500));
} else if (mode === 'name') {
  const filter = JSON.stringify({ field: 'estab_name', operator: 'like', value: process.argv[3] });
  const rows = await get('inspection/json', { filter_object: filter, sort_by: 'open_date', sort: 'desc', limit: Number(process.argv[4] ?? 10), fields: 'activity_nr,estab_name,site_city,site_state,open_date,close_case_date,load_dt' });
  console.log(JSON.stringify(rows));
} else if (mode === 'fetch') {
  // osha.gov id 1648417.015 was DOL activity_nr 346484173 ("34" + its last six digits + one
  // more digit), and all 18 matched pairs fit that; it's observed, not documented, so the
  // numbers passed here come from `name` searches matched on establishment, dates and penalty.
  const out = join(ROOT, 'raw', 'osha-dol');
  mkdirSync(out, { recursive: true });
  for (const nr of process.argv.slice(3)) {
    const file = join(out, `${nr}.json`);
    if (existsSync(file)) continue;
    const filter = JSON.stringify({ field: 'activity_nr', operator: 'eq', value: Number(nr) });
    const inspection = await get('inspection/json', { filter_object: filter });
    const violations = await get('violation/json', { filter_object: filter });
    const saved = { activity_nr: nr, query: `${BASE}/{inspection,violation}/json?filter_object=${filter}`, inspection, violations };
    writeFileSync(file, `${JSON.stringify(saved, null, 2)}\n`);
    const penalty = (violations?.data ?? []).reduce((sum, v) => sum + Number(v.current_penalty ?? 0), 0);
    console.log(`${nr}: ${inspection?.data?.length ?? '?'} inspection rows, ${violations?.data?.length ?? '?'} violation rows, current_penalty total ${penalty}`);
  }
} else {
  console.error('usage: node research/fetch-osha-dol.mjs metadata|probe|name <pattern> [limit]|fetch <activity_nr>...');
  process.exit(2);
}
