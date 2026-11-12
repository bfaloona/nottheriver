# Positive and structural data sources: certifications, registries, and small shops
Status: closed (research only; nothing changed in the repo besides this file)

Read on 2026-11-11 unless a row says otherwise. Notation: "NV" = not verified by me (came from a search-result summary, not a page I read). "Estimate" = my number. Hours are my estimates.

## Answer first

- **Almost no existing data says anything ethical or environmental about a typical small independent shop.** Tests below: 1 weak hit (a product claim) in 8 shops looked up in OpenStreetMap; 0 of the 66 stores on the Fair Trade Federation list match a saved website (a name check with a known-present control); 1 saved website (Sevananda) among about 239 National Co+op Grocers entries; 1 or 2 saved websites (Scheels; possibly Food Depot, unconfirmed) among the 150 largest employee-owned companies.
- **Nearest thing:** (a) a shop's type and chain status from open place data (OpenStreetMap and Overture Maps), which says "independent or chain, secondhand or not" but nothing about conduct; (b) membership rosters that small shops can join (Green America, Fair Trade Federation, co-op lists, local business alliances), each a few dozen to a few hundred shops nationwide.
- **No source found lets a shop declare facts with proof AND allows reuse.** Several take proof (Green America, Fair Trade Federation, NCEO certification) but bar copying or publish no list. Details in "Self-declaration".
- **Where the data does reach the saved results:** mid-size and brand sellers (Scheels, row 93, employee-owned; Alter Eco, row 68, Climate Label certified, page read; Lake Champlain Chocolates, row 67, B Corp, unconfirmed) and hardware-store families (about 12 of 619 websites are Ace, True Value or Do it Best stores, estimate by name; ownership fact only).

## Method and limits

- 17 of 22 allowed searches used; tools: WebFetch, taginfo (US instance at taginfo.geofabrik.de, no key), Nominatim (OSM name lookup, no key, 8 single lookups, generic client).
- No key used. No outside request carried a person's name or account detail.
- Yardstick: `shop-domains.tsv` (619 websites, 285 seen once). "Top 100" = first 100 rows by result count.
- Fetch summaries are made by a small model; quotes below are only text it returned in quotation marks.

## Ranked table (my judgment, labeled as such)

| Rank | Source | Entity | Feeds | Reaches small shops | Top-100 coverage | Reuse rights | Form | Upkeep h/yr (estimate) | Why |
|---|---|---|---|---|---|---|---|---|---|
| 1 | OpenStreetMap shop tags | single shop | badge only (type, chain or independent) | yes | 4 of 5 tested top-100 rows found by name (6 of 8 shops overall) | ODbL, share-alike | API, bulk | 3 | Only source that reaches a once-seen shop; says what kind of shop, not how it behaves |
| 2 | Overture Maps Places | single shop | badge only | yes | 95% of graded stores found in an earlier site check (not top-100 specific) | CDLA Permissive 2.0 per provider | bulk | 3 | Better freshness than OSM; no ethics fields |
| 3 | NCG co-op locator | store (consumer co-op) | ethics (ownership) | yes | 0 of top 100; 1 of 619 sites (Sevananda) | Terms bar spidering | web page text | 2 | Clean ownership fact for natural-food co-ops |
| 4 | US Federation of Worker Cooperatives directory | store | ethics (already `worker_coop`) | yes | 0 new | none stated | web list, 490 entries | 2 | Already in use; Retail and Grocery filters exist |
| 5 | NCEO EO 150 list, plus DOL Form 5500 data | company | ethics (ownership) | no | 1 (Scheels, saved row 93) | NCEO: 100 words max; DOL: public records | web page; DOL zip files | 4 | Government data lets the site build its own ESOP flag; mid-size only |
| 6 | Fair Trade Federation retail locations | store | ethics | yes | 0 of 619 | none stated | web page, 66 stores | 1 | Stores vetted by documents and references, but tiny list |
| 7 | Green America certified businesses | business | ethics and environment | yes (dues from 0 to 5 employees) | 0 seen | not read | JS directory | 3 | Only vetted membership aimed at small firms; count and terms unknown |
| 8 | USDA Organic INTEGRITY database | operation (farm, handler) | environment | no (food makers, not shops) | NV | US federal data (see block) | download, monthly snapshots (NV) | 4 | Regulator-run; mostly makers, not retailers |
| 9 | B Corp | company | ethics (already used) | no | Alter Eco, Lake Champlain (leads; operator to confirm) | bulk dataset gone | directory (403 to agents) | 2 | Strongest evidence of the lot; low share of small shops |
| 10 | ABA IndieBound finder, NARTS, NBDA, AMIBA alliances | store | badge only (independent, ownership identity) | yes | NV (finders are script-driven) | not read | search pages | 6 | Real independent shops; no national file, so manual |

