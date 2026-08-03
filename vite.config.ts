import { defineConfig } from "vite-plus";

export default defineConfig({
  build: {
    // The dashboard runs in BOOX NeoBrowser, whose engine is several years
    // behind. Without an explicit target the minifier emits `inset`, range
    // media queries and `??`, all of which that engine silently drops.
    target: ["chrome61"],
    cssTarget: ["chrome61"],
  },
  staged: {
    "*": "vp check --fix",
  },
  fmt: {},
  lint: {
    jsPlugins: [{ name: "vite-plus", specifier: "vite-plus/oxlint-plugin" }],
    rules: { "vite-plus/prefer-vite-plus-imports": "error" },
    options: { typeAware: true, typeCheck: true },
  },
});
