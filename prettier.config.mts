import type { Config } from 'prettier';

const config: Config = {
  // ── Line length ──────────────────────────────────────────────────────────
  printWidth: 100,

  // ── Indentation ──────────────────────────────────────────────────────────
  tabWidth: 2,
  useTabs: false,

  // ── Semicolons ───────────────────────────────────────────────────────────
  semi: true,

  // ── Quotes ───────────────────────────────────────────────────────────────
  singleQuote: true,
  quoteProps: 'as-needed',
  jsxSingleQuote: false,

  // ── Trailing commas ──────────────────────────────────────────────────────
  // "all" adds trailing commas wherever valid in ES5+ (objects, arrays,
  // function parameters, destructuring, etc.)
  trailingComma: 'all',

  // ── Brackets & parens ────────────────────────────────────────────────────
  bracketSpacing: true,
  bracketSameLine: false,
  arrowParens: 'always',

  // ── End of line ──────────────────────────────────────────────────────────
  // "lf" ensures consistent line endings across macOS, Linux, and Windows.
  endOfLine: 'lf',

  // ── Embedded language formatting ─────────────────────────────────────────
  embeddedLanguageFormatting: 'auto',
};

export default config;
