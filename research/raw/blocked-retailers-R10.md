# Blocked pages, retailer batch R10 (2026-09-25)

- https://violationtracker.goodjobsfirst.org/parent/costco (HTTP 403): wanted Costco's Violation Tracker parent summary for concerns.
- https://violationtracker.goodjobsfirst.org/violation-tracker/-costco-wholesale-corporation-1 (HTTP 403): wanted an individual Costco record.
- Note: WebSearch budget for the session ran out during Costco research; later concern searches used site-native search pages via WebFetch.
- https://www.dol.gov/newsroom/releases?search_api_fulltext=costco (HTTP 403): wanted DOL releases naming Costco.
- https://apnews.com/search?q=costco+lawsuit (fetch tool refused apnews.com): wanted AP coverage of Costco lawsuits or fines.
- https://www.courtlistener.com/docket/74749344/california-department-of-toxic-substances-control-v-calistoga-holdings/ (HTTP 403): wanted to see whether Costco is a defendant in this California DTSC case and what is alleged.
- https://www.bcorporation.net/en-us/find-a-b-corp/company/kotn/ (HTTP 403): wanted to verify Kotn's B Corp certification (no fallback row in data/certifications.json).
- https://directories.onepercentfortheplanet.org/ (robots.txt disallows everything but the home page; the directory is a script-driven app): wanted 1% for the Planet membership for all five R10 retailers. Not checked.
- https://www.changeclimate.org/certified-brands (The Climate Label brand list; climateneutral.org/brands redirects here, then to explore.changeclimate.org; robots.txt disallows Claude-User): wanted Climate Label status for all five R10 retailers. Not checked. climatelabel.org itself has no brand list.
- https://www.bcorporation.net/en-us/find-a-b-corp/company/world-of-books/ (HTTP 403): wanted to verify World of Books' B Corp certification (no fallback row in data/certifications.json).
- https://www.worldofbooks.com/en-us/pages/about-us (HTTP 404 at fetch time; linked from the site footer): wanted ownership and recycling claims from the company's own page.
- https://www.bcorporation.net/en-us/find-a-b-corp/company/eileen-fisher-inc/ (HTTP 403): wanted B Corp status; used the data/certifications.json row instead (verified_this_run: false).
- https://www.eileenfisher.com/ and https://www.eileenfisher.com/a-sustainable-life (fetch tool timed out after 60 s; a plain curl of the home page loaded): wanted the company's own statements on ownership and certifications.
- https://www.madetrade.com/ and https://www.madetrade.com/pages/about (Cloudflare redirect loop to the same URL for the fetch tool and plain curl): wanted company basics (founding, HQ, ownership, marketplace model) and its own certification claims.
- https://www.bcorporation.net/en-us/find-a-b-corp/company/made-trade/ (HTTP 403): wanted to check for a B Corp listing (no fallback row).
