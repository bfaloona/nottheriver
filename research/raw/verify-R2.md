# Verification: retailers R2
checked: 2026-09-25

Batch R2 (research/raw/retailer-selection.md): ebay.com, grove.co, earthhero.com, newegg.com, uncommongoods.com. All five files exist. The lead's rule update ("What counts as a concern", brief section 9) was applied.

| file | claim | source | result | why |
|---|---|---|---|---|
| ebay-com | concern: governance, "eBay will pay a $3 million fine over former employees' harassment campaign", 2024-01-11 | https://www.npr.org/2024/01/11/1224333712/ebay-stalking-settlement (fetched as text.npr.org/1224333712; the www page timed out) | kept | Title and date match; eBay Inc. agreed to pay a $3 million fine to resolve criminal charges brought by DOJ: an agency action and a fine. npr.org is accepted. |
| ebay-com | concern: environmental, "EPA and Justice Department File Complaint Alleging Environmental Violations by eBay", 2023-09-27 | https://www.epa.gov/newsreleases/epa-and-justice-department-file-complaint-alleging-environmental-violations-ebay | removed (moved to body) | Title, date and company match. But CourtListener's record of the case (E.D.N.Y. 1:23-cv-07173) shows entry 32 "ORDER granting 25 eBay's motion to dismiss" and entry 33 "CLERK'S JUDGMENT: that eBay's motion to dismiss is granted" (2024-09-30); the US appealed (2d Cir. 24-3104), then filed its own motion to dismiss the appeal (2025-04-24), and entry 35 "USCA Mandate" followed (2025-04-25). The new rule: a dismissed action is noted in the body, not counted. Fetched through CourtListener's public search API because the docket's HTML page returned HTTP 403 to WebFetch. **Operator flag:** confirm the appeal ended on the government's own motion (the mandate's text was not shown). |
| ebay-com | body: NLRB cases against "TCGPlayer, Inc. and eBay Inc." | https://www.nlrb.gov/search/case/ebay and each case page (03-CA-322767, 03-CA-322768, 03-CA-342230, 03-CA-345878, 03-CA-366163) | fixed | Researcher opened one of five. All five were union charges closed by an approved withdrawal (03-CA-342230 also has a 2024-10-28 dismissal letter); none shows a complaint or settlement. Body now says so. |
| ebay-com | body: justice.gov release titles (pill press settlement, "no poach" settlement) | justice.gov pages (bot challenge; see blocked-retailers-R2.md) | removed | Titles and years came from pages not fetched this run; cite or omit. Body now only points to the blocked log. |
| ebay-com | body: Wikipedia's reason for the EPA dismissal (Communications Decency Act) | https://en.wikipedia.org/wiki/EBay | fixed | Kept only as Wikipedia's account; the docket entries fetched don't state the ground. |
| ebay-com | ownership public, parent none, hq San Jose, marketplace true | https://en.wikipedia.org/wiki/EBay | kept | "Traded as Nasdaq: EBAY"; HQ San Jose; no parent; individuals and companies sell on it. |
| ebay-com | sells_on_amazon unknown | - | kept | No source. |
| ebay-com | rating | recomputed | fixed | ethics 0.25 (NPR), environment 0.5 (EPA row removed; was 0.25). Total 0.75, tier `caution` (unchanged). Provisional line added. |
| grove-co | certification b_corp, verified_this_run false | https://www.bcorporation.net/en-us/find-a-b-corp/company/grove-collaborative/ | kept | Directory returned HTTP 403 to this verifier too. Row matches data/certifications.json exactly (grove.co, b_corp, same source_url). |
| grove-co | Climate Label not certified | https://explore.changeclimate.org/brand/grove-collaborative ; https://explore.changeclimate.org/ | kept | Page title "Brand Not Found"; "grove" has 0 matches in the directory's brand data (control: "earthhero" matches). |
| grove-co | ownership public-benefit-corporation, parent none, hq San Francisco | https://en.wikipedia.org/wiki/Grove_Collaborative | kept | Benefit corporation listed on NASDAQ (GROV) via 2022 SPAC; SF HQ with Portland, Maine office; no parent. Body wording aligned to "benefit corporation". |
| grove-co | concerns: none (NLRB) | https://www.nlrb.gov/search/case/grove%20collaborative | kept | 0 results. |
| grove-co | rating | recomputed | kept | ethics 0.75, environment 0.5, total 1.25, tier `recommended`. Provisional line added. |
| earthhero-com | certifications: none counted | https://explore.changeclimate.org/brand/earthhero ; https://explore.changeclimate.org/brand/zerowastestore | kept | EarthHero page: "EarthHero's certification has expired"; ZeroWasteStore page (2025 certification) says it "covers business activities and operations for the following other brands: EarthHero". Conflict stands; not counting is the cautious reading; operator flag stays. Note: the brand-list data also shows EarthHero with isCertificationExpired false, lastCertifiedYear 2023. |
| earthhero-com | 1% for the Planet, B Corp not counted | https://directories.onepercentfortheplanet.org/profile/earthhero ; no certifications.json row | kept | 1% page renders only its header to a fetch; B Corp directory 403s and there is no fallback row. |
| earthhero-com | parent ZeroWasteStore | https://explore.changeclimate.org/ (brand data: isChildBrand true, parentName "ZeroWasteStore") and /brand/zerowastestore | kept (weak) | Supported by a fetched URL, but it is a certifier's brand hierarchy, not a corporate filing. Body now says where it comes from. |
| earthhero-com | ownership, hq, marketplace unknown | https://earthhero.com/ , /pages/about-us | kept | Still HTTP 403 to plain curl this run. |
| earthhero-com | concerns: none (NLRB) | https://www.nlrb.gov/search/case/earthhero | kept | 0 results. |
| earthhero-com | rating | recomputed | kept | 0.5 + 0.5 = 1.0, tier `acceptable`. Provisional line added. |
| newegg-com | concern: labor, title "MAGNELL ASSOCIATE, INC. D/B/A NEWEGG.COM (21-CA-184553)", 2019-07-31 | https://www.nlrb.gov/case/21-CA-184553 | fixed | Page title is "MAGNELL ASSOCIATE, INC. D/B/A NEWEGG.COM"; case number moved out of the title. Counts under the new rule: NLRB General Counsel issued a Complaint and Notice of Hearing (2017-03-01); a unilateral settlement agreement was approved 2019-07-09 and a unilateral compliance settlement agreement dated 2019-07-31. Charged party is d/b/a Newegg.com. Older than 5 years. |
| newegg-com | body: "Region 21, San Diego" | https://www.nlrb.gov/case/21-CA-184553 | fixed | Page says "Region 21, Los Angeles, California". Settlement wording aligned to the docket ("unilateral settlement agreement"). |
| newegg-com | body: 26-CA-024071 dismissed, not a row | https://www.nlrb.gov/case/26-CA-024071 | kept | Dismissal letter 2011-08-31 from the General Counsel. |
| newegg-com | ownership public, parent unknown, hq Diamond Bar, marketplace true | https://en.wikipedia.org/wiki/Newegg | kept | NASDAQ: NEGG; Diamond Bar; Newegg Marketplace launched 2010; 2016 majority stake by Hangzhou Liaison Interactive. |
| newegg-com | rating | recomputed | kept | ethics 0.25, environment 0.5, total 0.75, tier `caution`. Provisional line added. |
| uncommongoods-com | certification b_corp, verified_this_run false | https://www.bcorporation.net/en-us/find-a-b-corp/company/uncommongoods/ | kept | HTTP 403 to this verifier. Row matches data/certifications.json exactly (uncommongoods.com, b_corp, same source_url). |
| uncommongoods-com | ownership private, parent none, hq Brooklyn | https://en.wikipedia.org/wiki/Uncommon_Goods ; https://www.uncommongoods.com/about/our-story | kept | "Private company", Brooklyn; our-story: "As an independently owned business". |
| uncommongoods-com | marketplace false | https://www.uncommongoods.com/about/our-products | kept | "we decide to carry something"; artists "submit their work for consideration". |
| uncommongoods-com | body quotes (130 team members, pay, Better to Give, "handpicked by our buying team") | https://www.uncommongoods.com/about/our-story | kept | All four found on our-story (the "handpicked" phrase is on our-story, not our-products; both are in Sources). |
| uncommongoods-com | concerns: none (NLRB) | https://www.nlrb.gov/search/case/uncommon%20goods | kept | 0 results. |
| uncommongoods-com | rating | recomputed | kept | ethics 0.75, environment 0.5, total 1.25, tier `recommended`. Provisional line added. |

## Unfetchable this pass
- https://www.bcorporation.net/... (grove-collaborative, uncommongoods): HTTP 403. Fallback rows used.
- https://www.courtlistener.com/docket/67832171/united-states-v-ebay-inc/ : HTTP 403 to WebFetch; the docket entries were read through CourtListener's public search API (`/api/rest/v4/search/?q=docket_id:67832171&type=rd`, and `docket_id:69431401` for the appeal).
- https://www.courtlistener.com/opinion/10192986/united-states-v-ebay-inc/ : empty page to WebFetch.
- https://www.npr.org/2024/01/11/1224333712/ebay-stalking-settlement : timed out; text.npr.org copy used.
- https://earthhero.com/ and /pages/about-us : HTTP 403.
- WebSearch: session budget exhausted (one attempt), so no news or regulator searches were added.

## Rule updates applied
- "What counts as a concern": applied (eBay EPA complaint removed as dismissed; eBay NLRB charges were union charges, all withdrawn, not rows; Newegg NLRB case kept as an agency complaint plus settlement).
- "OSHA citations": no R2 file has an OSHA concern (osha.gov was not searched for any R2 retailer; see blocked-retailers-R2.md). No change.
