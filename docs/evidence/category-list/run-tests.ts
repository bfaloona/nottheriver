// Free tests of data/categories.draft.json (plan: docs/plans/category-list.md). Reads saved files
// only: no model, Brave or web call. Hand labels are in hand-labels.json beside this file.
// Run from the repo root: npx tsx docs/evidence/category-list/run-tests.ts [list.json] > results.json
// Nothing here measures what the normalize model would pick; every "pick" is a hand label.
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { getDomain } from 'tldts';
import { ideasFor, IDEAS_DATA, type Idea } from '../../../src/ideas';
import normalizeTemplate from '../../../proxy/prompts/normalize';

const HERE = 'docs/evidence/category-list';
const RUN = 'docs/evidence/quality/eval20-store-types';
const read = <T>(path: string): T => JSON.parse(readFileSync(path, 'utf8')) as T;

type StoreType = { q: string; basis: 'seen' | 'prompt' | 'guess' };
type Ideas = Record<Idea, string | null>;
type Specific = { id: string; name: string; store_types: StoreType[] | null; match_words: string[]; ideas: Ideas; no_used: boolean };
type General = { id: string; name: string; store_types: StoreType[]; match_words: string[]; eval_tag: string | null; specific: Specific[] };
type List = { general: General[]; reserved: { id: string; reasons?: { id: string }[] }[] };
type Pick = [string, string | null];
type Labels = {
  eval_picks: Record<string, { pick: Pick; alt?: Pick }>;
  shop_kind_by_domain: Record<string, string>;
  shop_kind_by_name: Record<string, string>;
  phrase_kinds: Record<string, string[]>;
  walk: [string, string, string, string | null][];
  probes: { input: string; kind: string; pick: Pick; alt?: Pick }[];
};
type Row = {
  id: string; kind: 'local' | 'online'; retailer: { name: string; domain: string }; snippet: string; matched_product: string;
  components: { name: string; value: number; sources: { label: string }[] }[];
};
type Body = {
  query: { product: string; canonical_name: string; category: string; local_queries: string[] };
  local: Row[]; local_farther?: Row[]; online: Row[];
};
type Grade = { search_id: string; result_id: string; kind: string; sells_product: string; local_exists: string };
type Baseline = { search_id: string; section: string; name: string; url: string | null; also_urls?: string[]; confirmed: boolean };

const list = read<List>(process.argv[2] ?? 'data/categories.draft.json');
const labels = read<Labels>(`${HERE}/hand-labels.json`);
const generalById = new Map(list.general.map((g) => [g.id, g]));
const specificById = new Map(list.general.flatMap((g) => g.specific.map((s) => [s.id, { ...s, parent: g.id }] as const)));

