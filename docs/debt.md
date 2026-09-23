# Known shortcuts

Shortcuts taken for the proof of concept, each with the best-practice alternative.

| Shortcut | Best-practice alternative |
|----------|---------------------------|
| Local OpenTofu state file | Remote state backend with locking and encryption |
| In-memory, per-isolate rate limiting if the Cloudflare rate-limiting binding is unavailable | Platform rate-limiting binding or a shared store, backed by provider spend caps |
| Shared `github.io` origin for CORS | Custom domain, so the allowed origin is not shared with other project pages |
| Small hand-seeded certification and negative-signal lists | Live directory lookups or per-retailer checks against certifying bodies and accepted sources |
| Web-search fallback for local results if the Brave plan lacks local endpoints | Brave local (POI) endpoints or another places data source |
| No caching layer | Cache normalized queries and fetch results with a short TTL to cut cost and latency |
| No gitleaks rule for Brave Search keys: Brave's API docs do not publish a key format | Add a prefix-specific rule once Brave documents the format; meanwhile rely on the default generic rule and the CI bundle scan |

## Before going public

- CONTRIBUTING guide
- Code of conduct
- Pull request templates
