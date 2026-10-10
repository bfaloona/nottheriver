"""Step 1 of the open place data precision check (docs/open-place-precision.md): for each of the 20
graded searches, every Overture Places row inside the bounding box of the search's nearby radius
around the zip centroid whose basic_category, taxonomy.primary or taxonomy.hierarchy carries any
category the coverage check's rule lists as `yes` or `weak` for the search's product category.
Read straight from the public parquet on S3 with DuckDB (no account, no key). Raw rows are cached
per search in raw/<search_id>.json; delete a file to redo it. The haversine radius cut, the tier
judgment and the operating-status filter happen in build-sample.mjs so they are reviewable.

    python3 -m venv <scratch>/venv && <scratch>/venv/bin/pip install duckdb
    <scratch>/venv/bin/python -I docs/evidence/quality/open-place-precision/query-overture.py
"""
import json
import math
import sys
import time
from datetime import datetime, timezone
from pathlib import Path

import duckdb

DIR = Path("docs/evidence/quality/open-place-precision")
RAW = DIR / "raw"
RULES = Path("docs/evidence/quality/open-place-coverage/category-rules.json")
IDS = Path("docs/evidence/quality/eval20-0925/method/ids.json")
RELEASE = "2026-09-23.1"
PARQUET = f"s3://overturemaps-us-west-2/release/{RELEASE}/theme=places/type=place/*"
COLUMNS = """id, names.primary AS name, basic_category, taxonomy.primary AS taxonomy_primary,
  taxonomy.hierarchy AS taxonomy_hierarchy, confidence, websites, phones, brand.names.primary AS brand,
  brand.wikidata AS brand_wikidata, addresses[1].freeform AS address, addresses[1].locality AS locality,
  addresses[1].region AS region, addresses[1].postcode AS postcode,
  sources[1].dataset AS source_dataset, sources[1].update_time AS source_update_time, operating_status,
  version, bbox.xmin AS lon, bbox.ymin AS lat"""


def nearby_radius_mi(ruca):
    """docs/ranking.md, Distance groups: 10 mi for RUCA 1 to 3 (or no code), 30 mi for 4 to 10."""
    return 10 if ruca is None or ruca <= 3 else 30


def main():
    ids = json.loads(IDS.read_text())["ids"]
    queries = {q["id"]: q for q in json.loads(Path("eval/queries.json").read_text())["queries"]}
    zips = json.loads(Path("public/zips.json").read_text())
    rules = json.loads(RULES.read_text())
    RAW.mkdir(parents=True, exist_ok=True)
    con = duckdb.connect()
    con.execute("INSTALL httpfs; LOAD httpfs; SET s3_region='us-west-2';")
    for sid in ids:
        out = RAW / f"{sid}.json"
        if out.exists():
            continue
        q = queries[sid]
        zi = zips["zip"].index(q["zip"])
        lat, lon, ruca = zips["lat"][zi], zips["lon"][zi], zips["ruca"][zi]
        radius_mi = nearby_radius_mi(ruca)
        rule = rules["categories"][q["category"]]
        cats = sorted(set(rule["overture_yes"] + rule["overture_weak"] + rules["overture_weak_all"]))
        dlat = radius_mi / 69.0
        dlon = radius_mi / (69.0 * math.cos(math.radians(lat)))
        sql = f"""
SELECT {COLUMNS}
FROM read_parquet('{PARQUET}', hive_partitioning=1)
WHERE bbox.xmin BETWEEN {lon - dlon} AND {lon + dlon} AND bbox.ymin BETWEEN {lat - dlat} AND {lat + dlat}
  AND (basic_category IN (SELECT unnest($cats)) OR taxonomy.primary IN (SELECT unnest($cats))
       OR list_has_any(taxonomy.hierarchy, $cats))
"""
        t0 = time.time()
        cur = con.execute(sql, {"cats": cats})
        cols = [d[0] for d in cur.description]
        rows = [dict(zip(cols, r)) for r in cur.fetchall()]
        out.write_text(json.dumps({
            "search_id": sid, "product": q["product"], "category": q["category"], "zip": q["zip"],
            "zip_kind": q["zip_kind"], "zip_ruca": ruca, "center": {"lat": lat, "lon": lon},
            "radius_mi": radius_mi, "bbox": [lon - dlon, lat - dlat, lon + dlon, lat + dlat],
            "categories_queried": cats, "release": RELEASE,
            "fetched": datetime.now(timezone.utc).isoformat(), "rows": rows,
        }, indent=1, default=str) + "\n")
        print(f"{sid}: {len(rows)} rows in {time.time() - t0:.1f}s (r={radius_mi} mi, {len(cats)} categories)")
        sys.stdout.flush()


if __name__ == "__main__":
    main()
