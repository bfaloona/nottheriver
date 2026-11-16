// Fetches enforcement records from DOL's open-data API (apiprod.dol.gov/v4), which
// robots.txt allows (osha.gov/ords/ is disallowed). The key is read here so it never
// appears in a command line or in saved output.
//   node research/fetch-osha-dol.mjs metadata [agency endpoint] [--out DIR]
//       -> saves the dataset's full metadata to DIR and prints its field names
//          (default agency OSHA, endpoint inspection)
//   node research/fetch-osha-dol.mjs probe                  -> prints one inspection row
//   node research/fetch-osha-dol.mjs name <pattern> [limit] -> inspections whose establishment name matches (SQL like)
//   node research/fetch-osha-dol.mjs query <agency> <endpoint> --where '<json>' --save FILE
//       [--fields a,b] [--sort-by f] [--page N] [--max-pages N]
//       -> every row matching all conditions, paged, saved to FILE; prints the count.
//          --where is a JSON list of [field, operator, value] conditions, joined with "and"
//   node research/fetch-osha-dol.mjs penalties <activity_nr>... [--ids-from QUERY_FILE] --save FILE
//       -> OSHA violations for those inspections (or every row of a saved `query` file) in
//          one "in" query, saved to FILE, with penalty totals per inspection printed
//   node research/fetch-osha-dol.mjs fetch <activity_nr>... [--out DIR]
//       -> saves DIR/<activity_nr>.json (inspection + violations); DIR defaults to raw/osha-dol
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { homedir } from 'node:os';
import { URLSearchParams, pathToFileURL } from 'node:url';
import { setTimeout as sleep } from 'node:timers/promises';

const ROOT = new URL('.', import.meta.url).pathname;
const BASE = 'https://apiprod.dol.gov/v4/get';

// Read on first use, not at import, so tests can load the pure helpers without a key.
let KEY = null;
const key = () => (KEY ??= readFileSync(join(homedir(), 'dev/secrets/nottheriver-dol-api-key.txt'), 'utf8').trim());
const redact = (s) => (KEY ? s.split(KEY).join('<key>') : s);

/** @param {Array<[string, string, unknown]>} conditions */
export function buildFilter(conditions) {
  if (!conditions.length) throw new Error('buildFilter needs at least one condition');
  const parts = conditions.map(([field, operator, value]) => ({ field, operator, value }));
  return JSON.stringify(parts.length === 1 ? parts[0] : { and: parts });
}

/**
 * Asks for pages until one comes back short. The cap stops a filter that matches far more
 * than expected from spending the API's small rate budget.
 * @param {(offset: number, limit: number) => Promise<{data?: unknown[]}>} getPage
 */
export async function pageAll(getPage, limit, maxPages = 10) {
  const all = [];
  for (let page = 0; ; page++) {
    if (page >= maxPages) throw new Error(`page cap of ${maxPages} reached with ${all.length} rows; narrow the filter`);
    const rows = (await getPage(page * limit, limit))?.data ?? [];
    all.push(...rows);
    if (rows.length < limit) return all;
  }
}

const day = (/** @type {string|null|undefined} */ d) => (d ? d.slice(0, 10) : '');

/**
 * One inspection's penalty and status. Final means no live (not deleted) violation is under
 * contest without a final order, and either the case is closed or every live violation has a
 * final order date. The action date is the latest final order date, else the latest issuance.
 * @param {{close_case_date?: string|null}} insp
 * @param {Array<{delete_flag?: string|null, current_penalty?: string|number|null, issuance_date?: string|null, contest_date?: string|null, final_order_date?: string|null}>} viols
 */
