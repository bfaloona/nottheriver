# Blocked pages: retailer researcher R4
checked: 2026-09-25

- https://www.bcorporation.net/en-us/find-a-b-corp/search/?query=package%20free (HTTP 403): wanted B Corp status for Package Free (packagefreeshop.com). Tried once per the brief; not retried for the other R4 retailers (Patagonia uses the data/certifications.json fallback row).
- https://directories.onepercentfortheplanet.org/profile/package-free and https://directories.onepercentfortheplanet.org/profile/patagonia (page renders in the browser only; a fetch returns just the directory title, so a profile can't be confirmed or ruled out): wanted 1% for the Planet membership for Package Free and Patagonia. Patagonia uses the data/certifications.json fallback row.
- WebSearch budget for the session ran out (200 of 200) during Package Free; later concern checks used direct fetches of accepted-source pages instead of site: searches, so they are narrower than the brief asks.
- https://www.justice.gov/archives/opa/pr/walmart-inc-and-brazil-based-subsidiary-agree-pay-137-million-resolve-foreign-corrupt (fetch returned an empty page; web.archive.org copy refused): wanted the 2019 DOJ FCPA resolution for Walmart (walmart.com). Not recorded.
- https://www.courtlistener.com/docket/<id>/... docket pages (HTTP 403 to fetches): wanted docket entries for Walmart, Target, Patagonia, Pact and Package Free cases. Read instead through the CourtListener search API with plain curl (no spoofed headers); the API URLs are in each retailer's Sources.
- Accepted-source search pages returned 403 or 404 (dol.gov, justice.gov and ftc.gov search; violationtracker.goodjobsfirst.org; apnews.com unfetchable; npr.org timed out): wanted concern searches for all five R4 retailers. Concern checks used CourtListener, nlrb.gov case search and Wikipedia-cited justice.gov pages only.
- https://www.npr.org/2022/06/29/1108562327/walmart-money-transfer-scammers-federal-trade-commission-lawsuit (timed out): wanted NPR's report on the FTC's 2022 Walmart suit; the same case is recorded from its CourtListener docket.
- https://www.patagonia.com/ownership/ (returned a site-downtime page): wanted Patagonia's own ownership statement; Wikipedia used instead.
- https://wearpact.com/about (renders only in a browser): wanted Pact's founding, ownership and certification claims.
