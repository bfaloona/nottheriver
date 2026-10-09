"""Step 3b: the same name match against Overture Places, read straight from the public parquet
on S3 with DuckDB (no account, no key; the bbox predicate lets DuckDB skip row groups). One query
per expected location, over the bounding box of the group's accept radius plus half a mile, the
same radius the Overpass step uses. Raw rows are cached per place in raw/overture/; delete a file
to redo it.

    python3 -m venv .venv-overture && .venv-overture/bin/pip install duckdb
    .venv-overture/bin/python -I docs/evidence/quality/open-place-coverage/overture.py
"""
import json
import math
import re
import sys
import time
from datetime import datetime, timezone
from pathlib import Path

import duckdb

DIR = Path("docs/evidence/quality/open-place-coverage")
RAW = DIR / "raw" / "overture"
RELEASE = "2026-09-23.1"
PARQUET = f"s3://overturemaps-us-west-2/release/{RELEASE}/theme=places/type=place/*"
COLUMNS = """id, names.primary AS name, basic_category, taxonomy.primary AS taxonomy_primary,
  taxonomy.hierarchy AS taxonomy_hierarchy, confidence, websites, phones, brand.names.primary AS brand,
  brand.wikidata AS brand_wikidata, addresses[1].freeform AS address, addresses[1].locality AS locality,
  sources[1].dataset AS source_dataset, sources[1].update_time AS source_update_time, operating_status,
  version, bbox.xmin AS lon, bbox.ymin AS lat"""


def accept_radius_mi(shop, geocode):
    """Mirror of radius.mjs: the hand-mapped radius, widened when Nominatim fell back."""
    if not geocode["fallback"]:
        return shop["radius_mi"]
    parts = len(geocode["used"].split(","))
    return max(shop["radius_mi"], 3 if parts >= 3 else 6)


def slug(s):
    return re.sub(r"^-|-$", "", re.sub(r"[^a-z0-9]+", "-", s.lower()))


def main():
    shops = json.loads((DIR / "shops.json").read_text())
    geo = json.loads((DIR / "raw" / "nominatim.json").read_text())
    RAW.mkdir(parents=True, exist_ok=True)
    groups = {}
    for s in shops:
        groups.setdefault(s["place"], []).append(s)
    con = duckdb.connect()
    con.execute("INSTALL httpfs; LOAD httpfs; SET s3_region='us-west-2';")
    for place, group in groups.items():
        out = RAW / f"{slug(place)}.json"
        if out.exists():
            continue
        g = geo[place]
        if not g.get("hit"):
            print(f"{place}: no geocode, skipped")
            continue
        radius_mi = max(accept_radius_mi(s, g) for s in group) + 0.5
        lat, lon = g["hit"]["lat"], g["hit"]["lon"]
        dlat = radius_mi / 69.0
        dlon = radius_mi / (69.0 * math.cos(math.radians(lat)))
        pattern = "(?i)" + "|".join(dict.fromkeys(s["name_re"] for s in group))
        sql = f"""
SELECT {COLUMNS}
FROM read_parquet('{PARQUET}', hive_partitioning=1)
WHERE bbox.xmin BETWEEN {lon - dlon} AND {lon + dlon} AND bbox.ymin BETWEEN {lat - dlat} AND {lat + dlat}
  AND (regexp_matches(names.primary, $re) OR regexp_matches(coalesce(brand.names.primary, ''), $re))
"""
        t0 = time.time()
        cur = con.execute(sql, {"re": pattern})
        cols = [d[0] for d in cur.description]
        rows = [dict(zip(cols, r)) for r in cur.fetchall()]
        out.write_text(json.dumps({
            "place": place, "release": RELEASE, "radius_mi": radius_mi, "center": g["hit"],
            "bbox": [lon - dlon, lat - dlat, lon + dlon, lat + dlat], "pattern": pattern,
            "fetched": datetime.now(timezone.utc).isoformat(), "rows": rows,
        }, indent=1, default=str) + "\n")
        print(f"{place}: {len(rows)} rows in {time.time() - t0:.1f}s (r={radius_mi} mi)")
        sys.stdout.flush()


if __name__ == "__main__":
    main()
