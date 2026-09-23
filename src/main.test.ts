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

beforeEach(async () => {
  const body = /<body>([\s\S]*)<\/body>/.exec(indexHtml)![1]!.replace(/<script[\s\S]*?<\/script>/g, '');
  document.body.innerHTML = body;
  sessionStorage.clear();
  localStorage.clear();
  fetchMock.mockReset();
  searchReplies(() => new Response(JSON.stringify(fixture), { status: 200 }));
  vi.stubGlobal('fetch', fetchMock);
  vi.resetModules();
  await import('./main');
});

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
