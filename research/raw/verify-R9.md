# Verification: retailer batch R9
checked: 2026-09-25

All five R9 files exist. All concern sources are osha.gov (in data/negative-sources.md), so `accepted_source: true` stands for each. WebSearch was unavailable (session budget 200 of 200), so no new concern search was attempted; that is expected for a verifier.

| file | claim | source | result | why |
|---|---|---|---|---|
| avocadogreenmattress-com | cert climate_neutral | https://explore.changeclimate.org/brand/avocado-green-brands | kept | Title "Avocado Green Mattress \| A Climate Label Certified Brand", site avocadogreenmattress.com, first certified 2020, current year 2025 |
| avocadogreenmattress-com | cert one_percent_planet (verified_this_run: false) | data/certifications.json row 16 | kept | domain, kind and source_url match the row exactly |
| avocadogreenmattress-com | concern labor, OSHA 1582670, 2022-08-11 | https://www.osha.gov/ords/imis/establishment.inspection_detail?id=1582670.015 | fixed | Title, date, 2 "Other" violations, $5,000 initial / $3,000 current match. Body now adds that one citation was contested and resolved by an ALJ order (the source shows this), and states the identity chain |
| avocadogreenmattress-com | concern labor, OSHA 1658946, 2023-08-16 | https://www.osha.gov/ords/imis/establishment.inspection_detail?id=1658946.015 | kept | Title, date, 3 "Other" violations, $935 match; case closed, no contest |
| avocadogreenmattress-com | identity: Avocado Green Brands, LLC (Fullerton) is this retailer | our-story page; help-center "who owns Avocado" | kept | our-story: Avocado Green Mattress "is owned by Avocado Green Brands" and "Every Avocado mattress is handmade in our GOTS-certified facility in Fullerton, California"; help center: "Corporate offices are now in Fullerton, California" |
| avocadogreenmattress-com | ownership: private; parent: Avocado Green Brands | help-center page; our-story page | kept | "owned by Avocado Green Brands and privately held" |
| avocadogreenmattress-com | hq: unknown (pages disagree) | both company pages | kept | our-story says Hoboken corporate offices; help center says Fullerton |
| avocadogreenmattress-com | body: CourtListener dockets (Roberts, Islas, Davis, Rehman, ADA suits) | https://www.courtlistener.com/api/rest/v4/search/?q=%22Avocado%20Mattress%22&type=r | kept | All listed with the stated courts, dates, nature of suit |
| azurestandard-com | concern labor, OSHA 1574338, 2022-03-10 | https://www.osha.gov/ords/imis/establishment.inspection_detail?id=1574338.015 | kept | Azure Farms Inc, 500 Azure Ln, Moro OR; issued 03/10/2022; 3 serious + 8 other; $1,800; closed, not contested |
| azurestandard-com | concern labor, OSHA 1647478, 2023-03-08 | https://www.osha.gov/ords/imis/establishment.inspection_detail?id=1647478.015 | kept | issued 03/08/2023; 1 other; $1,000; closed, not contested |
| azurestandard-com | concern labor, OSHA 1665055, 2023-05-26 | https://www.osha.gov/ords/imis/establishment.inspection_detail?id=1665055.015 | kept | issued 05/26/2023; 2 serious + 4 other; $570; closed, not contested |
| azurestandard-com | identity: Azure Farms Inc is the company behind Azure Standard | https://storage.courtlistener.com/recap/gov.uscourts.ord.139619/gov.uscourts.ord.139619.1.0.pdf; https://www.azurestandard.com/about (footer) | fixed | Complaint (Landmark v. Azure Farms, D. Or. 3:18-cv-01568) states "on information and belief" that Azure Farms, Inc. has its principal place of business at 79709 Dufur Valley Road, Dufur, Oregon 97021 and sells via azurestandard.com; the site footer reads "©Azure Standard \| 79709 Dufur Valley Road, Dufur, OR 97021". The address match makes the tie clear enough to keep the concerns; body rewritten to cite this instead of the exhibit title alone. Moro site is the same named entity, not separately tied |
| azurestandard-com | hq: Dufur, OR | https://www.azurestandard.com/about (plain curl, footer) | kept | Footer address above |
| azurestandard-com | ownership, parent, marketplace: unknown | - | kept | No source; left unknown |
| azurestandard-com | body: 2025-04-25 inspection, 1 citation, no penalty | https://www.osha.gov/ords/imis/establishment.inspection_detail?id=1820868.015 | kept | Closed, $0 penalty; not counted |
| azurestandard-com | body: 2017 inspection (id 1216088) and three no-violation inspections | OSHA pages not re-fetched | kept (unverified) | Uncounted, body only; not re-fetched this pass |
| bobsredmill-com | cert fair_trade | https://www.fairtradecertified.org/our-community/shop-fair-trade/ | kept | Bob's Red Mill tile under "Explore Brands Where You Can Buy Fair Trade" ("brands that offer Fair Trade Certified products"), links bobsredmill.com/food-safety; product-level, as body says |
| bobsredmill-com | concern labor, OSHA 1637323, 2023-01-03 | https://www.osha.gov/ords/imis/establishment.inspection_detail?id=1637323.015 | kept | Bob's Red Mill Natural Foods Inc, 13521 SE Pheasant Ct; issued 01/03/2023; 3 serious; $1,350; closed, not contested |
| bobsredmill-com | body: 2025-09-25 planned inspection, open, 1 citation, $0 | https://www.osha.gov/ords/imis/establishment.inspection_detail?id=1855840.015 | kept | Open; citation type "Other" issued 10/29/2025; $0; not counted |
| bobsredmill-com | ownership: employee-owned; parent: none | https://en.wikipedia.org/wiki/Bob%27s_Red_Mill; https://www.bobsredmill.com/about-us | kept | "By April 2020, 100% of the company was owned by its more than 700 employees"; about page "employee-owned business" |
| bobsredmill-com | hq: Milwaukie, OR | Wikipedia | kept | Headquartered in Milwaukie, Oregon |
| ecoroots-us | marketplace: false | https://ecoroots.us/products.json?limit=250 | kept | 171 of 172 products vendor "EcoRoots", 1 "Tip Jar" |
| ecoroots-us | body: about page, Phoenix mailing address | https://ecoroots.us/pages/about-us; https://ecoroots.us/pages/contact-us | kept | Founder Antonia; "beauty, hair, and household essentials", "made in small batches"; shipping address in Phoenix, AZ; no certification claims |
| ecoroots-us | no certifications, no concerns | Fair Trade USA page (not listed) | kept | Nothing to verify |
| ableclothing-com | ownership: public-benefit-corporation | https://en.wikipedia.org/wiki/Fashionable,_Inc. | kept | "converted into a for-profit company and is classified as a benefit corporation"; private |
| ableclothing-com | hq: Nashville, TN | Wikipedia | kept | 5022 Centennial Blvd, Nashville |
| ableclothing-com | parent: none | Wikipedia | fixed to unknown | Wikipedia is silent on a parent (absence is not support), and the open Chapter 11 case makes ownership uncertain |
| ableclothing-com | marketplace: false | https://ableclothing.com/products.json?limit=250 | kept | 96 products: ABLE 86, "ABLE \| NAVEDA" 6, FASHIONABLE 3, Onward 1 |
| ableclothing-com | body: about-page quotes | https://www.ableclothing.com/pages/about-us | kept | Both quotes present |
| ableclothing-com | body: Chapter 11 (3:25-bk-01501) and Davis ADA suit | https://www.courtlistener.com/api/rest/v4/search/?q=%22Fashionable%20Inc%22%20Nashville&type=r | kept | Both listed with the stated dates |
| all five | Rating: concern search incomplete | research/raw/blocked-retailers-R9.md | fixed | Log says no FTC check for any R9 retailer and WebSearch was exhausted; provisional line added to every Rating |

## Tier changes
None. Avocado acceptable, Azure Standard caution, Bob's Red Mill acceptable, EcoRoots acceptable, ABLE acceptable.

## Unfetchable this pass
- WebSearch (session budget spent): not needed for verification.
- CourtListener API throttles at 5 requests a minute; retried after the wait and succeeded.
