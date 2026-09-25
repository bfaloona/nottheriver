# Method

How the Amazon alternatives research was run on 2026-09-25, what was left out, and what still needs a person. The findings are in [amazon-alternatives.md](amazon-alternatives.md). The layout and rebuild commands are in [README.md](README.md).

## Rubric

The rules live in the brief. They are not copied here.

| Topic | Where |
|---|---|
| Categories for list sites | [brief.md](brief.md) section 3 |
| Site score (0 to 100, six parts) | [brief.md](brief.md) section 4 |
| Retailer rating and tiers | [brief.md](brief.md) section 5, which mirrors `docs/ranking.md` |
| Run tuning: caps, certification fallback, blocked pages, assessor rules R1 to R9, what counts as a concern, OSHA citations | [brief.md](brief.md) section 9 |
| Calibration rules K1 to K10 | [raw/calibration.md](raw/calibration.md) |

`build-index.mjs` recomputes `score`, `accepted_source`, `ethics`, `environment`, `tier` and `mentions` from each file, so an agent's arithmetic can't drift from these rules.

## Stages

From [raw/run-log.md](raw/run-log.md).

| Stage | Agents | Output |
|---|---|---|
| Discovery | 6 search agents (one per angle) and a completeness critic | `raw/discovery-*.md`, [raw/candidates.md](raw/candidates.md), [raw/shortlist.md](raw/shortlist.md) |
| Assess | A pilot agent (3 pages), then 7 groups (A to G) | 26 files in [sites/](sites/), `raw/blocked-assess-*.md` |
| Calibrate | One calibrator | Edits to 20 site files, [raw/calibration.md](raw/calibration.md) |
| Tally | Script (`--tally`); the lead wrote the selection | [raw/tally.md](raw/tally.md), [raw/retailer-selection.md](raw/retailer-selection.md) |
| Rate retailers | 10 researchers (batches R1 to R10), each followed by a verifier who tried to refute the researcher's claims | 50 files in [retailers/](retailers/), `raw/blocked-retailers-R*.md`, `raw/verify-R*.md` |
| Excluded retailers | The lead | 4 Amazon-owned files |
| Report | One writer | This file, [amazon-alternatives.md](amazon-alternatives.md), [README.md](README.md) |

