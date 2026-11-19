import type { ComponentName, SearchResponse, SearchResult, Signal, SignalKind, SourceRef, Usage } from '../proxy/src/contract';
import { defaultView, filterResults, sortResults, type Filters, type View } from './controls';
import { IDEAS_DATA, type Idea, type IdeasData, type ShownIdea } from './ideas';
import { pinnedPanels, wirePopovers } from './popover';

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

// What a render left on screen. withinKm: the farthest nearby shop, or null unless every
// nearby shop's distance is known, so "within" is never said of a shop that might lie beyond it.
export interface Shown { near: number; withinKm: number | null; farther: number; online: number; total: number }

export type Status =
  | { kind: 'idle' }
  | { kind: 'searching'; city: string; state: string }
  | { kind: 'done'; shown: Shown; view: Filters }
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

// One set of plain words for the four score parts, used by each shop's facts line and its
// "Why this rank" panel; the weights and the formula live on the ranking page.
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

const SVG_NS = 'http://www.w3.org/2000/svg';

// An arrow leaving a box, the usual mark for a link to another site.
function visitIcon(): SVGSVGElement {
  const svg = document.createElementNS(SVG_NS, 'svg');
  const attributes = {
    viewBox: '0 0 16 16', width: '16', height: '16', fill: 'none', stroke: 'currentColor',
    'stroke-width': '1.75', 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'aria-hidden': 'true',
  };
  for (const [name, value] of Object.entries(attributes)) svg.setAttribute(name, value);
  for (const d of ['M9 2.5h4.5V7', 'M13.5 2.5 7.5 8.5', 'M11.5 9.5v3a1 1 0 0 1-1 1h-7a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1h3']) {
    const path = document.createElementNS(SVG_NS, 'path');
    path.setAttribute('d', d);
    svg.append(path);
  }
  return svg;
}

// The name is the button for the shop's rank panel (popover.ts), so the way to the shop is the
// icon beside it. A shop whose address is not http(s) gets no icon: a link with no href does nothing.
function resultHead(result: SearchResult, panelId: string): HTMLDivElement {
  const name = el('button', { className: 'retailer', data: { retailer: '' } }, result.retailer.name);
  name.type = 'button';
  // "Why this rank" is not on screen, so the label says what the button shows.
  name.setAttribute('aria-label', `${result.retailer.name}: why this rank`);
  name.setAttribute('aria-expanded', 'false');
  name.setAttribute('aria-controls', panelId);
  const head = el('div', { className: 'result-head' }, name);
  const visit = outbound(result.retailer.url, '', { className: 'visit', data: { visit: '' } });
  if (visit.hasAttribute('href')) {
    visit.setAttribute('aria-label', `Visit ${result.retailer.name}`);
    visit.append(visitIcon());
    head.append(visit);
  }
  return head;
}

export function renderResult(result: SearchResult, config: RenderConfig): HTMLLIElement {
  // Nearby and online ranks both start at 1, so the kind keeps them apart.
  const key = `${result.kind}-${result.rank}`;
  const panel = el(
    'div',
    { id: `why-${key}`, className: 'why-panel' },
    el('p', { className: 'why-total' }, `Score ${result.score.toFixed(2)}`),
    el('ul', { className: 'components' }, ...result.components.map((c) => componentRow(c, result))),
    el('p', { className: 'why-help' }, internal(RANKING_HELP, 'How ranking works')),
  );
  panel.hidden = true;
  const body = el(
    'div',
    { className: 'result-body' },
    // The panel follows the name directly: opened in place by a tap, it appears where the tap was.
    el('div', { className: 'why', data: { why: '' } }, resultHead(result, panel.id), panel),
    factsLine(result),
  );

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

  const item = el('li', { className: 'result', data: { result: key } }, el('span', { className: 'rank' }, String(result.rank)), body);
  // Nearby and farther shops share one numbering, so the rank names a map pin's list item uniquely.
  if (result.kind === 'local') item.id = shopId(result.rank);
  return item;
}

