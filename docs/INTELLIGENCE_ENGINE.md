# AI X — KNOWLEDGE GRAPH & INTELLIGENCE ENGINE SPECIFICATION
**Version:** 1.0  
**Status:** Architecture Blueprint  
**Author:** Chief Data Architect, Chief AI Officer, & Knowledge Graph Architect  
**Date:** July 16, 2026

---

## 1. Executive Introduction & Architectural Philosophy

### Information is Commodities; Connected Information is Intelligence
In traditional content architectures, data points exist as isolated rows in transactional databases or static entries inside Content Management Systems (CMS). An article describes a company; a database row records a funding round; an academic index hosts a PDF. 

**AI X rejects this fragmented paradigm.** The AI X Intelligence Engine models the entire industrial landscape as a single, living, multidimensional **Knowledge Graph**. Every entity—whether a company, a machine learning model, an academic paper, an API, or an investor—is a first-class node in our network. These nodes do not exist in isolation; they are defined by their relationships.

```
                  ┌──────────────────────────────────────────────┐
                  │          THE MULTIDIMENSIONAL SCHEMA         │
                  ├──────────────────────┬───────────────────────┤
                  │     Entities (Nodes) │    Relations (Edges)  │
                  │     • Companies      │    • CreatedBy        │
                  │     • AI Models      │    • CompetesWith     │
                  │     • Benchmarks     │    • EvaluatedOn      │
                  │     • Research       │    • FundedBy         │
                  └──────────────────────┴───────────────────────┘
```

Our architectural goal is **compounding enrichment**. Every time a new node is ingested or an edge is drawn, the semantic value of all neighboring nodes increases. By establishing a unified schema, AI X maps the upstream causes and downstream effects of every event in the industry.

---

## 2. Core Entity Schemas & Metadata Specifications

Each node in the AI X Knowledge Graph inherits properties from a base `Entity` type and implements a specific, structured metadata schema.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Entity Common Ancestor Schema                   │
├───────────────────┬───────────────────┬────────────────────────────────┤
│ property_id       │ UUID v4           │ Global Unique Identifier       │
│ name              │ String            │ Display name of the Entity     │
│ aliases           │ Array[String]     │ Synonyms, acronyms, brand names│
│ trust_score       │ Float (0.0 - 1.0) │ Aggregated credibility metric   │
│ verification      │ Enum              │ UNVERIFIED, PENDING, VERIFIED  │
│ created_at        │ Timestamp         │ Database insertion record      │
│ updated_at        │ Timestamp         │ Last structural sync record    │
└───────────────────┴───────────────────┴────────────────────────────────┘
```

### A. Company Entity (`Entity: Company`)
* **Metadata Schema:**
  ```json
  {
    "domain": "String (Unique Key, e.g., anthropic.com)",
    "founding_date": "Date",
    "hq_location": "Geopoint",
    "funding_total_usd": "Decimal",
    "legal_structure": "Enum (C_CORP, LLC, NON_PROFIT, PUBLIC)",
    "employee_count_estimate": "Integer",
    "github_organizations": "Array[String]",
    "sec_cik": "String (Optional)"
  }
  ```

### B. AI Model Entity (`Entity: AIModel`)
* **Metadata Schema:**
  ```json
  {
    "model_creator_id": "UUID (Foreign key to Entity: Company/Organization)",
    "parameter_count": "Long (e.g., 405000000000)",
    "context_window_tokens": "Integer",
    "license_type": "String (e.g., Apache-2.0, Proprietary)",
    "weights_availability": "Enum (OPEN, CLOSED, SEMI_OPEN)",
    "release_date": "Date",
    "base_architecture": "String (e.g., Dense Transformer, MoE)",
    "pricing_per_1m_tokens_input_usd": "Decimal",
    "pricing_per_1m_tokens_output_usd": "Decimal"
  }
  ```

### C. Research Paper Entity (`Entity: ResearchPaper`)
* **Metadata Schema:**
  ```json
  {
    "arxiv_id": "String (Optional, e.g., 1706.03762)",
    "doi": "String (Optional)",
    "authors": "Array[String]",
    "publication_date": "Date",
    "abstract": "Text",
    "pdf_url": "String",
    "citation_count": "Integer",
    "primary_field": "String"
  }
  ```

### D. Benchmark Entity (`Entity: Benchmark`)
* **Metadata Schema:**
  ```json
  {
    "creator_id": "UUID (Optional)",
    "metric_definition": "String (e.g., 5-shot MMLU Accuracy)",
    "evaluation_type": "Enum (AUTOMATED, HUMAN, LLM_AS_A_JUDGE)",
    "target_capability": "String (e.g., Mathematical Reasoning, Coding)"
  }
  ```

### E. Funding Round Entity (`Entity: FundingRound`)
* **Metadata Schema:**
  ```json
  {
    "company_id": "UUID (Recipient)",
    "round_type": "Enum (SEED, SERIES_A, SERIES_B, GROWTH, PRIVATE_EQUITY)",
    "amount_raised_usd": "Decimal",
    "pre_money_valuation_usd": "Decimal (Optional)",
    "announcement_date": "Date"
  }
  ```

---

## 3. Relationship Architecture & Edge Taxonomy

Edges represent semantic verbs connecting our entity nouns. Every relationship in AI X is directed, typed, timestamped, and decorated with properties detailing the nature of the link.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Graph Edge Definition Schema                    │
├───────────────────┬───────────────────┬────────────────────────────────┤
│ edge_id           │ UUID v4           │ Unique identifier of relation  │
│ source_id         │ UUID v4           │ Tail Entity ID                 │
│ target_id         │ UUID v4           │ Head Entity ID                 │
│ relation_type     │ Enum              │ Strict relationship classifier │
│ weight            │ Float (0.0 - 1.0) │ Relationship strength / relevance│
│ confidence_score  │ Float (0.0 - 1.0) │ Verification level of link     │
│ active_span       │ TimeRange         │ Start/End temporal validity    │
└───────────────────┴───────────────────┴────────────────────────────────┘
```

