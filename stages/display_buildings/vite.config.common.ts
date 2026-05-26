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
      "@slices": aliasPrefix("src/store/slices"),
      "@store": aliasPrefix("src/store"),
      "@entities": aliasPrefix("src/entities"),
      "@utils": aliasPrefix("src/utils"),
      "@hooks": aliasPrefix("src/hooks"),
      "@contexts": aliasPrefix("src/contexts"),
      "@components": aliasPrefix("src/components"),
      "@services": aliasPrefix("src/services"),
      "@.types": aliasPrefix("src/types"),
      "@widgets": aliasPrefix("src/widgets"),
    },
  },
});
