import { normalizeName } from './blocklist';
import type { Candidate, CertKind, Certification, Classification, SellsProduct, Signal, SignalKind, SiteType } from './contract';
import { domainLabel, registrableDomain } from './domain';
import { ENRICH_MAX_TOKENS, type LlmClient } from './llm';
import { buildEnrichPrompt, type EnrichProduct, type LlmView } from './prompts';

// Separate caps, because with one shared cap a full online list left local candidates unseen.
// The local cap covers every place result (2 queries x BRAVE_COUNT); a test fails if that drifts.
export const MAX_LLM_ONLINE = 24;
export const MAX_LLM_LOCAL = 20;
export const LLM_TITLE_CHARS = 120;
export const LLM_SNIPPET_CHARS = 400;

export interface CertificationRow { domain: string; kind: CertKind; source_url: string; checked: string }
export interface NegativeRow { domain: string; kind: SignalKind; claim: string; source_url: string; action_date: string }
export interface CuratedData {
  certifications: CertificationRow[];
  negatives: NegativeRow[];
  negativeSources: ReadonlySet<string>;
}
export interface EnrichedRow {
  candidate: Candidate;
  certifications: Certification[];
  signals: Signal[];
  classification: Classification | null; // null: the model did not judge this candidate
}
export interface EnrichOutput {
  retailers: Array<{
    domain: string;
    signals: Array<{ kind: SignalKind; polarity: 'positive' | 'negative'; claim: string; source_url: string; confidence: number }>;
  }>;
  candidates: Array<{ id: string; site_type: string; sells_product: string }>;
}

export const CERT_LABELS: Record<CertKind, string> = {
  b_corp: 'B Corp',
  fair_trade: 'Sells Fair Trade Certified products',
  worker_coop: 'Worker co-op',
  one_percent_planet: '1% for the Planet',
  climate_neutral: 'Climate Label certified',
  independent_retailer_assoc: 'Independent retailer association',
};

export function certificationsFor(domain: string, rows: CertificationRow[]): Certification[] {
  return rows
    .filter((r) => r.domain === domain)
    .map((r) => ({ kind: r.kind, label: CERT_LABELS[r.kind], source_url: r.source_url, checked: r.checked }));
}

export function negativesFor(domain: string, rows: NegativeRow[]): Signal[] {
  return rows
    .filter((r) => r.domain === domain)
    .map((r) => ({ kind: r.kind, polarity: 'negative', claim: r.claim, source_url: r.source_url, origin: 'curated', action_date: r.action_date }));
}

// Candidates arrive with location fields; this projection is the only shape the model sees.
// An id is the candidate's index in the input, so it still points at the right row when a cap skips some.
export function llmView(candidates: Candidate[]): LlmView[] {
  const seen = { online: 0, local: 0 };
  const cap = { online: MAX_LLM_ONLINE, local: MAX_LLM_LOCAL };
  return candidates.flatMap((c, i) => {
    if (seen[c.kind]++ >= cap[c.kind]) return [];
    return [{
      id: `c${i}`,
      domain: c.domain,
      title: c.title.slice(0, LLM_TITLE_CHARS),
      snippet: c.snippet.slice(0, LLM_SNIPPET_CHARS),
      url: c.url,
    }];
  });
}

// Only ids that were sent count, and the first answer for an id wins.
const SITE_TYPES: ReadonlySet<string> = new Set<SiteType>(['retailer', 'marketplace', 'editorial', 'manufacturer_no_cart', 'service', 'other']);
const SELLS: ReadonlySet<string> = new Set<SellsProduct>(['yes', 'maybe', 'no']);

// The reply schema takes any short string here, so one made-up value cannot fail the whole
// search; a candidate with a value outside the lists stays unclassified and is kept.
export function acceptClassifications(output: EnrichOutput, view: LlmView[]): Map<string, Classification> {
  const sent = new Set(view.map((v) => v.id));
  const accepted = new Map<string, Classification>();
  for (const { id, site_type, sells_product } of output.candidates) {
    if (!sent.has(id) || accepted.has(id) || !SITE_TYPES.has(site_type) || !SELLS.has(sells_product)) continue;
    accepted.set(id, { site_type: site_type as SiteType, sells_product: sells_product as SellsProduct });
  }
  return accepted;
}

function urlKey(url: string): string | null {
  try {
    return new URL(url).href.replace(/\/+$/, '');
  } catch {
    return null;
  }
}

const padded = (s: string) => ` ${normalizeName(s)} `;

// The model only points at evidence; code decides what counts. A signal must cite a
// fetched result that is the retailer's own page or names the retailer, and a negative
// must also come from a registry domain. Display text is the cited page's title, never model prose.
export function acceptSignals(
  output: EnrichOutput,
  candidates: Candidate[],
  negativeSources: ReadonlySet<string>,
): Map<string, Signal[]> {
  const byUrl = new Map<string, Candidate>();
  for (const c of candidates) {
    const key = urlKey(c.url);
    if (key && !byUrl.has(key)) byUrl.set(key, c);
  }
  const namesByDomain = new Map<string, string[]>();
  for (const c of candidates) {
    const names = namesByDomain.get(c.domain);
    if (names) names.push(c.name);
    else namesByDomain.set(c.domain, [c.name]);
  }

  const accepted = new Map<string, Signal[]>();
  for (const retailer of output.retailers) {
    const domain = registrableDomain(retailer.domain);
    const names = domain ? namesByDomain.get(domain) : undefined;
    if (!domain || !names) continue;
    const label = domainLabel(domain);
    const mentionTerms = [...names, ...(label ? [label] : [])].map(padded).filter((t) => t.trim());

    for (const s of retailer.signals) {
      const key = urlKey(s.source_url);
      const cited = key ? byUrl.get(key) : undefined;
      if (!cited) continue;
      // Positives get the mention rule too: they are displayed, so a page about another shop must not vouch for this one.
      const text = padded(`${cited.title} ${cited.snippet}`);
      const about = cited.domain === domain || mentionTerms.some((t) => text.includes(t));
      if (!about) continue;
      if (s.polarity === 'negative' && !negativeSources.has(cited.domain)) continue;
      // A shop vouching for itself is not evidence, and the claim shown would be its own page title.
      if (s.polarity === 'positive' && cited.domain === domain) continue;

      const list = accepted.get(domain) ?? [];
      // Repeats would otherwise count twice in the score.
      if (list.some((x) => x.kind === s.kind && x.polarity === s.polarity && x.source_url === cited.url)) continue;
      list.push({ kind: s.kind, polarity: s.polarity, claim: cited.title, source_url: cited.url, origin: 'llm', action_date: null });
      accepted.set(domain, list);
    }
  }
  return accepted;
}

export async function enrichAll(pass1: Candidate[], llm: LlmClient, data: CuratedData, product: EnrichProduct): Promise<EnrichedRow[]> {
  if (pass1.length === 0) return [];
  const view = llmView(pass1);
  const output = await llm.complete<EnrichOutput>('enrich', buildEnrichPrompt(view, product), ENRICH_MAX_TOKENS);
  const accepted = acceptSignals(output, pass1, data.negativeSources);
  const classified = acceptClassifications(output, view);
  return pass1.map((candidate, i) => ({
    candidate,
    certifications: certificationsFor(candidate.domain, data.certifications),
    signals: [...negativesFor(candidate.domain, data.negatives), ...(accepted.get(candidate.domain) ?? [])],
    classification: classified.get(`c${i}`) ?? null,
  }));
}
