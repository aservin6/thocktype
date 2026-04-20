// vitest.config.ts
import { defineConfig } from "vitest/config";
import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  test: {
    // Specify 'node' environment for backend testing
    environment: "node",
    // Enable global test functions (describe, it, expect) if desired
    globals: true,
  },
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
