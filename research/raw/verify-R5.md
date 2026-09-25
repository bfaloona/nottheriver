# Verification: retailers-R5
checked: 2026-09-25

Files: barnesandnoble-com, betterworldbooks-com, bhphotovideo-com, chewy-com, equalexchange-coop (all five exist). Fetches by WebFetch; plain curl got HTTP 403 from osha.gov and sec.gov, and WebSearch was out of budget (200 of 200).

| file | claim | source | result | why |
|---|---|---|---|---|
| barnesandnoble-com | concern labor, OSHA 1700421.015, 2024-03-01 | https://www.osha.gov/ords/imis/establishment.inspection_detail?id=1700421.015 | kept | Title is the page title; serious citation 01001 issued 03/01/2024, $13,828 initial and current, "Z - Issued", case closed. Establishment "Barnes And Noble", 1 Barnes And Noble Way, Monroe Township NJ, NAICS 451211 Book Stores; the establishment search lists Barnes & Noble College Booksellers (the separate BNED company) under its own name, so this is not a BNED site. No other source fetched this run names the site; identity rests on the OSHA page. |
| barnesandnoble-com | no-penalty citations 1642640.015 and 1484432.015 noted, not scored | OSHA establishment search | kept | Both rows appear in the search with 1 violation each. Not scored under the batch's penalty-only convention (see note below). |
| barnesandnoble-com | ownership private, parent Elliott, hq New York NY | https://en.wikipedia.org/wiki/Barnes_%26_Noble | kept | Infobox "Private"; "privately held, wholly owned subsidiary of Elliott"; HQ 33 E. 17th Street, New York City. |
| barnesandnoble-com | Rating | section 5 | fixed | Values unchanged (0.25 / 0.5 / caution); added the concern-search-incomplete line. |
| betterworldbooks-com | ownership nonprofit, parent Better World Libraries, hq Mishawaka IN | https://en.wikipedia.org/wiki/Better_World_Books | kept | "acquired by Better World Libraries, a mission-aligned, not-for-profit organization"; HQ Mishawaka, Indiana. Body already says the operating company is described as private. |
| betterworldbooks-com | B Corp noted, not scored | Wikipedia; bcorporation.net 403 | kept | Correctly left out of certifications; no data/certifications.json row. |
| betterworldbooks-com | no concerns | - | kept | Nothing to refute. |
| betterworldbooks-com | Rating | section 5 | fixed | Values unchanged (0.5 / 0.5 / acceptable); added the concern-search-incomplete line. |
| bhphotovideo-com | concern labor, OSHA 1552934.015, 2022-02-17 | https://www.osha.gov/ords/imis/establishment.inspection_detail?id=1552934.015 | kept | Serious citation 01001 issued 02/17/2022, $14,502, "ALJ Decision (03/23/2022)". Establishment "B & H Foto & Electronics, Corp.", 400 Cedar Lane, Florence NJ; Wikipedia says B&H moved its warehouses to a fulfillment center in Florence, New Jersey in 2017. |
| bhphotovideo-com | concern labor, OSHA 1369750.015, 2019-06-06 | https://www.osha.gov/ords/imis/establishment.inspection_detail?id=1369750.015 | kept | Serious citation issued 06/06/2019, $10,419 reduced to $7,085, ALJ decision. Same Florence NJ site, different inspection number from 1552934.015, so not a duplicate. |
| bhphotovideo-com | body: "a 2007 EEOC settlement" | https://en.wikipedia.org/wiki/B%26H_Photo_Video | fixed | Wikipedia says "agreed to a US$4.3 million settlement in response to claims of discrimination against Hispanic workers" and does not name the EEOC; body reworded to the source's words. |
| bhphotovideo-com | ownership private, parent none, hq New York NY | https://en.wikipedia.org/wiki/B%26H_Photo_Video | kept | Infobox "Private"; "The owner of the company, Herman Schreiber" (a person, so no parent company); 420 Ninth Avenue, Manhattan. |
| bhphotovideo-com | Rating | section 5 | fixed | Values unchanged (0 / 0.5 / caution); added the concern-search-incomplete line. |
| chewy-com | concern labor, OSHA 1648417.015, 2023-05-03 | https://www.osha.gov/ords/imis/establishment.inspection_detail?id=1648417.015 | kept | "Chewy, Inc", 37 Archbald Heights Rd, Jessup PA, NAICS 453910 Pet and Pet Supplies Stores; citations issued 05/03/2023, $16,072 reduced to $10,000, ALJ decision. |
| chewy-com | concern labor, OSHA 1545401.015, 2022-01-14 | https://www.osha.gov/ords/imis/establishment.inspection_detail?id=1545401.015 | kept | "Chewy, Inc.", 3380 NW 35th Rd, Ocala FL; citation issued 01/14/2022, $5,851, formal settlement; page describes a hand caught in a powered conveyor on 2021-07-20. NAICS shown is 311111 (dog and cat food manufacturing), but the establishment is Chewy, Inc. |
| chewy-com | concern labor, OSHA 1425169.015, 2019-09-27 | https://www.osha.gov/ords/imis/establishment.inspection_detail?id=1425169.015 | kept | "Chewy, Inc.", 600 New Commerce Blvd, Wilkes Barre PA; citation issued 09/27/2019, $4,347, informal settlement. |
| chewy-com | concern labor, OSHA 1223545.015, 2017-04-20 | https://www.osha.gov/ords/imis/establishment.inspection_detail?id=1223545.015 | kept | "Chewy, LLC", 40 Dauphin Drive, Mechanicsburg PA; citations issued 04/20/2017, total $6,156, informal settlement. |
| chewy-com | identity of the four OSHA sites | https://efts.sec.gov/LATEST/search-index?q=%22Wilkes-Barre%22%20%22Ocala%22&ciks=0001766502&forms=10-K ; https://efts.sec.gov/LATEST/search-index?q=%22Mechanicsburg%22&ciks=0001766502&forms=10-K ; https://efts.sec.gov/LATEST/search-index?q=%22Jessup%22&ciks=0001766502 | kept | EDGAR full-text search: Chewy's own 10-Ks (2020 to 2024) contain Wilkes-Barre and Ocala, Mechanicsburg (2020 to 2023) and Jessup (2021 to 2024). Snippets not returned; Item 2 (Properties) could not be read (WebFetch truncates the 10-K; curl 403). Four distinct inspection numbers, no duplicate. |
| chewy-com | ownership public, parent BC Partners affiliates, hq Plantation FL | https://www.sec.gov/Archives/edgar/data/1766502/000176650226000034/chwy-20260201.htm ; https://en.wikipedia.org/wiki/Chewy,_Inc. | kept | 10-K: HQ 7700 West Sunrise Boulevard, Plantation FL; "The BCP Stockholder Parties control the direction of our business". Index page: filed 2026-03-25. Wikipedia: Public, NYSE: CHWY, about 80% of shares and 98% of voting power. |
| chewy-com | Rating | section 5 | fixed | Values unchanged (0 / 0.5 / caution); added the concern-search-incomplete line and the EDGAR search URLs to Sources. |
| equalexchange-coop | cert worker_coop, verified_this_run: true | https://info.usworker.coop/iframe/directory/worker-co-op-dem-workplaces?page=8 | kept | US Federation of Worker Cooperatives' own directory (named in the page header) lists "Equal Exchange, West Bridgewater, Massachusetts ... Business Type: Worker Co-op", website https://equalexchange.coop/. Page number may shift as the directory grows. |
| equalexchange-coop | OSHA 1880169.015 noted, not scored | https://www.osha.gov/ords/imis/establishment.inspection_detail?id=1880169.015 | kept | "Equal Exchange Inc", Portland OR; case OPEN; two Other citations issued 04/01/2026, $0 penalty. Body matches. See note below. |
| equalexchange-coop | ownership cooperative, parent none, hq West Bridgewater MA | https://en.wikipedia.org/wiki/Equal_Exchange | kept | "for-profit, Fairtrade, worker-owned cooperative"; West Bridgewater, Massachusetts; no parent (it has a UK subsidiary, not a parent). |
| equalexchange-coop | Rating | section 5 | fixed | Values unchanged (0.75 / 0.5 / recommended); added the concern-search-incomplete line. |

## Not verified (body notes, not scored)
NLRB dockets, CourtListener, Climate Label and 1% for the Planet checks were not re-fetched: they support no scored claim or front-matter field.

## Note for the lead: penalty-only rule
The researcher scored an OSHA citation only when it carried a penalty (the same convention appears in azurestandard-com and bobsredmill-com). Section 9 "What counts as a concern" lists "a citation" with no penalty condition. Left as is (this verifier refutes; it doesn't add concerns). If the brief is applied literally: Equal Exchange (1880169.015, two $0 citations issued 2026-04-01, case still open) would go from `recommended` to `acceptable` (ethics 0.5, and a concern in the last 5 years); Barnes & Noble (2 more) and Chewy (3 more) would stay `caution`.

## Blocked this pass
- https://www.osha.gov/ords/imis/... with plain curl: HTTP 403 (WebFetch worked).
- https://www.sec.gov/Archives/edgar/data/1766502/000176650222000008/chwy-20220130.htm: plain curl 403; WebFetch truncates before Item 2 Properties.
- https://www.barnesandnobleinc.com/: TLS certificate error. Wanted: confirmation that 1 Barnes and Noble Way, Monroe Township NJ is a Barnes & Noble, Inc. site.
- WebSearch: session budget spent (200 of 200).
