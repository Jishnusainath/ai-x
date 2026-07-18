import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, X, History, Sparkles, Star, ChevronRight, CornerDownLeft, 
  Cpu, Zap, Activity, Briefcase, BookOpen, Compass, Flame, ArrowUpRight, 
  TrendingUp, Info, Bookmark, Share2, MessageSquare, Code, Layout, 
  BarChart2, Server, Award, Play, Network, Eye, HelpCircle, Check, 
  Database, User, Calendar, ExternalLink, Filter, RotateCcw, AlertCircle
} from 'lucide-react';

interface UniversalSearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  theme: 'dark' | 'light';
  news: any[];
  bookmarks: string[];
  onToggleBookmark: (url: string) => void;
  userNotes: Record<string, string>;
  onSaveNote: (url: string, note: string) => void;
  onOpenArticle: (article: any) => void;
  onAskAI: (message: string) => void;
  onOpenCompany?: (slug: string) => void;
  onOpenModel?: (slug: string) => void;
  onOpenResearch?: (slug: string) => void;
}

// --- STATIC SEARCH INDICES ---
const COMPANIES = [
  { id: 'c1', type: 'Company', name: 'OpenAI', desc: 'Frontier research lab behind GPT-4o and ChatGPT.', logo: 'O', url: 'https://openai.com', valuation: '$150B', founded: '2015', founder: 'Sam Altman, Ilya Sutskever', tags: ['Frontier', 'LLM', 'Commercial'] },
  { id: 'c2', type: 'Company', name: 'Google DeepMind', desc: 'Sovereign research unit behind Gemini models and AlphaFold.', logo: 'G', url: 'https://deepmind.google', parent: 'Alphabet Inc.', researchFocus: 'AGI, Science, Fusion', tags: ['Frontier', 'Multimodal', 'Google'] },
  { id: 'c3', type: 'Company', name: 'Anthropic', desc: 'AI safety and research company behind Claude 3.5 Sonnet.', logo: 'A', url: 'https://anthropic.com', safetyFocus: 'Constitutional AI', valuation: '$40B', tags: ['Frontier', 'Safety', 'Claude'] },
  { id: 'c4', type: 'Company', name: 'NVIDIA Corp', type_details: 'Silicon Foundry', name_full: 'NVIDIA Corporation', desc: 'World leader in AI accelerated hardware, Blackwell, and CUDA platforms.', logo: 'N', url: 'https://nvidia.com', stockSymbol: 'NVDA', chipFocus: 'B200, H100', tags: ['Hardware', 'GPU', 'Silicon'] },
  { id: 'c5', type: 'Company', name: 'Meta AI', desc: 'Creator of the Llama open weights series and PyTorch.', logo: 'M', url: 'https://meta.ai', strategy: 'Open Weights ecosystem', lead: 'Yann LeCun', tags: ['Open Source', 'Models', 'Meta'] },
  { id: 'c6', type: 'Company', name: 'xAI', desc: 'Elon Musk\'s startup building Grok and Colossus supercluster.', logo: 'X', url: 'https://x.ai', computeCap: '100k liquid-cooled H100s', valuation: '$24B', tags: ['Frontier', 'Compute', 'Grok'] },
  { id: 'c7', type: 'Company', name: 'Mistral AI', desc: 'European open weights champion backing Mistral Large and Codestral.', logo: 'FR', url: 'https://mistral.ai', location: 'Paris, France', valuation: '€6B', tags: ['Open Weights', 'Europe', 'Codestral'] }
];

