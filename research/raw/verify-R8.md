# Verification: retailers R8
checked: 2026-09-25

Files: thredup-com, depop-com, girlfriend-com, christydawn-com, mightly-com (all five exist). Fetches by WebFetch; one plain curl (SEC, honest user agent, no contact details) returned 403.

| file | claim | source | result | why |
|---|---|---|---|---|
| thredup-com | concern: OSHA 1815510.015 (labor, 2025-05-07) | https://www.osha.gov/ords/imis/establishment.inspection_detail?id=1815510.015 | fixed | separate complaint inspection of "Thredup Distribution Center", Mechanicsburg, PA; one "Other" citation (1904.32(a)(3)) issued 05/07/2025; initial $2,364, current $1,773, latest event "Informal Settlement"; closed 08/05/2025. Title changed to the page's own, "Inspection Detail \| Occupational Safety and Health Administration" (researcher had composed one). Penalty and close date in body |
| thredup-com | concern: OSHA 1257615.015 (labor, 2017-10-26) | https://www.osha.gov/ords/imis/establishment.inspection_detail?id=1257615.015 | removed (moved to body) | separate complaint inspection of "Thredup, Inc.", Duluth, GA; one "Other" citation (1910.22(a)(1)) issued 10/26/2017, initial and current penalty $0; closed 01/16/2018. Lead's OSHA rule (brief section 9, 2026-09-25): a $0 citation is noted in the body, not counted |
| thredup-com | ownership public, parent none, hq Oakland, CA | https://www.sec.gov/Archives/edgar/data/1484778/000148477826000007/tdup-20251231.htm, https://en.wikipedia.org/wiki/ThredUp | kept | 10-K: "969 Broadway, Suite 200, Oakland, California 94607"; Class A on Nasdaq (TDUP) and LTSE; ThredUp is the registrant. Cover fact added to body |
| thredup-com | marketplace false | same 10-K, Wikipedia | kept | consignment: sellers mail Clean Out bags, ThredUp processes and lists; Wikipedia "ThredUp sorts, evaluates and presents the clothes for selling" |
| thredup-com | Remix 91.0% divested 2024-11-30 | same 10-K | kept | quoted in filing |
| thredup-com | 10-K Item 3 quote "We are not a party to any material pending legal proceedings" | same 10-K | removed | two WebFetch passes did not reach Item 3 (content truncated); curl 403. Cite or omit |
| thredup-com | CourtListener dockets (Starnes E.D. Pa. 2022-12-07; fraud, trademark, ADA, qui tam) | https://www.courtlistener.com/api/rest/v4/search/?q=caseName%3A%28thredup%29&type=r | kept | all present in the docket list; none is an agency or court finding, so body-only is correct |
| thredup-com | tier | section 5 recompute | kept (caution) | ethics 0.5 − 0.25 = 0.25, environment 0.5, sum 0.75 < 1.0. Ethics changed 0.0 -> 0.25; tier unchanged. Provisional line added |
| depop-com | parent eBay Inc. | https://www.sec.gov/Archives/edgar/data/1065088/000106508826000177/ebay-20260630.htm | kept | 10-Q: agreement Feb 2026 to acquire "Depop Limited ... for $1.2 billion in cash"; "The transaction closed on July 30, 2026" |
| depop-com | ownership public | same 10-Q (cover page) | kept | cover: eBay Inc., "The Nasdaq Global Select Market", EBAY. Added to body so the value is sourced |
| depop-com | hq London; marketplace true | https://en.wikipedia.org/wiki/Depop | kept | "headquartered in London"; users upload their own listings; Etsy 2021 and eBay 2026 sale sentences present |
| depop-com | CourtListener dockets | https://www.courtlistener.com/api/rest/v4/search/?q=caseName%3A%28depop%29&type=r | kept | Dawson (S.D.N.Y. 2019, ADA), Dinh (N.D. Cal. 2026, fraud), Tysyachuk and Rivera (2026); no ruling, body-only |
| depop-com | tier | section 5 recompute | kept (acceptable) | 0.5 + 0.5 = 1.0. Provisional line added |
| girlfriend-com | hq Seattle, WA | https://girlfriend.com/pages/contact, https://girlfriend.com/policies/terms-of-service | fixed -> unknown | contact address is a private mailbox ("600 1st Avenue, Suite 330, PMB 81172"), which the researcher dropped; terms send disputes to Travis County, Texas. Neither establishes a headquarters. Both facts put in body |
| girlfriend-com | ownership, parent unknown; marketplace false | https://girlfriend.com/pages/about-us, terms of service | kept | "Girlfriend Collective LLC", no parent or owner named; sells only its own activewear |
| girlfriend-com | brand's own 1% for the Planet claim not counted | https://dueekpzk7aquu.cloudfront.net/search?q=girlfriend%20collective | kept | 0 results; about page does claim "1% of every order is donated", body correctly treats it as unverified |
| girlfriend-com | CourtListener: Murphy v. Girlfriend Collective LLC | https://www.courtlistener.com/api/rest/v4/search/?q=caseName%3A%28%22girlfriend%20collective%22%29&type=r | kept | W.D. Pa., 2021-07-28, ADA; body-only |
| girlfriend-com | tier | section 5 recompute | kept (acceptable) | 1.0. Provisional line added |
| christydawn-com | hq Los Angeles, CA | https://christydawn.com/policies/privacy-policy | kept | "2115 South San Pedro Street, Los Angeles CA 90011" |
| christydawn-com | marketplace false | https://christydawn.com/pages/about, https://christydawn.com/pages/faq | kept | own brand only; FAQ links a "Pre-Loved" site for secondhand Christy Dawn items (noted in body, not third-party sellers of other goods) |
| christydawn-com | Farm-to-Closet, Oshadi, living-wage quote | https://christydawn.com/pages/about | kept | quote matches; presented as the brand's own claim |
| christydawn-com | CourtListener: Fischler v. Christy Dawn, LLC | https://www.courtlistener.com/api/rest/v4/search/?q=caseName%3A%28%22christy%20dawn%20llc%22%20OR%20%22christy%20dawn%2C%20llc%22%20OR%20%22v.%20christy%20dawn%22%29&type=r | kept | E.D.N.Y., 2020-09-03, ADA; body-only |
| christydawn-com | tier | section 5 recompute | kept (acceptable) | 1.0. Provisional line added |
| mightly-com | certification fair_trade (verified_this_run: true) | https://www.fairtradecertified.org/our-community/shop-fair-trade/ | removed | page lists tiles as "brands that offer Fair Trade Certified products" (sellers of certified goods, not certified companies); Mightly's sustainability page applies Fair Trade certification to its factory partners ("Our first filter"). No `data/certifications.json` row for mightly.com. Listing kept in body as context |
| mightly-com | parent none | https://www.mightly.com/pages/about | fixed -> unknown | page shows Mightly, Inc. owns three brands, not that nothing owns Mightly, Inc.; ownership already unknown |
| mightly-com | hq Oakland, CA | https://www.mightly.com/policies/privacy-policy, https://www.mightly.com/pages/about | kept | mailing address "4200 Park Blvd, #637, OAKLAND CA 94602" (unit added to body); about page says founded in Oakland |
| mightly-com | marketplace false | https://www.mightly.com/pages/about | kept | three own brands only |
| mightly-com | tier | section 5 recompute | fixed: recommended -> acceptable | ethics 0.75 -> 0.5 after removing fair_trade; 0.5 + 0.5 = 1.0. Provisional line added |
| all five | concern search completeness | raw/blocked-retailers-R8.md | fixed | WebSearch exhausted before R8; ftc, dol, epa, cpsc, justice, AP, NPR, ProPublica not searched. Provisional line added to each `## Rating` |

## Not fetchable this pass
- https://www.sec.gov/Archives/edgar/data/1484778/000148477826000007/tdup-20251231.htm, Item 3 (Legal Proceedings): WebFetch truncated before it; plain curl 403. Claim removed.
| mightly-com | certification fair_trade | https://www.fairtradecertified.org/our-community/shop-fair-trade/ | restored by lead | docs/ranking.md defines `fair_trade` as "Sells Fair Trade Certified products", and the curated rows in data/certifications.json (eileenfisher, wearpact, patagonia, arcteryx, madewell) cite this same brand listing. Tier back to recommended (0.75 + 0.5). Stockists listed as retailers (Walmart, Costco) still do not count. |
