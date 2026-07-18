import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, Award, Zap, DollarSign, Activity, ChevronUp, ChevronDown, Check, X,
  ExternalLink, ArrowLeft, Cpu, Globe, Sparkles, TrendingUp, Sliders, Lock, Unlock,
  HelpCircle, RefreshCw, Layers, Shield, Volume2, Video, Eye, AlignLeft, Bookmark,
  BookmarkCheck, Pin, Info, Star, Filter, SlidersHorizontal, BookOpen, AlertCircle,
  TrendingDown, Download, Share2, Clipboard, Plus, Trash2, Key, HelpCircle as HelpIcon, Play
} from 'lucide-react';
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, 
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, 
  AreaChart, Area 
} from 'recharts';
import { MODELS_INTEL, ModelProfile, ModelBenchmarks } from '../data/models';

interface BenchmarkDashboardPageProps {
  onBack: () => void;
  onOpenModel?: (slug: string) => void;
  onOpenCompany?: (slug: string) => void;
  onOpenResearch?: (slug: string) => void;
}

// Predefined historical benchmark timeline for top frontier architectures
const HISTORICAL_TRENDS_DATA = [
  { quarter: '2025 Q1', 'GPT-5 (Sovereign)': 91, 'Claude 4 (Opus)': 89, 'DeepSeek-R1': 84, 'Gemini 2.5 Pro': 88, 'Llama 4': 80 },
  { quarter: '2025 Q2', 'GPT-5 (Sovereign)': 93, 'Claude 4 (Opus)': 91, 'DeepSeek-R1': 87, 'Gemini 2.5 Pro': 90, 'Llama 4': 83 },
  { quarter: '2025 Q3', 'GPT-5 (Sovereign)': 95, 'Claude 4 (Opus)': 93, 'DeepSeek-R1': 91, 'Gemini 2.5 Pro': 91, 'Llama 4': 86 },
  { quarter: '2025 Q4', 'GPT-5 (Sovereign)': 96, 'Claude 4 (Opus)': 95, 'DeepSeek-R1': 93, 'Gemini 2.5 Pro': 93, 'Llama 4': 88 },
  { quarter: '2026 Q1', 'GPT-5 (Sovereign)': 97, 'Claude 4 (Opus)': 97, 'DeepSeek-R1': 95, 'Gemini 2.5 Pro': 94, 'Llama 4': 90 },
  { quarter: '2026 Q2', 'GPT-5 (Sovereign)': 98, 'Claude 4 (Opus)': 98, 'DeepSeek-R1': 96, 'Gemini 2.5 Pro': 95, 'Llama 4': 91 },
  { quarter: '2026 Q3', 'GPT-5 (Sovereign)': 98.2, 'Claude 4 (Opus)': 99, 'DeepSeek-R1': 96.5, 'Gemini 2.5 Pro': 96.2, 'Llama 4': 92.5 },
];

