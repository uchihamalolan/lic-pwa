# Typography Foundations & Usage in Astryx

## Core Philosophy: Semantic Geometric Type Scale

Typography in Astryx is built on a geometric type scale: $\text{base size} \times \text{ratio}^{\text{step}}$ (default: 14px base $\times$ 1.2 ratio).

- **Never set `fontSize` or `lineHeight` manually** in StyleX or inline styles.
- Components (`<Heading>`, `<Text>`) handle font size, weight, line height, and 4px baseline grid snapping automatically.
- Font roles: `body` (UI text), `heading` (titles), and `code` (monospace).

---

## 1. Document Headings & Display Text (`<Heading>`)

Use `<Heading>` for all titles and section headers. Maps to HTML `<h1>`–`<h6>` elements while binding semantic type scale tokens automatically:

```tsx
import { Heading } from '@astryxdesign/core';

// Document Outline Headings (Semantic h1, h2, h3):
<Heading level={1}>Page Title</Heading>
<Heading level={2}>Section Title</Heading>
<Heading level={3}>Subsection Title</Heading>

// Hero / Marketing / Data Callouts (Display Types):
// 'type' sets visual display styling; 'level' sets the HTML accessibility element
<Heading level={1} type="display-1">Hero Title</Heading>
<Heading level={2} type="display-2">$1.2M Total Claim Value</Heading>

// Decouple visual level from document outline for accessibility:
<Heading level={2} accessibilityLevel={3}>
  Sidebar Section Title
</Heading>
```

---

## 2. Body, Labels & Data Text (`<Text>`)

Use `<Text>` for all non-heading copy, form labels, metadata, captions, and code:

```tsx
import { Text } from '@astryxdesign/core';

<Text type="body">Base body copy text.</Text>
<Text type="large">Emphasized or intro body text.</Text>
<Text type="label">Form input label</Text>
<Text type="supporting">Helper text, timestamps, captions, metadata.</Text>
<Text type="code">{'const claimId = "POL-12345";'}</Text>

// Non-heading data callouts (without h1-h6 document outline semantics):
<Text type="display-2">$1.2M Total Claim Value</Text>
```

---

## 3. StyleX Typography Tokens (`fontVars`)

When typography MUST be applied inside a StyleX definition (such as custom canvas SVG text or pseudo-elements), reference typed tokens from `@astryxdesign/core/theme/tokens.stylex`:

```tsx
import * as stylex from "@stylexjs/stylex";
import { fontVars } from "@astryxdesign/core/theme/tokens.stylex";

const styles = stylex.create({
  customMonospace: {
    fontFamily: fontVars["--font-family-code"],
    fontWeight: fontVars["--font-weight-medium"],
  },
});
```

---

## Do's and Don'ts Matrix

| Guidance                    | DO                                                                                | DON'T                                                                         |
| :-------------------------- | :-------------------------------------------------------------------------------- | :---------------------------------------------------------------------------- |
| **Component Usage**         | Use `<Heading>` for document titles and `<Text>` for all UI copy.                 | Write raw `<h1-h6>` or `<p>` tags with custom font sizes.                     |
| **Font Size & Line Height** | Let Astryx components handle size, weight, and line-height grid alignment.        | Hand-write `fontSize: 18` or `lineHeight: '24px'` in StyleX or inline styles. |
| **Display Headings**        | Use `<Heading level={1} type="display-1">` for hero titles.                       | Use `type="display-1"` for standard in-page body sections.                    |
| **Accessibility Hierarchy** | Use `accessibilityLevel` when visual styling differs from document outline order. | Skip heading levels (e.g. `h1` directly to `h3`) in document structure.       |
| **Secondary Metadata**      | Use `<Text type="supporting">` for captions, timestamps, and helper text.         | Use reduced `opacity` or hardcoded grey colors on body text for captions.     |
| **Font Weights**            | Reference semantic weight tokens (`normal`, `medium`, `semibold`, `bold`).        | Hardcode raw numeric weights (`400`, `600`) in custom CSS.                    |
