# Record book: DICK'S Sporting Goods claim sheet

**Gate: nothing in this sheet is shown on the site until the owner has read every row and has taken advice on the wording of findings and of "checked, none found" (ES9 in `docs/ethics-data-strategies.md`).**

Answer: under the proposed rule DICK'S has no finding. OSHA: 10 cases in the window, 9 final, none at $100,000 or more; the largest final penalty is $33,100 (Schaumburg, IL). Wage and hour: no case with money owed in the window (one in-window case is another business). FTC: checked, none found in the window, though the press release search returned no results at all (gap G12). Certifications: none found.

Checked 2026-11-15 by one agent; not yet checked by a second agent. Window: actions dated 2021-11-15 to 2026-11-15. Proposed rule: a final penalty or settlement of $100,000 or more. Every case is in `dicks-cases.tsv`; this page lists cases of $10,000 or more.

## Legal entities accepted

From DICK'S Sporting Goods, Inc.'s latest 10-K (filed 2026-03-27, accession 0001089063-26-000007), Exhibit 21, subsidiaries as of 2026-01-31 (some Foot Locker subsidiaries omitted). US entities include DICK'S Sporting Goods, Inc. (parent), American Sports Licensing, LLC, Chick's Sporting Goods, LLC, Dick's Merchandising & Supply Chain, Inc., DSG Finance, LLC, DSG of Virginia, LLC, DSG Ventures, LLC, Galyan's Trading Company, LLC, GameChanger Media, Inc., Golf Galaxy, LLC, Golf Galaxy GolfWorks, Inc., Moosejaw Loyalty, LLC, New Moosejaw, LLC, Team Edition Apparel, Inc., and Foot Locker, Inc. with its US subsidiaries (Foot Locker Group Holdings, Inc., Foot Locker Retail, Inc. and others). Former parent name in EDGAR: Dicks Sporting Goods Inc. Source: https://www.sec.gov/Archives/edgar/data/1089063/000108906326000007/dks-exhibit_21x20260131.htm

## Counts per source

| Source | Cases in window | Final: under $10,000 / $10,000 to under $100,000 / $100,000 or more | Not final: same bands | Meet the proposed rule | What was searched |
|---|---|---|---|---|---|
| S1 OSHA | 10 (inspections with a penalty above $0). Of 32 inspections matched since 2020-11-15: 17 had violation rows, 16 had a current penalty above $0; of those, 3 are dated before the window; excluded in the window: 3 (below) | 9: 6 / 3 / 0 | 1: 0 / 1 / 0 | 0 | `estab_name like` `%DICK'S SPORTING%` (15), `%DICKS SPORTING%` (10), `%DICK'S%` (22), opened after 2020-11-15; violations in 1 part |
| S2 Wage and hour (WHD) | 0 with money owed; 0 at $0 | 0 (assumed final): 0 / 0 / 0 | n/a | 0 | `legal_name` and `trade_nm` like each pattern in upper and title case, all dates: 33 cases matched, 1 in the window (0 with money, 0 at $0, 1 excluded) |
| S3 FTC | 0: checked, none found | n/a | n/a | 0 | ftc.gov case search `dick's sporting goods` (20 results, all read) and press release search `dick's sporting goods` ("No results found") |
| S4 Certifications | 0 listings | n/a | n/a | n/a | Climate Label, Fair Trade, worker co-op directory, Grassroots list by page; B Corp and 1% for the Planet by one web search each (fetch refused in the trial; see `routes.md`) |

The 9 final S1 penalties add up to $85,685. The rule applies per case, so the sums do not count; they are given so the owner can see what a per-company total would do.

FTC: checked, none found. The case search found the 2008-11-21 DICK'S case (before the window), so the apostrophe did not block it; the press release search returned "No results found", which may or may not be the apostrophe (gap G12). Nothing shows a missed release.

Checked, none found: Climate Label (`explore.changeclimate.org/brand/dicks-sporting-goods` shows "Brand Not Found"), Fair Trade Certified brand list, US Federation of Worker Cooperatives directory, Grassroots Outdoor Alliance retailer list. Not shown either way: B Corp and 1% for the Planet (one web search each, no listing in the results; a search cannot show absence).

## Claims