// The same word rule as src/ideas.ts (whole words, plural allowed on the last word), copied
// because that file does not export it.
function words(text: string): string[] {
  return text.toLowerCase().replace(/’/g, "'").split(/[\s\-/,]+/).map((w) => w.replace(/'s$/, '').replace(/[^a-z0-9]/g, '')).filter(Boolean);
}
function termMatches(term: string, toks: string[]): boolean {
  const tt = words(term);
  const last = tt[tt.length - 1] ?? '';
  const forms = new Set([last, `${last}s`, `${last}es`, last.endsWith('y') ? `${last.slice(0, -1)}ies` : last]);
  return toks.some((_, i) => i + tt.length <= toks.length && tt.every((w, j) => (j === tt.length - 1 ? forms.has(toks[i + j] ?? '') : toks[i + j] === w)));
}
const bestTerm = (terms: string[], toks: string[]) => terms.filter((t) => termMatches(t, toks)).sort((a, b) => b.length - a.length)[0];

// Code-only mapping (the memo's CAT-B): the longest matching specific term wins, then a general term.
function codeMap(text: string): { general: string; specific: string | null; term: string; generals: string[] } {
  const toks = words(text);
  const hits = list.general.flatMap((g) => [
    ...g.specific.map((s) => ({ general: g.id, specific: s.id as string | null, term: bestTerm(s.match_words, toks) })),
    { general: g.id, specific: null as string | null, term: bestTerm(g.match_words, toks) },
  ]).filter((h): h is { general: string; specific: string | null; term: string } => h.term !== undefined);
  const generals = [...new Set(hits.map((h) => h.general))];
  const best = hits.sort((a, b) => Number(b.specific !== null) - Number(a.specific !== null) || b.term.length - a.term.length)[0];
  return best ? { ...best, generals } : { general: 'none', specific: null, term: '', generals };
}

const storeTypes = ([g, s]: Pick): string[] => {
  const types = (s ? specificById.get(s)?.store_types : null) ?? generalById.get(g)?.store_types ?? [];
  return types.map((t) => t.q);
};
const matchWords = ([g, s]: Pick): string[] => [...(s ? specificById.get(s)?.match_words ?? [] : []), ...(generalById.get(g)?.match_words ?? [])];

function jsonFiles(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) jsonFiles(path, out);
    else if (name.endsWith('.json')) out.push(path);
  }
  return out;
}
function savedBodies(): Body[] {
  const bodies: Body[] = [];
  for (const file of [...jsonFiles('docs/evidence/quality'), ...jsonFiles('docs/evidence/latency-0927')]) {
    let data: unknown;
    try { data = JSON.parse(readFileSync(file, 'utf8')); } catch { continue; }
    const outer = data as { body?: Body; query?: Body['query'] } | null;
    const body = outer?.body?.query ? outer.body : outer?.query && typeof outer.query === 'object' ? (outer as Body) : null;
    if (body?.query.product) bodies.push(body);
  }
  return bodies;
}

// LIST: shape checks and store-type basis, checked against the saved wording.
const bodies = savedBodies();
const seenPhrases = new Map<string, number>();
for (const b of bodies) for (const q of b.query.local_queries ?? []) seenPhrases.set(q, (seenPhrases.get(q) ?? 0) + 1);
const allTypes = list.general.flatMap((g) => [...g.store_types, ...g.specific.flatMap((s) => s.store_types ?? [])]);
const distinctTypes = [...new Map(allTypes.map((t) => [t.q, t])).values()];
const kindIds = new Set(IDEAS_DATA.kinds.map((k) => k.id));
const ids = [...generalById.keys(), ...list.general.flatMap((g) => g.specific.map((s) => s.id)), ...list.reserved.flatMap((r) => [r.id, ...(r.reasons ?? []).map((x) => x.id)])];
const listCheck = {
  general: list.general.length,
  specific: specificById.size,
  duplicate_ids: ids.filter((id, i) => ids.indexOf(id) !== i),
  specific_with_own_store_types: [...specificById.values()].filter((s) => s.store_types).length,
  specific_with_an_idea: [...specificById.values()].filter((s) => Object.values(s.ideas).some(Boolean)).length,
  specific_with_no_used: [...specificById.values()].filter((s) => s.no_used).length,
  unknown_idea_kinds: [...specificById.values()].flatMap((s) => Object.values(s.ideas)).filter((k) => k && !kindIds.has(k)),
  store_type_phrases: distinctTypes.length,
  phrases_marked_seen: distinctTypes.filter((t) => t.basis === 'seen').length,
  phrases_marked_guess: distinctTypes.filter((t) => t.basis === 'guess').length,
  marked_seen_but_not_in_saved_responses: distinctTypes.filter((t) => t.basis === 'seen' && !seenPhrases.has(t.q)).map((t) => t.q),
  not_ending_in_store: distinctTypes.filter((t) => !/ store$/.test(t.q)).map((t) => t.q),
  // How often the model wrote each "seen" phrase in the saved responses. A low count is thin support.
  seen_phrase_counts: Object.fromEntries(distinctTypes.filter((t) => t.basis === 'seen').map((t) => [t.q, seenPhrases.get(t.q) ?? 0]).sort((x, y) => Number(x[1]) - Number(y[1]))),
};

