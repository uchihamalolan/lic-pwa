import { defineTheme } from "@astryxdesign/core/theme";
import { defineSyntaxTheme } from "@astryxdesign/core/theme/syntax";
import { matchaTheme } from "@astryxdesign/theme-matcha";
import { flavors } from "@catppuccin/palette";

const light = flavors.latte.colors;
const dark = flavors.mocha.colors;

const formatOklch = (color: (typeof light)["base"]) =>
  `oklch(${color.oklch.l} ${color.oklch.c} ${color.oklch.h})`;

const formatOklchAlpha = (color: (typeof light)["base"], alpha: number) =>
  `oklch(${color.oklch.l} ${color.oklch.c} ${color.oklch.h} / ${alpha})`;

const catppuccinSyntax = defineSyntaxTheme({
  name: "catppuccin",
  tokens: {
    keyword: [formatOklch(light.mauve), formatOklch(dark.mauve)],
    string: [formatOklch(light.green), formatOklch(dark.green)],
    comment: [formatOklch(light.overlay0), formatOklch(dark.overlay0)],
    number: [formatOklch(light.peach), formatOklch(dark.peach)],
    function: [formatOklch(light.blue), formatOklch(dark.blue)],
    type: [formatOklch(light.yellow), formatOklch(dark.yellow)],
    variable: [formatOklch(light.text), formatOklch(dark.text)],
    operator: [formatOklch(light.sky), formatOklch(dark.sky)],
    constant: [formatOklch(light.peach), formatOklch(dark.peach)],
    tag: [formatOklch(light.red), formatOklch(dark.red)],
    attribute: [formatOklch(light.teal), formatOklch(dark.teal)],
    property: [formatOklch(light.sapphire), formatOklch(dark.sapphire)],
    punctuation: [formatOklch(light.overlay1), formatOklch(dark.overlay1)],
    background: [formatOklch(light.mantle), formatOklch(dark.mantle)],
  },
});

