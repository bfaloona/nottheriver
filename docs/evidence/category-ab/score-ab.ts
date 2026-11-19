// Scores the runs that run-ab.ts saved: measures M1 to M5 of README.md, written before the first call.
//   npx tsx docs/evidence/category-ab/score-ab.ts
// Reads runs/calls.json and runs/<arm>-r<round>/responses, writes results.json. No network call.
import fs from 'node:fs';
import path from 'node:path';
import { getDomain } from 'tldts';
import type { SearchResponse, SearchResult } from '../../../proxy/src/contract';
import { recall, sectionResults } from '../../../eval/summarize.mjs';
import { ARMS, OUT, ROOT, jobs, json, listPair, type Arm, type CallsFile } from './lib';

interface BaselineRow { search_id: string; section: string; name: string; url?: string; also_urls?: string[]; confirmed: boolean }
interface Grade { search_id: string; kind: string; url: string; sells_product: string; local_exists: string; checked: string }
interface GradesFile { grades: Grade[]; baseline: BaselineRow[] }
interface Saved { id: string; status: number; body: SearchResponse }

const ids = new Set(jobs.map((j) => j.id));
const baseline = json<GradesFile>('docs/evidence/quality/eval20-store-types/grades.json').baseline.filter((b) => ids.has(b.search_id) && b.section === 'local' && b.confirmed);
const calls = JSON.parse(fs.readFileSync(path.join(OUT, 'calls.json'), 'utf8')) as CallsFile;
const rounds = Array.from({ length: calls.rounds }, (_, i) => i + 1);
const normName = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '');

