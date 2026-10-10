// Step 2 of the open place data precision check (docs/open-place-precision.md): from the raw
// Overture rows per search (raw/<search_id>.json, written by query-overture.py), keep the rows
// inside the nearby radius by haversine distance from the zip centroid, judge each with the
// coverage check's category rule (`yes` or `weak`; the SQL already excluded `no`), drop rows whose
// operating_status is set and not "open", drop exact duplicates (same name and street address,
// keeping the nearest), then take the 10 nearest `yes` and the 5 nearest `weak` rows per search.
// Writes sample.json (the rows with every Overture field the report uses), counts.json (per-search
// candidate counts, since raw/ is not committed), to-grade.json (the blinded rows a grader sees)
// and briefs/batch-NN.md (one grader brief per batch of about 30 rows).
//   node docs/evidence/quality/open-place-precision/build-sample.mjs
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';

const DIR = 'docs/evidence/quality/open-place-precision';
const rules = JSON.parse(readFileSync('docs/evidence/quality/open-place-coverage/category-rules.json', 'utf8'));
const ids = JSON.parse(readFileSync('docs/evidence/quality/eval20-0925/method/ids.json', 'utf8')).ids;
const YES_PER_SEARCH = 10;
const WEAK_PER_SEARCH = 5;
const BATCH_SIZE = 30;
const THIN = 3;

/**
 * @typedef {object} RawRow
 * @property {string} id
 * @property {string | null} name
 * @property {string | null} basic_category
 * @property {string | null} taxonomy_primary
 * @property {string[] | null} taxonomy_hierarchy
 * @property {number | null} confidence
 * @property {string[] | null} websites
 * @property {string[] | null} phones
 * @property {string | null} brand
 * @property {string | null} brand_wikidata
 * @property {string | null} address
 * @property {string | null} locality
 * @property {string | null} region
 * @property {string | null} postcode
 * @property {string | null} source_dataset
 * @property {string | null} source_update_time
 * @property {string | null} operating_status
 * @property {number | null} version
 * @property {number} lon
 * @property {number} lat
 */

/**
 * @typedef {object} SampleRow
 * @property {string} row_id
 * @property {string} search_id
 * @property {string} product
 * @property {string} category
 * @property {string} zip
 * @property {string} zip_kind
 * @property {number | null} zip_ruca
 * @property {'yes' | 'weak'} tier
 * @property {string} tier_by
 * @property {'leaf' | 'ancestor'} tier_by_level
 * @property {number} rank_in_tier
 * @property {string} overture_id
 * @property {string | null} name
 * @property {string | null} brand
 * @property {string | null} basic_category
 * @property {string | null} taxonomy_primary
 * @property {string[] | null} taxonomy_hierarchy
 * @property {string | null} address
 * @property {string | null} locality
 * @property {string | null} region
 * @property {string | null} postcode
 * @property {number} lat
 * @property {number} lon
 * @property {number} distance_mi
 * @property {string | null} website
 * @property {string | null} phone
 * @property {string | null} operating_status
 * @property {string | null} source_dataset
 * @property {string | null} source_update_time
 * @property {number | null} confidence
 */

