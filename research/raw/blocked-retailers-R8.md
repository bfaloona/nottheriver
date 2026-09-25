# Blocked pages, retailer batch R8 (2026-09-25)

- https://www.bcorporation.net/en-us/find-a-b-corp/?query=thredup (HTTP 403): B Corp status for ThredUp, Depop, Girlfriend Collective, Christy Dawn, Mightly. No fallback rows in data/certifications.json for these domains.
- https://violationtracker.goodjobsfirst.org/?company_op=starts&company=<name> (HTTP 403 to WebFetch and plain curl; tried with thredup): Violation Tracker records for ThredUp, Depop, Girlfriend Collective, Christy Dawn, Mightly (same URL with each name).
- https://www.thredup.com/about (HTTP 403 to WebFetch): ThredUp's own description and sustainability claims.
- https://www.depop.com/about/ (HTTP 403 to WebFetch): Depop's own description and its renewable-electricity claim.
- WebSearch (whole run): session search limit (200) used up before R8 started; no general news search was possible for any R8 retailer.
- Accepted sources not searched for any R8 retailer (no working search page without WebSearch): ftc.gov (search URL returned 404), dol.gov, epa.gov, cpsc.gov, sec.gov enforcement (EDGAR full-text search returned 500), justice.gov, uscourts.gov, propublica.org, npr.org, apnews.com. Searched: osha.gov establishment search, nlrb.gov case search, courtlistener.com docket search.
