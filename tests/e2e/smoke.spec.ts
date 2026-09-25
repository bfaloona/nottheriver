import { expect, test } from '@playwright/test';
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

test('a search renders ranked, explained, Amazon-free results under the CSP', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  page.on('pageerror', (err) => errors.push(err.message));

  await page.goto('/');
  await expect(page.locator('meta[name=referrer][content=no-referrer]')).toHaveCount(1);
  await expect(page.locator('meta[http-equiv=Content-Security-Policy]')).toHaveAttribute('content', /form-action 'none'/);

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
  await expect(page.locator('[data-weights]')).toBeVisible();
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
    .locator('[data-result] a[href], [data-weights] a[href]')
    .evaluateAll((links) => links.map((a) => (a as HTMLAnchorElement).href));
  expect(hrefs.length).toBeGreaterThan(0);
  expect(isBlockedUrl('https://www.amazon.com/dp/B0'), 'blocklist positive control').toBe(true);
  expect(hrefs.filter((href) => isBlockedDomain(href) || isBlockedUrl(href))).toEqual([]);

  // The regex above covers the obvious names; this uses the same name list the Worker does.
  const retailers = await page.locator('[data-retailer]').allTextContents();
  expect(retailers.length).toBeGreaterThan(0);
  expect(retailers.filter((name) => isBlockedName(name))).toEqual([]);

  const results = page.locator('[data-result]');
  const count = await results.count();
  for (let i = 0; i < count; i++) {
    const why = results.nth(i).locator('[data-why]');
    await expect(why.locator('summary')).toHaveText('Why this rank');
    await expect(why.locator('[data-component]'), `result ${i} explains its rank in four rows`).toHaveCount(4);
    for (const text of await why.locator('.component-text').allTextContents()) {
      expect(text.trim(), `result ${i} has no blank row`).not.toBe('');
    }
  }

  // Where a fine pointer exists, focus alone opens the block, so "open" cannot tell whether
  // Enter worked; only the summary's click handler, which Enter triggers, pins it.
  const first = page.locator('[data-why]').first();
  const summary = first.locator('summary');
  await expect(first).not.toHaveAttribute('open');
  await page.getByLabel('Zip code').focus();
  for (let i = 0; i < 50 && !(await summary.evaluate((s) => s === document.activeElement)); i++) {
    await page.keyboard.press('Tab');
  }
  await expect(summary, 'Tab reaches the first "Why this rank"').toBeFocused();
  await page.keyboard.press('Enter');
  await expect(first).toHaveAttribute('open', '');
  await expect(first).toHaveAttribute('data-pinned', '1');

  expect(errors).toEqual([]);
});
