// Per arm: which providers served the model calls, and their speed, from a stage-timing.json.
// For an arm with two enrich calls, "enrich" is the later-finishing one (what the shopper waits on).
//   node docs/evidence/latency-0927/providers.mjs <stage-timing.json>
import { readFileSync } from 'node:fs';

const file = process.argv[2];
if (!file) throw new Error('usage: providers.mjs <stage-timing.json>');
const { runs } = JSON.parse(readFileSync(file, 'utf8'));

/** @param {number[]} xs @param {number} q */
const pct = (xs, q) => (xs.length ? [...xs].sort((a, b) => a - b)[Math.floor(q * (xs.length - 1))] : null);
const s = (/** @type {number | null} */ ms) => (ms === null ? null : Math.round(ms / 100) / 10);

/** @type {Record<string, any[]>} */
const byArm = {};
for (const r of runs) (byArm[r.arm] ??= []).push(r);
const rows = [];
for (const [arm, list] of Object.entries(byArm)) {
  /** @type {Record<string, number>} */
  const providers = {};
  const enrichMs = [], normMs = [], tokens = [], tps = [];
  for (const r of list) {
    const enrich = r.calls.filter((/** @type {any} */ c) => c.call === 'enrich');
    const norm = r.calls.find((/** @type {any} */ c) => c.call === 'normalize');
    if (norm) normMs.push(norm.total_ms);
    if (!enrich.length) continue;
    const end = Math.max(...enrich.map((/** @type {any} */ c) => c.start + c.total_ms));
    enrichMs.push(end - Math.min(...enrich.map((/** @type {any} */ c) => c.start)));
    tokens.push(enrich.reduce((/** @type {number} */ t, /** @type {any} */ c) => t + (c.completion_tokens ?? 0), 0));
    for (const c of enrich) {
      providers[c.provider] = (providers[c.provider] ?? 0) + 1;
      if (c.completion_tokens) tps.push(c.completion_tokens / (c.total_ms / 1000));
    }
  }
  rows.push({
    arm,
    runs: list.length,
    total_p50_s: s(pct(list.map((r) => r.total_ms), 0.5)),
    normalize_p50_s: s(pct(normMs, 0.5)),
    enrich_p50_s: s(pct(enrichMs, 0.5)),
    enrich_p90_s: s(pct(enrichMs, 0.9)),
    out_tokens_p50: pct(tokens, 0.5),
    tok_per_s_p50: Math.round(pct(tps, 0.5) ?? 0),
    providers: Object.entries(providers).sort((a, b) => b[1] - a[1]).map(([p, n]) => `${p} ${n}`).join(', '),
  });
}
console.table(rows);
