# Calibration of research/sites (brief section 7 step 3)

Calibrator run 2026-09-25 over the 26 files in `research/sites/`, written by eight assessors. Rules K1 to K5 are the lead's decisions (they override R1 where they differ); K6 to K10 were added by the calibrator to apply them uniformly. Each file's prose was kept; where a score part changed, its "## Score" line says why.

## Rules applied

- **K1. What counts as a retailer.** "## Retailers named" holds only places where a US shopper can buy goods: retailers, marketplaces, co-ops, secondhand shops, brands selling direct, grocers. Non-US shops stay and are tagged in Reason. Everything else moves to "## Also named (not counted)" just after it, same columns: services for selling your own things, free-exchange networks, non-shops (banks, streaming, library or reading apps, free archives, software, search engines, Wikipedia, media outlets), trade associations, directories and other list sites, boycott targets. `retailers_listed` is the number of rows left in "Retailers named". Rows in both sections keep their original page-order numbers, so a reader can map a row back to the assessor's count. Substance scores are not changed by the move: R1 already priced non-shops into Substance; only the counts in the Substance reason lines are restated.
- **K2. Amazon-owned deduction under both Substance and No dark patterns** (a named exception to R7). A page's link to Amazon itself counts; links that are the object of a tool's analysis (The Markup) do not. Links to the site's own Amazon-deal articles are not links to Amazon: they stay a No-dark-patterns matter only. Scale used for Substance: −2 per distinct Amazon-owned company offered as a pick (Amazon itself counts as one company), −1 for a link to Amazon that is not a pick. The existing No-dark-patterns values already deducted for these and were left as they are. `amazon_owned_recommended` entries are written as name plus where the page links.
- **K3. `ethical-anti-amazon` as an `also` tag.** Added to a page of another category only when the page itself states reasons against Amazon (labor, monopoly, surveillance, environment), not merely because it links news. Pages categorized `ethical-anti-bigbox` already carry that argument in their category and don't get the tag.
- **K4. One domain per retailer.** Use the current domain after a redirect; registrable domain only.
- **K5. Like with like.** Articles compared with articles, tools with tools; where two files scored the same kind of evidence differently, the outlier was aligned to the other and the pair is named in the reason.
- **K6. Buying versus selling roles.** A general marketplace where buying is the main use (Etsy, eBay, OfferUp, Bonanza, eBid, Facebook Marketplace, Walmart) stays in "Retailers named" however the page frames it. A buyback, trade-in or seller platform (Gazelle, Decluttr, BookScouter, Buyback Boss, Shopify, WooCommerce, BigCommerce, Google for Retail, Zibbet, Walmart Marketplace) moves when the page offers it for selling. Gazelle stays in sustainablejungle-com because that page recommends it for buying refurbished devices.
- **K7. `affiliate-funnel` as an `also` tag.** Only when the page has a Partner or sponsor label, a discount or referral code, undisclosed affiliate links, or a repeated top pick. Heavy but disclosed affiliate links alone (techradar, vstyleblog, pcworld's category aside, dollarsprout) don't earn the tag. The existing tags already followed this; no change.
- **K8. Rentals, subscriptions, closed shops.** Rental services (Rent the Runway, LensRentals), subscription reading or listening services (Scribd, Storytel, Spotify), a procurement marketplace open only to governments and schools (GLASS Commerce), a cashback portal (Rakuten), and a marketplace whose domain now serves unrelated content (DoneGood; see `sites/donegood-co.md`) move to "Also named", tagged. Stores that sell digital goods to keep (Libro.fm, Kobo, Smashwords, Apple Books, Google Play Books, Mirlo, Subvert) stay.
- **K9. Hive is two companies.** hive.co.uk (UK bookseller; antifamarketer, techradar, thegoodtrade) and the US grocery whose links land on lovegrown.com (goingzerowaste, goodgoodgood, vstyleblog; all three files agree, so K4 holds) are different retailers. The lovegrown.com rows named plain "Hive" (goodgoodgood, vstyleblog) are renamed "Hive (US grocery)" so the tally's names column tells them apart; goingzerowaste already calls it "Hive Grocery".
- **K10. What was not settled.** Fair Trade USA's brand tiles include producers and suppliers (for example Dole, Fyffes, Driscoll's, Windset Farms, Mother Parkers, Gallant International) that may not sell to shoppers directly. Checking each needs a fetch per brand, which this step does not do, so they stay in "Retailers named"; only Ahold Delhaize, whose tile links a corporate holding site, moved. The retailer stage should treat single-mention fairtradecertified brands with care.

