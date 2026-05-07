import { type Page, type Locator } from '@playwright/test';

export class DynamicLoadingPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly startContainer: Locator;
  readonly startButton: Locator;
  readonly loadingIndicator: Locator;
  readonly helloWorldHeading: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole('heading', {
      name: 'Dynamically Loaded Page Elements',
      level: 3,
    });
    this.startContainer = page.locator('#start');
    this.startButton = page.getByRole('button', { name: 'Start' });
    this.loadingIndicator = page.locator('#loading');
    this.helloWorldHeading = page.locator('#finish h4');
  }

  async goto(): Promise<void> {
    await this.page.goto('dynamic_loading/1');
  }
}
