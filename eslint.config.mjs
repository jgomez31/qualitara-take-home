// @ts-check
import tseslint from 'typescript-eslint';
import playwright from 'eslint-plugin-playwright';
import prettierConfig from 'eslint-config-prettier';

export default [
  // Verify files to ignore
  {
    ignores: ['playwright-report/**', 'generated/**', 'node_modules/**', '.playwright-mcp/**'],
  },

  // --- TypeScript rules (applied to all TS files) ---
  ...tseslint.configs.recommended,
  {
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/consistent-type-assertions': ['error', { assertionStyle: 'as' }],
      '@typescript-eslint/explicit-function-return-type': 'off',
    },
  },

  // --- Playwright rules (scoped to test files) ---
  {
    files: ['tests/**/*.ts'],
    ...playwright.configs['flat/recommended'],
    rules: {
      ...playwright.configs['flat/recommended'].rules,

      // --- Assertions ---

      // Every test must contain at least one expect() call
      'playwright/expect-expect': 'error',

      // Warn when tests or suites are skipped so they don't go unnoticed
      'playwright/no-skipped-test': 'warn',

      // Prevent accidental test.only() reaching CI (mirrors forbidOnly in config)
      'playwright/no-focused-test': 'error',

      // Validate expect() usage — catches incorrect matcher arguments
      'playwright/valid-expect': 'error',

      // Require expect() calls to be inside a test body, not at module level
      'playwright/no-standalone-expect': 'error',

      // Disallow expect() inside conditionals — assertions must always run
      'playwright/no-conditional-expect': 'error',

      // Prefer toHaveCount(0) over checking emptiness via .count()
      'playwright/prefer-to-have-count': 'warn',

      // --- Async / Awaits ---

      // Disallow hard-coded waits; use auto-retrying assertions instead
      'playwright/no-wait-for-timeout': 'warn',

      // Disallow waiting for networkidle — flaky and slow; prefer explicit assertions
      'playwright/no-networkidle': 'warn',

      // Disallow unnecessary await on non-Promise Playwright expressions
      'playwright/no-useless-await': 'warn',

      // --- Best Practices ---

      // Prefer web-first assertions (toBeVisible, toHaveText, …) over manual waits
      'playwright/prefer-web-first-assertions': 'error',

      // Disallow conditional logic inside tests — each test should have a fixed path
      'playwright/no-conditional-in-test': 'warn',

      // Prefer toStrictEqual over toEqual for accurate deep equality checks
      'playwright/prefer-strict-equal': 'error',

      // Require all tests to be wrapped inside a describe block
      'playwright/require-top-level-describe': 'warn',

      // Prevent committed page.pause() calls (blocks test runs)
      'playwright/no-page-pause': 'error',

      // Discourage force-clicking — masks real UI/accessibility issues
      'playwright/no-force-option': 'warn',

      // Prefer locator.nth() over :nth-child / :nth-of-type CSS selectors
      'playwright/no-nth-methods': 'warn',

      // Warn on raw element handles (ElementHandle) — locators are the modern API
      'playwright/no-element-handle': 'warn',

      // Flag logically redundant .not assertions
      'playwright/no-useless-not': 'warn',
    },
  },

  // --- Prettier integration (must be last) ---
  // Turns off all ESLint rules that could conflict with Prettier's formatting.
  prettierConfig,
];
