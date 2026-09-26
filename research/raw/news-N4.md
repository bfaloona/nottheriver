# Concern pass 3 (news search): batch N4

Date: 2026-09-25. Rules: brief section 9 ("What counts as a concern", OSHA rule); news-search-brief.md "Agent task". Searches applicable: 2 for a US retailer with no parent named, 3 otherwise (third about the country's regulator for non-US).

## overstock-com (3 searches: US, parent named)

Queries:
- `"Overstock" lawsuit OR settlement OR fine OR violation`
- `"Overstock" (EEOC OR OSHA OR "Department of Labor" OR FTC OR EPA OR "attorney general")` (only generic agency pages)
- `"Beyond, Inc." OR "Neighborhood Intelligence" Overstock SEC OR "attorney general" settlement OR fine`

Relevant hits:
- California $6.8M "Compare At" pricing penalty (Yahoo Finance, Manatt, Top Class Actions): judgment in a suit by California district attorneys, affirmed by the Court of Appeal 2017-06-02. Accepted source found: CourtListener opinion 6238839 (page renders empty; quotes read through the CourtListener search API: "appeals a judgment entered after the trial court found it had engaged in unfair business practices", "imposed $6,828,000 in civil penalties", "The judgment is affirmed.").
- CARB settlement, June 2025, $13,485 for uncertified indoor air cleaners (ww2.arb.ca.gov, fetched). Not an accepted source; no accepted page found.
- Not concerns: 2016 release headlined "Overstock.com Accepts $20 Million to Settle Market Manipulation Case" (Overstock receiving money; not fetched); Missouri tax class action (private); Delaware unclaimed property (reversed 2020, already noted).

Concerns added: governance, People v. Overstock.com (accepted); environmental, CARB (accepted_source: false).
Tier: acceptable -> caution (ethics 0.5 -> 0.25; total 0.75). Rule: a court judgment is a concern (brief 9); concerns count regardless of age, the 5-year window only gates `recommended`.
"Tier is provisional" removed (3 of 3 searches ran).

## packagefreeshop-com (2 searches: US, no parent named)

Queries:
- `"Package Free" Lauren Singer lawsuit OR settlement OR fine OR violation` (founder's name added: "Package Free" alone matches generic packaging text)
- `"Package Free" shop (EEOC OR OSHA OR "Department of Labor" OR FTC OR EPA OR "attorney general")`

Relevant hits: none (company pages, founder profiles, generic agency pages, unrelated cases).
Concerns added: none. Tier: acceptable -> acceptable. "Tier is provisional" removed (2 of 2 applicable searches ran).

## poshmark-com (3 searches: US, parent Naver named)

Queries:
- `"Poshmark" lawsuit OR settlement OR fine OR violation`
- `"Poshmark" (EEOC OR OSHA OR "Department of Labor" OR FTC OR EPA OR "attorney general")` (generic agency pages only)
- `"Naver" Poshmark fine OR settlement OR regulator OR "Fair Trade Commission"`

Relevant hits: Bragar Eagel & Squire shareholder investigation (private, no ruling). KFTC fines on Naver (2020: 26.7bn won Naver Shopping self-preferencing, reportedly overturned by Korea's Supreme Court in Oct 2025; 1bn won data deal), from Korea Herald, The Investor, Kim & Chang, Truth on the Market. None fetched.
Concerns added: none. Rule applied (no written convention found in other batches' files): a parent's action counts against a retailer only when it concerns the retailer's own business; Naver's Korean cases don't, and no accepted source reports them anyway.
Tier: acceptable -> acceptable. "Tier is provisional" removed (3 of 3).

## powells-com (2 searches: US, parent none)

Queries:
- `"Powell's Books" lawsuit OR settlement OR fine OR violation`
- `"Powell's Books" (EEOC OR OSHA OR "Department of Labor" OR BOLI OR NLRB OR "attorney general")` (BOLI and NLRB added: Oregon labor bureau, and the union's charges)

Relevant hits: Powell's Books v. Kroger (Powell's as plaintiff; Oregon law struck down by the Ninth Circuit). NLRB 19-CA-288784 (already in file, dismissed 2022).
Concerns added: none. Tier: acceptable -> acceptable. "Tier is provisional" removed (2 of 2 applicable).

## publicgoods-com (2 searches: US, no parent named)

Queries:
- `"Public Goods" OR "Don't Run Out, Inc." lawsuit OR settlement OR fine OR violation` (legal name from the terms of service added)
- `"Public Goods" publicgoods.com (EEOC OR OSHA OR "Department of Labor" OR FTC OR EPA OR "attorney general" OR "Proposition 65")` (generic Prop 65 pages only)

Relevant hits: FDA warning letter 626847, 2022-03-11, to Don't Run Out dba Public Goods (fetched): "did not develop, maintain, and follow an FSVP as required by section 805 of the FD&C Act". Casillas v. Don't Run Out (E.D. Cal. 22-1153, private, already in file). NSF public notice (certifier, not fetched).
Concerns added: governance, FDA warning letter, accepted_source: false (fda.gov is not on the accepted list). Rule: an agency finding counts only on an accepted source.
Tier: acceptable -> acceptable. "Tier is provisional" removed (2 of 2 applicable).
Note for lead: fda.gov is not in data/negative-sources.json; adding it would make this row count (Public Goods would drop to caution).

## shop-app (3 searches: non-US, parent Shopify; third about Canada's regulators)

Queries (use "Shopify" because "Shop" is too generic to search):
- `"Shop app" OR "Shopify" lawsuit OR settlement OR fine OR violation`
- `"Shopify" (EEOC OR OSHA OR "Department of Labor" OR FTC OR EPA OR "attorney general")` (generic agency pages only)
- `Shopify "Competition Bureau" OR "Privacy Commissioner" OR "Canada Revenue Agency" investigation OR finding OR penalty`

Relevant hits: Sezzle v. Shopify antitrust suit (private, no ruling); Shopify v. Shopline copyright settlement (Shopify plaintiff); CRA merchant-records case (Federal Court for Shopify June 2025; FCA preservation order Jan 2026). None fetched; none is an accepted source.
Concerns added: none. Rule: a records-production or preservation order is not a finding against the company; private suits with no ruling are notes.
Tier: acceptable -> acceptable. "Tier is provisional" removed (3 of 3).

## tenthousandvillages-com (2 searches: US, parent none)

Queries:
- `"Ten Thousand Villages" lawsuit OR settlement OR fine OR violation`
- `"Ten Thousand Villages" (EEOC OR OSHA OR "Department of Labor" OR FTC OR EPA OR "attorney general" OR CPSC)`

Relevant hits: none (The Villages Health System and other unrelated "Villages" entities; Idealist listings; generic agency pages).
Concerns added: none. Tier: acceptable -> acceptable. "Tier is provisional" removed (2 of 2 applicable).

## thedetoxmarket-com (3 searches: US; parent found during this pass)

Queries:
- `"The Detox Market" lawsuit OR settlement OR fine OR violation`
- `"Detox Market" (EEOC OR OSHA OR "Department of Labor" OR FTC OR FDA OR "attorney general" OR "Proposition 65")`
- `"Violet Grey" lawsuit OR settlement OR fine OR "attorney general" OR FTC` (added after the parent turned up)

Relevant hits: none against the company (Teami, Goddess Detox, GoLean Detox are other firms). BeautyMatter 2025-08-28 "Violet Grey Acquires The Detox Market" (fetched): "The retailer quietly acquired The Detox Market earlier this year". `parent` changed unknown -> Violet Grey; ownership left unknown. Violet Grey search: only unrelated cases (Greystar etc.).
Concerns added: none. Tier: acceptable -> acceptable. "Tier is provisional" removed (3 of 3, parent included).

## worldofbooks-com (3 searches: non-US; third about UK regulators)

Queries:
- `"World of Books" OR "Wob" Ziffit lawsuit OR settlement OR fine OR violation`
- `"World of Books" (EEOC OR OSHA OR "Department of Labor" OR FTC OR EPA OR "attorney general")` (generic agency pages only)
- `"World of Books" OR Ziffit "Health and Safety Executive" OR "Environment Agency" OR ICO OR CMA OR "Advertising Standards Authority" fine OR ruling OR prosecution`

Relevant hits: none against the company (Trustpilot and BBB customer complaints; general CMA/ICO enforcement articles not naming it).
Concerns added: none. Tier: acceptable -> acceptable. "Tier is provisional" removed (3 of 3).
Lead note (outside this pass, not acted on): the third search returned a B Lab directory URL, https://www.bcorporation.net/en-us/find-a-b-corp/company/world-of-books-group/ . If the operator can open it and it shows a current certification, a verified b_corp row would add +0.25 ethics (total 1.25, no accepted concern) and move World of Books to `recommended`.

## Totals

- 9 of 9 retailers done. WebSearch 23 of 30; WebFetch 9 of 30 (2 were CourtListener opinion pages that render empty; use the search API with `cluster_id:` instead).
- Tier changes: overstock-com acceptable -> caution. All others unchanged (acceptable).
- Concerns added: 1 accepted (Overstock, People v. Overstock.com, 2017), 2 not accepted (Overstock CARB 2025; Public Goods FDA warning letter 2022).
- Other field change: thedetoxmarket-com `parent` unknown -> Violet Grey.
- `node research/build-index.mjs`: passes (26 sites, 54 retailers).
