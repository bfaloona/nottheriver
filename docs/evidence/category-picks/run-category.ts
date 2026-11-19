// Third run: a separate category call beside today's unchanged normalize call.
// For every probe and round the script builds three requests and starts them in the same tick:
//   today     today's normalize prompt and schema, as proxy/src/llm.ts sends them
//   category  ARM-G: the category prompt on the same models and provider settings
//   haiku     ARM-H: the category prompt on the newest Claude Haiku in OpenRouter's model list
// It also sends today's normalize prompt alone ("solo"), before or after the three in alternating
// order, as a control for the wall-time mark. No Brave call, no cache, no live site.
//
// Run from the repo root: RUN=3 npx tsx docs/evidence/category-picks/run-category.ts
//   RUN=3 | 3-pilot | 3-pilot-b   the run, or a pilot of one category prompt on the 48 probes only (lib.ts)
//   DEPLOY_ENV=<path>  the deploy.local.env file to read (default: infra/deploy.local.env).
//                      The OpenRouter key is read from the file it names and never printed or saved.
//   LIMIT=1            only the first N probes (a smoke run). A later full run keeps those units.
//   ROUNDS=3           runs per probe.
//   LEGS=today,category,haiku,solo   which calls to make (default: all four). A pilot uses LEGS=category.
//   HAIKU_DROP=temperature,require_parameters   request fields to leave out for ARM-H only.
//   MAX_USD=1          stop when OpenRouter's reported cost in every raw-3*.json file passes this.
// The run resumes by unit: a probe and round is saved only when all its calls have finished.
import fs from 'node:fs';
import path from 'node:path';
import { Validator, type Schema } from '@cfworker/json-schema';
import { NORMALIZE_MAX_TOKENS, createLlmClient } from '../../../proxy/src/llm';
import { schemas, structuralOnly } from '../../../proxy/src/validate';
import { CATEGORY_MAX_TOKENS, COST_FILES, HERE, RAW_FILE, ROOT, RUN, buildCategoryPrompt, buildPrompt, categorySchema, probes, type Attempt, type ProbeKind } from './lib';

if (!RUN.startsWith('3')) throw new Error('run-category.ts is the third run: set RUN=3 or RUN=3-pilot');

export type Leg = 'today' | 'category' | 'haiku' | 'solo';
/** `ms` runs from the start of the unit's batch (or of the solo call) to the last attempt's end. */
export interface LegResult { ms: number; attempts: Attempt[] }
export interface Unit {
  input: string;
  kind: ProbeKind;
  round: number;
  solo_first: boolean;
  /** Wall time until both today's normalize call and the category call have finished. */
  pair_g_ms: number | null;
  pair_h_ms: number | null;
  legs: Partial<Record<Leg, LegResult>>;
}
export interface RawFile3 {
  about: string;
  request: unknown;
  haiku: { model: string; fields_left_out: string[] } | null;
  prompts: Record<'today' | 'category', { example_input: string; chars: number; text: string }>;
  units: Unit[];
  /** Units in which a call got no HTTP 200. They are sent again; their cost still counts. */
  failed_units: Unit[];
}

const rounds = Number(process.env.ROUNDS ?? 3);
const maxUsd = Number(process.env.MAX_USD ?? 1);
const limit = Number(process.env.LIMIT ?? probes.length);
const legs = new Set((process.env.LEGS ?? 'today,category,haiku,solo').split(',')) as Set<Leg>;
const haikuDrop = (process.env.HAIKU_DROP ?? '').split(',').filter(Boolean);

const envPath = process.env.DEPLOY_ENV ?? path.join(ROOT, 'infra/deploy.local.env');
const conf = Object.fromEntries(
  fs.readFileSync(envPath, 'utf8').split('\n').filter((l) => /^[A-Z_]+=/.test(l)).map((l) => [l.slice(0, l.indexOf('=')), l.slice(l.indexOf('=') + 1).trim()]),
);
const apiKey = fs.readFileSync(conf.OPENROUTER_API_KEY_FILE!.replace(/^~/, process.env.HOME!), 'utf8').trim();
const siteUrl = conf.SITE_URL!.replace(/\/+$/, '');

