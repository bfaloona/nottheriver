import { normalizeName } from './blocklist';
import type { Candidate, CertKind, Certification, Signal, SignalKind } from './contract';
import { domainLabel, registrableDomain } from './domain';
import { ENRICH_MAX_TOKENS, type LlmClient } from './llm';
import { buildEnrichPrompt, type LlmView } from './prompts';

export const MAX_LLM_CANDIDATES = 30;
export const LLM_TITLE_CHARS = 120;
export const LLM_SNIPPET_CHARS = 400;

export interface CertificationRow { domain: string; kind: CertKind; source_url: string; checked: string }
export interface NegativeRow { domain: string; kind: SignalKind; claim: string; source_url: string; action_date: string }
export interface CuratedData {
  certifications: CertificationRow[];
  negatives: NegativeRow[];
  negativeSources: ReadonlySet<string>;
}
export interface EnrichedRow { candidate: Candidate; certifications: Certification[]; signals: Signal[] }
export interface EnrichOutput {
  retailers: Array<{
    domain: string;
    signals: Array<{ kind: SignalKind; polarity: 'positive' | 'negative'; claim: string; source_url: string; confidence: number }>;
  }>;
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
export function llmView(candidates: Candidate[]): LlmView[] {
  return candidates.slice(0, MAX_LLM_CANDIDATES).map((c) => ({
    domain: c.domain,
    title: c.title.slice(0, LLM_TITLE_CHARS),
    snippet: c.snippet.slice(0, LLM_SNIPPET_CHARS),
    url: c.url,
  }));
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

      const list = accepted.get(domain) ?? [];
      // Repeats would otherwise count twice in the score.
      if (list.some((x) => x.kind === s.kind && x.polarity === s.polarity && x.source_url === cited.url)) continue;
      list.push({ kind: s.kind, polarity: s.polarity, claim: cited.title, source_url: cited.url, origin: 'llm', action_date: null });
      accepted.set(domain, list);
    }
  }
  return accepted;
}

export async function enrichAll(pass1: Candidate[], llm: LlmClient, data: CuratedData): Promise<EnrichedRow[]> {
  if (pass1.length === 0) return [];
  const output = await llm.complete<EnrichOutput>('enrich', buildEnrichPrompt(llmView(pass1)), ENRICH_MAX_TOKENS);
  const accepted = acceptSignals(output, pass1, data.negativeSources);
  return pass1.map((candidate) => ({
    candidate,
    certifications: certificationsFor(candidate.domain, data.certifications),
    signals: [...negativesFor(candidate.domain, data.negatives), ...(accepted.get(candidate.domain) ?? [])],
  }));
}
