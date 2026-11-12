# EPA Green Power lists and who else grades retailers

Status: closed

Research only; every page read on 2026-11-11. Page text came through a summarizing fetch tool, so quoted sentences are as that tool returned them; the two EPA lists were read from the PDFs with pdftotext.

Answer: EPA's 100% list has 265 organizations; EPA labels 12 of them "Retail" (about 19 if shops under other labels are counted), only 1 chain in `data/chains.json` (REI) is on it, and the newest list is dated October 2024. The survey found 15 graders; almost all rate national chains, and only Green America and local alliances might reach small shops.

## Job A: EPA Green Power Partnership

### Facts

| Item | Finding | Source (read 2026-11-11) |
|---|---|---|
| What is listed | Partners that use 100% green power: companies, governments, universities, nonprofits. 265 organizations, nearly 63.8 billion kWh a year | https://www.epa.gov/greenpower/green-power-partnership-100-green-power-users |
| Date of list | Page says "Last updated September 2, 2026", but its figures are "as of October 22, 2024". The 2025 list is marked "Coming Soon!". The newest archived file is Oct. 2024 | same page; https://www.epa.gov/greenpower/top-partner-rankings-archive |
| Cadence | "Updated quarterly", but the update schedule page says "Schedule coming soon", and no list after Oct. 2024 is archived (16 quarterly files, Jan. 2021 to Oct. 2024) | https://www.epa.gov/greenpower/green-power-partnership-top-partner-rankings |
| Meaning | Usage is "based on annualized Partner contract amounts", not metered calendar-year use. Counts U.S. operations only. Can be met with renewable energy certificates, on-site generation, utility green power products, or a mix | same rankings page |
| Verification | Self-reported. Partners revise a form EPA pre-fills and submit it yearly; those who don't are suspended. Third-party certifiers "validate supplier marketing claims"; EPA "recommends" certified products, does not require them. No EPA audit is described. EPA may suspend partners who make "inappropriate claims" | https://www.epa.gov/greenpower/green-power-partnership-requirements ; https://www.epa.gov/greenpower/meet-our-partners ("self-reported by Partners") |
| Entry bar | Organizations need 100,000 kWh or more of annual electricity use. Smallest listed: 105,176 kWh | requirements page; list PDF |
| Download / API | None found. Lists are PDFs (the web table did not render for my fetch tool, so I read the Oct. 2024 PDF, whose totals match the page: 265 organizations, 63.8 billion kWh). Data pages are interactive viewers with no download mentioned | https://www.epa.gov/system/files/documents/2025-01/partner100_oct2024.pdf ; https://www.epa.gov/greenpower/green-power-partnership-data |
| Reuse | EPA disclaimers: "These documents may be freely distributed and used for non-commercial, scientific and educational purposes." Commercial use "may be restricted by copyright law"; individual documents "may have different copyright conditions." The public-domain sentence there covers only EPA geospatial data. Page last updated September 21, 2026 | https://www.epa.gov/web-policies-and-procedures/epa-disclaimers |

Reuse status: EPA's stated permission is non-commercial, scientific and educational use; it grants nothing explicit beyond that and says commercial use "may be restricted". https://www.epa.gov/data (read 2026-11-11) says nothing on licensing and points to Data.gov and EPA's Open Data Plan; I did not check those. Whether the site's use counts as non-commercial is the owner's call. Contact: https://www.epa.gov/greenpower/forms/contact-us-about-green-power-partnership. I found no full partner list or total partner count on the pages read.

### Retail entries on the 100% Green Power Users list (Oct. 2024 PDF)

Industry label "Retail": 12 of 265. Columns on the list: partner, annual kWh, percent of total electricity, industry, resource types, state.

| Organization | Annual green power (kWh) | % of electricity | Resources | State |
|---|---|---|---|---|
| ALDI, Inc. | 1,215,456,513 | 100% | Solar, Wind | OH |
| IKEA | 238,539,334 | 104% | Biogas, Solar, Wind | PA |
| Sephora NA | 111,148,101 | 110% | Wind | CA |
| REI | 82,859,267 | 100% | Solar, Wind | WA |
| MOM's Organic Market | 11,384,368 | 101% | Solar, Wind | MD |
| Patagonia, Inc. | 9,053,768 | 103% | Solar | CA |
| Everlane | 1,034,000 | 100% | Solar | CA |
| Community Food Co-op | 1,418,060 | 100% | Various | WA |
| Wheatsville Food Co-op | 867,079 | 109% | Wind | TX |
| Ashland Food Cooperative | 712,555 | 103% | Solar, Wind | OR |
| Grosvenor Market | 377,156 | 100% | Wind | MD |
| The Paper Mill Store | 127,703 | 100% | Wind | WI |