const MODELS = [
  { id: 'm1', type: 'AI Model', name: 'GPT-5 (Sovereign)', slug: 'gpt-5', developer: 'OpenAI', contextLimit: '1,000,000 tokens', primaryUse: 'AGI Orchestration, multi-step planning, science reasoning', mmlu: '98%', tags: ['OpenAI', 'Frontier', 'Commercial'] },
  { id: 'm2', type: 'AI Model', name: 'Claude 4 (Sovereign)', slug: 'claude-4', developer: 'Anthropic', contextLimit: '500,000 tokens', primaryUse: 'Complex software architecture, legal compliance, safe agents', mmlu: '97%', tags: ['Anthropic', 'Safety', 'Coding'] },
  { id: 'm3', type: 'AI Model', name: 'Gemini 2.5 (Titan)', slug: 'gemini-2-5', developer: 'Google DeepMind', contextLimit: '5,000,000 tokens', primaryUse: 'Cinematic video parsing, infinite context codebase ingest', mmlu: '94.2%', tags: ['Google', 'Context', 'Multimodal'] },
  { id: 'm4', type: 'AI Model', name: 'Llama 4 (Sovereign)', slug: 'llama-4', developer: 'Meta AI', contextLimit: '256,000 tokens', primaryUse: 'Sovereign local weights enterprise setups, synthetic data', mmlu: '91%', tags: ['Meta', 'Open Source', 'Decentralized'] },
  { id: 'm5', type: 'AI Model', name: 'DeepSeek R1 (Disruptor)', slug: 'deepseek-r1', developer: 'DeepSeek', contextLimit: '128,000 tokens', primaryUse: 'Elite math, logic verification, extremely low-cost API operations', mmlu: '96%', tags: ['DeepSeek', 'Open Weights', 'Disruptive'] },
  { id: 'm6', type: 'AI Model', name: 'Grok 4 (Sovereign)', slug: 'grok-4', developer: 'xAI', contextLimit: '256,000 tokens', primaryUse: 'Real-time social telemetry grounding, uncensored analysis', mmlu: '90%', tags: ['xAI', 'Grok', 'X-Grounding'] },
  { id: 'm7', type: 'AI Model', name: 'Qwen 3 (Alibaba)', slug: 'qwen-3', developer: 'Alibaba Cloud', contextLimit: '128,000 tokens', primaryUse: 'SOTA bilingual logic, mathematical proof translation', mmlu: '93%', tags: ['Alibaba', 'Bilingual', 'Open Weights'] },
  { id: 'm8', type: 'AI Model', name: 'Mistral Large', slug: 'mistral-large', developer: 'Mistral AI', contextLimit: '128,000 tokens', primaryUse: 'GDPR-aligned European sovereign deployment models', mmlu: '92%', tags: ['Mistral', 'Europe', 'Sovereign'] },
  { id: 'm9', type: 'AI Model', name: 'Command A (R+)', slug: 'command-a', developer: 'Cohere', contextLimit: '128,000 tokens', primaryUse: 'Multi-step Retrieval-Augmented Generation (RAG) agent loops', mmlu: '89%', tags: ['Cohere', 'Enterprise', 'RAG'] },
  { id: 'm10', type: 'AI Model', name: 'Phi (Phi-3.5)', slug: 'phi', developer: 'Microsoft AI', contextLimit: '128,000 tokens', primaryUse: 'On-device textbook-grounded lightweight logic loops', mmlu: '81%', tags: ['Microsoft', 'Local', 'Lightweight'] },
  { id: 'm11', type: 'AI Model', name: 'Kimi (Moonshot AI)', slug: 'kimi', developer: 'Moonshot AI', contextLimit: '2,000,000 tokens', primaryUse: 'Fast literature review, document synthesis, long chat histories', mmlu: '88%', tags: ['Moonshot', 'Long Context', 'Asia-Pacific'] }
];

const BENCHMARKS = [
  { id: 'b1', type: 'Benchmark', name: 'MMLU-Pro', category: 'General Reasoning', details: 'A more challenging subset of Massive Multitask Language Understanding.', leader: 'Gemini 1.5 Pro (94.2%)', tags: ['Reasoning', 'General'] },
  { id: 'b2', type: 'Benchmark', name: 'HumanEval', category: 'Coding Proficiency', details: 'Evaluates functional correctness of synthesized Python code blocks.', leader: 'Claude 3.5 Sonnet (92.0%)', tags: ['Coding', 'Python'] },
  { id: 'b3', type: 'Benchmark', name: 'GPQA', category: 'Graduate-Level Q&A', details: 'Extremely hard physics, biology, and chemistry prompts verified by PhDs.', leader: 'Claude 3.5 Sonnet (59.4%)', tags: ['PhD-Level', 'Science'] },
  { id: 'b4', type: 'Benchmark', name: 'LMSYS Chatbot Arena', category: 'Human Preferences', details: 'Crowdsourced side-by-side dynamic Elo ranking engine.', leader: 'Claude 3.5 Sonnet (1322 Elo)', tags: ['Elo', 'Human-Centered'] }
];

const RESEARCH = [
  { id: 'r1', type: 'Research Paper', name: 'Attention Is All You Need', slug: 'attention-is-all-you-need', authors: 'Vaswani et al. (Google Brain)', date: '2017', citations: '125,000+', details: 'Introduced the Transformer architecture, replacing RNNs with self-attention.', tags: ['Transformer', 'Classic'] },
  { id: 'r2', type: 'Research Paper', name: 'GPT-4 Technical Report', slug: 'gpt-4-technical-report', authors: 'OpenAI Team', date: '2023', citations: '15,000+', details: 'Detailed analysis of capabilities, limitations, and safety boundaries of GPT-4.', tags: ['OpenAI', 'GPT-4', 'Frontier'] },
  { id: 'r3', type: 'Research Paper', name: 'DeepSeek-R1: Incentivizing Reasoning Matter', slug: 'deepseek-r1', authors: 'DeepSeek Research', date: '2025', citations: '3,200+', details: 'Breakthrough details on mathematical reasoning, MLA attention, and low-cost models.', tags: ['Reasoning', 'Open Weights', 'DeepSeek'] },
  { id: 'r4', type: 'Research Paper', name: 'Gemini 2.5 Technical Report', slug: 'gemini-2-5-report', authors: 'Google DeepMind Team', date: '2026', citations: '1,400+', details: 'Examines Ring Attention and TPU scaling for massive 5M multi-modal context windows.', tags: ['Google', 'Context', 'TPU'] },
  { id: 'r5', type: 'Research Paper', name: 'Llama 4: Foundations of Open Weights Intelligence', slug: 'llama-4-paper', authors: 'Meta AI Research', date: '2026', citations: '1,100+', details: 'Details of Meta Llama 4 foundation training, synthetic datasets, and edge capabilities.', tags: ['Meta', 'Llama', 'Open Source'] }
];

const WORKS_SUGGESTED = [
  { id: 'w1', type: 'Workspace Channel', name: 'Security & Alignment Policy', desc: 'Compliance guidelines for models crossing 10^26 FLOPS thresholds.', tags: ['Regulation', 'Policy'] },
  { id: 'w2', type: 'Workspace Channel', name: 'WASM Compiler Optimization', desc: 'In-browser local compiler registers for client-side model running.', tags: ['Dev', 'Compiler'] },
  { id: 'w3', type: 'Workspace Channel', name: 'Silicon Dispatch & Wafer Yields', desc: 'Market insights on TSMC CoWoS packaging queues and Blackwell delays.', tags: ['Hardware', 'Business'] }
];