// The newest Haiku by the list's `created` field, leaving out batch and alias entries.
const haikuList = JSON.parse(fs.readFileSync(path.join(HERE, 'haiku-model-list.json'), 'utf8')) as { haiku: { id: string }[] };
const haikuModel = haikuList.haiku.find((m) => !m.id.startsWith('~') && !m.id.includes(':'))?.id;
if (legs.has('haiku') && !haikuModel) throw new Error('no Haiku model in haiku-model-list.json: run with LEGS=today,category,solo');

interface Captured { url: string; headers: Record<string, string>; body: string }
interface Body {
  models: string[];
  response_format: { json_schema: { name: string; schema: unknown } };
  provider: Record<string, unknown>;
  max_completion_tokens: number;
  temperature?: number;
}

// The production client builds the request; the stand-in fetch records it and sends nothing.
async function productionRequest(prompt: string, key: string): Promise<Captured> {
  let captured: Captured | null = null;
  const record: typeof fetch = async (input, init) => {
    captured = { url: String(input), headers: init!.headers as Record<string, string>, body: init!.body as string };
    return new Response('not json', { status: 200 });
  };
  const client = createLlmClient({ fetch: record, apiKey: key, siteUrl, siteName: 'nottheriver' });
  await client.complete('normalize', prompt, NORMALIZE_MAX_TOKENS).catch(() => null);
  if (!captured) throw new Error('the production client made no request');
  return captured;
}

const legSchema: Record<Leg, Schema> = { today: schemas.normalize, solo: schemas.normalize, category: categorySchema, haiku: categorySchema };
const validators = Object.fromEntries(Object.entries(legSchema).map(([leg, schema]) => [leg, new Validator(schema, '7', false)])) as Record<Leg, Validator>;

async function requestFor(leg: Leg, input: string, key: string): Promise<Captured> {
  if (leg === 'today' || leg === 'solo') return productionRequest(buildPrompt('today', input), key);
  // The category call: the production request with the category prompt, schema and token limit.
  const req = await productionRequest(buildCategoryPrompt(input), key);
  const body = JSON.parse(req.body) as Body;
  body.response_format.json_schema.name = 'category';
  body.response_format.json_schema.schema = structuralOnly(categorySchema);
  body.max_completion_tokens = CATEGORY_MAX_TOKENS;
  if (leg === 'haiku') {
    body.models = [haikuModel!];
    if (haikuDrop.includes('temperature')) delete body.temperature;
    if (haikuDrop.includes('require_parameters')) delete body.provider.require_parameters;
  }
  return { ...req, body: JSON.stringify(body) };
}

async function attempt(leg: Leg, req: Captured): Promise<Attempt> {
  const started = new Date().toISOString();
  const t0 = performance.now();
  let status: number | null = null;
  let response: unknown;
  let valid = false;
  try {
    const res = await fetch(req.url, { method: 'POST', headers: req.headers, body: req.body, signal: AbortSignal.timeout(60_000) });
    status = res.status;
    const text = await res.text();
    try {
      response = JSON.parse(text);
    } catch {
      response = text;
    }
    if (res.ok) {
      const content = (response as { choices?: { message?: { content?: string } }[] }).choices?.[0]?.message?.content ?? '';
      try {
        valid = validators[leg].validate(JSON.parse(content)).valid;
      } catch { /* not JSON: invalid */ }
    }
  } catch (e) {
    response = { fetch_error: (e as Error).name };
  }
  return { started, ms: Math.round(performance.now() - t0), http_status: status, valid, response };
}

// Production sends the same request a second time when the first reply fails the schema.
async function runLeg(leg: Leg, req: Captured, t0: number): Promise<LegResult> {
  const attempts: Attempt[] = [];
  for (let i = 0; i < 2; i++) {
    const a = await attempt(leg, req);
    attempts.push(a);
    if (a.valid || a.http_status !== 200) break;
  }
  return { ms: Math.round(performance.now() - t0), attempts };
}

const example = 'cast iron skillet';
const shown = await requestFor('category', example, 'KEY-NOT-SAVED');
const shownHaiku = legs.has('haiku') ? await requestFor('haiku', example, 'KEY-NOT-SAVED') : null;
const raw: RawFile3 = fs.existsSync(RAW_FILE)
  ? (JSON.parse(fs.readFileSync(RAW_FILE, 'utf8')) as RawFile3)
  : {
      about: `Raw OpenRouter replies for docs/evidence/category-picks, run ${RUN}. One unit per probe and round; a leg has two attempts when the first reply failed the schema, as in production. See README.md, "Third run".`,
      request: { url: shown.url, header_names: Object.keys(shown.headers), category_body_for_example: JSON.parse(shown.body), haiku_body_for_example: shownHaiku && JSON.parse(shownHaiku.body) },
      haiku: legs.has('haiku') ? { model: haikuModel!, fields_left_out: haikuDrop } : null,
      prompts: {
        today: { example_input: example, chars: buildPrompt('today', example).length, text: buildPrompt('today', example) },
        category: { example_input: example, chars: buildCategoryPrompt(example).length, text: buildCategoryPrompt(example) },
      },
      units: [],
      failed_units: [],
    };
