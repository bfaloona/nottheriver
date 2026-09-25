# Concern pass 3 (news search): batch N3

Date: 2026-09-25. Rules: brief section 9 ("What counts as a concern", OSHA rule); news-search-brief.md "Agent task". Searches applicable: 2 for a US retailer whose file names no parent, 3 otherwise (third about the country's regulator for non-US: Kobo, Kotn).

## earthhero-com
- Q1 `"EarthHero" lawsuit OR settlement OR fine OR violation`: only Earth Rated (pet products) class settlement, a name collision; no EarthHero hit.
- Q2 `"EarthHero" (EEOC OR OSHA OR "Department of Labor" OR FTC OR EPA OR "attorney general")`: agency landing pages only.
- Q3 (parent from certifier record) `"ZeroWasteStore" lawsuit OR settlement OR fine OR violation OR FTC OR "attorney general"`: other companies' FTC cases only.
- Fetches: none. Concerns added: none. Tier: acceptable -> acceptable (provisional removed: 3 of 3 searches ran).
- Rule decided it: none. Running totals: 3 searches, 0 fetches.

## ecoroots-us
- Q1 `"EcoRoots" lawsuit OR settlement OR fine OR violation`: Trustpilot, CB Insights (a different UK Ecoroots), Facebook, other companies' CARB/water-board settlements; no action against EcoRoots.
- Q2 `"EcoRoots" (EEOC OR OSHA OR "Department of Labor" OR FTC OR EPA OR "attorney general")`: agency landing pages only.
- No parent named: 2 searches applicable.
- Fetches: none. Concerns added: none. Tier: acceptable -> acceptable (provisional removed: 2 of 2 searches ran).
- Rule decided it: none. Running totals: 5 searches, 0 fetches.

## girlfriend-com
- Q1 `"Girlfriend Collective" lawsuit OR settlement OR fine OR violation`: word matches only ("girlfriend", "collective action"); nothing on the company.
- Q2 `"Girlfriend Collective" (EEOC OR OSHA OR "Department of Labor" OR FTC OR EPA OR "attorney general")`: agency landing pages only.
- Extra Q (noise check) `"Girlfriend Collective" leggings class action OR lawsuit OR recall`: brand site, femfounded case study, LuLaRoe and other brands' PFAS suits; nothing on the company.
- No parent named: 2 searches applicable (3 run).
- Fetches: none. Concerns added: none. Tier: acceptable -> acceptable (provisional removed).
- Rule decided it: none. Running totals: 8 searches, 0 fetches.

## kobo-com
- Q1 `"Rakuten Kobo" lawsuit OR settlement OR fine OR violation`: Pop Top Corp. v. Rakuten Kobo (patent; fee award to Kobo upheld), Sinostar Global v. Rakuten Kobo (E.D. Tex. 4:20-cv-00096, private settlement, dismissed with prejudice), MLex on Rakuten Group winning a Japanese seller suit, Kobo's challenge of the Canadian ebooks consent agreement.
- Q2 `"Rakuten Kobo" OR "Kobo Inc" (EEOC OR OSHA OR "Department of Labor" OR FTC OR EPA OR "attorney general")`: agency landing pages, same private suits; no agency action.
- Q3 (Canada regulator) `Kobo "Competition Bureau" OR "Competition Tribunal" OR "Privacy Commissioner" Canada ebook`: Competition Bureau ebooks consent agreements were with Hachette, Macmillan, Simon & Schuster, HarperCollins; Kobo was the challenger (lost at the Federal Court of Appeal), not a respondent.
- Note: Canadian regulator pages (canada.ca) are not in negative-sources.json, so a Canadian action could only be a body note unless an accepted US outlet reported it.
- Fetches: none (nothing qualified). Concerns added: none. Tier: acceptable -> acceptable (provisional removed: 3 of 3 searches ran).
- Rule decided it: "What counts as a concern" (private suits and settlements between private parties are not agency or court actions against the company). Running totals: 11 searches, 0 fetches.

## kotn-com
- Q1 `"Kotn" clothing lawsuit OR settlement OR fine OR violation`: Kotn terms page, Wikipedia, other companies' cases (Kohl's, Shein LA County DA settlement, Nike trademark); nothing on Kotn.
- Q2 `"Kotn" (EEOC OR OSHA OR "Department of Labor" OR FTC OR EPA OR "attorney general")`: agency landing pages only.
- Q3 (Canada regulator) `"Kotn" "Competition Bureau" OR "Ministry of Labour" OR "Employment Standards" OR greenwashing Canada`: Competition Bureau greenwashing guidance, its Lululemon probe, Ontario ESA explainers, Kotn business coverage; nothing on Kotn. (The search tool ran follow-up queries inside this one call.)
- Fetches: none. Concerns added: none. Tier: acceptable -> acceptable (provisional removed: 3 of 3 searches ran).
- Rule decided it: none. Running totals: 14 searches, 0 fetches.

