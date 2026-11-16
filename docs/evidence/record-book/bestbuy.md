# Record book: Best Buy claim sheet

**Gate: nothing in this sheet is shown on the site until the owner has read every row and has taken advice on the wording of findings and of "checked, none found" (ES9 in `docs/ethics-data-strategies.md`).**

Answer: under the proposed rule Best Buy has no finding. OSHA: 12 cases in the window, 11 final, none at $100,000 or more; the largest final penalty is $35,000 (Piscataway, NJ, Best Buy Co., Inc.). Wage and hour: no case in the window (24 cases matched, all earlier). FTC: checked, none found. Certifications: none found.

Checked 2026-11-15 by one agent; not yet checked by a second agent. Window: actions dated 2021-11-15 to 2026-11-15. Proposed rule: a final penalty or settlement of $100,000 or more. Every case is in `bestbuy-cases.tsv`; this page lists cases of $10,000 or more.

## Legal entities accepted

From Best Buy Co., Inc.'s latest 10-K (filed 2026-03-18, accession 0000764478-26-000009), Exhibit 21.1, subsidiaries at 2026-01-31. US entities include Best Buy Co., Inc. (parent), Best Buy Stores, L.P. (doing business as Best Buy Express, Best Buy Outlet, Best Buy Health, Geek Squad, Magnolia Home Theater, Pacific Sales and others), BBY Services, Inc., BestBuy.com, LLC, Best Buy Texas.com, LLC, Best Buy Warehousing Logistics, LLC, Nichols Distribution, LLC, Magnolia Hi-Fi, LLC, Pacific Sales Kitchen and Bath Centers, LLC, BBY Solutions, Inc., Best Buy Enterprise Services, Inc., Best Buy Purchasing LLC, Best Buy Health, Inc., Best Buy Product Protection, Inc., Best Buy Stores Puerto Rico, LLC and others listed in the source. No former parent name in EDGAR. Source: https://www.sec.gov/Archives/edgar/data/764478/000076447826000009/bby-fy26q4xex211.htm

## Counts per source

| Source | Cases in window | Final: under $10,000 / $10,000 to under $100,000 / $100,000 or more | Not final: same bands | Meet the proposed rule | What was searched |
|---|---|---|---|---|---|
| S1 OSHA | 12 (inspections with a penalty above $0). Of 60 inspections matched since 2020-11-15: 28 had violation rows, 20 had a current penalty above $0; of those, 6 are dated before the window; excluded in the window: 2 (below) | 11: 6 / 5 / 0 | 1: 0 / 1 / 0 | 0 | `estab_name like %BEST BUY%` (60), opened after 2020-11-15; violations in 1 part |
| S2 Wage and hour (WHD) | 0 with money owed; 0 at $0 | 0 (assumed final): 0 / 0 / 0 | n/a | 0 | `legal_name` and `trade_nm` like each pattern in upper and title case, all dates: 24 cases matched, 0 in the window (0 with money, 0 at $0, 0 excluded) |
| S3 FTC | 0: checked, none found | n/a | n/a | 0 | ftc.gov case search `best buy` (73 results, pages 0 to 3 read) and press release search `best buy` (20 results, all read) |
| S4 Certifications | 0 listings | n/a | n/a | n/a | Climate Label, Fair Trade, worker co-op directory, Grassroots list by page; B Corp and 1% for the Planet by one web search each (fetch refused in the trial; see `routes.md`) |

The 11 final S1 penalties add up to $104,307. The rule applies per case, so the sums do not count; they are given so the owner can see what a per-company total would do.

FTC: checked, none found. No result title names Best Buy or a subsidiary as respondent or defendant; the in-window results are other companies matched on "best" or "buy".

Checked, none found: Climate Label (`explore.changeclimate.org/brand/best-buy` shows "Brand Not Found"), Fair Trade Certified brand list, US Federation of Worker Cooperatives directory, Grassroots Outdoor Alliance retailer list. Not shown either way: B Corp and 1% for the Planet (one web search each, no listing in the results; a search cannot show absence).

## Claims

The proposed claims are agent-written. ADR 0004 (`docs/decisions/0004-down-ranking.md`) shows the source's own title, not model text, so the owner must rule on whether any of this wording may be shown. AT2 and AT2b rows quote the name as given and mark the entity as inferred. S1 source links are DOL API queries that answer only with a free key, so a public link is still needed before display (`routes.md`, S1 gaps). "Was contested" means a violation in the case carries a contest date. S1 amounts are current penalties summed over violations not deleted. S2 amounts are back wages agreed to be paid plus civil penalties assessed; the plan has not ruled whether back wages count toward the rule.

