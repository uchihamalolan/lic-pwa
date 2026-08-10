# Frame-First Application Layout Architecture in Astryx

## Core Philosophy: Frame-First Design

- **Build Top-Down**: Decide the app layout shell, name its regions, and give each region an explicit pixel budget BEFORE adding content.
- **Avoid "Card Soup"**: Never wrap every section or list item in a `Card`. Content-first card wrapping creates a padded scroll column that feels like a prototype, not a real product.

---

## Region Pixel Budget Guidelines

When planning layout regions, use these established pixel bounds:

- **Side Navigation (`SideNav`)**: `240px – 280px`
- **Icon Rail**: `64px – 72px`
- **Detail / Inspector Panel (`LayoutPanel`)**: `340px – 420px`
- **Filter / Facet Rail**: `220px – 260px`

---

## App Archetypes & Container Policies

| App Archetype                                        | Frame Strategy                                                | Container Policy                                                           |
| :--------------------------------------------------- | :------------------------------------------------------------ | :------------------------------------------------------------------------- |
| **Tracker / Work Tool** (Issues, Claims, CRM)        | `AppShell` + `SideNav`; Inspector `LayoutPanel` on row select | **Rows only**. Grouped edge-to-edge lists/tables. Zero cards.              |
| **Console / Observability** (Metrics, Logs, Deploys) | `AppShell` + `SideNav` or `TopNav` + `TabList`                | Card grid for dashboard widgets; `Table` for everything else.              |
| **Messaging / Feed**                                 | Multi-column frame: Rail + Sidebar + Stream + Inspector       | Rows and message bubbles. No cards in the stream.                          |
| **Media Library / Gallery**                          | `AppShell` + `TopNav`; Grid content                           | `ClickableCard` grid, with dense metadata rows in details.                 |
| **Settings / Forms**                                 | `AppShell` + `SideNav` or Settings template                   | `FormLayout` sections. `Card` reserved only for dangerous/billing actions. |

---

## Cards vs. Rows Rules

### DOs:

- **`Card` is a widget container**, reserved for self-contained UI units (KPI tiles, chart panels, galleries, settings groups).
- **Dense Data** (items users scan, filter, or select) belongs in edge-to-edge rows using:
  - **`Table`** for columnar data (with selection/sorting plugins).
  - **`List` / `Item`** for scannable single-line records (32px–40px row height).
- Use **`EmptyState`** inside a region when a filter/search matches no records.
- Use **`StatusDot`** or **`Token`** for status and metadata; reserve **`Badge`** strictly for numeric counts and enumerated states.

### DONTs:

- Do NOT wrap individual list items or table records in a `Card`.
- Do NOT stack full-width `Card` components as a replacement for proper layout/page structure.
- Do NOT nest `Card` inside `Card`.
- Do NOT use `Badge` as plain decoration.

---

## Master-Detail Inspectors (`LayoutPanel`)

- Use **`LayoutPanel`** in the end slot with explicit width budgets (`width={380}`) for inspector views when a row is selected, rather than navigating away.
- Enable `resizable` with min/max pixel bounds (`minSizePx: 320, maxSizePx: 480, autoSaveId: 'inspector'`).
- Make the panel overlay the content region on smaller screens instead of squishing it.

```tsx
// Inspector that overlays at narrow widths
<LayoutPanel
  width={380}
  hasDivider
  isScrollable
  label="Details"
  resizable={{ minSizePx: 320, maxSizePx: 480, autoSaveId: "inspector" }}
>
  {selected ? <DetailFields item={selected} /> : <EmptyState title="Nothing selected" />}
</LayoutPanel>
```

---

## Responsive Contract

Declare breakpoint behavior as an explicit contract comment at the root of the frame:

```tsx
// Responsive contract:
//   > 1024px  nav 256 | content | inspector 380
//   <= 1024px inspector overlays content (position: absolute, end-aligned)
//   <= 768px  nav collapses into MobileNav drawer; toolbar actions wrap
```
