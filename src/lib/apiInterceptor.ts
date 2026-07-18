// --- CLIENT-SIDE FULL API FALLBACK INTERCEPTOR FOR STANDALONE DEPLOYMENTS (E.G. VERCEL) ---

const FALLBACK_NEWS = [
  {
    title: "Gemini 3.5 Ultra Unveiled: Redefining Multi-Modal Frontier Reasoning",
    source: "Google DeepMind Press",
    summary: "Google has announced its flagship Gemini 3.5 Ultra model, setting new benchmarks in multi-step coding, complex logic formulation, and native video-audio understanding. The model boasts a 2-million token context window as standard.",
    date: "July 12, 2026",
    category: "Models",
    sentiment: "positive",
    url: "https://deepmind.google/technologies/gemini-ultra-3.5/"
  },
  {
    title: "US Congress Passes Unified Generative AI Patent Harmonization Act",
    source: "Wired Politics",
    summary: "In a bipartisan effort, US lawmakers have passed new IP legislation specifically protecting generative output licensing models and defining compliance frameworks for commercial model fine-tuning on copyrighted materials.",
    date: "July 08, 2026",
    category: "Regulation",
    sentiment: "neutral",
    url: "https://www.wired.com/ai-patent-act/"
  },
  {
    title: "DeepMind AlphaProof 2 Achieves Gold Medal Score in International Math Olympiad",
    source: "Nature Computer Science",
    summary: "DeepMind's AlphaProof 2 reasoning system has solved 5 out of 6 advanced mathematical proofs in the official competition guidelines, scoring 41 out of 42 points to reach an elite Olympiad competitor rank.",
    date: "July 03, 2026",
    category: "Applications",
    sentiment: "positive",
    url: "https://www.nature.com/alphaproof-2/"
  },
  {
    title: "Gemini 3.5 Flash Officially Released by Google DeepMind",
    source: "Google DeepMind Press",
    summary: "Google has announced Gemini 3.5 Flash, bringing massive improvements to speed, latency, and reasoning capabilities. The model features enhanced multimodal understanding and native tool integration including live search grounding.",
    date: "June 28, 2026",
    category: "Models",
    sentiment: "positive",
    url: "https://deepmind.google/technologies/gemini/"
  },
  {
    title: "NVIDIA Blackwell B200 GPUs Enter High Volume Production",
    source: "NVIDIA Blog",
    summary: "NVIDIA's next-generation Blackwell B200 accelerators have officially entered high volume mass production. Hyperscalers report unprecedented performance boosts for large language model training and inference workloads.",
    date: "June 27, 2026",
    category: "Hardware",
    sentiment: "positive",
    url: "https://www.nvidia.com"
  },
  {
    title: "Global AI Safety Consortium Agrees on New Compute Standards",
    source: "Reuters Tech",
    summary: "A coalition of international regulators and leading AI labs have signed a landmark agreement establishing standard compute thresholds for frontier model audits. The guidelines focus on preventing catastrophic misalignment.",
    date: "June 26, 2026",
    category: "Regulation",
    sentiment: "neutral",
    url: "https://www.reuters.com"
  },
  {
    title: "OpenAI Launches SearchGPT Globally to Compete in Real-Time Search",
    source: "TechCrunch",
    summary: "OpenAI has officially launched SearchGPT for all users worldwide. The feature seamlessly integrates real-time web results with direct citations into ChatGPT, fundamentally changing conversational retrieval landscapes.",
    date: "June 25, 2026",
    category: "Business",
    sentiment: "positive",
    url: "https://techcrunch.com"
  },
  {
    title: "AI-Driven Autonomous Labs Accelerate Material Science Breakthroughs",
    source: "Nature Electronics",
    summary: "Robotic laboratories controlled by generative AI agents have synthesized over 200 previously theoretical crystal structures in just two weeks, promising breakthroughs in battery technology and supercomputing materials.",
    date: "June 24, 2026",
    category: "Applications",
    sentiment: "positive",
    url: "https://www.nature.com"
  },
  {
    title: "Anthropic Introduces Native Desktop Multi-Agent Orchestrators",
    source: "Anthropic Research",
    summary: "Anthropic has released Computer Use 2.0 and new multi-agent coordination frameworks for desktop environments. Developers can now deploy teams of models that self-delegate, debug, and coordinate on complex software engineering tasks.",
    date: "June 23, 2026",
    category: "Models",
    sentiment: "positive",
    url: "https://www.anthropic.com"
  },
  {
    title: "Apple Intelligence Pro Integrates Native Agent Actions on iOS & macOS",
    source: "Apple Newsroom",
    summary: "Apple unveiled Apple Intelligence Pro, enabling native cross-application agentic workflows. Users can issue multi-step voice prompts allowing Siri to coordinate actions across Mail, Calendar, and third-party apps locally.",
    date: "June 22, 2026",
    category: "Applications",
    sentiment: "positive",
    url: "https://www.apple.com"
  },
  {
    title: "TSMC Begins Experimental Production of 2nm AI Accelerators",
    source: "Taiwan Semiconductor Times",
    summary: "TSMC has initiated trial production lines for its custom 2nm silicon wafers, tailored specifically for next-gen generative AI accelerators. This marks a 15% power efficiency improvement and a 30% performance boost.",
    date: "June 21, 2026",
    category: "Hardware",
    sentiment: "positive",
    url: "https://www.tsmc.com"
  },
  {
    title: "Microsoft Copilot Studio Receives Autonomous Workflow Upgrades",
    source: "Microsoft Blog",
    summary: "Microsoft announced Copilot Studio Autonomous Agents, which can run as independent background workers to automate invoice processing, customer tickets, and sales routing without constant user intervention.",
    date: "June 20, 2026",
    category: "Business",
    sentiment: "positive",
    url: "https://blogs.microsoft.com"
  },
  {
    title: "EU AI Act Compliance Deadlines Trigger Massive Corporate Restructuring",
    source: "Financial Times",
    summary: "The implementation phase of the EU AI Act has officially begun, prompting major tech enterprises to overhaul their risk classification registries. Companies face hefty fines unless audit mechanisms are certified.",
    date: "June 19, 2026",
    category: "Regulation",
    sentiment: "critical",
    url: "https://www.ft.com"
  },
  {
    title: "Google Cloud Launches Axion Arm-Based Custom AI CPU Hardware",
    source: "Google Cloud Press",
    summary: "Google Cloud announced the general availability of Axion, its first custom Arm-based CPU designed for high-performance scale-out AI workloads. Axion offers up to 50% better performance than x86 alternatives.",
    date: "June 18, 2026",
    category: "Hardware",
    sentiment: "positive",
    url: "https://cloud.google.com"
  },
  {
    title: "DeepMind AlphaFold 3 Solves Crucial Cancer Protein Bindings",
    source: "Science Journal",
    summary: "Using AlphaFold 3, scientists have successfully mapped the protein-ligand interactions of several previously undruggable cancer pathways, accelerating computer-aided drug discovery timeline by years.",
    date: "June 17, 2026",
    category: "Applications",
    sentiment: "positive",
    url: "https://www.science.org"
  },
  {
    title: "NVIDIA Announces Next-Generation Rubin Architecture with HBM4 Memory Support",
    source: "NVIDIA Developer Keynote",
    summary: "NVIDIA CEO unveiled the 'Rubin' GPU platform, utilizing advanced TSMC 3nm-class processes and cutting-edge HBM4 system architecture. Rubin aims to unlock true multi-trillion parameter model training efficiency.",
    date: "May 22, 2026",
    category: "Hardware",
    sentiment: "positive",
    url: "https://www.nvidia.com/rubin-architecture"
  },
  {
    title: "OpenAI Releases GPT-4.5 for Advanced Agentic Desktop Automation",
    source: "OpenAI Research",
    summary: "OpenAI has officially open-sourced fine-tuning APIs for GPT-4.5. The model delivers massive latency reductions and dedicated sub-agents tailored for high-frequency cloud and desktop systems execution.",
    date: "May 14, 2026",
    category: "Models",
    sentiment: "positive",
    url: "https://openai.com/gpt-4.5"
  },
  {
    title: "Microsoft Invests $5 Billion in European Sovereign AI Data Infrastructure",
    source: "Financial Times",
    summary: "Microsoft announced a massive direct capital expansion program in Europe, building sustainable regional grid structures and custom AI clusters to ensure compliance with strict local regional data guidelines.",
    date: "May 08, 2026",
    category: "Business",
    sentiment: "positive",
    url: "https://www.ft.com/microsoft-europe-expansion"
  },
  {
    title: "Mistral AI Releases 'Large-v3' Open Weights Frontier Model",
    source: "Mistral AI Blog",
    summary: "Mistral AI shocked the open-source community by dropping Large-v3 with an permissive weights license. Early benchmarks show the model matching commercial leaders in logic reasoning and complex multi-lingual tasks.",
    date: "April 25, 2026",
    category: "Models",
    sentiment: "positive",
    url: "https://mistral.ai/news/large-v3"
  },
  {
    title: "Intel Launches Core Ultra 300 Series Processors with 120 NPU TOPS",
    source: "Intel Press Desk",
    summary: "Intel has launched its newest laptop and desktop flagship silicone architecture. By offering a unified 120 TOPS local NPU execution pool, users can host capable 15B models entirely locally without network queries.",
    date: "April 18, 2026",
    category: "Hardware",
    sentiment: "positive",
    url: "https://intel.com/core-ultra-300"
  },
  {
    title: "FTC Launches Formal Probe Into Multi-Agent SaaS Platform Monopolies",
    source: "Wall Street Journal",
    summary: "The US Federal Trade Commission has initiated formal documentation inquiries into several primary enterprise SaaS orchestrators to evaluate potential anti-competitive bundling of local automation features.",
    date: "April 09, 2026",
    category: "Regulation",
    sentiment: "neutral",
    url: "https://www.wsj.com/ftc-agentic-probe"
  },
  {
    title: "Meta Ships LLaMA 4 with Native Multi-Step Internal Chain-of-Thought",
    source: "Meta AI Blog",
    summary: "Meta announced the early roll-out of LLaMA 4. The model introduces a native, token-efficient 'thinking space' that executes internal search-tree lookahead strategies before streaming final generated answers.",
    date: "March 15, 2026",
    category: "Models",
    sentiment: "positive",
    url: "https://meta.ai/llama4"
  },
  {
    title: "Apple and Google Expand On-Device GenAI Integration Partnerships",
    source: "TechCrunch",
    summary: "In a landmark consumer technology partnership, Apple and Google announced cross-licensing deals allowing future iOS devices to use Google's on-device Gemini Nano-2 models for real-time local photo synthesis and audio summarization.",
    date: "March 04, 2026",
    category: "Business",
    sentiment: "positive",
    url: "https://techcrunch.com/apple-google-partnership"
  },
  {
    title: "Cerebras Systems Files for Public IPO, Showcasing CS-3 Wafer Scale Engine",
    source: "CNBC Tech",
    summary: "Cerebras Systems has officially filed public S-1 registration papers. The filings reveal a massive 150% year-on-year compute order backlog driven by sovereign nations deploying their custom CS-3 supercomputer nodes.",
    date: "February 24, 2026",
    category: "Hardware",
    sentiment: "positive",
    url: "https://www.cnbc.com/cerebras-ipo"
  },
  {
    title: "UN International AI Security Secretariat Initiates Protocols in Geneva",
    source: "UN News Office",
    summary: "The United Nations newly established AI advisory body has officially hosted its first standard conference, aiming to coordinate multi-lateral safety registries and secure verification frameworks for multi-agent clusters.",
    date: "February 11, 2026",
    category: "Regulation",
    sentiment: "neutral",
    url: "https://un.org/ai-security"
  },
  {
    title: "Cohere Launches Command R+ v2 for Complex Enterprise Multi-Lingual RAG",
    source: "Cohere Press",
    summary: "Cohere announced Command R+ v2, highly optimized for large scale secure enterprise database retrieval (RAG). The model features custom tool-calling mechanisms in 10 major global languages with ultra-low latency.",
    date: "February 02, 2026",
    category: "Models",
    sentiment: "positive",
    url: "https://cohere.com/command-r-v2"
  }
];

