# OC31: OSHA concerns matched in DOL open data (2026-09-25)

`node research/fetch-osha-dol.mjs name "<pattern>" <limit>` against DOL's OSHA inspection dataset (apiprod.dol.gov/v4). DOL's `activity_nr` is a different id from osha.gov's `NNNNNNN.015`, so rows are matched by establishment name plus **close date** (from `osha-status.md`). The concern `date` field is not the DOL open date, so open-date matching found nothing.

Not yet checked: penalties (they sit in DOL's violation dataset, keyed by `activity_nr`).

| file | osha.gov id | closed | DOL activity_nr | DOL establishment | match |
|---|---|---|---|---|---|
| chewy-com.md | 1648417.015 | 2024-02-16 | 346484173 | CHEWY, INC, Jessup PA | yes |
| chewy-com.md | 1545401.015 | 2022-07-19 | 345454011 | CHEWY, INC., Ocala FL | yes |
| chewy-com.md | 1425169.015 | 2020-01-07 | 344251699 | CHEWY, INC., Wilkes Barre PA | yes |
| chewy-com.md | 1223545.015 | 2017-09-29 | 342235454 | CHEWY, LLC, Mechanicsburg PA | yes |
| avocadogreenmattress-com.md | 1582670.015 | 2024-11-18 | 345826705 | AVOCADO GREEN BRANDS, LLC, Fullerton CA | yes |
| avocadogreenmattress-com.md | 1658946.015 | 2023-11-20 | 346589468 | AVOCADO GREEN BRANDS, LLC, Fullerton CA | yes |
| barnesandnoble-com.md | 1700421.015 | 2024-05-31 | 347004210 | BARNES AND NOBLE, Monroe Township NJ | yes |
| bobsredmill-com.md | 1637323.015 | 2023-05-03 | 346373236 | BOB'S RED MILL NATURAL FOODS INC, Portland OR | yes |
| costco-com.md | 1763330.015 | 2025-08-28 | 347633307 | COSTCO WHOLESALE, Overland Park KS | yes |
| costco-com.md | 1640222.015 | 2026-03-25 | 346402225 | COSTCO WHOLESALE CORP #781, Chula Vista CA | yes (name matches the concern title; a Sparks NV row closed the same day) |
| costco-com.md | 1356334.015 | 2019-09-03 | 343563342 | COSTCO WHOLESALE CORPORATION, Tracy CA | yes |
| thrivemarket-com.md | 1724624.015 | 2024-06-05 | 347246241 or 347246522 | THRIVE MARKET, INC., McCarran NV / Sparks NV | ambiguous (two rows, same dates) |
| thredup-com.md | 1815510.015 | 2025-08-05 | 348155102 | THREDUP DISTRIBUTION CENTER, Mechanicsburg PA | yes |
| bhphotovideo-com.md | 1552934.015, 1369750.015 | 2025-02-04 | none under `%B%H%PHOTO%` | | not found yet |
| azurestandard-com.md | 1574338.015, 1647478.015, 1665055.015 | | 0 rows under `%AZURE STANDARD%` | | not found yet |

Retries for `%B & H%`, `%FOTO%` and `%AZURE%` hit HTTP 429; rerun later.
