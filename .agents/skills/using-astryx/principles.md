# Core Principles & Anti-Patterns in Astryx

## Core Design Philosophy
- **Components over Primitives**: Always use Astryx UI components for everything they cover before reaching for raw HTML elements (`<div>`, `<span>`, `<button>`, etc.).
- **No Swizzled Components**: Use Astryx components directly from `@astryxdesign/core`. Do NOT swizzle (`astryx swizzle <Name>`) or copy internal component code into the application tree. Customize via props, compound composition, and `xstyle`.
- **Semantic Tokens over Hardcoded Values**: Colors, spacing, radii, typography, and shadows are named by purpose, not appearance.
- **Theme-Agnostic Code**: Never hardcode colors or pixel values in application code so themes and dark mode work automatically without extra code.
- **Open Internals**: Every primitive in Astryx is exported and composable, allowing custom builds on top of primitives without fighting the system.

---

## Core Rules

1. **Use components for everything they cover**: Never build custom basic wrappers or native controls if Astryx provides a component for it.
2. **No component swizzling**: Import components directly from `@astryxdesign/core`. Never eject/swizzle source code into the project.
3. **Layout is frame-first**: Choose the shell (`AppShell`, `Layout`, `LayoutPanel`) and budget region sizes in px before writing content.
4. **Dense data renders as rows**:
   - Columnar data -> `Table` (edge-to-edge with dividers).
   - Scannable single-line records -> `List` / `Item`.
   - `Card` is reserved for standalone widgets, KPI tiles, galleries, and settings groups only.
5. **StyleX for custom styling**: All custom styling and overrides use StyleX via `stylex.create()` and the `xstyle` prop (or `{...stylex.props(...)}` on wrappers).
6. **Semantic tokens, not hardcoded values**: Always leverage CSS custom properties (`var(--color-*)`, `var(--spacing-*)`) instead of raw hex values (`#ffffff`) or pixel values (`16px`).
7. **Form inputs are controlled**: Inputs must always be controlled with `value` + `onChange`.
8. **Use `useLinkComponent()` for navigation**: Never use raw `<a>` tags for internal app navigation. Use `useLinkComponent()` so framework routers can be injected seamlessly via `LinkProvider`.

---

## Anti-Patterns ("Don'ts")

| Guidance | Practice to Avoid | Correct Astryx Alternative |
| :--- | :--- | :--- |
| **Don't** | Swizzling component source code (`astryx swizzle <Name>`). | Import directly from `@astryxdesign/core`; customize via props, compound composition, and `xstyle`. |
| **Don't** | Inline `style={{...}}` on raw elements. | Use StyleX (`xstyle` prop or `{...stylex.props(...)}`). |
| **Don't** | Hardcoded color values (`#ffffff`, `#1a1a1a`). | Use CSS design token properties (`var(--color-background-surface)`, `var(--color-text-primary)`). |
| **Don't** | Hardcoded spacing values (`16px`). | Use spacing tokens (`var(--spacing-4)`). |
| **Don't** | Hardcoded `<a>` elements for router navigation. | Use `useLinkComponent()` so consumers can swap in framework routers via `LinkProvider`. |
| **Don't** | Wrapping every list item or section in a `Card` ("Card soup"). | Frame-first layout; dense data renders in edge-to-edge rows (`Table` or `List`/`Item`). |
| **Don't** | Using `Badge` as plain visual decoration. | Reserve `Badge` for counts and enumerated states; use `StatusDot` or `Token` for status and metadata. |
| **Don't** | Inventing unbacked component props. | Always check component docs or CLI metadata (`astryx component <Name>`) before usage. |
