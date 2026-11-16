# Record book: check against known cases

Answer: from the fixed case sources (OSHA, WHD, FTC; registries have their own table), the held-back files name 7 in-window cases: 5 found, 2 excluded by the sheet (OSHA inspections with $0 penalty), 0 missed. From other sources they name 6 in-window cases: 0 found, 6 missed, all because the source is outside the fixed list (NLRB 2, EEOC 1, DOJ 1, private lawsuit 1, Canadian tribunal 1).

Checked 2026-11-15 from local files only, no network calls. Counts cover cases only; certifications have their own table. Seven fixed-source cases, two of them already used in the Costco trial review, are too few to read as a recall rate: the held-back files knew of only 2 OSHA cases and no WHD case for these ten chains, while the sheets list hundreds.

Held-back files read: `data/negatives.json`, `data/certifications.json`, `research/retailers/` (files exist for Walmart, Costco, Target, Best Buy only; none for Home Depot, Lowe's, REI, DICK'S, HomeGoods or TJX, Ace, or Sam's Club), `research/raw/` (osha-status, osha-dol-match, concerns2-C1 to C4, news-N1 to N4, prop65-P1, verify-R1 to R10, plus blocked-retailers-R4 for one date), `docs/ethics-data-strategies.md`, `docs/evidence/ethics-data/`.

## Counts

| Chain | Fixed sources: known in window | Found | Excluded | Missed | Other sources: known in window | Found | Missed (cause) | Outside window | Cannot tell | Named, no finding |
|---|---|---|---|---|---|---|---|---|---|---|
| Walmart | 3 (FTC) | 3 | 0 | 0 | 2 | 0 | 2 (DOJ 1, EEOC 1) | 3 | 1 | 1 |
| Costco | 4 (OSHA) | 2 | 2 | 0 | 2 | 0 | 2 (NLRB 1, private lawsuit 1) | 1 | 0 | 5 |
| Target | 0 | 0 | 0 | 0 | 1 | 0 | 1 (NLRB 1) | 5 | 1 | 2 |
| Best Buy | 0 | 0 | 0 | 0 | 1 | 0 | 1 (Canadian tribunal 1) | 2 | 3 | 0 |
| Home Depot | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 1 | 0 | 0 |
| Lowe's | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| REI | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 1 | 0 | 0 |
| DICK'S | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| HomeGoods (TJX) | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 1 | 0 |
| Ace Hardware | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| **Total** | **7** | **5** | **2** | **0** | **6** | **0** | **6** | **13** | **6** | **8** |

"Named, no finding" holds dismissed or withdrawn charges, open dockets with no outcome, and inspections with no surviving citation; they are listed but not counted as known cases.

## Per-case table

Ids: K = fixed-source case, X = other-source case, O = outside the window, U = cannot tell, N = named, no finding.

| Id | Chain | What | Agency or source | Date | Amount | Id in source | Where stated | Verdict | Note |
|---|---|---|---|---|---|---|---|---|---|
| K1 | Costco | OSHA inspection, Overland Park, KS | OSHA | issued 2024-12-06; closed 2025-08-28 | $9,403 | osha.gov 1763330.015 = DOL 347633307 | `research/retailers/costco-com.md:31`; `research/raw/osha-dol-match.md:17` | In window, found: C37 | Sheet action date 2025-09-25 against closed 2025-08-28; both in window |
| K2 | Costco | OSHA inspection, Chula Vista, CA, store #781 | OSHA | issued 2023-03-15; closed 2026-03-25 | $1,330 | 1640222.015 = 346402225 | `costco-com.md:32`; `osha-dol-match.md:18` | In window, found: C9 | Sheet action date 2026-03-23 against closed 2026-03-25 |
| K3 | Costco | OSHA inspection, Sparks, NV | OSHA | closed 2026-03-25 (raw DOL record: opened 2024-01-16) | $0 current penalty | 347212342 | `osha-dol-match.md:30` | In window, excluded by sheet: "violations at $0", row definition (`trial-costco.md:96`) | Likely: id is in `handoff/record-book/raw/dol/costco-osha-inspections-upper.json`, so the pattern pulled it |
| K4 | Costco | OSHA inspection, San Marcos, CA, both citations deleted | OSHA | not stated in file; raw DOL record: opened 2023-05-10, closed 2025-01-17 | none ("both citations deleted") | 1670176.015 (DOL 346701766 in raw pull) | `costco-com.md:39` | In window, excluded by sheet: no penalty, row definition | Likely; the id match rests on the raw pull's name, city and the "34" + digits pattern in `osha-dol-match.md:33` |
| K5 | Walmart | FTC bamboo textiles, stipulated order and civil penalty | FTC (DOJ filed for FTC) | 2022-04-08 | $3,000,000 | FTC 2023173 | `data/negatives.json:5`; D.D.C. docket filed and closed 2022-04-08 at `research/retailers/walmart-com.md:38` (likely the same case) | In window, found: W204 | Sheet marks it not final ("court entry not shown on ftc.gov", G10); `negatives.json` marks it "final" |
| K6 | Walmart | FTC v. Walmart Inc., money transfer fraud, stipulated order for injunction and monetary judgment | FTC | court entry 2025-06-23 | not stated in file | N.D. Ill., CourtListener entry 105 | `walmart-com.md:15`, `:34` | In window, found: W203 | Sheet: dated 2025-06-20, $10,000,000, not final. The held-back file says the court "entered" the order on 2025-06-23. If so, W203 is final and meets the proposed rule |
| K7 | Walmart | FTC v. WALMART INC. with several states, closed by "Order on Stipulation" | FTC | filed 2026-02-26; closed 2026-03-03 | not stated | N.D. Cal. | `walmart-com.md:38` | In window, likely found: W202 | Court and date match W202 (3:26-cv-01655, N.D. Cal., 2026-03-03, $100,000,000); the file does not give the subject. `research/raw/concerns2-C4.md:12` also names "Walmart Spark Driver results" |
| X1 | Walmart | Opioid prescriptions settlement | DOJ | 2026-08-28 | $50 million | D. Del. | `walmart-com.md:14`, `:33` | In window, missed: source outside the fixed list (DOJ) | Release says "allegations only" |
| X2 | Walmart | Consent judgment, employment civil rights | EEOC | 2024-01-11 | not stated | S.D. Iowa | `walmart-com.md:16`, `:35` | In window, missed: source outside the fixed list (EEOC) | |
| X3 | Costco | NLRB complaint and notice of hearing, Milford, CT, coercive rules | NLRB | 2025-08-12 | none | 01-CA-355597 | `costco-com.md:17`, `:34`; `research/raw/verify-R10.md:10` | In window, missed: source outside the fixed list (NLRB) | Allegation; case open |
| X4 | Costco | Class settlement over promotional email subject lines (Aaland v. Costco) | Private lawsuit | 2026-07-22 (article date) | $14 million | none | `costco-com.md:35`; `verify-R10.md:11` | In window, missed: source outside the fixed list (private lawsuit) | Final approval hearing set for 2026-10-02 |
| X5 | Target | NLRB settlement, Christiansburg, VA, coercive statements | NLRB | 2023-03-17 | none stated | 10-CA-295461 | `research/retailers/target-com.md:14`, `:32` | In window, missed: source outside the fixed list (NLRB) | |
| X6 | Best Buy | B.C. Human Rights Tribunal order | Canadian tribunal | "a 2026 B.C. Human Rights Tribunal order" | not stated | none | `research/retailers/bestbuy-com.md:27` | In window by year, missed: source outside the fixed list (foreign tribunal) | Not fetched at its source |
| O1 | Costco | OSHA inspection, Tracy, CA | OSHA | 2019-03-05 | $560 | 1356334.015 = 343563342 | `costco-com.md:33`; `osha-dol-match.md:19` | Outside window (2019) | |
| O2 | Walmart | Guilty plea, hazardous waste | DOJ, W.D. Mo. | 2013-06-04 | $11,000,000 fine | 4:13-cr-00135 | `walmart-com.md:17`, `:36` | Outside window (2013) | |
| O3 | Walmart | Related criminal dockets, C.D. Cal. and N.D. Cal. | DOJ | 2013 | $40,000,000 fine | none | `walmart-com.md:36` | Outside window (2013) | Subject not stated |
| O4 | Walmart | Foreign Corrupt Practices Act resolution | DOJ | 2019 | $137 million (from the release's URL) | none | `walmart-com.md:38`, `:55`; `research/raw/blocked-retailers-R4.md:7` | Outside window (2019) | Release page empty when fetched |
| O5 | Target | EEOC consent decree, disability | EEOC | 2020-03-27 | not stated | N.D. Cal. | `target-com.md:15`, `:33` | Outside window (2020) | |
| O6 | Target | EEOC consent decree | EEOC | 2011-07-21 | $160,000 | C.D. Cal. | `target-com.md:16`, `:34` | Outside window (2011) | |
| O7 | Target | California Attorney General hazardous-waste suit | State attorney general | 2009 | not stated | none | `target-com.md:36` | Outside window (2009) | From Wikipedia; not recorded in the file |
| O8 | Target | Alameda County e-waste settlement | County | 2018 | not stated | none | `target-com.md:36` | Outside window (2018) | |
| O9 | Target | Data-breach settlements | Not stated | 2013 | not stated | none | `target-com.md:36` | Outside window (2013) | |
| O10 | Best Buy | Civil penalty for selling recalled products | CPSC | 2016-10-03 | $3.8 million | none | `bestbuy-com.md:14`, `:31` | Outside window (2016) | |
| O11 | Best Buy | FCC fine over analog-TV notices | FCC | 2008 | not stated | none | `bestbuy-com.md:27` | Outside window (2008) | |
| O12 | Home Depot | Lead paint renovation rule penalty | EPA | 2020-12-17 | $20,750,000 | none | `data/negatives.json:6` | Outside window (11 months before the start) | |
| O13 | REI | Proposition 65 settlement (Chemical Toxin Working Group; Patagonia defendants and REI) | Prop 65 | 2021-08-12 | $36,000 | 2021-01049 | `research/raw/prop65-P1.md:60` | Outside window (3 months before the start) | |
| U1 | Best Buy | Consumer-protection settlement with four California county district attorneys (pricing, returns) | County DAs | not stated | $558,570 plus $75,000 restitution | none | `bestbuy-com.md:31`; `research/raw/news-N2.md:26` | Cannot tell (no date in file) | Would be a miss by source if in window |
| U2 | Best Buy | TCPA robocall class settlement | Private lawsuit | not stated | $4.5 million | none | `bestbuy-com.md:31` | Cannot tell (no date in file) | |
| U3 | Best Buy | California employee-misclassification class settlement | Private lawsuit | not stated | $3.25 million | none | `bestbuy-com.md:31` | Cannot tell (no date in file) | |
| U4 | Walmart | Named on CPSC civil and criminal penalties pick-list | CPSC | not stated | "no amounts or years" | none | `docs/ethics-data-strategies.md:390` | Cannot tell | |
| U5 | Target | Same CPSC pick-list | CPSC | not stated | none | none | `ethics-data-strategies.md:390` | Cannot tell | |
| U6 | HomeGoods (TJX) | Same CPSC pick-list, as TJX | CPSC | not stated | none | none | `ethics-data-strategies.md:390` | Cannot tell | A TJX record would also need the sibling rule |
| N1 | Costco | NLRB charges dismissed, Brighton, NY | NLRB | 2025-04-09, 2025-03-12 | none | 03-CA-356842, 03-CA-355134 | `costco-com.md:39`; `verify-R10.md:16` | No finding | |
| N2 | Costco | NLRB merit dismissal letter, Morris, IL | NLRB | 2026-04-07 | none | 25-CA-344136 | `costco-com.md:39` | No finding | |
| N3 | Costco | Named among defendants, California DTSC v. Calistoga Holdings | State agency | filed 2026-09-03 | not stated | N.D. Cal. | `costco-com.md:39` | No finding (allegation unknown) | |
| N4 | Costco | OSHA accident investigation, Monrovia, MD, no citations | OSHA | not stated | none | 1368205.015 | `costco-com.md:39` | No finding; date cannot tell | |
| N5 | Target | NLRB charges closed by withdrawal | NLRB | filed 2022-05-19, 2022-08-02 | none | 10-CA-296088, 21-CA-300653 | `target-com.md:36` | No finding | |
| N6 | Walmart | Open EEOC disability case | EEOC | 2025 | none | N.D. Cal. | `walmart-com.md:38` | No finding (no outcome) | |

Counted under "Named, no finding" in the count table: N1 (2 cases), N2, N3, N4 for Costco (5); N5 (2) for Target; N6 for Walmart.

## Certifications

| Chain | `data/certifications.json` | Retailer file | Other held-back docs | Sheet registry check (S4) | Agree? |
|---|---|---|---|---|---|
| Walmart | none | Fair Trade USA lists "Walmart" and "Walmart Canada" as stockists; "not counted" (`walmart-com.md:28`) | EPA SmartWay partner (`docs/evidence/ethics-data/p3-datasets-public-records.md:191`); EPA Green Power 29%, partial (`p1-epa-and-survey.md:53`, `:74`); Fair Food Program buyer (`p1-epa-and-survey.md:103`) | 3 product-level Fair Trade listings (W205 Walmart, W206 Sam's Club, W207 Walmart Canada) | Same listing, read differently: the file treats it as a stockist tile, the sheet lists it as product level |
| Costco | none | Fair Trade USA retailer tile, "no fair_trade certification is counted" (`costco-com.md:28`); Climate Label not claimed | EPA GreenChill: 5 certified stores, store-level (`docs/ethics-data-strategies.md:391`) | 1 product-level Fair Trade listing (C42); Climate Label "Brand Not Found" | Same as Walmart |
| Target | none | Not on Fair Trade USA's shop page (`target-com.md:29`) | GreenChill: 78 certified stores (`ethics-data-strategies.md:391`); Green Power 48% (`p1-epa-and-survey.md:54`) | None found | Agree |
| Best Buy | none | None claimed or found (`bestbuy-com.md:35`) | Green Power 80% (`p1-epa-and-survey.md:59`) | None found | Agree |
| Home Depot | none | No file | SmartWay partner (`p3-datasets-public-records.md:191`); Green Power 29% (`p1-epa-and-survey.md:58`) | None found | Agree on the six S4 registries |
| Lowe's | none | No file | SmartWay partner; Green Power 13% (`p1-epa-and-survey.md:60`) | None found | Agree on S4 |
| REI | Climate Label (`climate_neutral`), checked 2026-09-23; note "consumer co-op, not a worker co-op" (`data/certifications.json:17`) | No file | EPA Green Power 100%, the only chain on that list (`p1-epa-and-survey.md:35`, `:73`); Climate Label features REI (`ethics-data-strategies.md:378`) | R8 Climate Label (first certified 2021, current 2026); R9 Fair Trade product-level listing; worker co-op not found ("REI is a consumer co-op") | Agree on Climate Label and co-op; the sheet adds R9, which has no json row |
| DICK'S | none | No file | none | None found | Agree |
| HomeGoods (TJX) | none | No file | SmartWay partner, both homegoods and tjx (`p3-datasets-public-records.md:191`) | None found | Agree on S4 |
| Ace Hardware | none | No file | none (EPA ECHO: 840 facility records, not violations or certifications, `p3-datasets-public-records.md:40`) | None found | Agree |

SmartWay, GreenChill and Green Power are not among the S4 registries, so the sheets could not find them.

## What the misses say about the method

- **D1. No fixed-source miss.** All 5 known cases with a penalty were found. The 2 exclusions are $0 OSHA inspections that the row definition drops by design.
- **D2. The known set is small.** The held-back files knew of 2 in-window OSHA cases, 0 WHD cases and 3 FTC cases for these ten chains. That makes this a check on known FTC and Costco OSHA cases, not a recall measure for OSHA or WHD.
- **D3. Every miss comes from a source outside the fixed list.** NLRB (Costco, Target), EEOC and DOJ (Walmart), a private class action (Costco) and a Canadian tribunal (Best Buy). Three more Best Buy matters (U1 to U3, county DAs and two private suits, $3.25 million to $4.5 million) are undated in the files.
- **D4. The finality rule may understate Walmart.** G10 marks W203 ($10 million) and W204 ($3 million) not final because ftc.gov shows no court entry. `walmart-com.md:34` reads a court-entered order for W203 on 2025-06-23, and `negatives.json:5` marks W204 final. A docket check would likely move W203 above the proposed rule.
- **D5. Action dates differ by a few days to a month.** C37 (2025-09-25 against closed 2025-08-28), C9 (2026-03-23 against 2026-03-25) and W203 (2025-06-20 against 2025-06-23). None changes a window verdict.
- **D6. Two cases fall just outside the window.** Home Depot's $20.75 million EPA penalty (2020-12-17) and REI's Prop 65 settlement (2021-08-12). Both sources are outside the fixed list anyway.
