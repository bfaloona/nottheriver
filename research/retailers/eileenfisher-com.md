---
name: Eileen Fisher
domain: eileenfisher.com
type: brand
goods: [clothing]
ownership: private
parent: unknown
hq: Irvington, NY
marketplace: unknown
sells_on_amazon: unknown
amazon_owned: false
certifications:
  - {kind: b_corp, source: "https://www.bcorporation.net/en-us/find-a-b-corp/company/eileen-fisher-inc/", checked: 2026-09-23, verified_this_run: false}
  - {kind: fair_trade, source: "https://www.fairtradecertified.org/our-community/shop-fair-trade/", checked: 2026-09-25, verified_this_run: true}
concerns: []
ethics: 1
environment: 0.5
tier: recommended
mentions: 2
mentioned_by: [adayinourshoes-com, fairtradecertified-org]
checked: 2026-09-25
---

Eileen Fisher is a women's clothing brand founded in 1984 and headquartered in Irvington, New York. Wikipedia describes it as a "Privately held company" with about 1,000 wholesale doors and 68 retail stores, and says customers can return used Eileen Fisher garments for a $5 gift certificate; the garments are resold, "with the income funding business grants for women and leadership programs for young women". That resale program runs as Eileen Fisher Renew (eileenfisherrenew.com, linked from the brand's site). No fetched page states employee ownership, so ownership is `private` as Wikipedia gives it. No fetched page says whether it sells through Amazon or hosts other sellers, so both are `unknown`.

Lists name it as an ethical clothing brand with a resale program (A Day In Our Shoes), and Fair Trade USA features its Cotton Box Square Top, "Made in a Fair Trade Certified factory," and lists it among "brands that offer Fair Trade Certified products". That is the certifier's own page, so `fair_trade` counts; it certifies products, not the whole company. B Lab's directory page returned HTTP 403 this run; `data/certifications.json` has a B Corp row for eileenfisher.com ("Certified Since December 2015", checked 2026-09-23), so B Corp counts with `verified_this_run: false`. The brand's site shows a B Corp badge. The 1% for the Planet and Climate Label directories could not be checked (see `research/raw/blocked-retailers-R10.md`).

Concern checks: an NLRB case search for "eileen fisher" returned no results, and an OSHA establishment search for "eileen fisher" (inspections 2016-01-01 to 2026-09-25) returned "Your search did not return any results" (the same search for "costco" returned 302 inspections). CourtListener shows 88 results for "Eileen Fisher"; those naming the company include two disability-access suits brought by individuals against Eileen Fisher, Inc. (N.D. Ill., 2025; M.D. Fla., 2025) and a Court of International Trade case the company brought against the United States (2026). The disability suits are allegations that do not fit the labor, governance or environmental kinds, so none is recorded as a concern.

Second pass (2026-09-25): the FTC cases and proceedings search for "Eileen Fisher" returned 4 results, all about other parties (Thermo Fisher Scientific, Thermo Electron, a 1997 dietary-supplement staff comment); none names Eileen Fisher. The CourtListener agency-docket query since 2016 returned 1 docket, "Eileen Fisher, Inc. v. United States of America" (Court of International Trade, filed 2026-01-13), where the company sues the government, so it is not a concern. The one ProPublica hit (a Pentagon brain-injury story) is not about the company. No matching cases; no concern added.

## Rating
- Blocklist: `node research/build-index.mjs --blocklist "Eileen Fisher" eileenfisher.com` says not on the blocklist, so `amazon_owned: false`.
- Certifications: `b_corp` (fallback row in `data/certifications.json`, `verified_this_run: false`) and `fair_trade` (Fair Trade USA's own shop page, fetched this run).
- Ethics: 0.5 start + 0.25 (b_corp) + 0.25 (fair_trade) = 1.0, no concerns.
- Environment: 0.5 start, no environmental certifications, no concerns = 0.5.
- Tier: ethics + environment = 1.5, at least 1.25, and no accepted concern in the last 5 years, so `recommended`.
- Concern search partial: pass 2 checked FTC cases, CourtListener agency dockets since 2016 and ProPublica; no general news search, and DOJ, SEC and Violation Tracker were unreachable; tier is provisional.

## Sources
- https://en.wikipedia.org/wiki/Eileen_Fisher
- https://www.eileenfisher.com/ (plain page load; the page links eileenfisherrenew.com and a B Corp badge)
- https://www.fairtradecertified.org/our-community/shop-fair-trade/
- https://www.bcorporation.net/en-us/find-a-b-corp/company/eileen-fisher-inc/ (HTTP 403 this run; cited through data/certifications.json)
- https://www.nlrb.gov/search/case/eileen%20fisher
- https://www.osha.gov/ords/imis/establishment.html?p_message=2&establishment=eileen%20fisher&state=all&office=all&officetype=all&sitezip=&startmonth=01&startday=01&startyear=2016&endmonth=09&endday=25&endyear=2026&p_case=all&p_violations_exist=both
- https://www.osha.gov/ords/imis/establishment.search?establishment=costco&state=all&officetype=all&Office=all&sitezip=&startmonth=01&startday=01&startyear=2016&endmonth=09&endday=25&endyear=2026&p_case=all&p_violations_exist=all
- https://www.courtlistener.com/api/rest/v4/search/?q=%22Eileen+Fisher%22&type=r&order_by=dateFiled+desc
- https://www.courtlistener.com/api/rest/v4/search/?q=%22Eileen+Fisher%22+AND+%28wage+OR+labor+OR+FLSA+OR+discrimination%29&type=r&order_by=dateFiled+desc
- data/certifications.json (b_corp row for eileenfisher.com)
- data/blocklist.md (checked: no matching entry)
- https://www.ftc.gov/legal-library/browse/cases-proceedings?search=Eileen%20Fisher (4 results, none about Eileen Fisher)
- https://www.courtlistener.com/api/rest/v4/search/?type=r&order_by=dateFiled+desc&filed_after=2016-01-01&q=caseName%3A(%22Eileen%20Fisher%22)%20AND%20caseName%3A(%22Equal%20Employment%22%20OR%20%22EEOC%22%20OR%20%22Secretary%20of%20Labor%22%20OR%20%22Department%20of%20Labor%22%20OR%20%22Federal%20Trade%20Commission%22%20OR%20%22United%20States%22%20OR%20%22State%20of%22%20OR%20%22People%20of%22%20OR%20%22Commonwealth%22%20OR%20%22National%20Labor%20Relations%22%20OR%20%22Environmental%20Protection%22%20OR%20%22Consumer%20Product%20Safety%22%20OR%20%22Securities%20and%20Exchange%22%20OR%20%22Attorney%20General%22%20OR%20%22District%20of%20Columbia%22) (1 docket, company v. United States)
- https://www.propublica.org/search?qss=%22Eileen%20Fisher%22 (1 unrelated article)
