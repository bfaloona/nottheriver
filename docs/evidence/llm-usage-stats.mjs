// Token and cost figures per model call and per search, from saved responses' `usage.llm`
// (cost is OpenRouter's reported figure). Used for the measured column in docs/costs.md.
// Run: node docs/evidence/llm-usage-stats.mjs <responses-dir> [<responses-dir> ...]
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

// The price every call was billed at in the 2026-10-01 check (ModelRun and SiliconFlow's list price).
const ROUTED_USD_PER_TOKEN = { prompt: 0.75e-6, completion: 1.0e-6 };

/** @param {number[]} xs */
function spread(xs) {
  const a = [...xs].sort((x, y) => x - y);
  const mid = a.length / 2;
  const median = a.length % 2 ? a[Math.floor(mid)] : (a[mid - 1] + a[mid]) / 2;
  return { n: a.length, min: a[0], median, max: a[a.length - 1], sum: a.reduce((s, x) => s + x, 0) };
}

/** @type {Record<string, Array<{ prompt_tokens: number; completion_tokens: number; cost_usd: number | null }>>} */
const calls = { normalize: [], enrich: [] };
/** @type {Array<{ brave: number; normalize: number; enrichPrompt: number; enrichCompletion: number; cost: number }>} */
const searches = [];
for (const dir of process.argv.slice(2)) {
  for (const file of readdirSync(dir).filter((f) => f.endsWith('.json'))) {
    const usage = JSON.parse(readFileSync(join(dir, file), 'utf8')).body?.usage;
    if (!usage) continue;
    const s = { brave: usage.brave_calls, normalize: 0, enrichPrompt: 0, enrichCompletion: 0, cost: 0 };
    for (const c of usage.llm) {
      calls[c.call].push(c);
      s.cost += c.cost_usd ?? 0;
      if (c.call === 'normalize') s.normalize++;
      else { s.enrichPrompt += c.prompt_tokens; s.enrichCompletion += c.completion_tokens; }
    }
    searches.push(s);
  }
}
for (const [name, cs] of Object.entries(calls)) {
  console.log(name, JSON.stringify({
    prompt: spread(cs.map((c) => c.prompt_tokens)),
    completion: spread(cs.map((c) => c.completion_tokens)),
    cost: spread(cs.flatMap((c) => (c.cost_usd === null ? [] : [c.cost_usd]))),
    cost_missing: cs.filter((c) => c.cost_usd === null).length,
    billed_at_routed_price: cs.filter((c) => c.cost_usd !== null
      && Math.abs(c.cost_usd - (c.prompt_tokens * ROUTED_USD_PER_TOKEN.prompt + c.completion_tokens * ROUTED_USD_PER_TOKEN.completion)) < 1e-9).length,
  }));
}
console.log('per search', JSON.stringify({
  searches: searches.length,
  normalize_calls: spread(searches.map((s) => s.normalize)).sum,
  brave: spread(searches.map((s) => s.brave)),
  enrich_prompt: spread(searches.map((s) => s.enrichPrompt)),
  enrich_completion: spread(searches.map((s) => s.enrichCompletion)),
  model_cost: spread(searches.map((s) => s.cost)),
}));
