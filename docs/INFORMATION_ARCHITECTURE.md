# AI X — INFORMATION ARCHITECTURE & PRODUCT STRUCTURE
**Version:** 1.0  
**Status:** Architecture Design  
**Author:** UX & IA Architecture Team (Principal Information Architect, VP of Product Strategy)  
**Date:** July 16, 2026

---

## 1. Information Architecture Philosophy

A world-class intelligence platform must never let a user reach a intellectual dead-end. The structural goal of AI X is **Invisible Navigation** and **Radical Interconnectivity**. Everything—every company, model, scientific benchmark, funding event, and software release—is modeled as a distinct node in a unified, multidimensional schema.

```
                  ┌──────────────────────────────────────────────┐
                  │                 GLOBAL STAGE                 │
                  │                 Command Desk                 │
                  └──────────────────────┬───────────────────────┘
                                         ▼
                  ┌──────────────────────────────────────────────┐
                  │              INTELLIGENCE HUBS               │
                  │       (AI, Finance, Bio, Cybersecurity)      │
                  └──────────────────────┬───────────────────────┘
                                         ▼
                  ┌──────────────────────────────────────────────┐
                  │               ENTITY DOSSIERS                │
                  │       (Company, Model, Benchmark Node)       │
                  └──────────────────────┬───────────────────────┘
                                         ▼
                  ┌──────────────────────────────────────────────┐
                  │              INTELLIGENCE LEADS              │
                  │       (Dynamic cross-linked references)      │
                  └──────────────────────────────────────────────┘
```

---

## 2. Global Product Hierarchy

We structure intelligence into five strict structural tiers to support scaling from single reports to millions of records.

```
[Level 1: Platform Global Stage]
  └── [Level 2: Specialization Hubs]
        └── [Level 3: Editorial & Analytical Feeds]
              └── [Level 4: Entity Dossiers]
                    └── [Level 5: Micro-Metrics & Evidence Logs]
```

### Hierarchical Breakdown
1. **Level 1: Platform Global Stage (The Command Desk):** The unified entry point. Aggregates breaking global shifts across all hubs, trending searches, and the master command search bar.
2. **Level 2: Specialization Hubs (The Verticals):** Isolated industry dashboards (e.g., AI Intelligence, Financial Intelligence). Standardizes core telemetry parameters according to the vertical.
3. **Level 3: Editorial & Analytical Feeds (The Streams):** Curated analysis loops, dynamic lists, and curated benchmark leaderboards.
4. **Level 4: Entity Dossiers (The Core Nodes):** Individual profile cards/views for structural actors: Companies (`/company/*`), Models (`/model/*`), Research Papers (`/paper/*`), and People (`/profile/*`).
5. **Level 5: Micro-Metrics & Evidence Logs (The Vertices):** Inline benchmark values, historic funding records, code commits, and citation links.

---

## 3. The Entity System & Metadata Schema

Entities are the fundamental nouns of the AI X platform. Each entity has a strict metadata schema, parent relationships, and navigation mappings.

### A. Company Entity (`Entity: Company`)
* **Purpose:** Represents commercial and non-profit organizations driving industry development.
* **Fields:** Company Name, HQ Location, Funding Total, CEO, Employee Count, GitHub Organization, Stock Symbol (optional), Bio.
* **Parent Objects:** `None` / `Industry Vertical`
* **Child Objects:** `Entity: Model`, `Entity: FundingRound`, `Entity: Product`
* **Outgoing Relationships:** *Employs* (`Entity: Person`), *Forks* (`Entity: OpenSourceProject`), *Releases* (`Entity: ResearchPaper`).

### B. Model Entity (`Entity: Model`)
* **Purpose:** Represents machine learning algorithms, architectural structures, and software models.
* **Fields:** Model Name, Parameter Count, Context Window, License (Open/Proprietary), Release Date, Release Paper, Hosted API Endpoint.
* **Parent Objects:** `Entity: Company`
* **Child Objects:** `Entity: BenchmarkResult`, `Entity: DeploymentConfig`
* **Outgoing Relationships:** *EvaluatedOn* (`Entity: Dataset`), *ForksFrom* (`Entity: Model`).

### C. Benchmark Entity (`Entity: Benchmark`)
* **Purpose:** Represents academic or community-recognized evaluation datasets.
* **Fields:** Benchmark Name, Creator, Metric Type (Accuracy, MMLU, F1), Launch Date, Github Link.
* **Parent Objects:** `None`
* **Child Objects:** `Entity: BenchmarkResult`
* **Outgoing Relationships:** *Cites* (`Entity: ResearchPaper`).

---

## 4. Relationship Architecture (The Web of Truth)

An entity is only as valuable as the connections it makes. Below is the relational mapping of a typical tech release.

