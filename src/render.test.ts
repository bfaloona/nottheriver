// @vitest-environment happy-dom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { SearchResponse, SearchResult, Signal } from '../proxy/src/contract';
import fixture from '../tests/fixtures/search-response.json';
import { disputeUrlFor } from './config';
import { defaultView } from './controls';
import { formatDistance, renderFooter, renderResult, renderResults, renderStatus } from './render';

const response = fixture as SearchResponse;
const config = { disputeUrl: disputeUrlFor('') };
const all = [...response.local, ...response.online];

let root: HTMLElement;
beforeEach(() => {
  document.body.innerHTML = '';
  root = document.createElement('div');
  document.body.append(root);
  renderResults(response, root, config);
});

function item(result: SearchResult): HTMLElement {
  const section = root.querySelector(`[data-section="${result.kind === 'local' ? 'near' : 'online'}"]`)!;
  const li = [...section.querySelectorAll<HTMLElement>('[data-result]')].find(
    (el) => el.querySelector('[data-retailer]')?.textContent === result.retailer.name,
  );
  if (!li) throw new Error(`no item for ${result.retailer.name}`);
  return li;
}

describe('renderResults (HR5)', () => {
  it('renders both sections with one item per result', () => {
    expect(root.querySelectorAll('[data-section="near"] [data-result]')).toHaveLength(response.local.length);
    expect(root.querySelectorAll('[data-section="online"] [data-result]')).toHaveLength(response.online.length);
  });

  const whyRows = (result: SearchResult) =>
    [...item(result).querySelectorAll('[data-why] [data-component]')].map((row) => [
      row.querySelector('.component-name')!.textContent,
      row.querySelector('.component-text')!.textContent,
    ]);

  it('explains every result in four plain rows under its score', () => {
    for (const result of all) {
      const li = item(result);
      expect(li.querySelector('[data-why] summary')!.textContent).toBe('Why this rank');
      expect(li.querySelector('.why-total')!.textContent).toBe(`Score ${result.score.toFixed(2)}`);
      expect(whyRows(result).map(([name]) => name)).toEqual(['Sells it', 'Ethics', 'Environment', 'Distance']);
      expect(li.querySelector('.component-math'), 'no weight × value math').toBeNull();
    }
  });

  it('links only certifications and concerns, plus one "How ranking works"', () => {
    for (const result of all) {
      const external = result.components
        .filter((c) => c.name === 'ethics' || c.name === 'env')
        .flatMap((c) => c.sources.filter((s) => !s.url.endsWith('about.html#ranking')).map((s) => s.url));
      const panel = item(result).querySelector('.why-panel')!;
      const sources = [...panel.querySelectorAll('a[data-component-source]')].map((a) => a.getAttribute('href'));
      expect(sources, result.id).toEqual(external);
      expect([...panel.querySelectorAll('a')].length, result.id).toBe(external.length + 1);
    }
  });

  it('names certifications and concerns, and says when nothing was found', () => {
    const [first, second] = response.local;
    expect(whyRows(first!)).toEqual([
      ['Sells it', 'Product named in listing'],
      ['Ethics', 'B Corp'],
      ['Environment', 'Nothing found'],
      ['Distance', formatDistance(first!.distance_km!)],
    ]);
    expect(whyRows(second!)[1]).toEqual(['Ethics', 'Labor concern']);
    expect(whyRows(response.online[0]!).slice(2)).toEqual([['Environment', '1% for the Planet'], ['Distance', 'Online']]);
    expect(whyRows(response.online[1]!)[0]).toEqual(['Sells it', 'Category named in listing']);
  });

  it("words the model's sells judgment and a missing distance", () => {
    const base = response.local[0]!;
    const judged = (value: number, label: string): SearchResult => ({
      ...base,
      distance_km: null,
      components: base.components.map((c) => {
        if (c.name === 'relevance') return { ...c, value, sources: [{ label, url: base.retailer.url }] };
        if (c.name === 'proximity') return { ...c, value: 0, sources: [] };
        return c;
      }),
    });
    const rows = (r: SearchResult) =>
      [...renderResult(r, config).querySelectorAll('[data-component]')].map((row) => row.querySelector('.component-text')!.textContent);
    expect(rows(judged(1, 'Model judgment: likely sells it'))).toEqual(['Likely, by shop type', 'B Corp', 'Nothing found', 'Unknown']);
    expect(rows(judged(0.5, 'Model judgment: may sell it'))[0]).toBe('Maybe, by shop type');
    expect(rows(judged(0.2, base.retailer.name))[0]).toBe('Not confirmed');
  });

  it('shows the response rank, not the position', () => {
    // Sorting by name puts the rank-2 local shop first, so position and rank differ.
    renderResults(response, root, config, { ...defaultView, sort: 'name' });
    const first = root.querySelector('[data-section="near"] [data-result] [data-retailer]')!;
    expect(first.textContent).toBe(response.local[1]!.retailer.name);
    for (const result of all) expect(item(result).querySelector('.rank')!.textContent).toBe(String(result.rank));
  });

  it('links each certification badge to its source', () => {
    const first = response.local[0]!;
    const badge = item(first).querySelector<HTMLAnchorElement>('.badge')!;
    expect(badge.textContent).toBe(first.certifications[0]!.label);
    expect(badge.getAttribute('href')).toBe(first.certifications[0]!.source_url);
  });

  it('shows a negative signal with its kind, source link, action date, and a dispute link', () => {
    const second = response.local[1]!;
    const signal = second.signals[0]!;
    const li = item(second);
    // One finding renders directly, ungrouped: no "N concerns" summary to click through.
    expect(li.querySelector('[data-concerns]')).toBeNull();
    const row = li.querySelector('[data-negative]')!;
    expect(row.textContent).toContain('Labor');
    expect(row.textContent).toContain(signal.claim);
    expect(row.textContent).toContain('Jul 11, 2024');
    const source = row.querySelector<HTMLAnchorElement>('a.negative-source')!;
    expect(source.getAttribute('href')).toBe(signal.source_url);
    expect(source.textContent).toContain('osha.gov');
    expect(li.querySelectorAll('[data-dispute]')).toHaveLength(1);
    expect(row.querySelector('[data-dispute]')!.getAttribute('href')).toBe('about.html#dispute');
  });

  it('shows a malformed action_date as-is rather than "undefined"', () => {
    const signal: Signal = { ...response.local[1]!.signals[0]!, action_date: 'not-a-date' };
    const li = renderResult({ ...response.local[1]!, signals: [signal] }, config);
    expect(li.querySelector('[data-action-date]')!.textContent).toBe('not-a-date');
  });

  it('points the dispute link at the issue template when a repo URL is set', () => {
    const repo = 'https://github.com/example/example';
    const li = renderResult(response.local[1]!, { disputeUrl: disputeUrlFor(repo) });
    expect(li.querySelector('[data-dispute]')!.getAttribute('href')).toBe(
      `${repo}/issues/new?template=dispute-a-ranking.md`,
    );
  });

  it('shows no concern box or group when a result has no negative findings', () => {
    const clean = response.local[0]!;
    expect(clean.signals.filter((s) => s.polarity === 'negative')).toHaveLength(0);
    const li = item(clean);
    expect(li.querySelector('[data-negative]')).toBeNull();
    expect(li.querySelector('[data-concerns]')).toBeNull();
    expect(li.querySelectorAll('[data-dispute]')).toHaveLength(0);
  });

  it('groups five findings behind one summary line, each still disputable and dated', () => {
    const kinds: Signal['kind'][] = ['labor', 'governance', 'environmental', 'labor', 'environmental'];
    const dates = ['2019-03-01', '2020-06-15', '2021-09-09', '2023-01-20', '2025-12-05'];
    const signals: Signal[] = kinds.map((kind, i) => ({
      kind,
      polarity: 'negative',
      claim: `Finding ${i}`,
      source_url: `https://example-source.gov/${i}`,
      origin: 'curated',
      action_date: dates[i]!,
    }));
    const grouped: SearchResult = { ...response.local[1]!, signals };
    const li = renderResult(grouped, config);

    expect(li.querySelectorAll('[data-negative]')).toHaveLength(5); // none render outside the group
    const details = li.querySelector<HTMLDetailsElement>('[data-concerns]')!;
    expect(details.tagName).toBe('DETAILS'); // native, keyboard- and screen-reader-reachable
    expect(details.querySelector('summary')!.textContent).toBe('5 concerns, 2019 to 2025');

    // Newest first, so the list order matches the summary's "2019 to 2025" range.
    const newestFirst = [...signals].reverse();
    const boxes = details.querySelectorAll('[data-negative]');
    expect(boxes).toHaveLength(5);
    boxes.forEach((box, i) => {
      expect(box.textContent).toContain(newestFirst[i]!.claim);
      expect(box.querySelector('a.negative-source')!.getAttribute('href')).toBe(newestFirst[i]!.source_url);
    });
    expect(details.querySelectorAll('[data-dispute]')).toHaveLength(5); // one per finding, not one for the group
    expect([...details.querySelectorAll('[data-action-date]')].map((p) => p.textContent)).toEqual([
      'Dec 5, 2025',
      'Jan 20, 2023',
      'Sep 9, 2021',
      'Jun 15, 2020',
      'Mar 1, 2019',
    ]);
  });

  it('sorts a group with the same year into one range label, not a redundant "to"', () => {
    const signals: Signal[] = [
      { kind: 'labor', polarity: 'negative', claim: 'A', source_url: 'https://a.example', origin: 'curated', action_date: '2024-01-05' },
      { kind: 'environmental', polarity: 'negative', claim: 'B', source_url: 'https://b.example', origin: 'curated', action_date: '2024-11-20' },
    ];
    const li = renderResult({ ...response.local[1]!, signals }, config);
    expect(li.querySelector('[data-concerns] summary')!.textContent).toBe('2 concerns, 2024');
  });

  it('sorts undated (model-origin) findings after every dated one, regardless of input order', () => {
    const dated: Signal = { kind: 'labor', polarity: 'negative', claim: 'Dated', source_url: 'https://dated.example', origin: 'curated', action_date: '2022-06-01' };
    const undated: Signal = { kind: 'environmental', polarity: 'negative', claim: 'Undated', source_url: 'https://undated.example', origin: 'llm', action_date: null };
    // Undated listed first in the input, to prove the output order is sorted, not preserved.
    const li = renderResult({ ...response.local[1]!, signals: [undated, dated] }, config);
    const boxes = li.querySelectorAll('[data-negative]');
    expect([...boxes].map((b) => b.textContent)).toEqual([expect.stringContaining('Dated'), expect.stringContaining('Undated')]);
    expect(li.querySelector('[data-concerns] summary')!.textContent).toBe('2 concerns, 2022'); // the undated row doesn't widen the range
  });

  it('sorts three unsorted dates into newest-first order', () => {
    const mk = (claim: string, action_date: string): Signal =>
      ({ kind: 'labor', polarity: 'negative', claim, source_url: `https://${claim}.example`, origin: 'curated', action_date });
    // Deliberately out of order: middle, oldest, newest.
    const signals = [mk('Middle', '2021-01-01'), mk('Oldest', '2018-01-01'), mk('Newest', '2023-01-01')];
    const li = renderResult({ ...response.local[1]!, signals }, config);
    const boxes = li.querySelectorAll('[data-negative]');
    expect([...boxes].map((b) => b.textContent)).toEqual([
      expect.stringContaining('Newest'),
      expect.stringContaining('Middle'),
      expect.stringContaining('Oldest'),
    ]);
  });

  it('lists all four weights once per response', () => {
    const weights = root.querySelectorAll('[data-weights]');
    expect(weights).toHaveLength(1);
    for (const w of Object.values(response.weights)) expect(weights[0]!.textContent).toContain(w.toFixed(2));
  });

  it('shows local distance in miles and none for online', () => {
    expect(item(response.local[0]!).querySelector('.distance')!.textContent).toContain('2.0 mi');
    expect(item(response.online[0]!).querySelector('.distance')).toBeNull();
    expect(formatDistance(11.5)).toBe('7.1 mi');
    expect(formatDistance(20)).toBe('12 mi');
  });

  it('keeps every link relative or absolute http(s), and hardened', () => {
    const links = [...root.querySelectorAll<HTMLAnchorElement>('a[href]')];
    expect(links.length).toBeGreaterThan(0);
    for (const a of links) {
      const href = a.getAttribute('href')!;
      expect(href.startsWith('/'), href).toBe(false);
      if (/^https?:/.test(href)) expect(a.rel).toBe('noopener noreferrer');
      // Sanity only: the proxy owns the blocklist; the fixture must never carry one.
      expect(href).not.toMatch(/amazon\.|amzn\.|\/\/a\.co\b|zappos\.|wholefoodsmarket\./i);
    }
  });

  it('treats response strings as text, never markup or script URLs', () => {
    const hostile = '<img src=x onerror=alert(1)>';
    const evil: SearchResult = {
      ...response.local[1]!,
      retailer: { name: hostile, domain: 'x.example', url: 'javascript:alert(1)' },
      snippet: hostile,
      matched_product: hostile,
      certifications: [{ kind: 'b_corp', label: hostile, source_url: 'javascript:alert(1)', checked: '2026-09-23' }],
      signals: [{ ...response.local[1]!.signals[0]!, claim: hostile, source_url: 'javascript:alert(1)' }],
      components: response.local[1]!.components.map((c) => ({
        ...c,
        sources: c.sources.map(() => ({ label: hostile, url: 'javascript:alert(1)' })),
      })),
    };
    const li = renderResult(evil, config);
    expect(li.querySelector('img')).toBeNull();
    expect(li.querySelector('a[href^="javascript"]')).toBeNull();
    expect(li.textContent).toContain(hostile);
  });
});

