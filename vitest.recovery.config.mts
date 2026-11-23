import { defineConfig } from "vitest/config";

export default defineConfig({
  test: { include: ["tests/live-transfer/recovery.test.ts"], environment: "node", testTimeout: 120_000, retry: 0 },
});
