// Step 4 of the open place data precision check (docs/open-place-precision.md): join the graders'
// batch files (grades/batch-NN.json) back to sample.json by row_id, write grades.json (grade-schema
// field names plus tier and overture_id) and summary.json (every count the report cites). Pure
// function of the files in this folder plus data/chains.json.
//   node docs/evidence/quality/open-place-precision/summarize.mjs
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';

const DIR = 'docs/evidence/quality/open-place-precision';
const THIN = 3;

/**
 * @typedef {object} SampleRow
 * @property {string} row_id
 * @property {string} search_id
 * @property {string} product
 * @property {string} category
 * @property {string} zip
 * @property {string} zip_kind
 * @property {'yes' | 'weak'} tier
 * @property {string} tier_by
 * @property {'leaf' | 'ancestor'} tier_by_level
 * @property {number} rank_in_tier
 * @property {string} overture_id
 * @property {string | null} name
 * @property {string | null} brand
 * @property {string | null} taxonomy_primary
 * @property {string | null} address
 * @property {string | null} locality
 * @property {number} distance_mi
 * @property {string | null} website
 * @property {string | null} operating_status
 * @property {string | null} source_dataset
 * @property {number | null} confidence
 */

/**
 * @typedef {object} BatchGrade
 * @property {string} row_id
 * @property {'yes' | 'equivalent' | 'no' | 'unknown'} sells_product
 * @property {'yes' | 'no' | 'unknown'} local_exists
 * @property {'ok' | 'challenge' | 'blocked' | 'error' | 'none'} page_access
 * @property {string} basis
 * @property {string} notes
 * @property {string} checked
 */

/** @typedef {SampleRow & BatchGrade & {batch: string, chain: string | null, chain_by: string | null}} Row */

const SELLS = ['yes', 'equivalent', 'no', 'unknown'];
const EXISTS = ['yes', 'no', 'unknown'];
const ACCESS = ['ok', 'challenge', 'blocked', 'error', 'none'];

/** @type {{rows: SampleRow[]}} */
const sample = JSON.parse(readFileSync(`${DIR}/sample.json`, 'utf8'));
/** @type {Record<string, {yes_in_radius: number, weak_in_radius: number, yes_sampled: number, weak_sampled: number, radius_mi: number, zip_kind: string, product: string, dropped_not_open: Record<string, number>, dropped_duplicates: number, farthest_sampled_yes_mi: number | null}>} */
const counts = JSON.parse(readFileSync(`${DIR}/counts.json`, 'utf8'));
/** @type {{entries: {domain: string, name: string}[]}} */
const chains = JSON.parse(readFileSync('data/chains.json', 'utf8'));

