import { defineConfig, devices } from "@playwright/test";

// Port 3002 avoids the dev server default (3000) and other local apps on 3001.
const port = 3002;

export default defineConfig({
  testDir: "tests",
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  use: {
    baseURL: `http://localhost:${port}`,
    trace: "retain-on-failure",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  // Tests the static export the site actually ships, not the dev server.
  webServer: {
    command: `npm run build && npx serve@14 out -l ${port}`,
    url: `http://localhost:${port}`,
    timeout: 180_000,
    reuseExistingServer: false,
  },
});
