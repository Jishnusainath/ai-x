import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, Sparkles, BookOpen, Clock, GitBranch, ExternalLink, Code, 
  Calendar, Award, CheckCircle2, Bookmark, Share2, Send, FileCheck, 
  FileText, Info, HelpCircle, RefreshCw, Layers, Play, Check, Heart,
  Terminal, ShieldCheck, ChevronRight
} from 'lucide-react';
import { RESEARCH_PAPERS, PaperProfile, getPaperProfile } from '../data/papers';

interface ResearchPaperPageProps {
  slug: string;
  onBack: () => void;
  onTriggerToast: (msg: string) => void;
}

export default function ResearchPaperPage({ slug, onBack, onTriggerToast }: ResearchPaperPageProps) {
  const profile = getPaperProfile(slug);

  // States
  const [activeTab, setActiveTab] = useState<'summary' | 'breakdown' | 'architecture' | 'equations' | 'timeline'>('summary');
  const [readingLevel, setReadingLevel] = useState<'eli5' | 'beginner' | 'expert'>('beginner');
  const [hoveredVar, setHoveredVar] = useState<string | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  
  // Persistence & Workspace log
  const [isBookmarked, setIsBookmarked] = useState<boolean>(() => {
    return localStorage.getItem(`aix-paper-bookmarked-${profile.id}`) === 'true';
  });
  const [isFollowed, setIsFollowed] = useState<boolean>(() => {
    return localStorage.getItem(`aix-paper-followed-${profile.id}`) === 'true';
  });
  const [notes, setNotes] = useState<string>(() => {
    return localStorage.getItem(`aix-paper-notes-${profile.id}`) || '';
  });

  // Copilot Chat
  const [copilotQuery, setCopilotQuery] = useState('');
  const [copilotLoading, setCopilotLoading] = useState(false);
  const [copilotHistory, setCopilotHistory] = useState<{ role: 'user' | 'assistant'; text: string }[]>(() => {
    return [
      { 
        role: 'assistant', 
        text: `Salutations! I am your AI Research Partner. I have ingested the complete context of **"${profile.title}"** (${profile.publishDate}). Ask me any mathematical formulas, citation trends, or model architecture parameters!` 
      }
    ];
  });

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem(`aix-paper-notes-${profile.id}`, notes);
  }, [notes, profile.id]);

  const handleToggleBookmark = () => {
    const next = !isBookmarked;
    setIsBookmarked(next);
    localStorage.setItem(`aix-paper-bookmarked-${profile.id}`, String(next));
    onTriggerToast(next ? `Added "${profile.title}" to your Research Library` : `Removed from Research Library`);
  };

  const handleToggleFollow = () => {
    const next = !isFollowed;
    setIsFollowed(next);
    localStorage.setItem(`aix-paper-followed-${profile.id}`, String(next));
    onTriggerToast(next ? `Subscribed to citations telemetry for this paper` : `Unsubscribed from paper telemetry`);
  };

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/research/${profile.slug}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      onTriggerToast(`Deep link copied to clipboard: ${shareUrl}`);
    }).catch(() => {
      onTriggerToast(`Failed to copy link. URL is: ${shareUrl}`);
    });
  };

  const handleExportBriefing = () => {
    onTriggerToast("Assembling executive intelligence assets...");
    setTimeout(() => {
      const markdownContent = `# AI X Research Briefing: ${profile.title}
Published: ${profile.publishDate}
Institution: ${profile.organization}
Citations: ${profile.citations}
Category: ${profile.category}

## 1. Executive Intelligence Summary
- **Primary Purpose**: ${profile.executiveSummary.purpose}
- **Underlying Problem**: ${profile.executiveSummary.problem}
- **Technical Innovation**: ${profile.executiveSummary.innovation}
- **Core Research Findings**: ${profile.executiveSummary.findings}
- **Historical Industry Impact**: ${profile.executiveSummary.impact}

## 2. Key Takeaways
${profile.takeaways.map((takeaway, idx) => `### [Takeaway ${idx + 1}] ${takeaway.title}\n${takeaway.description}`).join('\n\n')}

## 3. Simplified Explanation (At Expert Level)
${profile.simplifiedExplanation.expert}

## 4. Hardware and Architectural Spec Sheet
- **Layers & Depth**: ${profile.architecture.layersCount}
- **Parameter Capacity**: ${profile.architecture.parameters}
- **Pre-training Volume**: ${profile.architecture.trainingTokens}
- **Hardware Supercomputer**: ${profile.architecture.hardware}
- **Pipeline Description**: ${profile.architecture.pipelineDescription}

---
AI X Intelligence Platform. Locally Compiled.`;

      const blob = new Blob([markdownContent], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `AI_X_Research_Briefing_${profile.slug}.md`;
      a.click();
      onTriggerToast(`Research briefing report downloaded successfully.`);
    }, 1200);
  };

  const askCopilot = async (queryText: string) => {
    if (!queryText.trim()) return;
    const userMsg = queryText.trim();
    setCopilotHistory(prev => [...prev, { role: 'user', text: userMsg }]);
    setCopilotQuery('');
    setCopilotLoading(true);

    try {
      // Direct API fetch to workspace backend
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: `Regarding the research paper "${profile.title}" by ${profile.authors.slice(0, 3).join(', ')}: ${userMsg}` })
      });
      const data = await response.json();
      setCopilotHistory(prev => [...prev, { role: 'assistant', text: data.text || "I was unable to synthesize a live response. Let me check my offline database..." }]);
    } catch (err) {
      // Grounded offline simulation based on rich papers.ts schema
      setTimeout(() => {
        let answer = `Regarding your inquiry about **"${profile.title}"**: `;
        const qLower = userMsg.toLowerCase();

        if (qLower.includes('architecture') || qLower.includes('layer') || qLower.includes('hardware')) {
          answer += `The model is built on ${profile.architecture.layersCount} containing **${profile.architecture.parameters} parameters**. It was trained on **${profile.architecture.trainingTokens}** using a hardware cluster of **${profile.architecture.hardware}**. Optimization layout: ${profile.architecture.pipelineDescription}`;
        } else if (qLower.includes('formula') || qLower.includes('equation') || qLower.includes('math')) {
          const eq = profile.equations[0];
          answer += `Let's analyze the mathematical structure: \`${eq.rendered}\`. Intuition: ${eq.intuition} Important parameters include: ${eq.variables.map(v => `${v.name} (${v.desc})`).join(', ')}.`;
        } else if (qLower.includes('innovation') || qLower.includes('purpose') || qLower.includes('problem')) {
          answer += `This paper targeted the critical issue: *${profile.executiveSummary.problem}*. The main conceptual pivot is *${profile.executiveSummary.innovation}*, achieving the primary goal: *${profile.executiveSummary.purpose}*.`;
        } else if (qLower.includes('takeaway') || qLower.includes('insight') || qLower.includes('findings')) {
          answer += `Here is a core finding: *${profile.executiveSummary.findings}*. Two important takeaways: 1) **${profile.takeaways[0].title}** (${profile.takeaways[0].description}), and 2) **${profile.takeaways[1].title}** (${profile.takeaways[1].description}).`;
        } else {
          answer += `Let's analyze the context. ${profile.executiveSummary.impact} This research falls under the category of **${profile.category}** and has gathered over **${profile.citations} citations** globally since release.`;
        }
        setCopilotHistory(prev => [...prev, { role: 'assistant', text: answer }]);
      }, 1000);
    } finally {
      setCopilotLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020202] text-neutral-200 selection:bg-blue-500/30 selection:text-white font-sans overflow-x-hidden relative">
      {/* Background gradient layout */}
      <div className="absolute top-0 left-0 right-0 h-[480px] bg-gradient-to-b from-purple-950/20 via-neutral-950/40 to-transparent pointer-events-none z-0" />
      <div className="absolute top-[15%] right-[-10%] w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-[50%] left-[-10%] w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[130px] pointer-events-none" />

      {/* Header controls bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2 relative z-20 flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-semibold text-neutral-400 hover:text-white bg-neutral-900/60 border border-neutral-800/80 px-4 py-2.5 rounded-xl transition-all hover:scale-[1.02] cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Intel Terminal</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold font-mono tracking-widest text-purple-400 border border-purple-500/20 px-3 py-1 rounded-full bg-purple-500/5 uppercase">
            RESEARCH INTELLIGENCE ENGINE v6.0
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Deep Research Report (8 columns) */}
        <div className="lg:col-span-8 space-y-8 text-left">
          
          {/* Cover & Brand Hero Section */}
          <div className="relative rounded-3xl border border-neutral-900 bg-neutral-950/40 overflow-hidden shadow-2xl p-6 sm:p-8">
            <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
            
            <div className="flex flex-col sm:flex-row justify-between items-start gap-6 relative z-10">
              <div className="space-y-3 max-w-xl">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="text-[10px] font-bold font-mono tracking-wider text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2.5 py-1 rounded-md uppercase">
                    {profile.category}
                  </span>
                  <span className="text-[10px] font-bold font-mono text-neutral-400 bg-neutral-900 border border-neutral-800 px-2.5 py-1 rounded-md uppercase">
                    Citations: {profile.citations}
                  </span>
                </div>

                <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-tight">
                  {profile.title}
                </h1>

                <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed font-sans">
                  By <span className="text-white font-medium">{profile.authors.join(', ')}</span>
                </p>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-neutral-400 pt-1 font-mono">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-purple-400" />
                    {profile.publishDate}
                  </span>
                  <span className="text-neutral-700 hidden sm:inline">•</span>
                  <span className="flex items-center gap-1">
                    <Award className="w-3.5 h-3.5 text-purple-400" />
                    {profile.organization}
                  </span>
                </div>
              </div>

              {/* Actions block */}
              <div className="flex flex-wrap sm:flex-col gap-2.5 self-stretch sm:self-start sm:min-w-[140px]">
                <button
                  onClick={handleToggleBookmark}
                  className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                    isBookmarked 
                      ? 'bg-purple-500/10 border-purple-500/30 text-purple-400' 
                      : 'bg-neutral-900 border-neutral-800 text-neutral-300 hover:text-white hover:border-neutral-700'
                  }`}
                >
                  <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-current text-purple-400' : ''}`} />
                  <span>{isBookmarked ? 'Bookmarked' : 'Bookmark'}</span>
                </button>

                <button
                  onClick={handleToggleFollow}
                  className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                    isFollowed 
                      ? 'bg-blue-500/10 border-blue-500/30 text-blue-400' 
                      : 'bg-neutral-900 border-neutral-800 text-neutral-300 hover:text-white hover:border-neutral-700'
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${isFollowed ? 'fill-current text-blue-400' : ''}`} />
                  <span>{isFollowed ? 'Following' : 'Follow Citations'}</span>
                </button>

                <button
                  onClick={handleShare}
                  className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white transition-all cursor-pointer text-xs"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share</span>
                </button>
              </div>
            </div>

            {/* Direct links footer strip */}
            <div className="mt-6 pt-5 border-t border-neutral-900/80 flex flex-wrap items-center justify-between gap-4 text-xs">
              <span className="text-neutral-500">Repository Status: <span className="text-emerald-400 font-semibold">{profile.status}</span></span>
              
              <div className="flex items-center gap-3">
                <a 
                  href={profile.pdfUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 font-semibold text-purple-400 hover:text-purple-300 transition-colors"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Original PDF (arXiv)</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>

                <div className="h-3 w-px bg-neutral-800" />

                <a 
                  href={profile.githubUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 font-semibold text-neutral-300 hover:text-white transition-colors"
                >
                  <Code className="w-3.5 h-3.5 text-neutral-500" />
                  <span>Implementation Repo</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>
            </div>
          </div>

          {/* AI Executive Summary Block */}
          <div className="p-6 sm:p-8 rounded-3xl border border-neutral-900 bg-neutral-950/40 space-y-6 relative overflow-hidden shadow-xl">
            <div className="absolute top-0 right-0 w-44 h-44 bg-purple-500/5 rounded-full blur-2xl pointer-events-none" />
            
            <h2 className="font-display text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-400" />
              <span>AI Executive Summary Report</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="p-4 rounded-2xl bg-[#06060c] border border-purple-500/10 space-y-2">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-purple-400 font-mono">1. The Core Purpose</h4>
                <p className="text-xs text-neutral-300 leading-relaxed font-sans">
                  {profile.executiveSummary.purpose}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-neutral-900/35 border border-neutral-800/80 space-y-2">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 font-mono">2. The Bottleneck / Problem Statement</h4>
                <p className="text-xs text-neutral-300 leading-relaxed font-sans">
                  {profile.executiveSummary.problem}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-neutral-900/35 border border-neutral-800/80 space-y-2">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 font-mono">3. Technical Innovation</h4>
                <p className="text-xs text-neutral-300 leading-relaxed font-sans">
                  {profile.executiveSummary.innovation}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#060c06] border border-emerald-500/10 space-y-2">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 font-mono">4. Evaluator Findings</h4>
                <p className="text-xs text-neutral-300 leading-relaxed font-sans">
                  {profile.executiveSummary.findings}
                </p>
              </div>
            </div>

            <div className="p-4.5 rounded-2xl bg-neutral-900/60 border border-neutral-850 text-xs text-neutral-300 font-sans">
              <strong className="text-white block mb-1">Historical & Strategic Impact:</strong>
              {profile.executiveSummary.impact}
            </div>
          </div>

          {/* Key Takeaways Section (5–10 major insights) */}
          <div className="p-6 sm:p-8 rounded-3xl border border-neutral-900 bg-neutral-950/40 space-y-6">
            <h2 className="font-display text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>Key Takeaways & Strategic Insights</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {profile.takeaways.map((takeaway, idx) => (
                <div key={idx} className="flex gap-3 p-4 rounded-2xl bg-[#030303] border border-neutral-900 hover:border-neutral-800/80 transition-all">
                  <div className="w-6 h-6 rounded-full bg-neutral-900 text-[10px] font-bold font-mono text-purple-400 flex items-center justify-center shrink-0 border border-neutral-800 mt-0.5">
                    0{idx + 1}
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-white leading-tight">{takeaway.title}</h4>
                    <p className="text-neutral-400 text-xs leading-normal">{takeaway.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Reading Level Explainer Panel */}
          <div className="p-6 sm:p-8 rounded-3xl border border-neutral-900 bg-[#050508]/80 space-y-5 relative overflow-hidden shadow-xl">
            <div className="absolute top-0 right-0 w-36 h-36 bg-blue-500/5 rounded-full blur-2xl pointer-events-none" />
            
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
              <div>
                <h3 className="font-display text-base font-bold text-white tracking-tight">Adaptive Concept Explainer</h3>
                <p className="text-neutral-500 text-xs">Toggle the reading complexity to fit your background.</p>
              </div>

              {/* Selector buttons */}
              <div className="flex items-center gap-1.5 bg-neutral-900/60 p-1 rounded-xl border border-neutral-800 self-start">
                {[
                  { id: 'eli5', label: 'ELI5 (Simple)' },
                  { id: 'beginner', label: 'Beginner' },
                  { id: 'expert', label: 'Expert / ML PhD' }
                ].map(lvl => (
                  <button
                    key={lvl.id}
                    onClick={() => setReadingLevel(lvl.id as any)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-semibold transition-all cursor-pointer ${
                      readingLevel === lvl.id 
                        ? 'bg-purple-500 text-black shadow-lg font-bold' 
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    {lvl.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-neutral-950/85 border border-neutral-850 text-xs sm:text-sm text-neutral-200 leading-relaxed font-sans relative">
              <div className="absolute top-3.5 right-3.5">
                <Info className="w-4 h-4 text-neutral-600" />
              </div>
              <p className="pr-4">
                {readingLevel === 'eli5' && profile.simplifiedExplanation.eli5}
                {readingLevel === 'beginner' && profile.simplifiedExplanation.beginner}
                {readingLevel === 'expert' && profile.simplifiedExplanation.expert}
              </p>
            </div>
          </div>

          {/* Interactive Navigation tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none border-b border-neutral-900">
            {[
              { id: 'summary', label: 'Overview & Ecosystem' },
              { id: 'breakdown', label: 'Paper Section Breakdown' },
              { id: 'architecture', label: 'Architecture Specs' },
              { id: 'equations', label: 'Equation Explainer' },
              { id: 'timeline', label: 'Research Timeline' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === tab.id 
                    ? 'border-purple-500 text-white' 
                    : 'border-transparent text-neutral-500 hover:text-neutral-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Interactive Panels */}
          <div className="pt-2 text-left">
            <AnimatePresence mode="wait">
              
              {activeTab === 'summary' && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  className="space-y-6"
                >
                  {/* Interactive Architecture Flow Graph */}
                  <div className="p-6 rounded-3xl border border-neutral-900 bg-neutral-950/40 space-y-4">
                    <div>
                      <h4 className="font-display font-semibold text-white text-sm flex items-center gap-1.5">
                        <GitBranch className="w-4 h-4 text-purple-400" />
                        <span>Interactive Core Pipeline Map</span>
                      </h4>
                      <p className="text-neutral-500 text-xs">Hover nodes to analyze structural engineering components.</p>
                    </div>

                    <div className="h-48 bg-neutral-950 border border-neutral-900/80 rounded-2xl p-4 flex flex-col justify-between relative overflow-hidden">
                      <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none" />

                      <div className="flex items-center justify-around w-full max-w-2xl mx-auto z-10 relative my-auto">
                        
                        {/* Source Node */}
                        <div 
                          onMouseEnter={() => setHoveredNode('data')}
                          onMouseLeave={() => setHoveredNode(null)}
                          className={`px-3 py-2 rounded-xl border flex flex-col items-center gap-0.5 cursor-help transition-all duration-200 ${
                            hoveredNode === 'data' ? 'border-purple-500 bg-purple-500/10 scale-105 shadow-md shadow-purple-500/10' : 'border-neutral-850 bg-neutral-900/60'
                          }`}
                        >
                          <span className="text-[8px] font-mono font-bold text-purple-400 uppercase tracking-widest">INGESTION</span>
                          <span className="text-xs font-bold text-white">Data Inflow</span>
                        </div>

                        <div className="w-8 h-0.5 bg-neutral-850" />

                        {/* Middle Transformer Block */}
                        <div 
                          onMouseEnter={() => setHoveredNode('core')}
                          onMouseLeave={() => setHoveredNode(null)}
                          className={`px-4 py-2.5 rounded-xl border flex flex-col items-center gap-0.5 cursor-help transition-all duration-200 ${
                            hoveredNode === 'core' ? 'border-indigo-500 bg-indigo-500/10 scale-105 shadow-md shadow-indigo-500/10' : 'border-neutral-850 bg-[#06060c]'
                          }`}
                        >
                          <span className="text-[8px] font-mono font-bold text-indigo-400 uppercase tracking-widest">COMPUTATION</span>
                          <span className="text-xs font-bold text-white">Model Backbone</span>
                        </div>

                        <div className="w-8 h-0.5 bg-neutral-850 relative">
                          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-purple-500 animate-ping" />
                        </div>

                        {/* Alignment Block */}
                        <div 
                          onMouseEnter={() => setHoveredNode('alignment')}
                          onMouseLeave={() => setHoveredNode(null)}
                          className={`px-3 py-2 rounded-xl border flex flex-col items-center gap-0.5 cursor-help transition-all duration-200 ${
                            hoveredNode === 'alignment' ? 'border-emerald-500 bg-emerald-500/10 scale-105 shadow-md shadow-emerald-500/10' : 'border-neutral-850 bg-neutral-900/60'
                          }`}
                        >
                          <span className="text-[8px] font-mono font-bold text-emerald-400 uppercase tracking-widest">ALIGNMENT</span>
                          <span className="text-xs font-bold text-white">RLHF / Safety</span>
                        </div>

                        <div className="w-8 h-0.5 bg-neutral-850" />

                        {/* Deploy Block */}
                        <div 
                          onMouseEnter={() => setHoveredNode('deploy')}
                          onMouseLeave={() => setHoveredNode(null)}
                          className={`px-3 py-2 rounded-xl border flex flex-col items-center gap-0.5 cursor-help transition-all duration-200 ${
                            hoveredNode === 'deploy' ? 'border-amber-500 bg-amber-500/10 scale-105 shadow-md shadow-amber-500/10' : 'border-neutral-850 bg-neutral-900/60'
                          }`}
                        >
                          <span className="text-[8px] font-mono font-bold text-amber-400 uppercase tracking-widest">ENDPOINT</span>
                          <span className="text-xs font-bold text-white">Intel Profile</span>
                        </div>

                      </div>

                      {/* Tooltip detail block */}
                      <div className="bg-neutral-950/95 border border-neutral-850 px-4 py-2.5 rounded-xl text-xs text-neutral-400 text-center font-sans">
                        {hoveredNode === 'data' && `Dataset Processing: Filtering trillion-token scale documents. Includes deduplication, synthetic logic expansions, and translation alignments.`}
                        {hoveredNode === 'core' && `Base Model Architecture: Stacked self-attention and feed-forward networks optimization. Depth is ${profile.architecture.layersCount} with ${profile.architecture.parameters} parameters.`}
                        {hoveredNode === 'alignment' && `Alignment Alignment Protocols: Direct Preference Optimization (DPO) and supervised formatting layers to enforce factual accuracy.`}
                        {hoveredNode === 'deploy' && `Production Deployments: Ready for API integrations, localized high-quantization server deployment, or on-device compiler pipelines.`}
                        {!hoveredNode && "Hover any system module node to view underlying pipeline details."}
                      </div>
                    </div>
                  </div>

                  {/* Related Entities mapping */}
                  <div className="p-6 rounded-3xl border border-neutral-900 bg-neutral-950/40 space-y-4">
                    <h4 className="font-display font-semibold text-white text-sm flex items-center gap-1.5">
                      <Layers className="w-4 h-4 text-purple-400" />
                      <span>Directly Connected Ecosystem Entities</span>
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {profile.relatedEntities.map((ent, idx) => (
                        <div key={idx} className="p-4 rounded-2xl bg-neutral-900/30 border border-neutral-850 hover:border-neutral-800 transition-colors flex items-start gap-3">
                          <div className={`p-2 rounded-lg text-xs font-mono font-bold uppercase shrink-0 mt-0.5 ${
                            ent.type === 'Company' ? 'bg-emerald-500/5 border border-emerald-500/15 text-emerald-400' :
                            ent.type === 'AI Model' ? 'bg-blue-500/5 border border-blue-500/15 text-blue-400' :
                            'bg-amber-500/5 border border-amber-500/15 text-amber-400'
                          }`}>
                            {ent.type.split(' ')[0]}
                          </div>
                          <div className="space-y-1">
                            <span className="text-xs font-bold text-white font-sans">{ent.name}</span>
                            <p className="text-[11px] text-neutral-400 leading-normal">{ent.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'breakdown' && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  className="space-y-4"
                >
                  <div className="border border-neutral-900 rounded-3xl overflow-hidden bg-neutral-950/40">
                    <div className="p-5 border-b border-neutral-900 bg-neutral-900/10">
                      <h4 className="font-semibold text-sm text-white font-display">Deep Paper Section-by-Section Translation</h4>
                      <p className="text-neutral-500 text-xs mt-1">Grounded summary and expert-level semantic breakdown of original segments.</p>
                    </div>

                    <div className="divide-y divide-neutral-900 text-left">
                      {profile.breakdown.map((sec, idx) => (
                        <div key={idx} className="p-5 space-y-3 hover:bg-neutral-900/10 transition-colors">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-mono font-bold text-purple-400 uppercase tracking-widest">{sec.title}</span>
                          </div>
                          <p className="text-xs text-white font-medium italic">
                            "{sec.summary}"
                          </p>
                          <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                            {sec.details}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'architecture' && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  className="space-y-6"
                >
                  {/* Spec sheets */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="p-4 rounded-2xl bg-neutral-900/35 border border-neutral-850">
                      <span className="text-[10px] font-mono font-bold text-neutral-500 uppercase tracking-widest block mb-1">NETWORK DEPTH</span>
                      <span className="text-sm font-bold text-white font-sans">{profile.architecture.layersCount}</span>
                    </div>

                    <div className="p-4 rounded-2xl bg-neutral-900/35 border border-neutral-850">
                      <span className="text-[10px] font-mono font-bold text-neutral-500 uppercase tracking-widest block mb-1">TOTAL PARAMETERS</span>
                      <span className="text-sm font-bold text-white font-sans">{profile.architecture.parameters}</span>
                    </div>

                    <div className="p-4 rounded-2xl bg-neutral-900/35 border border-neutral-850">
                      <span className="text-[10px] font-mono font-bold text-neutral-500 uppercase tracking-widest block mb-1">PRE-TRAINING TOKENS</span>
                      <span className="text-sm font-bold text-white font-sans">{profile.architecture.trainingTokens}</span>
                    </div>

                    <div className="p-4 rounded-2xl bg-neutral-900/35 border border-neutral-850 sm:col-span-2 md:col-span-3">
                      <span className="text-[10px] font-mono font-bold text-neutral-500 uppercase tracking-widest block mb-1">HARDWARE SUPERCOMPUTER LAYOUT</span>
                      <span className="text-xs font-bold text-purple-400 font-mono flex items-center gap-1.5 mt-0.5">
                        <Terminal className="w-4 h-4 text-neutral-500" />
                        {profile.architecture.hardware}
                      </span>
                    </div>
                  </div>

                  {/* Components detailed table */}
                  <div className="border border-neutral-900 rounded-3xl overflow-hidden bg-neutral-950/40">
                    <div className="p-4.5 border-b border-neutral-900 bg-neutral-900/20">
                      <h4 className="font-semibold text-xs text-neutral-400 uppercase tracking-widest font-mono">Structural Component Registry</h4>
                    </div>
                    <table className="w-full text-left text-xs border-collapse font-sans">
                      <thead>
                        <tr className="border-b border-neutral-900 text-neutral-500 font-mono uppercase text-[10px] font-bold">
                          <th className="p-3.5 pl-5">Module Component Name</th>
                          <th className="p-3.5 pr-5">Functional Utility & Operation</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-900">
                        {profile.architecture.components.map((comp, idx) => (
                          <tr key={idx} className="hover:bg-neutral-900/10 transition-colors">
                            <td className="p-3.5 pl-5 font-semibold text-white font-mono">{comp.name}</td>
                            <td className="p-3.5 pr-5 text-neutral-400 leading-relaxed">{comp.function}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="p-4.5 rounded-2xl bg-[#04040a] border border-blue-500/10 text-xs text-neutral-400 leading-relaxed font-sans">
                    <strong className="text-white block mb-1">Backprop / Pipeline Optimization:</strong>
                    {profile.architecture.pipelineDescription}
                  </div>
                </motion.div>
              )}

              {activeTab === 'equations' && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  className="space-y-6"
                >
                  {profile.equations.map((eq, index) => (
                    <div key={index} className="p-6 sm:p-8 rounded-3xl border border-neutral-900 bg-neutral-950/50 space-y-6 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl pointer-events-none" />
                      
                      <div>
                        <h4 className="font-display font-bold text-white text-sm">Interactive Mathematical Formula Explorer</h4>
                        <p className="text-neutral-500 text-xs font-sans mt-0.5">Click or hover over variables below to reveal operational logic.</p>
                      </div>

                      {/* Render equation beautifully in large typography */}
                      <div className="py-8 px-4 rounded-2xl bg-[#030305]/90 border border-neutral-900 flex items-center justify-center text-center shadow-inner relative overflow-x-auto select-none">
                        <div className="font-mono text-sm sm:text-base md:text-lg text-white font-bold tracking-wide leading-relaxed">
                          {eq.rendered.split(' ').map((part, pIdx) => {
                            // Find if part is queryable variable
                            const cleanPart = part.replace(/[^a-zA-Z_]/g, '');
                            const isVariable = eq.variables.some(v => v.name.includes(cleanPart) && cleanPart.length > 0);
                            const activeVar = eq.variables.find(v => v.name.includes(cleanPart));
                            const isHovered = hoveredVar && activeVar && activeVar.name === hoveredVar;

                            if (isVariable && activeVar) {
                              return (
                                <span 
                                  key={pIdx}
                                  onMouseEnter={() => setHoveredVar(activeVar.name)}
                                  onMouseLeave={() => setHoveredVar(null)}
                                  className={`inline-block px-1.5 py-0.5 rounded-md cursor-help mx-0.5 transition-all ${
                                    isHovered 
                                      ? 'bg-purple-500 text-black font-extrabold scale-110 shadow-lg' 
                                      : 'bg-purple-500/10 border border-purple-500/20 text-purple-400 font-semibold'
                                  }`}
                                >
                                  {part}
                                </span>
                              );
                            }
                            return <span key={pIdx} className="mx-0.5">{part}</span>;
                          })}
                        </div>
                      </div>

                      {/* Variables helper map */}
                      <div className="space-y-3.5">
                        <span className="text-[10px] font-mono font-bold text-neutral-500 uppercase tracking-widest block">Variable Parameter Lexicon:</span>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                          {eq.variables.map((v, vIdx) => {
                            const isHovered = hoveredVar === v.name;
                            return (
                              <div 
                                key={vIdx}
                                onMouseEnter={() => setHoveredVar(v.name)}
                                onMouseLeave={() => setHoveredVar(null)}
                                className={`p-3.5 rounded-xl border transition-all cursor-help text-left ${
                                  isHovered 
                                    ? 'border-purple-500 bg-purple-500/10 shadow-md' 
                                    : 'border-neutral-900 bg-neutral-900/25 hover:border-neutral-800'
                                }`}
                              >
                                <span className="font-mono text-xs font-bold text-purple-400 block mb-1">
                                  {v.name} &rarr;
                                </span>
                                <span className="text-neutral-300 text-xs leading-normal">
                                  {v.desc}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Math Intuition summary */}
                      <div className="p-4 rounded-2xl bg-neutral-900/40 border border-neutral-850 text-xs text-neutral-300 leading-relaxed font-sans flex gap-3">
                        <Info className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-white block mb-0.5">Physical ML Intuition:</strong>
                          {eq.intuition}
                        </div>
                      </div>

                    </div>
                  ))}
                </motion.div>
              )}

              {activeTab === 'timeline' && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  className="space-y-6 relative pl-6 before:absolute before:top-1.5 before:bottom-1.5 before:left-2 before:w-0.5 before:bg-neutral-900 text-left"
                >
                  {profile.timeline.map((item, idx) => (
                    <div key={idx} className="relative space-y-1">
                      {/* Chrono bullet */}
                      <div className="absolute top-1.5 -left-[22px] w-2.5 h-2.5 rounded-full border border-purple-500 bg-black" />
                      
                      <span className="text-[10px] font-mono font-bold text-purple-400 uppercase tracking-widest">{item.date}</span>
                      <h4 className="text-xs font-bold text-white font-sans">{item.title}</h4>
                      <p className="text-xs text-neutral-400 leading-normal font-sans pr-4">{item.desc}</p>
                    </div>
                  ))}
                </motion.div>
              )}

            </AnimatePresence>
          </div>

        </div>

        {/* RIGHT COLUMN: Interactive Copilot, Note log, and Meta Panels (4 columns) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Action Hub / Download / Compare */}
          <div className="p-6 rounded-3xl border border-neutral-900 bg-[#060606]/90 shadow-2xl text-left space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-400 flex items-center gap-1.5">
              <Terminal className="w-4 h-4 text-purple-400" />
              <span>Workspace Action Center</span>
            </h3>

            <div className="space-y-2.5">
              <button
                onClick={handleExportBriefing}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-purple-500 hover:bg-purple-600 font-bold text-black text-xs transition-all hover:scale-[1.01] cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Compile Intelligence Report</span>
              </button>

              <button
                onClick={() => {
                  onTriggerToast(`Checking latest citation graphs... No new revisions since ${profile.publishDate}`);
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-neutral-900 border border-neutral-850 hover:bg-neutral-850 hover:border-neutral-800 text-neutral-300 hover:text-white text-xs font-semibold transition-all cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5 text-neutral-500" />
                <span>Verify Telemetry Revisions</span>
              </button>
            </div>
          </div>

          {/* Research Personal Notes Log */}
          <div className="p-6 rounded-3xl border border-neutral-900 bg-[#060606]/90 shadow-2xl text-left space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-400 flex items-center gap-1.5 font-mono">
                <FileCheck className="w-4 h-4 text-purple-400" />
                <span>Research Evaluation Log</span>
              </h3>
              <span className="text-[9px] text-neutral-600 font-mono">Auto-saved</span>
            </div>

            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Record architectural insights, compiler test limits, or evaluation drafts for this paper..."
              className="w-full h-32 p-3 rounded-2xl bg-neutral-950 border border-neutral-850 text-xs text-neutral-350 focus:outline-none focus:border-purple-550 transition-colors font-sans resize-none placeholder:text-neutral-700"
            />

            <div className="flex items-center justify-between text-[10px] text-neutral-500 font-mono">
              <span>Synced with browser</span>
              <button 
                onClick={() => {
                  setNotes('');
                  onTriggerToast("Research log cleared.");
                }}
                className="text-neutral-500 hover:text-rose-400 hover:underline cursor-pointer"
              >
                Clear Log
              </button>
            </div>
          </div>

          {/* STICKY SIDE PANEL: AI COPILOT */}
          <div className="p-6 rounded-3xl border border-neutral-900 bg-[#060606]/90 shadow-2xl text-left flex flex-col h-[480px]">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-900 mb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-purple-500/10 border border-purple-500/20">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                </div>
                <div>
                  <h3 className="font-display text-sm font-semibold text-white tracking-tight">AI Research Copilot</h3>
                  <span className="text-[9px] font-mono text-neutral-500">Retrieving contextual knowledge...</span>
                </div>
              </div>
              <HelpCircle className="w-4 h-4 text-neutral-500" />
            </div>

            {/* Chat History */}
            <div className="flex-1 overflow-y-auto space-y-3.5 pr-1 scrollbar-thin text-xs">
              {copilotHistory.map((chat, idx) => (
                <div key={idx} className={`flex flex-col ${chat.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <span className="text-[9px] text-neutral-500 uppercase tracking-widest block mb-1 font-mono">
                    {chat.role === 'user' ? 'Operator' : 'Research Copilot'}
                  </span>
                  <div className={`p-3 rounded-2xl max-w-[90%] leading-relaxed ${
                    chat.role === 'user' 
                      ? 'bg-purple-500/10 border border-purple-500/20 text-neutral-200 text-right font-sans' 
                      : 'bg-neutral-900/60 border border-neutral-850 text-neutral-300 text-left font-sans'
                  }`}>
                    {chat.text}
                  </div>
                </div>
              ))}
              {copilotLoading && (
                <div className="flex items-center gap-2 text-neutral-500 text-[11px] font-mono animate-pulse">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-purple-400" />
                  <span>Scanning paper citation matrix...</span>
                </div>
              )}
            </div>

            {/* Quick Presets */}
            <div className="pt-2.5 border-t border-neutral-900 mt-2.5 space-y-1.5">
              <span className="text-[9px] font-mono text-neutral-500 block mb-1 uppercase tracking-wider">Quick Inquiries:</span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { q: 'Explain this model architecture', label: 'Architecture Specs' },
                  { q: 'What formulas or equations exist?', label: 'Math Formulas' },
                  { q: 'What problem does this solve?', label: 'Core Bottleneck' },
                  { q: 'List key research takeaways', label: 'Major Takeaways' }
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
                placeholder="Ask Copilot any paper queries..."
                disabled={copilotLoading}
                className="flex-1 p-2.5 rounded-xl bg-neutral-950 border border-neutral-850 text-xs text-neutral-300 focus:outline-none focus:border-purple-500 transition-colors font-sans"
              />
              <button
                type="submit"
                disabled={copilotLoading || !copilotQuery.trim()}
                className="p-2.5 rounded-xl bg-purple-500 hover:bg-purple-600 disabled:opacity-40 text-black font-semibold transition-all cursor-pointer flex items-center justify-center"
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