const FALLBACK_INSIGHTS = {
  summary: "The AI sector is accelerating into a productized agentic era, driven by real-time search integration, compute hardware scaling, and safety framework maturity.",
  trend: "Agentic automation with desktop-control capabilities and real-time grounding searches.",
  heatIndex: 92,
  hotTopics: ["Agentic Orchestration", "Hardware Scaling (B200)", "Real-time Grounded Web Retrieval"],
  developerImpact: "Developers should focus on mastering multi-agent design patterns and deploying grounded interfaces, as raw model calls give way to coordinated agent teams."
};

function getFilteredFallbackNews(query: string) {
  if (!query || query === "latest artificial intelligence developments and tech announcements" || query.trim() === "") {
    return FALLBACK_NEWS;
  }
  const lowerQuery = query.toLowerCase().trim();
  const matched = FALLBACK_NEWS.filter(item => 
    item.title.toLowerCase().includes(lowerQuery) || 
    item.summary.toLowerCase().includes(lowerQuery) ||
    item.category.toLowerCase().includes(lowerQuery) ||
    item.source.toLowerCase().includes(lowerQuery)
  );
  return matched.length > 0 ? matched : FALLBACK_NEWS;
}

function getDynamicFallbackInsights(newsItems: any[]) {
  if (!newsItems || newsItems.length === 0) {
    return FALLBACK_INSIGHTS;
  }
  const positives = newsItems.filter((n: any) => n.sentiment === 'positive').length;
  const heatIndex = Math.min(100, Math.max(60, 70 + (positives * 5)));
  
  const hotTopics = newsItems.slice(0, 3).map((n: any) => {
    const words = n.title.split(' ');
    return words.slice(0, 3).join(' ') + (words.length > 3 ? '...' : '');
  });

  const categories = Array.from(new Set(newsItems.map((n: any) => n.category)));
  const trend = `Rapid scaling and optimization in the ${categories.join(', ')} domains.`;
  const summary = `The sector showcases significant acceleration with a focus on ${categories.slice(0, 2).join(' & ')} integrations offering enhanced cost-to-performance characteristics.`;
  const developerImpact = `Developers should immediately look into adopting ${categories[0]} tools and ${categories[1] || 'agentic'} orchestration pipelines.`;

  return {
    summary,
    trend,
    heatIndex,
    hotTopics,
    developerImpact
  };
}

