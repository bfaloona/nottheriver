// Grades a raw file of the third run (run-category.ts) and writes its results file. No model call.
// Run from the repo root: RUN=3 npx tsx docs/evidence/category-picks/grade-category.ts
// Each arm (category = ARM-G, haiku = ARM-H) and each probe set is graded apart.
//
// The marks, fixed in the commit that froze the prompt, before any held-out call of this run:
//   PM-1 to PM-4  as in the second run (grade.ts), on the mapped pick (mapPick in lib.ts).
//   PM-5  every reply uses only ids on the list or the reserved values. Graded on the reply as
//         written, before mapping: `general` is a general id, "none" or "not_a_product"; `specific`
//         is "none" or an id under that general id, "none" under "none", or one of the six reasons
//         under "not_a_product". An empty string, a value that needs tidying (MAP-1), an id under
//         another parent and a call with no valid reply are all violations. Passes with none.
//   PM-7  the median wall time of the pair (today's normalize call and the category call started
//         in the same tick, until both have finished) is at most 1.15 times the median time of
//         the normalize call of the same pairs. The verdict uses that in-pair normalize time.
//         The solo normalize call of each unit is a control and is reported beside it.
// A call whose reply failed the schema twice counts as a miss everywhere.
import fs from 'node:fs';
import { COST_FILES, RAW_FILE, RESULTS_FILE, generalIds, mapPick, parentOf, probeSets, probes as allProbes, reasons, type Attempt, type Mapped, type Probe, type Reply } from './lib';
import type { Leg, LegResult, RawFile3, Unit } from './run-category';

interface Completion {
  provider?: string;
  model?: string;
  choices?: { finish_reason?: string; message?: { content?: string } }[];
  usage?: { prompt_tokens?: number; completion_tokens?: number; cost?: number; prompt_tokens_details?: { cached_tokens?: number } };
}
type ArmLeg = 'category' | 'haiku';
interface CategoryReply { general: string; specific: string }

const raw = JSON.parse(fs.readFileSync(RAW_FILE, 'utf8')) as RawFile3;
const completion = (a: Attempt) => (a.response && typeof a.response === 'object' ? (a.response as Completion) : {});
const contentOf = <T>(leg: LegResult | undefined): T | null => {
  const last = leg?.attempts.at(-1);
  return last?.valid ? (JSON.parse(completion(last).choices![0]!.message!.content!) as T) : null;
};
const pct = (n: number, d: number) => (d ? Math.round((n / d) * 1000) / 10 : null);
const share = (n: number, d: number) => ({ n, of: d, pct: pct(n, d) });
const count = <T>(xs: T[], f: (x: T) => boolean) => xs.filter(f).length;
const show = (m: Mapped | null) => (m ? `${m.general}/${m.specific ?? ''}` : 'FAILED');
const want = (p: [string, string | null]) => `${p[0]}/${p[1] ?? ''}`;
const tidy = (s: string) => s.toLowerCase().trim().replace(/[\s-]+/g, '_');
const median = (xs: number[]) => {
  const a = [...xs].sort((x, y) => x - y);
  if (!a.length) return null;
  return a.length % 2 ? a[(a.length - 1) / 2]! : (a[a.length / 2 - 1]! + a[a.length / 2]!) / 2;
};
const spread = (xs: number[]) => (xs.length ? { n: xs.length, min: Math.min(...xs), median: median(xs)!, max: Math.max(...xs), mean: Math.round((xs.reduce((s, x) => s + x, 0) / xs.length) * 100) / 100 } : null);

const unitsOf = (input: string) => raw.units.filter((u) => u.input === input).sort((a, b) => a.round - b.round);
const expectedRuns = Math.max(...raw.units.map((u) => u.round));
const arms = (['category', 'haiku'] as const).filter((arm) => raw.units.some((u) => u.legs[arm]));

