import { type Page, type Locator } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly flashMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole('heading', { level: 2 });
    this.usernameInput = page.getByLabel('Username');
    this.passwordInput = page.getByLabel('Password');
    this.loginButton = page.getByRole('button', { name: /Login/i });
    // The flash message element is identified by its stable ID and data-alert attribute.
    // Text content varies (error vs. success) so we avoid text-based locators here.
    this.flashMessage = page.locator('[data-alert]#flash');
  }

  async goto(): Promise<void> {
    await this.page.goto('login');
  }

  async getHeadingText(): Promise<string> {
    return ((await this.heading.textContent()) ?? '').replace(/\s*×\s*$/, '').trim();
  }

  async fillUsername(username: string): Promise<void> {
    await this.usernameInput.fill(username);
  }

  async fillPassword(password: string): Promise<void> {
    await this.passwordInput.fill(password);
  }

  async clickLogin(): Promise<void> {
    await this.loginButton.click();
  }

  async login(username: string, password: string): Promise<void> {
    await this.fillUsername(username);
    await this.fillPassword(password);
    await this.clickLogin();
  }

  async getMessageText(): Promise<string> {
    return ((await this.flashMessage.textContent()) ?? '').replace(/\s*×\s*$/, '').trim();
  }

  async getMessageBackgroundColor(): Promise<string> {
    return this.flashMessage.evaluate(
      (el) => el.ownerDocument?.defaultView?.getComputedStyle(el).backgroundColor ?? '',
    );
  }
}
