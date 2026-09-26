# Prop 65 and parent-company pass (agent P1, 2026-09-25)

Operator rules applied (run-log "Operator decisions on pass-3 questions" plus the P1 task): Prop 65 settlements and judgments recorded on oag.ca.gov count as `environmental` concerns (private enforcers and out-of-court settlements included); a 60-day notice with no settlement or judgment does not. Date = settlement or judgment date. One row per settlement record; `source` = the oag.ca.gov notice page that shows it. A parent company's actions count against the retailer.

## Method

- Lookup: the AG's 60-day notice search. Form at https://oag.ca.gov/prop65/60-day-notice-search submits by GET to `/prop65/60-day-notice-search-results` (allowed by robots.txt; only `/search/` and similar are disallowed). Queried the "Alleged Violator" field (`field_prop65_defendant_value`, substring match) with `items_per_page=100`, plain curl (default curl user agent, no browser UA), 10 s between requests per robots.txt `Crawl-delay: 10`.
- Controls: negative control `Zzqxnotacompany` returned the empty-results block; positive control `Etsy` returned 13 notices including the known 2024-02373.
- Notice detail pages (`/prop65/60-Day-Notice-<AG number>`) opened only where the results list shows Settlement or Judgment >= 1 and the alleged violators include the company. A row needs the settlement record's Defendant field to name the retailer, its legal entity or its parent.
- Dedupe: a "Corrected Settlement" is the same settlement as the one it corrects (one row). Amended or supplemental notices whose settlement record is the same agreement (same settlement PDF, date and case) are one row.
- Budget accounting: oag.ca.gov requests went through curl, not WebFetch; they are counted per retailer below so the real footprint is visible.

## Task B: Kobo parent (Rakuten Group)

- Q1 `"Rakuten" (FTC OR "attorney general" OR "Department of Justice" OR SEC) settlement OR fine OR penalty`: FTC early-termination notices 20141548 (Rakuten/Ebates) and 20100773 (Rakuten/Scott A. Blum) are merger-review clearances, not enforcement; Pop Top v. Rakuten Kobo (Fed. Cir., patent, private); Oganesyan v. Rakuten USA (private browser-extension suit, N.D. Cal. 2025); Rakuten USA data-breach notice filed with the CA AG (a company filing, not an action).
- Q2 `"Rakuten" lawsuit OR settlement OR fine OR violation regulator ordered`: IBM patent suit settled 2024 (private); AsahiAgent v. Rakuten Group (Japanese court, Rakuten won); Rakuten's own 2025 suit against Japan's Internal Affairs ministry over the hometown-tax points ban (Rakuten is plaintiff); Illumina trademark suit (private).
- Q3 `Rakuten Japan Fair Trade Commission OR "Financial Services Agency" order penalty Rakuten Group`: Japan Fair Trade Commission (JFTC) matters: 2019 commitment plan approved and investigation closed; 2020 petition for an urgent injunction over Rakuten Ichiba's free-shipping threshold, withdrawn by the JFTC on 2020-03-10 after Rakuten changed the policy; 2021-12-06 JFTC "Closing the Investigation on the Suspected Violation of the Antimonopoly Act by Rakuten Group" (commitment, no violation found). Closed or withdrawn actions, and jftc.go.jp is not an accepted source. No FSA order surfaced.
- Rows added: none from search. Rakuten and Kobo were also added to the oag.ca.gov sweep (see Kobo below).

## Sweep controls and conventions

- Multi-word names are matched word by word unless quoted (`Avocado Green` unquoted returned 100+ "Green" notices); all multi-word terms were re-run in double quotes. Quoted positive control: `"Equal Exchange"` returned its 10 notices.
- Row date: the settlement date; a later judgment date goes in the title. Source: the notice page; a multi-notice agreement is one row with the other AG numbers in the title.
- Requests to oag.ca.gov (curl, 88 in all): robots.txt 1, search form 1, early Etsy search 1, early detail page 1, first sweep 8 (5 multi-word queries superseded by quoted re-runs), quoted-phrase tests 2, quoted sweep 42, notice detail pages 29, settlement PDFs 3. WebFetch calls: 0. WebSearch calls: 3 (Task B).

## Retailers

