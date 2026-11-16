# Record book: HomeGoods claim sheet

**Gate: nothing in this sheet is shown on the site until the owner has read every row and has taken advice on the wording of findings and of "checked, none found" (ES9 in `docs/ethics-data-strategies.md`).**

Answer: under the proposed rule HomeGoods has no finding. OSHA: 20 cases in the window, all final, none at $100,000 or more; the largest is $64,370 (The Villages, FL, HomeGoods, LLC). Two TJX cases at or above $100,000 ($167,504, case 345964530; $115,000, case 347809493) are excluded by the sibling rule because the record names only TJX, not HomeGoods; the owner may want to see them. Wage and hour: no HomeGoods case in the window. FTC: checked, none found. Certifications: none found.

Checked 2026-11-15 by one agent; not yet checked by a second agent. Window: actions dated 2021-11-15 to 2026-11-15. Proposed rule: a final penalty or settlement of $100,000 or more. Every case is in `homegoods-cases.tsv`; this page lists cases of $10,000 or more.

## Legal entities accepted

HomeGoods is a banner of The TJX Companies, Inc. From TJX's latest 10-K (filed 2026-03-31, accession 0000109198-26-000008), Exhibit 21. HomeGoods entities: HomeGoods, LLC (doing business as HomeGoods, Homesense), H.G. AZ Merchants, LLC, H.G. Conn. Merchants, LLC, H.G. Georgia Merchants, LLC, H.G. Indiana Distributors, LLC, HomeGoods Ohio Merchants LLC, HomeGoods Imports Corp., HomeGoods Fort Worth Merchants, LLC; New York Department Stores de Puerto Rico, Inc. also does business as HomeGoods. Parent: The TJX Companies, Inc., which also runs T.J. Maxx, Marshalls, Sierra and Homesense. Source: https://www.sec.gov/Archives/edgar/data/109198/000010919826000008/tjx-20260131exhibit21.htm

## Counts per source

| Source | Cases in window | Final: under $10,000 / $10,000 to under $100,000 / $100,000 or more | Not final: same bands | Meet the proposed rule | What was searched |
|---|---|---|---|---|---|
| S1 OSHA | 20 (inspections with a penalty above $0). Of 124 inspections matched since 2020-11-15: 58 had violation rows, 39 had a current penalty above $0; of those, 1 are dated before the window; excluded in the window: 18 (below) | 20: 13 / 7 / 0 | 0: 0 / 0 / 0 | 0 | `estab_name like` `%HOMEGOODS%` (61), `%HOME GOODS%` (1), `%TJX%` (62), opened after 2020-11-15; violations in 1 part |
| S2 Wage and hour (WHD) | 0 with money owed; 0 at $0 | 0 (assumed final): 0 / 0 / 0 | n/a | 0 | `legal_name` and `trade_nm` like each pattern in upper and title case, all dates: 27 cases matched, 1 in the window (0 with money, 0 at $0, 1 excluded) |
| S3 FTC | 0: checked, none found | n/a | n/a | 0 | ftc.gov case search `homegoods` and press release search `homegoods` (both "No results found") |
| S4 Certifications | 0 listings | n/a | n/a | n/a | Climate Label, Fair Trade, worker co-op directory, Grassroots list by page; B Corp and 1% for the Planet by one web search each (fetch refused in the trial; see `routes.md`) |

The 20 final S1 penalties add up to $367,958. The rule applies per case, so the sums do not count; they are given so the owner can see what a per-company total would do.

FTC: checked, none found. Both ftc.gov searches returned "No results found"; TJX was not searched (gap G11).

Checked, none found: Climate Label (`explore.changeclimate.org/brand/homegoods` shows "Brand Not Found"), Fair Trade Certified brand list (a "Home Goods" product category icon, not a brand listing), US Federation of Worker Cooperatives directory, Grassroots Outdoor Alliance retailer list. Not shown either way: B Corp and 1% for the Planet (one web search each, no listing in the results; a search cannot show absence).

## Claims

