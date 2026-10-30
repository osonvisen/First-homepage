import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// base: "./" gjør at siden virker både på github.io/First-homepage/ og på orjans.no
export default defineConfig({
  plugins: [react()],
  base: "./",
});