// One line of help below the lists. "What unknown means" is offered only while a shop on screen
// is unknown, and opens in place: a link to the About page would cost the visitor the results.
function resultsHelp(shown: SearchResult[], open: boolean): HTMLElement[] {
  const line = el('p', { className: 'results-help', data: { resultsHelp: '' } }, internal(RANKING_HELP, 'How ranking works'));
  if (shown.every(hasRecord)) return [line];
  const help = el(
    'p',
    { id: 'unknown-help', className: 'results-help-text', data: { unknownHelp: '' } },
    "Unknown means our lists hold no certification that counts toward a shop's score and this search found nothing about it: we have not looked further yet, or were blocked from looking.",
  );
  const button = el('button', { className: 'link-button', data: { unknownToggle: '' } }, 'What unknown means');
  button.type = 'button';
  button.setAttribute('aria-controls', help.id);
  const show = (visible: boolean) => {
    help.hidden = !visible;
    button.setAttribute('aria-expanded', String(visible));
  };
  show(open);
  button.addEventListener('click', () => show(help.hidden === true));
  line.append(button);
  return [line, help];
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
  let open = config.mapButton!.open;
  const show = () => {
    map.hidden = !open;
    button.textContent = open ? 'Hide map' : 'Show map';
  };
  show();
  button.addEventListener('click', () => {
    open = !open;
    show();
    config.mapButton!.onToggle(open);
    if (open) config.onMap!(map, pins);
    else config.onNoMap?.();
  });
  return button;
}

const mapLayout = (config: RenderConfig) => (config.mapButton ? 'button' : 'beside');

function clearMapFrom(near: HTMLElement): void {
  for (const old of [...near.children]) if (old.matches('[data-map], [data-map-toggle]')) old.remove();
  delete near.dataset.mapLayout;
}

// What the view leaves on screen, in the order shown: one rule for the lists, the map and the counts.
function shownLists(response: SearchResponse, view: View) {
  const shown = (list: SearchResult[]) => sortResults(filterResults(list, view), view.sort);
  return { local: shown(response.local), farther: shown(response.local_farther ?? []), online: shown(response.online) };
}

// For a map that failed to load or draw: its button goes with it, so no control is left that does nothing.
export function removeMap(container: HTMLElement): void {
  if (container.parentElement) clearMapFrom(container.parentElement);
}

// Puts the map, and on a narrow screen its button, last in the Near you section, in place of
// any already there; the stylesheet moves a map with no button beside the lists. The section
// must be in the page, because onMap draws into the container at once.
// kept: the container of the map these same results already had, in the same layout. Drawn
// into again, it keeps its map, so a sort or filter change does not load the map's images anew.
function placeMap(near: HTMLElement, pins: MapPin[], config: RenderConfig, kept?: HTMLElement | null): void {
  clearMapFrom(near);
  if (pins.length === 0 || !config.onMap) return config.onNoMap?.();

  const map = kept ?? el('div', { id: 'near-map', className: 'map', data: { map: '' } });
  map.setAttribute('role', 'region');
  map.setAttribute('aria-label', 'Map of the shops listed near you');
  const toggle = config.mapButton ? mapToggle(map, pins, config) : null;
  near.append(...(toggle ? [toggle] : []), map);
  near.dataset.mapLayout = mapLayout(config);
  if (map.hidden) config.onNoMap?.();
  else config.onMap(map, pins);
}

// Redraws only the map for results already on the page, so a change of screen width does not
// rebuild the lists and close what the visitor opened in them.
export function renderMap(response: SearchResponse, root: HTMLElement, config: RenderConfig, view: View = defaultView): void {
  const near = root.querySelector<HTMLElement>('[data-section="near"]');
  if (!near) return;
  const shown = shownLists(response, view);
  placeMap(near, view.near ? mapPins(shown.local, shown.farther) : [], config);
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
  // A section with shops on screen has no note: the count line above the lists carries the counts.
  let note: string | null = null;
  if (all.length === 0 && farther?.all.length) {
    note = `No shops within ${farther.nearMiles ?? 10} mi matched. Farther shops are below.`;
  } else if (all.length === 0) {
    note = key === 'near' ? 'No shops nearby matched. Online results are below.' : 'No online retailers matched.';
  } else if (shown.length === 0) {
    note = 'Every result here is hidden by the filters.';
  }
  const id = headingId(key);
  const node = el(
    'section',
    { data: { section: key } },
    el('h2', { id }, heading),
    ...(note ? [el('p', { className: 'section-note' }, note)] : []),
    el('ol', { className: 'results' }, ...shown.map((r) => renderResult(r, config))),
    ...(farther ? [fartherGroup(farther, config)].filter((g): g is HTMLElement => g !== null) : []),
  );
  node.setAttribute('aria-labelledby', id);
  node.hidden = !enabled;
  return node;
}

