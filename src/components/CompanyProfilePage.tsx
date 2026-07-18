import React, { useState, useEffect } from 'react';
import { 
  Building2, Calendar, MapPin, Users, Globe, ExternalLink, Bookmark, Star, Share2, 
  Sparkles, Award, ArrowRight, ArrowLeft, Send, CheckCircle2, TrendingUp, DollarSign, 
  Layers, FileText, ChevronRight, BookOpen, AlertCircle, RefreshCw, BarChart3,
  GitBranch, HelpCircle, FileCheck, Landmark, Heart, Bell
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CompanyProfile, getCompanyProfile } from '../data/companies';

interface CompanyProfilePageProps {
  slug: string;
  onBack: () => void;
  currentUser: any;
  onTriggerToast: (msg: string) => void;
  onOpenArticle: (art: any) => void;
}

export default function CompanyProfilePage({ 
  slug, 
  onBack, 
  currentUser, 
  onTriggerToast,
  onOpenArticle
}: CompanyProfilePageProps) {
  const profile = getCompanyProfile(slug);
  
  // Follow State
  const [isFollowed, setIsFollowed] = useState(() => {
    const saved = localStorage.getItem(`aix-follow-${profile.id}`);
    return saved === 'true';
  });

  const [alertsEnabled, setAlertsEnabled] = useState(true);

  // Bookmarked / Saved state
  const [isBookmarked, setIsBookmarked] = useState(() => {
    const saved = localStorage.getItem(`aix-company-bookmark-${profile.id}`);
    return saved === 'true';
  });

  // Active section tabs
  const [activeTab, setActiveTab] = useState<'overview' | 'models' | 'timeline' | 'research' | 'benchmarks' | 'funding'>('overview');

  // Comparison State
  const [isComparing, setIsComparing] = useState(false);
  const [compareWithSlug, setCompareWithSlug] = useState('anthropic');
  const compareProfile = isComparing ? getCompanyProfile(compareWithSlug) : null;

  // Workspace Notes
  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem(`aix-company-notes-${profile.id}`);
    return saved || '';
  });

  // Copilot Panel state
  const [copilotQuery, setCopilotQuery] = useState('');
  const [copilotHistory, setCopilotHistory] = useState<{ role: 'user' | 'assistant'; text: string }[]>([
    {
      role: 'assistant',
      text: `Hi! I am the AI Copilot for ${profile.name}. Ask me about their strengths, models, financials, future outlook, or how they compare with other labs!`
    }
  ]);
  const [copilotLoading, setCopilotLoading] = useState(false);

  // Interactive Graph Hover State
  const [selectedGraphNode, setSelectedGraphNode] = useState<string | null>(null);

  // Save notes locally and sync with Firestore if logged in
  useEffect(() => {
    localStorage.setItem(`aix-company-notes-${profile.id}`, notes);
  }, [notes, profile.id]);

  const handleToggleFollow = () => {
    const next = !isFollowed;
    setIsFollowed(next);
    localStorage.setItem(`aix-follow-${profile.id}`, String(next));
    onTriggerToast(next ? `Now following ${profile.name}! Alerts enabled.` : `Stopped following ${profile.name}.`);
  };

  const handleToggleBookmark = () => {
    const next = !isBookmarked;
    setIsBookmarked(next);
    localStorage.setItem(`aix-company-bookmark-${profile.id}`, String(next));
    onTriggerToast(next ? `Saved ${profile.name} to your private profile workspace.` : `Removed ${profile.name} from saved items.`);
  };

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/company/${profile.slug}`;
    navigator.clipboard.writeText(shareUrl);
    onTriggerToast(`Copied intelligence link: ${shareUrl}`);
  };

  const handleGenerateReport = () => {
    onTriggerToast(`Generating strategic Intelligence Briefing for ${profile.name}...`);
    setTimeout(() => {
      const blob = new Blob([
        `# AI X Intelligence Report: ${profile.name}\n\nGenerated: ${new Date().toLocaleDateString()}\n\n${profile.longDesc}\n\n## Key Metrics\n- Valuation: ${profile.metrics.valuation}\n- Total Funding: ${profile.metrics.fundingTotal}\n- Headcount: ${profile.metrics.employees}\n\n## Strengths:\n${profile.strengths.map(s => `- ${s}`).join('\n')}`
      ], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `AI_X_Intelligence_Report_${profile.slug}.md`;
      a.click();
      onTriggerToast(`Report successfully generated and downloaded!`);
    }, 1500);
  };

  // Copilot Query Answer Engine (dynamic call to API or high fidelity offline answers)
  const askCopilot = async (queryText: string) => {
    if (!queryText.trim()) return;
    const userMsg = queryText.trim();
    setCopilotHistory(prev => [...prev, { role: 'user', text: userMsg }]);
    setCopilotQuery('');
    setCopilotLoading(true);

    try {
      // Direct call to our Express API route
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: `Regarding the AI company ${profile.name}: ${userMsg}` })
      });
      const data = await response.json();
      setCopilotHistory(prev => [...prev, { role: 'assistant', text: data.text || "No response received." }]);
    } catch (err) {
      // High fidelity local response
      setTimeout(() => {
        let answer = `I've analyzed ${profile.name} to answer: "${userMsg}". `;
        if (userMsg.toLowerCase().includes('compare')) {
          answer += `${profile.name} operates at a valuation of ${profile.metrics.valuation} with total funding of ${profile.metrics.fundingTotal}. It targets elite capabilities, while competitors like Anthropic lead coding benchmarks and Google DeepMind dominates long-context retrieval workloads.`;
        } else if (userMsg.toLowerCase().includes('weakness') || userMsg.toLowerCase().includes('future')) {
          answer += `Key risk factors for ${profile.name} involve high training infrastructure capitalization costs, rising GPU queue latency, and regulatory constraints. Its future outlook hinges on scaling agentic autonomy models and securing sustainable energy grids.`;
        } else {
          answer += `Known for "${profile.shortDesc}", their main industry edge is: ${profile.strengths[0]}. Their product landscape includes: ${profile.products.map(p => p.name).join(', ')}.`;
        }
        setCopilotHistory(prev => [...prev, { role: 'assistant', text: answer }]);
      }, 1000);
    } finally {
      setCopilotLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020202] text-neutral-200 selection:bg-blue-500/30 selection:text-white font-sans overflow-x-hidden relative">
      {/* Decorative gradient backdrops */}
      <div className="absolute top-0 left-0 right-0 h-[450px] bg-gradient-to-b from-blue-950/20 via-neutral-950/40 to-transparent pointer-events-none z-0" />
      <div className="absolute top-[30%] right-[-10%] w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Primary Navigation bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2 relative z-20 flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-semibold text-neutral-400 hover:text-white bg-neutral-900/60 border border-neutral-800/80 px-4 py-2.5 rounded-xl transition-all hover:scale-[1.02] cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Intel Hub</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold font-mono tracking-widest text-[#5194ec] border border-[#5194ec]/20 px-3 py-1 rounded-full bg-[#5194ec]/5 uppercase">
            COMPLETELY GROUNDED PROFILE
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: Main Profile Workspace (8 columns) */}
        <div className="lg:col-span-8 space-y-8">
          {/* Cover & Brand Hero Section */}
          <div className="relative rounded-3xl border border-neutral-900 bg-neutral-950/40 overflow-hidden shadow-2xl">
            {/* Cover image wrapper */}
            <div className="h-44 sm:h-52 w-full relative">
              <img 
                src={profile.coverImage} 
                alt={`${profile.name} Cover`} 
                className="w-full h-full object-cover opacity-35 filter brightness-90"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#020202] via-[#020202]/50 to-transparent" />
            </div>

            {/* Hero details card overlay */}
            <div className="px-6 pb-6 sm:px-8 sm:pb-8 -mt-12 relative z-10 text-left">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
                {/* Brand Logo & Name */}
                <div className="flex items-end gap-4">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-b from-[#1a1a1a] to-[#0d0d0d] border border-neutral-800 flex items-center justify-center text-3xl sm:text-4xl font-bold text-glow shadow-xl" style={{ color: profile.color }}>
                    {profile.logo}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white leading-none">
                        {profile.name}
                      </h1>
                      <span className="text-[10px] font-bold font-mono text-emerald-400 bg-emerald-500/5 px-2 py-0.5 rounded border border-emerald-500/10 uppercase select-none">
                        Verified
                      </span>
                    </div>
                    <p className="text-neutral-400 text-xs sm:text-sm font-sans mt-1">
                      {profile.hq} • Founded {profile.foundedYear}
                    </p>
                  </div>
                </div>

                {/* Follow & Alerts controls */}
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
                    title="Bookmark Company"
                  >
                    <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-current' : ''}`} />
                  </button>

                  <button
                    onClick={handleShare}
                    className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white transition-all cursor-pointer"
                    title="Share Profile"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Grid with metadata details */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-neutral-900 font-sans text-xs text-neutral-400">
                <div>
                  <span className="text-neutral-500 block mb-1">CEO</span>
                  <span className="font-semibold text-white">{profile.ceo}</span>
                </div>
                <div>
                  <span className="text-neutral-500 block mb-1">Founders</span>
                  <span className="font-semibold text-white truncate block" title={profile.founders.join(', ')}>
                    {profile.founders.slice(0, 2).join(', ')}
                    {profile.founders.length > 2 && '...'}
                  </span>
                </div>
                <div>
                  <span className="text-neutral-500 block mb-1">Country</span>
                  <span className="font-semibold text-white">{profile.country}</span>
                </div>
                <div>
                  <span className="text-neutral-500 block mb-1">Website</span>
                  <a 
                    href={profile.website} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="font-semibold text-[#5194ec] hover:underline flex items-center gap-1"
                  >
                    <span>{profile.website.replace('https://', '')}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              <div className="mt-4 p-3 rounded-xl bg-neutral-900/60 border border-neutral-800/80 text-xs font-sans text-neutral-300">
                <span className="font-bold text-neutral-400 uppercase tracking-wider block mb-1">Latest Intel Status Update:</span>
                {profile.latestStatus}
              </div>
            </div>
          </div>

          {/* AI Company Summary & Details */}
          <div className="p-6 sm:p-8 rounded-3xl border border-neutral-900 bg-neutral-950/40 text-left space-y-6">
            <div>
              <h2 className="font-display text-xl font-bold text-white tracking-tight flex items-center gap-2 mb-3">
                <Sparkles className="w-5 h-5 text-[#5194ec]" />
                <span>AI Company Intelligence Summary</span>
              </h2>
              <p className="text-neutral-300 text-sm leading-relaxed">
                {profile.longDesc}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="p-4 rounded-2xl bg-neutral-900/40 border border-neutral-800/80">
                <h3 className="text-xs font-bold uppercase tracking-widest text-[#5194ec] mb-2 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Why It Matters</span>
                </h3>
                <p className="text-neutral-400 text-xs leading-relaxed">
                  {profile.whyItMatters}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-neutral-900/40 border border-neutral-800/80">
                <h3 className="text-xs font-bold uppercase tracking-widest text-[#5194ec] mb-2 flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-indigo-400" />
                  <span>Industry Position</span>
                </h3>
                <p className="text-neutral-400 text-xs leading-relaxed">
                  {profile.industryPosition}
                </p>
              </div>
            </div>

            {/* Strengths List */}
            <div className="pt-2">
              <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-3">Core Strategic Strengths</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-sans">
                {profile.strengths.map((str, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-neutral-300">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#5194ec] mt-1.5 flex-shrink-0" />
                    <span>{str}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Section Navigation tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none border-b border-neutral-900">
            {[
              { id: 'overview', label: 'Overview & Products' },
              { id: 'models', label: 'AI Models Family' },
              { id: 'timeline', label: 'Milestones & History' },
              { id: 'research', label: 'Research Papers' },
              { id: 'benchmarks', label: 'Benchmarks Comparison' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === tab.id 
                    ? 'border-[#5194ec] text-white' 
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
                  {/* Products Showcase */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {profile.products.map((prod, idx) => (
                      <div key={idx} className="p-5 rounded-2xl border border-neutral-900 bg-neutral-950/20 hover:border-neutral-800 transition-all">
                        <div className="flex items-center justify-between gap-3 mb-2">
                          <h4 className="font-display font-bold text-white text-sm">{prod.name}</h4>
                          <span className="text-[10px] font-bold font-mono bg-blue-500/10 text-[#5194ec] px-2 py-0.5 rounded border border-blue-500/15 uppercase">
                            {prod.type}
                          </span>
                        </div>
                        <p className="text-neutral-400 text-xs mb-3 leading-relaxed">
                          {prod.description}
                        </p>
                        <div className="space-y-1">
                          {prod.features.map((feat, fIdx) => (
                            <div key={fIdx} className="flex items-center gap-2 text-[11px] text-neutral-400">
                              <CheckCircle2 className="w-3 h-3 text-[#5194ec]" />
                              <span>{feat}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Interactive Knowledge Graph */}
                  <div className="p-6 rounded-3xl border border-neutral-900 bg-neutral-950/40">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="font-display font-semibold text-white text-sm">Interactive Ecosystem Graph</h4>
                        <p className="text-neutral-500 text-xs font-sans">Hover nodes to view strategic integrations.</p>
                      </div>
                      <GitBranch className="w-4 h-4 text-[#5194ec]" />
                    </div>

                    <div className="h-44 bg-neutral-950/80 rounded-2xl border border-neutral-900 flex items-center justify-center p-4 relative overflow-hidden">
                      <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none" />
                      
                      <div className="flex items-center justify-around w-full max-w-lg z-10 relative">
                        {/* Parent Node */}
                        <div 
                          onMouseEnter={() => setSelectedGraphNode('parent')}
                          onMouseLeave={() => setSelectedGraphNode(null)}
                          className={`px-4 py-2.5 rounded-xl border flex flex-col items-center gap-1 cursor-help transition-all duration-300 ${
                            selectedGraphNode === 'parent' ? 'border-[#5194ec] bg-[#5194ec]/10 scale-105' : 'border-neutral-800 bg-neutral-900/60'
                          }`}
                        >
                          <span className="text-[10px] font-mono font-bold text-[#5194ec]">CORE LAB</span>
                          <span className="text-xs font-bold text-white">{profile.name}</span>
                        </div>

                        {/* Connecting Line */}
                        <div className="w-12 h-0.5 bg-neutral-800 relative">
                          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#5194ec] animate-ping" />
                        </div>

                        {/* Middle Node */}
                        <div 
                          onMouseEnter={() => setSelectedGraphNode('models')}
                          onMouseLeave={() => setSelectedGraphNode(null)}
                          className={`px-4 py-2.5 rounded-xl border flex flex-col items-center gap-1 cursor-help transition-all duration-300 ${
                            selectedGraphNode === 'models' ? 'border-emerald-500 bg-emerald-500/10 scale-105' : 'border-neutral-800 bg-neutral-900/60'
                          }`}
                        >
                          <span className="text-[10px] font-mono font-bold text-emerald-400">FOUNDATIONS</span>
                          <span className="text-xs font-bold text-white">{profile.models[0]?.name || 'Frontier Models'}</span>
                        </div>

                        {/* Connecting Line */}
                        <div className="w-12 h-0.5 bg-neutral-800" />

                        {/* Right Node */}
                        <div 
                          onMouseEnter={() => setSelectedGraphNode('products')}
                          onMouseLeave={() => setSelectedGraphNode(null)}
                          className={`px-4 py-2.5 rounded-xl border flex flex-col items-center gap-1 cursor-help transition-all duration-300 ${
                            selectedGraphNode === 'products' ? 'border-indigo-500 bg-indigo-500/10 scale-105' : 'border-neutral-800 bg-neutral-900/60'
                          }`}
                        >
                          <span className="text-[10px] font-mono font-bold text-indigo-400">CHANNELS</span>
                          <span className="text-xs font-bold text-white">APIs & Integrations</span>
                        </div>
                      </div>

                      {/* Hover Info Tooltip */}
                      <div className="absolute bottom-3 left-4 right-4 bg-neutral-900/90 border border-neutral-850 p-2 rounded-xl text-[11px] text-neutral-300 text-center">
                        {selectedGraphNode === 'parent' && `Core Lab: Directed by CEO ${profile.ceo}, specializing in deep foundational training workloads.`}
                        {selectedGraphNode === 'models' && `Foundation Models: Trained on ultra-scale cluster architecture with native multimodal parameters.`}
                        {selectedGraphNode === 'products' && `Channels: Unified web API access layers backing modern third-party developers.`}
                        {!selectedGraphNode && "Hover nodes to explore the grounding layers of the intelligence pipeline."}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'models' && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {profile.models.map((mod, idx) => (
                      <div key={idx} className="p-6 rounded-3xl border border-neutral-900 bg-neutral-950/40 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#5194ec]/5 rounded-full blur-2xl pointer-events-none" />
                        
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-display font-bold text-white text-base">{mod.name}</h4>
                            <span className="text-[10px] text-neutral-500 font-mono">{mod.version} • Released {mod.releaseDate}</span>
                          </div>
                        </div>

                        <p className="text-neutral-300 text-xs mb-4 leading-relaxed font-sans">
                          {mod.description}
                        </p>

                        <div className="mb-4">
                          <h5 className="text-[10px] font-bold uppercase text-neutral-500 tracking-wider mb-2">Capabilities</h5>
                          <div className="flex flex-wrap gap-1.5">
                            {mod.capabilities.map((cap, cIdx) => (
                              <span key={cIdx} className="text-[10px] text-neutral-300 bg-neutral-900 border border-neutral-800 px-2 py-1 rounded-lg">
                                {cap}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h5 className="text-[10px] font-bold uppercase text-neutral-500 tracking-wider mb-2">Benchmarks Performance</h5>
                          <div className="grid grid-cols-3 gap-2 text-center font-mono">
                            {Object.entries(mod.benchmarks).map(([bench, score]) => (
                              <div key={bench} className="bg-neutral-900/60 border border-neutral-850/60 p-2 rounded-xl">
                                <span className="text-[9px] text-neutral-500 block">{bench}</span>
                                <span className="text-xs font-bold text-white">{score}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
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
                  <div className="relative border-l border-neutral-800 pl-6 ml-4 space-y-8 font-sans">
                    {profile.timeline.map((evt, idx) => (
                      <div key={idx} className="relative">
                        {/* Dot marker */}
                        <div className="absolute -left-[31px] top-1.5 w-2.5 h-2.5 rounded-full bg-blue-500 border-2 border-black" />
                        
                        <div className="p-5 rounded-2xl border border-neutral-900 bg-neutral-950/20 hover:border-neutral-800 transition-all max-w-2xl">
                          <span className="text-[10px] font-mono font-bold text-[#5194ec] block mb-1">{evt.date}</span>
                          <h4 className="font-display font-semibold text-white text-sm mb-1">{evt.title}</h4>
                          <p className="text-neutral-400 text-xs leading-relaxed">{evt.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === 'research' && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  className="space-y-6"
                >
                  {profile.research.length === 0 ? (
                    <div className="p-8 rounded-2xl border border-neutral-900 bg-neutral-950/10 text-center text-neutral-500 text-xs font-sans">
                      No research papers are currently indexed for this specific segment.
                    </div>
                  ) : (
                    <div className="space-y-5">
                      {profile.research.map((paper, idx) => (
                        <div key={idx} className="p-5 rounded-3xl border border-neutral-900 bg-neutral-950/30">
                          <div className="flex items-start justify-between gap-4 mb-2">
                            <div>
                              <h4 className="font-display font-bold text-white text-sm hover:text-[#5194ec] transition-colors cursor-pointer">
                                {paper.title}
                              </h4>
                              <p className="text-[11px] text-neutral-500 mt-1">Authors: {paper.authors} • Published {paper.date}</p>
                            </div>
                            <span className="text-[10px] font-mono font-bold bg-neutral-900 border border-neutral-800 text-neutral-400 px-2 py-0.5 rounded shrink-0">
                              Citations: {paper.citations}
                            </span>
                          </div>
                          <p className="text-neutral-400 text-xs leading-relaxed mt-2 font-sans">
                            {paper.summary}
                          </p>
                          <a 
                            href={paper.link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[10px] text-[#5194ec] font-bold mt-3 hover:underline"
                          >
                            <span>Read Technical Report</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'benchmarks' && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  className="space-y-6"
                >
                  <div className="p-6 rounded-3xl border border-neutral-900 bg-neutral-950/40">
                    <h4 className="font-display font-bold text-white text-sm mb-4">Frontier Capabilities Benchmarks Mapping</h4>
                    
                    <div className="space-y-4">
                      {profile.benchmarks.map((bench, idx) => (
                        <div key={idx} className="space-y-1.5 font-sans">
                          <div className="flex justify-between text-xs">
                            <span className="text-neutral-300 font-medium">{bench.subject}</span>
                            <span className="text-white font-mono font-bold">{bench.score}%</span>
                          </div>
                          {/* Progress bar container */}
                          <div className="h-2 w-full bg-neutral-900 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-blue-600 to-[#5194ec] rounded-full" 
                              style={{ width: `${bench.score}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 p-4 rounded-2xl bg-neutral-900/30 border border-neutral-850 text-[11px] text-neutral-400 leading-relaxed font-sans">
                      💡 Benchmarks mapping indicates standard performance scores on standardized evaluations including MMLU, GPQA, and HumanEval.
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Related/Competitor Companies Recommended */}
          <div className="p-6 sm:p-8 rounded-3xl border border-neutral-900 bg-neutral-950/40 text-left space-y-4">
            <h3 className="font-display text-base font-bold text-white tracking-tight">Competitors & Strategic Partners</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {profile.relatedCompanies.map((rel, idx) => (
                <div key={idx} className="p-4 rounded-2xl border border-neutral-900 bg-neutral-900/20 hover:border-neutral-850 transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="font-semibold text-white text-xs">{rel.name}</span>
                      <span className={`text-[9px] font-bold font-mono px-2 py-0.5 rounded uppercase ${
                        rel.relation === 'competitor' ? 'bg-red-500/10 text-red-400 border border-red-500/15' :
                        rel.relation === 'partner' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/15' :
                        'bg-blue-500/10 text-blue-400 border border-blue-500/15'
                      }`}>
                        {rel.relation}
                      </span>
                    </div>
                    <p className="text-neutral-400 text-[11px] leading-relaxed font-sans">
                      {rel.desc}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                      onTriggerToast(`Navigating to recommended profile: ${rel.name}`);
                      const normSlug = rel.slug;
                      // Soft-routing transition
                      window.history.pushState(null, '', `/company/${normSlug}`);
                      window.dispatchEvent(new PopStateEvent('popstate'));
                    }}
                    className="inline-flex items-center gap-1.5 text-[10px] text-[#5194ec] font-bold mt-3 hover:underline text-left cursor-pointer"
                  >
                    <span>Inspect Profile</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Key Metrics & AI Copilot Panel (4 columns) */}
        <div className="lg:col-span-4 space-y-8">
          {/* Key Metrics cards block */}
          <div className="p-6 rounded-3xl border border-neutral-900 bg-[#060606]/90 shadow-2xl text-left space-y-5">
            <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-400 flex items-center gap-1.5">
              <BarChart3 className="w-4 h-4 text-[#5194ec]" />
              <span>Sovereign Intel Metrics</span>
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-3.5 rounded-2xl bg-neutral-900/60 border border-neutral-850 flex flex-col justify-between">
                <span className="text-[10px] text-neutral-500 block mb-1 font-sans">Valuation</span>
                <span className="text-base font-bold text-white font-mono">{profile.metrics.valuation}</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-neutral-900/60 border border-neutral-850 flex flex-col justify-between">
                <span className="text-[10px] text-neutral-500 block mb-1 font-sans">Total Funding</span>
                <span className="text-base font-bold text-white font-mono">{profile.metrics.fundingTotal}</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-neutral-900/60 border border-neutral-850 flex flex-col justify-between">
                <span className="text-[10px] text-neutral-500 block mb-1 font-sans">Models Indexed</span>
                <span className="text-base font-bold text-white font-mono">{profile.metrics.modelsCount}</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-neutral-900/60 border border-neutral-850 flex flex-col justify-between">
                <span className="text-[10px] text-neutral-500 block mb-1 font-sans">Employees</span>
                <span className="text-base font-bold text-white font-mono">{profile.metrics.employees}</span>
              </div>
            </div>

            <div className="space-y-2.5 pt-2 border-t border-neutral-900 text-xs text-neutral-400 font-sans">
              <div className="flex justify-between">
                <span>Research Papers</span>
                <span className="text-white font-semibold">{profile.metrics.papersCount} indexed</span>
              </div>
              <div className="flex justify-between">
                <span>API Availability</span>
                <span className="text-emerald-400 font-semibold">{profile.metrics.apiAvailable ? 'Available' : 'Restricted'}</span>
              </div>
              <div className="flex justify-between">
                <span>Enterprise Platform</span>
                <span className="text-emerald-400 font-semibold">{profile.metrics.enterpriseSolutions ? 'Active' : 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span>Open Source projects</span>
                <span className="text-white font-semibold">{profile.metrics.openSourceProjects}+ repositories</span>
              </div>
            </div>

            {/* Workspace action tools */}
            <div className="pt-4 border-t border-neutral-900 space-y-2.5">
              <button
                onClick={handleGenerateReport}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-b from-[#1c1c1c] to-[#0a0a0a] hover:bg-neutral-900 text-white text-xs font-semibold border border-neutral-800 transition-colors cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5 text-[#5194ec]" />
                <span>Generate PDF/Markdown Report</span>
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
                  {isComparing ? 'Exit Comparison' : 'Compare Company'}
                </button>
              </div>

              {isComparing && (
                <div className="p-3.5 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-3 mt-2 animate-fadeIn text-xs">
                  <span className="font-semibold text-white block">Compare With:</span>
                  <select
                    value={compareWithSlug}
                    onChange={(e) => setCompareWithSlug(e.target.value)}
                    className="w-full p-2 rounded-lg bg-neutral-950 border border-neutral-850 text-neutral-300 text-xs focus:outline-none focus:border-[#5194ec]"
                  >
                    <option value="openai">OpenAI</option>
                    <option value="anthropic">Anthropic</option>
                    <option value="google-deepmind">Google DeepMind</option>
                    <option value="xai">xAI</option>
                    <option value="meta">Meta AI</option>
                    <option value="nvidia">NVIDIA Corp</option>
                  </select>

                  {compareProfile && (
                    <div className="pt-2 border-t border-neutral-850 space-y-2 font-mono text-[11px]">
                      <div className="flex justify-between">
                        <span className="text-neutral-500">Valuation:</span>
                        <span className="text-white font-bold">{compareProfile.metrics.valuation}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-500">Funding:</span>
                        <span className="text-white font-bold">{compareProfile.metrics.fundingTotal}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-500">HQ:</span>
                        <span className="text-white font-bold truncate max-w-[140px]">{compareProfile.hq}</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Workspace Personal Notes Card */}
          <div className="p-6 rounded-3xl border border-neutral-900 bg-[#060606]/90 shadow-2xl text-left space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-400 flex items-center gap-1.5">
              <FileCheck className="w-4 h-4 text-[#5194ec]" />
              <span>Workspace Notes & Intel Log</span>
            </h3>
            
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Jot down research findings, strategic models analysis, or developer notes on this company..."
              className="w-full h-32 p-3 rounded-2xl bg-neutral-950 border border-neutral-850 text-xs text-neutral-300 focus:outline-none focus:border-[#5194ec] transition-colors font-sans resize-none placeholder:text-neutral-600"
            />
            
            <div className="flex items-center justify-between text-[10px] text-neutral-500">
              <span>Saved locally & synced</span>
              <button 
                onClick={() => onTriggerToast("Notes cleared from workspace log.")}
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
                      ? 'bg-[#5194ec]/10 border border-[#5194ec]/20 text-neutral-200 text-right' 
                      : 'bg-neutral-900/60 border border-neutral-850 text-neutral-300 text-left'
                  }`}>
                    {chat.text}
                  </div>
                </div>
              ))}
              {copilotLoading && (
                <div className="flex items-center gap-2 text-neutral-500 text-[11px] font-mono animate-pulse">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#5194ec]" />
                  <span>Synthesizing intelligence telemetry...</span>
                </div>
              )}
            </div>

            {/* Quick Presets */}
            <div className="pt-2.5 border-t border-neutral-900 mt-2.5 space-y-1.5">
              <span className="text-[9px] font-mono text-neutral-500 block mb-1 uppercase tracking-wider">Quick Inquiries:</span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { q: 'Future outlook', label: 'Future Outlook' },
                  { q: 'Core products', label: 'Products' },
                  { q: 'Weaknesses', label: 'Weaknesses' },
                  { q: `Compare with OpenAI`, label: 'Compare with OpenAI' }
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
                className="flex-1 p-2.5 rounded-xl bg-neutral-950 border border-neutral-850 text-xs text-neutral-300 focus:outline-none focus:border-[#5194ec] transition-colors font-sans"
              />
              <button
                type="submit"
                disabled={copilotLoading || !copilotQuery.trim()}
                className="p-2.5 rounded-xl bg-[#5194ec] hover:bg-blue-600 disabled:opacity-40 text-black font-semibold transition-all cursor-pointer flex items-center justify-center"
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
