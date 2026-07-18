import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, BookOpen, Clock, Layers, Star, Plus, Check, Award, 
  TrendingUp, Activity, Bell, FileText, ChevronRight, Share2, 
  RefreshCw, Bookmark, Eye, ArrowRight, Compass, ShieldAlert, Zap, Globe
} from 'lucide-react';
import { getCompanyProfile } from '../data/companies';
import { ModelProfile } from '../data/models';

interface ForYouDashboardProps {
  news: any[];
  bookmarks: string[];
  toggleBookmark: (url: string) => void;
  readArticles: string[];
  followedCategories: string[];
  toggleFollowCategory: (cat: string) => void;
  onOpenArticle: (art: any) => void;
  onOpenModel: (slug: string) => void;
  onOpenCompany: (slug: string) => void;
  onOpenResearch: (slug: string) => void;
  onOpenCopilotCompare?: (entityA: string, entityB: string) => void;
}

interface SmartAlert {
  id: string;
  type: 'release' | 'benchmark' | 'funding' | 'breakthrough' | 'breaking';
  title: string;
  source: string;
  time: string;
  details: string;
  entityName: string;
}

export default function ForYouDashboard({
  news,
  bookmarks,
  toggleBookmark,
  readArticles,
  followedCategories,
  toggleFollowCategory,
  onOpenArticle,
  onOpenModel,
  onOpenCompany,
  onOpenResearch,
  onOpenCopilotCompare
}: ForYouDashboardProps) {
  // --- STATE ---
  const [weeklyDigest, setWeeklyDigest] = useState<any>(null);
  const [digestLoading, setDigestLoading] = useState(false);

  // Watchlists followed state (using LocalStorage for persistence)
  const [followedCompanies, setFollowedCompanies] = useState<string[]>(() => {
    const saved = localStorage.getItem('aix-followed-companies');
    return saved ? JSON.parse(saved) : ['openai', 'google-deepmind'];
  });
  const [followedModels, setFollowedModels] = useState<string[]>(() => {
    const saved = localStorage.getItem('aix-followed-models');
    return saved ? JSON.parse(saved) : ['gpt-5', 'gemini-2-5'];
  });
  const [followedTopics, setFollowedTopics] = useState<string[]>(() => {
    const saved = localStorage.getItem('aix-followed-topics');
    return saved ? JSON.parse(saved) : ['Multimodal Logic', 'GPU Clusters'];
  });
  const [followedFunding, setFollowedFunding] = useState<boolean>(() => {
    return localStorage.getItem('aix-followed-funding') === 'true';
  });

  // Smart Alerts state
  const [alerts, setAlerts] = useState<SmartAlert[]>([
    {
      id: 'alert-1',
      type: 'release',
      title: 'Gemini 3.5 Flash Officially Released',
      source: 'Google DeepMind Press',
      time: 'Just now',
      details: 'Google has deployed Gemini 3.5 Flash globally, bringing enhanced context understanding and low-latency structured output APIs.',
      entityName: 'Gemini 3.5 Flash'
    },
    {
      id: 'alert-2',
      type: 'benchmark',
      title: 'GPT-5 Coding Benchmark Update',
      source: 'SWE-Bench Live',
      time: '2 hours ago',
      details: 'Latest verified evaluations on SWE-bench show GPT-5 achieving a 61.2% resolution score, surpassing previous models.',
      entityName: 'GPT-5'
    },
    {
      id: 'alert-3',
      type: 'funding',
      title: 'Mistral AI Secures $640M Series C Funding',
      source: 'TechCrunch',
      time: '1 day ago',
      details: 'Mistral AI completes key funding round led by international consortiums to expand European sovereign AI data clusters.',
      entityName: 'Mistral AI'
    },
    {
      id: 'alert-4',
      type: 'breakthrough',
      title: 'AlphaProof 2 solves IMO geometry proofs',
      source: 'Nature Research',
      time: '2 days ago',
      details: 'System achieves gold medal tier score in Olympiad proofs using formal math verification chains.',
      entityName: 'AlphaProof 2'
    }
  ]);

  // Synchronize followed states to LocalStorage
  useEffect(() => {
    localStorage.setItem('aix-followed-companies', JSON.stringify(followedCompanies));
  }, [followedCompanies]);

  useEffect(() => {
    localStorage.setItem('aix-followed-models', JSON.stringify(followedModels));
  }, [followedModels]);

  useEffect(() => {
    localStorage.setItem('aix-followed-topics', JSON.stringify(followedTopics));
  }, [followedTopics]);

  useEffect(() => {
    localStorage.setItem('aix-followed-funding', String(followedFunding));
  }, [followedFunding]);

  // Fetch / Generate Weekly Digest on mount
  useEffect(() => {
    fetchWeeklyDigest();
  }, [bookmarks, followedCategories]);

  const fetchWeeklyDigest = async () => {
    setDigestLoading(true);
    try {
      const res = await fetch('/api/copilot/weekly-digest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookmarks: bookmarks.map(b => b.substring(0, 100)),
          followedCategories: followedCategories
        })
      });
      const data = await res.json();
      setWeeklyDigest(data);
    } catch (err) {
      console.error("Failed to fetch Weekly Digest:", err);
      // Fallback
      setWeeklyDigest({
        summary: "This week, the AI ecosystem focused on mass custom silicon scaling and reasoning-level model upgrades. Frontier labs continued deployment of multi-agent software pipelines.",
        newsHighlights: [
          { title: "Gemini 3.5 Ultra Unveiled", takeaway: "Establishes a Sprints 9 & 10 frontier for multi-modal reasoning." },
          { title: "NVIDIA Blackwell enters mass production", takeaway: "Hyperscalers report massive computing density gains." }
        ],
        benchmarkChanges: "Reasoning and agentic coding benchmarks saw a median score increase of 8.2% across major evaluation frameworks.",
        personalRecommendations: [
          "Study Sprints 9 & 10 model releases in depth.",
          "Expand your tracking vectors in Hardware and AI regulation."
        ]
      });
    } finally {
      setDigestLoading(false);
    }
  };

  const handleToggleCompany = (id: string) => {
    setFollowedCompanies(prev => 
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const handleToggleModel = (id: string) => {
    setFollowedModels(prev => 
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    );
  };

  const handleToggleTopic = (topic: string) => {
    setFollowedTopics(prev => 
      prev.includes(topic) ? prev.filter(t => t !== topic) : [...prev, topic]
    );
  };

  // Personalized Recommendation Engine filtering
  const recommendedArticles = news.filter(item => {
    // Highly recommend if article category matches followed categories or is bookmarked
    const isFollowedCategory = followedCategories.includes(item.category);
    const isAlreadyBookmarked = bookmarks.includes(item.url);
    const isAlreadyRead = readArticles.includes(item.url);
    return isFollowedCategory && !isAlreadyBookmarked && !isAlreadyRead;
  }).slice(0, 3);

  // If we ran out of recommendations, grab top unread news
  const finalArticles = recommendedArticles.length > 0 
    ? recommendedArticles 
    : news.filter(n => !readArticles.includes(n.url)).slice(0, 3);

  // Recently Viewed (Read history)
  const recentlyReadArticles = news.filter(item => readArticles.includes(item.url)).slice(0, 3);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* LEFT COLUMN: Personal Intelligence Hub (Digest, Recommendations, Alerts) */}
      <div className="lg:col-span-8 space-y-6 text-left">
        {/* Weekly Digest Hero Newsletter */}
        <div className="relative p-6 sm:p-8 rounded-[32px] bg-gradient-to-br from-indigo-950/40 via-neutral-950 to-neutral-950 border border-indigo-500/10 shadow-2xl overflow-hidden backdrop-blur-xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-12 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl pointer-events-none" />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-neutral-900 pb-5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-indigo-500/10 text-indigo-400">
                <Sparkles className="w-5 h-5 text-indigo-400 animate-pulse" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-indigo-400 block">Personalized Newsletter</span>
                <h3 className="font-display text-lg sm:text-xl font-bold text-white tracking-tight">AI Weekly Digest</h3>
              </div>
            </div>

            <button
              onClick={fetchWeeklyDigest}
              disabled={digestLoading}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs font-semibold text-neutral-300 hover:text-white hover:bg-neutral-800 cursor-pointer transition-all disabled:opacity-50 font-sans"
            >
              <RefreshCw className={`w-3 h-3 ${digestLoading ? 'animate-spin' : ''}`} />
              Synthesize Digest
            </button>
          </div>

          {digestLoading ? (
            <div className="py-12 flex flex-col items-center justify-center gap-3">
              <div className="w-10 h-10 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
              <p className="text-xs text-neutral-500 font-mono">Running Sprints 9 & 10 analytical model compilers...</p>
            </div>
          ) : (
            <div className="space-y-5">
              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                {weeklyDigest?.summary || "Your custom Weekly AI report is ready to synthesize."}
              </p>

              {/* Weekly Highlights */}
              {weeklyDigest?.newsHighlights && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold font-mono uppercase tracking-widest text-neutral-500">Weekly Highlights</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {weeklyDigest.newsHighlights.map((hl: any, idx: number) => (
                      <div key={idx} className="p-3.5 rounded-2xl bg-neutral-900/40 border border-neutral-900/60 text-left">
                        <h5 className="text-xs font-bold text-white mb-1">{hl.title}</h5>
                        <p className="text-[11px] text-neutral-400 leading-normal">{hl.takeaway}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Custom Recommendations / Actions */}
              {weeklyDigest?.personalRecommendations && (
                <div className="pt-2">
                  <h4 className="text-xs font-bold font-mono uppercase tracking-widest text-neutral-500 mb-2.5">Suggested Curations</h4>
                  <ul className="space-y-2">
                    {weeklyDigest.personalRecommendations.map((rec: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs text-neutral-300">
                        <Zap className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5 animate-pulse" />
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Recommended Articles Carousel */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-display font-bold text-base text-white tracking-tight flex items-center gap-2">
              <Compass className="w-4.5 h-4.5 text-[#5194ec]" />
              Tailored For You
            </h4>
            <span className="text-[10px] font-mono text-neutral-500 font-bold uppercase">Based on Saved Categories</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {finalArticles.map((art) => {
              const isBookmarked = bookmarks.includes(art.url);
              return (
                <div 
                  key={art.url} 
                  className="p-5 rounded-2xl bg-neutral-900/30 border border-neutral-900 hover:border-neutral-800 transition-all duration-300 flex flex-col justify-between h-52 group relative overflow-hidden"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[10px] font-mono text-neutral-500">
                      <span className="uppercase font-bold tracking-wider text-blue-400">{art.category}</span>
                      <span>{art.date}</span>
                    </div>
                    <h5 className="font-bold text-xs sm:text-xs text-white line-clamp-3 group-hover:text-blue-300 transition-colors">
                      {art.title}
                    </h5>
                    <p className="text-[10px] text-neutral-400 line-clamp-3 leading-relaxed">
                      {art.summary}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-neutral-950 mt-2">
                    <button
                      onClick={() => onOpenArticle(art)}
                      className="text-[11px] font-bold text-[#5194ec] hover:underline flex items-center gap-1 cursor-pointer font-sans"
                    >
                      Read Now <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </button>

                    <button
                      onClick={() => toggleBookmark(art.url)}
                      className="p-1 text-neutral-500 hover:text-white transition-colors cursor-pointer"
                    >
                      {isBookmarked ? <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> : <Star className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recently Viewed & Continue Reading */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
          {/* Recently Read History */}
          <div className="space-y-4">
            <h4 className="font-display font-bold text-base text-white tracking-tight flex items-center gap-2">
              <Clock className="w-4.5 h-4.5 text-neutral-400" />
              Recently Browsed
            </h4>

            {recentlyReadArticles.length === 0 ? (
              <div className="p-6 rounded-2xl bg-neutral-950 border border-neutral-900/40 text-center text-xs text-neutral-500">
                You haven't read any articles in this session.
              </div>
            ) : (
              <div className="space-y-2">
                {recentlyReadArticles.map((art) => (
                  <div 
                    key={art.url}
                    onClick={() => onOpenArticle(art)}
                    className="p-3.5 rounded-xl bg-neutral-900/20 hover:bg-neutral-900/50 border border-neutral-900 flex items-center justify-between gap-3 cursor-pointer transition-colors"
                  >
                    <div className="text-left space-y-0.5 min-w-0 flex-grow">
                      <span className="text-[9px] font-mono font-bold text-neutral-500 block uppercase">{art.category}</span>
                      <h5 className="text-xs font-bold text-white truncate">{art.title}</h5>
                    </div>
                    <ChevronRight className="w-4 h-4 text-neutral-600 flex-shrink-0" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Suggested Comparisons Grid */}
          <div className="space-y-4 text-left">
            <h4 className="font-display font-bold text-base text-white tracking-tight flex items-center gap-2">
              <Layers className="w-4.5 h-4.5 text-indigo-400" />
              Suggested Comparisons
            </h4>

            <div className="grid grid-cols-1 gap-2.5">
              {[
                { label: 'GPT-5 vs Claude 4', desc: 'Reasoning depth & multi-step coding accuracy', entityA: 'gpt-5', entityB: 'claude-4' },
                { label: 'OpenAI vs Anthropic', desc: 'Enterprise scaling & safety alignments', entityA: 'openai', entityB: 'anthropic' },
                { label: 'Llama 4 vs Qwen 3', desc: 'Open-weights vs multi-modal performance', entityA: 'llama-4', entityB: 'qwen-3' }
              ].map((comp, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    if (onOpenCopilotCompare) onOpenCopilotCompare(comp.entityA, comp.entityB);
                  }}
                  className="p-3.5 rounded-xl bg-indigo-950/10 border border-indigo-950/40 hover:border-indigo-800 text-left flex items-center justify-between gap-3 group transition-colors cursor-pointer"
                >
                  <div className="min-w-0 flex-grow space-y-0.5">
                    <span className="text-xs font-bold text-white block font-sans">{comp.label}</span>
                    <p className="text-[10px] text-neutral-400 truncate leading-relaxed">{comp.desc}</p>
                  </div>
                  <Zap className="w-4 h-4 text-indigo-400 group-hover:text-amber-400 transition-colors flex-shrink-0 animate-pulse" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Watchlists, Alerts, Custom Follow Elements */}
      <div className="lg:col-span-4 space-y-6 text-left">
        {/* Watchlist Manager Panel */}
        <div className="p-6 rounded-[32px] bg-neutral-900/30 border border-neutral-900 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-neutral-950">
            <h4 className="font-display font-bold text-base text-white tracking-tight flex items-center gap-2">
              <Star className="w-4.5 h-4.5 text-amber-400" />
              Active Watchlist
            </h4>
            <span className="text-[10px] font-mono text-neutral-500 font-bold uppercase">Followed Entities</span>
          </div>

          <div className="space-y-4">
            {/* Followed Companies */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest block font-bold">Tracked Companies</span>
              <div className="flex flex-wrap gap-1.5">
                {['openai', 'anthropic', 'google-deepmind', 'xai', 'meta', 'nvidia'].map((comp) => {
                  const isFollowed = followedCompanies.includes(comp);
                  return (
                    <button
                      key={comp}
                      onClick={() => handleToggleCompany(comp)}
                      className={`px-3 py-1.5 rounded-xl text-[11px] font-semibold flex items-center gap-1.5 border transition-all cursor-pointer font-sans ${
                        isFollowed
                          ? 'bg-blue-500/10 border-blue-500/30 text-[#5194ec]'
                          : 'bg-neutral-950/40 border-neutral-900 text-neutral-400 hover:text-white'
                      }`}
                    >
                      <Plus className={`w-3 h-3 ${isFollowed ? 'rotate-45 text-blue-400' : ''}`} />
                      <span className="capitalize">{comp.replace('-', ' ')}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Followed Models */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest block font-bold">Tracked AI Models</span>
              <div className="flex flex-wrap gap-1.5">
                {['gpt-5', 'claude-4', 'gemini-2-5', 'deepseek-r1', 'llama-4'].map((mod) => {
                  const isFollowed = followedModels.includes(mod);
                  return (
                    <button
                      key={mod}
                      onClick={() => handleToggleModel(mod)}
                      className={`px-3 py-1.5 rounded-xl text-[11px] font-semibold flex items-center gap-1.5 border transition-all cursor-pointer font-sans ${
                        isFollowed
                          ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400'
                          : 'bg-neutral-950/40 border-neutral-900 text-neutral-400 hover:text-white'
                      }`}
                    >
                      <Plus className={`w-3 h-3 ${isFollowed ? 'rotate-45 text-indigo-400' : ''}`} />
                      <span className="uppercase">{mod.replace('-', ' ')}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Followed Topics */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest block font-bold">Research Areas</span>
              <div className="flex flex-wrap gap-1.5">
                {['Multimodal Logic', 'GPU Clusters', 'Synthetic Data', 'Formal Verification'].map((topic) => {
                  const isFollowed = followedTopics.includes(topic);
                  return (
                    <button
                      key={topic}
                      onClick={() => handleToggleTopic(topic)}
                      className={`px-3 py-1.5 rounded-xl text-[11px] font-semibold flex items-center gap-1.5 border transition-all cursor-pointer font-sans ${
                        isFollowed
                          ? 'bg-purple-500/10 border-purple-500/30 text-purple-400'
                          : 'bg-neutral-950/40 border-neutral-900 text-neutral-400 hover:text-white'
                      }`}
                    >
                      <Plus className={`w-3 h-3 ${isFollowed ? 'rotate-45 text-purple-400' : ''}`} />
                      <span>{topic}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Miscellaneous trackers */}
            <div className="pt-2 border-t border-neutral-950 flex items-center justify-between text-xs font-sans text-neutral-400">
              <span>Track Funding & Acquisitions</span>
              <button
                onClick={() => setFollowedFunding(!followedFunding)}
                className={`w-10 h-6 rounded-full p-0.5 transition-colors cursor-pointer ${followedFunding ? 'bg-[#5194ec]' : 'bg-neutral-800'}`}
              >
                <div className={`w-5 h-5 rounded-full bg-white transition-transform ${followedFunding ? 'translate-x-4' : 'translate-x-0'}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Smart Alerts Center Drawer */}
        <div className="p-6 rounded-[32px] bg-neutral-900/30 border border-neutral-900 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-neutral-950">
            <h4 className="font-display font-bold text-base text-white tracking-tight flex items-center gap-2">
              <Bell className="w-4.5 h-4.5 text-blue-400" />
              Smart Live Alerts
            </h4>
            <span className="text-[10px] font-mono text-neutral-500 font-bold uppercase animate-pulse">Live</span>
          </div>

          <div className="space-y-3">
            {alerts.map((alert) => (
              <div 
                key={alert.id}
                className="p-3.5 rounded-2xl bg-neutral-950/30 border border-neutral-900 hover:border-neutral-850 transition-colors text-left relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-2 h-full bg-[#5194ec]/10" />

                <div className="flex items-center justify-between text-[9px] font-mono text-neutral-500 mb-1">
                  <span className="uppercase font-bold tracking-wider text-blue-400">{alert.type}</span>
                  <span>{alert.time}</span>
                </div>
                <h5 className="text-xs font-bold text-white mb-0.5">{alert.title}</h5>
                <p className="text-[10px] text-neutral-400 leading-normal mb-2">{alert.details}</p>
                
                <span className="bg-neutral-900 text-neutral-500 text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-md uppercase border border-neutral-850">
                  {alert.entityName}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Dynamic Sector Benchmarks Tracker */}
        <div className="p-6 rounded-[32px] bg-neutral-900/30 border border-neutral-900 backdrop-blur-xl text-left">
          <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-neutral-950">
            <h4 className="font-display font-bold text-sm text-white tracking-tight flex items-center gap-2">
              <Award className="w-4.5 h-4.5 text-blue-400" />
              Median Benchmark Index
            </h4>
            <span className="text-[9px] font-mono text-neutral-500 uppercase font-bold">Verified Score</span>
          </div>

          <div className="space-y-3 font-sans">
            {[
              { category: 'Agentic Coding (SWE-Bench)', delta: '+8.2%', score: 61.2 },
              { category: 'Mathematical Proofs (AlphaProof)', delta: '+12.5%', score: 88.0 },
              { category: 'Long-Context Window (MMLU-C)', delta: '+4.0%', score: 94.5 }
            ].map((bm, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-neutral-400">{bm.category}</span>
                  <span className="text-emerald-400 font-bold font-mono">{bm.delta}</span>
                </div>
                <div className="w-full bg-neutral-950 rounded-full h-1.5 overflow-hidden border border-neutral-900">
                  <div className="bg-blue-500 h-full rounded-full" style={{ width: `${bm.score}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
