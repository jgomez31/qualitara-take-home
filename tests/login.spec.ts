import { expect } from '@playwright/test';
import { test } from '../fixtures/fixture';
import { styles } from '../constants/styles';

test.describe.only('Login Test cases', () => {
  if (!process.env.PASSWORD || !process.env.USERNAME) {
    throw new Error('USERNAME and PASSWORD environment variables must be set');
  }

  const testData = [
    {
      description: 'Invalid username login',
      username: 'invalid',
      password: process.env.PASSWORD,
      message: 'Your username is invalid!',
      color: styles.errorColor,
      title: 'Login Page',
    },
    {
      description: 'Invalid password login',
      username: process.env.USERNAME,
      password: 'invalid',
      message: 'Your password is invalid!',
      color: styles.errorColor,
      title: 'Login Page',
    },
    {
      description: 'Successful login',
      username: process.env.USERNAME,
      password: process.env.PASSWORD,
      message: 'You logged into a secure area!',
      color: styles.successColor,
      title: 'Secure Area',
    },
  ];

  for (const { description, username, password, message, color, title } of testData) {
    test(`${description} test`, async ({ loginPage }) => {
      // 1. Enter username and password
      // 2. Click login
      await loginPage.login(username, password);

      // 3. Check message displayed (text content is the expected one)
      await expect(loginPage.flashMessage).toBeVisible();
      expect(await loginPage.getMessageText()).toBe(message);

      // 4. Check message color is expected
      expect(await loginPage.getMessageBackgroundColor()).toBe(color);

      // 5. Check page title is expected
      expect(await loginPage.getHeadingText()).toBe(title);
    });
  }
});
