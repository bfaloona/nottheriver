import { describe, expect, it, vi } from 'vitest';
import sample from '../tests/fixtures/zips-sample.json';
import { loadZips, lookupZip, parseZip } from './zip';
import type { ZipDataset } from './zip';

const data: ZipDataset = sample;

describe('parseZip', () => {
  it('accepts exactly five ASCII digits, trimmed', () => {
    expect(parseZip('02138')).toBe('02138');
    expect(parseZip(' 00601\n')).toBe('00601');
  });

  it.each(['02138-1234', '021381234', '021 38', '0213', 'abcde', '0213a', '', '０２１３８'])(
    'rejects %j',
    (input) => expect(parseZip(input)).toBeNull(),
  );
});

describe('lookupZip', () => {
  it('returns city, state, and centroid, keeping leading zeros', () => {
    expect(lookupZip('02138', data)).toEqual({ city: 'Cambridge', state: 'MA', lat: 42.38, lon: -71.14 });
    expect(lookupZip('00601', data)).toEqual({ city: 'Adjuntas', state: 'PR', lat: 18.18, lon: -66.75 });
  });

  it('handles territories on both sides of the equator and the date line', () => {
    expect(lookupZip('96910', data)).toMatchObject({ state: 'GU', lon: 144.75 });
    expect(lookupZip('96799', data)).toMatchObject({ state: 'AS', lat: -14.32 });
  });

  it('returns null for a zip with no ZCTA', () => {
    expect(lookupZip('10008', data)).toBeNull();
    expect(lookupZip('00000', data)).toBeNull();
  });

  it('never returns coordinates finer than 2 decimals', () => {
    for (const zip of data.zip) {
      const { lat, lon } = lookupZip(zip, data)!;
      expect(Math.round(lat * 100) / 100).toBe(lat);
      expect(Math.round(lon * 100) / 100).toBe(lon);
    }
  });
});

describe('loadZips', () => {
  const ok = () => vi.fn(async () => new Response(JSON.stringify(sample)));

  it('fetches once per url', async () => {
    const fetchImpl = ok();
    const [a, b] = await Promise.all([loadZips('/a/zips.json', fetchImpl), loadZips('/a/zips.json', fetchImpl)]);
    await loadZips('/a/zips.json', fetchImpl);
    expect(fetchImpl).toHaveBeenCalledTimes(1);
    expect(a).toBe(b);
    expect(a.zip).toEqual(sample.zip);
  });

  it('retries after a failed fetch instead of caching the failure', async () => {
    const failing = vi.fn(async () => new Response('', { status: 503 }));
    await expect(loadZips('/b/zips.json', failing)).rejects.toThrow('503');
    const fetchImpl = ok();
    await expect(loadZips('/b/zips.json', fetchImpl)).resolves.toMatchObject({ zip: sample.zip });
    expect(fetchImpl).toHaveBeenCalledTimes(1);
  });
});