const round = (/** @type {number} */ x) => Math.round(x * 100) / 100;
const normName = (/** @type {string | null} */ s) => (s ?? '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();

/** Haversine distance in miles (same formula as the coverage check's radius.mjs). */
function distanceMi(lat1, lon1, lat2, lon2) {
  const toRad = (/** @type {number} */ d) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 3958.8 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/**
 * Mirror of judgeOverture in open-place-coverage/match.mjs: any `yes` category wins, then any
 * `weak` one (the category's own list or the shared general-merchant list), else `no`.
 * @param {string} category
 * @param {RawRow} row
 * @returns {{usable: 'yes' | 'weak' | 'no', by: string}}
 */
function judge(category, row) {
  const rule = rules.categories[category];
  const present = [...new Set([row.taxonomy_primary, ...(row.taxonomy_hierarchy ?? []), row.basic_category].filter(Boolean))];
  if (!present.length) return { usable: 'no', by: 'no category' };
  for (const t of present) if (rule.overture_yes.includes(t)) return { usable: 'yes', by: t };
  for (const t of present) if (rule.overture_weak.includes(t) || rules.overture_weak_all.includes(t)) return { usable: 'weak', by: t };
  return { usable: 'no', by: `${row.basic_category} / ${row.taxonomy_primary}` };
}

/** Deterministic shuffle (mulberry32 over a fixed seed) so to-grade.json never groups rows by search or tier. */
function shuffled(/** @type {SampleRow[]} */ rows, seed = 20261009) {
  let s = seed;
  const rand = () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const out = [...rows];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [/** @type {SampleRow} */ (out[j]), /** @type {SampleRow} */ (out[i])];
  }
  return out;
}

/** @type {SampleRow[]} */
const sample = [];
/** @type {Record<string, object>} */
const counts = {};
for (const sid of ids) {
  const file = `${DIR}/raw/${sid}.json`;
  if (!existsSync(file)) throw new Error(`missing ${file}; run query-overture.py first`);
  const raw = JSON.parse(readFileSync(file, 'utf8'));
  /** @type {RawRow[]} */
  const rows = raw.rows;
  const inRadius = rows
    .map((r) => ({ r, d: distanceMi(raw.center.lat, raw.center.lon, r.lat, r.lon), j: judge(raw.category, r) }))
    .filter((x) => x.d <= raw.radius_mi && x.j.usable !== 'no')
    .sort((a, b) => a.d - b.d);
  /** @type {Record<string, number>} */
  const droppedStatus = {};
  const open = inRadius.filter((x) => {
    const st = x.r.operating_status;
    if (st == null || st === 'open') return true;
    droppedStatus[st] = (droppedStatus[st] ?? 0) + 1;
    return false;
  });
  const seen = new Set();
  let duplicates = 0;
  const deduped = open.filter((x) => {
    const key = `${normName(x.r.name)}|${normName(x.r.address)}`;
    if (seen.has(key)) {
      duplicates++;
      return false;
    }
    seen.add(key);
    return true;
  });
  const byTier = { yes: deduped.filter((x) => x.j.usable === 'yes'), weak: deduped.filter((x) => x.j.usable === 'weak') };
  counts[sid] = {
    product: raw.product, category: raw.category, zip: raw.zip, zip_kind: raw.zip_kind, zip_ruca: raw.zip_ruca, radius_mi: raw.radius_mi,
    rows_in_bbox: rows.length, in_radius_yes_or_weak: inRadius.length,
    dropped_not_open: droppedStatus, dropped_duplicates: duplicates,
    yes_in_radius: byTier.yes.length, weak_in_radius: byTier.weak.length,
    yes_sampled: Math.min(YES_PER_SEARCH, byTier.yes.length), weak_sampled: Math.min(WEAK_PER_SEARCH, byTier.weak.length),
    thin_yes_section: byTier.yes.length < THIN,
    farthest_sampled_yes_mi: byTier.yes.length ? round(/** @type {{d: number}} */ (byTier.yes[Math.min(YES_PER_SEARCH, byTier.yes.length) - 1]).d) : null,
  };
  for (const tier of /** @type {const} */ (['yes', 'weak'])) {
    const picked = byTier[tier].slice(0, tier === 'yes' ? YES_PER_SEARCH : WEAK_PER_SEARCH);
    picked.forEach((x, i) => {
      const r = x.r;
      sample.push({
        row_id: '', search_id: sid, product: raw.product, category: raw.category, zip: raw.zip, zip_kind: raw.zip_kind, zip_ruca: raw.zip_ruca,
        // `leaf` when the deciding category is the row's own taxonomy.primary; `ancestor` when only a parent in
        // taxonomy.hierarchy or the coarse basic_category matched (hardware_home_and_garden_store sits above roofers and mattress stores).
        tier, tier_by: x.j.by, tier_by_level: x.j.by === r.taxonomy_primary ? 'leaf' : 'ancestor', rank_in_tier: i + 1, overture_id: r.id, name: r.name, brand: r.brand ?? null,
        basic_category: r.basic_category, taxonomy_primary: r.taxonomy_primary, taxonomy_hierarchy: r.taxonomy_hierarchy,
        address: r.address, locality: r.locality, region: r.region, postcode: r.postcode, lat: r.lat, lon: r.lon, distance_mi: round(x.d),
        website: r.websites?.[0] || null, phone: r.phones?.[0] || null, operating_status: r.operating_status ?? null,
        source_dataset: r.source_dataset, source_update_time: r.source_update_time, confidence: r.confidence,
      });
    });
  }
}

// Row ids are assigned in shuffled order so neither the id nor the position in to-grade.json says which search or tier a row came from.
const order = shuffled(sample);
order.forEach((row, i) => {
  row.row_id = `r${String(i + 1).padStart(3, '0')}`;
});
sample.sort((a, b) => ids.indexOf(a.search_id) - ids.indexOf(b.search_id) || a.tier.localeCompare(b.tier) || a.rank_in_tier - b.rank_in_tier);

const fullAddress = (/** @type {SampleRow} */ r) => [r.address, r.locality, r.region, r.postcode].filter(Boolean).join(', ') || null;
const toGrade = order.map((r) => ({ row_id: r.row_id, product: r.product, name: r.name, address: fullAddress(r), website: r.website, phone: r.phone }));

writeFileSync(`${DIR}/sample.json`, JSON.stringify({ release: 'see raw/*.json and query-overture.py', yes_per_search: YES_PER_SEARCH, weak_per_search: WEAK_PER_SEARCH, rows: sample }, null, 1) + '\n');
writeFileSync(`${DIR}/counts.json`, JSON.stringify(counts, null, 1) + '\n');
writeFileSync(`${DIR}/to-grade.json`, JSON.stringify(toGrade, null, 1) + '\n');

// Grader briefs: one text file per batch, the rules plus that batch's rows and nothing else.
const briefTemplate = readFileSync(`${DIR}/briefs/TEMPLATE.md`, 'utf8');
mkdirSync(`${DIR}/briefs`, { recursive: true });
const batches = [];
for (let i = 0; i < toGrade.length; i += BATCH_SIZE) batches.push(toGrade.slice(i, i + BATCH_SIZE));
batches.forEach((batch, i) => {
  const n = String(i + 1).padStart(2, '0');
  const text = briefTemplate.replace(/\{\{BATCH\}\}/g, n).replace('{{ROWS}}', JSON.stringify(batch, null, 1));
  writeFileSync(`${DIR}/briefs/batch-${n}.md`, text);
});

const tally = (/** @type {'yes' | 'weak'} */ t) => sample.filter((r) => r.tier === t).length;
console.log(`${sample.length} rows (${tally('yes')} yes, ${tally('weak')} weak) across ${ids.length} searches, ${batches.length} batches; thin yes sections: ${Object.entries(counts).filter(([, c]) => /** @type {{thin_yes_section: boolean}} */ (c).thin_yes_section).map(([k]) => k).join(', ') || 'none'}`);
