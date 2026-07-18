# AI X — UNIVERSAL ENTITY SYSTEM SPECIFICATION
**Version:** 1.0  
**Status:** Approved for Core Architecture  
**Author:** Chief Ontologist, Principal Graph Architect, & UX Strategy Teams  
**Date:** July 16, 2026

---

## 1. Entity Philosophy: The Interconnected Knowledge Universe

Traditional content management systems (CMS) and data platforms are siloed by design. They treat different types of content—companies, models, academic papers, and articles—as completely separate database tables with custom, non-interoperable front-end views. This approach creates fragmented databases and isolated user experiences where relationships are hardcoded, unidirectional, and difficult to traverse.

**AI X completely rejects this siloed paradigm.** AI X is built from the ground up on the **Universal Entity System (UES)**. 

In this architecture, we do not design isolated "pages." Instead, we define **Intelligent Entities**. Every fundamental object in the AI X ecosystem—whether it is a multi-billion dollar company, a machine learning model, a research pre-print, an individual researcher, a hardware accelerator, or a regulatory framework—is a polymorphic instance of a single, highly integrated, graph-native Entity structure.

```
                   THE KNOWLEDGE GRAPH CONVERGENCE
┌───────────────────────────────────────────────────────────────────────┐
│                           [Universal Entity]                          │
├───────────────────────────────────┬───────────────────────────────────┤
│ Concrete Subtype: COMPANY         │ Concrete Subtype: AI MODEL        │
│ • "Anthropic"                     │ • "Claude 3.5 Sonnet"             │
├───────────────────────────────────┼───────────────────────────────────┤
│ Concrete Subtype: RESEARCH PAPER  │ Concrete Subtype: PERSON          │
│ • "Attention Is All You Need"     │ • "Dario Amodei"                  │
└───────────────────────────────────┴───────────────────────────────────┘
```

By standardizing all metadata, life-cycle events, historical timelines, and relationships under a single, unified schema, AI X achieves several critical product objectives:
* **Explorability Without Dead Ends:** Users can traverse infinite paths across the knowledge graph (e.g., Company → Model → Benchmark → Technology → Research Paper → Author → Investor) without ever encountering an unlinked plain-text name or a broken reference.
* **Unified Semantic Search:** Search queries scan a single, comprehensive entity index, enabling multi-dimensional semantic retrieval (e.g., searching for "Attention" returns the neural architecture technology, the original research paper, the primary authors, and the models utilizing it).
* **Automated AI Enrichment:** Because all entities inherit a standard schema structure, the AI Copilot can apply universal reasoning operations (summarization, comparative analysis, translation, and study guide generation) across any entity type instantly.
* **Infinite Horizontal Scalability:** New industry verticals and resource hubs (e.g., Biotech, Robotics, Cyber Security) plug into the existing architecture by simply defining new entity subtypes and relationship verbs, requiring zero modifications to the core layout engine.

---

## 2. Universal Entity Schema

To ensure strict database interoperability, mathematical consistency, and predictable API responses, every entity—regardless of its subtype—must implement the **Universal Entity Schema**.

```
                           UNIVERSAL SCHEMA BLOCK
┌───────────────────────────────────────────────────────────────────────┐
│ 1. Structural Identity (UUID, slug, type, canonical title, aliases)   │
├───────────────────────────────────────────────────────────────────────┤
│ 2. Telemetry & Trust (Trust Score, Freshness Score, Verification State)│
├───────────────────────────────────────────────────────────────────────┤
│ 3. Core Descriptions (Short summary, dynamic AI Executive Summary)   │
├───────────────────────────────────────────────────────────────────────┤
│ 4. Chrono-Timeline (Standard array of lifecycle event objects)       │
├───────────────────────────────────────────────────────────────────────┤
│ 5. Relational Adjacency (Verbs mapping node-to-node relationships)    │
└───────────────────────────────────────────────────────────────────────┘
```

