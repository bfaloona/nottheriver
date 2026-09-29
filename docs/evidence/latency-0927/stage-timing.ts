// Runs the real Worker pipeline locally with a timing fetch, to split a search into stages.
// Keys are read from the files named in infra/deploy.local.env and never printed.
// Usage (from repo root): npx tsx <this file> <outdir> "product" ["product" ...]
//   ARMS=default,throughput  runs each product once per arm, alternating, so load swings hit
//                            every arm. An arm naming "throughput" or "latency" sets OpenRouter
//                            provider.sort; an arm starting "alt" runs the pipeline at ALT_ROOT
//                            (another checkout, e.g. a prototype worktree) instead of this one.
//   ROUNDS=2                 repeats the whole set.
//   EVAL=1                   takes eval/queries.json (or the ids given) instead of products, and
//                            saves each response the way eval/run-searches.mjs does, for eval/compare.mjs.
import fs from 'node:fs';
import path from 'node:path';
import { runSearch } from '../../../proxy/src/pipeline';

type RunSearch = typeof runSearch;
const ROOT = path.resolve(import.meta.dirname, '../../..');
const altRunSearch: RunSearch | null = process.env.ALT_ROOT
  ? ((await import(path.join(path.resolve(process.env.ALT_ROOT), 'proxy/src/pipeline.ts'))) as { runSearch: RunSearch }).runSearch
  : null;
const sortOf = (arm: string) => ['throughput', 'latency'].find((s) => arm.includes(s));
const DEFAULT_ZIP = '97214';
const [outDir, ...args] = process.argv.slice(2);
const arms = (process.env.ARMS ?? 'default').split(',');
const rounds = Number(process.env.ROUNDS ?? 1);
const evalMode = process.env.EVAL === '1';

const envFile = fs.readFileSync(path.join(ROOT, 'infra/deploy.local.env'), 'utf8');
const conf = Object.fromEntries(envFile.split('\n').filter((l) => /^[A-Z_]+=/.test(l)).map((l) => [l.slice(0, l.indexOf('=')), l.slice(l.indexOf('=') + 1).trim()]));
const readKey = (name: string) => fs.readFileSync(conf[name]!.replace(/^~/, process.env.HOME!), 'utf8').trim();

const zips = JSON.parse(fs.readFileSync(path.join(ROOT, 'public/zips.json'), 'utf8'));
const r2 = (x: number) => Math.round(x * 100) / 100;
function placeFor(zip: string) {
  const i = zips.zip.indexOf(zip);
  if (i < 0) throw new Error(`zip ${zip} not in public/zips.json`);
  return { city: zips.city[i], state: zips.state[i], lat: r2(zips.lat[i]), lon: r2(zips.lon[i]), ...(zips.ruca[i] != null && { ruca: zips.ruca[i] }) };
}

interface Job { id: string; product: string; zip: string }
const jobs: Job[] = evalMode
  ? (JSON.parse(fs.readFileSync(path.join(ROOT, 'eval/queries.json'), 'utf8')).queries as Job[]).filter((q) => args.length === 0 || args.includes(q.id))
  : args.map((product) => ({ id: product.replace(/\W+/g, '-'), product, zip: DEFAULT_ZIP }));

const env = {
  BRAVE_API_KEY: readKey('BRAVE_API_KEY_FILE'),
  OPENROUTER_API_KEY: readKey('OPENROUTER_API_KEY_FILE'),
  ALLOWED_ORIGIN: conf.ALLOWED_ORIGIN!,
  SITE_NAME: 'nottheriver',
  SITE_URL: conf.SITE_URL!,
};

