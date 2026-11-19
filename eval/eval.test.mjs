import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { classify, pageTitle } from './access-probe/classify';
import { isAllowed } from './access-probe/robots';
import { pickTargets } from './access-probe/run-probe.mjs';
import { parseTarget } from './access-probe/target';
import { compareRow } from './compare.mjs';
import { buildRequest } from './run-searches.mjs';
import { agreement, badgeCheck, labelCounts, pickCheck, precision, precisionByGeneral, probeRates, recall, recallByKind, sectionResults, siteMeasure, tally, totals, usageRow, validateGrades } from './summarize.mjs';

const { queries } = JSON.parse(readFileSync('eval/queries.json', 'utf8'));
const zips = JSON.parse(readFileSync('public/zips.json', 'utf8'));
const schema = JSON.parse(readFileSync('eval/grade-schema.json', 'utf8'));
const { picks } = JSON.parse(readFileSync('eval/picks.json', 'utf8'));
const categoryList = JSON.parse(readFileSync('data/categories.draft.json', 'utf8'));

describe('queries.json', () => {
  it('has 20 products, each with an urban, suburban and rural zip', () => {
    expect(queries).toHaveLength(60);
    expect(new Set(queries.map((q) => q.id)).size).toBe(60);
    const byProduct = Map.groupBy(queries, (q) => q.product);
    expect(byProduct.size).toBe(20);
    for (const rows of byProduct.values()) expect(rows.map((q) => q.zip_kind).sort()).toEqual(['rural', 'suburban', 'urban']);
    expect(new Set(queries.map((q) => q.category)).size).toBe(8);
  });

  it('uses only zips that resolve, and never sends the zip', () => {
    for (const q of queries) expect(JSON.stringify(buildRequest(q, zips))).not.toContain(q.zip);
  });
});

describe('usage totals', () => {
  it('counts failed searches as zero cost', () => {
    const rows = [
      usageRow({ id: 'a', status: 200, body: { usage: { brave_calls: 4, llm_tokens: 900, estimated_cost_usd: 0.021 } } }),
      usageRow({ id: 'b', status: 502, body: { error: 'upstream_error' } }),
    ];
    expect(totals(rows)).toEqual({ searches: 2, ok: 1, brave_calls: 4, llm_tokens: 900, estimated_cost_usd: 0.021 });
  });
});

describe('robots.txt', () => {
  const token = 'nottheriver-access-probe';
  const txt = [
    'User-agent: *',
    'Disallow: /cart',
    'Allow: /cart/public',
    '',
    'User-agent: NotTheRiver-Access-Probe',
    'User-agent: otherbot',
    'Disallow: /private # comment',
    'Disallow: /*.pdf$',
    'Allow: /private/ok',
  ].join('\n');

  it('uses its own group when one names the product token, case-insensitively', () => {
    expect(isAllowed(txt, token, '/cart')).toBe(true);
    expect(isAllowed(txt, token, '/private/page')).toBe(false);
    expect(isAllowed(txt, token, '/private/ok/x')).toBe(true);
  });

  it('falls back to the * group', () => {
    expect(isAllowed(txt, 'someone-else', '/cart/x')).toBe(false);
    expect(isAllowed(txt, 'someone-else', '/cart/public/x')).toBe(true);
    expect(isAllowed(txt, 'someone-else', '/private')).toBe(true);
  });

  it('supports * and $ and prefers allow on equal length', () => {
    expect(isAllowed(txt, token, '/files/a.pdf')).toBe(false);
    expect(isAllowed(txt, token, '/files/a.pdf?x=1')).toBe(true);
    expect(isAllowed('User-agent: *\nDisallow: /a\nAllow: /a', token, '/a')).toBe(true);
  });

  it('allows everything for an empty file, an empty Disallow, and /robots.txt itself', () => {
    expect(isAllowed('', token, '/x')).toBe(true);
    expect(isAllowed('User-agent: *\nDisallow:', token, '/x')).toBe(true);
    expect(isAllowed('User-agent: *\nDisallow: /', token, '/robots.txt')).toBe(true);
  });
});

