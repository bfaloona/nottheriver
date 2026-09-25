// Local baseline shops found in eval60 vs eval20-0924, using summarize's own matching.
import { readFileSync } from 'node:fs';
import { recall, sectionResults } from '../../../../../eval/summarize.mjs';
const read = (p) => JSON.parse(readFileSync(p, 'utf8'));
const ids = read(new URL('ids.json', import.meta.url)).ids;
const base = read('docs/evidence/quality/eval60/grades.json').baseline.filter((b) => ids.includes(b.search_id) && b.section === 'local' && b.confirmed);
const missed = (dir) => {
  const r = (id, sec) => { const s = read(`docs/evidence/quality/${dir}/responses/${id}.json`); return s.status === 200 ? sectionResults(s.body, sec) : []; };
  const one = (b) => recall([b], r).found === 0;
  return new Set(base.filter(one).map((b) => `${b.search_id} | ${b.name}`));
};
const a = missed('eval60'); const b = missed('eval20-0924');
console.log({ lost: [...b].filter((x) => !a.has(x)), gained: [...a].filter((x) => !b.has(x)) });
