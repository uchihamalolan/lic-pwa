# Elevation Foundations & Shadow Tokens in Astryx

## Core Philosophy: Elevation Encodes Stacking Depth

Elevation in Astryx creates visual depth through theme-aware box shadows (`shadowVars`). The level represents **how far a surface sits from the page canvas**, encoding visual stacking order rather than decorative shadow preference.

Shadow colors adapt automatically between light and dark modes via CSS `light-dark()`.

---

## The Graded Elevation Scale (`elevation` Prop)

Prefer using the native `elevation` prop on configurable surfaces (`Card`, `ClickableCard`, `Button`, `IconButton`, `Banner`, etc.) before writing custom StyleX shadows.

| Level | When to Use | Examples | Default Behaviors |
| :--- | :--- | :--- | :--- |
| **`none`** | Flat and embedded in the page surface. Not layered above content. | Standard `Card`, inline `Banner`, standard `Button`. | Default for almost ALL surfaces except `ChatComposer`. |
| **`low`** | In normal page flow, but distinct from the background for emphasis. | Raised `Card` for emphasis, `ChatComposer`. | Default for `ChatComposer` (set `elevation="none"` to flatten). |
| **`med`** | Floats over nearby content on the same page. | `Popover`, floating action `Button`, floating `Banner`. | Used when floating over local UI. |
| **`high`** | Topmost layer over the entire UI with backdrop/focus grab. | Modal `Dialog`, full-screen overlay. | Top-level overlays. |

### Intrinsic Overlays (No Prop Needed):
Components that are intrinsically overlays (`Dialog`, `Popover`, `Tooltip`, `Toast`, `DropdownMenu`) **bake their elevation in automatically** and do not expose an `elevation` prop.

```tsx
// Configurable surfaces expose the elevation prop:
<Card elevation="low">Raised card</Card>
<IconButton icon={<Icon icon="add" />} label="New" variant="primary" elevation="med" />
<ChatComposer elevation="none" onSubmit={handleSubmit} />
```

---

## Custom StyleX Shadow Usage (`shadowVars`)

When building a custom surface, read shadows from `shadowVars` (from `@astryxdesign/core`) instead of writing manual `box-shadow` strings:

```tsx
import * as stylex from '@stylexjs/stylex';
import { shadowVars } from '@astryxdesign/core';

const styles = stylex.create({
  dropdown: {
    boxShadow: shadowVars['--shadow-med'],
  },
  modal: {
    boxShadow: shadowVars['--shadow-high'],
  },
  focusedInputRing: {
    boxShadow: shadowVars['--shadow-inset-selected'],
  },
});
```

---

## Do's and Don'ts Matrix

| Guidance | DO | DON'T |
| :--- | :--- | :--- |
| **Prop Usage** | Use the `elevation` prop (`none \| low \| med \| high`) on supported components. | Hand-write raw `box-shadow: 0 4px 10px rgba(0,0,0,0.2)` strings in StyleX or CSS. |
| **Level Selection** | Base level on stacking order (`med`/`high` ONLY when overlapping content). | Set `med` or `high` on flat, non-overlapping page content just for decorative shadow. |
| **Focus Rings** | Use inset shadows (`shadowVars['--shadow-inset-selected']`) for focus/selection state rings on custom inputs. | Use drop shadows or outlines for input focus states. |
| **Border Replacement** | Use `--color-border` tokens for borders. | Use elevation shadows to emulate borders. |
| **Stacking** | Apply a single elevation level to a surface. | Combine multiple elevation levels or stack shadows on the same element. |
