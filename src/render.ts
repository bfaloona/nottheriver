import type { ComponentName, SearchResponse, SearchResult, SignalKind, SourceRef, Usage } from '../proxy/src/contract';
import { defaultView, filterResults, sortResults, type View } from './controls';
import { wirePopovers } from './popover';

// Everything in a SearchResponse is untrusted text from the web: nodes are built
// with textContent only, and a URL becomes an href only when it is http(s).

export interface RenderConfig { disputeUrl: string }

export type Status =
  | { kind: 'idle' }
  | { kind: 'searching'; city: string; state: string }
  | { kind: 'done'; near: number; online: number }
  | { kind: 'no_results'; product: string }
  | { kind: 'filtered' }
  | { kind: 'failed' }
  | { kind: 'rate_limited' };

const COMPONENT_LABELS: Record<ComponentName, string> = {
  relevance: 'Relevance',
  ethics: 'Ethics',
  env: 'Environment',
  proximity: 'Proximity',
};

const SIGNAL_LABELS: Record<SignalKind, string> = {
  labor: 'Labor',
  governance: 'Governance',
  environmental: 'Environmental',
};

const RANKING_HELP = 'about.html#ranking';

function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  props: { id?: string; className?: string; data?: Record<string, string> } = {},
  ...children: (Node | string)[]
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  if (props.id) node.id = props.id;
  if (props.className) node.className = props.className;
  for (const [key, value] of Object.entries(props.data ?? {})) node.dataset[key] = value;
  node.append(...children);
  return node;
}

function outbound(url: string, text: string, props: Parameters<typeof el>[1] = {}): HTMLAnchorElement {
  const a = el('a', props, text);
  if (/^https?:\/\//i.test(url)) {
    a.href = url;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
  }
  return a;
}

function internal(href: string, text: string, props: Parameters<typeof el>[1] = {}): HTMLAnchorElement {
  const a = el('a', props, text);
  a.setAttribute('href', href);
  return a;
}

function hostOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return 'source';
  }
}

export function formatDistance(km: number): string {
  const miles = km * 0.621371;
  return miles < 10 ? `${miles.toFixed(1)} mi` : `${Math.round(miles)} mi`;
}

const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

// The panel speaks in plain words; the weights and formula live on the ranking page.
// Only certifications and concerns link out: the baseline and distance lines point at
// that page, and the relevance line points at the shop's own page, already linked above.
const WHY_LABELS: Record<ComponentName, string> = {
  relevance: 'Sells it',
  ethics: 'Ethics',
  env: 'Environment',
  proximity: 'Distance',
};

const isRankingDoc = (url: string) => url.endsWith('about.html#ranking');

function sellsText(c: SearchResult['components'][number]): string {
  const judged = c.sources.some((s) => s.label.startsWith('Model judgment'));
  if (c.value >= 1) return judged ? "Likely (model's judgment)" : 'Product named in listing';
  if (c.value >= 0.5) return judged ? "Maybe (model's judgment)" : 'Category named in listing';
  return 'Not confirmed';
}

// A negative's source label is "<Kind>: <claim>"; the claim is already on the card.
function sourceLink(s: SourceRef): HTMLAnchorElement {
  const kind = Object.values(SIGNAL_LABELS).find((k) => s.label.startsWith(`${k}: `));
  return outbound(s.url, kind ? `${kind} concern` : s.label, { data: { componentSource: '' } });
}

function whyText(c: SearchResult['components'][number], result: SearchResult): (Node | string)[] {
  switch (c.name) {
    case 'relevance':
      return [sellsText(c)];
    case 'proximity':
      if (result.kind === 'online') return ['Online'];
      return [result.distance_km === null ? 'Unknown' : formatDistance(result.distance_km)];
    default: {
      const found = c.sources.filter((s) => !isRankingDoc(s.url));
      if (found.length === 0) return ['Nothing found'];
      return found.flatMap((s, i) => (i > 0 ? [', ', sourceLink(s)] : [sourceLink(s)]));
    }
  }
}

