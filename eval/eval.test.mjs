import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { classify, pageTitle } from './access-probe/classify';
import { isAllowed } from './access-probe/robots';
import { pickTargets } from './access-probe/run-probe.mjs';
import { parseTarget } from './access-probe/target';
import { buildRequest } from './run-searches.mjs';
import { agreement, precision, probeRates, recall, sectionResults, siteMeasure, tally, totals, usageRow, validateGrades } from './summarize.mjs';

const { queries } = JSON.parse(readFileSync('eval/queries.json', 'utf8'));
const zips = JSON.parse(readFileSync('public/zips.json', 'utf8'));
const schema = JSON.parse(readFileSync('eval/grade-schema.json', 'utf8'));

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

  it('publishes a headline only when every figure was measured', () => {
    const sec = (p, r) => ({ precision: { precision: p }, recall: { recall: r } });
    const report = (online, local, graded_through = '2026-10-01') => ({
      graded_through,
      searches: { ok: 60, graded: 20 },
      precision: { online: online.precision, local: local.precision },
      recall: { online: online.recall, local: local.recall },
    });
    expect(siteMeasure(report(sec(0.9, 0.5), sec(0.8, 0.4)))).toEqual({
      date: '2026-10-01', searches: 20, precision: { online: 0.9, local: 0.8 }, recall: { online: 0.5, local: 0.4 },
    });
    // Grades exist but no confirmed baseline yet: recall is null, so nothing is published.
    expect(siteMeasure(report(sec(0.9, null), sec(0.8, null)))).toBeNull();
    expect(siteMeasure(report(sec(0.9, 0.5), sec(0.8, 0.4), null))).toBeNull();
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