export function summarizeInspection(insp, viols) {
  const live = viols.filter((v) => v.delete_flag !== 'X');
  const current = live.reduce((s, v) => s + Number(v.current_penalty ?? 0), 0);
  const contested = live.some((v) => v.contest_date && !v.final_order_date);
  const allOrdered = live.length > 0 && live.every((v) => v.final_order_date);
  const final = !contested && (Boolean(insp.close_case_date) || allOrdered);
  const finals = live.map((v) => day(v.final_order_date)).filter(Boolean).sort();
  const issued = live.map((v) => day(v.issuance_date)).filter(Boolean).sort();
  const actionDate = finals.at(-1) || issued.at(-1) || '';
  return { current, final, actionDate, issued: issued[0] ?? '', anyContest: live.some((v) => Boolean(v.contest_date)), violations: live.length };
}

/** @param {unknown[]} list */
export function chunk(list, n) {
  const out = [];
  for (let i = 0; i < list.length; i += n) out.push(list.slice(i, i + n));
  return out;
}

/** @param {Array<{activity_nr: unknown, current_penalty?: unknown, initial_penalty?: unknown}>} violations */
export function sumPenalties(violations) {
  const totals = {};
  for (const v of violations) {
    const t = (totals[v.activity_nr] ??= { current: 0, initial: 0, violations: 0 });
    t.current += Number(v.current_penalty ?? 0);
    t.initial += Number(v.initial_penalty ?? 0);
    t.violations += 1;
  }
  return totals;
}

async function get(agency, path, params = {}) {
  const qs = new URLSearchParams({ ...params, 'X-API-KEY': key() });
  for (let attempt = 1; ; attempt++) {
    const res = await fetch(`${BASE}/${agency}/${path}?${qs}`);
    const text = redact(await res.text());
    // The API rate-limits after about 8 calls and the limit outlasts 90 s, so without a
    // Retry-After header, back off in minutes.
    if (res.status === 429 && attempt <= 4) {
      const retryAfter = Number(res.headers.get('retry-after'));
      console.error(`429 on ${agency}/${path}; waiting (attempt ${attempt})`);
      await sleep(retryAfter > 0 ? retryAfter * 1000 : 120000 * attempt);
      continue;
    }
    if (!res.ok) throw new Error(`HTTP ${res.status} for ${agency}/${path}: ${text.slice(0, 300)}`);
    return text ? JSON.parse(text) : { data: [], empty_body_status: res.status };
  }
}

function option(args, name, fallback) {
  const i = args.indexOf(name);
  if (i === -1) return fallback;
  const value = args[i + 1];
  args.splice(i, 2);
  return value;
}

function save(file, value) {
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
}

