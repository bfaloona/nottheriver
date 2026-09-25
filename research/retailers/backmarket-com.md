---
name: Back Market
domain: backmarket.com
type: marketplace
goods: [refurbished electronics, phones, computers, tablets, game consoles]
ownership: unknown
parent: none
hq: unknown
marketplace: true
sells_on_amazon: unknown
amazon_owned: false
certifications: []
concerns: []
ethics: 0.5
environment: 0.5
tier: acceptable
mentions: 4
mentioned_by: [goodgoodgood-co, sustainablejungle-com, thegoodtrade-com, vstyleblog-com]
checked: 2026-09-25
---

Back Market describes itself as "the world's largest pure-play premium refurbished tech marketplace", connecting buyers with verified sellers and refurbishing professionals, so it hosts third-party sellers. It says it was "Founded in Paris in 2014" and has "raised over $1 billion" from investors including Eurazeo, General Atlantic, Goldman Sachs and Generation Investment Management (its about page). It sells refurbished phones, laptops, tablets and game consoles. The page does not state its ownership structure or current headquarters, so `ownership` and `hq` are `unknown`.

The list sites name it for refurbished tech and e-waste: "rigorous vetting program" (goodgoodgood-co), "Refurbished electronics with a quality guarantee" (sustainablejungle-com), "1-year warranty, free returns" (thegoodtrade-com), and "reduces e-waste" (vstyleblog-com). Three of them call it a B Corp, and its own about page says it is "a certified B-Corp" and shows a B Corp score of 93 as an image. That claim could not be verified: the B Lab directory (bcorporation.net) returned HTTP 403, and `data/certifications.json` has no backmarket.com row, so per brief section 9 it is not counted. The about page also shows, as an image, a figure of 2 million for "Metric tons of CO2e prevented"; not verified.

Concern search was limited: the session's WebSearch budget ran out before this retailer, and the ftc.gov, justice.gov, nlrb.gov and npr.org site searches did not return filtered results (inconclusive). The CourtListener search API worked and returned three federal cases naming Back Market Inc.: two 2022 suits filed under "Americans with Disabilities - Other" (one against Back Market Inc, S.D.N.Y.; one against Back Market Inc., E.D.N.Y.) and a suit by an individual against Back Market Inc. (N.D. Cal., filed 2026-09-15; nature not shown, docket page blocked). None is a labor, governance or environmental finding, so none is recorded as a concern.

Second pass (2026-09-25): FTC cases search for "Back Market" returned 565 keyword matches; sorted by relevance, the top 20 (Backcountry.com, Whole Foods Market and similar) include no Back Market respondent. The CourtListener agency-docket query for "Back Market" since 2016 returned no dockets; ProPublica's 48 hits for the phrase include none about the company. No matching cases.

## Rating
- Blocklist: `node research/build-index.mjs --blocklist "Back Market" backmarket.com` returned "not on the blocklist".
- Certifications: B Corp claimed but unverified (certifier directory blocked, no fallback row); none counted.
- Ethics: 0.5 baseline, no counted certifications or accepted concerns.
- Environment: 0.5 baseline, no counted certifications or accepted concerns.
- Tier: ethics + environment = 1.0, so `acceptable` (below the 1.25 needed for `recommended`). A verified B Corp listing would raise ethics to 0.75 and the tier to `recommended`.
- Concern search partial: pass 2 checked FTC cases, CourtListener agency dockets since 2016 and ProPublica; no general news search, and DOJ, SEC and Violation Tracker were unreachable; tier is provisional.

## Sources
- https://www.backmarket.com/en-us/about-us
- https://www.bcorporation.net/en-us/find-a-b-corp/company/back-market/ (HTTP 403, no claim made from it)
- https://www.courtlistener.com/api/rest/v4/search/?q=%22Back+Market+Inc%22&type=r
- research/sites/goodgoodgood-co.md, sustainablejungle-com.md, thegoodtrade-com.md, vstyleblog-com.md (reasons)
- data/blocklist.md (checked: no match)
- https://www.ftc.gov/legal-library/browse/cases-proceedings?search=Back%20Market
- https://www.ftc.gov/legal-library/browse/cases-proceedings?search=Back%20Market&sort_by=search_api_relevance
- https://www.courtlistener.com/api/rest/v4/search/?type=r&order_by=dateFiled+desc&filed_after=2016-01-01&q=caseName%3A(%22Back%20Market%22)%20AND%20caseName%3A(%22Equal%20Employment%22%20OR%20%22EEOC%22%20OR%20%22Secretary%20of%20Labor%22%20OR%20%22Department%20of%20Labor%22%20OR%20%22Federal%20Trade%20Commission%22%20OR%20%22United%20States%22%20OR%20%22State%20of%22%20OR%20%22People%20of%22%20OR%20%22Commonwealth%22%20OR%20%22National%20Labor%20Relations%22%20OR%20%22Environmental%20Protection%22%20OR%20%22Consumer%20Product%20Safety%22%20OR%20%22Securities%20and%20Exchange%22%20OR%20%22Attorney%20General%22%20OR%20%22District%20of%20Columbia%22) (pass 2 agency-docket query)
- https://www.propublica.org/search?qss=%22Back%20Market%22
