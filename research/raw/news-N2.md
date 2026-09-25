# Concern pass 3 (news search): batch N2

Date: 2026-09-25. Rules: brief section 9 ("What counts as a concern", OSHA rule, D1 to D4); news-search-brief.md "Agent task". Searches applicable: 2 for a US retailer with no parent named, 3 otherwise (third about the parent, or the country's regulator for a non-US company). Budget: 30 WebSearch, 30 WebFetch.

## ABLE (ableclothing-com)
- Q1: `"ABLE" "Fashionable" Nashville clothing lawsuit OR settlement OR fine OR violation`. Relevant hits: Nashville Post and BKData on the 2025 Chapter 11 filing (not an action against the company); Fashion Nova ADA settlement (different company).
- Q2: `"ABLE" Nashville "Fashionable Inc" (EEOC OR OSHA OR "Department of Labor" OR FTC OR EPA OR "attorney general")`. Hits: Wikipedia, generic agency and law-firm pages. Nothing relevant.
- Q3: not applicable (US, parent unknown).
- Fetches: none. Concerns added: none. Tier: acceptable -> acceptable ("provisional" removed; 2 of 2 applicable searches ran).

## Avocado Green Mattress (avocadogreenmattress-com)
- Q1: `"Avocado Green Mattress" lawsuit OR settlement OR fine OR violation`. Relevant hits: CPSC recall 2024-08-01 (mattress pads violate federal flammability regulation); 2023 greenwashing class action (dismissed 2023-08-11); law-blog pages claiming the case is still active (contradicted by the CourtListener docket already in the file).
- Q2: `"Avocado Green Mattress" (EEOC OR OSHA OR "Department of Labor" OR FTC OR EPA OR "attorney general")`. Nothing about the company.
- Q3 (parent): `"Avocado Green Brands" lawsuit OR settlement OR fine OR violation OR OSHA OR FTC OR "attorney general"`. Hits: 2023 class action (dismissed), 2025 C.D. Cal. fake-discount suit (private, no ruling). No agency action.
- Fetch: https://www.cpsc.gov/Recalls/2024/Mattress-Pads-Recalled-Due-to-Fire-Hazard-Violation-of-Federal-Mattress-Pad-Flammability-Regulation-Manufactured-by-Avocado-Mattress (quote: "The recalled mattress pads violate the mandatory federal flammability regulation for mattress pads, posing a fire hazard"; company-initiated recall with CPSC, no penalty).
- Concerns added: none. Rule question for the lead (RQ1): is a voluntary CPSC recall that states a federal regulation violation, with no penalty, a "finding"? If yes, which `kind` (governance, as for FTC consumer actions)? Outcome-neutral here: ethics already floored at 0.
- Tier: acceptable -> acceptable ("provisional" removed; 3 of 3 searches ran).

## Back Market (backmarket-com)
- Q1: `"Back Market" lawsuit OR settlement OR fine OR violation`. Relevant hit: UniCourt, Martinez v. Back Market Inc. (E.D.N.Y. 2022, ADA/disability, settled in principle between the parties). Private suit: body note, not a concern. Rest were unrelated (D-Market, Meta, Pfizer).
- Q2: `"Back Market" (EEOC OR OSHA OR "Department of Labor" OR FTC OR EPA OR "attorney general")`. Nothing about the company.
- Q3 (founded in Paris; hq unknown in file, so treated as non-US for the third search): `"Back Market" DGCCRF OR "Autorité de la concurrence" OR CNIL amende OR sanction`. Only general agency pages.
- Fetches: none. Concerns added: none. Tier: acceptable -> acceptable ("provisional" removed; 3 searches ran).

## Best Buy (bestbuy-com)
- Q1: `"Best Buy" lawsuit OR settlement OR fine OR violation`. Relevant hits: CA county DAs' consumer-protection settlement ($558,570 penalties + $75,000 restitution; rivcoda.org, edhat.com, not accepted); TCPA class settlement $4.5M and CA misclassification class settlement $3.25M (private); LCD price-fixing (Best Buy as plaintiff); Violation Tracker parent page (host returns 403, not retried).
- Q2: `"Best Buy" (EEOC OR OSHA OR "Department of Labor" OR FTC OR EPA OR "attorney general")`. Nothing specific.
- Q3 not applicable (US, no parent). Follow-ups: `Best Buy civil penalty CPSC OR "hazardous waste" OR "district attorneys" settlement Best Buy Stores` (found the CPSC release); one domain-limited search failed (tool refuses apnews.com in allowed_domains; counted against budget).
- Fetch: https://www.cpsc.gov/Best-Buy-Agrees-to-Pay-38-million-civil-penalty (2016-10-03; "has agreed to pay a $3.8 million civil penalty for distributing and selling previously recalled consumer products"; no admission).
- Concern added: governance, CPSC civil penalty, 2016-10-03, accepted. Rule: brief section 9 (agency settlement with a fine counts); kind follows the FTC/state consumer-protection rows in walmart-com and overstock-com.
- Not counted: CA DA settlement (no accepted-source page; accepted_source false, body note).
- Tier: acceptable -> caution (ethics 0.5 -> 0.25; total 0.75). "Provisional" removed.

## Better World Books (betterworldbooks-com)
- Q1: `"Better World Books" lawsuit OR settlement OR fine OR violation`. Hits: BBB complaints, Wikipedia, overtimepaylaws.org (generic marketing page, no named case), Authors Guild v. Google (not a party). Nothing counted.
- Q2: `"Better World Books" (EEOC OR OSHA OR "Department of Labor" OR FTC OR EPA OR "attorney general")`. Nothing specific.
- Q3 (parent): `"Better World Libraries" lawsuit OR settlement OR fine OR violation OR "attorney general"`. Only unrelated library litigation (IMLS cuts, Bellwood Public Library).
- Fetches: none. Concerns added: none. Tier: acceptable -> acceptable ("provisional" removed; 3 of 3).

## BLK + GRN (blkgrn-com)
- Q1: `"BLK + GRN" OR "BLK+GRN" lawsuit OR settlement OR fine OR violation`. Hits all about BlackRock (BLK), BCBS; none about the company.
- Q2: `"BLK + GRN" OR "BLK+GRN" (EEOC OR OSHA OR "Department of Labor" OR FTC OR EPA OR "attorney general")`. Generic agency pages only.
- Q3 not applicable (US, no parent). Note: the engine did not honor the quoted name, so this is weak evidence of absence.
- Fetches: none. Concerns added: none. Tier: acceptable -> acceptable ("provisional" removed; 2 of 2).

## Bob's Red Mill (bobsredmill-com)
- Q1: `"Bob's Red Mill" lawsuit OR settlement OR fine OR violation`. Relevant hits: CA AG Prop 65 settlement PDF (ERC v. Bob's Red Mill, RG20062002, $40,000 incl. $19,000 civil penalty); glyphosate suits (individual settlement, Bloomberg Law); cadmium class action; ADA website suit; Bob's Red Mill v. gluten-free trade group.
- Q2: `"Bob's Red Mill" (EEOC OR OSHA OR "Department of Labor" OR FTC OR EPA OR "attorney general")`. Nothing specific.
- Q3 not applicable (US, no parent).
- Fetch: https://oag.ca.gov/system/files/prop65/settlements/2019-01824S8980.pdf (binary; text extracted locally with pdftotext). Proposed consent judgment, judge's signature line blank.
- Concerns added: none (oag.ca.gov not in negative-sources.json; accepted_source false, body note). Existing OSHA concern kept.
- Tier: acceptable -> acceptable ("provisional" removed; 2 of 2).

## Christy Dawn (christydawn-com)
- Q1: `"Christy Dawn" lawsuit OR settlement OR fine OR violation`. Hits: Brittany Dawn (Texas AG settlement, different person), Winston & Strawn influencer article, Prop 65 60-day notice 2016-00377 (subject not checked; private notice, would not count).
- Q2: `"Christy Dawn" (EEOC OR OSHA OR "Department of Labor" OR FTC OR EPA OR "attorney general")`. Generic agency pages and brand reviews.
- Q3 not applicable (US, parent unknown).
- Fetches: none. Concerns added: none. Tier: acceptable -> acceptable ("provisional" removed; 2 of 2).

## Credo Beauty (credobeauty-com)
- Q1: `"Credo Beauty" lawsuit OR settlement OR fine OR violation`. Relevant hit: 2017 "all-natural" class action against Eco-Chic LLC (classaction.org, truthinadvertising.org). Others unrelated (Credo Technology, Ulta Violation Tracker page).
- Q2: `"Credo Beauty" (EEOC OR OSHA OR "Department of Labor" OR FTC OR EPA OR "attorney general")`. Generic agency pages; same class action.
- Q3 not applicable (parent unknown).
- Follow-up (plain curl, CourtListener API, not a WebFetch): caseName "Eco-Chic" -> 6 dockets; Cohen v. Eco-Chic, LLC, N.D. Cal. 4:17-cv-05146, filed 2017-09-05, terminated 2017-11-15, no ruling shown. Private suit: body note.
- Concerns added: none. Tier: acceptable -> acceptable ("provisional" removed; 2 of 2).

## Depop (depop-com)
- Q1: `"Depop" lawsuit OR settlement OR fine OR violation`. Relevant hits: "drip pricing" marketplace-fee class actions (Dinh, dismissed July 2026; Yuen, mediation; Rivera, N.D. Ill. filed 2026-09-15, pending). Private suits: body note.
- Q2: `"Depop" (EEOC OR OSHA OR "Department of Labor" OR FTC OR EPA OR "attorney general")`. Generic agency pages only.
- Q3 (non-US, UK regulator): `Depop ICO OR CMA OR "Advertising Standards Authority" OR "Trading Standards" ruling OR fine OR investigation`. Only the CMA merger review of eBay/Depop, cleared 2026-07-15 (not an action against the company).
- Parent eBay: not searched separately; its concerns live in research/retailers/ebay-com.md and predate the July 2026 purchase, so not carried over (lead may overrule: RQ2).
- Fetches: none. Concerns added: none. Tier: acceptable -> acceptable ("provisional" removed; 3 of 3).

## Batch summary
- 10 of 10 retailers done; "tier is provisional" removed from all 10 (all applicable searches ran).
- Concerns added: 1 (bestbuy-com, CPSC $3.8M civil penalty, 2016-10-03, governance).
- Tier changes: bestbuy-com acceptable -> caution. All others unchanged.
- Budget used: 26 WebSearch (one refused by the tool, counted), 3 WebFetch.
- Rule questions for the lead: RQ1 (voluntary CPSC recall stating a regulation violation, no penalty: finding or not; avocadogreenmattress-com, outcome-neutral); RQ2 (whether a new parent's pre-acquisition actions carry over; depop-com/eBay, not carried over).
- `node research/build-index.mjs`: passes (26 sites, 54 retailers).