async function main(argv) {
  const args = argv.slice();
  const mode = args.shift();
  if (mode === 'metadata') {
    const out = option(args, '--out', null);
    const [agency = 'OSHA', endpoint = 'inspection'] = args;
    const meta = await get(agency, `${endpoint}/json/metadata`);
    if (out) save(join(out, `metadata-${agency}-${endpoint}.json`), meta);
    const fields = Array.isArray(meta) ? meta : (meta?.data ?? meta?.fields ?? meta);
    console.log(out ? `saved; ${JSON.stringify(fields).length} chars` : JSON.stringify(fields).slice(0, 3000));
  } else if (mode === 'probe') {
    const one = await get('OSHA', 'inspection/json', { limit: 1 });
    console.log(JSON.stringify(one).slice(0, 1500));
  } else if (mode === 'name') {
    const filter = buildFilter([['estab_name', 'like', args[0]]]);
    const rows = await get('OSHA', 'inspection/json', { filter_object: filter, sort_by: 'open_date', sort: 'desc', limit: Number(args[1] ?? 10), fields: 'activity_nr,estab_name,site_city,site_state,open_date,close_case_date,load_dt' });
    console.log(JSON.stringify(rows));
  } else if (mode === 'query') {
    const where = JSON.parse(option(args, '--where', '[]'));
    const file = option(args, '--save', null);
    const fields = option(args, '--fields', null);
    const sortBy = option(args, '--sort-by', null);
    const limit = Number(option(args, '--page', '1000'));
    const maxPages = Number(option(args, '--max-pages', '10'));
    const [agency, endpoint] = args;
    if (!agency || !endpoint || !file) throw new Error('query needs <agency> <endpoint> --where ... --save FILE');
    const filter = buildFilter(where);
    const params = { filter_object: filter, ...(fields && { fields }), ...(sortBy && { sort_by: sortBy, sort: 'desc' }) };
    let calls = 0;
    const rows = await pageAll((offset, lim) => { calls++; return get(agency, `${endpoint}/json`, { ...params, limit: lim, offset }); }, limit, maxPages);
    save(file, { query: `${BASE}/${agency}/${endpoint}/json`, params, fetched: new Date().toISOString(), calls, rows });
    console.log(`${rows.length} rows in ${calls} calls -> ${file}`);
  } else if (mode === 'penalties') {
    const file = option(args, '--save', null);
    const from = option(args, '--ids-from', null);
    if (from) args.push(...JSON.parse(readFileSync(from, 'utf8')).rows.map((r) => String(r.activity_nr)));
    if (!file || !args.length) throw new Error('penalties needs <activity_nr>... or --ids-from QUERY_FILE, and --save FILE');
    // A list of 217 numbers drew HTTP 403 (likely a URL length limit), so ask in batches.
    const batch = Number(option(args, '--batch', '40'));
    const filters = chunk(args.map(Number), batch).map((ids) => buildFilter([['activity_nr', 'in', ids]]));
    let calls = 0;
    const rows = [];
    for (const filter of filters) {
      rows.push(...(await pageAll((offset, lim) => { calls++; return get('OSHA', 'violation/json', { filter_object: filter, limit: lim, offset }); }, 1000)));
    }
    save(file, { query: `${BASE}/OSHA/violation/json`, filters, fetched: new Date().toISOString(), calls, rows });
    const totals = sumPenalties(rows);
    for (const [nr, t] of Object.entries(totals)) console.log(`${nr}\t${JSON.stringify(t)}`);
    console.log(`${rows.length} violation rows in ${calls} calls -> ${file}`);
  } else if (mode === 'fetch') {
    // osha.gov id 1648417.015 was DOL activity_nr 346484173 ("34" + its last six digits + one
    // more digit), and all 18 matched pairs fit that; it's observed, not documented, so the
    // numbers passed here come from `name` searches matched on establishment, dates and penalty.
    const out = option(args, '--out', join(ROOT, 'raw', 'osha-dol'));
    mkdirSync(out, { recursive: true });
    for (const nr of args) {
      const file = join(out, `${nr}.json`);
      if (existsSync(file)) continue;
      const filter = buildFilter([['activity_nr', 'eq', Number(nr)]]);
      const inspection = await get('OSHA', 'inspection/json', { filter_object: filter });
      const violations = await get('OSHA', 'violation/json', { filter_object: filter });
      const saved = { activity_nr: nr, query: `${BASE}/OSHA/{inspection,violation}/json?filter_object=${filter}`, inspection, violations };
      writeFileSync(file, `${JSON.stringify(saved, null, 2)}\n`);
      const penalty = (violations?.data ?? []).reduce((sum, v) => sum + Number(v.current_penalty ?? 0), 0);
      console.log(`${nr}: ${inspection?.data?.length ?? '?'} inspection rows, ${violations?.data?.length ?? '?'} violation rows, current_penalty total ${penalty}`);
    }
  } else {
    console.error('usage: node research/fetch-osha-dol.mjs metadata [agency endpoint] [--out DIR]|probe|name <pattern> [limit]|query <agency> <endpoint> --where JSON --save FILE|penalties <activity_nr>... --save FILE|fetch <activity_nr>... [--out DIR]');
    process.exit(2);
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main(process.argv.slice(2)).catch((err) => {
    console.error(redact(String(err?.stack ?? err)));
    process.exit(1);
  });
}
