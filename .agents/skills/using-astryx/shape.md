# Shape Foundations & Radius Tokens in Astryx

## Semantic Border Radius Hierarchy

The Astryx border radius scale (`radiusVars`) uses an explicit semantic hierarchy from sharp anchors to full pills:

$$\text{none} \longrightarrow \text{inner} \longrightarrow \text{element} \longrightarrow \text{container} \longrightarrow \text{page} \longrightarrow \text{full}$$

| Radius Token | Intended Usage & Scope | Typical Examples |
| :--- | :--- | :--- |
| **`--radius-none`** | Fixed sharp corner anchor (`0px`). | Flat cards, flush grid items. |
| **`--radius-inner`** | Nested elements inside padded containers. | Items inside padded cards/menus. |
| **`--radius-element`** | Interactive UI controls and input elements. | `Button`, `TextInput`, `Select`, `SegmentedControl`. |
| **`--radius-container`** | Standalone content containers & surfaces. | `Card`, `LayoutPanel`, `Dialog`, `Popover`. |
| **`--radius-page`** | Top-level page frame corners. | Page shell frame bounds. |
| **`--radius-full`** | Pill shapes (`9999px`). | `Badge`, `Chip`, `Avatar` status dots, pill buttons. |

---

## Concentric Radius Formula

When a rounded container has internal padding, nested inner elements require a smaller border radius to appear visually concentric:

$$\text{innerRadius} = \max(0\text{px}, \text{outerRadius} - \text{padding})$$

Astryx components (like `Card`) handle concentric radius calculations automatically:
```css
/* Calculated automatically inside Astryx Card */
--card-concentric-radius: max(0px, calc(var(--_card-radius) - var(--card-padding)));
```

---

## StyleX Usage with Radius Tokens

Reference radius tokens using typed StyleX token imports (`radiusVars` from `@astryxdesign/core/theme/tokens.stylex`):

```tsx
import * as stylex from '@stylexjs/stylex';
import { radiusVars } from '@astryxdesign/core/theme/tokens.stylex';

const styles = stylex.create({
  customCard: {
    borderRadius: radiusVars['--radius-container'],
  },
  customInput: {
    borderRadius: radiusVars['--radius-element'],
  },
  pillBadge: {
    borderRadius: radiusVars['--radius-full'],
  },
});
```

---

## Do's and Don'ts Matrix

| Guidance | DO | DON'T |
| :--- | :--- | :--- |
| **Interactive Controls** | Use `radiusVars['--radius-element']` for inputs, buttons, and form selectors. | Use `--radius-container` or `--radius-page` on individual form buttons. |
| **Content Surfaces** | Use `radiusVars['--radius-container']` for cards, dialogs, and panels. | Hardcode `borderRadius: 8` or `borderRadius: 12px` in StyleX. |
| **Pill Elements** | Use `radiusVars['--radius-full']` for badges, tags, and status dots. | Use `--radius-element` for pill-shaped badges. |
| **Page-Level Bounds** | Reserve `--radius-page` exclusively for top-level page shells. | Use `--radius-page` for small UI widgets or list items. |
