import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";
import path from "path";

export default defineConfig({
  plugins: [solidPlugin()],
  resolve: {
    alias: {
      "@nokiatis/ui": path.resolve(__dirname, "../../../ui/src"),
    },
  },
  server: {
    port: 3000,
  },
});
