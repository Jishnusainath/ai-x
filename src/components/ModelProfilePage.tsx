import React, { useState, useEffect } from 'react';
import { 
  Cpu, Calendar, ShieldCheck, Award, Zap, HelpCircle, FileCheck, Bookmark, Heart, Share2,
  Sparkles, CheckCircle2, TrendingUp, DollarSign, Layers, FileText, ChevronRight, BookOpen,
  ArrowLeft, Send, RefreshCw, BarChart3, GitBranch, Terminal, Globe, ExternalLink,
  Settings, Users, Briefcase, GraduationCap, Flame, Code, BookOpenCheck, LineChart, Activity, Check, AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ModelProfile, getModelProfile, MODELS_INTEL } from '../data/models';

interface ModelProfilePageProps {
  slug: string;
  onBack: () => void;
  currentUser: any;
  onTriggerToast: (msg: string) => void;
  onOpenArticle: (art: any) => void;
}

export default function ModelProfilePage({ 
  slug, 
  onBack, 
  currentUser, 
  onTriggerToast,
  onOpenArticle
}: ModelProfilePageProps) {
  const profile = getModelProfile(slug);

  // Follow State
  const [isFollowed, setIsFollowed] = useState(() => {
    const saved = localStorage.getItem(`aix-model-follow-${profile.id}`);
    return saved === 'true';
  });

  // Bookmarked State
  const [isBookmarked, setIsBookmarked] = useState(() => {
    const saved = localStorage.getItem(`aix-model-bookmark-${profile.id}`);
    return saved === 'true';
  });

  // Notes state
  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem(`aix-model-notes-${profile.id}`);
    return saved || '';
  });

  useEffect(() => {
    localStorage.setItem(`aix-model-notes-${profile.id}`, notes);
  }, [notes, profile.id]);

  // Tab State
  const [activeTab, setActiveTab] = useState<'overview' | 'specs' | 'benchmarks' | 'timeline' | 'usecases'>('overview');

  // Comparison State
  const [isComparing, setIsComparing] = useState(false);
  const [compareWithSlug, setCompareWithSlug] = useState(() => {
    const others = Object.keys(MODELS_INTEL).filter(k => k !== profile.id);
    return others[0] || 'claude-4';
  });
  const compareModel = isComparing ? getModelProfile(compareWithSlug) : null;

  // AI Copilot state
  const [copilotQuery, setCopilotQuery] = useState('');
  const [copilotHistory, setCopilotHistory] = useState<{ role: 'user' | 'assistant'; text: string }[]>([
    {
      role: 'assistant',
      text: `Welcome! I am the specialized Intel Copilot for **${profile.name}**. I am fully grounded on its architecture, training telemetry, pricing tiers, and benchmark matrices. Ask me anything!`
    }
  ]);
  const [copilotLoading, setCopilotLoading] = useState(false);

  // Interactive node hover states
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  // Interactive benchmark hover / selection state
  const [focusedBenchmark, setFocusedBenchmark] = useState<string | null>(null);

  const handleToggleFollow = () => {
    const next = !isFollowed;
    setIsFollowed(next);
    localStorage.setItem(`aix-model-follow-${profile.id}`, String(next));
    onTriggerToast(next ? `Now following ${profile.name}! Real-time telemetry alerts activated.` : `Stopped following ${profile.name}.`);
  };

  const handleToggleBookmark = () => {
    const next = !isBookmarked;
    setIsBookmarked(next);
    localStorage.setItem(`aix-model-bookmark-${profile.id}`, String(next));
    onTriggerToast(next ? `Saved ${profile.name} to your Private Intelligence Workspace.` : `Removed ${profile.name} from saved items.`);
  };

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/models/${profile.slug}`;
    navigator.clipboard.writeText(shareUrl);
    onTriggerToast(`Copied model intelligence link: ${shareUrl}`);
  };

  const handleGenerateReport = () => {
    onTriggerToast(`Compiling detailed Model Technical Briefing for ${profile.name}...`);
    setTimeout(() => {
      const markdownContent = `# AI X Strategic Briefing: ${profile.name}
Generated: ${new Date().toLocaleDateString()}
Category: ${profile.category}
Provider: ${profile.provider}

## Executive Summary
${profile.summary.purpose}

### Strategic Strengths:
${profile.summary.strengths.map(s => `- ${s}`).join('\n')}

### Integration Limitations:
${profile.summary.weaknesses.map(w => `- ${w}`).join('\n')}

## Technical Specifications
- Context Window: ${profile.specifications.contextWindow}
- Modalities: ${profile.specifications.modalities.join(', ')}
- Reasoning Profile: ${profile.specifications.reasoning}
- Pricing Tiers: Input: ${profile.specifications.pricingInput} | Output: ${profile.specifications.pricingOutput}
- Open Source Status: ${profile.specifications.openSourceStatus}

