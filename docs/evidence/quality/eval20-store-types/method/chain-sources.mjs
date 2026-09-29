// Run from the repo root: node docs/evidence/quality/eval20-store-types/method/chain-sources.mjs
// Lists each distinct chain-badge source page shown in the run responses (run 1 and, when present, run 2)
// that chain-source-grades.json has not graded yet, for one blind check: does the linked page state a
// store count of 10 or more? The graded answer becomes badges_sourced for every row carrying that badge.
import { existsSync, readFileSync, writeFileSync } from 'node:fs';

const BASE = 'docs/evidence/quality/eval20-store-types';
const OUT = new URL('.', import.meta.url).pathname;
/** @param {string | URL} p */
const read = (p) => JSON.parse(readFileSync(p, 'utf8'));
/** @type {string[]} */
const ids = read(new URL('ids.json', import.meta.url)).ids;
const graded = new Set(existsSync(`${OUT}/chain-source-grades.json`) ? read(`${OUT}/chain-source-grades.json`).grades.map((/** @type {{ source_url: string }} */ g) => g.source_url) : []);

/** @type {Map<string, { source_url: string, label: string, stores: number, checked: string, domains: Set<string>, rows: number }>} */
const sources = new Map();
for (const dir of [BASE, `${BASE}/run2`]) {
  for (const id of ids) {
    const file = `${dir}/responses/${id}.json`;
    if (!existsSync(file)) continue;
    const b = read(file).body;
    for (const r of [...b.online, ...b.local, ...(b.local_farther ?? [])]) {
      if (!r.chain) continue;
      const e = sources.get(r.chain.source_url) ?? { source_url: r.chain.source_url, label: r.chain.label, stores: r.chain.stores, checked: r.chain.checked, domains: new Set(), rows: 0 };
      e.domains.add(r.retailer.domain);
      e.rows++;
      sources.set(r.chain.source_url, e);
    }
  }
}
const todo = [...sources.values()].filter((e) => !graded.has(e.source_url)).map((e) => ({ source_url: e.source_url, badge_label: e.label, stated_stores: e.stores, domains: [...e.domains] }));
// Nothing to check must not overwrite the list the last grader was given.
if (todo.length > 0) writeFileSync(`${OUT}/chain-sources.json`, JSON.stringify({ rows: todo }, null, 1) + '\n');
console.log({ distinct_sources: sources.size, already_graded: graded.size, to_check: todo.length });
