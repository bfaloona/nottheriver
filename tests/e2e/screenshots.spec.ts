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

test('landing, results and about, desktop width', async ({ page }) => {
  await page.setViewportSize(DESKTOP);
  await page.goto('/');
  await expect(page.locator('[data-mission]')).toBeVisible();
  await page.screenshot({ path: `${OUT}/landing.png`, fullPage: true });

  await page.getByLabel('What are you looking for').fill('cast iron skillet');
  await page.getByLabel('Zip code').fill(ZIP);
  await page.getByRole('button', { name: 'Search' }).click();
  await expect(page.locator('[data-section=online] [data-result]').first()).toBeVisible();
  // The last block, so its open panel covers no other result.
  await page.locator('[data-why] summary').last().click();
  await page.screenshot({ path: `${OUT}/results.png`, fullPage: true });

  await page.goto('/about.html');
  await expect(page.locator('h1')).toBeVisible();
  await page.screenshot({ path: `${OUT}/about.png`, fullPage: true });
});
