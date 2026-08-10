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

<!-- CODING_CONVENTIONS:START -->

## Project Conventions & Guidelines

Before writing code or designing UI components, ALWAYS review [LEARNING.md](file:///Users/malolan/Projects/lic-pwa/.agents/LEARNING.md) to recall past coding corrections and avoid repeating previous mistakes.

### Verification & Formatting Workflow

- **Linting & Formatting**: After making code edits, verify using `pnpm run lint` and `pnpm run fmt` directly. Do NOT run `pnpm exec lefthook` manually.

### File Naming

- **Strict Kebab-Case**: ALL files in the project (`components/`, `views/`, `hooks/`, `types/`, `store/`, `utils/`) MUST use **kebab-case** (e.g., `claims-table.tsx`, `agent-card.tsx`, `use-claims.ts`, `lic-parser.ts`).
- Do NOT use PascalCase (e.g. `ClaimsTable.tsx`) or camelCase for any source file names.

### Code Style & Comments

- **No JSDoc Comments**: NEVER write JSDoc comments (`/** ... */`), `@fileoverview` header blocks, or redundant type comments unless explicitly requested. Write clean, self-explanatory TypeScript code without comment clutter.

### Internal Tool Pragmatism

- **No Illustrations or Decorative Frills**: NEVER generate or add image illustrations, marketing hero cards, or decorative graphics. This is a functional internal utility tool — keep all UI minimal, dense, fast, and straight to the point.

### Communication Tone

- **Zero Fluff or Validation Statements**: Never use self-congratulatory or validating filler phrases (e.g., "rendering perfectly", "100% compliant", "looks awesome").
- **No Exclamation Points or Emotion**: Maintain a direct, neutral, matter-of-fact communication tone. Focus purely on technical facts and actions taken.

<!-- CODING_CONVENTIONS:END -->

<!-- STORYBOOK:START -->

When working on UI components, always use the `storybook` MCP tools to access Storybook's component and documentation knowledge before answering or taking any action.

- **CRITICAL: Never hallucinate component properties!** Before using ANY property on a component from a design system (including common-sounding ones like `shadow`, etc.), you MUST use the MCP tools to check if the property is actually documented for that component.
- Query `list-all-documentation` to get a list of all components
- Query `get-documentation` for that component to see all available properties and examples
- Only use properties that are explicitly documented or shown in example stories
- If a property isn't documented, do not assume properties based on naming conventions or common patterns from other libraries. Check back with the user in these cases.
- Use the `get-storybook-story-instructions` tool to fetch the latest instructions for creating or updating stories. This will ensure you follow current conventions and recommendations.
- Check your work by running `run-story-tests`.

Remember: A story name might not reflect the property name correctly, so always verify properties through documentation or example stories before using them.
<!-- STORYBOOK:END -->
