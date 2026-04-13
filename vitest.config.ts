// vitest.config.ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // Specify 'node' environment for backend testing
    environment: "node",
    // Enable global test functions (describe, it, expect) if desired
    globals: true,
  },
});
