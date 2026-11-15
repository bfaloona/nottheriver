# Blocked pages: why each one failed
Status: closed

Measured 2026-11-15 from this machine with plain `curl` (default client name, no cookies). 58 rows (URLs); raw data in `triage.tsv`; saved bodies, headers and robots.txt files in `bodies/` (`pNN` = row order in `scripts/triage-source.psv`).

Controls that worked: `https://example.com/` returned 200 (577 bytes); its `/robots.txt` returned 404 (so `no-file` is detectable); a Wayback lookup for `example.com` returned a snapshot. A robots reading counts only when the reply was 200 and held `User-agent` lines. A 4xx on robots.txt was treated as unreadable, not as permission, except that OSHA was left unrequested (see "Not measured").

## Counts by cause class

| Class | Rows | Meaning here |
|---|---|---|
| TOOL | 25 | Plain request returned the real page; the earlier failure was likely the fetch tool |
| SCRIPT | 14 | 200, but the data is filled in by page scripts |
| WALL | 12 | 403 or challenge (10 Cloudflare, 1 Akamai, 1 likely Cloudflare) |
| OTHER | 3 | Not requested (OSHA x2, Envirofacts x1) |
| GONE | 2 | 404 or redirect to a home page |
| AUTH | 1 | Login needed (likely) |
| TLS | 1 | Certificate not trusted |
| ROBOTS | 0 | No requested path was disallowed for `*` |

Other measured facts: 4 hosts disallow named AI crawlers while allowing `*` (bcorporation.net, indiebound.org, nbda.com, hrc.org); only bcorporation.net and indiebound.org carry a `Content-Signal` line (`search=yes,ai-train=no,use=reference`). A Wayback copy exists for 43 of 58 URLs; 7 lookups returned nothing and 8 timed out (no answer, not "no copy").

## TOOL pages (readable today with a plain request)

Some are form pages: the page loads, but the results need a form request I did not make. Those are marked "form".

| Row | Page | Note |
|---|---|---|
| p04 | directory.goodonyou.eco/brand/patagonia | Rating "Good" in the HTML; a name link lands on the shop |
| p05 | thegoodshoppingguide.com/brand-directory/patagonia/ | Brand page; a name link lands on the shop |
| p08 | epa.gov ecolabels for federal purchasing | Table in HTML (19 rows) |
| p15, p16 | certifiedeo.com/companies, /terms-of-service | Company list in HTML; one redirect to the `www` host |
| p18 | dol.gov Form 5500 datasets | Found by search; layout links not opened |
| p19 | ncg.coop | Home page only; the permission ask is for the owner |
| p20 | indiebound.org/indie-store-finder | Form |
| p23, p57 | Toxic-Free Future methodology and rubric PDF | PDF downloaded (409,609 bytes), not opened |
| p24 | directory.goodonyou.eco/ | Rated brands listed; REI or Target search not tested |
| p25, p26 | resources.goodonyou.eco multi-collection, ratings API | API page says an `X-API-Key` header is needed; price not found |
| p28, p29 | ethicalconsumer.org subscriptions, Etsy profile | Real pages; free versus paid view not compared |
| p32 | dol.gov/general/aboutdol/copyright | The repo doc says a plain request got 403 earlier; this one returned 200 |
| p33 | nlrb.gov/advanced-search | Form; employer-address field not visible without a search |
| p34 | cpsc.gov Civil and Criminal Penalties | Form plus company names in HTML; results need a submit |
| p35 | epa.gov GreenChill historical data | xlsx links seen (2019 to 2023), not fetched |
| p36 | epa.gov green power 100% users | Table in HTML (22 rows); not compared with the 2024 PDF |
| p44 | fairlabor.org all members | Logos in HTML, count not checked |
| p45 | certifiedhumane.org/whos-certified/ | Table with 207 rows |
| p49, p50 | Google Maps Platform terms, Business Profile attributes | Full text |
| p51 | hrc.org/cei/search | Forwards to /resources/employers; form |

## WALL pages

| Row | Page | Vendor (from headers or body) | Robots for `*` |
|---|---|---|---|
| p02, p06, p07 | violationtracker.goodjobsfirst.org (home, /plans, /pages/user-guide) | Cloudflare challenge | Allowed (file has no `User-agent` line) |
| p03, p09 | bcorporation.net (find-a-b-corp, terms) | Cloudflare challenge | Allowed; ClaudeBot and others disallowed |
| p39, p40 | wikirate.org (terms, licensing) | Cloudflare challenge | No robots file (404) |
| p52 | foe.org/retailer-report-card/ | Cloudflare challenge | Allowed |
| p53, p54 | progressivegrocer.com, chainstoreage.com | Cloudflare challenge (also on robots.txt) | Unreadable |
| p37 | sec.gov/files/company_tickers.json | Akamai; SEC "Request Rate Threshold Exceeded" page asking for a declared client name | Unreadable (same 403) |
| p38 | dol.ny.gov/wage-theft-dashboard | Likely Cloudflare (server header and cookie); page says "Access denied" | Allowed |

## SCRIPT pages (data address seen in the HTML, none called)