// TEST-0 (the memo's EXP-1 to EXP-4): can code alone map today's fields to the list?
const wordings = new Map<string, Set<string>>();
for (const b of bodies) (wordings.get(b.query.product) ?? wordings.set(b.query.product, new Set()).get(b.query.product)!).add(b.query.category);
const hit = (got: { general: string; specific: string | null }, want: Pick) => ({ general: got.general === want[0], both: got.general === want[0] && got.specific === want[1] });
const byProduct = [...wordings.keys()].map((product) => {
  const want = labels.eval_picks[product]?.pick ?? ['none', null];
  const got = codeMap(product);
  return { product, want, got: [got.general, got.specific], term: got.term, ...hit(got, want), two_generals: got.generals.length > 1 ? got.generals : undefined };
});
const byWording = [...wordings].flatMap(([product, cats]) => [...cats].map((category) => {
  const want = labels.eval_picks[product]?.pick ?? ['none', null];
  const got = codeMap(category);
  return { product, category, want, got: [got.general, got.specific], ...hit(got, want) };
}));
const probes = labels.probes.map((p) => {
  const got = codeMap(p.input);
  const ok = (want?: Pick) => want !== undefined && got.general === want[0];
  return { input: p.input, kind: p.kind, want: p.pick, got: [got.general, got.specific], general_ok: ok(p.pick), alt_ok: ok(p.alt) };
});
const probeKinds = [...new Set(probes.map((p) => p.kind))];
const count = <T>(rows: T[], f: (r: T) => boolean) => rows.filter(f).length;
const test0 = {
  saved_responses: bodies.length,
  typed_product: { products: byProduct.length, general_hits: count(byProduct, (r) => r.general), both_levels_hits: count(byProduct, (r) => r.both), rows: byProduct },
  free_text_category: {
    distinct_values: new Set(byWording.map((r) => r.category)).size, product_and_value_pairs: byWording.length,
    general_hits: count(byWording, (r) => r.general), both_levels_hits: count(byWording, (r) => r.both), unmapped: count(byWording, (r) => r.got[0] === 'none'),
    misses: byWording.filter((r) => !r.general),
  },
  probes_typed_words_only: Object.fromEntries(probeKinds.map((k) => {
    const rows = probes.filter((p) => p.kind === k);
    return [k, { inputs: rows.length, general_hits: count(rows, (r) => r.general_ok), alt_hits: count(rows, (r) => r.alt_ok), mapped_wrongly: rows.filter((r) => !r.general_ok && !r.alt_ok && r.got[0] !== 'none').map((r) => `${r.input} -> ${r.got[0]}`) }];
  })),
};

