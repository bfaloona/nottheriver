// @vitest-environment happy-dom
import { beforeEach, describe, expect, it, vi } from 'vitest';
import indexHtml from '../index.html?raw';
import fixture from '../tests/fixtures/search-response.json';
import zips from '../tests/fixtures/zips-sample.json';
import { siteName, tagline, zipsUrl } from './config';

const fetchMock = vi.fn<typeof fetch>();

function dump(storage: Storage): string {
  const entries: [string, string | null][] = [];
  for (let i = 0; i < storage.length; i++) {
    const key = storage.key(i)!;
    entries.push([key, storage.getItem(key)]);
  }
  return JSON.stringify(entries);
}

// The dataset is served as zips.json so the real loader runs and its request is
// covered by the HR3 scan.
function searchReplies(reply: () => Response): void {
  fetchMock.mockImplementation(async (input) =>
    String(input) === zipsUrl ? new Response(JSON.stringify(zips), { status: 200 }) : reply(),
  );
}

const searchCalls = () => fetchMock.mock.calls.filter(([input]) => String(input) !== zipsUrl);

const $ = <T extends HTMLElement>(selector: string) => document.querySelector<T>(selector)!;

// Returns the event so a test can check the browser's own submission was cancelled.
function submit(product: string, zip: string): Event {
  $<HTMLInputElement>('#product').value = product;
  $<HTMLInputElement>('#zip').value = zip;
  const event = new Event('submit', { bubbles: true, cancelable: true });
  $<HTMLFormElement>('#search').dispatchEvent(event);
  return event;
}

// Changes a control the way a visitor would: the page listens for the change event.
function set(selector: string, value: boolean | string): void {
  const control = $<HTMLInputElement>(selector);
  if (typeof value === 'boolean') control.checked = value;
  else control.value = value;
  control.dispatchEvent(new Event('change', { bubbles: true }));
}

async function search(product = 'cast iron skillet'): Promise<void> {
  submit(product, '02138');
  await vi.waitFor(() => expect($('#results').hidden).toBe(false));
  await vi.waitFor(() => expect($('[data-found]').textContent).toMatch(/^Found/));
}

const certified = () => $<HTMLInputElement>('#certified-only');
const certifiedLabel = () => certified().closest('label')!.textContent!.trim();
const uncertified = <T extends { certifications: unknown[] }>(list: T[]) => list.map((r) => ({ ...r, certifications: [] }));

// The page asks one width question: is there room for the map beside the list. Every other
// media query (hover, pointer, reduced motion) answers no.
const screen = { wide: true, changed: [] as (() => void)[] };
function resize(wide: boolean): void {
  screen.wide = wide;
  for (const listener of screen.changed) listener();
}

async function boot(wide = true): Promise<void> {
  const body = /<body>([\s\S]*)<\/body>/.exec(indexHtml)![1]!.replace(/<script[\s\S]*?<\/script>/g, '');
  document.body.innerHTML = body;
  sessionStorage.clear();
  localStorage.clear();
  fetchMock.mockReset();
  searchReplies(() => new Response(JSON.stringify(fixture), { status: 200 }));
  vi.stubGlobal('fetch', fetchMock);
  screen.wide = wide;
  screen.changed = [];
  vi.stubGlobal('matchMedia', (query: string) => ({
    get matches() {
      return query.includes('min-width') && screen.wide;
    },
    addEventListener: (_: 'change', listener: () => void) => screen.changed.push(listener),
  }));
  vi.resetModules();
  await import('./main');
}

beforeEach(() => boot());

