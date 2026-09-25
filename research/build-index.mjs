// Builds research/index.json from the front matter of research/sites/*.md and
// research/retailers/*.md, and fails on missing or malformed fields. The derived
// fields (accepted_source, ethics, environment, tier, mentions, amazon_owned, score)
// are recomputed here so an agent's arithmetic can't drift from the rules in brief.md.
import { readFileSync, readdirSync, existsSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'yaml';
import { getDomain, getDomainWithoutSuffix } from 'tldts';

const HERE = dirname(fileURLToPath(import.meta.url));
const DATA = join(HERE, '..', 'data');
const readJson = (p) => JSON.parse(readFileSync(p, 'utf8'));

const blocklist = readJson(join(DATA, 'blocklist.json'));
const acceptedDomains = new Set(readJson(join(DATA, 'negative-sources.json')).sources.map((s) => s.domain));
const curatedCerts = readJson(join(DATA, 'certifications.json')).entries;

export const CATEGORIES = ['clickbait', 'affiliate-funnel', 'ethical-anti-amazon', 'ethical-anti-bigbox', 'ethical-affirmative', 'tool'];
export const SITE_KINDS = ['article', 'app', 'database', 'directory', 'extension', 'campaign'];
export const AFFILIATE = ['none', 'disclosed', 'undisclosed', 'unknown'];
export const PART_MAX = { independence: 20, evidence: 20, substance: 20, currency: 15, usefulness: 15, no_dark_patterns: 10 };
export const RETAILER_TYPES = ['retailer', 'marketplace', 'co-op', 'secondhand', 'brand', 'grocer'];
export const OWNERSHIP = ['public', 'private', 'private-equity', 'cooperative', 'employee-owned', 'nonprofit', 'public-benefit-corporation', 'unknown'];
export const ETHICS_CERTS = ['b_corp', 'fair_trade', 'worker_coop'];
export const ENV_CERTS = ['one_percent_planet', 'climate_neutral'];
export const ETHICS_CONCERNS = ['labor', 'governance'];
export const ENV_CONCERNS = ['environmental'];
export const TIERS = ['excluded', 'recommended', 'acceptable', 'caution'];

const DATE = /^\d{4}-\d{2}-\d{2}$/;
const isDate = (v) => typeof v === 'string' && DATE.test(v);
const isUrl = (v) => {
  try {
    return ['http:', 'https:'].includes(new URL(v).protocol);
  } catch {
    return false;
  }
};

export const registrable = (hostOrUrl) => {
  try {
    return getDomain(hostOrUrl.includes('://') ? new URL(hostOrUrl).hostname : hostOrUrl);
  } catch {
    return null;
  }
};
export const slugOf = (domain) => domain.replace(/\./g, '-');
export const isAcceptedSource = (url) => acceptedDomains.has(registrable(url) ?? '');

// A simplified copy of proxy/src/blocklist.ts: domains by exact match or label, names by
// whole words. Good enough for the researched retailers; the Worker's check stays authoritative.
const norm = (s) => s.normalize('NFKC').toLowerCase().replace(/[\p{P}\p{S}\s]+/gu, ' ').trim();
export function blocklistMatch(name, domain) {
  const reg = registrable(domain) ?? domain;
  const label = getDomainWithoutSuffix(reg) ?? '';
  const byDomain = blocklist.domains.find((d) => (d.kind === 'exact' ? d.pattern === reg : d.pattern === label));
  if (byDomain) return byDomain.pattern;
  const n = norm(name);
  const starts = (key) => n === key || n.startsWith(`${key} `);
  const byName = blocklist.names.find((e) => {
    const key = norm(e.name);
    const hit = e.match === 'prefix-word' ? starts(key) : n === key;
    return hit && !(e.except ?? []).some((x) => starts(norm(x)));
  });
  return byName ? byName.name : null;
}

const q = (x) => Math.round(x * 4) / 4;
const yearsBefore = (date, years) => `${Number(date.slice(0, 4)) - years}${date.slice(4)}`;

// Brief section 5, mirroring docs/ranking.md: cap certifications first, then subtract findings.
export function rateRetailer({ certifications = [], concerns = [], amazon_owned = false, today }) {
  const kinds = new Set(certifications.map((c) => c.kind));
  const counted = new Map();
  for (const c of concerns) if (c.accepted_source) counted.set(`${c.kind} ${c.source}`, c);
  const accepted = [...counted.values()];
  const component = (certKinds, concernKinds) => {
    const up = Math.min(1, 0.5 + 0.25 * certKinds.filter((k) => kinds.has(k)).length);
    return Math.max(0, q(up - 0.25 * accepted.filter((c) => concernKinds.includes(c.kind)).length));
  };
  const ethics = component(ETHICS_CERTS, ETHICS_CONCERNS);
  const environment = component(ENV_CERTS, ENV_CONCERNS);
  // An accepted concern with an unknown date counts as recent: the cautious reading.
  const cutoff = yearsBefore(today, 5);
  const recent = accepted.some((c) => !isDate(c.date) || c.date >= cutoff);
  let tier = 'caution';
  if (amazon_owned) tier = 'excluded';
  else if (ethics + environment >= 1.25 && !recent) tier = 'recommended';
  else if (ethics + environment >= 1.0) tier = 'acceptable';
  return { ethics, environment, tier };
}

export function splitFrontMatter(text) {
  const m = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(text);
  if (!m) throw new Error('no front matter block');
  const fm = parse(m[1]);
  if (!fm || typeof fm !== 'object' || Array.isArray(fm)) throw new Error('front matter is not a map');
  return { fm, body: m[2] };
}

function commonChecks(fm, body, slug, err) {
  if (typeof fm.name !== 'string' || !fm.name.trim()) err('name missing');
  if (typeof fm.domain !== 'string' || registrable(fm.domain) !== fm.domain) err(`domain must be a registrable domain, got ${JSON.stringify(fm.domain)}`);
  else if (slugOf(fm.domain) !== slug) err(`file name should be ${slugOf(fm.domain)}.md`);
  if (!isDate(fm.checked)) err('checked must be YYYY-MM-DD');
  if (!/^## Sources\s*$/m.test(body) || !/https?:\/\//.test(body.split(/^## Sources\s*$/m)[1] ?? '')) err('body needs a "## Sources" section with at least one URL');
}

export function validateSite(fm, body, slug) {
  const errors = [];
  const err = (m) => errors.push(m);
  commonChecks(fm, body, slug, err);
  if (!isUrl(fm.url)) err('url must be http(s)');
  if (!SITE_KINDS.includes(fm.kind)) err(`kind must be one of ${SITE_KINDS.join(', ')}`);
  if (!CATEGORIES.includes(fm.category)) err(`category must be one of ${CATEGORIES.join(', ')}`);
  if (!Array.isArray(fm.also) || fm.also.some((c) => !CATEGORIES.includes(c) || c === fm.category)) err('also must be a list of other categories');
  if (!AFFILIATE.includes(fm.affiliate_links)) err(`affiliate_links must be one of ${AFFILIATE.join(', ')}`);
  if (typeof fm.owner !== 'string' || !fm.owner) err('owner missing (use unknown)');
  if (fm.updated !== 'unknown' && !isDate(fm.updated)) err('updated must be YYYY-MM-DD or unknown');
  if (!Number.isInteger(fm.retailers_listed) || fm.retailers_listed < 0) err('retailers_listed must be a whole number');
  if (!Array.isArray(fm.amazon_owned_recommended)) err('amazon_owned_recommended must be a list');
  const parts = fm.score_parts;
  if (!parts || typeof parts !== 'object') err('score_parts missing');
  else {
    for (const [k, max] of Object.entries(PART_MAX)) {
      if (!Number.isInteger(parts[k]) || parts[k] < 0 || parts[k] > max) err(`score_parts.${k} must be a whole number 0 to ${max}`);
    }
    const extra = Object.keys(parts).filter((k) => !(k in PART_MAX));
    if (extra.length) err(`unknown score_parts: ${extra.join(', ')}`);
    const sum = Object.keys(PART_MAX).reduce((s, k) => s + (Number(parts[k]) || 0), 0);
    if (fm.score !== sum) err(`score is ${fm.score} but score_parts sum to ${sum}`);
  }
  return errors;
}

export function validateRetailer(fm, body, slug, siteSlugs) {
  const errors = [];
  const err = (m) => errors.push(m);
  commonChecks(fm, body, slug, err);
  if (!RETAILER_TYPES.includes(fm.type)) err(`type must be one of ${RETAILER_TYPES.join(', ')}`);
  if (!Array.isArray(fm.goods) || !fm.goods.length) err('goods must be a non-empty list');
  if (!OWNERSHIP.includes(fm.ownership)) err(`ownership must be one of ${OWNERSHIP.join(', ')}`);
  for (const k of ['parent', 'hq']) if (typeof fm[k] !== 'string' || !fm[k]) err(`${k} missing (use unknown)`);
  for (const k of ['marketplace', 'sells_on_amazon']) if (typeof fm[k] !== 'boolean' && fm[k] !== 'unknown') err(`${k} must be true, false or unknown`);
  const match = typeof fm.name === 'string' && typeof fm.domain === 'string' ? blocklistMatch(fm.name, fm.domain) : null;
  if (fm.amazon_owned !== Boolean(match)) err(`amazon_owned must be ${Boolean(match)}${match ? ` (blocklist entry "${match}")` : ' (no blocklist match)'}`);
  const certs = Array.isArray(fm.certifications) ? fm.certifications : (err('certifications must be a list'), []);
  certs.forEach((c, i) => {
    if (![...ETHICS_CERTS, ...ENV_CERTS].includes(c?.kind)) err(`certifications[${i}].kind is not a scored kind`);
    if (!isUrl(c?.source)) err(`certifications[${i}].source must be a URL`);
    if (!isDate(c?.checked)) err(`certifications[${i}].checked must be YYYY-MM-DD`);
    if (typeof c?.verified_this_run !== 'boolean') err(`certifications[${i}].verified_this_run must be true or false`);
    else if (!c.verified_this_run && !curatedCerts.some((e) => e.domain === fm.domain && e.kind === c.kind && e.source_url === c.source)) {
      err(`certifications[${i}] is not verified this run and has no matching row in data/certifications.json`);
    }
  });
  const concerns = Array.isArray(fm.concerns) ? fm.concerns : (err('concerns must be a list'), []);
  concerns.forEach((c, i) => {
    if (![...ETHICS_CONCERNS, ...ENV_CONCERNS].includes(c?.kind)) err(`concerns[${i}].kind must be labor, governance or environmental`);
    if (typeof c?.title !== 'string' || !c.title) err(`concerns[${i}].title missing`);
    if (!isUrl(c?.source)) err(`concerns[${i}].source must be a URL`);
    if (c?.date !== 'unknown' && !isDate(c?.date)) err(`concerns[${i}].date must be YYYY-MM-DD or unknown`);
    if (isUrl(c?.source) && c.accepted_source !== isAcceptedSource(c.source)) err(`concerns[${i}].accepted_source must be ${isAcceptedSource(c.source)}`);
  });
  if (isDate(fm.checked)) {
    const want = rateRetailer({ certifications: certs, concerns, amazon_owned: Boolean(match), today: fm.checked });
    for (const k of ['ethics', 'environment', 'tier']) if (fm[k] !== want[k]) err(`${k} is ${JSON.stringify(fm[k])} but the rules give ${JSON.stringify(want[k])}`);
  }
  if (!Array.isArray(fm.mentioned_by)) err('mentioned_by must be a list');
  else {
    if (fm.mentions !== fm.mentioned_by.length) err(`mentions is ${fm.mentions} but mentioned_by has ${fm.mentioned_by.length}`);
    const missing = fm.mentioned_by.filter((s) => !siteSlugs.has(s));
    if (missing.length) err(`mentioned_by names sites with no file: ${missing.join(', ')}`);
  }
  return errors;
}

function readDir(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => f.endsWith('.md'))
    .sort()
    .map((f) => ({ file: f, slug: f.slice(0, -3), text: readFileSync(join(dir, f), 'utf8') }));
}

export function buildIndex(root = HERE) {
  const errors = [];
  const load = (sub, validate) =>
    readDir(join(root, sub)).flatMap(({ file, slug, text }) => {
      try {
        const { fm, body } = splitFrontMatter(text);
        const errs = validate(fm, body, slug);
        errors.push(...errs.map((e) => `${sub}/${file}: ${e}`));
        return errs.length ? [] : [{ slug, ...fm }];
      } catch (e) {
        errors.push(`${sub}/${file}: ${e.message}`);
        return [];
      }
    });
  const sites = load('sites', validateSite);
  const siteSlugs = new Set(readDir(join(root, 'sites')).map((s) => s.slug));
  const retailers = load('retailers', (fm, body, slug) => validateRetailer(fm, body, slug, siteSlugs));
  return { errors, index: { sites, retailers } };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const { errors, index } = buildIndex();
  if (errors.length) {
    console.error(errors.join('\n'));
    console.error(`\n${errors.length} error(s); research/index.json not written.`);
    process.exit(1);
  }
  writeFileSync(join(HERE, 'index.json'), `${JSON.stringify(index, null, 2)}\n`);
  console.log(`index.json: ${index.sites.length} sites, ${index.retailers.length} retailers`);
}
