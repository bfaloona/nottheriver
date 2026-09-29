# Operator checks needed (store types Phase 4, 2026-09-29)

Six pages the graders' browsers could not open. Open each in your own browser and answer the yes/no question. Until answered, these rows count as "unknown" and stay out of precision.

**How to apply an answer (cold-resume order).** Write each row's answer in `method/operator-checks.json` as `{"checks":[{"search_id", "result_id", "url", "sells_product", "page_access", "notes"}]}` (same shape as `eval20-0925/method/operator-checks.json`), then run from the repo root: `node docs/evidence/quality/eval20-store-types/method/merge.mjs`, `node docs/evidence/quality/eval20-store-types/method/reuse.mjs run2` (so run 2 picks up run 1's corrected grades; it takes them from `grades.json`), `node docs/evidence/quality/eval20-store-types/method/merge.mjs run2`, then `OUT_DIR=<run folder> node eval/summarize.mjs` for `eval20-store-types` and `eval20-store-types/run2`. Run 2 rows on these pages (5) update through that reuse; `operator-checks-run2.json` is only for rows that exist in run 2 alone. OC6 is a chain source, not a grade: record the answer as a `supports` row (`yes`, `no` or `unknown`, with `count_on_page`, `notes`, `checked`) in `method/chain-source-grades-browser.json`, which `merge.mjs` reads over the first pass.

Run 1 keys (`search_id|result_id`): OC1 `camping-tent-urban|online:walmart.com`; OC2 `camping-tent-urban|online:steepandcheap.com`, `camping-tent-suburban|online:steepandcheap.com`, `camping-tent-rural|online:steepandcheap.com`; OC3 `cordless-drill-suburban|local:loc45JU5CTCB7NAUB2E6OWGZNM2VYCKSYQPPAAAAAAA=:4`; OC4 `headlamp-urban|online:locally.com`; OC5 `rain-jacket-suburban|online:columbia.com`.

| Ref | Page | Searches | Question |
|---|---|---|---|
| OC1 | https://www.walmart.com/browse/sports-outdoors/camping-tents/4125_546956_4128_887708_2294923 | camping-tent-urban | Does it load and list camping tents for sale? |
| OC2 | https://www.steepandcheap.com/cat/tents | camping-tent-urban, -suburban, -rural | Does it load and list camping tents for sale? |
| OC3 | https://homedepot.com/l/Brentwood/TN/Brentwood/37027/723?emt=MSGoogleMaps | cordless-drill-suburban | Does the Brentwood, TN store page load, and can you find cordless drills sold at that store? |
| OC4 | https://www.locally.com/search/all/activities/headlamps?price=%2475-%24100-USD&location=San+Francisco+CA&store=348522&distance=%3C+100mi&sort=all | headlamp-urban | Does it load and list headlamps for sale? |
| OC5 | https://www.columbia.com/c/rainwear/ | rain-jacket-suburban | Does it load and list rain jackets for sale? |
| OC6 | https://www.rei.com/newsroom/article/rei-co-op-to-open-10-stores-in-2024-to-better-serve-outdoor-communities- | none (the source page of REI's "Chain, 190+ stores" badge, 10 badged rows per run) | Does it load, and does it state how many REI stores there are? |
