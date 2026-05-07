# Qualitara Take-Home — Playwright E2E Test Suite

End-to-end test suite for [The Internet](https://the-internet.herokuapp.com/), built with [Playwright](https://playwright.dev/) and TypeScript.

---

## Running Tests Locally

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or later
- npm v9 or later

### 1. Install npm dependencies

```bash
npm install
```

### 2. Install Playwright browsers

```bash
npx playwright install --with-deps
```

This installs the Chromium and Firefox browser binaries used by the test suite.

### 3. Set up .env file

Create a copy of .env file named .env.local file within the repository root and set a valid username and password in that file.

In Github Actions these values should be set in the Repository's Settings page, under 'Secrets and variables' > 'Actions'.

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

All artifacts are written to `generated/results/` after a test run.

| Artifact | Location | When generated |
|---|---|---|
| HTML report | `generated/report/index.html` | Always |
| Traces | `generated/results/<test-name>/trace.zip` | On failure |
| Screenshots (full-page) | `generated/results/<test-name>/*.png` | On failure |

Open a trace file to replay a failed test step-by-step:

```bash
npm run show:trace generated/results/<test-name>/trace.zip
```

---

## Trade-offs and Design Decisions

> _To be completed manually._

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

- **Test generation**: The `@playwright-test-generator` agent translated each plan scenario into a runnable Playwright spec, executing steps live in the browser to validate locators before writing the final TypeScript. This eliminated the manual trial-and-error loop of writing selectors and asserting on live DOM.

- **Test healing**: The `@playwright-test-healer` agent was used to recover from broken selectors and flaky assertions. It uses `test_debug` to pause on failures, snapshot the live page, identify the root cause, and apply a targeted fix — repeating until the test passes.

- **Page Object Model scaffolding**: AI assistance was used to generate the initial page object classes under `pages/` (e.g., `LoginPage.ts`, `CheckboxesPage.ts`, `DynamicLoadingPage.ts`), following the project's locator priority conventions.

- **Configuration and tooling**: The `playwright.config.ts`, ESLint config, Prettier config, and `tsconfig.json` were set up with AI assistance to enforce consistent code style and type safety across the project.