export const catppuccinMatchaTheme = defineTheme({
  name: "catppuccin-matcha",
  extends: matchaTheme,
  radius: { base: 4, multiplier: 1 },
  syntax: catppuccinSyntax,
  tokens: {
    // Primary Accents (Catppuccin Mauve OKLCH: Latte / Mocha)
    "--color-accent": [formatOklch(light.mauve), formatOklch(dark.mauve)],
    "--color-accent-muted": [formatOklchAlpha(light.mauve, 0.12), formatOklchAlpha(dark.mauve, 0.15)],
    "--color-neutral": [formatOklch(light.surface1), formatOklch(dark.surface1)],

    // Canvas, Surface & Popover Backgrounds (Latte Light | Mocha Dark OKLCH)
    "--color-background-surface": [formatOklch(light.crust), formatOklch(dark.crust)],
    "--color-background-body": [formatOklch(light.base), formatOklch(dark.base)],
    "--color-background-muted": [formatOklch(light.surface0), formatOklch(dark.surface0)],

    // Surface variants
    "--color-background-card": [formatOklch(light.mantle), formatOklch(dark.mantle)],
    "--color-background-popover": [formatOklch(light.mantle), formatOklch(dark.mantle)],
    "--color-background-inverted": [formatOklch(light.text), formatOklch(dark.text)],

    // Overlays & Tints (OKLCH with Alpha)
    "--color-overlay": [formatOklchAlpha(light.overlay0, 0.33), formatOklchAlpha(dark.overlay0, 0.44)],
    "--color-overlay-hover": [formatOklchAlpha(light.text, 0.08), formatOklchAlpha(dark.text, 0.1)],
    "--color-overlay-pressed": [formatOklch(light.overlay1), formatOklch(dark.overlay1)],

    // Typography Tokens
    "--color-text-primary": [formatOklch(light.text), formatOklch(dark.text)],
    "--color-text-secondary": [formatOklch(light.subtext0), formatOklch(dark.subtext0)],
    "--color-text-disabled": [formatOklch(light.overlay0), formatOklch(dark.overlay0)],
    "--color-text-accent": [formatOklch(light.mauve), formatOklch(dark.mauve)],
    "--color-on-dark": formatOklch(dark.text),
    "--color-on-light": formatOklch(light.text),
    "--color-on-accent": [formatOklch(light.base), formatOklch(dark.base)],
    "--color-on-success": [formatOklch(light.base), formatOklch(dark.base)],
    "--color-on-error": [formatOklch(light.base), formatOklch(dark.base)],
    "--color-on-warning": [formatOklch(light.base), formatOklch(dark.base)],

    // Icon Tokens
    "--color-icon-accent": [formatOklch(light.mauve), formatOklch(dark.mauve)],
    "--color-icon-primary": [formatOklch(light.text), formatOklch(dark.text)],
    "--color-icon-secondary": [formatOklch(light.subtext0), formatOklch(dark.subtext0)],
    "--color-icon-disabled": [formatOklch(light.overlay0), formatOklch(dark.overlay0)],

    // Status Colors
    "--color-success": [formatOklch(light.green), formatOklch(dark.green)],
    "--color-success-muted": [formatOklchAlpha(light.green, 0.12), formatOklchAlpha(dark.green, 0.15)],
    "--color-error": [formatOklch(light.red), formatOklch(dark.red)],
    "--color-error-muted": [formatOklchAlpha(light.red, 0.12), formatOklchAlpha(dark.red, 0.15)],
    "--color-warning": [formatOklch(light.yellow), formatOklch(dark.yellow)],
    "--color-warning-muted": [formatOklchAlpha(light.yellow, 0.12), formatOklchAlpha(dark.yellow, 0.15)],

    // Borders & Dividers
    "--color-border": [formatOklch(light.surface0), formatOklch(dark.surface0)],
    "--color-border-emphasized": [formatOklch(light.overlay0), formatOklch(dark.overlay0)],

    // Effects
    "--color-skeleton": [formatOklch(light.surface1), formatOklch(dark.surface1)],
    "--color-shadow": [formatOklchAlpha(light.crust, 0.25), "oklch(0 0 0 / 0.5)"],
    "--color-tint-hover": [formatOklchAlpha(light.text, 0.06), formatOklchAlpha(dark.text, 0.08)],

    // Categorical Colors — Blue
    "--color-background-blue": [formatOklchAlpha(light.blue, 0.12), formatOklchAlpha(dark.blue, 0.15)],
    "--color-border-blue": [formatOklch(light.blue), formatOklch(dark.blue)],
    "--color-icon-blue": [formatOklch(light.blue), formatOklch(dark.blue)],
    "--color-text-blue": [formatOklch(light.blue), formatOklch(dark.blue)],

    // Categorical Colors — Cyan
    "--color-background-cyan": [formatOklchAlpha(light.sky, 0.12), formatOklchAlpha(dark.sky, 0.15)],
    "--color-border-cyan": [formatOklch(light.sky), formatOklch(dark.sky)],
    "--color-icon-cyan": [formatOklch(light.sky), formatOklch(dark.sky)],
    "--color-text-cyan": [formatOklch(light.sky), formatOklch(dark.sky)],

    // Categorical Colors — Gray
    "--color-background-gray": [
      formatOklchAlpha(light.subtext0, 0.12),
      formatOklchAlpha(dark.subtext0, 0.15),
    ],
    "--color-border-gray": [formatOklch(light.subtext0), formatOklch(dark.subtext0)],
    "--color-icon-gray": [formatOklch(light.subtext0), formatOklch(dark.subtext0)],
    "--color-text-gray": [formatOklch(light.text), formatOklch(dark.text)],

    // Categorical Colors — Green
    "--color-background-green": [formatOklchAlpha(light.green, 0.12), formatOklchAlpha(dark.green, 0.15)],
    "--color-border-green": [formatOklch(light.green), formatOklch(dark.green)],
    "--color-icon-green": [formatOklch(light.green), formatOklch(dark.green)],
    "--color-text-green": [formatOklch(light.green), formatOklch(dark.green)],

    // Categorical Colors — Orange
    "--color-background-orange": [formatOklchAlpha(light.peach, 0.12), formatOklchAlpha(dark.peach, 0.15)],
    "--color-border-orange": [formatOklch(light.peach), formatOklch(dark.peach)],
    "--color-icon-orange": [formatOklch(light.peach), formatOklch(dark.peach)],
    "--color-text-orange": [formatOklch(light.peach), formatOklch(dark.peach)],

    // Categorical Colors — Pink
    "--color-background-pink": [formatOklchAlpha(light.pink, 0.12), formatOklchAlpha(dark.pink, 0.15)],
    "--color-border-pink": [formatOklch(light.pink), formatOklch(dark.pink)],
    "--color-icon-pink": [formatOklch(light.pink), formatOklch(dark.pink)],
    "--color-text-pink": [formatOklch(light.pink), formatOklch(dark.pink)],

    // Categorical Colors — Purple
    "--color-background-purple": [formatOklchAlpha(light.mauve, 0.12), formatOklchAlpha(dark.mauve, 0.15)],
    "--color-border-purple": [formatOklch(light.mauve), formatOklch(dark.mauve)],
    "--color-icon-purple": [formatOklch(light.mauve), formatOklch(dark.mauve)],
    "--color-text-purple": [formatOklch(light.mauve), formatOklch(dark.mauve)],

    // Categorical Colors — Red
    "--color-background-red": [formatOklchAlpha(light.red, 0.12), formatOklchAlpha(dark.red, 0.15)],
    "--color-border-red": [formatOklch(light.red), formatOklch(dark.red)],
    "--color-icon-red": [formatOklch(light.red), formatOklch(dark.red)],
    "--color-text-red": [formatOklch(light.red), formatOklch(dark.red)],

    // Categorical Colors — Teal
    "--color-background-teal": [formatOklchAlpha(light.teal, 0.12), formatOklchAlpha(dark.teal, 0.15)],
    "--color-border-teal": [formatOklch(light.teal), formatOklch(dark.teal)],
    "--color-icon-teal": [formatOklch(light.teal), formatOklch(dark.teal)],
    "--color-text-teal": [formatOklch(light.teal), formatOklch(dark.teal)],

    // Categorical Colors — Yellow
    "--color-background-yellow": [formatOklchAlpha(light.yellow, 0.12), formatOklchAlpha(dark.yellow, 0.15)],
    "--color-border-yellow": [formatOklch(light.yellow), formatOklch(dark.yellow)],
    "--color-icon-yellow": [formatOklch(light.yellow), formatOklch(dark.yellow)],
    "--color-text-yellow": [formatOklch(light.yellow), formatOklch(dark.yellow)],
  },
});
