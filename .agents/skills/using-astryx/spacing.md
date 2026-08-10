# Spacing Foundations & Tokens in Astryx

## Core Spacing Philosophy

The Astryx spacing scale is based on a **4px base unit** rhythm system:

- **Small-end control**: Fine-grained steps (`0.5` = 2px, `1` = 4px, `1.5` = 6px) for tight internal control spacing.
- **Section rhythm**: Multiples of 4px (`2` = 8px, `3` = 12px, `4` = 16px, `6` = 24px, `8` = 32px, `10` = 40px, `12` = 48px) for section and layout gaps.

---

## 1. Component `gap` Props (Preferred Method)

Always prefer using native layout component `gap` props (`<Stack gap={4}>`, `<Grid gap={3}>`, `<Cluster gap={2}>`) over manual margins. Component gap props accept numeric step values (0 through 12) that map directly to spacing tokens and handle layout spacing compensation automatically:

```tsx
import { Stack, Cluster } from "@astryxdesign/core";

export function ActionGroup() {
  return (
    <Stack direction="vertical" gap={4}>
      {" "}
      {/* 16px vertical gap */}
      <Cluster gap={2}>
        {" "}
        {/* 8px horizontal gap */}
        {/* Buttons */}
      </Cluster>
    </Stack>
  );
}
```

---

## 2. StyleX Spacing Tokens (`spacingVars`)

For custom layout wrappers or element padding/margins outside of component props, reference `spacingVars` from `@astryxdesign/core/theme/tokens.stylex`:

```tsx
import * as stylex from "@stylexjs/stylex";
import { spacingVars } from "@astryxdesign/core/theme/tokens.stylex";

const styles = stylex.create({
  container: {
    padding: spacingVars["--spacing-4"], // 16px
    gap: spacingVars["--spacing-3"], // 12px
    marginBottom: spacingVars["--spacing-6"], // 24px
  },
});
```

---

## Do's and Don'ts Matrix

| Guidance            | DO                                                                                          | DON'T                                                                       |
| :------------------ | :------------------------------------------------------------------------------------------ | :-------------------------------------------------------------------------- |
| **Component Gaps**  | Use component `gap` step props (`gap={4}`, `gap={2}`) on `Stack`/`Cluster`/`Grid`.          | Wrap elements in extra `<div>` elements just to add manual `margin-bottom`. |
| **Scale Adherence** | Stick to step values on the 4px scale (`0.5` through `12`).                                 | Use arbitrary pixel values (`13px`, `17px`, `23px`) outside the scale.      |
| **StyleX Spacing**  | Access tokens via `spacingVars['--spacing-4']` inside StyleX.                               | Hardcode `'16px'` or `'1rem'` strings in StyleX definitions.                |
| **Consistency**     | Use small steps (`0.5–2`) for tight control spacing, larger steps (`4–8`) for section gaps. | Mix raw `px`/`rem` values with spacing tokens in the same layout component. |
