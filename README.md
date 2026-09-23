# nottheriver

Type a product and a US zip code, and this site suggests retailers that sell it, split into stores near you and online shops, ranked by ethical practice, environmental sustainability, and proximity. Amazon and Amazon-owned businesses never appear. That exclusion is the reason the site exists.

Status: proof of concept, not yet deployed. See [docs/STATUS.md](docs/STATUS.md).

## Features

- **No Amazon, ever.** Amazon and the businesses it owns or has owned are removed from every result, in every section, by deterministic code that runs twice per search. Every entry on the list cites a public source: [data/blocklist.md](data/blocklist.md).
- Local and online results, ranked by ethics, environmental practice, and distance.
- Every rank is explainable: each score component is shown with its value and source, and every negative finding can be disputed.
- Your zip code never leaves your browser.

## Docs

- [Privacy](docs/privacy.md): what leaves the browser and what is kept
- [How ranking works](docs/ranking.md), including the down-ranking policy
- [Costs](docs/costs.md): the open ledger of unit prices and cost per search
- [Search quality](docs/quality.md): how precision and recall are measured
- [Known shortcuts](docs/debt.md)
- [Architecture and deployment](docs/architecture.md), and decision records in [docs/decisions/](docs/decisions/)

## Local development

Requires Node 22 and npm.

```sh
npm install
npm test
npm run dev                  # site on http://localhost:5173
npx wrangler dev --cwd proxy # Worker on http://localhost:8787
```

The Worker reads its keys from `proxy/.dev.vars` (gitignored): one line each for `BRAVE_API_KEY=` and `OPENROUTER_API_KEY=`. Use keys made for this project, with spend caps, not keys shared with another project. Without keys the site still loads, but searches fail; `npx playwright test tests/e2e/smoke.spec.ts` runs the whole flow against fixtures with no keys at all (a full `npm run e2e` also rewrites the screenshots in `docs/evidence`).

## License

[AGPL-3.0](LICENSE)
