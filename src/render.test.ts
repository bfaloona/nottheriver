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

  it('lists every non-zero component with its contribution and one link per source', () => {
    for (const result of all) {
      const li = item(result);
      for (const c of result.components) {
        const row = li.querySelector(`[data-component="${c.name}"]`);
        if (c.value === 0) {
          expect(row, `${result.id} ${c.name}`).toBeNull();
          continue;
        }
        expect(row, `${result.id} ${c.name}`).not.toBeNull();
        expect(row!.querySelector('.component-math')!.textContent).toContain(`${c.weight.toFixed(2)} × ${c.value.toFixed(2)}`);
        expect(row!.querySelector('[data-component-value]')!.textContent).toBe(c.contribution.toFixed(3));
        expect(c.sources.length, `${result.id} ${c.name}`).toBeGreaterThanOrEqual(1);
        const links = [...row!.querySelectorAll<HTMLAnchorElement>('a[data-component-source]')];
        expect(links.map((a) => a.getAttribute('href'))).toEqual(c.sources.map((s) => s.url));
      }
      expect(li.querySelector('[data-why] summary')!.textContent).toBe('Why this rank');
      expect(li.querySelector('.why-total')!.textContent).toContain(result.score.toFixed(3));
    }
  });

  it('omits the zero env component of the second local result', () => {
    const second = response.local[1]!;
    expect(second.components.find((c) => c.name === 'env')!.value).toBe(0);
    expect(item(second).querySelector('[data-component="env"]')).toBeNull();
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
    const link = d.querySelector<HTMLAnchorElement>('a[data-component-source]')!;
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
