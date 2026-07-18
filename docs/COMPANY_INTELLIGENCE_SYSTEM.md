# AI X — COMPANY INTELLIGENCE SYSTEM SPECIFICATION
**Version:** 1.0  
**Status:** Approved for Implementation  
**Author:** Chief Data Architect, Product Design, & UX Research Teams  
**Date:** July 16, 2026

---

## 1. Philosophy: The Complete Corporate Node

Traditional company profiles (e.g., Crunchbase, Wikipedia, PitchBook, or standard news feeds) are fragmented. They force researchers, developers, and investors to navigate between several disconnected tabs or external sites: one for funding history, another for open-source GitHub commits, a third for academic papers, and a fourth to review benchmark scores.

**AI X rejects this fragmented paradigm.** The AI X **Company Intelligence System** treats a corporate entity not as a static record, but as a living, multidimensional **first-class node** in our global Knowledge Graph. Every product launch, open-source repository commit, academic paper, leadership change, and funding round is dynamically mapped and interconnected.

```
                  ┌──────────────────────────────────────────────┐
                  │          THE MULTIDIMENSIONAL INTEGRATION    │
                  ├──────────────────────┬───────────────────────┤
                  │ Traditional Profile  │ AI X Company Dossier  │
                  │ • High manual search │ • Auto-linked graph   │
                  │ • Outdated metrics   │ • Live GitHub/API syn │
                  │ • Disconnected data  │ • Fused tech/finance  │
                  └──────────────────────┴───────────────────────┘
```

The core objective is to answer:
* **Who are they?** (The core identity, founders, and organizational structures).
* **What do they build?** (Live catalogs of active products, open-weight models, and proprietary APIs).
* **Why do they matter?** (Quantitative evaluations on academic datasets and market positions).
* **What changed recently?** (Fusing news reports, funding announcements, and GitHub activity).

---

## 2. Layout Architecture: The Multi-Stage Interactive Workspace