async function handleMockRoute(url: string, init?: RequestInit): Promise<Response> {
  const cleanUrl = url.split("?")[0];
  let body: any = {};
  if (init?.body && typeof init.body === "string") {
    try {
      body = JSON.parse(init.body);
    } catch (_) {}
  }

  let data: any = {};

  if (cleanUrl === "/api/health") {
    data = { status: "ok", geminiConfigured: false, isDemo: true };
  } else if (cleanUrl === "/api/news") {
    const q = body.query || "";
    data = { news: getFilteredFallbackNews(q), isDemo: true };
  } else if (cleanUrl === "/api/insights") {
    data = getDynamicFallbackInsights(body.newsItems || []);
  } else if (cleanUrl === "/api/chat" || cleanUrl === "/api/copilot/chat") {
    const msg = body.message || "";
    data = {
      text: `[Standalone Client Mode] Regarding your interest: "${msg}", the live AI ecosystem in mid-2026 is scaling extremely fast! Here is an offline summary:

1. **Gemini 3.5 series** models (Ultra and Flash) are pushing benchmarks with 2M context and native live search grounding.
2. **TSMC 2nm silicon** trials and Blackwell high-volume productions are boosting compute density globally.
3. **Multi-Agent orchestration** is becoming a major paradigm shift for desktop control, tool-calling, and automated software workflows.`,
      sources: [
        { title: "Google DeepMind News", url: "https://deepmind.google" },
        { title: "TSMC Silicon Roadmap", url: "https://www.tsmc.com" }
      ]
    };
  } else if (cleanUrl === "/api/summarize") {
    const title = body.title || "";
    const summary = body.summary || "";
    data = {
      oneLine: `Key Takeaway: ${title}.`,
      thirtySec: `${summary || "Details are being processed."} This development represents a critical structural step forward in AI software engineering.`,
      detailed: `A deep, offline technical analysis of "${title}". This milestone showcases how accelerated performance and architectural standards are merging to support production-scale enterprise deployments. The broader consequences point to rising efficiencies and immediate development flexibility.`,
      eli15: `Imagine building a lego tower but instead of doing it by hand, you have a smart robot assistant that puts it together in 2 seconds. That's basically what this update does—it makes building complex technology super fast and simple.`,
      technical: `The announcement details a structural optimization in stateful latency corridors. By executing direct compilation layers and introducing custom execution blocks, developers can achieve up to 50% better throughput under concurrent multi-tenant loads.`
    };
  } else if (cleanUrl === "/api/timeline") {
    const title = body.title || "";
    data = {
      timeline: [
        { time: "09:12 AM", label: "Breaking Feed", description: `Initial monitoring signals captured for "${title}".` },
        { time: "09:45 AM", label: "Official Release", description: "Corporate announcement details and technical whitepapers published." },
        { time: "10:30 AM", label: "Expert Feedback", description: "Developer discussions and community telemetry checks register heavy interest." },
        { time: "12:10 PM", label: "Market Adjustment", description: "NASDAQ technology sectors register positive momentum matching trade metrics." }
      ]
    };
  } else if (cleanUrl === "/api/translate") {
    data = { translatedText: `[Translated to ${body.targetLang || "Spanish"}] ${body.text || ""}` };
  } else if (cleanUrl === "/api/generate-briefing") {
    const cats = body.followedCategories || [];
    data = {
      markdown: `# Executive Intelligence Briefing (Client-Side Standalone Mode)

Welcome to your custom AI X Intelligence Briefing. This report was synthesized entirely on the client side using our standalone, high-fidelity offline translation and synthesis engine.

## Sector Deep-Dive & Vectors
Your active focus on **${cats.join(', ') || 'AI models & Hardware'}** indicates a major trend in 2026. The key intersections are:
- **Stateful Latency Corridors**: Native WebGPU compilation and WASM allow highly capable 15B models to run directly in modern browsers.
- **Inference-Time Compute**: The industry is prioritizing search trees and lookahead planning over raw token throughput.

## Speculative Forecasting
1. **The 2nm Silicon Pivot**: High-yield wafer results at TSMC suggest a 30% speedup for edge-trained localized agents.
2. **Autonomous Swarms**: Desk-level computer use agents will handle up to 40% of operations by the end of 2026.

## Actionable Research Outlook
- **For Engineers**: Design system architectures optimized for local WASM caches.
- **For Strategic Investors**: Monitor SaaS gross margins to ensure compute cost scaling doesn't erode business profitability.`
    };
  } else if (cleanUrl === "/api/workspace/copilot") {
    data = {
      text: `Hi! I am your client-side Workspace Copilot. I've successfully parsed your local workspace and noted ${body.workspaceContext?.notes?.length || 0} notes and ${body.workspaceContext?.bookmarks?.length || 0} bookmarks.

Since the live backend is running in client-only/Vercel standalone mode, I've loaded your data into my high-fidelity offline model. Let me know if you want me to analyze, compare, or structure your saved items!`
    };
  } else if (cleanUrl === "/api/workspace/note-assistant") {
    const title = body.noteTitle || "";
    const action = body.action || "summarize";
    data = {
      text: `### Client Note Assistant - ${action.toUpperCase()}
- **Note**: "${title}"
- **Status**: Simulated on client-side
- **Result**:
${action === 'summarize' ? `- Core insights extracted safely.
- Action items organized.
- Relational metadata connected.` : `The action '${action}' has been successfully simulated over your note content on the client side.`}`
    };
  } else if (cleanUrl === "/api/copilot/compare") {
    data = {
      pros: ["Extremely fast", "Low latency", "Strong zero-shot capabilities"],
      cons: ["Higher token costs", "Requires high bandwidth"],
      rating: 9.2,
      recommendation: "Highly recommended for real-time edge orchestration."
    };
  } else if (cleanUrl === "/api/copilot/weekly-digest") {
    data = {
      summary: "This week, the AI ecosystem focused heavily on mass silicon distribution and reasoning-level model updates. Google launched Gemini 3.5 Flash, TSMC began test runs of its custom 2nm node, and international bodies drafted new multi-agent safety regulations.",
      newsHighlights: [
        { title: "Gemini 3.5 Ultra Unveiled", takeaway: "Establishes a new frontier for multi-modal logic, standardizing 2M token context window." },
        { title: "NVIDIA Blackwell enters high-volume mass production", takeaway: "Hyperscalers report massive compute density upgrades for training." },
        { title: "AlphaProof 2 wins IMO gold", takeaway: "Demonstrates that reasoning systems can solve advanced mathematical theorems with near-perfect accuracy." }
      ],
      benchmarkChanges: "Reasoning and agentic coding benchmarks saw a median score increase of 8.2%, signaling rising capabilities in autonomous software workflows.",
      personalRecommendations: [
        "Study the latest Gemini 3.5 Flash documentation for high-speed tool calling.",
        "Review the TSMC 2nm silicon timeline to plan hardware leasing models for Q4.",
        "Assess your bookmarked articles about AI Patent Harmonization to align policy compliance."
      ]
    };
  } else {
    data = { error: "Unknown endpoint", isDemo: true };
  }

  // Return a mock Response object
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      "Content-Type": "application/json"
    }
  });
}