const norm = (/** @type {string | null | undefined} */ s) => (s ?? '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
const host = (/** @type {string | null} */ u) => {
  try {
    return u ? new URL(u).hostname.replace(/^www\./, '') : null;
  } catch {
    return null;
  }
};

/**
 * Chain membership from data/chains.json: the website's host is the chain's domain or a subdomain
 * of it (local.starmarket.com is not safeway.com, so Star Market stays unlabelled), else the
 * normalized shop name equals the chain's name or starts with it followed by a space (Walmart
 * Supercenter, Target Optical). Says which test matched; null when neither does.
 * @param {SampleRow} r
 * @returns {{chain: string | null, chain_by: string | null}}
 */
function chainOf(r) {
  const h = host(r.website);
  for (const c of chains.entries) {
    if (h && (h === c.domain || h.endsWith(`.${c.domain}`))) return { chain: c.name, chain_by: `domain ${c.domain}` };
  }
  const n = norm(r.name);
  for (const c of chains.entries) {
    const cn = norm(c.name);
    if (n === cn || n.startsWith(`${cn} `)) return { chain: c.name, chain_by: `name ${c.name}` };
  }
  return { chain: null, chain_by: null };
}

/** @type {Map<string, BatchGrade & {batch: string}>} */
const graded = new Map();
for (const f of readdirSync(`${DIR}/grades`).filter((x) => /^batch-\d+\.json$/.test(x)).sort()) {
  /** @type {BatchGrade[]} */
  const batch = JSON.parse(readFileSync(`${DIR}/grades/${f}`, 'utf8'));
  for (const g of batch) {
    if (graded.has(g.row_id)) throw new Error(`${g.row_id} graded twice (${f})`);
    if (!SELLS.includes(g.sells_product) || !EXISTS.includes(g.local_exists) || !ACCESS.includes(g.page_access)) throw new Error(`${g.row_id} in ${f}: bad value ${JSON.stringify(g)}`);
    graded.set(g.row_id, { ...g, batch: f.replace('.json', '') });
  }
}

/** @type {Row[]} */
const rows = [];
const ungraded = [];
for (const s of sample.rows) {
  const g = graded.get(s.row_id);
  if (!g) {
    ungraded.push(s.row_id);
    continue;
  }
  rows.push({ ...s, ...g, ...chainOf(s) });
}
const strays = [...graded.keys()].filter((id) => !sample.rows.some((s) => s.row_id === id));
if (strays.length) throw new Error(`grades for rows not in the sample: ${strays.join(', ')}`);

// grades.json: the eval grade schema's field names (eval/grade-schema.json) plus what this check adds.
const grades = rows.map((r) => ({
  search_id: r.search_id, result_id: r.row_id, kind: 'local', url: r.website ?? '',
  sells_product: r.sells_product, local_exists: r.local_exists, distance_plausible: 'n/a', badges_sourced: 'n/a',
  page_access: r.page_access, notes: r.notes, checked: r.checked,
  tier: r.tier, overture_id: r.overture_id, name: r.name, product: r.product, basis: r.basis, batch: r.batch,
  chain: r.chain, chain_by: r.chain_by,
}));
writeFileSync(`${DIR}/grades.json`, JSON.stringify(grades, null, 1) + '\n');

const ratio = (/** @type {number} */ n, /** @type {number} */ d) => (d > 0 ? Math.round((n / d) * 1000) / 1000 : null);

/**
 * The measures for one group of rows. Precision counts `yes` and `equivalent` as selling, first over
 * every graded row (unknown counted as not selling), then over rows where the grader could tell.
 * `good_eval_rule` is the eval's own local rule (eval/README.md section 5): sells yes or equivalent
 * and local_exists yes, over rows where neither is unknown, except that local_exists no counts as
 * bad even when sells is unknown.
 * @param {Row[]} g
 */
function measure(g) {
  const n = g.length;
  const sells = Object.fromEntries(SELLS.map((v) => [v, g.filter((r) => r.sells_product === v).length]));
  const exists = Object.fromEntries(EXISTS.map((v) => [v, g.filter((r) => r.local_exists === v).length]));
  const selling = /** @type {number} */ (sells.yes) + /** @type {number} */ (sells.equivalent);
  const evalJudged = g.filter((r) => r.local_exists === 'no' || (r.sells_product !== 'unknown' && r.local_exists !== 'unknown'));
  const evalGood = evalJudged.filter((r) => (r.sells_product === 'yes' || r.sells_product === 'equivalent') && r.local_exists === 'yes').length;
  return {
    n, sells, exists,
    precision_all: { k: selling, n, ratio: ratio(selling, n) },
    precision_excl_unknown: { k: selling, n: n - /** @type {number} */ (sells.unknown), ratio: ratio(selling, n - /** @type {number} */ (sells.unknown)) },
    existence: { k: exists.yes, n, ratio: ratio(/** @type {number} */ (exists.yes), n) },
    good_eval_rule: { k: evalGood, n: evalJudged.length, not_judgeable: n - evalJudged.length, ratio: ratio(evalGood, evalJudged.length) },
    chains: { k: g.filter((r) => r.chain).length, ratio: ratio(g.filter((r) => r.chain).length, n) },
  };
}

/** @param {Row[]} g @param {(r: Row) => string} by */
function countBy(g, by) {
  /** @type {Record<string, number>} */
  const t = {};
  for (const r of g) t[by(r)] = (t[by(r)] ?? 0) + 1;
  return Object.fromEntries(Object.entries(t).sort((a, b) => b[1] - a[1]));
}

/** @param {(r: Row) => string} by */
function groupBy(by) {
  /** @type {Record<string, Row[]>} */
  const t = {};
  for (const r of rows) (t[by(r)] ??= []).push(r);
  return Object.fromEntries(Object.entries(t).map(([k, g]) => [k, { yes: measure(g.filter((r) => r.tier === 'yes')), weak: measure(g.filter((r) => r.tier === 'weak')), all: measure(g) }]));
}

const tiers = { yes: measure(rows.filter((r) => r.tier === 'yes')), weak: measure(rows.filter((r) => r.tier === 'weak')), all: measure(rows) };
const chainRows = rows.filter((r) => r.chain);
const summary = {
  about: 'Counts behind docs/open-place-precision.md. Rows are the graded Overture Places sample (sample.json joined to grades/batch-*.json); n is graded rows. Ratios are rounded to three places.',
  graded: rows.length, sampled: sample.rows.length, ungraded,
  graders: [...new Set(rows.map((r) => r.batch))].length,
  checked_dates: [...new Set(rows.map((r) => r.checked))].sort(),
  tiers,
  by_zip_kind: groupBy((r) => r.zip_kind),
  by_category: groupBy((r) => r.category),
  by_search: groupBy((r) => r.search_id),
  by_tier_by_level: groupBy((r) => r.tier_by_level),
  by_tier_by: groupBy((r) => r.tier_by),
  by_source_dataset: groupBy((r) => r.source_dataset ?? 'none'),
  by_website: groupBy((r) => (r.website ? 'has_website' : 'no_website')),
  by_operating_status: groupBy((r) => r.operating_status ?? 'none'),
  by_confidence: groupBy((r) => (r.confidence == null ? 'none' : r.confidence >= 0.9 ? '0.9+' : r.confidence >= 0.7 ? '0.7-0.9' : r.confidence >= 0.5 ? '0.5-0.7' : 'under 0.5')),
  page_access: Object.fromEntries(ACCESS.map((v) => [v, rows.filter((r) => r.page_access === v).length])),
  chains: {
    rows: chainRows.length, by_domain: chainRows.filter((r) => r.chain_by?.startsWith('domain')).length, by_name: chainRows.filter((r) => r.chain_by?.startsWith('name')).length,
    names: Object.fromEntries([...new Set(chainRows.map((r) => r.chain))].sort().map((c) => [c, chainRows.filter((r) => r.chain === c).length])),
    chain_precision_all: measure(chainRows).precision_all, independent_precision_all: measure(rows.filter((r) => !r.chain)).precision_all,
  },
  candidates: {
    per_search: counts,
    thin_yes_sections: Object.entries(counts).filter(([, c]) => c.yes_in_radius < THIN).map(([k, c]) => ({ search_id: k, yes_in_radius: c.yes_in_radius })),
    searches_with_fewer_than_10_yes: Object.entries(counts).filter(([, c]) => c.yes_in_radius < 10).map(([k]) => k),
    dropped_not_open_total: Object.values(counts).reduce((a, c) => a + Object.values(c.dropped_not_open).reduce((x, y) => x + y, 0), 0),
    dropped_duplicates_total: Object.values(counts).reduce((a, c) => a + c.dropped_duplicates, 0),
    yes_in_radius_total: Object.values(counts).reduce((a, c) => a + c.yes_in_radius, 0),
    weak_in_radius_total: Object.values(counts).reduce((a, c) => a + c.weak_in_radius, 0),
    farthest_sampled_yes_mi: Object.fromEntries(Object.entries(counts).map(([k, c]) => [k, c.farthest_sampled_yes_mi])),
  },
  // Why a row is not a `yes`, from fields rather than from reading notes: for `no`, whether the rule matched the row's own
  // category or only an ancestor, and whether the shop is closed or moved; for `unknown`, what stood in the grader's way.
  reasons: {
    no_by_level_and_closed: countBy(rows.filter((r) => r.sells_product === 'no'), (r) => `${r.tier_by_level}${r.local_exists === 'no' ? ', closed or moved' : ''}`),
    no_by_taxonomy_primary: countBy(rows.filter((r) => r.sells_product === 'no'), (r) => r.taxonomy_primary ?? 'none'),
    unknown_by_access: countBy(rows.filter((r) => r.sells_product === 'unknown'), (r) => (r.website ? r.page_access : 'no_website')),
    unknown_by_taxonomy_primary: countBy(rows.filter((r) => r.sells_product === 'unknown'), (r) => r.taxonomy_primary ?? 'none'),
    exists_no: countBy(rows.filter((r) => r.local_exists === 'no'), (r) => r.sells_product),
  },
  // Sensitivity: the chain rows in data/chains.json whose national site refused the grader. If every one of them sold the
  // product (not measured; a reader of the blocked pages could settle it), precision would be at most this.
  sensitivity: (() => {
    const chainUnknown = rows.filter((r) => r.chain && r.sells_product === 'unknown');
    const selling = rows.filter((r) => r.sells_product === 'yes' || r.sells_product === 'equivalent').length;
    return {
      chain_rows_unknown: chainUnknown.length, chain_rows: chainRows.length,
      chain_unknown_rows: chainUnknown.map((r) => ({ row_id: r.row_id, search_id: r.search_id, tier: r.tier, chain: r.chain, page_access: r.page_access })),
      precision_if_all_chain_unknowns_sold: { k: selling + chainUnknown.length, n: rows.length, ratio: ratio(selling + chainUnknown.length, rows.length) },
      yes_tier_if_all_chain_unknowns_sold: (() => {
        const t = rows.filter((r) => r.tier === 'yes');
        const k = t.filter((r) => r.sells_product === 'yes' || r.sells_product === 'equivalent' || (r.chain && r.sells_product === 'unknown')).length;
        return { k, n: t.length, ratio: ratio(k, t.length) };
      })(),
    };
  })(),
  // Every row the grader said does not sell the product, or does not exist, with what the rule saw, for the misses section.
  misses: rows
    .filter((r) => r.sells_product === 'no' || r.local_exists === 'no')
    .map((r) => ({ row_id: r.row_id, search_id: r.search_id, tier: r.tier, tier_by: r.tier_by, taxonomy_primary: r.taxonomy_primary, name: r.name, sells_product: r.sells_product, local_exists: r.local_exists, website: r.website, page_access: r.page_access, notes: r.notes })),
  unknowns: rows
    .filter((r) => r.sells_product === 'unknown')
    .map((r) => ({ row_id: r.row_id, search_id: r.search_id, tier: r.tier, tier_by: r.tier_by, taxonomy_primary: r.taxonomy_primary, name: r.name, local_exists: r.local_exists, website: r.website, page_access: r.page_access, notes: r.notes })),
};
writeFileSync(`${DIR}/summary.json`, JSON.stringify(summary, null, 1) + '\n');

const line = (/** @type {string} */ label, /** @type {ReturnType<typeof measure>} */ m) =>
  `${label.padEnd(8)} n=${m.n} sells yes/eq/no/unk ${m.sells.yes}/${m.sells.equivalent}/${m.sells.no}/${m.sells.unknown} precision ${m.precision_all.ratio} (excl unk ${m.precision_excl_unknown.ratio}) exists ${m.existence.ratio} eval-rule ${m.good_eval_rule.ratio} chains ${m.chains.k}`;
console.log(`${rows.length} of ${sample.rows.length} rows graded by ${summary.graders} graders${ungraded.length ? `; ungraded: ${ungraded.join(', ')}` : ''}`);
for (const t of /** @type {const} */ (['yes', 'weak', 'all'])) console.log(line(t, tiers[t]));
