# Verification, retailer batch R3 (2026-09-25)

Files: aliexpress-com, backmarket-com, bestbuy-com, blkgrn-com, misfitsmarket-com (all five exist). Sources fetched with WebFetch; Wikipedia wikitext and backmarket.com HTML also read with plain curl (no browser user agent).

| file | claim | source | result | why |
|---|---|---|---|---|
| aliexpress-com | concern: DOJ $600M, governance, 2026-07-01, accepted | https://www.justice.gov/opa/pr/alibaba-group-and-aus-merchant-services-agree-pay-600-million-resolve-allegations-they | kept | Title verbatim, dated July 1, 2026; non-prosecution agreement with payment is an agency resolution; release names AliExpress.com as the platform ("failed to prevent merchants using its Alibaba.com and AliExpress.com platforms"), so it concerns this retailer's own business. Body's "admitted" quote matches |
| aliexpress-com | concern: EC €550M DSA fine, governance, 2026-07-20, not accepted | https://digital-strategy.ec.europa.eu/en/news/commission-fines-aliexpress-eu550-million-breaching-digital-services-act | kept | Title and date match; a Commission fine names AliExpress; domain not in negative-sources, so `accepted_source: false` is right |
| aliexpress-com | ownership: public; parent: Alibaba Group | https://en.wikipedia.org/wiki/AliExpress, https://en.wikipedia.org/wiki/Alibaba_Group | kept | "owned by the Alibaba Group"; Alibaba infobox "Public", NYSE: BABA, SEHK: 9988. Body says `public` records the parent's status |
| aliexpress-com | marketplace: true | https://en.wikipedia.org/wiki/AliExpress | kept | "sellers are independent and use the platform" |
| aliexpress-com | body: launched 2010, sellers "mostly small Chinese businesses", USTR notorious markets 2022 | Wikipedia (both) | fixed | Launch year and USTR 2022 match; goods list (electronics, clothing, home goods) not in the sources, replaced with the source's wording |
| aliexpress-com | body: 2024 shareholder class-action settlement against Alibaba "in its SEC filings" | none in Sources | removed | No fetched source (cite or omit) |
| backmarket-com | ownership: private; body "is privately held" | https://www.backmarket.com/en-us/about-us | fixed (unknown) | Page has no "private", "privately held" or "independent"; it says only that it "raised over $1 billion" from named investors |
| backmarket-com | hq: Paris, France | https://www.backmarket.com/en-us/about-us | fixed (unknown) | Page says "Founded in Paris in 2014"; no headquarters wording |
| backmarket-com | marketplace: true | https://www.backmarket.com/en-us/about-us | kept | "the world's largest pure-play premium refurbished tech marketplace", verified sellers |
| backmarket-com | parent: none | https://www.backmarket.com/en-us/about-us | kept | Own page names no parent; lists outside investors |
| backmarket-com | body: B Corp score 93 and "2 million metric tons of CO2e" quoted | https://www.backmarket.com/en-us/about-us (HTML) | fixed | Both numbers are images (`Number-Image_93_EN.png`, `Number-Image_2million_EN.png`); only labels are text. Unquoted; still unverified |
| backmarket-com | certifications: [] (B Corp not counted) | https://www.bcorporation.net/en-us/find-a-b-corp/company/back-market/ | kept | Directory blocked (researcher's log); data/certifications.json has no backmarket.com row (grep checked) |
| backmarket-com | body: three CourtListener cases (two 2022 ADA suits, Peterson 2026-09-15) | https://www.courtlistener.com/api/rest/v4/search/?q=%22Back+Market+Inc%22&type=r | kept | Results match (Chalas, Martinez: 446 ADA; Peterson: nature blank). None an agency or court finding |
| bestbuy-com | ownership: public; parent: none; hq: Richfield, MN | https://www.sec.gov/Archives/edgar/data/764478/000076447826000009/bby-20260131.htm | kept | NYSE "BBY"; principal office 7601 Penn Avenue South, Richfield, Minnesota; incorporated in Minnesota; registrant is the top company |
| bestbuy-com | marketplace: true; quote "our recently launched U.S. platform" | same 10-K | kept | "Our expanding Best Buy Marketplace, including our existing Canadian platform and our recently launched U.S. platform"; "third-party sellers can sell products on our platform" |
| bestbuy-com | body: marketplace 2011-2016, relaunch announced January 2025; 2008 FCC fine, class-action settlements, 2026 B.C. Human Rights Tribunal order (not recorded) | https://en.wikipedia.org/wiki/Best_Buy | kept | All present on Wikipedia; correctly left out of concerns (not fetched at source) |
| bestbuy-com | body: CourtListener dockets only Best Buy / "Star Best Buy Inc." v. United States | CourtListener API query in Sources | kept | 4 results: Star Best Buy Inc. (x2), Best Buy Co. & Subsidiaries, Best Buy Purchasing LLC, all v. United States |
| blkgrn-com | marketplace: true; founder 2017 and mission quote | https://blkgrn.com/pages/about | kept | "In 2017, Dr. Edwards launched our marketplace — dedicated to empowering Black women..."; "Over 174 Black Artisans" |
| blkgrn-com | ownership/hq unknown; parent: none | https://blkgrn.com/pages/about | kept | Page gives no ownership or HQ; names no parent |
| blkgrn-com | body: own pages claim "sustainable practices" and "quality tested" | https://blkgrn.com/, https://blkgrn.com/pages/about | fixed | "sustainable practices" on neither page, removed; "QUALITY TESTED" present on homepage. "all-natural" reworded to the homepage's "An all-natural wellness ecosystem" |
| blkgrn-com | body: no CourtListener case naming BLK + GRN | CourtListener API query in Sources | kept | 14 results, none naming BLK or GRN |
| misfitsmarket-com | ownership: private; body "Wikipedia describes it as privately held and venture-backed" | https://en.wikipedia.org/wiki/Misfits_Market (and its wikitext) | fixed (unknown), sentence removed | No infobox; no "private", "venture", "funding" or "investors" in the article text |
| misfitsmarket-com | hq: Philadelphia, PA | https://en.wikipedia.org/wiki/Misfits_Market | fixed (unknown) | Article says "founded in 2018 by Abhi Ramesh in Philadelphia"; no headquarters or "based in" wording |
| misfitsmarket-com | parent: none | https://en.wikipedia.org/wiki/Misfits_Market | kept | Article names no parent; Misfits is the acquirer (Imperfect Foods, The Rounds) |
| misfitsmarket-com | body: founding, 10% revenue share, Imperfect Foods 2022, The Rounds 2025 | Wikipedia | kept | All match |
| misfitsmarket-com | body: "two open labor cases", Brown Jr. "ordered remanded" | CourtListener API query in Sources | fixed | Three open labor-nature dockets (Gonzalez 2026-08-14; Brown Jr. 2025-12-04 and 2026-04-13); no remand shown in the results, so removed. None is a finding |
| misfitsmarket-com | https://www.misfitsmarket.com/about | - | logged | HTTP 404 (researcher's note); no claim rests on it |
| all five | tier | brief section 5 | kept | AliExpress 0.25 + 0.5 = 0.75 `caution`; the other four 0.5 + 0.5 = 1.0 `acceptable`. No change |
| all five | provisional-tier line | raw/blocked-retailers-R3.md | added | Researcher logged the concern search as incomplete: WebSearch budget exhausted before Back Market, Best Buy, BLK + GRN, Misfits Market; Violation Tracker blocked for AliExpress; regulator site searches inconclusive for all |

## Access notes
- Plain curl to the CourtListener search API returned HTTP 429 (rate limit); the same URLs fetched with WebFetch returned full results, so nothing was removed for it.
- No page needed for a kept claim was unfetchable.
