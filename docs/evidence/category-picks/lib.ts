// Shared by run-picks.ts and grade.ts: the draft prompts, the draft schemas, the saved-call shape
// and the rule that maps a model reply to a category (MAP-1 to MAP-7 of docs/plans/category-list.md).
//
// RUN picks the run (default 1):
//   1        the first run: first draft prompt, the 48 probes, raw.json and results.json
//   2        the second run: revised draft prompt, the 48 probes and the held-out probes,
//            raw-2.json and results-2.json
//   2-pilot  the revised draft prompt on the 48 probes only (never the held-out ones),
//            raw-2-pilot.json and results-2-pilot.json
import { readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import type { Schema } from '@cfworker/json-schema';
import normalizeTemplate from '../../../proxy/prompts/normalize';
import { renderTemplate } from '../../../proxy/src/prompts';
import { schemas } from '../../../proxy/src/validate';

export const ROOT = resolve(import.meta.dirname, '../../..');
export const HERE = join(ROOT, 'docs/evidence/category-picks');
const read = <T>(path: string): T => JSON.parse(readFileSync(join(ROOT, path), 'utf8')) as T;

export const RUN = process.env.RUN ?? '1';
if (!['1', '2', '2-pilot'].includes(RUN)) throw new Error(`unknown RUN ${RUN}`);
const suffix = RUN === '1' ? '' : `-${RUN}`;
export const RAW_FILE = join(HERE, `raw${suffix}.json`);
export const RESULTS_FILE = join(HERE, `results${suffix}.json`);
/** Every raw file of the second run, so the cost limit covers the pilot and the run together. */
export const COST_FILES = RUN === '1' ? [RAW_FILE] : [join(HERE, 'raw-2.json'), join(HERE, 'raw-2-pilot.json')];

export type Pick = [string, string | null];
export type ProbeKind = 'brand' | 'nonproduct' | 'gap' | 'two' | 'general';
export type ProbeSet = 'tuned' | 'held_out';
export interface Probe { input: string; kind: ProbeKind; pick: Pick; alt?: Pick; set: ProbeSet }
interface List { general: { id: string; specific: { id: string }[] }[]; reserved: { id: string; reasons?: { id: string }[] }[] }

type Labeled = Omit<Probe, 'set'>;
const tuned = read<{ probes: Labeled[] }>('docs/evidence/category-list/hand-labels.json').probes;
const heldOutFile = read<{ probes: Labeled[]; brand_words: Record<string, string[]> }>('docs/evidence/category-picks/held-out.json');
export const heldOutBrandWords = heldOutFile.brand_words;
export const probes: Probe[] = [
  ...tuned.map((p) => ({ ...p, set: 'tuned' as const })),
  ...(RUN === '2' ? heldOutFile.probes.map((p) => ({ ...p, set: 'held_out' as const })) : []),
];
export const probeSets: ProbeSet[] = RUN === '2' ? ['tuned', 'held_out'] : ['tuned'];
const list = read<List>('data/categories.draft.json');

export type Arm = 'draft' | 'today';

const listBlock = list.general.map((g) => (g.specific.length ? `${g.id}: ${g.specific.map((s) => s.id).join(', ')}` : g.id)).join('\n');

// First draft (run 1): the two field lines above `- category:` and the list block above the last line.
const fieldLines1 = [
  '- general: one id from the left of a line in CATEGORIES, by the kind of shop that sells the product. Read a brand or model name as the product it is. Use "not_a_product" for a service, a meal, a place to stay, an activity or a whole room, and "none" when no line fits.',
  '- specific: one id from the right of the same line when one fits, else "". For "not_a_product" give the reason: service, meal, place_to_stay, activity, room or unclear.',
].join('\n');
const draftTemplate1 = normalizeTemplate
  .replace('- category:', `${fieldLines1}\n- category:`)
  .replace('\n\nDo not name', `\n\nCATEGORIES\n${listBlock}\n\nDo not name`);

// Revised draft (run 2), word for word from the "Prompt draft" section of docs/plans/category-list.md.
// Today's prompt stays whole and unchanged; the two field lines follow the last field of today
// and the list block follows the last line, so the reply's old fields are written before the pick.
const fieldLines2 = [
  '- general: one id from the left of a line in CATEGORIES, by the kind of shop that sells the product. Read a brand or model name as the product it is. Use "not_a_product" for a service, a meal, a place to stay, an activity, a whole room or text you cannot read as a product, and "none" when no line fits.',
  '- specific: "none", unless the product clearly belongs to one id on the right of the same line. For "not_a_product" give the reason: service, meal, place_to_stay, activity, room or unclear.',
].join('\n');
const listHead2 = 'CATEGORIES (for general and specific only; write the other five fields as if this list were not here)';
const draftTemplate2 = `${normalizeTemplate.replace('\n\nDo not name', `\n${fieldLines2}\n\nDo not name`)}\n\n${listHead2}\n${listBlock}`;

// A missed anchor would silently leave today's prompt. Removing the added text must give today's prompt back.
if (!draftTemplate1.includes(fieldLines1) || draftTemplate1.replace(`${fieldLines1}\n`, '').replace(`CATEGORIES\n${listBlock}\n\n`, '') !== normalizeTemplate) {
  throw new Error('first draft prompt: an anchor in proxy/prompts/normalize.ts moved');
}
if (!draftTemplate2.includes(fieldLines2) || draftTemplate2.replace(`\n${fieldLines2}`, '').replace(`\n\n${listHead2}\n${listBlock}`, '') !== normalizeTemplate) {
  throw new Error('revised draft prompt: an anchor in proxy/prompts/normalize.ts moved');
}
const draftTemplate = RUN === '1' ? draftTemplate1 : draftTemplate2;

export function buildPrompt(arm: Arm, product: string): string {
  return renderTemplate(arm === 'draft' ? draftTemplate : normalizeTemplate, { product: JSON.stringify(product) });
}

// Any string validates, so an off-list reply maps to "none" in code and never fails the search.
const anyId = { type: 'string', maxLength: 60 } as const;
const today = schemas.normalize;
// Run 1 put the new fields first in the schema; run 2 puts them last, as in its prompt.
export const draftSchema: Schema = {
  ...today,
  required: [...(today.required ?? []), 'general', 'specific'],
  properties: RUN === '1' ? { general: anyId, specific: anyId, ...today.properties } : { ...today.properties, general: anyId, specific: anyId },
};

export interface Reply {
  general?: string;
  specific?: string;
  category: string;
  canonical_name: string;
  similar_products: string[];
  online_queries: string[];
  local_queries: string[];
}

/** One HTTP attempt. `response` is OpenRouter's reply body as received (parsed when it is JSON). */
export interface Attempt {
  started: string;
  ms: number;
  http_status: number | null;
  valid: boolean;
  response: unknown;
}
export interface Call { input: string; kind: ProbeKind; arm: Arm; round: number; attempts: Attempt[] }
export interface RawFile { about: string; request: unknown; prompts: Record<Arm, { example_input: string; chars: number; text: string }>; calls: Call[] }

export const generalIds = new Set(list.general.map((g) => g.id));
const parentOf = new Map(list.general.flatMap((g) => g.specific.map((s) => [s.id, g.id] as const)));
/** Every general and specific id. */
export const listIds = new Set([...generalIds, ...parentOf.keys()]);
/** "none" and "not_a_product". */
export const reservedIds = new Set(list.reserved.map((r) => r.id));
const reasons = new Set(list.reserved.find((r) => r.id === 'not_a_product')?.reasons?.map((r) => r.id));

export interface Mapped { general: string; specific: string | null; rule: string }
const tidy = (s: unknown) => (typeof s === 'string' ? s.toLowerCase().trim().replace(/[\s-]+/g, '_') : '');

export function mapPick(rawGeneral: unknown, rawSpecific: unknown): Mapped {
  const g = tidy(rawGeneral);
  const s = tidy(rawSpecific);
  if (g === 'not_a_product') return { general: g, specific: reasons.has(s) ? s : 'unclear', rule: 'MAP-6' };
  if (generalIds.has(g)) {
    if (parentOf.get(s) === g) return { general: g, specific: s, rule: 'MAP-2' };
    return { general: g, specific: null, rule: parentOf.has(s) ? 'MAP-4' : 'MAP-3' };
  }
  // A reply of "none" is a known value, not an unknown one, so MAP-5 does not rescue it.
  if (g !== 'none' && parentOf.has(s)) return { general: parentOf.get(s)!, specific: s, rule: 'MAP-5' };
  return { general: 'none', specific: null, rule: 'MAP-7' };
}