function saved(arm: Arm, round: number): Map<string, Saved> {
  const dir = path.join(OUT, `${arm}-r${round}`, 'responses');
  return new Map(fs.readdirSync(dir).filter((f) => f.endsWith('.json')).map((f) => JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')) as Saved).map((s) => [s.id, s]));
}
const shownLocal = (s: Saved | undefined): SearchResult[] => (s?.status === 200 ? (sectionResults(s.body, 'local') as SearchResult[]) : []);

// M1: the same match rule as recall() in eval/summarize.mjs, applied to the raw map-search replies.
function returnedByMapSearch(b: BaselineRow, arm: Arm, round: number): boolean {
  const rows = calls.place_calls.filter((c) => c.id === b.search_id && c.arm === arm && c.round === round).flatMap((c) => c.results);
  const domains = new Set([b.url, ...(b.also_urls ?? [])].map((u) => (u ? getDomain(u) : null)).filter(Boolean));
  if (domains.size === 0) return rows.some((r) => normName(r.title ?? '') === normName(b.name));
  return rows.some((r) => domains.has(r.url ? getDomain(r.url) : null));
}

// M3: the newest earlier grade of the same search and URL. Good and bad follow precision() in eval/summarize.mjs.
const verdicts = new Map<string, Grade>();
const qualityDir = path.join(ROOT, 'docs/evidence/quality');
for (const dir of fs.readdirSync(qualityDir)) {
  const file = path.join(qualityDir, dir, 'grades.json');
  if (!fs.existsSync(file)) continue;
  // One folder (open-place-precision) holds a grades.json of another shape, with no `grades` list.
  const { grades } = JSON.parse(fs.readFileSync(file, 'utf8')) as Partial<GradesFile>;
  for (const g of (Array.isArray(grades) ? grades : []).filter((x) => x.kind === 'local' && ids.has(x.search_id))) {
    const key = `${g.search_id} ${g.url}`;
    const old = verdicts.get(key);
    if (!old || old.checked < g.checked) verdicts.set(key, g);
  }
}
function gradeOf(id: string, r: SearchResult): 'good' | 'bad' | 'ungraded' {
  const g = verdicts.get(`${id} ${r.retailer.url}`);
  if (!g) return 'ungraded';
  if (g.local_exists === 'no' || g.sells_product === 'no') return 'bad';
  if (g.sells_product === 'unknown' || g.local_exists !== 'yes') return 'ungraded';
  return 'good';
}

const shopKey = (r: SearchResult) => `${r.retailer.domain} ${r.address ?? ''}`;
function shared(a: SearchResult[], b: SearchResult[]): { both: number; either: number } {
  const A = new Set(a.map(shopKey));
  const B = new Set(b.map(shopKey));
  return { both: [...A].filter((k) => B.has(k)).length, either: new Set([...A, ...B]).size };
}
const sum = (xs: number[]) => xs.reduce((n, x) => n + x, 0);

const runs = Object.fromEntries(ARMS.map((arm) => [arm, rounds.map((round) => saved(arm, round))])) as Record<Arm, Map<string, Saved>[]>;
const perArm = ARMS.flatMap((arm) => rounds.map((round) => {
  const responses = runs[arm][round - 1]!;
  const resultsFor = (id: string) => shownLocal(responses.get(id));
  const shown = [...ids].flatMap((id) => shownLocal(responses.get(id)).map((r) => gradeOf(id, r)));
  const usage = [...responses.values()].filter((s) => s.status === 200).map((s) => s.body.usage);
  const mine = calls.searches.filter((s) => s.arm === arm && s.round === round);
  return {
    arm,
    round,
    searches_ok: [...responses.values()].filter((s) => s.status === 200).length,
    m1_returned_by_map_search: baseline.filter((b) => returnedByMapSearch(b, arm, round)).length,
    m2_shown: (recall(baseline, resultsFor) as { found: number }).found,
    baseline_shops: baseline.length,
    m3_shown_nearby: shown.length,
    m3_graded_good: shown.filter((v) => v === 'good').length,
    m3_graded_bad: shown.filter((v) => v === 'bad').length,
    m3_ungraded: shown.filter((v) => v === 'ungraded').length,
    brave_live: sum(mine.map((s) => s.brave_live)),
    brave_replayed: sum(mine.map((s) => s.brave_replayed)),
    model_cost_usd_reported: Math.round(sum(usage.flatMap((u) => u.llm.map((l) => l.cost_usd ?? 0))) * 1e6) / 1e6,
    model_calls_without_reported_cost: usage.flatMap((u) => u.llm).filter((l) => l.cost_usd === null).length,
  };
}));

const perSearch = jobs.map((job) => {
  const first = runs.model[0]!.get(job.id);
  const modelPair = first?.status === 200 ? first.body.query.local_queries ?? [] : [];
  const sentByList = runs.list[0]!.get(job.id);
  const base = baseline.filter((b) => b.search_id === job.id);
  const cell = (arm: Arm, round: number) => ({
    m1: base.filter((b) => returnedByMapSearch(b, arm, round)).map((b) => b.name),
    m2: base.filter((b) => (recall([b], (id: string) => shownLocal(runs[arm][round - 1]!.get(id))) as { found: number }).found === 1).map((b) => b.name),
    shown: shownLocal(runs[arm][round - 1]!.get(job.id)).map((r) => `${r.retailer.name} [${gradeOf(job.id, r)}]`),
  });
  return {
    id: job.id,
    baseline: base.map((b) => b.name),
    m5_model_pair: modelPair,
    m5_list_pair: listPair(job.product),
    m5_list_pair_as_sent: sentByList?.status === 200 ? sentByList.body.query.local_queries ?? [] : [],
    // The same two phrases in another order are the same two map searches. Null when a search failed.
    m5_pairs_differ: first?.status === 200 && sentByList?.status === 200 ? JSON.stringify([...modelPair].sort()) !== JSON.stringify([...(sentByList.body.query.local_queries ?? [])].sort()) : null,
    live_pick: first?.status === 200 ? first.body.query.pick ?? null : null,
    ...Object.fromEntries(ARMS.flatMap((arm) => rounds.map((round) => [`${arm}_r${round}`, cell(arm, round)]))),
  };
});

// M4: shops shown by both of two runs, over shops shown by either, summed over the six searches.
const overlap = (a: Map<string, Saved>, b: Map<string, Saved>) => {
  const parts = [...ids].map((id) => shared(shownLocal(a.get(id)), shownLocal(b.get(id))));
  return { both: sum(parts.map((p) => p.both)), either: sum(parts.map((p) => p.either)) };
};
const m4 = {
  ...(calls.rounds >= 2 && Object.fromEntries(ARMS.map((arm) => [`${arm}_r1_vs_r2`, overlap(runs[arm][0]!, runs[arm][1]!)]))),
  ...Object.fromEntries(rounds.map((round) => [`model_vs_list_r${round}`, overlap(runs.model[round - 1]!, runs.list[round - 1]!)])),
};

const results = { scored_from: calls.ran, brave_live_calls: calls.brave_live_calls, brave_replayed_calls: calls.brave_replayed_calls, per_arm: perArm, m4_shown_nearby_shops_in_common: m4, per_search: perSearch };
fs.writeFileSync(path.join(import.meta.dirname, 'results.json'), JSON.stringify(results, null, 1) + '\n');
console.table(perArm.map(({ arm, round, searches_ok, m1_returned_by_map_search, m2_shown, m3_shown_nearby, m3_graded_good, m3_graded_bad, m3_ungraded, brave_live }) => ({ arm, round, ok: searches_ok, m1: m1_returned_by_map_search, m2: m2_shown, shown: m3_shown_nearby, good: m3_graded_good, bad: m3_graded_bad, ungraded: m3_ungraded, brave_live })));
console.log(JSON.stringify(m4));
for (const s of perSearch) console.log(`${s.id}: model ${JSON.stringify(s.m5_model_pair)} list ${JSON.stringify(s.m5_list_pair_as_sent)} differ ${s.m5_pairs_differ}`);
