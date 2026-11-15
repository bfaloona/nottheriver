# Answers from the script-filled pages
Status: closed

Run: `node research/fetch-page.mjs --browser` once on 11 URLs, 2026-11-15. Files are in `handoff/blocked-pages/fetched-script-pages/`. Chars are the script's `text_chars` (plain / rendered). "Stopped" is `blocked_by_robots`. Terms questions are `skipped: operator's ruling`. Quote files are named without the folder.

| # | URL | Script result | Question (section 10) | Verdict | Answer | Quote and file |
|---|---|---|---|---|---|---|
| 1 | explore.changeclimate.org | plain ok 2,618; rendered ok 4,246; stopped 0 | Member counts; terms; do retailers appear | partly | 148 certified brands (the page's own total; "Showing 1 to 12 of 148", 5 page links). Counted 12 names in the A-Z block and 10 featured. REI and Etsy are featured, so at least one retailer-type brand and a marketplace appear, but the page has no shop category and 148 is not itemized. Terms: skipped: operator's ruling. | "Showing 1 to 12 of 148 brands" (explore.changeclimate.org.rendered.txt:207) |
| 2 | search.greenbusinessca.org | plain shell 16; rendered shell 188; stopped 0 | Listings, counts, share that are shops | not answerable | Only the menu rendered; no listings or counts. The menu has a "Shopping & Retail" category, so shops likely appear, but the share is unknown. Plain text is just the title. | "Shopping & Retail" (search.greenbusinessca.org.rendered.txt:6) |
| 3 | livingwageforus.org/living-wage-employers/ | plain ok 4,558; rendered ok 2,271; stopped 0 | Directory size; reuse (terms); share that are shops | not answerable | No employer names in either text. The page claims "300+" partner employers and shows a pager ("1 2 3") with blank slots (likely logos, not text); the claim is not a counted list. Reuse: skipped: operator's ruling. | "300+ Employers Partnered with Living Wage for Us" (livingwageforus.org_living-wage-employers.rendered.txt:33-34) |
| 4 | narts.org/find-a-narts-member-store | plain ok 7,911; rendered ok 4,991; stopped 0 | Test a bookshop, thrift shop, bike shop; terms; whether public | partly | This is a landing page, not the directory. It says the directory is on "the NARTS member website", which this run did not load, so the three test shops were not tested. It invites shoppers to search by location, so likely public, unverified. Terms: skipped: operator's ruling. Only sign-in link to `members.narts.org` appears in the HTML. | "you'll be taken to the NARTS member website. There, you can search participating stores by location" (www.narts.org_find-a-narts-member-store.rendered.txt:68) |
| 5 | nbda.com/dealer-finder-member-directory/ | robots-disallowed; no fetch; no render | Test a bike shop; terms; whether public | not fetched: robots | robots.txt disallows this path, so nothing was requested. Terms: skipped: operator's ruling. | none (index.jsonl line 5: `"class":"robots-disallowed"`) |
| 6 | data.dol.gov | plain shell 0; rendered shell 0; stopped 2 | Is there a no-key CSV of wage and OSHA cases; file URLs; license | not answerable | Empty page: a JavaScript app that rendered no text. The script stopped 2 of its own same-site requests because robots.txt closes those paths (which two is not recorded), so the app likely could not load its data. License: skipped: operator's ruling. | "You need to enable JavaScript to run this app." (data.dol.gov.html, noscript tag) |
| 7 | organic.ams.usda.gov/integrity/ | plain shell 114; rendered shell 0; stopped 0 | Downloads; terms; do retailers appear | not answerable | Page is an app error screen; the browser got no text at all. Terms: skipped: operator's ruling. | "An error has occurred. This application may no longer respond until reloaded." (organic.ams.usda.gov_integrity.txt:2) |
| 8 | organic.ams.usda.gov/integrity/Reports/DataHub.aspx | plain shell 114; rendered shell 0; stopped 0; redirected to `/integrity/Reports/DataHub` | Downloads; terms; do retailers appear | not answerable | Same error screen as row 7; no download list. Terms: skipped: operator's ruling. | "An error has occurred. This application may no longer respond until reloaded." (organic.ams.usda.gov_integrity_Reports_DataHub.aspx.txt:2) |
| 9 | global-standards.org/suppliers/certified-suppliers | plain ok 6,072; rendered ok 991; stopped 0 | Counts; terms (makers, not shops) | not answerable | Search results never loaded: plain shows "Loading…", rendered shows "Failed to fetch". No count. The intro says it covers suppliers "along the entire supply chain", so likely makers, not shops. Terms: skipped: operator's ruling. | "Failed to fetch" (global-standards.org_suppliers_certified-suppliers.rendered.txt:15) |
| 10 | bluesign.com/system-partners | plain ok 6,704; rendered ok 5,601; stopped 0 | Counts; terms (makers, not shops) | answered | 947 entries; sector tabs: 91 brands and retailers, 346 chemical suppliers, 381 manufacturers, 126 converters, 3 technology providers (sum checked: 947). Separate "System Partner Brands": 117. Page shows 50 rows of 19 pages; of those 50, 12 are labeled "Brand & Retailer" (counted with grep), and the names (adidas, ASICS, Berghaus) are brands, likely not shops. Terms: skipped: operator's ruling. | "947 results" (www.bluesign.com_system-partners.rendered.txt:101) |
| 11 | sam.gov/content/entity-information (final URL sam.gov/entity-information) | plain ok 6,046; rendered ok 4,597; stopped 0 | Scraping and caching terms; owner-attribute rules | partly | Terms: skipped: operator's ruling. Owner-attribute rules are not on this page. It does offer entity data files, an Entity Management API and a search box; no counts or field list are shown. Public file link seen in plain text: `/data-services/Entity%20Registration?privacy=Public`. | "Download Data Files" (sam.gov_content_entity-information.rendered.txt:88) |

## What the browser added

| Page | Result |
|---|---|
| explore.changeclimate.org | Browser read the totals (148 brands, 867,074 tCO2e, $23,552,619) and brand names; plain text had headings only. |
| global-standards.org | Browser added only the error "Failed to fetch"; no data. |
| search.greenbusinessca.org | Browser added the menu, no listings. |
| Others read | Plain and rendered text matched in substance (livingwageforus, narts, bluesign, sam). |

## Still unreadable

| Page | Why |
|---|---|
| nbda.com | robots.txt disallows the path; not requested. |
| data.dol.gov | JavaScript app; 2 own-site requests stopped by robots.txt; no text. |
| organic.ams.usda.gov (both) | App shows an error screen; no text. |
| global-standards.org | Results call failed ("Failed to fetch"); cause unknown, not a robots stop (stopped 0). |
| search.greenbusinessca.org | Search app rendered only its menu; no search was run. |
| livingwageforus.org | Employer names not in the text; likely images. |
| narts.org | Directory is on another site, not part of this run. |
