# Research prompt: sites that list Amazon alternatives, and the retailers they name

You are a research agent (or one of several) for **nottheriver**, a site that recommends retailers ranked by ethics, environmental practice and proximity, and never shows Amazon. This prompt is the shared brief: every agent in the run reads it, and a single agent can run it end to end. "Today" is the date the operator gives you; write it as `checked:` on everything you touch.

## 1. Goal

Build a sourced, ranked index of US websites that list alternatives to Amazon, sort them into the categories in section 3, score each one with the rubric in section 4, and turn the retailers they recommend into a small retailer database rated the nottheriver way (section 5). Everything is committed under `research/` as Markdown files with YAML front matter, so the files are both source material and the database.

Scope: **US only.** A site is in scope if it is written for US shoppers or its retailers mostly ship to the US. Skip UK, Canadian, EU and Australian lists; if you meet one that is notable, add one line to `research/raw/out-of-scope.md` and move on.

## 2. Rules that are not negotiable

1. **Cite or omit.** Every factual claim about a site or a retailer (ownership, affiliate links, certifications, lawsuits, labor findings) has a source URL you fetched this run. If you cannot fetch a source, do not write the claim. Never cite a page from memory.
2. **No model-authored accusations.** A concern is recorded as its kind, the source's own title, the source URL and its date. Do not paraphrase an allegation into a stronger claim than the source makes. "Alleged", "settled", "fined", "found" mean different things: use the source's word.
3. **Amazon-owned is a fact, not an opinion.** A retailer is Amazon-owned only if it matches `data/blocklist.json` (domains) or its names list. Those entries are sourced in `data/blocklist.md`; cite that file. If you believe a company is Amazon-owned and it is not on the list, record it in `research/raw/blocklist-candidates.md` with a source; do not edit `data/`.
4. **Down-ranking follows the project policy.** A concern changes a retailer's score only if its source's registrable domain is in `data/negative-sources.md` (regulators, courts, AP, NPR, ProPublica, Good Jobs First and others). Concerns from other reputable outlets are recorded with `accepted_source: false` and shown, but do not change the score. This mirrors `docs/ranking.md`.
5. **Be fair to list sites.** Affiliate links are not bad by themselves; undisclosed ones are. Judge what the page does, not who wrote it.
6. **Don't touch `data/`, `proxy/`, `src/` or `infra/`.** This research must not change the live site or trigger a Worker deploy.
7. **No secrets, no personal data.** Don't record author names of personal blogs beyond what the site shows as its byline, and don't record anyone's contact details.

## 3. Categories for list sites

Each site gets exactly one `category` (the one that best describes the page as a whole) and optional `also` tags.

| Slug | Meaning | Tells |
|---|---|---|
| `clickbait` | Thin or recycled content made to catch search traffic | Generic intro, no reasons per pick, listicle padding, heavy ads, many pages on the same theme, AI-sounding filler, dead or closed retailers |
| `affiliate-funnel` | "Best of" list built to send you to one or a few paid picks | #1 pick repeated, "our top pick" boxes, affiliate links on the top items and none on the rest, a sponsor, coupon codes |
| `ethical-anti-amazon` | Argues against Amazon on ethical or political grounds (labor, monopoly, surveillance, environment), then offers alternatives | States its reasons, often cites reporting |
| `ethical-anti-bigbox` | Same, but explicitly against a named set of companies (such as Amazon, Walmart, Target) or "big box" and billionaire-owned retail in general | Names the excluded companies and why |
| `ethical-affirmative` | Recommends shops **because** they are ethical, sustainable or treat workers well (B Corp, co-op, fair trade, union, local) | Criteria for inclusion, per-shop reasons, certifications |
| `tool` | An app, database, directory, index, browser extension or rating service that gives this information on demand | Searchable, many companies, a method page |

Retailers themselves (bookshop.org, REI, Etsy) are not list sites: they go in the retailer database (section 5).

## 4. Site score (0 to 100)

Score from what you can see on the page and its about/disclosure pages. Write a one-line reason for each part.

