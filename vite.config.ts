import stylex from "@stylexjs/unplugin";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import { pwaOptions } from "./pwa.config.ts";

export default defineConfig({
  plugins: [
    // @ts-expect-error stylex.vite is the correct path
    stylex.vite(),
    react(),
    VitePWA(pwaOptions),
  ],
  resolve: { tsconfigPaths: true },
});