### Universal JSON Schema Declaration

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "UniversalEntity",
  "type": "object",
  "required": [
    "id",
    "entity_type",
    "title",
    "slug",
    "short_summary",
    "trust_score",
    "freshness_score",
    "verification_status",
    "created_at",
    "updated_at"
  ],
  "properties": {
    "id": {
      "type": "string",
      "format": "uuid",
      "description": "Global unique identifier prefixing the entity subtype (e.g., ent_co_89a1b2c3)."
    },
    "entity_type": {
      "type": "string",
      "enum": [
        "COMPANY", "AI_MODEL", "RESEARCH_PAPER", "DATASET", "TECHNOLOGY",
        "FRAMEWORK", "PROGRAMMING_LANGUAGE", "API", "REPOSITORY", "BENCHMARK",
        "PERSON", "EVENT", "FUNDING_ROUND", "PRODUCT", "TOOL", "ARTICLE",
        "VIDEO", "PODCAST", "BOOK", "COURSE", "PATENT", "COUNTRY", "INDUSTRY",
        "REGULATION", "MARKET_TREND"
      ]
    },
    "title": {
      "type": "string",
      "description": "The canonical, public display name of the entity."
    },
    "subtitle": {
      "type": "string",
      "description": "A high-level secondary descriptor."
    },
    "slug": {
      "type": "string",
      "description": "URL-safe unique identifier (e.g., anthropic-claude-3-5-sonnet)."
    },
    "aliases": {
      "type": "array",
      "items": { "type": "string" },
      "description": "Alternative names or common typos for fuzzy matching (e.g., ['GPT5', 'GPT-V'])."
    },
    "short_summary": {
      "type": "string",
      "maxLength": 160,
      "description": "A concise, 160-character description optimized for SEO, cards, and previews."
    },
    "detailed_description": {
      "type": "string",
      "description": "Markdown-formatted long-form narrative outlining identity and context."
    },
    "hero_image_url": {
      "type": "string",
      "format": "uri"
    },
    "logo_url": {
      "type": "string",
      "format": "uri"
    },
    "tags": {
      "type": "array",
      "items": { "type": "string" }
    },
    "categories": {
      "type": "array",
      "items": { "type": "string" }
    },
    "status": {
      "type": "string",
      "description": "Operational lifecycle state (e.g., 'ACTIVE', 'DEPRECATED', 'STABLE', 'BETA')."
    },
    "trust_score": {
      "type": "number",
      "minimum": 0.0,
      "maximum": 1.0,
      "description": "Factual consensus multiplier calculated from source verification trails."
    },
    "popularity_score": {
      "type": "number",
      "minimum": 0.0,
      "maximum": 1.0,
      "description": "Programmatic tracking metric computed from search volume, bookmarks, and clicks."
    },
    "freshness_score": {
      "type": "number",
      "minimum": 0.0,
      "maximum": 1.0,
      "description": "Time-decay score indicating when the node's underlying data was last updated."
    },
    "verification_status": {
      "type": "string",
      "enum": ["UNVERIFIED", "PENDING", "VERIFIED"]
    },
    "created_at": {
      "type": "string",
      "format": "date-time"
    },
    "updated_at": {
      "type": "string",
      "format": "date-time"
    },
    "timeline": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["timestamp", "event_title", "event_description"],
        "properties": {
          "timestamp": { "type": "string", "format": "date-time" },
          "event_title": { "type": "string" },
          "event_description": { "type": "string" },
          "related_entity_ids": {
            "type": "array",
            "items": { "type": "string", "format": "uuid" }
          },
          "source_url": { "type": "string", "format": "uri" }
        }
      }
    },
    "ai_generated_summary": {
      "type": "object",
      "required": ["tldr", "why_it_matters", "key_takeaways"],
      "properties": {
        "tldr": { "type": "string" },
        "why_it_matters": { "type": "string" },
        "key_takeaways": {
          "type": "array",
          "items": { "type": "string" }
        }
      }
    },
    "official_website": {
      "type": "string",
      "format": "uri"
    },
    "external_resources": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["label", "url"],
        "properties": {
          "label": { "type": "string" },
          "url": { "type": "string", "format": "uri" }
        }
      }
    }
  }
}
```

---

## 3. Supported Entity Types

The architecture defines clear specifications for individual entity subtypes, outlining how specific domain-specific registries map back to our global Knowledge Graph.

```
                             ENTITY TYPOLOGY MAP
