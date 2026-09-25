import certifications from '../../data/certifications.json';
import negatives from '../../data/negatives.json';
import registry from '../../data/negative-sources.json';
import { WEIGHTS } from '../ranking/weights';
import { rankByScore, scoreCandidate, type ScoreInput } from '../ranking/score';
import { filterBlocked, isBlocked, isBlockedDomain, isBlockedUrl, mentionsAmazon, scrubBlockedText } from './blocklist';
import { createBraveClient, type BraveClient } from './brave';
import type {
  Candidate, Dropped, Env, Deps, LlmUsage, Normalized, ResultKind, SearchRequest, SearchResponse, SearchResult, Usage,
} from './contract';
import { enrichAll, type CertificationRow, type CuratedData, type EnrichedRow, type NegativeRow } from './enrich';
import { InvalidLlmOutput } from './errors';
import { NORMALIZE_MAX_TOKENS, createLlmClient, type LlmClient } from './llm';
import { dropReason, isEditorialUrl, splitEditorial } from './precision';
import { estimateCost } from './pricing';
import { buildNormalizePrompt } from './prompts';

export const MAX_SIMILAR_PRODUCTS = 6;
export const MAX_ONLINE_QUERIES = 3;
export const MAX_LOCAL_QUERIES = 2;
export const MAX_RESULTS_PER_SECTION = 10;
export const MAX_DROPPED = 60;
export const MAX_BRANCHES_PER_DOMAIN = 2;
export const MAX_FARTHER = 3;
export const MAX_LOCAL_MILES = 100;
const KM_PER_MILE = 1.609344;

// RUCA 1-3 is metropolitan; 4-10 (micropolitan, small town, rural) spreads shops farther apart.
// A zip with no code gets the metropolitan radius.
export function nearRadiusMiles(ruca: number | undefined): number {
  return ruca !== undefined && ruca >= 4 ? 30 : 10;
}

const negativeSourceDomains: ReadonlySet<string> = new Set(registry.sources.map((s) => s.domain));

// JSON imports type `kind` as string; proxy/test/data.test.ts checks every row's kind
// against the contract unions, which is what makes these casts safe.
const curated: CuratedData = {
  certifications: certifications.entries as CertificationRow[],
  negatives: negatives.entries as NegativeRow[],
  negativeSources: negativeSourceDomains,
};

// A place the category rule removed is reported once per domain, and only if the blocklist
// would have let it through, so `dropped` never names a blocked shop.
export function placeCategoryDrops(rejected: readonly Candidate[]): Dropped[] {
  const domains = new Set(rejected.filter((c) => !isBlocked(c)).map((c) => c.domain));
  return [...domains].map((domain) => ({ kind: 'local', domain, reason: 'place_category' }));
}

// The input is kept beside the result so a row can be rescored after its sources are scrubbed.
export interface ScoredRow { input: ScoreInput; result: Omit<SearchResult, 'rank'> }

function truncate(n: Normalized): Normalized {
  return {
    ...n,
    similar_products: n.similar_products.slice(0, MAX_SIMILAR_PRODUCTS),
    online_queries: n.online_queries.slice(0, MAX_ONLINE_QUERIES),
    local_queries: n.local_queries.slice(0, MAX_LOCAL_QUERIES),
  };
}

const words = (s: string) => s.toLowerCase().split(/\s+/).map((w) => w.replace(/[.,:;!?]+$/, '')).filter(Boolean);

// These words pull review roundups instead of shops. One the shopper typed stays ("tank top").
const EDITORIAL_QUERY_WORDS: ReadonlySet<string> = new Set(['best', 'top', 'review', 'reviews', 'vs']);
export function shopQuery(q: string, product: string): string {
  const typed = new Set(words(product));
  return q.split(/\s+/).filter((w) => {
    const [word] = words(w);
    return !word || !EDITORIAL_QUERY_WORDS.has(word) || typed.has(word);
  }).join(' ').trim();
}

