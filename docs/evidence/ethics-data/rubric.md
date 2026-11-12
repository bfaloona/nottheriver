# Research rubric for ethics and environment data sources

Built by the lead from the eight seed sites the operator named (notes: `p1-raters.md`, `p1-scorecards.md`, `p1-epa-and-survey.md` in this folder). Use it to describe every data source and to judge every strategy the same way.

## What the seed sites taught (measured or read on 2026-11-11; details and URLs in the p1 files)

- **Finished scores cannot be copied.** Good Shopping Guide, Ethical Consumer and Good On You each bar reuse or scraping of their ratings without permission. Toxic-Free Future says "All Rights Reserved"; Climate Friendly Supermarkets states nothing; EPA states non-commercial use. What is open to a one-person site is their method and the public records and registries they draw on.
- **Scorecards grade national chains on one narrow topic each** (chemicals, refrigerants, tuna, cocoa, animal welfare). 15 more were found; all but two grade national chains only.
- **Raters grade brands more than shops.** Only Good On You has a method for retailers, and those ratings are not public.
- **Raters treat missing data differently:** Good On You scores "no info" as zero; the site scores unknown as the middle, 0.5.
- **Small independent shops are covered by almost nobody.** The two possible exceptions (Green America's certified businesses, local independent business alliances) are memberships, not grades.

## The three kinds of seller in the site's results

Measured from saved searches, `shop-domains.tsv` (2,182 results, 619 websites; repeated searches counted each time):

| Kind | Share of results | What might exist for it |
|---|---|---|
| National chains (the 41 in `data/chains.json`) | 561 results, 26% | Scorecards, regulator records, company disclosures |
| Brands and online shops selling direct (Lodge, Smithey, Patagonia) | much of the rest of the top 100 websites, which together hold 51% | Certifications, brand raters |
| Small local shops (285 websites appear once) | the long tail | Likely little: memberships, ownership type, what the shop says about itself |

Today 235 results (11%) have an ethics or environment score other than the default, and they sit on a handful of websites (Walmart, Home Depot, REI, Dollar General, Patagonia).

## Fields to record for every source

| Field | What to write |
|---|---|
| F1 Entity | What is graded or listed: shop, chain, brand, product, parent company, employer, or single establishment (one address) |
| F2 Join | How it would be matched to a site result: website domain, company name, parent company, street address. Say how error-prone the match is |
| F3 Topic and direction | Labor, environment, governance, animal welfare, ownership, community. Which of the site's two scores it feeds (ethics, environment) and whether it can raise, lower, or both |
| F4 Coverage | How many entities in total, and how many of the websites in `shop-domains.tsv` it would touch: count the top 100 by hand if feasible, estimate the tail and label it an estimate |
| F5 Evidence strength | Regulator or court record; third-party audited certification; unaudited membership; self-reported; advocacy group's own grading |
| F6 Reuse rights | Quote the license or terms with URL and date read: public domain, open license, permission needed, barred, or not stated. Never assume |
| F7 Form and freshness | API, bulk download, searchable web page, PDF. Date of the newest data and how often it is refreshed |
| F8 One-person upkeep | Your estimate, labeled as an estimate: hours to load it the first time, hours a year to keep it current |
| F9 Meaning of absence | What it means when a shop is not in the source: "not rated", "too small to qualify", "did not apply", or real evidence of nothing bad |
| F10 Risk of harm | How a shop could be wrongly marked up or down, and what a wrong mark would cost that shop or the site |

## How strategies are judged

Each strategy gets a line for each of these, with a number where one is possible:

1. **Coverage:** share of the 2,182 saved results it would move off "unknown", split by the three kinds of seller.
2. **Reuse rights:** does every source it needs allow the use.
3. **Upkeep:** hours to start and hours a year for one person; any running cost in dollars.
4. **Honesty when data is missing:** what the shopper sees for a shop with no data, and whether a shopper could mistake "no data" for "bad" or "fine".
5. **Shopper use:** does it help a person find and use an ethics rating while looking for a product, not just hold more data.
6. **Risk:** harm to a shop from a wrong mark, legal exposure, and how the site corrects an error.
