// OSHA case rates per US store and per US worker for the record book pilot chains.
//   node docs/evidence/record-book/rates.mjs
// Reads the chain case TSVs, Costco's trial sheet (Costco has no TSV) and rates-denominators.tsv,
// and prints Markdown tables for rates.md. The terms it applies are fixed in rates.md,
// "Fixed before lookup".
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const FROM = '2021-11-15';
const TO = '2026-11-15';

/**
 * @typedef {{row: string, source: string, caseId: string, date: string, amountText: string, amount: number|null, name: string, why: string}} CaseRow
 * @typedef {'accepted'|'added back'|'held, not added back'|'not added back'} Sort
 * @typedef {{chain: string, key: string, stores: number, workers: number|null, flag: string}} Denominator
 * @typedef {{k: number, dollars: number}} Count
 * @typedef {{nm1: Count, nm2: Count}} Numerators
 */

/** @type {{key: string, chain: string, readme: number}[]} */
const CHAINS = [
  { key: 'walmart', chain: 'Walmart', readme: 182 },
  { key: 'homedepot', chain: 'Home Depot', readme: 114 },
  { key: 'target', chain: 'Target', readme: 82 },
  { key: 'lowes', chain: "Lowe's", readme: 60 },
  { key: 'costco', chain: 'Costco', readme: 41 },
  { key: 'homegoods', chain: 'HomeGoods', readme: 20 },
  { key: 'bestbuy', chain: 'Best Buy', readme: 12 },
  { key: 'dicks', chain: "DICK'S", readme: 10 },
  { key: 'rei', chain: 'REI', readme: 5 },
  { key: 'ace', chain: 'Ace', readme: 4 },
];

const GROUPS = [['walmart', 'target', 'costco'], ['homedepot', 'lowes'], ['rei', 'dicks']];

/** @type {string[]} */
const unparsed = [];

/**
 * Amount cells are plain numbers in the TSVs and "$1,234" in Costco's sheet; anything else is reported.
 * @param {string} text
 * @param {string} where
 * @returns {number|null}
 */
function parseAmount(text, where) {
  const clean = text.replace(/[$,\s]/g, '');
  if (/^\d+(\.\d+)?$/.test(clean)) return Number(clean);
  unparsed.push(`${where}: "${text}"`);
  return null;
}

/**
 * @param {string} key
 * @returns {CaseRow[]}
 */
function readTsv(key) {
  const lines = readFileSync(join(here, `${key}-cases.tsv`), 'utf8').trim().split('\n');
  const head = lines[0].split('\t');
  const col = (/** @type {string} */ name) => {
    const i = head.indexOf(name);
    if (i < 0) throw new Error(`${key}: no column ${name}`);
    return i;
  };
  const [cRow, cSrc, cId, cDate, cAmt, cName, cWhy] = ['Row', 'Source', 'Case id', 'Action date', 'Amount', 'Name as given', 'Why it belongs'].map(col);
  return lines.slice(1).map((line, n) => {
    const f = line.split('\t');
    if (f.length !== head.length) unparsed.push(`${key} line ${n + 2}: ${f.length} cells, expected ${head.length}`);
    return { row: f[cRow], source: f[cSrc], caseId: f[cId], date: f[cDate], amountText: f[cAmt], amount: f[cSrc] === 'S1' ? parseAmount(f[cAmt], `${key} ${f[cRow]} ${f[cId]}`) : null, name: f[cName], why: f[cWhy] };
  });
}

/**
 * Costco's rows sit in the trial sheet's claims table (13 columns, Amount as "$1,234"). Its excluded
 * rows are only summarized there (Innovel, none with a penalty; three rows before the window).
 * @returns {CaseRow[]}
 */
function readCostcoSheet() {
  const text = readFileSync(join(here, 'trial-costco.md'), 'utf8');
  /** @type {CaseRow[]} */
  const rows = [];
  for (const line of text.split('\n')) {
    const cells = line.split('|').slice(1, -1).map((c) => c.trim());
    if (cells.length !== 13 || !/^C\d+$/.test(cells[0]) || cells[1] !== 'S1') continue;
    rows.push({ row: cells[0], source: 'S1', caseId: cells[2], date: cells[3], amountText: cells[4], amount: parseAmount(cells[4], `costco ${cells[0]}`), name: cells[7], why: cells[10] });
  }
  return rows;
}