## Half 1: certifications and registries

### B Corp

| Field | Entry |
|---|---|
| F1 | Company (brand or shop) |
| F2 | Company name or website; profile pages carry a website. Medium error (legal vs trading name) |
| F3 | Governance, labor, environment; site feeds ethics only (`b_corp`); raise only |
| F4 | Worldwide count NV. Top 100: Patagonia (already used); Alter Eco and Lake Champlain Chocolates appear as B Corp pages in search results (leads, not confirmed: the directory returns 403 to agents). Darn Tough, Faribault Mill: search returned nothing |
| F5 | Certification by B Lab; audit depth not read |
| F6 | Directory terms page returned 403, not read. data.world page says: "The data.world Open Data Community officially retired on July 13, 2026." and that community datasets "are no longer accessible or available for download". https://data.world/blab/b-corp-impact-data. A Kaggle mirror claims CC BY-SA 4.0 (NV, third party) |
| F7 | Directory page only; no official bulk file found now. Search result: B Lab says questions go to certify@bcorporation.net (NV) |
| F8 | Estimate: 0 h to start (rows already added by hand); 2 h/yr to re-check by hand |
| F9 | Not listed = not certified or never applied |
| F10 | Name clash between a shop and a similarly named B Corp. Cost: unearned +0.25 |

### 1% for the Planet

| Field | Entry |
|---|---|
| F1 | Company (whole company or product line) |
| F2 | Profile slug or name; medium error |
| F3 | Environment; raise only (already `one_percent_planet`) |
| F4 | Directory count NV (page text did not load without script). Top 100: none found |
| F5 | Membership pledge; audit not read |
| F6 | Not read |
| F7 | Script-driven directory, https://directories.onepercentfortheplanet.org/ (title only returned) |
| F8 | Estimate: 1 h/yr |
| F9 | Not a member |
| F10 | Product-line members shown as whole company (the site already notes this for Avocado Green Mattress) |

### Climate Label (Climate Neutral)

| Field | Entry |
|---|---|
| F1 | Brand |
| F2 | Brand slug at explore.changeclimate.org/brand/<slug> |
| F3 | Environment; raise only (already used) |
| F4 | Count not shown in text. Tests: `/brand/rei` (control, known present) returned "REI | A Climate Label Certified Brand"; `/brand/alter-eco` returned "Alter Eco LLC | A Climate Label Certified Brand" (saved row 68, 6 results, a top-100 hit not yet in `data/certifications.json`); `/brand/darn-tough` returned "Brand Not Found" (guessed slug, inconclusive) |
| F5 | Third-party certification (not read) |
| F6 | Only "All rights reserved." |
| F7 | Searchable web pages, no export seen |
| F8 | Estimate: 1 h/yr |
| F9 | Not certified or slug mismatch |
| F10 | Slug guessing yields false "not found" |

### Fair Trade USA and Fairtrade America