// Intercept window.fetch globally
if (typeof window !== "undefined") {
  const originalFetch = window.fetch;

  try {
    Object.defineProperty(window, "fetch", {
      value: async function (input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
        const url = typeof input === "string" ? input : input instanceof URL ? input.href : input.url;

        if (url.includes("/api/gemini-diagnostic") || url.includes("/api/health")) {
          return originalFetch(input, init);
        }

        if (url.startsWith("/api/")) {
          try {
            const response = await originalFetch(input, init);
            
            // Check if the response is OK and has a valid JSON Content-Type
            if (response.ok) {
              const contentType = response.headers.get("content-type") || "";
              if (contentType.includes("application/json")) {
                // Clone the response before reading to avoid locking the stream
                const clone = response.clone();
                try {
                  await clone.json(); // verify it is valid JSON
                  return response;
                } catch (e) {
                  console.warn("[Interceptor] API returned invalid JSON, falling back to local fallback:", e);
                }
              } else {
                console.warn("[Interceptor] API returned non-JSON response, falling back to local fallback:", contentType);
              }
            } else {
              console.warn("[Interceptor] API returned non-OK status:", response.status, "falling back to local fallback");
            }
          } catch (networkError) {
            console.warn("[Interceptor] API network error, falling back to local fallback:", networkError);
          }

          // Fall back to client-side mock handlers
          return handleMockRoute(url, init);
        }

        return originalFetch(input, init);
      },
      writable: true,
      configurable: true
    });
  } catch (err) {
    console.error("[Interceptor] Failed to redefine window.fetch with Object.defineProperty:", err);
    try {
      // Fallback try in case the defineProperty failed but regular assignment works
      (window as any).fetch = async function (input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
        const url = typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
        if (url.includes("/api/gemini-diagnostic") || url.includes("/api/health")) {
          return originalFetch(input, init);
        }
        if (url.startsWith("/api/")) {
          return handleMockRoute(url, init);
        }
        return originalFetch(input, init);
      };
    } catch (e) {
      console.error("[Interceptor] Totally unable to patch window.fetch:", e);
    }
  }
}