## Benchmark Index
- Reasoning Score: ${profile.benchmarks.reasoning}%
- Coding Proficiency: ${profile.benchmarks.coding}%
- Mathematics: ${profile.benchmarks.math}%
- Science Evaluator: ${profile.benchmarks.science}%
- Vision Capability: ${profile.benchmarks.vision}%
- Agentic Autonomy: ${profile.benchmarks.agentTasks}%
- Context Window Retrieval: ${profile.benchmarks.longContext}%`;

      const blob = new Blob([markdownContent], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `AI_X_Model_Report_${profile.slug}.md`;
      a.click();
      onTriggerToast(`Briefing report downloaded!`);
    }, 1200);
  };

  const askCopilot = async (queryText: string) => {
    if (!queryText.trim()) return;
    const userMsg = queryText.trim();
    setCopilotHistory(prev => [...prev, { role: 'user', text: userMsg }]);
    setCopilotQuery('');
    setCopilotLoading(true);

    try {
      // Proxy to AI X chat API endpoint
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: `Regarding the AI model ${profile.name} (${profile.category}): ${userMsg}` })
      });
      const data = await response.json();
      setCopilotHistory(prev => [...prev, { role: 'assistant', text: data.text || "I was unable to synthesize a live response. Let me check my offline database..." }]);
    } catch (err) {
      // Intelligent grounded fallback answers
      setTimeout(() => {
        let answer = `I've analyzed my grounded intelligence matrix for **${profile.name}**: `;
        const qLower = userMsg.toLowerCase();
        
        if (qLower.includes('compare')) {
          answer += `Compared to standard systems, ${profile.name} has a context window of **${profile.specifications.contextWindow}** and scores **${profile.benchmarks.coding}%** in coding and **${profile.benchmarks.reasoning}%** in multi-step reasoning. Competitors like Claude 4 lead heavily in pure software compilers while DeepSeek-R1 provides disruptive cost metrics.`;
        } else if (qLower.includes('pricing') || qLower.includes('cost')) {
          answer += `The input pricing is **${profile.specifications.pricingInput}** and output pricing is **${profile.specifications.pricingOutput}**. Its cost efficiency rating is index **${profile.benchmarks.cost}/100**.`;
        } else if (qLower.includes('coding') || qLower.includes('code')) {
          answer += `Its coding proficiency is ranked at **${profile.benchmarks.coding}%** on standardized compilers. Its ideal developer support parameters include: ${profile.specifications.developerSupport}.`;
        } else if (qLower.includes('vision') || qLower.includes('image')) {
          answer += `Regarding vision and modalities: It supports **${profile.specifications.modalities.join(', ')}**. Its vision score is **${profile.benchmarks.vision}%** with capabilities described as: *${profile.specifications.vision}*.`;
        } else {
          answer += `Key technical highlights: ${profile.summary.recentImprovements} ${profile.name} is ideally recommended for fields like ${profile.useCases.slice(0, 4).join(', ')}.`;
        }
        setCopilotHistory(prev => [...prev, { role: 'assistant', text: answer }]);
      }, 1000);
    } finally {
      setCopilotLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020202] text-neutral-200 selection:bg-blue-500/30 selection:text-white font-sans overflow-x-hidden relative">
      {/* Visual background flares */}
      <div className="absolute top-0 left-0 right-0 h-[450px] bg-gradient-to-b from-indigo-950/20 via-neutral-950/40 to-transparent pointer-events-none z-0" />
      <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-[60%] left-[-10%] w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Header Controls */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2 relative z-20 flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-semibold text-neutral-400 hover:text-white bg-neutral-900/60 border border-neutral-800/80 px-4 py-2.5 rounded-xl transition-all hover:scale-[1.02] cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Intel Terminal</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold font-mono tracking-widest text-indigo-400 border border-indigo-500/20 px-3 py-1 rounded-full bg-indigo-500/5 uppercase">
            MODEL INTEL ENGINE v5.0
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Deep Model Profile & Specifications Workspace (8 columns) */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Cover & Brand Hero Section */}
          <div className="relative rounded-3xl border border-neutral-900 bg-neutral-950/40 overflow-hidden shadow-2xl">
            {/* Animated grid overlay */}
            <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
            
            <div className="h-44 sm:h-52 w-full relative">
              <img 
                src={profile.coverImage} 
                alt={`${profile.name} Visual Cover`} 
                className="w-full h-full object-cover opacity-25 filter brightness-90"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#020202] via-[#020202]/50 to-transparent" />
            </div>

            <div className="px-6 pb-6 sm:px-8 sm:pb-8 -mt-12 relative z-10 text-left">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
                
                {/* Brand Logo & Name */}
                <div className="flex items-end gap-4">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-b from-[#1c1c24] to-[#0a0a0f] border border-neutral-800 flex items-center justify-center text-4xl sm:text-5xl font-extrabold text-glow shadow-xl" style={{ color: profile.color }}>
                    {profile.logo}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white leading-none">
                        {profile.name}
                      </h1>
                      <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded border uppercase select-none ${
                        profile.status === 'Production' ? 'text-emerald-400 bg-emerald-500/5 border-emerald-500/10' :
                        profile.status === 'In Training' ? 'text-amber-400 bg-amber-500/5 border-amber-500/10' :
                        'text-blue-400 bg-blue-500/5 border-blue-500/10'
                      }`}>
                        {profile.status}
                      </span>
                    </div>
                    <p className="text-neutral-400 text-xs sm:text-sm font-sans mt-1">
                      Developed by <span className="font-semibold text-white">{profile.company}</span> • Released {profile.releaseDate}
                    </p>
                  </div>
                </div>

                {/* Follow, Bookmark, Share */}
                <div className="flex flex-wrap items-center gap-2.5">
                  <button
                    onClick={handleToggleFollow}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                      isFollowed 
                        ? 'bg-blue-500/10 border-blue-500/30 text-blue-400' 
                        : 'bg-neutral-900 border-neutral-800 text-neutral-300 hover:text-white hover:border-neutral-700'
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${isFollowed ? 'fill-current text-blue-400' : ''}`} />
                    <span>{isFollowed ? 'Following' : 'Follow'}</span>
                  </button>

                  <button
                    onClick={handleToggleBookmark}
                    className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                      isBookmarked 
                        ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' 
                        : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
                    }`}
                    title="Bookmark Model"
                  >
                    <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-current' : ''}`} />
                  </button>

                  <button
                    onClick={handleShare}
                    className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white transition-all cursor-pointer"
                    title="Share Profile Link"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Badges block */}
              <div className="flex flex-wrap items-center gap-2.5 mt-6 pt-5 border-t border-neutral-900 text-xs">
                <span className="text-neutral-500">License:</span>
                <span className="text-white font-semibold font-mono bg-neutral-900 border border-neutral-800 px-2 py-0.5 rounded-lg text-[11px]">
                  {profile.specifications.license}
                </span>

                <div className="h-3 w-px bg-neutral-800 hidden sm:block" />

                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono tracking-wider border uppercase ${
                  profile.isOpenSource 
                    ? 'text-emerald-400 bg-emerald-500/5 border-emerald-500/10' 
                    : 'text-amber-400 bg-amber-500/5 border-amber-500/10'
                }`}>
                  {profile.isOpenSource ? 'Open Weights' : 'Closed Weights'}
                </span>

                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono tracking-wider border border-blue-500/10 bg-blue-500/5 text-blue-400 uppercase">
                  Commercial Badge
                </span>

                <span className="text-neutral-500 ml-auto text-[11px] font-mono hidden md:inline">
                  Provider: {profile.provider}
                </span>
              </div>

              {/* Latest updates strip */}
              <div className="mt-4 p-3.5 rounded-2xl bg-neutral-900/60 border border-neutral-800/80 text-xs font-sans text-neutral-300 relative overflow-hidden">
                <div className="absolute top-0 bottom-0 left-0 w-1 bg-indigo-500" />
                <span className="font-bold text-neutral-400 uppercase tracking-wider block mb-1">Latest Telemetry Status:</span>
                {profile.latestUpdate}
              </div>
            </div>
          </div>

          {/* AI Executive Summary Block */}
          <div className="p-6 sm:p-8 rounded-3xl border border-neutral-900 bg-neutral-950/40 text-left space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-44 h-44 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />
            
            <div>
              <h2 className="font-display text-xl font-bold text-white tracking-tight flex items-center gap-2 mb-3">
                <Sparkles className="w-5 h-5 text-indigo-400" />
                <span>AI Executive Intelligence Summary</span>
              </h2>
              <p className="text-neutral-300 text-sm leading-relaxed font-sans">
                {profile.summary.purpose}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-1">
              <div className="p-4 rounded-2xl bg-neutral-900/40 border border-neutral-800/80">
                <h3 className="text-xs font-bold uppercase tracking-widest text-[#5194ec] mb-2.5 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Strategic Strengths</span>
                </h3>
                <ul className="space-y-2 text-neutral-300 text-xs">
                  {profile.summary.strengths.map((str, i) => (
                    <li key={i} className="flex items-start gap-1.5 leading-relaxed">
                      <span className="text-emerald-400 mt-0.5">•</span>
                      <span>{str}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-2xl bg-neutral-900/40 border border-neutral-800/80">
                <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-2.5 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-rose-400" />
                  <span>Integration Risks / Weaknesses</span>
                </h3>
                <ul className="space-y-2 text-neutral-300 text-xs">
                  {profile.summary.weaknesses.map((wk, i) => (
                    <li key={i} className="flex items-start gap-1.5 leading-relaxed">
                      <span className="text-rose-400 mt-0.5">•</span>
                      <span>{wk}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-2">Ideal Application Use cases</h4>
                <div className="flex flex-wrap gap-1.5">
                  {profile.summary.idealUseCases.map((use, i) => (
                    <span key={i} className="text-xs text-neutral-300 bg-neutral-900 border border-neutral-800 px-3 py-1 rounded-xl">
                      {use}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-2">Target Audience / Who Should Use It</h4>
                <div className="flex flex-wrap gap-1.5">
                  {profile.summary.whoShouldUseIt.map((aud, i) => (
                    <span key={i} className="text-xs text-indigo-400 bg-indigo-500/5 border border-indigo-500/10 px-3 py-1 rounded-xl">
                      {aud}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-neutral-900 text-xs text-neutral-400 space-y-2">
              <p>
                <strong className="text-white">Technical Architecture:</strong> {profile.summary.technicalOverview}
              </p>
              <p>
                <strong className="text-white">Recent Improvements:</strong> {profile.summary.recentImprovements}
              </p>
            </div>
          </div>

          {/* Section Navigation tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none border-b border-neutral-900">
            {[
              { id: 'overview', label: 'Overview & Channels' },
              { id: 'specs', label: 'Technical Specifications' },
              { id: 'benchmarks', label: 'Benchmark Dashboard' },
              { id: 'timeline', label: 'Version History' },
              { id: 'usecases', label: 'Use Case Recommender' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === tab.id 
                    ? 'border-indigo-500 text-white' 
                    : 'border-transparent text-neutral-500 hover:text-neutral-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab contents panel */}
          <div className="text-left">
            <AnimatePresence mode="wait">
              
              {activeTab === 'overview' && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  className="space-y-6"
                >
                  {/* Knowledge Graph / Flow representation */}
                  <div className="p-6 rounded-3xl border border-neutral-900 bg-neutral-950/40">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="font-display font-semibold text-white text-sm">Interactive Model Ecosystem Graph</h4>
                        <p className="text-neutral-500 text-xs font-sans">Hover nodes to view integration parameters.</p>
                      </div>
                      <GitBranch className="w-4 h-4 text-indigo-400" />
                    </div>

                    <div className="h-44 bg-neutral-950/80 rounded-2xl border border-neutral-900 flex items-center justify-center p-4 relative overflow-hidden">
                      <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none" />
                      
                      <div className="flex items-center justify-around w-full max-w-lg z-10 relative">
                        {/* Parent Node */}
                        <div 
                          onMouseEnter={() => setHoveredNode('lab')}
                          onMouseLeave={() => setHoveredNode(null)}
                          className={`px-4 py-2.5 rounded-xl border flex flex-col items-center gap-1 cursor-help transition-all duration-300 ${
                            hoveredNode === 'lab' ? 'border-indigo-500 bg-indigo-500/10 scale-105' : 'border-neutral-800 bg-neutral-900/60'
                          }`}
                        >
                          <span className="text-[10px] font-mono font-bold text-indigo-400">PROVIDER</span>
                          <span className="text-xs font-bold text-white">{profile.company}</span>
                        </div>

                        {/* Connection line */}
                        <div className="w-12 h-0.5 bg-neutral-800 relative">
                          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping" />
                        </div>

                        {/* Model Center Node */}
                        <div 
                          onMouseEnter={() => setHoveredNode('model')}
                          onMouseLeave={() => setHoveredNode(null)}
                          className={`px-4 py-2.5 rounded-xl border flex flex-col items-center gap-1 cursor-help transition-all duration-300 ${
                            hoveredNode === 'model' ? 'border-emerald-500 bg-emerald-500/10 scale-105' : 'border-neutral-800 bg-[#0a0a0f]'
                          }`}
                        >
                          <span className="text-[10px] font-mono font-bold text-emerald-400">FOUNDATION</span>
                          <span className="text-xs font-bold text-white">{profile.name}</span>
                        </div>

                        {/* Connection line */}
                        <div className="w-12 h-0.5 bg-neutral-800" />

                        {/* Channels Node */}
                        <div 
                          onMouseEnter={() => setHoveredNode('channels')}
                          onMouseLeave={() => setHoveredNode(null)}
                          className={`px-4 py-2.5 rounded-xl border flex flex-col items-center gap-1 cursor-help transition-all duration-300 ${
                            hoveredNode === 'channels' ? 'border-amber-500 bg-amber-500/10 scale-105' : 'border-neutral-800 bg-neutral-900/60'
                          }`}
                        >
                          <span className="text-[10px] font-mono font-bold text-amber-400">CHANNELS</span>
                          <span className="text-xs font-bold text-white">APIs & Orgs</span>
                        </div>
                      </div>

                      {/* Info Tooltip */}
                      <div className="absolute bottom-3 left-4 right-4 bg-neutral-950/90 border border-neutral-850 p-2 rounded-xl text-[11px] text-neutral-300 text-center">
                        {hoveredNode === 'lab' && `Provider: Trained inside the proprietary computing clusters of ${profile.company} with specialized optimizations.`}
                        {hoveredNode === 'model' && `Foundation: ${profile.name} category is ${profile.category}. Current status: ${profile.status}.`}
                        {hoveredNode === 'channels' && `Channels: Accessible via standard REST endpoints with direct compatibility for OpenAI and custom client libraries.`}
                        {!hoveredNode && "Hover nodes to discover architecture integration layers."}
                      </div>
                    </div>
                  </div>

                  {/* Pricing Matrix summary */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 font-sans">
                    <div className="p-5 rounded-2xl border border-neutral-900 bg-neutral-950/20">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3 flex items-center gap-1">
                        <DollarSign className="w-4 h-4 text-emerald-400" />
                        <span>API Cost Efficiency Profile</span>
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-[10px] text-neutral-500 block mb-1">Input Pricing</span>
                          <span className="text-xs font-bold text-white font-mono">{profile.specifications.pricingInput}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-neutral-500 block mb-1">Output Pricing</span>
                          <span className="text-xs font-bold text-white font-mono">{profile.specifications.pricingOutput}</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-5 rounded-2xl border border-neutral-900 bg-neutral-950/20">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3 flex items-center gap-1">
                        <Layers className="w-4 h-4 text-indigo-400" />
                        <span>Parameters & Modality Tiers</span>
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {profile.specifications.modalities.map((mod, idx) => (
                          <span key={idx} className="text-[10px] text-neutral-300 bg-neutral-900 border border-neutral-850 px-2 py-0.5 rounded-lg">
                            {mod}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'specs' && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  className="p-6 rounded-3xl border border-neutral-900 bg-neutral-950/40 grid grid-cols-1 md:grid-cols-2 gap-6 font-sans text-xs"
                >
                  <div className="space-y-4">
                    <div className="flex justify-between border-b border-neutral-900 pb-2.5">
                      <span className="text-neutral-500">Context Window</span>
                      <span className="font-semibold text-white">{profile.specifications.contextWindow}</span>
                    </div>
                    <div className="flex justify-between border-b border-neutral-900 pb-2.5">
                      <span className="text-neutral-500">Reasoning Core</span>
                      <span className="font-semibold text-white text-right max-w-[200px]">{profile.specifications.reasoning}</span>
                    </div>
                    <div className="flex justify-between border-b border-neutral-900 pb-2.5">
                      <span className="text-neutral-500">Vision Capability</span>
                      <span className="font-semibold text-white text-right max-w-[200px]">{profile.specifications.vision}</span>
                    </div>
                    <div className="flex justify-between border-b border-neutral-900 pb-2.5">
                      <span className="text-neutral-500">Image Generation</span>
                      <span className="font-semibold text-white">{profile.specifications.imageGen}</span>
                    </div>
                    <div className="flex justify-between border-b border-neutral-900 pb-2.5">
                      <span className="text-neutral-500">Audio Capabilities</span>
                      <span className="font-semibold text-white text-right max-w-[200px]">{profile.specifications.audio}</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between border-b border-neutral-900 pb-2.5">
                      <span className="text-neutral-500">Video Capability</span>
                      <span className="font-semibold text-white text-right max-w-[200px]">{profile.specifications.video}</span>
                    </div>
                    <div className="flex justify-between border-b border-neutral-900 pb-2.5">
                      <span className="text-neutral-500">Tool & Sandbox Calling</span>
                      <span className="font-semibold text-white text-right max-w-[200px]">{profile.specifications.toolCalling}</span>
                    </div>
                    <div className="flex justify-between border-b border-neutral-900 pb-2.5">
                      <span className="text-neutral-500">Nested Function Calling</span>
                      <span className="font-semibold text-white text-right max-w-[200px]">{profile.specifications.functionCalling}</span>
                    </div>
                    <div className="flex justify-between border-b border-neutral-900 pb-2.5">
                      <span className="text-neutral-500">Memory Architecture</span>
                      <span className="font-semibold text-white text-right max-w-[200px]">{profile.specifications.memory}</span>
                    </div>
                    <div className="flex justify-between border-b border-neutral-900 pb-2.5">
                      <span className="text-neutral-500">Developer Support</span>
                      <span className="font-semibold text-white text-right max-w-[200px]">{profile.specifications.developerSupport}</span>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'benchmarks' && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  className="space-y-6"
                >
                  {/* Benchmarks dashboard card list with dynamic sliders */}
                  <div className="p-6 rounded-3xl border border-neutral-900 bg-neutral-950/40 space-y-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-display font-bold text-white text-sm">Interactive Evaluation Benchmarks Matrix</h4>
                      <BarChart3 className="w-4 h-4 text-indigo-400" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { key: 'reasoning', label: 'General Reasoning (MMLU-Pro)', desc: 'Tests PhD-level multi-step logical inference.' },
                        { key: 'coding', label: 'Coding Proficiency (HumanEval)', desc: 'Validates automated script compilation.' },
                        { key: 'math', label: 'Mathematics (MATH)', desc: 'Measures multi-step theorem verification.' },
                        { key: 'science', label: 'Science (GPQA)', desc: 'Extremely hard graduate level domain testing.' },
                        { key: 'vision', label: 'Vision Comprehension (MMMU)', desc: 'Evaluates structural chart and spatial layout reading.' },
                        { key: 'agentTasks', label: 'Agentic Autonomy (SWE-bench)', desc: 'Horizon execution over complex software pipelines.' },
                        { key: 'longContext', label: 'Long Context Needle-in-a-Haystack', desc: 'Sustained retrieval across huge buffers.' },
                        { key: 'toolUse', label: 'Tool Use / Parallel Calling', desc: 'Validates accurate formatting of nested APIs.' }
                      ].map(bench => {
                        const score = (profile.benchmarks as any)[bench.key] || 80;
                        return (
                          <div 
                            key={bench.key}
                            onMouseEnter={() => setFocusedBenchmark(bench.key)}
                            onMouseLeave={() => setFocusedBenchmark(null)}
                            className={`p-3.5 rounded-2xl border transition-all duration-200 cursor-help ${
                              focusedBenchmark === bench.key 
                                ? 'bg-indigo-500/5 border-indigo-500/30 shadow-lg' 
                                : 'bg-neutral-900/40 border-neutral-850'
                            }`}
                          >
                            <div className="flex justify-between text-xs font-sans mb-1">
                              <span className="font-semibold text-white">{bench.label}</span>
                              <span className="font-mono font-bold text-indigo-400">{score}%</span>
                            </div>
                            <p className="text-[10px] text-neutral-500 font-sans mb-2 leading-tight">
                              {bench.desc}
                            </p>
                            {/* Bar tracking */}
                            <div className="h-1.5 w-full bg-neutral-950 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-indigo-500 to-blue-400 rounded-full transition-all duration-500"
                                style={{ width: `${score}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'timeline' && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  className="space-y-6"
                >
                  <div className="relative border-l border-neutral-800 pl-6 ml-4 space-y-6">
                    {profile.timeline.map((item, idx) => (
                      <div key={idx} className="relative text-left font-sans">
                        {/* Bullet */}
                        <div className="absolute -left-[30px] top-1.5 w-2 h-2 rounded-full bg-indigo-500 border-2 border-black" />
                        
                        <div className="p-4 rounded-2xl border border-neutral-900 bg-neutral-950/20 max-w-2xl">
                          <span className="text-[10px] font-mono font-bold text-indigo-400 block mb-1">
                            {item.date} • {item.type.toUpperCase()}
                          </span>
                          <h5 className="font-display font-semibold text-white text-xs mb-1">
                            {item.title}
                          </h5>
                          <p className="text-neutral-400 text-xs leading-relaxed">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === 'usecases' && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 font-sans text-xs">
                    {[
                      { name: 'Programming & Logic', icon: Code, desc: 'Writing, compilation and debugging.' },
                      { name: 'Academic Research', icon: BookOpenCheck, desc: 'Literature review & citations.' },
                      { name: 'Business Intelligence', icon: Briefcase, desc: 'RAG parsing, summaries, audits.' },
                      { name: 'Student Education', icon: GraduationCap, desc: 'Concept breakdowns & tutoring.' },
                      { name: 'Agentic Automation', icon: Cpu, desc: 'Multi-step action trees & sandbox tools.' },
                      { name: 'Creative Generation', icon: Flame, desc: 'Ideation, visual coherence.' }
                    ].map(use => {
                      const isRecommended = profile.useCases.some(uc => uc.toLowerCase().includes(use.name.split(' ')[0].toLowerCase()));
                      return (
                        <div 
                          key={use.name}
                          className={`p-4 rounded-2xl border flex flex-col justify-between ${
                            isRecommended 
                              ? 'bg-indigo-500/5 border-indigo-500/20 text-white' 
                              : 'bg-neutral-900/40 border-neutral-850 text-neutral-500'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="font-bold">{use.name}</span>
                            <use.icon className={`w-4 h-4 ${isRecommended ? 'text-indigo-400' : 'text-neutral-600'}`} />
                          </div>
                          <p className="text-[11px] text-neutral-400 leading-normal mb-2">
                            {use.desc}
                          </p>
                          <span className={`text-[10px] font-mono font-bold uppercase tracking-wider ${
                            isRecommended ? 'text-emerald-400' : 'text-neutral-600'
                          }`}>
                            {isRecommended ? '✓ Highly Recommended' : '✕ Standard Tier'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>

          {/* Related Research, Datasets, and Docs */}
          <div className="p-6 sm:p-8 rounded-3xl border border-neutral-900 bg-neutral-950/40 text-left space-y-4">
            <h3 className="font-display text-base font-bold text-white tracking-tight">Grounded Research Papers & Documentation</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {profile.related.map((rel, idx) => (
                <div key={idx} className="p-4 rounded-2xl border border-neutral-900 bg-[#06060c] flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-semibold text-white text-xs">{rel.title}</span>
                      <span className="text-[9px] font-mono font-bold bg-neutral-900 border border-neutral-800 text-neutral-400 px-2 py-0.5 rounded uppercase">
                        {rel.type}
                      </span>
                    </div>
                    <p className="text-neutral-400 text-[11px] leading-relaxed">
                      {rel.summary}
                    </p>
                  </div>
                  <a 
                    href={rel.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-[10px] text-[#5194ec] font-bold mt-3 hover:underline text-left cursor-pointer"
                  >
                    <span>Inspect References</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Sovereign Metrics & AI Copilot panel (4 columns) */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* Key Metrics cards block */}
          <div className="p-6 rounded-3xl border border-neutral-900 bg-[#060606]/90 shadow-2xl text-left space-y-5">
            <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-400 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-indigo-400" />
              <span>Sovereign Performance metrics</span>
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-3.5 rounded-2xl bg-neutral-900/60 border border-neutral-850 flex flex-col justify-between">
                <span className="text-[10px] text-neutral-500 block mb-1 font-sans">Context Window</span>
                <span className="text-xs font-bold text-white font-mono truncate">{profile.specifications.contextWindow}</span>
              </div>
              <div className="text-left p-3.5 rounded-2xl bg-neutral-900/60 border border-neutral-850 flex flex-col justify-between">
                <span className="text-[10px] text-neutral-500 block mb-1 font-sans">MMLU Score</span>
                <span className="text-base font-bold text-white font-mono">{profile.benchmarks.reasoning}%</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-neutral-900/60 border border-neutral-850 flex flex-col justify-between">
                <span className="text-[10px] text-neutral-500 block mb-1 font-sans">Latency Index</span>
                <span className="text-base font-bold text-white font-mono">{profile.benchmarks.latency}/100</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-neutral-900/60 border border-neutral-850 flex flex-col justify-between">
                <span className="text-[10px] text-neutral-500 block mb-1 font-sans">Cost Index</span>
                <span className="text-base font-bold text-white font-mono">{profile.benchmarks.cost}/100</span>
              </div>
            </div>

            {/* Quick action tools */}
            <div className="pt-4 border-t border-neutral-900 space-y-2.5">
              <button
                onClick={handleGenerateReport}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-b from-[#1c1c1c] to-[#0a0a0a] hover:bg-neutral-900 text-white text-xs font-semibold border border-neutral-800 transition-colors cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5 text-indigo-400" />
                <span>Compile Strategic Report (MD)</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsComparing(!isComparing)}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                    isComparing 
                      ? 'bg-blue-500/10 border-blue-500/30 text-blue-400' 
                      : 'bg-neutral-900 border-neutral-850 text-neutral-300 hover:text-white'
                  }`}
                >
                  {isComparing ? 'Close Comparison' : 'Compare Model'}
                </button>
              </div>

              {isComparing && (
                <div className="p-3.5 rounded-2xl bg-neutral-900/60 border border-neutral-850 space-y-3 mt-2 animate-fadeIn text-xs">
                  <span className="font-semibold text-white block">Compare With:</span>
                  <select
                    value={compareWithSlug}
                    onChange={(e) => setCompareWithSlug(e.target.value)}
                    className="w-full p-2 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-300 text-xs focus:outline-none focus:border-indigo-500"
                  >
                    {Object.keys(MODELS_INTEL).filter(k => k !== profile.id).map(k => (
                      <option key={k} value={k}>{MODELS_INTEL[k].name}</option>
                    ))}
                  </select>

                  {compareModel && (
                    <div className="pt-2 border-t border-neutral-850 space-y-2 font-mono text-[11px]">
                      <div className="flex justify-between">
                        <span className="text-neutral-500">Reasoning:</span>
                        <span className="text-white font-bold">{compareModel.benchmarks.reasoning}% vs {profile.benchmarks.reasoning}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-500">Coding:</span>
                        <span className="text-white font-bold">{compareModel.benchmarks.coding}% vs {profile.benchmarks.coding}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-500">Context:</span>
                        <span className="text-white font-bold truncate max-w-[140px]">{compareModel.specifications.contextWindow}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-500">Input Price:</span>
                        <span className="text-white font-bold truncate max-w-[140px]">{compareModel.specifications.pricingInput}</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Model Personal Notes workspace */}
          <div className="p-6 rounded-3xl border border-neutral-900 bg-[#060606]/90 shadow-2xl text-left space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-400 flex items-center gap-1.5">
              <FileCheck className="w-4 h-4 text-indigo-400" />
              <span>Workspace Research Log</span>
            </h3>

            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Jot down evaluation notes, prompt strategies, or latency profiles for this model..."
              className="w-full h-32 p-3 rounded-2xl bg-neutral-950 border border-neutral-850 text-xs text-neutral-300 focus:outline-none focus:border-indigo-500 transition-colors font-sans resize-none placeholder:text-neutral-600"
            />

            <div className="flex items-center justify-between text-[10px] text-neutral-500">
              <span>Saved locally & synced</span>
              <button 
                onClick={() => {
                  setNotes('');
                  onTriggerToast("Notes cleared from workspace log.");
                }}
                className="text-neutral-500 hover:text-red-400 hover:underline cursor-pointer"
              >
                Clear Log
              </button>
            </div>
          </div>

          {/* STICKY SIDE PANEL: AI COPILOT */}
          <div className="p-6 rounded-3xl border border-neutral-900 bg-[#060606]/90 shadow-2xl text-left flex flex-col h-[480px]">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-900 mb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                </div>
                <div>
                  <h3 className="font-display text-sm font-semibold text-white tracking-tight">AI Copilot Panel</h3>
                  <span className="text-[9px] font-mono text-neutral-500">Grounding on {profile.name}</span>
                </div>
              </div>
              <HelpCircle className="w-4 h-4 text-neutral-500" />
            </div>

            {/* Chat History */}
            <div className="flex-1 overflow-y-auto space-y-3.5 pr-1 scrollbar-thin text-xs">
              {copilotHistory.map((chat, idx) => (
                <div key={idx} className={`flex flex-col ${chat.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <span className="text-[9px] text-neutral-500 uppercase tracking-widest block mb-1 font-mono">
                    {chat.role === 'user' ? 'Operator' : 'Copilot'}
                  </span>
                  <div className={`p-3 rounded-2xl max-w-[90%] leading-relaxed ${
                    chat.role === 'user' 
                      ? 'bg-indigo-500/10 border border-indigo-500/20 text-neutral-200 text-right' 
                      : 'bg-neutral-900/60 border border-neutral-850 text-neutral-300 text-left'
                  }`}>
                    {chat.text}
                  </div>
                </div>
              ))}
              {copilotLoading && (
                <div className="flex items-center gap-2 text-neutral-500 text-[11px] font-mono animate-pulse">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-400" />
                  <span>Synthesizing intelligence telemetry...</span>
                </div>
              )}
            </div>

            {/* Quick Presets */}
            <div className="pt-2.5 border-t border-neutral-900 mt-2.5 space-y-1.5">
              <span className="text-[9px] font-mono text-neutral-500 block mb-1 uppercase tracking-wider">Quick Inquiries:</span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { q: 'Explain this model architecture', label: 'Architecture' },
                  { q: 'Coding capability and developer tools', label: 'Coding Ability' },
                  { q: 'Pricing levels and inputs', label: 'Pricing' },
                  { q: 'Best industrial use cases', label: 'Use Cases' }
                ].map((preset, idx) => (
                  <button
                    key={idx}
                    onClick={() => askCopilot(preset.q)}
                    disabled={copilotLoading}
                    className="px-2 py-1 rounded-lg bg-neutral-900 hover:bg-neutral-850 border border-neutral-850/80 text-[10px] text-neutral-400 hover:text-white transition-all cursor-pointer"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Message input */}
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                askCopilot(copilotQuery);
              }}
              className="mt-3 flex gap-2"
            >
              <input
                type="text"
                value={copilotQuery}
                onChange={(e) => setCopilotQuery(e.target.value)}
                placeholder="Ask Copilot anything..."
                disabled={copilotLoading}
                className="flex-1 p-2.5 rounded-xl bg-neutral-950 border border-neutral-850 text-xs text-neutral-300 focus:outline-none focus:border-indigo-500 transition-colors font-sans"
              />
              <button
                type="submit"
                disabled={copilotLoading || !copilotQuery.trim()}
                className="p-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-600 disabled:opacity-40 text-black font-semibold transition-all cursor-pointer flex items-center justify-center"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