describe('renderFooter', () => {
  it('shows brave calls, tokens, and estimated cost', () => {
    const el = document.createElement('span');
    el.hidden = true;
    renderFooter(el, response.usage);
    expect(el.hidden).toBe(false);
    expect(el.textContent).toContain('4 web lookups');
    expect(el.textContent).toContain('2,920 model tokens');
    expect(el.textContent).toContain('$0.020');
  });
});

describe('renderStatus', () => {
  it('uses the rate-limit wording', () => {
    const el = document.createElement('p');
    renderStatus(el, { kind: 'rate_limited' });
    expect(el.textContent).toBe('Too many searches from this connection. Try again in about a minute.');
  });

  it('names the place being searched', () => {
    const el = document.createElement('p');
    renderStatus(el, { kind: 'searching', city: 'Cambridge', state: 'MA' });
    expect(el.textContent).toContain('Cambridge, MA');
  });
});

describe('section notes', () => {
  it('explains an empty section instead of hiding it', () => {
    const el = document.createElement('div');
    renderResults({ ...response, local: [] }, el, config);
    const near = el.querySelector<HTMLElement>('[data-section="near"]')!;
    expect(near.hidden).toBe(false);
    expect(near.querySelector('.section-note')!.textContent).toBe('No shops nearby matched. Online results are below.');
  });

  it('names the nearby radius when no shop is within it', () => {
    const el = document.createElement('div');
    const far = { ...response.local[0]!, rank: 1, distance_km: 40 };
    renderResults({ ...response, query: { ...response.query, near_radius_mi: 10 }, local: [], local_farther: [far] }, el, config);
    const near = el.querySelector<HTMLElement>('[data-section="near"]')!;
    expect(near.querySelector('.section-note')!.textContent).toBe('No shops within 10 mi matched. Farther shops are below.');
  });

  it('lists farther shops under their own heading inside the nearby section, counted as visible', () => {
    const el = document.createElement('div');
    const far = [{ ...response.local[0]!, id: 'far1', rank: 3, distance_km: 24.1 }, { ...response.local[1]!, id: 'far2', rank: 4, distance_km: 72.4 }];
    const shown = renderResults({ ...response, local_farther: far }, el, config);
    const group = el.querySelector<HTMLElement>('[data-section="near"] [data-farther]')!;
    expect(group.querySelector('h3')!.textContent).toBe('Farther away');
    expect(group.querySelector('.section-note')!.textContent).toBe('2 shops, 15 to 45 mi away');
    expect([...group.querySelectorAll('.rank')].map((r) => r.textContent)).toEqual(['3', '4']);
    expect(shown).toBe(response.local.length + response.online.length + 2);
  });

  it('shows no farther heading when there are no farther shops', () => {
    expect(root.querySelector('[data-farther]')).toBeNull();
  });

  it('hides a section the view turns off and reports what is visible', () => {
    const el = document.createElement('div');
    const shown = renderResults(response, el, config, { sort: 'score', near: false, online: true, certifiedOnly: true });
    expect(el.querySelector<HTMLElement>('[data-section="near"]')!.hidden).toBe(true);
    expect(shown).toBe(1);
  });
});

