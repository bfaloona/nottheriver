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

  it('renders results, weights, and the cost line after a search', async () => {
    submit('cast iron skillet', '02138');
    await vi.waitFor(() => expect($('#results').hidden).toBe(false));
    expect(document.querySelectorAll('[data-section="near"] [data-result]')).toHaveLength(2);
    expect(document.querySelectorAll('[data-section="online"] [data-result]')).toHaveLength(2);
    expect(document.querySelectorAll('[data-weights]')).toHaveLength(1);
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
    submit('cast iron skillet', '02138');
    await vi.waitFor(() => expect($('#results').hidden).toBe(false));

    const certified = $<HTMLInputElement>('#certified-only');
    certified.checked = true;
    certified.dispatchEvent(new Event('change', { bubbles: true }));
    expect(document.querySelectorAll('[data-result]')).toHaveLength(2);

    for (const id of ['#show-near', '#show-online']) {
      const box = $<HTMLInputElement>(id);
      box.checked = false;
      box.dispatchEvent(new Event('change', { bubbles: true }));
    }
    expect($('[data-status]').textContent).toBe('Every result is hidden by the filters. Clear a filter to see them again.');
    expect(searchCalls()).toHaveLength(1);
  });

  it('shows how many results the certification filter would keep', async () => {
    submit('cast iron skillet', '02138');
    await vi.waitFor(() => expect($('#results').hidden).toBe(false));
    const certified = $<HTMLInputElement>('#certified-only');
    expect(certified.closest('label')!.textContent!.trim()).toBe('Has certification (2)');
    expect(certified.disabled).toBe(false);
  });

  it('switches the certification filter off and disables it when no result is certified', async () => {
    submit('cast iron skillet', '02138');
    await vi.waitFor(() => expect($('#results').hidden).toBe(false));
    const certified = $<HTMLInputElement>('#certified-only');
    certified.checked = true;
    certified.dispatchEvent(new Event('change', { bubbles: true }));
    expect(document.querySelectorAll('[data-result]')).toHaveLength(2);

    // A box left checked from the last search would hide every result of this one.
    const bare = (list: { certifications: unknown[] }[]) => list.map((r) => ({ ...r, certifications: [] }));
    searchReplies(() => new Response(JSON.stringify({ ...fixture, local: bare(fixture.local), online: bare(fixture.online) }), { status: 200 }));
    submit('kettle', '10001');
    await vi.waitFor(() => expect(certified.disabled).toBe(true));
    expect(certified.checked).toBe(false);
    expect(certified.closest('label')!.textContent!.trim()).toBe('Has certification (0)');
    expect(document.querySelectorAll('[data-result]')).toHaveLength(4);
    expect($('[data-status]').textContent).toBe('Found 2 shops near you and 2 online.');
  });

  it('counts certified shops only in the sections switched on, so the number is what the box would show', async () => {
    submit('cast iron skillet', '02138');
    await vi.waitFor(() => expect($('#results').hidden).toBe(false));
    const certified = $<HTMLInputElement>('#certified-only');
    const label = () => certified.closest('label')!.textContent!.trim();
    const online = $<HTMLInputElement>('#show-online');

    online.checked = false;
    online.dispatchEvent(new Event('change', { bubbles: true }));
    expect(label()).toBe('Has certification (1)');

    online.checked = true;
    online.dispatchEvent(new Event('change', { bubbles: true }));
    expect(label()).toBe('Has certification (2)');
  });

  it('leaves a checked certification filter checked and usable when switching a section off empties it', async () => {
    // Certified shops online only.
    const local = fixture.local.map((r) => ({ ...r, certifications: [] }));
    searchReplies(() => new Response(JSON.stringify({ ...fixture, local }), { status: 200 }));
    submit('cast iron skillet', '02138');
    await vi.waitFor(() => expect($('#results').hidden).toBe(false));
    const certified = $<HTMLInputElement>('#certified-only');
    const online = $<HTMLInputElement>('#show-online');
    const set = (box: HTMLInputElement, checked: boolean) => {
      box.checked = checked;
      box.dispatchEvent(new Event('change', { bubbles: true }));
    };

    set(certified, true);
    set(online, false);
    // Unchecking it for the visitor would bring back shops they filtered out; disabling it would trap them.
    expect(certified.checked).toBe(true);
    expect(certified.disabled).toBe(false);
    expect(certified.closest('label')!.textContent!.trim()).toBe('Has certification (0)');
    expect($('[data-status]').textContent).toBe('Every result is hidden by the filters. Clear a filter to see them again.');

    set(certified, false);
    expect(certified.disabled).toBe(true);
    expect(document.querySelectorAll('[data-result]')).toHaveLength(2);

    set(online, true);
    expect(certified.disabled).toBe(false);
    expect(certified.closest('label')!.textContent!.trim()).toBe('Has certification (1)');
  });

  it('takes the certification filter off for a new search whose switched-on sections hold no certified shop', async () => {
    submit('cast iron skillet', '02138');
    await vi.waitFor(() => expect($('#results').hidden).toBe(false));
    const certified = $<HTMLInputElement>('#certified-only');
    for (const [id, checked] of [['#show-online', false], ['#certified-only', true]] as const) {
      $<HTMLInputElement>(id).checked = checked;
      $<HTMLInputElement>(id).dispatchEvent(new Event('change', { bubbles: true }));
    }
    expect(document.querySelectorAll('[data-result]')).toHaveLength(1);

    // The next search has a certified shop, but only in Online, which is switched off.
    const local = fixture.local.map((r) => ({ ...r, certifications: [] }));
    searchReplies(() => new Response(JSON.stringify({ ...fixture, local }), { status: 200 }));
    submit('kettle', '10001');
    await vi.waitFor(() => expect(certified.checked).toBe(false));
    expect(certified.disabled).toBe(true);
    expect(certified.closest('label')!.textContent!.trim()).toBe('Has certification (0)');
    expect(document.querySelectorAll('[data-result]')).toHaveLength(2);
  });

  it('links the found count to the Online section until that section is switched off', async () => {
    submit('cast iron skillet', '02138');
    await vi.waitFor(() => expect($('#results').hidden).toBe(false));
    expect($('[data-status] a').getAttribute('href')).toBe('#online-heading');
    expect(document.getElementById('online-heading')).not.toBeNull();

    const online = $<HTMLInputElement>('#show-online');
    online.checked = false;
    online.dispatchEvent(new Event('change', { bubbles: true }));
    expect(document.querySelector('[data-status] a')).toBeNull();
  });

  it('shows the headline until a search starts, then keeps it out of the way', async () => {
    const page = $('.page');
    expect(page.classList.contains('searched')).toBe(false);
    submit('kettle', '99999'); // not in the zip list, so no search starts
    await vi.waitFor(() => expect($('#zip-help').hidden).toBe(false));
    expect(page.classList.contains('searched')).toBe(false);

    submit('cast iron skillet', '02138');
    await vi.waitFor(() => expect($('#results').hidden).toBe(false));
    expect(page.classList.contains('searched')).toBe(true);
    // Still in the page for a screen reader: it is the only h1.
    expect($('h1[data-mission]').hidden).toBe(false);

    // A failed search leaves the form where it is rather than moving it back down.
    searchReplies(() => new Response('{"error":"rate_limited"}', { status: 429 }));
    submit('kettle', '10001');
    await vi.waitFor(() => expect($('#results').hidden).toBe(true));
    expect(page.classList.contains('searched')).toBe(true);
  });

  const search = async (product = 'cast iron skillet') => {
    submit(product, '02138');
    await vi.waitFor(() => expect($('#results').hidden).toBe(false));
    await vi.waitFor(() => expect($('[data-status]').textContent).toMatch(/^Found/));
  };
  const mapButton = () => document.querySelector<HTMLButtonElement>('[data-map-toggle]');
  const sortBy = (key: string) => {
    $<HTMLSelectElement>('#sort').value = key;
    $('#sort').dispatchEvent(new Event('change', { bubbles: true }));
  };

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
    sortBy('name');
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
    const online = fixture.online.map((r) => ({ ...r, certifications: [] }));
    searchReplies(() => new Response(JSON.stringify({ ...fixture, online }), { status: 200 }));
    await search();
    expect(document.querySelector('[data-status] a')).not.toBeNull();
    const certified = $<HTMLInputElement>('#certified-only');
    certified.checked = true;
    certified.dispatchEvent(new Event('change', { bubbles: true }));
    expect(document.querySelectorAll('[data-section="online"] [data-result]')).toHaveLength(0);
    expect($('[data-status]').textContent).toBe('Found 2 shops near you and 2 online.');
    expect(document.querySelector('[data-status] a')).toBeNull();
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
      sortBy('name');
      expect(mapButton()!.textContent).toBe('Show map');
    } finally {
      vi.doUnmock('./map');
    }
  });

  it('swaps only the map when the width changes, so an opened panel stays open', async () => {
    await search();
    const why = $<HTMLDetailsElement>('[data-why]');
    why.open = true;
    resize(false);
    expect(mapButton()!.textContent).toBe('Show map');
    expect($<HTMLDetailsElement>('[data-why]')).toBe(why);
    expect(why.open).toBe(true);
  });

  it('leaves the map alone when a width event arrives without a change of layout', async () => {
    await search();
    const map = $('[data-map]');
    resize(true); // a full-page screenshot fires one of these in Chromium
    expect($('[data-map]')).toBe(map);
  });

  it('keeps a failure message when a filter changes after the failed search', async () => {
    submit('cast iron skillet', '02138');
    await vi.waitFor(() => expect($('#results').hidden).toBe(false));

    const limited = 'Too many searches from this connection. Try again in about a minute.';
    searchReplies(() => new Response('{"error":"rate_limited"}', { status: 429 }));
    submit('kettle', '10001');
    await vi.waitFor(() => expect($('[data-status]').textContent).toBe(limited));
    expect($('[data-cost]').hidden).toBe(true);

    const certified = $<HTMLInputElement>('#certified-only');
    certified.checked = true;
    certified.dispatchEvent(new Event('change', { bubbles: true }));
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
