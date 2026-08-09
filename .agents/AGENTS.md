<!-- ASTRYX:START -->

Astryx v0.3.0 · 155 components
CLI: run every command as `astryx <cmd>` (shown below as `astryx ...`).

### WORKFLOW — discover, don't guess. Before writing UI:

1. `astryx build "<idea>"` — START HERE: returns a kit (closest [page] + [block]s + [component]s). No args = full playbook.
2. `astryx template <name> [--skeleton]` — scaffold the [page]/[block]s it named, or study their layout. Templates are reference code.
3. `astryx component <Name>` — props + examples for every component you use.

### RULES:

- No <div> — components do all layout/spacing. Full page → AppShell; sidebar nav → SideNav.
- Frame first: pick the shell (AppShell / Layout+LayoutPanel) and budget regions in px BEFORE writing content (`astryx docs layout`).
- Dense data = rows (Table, List/Item) edge-to-edge — never Card-wrapped list items. Card = dashboard widgets, galleries, settings groups only.
- Status → StatusDot/Token; Badge only for counts and enumerated states, never decoration.
- Custom styling: component props first; else style/className with tokens — var(--color-_|--spacing-_|--radius-*). No raw hex/px. (No StyleX/Tailwind compiler here — don't use xstyle/utility classes.)
- Tokens for every value (`astryx docs tokens`). Brand/accent via `astryx theme` — never override --color-* in :root.
- SELF-CHECK before you finish: re-read the file and replace any raw <div>/<span> layout, imported .css/@apply, or hardcoded value (#hex, 16px) with the component or a token (var(--color-_|--spacing-_|…)). If unsure a component/prop exists, run `astryx component <Name>` / `astryx search "<thing>"`; don't hand-roll CSS.

### The --dense Flag

Every CLI command supports --dense, which outputs a token-efficient format designed for AI context windows. Use it when pasting CLI output into a web-based AI tool like ChatGPT or Claude.

Dense output for pasting into AI conversations

```bash
astryx component Dialog --dense
astryx docs styling --dense
astryx docs tokens --dense
```

### MCP Server

Astryx ships a Model Context Protocol (MCP) server that any MCP-compatible AI tool can connect to. Instead of manually pasting CLI output, the AI can query the Astryx design system directly, searching for components, reading full documentation, and pulling code examples on demand.

You can check the MCP config in `.agents/mcp_config.json`

The MCP server exposes two tools:

1. search(query) for discovering components, doc topics, and templates;
2. get(name) for retrieving full documentation with props, usage, and examples.

### MORE CLI:

`search "<query>"` -> find any component / hook / doc / template / block
`component --list` -> 155 components by category
`template --list` -> page + block recipes
`docs <topic>` -> color, elevation, icons, illustrations, internationalization, layout, migration, motion, principles, shape, spacing, styling, theme, tokens, typography
`upgrade --apply` -> run after any @astryxdesign/core bump
<!-- ASTRYX:END -->