The Company Intelligence Stage uses a custom **three-column layout** designed to handle dense, real-time telemetry while maintaining visual clarity.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        COMPANY WORKSPACE GRID (Desktop)               │
├────────────────────────────────────────────────────────────────────────┤
│ Header: Hero Section (Full-Width, 12-Col)                              │
│ [Entity Branding Logo, Real-Time Market Ticker, Universal Controls]    │
├──────────────────────┬──────────────────────────┬──────────────────────┤
│ Left Control (2-Col) │ Center Workspace (7-Col) │ Right Telemetry (3)  │
│                      │                          │                      │
│ • Section Shortcuts  │ • Multi-Tab Panels       │ • AI Copilot Panel   │
│   (Hero, Products,   │   (Overview, Products,   │ • Relationship Graph │
│    Models, Funding)  │    Models, Research)     │ • Watchlist Widget   │
│                      │                          │                      │
│ • Quick Actions      │ • Timeline Integration   │ • Competitor Ticker  │
│   (Follow, Compare)  │ • Data Visualization     │ • Market Position    │
└──────────────────────┴──────────────────────────┴──────────────────────┘
```

### Layout Core Panels
1. **The Hero Header (Full Width):** Sets the branding tone. Features high-density metadata indicators (Trust Score, Popularity Index, Verification Badge) and universal action toggles.
2. **The Navigation Sidebar (Width: 2 Columns):** A lightweight sticky controller that allows quick-jumping across the 20 distinct intelligence sections or pinning specific views to the workspace.
3. **The Center Stage (Width: 7 Columns):** The primary analytical canvas. Houses the main descriptive overviews, product catalogues, model registries, code sandboxes, and academic bibliographies.
4. **The Telemetry Rail (Width: 3 Columns):** The active metadata sidebar. Hosts the **AI Assistant Copilot**, the dynamic force-directed **Knowledge Graph**, and real-time competitive indicators.

---

## 3. Comprehensive Module Specifications

Every Company page is composed of 20 integrated, data-rich modules designed to provide a comprehensive, multi-disciplinary view of the organization.

```
┌────────────────────────────────────────────────────────────────────────┐
│                            MODULE SCHEMA MAP                           │
├────────────────────────────────────────────────────────────────────────┤
│ 1. Hero Node ────────► 2. Corporate Overview ────► 3. Live News Feed   │
├────────────────────────────────────────────────────────────────────────┤
│ 4. Product Registry ──► 5. AI Models Registry ───► 6. Research Index   │
├────────────────────────────────────────────────────────────────────────┤
│ 7. Leadership Node ───► 8. Funding Chronology ──► 9. Benchmark Tracker │
├────────────────────────────────────────────────────────────────────────┤
│ 10. Technology Stack ─► 11. GitHub Telemetry ────► 12. Chrono Timeline │
├────────────────────────────────────────────────────────────────────────┤
│ 13. Knowledge Graph ──► 14. Competitor Tracker ──► 15. Partners Grid  │
├────────────────────────────────────────────────────────────────────────┤
│ 16. Market Position ──► 17. Financial Overview ──► 18. Media Center    │
├────────────────────────────────────────────────────────────────────────┤
│ 19. AI Copilot Panel ─► 20. Related Content                            │
└────────────────────────────────────────────────────────────────────────┘
```

### Module 1: The Hero Node
* **Purpose:** Establishes the company’s structural identity and real-time performance indicators.
* **Metadata Fields:** Company Name, Legal Status, Headquarters, Founding Date, Official URL, Followers Count, Last Verified Timestamp.
* **System Badges:** 
  - *Trust Score (0.0 - 1.0):* Calculated from source consensus and citation trails.
  - *Verification Level:* `UNVERIFIED`, `PENDING`, or `VERIFIED`.

### Module 2: Corporate Overview
* **Purpose:** Synthesizes the core business mechanics and strategy.
* **Information Priority:** Mission Statement, Founding Story, Monetization / Business Model, Target Markets, Core Audience, Key Historical Milestones.

### Module 3: Live News Feed
* **Purpose:** Serves real-time updates regarding the company without chronological noise.
* **Information Priority:** Breaking Announcements, Product Releases, Strategic Partnerships, Mergers & Acquisitions.
* **Fuzzy Filtering:** Users can filter news streams by intent (e.g., "Only show product updates", "Only show funding reports").

### Module 4: Product Registry
* **Purpose:** Catalogues all commercial and open-source software/hardware offerings.
* **Metadata Fields:** Product Name, Category Badge, Release Date, Development Status (`ACTIVE`, `DEPRECATED`, `BETA`), Popularity Index, URL Anchor.

### Module 5: AI Models Registry
* **Purpose:** A structured registry detailing every artificial intelligence model developed by the company.
* **Metadata Fields:** Model Name, Parameter Size, Context Window, Weights Availability (`OPEN`, `CLOSED`, `SEMI-OPEN`), Licensing, API Pricing.

### Module 6: Research Index
* **Purpose:** Aggregates academic output and intellectual property assets.
* **Information Priority:** Published Papers, Registered Patents, Academic Collaborations, Key Research Scholars, Aggregated Citation Counts.

### Module 7: Leadership Node
* **Purpose:** Maps the human network driving the organization.
* **Profiles Surfaced:** Founders, Active C-Suite Executives, Principal Researchers, Board Members, Key Investors.
* **Biographical Metadata:** Professional Background, Education, Linked Entities (previous companies founded/backed).

### Module 8: Funding Chronology
* **Purpose:** Synthesizes the capitalization history and capitalization flow of the firm.
* **Metadata Fields:** Funding Round (e.g., Series B), Capital Raised (USD), Pre-Money Valuation, Lead Investors, Participating Syndicates, Announcement Date.

### Module 9: Benchmark Tracker
* **Purpose:** Displays model performance scores across standardized, objective evaluation datasets.
* **Datasets Tracked:** GPQA, HumanEval, MMLU, MATH, GSM8K, SWE-bench.
* **Visual Presentation:** Dynamic horizontal comparisons contrasting the company’s models with their leading competitors.

### Module 10: Technology Stack
* **Purpose:** Details the infrastructure powering the company’s software products.
* **Categories Tracked:** Machine Learning Frameworks (PyTorch, JAX), Database Architecture, Cloud Providers, Primary Languages (Python, Rust, TypeScript).

### Module 11: GitHub Telemetry
* **Purpose:** Monitors open-source repository health and contributor velocity in real time.
* **Metrics Surfaced:** Repository Slugs, Total Stars, Commit Velocity (past 30 days), Active Contributors, PR Resolution Times, Major Issues.

### Module 12: Chrono Timeline
* **Purpose:** Renders an interactive historical timeline mapping milestones.
* **Visual Events:** Merging funding events, academic papers, product releases, and corporate restructurings in chronological order.

### Module 13: Knowledge Graph
* **Purpose:** Displays an interactive, force-directed visual network mapping the company's relationships.
* **Dynamic Nodes:** Connects the target Company Node to its competitor models, investors, subsidiaries, and featured research papers.

### Module 14: Competitor Tracker
* **Purpose:** High-density side-by-side matrices evaluating the company against its top 3 market competitors.
* **Comparison Dimensions:** Average Model Performance, Total Venture Capitalization, Product Completeness, Pricing Margins.

### Module 15: Partners Grid
* **Purpose:** Highlights strategic distribution, compute, and business relationships.
* **Categories:** Cloud Infrastructure Providers, Academic/University Labs, Strategic Enterprise Clients, Integration Channels.

### Module 16: Market Position
* **Purpose:** Renders competitive market metrics.
* **Visualizations:** Estimated Market Share graphs, Sector Rankings, and an analytical SWOT Matrix (Strengths, Weaknesses, Opportunities, Threats) compiled by expert analysts and verified by AI consensus.

### Module 17: Financial Overview
* **Purpose:** Synthesizes public financial metrics or estimated private market indicators.
* **Metrics Surfaced:** Projected Quarterly Revenue, Operational Burn Rate (estimated), Employee Growth Slopes, Estimated Capital Runway (months).

### Module 18: Media Center
* **Purpose:** Curates rich, deep-form secondary discussions.
* **Content Categorized:** CEO Interviews, Technical Keynotes, Developer Podcasts, Product Demonstrations.

### Module 19: AI Copilot Panel
* **Purpose:** Integrates the conversational assistant directly into the page workflow.
* **Default Prompt Shortcuts:** "Explain this company’s business model," "Compare their models with Anthropic," "Summarize their latest research papers."

### Module 20: Related Content
* **Purpose:** Drives downstream exploration and prevents user dead ends.
* **Suggested Nodes:** Related Startups, Next-step Learning Paths, Adjacent Research Papers, Associated Regulatory Guidelines.

---

## 4. Operational User Journeys & Flows

```
                          USER JOURNEY PIPELINES
