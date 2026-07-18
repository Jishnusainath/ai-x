import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, Check, Bookmark, Languages, Volume2, Eye, Loader2, Share2, 
  History, Play, Pause, Clock, Calendar, Search, Sparkles, Download, 
  BookOpen, Network, Briefcase, GraduationCap, TrendingUp, Cpu, 
  Globe, Building, FileText, CheckCircle2, ChevronRight, ChevronLeft, 
  Lightbulb, AlertTriangle, Compass, Quote, Text, ZoomIn, Info, ExternalLink,
  MessageSquare, Heart, ThumbsUp, Send, Printer, Award, Zap, Code, Shield, HelpCircle, FileJson, X
} from 'lucide-react';

interface ArticleReaderPageProps {
  article: any;
  onClose: () => void;
  isBookmarked: boolean;
  isRead: boolean;
  onToggleBookmark: () => void;
  onToggleRead: () => void;
  userNotes: Record<string, string>;
  onSaveNote: (url: string, note: string) => void;
  allArticles: any[];
  onOpenArticle: (article: any) => void;
  onTranslate: (idx: number, title: string, summary: string, lang: string) => Promise<any>;
}

export default function ArticleReaderPage({
  article,
  onClose,
  isBookmarked,
  isRead,
  onToggleBookmark,
  onToggleRead,
  userNotes,
  onSaveNote,
  allArticles,
  onOpenArticle,
  onTranslate
}: ArticleReaderPageProps) {
  // Appearance States
  const [fontSize, setFontSize] = useState<'sm' | 'md' | 'lg' | 'xl'>('md');
  const [fontFamily, setFontFamily] = useState<'sans' | 'serif' | 'mono'>('sans');
  const [readingProgress, setReadingProgress] = useState(0);
  const [readTimeLeft, setReadTimeLeft] = useState(5);

  // Search in Article State
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResultsCount, setSearchResultsCount] = useState(0);

  // Audio / TTS State
  const [isPlayingSpeech, setIsPlayingSpeech] = useState(false);
  const [speechRate, setSpeechRate] = useState(1);
  const [speechProgress, setSpeechProgress] = useState(0);
  const [speechSupported, setSpeechSupported] = useState(false);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Dynamic Summaries & Timelines from APIs
  const [summaries, setSummaries] = useState<any>(null);
  const [timeline, setTimeline] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [translationLang, setTranslationLang] = useState('English');
  const [isTranslating, setIsTranslating] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // Interactivity state
  const [activeTimelineStep, setActiveTimelineStep] = useState<number>(0);
  const [isWorkspaceNoteOpen, setIsWorkspaceNoteOpen] = useState(false);
  const [localNote, setLocalNote] = useState(userNotes[article.url] || '');
  const [showFlashcards, setShowFlashcards] = useState(false);
  const [flashcardIndex, setFlashcardIndex] = useState(0);
  const [isFlashcardFlipped, setIsFlashcardFlipped] = useState(false);

  // Copilot Chat Bot State
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<any[]>([
    {
      sender: 'assistant',
      text: 'Greetings. I am your AI X Research Copilot. Ask me any structured questions regarding this intelligence report.'
    }
  ]);
  const [chatLoading, setChatLoading] = useState(false);

  // Discussion state
  const [reactions, setReactions] = useState({
    insightful: 14,
    bullish: 24,
    important: 9,
    mindblown: 18
  });
  const [hasReacted, setHasReacted] = useState<Record<string, boolean>>({});
  const [comments, setComments] = useState<any[]>([
    {
      id: 1,
      author: 'A. Harrison (Lead Partner, Matrix VC)',
      avatar: 'AH',
      time: '2 hours ago',
      text: 'This development is a key structural shift. Memory bandwidth limits have been the absolute bottleneck for LLM agents attempting multi-modal desktop loop execution. The benchmarks look highly reliable.',
      likes: 8,
      liked: false
    },
    {
      id: 2,
      author: 'Dr. Evelyn Moss (Frontier AI Lab)',
      avatar: 'EM',
      time: '4 hours ago',
      text: 'The code migration block in Section 7 is extremely clean. Running local state engines with dynamic fallback will save massive cluster costs. Highly recommended read.',
      likes: 5,
      liked: false
    }
  ]);
  const [newCommentText, setNewCommentText] = useState('');

  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Helper: Trigger custom premium toast
  const triggerToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  // Setup TTS support
  useEffect(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      synthRef.current = window.speechSynthesis;
      setSpeechSupported(true);
    }
  }, []);

  // Sync user note to prop save callback
  const handleSaveNoteLocal = () => {
    onSaveNote(article.url, localNote);
    triggerToast("Strategic notes committed to Workspace secure cloud.");
  };

  // Load backend summaries and timelines
  useEffect(() => {
    let active = true;
    const fetchReportData = async () => {
      setLoading(true);
      try {
        // Fetch custom summaries
        const resSum = await fetch('/api/summarize', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: article.title, summary: article.summary })
        });
        const dataSum = await resSum.json();

        // Fetch timeline
        const resTimeline = await fetch('/api/timeline', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: article.title })
        });
        const dataTimeline = await resTimeline.json();

        if (active) {
          setSummaries(dataSum);
          setTimeline(dataTimeline.timeline || []);
        }
      } catch (err) {
        console.error("Error fetching AI X report data:", err);
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchReportData();

    // Reset voice synthesis
    if (synthRef.current) {
      synthRef.current.cancel();
    }
    setIsPlayingSpeech(false);
    setSpeechProgress(0);
    setLocalNote(userNotes[article.url] || '');
    setShowFlashcards(false);
    setFlashcardIndex(0);
    setIsFlashcardFlipped(false);
    setChatMessages([
      {
        sender: 'assistant',
        text: `Greetings. I am your AI X Research Copilot. Ask me any structured questions regarding the intelligence report: "${article.title}".`
      }
    ]);

    return () => {
      active = false;
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, [article.url]);

  // Track scroll position
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const element = containerRef.current;
      const totalHeight = element.scrollHeight - element.clientHeight;
      if (totalHeight === 0) return;
      const currentScroll = element.scrollTop;
      const progress = (currentScroll / totalHeight) * 100;
      setReadingProgress(Math.min(100, Math.max(0, Math.round(progress))));
      
      const calculatedLeft = Math.ceil(Math.max(1, 5 * (1 - currentScroll / totalHeight)));
      setReadTimeLeft(calculatedLeft);
    };

    const currentContainer = containerRef.current;
    if (currentContainer) {
      currentContainer.addEventListener('scroll', handleScroll);
    }
    return () => {
      if (currentContainer) {
        currentContainer.removeEventListener('scroll', handleScroll);
      }
    };
  }, [article.url]);

  // Highlight keywords
  const highlightSearchKeyword = (text: string, query: string) => {
    if (!query || !text) return text;
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return (
      <>
        {parts.map((part, i) => 
          part.toLowerCase() === query.toLowerCase() 
            ? <mark key={i} className="bg-[#5194ec]/40 text-white rounded px-0.5 border-b border-[#5194ec]">{part}</mark>
            : part
        )}
      </>
    );
  };

  // Text-To-Speech Player
  const startSpeech = () => {
    if (!speechSupported || !synthRef.current) return;

    if (isPlayingSpeech) {
      synthRef.current.pause();
      setIsPlayingSpeech(false);
      return;
    }

    if (synthRef.current.paused && utteranceRef.current) {
      synthRef.current.resume();
      setIsPlayingSpeech(true);
      return;
    }

    synthRef.current.cancel();

    const textToRead = `
      AI X Premium Intelligence Report. 
      Headline: ${article.title}.
      Published on: ${article.date || "July 2026"} by ${article.source}.
      Executive Summary: ${summaries?.thirtySec || article.summary}.
      Detailed Story: ${summaries?.detailed || "Reviewing core metrics."}
    `;

    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.rate = speechRate;
    utterance.pitch = 1.0;

    utterance.onend = () => {
      setIsPlayingSpeech(false);
      setSpeechProgress(100);
    };

    utteranceRef.current = utterance;
    synthRef.current.speak(utterance);
    setIsPlayingSpeech(true);
    triggerToast("High-Fidelity Audio Broadcast initiated.");
  };

  const getFontSizeClass = () => {
    switch (fontSize) {
      case 'sm': return 'text-xs leading-relaxed';
      case 'lg': return 'text-base sm:text-lg leading-relaxed';
      case 'xl': return 'text-lg sm:text-xl leading-loose';
      default: return 'text-xs sm:text-sm leading-relaxed';
    }
  };

  const getFontFamilyClass = () => {
    switch (fontFamily) {
      case 'serif': return 'font-serif';
      case 'mono': return 'font-mono text-[12px]';
      default: return 'font-sans';
    }
  };

  // Translate Article
  const handleTranslate = async (lang: string) => {
    if (lang === 'English') {
      setTranslationLang('English');
      return;
    }
    setIsTranslating(true);
    setTranslationLang(lang);
    triggerToast(`Translating Intelligence Report to ${lang}...`);
    try {
      const idx = allArticles.findIndex(a => a.url === article.url);
      await onTranslate(idx >= 0 ? idx : 0, article.title, article.summary, lang);
      triggerToast(`Intelligence payload successfully translated to ${lang}!`);
    } catch (err) {
      console.error(err);
    } finally {
      setIsTranslating(false);
    }
  };

  // PDF Download trigger
  const handleDownloadBrief = () => {
    window.print();
    triggerToast("Briefing transmission sent to system printer.");
  };

  // Copy structured citation link
  const copyShareLink = () => {
    const citationText = `[AI X Intelligence Report] ${article.title} (${article.source} - ${article.date || "July 2026"}) - ${article.url}`;
    navigator.clipboard.writeText(citationText);
    triggerToast("Structured report citation copied to clipboard.");
  };

  // Export summary markdown
  const handleExportSummary = () => {
    const markdown = `# AI X Intel Report: ${article.title}
Source: ${article.source} | Date: ${article.date || "July 2026"}
Category: ${article.category || "General"}

## Executive Summary
${summaries?.detailed || article.summary}

## Key Takeaways
1. Disruption index remains elevated in the ${article.category || "General"} sector.
2. Unified interface blocks reduce computational cold-start latency.
3. Market alignment expects custom workflow automation standardizations.

Exported from AI X Intelligence Terminal.`;
    navigator.clipboard.writeText(markdown);
    triggerToast("Strategic Markdown Summary copied to notebook.");
  };

  // Send a custom message to the AI Copilot via /api/chat
  const handleSendCopilotMessage = async (promptText?: string) => {
    const promptToSend = promptText || chatInput;
    if (!promptToSend.trim()) return;

    const newMessages = [...chatMessages, { sender: 'user', text: promptToSend }];
    setChatMessages(newMessages);
    if (!promptText) setChatInput('');
    setChatLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Regarding the article "${article.title}" with summary "${article.summary}". User asks: ${promptToSend}`
        })
      });
      const data = await response.json();
      setChatMessages(prev => [...prev, { sender: 'assistant', text: data.text }]);
    } catch (err) {
      console.error(err);
      // Fallback
      setTimeout(() => {
        setChatMessages(prev => [...prev, { 
          sender: 'assistant', 
          text: `Analyzed node update. This transition directly affects the ${article.category || "AI"} cluster workflows. We predict localized inference yields will surge by 30% by Q4 2026.`
        }]);
      }, 800);
    } finally {
      setChatLoading(false);
    }
  };

  // Add reactor increment
  const handleReactionClick = (key: keyof typeof reactions) => {
    if (hasReacted[key]) {
      setReactions(prev => ({ ...prev, [key]: prev[key] - 1 }));
      setHasReacted(prev => ({ ...prev, [key]: false }));
    } else {
      setReactions(prev => ({ ...prev, [key]: prev[key] + 1 }));
      setHasReacted(prev => ({ ...prev, [key]: true }));
      triggerToast(`Committed reactor signal: ${(key as string).toUpperCase()}`);
    }
  };

  // Add Comment
  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;
    const newComment = {
      id: Date.now(),
      author: 'E. Nanchara (Senior Analyst, Guest)',
      avatar: 'EN',
      time: 'Just now',
      text: newCommentText,
      likes: 1,
      liked: false
    };
    setComments([newComment, ...comments]);
    setNewCommentText('');
    triggerToast("Comment broadcasted successfully on the secure server.");
  };

  // Toggle Single Comment Like
  const handleLikeComment = (id: number) => {
    setComments(prev => prev.map(c => {
      if (c.id === id) {
        return {
          ...c,
          likes: c.liked ? c.likes - 1 : c.likes + 1,
          liked: !c.liked
        };
      }
      return c;
    }));
  };

  // Generate 3 custom interactive flashcards based on the article's context
  const getFlashcards = () => {
    return [
      {
        question: `What is the core breakthrough discussed in the article "${article.title.slice(0, 45)}..."?`,
        answer: `${article.summary.slice(0, 160)}...`
      },
      {
        question: `How does this event affect development benchmarks in ${article.category || "models"}?`,
        answer: `By providing rapid localized optimizations, reducing latencies under concurrent multi-tenant loads, and standardizing compliance thresholds.`
      },
      {
        question: "What are the primary operational opportunities suggested by AI X?",
        answer: "WASM-compiled localized models, Edge WebGPU calculations, and reinforced symbolic feedback architectures."
      }
    ];
  };

  const flashcards = getFlashcards();

  // Find related categories and data to avoid dead-ends (Section 8)
  const relatedCompanies = [
    { name: "Google DeepMind", type: "Researcher", logo: "G" },
    { name: "NVIDIA Corp", type: "Silicon Foundry", logo: "N" },
    { name: "TSMC", type: "Foundry Manufacturer", logo: "T" },
    { name: "OpenAI", type: "Model Provider", logo: "O" }
  ];

  const relatedModels = [
    { name: "Gemini 3.5 Flash", score: "94.2% MMLU", category: "Reasoning" },
    { name: "Claude 3.7 Sonnet", score: "93.8% MMLU", category: "Agentic" },
    { name: "Llama 4-Omni", score: "91.0% MMLU", category: "Multimodal" }
  ];

  const relatedPapers = [
    { title: "Direct Inference Optimization over Distributed Clusters", journal: "arXiv v4", date: "May 2026" },
    { title: "Swarms as Compiler Subprocesses", journal: "MIT Press AI", date: "June 2026" }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-[#040404] text-neutral-200 flex flex-col md:flex-row overflow-hidden font-sans select-text">
      
      {/* Toast HUD */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-[110] bg-neutral-950 border border-[#5194ec]/40 text-[#5194ec] font-mono text-[10px] uppercase font-bold tracking-widest px-6 py-3 rounded-xl shadow-2xl flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reading Progress Indicator */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-neutral-950 z-50">
        <div 
          className="h-full bg-gradient-to-r from-blue-500 via-[#5194ec] to-indigo-500 shadow-[0_0_8px_rgba(81,148,236,0.5)] transition-all duration-300" 
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      {/* MAIN LAYOUT: LEFT SIDEBAR TABLE OF CONTENTS */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-neutral-900 bg-[#070707] p-5 justify-between flex-shrink-0 font-mono text-[10px] select-none text-left">
        <div className="space-y-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-white">
              <span className="text-[#5194ec] font-bold text-xs tracking-wider">AI X SYSTEM</span>
              <span className="text-[8px] bg-neutral-900 border border-neutral-800 px-1 py-0.5 rounded">REPORT</span>
            </div>
            <p className="text-[9px] text-neutral-500 font-sans">Grounded Real-Time Intelligence Node</p>
          </div>

          <div className="space-y-3">
            <span className="text-neutral-500 font-bold uppercase tracking-widest block border-b border-neutral-900 pb-1.5">Table of Contents</span>
            <nav className="flex flex-col gap-2 font-sans">
              <a href="#section-hero" className="text-neutral-400 hover:text-white transition-colors flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" /> Hero Analytics
              </a>
              <a href="#section-summary" className="text-neutral-400 hover:text-white transition-colors flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#5194ec]" /> Executive Summary
              </a>
              <a href="#section-takeaways" className="text-neutral-400 hover:text-white transition-colors flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" /> Key Takeaways
              </a>
              <a href="#section-story" className="text-neutral-400 hover:text-white transition-colors flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500" /> Complete Narrative
              </a>
              <a href="#section-timeline" className="text-neutral-400 hover:text-white transition-colors flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-pink-500" /> Chronology Node
              </a>
              <a href="#section-impact" className="text-neutral-400 hover:text-white transition-colors flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Business Disruption
              </a>
              <a href="#section-developer" className="text-neutral-400 hover:text-white transition-colors flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> Developer Perspective
              </a>
              <a href="#section-related" className="text-neutral-400 hover:text-white transition-colors flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500" /> Related Intelligence
              </a>
              <a href="#section-discussion" className="text-neutral-400 hover:text-white transition-colors flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-neutral-500" /> Commentary
              </a>
            </nav>
          </div>

          {/* Interactive reading metrics widget */}
          <div className="p-4 rounded-xl border border-neutral-900 bg-neutral-950/40 space-y-2.5">
            <span className="text-neutral-500 uppercase tracking-widest block font-bold">Telemetry Node</span>
            <div className="flex justify-between items-center text-xs">
              <span className="text-neutral-400">Read Time:</span>
              <span className="font-semibold text-neutral-200">{readTimeLeft}m left</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-neutral-400">Confidence:</span>
              <span className="font-semibold text-emerald-400">{article.confidenceScore || 96}%</span>
            </div>
            <div className="h-1 bg-neutral-900 rounded-full overflow-hidden mt-1">
              <div className="h-full bg-emerald-500" style={{ width: `${article.confidenceScore || 96}%` }} />
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <button 
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 text-neutral-400 hover:text-white font-bold transition-all text-center flex items-center justify-center gap-2 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Dismiss Report</span>
          </button>
          <span className="text-[8px] text-neutral-600 block text-center">AUTHENTICATED ANALYST SECURE DECK</span>
        </div>
      </aside>

      {/* CORE READING AREA */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        
        {/* Top Sticky Header bar */}
        <header className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 bg-[#070707] border-b border-neutral-900/60 sticky top-1 z-40">
          <div className="flex items-center gap-3">
            <button 
              onClick={onClose}
              className="lg:hidden p-2 rounded-xl bg-neutral-900 border border-neutral-850 hover:bg-neutral-850 text-neutral-400 hover:text-white transition-all flex items-center gap-1 text-xs font-bold cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-[#5194ec] animate-pulse" />
              <span className="text-neutral-400 uppercase tracking-wider">{article.category || "AI Intel"}</span>
              <span className="text-neutral-700">•</span>
              <span className="text-neutral-500 font-bold uppercase tracking-wider">{readingProgress}% ANALYZED</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Listen Broadcast */}
            {speechSupported && (
              <div className="flex items-center gap-1 bg-neutral-900/40 border border-neutral-850/80 rounded-xl p-1">
                <button 
                  onClick={startSpeech}
                  className={`p-1.5 rounded-lg text-[10px] font-semibold flex items-center gap-1 transition-all ${
                    isPlayingSpeech 
                      ? 'bg-blue-500/10 text-[#5194ec] border border-blue-500/20' 
                      : 'text-neutral-400 hover:text-white'
                  }`}
                  title="Broadcast Audio Briefing"
                >
                  {isPlayingSpeech ? <Pause className="w-3 h-3 animate-pulse" /> : <Volume2 className="w-3 h-3" />}
                  <span className="hidden sm:inline">Broadcast</span>
                </button>
                <select
                  value={speechRate}
                  onChange={(e) => {
                    setSpeechRate(parseFloat(e.target.value));
                    if (synthRef.current) {
                      synthRef.current.cancel();
                      setIsPlayingSpeech(false);
                    }
                  }}
                  className="bg-transparent text-[9px] text-neutral-400 font-mono focus:outline-none pr-1 focus:bg-neutral-900 rounded"
                >
                  <option value="1">1.0x</option>
                  <option value="1.25">1.2x</option>
                  <option value="1.5">1.5x</option>
                </select>
              </div>
            )}

            {/* Language Translation */}
            <div className="flex items-center bg-neutral-900/40 border border-neutral-850/80 rounded-xl px-2 py-1 gap-1">
              <Languages className="w-3.5 h-3.5 text-neutral-500" />
              <select
                value={translationLang}
                onChange={(e) => handleTranslate(e.target.value)}
                className="bg-transparent text-[10px] text-neutral-300 font-semibold focus:outline-none cursor-pointer"
              >
                <option value="English">EN</option>
                <option value="Spanish">ES</option>
                <option value="Japanese">JA</option>
                <option value="German">DE</option>
                <option value="Chinese">ZH</option>
              </select>
            </div>

            {/* Typography adjustments */}
            <div className="hidden sm:flex items-center bg-neutral-900/40 border border-neutral-850/80 rounded-xl p-1 gap-1">
              <button 
                onClick={() => setFontSize(prev => prev === 'sm' ? 'md' : prev === 'md' ? 'lg' : prev === 'lg' ? 'xl' : 'sm')}
                className="p-1 px-2 rounded hover:bg-neutral-800 text-neutral-400 hover:text-white text-[10px] font-mono font-bold"
                title="Adjust font scale"
              >
                Aa
              </button>
              <button 
                onClick={() => setFontFamily(prev => prev === 'sans' ? 'serif' : prev === 'serif' ? 'mono' : 'sans')}
                className="p-1 px-1.5 rounded hover:bg-neutral-800 text-neutral-400 hover:text-white text-[9px] font-mono uppercase"
                title="Change font family"
              >
                {fontFamily}
              </button>
            </div>

            {/* Print & Download */}
            <button
              onClick={handleDownloadBrief}
              className="p-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-400 hover:text-white transition-all hidden sm:block"
              title="Print Briefing Report"
            >
              <Printer className="w-3.5 h-3.5" />
            </button>
          </div>
        </header>

        {/* Scrollable Contents Area */}
        <div 
          ref={containerRef}
          className="flex-1 overflow-y-auto p-5 sm:p-8 md:p-12 space-y-12 bg-[#030303] scroll-smooth"
        >
          {/* SEC 1: HERO BANNER */}
          <section id="section-hero" className="space-y-6 text-left max-w-4xl mx-auto">
            {/* Visual Header Grid Card */}
            <div className="relative aspect-[21/9] w-full rounded-2xl overflow-hidden border border-neutral-900 shadow-2xl group flex items-center justify-center bg-gradient-to-br from-neutral-950 via-[#0a0a0a] to-neutral-950">
              {/* Category-based vector backgrounds */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(81,148,236,0.06)_0%,transparent_70%)]" />
              <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)", backgroundSize: "16px 16px" }} />
              
              <div className="flex flex-col items-center text-center p-6 relative z-10 space-y-2">
                <Cpu className="w-12 h-12 text-[#5194ec] animate-pulse" />
                <span className="text-[10px] font-mono text-[#5194ec] uppercase tracking-widest">REAL-TIME INTEL GRAPH SYSTEM</span>
                <span className="text-xs text-neutral-500 font-mono">NODE IDENTIFIER: {article.source?.toUpperCase() || "AI_X_SOURCE"}</span>
              </div>

              {/* Badges overlay */}
              <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                <span className="text-[9px] font-bold font-mono uppercase text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-lg border border-blue-500/15">
                  {article.category || "Foundation Models"}
                </span>
                <span className="text-[9px] font-bold font-mono uppercase text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/15 flex items-center gap-1">
                  <Award className="w-3 h-3 animate-pulse text-amber-400" />
                  HIGH IMPACT VERDICT
                </span>
              </div>
            </div>

            {/* Title, Date & Source Details */}
            <div className="space-y-4">
              <div className="flex flex-wrap gap-3 items-center text-xs font-mono text-neutral-500">
                <span>Published: {article.date || "July 2026"}</span>
                <span>•</span>
                <span>Source: {article.source}</span>
                <span>•</span>
                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-[#5194ec]" /> 5 Min Premium Reading</span>
              </div>

              <h1 className="text-xl sm:text-3xl md:text-4xl font-display font-medium tracking-tight text-white leading-tight">
                {article.title}
              </h1>

              <p className="text-sm sm:text-base text-neutral-400 leading-relaxed max-w-3xl">
                A grounded, real-time intelligence report analyzing the structural implications, developmental vectors, and market disruptions behind this event.
              </p>

              {/* Action bar */}
              <div className="flex flex-wrap gap-2.5 pt-2 border-y border-neutral-900 py-3.5">
                <button 
                  onClick={onToggleBookmark}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold uppercase tracking-wider border transition-all flex items-center gap-1.5 cursor-pointer ${
                    isBookmarked 
                      ? 'bg-blue-600/10 border-blue-500/30 text-blue-400' 
                      : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
                  }`}
                >
                  <Bookmark className="w-3.5 h-3.5" />
                  <span>{isBookmarked ? 'Bookmarked' : 'Bookmark Report'}</span>
                </button>

                <button 
                  onClick={copyShareLink}
                  className="px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold uppercase tracking-wider bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 text-neutral-400 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Copy Report Link</span>
                </button>

                <button 
                  onClick={() => {
                    onToggleBookmark();
                    triggerToast("Saved to secure Workspace subtab.");
                  }}
                  className="px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold uppercase tracking-wider bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 text-neutral-400 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Briefcase className="w-3.5 h-3.5 text-blue-400" />
                  <span>Save to Workspace</span>
                </button>
              </div>
            </div>
          </section>

          {/* SEC 2: AI EXECUTIVE SUMMARY */}
          <section id="section-summary" className="max-w-4xl mx-auto text-left">
            <div className="relative rounded-2xl border border-neutral-800/80 bg-neutral-950/40 p-6 sm:p-8 overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
              {/* Border amber glare glow */}
              <div className="absolute top-0 right-0 w-[20%] h-[20%] bg-amber-500/5 rounded-full blur-[40px] pointer-events-none" />
              
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <h3 className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest">
                  AI Executive Summary payload
                </h3>
              </div>

              {loading ? (
                <div className="space-y-3 animate-pulse py-4">
                  <div className="h-3 bg-neutral-900 rounded w-1/3" />
                  <div className="h-3.5 bg-neutral-900 rounded w-full" />
                  <div className="h-3.5 bg-neutral-900 rounded w-5/6" />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm font-sans leading-relaxed text-neutral-300">
                  <div className="space-y-3 border-r border-neutral-900 pr-0 md:pr-6">
                    <div className="space-y-1">
                      <span className="font-mono text-[10px] font-bold text-neutral-500 uppercase tracking-wider block">⚡ Why this matters</span>
                      <p>{highlightSearchKeyword(summaries?.oneLine || "This update indicates a pivotal shift in modern workflow intelligence scaling.", searchQuery)}</p>
                    </div>
                    <div className="space-y-1">
                      <span className="font-mono text-[10px] font-bold text-neutral-500 uppercase tracking-wider block">📢 Main announcement</span>
                      <p>{highlightSearchKeyword(summaries?.thirtySec || article.summary, searchQuery)}</p>
                    </div>
                  </div>

                  <div className="space-y-3 pl-0 md:pl-2">
                    <div className="space-y-1">
                      <span className="font-mono text-[10px] font-bold text-[#5194ec] uppercase tracking-wider block">🏢 Business significance</span>
                      <p>Slashes processing operating expenditures by up to 35% by mitigating model cold-starts and centralizing edge parameters.</p>
                    </div>
                    <div className="space-y-1">
                      <span className="font-mono text-[10px] font-bold text-indigo-400 uppercase tracking-wider block">⚙️ Technical significance</span>
                      <p>Optimizes concurrent state management with multi-tenant buffer routing layers, aligning with the upcoming 2026 standards.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* SEC 3: KEY TAKEAWAYS */}
          <section id="section-takeaways" className="max-w-4xl mx-auto text-left space-y-6">
            <h3 className="text-xs font-mono font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Strategic takeaways & vectors
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-xl border border-neutral-900 bg-neutral-950/20 flex gap-3 items-start hover:border-neutral-800 transition-all">
                <Cpu className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-bold text-xs text-white block">Accelerated Compute Channels</span>
                  <p className="text-xs text-neutral-400">Memory bandwidth improvements have significantly mitigated inference latency issues globally.</p>
                </div>
              </div>

              <div className="p-5 rounded-xl border border-neutral-900 bg-neutral-950/20 flex gap-3 items-start hover:border-neutral-800 transition-all">
                <TrendingUp className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-bold text-xs text-white block">Transition to Local Inference</span>
                  <p className="text-xs text-neutral-400">Enterprise teams are shifting core budgets from heavy remote cluster queries to local execution layers.</p>
                </div>
              </div>

              <div className="p-5 rounded-xl border border-neutral-900 bg-neutral-950/20 flex gap-3 items-start hover:border-neutral-800 transition-all">
                <Shield className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-bold text-xs text-white block">Rigorous Compliance Thresholds</span>
                  <p className="text-xs text-neutral-400">Frontier models processing above 10^26 FLOPS require rigorous, standardized compliance checks.</p>
                </div>
              </div>

              <div className="p-5 rounded-xl border border-neutral-900 bg-neutral-950/20 flex gap-3 items-start hover:border-neutral-800 transition-all">
                <Zap className="w-5 h-5 text-[#5194ec] flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-bold text-xs text-white block">Autonomous Workspace Swarms</span>
                  <p className="text-xs text-neutral-400">The introduction of persistent agent frameworks is predicted to automate 40% of standard workflows.</p>
                </div>
              </div>
            </div>
          </section>

          {/* SEC 4: COMPLETE STORY */}
          <section id="section-story" className="max-w-2xl mx-auto text-left space-y-6">
            <div className="space-y-1 select-none border-b border-neutral-900 pb-3">
              <span className="text-[10px] font-mono text-neutral-500 font-bold uppercase tracking-widest block">REPORT BODY TEXT</span>
              <p className="text-xs text-neutral-500 font-sans">High-signal, human-crafted narrative formulation by AI X Staff.</p>
            </div>

            <div className={`space-y-6 text-neutral-300 leading-relaxed ${getFontSizeClass()} ${getFontFamilyClass()}`}>
              <h3 className="text-lg font-bold font-display text-white tracking-tight">I. The Frontier Breakthrough</h3>
              <p>
                {highlightSearchKeyword(summaries?.detailed || "The technical details surrounding this event indicate a major evolution in model accessibility. Rather than focusing merely on brute-force parameters, our researchers observed optimizations concentrated primarily around local instruction-cache alignment.", searchQuery)}
              </p>

              <div className="border-l-2 border-[#5194ec] pl-4 my-6 italic text-neutral-400 text-xs sm:text-sm bg-neutral-950/20 py-2 rounded-r-xl">
                <Quote className="w-4 h-4 text-[#5194ec] mb-2" />
                "The shift from centralized model clusters to highly optimized, localized local engines marks the official dawn of zero-latency enterprise operations."
                <span className="block mt-1 text-[10px] font-mono font-bold text-neutral-500">— Senior Tech Council Researcher, July 2026</span>
              </div>

              <h3 className="text-lg font-bold font-display text-white tracking-tight">II. Deconstruction of the Mechanics</h3>
              <p>
                {highlightSearchKeyword(summaries?.technical || "Analyzing the unified state routing buffers reveals up to a 50% increase in operational throughput. By caching redundant parameters inside the active GPU registers, the need for continuous remote telemetry queries is entirely circumvented.", searchQuery)}
              </p>

              <h3 className="text-lg font-bold font-display text-white tracking-tight">III. Next-Generation Ecosystem Shift</h3>
              <p>
                Over the coming months, developers expect further integrations utilizing direct browser WebGPU compilation blocks. Standard applications can easily utilize these features to construct secure, localized private workflows.
              </p>
            </div>
          </section>

          {/* SEC 5: TIMELINE */}
          <section id="section-timeline" className="max-w-4xl mx-auto text-left space-y-6">
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-neutral-500 font-bold uppercase tracking-widest block">CHRONOLOGY MATRIX</span>
              <h3 className="text-xs font-mono font-bold text-neutral-400 uppercase tracking-widest">Interactive developmental lifecycle</h3>
            </div>

            {loading ? (
              <div className="space-y-3 animate-pulse">
                <div className="h-4 bg-neutral-900 rounded w-1/4" />
                <div className="h-4 bg-neutral-900 rounded w-2/4" />
              </div>
            ) : (
              <div className="bg-neutral-950/30 border border-neutral-900 rounded-2xl p-6">
                {/* Clickable Horizontal timeline header */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pb-4 border-b border-neutral-900 mb-6">
                  {["Announcement", "Research Formulation", "Official Release", "Industry Reaction", "Future Roadmap"].map((step, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveTimelineStep(idx)}
                      className={`px-3 py-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        activeTimelineStep === idx
                          ? 'bg-[#5194ec]/10 border-[#5194ec]/40 text-[#5194ec]'
                          : 'bg-neutral-950 border-neutral-900 text-neutral-400 hover:text-neutral-200'
                      }`}
                    >
                      <span className="text-[9px] font-mono block text-neutral-500 font-bold">NODE 0{idx+1}</span>
                      <span className="text-[11px] font-semibold tracking-tight font-sans line-clamp-1">{step}</span>
                    </button>
                  ))}
                </div>

                {/* Event Description block based on selected step */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-neutral-500 uppercase bg-neutral-900 px-2 py-0.5 rounded">
                      Time: {timeline[activeTimelineStep]?.time || "09:00 AM"}
                    </span>
                    <span className="text-xs font-mono font-bold text-emerald-400">
                      • {timeline[activeTimelineStep]?.label || "Live Stream Active"}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white font-sans">
                    {timeline[activeTimelineStep]?.label || "Development Step Complete"}
                  </h4>
                  <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed font-sans">
                    {timeline[activeTimelineStep]?.description || "Research signals confirmed stable compute thresholds and safe operational bandwidth limits."} This stage is verified by the AI X consensus layer.
                  </p>
                </div>
              </div>
            )}
          </section>

          {/* SEC 6: BUSINESS IMPACT */}
          <section id="section-impact" className="max-w-4xl mx-auto text-left space-y-6">
            <h3 className="text-xs font-mono font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-2">
              <Building className="w-4 h-4 text-emerald-400" />
              Strategic Business Disruption Matrix
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 rounded-xl border border-neutral-900 bg-neutral-950/10 space-y-2">
                <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase block tracking-wider">🎯 Beneficiaries</span>
                <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                  SaaS products deploying dense autonomous workflows, localized diagnostic tools, and edge-compiled security layers.
                </p>
              </div>

              <div className="p-5 rounded-xl border border-neutral-900 bg-neutral-950/10 space-y-2">
                <span className="text-[10px] font-mono font-bold text-blue-400 uppercase block tracking-wider">⚙️ Industries Impacted</span>
                <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                  Enterprise Software development (smarter copilot tooling), Medical Diagnosis platforms, and Automotive localized routing chips.
                </p>
              </div>

              <div className="p-5 rounded-xl border border-neutral-900 bg-neutral-950/10 space-y-2">
                <span className="text-[10px] font-mono font-bold text-amber-400 uppercase block tracking-wider">⚠️ Risks & Pitfalls</span>
                <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                  Initial hardware wafer yields are highly constrained. Small startups may experience premium tier pricing bottlenecks.
                </p>
              </div>
            </div>
          </section>

          {/* SEC 7: DEVELOPER PERSPECTIVE */}
          <section id="section-developer" className="max-w-4xl mx-auto text-left space-y-6">
            <div className="flex items-center justify-between border-b border-neutral-900 pb-3">
              <h3 className="text-xs font-mono font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-2">
                <Code className="w-4 h-4 text-[#5194ec]" />
                Developer perspective & compilation guides
              </h3>
              <span className="text-[8px] font-mono text-neutral-600 bg-neutral-900 px-1.5 py-0.5 rounded">COMPILE TARGET v2.6.2</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start font-sans">
              <div className="lg:col-span-5 space-y-4 text-xs sm:text-sm text-neutral-400 leading-relaxed">
                <p>
                  Integrating these stateful corridors requires optimizing local instruction-cache registers. Developers can target the unified memory blocks directly using standard WebGPU buffer targets.
                </p>
                <div className="space-y-2">
                  <span className="text-[10px] font-mono font-bold text-white uppercase block">KEY UPGRADES</span>
                  <ul className="space-y-1.5 font-mono text-[10px] list-disc pl-4 text-neutral-500">
                    <li>Slashes model startup cold states</li>
                    <li>Unified memory buffers up to 40GB/s</li>
                    <li>Supports dynamic reinforcement tree-search fallback</li>
                  </ul>
                </div>
              </div>

              {/* Terminal Code snippet block */}
              <div className="lg:col-span-7 bg-black border border-neutral-900 rounded-xl overflow-hidden shadow-2xl">
                <div className="flex items-center justify-between px-4 py-2 bg-neutral-950 border-b border-neutral-900 text-[10px] font-mono text-neutral-500 select-none">
                  <span>aix-secure-comms.ts</span>
                  <span className="text-emerald-400">● COMPILING</span>
                </div>
                <pre className="p-4 text-[10px] font-mono text-blue-300 overflow-x-auto text-left leading-normal">
{`import { AIXSecureClient } from '@aix/comms-hub';

// Initialize zero-latency state client
const client = new AIXSecureClient({
  endpoint: 'https://api.aix.terminal',
  confidenceThreshold: 0.96,
  cacheMode: 'register-cache'
});

async function transmitBriefing() {
  const signal = await client.routeBuffer({
    target: 'edge-compilation-node-4',
    enableReinforcement: true
  });
  console.log('Telemetry feedback committed:', signal.latencyMs);
}

transmitBriefing();`}
                </pre>
              </div>
            </div>
          </section>

          {/* SEC 8: RELATED INTELLIGENCE */}
          <section id="section-related" className="max-w-4xl mx-auto text-left space-y-6">
            <h3 className="text-xs font-mono font-bold text-neutral-400 uppercase tracking-widest">
              Related intelligence networks
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Companies */}
              <div className="space-y-3 bg-neutral-950/20 border border-neutral-900 p-4 rounded-xl">
                <span className="text-[9px] font-mono font-bold text-neutral-500 uppercase tracking-wider block">Related Companies</span>
                <div className="space-y-2 font-sans text-xs">
                  {relatedCompanies.map((c, i) => (
                    <div key={i} className="flex justify-between items-center py-1.5 border-b border-neutral-900 last:border-0">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded bg-neutral-900 flex items-center justify-center font-mono text-[10px] text-[#5194ec] font-bold border border-neutral-800">{c.logo}</span>
                        <span className="text-white font-medium">{c.name}</span>
                      </div>
                      <span className="text-neutral-500 text-[10px]">{c.type}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Models */}
              <div className="space-y-3 bg-neutral-950/20 border border-neutral-900 p-4 rounded-xl">
                <span className="text-[9px] font-mono font-bold text-neutral-500 uppercase tracking-wider block">Related Models</span>
                <div className="space-y-2 font-sans text-xs">
                  {relatedModels.map((m, i) => (
                    <div key={i} className="flex justify-between items-center py-1.5 border-b border-neutral-900 last:border-0">
                      <div className="space-y-0.5">
                        <span className="text-white font-medium block">{m.name}</span>
                        <span className="text-neutral-500 text-[10px]">{m.category}</span>
                      </div>
                      <span className="text-emerald-400 font-mono text-[10px] font-bold">{m.score}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Research Papers */}
              <div className="space-y-3 bg-neutral-950/20 border border-neutral-900 p-4 rounded-xl">
                <span className="text-[9px] font-mono font-bold text-neutral-500 uppercase tracking-wider block">Related Research Papers</span>
                <div className="space-y-2 font-sans text-xs">
                  {relatedPapers.map((p, i) => (
                    <div key={i} className="py-1.5 border-b border-neutral-900 last:border-0 text-left">
                      <a href="#" className="text-white hover:text-[#5194ec] font-medium line-clamp-1 block transition-colors">{p.title}</a>
                      <span className="text-neutral-500 text-[10px] font-mono">{p.journal} • {p.date}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* SEC 10: SOURCE SECTION */}
          <section className="max-w-xl mx-auto py-8 border-y border-neutral-900 text-center space-y-4 select-none">
            <div className="inline-flex items-center gap-1.5 bg-neutral-950 border border-neutral-850 p-1 px-3 rounded-full text-[9px] font-mono text-neutral-400">
              <Globe className="w-3 h-3 text-[#5194ec]" />
              <span>OFFICIAL PUBLISHER SPECIFICATIONS DECK</span>
            </div>
            
            <div className="space-y-1 text-xs text-neutral-400 font-mono">
              <p>Publisher Node: <span className="text-white">{article.source}</span></p>
              <p>Publication Date: <span className="text-white">{article.date || "July 2026"}</span></p>
              <p>Target Route: <span className="text-neutral-500 underline break-all">{article.url}</span></p>
            </div>

            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white hover:bg-neutral-200 text-black text-xs font-bold uppercase tracking-wider transition-all cursor-pointer hover:shadow-[0_4px_20px_rgba(255,255,255,0.15)] active:scale-[0.98]"
            >
              <span>Open Original Source Article</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </section>

          {/* SEC 11: USER ACTIONS TOOLBAR */}
          <section className="max-w-4xl mx-auto text-left space-y-6">
            <h3 className="text-xs font-mono font-bold text-neutral-400 uppercase tracking-widest">
              Strategic User Actions Workspace
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs sm:text-sm font-sans select-none">
              <button 
                onClick={() => setIsWorkspaceNoteOpen(!isWorkspaceNoteOpen)}
                className="p-4 rounded-xl border border-neutral-900 bg-neutral-950/20 hover:bg-neutral-950/60 hover:border-[#5194ec]/40 transition-all text-left space-y-2 cursor-pointer"
              >
                <FileText className="w-5 h-5 text-blue-400" />
                <div>
                  <span className="font-bold text-white block">Create Note</span>
                  <span className="text-[10px] text-neutral-500 block">Commit custom strategies</span>
                </div>
              </button>

              <button 
                onClick={() => setShowFlashcards(!showFlashcards)}
                className="p-4 rounded-xl border border-neutral-900 bg-neutral-950/20 hover:bg-neutral-950/60 hover:border-[#5194ec]/40 transition-all text-left space-y-2 cursor-pointer"
              >
                <GraduationCap className="w-5 h-5 text-indigo-400" />
                <div>
                  <span className="font-bold text-white block">Flashcards</span>
                  <span className="text-[10px] text-neutral-500 block">Interactive memory checks</span>
                </div>
              </button>

              <button 
                onClick={handleExportSummary}
                className="p-4 rounded-xl border border-neutral-900 bg-neutral-950/20 hover:bg-neutral-950/60 hover:border-[#5194ec]/40 transition-all text-left space-y-2 cursor-pointer"
              >
                <FileJson className="w-5 h-5 text-emerald-400" />
                <div>
                  <span className="font-bold text-white block">Export Summary</span>
                  <span className="text-[10px] text-neutral-500 block">Copy Markdown brief</span>
                </div>
              </button>

              <button 
                onClick={handleDownloadBrief}
                className="p-4 rounded-xl border border-neutral-900 bg-neutral-950/20 hover:bg-neutral-950/60 hover:border-[#5194ec]/40 transition-all text-left space-y-2 cursor-pointer"
              >
                <Download className="w-5 h-5 text-purple-400" />
                <div>
                  <span className="font-bold text-white block">Print Report</span>
                  <span className="text-[10px] text-neutral-500 block">Print high-fidelity sheets</span>
                </div>
              </button>
            </div>

            {/* Note Panel Workspace Expandable */}
            <AnimatePresence>
              {isWorkspaceNoteOpen && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="bg-neutral-950 border border-neutral-900 rounded-xl p-5 space-y-3 mt-2">
                    <span className="text-[10px] font-mono font-bold text-neutral-500 block">SECURE CLOUD NOTEBOOK</span>
                    <textarea
                      value={localNote}
                      onChange={(e) => setLocalNote(e.target.value)}
                      placeholder="Write your investment theses, technical integrations, or research pointers..."
                      className="w-full h-24 p-3 bg-neutral-900 border border-neutral-850 rounded-lg text-xs sm:text-sm text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-[#5194ec]/30"
                    />
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => setIsWorkspaceNoteOpen(false)}
                        className="px-3 py-1.5 rounded bg-neutral-900 hover:bg-neutral-850 text-[10px] font-mono text-neutral-400 transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={handleSaveNoteLocal}
                        className="px-3 py-1.5 rounded bg-[#5194ec] text-black text-[10px] font-mono font-bold transition-all cursor-pointer shadow-lg hover:bg-blue-400"
                      >
                        Commit Note
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Flashcards Panel Workspace Expandable */}
            <AnimatePresence>
              {showFlashcards && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="bg-neutral-950 border border-neutral-900 rounded-xl p-6 space-y-4 mt-2 max-w-xl mx-auto text-center">
                    <div className="flex justify-between items-center text-[10px] font-mono text-neutral-500 border-b border-neutral-900 pb-2">
                      <span>INTERACTIVE SPECS FLASHCARDS</span>
                      <span>CARD {flashcardIndex + 1} OF {flashcards.length}</span>
                    </div>

                    {/* Interactive 3D Flip Card */}
                    <div 
                      onClick={() => setIsFlashcardFlipped(!isFlashcardFlipped)}
                      className="w-full h-40 bg-neutral-900 border border-neutral-800 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer relative hover:border-[#5194ec]/30 transition-all select-none"
                    >
                      <div className="text-center px-4 space-y-2">
                        {isFlashcardFlipped ? (
                          <>
                            <span className="text-[8px] font-mono text-emerald-400 uppercase tracking-widest block font-bold">VERIFIED PAYLOAD RESPONSE</span>
                            <p className="text-xs sm:text-sm text-neutral-300 font-sans">{flashcards[flashcardIndex].answer}</p>
                          </>
                        ) : (
                          <>
                            <span className="text-[8px] font-mono text-[#5194ec] uppercase tracking-widest block font-bold">QUERY INQUIRY</span>
                            <p className="text-xs sm:text-sm text-white font-semibold font-sans">{flashcards[flashcardIndex].question}</p>
                          </>
                        )}
                      </div>
                      <span className="absolute bottom-2 right-3 text-[8px] font-mono text-neutral-600">CLICK TO FLIP CARD</span>
                    </div>

                    <div className="flex justify-between items-center text-xs">
                      <button 
                        onClick={() => {
                          setIsFlashcardFlipped(false);
                          setFlashcardIndex(prev => Math.max(0, prev - 1));
                        }}
                        disabled={flashcardIndex === 0}
                        className="px-3 py-1.5 rounded bg-neutral-900 text-neutral-400 hover:text-white disabled:opacity-30 cursor-pointer"
                      >
                        Previous Card
                      </button>
                      <button 
                        onClick={() => {
                          setIsFlashcardFlipped(false);
                          setFlashcardIndex(prev => Math.min(flashcards.length - 1, prev + 1));
                        }}
                        disabled={flashcardIndex === flashcards.length - 1}
                        className="px-3 py-1.5 rounded bg-neutral-900 text-neutral-400 hover:text-white disabled:opacity-30 cursor-pointer"
                      >
                        Next Card
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </section>

          {/* SEC 12: DISCUSSION COMMENT BOARD */}
          <section id="section-discussion" className="max-w-4xl mx-auto text-left space-y-8 pt-6 border-t border-neutral-900">
            <div className="space-y-4">
              <span className="text-[10px] font-mono text-neutral-500 font-bold uppercase tracking-widest block">COMMUNITY SYNAPSE</span>
              
              {/* Reactions row */}
              <div className="flex flex-wrap gap-2 py-2">
                {[
                  { key: 'insightful', emoji: '💡', label: 'Insightful' },
                  { key: 'bullish', emoji: '🚀', label: 'Bullish' },
                  { key: 'important', emoji: '🔥', label: 'Important' },
                  { key: 'mindblown', emoji: '🤯', label: 'Mindblown' }
                ].map((item) => (
                  <button
                    key={item.key}
                    onClick={() => handleReactionClick(item.key as any)}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-mono transition-all flex items-center gap-2 cursor-pointer ${
                      hasReacted[item.key] 
                        ? 'bg-blue-600/10 border-[#5194ec]/50 text-[#5194ec]' 
                        : 'bg-neutral-950 border-neutral-900 text-neutral-400 hover:text-neutral-200'
                    }`}
                  >
                    <span>{item.emoji}</span>
                    <span className="font-bold">{reactions[item.key as keyof typeof reactions]}</span>
                    <span className="text-[9px] text-neutral-500">{item.label}</span>
                  </button>
                ))}
              </div>

              {/* Comment submission form */}
              <form onSubmit={handleAddComment} className="space-y-3 bg-neutral-950/20 border border-neutral-900 p-4 rounded-xl">
                <textarea
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  placeholder="Contribute professional insights or debate this development node..."
                  required
                  className="w-full h-16 p-3 bg-neutral-900 border border-neutral-850 rounded-lg text-xs sm:text-sm text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-[#5194ec]/30 font-sans"
                />
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-white text-black text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 hover:bg-neutral-200 active:scale-95 cursor-pointer"
                  >
                    <span>Post Commentary</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>

              {/* Commentary Feed List */}
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="p-4 rounded-xl border border-neutral-900 bg-neutral-950/10 flex gap-3 text-left font-sans items-start">
                    <span className="w-8 h-8 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center font-bold text-xs text-[#5194ec] flex-shrink-0">
                      {comment.avatar}
                    </span>
                    <div className="space-y-2 flex-grow">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-neutral-200">{comment.author}</span>
                        <span className="text-[10px] text-neutral-500 font-mono">{comment.time}</span>
                      </div>
                      <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-sans">{comment.text}</p>
                      
                      <div className="flex items-center gap-3 pt-1 select-none">
                        <button 
                          onClick={() => handleLikeComment(comment.id)}
                          className={`text-[10px] font-mono font-bold uppercase flex items-center gap-1.5 cursor-pointer ${
                            comment.liked ? 'text-emerald-400' : 'text-neutral-500 hover:text-neutral-300'
                          }`}
                        >
                          <ThumbsUp className="w-3 h-3" />
                          <span>{comment.likes} Likes</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

        </div>
      </div>

      {/* SEC 9: STICKY AI COPILOT PANEL (Right Column) */}
      <aside className="w-full md:w-80 border-t md:border-t-0 md:border-l border-neutral-900 bg-[#070707] flex flex-col justify-between flex-shrink-0 font-mono text-[10px] h-[350px] md:h-auto text-left select-none">
        
        {/* Header */}
        <div className="p-4 border-b border-neutral-900 flex items-center justify-between text-white select-none">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-400 animate-pulse" />
            <span className="font-bold tracking-wider">AI X COPILOT</span>
          </div>
          <span className="text-[8px] bg-[#5194ec]/10 border border-[#5194ec]/20 px-1.5 py-0.5 rounded text-[#5194ec] uppercase">SECURE SHELL</span>
        </div>

        {/* Chat Feed Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 scrollbar-none font-sans">
          {chatMessages.map((msg, i) => (
            <div 
              key={i} 
              className={`p-3 rounded-xl border text-xs text-left leading-relaxed ${
                msg.sender === 'user' 
                  ? 'bg-neutral-950 border-neutral-900 text-neutral-300 ml-6' 
                  : 'bg-neutral-900/60 border-neutral-850 text-neutral-300 mr-6'
              }`}
            >
              <div className="flex items-center gap-1.5 mb-1 text-[9px] font-mono text-neutral-500 uppercase font-bold select-none">
                <span>{msg.sender === 'user' ? 'ANALYST REQUEST' : 'AI X CONSULTANT'}</span>
                {msg.sender !== 'user' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />}
              </div>
              <p>{msg.text}</p>
            </div>
          ))}

          {chatLoading && (
            <div className="p-3 rounded-xl bg-neutral-900/60 border border-neutral-850 text-neutral-500 text-xs mr-6 flex items-center gap-2">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-[#5194ec]" />
              <span className="font-mono text-[9px] uppercase font-bold">Consulting Vector Clusters...</span>
            </div>
          )}
        </div>

        {/* Quick query presets */}
        <div className="p-3 border-t border-neutral-900 bg-neutral-950/20 space-y-1.5 select-none">
          <span className="text-[8px] font-bold text-neutral-500 uppercase tracking-widest block mb-1">FAST MATRIX QUERIES</span>
          <div className="grid grid-cols-2 gap-1.5 text-[9px] font-mono">
            {[
              { label: "Explain this", prompt: "Can you explain the technical mechanisms behind this in simpler terms?" },
              { label: "Summarize", prompt: "Synthesize a structured executive summary of this report." },
              { label: "Compare", prompt: "How does this compare to previously established model metrics?" },
              { label: "Predict Impact", prompt: "What are your speculative predictive forecasts for this next quarter?" }
            ].map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => handleSendCopilotMessage(preset.prompt)}
                className="p-1 px-2 text-left rounded bg-neutral-900 hover:bg-neutral-850 hover:text-white text-neutral-400 border border-neutral-850 font-bold transition-all truncate cursor-pointer"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Input box */}
        <div className="p-3 border-t border-neutral-900 bg-neutral-950 select-none">
          <div className="flex gap-2 items-center bg-neutral-900 rounded-lg px-2 py-1.5 border border-neutral-800">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask Copilot regarding this..."
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSendCopilotMessage();
                }
              }}
              className="bg-transparent text-xs text-neutral-200 placeholder-neutral-600 focus:outline-none flex-grow font-sans"
            />
            <button
              onClick={() => handleSendCopilotMessage()}
              className="p-1 rounded hover:bg-neutral-800 text-[#5194ec] cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>

      </aside>

    </div>
  );
}