describe('"Why this rank" on a fine hover pointer', () => {
  let el: HTMLElement;
  const whys = () => [...el.querySelectorAll<HTMLDetailsElement>('details[data-why]')];

  beforeEach(() => {
    vi.stubGlobal('matchMedia', () => ({ matches: true }));
    el = document.createElement('div');
    document.body.append(el);
    renderResults(response, el, config);
  });
  afterEach(() => vi.unstubAllGlobals());

  it('closes on Escape from inside the panel and leaves focus on the summary', () => {
    const d = whys()[0]!;
    const link = d.querySelector<HTMLAnchorElement>('.why-help a')!;
    link.focus();
    expect(d.open).toBe(true);
    link.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    expect(d.open).toBe(false);
    expect(document.activeElement).toBe(d.querySelector('summary'));
  });

  it('closes a pinned panel on an outside click, with no listener left from an earlier render', () => {
    const old = whys()[0]!;
    old.querySelector('summary')!.click();
    expect(old.dataset.pinned).toBe('1');

    renderResults(response, el, config);
    const d = whys()[0]!;
    d.querySelector('summary')!.click();
    expect(d.open).toBe(true);
    document.body.click();
    expect(d.open).toBe(false);
    expect(d.dataset.pinned).toBeUndefined();
    // The first render's document listener would have unpinned this one.
    expect(old.dataset.pinned).toBe('1');
  });

  it('stays pinned when a click on panel text sends focus to the body', () => {
    const d = whys()[0]!;
    d.dispatchEvent(new MouseEvent('mouseenter'));
    d.querySelector('summary')!.click();
    d.dispatchEvent(new FocusEvent('focusout', { relatedTarget: null }));
    expect(d.open).toBe(true);

    d.dispatchEvent(new MouseEvent('mouseleave'));
    d.dispatchEvent(new FocusEvent('focusout', { relatedTarget: null }));
    expect(d.open).toBe(false);
  });
});

