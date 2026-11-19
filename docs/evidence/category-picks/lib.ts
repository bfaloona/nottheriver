// Shared by run-picks.ts and grade.ts: the draft prompt, the draft schema, the saved-call shape
// and the rule that maps a model reply to a category (MAP-1 to MAP-7 of docs/plans/category-list.md).
import { readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import type { Schema } from '@cfworker/json-schema';
import normalizeTemplate from '../../../proxy/prompts/normalize';
import { renderTemplate } from '../../../proxy/src/prompts';
import { schemas } from '../../../proxy/src/validate';

export const ROOT = resolve(import.meta.dirname, '../../..');
export const HERE = join(ROOT, 'docs/evidence/category-picks');
export const RAW_FILE = join(HERE, 'raw.json');
const read = <T>(path: string): T => JSON.parse(readFileSync(join(ROOT, path), 'utf8')) as T;

export type Pick = [string, string | null];
export type ProbeKind = 'brand' | 'nonproduct' | 'gap' | 'two';
export interface Probe { input: string; kind: ProbeKind; pick: Pick; alt?: Pick }
interface List { general: { id: string; specific: { id: string }[] }[]; reserved: { id: string; reasons?: { id: string }[] }[] }

export const probes = read<{ probes: Probe[] }>('docs/evidence/category-list/hand-labels.json').probes;
const list = read<List>('data/categories.draft.json');

export type Arm = 'draft' | 'today';

// The two field lines and the list block, word for word from the "Prompt draft" section of
// docs/plans/category-list.md. The list block is built from the data file, as run-tests.ts builds it.
const fieldLines = [
  '- general: one id from the left of a line in CATEGORIES, by the kind of shop that sells the product. Read a brand or model name as the product it is. Use "not_a_product" for a service, a meal, a place to stay, an activity or a whole room, and "none" when no line fits.',
  '- specific: one id from the right of the same line when one fits, else "". For "not_a_product" give the reason: service, meal, place_to_stay, activity, room or unclear.',
].join('\n');
const listBlock = list.general.map((g) => (g.specific.length ? `${g.id}: ${g.specific.map((s) => s.id).join(', ')}` : g.id)).join('\n');
const draftTemplate = normalizeTemplate
  .replace('- category:', `${fieldLines}\n- category:`)
  .replace('\n\nDo not name', `\n\nCATEGORIES\n${listBlock}\n\nDo not name`);

export function buildPrompt(arm: Arm, product: string): string {
  return renderTemplate(arm === 'draft' ? draftTemplate : normalizeTemplate, { product: JSON.stringify(product) });
}

// Any string validates, so an off-list reply maps to "none" in code and never fails the search.
const anyId = { type: 'string', maxLength: 60 } as const;
const today = schemas.normalize;
export const draftSchema: Schema = {
  ...today,
  required: [...(today.required ?? []), 'general', 'specific'],
  properties: { general: anyId, specific: anyId, ...today.properties },
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