describe('challenge classification', () => {
  it('trusts the cf-mitigated header even on a 2xx', () => {
    expect(classify(200, 'challenge', '')).toEqual({ access: 'challenge', marker: 'cf-mitigated' });
  });

  it('ignores challenge scripts on a normal 2xx page', () => {
    expect(classify(200, null, '<script src="/cdn-cgi/challenge-platform/x.js">').access).toBe('ok');
  });

  it('separates challenges, refusals and other errors', () => {
    expect(classify(403, null, '<div id="px-captcha">').access).toBe('challenge');
    expect(classify(403, null, 'Access Denied').access).toBe('blocked');
    expect(classify(402, null, '').access).toBe('blocked');
    expect(classify(503, null, 'maintenance').access).toBe('error');
    expect(classify(404, null, '').access).toBe('error');
  });

  it('extracts a short page title', () => {
    expect(pageTitle('<html><title>\n Just a moment...\n</title>')).toBe('Just a moment...');
    expect(pageTitle('<html>')).toBeNull();
  });
});

const grade = (over) => ({
  search_id: 's1', result_id: 'online:a.com', kind: 'online', url: 'https://a.com/p', sells_product: 'yes',
  local_exists: 'n/a', distance_plausible: 'n/a', badges_sourced: 'n/a', page_access: 'ok', notes: '', checked: '2026-10-01', ...over,
});