### etsy-com
- Method: notice search, Alleged Violator `Etsy` (13 notices); 10 detail pages with settlements opened; settlement PDF 2025-00672S7086 read (covers 4 notices).
- Records: 2021-01400 (settlement 2022-02-17, SF Superior CGC-21-594665, $20,000), 2021-01401 (2022-02-17, out of court, $40,000), 2024-02373 (2024-11-22, corrected 2024-12-13, $6,000), 2024-01113 + 2024-00232 (one As You Sow settlement 2025-02-24, N.D. Cal., $24,300; AG no-merit letters on both notices), 2025-00672 + 2025-01797 + 2025-02110 + 2025-02113 (one Epps agreement 2026-01-27, $10,000). Not Etsy: 2025-04838 settlement is with Vida Divina only. No settlement: 2021-01402, 2021-01403, 2022-00479.
- Rows added: 5. Environment 0.75 -> 0 (floored). Tier recommended -> caution.
- Rule: operator 2026-09-25 Prop 65 rule; no-merit letters don't undo a recorded settlement under the rule as written (flagged for the lead).

### bobsredmill-com
- Method: notice search `"Red Mill"` (20 notices, all Bob's Red Mill Natural Foods); 7 detail pages opened.
- Records: 2018-00400 (settlement 2020-07-30, judgment 2020-09-16), 2019-01824 (settlement 2020-11-12, judgment 2021-02-08: the final judgment the task asked about is recorded), 2021-00799 (2021-11-30), 2021-01464 (2022-03-17, judgment 2022-05-31), 2022-02238 (2023-03-23, corrected 2023-05-04, judgment 2023-05-25; amends 2022-01013), 2024-05040 (2025-12-04), 2025-03554 (2026-05-15). 13 notices with no settlement or judgment.
- Rows added: 7. Environment 0.5 -> 0 (floored). Tier acceptable -> caution.
- Rule: operator 2026-09-25 Prop 65 rule.

### equalexchange-coop
- Method: notice search `"Equal Exchange"` (8 notices); 4 detail pages opened; 2 settlement PDFs for 2018-01640 read.
- Records: 2015-01250 (McCartney, out of court 2016-06-26, $12,500) counts. Not Equal Exchange: 2023-03029 settlement is with Amazon.com Services only; 2018-01640 settlements are the As You Sow v. Trader Joe's et al. modified consent judgment and neither the AG record ("Trader Joes Company, et al.") nor the PDFs (excerpts) name Equal Exchange as a settling defendant; 2012-00401 settlement is with Luberski only. No settlement: 2015-00221, 2021-01717, 2022-03115, 2022-03116.
- Rows added: 1. Environment 0.5 -> 0.25. Tier recommended -> acceptable (total 1.0; concern is older than 5 years).
- Open: if the full As You Sow chocolate consent judgment lists Equal Exchange as a settling defendant, a second row would drop environment to 0 and the tier to caution. Not confirmable from the AG's pages.

### grove-co
- Method: notice search `"Grove Collaborative"` (4 notices); 1 detail page opened.
- Records: 2025-02024 (APS&EE v. Grove, out of court, settlement dated 2026-02-12, $3,000). No settlement: 2025-02590, 2025-03633, 2026-01615.
- Rows added: 1. Environment 0.5 -> 0.25. Tier recommended -> acceptable.
- Rule: operator 2026-09-25 Prop 65 rule. Body fixed: the settlement is dated 2026-02-12, not 2025.

### uncommongoods-com
- Method: notice search `Uncommon` (5 notices); 2 detail pages opened.
- Records: 2005-00214 (Brimer, settlement 2006-05-11, judgment 2006-12-21, $1,600) counts. Not Uncommon Goods: 2012-00401 settlement with Luberski only. No settlement: 2006-00406, 2024-01178, 2026-03466.
- Rows added: 1. Environment 0.5 -> 0.25. Tier recommended -> acceptable.
- Rule: operator 2026-09-25 Prop 65 rule; age doesn't matter for the −0.25.

### patagonia-com
- Method: notice search `Patagonia` (18 notices); 6 detail pages opened.
- Records: 2021-01049 (Chemical Toxin Working Group, out of court 2021-08-12, $36,000; defendants Patagonia, Inc., Patagonia Works, Patagonia Provisions, Amazon, REI) counts. Provisions-only settlements, not counted: 2022-00855 (2022-12-07), 2022-02550 (2023-02-17, court-submitted), 2024-04838 (2025-04-01). CEH 2023-01851/2023-01852 settlements and judgments are with other defendants; 2023-01319 complaints only; 2026-01959/01960 are Patagonia Building Supplies (unrelated). Other Provisions notices (2020-03183, 2020-03230, 2020-03465, 2023-00537, 2023-00539, 2023-00801, 2025-03321, 2025-05231, 2026-00191) show no settlement.
- Rows added: 1. Environment 0.75 -> 0.5. Tier recommended -> recommended (2021-08-12 is before the 2021-09-25 cutoff).
- Rule: the task's scope is the retailer, its legal name or its parent; Patagonia Provisions is neither on any fetched source. DECISION FOR OPERATOR: counting Provisions adds 3 rows (2022, 2023, 2025), environment 0, total 0.75, tier caution.

### Retailers with no qualifying record (one body sentence each, search URL added to Sources)

| Retailer | Terms searched (Alleged Violator) | Result |
|---|---|---|
| ableclothing-com | `Fashionable` (legal name; "ABLE" too generic, not searched) | no notices |
| avocadogreenmattress-com | `"Avocado Green"`, `"Avocado Mattress"` (covers parent Avocado Green Brands) | no notices |
| backmarket-com | `"Back Market"` | no notices |
| betterworldbooks-com | `"Better World Books"`, `"Better World Libraries"` (parent) | no notices |
| blkgrn-com | `BLK` | only "Blk Dot Coffee" (unrelated) |
| bookshop-org | `Bookshop` | no notices |
| christydawn-com | `"Christy Dawn"`; notice 2016-00377 opened | no notices; 2016-00377 is T. Christy Enterprises (electrical tape), a different company |
| credobeauty-com | `Credo` | no notices |
| earthhero-com | `EarthHero`, `"Earth Hero"`, `"Zero Waste Store"`, `ZeroWasteStore` (parent) | no notices |
| ecoroots-us | `EcoRoots`, `"Eco Roots"` | no notices |
| eileenfisher-com | `"Eileen Fisher"` | no notices |
| girlfriend-com | `"Girlfriend Collective"` | no notices |
| kobo-com | `Kobo`, `Rakuten` (parent) + 3 WebSearch (Task B) | Kobo none; Rakuten 2014-00668 (Rakuten.com) and 2019-00683 (Webgistix dba Rakuten Super Logistics), no settlement; no accepted-source action on Rakuten Group |
| kotn-com | `Kotn` | no notices |
| libro-fm | `Libro` | no notices |
| lovegrown-com | `"Love Grown"`, `"Hive Brands"` | no notices |
| madetrade-com | `"Made Trade"` | no notices |
| mightly-com | `Mightly` | no notices |
| misfitsmarket-com | `"Misfits Market"`, `"Imperfect Foods"` | no notices |
| packagefreeshop-com | `"Package Free"` | no notices |
| poshmark-com | `Poshmark`, `Naver` (parent) | 2026-02516 (mercury creams): complaint, no settlement; Naver none |
| powells-com | `"Powell's Books"`, `"Powells Books"` | no notices |
| shop-app | `Shopify` (parent) | 2024-01983 (face mask), no settlement |
| tenthousandvillages-com | `"Ten Thousand Villages"` | 2023-00209, 2024-00227, 2026-00372, none with a settlement |
| tentree-com | `Tentree` | no notices |
| thedetoxmarket-com | `"Detox Market"`, `"Violet Grey"` (parent) | no notices |
| wearpact-com | `"Pact, Inc"`, `"Wear Pact"` ("Pact" too generic) | no notices |
| worldofbooks-com | `"World of Books"` (covers parent) | no notices |

All 28: rows added 0, tier unchanged.

Limits: the search matches the AG's Alleged Violator text only; a record filed under an unsearched legal name (for example ABLE's or BLK + GRN's, which the files don't give beyond the terms above) would be missed.

## Summary

- Rows added: Etsy 5, Bob's Red Mill 7, Equal Exchange 1, Grove 1, Uncommon Goods 1, Patagonia 1; all others 0.
- Tier changes: Etsy recommended -> caution; Bob's Red Mill acceptable -> caution; Equal Exchange, Grove, Uncommon Goods recommended -> acceptable; Patagonia stays recommended (environment 0.75 -> 0.5).
- Decisions for the operator: (1) Patagonia Provisions-only settlements (3, 2022 to 2025): counting them moves Patagonia to caution. (2) Etsy's As You Sow settlement follows AG no-merit letters on both notices; counted under the rule as written. (3) Equal Exchange in the As You Sow chocolate consent judgment (2018-01640): not shown as a settling defendant on the AG's pages; a second row would move it to caution.
- `node research/build-index.mjs`: passes (26 sites, 54 retailers).
