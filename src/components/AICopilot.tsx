import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { 
  MessageSquare, Send, X, Maximize2, Minimize2, Plus, Pin, Trash2, 
  Edit2, Search, Share2, Download, Sparkles, BookOpen, Briefcase, 
  Award, HelpCircle, Activity, FileText, Layers, RefreshCw, Copy, Check,
  BookMarked, HelpCircle as QuizIcon, Layers as FlashcardIcon, FileText as ReportIcon,
  Clock as TimelineIcon, ArrowLeft, ArrowRight, User, Cpu, ExternalLink, ChevronDown, CheckCircle
} from 'lucide-react';
import { getCompanyProfile } from '../data/companies';

interface Message {
  role: 'user' | 'assistant';
  text: string;
  pinned?: boolean;
  timestamp: string;
  isComparison?: boolean;
  comparisonData?: any;
}

interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  isPinned: boolean;
  contextType: string;
  contextData: any;
  dateCreated: string;
}

interface AICopilotProps {
  theme: 'dark' | 'light';
  activeContextType: 'article' | 'model' | 'company' | 'research' | 'benchmark' | 'workspace' | 'general';
  activeContextData: any;
  onAddNote?: (note: { title: string; content: string; tags: string[] }) => void;
  onSwitchTab?: (tab: 'news' | 'workspace' | 'benchmarks') => void;
  onOpenModel?: (slug: string) => void;
  onOpenCompany?: (slug: string) => void;
  onOpenResearch?: (slug: string) => void;
  isOpen?: boolean;
  setIsOpen?: (open: boolean) => void;
  comparePreset?: { entityA: string, entityB: string } | null;
  onClearComparePreset?: () => void;
}