// TEST-1 (IDEA-1): do the list's store types name the kinds of the baseline shops, against today's wording?
const grades = read<{ grades: Grade[]; baseline: Baseline[] }>(`${RUN}/grades.json`);
const responses = new Map(readdirSync(`${RUN}/responses`).map((f) => [f.replace(/\.json$/, ''), read<{ body: Body }>(`${RUN}/responses/${f}`).body] as const));
const names = (phrases: string[], kind: string) => phrases.some((p) => (labels.phrase_kinds[p] ?? []).includes(kind));
const unlabelledPhrases = new Set<string>();
const shops = grades.baseline.filter((b) => b.section === 'local' && b.confirmed).map((b) => {
  const body = responses.get(b.search_id)!;
  const domains = new Set([b.url, ...(b.also_urls ?? [])].map((u) => (u ? getDomain(u) : null)).filter(Boolean));
  const rows = [...body.local, ...(body.local_farther ?? [])];
  const found = domains.size > 0 ? rows.some((r) => domains.has(r.retailer.domain)) : rows.some((r) => r.retailer.name.toLowerCase() === b.name.toLowerCase());
  const kind = labels.shop_kind_by_name[b.name] ?? labels.shop_kind_by_domain[[...domains][0] ?? ''] ?? 'UNLABELLED';
  const pick = labels.eval_picks[body.query.product]!;
  const today = body.query.local_queries;
  const fromList = storeTypes(pick.pick);
  for (const p of [...today, ...fromList, ...(pick.alt ? storeTypes(pick.alt) : [])]) if (!(p in labels.phrase_kinds)) unlabelledPhrases.add(p);
  return { search: b.search_id, product: body.query.product, name: b.name, kind, found, today: names(today, kind), list: names(fromList, kind), alt: pick.alt ? names(storeTypes(pick.alt), kind) : null };
});
const perSearch = [...responses].map(([search, body]) => {
  const pick = labels.eval_picks[body.query.product]!;
  const rows = shops.filter((s) => s.search === search);
  return {
    search, today: body.query.local_queries, list: storeTypes(pick.pick), alt: pick.alt ? storeTypes(pick.alt) : undefined,
    same_wording: JSON.stringify(body.query.local_queries) === JSON.stringify(storeTypes(pick.pick)),
    shops: rows.length, named_today: count(rows, (r) => r.today), named_by_list: count(rows, (r) => r.list), named_by_alt: pick.alt ? count(rows, (r) => r.alt === true) : undefined,
  };
});
// All 20 eval products (4 have no graded search): the list's two phrases against the pair the model wrote most often.
const pairCounts = new Map<string, Map<string, number>>();
for (const b of bodies) {
  const pairs = pairCounts.get(b.query.product) ?? pairCounts.set(b.query.product, new Map()).get(b.query.product)!;
  const key = JSON.stringify(b.query.local_queries ?? []);
  pairs.set(key, (pairs.get(key) ?? 0) + 1);
}
const perProduct = [...pairCounts].map(([product, pairs]) => {
  const [top, n] = [...pairs].sort((x, y) => y[1] - x[1])[0]!;
  const usual = JSON.parse(top) as string[];
  const fromList = storeTypes(labels.eval_picks[product]!.pick);
  return { product, usual, share: `${n} of ${[...pairs.values()].reduce((x, y) => x + y, 0)}`, list: fromList, same_pair: JSON.stringify(usual) === JSON.stringify(fromList), phrases_shared: count(fromList, (q) => usual.includes(q)) };
});
const cross = (f: (s: (typeof shops)[number]) => boolean) => ({ shops: count(shops, f), found: count(shops, (s) => f(s) && s.found) });
const test1 = {
  run: RUN,
  baseline_shops: shops.length,
  found_in_this_run: count(shops, (s) => s.found),
  unlabelled_shops: shops.filter((s) => s.kind === 'UNLABELLED').map((s) => s.name),
  unlabelled_phrases: [...unlabelledPhrases],
  searches: perSearch.length,
  searches_with_same_two_phrases: count(perSearch, (s) => s.same_wording),
  named_today: count(shops, (s) => s.today),
  named_by_list: count(shops, (s) => s.list),
  named_by_list_only: shops.filter((s) => s.list && !s.today).map((s) => `${s.product}: ${s.name} (${s.kind})`),
  named_today_only: shops.filter((s) => s.today && !s.list).map((s) => `${s.product}: ${s.name} (${s.kind})`),
  named_by_neither_by_kind: Object.fromEntries([...new Set(shops.filter((s) => !s.today && !s.list).map((s) => s.kind))].map((k) => [k, count(shops, (s) => !s.today && !s.list && s.kind === k)])),
  does_naming_predict_found: { kind_named_today: cross((s) => s.today), kind_not_named_today: cross((s) => !s.today) },
  per_search: perSearch,
  products_with_the_same_pair_as_the_usual_wording: count(perProduct, (r) => r.same_pair),
  products_sharing_no_phrase_with_the_usual_wording: perProduct.filter((r) => r.phrases_shared === 0).map((r) => r.product),
  per_product: perProduct,
};

