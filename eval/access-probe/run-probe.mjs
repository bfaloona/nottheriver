// Sends one retailer URL per registrable domain from the saved search responses through
// the deployed probe, one at a time, and writes docs/evidence/quality/probe.json after
// each one. A rerun skips domains already in that file, so no site is probed twice.
//   PROBE_URL=https://... PROBE_TOKEN=... node eval/access-probe/run-probe.mjs
/* global AbortSignal */
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { setTimeout as sleep } from 'node:timers/promises';
import { pathToFileURL } from 'node:url';

const DIR = 'docs/evidence/quality';
const OUT = `${DIR}/probe.json`;
const GAP_MS = 2000;
// Redirects across hosts mean several robots.txt and page fetches, each up to 15 s plus a 2 s gap.
const PROBE_TIMEOUT_MS = 300_000;

/** First URL seen per domain, in response order, with the section it came from. */
export function pickTargets(responses) {
  const seen = new Map();
  for (const saved of responses) {
    if (saved.status !== 200) continue;
    for (const kind of ['online', 'local']) {
      for (const r of saved.body[kind]) {
        if (r.retailer.url && !seen.has(r.retailer.domain)) seen.set(r.retailer.domain, { url: r.retailer.url, domain: r.retailer.domain, kind });
      }
    }
  }
  return [...seen.values()];
}

async function main() {
  const { PROBE_URL, PROBE_TOKEN } = process.env;
  if (!PROBE_URL || !PROBE_TOKEN) {
    console.error('Set PROBE_URL (deployed probe base URL) and PROBE_TOKEN.');
    process.exit(2);
  }
  const files = (await readdir(`${DIR}/responses`)).filter((f) => f.endsWith('.json')).sort();
  const responses = await Promise.all(files.map(async (f) => JSON.parse(await readFile(`${DIR}/responses/${f}`, 'utf8'))));
  const { results } = JSON.parse(await readFile(OUT, 'utf8').catch(() => '{"results":[]}'));
  const done = new Set(results.map((r) => r.domain));
  for (const target of pickTargets(responses)) {
    if (done.has(target.domain)) continue;
    // Target failures come back as 200 with access 'error'; anything else is the probe itself,
    // so stop rather than record it against the retailer. Progress is already saved.
    const res = await fetch(`${PROBE_URL}?url=${encodeURIComponent(target.url)}`, {
      headers: { Authorization: `Bearer ${PROBE_TOKEN}` },
      signal: AbortSignal.timeout(PROBE_TIMEOUT_MS),
    }).catch((err) => err);
    if (!res.ok) {
      console.error(`Probe failed on ${target.domain}: ${res.status ? `HTTP ${res.status}` : res.name}; check PROBE_URL and PROBE_TOKEN.`);
      process.exit(2);
    }
    const body = await res.json();
    results.push({ ...body, url: target.url, domain: target.domain, kind: target.kind });
    await writeFile(OUT, JSON.stringify({ checked: new Date().toISOString(), results }, null, 2) + '\n');
    console.log(`${target.domain}: ${body.access}`);
    await sleep(GAP_MS);
  }
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) await main();
