/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// The site is served from the root of orjans.no, so all paths are absolute ("/").
export default defineConfig({
  plugins: [react()],
  base: "/",
  // Same as sql-games: node by default, jsdom only for component tests that need it.
  test: { environment: "node" },
});
