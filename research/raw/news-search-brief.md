# Concern pass 3: news search brief (for a fresh session)

Passes 1 and 2 couldn't run a general news search: the first session's 200 web searches were used up during the retailer stage. This pass runs one, so the tiers can stop being provisional.

## Lead setup

- Start a new session with a higher cap: `CLAUDE_CODE_MAX_WEB_SEARCHES_PER_SESSION=600 claude`. The cap covers the whole session, all subagents included.
- Worktree `/Users/brandon/dev/ai/nottheriver-research`, branch `research/amazon-alternatives`. Read `research/raw/run-log.md` ("Resume cold") first.
- Run 4 Opus agents in parallel, one per batch below, and commit after each one finishes. Don't merge to main until the operator asks.
- The four rules set during the run (D1 to D4, in `research/brief.md` section 9 and `method.md`) were approved by the operator on 2026-09-25. Apply them as written.

## Batches (same as pass 2)

| Batch | Retailers (slugs under `research/retailers/`) |
|---|---|
| N1 (recommended) | bookshop-org, eileenfisher-com, equalexchange-coop, etsy-com, grove-co, mightly-com, patagonia-com, tentree-com, uncommongoods-com, wearpact-com |
| N2 | ableclothing-com, avocadogreenmattress-com, backmarket-com, bestbuy-com, betterworldbooks-com, blkgrn-com, bobsredmill-com, christydawn-com, credobeauty-com, depop-com |
| N3 | earthhero-com, ecoroots-us, girlfriend-com, kobo-com, kotn-com, libro-fm, lovegrown-com, madetrade-com, misfitsmarket-com |
| N4 | overstock-com, packagefreeshop-com, poshmark-com, powells-com, publicgoods-com, shop-app, tenthousandvillages-com, thedetoxmarket-com, worldofbooks-com |

The 12 caution retailers are left out: a new concern can't change their tier.

## Agent task

Read `research/brief.md` sections 5, 6 and 9 first. For each retailer, in order:

1. **Search** (at most 3 WebSearch calls per retailer, **30 per agent**): `"<name>" lawsuit OR settlement OR fine OR violation`, `"<name>" (EEOC OR OSHA OR "Department of Labor" OR FTC OR EPA OR "attorney general")`, and one for the parent company if the file names one. For a non-US company (Tentree, Kotn, Kobo, World of Books, Shop, Depop), make the third search about that country's regulator.
2. **What counts.** A news story counts only if it reports an **agency or court action** against the company: a citation, an agency complaint, a fine, a settlement, a judgment or a finding (brief section 9, "What counts as a concern"). Private lawsuits with no ruling, and actions later dismissed, go in the body as notes.
3. **Source.** A concern's `source` must be a page on an accepted source (`data/negative-sources.json`), and you must open it with WebFetch and quote from it. If only a non-accepted outlet reports the action, look for the agency's own page. If you can't find one, note the action in the body with `accepted_source: false`, so it doesn't count.
4. **Don't fetch** pages that robots.txt disallows: `osha.gov/ords/`, `nlrb.gov/search/`, EPA ECHO search, CPSC recall search. Don't retry Violation Tracker, justice.gov or sec.gov (HTTP 403). No browser user agent, and don't get around paywalls (brief section 9, Access).
5. **Edit the file.** Add concern rows and recompute ethics, environment and tier. Add a body sentence starting "News pass (date):" that names what was searched and what was found. Replace the "Concern search partial" line with `- Concern search: passes 1 to 3 (agency pages, FTC, CourtListener, ProPublica, general news search).` Remove "tier is provisional" only if all 3 searches ran, and add fetched pages to `## Sources`.
6. Run `node research/build-index.mjs` and fix any errors in your files.
7. Append to `research/raw/news-<batch>.md` **before** the next retailer. Record: the queries, the relevant hits, the concerns added, the old and new tier, and any rule that decided the outcome.

Limits: 30 WebSearch and 30 WebFetch calls per agent. Edit only your batch's files and logs, and don't commit. Never put the operator's name or email in a query. Reply in at most 10 lines.

## After the agents

If any tier changed, update the tier lists and counts in `research/amazon-alternatives.md`, `method.md` and `README.md`. Then run `npm test` and lint, and log the result in the run log.