describe('map of nearby shops', () => {
  const draw = vi.fn();
  const mapConfig = { ...config, onMap: draw };
  let el: HTMLElement;
  beforeEach(() => {
    draw.mockClear();
    el = document.createElement('div');
  });
  const farther = { ...response.local[0]!, id: 'local:far:9', rank: 3, retailer: { ...response.local[0]!.retailer, name: 'Far Shop' }, lat: 40.5, lon: -89.1 };

  it('puts one map between the Near you note and its list, pinning shown shops by rank', () => {
    renderResults({ ...response, local_farther: [farther] }, el, mapConfig);
    const near = el.querySelector('[data-section="near"]')!;
    const map = near.querySelector<HTMLElement>('[data-map]')!;
    expect(map.previousElementSibling!.className).toBe('section-note');
    expect(map.nextElementSibling!.tagName).toBe('OL');
    expect(map.getAttribute('aria-label')).toBe('Map of the shops listed near you');
    expect(draw).toHaveBeenCalledTimes(1);
    expect(draw.mock.calls[0]![0]).toBe(map);
    expect(draw.mock.calls[0]![1]).toEqual([
      ...response.local.map((r) => ({ rank: r.rank, name: r.retailer.name, lat: r.lat, lon: r.lon, farther: false, target: `shop-${r.rank}` })),
      { rank: 3, name: 'Far Shop', lat: 40.5, lon: -89.1, farther: true, target: 'shop-3' },
    ]);
    // Each pin's target is its shop's list item; online results need none.
    for (const pin of draw.mock.calls[0]![1] as { rank: number; target: string }[]) {
      expect(el.querySelector(`#${pin.target} .rank`)!.textContent).toBe(String(pin.rank));
    }
    expect(el.querySelectorAll('[data-section="online"] [data-result][id]')).toHaveLength(0);
  });

  it('leaves out shops without coordinates and filtered shops, and draws no map when none remain', () => {
    const [first, second] = response.local;
    const noCoords = { ...response, local: [first!, { ...second!, lat: null, lon: null }] };
    renderResults(noCoords, el, mapConfig);
    expect(draw.mock.calls[0]![1].map((p: { name: string }) => p.name)).toEqual([first!.retailer.name]);

    // Only the first shop is certified, so the filter must take the second, pinnable shop off the map.
    draw.mockClear();
    expect(second!.certifications).toEqual([]);
    renderResults(response, el, mapConfig, { ...defaultView, certifiedOnly: true });
    expect(draw.mock.calls[0]![1].map((p: { name: string }) => p.name)).toEqual([first!.retailer.name]);

    // A Worker deployed before shops carried coordinates omits the fields entirely.
    draw.mockClear();
    const old: Partial<SearchResult> = { ...second! };
    delete old.lat;
    delete old.lon;
    renderResults({ ...response, local: [first!, old as SearchResult] }, el, mapConfig);
    expect(draw.mock.calls[0]![1].map((p: { name: string }) => p.name)).toEqual([first!.retailer.name]);

    draw.mockClear();
    renderResults({ ...response, local: response.local.map((r) => ({ ...r, lat: null, lon: null })) }, el, mapConfig);
    expect(el.querySelector('[data-map]')).toBeNull();
    expect(draw).not.toHaveBeenCalled();
  });

  it('draws no map while the Near you section is switched off', () => {
    renderResults(response, el, mapConfig, { ...defaultView, near: false });
    expect(draw).not.toHaveBeenCalled();
  });

  it('hands the map a container that is already in the page', () => {
    document.body.append(el);
    let attached = false;
    renderResults(response, el, { ...config, onMap: (container) => { attached = container.isConnected; } });
    expect(attached).toBe(true);
  });

  it('pins no shop whose coordinates are not finite numbers', () => {
    const [first, second] = response.local;
    renderResults({ ...response, local: [first!, { ...second!, lat: Number.NaN }] }, el, mapConfig);
    expect(draw.mock.calls[0]![1]).toHaveLength(1);
  });

  it('reports a render without a map, so the page can drop the old one', () => {
    const noMap = vi.fn();
    renderResults(response, el, { ...config, onMap: draw, onNoMap: noMap }, { ...defaultView, near: false });
    expect(noMap).toHaveBeenCalledTimes(1);
    noMap.mockClear();
    renderResults(response, el, { ...config, onMap: draw, onNoMap: noMap });
    expect(noMap).not.toHaveBeenCalled();
  });
});
