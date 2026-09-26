# Blocked pages: retailers R6
checked: 2026-09-25

- https://violationtracker.goodjobsfirst.org/parent/overstockcom-inc (overstock-com): wanted Good Jobs First's list of penalties for Overstock.com. WebFetch got HTTP 403 Forbidden. No claims made from it. Operator check needed.
- https://violationtracker.goodjobsfirst.org/?company=poshmark, ?company=powell%27s, ?company=kobo (poshmark-com, powells-com, kobo-com): wanted any Violation Tracker penalties. HTTP 403 Forbidden on each. No claims made. Operator check needed.
- https://www.bcorporation.net/en-us/find-a-b-corp/search?query=kobo (kobo-com): wanted B Corp status. HTTP 403. No claim made.
- https://www.bcorporation.net/en-us/find-a-b-corp/company/hive-brands/ (lovegrown-com, guessed profile URL): wanted to verify Love Grown's own "Certified B Corporation" claim (Hive Brands / Love Grown, Inc). HTTP 403; no row in data/certifications.json. Not counted. Operator check needed; this one would change the rating (+0.25 ethics).
- https://directories.onepercentfortheplanet.org/ (all five R6 retailers): wanted 1% for the Planet membership. The directory is script-rendered; the served HTML and WebFetch show no listings. Not probed further; no claims made. Operator check needed.
- https://www.powells.com/about-us and https://www.powells.com/ (powells-com): wanted Powell's own about text. HTTP 403 (WebFetch and plain curl). Wikipedia used instead.
- https://www.kobo.com/us/en/p/about-us and https://www.kobo.com/ (kobo-com): wanted Kobo's own about text and sustainability claims. HTTP 403. Wikipedia used instead.
- https://www.overstock.com/ (overstock-com): wanted current brand description. HTTP 403 (plain curl). SEC filings used instead.
- https://www.courtlistener.com/?q=%22Poshmark%22&type=r (poshmark-com): wanted court dockets naming Poshmark. HTTP 403. https://www.courtlistener.com/opinion/7326812/reichman-v-poshmark-inc/ fetched but returned no readable content. No claims made.
- https://www.ftc.gov/search?search_api_fulltext=<name> (404) and https://www.justice.gov/search?keys=Overstock.com (403): wanted agency actions for R6 retailers. No claims made. WebSearch budget (200 per session) was exhausted before site: searches of osha.gov, dol.gov, epa.gov, cpsc.gov, apnews.com, npr.org and propublica.org could be run for any R6 retailer; those checks are still owed.