## libro-fm
- Q1 `"Libro.fm" lawsuit OR settlement OR fine OR violation`: own terms/support pages, Wikipedia, ABA page, Book Riot, unrelated cases; nothing on the company.
- Q2 `"Libro.fm" (EEOC OR OSHA OR "Department of Labor" OR FTC OR EPA OR "attorney general")`: agency and law-firm landing pages only.
- No parent named (parent: none): 2 searches applicable.
- Fetches: none. Concerns added: none. Tier: acceptable -> acceptable (provisional removed: 2 of 2 searches ran).
- Rule decided it: none. Running totals: 16 searches, 0 fetches.

## lovegrown-com
- Q1 `("Hive Brands" OR "Love Grown") lawsuit OR settlement OR fine OR violation`: EIN Presswire release (2023-10-31) "Hive Brands ... has acquired ... Love Grown" (fetched); PlainSite docket Shah v. Hive Brands Holdings, Inc. (LA Superior Ct 26STCP00378, filed 2026-01-27, petition to compel arbitration, pending; fetched); class-action directories.
- Q2 `("Hive Brands" OR "Love Grown") (EEOC OR OSHA OR "Department of Labor" OR FTC OR EPA OR "attorney general")`: agency landing pages only.
- No parent named: 2 searches applicable (both names folded into each query).
- Fetches: 2 (einpresswire, plainsite). Concerns added: none. Tier: acceptable -> acceptable (provisional removed: 2 of 2 searches ran).
- Rule decided it: "What counts as a concern" (private petition, no ruling -> body note). Running totals: 18 searches, 2 fetches.

## madetrade-com
- Q1 `"Made Trade" (madetrade OR "Made Trade Group") lawsuit OR settlement OR fine OR violation`: other companies' FTC "Made in USA" penalties (Williams-Sonoma etc.), word matches; nothing on the company.
- Q2 `"Made Trade" (EEOC OR OSHA OR "Department of Labor" OR FTC OR EPA OR "attorney general") ethical home goods`: agency landing pages only.
- Fetched the FTC April 2026 Made in USA sweep release to rule it out: Made Trade not named.
- No parent named: 2 searches applicable.
- Fetches: 1. Concerns added: none. Tier: acceptable -> acceptable (provisional removed: 2 of 2 searches ran).
- Rule decided it: none. Running totals: 20 searches, 3 fetches.

## misfitsmarket-com
- Q1 `("Misfits Market" OR "Imperfect Foods") lawsuit OR settlement OR fine OR violation`: acquisition coverage, Wikipedia, NLRB 19-RD-336776, an unrelated Malden food-market case.
- Q2 `("Misfits Market" OR "Imperfect Foods") (EEOC OR OSHA OR "Department of Labor" OR FTC OR EPA OR "attorney general")`: NLRB 20-CA-346490 and 19-RD-336776, Justia docket Gonzalez v. Imperfect Foods d/b/a Misfits Market (D. Md. 1:2026cv03229, FLSA, already in file), Oregon WARN notice (64 employees, Clackamas), Consumer Reports.
- Fetched nlrb.gov/case/20-CA-346490: UFCW Local 5 charge, 8(a)(5), filed 07/17/2024, "Letter Approving Withdrawal Request" 10/29/2024, Closed.
- Fetched nlrb.gov/case/19-RD-336776: RD petition filed 02/28/2024 by an employee; tally 03/21/2024, 15 against union, 5 for; certification of results 03/29/2024; Closed.
- No parent named: 2 searches applicable.
- Fetches: 2. Concerns added: none. Tier: acceptable -> acceptable (provisional removed: 2 of 2 searches ran).
- Rule decided it: "What counts as a concern" (a union's NLRB charge is a charge by others; this one was withdrawn; an RD election is not an action against the employer). Running totals: 22 searches, 5 fetches.

## Batch summary
- 9 of 9 retailers searched; 0 concerns added; no tier changes (all acceptable -> acceptable); "tier is provisional" removed from all 9 (all applicable searches ran).
- WebSearch calls: 22 of 30 (21 applicable + 1 noise check for Girlfriend Collective). WebFetch calls: 5 of 30 (einpresswire, plainsite, ftc.gov Made in USA sweep, 2 nlrb.gov case pages).
- Body notes only (not concerns): Kobo private suits and its role as challenger in the Canadian ebooks matter; Hive Brands Holdings private arbitration petition (pending); Misfits/Imperfect Foods withdrawn UFCW charge and RD election.
- Fact added: Hive Brands acquired Love Grown (press release 2023-10-31); `parent` left unknown.
- build-index.mjs: passed ("26 sites, 54 retailers"). Blocked pages: none.
