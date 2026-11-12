# p3-strategies-fable: making ethics structural in every search
Status: closed (proposals only; nothing built, nothing tested with people)

Outside facts carry a URL and were read 2026-11-11. "Mine" marks my judgment; "estimate" marks my estimate. Counts come from `shop-domains.tsv` (2,182 results, 619 websites).

## Answer first

- **Data alone cannot reach about half the results (mine).** 508 websites outside the top 100 that are not listed chains hold 1,020 results (47%). The rubric found that almost nobody covers small shops; the two possible exceptions are memberships, not grades. For these shops ethics has to live where no shop data is needed: how "unknown" is shown, what the shopper is told about the product type, and who owns the shop.
- **So "this is a data problem" is half right.** It is also a display problem. A shop with nothing on file shows nothing on its row, and "Nothing found" sits inside a closed "Why this rank" panel (`src/render.ts:173`). 89% of rows read like a maps listing.
- **Two biases to design against (mine):** regulator records exist mostly for big companies, and certifications for companies that apply and pay, so an unchecked shop can outrank a checked one. Keep "not checked" visibly different from "checked, nothing found."

## 1. What a shopper needs when choosing (my reasoning; no research behind it)

| # | Question | Answered today? |
|---|---|---|
| Q1 | Has anyone independent vouched for this shop or found against it? | For 11% of results. Silent for the rest |
| Q2 | When the site says nothing, is that fine, bad, or not looked at? | No. The row is blank; the answer is on the About page |
| Q3 | Who gets my money: a chain, a brand, a local owner, a co-op? | Partly: chain badge (26% of results), worker co-op (5 entries), independent retailer association (3) |
| Q4 | For this kind of product, what makes a better choice, and which labels mean something? | No |
| Q5 | Must I buy it new? Is there a used or repair option near me? | No. Resale shops appear by chance (28 results, 1.3%) |
| Q6 | Can I check this myself in a minute? | Partly. Sources are linked where data exists; no path where it does not |
| Q7 | Which shop here is best documented, and what does choosing it cost me in distance? | Partly. The score blends it; the reason is behind a click |

## 2. Strategies

Tags: **[ND]** no new data, **[PT]** built on product type, **[UN]** unconventional (mine). T1 to T6 are the rubric's tests: coverage, reuse rights, upkeep, honesty when data is missing, shopper use, risk. Hours are estimates. The site has no analytics, so no experiment counts clicks. "AS" numbers point to section 5. No strategy breaks a privacy rule.

### ST1. A record line on every row [ND]
Every result says what the site holds on that shop, including when it holds nothing.
- **Screen:** under each shop name, "People and planet:" then one state. (a) Links: "B Corp, 1% for the Planet". (b) "1 concern, 2022", which opens today's box. (c) "Not checked: we hold no record for this shop", linking to what the site checks. Above the list: "2 of 13 shops have a record. The rest are ordered by match and distance." A fourth state, "Checked, nothing found (Oct 2026)", arrives with ST6.
- **Data:** none new; the search answer already carries it.
- **T1:** 0% moved off unknown. Shown on 100% of results.
- **T2:** nothing reused.
- **T3:** 8 to 12 h, then 0 h a year. $0.
- **T4:** its whole purpose. The wording must read as neither fine nor bad.
- **T5:** answers Q2 and Q7 without opening anything.
- **T6:** low. A shopper may read "not checked" as a warning, and small shops carry it most; the count line softens that.
- **Experiment:** re-render saved answers and count rows per state (expect about 89% "not checked"). Show 5 people a blank row and a "not checked" row and ask what each means.

