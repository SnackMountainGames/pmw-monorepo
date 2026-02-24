import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('/');

  const h1s = await page.$$('h1');
  expect(h1s).toHaveLength(2);

  // Expect h1 to contain a substring.
  expect(await page.locator('h1').nth(1).innerText()).toContain('Welcome');
});
