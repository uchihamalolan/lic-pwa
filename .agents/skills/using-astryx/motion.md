# Motion Foundations & Motion Tokens in Astryx

## Core Philosophy: Purposeful Motion

Motion in Astryx serves to **reduce cognitive load** and provide feedback on layout state changes:

1. Helps the eye track what changed (panels opening, dialogs presenting).
2. Establishes visual craft without standing between the user and their next action.
3. **Never blocks interaction**: Users must be able to interact immediately without waiting for animations to finish.

---

## Where Motion Helps vs. Where Motion Hurts

| Context                                            | Motion Behavior                                                    | Token Recommendation                                               |
| :------------------------------------------------- | :----------------------------------------------------------------- | :----------------------------------------------------------------- |
| **Panels & Dialogs**                               | Slide/fade entrance to orient layout shift. Exits match entrances. | `durationVars['--duration-medium']`, `easeVars['--ease-standard']` |
| **Toasts & Notifications**                         | Subtle entrance to draw eye without startling.                     | `durationVars['--duration-fast']`, `easeVars['--ease-standard']`   |
| **State Toggles**                                  | Brief transition for switches, checkboxes, tab selection.          | `durationVars['--duration-fast']`                                  |
| **High-Frequency Hovers** (Table rows, list items) | **Instant / zero perceivable delay**.                              | Instant or `--duration-fast` (never lag cursor).                   |
| **Dismissed UI** (Tooltips, dropdowns, popovers)   | **Instant exit** (user shifted attention).                         | Instant exit; no exit transition needed.                           |

---

## StyleX Integration (`durationVars` & `easeVars`)

Import duration and easing tokens from `@astryxdesign/core` inside `stylex.create()`:

```tsx
import * as stylex from "@stylexjs/stylex";
import { durationVars, easeVars } from "@astryxdesign/core";

const styles = stylex.create({
  fadeIn: {
    transitionProperty: "opacity",
    transitionDuration: durationVars["--duration-fast"],
    transitionTimingFunction: easeVars["--ease-standard"],
  },
  slideUp: {
    transitionProperty: "transform, opacity",
    transitionDuration: durationVars["--duration-medium"],
    transitionTimingFunction: easeVars["--ease-standard"],
  },
});
```

---

## Movement Principles & Accessibility

1. **Directional Continuity**:
   - Going deeper into content moves forward; going back returns.
   - Panel exiting to the right MUST match its entrance from the right.
2. **Contextual Anchoring**:
   - Dropdowns expand from their trigger button.
   - Popovers originate near their anchor element.
3. **OS Reduced Motion Support**:
   - Always respect `@media (prefers-reduced-motion: reduce)`. Replace sliding and complex transitions with instant state changes when enabled.

---

## Do's and Don'ts Matrix

| Guidance                 | DO                                               | DON'T                                                                                 |
| :----------------------- | :----------------------------------------------- | :------------------------------------------------------------------------------------ |
| **Interaction Latency**  | Keep high-frequency row/list hovers ultra-fast.  | Add slow hover transitions that make the UI feel like it's lagging behind the cursor. |
| **Interaction Blocking** | Allow clicks while transitions run.              | Block pointer events or clicks while an element finishes animating into place.        |
| **Exits**                | Allow Tooltips/Dropdowns to disappear instantly. | Force multi-stage exit animations on transient popovers the user has moved away from. |
| **Accessibility**        | Respect OS `prefers-reduced-motion`.             | Force heavy motion effects on users with reduced motion preferences enabled.          |