// PM-5: is the reply, as written, made only of ids on the list and the reserved values?
function violation(reply: CategoryReply | null): string | null {
  if (!reply) return 'no_valid_reply';
  const allowed = (g: string, s: string) => (generalIds.has(g) && (s === 'none' || parentOf.get(s) === g)) || (g === 'not_a_product' && reasons.has(s)) || (g === 'none' && s === 'none');
  const { general: g, specific: s } = reply;
  if (allowed(g, s)) return null;
  if (allowed(tidy(g), tidy(s))) return 'needs_tidying';
  if (!generalIds.has(tidy(g)) && !['none', 'not_a_product'].includes(tidy(g))) return 'general_off_list';
  if (generalIds.has(tidy(g)) && parentOf.has(tidy(s))) return 'specific_under_another_parent';
  return 'specific_not_allowed_for_this_general';
}

interface Row { probe: Probe; replies: (CategoryReply | null)[]; picks: (Mapped | null)[] }

function gradeArm(arm: ArmLeg, probes: Probe[]) {
  const rows: Row[] = probes.map((probe) => {
    const replies = unitsOf(probe.input).filter((u) => u.legs[arm]).map((u) => contentOf<CategoryReply>(u.legs[arm]));
    return { probe, replies, picks: replies.map((r) => (r ? mapPick(r.general, r.specific) : null)) };
  });
  const every = rows.flatMap((r) => r.picks.map((pick, i) => ({ pick, reply: r.replies[i]!, probe: r.probe, run: i + 1 })));
  type Item = (typeof every)[number];
  const generalHit = (x: Item) => x.pick?.general === x.probe.pick[0];
  const bothHit = (x: Item) => generalHit(x) && x.pick!.specific === x.probe.pick[1];
  const sameAll = (r: Row, f: (m: Mapped) => string) => r.picks.length === expectedRuns && r.picks.every((p) => p !== null) && new Set(r.picks.map((p) => f(p!))).size === 1;
  const label = (x: Item) => `${x.probe.input} (run ${x.run}): ${show(x.pick)}`;
  const mark = (n: number, d: number, passPct: number, misses: string[]) => ({ ...share(n, d), pass_mark_pct: passPct, pass: (pct(n, d) ?? 0) >= passPct, misses });
  const graded = (items: Item[], hit: (x: Item) => boolean, passPct: number) => mark(count(items, hit), items.length, passPct, items.filter((x) => !hit(x)).map(label));

  const brand = every.filter((x) => x.probe.kind === 'brand');
  const non = every.filter((x) => x.probe.kind === 'nonproduct');
  const noSpecific = every.filter((x) => x.probe.pick[1] === null);
  const unstable = rows.filter((r) => !sameAll(r, show));
  const violations = every.map((x) => ({ x, v: violation(x.reply) })).filter((y) => y.v !== null);
  const kinds = [...new Set(probes.map((p) => p.kind))];

  return {
    missing_a_run: rows.filter((r) => r.picks.length !== expectedRuns).map((r) => r.probe.input),
    pass_marks: {
      pm1_brand_general_matches_label: graded(brand, generalHit, 90),
      pm2_nonproduct_gets_not_a_product: graded(non, (x) => x.pick?.general === 'not_a_product', 80),
      pm3_same_pick_in_all_runs_both_levels: mark(rows.length - unstable.length, rows.length, 90, unstable.map((r) => `${r.probe.input}: ${r.picks.map(show).join(' | ')}`)),
      pm4_no_specific_where_label_has_none: graded(noSpecific, (x) => x.pick !== null && x.pick.specific === null, 80),
      pm5_only_list_ids_or_reserved_values: {
        calls: every.length,
        violations: violations.length,
        by_type: Object.fromEntries([...new Set(violations.map((y) => y.v!))].sort().map((v) => [v, count(violations, (y) => y.v === v)])),
        list: violations.map((y) => `${y.x.probe.input} (run ${y.x.run}): ${y.v}: ${JSON.stringify(y.x.reply)}`),
        pass: violations.length === 0,
      },
    },
    side_figures: {
      same_pick_in_all_runs_general_only: share(count(rows, (r) => sameAll(r, (m) => m.general)), rows.length),
      nonsense_gets_not_a_product: share(count(non, (x) => x.probe.pick[1] === 'unclear' && x.pick?.general === 'not_a_product'), count(non, (x) => x.probe.pick[1] === 'unclear')),
      nonproduct_reason_matches_label: share(count(non, bothHit), count(non, (x) => x.pick?.general === 'not_a_product')),
      forced_specific_where_general_right_and_label_has_none: share(count(noSpecific, (x) => x.probe.pick[0] !== 'none' && generalHit(x) && x.pick!.specific !== null), count(noSpecific, (x) => x.probe.pick[0] !== 'none' && generalHit(x))),
      by_rule: Object.fromEntries([...new Set(every.flatMap((x) => (x.pick ? [x.pick.rule] : [])))].sort().map((rule) => [rule, count(every, (x) => x.pick?.rule === rule)])),
      by_kind: Object.fromEntries(kinds.map((kind) => {
        const items = every.filter((x) => x.probe.kind === kind);
        return [kind, { calls: items.length, general_matches_label: share(count(items, generalHit), items.length), both_levels_match_label: share(count(items, bothHit), items.length) }];
      })),
    },
    picks: rows.map((r) => ({ input: r.probe.input, kind: r.probe.kind, label: want(r.probe.pick), picks: r.picks.map(show), same_all_runs: sameAll(r, show) })),
  };
}

