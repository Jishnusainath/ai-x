# AI X — SEARCH, DISCOVERY, & RECOMMENDATION SYSTEM SPECIFICATION
**Version:** 1.0  
**Status:** Architecture Approved  
**Author:** Search & Discovery Engineering Team (Principal Search Engineer, Senior AI Architect, NLP Specialist)  
**Date:** July 16, 2026

---

## 1. Search Philosophy

### Beyond Keyword Matching: Search as Guided Understanding
Traditional search engines operate on a transactional "retrieve-and-forget" model: the user inputs keywords, the system returns matching lists, and the user is left to synthesize the information manually. 

**AI X rejects this paradigm.** Search is the heart of the AI X platform. Our philosophy treats search as a conversational interface with an expert industry analyst. 

The AI X search experience is designed to answer six fundamental questions:
1. **What happened?** (Factual news, releases, breakthroughs).
2. **Why did it happen?** (Strategic drivers, market conditions, research advancements).
3. **What changed?** (Parameter drops, benchmark increases, leadership moves).
4. **Who is involved?** (Companies, authors, investors, developers).
5. **How are they connected?** (Underlying models, funding streams, repository forks).
6. **What should I read next?** (Next-step learning paths, adjacent research, relevant regulatory filings).

We prioritize **reconstructive context** over mere string alignment. Search must understand user intent, recognize complex industry entities, and surface the structural relationships that define them.

---

## 2. Search Architecture & Query Pipeline

The search pipeline is built on a **Hybrid Search and Rank (HSR)** architecture. It dynamically fuses BM25 sparse keyword indices with high-dimensional vector embeddings, resolving intent before querying the Knowledge Graph.

```
                         ┌──────────────────────────┐
                         │    USER SEARCH QUERY     │
                         └────────────┬─────────────┘
                                      │
                   ┌──────────────────┴──────────────────┐
                   ▼                                     ▼
      ┌─────────────────────────┐           ┌─────────────────────────┐
      │   NATURAL LANGUAGE NER  │           │  INTENT CLASSIFIER LLM  │
      ├─────────────────────────┤           ├─────────────────────────┤
      │ Extracts:               │           │ Routes to:              │
      │ • Entities (Companies)  │           │ • "Compare" Workspace   │
      │ • Models (Claude 3.5)   │           │ • "Timeline" View       │
      │ • Benchmarks (MMLU)     │           │ • "Research" Pipeline   │
      └────────────┬────────────┘           └────────────┬────────────┘
                   │                                     │
                   └──────────────────┬──────────────────┘
                                      ▼
                   ┌─────────────────────────────────────┐
                   │    HYBRID CO-RANKING PIPELINE      │
                   │        (BM25 + pgvector RRF)        │
                   ├─────────────────────────────────────┤
                   │ Integrates textual similarity with  │
                   │ vector-based conceptual matches     │
                   └──────────────────┬──────────────────┘
                                      ▼
                   ┌─────────────────────────────────────┐
                   │        KNOWLEDGE GRAPH RESOLVER     │
                   ├─────────────────────────────────────┤
                   │ Hydrates search results with edge   │
                   │ data (related models, VCs, etc.)    │
                   └─────────────────────────────────────┘
```

### The Query Processing Lifecycle
1. **Named Entity Recognition (NER) & Resolving Aliases:**
   - The query undergoes real-time entity recognition to isolate known company domains, model slugs, academic authors, and benchmarks.
   - It normalizes abbreviation variants (e.g., "Sora" $\rightarrow$ `OpenAI Sora`, "Altman" $\rightarrow$ `Sam Altman`).
2. **Intent Classification & Routing:**
   - A fast, low-latency LLM router parses the grammatical structure to detect comparison intents (e.g., "Compare X and Y"), chronological intents (e.g., "Timeline of X"), or analytical intents (e.g., "Explain the reasoning behind X").
   - If an intent matches a system capability, the user is seamlessly directed to the corresponding workspace view (e.g., the Comparison Dashboard or the Interactive Timeline) instead of a standard search results page.
