// Research aid, per docs/plans/store-types.md: domains that show up at 3+ distinct local addresses
// across saved eval responses are candidates for a curated chain list, never a chain label by
// themselves (a shared domain can also mean dealer-owned locations, or a place-search artifact).
// Scoped to each run's own `<run>/responses/` folder, one level under docs/evidence/quality; the
// pre-run-folder docs/evidence/quality/responses/ and nested reruns (eval20-0925/run2,
// variation-0925/replay-*) are out of scope for this pass.
//   node docs/evidence/quality/chain-candidates.mjs > docs/evidence/quality/chain-candidates.json
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

const ROOT = 'docs/evidence/quality';
const THRESHOLD = 3;

/** @param {string} path */
function isDir(path) {
  try {
    return statSync(path).isDirectory();
  } catch {
    return false;
  }
}

/** Every saved response file directly under a `<run>/responses/` folder. @returns {string[]} */
function responseFiles() {
  const files = [];
  for (const run of readdirSync(ROOT)) {
    const dir = `${ROOT}/${run}/responses`;
    if (!isDir(dir)) continue;
    for (const f of readdirSync(dir)) if (f.endsWith('.json')) files.push(`${dir}/${f}`);
  }
  return files;
}

/** @param {string} path @returns {object|null} A saved search's response body, or null for a failed search. */
function readResponseBody(path) {
  const saved = JSON.parse(readFileSync(path, 'utf8'));
  return saved.status === 200 ? saved.body : null;
}

/**
 * Domain -> distinct street addresses seen for it (first comma-separated segment, lowercased, so the
 * same store re-geocoded with slightly different casing or trailing whitespace still counts as one).
 * @param {object[]} bodies
 * @returns {Map<string, Set<string>>}
 */
export function addressesByDomain(bodies) {
  const byDomain = new Map();
  for (const body of bodies) {
    for (const r of [...(body.local ?? []), ...(body.local_farther ?? [])]) {
      if (!r.address) continue;
      const addr = r.address.split(',')[0].trim().toLowerCase();
      if (!addr) continue;
      const set = byDomain.get(r.retailer.domain) ?? new Set();
      set.add(addr);
      byDomain.set(r.retailer.domain, set);
    }
  }
  return byDomain;
}

/**
 * @param {Map<string, Set<string>>} byDomain @param {number} threshold
 * @returns {{ domain: string, addresses: number }[]} Sorted most-branches first, then alphabetically.
 */
export function candidates(byDomain, threshold) {
  return [...byDomain.entries()]
    .filter(([, addrs]) => addrs.size >= threshold)
    .map(([domain, addrs]) => ({ domain, addresses: addrs.size }))
    .sort((a, b) => b.addresses - a.addresses || a.domain.localeCompare(b.domain));
}

function main() {
  const bodies = /** @type {object[]} */ (responseFiles().map(readResponseBody).filter(Boolean));
  console.log(JSON.stringify(candidates(addressesByDomain(bodies), THRESHOLD), null, 2));
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) main();
