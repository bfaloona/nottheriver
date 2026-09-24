# Architecture

Two deployables: a static site on GitHub Pages and one Cloudflare Worker that owns the whole search pipeline. The site never talks to Brave or OpenRouter and never builds prompts.

```
browser ── GET zips.json (static, same path for everyone)
   │
   └── POST /search {product, city, state, lat, lon} ──> Worker ──> Brave Search (web, place)
                                                              └──> OpenRouter (2 structured calls)
```

## Request flow

`proxy/src/handler.ts` checks each request in this order: `OPTIONS` answers CORS preflight; anything but `POST /search` is 404; `Content-Type` must be `application/json` (415); the body is capped at 4 KB, counted in bytes as it streams (413); the per-client and global rate limits apply (429, `Retry-After: 60`; a limiter error also returns 429, so a fault never means unlimited spend); the body is parsed and validated against `proxy/schemas/search-request.json` (400). Errors are fixed strings that never echo input. CORS headers go only to the one allowed origin, but the route is safe to call from curl: CORS is not authentication.

`proxy/src/pipeline.ts` then runs:

1. **Normalize** (LLM call 1): product, city and state in; category, canonical name, similar products and search queries out, validated against `proxy/schemas/normalize.json`, retried once, then refused. Blocked brand names are stripped from every field. The words best, top, review, reviews and vs are removed from online queries unless the shopper typed them, and " store" is appended to a local query that does not end in store, stores, shop, shops or outfitters. Then the arrays are truncated (6 similar products, 3 online and 2 local queries).
2. **Fetch** (Brave): web search per online query, `place_search` per local query, at most 5 calls; the client refuses any call past 6. Results on a negative-source domain (regulators, courts, news) are dropped here: they are evidence, not shops.
3. **Dedupe**: online, the first page per registrable domain, except that a later shop page replaces a kept editorial one; local, one entry per registrable domain and street address (the text before the first comma, cut at ste, suite, unit, "space" before a number, or #), keeping the shortest name, so a store's department listings merge into the store. A place with no address falls back to its place id.
4. **Filter 1**: `filterBlocked` from `proxy/src/blocklist.ts` over every candidate (domain, name and embedded-URL rules).
5. **Editorial flag** (online only, `proxy/src/precision.ts`): a URL whose path has an editorial segment (blog, news, article and similar) or a slug with the word "best" is flagged, unless the URL is a homepage or has a shop segment (collections, product, shop, store and similar). Flagged pages are never results; they go to the model after the unflagged candidates as evidence for signals.
6. **Enrich**: curated certifications and findings joined by registrable domain, then LLM call 2 (skipped when no unflagged candidate survives). The model sees at most 24 online and 16 local candidates, each with an id, and the product. Code accepts a model-suggested signal only when it cites a fetched page ([ranking.md](ranking.md)). The same call classifies each candidate by id: a site type (retailer, marketplace, editorial, manufacturer_no_cart, service, other) and whether it sells the product (yes, maybe, no).
7. **Drop**: flagged pages, and candidates classified editorial, service or manufacturer_no_cart, or as not selling the product. **Fail open:** a candidate the model skipped, answered with an id it was never sent, or never saw because of the cap is kept, and so is one given a site type or sells value outside the allowed lists, because a wrong drop is invisible to shoppers and graders while a wrong keep is visible and can be graded. A reply that fails the schema's structure is retried once and then fails the search with 502, as before.
8. **Score**: `proxy/ranking/score.ts`, deterministic.
9. **Filter 2**, the last step before the response is built (`finalizeResponse`): `filterBlocked` again over each result's retailer name, domain and URL; then any result whose title, name, snippet or matched product contains the word "amazon" is dropped; then any certification, signal or score source whose URL is blocked is removed and the row is rescored, so a removed badge leaves no score behind.
10. **Respond**: top 10 per section (near you, online) with weights, components, sources, and usage (Brave calls, tokens, estimated cost). The response also carries the exact queries sent to Brave and a `dropped` list (kind, registrable domain and reason for each candidate the drop step removed or the top-10 cut left out, at most 60, checked against the blocklist again), so an evaluation can tell a shop the filters removed from one the search never found.

Filtering is only in the Worker; the browser renders what it gets. The editorial flag and the classification only ever remove candidates; both blocklist passes run regardless. The model is never the only line of defense: Filter 2 removes a blocked retailer however it entered after Filter 1, and `proxy/test/pipeline.test.ts` injects one into the enrich output to prove it.

## Build and deploy

Commands run from the repo root.

**Worker bundle:** `npm run build:proxy` writes `proxy/dist/index.js` (`wrangler deploy --dry-run`; nothing is uploaded).

**Infrastructure** (`infra/`, OpenTofu, Cloudflare provider 5.x). Secrets and account values come only from environment variables at apply time; nothing is committed in a `.tfvars` file. The paths below are placeholders:

```sh
export CLOUDFLARE_API_TOKEN="$(cat <secrets-dir>/<cloudflare-token-file>)"
export TF_VAR_account_id="<cloudflare-account-id>"
export TF_VAR_brave_api_key="$(cat <secrets-dir>/<brave-key-file>)"
export TF_VAR_openrouter_api_key="$(cat <secrets-dir>/<openrouter-key-file>)"
export TF_VAR_allowed_origin="https://<account>.github.io"   # origin only, no path
export TF_VAR_site_url="https://<account>.github.io/<repo>"  # full site base URL

npm run build:proxy
tofu -chdir=infra init
tofu -chdir=infra plan -input=false
tofu -chdir=infra apply -input=false
```

This creates the Worker (`cloudflare_workers_script`, with the two keys as secret bindings, `ALLOWED_ORIGIN`, `SITE_NAME` and `SITE_URL` as plain bindings, and two rate-limit bindings) and enables its `workers.dev` address (`cloudflare_workers_script_subdomain`). There is no route resource until a custom domain exists. Rate limits default to 30 per minute per client and 60 per minute globally (`rate_limit_per_minute`, `global_limit_per_minute`).

Use project-scoped Brave and OpenRouter keys with spend caps, not keys shared with another project. The caps are the real backstop behind the rate limits. The Cloudflare rate-limit bindings did not throttle in a live test on 2026-09-23 (135 requests from one client in about a minute, no 429), so the handler's in-memory limiter now always applies alongside them; it counts per isolate, so it is weak. A Durable Object counter is the robust alternative.

**State holds secrets in plain text.** State is local for the proof of concept (`infra/terraform.tfstate`, gitignored). After `apply` it holds both API keys, the account id and the origins unencrypted on disk, and so does any saved plan file. Keep the file off shared machines and out of backups you do not control; an encrypted remote backend is the fix ([debt.md](debt.md)).

**Plan evidence:** `infra/plan-evidence.sh` writes a redacted plan to `docs/evidence/tofu-plan.txt`. Because a plan stores every variable in plain text, the script refuses to run unless the five `TF_VAR_*` values are the test values it names (`test-brave`, `test-openrouter`, 32 zeros, and `http://localhost:5173` twice); it needs a real `CLOUDFLARE_API_TOKEN`, `gitleaks` on the path, and `npm run build:proxy` first. It redacts account ids and hosts and writes nothing if anything secret-looking remains.

**Site:** `.github/workflows/pages.yml` builds on every push to `main` and deploys `dist/` to GitHub Pages. One-time setup: in the repository settings set Pages' source to GitHub Actions, and add a repository Actions variable `WORKER_URL` holding the Worker's `workers.dev` URL (a variable, not a secret; it is public in the built site anyway). The workflow runs the tests and the bundle secret scan before uploading.

**Local development:** see the [README](../README.md).

## Client key and trust

The rate limiter keys each client on the `CF-Connecting-IP` header (a full IPv4 address, or an IPv6 /64). The client key is trusted only because the Worker is reachable solely through Cloudflare's edge; any non-Cloudflare deployment must derive it from the transport, not a header.

## Hosting elsewhere (Infomaniak)

The pipeline and handler use only web-standard `Request`, `Response` and `fetch`, with the platform passed in (`createHandler(runSearch, deps)`), so moving off Cloudflare is an adapter, not a rewrite. What is Cloudflare-specific: the rate-limit bindings (`RATE_LIMITER`, `GLOBAL_LIMITER`), the secret and plain-text bindings that deliver keys and settings as `env`, the `workers.dev` address, the `CF-Connecting-IP` client-key header, the Workers module entry point (`proxy/src/index.ts`), and the Cloudflare OpenTofu provider in `infra/`. On Infomaniak or any similar host these would become a Node or Deno HTTP service reading the same names from environment variables, a shared store for rate-limit counters (the in-memory limiter is per process and weak), the socket peer address as the client key, and that host's own provisioning. None of this adapter code exists yet.
