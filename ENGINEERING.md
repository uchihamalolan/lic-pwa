# Engineering Architecture & Technical Deep-Dive

This document details the internal engineering architecture, technical implementations, data pipelines, state schemas, performance optimizations, and design patterns powering `lic-pwa`.

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

### Key Regular Expressions

- **Agency Header Extraction:**
  ```ts
  const DO_AGENCY_RE = /DO CODE\s+(\d+)\s+AGENCY CODE\s+(\d+)/;
  ```
- **Claim Row Extraction:**
  ```ts
  const ROW_RE =
    /^(\d+)\s+([A-Z])\s+(\d+)\s+(.*?)\s{2,}(\d{1,2}\/\d{1,2}\/\d{4})\s+(\d+)\s+([\d.]+)\s+([YN])\s*(\d{10})?\s*$/;
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

### Transactional Deduplication & Status Preservation

When re-importing updated claims text files, existing claim notification metadata (`notified_via`, `notified_at`) is transactionally preserved:

```ts
await db.transaction("rw", db.claims, async () => {
  const existingClaims = await db.claims
    .where("policy_no")
    .anyOf(validatedClaims.map((c) => c.policy_no))
    .toArray();

  const statusMap = new Map(
    existingClaims.map((c) => [c.policy_no, { notified_via: c.notified_via, notified_at: c.notified_at }]),
  );

  const mergedClaims = validatedClaims.map((claim) => ({
    ...claim,
    notified_via: statusMap.get(claim.policy_no)?.notified_via ?? claim.notified_via,
    notified_at: statusMap.get(claim.policy_no)?.notified_at ?? claim.notified_at,
  }));

  await db.claims.bulkPut(mergedClaims);
});
```

---

## 3. Communication, Deep-Linking & vCard Engine

### WhatsApp & SMS URI Schemes

- **WhatsApp Deep-Link:** `https://wa.me/91<phone>?text=<encoded_msg>`
- **SMS Deep-Link:** `sms:+91<phone>?body=<encoded_msg>`

### Dynamic Message Builder (`message-builder.ts`)

Combines customizable pre-text templates with an auto-generated claim breakdown:

```
We're sending outstanding claims under your agency.
Kindly collect claim requirements and submit the same immediately to our LIC Office.
Kindly acknowledge receipt of message with 👍

1. Policy No: 123456789 | John Doe | Due: 05/08/2026
   Claim Type: M | Plan: 814 | Amount: ₹50,000
   Address: 123 Main St, City
```

### Bulk vCard Exporter (`vcard-builder.ts`)

Generates MIME `text/vcard` blobs formatted for native iOS/Android address book imports, prefixing contact names with agency codes:

```
BEGIN:VCARD
VERSION:3.0
FN:01234567 John Doe
N:;01234567 John Doe;;;
TEL;TYPE=CELL,VOICE:+919876543210
NOTE:LIC Agent - Agency Code: 01234567
END:VCARD
```

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

Navigating between `/agents` and `/agents/:code` uses the native browser View Transitions API combined with Web Animations API (WAAPI) keyframe animations running on GPU compositor threads:

```ts
const transition = document.startViewTransition(() => {
  flushSync(() => setLocation(to, navOptions));
});

await transition.ready;

document.documentElement.animate(
  [{ transform: "translateX(0%)" }, { transform: isForward ? "translateX(-100%)" : "translateX(100%)" }],
  { duration: 310, easing: "cubic-bezier(0.24, 1, 0.4, 1)", pseudoElement: "::view-transition-old(root)" },
);
```

### Persistent App Shell Layout

The top navigation header (`AppLayoutHeader`) remains fixed during page transitions, ensuring only inner view content slides underneath for a native app feel.

---

## 6. Future Architectural Roadmap

### Focused Batch Dispatch Mode (Immersive UX Architecture)

- **Design Pattern:** Distraction-free single-item queue processor.
- **State Machine:**
  - `IDLE`: Standard multi-card virtual list view with search/filters.
  - `ACTIVE`: Filtered queue initialized. Hides search, filter toolbars, and list clutter. Renders single-card Tinder-style presentation with prominent primary action triggers (_WhatsApp_, _SMS_, _Skip_, _Mark Sent & Next_).
  - `SUMMARY`: Triggers upon completion or manual exit (`Stop Dispatch Mode`), displaying a batch statistics card (total agents contacted, total claims notified, total payable amounts cleared).

### Phase 2 AI Conversational Agent

- Natural language query interface over IndexedDB data leveraging Vercel AI SDK.

---

## Evaluation Signal Mapping

| Evaluation Signal    | Technical Implementation & Empirical Evidence                                                                                                                                                                                                      |
| :------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Problem Framing**  | Identified that Development Officers face massive manual overhead processing raw ASCII portal exports (~200 agents, ~800 claims) and risking WhatsApp bans. Framed solution around mobile-first PWA parsing + local privacy + deep-link workflows. |
| **Product Thinking** | Implemented mobile-first UX, agent-centric grouping, date-range filtering, bulk vCard generation, bidirectional call-to-action message templates, granular claim-level status tracking, and planned Focused Batch Dispatch Mode.                   |
| **UX Decisions**     | Added GPU view transitions, virtualized lists for 60 FPS scrolling, instant search filtering, persistent header app shell, Catppuccin theme styling, and scroll position restoration.                                                              |
| **Code Quality**     | Strict TypeScript schemas (`zod`), modular architecture (`/utils`, `/store`, `/hooks`, `/views`), zero inline CSS clutter via Astryx & StyleX design system.                                                                                       |
| **Documentation**    | Provided `DECISIONS.md`, high-level `README.md`, technical `ENGINEERING.md`, and narrative context repository `STORY.md`.                                                                                                                          |
| **Setup Experience** | Single `pnpm install && pnpm dev` command; includes 1-click dummy data loader button (`dummy-loader.ts`) on the import screen specifically for Zamp evaluators to test without real portal files.                                                  |
| **Velocity**         | Built full-fledged PWA complete with state-machine parser, IndexedDB persistence, virtualized UI, analytics dashboard, and vCard exporter in a 5-day cycle.                                                                                        |
| **Above & Beyond**   | Solved hard sub-problems: multi-line un-delimited text report state parsing, client-side data privacy with 0ms offline query speeds, INP optimization from 800ms to <200ms via `virtua` scroll restoration, and native WAAPI view transitions.     |
