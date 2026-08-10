# Styling Components in Astryx with StyleX

## Overview: StyleX First Strategy

In this application, **StyleX** is our primary, idiomatic styling mechanism for overrides, component layouts, and custom wrapper styling. All StyleX styles resolve to Astryx's design tokens (`var(--color-*)`, `var(--spacing-*)`, `var(--radius-*)`, etc.), ensuring full support for dynamic themes and dark mode.

---

## Direct Component Usage (No Swizzling)

All Astryx components must be imported directly from `@astryxdesign/core`:

```tsx
import { Button, Card, Dialog, Layout, Heading } from "@astryxdesign/core";
```

We **do not swizzle or eject** component source code (`astryx swizzle <Name>`). Component customization is strictly achieved through:

1. **Component Props & Variants** (`variant`, `size`, `density`, etc.).
2. **`xstyle` Prop** for StyleX overrides directly on `@astryxdesign/core` components.
3. **Compound Composition** (passing sub-components into slot props).
4. **StyleX Layout Wrappers** (`<div {...stylex.props(...)}>` wrapping components).

---

## What NOT to Do (Styling Anti-Patterns)

| Guidance  | Practices to Avoid                                                                  | StyleX / Astryx Alternative                                                                                                                              |
| :-------- | :---------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Don't** | `style={{...}}` on raw `<div>` wrappers.                                            | Use StyleX on wrapper elements: `<div {...stylex.props(styles.wrapper)}>` or use `xstyle` on the component directly.                                     |
| **Don't** | Hardcoded colors (`#fff`, `rgb(...)`).                                              | Use design tokens or typed token exports (`colorVars['--color-background-surface']`).                                                                    |
| **Don't** | Hardcoded spacing (`16px`, `1rem`).                                                 | Use spacing tokens or typed token exports (`spacingVars['--spacing-4']`).                                                                                |
| **Don't** | Wrapping a component in a `<div>` just to add margin.                               | Use `xstyle` with `stylex.create()` directly on the component (`xstyle={styles.componentMargin}`).                                                       |
| **Don't** | Using `!important`.                                                                 | Check selector specificity; `xstyle` compiles to CSS classes that are merged last.                                                                       |
| **Don't** | Token resolver APIs (`useTheme()` / `resolveThemeTokens`) for standard DOM styling. | Reserve token resolver APIs strictly for non-CSS JavaScript consumers (canvas, charts, SVG attributes). Use CSS variables/StyleX tokens for DOM styling. |

---

## 1. StyleX (`xstyle` Prop) & Typed Token Imports

Every Astryx component accepts an `xstyle` prop for fine-grained style overrides compiled at build time.

### Prefer Typed StyleX Tokens:

For autocomplete and catching token-name typos, import typed tokens from `@astryxdesign/core/theme/tokens.stylex`:

```tsx
import * as stylex from '@stylexjs/stylex';
import { colorVars, spacingVars, radiusVars } from '@astryxdesign/core/theme/tokens.stylex';
import { Button, Card } from '@astryxdesign/core';

const styles = stylex.create({
  card: {
    maxWidth: 400,
    backgroundColor: colorVars['--color-background-surface'],
    color: colorVars['--color-text-primary'],
    padding: spacingVars['--spacing-4'],
    borderRadius: radiusVars['--radius-container'],
    boxShadow: {
      default: 'none',
      ':hover': {
        '@media (hover: hover)': '0 4px 12px rgba(0,0,0,0.1)'
      },
    },
  },
  saveButton: {
    alignSelf: 'flex-end',
  },
});

<Card xstyle={styles.card} />
<Button label="Save" xstyle={styles.saveButton} />
```

### Core Rules:

1. **Always use `stylex.create()`**: Pass objects created via `stylex.create()`. Never pass inline style objects (`style={{...}}`) or string class names to `xstyle`.
2. **Hover Guard Requirement**: ALL `:hover` styles written in `stylex.create` **MUST** be wrapped inside a `@media (hover: hover)` media query to avoid broken sticky hover states on mobile/touch screens.
3. **Typed Token Imports**: Prefer `colorVars`, `spacingVars`, `radiusVars` from `@astryxdesign/core/theme/tokens.stylex` over raw strings when writing StyleX rules.

---

