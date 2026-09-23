import certifications from '../../data/certifications.json';
import negatives from '../../data/negatives.json';
import registry from '../../data/negative-sources.json';
import { WEIGHTS } from '../ranking/weights';
import { rankByScore, scoreCandidate, type ScoreInput } from '../ranking/score';
import { filterBlocked, isBlockedDomain, isBlockedUrl, scrubBlockedText } from './blocklist';
import { createBraveClient, type BraveClient } from './brave';
import type {
  Candidate, Env, Deps, LlmUsage, Normalized, ResultKind, SearchRequest, SearchResponse, SearchResult, Usage,
} from './contract';
import { enrichAll, type CertificationRow, type CuratedData, type EnrichedRow, type NegativeRow } from './enrich';
import { InvalidLlmOutput } from './errors';
import { NORMALIZE_MAX_TOKENS, createLlmClient } from './llm';
import { estimateCost } from './pricing';
import { buildNormalizePrompt } from './prompts';

export const MAX_SIMILAR_PRODUCTS = 6;
export const MAX_ONLINE_QUERIES = 3;
export const MAX_LOCAL_QUERIES = 2;
export const MAX_RESULTS_PER_SECTION = 10;

const negativeSourceDomains: ReadonlySet<string> = new Set(registry.sources.map((s) => s.domain));

// JSON imports type `kind` as string; proxy/test/data.test.ts checks every row's kind
// against the contract unions, which is what makes these casts safe.
const curated: CuratedData = {
  certifications: certifications.entries as CertificationRow[],
  negatives: negatives.entries as NegativeRow[],
  negativeSources: negativeSourceDomains,
};

const AMAZON_WORD = /\bamazon\b/i;

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

// The model may echo a blocked brand back ("Amazon Basics ..."); stripping it here keeps it
// out of the search queries and the response. The fallback is scrubbed too, so a product the
// user typed as a blocked brand cannot come back as the canonical name.
export function scrubNormalized(n: Normalized, product: string): Normalized {
  const list = (items: string[]) => items.map(scrubBlockedText).filter(Boolean);
  const scrubbed = {
    category: scrubBlockedText(n.category),
    canonical_name: scrubBlockedText(n.canonical_name) || scrubBlockedText(product),
    similar_products: list(n.similar_products),
    online_queries: list(n.online_queries),
    local_queries: list(n.local_queries),
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

// First occurrence wins. A shop can appear once online and once locally, and two branches of
// one chain are separate places.
export function dedupe(candidates: Candidate[]): Candidate[] {
  const seen = new Set<string>();
  return candidates.filter((c) => {
    const key = c.kind === 'online' ? `online:${c.domain}` : `local:${c.place_id ?? c.url}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

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
  return rows.map(({ candidate, certifications: certs, signals }) => {
    const id = candidate.kind === 'online'
      ? `online:${candidate.domain}`
      : `local:${candidate.place_id ?? candidate.domain}:${localIndex++}`;
    return scoreRow(id, { candidate, certifications: certs, signals, normalized: n, origin, siteUrl });
  });
}

// Deliberately over-blocks ("not on Amazon" loses the shop too): the word itself must not reach the page.
// The name is checked here too because the blocklist catches a name only as an exact or leading match.
export function hasBlockedText(row: ScoredRow): boolean {
  const texts = [row.input.candidate.title, row.result.retailer.name, row.result.snippet, row.result.matched_product];
  return texts.some((t) => AMAZON_WORD.test(t));
}

const allowedUrl = (url: string) => !isBlockedDomain(url) && !isBlockedUrl(url);

// Drops any certification or signal whose source is blocked and rescores from what is left, so a
// dropped badge leaves no score behind. A signal's claim is a fetched page title, so it gets the text rule too.
export function scrubSources(row: ScoredRow): ScoredRow {
  const certs = row.input.certifications.filter((c) => allowedUrl(c.source_url));
  const signals = row.input.signals.filter((s) => allowedUrl(s.source_url) && !AMAZON_WORD.test(s.claim));
  const rescored = scoreRow(row.result.id, { ...row.input, certifications: certs, signals });
  const components = rescored.result.components.map((c) => ({ ...c, sources: c.sources.filter((s) => allowedUrl(s.url)) }));
  return { input: rescored.input, result: { ...rescored.result, components } };
}

function topResults(rows: ScoredRow[], kind: ResultKind): SearchResult[] {
  return rankByScore(rows.map((r) => r.result).filter((r) => r.kind === kind)).slice(0, MAX_RESULTS_PER_SECTION);
}

// The second blocklist pass: whatever entered after the first one (enrichment, a model reply,
// a bug) is removed here, as the last step before the response is built.
export function finalizeResponse(scored: ScoredRow[], n: Normalized, req: SearchRequest, usage: Usage): SearchResponse {
  const final = filterBlocked(scored, (r) => r.result.retailer)
    .filter((r) => !hasBlockedText(r))
    .map(scrubSources);
  return {
    query: { product: req.product, city: req.city, state: req.state, canonical_name: n.canonical_name, category: n.category },
    weights: WEIGHTS,
    local: topResults(final, 'local'),
    online: topResults(final, 'online'),
    usage,
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
  const enriched = await enrichAll(pass1, llm, curated); // no model call when pass1 is empty
  const scored = scoreAll(enriched, n, req, siteUrl);
  return finalizeResponse(scored, n, req, totalUsage(brave.calls, [...llm.usage]));
}