┌────────────────────────────────────────────────────────────────────────┐
│ Journey 1: The Venture Capital Auditor                                 │
│ [Search Entry] ──► [Funding Chronology] ──► [SWOT] ──► [Export PDF]    │
├────────────────────────────────────────────────────────────────────────┤
│ Journey 2: The Machine Learning Engineer                               │
│ [Direct Link] ──► [Models Registry] ──► [Benchmarks] ──► [GitHub Code] │
└────────────────────────────────────────────────────────────────────────┘
```

### Journey 1: The Venture Capital Auditor (Conducting Due Diligence)
1. **Entry:** An investor searches for a rising startup using `Cmd+K` and navigates to `/company/cohere`.
2. **Analysis:** They jump straight to **Module 8 (Funding Chronology)** to examine the historical valuations and cap table.
3. **Strategy:** They scroll to **Module 16 (Market Position)** to review the SWOT matrix, evaluating Cohere’s strengths against OpenAI.
4. **Acquisitions:** They expand the competitor comparisons module to analyze market-share dynamics and growth velocity.
5. **Action:** Convinced, they save the complete profile as a PDF Report to share with their investment committee.

### Journey 2: The Machine Learning Engineer (Evaluating SDK Integrations)
1. **Entry:** A developer lands on `/company/anthropic` looking to evaluate model capabilities.
2. **Technical Check:** They scroll to **Module 5 (AI Models Registry)** to contrast API pricing matrices between Claude 3.5 Sonnet and Llama-3.
3. **Evaluation:** They review **Module 9 (Benchmark Tracker)**, validating how Anthropic performs on HumanEval for coding tasks.
4. **Code Inspection:** They click on **Module 11 (GitHub Telemetry)** to view active SDK repositories, checking commit rates and sample Python scripts.
5. **Action:** They bookmark Anthropic to their team's "API Evaluation" collection.

---

## 5. Conversational AI Copilot Capabilities

The integrated AI Assistant is bounded directly to the verified claims of the active company profile and neighboring Knowledge Graph nodes to eliminate hallucination risks.

```
┌─────────────────────────────────────────────────────────┐
│              COMPANY COPILOT CONSOLE                    │
├─────────────────────────────────────────────────────────┤
│ Ask a question about this company...                    │
├─────────────────────────────────────────────────────────┤
│  [💼 Business Analysis ]    [🔬 Technical Evaluation]   │
│  [📊 Competitor Matrix  ]    [🔮 Estimated Horizons ]   │
└─────────────────────────────────────────────────────────┘
```

* **The Strategy Summarizer:** Translates complex regulatory filings, S-1 SEC files, and corporate announcements into structured summaries, focusing on business impact, technical debt, and financial risk profiles.
* **Interactive Competitor Matrix:** Generates side-by-side charts comparing the company with rival organizations across hardware utilization, model accuracy, pricing models, and market capitalization.
* **Horizons Forecasting (Strict Constraints):** Evaluates existing quantitative parameters (commit velocity, hiring trends, funding history) to project upcoming releases and financial runway, clearly demarcated with error bars ($\pm \sigma$) to prevent hype propagation.

---

## 6. Advanced Data Visualizations

Data visualizations are designed to translate dense tabular information into actionable, structured intelligence.

* **Dynamic Force-Directed Knowledge Graph:** Built on high-performance Canvas libraries. Displays first-degree relationships (Subsidiaries, key employees, core models, primary investors). Hovering over any node highlights connection vectors with explicit verb descriptions (e.g., "Invested in Series B," "Forks model from").
* **Chronological Milestones Line:** Renders a clean, scrollable horizontal timeline mapping corporate milestones (releasing weights, legal restructurings, executive departures) dynamically linked to their corresponding Intelligence Reports.
* **Live Benchmark Radar Charts:** Visualizes multidimensional accuracy metrics across multiple dataset dimensions (Reasoning, Coding, Math, Vision, Multimodal), contrasting company capabilities with competitive models in real time.

---

## 7. Premium & Enterprise Intelligence Features

AI X offers advanced, analytical tools designed for professional researchers and enterprise decision-makers under our Premium tier:

* **Enterprise Alert Webhooks:** Users can save specific monitoring parameters and receive immediate Slack, Discord, or email alerts when data changes (e.g., "Alert my team if Cohere’s MMLU benchmark score increases or if they register a new LLM patent").
* **Archival Financial Datasets:** Unlocks access to historical ledger data, pre-money valuations, cap table breakdowns, and detailed pricing change logs.
* **Custom Enterprise Dashboards:** Allows teams to assemble custom comparison boards, combining private, internally generated metrics with public AI X Knowledge Graph nodes.

---

## 8. High-Performance Progressive Delivery

To ensure a fast, desktop-class navigation experience, the Company Intelligence System implements several optimization strategies:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        PROGRESSIVE DATA LAZY-LOADING                   │
├───────────────────┬──────────────────────────┬─────────────────────────┤
│ Phase 1: Shell    │ Render Static layout     │ Page structure paints in│
│                   │                          │ < 100ms                 │
├───────────────────┼──────────────────────────┼─────────────────────────┤
│ Phase 2: Metadata │ Hydrate text summaries   │ Reading content active  │
│                   │ and metrics              │ in < 250ms              │
├───────────────────┼──────────────────────────┼─────────────────────────┤
│ Phase 3: Graphs   │ Async load heavy charts  │ Visualizers complete    │
│                   │ and interactive networks │ rendering in background │
└───────────────────┴──────────────────────────┴─────────────────────────┘
```

