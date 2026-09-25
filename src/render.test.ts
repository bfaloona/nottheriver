// @vitest-environment happy-dom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { SearchResponse, SearchResult } from '../proxy/src/contract';
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
    expect(rows(judged(1, 'Model judgment: likely sells it'))).toEqual(["Likely (model's judgment)", 'B Corp', 'Nothing found', 'Unknown']);
    expect(rows(judged(0.5, 'Model judgment: may sell it'))[0]).toBe("Maybe (model's judgment)");
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

  it('shows a negative signal with its kind, source link, and a dispute link', () => {
    const second = response.local[1]!;
    const signal = second.signals[0]!;
    const row = item(second).querySelector('[data-negative]')!;
    expect(row.textContent).toContain('Labor');
    expect(row.textContent).toContain(signal.claim);
    const source = row.querySelector<HTMLAnchorElement>('a.negative-source')!;
    expect(source.getAttribute('href')).toBe(signal.source_url);
    expect(source.textContent).toContain('osha.gov');
    expect(row.querySelector('[data-dispute]')!.getAttribute('href')).toBe('about.html#dispute');
  });

  it('points the dispute link at the issue template when a repo URL is set', () => {
    const repo = 'https://github.com/example/example';
    const li = renderResult(response.local[1]!, { disputeUrl: disputeUrlFor(repo) });
    expect(li.querySelector('[data-dispute]')!.getAttribute('href')).toBe(
      `${repo}/issues/new?template=dispute-a-ranking.md`,
    );
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
      ...response.local.map((r) => ({ rank: r.rank, name: r.retailer.name, lat: r.lat, lon: r.lon, farther: false })),
      { rank: 3, name: 'Far Shop', lat: 40.5, lon: -89.1, farther: true },
    ]);
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