3. **Hybrid Sparse-Dense Retrieval:**
   - **BM25 Index (Elasticsearch):** Retrieves fast, exact keyword matches for titles, slugs, code tokens, and names.
   - **Dense Vector Index (pgvector / Qdrant):** Retrieves conceptual matches based on $1536$-dimensional embeddings, ensuring that a query like "unsupervised vision scaling" matches research papers on self-supervised image models even if those exact words are absent.
4. **Reciprocal Rank Fusion (RRF):**
   - The sparse and dense results are fused into a single unified candidate pool using an RRF algorithm, ranking candidates by their relative positions in both runs.
5. **Knowledge Graph Hydration:**
   - The top candidate nodes are passed to the Neptune Graph Database to retrieve immediate neighbors (e.g., parent company, model release date, associated benchmarks). This rich context is packaged and returned to the UI in a single round-trip.

---

## 3. Search Types & Behavioral Matrices

AI X provides tailored search behaviors optimized for different professional workflows:

| Search Mode | Primary Intent | Core Database Target | UI Presentation | Key Metadata Surfaced |
| :--- | :--- | :--- | :--- | :--- |
| **Quick Search** | Navigating directly to a node. | All entity names and slugs. | Command Palette drop-down list. | Entity Type, Verification Badge. |
| **Deep Search** | Exploratory multi-node synthesis. | Full-text articles, research PDFs, filings. | Full-stage 12-column Grid. | AI Summary, citations, trust-scores. |
| **Model Search** | Evaluating technical software parameters. | Model Registry (`Entity: AIModel`). | Benchmark comparison table. | Context Window, license, MMLU score. |
| **Research Search**| Verifying academic lineage and claims. | ArXiv Index (`Entity: ResearchPaper`).| Academic citation listing. | Authors, DOI, citation count, abstract. |
| **Company Search** | Conducting competitive business intelligence. | Company Index (`Entity: Company`). | Financial Timeline / Portfolio. | Funding Total, key VCs, major products. |

---

## 4. The Discovery Engine