function componentRow(c: SearchResult['components'][number], result: SearchResult): HTMLLIElement {
  return el(
    'li',
    { data: { component: c.name } },
    el('span', { className: 'component-name' }, WHY_LABELS[c.name]),
    el('span', { className: 'component-text' }, ...whyText(c, result)),
  );
}

export function renderResult(result: SearchResult, config: RenderConfig): HTMLLIElement {
  const body = el(
    'div',
    { className: 'result-body' },
    outbound(result.retailer.url, result.retailer.name, { className: 'retailer', data: { retailer: '' } }),
  );
  if (result.matched_product) body.append(el('p', { className: 'matched' }, `Matched: ${result.matched_product}`));
  if (result.distance_km !== null) {
    const where = formatDistance(result.distance_km) + (result.address ? `, ${result.address}` : '');
    body.append(el('p', { className: 'distance' }, where));
  }

  if (result.certifications.length > 0) {
    body.append(
      el(
        'ul',
        { className: 'badges' },
        ...result.certifications.map((c) => el('li', {}, outbound(c.source_url, c.label, { className: 'badge' }))),
      ),
    );
  }

  // The claim is the source's own title; this code only labels its kind.
  for (const s of result.signals) {
    const kind = `${SIGNAL_LABELS[s.kind]}: `;
    const negative = s.polarity === 'negative';
    const source = outbound(s.source_url, `Source: ${hostOf(s.source_url)}`, negative ? { className: 'negative-source' } : {});
    if (negative) {
      const dispute = config.disputeUrl.startsWith('http')
        ? outbound(config.disputeUrl, 'Dispute this', { data: { dispute: '' } })
        : internal(config.disputeUrl, 'Dispute this', { data: { dispute: '' } });
      body.append(
        el(
          'div',
          { className: 'negative', data: { negative: '' } },
          el('p', {}, el('span', { className: 'signal-kind' }, kind), s.claim),
          el('p', {}, source, ' ', dispute),
        ),
      );
    } else {
      body.append(el('p', { className: 'signal' }, el('span', { className: 'signal-kind' }, kind), s.claim, ' ', source));
    }
  }

  const rows = result.components.map((c) => componentRow(c, result));
  body.append(
    el(
      'details',
      { className: 'why', data: { why: '' } },
      el('summary', {}, 'Why this rank'),
      el(
        'div',
        { className: 'why-panel' },
        el('p', { className: 'why-total' }, `Score ${result.score.toFixed(2)}`),
        el('ul', { className: 'components' }, ...rows),
        el('p', { className: 'why-help' }, internal(RANKING_HELP, 'How ranking works')),
      ),
    ),
  );

  return el('li', { className: 'result', data: { result: '' } }, el('span', { className: 'rank' }, String(result.rank)), body);
}

export function renderWeights(weights: SearchResponse['weights']): HTMLParagraphElement {
  const parts = (Object.keys(COMPONENT_LABELS) as ComponentName[]).map(
    (name) => `${COMPONENT_LABELS[name].toLowerCase()} ${weights[name].toFixed(2)}`,
  );
  return el(
    'p',
    { className: 'weights', data: { weights: '' } },
    `Ranked by ${parts.join(', ')}. `,
    internal(RANKING_HELP, 'How ranking works'),
  );
}

interface Farther { all: SearchResult[]; shown: SearchResult[]; nearMiles: number | undefined }

// Shops past the nearby radius, listed after the nearby ones inside the same section.
function fartherGroup(farther: Farther, config: RenderConfig): HTMLElement | null {
  if (farther.shown.length === 0) return null;
  const known = farther.shown.flatMap((r) => (r.distance_km === null ? [] : [r.distance_km]));
  const span = known.length ? `, ${formatDistance(Math.min(...known)).replace(' mi', '')} to ${formatDistance(Math.max(...known))} away` : '';
  return el(
    'div',
    { data: { farther: '' } },
    el('h3', {}, 'Farther away'),
    el('p', { className: 'section-note' }, plural(farther.shown.length, 'shop', 'shops') + span),
    el('ol', { className: 'results' }, ...farther.shown.map((r) => renderResult(r, config))),
  );
}

