// Recomputes ethics and environment for every researched retailer with accepted concerns
// under ADR 0006 (weighted findings, operator rulings of 2026-09-26), beside the flat rule.
// Run from the repo root: node docs/evidence/weighted-findings/recompute.mjs
//
// The research rows (research/index.json) record no penalty amount, relation or status.
// The tables below hold those facts by hand, each with the research file and line, or the
// source page, it was read from. Phase B records the same facts in data/negatives.json.
import { readFileSync } from 'node:fs';

const STEP = 0.25;
const BAND = { major: 1, standard: 0.5, minor: 0.25 };
const MAJOR_USD = 1_000_000;
const STANDARD_USD = 100_000;
const MINOR_CAP = 0.25; // total cost of minor findings per dimension
const RELATION = { self: 1, 'related-at-shop': 1, related: 0.5 };

// Amounts not in the row title. Key: source URL, or domain|date where OSHA rows share a title.
const AMOUNTS = {
  'https://www.courtlistener.com/api/rest/v4/search/?q=docket_id%3A6250398&type=rd&format=json': 11_000_000, // walmart-com.md:36
  'https://www.osha.gov/ords/imis/establishment.inspection_detail?id=1763330.015': 9_403, // costco-com.md:31
  'https://www.osha.gov/ords/imis/establishment.inspection_detail?id=1640222.015': 1_330, // costco-com.md:32
  'https://www.osha.gov/ords/imis/establishment.inspection_detail?id=1356334.015': 560, // costco-com.md:33
  'https://oag.ca.gov/prop65/60-Day-Notice-2022-00855': 4_000, // patagonia-com.md:47 (civil penalty)
  'https://oag.ca.gov/prop65/60-Day-Notice-2022-02550': 5_000, // the page's "Civil Penalty" field, read 2026-09-26; not in the research
  'https://www.osha.gov/ords/imis/establishment.inspection_detail?id=1637323.015': 1_350, // bobsredmill-com.md:35
  'https://www.osha.gov/ords/imis/establishment.inspection_detail?id=1700421.015': 13_828, // barnesandnoble-com.md:29
  'https://www.osha.gov/ords/imis/establishment.inspection_detail?id=1815510.015': 1_773, // thredup-com.md:27
  'https://www.osha.gov/ords/imis/establishment.inspection_detail?id=1724624.015': 3_306, // thrivemarket-com.md:27
  'avocadogreenmattress.com|2022-08-11': 3_000, // avocadogreenmattress-com.md:32
  'avocadogreenmattress.com|2023-08-16': 935,
  'azurestandard.com|2022-03-10': 1_800, // azurestandard-com.md:29
  'azurestandard.com|2023-03-08': 1_000,
  'azurestandard.com|2023-05-26': 570,
  'chewy.com|2023-05-03': 10_000, // chewy-com.md:30
  'chewy.com|2022-01-14': 5_851,
  'chewy.com|2019-09-27': 4_347,
  'chewy.com|2017-04-20': 6_156,
  'bhphotovideo.com|2022-02-17': 14_502, // bhphotovideo-com.md:28
  'bhphotovideo.com|2019-06-06': 7_085,
  'overstock.com|2017-06-02': 6_828_000, // overstock-com.md:35
  'target.com|2011-07-21': 160_000, // target-com.md:34
};

// Rows whose page names a related company, not the shop (research file and line for the tie).
const RELATED = {
  'https://oag.ca.gov/prop65/60-Day-Notice-2022-00855': 'related', // Patagonia Provisions, sister; patagonia-com.md:19
  'https://oag.ca.gov/prop65/60-Day-Notice-2022-02550': 'related', // patagonia-com.md:20
  'https://oag.ca.gov/prop65/60-Day-Notice-2024-04838': 'related', // patagonia-com.md:21
  'depop.com|2024-01-11': 'related', // parent eBay; depop-com.md:14
  // Warehouse the shop ships from; operator ruling 2026-09-27 (W6) moved these from `related` to
  // `related-at-shop` (full weight) after the recommendation predating ruling 4's split.
  'azurestandard.com|2022-03-10': 'related-at-shop',
  'azurestandard.com|2023-03-08': 'related-at-shop',
  'azurestandard.com|2023-05-26': 'related-at-shop',
  'avocadogreenmattress.com|2022-08-11': 'related-at-shop', // parent's inspection at the shop's own factory; avocadogreenmattress-com.md:32
  'avocadogreenmattress.com|2023-08-16': 'related-at-shop',
};

