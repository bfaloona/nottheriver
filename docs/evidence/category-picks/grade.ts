// Grades a run's raw file against the hand labels and writes its results file. No model call.
// Run from the repo root:
//   npx tsx docs/evidence/category-picks/grade.ts          first run: raw.json -> results.json
//   RUN=2 npx tsx docs/evidence/category-picks/grade.ts    second run: raw-2.json -> results-2.json
// The second run grades the 48 probes and the held-out probes apart, against six pass marks.
// A call whose reply failed the schema twice, or that got no reply, counts as a miss everywhere.
import fs from 'node:fs';
import { RAW_FILE, RESULTS_FILE, RUN, generalIds, heldOutBrandWords, listIds, mapPick, probeSets, probes as allProbes, reservedIds, type Arm, type Attempt, type Call, type Mapped, type Probe, type RawFile, type Reply } from './lib';

// Brand and model words per brand probe, lowercase, matched as substrings of canonical_name.
// Written before the first model call. A name with none of its words counts as generic.
const BRAND_WORDS: Record<string, string[]> = {
  'macbook': ['macbook', 'apple'],
  'MacBook Air M3': ['macbook', 'apple', 'm3'],
  'DeWalt DCD771': ['dewalt', 'dcd771'],
  'Makita XFD131': ['makita', 'xfd131'],
  'iPhone 15': ['iphone', 'apple'],
  'Kobo Clara': ['kobo', 'clara'],
  'Le Creuset dutch oven': ['creuset'],
  'Vitamix 5200': ['vitamix', '5200'],
  'Dyson V8': ['dyson', 'v8'],
  'Patagonia Nano Puff': ['patagonia', 'nano puff'],
  "Levi's 501": ['levi', '501'],
  'Birkenstock Arizona': ['birkenstock', 'arizona'],
  'Brooks Ghost 16': ['brooks', 'ghost'],
  'Trek FX 2': ['trek', 'fx'],
  'LEGO 10311': ['lego', '10311'],
  'Catan': ['catan'],
  'Yeti Rambler': ['yeti', 'rambler'],
  'Weber Spirit II': ['weber', 'spirit'],
  'Stihl MS 170': ['stihl', 'ms 170'],
  'Fender Stratocaster': ['fender', 'stratocaster'],
  'Graco SlimFit3': ['graco', 'slimfit'],
  'Nintendo Switch': ['nintendo', 'switch'],
  'Canon EOS R10': ['canon', 'eos', 'r10'],
  'Michelin X-Ice': ['michelin', 'x-ice'],
  // The held-out brand probes; their words were written with their labels, before the second run.
  ...heldOutBrandWords,
};

interface Completion {
  provider?: string;
  model?: string;
  choices?: { finish_reason?: string; message?: { content?: string } }[];
  usage?: { prompt_tokens?: number; completion_tokens?: number; cost?: number; prompt_tokens_details?: { cached_tokens?: number } };
}

const raw = JSON.parse(fs.readFileSync(RAW_FILE, 'utf8')) as RawFile;
const completion = (a: Attempt) => (a.response && typeof a.response === 'object' ? (a.response as Completion) : {});
const replyOf = (c: Call): Reply | null => {
  const last = c.attempts.at(-1);
  if (!last?.valid) return null;
  return JSON.parse(completion(last).choices![0]!.message!.content!) as Reply;
};
// A later pilot ran the draft prompt only. Its today replies are the first pilot's, made earlier the same night.
const todayCalls = raw.calls.some((c) => c.arm === 'today') ? [] : (JSON.parse(fs.readFileSync(RAW_FILE.replace(/-pilot-[a-z]\.json$/, '-pilot.json'), 'utf8')) as RawFile).calls.filter((c) => c.arm === 'today');
const callsOf = (arm: Arm, input?: string) => [...raw.calls, ...todayCalls].filter((c) => c.arm === arm && (input === undefined || c.input === input)).sort((a, b) => a.round - b.round);
const pct = (n: number, d: number) => (d ? Math.round((n / d) * 1000) / 10 : null);
const share = (n: number, d: number) => ({ n, of: d, pct: pct(n, d) });
const count = <T>(xs: T[], f: (x: T) => boolean) => xs.filter(f).length;
const show = (m: Mapped | null) => (m ? `${m.general}/${m.specific ?? ''}` : 'FAILED');
const want = (p: Pick2) => `${p[0]}/${p[1] ?? ''}`;
type Pick2 = [string, string | null];

