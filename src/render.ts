import type { ComponentName, SearchResponse, SearchResult, Signal, SignalKind, SourceRef, Usage } from '../proxy/src/contract';
import { defaultView, filterResults, sortResults, type View } from './controls';
import { wirePopovers } from './popover';

// Everything in a SearchResponse is untrusted text from the web: nodes are built
// with textContent only, and a URL becomes an href only when it is http(s).

// target: the id of the pin's list item, where a pin click takes the reader.
export interface MapPin { rank: number; name: string; lat: number; lon: number; farther: boolean; target: string }

// onMap draws the map into the container, which is already in the page; kept out of this
// module so rendering stays testable without a map library and the library can load on
// demand. onNoMap runs when a render shows no map, so an earlier map can be released.
//
// mapButton is set on a screen too narrow for the map to sit beside the list. The map then
// waits behind a "Show map" button, so nothing is asked of the map's tile server until the
// visitor presses it. open carries the button's state across renders; onToggle reports a press.
export interface RenderConfig {
  disputeUrl: string;
  onMap?: (container: HTMLElement, pins: MapPin[]) => void;
  onNoMap?: () => void;
  mapButton?: { open: boolean; onToggle: (open: boolean) => void };
}

export type Status =
  | { kind: 'idle' }
  | { kind: 'searching'; city: string; state: string }
  // onlineShown: the Online section has a shop on screen, so the count can link to it.
  | { kind: 'done'; near: number; online: number; onlineShown: boolean }
  | { kind: 'no_results'; product: string }
  | { kind: 'filtered' }
  | { kind: 'failed' }
  | { kind: 'rate_limited' };

const SIGNAL_LABELS: Record<SignalKind, string> = {
  labor: 'Labor',
  governance: 'Governance',
  environmental: 'Environmental',
};

const RANKING_HELP = 'about.html#ranking';

type Component = SearchResult['components'][number];

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

// One set of plain words for the four score parts, used by the weights line, each shop's
// facts line and the "Why this rank" panel; the formula lives on the ranking page.
// In the panel only certifications and concerns link out: the baseline and distance lines point
// at that page, and the "Sells it" line points at the shop's own page, already linked above.
const WHY_LABELS: Record<ComponentName, string> = {
  relevance: 'Sells it',
  ethics: 'Ethics',
  env: 'Environment',
  proximity: 'Distance',
};

const isRankingDoc = (url: string) => url.endsWith('about.html#ranking');

