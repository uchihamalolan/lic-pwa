import { defineTheme } from "@astryxdesign/core/theme";
import { matchaTheme } from "@astryxdesign/theme-matcha";
import { flavors } from "@catppuccin/palette";

const light = flavors.latte.colors;
const dark = flavors.mocha.colors;

const formatOklch = (color: (typeof light)["base"]) =>
  `oklch(${color.oklch.l} ${color.oklch.c} ${color.oklch.h})`;

export const catppuccinMatchaTheme = defineTheme({
  name: "catppuccin-matcha",
  extends: matchaTheme,
  tokens: {
    // Radius Tokens (Structured 10px containers & 8px elements)
    "--radius-container": "10px",
    "--radius-element": "8px",
    "--radius-inner": "6px",

    // Canvas & Surface Backgrounds (Catppuccin Latte Light | Catppuccin Mocha Dark OKLCH)
    "--color-background-body": [formatOklch(light.base), formatOklch(dark.base)],
    "--color-background-card": [formatOklch(light.mantle), formatOklch(dark.mantle)],
    "--color-background-surface": [formatOklch(light.crust), formatOklch(dark.crust)],
    "--color-background-muted": [formatOklch(light.surface0), formatOklch(dark.surface0)],

    // Typography (Latte Text / Mocha Text OKLCH)
    "--color-text-primary": [formatOklch(light.text), formatOklch(dark.text)],
    "--color-text-secondary": [formatOklch(light.subtext0), formatOklch(dark.subtext0)],
    "--color-text-accent": [formatOklch(light.mauve), formatOklch(dark.mauve)],

    // Borders & Dividers (Latte Surface0 / Mocha Surface1 OKLCH)
    "--color-border": [formatOklch(light.surface0), formatOklch(dark.surface0)],
    "--color-border-emphasized": [formatOklch(light.surface1), formatOklch(dark.surface1)],

    // Primary Accents (Catppuccin Mauve OKLCH: Latte / Mocha)
    "--color-accent": [formatOklch(light.mauve), formatOklch(dark.mauve)],
    "--color-accent-muted": [formatOklch(light.surface0), formatOklch(dark.surface0)],
    "--color-on-accent": [formatOklch(light.base), formatOklch(dark.base)],

    // Status Colors (Green, Yellow, Red in OKLCH)
    "--color-success": [formatOklch(light.green), formatOklch(dark.green)],
    "--color-warning": [formatOklch(light.yellow), formatOklch(dark.yellow)],
    "--color-error": [formatOklch(light.red), formatOklch(dark.red)],
  },
});
