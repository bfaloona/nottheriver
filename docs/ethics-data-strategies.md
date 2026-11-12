# Keeping ethics in the product: strategies for a one-person site

Status: research and proposals, 2026-11-11. Nothing here is built or tested with people. The owner decides (section 9).

Why this exists: a review on 2026-11-11 ([value-proposition-review.md](value-proposition-review.md), decision VQ3, the headline rewrite) proposed dropping "ranked by how they treat people and the planet" from the headline because 87% to 93% of results carried the default scores. The owner's answer: not now. Treat it as a data problem and keep ethics in the product; without it the site is a map search. This report asks what a one-person site can do to make ethical ratings easy to find and use during a product search.

Written 2026-11-11 by an evaluation agent (Fable) from the nine research files in [evidence/ethics-data/](evidence/ethics-data/) plus `docs/ranking.md`, `data/README.md`, `data/negative-sources.md`, `src/render.ts`, `src/controls.ts` and `docs/wireframes/README.md`. No web request was made for this report itself; the research files made them. Outside facts carry the URL and "read 2026-11-11" from the file that read them. "Measured" names its file; "estimate" and "my judgment" are labeled. Nothing here is legal advice.

## 1. Answer

- **It is a data problem for national chains, half of one for brands and online shops, and for small local shops the data does not exist yet.** Grades and regulator records exist for chains; a few certifications exist for brands; almost nothing exists for a small shop, so loading cannot help there. For small shops ethics has to come from the product itself (what to look for, who owns the shop, an honest "not checked") or from data the site gathers, as in ES11a (sourced tips, checked by the owner) and ES11b (the shop's own words, unverified) (sections 3 to 5).
- **For chains the data exists; grades and positive lists need permission, and regulator records need upkeep and a size-bias decision (ED6).** Toxic-Free Future grades cover 398 saved results (18%, measured), but its pages say "All Rights Reserved" and grant no reuse, so the owner should ask before showing a grade. Federal records read as public domain but take about 1.5 h a chain to check (estimate).
- **Today's 11% is mostly penalties.** 166 of the 235 rated results are three chains with a regulator finding; only 69 results (3.2%) on five websites are raised by a certification (measured, `shop-domains.tsv`).
- **A one-person site can add ethics to most searches with little new shop data:** say "not checked" on the row (no new data), link to those who grade the shop (a hand list), state who owns it (a hand list for the 77 most-seen websites), and, where a card exists for the product type, tell the shopper what to look for. Both brainstorms proposed these four.
- **What will not work:** copying any rater's scores in bulk (Good On You and Ethical Consumer bar it; Good Shopping Guide allows only short attributed quotes, as read), bulk-loading the registries checked (no B Corp bulk file now; Fair Trade, FSC and NCG (National Co+op Grocers) terms bar copying; B Corp and 1% for the Planet terms not read), and any shop-level rating of small local shops from existing data.
- **Headline: a partial disagreement.** About 89% of results sit at the default ethics and environment scores (measured), and no step here changes that for most shops, so ED1 (which headline, and when) recommends HW1 ("ranked in part by what is known...") now; it keeps ethics in the line. HW6 (today's line plus "Most shops are not rated yet") is closest to the owner's "not now".

## 2. How the research was done

| Phase | Who (model) | Task | Output |
|---|---|---|---|
| P1 | Three Sonnet agents | Read the owner's seed sites: three raters, three scorecards, EPA's green power lists, plus a survey of who else grades retailers | `p1-raters.md`, `p1-scorecards.md`, `p1-epa-and-survey.md` |
| P2 | Lead agent | Turn P1 into the rubric; build the coverage yardstick from saved searches | `rubric.md`, `shop-domains.tsv` |
| P3 | Two Sonnet agents | Dataset hunts: public records; certifications and small shops | `p3-datasets-*.md` |
| P3 | Opus agent; Fable agent | Two brainstorms, blind to each other; the Opus one also tested the owner's premise | `p3-strategies-opus.md`, `p3-strategies-fable.md` |
| P4 | Fable agent | Read all of the above, re-scored the strategies against the dataset findings, wrote this report | this file |
| P5 | Lead agent, then a fresh reviewer (Opus) | Checked figures against `shop-domains.tsv`; review record in section 12 | this file |

- **Starting points, named by the owner:** seven sites (Good Shopping Guide, Ethical Consumer, Good On You, Toxic-Free Future's Retailer Report Card, Climate Friendly Supermarkets, the Environmental Investigation Agency's "Dirty Dozen" of 2013, EPA's Green Power Partnership) and one web search, "retail store ethical ranking", which became the survey of 15 other graders in `p1-epa-and-survey.md`.
- **Approach the seed sites suggested (the rubric):** their finished scores cannot be copied, but their method and the public records and registries they draw on can. So every source is described by ten fields (F1 to F10: entity, join, topic and direction, coverage, evidence strength, reuse rights, form, upkeep, meaning of absence, risk of harm) and every strategy is judged by six tests: coverage, reuse rights, upkeep, honesty when data is missing, shopper use, risk.
- **What could not be read:** the Dirty Dozen PDF (expired certificate); the B Corp directory and its terms (HTTP 403, refused); the data portal of DOL (US Department of Labor), empty to the fetch tool; Violation Tracker's terms (403); most script-driven member directories. Section 10 lists all of them. Most pages were read through a summarizing fetch tool, so quotes are as that tool returned them.

## 3. What the seed sites and the dataset hunts found

Coverage is against the top 99 websites (the top 100 in `shop-domains.tsv` minus `facebook.com`; 1,093 of 2,182 results) unless a row says otherwise. "h" figures are the hunting agents' estimates.

### Sources worth using

| Source | Entity graded | Feeds, direction | Coverage of saved results | Reuse rights as read | Form | Upkeep (estimate) |
|---|---|---|---|---|---|---|
| DOL Wage and Hour compliance actions | One workplace address | Ethics, lowers | Estimate 25 to 35 of 99 websites; not tested | Data.gov license field is the US public domain label (https://catalog.data.gov/dataset/wage-and-hour-division-compliance-action-data, read 2026-11-11) | CSV, quarterly; bulk path not opened | 16 h first, 10 h a year |
| OSHA inspections | One workplace address | Ethics, lowers | 9 of 50 rated retailers had a qualifying citation on an earlier branch (measured there); about 18 of 99 by that rate (estimate) | DOL says federal materials are generally public domain (https://www.dol.gov/general/aboutdol/copyright); the Data.gov entry says license "Not stated" (https://catalog.data.gov/dataset/dol-enforcement-data-inspection); both read 2026-11-11 | API needs a key and returns HTTP 429 (too many requests) after about 8 calls | 20 h first, 12 h a year |
| FTC cases | Company | Ethics, lowers | Estimate 3 to 8 of 99; 2 already in `data/negatives.json` | Most site material is a US government work in the public domain, per https://www.ftc.gov/policy-notices/website-policy (read 2026-11-11) | Web list, no download | 10 h first, 8 h a year |
| Wikidata | Company, parent | No score; finds the parent | Item for 39 of 99 (measured); parent filled for 6, owner for 7 | CC0, a public-domain dedication (https://www.wikidata.org/wiki/Wikidata:Licensing, read 2026-11-11) | Query service, no key | 8 h first, 4 h a year |
| Certification registries, looked up by hand (B Corp, Climate Label, 1% for the Planet, Fair Trade, worker co-op directory) | Company or brand | Ethics or environment, raises | Today 5 websites, 69 results (measured). New in the top 100: Alter Eco (Climate Label, confirmed; B Corp, unconfirmed) and Lake Champlain Chocolates (B Corp, unconfirmed) | Varies: Fair Trade USA bars copying (https://www.fairtradecertified.org/terms-of-use/), Climate Label says only "All rights reserved", the worker co-op directory states nothing, B Corp and 1% for the Planet terms were not read (all read 2026-11-11). One lookup with a link is what the site does now; the owner should confirm that stays acceptable | Web pages | 1 to 2 h a year each |
| DOL Form 5500 filings (the annual report an employee benefit plan files with DOL), with the list of the 150 largest employee-owned companies from NCEO (National Center for Employee Ownership) as a cross-check | Company | Ethics, raises (a new kind: employee-owned) | 1 website (Scheels, 6 results) | DOL files are free downloads (https://www.dol.gov/agencies/ebsa/about-ebsa/our-activities/public-disclosure/foia/form-5500-datasets); NCEO allows quotes up to 100 words (https://www.nceo.org/policy-use-nceo-content); both read 2026-11-11 | Zip files; whether a field marks employee ownership plans is unconfirmed | 8 h first, 3 h a year |
| OpenStreetMap shop tags | One shop | Badge only: chain or not, secondhand | 6 of 8 tested shops found by name; 1 carried an ethics-related tag | ODbL (Open Database License, share-alike; https://www.openstreetmap.org/copyright, read 2026-11-11) | API or bulk | 10 h first, 3 h a year |
| Enforcement records in ECHO (EPA's Enforcement and Compliance History Online) | Regulated facility | Environment, lowers | Estimate 20 to 30 of 99; one maker (Lodge) measured | No license text on the pages read (https://echo.epa.gov/resources/echo-data/about-the-data, read 2026-11-11); EPA's general line is non-commercial use | Weekly bulk files | 20 h first, 12 h a year. Name search returned a town for "Patagonia Inc"; use only with a hand-checked match |
| NLRB (National Labor Relations Board) case export | Employer | Ethics, lowers | Estimate 10 to 15 of 99; not tested | Not stated (https://www.nlrb.gov/open, read 2026-11-11) | CSV export | 12 h first, 10 h a year. A charge alone is an allegation |
| Scorecards as link targets (Toxic-Free Future 2024, Climate Friendly Supermarkets 2026, ASPCA 2024, Greenpeace tuna 2026) | Chain | Link only, no score | Toxic-Free Future: 398 results on 13 websites; Climate Friendly Supermarkets: 136 on 4 (measured, see below) | No reuse granted: Toxic-Free Future says "All Rights Reserved" (https://toxicfreefuture.org/privacy-policy-and-legal-information/, read 2026-11-11); Climate Friendly Supermarkets states no terms (https://www.climatefriendlysupermarkets.org/scorecard, read 2026-11-11). A link copies no grade; the owner should check that linking is acceptable | Web pages, PDF | 5 to 6 h a year (Fable 5, Opus 6) |

Scorecard reach, recomputed from `shop-domains.tsv`:

| Match rule | Toxic-Free Future | Climate Friendly Supermarkets |
|---|---|---|
| Names in `data/chains.json` (the Fable brainstorm's figure, confirmed) | 398 results, 13 websites | 136 results, 4 websites |
| Any graded name (adds IKEA, TJX's own website, Dollar Tree, Apple, ALDI) | 425, 18 | 138, 5 |
| Plus parent ties (HomeGoods and Marshalls to TJX, Sam's Club to Walmart, Safeway to Albertsons) | 463, 22 | 151, 7 |

Three more ties from the reviewer's knowledge, not the hunts (HomeSense and Sierra to TJX, Nordstrom Rack to Nordstrom) raise Toxic-Free Future to 471 results on 25 websites. jewelosco.com may be an Albertsons banner; unconfirmed.

The Opus brainstorm's 456 is a different measure: any source the first-phase readers covered (P1), top 60 websites only.

### Sources that need permission

| Source | Who to ask | For what | Results it would touch |
|---|---|---|---|
| Toxic-Free Future report card ("All Rights Reserved", https://toxicfreefuture.org/privacy-policy-and-legal-information/, read 2026-11-11) | Toxic-Free Future | Showing the letter grade with credit and year | 398 to 463 (measured), or 471 with all ties |
| Climate Friendly Supermarkets (no terms on any page read, https://www.climatefriendlysupermarkets.org/scorecard, read 2026-11-11) | Environmental Investigation Agency | Showing the percent score | 136 to 151 (measured) |
| Science Based Targets list (rights reserved; non-commercial use allowed with credit) | info@sciencebasedtargets.org, named in its terms (https://sciencebasedtargets.org/about-us/website-terms-of-use, read 2026-11-11) | Showing "validated climate target" as an environment mark | 336 on 14 websites (my count from the hunt's name list) |
| EPA partner lists: SmartWay (EPA freight-efficiency partners), GreenChill (EPA supermarket-refrigerant partners), Green Power | EPA program contact | Whether the site's use fits "non-commercial, scientific and educational" (https://www.epa.gov/web-policies-and-procedures/epa-disclaimers, read 2026-11-11); see ED5 (the non-commercial question) | SmartWay 235 on 7 websites (my count); Green Power at 100%: REI only |
| National Co+op Grocers store list (terms bar copying without written permission, https://www.ncg.coop/terms-use, read 2026-11-11) | NCG | Using the list for a consumer co-op badge | 4 (Sevananda) |
| Green America certified businesses (https://greenbusinessnetwork.org/certification, read 2026-11-11; terms not read) | Green America | Directory terms and a list | 0 seen; directory did not load |
| B Corp directory | B Lab | A bulk list now that the data.world copy is retired | Not measured |
| Good On You; Good Shopping Guide; Ethical Consumer | Each rater | Good On You: API price and retailer ratings. Good Shopping Guide: its FAQ invites republishing, its terms bar it. Ethical Consumer asks for "clear, costed financial incentives" | Not measured; mostly UK brands or fashion |
| Violation Tracker | Good Jobs First | What a subscription allows to be republished | Not measured (403) |

### Dead ends

| Source | Why |
|---|---|
| Any rater's finished scores, copied | Each one's terms bar bulk copying as read 2026-11-11: Good Shopping Guide (https://thegoodshoppingguide.com/app/uploads/2026/09/2026-GSG-Site-Users-TCs-2.pdf, clause 6.3), Ethical Consumer (https://www.ethicalconsumer.org/content-usage), Good On You (https://goodonyou.eco/terms-conditions/) |
| CDP scores | Internal, non-commercial use only without written consent (https://www.cdp.net/en/data/scores, read 2026-11-11) |
| B Corp bulk data on data.world | Retired 2026-07-13 (https://data.world/blab/b-corp-impact-data, read 2026-11-11) |
| Fair Trade USA, Fairtrade America, FSC, California Green Business Network lists | Terms bar copying, bulk download or scraping as read 2026-11-11 (https://www.fairtradecertified.org/terms-of-use/ ; https://www.fairtrade.net/us-en/terms-of-use.html ; https://search.fsc.org/disclaimer/ ; https://greenbusinessca.org/terms-of-use/) |
| EPA Green Power 100% list as a score | 1 of 41 chains; newest list dated October 2024; self-reported (https://www.epa.gov/system/files/documents/2025-01/partner100_oct2024.pdf, read 2026-11-11) |
| CPSC recalls as a score input | The owner already ruled a recall with no penalty is not a finding; the retailer named is usually only the seller |
| Fair Trade Federation store list | 0 of 66 stores match the 619 saved websites (measured, with a control; https://fairtradefederation.org/pages/retail-locations, read 2026-11-11) |
| Open Supply Hub; OpenCorporates; EEOC employer data | Factories, not shops (https://info.opensupplyhub.org/terms-of-service); terms bar automated extraction (https://opencorporates.com/terms-of-use-2/); confidential by employer. Read 2026-11-11 |
| NCEO's employee-ownership database | $1,200; site text capped at 100 words (https://www.nceo.org/policy-use-nceo-content, read 2026-11-11) |
| A national union-shop list | None found |
| Overture Maps for chain or ownership | No such field; brand link on 0 of 82 shops in an earlier site check |
| Dirty Dozen (2013) and scorecards last issued 2018 to 2021 | Unreadable or stale |

## 4. Is it a data problem?

The three files classified sellers by hand and disagree at the edges (Scheels, McCoy's and Sports Basement land in different kinds). The split below uses one rule that can be recomputed: the chain tag in `shop-domains.tsv` crossed with its local and online columns. Its limits: six untagged chains hold 61 results (Bass Pro, Camping World, IKEA, Sam's Club, McCoy's, tjx.com; the Opus file's point, confirmed), and `facebook.com` holds 23 results for shops with no website. The Opus file's estimate (28%, 37%, 34%) lands within two or three points of it.

| Kind | Saved results (measured) | Rated today (measured) | Data that exists | Verdict (my judgment, agreeing with the Opus premise test) |
|---|---|---|---|---|
| National chains | 561 (26%) on the 33 tagged websites that appear; 622 (29%) with the six untagged | 217 of 561: 166 lowered (Walmart, Home Depot, Dollar General), 51 raised (REI) | Narrow-topic grades on 398 results; regulator records for most; Science Based Targets on 14 websites, 6 of them tagged chains | **A data problem, and solvable in part.** The limits are permission, one-topic grades, and records that only lower |
| Brands and online shops selling direct | 848 (39%) online results on untagged websites | 18 results on 4 websites, across this row and the next | Certifications for those that applied; new in the top 100: Alter Eco (Climate Label, confirmed; B Corp, unconfirmed) and Lake Champlain Chocolates (B Corp, unconfirmed). Wikidata has an item for 7 of 62 brands | **Partly, by an amount no one has measured.** Neither the Opus file's "10 to 25% reachable" nor a lower figure has a test behind it: the B Corp directory returned 403, the 1% for the Planet directory did not load, and Climate Label was tried for three names. The first-month hand check in ES8 (certifications checked by hand) settles it |
| Small local shops | 773 (35%) local results on untagged websites | (see above) | Shop type and chain status from open map data; 11 hardware-dealer websites outside the chain list (36 results, my count by name; acehardware.com's 24 sit in the chain row); memberships of a few dozen to a few hundred shops nationwide | **Not a problem that loading existing data solves.** No record exists to load; it would have to be gathered. A missing regulator record means "never inspected" |

Two more measured facts bear on this:

- 508 websites outside the top 100 and not tagged as chains hold 1,020 results (47%). The Fable file's claim that data alone cannot reach about half the results is confirmed as arithmetic.
- The rubric gives the 41 chains in `data/chains.json` 561 results; 33 of the 41 appear in saved searches.

## 5. Strategies

Thirteen strategies, labeled ES1 to ES12, with ES11 split into ES11a and ES11b. Nine of them were proposed by both brainstorms (marked "both"). Both worked from the same rubric and first-phase (P1) notes, so agreement shows the ideas follow from that brief; none is tested. Shopper use and risk ratings are judgments, the brainstorms' or mine; none is tested. S labels are the Opus brainstorm's strategies and ST labels the Fable brainstorm's.

### (a) No new data needed

**ES1 (a record line on every shop).** From S1 (Opus: say plainly what is not known) and ST1 (Fable: a record line on every row); both. Today a shop with nothing on file shows nothing on its row, and "Nothing found" sits inside the closed "Why this rank" panel (`src/render.ts`, `whyText`).

| | |
|---|---|
| Shopper sees | Under each name, "People and planet:" then certifications, or "1 concern, 2022", or "Not checked: we hold no record for this shop". Above the list: "2 of 13 shops have a record." |
| Data needed | None; the search answer already carries it |
| Coverage | 0% moved; 100% labeled. About 1,947 saved results (89%) would read "not checked" (measured) |
| Reuse rights | Nothing reused |
| Upkeep | Opus 6 to 10 h to build; Fable 8 to 12 h (estimates); 0 a year |
| Honesty when missing | Its purpose. "Not checked" must read as neither fine nor bad |
| Shopper use | Says where the rank rests on a record and where it does not |
| Risk | Low. Small shops carry "not checked" most; the count line softens it |
| First-month check | Re-render saved answers and count rows per state; show five people both rows and ask what each means |

**ES2 (put first what you care about).** From ST2 (Fable: put first what you care about). A sort control (score, distance, name) and a "Has certification" filter already exist (`src/controls.ts`), so this adds options, not a new control.

| | |
|---|---|
| Shopper sees | "Put first: best overall, shops with a good mark (2), fewest concerns, closest"; with ES7 (who owns it), "independent and co-op shops (5)" |
| Data needed | None |
| Coverage | 0% moved |
| Reuse rights | Nothing reused |
| Upkeep | 6 to 10 h (Fable estimate); 0 a year |
| Honesty when missing | "Good mark (0)" tells the shopper the choice changes nothing |
| Shopper use | Weak until ownership badges or more certifications give it something to sort: today it could separate 69 of 2,182 results |
| Risk | Low |
| First-month check | On saved answers, count how often each choice changes the top 3 |

**ES3 (links to check a shop yourself).** From ST5 (Fable: check it yourself).

| | |
|---|---|
| Shopper sees | In "Why this rank": "Look this shop up: OSHA inspections, Violation Tracker, B Corp directory" |
| Data needed | URL patterns only, none of them confirmed (OSHA returned 405 (request type not allowed), B Corp and Violation Tracker 403 to the agents) |
| Coverage | 0% moved; useful mostly for chains and brands |
| Reuse rights | Links copy nothing; the owner should check each site's terms on links that carry a search term |
| Upkeep | 6 h; 2 h a year (estimate) |
| Honesty when missing | Turns "not checked" into "here is where to check" |
| Shopper use | Low to medium (my judgment): effort in the middle of a purchase |
| Risk | **Medium (my judgment).** ST5 (Fable: check it yourself) warned a name search can show a different business; the hunt confirmed it: its EPA ECHO name search returned an Arizona town for "Patagonia Inc" and 840 records for "Ace Hardware". Leave ECHO out; offer a link only where the owner has seen it land on the right business |
| First-month check | The owner opens each pattern for 20 shops and records how often the first screen is the right business |

**ES4 (opt-in search for certified sellers).** From S9 (Opus: opt-in certified-seller search).

| | |
|---|---|
| Shopper sees | A checkbox: "Look harder for certified sellers (one extra search)" |
| Data needed | None new |
| Coverage | Unmeasured; "a few points" is the Opus file's guess |
| Reuse rights | None needed |
| Upkeep | 6 h plus a test run; about $0.005 a search when ticked (list price, `docs/costs.md` per the brainstorm) |
| Honesty when missing | Unchanged |
| Shopper use | Medium |
| Risk | Medium: pulls in pages that only claim to be green. Today's maximum is 5 Brave search calls and the client allows 6; ES4 and ES5 (used and repair options first) together need 7, so one must replace a call or the cap must rise |
| First-month check | Compare on saved searches: share of results with a certification, and how many are real shops |

**ES5 (used and repair options first).** From S8 (Opus: secondhand, rental and repair badge) and ST8 (Fable: before you buy new); both.

| | |
|---|---|
| Shopper sees | For durable goods, "Used or repaired, near you": up to 3 places, then the usual lists |
| Data needed | One more place search. No open US repair directory was found; OpenStreetMap tags about 9,000 secondhand and charity shops. S8 (Opus: secondhand, rental and repair badge) also proposed a "Secondhand" badge from the model's reading of each listing, unscored and labeled "Model judgment"; it needs ED13 (whether a model-read stock fact may appear as a badge) |
| Coverage | 0% moved. 28 saved results (1.3%) are resale today (the Fable file's count, not recomputed) |
| Reuse rights | Search results, as today |
| Upkeep | 12 to 16 h; about $0.005 more a search (estimate) |
| Honesty when missing | "No used or repair option found nearby" is a real answer |
| Shopper use | High for the searches it fits (both brainstorms' judgment) |
| Risk | A wrong "sells used" tag, low harm; exclude goods where used is bad advice (helmets, car seats). Today's maximum is 5 Brave search calls and the client allows 6; ES4 (opt-in search for certified sellers) and ES5 together need 7, so one must replace a call or the cap must rise |
| First-month check | Run the extra query offline for the 20 graded searches and hand-grade each place |

### (b) Data a single person can gather now (terms to confirm per source)

**ES6 (what to look for, by product type).** From S2 (Opus: what-to-look-for panel) and ST3 (Fable: what to look for); both.

| | |
|---|---|
| Shopper sees | A box above the results: labels checked by a third party, a question to ask the shop, what makes it last; each line linked |
| Data needed | Hand-written cards keyed to a fixed list of product types. The model returns a free-text category today (`proxy/schemas/normalize.json`) and would pick from the list instead |
| Coverage | 0% of shops moved; share of searches with a card: not measured |
| Reuse rights | The site's own words plus links. EPA's ecolabel table (the Fable file's main source) did not load, so its fit to cookware, tents or toys is unknown. EPA says a listing "is not an endorsement" and states non-commercial reuse; the owner should check that naming a listed label is acceptable |
| Upkeep | Opus 15 to 25 h for 40 types; Fable about 2 h a card, 40 h for 20; 10 h a year (estimates) |
| Honesty when missing | "No guide yet for this product type" |
| Shopper use | High (both brainstorms): the only ethics help that works in a shop the site cannot rate |
| Risk | No statement about a shop. A wrong line about a label; each line needs a source and a check date |
| First-month check | Write cards for the product types in the 20 graded searches; a second reader marks each line sourced and useful, or not |

**ES7 (who owns it).** From S4 (Opus: parent company and its record), S7 (Opus: ownership facts for local shops) and ST4 (Fable: who owns it); both.

| | |
|---|---|
| Shopper sees | A neutral badge: "National chain, 2,300 stores", "Dealer-owned", "Brand selling direct", "Consumer co-op", "Employee-owned", "Ownership not checked"; "Owned by TJX" where known |
| Data needed | `data/chains.json` extended by hand to the top 99 websites (the top 100 minus `facebook.com`). **Re-scored:** Wikidata fills the parent for only 6 of 99, so it is an aid, not the source. OpenStreetMap can suggest "chain" (brand tag on a third of US shops) but found 6 of 8 shops by name. The second half of S4 (Opus: parent company and its record), carrying a parent's record into the score at the existing 0.5 "related" weight, is ED12 (whether a parent's record counts for its banners) |
| Coverage | Stated on 561 results (26%) today; 1,093 (50%) with the top 99 labeled (77 websites; `facebook.com` rows are many shops; measured) |
| Reuse rights | Own list; Wikidata CC0; OpenStreetMap is share-alike; see ED8 (the share-alike license question) |
| Upkeep | 26 to 30 h; 10 h a year (estimate) |
| Honesty when missing | "Ownership not checked" is its own badge; never "independent" by default, since `facebook.com` rows and small regional chains would pass |
| Shopper use | Medium to high (both brainstorms' judgment, untested) |
| Risk | Calling a dealer-owned store a chain; 12 Ace, True Value and Do it Best websites (60 results) need the dealer wording. Implies small is good |
| First-month check | Label the 77; count per kind and how many could not be settled in 20 minutes |

**ES8 (certifications checked by hand).** From S6 (Opus: certification registry sweep) and ST9 (Fable: load whole registries); both. **Re-scored: the bulk load both brainstorms hoped for is not available** (B Corp bulk data retired; Fair Trade, FSC and NCG terms bar copying). What remains is the method the site uses now.

| | |
|---|---|
| Shopper sees | Today's badges on more rows |
| Data needed | One lookup per website in each registry, confirmed by the owner. An offline model pass may list what each shop claims, to say where to look; its text is never shown |
| Coverage | Today 69 results (3.2%). The hunt's tests found 12 more results from certifications (about half a point): Alter Eco (Climate Label, confirmed; B Corp, unconfirmed) and Lake Champlain Chocolates (B Corp, unconfirmed). Ownership kinds that ED7 (whether ownership facts score) keeps unscored add 10 badges (Scheels, Sevananda). A full check of the 77 has not been run |
| Reuse rights | The owner should confirm a hand lookup with a link fits each registry's terms; B Corp's terms page was not read |
| Upkeep | 15 to 25 h for the top 200 (Opus) or 20 to 30 h (Fable); 10 h a year (estimates) |
| Honesty when missing | Uncertified stays "not checked", never "bad" |
| Shopper use | Medium; these are the marks shoppers know |
| Risk | Wrong match by name; lapsed certifications. Employee-owned and consumer co-op would be new kinds; see ED7 (whether ownership facts score) |
| First-month check | Look up the 77 non-chain websites in the top 99 in the B Corp directory by hand; count hits and results touched |

### (c) Needs someone's permission or sustained work

**ES9 (a dated public-record check for chains).** From S5 (Opus: public-records sweep) and ST6 (Fable: dated public-record check); both, and both independently warned of the same bias: only big firms have records, so chains can only lose rank. The main sources read as public domain, but it sits in this group for its upkeep, the highest of the thirteen.

| | |
|---|---|
| Shopper sees | "Checked Oct 2026 against OSHA, DOL and FTC records: none found", or "2 concerns, 2022 to 2024", with what was searched |
| Data needed | Regulator records under the site's existing rules. **Re-scored:** recalls cannot count (the owner's earlier ruling), so the Opus file's brand coverage from recalls is void; its "60 to 90% of chain results get a finding" is unmeasured. Chain results are concentrated (the top 10 chains hold 395 of 561, 70%), and four curated findings on three chains already reach 166 (30%), so a high share is possible. The only measured per-source rate, OSHA's 9 of 50, counts retailers, not results |
| Coverage | 344 chain results (16%) with no record today move to a dated state; 217 have one (measured). Small shops: 0 |
| Reuse rights | DOL and FTC read as public domain; OSHA's license field is "Not stated"; ECHO and NLRB state nothing. The owner should confirm per source |
| Upkeep | Opus 25 to 40 h to start for about 45 companies, 15 h a year. Fable about 1.5 h a chain: 15 h for 10, about 50 h for the 33 chains that appear in saved searches (its 60 h was for all 41), 30 h a year for the full set. Estimates, resting on a bulk path no agent opened |
| Honesty when missing | Three states kept apart: not checked; checked, none found; concerns |
| Shopper use | Medium: says what went wrong at the shops seen most |
| Risk | **Highest.** A misattributed finding is a false statement about a named business; dealer-owned stores are not the banner. Run it display-only (shown on the page, not counted in the score) first; see ED6 (size bias). Both brainstorms advise getting advice on the wording of findings and of "checked, none found" before any is shown; the owner should do so before the pilot |
| First-month check | Check the 10 chains with the most results; time it; count how often a chain would drop below an unchecked shop |

**ES10 (graded by others).** From S3 (Opus: rated-elsewhere links) and ST7 (Fable: graded by others); both. A link-only version needs no data load; showing a grade needs written permission.

| | |
|---|---|
| Shopper sees | On a chain's row: "Graded on chemicals in products by Toxic-Free Future, 2024: see the grade". Shown only when the product type matches the grade's topic. With permission: the grade |
| Data needed | A hand list of who grades whom, with page URLs. Good On You bars bots, so by hand |
| Coverage | 0% moved (kept out of the score). 398 to 463 results (18% to 21%), or 471 with all ties, are on graded websites; fewer once limited to matching product types (not measured). Fashion brands via Good On You: not measured |
| Reuse rights | The owner should check that stating a grade exists and linking is acceptable, and ask both publishers |
| Upkeep | 10 h; 5 to 6 h a year (Fable 5, Opus 6; estimates) |
| Honesty when missing | No link means "not graded by a group we know of" |
| Shopper use | Medium to high: one click from the search to a real rating |
| Risk | These are advocacy grades in which silence scores low, on one topic each; neither publisher's domain is on the accepted list in `data/negative-sources.md` |
| First-month check | Email both publishers; verify links on the 13 websites |

**ES11a (sourced tips, checked by the owner).** From S10 (Opus: evidence inbox, variant A) and the "shoppers' sourced tips" in ST10 (Fable: a page per shop); both. A "Know a source about this shop?" link in "Why this rank". A shopper or the shop submits a registry page or a record on an accepted-source domain; the owner checks it before it shows, and it then counts under today's rules.

| | |
|---|---|
| Shopper sees | In "Why this rank": "Know a source about this shop?" and "Is this your shop?". A tip the owner has checked shows as today's certification badge or finding line |
| Data needed | Submissions, each checked by the owner against the registry or an accepted source (`data/negative-sources.md`). The Fable file sends them through the GitHub issue path |
| Coverage | Near 0% at first. The Opus file calls it the only strategy that can reach local shops at scale, if shops come |
| Reuse rights | The submitter's own words and a link; the form needs terms (the owner should check) |
| Upkeep | 6 h to start (Opus estimate); review load open-ended, not estimated |
| Honesty when missing | Unchanged (the Opus file's rating) |
| Shopper use | Indirect |
| Risk | Medium (my judgment; the Opus file's "high" was for the unverified variant, ES11b). Spam; favors shops that know to write in; a GitHub account is needed to submit. It keeps the rule in `docs/ranking.md` that a shop's page is not evidence about itself |
| First-month check | With the 10-shop invite in ES11b (the shop's own words): count submissions in a month and the share the owner could verify |

**ES11b (the shop's own words).** From variant B of S10 (Opus: evidence inbox) and ST10 (Fable: a page per shop); both.

| | |
|---|---|
| Shopper sees | A linkable record page per shop; a section "In the shop's own words (not verified, not scored)" |
| Data needed | Submissions. The hunt found no outside source that takes proof and allows reuse; the site's own dispute template is the closest thing |
| Coverage | Near 0% at first; with ES11a (sourced tips, checked by the owner), the only route to most small shops |
| Reuse rights | The shop's own words; the form needs terms |
| Upkeep | 16 h (Fable estimate; the Opus file's 6 h is under ES11a); about 30 minutes a submission, open-ended |
| Honesty when missing | "This shop has not answered" |
| Shopper use | Indirect |
| Risk | High if scored or shown without the label: `docs/ranking.md` says a shop's page is not evidence about itself. Impersonation; a GitHub account is needed to submit |
| First-month check | Invite 10 small shops; count replies in a month |

**ES12 (positive lists loaded with permission).** From the bulk half of ST9 (Fable: load whole registries) plus the dataset hunts.

| | |
|---|---|
| Shopper sees | New environment marks such as "Validated climate target (SBTi)" or "EPA SmartWay partner" |
| Data needed | Science Based Targets list (weekly spreadsheet); EPA SmartWay and GreenChill tables; NCG co-op list |
| Coverage | Science Based Targets: 336 results (15%) on 14 websites; SmartWay 235 (11%) on 7; all chains or large brands (my counts) |
| Reuse rights | Each needs a yes: section 3's permission table and ED5 (the non-commercial question) |
| Upkeep | 4 to 6 h a list after permission; 3 to 4 h a year each (estimate) |
| Honesty when missing | Absence means "no target" or "not a partner"; most small shops cannot qualify |
| Shopper use | Low to medium: raises chains that already rank |
| Risk | Name collisions ("Macy" matched two pharmacies); "commitment removed" must never read as a negative |
| First-month check | Send the requests; record what each reply allows |

## 6. Comparison table

Start-up hours are estimates. The rating is my judgment.

| Strategy | Coverage | Reuse rights | Upkeep a year | Honest when missing | Shopper use | Risk | Start-up hours | My rating |
|---|---|---|---|---|---|---|---|---|
| ES1 (a record line on every shop) | 100% labeled, 0 moved | Nothing reused | 0 | Best | High | Low | 6 to 10 (Opus) or 8 to 12 (Fable) | Do first |
| ES2 (put first what you care about) | 0 moved | Nothing reused | 0 | Good | Low until ownership is shown | Low | 6 to 10 (Fable) | After the ownership badge |
| ES3 (links to check a shop yourself) | 0 moved | Check link terms | 2 h | Good | Low to medium | Medium | 6 | Do small, tested links only |
| ES4 (opt-in search for certified sellers) | Unmeasured | Search results, as today | Search cost | Unchanged | Medium | Medium | 6 plus a test | Wait for a test |
| ES5 (used and repair options first) | Unmeasured | Search results, as today | Search cost | Good | High where it fits | Low | 12 to 16 | Do, after an offline test |
| ES6 (what to look for, by product type) | Searches, not shops | Own words plus links; check EPA label naming | 10 h | Good | High | Low | 15 to 25 for 40 types (Opus) or 40 for 20 cards (Fable) | Do second |
| ES7 (who owns it) | 26% to 50% get a fact | Own list; OpenStreetMap to check | 10 h | Good | Medium to high | Low to medium | 26 to 30 | Do second |
| ES8 (certifications checked by hand) | About +0.5 point seen so far | Check per registry | 10 h | Good with the record line | Medium | Low | 15 to 25 for the top 200 (Opus) or 20 to 30 (Fable) | Do, expect little |
| ES9 (a dated public-record check for chains) | 16% to a dated state | DOL and FTC read as public domain; OSHA, ECHO and NLRB state nothing; check per source | 15 h (Opus) or 30 h (Fable) | Good with the record line | Medium | High | 15 for 10 chains (Fable rate); 25 to 40 for about 45 companies (Opus) | Pilot, display-only |
| ES10 (graded by others) | 18% to 21% on graded websites; fewer once limited by product type | Link: check; grade: permission | 5 to 6 h | Good | Medium to high | Medium | 10 | Do links; ask for grades |
| ES11a (sourced tips, checked by the owner) | Near 0 at first | Submitter's words and a link; form needs terms | Open-ended, not estimated | Unchanged | Indirect | Medium | 6 (Opus) | Pilot alongside step 3, if the owner chooses |
| ES11b (the shop's own words) | Near 0 at first | Own words | Open-ended | Good | Indirect | High if scored | 16 (Fable) | Not now |
| ES12 (positive lists loaded with permission) | 11% to 15%, chains | Permission needed | 3 to 4 h a list | Fair | Low to medium | Medium | 4 to 6 a list | Ask now, build on a yes |

## 7. A sequence for one person

Hours are estimates taken from section 6; step 2 omits the work noted.

| Step | Build | Hours | Useful alone because | Must be true before the next step |
|---|---|---|---|---|
| 1 | ES1 (a record line on every shop); ES3 (links to check a shop yourself) for tested links only; send the permission emails, per ED4 (which permissions to ask for) | 15 to 20 | Every row says what the site holds, and the headline can be made true | Five people read "not checked" as neutral; the owner has opened each link pattern |
| 2 | A fixed product-type list and the model change to pick from it (the proxy Worker first, then the site); ES6 (what to look for, by product type), 10 cards; ES7 (who owns it) for the top 99; ES2 (put first what you care about) | 52 to 60, plus the list and model change (not estimated) | Every search with a card gives ethics help, even where no shop is rated; half of results state ownership | The model picks from the list reliably on the 20 graded searches; the 77 websites are labeled |
| 3 | ES8 (certifications checked by hand); ES10 (graded by others), links, shown by product type and so dependent on step 2's product-type list; ES5 (used and repair options first) after its offline test. Pilot alongside, if the owner chooses under ED10 (sourced tips and a shop's own answers): ES11a (sourced tips, checked by the owner) with ten invited small shops | 40 to 50, plus 6 for the sourced-tips pilot, ES11a (Opus estimate; review load not estimated) | More rows carry a mark or a link to a grade. The sourced-tips pilot (ES11a) is the only step that gathers new data about small local shops | The hand check's hit rate is known; publishers have replied or been chased |
| 4 | ES9 (a dated public-record check for chains), 10 chains, display-only; ES12 (positive lists loaded with permission) and grades under ES10 (graded by others) as replies allow | 30 to 50; upkeep for everything built is then about 45 to 85 h a year (37 fixed, plus the record check, ES9, and the permission lists, ES12, by scope; estimates) | The shops seen most carry a dated record | ED6 (size bias) decided from the pilot's numbers before any new finding changes a score |

ES4 (opt-in search for certified sellers) and ES11b (the shop's own words) sit outside the sequence until a test or a reason appears. ES11a (sourced tips, checked by the owner) is the pilot alongside step 3.

## 8. Headline wording

Today (`index.html:25`): "Find who sells it near you or online, ranked by how they treat people and the planet, never Amazon." Both brainstorms judged "ranked by" untrue at 11%, and no step above makes it true for most shops. Options that keep ethics in the line; the owner chooses.

| Label | True when | Wording |
|---|---|---|
| HW1 | Today, no build (my judgment: the order does use what is known) | "Find who sells it near you or online, never Amazon, ranked in part by what is known about how each shop treats people and the planet." |
| HW2 | Step 1 | "Find who sells it near you or online, never Amazon. For every shop we show what we know about how it treats people and the planet, and say so when we have not checked." |
| HW3 | Step 2 | "Find who sells it near you or online, never Amazon, with help choosing well: what to look for, who owns the shop, and what is on its record." |
| HW4 | Steps 3 and 4 | "Find who sells it near you or online, never Amazon, with help choosing well: what to look for, who owns the shop, which certifications it holds, and who else has graded it." |
| HW5 | Only if ED6 (size bias) ends with checked records changing scores | "Find who sells it near you or online, never Amazon. Shops with a checked record on people and the planet are ranked by it; the rest are marked not checked." |
| HW6 | Not true: a stopgap that leaves "ranked by" in place | Keep today's line and add under it: "Most shops are not rated yet. Here is what we check." |

## 9. Decisions for the owner

| Label | Decision | Recommendation (my judgment) |
|---|---|---|
| ED1 | Which headline, and when | HW1 (the "ranked in part by what is known" line) now, since it needs no build; HW2 (the "we show what we know, and say so when we have not checked" line) when step 1 ships |
| ED2 | The words for a shop with no record | "Not checked", with the count line above the list; settle it by asking five people, since no user research exists |
| ED3 | Should the ranking weights change while most shops are unrated | **No change to the weights; change the line that describes them.** Computed from `docs/ranking.md`: one certification moves a score by 0.25 × 0.30 = 0.075, the same as about 12 miles of distance (0.075 ÷ 0.15 × 25 miles) and less than the step from "maybe sells it" to "likely sells it" (0.125). For the 89% at the default, ethics and environment (0.60 of the weight) add the same 0.30 to every score, so order is set by match and distance. So the formula already behaves as "match and distance, adjusted where a record exists"; say that above the results. Revisit after ED6 (size bias) is decided |
| ED4 | Which permissions to ask for | In step 1: Toxic-Free Future, the Environmental Investigation Agency, Science Based Targets, EPA. Later: NCG, Green America, B Lab. Not worth the cost now: Good On You, Ethical Consumer, Good Shopping Guide (UK-weighted, paid or barred) |
| ED5 | Does the site's use count as non-commercial | Unresolved, and not mine to settle. It gates the EPA lists, Science Based Targets and the Good Shopping Guide's personal-use clause; CDP stays out either way (internal use only). `data/README.md` relies on the federal-works basis (17 U.S.C. 105) for Census and USDA files, while `p1-epa-and-survey.md` read EPA's own "non-commercial, scientific and educational" line; the owner should check which governs EPA partner lists, describe the site (who pays, any income) to each source in writing, and keep the reply |
| ED6 | Size bias before the records check affects scores | Run ES9 (a dated public-record check for chains) display-only on 10 chains, count how often a chain would fall below an unchecked shop, then decide whether to revisit the no-size-factor choice in `docs/decisions/0006-weighted-findings.md` |
| ED7 | Do ownership facts score | Badge only. Add "consumer co-op" and "employee-owned" as unscored kinds; worker co-op stays scored as today |
| ED8 | OpenStreetMap's share-alike license | Check before loading: a published file built from it may have to carry the same license. Until then use it to suggest, with the owner confirming on the shop's own page |
| ED9 | May advocacy scorecards appear at all | As links labeled "graded by", never in the score. Neither `toxicfreefuture.org` nor the scorecard's domain is on the accepted list in `data/negative-sources.md`; whether an advocacy scorecard belongs there is the owner's call |
| ED10 | Sourced tips and a shop's own answers | ES11a (sourced tips, checked by the owner) can pilot with the 10-shop invite from the first-month check of ES11b (the shop's own words), since it keeps today's evidence rule; ES11b (unverified answers) waits until after step 3. The owner decides whether to pilot |
| ED11 | An extra paid search for ES5 (used and repair options first) | Only for durable product types, after the offline test |
| ED12 | Should a parent's curated findings and certifications count for its banners at the 0.5 "related" weight | Decide with ED6 (size bias): it lowers chains' banners more often than it raises them (my judgment). Opus estimate: about 5% of all results gain data |
| ED13 | May a model-read stock fact ("sells used") appear as a badge | The owner rules whether it fits the rule that a shop's page is not evidence about itself |

## 10. Pages the owner needs to open

Ordered by which step each one gates.

| Step | Page | What to look for |
|---|---|---|
| 1 | OSHA establishment search, https://violationtracker.goodjobsfirst.org/, B Corp directory, https://directory.goodonyou.eco/brand/<name>, https://thegoodshoppingguide.com/brand-directory/<name>/ (both patterns seen only in search results) | Whether a link carrying a shop name lands on that shop (for the check-it-yourself links) |
| 1 | https://violationtracker.goodjobsfirst.org/plans and /pages/user-guide | Price; what may be republished; parent coverage |
| 2 | https://www.epa.gov/greenerproducts/recommendations-specifications-standards-and-ecolabels-federal-purchasing | Whether its rows cover consumer goods the site sees |
| 3 | https://www.bcorporation.net/en-us/find-a-b-corp/ and /en-us/terms-and-conditions/ | Terms; confirm Alter Eco and Lake Champlain Chocolates |
| 3 | https://directories.onepercentfortheplanet.org/ ; https://explore.changeclimate.org/ ; https://partner.fairtradecertified.org/ | Member counts, terms, whether retailers appear |
| 3 | https://greenbusinessnetwork.org/directory ; https://search.greenbusinessca.org/ | Listings, counts, share that are shops |
| 3 | https://certifiedeo.com/companies and /terms-of-service ; https://livingwageforus.org/living-wage-employers/ | Directory size, reuse, share that are shops |
| 3 | DOL Form 5500 layout files, newest year | Whether a code marks employee ownership plans |
| 3 | https://www.ncg.coop/ | Ask permission to use the co-op list |
| 3 | https://www.indiebound.org/indie-store-finder ; https://www.narts.org/find-a-narts-member-store ; https://nbda.com/dealer-finder-member-directory/ | Test a known bookshop, thrift shop and bike shop; terms; whether public |
| 3 | Toxic-Free Future's scoring rubric PDF, linked from https://toxicfreefuture.org/retailer-report-card/2024/methodology/ | Sub-criterion points |
| 3 | https://directory.goodonyou.eco/ (search REI or Target) ; https://resources.goodonyou.eco/help/multi-collection ; https://resources.goodonyou.eco/help/good-on-you-ratings-api | Whether any retailer rating is public; API fields and price |
| 3 | https://thegoodshoppingguide.com/supermarkets/ ; https://www.ethicalconsumer.org/subscriptions ; https://www.ethicalconsumer.org/company-profile/etsy-inc | Scores and benchmark; price and data license; what a free reader sees |
| 4 | https://dataportal.dol.gov/ and https://data.dol.gov/ | Whether a no-key CSV of wage and OSHA cases exists; file URLs; license |
| 4 | https://www.dol.gov/general/aboutdol/copyright | Confirm the public-domain sentences |
| 4 | https://www.nlrb.gov/advanced-search | Whether the export has employer address; robots rules |
| 4 | CPSC site, search "Civil and Criminal Penalties" | The civil-penalty list |
| 4 | https://www.epa.gov/greenchill/greenchill-certified-stores-historical-data (2023 file) ; Safer Choice spreadsheet on Envirofacts | Columns; overlap with the top 99 |
| 4 | https://www.epa.gov/greenpower/green-power-partnership-100-green-power-users | Whether the live table matches the October 2024 PDF |
| 4 | https://www.sec.gov/files/company_tickers.json | Download once with the owner's own client details |
| 4 | https://dol.ny.gov/wage-theft-dashboard | Fields, size, terms |
| Low value | https://wikirate.org/Wikirate_Terms_of_Use and /Licensing | Which license applies |
| Low value | https://organic.ams.usda.gov/integrity/ and /integrity/Reports/DataHub.aspx ; https://www.ams.usda.gov/rules-regulations/organic/organic-integrity-database | Downloads, terms, whether retailers appear |
| Low value | https://www.fairlabor.org/members/all-members/ ; https://certifiedhumane.org/whos-certified/ ; https://global-standards.org/suppliers/certified-suppliers ; https://www.bluesign.com/system-partners | Counts and terms (makers, not shops) |
| Low value | https://sam.gov/content/entity-information ; Google Maps Platform terms ; https://support.google.com/business/answer/9049526 | Scraping and caching terms; owner-attribute rules |
| Low value | https://www.hrc.org/cei/search ; https://foe.org/retailer-report-card/ ; https://progressivegrocer.com/4-big-food-retailers-score-lowest-plastic-pollution-scorecard ; https://chainstoreage.com/operations/list-details-worlds-most-ethical-companies-15-retailers-make-cut | Whether results are free and which retailers; whether an edition newer than 2018 to 2021 exists |
| Low value | https://content.eia-global.org/assets/2013/10/The_Dirty_Dozen.pdf | Chain list and grades (2013) |

## 11. What is unverified

| Claim in this report | Why it is unverified |
|---|---|
| Every hour figure | One agent's estimate each; none timed. Those for the public-record check rest on a bulk download no agent opened |
| The share of brand and online results reachable by certifications | No one has measured it. Neither the Opus file's "10 to 25%" nor a lower figure has a test behind it: the B Corp directory returned 403, the 1% for the Planet directory did not load, and Climate Label was tried for three names. Seen so far: Alter Eco (Climate Label, confirmed; B Corp, unconfirmed) and Lake Champlain Chocolates (B Corp, unconfirmed); no full check of the 77 websites |
| The Opus file's "60 to 90% of chain results get a finding" | Unmeasured. The concentration of chain results makes a high share possible; no agent ran the check |
| About 5% of all results gain data if a parent's record counts for its banners (ED12) | The Opus file's estimate; not tested |
| Coverage for DOL wage cases, OSHA, ECHO, NLRB, FTC | Estimates; only the OSHA rate (9 of 50) was measured, on an earlier branch and a different retailer set |
| Science Based Targets 336 results and SmartWay 235 | My sums over the hunt's name lists; the name matches (ITO EN, Patagonia Works, parent ties) are that agent's |
| The 463 and 151 scorecard figures | Depend on parent ties (Safeway to Albertsons, Sam's Club to Walmart, TJX banners) taken from agents' own knowledge |
| The 471 results on 25 websites for Toxic-Free Future | Adds three parent ties (HomeSense and Sierra to TJX, Nordstrom Rack to Nordstrom) from the reviewer's own knowledge, not the hunts or the files |
| jewelosco.com as an Albertsons banner | Unconfirmed; the saved shop name is "Jewel Fresh Food Center" |
| The share of results on graded websites whose product type matches the grade's topic | Not measured; it needs the product-type list |
| 28 resale results (1.3%) | The Fable file's count; I did not reclassify |
| 12 hardware-banner websites, 60 results (11 websites and 36 results outside the chain list) | My reading of shop names in `shop-domains.tsv`, not a dealer list |
| The three-kinds split | A proxy (chain tag by local or online), not a classification; brands with stores and small shops that sell online fall on the wrong side |
| Lake Champlain Chocolates is a B Corp; Food Depot is employee-owned | Search-result leads; pages not read |
| DOL Form 5500 can identify employee-owned companies | Layout files not read |
| All reuse-rights readings | Read through a summarizing tool on 2026-11-11, often as clipped quotes; several terms pages not read at all (B Corp, 1% for the Planet, Green America, Violation Tracker). None is a legal conclusion |
| That linking to a grade, or a link carrying a shop's name, is acceptable | Not checked against any site's terms |
| "Not checked" reads as neutral; shoppers want ownership stated; shoppers will consider used goods | No user research exists in the repo or the files |
| The model can pick from a fixed product-type list reliably | Not tested |
| The share of searches whose product type has a "what to look for" card | Not measured |
| Hours for the fixed product-type list and the model change in step 2 | Not estimated by any agent |
| Review load for ES11a (sourced tips, checked by the owner) | Open-ended; not estimated |
| EPA's ecolabel table fits consumer product types | Rows did not load |
| Toxic-Free Future has no edition newer than 2024 | One search by one agent |
| Shopper use and risk ratings in section 5 | Judgments, the brainstorms' or the evaluation agent's; none is tested |
| Ratings in section 6 and all recommendations in section 9 | The evaluation agent's judgment |

## 12. Review record

A fresh reviewer (Opus) checked this report on 2026-11-11 and made no web request. All of its findings are applied above.

- Recomputed every measured figure from `shop-domains.tsv`; all matched.
- Checked 32 outside facts against the evidence files; all were found.
- Raised 27 findings: 2 wrong, 11 misleading, 7 missing, 7 wording.

The six findings that changed what the report says to do:

| Finding | What it found | What changed |
|---|---|---|
| RV1 (small-shop data route dropped) | The merge kept only a shop's unverified answers and lost the owner-checked tips, the one way to gather new data on small local shops | ES11 is split: ES11a (sourced tips, checked by the owner) is a pilot alongside step 3; ES11b (the shop's own words) still waits |
| RV2 (what blocks chain data) | The answer said permission was the blocker for chains | Section 1 now says the data exists: grades and positive lists need permission, regulator records need upkeep and a size-bias decision |
| RV3 (reach of a records check) | The Opus file's "60 to 90% of chain results get a finding" was called unsupported by comparing unlike measures | It is now called unmeasured and possible, since the top 10 chains hold 70% of chain results |
| RV4 (parent's record dropped) | The Opus idea of counting a parent's record for its banners was lost in the merge | New decision ED12 (whether a parent's record counts for its banners at the 0.5 "related" weight) |
| RV5 (headline disagreement unstated) | Recommending HW1 (the "ranked in part by what is known" line) now partly disagrees with the owner's "not now" | Section 1 states the disagreement and names HW6 (today's line plus "Most shops are not rated yet") as closest to the owner's answer |
| RV7 (step 2 hours and missing build work) | Step 2's hours did not sum from section 6 and left out the product-type list and model change | Step 2 is 52 to 60 h plus that uncosted work, which deploys to the proxy Worker first; yearly upkeep is about 45 to 85 h |