* **Critical-Path Hydration:** The hero node, corporate description, and live news metrics are fetched and compiled in the initial server response, allowing the core layout to render in `< 100ms`.
* **Asynchronous Widget Rendering:** Heavy visual elements (such as Recharts line graphs and force-directed SVG graphs) are loaded lazily in the background after the user begins scrolling, minimizing initial network load.
* **Distributed Edge CDN Caching:** Frequently accessed company profiles, logo SVGs, and historical timelines are cached at the edge, reducing subsequent load times to `< 50ms`.

---

## 9. Accessibility, Contrast, & Design Standards (WCAG 2.1 AA)

1. **Typographic Contrast:** Maintains a strict minimum contrast ratio of **4.5:1** for all body texts and **3:1** for display typography.
2. **Accessible Keyboard Navigation:** Supported throughout the stage layout:
  - `Tab` / `Shift+Tab` to move sequentially between interactive action buttons and entity chips.
  - `Spacebar` / `Shift+Spacebar` for comfortable vertical page scrolling.
  - `Escape` to instantly close overlay chat consoles and sidebar popovers.
3. **Screen Reader Support:** All charts, graphs, and visual timelines feature programmatically updated `aria-label` descriptors.
4. **Touch Target Guidelines:** Mobile touch targets are kept above a minimum of **44x44px** with clear separation to ensure comfortable, error-free reading on smaller viewports.

