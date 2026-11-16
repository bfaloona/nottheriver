# Record book: Lowe's claim sheet

**Gate: nothing in this sheet is shown on the site until the owner has read every row and has taken advice on the wording of findings and of "checked, none found" (ES9 in `docs/ethics-data-strategies.md`).**

Answer: under the proposed rule Lowe's has no finding. OSHA: 60 cases in the window, 53 final, none at $100,000 or more; the largest final penalty is $15,475 (Palm Springs, CA) and the largest not final is $41,140 (Honolulu, HI). Wage and hour: 1 case with money owed ($5,000 in back wages). FTC: checked, none found, but the case search returned nothing for the name with an apostrophe, a likely miss (gap G12). Certifications: none found.

Checked 2026-11-15 by one agent; not yet checked by a second agent. Window: actions dated 2021-11-15 to 2026-11-15. Proposed rule: a final penalty or settlement of $100,000 or more. Every case is in `lowes-cases.tsv`; this page lists cases of $10,000 or more.

## Legal entities accepted

From Lowe's Companies, Inc.'s latest 10-K (filed 2026-03-23, accession 0000060667-26-000029), Exhibit 21.1 (all other subsidiaries omitted). US entities: Lowe's Companies, Inc. (parent), Lowe's Home Centers, LLC, Foundation Building Materials, Inc. No former parent name in EDGAR. Source: https://www.sec.gov/Archives/edgar/data/60667/000006066726000029/exhibit211_01302026.htm

## Counts per source

| Source | Cases in window | Final: under $10,000 / $10,000 to under $100,000 / $100,000 or more | Not final: same bands | Meet the proposed rule | What was searched |
|---|---|---|---|---|---|
| S1 OSHA | 60 (inspections with a penalty above $0). Of 282 inspections matched since 2020-11-15: 99 had violation rows, 77 had a current penalty above $0; of those, 6 are dated before the window; excluded in the window: 11 (below) | 53: 49 / 4 / 0 | 7: 4 / 3 / 0 | 0 | `estab_name like` `%LOWE'S%` (185) and `%LOWES%` (97), opened after 2020-11-15; violations in 1 part |
| S2 Wage and hour (WHD) | 1 with money owed; 4 at $0 (table below); 2 with no dates (case 5095165, 5093687, gap G9) | 1 (assumed final): 1 / 0 / 0 | n/a | 0 | `legal_name` and `trade_nm` like each pattern in upper and title case, all dates: 79 cases matched, 5 in the window (1 with money, 4 at $0, 0 excluded) |
| S3 FTC | 0: checked, none found | n/a | n/a | 0 | ftc.gov case search `lowe's` ("No results found") and press release search `lowe's` (1 result, 2000, Delhaize/Hannaford merger) |
| S4 Certifications | 0 listings | n/a | n/a | n/a | Climate Label, Fair Trade, worker co-op directory, Grassroots list by page; B Corp and 1% for the Planet by one web search each (fetch refused in the trial; see `routes.md`) |

The 53 final S1 penalties add up to $205,821, and the 1 S2 cases to $5,000 (back wages $5,000; civil penalties $0). The rule applies per case, so the sums do not count; they are given so the owner can see what a per-company total would do.

FTC: checked, none found, with a likely weakness: the case search for `lowe's` returned "No results found", while a 2009 case found by the Walmart search names "Lowe’s" (curly apostrophe) in its summary (gap G12). An FTC case naming Lowe's may be missed by this route.

Checked, none found: Climate Label (`explore.changeclimate.org/brand/lowes` shows "Brand Not Found"), Fair Trade Certified brand list, US Federation of Worker Cooperatives directory, Grassroots Outdoor Alliance retailer list. Not shown either way: B Corp and 1% for the Planet (one web search each, no listing in the results; a search cannot show absence).

## Claims

