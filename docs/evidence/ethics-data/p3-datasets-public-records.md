# P3: Public-record and open datasets for ethics and environment
Status: closed

Research only; every page read on 2026-11-11 unless stated. Page text came through a summarizing fetch tool, so a quote marked "(tool)" is as that tool returned it and may be clipped. No API key used; generic client name only; 11 of 22 WebSearch calls used.

## Answer

- **Best fit is government enforcement records, not scorecards.** DOL Wage and Hour (WHD) and OSHA records are public domain and one row per workplace address, so they can reach a single store. Neither bulk file path was opened this session (see Blocked pages), so their coverage numbers are estimates.
- **Only Wikidata and SBTi were measured against the top 99 websites.** Wikidata has an item for 39 of 99 (CC0). The Science Based Targets initiative (SBTi) list names 18 of 99, but its terms reserve all rights and allow non-commercial use only.
- **Name matching is the main danger.** EPA ECHO for "Patagonia Inc" returned Patagonia, Arizona town and park records, not the company. SBTi substring searches hit "Macy" in pharmacies and "Office Depot" only as a Swedish subsidiary.
- **Absence means nothing.** No source here covers more than a few of the 7 small local shops, and none of the 62 brands and online shops outside Wikidata.

## What the earlier branch already established (do not redo)

Source: `origin/research/amazon-alternatives`, `research/method.md` and `research/raw/osha-dol-match.md`.

| Fact | Detail |
|---|---|
| OSHA | 18 OSHA concerns for 9 of the 50 rated retailers were all found in DOL open data (`apiprod.dol.gov/v4`), which robots.txt allows. The API needs a key and returns HTTP 429 after about 8 calls. |
| ID quirk | DOL `activity_nr` differs from the osha.gov id; observed pattern "34" + last six digits + one digit (18 of 18 pairs). |
| Disallowed pages | `osha.gov/ords/` and `nlrb.gov/search/` are robots-disallowed; the operator chose to keep the findings already made through them. |
| Operator rulings | OSHA counts only a closed case with a penalty; a recall with no penalty is not a finding (OC35); parent-company actions count (OC32); Prop 65 settlements on `oag.ca.gov` count (OC33). |
| Unreachable then | Violation Tracker (403 every batch), justice.gov (bot challenge), dol.gov search (403), CourtListener docket pages (403). |
| Not tested there | Wage and Hour back-wage records, EPA ECHO, NLRB bulk data, EEOC, any positive-signal registry. |

## Yardstick: top 99 websites in `shop-domains.tsv`

`facebook.com` (a Facebook page for D & S Foods) is dropped as not a shop website, so the denominator is 99 (rows 1 to 100 end at `ledlenserusa.com`). My hand classification (an estimate):

| Kind | Count | Examples |
|---|---|---|
| National chains, co-ops and marketplaces | 30 | walmart, homedepot, rei, acehardware, costco, ebay, ikea, tjx |
| Small or regional shops | 7 | saviprovisions, creativekidstuff, eldershardware, sportsbasement, scheels, mccoys, lastminutegear |
| Brands and online shops selling direct | 62 | lodgecastiron, smithey, patagonia, teasource, puzzlewarehouse |

## Names tested

