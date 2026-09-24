import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { fileURLToPath } from "url";

// Get __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = resolve(__filename, "..");

const aliasPrefix = (subdir: string) => resolve(__dirname, subdir);
export const defineHost = (host: string) => {
  return {
    "import.meta.env.VITE_HOST": JSON.stringify(host),
  };
};

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
      "@store": aliasPrefix("src/app/store"),
      "@entities": aliasPrefix("src/entities"),
      "@contexts": aliasPrefix("src/contexts"),
      "@app": aliasPrefix("src/app"),
      "@canvas": aliasPrefix("src/shared/canvas"),
      "@kit": aliasPrefix("src/shared/kit"),
      "@widgets": aliasPrefix("src/widgets"),
      "@features": aliasPrefix("src/features"),
      "@shared": aliasPrefix("src/shared"),
      "@pages": aliasPrefix("src/pages"),
    },
  },
});