function spread(xs: number[]) {
  const a = [...xs].sort((x, y) => x - y);
  if (!a.length) return null;
  const mid = a.length / 2;
  const median = a.length % 2 ? a[Math.floor(mid)]! : (a[mid - 1]! + a[mid]!) / 2;
  return { n: a.length, min: a[0]!, median, max: a.at(-1)!, mean: Math.round((a.reduce((s, x) => s + x, 0) / a.length) * 100) / 100 };
}

// One row per probe: the three draft picks, mapped.
interface Row { probe: Probe; calls: Call[]; replies: (Reply | null)[]; picks: (Mapped | null)[] }
const tidy = (s: string) => s.toLowerCase().trim().replace(/[\s-]+/g, '_');
const expectedRuns = Math.max(...raw.calls.filter((c) => c.arm === 'draft').map((c) => c.round));

function gradeSet(probes: Probe[]) {
  const rows: Row[] = probes.map((probe) => {
    const calls = callsOf('draft', probe.input);
    const replies = calls.map(replyOf);
    return { probe, calls, replies, picks: replies.map((r) => (r ? mapPick(r.general, r.specific) : null)) };
  });
  const ofKind = (kind: string) => rows.filter((r) => r.probe.kind === kind);
  const allPicks = (rs: Row[]) => rs.flatMap((r) => r.picks.map((pick) => ({ pick, probe: r.probe })));
  const generalHit = (x: { pick: Mapped | null; probe: Probe }) => x.pick?.general === x.probe.pick[0];
  const bothHit = (x: { pick: Mapped | null; probe: Probe }) => generalHit(x) && x.pick!.specific === x.probe.pick[1];
  const sameAll = (r: Row, f: (m: Mapped) => string) => r.picks.length > 0 && r.picks.every((p) => p !== null) && new Set(r.picks.map((p) => f(p!))).size === 1;

  const brand = allPicks(ofKind('brand'));
  const non = allPicks(ofKind('nonproduct'));
  const gap = allPicks(ofKind('gap'));

  const marks = {
    brand_general_matches_label: { ...share(count(brand, generalHit), brand.length), pass_mark_pct: 90 },
    nonproduct_gets_not_a_product: { ...share(count(non, (x) => x.pick?.general === 'not_a_product'), non.length), pass_mark_pct: 80 },
    same_pick_in_all_runs_both_levels: { ...share(count(rows, (r) => sameAll(r, show)), rows.length), pass_mark_pct: 90 },
    same_pick_in_all_runs_general_only: { ...share(count(rows, (r) => sameAll(r, (m) => m.general)), rows.length), pass_mark_pct: 90 },
  };

  const byKind = Object.fromEntries(['brand', 'nonproduct', 'gap', 'two', 'general'].filter((kind) => ofKind(kind).length > 0).map((kind) => {
    const rs = ofKind(kind);
    const ps = allPicks(rs);
    return [kind, {
      inputs: rs.length,
      calls: ps.length,
      general_matches_label: share(count(ps, generalHit), ps.length),
      both_levels_match_label: share(count(ps, bothHit), ps.length),
      inputs_with_same_pick_all_runs_both_levels: share(count(rs, (r) => sameAll(r, show)), rs.length),
      inputs_with_same_pick_all_runs_general_only: share(count(rs, (r) => sameAll(r, (m) => m.general)), rs.length),
    }];
  }));

  // Among calls where the general pick matched, how the specific level did.
  const specificLevel = {
    brand_calls_general_right: count(brand, generalHit),
    of_them_specific_right: count(brand, bothHit),
    of_them_specific_empty_or_unknown: count(brand, (x) => generalHit(x) && x.pick!.specific === null && x.probe.pick[1] !== null),
    of_them_other_specific: count(brand, (x) => generalHit(x) && x.pick!.specific !== null && x.pick!.specific !== x.probe.pick[1]),
    nonproduct_calls_not_a_product: count(non, (x) => x.pick?.general === 'not_a_product'),
    of_them_reason_matches_label: count(non, bothHit),
    gap_calls_none: share(count(gap, generalHit), gap.length),
    // The label says no specific category fits; did the model name one anyway?
    ...(() => {
      const open = allPicks(rows.filter((r) => r.probe.pick[1] === null && r.probe.pick[0] !== 'none')).filter(generalHit);
      return { calls_general_right_where_label_has_no_specific: open.length, of_them_model_gave_a_specific: count(open, (x) => x.pick!.specific !== null) };
    })(),
  };

  // Replies as written, before mapping.
  const draftReplies = rows.flatMap((r) => r.replies.map((reply, i) => ({ reply, pick: r.picks[i]!, input: r.probe.input }))).filter((x) => x.reply !== null);
  const offList = {
    replies: draftReplies.length,
    by_rule: Object.fromEntries([...new Set(draftReplies.map((x) => x.pick.rule))].sort().map((rule) => [rule, count(draftReplies, (x) => x.pick.rule === rule)])),
    general_not_an_id: draftReplies.filter((x) => !generalIds.has(tidy(x.reply!.general!)) && !['none', 'not_a_product'].includes(tidy(x.reply!.general!))).map((x) => `${x.input}: ${x.reply!.general}`),
    general_needed_tidying: count(draftReplies, (x) => x.reply!.general !== tidy(x.reply!.general!)),
    // The second draft writes "none" where the first wrote "": neither is a dropped id.
    specific_dropped: draftReplies.filter((x) => !['', 'none'].includes(tidy(x.reply!.specific!)) && x.pick.specific !== tidy(x.reply!.specific!)).map((x) => `${x.input}: ${x.reply!.general}/${x.reply!.specific} -> ${show(x.pick)} (${x.pick.rule})`),
  };

  const table = rows.map((r) => {
    const alt = r.probe.alt;
    const side = (m: Mapped | null) => {
      if (!m) return 'failed';
      if (show(m) === want(r.probe.pick)) return 'pick';
      if (alt && show(m) === want(alt)) return 'alt';
      if (m.general === r.probe.pick[0]) return 'pick, general only';
      if (alt && m.general === alt[0]) return 'alt, general only';
      return 'other';
    };
    return {
      input: r.probe.input,
      kind: r.probe.kind,
      label: want(r.probe.pick),
      ...(alt && { alt: want(alt) }),
      picks: r.picks.map(show),
      sides: r.picks.map(side),
      general_right_runs: count(r.picks, (pick) => generalHit({ pick, probe: r.probe })),
      same_all_runs: sameAll(r, show),
      providers: r.calls.map((c) => completion(c.attempts.at(-1)!).provider ?? null),
    };
  });

  // canonical_name: does it still carry a brand or model word?
  const hasBrand = (input: string, name: string) => BRAND_WORDS[input]!.some((w) => name.toLowerCase().includes(w));
  const canonical = (() => {
    const per = ofKind('brand').map((r) => {
      const todayReply = callsOf('today', r.probe.input).map(replyOf)[0] ?? null;
      return { input: r.probe.input, draft: r.replies.map((x) => x?.canonical_name ?? null), today: todayReply?.canonical_name ?? null };
    });
    const draftNames = per.flatMap((p) => p.draft.map((name) => ({ input: p.input, name })));
    const todayNames = per.map((p) => ({ input: p.input, name: p.today }));
    const generic = (xs: { input: string; name: string | null }[]) => share(count(xs, (x) => x.name !== null && !hasBrand(x.input, x.name)), xs.length);
    const differs = per.filter((p) => p.today !== null && p.draft[0] !== null && p.today.toLowerCase() !== p.draft[0]!.toLowerCase());
    return { draft_calls_generic_name: generic(draftNames), today_calls_generic_name: generic(todayNames), inputs_where_draft_run_1_differs_from_today: { ...share(differs.length, per.length), list: differs.map((p) => `${p.input}: ${p.today} -> ${p.draft[0]}`) }, per_input: per };
  })();

  // The fields the reply has today: rule checks from the prompt's own wording, per arm.
  const BANNED = /\b(best|top|reviews?|vs|guide|ethical|sustainable|eco-friendly)\b/i;
  function fieldChecks(items: { reply: Reply | null; probe: Probe }[]) {
    const ok = items.filter((x) => x.reply !== null) as { reply: Reply; probe: Probe }[];
    const queries = (r: Reply) => [...r.online_queries, ...r.local_queries];
    const brandItems = ok.filter((x) => x.probe.kind === 'brand');
    return {
      calls: items.length,
      valid_replies: ok.length,
      similar_products_3_to_6: count(ok, (x) => x.reply.similar_products.length >= 3 && x.reply.similar_products.length <= 6),
      online_queries_2_or_3: count(ok, (x) => x.reply.online_queries.length >= 2 && x.reply.online_queries.length <= 3),
      online_queries_with_a_banned_word: count(ok, (x) => x.reply.online_queries.some((q) => BANNED.test(q)) && !BANNED.test(x.probe.input)),
      local_queries_exactly_2: count(ok, (x) => x.reply.local_queries.length === 2),
      local_queries_all_end_store_or_shop: count(ok, (x) => x.reply.local_queries.every((q) => /\b(store|shop)$/i.test(q.trim()))),
      local_queries_name_the_product: count(ok, (x) => x.reply.local_queries.some((q) => q.toLowerCase().includes(x.reply.canonical_name.toLowerCase()))),
      brand_inputs_valid: brandItems.length,
      brand_inputs_with_brand_word_in_a_query: count(brandItems, (x) => queries(x.reply).some((q) => hasBrand(x.probe.input, q))),
      category_is_none_or_not_a_product: ok.filter((x) => ['none', 'not_a_product'].includes(tidy(x.reply.category))).map((x) => `${x.probe.input}: ${x.reply.category}`),
      category_is_an_id_on_the_list: count(ok, (x) => listIds.has(tidy(x.reply.category))),
      category_chars: spread(ok.map((x) => x.reply.category.length)),
      similar_products_count: spread(ok.map((x) => x.reply.similar_products.length)),
      online_queries_count: spread(ok.map((x) => x.reply.online_queries.length)),
    };
  }
  const draftRound = (round: number) => rows.map((r) => ({ reply: r.replies[r.calls.findIndex((c) => c.round === round)] ?? null, probe: r.probe }));
  const todayItems = probes.map((probe) => ({ reply: callsOf('today', probe.input).map(replyOf)[0] ?? null, probe }));

  // Same field, two replies for the same input. Draft run against draft run is the noise floor.
  function agreement(a: { reply: Reply | null }[], b: { reply: Reply | null }[]) {
    const pairs = a.map((x, i) => [x.reply, b[i]!.reply] as const).filter((p): p is readonly [Reply, Reply] => p[0] !== null && p[1] !== null);
    const low = (s: string) => s.toLowerCase().trim();
    const same = (f: (r: Reply) => string) => share(count(pairs, ([x, y]) => f(x) === f(y)), pairs.length);
    return {
      category: same((r) => low(r.category)),
      canonical_name: same((r) => low(r.canonical_name)),
      local_queries_same_two_in_order: same((r) => r.local_queries.map(low).join('|')),
      local_queries_first_same: same((r) => low(r.local_queries[0] ?? '')),
      online_queries_same_set: same((r) => r.online_queries.map(low).sort().join('|')),
      similar_products_same_set: same((r) => r.similar_products.map(low).sort().join('|')),
    };
  }
  const existingFields = {
    rule_checks: { today: fieldChecks(todayItems), draft_run_1: fieldChecks(draftRound(1)), draft_all_runs: fieldChecks([1, 2, 3].flatMap(draftRound)) },
    same_value_for_the_same_input: {
      today_vs_draft_run_1: agreement(todayItems, draftRound(1)),
      draft_run_1_vs_run_2: agreement(draftRound(1), draftRound(2)),
      draft_run_2_vs_run_3: agreement(draftRound(2), draftRound(3)),
    },
    side_by_side: probes.map((probe, i) => {
      const t = todayItems[i]!.reply;
      const d = draftRound(1)[i]!.reply;
      return { input: probe.input, today: t && { category: t.category, canonical_name: t.canonical_name, local_queries: t.local_queries, online_queries: t.online_queries }, draft_run_1: d && { category: d.category, canonical_name: d.canonical_name, local_queries: d.local_queries, online_queries: d.online_queries } };
    }),
  };

  // The three marks added for the second run. Their definitions were committed before its first call.
  const everyReply = rows.flatMap((r) => r.replies.map((reply, i) => ({ reply, pick: r.picks[i] ?? null, probe: r.probe, run: i + 1 })));
  const noSpecific = everyReply.filter((x) => x.probe.pick[1] === null);
  const products = everyReply.filter((x) => x.probe.kind !== 'nonproduct');
  const queriesOk = (x: { reply: Reply | null }) => x.reply !== null && x.reply.online_queries.length >= 1 && x.reply.local_queries.length === 2;
  const reservedCategory = everyReply.filter((x) => x.reply !== null && reservedIds.has(tidy(x.reply.category)));
  const nearbySame = (i: number) => {
    const t = todayItems[i]!.reply;
    const d = draftRound(1)[i]!.reply;
    return t !== null && d !== null && t.local_queries.map((q) => q.toLowerCase().trim()).join('|') === d.local_queries.map((q) => q.toLowerCase().trim()).join('|');
  };
  const label = (x: { probe: Probe; run: number }) => `${x.probe.input} (run ${x.run})`;
  const newMarks = {
    // PM-4. Every call whose label has no specific category (general-only and no-category labels alike),
    // whether or not the general pick is right. Counted on the mapped pick, so "not_a_product" with a reason is a miss.
    pm4_no_specific_where_label_has_none: {
      ...share(count(noSpecific, (x) => x.pick !== null && x.pick.specific === null), noSpecific.length),
      pass_mark_pct: 80,
      misses: noSpecific.filter((x) => !(x.pick !== null && x.pick.specific === null)).map((x) => `${label(x)}: ${show(x.pick)}`),
      of_calls_with_the_general_pick_right: share(count(noSpecific, (x) => generalHit(x) && x.pick!.specific === null), count(noSpecific, generalHit)),
    },
    // PM-5. All draft runs. Passes only with no violation of either part. A call with no valid reply is a violation.
    pm5_old_fields_hold: {
      draft_calls: everyReply.length,
      category_is_none_or_a_reserved_id: reservedCategory.map((x) => `${label(x)}: ${x.reply!.category}`),
      product_calls_with_1_or_more_online_and_exactly_2_local_queries: share(count(products, queriesOk), products.length),
      product_calls_failing: products.filter((x) => !queriesOk(x)).map(label),
      pass: reservedCategory.length === 0 && products.every(queriesOk),
      // Side figures, no pass mark: the same query check on non-product inputs and on the nonsense ones among them.
      nonproduct_calls_with_the_same_queries: share(count(everyReply, (x) => x.probe.kind === 'nonproduct' && queriesOk(x)), count(everyReply, (x) => x.probe.kind === 'nonproduct')),
      nonsense_calls_with_the_same_queries: share(count(everyReply, (x) => x.probe.pick[1] === 'unclear' && queriesOk(x)), count(everyReply, (x) => x.probe.pick[1] === 'unclear')),
    },
    // PM-6. Both nearby searches the same, in the same order, today's prompt against draft run 1. Every input counts.
    pm6_nearby_wording_same_as_today: {
      ...share(count(probes, (_, i) => nearbySame(i)), probes.length),
      pass_mark_pct: 70,
      inputs_that_differ: probes.flatMap((p, i) => (nearbySame(i) ? [] : [{ input: p.input, today: todayItems[i]!.reply?.local_queries ?? null, draft_run_1: draftRound(1)[i]!.reply?.local_queries ?? null }])),
    },
  };

  const inputs = new Set(probes.map((p) => p.input));
  const attemptsOf = (arm: Arm, round?: number) => raw.calls.filter((c) => inputs.has(c.input) && c.arm === arm && (round === undefined || c.round === round)).flatMap((c) => c.attempts);
  const perCall = { today_run_1: usage(attemptsOf('today')), draft_run_1: usage(attemptsOf('draft', 1)), draft_run_2: usage(attemptsOf('draft', 2)), draft_run_3: usage(attemptsOf('draft', 3)), draft_all_runs: usage(attemptsOf('draft')) };
  const missing = rows.filter((r) => r.calls.length !== expectedRuns).map((r) => r.probe.input);
  return { missing, graded: { marks, by_kind: byKind, specific_level: specificLevel, off_list: offList, picks: table, canonical_name: canonical, existing_fields: existingFields, per_call: perCall }, newMarks };
}

