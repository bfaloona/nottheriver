# Concern pass 3 (news search), batch N1

Date: 2026-09-25. Brief: `research/raw/news-search-brief.md` ("Agent task"). Rules: brief.md section 9 ("What counts as a concern", OSHA citations).
Applicable searches: 2 for a US retailer whose file names no parent, 3 for Patagonia (parent named) and Tentree (non-US; third search about Canada's regulators).

Counters (final): WebSearch 25 of 30, WebFetch 6 of 30 (per-retailer running counts below).

## Control check (search 2 query shape)
- Query: `"Dollar General" (EEOC OR OSHA OR "Department of Labor" OR FTC OR EPA OR "attorney general")`
- Result: dol.gov and osha.gov releases on the 2024 $12M OSHA settlement, EEOC settlement page. The query shape does return agency actions when they exist, so a null for a retailer is a real null for this engine, not a broken query.

## bookshop-org
- Q1: `"Bookshop.org" lawsuit OR settlement OR fine OR violation` : hits about Avid Bookshop (a different store suing a Georgia jail), Authors Guild v. Google, US v. Apple; none about Bookshop.org.
- Q2: `"Bookshop.org" (EEOC OR OSHA OR "Department of Labor" OR FTC OR EPA OR "attorney general")` : only agency home and help pages; none about Bookshop.org.
- Concerns added: none. Tier: recommended -> recommended (no longer provisional; 2 of 2 applicable searches ran, no parent named).

## eileenfisher-com
- Q1: `"Eileen Fisher" lawsuit OR settlement OR fine OR violation` : Fisher Investments, Fisher-Price, other "Fisher" cases, Wikipedia; none about the brand.
- Q2: `"Eileen Fisher" (EEOC OR OSHA OR "Department of Labor" OR FTC OR EPA OR "attorney general")` : agency home pages, Wikipedia; none about the brand.
- Concerns added: none. Tier: recommended -> recommended (not provisional; 2 of 2 applicable, parent unknown).
- Counters: WebSearch 5, WebFetch 0.

## equalexchange-coop
- Q1: `"Equal Exchange" lawsuit OR settlement OR fine OR violation` : one relevant hit, CA AG Prop 65 notice 2015-01250 (McCartney v. Equal Exchange, cadmium in baking cocoa). Fetched https://oag.ca.gov/prop65/60-day-notice-2015-01250: "out-of-court settlement (not court-approved)", 2016-06-26, $12,500 civil penalty + $40,000 fees. Other hits: SEC Equal Earth, EEOC Columbia, unrelated.
- Q2: `"Equal Exchange" (EEOC OR OSHA OR "Department of Labor" OR FTC OR EPA OR "attorney general")` : agency home pages only.
- Rule: brief section 9 "What counts as a concern" (a private party's settlement is not an agency or court action; same treatment as Etsy's 2024 Prop 65 settlement in pass 1); oag.ca.gov is also not in data/negative-sources.json. Noted in body.
- Concerns added: none. Tier: recommended -> recommended (not provisional; 2 of 2 applicable).
- Counters: WebSearch 7, WebFetch 1.

## etsy-com
- Q1: `"Etsy" lawsuit OR settlement OR fine OR violation` : private suits only. Pixel-tracking privacy class action (valueaddedresource.net: plaintiff moved to dismiss voluntarily); CCMI v. Etsy false-advertising suit, dismissed with prejudice 2023-02-03 (valueaddedresource.net); 2015-16 securities class action dismissed 2017-03-24 (sec.gov 10-Q snippets; sec.gov not fetched, HTTP 403 per brief). Copyright-subpoena law-firm page.
- Q2: `"Etsy" (EEOC OR OSHA OR "Department of Labor" OR FTC OR EPA OR "attorney general")` : agency and law-firm pages only.
- Rule: brief section 9 (private suits without a ruling and dismissed actions are body notes).
- Concerns added: none. Tier: recommended -> recommended (not provisional; 2 of 2 applicable, parent none).
- Counters: WebSearch 9, WebFetch 1.

## grove-co
- Q1: `"Grove Collaborative" lawsuit OR settlement OR fine OR violation` : CA AG Prop 65 settlement PDF (APS&EE v. Grove, lead in 8 Greens products, notices 2025-06-26 and 2025-07-23); SEC 10-K snippets on a Santa Clara County DA investigation of auto-renewal practices (no proceeding commenced); Jones v. Grove Collaborative ADA website suit (2020); Grove Square Coffee (different company).
- Q2: `"Grove Collaborative" (EEOC OR OSHA OR "Department of Labor" OR FTC OR EPA OR "attorney general")` : agency pages; businesswire releases on EPA Safer Choice Partner of the Year awards (2020, 2021).
- Q3 (spare, follow-up): `Grove Collaborative automatic renewal district attorney settlement judgment` : no Grove settlement or judgment found (CART settlements with other companies only).
- Fetched https://oag.ca.gov/system/files/prop65/settlements/2025-02024S7130.pdf (PDF saved by WebFetch, read with pdftotext): private settlement agreement, "Grove denies all allegations".
- Rule: brief section 9 (private settlement and open investigation are body notes). Also updated the pass-1 Rating bullet that said the concern list "may be incomplete".
- Concerns added: none. Tier: recommended -> recommended (not provisional; 2 of 2 applicable, parent none).
- Counters: WebSearch 12, WebFetch 2.

## mightly-com
- Q1: `"Mightly" lawsuit OR settlement OR fine OR violation` : unrelated (Meta, HIPAA, TCPA, University of Phoenix); none about Mightly.
- Q2: `"Mightly" (EEOC OR OSHA OR "Department of Labor" OR FTC OR EPA OR "attorney general")` : agency and law-firm pages only.
- Concerns added: none. Tier: recommended -> recommended (not provisional; 2 of 2 applicable, parent unknown).
- Note: the helper scratchpad is shared with peer agents (a peer overwrote a same-named helper script mid-run); checked that bookshop, eileenfisher, equalexchange, etsy and grove each hold exactly one News pass paragraph naming their own queries. Helpers now live in scratchpad/n1/.
- Counters: WebSearch 14, WebFetch 2.

## patagonia-com
- Q1: `"Patagonia" lawsuit OR settlement OR fine OR violation` : Patagonia v. Pattie Gonia trademark suit (Jan 2026, Patagonia is plaintiff); CA AG Prop 65 notice 2022-00855 (Patagonia Provisions, lead in crackers); classaction.org pixel-tracking suit (May 2024, private); CARB page "W. Los Angeles Building Materials Settlement".
- Q2: `"Patagonia" (EEOC OR OSHA OR "Department of Labor" OR FTC OR EPA OR "attorney general")` : agency pages, Fair Labor Association profile, Law.com hire story; nothing about an action.
- Q3 (parent): `"Holdfast Collective" OR "Patagonia Purpose Trust" lawsuit OR settlement OR fine OR violation OR IRS` : tax-structure commentary only; no action.
- Fetched https://oag.ca.gov/prop65/60-Day-Notice-2022-00855: "Out of court settlement", 2022-12-07, $4,000 penalty + $26,000 fees, private noticing party.
- Fetched https://ww2.arb.ca.gov/node/6371 (301) -> https://ww2.arb.ca.gov/w-los-angeles-building-materials-settlement-0: "Patagonia Building Supplies, Inc." (2009), a different company.
- Rule: brief section 9 (private settlement and private suits are body notes; oag.ca.gov not accepted).
- Concerns added: none (existing NLRB 2020 concern unchanged). Tier: recommended -> recommended (not provisional; 3 of 3 applicable).
- Counters: WebSearch 17, WebFetch 5.

## tentree-com
- Q1: `"Tentree" lawsuit OR settlement OR fine OR violation` : unrelated (HIPAA, justice.gov CRT index, Telluride, NHTSA); none about Tentree.
- Q2: `"Tentree" (EEOC OR OSHA OR "Department of Labor" OR FTC OR EPA OR "attorney general")` : agency pages and Wikipedia bios only.
- Q3 (Canada): `"Tentree" ("Competition Bureau" OR WorkSafeBC OR "Employment Standards" OR "Environment and Climate Change Canada" OR greenwashing)` : Competition Bureau greenwashing guidance and law-firm commentary; nothing naming Tentree.
- Updated the pass-1 Rating bullet that said the regulator and news searches had not run.
- Concerns added: none. Tier: recommended -> recommended (not provisional; 3 of 3 applicable).
- Counters: WebSearch 20, WebFetch 5.

## uncommongoods-com
- Q1: `"Uncommon Goods" OR "UncommonGoods" lawsuit OR settlement OR fine OR violation` : CA AG Prop 65 notice 2005-00214 (Brimer v. UncommonGoods, lead in glassware); Citizens Insurance v. Uncommon, LLC (a different company); a declaratory trademark suit by phone-case maker Uncommon against UncommonGoods; BBB, Trustpilot, own pages.
- Q2: `"Uncommon Goods" (EEOC OR OSHA OR "Department of Labor" OR FTC OR EPA OR "attorney general")` : agency pages, Wikipedia.
- Fetched https://www.oag.ca.gov/prop65/60-Day-Notice-2005-00214: out-of-court settlement 2006-05-11, $1,600 penalty + $16,400 fees, "A court judgment was entered on December 21, 2006 pursuant to the settlement agreement."
- Rule: brief section 9 source rule (oag.ca.gov not in data/negative-sources.json, so at most `accepted_source: false`); also not a labor, governance or environmental kind, and 20 years old. Kept as a body note rather than a row. Lead may want to decide whether court-entered Prop 65 judgments on private suits should become `accepted_source: false` rows.
- Updated the pass-1 Rating bullet that said the concern list "may be incomplete".
- Concerns added: none. Tier: recommended -> recommended (not provisional; 2 of 2 applicable, parent none).
- Counters: WebSearch 22, WebFetch 6.

## wearpact-com
- Q1: `"Wear Pact" OR "Pact organic" lawsuit OR settlement OR fine OR violation` : FTC v. Pact, Inc. (2017, mobile-app company; name collision already documented in pass 2); BBB complaints page; own site pages; unrelated PACT Act items.
- Q2: `"Wear Pact" (EEOC OR OSHA OR "Department of Labor" OR FTC OR EPA OR "attorney general")` : agency pages; the tool also ran a follow-up plain "Wear Pact" query itself (counted as a second search): Trustpilot, BBB, PitchBook, a mamavation.com PFAS lab report on Pact leggings (consumer testing, not an action).
- Concerns added: none. Tier: recommended -> recommended (not provisional; 2 of 2 applicable, parent unknown).
- Counters: WebSearch 25 (counting the tool's internal follow-up), WebFetch 6.

## Summary
- 10 of 10 retailers done; all applicable searches ran for each, so "tier is provisional" was removed from all 10.
- Concerns added: 0. Tier changes: none (all remain `recommended`).
- Body notes only (not concerns): Prop 65 private settlements for Equal Exchange (2016), Grove (2025), Patagonia Provisions (2022), Uncommon Goods (2006, court judgment entered on the settlement); Santa Clara County DA auto-renewal investigation of Grove (open, no proceeding per 10-K snippets).
- For the lead: whether a court-entered judgment on a private Prop 65 suit should be an `accepted_source: false` row (Uncommon Goods 2006) rather than a body note.
