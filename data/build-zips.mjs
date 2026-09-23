// Builds public/zips.json from the Census ZCTA Gazetteer and GeoNames postal files in data/raw/.
// Sources, download steps, and attribution: data/README.md.
import { readFileSync, writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

export const STATES = new Set(
  ('AL AK AZ AR CA CO CT DE FL GA HI ID IL IN IA KS KY LA ME MD MA MI MN MS MO MT NE NV NH NJ ' +
    'NM NY NC ND OH OK OR PA RI SC SD TN TX UT VT VA WA WV WI WY DC PR VI GU AS MP').split(' '),
);
const GEONAMES = ['US', 'PR', 'VI', 'GU', 'AS', 'MP'];
// A truncated download would otherwise ship a smaller file without complaint.
export const EXPECTED_ROWS = 33791;

const lines = (text) => text.split(/\r?\n/).filter((line) => line.trim() !== '');
const round2 = (x) => Math.round(x * 100) / 100;
// Number('') is 0, so a blank field would otherwise pass the range check as (0, 0).
// Guam and Northern Mariana longitudes carry an explicit '+'.
const coord = (s) => (/^[-+]?\d+(\.\d+)?$/.test(s) ? Number(s) : NaN);

function placeNames(geonamesTexts) {
  const places = new Map();
  for (const text of geonamesTexts) {
    for (const line of lines(text)) {
      const [country, code, city, , admin1] = line.split('\t').map((f) => f.trim());
      // Territory files put a municipio code in admin1; their country code is the USPS abbreviation.
      const state = country === 'US' ? admin1 : country;
      // Military APO/FPO duplicates have no state; keep the row that names one.
      if (!places.has(code) || (!places.get(code).state && state)) places.set(code, { city, state });
    }
  }
  return places;
}

export function join(gazetteerText, geonamesTexts) {
  const [header, ...rows] = lines(gazetteerText);
  // 2026 is pipe-delimited; earlier vintages were tab-delimited with padded fields.
  const delimiter = header.includes('|') ? '|' : '\t';
  const columns = header.split(delimiter).map((f) => f.trim());
  const [iZip, iLat, iLon] = ['GEOID', 'INTPTLAT', 'INTPTLONG'].map((name) => {
    const i = columns.indexOf(name);
    if (i < 0) throw new Error(`Gazetteer header has no ${name} column`);
    return i;
  });
  const places = placeNames(geonamesTexts);
  const out = { zip: [], city: [], state: [], lat: [], lon: [] };
  const missing = [];

  for (const row of rows) {
    const fields = row.split(delimiter).map((f) => f.trim());
    const zip = fields[iZip];
    const lat = coord(fields[iLat]);
    const lon = coord(fields[iLon]);
    if (!/^\d{5}$/.test(zip)) throw new Error(`bad ZCTA code: ${zip}`);
    if (!(Math.abs(lat) <= 90 && Math.abs(lon) <= 180)) throw new Error(`bad coordinates for ${zip}`);
    const prev = out.zip.at(-1);
    if (prev !== undefined && zip <= prev) throw new Error(`ZCTA ${zip} out of order after ${prev}`);
    const place = places.get(zip);
    if (!place) {
      missing.push(zip);
      continue;
    }
    if (!STATES.has(place.state)) throw new Error(`unknown state "${place.state}" for ${zip}`);
    if (!place.city) throw new Error(`empty place name for ${zip}`);
    out.zip.push(zip);
    out.city.push(place.city);
    out.state.push(place.state);
    out.lat.push(round2(lat));
    out.lon.push(round2(lon));
  }
  if (missing.length) throw new Error(`ZCTAs with no GeoNames row: ${missing.join(', ')}`);
  return out;
}

function main() {
  const read = (name) => readFileSync(new URL(`raw/${name}`, import.meta.url), 'utf8');
  const data = join(
    read('2026_Gaz_zcta_national.txt'),
    GEONAMES.map((cc) => read(`${cc}.txt`)),
  );
  if (data.zip.length !== EXPECTED_ROWS) {
    throw new Error(`expected ${EXPECTED_ROWS} rows, got ${data.zip.length}`);
  }
  const json = JSON.stringify(data) + '\n';
  writeFileSync(new URL('../public/zips.json', import.meta.url), json);
  console.log(`public/zips.json: ${data.zip.length} rows, ${Buffer.byteLength(json)} bytes`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main();