// Tokens, latency and cost per HTTP attempt, from OpenRouter's reply and the script's clock.
const isCached = (a: Attempt) => (completion(a).usage?.prompt_tokens_details?.cached_tokens ?? 0) > 0;
function usage(as: Attempt[]) {
  const ok = as.filter((a) => a.http_status === 200);
  const num = (f: (c: Completion) => number | undefined, from = ok) => from.map((a) => f(completion(a))).filter((x): x is number => typeof x === 'number');
  const tally = (f: (c: Completion) => string | undefined) => {
    const out: Record<string, number> = {};
    for (const a of ok) out[f(completion(a)) ?? 'missing'] = (out[f(completion(a)) ?? 'missing'] ?? 0) + 1;
    return out;
  };
  const fresh = ok.filter((a) => !isCached(a));
  const costs = num((c) => c.usage?.cost);
  return {
    attempts: as.length,
    http_200: ok.length,
    valid: count(as, (a) => a.valid),
    prompt_tokens: spread(num((c) => c.usage?.prompt_tokens)),
    completion_tokens: spread(num((c) => c.usage?.completion_tokens)),
    latency_ms: spread(ok.map((a) => a.ms)),
    cost_usd: { attempts_with_a_cost: costs.length, sum: Number(costs.reduce((s, x) => s + x, 0).toFixed(6)), median: median(costs) },
    // The provider read these prompt tokens from its own cache and billed them at a lower rate.
    attempts_with_cached_prompt_tokens: ok.length - fresh.length,
    // A first search gets no cache discount, so these are the figures to plan with.
    no_cached_tokens: {
      attempts: fresh.length,
      prompt_tokens_median: median(num((c) => c.usage?.prompt_tokens, fresh)),
      completion_tokens_median: median(num((c) => c.usage?.completion_tokens, fresh)),
      cost_usd_median: median(num((c) => c.usage?.cost, fresh)),
      cost_usd_mean: fresh.length ? Number((num((c) => c.usage?.cost, fresh).reduce((s, x) => s + x, 0) / fresh.length).toFixed(8)) : null,
      latency_ms_median: median(fresh.map((a) => a.ms)),
    },
    models: tally((c) => c.model),
    providers: tally((c) => c.provider),
    finish_reasons: tally((c) => c.choices?.[0]?.finish_reason),
  };
}

const attemptsOf = (units: Unit[], leg: Leg) => units.flatMap((u) => u.legs[leg]?.attempts ?? []);
const legMs = (units: Unit[], leg: Leg) => units.flatMap((u) => (u.legs[leg] ? [u.legs[leg].ms] : []));

