import { expect } from '@playwright/test';
import { test } from '../fixtures/fixture';

test.describe('Dynamic Loading test cases', () => {
  test('Check message after progress bar', async ({ dynamicLoadingPage }) => {
    // 1. Navigate to dynamic_loading/1
    await dynamicLoadingPage.goto();

    // 2. Assert initial state: Start button visible, Hello World heading hidden, loading indicator absent
    await expect(dynamicLoadingPage.startButton).toBeVisible();
    await expect(dynamicLoadingPage.helloWorldHeading).toBeHidden();
    await expect(dynamicLoadingPage.loadingIndicator).toBeHidden();

    // 3. Click the Start button
    await dynamicLoadingPage.startButton.click();

    // 4. Assert loading state: Start button hidden, loading indicator visible
    await expect(dynamicLoadingPage.startContainer).toBeHidden();
    await expect(dynamicLoadingPage.loadingIndicator).toBeVisible();

    // 5. Assert final state: Hello World heading visible, loading indicator hidden
    await expect(dynamicLoadingPage.helloWorldHeading).toBeVisible({ timeout: 15000 });
    await expect(dynamicLoadingPage.loadingIndicator).toBeHidden();
  });
});
