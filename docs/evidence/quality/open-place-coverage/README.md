# Open place data coverage check (2026-10-09)

Evidence behind [docs/open-place-coverage.md](../../../open-place-coverage.md): the 86 graded "nearby" baseline shops of eval20-0925 checked against OpenStreetMap (OSM) and Overture Places. No Brave calls, no calls to the deployed Worker. The baseline is read only to check it against a third dataset; nothing here feeds an eval's candidate selection.

## Files

| File | What it is |
|---|---|
| `build-shops.mjs` -> `shops.json` | The 86 baseline rows (`eval60/grades.json` filtered to the 20 `eval20-0925/method/ids.json` searches, `section: local`, `confirmed: true`) joined to the search's product, category, zip, zip kind and the zip's RUCA code and centroid (`public/zips.json`), plus a hand-mapped expected location (`place`), accept radius (`radius_mi`), name pattern (`name_re`) and optional street hint (`street`) per row. The hand map is in the script |
| `geocode.mjs` -> `raw/nominatim.json` | Nominatim geocode of each of the 56 distinct expected locations (one request a second, User-Agent `nottheriver-coverage-check/0.1`). A place Nominatim could not find was widened one comma-separated part at a time (`fallback: true`, `used` says what was geocoded) |
| `radius.mjs` | The accept radius: the hand-mapped radius, or 3 mi (neighborhood) / 6 mi (city) when the geocode fell back; haversine distance in miles |
| `overpass.mjs` -> `raw/overpass/<place>.json` | One Overpass query per place: every node, way or relation with a `name` or `brand` in the bounding box of the group's widest accept radius plus 0.5 mi, then the group's name patterns applied to `name` and `brand` (case-insensitive), `out center meta`. `user` and `uid` are stripped; way node lists and relation member lists dropped. Each file records the query, the endpoint that answered and the data timestamp (`reply.osm3s.timestamp_osm_base`) |
| `overture.py` -> `raw/overture/<place>.json` | The same box and patterns against Overture Places release `2026-09-23.1`, read straight from the public parquet on S3 with DuckDB (no credentials; the bbox predicate skips row groups). Each file records the box, the pattern and the matching rows |
| `category-rules.json` | Product category -> place tags that make "plausibly sells it" a `yes` or `weak` call from the tag alone; everything else is `no`. OSM entries are `key=value` over `shop`, `amenity`, `craft`; Overture entries are matched against `taxonomy.hierarchy` (which contains `taxonomy.primary`) and `basic_category` |
| `match.mjs` -> `results.json`, `summary.json` | The match and judgment per shop (one row per baseline row, so the two shops that appear in two searches each have two rows), and the counts the report cites |

## Match rule

A shop counts as found when an object whose `name` or `brand` matches its pattern lies within the accept radius of its geocoded expected location: 0.5 mi for a street address read from the baseline URL, 1 mi for a landmark named in the baseline (a mall, a neighborhood, the museum), 6 mi for a small city, 7 to 10 mi for a large one (the hand map says which). When several objects qualify, a `name` match beats a `brand`-only match (a kiosk inside a Walmart carries `brand=Walmart`), then the better-categorized record among same-name duplicates (Overture often holds a store, its pharmacy and its optical counter under one name; a classifier would see all of them), then the nearest. A street hint narrows a city-level match to objects whose street contains it, only when at least one does. `name_match` records whether the baseline name (without its parenthetical) and the matched name are equal after normalization (`exact`), one contains the other (`partial`), or only the pattern links them (`pattern`).

## Category rule

`match.mjs` reads the object's `shop`, `amenity` and `craft` tags (OSM) or its `taxonomy.hierarchy` and `basic_category` (Overture) and looks them up in `category-rules.json` for the search's product category: any `yes` tag wins, then any `weak` tag (the category's own list or the shared general-merchant list), else `no`. An object with none of the three OSM keys is `no` with reason "no shop, amenity or craft tag". The Overture lists were aligned to the vocabulary seen in the raw Overture rows (`basic_category` and `taxonomy.primary` values, listed by a one-off node script over `raw/overture/`) before `match.mjs` first ran; the per-shop judgments were not consulted when writing the lists.

## Rerun

From the repo root:

```
node docs/evidence/quality/open-place-coverage/build-shops.mjs
node docs/evidence/quality/open-place-coverage/geocode.mjs        # skips places already in raw/nominatim.json
node docs/evidence/quality/open-place-coverage/overpass.mjs       # skips places already in raw/overpass/
python3 -m venv .venv-overture && .venv-overture/bin/pip install duckdb
.venv-overture/bin/python -I docs/evidence/quality/open-place-coverage/overture.py   # skips places already in raw/overture/
node docs/evidence/quality/open-place-coverage/match.mjs
```

Delete a raw file to fetch it again. Both OSM and Overture change over time, so a rerun that refetches will not reproduce the counts exactly; `match.mjs` over the saved raw files does.

## Run notes

- Overpass on 2026-10-09: `overpass-api.de` answered with dispatcher errors (`Dispatcher_Client::request_read_and_idx`) and 504s for stretches of the run, and the Kumi and private.coffee mirrors returned 500 on the larger boxes, so the script tries `lz4.overpass-api.de`, `z.overpass-api.de` and `overpass.kumi.systems` in turn with 20 s waits, up to 6 rounds per place; each saved reply names the endpoint and its data timestamp. A regex filter combined with a spatial filter in one Overpass statement timed out at 90 s even for a 1.5 mi radius; the two-stage form (bbox set first, regex on the set) answers in seconds.
- Two rule changes after a first look at the OSM matches, made so the OSM and Overture lists say the same thing: a furniture store (`shop=furniture`, `furniture_store`) is `weak` for kitchen in both lists (it had been `yes` in the Overture list and absent from the OSM list; `shop=interior_decoration` moved with it), and a museum is `no` for books_toys in both (it had been `weak` in the Overture list only). The first change moves Crate & Barrel (Natick Mall, row 5) from `no` to `weak` in OSM; the second moves The Store at Mia (row 50) from `weak` to `no` in Overture.
- The seven Ace Hardware, JAX and museum-shop patterns were tightened after the first Overture pass matched the wrong business (a caterer at the museum, "Jax Fish House", "Butters Creme de la Creme inside Butters' Ace Hardware Building"); the Overture rows were refetched with the final patterns and the Overpass run used them from the start.