┌──────────────────────┬──────────────────────────┬──────────────────────┐
│ Technical Nodes      │ Financial & Org Nodes    │ Academic & Media     │
├──────────────────────┼──────────────────────────┼──────────────────────┤
│ • AI_MODEL           │ • COMPANY / STARTUP      │ • RESEARCH_PAPER     │
│ • TECHNOLOGY         │ • ENTERPRISE             │ • PATENT             │
│ • FRAMEWORK          │ • GOVERNMENT_AGENCY      │ • ARTICLE / REPORT   │
│ • API / REPOSITORY   │ • UNIVERSITY             │ • VIDEO / PODCAST    │
│ • BENCHMARK / DATASET│ • FUNDING_ROUND          │ • COURSE / BOOK      │
└──────────────────────┴──────────────────────────┴──────────────────────┘
```

### Core Typology Outlines
1. **AI_MODEL:** Represents artificial intelligence systems. Requires specific parameters including parameter count, context window limits, weights openness state, API pricing matrices, and license declarations.
2. **COMPANY / STARTUP / ENTERPRISE:** Represents commercial organizations. Tracks capitalization records, founding details, employee growth velocities, headquarters locations, and subsidiary profiles.
3. **RESEARCH_PAPER:** Represents academic publications and pre-prints. Tracks author indexes, bibliography citations, ArXiv references, abstract texts, and dataset associations.
4. **BENCHMARK:** Represents standardized quantitative performance evaluations. Tracks metrics, leaderboard rankings, evaluation criteria, and related hardware details.
5. **PERSON (Researcher, Founder, Investor):** Represents human agents driving innovation. Mapped with current roles, historical employers, educational backgrounds, published works, and co-founder relationships.
6. **REGULATION / LAW:** Represents international policy files (e.g., "EU AI Act"). Tracks jurisdictional scopes, compliance deadlines, penalty structures, and associated corporate entities.

---

## 4. Relationship Architecture: Many-to-Many Semantic Triples

Entities do not exist in isolation; their intelligence comes from their connections. In AI X, relationships are treated as first-class citizens, represented in our persistent graph layer as structured **triples** (Subject $\rightarrow$ Predicate $\rightarrow$ Object).

```
                      REPRESENTATION OF A SEMANTIC TRIPLE
     ┌──────────────────┐       ┌────────────────┐       ┌──────────────────┐
     │  Subject Entity  ├──────►│ Relationship   ├──────►│  Target Entity   │
     │     (OpenAI)     │       │ (DEVELOPED_BY) │       │     (GPT-5)      │
     └──────────────────┘       └────────────────┘       └──────────────────┘
