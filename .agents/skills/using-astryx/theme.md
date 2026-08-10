# Theme Setup in Astryx (Matcha Theme)

## Overview

In this application, we use the official **Matcha Theme** (`@astryxdesign/theme-matcha`) as our primary design system theme. We do not author custom themes or use `defineTheme`. All theming is handled via the `<Theme>` provider and `@astryxdesign/theme-matcha`.

---

## 1. Matcha Theme Provider Setup

### Production / Built Import (Recommended)

Use the pre-compiled `/built` theme import for zero-runtime CSS on first paint:

```tsx
import { Theme } from "@astryxdesign/core";
import { matchaTheme } from "@astryxdesign/theme-matcha/built";
import "@astryxdesign/theme-matcha/theme.css";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <Theme theme={matchaTheme} mode="system">
      {children}
    </Theme>
  );
}
```

### Runtime Import (Development fallback)

```tsx
import { Theme } from "@astryxdesign/core";
import { matchaTheme } from "@astryxdesign/theme-matcha";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <Theme theme={matchaTheme} mode="system">
      {children}
    </Theme>
  );
}
```

---

## 2. Light / Dark Mode Handling

- Matcha theme tokens automatically support light/dark modes using CSS `light-dark()` tuples.
- `mode="system"` automatically syncs with the user's OS color scheme.
- The root `<Theme>` provider binds `data-theme="light|dark"` and `color-scheme` to the `<html>` root for modals, dialogs, and portal rendering.
- **Do not run a second unsynchronized dark mode provider** (e.g. custom dark mode state managers) that conflicts with `<Theme>`.

---

## 3. Inspected Theme State (`useTheme` Hook)

Use the read-only `useTheme()` hook inside React components to inspect the current active mode (`light` | `dark`) or resolved tokens when needed for non-CSS APIs (such as charts or canvas contexts):

```tsx
import { useTheme } from "@astryxdesign/core/theme";

export function ThemeStatus() {
  const { mode, tokens } = useTheme();
  return <span>Active Mode: {mode}</span>;
}
```

---

## Core Rules & Constraints

1. **Use Matcha Theme directly**: Always import `matchaTheme` from `@astryxdesign/theme-matcha/built` (or `@astryxdesign/theme-matcha`).
2. **No `defineTheme` or custom theme building**: Do not create custom theme objects or run `astryx theme build`.
3. **No manual dark mode classes**: Let `<Theme mode="system" />` or `<Theme mode="dark" />` own color mode switching on the `<html>` element.
