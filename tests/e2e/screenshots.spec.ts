import { expect, test } from '@playwright/test';

// The results shown are fixture data whatever zip is typed; the zip only has to be valid.
const ZIP = '02138';
const DESKTOP = { width: 1280, height: 800 };
const PHONE = { width: 360, height: 640 };
const OUT = 'docs/evidence';

test('landing, phone width', async ({ page }) => {
  await page.setViewportSize(PHONE);
  await page.goto('/');
  await expect(page.locator('[data-mission]')).toBeVisible();
  await page.screenshot({ path: `${OUT}/landing-360.png`, fullPage: true });
});

test('results, phone width', async ({ page }) => {
  await page.setViewportSize(PHONE);
  // The map stays behind its button here, so no tile is asked for; none may reach the network if that changes.
  await page.route('https://tile.openstreetmap.org/**', (route) => route.abort());
  await page.goto('/');
  await page.getByLabel('What are you looking for').fill('cast iron skillet');
  await page.getByLabel('Zip code').fill(ZIP);
  await page.getByRole('button', { name: 'Search' }).click();
  await expect(page.locator('[data-section=online] [data-result]').first()).toBeVisible();
  await expect(page.getByRole('button', { name: 'Show map' })).toBeVisible();
  await page.screenshot({ path: `${OUT}/results-360.png`, fullPage: true });
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
