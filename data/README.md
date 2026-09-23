# Data

## Zip dataset (`public/zips.json`)

Built by `data/build-zips.mjs` from two sources. The file contains, for every 2020 ZIP Code Tabulation Area (ZCTA), the ZCTA code, a place name, a state or territory abbreviation, and the ZCTA internal-point coordinates rounded to two decimal places (about 1 km). The browser fetches it on first search and converts the typed zip to city, state, and those coordinates; the zip itself never leaves the browser.

**Coordinates and ZCTA list:** U.S. Census Bureau, "ZIP Code Tabulation Areas," Gazetteer Files, 2026, https://www2.census.gov/geo/docs/maps-data/data/gazetteer/2026_Gazetteer/2026_Gaz_zcta_national.zip, accessed 2026-09-23. Record layout: https://www.census.gov/programs-surveys/geography/technical-documentation/records-layout/gaz-record-layouts.html. Work of the U.S. Government, not subject to copyright in the United States (17 U.S.C. §105).

**Place and state names:** GeoNames postal code data, https://download.geonames.org/export/zip/ (files US.zip, PR.zip, VI.zip, GU.zip, AS.zip, MP.zip), accessed 2026-09-23. Licensed under the Creative Commons Attribution 4.0 International License, https://creativecommons.org/licenses/by/4.0/ (terms: https://download.geonames.org/export/zip/readme.txt). GeoNames coordinates are not used.

**Changes made:** joined on the 5-digit code, kept only codes that are 2020 ZCTAs, dropped all columns except place name and state, took the state from the country code for PR, VI, GU, AS and MP, chose the row with a state code where GeoNames lists a code twice, and rounded Census coordinates to two decimals. Not all USPS ZIP Codes are ZCTAs (PO-box-only and single-organization codes usually are not), so some valid ZIP Codes are absent and the site reports them as not found.

### Source files

All downloaded 2026-09-23; the Census file's Last-Modified header was 2026-09-08. GeoNames regenerates its files daily, so the sha256 identifies the exact input behind the committed file; a rebuild on another day may differ.

| File | URL | sha256 of the .zip |
|---|---|---|
| Census 2026 Gazetteer, ZCTA national | https://www2.census.gov/geo/docs/maps-data/data/gazetteer/2026_Gazetteer/2026_Gaz_zcta_national.zip | f1e9046b91f6e60686a99343cb2752834c02b0764939403b331c78c017e2c54c |
| GeoNames US | https://download.geonames.org/export/zip/US.zip | 1899e3d85d99c2fe919df4a0f342c130471090568261392346d7b7122e56c444 |
| GeoNames PR | https://download.geonames.org/export/zip/PR.zip | 1dd73df99db9dafc58fed33f91de83a0910643b6e2a072a5e3e0c63466d28fa8 |
| GeoNames VI | https://download.geonames.org/export/zip/VI.zip | d3273fc210067b6a4d13972cd97ac43449f683be1931e7e90809f98a1e5d1836 |
| GeoNames GU | https://download.geonames.org/export/zip/GU.zip | c22ce7a3518761016d8f576edc0eebed7dabd4b3bfe88f86dac3dd1d733c5073 |
| GeoNames AS | https://download.geonames.org/export/zip/AS.zip | ff8f6971cbb94c763b35c125d20d654a95611b38503b113a4ceb1a1b14867faa |
| GeoNames MP | https://download.geonames.org/export/zip/MP.zip | c97a27acfa70b6a5798b25314063beca428b867ea438cfc8fdb8c1471f0294aa |

### Output (build of 2026-09-23)

- 33,791 rows (every ZCTA in the Gazetteer; the build fails if any lacks a GeoNames place name or if the count changes).
- 1,266,692 bytes raw; 317,402 bytes with `gzip -9`. Actual transfer size depends on the host's compression.
- All place names are ASCII.

### Rebuild

The raw files are not committed (`data/raw/` is gitignored). From the repo root:

```sh
mkdir -p data/raw
curl -fsSLo data/raw/gaz.zip https://www2.census.gov/geo/docs/maps-data/data/gazetteer/2026_Gazetteer/2026_Gaz_zcta_national.zip
for cc in US PR VI GU AS MP; do curl -fsSLo data/raw/$cc.zip https://download.geonames.org/export/zip/$cc.zip; done
shasum -a 256 data/raw/*.zip
for z in data/raw/*.zip; do unzip -o -d data/raw "$z"; done
npm run build:zips
```

Compare the hashes with the table above; if they differ, update the table, the date, and the output figures in the same commit as the new `public/zips.json`. If the Gazetteer row count changes, update `EXPECTED_ROWS` in `data/build-zips.mjs` (the test reads it from there).