## Change table

| file | field | old | new | reason |
|---|---|---|---|---|
| adayinourshoes-com | Retailers named | 21 rows | 19 rows | K1: Freecycle, Buy Nothing (free-exchange networks) moved to Also named |
| adayinourshoes-com | retailers_listed | 21 | 19 | K1 |
| amazonalts-org | Retailers named | 29 rows | 27 rows | K8: Rent the Runway (rental); K1: Official Black Wall Street (directory app) moved to Also named |
| amazonalts-org | retailers_listed | 29 | 27 | K1, K8 |
| amazonalts-org | score_parts.currency | 2 | 4 | K5: aligned with greenamerica-org (4), the other undated list whose text dates to about 2020-22 with partly lapsed links; amazonalts is the newer of the two |
| amazonalts-org | score | 55 | 57 | sum of parts |
| antifamarketer-org | Retailers named | 42 rows | 12 rows | K1: 15 streaming services, 2 audiobook software tools, 3 library apps, 3 free ebook sources (Anna's Archive, Freeditorial, Project Gutenberg), 5 reading apps, Rotten Tomatoes, Wikipedia moved to Also named |
| antifamarketer-org | retailers_listed | 42 | 12 | K1 |
| buycott-com | score_parts.substance | 6 | 3 | K5: aligned with themarkup-org (3); both tools name no alternatives and only flag what to avoid |
| buycott-com | score | 49 | 46 | sum of parts |
| dollarsprout-com | Retailers named | 16 rows | 12 rows | K6: Buyback Boss, BookScouter, Gazelle, Shopify (selling services) moved; OfferUp and Etsy stay as marketplaces |
| dollarsprout-com | retailers_listed | 16 | 12 | K1, K6 |
| fairtradecertified-org | Retailers named | 87 rows | 86 rows | K1: Ahold Delhaize (tile links a corporate holding site) moved |
| fairtradecertified-org | retailers_listed | 87 | 86 | K1 |
| gobankingrates-com | score_parts.currency | 3 | 4 | K5: aligned with techradar-com (4); both pandemic-era with no later update, and gobankingrates is the newer page |
| gobankingrates-com | score | 39 | 40 | sum of parts |
| goingzerowaste-com | Retailers named | 23 rows | 22 rows | K1: CSA (links the USDA local food directory) moved |
| goingzerowaste-com | retailers_listed | 23 | 22 | K1 |
| goodgoodgood-co | Retailers named | 50 rows | 49 rows | K8: DoneGood (domain now an unrelated climate publication, per sites/donegood-co.md) moved |
| goodgoodgood-co | retailers_listed | 50 | 49 | K1, K8 |
| greenamerica-org | Retailers named | 34 rows | 31 rows | K1: Washington Gardener Magazine, CSRWire, The Organic & Non-GMO Report (media outlets) moved |
| greenamerica-org | retailers_listed | 34 | 31 | K1 |
| ilsr-org | Retailers named | 40 rows | 24 rows | K1: 14 alliances, programs, trade associations and directories moved; K8: GLASS Commerce (government and school procurement), LensRentals.com (rental) moved |
| ilsr-org | retailers_listed | 40 | 24 | K1, K8 |
| ilsr-org | score_parts.evidence | 9 | 7 | K5: aligned with vstyleblog-com (7): well-sourced case against Amazon, per-retailer certification claims that don't reach a certifier's listing |
| ilsr-org | score | 80 | 78 | sum of parts |
| local-first-org | score_parts.currency | 10 | 12 | K5: aligned with ilsr-org (12), dated two weeks later; the age of the reports a page cites is not part of Currency |
| local-first-org | score | 45 | 47 | sum of parts |
| moneypantry-com | Retailers named | 27 rows | 17 rows | K8: Rakuten (cashback portal); K6: Walmart Marketplace, Gazelle, Google for Retail, Decluttr, Zibbet, Shopify, BookScouter, WooCommerce, BigCommerce moved; Etsy, Bonanza, eBid stay as marketplaces |
| moneypantry-com | retailers_listed | 27 | 17 | K1, K6, K8 |
| sustainablejungle-com | Retailers named | 47 rows | 39 rows | K8: DoneGood (closed), Scribd, Storytel (subscription services); K1: Libby, Hoopla (library apps), Project Gutenberg, LibriVox, Internet Archive (free archives) moved |
| sustainablejungle-com | retailers_listed | 47 | 39 | K1, K8 |
| thegoodtrade-com | Retailers named | 19 rows | 17 rows | K1: The Buy Nothing Project, Freegle (free-exchange networks) moved |
| thegoodtrade-com | retailers_listed | 19 | 17 | K1 |
| vstyleblog-com | Retailers named | 20 rows | 18 rows | K1: Libby (library app); K8: Spotify (subscription streaming) moved |
| vstyleblog-com | retailers_listed | 20 | 18 | K1, K8 |
| workerowned-info | Retailers named | 29 rows | 21 rows | K1: 8 news, podcast and streaming outlets moved; Mirlo, Subvert, Catalytic Sound stay (they sell music) |
| workerowned-info | retailers_listed | 29 | 21 | K1 |
| fairtradecertified-org | score_parts.substance | 11 | 7 | K2: −2 each for Amazon and Whole Foods Market, the two Amazon-owned companies it offers (its No dark patterns 1/10 already counts the same links) |
| fairtradecertified-org | score | 56 | 52 | sum of parts |
| moneypantry-com | amazon_owned_recommended | [zappos.com] | ["Zappos (links to zappos.com)"] | K2 entry format; Substance and No dark patterns already both deducted for Zappos, so no score change |
| pcworld-com | score_parts.substance | 9 | 8 | K2: −1 for a link to Amazon that is not a pick |
| pcworld-com | score | 43 | 42 | sum of parts |
| pcworld-com | amazon_owned_recommended | [Amazon] | ["Amazon (affiliate-tagged link to an amazon.com listing, shown sold out)"] | K2 entry format |
| techradar-com | score_parts.substance | 11 | 9 | K2: −2 for offering Amazon-owned AbeBooks as a pick |
| techradar-com | score | 48 | 46 | sum of parts |
| techradar-com | amazon_owned_recommended | [AbeBooks] | ["AbeBooks (named without a link; abebooks.com)"] | K2 entry format |
| thegoodtrade-com | also | [affiliate-funnel] | [ethical-anti-amazon, affiliate-funnel] | K3: the article opens with its own reasons to leave Amazon (packaging waste, delivery emissions, worker injury rates), like goingzerowaste, goodgoodgood and sustainablejungle, which carry the tag |
| goodgoodgood-co | Retailers named, row 3 name | Hive | Hive (US grocery) | K9: tells the lovegrown.com Hive apart from hive.co.uk in the tally |
| vstyleblog-com | Retailers named, row 13 name | Hive | Hive (US grocery) | K9 |
| makeitworkcrafts-com | Retailers named, row 21 domain | arteza.com | plaidonline.com | K4: the page's arteza.com link now lands on plaidonline.com (per the assessor's plain-curl check) |

