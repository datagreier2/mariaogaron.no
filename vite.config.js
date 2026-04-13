import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        middag: resolve(__dirname, "middag/index.html"),
        vielse: resolve(__dirname, "vielse/index.html"),
      },
    },
  },
});