function sellsText(c: Component): string {
  const judged = c.sources.some((s) => s.label.startsWith('Model judgment'));
  if (c.value >= 1) return judged ? 'Likely, by shop type' : 'Product named in listing';
  if (c.value >= 0.5) return judged ? 'Maybe, by shop type' : 'Category named in listing';
  return 'Not confirmed';
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// Avoids the Date object so a YYYY-MM-DD string never shifts a day across a local timezone.
// A malformed date (data drift, not expected from the schema) shows as-is rather than "undefined".
function actionDateText(iso: string): string {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return iso;
  const [y, m, d] = iso.split('-');
  return `${MONTHS[Number(m) - 1]} ${Number(d)}, ${y}`;
}

function disputeLink(config: RenderConfig): HTMLAnchorElement {
  return config.disputeUrl.startsWith('http')
    ? outbound(config.disputeUrl, 'Dispute this', { data: { dispute: '' } })
    : internal(config.disputeUrl, 'Dispute this', { data: { dispute: '' } });
}

// One finding: kind, the source's own title (never model prose), its action date, the
// source link and a dispute link. Grouping (concernsGroup) wraps several of these.
function concernBox(s: Signal, config: RenderConfig): HTMLDivElement {
  const kind = `${SIGNAL_LABELS[s.kind]}: `;
  const source = outbound(s.source_url, `Source: ${hostOf(s.source_url)}`, { className: 'negative-source' });
  return el(
    'div',
    { className: 'negative', data: { negative: '' } },
    el('p', {}, el('span', { className: 'signal-kind' }, kind), s.claim),
    ...(s.action_date ? [el('p', { data: { actionDate: '' } }, actionDateText(s.action_date))] : []),
    el('p', {}, source, ' ', disputeLink(config)),
  );
}

// Newest first, undated (model-origin) findings last, so the list order matches the summary's range.
function byNewestFirst(a: Signal, b: Signal): number {
  if (a.action_date && b.action_date) return b.action_date.localeCompare(a.action_date);
  return a.action_date ? -1 : b.action_date ? 1 : 0;
}

// Several concerns collapse to one line ("3 concerns, 2019 to 2025") that expands to the
// list, so a well-documented shop doesn't show a wall of warning boxes by default.
function concernsGroup(signals: Signal[], config: RenderConfig): HTMLDetailsElement {
  // YYYY strings sort correctly as plain strings.
  const years = signals.flatMap((s) => (s.action_date ? [s.action_date.slice(0, 4)] : [])).sort();
  const [min, max] = [years[0], years.at(-1)];
  const range = min === undefined ? '' : min === max ? `, ${min}` : `, ${min} to ${max}`;
  return el(
    'details',
    { className: 'concerns', data: { concerns: '' } },
    el('summary', {}, `${plural(signals.length, 'concern', 'concerns')}${range}`),
    ...[...signals].sort(byNewestFirst).map((s) => concernBox(s, config)),
  );
}

// A negative's source label is "<Kind>: <claim>"; the claim is already on the card.
function sourceLink(s: SourceRef): HTMLAnchorElement {
  const kind = Object.values(SIGNAL_LABELS).find((k) => s.label.startsWith(`${k}: `));
  return outbound(s.url, kind ? `${kind} concern` : s.label, { data: { componentSource: '' } });
}

const foundSources = (c: Component) => c.sources.filter((s) => !isRankingDoc(s.url));

// "Unknown", not "nothing found": holding no certification or finding says the shop has
// not been looked into far, or that looking was blocked, and nothing about how it behaves.
// The test is the panel's own (a source behind the ethics or environment score), so the row
// and the panel cannot disagree. A chain badge or a membership badge that never scores is
// not a record.
const hasRecord = (result: SearchResult) =>
  result.signals.length > 0 || result.components.some((c) => (c.name === 'ethics' || c.name === 'env') && foundSources(c).length > 0);

function whyText(c: Component, result: SearchResult): (Node | string)[] {
  switch (c.name) {
    case 'relevance':
      return [sellsText(c)];
    case 'proximity':
      if (result.kind === 'online') return ['Online'];
      return [result.distance_km === null ? 'Unknown' : formatDistance(result.distance_km)];
    default: {
      const found = foundSources(c);
      if (found.length === 0) return ['Unknown'];
      return found.flatMap((s, i) => (i > 0 ? [', ', sourceLink(s)] : [sourceLink(s)]));
    }
  }
}

function componentRow(c: Component, result: SearchResult): HTMLLIElement {
  return el(
    'li',
    { data: { component: c.name } },
    el('span', { className: 'component-name' }, WHY_LABELS[c.name]),
    el('span', { className: 'component-text' }, ...whyText(c, result)),
  );
}

// One line of what is known about a shop, sells-it reading first because every result has one.
// A shop with a record shows it in its badges and findings instead of in words here.
function factsLine(result: SearchResult): HTMLParagraphElement {
  const facts: HTMLElement[] = [];
  const relevance = result.components.find((c) => c.name === 'relevance');
  if (relevance) {
    const reading = sellsText(relevance);
    facts.push(el('span', { data: { sells: '' } }, `${WHY_LABELS.relevance}: ${reading.charAt(0).toLowerCase()}${reading.slice(1)}`));
  }
  if (result.distance_km !== null) {
    const where = formatDistance(result.distance_km) + (result.address ? `, ${result.address}` : '');
    facts.push(el('span', { className: 'distance' }, where));
  }
  if (!hasRecord(result)) facts.push(el('span', { data: { record: 'unknown' } }, 'People and planet: unknown'));
  return el('p', { className: 'facts', data: { facts: '' } }, ...facts.flatMap((fact, i) => (i > 0 ? [' · ', fact] : [fact])));
}

export function renderResult(result: SearchResult, config: RenderConfig): HTMLLIElement {
  const body = el(
    'div',
    { className: 'result-body' },
    outbound(result.retailer.url, result.retailer.name, { className: 'retailer', data: { retailer: '' } }),
  );
  body.append(factsLine(result));

  if (result.certifications.length > 0 || result.chain) {
    body.append(
      el(
        'ul',
        { className: 'badges' },
        ...result.certifications.map((c) => el('li', {}, outbound(c.source_url, c.label, { className: 'badge' }))),
        // Not a certification: a chain is a property of the domain (Chain, docs/ranking.md), so
        // it gets its own neutral style rather than the teal certification look.
        ...(result.chain ? [el('li', {}, outbound(result.chain.source_url, result.chain.label, { className: 'badge badge-neutral' }))] : []),
      ),
    );
  }

  // The claim is the source's own title; this code only labels its kind.
  for (const s of result.signals) {
    if (s.polarity === 'negative') continue;
    const kind = `${SIGNAL_LABELS[s.kind]}: `;
    const source = outbound(s.source_url, `Source: ${hostOf(s.source_url)}`);
    body.append(el('p', { className: 'signal' }, el('span', { className: 'signal-kind' }, kind), s.claim, ' ', source));
  }
  const negatives = result.signals.filter((s) => s.polarity === 'negative');
  if (negatives.length === 1) body.append(concernBox(negatives[0]!, config));
  else if (negatives.length > 1) body.append(concernsGroup(negatives, config));

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

  const item = el('li', { className: 'result', data: { result: '' } }, el('span', { className: 'rank' }, String(result.rank)), body);
  // Nearby and farther shops share one numbering, so the rank names a map pin's list item uniquely.
  if (result.kind === 'local') item.id = shopId(result.rank);
  return item;
}

export function renderWeights(weights: SearchResponse['weights']): HTMLParagraphElement {
  const parts = (Object.keys(WHY_LABELS) as ComponentName[]).map(
    (name) => `${WHY_LABELS[name].toLowerCase()} ${weights[name].toFixed(2)}`,
  );
  return el(
    'p',
    { className: 'weights', data: { weights: '' } },
    `Ranked by ${parts.join(', ')}. `,
    internal(RANKING_HELP, 'How ranking works'),
  );
}

// Says how much of the list rests on a record, so a page of "unknown" rows reads as a gap
// in what the site holds and not as a verdict on the shops.
// The explanation of "unknown" opens in place: a link to the About page would cost the visitor
// the results.
function renderRecordCount(shown: SearchResult[]): HTMLElement | null {
  if (shown.length === 0) return null;
  const withRecord = shown.filter(hasRecord).length;
  const count = `${withRecord} of ${shown.length} ${shown.length === 1 ? 'result has' : 'results have'} a people-and-planet record.`;
  const props = { className: 'record-count', data: { recordCount: '' } };
  if (withRecord === shown.length) return el('p', props, count);
  return el(
    'details',
    props,
    el('summary', {}, `${count} `, el('span', { className: 'summary-link' }, 'What unknown means')),
    el('p', {}, "Unknown means our lists hold no certification that counts toward a shop's score and this search found nothing about it: we have not looked further yet, or were blocked from looking."),
  );
}

const shopId = (rank: number) => `shop-${rank}`;

function mapPins(near: SearchResult[], farther: SearchResult[]): MapPin[] {
  const pin = (isFarther: boolean) => (r: SearchResult): MapPin[] =>
    // Number.isFinite also rejects a missing field, from a Worker deployed before shops carried coordinates.
    Number.isFinite(r.lat) && Number.isFinite(r.lon) ? [{ rank: r.rank, name: r.retailer.name, lat: r.lat!, lon: r.lon!, farther: isFarther, target: shopId(r.rank) }] : [];
  return [...near.flatMap(pin(false)), ...farther.flatMap(pin(true))];
}

// The container starts hidden unless the visitor already opened the map for this search.
function mapToggle(map: HTMLElement, pins: MapPin[], config: RenderConfig): HTMLButtonElement {
  const button = el('button', { className: 'button-secondary', data: { mapToggle: '' } });
  button.type = 'button';
  button.setAttribute('aria-controls', map.id);
  // The label carries the state; aria-expanded on top would be read as "Hide map, expanded".
  const set = (open: boolean) => {
    map.hidden = !open;
    button.textContent = open ? 'Hide map' : 'Show map';
  };
  set(config.mapButton!.open);
  button.addEventListener('click', () => {
    const open = map.hasAttribute('hidden');
    set(open);
    config.mapButton!.onToggle(open);
    if (open) config.onMap!(map, pins);
    else config.onNoMap?.();
  });
  return button;
}

function clearMapFrom(near: HTMLElement): void {
  for (const old of [...near.children]) if (old.matches('[data-map], [data-map-toggle]')) old.remove();
  delete near.dataset.mapLayout;
}

// For a map that failed to load or draw: its button goes with it, so no control is left that does nothing.
export function removeMap(container: HTMLElement): void {
  if (container.parentElement) clearMapFrom(container.parentElement);
}

// Puts the map, and on a narrow screen its button, last in the Near you section, in place of
// any already there; the stylesheet moves a map with no button beside the lists. The section
// must be in the page, because onMap draws into the container at once.
function placeMap(near: HTMLElement, pins: MapPin[], config: RenderConfig): void {
  clearMapFrom(near);
  if (pins.length === 0 || !config.onMap) return config.onNoMap?.();

  const map = el('div', { id: 'near-map', className: 'map', data: { map: '' } });
  map.setAttribute('role', 'region');
  map.setAttribute('aria-label', 'Map of the shops listed near you');
  const toggle = config.mapButton ? mapToggle(map, pins, config) : null;
  near.append(...(toggle ? [toggle] : []), map);
  near.dataset.mapLayout = toggle ? 'button' : 'beside';
  if (map.hidden) config.onNoMap?.();
  else config.onMap(map, pins);
}

// Redraws only the map for results already on the page, so a change of screen width does not
// rebuild the lists and close what the visitor opened in them.
export function renderMap(response: SearchResponse, root: HTMLElement, config: RenderConfig, view: View = defaultView): void {
  const near = root.querySelector<HTMLElement>('[data-section="near"]');
  if (!near) return;
  const shown = (list: SearchResult[]) => sortResults(filterResults(list, view), view.sort);
  placeMap(near, view.near ? mapPins(shown(response.local), shown(response.local_farther ?? [])) : [], config);
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

const headingId = (key: 'near' | 'online') => `${key}-heading`;

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
  const id = headingId(key);
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

// Renders the weights line, the record count and both sections into root; returns how many results are visible.
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
  const near = section('near', 'Near you', response.local, shownLocal, view.near, config, farther);
  const recordCount = renderRecordCount([...shownLocal, ...shownFarther, ...shownOnline]);
  // A sort or filter change rebuilds the page; an explanation the visitor opened stays open.
  if (recordCount instanceof HTMLDetailsElement) recordCount.open = root.querySelector<HTMLDetailsElement>('details[data-record-count]')?.open ?? false;
  root.replaceChildren(
    renderWeights(response.weights),
    ...(recordCount ? [recordCount] : []),
    near,
    section('online', 'Online', response.online, shownOnline, view.online, config),
  );
  wirePopovers(root);
  placeMap(near, view.near ? mapPins(shownLocal, shownFarther) : [], config);
  return shownLocal.length + shownFarther.length + shownOnline.length;
}

function statusText(status: Exclude<Status, { kind: 'done' }>): string {
  switch (status.kind) {
    case 'idle':
      return '';
    case 'searching':
      return `Searching shops near ${status.city}, ${status.state} and online. This takes a few seconds.`;
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
  if (status.kind !== 'done') {
    target.textContent = statusText(status);
    return;
  }
  // The nearby list, and its map on a narrow screen, can fill more than one screen above Online.
  const online = `${status.online} online`;
  const jump = status.onlineShown && status.online > 0;
  target.replaceChildren(`Found ${plural(status.near, 'shop', 'shops')} near you and `, jump ? internal(`#${headingId('online')}`, online) : online, '.');
}

export function renderFooter(target: HTMLElement, usage: Usage): void {
  const cost = usage.estimated_cost_usd;
  target.textContent =
    `This search used ${plural(usage.brave_calls, 'web lookup', 'web lookups')} and ` +
    `${usage.llm_tokens.toLocaleString('en-US')} model tokens, about $${cost.toFixed(cost < 0.1 ? 3 : 2)}.`;
  target.hidden = false;
}
