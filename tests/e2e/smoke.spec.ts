import { expect, test, type Locator, type Page } from '@playwright/test';
import { tsImport } from 'tsx/esm/api';

// Loaded through tsx because Playwright's ESM loader rejects the blocklist module's JSON import,
// which has no import attribute (the Worker bundler does not need one).
const { isBlockedDomain, isBlockedName, isBlockedUrl } = (await tsImport(
  '../../proxy/src/blocklist.ts',
  import.meta.url,
)) as typeof import('../../proxy/src/blocklist');

// Public test data required by the build prompt; assertions stay structural, so the place
// it resolves to is never checked or written down.
const ZIP = '98116';

// The mission sentence is the only copy allowed to name Amazon.
const BLOCKED_TEXT = /amazon|whole foods market|zappos|a\.co\b/i;

const PIXEL = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==', 'base64');

// Never fetch real tiles in a test; a 1x1 PNG stands in, and each request's Referer is kept.
async function stubTiles(page: Page): Promise<(string | undefined)[]> {
  const referers: (string | undefined)[] = [];
  await page.route('https://tile.openstreetmap.org/**', async (route) => {
    referers.push((await route.request().allHeaders()).referer);
    await route.fulfill({ contentType: 'image/png', body: PIXEL });
  });
  return referers;
}

const box = async (locator: Locator) => (await locator.boundingBox())!;
const pageScrollsSideways = (page: Page) => page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);