```
       ┌────────────────────────┐
       │   Entity: Company      ├───────┐
       │     (Anthropic)        │       │ Employs
       └───────────┬────────────┘       ▼
                   │            ┌──────────────┐
                   │ Releases   │Entity: Person│
                   ▼            │ (Dario A.)   │
       ┌────────────────────────┐└──────────────┘
       │    Entity: Model       │
       │  (Claude 3.5 Sonnet)   │
       └───────────┬────────────┘
                   │
                   ├────────────────────────────┐ EvaluatedOn
                   ▼                            ▼
         ┌───────────────────┐        ┌───────────────────┐
         │  Entity: Paper    │        │ Entity: Benchmark │
         │ (Sonnet-3.5.pdf)  │        │      (MMLU)       │
         └───────────────────┘        └───────────────────┘
```

Every page renders these relationships in active sidebars, allowing users to pivot instantly from a research paper to the company that funded it, the engineers who wrote it, or the benchmark score it achieved.

---

## 5. Navigation & URL Architecture

To maintain search engine discoverability and intuitive folder mapping, URLs are strictly flat, logical, and human-readable.

### URL Mapping Structure

| Context | URL Pattern | Example URL |
| :--- | :--- | :--- |
| **Global Stage** | `/` | `https://aix.com/` |
| **Hub Home** | `/[hub-id]` | `https://aix.com/ai` |
| **Company Node** | `/company/[company-slug]` | `https://aix.com/company/openai` |
| **Model Node** | `/model/[model-slug]` | `https://aix.com/model/claude-3-5-sonnet` |
| **Research Node** | `/paper/[paper-slug]` | `https://aix.com/paper/attention-is-all-you-need` |
| **Benchmark List**| `/benchmarks` | `https://aix.com/benchmarks` |
| **Timelines** | `/timeline/[timeline-slug]` | `https://aix.com/timeline/generative-ai-funding` |
| **Custom Space** | `/workspace/[user-id]` | `https://aix.com/workspace/usr-928` |

---

## 6. Information Layout Strategy (Bento Grid)

We use a modular 12-column bento-grid structure for our dashboards, allocating space based on the analytical weight of the data:

```
┌────────────────────────────────────────────────────────────────────────┐
│                              12-Column Grid                            │
├───────────────────────────────┬────────────────────────────────────────┤
│ Col 1-8: Major Telemetry      │ Col 9-12: Secondary Context            │
│ • Live Interactive Chart      │ • Metadata Profile Card                │
│ • Long-form Research text     │ • Key Relationships List               │
│ • Dense list of events        │ • Live Event Feed                      │
└───────────────────────────────┴────────────────────────────────────────┘
```

---

## 7. Operational User Journeys

### Journey 1: The Research Deep Dive
1. **Entry:** User arrives on a Google-linked article page about a new model launch: `/article/gpt-5-release-details`.
2. **Context Pivot:** User notices the **Model Card** widget in the sidebar and clicks `/model/gpt-5`.
3. **Technical Exploration:** On the model page, the user scrolls to the **Benchmark Performance** panel. They click the `GPQA` benchmark card: `/benchmarks/gpqa`.
4. **Academics:** On the GPQA page, they read the benchmark documentation and find the original academic paper introducing it: `/paper/gpqa-graduate-qa-dataset`.
5. **Collection:** Satisfied, they hit `Cmd+D` to bookmark the entire chain to their private AI research workspace collection.

### Journey 2: The Competitor Intelligence Audit
1. **Entry:** User opens the Command Palette via `Cmd+K` from their workspace.
2. **Search:** Types "Anthropic Funding" and hits Enter.
3. **Timeline Landing:** Lands directly on `/timeline/anthropic-funding-milestones`.
4. **Relational Drilling:** Views the timeline nodes, sees the investors behind the Series C round, and pivots to an investor’s portfolio page: `/company/menlo-ventures`.
5. **Export:** Filters Menlo Ventures' portfolio for "Generative AI Infrastructure," exports the aggregated company and model lists to CSV.

---

## 8. IA Architecture Scaling & Risks

### A. Entity Duplication & Naming Collision
* *Risk:* Multiple companies named "Cortex" or models named "V4" confuse search algorithms and users.
* *Mitigation:* Schema-level unique IDs and localized slug namespaces. Companies require registration domains (e.g., `cortex.ai` vs `cortex.com`) as unique constraints. Models are prepended by their creator’s slug (e.g., `openai/gpt-4` vs `microsoft/gpt-4`).

### B. High Relationship Complexity (Graph Bloat)
* *Risk:* Having thousands of relationships (edges) on a single screen crashes browser-side SVG rendering and increases layout latency.
* *Mitigation:* Progressive edge discovery. Only render primary connections (distance 1) by default, loading secondary relationships on demand via hover drawers or explicit click pivots.
