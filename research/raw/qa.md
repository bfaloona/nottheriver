# Final QA

Checked 2026-09-25 by the final QA agent (brief section 8). No web fetches: claims were checked against the URLs each file lists, the `raw/verify-R*.md` tables and `data/blocklist.md`, not re-fetched.

## Summary

Files checked: 26 site files, 54 retailer files, `amazon-alternatives.md`, `method.md`, `README.md`. 55 table rows below: 33 fixed, 22 flagged. No score, tier, certification or concern was changed.

1. **Build.** `node research/build-index.mjs` passed before QA and after the fixes: `index.json: 26 sites, 54 retailers`. The only change to `index.json` is AliExpress's `goods` field.
2. **Unsourced claims and wording.** Every URL cited above a file's `## Sources` is listed in it (script check). Fixes were sentence-level: unsupported words or clauses removed, wording brought back to the source's, and site files added to Sources where a retailer file describes what a list says.
3. **Consistency.** All 50 rated retailer files carry the "tier is provisional" line; the 4 Amazon-owned files are `excluded` and cite `data/blocklist.md`. Each of the 13 `ownership: public` files names an exchange listing from a listed source (Wikipedia or a 10-K); AliExpress and Depop say it is the parent (Alibaba, eBay) that is listed. Concern-rule questions are in the flagged rows for costco-com, bhphotovideo-com and chewy-com.
4. **Numbers and links in the report and method.** Checked against `index.json`, `raw/tally.md`, `raw/calibration.md`, `raw/candidates.md`, the discovery files and the retailer files: tier counts (10, 28, 12, 4), category counts (6, 6, 7, 3, 3, 1), affiliate counts (15, 9, 1, 1), the top-scored sites, the evidence claim, the 4 sites recommending Amazon-owned companies, the top 20 by mentions, the tally totals (313 = 37 + 24 + 252), the 50-retailer selection arithmetic, the query total (141), the caution and recommended tables, and the tier effects in OC5, OC7, OC8, OC10, OC11, OC13 and OC16 to OC18. All match. One method sentence was out of date (fixed). All 193 relative links and anchors in the three files resolve.
5. **Privacy and style.** No email addresses or phone numbers (regex scan). Private individuals' names in case captions, two founder names taken from about pages, a site co-founder not in the byline and two private-mailbox street addresses were removed. Founder and executive names cited from Wikipedia were left and flagged. No em dashes in the report, method or README.

Most serious flagged items (rule questions for the operator):

- costco-com records a private class-action settlement (classaction.org, final approval pending) as a concern. The "What counts as a concern" rule puts private suits in the body, as was done for Etsy's Prop 65 settlement. No score effect (`accepted_source: false`).
- bhphotovideo-com and chewy-com: the OSHA concern rows don't show the cases are closed, which the OSHA rule requires (verify-R5 ran before that rule). If both B&H cases proved open, B&H would move from `caution` to `acceptable`.

## Issues

