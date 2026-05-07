import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '.env') });
dotenv.config({ path: path.resolve(__dirname, '.env.local'), override: true });

/**
 * See https://playwright.dev/docs/test-configuration.
 */ export default defineConfig({
  testDir: './tests',
  testIgnore: '**/seed.spec.ts',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 1,
  workers: 3,
  outputDir: 'generated/results',
  reporter: [['html', { open: 'never', outputFolder: 'generated/report' }]],
  /* Shared settings for all the projects below. */
  use: {
    baseURL: 'https://the-internet.herokuapp.com/',

    trace: 'retain-on-failure',
    screenshot: {
      mode: 'only-on-failure',
      fullPage: true,
    },
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        launchOptions: {
          args: ['--disable-dev-shm-usage'],
        },
      },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
  ],
});
