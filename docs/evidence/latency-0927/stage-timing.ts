// Runs the real Worker pipeline locally with a timing fetch, to split a search into stages.
// Keys are read from the files named in infra/deploy.local.env and never printed.
// Usage (from repo root): npx tsx <this file> <outdir> "product" ["product" ...]
import fs from 'node:fs';
import path from 'node:path';
import { runSearch } from '../../../proxy/src/pipeline';

const ROOT = path.resolve(import.meta.dirname, '../../..');
const ZIP = '97214';
const [outDir, ...products] = process.argv.slice(2);

const envFile = fs.readFileSync(path.join(ROOT, 'infra/deploy.local.env'), 'utf8');
const conf = Object.fromEntries(envFile.split('\n').filter((l) => /^[A-Z_]+=/.test(l)).map((l) => [l.slice(0, l.indexOf('=')), l.slice(l.indexOf('=') + 1).trim()]));
const readKey = (name: string) => fs.readFileSync(conf[name]!.replace(/^~/, process.env.HOME!), 'utf8').trim();

const zips = JSON.parse(fs.readFileSync(path.join(ROOT, 'public/zips.json'), 'utf8'));
const i = zips.zip.indexOf(ZIP);
const r2 = (x: number) => Math.round(x * 100) / 100;
const place = { city: zips.city[i], state: zips.state[i], lat: r2(zips.lat[i]), lon: r2(zips.lon[i]), ...(zips.ruca[i] != null && { ruca: zips.ruca[i] }) };

const env = {
  BRAVE_API_KEY: readKey('BRAVE_API_KEY_FILE'),
  OPENROUTER_API_KEY: readKey('OPENROUTER_API_KEY_FILE'),
  ALLOWED_ORIGIN: conf.ALLOWED_ORIGIN!,
  SITE_NAME: 'nottheriver',
  SITE_URL: conf.SITE_URL!,
};

fs.mkdirSync(outDir!, { recursive: true });
const runs = [];
for (const product of products) {
  const t0 = performance.now();
  const calls: Record<string, unknown>[] = [];
  const timedFetch: typeof fetch = async (input, init) => {
    const url = new URL(typeof input === 'string' ? input : (input as Request).url);
    const start = performance.now() - t0;
    const res = await fetch(input, init);
    const headersAt = performance.now() - t0;
    const text = await res.text();
    const end = performance.now() - t0;
    const entry: Record<string, unknown> = { host: url.host, path: url.pathname, status: res.status, start: Math.round(start), headers_ms: Math.round(headersAt - start), total_ms: Math.round(end - start) };
    if (url.host === 'openrouter.ai') {
      try {
        const j = JSON.parse(text);
        const call = String(init?.body ?? '').includes('"name":"enrich"') ? 'enrich' : 'normalize';
        Object.assign(entry, { call, provider: j.provider, model: j.model, prompt_tokens: j.usage?.prompt_tokens, completion_tokens: j.usage?.completion_tokens, out_chars: j.choices?.[0]?.message?.content?.length });
        if (call === 'enrich') fs.writeFileSync(path.join(outDir!, `${product.replace(/\W+/g, '-')}-enrich-out.json`), j.choices?.[0]?.message?.content ?? '');
      } catch { /* timing still recorded */ }
    }
    calls.push(entry);
    return new Response(text, { status: res.status, headers: res.headers });
  };
  let status = 'ok';
  try {
    await runSearch({ product, ...place }, env, { fetch: timedFetch, now: () => Date.now(), log: () => {} });
  } catch (e) {
    status = (e as Error).name;
  }
  const run = { product, status, total_ms: Math.round(performance.now() - t0), calls };
  runs.push(run);
  console.log(JSON.stringify(run));
}
fs.writeFileSync(path.join(outDir!, 'stage-timing.json'), JSON.stringify({ zip: ZIP, ran: new Date().toISOString(), runs }, null, 2));
