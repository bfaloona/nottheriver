---
name: The Detox Market
domain: thedetoxmarket.com
type: retailer
goods: [beauty, skincare, personal care, wellness]
ownership: unknown
parent: unknown
hq: Van Nuys, CA
marketplace: unknown
sells_on_amazon: unknown
amazon_owned: false
certifications: []
concerns: []
ethics: 0.5
environment: 0.5
tier: acceptable
mentions: 3
mentioned_by: [amazonalts-org, goingzerowaste-com, sustainablejungle-com]
checked: 2026-09-25
---

The Detox Market sells "clean beauty and wellness" products (skincare, makeup, body care, hair, wellness and home), both curated outside brands and its own lines (The Detox Market, Detox Mode). Its about page lists six stores: New York (Houston St.), Toronto (Spadina, Summerhill, Union Station) and Los Angeles (Santa Monica, West Hollywood), and the site says it is "Celebrating 15 years" of curating. The terms of service give an address of 6910 Hayvenhurst Ave, Suite 100, Van Nuys, CA 91406 and say the store is hosted on Shopify. No fetched page gave its founder, owners or investors, so ownership is `unknown`. The site links pages on ingredient standards, sustainability and a "Plastic Neutral" program with CleanHub; these were not fetched.

Lists recommend it for ingredient standards: AmazonAlts (natural wellness products vetted for ingredients and cruelty-free formulas), Going Zero Waste ("non-toxic, cruelty-free products", "planting 500,000 trees") and Sustainable Jungle ("Natural and organic beauty"). The tree-planting claim did not appear on the homepage fetched this run.

CourtListener shows two private suits: one against The Detox Market Inc. (S.D.N.Y., filed 2020-08-21, Americans with Disabilities Act, terminated 2020-11-09) and one against The Detox Market, Inc. (N.D. Ill., filed 2025-05-08, cause not shown, open). The complaints were not fetched, so what each alleges is unknown and neither is recorded as a concern.

## Rating
- ethics: 0.5 baseline. No B Corp, Fair Trade USA or worker co-op listing verified (bcorporation.net blocked agents this run; no row in data/certifications.json).
- environment: 0.5 baseline. 1% for the Planet not checked (directory returns no data to a plain fetch); no Climate Label listing checked.
- concerns: none recorded. NLRB case search returned no cases (control search "Starbucks" returned 2,559); CourtListener API search found the two suits above. OSHA and Violation Tracker returned 403, and the web search budget ran out before the news pass.
- tier: `acceptable` (0.5 + 0.5 = 1.0, not Amazon-owned per `node research/build-index.mjs --blocklist`).
- Concern search incomplete this run (see raw/blocked-retailers-R7.md); tier is provisional.

## Sources
- https://www.thedetoxmarket.com/
- https://www.thedetoxmarket.com/pages/about-us
- https://www.thedetoxmarket.com/policies/terms-of-service
- https://www.nlrb.gov/search/case/%22Detox%20Market%22
- https://www.courtlistener.com/api/rest/v4/search/?type=r&q=%22The%20Detox%20Market%22
- data/blocklist.md (no match)
