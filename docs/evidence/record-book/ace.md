# Record book: Ace Hardware claim sheet

**Gate: nothing in this sheet is shown on the site until the owner has read every row and has taken advice on the wording of findings and of "checked, none found" (ES9 in `docs/ethics-data-strategies.md`).**

Answer: under the proposed rule Ace Hardware has no finding. OSHA: 4 cases in the window name Ace Hardware Corporation, all final, the largest $43,200 (Rocklin, CA); 51 more in-window OSHA rows name dealer stores or "Ace Hardware" alone and are excluded by the plan's Ace rule ("owner not shown; may be a dealer"), the largest $14,400. Wage and hour: no case for Ace Hardware Corporation or Ace Retail Holdings in the window. FTC: checked, none found. Certifications: none found.

Checked 2026-11-15 by one agent; not yet checked by a second agent. Window: actions dated 2021-11-15 to 2026-11-15. Proposed rule: a final penalty or settlement of $100,000 or more. Every case is in `ace-cases.tsv`; this page lists cases of $10,000 or more.

## Legal entities accepted

Ace files no 10-K. The one web search for its annual report found `acehardware.com/2025-annualreport`, which returned a challenge page to the fetch script (recorded, not retried, gap G15). Ace's own newsroom release of 2026-02-18 (results for fiscal 2025) names Ace Hardware Corporation and its retail subsidiary Ace Retail Holdings LLC ("ARH"), with the Great Lakes Ace Hardware and Westlake chains under it. Entities accepted, by the plan's Ace rule: Ace Hardware Corporation and Ace Retail Holdings LLC when named. Ace is a dealer-owned cooperative: most Ace stores are owned by independent dealers. Source: https://newsroom.acehardware.com/2026-02-18-ACE-HARDWARE-REPORTS-FOURTH-QUARTER-AND-FULL-YEAR-2025-RESULTS

## Counts per source

| Source | Cases in window | Final: under $10,000 / $10,000 to under $100,000 / $100,000 or more | Not final: same bands | Meet the proposed rule | What was searched |
|---|---|---|---|---|---|
| S1 OSHA | 4 (inspections with a penalty above $0). Of 101 inspections matched since 2020-11-15: 63 had violation rows, 57 had a current penalty above $0; of those, 2 are dated before the window; excluded in the window: 51 (below) | 4: 3 / 1 / 0 | 0: 0 / 0 / 0 | 0 | `estab_name like %ACE HARDWARE%` (101), opened after 2020-11-15; violations in 1 part |
| S2 Wage and hour (WHD) | 0 with money owed; 0 at $0 | 0 (assumed final): 0 / 0 / 0 | n/a | 0 | `legal_name` and `trade_nm` like each pattern in upper and title case, all dates: 68 cases matched, 2 in the window (0 with money, 0 at $0, 2 excluded) |
| S3 FTC | 0: checked, none found | n/a | n/a | 0 | ftc.gov case search `ace hardware` (261 results; pages 0 to 3 read, G7 stop at page 1) and press release search `ace hardware` (2 results, read) |
| S4 Certifications | 0 listings | n/a | n/a | n/a | Climate Label, Fair Trade, worker co-op directory, Grassroots list by page; B Corp and 1% for the Planet by one web search each (fetch refused in the trial; see `routes.md`) |

The 4 final S1 penalties add up to $61,015. The rule applies per case, so the sums do not count; they are given so the owner can see what a per-company total would do.

FTC: checked, none found. No result title names Ace Hardware Corporation or Ace Retail Holdings; the case search matches word stems such as "pharmaceuticals".

Checked, none found: Climate Label (`explore.changeclimate.org/brand/ace-hardware` shows "Brand Not Found"), Fair Trade Certified brand list ("ace&jig" is a different brand), US Federation of Worker Cooperatives directory, Grassroots Outdoor Alliance retailer list. Not shown either way: B Corp and 1% for the Planet (one web search each, no listing in the results; a search cannot show absence).

## Claims

The proposed claims are agent-written. ADR 0004 (`docs/decisions/0004-down-ranking.md`) shows the source's own title, not model text, so the owner must rule on whether any of this wording may be shown. AT2 and AT2b rows quote the name as given and mark the entity as inferred. S1 source links are DOL API queries that answer only with a free key, so a public link is still needed before display (`routes.md`, S1 gaps). "Was contested" means a violation in the case carries a contest date. S1 amounts are current penalties summed over violations not deleted. S2 amounts are back wages agreed to be paid plus civil penalties assessed; the plan has not ruled whether back wages count toward the rule.

| Row | Source | Case id | Action date | Amount | Final | Meets rule | Name as given | Address | Legal entity | Why it belongs | Source URL | Proposed claim |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| A1 | S1 | 346051311 | 2023-02-21 | $43,200 | yes; was contested | no | ACE HARDWARE, CORP | 3305 Industrial Ave, Rocklin, CA | Ace Hardware Corporation | AT1: Named entity accepted by the plan's Ace rule | [API](https://apiprod.dol.gov/v4/get/OSHA/inspection/json?filter_object=%7B%22field%22%3A%22activity_nr%22%2C%22operator%22%3A%22eq%22%2C%22value%22%3A346051311%7D) | Workplace safety inspectors cited Ace Hardware Corporation at a site in Rocklin, CA, after an inspection opened 2022-06-28; the final penalty was $43,200 (2023-02-21). |

### S2 cases at $0 in the window (0)

| Case id | Findings end | Violations | Trade name / legal name as given | City, state |
|---|---|---|---|---|

### Excluded rows

| Source | Rule | Reason | Count | Names as given (up to 6) | Case ids of $10,000 or more |
|---|---|---|---|---|---|
| S1 | Ace rule | Owner not shown; may be a dealer | 50 | 112095 - BURGGRAFS ACE HARDWARE OF COTTAGE GROVE CO; ACE HARDWARE OF BEARDEN, LLC; 111196 - PELLICCI INC DBA PELLICCI ACE HARDWARE; GRAND LAKE ACE HARDWARE, INC.; 110676 - PELLICCI INC DBA ACE HARDWARE; 110655 - NFD HARDWARE INC DBA NORTHFIELD ACE HARDWARE | 346478324 ($14,400) |
| S1 | Ace rule | A chain the 2026-02-18 release places under Ace Retail Holdings, but the record does not name Ace Hardware Corporation or Ace Retail Holdings LLC; owner to rule | 1 | WESTLAKE ACE HARDWARE | none |
| S2 | Ace rule | Owner not shown; may be a dealer (trade name; legal name as given: "Mountain View Supply & Rental (Ace Hardware)") | 1 | Dutch Country Ace Hardware / Mountain View Supply & Rental (Ace Hardware) | none |
| S2 | Ace rule | Owner not shown; may be a dealer (trade name; legal name as given: "LKG Hardware/Owens Hardware, Inc.") | 1 | Ace Hardware / LKG Hardware/Owens Hardware, Inc. | none |

## Notes

- The plan's Ace rule excludes "Ace Hardware" alone and dealer names: "owner not shown; may be a dealer". Westlake and Great Lakes rows are excluded for the owner to rule, since the release ties those chains to Ace Retail Holdings but the record does not name it.

Not reached by this check: records naming only Ace Retail Holdings LLC (no pattern can find it, gap G18); inspections opened before 2020-11-15 that became final in the window; state wage agencies and private lawsuits.
