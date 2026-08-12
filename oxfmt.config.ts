import { defineConfig } from "oxfmt";

export default defineConfig({
  semi: true,
  printWidth: 110,
  sortImports: true,
  sortTailwindcss: true,
  ignorePatterns: ["src/themes/*"],
});
