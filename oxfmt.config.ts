import { defineConfig } from "oxfmt";

export default defineConfig({
  semi: true,
  printWidth: 110,
  sortImports: {
    customGroups: [
      {
        groupName: "react-vite",
        elementNamePattern: [
          "react",
          "react/*",
          "react/**",
          "react-dom",
          "react-dom/*",
          "react-dom/**",
          "vite",
          "vite/*",
          "vite/**",
        ],
      },
      {
        groupName: "astryx",
        elementNamePattern: ["@astryxdesign/*", "@astryxdesign/**"],
      },
      {
        groupName: "alias",
        elementNamePattern: ["@/*", "@/**"],
      },
    ],
    groups: [
      "react-vite",
      ["builtin", "external"],
      "astryx",
      "alias",
      ["parent", "sibling", "index"],
      "unknown",
    ],
  },
  sortTailwindcss: true,
  ignorePatterns: ["src/themes/*"],
});