```

Every relationship carries directionality, confidence weights, and contextual metadata.

### Standard Predicates & Directed Verbs

| Subject Type | Predicate (Verb) | Object Type | Description |
| :--- | :--- | :--- | :--- |
| **COMPANY** | `DEVELOPED` | **AI_MODEL** | Links a company to its proprietary or open-weights models. |
| **COMPANY** | `ACQUIRED` | **COMPANY** | Tracks mergers, acquisitions, and consolidated market entities. |
| **RESEARCH_PAPER** | `INTRODUCED` | **TECHNOLOGY** | Connects an academic paper to the underlying neural architecture. |
| **RESEARCH_PAPER** | `USES` | **DATASET** | Maps training and validation data utilized during evaluation. |
| **PERSON** | `FOUNDED` | **COMPANY** | Identifies entrepreneurial connections and leadership histories. |
| **AI_MODEL** | `EVALUATED_ON` | **BENCHMARK** | Associates a specific machine learning system with test benchmarks. |
| **COMPANY** | `PARTNERED_WITH` | **COMPANY** | Renders commercial joint ventures and strategic alliances. |
| **AI_MODEL** | `DESTRUCTIVELY_AFFECTS`| **MARKET_TREND**| Evaluates automation risk profiles across industry verticals. |

### Relational Schema Definition
Each connection is managed by a structured ledger to guarantee auditable verification trails:

```json
{
  "relationship_id": "rel_7c8192a3",
  "subject_id": "ent_co_001928ab", // OpenAI
  "predicate": "DEVELOPED",
  "object_id": "ent_mod_1827cf12", // GPT-5
  "confidence_score": 1.0,
  "last_verified_by": "trust_engine_v1.2",
  "source_citations": [
    {
      "source_title": "OpenAI Official Blog — GPT-5 Launch Announcement",
      "source_url": "https://openai.com/blog/gpt-5"
    }
  ]
}
```

---

## 5. Universal Entity Page Template

Every entity page automatically resolves to a highly structured, three-column analytical workspace. Rather than writing custom templates for every page, our unified grid system dynamically hydrates panels based on the active entity's type and its populated schema fields.

```
┌───────────────────────────────────────────────────────────────────────┐
│                    DYNAMICAL GRID VIEWPORT (Desktop)                  │
├───────────────────────────────────────────────────────────────────────┤
│ Header: Hero Metadata Stage (Full Width)                              │
│ [Name, Subtitle, Trust/Freshness Badges, Action Row: Follow & Compare]│
├───────────────────────┬──────────────────────────┬────────────────────┤
│ Column 1: Context Rail │ Column 2: Center Stage   │ Column 3: Copilot  │
│                       │                          │                    │
│ • Local Sub-Navigation│ • Dynamic Panels         │ • Interactive Chat │
│   Shortcuts           │   (Overview, History,    │   Bounded Console  │
│                       │    Media, Tables)        │                    │
│ • Quick Actions       │                          │ • Force-Directed   │
│                       │ • Visual Timeline        │   Relationship Map │
│ • Saved Collections   │                          │                    │
│ • Bibliography Logs   │ • Associated Documents   │ • Watchlist Widget │
└───────────────────────┴──────────────────────────┴────────────────────┘
```

### Workspace Composition Rules
1. **Column 1: Context & Local Controls (Width: 2 Columns):**
   - Holds the sticky **In-Page Anchor List** allowing users to jump directly to active modules.
   - Hosts the **Saved Collections Builder** and **Universal Download / Print Panel**.
2. **Column 2: Core Analytical Stage (Width: 7 Columns):**
   - Focuses entirely on clear reading typography and high-density quantitative visualizers.
   - Displays the **Dynamic Timeline**, **Benchmark Radar Charts**, **Product Ecosystem Trees**, and raw **Tabular Evaluations**.
3. **Column 3: Active Telemetry Rail (Width: 3 Columns):**
   - The interactive assistant console. Hosts the **AI Copilot**, the dynamic force-directed **Relationship Graph**, and **Trending Leaderboards**.

---

## 6. Real-Time AI Enrichment & Persona Engines

Every entity page integrates a server-side AI model to synthesize information and adapt the complexity of the content to match the user's explicit professional level.

```
                          AI ENRICHMENT PIPELINES
┌───────────────────────────────────────────────────────────────────────┐
│ Raw Schema Data ────► AI Synthesizer ────► Role-Specific Customization│
│                                           ├─► DEVELOPER View (API/Code)│
│                                           ├─► INVESTOR View (Cap/SWOT) │
│                                           └─► ACADEMIC View (Papers)  │
└───────────────────────────────────────────────────────────────────────┘
```

### Multi-Dimensional Explanations
* **Beginner Explanation:** Compiles the concept using clean analogies and high-level descriptions (e.g., explaining transformer networks using "stamping machines on an assembly line").
* **Expert Explanation:** Hydrates the workspace with deep mathematical formulations, technical code fragments, and underlying infrastructure details.
* **Persona Adapters:**
  - *Developer:* Prioritizes open-source metrics, dependency trees, framework updates, and executable code sandboxes.
  - *Investor:* Surfaces pre-money funding rounds, employee change metrics, market share projections, and strategic risk analyses.
  - *Researcher:* Highlights citation indexes, reference linkages, academic prerequisites, and unresolved scientific questions.

---

## 7. The Comparison Engine: Multi-Entity Evaluator

The comparison engine allows users to evaluate any two compatible entities side-by-side. The interface automatically aligns comparable schema attributes into a high-density, high-contrast grid.

```
                          THE COMPARISON CANVAS
