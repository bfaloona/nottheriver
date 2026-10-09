# Directories, rating sites, certification finders and campaign sites: feature comparison against nottheriver

Status: complete for this pass (read 2026-10-09). Pages that would not open are listed in section D with the reason.
Scope: sites that help people buy from companies with ethical or sustainable practices: directories, curated lists, rating and certification sites, campaign sites. Search engines, apps, browser extensions and local-shop finders are a sibling report; where a site in this scope also has one, it gets one line here.
Method: web reading only, on each site's own pages (about, FAQ, methodology, privacy, pricing, one example entry) with a generic client identifier; nothing from signed-in accounts. Every claim cites the page and the date read. "Not stated" means the pages read do not say. Where a site's own page would not open and the only material is a search-result snippet, the profile says so.
Prior work: 26 Amazon-alternative list sites are profiled in `research/sites/*.md` (index `research/index.json`, checked 2026-09-25). For sites already profiled there, this file cites that profile and adds only what is new for the feature question.

Feature labels (from the brief):

| Label | Feature |
|---|---|
| FT1 | product search (type a product, get shops), not a brand list |
| FT2 | nearby local shops, ranked by distance, with a map |
| FT3 | every result explained: score components with values and a source link |
| FT4 | negative findings (labor, environment, governance) that down-rank, each sourced and dated |
| FT5 | a dispute link on every finding and badge |
| FT6 | Amazon and Amazon-owned brands never appear |
| FT7 | chain vs independent badge |
| FT8 | privacy: zip never leaves the browser, no accounts, no tracking, a published "what is kept" table |
| FT9 | cost transparency: per-search cost in the footer, an open cost ledger, open source (AGPL) |
| FT10 | published quality numbers (precision measured on graded searches) |
| FT11 | no affiliate links, no sponsored placement |
| FT12 | planned: a curated shop directory with sources and dispute state, search as fallback |
| FT13 | planned: suggested alternatives to Amazon-owned brands |
| FT14 | planned: honest degradation when the monthly budget is spent |

Matrix cell rule (section B): "yes" means the feature is there as described; "partial" means a recognizable piece of it is there (for example scores without sources, or a location filter without a map); "no" means not there or not stated on the pages read. "Not stated" in a profile becomes "no" in the matrix.

## A. Profiles

Each profile uses the same field order: owner and funding; what it is; scope; how shops get in; evidence shown; negatives shown; disputes or corrections; local or nearby; privacy; affiliates or sponsorship; open source; last visible update; FT labels (yes or partial).

### A1. Good On You (goodonyou.eco)

- Owner and funding: founded in Australia in 2015 by Gordon Renouf (CEO) and Sandra Capponi; ownership not stated. Revenue lines named: an affiliate platform, brand tools ("Good Measures"), and a "Dashboard + API" for retailers; a crowdfunding campaign funded the US launch (partnerships.goodonyou.eco/about, 2026-10-09).
- What it is: brand rating directory for fashion and beauty ("7,000-plus brands"), with an app; business tools for brands and retailers (same page; goodonyou.eco, 2026-10-09).
- Scope: global brands; geographic scope not stated.
- How brands get in: rated from public information; "anyone can request a rating"; brands "have no input in their ratings beyond what is publicly disclosed" (partnerships.goodonyou.eco/how-we-rate, 2026-10-09). The same page lists paid products for brands and does not say whether those relationships affect ratings.
- Evidence shown: sub-scores for Planet, People, Animals (each out of 5) with bulleted rationale; the Patagonia page cites no individual sources with dates, only glossary links and the methodology page (directory.goodonyou.eco/brand/patagonia, 2026-10-09). Numeric scores out of 100 "are available only in business tools".
- Negatives shown: shortcomings are named in the rationale ("no evidence it is on track"); no sourced, dated findings.
- Disputes: no process described on the about, how-we-rate or brand pages.
- Local or nearby: none. The brand page lists online retailers (eBay, Farfetch) with tracking parameters.
- Privacy: cookies consent by use; Google Analytics, Fullstory, Amplitude, Hotjar, Meta advertising; affiliate tracking via Tune and Everflow; policy "Updated: 24 Jun 2022" (goodonyou.eco/privacy-policy, 2026-10-09).
- Affiliates or sponsorship: yes; an "Affiliate Network" product, "Exclusive offers" discount codes, tracking links on brand pages.
- Open source: not stated.
- Last visible update: Patagonia rating "Last updated" 2026-04-02; journal items dated 06 to 08 Oct 2026.
- Sibling-scope note: it has a consumer app; no browser extension mentioned.
- FT labels: FT3 partial, FT4 partial, FT13 partial ("similar brands" on each rating, not Amazon-specific).

### A2. Ethical Consumer (ethicalconsumer.org)

- Owner and funding: "an independent, not-for-profit, multi-stakeholder co-operative with open membership", Manchester, founded 1989; income from reader subscriptions, consultancy, "advertising from ethically vetted companies", grants (ethicalconsumer.org/about-us, 2026-10-09).
- What it is: company and brand ratings (over 40,000 companies, brands and products), 100+ shopping guides by product category, campaigns and boycotts, a magazine.
- Scope: UK-focused guides ("Ethical online shopping in the UK"); companies rated are global.
- How companies get in: chosen by the researchers; companies are emailed before comparative research (ethicalconsumer.org/node/4408, dated 2018-06-01, read 2026-10-09).
- Evidence shown: score out of 100 with category scores (Climate, Workers, Tax Conduct, and so on); the Amazon profile shows category values, inline sources by outlet (Guardian, BBC, Reuters), research dates (August 2024, August 2025, spring-summer 2026), "Last updated: Tuesday 7th of July 2026". Full stories and the score breakdown are "reserved for subscribers only" (ethicalconsumer.org/company-profile/amazoncom-inc, 2026-10-09).
- Negatives shown: yes; each "story" counts for five years, older stories "will no longer impact company scores" (about-us/our-ethical-ratings, 2026-10-09).
- Disputes: companies can request their stories, challenge in writing, and replies become a published "corporate response" or "negating reference"; "changes can be made within 24 hours if necessary" (node/4408 and search-result excerpt, 2026-10-09). No per-finding link on the profile.
- Local or nearby: none.
- Privacy: subscriber login; Google Analytics classed as essential, Hotjar and ShareThis optional; "will not sell or rent personal information"; policy updated June 2026 (ethicalconsumer.org/privacy-policy, 2026-10-09).
- Affiliates or sponsorship: "Ethical Consumer makes a small amount of money from your purchase" via tracked "Places to buy" links; ads from vetted companies (retailers/shopping-guide/ethical-online-retailers, 2026-10-09).
- Open source: not stated.
- Last visible update: Amazon profile 2026-07-07; online retailers guide 2025-10-01.
- FT labels: FT3 partial (values and sources public, detail paywalled), FT4 yes, FT5 partial, FT6 partial (Amazon appears, scored 18 and under active boycott), FT11 partial, FT12 partial, FT13 yes ("Alternatives to Amazon series", "Where you can buy things instead?").

### A3. B Lab, Certified B Corporation directory (bcorporation.net)