The proposed claims are agent-written. ADR 0004 (`docs/decisions/0004-down-ranking.md`) shows the source's own title, not model text, so the owner must rule on whether any of this wording may be shown. AT2 and AT2b rows quote the name as given and mark the entity as inferred. S1 source links are DOL API queries that answer only with a free key, so a public link is still needed before display (`routes.md`, S1 gaps). "Was contested" means a violation in the case carries a contest date. S1 amounts are current penalties summed over violations not deleted. S2 amounts are back wages agreed to be paid plus civil penalties assessed; the plan has not ruled whether back wages count toward the rule.

| Row | Source | Case id | Action date | Amount | Final | Meets rule | Name as given | Address | Legal entity | Why it belongs | Source URL | Proposed claim |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| D1 | S1 | 348707761 | 2026-06-10 | $33,100 | yes | no | DICK'S SPORTING GOODS, INC. | 601 N. Martingale Road, Suite 195, Schaumburg, IL | Dick's Sporting Goods, Inc. | AT1: Parent name | [API](https://apiprod.dol.gov/v4/get/OSHA/inspection/json?filter_object=%7B%22field%22%3A%22activity_nr%22%2C%22operator%22%3A%22eq%22%2C%22value%22%3A348707761%7D) | Workplace safety inspectors cited Dick's Sporting Goods, Inc. at a site in Schaumburg, IL, after an inspection opened 2026-01-23; the final penalty was $33,100 (2026-06-10). |
| D2 | S1 | 348752833 | 2026-06-25 | $21,000 | no; was contested | no | 68855 - DICKS SPORTING GOODS INC | 7900 Shelbyville Road, Lyndon, KY | Dick's Sporting Goods, Inc. | AT1: Parent name | [API](https://apiprod.dol.gov/v4/get/OSHA/inspection/json?filter_object=%7B%22field%22%3A%22activity_nr%22%2C%22operator%22%3A%22eq%22%2C%22value%22%3A348752833%7D) | Workplace safety inspectors cited Dick's Sporting Goods, Inc. at a site in Lyndon, KY, after an inspection opened 2026-02-16; the case is not final, with a penalty of $21,000 as of the data load. |
| D4 | S1 | 347925760 | 2025-02-09 | $11,528 | yes | no | 317738287 - DICK'S SPORTING GOODS INC | 293 Rossanley Dr, Medford, OR | Dick's Sporting Goods, Inc. | AT1: Parent name | [API](https://apiprod.dol.gov/v4/get/OSHA/inspection/json?filter_object=%7B%22field%22%3A%22activity_nr%22%2C%22operator%22%3A%22eq%22%2C%22value%22%3A347925760%7D) | Workplace safety inspectors cited Dick's Sporting Goods, Inc. at a site in Medford, OR, after an inspection opened 2024-10-25; the final penalty was $11,528 (2025-02-09). |
| D5 | S1 | 346655665 | 2023-10-23 | $11,252 | yes | no | DICKS SPORTING GOODS, INC. | 1314 Conklin Road, Conklin, NY | Dick's Sporting Goods, Inc. | AT1: Parent name | [API](https://apiprod.dol.gov/v4/get/OSHA/inspection/json?filter_object=%7B%22field%22%3A%22activity_nr%22%2C%22operator%22%3A%22eq%22%2C%22value%22%3A346655665%7D) | Workplace safety inspectors cited Dick's Sporting Goods, Inc. at a site in Conklin, NY, after an inspection opened 2023-04-25; the final penalty was $11,252 (2023-10-23). |

### S2 cases at $0 in the window (0)

| Case id | Findings end | Violations | Trade name / legal name as given | City, state |
|---|---|---|---|---|

### Excluded rows

| Source | Rule | Reason | Count | Names as given (up to 6) | Case ids of $10,000 or more |
|---|---|---|---|---|---|
| S1 | AT5 | Another business with Dick's or Dicks in its name | 3 | MARKQUART RV DICK'S LLC; HADDICK'S TOWING, LLC; DICK'S ROOF REPAIR SERVICE, INC. | 348092776 ($38,100) |
| S2 | AT5 | Another business with Dick's or Dicks in its name | 1 | Dick's Drive-In Restaurants Inc. / Dick's Drive-Ins, Ltd. L.P. | none |

Not reached by this check: Foot Locker, Golf Galaxy, Moosejaw and other subsidiaries without "Dick's" in the name (gap G17); inspections opened before 2020-11-15 that became final in the window; state wage agencies and private lawsuits.