The proposed claims are agent-written. ADR 0004 (`docs/decisions/0004-down-ranking.md`) shows the source's own title, not model text, so the owner must rule on whether any of this wording may be shown. AT2 and AT2b rows quote the name as given and mark the entity as inferred. S1 source links are DOL API queries that answer only with a free key, so a public link is still needed before display (`routes.md`, S1 gaps). "Was contested" means a violation in the case carries a contest date. S1 amounts are current penalties summed over violations not deleted. S2 amounts are back wages agreed to be paid plus civil penalties assessed; the plan has not ruled whether back wages count toward the rule.

| Row | Source | Case id | Action date | Amount | Final | Meets rule | Name as given | Address | Legal entity | Why it belongs | Source URL | Proposed claim |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| L1 | S1 | 348432576 | 2025-10-03 | $41,140 | no; was contested | no | LOWE'S HOME CENTERS LLC | 411 Pacific St, Honolulu, HI | Lowe's Home Centers, LLC | AT1: Subsidiary named in Exhibit 21 | [API](https://apiprod.dol.gov/v4/get/OSHA/inspection/json?filter_object=%7B%22field%22%3A%22activity_nr%22%2C%22operator%22%3A%22eq%22%2C%22value%22%3A348432576%7D) | Workplace safety inspectors cited Lowe's Home Centers, LLC at a site in Honolulu, HI, after an inspection opened 2025-08-11; the case is not final, with a penalty of $41,140 as of the data load. |
| L3 | S1 | 346074156 | 2022-11-29 | $19,060 | no; was contested | no | LOWE'S HOME CENTERS, LLC | 14873 Carmenita Rd., Norwalk, CA | Lowe's Home Centers, LLC | AT1: Subsidiary named in Exhibit 21 | [API](https://apiprod.dol.gov/v4/get/OSHA/inspection/json?filter_object=%7B%22field%22%3A%22activity_nr%22%2C%22operator%22%3A%22eq%22%2C%22value%22%3A346074156%7D) | Workplace safety inspectors cited Lowe's Home Centers, LLC at a site in Norwalk, CA, after an inspection opened 2022-07-13; the case is not final, with a penalty of $19,060 as of the data load. |
| L4 | S1 | 346385321 | 2023-03-01 | $18,000 | no; was contested | no | LOWE'S HOME CENTERS, LLC | 3984 Indian Ave., Perris, CA | Lowe's Home Centers, LLC | AT1: Subsidiary named in Exhibit 21 | [API](https://apiprod.dol.gov/v4/get/OSHA/inspection/json?filter_object=%7B%22field%22%3A%22activity_nr%22%2C%22operator%22%3A%22eq%22%2C%22value%22%3A346385321%7D) | Workplace safety inspectors cited Lowe's Home Centers, LLC at a site in Perris, CA, after an inspection opened 2022-12-12; the case is not final, with a penalty of $18,000 as of the data load. |
| L5 | S1 | 348638057 | 2026-02-03 | $15,475 | yes | no | LOWE'S HOME CENTERS | 5201 E. Ramon Road, Palm Springs, CA | Lowe's Home Centers, LLC (inferred) | AT2b: Bare banner name, no other employer named; the source does not name the legal entity | [API](https://apiprod.dol.gov/v4/get/OSHA/inspection/json?filter_object=%7B%22field%22%3A%22activity_nr%22%2C%22operator%22%3A%22eq%22%2C%22value%22%3A348638057%7D) | Workplace safety inspectors cited "LOWE'S HOME CENTERS" at a site in Palm Springs, CA, after an inspection opened 2025-12-10; the final penalty was $15,475 (2026-02-03). |
| L6 | S1 | 345447601 | 2022-02-02 | $13,653 | yes | no | LOWE'S HOME CENTERS, INC. | 101 Willow Lane, Mcdonough, GA | Lowe's Home Centers, LLC | AT1: Subsidiary named in Exhibit 21 | [API](https://apiprod.dol.gov/v4/get/OSHA/inspection/json?filter_object=%7B%22field%22%3A%22activity_nr%22%2C%22operator%22%3A%22eq%22%2C%22value%22%3A345447601%7D) | Workplace safety inspectors cited Lowe's Home Centers, LLC at a site in Mcdonough, GA, after an inspection opened 2021-07-29; the final penalty was $13,653 (2022-02-02). |
| L8 | S1 | 346772874 | 2023-08-02 | $11,700 | yes | no | 154450 - LOWE'S HOME CENTERS, LLC | 1716 E. Main Street, Sylva, NC | Lowe's Home Centers, LLC | AT1: Subsidiary named in Exhibit 21 | [API](https://apiprod.dol.gov/v4/get/OSHA/inspection/json?filter_object=%7B%22field%22%3A%22activity_nr%22%2C%22operator%22%3A%22eq%22%2C%22value%22%3A346772874%7D) | Workplace safety inspectors cited Lowe's Home Centers, LLC at a site in Sylva, NC, after an inspection opened 2023-06-08; the final penalty was $11,700 (2023-08-02). |
| L9 | S1 | 347086480 | 2024-05-09 | $11,291 | yes | no | LOWE'S HOME CENTERS LLC #1197 | 510 Quaker Lane, Warwick, RI | Lowe's Home Centers, LLC | AT1: Subsidiary named in Exhibit 21 | [API](https://apiprod.dol.gov/v4/get/OSHA/inspection/json?filter_object=%7B%22field%22%3A%22activity_nr%22%2C%22operator%22%3A%22eq%22%2C%22value%22%3A347086480%7D) | Workplace safety inspectors cited Lowe's Home Centers, LLC at a site in Warwick, RI, after an inspection opened 2023-11-07; the final penalty was $11,291 (2024-05-09). |

### S2 cases at $0 in the window (4)

| Case id | Findings end | Violations | Trade name / legal name as given | City, state |
|---|---|---|---|---|
| 1991667 | 2024-03-26 | 0 | Lowe's / Lowe's Companies, Inc. | LAKE CITY, FL |
| 1995647 | 2024-04-27 | 0 | Lowe's Home Improvement / Lowe's Home Centers, LLC. | FORT WAYNE, IN |
| 1992514 | 2024-04-15 | 1 | Lowe's / Lowe�s Home Centers, LLC | BEAR, DE |
| 1979819 | 2023-04-13 | 0 | Lowes / Lowe�s Home Centers, LLC | EL PASO, TX |

### Excluded rows

| Source | Rule | Reason | Count | Names as given (up to 6) | Case ids of $10,000 or more |
|---|---|---|---|---|---|
| S1 | none | Fits no rule; owner to rule | 4 | LOWE'S HOME IMPROVEMENT, LLC; 67007 - LOWES HOME IMPROVEMENT LLC; LOWES HOME IMPROVEMENT CENTERS, LLC. | 348610817 ($13,240), 346654338 ($10,000) |
| S1 | AT5 | Another business with Lowe or Lowes in its name | 6 | LOWE'S MARKET; 77040 - LOWES FOODS; LOWEST PRICE AUTO SALES, LLC.; 158304 - LOWES FOODS, LLC; FELLOWES, INC.; FELLOWES MANUFACTURING COMPANY | 347115404 ($18,000) |
| S1 | AT3 | Banner word with another business named | 1 | LOWES ROOFING AND REMODELING LLC | none |

## Notes

- Four in-window OSHA rows name "Lowe's Home Improvement, LLC" or "Lowes Home Improvement Centers, LLC", which are not Exhibit 21 names; they fit no rule and go to the owner (two at $10,000 or more: 348610817, $13,240; 346654338, $10,000).
- The broad patterns also matched Lowes Foods, Fellowes and others; excluded under AT5.

Not reached by this check: Foundation Building Materials and other subsidiaries without "Lowe's" in the name (gap G17); inspections opened before 2020-11-15 that became final in the window; state wage agencies and private lawsuits.