test('a search renders ranked, explained, Amazon-free results under the CSP', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  page.on('pageerror', (err) => errors.push(err.message));

  const tileReferers = await stubTiles(page);

  await page.goto('/');
  await expect(page.locator('meta[name=referrer][content=no-referrer]')).toHaveCount(1);
  await expect(page.locator('meta[http-equiv=Content-Security-Policy]')).toHaveAttribute('content', /form-action 'none'/);
  await expect(page.locator('.mission-note')).toBeVisible();

  await page.getByLabel('What are you looking for').fill('cast iron skillet');
  await page.getByLabel('Zip code').fill(ZIP);
  const sent = page.waitForRequest((r) => r.url().endsWith('/search') && r.method() === 'POST');
  await page.getByRole('button', { name: 'Search' }).click();

  // The browser is the only place the referrer meta and fetch referrerPolicy run together.
  const request = await sent;
  const payload = request.postData() ?? '';
  expect(Object.keys(JSON.parse(payload)).sort()).toEqual(['city', 'lat', 'lon', 'product', 'ruca', 'state']);
  expect(payload).not.toContain(ZIP);
  // allHeaders, because headers() omits some the network layer adds, Referer among them.
  expect((await request.allHeaders()).referer).toBeUndefined();

  await expect(page.locator('[data-section=near] [data-result]').first()).toBeVisible();
  await expect(page.locator('[data-section=online] [data-result]').first()).toBeVisible();
  await expect(page.locator('[data-results-help]')).toBeVisible();

  // Once a search starts the headline is clipped to a pixel, so the results get its room.
  expect((await box(page.locator('[data-mission]'))).height).toBeLessThanOrEqual(1);
  // The line under the headline goes with it.
  await expect(page.locator('.mission-note')).toBeHidden();
  // The found count leads to the Online section.
  await expect(page.locator('[data-found] a')).toHaveAttribute('href', '#online-heading');
  // The count sits at the top of the results: under the sort and filter row, above the lists.
  // The line under the search box, emptied, takes no room.
  const controlsBox = await box(page.locator('.controls'));
  const foundBox = await box(page.locator('[data-found]'));
  expect(foundBox.y).toBeGreaterThanOrEqual(controlsBox.y + controlsBox.height - 1);
  expect(foundBox.y + foundBox.height).toBeLessThanOrEqual((await box(page.locator('[data-section=near] h2'))).y + 1);
  expect(await page.locator('[data-status]').evaluate((el) => el.getBoundingClientRect().height)).toBe(0);

  // At this width the map sits beside the nearby list, level with its heading, and nothing runs off the screen.
  const mapBox = await box(page.locator('[data-map]'));
  const listBox = await box(page.locator('[data-section=near] .results').first());
  expect(mapBox.x).toBeGreaterThanOrEqual(listBox.x + listBox.width);
  expect(Math.abs(mapBox.y - (await box(page.locator('#near-heading'))).y)).toBeLessThanOrEqual(2);
  expect(await pageScrollsSideways(page)).toBe(false);

  // One pin per shop listed near you (the mock places every shop), under the CSP, with attribution.
  const map = page.locator('[data-section=near] [data-map]');
  await expect(map.locator('.map-pin')).toHaveCount(await page.locator('[data-section=near] [data-result]').count());
  await expect(map.locator('.leaflet-control-attribution')).toContainText('OpenStreetMap contributors');
  await expect.poll(() => tileReferers.length).toBeGreaterThan(0);
  // A pin click leads to its shop in the list.
  const pin = map.locator('.map-pin').last();
  const rank = (await pin.textContent())!.trim();
  await pin.click();
  await expect(page.locator(`#shop-${rank}`)).toHaveClass(/result-picked/);
  await expect(page.locator(`#shop-${rank} [data-retailer]`)).toBeFocused();
  // Focus alone must not open the shop's rank panel over the list.
  await expect(page.locator(`#shop-${rank} .why-panel`)).toBeHidden();
  // OpenStreetMap requires a Referer; the tiles send the site's origin only, never a path.
  expect(new Set(tileReferers)).toEqual(new Set([new URL(page.url()).origin + '/']));
  await expect(page.locator('[data-cost]')).toBeVisible();

  // The zip must never reach the address bar, where it would leak via history or a Referer.
  const address = await page.evaluate(() => ({ search: window.location.search, hash: window.location.hash }));
  expect(address.search).toBe('');
  expect(address.hash).not.toContain(ZIP);

  const mainText = await page.locator('main').evaluate((main) => {
    const copy = main.cloneNode(true) as HTMLElement;
    copy.querySelectorAll('[data-mission]').forEach((el) => el.remove());
    return copy.textContent ?? '';
  });
  expect(mainText).not.toMatch(BLOCKED_TEXT);

  // a.href, not the attribute, so relative links resolve the way the browser follows them.
  const hrefs = await page
    .locator('[data-result] a[href], [data-results-help] a[href]')
    .evaluateAll((links) => links.map((a) => (a as HTMLAnchorElement).href));
  expect(hrefs.length).toBeGreaterThan(0);
  expect(isBlockedUrl('https://www.amazon.com/dp/B0'), 'blocklist positive control').toBe(true);
  expect(hrefs.filter((href) => isBlockedDomain(href) || isBlockedUrl(href))).toEqual([]);

  // The regex above covers the obvious names; this uses the same name list the Worker does.
  const retailers = await page.locator('[data-retailer]').allTextContents();
  expect(retailers.length).toBeGreaterThan(0);
  expect(retailers.filter((name) => isBlockedName(name))).toEqual([]);

  // A curated fixture (tests/fixtures/negatives.json) attaches two findings to Northfork
  // Kitchen Supply, so the grouped concerns UI has something real to render end to end.
  // The domain can appear more than once (online, and as more than one local branch);
  // every row for that domain gets the same two curated findings.
  const northfork = page.locator('[data-result]').filter({ has: page.locator('[data-retailer]', { hasText: 'Northfork Kitchen Supply' }) }).first();
  await expect(northfork).toBeVisible();
  const concerns = northfork.locator('[data-concerns]');
  await expect(concerns.locator('summary')).toHaveText('2 concerns, 2021 to 2023');
  await expect(concerns.locator('[data-negative]')).toHaveCount(2);
  await expect(concerns.locator('[data-action-date]')).toHaveText(['Nov 2, 2023', 'May 14, 2021']); // newest first

  // A curated fixture (tests/fixtures/chains.json) badges Granite Outfitters as a chain; it
  // carries no certification, so this also proves the badge shows without one.
  const granite = page.locator('[data-result]').filter({ has: page.locator('[data-retailer]', { hasText: 'Granite Outfitters' }) }).first();
  await expect(granite).toBeVisible();
  const chainBadge = granite.locator('.badge-neutral');
  await expect(chainBadge).toHaveText(/^Chain, \d+ stores$/);
  await expect(chainBadge).toHaveAttribute('href', /granite-outfitters\.example\/about$/);

  const results = page.locator('[data-result]');
  const count = await results.count();
  for (let i = 0; i < count; i++) {
    const why = results.nth(i).locator('[data-why]');
    await expect(why.locator('[data-retailer]')).toHaveAttribute('aria-label', /: why this rank$/);
    await expect(why.locator('[data-visit]'), `result ${i} links to its shop`).toHaveAttribute('href', /^https?:/);
    await expect(why.locator('[data-component]'), `result ${i} explains its rank in four rows`).toHaveCount(4);
    for (const text of await why.locator('.component-text').allTextContents()) {
      expect(text.trim(), `result ${i} has no blank row`).not.toBe('');
    }
  }

  // The keyboard path to a rank panel: Tab to the shop's name, which stays closed on focus, then Enter.
  const first = page.locator('[data-why]').first();
  const name = first.locator('[data-retailer]');
  const panel = first.locator('.why-panel');
  await page.getByLabel('Zip code').focus();
  for (let i = 0; i < 50 && !(await name.evaluate((s) => s === document.activeElement)); i++) {
    await page.keyboard.press('Tab');
  }
  await expect(name, 'Tab reaches the first shop name').toBeFocused();
  await expect(panel).toBeHidden();
  await page.keyboard.press('Enter');
  await expect(panel).toBeVisible();
  await expect(name).toHaveAttribute('aria-expanded', 'true');
  await page.keyboard.press('Escape');
  await expect(panel).toBeHidden();
  await expect(name).toBeFocused();

  // The pointer path: resting on the name opens the panel, and the pointer can then cross into
  // it. Moved in steps, because a gap between the name and the panel would close it on the way.
  // The help link is the last line of the panel. With the name at the top of the window, the
  // whole panel is inside the window in any font, so the pointer never has to leave the page.
  await name.evaluate((el) => el.scrollIntoView({ block: 'start' }));
  await name.hover();
  await expect(panel).toBeVisible();
  const link = (await panel.locator('.why-help a').boundingBox())!;
  await page.mouse.move(link.x + link.width / 2, link.y + link.height / 2, { steps: 30 });
  await expect(panel).toBeVisible();
  await page.mouse.move(0, 0);
  await expect(panel).toBeHidden();

  // The link to the shop opens nothing, and closes a panel the name opened.
  const visit = first.locator('[data-visit]');
  await visit.hover();
  await page.waitForTimeout(600); // longer than the rest on the name takes to open it
  await expect(panel).toBeHidden();
  await name.hover();
  await expect(panel).toBeVisible();
  await visit.hover();
  await expect(panel).toBeHidden();
  // With a pointer the name opens on rest, so it does not show the hand of something to click.
  expect(await name.evaluate((el) => getComputedStyle(el).cursor)).toBe('default');
  // The open/closed mark after the name is for touch screens, where nothing opens on rest.
  expect(await name.evaluate((el) => getComputedStyle(el, '::after').content)).toBe('none');
  await page.mouse.move(0, 0);

  expect(errors).toEqual([]);
});