The proposed claims are agent-written. ADR 0004 (`docs/decisions/0004-down-ranking.md`) shows the source's own title, not model text, so the owner must rule on whether any of this wording may be shown. AT2 and AT2b rows quote the name as given and mark the entity as inferred. S1 source links are DOL API queries that answer only with a free key, so a public link is still needed before display (`routes.md`, S1 gaps). "Was contested" means a violation in the case carries a contest date. S1 amounts are current penalties summed over violations not deleted. S2 amounts are back wages agreed to be paid plus civil penalties assessed; the plan has not ruled whether back wages count toward the rule.

| Row | Source | Case id | Action date | Amount | Final | Meets rule | Name as given | Address | Legal entity | Why it belongs | Source URL | Proposed claim |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| G1 | S1 | 347744542 | 2025-03-28 | $64,370 | yes | no | HOMEGOODS, LLC | 3645 Wedgewood Lane, The Villages, FL | HomeGoods, LLC (parent The TJX Companies, Inc.) | AT1: HomeGoods entity named in TJX Exhibit 21 | [API](https://apiprod.dol.gov/v4/get/OSHA/inspection/json?filter_object=%7B%22field%22%3A%22activity_nr%22%2C%22operator%22%3A%22eq%22%2C%22value%22%3A347744542%7D) | Workplace safety inspectors cited HomeGoods, LLC (parent The TJX Companies, Inc.) at a site in The Villages, FL, after an inspection opened 2024-09-10; the final penalty was $64,370 (2025-03-28). |
| G2 | S1 | 346912686 | 2024-02-22 | $57,620 | yes | no | HOMEGOODS, INC. | 5850 University Drive Nw, Huntsville, AL | HomeGoods, LLC (parent The TJX Companies, Inc.) | AT1: HomeGoods entity named in TJX Exhibit 21 | [API](https://apiprod.dol.gov/v4/get/OSHA/inspection/json?filter_object=%7B%22field%22%3A%22activity_nr%22%2C%22operator%22%3A%22eq%22%2C%22value%22%3A346912686%7D) | Workplace safety inspectors cited HomeGoods, LLC (parent The TJX Companies, Inc.) at a site in Huntsville, AL, after an inspection opened 2023-08-16; the final penalty was $57,620 (2024-02-22). |
| G3 | S1 | 347298416 | 2024-04-25 | $52,788 | yes | no | HOMEGOODS, LLC | 50 Gate Road, North Kingstown, RI | HomeGoods, LLC (parent The TJX Companies, Inc.) | AT1: HomeGoods entity named in TJX Exhibit 21 | [API](https://apiprod.dol.gov/v4/get/OSHA/inspection/json?filter_object=%7B%22field%22%3A%22activity_nr%22%2C%22operator%22%3A%22eq%22%2C%22value%22%3A347298416%7D) | Workplace safety inspectors cited HomeGoods, LLC (parent The TJX Companies, Inc.) at a site in North Kingstown, RI, after an inspection opened 2024-02-23; the final penalty was $52,788 (2024-04-25). |
| G4 | S1 | 348176389 | 2025-09-19 | $43,519 | yes | no | HOMEGOODS, LLC. | 21 Airport Road, Westerly, RI | HomeGoods, LLC (parent The TJX Companies, Inc.) | AT1: HomeGoods entity named in TJX Exhibit 21 | [API](https://apiprod.dol.gov/v4/get/OSHA/inspection/json?filter_object=%7B%22field%22%3A%22activity_nr%22%2C%22operator%22%3A%22eq%22%2C%22value%22%3A348176389%7D) | Workplace safety inspectors cited HomeGoods, LLC (parent The TJX Companies, Inc.) at a site in Westerly, RI, after an inspection opened 2025-04-11; the final penalty was $43,519 (2025-09-19). |
| G5 | S1 | 348973934 | 2026-08-17 | $42,561 | yes | no | HOMEGOODS LLC | 3030 West Loop 289 Access Road, Lubbock, TX | HomeGoods, LLC (parent The TJX Companies, Inc.) | AT1: HomeGoods entity named in TJX Exhibit 21 | [API](https://apiprod.dol.gov/v4/get/OSHA/inspection/json?filter_object=%7B%22field%22%3A%22activity_nr%22%2C%22operator%22%3A%22eq%22%2C%22value%22%3A348973934%7D) | Workplace safety inspectors cited HomeGoods, LLC (parent The TJX Companies, Inc.) at a site in Lubbock, TX, after an inspection opened 2026-06-03; the final penalty was $42,561 (2026-08-17). |
| G6 | S1 | 346099716 | 2023-01-27 | $39,000 | yes | no | HOMEGOODS, INC. | 400 Front Street #1, Collegeville, PA | HomeGoods, LLC (parent The TJX Companies, Inc.) | AT1: HomeGoods entity named in TJX Exhibit 21 | [API](https://apiprod.dol.gov/v4/get/OSHA/inspection/json?filter_object=%7B%22field%22%3A%22activity_nr%22%2C%22operator%22%3A%22eq%22%2C%22value%22%3A346099716%7D) | Workplace safety inspectors cited HomeGoods, LLC (parent The TJX Companies, Inc.) at a site in Collegeville, PA, after an inspection opened 2022-07-25; the final penalty was $39,000 (2023-01-27). |
| G7 | S1 | 345845598 | 2022-05-26 | $10,360 | yes | no | HOMEGOODS OHIO MERCHANTS LLC | 2900 Ellsworth Bailey Rd, Warren, OH | HomeGoods Ohio Merchants LLC (parent The TJX Companies, Inc.) | AT1: HomeGoods entity named in TJX Exhibit 21 | [API](https://apiprod.dol.gov/v4/get/OSHA/inspection/json?filter_object=%7B%22field%22%3A%22activity_nr%22%2C%22operator%22%3A%22eq%22%2C%22value%22%3A345845598%7D) | Workplace safety inspectors cited HomeGoods Ohio Merchants LLC (parent The TJX Companies, Inc.) at a site in Warren, OH, after an inspection opened 2022-03-21; the final penalty was $10,360 (2022-05-26). |

### S2 cases at $0 in the window (0)

| Case id | Findings end | Violations | Trade name / legal name as given | City, state |
|---|---|---|---|---|

### Excluded rows

| Source | Rule | Reason | Count | Names as given (up to 6) | Case ids of $10,000 or more |
|---|---|---|---|---|---|
| S1 | SIB-excluded | TJX or another TJX banner; the source does not tie the record to HomeGoods (sibling rule) | 18 | 317738371 - THE TJX CO INC; 108543 - THE TJX COMPANIES INC DBA TJ MAXX; THE TJX COMPANIES, INC.; 317734838 - THE TJX COMPANIES INC; THE TJX COMPANIES, INC; TJX COMPANIES INC. | 348036153 ($65,472), 347879637 ($39,720), 347809493 ($115,000), 347028524 ($58,305), 346684871 ($33,480), 346352297 ($20,190), 345964530 ($167,504) |
| S2 | SIB-excluded | TJX or another TJX banner; the source does not tie the record to HomeGoods (sibling rule) (trade name; legal name as given: "The TJX Companies, Inc") | 1 | Marshalls Distribution Center / The TJX Companies, Inc | none |

## Notes

- Sibling rule: TJX records not tied by the source to HomeGoods, and records at other TJX banners, are excluded (labeled SIB-excluded).
- One accepted row names "HOME GOODS LLC" (two words; Vernon Hills, IL; $9,458), read as HomeGoods, LLC under AT1's allowance for punctuation; the second agent should check it.
- WHD case 5096722 ("T.J. Maxx / The TJX Companies, Inc.", Bend, OR) has no dates and is a T.J. Maxx record; excluded by the sibling rule and not counted.

Not reached by this check: HomeGoods sites recorded only under a TJX entity name without the banner; inspections opened before 2020-11-15 that became final in the window; state wage agencies and private lawsuits.