// The results each root last showed. Drawing the same ones again is a sort or filter change; a
// new search brings other shops, which only share rank numbers with the last one's.
const drawn = new WeakMap<HTMLElement, SearchResponse>();

// What a rebuild of the lists would undo for the visitor: the rank panels and lists of concerns
// they opened, the shop a map pin led them to (map.ts marks it), and the map they may have moved.
function kept(root: HTMLElement) {
  const shops = (selector: string) =>
    [...root.querySelectorAll(selector)].map((node) => node.closest<HTMLElement>('[data-result]')!.dataset.result!);
  const map = root.querySelector<HTMLElement>('[data-map]');
  return {
    panels: pinnedPanels(root),
    concerns: shops('[data-concerns][open]'),
    picked: shops('.result-picked'),
    map,
    mapLayout: map?.parentElement?.dataset.mapLayout,
  };
}

// Renders the help line and both sections into root; returns what is on screen.
export function renderResults(
  response: SearchResponse,
  root: HTMLElement,
  config: RenderConfig,
  view: View = defaultView,
): Shown {
  const shown = shownLists(response, view);
  const farther = { all: response.local_farther ?? [], shown: shown.farther, nearMiles: response.query.near_radius_mi };
  const near = section('near', 'Near you', response.local, shown.local, view.near, config, farther);
  // The lists are built anew every time. For the same results in another order or under
  // another filter, what the visitor opened in them is put back.
  const before = drawn.get(root) === response ? kept(root) : null;
  drawn.set(root, response);
  // The explanation of "unknown" reads the same for any search, so it stays open across them too.
  const helpOpen = root.querySelector<HTMLElement>('[data-unknown-help]')?.hidden === false;
  root.replaceChildren(
    near,
    section('online', 'Online', response.online, shown.online, view.online, config),
    ...resultsHelp([...shown.local, ...shown.farther, ...shown.online], helpOpen),
  );
  wirePopovers(root, before?.panels);
  for (const item of before ? root.querySelectorAll<HTMLElement>('[data-result]') : []) {
    const shop = item.dataset.result!;
    if (before!.picked.includes(shop)) item.classList.add('result-picked');
    const concerns = item.querySelector<HTMLDetailsElement>('[data-concerns]');
    if (concerns && before!.concerns.includes(shop)) concerns.open = true;
  }
  const sameLayout = before?.mapLayout === mapLayout(config);
  placeMap(near, view.near ? mapPins(shown.local, shown.farther) : [], config, sameLayout ? before!.map : null);
  const distances = shown.local.map((r) => r.distance_km);
  return {
    near: shown.local.length,
    withinKm: distances.length > 0 && distances.every((d): d is number => d !== null) ? Math.max(...distances) : null,
    farther: shown.farther.length,
    online: shown.online.length,
    total: shown.local.length + shown.farther.length + shown.online.length,
  };
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

// The one place the counts are written, so it follows the filters: a section with shops on
// screen carries no count of its own.
function foundParts(shown: Shown, view: Filters): (Node | string)[] {
  const parts: (Node | string)[] = [];
  if (view.near) {
    if (shown.near > 0) {
      const where = shown.withinKm === null ? 'near you' : `within ${formatDistance(shown.withinKm)}`;
      parts.push(`${plural(shown.near, 'shop', 'shops')} ${where}`);
      if (shown.farther > 0) parts.push(`${shown.farther} farther away`);
    } else {
      parts.push(shown.farther > 0 ? `${plural(shown.farther, 'shop', 'shops')} farther away` : 'no shops near you');
    }
  }
  // Linked because the nearby list, and its map on a narrow screen, can fill more than one screen above Online.
  // After a count of shops "8 online" reads on from it; alone it needs its noun.
  const online = parts.length > 0 ? `${shown.online} online` : plural(shown.online, 'online shop', 'online shops');
  if (view.online) parts.push(shown.online > 0 ? internal(`#${headingId('online')}`, online) : 'none online');
  return parts;
}

export function renderStatus(target: HTMLElement, status: Status): void {
  if (status.kind !== 'done') {
    target.textContent = statusText(status);
    return;
  }
  const { shown, view } = status;
  const parts = foundParts(shown, view);
  // "Found" would overstate a list the filters have cut down.
  const verb = view.near && view.online && !view.certifiedOnly ? 'Found' : 'Showing';
  target.replaceChildren(`${verb} `, ...parts.flatMap((part, i) => (i === 0 ? [part] : [i === parts.length - 1 ? ' and ' : ', ', part])), '.');
}

export function renderFooter(target: HTMLElement, usage: Usage): void {
  const cost = usage.estimated_cost_usd;
  target.textContent =
    `This search used ${plural(usage.brave_calls, 'web lookup', 'web lookups')} and ` +
    `${usage.llm_tokens.toLocaleString('en-US')} model tokens, about $${cost.toFixed(cost < 0.1 ? 3 : 2)}.`;
  target.hidden = false;
}

// How the site read the search: the model's generic name for the product and the category picked
// from the fixed list, so a shopper can see a wrong reading. Drawn once per search. A reply from a
// Worker that made no category call carries no pick, and then the line stays hidden.
export function renderLookedFor(target: HTMLElement, query: SearchResponse['query'] | null): void {
  const pick = query?.pick;
  target.hidden = !pick;
  if (!query || !pick) {
    target.textContent = '';
    return;
  }
  const names = [pick.general_name, pick.specific_name].filter(Boolean);
  target.textContent = `We looked for: ${query.canonical_name}${names.length ? ` (${names.join(', ')})` : ''}`;
}

const IDEA_LEAD: Record<Idea, string> = { borrow: 'Borrow it.', repair: 'Repair the one you have.', used: 'Buy it used.' };

// "Before you buy" (docs/plans/before-you-buy-v1.md, 2c): one collapsed line above the shops,
// closed on each new search. It is drawn once per search, outside the sections that sort and
// filter changes rebuild, and carries no rank, score or accent so it does not read as a shop.
export function renderIdeas(target: HTMLElement, ideas: ShownIdea[], data: IdeasData = IDEAS_DATA): void {
  target.replaceChildren();
  target.hidden = ideas.length === 0;
  if (target.hidden) return;
  const kinds = new Map(data.kinds.map((k) => [k.id, k]));
  const shown = ideas.flatMap((i) => {
    const kind = kinds.get(i.kind);
    return kind ? [{ idea: i.idea, kind }] : [];
  });
  const sources = el('ul', { id: 'idea-sources', className: 'idea-sources', data: { ideaSources: '' } },
    ...shown.map(({ kind }) => {
      const li = el('li', {}, `${kind.name}: the site owner's experience.`);
      if (kind.sources.length) {
        li.append(' See also ');
        kind.sources.forEach((s, n) => {
          if (n) li.append('; ');
          li.append(outbound(s.url, s.publisher));
        });
        li.append(`. Read ${kind.sources[0]!.checked}.`);
      }
      return li;
    }));
  const toggle = el('button', { className: 'link-button', data: { ideaSourcesToggle: '' } }, 'Sources');
  toggle.type = 'button';
  toggle.setAttribute('aria-controls', sources.id);
  const open = (visible: boolean) => {
    sources.hidden = !visible;
    toggle.setAttribute('aria-expanded', String(visible));
  };
  open(false);
  toggle.addEventListener('click', () => open(sources.hidden === true));
  target.append(el('details', { className: 'ideas' },
    el('summary', {}, `Before you buy: ${shown.map((s) => s.idea).join(', ')}`),
    el('p', { className: 'ideas-note' },
      'Ideas that may apply, picked by hand for this kind of product. In general: each sentence is about a kind of place. Whether one is near you, or has what you need, was not looked up.'),
    el('ul', { className: 'ideas-list' },
      ...shown.map(({ idea, kind }) => el('li', { data: { idea } }, `${IDEA_LEAD[idea]} ${kind.text}`))),
    el('p', { className: 'ideas-sources-line' }, toggle),
    sources));
}