### Edge Taxonomy Matrix

| Relation Type | Source Entity (`Tail`) | Target Entity (`Head`) | Description |
| :--- | :--- | :--- | :--- |
| `DEVELOPED_BY` | `Entity: AIModel` | `Entity: Company` | Maps model development to parent firm. |
| `COMPETES_WITH`| `Entity: AIModel` | `Entity: AIModel` | Declares functional or target market equivalence. |
| `FORKS_FROM` | `Entity: AIModel` | `Entity: AIModel` | Represents fine-tunes, merges, or structural derivatives. |
| `INVESTED_IN` | `Entity: Company` (VC) | `Entity: FundingRound` | Identifies backing syndicates and investment flows. |
| `EVALUATED_ON` | `Entity: AIModel` | `Entity: Benchmark` | Stores specific test evaluations and metrics. |
| `INTRODUCED_BY`| `Entity: AIModel` | `Entity: ResearchPaper`| Links model creation to original academic publication. |
| `CITES` | `Entity: ResearchPaper`| `Entity: ResearchPaper`| Captures research references and intellectual lineage. |

---

## 4. Knowledge Graph Architecture & Storage Strategy

AI X implements a **Polyglot Persistence Layer** to optimize both tabular transactional writes and deep, multi-hop relationship traversals.

```
                                  ┌───────────────────┐
                                  │   API REQUESTS    │
                                  └─────────┬─────────┘
                                            │
                   ┌────────────────────────┴────────────────────────┐
                   ▼                                                 ▼
      ┌─────────────────────────┐                       ┌─────────────────────────┐
      │   GRAPH DATABASE LAYER  │                       │ RELATIONAL TABLE LAYER  │
      │   (AWS Neptune / Neo4j) │                       │  (PostgreSQL + pgvector)│
      ├─────────────────────────┤                       ├─────────────────────────┤
      │ • Path Traversals       │                       │ • Transactional Writes  │
      │ • N-hop Relationship    │                       │ • Metadata Lookups      │
      │ • Graph Clustering      │                       │ • Vector Search         │
      └─────────────────────────┘                       └─────────────────────────┘
```