describe('summarize', () => {
  it('validates grades against the schema', () => {
    expect(() => validateGrades({ grades: [grade({})], baseline: [] }, schema)).not.toThrow();
    expect(() => validateGrades({ grades: [grade({ sells_product: 'maybe' })], baseline: [] }, schema)).toThrow(/grade-schema/);
  });

  it('computes precision with unknowns excluded and nonexistent local shops counted as misses', () => {
    const grades = [
      grade({ sells_product: 'yes' }),
      grade({ sells_product: 'equivalent' }),
      grade({ sells_product: 'no' }),
      grade({ sells_product: 'unknown' }),
      grade({ kind: 'local', sells_product: 'yes', local_exists: 'no' }),
    ];
    expect(precision(grades)).toEqual({ graded: 4, relevant: 2, unknown: 1, precision: 0.5 });
  });

  it('leaves a local shop whose existence could not be judged out of precision, like an unknown product', () => {
    expect(() => validateGrades({ grades: [grade({ kind: 'local', local_exists: 'unknown' })], baseline: [] }, schema)).not.toThrow();
    const grades = [
      grade({ kind: 'local', sells_product: 'yes', local_exists: 'yes' }),
      grade({ kind: 'local', sells_product: 'yes', local_exists: 'unknown' }),
      grade({ kind: 'local', sells_product: 'no', local_exists: 'yes' }),
    ];
    expect(precision(grades)).toEqual({ graded: 2, relevant: 1, unknown: 1, precision: 0.5 });
  });

  it('counts a local shop confirmed not to exist as bad even when whether it sells the product is unknown', () => {
    const grades = [
      grade({ kind: 'local', sells_product: 'yes', local_exists: 'yes' }),
      grade({ kind: 'local', sells_product: 'unknown', local_exists: 'no' }),
      // Existence itself unknown (not confirmed absent), so this one stays excluded like any other unknown.
      grade({ kind: 'local', sells_product: 'unknown', local_exists: 'unknown' }),
    ];
    expect(precision(grades)).toEqual({ graded: 2, relevant: 1, unknown: 1, precision: 0.5 });
  });

  it('computes recall by registrable domain, or by name for shops without a website', () => {
    const results = { 's1:online': [{ retailer: { name: 'Shop A', domain: 'a.com' } }], 's1:local': [{ retailer: { name: "Bob's Hardware", domain: '' } }] };
    const base = (over) => ({ search_id: 's1', section: 'online', name: 'x', url: null, confirmed: true, miss_reason: null, checked: '2026-10-01', ...over });
    const baseline = [
      base({ url: 'https://www.a.com/item' }),
      base({ url: 'https://b.com/', miss_reason: 'ranked_low' }),
      base({ url: 'https://c.com/' }),
      base({ url: 'https://d.com/', confirmed: false }),
      base({ section: 'local', name: 'Bobs Hardware' }),
    ];
    const r = recall(baseline, (id, sec) => results[`${id}:${sec}`] ?? []);
    expect(r).toEqual({ confirmed: 4, found: 2, recall: 0.5, miss_reasons: { ranked_low: 1, unclassified: 1 } });
  });

  it('counts a baseline shop found under one of its other domains', () => {
    const results = { 's1:local': [{ retailer: { name: 'Sky Toys & Books', domain: 'skytoys.com' } }] };
    const base = { search_id: 's1', section: 'local', name: 'Sky Toys and Books', url: 'https://bsky.example/', confirmed: true, miss_reason: null, checked: '2026-10-01' };
    const resultsFor = (id, sec) => results[`${id}:${sec}`] ?? [];
    expect(recall([base], resultsFor).found).toBe(0);
    expect(recall([{ ...base, also_urls: ['https://skytoys.com/'] }], resultsFor).found).toBe(1);
    expect(() => validateGrades({ grades: [], baseline: [{ ...base, also_urls: ['https://skytoys.com/'] }] }, schema)).not.toThrow();
  });

  it('rates bot blocking and compares it with what a person saw', () => {
    const probe = [
      { url: 'https://a.com/p', access: 'ok' },
      { url: 'https://b.com/p', access: 'challenge' },
      { url: 'https://c.com/p', access: 'robots_disallow' },
      { url: 'https://d.com/p', access: 'error' },
    ];
    expect(probeRates(probe)).toMatchObject({ probed: 4, ok: 1, error: 1, bot_blocked_rate: 0.667 });
    const grades = [
      grade({ url: 'https://a.com/p' }),
      grade({ url: 'https://b.com/p', page_access: 'challenge' }),
      grade({ url: 'https://c.com/p' }),
    ];
    expect(agreement(probe, grades)).toEqual({ both_blocked: 1, bot_only: 1, person_only: 0, neither: 1, precision: 0.5, recall: 1 });
  });

  it('matches a bare-host grade URL to the probe URL with a trailing slash', () => {
    const probe = [{ url: 'https://A.com/', access: 'challenge' }];
    expect(agreement(probe, [grade({ url: 'https://a.com', page_access: 'challenge' })])).toMatchObject({ both_blocked: 1 });
  });

  it('refuses a probe result with an unknown access value', () => {
    expect(() => probeRates([{ url: 'https://a.com/', access: undefined }])).toThrow(/unknown access/);
    expect(() => probeRates([{ url: 'https://a.com/', access: 'probed' }])).toThrow(/unknown access/);
  });

  it('counts badge and distance answers', () => {
    const grades = [grade({ badges_sourced: 'no' }), grade({ badges_sourced: 'yes' }), grade({})];
    expect(tally(grades, 'badges_sourced')).toEqual({ yes: 1, no: 1, 'n/a': 1 });
  });

  const sec = (p, r) => ({ precision: { precision: p }, recall: { recall: r } });
  const report = (online, local, graded_through = '2026-10-01') => ({
    graded_through,
    searches: { ok: 60, graded: 20 },
    precision: { online: online.precision, local: local.precision },
    recall: { online: online.recall, local: local.recall },
  });

  it('publishes a headline only when every figure was measured', () => {
    const measured = siteMeasure([report(sec(0.9, 0.5), sec(0.8, 0.4))], 'docs/evidence/quality/eval20-0925');
    expect(measured).toEqual({
      date: '2026-10-01', searches: 20, runs: 1, precision: { online: 0.9, local: 0.8 }, recall: { online: 0.5, local: 0.4 },
      evidence: 'docs/evidence/quality/eval20-0925',
    });
    // A single run was not graded by a second agent, so there is no mixed-graders note.
    expect(measured.note).toBeUndefined();
    // Grades exist but no confirmed baseline yet: recall is null, so nothing is published.
    expect(siteMeasure([report(sec(0.9, null), sec(0.8, null))], 'x')).toBeNull();
    expect(siteMeasure([report(sec(0.9, 0.5), sec(0.8, 0.4), null)], 'x')).toBeNull();
  });

  it('ranges a figure that rounds to a different percentage between two runs of the same eval', () => {
    const run1 = report(sec(0.979, 0.31), sec(0.636, 0.326));
    const run2 = report(sec(0.979, 0.31), sec(0.617, 0.349));
    expect(siteMeasure([run1, run2], 'docs/evidence/quality/eval20-0925')).toEqual({
      date: '2026-10-01',
      searches: 20,
      runs: 2,
      precision: { online: 0.979, local: [0.617, 0.636] },
      recall: { online: 0.31, local: [0.326, 0.349] },
      evidence: 'docs/evidence/quality/eval20-0925',
      note: "a figure that mixes two graders' answers",
    });
  });
});