- Owner and funding: B Lab, described as a nonprofit in the complaints-process coverage (search results, 2026-10-09); certification fees scale with revenue (bcorporation.uk pricing and bcorporation.eu pricing via search results, 2026-10-09; the US pricing page was not opened). Every bcorporation.net page tried returned HTTP 403 to plain fetches; the browser check below opened the directory, a profile, the complaints page and the privacy policy.
- What it is: certification plus a public directory ("Find a B Corp"), 10,801 companies listed (bcorporation.net/en-us/find-a-b-corp/, browser, 2026-10-09).
- Scope: global; companies, not products.
- How companies get in: application, B Impact Assessment, verification, annual fee; paid.
- Evidence shown: each profile shows an overall B Impact Score with the 80 qualifying line and the median for ordinary businesses, five area scores (Governance, Workers, Community, Environment, Customers), earlier overall scores by year, standards version, "Certified Since", and attached disclosure documents; no per-claim sources (find-a-b-corp/company/patagonia-inc/, browser, 2026-10-09).
- Negatives shown: none on the profile read. The complaints page says a resolved complaint can require the company to "disclose the findings of the case on its B Corp public profile", and a suspended company's profile "will indicate that the company is suspended"; outcomes run from upheld with no action to revocation, decided by an independent Standards Advisory Council (bcorporation.net/en-us/standards/complaints/, browser, 2026-10-09).
- Disputes: a complaint form for "intentional misrepresentation" or breaches of the Declaration of Interdependence; customer-service issues, pending legal actions and practices not required for certification are excluded; not per badge (same page).
- Local or nearby: filters are Location (country only, 217 entries), Ownership, and under "More filters" company size by employees and industry; no map, no distance; a test city typed in the keyword box returned companies whose descriptions name that city (find-a-b-corp, browser, 2026-10-09).
- Privacy: last updated 24 August 2026; cookies and server logs collect "Technical Data"; personal data received from "analytics providers such as Google", "advertising networks" and "data brokers or aggregators" (bcorporation.net/en-us/privacy-policy/, browser, 2026-10-09). The cookie banner names sharing with "social media, advertising, and analytics partners".
- Affiliates or sponsorship: no affiliate links seen; listing requires paid certification.
- Open source: not stated.
- Last visible update: newest listings "Certified since October 2026"; privacy policy 2026-08-24.
- Browser check 2026-10-09: opened bcorporation.net/en-us/find-a-b-corp/, /find-a-b-corp/company/patagonia-inc/, /standards/complaints/ and /privacy-policy/ (each first load in a fresh browser session; a second page load in the same session got a Cloudflare "verify you are human" check, which was not clicked). Corrected: profile scores are now verified on the site (previously a third-party description); the location filter is country only; complaint findings can appear on profiles; privacy policy read. FT cells unchanged: FT2 stays partial (country filter, no map or distance); FT4 stays no (disclosure is a stated process, none seen, nothing down-ranked).
- FT labels: FT2 partial, FT3 partial, FT5 partial, FT11 partial.

### A4. DoneGood (donegood.co)

- Already profiled: `research/sites/donegood-co.md` (checked 2026-09-25): the shopping tool is gone from the domain, which now serves an unrelated climate publication. New this run: shop.donegood.co does not resolve (DNS failure, 2026-10-09). Nothing to add on features.
- FT labels: none verifiable.

### A5. Goods Unite Us (goodsuniteus.com)

- Owner and funding: operator not described on the site; founder Brian Potts named in a news item; funded by in-app Premium ($3.99 a month), IndexAlign subscriptions, data licensing, individual donations; "We don't accept money from companies or political organizations in exchange for inclusion, removal, or better scores" (goodsuniteus.com/why-goods/, 2026-10-09).
- What it is: brand political-donation ratings ("Search a Brand, See its Politics"): party lean, issues scorecard, Campaign Finance Reform score, politicians donated to, "Alternative Brand Suggestions"; 7,000+ companies (goodsuniteus.com, 2026-10-09).
- Scope: US; brands and companies.
- How brands get in: researched from government filings; "check with the FEC" is the stated way to verify.
- Evidence shown: scores and donation recipients; no per-item source links stated; data updated "based on the reporting cycles of government sources".
- Negatives shown: donations lower the score; not labor or environment findings.
- Disputes: "We love it when companies reach out"; corrections made when needed; no per-finding link.
- Local or nearby: none.
- Privacy: accounts offered; cookies, web beacons, third-party ad tracking; shares "with third parties for their own services and marketing purposes" with opt-out; "Last Updated: 9/02/2025" (goodsuniteus.com/privacy-policy/, 2026-10-09).
- Affiliates or sponsorship: none stated; merchandise store.
- Open source: not stated.
- Last visible update: copyright 2026; no data date shown. The methodology and FAQ pages linked from the site returned 404.
- Sibling-scope note: the app is the main product; no browser extension mentioned.
- FT labels: FT3 partial, FT4 partial, FT5 partial, FT11 partial (this pass saw no ads; the search-tools pass found ads and an ad-free paid tier, so partial), FT13 partial (alternative brands, not Amazon-specific).

### A6. Progressive Shopper (progressiveshopper.com)

- Owner and funding: Progressive Shopper, Inc.; funding not stated (progressiveshopper.com, 2026-10-09).
- What it is: a browser extension (Firefox, Chrome, Edge) that flags brands by political donations and issue ratings; the website has no searchable company list (progressiveshopper.com/politics/, 2026-10-09). This is sibling scope; one line: FEC data "for the 2016, 2018, and 2020 election cycles", issue ratings deferred to Media Matters, HRC, As You Sow; updates "likely three to four times per year" (how-it-works, 2026-10-09).
- Privacy: logs IP, approximate location, "website history for selected websites"; Google Analytics; advertisers may set cookies; policy effective 2018-05-02 (progressiveshopper.com/privacy, 2026-10-09).
- Disputes, local, open source: not stated.
- FT labels: FT4 partial (red octagon "serious problem" from third-party ratings; undated on the pages read).

### A7. Green America Green Business Network directory, formerly Green Pages (greenbusinessnetwork.org)