| Part | Points | Full marks when |
|---|---|---|
| Independence and disclosure | 20 | No affiliate links, or affiliate links clearly disclosed near the top; no paid placement; owner is identifiable |
| Evidence | 20 | Claims about each retailer (ethics, ownership, sustainability) cite sources or certifications |
| Substance | 20 | Many distinct, real, non-Amazon options, each with a specific reason; categories of goods covered |
| Currency | 15 | Updated in the last 2 years; retailers still exist and still sell what is claimed |
| Usefulness | 15 | Easy to act on: organized by product type, links work, says who ships where |
| No dark patterns | 10 | No bait headline, no pop-up walls, no top pick repeated, no Amazon-owned or Amazon-marketplace links passed off as alternatives |

Deduct under "No dark patterns" and "Substance" if the list recommends an Amazon-owned company (such as Zappos, Whole Foods, AbeBooks, Woot) or links to Amazon itself. Record each one in `amazon_owned_recommended`.

For a `tool`, read "the page" as the product: its method page, coverage, and whether its ratings cite sources.

## 5. Retailer rating (the nottheriver way)

For each retailer, compute the same two components the live site uses (`docs/ranking.md`):

- **ethics** and **environment** each start at **0.5** (unknown is not bad).
- **+0.25** per certification kind, capped at 1.0: `b_corp`, `fair_trade`, `worker_coop` count in ethics; `one_percent_planet` and `climate_neutral` (The Climate Label) count in environment. Only certifications you verified on the certifier's own directory page this run count (for example `bcorporation.net/find-a-b-corp`).
- **−0.25** per concern with `accepted_source: true`, floored at 0, applied after the cap. Labor and governance concerns count in ethics; environmental concerns count in environment. A concern counts once per kind and source page.

Then assign a **tier**:

| Tier | Rule |
|---|---|
| `excluded` | Amazon-owned (blocklist match). Never recommended, whatever else is true |
| `recommended` | ethics + environment ≥ 1.25 and no accepted concern in the last 5 years |
| `acceptable` | Not excluded, and ethics + environment ≥ 1.0 |
| `caution` | Everything else |

Also record, where a source shows it: ownership (`public`, `private`, `private-equity`, `cooperative`, `employee-owned`, `nonprofit`, `public-benefit-corporation`, `unknown`), parent company, whether it runs a third-party marketplace, and whether it sells through Amazon's marketplace. Leave a field `unknown` rather than guessing.

## 6. Files

```
research/
  README.md                  what this is, the layout, and how to rebuild the index
  amazon-alternatives.md     the overview report (for people)
  method.md                  this rubric, the search log summary, known limits
  sites/<slug>.md            one per list site, app, database or index
  retailers/<slug>.md        one per retailer
  raw/                       source material: search logs, candidate lists, mention tallies
```

`<slug>` is the registrable domain with dots as hyphens (`thegoodtrade-com`). If one domain has two separate list pages, keep one file and list both pages.

### `sites/<slug>.md`

Both examples below are illustrative: their names, dates and values are not facts. Never copy a value from them.

```markdown
---
name: The Good Trade
domain: thegoodtrade.com
url: https://www.thegoodtrade.com/features/amazon-alternatives/
kind: article            # article | app | database | directory | extension | campaign
category: ethical-affirmative
also: [affiliate-funnel]
score: 64
score_parts: {independence: 10, evidence: 12, substance: 16, currency: 12, usefulness: 9, no_dark_patterns: 5}
affiliate_links: disclosed   # none | disclosed | undisclosed | unknown
owner: Good Trade Media     # as shown on the site, or unknown
updated: 2026-03-01         # as shown, or unknown
retailers_listed: 17
amazon_owned_recommended: []
checked: 2026-09-25
---

One paragraph: what it is, who runs it, what it argues.

## Score
One line per part, with the reason.

## Retailers named
| # | Retailer | Domain | Reason the page gives |

## Sources
- fetched URLs, one per line
```

### `retailers/<slug>.md`