describe('chain labels', () => {
  const base = (over) => ({
    search_id: 's1', section: 'local', name: 'x', url: 'https://a.com/', confirmed: true, miss_reason: null, checked: '2026-10-01', ...over,
  });

  it('rejects a non-boolean chain on a baseline row, and accepts chain with chain_source', () => {
    expect(() => validateGrades({ grades: [], baseline: [base({ chain: 'yes' })] }, schema)).toThrow(/grade-schema/);
    expect(() => validateGrades({ grades: [], baseline: [base({ chain: true, chain_source: 'https://x.example/stores' })] }, schema)).not.toThrow();
    expect(() => validateGrades({ grades: [], baseline: [base({ chain: false })] }, schema)).not.toThrow();
  });

  it('rejects a store_breadth value outside the enum, and accepts the three allowed values', () => {
    expect(() => validateGrades({ grades: [grade({ store_breadth: 'huge' })], baseline: [] }, schema)).toThrow(/grade-schema/);
    for (const v of ['specialist', 'general', 'unknown']) {
      expect(() => validateGrades({ grades: [grade({ store_breadth: v })], baseline: [] }, schema)).not.toThrow();
    }
  });

  it('counts a baseline row with no chain field as unlabelled, separate from chain:true/false', () => {
    const results = { 's1:local': [{ retailer: { name: 'A', domain: 'a.com' } }] };
    const resultsFor = (id, sec) => results[`${id}:${sec}`] ?? [];
    const baseline = [
      base({ url: 'https://a.com/', chain: true }),
      base({ url: 'https://b.com/', chain: false }),
      base({ url: 'https://c.com/' }), // no chain field at all: unlabelled, not a miss on either label
    ];
    const r = recallByKind(baseline, resultsFor);
    expect(r.chain).toEqual({ confirmed: 1, found: 1, recall: 1, miss_reasons: {} });
    expect(r.not_chain).toEqual({ confirmed: 1, found: 0, recall: 0, miss_reasons: { unclassified: 1 } });
    expect(r.unlabelled).toEqual({ confirmed: 1, found: 0, recall: 0, miss_reasons: { unclassified: 1 } });
  });

  it('counts unlabelled rows even when unconfirmed, unlike the recall figures', () => {
    const baseline = [
      base({ chain: true }),
      base({ url: 'https://b.com/', chain: false, confirmed: false }),
      base({ url: 'https://c.com/', confirmed: false }), // unlabelled and unconfirmed: recall skips it, this must not
    ];
    expect(labelCounts(baseline)).toEqual({ chain: 1, not_chain: 1, unlabelled: 1 });
  });

  it('reports the badge check as not measured before any returned result carries a chain field', () => {
    const results = { 's1:local': [{ retailer: { name: 'A', domain: 'a.com' } }] };
    const resultsFor = (id, sec) => results[`${id}:${sec}`] ?? [];
    expect(badgeCheck([base({ url: 'https://a.com/', chain: true })], resultsFor)).toEqual({ measured: false });
  });

  it('flags a badge on a chain:false shop and reports coverage of chain:true shops once the field exists', () => {
    const results = {
      's1:local': [{ retailer: { name: 'A', domain: 'a.com' }, chain: { label: 'Chain, 20 stores' } }],
      's1:online': [{ retailer: { name: 'B', domain: 'b.com' } }],
    };
    const resultsFor = (id, sec) => results[`${id}:${sec}`] ?? [];
    const baseline = [
      base({ url: 'https://a.com/', chain: false }),
      base({ section: 'online', url: 'https://b.com/', chain: true }),
    ];
    expect(badgeCheck(baseline, resultsFor)).toEqual({
      measured: true, false_badges: 1, chain_false_returned: 1, chain_true_returned: 1, chain_true_badged: 0, coverage: 0,
    });
  });
});

