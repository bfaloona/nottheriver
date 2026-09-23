# nottheriver

Type a product and a US zip code, and this site suggests retailers that sell it, split into stores near you and online shops, ranked by ethical practice, environmental sustainability, and proximity. Amazon and Amazon-owned businesses never appear. That exclusion is the reason the site exists.

Status: proof of concept, under construction.

## Features

- **No Amazon, ever.** Amazon and its subsidiaries are removed from every result, in every section, by deterministic code that runs twice per search.
- Local and online results, ranked by ethics, environmental practice, and distance.
- Every rank is explainable: each score component is shown with its value and source.

## Docs

- [Privacy](docs/privacy.md)
- [How ranking works](docs/ranking.md)
- [Costs](docs/costs.md)
- [Known shortcuts](docs/debt.md)

## License

[AGPL-3.0](LICENSE)
