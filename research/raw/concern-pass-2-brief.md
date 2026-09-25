# Concern pass 2: agent brief (2026-09-25)

The first pass ran out of web searches, so every retailer tier is provisional. This pass adds the accepted sources that are still reachable **without web search** and **allowed by robots.txt**. It can only add concerns, so it can only lower a tier.

Read first: `research/brief.md` sections 5, 6 (`retailers/<slug>.md`) and 9. Those rules apply unchanged, including "What counts as a concern" and the OSHA rule. Don't reinterpret them; if a rule decides a case, log it (below).

## Your task

You get a batch id (`C1` to `C4`) and a list of retailer slugs. For each retailer, in order:

1. Read `research/retailers/<slug>.md` and `research/raw/concern-fetch/<slug>.json`.
2. **FTC:** WebFetch `https://www.ftc.gov/legal-library/browse/cases-proceedings?search=<name>` (URL-encode the name; try the parent company too if the file names one). List the cases whose respondent is the retailer or its parent.
3. **CourtListener** (in the JSON): dockets since 2016 whose caseName pairs the retailer with an agency or government party. Keep only cases where a government body (EEOC, FTC, Secretary of Labor, EPA, a state attorney general, the United States) is suing the company. Drop criminal cases against individuals, cases where the company sues the government, and name collisions.
4. **ProPublica** (in the JSON): skim article slugs for ones about the retailer. Open one only if its slug suggests an agency or court action against the company.
5. Before recording a concern, **open the page you cite** (the FTC case page, the CourtListener docket, the ProPublica article) with WebFetch and quote from it in the body. The WebFetch summary comes from a small model and can invent titles, so only record what the fetched page itself shows: party names, date, and outcome if shown. A docket that only shows a complaint is an agency-issued complaint and counts; one that shows dismissal counts as a body note, not a concern.
6. Edit the retailer file:
   - Add concern rows (`{kind, title, source, date, accepted_source: true}`; `labor` for EEOC or Labor Department cases, `governance` for FTC, consumer or antitrust cases, `environmental` for EPA or state environmental cases). Recompute ethics, environment and tier by the brief's rules.
   - Add a body sentence starting "Second pass (2026-09-25):" that lists what you checked and what you found, including "no matching cases" results.
   - Replace the "Concern search incomplete this run ..." line under `## Rating` with: `- Concern search partial: pass 2 checked FTC cases, CourtListener agency dockets since 2016 and ProPublica; no general news search, and DOJ, SEC and Violation Tracker were unreachable; tier is provisional.` Keep a line that already says more.
   - Add every page you fetched to `## Sources`.
7. Run `node research/build-index.mjs` from the worktree root; fix any error it reports in your files.
8. Append the retailer's result to `research/raw/concerns2-<batch>.md` (see below) **before** starting the next retailer.

## Limits

- At most **25 WebFetch calls** for the whole batch. If you run out, write what you have and list the unchecked retailers in your log.
- **No WebSearch** (the session budget is spent).
- **Don't fetch these** (robots.txt disallows them): `osha.gov/ords/...`, `nlrb.gov/search/...`, `echo.epa.gov` search or report pages, `echodata.epa.gov`, `cpsc.gov` recall search. Don't retry Violation Tracker, justice.gov or sec.gov (HTTP 403).
- The Access, Outbound requests and Your files only rules in brief section 9 apply. Edit only your batch's retailer files and your log. Don't commit.

## Log file: `research/raw/concerns2-<batch>.md`

One section per retailer:

```
## <slug>
- FTC: <n cases, or none> (<URL>)
- CourtListener: <kept dockets with URL, or none of the n returned>
- ProPublica: <relevant articles, or none>
- Concerns added: <rows, or none>. Tier: <old> -> <new>
- Rule decided it: <which brief section 9 rule changed the outcome, and how the case would go without it; or "none">
```

Blocked pages go to `research/raw/blocked-concerns2-<batch>.md`.

## Reply to the lead

At most 10 lines: retailers done, concerns added, tier changes, WebFetch calls used, blockers.