describe('compare', () => {
  const body = (over) => ({
    query: { local_queries: ['cookware store'], online_queries: ['buy cast iron skillet'] },
    local: [{ retailer: { domain: 'a.com' } }],
    local_farther: [],
    dropped: [],
    ...over,
  });

  it('flags local wording that changed between runs', () => {
    const b = body({ query: { local_queries: ['kitchen supply store'], online_queries: ['buy cast iron skillet'] } });
    expect(compareRow('s1', body({}), b).same_queries).toBe(false);
  });

  it('treats identical wording on both sections as unchanged', () => {
    const row = compareRow('s1', body({}), body({}));
    expect(row.same_queries).toBe(true);
    expect(row.same_online_queries).toBe(true);
  });

  it('flags an online-only wording change even when local wording matches', () => {
    const b = body({ query: { local_queries: ['cookware store'], online_queries: ['cast iron skillet shop'] } });
    const row = compareRow('s1', body({}), b);
    expect(row.same_queries).toBe(true);
    expect(row.same_online_queries).toBe(false);
  });
});

describe('probe targets', () => {
  it('takes one URL per domain and skips failed searches and results without a URL', () => {
    const r = (domain, url) => ({ retailer: { domain, url } });
    const responses = [
      { status: 200, body: { online: [r('a.com', 'https://a.com/1'), r('a.com', 'https://a.com/2')], local: [r('b.com', ''), r('c.com', 'https://c.com/')] } },
      { status: 429, body: { error: 'rate_limited' } },
    ];
    expect(pickTargets(responses)).toEqual([
      { url: 'https://a.com/1', domain: 'a.com', kind: 'online' },
      { url: 'https://c.com/', domain: 'c.com', kind: 'local' },
    ]);
  });

  it('accepts only absolute http(s) probe targets', () => {
    expect(parseTarget('https://a.com/p?q=1')?.href).toBe('https://a.com/p?q=1');
    expect(parseTarget('http://a.com')?.href).toBe('http://a.com/');
    for (const bad of [null, '', '/relative', 'file:///etc/passwd', 'javascript:alert(1)', 'ftp://a.com/']) expect(parseTarget(bad)).toBeNull();
  });
});

describe('sectionResults', () => {
  const near = { retailer: { name: 'Near', domain: 'near.example' } };
  const far = { retailer: { name: 'Far', domain: 'far.example' } };
  const web = { retailer: { name: 'Web', domain: 'web.example' } };

  it('counts the farther-away shops the page shows as local results', () => {
    const body = { local: [near], local_farther: [far], online: [web] };
    expect(sectionResults(body, 'local')).toEqual([near, far]);
    expect(sectionResults(body, 'online')).toEqual([web]);
  });

  it('reads a response saved before farther shops existed', () => {
    expect(sectionResults({ local: [near], online: [] }, 'local')).toEqual([near]);
  });
});