## Result

- 20 of 26 site files changed; 90 rows moved from "Retailers named" to "Also named (not counted)" across 14 files. `node research/build-index.mjs` passes (26 sites); `--tally` gives 313 retailer domains (was 390).
- Categories (unchanged by calibration): ethical-affirmative 6, ethical-anti-amazon 6, tool 7, ethical-anti-bigbox 3, clickbait 3, affiliate-funnel 1.
- Top scores after calibration: ilsr-org 78, thegoodtrade-com 74, indiebound-org 73, goodgoodgood-co 72, workerowned-info 69.
- Tally top 60 checked: every domain is a place to buy goods. Amazon-owned rows (amazon.com, wholefoodsmarket.com, abebooks.com, zappos.com) stay in the tables as the brief requires and are flagged in the tally. facebook.com (Facebook Marketplace) stays as a marketplace (K6). No retailer is split across two domains; hive.co.uk and lovegrown.com are different companies (K9).

## Not settled

- K10 above: Fair Trade USA producer and supplier tiles not checked for direct sales.
- lovegrown.com: three files send "Hive" (US grocery) there, and Love Grown's footer references Hive Brands, but no fetched page confirms a rebrand. The retailer stage should confirm what lovegrown.com sells before rating it as Hive.
- plaidonline.com for Arteza (K4) rests on one assessor's redirect check; whether Plaid now owns or sells Arteza was not checked.
- Non-US shops not tagged by their assessor (for example Not On The High Street, Ethical Superstore, People Tree) were left untagged: tagging them needs a source this step didn't fetch.
- themarkup-org and K3: the file records only what the extension does, not a criticism of Amazon stated on the page, so no `ethical-anti-amazon` tag was added. If the intro article states the "Amazon's Advantage" self-preferencing finding as a criticism, the tag would apply (as it does for indiebound-org).
