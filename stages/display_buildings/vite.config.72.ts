import { mergeConfig } from "vite";
import commonConfig, { defineHost } from "./vite.config.common.js";

export default mergeConfig(commonConfig, {
  define: defineHost("10.1.0.72"),
});