12 is EPA's own industry label, not the site's definition of a shop. Seven more shops are on the same list under other labels (same PDF): Starbucks Coffee Company (Restaurants & Cafes, 1,269,510,000 kWh, 100%, WA); HelloFresh US (Food & Beverage, online, 67,687,012, 100%, NY); The Estee Lauder Companies (Consumer Products, 65,090,460, 103%, NY); Burberry Group PLC (Clothing & Textile, 11,387,384, 100%, NY); Shaklee (Consumer Products, 1,295,000, 100%, CA); Fitzgerald Auto Malls (Automotive, 8,027,249, 100%, MD); Stanley Subaru (Automotive, 168,880, 162%, ME). Brands that also sell direct online, the way `data/certifications.json` treats Patagonia, would add more (Dr. Bronner's, Tom's of Maine, Clif Bar, Lovevery, Ruffwear, Naturepedic); I did not count them. Two Top 30 entries are absent from the 100% list under any name I searched: Outpost Natural Foods / Retail Stores (107%) and The ODP Corporation / Headquarters (100%). Names that wrapped across lines in the PDF (Grosvenor Market, Ashland Food Cooperative) were joined by me.

### Top 30 Retail list (same date; partial users included)

Source: https://www.epa.gov/system/files/documents/2025-01/top30retail_oct2024.pdf (page https://www.epa.gov/greenpower/green-power-partnership-top-30-retail). Columns on the list: rank, partner, kWh, percent, resources (resources omitted below; mostly "Solar, Wind" or "Various"). About 13.4 billion kWh combined.

| # | Organization | kWh | % | # | Organization | kWh | % |
|---|---|---|---|---|---|---|---|
| 1 | Walmart Inc. | 5,322,549,000 | 29% | 16 | REI | 82,859,267 | 100% |
| 2 | Target Corporation | 1,979,605,495 | 48% | 17 | HelloFresh US | 67,687,012 | 100% |
| 3 | Starbucks | 1,269,510,000 | 100% | 18 | The Estee Lauder Companies | 65,090,460 | 103% |
| 4 | ALDI, Inc. | 1,215,456,513 | 100% | 19 | Giant Eagle, Inc. | 58,629,084 | 11% |
| 5 | 7-Eleven / Operationally Controlled Stores | 801,722,213 | 25% | 20 | New Seasons Market | 21,520,000 | 85% |
| 6 | The Home Depot | 771,831,640 | 29% | 21 | Burberry Group PLC | 11,387,384 | 100% |
| 7 | Best Buy | 469,583,000 | 80% | 22 | MOM's Organic Market | 11,384,368 | 101% |
| 8 | Lowe's Companies | 321,451,000 | 13% | 23 | Carter's | 10,000,000 | 12% |
| 9 | IKEA | 238,539,334 | 104% | 24 | Staples, Inc. | 10,000,000 | 10% |
| 10 | Ulta Beauty | 114,445,540 | 34% | 25 | Patagonia, Inc. | 9,053,768 | 103% |
| 11 | Sephora NA | 111,148,101 | 110% | 26 | Valvoline Inc. | 7,714,000 | 15% |
| 12 | CarMax Auto Superstores | 110,751,014 | 41% | 27 | Outpost Natural Foods / Retail Stores | 3,475,010 | 107% |
| 13 | Kohl's, Inc. | 102,485,604 | 12% | 28 | The ODP Corporation / Headquarters | 3,318,000 | 100% |
| 14 | Tractor Supply Company | 102,378,648 | 21% | 29 | Community Food Co-op | 1,418,060 | 100% |
| 15 | Albertsons Companies / Select Locations | 94,689,082 | 48% | 30 | Shaklee Corporation | 1,295,000 | 100% |

### Overlap with `data/chains.json` (41 chains)