// PM-7 for one arm over a group of units.
function wallTime(units: Unit[], arm: ArmLeg) {
  const pairs = units.flatMap((u) => {
    const ms = arm === 'category' ? u.pair_g_ms : u.pair_h_ms;
    return ms !== null && u.legs.today ? [{ pair: ms, today: u.legs.today.ms, other: u.legs[arm]!.ms }] : [];
  });
  if (!pairs.length) return null;
  const pair = median(pairs.map((p) => p.pair))!;
  const inPair = median(pairs.map((p) => p.today))!;
  const solo = median(legMs(units, 'solo'));
  const ratio = (base: number | null) => (base ? Math.round((pair / base) * 1000) / 1000 : null);
  return {
    pairs: pairs.length,
    pair_ms_median: pair,
    normalize_in_pair_ms_median: inPair,
    category_call_ms_median: median(pairs.map((p) => p.other)),
    ratio_to_normalize_in_pair: ratio(inPair),
    pass_mark_ratio: 1.15,
    pass: pair <= 1.15 * inPair,
    // Control: today's normalize prompt sent alone, just before or just after the pair.
    normalize_solo_ms_median: solo,
    ratio_to_normalize_solo: ratio(solo),
    pass_against_solo: solo === null ? null : pair <= 1.15 * solo,
    pairs_where_the_category_call_finished_last: count(pairs, (p) => p.other > p.today),
    extra_ms_per_pair: spread(pairs.map((p) => p.pair - p.today)),
  };
}

// Today's normalize reply for the same input, in the pair and alone: is the nearby wording the same?
const nearby = (leg: LegResult | undefined) => contentOf<Reply>(leg)?.local_queries.map((q) => q.toLowerCase().trim()).join('|') ?? null;
function todayWording(units: Unit[]) {
  const both = units.filter((u) => u.legs.today && u.legs.solo && u.round === 1);
  return { inputs: both.length, nearby_wording_same_in_pair_and_solo_round_1: share(count(both, (u) => nearby(u.legs.today) !== null && nearby(u.legs.today) === nearby(u.legs.solo)), both.length) };
}

const inSet = (set: string) => new Set(allProbes.filter((p) => p.set === set).map((p) => p.input));
const sets = Object.fromEntries(probeSets.map((set) => {
  const units = raw.units.filter((u) => inSet(set).has(u.input));
  return [set, {
    arms: Object.fromEntries(arms.map((arm) => [arm, gradeArm(arm, allProbes.filter((p) => p.set === set))])),
    wall_time: Object.fromEntries(arms.map((arm) => [arm, wallTime(units, arm)])),
  }];
}));

// Do the two arms give the same mapped pick for the same input and round?
const armAgreement = arms.length === 2 ? (() => {
  const pick = (u: Unit, arm: ArmLeg) => {
    const r = contentOf<CategoryReply>(u.legs[arm]);
    return r ? show(mapPick(r.general, r.specific)) : null;
  };
  const differ = raw.units.filter((u) => pick(u, 'category') !== pick(u, 'haiku'));
  return { ...share(raw.units.length - differ.length, raw.units.length), units_that_differ: differ.map((u) => `${u.input} (run ${u.round}): ${pick(u, 'category')} vs ${pick(u, 'haiku')}`) };
})() : null;

const legsSeen = (['today', 'solo', 'category', 'haiku'] as const).filter((leg) => raw.units.some((u) => u.legs[leg]));
const perCall = Object.fromEntries(legsSeen.map((leg) => [leg, usage(attemptsOf(raw.units, leg))]));

// Cost of one search with no cached tokens: today's normalize call alone, and with the category call added.
const freshCost = (leg: Leg) => perCall[leg]?.no_cached_tokens.cost_usd_median ?? null;
const normalizeFresh = usage([...attemptsOf(raw.units, 'today'), ...attemptsOf(raw.units, 'solo')]).no_cached_tokens;
const combined = Object.fromEntries(arms.map((arm) => {
  const add = freshCost(arm);
  const base = normalizeFresh.cost_usd_median;
  return [arm, base !== null && add !== null ? { normalize_cost_usd_median: base, category_call_cost_usd_median: add, both_usd: Number((base + add).toFixed(8)), times_today: Math.round(((base + add) / base) * 100) / 100 } : null];
}));

