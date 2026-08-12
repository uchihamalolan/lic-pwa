# Architecture & Product Decisions

This document details the technical, architectural, and product decisions made while building `lic-pwa`. For each decision, it outlines what was chosen, alternatives considered, real-world reasoning, accepted trade-offs, and deliberate scope cuts.

---

## Context Overview

`lic-pwa` is built for LIC (Life Insurance Corporation of India) Development Officers who manage networks of ~200 field agents. Officers receive monolithic text report files containing ~800 pending policy claims (uncredited policyholder payouts). The goal of the application is to eliminate the manual friction of organizing these claims and reaching out to agents via messaging channels, while maintaining 100% data privacy and account safety.

---

## Key Decisions & Trade-Off Matrix

### Decision 1: Mobile-First Viewport & Native Device Deep-Link Integration

- **Chosen:** Explicit mobile-first UI layout designed primarily for smartphone browsers and installed Progressive Web Apps (PWAs).
- **Alternatives Considered:** Responsive desktop dashboard layout or a desktop Electron application.
- **Reasoning:**
  - The core workflow relies on native mobile OS integrations: opening the installed WhatsApp mobile app, launching the native SMS app, and importing `.vcf` vCard contact files directly into the phone's native address book.
  - Development Officers perform notification dispatches on-the-go using mobile phones.
- **Tradeoffs Accepted:** While fully functional on desktop browsers, desktop viewports render a mobile-scoped container. Evaluators testing on desktop should enable mobile device emulation in browser DevTools (`Cmd+Shift+M`) for the optimal experience.

---

### Decision 2: Human-in-the-Loop Deep-Linking (`wa.me`, `sms:`) vs. Headless Automation / WhatsApp Business API

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

### Decision 3: Granular Claim-Level Status Tracking vs. Agent-Level Status Flagging

- **Chosen:** Per-claim notification tracking (`notified_via`: `"whatsapp"` | `"sms"` | `null`, `notified_at`: ISO timestamp | `null`), with agent status badges dynamically derived (`Pending`, `Notified X/Y`, `Done`).
- **Alternatives Considered:** Simple boolean status flag at the Agent level (`Pending` / `Dispatched`).
- **Reasoning & Schema Pivot:**
  - Initially, status was tracked at the agent level. However, when user feedback prompted the addition of a **Due Date Range Filter** (e.g., filter claims due on or before August 5th), generated messages contained only a subset of claims.
  - Marking the entire _agent_ as "Sent" created a false state for claims outside the filtered date range.
  - Pivoting status tracking to individual `Claim` records ensured that only claims explicitly included in a dispatched message are marked as notified, preserving state accuracy across filtered views.
- **Tradeoffs Accepted:** Slightly higher IndexedDB write frequency during bulk actions, managed safely via Dexie transactions.

---

### Decision 4: 1-Click Reviewer Dummy Data Loader vs. Required File Uploads

- **Chosen:** Integrated **"Load Dummy Data"** action button in the Import / Empty State view (`EmptyStateView` & `dummy-loader.ts`).
- **Alternatives Considered:** Requiring evaluators to manually create or source mock CSV and TXT files.
- **Reasoning:** Evaluators and reviewers (e.g., Zamp engineering team) will not possess authentic LIC portal report files. Providing a 1-click dummy data loader populates IndexedDB with realistic sample agents, claims, dates, and amounts instantly, enabling immediate evaluation of the application without setup friction.
- **Tradeoffs Accepted:** Includes a small static JSON payload in the client bundle.

---

### Decision 5: Bulk `.vcf` vCard Generation vs. Unsaved Phone Number Links

- **Chosen:** Client-side `.vcf` (vCard) contact file generation for 1-tap mobile address book import.
- **Alternatives Considered:** Relying on raw phone number links without contact saving.
- **Reasoning:**
  - Messaging unsaved numbers created cluttered chat histories (raw numbers instead of agent names) and triggered higher spam detection risk on WhatsApp.
  - Generating downloadable `.vcf` files allows users to import all agent contacts into their phone address book in one tap, formatting names as `[Agency Code] [Agent Name]` (e.g., `01234567 John Doe`).
  - Sending messages to saved contacts significantly relaxes WhatsApp spam detection algorithms.