// Tokens, latency and cost per HTTP attempt, from OpenRouter's reply and the script's clock.
function usage(as: Attempt[]) {
  const ok = as.filter((a) => a.http_status === 200);
  const num = (f: (c: Completion) => number | undefined) => ok.map((a) => f(completion(a))).filter((x): x is number => typeof x === 'number');
  const tally = (f: (c: Completion) => string | undefined) => {
    const out: Record<string, number> = {};
    for (const a of ok) out[f(completion(a)) ?? 'missing'] = (out[f(completion(a)) ?? 'missing'] ?? 0) + 1;
    return out;
  };
  const costs = num((c) => c.usage?.cost);
  return {
    attempts: as.length,
    http_200: ok.length,
    valid: count(as, (a) => a.valid),
    // The provider read these prompt tokens from its own cache and billed them at a lower rate.
    attempts_with_cached_prompt_tokens: count(ok, (a) => (completion(a).usage?.prompt_tokens_details?.cached_tokens ?? 0) > 0),
    cached_prompt_tokens_sum: num((c) => c.usage?.prompt_tokens_details?.cached_tokens).reduce((s, x) => s + x, 0),
    prompt_tokens: spread(num((c) => c.usage?.prompt_tokens)),
    completion_tokens: spread(num((c) => c.usage?.completion_tokens)),
    latency_ms: spread(ok.map((a) => a.ms)),
    cost_usd: { attempts_with_a_cost: costs.length, sum: Number(costs.reduce((s, x) => s + x, 0).toFixed(6)), median: spread(costs)?.median ?? null },
    models: tally((c) => c.model),
    providers: tally((c) => c.provider),
    finish_reasons: tally((c) => c.choices?.[0]?.finish_reason),
  };
}
const sets = Object.fromEntries(probeSets.map((set) => [set, gradeSet(allProbes.filter((p) => p.set === set))]));
const responseIds = raw.calls.flatMap((c) => c.attempts).map((a) => (a.response as { id?: string } | null)?.id);
const all = raw.calls.flatMap((c) => c.attempts);
const totals = {
  calls: raw.calls.length,
  attempts: all.length,
  calls_with_a_second_attempt: count(raw.calls, (c) => c.attempts.length > 1),
  calls_with_no_valid_reply: raw.calls.filter((c) => !c.attempts.at(-1)?.valid).map((c) => `${c.arm} r${c.round} ${c.input}`),
  draft_runs_per_probe: expectedRuns,
  probes_missing_a_run: Object.values(sets).flatMap((s) => s.missing),
  distinct_response_ids: new Set(responseIds).size,
  first_call: all.map((a) => a.started).sort()[0],
  last_call: all.map((a) => a.started).sort().at(-1),
  cost_usd_reported_by_openrouter: usage(all).cost_usd,
};

