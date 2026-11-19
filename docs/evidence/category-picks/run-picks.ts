// Sends the draft normalize prompt (docs/plans/category-list.md) and today's prompt to the model
// production uses, for every probe in docs/evidence/category-list/hand-labels.json and, in the
// second run, in held-out.json beside this file.
// The request (URL, headers, body) is the one proxy/src/llm.ts builds: it is captured from
// createLlmClient with a stand-in fetch, then sent unchanged. The draft arm swaps in the draft
// schema; nothing else differs. No Brave call, no cache, no live site.
//
// Run from the repo root: npx tsx docs/evidence/category-picks/run-picks.ts
//   DEPLOY_ENV=<path>  the deploy.local.env file to read (default: infra/deploy.local.env).
//                      The OpenRouter key is read from the file it names and never printed or saved.
//   LIMIT=1            only the first N probes (a smoke run). A later full run keeps those calls.
//   ROUNDS=3           draft-prompt runs per probe. Today's prompt runs once, in round 1.
//   MAX_USD=1          stop when OpenRouter's reported cost passes this. The second run counts
//                      its pilot file and its run file together.
//   RUN=1              which run: 1, 2 or 2-pilot (see lib.ts). Each has its own draft prompt and raw file.
// The run resumes: a call already in the run's raw file is not sent again.
import fs from 'node:fs';
import path from 'node:path';
import { Validator } from '@cfworker/json-schema';
import { NORMALIZE_MAX_TOKENS, createLlmClient } from '../../../proxy/src/llm';
import { schemas, structuralOnly } from '../../../proxy/src/validate';
import { COST_FILES, RAW_FILE, ROOT, RUN, buildPrompt, draftSchema, probes, type Arm, type Attempt, type Call, type RawFile } from './lib';

const rounds = Number(process.env.ROUNDS ?? 3);
const maxUsd = Number(process.env.MAX_USD ?? 1);
const limit = Number(process.env.LIMIT ?? probes.length);

const envPath = process.env.DEPLOY_ENV ?? path.join(ROOT, 'infra/deploy.local.env');
const conf = Object.fromEntries(
  fs.readFileSync(envPath, 'utf8').split('\n').filter((l) => /^[A-Z_]+=/.test(l)).map((l) => [l.slice(0, l.indexOf('=')), l.slice(l.indexOf('=') + 1).trim()]),
);
const apiKey = fs.readFileSync(conf.OPENROUTER_API_KEY_FILE!.replace(/^~/, process.env.HOME!), 'utf8').trim();
const siteUrl = conf.SITE_URL!.replace(/\/+$/, '');

interface Captured { url: string; headers: Record<string, string>; body: string }

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

const validators: Record<Arm, Validator> = {
  today: new Validator(schemas.normalize, '7', false),
  draft: new Validator(draftSchema, '7', false),
};

async function requestFor(arm: Arm, input: string, key: string): Promise<Captured> {
  const req = await productionRequest(buildPrompt(arm, input), key);
  if (arm === 'today') return req;
  const body = JSON.parse(req.body) as { response_format: { json_schema: { schema: unknown } } };
  body.response_format.json_schema.schema = structuralOnly(draftSchema);
  return { ...req, body: JSON.stringify(body) };
}

async function attempt(arm: Arm, req: Captured): Promise<Attempt> {
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
        valid = validators[arm].validate(JSON.parse(content)).valid;
      } catch { /* not JSON: invalid */ }
    }
  } catch (e) {
    response = { fetch_error: (e as Error).name };
  }
  return { started, ms: Math.round(performance.now() - t0), http_status: status, valid, response };
}

const example = 'cast iron skillet';
const shown = await requestFor('draft', example, 'KEY-NOT-SAVED');
const raw: RawFile = fs.existsSync(RAW_FILE)
  ? (JSON.parse(fs.readFileSync(RAW_FILE, 'utf8')) as RawFile)
  : {
      about: `Raw OpenRouter replies for docs/evidence/category-picks, run ${RUN}. One entry per call; a call has two attempts when the first reply failed the schema, as in production. See README.md.`,
      request: { url: shown.url, header_names: Object.keys(shown.headers), draft_body_for_example: JSON.parse(shown.body) },
      prompts: {
        today: { example_input: example, chars: buildPrompt('today', example).length, text: buildPrompt('today', example) },
        draft: { example_input: example, chars: buildPrompt('draft', example).length, text: buildPrompt('draft', example) },
      },
      calls: [],
    };
const save = () => fs.writeFileSync(RAW_FILE, JSON.stringify(raw, null, 1));
const costOf = (a: Attempt) => (a.response as { usage?: { cost?: unknown } } | null)?.usage?.cost;
const costIn = (calls: Call[]) => calls.flatMap((c) => c.attempts).reduce((sum, a) => sum + (typeof costOf(a) === 'number' ? (costOf(a) as number) : 0), 0);
const spentElsewhere = COST_FILES.filter((f) => f !== RAW_FILE && fs.existsSync(f)).reduce((sum, f) => sum + costIn((JSON.parse(fs.readFileSync(f, 'utf8')) as RawFile).calls), 0);
const totalCost = () => spentElsewhere + costIn(raw.calls);

for (let round = 1; round <= rounds; round++) {
  for (const [n, probe] of probes.slice(0, limit).entries()) {
    // Today's prompt runs beside the draft in round 1, in alternating order, so neither arm
    // always gets the fresher provider queue.
    const arms: Arm[] = round === 1 ? (n % 2 ? ['today', 'draft'] : ['draft', 'today']) : ['draft'];
    for (const arm of arms) {
      if (raw.calls.some((c) => c.input === probe.input && c.arm === arm && c.round === round)) continue;
      if (totalCost() > maxUsd) {
        console.error(`stopped: reported cost $${totalCost().toFixed(4)} passed $${maxUsd}`);
        process.exit(2);
      }
      const req = await requestFor(arm, probe.input, apiKey);
      const call: Call = { input: probe.input, kind: probe.kind, arm, round, attempts: [] };
      // Production sends the same request a second time when the first reply fails the schema.
      for (let i = 0; i < 2; i++) {
        const a = await attempt(arm, req);
        call.attempts.push(a);
        if (a.valid || a.http_status !== 200) break;
      }
      raw.calls.push(call);
      save();
      const last = call.attempts.at(-1)!;
      console.log(`r${round} ${arm} ${JSON.stringify(probe.input)}: http ${last.http_status}, valid ${last.valid}, ${last.ms} ms, attempts ${call.attempts.length}`);
      if (last.http_status === 200 && typeof costOf(last) !== 'number') {
        console.error('stopped: the reply carries no usage.cost, so the cost limit cannot be checked');
        process.exit(3);
      }
    }
  }
}
console.log(`run ${RUN}: calls ${raw.calls.length}, attempts ${raw.calls.flatMap((c) => c.attempts).length}, reported cost $${costIn(raw.calls).toFixed(6)} in this file, $${totalCost().toFixed(6)} with the run's other files`);
