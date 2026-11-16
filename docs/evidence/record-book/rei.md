# Record book: REI claim sheet

**Gate: nothing in this sheet is shown on the site until the owner has read every row and has taken advice on the wording of findings and of "checked, none found" (ES9 in `docs/ethics-data-strategies.md`).**

Answer: under the proposed rule REI has no finding. OSHA: 5 cases in the window, all final, none at $100,000 or more; the largest is $22,000 (Bedford, PA). Wage and hour: 1 case with money owed ($1,368 in back wages). FTC: checked, none found. Certifications: two listings, Climate Label certified (first certified 2021, current year 2026) and Fair Trade Certified's brand list (product level).

Checked 2026-11-15 by one agent; not yet checked by a second agent. Window: actions dated 2021-11-15 to 2026-11-15. Proposed rule: a final penalty or settlement of $100,000 or more. Every case is in `rei-cases.tsv`; this page lists cases of $10,000 or more.

## Legal entities accepted

REI files no 10-K. From one web search for its annual report: the co-op's 2025 results release (`rei.com/newsroom/article/2025-financials-impact`) links audited consolidated financial statements for the year ended 2026-01-03, which cover "Recreational Equipment, Inc. and its wholly owned subsidiaries" without naming the subsidiaries (gap G16). Entity accepted: Recreational Equipment, Inc. Source: https://www.rei.com/dam/25671793_rei-fy25-issued-financial-statements-2.pdf

## Counts per source

| Source | Cases in window | Final: under $10,000 / $10,000 to under $100,000 / $100,000 or more | Not final: same bands | Meet the proposed rule | What was searched |
|---|---|---|---|---|---|
| S1 OSHA | 5 (inspections with a penalty above $0). Of 16 inspections matched since 2020-11-15: 8 had violation rows, 6 had a current penalty above $0; of those, 1 are dated before the window; excluded in the window: 0 (below) | 5: 4 / 1 / 0 | 0: 0 / 0 / 0 | 0 | `estab_name like` `%RECREATIONAL EQUIPMENT%` (16) and `REI` as a whole name (0), opened after 2020-11-15; violations in 1 part |
| S2 Wage and hour (WHD) | 1 with money owed; 0 at $0 | 1 (assumed final): 1 / 0 / 0 | n/a | 0 | `legal_name` and `trade_nm` like each pattern in upper and title case, all dates: 1 cases matched, 1 in the window (1 with money, 0 at $0, 0 excluded) |
| S3 FTC | 0: checked, none found | n/a | n/a | 0 | ftc.gov case search `rei` (63 results, all read) and press release search `rei` (943 results; pages 0 to 6 read, back to 2020, gap G13) |
| S4 Certifications | 2 listings | n/a | n/a | n/a | Climate Label, Fair Trade, worker co-op directory, Grassroots list by page; B Corp and 1% for the Planet by one web search each (fetch refused in the trial; see `routes.md`) |

The 5 final S1 penalties add up to $37,193, and the 1 S2 cases to $1,368 (back wages $1,368; civil penalties $0). The rule applies per case, so the sums do not count; they are given so the owner can see what a per-company total would do.

FTC: checked, none found. No result title names REI or Recreational Equipment, Inc.; the search matches word stems such as "reimage" and "reimburse".

Checked, none found: US Federation of Worker Cooperatives directory (REI is a consumer co-op), Grassroots Outdoor Alliance retailer list. Not shown either way: B Corp and 1% for the Planet (one web search each, no listing in the results; a search cannot show absence).

## Claims

The proposed claims are agent-written. ADR 0004 (`docs/decisions/0004-down-ranking.md`) shows the source's own title, not model text, so the owner must rule on whether any of this wording may be shown. AT2 and AT2b rows quote the name as given and mark the entity as inferred. S1 source links are DOL API queries that answer only with a free key, so a public link is still needed before display (`routes.md`, S1 gaps). "Was contested" means a violation in the case carries a contest date. S1 amounts are current penalties summed over violations not deleted. S2 amounts are back wages agreed to be paid plus civil penalties assessed; the plan has not ruled whether back wages count toward the rule.

| Row | Source | Case id | Action date | Amount | Final | Meets rule | Name as given | Address | Legal entity | Why it belongs | Source URL | Proposed claim |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| R1 | S1 | 347310195 | 2024-04-22 | $22,000 | yes | no | RECREATIONAL EQUIPMENT, INC. | 1400 Country Ridge Road, Bedford, PA | Recreational Equipment, Inc. | AT1: The co-op's legal name | [API](https://apiprod.dol.gov/v4/get/OSHA/inspection/json?filter_object=%7B%22field%22%3A%22activity_nr%22%2C%22operator%22%3A%22eq%22%2C%22value%22%3A347310195%7D) | Workplace safety inspectors cited Recreational Equipment, Inc. at a site in Bedford, PA, after an inspection opened 2024-02-28; the final penalty was $22,000 (2024-04-22). |

### S2 cases at $0 in the window (0)

| Case id | Findings end | Violations | Trade name / legal name as given | City, state |
|---|---|---|---|---|

### Excluded rows

| Source | Rule | Reason | Count | Names as given (up to 6) | Case ids of $10,000 or more |
|---|---|---|---|---|---|

## Certification listings

| Row | Source | Registry | Date | Name as given | Legal entity | Why it belongs | Source URL | Proposed claim |
|---|---|---|---|---|---|---|---|---|
| R8 | S4 | Climate Label, brand page | Checked 2026-11-15; page shows first certified 2021, current certification year 2026 | REI (website www.rei.com) | Recreational Equipment, Inc. (inferred) | AT2b: banner name linking to the co-op's own site | https://explore.changeclimate.org/brand/rei | REI is listed as a Climate Label certified brand, first certified 2021, with 2026 as its current certification year. |
| R9 | S4 | Fair Trade Certified, "Explore Brands Where You Can Buy Fair Trade" list | Checked 2026-11-15 | REI (linked to rei.com's Fair Trade advice page) | Recreational Equipment, Inc. (inferred) | AT2b: banner name linking to the co-op's own site | https://www.fairtradecertified.org/our-community/shop-fair-trade/ | REI appears in Fair Trade Certified's list of brands that offer Fair Trade Certified products; this covers some products, not the company. |

## Notes

- Bare "REI" is searched as a whole name only (patterns.md). Names that put REI beside other words, such as "REI #45" or "REI CO-OP", are missed.

Not reached by this check: names that put "REI" beside other words; subsidiaries (not named in the statements); inspections opened before 2020-11-15 that became final in the window; state wage agencies and private lawsuits.