Models: Sonnet for discovery and the critic, Opus for the assessors, researchers and verifiers. The calibrator was planned on Fable (see [Decisions](#decisions-made-during-the-run)).

## Search log summary

Queries are counted from the "Queries" table in each discovery file. Candidate rows are counted from the "Candidates" table.

| Angle | Queries | Candidate rows | File |
|---|---|---|---|
| Generic ("alternatives to Amazon") | 22 | 25 | [raw/discovery-generic.md](raw/discovery-generic.md) |
| Product types (books, electronics, groceries, clothes and more) | 20 | 25 | [raw/discovery-product-types.md](raw/discovery-product-types.md) |
| Motives: ethics, labor, antitrust, boycott | 28 | 25 | [raw/discovery-motive-ethics.md](raw/discovery-motive-ethics.md) |
| Motives: shop small, local, co-op, B Corp, fair trade, sustainable | 15 | 25 | [raw/discovery-motive-local.md](raw/discovery-motive-local.md) |
| Formats: apps, extensions, directories, databases | 23 | 25 | [raw/discovery-formats.md](raw/discovery-formats.md) |
| News coverage of Amazon boycotts | 21 | 19 | [raw/discovery-news.md](raw/discovery-news.md) |
| Completeness critic (big outlets, forums, unions, bookstore and local-first campaigns, Sook) | 12 | 9 added | [raw/discovery-critic.md](raw/discovery-critic.md) |
| **Total** | **141** | | |

Merging ([raw/candidates.md](raw/candidates.md)):

- The six angles' rows were deduplicated by exact URL.
- 4 pages were dropped as merchant-facing: three retailers' own blogs and a directory where businesses list themselves.
- That left 107 candidates. The critic added 9, for **116 candidates across 103 domains**.

What the searches kept hitting:

- Many generic results were aimed at sellers competing with Amazon, not shoppers leaving it. They were skipped.
- No dedicated list was found from Wirecutter, Vox, Mashable, Consumer Reports or the Teamsters ([raw/discovery-critic.md](raw/discovery-critic.md)).
- r/AnywhereButAmazon is a forum, so it was left out.

Non-US lists were logged and skipped. Most were UK ones, such as Ethical Consumer, The Good Shopping Guide and ethical.net. They are in the `raw/out-of-scope-*.md` files.

## Caps and what was trimmed

The operator's caps: assess at most 30 sites and rate at most 50 retailers ([brief.md](brief.md) section 9).

### Sites: 30 of 116 candidates

- **Shortlist.** 30 entries cover 34 candidate pages, because four entries hold two pages from one domain (goodgoodgood.co, bcorporation.net, fairtradecertified.org, usworker.coop). The priorities were: every category covered, many retailers named, pages found by two or more angles, and the most prominent tools ([raw/shortlist.md](raw/shortlist.md)).
- **Trimmed.** The other candidates are in the "Trimmed" table of [raw/shortlist.md](raw/shortlist.md) with a one-line reason. Sook is the exception (see below). The table also still lists amazonalts.org, which was later moved onto the shortlist. Most reasons are "category already covered by stronger picks within the cap", a narrow product focus, unclear US scope, or a second page from a domain already shortlisted.
- **Sook.** The Sook extension's Chrome Web Store listing was replaced by amazonalts.org. The listing may have been delisted on 2025-09-16, and a store listing isn't the tool's own site ("Lead changes" in [raw/shortlist.md](raw/shortlist.md)).
- **Blocked, no site file.** 4 shortlisted pages couldn't be read, so 26 site files exist. No claim was made from any of them.

| Page | What happened | Logged in |
|---|---|---|
| Rolling Stone, "best Amazon alternatives" | Redirected to a pay-per-crawl gate for bots (HTTP 402) | [raw/blocked-assess-pilot.md](raw/blocked-assess-pilot.md) |
| The Hollywood Reporter, Amazon and Target alternatives | Redirected to the same kind of pay-per-crawl gate | [raw/blocked-assess-C.md](raw/blocked-assess-C.md) |
| The Washington Post, ebook and audiobook alternatives | HTTP 403 | [raw/blocked-assess-D.md](raw/blocked-assess-D.md) |
| bcorporation.net, Find a B Corp | HTTP 403 (the US and Canada URL returned 404) | [raw/blocked-assess-F.md](raw/blocked-assess-F.md) |

- **IndieBound.** The shortlisted URL (bookweb.org/indiebound) returned 404. The live product was assessed at indiebound.org instead ([raw/blocked-assess-G.md](raw/blocked-assess-G.md)).

The shortlist's guesses at categories didn't all hold. It expected 4 `affiliate-funnel` sites and 9 `tool` sites. After assessment there are 1 and 7: bcorporation.net was blocked, amazonalts.org turned out to be an article, and assessors put some expected affiliate funnels in other categories.

### Retailer rows: 90 moved out by calibration

Calibration moved 90 rows from "Retailers named" to "Also named (not counted)" across 14 site files. This covered services for selling your own things, free-exchange networks, streaming and library apps, rentals, directories and other non-shops (rules K1, K6 and K8). The tally fell from 390 domains to 313 ([raw/calibration.md](raw/calibration.md)).

### Retailers: 50 of 313 domains

Rule from [raw/retailer-selection.md](raw/retailer-selection.md):

- **3 or more mentions.** All 37 domains are rated except hive.co.uk, a UK-only bookshop that is out of scope for US shoppers. That makes 36.
- **2 mentions.** 14 of the 23 non-Amazon domains are rated. They were ranked by the summed scores of the sites that name them. At the cutoff, all four tied at 118 were kept, then the two at 113.
- **Left out at 2 mentions.** bonanza.com, fairtradewinds.net, rei.com, facebook.com, biblio.com, microcenter.com, buydig.com, ebid.net and wish.com had lower summed scores.
- **1 mention.** The 252 domains named by only one site are not rated.
- **Amazon-owned.** amazon.com, abebooks.com, wholefoodsmarket.com and zappos.com get `excluded` files outside the 50. They were not researched.

## Decisions made during the run

From [raw/run-log.md](raw/run-log.md) and [brief.md](brief.md) section 9. On 2026-09-25 the operator approved the four rules that affect tiers: what counts as a concern, which OSHA citations count, Fair Trade USA brand listings as `fair_trade`, and open NLRB complaints. The operator may still overrule the lead's other decisions. What would change is under [Operator checks](#operator-checks).

| Decision | Made by | What it says | Effect in this run |
|---|---|---|---|
| Certification fallback | Operator | If a certifier's directory blocks agents, a `data/certifications.json` row for the same domain and kind counts, marked `verified_this_run: false` | Only way B Corp could count; used for 4 retailers, and for 1% for the Planet for 2 |
| What counts as a concern | Lead | Only an action by an agency or court: a citation, an agency-issued complaint, a fine, a settlement, a judgment or a finding. Charges or suits filed by others go in the body. An action later dismissed, withdrawn or reversed goes in the body. | eBay's EPA complaint was removed as dismissed. Shop's two lawsuits were removed (Shop moved from `caution` to `acceptable`). Etsy's private Prop 65 settlement moved to the body. |
| OSHA citations | Lead | A citation counts only if it carries a penalty and the case is closed. One inspection is one concern. | ThredUp's 2017 $0 inspection moved to the body. A duplicate Thrive Market record was merged. Equal Exchange's open $0 case isn't counted, so it stays `recommended`. |
| `fair_trade` | Lead | Follows `docs/ranking.md`: the brand sells Fair Trade Certified products and appears on Fair Trade USA's brand listing. Stockists such as Walmart and Costco don't count. | The verifier had removed Mightly's `fair_trade`. The lead restored it because the curated rows in `data/certifications.json` cite the same listing ([raw/verify-R8.md](raw/verify-R8.md)). Mightly stays `recommended`. |
| NLRB complaint while the case is open | Lead | An agency-issued NLRB complaint counts even while open. The open-case exception applies to OSHA only. | Costco's 2025 complaint counts. Costco is `caution` either way. |
| K1 | Lead | "Retailers named" holds only places a US shopper can buy goods. Everything else moves to "Also named (not counted)". | 90 rows moved (with K6 and K8) |
| K2 | Lead | Recommending an Amazon-owned company costs points under both Substance and No dark patterns (an exception to R7) | Fair Trade USA, PCWorld and TechRadar lost Substance points |
| K3 | Lead | `ethical-anti-amazon` is an extra tag only when the page itself states reasons against Amazon | The Good Trade gained the tag |
| K4 | Lead | One registrable domain per retailer, using the current domain after a redirect | Arteza's link now counts as plaidonline.com |
| K5 | Lead | Compare articles with articles and tools with tools; align outliers | 5 score parts changed |
| K6 | Calibrator | Buying marketplaces stay; buyback, trade-in and seller platforms move out when offered for selling | Rows moved in 2 files (DollarSprout, MoneyPantry) |
| K7 | Calibrator | `affiliate-funnel` is an extra tag only for a partner label, a discount code, undisclosed links or a repeated top pick | No change |
| K8 | Calibrator | Rentals, subscriptions, closed shops and a government-only marketplace move out; stores selling digital goods to keep stay | DoneGood, Rent the Runway, Scribd and others moved |
| K9 | Calibrator | hive.co.uk (UK bookseller) and the US grocery Hive (lovegrown.com) are different retailers | Rows renamed "Hive (US grocery)" |
| K10 | Calibrator | Not settled: Fair Trade USA producer and supplier tiles weren't checked for direct sales | Left in the table |
| Calibrator model | Lead | The calibrator on Fable failed with a 429 (out of usage credits). It had read the files but made no edits. It was rerun on Opus. | Calibration done by Opus |

## Known limits

- **Concern searches are incomplete.** The run's 200 web searches ran out during the retailer stage. Later checks used regulator and court pages fetched directly, mostly OSHA, NLRB and CourtListener. Each `raw/blocked-retailers-R*.md` file lists what was not searched. All 50 rated retailer files carry a "tier is provisional" line. Verifiers added it to 47; the lead added it to the other three (Eileen Fisher, Kotn, Made Trade), which were also searched after the budget ran out ([raw/blocked-retailers-R10.md](raw/blocked-retailers-R10.md)).
- **A second concern pass found nothing new.** Later on 2026-09-25, still without web search, four agents rechecked the 38 recommended and acceptable retailers against FTC case titles, CourtListener dockets since 2016 where a government body is a party, and ProPublica. They added no concerns and changed no tiers ([raw/concern-pass-2-brief.md](raw/concern-pass-2-brief.md), `raw/concerns2-C1.md` to `C4.md`). The 12 caution retailers were skipped because a new concern can't change their tier. There was still no general news search, so tiers stay provisional.
- **Pass 1's OSHA and NLRB searches used pages that robots.txt disallows** (`osha.gov/ords/`, `nlrb.gov/search/`). This breaks the run's own access rule. Every OSHA concern in the retailer files comes from those pages. They are real agency records, and The operator decided on 2026-09-25 to keep them. A try at re-sourcing them through DOL's open-data API was inconclusive: the key works, but DOL's inspection number didn't match the osha.gov ID, and the API rate-limited the lookups (`research/fetch-osha-dol.mjs`, [raw/run-log.md](raw/run-log.md)). A retry by establishment name is planned (OC31).
- **Some accepted sources were unreachable.** Good Jobs First's Violation Tracker (403 in every batch), justice.gov (bot challenge), ftc.gov search (404 in pass 1; worked in pass 2), dol.gov search (403), apnews.com (fetch refused), and CourtListener docket pages (403; its search API was used instead).
- **Search depth varies by retailer.** Big retailers with many OSHA and NLRB records had more to find than small brands. Costco's file says its concerns are a sample of many cases.
- **Certifications.** bcorporation.net returned 403 throughout. The 1% for the Planet directory builds its pages with scripts and disallows agents in robots.txt. The Climate Label wasn't checked for batch R10. See [amazon-alternatives.md](amazon-alternatives.md#how-far-to-trust-this).
- **Foreign sources weren't searched** for companies based outside the US ([raw/verify-R10.md](raw/verify-R10.md) notes Kotn and World of Books; Tentree, a recommended retailer, is based in Vancouver).
- **`sells_on_amazon` is `unknown` in all 54 retailer files.** No fetched source stated it.
- **Site scores are judgments.** Each site was scored by one assessor and aligned by one calibrator. Each read the page as it stood on 2026-09-25.
- **Tools list only their curated picks** ([brief.md](brief.md) section 9), so their whole databases aren't in the tally.
- **The tally counts sites, not how prominent a pick is.** A retailer in a 49-shop list counts the same as the top pick in a 9-shop list.

## Operator checks

Every page or decision the logs hand to the operator. "Tier effect" applies the rules in [brief.md](brief.md) section 5 to the file's current values.

| # | What to check | Logged in | What changes if it passes |
|---|---|---|---|
| OC1 | Read the Rolling Stone list (pay-per-crawl gate) | [raw/blocked-assess-pilot.md](raw/blocked-assess-pilot.md) | A site file can be written; tally counts may change |
| OC2 | Read the Hollywood Reporter list (pay-per-crawl gate) | [raw/blocked-assess-C.md](raw/blocked-assess-C.md) | Same as OC1 |
| OC3 | Read the Washington Post ebook and audiobook guide (403) | [raw/blocked-assess-D.md](raw/blocked-assess-D.md) | Same as OC1 |
| OC4 | Open bcorporation.net's Find a B Corp directory (403) | [raw/blocked-assess-F.md](raw/blocked-assess-F.md) | A site file for the directory; B Corp listings can be checked for OC5 |
| OC5 | Confirm the B Corp claims that have no `data/certifications.json` row: Back Market, Better World Books, EarthHero, Kotn, Libro.fm, Love Grown, World of Books, Thrive Market, Bookshop.org, Tentree | `raw/blocked-retailers-R1.md`, `-R2`, `-R3`, `-R5`, `-R6`, `-R7`, `-R10` | +0.25 ethics each. The first seven go from `acceptable` to `recommended`. Thrive Market goes from `caution` to `acceptable`. Bookshop.org and Tentree are already `recommended`. |
| OC6 | Read 1% for the Planet membership (the directory builds its pages with scripts) | All `raw/blocked-retailers-R*.md` | +0.25 environment for each member. An `acceptable` member with no accepted concern becomes `recommended`. |
| OC7 | Decide whether ZeroWasteStore's Climate Label, which says it covers EarthHero, counts for EarthHero (EarthHero's own page says its certification expired) | [raw/blocked-retailers-R2.md](raw/blocked-retailers-R2.md), [raw/verify-R2.md](raw/verify-R2.md) | EarthHero environment 0.75: `acceptable` to `recommended` |
| OC8 | Check The Climate Label for Costco, Eileen Fisher, Kotn, World of Books and Made Trade | [raw/verify-R10.md](raw/verify-R10.md) | +0.25 environment each. Kotn, World of Books and Made Trade would become `recommended`. Costco stays `caution`. |
| OC9 | Run the owed concern searches (FTC, DOL, EPA, CPSC, DOJ, AP, NPR, ProPublica, Violation Tracker), starting with every `recommended` retailer | All `raw/blocked-retailers-R*.md`; [raw/run-log.md](raw/run-log.md) | Each accepted concern found takes 0.25 off. One from the last 5 years moves a retailer out of `recommended`. |
| OC10 | Keep or overrule "what counts as a concern" | [brief.md](brief.md) section 9; [raw/run-log.md](raw/run-log.md) | If filed charges and dismissed actions count: eBay's EPA complaint returns (environment 0.25, still `caution`) and Shop's lawsuits return (Shop back to `caution`). Filed charges and suits noted in other files would need a new review. |
| OC11 | Keep or overrule the OSHA rule (a penalty and a closed case) | [brief.md](brief.md) section 9; [raw/verify-R5.md](raw/verify-R5.md) | If $0 and open citations count: Equal Exchange goes from `recommended` to `acceptable`, and Bob's Red Mill (an open $0 citation from a 2025 inspection) from `acceptable` to `caution`. ThredUp, Barnes & Noble and Chewy stay `caution`. |
| OC12 | Keep or overrule counting an open NLRB complaint | [raw/run-log.md](raw/run-log.md) | No tier change (Costco is `caution` either way) |
| OC13 | Keep or overrule the `fair_trade` definition (sells certified products) | [raw/run-log.md](raw/run-log.md); [raw/verify-R8.md](raw/verify-R8.md) | The same brand listing backs every `fair_trade` row. If only certified companies count: Mightly and Pact go from `recommended` to `acceptable`, and Bob's Red Mill from `acceptable` to `caution`. Eileen Fisher (total 1.25) and Patagonia (total 1.25) stay `recommended`. |
| OC14 | Confirm that eBay's EPA case ended when the government dropped its own appeal (the mandate's text wasn't shown) | [raw/verify-R2.md](raw/verify-R2.md) | If the dismissal didn't stand, the concern returns: environment 0.25, still `caution` |
| OC15 | Read the justice.gov releases on eBay (pill presses, no-poach, cyberstalking) behind a bot challenge | [raw/blocked-retailers-R2.md](raw/blocked-retailers-R2.md) | May add concerns; eBay is already `caution` |
| OC16 | Confirm Azure Farms Inc is Azure Standard (the link rests on a complaint's "information and belief" and a matching address) | [raw/run-log.md](raw/run-log.md); [raw/verify-R9.md](raw/verify-R9.md) | If not, 3 concerns drop: `caution` to `acceptable` |
| OC17 | Confirm 1 Barnes and Noble Way, Monroe Township NJ is a Barnes & Noble, Inc. site (barnesandnobleinc.com had a certificate error) | [raw/verify-R5.md](raw/verify-R5.md) | If not, its one concern drops: `caution` to `acceptable` |
| OC18 | Confirm Chewy's Ocala FL inspection is Chewy's own site (OSHA lists a pet-food manufacturing code) | [raw/verify-R5.md](raw/verify-R5.md) | If not, one concern drops; Chewy stays `caution` |
| OC19 | Check whether the 2026 FTC order against Walmart (N.D. Cal.) is an accepted concern | [raw/verify-R4.md](raw/verify-R4.md) | No tier change (ethics is already 0) |
| OC20 | Read agency pages that could add concerns to retailers already in `caution`: Chewy (DOJ, overlapping directors), B&H (DOL settlement, 2017), Costco (California DTSC case), Walmart (DOJ FCPA resolution, 2019) | `raw/blocked-retailers-R4.md`, `-R5`, `-R10` | No tier change |
| OC21 | Read the court dockets for Back Market (a suit filed 2026-09-15) and Misfits Market (FLSA suits) | [raw/blocked-retailers-R3.md](raw/blocked-retailers-R3.md) | These are private suits. They count only if a court has ruled against the company. |
| OC22 | See whether Fair Trade USA's partner directory works without a login | [raw/blocked-assess-F.md](raw/blocked-assess-F.md) | May add to `sites/fairtradecertified-org.md` |
| OC23 | Read the #ShopCoop list (an embedded Airtable) on usworker.coop | [raw/blocked-assess-F.md](raw/blocked-assess-F.md) | Retailers added to `sites/usworker-coop.md` (now 0) and to the tally |
| OC24 | Check whether The Markup's Amazon Brand Detector is still live on the Chrome Web Store | [raw/blocked-assess-G.md](raw/blocked-assess-G.md) | Currency score for `sites/themarkup-org.md` |
| OC25 | Read Going Zero Waste's about page (redirect loop) | [raw/blocked-assess-A.md](raw/blocked-assess-A.md) | Owner and funding; may change its Independence score |
| OC26 | Note the rule breach: the pilot agent fetched rollingstone.com past a bot gate using a browser user agent, then deleted the result unread | [raw/run-log.md](raw/run-log.md) | No data change; the brief now forbids it (section 9, Access) |
| OC27 | Check which Fair Trade USA producer and supplier tiles sell to shoppers (K10) | [raw/calibration.md](raw/calibration.md) | Single-mention tally rows may move to "Also named" |
| OC28 | Decide whether The Markup's intro article states a criticism of Amazon (K3) | [raw/calibration.md](raw/calibration.md) | Adds the `ethical-anti-amazon` tag; no score change |
| OC29 | Confirm that Plaid now sells Arteza (K4 used plaidonline.com) and that Hive rebranded as Love Grown | [raw/calibration.md](raw/calibration.md); [raw/verify-R6.md](raw/verify-R6.md) | Tally names and domains only |
| OC30 | Tag non-US shops left untagged (for example Not On The High Street, Ethical Superstore, People Tree) | [raw/calibration.md](raw/calibration.md) | Reason column only; no score change |
| OC31 | Concerns found through pages that robots.txt disallows (`osha.gov/ords/`, `nlrb.gov/search/`), which pass 1 used. **Decided: keep** (operator, 2026-09-25). Still to do: retry `node research/fetch-osha-dol.mjs name "<establishment>"` to find each inspection in DOL's API by name and date, then swap the `source` links. The number lookup failed and the API returned HTTP 429 | [raw/run-log.md](raw/run-log.md) | Keeping them changes nothing. Dropping them removes 18 concerns from 9 retailers and changes 8 tiers: Avocado and Bob's Red Mill to recommended; Azure Standard, Barnes & Noble, B&H, Chewy, ThredUp and Thrive Market to acceptable; Costco stays caution |
