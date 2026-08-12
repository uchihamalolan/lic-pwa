# LIC Policy & Claim Assistant (PWA)

An offline-first Progressive Web Application built for LIC (Life Insurance Corporation of India) Development Officers and field agents. It converts monolithic, legacy portal text reports into a structured, searchable, and actionable mobile workspace.

🌐 **Live Deployed Application:** [https://lic.mals.fyi](https://lic.mals.fyi)

> [!IMPORTANT]
> 📱 **Mobile-First Viewport Disclaimer**  
> This application is **explicitly engineered for mobile viewports (iOS & Android PWA)**. The primary workflow relies on launching native mobile messaging apps (WhatsApp and SMS) and native contact managers directly from the device.  
> **For Evaluators:** When reviewing on desktop browsers, please enable **Mobile Viewport Emulation** (`Cmd+Shift+M` on macOS / `Ctrl+Shift+M` on Windows) in Chrome DevTools for the intended experience.

---

## What is LIC & What Problem Does This Solve?

**Background Context:**  
Life Insurance Corporation of India (LIC) is India's largest state-owned life insurer. Development Officers (DOs) manage networks of hundreds of field agents. Every month, LIC generates reports of **pending policy claims**—money owed _by_ LIC _to_ policyholders (maturity/survival benefits) that could not be disbursed automatically due to missing or outdated bank details (NEFT). Development Officers must quickly notify field agents so they can contact policyholders and collect updated bank details.

**The Pain Point:**  
LIC portal exports arrive as massive, multi-page `.txt` files containing thousands of policy records formatted in fixed-width ASCII tables, interrupted every 50 lines by page headers, dashes, and multi-line addresses. Processing these reports manually is slow, error-prone, and overwhelming.

**The Solution:**  
**LIC Assistant** processes raw `.txt` and `.csv` files locally in milliseconds, giving officers an interactive, agent-centric dashboard:

1. **Instant Document Parsing:** Converts raw multi-page ASCII reports into structured agent-claim relationships instantly in the browser.
2. **1-Click Reviewer Demo:** Includes a built-in **"Load Dummy Data"** button on the launch screen so evaluators can test the full product without needing authentic portal files.
3. **1-Click WhatsApp & SMS Dispatch:** Pre-formats personalized notification messages per agent (listing all their pending policy claims) and opens native messaging apps in a single tap.
4. **1-Tap vCard Export:** Generates bulk `.vcf` contact files formatted as `[Agency Code] [Agent Name]` so officers can save all agent phone numbers directly to their device address book.
5. **Offline-First & Private:** All parsing and data storage happens 100% locally in browser IndexedDB. No server fees, zero latency, and total privacy for sensitive customer data.

---

## Key Features

- 🌐 **Live Cloudflare Deployment:** Accessible live at [https://lic.mals.fyi](https://lic.mals.fyi).
- 📱 **Mobile-First PWA:** Optimized for mobile touchscreens with 60 FPS scrolling and GPU-accelerated view transitions.
- 📄 **Legacy Text & CSV Parser:** Robust state-machine parser handles complex ASCII tables, multi-line addresses, and header noise.
- 🧪 **Reviewer Demo Loader:** Populates a realistic sample dataset with 1 click for instant evaluation.
- 🔍 **Smart Search & Date Filtering:** Search by agent name, agency code, or claim status, and filter claims by specific due date ranges.
- 💬 **Customizable Message Templates:** Edit notification pre-text with dynamic variable substitution for policy details.
- 📊 **Analytics Dashboard:** Displays total dues, claimed vs. pending amounts, and completion percentages with a toggle between overall and filtered dataset stats.
- 📥 **Data Management & Portability:** Complete JSON export, import, and database reset capabilities.

---

## Storybook & Testing Rationale

> [!NOTE]
> **Storybook & Automated Test Disclaimer**
>
> - **Storybook Usage:** Storybook was utilized initially for component isolation and UI verification (leveraging the Storybook MCP server during early UI construction). As new views were built under tight time constraints, formal Storybook stories were omitted to prioritize full-stack pipeline velocity for the 5-day project build.
> - **Testing & Production Roadmap:** Automated unit/E2E test suites were intentionally deferred for this initial MVP build. However, as the developer's father is actively advocating for other LIC Development Officers to adopt `lic-pwa` as their primary daily utility app, comprehensive test coverage (unit tests for parsers/stores and Playwright E2E tests) is the immediate top priority for the next production milestone—drawing from proven test engineering patterns established in previous Web Extension projects.

---

## Tech Stack Overview

Built with modern web technologies focused on performance, reliability, and zero runtime overhead:

- **Deployment & Hosting:** Cloudflare Pages ([https://lic.mals.fyi](https://lic.mals.fyi))
- **Core & UI Framework:** React 19, TypeScript, Vite
- **Design System & Styling:** Astryx Design System, StyleX, Lucide Icons
- **Data & Persistence:** Dexie.js (IndexedDB wrapper), Nanostores
- **Performance & PWA:** Virtua Virtual List (`VList`), Vite PWA Plugin

---

## Quick Setup & Running Locally

### Prerequisites

- **Node.js**: v18 or higher
- **pnpm**: v9 or higher

### Installation & Launch

```bash
# Clone the repository
git clone https://github.com/your-username/lic-pwa.git
cd lic-pwa

# Install dependencies
pnpm install

# Start the development server
pnpm dev
```

Open [http://localhost:5173](http://localhost:5173) (or visit the live deployment at [https://lic.mals.fyi](https://lic.mals.fyi)).

> [!TIP]
> **Quick Review Instructions for Evaluators:**
>
> 1. Toggle **Mobile Device Emulation** in Chrome DevTools (`Cmd+Shift+M` or `Ctrl+Shift+M`).
> 2. On the app launch screen, click **"Load Dummy Data"** to populate realistic sample agents and claims instantly.
> 3. Test searching, date filtering, WhatsApp/SMS preview dialogs, theme toggling, and analytics!