const save = () => fs.writeFileSync(RAW_FILE, JSON.stringify(raw, null, 1));
const costOf = (a: Attempt) => (a.response as { usage?: { cost?: unknown } } | null)?.usage?.cost;
const attemptsIn = (file: RawFile3) => [...file.units, ...file.failed_units].flatMap((u) => Object.values(u.legs)).flatMap((l) => l.attempts);
const costIn = (file: RawFile3) => attemptsIn(file).reduce((sum, a) => sum + (typeof costOf(a) === 'number' ? (costOf(a) as number) : 0), 0);
const spentElsewhere = COST_FILES.filter((f) => f !== RAW_FILE && fs.existsSync(f)).reduce((sum, f) => sum + costIn(JSON.parse(fs.readFileSync(f, 'utf8')) as RawFile3), 0);
const totalCost = () => spentElsewhere + costIn(raw);

let failures = 0;
for (let round = 1; round <= rounds; round++) {
  for (const [n, probe] of probes.slice(0, limit).entries()) {
    if (raw.units.some((u) => u.input === probe.input && u.round === round)) continue;
    if (totalCost() > maxUsd) {
      console.error(`stopped: reported cost $${totalCost().toFixed(4)} passed $${maxUsd}`);
      process.exit(2);
    }
    const batchLegs = (['today', 'category', 'haiku'] as const).filter((l) => legs.has(l));
    const requests = Object.fromEntries(await Promise.all([...batchLegs, ...(legs.has('solo') ? (['solo'] as const) : [])].map(async (l) => [l, await requestFor(l, probe.input, apiKey)] as const))) as Record<Leg, Captured>;
    const unit: Unit = { input: probe.input, kind: probe.kind, round, solo_first: (n + round) % 2 === 0, pair_g_ms: null, pair_h_ms: null, legs: {} };
    const solo = async () => {
      if (legs.has('solo')) unit.legs.solo = await runLeg('solo', requests.solo, performance.now());
    };
    if (unit.solo_first) await solo();
    // Every request is built above, so the calls of the batch start in the same tick.
    const t0 = performance.now();
    const done = await Promise.all(batchLegs.map((l) => runLeg(l, requests[l], t0)));
    batchLegs.forEach((l, i) => { unit.legs[l] = done[i]!; });
    if (!unit.solo_first) await solo();
    const both = (a: Leg, b: Leg) => (unit.legs[a] && unit.legs[b] ? Math.max(unit.legs[a].ms, unit.legs[b].ms) : null);
    unit.pair_g_ms = both('today', 'category');
    unit.pair_h_ms = both('today', 'haiku');

    const results = Object.entries(unit.legs) as [Leg, LegResult][];
    const ok = results.every(([, r]) => r.attempts.at(-1)!.http_status === 200);
    (ok ? raw.units : raw.failed_units).push(unit);
    save();
    console.log(`r${round} ${JSON.stringify(probe.input)}: ${results.map(([l, r]) => `${l} http ${r.attempts.at(-1)!.http_status} valid ${r.attempts.at(-1)!.valid} ${r.ms} ms x${r.attempts.length}`).join('; ')}`);
    if (results.some(([, r]) => r.attempts.some((a) => a.http_status === 200 && typeof costOf(a) !== 'number'))) {
      console.error('stopped: a reply carries no usage.cost, so the cost limit cannot be checked');
      process.exit(3);
    }
    if (!ok && ++failures >= 3) {
      console.error('stopped: three units had a call with no HTTP 200. Run again to resume.');
      process.exit(4);
    }
  }
}
console.log(`run ${RUN}: units ${raw.units.length}, failed units ${raw.failed_units.length}, attempts ${attemptsIn(raw).length}, reported cost $${costIn(raw).toFixed(6)} in this file, $${totalCost().toFixed(6)} with the run's other files`);
