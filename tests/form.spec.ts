// seed: tests/seed.spec.ts

import { expect } from '@playwright/test';
import { test } from '../fixtures/fixture';
import { checkboxesStatus } from '../constants/checkboxes';

test.describe('Checkboxes test cases', () => {
  test('Initial page state', async ({ checkboxesPage }) => {
    // 1. Check the amount of checkboxes initially displayed matches the expected based on constants length
    await expect(checkboxesPage.checkboxes).toHaveCount(Object.keys(checkboxesStatus).length);

    // 2. Verify the form text contains every label and they appear in the same order as in the constants
    const formText = await checkboxesPage.getContainerTextContent();
    let cursor = 0;
    for (const label of Object.keys(checkboxesStatus)) {
      const position = formText.indexOf(label, cursor);
      expect(
        position,
        `Expected label "${label}" to appear in form text after position ${cursor}`,
      ).toBeGreaterThanOrEqual(0);
      cursor = position + label.length;
    }

    // 3. Check the initial status of each checkbox matches the expected, located by index
    const expectedStates = Object.values(checkboxesStatus);
    for (let i = 0; i < expectedStates.length; i++) {
      expect.soft(await checkboxesPage.isCheckboxAtChecked(i)).toBe(expectedStates[i]);
    }
  });

  const checkCases = [
    { action: 'Check', desiredState: true },
    { action: 'Uncheck', desiredState: false },
  ];

  for (const { action, desiredState } of checkCases) {
    test(`${action} a checkbox`, async ({ checkboxesPage }) => {
      // 1. Identify the checkbox to toggle based on the desired state
      const targetIndex = Object.values(checkboxesStatus).indexOf(!desiredState);

      // 2. Toggle that checkbox to the desired state
      await checkboxesPage.setCheckboxAtTo(targetIndex, desiredState);

      // 3. Verify the checkbox is now in the desired state
      await expect(await checkboxesPage.getCheckboxByIndex(targetIndex)).toBeChecked({
        checked: desiredState,
      });
    });
  }
});
