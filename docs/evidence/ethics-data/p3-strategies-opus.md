# p3: strategies to make ethics ratings findable and usable (Opus)
Status: closed (strategy draft; owner decides)

Outside facts were read on 2026-11-11 with URLs given. "Seen in the p1 files" means `p1-raters.md`, `p1-scorecards.md` or `p1-epa-and-survey.md` in this folder. Counts come from `shop-domains.tsv` (2,182 results, 619 websites). "Mine" marks my judgment; "estimate" marks a number I did not measure.

## Answer first

- **The premise holds for national chains, holds in part for brands selling direct, and fails for small local shops.** Chain data exists but almost none can be shown today; most local shops have no record a domain join can reach.
- **Part of the gap is the unit, not the data.** Raters grade brands and products; the site ranks shops. In an independent hardware shop the ethical choice happens at the product label.
- **First three, in order:** S1 (say plainly what is not known), S2 (a "what to look for" panel per product type), S3 (links to established raters, no scores copied).

---

## Part 1: is the gap a data problem?

### How I classified the top 60 websites (876 results, 40% of all)

| Kind (mine) | Websites | Results | Of those, local | Named in a p1 source | Results on those |
|---|---|---|---|---|---|
| National or regional chain | 25 | 558 | 236 | 16 | 456 |
| Brand selling direct (Lodge, Smithey, Field Company, Corto, Buffalo Games) | 17 | 160 | 10 | 1 (Patagonia) | 13 |
| Independent online shop or marketplace (Geartrade, Lehman's, TrainWorld, eBay) | 11 | 88 | 0 | 1 (eBay, Ethical Consumer) | 12 |
| Small local shop | 7 | 70 | 60 | 0 | 0 |

- 19 of my 25 chains are tagged in `chains.json` (497 results); six are not (Bass Pro Shops, Camping World, IKEA, Sam's Club, McCoy's, tjx.com: 61 results). The rubric's 26% chain share is understated.
- Two of the 16 "named" chains are my parent matches, not p1 facts: Sam's Club to Walmart, HomeGoods to TJX.
- Whole-file estimate by kind: chains about 620 (28%), brands and online shops about 810 (37%), small local shops about 750 (34%). Measured: 773 local results on websites not tagged as chains; 443 results on websites seen once or twice.

### What "named in a p1 source" is worth for chains

| Test | Chains (top 60) |
|---|---|
| A grade exists (TFF, CFS, EPA lists, GSG) | 16 of 25 websites, 456 of 558 results (21% of all 2,182) |
| The site may show the grade today | About none. TFF "All Rights Reserved", CFS states nothing, EPA states non-commercial use, GSG bars commercial reuse except short attributed quotes (seen in the p1 files) |
| A grade covers more than one narrow topic | None. Chemicals, refrigerants, electricity, each alone |

### Verdict by kind

| Kind | Share of gap better data could close (estimate) | What stays unknown however much is gathered | Verdict |
|---|---|---|---|
| Chains (~28%) | 80% or more of chain results could carry some sourced fact: public regulator records (US government works, already accepted sources) plus links to scorecards | Store-level conduct; anything a chain does not disclose; a balanced picture, since public records are mostly penalties and big companies accumulate more of them | **Holds**, but the blocker is reuse rights and one-topic coverage, not existence |
| Brands and online shops (~37%) | 15 to 30% (estimate): certification registries, brand raters (Good On You for fashion; GSG and Ethical Consumer, UK-weighted) | Small makers with no certification or record (Field Company, Fbgcastiron, Lancaster Cast Iron): absence means "small", not "clean". Resellers (TrainWorld) sell other brands, so a shop rating says little about the product | **Holds in part** |
| Small local shops (~34%) | Under 10% (estimate) | Almost everything. Reasons below | **Fails** for shop-level ratings |

Why it fails for local shops:
- **No join key.** `facebook.com` holds 23 results for shops with no website of their own. `truevalue.com`, `doitbest.com` and `acehardware.com` are banner websites over independently owned stores, so a domain join would hand one store's record to every dealer.
- **Absence is silence.** A small shop missing from OSHA or Wage and Hour records was most likely never inspected. That is not evidence of good conduct.
- **No raters.** 0 of the 7 top-60 local websites appear in any p1 source; the two possible exceptions (Green America, local alliances) are memberships, not grades (seen in the p1 files).

What should change for local shops (mine): show what is truly knowable (ownership, what they sell, which labels matter on the shelf) and say "not rated" for the rest.

One limit not about data: the site keeps no analytics, so "shopper use" can be measured only by rerunning saved searches, by sessions the owner observes, or by an aggregate counter weighed against the privacy promise on `about.html`.

---

## Part 2: strategies

Each table rates the six rubric tests. Coverage is the share of the 2,182 saved results moved off "unknown", split chains / brands and online / local.

### S1. Say plainly what is not known (no new data)
Replace "Baseline 0.5" with an explicit "Not rated yet" state and count, above the results, how many shops carry any ethics information.

- **On screen:** above the results, "Ethics and environment information found for 2 of 13 shops; the rest are not rated yet." Unrated cards say "Ethics: not rated" in gray. "Why this rank" lists what was checked: "B Corp, Fair Trade, worker co-op, 1% for the Planet, Climate Label lists; 4 regulator actions. None found."
- **Data:** none new. Ranking unchanged.

| Test | Rating |
|---|---|
| Coverage | 0% moved; 100% of results labeled honestly |
| Reuse rights | No outside source |
| Upkeep | Estimate 6 to 10 hours to build; 0 a year; $0 |
| Honesty when missing | Best of all strategies: "not rated" can no longer read as "average" |
| Shopper use | Tells the shopper where to rely on the rank and where not to |
| Risk | Low; the visible gap may cost some trust at first |

- **Month signal:** saved searches show only three states (better, worse, not rated); in 5 observed sessions people can say what "not rated" means.

### S2. "What to look for" panel for the product type (no shop data)
Move the ethics unit from the shop to the product: one short panel per product type naming the labels and guides that matter for that product.

- **On screen:** above the results for "dark chocolate": "Looking for ethical chocolate? Look for these labels: Fairtrade, Rainforest Alliance (each linked to its registry). Rated elsewhere: Green America's chocolate scorecard."
- **Data:** a curated table, product type to 2 to 4 labels and guide links; the normalize call already returns a category (`docs/architecture.md`). Which labels fit each type, and their registry URLs: to be checked. Green America chocolate scorecard: seen in the p1 files (2020).

| Test | Rating |
|---|---|
| Coverage | 0% of shops moved; estimate 60 to 80% of searches get a panel once 30 to 50 product types are curated |
| Reuse rights | Only label names and links; no scores copied |
| Upkeep | Estimate 15 to 25 hours for 40 types; 10 hours a year; $0 |
| Honesty when missing | Product types with no entry show nothing, not a guess |
| Shopper use | High (mine): it is usable in any shop, including the local ones the site cannot rate |
| Risk | Low for shops (names none). Naming a weak label; list only third-party certified labels with a public registry |

- **Month signal:** share of saved searches with a panel; which unmapped categories recur (add those next).

### S3. "Rated elsewhere" links (link out, no scores copied)
For each result whose company or parent appears in an established rating, show the rater, the topic and the year as a link, never the grade.

- **On screen:** on a Target card: "Rated elsewhere: chemicals in products (Toxic-Free Future, 2024) · store refrigerants (Climate Friendly Supermarkets, 2026) · green power use (EPA, 2024)." On a Patagonia card: "Good On You · Good Shopping Guide." Each opens the rater's own page.
- **Data:** a hand-built list of which companies each rater covers, with page URLs. TFF retailer pages, CFS scorecard, EPA lists, ASPCA, Greenpeace, Fair Food Program: seen in the p1 files. Good On You brand pages follow `https://directory.goodonyou.eco/brand/<name>` and GSG pages `https://thegoodshoppingguide.com/brand-directory/<name>/`: seen only in search results (2026-11-11), page not read; to be checked.

| Test | Rating |
|---|---|
| Coverage | Chains: 456 results (21% of all) get at least one link; brands: estimate 2 to 5% (fashion and outdoor brands); local: 0% |
| Reuse rights | A link and the fact "this rater covers this company" copy no score. Good On You bars bots, so build the list by hand. Before ever showing a grade letter, owner checks whether it counts as fair quotation |
| Upkeep | Estimate 8 to 12 hours to start; 6 hours a year (most raters publish every 1 to 2 years); $0 |
| Honesty when missing | No link shown means "no rater we know of", stated in "Why this rank" |
| Shopper use | Medium: one click from the product search to a real rating, the most direct answer to the owner's goal |
| Risk | Low. A wrong link (wrong company) is the main error; dispute link covers it |

- **Month signal:** links verified on all 16 rated chains; in observed sessions, whether people open a link and can say what it rated.

### S4. Show the parent company and carry its record
Add an "Owned by" line from an open source, and let parent-level certifications, findings and S3 links apply at reduced weight (the "related" weight of 0.5 already exists in `docs/ranking.md`).

- **On screen:** "Sam's Club · Owned by Walmart Inc." with Walmart's findings listed as "parent company". "Ghirardelli · Owned by Lindt & Sprüngli."
- **Data:** Wikidata "parent organization" and "owned by" fields, "released into the public domain under Creative Commons Zero" (https://www.wikidata.org/wiki/Wikidata:Licensing, read 2026-11-11). Violation Tracker links penalties to over 3,000 parents per a search-result summary only; its pages returned 403 and parent histories may need a subscription: operator to open https://violationtracker.goodjobsfirst.org/pages/user-guide.

| Test | Rating |
|---|---|
| Coverage | Chains: estimate +5% of all results get data they lack today (Sam's Club, HomeGoods, tjx.com, Cabela's, Pottery Barn, The North Face); brands: estimate 2 to 4% (Ghirardelli, Smartwool); local: 0% |
| Reuse rights | Wikidata CC0, confirmed. Violation Tracker terms: to be checked |
| Upkeep | Estimate 8 hours to start; 4 hours a year; $0 |
| Honesty when missing | "Owner not known" shown only in "Why this rank", not on the card |
| Shopper use | Medium: many people do not know who owns a store, and the fact needs no interpretation |
| Risk | Medium-low: a stale ownership (sold company) misassigns a record; show the Wikidata check date |

- **Month signal:** ownership line correct on a hand check of the top 100 websites.

### S5. Public-records sweep for chains and their parents
Extend the four curated findings to every chain and parent in the saved searches, from the accepted regulator sources, within a fixed lookback.

- **On screen:** today's finding line in "Why this rank" (kind, source's own title, date, link, "Dispute this"), on many more chains.
- **Data:** accepted sources in `data/negative-sources.md`. CPSC has a recalls API giving "machine readable access to publicly available recall information" (https://www.cpsc.gov/Recalls/CPSC-Recalls-Application-Program-Interface-API-Information, read 2026-11-11); whether it names firms and retailers, and DOL bulk data: to be checked.

| Test | Rating |
|---|---|
| Coverage | Chains: estimate 60 to 90% of chain results (17 to 26% of all) get at least one finding; brands: estimate under 5% (recalls); local: under 2%, by address only |
| Reuse rights | Federal releases are US government works (the site already relies on this); Violation Tracker to be checked |
| Upkeep | Estimate 25 to 40 hours to start for about 45 companies; 15 hours a year; $0 |
| Honesty when missing | Weak for small shops: "no finding" for a small shop means "never inspected" and must be labeled so |
| Shopper use | Medium; says what went wrong, not who does well |
| Risk | High (mine): big companies collect more records by size alone, so chains sink below unrated shops partly for scale. ADR 0006 chose no size factor; revisit before a sweep. A misattributed finding is a false statement about a business; owner should check exposure and keep the accepted-source and own-title rules |

- **Month signal:** on the saved searches, how often a chain drops below an unrated shop because of findings alone; dispute count.

### S6. Certification registry sweep for brands
Check every website in `shop-domains.tsv` against registries that publish member lists, with the model proposing matches and the owner confirming each one.

- **On screen:** the existing certification badges, on far more brand cards.
- **Data:** registries already used (B Corp, 1% for the Planet, Climate Label, Fair Trade, worker co-ops) plus candidates such as Leaping Bunny and FSC: to be checked. B Lab's data.world dataset is gone: the community "officially retired on July 13, 2026" and datasets "are no longer accessible or available for download" (https://data.world/blab/b-corp-impact-data, read 2026-11-11), so B Corp checks are one company at a time.

| Test | Rating |
|---|---|
| Coverage | Brands: estimate 10 to 25% of brand and online results; chains: under 2%; local: under 2% (co-ops). Run the match on the top 200 websites to replace this estimate |
| Reuse rights | Per registry; most publish member names for lookup; each to be checked |
| Upkeep | Estimate 15 to 25 hours for the top 200 websites; 10 hours a year; $0 |
| Honesty when missing | Uncertified brands stay "not rated", not "uncertified = bad" |
| Shopper use | Medium; certifications are the signal shoppers already recognize |
| Risk | Low per match if each is confirmed on the registry page; lapsed certifications need the check date shown |

- **Month signal:** share of top-200 brand websites with one or more confirmed certifications.

### S7. Ownership facts for local shops
For local shops, show facts about who owns them instead of an ethics score: "Not a national chain", "Independently owned store under the Ace banner", "Member-owned co-op".

- **On screen:** a neutral, unscored line where the chain badge would sit: "Not on our list of national chains (10 or more US stores)", or "Independently owned; Ace Hardware dealer".
- **Data:** `chains.json` (already held, its "dealer-owned" note exists); co-op and local alliance directories (61 alliances, seen in the p1 files; whether each publishes a member list: to be checked).

| Test | Rating |
|---|---|
| Coverage | Local: an ownership line on about 750 results (34%); ethics stays unknown. Chains, brands: 0% new |
| Reuse rights | Own list; directories to be checked |
| Upkeep | Estimate 4 hours for the line; 10 to 20 hours for directories; 5 hours a year |
| Honesty when missing | Must say "not on our list", never "independent", because a 5-store regional chain also passes |
| Shopper use | Medium (mine): many shoppers use local ownership as their own ethics test |
| Risk | Low if worded as absence from a list; implies small = good, which the owner should decide to allow or not |

- **Month signal:** hand check of 50 local results for wrongly labeled regional chains.

### S8. Secondhand, rental and repair badge (unconventional)
Let the existing classification call also mark shops that sell used, refurbished, rental or repair, and show a badge; buying used is the plainest environmental choice a shopper has (mine).

- **On screen:** "Secondhand" badge on Geartrade; an optional "Include used and refurbished" checkbox adding one "used <product>" query.
- **Data:** the model's reading of the shop's own listing, shown unscored and labeled "Model judgment". ADR 0004 bars a shop's own page as evidence of its virtue; "sells used goods" is a fact about stock, but the owner decides whether that line holds.

| Test | Rating |
|---|---|
| Coverage | Estimate 2 to 5% of results (Geartrade, resale shops), mostly online; local resale shops too |
| Reuse rights | None needed |
| Upkeep | Estimate 6 hours; a few output tokens per search; the checkbox adds one Brave call ($0.005) when ticked |
| Honesty when missing | No badge means nothing; it is not a rating |
| Shopper use | High for the few it reaches |
| Risk | Medium: misclassified new-goods shops; keep it unscored |

- **Month signal:** precision of the badge on a graded sample of 50.

### S9. Opt-in "Look for certified sellers" search wording (no new data)
A checkbox that adds a query such as "fair trade <product>" or "B Corp <product>", so the search itself reaches shops the curated lists already know.

- **On screen:** under the search box, "Look harder for certified sellers (one extra search)".
- **Data:** none new; the normalize call already writes the queries.

| Test | Rating |
|---|---|
| Coverage | Estimate: a few points above today's 11% off default, mostly brands; unmeasured |
| Reuse rights | None needed |
| Upkeep | Estimate 6 hours plus an A/B run; one Brave call ($0.005, about 25% more per search) when ticked |
| Honesty when missing | Unchanged |
| Shopper use | Medium; gives the shopper a lever |
| Risk | Medium: pulls in greenwashing pages and editorial lists |

- **Month signal:** A/B on saved searches: share of results with a certification, and precision.

### S10. Evidence inbox from shops and shoppers (risky)
"Know a source about this shop?" and "Is this your shop?" forms; the owner verifies each submitted registry link or record before it shows.

- **On screen:** a link in "Why this rank". Risky variant B: unverifiable self-statements ("we pay a living wage") quoted, labeled "The shop says, not checked", unscored. B reverses ADR 0004's no-self-vouching rule.
- **Data:** submissions, checked against the registry or an accepted source.

| Test | Rating |
|---|---|
| Coverage | Starts near 0%; the only strategy that can reach local shops at scale, if shops come |
| Reuse rights | Submitter's own words; terms needed on the form (owner to check) |
| Upkeep | Estimate 6 hours to start; review load unknown and open-ended; $0 |
| Honesty when missing | Unchanged |
| Shopper use | Indirect |
| Risk | High for variant B: amplifies greenwashing, and favors shops that know to write in. Spam |

- **Month signal:** submissions received, share verifiable.

---

## What I would do first, as one person

| Order | Strategy | Why first |
|---|---|---|
| 1 | S1 Say what is not known | 6 to 10 hours (estimate), no data, and every later strategy needs a "not rated" state beside it |
| 2 | S2 "What to look for" panel | The one way to give ethics guidance on every search, including the 34% local share no data will rate |
| 3 | S3 Rated-elsewhere links | Puts established ratings one click from 21% of results without copying a score |

Next: S4 (cheap, open data, feeds S3 and S5), then S6.

Would not do now:
- **S5 at full breadth**, until the size question in ADR 0006 is revisited.
- **S10 variant B**: it makes the site a carrier of unchecked claims.
- **Scoring S7 or S8**: facts worth showing, not measures of conduct.
- **Copying any rater's grades** without written permission (seen in the p1 files).

## Headline wording under S1 to S3 (owner chooses)

Today: "Find who sells it near you or online, ranked by how they treat people and the planet, never Amazon." With 89% of results unrated, "ranked by" overstates (mine).

| Option | Wording |
|---|---|
| H1, closest to today | Find who sells it near you or online, never Amazon, ranked by what is known about how they treat people and the planet. |
| H2, names the gap | Find who sells it near you or online, never Amazon. We show what is known about how each treats people and the planet, and say when nothing is. |
| H3, product-first | Find who sells it near you or online, never Amazon, with what to look for and who rates them on people and the planet. |
| H4, keep and qualify | Keep today's line, with one line under it: "Most shops are not rated yet. Here is what we check." |
