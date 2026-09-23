export interface ZipDataset { zip: string[]; city: string[]; state: string[]; lat: number[]; lon: number[] }
export interface ZipLocation { city: string; state: string; lat: number; lon: number }

// \d never matches non-ASCII digits in JavaScript, so fullwidth digits are rejected.
const FIVE_DIGITS = /^\d{5}$/;

export function parseZip(input: string): string | null {
  const zip = input.trim();
  return FIVE_DIGITS.test(zip) ? zip : null;
}

const indexes = new WeakMap<ZipDataset, Map<string, number>>();

export function lookupZip(zip: string, data: ZipDataset): ZipLocation | null {
  let index = indexes.get(data);
  if (!index) {
    index = new Map(data.zip.map((z, i) => [z, i]));
    indexes.set(data, index);
  }
  const i = index.get(zip);
  if (i === undefined) return null;
  return { city: data.city[i]!, state: data.state[i]!, lat: data.lat[i]!, lon: data.lon[i]! };
}

const loads = new Map<string, Promise<ZipDataset>>();

export function loadZips(url: string, fetchImpl: typeof fetch = globalThis.fetch): Promise<ZipDataset> {
  let load = loads.get(url);
  if (!load) {
    load = fetchImpl(url).then((res) => {
      if (!res.ok) throw new Error(`zips.json: HTTP ${res.status}`);
      return res.json() as Promise<ZipDataset>;
    });
    // A transient failure should not break every later search in the session.
    load.catch(() => loads.delete(url));
    loads.set(url, load);
  }
  return load;
}
