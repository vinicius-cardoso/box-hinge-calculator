import { defineConfig } from "tsup";

// Build do pacote: JS (ESM) + tipos .d.ts. O CSS (theme.css) é tratado pelo
// conversor via cfg.cssEntry, não pelo bundle JS — por isso index.ts não importa CSS.
export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  dts: true,
  clean: true,
  external: ["react", "react-dom"],
});