function section(
  key: 'near' | 'online',
  heading: string,
  all: SearchResult[],
  shown: SearchResult[],
  enabled: boolean,
  config: RenderConfig,
  farther?: Farther,
): HTMLElement {
  let note: string;
  if (all.length === 0 && farther?.all.length) {
    note = `No shops within ${farther.nearMiles ?? 10} mi matched. Farther shops are below.`;
  } else if (all.length === 0) {
    note = key === 'near' ? 'No shops nearby matched. Online results are below.' : 'No online retailers matched.';
  } else if (shown.length === 0) {
    note = 'Every result here is hidden by the filters.';
  } else if (key === 'near') {
    const known = shown.flatMap((r) => (r.distance_km === null ? [] : [r.distance_km]));
    note = plural(shown.length, 'shop', 'shops') + (known.length ? ` within ${formatDistance(Math.max(...known))}` : '');
  } else {
    note = plural(shown.length, 'online retailer', 'online retailers');
  }
  const id = `${key}-heading`;
  const node = el(
    'section',
    { data: { section: key } },
    el('h2', { id }, heading),
    el('p', { className: 'section-note' }, note),
    el('ol', { className: 'results' }, ...shown.map((r) => renderResult(r, config))),
    ...(farther ? [fartherGroup(farther, config)].filter((g): g is HTMLElement => g !== null) : []),
  );
  node.setAttribute('aria-labelledby', id);
  node.hidden = !enabled;
  return node;
}

// Renders the weights line and both sections into root; returns how many results are visible.
export function renderResults(
  response: SearchResponse,
  root: HTMLElement,
  config: RenderConfig,
  view: View = defaultView,
): number {
  const shownLocal = sortResults(filterResults(response.local, view), view.sort);
  const fartherAll = response.local_farther ?? [];
  const shownFarther = sortResults(filterResults(fartherAll, view), view.sort);
  const shownOnline = sortResults(filterResults(response.online, view), view.sort);
  const farther = { all: fartherAll, shown: shownFarther, nearMiles: response.query.near_radius_mi };
  root.replaceChildren(
    renderWeights(response.weights),
    section('near', 'Near you', response.local, shownLocal, view.near, config, farther),
    section('online', 'Online', response.online, shownOnline, view.online, config),
  );
  wirePopovers(root);
  return shownLocal.length + shownFarther.length + shownOnline.length;
}

function statusText(status: Status): string {
  switch (status.kind) {
    case 'idle':
      return '';
    case 'searching':
      return `Searching shops near ${status.city}, ${status.state} and online. This takes a few seconds.`;
    case 'done':
      return `Found ${plural(status.near, 'shop', 'shops')} near you and ${status.online} online.`;
    case 'no_results':
      return `Nothing matched for ${status.product}. Try a shorter or more general name.`;
    case 'filtered':
      return 'Every result is hidden by the filters. Clear a filter to see them again.';
    case 'failed':
      return "The search didn't complete. Wait a moment and try again.";
    case 'rate_limited':
      return 'Too many searches from this connection. Try again in about a minute.';
  }
}

export function renderStatus(target: HTMLElement, status: Status): void {
  target.textContent = statusText(status);
}

export function renderFooter(target: HTMLElement, usage: Usage): void {
  const cost = usage.estimated_cost_usd;
  target.textContent =
    `This search used ${plural(usage.brave_calls, 'web lookup', 'web lookups')} and ` +
    `${usage.llm_tokens.toLocaleString('en-US')} model tokens, about $${cost.toFixed(cost < 0.1 ? 3 : 2)}.`;
  target.hidden = false;
}