```markdown
---
name: Bookshop.org
domain: bookshop.org
type: retailer           # business model: retailer | marketplace | co-op | secondhand | brand | grocer
goods: [books]
ownership: public-benefit-corporation
parent: none
hq: New York, NY
marketplace: false       # true only if it hosts third-party sellers
sells_on_amazon: unknown
amazon_owned: false
certifications:
  - {kind: b_corp, source: https://www.bcorporation.net/..., checked: 2026-09-25, verified_this_run: true}
concerns:
  - {kind: labor, title: "Source's own headline", source: https://..., date: 2019-05-01, accepted_source: false}
ethics: 0.75
environment: 0.5
tier: recommended
mentions: 2               # must equal the length of mentioned_by
mentioned_by: [thegoodtrade-com, ethicalconsumer-org]
checked: 2026-09-25
---

One or two paragraphs of background: what it sells, who owns it, why lists recommend it.

## Rating
How ethics and environment were computed, line by line.

## Sources
```

## 7. Process

1. **Discover.** Search many ways: generic ("alternatives to Amazon"), per product type (books, electronics, clothes, groceries, household), per motive (boycott, labor, antitrust, "shop small", sustainable, B Corp, worker-owned, fair trade), per format (app, browser extension, directory, database), and news coverage of Amazon boycotts. Log every query and what it found in `research/raw/`.
2. **Assess.** Fetch each candidate page and its about and disclosure pages. Classify, score, and extract every retailer named, in order, with the page's reason.
3. **Calibrate.** Read all site files together; make categories and scores consistent across sites.
4. **Tally.** Count mentions per retailer across in-scope sites (by domain). Take the top ~100.
5. **Rate retailers.** Research each one per section 5. Then a second agent tries to refute every certification and concern by fetching its source, and removes anything unsupported.
6. **Report.** Write `research/amazon-alternatives.md`: what kinds of sites exist, which are worth using and why, which Amazon-owned companies get recommended as "alternatives", which retailers appear most, and how the recommended ones rate. Keep the house style: plain words, short sentences, every number traceable to a file.
7. **Index.** A small script builds `research/index.json` from the front matter and fails on missing or malformed fields.

## 8. Running it unattended (for the lead agent)

The operator is away. Run the whole of section 7 without asking questions, using multiple agents. Use a workflow if one is available. Otherwise use parallel subagents.

- **Check first.** Before any research, make a commit and push it to your working branch (never `main`). If the push fails, stop and report. Don't do work that can't be saved.
- **Budget.** You may use a large share of the operator's token limit. Aim for about 40 to 60 agents in total:
  - about 6 discovery agents, one per search angle in step 1, plus a completeness critic;
  - one assessor for every 3 to 4 sites, plus one calibrator;
  - one researcher for every 5 retailers, each followed by one verifier that tries to refute the researcher's claims;
  - a report writer, an index builder, and a final QA agent that checks every file for valid front matter and claims without a source.
- **Stage by stage.** Finish each stage and review what came back before starting the next, so later stages can build on the combined results. Within a stage, run agents in parallel. Give each agent its own files to write, so no two agents write the same file. Don't let subagents commit. The lead agent commits.
- **Commit and push after each stage** (discovery, sites, tally, retailers, report, index), so a crash loses at most one stage.
- **Index script.** Put `research/build-index.mjs` and a test for it at `research/build-index.test.mjs`. Add `research/**/*.test.mjs` to `vitest.config.ts`, then run `npm ci`, `npm run lint` and `npm test`, which must pass.
- **Leave out anything you trim.** If you cap discovery, sites or retailers, record in `method.md` what was left out.
- **Finish** with a short summary: the number of sites per category, the top-scored sites, the Amazon-owned companies recommended as "alternatives", the retailer tier counts, and what is left to do.

## 9. Run tuning (2026-09-25)

These settings override sections 1 to 8 where they differ. The operator set them for this run.

