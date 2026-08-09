import { defineConfig } from "oxlint";

export default defineConfig({
  options: {
    typeAware: true,
    typeCheck: true,
  },
  plugins: ["eslint", "typescript", "unicorn", "oxc", "jsx-a11y", "react"],
});
