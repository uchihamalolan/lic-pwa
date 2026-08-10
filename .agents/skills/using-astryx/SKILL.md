---
name: using-astryx
description: Use when creating React components or page layouts in lic-pwa with Astryx UI and StyleX.
---

# Using Astryx & StyleX in React SPA+PWA (`lic-pwa`)

This skill defines the idiomatic principles, rules, and layout constraints for building React SPA+PWA interfaces using **Astryx UI components** (`@astryxdesign/core`), **StyleX** (`@stylexjs/stylex`), and the **Themes** (`@astryxdesign/theme-{variant}`).

---

## 1. Core Workflow & Rules

1. **Direct Library Imports Only (No Swizzling)**:
   - Import components directly from `@astryxdesign/core`.
   - Never run `astryx swizzle <Name>` or eject component source code into the project.
2. **Components Over Primitives**:
   - Use Astryx UI components for everything they cover (`<Button>`, `<Card>`, `<Heading>`, `<Text>`, `<Input>`, `<Icon>`) before reaching for raw HTML elements (`<button>`, `<h1>`, `<span>`).
3. **No Raw HTML Layout Elements (`<div>`)**:
   - Layout and spacing must be handled by Astryx layout components (`<AppShell>`, `<Layout>`, `<LayoutPanel>`, `<Stack>`, `<Cluster>`, `<Grid>`, `<Center>`).
   - Use raw `<div>` with `{...stylex.props(...)}` ONLY when custom wrapper elements are strictly necessary.
4. **StyleX Exclusively for Custom Styling**:
   - Use StyleX (`stylex.create()`) via `xstyle` on Astryx components or `{...stylex.props(...)}` on wrappers.
   - Never use Tailwind classes or inline `style={{...}}` objects.
5. **Semantic Tokens Only**:
   - Always reference design tokens via typed imports from `@astryxdesign/core/theme/tokens.stylex` (`colorVars`, `spacingVars`, `radiusVars`, `fontVars`) or `shadowVars`.
   - Never hardcode raw hex colors (`#ffffff`), pixel spacings (`16px`), or font sizes.

---

## 2. Detailed References

For specific topics, refer to the following guide documents:

- **[Frame-First Layout](layout.md)**: Shell selection (`AppShell` vs `Layout`), region pixel budgeting, App Archetypes, dense data rows vs cards, and master-detail inspectors.
- **[Core Principles & Anti-Patterns](principles.md)**: Design philosophy, 8 core rules, and the complete Don'ts vs Astryx Alternatives matrix.
- **[StyleX & Component Styling](styling.md)**: `xstyle` usage, hover media guards `@media (hover: hover)`, compound component patterns, data-attribute CSS selectors, and non-CSS processing (`useTheme`).
- **[Theme](theme.md)**: Setting up `theme` from `@astryxdesign/theme-{variant}/built`, system light/dark mode handling, and `useTheme()`.
- **[Color Foundations](color.md)**: Semantic token philosophy and surface depth hierarchy ($\text{body} \to \text{surface} \to \text{card} \to \text{popover}$).
- **[Elevation & Shadows](elevation.md)**: Stacking depth hierarchy (`elevation="none | low | med | high"`) and `shadowVars`.
- **[Icon Usage](icons.md)**: Semantic icon registry names vs custom SVG components (`lucide-react`).
- **[Illustrations](illustrations.md)**: Sizing bounds (`120px – 240px`) and centering patterns for empty states/onboarding.
- **[Motion & Transitions](motion.md)**: Purposeful animation, fast vs medium duration tokens, directional continuity, and OS reduced motion.
- **[Shape & Radius Scale](shape.md)**: Border radius hierarchy (`--radius-element`, `--radius-container`, `--radius-full`) and concentric radius calculation.
- **[Spacing Foundations](spacing.md)**: 4px base-unit scale, component `gap` props, and `spacingVars`.
- **[Typography Foundations](typography.md)**: Geometric type scale, `<Heading>` display levels vs document outline, `<Text>` types, and 4px baseline grid alignment.

---

## 3. Completion Checklist / Self-Check

Before submitting or completing any UI component in `lic-pwa`:

- [ ] Are all components imported directly from `@astryxdesign/core` without swizzling?
- [ ] Is layout framed top-down (`AppShell` / `Layout`) before writing content?
- [ ] Are dense scannable data items rendered as rows (`Table` / `List`) instead of wrapped in `Card` ("card soup")?
- [ ] Are custom styles authored strictly using StyleX (`stylex.create()`) with typed tokens (`colorVars`, `spacingVars`, etc.)?
- [ ] Are `:hover` rules in `stylex.create()` protected by `@media (hover: hover)`?
- [ ] Are all headings built using `<Heading>` and all body/label text using `<Text>` without hardcoded font sizes or line heights?
- [ ] Is the app wrapped in `<Theme theme={matchaTheme} mode="system">`?
