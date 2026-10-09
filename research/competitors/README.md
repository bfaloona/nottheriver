# Who else does this, and what would set nottheriver apart

Synthesis of two research passes made 2026-10-09: [directories.md](directories.md) (28 directories, rating sites and certification finders; 25 live ones in its matrix) and [search-tools.md](search-tools.md) (26 search engines, apps, extensions and local-shop finders). Both compare each site against the same 14 features, FT1 to FT14, defined in each file's matrix section. Every claim about a site cites the page read and its date in those files; the counts here are added from the two matrices. The matrices have 51 columns for 48 distinct sites: Goods Unite Us, Progressive Shopper and Shop Ethical! appear in both, so a few partial counts below carry a duplicate. Yes and partial are the researching agent's judgments from the pages it could open, not a second reader's.

## The answer in three lines

1. **Nobody combines product search with nearby shops and explained, sourced ethics scores.** The pieces exist separately: product-to-local-stock at Locally (brand-funded; its policy says precise location is shared with ad partners), open-map local shops at Lokjo (an OpenStreetMap map, described as ad-free and non-profit by a third-party listing; its own site has little text), sourced company ratings at Ethical Consumer (UK, evidence behind a paywall) and Shop Ethical! (Australia).
2. **Four features have no precedent at all or only token partials:** published accuracy numbers (FT10), honest degradation at a budget ceiling (FT14), cost transparency with open source (FT9), and a sourced chain badge (FT7). Nobody in 48 sites publishes what a lookup costs, how accurate their ratings are, or what happens when their money runs out.
3. **The closest models are not US.** Ethical Consumer and Shop Ethical! have the same shape as nottheriver's ethics side (weighted sourced criticism, a correction path) for the UK and Australia, for companies not shops, with no local search. The nearest US analogue is Better World Shopper (A to F grades from 76 named sources), which shows no per-company sources or dates, has no dispute path, and was last updated in 2017.

## Feature by feature, across the 48 sites

Counts are "yes" plus "partial" from the two matrices (directories 25 columns, tools 26). A partial is the nearest thing found, not the feature as nottheriver defines it.

| Feature | Yes | Partial | What the nearest things are | Differentiator? |
|---|---|---|---|---|
| FT1 product search, not a brand list | 3 | 17 | The yes cells are Google, Locally and one fashion-only site (Project Cece); Etsy and eBay are partial only because no search page was read this pass. Ethics tools look up brands, scan barcodes or react to the page you are on | Against ethics tools, yes; against marketplaces, no |
| FT2 nearby shops ranked by distance with a map | 1 | 16 | Google only; the partials are general maps (Yelp, chamber apps, Lokjo) with no ethics data, or certification directories with a location filter | Only in combination with explained scores (FT3) and sourced negatives (FT4), which exists nowhere |
| FT3 every result explained with values and a source link | 1 | 16 | The one yes is a benchmark (Fashion Transparency Index) that tells readers not to shop by it. Partials are a score with a rationale but no per-claim source or date | Yes |
| FT4 sourced, dated negatives that down-rank | 1 | 12 | Ethical Consumer, with the evidence behind a paywall; Shop Ethical! close behind, with dates not shown on the pages read | Yes, in the US and for shops rather than companies |
| FT5 dispute link on every finding and badge | 0 | 8 | Contact forms, a company challenge path, Buycott's "report inaccuracies"; none per finding | Yes |
| FT6 Amazon and its brands never appear | 0 | 8 | Single-marketplace sites lack Amazon by construction. Most extensions found run on Amazon's pages; Boycat's alternatives open on Amazon itself | Yes, and it is the opposite of the extension category's design. Open question: no competitor tests whether shoppers accept losing the widest stock, and the only "in stock" signal found (Locally) is out of reach |
| FT7 chain vs independent badge, sourced | 0 | 7 | Self-declared "small business" (Google), membership rolls (Bookshop.org, IndieBound), a revenue penalty (Shop Ethical!) | Yes; nobody shows a sourced chain flag |
| FT8 zip stays in the browser, no accounts, published "what is kept" | 0 | 10 | Lokjo (per a third-party listing) and the Shop Ethical! app claim no tracking; nobody publishes a what-is-kept table; Locally's policy shares precise location with ad partners | Yes |
| FT9 per-search cost, open ledger, open source | 0 | 1 | Funding disclosures exist; no costs, no open code found (one open dataset) | Yes, new in this scope |
| FT10 published quality numbers | 0 | 0 | Nothing | Yes, new in this scope |
| FT11 no affiliate links, no sponsored placement | 2 | 20 | The two yes cells are benchmarks with no shop links (Fashion Transparency Index, Leaping Bunny); most partials are certifiers whose listed companies pay dues, a financial tie without an affiliate link, or non-profits whose funding pages were not read | Only against the affiliate and ad-funded category; pair it with the cost ledger (FT9) to be distinct |
| FT12 curated directory with sources and dispute state, search as fallback | 0 | 13 | Membership rolls and certification lists: one external gate each, no sources, no dispute state | Yes, if the rows keep sources and dispute state |
| FT13 alternatives to Amazon-owned brands | 1 | 11 | Ethical Consumer's series; the extension category's standard move, triggered on Amazon's page and usually paid by commission | Partly; the form (not on Amazon's page, no commission) is new, the idea is not |
| FT14 honest degradation when the budget is spent | 0 | 0 | Nothing. The funding models seen either scale with use (affiliates, ads, dues) or the service simply stops: Remake concluded operations in February 2026, reason not stated, and its directory is now an archive | Yes, new in this scope; no user expectation exists either way |

