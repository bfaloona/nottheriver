// @vitest-environment happy-dom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { SearchResponse, SearchResult, Signal } from '../proxy/src/contract';
import fixture from '../tests/fixtures/search-response.json';
import { disputeUrlFor } from './config';
import { defaultView } from './controls';
import { ideasFor } from './ideas';
import { formatDistance, removeMap, renderFooter, renderIdeas, renderMap, renderResult, renderResults, renderStatus, type Shown } from './render';

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
      expect(li.textContent).not.toContain('Why this rank');
      expect(li.querySelector('.why-total')!.textContent).toBe(`Score ${result.score.toFixed(2)}`);
      expect(whyRows(result).map(([name]) => name)).toEqual(['Sells it', 'Ethics', 'Environment', 'Distance']);
      expect(li.querySelector('.component-math'), 'no weight × value math').toBeNull();
    }
  });

  const nameOf = (li: Element) => li.querySelector<HTMLButtonElement>('[data-why] button[data-retailer]')!;
  const panelOf = (li: Element) => li.querySelector<HTMLElement>('[data-why] .why-panel')!;

  it('makes the shop name the button for its rank panel, closed until asked for', () => {
    for (const result of all) {
      const li = item(result);
      const name = nameOf(li);
      expect(name.type).toBe('button');
      expect(name.textContent).toBe(result.retailer.name);
      // The words are no longer on screen, so the button's label carries them.
      expect(name.getAttribute('aria-label')).toBe(`${result.retailer.name}: why this rank`);
      expect(name.getAttribute('aria-expanded')).toBe('false');
      expect(name.getAttribute('aria-controls')).toBe(panelOf(li).id);
      expect(panelOf(li).hidden).toBe(true);
    }
    const ids = [...root.querySelectorAll('.why-panel')].map((panel) => panel.id);
    expect(new Set(ids).size, 'nearby and online ranks both start at 1').toBe(all.length);
  });

  it('links to the shop from an icon beside its name', () => {
    for (const result of all) {
      const li = item(result);
      const visit = li.querySelector<HTMLAnchorElement>('[data-why] a[data-visit]')!;
      expect(visit.previousElementSibling).toBe(nameOf(li));
      expect(visit.getAttribute('href')).toBe(result.retailer.url);
      expect(visit.getAttribute('aria-label')).toBe(`Visit ${result.retailer.name}`);
      expect(visit.target).toBe('_blank');
      expect(visit.textContent).toBe('');
      expect(visit.querySelector('svg')!.getAttribute('aria-hidden')).toBe('true');
      expect(li.querySelectorAll(`a[href="${result.retailer.url}"]`), 'one link to the shop').toHaveLength(1);
    }
  });

  it('shows no shop link when the address is not one a browser should follow', () => {
    const li = renderResult({ ...response.local[0]!, retailer: { ...response.local[0]!.retailer, url: 'javascript:alert(1)' } }, config);
    expect(li.querySelector('[data-visit]')).toBeNull();
    expect(nameOf(li).textContent).toBe(response.local[0]!.retailer.name);
  });

  it('opens and closes the panel in place on a press of the name where there is no hover pointer', () => {
    // happy-dom answers yes to the hover query, so a touch screen has to be stated.
    vi.stubGlobal('matchMedia', () => ({ matches: false }));
    renderResults(response, root, config);
    vi.unstubAllGlobals();
    const li = item(response.local[0]!);
    nameOf(li).click();
    expect(panelOf(li).hidden).toBe(false);
    expect(nameOf(li).getAttribute('aria-expanded')).toBe('true');
    // In place, the panel is part of the page: a tap elsewhere must not collapse it and move the list.
    document.body.click();
    expect(panelOf(li).hidden).toBe(false);
    nameOf(li).click();
    expect(panelOf(li).hidden).toBe(true);
    expect(nameOf(li).getAttribute('aria-expanded')).toBe('false');
  });

  describe('through a sort or filter change, where panels open in place', () => {
    const byName = { ...defaultView, sort: 'name' as const };
    const openPanels = () => [...root.querySelectorAll<HTMLElement>('.why-panel')].filter((p) => !p.hidden);
    beforeEach(() => {
      // happy-dom answers yes to the hover query. There a panel floats, and the click or Tab
      // that reaches a control has already closed it.
      vi.stubGlobal('matchMedia', () => ({ matches: false }));
      renderResults(response, root, config);
    });
    afterEach(() => vi.unstubAllGlobals());

    it('keeps an opened rank panel open, and one more press still closes it', () => {
      const shop = response.local[1]!;
      nameOf(item(shop)).click();
      renderResults(response, root, config, byName);
      const li = item(shop);
      expect(openPanels()).toEqual([panelOf(li)]);
      expect(nameOf(li).getAttribute('aria-expanded')).toBe('true');
      nameOf(li).click();
      expect(panelOf(li).hidden).toBe(true);
      expect(nameOf(li).getAttribute('aria-expanded')).toBe('false');
    });

    it('keeps the online panel of a rank apart from the nearby one', () => {
      nameOf(item(response.online[0]!)).click();
      renderResults(response, root, config, byName);
      expect(openPanels()).toEqual([panelOf(item(response.online[0]!))]);
    });

    it('opens nothing for a new search, whose shops only share rank numbers with the last one', () => {
      nameOf(item(response.local[0]!)).click();
      renderResults({ ...response }, root, config);
      expect(openPanels()).toEqual([]);
    });

    it('keeps an opened list of concerns open', () => {
      const finding = (i: number): Signal => ({
        kind: 'labor',
        polarity: 'negative',
        claim: `Finding ${i}`,
        source_url: `https://example-source.gov/${i}`,
        origin: 'curated',
        action_date: `202${i}-01-01`,
      });
      const shop: SearchResult = { ...response.local[1]!, signals: [finding(1), finding(2)] };
      const withConcerns = { ...response, local: [response.local[0]!, shop] };
      const concerns = () => item(shop).querySelector<HTMLDetailsElement>('[data-concerns]')!;
      renderResults(withConcerns, root, config);
      concerns().open = true;
      renderResults(withConcerns, root, config, byName);
      expect(concerns().open).toBe(true);
      expect(root.querySelectorAll('details[open]')).toHaveLength(1);
    });

    it('keeps the shop a map pin picked marked', () => {
      const shop = response.local[1]!;
      item(shop).classList.add('result-picked');
      renderResults(response, root, config, byName);
      expect([...root.querySelectorAll('.result-picked')]).toEqual([item(shop)]);
    });
  });

  it('leaves the panel closed when the name only takes focus, as it does after a map pin click', () => {
    const li = item(response.local[0]!);
    nameOf(li).focus();
    expect(document.activeElement).toBe(nameOf(li));
    expect(panelOf(li).hidden).toBe(true);
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

  it('names certifications and concerns, and says unknown when it holds neither', () => {
    const [first, second] = response.local;
    expect(whyRows(first!)).toEqual([
      ['Sells it', 'Product named in listing'],
      ['Ethics', 'B Corp'],
      ['Environment', 'Unknown'],
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
    expect(rows(judged(1, 'Model judgment: likely sells it'))).toEqual(['Likely, by shop type', 'B Corp', 'Unknown', 'Unknown']);
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

  it('shows the chain badge as a neutral badge linking to its source', () => {
    const chainResult = response.online[1]!;
    const badge = item(chainResult).querySelector<HTMLAnchorElement>('.badge-neutral')!;
    expect(badge.textContent).toBe(chainResult.chain!.label);
    expect(badge.getAttribute('href')).toBe(chainResult.chain!.source_url);
    expect(badge.classList.contains('badge')).toBe(true);
  });

  it('renders the badges list for a chain even with no certifications', () => {
    const chainResult = response.online[1]!;
    expect(chainResult.certifications).toHaveLength(0);
    expect(item(chainResult).querySelectorAll('.badges li')).toHaveLength(1);
  });

  it('shows no badges list when a result has neither certifications nor a chain', () => {
    const plain = response.local[1]!;
    expect(plain.certifications).toHaveLength(0);
    expect(plain.chain).toBeUndefined();
    expect(item(plain).querySelector('.badges')).toBeNull();
  });

  const recordLine = (result: SearchResult) => renderResult(result, config).querySelector('[data-record]');

  it('says "unknown" on a result with no certification or finding, and only there', () => {
    const [certified, withConcern] = response.local;
    const [alsoCertified, chainOnly] = response.online;
    // A chain badge is a fact about the domain, not about how the shop treats people or the planet.
    expect(chainOnly!.chain).toBeDefined();
    expect(recordLine(chainOnly!)!.textContent).toBe('People and planet: unknown');
    for (const result of [certified!, withConcern!, alsoCertified!]) expect(recordLine(result), result.id).toBeNull();
    const positive: Signal = { kind: 'labor', polarity: 'positive', claim: 'Named a best employer', source_url: 'https://example.org/a', origin: 'llm', action_date: null };
    expect(recordLine({ ...chainOnly!, signals: [positive] })).toBeNull();
  });

  it('still says "unknown" beside a membership badge that does not score', () => {
    const base = response.online[1]!;
    const member: SearchResult = {
      ...base,
      certifications: [{ kind: 'independent_retailer_assoc', label: 'Independent retailer association member', source_url: 'https://example.org/members', checked: '2026-01-01' }],
    };
    const li = renderResult(member, config);
    expect(li.querySelector('.badge')!.textContent).toBe('Independent retailer association member');
    expect(li.querySelector('[data-record]')!.textContent).toBe('People and planet: unknown');
    const el = document.createElement('div');
    renderResults({ ...response, local: [], online: [member] }, el, config);
    expect(el.querySelector('[data-unknown-toggle]'), 'an unknown shop on screen brings the explanation').not.toBeNull();
  });

  it('keeps the "unknown" line free of links, and the panel in agreement with it', () => {
    for (const result of all) {
      const li = renderResult(result, config);
      const line = li.querySelector('[data-record]');
      if (!line) continue;
      expect(line.querySelector('a')).toBeNull();
      const panel = [...li.querySelectorAll('[data-component="ethics"] .component-text, [data-component="env"] .component-text')];
      expect(panel.map((row) => row.textContent)).toEqual(['Unknown', 'Unknown']);
    }
  });

  const unknownToggle = (el: ParentNode = root) => el.querySelector<HTMLButtonElement>('[data-unknown-toggle]');
  const unknownHelp = (el: ParentNode = root) => el.querySelector<HTMLElement>('[data-unknown-help]');

  it('puts one help line below the lists: the ranking link, then "What unknown means"', () => {
    const lines = root.querySelectorAll('[data-results-help]');
    expect(lines).toHaveLength(1);
    expect(lines[0]!.previousElementSibling).toBe(root.querySelector('section:last-of-type'));
    const [link, button] = [...lines[0]!.children];
    expect(link!.textContent).toBe('How ranking works');
    expect(link!.getAttribute('href')).toBe('about.html#ranking');
    expect(button).toBe(unknownToggle());
    expect(button!.textContent).toBe('What unknown means');
  });

  it('shows neither the weights nor a count of records with the lists', () => {
    expect(root.textContent).not.toContain('Ranked by');
    expect(root.textContent).not.toContain('people-and-planet record');
    for (const w of new Set(Object.values(response.weights))) expect(root.textContent).not.toContain(w.toFixed(2));
  });

  it('keeps the explanation of "unknown" on the page, closed until asked for', () => {
    const button = unknownToggle()!;
    const help = unknownHelp()!;
    expect(help.textContent).toBe(
      "Unknown means our lists hold no certification that counts toward a shop's score and this search found nothing about it: we have not looked further yet, or were blocked from looking.",
    );
    expect(help.hidden).toBe(true);
    expect(button.getAttribute('aria-expanded')).toBe('false');
    expect(button.getAttribute('aria-controls')).toBe(help.id);

    // A button, not a link to the About page: the explanation opens in place and the results stay.
    button.click();
    expect(help.hidden).toBe(false);
    expect(button.getAttribute('aria-expanded')).toBe('true');
    button.click();
    expect(help.hidden).toBe(true);
    expect(button.getAttribute('aria-expanded')).toBe('false');
  });

  it('leaves the explanation open across a re-render, such as a change of sort', () => {
    unknownToggle()!.click();
    renderResults(response, root, config, { ...defaultView, sort: 'name' });
    expect(unknownHelp()!.hidden).toBe(false);
    expect(unknownToggle()!.getAttribute('aria-expanded')).toBe('true');
  });

  it('drops the explanation when no shop on screen is unknown, and keeps the ranking link', () => {
    const el = document.createElement('div');
    renderResults(response, el, config, { ...defaultView, certifiedOnly: true });
    expect(unknownToggle(el)).toBeNull();
    expect(unknownHelp(el)).toBeNull();
    expect(el.querySelector('[data-results-help] a')!.textContent).toBe('How ranking works');
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

  const facts = (result: SearchResult) => renderResult(result, config).querySelector('[data-facts]')!.textContent;

  it('gives each shop one facts line: the sells-it reading, then where it is, then "unknown" when it has no record', () => {
    const [certified, withConcern] = response.local;
    const [onlineCertified, chainOnly] = response.online;
    expect(facts(certified!)).toBe('Sells it: product named in listing · 2.0 mi, 12 Main St, Springfield, IL 62701');
    expect(facts(withConcern!)).toBe('Sells it: product named in listing · 7.1 mi, 300 Oak Ave, Springfield, IL 62702');
    expect(facts(onlineCertified!)).toBe('Sells it: product named in listing');
    expect(facts(chainOnly!)).toBe('Sells it: category named in listing · People and planet: unknown');
    for (const result of all) expect(renderResult(result, config).querySelectorAll('[data-facts]'), result.id).toHaveLength(1);
  });

  it('puts a nearby shop with no record, and one with no known distance, on the same line', () => {
    const base = response.local[1]!;
    const noRecord: SearchResult = { ...base, signals: [], components: base.components.map((c) => (c.name === 'ethics' ? { ...c, sources: [] } : c)) };
    expect(facts(noRecord)).toBe('Sells it: product named in listing · 7.1 mi, 300 Oak Ave, Springfield, IL 62702 · People and planet: unknown');
    expect(facts({ ...noRecord, address: null })).toBe('Sells it: product named in listing · 7.1 mi · People and planet: unknown');
    expect(facts({ ...noRecord, distance_km: null })).toBe('Sells it: product named in listing · People and planet: unknown');
  });

  it('words the facts line as the panel words "Sells it", and drops the "Matched" line', () => {
    for (const result of all) {
      const li = renderResult(result, config);
      const panel = li.querySelector('[data-component="relevance"] .component-text')!.textContent;
      expect(li.querySelector('[data-sells]')!.textContent!.toLowerCase(), result.id).toBe(`sells it: ${panel.toLowerCase()}`);
      expect(li.textContent, result.id).not.toContain('Matched:');
    }
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

  const all3 = { near: true, online: true, certifiedOnly: false };
  const doneText = (shown: Partial<Shown>, view: Partial<typeof all3> = {}) => {
    const el = document.createElement('p');
    const counts = { near: 0, withinKm: null, farther: 0, online: 0, ...shown };
    renderStatus(el, { kind: 'done', shown: { ...counts, total: counts.near + counts.farther + counts.online }, view: { ...all3, ...view } });
    return el;
  };

  it('counts the nearby shops with the distance they fall within, and the online ones', () => {
    expect(doneText({ near: 10, withinKm: 9.66, online: 8 }).textContent).toBe('Found 10 shops within 6.0 mi and 8 online.');
    expect(doneText({ near: 1, withinKm: 3.2, online: 1 }).textContent).toBe('Found 1 shop within 2.0 mi and 1 online.');
  });

  it('says "near you" when no nearby shop has a known distance', () => {
    expect(doneText({ near: 3, online: 2 }).textContent).toBe('Found 3 shops near you and 2 online.');
  });

  it('counts farther shops apart from the nearby ones', () => {
    expect(doneText({ near: 2, withinKm: 11.5, farther: 3, online: 4 }).textContent).toBe('Found 2 shops within 7.1 mi, 3 farther away and 4 online.');
    expect(doneText({ farther: 1, online: 4 }).textContent).toBe('Found 1 shop farther away and 4 online.');
    expect(doneText({ farther: 2 }).textContent).toBe('Found 2 shops farther away and none online.');
  });

  it('says so when a side found nothing', () => {
    expect(doneText({ online: 4 }).textContent).toBe('Found no shops near you and 4 online.');
    expect(doneText({ near: 2, withinKm: 11.5 }).textContent).toBe('Found 2 shops within 7.1 mi and none online.');
  });

  it('says "Showing" and leaves out a switched-off section while a filter is on', () => {
    expect(doneText({ online: 8 }, { near: false }).textContent).toBe('Showing 8 online shops.');
    expect(doneText({ online: 1 }, { near: false }).querySelector('a')!.textContent).toBe('1 online shop');
    expect(doneText({ near: 2, withinKm: 11.5 }, { online: false }).textContent).toBe('Showing 2 shops within 7.1 mi.');
    expect(doneText({ near: 1, withinKm: 3.2, online: 1 }, { certifiedOnly: true }).textContent).toBe('Showing 1 shop within 2.0 mi and 1 online.');
    expect(doneText({ online: 1 }, { certifiedOnly: true }).textContent).toBe('Showing no shops near you and 1 online.');
  });

  it('links the online count to the Online section, and only while that section has rows to jump to', () => {
    const link = doneText({ near: 3, withinKm: 5, online: 10 }).querySelector('a')!;
    expect(link.textContent).toBe('10 online');
    expect(link.getAttribute('href')).toBe('#online-heading');
    expect(doneText({ near: 1, withinKm: 5 }).querySelector('a')).toBeNull();
  });

  it('points the jump link at the id the Online heading carries', () => {
    expect(root.querySelector('[data-section="online"] h2')!.id).toBe('online-heading');
  });

  it('names the place being searched', () => {
    const el = document.createElement('p');
    renderStatus(el, { kind: 'searching', city: 'Cambridge', state: 'MA' });
    expect(el.textContent).toContain('Cambridge, MA');
  });
});

describe('section notes', () => {
  it('leaves the count to the count line when a section has shops on screen', () => {
    expect(root.querySelector('[data-section="near"] > .section-note')).toBeNull();
    expect(root.querySelector('[data-section="online"] > .section-note')).toBeNull();
  });

  it('reports what is on screen: nearby shops with their farthest distance, farther ones and online', () => {
    const el = document.createElement('div');
    expect(renderResults(response, el, config)).toEqual({ near: 2, withinKm: 11.5, farther: 0, online: 2, total: 4 });
    const far = { ...response.local[0]!, id: 'far1', rank: 3, distance_km: 72.4 };
    expect(renderResults({ ...response, local: [], local_farther: [far] }, el, config)).toEqual({ near: 0, withinKm: null, farther: 1, online: 2, total: 3 });
    // "Within 7.1 mi" would be a claim about a shop whose distance is not known.
    const oneUnplaced = [response.local[0]!, { ...response.local[1]!, distance_km: null }];
    expect(renderResults({ ...response, local: oneUnplaced }, el, config).withinKm).toBeNull();
  });

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
    expect(shown.total).toBe(response.local.length + response.online.length + 2);
  });

  it('shows no farther heading when there are no farther shops', () => {
    expect(root.querySelector('[data-farther]')).toBeNull();
  });

  it('hides a section the view turns off and reports what is visible', () => {
    const el = document.createElement('div');
    const shown = renderResults(response, el, config, { sort: 'score', near: false, online: true, certifiedOnly: true });
    expect(el.querySelector<HTMLElement>('[data-section="near"]')!.hidden).toBe(true);
    expect(shown).toEqual({ near: 0, withinKm: null, farther: 0, online: 1, total: 1 });
  });
});

describe('the rank panel on a fine hover pointer', () => {
  let el: HTMLElement;
  const whys = () => [...el.querySelectorAll<HTMLElement>('[data-why]')];
  const name = (why: HTMLElement) => why.querySelector<HTMLButtonElement>('[data-retailer]')!;
  const isOpen = (why: HTMLElement) => !why.querySelector<HTMLElement>('.why-panel')!.hidden;
  const visit = (why: HTMLElement) => why.querySelector<HTMLAnchorElement>('[data-visit]')!;
  const panel = (why: HTMLElement) => why.querySelector<HTMLElement>('.why-panel')!;
  const REST_MS = 250;
  // The pointer crossing into the wrapper, and then onto one thing inside it.
  const enter = (why: HTMLElement) => why.dispatchEvent(new MouseEvent('mouseenter'));
  const over = (target: Element) => target.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));

  beforeEach(() => {
    vi.useFakeTimers();
    vi.stubGlobal('matchMedia', () => ({ matches: true }));
    el = document.createElement('div');
    document.body.append(el);
    renderResults(response, el, config);
  });
  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it('opens once the pointer rests on the name, and closes when it leaves', () => {
    const why = whys()[0]!;
    enter(why);
    over(name(why));
    vi.advanceTimersByTime(REST_MS - 1);
    expect(isOpen(why)).toBe(false);
    vi.advanceTimersByTime(1);
    expect(isOpen(why)).toBe(true);
    expect(name(why).getAttribute('aria-expanded')).toBe('true');
    why.dispatchEvent(new MouseEvent('mouseleave'));
    expect(isOpen(why)).toBe(false);
  });

  it('stays closed when the pointer only passes over the name', () => {
    const why = whys()[0]!;
    enter(why);
    over(name(why));
    vi.advanceTimersByTime(REST_MS - 1);
    why.dispatchEvent(new MouseEvent('mouseleave'));
    vi.advanceTimersByTime(REST_MS);
    expect(isOpen(why)).toBe(false);
  });

  it('stays closed while the pointer rests on the shop link', () => {
    const why = whys()[0]!;
    enter(why);
    // The pointer lands on the drawing inside the link.
    over(visit(why).querySelector('svg')!);
    vi.advanceTimersByTime(REST_MS * 2);
    expect(isOpen(why)).toBe(false);
  });

  it('closes when the pointer moves from the name to the shop link, and opens again back on the name', () => {
    const why = whys()[0]!;
    enter(why);
    over(name(why));
    vi.advanceTimersByTime(REST_MS);
    expect(isOpen(why)).toBe(true);
    over(visit(why));
    expect(isOpen(why)).toBe(false);
    over(name(why));
    vi.advanceTimersByTime(REST_MS);
    expect(isOpen(why)).toBe(true);
  });

  it('opens nothing when the pointer crosses the name on its way to the shop link', () => {
    const why = whys()[0]!;
    enter(why);
    over(name(why));
    vi.advanceTimersByTime(REST_MS - 1);
    over(visit(why));
    vi.advanceTimersByTime(REST_MS);
    expect(isOpen(why)).toBe(false);
  });

  it('stays open while the pointer moves from the name into the panel', () => {
    const why = whys()[0]!;
    enter(why);
    over(name(why));
    vi.advanceTimersByTime(REST_MS);
    over(why.querySelector('.result-head')!);
    over(panel(why).querySelector('.why-help a')!);
    vi.advanceTimersByTime(REST_MS);
    expect(isOpen(why)).toBe(true);
  });

  it('leaves a panel pressed shut closed when the pointer drifts off the name beside it', () => {
    const why = whys()[0]!;
    enter(why);
    over(name(why));
    name(why).click();
    name(why).click();
    over(why.querySelector('.result-head')!);
    vi.advanceTimersByTime(REST_MS);
    expect(isOpen(why)).toBe(false);
  });

  it('keeps a pinned panel open with the pointer on the shop link', () => {
    const why = whys()[0]!;
    enter(why);
    over(name(why));
    name(why).click();
    over(visit(why));
    expect(isOpen(why)).toBe(true);
  });

  it('stays closed on focus alone, and opens on a press', () => {
    const why = whys()[0]!;
    name(why).focus();
    vi.advanceTimersByTime(REST_MS);
    expect(isOpen(why)).toBe(false);
    name(why).click();
    expect(isOpen(why)).toBe(true);
    expect(why.dataset.pinned).toBe('1');
  });

  it('keeps a pinned panel open when the pointer leaves, until the name is pressed again', () => {
    const why = whys()[0]!;
    enter(why);
    over(name(why));
    name(why).click();
    why.dispatchEvent(new MouseEvent('mouseleave'));
    expect(isOpen(why)).toBe(true);
    name(why).click();
    expect(isOpen(why)).toBe(false);
    expect(why.dataset.pinned).toBeUndefined();
  });

  it('closes on Escape from inside the panel and leaves focus on the name', () => {
    const why = whys()[0]!;
    name(why).click();
    const link = why.querySelector<HTMLAnchorElement>('.why-help a')!;
    link.focus();
    link.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    expect(isOpen(why)).toBe(false);
    expect(document.activeElement).toBe(name(why));
  });

  it('closes on Escape wherever focus is, since the pointer alone can open it', () => {
    const why = whys()[0]!;
    enter(why);
    over(name(why));
    vi.advanceTimersByTime(REST_MS);
    expect(isOpen(why)).toBe(true);
    document.body.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    expect(isOpen(why)).toBe(false);
    // Focus was not in the panel, so it is not pulled there.
    expect(document.activeElement).not.toBe(name(why));
  });

  it('stays closed when the name is pressed open and shut before the pointer has rested', () => {
    const why = whys()[0]!;
    enter(why);
    over(name(why));
    name(why).click();
    name(why).click();
    vi.advanceTimersByTime(REST_MS);
    expect(isOpen(why)).toBe(false);
    expect(name(why).getAttribute('aria-expanded')).toBe('false');
  });

  it('closes when focus leaves the name, the shop link and the panel', () => {
    const why = whys()[0]!;
    name(why).click();
    why.dispatchEvent(new FocusEvent('focusout', { relatedTarget: why.querySelector('[data-visit]') }));
    expect(isOpen(why)).toBe(true);
    why.dispatchEvent(new FocusEvent('focusout', { relatedTarget: name(whys()[1]!) }));
    expect(isOpen(why)).toBe(false);
    expect(why.dataset.pinned).toBeUndefined();
  });

  it('closes a pinned panel on an outside click, with no listener left from an earlier render', () => {
    const old = whys()[0]!;
    name(old).click();
    expect(old.dataset.pinned).toBe('1');

    // As a new search: the same results drawn again would bring the pressed panel back open.
    renderResults({ ...response }, el, config);
    const why = whys()[0]!;
    name(why).click();
    expect(isOpen(why)).toBe(true);
    document.body.click();
    expect(isOpen(why)).toBe(false);
    expect(why.dataset.pinned).toBeUndefined();
    // The first render's document listener would have unpinned this one.
    expect(old.dataset.pinned).toBe('1');
  });

  it('stays pinned when a click on panel text sends focus to the body', () => {
    const why = whys()[0]!;
    enter(why);
    over(name(why));
    name(why).click();
    why.dispatchEvent(new FocusEvent('focusout', { relatedTarget: null }));
    expect(isOpen(why)).toBe(true);

    why.dispatchEvent(new MouseEvent('mouseleave'));
    why.dispatchEvent(new FocusEvent('focusout', { relatedTarget: null }));
    expect(isOpen(why)).toBe(false);
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

  it('puts one map at the end of the Near you section, marked to sit beside its lists, pinning shown shops by rank', () => {
    renderResults({ ...response, local_farther: [farther] }, el, mapConfig);
    const near = el.querySelector<HTMLElement>('[data-section="near"]')!;
    const map = near.querySelector<HTMLElement>('[data-map]')!;
    expect(near.lastElementChild).toBe(map);
    expect(map.previousElementSibling!.matches('[data-farther]')).toBe(true);
    expect(near.dataset.mapLayout).toBe('beside');
    expect(map.hidden).toBe(false);
    expect(el.querySelector('[data-map-toggle]')).toBeNull();
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

  describe('on a screen too narrow to hold it beside the list', () => {
    const noMap = vi.fn();
    const toggled = vi.fn();
    const narrow = (open: boolean) => ({ ...config, onMap: draw, onNoMap: noMap, mapButton: { open, onToggle: toggled } });
    const button = () => el.querySelector<HTMLButtonElement>('[data-map-toggle]')!;
    const map = () => el.querySelector<HTMLElement>('[data-map]')!;
    beforeEach(() => {
      noMap.mockClear();
      toggled.mockClear();
    });

    it('draws nothing until "Show map" is pressed, then shows the map below the nearby lists', () => {
      renderResults({ ...response, local_farther: [farther] }, el, narrow(false));
      const near = el.querySelector<HTMLElement>('[data-section="near"]')!;
      expect(draw).not.toHaveBeenCalled();
      expect(noMap).toHaveBeenCalledTimes(1);
      expect(near.dataset.mapLayout).toBe('button');
      expect(button().textContent).toBe('Show map');
      // The label alone says the state; with aria-expanded too a screen reader hears "Hide map, expanded".
      expect(button().hasAttribute('aria-expanded')).toBe(false);
      expect(button().type).toBe('button');
      expect(button().previousElementSibling!.matches('[data-farther]')).toBe(true);
      expect(button().nextElementSibling).toBe(map());
      expect(near.lastElementChild).toBe(map());
      expect(button().getAttribute('aria-controls')).toBe(map().id);
      expect(map().hidden).toBe(true);

      button().click();
      expect(map().hidden).toBe(false);
      expect(draw).toHaveBeenCalledTimes(1);
      expect(draw.mock.calls[0]![0]).toBe(map());
      expect(draw.mock.calls[0]![1].map((p: { rank: number }) => p.rank)).toEqual([...response.local.map((r) => r.rank), farther.rank]);
      expect(button().textContent).toBe('Hide map');
      expect(button().hasAttribute('aria-expanded')).toBe(false);
      expect(toggled).toHaveBeenLastCalledWith(true);
    });

    it('hides the map again on a second press and lets the page release it', () => {
      renderResults(response, el, narrow(false));
      button().click();
      noMap.mockClear();
      button().click();
      expect(map().hidden).toBe(true);
      expect(noMap).toHaveBeenCalledTimes(1);
      expect(button().textContent).toBe('Show map');
      expect(toggled).toHaveBeenLastCalledWith(false);
      expect(draw).toHaveBeenCalledTimes(1);
    });

    it('draws at once when the visitor already opened the map for this search', () => {
      renderResults(response, el, narrow(true));
      expect(draw).toHaveBeenCalledTimes(1);
      expect(map().hidden).toBe(false);
      expect(button().textContent).toBe('Hide map');
      expect(toggled).not.toHaveBeenCalled();
    });

    it('keeps a map the visitor opened through a redraw of the same results', () => {
      renderResults(response, el, narrow(true));
      const opened = map();
      renderResults(response, el, narrow(true), { ...defaultView, sort: 'name' });
      expect(map()).toBe(opened);
      expect(map().hidden).toBe(false);
      expect(button().nextElementSibling).toBe(map());
      expect(button().textContent).toBe('Hide map');
      expect(draw).toHaveBeenCalledTimes(2);
    });

    it('takes the button away with a map that could not be drawn, so no dead control is left', () => {
      renderResults(response, el, narrow(false));
      button().click();
      removeMap(map());
      expect(el.querySelector('[data-map]')).toBeNull();
      expect(el.querySelector('[data-map-toggle]')).toBeNull();
      expect(el.querySelector<HTMLElement>('[data-section="near"]')!.dataset.mapLayout).toBeUndefined();
    });

    it('offers no button when no shop can be pinned', () => {
      renderResults({ ...response, local: response.local.map((r) => ({ ...r, lat: null, lon: null })) }, el, narrow(true));
      expect(el.querySelector('[data-map-toggle]')).toBeNull();
      expect(el.querySelector('[data-map]')).toBeNull();
      expect(el.querySelector<HTMLElement>('[data-section="near"]')!.dataset.mapLayout).toBeUndefined();
      expect(draw).not.toHaveBeenCalled();
    });
  });

  it('carries the map into the rebuilt lists when the same results are drawn again, so a sort or filter change does not reload it', () => {
    renderResults(response, el, mapConfig);
    const map = el.querySelector('[data-map]');
    renderResults(response, el, mapConfig, { ...defaultView, sort: 'name' });
    expect(el.querySelectorAll('[data-map]')).toHaveLength(1);
    expect(el.querySelector('[data-map]')).toBe(map);
    expect(el.querySelector('[data-section="near"]')!.lastElementChild).toBe(map);
    expect(draw).toHaveBeenCalledTimes(2);
    expect(draw.mock.calls[1]![0]).toBe(map);

    // A filter that leaves nothing to pin takes the map away; it comes back as a new one.
    renderResults(response, el, mapConfig, { ...defaultView, near: false });
    expect(el.querySelector('[data-map]')).toBeNull();
    renderResults(response, el, mapConfig);
    expect(el.querySelectorAll('[data-map]')).toHaveLength(1);
  });

  it('starts a new map for a new search', () => {
    renderResults(response, el, mapConfig);
    const map = el.querySelector('[data-map]');
    renderResults({ ...response }, el, mapConfig);
    expect(el.querySelectorAll('[data-map]')).toHaveLength(1);
    expect(el.querySelector('[data-map]')).not.toBe(map);
  });

  it('starts a new map when the same results are drawn for the other layout', () => {
    renderResults(response, el, mapConfig);
    const map = el.querySelector('[data-map]');
    renderResults(response, el, { ...mapConfig, mapButton: { open: true, onToggle: vi.fn() } });
    expect(el.querySelectorAll('[data-map]')).toHaveLength(1);
    expect(el.querySelector('[data-map]')).not.toBe(map);
  });

  it('redraws only the map when asked to, leaving the lists as they are', () => {
    renderResults(response, el, mapConfig);
    const firstShop = el.querySelector('[data-result]');
    draw.mockClear();
    const toggled = vi.fn();
    renderMap(response, el, { ...mapConfig, mapButton: { open: false, onToggle: toggled } });
    expect(el.querySelector('[data-result]')).toBe(firstShop);
    expect(el.querySelectorAll('[data-map]')).toHaveLength(1);
    expect(el.querySelector<HTMLElement>('[data-map]')!.hidden).toBe(true);
    expect(el.querySelector('[data-map-toggle]')!.textContent).toBe('Show map');
    expect(draw).not.toHaveBeenCalled();

    renderMap(response, el, mapConfig);
    expect(el.querySelector('[data-map-toggle]')).toBeNull();
    expect(el.querySelectorAll('[data-map]')).toHaveLength(1);
    expect(el.querySelector<HTMLElement>('[data-section="near"]')!.dataset.mapLayout).toBe('beside');
    expect(draw).toHaveBeenCalledTimes(1);

    // The same filters as the lists: with Near you switched off there is nothing to map.
    renderMap(response, el, mapConfig, { ...defaultView, near: false });
    expect(el.querySelector('[data-map]')).toBeNull();
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

describe('renderIdeas (Before you buy)', () => {
  it('shows a closed line naming the ideas, one entry per idea, and sources behind a button', () => {
    const box = document.createElement('div');
    renderIdeas(box, ideasFor({ product: 'cordless drill', canonical_name: '', category: '' }));
    expect(box.hidden).toBe(false);
    const details = box.querySelector('details')!;
    expect(details.open).toBe(false);
    expect(details.querySelector('summary')!.textContent).toBe('Before you buy: borrow, repair, used');
    const items = [...box.querySelectorAll('.ideas-list li')].map((li) => li.textContent);
    expect(items).toHaveLength(3);
    expect(items[0]).toMatch(/^Borrow it\. Tool libraries often lend/);
    expect(items[2]).toMatch(/^Buy it used\. Used tool shops often sell/);
    const sources = box.querySelector<HTMLElement>('[data-idea-sources]')!;
    const toggle = box.querySelector<HTMLButtonElement>('[data-idea-sources-toggle]')!;
    expect(sources.hidden).toBe(true);
    toggle.click();
    expect(sources.hidden).toBe(false);
    expect(toggle.getAttribute('aria-expanded')).toBe('true');
    expect(sources.textContent).toContain("Used tool shop: the site owner's experience.");
    expect(sources.querySelector('a')!.rel).toBe('noopener noreferrer');
  });

  it('is hidden and empty when no idea applies', () => {
    const box = document.createElement('div');
    renderIdeas(box, ideasFor({ product: 'drill', canonical_name: '', category: '' }));
    renderIdeas(box, ideasFor({ product: 'car seat', canonical_name: '', category: '' }));
    expect(box.hidden).toBe(true);
    expect(box.childElementCount).toBe(0);
  });
});
