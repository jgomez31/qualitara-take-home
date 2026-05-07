import { test as baseTest } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { CheckboxesPage } from '../pages/CheckboxesPage';
import { DynamicLoadingPage } from '../pages/DynamicLoadingPage';

interface IMyFixture {
  relativeUrl: string;
  loginPage: LoginPage;
  checkboxesPage: CheckboxesPage;
  dynamicLoadingPage: DynamicLoadingPage;
}

export const test = baseTest.extend<IMyFixture>({
  relativeUrl: ['', { option: true }],

  page: async ({ page, relativeUrl }, use) => {
    await page.goto(relativeUrl);
    await use(page);
  },

  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await use(loginPage);
  },

  checkboxesPage: async ({ page }, use) => {
    const checkboxesPage = new CheckboxesPage(page);
    await checkboxesPage.goto();
    await use(checkboxesPage);
  },

  dynamicLoadingPage: async ({ page }, use) => {
    const dynamicLoadingPage = new DynamicLoadingPage(page);
    await dynamicLoadingPage.goto();
    await use(dynamicLoadingPage);
  },
});