| Source | Names tested | Result |
|---|---|---|
| EPA ECHO facility search (`echodata.epa.gov`, no key) | Costco, Lodge Manufacturing, Wal-Mart, Dollar General, Smithey Ironware, Patagonia Inc, Ace Hardware | Facility counts, not violations: 133 (Costco+WA, 123 flagged Indian Country, so the state filter looks ignored), 9, 3,478, 10,804, 0, 51, 840. Rows read for three: Lodge = real foundry sites in South Pittsburg TN ($3,750 total penalties); Patagonia = Arizona town, park and rest-area records (0 of 5 seen were the company); Ace Hardware = independent franchise stores plus unrelated sites that mention the name. Wal-Mart, Dollar General and Costco rows were not seen. |
| Wikidata, exact match on official-website property (SPARQL, 8 URL variants per domain) | all 99 domains | Item found: 39 of 99 (lower bound). Parent or owner filled: 11. Details below. |
| Wikidata name search (`wbsearchentities`) | 15 names | Failed as a join: "REI", "Scheels", "Ghirardelli" returned family names first; "Patagonia" returned the region; no item for Smithey, Darn Tough, Sports Basement. |
| SBTi company list (downloaded, 15,961 rows) | 45 names | See SBTi block. |
| CPSC recalls API (`saferproducts.gov`, no key) | all recalls 2025-11-11 to 2026-11-11 | 574 recalls; every one has a Retailers entry, 119 name a manufacturer. Retailer field is a free-text sentence. Recalls naming a retailer: Amazon 346, Walmart 72, Target 31, Home Depot 15, Lowe's 12, TJ Maxx or HomeGoods 11, Costco 11, eBay 6, Best Buy 5, REI 5, Ace 5, Macy's 4, Tractor Supply 2, IKEA 1, Bass Pro or Cabela's 1, Pottery Barn or Williams-Sonoma 1. |
| DOL WHD, OSHA, NLRB, FTC, EEOC | none | Not tested: no open query path was reachable without a key or a robots-disallowed page. A third-party mirror (`labordata.bunkum.us`) disallows parameterized queries for generic agents, so I did not query it. |

## Source blocks

### 1. DOL Wage and Hour Division (WHD) compliance actions

