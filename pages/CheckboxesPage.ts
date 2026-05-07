import { type Page, type Locator } from '@playwright/test';

export class CheckboxesPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly checkboxesContainer: Locator;
  readonly checkboxes: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: 'Checkboxes', level: 3 });
    this.checkboxesContainer = page.locator('#checkboxes');
    // Checkboxes have no accessible labels; located by position within the form
    this.checkboxes = this.checkboxesContainer.locator('input[type="checkbox"]');
  }

  async goto(): Promise<void> {
    await this.page.goto('checkboxes');
  }

  async getHeadingText(): Promise<string> {
    return ((await this.heading.textContent()) ?? '').trim();
  }

  async getContainerTextContent(): Promise<string> {
    return ((await this.checkboxesContainer.textContent()) ?? '').trim();
  }

  async isCheckboxAtChecked(index: number): Promise<boolean> {
    return (await this.getCheckboxByIndex(index)).isChecked();
  }

  async toggleCheckboxAt(index: number): Promise<void> {
    await (await this.getCheckboxByIndex(index)).click();
  }

  async setCheckboxAtTo(index: number, desiredState: boolean): Promise<void> {
    const checkbox = await this.getCheckboxByIndex(index);
    await checkbox.setChecked(desiredState);
  }

  async getCheckboxByIndex(index: number): Promise<Locator> {
    const checkbox = (await this.checkboxes.all()).at(index);
    if (!checkbox) {
      throw new Error(`Checkbox at index ${index} not found`);
    }
    return checkbox;
  }
}
