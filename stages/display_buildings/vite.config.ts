import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

const aliasPrefix = (subdir) => path.resolve(__dirname, subdir);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
  },
  build: {
    outDir: "dist",
    sourcemap: true,
  },
  resolve: {
    alias: {
      "@slices": aliasPrefix("src/store/slices"),
      "@store": aliasPrefix("src/store"),
      "@utils": aliasPrefix("src/utils"),
      "@hooks": aliasPrefix("src/hooks"),
      "@contexts": aliasPrefix("src/contexts"),
      "@services": aliasPrefix("src/services"),
    },
  },
});
