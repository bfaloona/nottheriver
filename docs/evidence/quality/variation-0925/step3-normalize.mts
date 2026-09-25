// Step 3: run the production normalize call alone, RUNS times per sampled search, with the
// Worker's request settings, and record the local queries after the Worker's post-processing
// plus which provider served each run. No Brave calls.
// Run from the repo root: node <this folder>/with-openrouter.mjs <this folder>/step3-normalize.mts [runs]
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { buildNormalizePrompt } from '../../../../proxy/src/prompts.ts';
import { MAX_LOCAL_QUERIES, scrubNormalized } from '../../../../proxy/src/pipeline.ts';
import { MODELS, NORMALIZE_MAX_TOKENS } from '../../../../proxy/src/llm.ts';
import { schemas, structuralOnly } from '../../../../proxy/src/validate.ts';

const RUNS = Number(process.argv[2] ?? 3);
const OUT = new URL('.', import.meta.url).pathname + (process.env.OUT_NAME ?? 'step3.json');
const SRC = 'docs/evidence/quality/eval20-0924/responses/';
const out: Record<string, unknown[]> = existsSync(OUT) ? JSON.parse(readFileSync(OUT, 'utf8')) : {};

for (const f of readdirSync(SRC).filter((x) => x.endsWith('.json')).sort()) {
  const id = f.replace('.json', '');
  const { request } = JSON.parse(readFileSync(SRC + f, 'utf8'));
  out[id] ??= [];
  while (out[id].length < RUNS) {
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`, 'Content-Type': 'application/json', 'HTTP-Referer': 'http://localhost:5173', 'X-OpenRouter-Title': 'nottheriver' },
      body: JSON.stringify({
        models: MODELS,
        messages: [{ role: 'user', content: buildNormalizePrompt(request) }],
        response_format: { type: 'json_schema', json_schema: { name: 'normalize', strict: true, schema: structuralOnly(schemas.normalize) } },
        provider: { require_parameters: true, data_collection: 'deny' },
        max_completion_tokens: NORMALIZE_MAX_TOKENS,
        temperature: 0,
      }),
    });
    type Completion = { provider?: string; model?: string; usage?: { cost?: number }; choices: { message: { content: string } }[] };
    const j = (await res.json().catch(() => null)) as Completion | null;
    let local: string[] | null = null, category: string | null = null;
    try {
      const n = scrubNormalized(JSON.parse(j!.choices[0].message.content), request.product);
      local = n.local_queries.slice(0, MAX_LOCAL_QUERIES);
      category = n.category;
    } catch { /* recorded as null */ }
    out[id].push({ status: res.status, provider: j?.provider ?? null, model: j?.model ?? null, cost: j?.usage?.cost ?? null, category, local_queries: local });
    writeFileSync(OUT, JSON.stringify(out, null, 1));
  }
}
console.log('done');