const OPEN = new Set(['https://www.nlrb.gov/case/01-CA-355597']); // costco-com.md:34
// OSHA rows whose counted citations DOL marks willful (W) or repeat (R): none today
// (research/raw/osha-dol/*.json, viol_type is O or S on every counted citation).
const WILLFUL_OR_REPEAT = new Set();

const keyOf = (domain, c) => `${domain}|${c.date}`;

function amount(domain, c) {
  const k = keyOf(domain, c);
  if (k in AMOUNTS) return AMOUNTS[k];
  if (c.source in AMOUNTS) return AMOUNTS[c.source];
  const m = /\$([\d,.]+)\s*(million)?/i.exec(c.title);
  if (!m) return null; // not recorded in the research; Phase B reads the source
  const v = Number(m[1].replaceAll(',', ''));
  return m[2] ? Math.round(v * 1_000_000) : Math.round(v);
}

function band(domain, c) {
  if (OPEN.has(c.source)) return 'minor';
  if (WILLFUL_OR_REPEAT.has(c.source)) return 'standard';
  const a = amount(domain, c);
  if (a === null) return 'standard';
  if (a >= MAJOR_USD) return 'major';
  if (a >= STANDARD_USD) return 'standard';
  return 'minor';
}

const relation = (domain, c) => RELATED[keyOf(domain, c)] ?? RELATED[c.source] ?? 'self';

function cost(domain, c) {
  const b = band(domain, c);
  const r = relation(domain, c);
  return { band: b, relation: r, cost: STEP * BAND[b] * RELATION[r] };
}

function dimension(domain, certs, concerns, certKinds, negKinds) {
  const kinds = new Set(certs.filter((k) => certKinds.has(k.kind)).map((k) => k.kind));
  const base = Math.min(1, 0.5 + STEP * kinds.size);
  const rows = concerns.filter((c) => negKinds.has(c.kind)).map((c) => ({ ...c, ...cost(domain, c) }));
  const minor = Math.min(MINOR_CAP, rows.filter((r) => r.band === 'minor').reduce((s, r) => s + r.cost, 0));
  const other = rows.filter((r) => r.band !== 'minor').reduce((s, r) => s + r.cost, 0);
  return {
    flat: Math.max(0, base - STEP * rows.length),
    weighted: Math.max(0, base - minor - other),
    rows,
  };
}

const ETHICS = { certs: new Set(['b_corp', 'fair_trade', 'worker_coop']), negs: new Set(['labor', 'governance']) };
const ENV = { certs: new Set(['one_percent_planet', 'climate_neutral']), negs: new Set(['environmental']) };

const index = JSON.parse(readFileSync(new URL('../../../research/index.json', import.meta.url), 'utf8'));
for (const r of index.retailers) {
  const concerns = r.concerns.filter((c) => c.accepted_source && c.date !== 'unknown'); // Q3 drops the undated row
  if (concerns.length === 0) continue;
  const e = dimension(r.domain, r.certifications, concerns, ETHICS.certs, ETHICS.negs);
  const v = dimension(r.domain, r.certifications, concerns, ENV.certs, ENV.negs);
  console.log(`${r.domain.padEnd(26)} ethics ${e.flat.toFixed(5)} -> ${e.weighted.toFixed(5)}   env ${v.flat.toFixed(5)} -> ${v.weighted.toFixed(5)}`);
  for (const row of [...e.rows, ...v.rows]) {
    const a = amount(r.domain, row);
    console.log(`    ${row.kind.padEnd(13)} ${row.date} ${String(a ?? 'not recorded').padStart(13)} ${row.band.padEnd(8)} ${row.relation.padEnd(15)} ${row.cost.toFixed(5)}`);
  }
}
