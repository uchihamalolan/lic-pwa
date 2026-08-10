# Color Foundations & Tokens in Astryx

## Core Color Philosophy

Colors in Astryx are **semantic**: token names describe visual purpose (e.g. `--color-background-surface`, `--color-text-primary`), **never appearance** (e.g. green, blue, #ffffff).

- Every color adapts automatically between light and dark modes via CSS `light-dark()`.
- Theme definitions (such as `matchaTheme`) override resolved values under the hood.
- **Never write raw hex/rgb values** (`#fff`, `rgb(...)`) in application code.

---

## Surface Color Hierarchy

Surfaces follow an explicit, layered visual depth hierarchy where each level sits visually above the previous one:

$$\text{Body} \longrightarrow \text{Surface} \longrightarrow \text{Card} \longrightarrow \text{Popover}$$

- **Body**: Root page canvas (`colorVars['--color-background-body']`)
- **Surface**: Primary content containers and layout panels (`colorVars['--color-background-surface']`)
- **Card**: Standalone card widgets / interactive tiles (`colorVars['--color-background-card']`)
- **Popover**: Floating dialogs, menus, overlays (`colorVars['--color-background-popover']`)

---

## StyleX Usage with Color Tokens

Always reference color tokens via typed StyleX token imports (`colorVars` from `@astryxdesign/core/theme/tokens.stylex`):

```tsx
import * as stylex from "@stylexjs/stylex";
import { colorVars } from "@astryxdesign/core/theme/tokens.stylex";

const styles = stylex.create({
  container: {
    backgroundColor: colorVars["--color-background-surface"],
    color: colorVars["--color-text-primary"],
    borderColor: colorVars["--color-border"],
  },
  accentText: {
    color: colorVars["--color-text-accent"],
  },
});
```

---

## Do's and Don'ts Matrix

| Guidance             | DO                                                                                             | DON'T                                                               |
| :------------------- | :--------------------------------------------------------------------------------------------- | :------------------------------------------------------------------ |
| **Token Selection**  | Use semantic tokens (`--color-text-primary`, `--color-text-secondary`) by purpose.             | Hardcode hex colors (`#ffffff`, `#1a1a1a`), which breaks dark mode. |
| **Surface Layering** | Follow the strict surface hierarchy (`body` $\to$ `surface` $\to$ `card` $\to$ `popover`).     | Randomly nest surface types or mix card backgrounds on popovers.    |
| **Status Colors**    | Use status tokens (`success`, `error`, `warning`, `info`) strictly for their semantic meaning. | Use status colors as decorative brand accents.                      |
| **Accent Text/Bg**   | Match text and background pairs (`colorVars['--color-text-accent']`).                          | Use `--color-on-accent` on non-accent backgrounds.                  |
