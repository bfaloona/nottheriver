---
name: Poshmark
domain: poshmark.com
type: marketplace
goods: [secondhand clothing, clothing, shoes, accessories, home goods, electronics, beauty]
ownership: unknown
parent: Naver Corporation
hq: Redwood City, CA
marketplace: true
sells_on_amazon: unknown
amazon_owned: false
certifications: []
concerns: []
ethics: 0.5
environment: 0.5
tier: acceptable
mentions: 3
mentioned_by: [adayinourshoes-com, goodgoodgood-co, moneypantry-com]
checked: 2026-09-25
---

Poshmark is a peer-to-peer resale marketplace: its about page calls it "a leading fashion resale marketplace powered by a vibrant, highly-engaged community of buyers and sellers", with 10,000+ brands across 90+ categories (fashion, home, electronics, pets, beauty) in the US and Canada, and says resale is "shaping a more sustainable future for fashion". Wikipedia says it is headquartered in Redwood City, California, went public on Nasdaq in January 2021, and was acquired by South Korea's Naver Corporation in January 2023 for US$1.2 billion. `ownership` is `unknown`: no fetched source says whether Naver Corporation is publicly traded. Lists recommend it as a secondhand clothing platform (A Day in Our Shoes, Good Good Good) and for "deals up to 70% off" (MoneyPantry).

Not scored, but on record: NLRB case search for "Poshmark" returned no cases. CourtListener's search page returned 403 and the one opinion page fetched (Reichman v. Poshmark, Inc.) returned no readable content, so no court record was read. Good Jobs First Violation Tracker returned 403. FTC and DOJ search pages returned 404 or 403, and this session's web search budget ran out before a news search.

Second pass (2026-09-25): the FTC cases and proceedings search returned no results for "Poshmark" or for the parent "Naver"; the CourtListener agency-docket query since 2016 returned no dockets; the ProPublica search for "Poshmark" returned no articles. No matching cases, so no concern rows were added.

## Rating
- Ethics: 0.5 baseline. No verified certification (B Corp directory returned 403; no row in data/certifications.json). No accepted concern. = 0.5
- Environment: 0.5 baseline. Poshmark's resale sustainability claim is self-reported, not a certifier listing. Not on The Climate Label directory page (explore.changeclimate.org). 1% for the Planet directory could not be searched (logged). = 0.5
- Total 1.0, not Amazon-owned: tier `acceptable`.
- Concern search partial: pass 2 checked FTC cases, CourtListener agency dockets since 2016 and ProPublica; no general news search, and DOJ, SEC and Violation Tracker were unreachable; tier is provisional.
- Blocklist: `node research/build-index.mjs --blocklist "Poshmark" poshmark.com` returned "not on the blocklist".

## Sources
- https://poshmark.com/about
- https://en.wikipedia.org/wiki/Poshmark
- https://www.nlrb.gov/search/case/Poshmark
- https://www.courtlistener.com/opinion/7326812/reichman-v-poshmark-inc/ (fetched; no readable content)
- https://explore.changeclimate.org/
- https://www.ftc.gov/legal-library/browse/cases-proceedings?search=Poshmark
- https://www.ftc.gov/legal-library/browse/cases-proceedings?search=Naver
- https://www.courtlistener.com/api/rest/v4/search/?type=r&order_by=dateFiled+desc&filed_after=2016-01-01&q=caseName%3A(%22Poshmark%22)%20AND%20caseName%3A(%22Equal%20Employment%22%20OR%20%22EEOC%22%20OR%20%22Secretary%20of%20Labor%22%20OR%20%22Department%20of%20Labor%22%20OR%20%22Federal%20Trade%20Commission%22%20OR%20%22United%20States%22%20OR%20%22State%20of%22%20OR%20%22People%20of%22%20OR%20%22Commonwealth%22%20OR%20%22National%20Labor%20Relations%22%20OR%20%22Environmental%20Protection%22%20OR%20%22Consumer%20Product%20Safety%22%20OR%20%22Securities%20and%20Exchange%22%20OR%20%22Attorney%20General%22%20OR%20%22District%20of%20Columbia%22) (pass 2 agency-docket query)
- https://www.propublica.org/search?qss=%22Poshmark%22
