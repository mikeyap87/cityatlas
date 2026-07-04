import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";

export default defineConfig({
  esbuild: {
    jsx: "automatic",
  },
  resolve: {
    alias: {
      react: fileURLToPath(new URL("./node_modules/react", import.meta.url)),
      "react-dom": fileURLToPath(new URL("./node_modules/react-dom", import.meta.url)),
    },
  },
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