Discovery is the proactive counterpart to search. We design layout structures that help users uncover deep relational connections naturally, without requiring explicit search queries.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        AI X Discovery Layout                           │
├───────────────────────────────┬────────────────────────────────────────┤
│ Main Reader/Content Stage     │ Discovery Sidebar Panels               │
│ (Active research or article)  │ • Model Card: Parameter & Weights      │
│                               │ • Benchmark Explorer: Evaluated scores │
│                               │ • Relationship Graph: Active VCs       │
│                               │ • Learning Paths: Suggested next reads │
└───────────────────────────────┴────────────────────────────────────────┘
```

### Discovery Core Features
* **Adaptive Context Sidebar:** When reading an Intelligence Report, a collapsible sidebar dynamically populates with structured profiles of every entity mentioned (e.g., clicking on "Llama-3" slides out a detailed technical spec card containing parameter count, license details, and open-weights download links).
* **Relationship Graph Overlays:** Interactive node-link maps display first-degree neighbors. Users can click any node in the visualization to instantly pivot their workspace to that entity.
* **Curated Learning Paths:** A structured pathway generator that groups related articles, models, and papers into chronological, step-by-step masterclasses (e.g., "Transformer Architectures: From Attention to MoE").

---

## 5. The Recommendation Engine

The Recommendation Engine delivers highly relevant, personalized content feeds by combining vector-based interests with structural Knowledge Graph connections.

### Unified Scoring Equation for Recommendations ($S_r$)
The recommendation score for any target node $n$ with respect to user $u$ is calculated as:

$$S_r(u, n) = w_{sim} \cdot Sim(V_u, V_n) + w_{graph} \cdot PPR(n \mid B_u) + w_{trust} \cdot T_n + w_{fresh} \cdot F_n$$

Where:
* **$Sim(V_u, V_n)$ (Cosine Similarity):** The proximity between the user’s aggregated reading profile vector $V_u$ and the target node’s semantic embedding vector $V_n$.
* **$PPR(n \mid B_u)$ (Personalized PageRank):** The structural connection score of node $n$ calculated by traversing edges outward from the user's bookmarked entities $B_u$. This prioritizes closely related organizations and derivative models.
* **$T_n$ (Trust Score):** Programmatic credibility rating, suppressing low-quality or unverified sources.
* **$F_n$ (Freshness Score):** Exponential temporal decay, prioritizing recent developments.

---

## 6. The Ranking Engine

Search results are ranked using a multi-factor score that balances relevance, timeliness, authority, and trust.

```
┌────────────────────────────────────────────────────────┐
│             MULTI-FACTOR RANKING WEIGHTS               │
├───────────────────┬───────────────────┬────────────────┤
│ Factor            │ Weight (Relative) │ Purpose        │
├───────────────────┼───────────────────┼────────────────┤
│ BM25 / Semantic   │ 40%               │ Raw Relevance  │
│ Trust Score       │ 25%               │ Fact Accuracy  │
│ Freshness         │ 15%               │ Recency        │
│ Popularity        │ 10%               │ Market Demand  │
│ Personalization   │ 10%               │ User Alignment │
└───────────────────┴───────────────────┴────────────────┘
```

### Anti-Manipulation Ranking Safeguards
- **Hype Suppression Algorithm:** Explicitly penalizes press releases and blog posts containing high densities of speculative adjectives (e.g., "revolutionary," "unprecedented," "world-first") unless backed by verifiable, peer-reviewed benchmark data.
- **Verification Boost:** Formally audited, citation-backed database entries automatically receive a ranking multiplier over unverified crawl data.

---

## 7. AI Copilot Search (Explain & Analyze)

Every full search result page features an integrated **AI Copilot Panel** that performs on-the-fly synthesis of the retrieved nodes.

```
┌────────────────────────────────────────────────────────┐
│                 AI COPILOT ANALYSIS                    │
├────────────────────────────────────────────────────────┤
│ [EXPLAIN]       [SUMMARIZE]       [COMPARE]     [TEACH]│
├────────────────────────────────────────────────────────┤
│ "The retrieved 5 models represent a shift from dense   │
│ architectures to Mixture-of-Experts (MoE), reducing    │
│ active parameter counts while maintaining accuracy..."  │
│                                                        │
│ • Key Driver: Parameter efficiency                     │
│ • Primary Trade-off: Memory footprint vs. Inference cost│
└────────────────────────────────────────────────────────┘
```

### Copilot Capabilities
* **Explain & Simplify:** Translates technical model architectures and mathematical concepts into accessible analogies, tailored to the user's self-selected background (e.g., Developer, Student, or Investor).
* **Compare Node Matrix:** Generates clean, side-by-side matrices comparing retrieval entities across hardware requirements, benchmarks, and commercial licensing costs.
* **Synthesize Future Impacts:** Maps downstream consequences (e.g., "A 40% drop in H100 GPU rental costs will likely accelerate series-A funding deployment in agentic startup verticals over the next 6 months"). Every projection is clearly flagged with quantitative error margins.

---

## 8. Personalization Strategy

AI X implements a non-intrusive, privacy-first personalization system that refines recommendations as users interact with the platform.

* **Contextual Onboarding:** New users select their industry vertical, technical comfort level, and primary learning goals to anchor their baseline vector profile.
* **Behavioral Calibration:** The personalization engine tracks active reads, bookmarks, watchlists, followed companies, and query refinement patterns, shifting the user's preference vector dynamically.
* **Privacy Controls:** Users can view, edit, clear, or temporarily pause their recommendation profiles with a single click, ensuring they are not trapped in recommendation echo chambers.

---

## 9. Search Analytics Pipeline

We systematically track and analyze search queries to identify intelligence coverage gaps, trending topics, and search success metrics.

* **Metric 1: Zero-Result Queries:** Captures queries that yielded no matching entities, routing them to automated ingestion queues to fetch relevant ArXiv papers or corporate registries.
* **Metric 2: Time to First Result (TTFR):** Tracks latency across the hybrid retrieval pipeline, targeting a p99 threshold of `< 150ms`.
* **Metric 3: Search Success Rate (SSR):** Measures the percentage of searches where the user clicked a result and spent more than 30 seconds reading, validating retrieval relevance.

---

## 10. Business & Premium Search Capabilities

While standard navigation and basic search are accessible to all users, AI X offers advanced, analytical capabilities for premium and enterprise tiers.

* **Unlimited Monitored Searches:** Save complex search queries and receive real-time webhook or email alerts when new matching entities are ingested (e.g., "Notify me when any new open-weight model with > 70B parameters scores > 85% on HumanEval").
* **API Ingestion Bridge:** Allows enterprise clients to programmatically query the AI X Search index and map custom metadata schemas to their internal databases.
* **Private Entity Ingestion:** Enterprise users can upload private internal research and pitch decks, searching them seamlessly alongside the public AI X Knowledge Graph with complete data isolation.

---

## 11. Performance & Scalability Strategy

To deliver an instantaneous, desktop-class navigation and search experience, the AI X search backend implements several high-performance optimization layers:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Search Performance Layers                       │
├─────────────────────┬──────────────────────────┬───────────────────────┤
│ Layer 1: Edge CDN   │ Redis cache edge         │ Instant Cmd+K search  │
├─────────────────────┼──────────────────────────┼───────────────────────┤
│ Layer 2: Hybrid DB  │ Partitioned indices      │ p99 latency < 150ms   │
├─────────────────────┼──────────────────────────┼───────────────────────┤
│ Layer 3: Frontend   │ Debounced inputs         │ Smooth visual hydration│
└─────────────────────┴──────────────────────────┴───────────────────────┘
```

