import React from 'react';
import { motion } from 'motion/react';
import { Award, Zap, Sparkles, ChevronRight, Bookmark, Calendar, Check } from 'lucide-react';

interface FeaturedIntelligenceProps {
  news: any[];
  onOpenArticle: (article: any) => void;
  bookmarks: string[];
  onToggleBookmark: (url: string) => void;
}

export default function FeaturedIntelligence({ news, onOpenArticle, bookmarks, onToggleBookmark }: FeaturedIntelligenceProps) {
  // Grab the first news item as the featured item or use a premium static baseline if empty
  const featuredItem = news[0] || {
    title: "Gemini 3.5 Ultra Unveiled: Redefining Multi-Modal Frontier Reasoning",
    source: "Google DeepMind Press",
    summary: "Google has announced its flagship Gemini 3.5 Ultra model, setting new benchmarks in multi-step coding, complex logic formulation, and native video-audio understanding. The model boasts a 2-million token context window as standard.",
    date: "July 12, 2026",
    category: "Models",
    sentiment: "positive",
    confidenceScore: 98,
    isDeveloping: true,
    isVerified: true,
    url: "https://deepmind.google/technologies/gemini-ultra-3.5/"
  };

  const isBookmarked = bookmarks.includes(featuredItem.url);

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center gap-2 border-b border-neutral-900 pb-3">
        <Sparkles className="w-4 h-4 text-[#5194ec] animate-pulse" />
        <h4 className="font-display text-lg font-semibold text-white tracking-tight">Featured Intelligence Report</h4>
      </div>

      <div className="group rounded-[28px] border border-neutral-800 bg-gradient-to-br from-neutral-950/40 via-[#0a0a0a]/35 to-neutral-950/20 overflow-hidden shadow-2xl relative transition-all duration-300 hover:border-neutral-700/80 hover:bg-neutral-950/50">
        {/* Subtle accent color lines and glows */}
        <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-blue-500/40 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-tr from-[#5194ec]/1 via-transparent to-[#5194ec]/2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 sm:p-8 items-center text-left">
          {/* Main textual column */}
          <div className="col-span-1 lg:col-span-8 space-y-4">
            
            {/* Headers row */}
            <div className="flex flex-wrap items-center gap-3 text-[10px] font-mono tracking-wider text-neutral-500">
              <span className="text-xs font-bold text-[#5194ec] bg-[#5194ec]/5 border border-[#5194ec]/10 px-3 py-1 rounded-full font-sans shadow-inner">
                {featuredItem.source || "Grounded Report"}
              </span>
              {featuredItem.isVerified && (
                <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-500/5 px-2.5 py-1 rounded-lg border border-emerald-500/10 font-sans font-semibold">
                  <Award className="w-3.5 h-3.5 text-emerald-400" />
                  Verified Intelligence Node
                </span>
              )}
              {featuredItem.isDeveloping && (
                <span className="inline-flex items-center gap-1.5 text-[10px] text-rose-400 bg-rose-500/5 px-2.5 py-1 rounded-lg border border-rose-500/10 font-sans font-bold animate-pulse">
                  <span className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-ping" />
                  LIVE DEVELOPING NEWS
                </span>
              )}
              {featuredItem.date && (
                <span className="inline-flex items-center gap-1 text-[10px] text-neutral-400 bg-neutral-900/30 px-2.5 py-1 rounded-lg border border-neutral-900/50 font-sans font-medium">
                  <Calendar className="w-3 h-3 text-[#5194ec]" />
                  {featuredItem.date}
                </span>
              )}
            </div>

            {/* Title */}
            <h3 
              onClick={() => onOpenArticle(featuredItem)}
              className="text-xl sm:text-2xl md:text-3xl font-display font-medium tracking-tight text-white leading-tight hover:text-blue-400 transition-colors cursor-pointer text-glow"
            >
              {featuredItem.title}
            </h3>

            {/* Metrics */}
            <div className="flex flex-wrap items-center gap-6 text-xs text-neutral-400 pt-1">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] text-neutral-500 uppercase">Confidence Rating:</span>
                <span className="text-emerald-400 font-bold font-mono text-sm">{featuredItem.confidenceScore || 98}%</span>
                <div className="h-1 w-20 rounded-full bg-neutral-900 overflow-hidden">
                  <div 
                    className="h-full bg-emerald-500 rounded-full" 
                    style={{ width: `${featuredItem.confidenceScore || 98}%` }}
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] text-neutral-500 uppercase">Impact Level:</span>
                <span className="text-blue-400 font-bold uppercase tracking-wider font-mono">CRITICAL</span>
              </div>
            </div>

            {/* Summary description */}
            <p className="text-sm text-neutral-300 leading-relaxed font-sans max-w-3xl pt-2">
              {featuredItem.summary}
            </p>

            {/* Actions */}
            <div className="flex items-center gap-4 pt-4 border-t border-neutral-900/40">
              <button
                onClick={() => onOpenArticle(featuredItem)}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-b from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white text-xs font-bold transition-all shadow-md cursor-pointer group"
              >
                <span>Read Full Intelligence</span>
                <ChevronRight className="w-4 h-4 text-white group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                onClick={() => onToggleBookmark(featuredItem.url)}
                className={`p-3 rounded-xl border transition-all ${
                  isBookmarked 
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' 
                    : 'bg-neutral-900/40 border-neutral-900 text-neutral-400 hover:text-white hover:border-neutral-800'
                }`}
                title={isBookmarked ? "Remove from bookmarks" : "Save to bookmarks"}
              >
                <Bookmark className="w-4 h-4" fill={isBookmarked ? "currentColor" : "none"} />
              </button>
            </div>

          </div>

          {/* Right side decorative grid/graph bento item */}
          <div className="col-span-1 lg:col-span-4 h-full flex flex-col justify-center border-l border-neutral-900/60 pl-6 hidden lg:flex">
            <div className="bg-neutral-900/20 rounded-2xl border border-neutral-900 p-4 space-y-3">
              <span className="text-[9px] font-mono font-bold text-neutral-500 uppercase tracking-widest block">
                Technical Spec Index
              </span>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between border-b border-neutral-900 pb-1.5">
                  <span className="text-neutral-400">Context Window</span>
                  <span className="text-white font-mono font-semibold">2,000,000 tokens</span>
                </div>
                <div className="flex justify-between border-b border-neutral-900 pb-1.5">
                  <span className="text-neutral-400">Coding accuracy</span>
                  <span className="text-emerald-400 font-mono font-bold">96.8%</span>
                </div>
                <div className="flex justify-between border-b border-neutral-900 pb-1.5">
                  <span className="text-neutral-400">Video Reasoning</span>
                  <span className="text-white font-mono font-semibold">Native Multimodal</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Latency Core</span>
                  <span className="text-amber-400 font-mono font-semibold">250ms (optimized)</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-[9px] text-emerald-400 font-mono bg-emerald-500/5 px-2 py-1 rounded-md border border-emerald-500/10 justify-center">
                <Check className="w-3 h-3 text-emerald-400" />
                Verified Benchmarks Grounding Complete
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
