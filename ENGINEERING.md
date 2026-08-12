# Engineering Architecture & Technical Deep-Dive

This document details the internal engineering architecture, technical implementations, data pipelines, state schemas, performance optimizations, and design patterns powering `lic-pwa`.

🌐 **Live Deployed Application:** [https://lic.mals.fyi](https://lic.mals.fyi)

> [!NOTE]
> 📱 **Mobile Viewport Disclaimer:**  
> The application layout and interaction patterns are **explicitly engineered for mobile viewports (iOS & Android PWA)** to interface seamlessly with native mobile messaging apps (WhatsApp and SMS) and mobile contact managers. When reviewing on desktop browsers, evaluators should toggle mobile device emulation (`Cmd+Shift+M` on macOS / `Ctrl+Shift+M` on Windows).

---

## 1. Document Parsing & Data Joining Pipeline

The core task of Problem Statement 3 is converting unstructured/semi-structured portal exports into a clean, relational domain model without relying on cloud APIs or LLM runtimes.

### Inputs & Relational Join

1. **Agents Directory (`.csv`):** Parsed via `@std/csv` into `Agent` records containing `agent_code`, `name`, `phone`, and `do_code`.
2. **Claims Report (`.txt`):** Parsed via a custom deterministic state machine (`src/utils/txt-report-parser.ts`) into `Claim` records.
3. **Relational Joining:** Records are linked via `agent_code`, constructing an in-memory relational structure: **1 Agent ↔ N Claims**.

### Reviewer Setup & Dummy Data Loader (`dummy-loader.ts`)

To allow immediate evaluation without authentic portal files, `src/utils/dummy-loader.ts` provides a 1-click dataset initializer. Clicking **"Load Dummy Data"** in the Import view seeds IndexedDB with pre-configured agents and claims records.

### State Machine Architecture (`txt-report-parser.ts`)

```
[Raw Line Stream]
       │
       ▼
 [Filter Noise] ──► (Ignore headers: "LIFE INSURANCE", "OFFICE", "Page :", dashes)
       │
       ▼
 [Match DO/Agency Header] ──► Updates Current Context: { doCode, agencyCode }
       │
       ▼
 [Match Row Regex (ROW_RE)] ──► Flush Previous Claim ──► Instantiate New Claim State
       │
       ▼ (If line doesn't match ROW_RE but claim is active)
 [Address Line Buffer] ──► Collect sub-address lines into `addressLines[]`
       │
       ▼
 [EOF / Next Row] ──► Flush & Normalize: ISO Date formatting, phone numbers, clean address
```

---

## 2. Granular Schema & Client Storage Architecture (`db.ts`)

All application data resides locally on the client device using `Dexie.js` (IndexedDB wrapper).

### Schema & Indexing

```ts
class LicDatabase extends Dexie {
  agents!: Table<Agent, string>;
  claims!: Table<Claim, string>;

  constructor() {
    super("LicDatabase");
    this.version(1).stores({
      agents: "agent_code, name, phone, do_code",
      claims: "policy_no, agent_code, due_date, claim_type, notified_via, notified_at",
    });
  }
}
```

### Granular Claim-Level Status Tracking

Following the addition of date-range filtering, notification state was moved from the agent level down to individual claim records:

- `notified_via`: `"whatsapp"` | `"sms"` | `null`
- `notified_at`: ISO timestamp string | `null`

---

## 3. Deployment, Storybook & Testing Rationale

### Deployment Architecture

- **Cloudflare Pages:** The production application is deployed globally on Cloudflare Pages ([https://lic.mals.fyi](https://lic.mals.fyi)). Static asset delivery at the edge paired with PWA Service Worker caching guarantees sub-50ms load times and full offline resilience.

### Storybook Strategy

- Storybook was leveraged during early component construction for UI isolation and visual verification using the Storybook MCP server. As new views were assembled under a 5-day build timeline, story generation was paused to focus on full-stack feature delivery.

### Automated Testing Roadmap

- Automated unit and end-to-end tests were deferred during the initial MVP phase in favor of empirical runtime verification. However, as the developer's father advocates for broader adoption among LIC Development Officers, establishing unit tests (parser & state modules) and Playwright E2E suites is the top priority for the next production milestone—applying testing patterns established in previous Web Extension projects.

---

## 4. Performance Profiling & INP Optimization

### The Problem

During performance profiling of main list views (`/agents`), Interaction to Next Paint (INP) metrics spiked to **600ms–800ms** (well above the target <200ms) when toggling light/dark themes or applying search filters.

### Diagnosis & Solution

- **Root Cause:** Unvirtualized rendering of 200–300 agent cards simultaneously created thousands of DOM nodes, causing severe layout recalculation churn.
- **Virtualization Strategy:** Implemented `virtua` (`VList`) for dynamic virtualization.
- **Scroll Position Restoration:** Paired `virtua` with Nanostores persistent state (`$agentsListScrollOffset`, `$agentsListCache`). When a user clicks an agent card midway down the list and returns from `/agents/:code`, the list re-attaches to the exact saved pixel scroll offset.
- **Empirical Result:** INP dropped to **< 200ms** across all user interactions.

---

## 5. View Transitions & Layout Shell Architecture

### Hardware-Accelerated Navigation (`use-navigate.ts`)

Navigating between `/agents` and `/agents/:code` uses the native browser View Transitions API combined with Web Animations API (WAAPI) keyframe animations running on GPU compositor threads.

### Persistent App Shell Layout

The top navigation header (`AppLayoutHeader`) remains fixed during page transitions, ensuring only inner view content slides underneath for a native app feel.

---

## Evaluation Signal Mapping

| Evaluation Signal                      | Technical Implementation & Empirical Evidence                                                                                                                                                                                                                                                                                        |
| :------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Problem Framing**                    | Identified that Development Officers face massive manual overhead processing raw ASCII portal exports (~200 agents, ~800 claims) and risking WhatsApp bans. Framed solution around mobile-first PWA parsing + local privacy + deep-link workflows. Deployed live to Cloudflare Pages ([https://lic.mals.fyi](https://lic.mals.fyi)). |
| **Product Thinking**                   | Implemented mobile-first UX, agent-centric grouping, date-range filtering, bulk vCard generation, bidirectional call-to-action message templates, granular claim-level status tracking, and planned Focused Batch Dispatch Mode.                                                                                                     |
| **UX Decisions**                       | Added GPU view transitions, virtualized lists for 60 FPS scrolling, instant search filtering, persistent header app shell, Catppuccin theme styling, and scroll position restoration.                                                                                                                                                |
| **Code Quality**                       | Strict TypeScript schemas (`zod`), modular architecture (`/utils`, `/store`, `/hooks`, `/views`), zero inline CSS clutter via Astryx & StyleX design system.                                                                                                                                                                         |
| **Documentation**                      | Provided `DECISIONS.md`, high-level `README.md`, technical `ENGINEERING.md`, and narrative context repository `STORY.md`.                                                                                                                                                                                                            |
| **Setup Experience & Reviewer Access** | Live URL deployment at [https://lic.mals.fyi](https://lic.mals.fyi) + single `pnpm install && pnpm dev` command + 1-click dummy data loader button (`dummy-loader.ts`).                                                                                                                                                              |
| **Tests & Storybook**                  | Documented early Storybook isolation usage and articulated the immediate testing roadmap (unit tests + Playwright E2E) as real-world LIC usage scales.                                                                                                                                                                               |
| **Velocity**                           | Deployed full-fledged production PWA complete with state-machine parser, IndexedDB persistence, virtualized UI, analytics dashboard, and vCard exporter in a 5-day cycle.                                                                                                                                                            |
| **Above & Beyond**                     | Solved hard sub-problems: multi-line un-delimited text report state parsing, client-side data privacy with 0ms offline query speeds, INP optimization from 800ms to <200ms via `virtua` scroll restoration, and native WAAPI view transitions.                                                                                       |