## 2. StyleX Wrapper Layouts

Instead of utility classes or raw HTML styling, define layout containers (flexbox, grid, spacing, alignment) using StyleX on custom wrapper elements:

```tsx
import * as stylex from "@stylexjs/stylex";
import { colorVars, spacingVars, radiusVars } from "@astryxdesign/core/theme/tokens.stylex";
import { Button } from "@astryxdesign/core";

const styles = stylex.create({
  rowWrapper: {
    display: "flex",
    gap: spacingVars["--spacing-3"],
    padding: spacingVars["--spacing-4"],
    backgroundColor: colorVars["--color-background-surface"],
    borderRadius: radiusVars["--radius-container"],
    alignItems: "center",
  },
});

export function ActionRow() {
  return (
    <div {...stylex.props(styles.rowWrapper)}>
      <Button label="Save" variant="primary" />
      <Button label="Cancel" variant="secondary" />
    </div>
  );
}
```

---

## 3. Compound Component Styling Pattern

Complex Astryx components (e.g., `Dialog`, `AppShell`, `Table`) are built from smaller sub-components exported from `@astryxdesign/core`.

- **No deep prop drilling**: Each sub-part accepts its own `xstyle` prop directly.
- Style each sub-component where it is instantiated:

```tsx
import * as stylex from "@stylexjs/stylex";
import { spacingVars } from "@astryxdesign/core/theme/tokens.stylex";
import {
  Dialog,
  Layout,
  LayoutHeader,
  LayoutContent,
  LayoutFooter,
  Heading,
  TextInput,
  Button,
} from "@astryxdesign/core";

const styles = stylex.create({
  dialog: { maxWidth: 500 },
  content: { gap: spacingVars["--spacing-4"] },
});

<Dialog isOpen={isOpen} onClose={close} xstyle={styles.dialog}>
  <Layout
    header={
      <LayoutHeader hasDivider>
        <Heading level={2}>Edit Profile</Heading>
      </LayoutHeader>
    }
    content={
      <LayoutContent xstyle={styles.content}>
        <TextInput label="Name" value={name} onChange={setName} />
      </LayoutContent>
    }
    footer={
      <LayoutFooter hasDivider>
        <Button label="Cancel" variant="secondary" onClick={close} />
        <Button label="Save" variant="primary" onClick={save} />
      </LayoutFooter>
    }
  />
</Dialog>;
```

---

## 4. Non-CSS Processing (Charts, Canvas, Non-DOM APIs)

Use token resolver APIs **only** when non-CSS APIs require string token values in JavaScript (e.g., Canvas contexts, third-party chart configuration, SVG attributes where CSS variables are unavailable):

### Inside React Components (`useTheme()`):

```tsx
import { useMemo } from "react";
import { useTheme } from "@astryxdesign/core/theme";

function AnalyticsChart({ data }: { data: Array<{ x: string; y: number }> }) {
  const { mode, tokens } = useTheme();

  const chartOptions = useMemo(
    () => ({
      mode,
      textColor: tokens["--color-text-primary"],
      mutedTextColor: tokens["--color-text-secondary"],
      gridColor: tokens["--color-border"],
      seriesColors: [tokens["--color-data-categorical-blue"], tokens["--color-data-categorical-orange"]],
    }),
    [mode, tokens],
  );

  return <ThirdPartyChart data={data} options={chartOptions} />;
}
```

---

## 5. CSS Selectors & Data Attributes Surface

When targeting Astryx components with CSS outside of React props, combine base classes with `data-*` attributes:

```css
/* ✅ Preferred Surface */
.my-app .astryx-button[data-variant="primary"] { ... }
.my-app .astryx-button[data-variant="primary"][data-size="sm"] { ... }
.my-app .astryx-heading[data-level="2"] { ... }

/* ❌ DEPRECATED: Do not write new CSS against bare classes (.primary, .sm, .level-2) */
.my-app .astryx-button.primary { ... }
```

---

## 6. Rest Props & Ref Forwarding

- **HTML Attribute Passthrough**: All Astryx components automatically spread rest props onto their root DOM node (`data-testid`, `aria-*`, `onMouseEnter`, `onClick`, etc.).
- **Ref Forwarding**: All components forward React refs to their underlying root DOM element (`ref={cardRef}`).
