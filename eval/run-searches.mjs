// Runs every query in eval/queries.json against the deployed Worker and saves each raw
// response. Run with tsx so the zip lookup is the browser's own code:
//   WORKER_URL=https://... ORIGIN=https://... npx tsx eval/run-searches.mjs [id ...]
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { setTimeout as sleep } from 'node:timers/promises';
import { pathToFileURL } from 'node:url';
import { lookupZip } from '../src/zip.ts';
import { totals, usageRow } from './summarize.mjs';

export const OUT_DIR = 'docs/evidence/quality';
// The Worker allows 30 searches per minute per client and 60 overall; 15 per minute
// leaves room for real visitors during a run.
const DEFAULT_DELAY_MS = 4000;
const TIMEOUT_MS = 60_000;

/** The request the browser would send: the zip itself never leaves this function. */
export function buildRequest(query, zips) {
  const loc = lookupZip(query.zip, zips);
  if (!loc) throw new Error(`${query.id}: zip not found in public/zips.json`);
  return { product: query.product, city: loc.city, state: loc.state, lat: loc.lat, lon: loc.lon };
}

async function post(url, origin, request) {
  const started = Date.now();
  let res, text;
  try {
    res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Origin: origin },
      body: JSON.stringify(request),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    text = await res.text();
  } catch (err) {
    // Saved as status 0 so the next run retries it instead of hanging this one.
    return { status: 0, elapsed_ms: Date.now() - started, body: { error: err.name } };
  }
  let body = text;
  try {
    body = JSON.parse(text);
  } catch {
    // Keep non-JSON bodies verbatim; they are evidence too.
  }
  return { status: res.status, retryAfter: Number(res.headers.get('retry-after')) || 60, elapsed_ms: Date.now() - started, body };
}

async function readSaved(file) {
  try {
    return JSON.parse(await readFile(file, 'utf8'));
  } catch {
    return null;
  }
}

async function main() {
  const { WORKER_URL, ORIGIN } = process.env;
  const delay = Number(process.env.DELAY_MS ?? DEFAULT_DELAY_MS);
  if (!WORKER_URL || !ORIGIN) {
    console.error('Set WORKER_URL (Worker base URL) and ORIGIN (the Worker ALLOWED_ORIGIN).');
    process.exit(2);
  }
  const { queries } = JSON.parse(await readFile('eval/queries.json', 'utf8'));
  const zips = JSON.parse(await readFile('public/zips.json', 'utf8'));
  const only = new Set(process.argv.slice(2));
  const endpoint = `${WORKER_URL.replace(/\/$/, '')}/search`;
  await mkdir(`${OUT_DIR}/responses`, { recursive: true });

  const rows = [];
  for (const query of queries) {
    if (only.size > 0 && !only.has(query.id)) continue;
    const file = `${OUT_DIR}/responses/${query.id}.json`;
    const existing = await readSaved(file);
    // Resuming after an interruption must not pay for searches that already succeeded.
    if (existing?.status === 200) {
      rows.push(usageRow(existing));
      continue;
    }
    const request = buildRequest(query, zips);
    let result = await post(endpoint, ORIGIN, request);
    if (result.status === 429) {
      await sleep(result.retryAfter * 1000);
      result = await post(endpoint, ORIGIN, request);
    }
    const saved = { id: query.id, checked: new Date().toISOString(), request, status: result.status, elapsed_ms: result.elapsed_ms, body: result.body };
    await writeFile(file, JSON.stringify(saved, null, 2) + '\n');
    rows.push(usageRow(saved));
    console.log(`${query.id}: ${result.status} in ${result.elapsed_ms} ms`);
    await sleep(delay);
  }

  const headline = totals(rows);
  await writeFile(`${OUT_DIR}/run-summary.json`, JSON.stringify({ checked: new Date().toISOString(), ...headline, rows }, null, 2) + '\n');
  console.log(headline);
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) await main();