// Every raw file of the third run: pilots, smoke runs and the run.
const costOf = (file: RawFile3) => [...file.units, ...file.failed_units].flatMap((u) => Object.values(u.legs)).flatMap((l) => l.attempts);
const costFiles = COST_FILES.sort().map((f) => {
  const as = costOf(JSON.parse(fs.readFileSync(f, 'utf8')) as RawFile3);
  return { file: f.split('/').at(-1)!, attempts: as.length, cost_usd: usage(as).cost_usd.sum };
});

const all = costOf(raw);
const results = {
  about: `Written by grade-category.ts from ${RAW_FILE.split('/').at(-1)!}. Every figure is computed from the saved replies. "tuned" is the 48 probes; "held_out" is held-out.json. Arm "category" is ARM-G (production models), arm "haiku" is ARM-H.`,
  totals: {
    units: raw.units.length,
    failed_units: raw.failed_units.map((u) => `${u.input} (run ${u.round}): ${Object.entries(u.legs).map(([leg, r]) => `${leg} http ${r.attempts.at(-1)!.http_status}`).join(', ')}`),
    runs_per_probe: expectedRuns,
    attempts: all.length,
    legs_with_a_second_attempt: raw.units.flatMap((u) => Object.entries(u.legs).filter(([, r]) => r.attempts.length > 1).map(([leg]) => `${leg}: ${u.input} (run ${u.round})`)),
    legs_with_no_valid_reply: raw.units.flatMap((u) => Object.entries(u.legs).filter(([, r]) => !r.attempts.at(-1)!.valid).map(([leg]) => `${leg}: ${u.input} (run ${u.round})`)),
    first_call: all.map((a) => a.started).sort()[0],
    last_call: all.map((a) => a.started).sort().at(-1),
    cost_usd_reported_by_openrouter_this_file: usage(all).cost_usd,
    third_run_cost_usd_by_file: costFiles,
    third_run_cost_usd_total: Number(costFiles.reduce((s, c) => s + c.cost_usd, 0).toFixed(6)),
  },
  haiku: raw.haiku,
  pass_marks: Object.fromEntries(Object.entries(sets).map(([set, s]) => [set, Object.fromEntries(arms.map((arm) => {
    const m = s.arms[arm]!.pass_marks;
    const brief = (x: { n: number; of: number; pct: number | null; pass: boolean }) => ({ n: x.n, of: x.of, pct: x.pct, pass: x.pass });
    return [arm, {
      pm1: brief(m.pm1_brand_general_matches_label),
      pm2: brief(m.pm2_nonproduct_gets_not_a_product),
      pm3: brief(m.pm3_same_pick_in_all_runs_both_levels),
      pm4: brief(m.pm4_no_specific_where_label_has_none),
      pm5: { violations: m.pm5_only_list_ids_or_reserved_values.violations, of: m.pm5_only_list_ids_or_reserved_values.calls, pass: m.pm5_only_list_ids_or_reserved_values.pass },
    }];
  }))])),
  pm7_wall_time_all_units: Object.fromEntries(arms.map((arm) => [arm, wallTime(raw.units, arm)])),
  pm7_wall_time_round_1_only: Object.fromEntries(arms.map((arm) => [arm, wallTime(raw.units.filter((u) => u.round === 1), arm)])),
  per_call: perCall,
  normalize_calls_with_no_cached_tokens_pair_and_solo: normalizeFresh,
  cost_per_search_with_no_cached_tokens: combined,
  arm_agreement_same_mapped_pick: armAgreement,
  today_prompt: todayWording(raw.units),
  sets,
};
fs.writeFileSync(RESULTS_FILE, `${JSON.stringify(results, null, 1)}\n`);
console.log(JSON.stringify({ totals: results.totals, pass_marks: results.pass_marks, pm7: results.pm7_wall_time_all_units, cost_per_search: combined, arm_agreement: armAgreement && share(armAgreement.n, armAgreement.of) }, null, 1));
