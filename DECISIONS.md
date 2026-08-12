# Architecture & Product Decisions

This document details the technical, architectural, and product decisions made while building `lic-pwa`. For each decision, it outlines what was chosen, alternatives considered, real-world reasoning, accepted trade-offs, and deliberate scope cuts.

🌐 **Live Deployed Application:** [https://lic.mals.fyi](https://lic.mals.fyi)

---

## Context Overview

`lic-pwa` is built for LIC (Life Insurance Corporation of India) Development Officers who manage networks of ~200 field agents. Officers receive monolithic text report files containing ~800 pending policy claims (uncredited policyholder payouts). The goal of the application is to eliminate the manual friction of organizing these claims and reaching out to agents via messaging channels, while maintaining 100% data privacy and account safety.

---

## Key Decisions & Trade-Off Matrix

### Decision 1: Cloudflare Edge Deployment & PWA Hosting

- **Chosen:** Deployment to Cloudflare Pages ([https://lic.mals.fyi](https://lic.mals.fyi)) paired with PWA Service Worker caching.
- **Alternatives Considered:** Traditional Node.js server hosting (AWS EC2 / Render) or Vercel serverless functions.
- **Reasoning:**
  - Because `lic-pwa` is a 100% client-side application with zero backend infrastructure requirements, static asset deployment to Cloudflare's global edge network guarantees sub-50ms asset delivery globally.
  - Paired with PWA precaching, the application loads instantly and remains 100% functional even when completely offline.

---

### Decision 2: Mobile-First Viewport & Native Device Deep-Link Integration

- **Chosen:** Explicit mobile-first UI layout designed primarily for smartphone browsers and installed Progressive Web Apps (PWAs).
- **Alternatives Considered:** Responsive desktop dashboard layout or a desktop Electron application.
- **Reasoning:**
  - The core workflow relies on native mobile OS integrations: opening the installed WhatsApp mobile app, launching the native SMS app, and importing `.vcf` vCard contact files directly into the phone's native address book.
  - Development Officers perform notification dispatches on-the-go using mobile phones.
- **Tradeoffs Accepted:** While fully functional on desktop browsers, desktop viewports render a mobile-scoped container. Evaluators testing on desktop should enable mobile device emulation in browser DevTools (`Cmd+Shift+M`) for the optimal experience.

---

### Decision 3: Human-in-the-Loop Deep-Linking (`wa.me`, `sms:`) vs. Headless Automation / WhatsApp Business API

- **Chosen:** Client-side URL schema deep-linking (`https://wa.me/91<phone>?text=<encoded_msg>` and `sms:<phone>?body=...`).
- **Alternatives Considered:**
  1. Headless browser automation (Puppeteer / Selenium) via WhatsApp Web.
  2. Meta WhatsApp Business Cloud API integration (via Twilio or Meta Cloud).
- **Reasoning & Empirical Validation:**
  - **Browser Automation Failure:** Initial testing with browser automation triggered WhatsApp's anti-spam detection, resulting in an immediate account ban after sending 2–3 messages.
  - **Business API Overhead:** The WhatsApp Business API requires formal registered business entity verification, sandbox setup, per-message fees, and rigid pre-approval for every dynamic template variation—inviable for quick, personalized agent notifications.
  - **Deep-Linking Breakthrough:** Deep-linking opens WhatsApp/SMS natively, pre-populating the chat with agent-specific policy claim lists. The user only taps "Send", eliminating 90–95% of manual friction while keeping a human in the loop to guarantee 100% account safety and zero API cost.
- **Tradeoffs Accepted:** Requires 1 tap per agent for dispatch rather than fully headless background sending (which mobile browser sandboxes block anyway).

---

### Decision 4: Granular Claim-Level Status Tracking vs. Agent-Level Status Flagging

- **Chosen:** Per-claim notification tracking (`notified_via`: `"whatsapp"` | `"sms"` | `null`, `notified_at`: ISO timestamp | `null`), with agent status badges dynamically derived (`Pending`, `Notified X/Y`, `Done`).
- **Alternatives Considered:** Simple boolean status flag at the Agent level (`Pending` / `Dispatched`).
- **Reasoning & Schema Pivot:**
  - Initially, status was tracked at the agent level. However, when user feedback prompted the addition of a **Due Date Range Filter** (e.g., filter claims due on or before August 5th), generated messages contained only a subset of claims.
  - Marking the entire _agent_ as "Sent" created a false state for claims outside the filtered date range.
  - Pivoting status tracking to individual `Claim` records ensured that only claims explicitly included in a dispatched message are marked as notified, preserving state accuracy across filtered views.
- **Tradeoffs Accepted:** Slightly higher IndexedDB write frequency during bulk actions, managed safely via Dexie transactions.

---

### Decision 5: 1-Click Reviewer Dummy Data Loader vs. Required File Uploads

- **Chosen:** Integrated **"Load Dummy Data"** action button in the Import / Empty State view (`EmptyStateView` & `dummy-loader.ts`).
- **Alternatives Considered:** Requiring evaluators to manually create or source mock CSV and TXT files.
- **Reasoning:** Evaluators and reviewers (e.g., Zamp engineering team) will not possess authentic LIC portal report files. Providing a 1-click dummy data loader populates IndexedDB with realistic sample agents, claims, dates, and amounts instantly, enabling immediate evaluation of the application without setup friction.
- **Tradeoffs Accepted:** Includes a small static JSON payload in the client bundle.

---

### Decision 6: Storybook & Automated Testing Strategy

- **Chosen:** Deferred formal Storybook stories and automated test suites for the initial 5-day project build.
- **Alternatives Considered:** Writing full unit/E2E test suites and storybook stories during initial MVP scaffolding.
- **Reasoning & Real-World Context:**
  - **Storybook Rationale:** Storybook was used initially for isolated UI component construction and visual verification (leveraging the Storybook MCP server). As new views were added under tight time constraints, formal Storybook file maintenance was paused to maximize build velocity.
  - **Testing Strategy:** Automated testing was deferred for the initial prototype. However, as the developer's father is actively advocating for other LIC Development Officers to adopt `lic-pwa` as a daily utility app, automated testing (parser unit tests + Playwright E2E tests) is the immediate top priority for the next production milestone—leveraging established test engineering patterns from previous Web Extension projects.
- **Tradeoffs Accepted:** Verification relied on empirical runtime testing and manual user validation for the MVP build.

---

### Decision 7: Bulk `.vcf` vCard Generation vs. Unsaved Phone Number Links

- **Chosen:** Client-side `.vcf` (vCard) contact file generation for 1-tap mobile address book import.
- **Alternatives Considered:** Relying on raw phone number links without contact saving.
- **Reasoning:**
  - Messaging unsaved numbers created cluttered chat histories (raw numbers instead of agent names) and triggered higher spam detection risk on WhatsApp.
  - Generating downloadable `.vcf` files allows users to import all agent contacts into their phone address book in one tap, formatting names as `[Agency Code] [Agent Name]` (e.g., `01234567 John Doe`).
  - Sending messages to saved contacts significantly relaxes WhatsApp spam detection algorithms.
- **Tradeoffs Accepted:** Adds a one-time setup step for the user before initiating bulk messaging.

---

### Decision 8: Deterministic In-Browser State Machine Parser vs. LLM / Server-Side OCR

- **Chosen:** Client-side TypeScript state machine parser with regex column extraction and line buffering (`src/utils/txt-report-parser.ts`).
- **Alternatives Considered:** Python/FastAPI backend with LLM document extraction (OpenAI / LlamaParse) or Tesseract OCR.
- **Reasoning:**
  - LIC portal text exports follow fixed multi-line table layouts with headers, sub-headers, fixed-width spacing, and multi-line holder addresses.
  - A deterministic state machine parses 1,000+ line text reports in `< 5ms` with 100% precision.
  - Zero token cost, zero network latency, and complete data privacy—no policyholder Personally Identifiable Information (PII) leaves the user's browser.
- **Tradeoffs Accepted:** Relies on fixed report table formats; regex rules must be updated if LIC portal layouts change drastically.

---

### Decision 9: Virtua (`VList`) with Nanostores Scroll Restoration vs. Unvirtualized Lists / `react-window`

- **Chosen:** `virtua` (`VList`) virtual scrolling paired with Nanostores persistent state (`$agentsListScrollOffset`, `$agentsListCache`).
- **Alternatives Considered:** Unvirtualized `.map()` array rendering or `react-window`.
- **Reasoning & INP Profiling:**
  - **Performance Issue:** Performance profiling revealed high Interaction to Next Paint (INP) delays (600ms–800ms vs. target <200ms) when toggling themes or applying filters on the main list view due to rendering 200–300 DOM card nodes simultaneously.
  - **Library Selection:** Evaluated `react-window`, but selected `virtua` for superior dynamic height handling and native scroll restoration support.
  - **UX Requirement:** When a user clicks an agent card midway down the list and navigates back from `/agents/:code`, `virtua` + Nanostores restores their exact pixel scroll offset rather than resetting to top.
  - **Result:** Reduced INP to **< 200ms** across all user interactions.

---

## Deliberate Scope Cuts & Future Roadmap

| Scope Item                                     | Status                        | Rationale & Architectural Plan                                                                                                                        |
| :--------------------------------------------- | :---------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------- |
| **In-App Claim Editing**                       | **Deferred**                  | Low priority; manual editing risks diverging local state from the authoritative LIC portal source of truth.                                           |
| **Import Diff Feedback Modals**                | **Deferred**                  | Showing exact counts of newly added vs. duplicate skipped items deferred to prioritize core parsing velocity.                                         |
| **Automated Test Suite (Vitest & Playwright)** | **Next Production Milestone** | Top priority for the next release as real-world adoption expands across LIC Development Officers.                                                     |
| **Focused Batch Dispatch Mode**                | **Next UX Feature**           | Full-screen distraction-free queue processor (Tinder-style single card presentation with real-time progress tracker and exit summary screen).         |
| **Phase 2 AI Conversational Agent**            | **Future Roadmap**            | Natural language query interface over IndexedDB data (e.g., _"Show me agents with >5 pending claims due before next week"_) leveraging Vercel AI SDK. |

---

## Tech Stack Decisions

### 1. Storage: Dexie.js (`dexie` & `dexie-react-hooks`) vs. PGlite & TinyBase

- **Why Chosen:** Client-side data persistence engine wrapping browser IndexedDB with a clean, promise-based API, multi-table reactive hooks (`useLiveQuery`), and ACID transactions (`db.transaction()`). Enables 0ms local query latency, zero server setup, 100% customer PII privacy, and atomic bulk deduplication (`bulkPut`).
- **Alternatives Evaluated & Why Dropped:**
  - _PGlite (`@electric-sql/pglite` & `@electric-sql/pglite-react`):_ Evaluated for writing pure SQL (`CREATE TABLE`, `SELECT`, `JOIN`) in the browser via WebAssembly. Dropped due to the ~3MB WASM binary payload overhead and ~300ms cold-start memory initialization delay on page load compared to Dexie's 0ms instant startup.
  - _TinyBase:_ Evaluated for fine-grained cell/row-level reactive hooks (`useCell`, `useRow`) and in-memory queries module. Dropped because Dexie provided native IndexedDB table transactions (`db.transaction()`) and atomic bulk merging (`bulkPut`) out of the box without needing extra sync persistence layers.

### 2. Styling & Design System: Astryx & StyleX (`@astryxdesign/core` & `@stylexjs/stylex`) vs. MDUI + Tailwind

- **Why Chosen:** Astryx lets me write the least amount of UI code through an intelligent, layout-first component architecture (`Layout`, `LayoutHeader`, `LayoutContent`, `VStack`, `HStack`) without raw `<div>` clutter. Combined with easy Matcha/Catppuccin theme customization, and StyleX—which is developed and maintained by Meta (Facebook), ensuring battle-tested reliability and static CSS compilation at build time.
- **Alternatives Evaluated & Why Dropped:**
  - _MDUI v2 + TailwindCSS:_ Evaluated during early architecture planning. Dropped because Astryx components and StyleX handle structural layout boilerplate declaratively compared to MDUI + Tailwind, and provide native support for full Catppuccin palette theme definitions (Latte & Mocha) out of the box.

### 3. List Virtualization: Virtua (`virtua`) vs. React Window

- **Why Chosen:** Virtual scrolling engine for the main agent list view.
- **Alternatives Evaluated & Why Dropped:**
  - _React Window:_ Initially implemented because it was the most popular virtualization library, but dropped because it required manual fixed-item height getters and lacked built-in APIs for restoring exact pixel scroll positions when returning from detail views. `virtua` (`VList`) solved dynamic height measurement and scroll position restoration out of the box.

### 4. State Management: Nanostores & Nanostores Persistent (`nanostores`, `@nanostores/react`, `@nanostores/persistent`)

- **Why Chosen:** Micro-footprint (< 1 KB) atomic state management for global UI state, featuring built-in storage synchronization (`@nanostores/persistent`) to persist list scroll offsets (`$agentsListScrollOffset`) and virtual list caches (`$agentsListCache`) across route transitions for seamless scroll restoration.

### 5. CSV Parsing: Deno Standard Library CSV (`@std/csv` via JSR)

- **Why Chosen:** Lightweight, standards-compliant, zero-dependency streaming CSV parser from the Deno Standard Library that reliably handles quoted values, embedded commas, and CRLF line breaks for agent directory imports via Vite.

### 6. Routing: Wouter (`wouter`)

- **Why Chosen:** Ultra-lightweight (< 1.5 KB) client-side routing library that saves 30+ KB of bundle size compared to traditional routers, accelerating PWA startup while cleanly integrating with browser `document.startViewTransition()` animations inside custom `useNavigate` hooks.