┌───────────────────────────────────────────────────────────────────────┐
│ Attribute               │ Entity A (GPT-4o)      │ Entity B (Claude 3.5) │
├─────────────────────────┼────────────────────────┼───────────────────────┤
│ Trust Score             │ 0.96                   │ 0.98                  │
│ Context Window          │ 128k tokens            │ 200k tokens           │
│ API Pricing (Input/1M)  │ $5.00                  │ $3.00                 │
│ MMLU Accuracy           │ 88.7%                  │ 88.6%                 │
└─────────────────────────┴────────────────────────┴───────────────────────┘
```

### Comparison Engine Features
* **Compatibility Matching:** The engine checks entity types. If a user drags two incompatible types together (e.g., comparing a company with a research paper), the interface displays a clean, friendly notification explaining that comparisons require similar subtypes.
* **Dynamic Variable Alignment:** Aligning dynamic fields in real time (e.g., contrasting GitHub star volumes for open-source repositories or pre-money valuations for funding rounds).
* **Exportable Intelligence Sheets:** Multi-variable comparisons can be instantly exported as clean Markdown tables, high-fidelity PDFs, or standard CSV files for offline team reviews.

---

## 8. The Discovery & Recommendation System

AI X utilizes a non-deterministic, graph-based recommendation algorithm to guide users through the information landscape, ensuring continuous learning and high session engagement.

* **Similar Entity Mapping:** Automatically identifies and lists similar nodes based on shared tags, categories, and overlapping parent relationships (e.g., viewing PyTorch suggests JAX and TensorFlow).
* **Related Entity Navigation:** Surfaces adjacent nodes connected in the Knowledge Graph (e.g., viewing an article about LLM safety highlights the associated EU AI Act entity chip).
* **Anti-Echo Chamber Safeness:** To prevent cognitive silos, every third recommendation is selected from outside the user's primary professional category (e.g., suggesting a technical AI safety paper to a VC investor, or an enterprise compliance guideline to a software developer).

---

## 9. Unified Search Integration

The Universal Entity System consolidates search inputs into a single, high-fidelity query processing system, replacing fragmented, site-wide search tools.

```
                         UNIFIED SEARCH INTERFACES
┌───────────────────────────────────────────────────────────────────────┐
│  Search command...                                     [Cmd+K] / [ / ]│
├───────────────────────────────────────────────────────────────────────┤
│  [Entity Type Filter: AI_MODEL ]  [Trust Filter: > 0.90 ]            │
└───────────────────────────────────────────────────────────────────────┘
```

* **Instant Fuzzy Matching:** Scans the global canonical title and aliases indexes in real time, delivering accurate results within `< 15ms` of the first keypress.
* **Semantic Vector Retrieval:** Supports natural language commands (e.g., "Find companies building open-weights models that raised a Series A").
* **In-Page Module Filtering:** Pressing `Ctrl+F` or `Cmd+F` inside an active entity page opens a targeted search modal that scans only the sections, research papers, or timeline events associated with that specific entity.

---

## 10. Behavioral Analytics & Interaction Telemetry

To ensure continuous optimization of layouts and data prioritization, AI X tracks interaction telemetry while strictly respecting user privacy.

* **Tracking Metrics:**
  - *Reading Depth / Scroll Depth:* Tracks progress percentages on long-form entity narratives.
  - *Entity Click-Through Rates (CTR):* Measures engagement with embedded tags and timeline chips.
  - *Copilot Question Volumes:* Analyzes user queries to identify information gaps in the core database.
  - *Comparison Frequencies:* Tracks which entities are contrasted most often to refine default dashboard configurations.
* **Privacy Controls:** All behavioral data is aggregated and anonymized. Users can disable telemetry tracking in their security settings.

---

## 11. Security & Permissions Architecture

The Universal Entity System uses a role-based access control (RBAC) layer to protect proprietary corporate records, manage enterprise team workspaces, and ensure platform safety.

```
                          ACCESS CONTROL MATRIX
