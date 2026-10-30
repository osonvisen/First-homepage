import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Siden ligger på roten av orjans.no, så alle stier er absolutte ("/").
export default defineConfig({
  plugins: [react()],
  base: "/",
});
