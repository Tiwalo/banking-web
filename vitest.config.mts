import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    include: ["tests/components/**/*.test.tsx", "tests/contract/**/*.test.ts", "tests/auth/**/*.test.ts"],
  },
});