### ST2. Put first what you care about [ND]
The shopper picks the priority; the browser reorders the same results.
- **Screen:** "Sort by" becomes "Put first:" Best overall (today's score), Shops with a good mark (2), Fewest concerns, Closest. With ST4: Independent and co-op shops (5). The number says how many shops the choice can separate.
- **Data:** none new. The choice stays in the tab, like the last product typed.
- **T1:** 0% moved. Control on 100% of searches.
- **T2:** nothing reused.
- **T3:** 6 to 10 h, 0 h a year. $0.
- **T4:** "Good mark (0)" tells the shopper the choice changes nothing.
- **T5:** makes ethics a choice the shopper makes (Q7). Weak until ST4 or ST9 gives it something to sort.
- **T6:** low; no new statement about a shop.
- **Experiment:** on saved answers, count how often each choice changes the top 3. Under 1 search in 5: hold it until ST4.

### ST3. What to look for when buying this [PT]
A curated card per product type above the results: labels that mean something, what to ask, what makes it last.
- **Screen:** a box above "Near you" with three lines, each linked to a source. Invented example of the form, not checked content: "Buying a tent: (1) labels checked by a third party: [label]. (2) Ask the shop: [question]. (3) Lasts longer if: [feature]." No card: "No guide yet for this product type."
- **Data:** hand-written cards keyed to a fixed list of product types. The model returns a free-text category today (`proxy/schemas/normalize.json`); it would choose from the list and write nothing shown, as `docs/ranking.md` requires. Sources: EPA's Recommendations of Specifications, Standards and Ecolabels, "more than 60 private sector standards/ecolabels in more than 40 purchase categories", updated 2026-08-23 (https://www.epa.gov/greenerproducts/recommendations-specifications-standards-and-ecolabels-federal-purchasing; AS1). FTC Green Guides on seals and general claims, current version 2012 (https://www.ftc.gov/news-events/topics/truth-advertising/green-guides). Good On You's scheme list and the scorecard topics: seen in the p1 files, leads only.
- **T1:** 0% moved. Share of searches showing a card: not measured.
- **T2:** cards are the site's own words with links. EPA states non-commercial reuse (p1) and says listing "is not an endorsement"; the owner should check that naming a listed label is acceptable.
- **T3:** about 2 h a card, 40 h for 20; 10 h a year. $0 per search.
- **T4:** works when nothing is known about any shop.
- **T5:** answers Q4; gives the shopper something to check on the shelf.
- **T6:** no statement about a shop. A stale or wrong line about a label; each line needs a source and check date.
- **Experiment:** write cards for the product types in the 20 graded searches (`docs/evidence/quality/eval20-0925`); a second reader marks each line "sourced and useful" or not.

### ST4. Who owns it
Every result states the kind of seller as a fact, not a score.
- **Screen:** a neutral badge extending today's chain badge: "National chain, 2,300 stores", "Dealer-owned", "Brand selling direct", "Marketplace", "Consumer co-op", "Nonprofit reuse shop", "Single shop (checked 2026-11)", or "Ownership not checked". Parent named: "Owned by TJX". Worker co-op stays the scored certification it is.
- **Data:** `data/chains.json` extended by hand to the top 100 websites. Parent names from Wikidata, released under CC0 (https://www.wikidata.org/wiki/Wikidata:Licensing), confirmed on the company's page.
- **T1:** 0% moved off unknown. Ownership stated on 561 results (26%) today, 1,116 (51%) with the top 100 labeled. Not being in `chains.json` does not mean independent; `facebook.com` carries 23 results for shops with no site.
- **T2:** Wikidata CC0 (read). Company pages linked as facts.
- **T3:** 78 websites at about 20 min: 26 h; 10 h a year. $0.
- **T4:** "Ownership not checked" is its own badge.
- **T5:** answers Q3, the ethics question shoppers already know how to use (mine). Feeds ST2.
- **T6:** calling a franchise a chain, or a group-owned shop independent. Dispute link on the badge.
- **Experiment:** label the 78; report the count per kind and how many could not be settled in 20 minutes.

### ST5. Check it yourself
Links that open public record searches and rater directories on the shopper's own click.
- **Screen:** in "Why this rank": "Look this shop up: OSHA inspections, EPA enforcement, Violation Tracker, B Corp directory"; Good On You for clothing brands. Plain links; the page fetches nothing.
- **Data:** URL patterns only (AS4). Violation Tracker: a search summary says searching is free and downloads are paid (https://violationtracker.goodjobsfirst.org/plans, not read by me). Good On You directory: seen in the p1 files.
- **T1:** 0% moved. On 100% of results; useful mostly for chains and brands (mine).
- **T2:** links, no copied content. The owner should check each site's terms on links carrying a search term.
- **T3:** 6 h, 2 h a year. $0.
- **T4:** turns "not checked" into "here is where to check".
- **T5:** answers Q6. Costs effort mid-purchase; few may use it (mine).
- **T6:** a name search can show a different business. Label: "search by name; results may include other businesses".
- **Experiment:** the owner opens each link pattern for 20 shops across the three kinds and records how often the first screen shows the right business.

### ST6. A dated public-record check for chains
Check each chain and its parent against regulator records on a schedule; show "checked, nothing found" as a result of its own.
- **Screen:** ST1 gains a state: "Checked Oct 2026 against OSHA, EPA and FTC records for penalties of $100,000 or more in the last 5 years: none found", or "2 concerns, 2022 to 2024". Opened, it lists what was searched.
- **Data:** regulator releases, as the 4 findings use today. The 5-year window is Ethical Consumer's (seen in the p1 files). Bulk federal data: AS2.
- **T1:** the 344 chain results (16%) with no record today move to a dated state; 217 already have one. Extending to large non-chain sellers in the top 100 (IKEA, Sam's Club, eBay) adds some; small brands rarely have records (mine). Tail: 0.
- **T2:** federal records, linked to the agency's page; the owner should confirm terms per source.
- **T3:** about 1.5 h a chain, 60 h for 41; 30 h a year. $0.
- **T4:** three states kept apart; "none found" names the search so it is not read as a clean bill.
- **T5:** answers Q1 for the shops seen most.
- **T6:** the highest here. A misattributed finding is a false statement about a named business, and "none found" can be wrong. Only big firms get checked, so chains can only lose rank. The owner should get advice on wording.
- **Experiment:** check the 10 chains with the most results (395 results); time it; count findings by band.

### ST7. Graded by others, by topic and by link
When the product type matches a narrow scorecard's topic, say the grade exists and link to it.
- **Screen:** on a chain's row, for matching product types only: "Graded on chemicals in products by Toxic-Free Future, 2024: see the grade". Groceries: "Graded on refrigerants by Climate Friendly Supermarkets, 2026". The grade is shown only with written permission.
- **Data:** scorecards seen in the p1 files; a map from product type to topic (needs ST3's list).
- **T1:** 0% moved off unknown (kept out of the score). Toxic-Free Future touches 13 websites, 398 results (18%); Climate Friendly Supermarkets 4 websites, 136 (6%); fewer once limited to matching products (AS8).
- **T2:** grades may not be copied: "All Rights Reserved" and nothing stated (p1). Whether saying a grade exists and linking is acceptable: the owner should check, and ask both publishers.
- **T3:** 10 h, 5 h a year. $0.
- **T4:** absence means "not graded by this group".
- **T5:** ties a rating to the product in hand (Q1, Q4); one click to see it.
- **T6:** advocacy grades in which silence scores low (p1), and not accepted sources today.
- **Experiment:** email both publishers; count saved searches whose product type matches a topic.

### ST8. Before you buy new [UN]
Rate the purchase, not only the shop: used and repair options first for goods that last.
- **Screen:** for durable product types, a section above "Near you": "Used or repaired, near you", up to 3 places tagged "Sells used", "Repairs" or "Nonprofit reuse shop", then the usual lists. One sourced line of reason.
- **Data:** one more place search ("used" or "repair" plus product type). Resale kind curated per website (Geartrade, a Habitat ReStore and eBay are in saved results); otherwise the tag comes from the listing's store type and says so. A source for "reuse before new": to be checked (likely EPA's waste hierarchy).
- **T1:** 0% moved off unknown. 28 results (1.3%) are resale today; share of searches that would return a used option: not measured.
- **T2:** Brave results, as today.
- **T3:** 12 to 16 h. About $0.005 a search at list price (AS5), from about $0.023 to $0.028.
- **T4:** "No used or repair option found nearby" is a real answer.
- **T5:** answers Q5 with no shop data (mine: not buying new is often the shopper's largest effect).
- **T6:** a wrong "sells used" tag, low harm. Used is wrong advice for some goods (helmets, car seats); the list must exclude them.
- **Experiment:** run the extra query offline for the 20 graded searches; hand-grade whether each place sells used or repairs that kind of thing.

### ST9. Load whole registries, and let the model find claims to verify
Bulk loads matched by website replace hand entry; an offline run reads shop sites for claimed certifications and checks each against the registry.
- **Screen:** nothing new; more rows show ST1's state (a).
- **Data:** B Corp directory (AS3). Worker co-op directory and 1% for the Planet: used by the site already; bulk terms to be checked. Offline only: the model reads each of the 619 websites once and lists claimed certifications, a script confirms each in the registry, the owner approves. Model text is never shown.
- **T1:** unknown until a join is run. Positive marks only, mostly brands (mine).
- **T2:** the deciding test; each registry's terms must be read first.
- **T3:** 20 to 30 h; 10 h a year. Model cost not measured.
- **T4:** no change without ST1.
- **T5:** indirect: more rows with something to say.
- **T6:** wrong match by website; lapsed certifications. Each row needs a check date.
- **Experiment:** for the 78 non-chain top-100 websites, look each up by hand in the B Corp directory; count hits and the results they touch.

### ST10. A page per shop, with the shop's own answers
A static, linkable record page per shop, where the shop can add answers shown as its own and never scored.
- **Screen:** "Full record" on a row opens a page: ownership, certifications, findings, check dates, dispute link, and "In the shop's own words (not verified, not scored)": five fixed questions (who owns it, lowest wage paid, repairs, take-back, where made). A "Shops on record" page lists them by product type and state.
- **Data:** the site's data files. Shop answers, and shoppers' sourced tips, arrive through the GitHub issue path, which needs a GitHub account. Shops submitting data is Good On You's Good Measures idea (seen in the p1 files).
- **T1:** 0% at first. The only way in for most tail shops.
- **T2:** the shop supplies its own words.
- **T3:** 16 h; about 30 min a submission. $0.
- **T4:** "This shop has not answered."
- **T5:** a shopper can look up a shop without a search, which also settles WD4 in `docs/wireframes/README.md` (whether a dispute can start without a search).
- **T6:** someone posing as the shop. `docs/ranking.md` says a shop's page is not evidence about itself; scoring these would reverse that.
- **Experiment:** build pages for shops in the data files; invite 10 tail shops by email; count replies in a month.

## 3. How they combine

| Fits together | Why |
|---|---|
| ST1 + ST6 + ST9 | ST1 is the display; the others fill it |
| ST3 + ST7 + ST8 | All hang on one fixed list of product types |
| ST4 + ST2 | "Independent first" gives ST2 something to sort |
| ST1 + WF3 (evidence wireframe) | ST1 is the small version of WF3's kinds of statement |

| Excludes or strains | Why |
|---|---|
| ST6 without ST1 | Lowers only chains while unchecked shops sit at 0.5 |
| ST7 showing grades without permission | Reuse terms (p1) |
| ST10 scored | Reverses the "not evidence about itself" rule |
| ST2 as the default order | Conflicts with one published formula |
| "Ranked by how they treat people and the planet" | Not true at 11%; ST1 to ST5 do not make it true |

**Sequence for one person; each step is useful alone.**

| Step | Build | Hours (estimate) | In every search |
|---|---|---|---|
| 1 | ST1; ST5 once the owner has tried the links | 15 to 20 | What the site holds on every shop, an honest "not checked", and where to check |
| 2 | Product-type list, ST3 (20 cards), ST8, ST4 (top 100), ST2 | 100 to 120 | A buying guide and a used option where they exist, ownership where checked, and a choice of what comes first |
| 3 | ST6 (10 chains first), ST9; ST7 and ST10 as permissions and replies allow | 80 to 120, then about 50 a year | Dated records for the shops seen most; more certified shops |

## 4. Headline wordings (the owner chooses)

| True after | Wording |
|---|---|
| Step 1 | "Find who sells it near you or online, never Amazon. For every shop we show what we hold on how it treats people and the planet, and say so when we have not checked." |
| Step 2 | "Find who sells it near you or online, never Amazon, with help choosing well: what to look for, used options, who owns the shop where we know, and what we hold on its record." |
| Step 3 | "Find who sells it near you or online, never Amazon. Shops with a checked record on people and the planet are ranked by it; the rest are marked not checked." |

## 5. Assumed and not checked

| # | Assumption |
|---|---|
| AS1 | EPA's table covers consumer product types the site sees (cookware, tents, toys). Its rows did not load; only the totals and date were read |
| AS2 | Federal enforcement data can be downloaded and reused. https://data.dol.gov/ returned an empty page to my fetch |
| AS3 | A bulk B Corp list with websites and an open license exists. https://data.world/blab/b-corp-impact-data says data.world's open data community "officially retired on July 13, 2026" and its datasets are "no longer accessible or available for download"; a search summary said a mirror states CC BY-SA 4.0. If no bulk source exists, ST9 falls back to lookups by hand |
| AS4 | OSHA, EPA ECHO, B Corp and Good On You accept links that carry a shop name. OSHA returned 405, B Corp and Violation Tracker 403 to my fetch; the owner should open them in a browser |
| AS5 | A fifth Brave call (a third place search) fits the cap of 5 and costs $0.005, from list prices in `docs/costs.md`. Its places would add to a local classifier call capped at 20 candidates |
| AS6 | The model can choose from a fixed list of product types as reliably as it writes a free category. Not tested |
| AS7 | Shoppers read "not checked" as neutral, want ownership stated, and will consider used goods. The repo holds no user research and I did none |
| AS8 | Scorecard counts were matched by website name; parent and banner ties (TJX, Albertsons) were not followed |
| AS9 | Nothing here is legal advice. ST6, ST7 and ST9 turn on reuse terms and on statements about named businesses |