### Detailed Layer Breakdown
1. **Graph Database Layer (Neo4j / AWS Neptune):**
   - Optimized for query path traversals (e.g., "Find all VC firms that invested in companies building transformer-based coding models evaluated on HumanEval").
   - Implements Cypher / Gremlin queries to traverse edges in $O(1)$ complexity regardless of database size.
2. **Relational Database Layer (PostgreSQL with CockroachDB for Enterprise):**
   - Stores master-record metadata fields, system configs, user profile records, and transaction states.
   - Leverages **pgvector** to store high-dimensional embeddings of text snippets, models, and company descriptions for vector proximity searches.
3. **Data Syncer Daemon:**
   - A highly optimized write-ahead log system that ensures changes written to PostgreSQL are transactional, while asynchronously updating Neptune index edges in `< 100ms`.

---

## 5. The Trust Engine & Verification Matrix

The ultimate currency of an Intelligence Platform is **trust**. The AI X Trust Engine programmatically calculates five core reliability indices for every node and claim in our system:

```
                  ┌──────────────────────────────────────────────┐
                  │                 TRUST METRICS                │
                  ├──────────────────────┬───────────────────────┤
                  │     Reliability      │     Freshness         │
                  │     (Cross-source)   │     (TTL decay)       │
                  ├──────────────────────┼───────────────────────┤
                  │     Authority        │     Confidence        │
                  │     (Source weight)  │     (Model certainty) │
                  └──────────────────────┴───────────────────────┘
```

### Programmatic Scoring Formulas

1. **Reliability Score ($R_n$):** Measures source consensus.
   $$R_n = \frac{\sum_{i=1}^{S} W_i \cdot C_i}{\sum_{i=1}^{S} W_i}$$
   Where $S$ is the total number of independent sources verifying a claim, $W_i$ is the static authority weight of source $i$ (e.g., peer-reviewed paper = 1.0, corporate tweet = 0.5), and $C_i$ is the consistency coefficient of source $i$'s data compared to the mean of other sources.

2. **Freshness Score ($F_n$):** Models temporal decay.
   $$F_n = e^{-\lambda \cdot t}$$
   Where $\lambda$ represents the decay constant assigned to a specific category (e.g., model prices decay quickly, founding dates never decay), and $t$ is the time elapsed since the last verified data point update.

3. **Confidence Score ($C_n$):** The compound index determining the node's verification status badge.
   $$C_n = w_1 \cdot R_n + w_2 \cdot F_n + w_3 \cdot A_n$$
   If $C_n \ge 0.85$, the node automatically receives a **Verified** badge. If $C_n < 0.50$, the node is flagged for automatic human-analyst audit.

---

## 6. Recommendation & Discovery Engine

Rather than displaying generic popular lists, AI X uses a **Context-Aware Vector Proximity Model** to surface relevant nodes.

```
┌────────────────────────────────────────────────────────────────────────┐
│                      Recommendation Pipeline                           │
├──────────────────────┬──────────────────────────┬──────────────────────┤
│ 1. Context Capture   │ Active User Session state│ User viewing Model X │
├──────────────────────┼──────────────────────────┼──────────────────────┤
│ 2. Vector Extraction │ Fetch Embedding vector   │ pgvector lookup      │
├──────────────────────┼──────────────────────────┼──────────────────────┤
│ 3. Graph Weighting   │ Adjust by Node Distance  │ Boost distance=1 nodes│
├──────────────────────┼──────────────────────────┼──────────────────────┤
│ 4. Output            │ Sorted list of items     │ Surface related nodes│
└──────────────────────┴──────────────────────────┴──────────────────────┘
```

