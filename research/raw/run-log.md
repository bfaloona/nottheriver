# Run log: Amazon alternatives research

Brief: `research/brief.md` (the operator's `prompts/research-amazon-alternatives.md` plus the run tuning in section 9).
Worktree: `/Users/brandon/dev/ai/nottheriver-research`, branch `research/amazon-alternatives` (pushed to origin; never `main`).
Mirror: `~/.claude/projects/-Users-brandon-dev-ai-nottheriver/ff9ea949-34b7-44c3-86aa-fee604810d2b/durable/run-log.md`.

## Resume cold

**State (2026-09-25, late):** pass 3 and the operator's rulings (OC32 to OC36) are applied and committed; don't rerun them. Tiers: 6 recommended, 25 acceptable, 19 caution, 4 excluded (OC37 applied). Next: merged to main and deployed (a6fa019); nothing open. Run scripts by absolute path; the shell can't cd into this worktree from the main checkout's session.

1. `git -C <worktree> log --oneline -5` shows the last finished stage.
2. Check the planned files for the in-flight stage below against `ls research/...`; rerun only the agents whose files are missing.
3. `node research/build-index.mjs` lists any malformed files.

## Decisions (operator, 2026-09-25)

- Run the full brief now despite 23% weekly usage left; resume after the reset if the limit hits.
- Caps: 30 sites, 50 retailers. Trims recorded in `method.md`.
- If a certifier blocks agents, a `data/certifications.json` row counts, marked `verified_this_run: false`.
- Models: Sonnet for discovery and the critic; Opus for assessors, researchers and verifiers; Fable for the calibrator only.
- Parallel agents per stage, not a workflow, so the lead can commit between stages.

## Stages

| Stage | State | Commit |
|---|---|---|
| 0 Check commit | done | pushed |
| 1 Index script + test | done: lint, 695 tests pass | stage-1 commit |
| 2 Discovery (6 + critic) | done: 116 candidates, 30 shortlisted | see git log |
| 3 Assess (pilot, then rest) + calibrate | done: 26 sites, calibrated (raw/calibration.md) | see git log |
| 4 Tally | done: 313 domains, top 50 in raw/retailer-selection.md; 4 Amazon-owned excluded files | see git log |
| 5 Retailers (research + verify) | done: 50 researched and verified + 4 excluded | see git log |
| 6 Report | done: amazon-alternatives.md, method.md, README.md | see git log |
| 7 QA + finish | done: QA (raw/qa.md), OSHA status check (raw/osha-status.md); npm ci, lint, 696 tests pass | see git log |

## Planned files per stage

(Filled in before each stage's agents start.)

Stage 2, one agent per angle; each writes `research/raw/discovery-<angle>.md` and, if needed, `research/raw/out-of-scope-<angle>.md`, `research/raw/blocklist-candidates-<angle>.md`, `research/raw/blocked-discovery-<angle>.md`.
Angles: `generic`, `product-types`, `motive-ethics`, `motive-local`, `formats`, `news`. Critic (after): `research/raw/discovery-critic.md`, `research/raw/candidates.md`, `research/raw/shortlist.md`.
Discovery agents done (144 raw candidate rows, commit 808aa3a). Critic running.

Stage 3 pilot (1 Opus assessor): shortlist #1 thegoodtrade.com, #15 rollingstone.com, #23 buycott.com, writing `research/sites/thegoodtrade-com.md`, `rollingstone-com.md`, `buycott-com.md` and `research/raw/blocked-assess-pilot.md` if needed.

Stage 3 groups (Opus, one each; shortlist row numbers). Each writes `research/sites/<slug>.md` per site plus `research/raw/blocked-assess-<group>.md` / `out-of-scope-assess-<group>.md` if needed:
- A: 2, 3, 4, 5 | B: 6, 7, 8, 9 | C: 10, 11, 12, 13 | D: 14, 16, 17, 18 | E: 19, 20, 21 | F: 22, 24, 25, 26 | G: 27, 28, 29, 30
- Flag for operator: the pilot agent curl-fetched rollingstone.com past a bot paywall with a browser user agent, then deleted it unread; the brief now forbids this (section 9, Access).
- Group E done (dollarsprout, moneypantry, gobankingrates). Decision for calibrator: picks for selling your own stuff are not alternatives for buying; move them from "Retailers named" to a "## Also named (not counted)" section so the tally skips them.
- Group D done (adayinourshoes, techradar, pcworld; washingtonpost blocked 403). Calibrator rules: section 4's Amazon-owned deduction applies under both Substance and No dark patterns (a named exception to R7); boycott targets and non-shops (banks, apps, generic shop types) stay out of the table.
- Group C done (antifamarketer, local-first, thepeoplesunionusa; hollywoodreporter blocked by tollbit). Calibrator: move non-shops (streaming, apps, Wikipedia, other list sites) to "## Also named (not counted)", consistent with group D.
- Group G done (donegood discontinued, themarkup, amazonalts reclassed as article, indiebound.org since bookweb.org/indiebound 404s). Calibrator: when a retailer's old domain redirects to a new one, use the current domain everywhere so the tally doesn't split.
- Group B done (borgenproject, vstyleblog, ilsr, greenamerica). Non-retailer rows are tagged '(... not a retailer)' in Reason; calibrator moves them to the not-counted section.
- Group F done (fairtradecertified 87 retailers incl. 5 Amazon-linked, usworker-coop, workerowned-info; bcorporation.net 403 everywhere). Impact: B Corp certifications can only count via data/certifications.json rows (verified_this_run: false); other B Corp claims go to the operator check list.
- Group A done (goodgoodgood, sustainablejungle, makeitworkcrafts, goingzerowaste). All assessors done: 26 site files; blocked: rollingstone, washingtonpost, hollywoodreporter, bcorporation. Calibrator (Fable) running; writes research/sites/*.md edits and research/raw/calibration.md.
- Calibrator on Fable failed (Fable out of usage credits, 429) after reading files, before edits. Rerun on Opus.
- Stage 5: 10 Opus researchers (batches R1 to R10 in raw/retailer-selection.md), each writes `research/retailers/<slug>.md` for its 5 domains plus `research/raw/blocked-retailers-R<n>.md`; each is followed by a verifier writing `research/raw/verify-R<n>.md` and editing the same 5 files.
- R2 researcher done; WebSearch budget (200 calls, likely session-wide) ran out, so concern searches are partial. Verifiers add "tier is provisional" where the search was incomplete. After the reset: rerun concern searches for every "recommended" retailer. Operator decisions logged: EarthHero Climate Label via parent ZeroWasteStore; eBay EPA complaint reportedly dismissed but still counts under the brief's rule.
- Verifier V2 running (writes research/raw/verify-R2.md).
- R6 done (overstock, powells, poshmark, kobo, lovegrown; all acceptable). Lead rule added to brief section 9, "What counts as a concern" (agency or court actions only; filed charges and dismissed/reversed actions are body notes). Operator may overrule. Verifiers apply it.
- R9 done (avocado, azure, bobsredmill, ecoroots, ableclothing). V9 running with identity and state-site checks. Save-point commit of researcher output before verification.
- Researchers R1, R2, R3, R5, R6, R7, R9, R10 done; verifiers for those running. R4 and R8 researchers still running. Lead checked explore.changeclimate.org robots.txt: allows Claude-User (Climate Label certs OK).
- R8 done; V8 running. Operator decision pending: should small OSHA citations (e.g. ThredUp's $0 and $1,773 'Other' citations) count? Brief rule applied: yes.
- Verifiers R3, R6, R7, R9 done (Shop caution->acceptable). Operator check: Azure Standard's 3 OSHA concerns rest on a complaint's 'information and belief' identity link plus a matching address.
- Verifier R5 done (no tier changes). Lead rule added to brief section 9: OSHA citations count only with a penalty and a closed case; $0 or open ones are body notes. Operator may overrule (it keeps Equal Exchange recommended; ThredUp's 2017 $0 inspection drops).
- Verifiers R1, R2 done (eBay EPA concern removed as dismissed; Thrive OSHA merged). Waiting on V4, V8, V10.
- Verifier R8 done (ThredUp $0 inspection moved to body). Lead override: restored Mightly's fair_trade (project definition = sells certified products; curated rows use the same Fair Trade USA brand listing); stockists like Walmart/Costco still not counted.
- Verifier R10 done (no tier changes). Lead decision: an NLRB agency-issued complaint counts even while open (the open-case exception is OSHA-only); Costco stays caution either way.
- Stage 5 done. Report writer running: writes research/amazon-alternatives.md, research/method.md, research/README.md.
- Report written. Lead fixed writer-flagged nits (provisional lines on 3 R10 files, shortlist trimmed table, verify-R8 row placement, discovery count). QA agent running: writes research/raw/qa.md and fixes small issues.
- QA done (55 issues: 33 fixed, 22 flagged; raw/qa.md). Lead removed Costco's classaction.org concern row. OSHA closed-status checker running (writes raw/osha-status.md).
- OSHA status check: all 18 OSHA concerns carry a penalty and are closed; no changes. Run complete. Branch not merged to main (brief: never push research to main; main checkout is shared). Next: operator checks in method.md, concern re-search after the usage reset.

## Concern pass 2 (2026-09-25, 05:30, operator: "run now undeterred", ~18% weekly usage left)

- WebSearch still spent (200 of 200 this session; cap is `CLAUDE_CODE_MAX_WEB_SEARCHES_PER_SESSION`). Pass uses fetches only.
- Reachable and allowed by robots: FTC case search (WebFetch only), CourtListener API, ProPublica search. Blocked (403): Violation Tracker, justice.gov, sec.gov, apnews; npr 402.
- **Finding for operator:** robots.txt disallows `osha.gov/ords/` and `/ords/imis/`, `nlrb.gov/search/`, EPA ECHO search, and CPSC recall search. Pass 1's OSHA and NLRB checks (all 18 OSHA concerns) used those paths, against brief section 9 Access. Not undone; operator decides.
- Script `research/fetch-concerns.mjs` saves CourtListener agency-party dockets and ProPublica slugs to `raw/concern-fetch/<slug>.json`.
- Brief: `raw/concern-pass-2-brief.md`. Batches (Opus): C1 = 10 recommended; C2 to C4 = 28 acceptable. Caution retailers skipped: this pass can only add concerns, so their tier can't change.
- Planned files: `raw/concerns2-C<n>.md`, `raw/blocked-concerns2-C<n>.md`, edits to each batch's `retailers/<slug>.md`.
- Fetch done (50 retailers, no errors; commit c9a9d46). Agents C1 to C4 running (Opus).
- C3 done (9 retailers, 0 concerns). C4 done (9, 0 concerns); C4 saw another agent adding source URLs to its files, check diffs before commit.
- C1 done (10 recommended, 0 concerns; FTC v. Pact, Inc. dropped as a different company).
- C2 done (10, 0 concerns). Lead retested quoted FTC search (works). Pass 2 result: 38 retailers, 0 new concerns, 0 tier changes.
- Report and method updated: pass 2 result, robots finding (OC31: dropping disallowed-page concerns changes 8 tiers). Tests 696 pass.
- Lead checks: no duplicate pass-2 edits or Sources lines; lint fixed in fetch-concerns.mjs; Tentree foreign-source caveat added. The 18 disallowed-page concerns are all OSHA (0 from NLRB search).
- OC31: operator chose OPT-C (keep the 18 OSHA concerns, re-source via an allowed channel). data.dol.gov robots allows all but /static/, but it is a script-built page; its data API (apiprod.dol.gov/v4) returns 401 without a free API key. Waiting on operator: register for a DOL API key, or fall back to OPT-A.
- OC31: operator chose to register for a DOL API key (brandon@treadlightly.ai). DOL portal signs in through Login.gov (account, password, MFA), so the operator must register; the agent cannot create accounts. Key to be saved at ~/dev/secrets/dol-api-key; then script the 18 inspection lookups.
- OC31: operator registered (brandon@faloona.net); key at ~/dev/secrets/nottheriver-dol-api-key.txt. Header X-API-KEY got 401; putting the key in the URL query was denied by the auto-mode classifier. Waiting on operator.
- OC31 DOL attempt: API key works (metadata OK). Lookup by activity_nr returned nothing for 4 of 5 inspections and matched 1647478 to a 1984 inspection of another firm (RIO GRANDE TOOL CO), so the dataset's activity_nr is not the osha.gov inspection id, or recent inspections are missing. Then HTTP 429 persisted past 90 s. Partial dumps removed as misleading. Script research/fetch-osha-dol.mjs kept (modes: metadata, probe, name, lookup).
- Wrap-up 2026-09-25: OC31 decided keep (retry DOL by name planned); news-search brief written; merge after pass 3.
- Operator approved D1 to D4 (concern definition, OSHA rule, Fair Trade USA listing, open NLRB complaints) on 2026-09-25.

## Concern pass 3: news search (2026-09-25, session cap 600 web searches)

- Brief: `raw/news-search-brief.md`. 4 Opus agents in parallel (N1 to N4), budget 30 WebSearch + 30 WebFetch each (120 + 120 of 600).
- Planned files: `raw/news-N<n>.md` per batch, edits to that batch's `retailers/<slug>.md` (38 files). Lead regenerates `index.json` after all four (agents' runs race on it) and commits per batch, staging only that batch's paths.
- Lead clarification to agents: remove "tier is provisional" when all *applicable* searches ran (2 for a US retailer with no parent, 3 otherwise).
- Agents N1 to N4 launched.
- OC31 DOL retry (lead, while N1 to N4 run): name lookup works; `fetch-osha-dol.mjs name` now takes a limit. Matching by name + close date: 12 of 18 OSHA concerns found, Thrive ambiguous (2 rows), B&H (2) and Azure (3) not found; retries hit 429. Penalties not yet checked (violation dataset). Details: `raw/osha-dol-match.md`.
- N3 done (9 retailers, 0 concerns, 0 tier changes; commit 32957e1). Lead follow-ups: Love Grown parent -> Hive Brands (acquisition press release) plus a parent search; Kobo parent (Rakuten) search.
- N2 done (10 retailers; Best Buy acceptable -> caution on a 2016 CPSC $3.8M civil penalty). Open for operator: RQ2 do parent concerns carry to a subsidiary (Depop/eBay would move to caution; Kobo/Rakuten unsearched); RQ1 is a voluntary CPSC recall a finding (Avocado, no tier effect).
- N1 done (10 recommended, 0 concerns, 0 tier changes). Checked N1 to N3 files: each has one News pass paragraph, no 'provisional', the pass-3 search line. Open for operator: RQ3 should oag.ca.gov join accepted sources, and do court-entered Prop 65 judgments from private enforcers count (Equal Exchange, Patagonia, Uncommon Goods, Grove; also Bob's Red Mill).
- N4 done (9 retailers; Overstock acceptable -> caution on People v. Overstock.com, Cal. Ct. App. 2017, $6.8M penalties; Detox Market parent -> Violet Grey). Open for operator: RQ4 add fda.gov to accepted sources (Public Goods 2022 FDA warning letter would move it to caution); World of Books B Lab page to open (could move it to recommended). Next: lead updates report tier lists, regenerates index, runs tests and lint.
- Pass 3 complete: 38 retailers, 2 accepted concerns added, 2 tier changes (Best Buy, Overstock acceptable -> caution). Counts now 10 recommended, 26 acceptable, 14 caution, 4 excluded. Report, method (limits, OC31 update, new operator checks OC32 to OC36) and README updated; index rebuilt; 696 tests pass, lint passes.
- Open for operator: OC32 (parent concerns: Depop/eBay, Kobo/Rakuten), OC33 (oag.ca.gov Prop 65), OC34 (fda.gov: Public Goods), OC35 (voluntary CPSC recall), OC36 (World of Books B Lab page); merge to main after pass 3 (operator's call). OC31 DOL: retry B&H, Azure after 429; resolve Thrive; fetch penalties.

## Operator decisions on pass-3 questions (2026-09-25)

- OC32 yes: a parent company's actions count against the retailer. OC33 yes: Prop 65 settlements and judgments on oag.ca.gov count. OC34 yes: fda.gov accepted. OC35 no: a voluntary CPSC recall with no penalty is not a concern. OC36 yes: operator confirmed World of Books Group's B Corp listing.
- Operator chose to add the new sources to the live list, `data/negative-sources.json` and `.md`. The live matcher works on registrable domains, so the row is `ca.gov` (all California state agencies, including the Air Resources Board), not `oag.ca.gov`. Live after merge plus `infra/deploy.sh`.
- Lead applied: Overstock ARB settlement now counts (environment 0.25, still caution); Public Goods -> caution (FDA letter); Depop -> caution (eBay's 2024 concern carried over); World of Books -> recommended (B Corp).
- Lead rule: Prop 65 concerns are kind `environmental` (the law is administered by CalEPA's OEHHA and targets toxic-chemical exposure). A 60-day notice alone doesn't count; a settlement or judgment does.
- Agent P1 (Opus) running: checks oag.ca.gov Prop 65 records for all 34 recommended and acceptable retailers (and parents), adds rows, recomputes; plus a Rakuten Group parent search for Kobo. Writes `raw/prop65-P1.md` and edits retailer files. Lead updates report files after.
- P1 done (Prop 65: Etsy 5 rows, Bob's Red Mill 7, Equal Exchange, Grove, Uncommon Goods, Patagonia 1 each; Rakuten search found nothing accepted). Tier moves from the rulings: Etsy, Bob's Red Mill, Depop, Public Goods -> caution; Equal Exchange, Grove, Uncommon Goods -> acceptable; World of Books -> recommended. Report, method (decision rows, OC32 to OC36 marked decided, OC37 added) and README updated; 698 tests and lint pass.
- Operator: OC37 yes (Patagonia -> caution, env 0; 3 Provisions rows); Q7 yes (World of Books B Corp row added to data/certifications.json, live after merge + deploy). Tiers: 6 recommended, 25 acceptable, 19 caution, 4 excluded. Next: OC31 DOL retry (lead, now).
- OC31 retry in flight: name search found B&H (345529341, 343697504; Florence NJ) and Azure Farms (345743389, 346474786, 346650559; Moro OR) by close date. New fetcher mode `fetch <activity_nr>...` saves inspection + violations to raw/osha-dol/; Chewy 346484173 penalty matches exactly ($10,000 from $16,072, issued 2023-05-03 = concern date). Remaining 19 fetching (log in session scratchpad dol-fetch.log).
- OC31 done: all 18 OSHA concerns confirmed in DOL open data (issue date = concern date, close date and penalty match osha-status.md); records saved in raw/osha-dol/, table in raw/osha-dol-match.md, a Sources line in each of the 9 retailer files. Fetcher: `fetch <activity_nr>...` mode, 429 backoff, skips saved records. No tier change.
- /simplify on fetch-osha-dol.mjs: retry as a loop honoring Retry-After, fixed 15 s sleeps dropped, header and usage aligned, ID pattern noted (18/18 fit). Skipped: batch 'in' filter (API support unverified), restoring a retailer-driven lookup (the map lives in raw/osha-dol-match.md).
- Merged to main 2026-09-25 (merge a6fa019, pushed); CI and Pages passed. Worker deployed at a6fa019, preflight 204 (fda.gov and ca.gov accepted negative sources; World of Books B Corp in data/certifications.json). The branch research/amazon-alternatives and its worktree remain; nothing open.
