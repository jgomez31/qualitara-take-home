# Qualitara Take-Home — Playwright E2E Test Suite

End-to-end test suite for [The Internet](https://the-internet.herokuapp.com/), built with [Playwright](https://playwright.dev/) and TypeScript.

---

## Running Tests Locally

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or later
- npm v9 or later

### 1. Install npm dependencies

```bash
npm ci
```

### 2. Install Playwright browsers

```bash
npx playwright install --with-deps
```

This installs the Chromium and Firefox browser binaries used by the test suite.

### 3. Set up .env file

The `.env` file is committed as an empty template (both values are blank). Create a `.env.local` file in the repository root and fill in the credentials — this file is never committed:

```bash
cp .env .env.local
# then edit .env.local and set USERNAME and PASSWORD
```

`playwright.config.ts` loads `.env` first and then applies `.env.local` with `override: true`, so local values always win.

Note: In GitHub Actions these values should be set as Repository Secrets. Go to **Settings → Secrets and variables → Actions** and add `USERNAME` and `PASSWORD`. The CI workflow automatically writes them into `.env.local` before running the tests.

### 4. Run the tests

Run the full suite across all configured browsers (Chromium + Firefox):

```bash
npx playwright test
```

Run a single spec file:

```bash
npx playwright test tests/login.spec.ts
```

Run against a single browser only:

```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
```

### 5. Test artifacts

All artifacts are written to `generated/` folder after a test run.

| Artifact | Location | When generated |
|---|---|---|
| HTML report | `generated/report/index.html` | Always |
| Traces | `generated/results/<test-name>/trace.zip` | On failure |
| Screenshots (full-page) | `generated/results/<test-name>/*.png` | On failure |

To open a trace file to replay a failed test step-by-step:

```bash
npm run show:trace generated/results/<test-name>/trace.zip
```

> `tests/seed.spec.ts` is excluded from the test runner via `testIgnore` in `playwright.config.ts`. It exists only as an authoring template and is never executed as part of the suite.

### 6. Code quality scripts

The following npm scripts are available for linting, formatting, and type-checking:

| Script | What it does |
|---|---|
| `npm run lint:check` | Run ESLint (zero warnings allowed) |
| `npm run lint:fix` | Auto-fix ESLint violations |
| `npm run type:check` | TypeScript type-check without emitting files |
| `npm run prettier:check` | Check formatting with Prettier |
| `npm run prettier:fix` | Auto-format all files with Prettier |
| `npm run check` | Run all of the above plus `npm outdated` and `npm audit` |
| `npm run show:trace <file>` | Open a Playwright trace zip for replay |
| `npm run update` | Interactive dependency update via `npm-check` |

---

## CI/CD

A GitHub Actions workflow lives at `.github/workflows/tests.yml`. It runs the full test suite on every push or pull request to `main`/`master`.

Key features:
- **Dependency caching** — `node_modules` and the Playwright browser binaries (`~/.cache/ms-playwright`) are cached by a hash of `package-lock.json`, so installs are skipped on cache hits.
- **Secrets injection** — `USERNAME` and `PASSWORD` are written into `.env.local` at runtime from Repository Secrets.
- **Artifact upload** — the entire `generated/` folder (HTML report, traces, screenshots) is uploaded as a workflow artifact and retained for 30 days.

---

## Design Decisions

- **POM Pattern** Apply POM pattern to centralize locators and page-interaciton methods and logic, to allow reusability, maintainability and tests scalability.

- **Scoped Locators** It was used just once in these tests, but I included scoped locators whenever possible. That is, prefer the following even when elements can be located directly on the whole page:

```typescript

this.checkboxesContainer = page.locator('#checkboxes');
this.checkboxes = this.checkboxesContainer.locator('input[type="checkbox"]');

```

This helps out with maintainability and test stability, specially in UIs with complex and nested elements or UIs that repeat elements with similar locators.

- **No 'Logged In' Page** What is displayed after clicking 'Login' button in the success flow could technically be considered a "new page". However, I just kept the elements and methods within LoginPage.ts page object since there's no actual redirection and this allowed me to keep the same test structure and parametrise that flow with the unsuccessful login cases.

- **Fixture Injection** Apply Playwright fixture injection mechanism used to encapsulate setup logic into modular and reusable components, specifically for Page Objects generation (encapsulating page instantiation and navigation).

- **Parametrized Tests and Methods** Although requested, this is a good practice I like to follow whenever possible. If the test structure repeats I like to parametrize it to allow duplicating code since that would mean more maintainability effort moving forward. Similarly if smaller flows or pieces of a test case repeat (either within the same test or different ones) I like to put those in a separate auxiliar method local to the test spec. I didn't need to generate auxiliar methods for this purpose in this project, though.

- **Constants** I generated a constants folder to contain constant values common across the application. In these tests I've only used it for error and success color codes.

- **Utils and Helpers** These are rather simple tests so I didn't generated any util or helper file, which I would normally locate under a 'utils' or 'helper' folder in the root of the project. I normally do this when dealing with helper methods that can potentially benefit the framework in general (not a particular test case auxilair method). For example, date formats or timezones.

- **Secrets handling** Even though the testing site itself exposes the valid username and password to be used in the Login test, I wanted to showcase the way I would handle the secrets in the project. I did this through environment variables, in this case using dotenv dependency which makes it simple, clean and readable. Additionally this provides a centralized template indicating the configurable setting for the test project.

- **Soft Assertions** `expect.soft()` is used where multiple independent checks can be validated in a single test without aborting on the first failure. This gives a fuller picture of failures for state-verification tests (e.g., checking every checkbox's initial state at once). Regular `expect()` is used where subsequent steps depend on the assertion being true.

- **Retry Configurations** I included a retry configuration to re-execute failed tests one more time. Although not requested, I see this useful to separate flaky test cases from constant failing test cases in the reports and executions.

- **Code Standardization** I included code standardization (linting and formatting) rules to enforce a consistent codebase. This covers: TypeScript strict mode (`tsconfig.json`), ESLint with `eslint-plugin-playwright` for Playwright-specific rules (e.g., no `waitForTimeout`, web-first assertions, no focused tests in CI), and Prettier for formatting. The combined `npm run check` script validates all of these plus audits dependencies in one pass.

---

## AI Usage

This project was set up with a three-agent AI workflow powered by GitHub Copilot (Claude Sonnet) and the [Playwright MCP server](https://playwright.dev/docs/mcp):

| Agent | Role |
|---|---|
| `@playwright-test-planner` | Navigates the live application and produces a structured Markdown test plan saved to `specs/` |
| `@playwright-test-generator` | Reads a plan from `specs/`, executes each step live in the browser, and writes a typed `*.spec.ts` file to `tests/` |
| `@playwright-test-healer` | Runs failing tests, captures page snapshots, diagnoses root causes, and edits test code until the suite is green |

### How AI was used in this project

- **Test planning**: The `@playwright-test-planner` was not occupied this time, as the test cases were indicated in the exercise itself.

- **Test generation**: The `@playwright-test-generator` agent translated each plan scenario into a runnable Playwright spec and associated PageObject models, executing steps live in the browser to validate locators before writing the final TypeScript. This eliminated the manual trial-and-error loop of writing selectors and asserting on live DOM.

- **Test healing**: The `@playwright-test-healer` agent was used to recover from broken selectors and flaky assertions. It uses `test_debug` to pause on failures, snapshot the live page, identify the root cause, and apply a targeted fix — repeating until the test passes.

- **Page Object Model scaffolding**: AI assistance was used to generate the initial page object classes under `pages/` (e.g., `LoginPage.ts`, `CheckboxesPage.ts`, `DynamicLoadingPage.ts`), following the project's locator priority conventions.

- **Configuration and tooling**: The `playwright.config.ts`, ESLint config, Prettier config, `tsconfig.json` and dotenv were set up with AI assistance to enforce consistent code style and type safety across the project.

- **Review and assistance**: Used Github Copilot agents to avoid manual and time consuming tasks in general, like codebase review to identify inconsistencies or missing documentation, review dependencies and action versions, converting .ai-sessions Chats from JSON to markdown files.