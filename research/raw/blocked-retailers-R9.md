# Blocked pages: retailer researcher R9
checked: 2026-09-25

- https://www.bcorporation.net/en-us/find-a-b-corp/company/avocado-green-mattress (403): wanted B Corp status for avocadogreenmattress.com; no fallback row in data/certifications.json.
- https://directories.onepercentfortheplanet.org/profile/avocado-green-mattress (renders no content to a fetch): wanted 1% for the Planet membership; fallback row used.
- https://www.courtlistener.com/?q=%22Avocado+Mattress%22&type=r (403): web search page; the public REST API search answered instead.
- https://violationtracker.goodjobsfirst.org/?company_op=starts&company=Avocado (403): wanted Violation Tracker penalties for Avocado.
- WebSearch unavailable after the session's search budget ran out (200 of 200); concern searches for later retailers used agency and CourtListener pages fetched directly.
- https://www.azurestandard.com/about (and /about-us, blog posts): page text renders client-side; wanted founding, ownership, parent and marketplace status for Azure Standard.
- https://html.duckduckgo.com/html/ (CAPTCHA): tried as a search fallback; not retried.
- https://directories.onepercentfortheplanet.org/ (renders no content to a fetch): wanted 1% for the Planet membership for azurestandard.com, bobsredmill.com, ecoroots.us and ableclothing.com; none has a fallback row, so none counted.
- https://www.ftc.gov/search?search_api_fulltext=%22Bob%27s+Red+Mill%22 (404): wanted FTC actions naming Bob's Red Mill; FTC site search was not reachable by this URL form, so no FTC check was done for any R9 retailer.
- CourtListener API throttles at 5 requests a minute; web pages (dockets, search) return 403 to plain fetches. Docket details come from the API search results only.
