# OSHA concern status check (2026-09-25)

Checked every `concerns` row sourced from osha.gov against brief.md section 9's OSHA rule (a citation counts only if it carries a penalty and the case is not still open). All 18 rows across 9 retailer files pass the rule as recorded; none moved.

| file | inspection | penalty | closed? | result (kept / moved) |
|---|---|---|---|---|
| avocadogreenmattress-com.md | 1582670.015 | $3,000 (reduced from $5,000) | closed 2024-11-18 | kept |
| avocadogreenmattress-com.md | 1658946.015 | $935 | closed 2023-11-20 | kept |
| azurestandard-com.md | 1574338.015 | $1,800 | closed 2022-06-07 | kept |
| azurestandard-com.md | 1647478.015 | $1,000 | closed 2023-07-07 | kept |
| azurestandard-com.md | 1665055.015 | $570 | closed 2023-10-26 | kept |
| bhphotovideo-com.md | 1552934.015 | $14,502 | closed 2025-02-04 | kept |
| bhphotovideo-com.md | 1369750.015 | $7,085 (reduced from $10,419) | closed 2025-02-04 | kept |
| barnesandnoble-com.md | 1700421.015 | $13,828 | closed 2024-05-31 | kept |
| bobsredmill-com.md | 1637323.015 | $1,350 | closed 2023-05-03 | kept |
| chewy-com.md | 1648417.015 | $10,000 (reduced from $16,072) | closed 2024-02-16 | kept |
| chewy-com.md | 1545401.015 | $5,851 | closed 2022-07-19 | kept |
| chewy-com.md | 1425169.015 | $4,347 | closed 2020-01-07 | kept |
| chewy-com.md | 1223545.015 | $6,156 | closed 2017-09-29 | kept |
| costco-com.md | 1763330.015 | $9,403 (reduced from $11,754) | closed 2025-08-28 | kept |
| costco-com.md | 1640222.015 | $1,330 (reduced from $7,905) | closed 2026-03-25 | kept |
| costco-com.md | 1356334.015 | $560 (reduced from $14,430) | closed 2019-09-03 | kept |
| thrivemarket-com.md | 1724624.015 | $3,306 (reduced from $6,612) | closed 2024-06-05 | kept |
| thredup-com.md | 1815510.015 | $1,773 (reduced from $2,364) | closed 2025-08-05 | kept |

## Notes
- equalexchange-coop.md matched the `osha.gov` grep only via a search-log source URL (no results); its `concerns:` is already `[]`. Not checked as a concern row.
- Files matching the grep with only "no results" or blocked search URLs and no `inspection_detail` concern row (ableclothing-com, bestbuy-com, betterworldbooks-com, bookshop-org, christydawn-com, credobeauty-com, depop-com, ebay-com, earthhero-com, ecoroots-us, eileenfisher-com, etsy-com, girlfriend-com, grove-co, libro-fm, mightly-com, newegg-com, uncommongoods-com) have no osha.gov concern to check and were left alone.
- No retailer file needed an edit: all recorded OSHA concerns carry a penalty and are closed, matching the rule as originally applied. No ethics/environment/tier recompute was required.