* **Client-Side Edge Caching:** Popular company names, model metadata, and common search phrases are cached in the browser's local memory, allowing the Universal Command Console (`Cmd+K`) to render instant autocomplete selections with zero network latency.
* **Distributed Horizontal Partitioning:** Database indices are partitioned geographically and by intelligence hub, ensuring that queries in the AI Hub do not incur latency overhead from indexing financial ledger data.
* **Pre-Rendered Analytical Queries:** Common comparisons (e.g., comparing current top-tier models) are pre-computed on our servers and served as static payloads, reducing database loads during peak traffic.

---

## 12. Strategic Risks & Mitigation

### A. Search Prompt Injection
* *Risk:* Malicious search strings or custom inputs compromise backend LLM routers or trigger database leak paths.
* *Mitigation:* Strict validation, sanitization of query inputs, and absolute separation between unstructured search fields and transactional database queries.

### B. High Retrieval Latency (Semantic Overhead)
* *Risk:* Complex vector embeddings and graph traversals exceed acceptable latency parameters during high concurrent traffic.
* *Mitigation:* Two-pass retrieval pipeline. Standard BM25 keyword matching returns results instantly, while deeper vector similarity matches and graph traversals are asynchronously loaded onto the page in progressive visual cards.

---

## 13. Horizontal Hub Scaling

The Search Engine is architected to scale seamlessly across future verticals without requiring underlying database refactoring.

```
       ┌────────────────────────────────────────────────────────┐
       │             UNIVERSAL SEARCH DESK                      │
       └───────────────────────┬────────────────────────────────┘
                               ▼
       ┌────────────────────────────────────────────────────────┐
       │             DYNAMIC SCHEMATIC ROUTER                   │
       └───────────────────────┬────────────────────────────────┘
                               │
            ┌──────────────────┼──────────────────┐
            ▼                  ▼                  ▼
     ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
     │   AI Hub    │    │ Finance Hub │    │ Biotech Hub │
     │ (Parameters)│    │ (SEC / CIK) │    │  (Patents)  │
     └─────────────┘    └─────────────┘    └─────────────┘
```

* **Universal Base Schema:** Each new vertical hub maps its distinct entities to our core abstract Node and Edge schemas.
* **Dynamic Search Filtering:** The query pipeline automatically adjusts its active filter taxonomy based on the selected hub (e.g., when searching within the Financial Hub, parameters like "Context Window" are replaced by filters for "Market Cap" and "Quarterly Revenue").
* **Modular Index Scaling:** Specialized search clusters are deployed as independent micro-services, ensuring that the launch of future hubs does not degrade search performance in existing verticals.