test('a sort change rebuilds the lists and keeps the map, asking for no image again', async ({ page }) => {
  const tileReferers = await stubTiles(page);
  await page.goto('/');
  await page.getByLabel('What are you looking for').fill('cast iron skillet');
  await page.getByLabel('Zip code').fill(ZIP);
  await page.getByRole('button', { name: 'Search' }).click();
  const map = page.locator('[data-map]');
  await expect(map.locator('.map-pin')).toHaveCount(await page.locator('[data-section=near] [data-result]').count());
  await expect.poll(() => tileReferers.length).toBeGreaterThan(0);
  await page.waitForLoadState('networkidle');
  const tiles = tileReferers.length;
  // Marks that only the same nodes can still carry after the change.
  await page.evaluate(() => {
    for (const selector of ['[data-result]', '[data-map] .leaflet-tile', '[data-map] .map-pin']) {
      (document.querySelector(selector) as HTMLElement & { seen?: boolean }).seen = true;
    }
  });
  const seen = (selector: string) => page.evaluate((s) => (document.querySelector(s) as (HTMLElement & { seen?: boolean }) | null)?.seen === true, selector);

  await page.getByLabel('Sort by').selectOption('name');
  expect(await seen('[data-result]'), 'the lists are rebuilt').toBe(false);
  expect(await seen('[data-map] .leaflet-tile'), 'the map image is the one already loaded').toBe(true);
  expect(await seen('[data-map] .map-pin'), 'the pins are the ones already drawn').toBe(true);
  await page.waitForTimeout(500);
  expect(tileReferers.length).toBe(tiles);
});

