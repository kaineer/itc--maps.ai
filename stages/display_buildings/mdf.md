## vite.config.common.ts
```` vite.config.common.ts
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
      "@utils": aliasPrefix("src/utils"),
      "@hooks": aliasPrefix("src/hooks"),
      "@contexts": aliasPrefix("src/contexts"),
      "@components": aliasPrefix("src/components"),
      "@services": aliasPrefix("src/services"),
      "@_types": aliasPrefix("src/types"),
    },
  },
});
````
## tsconfig.json
```` tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",

    /* Path aliases */
    "baseUrl": ".",
    "paths": {
      "@slices/*": ["src/store/slices/*"],
      "@store/*": ["src/store/*"],
      "@utils/*": ["src/utils/*"],
      "@hooks/*": ["src/hooks/*"],
      "@components/*": ["src/components/*"],
      "@contexts/*": ["src/contexts/*"],
      "@services/*": ["src/services/*"],
      "@_types/*": ["src/types/*"],
    },

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }],
}
````