describe('search page', () => {
  it('names the page from config and keeps the mission copy in sync', () => {
    expect(document.title).toBe(siteName);
    expect($('[data-site-name]').textContent).toBe(siteName);
    expect($('[data-mission]').textContent).toBe(tagline);
    for (const a of document.querySelectorAll('a[href]')) expect(a.getAttribute('href')!.startsWith('/')).toBe(false);
  });

  it('gives the reason to search in a line under the headline', () => {
    expect($('[data-mission] + .mission-note').textContent).toBe('Who you buy from matters.');
  });

  it('never puts the zip in the URL, storage, or the request (HR3)', async () => {
    const zip = '60614';
    const event = submit('cast iron skillet', zip);
    expect(event.defaultPrevented).toBe(true);
    await vi.waitFor(() => expect($('#results').hidden).toBe(false));

    // Without a name attribute, neither field can be serialized into a URL if the script fails.
    expect($('#zip').hasAttribute('name')).toBe(false);
    expect($('#product').hasAttribute('name')).toBe(false);
    expect(location.search).toBe('');
    expect(location.hash.match(/\d{5}/g) ?? []).not.toContain(zip);
    for (const storage of [sessionStorage, localStorage]) {
      const text = dump(storage);
      expect(text.match(/\d{5}/g) ?? []).not.toContain(zip);
      expect(storage.getItem('zip')).toBeNull();
    }
    expect(dump(sessionStorage)).toContain('cast iron skillet');

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock.mock.calls.map(([input]) => String(input))).toContain(zipsUrl);
    const sent = JSON.stringify(fetchMock.mock.calls);
    expect(sent.match(/\d{5}/g) ?? []).not.toContain(zip);
    expect(sent).toContain('Chicago');
  });

  it('renders results, the help line, and the cost line after a search', async () => {
    submit('cast iron skillet', '02138');
    await vi.waitFor(() => expect($('#results').hidden).toBe(false));
    expect(document.querySelectorAll('[data-section="near"] [data-result]')).toHaveLength(2);
    expect(document.querySelectorAll('[data-section="online"] [data-result]')).toHaveLength(2);
    expect(document.querySelectorAll('[data-results-help]')).toHaveLength(1);
    expect($('[data-cost]').hidden).toBe(false);
    expect($<HTMLButtonElement>('button[type=submit]').disabled).toBe(false);
  });

  it('starts the zip download on first focus, once, before any search', async () => {
    const zipLoads = () => fetchMock.mock.calls.filter(([input]) => String(input) === zipsUrl).length;
    expect(zipLoads()).toBe(0);
    $('#product').dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
    $('#zip').dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
    expect(zipLoads()).toBe(1);
    expect(searchCalls()).toHaveLength(0);
    submit('cast iron skillet', '02138');
    await vi.waitFor(() => expect($('#results').hidden).toBe(false));
    expect(zipLoads()).toBe(1);
  });

  it('flags a zip missing from the dataset without calling the search', async () => {
    submit('kettle', '99999');
    await vi.waitFor(() => expect($('#zip-help').hidden).toBe(false));
    expect($('#zip-help').textContent).toBe("That zip code isn't in our list. Check the five digits and try again.");
    expect($('#zip').getAttribute('aria-invalid')).toBe('true');
    expect(searchCalls()).toHaveLength(0);
  });

  it('shows the rate-limit message on 429', async () => {
    searchReplies(() => new Response('{"error":"rate_limited"}', { status: 429 }));
    submit('kettle', '10001');
    await vi.waitFor(() =>
      expect($('[data-status]').textContent).toBe('Too many searches from this connection. Try again in about a minute.'),
    );
    expect($('#results').hidden).toBe(true);
  });

  it('applies filters without a new request and says when they hide everything', async () => {
    await search();

    set('#certified-only', true);
    expect(document.querySelectorAll('[data-result]')).toHaveLength(2);

    set('#show-near', false);
    set('#show-online', false);
    expect($('[data-found]').textContent).toBe('Every result is hidden by the filters. Clear a filter to see them again.');
    expect(searchCalls()).toHaveLength(1);
  });

  it('shows how many results the certification filter would keep', async () => {
    await search();
    expect(certifiedLabel()).toBe('Has certification (2)');
    expect(certified().disabled).toBe(false);
  });

  it('switches the certification filter off and disables it when no result is certified', async () => {
    await search();
    set('#certified-only', true);
    expect(document.querySelectorAll('[data-result]')).toHaveLength(2);

    // A box left checked from the last search would hide every result of this one.
    searchReplies(() => new Response(JSON.stringify({ ...fixture, local: uncertified(fixture.local), online: uncertified(fixture.online) }), { status: 200 }));
    submit('kettle', '10001');
    await vi.waitFor(() => expect(certified().disabled).toBe(true));
    expect(certified().checked).toBe(false);
    expect(certifiedLabel()).toBe('Has certification (0)');
    expect(document.querySelectorAll('[data-result]')).toHaveLength(4);
    expect($('[data-found]').textContent).toBe('Found 2 shops within 7.1 mi and 2 online.');
  });

  it('counts certified shops only in the sections switched on, so the number is what the box would show', async () => {
    await search();
    set('#show-online', false);
    expect(certifiedLabel()).toBe('Has certification (1)');

    set('#show-online', true);
    expect(certifiedLabel()).toBe('Has certification (2)');
  });

  it('leaves a checked certification filter checked and usable when switching a section off empties it', async () => {
    // Certified shops online only.
    searchReplies(() => new Response(JSON.stringify({ ...fixture, local: uncertified(fixture.local) }), { status: 200 }));
    await search();

    set('#certified-only', true);
    set('#show-online', false);
    // Unchecking it for the visitor would bring back shops they filtered out; disabling it would trap them.
    expect(certified().checked).toBe(true);
    expect(certified().disabled).toBe(false);
    expect(certifiedLabel()).toBe('Has certification (0)');
    expect($('[data-found]').textContent).toBe('Every result is hidden by the filters. Clear a filter to see them again.');

    set('#certified-only', false);
    expect(certified().disabled).toBe(true);
    expect(document.querySelectorAll('[data-result]')).toHaveLength(2);

    set('#show-online', true);
    expect(certified().disabled).toBe(false);
    expect(certifiedLabel()).toBe('Has certification (1)');
  });

  it('takes the certification filter off for a new search whose switched-on sections hold no certified shop', async () => {
    await search();
    set('#show-online', false);
    set('#certified-only', true);
    expect(document.querySelectorAll('[data-result]')).toHaveLength(1);

    // The next search has a certified shop, but only in Online, which is switched off.
    searchReplies(() => new Response(JSON.stringify({ ...fixture, local: uncertified(fixture.local) }), { status: 200 }));
    submit('kettle', '10001');
    await vi.waitFor(() => expect(certified().checked).toBe(false));
    expect(certified().disabled).toBe(true);
    expect(certifiedLabel()).toBe('Has certification (0)');
    expect(document.querySelectorAll('[data-result]')).toHaveLength(2);
  });

  it('writes the count at the top of the results, under the sort and filter row', async () => {
    await search();
    const found = $('[data-found]');
    expect(found.previousElementSibling).toBe($('.controls'));
    // "Before you buy" sits between the count and the shops.
    expect(found.nextElementSibling).toBe($('[data-before-you-buy]'));
    // How the search was read sits outside the results block, so an empty search can show it too.
    expect($('[data-status]').nextElementSibling).toBe($('[data-looked-for]'));
    expect($('[data-looked-for]').nextElementSibling).toBe($('#results'));
    expect($('[data-before-you-buy]').nextElementSibling).toBe($('#result-sections'));
    expect(found.getAttribute('role')).toBe('status');
  });

  it('shows "Before you buy" for a matching product, and keeps it through a sort change', async () => {
    searchReplies(() => new Response(JSON.stringify({ ...fixture, query: { ...fixture.query, product: 'cordless drill' } }), { status: 200 }));
    submit('cordless drill', '10001');
    const box = $('[data-before-you-buy]');
    await vi.waitFor(() => expect(box.hidden).toBe(false));
    expect(box.querySelector('summary')!.textContent).toBe('Before you buy: borrow, repair, used');
    box.querySelector('details')!.open = true;
    const sort = $<HTMLSelectElement>('#sort');
    sort.value = 'name';
    sort.dispatchEvent(new Event('change', { bubbles: true }));
    expect(box.querySelector('details')!.open).toBe(true);
  });

  it('says how the search was read, and replaces the line on the next search', async () => {
    searchReplies(() => new Response(JSON.stringify({ ...fixture, query: { ...fixture.query, product: 'DeWalt DCD771', canonical_name: 'cordless drill' } }), { status: 200 }));
    submit('DeWalt DCD771', '10001');
    const line = $('[data-looked-for]');
    await vi.waitFor(() => expect(line.textContent).toBe('We looked for: cordless drill'));
    expect(line.hidden).toBe(false);
    searchReplies(() => new Response(JSON.stringify({ ...fixture, query: { ...fixture.query, canonical_name: 'kettle' } }), { status: 200 }));
    submit('kettle', '10001');
    await vi.waitFor(() => expect(line.textContent).toBe('We looked for: kettle'));
  });

  it('says how the search was read when the search found nothing', async () => {
    const query = { ...fixture.query, product: 'DeWalt DCD771', canonical_name: 'cordless drill' };
    searchReplies(() => new Response(JSON.stringify({ ...fixture, query, local: [], local_farther: [], online: [] }), { status: 200 }));
    submit('DeWalt DCD771', '10001');
    const line = $('[data-looked-for]');
    await vi.waitFor(() => expect(line.hidden).toBe(false));
    expect(line.textContent).toBe('We looked for: cordless drill');
    expect($('#results').hidden).toBe(true);
  });

  it('clears the line under the search box once the results are in', async () => {
    await search();
    expect($('[data-status]').textContent).toBe('');
  });

  it('says a new search is under way under the search box, not over the last count', async () => {
    await search();
    let reply!: (response: Response) => void;
    fetchMock.mockImplementation(() => new Promise<Response>((resolve) => { reply = resolve; }));
    submit('kettle', '10001');
    await vi.waitFor(() => expect($('[data-status]').textContent).toMatch(/^Searching shops near/));
    expect($('#results').hidden).toBe(true);
    expect($('[data-found]').textContent).toBe('');
    reply(new Response(JSON.stringify(fixture), { status: 200 }));
    await vi.waitFor(() => expect($('[data-status]').textContent).toBe(''));
  });

  const searchButton = () => $<HTMLButtonElement>('button[type=submit]');
  const working = () => ({ busy: searchButton().dataset.busy !== undefined, disabled: searchButton().disabled, label: searchButton().textContent });
  const atRest = { busy: false, disabled: false, label: 'Search' };

  it('shows the search button working from the press until the results are in', async () => {
    let reply!: (response: Response) => void;
    fetchMock.mockImplementation(async (input) =>
      String(input) === zipsUrl ? new Response(JSON.stringify(zips), { status: 200 }) : new Promise<Response>((resolve) => { reply = resolve; }),
    );
    expect(working()).toEqual(atRest);
    submit('kettle', '10001');
    // At once: the zip list may still be downloading, before anything says "Searching".
    expect(working()).toEqual({ busy: true, disabled: true, label: 'Searching' });
    await vi.waitFor(() => expect(reply).toBeDefined());
    expect(working()).toEqual({ busy: true, disabled: true, label: 'Searching' });
    reply(new Response(JSON.stringify(fixture), { status: 200 }));
    await vi.waitFor(() => expect($('#results').hidden).toBe(false));
    await vi.waitFor(() => expect(working()).toEqual(atRest));
  });

  it('puts the search button back at rest after a failed search', async () => {
    searchReplies(() => new Response('{"error":"rate_limited"}', { status: 429 }));
    submit('kettle', '10001');
    await vi.waitFor(() => expect($('[data-status]').textContent).toMatch(/^Too many searches/));
    await vi.waitFor(() => expect(working()).toEqual(atRest));
  });

  it('puts the search button back at rest when the zip code is not in the list', async () => {
    submit('kettle', '99999');
    await vi.waitFor(() => expect($('#zip-help').hidden).toBe(false));
    await vi.waitFor(() => expect(working()).toEqual(atRest));
  });

  it('leaves the search button at rest when a field is missing', () => {
    submit('', '10001');
    expect(working()).toEqual(atRest);
  });

  it('links the found count to the Online section until that section is switched off', async () => {
    await search();
    expect($('[data-found] a').getAttribute('href')).toBe('#online-heading');
    expect(document.getElementById('online-heading')).not.toBeNull();

    set('#show-online', false);
    expect(document.querySelector('[data-found] a')).toBeNull();
  });

  it('shows the headline until a search starts, then keeps it out of the way', async () => {
    const page = $('.page');
    expect(page.classList.contains('searched')).toBe(false);
    submit('kettle', '99999'); // not in the zip list, so no search starts
    await vi.waitFor(() => expect($('#zip-help').hidden).toBe(false));
    expect(page.classList.contains('searched')).toBe(false);

    await search();
    expect(page.classList.contains('searched')).toBe(true);
    // Still in the page for a screen reader: it is the only h1.
    expect($('h1[data-mission]').hidden).toBe(false);

    // A failed search leaves the form where it is rather than moving it back down.
    searchReplies(() => new Response('{"error":"rate_limited"}', { status: 429 }));
    submit('kettle', '10001');
    await vi.waitFor(() => expect($('#results').hidden).toBe(true));
    expect(page.classList.contains('searched')).toBe(true);
  });

  const mapButton = () => document.querySelector<HTMLButtonElement>('[data-map-toggle]');

  it('shows the map beside the list, with no button, on a wide screen', async () => {
    await search();
    expect($('[data-section="near"]').dataset.mapLayout).toBe('beside');
    expect($('[data-map]').hidden).toBe(false);
    expect(mapButton()).toBeNull();
  });

  it('keeps the map behind "Show map" on a narrow screen, open across a sort, closed again for a new search', async () => {
    await boot(false);
    await search();
    expect($('[data-map]').hidden).toBe(true);
    expect(mapButton()!.textContent).toBe('Show map');

    mapButton()!.click();
    set('#sort', 'name');
    expect(mapButton()!.textContent).toBe('Hide map');
    expect($('[data-map]').hidden).toBe(false);

    // A new search can be about another place, so it asks again before loading a map of it.
    await search('kettle');
    expect(mapButton()!.textContent).toBe('Show map');
    expect($('[data-map]').hidden).toBe(true);
  });

  it('moves the map behind the button when the window is narrowed, and back beside the list when widened', async () => {
    await search();
    resize(false);
    expect(mapButton()!.textContent).toBe('Show map');
    expect($('[data-map]').hidden).toBe(true);
    resize(true);
    expect(mapButton()).toBeNull();
    expect($('[data-section="near"]').dataset.mapLayout).toBe('beside');
  });

  it('links to Online only while that section has a shop on screen', async () => {
    // Certified shops nearby only: the certification filter empties Online without switching it off.
    searchReplies(() => new Response(JSON.stringify({ ...fixture, online: uncertified(fixture.online) }), { status: 200 }));
    await search();
    expect(document.querySelector('[data-found] a')).not.toBeNull();
    set('#certified-only', true);
    expect(document.querySelectorAll('[data-section="online"] [data-result]')).toHaveLength(0);
    // The count line follows the filter: it is the only place the counts are written.
    expect($('[data-found]').textContent).toBe('Showing 1 shop within 2.0 mi and none online.');
    expect(document.querySelector('[data-found] a')).toBeNull();
  });

  it('takes "Show map" away when the map cannot be loaded, instead of leaving a button that does nothing', async () => {
    vi.doMock('./map', () => ({
      clearMap: () => {},
      drawMap: () => {
        throw new Error('no map');
      },
    }));
    try {
      await boot(false);
      await search();
      mapButton()!.click();
      await vi.waitFor(() => expect(mapButton()).toBeNull());
      expect(document.querySelector('[data-map]')).toBeNull();
      expect(document.querySelectorAll('[data-section="near"] [data-result]')).toHaveLength(2);
      // The next re-render offers the map again, closed, rather than "Hide map" over nothing.
      set('#sort', 'name');
      expect(mapButton()!.textContent).toBe('Show map');
    } finally {
      vi.doUnmock('./map');
    }
  });

  it('lets go of the map when a new search hides the results, so a failed search leaves none running', async () => {
    const clearMap = vi.fn();
    vi.doMock('./map', () => ({ clearMap, drawMap: () => {} }));
    try {
      await boot();
      await search();
      await vi.waitFor(() => expect($('[data-map]')).not.toBeNull());
      await vi.dynamicImportSettled();
      clearMap.mockClear();
      searchReplies(() => new Response('{"error":"rate_limited"}', { status: 429 }));
      submit('kettle', '10001');
      await vi.waitFor(() => expect($('#results').hidden).toBe(true));
      expect(clearMap).toHaveBeenCalled();
    } finally {
      vi.doUnmock('./map');
    }
  });

  it('swaps only the map when the width changes, so an opened panel stays open', async () => {
    await search();
    const why = $('[data-why]');
    $('[data-why] [data-retailer]').click();
    resize(false);
    expect(mapButton()!.textContent).toBe('Show map');
    expect($('[data-why]')).toBe(why);
    expect($('[data-why] .why-panel').hidden).toBe(false);
  });

  it('keeps the map and an opened panel through a sort change', async () => {
    await search();
    const map = $('[data-map]');
    const shop = $('[data-why] [data-retailer]').textContent;
    $('[data-why] [data-retailer]').click();
    set('#sort', 'name');
    expect($('[data-map]')).toBe(map);
    const open = [...document.querySelectorAll<HTMLElement>('.why-panel')].filter((p) => !p.hidden);
    expect(open.map((p) => p.closest('[data-why]')!.querySelector('[data-retailer]')!.textContent)).toEqual([shop]);
  });

  it('starts the next search with a new map and every panel closed', async () => {
    await search();
    const map = $('[data-map]');
    $('[data-why] [data-retailer]').click();
    submit('kettle', '02138');
    await vi.waitFor(() => expect($('[data-map]')).not.toBe(map));
    await vi.waitFor(() => expect($('#results').hidden).toBe(false));
    expect([...document.querySelectorAll<HTMLElement>('.why-panel')].filter((p) => !p.hidden)).toEqual([]);
  });

  it('leaves the map alone when a width event arrives without a change of layout', async () => {
    await search();
    const map = $('[data-map]');
    resize(true); // a full-page screenshot fires one of these in Chromium
    expect($('[data-map]')).toBe(map);
  });

  it('keeps a failure message when a filter changes after the failed search', async () => {
    await search();

    const limited = 'Too many searches from this connection. Try again in about a minute.';
    searchReplies(() => new Response('{"error":"rate_limited"}', { status: 429 }));
    submit('kettle', '10001');
    await vi.waitFor(() => expect($('[data-status]').textContent).toBe(limited));
    expect($('[data-cost]').hidden).toBe(true);

    set('#certified-only', true);
    expect($('[data-status]').textContent).toBe(limited);
    expect($('#results').hidden).toBe(true);
  });

  it('reports a failure instead of hanging when a response cannot be rendered', async () => {
    // Passes the shape check in api.ts but has no usage for the cost line.
    searchReplies(() => new Response(JSON.stringify({ ...fixture, usage: undefined }), { status: 200 }));
    submit('kettle', '10001');
    await vi.waitFor(() =>
      expect($('[data-status]').textContent).toBe("The search didn't complete. Wait a moment and try again."),
    );
    expect($('#results').hidden).toBe(true);
    expect($<HTMLButtonElement>('button[type=submit]').disabled).toBe(false);
  });
});
