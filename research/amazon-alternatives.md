# Amazon alternatives: who lists them, and how the shops rate

Checked 2026-09-25. US sites only. Read [How far to trust this](#how-far-to-trust-this) before relying on any tier.

In short:

- 26 list sites were assessed. The best ones are nonprofit or reader-funded pages that explain why they left Amazon: ILSR (78 of 100), The Good Trade (74), IndieBound (73) and Good Good Good (72).
- 4 of the 26 recommend an Amazon-owned company (Zappos, AbeBooks, Whole Foods Market) or link to Amazon itself.
- The lists named 313 retailer domains. Etsy (13 sites), Bookshop.org (10) and Thrive Market (10) come up most.
- Of the 50 retailers rated, 10 are `recommended`, 26 `acceptable` and 14 `caution`. 4 more are Amazon-owned and `excluded`.

Scores and tiers follow the brief ([brief.md](brief.md) sections 4 and 5). The sources are the front matter of [sites/](sites/) and [retailers/](retailers/), collected in [index.json](index.json).

## What kinds of list sites exist

Each site has one category ([brief.md](brief.md) section 3). The counts cover the 26 sites assessed, not the whole web.

| Category | Sites | Examples (score) |
|---|---|---|
| `ethical-affirmative`: recommends shops because they are ethical or sustainable | 6 | [The Good Trade](sites/thegoodtrade-com.md) (74), [Good Good Good](sites/goodgoodgood-co.md) (72) |
| `ethical-anti-amazon`: argues against Amazon, then offers alternatives | 6 | [ILSR](sites/ilsr-org.md) (78), [VSTYLE](sites/vstyleblog-com.md) (66) |
| `tool`: a directory, app or extension that answers on demand | 7 | [IndieBound](sites/indiebound-org.md) (73), [Worker Owned](sites/workerowned-info.md) (69) |
| `ethical-anti-bigbox`: against Amazon, Walmart, Target or big retail as a group | 3 | [Make It Work Crafts](sites/makeitworkcrafts-com.md) (67), [A Day in Our Shoes](sites/adayinourshoes-com.md) (61) |
| `clickbait`: thin "sites like Amazon" lists made for search traffic | 3 | [GOBankingRates](sites/gobankingrates-com.md) (40), [MoneyPantry](sites/moneypantry-com.md) (32) |
| `affiliate-funnel`: a "best of" list built around paid picks | 1 | [PCWorld](sites/pcworld-com.md) (42) |

Affiliate links, from each file's `affiliate_links` field: 15 sites have none, 9 disclose them, 1 doesn't disclose them ([Going Zero Waste](sites/goingzerowaste-com.md)), and 1 is unknown ([DoneGood](sites/donegood-co.md)).

## Which are worth using

Scores are out of 100: independence 20, evidence 20, substance 20, currency 15, usefulness 15, no dark patterns 10.

| Site | Score | Why it scores well | Where it loses points |
|---|---|---|---|
| [ILSR](sites/ilsr-org.md) | 78 | No affiliate links, owner named, a well-sourced case against Amazon, 24 shops grouped by product type, plus store locators | Claims about each shop are mostly unsourced (evidence 7/20) |
| [The Good Trade](sites/thegoodtrade-com.md) | 74 | Updated 2026-08-26, states its inclusion criteria, groups picks by product type and says where each ships | One pick is labeled "The Good Trade Partner", and it names certifications without linking the certifier |
| [IndieBound](sites/indiebound-org.md) | 73 | The booksellers' association's finder for independent bookstores, searchable by ZIP code and owner identity | Books only; a trade association promoting its own members |
| [Good Good Good](sites/goodgoodgood-co.md) | 72 | 49 shops across many product types, each with a reason; the case against Amazon links 13 sources | Most links are affiliate links, some picks are "partners" without a label, and there are discount codes |
| [Worker Owned](sites/workerowned-info.md) | 69 | Directory of worker- and employee-owned businesses; no commission, ownership type on every pick | No owner or funding named; no update date |
| [Make It Work Crafts](sites/makeitworkcrafts-com.md) | 67 | 31 craft and art-supply shops, no affiliate links | Craft supplies only; no sources for any shop (evidence 2/20) |
| [VSTYLE](sites/vstyleblog-com.md) | 66 | Well-sourced boycott case; lists Amazon-owned brands to avoid | No date; 14 of 19 retailer links are affiliate links |

Evidence is the weak part everywhere. Only 2 of 26 sites score above 10 of 20 on it: [The Markup's Amazon Brand Detector](sites/themarkup-org.md) (16) and [IndieBound](sites/indiebound-org.md) (12).

Sites to skip:

- [DoneGood](sites/donegood-co.md), 10: the ethical-shopping extension is gone, and the domain now serves an unrelated climate publication.
- [MoneyPantry](sites/moneypantry-com.md), 32: a "sites like Amazon" list whose author says they still shop at Amazon. It recommends Amazon-owned Zappos.
- [The People's Union USA](sites/thepeoplesunionusa-com.md), 32: a boycott campaign page that names no shops to use instead.

All 26 scores are in [index.json](index.json). The alignment of scores across sites is in [raw/calibration.md](raw/calibration.md).

## Amazon-owned companies offered as "alternatives"

A company is Amazon-owned only if it matches `data/blocklist.json` (sourced in `data/blocklist.md`). 22 of the 26 sites recommend no Amazon-owned company and don't link to Amazon. The other 4 do:

| Amazon-owned company | Recommended by | How | Retailer file |
|---|---|---|---|
| Amazon | [Fair Trade USA](sites/fairtradecertified-org.md) | A shop tile links to an amazon.com search page | [amazon-com](retailers/amazon-com.md) |
| Amazon | [PCWorld](sites/pcworld-com.md) | An affiliate-tagged link to an amazon.com listing, shown sold out | [amazon-com](retailers/amazon-com.md) |
| Whole Foods Market | [Fair Trade USA](sites/fairtradecertified-org.md) | A shop tile, and an Allegro Coffee tile that links to wholefoodsmarket.com | [wholefoodsmarket-com](retailers/wholefoodsmarket-com.md) |
| Zappos | [MoneyPantry](sites/moneypantry-com.md) | A pick linking to zappos.com | [zappos-com](retailers/zappos-com.md) |
| AbeBooks | [TechRadar](sites/techradar-com.md) | A book pick, named without a link; the page itself notes that Amazon owns it | [abebooks-com](retailers/abebooks-com.md) |

Fair Trade USA's page also has two brand links that go to Amazon's store (a Big Country Foods tile and a BLK & Bold product). Those brands are not Amazon-owned, but the links send shoppers to Amazon. Its `no_dark_patterns` score is 1 of 10.

Some sites name Amazon-owned brands only as ones to avoid ([VSTYLE](sites/vstyleblog-com.md), [Antifa Marketer](sites/antifamarketer-org.md)). That is not a recommendation and isn't counted.

## Which retailers appear most

Mentions count how many of the 26 site files name the retailer's domain ([raw/tally.md](raw/tally.md)). These are the 20 named by 4 or more sites.

| Retailer | Sites | Tier |
|---|---|---|
| [Etsy](retailers/etsy-com.md) | 13 | recommended |
| [Bookshop.org](retailers/bookshop-org.md) | 10 | recommended |
| [Thrive Market](retailers/thrivemarket-com.md) | 10 | caution |
| [Libro.fm](retailers/libro-fm.md) | 7 | acceptable |
| [Credo Beauty](retailers/credobeauty-com.md) | 6 | acceptable |
| [eBay](retailers/ebay-com.md) | 6 | caution |
| [Grove Collaborative](retailers/grove-co.md) | 6 | recommended |
| [EarthHero](retailers/earthhero-com.md) | 5 | acceptable |
| [Newegg](retailers/newegg-com.md) | 5 | caution |
| [Uncommon Goods](retailers/uncommongoods-com.md) | 5 | recommended |
| [AliExpress](retailers/aliexpress-com.md) | 4 | caution |
| [Back Market](retailers/backmarket-com.md) | 4 | acceptable |
| [Best Buy](retailers/bestbuy-com.md) | 4 | caution |
| [BLK + GRN](retailers/blkgrn-com.md) | 4 | acceptable |
| [Misfits Market](retailers/misfitsmarket-com.md) | 4 | acceptable |
| [Package Free](retailers/packagefreeshop-com.md) | 4 | acceptable |
| [Patagonia](retailers/patagonia-com.md) | 4 | recommended |
| [Target](retailers/target-com.md) | 4 | caution |
| [Walmart](retailers/walmart-com.md) | 4 | caution |
| [Pact](retailers/wearpact-com.md) | 4 | recommended |

The tally has 313 domains: 37 named by 3 or more sites, 24 by 2 and 252 by 1. How the 50 rated retailers were picked from them is in [method.md](method.md#caps-and-what-was-trimmed).

## How the rated retailers come out

Ethics and environment each start at 0.5. A counted certification adds 0.25. An accepted concern takes 0.25 away. `recommended` needs a total of 1.25 or more and no accepted concern in the last 5 years. `caution` is a total under 1.0 ([brief.md](brief.md) section 5).

| Tier | Retailers |
|---|---|
| `recommended` | 10 |
| `acceptable` | 26 |
| `caution` | 14 |
| `excluded` (Amazon-owned) | 4 |

Counts are from the `tier` field of each file in [retailers/](retailers/).

A retailer with no counted certification and no accepted concern totals 1.0, which is `acceptable`. That covers 24 of the 26 `acceptable` retailers. For most of them, `acceptable` means the search found nothing either way, not that they were checked and found clean.

### Recommended (10)

`fair_trade` here means the brand sells Fair Trade Certified products and is listed on Fair Trade USA's brand page. It is not a whole-company certification.

| Retailer | Ethics | Environment | What earned it |
|---|---|---|---|
| [Eileen Fisher](retailers/eileenfisher-com.md) | 1.0 | 0.5 | B Corp (from `data/certifications.json`) and fair trade products |
| [Patagonia](retailers/patagonia-com.md) | 0.75 | 0.75 | Fair trade products and B Corp (from `data/certifications.json`); 1% for the Planet (from `data/certifications.json`). One NLRB settlement, 2020-03-25, takes 0.25 off ethics; it is older than 5 years, so it doesn't block the tier. |
| [Equal Exchange](retailers/equalexchange-coop.md) | 0.75 | 0.5 | Worker co-op, listed in the US Federation of Worker Cooperatives directory |
| [Grove Collaborative](retailers/grove-co.md) | 0.75 | 0.5 | B Corp (from `data/certifications.json`) |
| [Uncommon Goods](retailers/uncommongoods-com.md) | 0.75 | 0.5 | B Corp (from `data/certifications.json`) |
| [Pact](retailers/wearpact-com.md) | 0.75 | 0.5 | Fair trade products |
| [Mightly](retailers/mightly-com.md) | 0.75 | 0.5 | Fair trade products (see the lead decision in [method.md](method.md#decisions-made-during-the-run)) |
| [Etsy](retailers/etsy-com.md) | 0.5 | 0.75 | The Climate Label, checked on the certifier's page |
| [Bookshop.org](retailers/bookshop-org.md) | 0.5 | 0.75 | The Climate Label, checked on the certifier's page |
| [Tentree](retailers/tentree-com.md) | 0.5 | 0.75 | The Climate Label, checked on the certifier's page |

Each certification was checked again by a verifier. The verifier tables are in [raw/verify-R1.md](raw/verify-R1.md) to [raw/verify-R10.md](raw/verify-R10.md).

### Caution (14)

Each concern below comes from an accepted source (a regulator, a court or an outlet listed in `data/negative-sources.md`). The wording follows the source.

| Retailer | Ethics | Environment | Why |
|---|---|---|---|
| [Walmart](retailers/walmart-com.md) | 0 | 0.25 | DOJ settlement over opioid prescriptions ($50 million, 2026); FTC stipulated order (2025); EEOC consent judgment (2024); criminal judgment with an $11 million fine in an environmental case (2013) |
| [Costco](retailers/costco-com.md) | 0 | 0.5 | Three OSHA inspections ending in penalties ($560 in 2019, $1,330 in 2023, $9,403 in 2024), and an NLRB complaint issued in 2025 (case still open) |
| [Chewy](retailers/chewy-com.md) | 0 | 0.5 | Four OSHA inspections with penalties, 2017 to 2023, at four sites |
| [Target](retailers/target-com.md) | 0 | 0.5 | NLRB settlement (2023); EEOC consent decrees (2020, 2011) |
| [B&H Photo Video](retailers/bhphotovideo-com.md) | 0 | 0.5 | Two OSHA serious citations with penalties at its New Jersey warehouse (2019, 2022) |
| [Azure Standard](retailers/azurestandard-com.md) | 0 | 0.5 | Three OSHA inspections with penalties (2022, 2023) at Azure Farms Inc. The link to Azure Standard rests on a matching address (see [raw/verify-R9.md](raw/verify-R9.md)). |
| [AliExpress](retailers/aliexpress-com.md) | 0.25 | 0.5 | Alibaba Group agreed to pay $600 million to resolve DOJ allegations over illegal sales on its platforms, AliExpress included (2026). A European Commission fine (2026) is recorded but doesn't count: its source isn't on the accepted list. |
| [eBay](retailers/ebay-com.md) | 0.25 | 0.5 | $3 million fine over former employees' harassment campaign (NPR, 2024) |
| [Barnes & Noble](retailers/barnesandnoble-com.md) | 0.25 | 0.5 | One OSHA serious citation, $13,828 (2024) |
| [Thrive Market](retailers/thrivemarket-com.md) | 0.25 | 0.5 | One OSHA serious citation, $3,306 after settlement (2024) |
| [ThredUp](retailers/thredup-com.md) | 0.25 | 0.5 | One OSHA "Other" citation, $1,773 after settlement (2025) |
| [Newegg](retailers/newegg-com.md) | 0.25 | 0.5 | NLRB complaint (2017) and settlement (2019) |
| [Best Buy](retailers/bestbuy-com.md) | 0.25 | 0.5 | Agreed to pay a $3.8 million CPSC civil penalty for selling recalled products (2016). Found in the news pass. |
| [Overstock](retailers/overstock-com.md) | 0.25 | 0.5 | California Court of Appeal upheld $6,828,000 in civil penalties for unfair business practices (People v. Overstock.com, 2017). Found in the news pass. |

One accepted concern and no counted certification is enough for `caution`. Several of these rest on a single small citation. The retailer files give the details and the cases that were noted but not counted.

### Acceptable (26)

24 have nothing counted either way. Two have both certifications and concerns:

- [Avocado Green Mattress](retailers/avocadogreenmattress-com.md): The Climate Label and 1% for the Planet (from `data/certifications.json`) raise environment to 1.0. Two OSHA inspections with penalties (2022, 2023) take ethics to 0.
- [Bob's Red Mill](retailers/bobsredmill-com.md): fair trade products, minus one OSHA inspection with a penalty (2023).

The full list is in [index.json](index.json).

## How far to trust this

All planned concern searches have now run for the 38 retailers that could still change tier. Open rule questions could still move some tiers ([method.md](method.md#operator-checks), OC32 to OC36), and the limits below remain.

- **The web search budget ran out.** The run's 200 web searches were used up while the retailer batches were running. Batch R1 hit the limit right after its Etsy searches ([raw/blocked-retailers-R1.md](raw/blocked-retailers-R1.md)). After that, concern checks used whatever regulator and court pages could be fetched directly, mostly OSHA, NLRB and CourtListener. So the concern searches were incomplete for almost every retailer. The `blocked-retailers-R<n>.md` files in [raw/](raw/) list what was missed for each batch.
- **A second concern pass found nothing new.** Later on 2026-09-25, still without web search, four agents rechecked the 38 recommended and acceptable retailers against FTC case titles, CourtListener dockets since 2016 where a government body is a party, and ProPublica. They added no concerns and changed no tiers ([raw/concern-pass-2-brief.md](raw/concern-pass-2-brief.md), `raw/concerns2-C1.md` to `C4.md`). The 12 caution retailers were skipped because a new concern can't change their tier. It had no general news search; pass 3 below added one.
- **A third pass searched the news.** In a later session with a larger search budget, four agents ran 2 or 3 web searches per retailer (lawsuits and fines; named US agencies; the parent company or, for a non-US retailer, its home regulator) on the same 38 retailers ([raw/news-search-brief.md](raw/news-search-brief.md), `raw/news-N1.md` to `N4.md`). They added two accepted concerns, both old court or agency penalties: [Best Buy](retailers/bestbuy-com.md) and [Overstock](retailers/overstock-com.md) move from `acceptable` to `caution`. No `recommended` retailer changed. Items from sources not on the accepted list (for example an FDA warning letter to Public Goods, a California Air Resources Board settlement with Overstock, and private Proposition 65 settlements) are noted in the retailer files and not counted.
- **Pass 1's OSHA and NLRB searches used pages that robots.txt disallows** (`osha.gov/ords/`, `nlrb.gov/search/`). This breaks the run's own access rule. Every OSHA concern in the retailer files comes from those pages. They are real agency records. Dropping them would change 8 tiers, 2 of them to recommended. The operator decided on 2026-09-25 to keep them. A try at re-sourcing them through DOL's open-data API was inconclusive: the key works, but DOL's inspection number didn't match the osha.gov ID, and the API rate-limited the lookups (`research/fetch-osha-dol.mjs`, [raw/run-log.md](raw/run-log.md)). A retry by establishment name and close date then found 12 of the 18 in DOL's data (Thrive's 1 is ambiguous; B&H's 2 and Azure's 3 not yet found) ([raw/osha-dol-match.md](raw/osha-dol-match.md); [method.md](method.md#operator-checks), OC31).
- **Several accepted sources couldn't be read.** Good Jobs First's Violation Tracker returned 403 in every batch. justice.gov served a bot challenge, the ftc.gov search returned 404 in the first pass (it worked in the second), the AP site couldn't be fetched and CourtListener's docket pages returned 403 (its search API was used instead).
- **Foreign regulators count only as notes.** [Kotn](retailers/kotn-com.md) (Toronto), [World of Books](retailers/worldofbooks-com.md) (UK), [Kobo](retailers/kobo-com.md), [Shop](retailers/shop-app.md), [Depop](retailers/depop-com.md) and the recommended [Tentree](retailers/tentree-com.md) (Vancouver) are based outside the US ([raw/verify-R10.md](raw/verify-R10.md) first noted this). Passes 1 and 2 used US sources for them. Pass 3 added one search on each one's home regulator, but those regulators' pages are not on the accepted list, so anything found there is a note, not a concern.
- **B Corp could only count through `data/certifications.json`.** bcorporation.net blocked agents (HTTP 403) throughout ([raw/blocked-assess-F.md](raw/blocked-assess-F.md)). Four retailers get B Corp credit from rows in that file: Eileen Fisher, Grove Collaborative, Patagonia and Uncommon Goods (`verified_this_run: false`). Other B Corp claims were noted and not counted, including those of Back Market, Better World Books, EarthHero, Kotn, Libro.fm, Love Grown, Thrive Market and World of Books. If any of them were confirmed, its tier could rise.
- **1% for the Planet could not be read.** Its directory builds its pages with scripts and blocks agents in robots.txt. Only the `data/certifications.json` rows for Patagonia and Avocado count.
- **The Climate Label was not checked for batch R10** (Costco, Eileen Fisher, Kotn, World of Books, Made Trade) ([raw/verify-R10.md](raw/verify-R10.md)).
- **Some rules were set during the run**, such as what counts as a concern and which OSHA citations count. The operator approved the four that affect tiers on 2026-09-25 (what counts as a concern, which OSHA citations count, Fair Trade USA brand listings as `fair_trade`, and open NLRB complaints); the rest stand as the lead's decisions ([method.md](method.md#decisions-made-during-the-run)).
- **The list sites are a sample.** 30 of 116 candidate pages were shortlisted, and 4 of those couldn't be read. Sites were judged from what they showed on 2026-09-25.

What still needs a person to check is listed in [method.md](method.md#operator-checks).
