---
description: "Use when writing, editing, or reviewing Playwright test files (*.spec.ts). Covers locator strategy, test structure, and conventions for this project."
applyTo: "tests/**/*.spec.ts"
---

# Playwright Test Conventions

## File Structure

Every test file must start with a header comment referencing its plan and seed:

```ts
// spec: specs/<plan-name>.md
// seed: tests/seed.spec.ts

import { test, expect } from "@playwright/test";
```

## Test Structure

- Wrap related tests in `test.describe('Group Name', ...)` — group name must match the top-level test plan section.
- Test title must match the scenario name from the plan (verbatim).
- One scenario per `test()` block. Do not combine multiple scenarios in one test.

```ts
test.describe("Adding New Todos", () => {
  test("Add Valid Todo", async ({ page }) => {
    // steps...
  });
});
```

## Step Comments

Add a comment with the step text from the plan immediately before each interaction block:

```ts
// 1. Navigate to the app
await page.goto("https://example.com");

// 2. Click the "Submit" button
await page.getByRole("button", { name: "Submit" }).click();
```

## Locator Priority

1. `getByRole` — prefer accessible roles
2. `getByLabel` / `getByPlaceholder` — form inputs
3. `getByText` — visible text content
4. `getByTestId` — explicit `data-testid` attributes
5. CSS selectors — last resort only; **never** use XPath

## Assertions

- Use `expect(locator).toBeVisible()` over `.isVisible()` (auto-retry built in).
- Use `expect(page).toHaveURL(...)` / `expect(page).toHaveTitle(...)` for page-level assertions.
- For dynamic content, use regex patterns in matchers to avoid fragile exact-string assertions.

## Anti-patterns

- **Never** use `page.waitForTimeout(...)` — use auto-waiting assertions instead.
- **Never** use `waitForNetworkIdle` — it is deprecated.
- **Never** mix multiple scenarios in a single test.
- Avoid hardcoded delays — prefer `page.waitForSelector` or assertion retries.