// TEST-2 (IDEA-3): the 0.5 text tier with FLD-5 words in place of the free-text category.
// A saved row holds the snippet and, for a row scored by the text rule, the title (the relevance
// source label). It does not hold similar_products, so a tier-1 text match is read from matched_product.
const norm = (s: string) => s.normalize('NFKC').toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
const tierRows = grades.grades.flatMap((g) => {
  const body = responses.get(g.search_id);
  const row = body && [...body.local, ...(body.local_farther ?? []), ...body.online].find((r) => r.id === g.result_id);
  if (!body || !row) return [];
  const rel = row.components.find((c) => c.name === 'relevance');
  const label = rel?.sources[0]?.label ?? '';
  const judged = label.startsWith('Model judgment');
  const title = row.kind === 'local' || judged ? row.retailer.name : label;
  const quality = g.sells_product === 'no' || g.local_exists === 'no' ? 'bad' : g.sells_product === 'unknown' || g.local_exists === 'unknown' ? 'unknown' : 'good';
  const old05 = norm(body.query.category) !== '' && [norm(title), norm(row.snippet)].some((f) => f.includes(norm(body.query.category)));
  const toks = [...words(title), '|', ...words(row.snippet)];
  const term = bestTerm(matchWords(labels.eval_picks[body.query.product]!.pick), toks);
  return [{ search: g.search_id, kind: row.kind, name: row.retailer.name, snippet: row.snippet.slice(0, 40), quality, saved: rel?.value ?? 0, judged, tier1: row.matched_product !== '', old05, new05: term !== undefined, term }];
});
const tally = (rows: typeof tierRows) => ({ rows: rows.length, good: count(rows, (r) => r.quality === 'good'), bad: count(rows, (r) => r.quality === 'bad'), unknown: count(rows, (r) => r.quality === 'unknown') });
const section = (kind: string) => {
  const rows = tierRows.filter((r) => r.kind === kind);
  const text = rows.filter((r) => !r.tier1);
  return {
    graded_rows_joined: rows.length,
    text_tier_1_unchanged: count(rows, (r) => r.tier1),
    category_matches_today: tally(text.filter((r) => r.old05)),
    list_words_match: tally(text.filter((r) => r.new05)),
    // Shown tier changes: a row saved at 0.2 that the list words lift to 0.5.
    would_rise_to_half: tally(text.filter((r) => r.saved === 0.2 && r.new05)),
    // A row already lifted by the model's judgment hides its text tier, so the list words change nothing shown.
    list_words_match_but_judgment_already_higher: tally(text.filter((r) => r.new05 && !r.old05 && r.judged)),
    would_lose_the_category_match: tally(text.filter((r) => r.old05 && !r.new05)),
    saved_at_0_2: tally(text.filter((r) => r.saved === 0.2)),
    words_that_matched: Object.fromEntries([...new Set(text.filter((r) => r.new05).map((r) => r.term!))].map((t) => [t, tally(text.filter((r) => r.term === t))])),
    risers: text.filter((r) => r.saved === 0.2 && r.new05).map((r) => `${r.quality}: ${r.name} [${r.snippet}] (${r.term}) ${r.search}`),
  };
};
const test2 = { run: RUN, grades: grades.grades.length, local: section('local'), online: section('online') };