describe('category pick check', () => {
  const qs = [
    { id: 'a-urban', product: 'cast iron skillet' }, { id: 'a-rural', product: 'cast iron skillet' },
    { id: 'b-urban', product: 'wool socks' }, { id: 'b-rural', product: 'wool socks' },
    { id: 'c-urban', product: 'headlamp' },
  ];
  const saved = (id, pick, status = 200) => [id, { id, status, body: { query: { ...(pick && { pick: { general: pick[0], specific: pick[1] } }) } } }];

  it('has a hand pick from the category list for every eval product', () => {
    const parent = new Map(categoryList.general.flatMap((g) => [[g.id, null], ...g.specific.map((s) => [s.id, g.id])]));
    expect(Object.keys(picks).sort()).toEqual([...new Set(queries.map((q) => q.product))].sort());
    for (const { pick, alt } of Object.values(picks)) {
      for (const [general, specific] of alt ? [pick, alt] : [pick]) {
        expect(parent.get(general), general).toBe(null);
        if (specific !== null) expect(parent.get(specific), specific).toBe(general);
      }
    }
  });

  it('counts matches at each level, second picks, and products that got one pick in every search', () => {
    const responses = new Map([
      saved('a-urban', ['kitchen', 'cookware']), // both levels
      saved('a-rural', ['kitchen', null]), // general only, and a second pick for the product
      saved('b-urban', ['outdoor', 'outdoor_clothing']), // the second defensible pick
      saved('b-rural', ['outdoor', 'outdoor_clothing']),
      saved('c-urban', ['none', null]),
    ]);
    expect(pickCheck(qs, picks, responses)).toEqual({
      saved: 5, measured: 5, general_match: 2, general_match_rate: 0.4, both_levels_match: 1, second_pick_match: 2, products: 3, products_searched_twice: 2, one_pick_products: 1,
      misses: [
        { id: 'a-rural', expected: 'kitchen/cookware', got: 'kitchen/' },
        { id: 'b-urban', expected: 'clothing/socks_underwear_swim', second_pick: 'outdoor/outdoor_clothing', got: 'outdoor/outdoor_clothing' },
        { id: 'b-rural', expected: 'clothing/socks_underwear_swim', second_pick: 'outdoor/outdoor_clothing', got: 'outdoor/outdoor_clothing' },
        { id: 'c-urban', expected: 'outdoor/', got: 'none/' },
      ],
    });
  });

  it('does not measure a response with no pick, a failed search or a missing file', () => {
    const responses = new Map([saved('a-urban', null), saved('a-rural', ['kitchen', 'cookware'], 502)]);
    expect(pickCheck(qs, picks, responses)).toMatchObject({ saved: 1, measured: 0, general_match: 0, general_match_rate: null, products: 0, misses: [] });
  });

  it('groups precision by the hand pick of the product, with the count of products behind it', () => {
    const grades = [
      grade({ search_id: 'a-urban', sells_product: 'yes' }), grade({ search_id: 'a-rural', sells_product: 'no' }),
      grade({ search_id: 'c-urban', kind: 'local', sells_product: 'yes', local_exists: 'yes' }),
    ];
    const report = precisionByGeneral(qs, picks, grades);
    expect(Object.keys(report)).toEqual(['kitchen', 'outdoor']);
    expect(report.kitchen).toMatchObject({ products: 1, online: { graded: 2, relevant: 1, precision: 0.5 }, local: { graded: 0, precision: null } });
    expect(report.outdoor).toMatchObject({ products: 1, local: { graded: 1, precision: 1 } });
  });
});