| Field | Entry |
|---|---|
| F1 | Brand (product-level) |
| F2 | Brand name; the site already notes domains are sometimes inferred |
| F3 | Labor, ethics; raise |
| F4 | "We work with more than 1,500 companies" (Fair Trade USA, https://fairtradecertified.org/shop-fair-trade/). Fairtrade America: 60 licensees per its 2025 annual report (NV, search snippet). Top 100: Patagonia, Madewell and others already used; Alter Eco and Lake Champlain say fair trade on their own pages (NV) |
| F5 | Third-party product certification |
| F6 | Fair Trade USA terms: users may not "sell, license, rent, modify, distribute, copy, reproduce, transmit, publicly display" content without written authorization, and may not "frame or "mirror" the Site or incorporate pieces of it into a different web site or product." https://www.fairtradecertified.org/terms-of-use/. Fairtrade America: "Commercial use or publication of all or any item displayed is strictly prohibited" https://www.fairtrade.net/us-en/terms-of-use.html |
| F7 | Web pages; partner directory at partner.fairtradecertified.org showed only help text |
| F8 | Estimate: 2 h/yr, by hand |
| F9 | No Fair Trade product, which is common and neutral |
| F10 | Product-level mark shown as brand-level |

### USDA Organic INTEGRITY database

| Field | Entry |
|---|---|
| F1 | Certified operation (farm, processor, handler); retail food stores that do not process are usually outside certification (my understanding, NV) |
| F2 | Operation name, address; high error for shops, fair for makers |
| F3 | Environment; raise only |
| F4 | Count NV. Search results say the full dataset can be downloaded and monthly snapshots exist (NV). Top 100: food makers such as Alter Eco claim organic on their own pages (NV) |
| F5 | Regulator-run registry using accredited certifiers |
| F6 | Official pages returned 403 or a script error. A US federal database is probably public domain (17 U.S.C. 105, the same basis `data/README.md` uses for Census data) but I did not read a statement |
| F7 | Download plus a 2016-era REST API (XML) mentioned in a USDA webinar deck (NV) |
| F8 | Estimate: 6 h first load, 3 h/yr |
| F9 | Not certified; most shops never need to be |
| F10 | Chain vs operation name collision |

### Green America Green Business Network

| Field | Entry |
|---|---|
| F1 | Whole business |
| F2 | Website (applicants must have one); low error |
| F3 | Environment and social; raise |
| F4 | Count not stated (page cites 40 industries). Directory fetch returned "No results found" (probably script-loaded). Top 100: none known |
| F5 | Assessment plus Green America review; third-party check only for goods from e-commerce or wholesale sites: "Verification from the e-commerce site is not sufficient to attain a Green Business Certification." https://greenbusinessnetwork.org/certification |
| F6 | No terms read. Dues run $150 to $2,500 by size, per the page |
| F7 | Member directory at /directory (not rendered for me) |
| F8 | Estimate: 5 h to build a list by hand, 2 h/yr |
| F9 | Not a paying member |
| F10 | Paid membership could be read as pay-to-rank; label as "member, vetted" |

### Fair Trade Federation (retail locations)

| Field | Entry |
|---|---|
| F1 | Store |
| F2 | Name and address; website on most entries |
| F3 | Labor, trade; raise (ethics) |
| F4 | "Over 200 Verified Businesses"; 66 stores listed, 62 in the US. Test: none of the 66 names matches any of the 619 saved websites |
| F5 | Questionnaire, 3 or more references, committee review, $85 fee. Self-reported plus references; no audit mentioned. https://fairtradefederation.org/pages/verification |
| F6 | No terms on the page; footer is "© 2026 Fair Trade Federation" |
| F7 | Static web page, https://fairtradefederation.org/pages/retail-locations |
| F8 | Estimate: 1 h first load, 1 h/yr |
| F9 | Not a member (most shops) |
| F10 | Page does not say whether each listed store is a member |

### Employee ownership: NCEO lists, Certified EO, DOL Form 5500

| Field | Entry |
|---|---|
| F1 | Company |
| F2 | Company name; sponsor address in Form 5500; medium error |
| F3 | Ownership, labor; raise (ethics) |
| F4 | EO 150: 150 companies, 21 retailers, "Updated November 2026" (https://www.nceo.org/research/employee-ownership-150-largest-employee-owned-companies). NCEO ESOP database: 6,422 ESOPs, sold at $1,200 (nonmember). Certified EO: "Join 700+" members (https://certifiedeo.com/); directory aimed at every company with 30% or more employee ownership (search snippet, NV). Top 100 hit: Scheels (rank 14 on EO 150; scheels.com is saved row 93). Food Depot (EO 150 #112; saved row `fooddepot.com`, 1 result) may be the same grocery chain, unconfirmed: its page names no owner. Room & Board, Publix, WinCo and the other listed retailers: no saved row (name grep) |
| F5 | Regulator filing (Form 5500) or certifier |
| F6 | NCEO: "All content on our website is copyright-protected"; quote "up to 100 words" with credit. https://www.nceo.org/policy-use-nceo-content. DOL: free zip downloads; the page says they are "typically updated around the first of each month, give or take a few days." https://www.dol.gov/agencies/ebsa/about-ebsa/our-activities/public-disclosure/foia/form-5500-datasets. Certified EO terms not read |
| F7 | NCEO web page; DOL zip files with layout files. I did not confirm that Form 5500 carries an ESOP flag |
| F8 | Estimate: 8 h first load from DOL, 3 h/yr |
| F9 | Not an ESOP, or too small to be listed |
| F10 | ESOP does not equal good treatment of workers or environment |

### Worker and consumer co-ops

| Field | Entry |
|---|---|
| F1 | Store or business |
| F2 | Website domain; low error |
| F3 | Ownership and governance; raise (ethics) |
| F4 | USFWC: "Displaying 1 - 20 of 490", mixed "Worker Co-op" and "Democratic Workplace" (https://info.usworker.coop/iframe/directory/worker-co-op-dem-workplaces). NCG: about 239 entries in 40 states (manual count by the fetch tool; https://www.ncg.coop/find-co-op). Test: domain grep of the saved results against the NCG domains found one match: Sevananda (sevananda.coop, 4 results, row 145). Rainbow (row 348) is already used; Leverett Village Co-Op (leverettcoop.com, row 597) is a co-op in the saved results that the NCG list does not carry |
| F5 | Membership list, structure unaudited |
| F6 | USFWC: none stated. NCG: "The use of any tools, programs, robotic algorithms or products to automatically download or "spider" the site"; "no copying or exploitation of material from the Services is permitted without the express written permission of NCG". https://www.ncg.coop/terms-use |
| F7 | Web lists; NCG list is in page text |
| F8 | Estimate: 2 h first load, 2 h/yr (ask NCG for permission) |
| F9 | Not a member of that network |
| F10 | "Consumer co-op" is not "worker co-op"; keep kinds apart |

### Hardware co-ops (Ace, True Value, Do it Best)

| Field | Entry |
|---|---|
| F1 | Store (owned by a local retailer who is also a co-op shareholder) |
| F2 | Domain; many store sites are separate domains |
| F3 | Ownership; no labor or environmental meaning |
| F4 | About 12 of 619 saved websites (estimate, by name) incl. rows 7, 42, 43, 45 |
| F5 | Trade-group structure |
| F6 | Wikipedia (CC BY-SA, terms not re-read) says Ace is "an American hardware retailers' cooperative" and "Independent retailers became the exclusive shareholders in the company." https://en.wikipedia.org/wiki/Ace_Hardware. Do it Best bought True Value out of bankruptcy in November 2024 and describes itself as member-owned; True Value is now a Do it Best subsidiary, so member-owned fits Ace and Do it Best, and True Value only through its parent (search snippets, NV) |
| F7 | Already in `data/chains.json` for Ace |
| F8 | Estimate: 1 h |
| F9 | Not a member |
| F10 | Co-op ownership by shop owners says nothing about workers, pay, or the environment. It does mean a local owner, so badge only; never `worker_coop` |

### Product and brand certifications (low reach into shops)

Shared across the rows: F2 join is the brand or company name (medium error; makers often sell under a different trade name); F3 feeds ethics (labor, animal welfare) or environment (FSC, GOTS, bluesign, organic) and can only raise; F8 is about 1 to 2 h/yr each for a hand list (estimate), more if a bulk file is allowed.

| Source (URL) | F1 / F5 | F4 and F6 (read 2026-11-11) | F7 | F9 and F10 |
|---|---|---|---|---|
| Leaping Bunny (https://www.leapingbunny.org/) | Brand; third-party | Lists brands and companies, not retailers; app exists; count and terms not read | Web, app | Not certified; no retail effect |
| FSC (https://search.fsc.org/disclaimer/) | Certificate holder | Retailers appear only if they hold a certificate. "Bulk downloads of data are not supported by this app and are not allowed under the terms of use." | Lookup only | Bulk use barred; look-ups only |
| GOTS (https://global-standards.org/) | Supplier; third-party | "Find suppliers" link to global-standards.org/suppliers/certified-suppliers; terms not read | Web | Makers, not shops |
| bluesign (https://www.bluesign.com/) | Partner company | "900+ System Partners in over 50 countries"; terms not read | Web list | Makers and brands |
| Fair Labor Association (https://www.fairlabor.org/) | Brand member, accredited | Public lists of Accredited, Participating, Affiliates; count not on page; terms not read | Web list | Large brands only |
| Real Organic Project (https://realorganicproject.org/) | Farm | Page says 1,100 farms have joined since 2018; farm directory; no retailer directory | Web | Farms, not shops |
| Regenerative Organic (https://regenorganic.org/product-directory/) | Brand and product | 2,789 products, 344 brands (search snippet, NV) | Web directory | Product-level |
| Certified Humane (https://certifiedhumane.org/) | Producer | "Who's Certified" list; no store locator on the home page; terms not read | Web list | Producers |
| Fair Food Program (found in p1) | Buyer | 5 grocers (p1 file) | PDF | Chains only |

All of these grade makers. None grade shops, so they help only a brand selling direct.

### Living Wage, union, owner-identity certifications

| Source | Entry |
|---|---|
| Living Wage for US | Page reports 300+ employers partnered; certified count and list not read; sectors not stated. https://livingwageforus.org/living-wage-employers/. F3 ethics (pay), raise; F5 assessment of wages and benefits; reach into shops: NV |
| NLRB election results | Regulator record, CSV download. 35,473 results, fields include employer, unit city and state, union. Shows an election, not a "union shop". Newest row dated 2026-12-02, which is after today, so treat the date as unverified. No terms stated. https://www.nlrb.gov/reports/graphs-data/recent-election-results. Reach into small independents: rare, by nature. Absence means no election, not "non-union" |
| National union-shop list | Not found. Only regional union lists (North Shore AFL-CIO, UFCW Local 5, a Connecticut list) from search results (NV) |
| SBA DSBS and SAM.gov | SAM Entity API needs a personal key and returns a business-type list with woman-owned types; the page gives a default limit of 10 requests a day for a personal key with no role (https://open.gsa.gov/api/entity-api). Search result says SAM prohibits scraping (NV). Veteran status moved to SBA DSBS (https://www.vetbiz.va.gov/). A key is the operator's to get. Shops registered here are federal-contractor-minded, so small retail reach is probably low (estimate) |
| Private or local minority, woman and veteran certifiers | Not researched (only the SBA and SAM route was read). One lead from a search result: a US Federation of Worker Cooperatives blog on getting worker co-ops certified as minority or women-owned (NV). F3 ownership identity, badge only; F5 certifier review; reuse unknown |
| NCEO certification (MMEO, MWEO, SEDEO) | Needs 100% employee ownership and a CPA report. No public registry on the page. https://www.nceo.org/certifications |

### State and city green business programs

| Field | Entry |
|---|---|
| Source | California Green Business Network, https://greenbusinessca.org/ |
| F1, F2 | Business; low-error website match likely |
| F3 | Environment; raise |
| F4 | More than 4,000 businesses statewide, retail and grocery among member types (Marin County page, NV). Top 100: none expected (California-only) |
| F5 | County-run audits (NV) |
| F6 | Terms bar scraping: "to scrape any portion of the Website or any content from CAGBN;" https://greenbusinessca.org/terms-of-use/ |
| F7 | Script directory at search.greenbusinessca.org (title only returned). Los Angeles runs its own directory (NV) |
| F8 | Estimate: ask for a data grant; 4 h |
| F9 | Not in California or not enrolled |
| F10 | Local programs vary; do not treat as national |

## Half 2: signals that reach a small local shop

### OpenStreetMap tags (US instance, https://taginfo.geofabrik.de/north-america:us/, read 2026-11-11)

The shop total is not reported; I derived about 828,000 US objects with a `shop` key (estimate: `together_count` divided by `to_fraction`). Counts below are objects that carry both `shop` and the tag, any value including `no`.

| Tag | Objects with `shop` + tag | Share of shops (estimate) | Note |
|---|---|---|---|
| `brand` | 271,452 | 32.8% | `brand:wikidata` 266,040: marks chains and franchises |
| `second_hand` | 12,678 | 1.5% | Key-wide values: only 7,531, yes 4,457, no 787. `shop=second_hand` 4,795; `shop=charity` 4,206 |
| `operator:type` | 663 | 0.08% | Key-wide 96,241 "public" etc. are mostly not shops |
| `repair` | 270 | 0.03% | `service:bicycle:repair` 1,579 |
| `organic` | 1,388 | 0.17% | Key-wide: yes 1,164, only 356, no 291 |
| `fair_trade` | 69 | 0.01% | |
| `bulk_purchase` | 40 | 0.005% | |
| `zero_waste` | 21 | 0.003% | |

Meaning: OSM can say "probably a chain" (32.8%) or "secondhand or charity shop" (about 9,000 objects), not "ethical". Absence of a tag is silence, not "no".

License (https://www.openstreetmap.org/copyright): "OpenStreetMap is open data, licensed under the Open Data Commons Open Database License (ODbL)"; "If you alter or build upon our data, you may distribute the result only under the same license."; attribution is required.

Name test (Nominatim, 8 shops, 2026-11-11, one lookup each):

| Shop (saved row) | Found in OSM | Ethics-relevant tag |
|---|---|---|
| Savi Provisions (row 31) | yes, 3 branches | `organic=yes` on Midtown only |
| Last Minute Gear (row 36) | yes, `shop=outdoor` | none |
| Sports Basement (row 37) | yes | none |
| Creative Kidstuff (row 38) | a St. Louis Park, MN `clothes` and a Romulus, MI airport `toys`; not clearly this shop | none |
| Elder's Ace Hardware (row 43) | yes, 3 branches | none; one carries `brand:wikidata` Q4672981 (Ace) |
| Hilton's Tent City (row 517) | yes, `outdoor;sports` | none |
| Vermont Kitchen Supply (row 567) | yes, `shop=houseware` | none |
| Anglers All (row 593) | yes, `shop=fishing`, Ashland WI (match to saved shop unchecked) | none |

Result, found by name: 6 of 8 clearly (Savi, Last Minute Gear, Sports Basement, Elder's, Hilton's, Vermont Kitchen Supply); Creative Kidstuff uncertain; Anglers All not found (the saved shop is in Colorado per anglersall.com; the OSM hit is in Wisconsin). 1 of 8 carries an ethics-relevant tag, and it is a product claim. Top-100 rows tested: 31, 36, 37, 38, 43 (4 of 5 clearly found); once-seen: 517, 567, 593 (2 of 3). Earlier site check: OSM found 74% and Overture 95% of graded stores (`docs/open-place-coverage.md`).

| Field | OSM entry |
|---|---|
| F1 | Single shop (one point, building or area) |
| F2 | Name plus place; the `website` tag is present on 27.8% of US shop objects (230,534 of about 828,000, estimate), so domain match works for about a quarter and name-plus-location for the rest. Medium error (see Anglers All) |
| F3 | Type and ownership form, not conduct. Can feed a badge ("chain", "secondhand"); no score effect recommended. `organic=yes` and `fair_trade=yes` are product claims by a volunteer |
| F4 | Counts in the table; test above |
| F5 | Crowd-sourced, no proof |
| F6 | ODbL, share-alike: if the site publishes a derived database, that database must stay under the same license (check with a lawyer) |
| F7 | API (Overpass, Nominatim) and bulk extracts; edit age median about 2.1 years in the earlier site check |
| F8 | Estimate: 10 h to build a per-search lookup, 3 h/yr |
| F9 | No tag means unknown, never "no" |
| F10 | Anyone can edit; a wrong `organic=yes` or a vandalized `brand` could mark a shop up or as a chain. Cost to site: a false "chain" badge on an independent |

### Overture Maps Places

| Field | Entry |
|---|---|
| F1 | Single shop |
| F2 | Website (94% of found shops in the earlier site check) or name plus location; low to medium error |
| F3 | Fields: brand (names, wikidata), categories, operating status, websites, socials, confidence. The schema page lists no field for chain status, ownership, or sustainability (https://docs.overturemaps.org/schema/reference/places/place/). Badge only |
| F4 | 82 of 86 graded stores found in the earlier site check; not matched against `shop-domains.tsv` here |
| F5 | Aggregated provider data (Meta, Microsoft, BrightQuery per the earlier check); no proof |
| F6 | No theme-level statement. Providers: "Available under [CDLA Permissive 2.0]" (Meta, Microsoft and others); Foursquare Apache 2.0; AllThePlaces CC0. https://docs.overturemaps.org/attribution/ |
| F7 | Bulk release (2026-09-23.1 in the earlier check); median record age 25 days |
| F8 | Estimate: 8 h to load, 3 h/yr |
| F9 | No `brand` can mean independent or unlabeled chain; the earlier check found brand wikidata on 0 of 82 shops, so use OSM for chain status |
| F10 | Closed shops (operating status missing on 8 of 82); a stale record is a wrong badge |

### Independent-business groups and member lists

| Source | What it is | Reach | Reuse and form |
|---|---|---|---|
| AMIBA alliances | 59 unique organizations on one page, https://amiba.net/?p=576 (Local First Utah, Dane Buy Local, Go Local STL and others) | Shops, one alliance per city | No national file; each city site differs. Member pages loaded as "Loading..." for me |
| ABA IndieBound finder | Search by ZIP; "Results include only American Booksellers Association member stores that have elected to share ownership identity information publicly." | Bookstores, with opt-in owner filters | Script-driven; terms not read. Test of Bound Booksellers, Birchbark Books: inconclusive |
| Grassroots Outdoor Alliance | 84 logos plus 6 names, no membership criteria stated (https://www.grassrootsoutdoors.com/retailers-1) | 90 outdoor shops | 3 already in `data/certifications.json`; none of the 6 named-only shops is in the saved results |
| NARTS (https://www.narts.org/find-a-narts-member-store) | Page says each member store is independently owned; find-a-store link; count unknown | Resale shops | Script; terms not read |
| NBDA (https://www.nbda.com/) | Trade group for specialty bicycle retailers; lists a "Dealer Finder/Member Directory" at https://nbda.com/dealer-finder-member-directory/; page does not say whether it is public | Independent bike shops | Not opened; terms not read |
| Hardware co-ops | Block above | | |

Shared F1 to F10 for the four groups above (AMIBA, IndieBound, NARTS, NBDA):

| Field | Entry |
|---|---|
| F1 | Single shop |
| F2 | Name and city, or website; low to medium error |
| F3 | Ownership form and community; badge only (like `independent_retailer_assoc`), no score effect |
| F4 | Counts not stated except AMIBA (59 organizations, not shops). Top-100 overlap: NV (finders are script-driven). Test of Bound Booksellers and Birchbark Books on IndieBound: no results rendered |
| F5 | Unaudited membership |
| F6 | Not read for any of the four |
| F7 | Search pages; no bulk file seen |
| F8 | Estimate: 6 h/yr, mostly manual or a permission request per group |
| F9 | Not a member, or did not opt in to share ownership identity |
| F10 | A membership list can lag; wrongly listing a shop as an independent when it was sold costs trust, not score |

### Refill, repair, thrift directories

| Source | Finding |
|---|---|
| RefillHQ, Refillery Collective, Litterless, Upstream Solutions | Search summary: RefillHQ claims over 1,300 stores yet shows 847; Refillery about 600 (PIRG). Count and license NV; my fetch of the RefillHQ about page was a 404 |
| Repair | No open US directory of repair shops found. Repair Café lists volunteer events; Open Repair Data holds repair records, not places (NV). OSM `service:bicycle:repair` (1,579) is the usable proxy |
| Thrift | OSM `shop=second_hand` and `shop=charity` (about 9,000); NARTS finder |

### Self-declaration with evidence

| Option | Proof taken | Reusable | Verdict |
|---|---|---|---|
| Google Business Profile attributes (women-owned, veteran-led and others) | Owner-chosen; proof not read (search summary, NV) | Google terms not read; the Maps terms fetch was truncated | Do not use without reading terms |
| IndieBound owner-identity opt-in | Shop shares publicly | Terms not read | Real but bookstores only |
| Green America, Fair Trade Federation, NCEO certification | Yes: website review, references, CPA report | No: list rights not granted or not stated | Proof exists, reuse does not |
| OpenStreetMap | None | ODbL | Open but unproven |
| The site itself (`docs/ranking.md` Disputes) | Evidence field in the dispute template | Own data | Closest to a claim form: a "claim this shop" template that asks for a link to a listed source would reuse the existing dispute flow (design option, not researched) |

## Dead ends

- B Corp bulk file: data.world page says community datasets are no longer available; no replacement found.
- FSC: bulk downloads barred (quote above). California Green Business Network: scraping barred.
- Fair Trade USA and Fairtrade America lists: reuse barred or not licensed; product-level.
- NCEO ESOP database: $1,200; NCEO site text capped at 100 words.
- National union-shop list: none. NLRB shows elections, not shop status.
- Overture: no chain, ownership or sustainability field.
- Apify scrapers for B Corp, USDA, SBA turned up in search: unofficial and may break the sites' terms; not used.

## Blocked pages for the operator to open

| URL | Wanted |
|---|---|
| https://www.bcorporation.net/en-us/find-a-b-corp/ and /en-us/terms-and-conditions/ (403) | Directory terms; confirm Alter Eco and Lake Champlain Chocolates |
| https://organic.ams.usda.gov/integrity/ and /integrity/Reports/DataHub.aspx (script error); https://www.ams.usda.gov/rules-regulations/organic/organic-integrity-database (403) | Data downloads, API, whether retailers appear, terms |
| https://directories.onepercentfortheplanet.org/ and https://explore.changeclimate.org/ | Member counts, terms |
| https://partner.fairtradecertified.org/ | Directory fields, retailers included |
| https://greenbusinessnetwork.org/directory and https://search.greenbusinessca.org/ | Rendered listings, counts, retail share |
| https://certifiedeo.com/companies and /terms-of-service | Directory size, reuse |
| https://livingwageforus.org/living-wage-employers/ | Certified list and retail share |
| https://www.indiebound.org/indie-store-finder, https://www.narts.org/find-a-narts-member-store, https://nbda.com/dealer-finder-member-directory/ | Test Bound Booksellers, Birchbark Books, a thrift shop, a bike shop (Summit Bicycles); terms; whether public |
| https://www.fairlabor.org/members/all-members/, https://certifiedhumane.org/whos-certified/, https://global-standards.org/suppliers/certified-suppliers, https://www.bluesign.com/system-partners | Counts and terms |
| https://sam.gov/content/entity-information; Google Maps Platform terms and https://support.google.com/business/answer/9049526 | Scraping and caching terms; attribute rules |
| DOL Form 5500 layout files for the newest year | Whether a plan-feature code identifies ESOPs |
| https://www.ncg.coop/ (ask) | Permission to use the co-op list |