// TEST-3 (IDEA-2): the 118 walk-through products with a right pick, after the keep-out words.
const LETTER: Record<string, Idea> = { b: 'borrow', r: 'repair', u: 'used' };
const keepOutTerms = IDEAS_DATA.keep_out.flatMap((k) => k.terms);
const walk = labels.walk.map(([product, shouldLetters, g, s]) => {
  const typed = ideasFor({ product, canonical_name: product, category: '' }).map((i) => i.idea);
  const keptOut = keepOutTerms.some((t) => termMatches(t, words(product)));
  const spec = s ? specificById.get(s) : undefined;
  const fromPick = spec ? (Object.keys(spec.ideas) as Idea[]).filter((i) => spec.ideas[i]) : [];
  const withPick = keptOut ? [] : [...new Set([...typed, ...fromPick])].filter((i) => !(spec?.no_used && i === 'used'));
  const should = shouldLetters === '?' ? null : [...shouldLetters].map((l) => LETTER[l]!);
  const grade = (shown: Idea[]) => (should === null ? 'undecided' : shown.some((i) => !should.includes(i)) ? 'extra' : should.some((i) => !shown.includes(i)) ? 'hide' : 'right');
  const watch = IDEAS_DATA.watch.some((t) => termMatches(t, words(product)));
  const siblingsWithIdea = (generalById.get(g)?.specific ?? []).filter((x) => x.id !== s && Object.values(x.ideas).some(Boolean)).map((x) => x.id);
  return { product, should, typed, with_pick: withPick, kept_out: keptOut, watch, pick: [g, s], typed_grade: grade(typed), pick_grade: grade(withPick), exposed_to: should?.length === 0 && !keptOut ? siblingsWithIdea : [] };
});
const covers = (shown: Idea[], w: (typeof walk)[number]) => w.should !== null && w.should.every((i) => shown.includes(i));
const show = (w: (typeof walk)[number]) => `${w.product} [${w.with_pick.join(', ') || 'nothing'}; should ${w.should?.join(', ') || 'nothing'}; pick ${w.pick.join('/')}]`;
const gradeCounts = (key: 'typed_grade' | 'pick_grade') => Object.fromEntries(['right', 'hide', 'extra', 'undecided'].map((g) => [g, count(walk, (w) => w[key] === g)]));
const hiddenToday = walk.filter((w) => w.should !== null && !covers(w.typed, w));
const test3 = {
  products: walk.length,
  // "extra" includes a used idea on tools and furniture that the owner signed after the walk-through wrote its "should" column.
  typed_words_only_today: gradeCounts('typed_grade'),
  with_a_right_pick: gradeCounts('pick_grade'),
  hidden_today: hiddenToday.map((w) => w.product),
  of_them_shown_with_a_right_pick: hiddenToday.filter((w) => covers(w.with_pick, w)).map(show),
  of_them_still_hidden: hiddenToday.filter((w) => !covers(w.with_pick, w)).map((w) => `${w.product}${w.kept_out ? ' (kept out by code)' : ''} [pick ${w.pick.join('/')}]`),
  new_shows_where_nothing_should_show: walk.filter((w) => w.should?.length === 0 && w.typed.length === 0 && w.with_pick.length > 0).map(show),
  new_ideas_beyond_should: walk.filter((w) => w.should !== null && w.should.length > 0 && w.with_pick.some((i) => !w.should!.includes(i) && !w.typed.includes(i))).map(show),
  shows_on_a_kept_out_or_watch_product: walk.filter((w) => (w.kept_out || w.watch) && w.with_pick.length > 0).map((w) => w.product),
  // A wrong pick inside the same general category: products that should show nothing, are not kept out
  // by code, and have a sibling category that carries an idea.
  exposed_to_a_sibling_pick: { products: count(walk, (w) => w.exposed_to.length > 0), of_them_on_the_watch_list: walk.filter((w) => w.exposed_to.length > 0 && w.watch).map((w) => `${w.product} -> ${w.exposed_to.join(', ')}`) },
};

// PROMPT: size of the draft prompt. Tokens are an estimate: characters scaled by the measured
// 348 to 351 tokens of today's prompt (docs/costs.md:27).
const today = normalizeTemplate.replace('{{product}}', JSON.stringify('cast iron skillet'));
const lines = (full: boolean) => list.general.map((g) => (full && g.specific.length ? `${g.id}: ${g.specific.map((s) => s.id).join(', ')}` : g.id)).join('\n');
const fieldLines = [
  '- general: one id from the left of a line in CATEGORIES, by the kind of shop that sells the product. Read a brand or model name as the product it is. Use "not_a_product" for a service, a meal, a place to stay, an activity or a whole room, and "none" when no line fits.',
  '- specific: one id from the right of the same line when one fits, else "". For "not_a_product" give the reason: service, meal, place_to_stay, activity, room or unclear.',
].join('\n');
const draft = (full: boolean, keepLocal: boolean) => {
  let text = today.replace('- category:', `${fieldLines}\n- category:`);
  if (!keepLocal) text = text.replace(/\n- local_queries:[^\n]*/, '');
  return text.replace('\n\nDo not name', `\n\nCATEGORIES\n${lines(full)}\n\nDo not name`);
};
const charsPerToken = today.length / 349.5;
const size = (text: string) => ({ chars: text.length, tokens_estimate: Math.round(text.length / charsPerToken) });
const prompt = {
  today: { chars: today.length, tokens_measured: '348 to 351 (docs/costs.md:27)' },
  chars_per_token_assumed: Math.round(charsPerToken * 100) / 100,
  list_block_ids_both_levels: size(lines(true)),
  list_block_general_ids_only: size(lines(false)),
  draft_both_levels_keeping_local_queries: size(draft(true, true)),
  draft_both_levels_without_local_queries: size(draft(true, false)),
  draft_general_only_keeping_local_queries: size(draft(false, true)),
  draft_text: draft(true, true),
};

console.log(JSON.stringify({ list: listCheck, test0, test1, test2, test3, prompt}, null, 1));
