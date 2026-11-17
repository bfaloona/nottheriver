import type { SearchResponse } from '../proxy/src/contract';
import { round2, search } from './api';
import { disputeUrl, siteName, zipsUrl } from './config';
import { bindControls, filterResults, showCertifiedCount } from './controls';
import { removeMap, renderFooter, renderMap, renderResults, renderStatus, type MapPin, type RenderConfig } from './render';
import { loadZips, lookupZip, parseZip } from './zip';

// Only the product text is remembered, never the zip.
const PRODUCT_KEY = 'product';

const $ = <T extends HTMLElement>(selector: string) => document.querySelector<T>(selector)!;

const form = $<HTMLFormElement>('#search');
const product = $<HTMLInputElement>('#product');
const zip = $<HTMLInputElement>('#zip');
const button = form.querySelector<HTMLButtonElement>('button[type=submit]')!;
const status = $('[data-status]');
const results = $('#results');
const sections = $('#result-sections');
const cost = $('[data-cost]');
const page = $('.page');

document.title = siteName;
$('[data-site-name]').textContent = siteName;

try {
  product.value = sessionStorage.getItem(PRODUCT_KEY) ?? '';
} catch {
  // Storage can be disabled; remembering the product is only a convenience.
}

let current: SearchResponse | null = null;
let center: { lat: number; lon: number } | undefined;

let clearMap: (() => void) | undefined;

// A map that fails to load or draw is dropped; the list below it still works.
function onMap(container: HTMLElement, pins: MapPin[]): void {
  import('./map')
    .then((m) => {
      clearMap = m.clearMap;
      m.drawMap(container, pins, center);
    })
    .catch(() => {
      mapOpen = false;
      removeMap(container);
    });
}

// The width from which the map fits beside the list (the stylesheet's map column is 18rem
// wide there). Below it the map waits behind a button (see RenderConfig.mapButton). The
// stylesheet lays the map out from what the renderer marks, not from a media query of its own,
// but its column width counts on the page's left margin, which starts at this same 64rem
// (styles.css, ".site-header, .page, .site-footer"): change the two together.
const mapBeside = matchMedia('(min-width: 64rem)');
// Whether the visitor opened the map for the search on screen.
let mapOpen = false;
// The layout the map was last drawn in.
let drawnBeside: boolean | undefined;

function renderConfig(): RenderConfig {
  drawnBeside = mapBeside.matches;
  const mapButton = drawnBeside ? undefined : { open: mapOpen, onToggle: (open: boolean) => { mapOpen = open; } };
  return { disputeUrl, onMap, onNoMap: () => clearMap?.(), mapButton };
}

const readView = bindControls(results, () => {
  if (current) show(current);
});
// Chromium also fires this with nothing changed while it takes a full-page screenshot.
mapBeside.addEventListener('change', () => {
  if (current && mapBeside.matches !== drawnBeside) renderMap(current, sections, renderConfig(), readView());
});

function show(response: SearchResponse, newSearch = false): void {
  // Before the view is read: a new search with no certified shop takes the filter off.
  showCertifiedCount(results, [...response.local, ...(response.local_farther ?? []), ...response.online], readView(), newSearch);
  const view = readView();
  const visible = renderResults(response, sections, renderConfig(), view);
  renderStatus(
    status,
    visible > 0
      ? { kind: 'done', near: response.local.length, online: response.online.length, onlineShown: filterResults(response.online, view).length > 0 }
      : { kind: 'filtered' },
  );
}

function clearResults(): void {
  current = null;
  mapOpen = false;
  results.hidden = true;
  cost.hidden = true;
}

function fieldError(input: HTMLInputElement, message: string): void {
  const help = document.getElementById(input.getAttribute('aria-describedby')!)!;
  help.textContent = message;
  help.hidden = !message;
  if (message) input.setAttribute('aria-invalid', 'true');
  else input.removeAttribute('aria-invalid');
}

// The zip list is 341 KB; starting it when the visitor first touches the form takes it off the
// search's critical path without loading it for visitors who never search. A failure here is
// retried by the submit, which reports it.
form.addEventListener('focusin', () => void loadZips(zipsUrl).catch(() => {}), { once: true });

form.addEventListener('submit', (event) => {
  // First, so a later exception can never let the browser submit the form.
  event.preventDefault();
  void run();
});

async function run(): Promise<void> {
  const text = product.value.trim();
  const code = parseZip(zip.value);
  fieldError(product, text ? '' : 'Type what you are looking for.');
  fieldError(zip, code ? '' : 'Enter a five-digit zip code.');
  if (!text) return product.focus();
  if (!code) return zip.focus();

  button.disabled = true;
  try {
    const place = lookupZip(code, await loadZips(zipsUrl));
    if (!place) {
      fieldError(zip, "That zip code isn't in our list. Check the five digits and try again.");
      return zip.focus();
    }

    try {
      sessionStorage.setItem(PRODUCT_KEY, text);
    } catch {
      // See above: optional.
    }

    // Clear the previous search first, so a filter change mid-flight or after a
    // failure cannot redraw old results over the status line.
    clearResults();
    // From here on the page is for results. The headline stays hidden after a failed search too,
    // so the form does not move back down under the visitor.
    page.classList.add('searched');
    renderStatus(status, { kind: 'searching', city: place.city, state: place.state });
    const outcome = await search({ product: text, city: place.city, state: place.state, lat: place.lat, lon: place.lon, ruca: place.ruca });
    if (!outcome.ok) {
      return renderStatus(status, { kind: outcome.code === 'rate_limited' ? 'rate_limited' : 'failed' });
    }

    renderFooter(cost, outcome.data.usage);
    if (outcome.data.local.length === 0 && !outcome.data.local_farther?.length && outcome.data.online.length === 0) {
      return renderStatus(status, { kind: 'no_results', product: text });
    }
    current = outcome.data;
    // The same 2-decimal center the Worker receives, so the map shows nothing finer.
    center = { lat: round2(place.lat), lon: round2(place.lon) };
    results.hidden = false;
    show(current, true);
  } catch {
    // A failed zip download, or a response that passed the shape check but
    // breaks rendering, must not leave the status stuck on "Searching".
    clearResults();
    renderStatus(status, { kind: 'failed' });
  } finally {
    button.disabled = false;
  }
}