| Row | Source | Case id | Action date | Amount | Final | Meets rule | Name as given | Address | Legal entity | Why it belongs | Source URL | Proposed claim |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| B1 | S1 | 348039850 | 2025-08-18 | $35,000 | yes; was contested | no | BEST BUY CO INC. | 300 Ridge Rd, Piscataway, NJ | Best Buy Co., Inc. | AT1: Parent name | [API](https://apiprod.dol.gov/v4/get/OSHA/inspection/json?filter_object=%7B%22field%22%3A%22activity_nr%22%2C%22operator%22%3A%22eq%22%2C%22value%22%3A348039850%7D) | Workplace safety inspectors cited Best Buy Co., Inc. at a site in Piscataway, NJ, after an inspection opened 2025-02-12; the final penalty was $35,000 (2025-08-18). |
| B2 | S1 | 346383995 | 2023-03-13 | $15,625 | yes | no | BEST BUY CO INC. | 300 Ridge Rd, Piscataway, NJ | Best Buy Co., Inc. | AT1: Parent name | [API](https://apiprod.dol.gov/v4/get/OSHA/inspection/json?filter_object=%7B%22field%22%3A%22activity_nr%22%2C%22operator%22%3A%22eq%22%2C%22value%22%3A346383995%7D) | Workplace safety inspectors cited Best Buy Co., Inc. at a site in Piscataway, NJ, after an inspection opened 2022-12-09; the final penalty was $15,625 (2023-03-13). |
| B3 | S1 | 346097181 | 2023-02-15 | $12,947 | yes | no | BEST BUY WAREHOUSE DDC715 | 300 Ridge Road, Piscataway, NJ | Best Buy Stores, L.P. (inferred) | AT2: Banner with a store number or distribution center; the source does not name the legal entity | [API](https://apiprod.dol.gov/v4/get/OSHA/inspection/json?filter_object=%7B%22field%22%3A%22activity_nr%22%2C%22operator%22%3A%22eq%22%2C%22value%22%3A346097181%7D) | Workplace safety inspectors cited "BEST BUY WAREHOUSE DDC715" at a site in Piscataway, NJ, after an inspection opened 2022-07-22; the final penalty was $12,947 (2023-02-15). |
| B4 | S1 | 346664535 | 2023-07-31 | $12,196 | yes | no | BEST BUY STORES, LP | 220 Daniel Webster Hwy, Nashua, NH | Best Buy Stores, L.P. | AT1: Subsidiary named in Exhibit 21.1 | [API](https://apiprod.dol.gov/v4/get/OSHA/inspection/json?filter_object=%7B%22field%22%3A%22activity_nr%22%2C%22operator%22%3A%22eq%22%2C%22value%22%3A346664535%7D) | Workplace safety inspectors cited Best Buy Stores, L.P. at a site in Nashua, NH, after an inspection opened 2023-04-27; the final penalty was $12,196 (2023-07-31). |
| B5 | S1 | 348105677 | 2025-10-06 | $12,059 | yes | no | BEST BUY CO, INC STORE #128 | 5575 South Virginia Street, Reno, NV | Best Buy Co., Inc. | AT1: Parent name | [API](https://apiprod.dol.gov/v4/get/OSHA/inspection/json?filter_object=%7B%22field%22%3A%22activity_nr%22%2C%22operator%22%3A%22eq%22%2C%22value%22%3A348105677%7D) | Workplace safety inspectors cited Best Buy Co., Inc. at a site in Reno, NV, after an inspection opened 2025-03-13; the final penalty was $12,059 (2025-10-06). |
| B6 | S1 | 348482852 | 2026-01-30 | $10,050 | no | no | BEST BUY CO., INC | 21800 E 19th Ave, Aurora, CO | Best Buy Co., Inc. | AT1: Parent name | [API](https://apiprod.dol.gov/v4/get/OSHA/inspection/json?filter_object=%7B%22field%22%3A%22activity_nr%22%2C%22operator%22%3A%22eq%22%2C%22value%22%3A348482852%7D) | Workplace safety inspectors cited Best Buy Co., Inc. at a site in Aurora, CO, after an inspection opened 2025-09-04; the case is not final, with a penalty of $10,050 as of the data load. |

### S2 cases at $0 in the window (0)

| Case id | Findings end | Violations | Trade name / legal name as given | City, state |
|---|---|---|---|---|

### Excluded rows

| Source | Rule | Reason | Count | Names as given (up to 6) | Case ids of $10,000 or more |
|---|---|---|---|---|---|
| S1 | AT5 | Another business with Best Buy in its name, or Best Buy words with another business named | 2 | BEST BUY SHUTTERS LLC; WA317971180 - BEST BUY AUTO SALES LLC | none |

## Notes

- Bare "BEST BUY" without a store number or entity is excluded because the plan denies AT2b for Best Buy (common words).

Not reached by this check: subsidiaries and banners without "Best Buy" in the name (Geek Squad, Magnolia, Pacific Sales and others, gap G17); inspections opened before 2020-11-15 that became final in the window; state wage agencies and private lawsuits.