test.describe('on a touch screen', () => {
  test.use({ viewport: { width: 360, height: 640 }, hasTouch: true, isMobile: true });

  test('the shop name carries a mark for its panel, which stays open through a sort change', async ({ page }) => {
    await page.route('https://tile.openstreetmap.org/**', (route) => route.abort());
    await page.goto('/');
    // The test only means something where the panel opens in place.
    expect(await page.evaluate(() => matchMedia('(hover: hover) and (pointer: fine)').matches)).toBe(false);
    await page.getByLabel('What are you looking for').fill('cast iron skillet');
    await page.getByLabel('Zip code').fill(ZIP);
    await page.getByRole('button', { name: 'Search' }).tap();
    const first = page.locator('[data-result]').first();
    const name = first.locator('[data-retailer]');
    await expect(name).toBeVisible();

    // A triangle drawn with borders: the top one when closed (pointing down), the bottom one when open.
    const mark = () =>
      name.evaluate((el) => {
        const style = getComputedStyle(el, '::after');
        return { drawn: style.content !== 'none', down: parseFloat(style.borderTopWidth) > 0, up: parseFloat(style.borderBottomWidth) > 0 };
      });
    expect(await mark()).toEqual({ drawn: true, down: true, up: false });
    await name.tap();
    await expect(first.locator('.why-panel')).toBeVisible();
    expect(await mark()).toEqual({ drawn: true, down: false, up: true });

    // The mark never takes a line of its own: no name is taller with it than without.
    const heights = () => page.locator('[data-retailer]').evaluateAll((names) => names.map((n) => n.getBoundingClientRect().height));
    const withMark = await heights();
    await page.evaluate(() => {
      // Through the stylesheet's own object: the page's CSP allows no injected style element.
      const sheet = [...document.styleSheets].find((s) => s.href?.startsWith(location.origin))!;
      sheet.insertRule('.retailer::after { display: none !important; }', sheet.cssRules.length);
    });
    expect(await heights()).toEqual(withMark);

    const shop = await name.textContent();
    await page.getByLabel('Sort by').selectOption('name');
    const open = page.locator('[data-why]').filter({ has: page.locator('.why-panel:visible') });
    await expect(open).toHaveCount(1);
    await expect(open.locator('[data-retailer]')).toHaveText(shop!);
    expect(await pageScrollsSideways(page)).toBe(false);
  });
});

test('on a phone the map, and its request to OpenStreetMap, waits for "Show map"', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const tileReferers = await stubTiles(page);
  const outside: string[] = [];
  page.on('request', (r) => {
    if (new URL(r.url()).hostname !== 'localhost') outside.push(r.url());
  });

  await page.goto('/');
  await page.getByLabel('What are you looking for').fill('cast iron skillet');
  await page.getByLabel('Zip code').fill(ZIP);
  await page.getByRole('button', { name: 'Search' }).click();
  const shops = page.locator('[data-section=near] [data-result]');
  await expect(shops.first()).toBeVisible();
  await expect(page.locator('[data-section=online] [data-result]').first()).toBeVisible();

  const button = page.getByRole('button', { name: 'Show map' });
  await expect(button).toBeVisible();
  await expect(page.locator('[data-map]')).toBeHidden();
  // Long enough for a map that loaded by itself to have asked for its first tiles.
  await page.waitForTimeout(1000);
  expect(tileReferers).toEqual([]);
  expect(outside).toEqual([]);

  await button.click();
  const map = page.locator('[data-map]');
  await expect(map.locator('.map-pin')).toHaveCount(await shops.count());
  await expect.poll(() => tileReferers.length).toBeGreaterThan(0);
  await expect(page.getByRole('button', { name: 'Hide map' })).toBeVisible();
  // Below the nearby list, inside the screen's width.
  const lastShop = await box(shops.last());
  expect((await box(map)).y).toBeGreaterThanOrEqual(lastShop.y + lastShop.height);
  expect(await pageScrollsSideways(page)).toBe(false);

  await page.getByRole('button', { name: 'Hide map' }).click();
  await expect(map).toBeHidden();
});

test('at the narrowest width that puts the map beside the list, it fits and follows the scroll', async ({ page }) => {
  // 64rem at the default text size; the map column is at its narrowest here.
  await page.setViewportSize({ width: 1024, height: 768 });
  await stubTiles(page);
  await page.goto('/');
  await page.getByLabel('What are you looking for').fill('cast iron skillet');
  await page.getByLabel('Zip code').fill(ZIP);
  await page.getByRole('button', { name: 'Search' }).click();
  const shops = page.locator('[data-section=near] [data-result]');
  await expect(shops.first()).toBeVisible();

  const map = page.locator('[data-map]');
  await expect(map.locator('.map-pin')).toHaveCount(await shops.count());
  await expect(page.getByRole('button', { name: 'Show map' })).toHaveCount(0);
  const list = await box(page.locator('[data-section=near] .results').first());
  const beside = await box(map);
  expect(beside.x).toBeGreaterThanOrEqual(list.x + list.width);
  expect(beside.x + beside.width).toBeLessThanOrEqual(1024);
  expect(await pageScrollsSideways(page)).toBe(false);

  // Scrolled to the second shop, the map has stopped just under the top of the screen, not scrolled away.
  await shops.nth(1).evaluate((shop) => window.scrollTo(0, shop.getBoundingClientRect().top + window.scrollY));
  const stuck = await box(map);
  expect(stuck.y).toBeGreaterThanOrEqual(0);
  expect(stuck.y).toBeLessThanOrEqual(32);
});