| file | issue | action |
|---|---|---|
| method.md | Known limits said verifiers added the "tier is provisional" line to 47 of 50 files and implied three lacked it; all 50 rated files now carry it (the lead added the last three) | fixed |
| depop-com, christydawn-com, girlfriend-com, mightly-com, thredup-com, newegg-com, grove-co, uncommongoods-com | "188 brands" count for The Climate Label directory; verify-R1 found it can't be reproduced from the fetched page and removed it from other files | fixed (count removed) |
| ebay-com | Dismissed EPA case described as "sales of products in violation of" the Clean Air Act, FIFRA and TSCA; the EPA release title says "Alleging" | fixed ("alleged sales") |
| depop-com | "no certifier lists Depop", though the B Corp directory returned 403 | fixed ("none of the certifier directories checked") |
| equalexchange-coop | A Sources line is a B Corp query for Better World Books, unexplained | fixed (annotated as the batch's 403 evidence) |
| madetrade-com | "Climate Label directories not readable"; verify-R10 says The Climate Label was not checked | fixed ("not checked") |
| etsy-com | Claim about names in the tally had no listed source | fixed (added `research/raw/tally.md` to Sources) |
| eileenfisher-com, girlfriend-com, kotn-com, madetrade-com, misfitsmarket-com, overstock-com, costco-com, ableclothing-com, avocadogreenmattress-com, backmarket-com, christydawn-com, packagefreeshop-com, publicgoods-com, tenthousandvillages-com, tentree-com, thedetoxmarket-com, thredup-com, wearpact-com | Private individuals named in case captions (plaintiffs, a relator) | fixed (names replaced with "an individual's suit against ...", courts, dates and docket numbers kept) |
| shop-app, poshmark-com | Private plaintiff named in a published appellate opinion's caption (Shop's name is also in a listed CourtListener URL) | flagged (left: the source URL can't be changed) |
| girlfriend-com, ecoroots-us | Founder names taken from the company's about page | fixed (names removed) |
| girlfriend-com, mightly-com | Full private-mailbox street addresses | fixed (reduced to city) |
| ebay-com, kotn-com, libro-fm, misfitsmarket-com, newegg-com | Founder names cited from Wikipedia | flagged (public figures, sourced; left) |
| costco-com | A private class-action settlement (classaction.org, pending final approval) is a concern row. Under "What counts as a concern" a private suit is noted in the body, as done for Etsy's private Prop 65 settlement. No score effect (`accepted_source: false`) | flagged (concern not changed) |
| grove-co | B Corp row says `checked: 2026-09-25`, but it counts through a `data/certifications.json` row that the Rating line and eileenfisher-com date 2026-09-23 | flagged (certification not changed) |
| mightly-com | `hq: Oakland, CA` rests on a mailing address and "founded in Oakland"; girlfriend-com and ecoroots-us treat the same kind of evidence as `hq: unknown` | flagged |
| newegg-com | "a merger with the SPAC Lianluo Smart": the verifier (verify-R2) didn't check "SPAC", and Lianluo Smart was an operating listed company | flagged (can't check without a fetch) |
| misfitsmarket-com | A listed CourtListener query carries "BLK + GRN" terms, apparently copied from another file | flagged |
| patagonia-com | "after 2022 founder ... transferred the voting stock": the source dates the transfer to 2022 (verify-R4) | fixed ("in 2022") |
| patagonia-com | NLRB charge "filed by an individual employee"; the NLRB page shows only an individual charging party | fixed ("by an individual") |
| walmart-com | "the 2019 DOJ Foreign Corrupt Practices Act resolution": the press release returned an empty page, so no fetched page gives the year | fixed (year removed) |
| tenthousandvillages-com | "consistent with independently run local stores" is the researcher's inference from separate nonprofit registrations | fixed (clause removed) |
| shop-app | Plaintiff's full first and last name in a caption | fixed (surname only, matching the listed URL) |
| worldofbooks-com | "1% for the Planet and Climate Label directories could not be checked"; verify-R10 says The Climate Label was reachable and not checked | fixed |
| wholefoodsmarket-com | Fair Trade USA tile claim had no listed source | fixed (added `research/sites/fairtradecertified-org.md` to Sources) |
| packagefreeshop-com, patagonia-com, powells-com, tenthousandvillages-com, uncommongoods-com, worldofbooks-com | Founder or owner names cited from Wikipedia | flagged (public figures, sourced; left) |
| avocadogreenmattress-com, bobsredmill-com | Private plaintiffs named by surname in lists of suits | fixed (names removed, courts and years kept) |
| avocadogreenmattress-com | A suit called "a class action"; the docket list (verify-R9) shows only court, dates and "370 Other Fraud" | fixed ("a suit") |
| betterworldbooks-com | "the same query form returned 46 inspections for Chewy": no source listed, and chewy-com doesn't give that figure | fixed (parenthetical removed) |
| barnesandnoble-com | B Corp Sources line is a query for Better World Books, unexplained | fixed (annotated as the batch's 403 evidence) |
| aliexpress-com | `goods` lists electronics, clothing, home goods; verify-R3 found them in no source and fixed only the body | fixed (`goods: [general merchandise]`) |
| costco-com, abebooks-com, amazon-com | Claims about what list sites say had no source in the file | fixed (added the site files to Sources) |
| bhphotovideo-com, chewy-com | OSHA concern rows (2 and 4) don't state that each case is closed, which the OSHA rule requires; verify-R5 ran before that rule | flagged (concerns not changed) |
| costco-com | The NLRB concern counts while the body calls it "an allegation, not a finding"; this follows the lead's open-NLRB-complaint decision | flagged (no change; wording is the source's) |
| bookshop-org | Body quotes "certified Climate Neutral in 2020 ..." but verify-R1 records firstCertifiedYear 2021 | flagged (certification not changed) |
| betterworldbooks-com | `ownership: nonprofit`, but the body says the infobox calls the operating company private; its owner is a nonprofit | flagged |
| backmarket-com, blkgrn-com, bookshop-org | `parent: none` rests on a source naming no parent; verify-R8 and verify-R9 changed the same evidence to `unknown` elsewhere | flagged |
| abebooks-com, amazon-com | `type: marketplace` with `marketplace: unknown` in unresearched files | flagged |
| blkgrn-com | Founder named from the company's about page | flagged (founder of the business, named on its own site; left) |
| bookshop-org, credobeauty-com, barnesandnoble-com, ableclothing-com, bobsredmill-com | Founder or executive names cited from Wikipedia | flagged (public figures, sourced; left) |
| sites/adayinourshoes-com | "21 named sellers of goods" vs 19 counted rows and 2 free-exchange networks | fixed |
| sites/amazonalts-org | "names 29 shops" vs `retailers_listed: 27` (2 moved to "Also named" as non-shops) | fixed ("29 options (27 of them shops)") |
| sites/gobankingrates-com | "every domain comes from a direct request" in the same sentence that says three weren't requested; "all answer" though overstock.com refused | fixed |
| sites/goodgoodgood-co | "Every link on page 1" vs "nearly all page 1 links" in the Score section | fixed ("Nearly every") |
| sites/greenamerica-org | "every pick comes from Green America's own dues-paying certification network", stronger than the file's "many" picks certified | fixed ("every pick links to Green America's own directory, whose certified members pay dues") |
| sites/makeitworkcrafts-com | "31 real, non-Amazon US shops": no source shows all are US shops | fixed ("shops") |
| sites/pcworld-com | "every retailer product link is affiliate-wrapped" vs "Nearly every" and a plain B&H link | fixed ("nearly every") |
| sites/sustainablejungle-com | Co-founder named from the about page, not the byline | fixed (name removed) |
| sites/vstyleblog-com | "all reached a live retailer home page", but the Hive link lands on lovegrown.com | fixed (noted) |
| sites/workerowned-info | "no-commission statement on every page"; only some pages were fetched | fixed ("on the pages fetched") |
| sites/amazonalts-org | `owner: Incitement Design` rests on a footer "Follow our latest projects" link; the body says the owner "is only implied" (R4) | flagged |
| sites/amazonalts-org | World of Books called "UK-based" in the Reason column; unclear whether the page says so | flagged |
| sites/antifamarketer-org | Claims attributed to "its About page", but no Sources URL is labeled as the About page | flagged |
| sites/fairtradecertified-org | `updated: 2026-07-08` comes from hidden page metadata, not a shown date (R5); other files leave such dates `unknown` | flagged (Currency score may move) |
| sites/sustainablejungle-com | The Imperfect Foods row may redirect to misfitsmarket.com (K4 would change its domain) | flagged (needs a fetch) |
| sites/thegoodtrade-com | Plastic Freedom (plasticfreedom.co.uk) row has no UK tag, though the Score counts 4 UK-only picks and only 3 rows are tagged (R1, K1) | flagged (OC30 already covers untagged non-US shops) |
| retailers/costco-com.md | private class-action settlement recorded as a concern row | fixed by lead: row removed (not an agency or court action per brief section 9); the body already describes it; no score effect |