| List | Count | Chains |
|---|---|---|
| 100% Green Power Users | 1 | REI (checked by searching all 41 chain names plus parent names such as TJX, VF, Williams-Sonoma, URBN, Bass Pro against both lists; REI was the control, and the only hit) |
| Top 30 Retail | 7 | Walmart (29%), Target (48%), The Home Depot (29%), Best Buy (80%), Lowe's (13%), Tractor Supply Co. (21%), REI (100%) |
| Near misses, not counted | 3 | Albertsons "Select Locations" (Safeway is an Albertsons banner, but the listing is limited to select locations); "ODP Corporation / Headquarters" (Office Depot's stores are not covered); Starbucks (not in `chains.json`) |

Walmart, Target, Home Depot, Best Buy, Lowe's, Tractor Supply: partial users. A "100% green power" flag would not apply to them; a percent would.

### My judgment (Claude's, not EPA's)

Fair as one narrow signal, weak as a shop-level environment score.

- Strong: public, federal, named organizations, and a plain claim a shopper understands.
- Weak: it measures electricity only, not products, shipping, packaging or refrigerants.
- Weak: certificates can satisfy it, so it can mean paper claims over actual local power.
- Weak: it is self-reported and the newest list is about two years old.
- Weak: it covers a company or "select locations", not necessarily the store in front of the shopper (a leasing tenant may not control its power).
- Weak: the 100,000 kWh entry bar leaves out most small shops, so absence is not evidence of anything.
- Fit with the site: 1 of 41 chains for the 100% list. It would add data for the 12 EPA-labeled retailers (national chains plus food co-ops) and a few more shops under other labels. If used, it should be a separate certification kind with the date shown, and partial users should get no credit.

## Job B: who else grades retailers

15 rows from 12 searches plus page fetches. Searches run: "retail store ethical ranking" plus 11 more (US supermarket scorecards, sustainability scorecards, HRC index, Fair Food Program, Greenpeace seafood, animal welfare, independent business alliances, JUST Capital, fashion accountability, Green America, palm oil/cocoa/plastic). Star (★) = covers small independent shops. Latest editions are what I could verify; "NV" means not verified.

| # | Name | URL | Publisher | Graded | Topic | US retailers covered | Latest edition | Cost |
|---|---|---|---|---|---|---|---|---|
| 1 | Tuna Retailer Report (4th ed.) | https://www.greenpeace.org/usa/the-high-cost-of-cheap-tuna-us-supermarkets-sustainability-and-human-rights-at-sea/ | Greenpeace USA | Retailer | Human rights and sustainability in tuna supply | 16 | Mar. 16, 2026 | Free |
| 2 | Supermarket Scorecard | https://www.aspca.org/supermarketscorecard | ASPCA | Retailer | Farm animal welfare (hens, pigs, chickens) | 25 | Aug. 2024 | Free |
| 3 | Behind the Barcodes | https://www.oxfamamerica.org/explore/issues/humanitarian-response-and-leaders/hunger-and-famine/behind-the-barcodes/methodology/ | Oxfam America | Parent company | Transparency, workers, farmers, women | 6 (Ahold Delhaize, Albertsons, Costco, Kroger, Walmart, Whole Foods) | 2018 (per the "2018 Scorecard" page title, NV) | Free |
| 4 | Corporate Equality Index | https://reports.hrc.org/corporate-equality-index-2025 | Human Rights Campaign Foundation | Employer (company) | LGBTQ workplace policy | NV (1,449 companies rated, retail count not on page) | 2025 (22nd ed.) | Searchable at hrc.org/cei/search; cost NV |
| 5 | Rankings | https://justcapital.com/rankings/ | JUST Capital | Company (Russell 1000) | Public-polling issues; workers rank first | NV (a "Retail" filter exists; Lowe's is its leader) | 2026 | Free to view; analysis tools for subscribers |
| 6 | Fashion Accountability Report | https://www.fashiondive.com/news/remake-2024-fashion-accountability-report/711682/ (coverage; Remake's own page not read) | Remake | Brand and retailer | Wages, traceability, environment, governance (0 to 150) | 52 fashion companies >$100M revenue, includes REI, Patagonia, Everlane | Mar. 29, 2024 | NV |
| 7 | Fair Food Program Participating Buyers | https://www.fairfoodstandards.org/resources/participating-buyers/ | Fair Food Standards Council (monitor for CIW) | Buyer (retailer) | Farmworker labor | 5 grocers of 14 buyers: Ahold USA, The Fresh Market, Trader Joe's, Walmart, Whole Foods | Undated (page shows 2020) | Free |
| 8 | ★ (inferred) Green Business Certification and National Green Pages | https://greenbusinessnetwork.org/certification | Green America | Business (certified seal) | Social plus environmental criteria; 40 industries | NV (no count on page; dues start at 0 to 5 employees, so small firms are members; retail share not stated) | Site shows 2026 | Business pays dues $150 to $2,500; directory access NV |
| 9 | ★ Alliances and Affiliates (local Independent Business Alliances) | https://amiba.net/?p=576 | American Independent Business Alliance | Membership, not a grade | Independent local ownership | 61 local organizations; shop directories not confirmed on page | Undated | Free to read |
| 10 | Bee-Friendly Retailer Scorecard | https://www.grocerydive.com/news/grocery--report-amazon-supervalu-among-retailers-falling-short-in-pesticide-reductio/534176/ (coverage) | Friends of the Earth | Retailer | Pesticides, organic, pollinators | 25 large food retailers | Mar. 19, 2018 | Free (per coverage) |
| 11 | Easter Retailer Scorecard | https://mightyearth.org/article/retailer-scorecard-2021/ | Mighty Earth, National Wildlife Federation, Be Slavery Free | Retailer | Cocoa sourcing | 36 worldwide; US count not given | Apr. 1, 2021 | Free |
| 12 | Corporate Plastic Pollution Scorecard | https://progressivegrocer.com/4-big-food-retailers-score-lowest-plastic-pollution-scorecard (page blocked; from search snippet only) | As You Sow | Company | Plastic packaging | 50 consumer companies incl. Walmart, Target, Costco, Amazon | 2021 | NV |
| 13 | Chocolate Retailer Scorecard | https://greenamerica.org/node/15946 | Green America | Retailer | Cocoa: child labor, deforestation | 11 grocers and pharmacies | Press release Jan. 8, 2020 | Free |
| 14 | Carting Away the Oceans (10th ed.) | https://www.greenpeace.org/usa/carting-away-the-oceans-10-2/ | Greenpeace USA | Retailer | Sustainable seafood, labor, plastics | 22 | Year not stated; page metadata says published 2018-08-15, modified 2024-11-19 | Price not stated |
| 15 | Food waste scorecard | https://www.wlrn.org/2018-04-16/grocery-stores-get-mostly-mediocre-scores-on-their-food-waste-efforts (coverage) | Not named on the page (its report link points to biologicaldiversity.org) | Retailer | Food waste | 10 supermarkets | Apr. 16, 2018 | Free (per coverage) |

Not verified, so left out: WWF Palm Oil Buyers Scorecard and the Union of Concerned Scientists palm oil scorecard (search results only), Ethisphere Most Ethical Companies (page blocked, year unknown).

Already used by the site, so not repeated: B Corp directory, 1% for the Planet, Climate Label, Fair Trade Certified, US Federation of Worker Cooperatives directory, Grassroots Outdoor Alliance member list. Skipped as assigned: Good Shopping Guide, Ethical Consumer, Good On You, Toxic-Free Future, Climate Friendly Supermarkets, EIA Dirty Dozen.

Finding on coverage (mine): every row except 8 and 9 grades national chains only. The two stars rest on inference (Green America's dues start at 0 to 5 employees; local alliances serve independent businesses), not on a page listing small shops. Neither publishes a score.

## Blocked pages for the operator to open

| URL | What I wanted |
|---|---|
| https://foe.org/retailer-report-card/ (403) | Whether Friends of the Earth has a newer scorecard than 2018 |
| https://progressivegrocer.com/4-big-food-retailers-score-lowest-plastic-pollution-scorecard (403) | Details of the As You Sow 2021 plastics scorecard |
| https://chainstoreage.com/operations/list-details-worlds-most-ethical-companies-15-retailers-make-cut (403) | Year and retailer count of Ethisphere's Most Ethical list (left out of the table for that reason) |
| https://www.epa.gov/greenpower/green-power-partnership-100-green-power-users (table rows did not load for my fetch tool) | Confirm the live table matches the Oct. 2024 PDF I read |
| https://www.hrc.org/cei/search (fetched; the page shows only search filters) | Whether results are free and which retailers are rated |

## Open questions for the operator

- Does EPA allow commercial reuse of the partner names and percentages? Nothing I found says yes.
- Green America: is the member directory free to browse, and how many certified shops sell products? (https://greenbusinessnetwork.org/home returned 404 to my fetch.)
