import { expect, test, type Page } from '@playwright/test';

// The results shown are fixture data whatever zip is typed; the zip only has to be valid.
const ZIP = '02138';
const DESKTOP = { width: 1280, height: 800 };
const PHONE = { width: 360, height: 640 };
const OUT = 'docs/evidence';

// As a phone answers the stylesheet's hover question, so the shots show what a phone shows:
// the open/closed mark after each shop's name.
test.describe('phone width', () => {
  test.use({ viewport: PHONE, hasTouch: true, isMobile: true });

  // The window is grown to the page's height for the shot. A full-page capture answers the
  // hover question as a desktop does while it runs, which takes the mark back out.
  async function shoot(page: Page, path: string): Promise<void> {
    expect(await page.evaluate(() => matchMedia('(hover: hover)').matches)).toBe(false);
    await page.setViewportSize({ width: PHONE.width, height: await page.evaluate(() => document.documentElement.scrollHeight) });
    await page.screenshot({ path });
  }

  test('landing, phone width', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('[data-mission]')).toBeVisible();
    await shoot(page, `${OUT}/landing-360.png`);
  });

  test('results, phone width', async ({ page }) => {
    // The map stays behind its button here, so no tile is asked for; none may reach the network if that changes.
    await page.route('https://tile.openstreetmap.org/**', (route) => route.abort());
    await page.goto('/');
    await page.getByLabel('What are you looking for').fill('cast iron skillet');
    await page.getByLabel('Zip code').fill(ZIP);
    await page.getByRole('button', { name: 'Search' }).click();
    await expect(page.locator('[data-section=online] [data-result]').first()).toBeVisible();
    await expect(page.getByRole('button', { name: 'Show map' })).toBeVisible();
    await shoot(page, `${OUT}/results-360.png`);
  });
});

test('landing, results and about, desktop width', async ({ page }) => {
  await page.setViewportSize(DESKTOP);
  await page.goto('/');
  await expect(page.locator('[data-mission]')).toBeVisible();
  await page.screenshot({ path: `${OUT}/landing.png`, fullPage: true });

  await page.getByLabel('What are you looking for').fill('cast iron skillet');
  await page.getByLabel('Zip code').fill(ZIP);
  await page.getByRole('button', { name: 'Search' }).click();
  await expect(page.locator('[data-section=online] [data-result]').first()).toBeVisible();
  // A curated fixture (tests/fixtures/negatives.json) gives Northfork Kitchen Supply two
  // findings, so opening its group here makes the grouped-concerns UI visible in the shot.
  // Before the press on a shop name: wirePopovers' outside-click handler closes any open
  // rank panel on a click elsewhere, and .concerns has no such handler to undo it.
  await page.locator('[data-concerns] summary').first().click();
  // The last shop, so its open panel covers no other result.
  await page.locator('[data-why] [data-retailer]').last().click();
  // Back to the top, so the map (which follows the scroll beside the nearby list) is shot where a visitor first sees it.
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: `${OUT}/results.png`, fullPage: true });

  await page.goto('/about.html');
  await expect(page.locator('h1')).toBeVisible();
  await page.screenshot({ path: `${OUT}/about.png`, fullPage: true });
});
