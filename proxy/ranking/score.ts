import type {
  Candidate, CertKind, Certification, Classification, ComponentName, Normalized, ScoreComponent, SellsProduct, Signal, SignalKind, SourceRef,
} from '../src/contract';
import { haversineKm, type LatLon } from './geo';
import { WEIGHTS } from './weights';

const BASELINE = 0.5;
const STEP = 0.25;
const PROXIMITY_RADIUS_KM = 40;
const ONLINE_PROXIMITY = 0.5;

interface Dimension {
  certs: readonly CertKind[];
  negatives: readonly SignalKind[];
}
// independent_retailer_assoc is in neither list: it is a badge with no score effect.
const ETHICS: Dimension = { certs: ['b_corp', 'fair_trade', 'worker_coop'], negatives: ['labor', 'governance'] };
const ENV: Dimension = { certs: ['one_percent_planet', 'climate_neutral'], negatives: ['environmental'] };

const KIND_LABEL: Record<SignalKind, string> = { labor: 'Labor', governance: 'Governance', environmental: 'Environmental' };

const round = (x: number, places: number): number => Math.round(x * 10 ** places) / 10 ** places;

function normalizeText(s: string): string {
  return s.normalize('NFKC').toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
}

const JUDGED: Partial<Record<SellsProduct, { value: 1 | 0.5; label: string }>> = {
  yes: { value: 1, label: 'Model judgment: likely sells it' },
  maybe: { value: 0.5, label: 'Model judgment: may sell it' },
};

// A place listing's text is a name and a store-type word, so the text rule leaves almost every
// local store at 0.2; the classifier's yes/maybe separates them (80% vs 40% good in graded rows).
export function relevance(c: Candidate, n: Normalized, sells?: SellsProduct | null): { value: 1 | 0.5 | 0.2; matched: string; source: SourceRef } {
  const text = textRelevance(c, n);
  const judged = c.kind === 'local' && sells ? JUDGED[sells] : undefined;
  if (!judged || judged.value <= text.value) return text;
  return { value: judged.value, matched: '', source: { label: judged.label, url: c.url } };
}

function textRelevance(c: Candidate, n: Normalized): { value: 1 | 0.5 | 0.2; matched: string; source: SourceRef } {
  // For places the snippet is Brave's store-type word plus any categories, so local relevance rests on those and the title.
  // Checked separately so a phrase cannot straddle the end of the title and the start of the snippet.
  const fields = [normalizeText(c.title), normalizeText(c.snippet)];
  const found = (phrase: string) => {
    const needle = normalizeText(phrase);
    // Every string includes '', so a blank product would otherwise match everything.
    return needle !== '' && fields.some((field) => field.includes(needle));
  };
  const source = { label: c.title || c.name, url: c.url };
  const product = [n.canonical_name, ...n.similar_products].find(found);
  if (product !== undefined) return { value: 1, matched: product, source };
  if (found(n.category)) return { value: 0.5, matched: n.category, source };
  return { value: 0.2, matched: '', source };
}

function uniqueBy<T>(items: T[], key: (item: T) => string): T[] {
  const seen = new Set<string>();
  return items.filter((item) => {
    const k = key(item);
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

function dimension(
  d: Dimension, certs: Certification[], signals: Signal[], baselineUrl: string,
): { value: number; sources: SourceRef[] } {
  // A curated and an LLM entry can record the same fact, so each certification kind earns one step
  // and each negative counts once per (kind, page), the identity enrichment dedupes on.
  const counted = uniqueBy(certs.filter((c) => d.certs.includes(c.kind)), (c) => c.kind);
  const negatives = uniqueBy(
    signals.filter((s) => s.polarity === 'negative' && d.negatives.includes(s.kind)),
    (s) => `${s.kind}|${s.source_url}`,
  );
  // Cap before subtracting, so a negative lowers even a fully certified retailer.
  const value = Math.max(0, Math.min(1, BASELINE + STEP * counted.length) - STEP * negatives.length);
  return {
    value,
    sources: [
      { label: `Baseline ${BASELINE}`, url: baselineUrl },
      ...counted.map((c) => ({ label: c.label, url: c.source_url })),
      ...negatives.map((s) => ({ label: `${KIND_LABEL[s.kind]}: ${s.claim}`, url: s.source_url })),
    ],
  };
}

export function ethics(certs: Certification[], signals: Signal[], baselineUrl: string) {
  return dimension(ETHICS, certs, signals, baselineUrl);
}

export function env(certs: Certification[], signals: Signal[], baselineUrl: string) {
  return dimension(ENV, certs, signals, baselineUrl);
}

export function proximity(
  c: Candidate, origin: LatLon, docUrl: string,
): { value: number; distance_km: number | null; sources: SourceRef[] } {
  if (c.kind === 'online') {
    return { value: ONLINE_PROXIMITY, distance_km: null, sources: [{ label: `Online retailer, fixed ${ONLINE_PROXIMITY}`, url: docUrl }] };
  }
  if (c.lat === null || c.lon === null || !Number.isFinite(c.lat) || !Number.isFinite(c.lon)) {
    return { value: 0, distance_km: null, sources: [] };
  }
  // Score from the displayed (rounded) distance so a reader can reproduce the value.
  const distance_km = round(haversineKm(origin, { lat: c.lat, lon: c.lon }), 1);
  const value = Math.max(0, 1 - distance_km / PROXIMITY_RADIUS_KM);
  // The page shows miles; the km figure stays so a reader can recompute the value from the formula.
  const miles = distance_km * 0.621371;
  const shown = miles < 10 ? miles.toFixed(1) : String(Math.round(miles));
  return { value, distance_km, sources: value > 0 ? [{ label: `${shown} mi (${distance_km} km) from your zip area`, url: docUrl }] : [] };
}

export interface ScoreInput {
  candidate: Candidate;
  certifications: Certification[];
  signals: Signal[];
  normalized: Normalized;
  origin: LatLon;
  siteUrl: string; // no trailing slash
  classification?: Classification | null; // the model's judgment; null when it did not judge
}

export function scoreCandidate(
  input: ScoreInput, weights: Readonly<Record<ComponentName, number>> = WEIGHTS,
): { score: number; matched_product: string; distance_km: number | null; components: ScoreComponent[] } {
  const docUrl = `${input.siteUrl}/about.html#ranking`;
  const rel = relevance(input.candidate, input.normalized, input.classification?.sells_product);
  const prox = proximity(input.candidate, input.origin, docUrl);
  const parts: [ComponentName, { value: number; sources: SourceRef[] }][] = [
    ['relevance', { value: rel.value, sources: [rel.source] }],
    ['ethics', ethics(input.certifications, input.signals, docUrl)],
    ['env', env(input.certifications, input.signals, docUrl)],
    ['proximity', prox],
  ];
  const components = parts.map(([name, { value, sources }]) => ({
    name, value, weight: weights[name], contribution: round(weights[name] * value, 3), sources,
  }));
  // Sum unrounded products so the total does not accumulate per-row rounding.
  const score = round(components.reduce((sum, c) => sum + c.weight * c.value, 0), 3);
  return { score, matched_product: rel.matched, distance_km: prox.distance_km, components };
}

// Array.prototype.sort is stable, so equal scores keep fetch order.
export function rankByScore<T extends { score: number }>(rows: readonly T[]): (T & { rank: number })[] {
  return [...rows].sort((a, b) => b.score - a.score).map((row, i) => ({ ...row, rank: i + 1 }));
}
