import type { VitePWAOptions } from "vite-plugin-pwa";

export const pwaOptions: Partial<VitePWAOptions> = {
  registerType: "autoUpdate",
  includeAssets: ["icons/favicon.ico", "icons/apple-touch-icon.png", "icons/logo.svg"],
  workbox: {
    navigateFallback: "/index.html",
    globPatterns: ["**/*.{js,css,html,ico,png,svg,webmanifest}"],
    cleanupOutdatedCaches: true,
    clientsClaim: true,
    skipWaiting: true,
  },
  manifest: {
    name: "LIC Claims Dispatcher",
    short_name: "LIC Claims",
    description: "WhatsApp & SMS Claims Notification Pipeline for LIC Agents",
    start_url: "/",
    display: "standalone",
    background_color: "#121212",
    theme_color: "#6750A4",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any maskable",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any maskable",
      },
    ],
  },
  devOptions: {
    enabled: false,
  },
};