async function searchOnce(job: Job, arm: string, round: number) {
  const t0 = performance.now();
  const calls: Record<string, unknown>[] = [];
  let enrichCalls = 0;
  const timedFetch: typeof fetch = async (input, init) => {
    const url = new URL(typeof input === 'string' ? input : (input as Request).url);
    let body = init?.body;
    const sort = sortOf(arm);
    if (url.host === 'openrouter.ai' && sort && typeof body === 'string') {
      const parsed = JSON.parse(body);
      body = JSON.stringify({ ...parsed, provider: { ...parsed.provider, sort } });
    }
    const start = performance.now() - t0;
    const res = await fetch(input, { ...init, body });
    const headersAt = performance.now() - t0;
    const text = await res.text();
    const end = performance.now() - t0;
    const entry: Record<string, unknown> = { host: url.host, path: url.pathname, status: res.status, start: Math.round(start), headers_ms: Math.round(headersAt - start), total_ms: Math.round(end - start) };
    if (url.host === 'openrouter.ai') {
      try {
        const j = JSON.parse(text);
        const call = String(body ?? '').includes('"name":"enrich"') ? 'enrich' : 'normalize';
        Object.assign(entry, { call, provider: j.provider, model: j.model, prompt_tokens: j.usage?.prompt_tokens, completion_tokens: j.usage?.completion_tokens, out_chars: j.choices?.[0]?.message?.content?.length });
        if (call === 'enrich' && !evalMode) {
          // A split arm makes two enrich calls; the second is kept as -enrich-out-2 instead of overwriting the first.
          enrichCalls++;
          fs.writeFileSync(path.join(outDir!, `${job.id}-enrich-out${enrichCalls > 1 ? `-${enrichCalls}` : ''}.json`), j.choices?.[0]?.message?.content ?? '');
        }
      } catch { /* timing still recorded */ }
    }
    calls.push(entry);
    return new Response(text, { status: res.status, headers: res.headers });
  };
  const request = { product: job.product, ...placeFor(job.zip) };
  let status = 'ok';
  let response: unknown = null;
  const run = arm.startsWith('alt') ? altRunSearch : runSearch;
  if (!run) throw new Error(`arm ${arm} needs ALT_ROOT`);
  try {
    response = await run(request, env, { fetch: timedFetch, now: () => Date.now(), log: () => {} });
  } catch (e) {
    status = (e as Error).name;
  }
  const elapsed = Math.round(performance.now() - t0);
  if (evalMode) {
    const dir = path.join(outDir!, `${arm}-r${round}`, 'responses');
    fs.mkdirSync(dir, { recursive: true });
    const saved = { id: job.id, checked: new Date().toISOString(), request, status: status === 'ok' ? 200 : 502, elapsed_ms: elapsed, body: response ?? { error: status } };
    fs.writeFileSync(path.join(dir, `${job.id}.json`), JSON.stringify(saved, null, 2));
  }
  return { id: job.id, arm, round, status, total_ms: elapsed, calls };
}

fs.mkdirSync(outDir!, { recursive: true });
const runs: Awaited<ReturnType<typeof searchOnce>>[] = [];
// Rewritten after every search, so a crash partway through a long run keeps the timings so far.
const save = () => fs.writeFileSync(path.join(outDir!, 'stage-timing.json'), JSON.stringify({ zip: evalMode ? 'per eval query' : DEFAULT_ZIP, arms, rounds, ran: new Date().toISOString(), runs }, null, 2));
for (let round = 1; round <= rounds; round++) {
  for (const [n, job] of jobs.entries()) {
    // Alternate which arm goes first so neither always gets the fresher provider queue.
    const order = n % 2 === round % 2 ? arms : [...arms].reverse();
    for (const arm of order) {
      const run = await searchOnce(job, arm, round);
      runs.push(run);
      save();
      // With a split arm there are two enrich calls; show the pair's wall time and summed tokens.
      const enrich = run.calls.filter((c) => c.call === 'enrich') as Array<{ start: number; total_ms: number; completion_tokens?: number; provider?: string }>;
      const wall = Math.max(...enrich.map((c) => c.start + c.total_ms)) - Math.min(...enrich.map((c) => c.start));
      const tokens = enrich.reduce((t, c) => t + (c.completion_tokens ?? 0), 0);
      const summary = enrich.length ? `${wall} ms, ${tokens} tok, ${enrich.map((c) => c.provider ?? '-').join('+')}` : '- ms, - tok, -';
      console.log(`${run.id} ${arm} r${round}: ${run.status} ${run.total_ms} ms; enrich ${summary}`);
    }
  }
}
