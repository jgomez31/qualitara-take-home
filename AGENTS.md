# Qualitara Take-Home — Agent Guidelines

Playwright + TypeScript end-to-end test project. Three custom agents handle the full test lifecycle: plan → generate → heal.

## Project Structure

```
specs/          # Test plans (Markdown) — input for playwright-test-generator
tests/          # Test files (*.spec.ts) — generated or hand-written
playwright.config.ts
```

## Commands

```bash
npx playwright test                          # Run all tests (Chromium + Firefox)
npx playwright test tests/foo.spec.ts        # Run a single file
npx playwright test --project=chromium       # Run a single browser
npx playwright show-report generated/report  # Open HTML report
```

> Test runner commands use `npx playwright …` directly. Code quality (lint, format, type-check) uses npm scripts — run `npm run check` to execute all checks at once.

## Test Configuration

See [playwright.config.ts](playwright.config.ts) for full config. Key settings:

- `testDir: "./tests"` — all spec files live here
- `testIgnore: "**/seed.spec.ts"` — the seed template is excluded from test runs
- `fullyParallel: true`, `workers: 3`, `retries: 1`
- Browsers: **Chromium** and **Firefox**
- Artifacts saved to `generated/`: HTML report under `generated/report/`, traces and screenshots (on failure) under `generated/results/`

## Test Authoring Conventions

- **One test per `test()` call.** Group related tests with `test.describe('Group Name', ...)`.
- **Describe name = top-level test plan section.** Test title = scenario name (verbatim from the plan).
- **Seed file** (`tests/seed.spec.ts`) — baseline state template. Copy it for new test groups. Note: this file is excluded from the test runner via `testIgnore`.
- **Import `test` from the fixture** — always import `test` (and optionally `expect`) from `../fixtures/fixture`, not from `@playwright/test`, so fixture-injected page objects are available:
  ```ts
  import { test } from '../fixtures/fixture';
  import { expect } from '@playwright/test';
  ```
- **Step comments** — add a comment with the step text above each interaction block:
  ```ts
  // 1. Click the "Submit" button
  await page.getByRole("button", { name: "Submit" }).click();
  ```
- **File header comment** — always reference the originating spec and seed:
  ```ts
  // spec: specs/my-plan.md
  // seed: tests/seed.spec.ts
  ```

## Locator Priority (Playwright best practices)

Prefer in this order:

1. `getByRole` — accessible roles
2. `getByLabel` / `getByPlaceholder` — form inputs
3. `getByText` — visible text
4. `getByTestId` — explicit test IDs
5. CSS / XPath — **last resort only**

Never use `waitForNetworkIdle` or other deprecated APIs.

## Custom Agents

Three agents are pre-configured in [.github/agents/](.github/agents/). Use them in sequence:

| Agent                       | Trigger                      | What it does                                                                                        |
| --------------------------- | ---------------------------- | --------------------------------------------------------------------------------------------------- |
| `playwright-test-planner`   | `@playwright-test-planner`   | Navigates the live app and produces a Markdown test plan saved to `specs/`                          |
| `playwright-test-generator` | `@playwright-test-generator` | Reads a plan from `specs/`, executes each step in the browser, and writes a `*.spec.ts` to `tests/` |
| `playwright-test-healer`    | `@playwright-test-healer`    | Runs failing tests, debugs root cause, and edits test code until they pass                          |

## Test Plan Format (`specs/`)

Plans are Markdown files. Generator expects this structure:

```markdown
### 1. Feature Group Name

**Seed:** `tests/seed.spec.ts`

#### 1.1 Scenario Name

**Steps:**

1. Step description
2. Step description
```

## Troubleshooting

- **Flaky tests**: Add `test.slow()` or increase the assertion timeout. Never add `page.waitForTimeout`.
- **Broken selectors**: Use `@playwright-test-healer` — it will snapshot the page and regenerate selectors.
- **Report not opening**: Run `npx playwright show-report generated/results` after the test run.
- **Traces**: Traces are retained on failure — open them with `npx playwright show-trace <trace.zip>`.
