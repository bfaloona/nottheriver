import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { EXPECTED_ROWS, STATES, join } from './build-zips.mjs';

// Verbatim lines from the 2026 Gazetteer and GeoNames files.
const GAZ = [
  'GEOID|GEOIDFQ|ALAND|AWATER|ALAND_SQMI|AWATER_SQMI|INTPTLAT|INTPTLONG',
  '00601|860Z200US00601|166744424|795116|64.38|0.307|18.180621|-66.749931',
  '02138|860Z200US02138|7092306|845255|2.738|0.326|42.379981|-71.135002',
  '96799|860Z200US96799|197654141|6550890|76.315|2.529|-14.324678|-170.752057',
  '96860|860Z200US96860|2418337|2469595|0.934|0.954|21.356893|-157.947265',
].join('\n');

const US = [
  'US\t96860\tJbphh\tHawaii\tHI\tHonolulu\t003\t\t\t21.316\t-157.8677\t1',
  'US\t02138\tCambridge\tMassachusetts\tMA\tMiddlesex\t017\t\t\t42.377\t-71.1256\t4',
  'US\t10008\tNew York\tNew York\tNY\tNew York\t061\t\t\t40.7143\t-74.006\t4', // PO-box code, no ZCTA
  'US\t96860\tFPO AA\t\t\t\t\t\t\t21.3448\t-157.9774\t4',
].join('\n');
const PR = 'PR\t00601\tAdjuntas\tAdjuntas\t001\t\t\t\t\t18.1627\t-66.7221\t4';
const AS = 'AS\t96799\tPago Pago\tAs\t\t\t\t\t\t-14.2781\t-170.7025\t6';

describe('join', () => {
  it('builds columnar rows in Gazetteer order', () => {
    expect(join(GAZ, [US, PR, AS])).toEqual({
      zip: ['00601', '02138', '96799', '96860'],
      city: ['Adjuntas', 'Cambridge', 'Pago Pago', 'Jbphh'],
      state: ['PR', 'MA', 'AS', 'HI'],
      lat: [18.18, 42.38, -14.32, 21.36],
      lon: [-66.75, -71.14, -170.75, -157.95],
    });
  });

  it('reads a tab-delimited Gazetteer with padded fields', () => {
    const tabbed = GAZ.replaceAll('|', '\t ').replaceAll('\n', '   \n');
    expect(join(tabbed, [US, PR, AS])).toEqual(join(GAZ, [US, PR, AS]));
  });

  it('reads a coordinate with an explicit plus sign, as Guam rows have', () => {
    expect(join(GAZ.replace('|42.379981', '|+42.379981'), [US, PR, AS]).lat[1]).toBe(42.38);
  });

  it('prefers the duplicate row that has a state, whatever its order', () => {
    const reversed = US.split('\n').reverse().join('\n');
    expect(join(GAZ, [reversed, PR, AS]).city[3]).toBe('Jbphh');
  });

  it('drops GeoNames codes that are not ZCTAs', () => {
    expect(join(GAZ, [US, PR, AS]).zip).not.toContain('10008');
  });

  it('fails listing every ZCTA with no GeoNames row', () => {
    expect(() => join(GAZ, [US])).toThrow(/00601, 96799/);
  });

  it('fails on a missing Gazetteer column', () => {
    expect(() => join(GAZ.replace('INTPTLAT', 'LAT'), [US, PR, AS])).toThrow(/INTPTLAT/);
  });

  it('fails on an empty place name', () => {
    expect(() => join(GAZ, [US.replace('Cambridge', ''), PR, AS])).toThrow(/02138/);
  });

  it('fails on a state outside the allowlist', () => {
    const military = US.replace('Hawaii\tHI', 'Hawaii\tAE');
    expect(() => join(GAZ, [military, PR, AS])).toThrow(/96860/);
  });

  it('fails on a malformed zip, bad coordinate, or unsorted rows', () => {
    expect(() => join(GAZ.replace('02138|', '2138|'), [US, PR, AS])).toThrow(/2138/);
    expect(() => join(GAZ.replace('42.379981', '142.379981'), [US, PR, AS])).toThrow(/02138/);
    expect(() => join(GAZ.replace('42.379981', ''), [US, PR, AS])).toThrow(/02138/);
    const [header, ...rows] = GAZ.split('\n');
    expect(() => join([header, ...rows.reverse()].join('\n'), [US, PR, AS])).toThrow(/order/);
  });

  it('allows the 50 states, DC, and five territories', () => {
    expect(STATES.size).toBe(56);
    for (const s of ['DC', 'PR', 'VI', 'GU', 'AS', 'MP']) expect(STATES.has(s)).toBe(true);
  });
});

describe('committed public/zips.json', () => {
  const data = JSON.parse(readFileSync(new URL('../public/zips.json', import.meta.url), 'utf8'));
  const sample = JSON.parse(readFileSync(new URL('../tests/fixtures/zips-sample.json', import.meta.url), 'utf8'));

  it('has one full-length column per field and 2-decimal coordinates', () => {
    for (const key of ['zip', 'city', 'state', 'lat', 'lon']) expect(data[key]).toHaveLength(EXPECTED_ROWS);
    const twoDecimals = (x) => Math.round(x * 100) / 100 === x;
    expect(data.lat.every(twoDecimals) && data.lon.every(twoDecimals)).toBe(true);
  });

  it('contains every sample fixture row verbatim', () => {
    const row = (d, zip) => {
      const i = d.zip.indexOf(zip);
      return i < 0 ? null : { city: d.city[i], state: d.state[i], lat: d.lat[i], lon: d.lon[i] };
    };
    for (const zip of sample.zip) expect(row(data, zip)).toEqual(row(sample, zip));
  });
});
