# OC31: OSHA concerns confirmed in DOL open data (2026-09-25)

All 18 OSHA concerns in the retailer files were found in DOL's OSHA open data (apiprod.dol.gov/v4), a channel robots.txt allows, unlike `osha.gov/ords/`. DOL's `activity_nr` is a different id from osha.gov's `NNNNNNN.015`, so each inspection was found with `node research/fetch-osha-dol.mjs name "<pattern>" <limit>` and matched on establishment, close date, citation issue date (the concern's `date`) and penalty, then saved with `fetch <activity_nr>`. Every close date and current penalty matches `osha-status.md`, and every citation issue date matches the concern's `date` in its retailer file.

The concern rows keep their osha.gov `source` links, which a person can open; the DOL API needs a key, so its URLs aren't useful as links. Each retailer file's Sources list names the matching DOL record.

| file | osha.gov id | DOL activity_nr | DOL establishment | issued | closed | current penalty | saved record |
|---|---|---|---|---|---|---|---|
| chewy-com.md | 1648417.015 | 346484173 | CHEWY, INC, Jessup PA | 2023-05-03 | 2024-02-16 | $10,000 (initial $16,072) | [raw/osha-dol/346484173.json](osha-dol/346484173.json) |
| chewy-com.md | 1545401.015 | 345454011 | CHEWY, INC., Ocala FL | 2022-01-14 | 2022-07-19 | $5,851 (initial $5,851) | [raw/osha-dol/345454011.json](osha-dol/345454011.json) |
| chewy-com.md | 1425169.015 | 344251699 | CHEWY, INC., Wilkes Barre PA | 2019-09-27 | 2020-01-07 | $4,347 (initial $4,347) | [raw/osha-dol/344251699.json](osha-dol/344251699.json) |
| chewy-com.md | 1223545.015 | 342235454 | CHEWY, LLC, Mechanicsburg PA | 2017-04-20 | 2017-09-29 | $6,156 (initial $6,156) | [raw/osha-dol/342235454.json](osha-dol/342235454.json) |
| avocadogreenmattress-com.md | 1582670.015 | 345826705 | AVOCADO GREEN BRANDS, LLC, Fullerton CA | 2022-08-11 | 2024-11-18 | $3,000 (initial $5,000) | [raw/osha-dol/345826705.json](osha-dol/345826705.json) |
| avocadogreenmattress-com.md | 1658946.015 | 346589468 | AVOCADO GREEN BRANDS, LLC, Fullerton CA | 2023-08-16 | 2023-11-20 | $935 (initial $935) | [raw/osha-dol/346589468.json](osha-dol/346589468.json) |
| barnesandnoble-com.md | 1700421.015 | 347004210 | BARNES AND NOBLE, Monroe Township NJ | 2024-03-01 | 2024-05-31 | $13,828 (initial $13,828) | [raw/osha-dol/347004210.json](osha-dol/347004210.json) |
| bobsredmill-com.md | 1637323.015 | 346373236 | 317731489 - BOB'S RED MILL NATURAL FOODS INC, Portland OR | 2023-01-03 | 2023-05-03 | $1,350 (initial $1,350) | [raw/osha-dol/346373236.json](osha-dol/346373236.json) |
| costco-com.md | 1763330.015 | 347633307 | COSTCO WHOLESALE, Overland Park KS | 2024-12-06 | 2025-08-28 | $9,403 (initial $11,754) | [raw/osha-dol/347633307.json](osha-dol/347633307.json) |
| costco-com.md | 1640222.015 | 346402225 | COSTCO WHOLESALE CORP #781, Chula Vista CA | 2023-03-15 | 2026-03-25 | $1,330 (initial $7,905) | [raw/osha-dol/346402225.json](osha-dol/346402225.json) |
| costco-com.md | 1356334.015 | 343563342 | COSTCO WHOLESALE CORPORATION, Tracy CA | 2019-03-05 | 2019-09-03 | $560 (initial $14,430) | [raw/osha-dol/343563342.json](osha-dol/343563342.json) |
| thrivemarket-com.md | 1724624.015 | 347246241 | THRIVE MARKET, INC., Mccarran NV | 2024-03-25 | 2024-06-05 | $3,306 (initial $6,612) | [raw/osha-dol/347246241.json](osha-dol/347246241.json) |
| thredup-com.md | 1815510.015 | 348155102 | THREDUP DISTRIBUTION CENTER, Mechanicsburg PA | 2025-05-07 | 2025-08-05 | $1,773 (initial $2,364) | [raw/osha-dol/348155102.json](osha-dol/348155102.json) |
| bhphotovideo-com.md | 1552934.015 | 345529341 | B & H FOTO & ELECTRONICS, CORP., Florence NJ | 2022-02-17 | 2025-02-04 | $14,502 (initial $14,502) | [raw/osha-dol/345529341.json](osha-dol/345529341.json) |
| bhphotovideo-com.md | 1369750.015 | 343697504 | B & H FOTO ELECTRONICS, CORP, Florence NJ | 2019-06-06 | 2025-02-04 | $7,085 (initial $10,419) | [raw/osha-dol/343697504.json](osha-dol/343697504.json) |
| azurestandard-com.md | 1574338.015 | 345743389 | 317729727 - AZURE FARMS INC, Moro OR | 2022-03-10 | 2022-06-07 | $1,800 (initial $1,800) | [raw/osha-dol/345743389.json](osha-dol/345743389.json) |
| azurestandard-com.md | 1647478.015 | 346474786 | 317731933 - AZURE FARMS INC, Moro OR | 2023-03-08 | 2023-07-07 | $1,000 (initial $1,000) | [raw/osha-dol/346474786.json](osha-dol/346474786.json) |
| azurestandard-com.md | 1665055.015 | 346650559 | 317732864 - AZURE FARMS INC, Moro OR | 2023-05-26 | 2023-10-26 | $570 (initial $570) | [raw/osha-dol/346650559.json](osha-dol/346650559.json) |

Notes:
- Thrive Market: two DOL inspections share the dates (McCarran NV 347246241, $3,306; Sparks NV 347246522, $3,111). The concern is the McCarran one, by penalty. Verifier R1 judged Sparks (osha.gov 1724652.015) the same visit (same report ID and open date) and moved it to the body, one inspection being one concern (`raw/verify-R1.md`); it's saved here too.
- Costco: a Sparks NV inspection (347212342) closed the same day as the Chula Vista one, with a $0 current penalty, so it wouldn't count under the OSHA rule (a penalty and a closed case). Saved for reference.
- DOL prefixes the Azure Farms and Bob's Red Mill establishment names (both in Oregon) with a number; the match rests on name, city, dates and penalty.
- The API returns HTTP 429 after about 8 calls; the script now waits and retries.
- ID pattern (observed, not documented): all 18 pairs fit DOL activity_nr = "34" + the osha.gov id's last six digits + one more digit (1648417.015 -> 346484173). A future lookup could filter on that range instead of matching by name; check the pattern first for other regions and years.
