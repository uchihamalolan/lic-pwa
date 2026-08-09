import stylex from "@stylexjs/unplugin";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  // @ts-expect-error stylex.vite is the correct path
  plugins: [stylex.vite(), react()],
  resolve: { tsconfigPaths: true },
});