// A place search for a room or an activity ("kitchen", "camping") returned remodelers and
// camps; naming a kind of store keeps it to shops.
// "Shop" becomes "store" because the model picks between them at random, and one word
// changed which shops Brave returned (docs/quality.md, run-to-run changes).
const STORE_WORDS: ReadonlySet<string> = new Set(['store', 'stores', 'shop', 'shops', 'outfitters']);
export function storeQuery(q: string): string {
  const last = words(q).at(-1);
  if (!last || !STORE_WORDS.has(last)) return `${q} store`;
  return q.replace(/\bshop(s?)([.,:;!?]*)\s*$/i, 'store$1$2');
}

const uniqueQueries = (qs: string[]) => qs.filter((q, i) => qs.findIndex((o) => o.toLowerCase() === q.toLowerCase()) === i);

// The model may echo a blocked brand back ("Amazon Basics ..."); stripping it here keeps it
// out of the search queries and the response. The fallback is scrubbed too, so a product the
// user typed as a blocked brand cannot come back as the canonical name.
export function scrubNormalized(n: Normalized, product: string): Normalized {
  const list = (items: string[]) => items.map(scrubBlockedText).filter(Boolean);
  const scrubbed = {
    category: scrubBlockedText(n.category),
    canonical_name: scrubBlockedText(n.canonical_name) || scrubBlockedText(product),
    similar_products: list(n.similar_products),
    online_queries: list(n.online_queries).map((q) => shopQuery(q, product)).filter(Boolean),
    local_queries: uniqueQueries(list(n.local_queries).map(storeQuery)),
  };
  if (scrubbed.online_queries.length === 0) throw new InvalidLlmOutput();
  return scrubbed;
}

// All calls start in array order before any await, so results (and Brave's call count) are
// deterministic; an empty local_queries means no place search at all.
export async function fetchCandidates(n: Normalized, req: SearchRequest, brave: BraveClient): Promise<Candidate[]> {
  const loc = { lat: req.lat, lon: req.lon, city: req.city, state: req.state };
  const batches = await Promise.all([
    ...n.online_queries.map((q) => brave.webSearch(q, loc)),
    ...n.local_queries.map((q) => brave.placeSearch(q, loc)),
  ]);
  return batches.flat();
}