- **Today** is 2026-09-25. Write `checked: 2026-09-25`.
- **Caps.** Assess at most 30 sites and rate at most 50 retailers (the top 50 by mentions). Record the trimmed candidates in `method.md`.
- **Amazon-owned retailers** are not researched. Their file has `amazon_owned: true`, `tier: excluded`, the matching blocklist entry, and a citation of `data/blocklist.md`.
- **Certifications.** Each certification row carries `verified_this_run`. If the certifier's directory page blocks you, a row in `data/certifications.json` for the same domain and kind may count, with `verified_this_run: false` and that row's `source_url`. Nothing else counts without a fetch.
- **Blocked or unfetchable pages.** Add a line to `research/raw/blocked-<your-agent-id>.md` (URL, what you wanted from it). Make no claim from that page. The operator checks these later.
- **Outbound requests.** Never put the operator's name or email in a search query, URL or form.
- **Your files only.** Write only the files named in your task. Don't commit, and don't touch anything outside `research/`.
- **Short replies.** Your final reply to the lead is at most 15 lines: the files you wrote, counts, and blockers. Findings go in your files, not in the reply.
- **Save as you go.** Write each file as soon as it's done rather than holding everything until the end. The run may stop without warning (usage limit); a finished file survives, and an unwritten one is lost.
- **Validation.** `node research/build-index.mjs` checks every file's front matter. It re-derives `accepted_source` (source domain in `data/negative-sources.json`), `ethics`, `environment`, `tier` and `mentions`, and fails on a mismatch. When you've written your files, run it and fix any error it reports in them.
- **Discovery angles** (one agent each): generic; product types; motives (ethics, labor, antitrust, boycott); motives (shop small, local, co-op, B Corp, fair trade, sustainable); formats (apps, extensions, directories, databases, rating services); news coverage of Amazon boycotts.
- **Field values the index script enforces.** Concern `kind` is `labor`, `governance` or `environmental`. Each certification has `verified_this_run: true|false`. `score` equals the sum of `score_parts`. `mentions` equals the length of `mentioned_by`, and every slug there has a file in `sites/`. The file name is the slug of `domain`, and `domain` is the registrable domain.
- **Retailers named by tools.** A `tool` (or a directory or database) lists only the retailers it presents as a curated set on its own pages, such as a featured list, not its whole database. If it has none, the table has a single row: "none (tool)", and `retailers_listed: 0`.
- **Retailers table is machine-read.** In `## Retailers named`, the Domain column holds the retailer's registrable domain (`bookshop.org`, not `www.bookshop.org/shop`), or `unknown` if the page gives no link and you can't find the retailer's site. Amazon-owned retailers stay in the table and are also listed in `amazon_owned_recommended`.
- **Blocklist lookup.** `node research/build-index.mjs --blocklist "<name>" <domain>` says whether a retailer is Amazon-owned per `data/blocklist.json`.
- **Access.** Never disguise a request as a browser (no browser user agent, no curl or wget with spoofed headers). Never get around a paywall, a paid gate for bots (tollbit, HTTP 402), a login or robots rules. A blocked page goes to your blocked file for the operator. Following a short link with plain curl to learn where it points is fine.

### Assessor rules (from the pilot, 2026-09-25)

- R1. Keep every retailer the page names, including non-US picks and free-exchange networks; count them and say so in the Reason column. They cost points under Substance, not rows.
- R2. For a retailer's domain, decode the affiliate URL's destination parameter (`ued`, `url`, `u`, `murl`). Follow an opaque short link (pxf.io, sjv.io, ltk.com) with plain curl only.
- R3. A "Partner" or sponsor label on a pick is paid placement: deduct under Independence and add `affiliate-funnel` to `also` (unless it is the category).
- R4. Owner is what the footer, about page or terms state. A link to another company's advertise page is not ownership.
- R5. Currency comes from the page's shown update date. Don't fetch every retailer; say which ones you checked.
- R6. Marketplaces and aggregators (Shop, eBay, Etsy) are retailers under their own domain.
- R7. Deduct each fact under one score part only. A newsletter prompt is not a pop-up wall.
- R8. A named certification with no link to the certifier earns partial Evidence credit, not full.
- R9. A tool with no curated list has exactly one row, `| - | none (tool) | - | <reason> |`, and `retailers_listed: 0`.