- Already partly profiled: `research/sites/greenamerica-org.md` covers the "Sustainable Alternatives to Amazon" page and notes that every pick links to this directory and that certified members pay dues.
- Owner and funding: Green America, 501(c)(3); certification dues $150 to $2,500 a year by employee count (greenbusinessnetwork.org/certification, 2026-10-09). greenpages.org redirects here.
- What it is: member directory of certified businesses ("All businesses listed have earned Green America's Green Business Certification") with a keyword box and three filters: location, industry (a list of industries from "Apparel and Textiles" on) and ownership (AAPI-, Black-, disability-, Latinx/o/a- and Hispanic-, LGBTQ+-, veteran-, woman- and worker-owned) (greenbusinessnetwork.org/directory, browser, 2026-10-09). The plain fetch earlier this run rendered "No results found" with no controls.
- How businesses get in: application, industry-specific screening, approval, dues; disqualifiers include "legal complaints involving product integrity, labor abuse, fraud".
- Evidence shown: certification only; no sources per business seen.
- Negatives shown: no.
- Disputes: a "Complaints and Appeals Standard Operating Procedure" for certification; complaints can trigger review.
- Local or nearby: "Search by location" offers "Within 5 / 10 / 30 / 60 / 120 / 200 miles of", "by city/state/country" or "all areas"; the zip field behind the radius choice stayed hidden at the browser width used, so a radius search was not run; no map and no distance shown in results (greenbusinessnetwork.org/directory, browser, 2026-10-09).
- Browser check 2026-10-09: opened greenbusinessnetwork.org/directory (fresh browser session). Search works in a browser: the keyword box sets a "tag" value in the URL (#!directory/tag=...) and matched both a member's name ("AltaadiR" returned AltaadiR LLC) and a word in a member's description ("Nepal" returned Aid Through Trade, Inc. and one other member); fields beyond name and description are not stated. Corrected: the directory is not empty and has location, industry and ownership filters. FT2 changed from no to partial (a radius filter in miles without a map, the cell rule's own example), count column updated.
- Privacy: third-party ad cookies, visitor logs; "does not rent, share, sell or trade supporter e-mail addresses"; updated 2025-06-10 (greenamerica.org/privacy-and-policy, 2026-10-09).
- Affiliates or sponsorship: no affiliates seen; listing requires paid certification.
- Open source: not stated. Last visible update: copyright 2026.
- FT labels: FT2 partial (radius filter in miles, no map), FT5 partial, FT11 partial, FT13 partial (the Amazon alternatives page, undated, per the existing profile).

### A8. Better World Shopper (betterworldshopper.org)

- Owner and funding: Dr. Ellis Jones (Holy Cross College, MA); funding not stated beyond book sales (betterworldshopper.org/about/, 2026-10-09).
- What it is: letter grades A to F for 2,000+ companies in 100+ product categories; search by company or category; a book; an app per the about page (the homepage does not mention it).
- Scope: US brands (inferred from the mainstream US brands and MA address; not stated).
- How companies get in: researcher's database; "76 reliable sources of data" listed by name (Greenpeace, Oxfam, US EPA, US SEC) (betterworldshopper.org/the-research/, 2026-10-09).
- Evidence shown: grade and five category names (Human Rights, Environment, Animal Protection, Community Involvement, Social Justice); per-company sources not shown; weights not published.
- Negatives shown: not stated. Disputes: not stated.
- Local or nearby: none.
- Privacy: "We will not sell or redistribute your information"; the Terms and Privacy links on the homepage point to "#".
- Affiliates or sponsorship: none seen. Open source: not stated.
- Last visible update: copyright 2017; methods paper path 2019/09.
- FT labels: FT3 partial (grade only), FT8 partial, FT11 partial.

### A9. LeafScore (leafscore.com)

- Owner and funding: LeafScore, Inc., Birmingham, MI; affiliate commissions ("Affiliate revenue is second"), an own store "LeafScore Essentials"; "we do not accept sponsored posts" (leafscore.com/about-us/ and /affiliate-disclosure/ updated 2025-11-20, read 2026-10-09).
- What it is: product reviews with a 1 to 5 leaf score, plus a brand directory (the brand-directory URL returned 404).
- Scope: US consumer products.
- How products get in: editorial research; brands can submit documentation to turn grey leaves into color "verified" leaves; whether brands pay is not stated (leafscore.com/methodology/, 2026-10-09).
- Evidence shown: qualitative leaf levels; sources described in general (government safety data, WHO, litigation records, EWG); no per-product source list.
- Negatives shown: partial; litigation is "a clue", poor customer-service records can exclude a product; no score deduction stated.
- Disputes: not stated. Local: none.
- Privacy: cookie banner; policy not read. Open source: not stated.
- Last visible update: affiliate disclosure 2025-11-20; copyright 2026.
- FT labels: FT1 partial (product reviews with shop links, not shops), FT3 partial, FT4 partial.

### A10. Sustainable Jungle brand directory (sustainablejungle.com)

- Already profiled: `research/sites/sustainablejungle-com.md` (the Amazon alternatives article; disclosed affiliate links; 1% for the Planet member). New for this question:
- What it is: a brand directory with filters for Product Category, Certifications (66), Attributes (29), Location, Ships From, Ships To, Price Point, Rating tier, Discount; 14 pages of entries; rated brands show a percentage ("scores 70% overall") against "22 criteria across four pillars"; discount codes on entries; no sources in the listings (sustainablejungle.com/brand-directory/ and /about/, 2026-10-09).
- Disputes: "we welcome readers to flag issues so we can correct them quickly" (about page).
- Local or nearby: a Location filter by country or region; no map, no distance.
- FT labels: FT3 partial, FT5 partial, FT12 partial (rated brand directory, no sources per entry), FT13 partial (affiliate Amazon-alternatives article per the existing profile).

### A11. Fair Trade Federation brand directory (fairtradefederation.org)

- Owner and funding: Fair Trade Federation; legal status not stated on the pages read; $85 screening fee, dues "based on percentage of gross sales" (fairtradefederation.org/pages/verification, 2026-10-09).
- What it is: a "Handmade Brand Directory" of verified members shown as logos linking out, plus a static "Retail Locations" list (fairtradefederation.org/pages/brand-directory, 2026-10-09).
- Scope: North American members (US and Canada stores listed), producers in 76 countries.
- How members get in: application with references, financial statement, supplier list, review by an anonymous Screening Committee every one to two months.
- Evidence shown: membership only. Negatives: no. Disputes: not stated.
- Local or nearby: yes, partially: about 64 brick-and-mortar stores (60 US across 28 states, 4 Canada) listed by state with addresses; no map, no zip search (fairtradefederation.org/pages/retail-locations, 2026-10-09).
- Privacy: policy not read. Affiliates: none seen; listing requires paid membership. Open source: not stated.
- Last visible update: copyright 2026; impact report 2024-2025.
- FT labels: FT2 partial, FT11 partial.

### A12. 1% for the Planet directory (directories.onepercentfortheplanet.org)

- Owner and funding: 1% for the Planet, 501(c)(3); members commit 1% of revenue and pay annual dues on a sliding scale that count toward the 1%; annual certification with proof of revenue and donations (onepercentfortheplanet.org/faqs, 2026-10-09).
- What it is: a directory of member businesses and environmental partners, and a "network map" (FAQ). A plain fetch rendered only a page title (a JavaScript app; the /directory and /search-business-members pages returned 404). In a browser the directory has two tabs, "Impact Partners" and "Businesses"; the Businesses search takes "Name or topic", a Location field (placeholder "Headquarters", with a use-my-location button) and Industry; Impact Partners swaps Industry for "Impact Theme" (directories.onepercentfortheplanet.org, browser, 2026-10-09).
- Scope: global; 4,241 member businesses (visible text) or 4,424 (page metadata), both on the FAQ page.
- Evidence shown: membership only. A member profile shows membership type ("Whole Company Member"), "Certified" with a date, industry, headquarters city, website and "Supported Impact Partners" by name; no amounts given (directories.onepercentfortheplanet.org/profile/hetty-alice-brewing-company, browser, 2026-10-09). Negatives: no. Disputes: not stated. Removal: "Continued membership is contingent on completing this annual process".
- Local or nearby: a location search by headquarters city (a test city returned members headquartered there, in a list without distances) and an "Explore map" view on a Google map with member clusters; no distance ranking (directories.onepercentfortheplanet.org/?viewMode=map, browser, 2026-10-09).
- Privacy, open source: not read; the cookie banner says cookies are used "for analytics, personalization, and targeted advertising". Affiliates: none seen; listing requires paid membership.
- Browser check 2026-10-09: opened directories.onepercentfortheplanet.org (list, filter panel and map views) and one member profile. Corrected: the directory renders in a browser; filters are type, name or topic, headquarters location and industry or impact theme; the map exists. FT2 stays partial, now verified (location filter and map, no distance ranking).
- FT labels: FT2 partial, FT11 partial.

### A13. Ethical.net (ethical.net)

- Owner and funding: "a not-for-profit project" in London, operated by Digital Partnership for Regeneration and Reconnection MTÜ (an Estonian registry code); funding not stated; no affiliates visible (ethical.net/about/ and ethical.net, 2026-10-09).
- What it is: curated alternatives, mainly for tech products, plus guides including "Amazon Alternatives Guide: How (and Why) to Avoid Amazon" (2022 update, per search results; the guide page was not opened).
- Scope: UK-leaning; some US picks.
- How listings get in: not stated; community forum suggestions.
- Evidence shown: none ("These are some top notch options, we can't say much else!"). Negatives: no. Disputes: not stated. Local: none.
- Privacy: "We only use cookies to optimise site functionality and analytics."
- Open source: not stated. Last visible update: guides marked 2022 and 2023; footer 2025.
- FT labels: FT8 partial, FT11 partial, FT13 partial.

### A14. Buy Me Once (buymeonce.com)

- Owner and funding: founded 2016 by Tara Button; it is a store, "Supporting Our Store Funds Our Unique Research"; no affiliate statement found (buymeonce.com/pages/about-us and buymeonce.com, 2026-10-09).
- What it is: an online shop of long-lasting products, US storefront (ships to the 48 contiguous states) with a UK sister site (buymeonce.com/pages/faq, 2026-10-09).
- How products get in: team research of the product and "manufacturing story"; suppliers apply; criteria, labor and environmental standards not stated on the pages read (the "our research" page returned 404).
- Evidence shown: none per product. Negatives: no. Disputes: not stated. Local: none.
- Privacy: policy not read. Open source: not stated. Last visible update: copyright 2026.
- FT labels: FT1 partial (one shop's own catalog), FT6 partial (its own store; not a stated policy).

### A15. Grow Ensemble (growensemble.com)

- growensemble.com and growensemble.com/about/ both redirect (301) to coryames.com, a personal site about Texas that does not mention Grow Ensemble (coryames.com, 2026-10-09). Search results describe Grow Ensemble as an impact marketing and media company with a podcast and an "Ethical Alternatives to Amazon Printable Guide" (growensemble.com/?p=14524, not opened). No current directory could be found; status not stated anywhere read. Web Archive could not be fetched from this environment.
- FT labels: none verifiable.

### A16. Remake brand directory (remake.world)

- Owner and funding: 501(c)(3) nonprofit, donation funded; "Remake concluded operations in February 2026" and the site "serves as an archive" (remake.world/brand-directory/, 2026-10-09). directory.remake.world does not resolve.
- What it was: a brand directory scored out of 100 with a seal at 50+, and annual Fashion Accountability Reports scoring large brands out of 150 (search results citing fashionunited and foreignpress, 2026-10-09).
- FT labels: historical only; FT11 yes (no affiliates, nonprofit) but defunct.

### A17. Fashion Transparency Index (fashionrevolution.org)

- Owner and funding: Fashion Revolution; 2024 edition "partly funded by the European Climate Foundation"; "brands and retailers don't pay and cannot choose to be included" (fashionrevolution.org/fashion-transparency-index/, 2026-10-09).
- What it is: an annual transparency scoring of 250 large brands; "do not use this Index to inform your shopping choices".
- Evidence shown: scores, underlying data and sources published on WikiRate "under an open data license".
- Negatives shown: no; it measures disclosure, "does not measure sustainability or ethics".
- Disputes: not described. Local: none. Privacy: not read. Affiliates: none.
- Last visible update: 2023 global edition; regional editions 2024 and 2025.
- FT labels: FT3 yes (as a benchmark, not a shopping tool), FT9 partial (open data, not open source or cost), FT11 yes.

### A18. Leaping Bunny (leapingbunny.org)

- Owner and funding: operated by the American Anti-Vivisection Society for the Coalition for Consumer Information on Cosmetics; joining is free for US and Canada brands, optional logo license for "a nominal, one-time fee"; donations (leapingbunny.org and /frequently-asked-questions, 2026-10-09).
- What it is: a certified-brand list ("Companies A-Z", 2,348 brands), an app with a scanner, a "Where to Buy" page.
- Scope: US and Canada; cosmetics and household brands.
- How brands get in: pledge, supplier pledges, annual recommitment, openness to audits; non-recommitting brands are listed as such.
- Evidence shown: certification only. Negatives: no. Disputes: not stated.
- Local or nearby: "Where to Buy" names online stores (including Amazon) and chains (Target, Walmart, CVS, Whole Foods) and points to coopdirectory.org for local co-ops; no zip search or map (leapingbunny.org/shop-cruelty-free/where-buy, 2026-10-09).
- Privacy: no cookies or analytics named; "will not sell, trade, or recycle your e-mail address"; may share with CCIC member organizations; no policy date (leapingbunny.org/privacy-policy, 2026-10-09).
- Affiliates: none stated. Open source: not stated. Last visible update: 2025 recommitment list; copyright 2026.
- Sibling-scope note: app with barcode scanner.
- FT labels: FT8 partial, FT11 yes. FT6 no (Amazon and Whole Foods named as places to buy).

### A19. The Climate Label, formerly Climate Neutral Certified (changeclimate.org, explore.changeclimate.org)

- Owner and funding: Climate Neutral dba The Change Climate Project, 501(c)(3); fees not stated on the pages read (the "What it costs" page returned 404) (changeclimate.org, 2026-10-09).
- What it is: certification with a public "Explore certified products and companies" list sorted A to Z; no search box or category filter visible (explore.changeclimate.org, 2026-10-09).
- How brands get in: annual emissions measurement, reduction plan, "quantified funding for climate solutions"; paid.
- Evidence shown: certification only. Negatives: no. Disputes or revocation: not stated. Local: none. Privacy: not read.
- Affiliates: none; listing requires paid certification. Last visible update: "2025 standard"; copyright 2026.
- FT labels: FT11 partial.

### A20. KnowTheChain (knowthechain.org, served by business-humanrights.org)

- Owner and funding: "a partnership between the Business and Human Rights Resource Centre, Verité and Humanity United"; funding not stated (business-humanrights.org/en/from-us/knowthechain/, 2026-10-09).
- What it is: forced-labor benchmarks of companies in food and beverage, ICT, apparel and footwear, with a company search and scorecards; aimed at "companies and investors".
- Evidence shown: scores public; whether evidence and sources are published is not stated on the page read.
- Negatives shown: the benchmark scores practices; not consumer-facing findings. Disputes: a separate Company Response Mechanism exists at the Centre; not tied to the benchmark on the page read.
- Local, privacy, affiliates: none or not read. Last visible update: 2026 food and beverage benchmark.
- FT labels: FT3 partial, FT4 partial, FT11 partial (no affiliate page read; "none or not read" above).

### A21. Shop Ethical! (ethical.org.au), Australia

- Owner and funding: The Ethical Consumer Group; nonprofit status not stated; Patreon subscriptions, donations, app and book sales (ethical.org.au and /about/ratings, 2026-10-09).
- What it is: company assessments by product category, an app, a book.
- Scope: Australia.
- Evidence shown: weighted items ("Full criticism" -2, "Lesser criticism" -1, "Full praise" +2) summed to a grade A+ to F, parent companies included; 95 named sources in six groups; sources must be "Not older than five years"; no per-source dates shown (ethical.org.au/about/sources, 2026-10-09).
- Negatives shown: yes; "Any boycott call limits potential rating to F"; revenue above US$1 billion counts as a minor criticism.
- Disputes: "contact us with any comments or updates"; no formal process.
- Local: none. Privacy: not read. Affiliates: not stated. Open source: not stated.
- Last visible update: assessment updates referencing 2025 and June 2026 reports.
- Sibling-scope note: app with barcode scanner.
- FT labels: FT3 partial, FT4 partial (sourced, five-year rule, dates not shown per item), FT5 partial, FT7 partial (a size penalty, not a chain badge), FT11 partial, FT12 partial.

### A22. Fair Trade USA, Fair Trade Certified (fairtradecertified.org)

- Already profiled: `research/sites/fairtradecertified-org.md` (checked 2026-09-25): a 501(c)(3) certifier whose shopping page shows 87 brand tiles and whose featured links include amazon.com and Whole Foods Market. Nothing new read this run.
- FT labels: FT11 partial (no affiliates; certified brands pay); FT6 no.

### A23. Project Cece (projectcece.com)

- Owner and funding: Project Cece, founded 2016 (media quote); "We may earn a commission when you use one of our links to make a purchase" (projectcece.com, 2026-10-09).
- What it is: "Your fair fashion finder", a product search across 300+ brands and stores with filters by five labels (Eco-Friendly, Fair Trade, Good Cause, Produced in Europe, Vegan), certificates and materials. This is the only site in this scope with a typed product search that returns items from many shops; sibling scope may also claim it.
- Scope: a US country site exists; about 20 European countries, UK, Canada; fashion, home, beauty.
- How brands get in: must meet fair production (certifications such as GOTS, Fairtrade, WFTO, SA8000, Fair Wear Leader, or photos, visit proof and wage information for small workshops) and sustainable materials for at least 70% of the collection (projectcece.com/sustainability-standards/, 2026-10-09).
- Evidence shown: labels and certificates per product with a brand explanation; evidence files not published.
- Negatives shown: no. Disputes: "always ask us" via contact. Local: none. Privacy: not read. Open source: not stated.
- Last visible update: blog posts to 2026-09-23; footer 2023.
- FT labels: FT1 yes (fashion only), FT3 partial.

### A24. Made Trade (madetrade.com)

- The about page would not open (redirect loop at both www and bare domain, 2026-10-09); claims come from search-result excerpts of madetrade.com/pages/about and a Made Trade magazine post.
- What it is: a curated marketplace; "We verify and vet every product we carry to ensure it meets our core values of equity, sustainability, and transparency"; each product must meet "at least two of Made Trade's eight core values" (Fair Trade, Sustainable, USA Made, Heritage, Vegan, Women-Owned, POC-Owned, plus Handcrafted and Recycled per category pages); 135+ brands; the Fair Trade badge appears only with third-party certification or verification.
- Owner, funding, privacy, disputes: not opened. Affiliates: it sells the products itself.
- Browser check 2026-10-09: failed. https://www.madetrade.com/, https://madetrade.com/ and https://www.madetrade.com/collections/all each ended in ERR_TOO_MANY_REDIRECTS in a fresh browser session; the network log shows the server answering 301 with a Location header pointing to the same URL, repeated until the browser gave up. Store type, product search, values filters, per-product sourcing and affiliate status remain as above (search excerpts only).
- Operator check 2026-10-09: the operator's own browser also could not open the site and reported it as not supporting SSL. A probe the same day found the certificate valid (issued by Google Trust Services, verified by openssl) and every path, over http and https, with a plain or a browser user agent, answered 301 to its own URL by Cloudflare. So the symptom is a self-redirect loop at the edge, consistent with a block or a broken site, not a missing certificate. The site's current state is unknown; this profile rests on search excerpts and should be read as unverified.
- FT labels: FT1 partial (one marketplace), FT6 partial (own store; not a stated policy).

### A25. EcoHubMap (ecohubmap.com)

- Owner and funding: founder and web developer Natalia Goncharova; paid "featured in recommended companies" placement and "Packages" (the packages page returned 404) (ecohubmap.com/about, 2026-10-09).
- What it is: a self-submitted directory of "more than 13,000 companies, NGOs, and governmental agencies" with an interactive map ("Hot Spots") and filters "by category, location, and more".
- Scope: global ("200-plus countries"), a USA list exists.
- How businesses get in: self-submission forms; no review step described.
- Evidence shown: self-description. Negatives: no. Disputes: not stated.
- Local or nearby: map and location filter; distance ranking not stated.
- Privacy, open source: not read. Last visible update: copyright 2026.
- FT labels: FT2 partial. FT11 no (paid featuring).

### A26. The Good Shopping Guide (thegoodshoppingguide.com), UK

- Owner and funding: operator not named; accreditation "independently endorsed by the Ethical Company Organisation"; Ethical Accreditation "to support ethical companies' reputations and sales"; fees not stated (thegoodshoppingguide.com and /how-we-rate/, 2026-10-09).
- What it is: sector tables rating brands on Environment, Animals, People, Other; top, middle, bottom marks become a "GSG Score" percentage; green and red sections.
- Scope: UK sectors (building societies, energy suppliers).
- Evidence shown: scores; sources named in general (Greenpeace, Guardian, Human Rights Watch); not per brand.
- Negatives shown: yes; a bottom rating "indicates more than one serious criticism in the last five years"; parent-company records count.
- Disputes: not stated. Local: none. Privacy: no policy link found. Affiliates: not stated.
- Last visible update: political donation thresholds "updated in May 2026"; "Reporting the facts since 2001".
- FT labels: FT3 partial, FT4 partial, FT11 partial (paid accreditation logo for green-section brands).

### A27. Certified Humane, Who's Certified (certifiedhumane.org)

- Owner and funding: Humane Farm Animal Care, 501(c)(3); a fee schedule is linked; annual audits (certifiedhumane.org, 2026-10-09).
- What it is: a searchable list of certified companies and products; retailer house brands (Kirkland Signature, Trader Joe's) appear inside listings; "updated periodically and may not always reflect precise real-time information" (certifiedhumane.org/whos-certified/, 2026-10-09). The /where-to-buy/ page returned 404.
- Evidence shown: certification only. Negatives: no. Disputes: not stated. Local: none on the pages read. Privacy: not read.
- FT labels: FT11 partial.

### A28. EWG Skin Deep (ewg.org/skindeep), opened in a browser only

- Every ewg.org and oembed.ewg.org page tried returned HTTP 403 to plain fetches. From search-result excerpts of EWG's own pages (2026-10-09): a product and ingredient hazard database launched 2004, with a data-availability score; EWG is a 501(c)(3) funded about half by individual donations, about 30 percent by foundation grants, the rest including "licensing and consulting fees associated with our EWG VERIFIED program".
- What it is (browser, 2026-10-09): a product search ("Search for an ingredient, brand or product"; 155,108 products, 7,780 brands, 2,502 EWG Verified products on ewg.org/skindeep/). Results list products by brand with a score badge, filters for product type, brand, "Black-Owned Brands" and "EWG VERIFIED", and sorts "Best match", best to worst, worst to best, A to Z. For "shampoo" and "mineral sunscreen" the first 12 "Best match" results were all EWG VERIFIED products (ewg.org/skindeep/search/?search=..., 2026-10-09). Brands include "365 Whole Foods Market" (brand filter on the same search).
- How scores are explained: each product has a 1 to 10 hazard score "calculated using a weight-of-evidence approach", not an average, plus a data-availability rating (none, limited, fair, good, robust); concern levels for cancer, allergies and immunotoxicity, developmental and reproductive toxicity, and use restrictions; per-ingredient concerns; "DATA LAST UPDATED" month and year (product page for Head & Shoulders Advanced 2in1, ewg.org/skindeep/products/1054224-..., 2026-10-09). Scores draw on "nearly 60" toxicity and regulatory databases (skindeep home and /learn_more/about/, 2026-10-09; the excerpt's "more than 60" is not what the pages say now).
- Sources: each ingredient page lists every concern with a named reference body (for zinc pyrithione: EU Cosmetics Directive, Japan Ministry of Health, Environment Canada, EPA, European Chemicals Agency), as names, not links, and undated (ewg.org/skindeep/ingredients/707074-ZINC_PYRITHIONE/, 2026-10-09).
- Disputes or corrections: none found; the product page's "CONTACT SKIN DEEP" link points to ewg.org/support-our-work/ways-to-donate/stay-touch (not opened); the about page describes staff correcting parsed ingredient lists and contacting companies, with no public correction path (product page and /learn_more/about/, 2026-10-09).
- Affiliates: yes. The product page shows "WHERE TO BUY / BUY ON AMAZON" linking to amazon.com with an affiliate tag, and states "When you make a purchase through retailer links on our site, we may earn commission through affiliate programs" (product page, 2026-10-09). This confirms the 2012-era blog claim.
- Browser check 2026-10-09: opened ewg.org/skindeep/, two search result pages, one product page, one ingredient page and /learn_more/about/ (each in a fresh browser session; a second page load in the same session got a Cloudflare "verify you are human" check, which was not clicked). Corrected: Amazon affiliate links verified; "nearly 60" databases, not "more than 60"; sources are named per ingredient concern. FT1 changed from no to partial (typed product search returns products; the buy link goes to Amazon, not shops); FT4 changed from no to partial (named-source hazard concerns raise the score and the product carries a data date, but the concerns are mostly health hazards, only ecotoxicology fits FT4's labor, environment, governance scope, and the per-finding sources are undated); FT11 changed from partial to no (Amazon affiliate links on product pages). Count column updated for all three.
- FT labels: FT1 partial (product search, products not shops), FT3 partial (hazard and data scores with named sources per ingredient concern, no links), FT4 partial (see browser check). FT11 no (Amazon affiliate links).

Defunct, one line: GoodGuide (product health, environment and social scores) was bought by UL in 2012 and shut down 2020-06-01 (Wikipedia via search, 2026-10-09).

## B. Feature matrix

Columns are the profile numbers above. Sites with nothing verifiable (A4 DoneGood, A15 Grow Ensemble) and the dissolved A16 Remake are left out, so the counts reflect 25 live sites.

| Feature | A1 GOY | A2 EC | A3 BCorp | A5 GUU | A6 PS | A7 GA | A8 BWS | A9 Leaf | A10 SJ | A11 FTF | A12 1% | A13 Eth.net | A14 BMO | A17 FTI | A18 LB | A19 CL | A20 KTC | A21 ShopEth | A22 FTUSA | A23 Cece | A24 MT | A25 EHM | A26 GSG | A27 CH | A28 EWG | Count yes / partial (of 25 live) |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| FT1 product search to shops | no | no | no | no | no | no | no | partial | no | no | no | no | partial | no | no | no | no | no | no | yes | partial | no | no | no | partial | 1 yes / 4 partial |
| FT2 nearby shops, distance, map | no | no | partial | no | no | partial | no | no | no | partial | partial | no | no | no | no | no | no | no | no | no | no | partial | no | no | no | 0 yes / 5 partial |
| FT3 explained with values and source link | partial | partial | partial | partial | no | no | partial | partial | partial | no | no | no | no | yes | no | no | partial | partial | no | partial | no | no | partial | no | partial | 1 yes / 12 partial |
| FT4 sourced, dated negatives that down-rank | partial | yes | no | partial | partial | no | no | partial | no | no | no | no | no | no | no | no | partial | partial | no | no | no | no | partial | no | partial | 1 yes / 8 partial |
| FT5 dispute link on every finding and badge | no | partial | partial | partial | no | partial | no | no | partial | no | no | no | no | no | no | no | no | partial | no | no | no | no | no | no | no | 0 yes / 6 partial |
| FT6 Amazon never appears | no | partial | no | no | no | no | no | no | no | no | no | no | partial | no | no | no | no | no | no | no | partial | no | no | no | no | 0 yes / 3 partial |
| FT7 chain vs independent badge | no | no | no | no | no | no | no | no | no | no | no | no | no | no | no | no | no | partial | no | no | no | no | no | no | no | 0 yes / 1 partial |
| FT8 privacy as stated | no | no | no | no | no | no | partial | no | no | no | no | partial | no | no | partial | no | no | no | no | no | no | no | no | no | no | 0 yes / 3 partial |
| FT9 cost transparency, open source | no | no | no | no | no | no | no | no | no | no | no | no | no | partial | no | no | no | no | no | no | no | no | no | no | no | 0 yes / 1 partial |
| FT10 published quality numbers | no | no | no | no | no | no | no | no | no | no | no | no | no | no | no | no | no | no | no | no | no | no | no | no | no | 0 yes / 0 partial |
| FT11 no affiliates, no sponsored placement | no | partial | partial | partial | no | partial | partial | no | no | partial | partial | partial | no | yes | yes | partial | partial | partial | partial | no | no | no | partial | partial | no | 2 yes / 14 partial |
| FT12 curated directory with sources and dispute state | no | partial | no | no | no | no | no | no | partial | no | no | no | no | no | no | no | no | partial | no | no | no | no | no | no | no | 0 yes / 3 partial |
| FT13 alternatives to Amazon-owned brands | partial | yes | no | partial | no | partial | no | no | partial | no | no | partial | no | no | no | no | no | no | no | no | no | no | no | no | no | 1 yes / 5 partial |
| FT14 honest degradation at budget | no | no | no | no | no | no | no | no | no | no | no | no | no | no | no | no | no | no | no | no | no | no | no | no | no | 0 yes / 0 partial |

Cell notes that matter: FT4 "yes" for Ethical Consumer is with full stories behind a paywall. FT3 "yes" for the Fashion Transparency Index is a benchmark that tells readers not to shop by it. FT11 "yes" cells are nonprofits or benchmarks with no shop links at all; the "partial" cells are mostly certifiers whose listed companies pay to be listed, which is not an affiliate link but is a financial tie the brief's FT11 should weigh. FT1 "yes" for Project Cece is fashion only and affiliate funded.

## C. Observations

C1. Nobody in this scope has: FT7 (chain vs independent badge; Shop Ethical!'s revenue penalty is the only size signal), FT8 as a whole (every site read either runs Google Analytics or ad tracking, offers accounts, or has no policy; none publishes a "what is kept" table), FT9 (no site states what a lookup costs or publishes a cost ledger; none says it is open source; the Fashion Transparency Index publishes open data, not open code), FT10 (no site publishes a measured accuracy figure for its own ratings), FT14 (no site describes what happens when its budget runs out). Combined FT2 with FT3 (nearby shops with explained scores) exists nowhere: the sites with any location feature (B Corp, Green America, FTF, 1%, EcoHubMap) show certification, B Corp's impact scores without sources, or self-description.

C2. Common: FT11-style independence claims (16 of 25 at least partial; EWG dropped to no after the browser check found Amazon affiliate links), usually as "nonprofit" or "we don't take money for scores" rather than "no affiliate links"; FT3 partial (12 of 25) as a score with a rationale but without per-claim sources or dates. Brand lists dominate; only Project Cece, Buy Me Once, Made Trade and EWG Skin Deep return products; Buy Me Once and Made Trade are single stores, and EWG sends buyers to Amazon.

C3. Closest to nottheriver, and how:
- Ethical Consumer (A2): the only site with sourced, dated, down-ranking negatives, a five-year decay rule, a company challenge path, and an explicit "alternatives to Amazon" series. Gaps against nottheriver: UK guides, subscriber paywall on the evidence, tracked purchase links, analytics, no local, no per-finding dispute link, Amazon is rated rather than excluded.
- Shop Ethical! (A21): the same shape (weighted praise and criticism, listed sources, five-year freshness, parent-company inheritance, a size penalty) for Australia; no per-item dates, no local, funding by subscriptions and sales.
- Good On You (A1): the largest brand-rating directory with sub-scores and dated "last updated" stamps, but no per-claim sources, no dispute path, and an affiliate network on the same pages as the ratings.
Also near on single features: Project Cece on FT1 (typed product search across shops, fashion only, affiliate funded); Fair Trade Federation on FT2 (a hand-kept list of 60 US fair trade stores by state, which is the kind of curated local table the feasibility overview proposes, without the map or distance).

C4. Funding models seen and what they imply:
- Affiliate commission and discount codes (Good On You, LeafScore, Sustainable Jungle, Project Cece, Ethical Consumer's purchase links, EWG Skin Deep's "BUY ON AMAZON" links): the rated brand is also the revenue source; none of these publishes how that is kept apart from the rating. This is the gap FT11 names and the existing `research/brief.md` dark-pattern rubric already penalizes.
- Paid certification or membership with a directory as a benefit (B Corp, Green America, FTF, 1%, Climate Label, Certified Humane, Fair Trade USA, Good Shopping Guide's accreditation): the directory is complete for payers only and shows no negatives; inclusion is itself a paid placement even without affiliate links. nottheriver's use of these as positive signals (certifications in `docs/ranking.md`) inherits that bias, which the down-ranking side offsets.
- Subscription and donations (Ethical Consumer, Shop Ethical!, Goods Unite Us Premium): the evidence sits behind the paywall, which is the opposite of FT3.
- Grants and nonprofit benchmarks (Fashion Transparency Index, KnowTheChain, Remake): open or public data, but aimed at investors and brands, not shoppers, and Remake concluded operations in February 2026 (reason not stated), so the directory is now an archive rather than a degraded service.
- Self-submission with paid featuring (EcoHubMap): scale without vetting.
Implication for FT14: every model above either has a revenue source that scales with use (affiliates, dues) or shuts down when funding ends; none publishes a per-query cost or a spending cap, so an honest "budget spent" state would be new in this scope.

C5. Limits of this pass: bcorporation.net, ewg.org and madetrade.com blocked plain fetches, and the 1% directory is a JavaScript app. A browser check on 2026-10-09 opened B Corp, EWG Skin Deep, the 1% directory and the Green Business Network directory (the brief's "Green Pages"); each profile has a "Browser check 2026-10-09" line, and four cells changed (EWG FT1, FT4, FT11; Green America FT2). madetrade.com still failed in the browser (the server redirects to the same URL), so A24 rests on search excerpts.

## D. Sources

All read 2026-10-09 unless marked. "Not opened" entries list the HTTP result or reason.

Repo files read: `research/index.json`, `research/sites/donegood-co.md`, `research/sites/greenamerica-org.md`, `research/sites/sustainablejungle-com.md`, `research/sites/fairtradecertified-org.md`, `research/sites/thegoodtrade-com.md`, `research/brief.md` (dark patterns and retailer rating sections), `about.html`, `docs/STATUS.md`, `docs/feasibility-overview.md`.

Opened:
- https://partnerships.goodonyou.eco/how-we-rate (redirect target of goodonyou.eco/how-we-rate/)
- https://partnerships.goodonyou.eco/about (redirect target of goodonyou.eco/about/)
- https://goodonyou.eco/
- https://goodonyou.eco/privacy-policy/
- https://directory.goodonyou.eco/brand/patagonia
- https://www.ethicalconsumer.org/about-us
- https://www.ethicalconsumer.org/about-us/our-ethical-ratings
- https://www.ethicalconsumer.org/company-profiles
- https://www.ethicalconsumer.org/company-profile/amazoncom-inc
- https://www.ethicalconsumer.org/node/4408 (FAQs about our data and ratings for companies, dated 2018-06-01)
- https://www.ethicalconsumer.org/privacy-policy
- https://www.ethicalconsumer.org/retailers/shopping-guide/ethical-online-retailers
- https://www.goodsuniteus.com/
- https://www.goodsuniteus.com/why-goods/
- https://www.goodsuniteus.com/privacy-policy/
- https://progressiveshopper.com/
- https://progressiveshopper.com/how-it-works/
- https://progressiveshopper.com/privacy
- https://progressiveshopper.com/politics/
- https://www.greenbusinessnetwork.org/directory (redirect target of greenpages.org)
- https://www.greenbusinessnetwork.org/certification
- https://www.greenbusinessnetwork.org/about
- https://greenamerica.org/privacy-and-policy
- https://betterworldshopper.org/
- https://betterworldshopper.org/about/
- https://betterworldshopper.org/the-research/
- https://www.leafscore.com/about-us/
- https://www.leafscore.com/methodology/
- https://www.leafscore.com/affiliate-disclosure/
- https://www.sustainablejungle.com/about/
- https://www.sustainablejungle.com/brand-directory/
- https://www.fairtradefederation.org/
- https://fairtradefederation.org/pages/brand-directory
- https://fairtradefederation.org/pages/verification
- https://fairtradefederation.org/pages/our-mission
- https://fairtradefederation.org/pages/retail-locations
- https://www.onepercentfortheplanet.org/faqs
- https://directories.onepercentfortheplanet.org/ (title only; JavaScript app; superseded by the browser check below)
- https://directories.onepercentfortheplanet.org/businesses (title only)
- https://ethical.net/
- https://ethical.net/about/
- https://buymeonce.com/
- https://buymeonce.com/pages/about-us
- https://buymeonce.com/pages/faq
- https://www.coryames.com/ (redirect target of growensemble.com and growensemble.com/about/)
- https://remake.world/brand-directory/
- https://www.fashionrevolution.org/fashion-transparency-index/
- https://www.leapingbunny.org/
- https://www.leapingbunny.org/frequently-asked-questions
- https://www.leapingbunny.org/shop-cruelty-free/where-buy
- https://www.leapingbunny.org/privacy-policy
- https://www.changeclimate.org/ (redirect target of climateneutral.org)
- https://explore.changeclimate.org/
- https://www.business-humanrights.org/en/from-us/knowthechain/ (redirect target of knowthechain.org/about/)
- https://www.ethical.org.au/
- https://ethical.org.au/about/ratings
- https://ethical.org.au/about/sources
- https://www.projectcece.com/
- https://www.projectcece.com/sustainability-standards/
- https://www.ecohubmap.com/about
- https://thegoodshoppingguide.com/
- https://thegoodshoppingguide.com/how-we-rate/
- https://certifiedhumane.org/
- https://certifiedhumane.org/whos-certified/

Not opened:
- https://www.bcorporation.net/en-us/find-a-b-corp/ (HTTP 403; opened in the browser check, below)
- https://www.bcorporation.net/en-us/faqs/ (HTTP 403)
- https://www.bcorporation.net/en-us/standards/complaints/ (HTTP 403; opened in the browser check, below)
- https://bcorporation.net/en-us/faqs/are-there-b-corps-my-area/ (HTTP 403)
- https://www.bcorporation.net/en-us/find-a-b-corp/company/patagonia-inc/ (HTTP 403; opened in the browser check, below)
- https://www.bcorporation.net/en-us/movement/about-b-lab/ (HTTP 403)
- https://www.goodsuniteus.com/about, /faq, /faqs/ (HTTP 404)
- https://progressiveshopper.com/about (HTTP 404)
- https://www.greenamerica.org/green-business-network/about and /certification (HTTP 403; the greenbusinessnetwork.org equivalents opened)
- https://www.leafscore.com/leafscore-methodology/ and /brand-directory/ (HTTP 404)
- https://www.fairtradefederation.org/about-us/ (HTTP 404)
- https://www.onepercentfortheplanet.org/directory and /search-business-members (HTTP 404)
- https://growensemble.com/ and /about/ (301 to coryames.com); https://growensemble.com/?p=14524 (not attempted)
- https://web.archive.org/web/2024/https://growensemble.com/ (archive fetches are blocked in this environment)
- https://buymeonce.com/pages/our-research (HTTP 404)
- https://directory.remake.world/ (DNS failure)
- https://shop.donegood.co/ (DNS failure)
- https://www.leapingbunny.org/about-us (HTTP 404; homepage and FAQ opened instead)
- https://www.changeclimate.org/what-it-costs (HTTP 404)
- https://www.ethical.org.au/about-us/ (HTTP 404; homepage opened instead)
- https://www.projectcece.com/about/ (redirect loop)
- https://www.madetrade.com/, /pages/about and https://madetrade.com/pages/about (redirect loop; the browser check also failed on https://www.madetrade.com/, https://madetrade.com/ and /collections/all: 301 to the same URL)
- https://www.ecohubmap.com/packages (HTTP 404)
- https://thegoodshoppingguide.com/about-us/ (HTTP 404; homepage opened instead)
- https://certifiedhumane.org/where-to-buy/ (HTTP 404)
- https://www.ewg.org/skindeep/contents/about-page/, https://ewg.org/skindeep/contents/faq, https://oembed.ewg.org/skindeep/contents/faq (HTTP 403; not retried in the browser; the pages in the browser check list were used instead)

Browser check, 2026-10-09 (Chrome, a fresh isolated session per page, no sign-in, no forms submitted, cookie banners closed or left alone):
- https://www.bcorporation.net/en-us/find-a-b-corp/ (filters opened; a country filter and a keyword search run)
- https://www.bcorporation.net/en-us/find-a-b-corp/company/patagonia-inc/
- https://www.bcorporation.net/en-us/standards/complaints/
- https://www.bcorporation.net/en-us/privacy-policy/ (last updated 24 August 2026)
- https://www.ewg.org/skindeep/
- https://www.ewg.org/skindeep/search/?search=mineral+sunscreen and ?search=shampoo
- https://www.ewg.org/skindeep/products/1054224-Head__Shoulders_Advanced_2in1_Smooth__Silky_Dandruff_Shampoo__Conditioner/ (data last updated May 2024)
- https://www.ewg.org/skindeep/ingredients/707074-ZINC_PYRITHIONE/
- https://www.ewg.org/skindeep/learn_more/about/
- https://directories.onepercentfortheplanet.org/ (filter panel, list and map views)
- https://directories.onepercentfortheplanet.org/profile/hetty-alice-brewing-company
- https://www.greenbusinessnetwork.org/directory (keyword, location, industry and ownership controls)
- https://www.madetrade.com/, https://madetrade.com/, https://www.madetrade.com/collections/all (failed: ERR_TOO_MANY_REDIRECTS)

Search-result excerpts used where a page would not open (13 WebSearch calls in total, all 2026-10-09): bcorporation.net/complaints and the B Corp FAQ (complaint scope, keyword and location search); bcorporation.uk and bcorporation.eu pricing pages (fee structure by revenue); apify.com B Corp directory scraper description (directory filters, marked unverified; superseded by the browser check); madetrade.com/pages/about and a Made Trade magazine post (vetting and values); ewg.org FAQ and funding pages (Skin Deep method, revenue mix); fashionunited.com and foreignpress.org (Remake scoring scales); channel3000.com and xconomy (Goods Unite Us score logic, not used in the profile beyond the FEC mention); en.wikipedia.org/wiki/GoodGuide (shutdown date); ethical.net Amazon guide title and 2022 update; growensemble.com PDF title.