// The street part of a display address, without the unit, so the departments of one store
// ("REI" and "REI Bike Shop" at "200 Ridge Pike Ste 115") share a key. "Space" counts as a unit
// only before a number, so a street such as "Space Park Dr" survives.
export function addressKey(displayAddress: string | null): string | null {
  const street = (displayAddress ?? '').split(',')[0]!.toLowerCase();
  const key = street.split(/\s(?:ste|suites?|unit)\b|\sspace\s+#?\d|#/)[0]!.replace(/\s+/g, ' ').trim();
  return key || null;
}

function dedupeKey(c: Candidate): string {
  if (c.kind === 'online') return `online:${c.domain}`;
  const address = addressKey(c.address);
  return address ? `local:${c.domain}:${address}` : `local:${c.place_id ?? c.url}`;
}

// A shop can appear once online and once locally. Online, the first page per domain wins unless
// it is editorial and a later page is not: the editorial one would be dropped after dedupe,
// taking the shop with it.
// Locally, one domain at one street address is one store, and the shortest name is the store
// rather than a department; branches of a chain have different addresses, so they stay apart.
// A name-prefix rule would merge those branches, so there is none.
export function dedupe(candidates: Candidate[]): Candidate[] {
  const at = new Map<string, number>();
  const out: Candidate[] = [];
  for (const c of candidates) {
    const key = dedupeKey(c);
    const i = at.get(key);
    if (i === undefined) {
      at.set(key, out.length);
      out.push(c);
    } else if (c.kind === 'local' ? c.name.length < out[i]!.name.length : isEditorialUrl(out[i]!.url) && !isEditorialUrl(c.url)) {
      out[i] = c;
    }
  }
  return out;
}

// Editorial pages go to the model after the shops, so a cap cuts them first; they stay as
// citable evidence for signals but are never results. A row the model judged not to be a shop
// selling the product is dropped; one it did not judge is kept.
export async function enrichAndFilter(pass1: Candidate[], llm: LlmClient, n: Normalized, dropped: Dropped[] = []): Promise<EnrichedRow[]> {
  const { shops, editorial } = splitEditorial(pass1);
  for (const c of editorial) dropped.push({ kind: c.kind, domain: c.domain, reason: 'editorial_url' });
  if (shops.length === 0) return [];
  const evidenceOnly = new Set(editorial);
  const rows = await enrichAll([...shops, ...editorial], llm, curated, n);
  return rows.filter((r) => {
    if (evidenceOnly.has(r.candidate)) return false;
    const reason = dropReason(r.classification);
    if (reason) dropped.push({ kind: r.candidate.kind, domain: r.candidate.domain, reason });
    return reason === null;
  });
}

// About 11 m: enough to place a pin, no more precise than the listing needs.
const coord = (x: number | null): number | null => (x === null || !Number.isFinite(x) ? null : Math.round(x * 1e4) / 1e4);

function scoreRow(id: string, input: ScoreInput): ScoredRow {
  const { candidate: c, certifications: certs, signals } = input;
  const scored = scoreCandidate(input);
  const result = {
    id,
    kind: c.kind,
    retailer: { name: c.name, domain: c.domain, url: c.url },
    matched_product: scored.matched_product,
    snippet: c.snippet,
    address: c.address,
    distance_km: scored.distance_km,
    lat: coord(c.lat),
    lon: coord(c.lon),
    certifications: certs,
    signals,
    score: scored.score,
    components: scored.components,
  };
  return { input, result };
}

export function scoreAll(rows: EnrichedRow[], n: Normalized, req: SearchRequest, siteUrl: string): ScoredRow[] {
  const origin = { lat: req.lat, lon: req.lon };
  let localIndex = 0;
  return rows.map(({ candidate, certifications: certs, signals, classification }) => {
    const id = candidate.kind === 'online'
      ? `online:${candidate.domain}`
      : `local:${candidate.place_id ?? candidate.domain}:${localIndex++}`;
    return scoreRow(id, { candidate, certifications: certs, signals, normalized: n, origin, siteUrl, classification });
  });
}

// The name is checked here too because the blocklist catches a name only as an exact or leading match.
export function hasBlockedText(row: ScoredRow): boolean {
  const texts = [row.input.candidate.title, row.result.retailer.name, row.result.snippet, row.result.matched_product];
  return texts.some(mentionsAmazon);
}

const allowedUrl = (url: string) => !isBlockedDomain(url) && !isBlockedUrl(url);

// Drops any certification or signal whose source is blocked and rescores from what is left, so a
// dropped badge leaves no score behind. A signal's claim is a fetched page title, so it gets the text rule too.
export function scrubSources(row: ScoredRow): ScoredRow {
  const certs = row.input.certifications.filter((c) => allowedUrl(c.source_url));
  const signals = row.input.signals.filter((s) => allowedUrl(s.source_url) && !mentionsAmazon(s.claim));
  const rescored = scoreRow(row.result.id, { ...row.input, certifications: certs, signals });
  const components = rescored.result.components.map((c) => ({ ...c, sources: c.sources.filter((s) => allowedUrl(s.url)) }));
  return { input: rescored.input, result: { ...rescored.result, components } };
}

// A chain's many nearby branches would otherwise fill the local section and push out
// independent shops; the nearest two show that the chain is close.
function rankedSection(rows: ScoredRow[], kind: ResultKind, limit = MAX_RESULTS_PER_SECTION): { top: SearchResult[]; cut: Dropped[] } {
  const perDomain = new Map<string, number>();
  const cut: Dropped[] = [];
  const kept = rankByScore(rows.map((r) => r.result).filter((r) => r.kind === kind)).filter((r) => {
    if (kind !== 'local') return true;
    const n = (perDomain.get(r.retailer.domain) ?? 0) + 1;
    perDomain.set(r.retailer.domain, n);
    if (n <= MAX_BRANCHES_PER_DOMAIN) return true;
    cut.push({ kind, domain: r.retailer.domain, reason: 'branch_cap' });
    return false;
  });
  for (const r of kept.slice(limit)) cut.push({ kind, domain: r.retailer.domain, reason: 'below_top_10' });
  return { top: kept.slice(0, limit), cut };
}

// The second blocklist pass: whatever entered after the first one (enrichment, a model reply,
// a bug) is removed here, as the last step before the response is built.
export function finalizeResponse(
  scored: ScoredRow[], n: Normalized, req: SearchRequest, usage: Usage, dropped: Dropped[] = [],
): SearchResponse {
  const final = filterBlocked(scored, (r) => r.result.retailer)
    .filter((r) => !hasBlockedText(r))
    .map(scrubSources);
  // Shops past the nearby radius are shown apart, a few at most, so they never push out a nearby
  // shop; past MAX_LOCAL_MILES they are dropped. A place without coordinates counts as nearby.
  const nearMiles = nearRadiusMiles(req.ruca);
  const miles = (r: ScoredRow) => (r.result.distance_km ?? 0) / KM_PER_MILE;
  const localRows = final.filter((r) => r.result.kind === 'local');
  const tooFar = localRows.filter((r) => miles(r) > MAX_LOCAL_MILES);
  const inRange = localRows.filter((r) => miles(r) <= MAX_LOCAL_MILES);
  const local = rankedSection(inRange.filter((r) => miles(r) <= nearMiles), 'local');
  const farther = rankedSection(inRange.filter((r) => miles(r) > nearMiles), 'local', MAX_FARTHER);
  const online = rankedSection(final, 'online');
  const tooFarDrops = tooFar.map((r): Dropped => ({ kind: 'local', domain: r.result.retailer.domain, reason: 'too_far' }));
  // Category drops go last so the cap cuts them before the cuts an evaluation needs.
  const late = (d: Dropped) => Number(d.reason === 'place_category');
  const allDropped = [...dropped, ...local.cut, ...farther.cut, ...tooFarDrops, ...online.cut].sort((a, b) => late(a) - late(b));
  return {
    query: {
      product: req.product, city: req.city, state: req.state, canonical_name: n.canonical_name, category: n.category,
      online_queries: n.online_queries, local_queries: n.local_queries, near_radius_mi: nearMiles,
    },
    weights: WEIGHTS,
    local: local.top,
    local_farther: farther.top.map((r, i) => ({ ...r, rank: local.top.length + i + 1 })),
    online: online.top,
    usage,
    // Every entry already passed the blocklist (pass 1, or placeCategoryDrops), but the list is checked again like everything else shown.
    dropped: allDropped.filter((d) => !isBlockedDomain(d.domain) && !mentionsAmazon(d.domain)).slice(0, MAX_DROPPED),
  };
}

function totalUsage(braveCalls: number, llm: LlmUsage[]): Usage {
  return {
    brave_calls: braveCalls,
    llm,
    llm_tokens: llm.reduce((sum, u) => sum + u.prompt_tokens + u.completion_tokens, 0),
    estimated_cost_usd: estimateCost({ brave_calls: braveCalls, llm }),
  };
}

export async function runSearch(req: SearchRequest, env: Env, deps: Deps): Promise<SearchResponse> {
  const siteUrl = env.SITE_URL.replace(/\/+$/, '');
  const llm = createLlmClient({ fetch: deps.fetch, apiKey: env.OPENROUTER_API_KEY, siteUrl, siteName: env.SITE_NAME });
  // The client refuses a seventh call; truncation keeps a search at five at most.
  const brave = createBraveClient({ fetch: deps.fetch, apiKey: env.BRAVE_API_KEY, negativeSourceDomains });

  const raw = await llm.complete<Normalized>('normalize', buildNormalizePrompt(req), NORMALIZE_MAX_TOKENS);
  // Scrubbed before truncating, so blocked queries cannot take the slots of usable ones.
  const n = truncate(scrubNormalized(raw, req.product));
  const pass1 = filterBlocked(dedupe(await fetchCandidates(n, req, brave)), (c) => c);
  const dropped = placeCategoryDrops(brave.rejected);
  const kept = await enrichAndFilter(pass1, llm, n, dropped); // no model call when no shop survives pass 1
  const scored = scoreAll(kept, n, req, siteUrl);
  const res = finalizeResponse(scored, n, req, totalUsage(brave.calls, [...llm.usage]), dropped);
  const unjudged = new Set(kept.filter((r) => r.classification === null).map((r) => r.candidate));
  const unjudgedIds = new Set(scored.filter((r) => unjudged.has(r.input.candidate)).map((r) => r.result.id));
  const count = (section: SearchResult[]) => section.filter((r) => unjudgedIds.has(r.id)).length;
  res.usage.unclassified_shown = { online: count(res.online), local: count(res.local) };
  return res;
}
