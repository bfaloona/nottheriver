// Step 2: replay each eval20-0924 search's local queries straight to Brave place search,
// same coordinates and count as the Worker. Usage (repo root): node <this> <replay-number>
// Resumable: skips files already saved with results.
import { readFileSync, readdirSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const DIR = new URL('.', import.meta.url).pathname;
const n = process.argv[2];
if (!n) throw new Error('replay number required');
const OUT = `${DIR}replay-${n}/`;
mkdirSync(OUT, { recursive: true });
const SRC = 'docs/evidence/quality/eval20-0924/responses/';

for (const f of readdirSync(SRC).filter((x) => x.endsWith('.json')).sort()) {
  const { request, body } = JSON.parse(readFileSync(SRC + f, 'utf8'));
  for (const [i, q] of body.query.local_queries.entries()) {
    const out = `${OUT}${f.replace('.json', '')}__${i}.json`;
    if (existsSync(out)) continue;
    const raw = execFileSync('node', [DIR + 'brave.mjs', 'place', q, String(request.lat), String(request.lon)], { encoding: 'utf8' });
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed.results)) throw new Error(`${f} q${i}: no results array: ${raw.slice(0, 200)}`);
    writeFileSync(out, JSON.stringify({ q, at: new Date().toISOString(), body: parsed }));
    await new Promise((r) => setTimeout(r, 1100));
  }
}
console.log('done', n);
