# Verification: retailer batch R1 (2026-09-25)

Verifier for R1: etsy.com, bookshop.org, thrivemarket.com, libro.fm, credobeauty.com. All five files exist; none skipped. Fetches used plain curl (default user agent) or WebFetch; OSHA pages returned HTTP 403 to curl and were read through WebFetch.

| file | claim | source | result | why |
|---|---|---|---|---|
| etsy-com | cert `climate_neutral` (verified_this_run: true) | https://explore.changeclimate.org/brand/etsy | kept | Page names Etsy, "A Climate Label Certified Brand", firstCertifiedYear 2026, lastCertifiedYear 2026, `isExpired: false`. Footer: "Climate Neutral dba The Change Climate Project", matching docs/ranking.md (Climate Neutral certification now branded The Climate Label). Etsy is in the directory index page data. |
| etsy-com | concern: environmental, "Settlement Agreement, AG Notice Nos. 2024-02373", 2024-12-13 | https://oag.ca.gov/system/files/prop65/settlements/2024-02373S4583.pdf | removed (moved to body) | Title and effective date match, but the parties are a private individual (Jay Epps) and Etsy, Inc.; §1.4 says "no public enforcer has commenced and is diligently prosecuting". A private Prop 65 settlement is not an action by an agency or court, so it fails "What counts as a concern". Score unchanged (it was accepted_source: false). |
| etsy-com | ownership: public; hq: Brooklyn, NY; parent: none | https://en.wikipedia.org/wiki/Etsy | kept | Infobox type "Public", NYSE: ETSY, HQ Brooklyn, New York City; no parent. |
| etsy-com | marketplace: true | https://en.wikipedia.org/wiki/Etsy ; https://www.etsy.com/about | kept | "provides sellers with individual storefronts"; about page "1.9 million active sellers". |
| etsy-com | body: B Corp 2012, lapsed 2017; mass-manufactured since 2013; 5,000-seller strike 2022; investor suit, counterfeit disputes | https://en.wikipedia.org/wiki/Etsy | kept | All present in the article (it also says 2008 in another section; 2012 matches the history section). |
| etsy-com | body: lists cite a claim to offset "100%" of shipping emissions | (none in Sources) | fixed | Etsy about page has no offset or emissions text; number dropped, kept as what lists say. |
| etsy-com | Sources: "188 current brands" in directory | https://explore.changeclimate.org/ | fixed | Count not reproducible from the fetched page data; number removed. |
| bookshop-org | cert `climate_neutral` (verified_this_run: true) | https://explore.changeclimate.org/brand/bookshop | kept | Page names "Bookshop.org®", "A Climate Label Certified Brand", firstCertifiedYear 2021, lastCertifiedYear 2025, `isExpired: false`; in the directory index. Same operator footer as Etsy. The directory flags expired brands (Thrive Market's page says "certification has expired"), so `isExpired: false` is read as current. |
| bookshop-org | ownership: private; parent: none | https://en.wikipedia.org/wiki/Bookshop.org (redirects to Bookshop (company)) | kept | "Bookshop, Inc., a privately held company"; infobox parent empty. `parent: none` rests on that (no parent named), matching the brief's template. |
| bookshop-org | body: founded by Andy Hunter, launched January 2020; 30% to bookseller; 10% pool; ebooks January 2025; replaced IndieBound 2023 | https://en.wikipedia.org/wiki/Bookshop.org | kept | Quotes match the article. |
| thrivemarket-com | concern: labor, OSHA inspection 1724624.015, 2024-03-25 | https://www.osha.gov/ords/imis/establishment.inspection_detail?id=1724624.015 | fixed (title) | Thrive Market, Inc., 700 Milan Dr., NV; opened 01/31/2024; Serious (initial $6,612, current $3,306) and Other ($0) citations issued 03/25/2024; informal settlement; closed. Title was composed; replaced with the page's own "Inspection Detail \| Occupational Safety and Health Administration". |
| thrivemarket-com | concern: labor, OSHA inspection 1724652.015, 2024-03-25 | https://www.osha.gov/ords/imis/establishment.inspection_detail?id=1724652.015 | removed (moved to body) | Same visit as 1724624: same Report ID 0953210, same open date, same close conference (02/06/2024) and close date (06/05/2024), same address, and each page lists the other as Related Activity. One inspection visit is one action. |
| thrivemarket-com | OSHA citation rule (brief section 9, added mid-run): penalty and closed case required; one inspection is one concern | https://www.osha.gov/ords/imis/establishment.inspection_detail?id=1724624.015 | kept | Serious citation current penalty $3,306, case CLOSED, so the one concern stands; the $0 Other citation and the companion record 1724652.015 are body notes only. Rule applied after the first build; no score change. |
| thrivemarket-com | body: four inspections 2016 to 2026; IN (2026) and PA (2025) list no violations | OSHA establishment search URL in Sources | kept | Four rows; IN 1871729 and PA 1847903 show no violation count. |
| thrivemarket-com | ownership: public-benefit-corporation; hq: Los Angeles, CA; parent: none | https://en.wikipedia.org/wiki/Thrive_Market | kept | "converted from a C-corporation to a Delaware Public Benefit Corporation" (2023); HQ Los Angeles; venture investors, no parent named. |
| thrivemarket-com | Climate Label expired (not counted) | https://explore.changeclimate.org/brand/thrive-market | kept | Page says the certification "expired"; absent from the directory index. |
| thrivemarket-com | body: "1.7 Million Members", mission quote, B Corp badge | https://thrivemarket.com/about | kept | Text present on the page. |
| libro-fm | ownership: employee-owned; hq: Seattle, WA; parent: none | https://en.wikipedia.org/wiki/Libro.fm | kept | "The Seattle-based company is employee-owned and a social purpose corporation"; no parent. |
| libro-fm | body: founders, 2014, Bookshop.org partnership 2020, five countries | https://en.wikipedia.org/wiki/Libro.fm | kept | Matches the article. |
| libro-fm | not in Climate Label directory; "188 current brands" | https://explore.changeclimate.org/ | fixed | Absence confirmed (no Libro name in the index page data); count removed. |
| credobeauty-com | all ownership fields `unknown` | n/a | kept | Nothing to verify. |
| credobeauty-com | body: house brands, Credo Standard, co-founded Pact, emissions tracking since 2023 | https://credobeauty.com/pages/about-us | kept | "We co-founded Pact"; "2023, we've been tracking our own greenhouse gas emissions"; Credo Skincare, Follain, Cosmetics 27 present. |
| credobeauty-com | body: founded 2014 by Annie Jackson and Shashi Batra; SF store 2015; Follain 2022 | https://en.wikipedia.org/wiki/Credo_Beauty | kept | Matches; article gives no ownership or HQ. |
| credobeauty-com | not in Climate Label directory; "188 current brands" | https://explore.changeclimate.org/ | fixed | Absence confirmed; count removed. |
| all five | concern search completeness | raw/blocked-retailers-R1.md | fixed | Web search budget exhausted (Bookshop, Thrive, Libro, Credo) and Good Jobs First Violation Tracker, an accepted source, returned 403 (Etsy). Added the provisional-tier line to each "## Rating". |

## Tier results

| file | before | after |
|---|---|---|
| etsy-com | ethics 0.5, env 0.75, recommended | unchanged (provisional) |
| bookshop-org | ethics 0.5, env 0.75, recommended | unchanged (provisional) |
| thrivemarket-com | ethics 0, env 0.5, caution | ethics 0.25, env 0.5, caution (provisional) |
| libro-fm | 0.5 / 0.5, acceptable | unchanged (provisional) |
| credobeauty-com | 0.5 / 0.5, acceptable | unchanged (provisional) |

## Pages not fetched by the verifier

- OSHA inspection and search pages: HTTP 403 to plain curl; read through WebFetch instead, so not blocked.
- Pages the researcher logged as blocked (bcorporation.net, bookshop.org, libro.fm/about, Violation Tracker) support no claim in the files; not retried.