### Recommendation Algorithmic Layers
* **Semantic Proximity:** Leverages text-embedding models (e.g., `text-embedding-3-large`) to run cosine similarity queries against metadata indices.
* **Graph-Distance Proximity:** Uses Personal PageRank (PPR) algorithms centered around the user's recently bookmarked or viewed entities, boosting nodes located within a 1 or 2-hop radius of the active workspace.
* **Entity Cold-Start Mitigation:** New entities are connected with a minimum of 3 primary relationship edges during ingest, anchoring them to established nodes and ensuring instant discovery.

---

## 7. The Timeline Engine

Every entity possesses a dynamically calculated **Timeline Node Array**.

```
┌────────────────────────────────────────────────────────┐
│                  Timeline Event Node                   │
├───────────────────┬───────────────────┬────────────────┤
│ event_id          │ UUID v4           │ Unique Event ID│
│ entity_id         │ UUID v4           │ Target Entity  │
│ event_type        │ Enum              │ Major category │
│ title             │ String            │ Event summary  │
│ description       │ Text              │ Context summary│
│ occurred_at       │ Date/Timestamp    │ Exact date     │
│ citations         │ Array[String]     │ Source URLs    │
└───────────────────┴───────────────────┴────────────────┘
```

The Timeline Engine compiles these logs by tracking structural entity changes in historical sequence:
* **Creation Events:** An active model release event is derived when a model is instantiated in the graph.
* **Relational Milestones:** A funding event automatically registers on the timelines of the recipient company, the participating VC firms, and the general sector tracker.
* **Semantic Chronology:** The UI automatically stitches these timeline components together to render seamless history lines.

---

## 8. Semantic Search & Natural Language Processing (NLP)

The search layer is powered by a high-performance **Hybrid Search Engine** pairing sparse BM25 indices with dense semantic vector spaces.

```
                         ┌─────────────────────────┐
                         │   SEARCH QUERY STRING   │
                         └────────────┬────────────┘
                                      │
                 ┌────────────────────┴────────────────────┐
                 ▼                                         ▼
    ┌─────────────────────────┐               ┌─────────────────────────┐
    │     SPARSE INDEX (BM25) │               │   DENSE VECTOR SEARCH   │
    ├─────────────────────────┤               ├─────────────────────────┤
    │ Matches exact keywords, │               │ Maps conceptual intent, │
    │ company names, slugs,   │               │ themes, and synonyms    │
    │ and acronyms            │               │ via vector embeddings   │
    └────────────┬────────────┘               └────────────┬────────────┘
                 │                                         │
                 └────────────────────┬────────────────────┘
                                      ▼
                         ┌─────────────────────────┐
                         │  RECIPROCAL RANK FUSION │
                         │         (RRF)           │
                         ├─────────────────────────┤
                         │ Combines results and    │
                         │ outputs final ranked    │
                         │ entity match list       │
                         └─────────────────────────┘
```

### Semantic Extraction Pipelines
* **Named Entity Recognition (NER):** Custom NLP pipelines parse incoming text feeds to identify references to established companies, models, or technologies.
* **Alias Normalization:** Resolves acronyms and informal terms (e.g., "Sora" resolves to `Entity: AIModel (OpenAI Sora)`, "Sam Altman" resolves to `Entity: Person (Sam Altman)`).
* **Intent Routing:** Evaluates queries to route search intents directly to system actions (e.g., typing "compare GPT-4o with Claude 3.5 Sonnet" bypasses search result pages to launch the **Model Comparison Dashboard**).

---

## 9. Trend Forecasting Sandbox (Future Capability)

AI X integrates a predictive forecasting module to identify emerging technological trajectories and structural shifts.

