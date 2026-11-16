# Record book: which source routes work

Answer: S1 (OSHA) and S3 (FTC) work. S2 (wage and hour) works through the same script, with one caution: its names are mixed case and the search is case-sensitive. S4 (certifications) works for three of six registries by page fetch; B Corp and 1% for the Planet refuse the fetch script and fall back to one site-limited web search each, which is a weak check. Tried 2026-11-15.

| Source | Route | Works? | Cost for one chain | Known gaps |
|---|---|---|---|---|
| S1 OSHA inspections and penalties | DOL API through `research/fetch-osha-dol.mjs` `query` then `penalties` | Yes | 1 call for inspections (217 rows; 3 at 100 a page), 6 calls for violations (batches of 40) | Name search is case-sensitive and matches spelling only; no penalty total on the inspection record; inspections opened before the query's start date are missed even if they became final in the window; public link needs a key |
| S2 Wage and hour cases | DOL API, `WHD/enforcement`, same script | Yes | 4 calls (`legal_name` and `trade_nm`, each in upper and title case); 4 more were lost to rate limiting | No conclusion date is published (only `findings_start_date` and `findings_end_date`); federal WHD only, so state wage agencies and private lawsuits are not covered; whether open cases are included is not stated |
| S3 FTC cases | `research/fetch-page.mjs` on ftc.gov's own case and press release search (`?search=<name>`) | Yes | 2 page fetches; 1 web search (not needed) | Matches page text the site indexes; a case naming only a subsidiary or a brand is missed; FTC actions are about consumers, not workers |
| S4 Certifications already in use | Page fetch of each registry, or one site-limited web search where the fetch is refused | Partly | 4 page fetches, 2 web searches | B Corp directory: challenge page (HTTP 403). 1% for the Planet directory: robots.txt disallows. Web search cannot show absence. Fair Trade lists brands and retailers that sell certified products, not whole-company certification |

## S1 OSHA

Route: `node research/fetch-osha-dol.mjs query OSHA inspection --where '[["estab_name","like","%COSTCO%"],["open_date","gt","2020-11-15"]]' --save <dir>/costco-osha-inspections-upper.json`, then `node research/fetch-osha-dol.mjs penalties --ids-from <that file> --save <dir>/costco-osha-violations.json`, then `node docs/evidence/record-book/osha-claims.mjs <inspections> <violations>`.

What was learned:

| Finding | Evidence |
|---|---|
| Full field lists | `metadata OSHA inspection` and `metadata OSHA violation`, saved under `handoff/record-book/raw/dol/` (37 and 29 fields) |
| The inspection record carries no penalty total | No penalty field in the 37 inspection fields; penalties are per violation (`current_penalty`, `initial_penalty`) |
| "Final" can be read from the violation fields | `contest_date`, `final_order_date`, `delete_flag`; `close_case_date` on the inspection |
| Combined filters work | `{"and":[...]}` with `like` and `gt` on `open_date` returned 217 rows, all opened after 2020-11-15 |
| `like` is case-sensitive | `%Costco%` returned 0 rows where `%COSTCO%` returned 217 |
| Paging works | The same query with `--page 100 --sort-by activity_nr` took 3 calls and returned the same 217 unique ids |
| `in` works, but a long list is refused | 217 numbers in one `in` filter drew HTTP 403; 2 numbers worked (control: 2 rows back from the inspection set); batches of 40 worked |
| State-run programs are in the data | 78 reporting offices among Costco's rows, including Washington and California state program cases |
| Rate limit | 15 calls from 15:36 to 15:38 without a 429; the next call, at 15:41, was refused (see S2) |

Gaps: names spelled another way ("COSCO", a contractor's name) are missed; inspections opened before the query's start date (2020-11-15, one year before the window) that became final inside the window are missed; a link a reader can open needs the osha.gov inspection page, whose id differs from `activity_nr` (`research/fetch-osha-dol.mjs`, comment in `fetch`), and osha.gov/ords is disallowed to the fetch script.

## S2 Wage and hour

Route: `node research/fetch-osha-dol.mjs query WHD enforcement --where '[["<field>","like","<pattern>"]]' --save <file>` for `legal_name` and `trade_nm`, each with `%COSTCO%` and `%Costco%`. No date filter: a chain's whole WHD history was 20 rows.

| Finding | Evidence |
|---|---|
| The dataset is `WHD/enforcement`; 111 fields | `metadata WHD enforcement`, saved under `handoff/record-book/raw/dol/` |
| Amount fields | `bw_atp_amt` (back wages agreed to pay), `cmp_assd` (civil penalties assessed), plus per-law splits such as `flsa_bw_atp_amt` |
| Names are mixed case | `%COSTCO%` returned 0 on both fields; `%Costco%` returned 19 (trade name) and 20 (legal name) |
| Rate limit outlasts the script's guard | The `legal_name` call at 15:41 drew HTTP 429 three times and was killed by the 590 s `gtimeout` before its fourth try (backoff 2, 4, 6 minutes); at 15:51 calls worked again. Budget 10 minutes of waiting after each burst of about 8 calls, and run long calls with `gtimeout 1500` in the background |

"Final" for S2: assumed, not shown. The field list publishes no case status; the assumption that the dataset holds concluded cases only is the agent's, and case 5106713 has no dates at all. The action date used is `findings_end_date`, which marks the end of the period examined, not the date the case closed; this is the weakest date of the four sources.

One dol.gov news release search was not needed, since the API route worked.

## S3 FTC

Route: `node research/fetch-page.mjs --out <dir> "https://www.ftc.gov/legal-library/browse/cases-proceedings?search=<name>&sort_by=search_api_relevance" "https://www.ftc.gov/news-events/news/press-releases?search=<name>&sort_by=search_api_relevance"`, then read every result dated in the window.

- The first try used `search_api_fulltext=`, which the site ignores (it returned all 306 pages of cases). The form field is `search`.
- A web search limited to ftc.gov (1 search) returned sec.gov results too and nothing more than the site's own search.

## S4 Certifications

| Registry (kind in `data/certifications.json`) | Route | Result for the route |
|---|---|---|
| B Corp (b_corp) | `fetch-page.mjs` on `bcorporation.net/en-us/find-a-b-corp/search?query=<name>` | Challenge page, HTTP 403; recorded, not retried. Fallback: one web search limited to bcorporation.net |
| 1% for the Planet (one_percent_planet) | `fetch-page.mjs` on `directories.onepercentfortheplanet.org/profile/<slug>` | robots.txt disallows. Fallback: one web search limited to onepercentfortheplanet.org |
| Climate Label (climate_neutral) | `fetch-page.mjs` on `explore.changeclimate.org/brand/<slug>` | Works; a missing brand shows "Brand Not Found". Slug guessing can miss a brand listed under another slug |
| Fair Trade Certified (fair_trade) | `fetch-page.mjs` on `fairtradecertified.org/shop-fair-trade/` (redirects to `/our-community/shop-fair-trade/`), search the text for the name | Works; one page covers all ten chains |
| US Federation of Worker Cooperatives (worker_coop) | `fetch-page.mjs` on `info.usworker.coop/iframe/directory/worker-co-op-dem-workplaces`, search the saved HTML (map data) for the name | Works on the plain request (known members Rainbow, Equal Exchange and Box Dog are in the HTML); the headless browser was refused (HTTP 403) |
| Grassroots Outdoor Alliance (independent_retailer_assoc) | `fetch-page.mjs` on `grassrootsoutdoors.com/retailers-1`, search the HTML (logo file names) | Works; logos only |