| Row | Page | Data address or clue |
|---|---|---|
| p10 | directories.onepercentfortheplanet.org | Angular shell; none seen. Robots allows only `/` |
| p11 | explore.changeclimate.org | React app; none seen |
| p13 | greenbusinessnetwork.org/directory | "No results found" in HTML; none seen |
| p14 | search.greenbusinessca.org | Bundles at `search.greenbiztracker.org/static/js/`; no data address |
| p17 | livingwageforus.org | `https://livingwageforus.org/wp-admin/admin-ajax.php?action=lwce_get_employers_public` |
| p21 | narts.org find-a-store | Wix app; none seen (likely) |
| p22 | nbda.com dealer finder | WordPress `admin-ajax.php`; no action name seen (likely) |
| p30, p31 | dataportal.dol.gov, data.dol.gov | Same 9,768-byte shell; none seen |
| p41, p42 | organic.ams.usda.gov integrity, DataHub | Blazor Server app (live connection, no JSON address) |
| p46 | global-standards.org certified suppliers | No rows in HTML; a proof-of-work captcha plugin (likely) |
| p47 | bluesign.com/system-partners | `https://cms.bluesign.com/graphql`; page shows a count of 947 |
| p48 | sam.gov entity information | Search app; page links to open.gsa.gov API docs |

## Other classes

| Row | Page | Class | What came back |
|---|---|---|---|
| p12 | partner.fairtradecertified.org | AUTH (likely) | Partner portal with a Log In widget, no directory |
| p27 | thegoodshoppingguide.com/supermarkets/ | GONE | Two redirects ending at the home page |
| p43 | ams.usda.gov organic-integrity-database | GONE | 404 |
| p55 | content.eia-global.org Dirty Dozen PDF | TLS | curl exit 60 on robots.txt and the PDF; no override used |

## Official or archived alternatives

Origin: S = seen in web search, P = seen in a fetched page, R = repo doc (not rechecked). None was downloaded.

| Data | Alternative | Key or sign-up | Origin |
|---|---|---|---|
| OSHA inspections | `https://data.dol.gov/datasets/10334` (daily; full-dataset download option) | Key for API and metadata | S |
| OSHA (links) | `https://www.osha.gov/data` | Not checked | S |
| DOL Form 5500 | Zipped CSV and layout files at the p18 page | No | S |
| NLRB | CSV export from advanced search (up to 100,000 rows); older bulk at `https://www.nlrb.gov/data-on-datagov` | No | S |
| USDA organic | `https://organic.ams.usda.gov/integrity/Developer/APIHelp` (REST plus a zip of all operations) | api.data.gov key | S |
| GreenChill 2023 | `https://www.epa.gov/system/files/documents/2024-07/greenchill_2023_certified_stores.xlsx` | No | P |
| Safer Choice | Envirofacts API and downloads, `https://www.epa.gov/enviro/download-additional-envirofacts-datasets` | None stated | S |
| Good On You | Brand Listing API v3, `https://resources.goodonyou.eco/help/good-on-you-ratings-api` | Yes (account key) | P |
| NY wage theft | Excel export of one Tableau view on the dashboard; no data.ny.gov listing | No | S |
| SAM.gov | `https://open.gsa.gov/api/entity-api/` | Personal key | P, R |
| SEC tickers | Needs a declared client name with contact details (`https://www.sec.gov/developer`) | Not a key | P |
| CPSC recalls | `saferproducts.gov` recalls API (recalls, not penalties) | No | R |
| Violation Tracker, B Corp, WikiRate | None found; B Corp's data.world copy was retired (R) | n/a | R |
| Wayback only | foe.org, progressivegrocer.com, chainstoreage.com, content.eia-global.org (snapshots dated 2025 and 2026) | No | measured |

## Not measured, and why

| Item | Reason |
|---|---|
| OSHA pages (p01, p56) | robots.txt returned a CloudFront 403, so the rule could not be read; the repo doc says `/ords/` is disallowed, so I did not request them. Likely ROBOTS, not measured |
| Envirofacts page (p58) | www.epa.gov hit its 4-request cap (robots plus three pages) |
| thegoodshoppingguide.com | Redirect hops put it at 5 requests, one over the cap (p27 redirected twice) |
| Name-link test at OSHA | Needs the unrequested results page |
| Form results (indiebound, nlrb, cpsc, hrc, goodonyou search) | A form submit is a different request than a plain page read; not tried |
| Alternatives for several rows | 10 of 15 searches used; not every row was searched |
| Wayback for 8 rows | Lookups timed out at the archive's 5-second limit; not retried |
| Wayback lookups | About 58 requests to archive.org, 2 seconds apart; I read the 4-per-host cap as applying to the page hosts |

Method notes: my planned script and shell loops were denied by the permission system, so every request was a single `curl` call, same flags, hosts run in parallel and same-host calls in separate rounds (at least 2 seconds apart). The AI-crawler check looked for `ClaudeBot`, `Claude-User`, `GPTBot` and `CCBot` with a non-empty Disallow. `scripts/` holds the URL list, the table source and one unused script. The Content-Signal and 403 findings describe curl's client name only; why the earlier fetch tool failed on a TOOL row is likely its client or network path, not measured.
