# Icon Foundations & Usage in Astryx

## Core Icon Philosophy

Icons in Astryx are specified via **`IconType`**:

1. **Semantic Icon Names**: Standardized string identifiers (e.g. `'close'`, `'search'`, `'chevronDown'`) resolved through the active theme's icon registry.
2. **Direct SVG Components**: Third-party SVG icon components (from `lucide-react`, `@heroicons/react`, custom SVGs, etc.).

All icons inherit size (`size="sm | md | lg"`) and color token styling automatically when rendered inside `<Icon />` or passed to component icon props.

---

## 1. Semantic Icon Registry

Use semantic icon names wherever supported to remain theme-agnostic:

| Category        | Semantic Name                                            | Typical Usage                               |
| :-------------- | :------------------------------------------------------- | :------------------------------------------ |
| **Navigation**  | `'chevronDown'`, `'chevronLeft'`, `'chevronRight'`       | Dropdowns, accordions, back/next            |
|                 | `'chevronsLeft'`, `'chevronsRight'`                      | Jump to start/end, pagination               |
|                 | `'menu'`                                                 | Navigation toggle / hamburger menu          |
|                 | `'externalLink'`                                         | Links opening in a new tab                  |
| **Actions**     | `'search'`                                               | Search input triggers / search bars         |
|                 | `'close'`                                                | Dismissing modals, tags, alerts             |
|                 | `'copy'`, `'checkDouble'`                                | Copy to clipboard, copied confirmation      |
|                 | `'funnel'`, `'viewColumns'`                              | Filter controls, column visibility settings |
|                 | `'arrowUp'`, `'arrowDown'`, `'arrowsUpDown'`             | Column sorting, reordering                  |
|                 | `'moreHorizontal'`                                       | Overflow menu / action dots                 |
|                 | `'eyeSlash'`                                             | Password/field visibility toggle            |
|                 | `'stop'`, `'wrench'`, `'microphone'`                     | Action controls, settings, voice input      |
| **Status**      | `'check'`, `'success'`, `'error'`, `'warning'`, `'info'` | Indicators, alerts, notification badges     |
| **Date & Time** | `'calendar'`, `'clock'`                                  | Date/time pickers, timestamps               |

---

## 2. Using Custom SVG Icons (`lucide-react` / Custom SVGs)

For icons outside the semantic list, pass an SVG component directly into the `icon` prop. The `<Icon />` wrapper applies sizing and theme color props automatically:

```tsx
import { Icon } from "@astryxdesign/core";
import { Heart, Photo, Share2 } from "lucide-react";

export function MediaCardActions() {
  return (
    <>
      <Icon icon={Photo} size="lg" />
      <Icon icon={Heart} color="accent" />
      <Icon icon={Share2} size="md" />
    </>
  );
}
```

---

## Do's and Don'ts Matrix

| Guidance            | DO                                                                                | DON'T                                                                              |
| :------------------ | :-------------------------------------------------------------------------------- | :--------------------------------------------------------------------------------- |
| **Semantic Names**  | Use string names (`'search'`, `'close'`, `'chevronDown'`) for system UI controls. | Import manual SVG files for standard UI actions already in the registry.           |
| **Sizing & Colors** | Use `size` (`sm                                                                   | md                                                                                 | lg`) and `color` (`accent | primary | negative`) props on `<Icon />`. | Hardcode inline `width={16}` or `fill="#fff"` on raw SVG elements. |
| **Custom Icons**    | Pass Lucide/Heroicon components directly into the `icon` prop (`icon={Heart}`).   | Wrap third-party SVG components in custom manual `<div>` wrappers just for sizing. |
