// Step 2 analysis: Brave churn with the wording fixed.
// replay-1 vs replay-2 (about an hour apart, raw Brave results) and replay-1 vs the saved
// eval20-0924 run (local domains the Worker got from Brave, shown + dropped).
// Run from the repo root: npx tsx <this> [replayA] [replayB]
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { mapPlaceResults } from '../../../../proxy/src/brave.ts';

const DIR = new URL('.', import.meta.url).pathname;
type Place = { id: string };
type Saved = { local: { retailer: { domain: string } }[]; local_farther?: { retailer: { domain: string } }[]; dropped: { kind: string; domain: string }[] };
const [A = '1', B = '2'] = process.argv.slice(2);
const SRC = 'docs/evidence/quality/eval20-0924/responses/';
const jac = (x: Set<string>, y: Set<string>) => {
  const u = new Set([...x, ...y]);
  return u.size ? [...x].filter((d) => y.has(d)).length / u.size : null;
};
const mean = (xs: (number | null)[]) => {
  const v = xs.filter((x): x is number => x !== null);
  return v.length ? +(v.reduce((s, x) => s + x, 0) / v.length).toFixed(2) : null;
};
function replay(n: string, id: string) {
  const dir = `${DIR}replay-${n}/`;
  const files = [0, 1].map((i) => `${dir}${id}__${i}.json`).filter(existsSync);
  if (!files.length) return null;
  const bodies: { results: Place[] }[] = files.map((f) => JSON.parse(readFileSync(f, 'utf8')).body);
  const ids = new Set(bodies.flatMap((b) => b.results.map((r) => String(r.id))));
  const domains = new Set(bodies.flatMap((b) => mapPlaceResults(b, new Set()).map((c) => c.domain)));
  // Order matters to the ranking only through relevance, but a changed top 5 is visible churn.
  const top5 = bodies.map((b) => b.results.slice(0, 5).map((r) => String(r.id)).join(','));
  return { ids, domains, top5 };
}

const rows = readdirSync(SRC).filter((f) => f.endsWith('.json')).sort().map((f) => {
  const id = f.replace('.json', '');
  const body: Saved = JSON.parse(readFileSync(SRC + f, 'utf8')).body;
  const saved = new Set<string>([...body.local, ...(body.local_farther ?? [])].map((r) => r.retailer.domain)
    .concat(body.dropped.filter((d) => d.kind === 'local').map((d) => d.domain)));
  const a = replay(A, id), b = replay(B, id);
  return {
    id,
    ab_ids: a && b ? jac(a.ids, b.ids) : null,
    ab_domains: a && b ? jac(a.domains, b.domains) : null,
    ab_same_top5: a && b ? a.top5.every((t, i) => t === b.top5[i]) : null,
    a_vs_saved_domains: a ? jac(a.domains, saved) : null,
    // The Worker silently filters some places (blocklist), so also: share of saved domains Brave still returns.
    saved_in_a: a && saved.size ? [...saved].filter((d) => a.domains.has(d)).length / saved.size : null,
  };
});
console.log(JSON.stringify({
  replays: [A, B],
  mean_ab_ids: mean(rows.map((r) => r.ab_ids)),
  mean_ab_domains: mean(rows.map((r) => r.ab_domains)),
  same_top5: rows.filter((r) => r.ab_same_top5).length,
  mean_a_vs_saved_domains: mean(rows.map((r) => r.a_vs_saved_domains)),
  mean_saved_in_a: mean(rows.map((r) => r.saved_in_a)),
  rows,
}, null, 1));
