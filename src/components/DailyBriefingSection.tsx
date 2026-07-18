import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Calendar, BookOpen, Clock, Loader2, ArrowRight, ShieldCheck, Cpu } from 'lucide-react';

interface DailyBriefingSectionProps {
  news: any[];
  onOpenArticle: (article: any) => void;
  followedCategories: string[];
}

export default function DailyBriefingSection({ news, onOpenArticle, followedCategories }: DailyBriefingSectionProps) {
  const [briefing, setBriefing] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'morning' | 'custom'>('morning');

  // Hardcoded premium morning brief for July 15, 2026 as standard baseline
  const morningBriefMarkdown = `
# EXECUTIVE INTELLIGENCE SUMMARY — JULY 15, 2026
## 1. COMPUTE WARS & FOUNDRY YIELDS
TSMC has reported extreme progress on its **2nm experimental production line**, yielding **91.4% efficiency** on test chips for next-generation AI accelerators. This development substantially alleviates industry concerns regarding GPU and custom ASIC bottlenecks for the upcoming winter training runs.

## 2. THE RISE OF FRONTIER REASONING
DeepMind's **Gemini 3.5 Ultra** and the math-proof model **AlphaProof 2** have altered theoretical compute paradigms. AlphaProof 2 achieved a gold-medal standard score of **41/42** at the International Math Olympiad, validating the transition of large language models from standard sentence-completion engines to rigorous symbolic reasoning entities.

## 3. REGULATORY COMPLIANCE CLARITY
The EU Commission initiated formal compliance verification protocols under the newly active **AI Act guidelines**. While initially feared to stunt European startup operations, early data shows standardized safety-boundary verification processes have actually increased venture funding security by removing legal uncertainties.
`;

  const generateCustomBriefing = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/generate-briefing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookmarks: news.slice(0, 4),
          followedCategories
        })
      });
      const data = await res.json();
      setBriefing(data.markdown || "Unable to parse intelligence payload. Please try again.");
    } catch (err) {
      console.error(err);
      setBriefing("Connection error. Using offline backup framework to compile custom briefing.");
    } finally {
      setLoading(false);
    }
  };

  const currentBrief = activeTab === 'morning' ? morningBriefMarkdown : (briefing || "Compile a dynamic, real-time brief from your customized channels and interest tags below.");

  return (
    <div className="relative group rounded-[28px] border border-neutral-900/65 bg-neutral-950/30 overflow-hidden shadow-2xl p-6 sm:p-8 backdrop-blur-xl transition-all duration-300 hover:border-neutral-800/80 hover:bg-neutral-950/45 text-left">
      <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/5 rounded-full blur-[60px] pointer-events-none" />
      <div className="absolute -top-[10%] -left-[10%] w-[30%] h-[30%] bg-indigo-500/5 rounded-full blur-[50px] pointer-events-none" />

      {/* Header section with badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-900 pb-5 mb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold font-mono text-blue-400 bg-blue-500/5 border border-blue-500/15 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              ✦ Strategic Intel
            </span>
            <span className="text-xs font-mono text-neutral-500 flex items-center gap-1.5 select-none">
              <Clock className="w-3.5 h-3.5 text-neutral-600" />
              Est. Reading: 3 min
            </span>
          </div>
          <h3 className="font-display text-2xl font-semibold text-white tracking-tight mt-1.5">
            AI Daily Briefing Desk
          </h3>
        </div>

        {/* Tab selection */}
        <div className="flex items-center bg-neutral-900/50 p-1 rounded-xl border border-neutral-800/80">
          <button
            onClick={() => setActiveTab('morning')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'morning'
                ? 'bg-neutral-800 text-[#5194ec] border border-neutral-700/50 shadow-sm'
                : 'text-neutral-500 hover:text-neutral-300'
            }`}
          >
            Morning Brief
          </button>
          <button
            onClick={() => {
              setActiveTab('custom');
              if (!briefing) generateCustomBriefing();
            }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'custom'
                ? 'bg-neutral-800 text-[#5194ec] border border-neutral-700/50 shadow-sm'
                : 'text-neutral-500 hover:text-neutral-300'
            }`}
          >
            Custom Synthesis
          </button>
        </div>
      </div>

      {/* Render Markdown Content */}
      <div className="relative min-h-[160px]">
        {loading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#020202]/20 rounded-2xl">
            <Loader2 className="w-8 h-8 animate-spin text-[#5194ec]" />
            <span className="text-xs text-neutral-500 font-mono tracking-wider uppercase animate-pulse">
              Synthesizing real-time web news vector maps...
            </span>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {currentBrief.split("\n").map((line, i) => {
              if (line.startsWith("# ")) {
                return (
                  <h1 key={i} className="text-base font-bold font-display text-neutral-100 tracking-tight pb-1 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    {line.replace("# ", "")}
                  </h1>
                );
              }
              if (line.startsWith("## ")) {
                return (
                  <h2 key={i} className="text-xs font-bold uppercase tracking-widest text-[#5194ec] mt-5 font-mono">
                    {line.replace("## ", "")}
                  </h2>
                );
              }
              if (line.trim() === "") {
                return <div key={i} className="h-1" />;
              }
              
              // Custom text formatting
              let formattedText = line;
              const boldRegex = /\*\*(.*?)\*\*/g;
              const matches = [...formattedText.matchAll(boldRegex)];
              
              if (matches.length > 0) {
                return (
                  <p key={i} className="text-sm text-neutral-300 leading-relaxed font-sans">
                    {formattedText.split(boldRegex).map((part, index) => {
                      if (index % 2 === 1) {
                        return <strong key={index} className="text-white font-semibold">{part}</strong>;
                      }
                      return part;
                    })}
                  </p>
                );
              }

              return <p key={i} className="text-sm text-neutral-300 leading-relaxed font-sans">{line}</p>;
            })}
          </motion.div>
        )}
      </div>

      {/* Quick stats on followed channels inside Brief */}
      {activeTab === 'custom' && !loading && (
        <div className="mt-6 pt-5 border-t border-neutral-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold font-mono text-neutral-500 uppercase">Channels Hooked:</span>
            <div className="flex gap-1.5 flex-wrap">
              {followedCategories.map(cat => (
                <span key={cat} className="text-[9px] font-semibold text-neutral-300 bg-neutral-900 border border-neutral-800 px-2 py-0.5 rounded-lg">
                  #{cat}
                </span>
              ))}
            </div>
          </div>
          <button
            onClick={generateCustomBriefing}
            className="flex items-center gap-1.5 text-xs font-bold text-[#5194ec] hover:text-blue-400 transition-colors self-end group"
          >
            Re-compile Briefing
            <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      )}
    </div>
  );
}
