// Shared by run-picks.ts and grade.ts: the draft prompts, the draft schemas, the saved-call shape
// and the rule that maps a model reply to a category (MAP-1 to MAP-7 of docs/plans/category-list.md).
//
// RUN picks the run (default 1):
//   1        the first run: first draft prompt, the 48 probes, raw.json and results.json
//   2        the second run: revised draft prompt, the 48 probes and the held-out probes,
//            raw-2.json and results-2.json
//   2-pilot, 2-pilot-b, ...  one revised draft prompt each, on the 48 probes only (never the
//            held-out ones), raw-2-pilot.json, raw-2-pilot-b.json, ...
import { readFileSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import type { Schema } from '@cfworker/json-schema';
import normalizeTemplate from '../../../proxy/prompts/normalize';
import { renderTemplate } from '../../../proxy/src/prompts';
import { schemas } from '../../../proxy/src/validate';

export const ROOT = resolve(import.meta.dirname, '../../..');
export const HERE = join(ROOT, 'docs/evidence/category-picks');
const read = <T>(path: string): T => JSON.parse(readFileSync(join(ROOT, path), 'utf8')) as T;

export const RUN = process.env.RUN ?? '1';
if (!/^(1|2|2-pilot(-[a-z])?)$/.test(RUN)) throw new Error(`unknown RUN ${RUN}`);
const suffix = RUN === '1' ? '' : `-${RUN}`;
export const RAW_FILE = join(HERE, `raw${suffix}.json`);
export const RESULTS_FILE = join(HERE, `results${suffix}.json`);
/** Every raw file of the second run, so the cost limit covers the pilots and the run together. */
export const COST_FILES = RUN === '1' ? [RAW_FILE] : readdirSync(HERE).filter((f) => /^raw-2.*\.json$/.test(f)).map((f) => join(HERE, f));

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

// Revised drafts (run 2). Each was tried on the 48 probes only; README.md says what each pilot showed.
const general2 = '- general: one id from the left of a line in CATEGORIES, by the kind of shop that sells the product. Read a brand or model name as the product it is. Use "not_a_product" for a service, a meal, a place to stay, an activity, a whole room or text you cannot read as a product, and "none" when no line fits.';
const specific2 = '- specific: "none", unless the product clearly belongs to one id on the right of the same line. For "not_a_product" give the reason: service, meal, place_to_stay, activity, room or unclear.';

// Pilot a: the two field lines follow today's last field line; the list block follows the last line.
const listHeadA = 'CATEGORIES (for general and specific only; write the other five fields as if this list were not here)';
const pilotA = `${normalizeTemplate.replace('\n\nDo not name', `\n${general2}\n${specific2}\n\nDo not name`)}\n\n${listHeadA}\n${listBlock}`;

// Pilot b: today's prompt whole and unchanged, then everything new after its last line.
const introB = 'Then add two more fields to the same object. They are labels only: write the five fields above first, for every input, exactly as you would without this part.';
const pilotB = `${normalizeTemplate}\n\n${introB}\n${general2}\n${specific2}\n\nCATEGORIES\n${listBlock}`;

// Pilot c: the list block near the top, above the shopper's request, so today's field lines are the
// last thing the model reads before the two new ones.
const fillAll = 'Write the first five fields for every input, as if CATEGORIES were not here.';
const pilotC = normalizeTemplate
  .replace("\n\nThe shopper's request", `\n\nCATEGORIES (used only for the last two fields)\n${listBlock}\n\nThe shopper's request`)
  .replace('\n\nDo not name', `\n${general2}\n${specific2}\n\nDo not name`)
  .concat(` ${fillAll}`);
if (!pilotC.includes('fields)\nkitchen:') || !pilotC.includes(`separately.\n${general2}`)) throw new Error('pilot c draft prompt: an anchor in proxy/prompts/normalize.ts moved');

// Pilot d: the layout of pilot b with a shorter lead-in and a stricter rule for the specific level.
const introD = 'Then add two labels to the same object. Write the five fields above first, for every input, as you would without this part.';
const specificD = '- specific: an id from the right of the same line only when it names exactly this kind of product; otherwise "none". For "not_a_product" give the reason: service, meal, place_to_stay, activity, room or unclear.';
const pilotD = `${normalizeTemplate}\n\n${introD}\n${general2}\n${specificD}\n\nCATEGORIES\n${listBlock}`;

// Pilot e: pilot d with a lead-in that also forbids an empty field, for input that names no product.
const introE = 'Then add two labels to the same object. Write the five fields above first, as you would without this part. Do this for every input and leave no field empty, even when the input is not a product.';
const pilotE = `${normalizeTemplate}\n\n${introE}\n${general2}\n${specificD}\n\nCATEGORIES\n${listBlock}`;

const pilots: Record<string, string> = { a: pilotA, b: pilotB, c: pilotC, d: pilotD, e: pilotE };
/** The pilot draft that the second run uses, word for word the "Prompt draft" of docs/plans/category-list.md. Frozen before any held-out call. */
const CHOSEN = 'e';

// A missed anchor would silently leave today's prompt. Removing the added text must give today's prompt back.
if (!draftTemplate1.includes(fieldLines1) || draftTemplate1.replace(`${fieldLines1}\n`, '').replace(`CATEGORIES\n${listBlock}\n\n`, '') !== normalizeTemplate) {
  throw new Error('first draft prompt: an anchor in proxy/prompts/normalize.ts moved');
}
if (!pilotA.includes(general2) || pilotA.replace(`\n${general2}\n${specific2}`, '').replace(`\n\n${listHeadA}\n${listBlock}`, '') !== normalizeTemplate) {
  throw new Error('pilot a draft prompt: an anchor in proxy/prompts/normalize.ts moved');
}
const variant = RUN === '2' ? CHOSEN : RUN === '2-pilot' ? 'a' : RUN.slice(-1);
const draftTemplate = RUN === '1' ? draftTemplate1 : pilots[variant];
if (!draftTemplate) throw new Error(`no draft prompt for RUN ${RUN}`);

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