export default function AICopilot({
  theme,
  activeContextType,
  activeContextData,
  onAddNote,
  onSwitchTab,
  onOpenModel,
  onOpenCompany,
  onOpenResearch,
  isOpen: isOpenProp,
  setIsOpen: setIsOpenProp,
  comparePreset,
  onClearComparePreset
}: AICopilotProps) {
  // --- STATE ---
  const [isOpenInternal, setIsOpenInternal] = useState(false);
  const isOpen = isOpenProp !== undefined ? isOpenProp : isOpenInternal;
  const setIsOpen = setIsOpenProp !== undefined ? setIsOpenProp : setIsOpenInternal;

  // Watch compare preset and trigger comparison setup
  useEffect(() => {
    if (comparePreset) {
      setCompareEntityA(comparePreset.entityA);
      setCompareEntityB(comparePreset.entityB);
      setShowComparisonSetup(true);
      setIsOpen(true);
      if (onClearComparePreset) {
        onClearComparePreset();
      }
    }
  }, [comparePreset]);

  const [isFullScreen, setIsFullScreen] = useState(false);
  const [chats, setChats] = useState<ChatSession[]>(() => {
    const saved = localStorage.getItem('aix-copilot-chats');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    // Default chat session
    return [{
      id: 'default-session',
      title: 'Initial Conversation',
      messages: [{
        role: 'assistant',
        text: "Hello! I am your Sprints 9 & 10 AI Research Analyst. I am context-aware and ready to assist you. Ask me to compare models, summarize active pages, convert answers to notes, or generate quizzes. How can I help you today?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }],
      isPinned: false,
      contextType: 'general',
      contextData: null,
      dateCreated: new Date().toLocaleDateString()
    }];
  });

  const [activeChatId, setActiveChatId] = useState<string>('default-session');
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [explanationLevel, setExplanationLevel] = useState<'beginner' | 'intermediate' | 'expert'>('intermediate');
  const [searchChatsQuery, setSearchChatsQuery] = useState('');
  const [editingChatId, setEditingChatId] = useState<string | null>(null);
  const [editingChatTitle, setEditingChatTitle] = useState('');
  const [showHistoryPanel, setShowHistoryPanel] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copiedMessageId, setCopiedMessageId] = useState<number | null>(null);

  // Multi-mode comparison state
  const [showComparisonSetup, setShowComparisonSetup] = useState(false);
  const [compareEntityA, setCompareEntityA] = useState('gpt-5');
  const [compareEntityB, setCompareEntityB] = useState('claude-4');
  const [compareCriteria, setCompareCriteria] = useState<string[]>(['performance', 'pricing', 'APIs', 'enterprise readiness']);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Synchronize chat list to LocalStorage
  useEffect(() => {
    localStorage.setItem('aix-copilot-chats', JSON.stringify(chats));
  }, [chats]);

  // Scroll to bottom on message updates
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chats, activeChatId, isLoading]);

  const activeChat = chats.find(c => c.id === activeChatId) || chats[0];

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  // --- ACTIONS ---
  const handleStartNewChat = (customTitle?: string) => {
    const newId = `chat-${Date.now()}`;
    const newChat: ChatSession = {
      id: newId,
      title: customTitle || `Chat about ${activeContextType !== 'general' ? activeContextType : 'AI Topic'}`,
      messages: [{
        role: 'assistant',
        text: `I've initialized a new conversation. I am currently aware of your page context: **${activeContextType.toUpperCase()}** (${activeContextData?.name || activeContextData?.title || 'Home'}). Ask me anything!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }],
      isPinned: false,
      contextType: activeContextType,
      contextData: activeContextData,
      dateCreated: new Date().toLocaleDateString()
    };
    setChats(prev => [newChat, ...prev]);
    setActiveChatId(newId);
    setShowHistoryPanel(false);
    triggerToast("New chat session started!");
  };

  const handleSendMessage = async (e?: React.FormEvent, customText?: string, customAction?: string) => {
    if (e) e.preventDefault();
    const msgText = customText || inputMessage;
    if (!msgText.trim() && !customAction) return;

    // Build the user message
    const userMsg: Message = {
      role: 'user',
      text: msgText || `Trigger Action: ${customAction?.toUpperCase()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    // Add user message to active chat
    setChats(prev => prev.map(c => {
      if (c.id === activeChatId) {
        return {
          ...c,
          messages: [...c.messages, userMsg]
        };
      }
      return c;
    }));

    if (!customText) setInputMessage('');
    setIsLoading(true);

    try {
      // API call to the Sprints 9 & 10 AI Copilot chat route
      const response = await fetch('/api/copilot/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: msgText,
          history: activeChat.messages.map(m => ({ role: m.role, text: m.text })),
          contextType: activeContextType,
          contextData: activeContextData,
          explanationLevel: explanationLevel,
          customAction: customAction || null
        })
      });

      const data = await response.json();

      const botMsg: Message = {
        role: 'assistant',
        text: data.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setChats(prev => prev.map(c => {
        if (c.id === activeChatId) {
          return {
            ...c,
            messages: [...c.messages, botMsg]
          };
        }
        return c;
      }));

    } catch (err) {
      console.error(err);
      const errorMsg: Message = {
        role: 'assistant',
        text: "I experienced an offline latency connection limit. Let me generate a localized tactical outline:\n\n- Ensure your workspace contains compiled notes.\n- Cross-check standard benchmark sheets in the main view.\n- Add followed entities to your personalized **For You Dashboard** for automatic telemetry alerts.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChats(prev => prev.map(c => {
        if (c.id === activeChatId) {
          return {
            ...c,
            messages: [...c.messages, errorMsg]
          };
        }
        return c;
      }));
    } finally {
      setIsLoading(false);
    }
  };

  // Execute Quick Actions
  const handleQuickAction = (actionKey: string, label: string) => {
    let textPrompt = `Generate a ${label} based on my active screen context.`;
    if (activeContextType === 'general') {
      textPrompt = `Analyze recent top AI news developments and generate a ${label}.`;
    }
    handleSendMessage(undefined, textPrompt, actionKey);
  };

  // Perform Multi-mode comparison
  const handleCompareEntities = async () => {
    setShowComparisonSetup(false);
    setIsLoading(true);

    const userMsg: Message = {
      role: 'user',
      text: `Compare **${compareEntityA.toUpperCase()}** vs **${compareEntityB.toUpperCase()}** across key criteria: ${compareCriteria.join(', ')}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChats(prev => prev.map(c => {
      if (c.id === activeChatId) {
        return { ...c, messages: [...c.messages, userMsg] };
      }
      return c;
    }));

    try {
      const res = await fetch('/api/copilot/compare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          entityA: compareEntityA,
          entityB: compareEntityB,
          criteria: compareCriteria
        })
      });

      const data = await res.json();

      const botMsg: Message = {
        role: 'assistant',
        text: `### Comparative Analysis\nHere is a beautiful comparison scorecard for **${compareEntityA.toUpperCase()}** vs **${compareEntityB.toUpperCase()}**:\n\n**Recommendation:** ${data.recommendation}`,
        isComparison: true,
        comparisonData: data,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setChats(prev => prev.map(c => {
        if (c.id === activeChatId) {
          return { ...c, messages: [...c.messages, botMsg] };
        }
        return c;
      }));

    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Pin a conversation session
  const togglePinChat = (id: string) => {
    setChats(prev => prev.map(c => {
      if (c.id === id) {
        return { ...c, isPinned: !c.isPinned };
      }
      return c;
    }));
    triggerToast("Pin state updated");
  };

  // Rename conversation
  const handleSaveRename = (id: string) => {
    if (!editingChatTitle.trim()) return;
    setChats(prev => prev.map(c => {
      if (c.id === id) {
        return { ...c, title: editingChatTitle };
      }
      return c;
    }));
    setEditingChatId(null);
    triggerToast("Conversation renamed!");
  };

  // Delete chat
  const handleDeleteChat = (id: string) => {
    if (chats.length <= 1) {
      triggerToast("Cannot delete the only remaining session.");
      return;
    }
    setChats(prev => prev.filter(c => c.id !== id));
    if (activeChatId === id) {
      const remaining = chats.filter(c => c.id !== id);
      setActiveChatId(remaining[0].id);
    }
    triggerToast("Conversation deleted.");
  };

  // Convert AI Response to a Workspace Note
  const handleConvertResponseToNote = (messageText: string) => {
    if (onAddNote) {
      const newNote = {
        title: `AI Copilot Insight - ${new Date().toLocaleDateString()}`,
        content: messageText,
        tags: ['Copilot', activeContextType]
      };
      onAddNote(newNote);
      triggerToast("Answer converted to a Note and saved to Workspace!");
    } else {
      triggerToast("Workspace not fully linked. Please create Note manually.");
    }
  };

  // Pin single message response inside conversation
  const togglePinMessage = (msgIdx: number) => {
    setChats(prev => prev.map(c => {
      if (c.id === activeChatId) {
        const msgs = [...c.messages];
        msgs[msgIdx] = { ...msgs[msgIdx], pinned: !msgs[msgIdx].pinned };
        return { ...c, messages: msgs };
      }
      return c;
    }));
    triggerToast("Message pin state updated!");
  };

  // Export Chat
  const handleExportChat = (format: 'markdown' | 'json') => {
    let content = '';
    let mimeType = 'text/plain';
    let fileExtension = 'txt';

    if (format === 'markdown') {
      content = `# AI X Copilot Chat Session: ${activeChat.title}\nDate: ${activeChat.dateCreated}\n\n`;
      activeChat.messages.forEach(m => {
        content += `### ${m.role === 'user' ? 'User' : 'Copilot'} [${m.timestamp}]\n${m.text}\n\n---\n\n`;
      });
      mimeType = 'text/markdown';
      fileExtension = 'md';
    } else {
      content = JSON.stringify(activeChat, null, 2);
      mimeType = 'application/json';
      fileExtension = 'json';
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aix_copilot_${activeChat.id}.${fileExtension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    triggerToast(`Exported chat successfully as ${format.toUpperCase()}!`);
  };

  // Filter sessions based on search query
  const filteredChats = chats.filter(c => 
    c.title.toLowerCase().includes(searchChatsQuery.toLowerCase()) ||
    c.messages.some(m => m.text.toLowerCase().includes(searchChatsQuery.toLowerCase()))
  );

  return (
    <>
      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-40 flex items-center gap-3">
        {/* Pulsing notifications for active updates */}
        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] px-2.5 py-1.5 rounded-full backdrop-blur-sm shadow-md animate-pulse hidden md:flex items-center gap-1.5 font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          Intel Copilot Online
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`relative group p-4 rounded-2xl bg-gradient-to-b from-[#2563eb] to-[#1d4ed8] hover:from-blue-600 hover:to-blue-800 text-white shadow-2xl transition-all duration-300 transform active:scale-95 cursor-pointer flex items-center justify-center`}
          style={{ width: '56px', height: '56px' }}
        >
          {isOpen ? (
            <X className="w-6 h-6 animate-spin-once" />
          ) : (
            <div className="relative">
              <Sparkles className="w-6 h-6 animate-pulse" />
              <span className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-red-500 border-2 border-blue-600 rounded-full" />
            </div>
          )}
        </button>
      </div>

      {/* Main Copilot Drawer Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 100, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.95 }}
            transition={{ type: 'spring', damping: 20, stiffness: 150 }}
            className={`fixed z-40 shadow-2xl overflow-hidden backdrop-blur-xl border flex flex-col ${
              theme === 'dark' 
                ? 'bg-neutral-950/95 border-neutral-800 text-white' 
                : 'bg-white/95 border-neutral-200 text-neutral-900'
            } ${
              isFullScreen 
                ? 'inset-4 rounded-3xl' 
                : 'bottom-24 right-6 w-full max-w-[440px] h-[calc(85vh-96px)] rounded-[32px]'
            }`}
          >
            {/* Header */}
            <div className={`p-5 flex items-center justify-between border-b ${theme === 'dark' ? 'border-neutral-900' : 'border-neutral-100'}`}>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-blue-400" />
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-2">
                    <h4 className="font-display font-bold text-sm tracking-tight">AI X Research Analyst</h4>
                    <span className="bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full uppercase">Sprints 9 & 10</span>
                  </div>
                  <p className="text-[10px] text-neutral-500">Continuous context-grounded agent</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Switch History Panel */}
                <button
                  onClick={() => setShowHistoryPanel(!showHistoryPanel)}
                  className={`p-1.5 rounded-lg hover:bg-neutral-900/10 transition-colors text-neutral-400 hover:text-white cursor-pointer ${showHistoryPanel ? 'bg-blue-500/15 text-blue-400' : ''}`}
                  title="Conversation History"
                >
                  <MessageSquare className="w-4 h-4" />
                </button>

                {/* Full screen toggle */}
                <button
                  onClick={() => setIsFullScreen(!isFullScreen)}
                  className="p-1.5 rounded-lg hover:bg-neutral-900/10 transition-colors text-neutral-400 hover:text-white cursor-pointer"
                  title={isFullScreen ? "Minimize" : "Expand to Full Screen"}
                >
                  {isFullScreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>

                {/* Close Panel */}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-neutral-900/10 transition-colors text-neutral-400 hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Context Awareness Bar */}
            <div className={`px-5 py-2.5 flex items-center justify-between border-b text-[11px] font-mono uppercase tracking-wider ${
              theme === 'dark' 
                ? 'bg-neutral-950 border-neutral-900 text-neutral-400' 
                : 'bg-neutral-50 border-neutral-100 text-neutral-500'
            }`}>
              <div className="flex items-center gap-1.5 truncate max-w-[70%]">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                <span>Active Context:</span>
                <span className={`font-bold rounded px-1.5 py-0.5 text-[10px] ${
                  theme === 'dark' ? 'bg-neutral-900 text-blue-300' : 'bg-neutral-200 text-blue-700'
                }`}>
                  {activeContextType}
                </span>
                <span className="truncate italic">
                  {activeContextData?.name || activeContextData?.title || 'Home Dashboard'}
                </span>
              </div>

              {/* Depth / Explanation Level toggle */}
              <div className="flex items-center gap-1">
                <span className="text-[9px] text-neutral-500">Depth:</span>
                <select
                  value={explanationLevel}
                  onChange={(e) => {
                    setExplanationLevel(e.target.value as any);
                    triggerToast(`Explanation level set to ${e.target.value}`);
                  }}
                  className={`bg-transparent outline-none cursor-pointer border-none font-sans font-bold text-[#5194ec] text-[10px] uppercase`}
                >
                  <option value="beginner" className={theme === 'dark' ? 'bg-neutral-950 text-white' : 'bg-white text-black'}>Beginner</option>
                  <option value="intermediate" className={theme === 'dark' ? 'bg-neutral-950 text-white' : 'bg-white text-black'}>Intermediate</option>
                  <option value="expert" className={theme === 'dark' ? 'bg-neutral-950 text-white' : 'bg-white text-black'}>Expert</option>
                </select>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-grow flex relative overflow-hidden">
              {/* History & Management Drawer (Left Sidebar when Open) */}
              <AnimatePresence>
                {showHistoryPanel && (
                  <motion.div
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 280, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    className={`h-full border-r flex flex-col ${
                      theme === 'dark' ? 'bg-neutral-950/98 border-neutral-900' : 'bg-neutral-50 border-neutral-200'
                    } overflow-hidden z-20 absolute left-0 top-0 bottom-0`}
                  >
                    <div className="p-4 flex flex-col flex-grow">
                      {/* Search chats */}
                      <div className="relative mb-3">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-500" />
                        <input
                          type="text"
                          placeholder="Search conversations..."
                          value={searchChatsQuery}
                          onChange={(e) => setSearchChatsQuery(e.target.value)}
                          className={`w-full text-xs font-sans pl-8 pr-3 py-2 rounded-xl outline-none border ${
                            theme === 'dark' 
                              ? 'bg-neutral-900 border-neutral-800 text-white placeholder-neutral-500' 
                              : 'bg-white border-neutral-200 text-neutral-900 placeholder-neutral-400'
                          }`}
                        />
                      </div>

                      {/* Sessions List */}
                      <div className="flex-grow overflow-y-auto space-y-1.5 pr-1 text-left scrollbar-none">
                        {filteredChats.map((chat) => (
                          <div
                            key={chat.id}
                            className={`group p-2.5 rounded-xl border flex items-center justify-between gap-2 transition-all relative ${
                              activeChatId === chat.id
                                ? 'bg-blue-500/10 border-blue-500/25 text-blue-400 font-medium'
                                : `${theme === 'dark' ? 'bg-neutral-900/30 border-transparent text-neutral-400 hover:bg-neutral-900/60' : 'bg-neutral-200/20 border-transparent text-neutral-600 hover:bg-neutral-200/40'}`
                            }`}
                          >
                            <button
                              onClick={() => {
                                setActiveChatId(chat.id);
                                setShowHistoryPanel(false);
                              }}
                              className="flex-grow text-xs truncate font-sans text-left cursor-pointer"
                            >
                              {editingChatId === chat.id ? (
                                <input
                                  type="text"
                                  value={editingChatTitle}
                                  onChange={(e) => setEditingChatTitle(e.target.value)}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleSaveRename(chat.id);
                                  }}
                                  onBlur={() => handleSaveRename(chat.id)}
                                  className="w-full bg-neutral-950 border border-neutral-800 text-white text-xs p-1 rounded font-sans"
                                  autoFocus
                                />
                              ) : (
                                <div className="flex items-center gap-1.5 truncate">
                                  {chat.isPinned && <Pin className="w-2.5 h-2.5 text-[#5194ec] flex-shrink-0" />}
                                  <span className="truncate">{chat.title}</span>
                                </div>
                              )}
                            </button>

                            {/* Session Operations */}
                            {editingChatId !== chat.id && (
                              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                  onClick={() => {
                                    setEditingChatId(chat.id);
                                    setEditingChatTitle(chat.title);
                                  }}
                                  className="p-1 text-neutral-400 hover:text-white"
                                  title="Rename"
                                >
                                  <Edit2 className="w-3 h-3" />
                                </button>
                                <button
                                  onClick={() => togglePinChat(chat.id)}
                                  className={`p-1 ${chat.isPinned ? 'text-blue-400' : 'text-neutral-400'} hover:text-white`}
                                  title={chat.isPinned ? "Unpin" : "Pin"}
                                >
                                  <Pin className="w-3 h-3" />
                                </button>
                                <button
                                  onClick={() => handleDeleteChat(chat.id)}
                                  className="p-1 text-rose-500 hover:text-rose-400"
                                  title="Delete"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Session Actions Footer */}
                      <div className="pt-3 border-t border-neutral-900 mt-2 flex gap-2">
                        <button
                          onClick={() => handleStartNewChat()}
                          className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold font-sans transition-all cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>New Session</span>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Main Dialogue Panel */}
              <div className="flex-grow flex flex-col h-full overflow-hidden">
                {/* Chat Stream Viewport */}
                <div className={`flex-grow overflow-y-auto p-5 space-y-5 text-left scrollbar-none`}>
                  {activeChat.messages.map((msg, i) => {
                    const isCopied = copiedMessageId === i;
                    return (
                      <div 
                        key={i} 
                        className={`flex flex-col ${
                          msg.role === 'user' 
                            ? 'items-end self-end ml-12' 
                            : 'items-start self-start mr-12'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 mb-1 text-[10px] font-mono text-neutral-500">
                          {msg.role === 'user' ? (
                            <>
                              <span>User</span>
                              <User className="w-3 h-3 text-neutral-500" />
                            </>
                          ) : (
                            <>
                              <Cpu className="w-3 h-3 text-blue-400" />
                              <span>Analyst Copilot</span>
                            </>
                          )}
                          <span>•</span>
                          <span>{msg.timestamp}</span>
                        </div>

                        <div className={`p-4 rounded-2xl text-xs leading-relaxed font-sans shadow-md border ${
                          msg.role === 'user'
                            ? 'bg-[#5194ec] border-[#5194ec]/80 text-white rounded-tr-none text-right'
                            : `${theme === 'dark' ? 'bg-neutral-900/60 border-neutral-800/80 text-neutral-300' : 'bg-neutral-50 border-neutral-200 text-neutral-800'} rounded-tl-none text-left`
                        }`}>
                          {msg.isComparison && msg.comparisonData ? (
                            /* Comparison Card Viewport */
                            <div className="space-y-4 font-sans text-neutral-300">
                              <h5 className="font-bold text-sm text-white flex items-center gap-2 border-b border-neutral-800 pb-2">
                                <Layers className="w-4 h-4 text-blue-400" />
                                {msg.comparisonData.title}
                              </h5>
                              <p className="text-xs italic text-neutral-400">{msg.comparisonData.summary}</p>
                              
                              {/* Metrics comparison cards */}
                              <div className="space-y-3">
                                {msg.comparisonData.metrics?.map((m: any, idx: number) => (
                                  <div key={idx} className="space-y-1">
                                    <div className="flex justify-between text-[11px] font-bold text-neutral-400">
                                      <span>{m.name}</span>
                                    </div>
                                    <div className="grid grid-cols-12 gap-2 items-center">
                                      {/* Entity A score */}
                                      <div className="col-span-5 text-right text-[10px] truncate" title={m.labelA}>
                                        {m.labelA}
                                      </div>
                                      {/* Bar comparing scores */}
                                      <div className="col-span-2 flex items-center gap-0.5 bg-neutral-950 p-1 rounded-full border border-neutral-800 h-4">
                                        <div 
                                          className="h-full rounded-full bg-blue-500" 
                                          style={{ width: `${m.scoreA / 2}%` }}
                                        />
                                        <div 
                                          className="h-full rounded-full bg-indigo-500" 
                                          style={{ width: `${m.scoreB / 2}%` }}
                                        />
                                      </div>
                                      {/* Entity B score */}
                                      <div className="col-span-5 text-left text-[10px] truncate" title={m.labelB}>
                                        {m.labelB}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>

                              <div className="p-3 bg-neutral-950/60 border border-neutral-800/80 rounded-xl">
                                <span className="text-[10px] uppercase font-mono font-bold text-[#5194ec] block mb-1">Recommendation</span>
                                <p className="text-[11px] text-neutral-200">{msg.comparisonData.recommendation}</p>
                              </div>
                            </div>
                          ) : (
                            <div className="markdown-body">
                              <ReactMarkdown>{msg.text}</ReactMarkdown>
                            </div>
                          )}
                        </div>

                        {/* Bot Message Productivity Toolbar */}
                        {msg.role === 'assistant' && (
                          <div className="flex items-center gap-2.5 mt-1.5 ml-1 opacity-60 hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => togglePinMessage(i)}
                              className={`p-1 rounded hover:bg-neutral-900/10 transition-all ${msg.pinned ? 'text-[#5194ec]' : 'text-neutral-500 hover:text-white'} cursor-pointer`}
                              title={msg.pinned ? "Unpin Answer" : "Pin Answer"}
                            >
                              <Pin className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => handleConvertResponseToNote(msg.text)}
                              className="p-1 rounded hover:bg-neutral-900/10 text-neutral-500 hover:text-white transition-all cursor-pointer"
                              title="Convert Response to Workspace Note"
                            >
                              <FileText className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(msg.text);
                                setCopiedMessageId(i);
                                setTimeout(() => setCopiedMessageId(null), 2000);
                                triggerToast("Response copied to clipboard!");
                              }}
                              className="p-1 rounded hover:bg-neutral-900/10 text-neutral-500 hover:text-white transition-all cursor-pointer"
                              title="Copy Answer"
                            >
                              {isCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                            </button>
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(window.location.href);
                                triggerToast("Copilot context link shared successfully!");
                              }}
                              className="p-1 rounded hover:bg-neutral-900/10 text-neutral-500 hover:text-white transition-all cursor-pointer"
                              title="Share Response"
                            >
                              <Share2 className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => {
                                if (onSwitchTab) {
                                  onSwitchTab('workspace');
                                  setIsOpen(false);
                                }
                              }}
                              className="text-[9px] font-bold text-neutral-500 hover:text-blue-400 uppercase tracking-widest font-sans ml-1 flex items-center gap-0.5"
                            >
                              Workspace <ArrowRight className="w-2.5 h-2.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {isLoading && (
                    <div className="flex items-center gap-2 p-3.5 rounded-2xl bg-blue-500/5 border border-blue-500/10 text-neutral-400 text-xs w-fit font-sans self-start">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#5194ec] animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-[#5194ec] animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-[#5194ec] animate-bounce" style={{ animationDelay: '300ms' }} />
                      Analyzing vector structures & synthesis...
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Quick actions Panel */}
                <div className={`px-5 py-3 border-t ${theme === 'dark' ? 'border-neutral-900' : 'border-neutral-100'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 font-bold">Quick Analyst Actions</span>
                    <button
                      onClick={() => setShowComparisonSetup(!showComparisonSetup)}
                      className={`text-[10px] font-bold font-sans text-blue-400 hover:underline flex items-center gap-0.5 cursor-pointer`}
                    >
                      <Layers className="w-3 h-3" />
                      Compare Engine
                    </button>
                  </div>

                  {/* Comparison Setup Overlay Dropdown */}
                  <AnimatePresence>
                    {showComparisonSetup && (
                      <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 15 }}
                        className={`p-4 rounded-2xl border mb-3 text-left ${
                          theme === 'dark' ? 'bg-neutral-900 border-neutral-800' : 'bg-neutral-100 border-neutral-200'
                        }`}
                      >
                        <h5 className="text-xs font-bold mb-3 flex items-center justify-between">
                          <span>Configure Side-by-Side Comparison</span>
                          <button onClick={() => setShowComparisonSetup(false)} className="text-neutral-500 hover:text-white">
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </h5>

                        <div className="grid grid-cols-2 gap-3 mb-3 text-xs">
                          <div>
                            <label className="text-[10px] font-mono text-neutral-500 uppercase block mb-1">Entity A</label>
                            <select 
                              value={compareEntityA} 
                              onChange={(e) => setCompareEntityA(e.target.value)}
                              className="w-full bg-neutral-950 text-white rounded p-1.5 border border-neutral-800 outline-none"
                            >
                              <option value="gpt-5">GPT-5</option>
                              <option value="claude-4">Claude 4</option>
                              <option value="gemini-2-5">Gemini 2.5</option>
                              <option value="deepseek-r1">DeepSeek R1</option>
                              <option value="llama-4">Llama 4</option>
                              <option value="openai">OpenAI</option>
                              <option value="anthropic">Anthropic</option>
                              <option value="google-deepmind">Google DeepMind</option>
                            </select>
                          </div>
                          <div>
                            <label className="text-[10px] font-mono text-neutral-500 uppercase block mb-1">Entity B</label>
                            <select 
                              value={compareEntityB} 
                              onChange={(e) => setCompareEntityB(e.target.value)}
                              className="w-full bg-neutral-950 text-white rounded p-1.5 border border-neutral-800 outline-none"
                            >
                              <option value="claude-4">Claude 4</option>
                              <option value="gpt-5">GPT-5</option>
                              <option value="gemini-2-5">Gemini 2.5</option>
                              <option value="deepseek-r1">DeepSeek R1</option>
                              <option value="llama-4">Llama 4</option>
                              <option value="anthropic">Anthropic</option>
                              <option value="openai">OpenAI</option>
                              <option value="nvidia">NVIDIA</option>
                            </select>
                          </div>
                        </div>

                        <button
                          onClick={handleCompareEntities}
                          className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
                        >
                          Generate Comparison Card
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Horizontal Scroll of Action Pills */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                    {[
                      { key: 'summary', label: 'Summarize', icon: BookMarked },
                      { key: 'explain', label: 'Explain Concepts', icon: HelpCircle },
                      { key: 'flashcards', label: 'Flashcards', icon: FlashcardIcon },
                      { key: 'quiz', label: 'Quiz Me', icon: QuizIcon },
                      { key: 'timeline', label: 'Milestone Timeline', icon: TimelineIcon },
                      { key: 'report', label: 'Technical Report', icon: ReportIcon }
                    ].map((act) => {
                      const Icon = act.icon;
                      return (
                        <button
                          key={act.key}
                          type="button"
                          onClick={() => handleQuickAction(act.key, act.label)}
                          className={`flex items-center gap-1 text-[10px] font-semibold font-sans px-3 py-1.5 rounded-full border transition-all whitespace-nowrap cursor-pointer ${
                            theme === 'dark' 
                              ? 'bg-neutral-900 border-neutral-800 text-neutral-300 hover:bg-neutral-800 hover:text-white' 
                              : 'bg-neutral-100 border-neutral-200 text-neutral-600 hover:bg-neutral-200 hover:text-neutral-900'
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5 text-[#5194ec]" />
                          <span>{act.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Suggested Prompts Grid */}
                {activeChat.messages.length <= 1 && (
                  <div className="px-5 pb-2 text-left">
                    <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest block mb-2 font-bold">Suggested Inquiries</span>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        "Compare GPT-5 vs Claude-4",
                        "Explain TSMC 2nm production line",
                        "Best multimodal reasoning models",
                        "Latest AI regulatory updates"
                      ].map((promptText) => (
                        <button
                          key={promptText}
                          onClick={() => handleSendMessage(undefined, promptText)}
                          className={`p-2.5 rounded-xl border text-left text-[11px] transition-all cursor-pointer font-sans leading-snug truncate ${
                            theme === 'dark' 
                              ? 'bg-neutral-900/40 border-neutral-900 text-neutral-400 hover:bg-neutral-900 hover:text-white hover:border-neutral-800' 
                              : 'bg-neutral-50 border-neutral-200 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900'
                          }`}
                        >
                          {promptText}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Conversation Input Bar */}
                <form 
                  onSubmit={handleSendMessage} 
                  className={`p-4 border-t flex items-center gap-2 ${
                    theme === 'dark' ? 'border-neutral-900 bg-neutral-950/70' : 'border-neutral-100 bg-white/70'
                  }`}
                >
                  <input
                    type="text"
                    placeholder="Ask about anything, e.g. 'Compare Llama vs Qwen'..."
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    disabled={isLoading}
                    className={`flex-grow border outline-none text-xs px-3.5 py-3 rounded-2xl transition-all font-sans ${
                      theme === 'dark' 
                        ? 'bg-neutral-900/60 border-neutral-800 focus:border-[#5194ec] text-white placeholder-neutral-500' 
                        : 'bg-neutral-50 border-neutral-200 focus:border-[#5194ec] text-neutral-900 placeholder-neutral-400'
                    }`}
                  />
                  
                  {/* Export Trigger */}
                  <button
                    type="button"
                    onClick={() => handleExportChat('markdown')}
                    className={`p-2.5 rounded-xl border transition-all hover:text-white cursor-pointer ${
                      theme === 'dark' ? 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:bg-neutral-800' : 'bg-neutral-50 border-neutral-200 text-neutral-500 hover:bg-neutral-100'
                    }`}
                    title="Export conversation as Markdown"
                  >
                    <Download className="w-4 h-4" />
                  </button>

                  <button
                    type="submit"
                    disabled={isLoading || !inputMessage.trim()}
                    className="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl transition-all disabled:opacity-40 flex items-center justify-center cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Global Micro Toast */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            className="fixed bottom-24 right-6 z-50 px-4 py-3 rounded-xl bg-neutral-900 border border-neutral-800 text-emerald-400 text-xs font-mono font-bold flex items-center gap-2 shadow-2xl backdrop-blur-md"
          >
            <CheckCircle className="w-4 h-4 text-emerald-400 animate-bounce" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