---

## 10. Behavioral Analytics & Feedback Loop

We track comprehensive interaction telemetry to continuously optimize reading quality and content layouts:

* **Section Click-Through Rates (CTR):** Monitors which modules are pinned or collapsed most frequently, allowing the system to refine default layout structures based on user preferences.
* **Search Refinement Rate:** Tracks queries executed within the company search box to identify intelligence coverage gaps.
* **Compare Interaction Depth:** Measures how often users contrast specific companies to optimize competitive analysis matrices.

---

## 11. Core Database Schema & Relational Mapping

Corporate entities and relationships map directly to our polyglot transactional and graph persistence layers:

```json
{
  "entity_type": "COMPANY",
  "id": "co_9281a8c3",
  "name": "Anthropic",
  "aliases": ["Anthropic PBC", "Anthropic AI"],
  "domain": "anthropic.com",
  "hq_location": "San Francisco, CA",
  "trust_score": 0.96,
  "relationships": [
    {
      "relation_type": "DEVELOPED",
      "target_entity": "mod_claude_3_5_sonnet",
      "confidence_score": 1.0
    },
    {
      "relation_type": "FUNDED_BY",
      "target_entity": "co_amazon",
      "confidence_score": 1.0
    }
  ]
}
```

---

## 12. Future Hub Extensibility

The Company Intelligence System is architected to scale horizontally as new industry verticals are launched:

* **Polymorphic Template Engines:** Swaps domain-specific widgets based on the active hub vertical (e.g., swapping machine learning model registries and code commits for clinical trials, drug pipelines, and FDA approval timelines when entering the Biotech vertical).
* **Consolidated Graph Mapping:** Cross-hub entities preserve identical relational edge properties, enabling the system to map dependencies between technologies, business investments, and biological research papers seamlessly in a single knowledge base.
