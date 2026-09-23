# Known shortcuts

Shortcuts taken for the proof of concept, each with the best-practice alternative.

| Shortcut | Best-practice alternative |
|----------|---------------------------|
| Local OpenTofu state file; it holds both secret binding values and every sensitive variable (account id, API keys, Pages origin) in plaintext (gitignored, but on disk) | Encrypted remote backend with locking, or OpenTofu state encryption |
| In-memory, per-isolate rate limiting if the Cloudflare rate-limiting binding is unavailable | Platform rate-limiting binding or a shared store, backed by provider spend caps |
| Shared `github.io` origin for CORS | Custom domain, so the allowed origin is not shared with other project pages |
| Small hand-seeded certification and negative-signal lists | Live directory lookups or per-retailer checks against certifying bodies and accepted sources |
| Web-search fallback for local results if the Brave plan lacks local endpoints | Brave local (POI) endpoints or another places data source |
| No caching layer | Cache normalized queries and fetch results with a short TTL to cut cost and latency |
| No gitleaks rule for Brave Search keys: Brave's API docs do not publish a key format | Add a prefix-specific rule once Brave documents the format; meanwhile rely on the default generic rule and the CI bundle scan |
| Nothing cross-checks the OpenTofu rate-limit defaults (`rate_limit_per_minute` 30, `global_limit_per_minute` 60) against `RATE_LIMIT` / `GLOBAL_LIMIT` in `proxy/src/handler.ts`; the wrangler config test does not cover `infra/variables.tf` | A test that parses `infra/variables.tf` defaults and asserts they equal the handler constants |
| No route resource: the Worker is served on `workers.dev` only | Custom domain with a route resource |
| Zips with no ZCTA (7,846 GeoNames US postal codes, mostly PO-box/unique codes such as 10008) return not-found; no GeoNames-coordinate fallback, which would break the Census-only coordinate rule | Operator decision on a fallback or a clearer message |
| Single 1.27 MB `zips.json` (317 KB gzip -9) fetched on first search; per-prefix sharding rejected because the fetch URL would expose the zip prefix in GitHub Pages logs | Revisit if first-search latency matters |
| GitHub Pages compression of `zips.json` unmeasured until deploy | Measure with `curl -sI -H 'Accept-Encoding: gzip, br'` and record in `costs.md` |
| GeoNames place spellings kept as-is (e.g. 96860 -> 'Jbphh') | Curated display-name overrides |
| 111 ZCTAs share a centroid at 2-decimal rounding (intended ~1 km coarsening) | None needed; recorded so it is not mistaken for a bug |

## Before going public

- CONTRIBUTING guide
- Code of conduct
- Pull request templates