export default function BenchmarkDashboardPage({ 
  onBack, 
  onOpenModel, 
  onOpenCompany, 
  onOpenResearch 
}: BenchmarkDashboardPageProps) {
  
  // Real Data Fetching Simulators & Caching
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>('Updated just now');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // States
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortField, setSortField] = useState<string>('overall');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [isCompareMode, setIsCompareMode] = useState(false);
  const [compareModeType, setCompareModeType] = useState<'side-by-side' | 'table' | 'cards' | 'radar' | 'bar'>('side-by-side');
  
  // Timeframes for historical plot
  const [timeframe, setTimeframe] = useState<'6M' | '1Y' | 'ALL'>('ALL');

  // Selected models for Radar / Bar Chart / Matrix comparison
  const [compareModelIds, setCompareModelIds] = useState<string[]>(['gpt-5', 'claude-4', 'deepseek-r1']);

  // Pin leaderboard rows
  const [pinnedModelIds, setPinnedModelIds] = useState<string[]>([]);

  // Search History
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    const saved = localStorage.getItem('benchmark_recent_searches');
    return saved ? JSON.parse(saved) : ['GPT-5', 'DeepSeek', 'Reasoning', 'Claude 4'];
  });

  // Local storage bookmarks
  const [bookmarks, setBookmarks] = useState<string[]>(() => {
    const saved = localStorage.getItem('benchmark_bookmarks');
    return saved ? JSON.parse(saved) : [];
  });

  // Saved Comparisons (Workspace feature)
  const [savedComparisons, setSavedComparisons] = useState<{ id: string; name: string; modelIds: string[] }[]>(() => {
    const saved = localStorage.getItem('benchmark_saved_comparisons');
    return saved ? JSON.parse(saved) : [];
  });
  const [newComparisonName, setNewComparisonName] = useState('');
  const [showSaveDialog, setShowSaveDialog] = useState(false);

  // Insights drawer trigger
  const [selectedModelForInsights, setSelectedModelForInsights] = useState<ModelProfile | null>(null);

  // Keyboard shortcut assistant
  const [showShortcutsHelp, setShowShortcutsHelp] = useState(false);

  // Audio chime feedback toggle
  const [soundEnabled, setSoundEnabled] = useState(false);

  // Search Input Reference for Focus
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Advanced Sidebar filters
  const [minOverallScore, setMinOverallScore] = useState<number>(0);
  const [selectedCompanyFilter, setSelectedCompanyFilter] = useState<string>('All');
  const [licenseTypeFilter, setLicenseTypeFilter] = useState<'All' | 'Open' | 'Proprietary'>('All');
  const [contextWindowFilter, setContextWindowFilter] = useState<string>('All');
  const [latencyFilter, setLatencyFilter] = useState<string>('All');
  const [priceFilter, setPriceFilter] = useState<string>('All');

  // Alert/Toast notifications state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Play audio chime if enabled
  const playChime = (frequency = 440, duration = 0.08, type: OscillatorType = 'sine') => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      osc.type = type;
      osc.frequency.value = frequency;
      gainNode.gain.setValueAtTime(0.04, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      // Ignored
    }
  };

  // Auto refreshing simulation & live status updates
  useEffect(() => {
    const updateTimeLabels = [
      'Updated just now',
      'Updated 1 min ago',
      'Updated 5 min ago',
      'Updated 15 min ago',
      'Updated 2 hours ago'
    ];
    let i = 0;
    const interval = setInterval(() => {
      i = (i + 1) % updateTimeLabels.length;
      setLastUpdated(updateTimeLabels[i]);
    }, 45000);

    return () => clearInterval(interval);
  }, []);

  // Sync / reload handler
  const handleReloadData = () => {
    playChime(660, 0.12, 'triangle');
    setIsLoading(true);
    triggerToast('Initiating sync with Stargate consensus nodes...');
    setTimeout(() => {
      setIsLoading(false);
      setLastUpdated('Updated just now');
      triggerToast('All benchmark metrics verified and re-cached successfully.');
      playChime(880, 0.15, 'sine');
    }, 1000);
  };

  // Keyboard Shortcuts hook
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Avoid triggering when user typing in input fields
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'SELECT' || document.activeElement?.tagName === 'TEXTAREA') {
        if (e.key === 'Escape') {
          searchInputRef.current?.blur();
        }
        return;
      }

      if (e.key === '/' || e.key === 's') {
        e.preventDefault();
        searchInputRef.current?.focus();
        triggerToast('Search focused (Shortcut)');
        playChime(520, 0.05);
      } else if (e.key === 'c') {
        e.preventDefault();
        setSelectedCategory('All');
        setMinOverallScore(0);
        setSelectedCompanyFilter('All');
        setLicenseTypeFilter('All');
        setContextWindowFilter('All');
        setLatencyFilter('All');
        setPriceFilter('All');
        setSearchQuery('');
        triggerToast('Filters and search parameters cleared');
        playChime(330, 0.08);
      } else if (e.key === 'h') {
        e.preventDefault();
        setIsCompareMode(prev => !prev);
        triggerToast(isCompareMode ? 'Exited comparison view' : 'Overlay comparison layout active');
        playChime(440, 0.08);
      } else if (e.key === 'r') {
        e.preventDefault();
        handleReloadData();
      } else if (e.key === 'Escape') {
        setSelectedModelForInsights(null);
        setShowShortcutsHelp(false);
        setShowSaveDialog(false);
        setShowSearchDropdown(false);
      } else if (e.key === '?') {
        e.preventDefault();
        setShowShortcutsHelp(prev => !prev);
        playChime(580, 0.1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCompareMode]);

  // Persist bookmarks
  const toggleBookmark = (id: string, name: string) => {
    setBookmarks(prev => {
      const updated = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      localStorage.setItem('benchmark_bookmarks', JSON.stringify(updated));
      triggerToast(prev.includes(id) ? `Removed ${name} from Bookmarks` : `Bookmarked ${name} to Intel Folder`);
      playChime(updated.includes(id) ? 750 : 400, 0.08);
      return updated;
    });
  };

  // Toggle Pinned status
  const togglePin = (id: string, name: string) => {
    setPinnedModelIds(prev => {
      const updated = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      triggerToast(prev.includes(id) ? `Unpinned ${name}` : `Pinned ${name} permanently to top`);
      playChime(updated.includes(id) ? 680 : 380, 0.07);
      return updated;
    });
  };

  // Convert models list
  const models = useMemo(() => {
    return Object.values(MODELS_INTEL);
  }, []);

  // Company Name helper to company slug mapper
  const getCompanySlug = (companyName: string) => {
    const name = companyName.toLowerCase();
    if (name.includes('openai')) return 'openai';
    if (name.includes('anthropic')) return 'anthropic';
    if (name.includes('google')) return 'google';
    if (name.includes('meta')) return 'meta';
    if (name.includes('deepseek')) return 'deepseek';
    if (name.includes('mistral')) return 'mistral-ai';
    if (name.includes('cohere')) return 'cohere';
    if (name.includes('xai')) return 'xai';
    return name.replace(/\s+/g, '-');
  };

  // Dynamic Overall score compiler (averaging active metrics weights)
  const getOverallScore = (model: ModelProfile) => {
    const b = model.benchmarks;
    return Math.round(((b.reasoning + b.coding + b.math + b.vision + b.agentTasks) / 5) * 10) / 10;
  };

  // Unique companies list
  const companiesList = useMemo(() => {
    const list = new Set(models.map(m => m.company));
    return ['All', ...Array.from(list)];
  }, [models]);

  // Compute live high-fidelity statistics across the model universe
  const stats = useMemo(() => {
    if (models.length === 0) return null;

    let highestOverall = models[0];
    let highestCoding = models[0];
    let highestReasoning = models[0];
    let fastestModel = models[0];
    let lowestCost = models[0];

    models.forEach(m => {
      if (getOverallScore(m) > getOverallScore(highestOverall)) highestOverall = m;
      if (m.benchmarks.coding > highestCoding.benchmarks.coding) highestCoding = m;
      if (m.benchmarks.reasoning > highestReasoning.benchmarks.reasoning) highestReasoning = m;
      if (m.benchmarks.latency > fastestModel.benchmarks.latency) fastestModel = m;
      if (m.benchmarks.cost > lowestCost.benchmarks.cost) lowestCost = m;
    });

    return {
      totalModels: models.length,
      highestOverallName: highestOverall.name,
      highestOverallScore: getOverallScore(highestOverall),
      highestCodingModel: highestCoding.name,
      highestCodingScore: highestCoding.benchmarks.coding,
      highestReasoningModel: highestReasoning.name,
      highestReasoningScore: highestReasoning.benchmarks.reasoning,
      fastestModel: fastestModel.name,
      fastestLatency: fastestModel.benchmarks.latency,
      lowestCostModel: lowestCost.name,
      lowestCostPrice: lowestCost.specifications.pricingInput.split(' ')[0] || 'Free'
    };
  }, [models]);

  const [activeChartMetric, setActiveChartMetric] = useState<string>('overall');

  const metricLabel = (key: string) => {
    switch (key) {
      case 'overall': return 'Overall Score';
      case 'reasoning': return 'Reasoning Index';
      case 'coding': return 'Coding Capability';
      case 'math': return 'Mathematics Eval';
      case 'vision': return 'Vision & Multimodal';
      case 'agentTasks': return 'Agentic Reasoning';
      case 'longContext': return 'Long Context Retention';
      case 'science': return 'Science Benchmark';
      case 'latency': return 'Inference Speed';
      case 'cost': return 'Cost Efficiency';
      default: return 'Score';
    }
  };

  // Execute Search query & Filter configuration
  const filteredModels = useMemo(() => {
    let result = [...models];

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(m => 
        m.name.toLowerCase().includes(q) || 
        m.company.toLowerCase().includes(q) ||
        m.category.toLowerCase().includes(q) ||
        m.summary.purpose.toLowerCase().includes(q)
      );
    }

    // Category navigation filters
    if (selectedCategory !== 'All') {
      if (selectedCategory === 'Open Source') {
        result = result.filter(m => m.isOpenSource);
      } else if (selectedCategory === 'Cost') {
        result = result.filter(m => m.benchmarks.cost >= 85);
      } else if (selectedCategory === 'Audio') {
        result = result.filter(m => m.specifications.modalities.some(x => x.toLowerCase().includes('audio')));
      } else if (selectedCategory === 'Video') {
        result = result.filter(m => m.specifications.modalities.some(x => x.toLowerCase().includes('video')));
      } else if (selectedCategory === 'Vision') {
        result = result.filter(m => m.specifications.modalities.some(x => x.toLowerCase().includes('image') || x.toLowerCase().includes('vision')));
      } else if (selectedCategory === 'Agents') {
        result = result.filter(m => m.benchmarks.agentTasks >= 85);
      } else if (selectedCategory === 'Reasoning') {
        result = result.filter(m => m.benchmarks.reasoning >= 85);
      } else if (selectedCategory === 'Coding') {
        result = result.filter(m => m.benchmarks.coding >= 85);
      } else if (selectedCategory === 'Math') {
        result = result.filter(m => m.benchmarks.math >= 85);
      }
    }

    // Advanced side-panel dropdown queries
    if (minOverallScore > 0) {
      result = result.filter(m => getOverallScore(m) >= minOverallScore);
    }
    if (selectedCompanyFilter !== 'All') {
      result = result.filter(m => m.company === selectedCompanyFilter);
    }
    if (licenseTypeFilter === 'Open') {
      result = result.filter(m => m.isOpenSource);
    } else if (licenseTypeFilter === 'Proprietary') {
      result = result.filter(m => !m.isOpenSource);
    }

    // Context Window filters
    if (contextWindowFilter !== 'All') {
      if (contextWindowFilter === '1M+') {
        result = result.filter(m => m.specifications.contextWindow.replace(/,/g, '').includes('1000000') || m.specifications.contextWindow.includes('1,000,000') || m.specifications.contextWindow.includes('2,000,000'));
      } else if (contextWindowFilter === '128K-500K') {
        result = result.filter(m => m.specifications.contextWindow.includes('128') || m.specifications.contextWindow.includes('200') || m.specifications.contextWindow.includes('32K'));
      }
    }

    // Latency filter (higher index = faster)
    if (latencyFilter !== 'All') {
      if (latencyFilter === 'Ultra Fast') result = result.filter(m => m.benchmarks.latency >= 80);
      if (latencyFilter === 'Standard') result = result.filter(m => m.benchmarks.latency < 80);
    }

    // Cost filter (higher index = cheaper)
    if (priceFilter !== 'All') {
      if (priceFilter === 'Budget') result = result.filter(m => m.benchmarks.cost >= 80);
      if (priceFilter === 'Premium') result = result.filter(m => m.benchmarks.cost < 80);
    }

    return result;
  }, [models, searchQuery, selectedCategory, minOverallScore, selectedCompanyFilter, licenseTypeFilter, contextWindowFilter, latencyFilter, priceFilter]);

  // Leaders sorting pipeline
  const sortedModels = useMemo(() => {
    let result = [...filteredModels];

    result.sort((a, b) => {
      let valA: number = 0;
      let valB: number = 0;

      if (sortField === 'overall') {
        valA = getOverallScore(a);
        valB = getOverallScore(b);
      } else if (sortField === 'name') {
        return sortDirection === 'desc' 
          ? b.name.localeCompare(a.name) 
          : a.name.localeCompare(b.name);
      } else if (sortField === 'company') {
        return sortDirection === 'desc' 
          ? b.company.localeCompare(a.company) 
          : a.company.localeCompare(b.company);
      } else if (sortField === 'price') {
        valA = a.benchmarks.cost;
        valB = b.benchmarks.cost;
      } else {
        const field = sortField as keyof typeof a.benchmarks;
        valA = a.benchmarks[field] || 0;
        valB = b.benchmarks[field] || 0;
      }

      return sortDirection === 'desc' ? valB - valA : valA - valB;
    });

    // Separation of pinned models on top
    const pinned = result.filter(m => pinnedModelIds.includes(m.id));
    const unpinned = result.filter(m => !pinnedModelIds.includes(m.id));

    return [...pinned, ...unpinned];
  }, [filteredModels, sortField, sortDirection, pinnedModelIds]);

  const handleSort = (field: string) => {
    playChime(500, 0.05);
    if (sortField === field) {
      setSortDirection(prev => prev === 'desc' ? 'asc' : 'desc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  // Toggle comparative model inclusion
  const handleToggleCompare = (id: string) => {
    setCompareModelIds(prev => {
      if (prev.includes(id)) {
        if (prev.length <= 2) {
          triggerToast('Keep at least 2 architectures to preserve comparative resolution');
          return prev;
        }
        playChime(350, 0.06);
        return prev.filter(x => x !== id);
      }
      if (prev.length >= 4) {
        // Shift slot 1 out, insert new on tail
        playChime(700, 0.06);
        return [...prev.slice(1), id];
      }
      playChime(620, 0.08);
      return [...prev, id];
    });
  };

  // Autocomplete Suggestions while searching
  const autocompleteSuggestions = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return models.filter(m => 
      m.name.toLowerCase().includes(q) || 
      m.company.toLowerCase().includes(q)
    ).slice(0, 4);
  }, [searchQuery, models]);

  // Execute text selection from suggestions
  const handleSelectSuggestion = (text: string) => {
    setSearchQuery(text);
    setShowSearchDropdown(false);
    // Add to history
    setRecentSearches(prev => {
      const filtered = prev.filter(x => x !== text);
      const updated = [text, ...filtered].slice(0, 5);
      localStorage.setItem('benchmark_recent_searches', JSON.stringify(updated));
      return updated;
    });
    playChime(640, 0.08);
  };

  // Saved Comparisons (Workspace integration)
  const handleSaveComparison = () => {
    if (!newComparisonName.trim()) {
      triggerToast('Provide a name for this comparison setup');
      return;
    }
    const newComp = {
      id: Math.random().toString(36).substr(2, 9),
      name: newComparisonName.trim(),
      modelIds: [...compareModelIds]
    };
    const updated = [newComp, ...savedComparisons];
    setSavedComparisons(updated);
    localStorage.setItem('benchmark_saved_comparisons', JSON.stringify(updated));
    setNewComparisonName('');
    setShowSaveDialog(false);
    triggerToast(`"${newComp.name}" comparison saved to AI X Workspace`);
    playChime(900, 0.15, 'sine');
  };

  const handleDeleteSavedComparison = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = savedComparisons.filter(x => x.id !== id);
    setSavedComparisons(updated);
    localStorage.setItem('benchmark_saved_comparisons', JSON.stringify(updated));
    triggerToast('Saved comparison setup removed');
    playChime(300, 0.08);
  };

  const handleLoadSavedComparison = (ids: string[], name: string) => {
    setCompareModelIds(ids);
    setIsCompareMode(true);
    triggerToast(`Loaded comparison setup: ${name}`);
    playChime(750, 0.12);
  };

  // Export comparison as JSON / Specs
  const handleExportComparison = () => {
    const listToExport = compareModelIds.map(id => MODELS_INTEL[id]).filter(Boolean);
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(listToExport, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `aix_comparison_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    triggerToast('JSON specification parameters exported successfully');
    playChime(850, 0.12);
  };

  // Share comparison (Copy mock query link)
  const handleShareComparison = () => {
    const mockLink = `${window.location.origin}/benchmarks?compare=${compareModelIds.join(',')}`;
    navigator.clipboard.writeText(mockLink).then(() => {
      triggerToast('Shareable comparison link copied to clipboard');
      playChime(800, 0.1);
    });
  };

  // Spotlight Models (Trending/Top-rated)
  const spotlightModels = useMemo(() => {
    return [...models]
      .sort((a, b) => getOverallScore(b) - getOverallScore(a))
      .slice(0, 3);
  }, [models]);

  // Capability bar plots
  const barChartData = useMemo(() => {
    return sortedModels.slice(0, 8).map(model => ({
      name: model.name,
      score: activeChartMetric === 'overall' ? getOverallScore(model) : (model.benchmarks[activeChartMetric as keyof typeof model.benchmarks] || 0),
      company: model.company,
      color: model.color || '#5194ec'
    }));
  }, [sortedModels, activeChartMetric]);

  // Radar multi-overlay specs
  const radarChartData = useMemo(() => {
    const categories = [
      { key: 'coding', label: 'Coding' },
      { key: 'reasoning', label: 'Reasoning' },
      { key: 'math', label: 'Math' },
      { key: 'vision', label: 'Vision' },
      { key: 'longContext', label: 'Context' },
      { key: 'latency', label: 'Speed' },
      { key: 'science', label: 'Safety' },
      { key: 'cost', label: 'Cost Efficiency' }
    ];

    return categories.map(cat => {
      const dataPoint: any = { subject: cat.label };
      compareModelIds.forEach(id => {
        const model = MODELS_INTEL[id];
        if (model) {
          if (cat.key === 'science') {
            dataPoint[model.name] = Math.round(model.benchmarks.reasoning * 0.95 + 4);
          } else {
            dataPoint[model.name] = model.benchmarks[cat.key as keyof typeof model.benchmarks] || 0;
          }
        }
      });
      return dataPoint;
    });
  }, [compareModelIds]);

  const historicalPlotData = useMemo(() => {
    if (timeframe === '6M') return HISTORICAL_TRENDS_DATA.slice(-3);
    if (timeframe === '1Y') return HISTORICAL_TRENDS_DATA.slice(-5);
    return HISTORICAL_TRENDS_DATA;
  }, [timeframe]);

  // Model comparison profiles
  const comparedModels = useMemo(() => {
    return compareModelIds.map(id => MODELS_INTEL[id]).filter(Boolean);
  }, [compareModelIds]);

  // Find category winning indexes for comparisons
  const categoryWinners = useMemo(() => {
    const winners: Record<string, string> = {};
    if (comparedModels.length === 0) return winners;

    const findMax = (getter: (m: ModelProfile) => number) => {
      let winningModel = comparedModels[0];
      comparedModels.forEach(m => {
        if (getter(m) > getter(winningModel)) {
          winningModel = m;
        }
      });
      return winningModel.id;
    };

    winners.reasoning = findMax(m => m.benchmarks.reasoning);
    winners.coding = findMax(m => m.benchmarks.coding);
    winners.math = findMax(m => m.benchmarks.math);
    winners.vision = findMax(m => m.benchmarks.vision);
    winners.context = findMax(m => parseInt(m.specifications.contextWindow.replace(/,/g, '')) || 0);
    winners.latency = findMax(m => m.benchmarks.latency);
    winners.cost = findMax(m => m.benchmarks.cost);
    winners.agent = findMax(m => m.benchmarks.agentTasks);
    winners.safety = findMax(m => m.benchmarks.science);

    return winners;
  }, [comparedModels]);

  // AI Recommendation engine from compared models
  const aiRecommendations = useMemo(() => {
    if (comparedModels.length === 0) return null;

    const bestOverall = [...comparedModels].sort((a, b) => getOverallScore(b) - getOverallScore(a))[0];
    const bestCoding = [...comparedModels].sort((a, b) => b.benchmarks.coding - a.benchmarks.coding)[0];
    const bestOpenSource = comparedModels.find(m => m.isOpenSource) || null;
    const bestBudget = [...comparedModels].sort((a, b) => b.benchmarks.cost - a.benchmarks.cost)[0];
    const bestReasoning = [...comparedModels].sort((a, b) => b.benchmarks.reasoning - a.benchmarks.reasoning)[0];
    const bestCreative = [...comparedModels].sort((a, b) => b.benchmarks.vision - a.benchmarks.vision)[0];

    return {
      overall: bestOverall,
      coding: bestCoding,
      openSource: bestOpenSource,
      budget: bestBudget,
      reasoning: bestReasoning,
      creative: bestCreative
    };
  }, [comparedModels]);

  return (
    <div className="w-full h-full bg-[#020202] text-white flex flex-col relative overflow-y-auto scrollbar-none font-sans select-none pb-12">
      
      {/* Background Ambient Glows */}
      <div className="absolute top-0 left-0 right-0 h-[600px] bg-gradient-to-b from-[#111622] to-transparent pointer-events-none" />
      <div className="absolute top-[35%] left-[-15%] w-[500px] h-[500px] bg-[#5194ec]/3 rounded-full blur-[180px] pointer-events-none" />
      <div className="absolute top-[60%] right-[-15%] w-[550px] h-[550px] bg-indigo-500/3 rounded-full blur-[200px] pointer-events-none" />

      {/* Toast feedback component */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-18 right-6 z-50 bg-[#09090b] border border-neutral-800 text-xs text-neutral-200 px-4 py-3 rounded-xl flex items-center gap-2.5 shadow-2xl shadow-black/80 max-w-sm"
          >
            <Info className="w-4 h-4 text-[#5194ec] shrink-0" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sticky Top Header */}
      <div className="w-full bg-[#050505]/95 backdrop-blur-md border-b border-neutral-900/90 sticky top-0 z-40 px-6 py-3.5 flex items-center justify-between">
        <button 
          onClick={onBack}
          className="flex items-center gap-2.5 text-[10px] font-mono tracking-widest text-neutral-400 hover:text-white transition-colors uppercase cursor-pointer active:scale-95"
        >
          <ArrowLeft className="w-4 h-4 text-[#5194ec]" />
          Back to Intel Desk
        </button>

        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              setSoundEnabled(prev => !prev);
              triggerToast(soundEnabled ? 'Interface audio muted' : 'Subtle acoustic micro-feedback enabled');
              setTimeout(() => playChime(600, 0.1), 100);
            }}
            className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${soundEnabled ? 'border-[#5194ec]/40 bg-[#5194ec]/10 text-[#5194ec]' : 'border-neutral-900 text-neutral-500 hover:text-neutral-400'}`}
            title="Toggle interaction audio alerts"
          >
            <Volume2 className="w-3.5 h-3.5" />
          </button>
          
          <button
            onClick={() => setShowShortcutsHelp(true)}
            className="p-1.5 rounded-lg border border-neutral-900 text-neutral-500 hover:text-neutral-400 transition-colors cursor-pointer text-xs font-mono"
            title="Keyboard Shortcuts [?]"
          >
            [?] Shortcuts
          </button>

          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-mono tracking-wider text-neutral-400 uppercase flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-[#5194ec]" /> Consensus Engine Active
          </span>
        </div>
      </div>

      <div className="max-w-7xl w-full mx-auto px-6 py-8 md:py-12 space-y-10 relative z-10 flex flex-col">
        
        {/* HERO TITLE & LIVE SYNC STATUS */}
        <section className="space-y-6 text-left">
          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#5194ec]/10 border border-[#5194ec]/15 text-[10px] font-mono tracking-widest text-[#5194ec] uppercase shadow-inner">
              <Award className="w-3.5 h-3.5 animate-pulse" />
              <span>Sprint 7 Multi-Modal Evaluation Benchmark</span>
            </div>
            
            <div className="flex items-center gap-1.5 bg-[#0b0b0d] border border-neutral-900 rounded-lg px-2.5 py-1 text-[9px] font-mono text-neutral-400">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
              <span>Version: 2026.3.17</span>
            </div>

            <div className="flex items-center gap-1.5 bg-[#0b0b0d] border border-neutral-900 rounded-lg px-2.5 py-1 text-[9px] font-mono text-neutral-400">
              <span className="w-1.5 h-1.5 rounded-full bg-[#5194ec]" />
              <span>Source: AI X Consensus Matrix</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-8 space-y-3">
              <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-white leading-none">
                AI Model Benchmarks
              </h1>
              <p className="text-neutral-400 text-xs sm:text-sm max-w-2xl leading-relaxed">
                Analyze and compare the capabilities of state-of-the-art foundation models. Drill down into reasoning hierarchies, coding indexes, speed metrics, and cost projections.
              </p>
            </div>
            
            {/* Live Status Control Panel */}
            <div className="lg:col-span-4 bg-[#060608] border border-neutral-900 rounded-2xl p-4.5 space-y-3 shadow-xl backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">Inference Node Status</span>
                <span className="text-[8px] font-bold font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                  STABLE SYNC
                </span>
              </div>
              <div className="border-t border-neutral-900/60 pt-2.5 flex items-center justify-between">
                <div className="space-y-0.5 text-left">
                  <span className="text-[9px] text-neutral-500 uppercase font-mono block">Data Integrity</span>
                  <span className="text-xs text-white font-mono flex items-center gap-1.5">
                    <RefreshCw className={`w-3 h-3 text-[#5194ec] ${isLoading ? 'animate-spin' : ''}`} />
                    {lastUpdated}
                  </span>
                </div>
                <button
                  onClick={handleReloadData}
                  disabled={isLoading}
                  className="px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-[10px] font-mono uppercase font-bold text-neutral-300 hover:text-white border border-neutral-800 flex items-center gap-1 cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className="w-3 h-3" />
                  Sync Metrics
                </button>
              </div>
            </div>
          </div>

          {/* Smart Search with Autocomplete & Recent Searches */}
          <div className="pt-2 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
            <div className="relative group flex-1 max-w-xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 group-focus-within:text-[#5194ec] transition-colors" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search models, developers, or capabilities (Press '/' to focus)..."
                value={searchQuery}
                onFocus={() => {
                  setShowSearchDropdown(true);
                  playChime(500, 0.04);
                }}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#070709] border border-neutral-900 focus:border-[#5194ec]/40 focus:outline-none text-xs text-white placeholder-neutral-500 pl-11 pr-10 py-3.5 rounded-xl transition-all font-sans"
              />
              {searchQuery && (
                <button 
                  onClick={() => {
                    setSearchQuery('');
                    playChime(350, 0.05);
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-neutral-500 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}

              {/* Autocomplete & History Dropdown Overlay */}
              {showSearchDropdown && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowSearchDropdown(false)} />
                  <div className="absolute top-full left-0 right-0 mt-2 bg-[#09090b] border border-neutral-800 rounded-xl shadow-2xl p-4 text-left space-y-3.5 z-20">
                    {/* Autocomplete suggestions */}
                    {autocompleteSuggestions.length > 0 && (
                      <div className="space-y-1.5">
                        <span className="text-[8px] font-mono font-bold text-neutral-500 uppercase tracking-widest block">Matching Models</span>
                        <div className="grid grid-cols-1 gap-1">
                          {autocompleteSuggestions.map(s => (
                            <button
                              key={s.id}
                              onClick={() => handleSelectSuggestion(s.name)}
                              className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-neutral-900/40 hover:bg-[#5194ec]/10 text-xs text-left text-neutral-200 transition-colors"
                            >
                              <span className="font-semibold">{s.name}</span>
                              <span className="text-[10px] text-neutral-500">{s.company}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Popular Badges */}
                    <div className="space-y-1.5">
                      <span className="text-[8px] font-mono font-bold text-neutral-500 uppercase tracking-widest block">Popular Searches</span>
                      <div className="flex flex-wrap gap-1.5">
                        {['GPT-5', 'Claude 4', 'DeepSeek-R1', 'Reasoning', 'Open Source', 'Math'].map(tag => (
                          <button
                            key={tag}
                            onClick={() => handleSelectSuggestion(tag)}
                            className="px-2.5 py-1 rounded bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-[10px] text-neutral-400 hover:text-white transition-colors cursor-pointer"
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Recent Searches */}
                    {recentSearches.length > 0 && (
                      <div className="space-y-1.5">
                        <span className="text-[8px] font-mono font-bold text-neutral-500 uppercase tracking-widest block">Recent Searches</span>
                        <div className="flex flex-wrap gap-1.5">
                          {recentSearches.map(term => (
                            <button
                              key={term}
                              onClick={() => handleSelectSuggestion(term)}
                              className="px-2.5 py-1 rounded bg-neutral-950 hover:bg-neutral-900 text-[10px] text-neutral-500 hover:text-neutral-300 transition-colors border border-neutral-900/60 cursor-pointer flex items-center gap-1.5"
                            >
                              <span>{term}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Quick stats counter */}
            <div className="flex items-center gap-2 lg:shrink-0 justify-end">
              <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest">Active Filters Universe:</span>
              <span className="text-xs font-bold font-mono text-[#5194ec] bg-[#5194ec]/10 border border-[#5194ec]/20 px-2.5 py-1 rounded-lg">
                {isLoading ? '...' : `${sortedModels.length} of ${models.length}`}
              </span>
            </div>
          </div>
        </section>

        {/* LOADING STATE SKELETONS */}
        {isLoading ? (
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-[#050507] border border-neutral-900 rounded-2xl p-6 space-y-4 animate-pulse">
                <div className="h-4 bg-neutral-800 rounded w-1/3" />
                <div className="h-10 bg-neutral-800 rounded w-1/2" />
                <div className="h-4 bg-neutral-800 rounded w-3/4" />
              </div>
            ))}
          </section>
        ) : (
          /* CORE STATS SUMMARY PANEL */
          <section id="quick-stats-summary" className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
            <div className="bg-[#050507] border border-neutral-900 rounded-xl p-4 text-left flex flex-col justify-between hover:border-neutral-800 transition-all duration-300">
              <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest block">Total Directory</span>
              <div className="space-y-0.5 mt-2">
                <span className="text-2xl font-display font-semibold text-white block">{stats?.totalModels}</span>
                <span className="text-[9px] text-neutral-500 block truncate font-mono">Active architectures</span>
              </div>
            </div>

            <div className="bg-[#050507] border border-neutral-900 rounded-xl p-4 text-left flex flex-col justify-between hover:border-neutral-800 transition-all duration-300">
              <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest block">Consensus Winner</span>
              <div className="space-y-0.5 mt-2" title={stats?.highestOverallName}>
                <span className="text-2xl font-display font-semibold text-[#5194ec] block">{stats?.highestOverallScore}%</span>
                <span className="text-[9px] text-neutral-400 block truncate font-sans">{stats?.highestOverallName}</span>
              </div>
            </div>

            <div className="bg-[#050507] border border-neutral-900 rounded-xl p-4 text-left flex flex-col justify-between hover:border-neutral-800 transition-all duration-300">
              <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest block">Coding Peak</span>
              <div className="space-y-0.5 mt-2" title={stats?.highestCodingModel}>
                <span className="text-2xl font-display font-semibold text-emerald-400 block">{stats?.highestCodingScore}%</span>
                <span className="text-[9px] text-neutral-400 block truncate font-sans">{stats?.highestCodingModel}</span>
              </div>
            </div>

            <div className="bg-[#050507] border border-neutral-900 rounded-xl p-4 text-left flex flex-col justify-between hover:border-neutral-800 transition-all duration-300">
              <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest block">Reasoning Core</span>
              <div className="space-y-0.5 mt-2" title={stats?.highestReasoningModel}>
                <span className="text-2xl font-display font-semibold text-indigo-400 block">{stats?.highestReasoningScore}%</span>
                <span className="text-[9px] text-neutral-400 block truncate font-sans">{stats?.highestReasoningModel}</span>
              </div>
            </div>

            <div className="bg-[#050507] border border-neutral-900 rounded-xl p-4 text-left flex flex-col justify-between hover:border-neutral-800 transition-all duration-300">
              <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest block">Inference Speed</span>
              <div className="space-y-0.5 mt-2" title={stats?.fastestModel}>
                <span className="text-2xl font-display font-semibold text-amber-500 block">{stats?.fastestLatency}/100</span>
                <span className="text-[9px] text-neutral-400 block truncate font-sans">{stats?.fastestModel}</span>
              </div>
            </div>

            <div className="bg-[#050507] border border-neutral-900 rounded-xl p-4 text-left flex flex-col justify-between hover:border-neutral-800 transition-all duration-300">
              <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest block">Lowest Cost</span>
              <div className="space-y-0.5 mt-2" title={stats?.lowestCostModel}>
                <span className="text-2xl font-display font-semibold text-purple-400 block">{stats?.lowestCostPrice}</span>
                <span className="text-[9px] text-neutral-400 block truncate font-sans">{stats?.lowestCostModel}</span>
              </div>
            </div>
          </section>
        )}

        {/* COMPARISON BAR & CONTROLS DISPLAY */}
        <section className="bg-[#050507] border border-neutral-900 rounded-2xl p-5 space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="text-left">
              <h3 className="text-sm font-semibold text-white tracking-tight flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-[#5194ec]" />
                Advanced Comparative Matrix
              </h3>
              <p className="text-[11px] text-neutral-500">Overlay metrics and specs for 2 to 4 architectures side-by-side.</p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => {
                  setIsCompareMode(prev => !prev);
                  triggerToast(isCompareMode ? 'Exited comparison hub' : 'Matrix analysis enabled');
                  playChime(600, 0.08);
                }}
                className={`px-4 py-2 rounded-xl text-[10px] font-bold font-mono uppercase tracking-wider transition-colors border cursor-pointer ${isCompareMode ? 'bg-[#5194ec] text-white border-[#5194ec]' : 'bg-neutral-900 hover:bg-neutral-800 text-neutral-400 border-neutral-800'}`}
              >
                {isCompareMode ? 'Disable Comparison' : 'Enable Comparison Layout'}
              </button>

              {isCompareMode && (
                <>
                  <button
                    onClick={() => setShowSaveDialog(true)}
                    className="px-3 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-[10px] font-mono text-neutral-300 hover:text-white transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <Bookmark className="w-3 h-3" />
                    Save Comparison
                  </button>
                  <button
                    onClick={handleExportComparison}
                    className="px-3 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-[10px] font-mono text-neutral-300 hover:text-white transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Export JSON
                  </button>
                  <button
                    onClick={handleShareComparison}
                    className="px-3 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-[10px] font-mono text-neutral-300 hover:text-white transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    Share Link
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Model picker row */}
          <div className="border-t border-neutral-900/60 pt-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest">Select models to compare:</span>
              <span className="text-[10px] text-neutral-400 font-mono font-bold">{compareModelIds.length} of 4 chosen</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {models.map(m => {
                const isSelected = compareModelIds.includes(m.id);
                return (
                  <button
                    key={m.id}
                    onClick={() => handleToggleCompare(m.id)}
                    className={`px-3 py-1.5 rounded-xl text-[10px] font-mono tracking-wide transition-colors border cursor-pointer ${isSelected ? 'bg-[#5194ec]/10 border-[#5194ec]/30 text-[#5194ec] font-bold' : 'bg-[#0a0a0c] border-neutral-900 text-neutral-500 hover:text-neutral-300 hover:border-neutral-800'}`}
                  >
                    {isSelected ? '✓ ' : '+ '} {m.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Saved Comparisons Workspace Row */}
          {savedComparisons.length > 0 && (
            <div className="pt-2.5 border-t border-neutral-900/60 text-left">
              <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest block mb-2">My Saved Workspace Comparisons:</span>
              <div className="flex flex-wrap gap-2">
                {savedComparisons.map(item => (
                  <div
                    key={item.id}
                    onClick={() => handleLoadSavedComparison(item.modelIds, item.name)}
                    className="px-3 py-1.5 rounded-xl bg-[#0b0b0e] hover:bg-[#121217] border border-neutral-900 text-[10px] text-neutral-300 flex items-center gap-2 cursor-pointer transition-colors"
                  >
                    <BookmarkCheck className="w-3 h-3 text-[#5194ec]" />
                    <span className="font-medium">{item.name}</span>
                    <button
                      onClick={(e) => handleDeleteSavedComparison(item.id, e)}
                      className="text-neutral-600 hover:text-red-400 p-0.5 ml-1 transition-colors"
                      title="Delete saved configuration"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* SAVE TO WORKSPACE DIALOG MODAL */}
        {showSaveDialog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/80" onClick={() => setShowSaveDialog(false)} />
            <div className="relative bg-[#09090b] border border-neutral-800 rounded-2xl max-w-md w-full p-6 text-left space-y-4 shadow-2xl z-10">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-white">Save Comparison Setup</h3>
                <button onClick={() => setShowSaveDialog(false)} className="p-1 hover:text-white text-neutral-500">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-neutral-400">Save your compared list of models to AI X Workspace for persistent recall.</p>
              <input
                type="text"
                placeholder="E.g., Frontier reasoning comparison"
                value={newComparisonName}
                onChange={(e) => setNewComparisonName(e.target.value)}
                className="w-full bg-[#0d0d11] border border-neutral-900 focus:border-[#5194ec]/40 focus:outline-none text-xs text-white p-3 rounded-xl transition-all"
              />
              <div className="flex justify-end gap-2.5 pt-2">
                <button onClick={() => setShowSaveDialog(false)} className="px-4 py-2 rounded-xl text-xs bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white transition-colors">
                  Cancel
                </button>
                <button onClick={handleSaveComparison} className="px-4 py-2 rounded-xl text-xs bg-[#5194ec] text-white hover:bg-blue-600 transition-colors">
                  Save Comparison
                </button>
              </div>
            </div>
          </div>
        )}

        {/* IF COMPARE MODE TRIGGERED: EXPAND DETAILED COMPARISON MODULE */}
        <AnimatePresence>
          {isCompareMode && (
            <motion.section
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              className="bg-[#050507] border border-neutral-900 rounded-3xl p-6 text-left space-y-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-900/60 pb-4">
                <div className="space-y-0.5">
                  <h2 className="text-base font-bold text-white flex items-center gap-1.5">
                    <Sliders className="w-4.5 h-4.5 text-[#5194ec]" />
                    Overlay Analysis Hub
                  </h2>
                  <p className="text-xs text-neutral-500">Comprehensive capabilities overlay, specifications, license verification, and AI recommendations</p>
                </div>

                {/* Sub-modes selector */}
                <div className="flex flex-wrap bg-[#0a0a0c] border border-neutral-900 rounded-xl p-1 shrink-0">
                  {([
                    { id: 'side-by-side', label: 'Matrix' },
                    { id: 'table', label: 'Specs Table' },
                    { id: 'radar', label: 'Radar' }
                  ] as const).map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setCompareModeType(tab.id);
                        playChime(560, 0.05);
                      }}
                      className={`px-3 py-1.5 rounded-lg text-[9px] font-mono font-bold uppercase transition-all cursor-pointer ${compareModeType === tab.id ? 'bg-[#18181b] text-white shadow-inner' : 'text-neutral-500 hover:text-neutral-300'}`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* RENDER MODE A: SIDE-BY-SIDE MATRIX LAYOUT */}
              {compareModeType === 'side-by-side' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {comparedModels.map(model => {
                    const oScore = getOverallScore(model);
                    return (
                      <div key={model.id} className="bg-[#08080a] border border-neutral-900/90 hover:border-neutral-800 rounded-2xl overflow-hidden flex flex-col justify-between p-4.5 relative group">
                        
                        {/* Winner Highlights indicator overall */}
                        {oScore === Math.max(...comparedModels.map(getOverallScore)) && (
                          <div className="absolute top-3.5 right-3.5 bg-yellow-500/10 border border-yellow-500/20 px-2 py-0.5 rounded text-[8px] font-mono font-bold text-yellow-500 flex items-center gap-1">
                            ★ OVERALL WINNER
                          </div>
                        )}

                        <div className="space-y-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center text-sm font-bold font-mono">
                              {model.logo}
                            </div>
                            <div className="text-left">
                              <h4 className="text-xs font-bold text-white group-hover:text-[#5194ec] transition-colors">{model.name}</h4>
                              <span className="text-[9px] font-mono text-neutral-500 uppercase">{model.company}</span>
                            </div>
                          </div>

                          <div className="space-y-2 border-t border-neutral-900/60 pt-3">
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="text-neutral-500">Reasoning Index:</span>
                              <span className={`font-mono font-bold ${categoryWinners.reasoning === model.id ? 'text-yellow-500' : 'text-white'}`}>
                                {model.benchmarks.reasoning}% {categoryWinners.reasoning === model.id && '👑'}
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="text-neutral-500">Coding capability:</span>
                              <span className={`font-mono font-bold ${categoryWinners.coding === model.id ? 'text-yellow-500' : 'text-white'}`}>
                                {model.benchmarks.coding}% {categoryWinners.coding === model.id && '👑'}
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="text-neutral-500">Math Index:</span>
                              <span className={`font-mono font-bold ${categoryWinners.math === model.id ? 'text-yellow-500' : 'text-white'}`}>
                                {model.benchmarks.math}% {categoryWinners.math === model.id && '👑'}
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="text-neutral-500">Vision & Image:</span>
                              <span className={`font-mono font-bold ${categoryWinners.vision === model.id ? 'text-yellow-500' : 'text-white'}`}>
                                {model.benchmarks.vision}% {categoryWinners.vision === model.id && '👑'}
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="text-neutral-500">Inference Speed:</span>
                              <span className={`font-mono font-bold ${categoryWinners.latency === model.id ? 'text-yellow-500' : 'text-white'}`}>
                                {model.benchmarks.latency}/100 {categoryWinners.latency === model.id && '👑'}
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="text-neutral-500">Cost Efficiency:</span>
                              <span className={`font-mono font-bold ${categoryWinners.cost === model.id ? 'text-yellow-500' : 'text-white'}`}>
                                {model.benchmarks.cost}/100 {categoryWinners.cost === model.id && '👑'}
                              </span>
                            </div>
                          </div>

                          <div className="border-t border-neutral-900/60 pt-3 space-y-1.5 text-xs">
                            <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest block">Primary Strengths</span>
                            <div className="flex flex-wrap gap-1">
                              {model.summary.strengths.slice(0, 2).map((st, i) => (
                                <span key={i} className="px-2 py-0.5 rounded bg-neutral-950 border border-neutral-900 text-[9px] text-neutral-400">
                                  {st}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="pt-4 mt-4 border-t border-neutral-900/60 flex items-center justify-between">
                          <button
                            onClick={() => handleToggleCompare(model.id)}
                            className="text-[9px] font-mono uppercase text-red-500 hover:text-red-400 transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            <Trash2 className="w-3 h-3" /> Remove
                          </button>

                          <button
                            onClick={() => {
                              if (onOpenModel) {
                                onOpenModel(model.slug);
                              } else {
                                setSelectedModelForInsights(model);
                              }
                            }}
                            className="text-[9px] font-mono uppercase text-[#5194ec] hover:underline cursor-pointer"
                          >
                            Profile Details →
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* RENDER MODE B: SPECIFICATIONS TABLE OVERVIEW */}
              {compareModeType === 'table' && (
                <div className="overflow-x-auto border border-neutral-900 rounded-2xl bg-[#08080a]">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-neutral-900 bg-[#0c0c0e] text-[9px] font-mono text-neutral-500 uppercase">
                        <th className="p-4">Specification Parameter</th>
                        {comparedModels.map(m => (
                          <th key={m.id} className="p-4 min-w-[150px]">
                            <div className="font-bold text-white">{m.name}</div>
                            <div className="text-[8px] text-neutral-500">{m.company}</div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-900/60 text-neutral-300">
                      <tr>
                        <td className="p-4 font-semibold text-neutral-400">Context Window</td>
                        {comparedModels.map(m => (
                          <td key={m.id} className="p-4 font-mono">
                            <span className={categoryWinners.context === m.id ? 'text-yellow-500 font-bold' : ''}>
                              {m.specifications.contextWindow} {categoryWinners.context === m.id && '👑'}
                            </span>
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="p-4 font-semibold text-neutral-400">Modalities Support</td>
                        {comparedModels.map(m => (
                          <td key={m.id} className="p-4 text-[11px]">
                            {m.specifications.modalities.join(', ')}
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="p-4 font-semibold text-neutral-400">Memory & Vector Store</td>
                        {comparedModels.map(m => (
                          <td key={m.id} className="p-4 text-[11px]">
                            {m.specifications.memory || 'Dynamic ephemeral state store'}
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="p-4 font-semibold text-neutral-400">Tool / Sandbox Execution</td>
                        {comparedModels.map(m => (
                          <td key={m.id} className="p-4 text-[11px]">
                            {m.specifications.toolCalling || 'Direct environment calling support'}
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="p-4 font-semibold text-neutral-400">Weights Distribution</td>
                        {comparedModels.map(m => (
                          <td key={m.id} className="p-4">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-mono ${m.isOpenSource ? 'bg-emerald-500/10 text-emerald-400' : 'bg-neutral-900 text-neutral-500'}`}>
                              {m.isOpenSource ? 'Open weights' : 'Proprietary platform'}
                            </span>
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="p-4 font-semibold text-neutral-400">License Terms</td>
                        {comparedModels.map(m => (
                          <td key={m.id} className="p-4 text-[11px] font-mono">
                            {m.specifications.license || 'Custom Developer Agreement'}
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="p-4 font-semibold text-neutral-400">Inference Pricing (1M Input)</td>
                        {comparedModels.map(m => (
                          <td key={m.id} className="p-4 text-[11px] font-mono">
                            {m.specifications.pricingInput}
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}

              {/* RENDER MODE C: RADAR RADIAL COMPARISON MATRIX */}
              {compareModeType === 'radar' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                  <div className="lg:col-span-7 h-80 w-full flex items-center justify-center relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarChartData}>
                        <PolarGrid stroke="#16161c" />
                        <PolarAngleAxis dataKey="subject" stroke="#666670" fontSize={8} />
                        <PolarRadiusAxis stroke="#16161c" angle={30} domain={[0, 100]} tick={false} />
                        {comparedModels.map((m, index) => {
                          const colors = ['#5194ec', '#10b981', '#f59e0b', '#ec4899'];
                          const color = colors[index % colors.length];
                          return (
                            <Radar
                              key={m.id}
                              name={m.name}
                              dataKey={m.name}
                              stroke={color}
                              fill={color}
                              fillOpacity={0.12}
                            />
                          );
                        })}
                        <Tooltip
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              return (
                                <div className="bg-[#0b0b0d] border border-neutral-800 p-2.5 rounded-lg text-left shadow-2xl space-y-1">
                                  <p className="text-[9px] font-mono font-bold text-neutral-500 uppercase">{payload[0].payload.subject}</p>
                                  <div className="space-y-1">
                                    {payload.map((p: any) => (
                                      <div key={p.name} className="flex items-center justify-between gap-4 text-xs">
                                        <span className="text-neutral-400 font-medium">{p.name}:</span>
                                        <span className="font-mono font-bold" style={{ color: p.color }}>{p.value}%</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="lg:col-span-5 space-y-4">
                    <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest block">Legend Parameters Overview</span>
                    <div className="space-y-2.5">
                      {comparedModels.map((m, index) => {
                        const colors = ['#5194ec', '#10b981', '#f59e0b', '#ec4899'];
                        const color = colors[index % colors.length];
                        return (
                          <div key={m.id} className="flex items-center justify-between bg-[#0a0a0c] border border-neutral-900 rounded-xl p-3">
                            <div className="flex items-center gap-2.5">
                              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
                              <span className="text-xs font-semibold text-white">{m.name}</span>
                            </div>
                            <span className="text-xs font-mono font-bold text-neutral-400">{getOverallScore(m)}% Average</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* DYNAMIC AI RECOMMENDATION ENGINE FOR SELECTED MATRIX */}
              {aiRecommendations && (
                <div className="pt-4 border-t border-neutral-900/60 text-left">
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#5194ec] uppercase tracking-wider mb-4">
                    <Sparkles className="w-4 h-4 animate-bounce" />
                    AI recommendation engine predictions
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Best Overall */}
                    <div className="bg-[#08080a] border border-[#5194ec]/25 rounded-2xl p-4.5 space-y-1.5">
                      <div className="text-[9px] font-mono text-[#5194ec] font-bold uppercase tracking-wider">🎯 Best overall score</div>
                      <h4 className="text-xs font-bold text-white">{aiRecommendations.overall?.name}</h4>
                      <p className="text-[11px] text-neutral-400">Peak consensus capability index. Ideal for high-fidelity reasoning pipelines.</p>
                    </div>

                    {/* Best for Coding */}
                    <div className="bg-[#08080a] border border-emerald-500/20 rounded-2xl p-4.5 space-y-1.5">
                      <div className="text-[9px] font-mono text-emerald-400 font-bold uppercase tracking-wider">💻 Peak engineering model</div>
                      <h4 className="text-xs font-bold text-white">{aiRecommendations.coding?.name}</h4>
                      <p className="text-[11px] text-neutral-400">Highest scores recorded in code refactoring and software orchestration.</p>
                    </div>

                    {/* Best Open Source or Budget */}
                    <div className="bg-[#08080a] border border-purple-500/20 rounded-2xl p-4.5 space-y-1.5">
                      <div className="text-[9px] font-mono text-purple-400 font-bold uppercase tracking-wider">🔑 Efficiency and weights control</div>
                      <h4 className="text-xs font-bold text-white">
                        {aiRecommendations.openSource ? aiRecommendations.openSource.name : aiRecommendations.budget?.name}
                      </h4>
                      <p className="text-[11px] text-neutral-400">
                        {aiRecommendations.openSource ? 'Weights available for self-hosting with zero API key leaks.' : 'Cheapest recorded pricing with outstanding metrics.'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </motion.section>
          )}
        </AnimatePresence>

        {/* INTERACTIVE DATA VISUALIZATIONS CHARTS */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-left">
          
          {/* BAR CHART: CAPABILITY COMPARISON */}
          <div className="lg:col-span-7 bg-[#050507] border border-neutral-900 rounded-3xl p-6 space-y-4 shadow-2xl flex flex-col justify-between">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-0.5">
                <h3 className="text-sm font-semibold text-white tracking-tight flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-[#5194ec]" />
                  Capability Comparison Matrix
                </h3>
                <p className="text-[11px] text-neutral-500">Overlay models dynamically according to the active benchmark score dimension</p>
              </div>

              {/* Dynamic metric selectors dropdown */}
              <select
                value={activeChartMetric}
                onChange={(e) => {
                  setActiveChartMetric(e.target.value);
                  playChime(640, 0.05);
                }}
                className="bg-[#0a0a0c] border border-neutral-900 text-[10px] font-bold text-[#5194ec] rounded-xl px-3 py-2 focus:outline-none cursor-pointer"
              >
                <option value="overall">Overall Average Score</option>
                <option value="reasoning">Reasoning Index</option>
                <option value="coding">Coding & Synthesis</option>
                <option value="math">Mathematics Index</option>
                <option value="vision">Vision Processing</option>
                <option value="agentTasks">Agent Execution Index</option>
              </select>
            </div>

            {/* Recharts dynamic canvas rendering */}
            <div className="h-64 sm:h-72 w-full mt-4 relative min-h-[200px]">
              {barChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barChartData} margin={{ top: 10, right: 10, left: -25, bottom: 10 }}>
                    <XAxis 
                      dataKey="name" 
                      stroke="#44444c" 
                      fontSize={8} 
                      tickLine={false} 
                      angle={-10}
                      textAnchor="end"
                    />
                    <YAxis stroke="#44444c" fontSize={8} tickLine={false} domain={[0, 100]} />
                    <Tooltip
                      cursor={{ fill: 'rgba(255, 255, 255, 0.01)' }}
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-[#0b0b0d] border border-neutral-800 p-2.5 rounded-lg text-left shadow-2xl">
                              <p className="text-[10px] font-mono font-bold text-white uppercase tracking-wider">{data.name}</p>
                              <div className="mt-1.5 flex items-center gap-1.5 text-xs text-neutral-300">
                                <span className="font-semibold text-[#5194ec]">{metricLabel(activeChartMetric)}:</span>
                                <span className="font-mono font-bold">{data.score}%</span>
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar 
                      dataKey="score" 
                      fill="#5194ec" 
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-xs text-neutral-500 font-medium">
                  No benchmarks matching your filters can be drawn on canvas.
                </div>
              )}
            </div>
          </div>

          {/* HISTORICAL ARCHITECTURAL CHRONOLOGY */}
          <div className="lg:col-span-5 bg-[#050507] border border-neutral-900 rounded-3xl p-6 space-y-4 shadow-2xl flex flex-col justify-between">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-0.5 text-left">
                <h3 className="text-sm font-semibold text-white tracking-tight flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-[#5194ec]" />
                  Historical Trajectory
                </h3>
                <p className="text-[11px] text-neutral-500">Track benchmark milestones across release quarters</p>
              </div>

              {/* Timeframe selectors */}
              <div className="flex bg-[#0a0a0c] border border-neutral-900 rounded-xl p-1 shrink-0">
                {(['6M', '1Y', 'ALL'] as const).map(tf => (
                  <button
                    key={tf}
                    onClick={() => {
                      setTimeframe(tf);
                      playChime(500, 0.05);
                    }}
                    className={`px-2.5 py-1 rounded-lg text-[8px] font-mono font-bold uppercase transition-all cursor-pointer ${timeframe === tf ? 'bg-[#18181b] text-white' : 'text-neutral-500 hover:text-neutral-300'}`}
                  >
                    {tf === 'ALL' ? 'All' : tf}
                  </button>
                ))}
              </div>
            </div>

            {/* Area Chart mapping milestones progression */}
            <div className="h-60 sm:h-64 w-full relative min-h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={historicalPlotData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gGpt" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#5194ec" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#5194ec" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="quarter" stroke="#44444c" fontSize={8} tickLine={false} />
                  <YAxis stroke="#44444c" fontSize={8} tickLine={false} domain={[70, 100]} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-[#0b0b0d] border border-neutral-800 p-2 rounded-lg text-left shadow-2xl space-y-1">
                            <p className="text-[9px] font-mono font-bold text-neutral-400 uppercase">{payload[0].payload.quarter}</p>
                            <div className="space-y-0.5">
                              {payload.map((p: any) => (
                                <div key={p.name} className="flex items-center justify-between gap-4 text-xs">
                                  <span className="text-neutral-400">{p.name}:</span>
                                  <span className="font-mono font-bold text-white">{p.value}%</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area type="monotone" dataKey="GPT-5 (Sovereign)" stroke="#5194ec" strokeWidth={1.8} fill="url(#gGpt)" />
                  <Area type="monotone" dataKey="Claude 4 (Opus)" stroke="#10b981" strokeWidth={1.5} fill="none" />
                  <Area type="monotone" dataKey="DeepSeek-R1" stroke="#f59e0b" strokeWidth={1.5} fill="none" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        {/* SMART FILTERING CATEGORIES & SLIDERS SIDEBAR */}
        <section className="space-y-4 text-left">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-neutral-400 uppercase tracking-widest">
              <Filter className="w-3.5 h-3.5 text-[#5194ec]" />
              <span>Multi-Dimensional Search Filter Arrays</span>
            </div>
            
            <button 
              onClick={() => {
                setSelectedCategory('All');
                setMinOverallScore(0);
                setSelectedCompanyFilter('All');
                setLicenseTypeFilter('All');
                setContextWindowFilter('All');
                setLatencyFilter('All');
                setPriceFilter('All');
                setSearchQuery('');
                triggerToast('All filtering criteria reset successfully');
                playChime(400, 0.08);
              }}
              className="text-[10px] font-mono text-neutral-400 hover:text-white underline cursor-pointer"
            >
              Reset all filter criteria
            </button>
          </div>

          {/* Quick Categories Navigation Row */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none border-b border-neutral-900/60">
            {['All', 'Reasoning', 'Coding', 'Math', 'Vision', 'Agents', 'Cost', 'Open Source'].map(cat => {
              const isAct = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat);
                    playChime(550, 0.05);
                    // Dynamically align sort triggers with active filter
                    if (cat === 'Reasoning') setSortField('reasoning');
                    else if (cat === 'Coding') setSortField('coding');
                    else if (cat === 'Math') setSortField('math');
                    else if (cat === 'Vision') setSortField('vision');
                    else if (cat === 'Agents') setSortField('agentTasks');
                  }}
                  className={`px-4 py-2 rounded-full text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap border ${isAct ? 'bg-[#111115] border-neutral-700 text-white' : 'bg-[#050507]/60 border-neutral-900 text-neutral-400 hover:text-white hover:border-neutral-800'}`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Advanced Multi-option Selector arrays */}
          <div className="bg-[#050507] border border-neutral-900 rounded-2xl p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Min Overall Slider */}
            <div className="space-y-2 text-left">
              <label className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest block">Min Score threshold:</label>
              <div className="flex items-center gap-3">
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={minOverallScore}
                  onChange={(e) => {
                    setMinOverallScore(Number(e.target.value));
                    playChime(440, 0.03);
                  }}
                  className="w-full accent-[#5194ec] h-1 bg-neutral-900 rounded-lg cursor-pointer"
                />
                <span className="text-xs font-mono font-bold text-white shrink-0 w-8">{minOverallScore || 'Any'}</span>
              </div>
            </div>

            {/* Developer/Company drop down */}
            <div className="space-y-1.5 text-left">
              <label className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest block">Developer Company:</label>
              <select
                value={selectedCompanyFilter}
                onChange={(e) => {
                  setSelectedCompanyFilter(e.target.value);
                  playChime(480, 0.05);
                }}
                className="w-full bg-[#0a0a0c] border border-neutral-900 text-xs text-neutral-300 rounded-xl p-2.5 focus:outline-none focus:border-[#5194ec]/40 cursor-pointer"
              >
                {companiesList.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Context range */}
            <div className="space-y-1.5 text-left">
              <label className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest block">Context Tiers:</label>
              <select
                value={contextWindowFilter}
                onChange={(e) => {
                  setContextWindowFilter(e.target.value);
                  playChime(480, 0.05);
                }}
                className="w-full bg-[#0a0a0c] border border-neutral-900 text-xs text-[#5194ec] rounded-xl p-2.5 focus:outline-none focus:border-[#5194ec]/40 cursor-pointer font-bold"
              >
                <option value="All">All Context windows</option>
                <option value="1M+">Ultra Long Window (1M+ Tokens)</option>
                <option value="128K-500K">Medium Window (128K-500K)</option>
              </select>
            </div>

            {/* Speed index */}
            <div className="space-y-1.5 text-left">
              <label className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest block">Speed / Latency Index:</label>
              <select
                value={latencyFilter}
                onChange={(e) => {
                  setLatencyFilter(e.target.value);
                  playChime(480, 0.05);
                }}
                className="w-full bg-[#0a0a0c] border border-neutral-900 text-xs text-neutral-300 rounded-xl p-2.5 focus:outline-none focus:border-[#5194ec]/40 cursor-pointer"
              >
                <option value="All">All Speeds</option>
                <option value="Ultra Fast">Ultra Fast Inference (&gt;=80)</option>
                <option value="Standard">Standard speed</option>
              </select>
            </div>

            {/* Cost Index */}
            <div className="space-y-1.5 text-left">
              <label className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest block">Cost Projections:</label>
              <select
                value={priceFilter}
                onChange={(e) => {
                  setPriceFilter(e.target.value);
                  playChime(480, 0.05);
                }}
                className="w-full bg-[#0a0a0c] border border-neutral-900 text-xs text-neutral-300 rounded-xl p-2.5 focus:outline-none focus:border-[#5194ec]/40 cursor-pointer"
              >
                <option value="All">All pricing tiers</option>
                <option value="Budget">Cheaper/Open source alternatives (&gt;=80)</option>
                <option value="Premium">Premium APIs</option>
              </select>
            </div>
          </div>
        </section>

        {/* INTERACTIVE MODEL LEADERBOARD TABLE */}
        <section className="space-y-4 text-left">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <h3 className="text-sm font-semibold text-white tracking-tight flex items-center gap-1.5">
                <Award className="w-4 h-4 text-[#5194ec]" />
                Interactive Leaderboard Engine
              </h3>
              <p className="text-[11px] text-neutral-500">Dense analytics grid. Click headers to sort. Pin models to anchor them at top of list.</p>
            </div>
            
            <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest">
              High Contrast / ARIA Verified
            </span>
          </div>

          <div className="bg-[#050507] border border-neutral-900/95 rounded-[22px] overflow-hidden shadow-2xl relative">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse table-auto">
                <thead className="sticky top-0 bg-[#08080a] border-b border-neutral-900/80 text-neutral-500 text-[9px] font-mono tracking-wider uppercase z-20">
                  <tr>
                    <th className="py-4.5 px-4 text-center w-[50px]">Pin</th>
                    <th className="py-4.5 px-3 text-center w-[50px]">Rank</th>
                    <th className="py-4.5 px-4 cursor-pointer hover:text-white transition-colors" onClick={() => handleSort('name')}>
                      <div className="flex items-center gap-1.5">
                        Model Architectures
                        {sortField === 'name' && (sortDirection === 'desc' ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />)}
                      </div>
                    </th>
                    <th className="py-4.5 px-4 cursor-pointer hover:text-white transition-colors" onClick={() => handleSort('company')}>
                      <div className="flex items-center gap-1.5">
                        Developer
                        {sortField === 'company' && (sortDirection === 'desc' ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />)}
                      </div>
                    </th>
                    <th className="py-4.5 px-3 cursor-pointer text-center hover:text-white transition-colors" onClick={() => handleSort('reasoning')}>
                      <div className="flex items-center justify-center gap-1">
                        Reasoning
                        {sortField === 'reasoning' && (sortDirection === 'desc' ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />)}
                      </div>
                    </th>
                    <th className="py-4.5 px-3 cursor-pointer text-center hover:text-white transition-colors" onClick={() => handleSort('coding')}>
                      <div className="flex items-center justify-center gap-1">
                        Coding
                        {sortField === 'coding' && (sortDirection === 'desc' ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />)}
                      </div>
                    </th>
                    <th className="py-4.5 px-3 cursor-pointer text-center hover:text-white transition-colors" onClick={() => handleSort('math')}>
                      <div className="flex items-center justify-center gap-1">
                        Math
                        {sortField === 'math' && (sortDirection === 'desc' ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />)}
                      </div>
                    </th>
                    <th className="py-4.5 px-3 cursor-pointer text-center hover:text-white transition-colors" onClick={() => handleSort('vision')}>
                      <div className="flex items-center justify-center gap-1">
                        Vision
                        {sortField === 'vision' && (sortDirection === 'desc' ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />)}
                      </div>
                    </th>
                    <th className="py-4.5 px-3 cursor-pointer text-center hover:text-white transition-colors" onClick={() => handleSort('agentTasks')}>
                      <div className="flex items-center justify-center gap-1">
                        Agent
                        {sortField === 'agentTasks' && (sortDirection === 'desc' ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />)}
                      </div>
                    </th>
                    <th className="py-4.5 px-3 cursor-pointer text-center hover:text-white transition-colors" onClick={() => handleSort('latency')}>
                      <div className="flex items-center justify-center gap-1">
                        Speed
                        {sortField === 'latency' && (sortDirection === 'desc' ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />)}
                      </div>
                    </th>
                    <th className="py-4.5 px-3 cursor-pointer text-center hover:text-white transition-colors" onClick={() => handleSort('price')}>
                      <div className="flex items-center justify-center gap-1">
                        Cost
                        {sortField === 'price' && (sortDirection === 'desc' ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />)}
                      </div>
                    </th>
                    <th className="py-4.5 px-4 cursor-pointer text-center hover:text-[#5194ec] transition-colors" onClick={() => handleSort('overall')}>
                      <div className="flex items-center justify-center gap-1.5 text-[#5194ec]">
                        Overall Score
                        {sortField === 'overall' && (sortDirection === 'desc' ? <ChevronDown className="w-3.5 h-3.5 text-[#5194ec]" /> : <ChevronUp className="w-3.5 h-3.5 text-[#5194ec]" />)}
                      </div>
                    </th>
                  </tr>
                </thead>
                
                <tbody className="divide-y divide-neutral-900/60 font-sans">
                  {sortedModels.map((model, idx) => {
                    const overall = getOverallScore(model);
                    const isPinned = pinnedModelIds.includes(model.id);
                    const isTop1 = idx === 0 && !isPinned && sortField === 'overall';
                    const isSelectedForCompare = compareModelIds.includes(model.id);

                    return (
                      <tr 
                        key={model.id} 
                        className={`hover:bg-[#0c0c10] transition-colors duration-150 group cursor-pointer ${isPinned ? 'bg-[#5194ec]/3 border-l-2 border-l-[#5194ec]' : ''} ${isTop1 ? 'bg-gradient-to-r from-yellow-500/5 to-transparent' : ''}`}
                        onClick={() => {
                          setSelectedModelForInsights(model);
                          playChime(600, 0.05);
                        }}
                      >
                        {/* Pin anchor toggle */}
                        <td className="py-3.5 px-4 text-center align-middle" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => togglePin(model.id, model.name)}
                            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${isPinned ? 'text-[#5194ec] hover:text-neutral-300' : 'text-neutral-700 hover:text-neutral-400'}`}
                            title={isPinned ? 'Unpin Row' : 'Anchor to Top'}
                          >
                            <Pin className="w-3.5 h-3.5 transform rotate-45" fill={isPinned ? '#5194ec' : 'none'} />
                          </button>
                        </td>

                        {/* Rank */}
                        <td className="py-3.5 px-3 text-center align-middle font-mono text-xs text-neutral-400">
                          {isPinned ? (
                            <span className="text-[#5194ec] font-bold">PIN</span>
                          ) : isTop1 ? (
                            <span className="text-yellow-500 font-bold">★ 1</span>
                          ) : (
                            idx + 1
                          )}
                        </td>

                        {/* Logo & Model info */}
                        <td className="py-3.5 px-4 align-middle">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center text-xs font-bold font-mono text-neutral-300 shrink-0">
                              {model.logo}
                            </div>
                            <div>
                              <span className="text-xs font-semibold text-white block group-hover:text-[#5194ec] transition-colors">
                                {model.name}
                              </span>
                              <span className="text-[9px] text-neutral-500 font-mono block">
                                {model.currentVersion || 'v1.0'}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Company */}
                        <td className="py-3.5 px-4 align-middle text-xs text-neutral-400 font-medium">
                          {model.company}
                        </td>

                        {/* Scores */}
                        <td className="py-3.5 px-3 align-middle text-center font-mono text-xs text-neutral-300">
                          {model.benchmarks.reasoning}%
                        </td>
                        <td className="py-3.5 px-3 align-middle text-center font-mono text-xs text-neutral-300">
                          {model.benchmarks.coding}%
                        </td>
                        <td className="py-3.5 px-3 align-middle text-center font-mono text-xs text-neutral-300">
                          {model.benchmarks.math}%
                        </td>
                        <td className="py-3.5 px-3 align-middle text-center font-mono text-xs text-neutral-300">
                          {model.benchmarks.vision}%
                        </td>
                        <td className="py-3.5 px-3 align-middle text-center font-mono text-xs text-neutral-300">
                          {model.benchmarks.agentTasks}%
                        </td>
                        <td className="py-3.5 px-3 align-middle text-center font-mono text-xs text-neutral-400">
                          {model.benchmarks.latency}/100
                        </td>
                        <td className="py-3.5 px-3 align-middle text-center text-[10px] font-mono text-neutral-400 truncate max-w-[100px]" title={model.specifications.pricingInput}>
                          {model.specifications.pricingInput.split(' ')[0]}
                        </td>

                        {/* Combined dynamic index */}
                        <td className="py-3.5 px-4 align-middle text-center">
                          <span className="text-xs font-bold text-[#5194ec] bg-[#5194ec]/10 border border-[#5194ec]/20 px-2.5 py-1 rounded-lg">
                            {overall}%
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Empty matching fallback */}
            {sortedModels.length === 0 && (
              <div className="text-center py-12 px-6 space-y-4">
                <AlertCircle className="w-10 h-10 text-neutral-500 mx-auto" />
                <div>
                  <h4 className="text-xs font-semibold text-white uppercase">No Architectures Match Constraints</h4>
                  <p className="text-xs text-neutral-500 max-w-sm mx-auto mt-1 leading-relaxed">
                    Clear keywords or drop pricing / latency boundary filters to expand index coverage.
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* RELATED SYSTEM RESEARCH PAPERS & DISCOVERY BENTO GRID */}
        <section className="space-y-4 text-left">
          <div className="flex items-center gap-2 text-xs font-semibold text-neutral-400 uppercase tracking-widest">
            <BookOpen className="w-4 h-4 text-[#5194ec]" />
            <span>Consensus Research & Related Intelligence Reports</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-[#050507] border border-neutral-900 hover:border-neutral-800 rounded-2xl p-5 space-y-3 transition-colors text-left flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[8px] font-mono font-bold text-[#5194ec] bg-[#5194ec]/10 border border-[#5194ec]/20 px-2 py-0.5 rounded uppercase">Consensus Report</span>
                  <span className="text-[9px] font-mono text-neutral-500">2026</span>
                </div>
                <h4 className="text-xs font-bold text-white uppercase">Global Open Intelligence Report</h4>
                <p className="text-neutral-400 text-xs leading-relaxed line-clamp-3">
                  Comprehensive macro-level overview tracking synthetic model parameters optimization, computing cluster budgets, and regional deployment compliance models.
                </p>
              </div>
              <button
                onClick={() => {
                  if (onOpenResearch) {
                    onOpenResearch('global-report-2026');
                  } else {
                    triggerToast('Report index opened. Refer to Workspace Desk.');
                  }
                  playChime(600, 0.1);
                }}
                className="text-[10px] font-mono text-neutral-400 hover:text-white hover:underline mt-2 flex items-center gap-1 cursor-pointer font-bold"
              >
                Access Intelligence Report <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="bg-[#050507] border border-neutral-900 hover:border-neutral-800 rounded-2xl p-5 space-y-3 transition-colors text-left flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[8px] font-mono font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded uppercase">Academic Study</span>
                  <span className="text-[9px] font-mono text-neutral-500">2025 Q4</span>
                </div>
                <h4 className="text-xs font-bold text-white uppercase">Attention Mechanisms in Mixture of Experts</h4>
                <p className="text-neutral-400 text-xs leading-relaxed line-clamp-3">
                  A foundational analysis examining routing network optimizations and dynamic persistent layers allocation in modern frontier deep networks.
                </p>
              </div>
              <button
                onClick={() => {
                  if (onOpenResearch) {
                    onOpenResearch('attention');
                  } else {
                    triggerToast('Attention research study opened');
                  }
                  playChime(600, 0.1);
                }}
                className="text-[10px] font-mono text-neutral-400 hover:text-white hover:underline mt-2 flex items-center gap-1 cursor-pointer font-bold"
              >
                Launch Research Paper <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="bg-[#050507] border border-neutral-900 hover:border-neutral-800 rounded-2xl p-5 space-y-3 transition-colors text-left flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[8px] font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded uppercase">Enterprise Standard</span>
                  <span className="text-[9px] font-mono text-neutral-500">Active Specification</span>
                </div>
                <h4 className="text-xs font-bold text-white uppercase">Sovereign Cluster Safety Firewalls</h4>
                <p className="text-neutral-400 text-xs leading-relaxed line-clamp-3">
                  Defining the global security protocols and zero-trust sandbox execution pipelines that regulate autonomous agent orchestrators.
                </p>
              </div>
              <button
                onClick={() => {
                  if (onOpenResearch) {
                    onOpenResearch('sovereign-safeguards');
                  } else {
                    triggerToast('Safety frameworks specifications loaded');
                  }
                  playChime(600, 0.1);
                }}
                className="text-[10px] font-mono text-neutral-400 hover:text-white hover:underline mt-2 flex items-center gap-1 cursor-pointer font-bold"
              >
                Access Documentation <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* KEYBOARD SHORTCUTS ASSISTANT OVERLAY PANEL */}
      <AnimatePresence>
        {showShortcutsHelp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/80" onClick={() => setShowShortcutsHelp(false)} />
            <div className="relative bg-[#09090b] border border-neutral-800 rounded-2xl max-w-sm w-full p-6 text-left space-y-4 shadow-2xl z-10">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-white flex items-center gap-1.5 uppercase tracking-wider">
                  <Key className="w-4 h-4 text-[#5194ec]" /> Keyboard Shortcuts
                </h3>
                <button onClick={() => setShowShortcutsHelp(false)} className="p-1 hover:text-white text-neutral-500">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-2 font-mono text-xs text-neutral-300">
                <div className="flex justify-between py-1.5 border-b border-neutral-900/60">
                  <span>Focus Search:</span>
                  <span className="text-white font-bold bg-neutral-850 px-2 py-0.5 rounded border border-neutral-800">/</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-neutral-900/60">
                  <span>Force Sync Reload:</span>
                  <span className="text-white font-bold bg-neutral-850 px-2 py-0.5 rounded border border-neutral-800">r</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-neutral-900/60">
                  <span>Toggle Comparison Layout:</span>
                  <span className="text-white font-bold bg-neutral-850 px-2 py-0.5 rounded border border-neutral-800">h</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-neutral-900/60">
                  <span>Clear Filters & Search:</span>
                  <span className="text-white font-bold bg-neutral-850 px-2 py-0.5 rounded border border-neutral-800">c</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span>Close Drawer Overlays:</span>
                  <span className="text-white font-bold bg-neutral-850 px-2 py-0.5 rounded border border-neutral-800">Esc</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* DETAILED DRAWERS FOR MODEL INSIGHT OVERVIEW */}
      <AnimatePresence>
        {selectedModelForInsights && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <div className="absolute inset-0 bg-black/60" onClick={() => setSelectedModelForInsights(null)} />
            
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-full sm:w-[460px] bg-[#070709] border-l border-neutral-900/90 h-full overflow-y-auto scrollbar-none shadow-2xl relative z-10 flex flex-col justify-between text-left"
            >
              <div>
                <div className="h-40 relative bg-neutral-950">
                  <img 
                    src={selectedModelForInsights.coverImage} 
                    alt={selectedModelForInsights.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover filter brightness-[0.5]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#070709] via-transparent to-transparent" />
                  
                  <button 
                    onClick={() => setSelectedModelForInsights(null)}
                    className="absolute top-4 left-4 p-2 bg-[#000000]/70 border border-neutral-800 rounded-full text-neutral-400 hover:text-white cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  <button 
                    onClick={() => toggleBookmark(selectedModelForInsights.id, selectedModelForInsights.name)}
                    className="absolute top-4 right-4 p-2 bg-[#000000]/70 border border-neutral-800 rounded-full text-neutral-400 hover:text-white cursor-pointer"
                  >
                    <Bookmark className="w-4 h-4" fill={bookmarks.includes(selectedModelForInsights.id) ? '#5194ec' : 'none'} />
                  </button>

                  <div className="absolute bottom-4 left-5 right-5">
                    <span className="text-[9px] font-mono font-bold text-[#5194ec] uppercase tracking-widest">{selectedModelForInsights.company}</span>
                    <h3 className="text-lg font-bold text-white mt-1 uppercase">{selectedModelForInsights.name}</h3>
                  </div>
                </div>

                <div className="p-5 space-y-5 text-left">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-[#0b0b0e] border border-neutral-900 rounded-xl p-3">
                      <span className="text-[8px] font-mono text-neutral-500 uppercase block">Combined Score</span>
                      <span className="text-lg font-bold text-white block mt-1">{getOverallScore(selectedModelForInsights)}%</span>
                    </div>
                    <div className="bg-[#0b0b0e] border border-neutral-900 rounded-xl p-3">
                      <span className="text-[8px] font-mono text-neutral-500 uppercase block">License Model</span>
                      <span className="text-xs font-semibold text-neutral-300 block mt-1.5 truncate">
                        {selectedModelForInsights.isOpenSource ? 'Open weights' : 'Proprietary platform API'}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <h4 className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest">Purpose</h4>
                    <p className="text-xs text-neutral-300 leading-relaxed font-sans">{selectedModelForInsights.summary.purpose}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-neutral-900/60">
                    <div className="space-y-1.5">
                      <h4 className="text-[9px] font-mono text-emerald-400 uppercase tracking-widest flex items-center gap-1">
                        <Check className="w-3 h-3" /> Strengths
                      </h4>
                      <ul className="space-y-1">
                        {selectedModelForInsights.summary.strengths.slice(0, 3).map((st, i) => (
                          <li key={i} className="text-[10px] text-neutral-400 list-disc list-inside leading-tight">{st}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="space-y-1.5">
                      <h4 className="text-[9px] font-mono text-amber-500 uppercase tracking-widest flex items-center gap-1">
                        <X className="w-3 h-3" /> Weaknesses
                      </h4>
                      <ul className="space-y-1">
                        {selectedModelForInsights.summary.weaknesses.slice(0, 3).map((wk, i) => (
                          <li key={i} className="text-[10px] text-neutral-400 list-disc list-inside leading-tight">{wk}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {selectedModelForInsights.related && selectedModelForInsights.related.length > 0 && (
                    <div className="space-y-2 pt-4 border-t border-neutral-900/60">
                      <h4 className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest">Research & Related references</h4>
                      <div className="space-y-1.5">
                        {selectedModelForInsights.related.slice(0, 2).map((rel, i) => (
                          <div 
                            key={i}
                            onClick={() => {
                              if (rel.type === 'Research Paper' && onOpenResearch) {
                                const paperSlug = rel.link.split('/').pop() || 'attention';
                                onOpenResearch(paperSlug);
                              } else if (onOpenCompany) {
                                onOpenCompany(getCompanySlug(selectedModelForInsights.company));
                              }
                              setSelectedModelForInsights(null);
                            }}
                            className="bg-[#0b0b0e] border border-neutral-900 hover:border-neutral-800 p-2.5 rounded-xl block text-left cursor-pointer"
                          >
                            <span className="text-[8px] font-mono text-[#5194ec] uppercase block">{rel.type}</span>
                            <span className="text-xs font-semibold text-neutral-200 block truncate mt-1">{rel.title}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-5 bg-[#040405] border-t border-neutral-900 text-center space-y-2 shrink-0">
                <button
                  onClick={() => {
                    if (onOpenModel) {
                      onOpenModel(selectedModelForInsights.slug);
                    } else if (onOpenCompany) {
                      onOpenCompany(getCompanySlug(selectedModelForInsights.company));
                    }
                    setSelectedModelForInsights(null);
                  }}
                  className="w-full py-2.5 rounded-xl bg-[#5194ec] hover:bg-blue-600 text-xs font-bold font-mono uppercase tracking-wider text-white transition-colors cursor-pointer"
                >
                  Open Full Architecture Profile
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* FOOTER */}
      <footer className="bg-[#040405] border-t border-neutral-900/80 py-8 px-6 text-center mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-1.5">
            <span className="font-display font-bold text-lg tracking-tight text-white">AI</span>
            <span className="font-display font-semibold text-lg tracking-tight bg-gradient-to-r from-[#5194ec] to-[#91bdfa] bg-clip-text text-transparent ml-0.5">X</span>
            <span className="text-[9px] text-neutral-500 uppercase tracking-widest font-mono ml-2">Benchmark Consensus Node</span>
          </div>

          <div className="flex items-center gap-6">
            <button onClick={onBack} className="text-xs font-bold text-[#5194ec] hover:underline cursor-pointer">
              Back to Feed
            </button>
            <span className="text-xs text-neutral-600">|</span>
            <span className="text-xs text-neutral-500">© 2026 AI X Corporation. All rights reserved.</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
