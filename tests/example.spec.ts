import { test, expect } from '@playwright/test';

test.describe('Qualitara Test case', () => {
  test('Sample test', async ({ page }) => {
    await page.goto('');

    // Expect a title "to contain" a substring.
    await expect(page).toHaveTitle(/Playwright/);
  });
});