┌───────────────────────────────────────────────────────────────────────┐
│ Role                    │ Read  │ Write │ Verify │ Admin Controls     │
├─────────────────────────┼───────┼───────┼────────┼────────────────────┤
│ Public / Guest          │ Yes   │ No    │ No     │ No                 │
│ Registered User         │ Yes   │ No    │ No     │ No                 │
│ Contributor / Scholar   │ Yes   │ Draft │ No     │ No                 │
│ Verified Expert / Mod   │ Yes   │ Yes   │ Yes    │ No                 │
│ Site Administrator      │ Yes   │ Yes   │ Yes    │ Yes                │
└─────────────────────────┴───────┴───────┴────────┴────────────────────┘
```

### Security Rules
* **Scholarly Collaboration:** Registered scholars and domain experts can submit edit proposals. These changes are saved in a pending draft state until verified by a moderator.
* **Archival Locking:** Critical fields (Trust Scores, verification badges, funding histories) are programmatically locked and can only be updated by verified system administrators and algorithmic integration agents.

---

## 12. Performance & Asset Delivery Strategies

To ensure instant loading times and smooth interactions across all client devices, the platform implements several rendering optimization patterns.

* **Progressive Hydration Flow:**
  1. *Core Paint (< 100ms):* Renders the basic layout structure, text summaries, and high-contrast styling frames.
  2. *Metadata Hydration (< 250ms):* Activates interactive buttons, follow toggles, search bars, and entity chips.
  3. *Graphic Rendering (< 500ms):* Lazily loads and renders complex SVG network graphs, Recharts line charts, and visual timelines.
* **Distributed Edge CDN Caching:** Frequently accessed entity configurations and company logos are cached at global edge locations, reducing subsequent load times to `< 50ms`.
* **Asset Optimization:** Renders all vector layouts and system logos using SVG paths and optimized WebP raster formats to minimize network bandwidth usage.

---

## 13. System Scalability

The Universal Entity System is engineered to handle massive data complexity, supporting:
* **1 Billion Entities:** Scalable across distributed storage nodes, managed with indexing fields.
* **100 Billion Relationships:** Graph adjacency structures optimized for sub-millisecond retrieval.
* **Thousands of Subtypes:** Modular configurations that fit into the main system layout without requiring database migrations.
* **Real-time Synchronization:** Sub-second updates for GitHub commits, live funding announcements, and benchmark modifications.

---

## 14. Quality Standards Checklist

Every new entity must automatically satisfy the following requirements before publication:
* **Rich Metadata:** All mandatory schema fields (IDs, titles, trust indicators, short summaries) must be fully populated.
* **Explicit Relationships:** Must connect to at least two existing Knowledge Graph nodes (no orphan nodes allowed).
* **AI summaries:** Standard, pre-compiled TL;DR blocks and role-based summaries must be available in the cache.
* **Visual Timelines:** Historical timelines must contain at least three verified milestones with source citations.
* **Universal Accessibility:** Contrasts, keyboard controls, and ARIA labels must meet WCAG 2.1 AA design specifications.

---

## 15. Future Expansion & Domain Plugins

The system is designed to scale horizontally as new intelligence verticals are launched, requiring zero changes to core services.

```
                      MODULAR PLUG-IN PATTERN
     ┌─────────────────────────────────────────────────────────┐
     │              CORE UNIVERSAL ENTITY SYSTEM               │
     └────────────────────────────┬────────────────────────────┘
                                  ▼
     ┌─────────────────────────────────────────────────────────┐
     │                VERTICAL DOMAIN PLUG-INS                 │
     │   [ Biotech Plugin ]  [ Finance Plugin ]  [ Space ]    │
     └────────────────────────────┬────────────────────────────┘
                                  ▼
     ┌─────────────────────────────────────────────────────────┐
     │                 DOMAIN-SPECIFIC ENGINES                 │
     │ • FDA trials, patents   • Stocks, ledgers   • Orbits    │
     └─────────────────────────────────────────────────────────┘
```

* **Domain-Specific Registry Modules:** When introducing a new vertical (e.g., Biotech), developers simply create a localized schema extension (e.g., tracking clinical trial phases, chemical formulas, and FDA approval dates).
* **Universal Navigation Preservation:** Toggling focus modes preserves the primary grid layout but updates the center-stage widgets to display vertical-specific telemetry, ensuring a consistent user experience across the platform.
