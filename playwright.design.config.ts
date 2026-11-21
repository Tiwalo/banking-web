import { defineConfig } from "@playwright/test";

const baseURL = "http://127.0.0.1:4173";
export default defineConfig({
  testDir: "./tests/design",
  outputDir: "./test-results/design",
  forbidOnly: Boolean(process.env.CI),
  use: { baseURL, browserName: "chromium" },
  webServer: { command: "npm run preview:design", url: baseURL, reuseExistingServer: false },
});