/**
 * Sorts an excluded in-window S1 row with a penalty into added back or not, per the fixed terms.
 * Sorting is by reason and by the name given, because one reason label ("none: Fits no rule")
 * covers both the chain's own companies and other businesses.
 * @param {string} key
 * @param {CaseRow} r
 * @returns {Sort}
 */
function sortExcluded(key, r) {
  if (key === 'homegoods') return 'held, not added back';
  if (/^AT4:/.test(r.why)) return 'added back';
  if (/^Not AT2b:/.test(r.why)) return 'added back';
  // Lowe's own companies missing from Exhibit 21, filed under "none" rather than AT4 (sorting call).
  if (key === 'lowes' && /^none:/.test(r.why) && /^(\d+ - )?LOWE'?S HOME IMPROVEMENT/.test(r.name)) return 'added back';
  // A company-owned Ace chain held for the owner (sorting call).
  if (key === 'ace' && /^Ace rule: A chain the 2026-02-18 release places under Ace Retail Holdings/.test(r.why)) return 'added back';
  return 'not added back';
}

/**
 * @param {CaseRow} r
 * @returns {boolean}
 */
const inWindow = (r) => r.date >= FROM && r.date <= TO;

/**
 * @param {CaseRow[]} rows
 * @returns {Numerators}
 */
function count(rows) {
  const sum = (/** @type {CaseRow[]} */ rs) => rs.reduce((s, r) => s + (r.amount ?? 0), 0);
  const big = rows.filter((r) => (r.amount ?? 0) >= 10000);
  return { nm1: { k: rows.length, dollars: sum(rows) }, nm2: { k: big.length, dollars: sum(big) } };
}

/**
 * Poisson P(X <= k) for mean mu, summed in log space.
 * @param {number} k
 * @param {number} mu
 * @returns {number}
 */
function poissonCdf(k, mu) {
  if (k < 0) return 0;
  let logTerm = -mu;
  let total = Math.exp(logTerm);
  for (let i = 1; i <= k; i++) {
    logTerm += Math.log(mu) - Math.log(i);
    total += Math.exp(logTerm);
  }
  return Math.min(1, total);
}

/**
 * Solves f(x) = target for f decreasing in x, by bisection.
 * @param {(x: number) => number} f
 * @param {number} target
 * @param {number} lo
 * @param {number} hi
 * @returns {number}
 */
function bisectDecreasing(f, target, lo, hi) {
  for (let i = 0; i < 200; i++) {
    const mid = (lo + hi) / 2;
    if (f(mid) > target) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

/**
 * Exact (Garwood) 95% interval for a Poisson count k.
 * @param {number} k
 * @returns {[number, number]}
 */
function poissonInterval(k) {
  const hi = k + 20 * Math.sqrt(k + 1) + 20;
  const lower = k === 0 ? 0 : bisectDecreasing((mu) => -(1 - poissonCdf(k - 1, mu)), -0.025, 0, hi);
  const upper = bisectDecreasing((mu) => poissonCdf(k, mu), 0.025, 0, hi);
  return [lower, upper];
}

/** @returns {Record<string, Denominator>} */
function readDenominators() {
  const lines = readFileSync(join(here, 'rates-denominators.tsv'), 'utf8').trim().split('\n');
  const head = lines[0].split('\t');
  /** @type {Record<string, Denominator>} */
  const out = {};
  for (const line of lines.slice(1)) {
    const f = line.split('\t');
    const get = (/** @type {string} */ name) => f[head.indexOf(name)] ?? '';
    out[get('Key')] = { chain: get('Chain'), key: get('Key'), stores: Number(get('US stores')), workers: get('US workers') ? Number(get('US workers')) : null, flag: get('Rate flag') };
  }
  return out;
}

const fmt = (/** @type {number} */ x, d = 2) => x.toFixed(d);
const money = (/** @type {number} */ x) => `$${Math.round(x).toLocaleString('en-US')}`;

// ---- Numerators
const dens = readDenominators();
/** @type {Record<string, {accepted: Numerators, addedBack: Numerators|null, heldTjx: number}>} */
const nums = {};
console.log('## Parse check against README\n');
console.log('| Chain | S1 rows accepted (all dates) | Accepted, in window, penalty above $0 | README OSHA count | Difference |');
console.log('|---|---|---|---|---|');
/** @type {string[]} */
const reasonTables = [];
for (const { key, chain, readme } of CHAINS) {
  const rows = key === 'costco' ? readCostcoSheet() : readTsv(key);
  const s1 = rows.filter((r) => r.source === 'S1');
  const acceptedAll = s1.filter((r) => r.row !== 'excluded');
  const accepted = acceptedAll.filter((r) => inWindow(r) && (r.amount ?? 0) > 0);
  console.log(`| ${chain} | ${acceptedAll.length} | ${accepted.length} | ${readme} | ${accepted.length - readme} |`);

  // Exclusion reasons, every S1 excluded row in the file, with how each was sorted.
  /** @type {Record<string, {rows: number, inWin: number, sorts: Record<string, number>, names: Set<string>}>} */
  const reasons = {};
  /** @type {CaseRow[]} */
  const added = [];
  let heldTjx = 0;
  for (const r of s1.filter((x) => x.row === 'excluded')) {
    const e = (reasons[r.why] ??= { rows: 0, inWin: 0, sorts: {}, names: new Set() });
    e.rows++;
    e.names.add(r.name);
    if (!inWindow(r) || (r.amount ?? 0) <= 0) {
      e.sorts['not added back (outside window or $0)'] = (e.sorts['not added back (outside window or $0)'] ?? 0) + 1;
      continue;
    }
    e.inWin++;
    const s = sortExcluded(key, r);
    e.sorts[s] = (e.sorts[s] ?? 0) + 1;
    if (s === 'added back') added.push(r);
    if (s === 'held, not added back') heldTjx++;
  }
  const lines = [`### ${chain}\n`];
  if (key === 'costco') lines.push('Costco has no TSV; rows were parsed from the claims table in trial-costco.md. Its excluded rows are summarized there, not listed: 3 Innovel inspections with no penalty (AT4), 3 rows before the window, 173 inspections with no penalty. None has a penalty in the window, so nothing is added back.\n');
  else if (!Object.keys(reasons).length) lines.push('No excluded OSHA rows in the file.\n');
  else {
    lines.push('| Exclusion reason (as written in the file) | OSHA rows | In window, penalty above $0 | Sorted as | Names given |', '|---|---|---|---|---|');
    for (const [why, e] of Object.entries(reasons)) {
      const sorts = Object.entries(e.sorts).map(([s, n]) => `${s}: ${n}`).join('; ');
      const names = [...e.names].slice(0, 6).join('; ') + (e.names.size > 6 ? `; and ${e.names.size - 6} more` : '');
      lines.push(`| ${why} | ${e.rows} | ${e.inWin} | ${sorts} | ${names} |`);
    }
    lines.push('');
  }
  reasonTables.push(lines.join('\n'));
  nums[key] = { accepted: count(accepted), addedBack: key === 'homegoods' ? null : count([...accepted, ...added]), heldTjx };
  if (key === 'lowes') {
    const lowesNone = added.filter((r) => /^none:/.test(r.why));
    const without = count([...accepted, ...added.filter((r) => !/^none:/.test(r.why))]);
    reasonTables.push(`Lowe's sorting call: the ${lowesNone.length} "none" rows naming LOWE'S HOME IMPROVEMENT are added back. Without them, "held rows added back" is NM1 ${without.nm1.k}, NM2 ${without.nm2.k}, NM3 ${money(without.nm1.dollars)}.\n`);
  }
}

console.log('\n## Exclusion reasons\n');
console.log(reasonTables.join('\n'));

console.log('## Numerators (OSHA, in window)\n');
console.log('| Chain | NM1 as accepted | NM2 as accepted | NM3 as accepted | NM1 added back | NM2 added back | NM3 added back |');
console.log('|---|---|---|---|---|---|---|');
for (const { key, chain } of CHAINS) {
  const n = nums[key];
  const ab = n.addedBack;
  const abCells = ab ? [ab.nm1.k, ab.nm2.k, money(ab.nm1.dollars)] : [`none (${n.heldTjx} TJX rows held)`, '', ''];
  console.log(`| ${chain} | ${n.accepted.nm1.k} | ${n.accepted.nm2.k} | ${money(n.accepted.nm1.dollars)} | ${abCells.join(' | ')} |`);
}

// ---- Rates
/**
 * @typedef {{key: string, chain: string, version: string, nm: string, dn: string, k: number, rate: number, lo: number, hi: number, small: boolean}} Rate
 */
/** @type {Rate[]} */
const rates = [];
for (const { key, chain } of CHAINS) {
  const d = dens[key];
  for (const [version, n] of /** @type {[string, Numerators|null][]} */ ([['as accepted', nums[key].accepted], ['added back', nums[key].addedBack]])) {
    if (!n) continue;
    for (const nm of /** @type {('nm1'|'nm2')[]} */ (['nm1', 'nm2'])) {
      const k = n[nm].k;
      const [lo, hi] = poissonInterval(k);
      for (const [dn, base, scale] of /** @type {[string, number|null, number][]} */ ([['DN1', d.stores, 100], ['DN2', d.workers, 10000]])) {
        if (!base) continue;
        rates.push({ key, chain, version, nm: nm.toUpperCase(), dn, k, rate: (k / base) * scale, lo: (lo / base) * scale, hi: (hi / base) * scale, small: k < 10 });
      }
    }
  }
}

console.log('\n## Rates\n');
for (const dn of ['DN1', 'DN2']) {
  console.log(dn === 'DN1' ? '### Cases per 100 US stores\n' : '### Cases per 10,000 US workers\n');
  console.log('| Chain | Version | NM1 cases | NM1 rate (95% interval) | NM2 cases | NM2 rate (95% interval) | Flags |');
  console.log('|---|---|---|---|---|---|---|');
  for (const { key, chain } of CHAINS) {
    for (const version of ['as accepted', 'added back']) {
      const r1 = rates.find((r) => r.key === key && r.dn === dn && r.version === version && r.nm === 'NM1');
      const r2 = rates.find((r) => r.key === key && r.dn === dn && r.version === version && r.nm === 'NM2');
      if (!r1 || !r2) continue;
      const flags = [r1.small ? 'small count (NM1)' : '', r2.small ? 'small count (NM2)' : '', dens[key].flag].filter(Boolean).join('; ');
      const d = dn === 'DN1' ? 2 : 3;
      console.log(`| ${chain} | ${version} | ${r1.k} | ${fmt(r1.rate, d)} (${fmt(r1.lo, d)} to ${fmt(r1.hi, d)}) | ${r2.k} | ${fmt(r2.rate, d)} (${fmt(r2.lo, d)} to ${fmt(r2.hi, d)}) | ${flags} |`);
    }
  }
  console.log('');
}

// ---- RT1
/**
 * Orders keys from highest to lowest by a value; ties are shown with "=".
 * @param {{key: string, v: number}[]} items
 * @returns {string}
 */
function order(items) {
  const sorted = [...items].sort((a, b) => b.v - a.v);
  return sorted.map((x, i) => (i === 0 ? '' : sorted[i - 1].v === x.v ? ' = ' : ' > ') + dens[x.key].chain).join('');
}
console.log('## RT1: order by rate against order by raw count\n');
console.log('| Group | Measure | Version | Denominator | Order by raw count | Order by rate | Same order? |');
console.log('|---|---|---|---|---|---|---|');
for (const group of GROUPS) {
  for (const nm of ['NM1', 'NM2']) {
    for (const version of ['as accepted', 'added back']) {
      for (const dn of ['DN1', 'DN2']) {
        const rs = group.map((key) => rates.find((r) => r.key === key && r.nm === nm && r.version === version && r.dn === dn));
        const have = /** @type {Rate[]} */ (rs.filter(Boolean));
        if (have.length < 2) continue;
        const missing = group.filter((key) => !have.some((r) => r.key === key)).map((key) => dens[key].chain);
        const byCount = order(have.map((r) => ({ key: r.key, v: r.k })));
        const byRate = order(have.map((r) => ({ key: r.key, v: r.rate })));
        const label = group.map((key) => dens[key].chain).join(', ') + (missing.length ? ` (no ${dn} for ${missing.join(', ')})` : '');
        console.log(`| ${label} | ${nm} | ${version} | ${dn} | ${byCount} | ${byRate} | ${byCount === byRate ? 'yes' : 'no'} |`);
      }
    }
  }
}

// REI's store count is a floor; how many stores would flip its order against DICK'S.
for (const nm of ['NM1', 'NM2']) {
  const rei = rates.find((r) => r.key === 'rei' && r.nm === nm && r.version === 'as accepted' && r.dn === 'DN1');
  const dk = rates.find((r) => r.key === 'dicks' && r.nm === nm && r.version === 'as accepted' && r.dn === 'DN1');
  if (rei && dk && dk.rate > 0) console.log(`\nREI floor check (${nm}, as accepted): REI's per-store rate equals DICK'S at ${fmt((rei.k / dk.rate) * 100, 0)} stores (floor used: ${dens.rei.stores}).`);
}

// ---- RT2
/**
 * Prints the RT2 table over every chain with a rate, less the keys in `leaveOut`.
 * @param {string} title
 * @param {string[]} leaveOut
 */
function spread(title, leaveOut) {
console.log(`\n## ${title}\n`);
console.log('| Measure | Version | Denominator | Chains | Highest / lowest raw count | Highest / lowest rate | Highest-rate chain (95% interval) | Lowest-rate chain (95% interval) | Intervals overlap? | Call |');
console.log('|---|---|---|---|---|---|---|---|---|---|');
for (const nm of ['NM1', 'NM2']) {
  for (const version of ['as accepted', 'added back']) {
    for (const dn of ['DN1', 'DN2']) {
      const rs = rates.filter((r) => r.nm === nm && r.version === version && r.dn === dn && !leaveOut.includes(r.key));
      if (rs.length < 2) continue;
      const ks = rs.map((r) => r.k);
      const countRatio = Math.min(...ks) === 0 ? 'undefined (a count is 0)' : fmt(Math.max(...ks) / Math.min(...ks), 1);
      const top = rs.reduce((a, b) => (b.rate > a.rate ? b : a));
      const bottom = rs.reduce((a, b) => (b.rate < a.rate ? b : a));
      const rateRatio = bottom.rate === 0 ? Infinity : top.rate / bottom.rate;
      const overlap = top.lo <= bottom.hi;
      const call = rateRatio < 3 ? 'mostly size' : !overlap ? 'more than size' : 'cannot tell';
      const d = dn === 'DN1' ? 2 : 3;
      const note = (/** @type {Rate} */ r) => `${r.chain} ${fmt(r.rate, d)} (${fmt(r.lo, d)} to ${fmt(r.hi, d)}), ${r.k} cases${r.small ? ', small count' : ''}${dens[r.key].flag ? `, ${dens[r.key].flag.split(':')[0]}` : ''}`;
      console.log(`| ${nm} | ${version} | ${dn} | ${rs.map((r) => r.chain).join(', ')} | ${countRatio} | ${Number.isFinite(rateRatio) ? fmt(rateRatio, 1) : 'undefined'} | ${note(top)} | ${note(bottom)} | ${overlap ? 'yes' : 'no'} | ${call} |`);
    }
  }
}
}
spread('RT2: spread', []);
// Ace's rate is flagged weak (cases and stores are different parts of the company), so the
// spread is also shown without it. This is a check on the fixed call, not a replacement for it.
spread('RT2 without Ace (check only)', ['ace']);

console.log('\n## Rows not parsed\n');
console.log(unparsed.length ? unparsed.map((u) => `- ${u}`).join('\n') : 'None.');

// Interval sanity checks against published values.
const [a0, b0] = poissonInterval(0);
const [a10, b10] = poissonInterval(10);
console.error(`check: k=0 -> (${fmt(a0, 3)}, ${fmt(b0, 3)}); k=10 -> (${fmt(a10, 2)}, ${fmt(b10, 2)})`);
