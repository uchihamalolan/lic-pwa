# Complete Project Chronology & Narrative Context

This document is an exhaustive, chronological log of all problem definitions, domain contexts, technical failures, architectural pivots, UX decisions, performance optimizations, and future roadmap items for `lic-pwa`. It serves as the primary context repository for updating all public documentation files (`DECISIONS.md`, `README.md`, `ENGINEERING.md`).

🌐 **Live Deployed URL:** [https://lic.mals.fyi](https://lic.mals.fyi)

---

## 1. Origin & Problem Definition

### Initial Problem

- **User Trigger:** The developer's father (an LIC Development Officer) needed a way to send bulk customized messages to ~200 LIC agents to remind them to collect bank/NEFT details from policyholders with pending claims (~800 claims total in his dataset).
- **Domain Context:** LIC "claims" in this context refer to maturity or survival benefits owed _by_ LIC _to_ policyholders that failed to disburse automatically due to missing or invalid bank details. Agents needed to contact policyholders to get updated bank details.

### Mobile-First Viewport Rationale

- **Primary Target:** Designed explicitly for **mobile viewports (iOS & Android PWA)**.
- **Why Mobile First:** The entire product workflow centers on triggering native mobile apps installed on the device (the native WhatsApp mobile app, native SMS messaging app, and native contact manager for `.vcf` imports).
- **Desktop Behavior:** While functional in desktop browsers, the visual layout is tailored for smartphone screens. Evaluators testing on desktop should enable browser mobile device emulation.

### Initial Automation Attempts & Failures

1. **Browser Automation (Selenium / Puppeteer / Extensions):**
   - Attempted headless web automation via WhatsApp Web.
   - **Result:** WhatsApp's anti-spam detection flagged and banned the account after sending only 2–3 messages.
2. **WhatsApp Business API:**
   - High setup friction: Required registered business verification, sandbox configuration, per-message fees, and mandatory pre-approval of rigid message templates.
   - Inviable for quick, dynamic, one-off agent notifications.
3. **Core Realization:**
   - Headless full automation was the wrong angle despite being the initial request. A human-in-the-loop, semi-automated workflow was required to eliminate friction while preserving account safety.

---

## 2. Input Data & Relational Schema Mapping

### Data Inputs

1. **Agents Directory (`.csv`):** Fixed list of LIC agents containing name, agency code, divisional office (DO) code, and phone number.
2. **Pending Claims Report (`.txt`):** Legacy ASCII report exported from the LIC portal containing multi-page fixed-width tables, page headers/footers, and multi-line addresses.

### Technical Strategy

- Build a dual parser accepting both CSV and TXT files.
- Extract `agent_code` from the CSV directory and join it with the `agent_code` parsed from the text report headers to construct an in-memory relational schema: **1 Agent ↔ N Claims**.

---

## 3. Deep-Linking & UX Friction Reduction

### The Deep-Link Breakthrough

- Identified the primary manual friction: searching/saving phone numbers in WhatsApp, opening new chat windows, and manually copy-pasting/formatting claim details per agent.
- Leveraged native browser/app URL deep-linking: `https://wa.me/91<phone>?text=<encoded_msg>`.
- **UX Impact:** Deep-linking opens WhatsApp, lands directly on the agent's chat, and pre-populates the entire formatted claim summary. The user only taps "Send", removing ~90–95% of manual friction while completely avoiding automation ban risks.

### Dynamic Message Generator

- Combined customizable header text with an auto-generated list of outstanding claims for that agent:
  - Format: Policy Number, Holder Name, Due Date, Claim Type, Plan Code, Payable Amount (₹), and Holder Address.

### Multi-Channel Support (SMS Fallback)

- Discovered some agents do not use WhatsApp.
- Extended deep-linking strategy to SMS via the `sms:<phone>?body=...` URI scheme.
- Added dual action buttons on every agent card: **WhatsApp** and **SMS**.

### Anti-Ban Strategy & Bidirectional Call-to-Action

- Added a specific call-to-action in the default template asking agents to reply: `"Kindly acknowledge receipt with 👍"`.
- **Reasoning:** Inbound replies signal legitimate bidirectional messaging to WhatsApp's trust algorithms, preventing account flagging.

### Bulk vCard Export (`.vcf`)

- **Problem:** Messaging unsaved numbers resulted in cluttered chat histories (only phone numbers visible) and higher spam detection risk on WhatsApp.
- **Solution:** Built a bulk `.vcf` (vCard) file exporter. Opening the file on Android/iOS imports all agent contacts into the native phonebook in one tap, formatting names as `[Agency Code] [Agent Name]` (e.g., `01234567 John Doe`).

---

## 4. Architectural Pivot: From Agent-Level to Claim-Level Status Tracking

### Initial Implementation

- Initially tracked notification status strictly at the **Agent level** (`Pending`, `Notified`, `Done`).

### User-Driven Requirement & The Conflict

- **User Feedback:** The developer's father requested a **Date Range Filter** (e.g., filter claims due on or before August 5th).
- **The Conflict:** When date range filtering was active, generated messages contained only the subset of claims due within that window. Marking the entire _agent_ as "Sent" created a false state—it incorrectly implied that claims _outside_ the date range were also dispatched.

### The Solution: Granular Claim-Level Schema

- Shifted status tracking to individual `Claim` records:
  - `notified_via`: `"whatsapp"` | `"sms"` | `null`
  - `notified_at`: ISO timestamp string | `null`
- Agent status badges became dynamic derived state:
  - `No claims due` (Red)
  - `Pending` (Teal)
  - `Notified (X/Y)` (Cyan)
  - `Done` (Green)

---

## 5. Deployment, Storybook & Testing Context

### Live Deployment

- Deployed to Cloudflare Pages at [https://lic.mals.fyi](https://lic.mals.fyi).

### Storybook & Automated Testing Rationale

- **Storybook:** Storybook was used initially during early component construction for UI isolation and visual verification using the Storybook MCP server. Story creation was paused as new views were built to maintain 5-day project build velocity.
- **Testing Roadmap:** Automated testing was deferred for the initial prototype. However, as the developer's father is actively advocating for other LIC Development Officers to adopt `lic-pwa` as a daily utility app, comprehensive automated testing (parser unit tests + Playwright E2E tests) is the immediate top priority for the next production milestone—leveraging established test engineering patterns from previous Web Extension projects.

---

## 6. Reviewer Setup Experience & Dummy Data Loader

- **Zamp Reviewer Friction:** Reviewers evaluating the project will not have access to authentic LIC portal CSV/TXT files.
- **Solution:** Added a prominent **"Load Dummy Data"** action button directly on the Import / Empty State view (`EmptyStateView` & `dummy-loader.ts`).
- **Impact:** Allows reviewers to populate the app with realistic sample agents, claims, dates, and amounts in a single click, providing a zero-friction evaluation experience.

---

## 7. Data Management & Storage Architecture

- **Client-Only IndexedDB Storage:** Built with `Dexie.js`. Data stays 100% on-device for total privacy and zero-latency offline performance.
- **Smart Upsert & Deduplication:** Re-importing claims deduplicates records by policy number while preserving existing `notified_via` and `notified_at` metadata. Re-importing CSV upserts agents by `agent_code`.
- **Database Reset:** Provides a 1-click option to clear all local records for a fresh start.
- **Scope Cuts / Deferred Ideas:**
  - _Import Diff Modals:_ Showing exact counts of newly added vs. skipped items during import (deferred).
  - _In-App Claim Editing:_ Deferred as low priority to avoid diverging local state from the authoritative LIC portal source of truth.

---

## 8. UX Polish, Motion Design & Aesthetics

- **Offline-First PWA:** Static assets precached via `vite-plugin-pwa` Service Worker for zero-connectivity field use.
- **View Transitions API + WAAPI:**
  - Forward navigation (`/agents` → `/agents/:code`): Hardware-accelerated slide from right to left (`translateX(100%)` → `0%`).
  - Backward navigation (`/agents/:code` → `/agents`): Reverse slide from left to right (`translateX(-100%)` → `0%`).
  - Other routes: Soft default cross-fade transitions.
- **Persistent App Shell Header:** Fixed top header (`AppLayoutHeader`) during route transitions so only inner content slides underneath.
- **Catppuccin Color Palette:** Custom Matcha theme mapping Catppuccin Latte (light mode) and Catppuccin Mocha (dark mode).

---

## 9. Performance Profiling & INP Optimization

### The Problem

- Profiling UI responsiveness revealed high **Interaction to Next Paint (INP)** delays of **600ms–800ms** (well above the recommended <200ms target) when toggling themes or applying filters on `/agents`.

### Root Cause & Resolution

- **Root Cause:** Rendering 200–300 agent cards simultaneously created thousands of DOM nodes, causing severe layout churn.
- **Library Selection:** Evaluated `react-window`, but selected `virtua` (`VList`) for superior dynamic height handling and native scroll restoration support.
- **Scroll Restoration:** Combined `virtua` with Nanostores persistent state (`$agentsListScrollOffset`, `$agentsListCache`). When a user clicks an agent card midway down the list and navigates back from `/agents/:code`, they land on their exact previous pixel scroll offset.
- **Result:** Reduced INP to **< 200ms** across all user interactions.

---

## 10. Future Product Roadmap

### Production Testing & Quality Assurance (Immediate Next Milestone)

- Comprehensive unit tests for state-machine parsers and Dexie storage transactions, paired with Playwright E2E suites to support growing multi-user adoption among LIC Development Officers.

### Focused Batch Dispatch Mode (Next Major UX Enhancement)

- Single-card focused queue processor (Tinder-style card presentation with real-time progress tracker and exit summary screen).

### Phase 2: AI Conversational Agent

- Natural language query interface over IndexedDB data leveraging Vercel AI SDK.