if (RUN === '1') {
  // The first run's file keeps its shape: one probe set and the three marks it was graded on.
  const results = { about: 'Written by grade.ts from raw.json. Every figure is computed from the saved replies.', totals, ...sets.tuned!.graded };
  fs.writeFileSync(RESULTS_FILE, `${JSON.stringify(results, null, 1)}\n`);
  const g = sets.tuned!.graded;
  console.log(JSON.stringify({ totals, marks: g.marks, by_kind: g.by_kind, specific_level: g.specific_level, off_list: g.off_list, per_call: g.per_call }, null, 1));
} else {
  const passMarks = Object.fromEntries(Object.entries(sets).map(([set, s]) => {
    const m = s.graded.marks;
    const n = s.newMarks;
    const mark = (x: { n: number; of: number; pct: number | null; pass_mark_pct: number }) => ({ n: x.n, of: x.of, pct: x.pct, pass_mark_pct: x.pass_mark_pct, pass: (x.pct ?? 0) >= x.pass_mark_pct });
    return [set, {
      pm1_brand_general_matches_label: mark(m.brand_general_matches_label),
      pm2_nonproduct_gets_not_a_product: mark(m.nonproduct_gets_not_a_product),
      pm3_same_pick_in_all_runs_both_levels: mark(m.same_pick_in_all_runs_both_levels),
      pm4_no_specific_where_label_has_none: mark(n.pm4_no_specific_where_label_has_none),
      pm5_old_fields_hold: { category_reserved: n.pm5_old_fields_hold.category_is_none_or_a_reserved_id.length, product_calls_ok: n.pm5_old_fields_hold.product_calls_with_1_or_more_online_and_exactly_2_local_queries, pass: n.pm5_old_fields_hold.pass },
      pm6_nearby_wording_same_as_today: mark(n.pm6_nearby_wording_same_as_today),
    }];
  }));
  const results = {
    about: `Written by grade.ts from ${RAW_FILE.split('/').at(-1)!}. Every figure is computed from the saved replies. "tuned" is the 48 probes the draft prompt was revised on; "held_out" is held-out.json.`,
    totals,
    pass_marks: passMarks,
    sets: Object.fromEntries(Object.entries(sets).map(([set, s]) => [set, { new_marks: s.newMarks, ...s.graded }])),
  };
  fs.writeFileSync(RESULTS_FILE, `${JSON.stringify(results, null, 1)}\n`);
  console.log(JSON.stringify({ totals, pass_marks: passMarks }, null, 1));
}
