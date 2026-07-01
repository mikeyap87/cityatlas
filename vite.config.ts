import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    // Vite 8 app-mode module preload analysis hangs on the current CityAtlas route graph.
    modulePreload: false,
  },
  server: {
    host: "127.0.0.1",
    port: 5178,
  },
  preview: {
    host: "127.0.0.1",
    port: 4178,
  },
});