- **Tradeoffs Accepted:** Adds a one-time setup step for the user before initiating bulk messaging.

---

### Decision 6: Anti-Spam Bidirectional Call-to-Action Messaging Template

- **Chosen:** Embedding an explicit call-to-action instruction in default message templates: `"Kindly acknowledge receipt with 👍"`.
- **Alternatives Considered:** Plain unidirectional notification copy listing policy details only.
- **Reasoning:**
  - WhatsApp's trust algorithms evaluate conversation reciprocity. Inbound replies from recipients signal legitimate bidirectional communication, drastically reducing account ban risks.
- **Tradeoffs Accepted:** Adds a minor line of text to every generated message.

---

### Decision 7: Deterministic In-Browser State Machine Parser vs. LLM / Server-Side OCR

- **Chosen:** Client-side TypeScript state machine parser with regex column extraction and line buffering (`src/utils/txt-report-parser.ts`).
- **Alternatives Considered:** Python/FastAPI backend with LLM document extraction (OpenAI / LlamaParse) or Tesseract OCR.
- **Reasoning:**
  - LIC portal text exports follow fixed multi-line table layouts with headers, sub-headers, fixed-width spacing, and multi-line holder addresses.
  - A deterministic state machine parses 1,000+ line text reports in `< 5ms` with 100% precision.
  - Zero token cost, zero network latency, and complete data privacy—no policyholder Personally Identifiable Information (PII) leaves the user's browser.
- **Tradeoffs Accepted:** Relies on fixed report table formats; regex rules must be updated if LIC portal layouts change drastically.

---

### Decision 8: Virtua (`VList`) with Nanostores Scroll Restoration vs. Unvirtualized Lists / `react-window`

- **Chosen:** `virtua` (`VList`) virtual scrolling paired with Nanostores persistent state (`$agentsListScrollOffset`, `$agentsListCache`).
- **Alternatives Considered:** Unvirtualized `.map()` array rendering or `react-window`.
- **Reasoning & INP Profiling:**
  - **Performance Issue:** Performance profiling revealed high Interaction to Next Paint (INP) delays (600ms–800ms vs. target <200ms) when toggling themes or applying filters on the main list view due to rendering 200–300 DOM card nodes simultaneously.
  - **Library Selection:** Evaluated `react-window`, but selected `virtua` for superior dynamic height handling and native scroll restoration support.
  - **UX Requirement:** When a user clicks an agent card midway down the list and navigates back from `/agents/:code`, `virtua` + Nanostores restores their exact pixel scroll offset rather than resetting to top.
  - **Result:** Reduced INP to **< 200ms** across all user interactions.

---

### Decision 9: Catppuccin Theme Palette vs. Default Framework Styling

- **Chosen:** Custom Matcha theme mapping Catppuccin Latte (light mode) and Catppuccin Mocha (dark mode).
- **Alternatives Considered:** Browser default colors or unstyled utility tokens.
- **Reasoning:** Provides a modern, cohesive, dark/light visual aesthetic tailored for dense data interfaces.

---

## Deliberate Scope Cuts & Future Roadmap

| Scope Item                             | Status              | Rationale & Architectural Plan                                                                                                                        |
| :------------------------------------- | :------------------ | :---------------------------------------------------------------------------------------------------------------------------------------------------- |
| **In-App Claim Editing**               | **Deferred**        | Low priority; manual editing risks diverging local state from the authoritative LIC portal source of truth.                                           |
| **Import Diff Feedback Modals**        | **Deferred**        | Showing exact counts of newly added vs. duplicate skipped items deferred to prioritize core parsing velocity.                                         |
| **Focused Batch Dispatch Mode**        | **Next UX Feature** | Full-screen distraction-free queue processor (Tinder-style single card presentation with real-time progress tracker and exit summary screen).         |
| **Phase 2 AI Conversational Agent**    | **Future Roadmap**  | Natural language query interface over IndexedDB data (e.g., _"Show me agents with >5 pending claims due before next week"_) leveraging Vercel AI SDK. |
| **App Redirection Confirmation Toast** | **Future Roadmap**  | Persistent toast upon returning from native WhatsApp/SMS deep-links with explicit _"Mark as Sent"_ / _"Cancel"_ action buttons.                       |
