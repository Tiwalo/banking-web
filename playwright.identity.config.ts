import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/identity",
  workers: 1,
  timeout: 120_000,
  use: { baseURL: "http://localhost:3000", browserName: "chromium", trace: "off", screenshot: "off", video: "off" },
});