### Forecast Methodologies
* **Forte Metrics (Momentum Modeling):** Analyzes cumulative growth gradients across GitHub repository forks, Academic citation indexes, and model benchmark improvements to flag emerging technologies early.
* **Venture Inflows Predictive Modeling:** Identifies sector funding trends to forecast next-quarter capitalization cycles across target industry verticals.
* **Predictive Constraints (Anti-Hype Protections):**
  - **No Certainty Synthesis:** Predictive outputs are clearly demarcated as statistical projections with explicit error boundaries ($\pm \sigma$).
  - **Zero Hallucination Tolerance:** The platform forbids the synthesis of un-sourced futures. Projections are strictly rooted in existing quantitative trends, with active indicators highlighting missing or speculative data points.

---

## 10. Unified Data Ingestion Pipeline

The ingestion pipeline transforms raw, noisy unstructured internet data into clean, structured knowledge graph updates.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Ingestion Lifecycle Pipeline                    │
├─────────────────────┬──────────────────────────┬───────────────────────┤
│ 1. Extraction       │ Dynamic scrapers & APIs  │ GitHub, ArXiv, Feeds  │
├─────────────────────┼──────────────────────────┼───────────────────────┤
│ 2. NLP Processing   │ Entity extraction / NER  │ Parse names & terms   │
├─────────────────────┼──────────────────────────┼───────────────────────┤
│ 3. Deduplication    │ Similarity resolution    │ Merge duplicate nodes │
├─────────────────────┼──────────────────────────┼───────────────────────┤
│ 4. Verification     │ Consensus scoring / Trust│ Calculate Trust Index │
├─────────────────────┼──────────────────────────┼───────────────────────┤
│ 5. Graph Sync       │ Write-ahead transaction  │ Commit to graph & db  │
└─────────────────────┴──────────────────────────┴───────────────────────┘
```

### Ingestion Source Matrix
* **Academic Registries (ArXiv, Semantic Scholar):** Daily scraping of pre-prints, parsing PDF structures to extract authors, abstract texts, citation listings, and featured model evaluation tables.
* **Developer Platforms (GitHub API):** Monitors popular open-source software structures to track commit patterns, contributor retention, fork histories, and issue trends.
* **Institutional Filings (SEC EDGAR API):** Automated ingestion of S-1, 10-K, and 10-Q corporate financial filings to record executive officer transitions, funding updates, and revenue metrics.
* **Public Web Crawling:** Monitors corporate announcement blogs, technology media outlets, and regulatory commission publications, indexing events using our trust-consensus engine.

---

## 11. Public & Enterprise APIs

AI X opens its Intelligence Engine to external tools, platforms, and corporate clients through a high-performance REST and GraphQL API system.

### Unified GraphQL Query Interface Example
For advanced enterprise systems traversing our Knowledge Graph:

```graphql
query GetCompetitiveModelIntelligence {
  company(slug: "anthropic") {
    name
    fundingTotalUsd
    models(availability: OPEN) {
      name
      parameterCount
      benchmarks(dataset: "HumanEval") {
        score
        dateRecorded
      }
    }
    investors {
      name
      hqLocation
    }
  }
}
```

---

## 12. Security, Access Controls, & Global Scalability

### Security Architecture
* **Role-Based Access Control (RBAC):** Restricts access to advanced financial intelligence tables and enterprise workspace documents.
* **Enterprise Tenant Isolation:** Private corporate workspaces are isolated at the database level with client-managed encryption keys, preventing internal model data exposure.
* **Rate-Limiting Matrix:** Enforces clean traffic flows via sliding window logs, restricting free API queries while ensuring dedicated bandwidth for enterprise lines.

### Global Scalability Strategy
* **Distributed Multi-Region Deployment:** Ingestion, database replication, and edge-caching models run globally on Google Cloud (using Cloud Spanner and regionalized AWS Neptune instances) to keep query latencies under `50ms` globally.
* **Pre-computed Cache Layers:** High-volume read targets (such as primary company profiles, trending benchmarks, and home stage dashboards) are pre-rendered and served from edge-memory stores, reducing graph traversal computations.
* **Graph Partitioning:** Isolates historical or archived database clusters into specialized horizontal partitions, keeping the active traversal index small, fast, and light.
