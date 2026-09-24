import { afterEach, describe, expect, it, vi } from 'vitest';
import type { SearchRequest, SearchResponse } from '../proxy/src/contract';
import fixture from '../tests/fixtures/search-response.json';
import zips from '../tests/fixtures/zips-sample.json';
import { search } from './api';
import { lookupZip } from './zip';

const locate = (zip: string) => lookupZip(zip, zips)!;

function okFetch(body: unknown = fixture, status = 200) {
  return vi.fn<typeof fetch>(async () => new Response(JSON.stringify(body), { status }));
}

describe('search (HR3, browser side)', () => {
  it('sends city, state and a 2-decimal centroid, never the zip', async () => {
    const zip = '60614';
    const fetchImpl = okFetch();
    // A caller that attaches the zip anyway must not get it onto the wire.
    await search({ product: 'cast iron skillet', ...locate(zip), zip } as SearchRequest, fetchImpl);

    expect(fetchImpl).toHaveBeenCalledTimes(1);
    const sent = JSON.stringify(fetchImpl.mock.calls);
    expect(sent).not.toContain(zip);
    expect(sent.match(/\d{5}/g) ?? []).not.toContain(zip);
    expect(sent).toContain('Chicago');

    const init = fetchImpl.mock.calls[0]![1]!;
    const body = JSON.parse(init.body as string) as Record<string, unknown>;
    expect(Object.keys(body).sort()).toEqual(['city', 'lat', 'lon', 'product', 'ruca', 'state']);
    expect(body.ruca).toBe(1);
    expect(String(body.lat)).toMatch(/^-?\d+(\.\d{1,2})?$/);
    expect(String(body.lon)).toMatch(/^-?\d+(\.\d{1,2})?$/);
    // No cookies or page URL either: they could identify the searcher alongside the zip area.
    expect(init).toMatchObject({ credentials: 'omit', referrerPolicy: 'no-referrer' });
  });

  it('leaves the RUCA code out when the zip has none', async () => {
    const fetchImpl = okFetch();
    await search({ product: 'kettle', city: 'Cambridge', state: 'MA', lat: 42.38, lon: -71.13 }, fetchImpl);
    expect(Object.keys(JSON.parse(fetchImpl.mock.calls[0]![1]!.body as string) as object)).not.toContain('ruca');
  });

  it('rounds coordinates to 2 decimals even if given more', async () => {
    const fetchImpl = okFetch();
    await search({ product: 'kettle', city: 'Cambridge', state: 'MA', lat: 42.37741, lon: -71.12569 }, fetchImpl);
    const body = JSON.parse(fetchImpl.mock.calls[0]![1]!.body as string) as { lat: number; lon: number };
    expect(body).toMatchObject({ lat: 42.38, lon: -71.13 });
  });

  it('returns the parsed response', async () => {
    const result = await search({ product: 'kettle', ...locate('02138') }, okFetch());
    expect(result).toEqual({ ok: true, data: fixture as SearchResponse });
  });

  it('treats a 200 without result lists as a server error', async () => {
    expect(await search({ product: 'kettle', ...locate('02138') }, okFetch({}))).toEqual({ ok: false, code: 'server_error' });
  });

  it('maps 429 to rate_limited', async () => {
    const result = await search({ product: 'kettle', ...locate('02138') }, okFetch({ error: 'rate_limited' }, 429));
    expect(result).toEqual({ ok: false, code: 'rate_limited' });
  });

  it('passes a known error code through and hides unknown ones', async () => {
    const known = await search({ product: 'kettle', ...locate('02138') }, okFetch({ error: 'upstream_error' }, 502));
    expect(known).toEqual({ ok: false, code: 'upstream_error' });
    const unknown = await search({ product: 'kettle', ...locate('02138') }, okFetch({ error: '<b>detail</b>' }, 500));
    expect(unknown).toEqual({ ok: false, code: 'server_error' });
  });

  it('reports a network failure', async () => {
    const fetchImpl = vi.fn<typeof fetch>(async () => {
      throw new TypeError('Failed to fetch');
    });
    expect(await search({ product: 'kettle', ...locate('02138') }, fetchImpl)).toEqual({ ok: false, code: 'network' });
  });
});

describe('worker URL', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it('posts to /search even when the configured URL ends in a slash', async () => {
    vi.stubEnv('VITE_WORKER_URL', 'https://worker.example/');
    vi.resetModules();
    const { search: fresh } = await import('./api');
    const fetchImpl = okFetch();
    await fresh({ product: 'kettle', ...locate('02138') }, fetchImpl);
    expect(fetchImpl.mock.calls[0]![0]).toBe('https://worker.example/search');
  });
});
