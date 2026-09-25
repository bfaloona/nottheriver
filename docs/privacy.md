# Privacy

What the site collects, where it goes, and what is kept. Nothing here says "nothing is kept", because something always is.

## What leaves your browser

- **Your zip code does not.** The browser downloads one static file, `zips.json` (the same path for everyone, so the request itself reveals nothing), and looks the zip up locally.
- **One request per search**, to the search Worker, with at most six fields: the product text, the city, the state, the center of your zip area (latitude and longitude rounded to two decimal places, about 1 km), and your zip area's rural-urban code (one of 10 USDA categories, left out when the zip has none). The Worker uses the code only to decide how far counts as nearby and does not forward it.
- **That center identifies your zip area.** The Worker forwards it to Brave Search to find nearby shops, so Brave learns the zip area of each search. Nothing finer is ever collected, and the site never asks for a street address.
- **Without JavaScript, nothing is sent.** The zip field has no `name`, and the built site's Content Security Policy forbids form submission (`form-action 'none'`), so a script failure cannot turn the zip into a URL or a request.
- **Outbound links carry no page URL.** Both pages set a `no-referrer` referrer policy through a `<meta name="referrer">` tag.
- **The map loads images from OpenStreetMap.** When a search shows shops near you, the browser downloads map images (tiles) for the area around them straight from `tile.openstreetmap.org`. Those requests carry your IP address and your browser's User-Agent, and the tiles requested show roughly where the search was. They send the site's origin as the Referer (OpenStreetMap requires one), never a page path.

## Who receives what

| Recipient | Receives | Does not receive |
|---|---|---|
| Brave Search, web search | Search terms derived from your product; the zip-area center as `x-loc-lat` / `x-loc-long` headers; city and state as `x-loc-city` / `x-loc-state` headers; `x-loc-country`, always `US` | Your zip, your IP address, your browser's User-Agent or Referer |
| Brave Search, place search | Search terms; the zip-area center as `latitude` / `longitude` query parameters (so Brave gets the center twice per search) | City, state, your zip, your IP address |
| OpenStreetMap tile servers (from your browser, not the Worker) | Requests for map images covering the shops near you and the center of your zip area; your IP address, User-Agent and the site's origin | Your zip, the product, any page path |
| OpenRouter and the model provider it routes to | Your product text, city and state (first call); titles, snippets and URLs of the fetched search results (second call) | Coordinates, your zip, your IP address |

The Worker builds every outbound header from fixed values, so your browser's `User-Agent` and `Referer` never reach Brave or OpenRouter. OpenRouter also receives the site's name and URL in its documented app-attribution headers.

## What is kept, and where

| Where | What | How long |
|---|---|---|
| Cloudflare rate limiter | A client key: your full IPv4 address, or the first half (/64) of an IPv6 address | The 60-second limit window. Limits are 30 searches per minute per key and 60 per minute for the whole site, counted per Cloudflare location and approximate by Cloudflare's own description. An in-memory limiter also holds the same keys in the Worker instance's memory; they stop counting after 60 seconds but stay in memory until that instance is recycled, or until the table passes 10,000 keys and expired ones are swept |
| Cloudflare, as the platform | Request metadata, including IP address | Per Cloudflare's own policy |
| Worker logs | One line per request: route, status code, latency. Never bodies, product text, coordinates or keys | Workers observability is disabled (`proxy/wrangler.jsonc`, `infra/main.tf`), so Cloudflare does not retain these lines beyond its platform metadata. If an operator turns it on, the retention window must be added here |
| GitHub Pages | Access logs for the site and `zips.json` | Per GitHub's own policy |
| OpenStreetMap | Tile request logs | Per the OpenStreetMap Foundation's privacy policy |
| Brave, OpenRouter, the model provider | The data in the table above | Per each service's policy; see the OpenRouter settings below |
| Your browser | The last product you typed, in `sessionStorage` (cleared when the tab closes). Never the zip | Until the tab closes |

No cookies, no analytics, no third-party scripts, no CDN fonts. The map library (Leaflet) is bundled with the site; only the map images come from a third party.

## OpenRouter settings (operator action, not verified)

The operator should review the account's privacy page at https://openrouter.ai/settings/privacy, opt out of routing to providers that may train on prompts (OpenRouter documents separate toggles for paid and free models), and set the account-wide data-policy filter. On 2026-09-23 OpenRouter's docs (https://openrouter.ai/docs/features/privacy-and-logging) named those controls but no separate prompt-logging toggle. **The setting names and their effect were not verified**, and whether they have been set on the deployed account is not recorded here.

Independently of the account settings, every request the Worker sends asks OpenRouter to use only providers that do not collect data (`provider.data_collection: "deny"`). If no provider meets that and the other request requirements, the search fails instead of quietly relaxing it.

## Shared origin

The site is served from a `github.io` address. That origin is shared by every GitHub Pages project of the same account, and the Worker's CORS rule allows the origin, not the path, so any of those pages could call the Worker from a browser. CORS is not authentication anyway (the Worker is safe to call from curl, and the rate limits apply to everyone); a custom domain is the fix, listed in [debt.md](debt.md).
