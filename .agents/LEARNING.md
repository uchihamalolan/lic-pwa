# Project Learning Log (`lic-pwa`)

This file is an open chronological log recording past mistakes, missteps, corrections, and key takeaways to avoid repeating them.

---

### [2026-08-10] Unnecessary StyleX code (`minHeight`, `padding`, `maxWidth` wrappers)

- **Mistake**: Authored redundant StyleX rules:
  ```ts
  const styles = stylex.create({
    center: {
      padding: spacingVars["--spacing-6"],
      minHeight: "60vh",
    },
    actionWrapper: {
      maxWidth: 320,
      width: "100%",
    },
  });
  ```
- **Why it was wrong**: Hand-rolled arbitrary layout CSS (`minHeight: "60vh"`, manual padding, wrapper `<div>`s for width constraints) when Astryx layout primitives (`<Center>`, `<Stack gap={3}>`) already handle centering, spacing, and responsive layout natively.
- **Correct Behavior**: Trust Astryx primitives. Do not author custom StyleX objects unless standard props/primitives are genuinely incapable of meeting the layout requirement.

---

### [2026-08-10] Big-picture upfront UI dumping

- **Mistake**: Attempted to design, propose, and ask for approval on the entire app's views, modals, drawers, and full UI architecture in a single massive response.
- **Why it was wrong**: Overwhelming and bad pair programming. You cannot inspect or review all screens at once.
- **Correct Behavior**: Focus strictly on **ONE view, modal, or component at a time**. Get feedback, refine, and lock it in before moving to the next item.

---

### [2026-08-10] Adding image illustrations & marketing frills

- **Mistake**: Generated an AI illustration (`empty-state.jpg`) and added it to the empty state onboarding screen.
- **Why it was wrong**: This is an internal operational utility tool. Marketing fluff, decorative illustrations, and extra image assets are unwanted overhead.
- **Correct Behavior**: Keep UI lean, minimal, dense, fast, and straight to the point without decorative graphics.

---

### [2026-08-10] Unnecessary `<div>` wrapper

- **Mistake**: Wrapped `<Center>` in a `<div {...stylex.props(...)}>`.
- **Why it was wrong**: Violated Astryx rules against extra `<div>` layout wrappers.
- **Correct Behavior**: Rely on native Astryx layout primitives directly without wrapping them in extra `<div>`s.

---

### [2026-08-10] JSDoc comments in source code

- **Mistake**: Added `/** ... */` JSDoc comments above functions in `src/store/db.ts`.
- **Why it was wrong**: Adds comment clutter to self-explanatory TypeScript code.
- **Correct Behavior**: Write clean TypeScript code with zero JSDoc blocks unless explicitly requested.
