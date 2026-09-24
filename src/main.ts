import type { SearchResponse } from '../proxy/src/contract';
import { search } from './api';
import { disputeUrl, siteName, zipsUrl } from './config';
import { bindControls } from './controls';
import { renderFooter, renderResults, renderStatus } from './render';
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

document.title = siteName;
$('[data-site-name]').textContent = siteName;

try {
  product.value = sessionStorage.getItem(PRODUCT_KEY) ?? '';
} catch {
  // Storage can be disabled; remembering the product is only a convenience.
}

let current: SearchResponse | null = null;

const readView = bindControls(results, () => {
  if (current) show(current);
});

function show(response: SearchResponse): void {
  const visible = renderResults(response, sections, { disputeUrl }, readView());
  renderStatus(
    status,
    visible > 0
      ? { kind: 'done', near: response.local.length, online: response.online.length }
      : { kind: 'filtered' },
  );
}

function clearResults(): void {
  current = null;
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
    renderStatus(status, { kind: 'searching', city: place.city, state: place.state });
    const outcome = await search({ product: text, city: place.city, state: place.state, lat: place.lat, lon: place.lon });
    if (!outcome.ok) {
      return renderStatus(status, { kind: outcome.code === 'rate_limited' ? 'rate_limited' : 'failed' });
    }

    renderFooter(cost, outcome.data.usage);
    if (outcome.data.local.length === 0 && !outcome.data.local_farther?.length && outcome.data.online.length === 0) {
      return renderStatus(status, { kind: 'no_results', product: text });
    }
    current = outcome.data;
    results.hidden = false;
    show(current);
  } catch {
    // A failed zip download, or a response that passed the shape check but
    // breaks rendering, must not leave the status stuck on "Searching".
    clearResults();
    renderStatus(status, { kind: 'failed' });
  } finally {
    button.disabled = false;
  }
}
