# Project Learning Log (`lic-pwa`)

This file is an open chronological log recording past mistakes, missteps, corrections, and key takeaways to avoid repeating them.

---

### [2026-08-10] Running `lefthook` directly during verification

- **Mistake**: Ran `pnpm exec lefthook run pre-commit` to verify code formatting and linting.
- **Why it was wrong**: Unnecessary execution of full pre-commit hook runner during turn-by-turn verification.
- **Correct Behavior**: For verification after making code changes, run `pnpm run lint` and `pnpm run fmt` directly. Do not invoke `pnpm exec lefthook`.

---

### [2026-08-10] Redundant CSS theme imports in TypeScript components

- **Mistake**: Imported `import "@astryxdesign/theme-matcha/theme.css";` in `src/app-provider.tsx`.
- **Why it was wrong**: `@astryxdesign/theme-matcha/theme.css` is already imported globally in `src/index.css`. Re-importing theme CSS inside TypeScript components adds redundant import statements.
- **Correct Behavior**: Never import theme `.css` files in TypeScript components when they are already declared at the global stylesheet level (`index.css`).

---

### [2026-08-10] Making architectural decisions/reversions without asking the user

- **Mistake**: Unilaterally reverted from CSF Next back to CSF 3 instead of explaining the TypeScript error and giving the user the choice to debug CSF Next or switch.
- **Why it was wrong**: Presumptuous decision-making. As pair programmer, I must report errors/root causes to the user and let them decide how to proceed.
- **Correct Behavior**: Always present the technical root cause and options to the user first. Let the user call the shots.

---

### [2026-08-10] Reverting user dependency choices in `package.json`

- **Mistake**: Overwrote `package.json` with an outdated file snapshot that accidentally replaced `lefthook` back with `husky`.
- **Why it was wrong**: Carelessly wiped out user-configured dependency changes (`lefthook`) during a subsequent edit.
- **Correct Behavior**: Always inspect existing file contents or git diff before overwriting `package.json` to ensure user configuration choices are strictly preserved.

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