## What the funding landscape says

| Model seen | Who | What it implies for nottheriver |
|---|---|---|
| Affiliate commission on the recommended alternative | Good On You, Project Cece, Bookshop.org, Thingtesting, most extensions | The rated brand is also a revenue source. Good On You says brands have no input into ratings; none says whether its paid brand products affect what is shown. This is the category "no affiliates" (FT11) is against |
| Paid certification or membership with a directory as the benefit | B Corp, Green America, Fair Trade Federation, 1% for the Planet, Climate Label | The directory is complete for payers only and shows no negatives. nottheriver uses these as positive signals and inherits that bias; the down-ranking side offsets it |
| Subscription or donations | Ethical Consumer, Shop Ethical!, Goods Unite Us premium, Boycat | Compatible with "no affiliates" (FT11). Only Ethical Consumer's evidence is confirmed paywalled, which is the opposite of explained results (FT3); Shop Ethical! says every assessment links to its sources |
| Nonprofit, open data or open map | Lokjo, Fashion Transparency Index, KnowTheChain | Compatible with "no affiliates" (FT11) and the nearest to a cost ledger (FT9). Lokjo is a working OpenStreetMap local-shop map, ad-free and non-profit per a third-party listing, which supports the open-place-data direction in [docs/feasibility-overview.md](../../docs/feasibility-overview.md) |
| Brand-paid placement and shopper data | Locally, Finch's earlier plan | The only "in stock" signal found, funded by brands and by sharing location; out of reach without funding and in conflict with the privacy stance (FT8) |

## Where the shop data comes from (relevant to the open-place-data direction)

OpenStreetMap (Lokjo), merchant self-declaration (Google, Yelp, Etsy), membership rolls (Bookshop.org, IndieBound, chambers), retailer point-of-sale feeds (Locally), crowd campaigns (Buycott, Boycat). Only the first is open and usable without funding; the planned coverage check (how many of the 86 graded nearby shops appear in OpenStreetMap or Overture with a usable category) is the test of whether it carries US local search. Self-declared "small" could be a secondary signal, never the badge.

## Limits of this pass

- Pages that blocked plain fetches, so their profiles rest on search excerpts and support pages: bcorporation.net, ewg.org, madetrade.com, bookshop.org, thingtesting.com, American Express Shop Small, the 1% for the Planet directory app, Green Business Network search. Operator checks in a browser would close these; each file's section D lists them.
- Defunct or changed since their listing elsewhere: Remake (concluded operations February 2026), Beagle Button (last update 2022), Finch (extension gone, now a subscription content site), Independent We Stand (merged into Local Business Institute, about 2024, inferred from the page), Kindring (domain parked), DoneGood (shop domain does not resolve).
- Yes and partial judgments were made by one reader per file from the pages read on 2026-10-09; nothing here was graded by a second reader. Five cells the review found unsupported by their profiles were downgraded to partial (Etsy and eBay product search; Goods Unite Us, KnowTheChain and Lokjo on affiliates).
