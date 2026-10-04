import { defineConfig } from '@playwright/test';

const ci = Boolean(process.env.CI);

export default defineConfig({
  testDir: 'tests',
  fullyParallel: true,
  // Each worker runs its own Chromium; more than two can run a small machine out of memory, and
  // GitHub's runners default to two anyway.
  workers: 2,
  forbidOnly: ci,
  reporter: ci ? [['github'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: 'http://localhost:4173/',
    trace: 'retain-on-failure',
  },
  projects: [
    {
      name: 'desktop',
      testIgnore: /phone\.spec\.ts/,
      use: { browserName: 'chromium', viewport: { width: 1280, height: 800 } },
    },
    {
      name: 'phone',
      testMatch: /phone\.spec\.ts/,
      use: {
        browserName: 'chromium',
        viewport: { width: 390, height: 844 },
        deviceScaleFactor: 3,
        isMobile: true,
        hasTouch: true,
      },
    },
  ],
  // The tests run against the production build, the way the site is deployed. CI has just built
  // it in its own step.
  webServer: {
    command: `${ci ? '' : 'pnpm build && '}pnpm preview --port 4173 --strictPort`,
    url: 'http://localhost:4173/',
    reuseExistingServer: !ci,
  },
});