| Field | Entry |
|---|---|
| F1 | Single establishment (trade name, legal name, street address, city, state, ZIP); cases concluded since FY2005 |
| F2 | Name plus address. Names are free text; chains appear under many legal names. Error-prone (est. high) |
| F3 | Labor; ethics score; lowers only. Fields: violations found, back wages, employees owed, civil money penalties, FLSA repeat-violator flag |
| F4 | 370,964 cases in a mirror's copy. Top 99: not tested; estimate 25 to 35 with at least one case (about the 30 chains plus a few brands). Local shops: estimate 0 to 2 |
| F5 | Regulator record |
| F6 | Data.gov entry license field: "http://www.usa.gov/publicdomain/label/1.0/" (https://catalog.data.gov/dataset/wage-and-hour-division-compliance-action-data, read 2026-11-11). DOL: "Materials created by the federal government are generally part of the public domain" and they "may be used, reproduced and distributed without permission" (tool; https://www.dol.gov/general/aboutdol/copyright) |
| F7 | CSV on `dataportal.dol.gov` (a script-built page I could not read); Data.gov says updated every 3 months, last modified 2026-03-06. The old `enforcedata.dol.gov` catalog now redirects to `data.dol.gov`. Open-data API needs a key (branch) |
| F8 | Estimate: 16 hours first load, 10 hours a year |
| F9 | "No concluded case"; says nothing about shops never inspected |
| F10 | Back wages can follow a contractor or franchisee, not the brand. A case with no penalty or an old case marks a shop unfairly; chains collect more cases only because they have more stores. Cost to a small shop: a wrong -0.0625 to -0.25 and a dispute |

### 2. OSHA inspections and violations

| Field | Entry |
|---|---|
| F1 | Single establishment (`estab_name`, site address); 5,210,551 inspections in a mirror's copy |
| F2 | Name plus address; same weaknesses as WHD. The branch matched 18 of 18 by name, city, dates and penalty |
| F3 | Labor and safety; ethics; lowers only. Site rule: closed case with a penalty; willful or repeat citations move to the standard band |
| F4 | Branch: 9 of 50 rated retailers (18%) had a qualifying citation. Applied to 99 that is about 18 (estimate). Manufacturers with plants (Lodge, Pendleton, Faribault Mill) are likelier than online shops |
| F5 | Regulator record |
| F6 | Data.gov inspection entry: license "Not stated", `rights` "true", daily update, last modified 2026-03-27 (https://catalog.data.gov/dataset/dol-enforcement-data-inspection). DOL copyright text as in block 1 |
| F7 | osha.gov says "Reflects inspection data through 12/04/2025" (tool; https://www.osha.gov/data). Bulk CSV path not opened. API needs a key; 429 after about 8 calls |
| F8 | Estimate: 20 hours first load (join plus closed-and-penalized filter), 12 hours a year |
| F9 | "No qualifying citation"; small employers are inspected rarely |
| F10 | Franchise stores (Ace, True Value, Do it Best) are independently owned: a store's citation is not the cooperative's. Most single-store records land in the minor band |

### 3. EPA ECHO (enforcement and compliance history)

| Field | Entry |
|---|---|
| F1 | Regulated facility (address); also enforcement cases |
| F2 | Facility name plus address. Name search is substring: "Patagonia Inc" matched a town, "Ace Hardware" matched 840 records. Parent-company join not offered on the pages read. High error |
| F3 | Environment; lowers only. Counts of inspections, formal actions, penalties |
| F4 | Top 99: estimate 20 to 30 chains have hazardous-waste or water records; Lodge measured (9 records, $3,750). Local shops: few; stores appear only if they handle regulated waste |
| F5 | Regulator record |
| F6 | No license text on the ECHO pages read. ECHO: "The information contained in ECHO is made available to the public by the U.S. Environmental Protection Agency (EPA) for informational purposes only." (tool; https://echo.epa.gov/resources/echo-data/about-the-data). EPA elsewhere: documents "may be freely distributed and used for non-commercial, scientific and educational purposes" (https://www.epa.gov/web-policies-and-procedures/epa-disclaimers, as quoted in `p1-epa-and-survey.md`) |
| F7 | Weekly bulk ZIPs: `echo_exporter.zip` 392 MB, `case_downloads.zip` 73 MB, `frs_downloads.zip` 318 MB (https://echo.epa.gov/tools/data-downloads, page updated 2026-09-16). Also: "ECHO is not designed for large scale data transfers or robotic queries." |
| F8 | Estimate: 20 hours first load, 12 hours a year |
| F9 | "No facility record under that name"; not "clean" |
| F10 | Name collisions are the main risk (shown above); a lowered environment score on a wrong match is a false accusation. Per-facility penalties are small (Lodge $3,750) |

### 4. NLRB case data

| Field | Entry |
|---|---|
| F1 | Employer in a charge or petition (case-level) |
| F2 | Employer name; address not confirmed in the export |
| F3 | Labor; ethics; lowers only, and the branch counts an open agency complaint |
| F4 | Top 99: estimate 10 to 15 chains; not tested |
| F5 | Regulator filing. A charge is an allegation until the board acts |
| F6 | No terms or license sentence on https://www.nlrb.gov/open or https://www.nlrb.gov/helpful-resources (read 2026-11-11) |
| F7 | Advanced Data Search exports CSV, "up to 100,000 records at a time"; no API or update cadence stated (tool). `nlrb.gov/search/` is robots-disallowed (branch) |
| F8 | Estimate: 12 hours first load, 10 hours a year |
| F9 | "No case in the export" |
| F10 | Charges are filed by anyone; marking a shop on a charge alone can be wrong. Use only agency complaints or board orders |

### 5. EEOC

| Field | Entry |
|---|---|
| F1 | Employer named in a press release (litigation, settlement) |
| F2 | Free text in release titles |
| F3 | Labor and discrimination; ethics; lowers only |
| F4 | 7,622 press-release results; top 99: estimate 0 to 5; not tested. Employer-level EEO-1 data: not found |
| F5 | Regulator or court record |
| F6 | No terms sentence found on https://www.eeoc.gov/newsroom/search |
| F7 | Search page plus RSS (`eeoc.gov/rss/newsroom`); no download |
| F8 | Estimate: 6 hours first load, 6 hours a year |
| F9 | "No release"; most employers are never sued |
| F10 | Settlements often carry "no admission"; low risk if the release is cited |

### 6. FTC cases and proceedings

| Field | Entry |
|---|---|
| F1 | Company named in an enforcement matter |
| F2 | Company name (free text) |
| F3 | Consumer protection and competition (governance); ethics; lowers only |
| F4 | 6,127 matters listed; top 99: estimate 3 to 8 (branch found Kohl's and Walmart already in `data/negatives.json`) |
| F5 | Regulator record |
| F6 | "Most material on the FTC's website is considered work of the United States Government," meaning "that the material is in the public domain and is not subject to copyright restrictions." (tool; https://www.ftc.gov/policy-notices/website-policy) |
| F7 | Searchable list with filters; no download, API or feed found (https://www.ftc.gov/legal-library/browse/cases-proceedings) |
| F8 | Estimate: 10 hours first (manual lookups for the chains), 8 hours a year |
| F9 | "No matter found" |
| F10 | Low: few, large, well-documented cases |

### 7. CPSC recalls and penalties

| Field | Entry |
|---|---|
| F1 | Product and the companies that made or sold it |
| F2 | Free-text retailer sentence ("Sold at ... from ... for $90 to $130") |
| F3 | Product safety; ethics; recalls cannot lower a score under the operator's OC35 ruling; only civil penalties could |
| F4 | Tested above: Walmart named in 72 recalls, Target 31, Home Depot 15 over 12 months |
| F5 | Regulator record |
| F6 | No license. API page: "The information is publicly available to consumers and businesses as well as software and application developers." (tool; https://www.cpsc.gov/Recalls/CPSC-Recalls-Application-Program-Interface-API-Information) |
| F7 | JSON API, no key needed (tested); refreshed as recalls publish (newest 2026-11-05) |
| F8 | Estimate: 8 hours first load, 4 hours a year |
| F9 | "No recall"; says nothing about conduct |
| F10 | High: a retailer in a recall sentence is usually the seller, not the wrongdoer. I did not find the civil-penalty list page (a guessed URL returned 404) |

### 8. Good Jobs First Violation Tracker

| Field | Entry |
|---|---|
| F1 | Parent company, with penalty records from many agencies |
| F2 | Company or parent name |
| F3 | Labor, environment, consumer, governance; both scores; lowers only |
| F4 | Not measured (page blocked). Search snippet: more than 3,000 parent companies |
| F5 | Aggregated regulator and court records (secondary) |
| F6 | Terms page not read (403). Search snippet only: "only paid subscribers are now able to download results in spreadsheet form", from $25 a month in 2023 (https://goodjobsfirst.org/wp-content/uploads/2024/02/2023-Annual-Report-Good-Jobs-First.pdf, per search result; unverified) |
| F7 | Free web search; paid download |
| F8 | Estimate: 0 to load (link only), 4 hours a year to spot-check |
| F9 | "Not in the tracker" |
| F10 | Already an accepted source domain (`goodjobsfirst.org`); safe as a cited link, not as a bulk load |

### 9. Science Based Targets initiative (SBTi) company list

| Field | Entry |
|---|---|
| F1 | Company (parent level) |
| F2 | Company name, ISIN, LEI. Substring hits are noisy (below) |
| F3 | Environment; raises only |
| F4 | 15,961 companies (Validated Targets 12,308; Commitment to Set Targets 2,066; Commitment Removed 1,587). Top 99: 18 touch it (14 validated, 4 expired). Validated by own name: walmart, homedepot, rei, bestbuy, target, ebay, ikea, patagonia (as Patagonia Works), williams-sonoma, lindtusa, itoen (ITO EN, Japan, taken as the same group); via parent: samsclub, potterybarn, ghirardelli. Expired: lowes, macys, tractorsupply, blackdiamondequipment. Kind split: 13 chains or marketplaces, 5 brands; local shops 0 |
| F5 | Validated targets are checked by SBTi; the commitment tier is self-declared |
| F6 | "You may retrieve and view content from our site, print off one copy of individual pages, and may store these pages for research, your personal use, or other non-commercial use provided that wherever you cite the data, you credit the 'Science Based Targets initiative' as the source and provide a link to the relevant page of the website." and "If you wish to make any use of material on our site other than that set out above, please address your request to info@sciencebasedtargets.org." (https://sciencebasedtargets.org/about-us/website-terms-of-use, read 2026-11-11). Also "All such rights are reserved." Permission needed for anything beyond non-commercial |
| F7 | Excel download (`companies-excel.xlsx`, 2.3 MB), updated Thursdays; file dated 2026-11-05 |
| F8 | Estimate: 6 hours first load, 4 hours a year |
| F9 | "Has no SBTi target"; most small shops cannot qualify |
| F10 | "Commitment Removed" means the commitment expired (status reason "Expired commitment" in the file), not that the company failed; treat as no data, never as negative. False matches: "Macy" hit two pharmacies; "REI " hit 19 food firms; "Office Depot" hit only a Swedish subsidiary; "Dick" hit Becton, Dickinson. Join on ISIN or exact legal name |

### 10. EPA partner programs: GreenChill, SmartWay, Safer Choice, ENERGY STAR

| Field | Entry |
|---|---|
| F1 | GreenChill: certified store (address). SmartWay: shipper or carrier company. Safer Choice: product and company. ENERGY STAR: building |
| F2 | GreenChill by store address; others by company name |
| F3 | Environment; raises only |
| F4 | GreenChill: 956 certified stores in 2024 (798 Platinum, 74 Gold, 84 Silver), grocery only; top 99 overlap not checked (files not opened). SmartWay High Performers: 36 entries, 13 retailers; 7 of the top 99 domains match (ikea, lowes, homedepot, tjx, homegoods, tractorsupply, walmart). Safer Choice and ENERGY STAR: not counted |
| F5 | GreenChill: EPA-certified. SmartWay: self-reported partner data checked by EPA tools. Not independently audited |
| F6 | EPA: documents "may be freely distributed and used for non-commercial, scientific and educational purposes" (see block 3) |
| F7 | GreenChill: web page "Data as of July, 19, 2024" plus historical xlsx 2019 to 2023 (https://www.epa.gov/greenchill/greenchill-certified-stores-historical-data). SmartWay: web table updated 2026-06-22, no download seen. Safer Choice: product table; spreadsheet "on Envirofacts" (tool; not opened). ENERGY STAR: no bulk file found |
| F8 | Estimate: 4 hours first load, 3 hours a year per program |
| F9 | "Not a partner"; most shops are not eligible or never applied |
| F10 | Low, but a partner list shows participation, not total impact |

### 11. Wikidata (parent, owner, headquarters)

| Field | Entry |
|---|---|
| F1 | Company, brand or chain item |
| F2 | Official-website property matched exactly by URL (reliable). Name search is not |
| F3 | Ownership and structure; no direct score effect. Supplies the parent join that the "related" finding weight needs |
| F4 | Item found: 39 of 99 (lower bound; only 8 URL variants tried). By kind: 30 of 30 chains, 7 of 62 brands (lodge, patagonia, black diamond, buffalo games, bits and pieces, ugreen, ghirardelli), 2 of 7 small or regional shops (mccoys, scheels). Parent property filled: 6 (Macy's, Sam's Club, Ghirardelli, Pottery Barn, Williams Sonoma, Walgreens). Owner filled: 7 (Walmart, Home Depot, Costco and eBay list large shareholders; IKEA a foundation; See's names Berkshire Hathaway) |
| F5 | Crowd-edited, unaudited; cites its own sources unevenly |
| F6 | "All structured data (i.e. the main, Property, Lexeme, and EntitySchema namespaces) is released into the public domain under Creative Commons Zero." (tool; https://www.wikidata.org/wiki/Wikidata:Licensing) |
| F7 | SPARQL endpoint and API, no key. A scan across all websites timed out (504); listing exact URLs worked. API returned 429 when queried fast |
| F8 | Estimate: 8 hours first load, 4 hours a year |
| F9 | "No item", true for 60 of 99; says nothing about the shop |
| F10 | Stale or wrong parent links; vandalism. Never lower a score from it; use it to find the parent, then look up the parent's regulator records |

### 12. State programs

| Field | Entry |
|---|---|
| F1 | Employer with a wage-claim judgment (California Labor Commissioner; New York wage theft dashboard); product maker (Prop 65) |
| F2 | Name plus address |
| F3 | Labor (wage judgments), environment (Prop 65); lowers only |
| F4 | Not tested. Prop 65: the branch already covers it through `ca.gov` |
| F5 | State agency or court record |
| F6 | Not read. NY page returned 403; California pages not opened |
| F7 | California: judgments reachable through a San Diego County dashboard (2017 on) per a search result; NY: Tableau dashboard "still being developed" (search result). Washington: nothing found |
| F8 | Estimate: 10 hours per state first load, 6 hours a year |
| F9 | "Not on that state's list"; coverage is one state at a time |
| F10 | Judgments may be unpaid claims against small employers; one state cannot represent a national chain |

### 13. SEC EDGAR (public-company filings)

| Field | Entry |
|---|---|
| F1 | Public company (parent) |
| F2 | Company name or ticker |
| F3 | Ownership and governance; flag "publicly traded"; no direct score effect |
| F4 | Estimate: about 22 of the top 99 have a public parent (my count of the chains list plus Lindt-owned and Berkshire-owned brands) |
| F5 | Regulator filing, self-reported by the company |
| F6 | "Anyone can access and download this information for free." and "The SEC does not allow botnets or automated tools to crawl the site." (tool; https://www.sec.gov/search-filings/edgar-search-assistance/accessing-edgar-data) |
| F7 | Bulk `company_tickers.json` and JSON APIs; rate limit "10 requests/second"; a declared User-Agent is required |
| F8 | Estimate: 3 hours first, 1 hour a year |
| F9 | "Not public" |
| F10 | Low; but it adds little a shopper can act on |

### 14. Items I could not fully assess

| Source | What I have | Why incomplete |
|---|---|---|
| USDA Organic Integrity Database (certified operations, one row per operation) | Search results say monthly snapshots download; no license found | App returned an error to the fetch tool; grocery and food only |
| USDA APHIS Animal Care search (licensed dealers, inspection PDFs) | Pet shops and breeders only, PDF reports | Not opened; none of the top 99 is a pet shop |
| WikiRate | Search snippets conflict on license (CC BY 4.0 vs CC BY-SA 4.0), unverified | Both license pages returned 403 |

## Ranked table: 8 most usable sources (my judgment)

Estimates are labeled; "upkeep" is hours a year with first load in parentheses.

| Rank | Source | Entity | Direction | Coverage of top 99 | Reuse rights | Form | Upkeep h/yr (first) | Why here |
|---|---|---|---|---|---|---|---|---|
| 1 | DOL WHD compliance actions | Establishment | Lowers ethics | est. 25 to 35 | Public domain | CSV, quarterly | 10 (16) | Only source that is legally clear and reaches single addresses; not yet tested end to end |
| 2 | OSHA inspections | Establishment | Lowers ethics | est. about 18 (branch rate) | DOL text: public domain; Data.gov license "Not stated" | CSV or keyed API | 12 (20) | Already proven on 18 records; rules already set by the operator |
| 3 | Wikidata | Company, parent | Join aid, no score move | 39 measured; 11 with parent or owner | CC0 | SPARQL, no key | 4 (8) | Only open source that reaches brands and regional shops; its value is finding the parent |
| 4 | SBTi company list | Company | Raises environment | 18 measured (14 validated) | All rights reserved; non-commercial; ask SBTi | XLSX, weekly | 4 (6) | Largest positive signal for chains, but permission is unresolved |
| 5 | EPA ECHO bulk | Facility | Lowers environment | est. 20 to 30; Lodge measured | Not stated; "informational purposes"; EPA non-commercial line | Weekly ZIP | 12 (20) | Real enforcement data, but name matching failed the Patagonia test |
| 6 | FTC cases | Company | Lowers ethics | est. 3 to 8 | Public domain | Web list only | 8 (10) | Clear rights and strong evidence, tiny reach |
| 7 | NLRB Advanced Data Search | Employer | Lowers ethics | est. 10 to 15 | Not stated | CSV, 100,000-row cap | 10 (12) | Useful for chains; charges alone must not count |
| 8 | EPA partner lists (SmartWay, GreenChill) | Company, store | Raises environment | 7 SmartWay domains measured | EPA non-commercial line | Web tables, xlsx | 3 (4) | Cheap positives for a few chains; grocery stores only for GreenChill |

## Dead ends

| Source | Reason |
|---|---|
| CDP scores | "CDP scores must not, without prior written consent from CDP, be used for anything other than internal, non-commercial use." (tool; https://www.cdp.net/en/data/scores) |
| Open Supply Hub | Factories, not shops. Terms bar use "to combine or integrate the Services or OS Hub Materials with any software, technology, services, materials or other Intellectual Property without OS Hub's prior written consent" (https://info.opensupplyhub.org/terms-of-service, read 2026-11-11) |
| OpenCorporates | Free API keys go to journalists, NGOs and academics under share-alike; terms bar "Using any automated system (e.g. scraping) to extract data for any purpose other than search engine indexation;" (tool; https://opencorporates.com/terms-of-use-2/). Holds incorporation records, not ownership of shops |
| B Lab B Corp data on data.world | Page says the open data community datasets "are no longer accessible or available for download", retired 2026-07-13 (tool; https://data.world/blab/b-corp-impact-data) |
| CPSC recalls as a score input | Operator ruled a recall without a penalty is not a finding (OC35); retailers are usually the seller |
| EPA Green Power Partnership | Covered in `p1-epa-and-survey.md`: 12 retailers, last list Oct. 2024 |
| EEOC employer-level data | EEO-1 is confidential by employer; only press releases are public (not found otherwise) |

## Blocked pages for the operator to open

| Page | What happened | What to look for |
|---|---|---|
| https://violationtracker.goodjobsfirst.org/plans and /pages/user-guide | HTTP 403 to the fetch tool | Price, what a subscription may be redistributed as, parent-company coverage |
| https://wikirate.org/Wikirate_Terms_of_Use and https://wikirate.org/Licensing | HTTP 403 | The data license sentence (CC BY 4.0 or CC BY-SA 4.0) and API terms |
| https://dataportal.dol.gov/ (and https://data.dol.gov/) | Script-built page, empty to the fetch tool | Whether a no-key CSV of WHD and OSHA exists, file URLs, license |
| https://dol.ny.gov/wage-theft-dashboard | HTTP 403 | Fields, size, terms |
| https://www.nlrb.gov/advanced-search | Not opened | Whether the export has employer address and city; whether robots allows it |
| https://www.sec.gov/files/company_tickers.json | HTTP 403 "Request Rate Threshold Exceeded" to a generic client; the SEC wants a declared User-Agent with contact details | Download once with the operator's own details |
| https://organic.ams.usda.gov/integrity/ | Application error to the fetch tool | Download links, license |
| https://www.epa.gov/greenchill/greenchill-certified-stores-historical-data (2023 xlsx) and the Safer Choice spreadsheet on Envirofacts | Not opened | Columns (company, address), top-99 overlap |
| https://www.dol.gov/general/aboutdol/copyright | The fetch tool read it, but a plain request got 403; DOL quotes above are "(tool)" | Confirm the public-domain sentences |
| CPSC civil-penalty list | My guessed URL returned 404; page not found | Search cpsc.gov for "Civil and Criminal Penalties" |