// Simple helper to calculate match relevance
const searchWeight = (item: any, query: string): number => {
  const q = query.toLowerCase();
  let score = 0;
  
  const fields = [
    item.name, item.title, item.desc, item.summary, item.developer, 
    item.authors, item.category, item.details, item.type
  ].filter(Boolean);

  for (const field of fields) {
    const fStr = String(field).toLowerCase();
    if (fStr === q) score += 100;
    else if (fStr.startsWith(q)) score += 50;
    else if (fStr.includes(q)) score += 20;
  }

  // Tag matches
  if (item.tags) {
    for (const tag of item.tags) {
      if (tag.toLowerCase() === q) score += 40;
      else if (tag.toLowerCase().includes(q)) score += 10;
    }
  }

  return score;
};

export default function UniversalSearchOverlay({
  isOpen,
  onClose,
  theme,
  news,
  bookmarks,
  onToggleBookmark,
  userNotes,
  onSaveNote,
  onOpenArticle,
  onAskAI,
  onOpenCompany,
  onOpenModel,
  onOpenResearch
}: UniversalSearchOverlayProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'All' | 'News' | 'Companies' | 'Models' | 'Research' | 'Benchmarks' | 'Workspace'>('All');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [hoveredResult, setHoveredResult] = useState<any>(null);
  const [isAiAnswering, setIsAiAnswering] = useState(false);
  const [aiAnswerResult, setAiAnswerResult] = useState<any>(null);
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    const saved = localStorage.getItem('aix-recent-searches-v3');
    return saved ? JSON.parse(saved) : ["best coding model", "Claude 3.5 Sonnet", "NVIDIA Blackwell", "MMLU"];
  });

  const searchInputRef = useRef<HTMLInputElement>(null);
  const resultsContainerRef = useRef<HTMLDivElement>(null);

  // Focus input on mount / toggle
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Global keyboard listeners inside the search overlay
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Save recent search
  const addRecentSearch = (term: string) => {
    const cleanTerm = term.trim();
    if (!cleanTerm) return;
    setRecentSearches(prev => {
      const filtered = prev.filter(t => t.toLowerCase() !== cleanTerm.toLowerCase());
      const next = [cleanTerm, ...filtered].slice(0, 5);
      localStorage.setItem('aix-recent-searches-v3', JSON.stringify(next));
      return next;
    });
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('aix-recent-searches-v3');
  };

  // Pre-compiled list of trending & popular searches
  const trendingSearches = [
    "Gemini 1.5 Pro Context Limit",
    "NVIDIA Blackwell B200 Yields",
    "Llama 3.1 Open Source",
    "Senate Frontier AI Safety Bills",
    "GPT-5 Reasoning Benchmarks"
  ];

  const popularCollections = [
    { title: "Enterprise Agentic Frameworks", itemsCount: 14, icon: Network },
    { title: "High-Performance Silicons", itemsCount: 8, icon: Cpu },
    { title: "Frontier Safety & Constitutional AI", itemsCount: 11, icon: Award }
  ];

  // --- NATURAL LANGUAGE DETECTOR & GENERATOR ---
  const handleNaturalLanguageSearch = (query: string) => {
    const q = query.toLowerCase();
    
    // Natural Language Query Patterns
    const isCodingMatch = q.includes('coding') || q.includes('programmer') || q.includes('write code');
    const isOpenAiMatch = q.includes('openai') || q.includes('gpt-4') || q.includes('gpt-5') || q.includes('sam altman');
    const isClaudeMatch = q.includes('claude') || q.includes('anthropic') || q.includes('sonnet');
    const isFundingMatch = q.includes('funding') || q.includes('valuation') || q.includes('investment');
    const isCompareMatch = q.includes('compare') || q.includes('vs') || q.includes('better than');

    if (isCodingMatch) {
      return {
        title: "Coding Model Performance Analysis",
        verdict: "Claude 3.5 Sonnet reigns supreme for software execution, followed by Gemini 1.5 Pro.",
        comparison: [
          { name: "Claude 3.5 Sonnet", codingScore: "92.0% HumanEval", agenticScore: "SOTA (High)", arenaElo: "1322" },
          { name: "Gemini 1.5 Pro", codingScore: "84.1% HumanEval", agenticScore: "High", arenaElo: "1310" },
          { name: "GPT-4o", codingScore: "90.2% HumanEval", agenticScore: "Medium-High", arenaElo: "1286" }
        ],
        recommendation: "Deploy Claude 3.5 Sonnet as your default engineering copilot. For multi-million token repository context reviews, fallback on Gemini 1.5 Pro.",
        relatedNews: news.filter(n => n.title.toLowerCase().includes('coding') || n.title.toLowerCase().includes('claude') || n.title.toLowerCase().includes('gemini')).slice(0, 2)
      };
    }

    if (isCompareMatch || (isClaudeMatch && isOpenAiMatch)) {
      return {
        title: "Model Intelligence Comparison Matrix",
        verdict: "Anthropic Claude leads in logical precision; OpenAI GPT-4o leads in low-latency voice.",
        comparison: [
          { name: "Claude 3.5 Sonnet", logic: "93.8% MMLU", multiling: "High", speed: "Average" },
          { name: "GPT-4o", logic: "91.8% MMLU", multiling: "Very High", speed: "Extremely Fast" }
        ],
        recommendation: "Utilize GPT-4o for real-time applications requiring immediate human feedback; choose Claude 3.5 Sonnet for intricate system architectures.",
        relatedNews: news.filter(n => n.title.toLowerCase().includes('gpt') || n.title.toLowerCase().includes('claude')).slice(0, 2)
      };
    }

    if (isFundingMatch) {
      return {
        title: "Recent Frontier AI Capital Actions",
        verdict: "Silicon foundries and computing clusters absorb over 70% of venture inflows.",
        highlights: [
          "xAI raising $6B Series B at a $24B post-money valuation to construct Colossus supercluster.",
          "Anthropic securing an additional $4B Amazon capital backing.",
          "Mistral AI closing €600M Series B valuing the Parisian lab at €6B."
        ],
        recommendation: "Venture focus is shifting rapidly from speculative application wrappers to foundational computing hardware and ring-fenced alignment software.",
        relatedNews: news.filter(n => n.title.toLowerCase().includes('funding') || n.title.toLowerCase().includes('capital') || n.title.toLowerCase().includes('million') || n.title.toLowerCase().includes('billion')).slice(0, 2)
      };
    }

    if (isOpenAiMatch) {
      return {
        title: "OpenAI Frontier Intelligence Report",
        verdict: "OpenAI is aligning computational clusters around multi-modal voice and reasoning models.",
        comparison: [
          { name: "GPT-4o", context: "128k", arenaElo: "1286", primary: "Multimodal Voice" },
          { name: "o1-preview", context: "128k", arenaElo: "1330", primary: "Chain of Thought" }
        ],
        recommendation: "Integrate GPT-4o for conversational channels. Monitor OpenAI dev frameworks closely as they push deeper into agentic desk loops.",
        relatedNews: news.filter(n => n.title.toLowerCase().includes('openai') || n.title.toLowerCase().includes('sam altman')).slice(0, 2)
      };
    }

    // Default Fallback Natural language
    return {
      title: `Grounded Real-Time Synthesis: "${query}"`,
      verdict: "Evaluating matching nodes. The data suggests active acceleration within foundation reasoning layers.",
      recommendation: `Query search keywords like 'Claude', 'Blackwell', or 'GPQA' directly to view targeted, structured intelligence profiles.`,
      relatedNews: news.slice(0, 2)
    };
  };

  // --- COMPILING FILTERED RESULTS ---
  const results = useMemo(() => {
    if (!searchQuery.trim()) return [];

    const query = searchQuery.trim().toLowerCase();
    const enrichedNews = news.map(item => ({ ...item, id: item.url, type: 'News' }));
    
    // Master combined list of all entities
    const allEntities = [
      ...enrichedNews,
      ...COMPANIES,
      ...MODELS,
      ...RESEARCH,
      ...BENCHMARKS,
      ...WORKS_SUGGESTED
    ];

    // Compute scores for each
    const scored = allEntities.map(item => {
      const score = searchWeight(item, query);
      return { item, score };
    });

    // Filter out zero-scores and sort descending
    let filtered = scored
      .filter(x => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .map(x => x.item);

    // Apply active filter
    if (activeFilter === 'News') {
      filtered = filtered.filter(item => item.type === 'News');
    } else if (activeFilter === 'Companies') {
      filtered = filtered.filter(item => item.type === 'Company');
    } else if (activeFilter === 'Models') {
      filtered = filtered.filter(item => item.type === 'AI Model');
    } else if (activeFilter === 'Research') {
      filtered = filtered.filter(item => item.type === 'Research Paper');
    } else if (activeFilter === 'Benchmarks') {
      filtered = filtered.filter(item => item.type === 'Benchmark');
    } else if (activeFilter === 'Workspace') {
      filtered = filtered.filter(item => item.type === 'Workspace Channel');
    }

    return filtered;
  }, [searchQuery, activeFilter, news]);

  // Handle setting selected index safely
  useEffect(() => {
    if (results.length > 0) {
      if (selectedIndex >= results.length) {
        setSelectedIndex(results.length - 1);
      }
      setHoveredResult(results[selectedIndex]);
    } else {
      setHoveredResult(null);
    }
  }, [results, selectedIndex]);

  // Render trigger when Query changes
  useEffect(() => {
    if (searchQuery.trim().length > 3) {
      // Is it a natural language inquiry?
      const q = searchQuery.toLowerCase();
      const triggers = ['best', 'compare', 'latest', 'funding', 'vs', 'which', 'explain', 'what is'];
      const hasTrigger = triggers.some(t => q.includes(t));
      
      if (hasTrigger) {
        setIsAiAnswering(true);
        const answer = handleNaturalLanguageSearch(searchQuery);
        setAiAnswerResult(answer);
      } else {
        setIsAiAnswering(false);
        setAiAnswerResult(null);
      }
    } else {
      setIsAiAnswering(false);
      setAiAnswerResult(null);
    }
  }, [searchQuery]);

  // Keyboard navigation for active list
  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!searchQuery) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % results.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + results.length) % results.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (results[selectedIndex]) {
        executePrimaryAction(results[selectedIndex]);
      }
    }
  };

  // Primary action executor
  const executePrimaryAction = (item: any) => {
    addRecentSearch(searchQuery || item.name || item.title);
    
    if (item.type === 'News') {
      onOpenArticle(item);
      onClose();
    } else if (item.type === 'Company') {
      if (onOpenCompany) {
        const cleanSlug = item.name.toLowerCase().replace(/\s+/g, '-');
        onOpenCompany(cleanSlug);
      } else {
        const textToAsk = `Synthesize full structural analysis report on ${item.name}. Provide its background, technical specifications, and strategic implications for modern development.`;
        onAskAI(textToAsk);
      }
      onClose();
    } else if (item.type === 'AI Model') {
      if (onOpenModel) {
        const cleanSlug = item.slug || item.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\-]/g, '');
        onOpenModel(cleanSlug);
      } else {
        const textToAsk = `Synthesize full structural analysis report on ${item.name}. Provide its background, technical specifications, and strategic implications for modern development.`;
        onAskAI(textToAsk);
      }
      onClose();
    } else if (item.type === 'Research Paper') {
      if (onOpenResearch && item.slug) {
        onOpenResearch(item.slug);
      } else {
        const textToAsk = `Synthesize full structural analysis report on ${item.name}. Provide its background, technical specifications, and strategic implications for modern development.`;
        onAskAI(textToAsk);
      }
      onClose();
    } else if (item.type === 'Benchmark') {
      // Seed AI assistant context
      const textToAsk = `Synthesize full structural analysis report on ${item.name}. Provide its background, technical specifications, and strategic implications for modern development.`;
      onAskAI(textToAsk);
      onClose();
    } else if (item.type === 'Workspace Channel') {
      // Save direct note placeholder
      onSaveNote('https://workspace/' + item.id, `Dynamic strategic briefing node initialized: ${item.name}. Detailed metrics mapping upcoming...`);
      onClose();
    }
  };

  const getResultIcon = (type: string) => {
    switch (type) {
      case 'News': return <Flame className="w-4 h-4 text-orange-400" />;
      case 'Company': return <Activity className="w-4 h-4 text-emerald-400" />;
      case 'AI Model': return <Cpu className="w-4 h-4 text-blue-400" />;
      case 'Research Paper': return <BookOpen className="w-4 h-4 text-purple-400" />;
      case 'Benchmark': return <BarChart2 className="w-4 h-4 text-amber-400" />;
      case 'Workspace Channel': return <Briefcase className="w-4 h-4 text-pink-400" />;
      default: return <Info className="w-4 h-4 text-neutral-400" />;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 md:p-8 font-sans select-text">
          {/* Backdrop Blur overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/85 backdrop-blur-md z-0"
          />

          {/* Center Search Modal Window Container */}
          <motion.div
            initial={{ scale: 0.98, opacity: 0, y: -20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.98, opacity: 0, y: -20 }}
            transition={{ type: 'spring', damping: 30, stiffness: 400 }}
            className="relative w-full max-w-5xl h-[80vh] bg-neutral-950/95 border border-neutral-900 rounded-3xl overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.95)] z-10 flex flex-col md:flex-row text-neutral-200"
          >
            {/* Top edge ambient gradient line */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#5194ec]/50 to-transparent pointer-events-none" />

            {/* LEFT MAIN MODULE: Search and results list */}
            <div className="flex-1 flex flex-col min-w-0 border-r border-neutral-900/60">
              
              {/* Sticky Search bar row */}
              <div className="relative flex items-center px-6 py-5 border-b border-neutral-900">
                <Search className="w-5 h-5 text-neutral-400 mr-4" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Ask a natural question, or search models, hardware, papers..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setSelectedIndex(0);
                  }}
                  onKeyDown={handleInputKeyDown}
                  className="w-full bg-transparent text-sm sm:text-base text-white placeholder-neutral-500 focus:outline-none font-sans"
                />
                
                {searchQuery && (
                  <button 
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedIndex(0);
                    }}
                    className="p-1 rounded-full hover:bg-neutral-900 text-neutral-500 hover:text-white transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}

                <div className="hidden sm:flex items-center gap-1.5 ml-4">
                  <kbd className="px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-[9px] text-neutral-500 font-mono select-none shadow">ESC</kbd>
                </div>
              </div>

              {/* Sub-Filters Tabs Bar */}
              {searchQuery && (
                <div className="flex items-center gap-1.5 px-6 py-2.5 bg-neutral-950 border-b border-neutral-900 overflow-x-auto scrollbar-none">
                  <Filter className="w-3.5 h-3.5 text-neutral-500 flex-shrink-0" />
                  {(['All', 'News', 'Companies', 'Models', 'Research', 'Benchmarks', 'Workspace'] as const).map((filter) => (
                    <button
                      key={filter}
                      onClick={() => {
                        setActiveFilter(filter);
                        setSelectedIndex(0);
                      }}
                      className={`px-3 py-1 rounded-lg text-[10px] font-mono font-bold uppercase transition-all tracking-wide whitespace-nowrap cursor-pointer ${
                        activeFilter === filter
                          ? 'bg-[#5194ec]/10 border border-[#5194ec]/30 text-[#5194ec]'
                          : 'bg-transparent border border-transparent text-neutral-500 hover:text-neutral-300'
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              )}

              {/* SCROLLABLE LIST OF CONTENT */}
              <div 
                ref={resultsContainerRef}
                className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-neutral-900"
              >
                {!searchQuery ? (
                  /* --- EMPTY SEARCH STATE --- */
                  <div className="space-y-6 animate-fade-in text-left">
                    {/* Welcome message */}
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-neutral-500 font-bold uppercase tracking-widest block">AI X SEARCH ENGINE</span>
                      <h4 className="text-sm font-semibold text-white">Ask, discover, and trace the frontier.</h4>
                      <p className="text-xs text-neutral-500 leading-relaxed font-sans">
                        Input keywords to reveal structural intelligence records, or construct natural queries to activate AI real-time comparisons.
                      </p>
                    </div>

                    {/* Recent searches block */}
                    {recentSearches.length > 0 && (
                      <div>
                        <div className="flex items-center justify-between mb-3 border-b border-neutral-900 pb-1.5">
                          <span className="text-[10px] font-mono text-neutral-400 font-bold uppercase tracking-widest flex items-center gap-1.5">
                            <History className="w-3.5 h-3.5" /> Recent Queries
                          </span>
                          <button 
                            onClick={clearRecentSearches}
                            className="text-[9px] font-mono text-[#5194ec] hover:underline cursor-pointer"
                          >
                            Clear History
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {recentSearches.map((term, i) => (
                            <button
                              key={i}
                              onClick={() => setSearchQuery(term)}
                              className="px-3 py-2 rounded-xl bg-neutral-900/40 border border-neutral-900/60 hover:bg-neutral-900 text-neutral-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
                            >
                              <Search className="w-3 h-3 text-neutral-500" />
                              <span>{term}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Trending queries */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <span className="text-[10px] font-mono text-neutral-400 font-bold uppercase tracking-widest block mb-3 border-b border-neutral-900 pb-1.5">
                          🔥 Trending AI Topics
                        </span>
                        <div className="space-y-2">
                          {trendingSearches.map((trend, i) => (
                            <button
                              key={i}
                              onClick={() => setSearchQuery(trend)}
                              className="flex items-center gap-3 w-full p-2.5 rounded-xl bg-neutral-950/20 hover:bg-neutral-900/40 text-left text-xs transition-all font-sans cursor-pointer group"
                            >
                              <span className="text-[10px] font-mono font-bold text-neutral-500 group-hover:text-[#5194ec]">0{i+1}</span>
                              <span className="text-neutral-300 group-hover:text-white font-medium">{trend}</span>
                              <ArrowUpRight className="w-3 h-3 text-neutral-600 ml-auto group-hover:text-neutral-400" />
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Popular channels */}
                      <div>
                        <span className="text-[10px] font-mono text-neutral-400 font-bold uppercase tracking-widest block mb-3 border-b border-neutral-900 pb-1.5">
                          📂 Popular Collections
                        </span>
                        <div className="space-y-2">
                          {popularCollections.map((col, i) => {
                            const IconComp = col.icon;
                            return (
                              <button
                                key={i}
                                onClick={() => setSearchQuery(col.title)}
                                className="flex items-center gap-3 w-full p-2.5 rounded-xl bg-neutral-950/20 hover:bg-neutral-900/40 text-left text-xs transition-all font-sans cursor-pointer group"
                              >
                                <div className="p-1.5 rounded-lg bg-neutral-900 border border-neutral-850 text-neutral-400 group-hover:text-[#5194ec] transition-colors">
                                  <IconComp className="w-3.5 h-3.5" />
                                </div>
                                <div>
                                  <span className="text-neutral-300 font-medium group-hover:text-white block">{col.title}</span>
                                  <span className="text-[9px] text-neutral-500 font-mono uppercase tracking-wider block">{col.itemsCount} Strategic nodes</span>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* --- ACTIVE RESULTS LIST --- */
                  <div className="space-y-5 text-left">
                    {/* Natural language response prompt helper card (Perplexity Style!) */}
                    {isAiAnswering && aiAnswerResult && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-5 rounded-2xl bg-gradient-to-br from-blue-950/20 to-[#0e1624]/20 border border-blue-900/45 text-neutral-200 space-y-4"
                      >
                        <div className="flex items-center gap-2 text-[#5194ec] font-semibold text-xs uppercase tracking-wider font-mono">
                          <Sparkles className="w-4 h-4 text-blue-400 animate-pulse" />
                          <span>AI Grounded Answer</span>
                        </div>
                        <div className="space-y-2">
                          <h4 className="text-sm font-bold text-white font-sans">{aiAnswerResult.title}</h4>
                          <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-sans">{aiAnswerResult.verdict}</p>
                        </div>

                        {/* Rendering dynamic comparison sub-table */}
                        {aiAnswerResult.comparison && (
                          <div className="bg-neutral-950/45 border border-neutral-900 rounded-xl overflow-hidden text-[11px] font-sans">
                            <table className="w-full text-left">
                              <thead>
                                <tr className="border-b border-neutral-900 bg-neutral-900/35 text-neutral-400 font-mono uppercase text-[9px] font-bold">
                                  <th className="px-3 py-2">Model Target</th>
                                  <th className="px-3 py-2">Score / Limit</th>
                                  <th className="px-3 py-2">Primary Advantage</th>
                                </tr>
                              </thead>
                              <tbody>
                                {aiAnswerResult.comparison.map((item: any, idx: number) => (
                                  <tr key={idx} className="border-b border-neutral-900/50 last:border-0">
                                    <td className="px-3 py-2 font-semibold text-white">{item.name}</td>
                                    <td className="px-3 py-2 text-blue-400 font-mono">{item.codingScore || item.logic || item.context}</td>
                                    <td className="px-3 py-2 text-neutral-400">{item.agenticScore || item.primary || item.speed}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}

                        {/* Rendering highlights list */}
                        {aiAnswerResult.highlights && (
                          <ul className="space-y-1.5 text-xs text-neutral-300 font-sans list-disc pl-5">
                            {aiAnswerResult.highlights.map((h: string, idx: number) => (
                              <li key={idx}>{h}</li>
                            ))}
                          </ul>
                        )}

                        {/* Dynamic actionable recommendations */}
                        <div className="p-3 bg-neutral-950/65 border border-neutral-900/80 rounded-xl text-[11px] text-neutral-400 leading-relaxed font-sans">
                          <span className="font-bold font-mono text-neutral-200 text-[10px] uppercase block mb-1">🤖 Recommendation Directive</span>
                          {aiAnswerResult.recommendation}
                        </div>
                      </motion.div>
                    )}

                    {/* Simple search list indicator */}
                    <div className="flex items-center justify-between border-b border-neutral-900 pb-2">
                      <span className="text-[10px] font-mono text-neutral-500 font-bold uppercase tracking-widest">
                        {activeFilter} Matching Nodes ({results.length})
                      </span>
                      <span className="text-[10px] font-mono text-neutral-500">
                        Arrow keys to cycle | Enter to select
                      </span>
                    </div>

                    {results.length === 0 ? (
                      /* If truly empty */
                      <div className="py-12 flex flex-col items-center text-center space-y-3">
                        <AlertCircle className="w-8 h-8 text-neutral-600 animate-pulse" />
                        <span className="text-xs font-semibold text-neutral-400 font-sans">No precise database entities found for "{searchQuery}"</span>
                        <button 
                          onClick={() => {
                            // Run dynamic fallback chatbot trigger
                            onAskAI(`Search and synthesize intelligence for: ${searchQuery}`);
                            onClose();
                          }}
                          className="px-4 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs font-bold text-[#5194ec] hover:bg-neutral-850 flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Ask AI Copilot instead</span>
                        </button>
                      </div>
                    ) : (
                      /* Render actual matching results list */
                      <div className="space-y-1.5">
                        {results.map((item, idx) => {
                          const isSelected = selectedIndex === idx;
                          return (
                            <div
                              key={item.id}
                              onClick={() => executePrimaryAction(item)}
                              onMouseEnter={() => {
                                setSelectedIndex(idx);
                                setHoveredResult(item);
                              }}
                              className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer text-left select-none relative group ${
                                isSelected
                                  ? 'bg-neutral-900 border-neutral-800 text-white shadow-lg shadow-black/40'
                                  : 'bg-neutral-950/20 border-neutral-900/60 hover:bg-neutral-950/60 hover:border-neutral-850 text-neutral-400 hover:text-neutral-200'
                              }`}
                            >
                              <div className="flex items-center gap-4 min-w-0">
                                {/* Leading Category Icon */}
                                <div className={`p-2.5 rounded-xl border transition-all ${
                                  isSelected 
                                    ? 'bg-[#5194ec]/10 border-[#5194ec]/30 text-white' 
                                    : 'bg-neutral-900 border-neutral-850/80'
                                }`}>
                                  {getResultIcon(item.type)}
                                </div>

                                <div className="min-w-0">
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs sm:text-sm font-semibold truncate text-white">
                                      {item.name || item.title}
                                    </span>
                                    <span className="text-[8px] font-mono font-bold uppercase px-1.5 py-0.5 rounded bg-neutral-900 text-neutral-500 tracking-wider">
                                      {item.type}
                                    </span>
                                  </div>
                                  <p className="text-xs text-neutral-500 font-sans line-clamp-1 mt-1 leading-normal">
                                    {item.desc || item.summary || item.details || "Grounded intelligence data points."}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                {/* Optional dynamic benchmark or metadata chip */}
                                {item.arenaElo && (
                                  <span className="hidden sm:inline text-[9px] font-mono font-bold uppercase tracking-wider text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-md border border-blue-500/15">
                                    Elo {item.arenaElo}
                                  </span>
                                )}
                                {item.valuation && (
                                  <span className="hidden sm:inline text-[9px] font-mono font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/15">
                                    {item.valuation}
                                  </span>
                                )}

                                {/* Action Chevron indicator */}
                                <CornerDownLeft className={`w-3.5 h-3.5 text-neutral-500 opacity-0 group-hover:opacity-100 transition-opacity ${isSelected ? 'opacity-100 text-[#5194ec]' : ''}`} />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Bottom Keyboard shortcuts status bar */}
              <div className="px-6 py-4 border-t border-neutral-900/60 bg-neutral-950 text-[10px] font-mono text-neutral-500 select-none flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-4">
                  <span className="flex items-center gap-1.5">
                    <kbd className="px-1.5 py-0.5 rounded bg-neutral-900 border border-neutral-850 text-neutral-300">Enter</kbd>
                    <span>Execute directive</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <kbd className="px-1.5 py-0.5 rounded bg-neutral-900 border border-neutral-850 text-neutral-300">↑↓</kbd>
                    <span>Select target</span>
                  </span>
                </div>
                <span className="text-neutral-600 font-sans">Sovereign real-time search protocol active</span>
              </div>
            </div>

            {/* RIGHT SIDEBAR PANEL: Result Preview pane (Spotlight / Raycast style) */}
            <div className="hidden lg:flex flex-col w-80 bg-[#070707] justify-between p-6 select-none font-sans border-l border-neutral-900">
              <AnimatePresence mode="wait">
                {hoveredResult ? (
                  <motion.div
                    key={hoveredResult.id}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.15 }}
                    className="flex-1 flex flex-col justify-between"
                  >
                    <div className="space-y-6 text-left">
                      {/* Leading type node */}
                      <div className="space-y-1">
                        <span className="text-[9px] font-mono text-neutral-500 font-bold uppercase tracking-widest block">ENTITY PREVIEW TRANSIT</span>
                        <h3 className="text-base font-bold text-white leading-tight font-display">{hoveredResult.name || hoveredResult.title}</h3>
                        <span className="text-[10px] font-mono text-blue-400 font-semibold">{hoveredResult.developer || hoveredResult.source || hoveredResult.category || hoveredResult.type}</span>
                      </div>

                      {/* Cover Vector Mock card */}
                      <div className="relative aspect-[16/10] w-full bg-neutral-950 border border-neutral-900 rounded-xl overflow-hidden flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(81,148,236,0.05)_0%,transparent_70%)]" />
                        <div className="flex flex-col items-center text-center space-y-1 z-10">
                          {getResultIcon(hoveredResult.type)}
                          <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest block mt-1">NODE GRAPH IDENTIFIER</span>
                        </div>
                      </div>

                      {/* Brief description */}
                      <div className="space-y-2">
                        <span className="text-[9px] font-mono text-neutral-500 font-bold uppercase tracking-widest block">Executive Summary</span>
                        <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                          {hoveredResult.desc || hoveredResult.summary || hoveredResult.details || "This specific target is classified under standard frontier deployment categories."}
                        </p>
                      </div>

                      {/* Static key-facts metrics */}
                      <div className="space-y-2">
                        <span className="text-[9px] font-mono text-neutral-500 font-bold uppercase tracking-widest block">Strategic Parameters</span>
                        <div className="p-3 bg-neutral-950 border border-neutral-900 rounded-xl space-y-1.5 text-[10px] font-mono">
                          <div className="flex justify-between">
                            <span className="text-neutral-500">CATEGORY:</span>
                            <span className="text-neutral-300 text-right font-bold">{hoveredResult.type.toUpperCase()}</span>
                          </div>
                          {hoveredResult.contextLimit && (
                            <div className="flex justify-between">
                              <span className="text-neutral-500">CONTEXT LIMIT:</span>
                              <span className="text-neutral-300 text-right">{hoveredResult.contextLimit}</span>
                            </div>
                          )}
                          {hoveredResult.founded && (
                            <div className="flex justify-between">
                              <span className="text-neutral-500">FOUNDED:</span>
                              <span className="text-neutral-300 text-right">{hoveredResult.founded}</span>
                            </div>
                          )}
                          {hoveredResult.founder && (
                            <div className="flex justify-between">
                              <span className="text-neutral-500">FOUNDER:</span>
                              <span className="text-neutral-300 text-right truncate max-w-[120px]">{hoveredResult.founder}</span>
                            </div>
                          )}
                          {hoveredResult.mmlu && (
                            <div className="flex justify-between">
                              <span className="text-neutral-500">MMLU SCORE:</span>
                              <span className="text-emerald-400 text-right font-bold">{hoveredResult.mmlu}</span>
                            </div>
                          )}
                          {hoveredResult.citations && (
                            <div className="flex justify-between">
                              <span className="text-neutral-500">CITATIONS:</span>
                              <span className="text-neutral-300 text-right">{hoveredResult.citations}</span>
                            </div>
                          )}
                          <div className="flex justify-between">
                            <span className="text-neutral-500">DATA SOURCE:</span>
                            <span className="text-[#5194ec] text-right">SECURE GROUNDING</span>
                          </div>
                        </div>
                      </div>

                      {/* Related Entities Tags */}
                      {hoveredResult.tags && (
                        <div className="space-y-2">
                          <span className="text-[9px] font-mono text-neutral-500 font-bold uppercase tracking-widest block">Trace Connections</span>
                          <div className="flex flex-wrap gap-1.5">
                            {hoveredResult.tags.map((tag: string) => (
                              <button
                                key={tag}
                                onClick={() => setSearchQuery(tag)}
                                className="px-2 py-0.5 rounded text-[9px] font-mono bg-neutral-900 hover:bg-neutral-850 border border-neutral-850/80 text-neutral-400 hover:text-white transition-all"
                              >
                                #{tag.toLowerCase()}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Open Button */}
                    <button
                      onClick={() => executePrimaryAction(hoveredResult)}
                      className="w-full mt-6 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 hover:bg-[#5194ec]/10 hover:border-[#5194ec]/40 hover:text-[#5194ec] text-neutral-400 font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>Retrieve Full Intelligence</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </motion.div>
                ) : (
                  /* EMPTY PREVIEW HOLDER */
                  <div className="flex-1 flex flex-col justify-center items-center text-center p-6 space-y-3">
                    <Compass className="w-8 h-8 text-neutral-800 animate-spin" style={{ animationDuration: '20s' }} />
                    <span className="text-xs text-neutral-600 font-sans">Hover an intelligence entity to retrieve contextual parameters.</span>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
