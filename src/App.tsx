import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, ArrowRight, Menu, X as CloseIcon, Users, DollarSign, Zap, Home,
  Search, RefreshCw, TrendingUp, BookOpen, MessageSquare, Send, AlertCircle,
  ExternalLink, HelpCircle, ChevronRight, Copy, Check, Bookmark, Languages, 
  Volume2, VolumeX, Keyboard, Bell, Moon, Sun, Activity, FileText, Globe, Cpu,
  Award, Terminal, Info, MapPin, Eye, Loader2, Share2, History, Play, Pause,
  ArrowUpRight, ArrowDownRight, Clock, Calendar
} from 'lucide-react';
import {
  TechflowLogo,
  ZenithLogo,
  WavesLogo,
  HarmonyLogo,
  SpheronLogo,
} from './components/PartnerLogos';

import TrendingRadar from './components/TrendingRadar';
import VoiceAnchor from './components/VoiceAnchor';
import ArticleReaderPage from './components/ArticleReaderPage';
import TerminalTicker from './components/TerminalTicker';
import DailyBriefingSection from './components/DailyBriefingSection';
import TrendingSection from './components/TrendingSection';
import FeaturedIntelligence from './components/FeaturedIntelligence';
import UniversalSearchOverlay from './components/UniversalSearchOverlay';
import CompanyProfilePage from './components/CompanyProfilePage';
import ModelProfilePage from './components/ModelProfilePage';
import ResearchPaperPage from './components/ResearchPaperPage';
import BenchmarkDashboardPage from './components/BenchmarkDashboardPage';
import WorkspacePage from './components/WorkspacePage';
import AICopilot from './components/AICopilot';
import ForYouDashboard from './components/ForYouDashboard';
import CommunityPage from './components/CommunityPage';
import { getCompanyProfile } from './data/companies';

import { 
  auth, db, doc, setDoc, getDoc,
  signInAnonymously, signOut, onAuthStateChanged, User,
  collection, query, getDocs, addDoc, deleteDoc, updateDoc,
  GoogleAuthProvider, signInWithPopup
} from './lib/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile 
} from 'firebase/auth';

const REALTIME_ALERTS = [
  { title: "NVIDIA Blackwell chips enters mass production in Hsinchu Science Park", category: "Hardware" },
  { title: "OpenAI launches 'Operator' agentic suite for automated browser-based workflows", category: "Models" },
  { title: "EU Commission initiates strict compliance checks under newly active AI Act guidelines", category: "Regulation" },
  { title: "DeepMind announces AlphaFold 3 open source release for global biochemistry labs", category: "Applications" },
  { title: "Custom silicon breakthroughs yield 40% efficiency gains for mobile LLMs", category: "Hardware" }
];

export default function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Gemini Diagnostic states
  const [geminiStatus, setGeminiStatus] = useState<any>(null);
  const [isGeminiDiagnosticModalOpen, setIsGeminiDiagnosticModalOpen] = useState(false);
  const [isDiagnosticRunning, setIsDiagnosticRunning] = useState(false);

  const runGeminiDiagnostic = async () => {
    setIsDiagnosticRunning(true);
    try {
      const res = await fetch("/api/gemini-diagnostic");
      if (res.ok) {
        const data = await res.json();
        setGeminiStatus(data);
      } else {
        setGeminiStatus({
          success: false,
          status: "server_error",
          reason: `The diagnostics endpoint returned an HTTP error status: ${res.status}.`
        });
      }
    } catch (e: any) {
      setGeminiStatus({
        success: false,
        status: "network_error",
        reason: `Failed to connect to the diagnostics endpoint: ${e?.message || e}`
      });
    } finally {
      setIsDiagnosticRunning(false);
    }
  };
  const [showFullNav, setShowFullNav] = useState(true);

  // Full-stack AI News states
  const [news, setNews] = useState<any[]>([]);
  const [newsLoading, setNewsLoading] = useState(false);
  const [newsError, setNewsError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const [dateFilter, setDateFilter] = useState<'all' | '30days' | '3months' | '5months'>('all');
  const [searchQuery, setSearchQuery] = useState("");
  const [currentQuery, setCurrentQuery] = useState("latest artificial intelligence developments and tech announcements");
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [isRateLimited, setIsRateLimited] = useState(false);

  const [insights, setInsights] = useState<any>(null);
  const [insightsLoading, setInsightsLoading] = useState(false);

  const [chatMessage, setChatMessage] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<any[]>([
    {
      role: 'assistant',
      text: "Hi! I am the AI X Real-Time News Assistant. Ask me anything about current artificial intelligence announcements, tech specifications, or industry market trends, and I will search the web live to answer your questions!",
      sources: []
    }
  ]);

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Clipboard link copying with toast notifications
  const [toast, setToast] = useState<string | null>(null);
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // --- AI X Premium States ---
  const theme: 'dark' | 'light' = 'dark';
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshCountdown, setRefreshCountdown] = useState(180);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  
  const [followedCategories, setFollowedCategories] = useState<string[]>(() => {
    const saved = localStorage.getItem('aix-followed-categories');
    return saved ? JSON.parse(saved) : ["Models", "Hardware", "Regulation"];
  });

  const [bookmarks, setBookmarks] = useState<string[]>(() => {
    const saved = localStorage.getItem('aix-bookmarks');
    return saved ? JSON.parse(saved) : [];
  });

  const [readArticles, setReadArticles] = useState<string[]>(() => {
    const saved = localStorage.getItem('aix-read-articles');
    return saved ? JSON.parse(saved) : [];
  });

  const [activeReadingArticle, setActiveReadingArticle] = useState<any | null>(null);
  const [activeCompanySlug, setActiveCompanySlug] = useState<string | null>(null);
  const [activeModelSlug, setActiveModelSlug] = useState<string | null>(null);
  const [activeResearchSlug, setActiveResearchSlug] = useState<string | null>(null);
  const [isBenchmarksPage, setIsBenchmarksPage] = useState(false);
  const [isWorkspacePage, setIsWorkspacePage] = useState(false);
  const [currentCommunityPath, setCurrentCommunityPath] = useState<string | null>(null);

  // Sprints 9 & 10 States
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const [copilotComparePreset, setCopilotComparePreset] = useState<{ entityA: string, entityB: string } | null>(null);

  // Expand states per news item
  const [activeArticleIndex, setActiveArticleIndex] = useState<number | null>(null);
  const [activeSummaryTab, setActiveSummaryTab] = useState<'takeaway' | 'thirtySec' | 'detailed' | 'eli15' | 'technical' | 'timeline'>('takeaway');

  // Dynamic caches for on-the-fly fetchers
  const [articleSummaries, setArticleSummaries] = useState<Record<number, any>>({});
  const [articleTimelines, setArticleTimelines] = useState<Record<number, any[]>>({});
  const [summariesLoading, setSummariesLoading] = useState<Record<number, boolean>>({});
  const [timelinesLoading, setTimelinesLoading] = useState<Record<number, boolean>>({});

  const [translatedArticles, setTranslatedArticles] = useState<Record<number, { title: string, summary: string }>>({});
  const [translatingIndex, setTranslatingIndex] = useState<number | null>(null);
  const [activeLanguages, setActiveLanguages] = useState<Record<number, string>>({});

  const [viewedTabs, setViewedTabs] = useState<Record<string, string[]>>(() => {
    const saved = localStorage.getItem('aix-viewed-tabs');
    return saved ? JSON.parse(saved) : {};
  });

  const markTabAsViewed = (url: string, tabId: string) => {
    setViewedTabs(prev => {
      const current = prev[url] || [];
      if (current.includes(tabId)) return prev;
      const next = { ...prev, [url]: [...current, tabId] };
      localStorage.setItem('aix-viewed-tabs', JSON.stringify(next));
      if (auth.currentUser) {
        saveUserDataToFirestore({ viewedTabs: next });
      }
      return next;
    });
  };

  // Simulated push alerts
  const [pushAlert, setPushAlert] = useState<{ title: string, category: string } | null>(null);
  const [isShortcutModalOpen, setIsShortcutModalOpen] = useState(false);
  const [isSearchPaletteOpen, setIsSearchPaletteOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    const saved = localStorage.getItem('aix-recent-searches');
    return saved ? JSON.parse(saved) : ["GPT-4o", "NVIDIA Blackwell", "Claude 3.5 Sonnet", "AGI Regulations"];
  });

  // Sidebar selector tabs
  const [sidebarTab, setSidebarTab] = useState<'outlook' | 'radar' | 'voice' | 'chat' | 'workspace'>('chat');

  // --- Full-Stack Firebase States ---
  const [currentUser, setCurrentUser] = useState<any>(() => {
    if (typeof window !== "undefined" && localStorage.getItem('aix-sandbox-mode') === 'true') {
      try {
        const savedUser = localStorage.getItem('aix-sandbox-user');
        return savedUser ? JSON.parse(savedUser) : {
          uid: "sandbox-guest",
          email: "sandbox@aix.local",
          displayName: "Sandbox Explorer",
          isAnonymous: true
        };
      } catch (_) {
        return {
          uid: "sandbox-guest",
          email: "sandbox@aix.local",
          displayName: "Sandbox Explorer",
          isAnonymous: true
        };
      }
    }
    return null;
  });

  const enableSandboxMode = (displayName?: string) => {
    const sandboxUser = {
      uid: "sandbox-guest-" + Math.random().toString(36).substring(2, 9),
      email: "sandbox@aix.local",
      displayName: displayName || "Sandbox Explorer",
      isAnonymous: true
    };
    localStorage.setItem('aix-sandbox-mode', 'true');
    localStorage.setItem('aix-sandbox-user', JSON.stringify(sandboxUser));
    setCurrentUser(sandboxUser);
    setIsAuthModalOpen(false);
    setAuthError(null);
    setToast("Entered local offline Sandbox Mode!");
  };

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<React.ReactNode | null>(null);
  const [userNotes, setUserNotes] = useState<Record<string, string>>(() => {
    const saved = localStorage.getItem('aix-notes');
    return saved ? JSON.parse(saved) : {};
  });

  // --- Workspace & Speculations States ---
  const [workspaceSubTab, setWorkspaceSubTab] = useState<'briefing' | 'speculations' | 'reading'>('briefing');
  const [briefingMarkdown, setBriefingMarkdown] = useState<string | null>(null);
  const [briefingLoading, setBriefingLoading] = useState(false);
  const [savedBriefings, setSavedBriefings] = useState<any[]>([]);
  const [speculations, setSpeculations] = useState<any[]>([]);
  const [speculationTitle, setSpeculationTitle] = useState("");
  const [speculationCategory, setSpeculationCategory] = useState("Models");
  const [speculationContent, setSpeculationContent] = useState("");
  const [speculationLoading, setSpeculationLoading] = useState(false);

  const saveUserDataToFirestore = async (updatedFields: { bookmarks?: string[], followedCategories?: string[], notes?: Record<string, string>, viewedTabs?: Record<string, string[]>, readArticles?: string[] }) => {
    if (localStorage.getItem('aix-sandbox-mode') === 'true') return;
    if (!auth.currentUser) return;
    try {
      const userDocRef = doc(db, `users/${auth.currentUser.uid}/preferences/userData`);
      await setDoc(userDocRef, updatedFields, { merge: true });
    } catch (err) {
      console.error("Error saving user data to Firestore:", err);
    }
  };

  const fetchUserData = async (uid: string) => {
    try {
      // 1. Fetch user bookmarks and preferences
      const userDocRef = doc(db, `users/${uid}/preferences/userData`);
      const snapshot = await getDoc(userDocRef);
      if (snapshot.exists()) {
        const data = snapshot.data();
        if (data.bookmarks) setBookmarks(data.bookmarks);
        if (data.followedCategories) setFollowedCategories(data.followedCategories);
        if (data.notes) setUserNotes(data.notes);
        if (data.viewedTabs) {
          setViewedTabs(data.viewedTabs);
          localStorage.setItem('aix-viewed-tabs', JSON.stringify(data.viewedTabs));
        }
        if (data.readArticles) {
          setReadArticles(data.readArticles);
          localStorage.setItem('aix-read-articles', JSON.stringify(data.readArticles));
        }
      } else {
        // Create initial document using current state so user doesn't lose local data
        const initialData = {
          bookmarks,
          followedCategories,
          notes: userNotes,
          viewedTabs,
          readArticles
        };
        await setDoc(userDocRef, initialData);
      }

      // 2. Fetch saved chat history if any
      const chatDocRef = doc(db, `users/${uid}/preferences/chat`);
      const chatSnapshot = await getDoc(chatDocRef);
      if (chatSnapshot.exists()) {
        const chatData = chatSnapshot.data();
        if (chatData.history) {
          setChatHistory(chatData.history);
        }
      }
    } catch (err) {
      console.error("Error fetching user data from Firestore:", err);
    }
  };

  // Auth subscription & global mounting triggers
  useEffect(() => {
    if (localStorage.getItem('aix-sandbox-mode') === 'true') {
      const sandboxChat = localStorage.getItem('aix-sandbox-chat');
      if (sandboxChat) {
        setChatHistory(JSON.parse(sandboxChat));
      }
      fetchSavedBriefings("sandbox-guest");
    }
    fetchSpeculations();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (localStorage.getItem('aix-sandbox-mode') === 'true') {
        return;
      }
      setCurrentUser(user);
      if (user) {
        await fetchUserData(user.uid);
        await fetchSavedBriefings(user.uid);
      } else {
        setUserNotes({});
        setSavedBriefings([]);
        const savedB = localStorage.getItem('aix-bookmarks');
        setBookmarks(savedB ? JSON.parse(savedB) : []);
        const savedC = localStorage.getItem('aix-followed-categories');
        setFollowedCategories(savedC ? JSON.parse(savedC) : ["Models", "Hardware", "Regulation"]);
        const savedT = localStorage.getItem('aix-viewed-tabs');
        setViewedTabs(savedT ? JSON.parse(savedT) : {});
      }
    });
    return () => unsubscribe();
  }, []);

  // Trigger Gemini diagnostic on load
  useEffect(() => {
    runGeminiDiagnostic();
  }, []);

  // Save chat to Firestore on changes
  useEffect(() => {
    if (!currentUser) return;
    if (localStorage.getItem('aix-sandbox-mode') === 'true') {
      localStorage.setItem('aix-sandbox-chat', JSON.stringify(chatHistory));
      return;
    }
    const saveChat = async () => {
      try {
        const userDocRef = doc(db, `users/${currentUser.uid}/preferences/chat`);
        await setDoc(userDocRef, { history: chatHistory });
      } catch (err) {
        console.error("Error saving chat history to Firestore:", err);
      }
    };
    if (chatHistory.length > 1) {
      saveChat();
    }
  }, [chatHistory, currentUser]);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError(null);
    try {
      if (authMode === 'login') {
        await signInWithEmailAndPassword(auth, authEmail, authPassword);
        setToast("Logged in successfully!");
      } else {
        const credential = await createUserWithEmailAndPassword(auth, authEmail, authPassword);
        const displayName = authEmail.split('@')[0];
        await updateProfile(credential.user, { displayName });
        setToast("Workspace profile created successfully!");
      }
      setIsAuthModalOpen(false);
      setAuthEmail("");
      setAuthPassword("");
    } catch (err: any) {
      console.error("Auth error:", err);
      let friendlyMessage: React.ReactNode = err.message || "An error occurred during authentication.";
      if (err.code === 'auth/wrong-password') {
        friendlyMessage = "Incorrect password. Please try again.";
      } else if (err.code === 'auth/user-not-found') {
        friendlyMessage = "No account found with this email.";
      } else if (err.code === 'auth/email-already-in-use') {
        friendlyMessage = "This email address is already in use.";
      } else if (err.code === 'auth/weak-password') {
        friendlyMessage = "Password should be at least 6 characters.";
      } else if (err.code === 'auth/operation-not-allowed') {
        friendlyMessage = "Email/Password sign-in is disabled in your Firebase console. Please go to your Firebase Console under Authentication -> Sign-in method and enable the Email/Password provider.";
      } else if (err.code === 'auth/unauthorized-domain' || (err.message && err.message.includes('unauthorized-domain'))) {
        friendlyMessage = (
          <div className="space-y-3 text-left">
            <p className="font-bold text-rose-300">Firebase Error: Unauthorized Domain (Blocked by 2SV)</p>
            <p className="text-[11px] leading-relaxed text-neutral-300">
              If you can't access Firebase Console to authorize this domain (due to Two-Step Verification or other blocks), you can bypass Firebase entirely:
            </p>
            <button
              type="button"
              onClick={() => enableSandboxMode(authEmail ? authEmail.split('@')[0] : "Sandbox Explorer")}
              className="w-full py-2.5 px-4 rounded-xl bg-[#5194ec] hover:bg-blue-500 text-neutral-950 font-bold text-xs uppercase tracking-wide cursor-pointer text-center block transition-all"
            >
              🚀 Bypass & Enter via Local Sandbox Mode
            </button>
            <div className="pt-2 border-t border-neutral-900">
              <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider mb-1">To connect Firebase instead:</p>
              <ol className="list-decimal pl-4 text-[10px] space-y-1 text-neutral-400 font-sans">
                <li>Open your <a href="https://console.firebase.google.com/" target="_blank" rel="noopener noreferrer" className="text-blue-400 underline hover:text-blue-300">Firebase Console</a></li>
                <li>Go to <strong className="text-neutral-200">Authentication</strong> &rarr; <strong className="text-neutral-200">Settings</strong> tab</li>
                <li>Under <strong className="text-neutral-200">Authorized domains</strong>, click <strong className="text-neutral-200">Add domain</strong></li>
                <li>Add: <code className="bg-neutral-900 px-1 py-0.5 rounded text-rose-300 font-mono text-[10px] select-all border border-neutral-800">{window.location.hostname}</code></li>
              </ol>
            </div>
          </div>
        );
      } else {
        friendlyMessage = (
          <div className="space-y-3 text-left">
            <p className="text-neutral-300">{err.message || "An error occurred during authentication."}</p>
            <button
              type="button"
              onClick={() => enableSandboxMode(authEmail ? authEmail.split('@')[0] : "Sandbox Explorer")}
              className="w-full py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wide cursor-pointer text-center block transition-all"
            >
              🚀 Bypass: Switch to Local Sandbox Mode
            </button>
          </div>
        );
      }
      setAuthError(friendlyMessage);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      await signInAnonymously(auth);
      setToast("Signed in with Guest Access!");
      setIsAuthModalOpen(false);
    } catch (err: any) {
      console.error("Guest login error:", err);
      let friendlyMessage: React.ReactNode = err.message || "Failed to sign in as guest.";
      if (err.code === 'auth/operation-not-allowed') {
        friendlyMessage = (
          <div className="space-y-3 text-left">
            <p className="text-neutral-300">Anonymous guest sign-in is disabled in your Firebase console.</p>
            <button
              type="button"
              onClick={() => enableSandboxMode("Sandbox Explorer")}
              className="w-full py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wide cursor-pointer text-center block transition-all"
            >
              🚀 Bypass: Switch to Local Sandbox Mode
            </button>
          </div>
        );
      } else if (err.code === 'auth/unauthorized-domain' || (err.message && err.message.includes('unauthorized-domain'))) {
        friendlyMessage = (
          <div className="space-y-3 text-left">
            <p className="font-bold text-rose-300">Firebase Error: Unauthorized Domain (Blocked by 2SV)</p>
            <p className="text-[11px] leading-relaxed text-neutral-300">
              If you can't access Firebase Console to authorize this domain (due to Two-Step Verification or other blocks), you can bypass Firebase entirely:
            </p>
            <button
              type="button"
              onClick={() => enableSandboxMode("Sandbox Explorer")}
              className="w-full py-2.5 px-4 rounded-xl bg-[#5194ec] hover:bg-blue-500 text-neutral-950 font-bold text-xs uppercase tracking-wide cursor-pointer text-center block transition-all"
            >
              🚀 Bypass & Enter via Local Sandbox Mode
            </button>
            <div className="pt-2 border-t border-neutral-900">
              <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider mb-1">To connect Firebase instead:</p>
              <ol className="list-decimal pl-4 text-[10px] space-y-1 text-neutral-400 font-sans">
                <li>Open your <a href="https://console.firebase.google.com/" target="_blank" rel="noopener noreferrer" className="text-blue-400 underline hover:text-blue-300">Firebase Console</a></li>
                <li>Go to <strong className="text-neutral-200">Authentication</strong> &rarr; <strong className="text-neutral-200">Settings</strong> tab</li>
                <li>Under <strong className="text-neutral-200">Authorized domains</strong>, click <strong className="text-neutral-200">Add domain</strong></li>
                <li>Add: <code className="bg-neutral-900 px-1 py-0.5 rounded text-rose-300 font-mono text-[10px] select-all border border-neutral-800">{window.location.hostname}</code></li>
              </ol>
            </div>
          </div>
        );
      } else {
        friendlyMessage = (
          <div className="space-y-3 text-left">
            <p className="text-neutral-300">{err.message || "Failed to sign in."}</p>
            <button
              type="button"
              onClick={() => enableSandboxMode("Sandbox Explorer")}
              className="w-full py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wide cursor-pointer text-center block transition-all"
            >
              🚀 Bypass: Switch to Local Sandbox Mode
            </button>
          </div>
        );
      }
      setAuthError(friendlyMessage);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      setToast("Signed in successfully with Google!");
      setIsAuthModalOpen(false);
    } catch (err: any) {
      console.error("Google login error:", err);
      if (err.code === 'auth/popup-blocked') {
        setAuthError("Sign-in popup was blocked by your browser. Please allow popups for this site and try again.");
      } else if (err.code === 'auth/unauthorized-domain' || (err.message && err.message.includes('unauthorized-domain'))) {
        setAuthError(
          <div className="space-y-3 text-left">
            <p className="font-bold text-rose-300">Firebase Error: Unauthorized Domain (Blocked by 2SV)</p>
            <p className="text-[11px] leading-relaxed text-neutral-300">
              If you can't access Firebase Console to authorize this domain (due to Two-Step Verification or other blocks), you can bypass Firebase entirely:
            </p>
            <button
              type="button"
              onClick={() => enableSandboxMode("Sandbox Explorer")}
              className="w-full py-2.5 px-4 rounded-xl bg-[#5194ec] hover:bg-blue-500 text-neutral-950 font-bold text-xs uppercase tracking-wide cursor-pointer text-center block transition-all"
            >
              🚀 Bypass & Enter via Local Sandbox Mode
            </button>
            <div className="pt-2 border-t border-neutral-900">
              <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider mb-1">To connect Firebase instead:</p>
              <ol className="list-decimal pl-4 text-[10px] space-y-1 text-neutral-400 font-sans">
                <li>Open your <a href="https://console.firebase.google.com/" target="_blank" rel="noopener noreferrer" className="text-blue-400 underline hover:text-blue-300">Firebase Console</a></li>
                <li>Go to <strong className="text-neutral-200">Authentication</strong> &rarr; <strong className="text-neutral-200">Settings</strong> tab</li>
                <li>Under <strong className="text-neutral-200">Authorized domains</strong>, click <strong className="text-neutral-200">Add domain</strong></li>
                <li>Add: <code className="bg-neutral-900 px-1 py-0.5 rounded text-rose-300 font-mono text-[10px] select-all border border-neutral-800">{window.location.hostname}</code></li>
              </ol>
            </div>
          </div>
        );
      } else {
        setAuthError(
          <div className="space-y-3 text-left">
            <p className="text-neutral-300">{err.message || "Failed to sign in with Google."}</p>
            <button
              type="button"
              onClick={() => enableSandboxMode("Sandbox Explorer")}
              className="w-full py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wide cursor-pointer text-center block transition-all"
            >
              🚀 Bypass: Switch to Local Sandbox Mode
            </button>
          </div>
        );
      }
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      if (localStorage.getItem('aix-sandbox-mode') === 'true') {
        localStorage.removeItem('aix-sandbox-mode');
        localStorage.removeItem('aix-sandbox-user');
        setCurrentUser(null);
        setUserNotes({});
        setSavedBriefings([]);
        const savedB = localStorage.getItem('aix-bookmarks');
        setBookmarks(savedB ? JSON.parse(savedB) : []);
        setToast("Signed out from local sandbox.");
        return;
      }
      await signOut(auth);
      setToast("Signed out from workspace.");
    } catch (err) {
      console.error("Sign out error:", err);
    }
  };

  const handleSaveNote = async (url: string, text: string) => {
    const nextNotes = { ...userNotes, [url]: text };
    setUserNotes(nextNotes);
    setToast("Saving research note...");
    if (currentUser && localStorage.getItem('aix-sandbox-mode') !== 'true') {
      await saveUserDataToFirestore({ notes: nextNotes });
      setToast("Research note saved to Cloud!");
    } else {
      localStorage.setItem('aix-notes', JSON.stringify(nextNotes));
      setToast("Note saved locally!");
    }
  };

  // --- Workspace & Speculations Functions ---
  const fetchSavedBriefings = async (uid: string) => {
    if (localStorage.getItem('aix-sandbox-mode') === 'true') {
      const saved = localStorage.getItem('aix-sandbox-briefings');
      setSavedBriefings(saved ? JSON.parse(saved) : []);
      return;
    }
    try {
      const q = query(collection(db, 'users', uid, 'briefings'));
      const snapshot = await getDocs(q);
      const list = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      // Sort locally by createdAt descending
      list.sort((a: any, b: any) => (b.createdAt || 0) - (a.createdAt || 0));
      setSavedBriefings(list);
    } catch (err) {
      console.error("Error fetching briefings:", err);
    }
  };

  const saveBriefingToCloud = async () => {
    if (!currentUser || !briefingMarkdown) return;
    setToast("Saving briefing...");
    if (localStorage.getItem('aix-sandbox-mode') === 'true') {
      const saved = localStorage.getItem('aix-sandbox-briefings');
      const briefings = saved ? JSON.parse(saved) : [];
      const newBriefing = {
        id: "briefing-" + Date.now(),
        markdown: briefingMarkdown,
        createdAt: Date.now()
      };
      const updated = [newBriefing, ...briefings];
      localStorage.setItem('aix-sandbox-briefings', JSON.stringify(updated));
      setSavedBriefings(updated);
      setToast("Briefing securely saved to local Sandbox!");
      return;
    }
    try {
      const colRef = collection(db, 'users', currentUser.uid, 'briefings');
      await addDoc(colRef, {
        markdown: briefingMarkdown,
        createdAt: Date.now()
      });
      setToast("Briefing securely saved to Cloud!");
      fetchSavedBriefings(currentUser.uid);
    } catch (err) {
      console.error("Error saving briefing:", err);
      setToast("Failed to save briefing to Cloud.");
    }
  };

  const deleteBriefingFromCloud = async (id: string) => {
    if (!currentUser) return;
    setToast("Deleting briefing...");
    if (localStorage.getItem('aix-sandbox-mode') === 'true') {
      const saved = localStorage.getItem('aix-sandbox-briefings');
      const briefings = saved ? JSON.parse(saved) : [];
      const updated = briefings.filter((b: any) => b.id !== id);
      localStorage.setItem('aix-sandbox-briefings', JSON.stringify(updated));
      setSavedBriefings(updated);
      setToast("Briefing deleted from local Sandbox.");
      return;
    }
    try {
      const docRef = doc(db, 'users', currentUser.uid, 'briefings', id);
      await deleteDoc(docRef);
      setToast("Briefing deleted.");
      fetchSavedBriefings(currentUser.uid);
    } catch (err) {
      console.error("Error deleting briefing:", err);
      setToast("Failed to delete briefing.");
    }
  };

  const generateCustomBriefing = async () => {
    setBriefingLoading(true);
    setToast("Architecting custom AI briefing...");
    try {
      // Find full bookmarked item details
      const bookmarkedItems = news.filter(item => bookmarks.includes(item.url));
      
      const res = await fetch("/api/generate-briefing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookmarks: bookmarkedItems,
          followedCategories
        })
      });
      const data = await res.json();
      setBriefingMarkdown(data.markdown || "");
      setToast("Intelligence briefing generated!");
    } catch (err) {
      console.error("Error generating briefing:", err);
      setToast("Failed to generate custom briefing.");
    } finally {
      setBriefingLoading(false);
    }
  };

  const fetchSpeculations = async () => {
    if (localStorage.getItem('aix-sandbox-mode') === 'true') {
      const localSpecs = localStorage.getItem('aix-sandbox-speculations');
      if (localSpecs) {
        setSpeculations(JSON.parse(localSpecs));
        return;
      }
    }
    try {
      const q = query(collection(db, 'community_speculations'));
      const snapshot = await getDocs(q);
      const list = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      // Sort locally by createdAt descending
      list.sort((a: any, b: any) => (b.createdAt || 0) - (a.createdAt || 0));
      setSpeculations(list);
    } catch (err) {
      console.error("Error fetching speculations from Firestore:", err);
      // Fallback to local speculations
      const localSpecs = localStorage.getItem('aix-sandbox-speculations');
      if (localSpecs) {
        setSpeculations(JSON.parse(localSpecs));
      } else {
        const mockSpecs = [
          {
            id: "spec-1",
            title: "AGI will be achieved with multi-agent consensus before 2028",
            category: "Models",
            content: "Given the trajectory of recursive self-improvement and localized agent networks (like the ones TSMC 2nm chips will optimize), reasoning models will cross the zero-shot human evaluation threshold in the next 18 months.",
            authorId: "anonymous",
            authorName: "SiliconOptimist",
            createdAt: Date.now() - 3600000 * 2,
            likes: ["sandbox-guest"],
            likesCount: 1
          },
          {
            id: "spec-2",
            title: "US will subsidize 100% clean power grids for sovereign compute nodes",
            category: "Regulation",
            content: "As energy requirements skyrocket for large-scale training clusters (like Blackwell B200 arrays), federal regulators will offer complete carbon offset tax credits to build dedicated next-gen nuclear plants.",
            authorId: "anonymous2",
            authorName: "GridArchitect",
            createdAt: Date.now() - 3600000 * 24,
            likes: [],
            likesCount: 0
          }
        ];
        localStorage.setItem('aix-sandbox-speculations', JSON.stringify(mockSpecs));
        setSpeculations(mockSpecs);
      }
    }
  };

  const handlePostSpeculation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      setToast("Please sign in to publish speculations.");
      return;
    }
    if (!speculationTitle.trim() || !speculationContent.trim()) {
      setToast("Please fill out all fields.");
      return;
    }
    setSpeculationLoading(true);
    setToast("Publishing speculation...");

    if (localStorage.getItem('aix-sandbox-mode') === 'true') {
      const saved = localStorage.getItem('aix-sandbox-speculations');
      const specs = saved ? JSON.parse(saved) : [];
      const newSpec = {
        id: "spec-" + Date.now(),
        title: speculationTitle,
        category: speculationCategory,
        content: speculationContent,
        authorId: currentUser.uid,
        authorName: currentUser.displayName || currentUser.email?.split('@')[0] || "Sandbox Explorer",
        createdAt: Date.now(),
        likes: [],
        likesCount: 0
      };
      const updated = [newSpec, ...specs];
      localStorage.setItem('aix-sandbox-speculations', JSON.stringify(updated));
      setSpeculations(updated);
      setSpeculationTitle("");
      setSpeculationContent("");
      setToast("Speculation live on local Sandbox stream!");
      setSpeculationLoading(false);
      return;
    }

    try {
      await addDoc(collection(db, 'community_speculations'), {
        title: speculationTitle,
        category: speculationCategory,
        content: speculationContent,
        authorId: currentUser.uid,
        authorName: currentUser.displayName || currentUser.email?.split('@')[0] || "Anonymous Developer",
        createdAt: Date.now(),
        likes: [],
        likesCount: 0
      });
      setSpeculationTitle("");
      setSpeculationContent("");
      setToast("Speculation live on public stream!");
      fetchSpeculations();
    } catch (err) {
      console.error("Error publishing speculation:", err);
      setToast("Failed to publish speculation.");
    } finally {
      setSpeculationLoading(false);
    }
  };

  const handleLikeSpeculation = async (id: string, currentLikes: string[] = []) => {
    if (!currentUser) {
      setToast("Sign in to upvote speculations.");
      return;
    }
    const uid = currentUser.uid;
    const isLiked = currentLikes.includes(uid);
    const nextLikes = isLiked 
      ? currentLikes.filter(l => l !== uid)
      : [...currentLikes, uid];

    if (localStorage.getItem('aix-sandbox-mode') === 'true') {
      const saved = localStorage.getItem('aix-sandbox-speculations');
      const specs = saved ? JSON.parse(saved) : [];
      const updated = specs.map((item: any) => {
        if (item.id === id) {
          return { ...item, likes: nextLikes, likesCount: nextLikes.length };
        }
        return item;
      });
      localStorage.setItem('aix-sandbox-speculations', JSON.stringify(updated));
      setSpeculations(updated);
      setToast(isLiked ? "Upvote removed." : "Speculation upvoted!");
      return;
    }
    
    try {
      const docRef = doc(db, 'community_speculations', id);
      await updateDoc(docRef, {
        likes: nextLikes,
        likesCount: nextLikes.length
      });
      // Update local state reactively
      setSpeculations(prev => prev.map(item => {
        if (item.id === id) {
          return { ...item, likes: nextLikes, likesCount: nextLikes.length };
        }
        return item;
      }));
    } catch (err) {
      console.error("Error updating likes:", err);
    }
  };

  const triggerToast = (msg: string) => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToast(msg);
    toastTimeoutRef.current = setTimeout(() => setToast(null), 3000);
  };

  const handleCopyLink = async (url: string, title: string) => {
    try {
      await navigator.clipboard.writeText(url);
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
      setToast(`Copied article link to clipboard!`);
      toastTimeoutRef.current = setTimeout(() => setToast(null), 2500);
    } catch (err) {
      console.error("Failed to copy link: ", err);
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
      setToast("Failed to copy link using Clipboard API.");
      toastTimeoutRef.current = setTimeout(() => setToast(null), 3000);
    }
  };

  const toggleBookmark = (url: string) => {
    setBookmarks(prev => {
      const next = prev.includes(url) ? prev.filter(b => b !== url) : [...prev, url];
      localStorage.setItem('aix-bookmarks', JSON.stringify(next));
      setToast(prev.includes(url) ? "Removed from bookmarks." : "Saved to bookmarks!");
      if (auth.currentUser) {
        saveUserDataToFirestore({ bookmarks: next });
      }
      return next;
    });
  };

  const markAsRead = (url: string) => {
    setReadArticles(prev => {
      if (prev.includes(url)) return prev;
      const next = [...prev, url];
      localStorage.setItem('aix-read-articles', JSON.stringify(next));
      if (auth.currentUser) {
        saveUserDataToFirestore({ readArticles: next });
      }
      return next;
    });
  };

  const toggleReadStatus = (url: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    setReadArticles(prev => {
      const isRead = prev.includes(url);
      const next = isRead ? prev.filter(u => u !== url) : [...prev, url];
      localStorage.setItem('aix-read-articles', JSON.stringify(next));
      setToast(isRead ? "Marked as unread." : "Marked as read.");
      if (auth.currentUser) {
        saveUserDataToFirestore({ readArticles: next });
      }
      return next;
    });
  };

  const toggleFollowCategory = (cat: string) => {
    setFollowedCategories(prev => {
      const next = prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat];
      localStorage.setItem('aix-followed-categories', JSON.stringify(next));
      if (auth.currentUser) {
        saveUserDataToFirestore({ followedCategories: next });
      }
      return next;
    });
  };

  const handleAddNoteFromCopilot = (noteData: { title: string; content: string; tags: string[] }) => {
    const savedLocal = localStorage.getItem('aix-workspace-v1');
    let currentWorkspace: any = {
      collections: [],
      notes: [],
      projects: [],
      reminders: [],
      activities: [],
      updatedAt: Date.now()
    };
    
    if (savedLocal) {
      try {
        currentWorkspace = JSON.parse(savedLocal);
      } catch (e) {
        console.error("Failed to parse workspace state", e);
      }
    }
    
    const newNote = {
      id: `note-${Date.now()}`,
      title: noteData.title,
      content: noteData.content,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: noteData.tags || ['Copilot'],
      pinned: false,
      favorite: false
    };
    
    currentWorkspace.notes = [newNote, ...(currentWorkspace.notes || [])];
    currentWorkspace.updatedAt = Date.now();
    
    localStorage.setItem('aix-workspace-v1', JSON.stringify(currentWorkspace));
    setToast("Insight saved to Workspace Notes!");
  };

  // Keyboard Shortcuts Hook
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check if user is typing in inputs
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') {
        return;
      }
      const key = e.key.toLowerCase();
      
      // Support Cmd+K / Ctrl+K or 's' or '/' for spotlight search
      if ((key === 'k' && (e.metaKey || e.ctrlKey)) || key === 's' || key === '/') {
        e.preventDefault();
        setIsSearchPaletteOpen(true);
      } else if (key === 'r') {
        e.preventDefault();
        fetchNewsAndInsights();
      } else if (key === 'b') {
        e.preventDefault();
        setActiveCategory('Bookmarks');
      } else if (key === 'k' && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        setIsShortcutModalOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Synchronize URL routing for direct research, workspace, and community page access
  useEffect(() => {
    const handleUrlRoute = () => {
      const path = window.location.pathname;
      if (path === '/benchmarks') {
        setIsBenchmarksPage(true);
        setIsWorkspacePage(false);
        setCurrentCommunityPath(null);
      } else if (path === '/workspace') {
        setIsWorkspacePage(true);
        setIsBenchmarksPage(false);
        setCurrentCommunityPath(null);
      } else if (
        path === '/community' ||
        path === '/profile' ||
        path === '/discussions' ||
        path === '/collections' ||
        path === '/leaderboards' ||
        path === '/teams' ||
        path === '/admin'
      ) {
        setCurrentCommunityPath(path);
        setIsWorkspacePage(false);
        setIsBenchmarksPage(false);
      } else {
        setIsBenchmarksPage(false);
        setIsWorkspacePage(false);
        setCurrentCommunityPath(null);
      }

      const researchMatch = path.match(/^\/research\/([a-zA-Z0-9_-]+)/);
      if (researchMatch) {
        const slug = researchMatch[1];
        setActiveResearchSlug(slug);
      } else {
        setActiveResearchSlug(null);
      }
    };

    handleUrlRoute();
    window.addEventListener('popstate', handleUrlRoute);
    return () => window.removeEventListener('popstate', handleUrlRoute);
  }, []);

  const handleOpenResearchPage = (slug: string) => {
    setActiveResearchSlug(slug);
    window.history.pushState(null, '', `/research/${slug}`);
  };

  // Periodic Simulated Push alerts
  useEffect(() => {
    const alertTimer = setTimeout(() => {
      const randomAlert = REALTIME_ALERTS[Math.floor(Math.random() * REALTIME_ALERTS.length)];
      setPushAlert(randomAlert);

      // Play subtle electronic chime sound completely synthetically
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
        gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.6);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.6);
      } catch (err) {}
    }, 15000); // 15 seconds after launch

    return () => clearTimeout(alertTimer);
  }, []);

  // Auto Refresh ticking countdown
  useEffect(() => {
    if (!autoRefresh) return;
    setRefreshCountdown(180);
    const interval = setInterval(() => {
      setRefreshCountdown(prev => {
        if (prev <= 1) {
          fetchNewsAndInsights(currentQuery !== "latest artificial intelligence developments and tech announcements" ? currentQuery : undefined);
          return 180;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [autoRefresh, currentQuery]);

  // Translate Article on-the-fly
  const handleTranslateArticle = async (idx: number, title: string, summary: string, targetLang: string) => {
    if (targetLang === 'English') {
      setTranslatedArticles(prev => {
        const copy = { ...prev };
        delete copy[idx];
        return copy;
      });
      setActiveLanguages(prev => ({ ...prev, [idx]: 'English' }));
      return;
    }

    setTranslatingIndex(idx);
    setActiveLanguages(prev => ({ ...prev, [idx]: targetLang }));
    try {
      const resTitle = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: title, targetLang })
      });
      const dataTitle = await resTitle.json();

      const resSum = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: summary, targetLang })
      });
      const dataSum = await resSum.json();

      setTranslatedArticles(prev => ({
        ...prev,
        [idx]: {
          title: dataTitle.translatedText || title,
          summary: dataSum.translatedText || summary
        }
      }));
    } catch (err) {
      console.error("Failed to translate article:", err);
    } finally {
      setTranslatingIndex(null);
    }
  };

  // Expand and load summaries + timelines on demand
  const handleExpandArticle = async (idx: number, title: string, summary: string) => {
    if (activeArticleIndex === idx) {
      setActiveArticleIndex(null);
      return;
    }

    setActiveArticleIndex(idx);
    setActiveSummaryTab('takeaway');

    if (news[idx]) {
      markTabAsViewed(news[idx].url, 'takeaway');
      markAsRead(news[idx].url);
    }

    if (!articleSummaries[idx]) {
      setSummariesLoading(prev => ({ ...prev, [idx]: true }));
      try {
        const res = await fetch('/api/summarize', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, summary })
        });
        const data = await res.json();
        setArticleSummaries(prev => ({ ...prev, [idx]: data }));
      } catch (err) {
        console.error("Error generating summaries:", err);
      } finally {
        setSummariesLoading(prev => ({ ...prev, [idx]: false }));
      }
    }

    if (!articleTimelines[idx]) {
      setTimelinesLoading(prev => ({ ...prev, [idx]: true }));
      try {
        const res = await fetch('/api/timeline', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title })
        });
        const data = await res.json();
        setArticleTimelines(prev => ({ ...prev, [idx]: data.timeline }));
      } catch (err) {
        console.error("Error generating timeline:", err);
      } finally {
        setTimelinesLoading(prev => ({ ...prev, [idx]: false }));
      }
    }
  };

  // Connect article presets directly to sidebar assistant desk
  const handleCopilotPreset = (presetQuestion: string, articleTitle: string) => {
    const queryMessage = `Regarding the article "${articleTitle}": ${presetQuestion}`;
    setChatMessage(queryMessage);
    setSidebarTab('chat');
    document.getElementById('sidebar-tabs-container')?.scrollIntoView({ behavior: 'smooth' });
  };

  // Enrich news payload with scores, hubs, developing triggers deterministically
  const enrichNewsItems = (items: any[]) => {
    return items.map((item, idx) => {
      const charSum = item.title.charCodeAt(0) + item.title.charCodeAt(item.title.length - 1) || 100;
      const confidenceScore = 86 + (charSum % 14); // 86% to 99%
      const isDeveloping = idx % 3 === 0;
      const isVerified = confidenceScore > 90;
      const countriesList = ['US', 'GB', 'EU', 'TW', 'JP', 'KR', 'IN'];
      const countryCode = countriesList[charSum % countriesList.length];
      return {
        ...item,
        confidenceScore,
        isDeveloping,
        isVerified,
        countryCode,
        category: item.category || "Models"
      };
    });
  };

  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    };
  }, []);

  const scrollToStatsSection = () => {
    document.getElementById('stats-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToTop = () => {
    document.getElementById('app-frame')?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const fetchNewsAndInsights = async (searchVal?: string) => {
    setNewsLoading(true);
    setNewsError(null);
    setIsRateLimited(false);
    try {
      const q = searchVal || "latest artificial intelligence developments and tech announcements";
      const res = await fetch("/api/news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: q })
      });
      const data = await res.json();
      if (data.news) {
        const enriched = enrichNewsItems(data.news);
        setNews(enriched);
        setIsDemoMode(!!data.isDemo);
        if (data.isRateLimited) {
          setIsRateLimited(true);
        }
        
        // Fetch insights for this set of news
        setInsightsLoading(true);
        try {
          const insightRes = await fetch("/api/insights", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ newsItems: enriched })
          });
          const insightData = await insightRes.json();
          setInsights(insightData);
          if (insightData.isRateLimited) {
            setIsRateLimited(true);
          }
        } catch (err) {
          console.error("Error fetching insights:", err);
        } finally {
          setInsightsLoading(false);
        }
      } else {
        throw new Error(data.error || "Failed to fetch news feed");
      }
    } catch (err: any) {
      console.error(err);
      const errMsg = err.message || "";
      if (errMsg.includes("429") || errMsg.includes("quota") || errMsg.includes("503") || errMsg.includes("demand")) {
        setIsRateLimited(true);
      }
      setNewsError(err.message || "Something went wrong while connecting to the news server.");
    } finally {
      setNewsLoading(false);
    }
  };

  // Run initial fetch on mount
  useEffect(() => {
    fetchNewsAndInsights();
  }, []);

  // Scroll chatbot to end when messages update
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const queryToSearch = searchQuery.trim();
    if (queryToSearch) {
      setCurrentQuery(queryToSearch);
      fetchNewsAndInsights(queryToSearch);
      
      // Save to recent searches (keep unique, max 5)
      setRecentSearches(prev => {
        const filtered = prev.filter(q => q.toLowerCase() !== queryToSearch.toLowerCase());
        const next = [queryToSearch, ...filtered].slice(0, 5);
        localStorage.setItem('aix-recent-searches', JSON.stringify(next));
        return next;
      });
      setIsSearchPaletteOpen(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim() || chatLoading) return;

    const userMsg = chatMessage;
    setChatMessage("");
    setChatHistory(prev => [...prev, { role: 'user', text: userMsg }]);
    setChatLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg })
      });
      const data = await res.json();
      setChatHistory(prev => [...prev, {
        role: 'assistant',
        text: data.text,
        sources: data.sources || []
      }]);
    } catch (err) {
      console.error(err);
      setChatHistory(prev => [...prev, {
        role: 'assistant',
        text: "I was unable to search for that. Please check if the server is responsive.",
        sources: []
      }]);
    } finally {
      setChatLoading(false);
    }
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    if (scrollTop > 120) {
      setShowFullNav(false);
    } else {
      setShowFullNav(true);
    }
  };

  // High-fidelity profile avatars from Unsplash
  const avatars = [
    {
      url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120&h=120',
      alt: 'User Avatar 1',
    },
    {
      url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120&h=120',
      alt: 'User Avatar 2',
    },
    {
      url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=120&h=120',
      alt: 'User Avatar 3',
    },
  ];

  const filteredNews = news.filter((item) => {
    if (activeCategory === "Bookmarks") {
      if (!bookmarks.includes(item.url)) return false;
    } else {
      const matchesCategory = activeCategory === "All" || item.category === activeCategory;
      if (!matchesCategory) return false;
    }
    
    // Date range filtering
    if (dateFilter !== 'all') {
      const itemDate = item.date ? new Date(item.date) : null;
      if (itemDate && !isNaN(itemDate.getTime())) {
        // July 15, 2026 is our standard system baseline date
        const refDate = new Date("2026-07-15T00:00:00-07:00");
        const diffTime = refDate.getTime() - itemDate.getTime();
        const diffDays = diffTime / (1000 * 60 * 60 * 24);
        
        if (dateFilter === '30days' && diffDays > 30) return false;
        if (dateFilter === '3months' && diffDays > 90) return false;
        if (dateFilter === '5months' && diffDays > 150) return false;
      }
    }
    
    const matchesCountry = !selectedCountry || item.countryCode === selectedCountry;
    return matchesCountry;
  });

  const navigationItems = [
    'News Hub',
    'AI Search',
    'Benchmarks',
    'Workspace',
    'Community',
    'Assistant',
  ];

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-[#020202] text-white' : 'bg-[#f4f6f8] text-neutral-900'} font-sans flex items-center justify-center p-3 sm:p-5 md:p-8 overflow-x-hidden relative bg-dots transition-colors duration-300`}>
      {/* Dynamic Cosmic Background Glows */}
      {theme === 'dark' && (
        <>
          <div className="absolute top-[20%] right-[10%] w-[350px] h-[350px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none z-0" />
          <div className="absolute bottom-[10%] left-[5%] w-[300px] h-[300px] bg-[#5194ec]/5 rounded-full blur-[100px] pointer-events-none z-0" />
        </>
      )}

      {/* Main Container mimicking the framed visual in the reference */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        id="app-frame"
        onScroll={handleScroll}
        className={`w-full max-w-[1440px] h-[90vh] ${theme === 'dark' ? 'bg-transparent border-neutral-900' : 'bg-white border-neutral-200'} border rounded-[32px] flex flex-col relative overflow-y-auto overflow-x-hidden z-10 shadow-[0_40px_120px_rgba(0,0,0,0.95)] scroll-smooth`}
      >
        {/* Absolute Background Video */}
        {theme === 'dark' && (
          <div className="sticky top-0 left-0 right-0 h-0 w-full z-0 overflow-visible select-none pointer-events-none">
            <div className="absolute top-0 left-0 w-full h-[90vh] overflow-hidden">
              <video
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover scale-[1.02] filter brightness-[0.88] contrast-[1.05]"
              >
                <source src="https://res.cloudinary.com/domfxatlx/video/upload/v1782628096/kling_20260628_Image_to_Video__3654_0_h4jqpl.mp4" type="video/mp4" />
              </video>
              {/* Vignette & Gradient Overlays for peak contrast and readability */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#020202]/95 via-[#020202]/50 to-transparent z-1" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#020202]/60 via-transparent to-[#020202]/40 z-1" />
            </div>
          </div>
        )}

        {/* Subtle top glare line */}
        <div className={`absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-${theme === 'dark' ? 'neutral-800' : 'neutral-200'} to-transparent pointer-events-none`} />

        {/* 1. HEADER */}
        <header id="app-header" className={`flex items-center justify-between px-6 py-5 md:px-12 md:py-5 sticky top-0 z-50 backdrop-blur-md ${theme === 'dark' ? 'bg-[#020202]/30 border-b border-neutral-900/20' : 'bg-white/70 border-b border-neutral-200/50'}`}>
          {/* Logo */}
          <div id="logo-container" className="flex items-center cursor-pointer font-sans select-none" onClick={scrollToTop}>
            <span className={`font-display font-bold text-2xl tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>AI</span>
            <span className="font-display font-semibold text-2xl tracking-tight bg-gradient-to-r from-[#5194ec] to-[#91bdfa] bg-clip-text text-transparent ml-1 text-glow">X</span>
            <span className="text-[10px] font-bold font-mono tracking-widest ml-2.5 border border-emerald-500/20 px-2 py-0.5 rounded bg-emerald-500/5 text-emerald-400 uppercase flex items-center gap-1.5 shadow-[0_0_12px_rgba(16,185,129,0.15)] select-none whitespace-nowrap">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
              </span>
              <span className="hidden sm:inline">Live Intel</span>
            </span>
          </div>

          {/* Desktop Navigation Menu (Glassmorphism Pill) */}
          <div className="hidden lg:flex items-center justify-center flex-grow max-w-2xl mx-auto px-4">
            <AnimatePresence mode="wait">
              {showFullNav ? (
                <motion.nav
                  key="full-nav"
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  id="desktop-nav"
                  className={`flex items-center gap-4 xl:gap-8 px-6 xl:px-8 py-2 rounded-full border ${theme === 'dark' ? 'bg-neutral-950/45 border-neutral-900/80' : 'bg-neutral-50 border-neutral-200'} backdrop-blur-xl shadow-inner`}
                >
                  {navigationItems.map((item) => (
                    <a
                      key={item}
                      href={item === 'Benchmarks' ? '/benchmarks' : item === 'Workspace' ? '/workspace' : item === 'Community' ? '/community' : `#${item.toLowerCase().replace(' ', '-')}`}
                      onClick={(e) => {
                        e.preventDefault();
                        if (item === 'Benchmarks') {
                          setIsBenchmarksPage(true);
                          setIsWorkspacePage(false);
                          setCurrentCommunityPath(null);
                          window.history.pushState(null, '', '/benchmarks');
                        } else if (item === 'Workspace') {
                          setIsWorkspacePage(true);
                          setIsBenchmarksPage(false);
                          setCurrentCommunityPath(null);
                          window.history.pushState(null, '', '/workspace');
                        } else if (item === 'Community') {
                          setCurrentCommunityPath('/community');
                          setIsWorkspacePage(false);
                          setIsBenchmarksPage(false);
                          window.history.pushState(null, '', '/community');
                        } else {
                          scrollToStatsSection();
                        }
                      }}
                      className={`text-xs font-semibold ${theme === 'dark' ? 'text-neutral-400 hover:text-white' : 'text-neutral-500 hover:text-neutral-950'} transition-colors duration-200`}
                    >
                      {item}
                    </a>
                  ))}
                </motion.nav>
              ) : (
                <motion.button
                  key="home-icon"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                  onClick={scrollToTop}
                  className={`flex items-center justify-center p-2.5 rounded-full border ${theme === 'dark' ? 'border-neutral-800 bg-neutral-950/65 hover:bg-neutral-900 text-neutral-300 hover:text-white' : 'border-neutral-200 bg-neutral-50 text-slate-700 hover:text-slate-900'} transition-all duration-300 cursor-pointer shadow-sm hover:shadow-blue-500/5 active:scale-95`}
                  title="Go to Home"
                >
                  <Home className="w-4 h-4" />
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          {/* Desktop Right Button */}
          <div id="header-cta" className="hidden lg:flex items-center gap-2 xl:gap-3.5 min-w-[120px] justify-end">
            <button
              onClick={() => setIsGeminiDiagnosticModalOpen(true)}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-xl border ${theme === 'dark' ? 'border-neutral-800 bg-neutral-950/40 text-neutral-300 hover:text-white' : 'border-neutral-200 bg-neutral-50 text-slate-600 hover:bg-neutral-100'} transition-all cursor-pointer active:scale-95`}
              title="Verify & Diagnose Gemini API Status"
            >
              <Activity className={`w-4 h-4 ${isDiagnosticRunning ? 'animate-spin text-blue-400' : geminiStatus?.status === 'quota_exceeded' ? 'text-amber-400' : geminiStatus?.success ? 'text-green-400' : 'text-amber-400'}`} />
              <span className="hidden xl:inline text-[11px] font-bold tracking-tight">
                {isDiagnosticRunning ? 'Checking...' : geminiStatus?.status === 'quota_exceeded' ? 'AI Quota Exceeded' : geminiStatus?.success ? 'AI Connected' : 'AI Offline'}
              </span>
              <span className="flex h-2 w-2 relative">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${geminiStatus?.status === 'quota_exceeded' ? 'bg-amber-400' : geminiStatus?.success ? 'bg-green-400' : 'bg-amber-500'}`}></span>
                <span className={`relative inline-flex rounded-full h-2 w-2 ${geminiStatus?.status === 'quota_exceeded' ? 'bg-amber-500' : geminiStatus?.success ? 'bg-green-500' : 'bg-amber-500'}`}></span>
              </span>
            </button>

            <button
              onClick={() => setIsShortcutModalOpen(true)}
              className={`p-2 rounded-xl border ${theme === 'dark' ? 'border-neutral-800 bg-neutral-950/40 text-[#5194ec] hover:text-blue-400' : 'border-neutral-200 bg-neutral-50 text-slate-600 hover:bg-neutral-100'} transition-all cursor-pointer active:scale-95`}
              title="Keyboard Shortcuts Guide"
            >
              <Keyboard className="w-4 h-4" />
            </button>
            
            {currentUser ? (
              <div className="flex items-center gap-2.5 bg-neutral-950/60 border border-neutral-800/80 px-3 py-1.5 rounded-full backdrop-blur-sm shadow-inner">
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-[10px] font-bold text-white shadow-md">
                  {currentUser.isAnonymous ? "G" : (currentUser.displayName?.[0]?.toUpperCase() || currentUser.email?.[0]?.toUpperCase() || "U")}
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-[10px] font-bold text-neutral-300 max-w-[120px] truncate leading-tight flex items-center gap-1">
                    {currentUser.isAnonymous ? "Guest User" : (currentUser.displayName || currentUser.email?.split('@')[0])}
                    {localStorage.getItem('aix-sandbox-mode') === 'true' && (
                      <span className="bg-amber-500/10 text-amber-400 text-[8px] font-bold uppercase tracking-wider px-1 rounded border border-amber-500/20">Sandbox</span>
                    )}
                  </span>
                  <button
                    onClick={handleSignOut}
                    className="text-[9px] font-bold text-rose-400 hover:text-rose-300 transition-colors cursor-pointer text-left leading-none mt-0.5"
                  >
                    Disconnect
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => {
                  setAuthMode('login');
                  setAuthError(null);
                  setIsAuthModalOpen(true);
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#5194ec]/25 bg-[#5194ec]/10 text-[#5194ec] hover:bg-[#5194ec]/15 text-xs font-bold transition-all duration-300 cursor-pointer shadow-sm active:scale-95"
              >
                <Users className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            )}

            <AnimatePresence mode="wait">
              {showFullNav && !currentUser && (
                <motion.button
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2 }}
                  onClick={scrollToStatsSection}
                  className={`flex items-center gap-2 px-5 py-2 rounded-full border ${theme === 'dark' ? 'border-neutral-800 bg-neutral-950/65 hover:bg-neutral-900 text-neutral-300 hover:text-white' : 'border-neutral-200 bg-neutral-100 text-slate-800 hover:bg-neutral-200 hover:text-black'} transition-all duration-300 cursor-pointer shadow-sm hover:shadow-blue-500/5 active:scale-95`}
                >
                  Get Started
                  <ArrowRight className="w-3.5 h-3.5 text-neutral-400" />
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          {/* Mobile Menu / Home Icon Button */}
          <div className="lg:hidden flex items-center">
            {showFullNav ? (
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-lg bg-neutral-900/60 border border-neutral-800 text-neutral-300 hover:text-white transition-colors cursor-pointer"
              >
                {isMobileMenuOpen ? <CloseIcon className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            ) : (
              <button
                onClick={scrollToTop}
                className="p-2.5 rounded-full bg-neutral-900/60 border border-neutral-800 text-neutral-300 hover:text-white transition-colors cursor-pointer"
                title="Go to Home"
              >
                <Home className="w-4 h-4" />
              </button>
            )}
          </div>
        </header>

        <TerminalTicker />

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              id="mobile-nav-drawer"
              className="lg:hidden bg-neutral-950 border-b border-neutral-900 px-6 py-6 flex flex-col gap-4 relative z-40 font-sans"
            >
              {navigationItems.map((item) => (
                <a
                  key={item}
                  href={item === 'Benchmarks' ? '/benchmarks' : item === 'Workspace' ? '/workspace' : item === 'Community' ? '/community' : `#${item.toLowerCase().replace(' ', '-')}`}
                  onClick={(e) => {
                    e.preventDefault();
                    setIsMobileMenuOpen(false);
                    if (item === 'Benchmarks') {
                      setIsBenchmarksPage(true);
                      setIsWorkspacePage(false);
                      setCurrentCommunityPath(null);
                      window.history.pushState(null, '', '/benchmarks');
                    } else if (item === 'Workspace') {
                      setIsWorkspacePage(true);
                      setIsBenchmarksPage(false);
                      setCurrentCommunityPath(null);
                      window.history.pushState(null, '', '/workspace');
                    } else if (item === 'Community') {
                      setCurrentCommunityPath('/community');
                      setIsWorkspacePage(false);
                      setIsBenchmarksPage(false);
                      window.history.pushState(null, '', '/community');
                    } else {
                      // Navigate via hash or scroll
                      const element = document.getElementById(item.toLowerCase().replace(' ', '-'));
                      if (element) element.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="text-base font-medium text-neutral-300 hover:text-white transition-colors py-1 border-b border-neutral-900/50"
                >
                  {item}
                </a>
              ))}
              
              {currentUser ? (
                <div className="flex items-center justify-between bg-neutral-900 border border-neutral-800 p-3.5 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-xs font-bold text-white shadow-md">
                      {currentUser.isAnonymous ? "G" : (currentUser.displayName?.[0]?.toUpperCase() || currentUser.email?.[0]?.toUpperCase() || "U")}
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="text-sm font-semibold text-neutral-200">
                        {currentUser.isAnonymous ? "Guest Profile" : (currentUser.displayName || currentUser.email?.split('@')[0])}
                      </span>
                      <span className="text-[10px] text-neutral-500 font-mono">
                        {localStorage.getItem('aix-sandbox-mode') === 'true' ? "Local Sandbox Mode" : "Firebase Connected"}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      handleSignOut();
                    }}
                    className="text-xs font-bold text-rose-400 hover:text-rose-300 transition-colors py-1.5 px-3 rounded-lg bg-rose-500/5 border border-rose-500/10"
                  >
                    Disconnect
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setAuthMode('login');
                    setAuthError(null);
                    setIsAuthModalOpen(true);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-[#5194ec]/20 bg-[#5194ec]/5 text-[#5194ec] font-bold text-sm hover:bg-[#5194ec]/10 transition-all cursor-pointer"
                >
                  <Users className="w-4 h-4" />
                  <span>Sign In</span>
                </button>
              )}

              {!currentUser && (
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    scrollToStatsSection();
                  }}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-[#202020] to-[#121212] border border-neutral-800 text-white font-medium hover:bg-neutral-900 transition-colors cursor-pointer text-sm"
                >
                  Get Started
                  <ArrowRight className="w-4 h-4 text-neutral-400" />
                </button>
              )}

              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsGeminiDiagnosticModalOpen(true);
                }}
                className={`w-full flex items-center justify-center gap-2.5 py-3 rounded-xl border ${theme === 'dark' ? 'border-neutral-800 bg-neutral-900/40 text-neutral-300' : 'border-neutral-200 bg-neutral-50 text-slate-700'} transition-all duration-300 cursor-pointer text-xs font-bold mt-2`}
              >
                <Activity className={`w-4 h-4 ${isDiagnosticRunning ? 'animate-spin text-blue-400' : geminiStatus?.status === 'quota_exceeded' ? 'text-amber-400' : geminiStatus?.success ? 'text-green-400' : 'text-amber-400'}`} />
                <span>{isDiagnosticRunning ? 'Testing AI Connection...' : geminiStatus?.status === 'quota_exceeded' ? 'AI Status: Quota Exceeded' : geminiStatus?.success ? 'AI Status: Active & Connected' : 'AI Status: Demo Fallback'}</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Scrollable Container Wrapper */}
        <div id="home" className="flex flex-col flex-grow relative z-10 overflow-visible">

          {/* Section 1: Hero */}
          <div className="min-h-[calc(90vh-80px)] flex flex-col justify-between flex-shrink-0">
            {/* 2. HERO MAIN SECTION */}
            <main id="hero-content" className="flex-grow grid grid-cols-1 lg:grid-cols-12 gap-8 items-center px-6 py-6 md:px-12 md:py-8 relative z-10">
              
              {/* Left Column (Content & Copy) */}
              <div id="hero-copy-block" className="lg:col-span-6 flex flex-col justify-center text-left relative z-20">
                {/* Badge */}
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1, duration: 0.6 }}
                  id="platform-badge"
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-900/60 border border-neutral-800/80 text-xs font-semibold text-[#5194ec] tracking-wider mb-6 w-fit backdrop-blur-sm shadow-sm font-mono"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#5194ec]" />
                  <span>GROUNDED INTELLIGENCE SERVICE</span>
                </motion.div>

                {/* Main Headline */}
                <motion.h1
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  id="hero-headline"
                  className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-[72px] font-normal tracking-tight text-white leading-[1.08] text-glow"
                >
                  <div>Live Intel</div>
                  <div>
                    Crafted for{' '}
                    <span className="bg-gradient-to-r from-[#a2c8fc] via-[#e2ecfa] to-neutral-400 bg-clip-text text-transparent font-medium">
                      AI
                    </span>
                  </div>
                  <div className="mt-1">
                    Not{' '}
                    <span className="bg-gradient-to-r from-[#5194ec] via-[#8fc0ff] to-[#d6e7ff] bg-clip-text text-transparent font-medium">
                      Speculation
                    </span>
                  </div>
                </motion.h1>

                {/* Sub-headline description */}
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                  id="hero-subheadline"
                  className="text-neutral-400 text-sm sm:text-base md:text-lg font-normal max-w-lg mt-6 leading-relaxed font-sans"
                >
                  Real-time AI announcements, hardware breakthroughs, and global tech trends compiled automatically via Google Search Grounding.
                </motion.p>

                {/* Interactive CTAs */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  id="hero-actions"
                  className="flex flex-wrap items-center gap-6 mt-8 sm:mt-10"
                >
                  {/* Primary button */}
                  <button
                    onClick={scrollToStatsSection}
                    className="group flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-[#101010]/80 border border-neutral-900 hover:border-neutral-800 text-sm font-semibold text-white transition-all duration-200 cursor-pointer shadow-[0_12px_32px_rgba(0,0,0,0.6)] hover:translate-y-[-1px] active:translate-y-[1px] font-sans"
                  >
                    Explore Live News
                    <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-white group-hover:translate-x-1 transition-all duration-200" />
                  </button>

                  {/* Benchmarks button */}
                  <button
                    onClick={() => {
                      setIsBenchmarksPage(true);
                      window.history.pushState(null, '', '/benchmarks');
                    }}
                    className="group flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-b from-[#1c1c1c] to-[#0a0a0a] border border-neutral-800 hover:border-neutral-700/80 text-sm font-semibold text-white transition-all duration-200 cursor-pointer shadow-[0_12px_32px_rgba(0,0,0,0.6)] hover:shadow-[#5194ec]/10 hover:translate-y-[-1px] active:translate-y-[1px] font-sans"
                  >
                    <Award className="w-4.5 h-4.5 text-[#5194ec]" />
                    Model Benchmarks
                  </button>

                  {/* Loved By / Users block */}
                  <div id="loved-by-widget" className="flex items-center gap-3">
                    {/* Overlapping Avatars */}
                    <div className="flex -space-x-2.5">
                      {avatars.map((avatar, idx) => (
                        <img
                          key={idx}
                          src={avatar.url}
                          alt={avatar.alt}
                          referrerPolicy="no-referrer"
                          className="w-8.5 h-8.5 rounded-full border-2 border-[#050505] object-cover ring-1 ring-neutral-800/50"
                        />
                      ))}
                    </div>

                    {/* User Statistics text */}
                    <div className="flex flex-col text-left">
                      <span className="text-[11px] text-neutral-500 font-medium tracking-wide uppercase">
                        Loved by
                      </span>
                      <span className="text-xs sm:text-sm font-bold text-[#5194ec] tracking-tight">
                        10,000+ users
                      </span>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Right Column (Empty layout placeholder so background video robot stays visible) */}
              <div id="hero-graphics-container" className="lg:col-span-6 flex justify-center lg:justify-end relative h-full min-h-[300px] sm:min-h-[420px] lg:min-h-[520px] z-10 mt-6 lg:mt-0 pointer-events-none">
                <div className="relative w-full max-w-[480px] lg:max-w-[530px] flex items-center justify-center lg:justify-end">
                  <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
                    <span className="absolute top-[20%] left-[15%] w-1.5 h-1.5 bg-blue-400 rounded-full opacity-40 blur-[0.5px] animate-pulse" />
                    <span className="absolute top-[45%] left-[25%] w-1 h-1 bg-white rounded-full opacity-30 blur-[0.5px]" style={{ animationDelay: '1.2s' }} />
                    <span className="absolute bottom-[30%] left-[10%] w-1.5 h-1.5 bg-blue-300 rounded-full opacity-25 blur-[1px]" />
                    <span className="absolute top-[70%] right-[25%] w-1 h-1 bg-white rounded-full opacity-40 blur-[0.5px] animate-pulse" style={{ animationDelay: '2.5s' }} />
                  </div>
                </div>
              </div>
            </main>

            {/* 3. FOOTER TRUST BAR */}
            <footer id="app-footer" className="px-6 pb-6 md:px-12 md:pb-8 relative z-20">
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.7 }}
                id="trust-partners-bar"
                className="bg-[#080808]/85 border border-neutral-900/90 rounded-[22px] px-6 py-5 md:px-10 md:py-5 flex flex-wrap items-center justify-between gap-6 backdrop-blur-md shadow-inner"
              >
                {/* Left title */}
                <div id="trust-by-title" className="text-[11px] font-bold text-neutral-500 uppercase tracking-widest">
                  Trusted by
                </div>

                {/* Partner SVGs list */}
                <div id="partner-logos-list" className="flex flex-wrap items-center gap-x-10 gap-y-5 md:gap-x-14">
                  <TechflowLogo />
                  <ZenithLogo />
                  <WavesLogo />
                  <HarmonyLogo />
                  <SpheronLogo />
                </div>
              </motion.div>
            </footer>
          </div>

          {/* Section 2: Stats Section (As requested in reference image) */}
          <div
            id="stats-section"
            className="min-h-[calc(90vh-80px)] flex flex-col justify-center px-6 py-16 md:px-12 relative z-10 border-t border-neutral-900/30 bg-neutral-950/20 backdrop-blur-sm flex-shrink-0"
          >
            <div className="w-full max-w-7xl mx-auto">
              
              {/* Header block */}
              <div className="flex flex-col items-center justify-center text-center mb-12 relative z-10">
                {/* Badge */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/5 border border-blue-500/10 text-xs font-semibold text-blue-400 tracking-wider mb-5 backdrop-blur-sm shadow-inner"
                >
                  <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                  <span>AI X REAL-TIME DATA DESK</span>
                </motion.div>

                {/* Main Heading */}
                <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-normal tracking-tight text-white leading-tight max-w-4xl text-glow">
                  Live AI{' '}
                  <span className="bg-gradient-to-r from-[#5194ec] via-[#8fc0ff] to-[#d6e7ff] bg-clip-text text-transparent font-medium">
                    Intelligence Hub
                  </span>
                </h2>

                <p className="text-neutral-400 text-sm sm:text-base md:text-lg max-w-2xl mt-4 leading-relaxed font-sans">
                  Tracking the absolute frontier of artificial intelligence, curated month-by-month and analyzed with Gemini.
                </p>
              </div>

              {/* Geographical Live Intel Map has been removed to simplify layout */}

              {/* Dynamic Preferences / Interests Config (Personalized Dashboard) */}
              <div className={`mb-8 p-5 rounded-2xl border ${theme === 'dark' ? 'bg-[#060606]/80 border-neutral-900' : 'bg-neutral-50 border-neutral-200'} font-sans relative z-20 shadow-inner`}>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
                  <div className="text-left">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Sparkles className="w-3.5 h-3.5 text-[#5194ec]" />
                      <h4 className="text-xs font-bold uppercase tracking-widest text-[#5194ec]">Personalized Intel Preferences</h4>
                    </div>
                    <p className="text-xs text-neutral-400">Follow tech hubs and core sectors to customize your recommended feeds in real-time.</p>
                  </div>
                  <div className="flex flex-wrap gap-2.5">
                    {["Models", "Hardware", "Regulation", "Business", "Applications"].map(cat => {
                      const isFollowed = followedCategories.includes(cat);
                      return (
                        <button
                          key={cat}
                          onClick={() => toggleFollowCategory(cat)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all cursor-pointer ${
                            isFollowed 
                              ? 'bg-blue-500/10 border-blue-500/30 text-blue-400 shadow-md' 
                              : 'bg-neutral-950/40 border-neutral-900 text-neutral-400 hover:text-white'
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${isFollowed ? 'bg-blue-400' : 'bg-neutral-600'}`} />
                          {cat}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* AI Daily Briefing Desk */}
              <div className="mb-10 relative z-20">
                <DailyBriefingSection 
                  news={news} 
                  onOpenArticle={(art) => {
                    setActiveReadingArticle(art);
                    markAsRead(art.url);
                  }}
                  followedCategories={followedCategories} 
                />
              </div>

              {/* Trending AI Entities Index */}
              <div className="mb-12 relative z-20">
                <TrendingSection />
              </div>

              {/* Controls bar (Search + Sync + Category Tabs) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center mb-10 relative z-20">
                {/* Command Palette Spotlight Trigger */}
                <div className="col-span-1 lg:col-span-4 w-full">
                  <div 
                    onClick={() => setIsSearchPaletteOpen(true)}
                    className={`relative cursor-pointer group flex items-center justify-between w-full pl-11 pr-4 py-3 rounded-2xl border transition-all duration-300 ${
                      theme === 'dark' 
                        ? 'bg-[#0a0a0a]/35 border-neutral-900/80 hover:border-neutral-800/80 hover:bg-[#0c0c0c]/80' 
                        : 'bg-neutral-50 border-neutral-200 hover:border-neutral-300 hover:bg-neutral-100/60'
                    }`}
                  >
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 group-hover:text-[#5194ec] transition-colors" />
                    <span className="text-xs sm:text-sm text-neutral-500 group-hover:text-neutral-400 font-sans transition-colors">
                      {searchQuery || "Search any AI topic..."}
                    </span>
                    <div className="flex items-center gap-1">
                      <kbd className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold tracking-widest ${theme === 'dark' ? 'bg-neutral-950 border border-neutral-900 text-neutral-500' : 'bg-neutral-250 border border-neutral-300 text-neutral-600'} shadow-sm uppercase select-none`}>
                        ⌘K
                      </kbd>
                    </div>
                  </div>
                </div>

                {/* Category Pills (Panned/overflowing on mobile, centered on desktop) */}
                <div className="col-span-1 lg:col-span-6 flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
                  {["All", "For You", "Bookmarks", "Models", "Hardware", "Regulation", "Business", "Applications"].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap border font-sans ${
                        activeCategory === cat
                          ? "bg-gradient-to-b from-[#1c1c1c] to-[#0a0a0a] border-neutral-700 text-white shadow-lg shadow-[#5194ec]/5"
                          : `${theme === 'dark' ? 'bg-neutral-950/40 border-neutral-900 text-neutral-400 hover:text-white' : 'bg-white border-neutral-200 text-neutral-500 hover:text-neutral-900 hover:border-neutral-300'}`
                      }`}
                    >
                      {cat === "Bookmarks" ? `Bookmarks (${bookmarks.length})` : cat}
                    </button>
                  ))}
                </div>

                {/* Refresh Trigger Countdown */}
                <div className="col-span-1 lg:col-span-2 flex flex-col items-stretch lg:items-end gap-1.5">
                  <button
                    onClick={() => fetchNewsAndInsights(currentQuery !== "latest artificial intelligence developments and tech announcements" ? currentQuery : undefined)}
                    disabled={newsLoading}
                    className={`flex items-center gap-2 px-5 py-3 rounded-2xl border ${theme === 'dark' ? 'border-neutral-800 bg-neutral-950/40 text-neutral-300 hover:bg-neutral-900' : 'border-neutral-200 bg-neutral-50 text-slate-700 hover:bg-neutral-100'} text-xs font-semibold transition-all duration-300 cursor-pointer disabled:opacity-50 active:scale-95 shadow-md w-full sm:w-auto justify-center font-sans`}
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${newsLoading ? "animate-spin text-blue-400" : ""}`} />
                    Sync Intel Feed
                  </button>
                  
                  <div className="flex items-center justify-between lg:justify-end gap-2 text-[10px] font-mono text-neutral-500 px-1 select-none">
                    <div className="flex items-center gap-1.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${autoRefresh ? 'bg-emerald-500 animate-ping' : 'bg-neutral-600'}`} />
                      <span>Auto-Refresh {autoRefresh ? 'Active' : 'Paused'}</span>
                    </div>
                    {autoRefresh && (
                      <span className="text-[#5194ec]">T-minus {refreshCountdown}s</span>
                    )}
                    <button 
                      type="button"
                      onClick={() => setAutoRefresh(!autoRefresh)}
                      className="text-[#5194ec] hover:underline ml-1 cursor-pointer"
                    >
                      {autoRefresh ? 'Pause' : 'Resume'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Secondary filter bar (Date ranges) */}
              <div className="flex flex-wrap items-center justify-between gap-4 mb-8 relative z-20 p-4 rounded-2xl border border-neutral-900 bg-neutral-950/20 backdrop-blur-md">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-[10px] font-bold font-mono text-neutral-500 uppercase tracking-widest flex items-center gap-1.5 select-none">
                    <Calendar className="w-3.5 h-3.5 text-[#5194ec]" />
                    Intel Temporal Scope:
                  </span>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {[
                      { id: 'all', label: 'All Time' },
                      { id: '30days', label: 'Last 30 Days' },
                      { id: '3months', label: 'Last 3 Months' },
                      { id: '5months', label: 'Last 5 Months' }
                    ].map((range) => (
                      <button
                        key={range.id}
                        type="button"
                        onClick={() => setDateFilter(range.id as any)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer font-sans ${
                          dateFilter === range.id
                            ? 'bg-neutral-900 border-neutral-800 text-[#5194ec] shadow-inner'
                            : 'bg-transparent border-transparent text-neutral-500 hover:text-neutral-300 hover:bg-neutral-900/20'
                        }`}
                      >
                        {range.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="text-[10px] font-mono text-neutral-400 bg-neutral-900/40 border border-neutral-900/60 px-3 py-1.5 rounded-xl select-none">
                  🔍 Feed Volume: <span className="text-white font-bold">{filteredNews.length}</span> of <span className="text-neutral-500 font-bold">{news.length}</span> verified nodes
                </div>
              </div>

              {/* Main Content Layout (Grid) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10 items-start text-left">
                
                {/* News Feed Grid (8 columns on large screens) */}
                <div className="col-span-1 lg:col-span-8 space-y-6">
                  {newsError && (
                    <div className="p-8 rounded-2xl bg-red-500/5 border border-red-500/10 text-red-400 text-center text-sm font-sans">
                      <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-3" />
                      <p className="font-semibold">{newsError}</p>
                      <button
                        onClick={() => fetchNewsAndInsights()}
                        className="mt-4 px-4 py-2 bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-white rounded-xl text-xs transition-all cursor-pointer"
                      >
                        Retry Feed Fetch
                      </button>
                    </div>
                  )}

                  {newsLoading ? (
                    // Elite Premium Skeleton Loaders
                    Array.from({ length: 3 }).map((_, idx) => (
                      <div 
                        key={idx} 
                        className={`p-6 sm:p-7 rounded-[28px] border ${
                          theme === 'dark' ? 'border-neutral-900 bg-neutral-950/20' : 'bg-white border-neutral-200'
                        } relative overflow-hidden space-y-5 shadow-xl`}
                      >
                        {/* Shimmer overlay effect */}
                        <div className="animate-shimmer pointer-events-none" />
                        
                        {/* Header Row */}
                        <div className="flex justify-between items-center">
                          <div className="flex gap-2">
                            <div className={`w-20 h-5 rounded-full ${theme === 'dark' ? 'bg-neutral-900' : 'bg-neutral-100'} animate-pulse`} />
                            <div className={`w-28 h-5 rounded-lg ${theme === 'dark' ? 'bg-neutral-900/60' : 'bg-neutral-100/80'} animate-pulse`} />
                          </div>
                          <div className={`w-14 h-6 rounded-lg ${theme === 'dark' ? 'bg-neutral-900' : 'bg-neutral-100'} animate-pulse`} />
                        </div>
                        
                        {/* Title Bar */}
                        <div className="space-y-2">
                          <div className={`w-11/12 h-6 rounded-lg ${theme === 'dark' ? 'bg-neutral-900' : 'bg-neutral-100'} animate-pulse`} />
                          <div className={`w-8/12 h-6 rounded-lg ${theme === 'dark' ? 'bg-neutral-900' : 'bg-neutral-100'} animate-pulse`} />
                        </div>
                        
                        {/* Description Lines */}
                        <div className="space-y-2 pt-2">
                          <div className={`w-full h-3.5 rounded ${theme === 'dark' ? 'bg-neutral-900/50' : 'bg-neutral-100/50'} animate-pulse`} />
                          <div className={`w-11/12 h-3.5 rounded ${theme === 'dark' ? 'bg-neutral-900/50' : 'bg-neutral-100/50'} animate-pulse`} />
                          <div className={`w-5/6 h-3.5 rounded ${theme === 'dark' ? 'bg-neutral-900/50' : 'bg-neutral-100/50'} animate-pulse`} />
                        </div>
                        
                        {/* Footer details divider */}
                        <div className={`border-t ${theme === 'dark' ? 'border-neutral-900/60' : 'border-neutral-100'} pt-4 flex justify-between items-center`}>
                          <div className={`w-24 h-4 rounded ${theme === 'dark' ? 'bg-neutral-900' : 'bg-neutral-100'} animate-pulse`} />
                          <div className={`w-24 h-4 rounded ${theme === 'dark' ? 'bg-neutral-900' : 'bg-neutral-100'} animate-pulse`} />
                        </div>
                      </div>
                    ))
                  ) : (
                    <>
                      {activeCategory === "For You" ? (
                        <ForYouDashboard
                          news={news}
                          bookmarks={bookmarks}
                          toggleBookmark={toggleBookmark}
                          readArticles={readArticles}
                          followedCategories={followedCategories}
                          toggleFollowCategory={toggleFollowCategory}
                          onOpenArticle={(art) => {
                            setActiveReadingArticle(art);
                            markAsRead(art.url);
                          }}
                          onOpenModel={(slug) => setActiveModelSlug(slug)}
                          onOpenCompany={(slug) => setActiveCompanySlug(slug)}
                          onOpenResearch={(slug) => setActiveResearchSlug(slug)}
                          onOpenCopilotCompare={(entityA, entityB) => {
                            setCopilotComparePreset({ entityA, entityB });
                            setIsCopilotOpen(true);
                          }}
                        />
                      ) : filteredNews.length === 0 ? (
                            <div className={`p-12 rounded-3xl border ${theme === 'dark' ? 'border-neutral-900 bg-neutral-950/10' : 'border-neutral-200 bg-neutral-50'} text-center text-neutral-400 font-sans`}>
                              <BookOpen className="w-10 h-10 text-neutral-600 mx-auto mb-4" />
                              <p className="text-sm font-semibold text-white">No articles match your selection</p>
                              <p className="text-xs mt-1 text-neutral-500">
                                {activeCategory === "Bookmarks" 
                                  ? "You haven't bookmarked any articles yet. Hover and click the star icon on any news story!" 
                                  : "Try selecting a different category, or choosing an older date range filter."}
                              </p>
                            </div>
                          ) : (
                            <>
                              <FeaturedIntelligence 
                                news={filteredNews}
                                onOpenArticle={(art) => {
                                  setActiveReadingArticle(art);
                                  markAsRead(art.url);
                                }}
                                bookmarks={bookmarks}
                                onToggleBookmark={toggleBookmark}
                              />

                              {(filteredNews.length > 1 ? filteredNews.slice(1) : filteredNews).map((item, idx) => {
                          const originalIndex = news.findIndex(n => n.url === item.url);
                          const isBookmarked = bookmarks.includes(item.url);
                          const isRead = readArticles.includes(item.url);
                          const isExpanded = activeArticleIndex === originalIndex;
                          const activeLang = activeLanguages[originalIndex] || "English";
                          const isTranslating = translatingIndex === originalIndex;

                          const displayedTitle = translatedArticles[originalIndex]?.title || item.title;
                          const displayedSummary = translatedArticles[originalIndex]?.summary || item.summary;

                          const getSentimentColor = (sentiment: string) => {
                            switch (sentiment?.toLowerCase()) {
                              case 'positive': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/15';
                              case 'critical': return 'bg-rose-500/10 text-rose-400 border-rose-500/15';
                              default: return 'bg-neutral-500/10 text-neutral-400 border-neutral-800';
                            }
                          };

                          return (
                            <motion.div
                              key={item.url}
                              layoutId={`article-${item.url}`}
                              initial={{ opacity: 0, y: 15 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.4, ease: 'easeOut' }}
                              className={`group p-6 sm:p-7 rounded-[28px] border transition-all duration-300 relative overflow-hidden shadow-xl ${
                                isRead 
                                  ? 'border-neutral-950 bg-[#070707]/25 opacity-70 hover:opacity-100 hover:border-neutral-850 hover:bg-[#090909]/55' 
                                  : 'border-neutral-900/65 bg-neutral-950/35 hover:border-neutral-800/80 hover:bg-neutral-950/60'
                              }`}
                            >
                              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-[#5194ec]/2 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                              
                              {/* News Meta Headers */}
                              <div className="flex flex-wrap items-center justify-between gap-3 mb-4 text-[11px] font-mono tracking-wider text-neutral-500">
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-bold text-[#5194ec] bg-[#5194ec]/5 border border-[#5194ec]/10 px-2.5 py-0.5 rounded-full font-sans shadow-sm">
                                    {item.source || "Grounded Report"}
                                  </span>
                                  {item.isVerified && (
                                    <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-500/5 px-2 py-0.5 rounded-lg border border-emerald-500/10 font-sans font-semibold">
                                      <Award className="w-3 h-3 text-emerald-400" />
                                      Verified Source
                                    </span>
                                  )}
                                  {item.isDeveloping && (
                                    <span className="inline-flex items-center gap-1 text-[10px] text-rose-400 bg-rose-500/5 px-2 py-0.5 rounded-lg border border-rose-500/10 font-sans font-bold animate-pulse">
                                      <span className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-ping" />
                                      LIVE BREAKING
                                    </span>
                                  )}
                                  {item.date && (
                                    <span className="inline-flex items-center gap-1.5 text-[10px] text-neutral-400 bg-neutral-900/30 px-2.5 py-0.5 rounded-lg border border-neutral-900/50 font-sans font-medium">
                                      <Calendar className="w-3 h-3 text-[#5194ec]" />
                                      {item.date}
                                    </span>
                                  )}
                                  {isRead && (
                                    <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-500/5 px-2.5 py-0.5 rounded-lg border border-emerald-500/10 font-sans font-semibold shadow-sm">
                                      <Check className="w-3 h-3 text-emerald-400" />
                                      Processed
                                    </span>
                                  )}
                                </div>

                                <div className="flex items-center gap-2.5">
                                  {/* Translation Select Dropdown */}
                                  <div className="flex items-center gap-1.5 bg-neutral-900/30 border border-neutral-900 px-2 py-1 rounded-xl">
                                    <Languages className="w-3.5 h-3.5 text-neutral-400" />
                                    <select
                                      value={activeLang}
                                      onChange={(e) => handleTranslateArticle(originalIndex, item.title, item.summary, e.target.value)}
                                      className="bg-transparent text-[10px] text-neutral-300 hover:text-white border-none outline-none font-sans font-semibold cursor-pointer"
                                    >
                                      <option value="English">EN</option>
                                      <option value="Spanish">ES</option>
                                      <option value="French">FR</option>
                                      <option value="German">DE</option>
                                      <option value="Japanese">JA</option>
                                      <option value="Chinese">ZH</option>
                                      <option value="Hindi">HI</option>
                                    </select>
                                  </div>

                                  <button
                                    onClick={(e) => toggleReadStatus(item.url, e)}
                                    className={`p-1.5 rounded-lg border transition-all ${
                                      isRead 
                                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 hover:border-emerald-500/40' 
                                        : 'bg-neutral-900/40 border-neutral-900 text-neutral-400 hover:text-white hover:border-neutral-850'
                                    }`}
                                    title={isRead ? "Mark as Unread" : "Mark as Read"}
                                  >
                                    <Check className="w-3.5 h-3.5" />
                                  </button>

                                  <button
                                    onClick={() => toggleBookmark(item.url)}
                                    className={`p-1.5 rounded-lg border transition-all ${
                                      isBookmarked 
                                        ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' 
                                        : 'bg-neutral-900/40 border-neutral-900 text-neutral-400 hover:text-white hover:border-neutral-800'
                                    }`}
                                    title={isBookmarked ? "Remove from Bookmarks" : "Save to Bookmarks"}
                                  >
                                    <Bookmark className="w-3.5 h-3.5" fill={isBookmarked ? "currentColor" : "none"} />
                                  </button>
                                </div>
                              </div>

                              {/* Title */}
                              <h3 
                                onClick={(e) => {
                                  e.preventDefault();
                                  setActiveReadingArticle(item);
                                  markAsRead(item.url);
                                }}
                                className={`text-lg sm:text-xl font-display font-medium tracking-tight leading-snug group-hover:text-blue-400 transition-colors duration-200 cursor-pointer ${
                                  isRead ? 'text-neutral-400' : 'text-white'
                                }`}
                              >
                                <span className="flex items-center gap-2">
                                  {isTranslating ? (
                                    <span className="flex items-center gap-2 text-neutral-400">
                                      <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
                                      Translating headlines...
                                    </span>
                                  ) : displayedTitle}
                                  <Sparkles className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-blue-400 self-center flex-shrink-0 animate-pulse" />
                                </span>
                              </h3>

                              {/* Combined Metrics Row (Confidence Score + Read Status Indicator) */}
                              <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2">
                                {/* Confidence Score Bar */}
                                <div className="flex items-center gap-2">
                                  <div className="flex items-center gap-1">
                                    <span className="text-[10px] font-bold font-mono text-neutral-500 uppercase tracking-wide">Confidence:</span>
                                    <span className={`text-[10px] font-bold font-mono ${item.confidenceScore > 92 ? 'text-emerald-400' : 'text-[#5194ec]'}`}>
                                      {item.confidenceScore}%
                                    </span>
                                  </div>
                                  <div className="h-1 w-16 sm:w-20 rounded-full bg-neutral-900 overflow-hidden">
                                    <div 
                                      className={`h-full rounded-full ${item.confidenceScore > 92 ? 'bg-emerald-500' : 'bg-[#5194ec]'}`}
                                      style={{ width: `${item.confidenceScore}%` }}
                                    />
                                  </div>
                                </div>

                                {/* Read Progress Indicator */}
                                {(() => {
                                  const viewed = viewedTabs[item.url] || [];
                                  const totalTabs = 6;
                                  const progressPercent = Math.round((viewed.length / totalTabs) * 100);
                                  
                                  let statusText = "UNREAD";
                                  let statusColor = "text-neutral-500";
                                  let progressColor = "bg-neutral-800";
                                  
                                  if (viewed.length > 0) {
                                    if (viewed.length === totalTabs) {
                                      statusText = "FULLY ANALYZED";
                                      statusColor = "text-emerald-400";
                                      progressColor = "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.3)]";
                                    } else if (viewed.length >= 3) {
                                      statusText = `DEEP READ (${progressPercent}%)`;
                                      statusColor = "text-[#5194ec]";
                                      progressColor = "bg-[#5194ec]";
                                    } else {
                                      statusText = `SKIMMED (${progressPercent}%)`;
                                      statusColor = "text-amber-400";
                                      progressColor = "bg-amber-500";
                                    }
                                  }

                                  return (
                                    <div className="flex items-center gap-2">
                                      <div className="flex items-center gap-1">
                                        <span className="text-[10px] font-bold font-mono text-neutral-500 uppercase tracking-wide">Read Status:</span>
                                        <span className={`text-[10px] font-bold font-mono ${statusColor}`}>
                                          {statusText}
                                        </span>
                                      </div>
                                      <div className="h-1 w-16 sm:w-20 rounded-full bg-neutral-900 overflow-hidden">
                                        <div 
                                          className={`h-full rounded-full transition-all duration-300 ${progressColor}`}
                                          style={{ width: `${progressPercent}%` }}
                                        />
                                      </div>
                                    </div>
                                  );
                                })()}
                              </div>

                              {/* Summary body */}
                              <p className="text-sm text-neutral-400 font-normal leading-relaxed mt-3.5 font-sans">
                                {isTranslating ? "Translating summary index payload..." : displayedSummary}
                              </p>

                              {/* Expanded AI Summaries & Timelines Board */}
                              <AnimatePresence>
                                {isExpanded && (
                                  <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="mt-6 pt-5 border-t border-neutral-900/50 overflow-hidden font-sans"
                                  >
                                    {/* Summary Sub-Tabs Navigation */}
                                    <div className="flex flex-wrap gap-2 mb-5">
                                      {[
                                        { id: 'takeaway', label: '1-Line Takeaway' },
                                        { id: 'thirtySec', label: '30s Brief' },
                                        { id: 'detailed', label: 'Detailed summary' },
                                        { id: 'eli15', label: 'Explain like 15' },
                                        { id: 'technical', label: 'Technical specs' },
                                        { id: 'timeline', label: 'Chronology' }
                                      ].map((tab) => (
                                        <button
                                          key={tab.id}
                                          onClick={() => {
                                            setActiveSummaryTab(tab.id as any);
                                            markTabAsViewed(item.url, tab.id);
                                          }}
                                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                                            activeSummaryTab === tab.id
                                              ? 'bg-neutral-900 border-neutral-800 text-[#5194ec]'
                                              : 'bg-neutral-950/40 border-neutral-900/50 text-neutral-400 hover:text-white'
                                          }`}
                                        >
                                          {tab.label}
                                        </button>
                                      ))}
                                    </div>

                                    {/* Inner summary display panels */}
                                    <div className="bg-neutral-950/30 rounded-2xl border border-neutral-900/40 p-5 text-sm text-neutral-300 text-left">
                                      {summariesLoading[originalIndex] || timelinesLoading[originalIndex] ? (
                                        <div className="flex flex-col items-center justify-center py-8 gap-3">
                                          <Loader2 className="w-6 h-6 animate-spin text-[#5194ec]" />
                                          <span className="text-xs text-neutral-500 font-mono">Synthesizing deep briefing summaries...</span>
                                        </div>
                                      ) : activeSummaryTab === 'timeline' ? (
                                        <div className="space-y-5 font-sans">
                                          <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5 mb-2">
                                            <History className="w-3.5 h-3.5 text-blue-400" />
                                            Chronological Event Development Timeline
                                          </h4>
                                          {articleTimelines[originalIndex] && articleTimelines[originalIndex].length > 0 ? (
                                            <div className="relative pl-6 border-l border-neutral-900 space-y-5">
                                              {articleTimelines[originalIndex].map((evt: any, eIdx: number) => (
                                                <div key={eIdx} className="relative">
                                                  <div className="absolute -left-[30px] top-1 w-2.5 h-2.5 rounded-full bg-blue-500 border-2 border-neutral-950" />
                                                  <div className="text-[10px] font-bold font-mono text-blue-400 uppercase tracking-widest">{evt.time}</div>
                                                  <div className="text-xs font-semibold text-white mt-0.5">{evt.title}</div>
                                                  <div className="text-xs text-neutral-400 mt-1 leading-relaxed">{evt.description}</div>
                                                </div>
                                              ))}
                                            </div>
                                          ) : (
                                            <div className="text-xs text-neutral-500">Timeline unavailable for this story.</div>
                                          )}
                                        </div>
                                      ) : (
                                        <div className="space-y-4">
                                          <p className="leading-relaxed font-sans text-neutral-200">
                                            {activeSummaryTab === 'takeaway' && (articleSummaries[originalIndex]?.oneLine || displayedSummary)}
                                            {activeSummaryTab === 'thirtySec' && (articleSummaries[originalIndex]?.thirtySecond || "Analyzing...")}
                                            {activeSummaryTab === 'detailed' && (articleSummaries[originalIndex]?.detailed || "Analyzing...")}
                                            {activeSummaryTab === 'eli15' && (articleSummaries[originalIndex]?.eli15 || "Analyzing...")}
                                            {activeSummaryTab === 'technical' && (articleSummaries[originalIndex]?.technical || "Analyzing...")}
                                          </p>

                                          {/* Article Copilot Preset prompt rows */}
                                          <div className="border-t border-neutral-900/50 pt-4 mt-4">
                                            <span className="text-[10px] font-bold font-mono text-neutral-500 uppercase tracking-wider block mb-2.5">
                                              Ask Copilot (preset prompts)
                                            </span>
                                            <div className="flex flex-wrap gap-2">
                                              {[
                                                "Why does this matter?",
                                                "Summarize in 20 words.",
                                                "Explain technical terms.",
                                                "Compare with past events.",
                                                "Predict possible outcomes."
                                              ].map((preset) => (
                                                <button
                                                  key={preset}
                                                  onClick={() => handleCopilotPreset(preset, item.title)}
                                                  className="px-2.5 py-1.5 rounded-lg border border-neutral-900 bg-neutral-900/40 text-xs font-medium text-neutral-400 hover:text-white hover:border-[#5194ec]/20 hover:bg-[#5194ec]/5 transition-all cursor-pointer"
                                                >
                                                  {preset}
                                                </button>
                                              ))}
                                            </div>
                                          </div>
                                        </div>
                                      )}
                                    </div>

                                    {/* Custom Full Stack Research Note-taking Section */}
                                    <div className="mt-4 p-4 rounded-2xl border border-neutral-900 bg-neutral-950/20">
                                      <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-1.5">
                                          <FileText className="w-3.5 h-3.5 text-[#5194ec]" />
                                          <span className="text-[10px] font-bold font-mono text-neutral-400 uppercase tracking-widest">
                                            Research Workspace
                                          </span>
                                        </div>
                                        {currentUser ? (
                                          <span className="text-[9px] text-emerald-400 font-mono bg-emerald-500/5 px-2 py-0.5 rounded-md border border-emerald-500/10 flex items-center gap-1">
                                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                                            Cloud Saved
                                          </span>
                                        ) : (
                                          <span className="text-[9px] text-amber-400 font-mono bg-amber-500/5 px-2 py-0.5 rounded-md border border-amber-500/10">
                                            Local State (Sign in to sync to cloud)
                                          </span>
                                        )}
                                      </div>
                                      
                                      <textarea
                                        value={userNotes[item.url] || ""}
                                        onChange={(e) => {
                                          const text = e.target.value;
                                          setUserNotes(prev => ({ ...prev, [item.url]: text }));
                                        }}
                                        placeholder="✍️ Write your custom intelligence summaries, technical speculations, or market analysis here..."
                                        className="w-full h-20 p-3 rounded-xl border border-neutral-900 bg-neutral-950/40 text-xs text-neutral-300 placeholder-neutral-600 focus:outline-none focus:border-[#5194ec]/40 focus:ring-1 focus:ring-[#5194ec]/20 resize-none font-sans mt-1 transition-all"
                                      />
                                      
                                      <div className="flex justify-end mt-2">
                                        <button
                                          onClick={() => handleSaveNote(item.url, userNotes[item.url] || "")}
                                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-800 bg-neutral-900 hover:bg-neutral-800 text-[10px] font-bold text-white transition-all cursor-pointer hover:border-neutral-700 hover:translate-y-[-0.5px] active:translate-y-[0.5px] font-sans"
                                        >
                                          <Check className="w-3 h-3 text-emerald-400" />
                                          <span>Save Note</span>
                                        </button>
                                      </div>
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>

                              {/* Action Footer (Copy Link + Access Coverage) */}
                              <div className="mt-5 flex items-center justify-between gap-4 border-t border-neutral-900/40 pt-4">
                                <div className="flex items-center gap-4">
                                  <button
                                    onClick={() => handleCopyLink(item.url, item.title)}
                                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-400 hover:text-[#5194ec] transition-all cursor-pointer font-sans select-none active:scale-95"
                                    title="Copy article link to clipboard"
                                  >
                                    <Copy className="w-3.5 h-3.5 text-neutral-500 hover:text-[#5194ec] transition-colors" />
                                    Copy Link
                                  </button>

                                  <button
                                    onClick={() => handleExpandArticle(originalIndex, item.title, item.summary)}
                                    className={`inline-flex items-center gap-1.5 text-xs font-semibold ${isExpanded ? 'text-[#5194ec]' : 'text-neutral-400 hover:text-white'} transition-all cursor-pointer font-sans select-none active:scale-95`}
                                  >
                                    <Sparkles className="w-3.5 h-3.5 text-[#5194ec]" />
                                    {isExpanded ? 'Close Brief' : 'Expand Intelligence'}
                                  </button>
                                </div>

                                <button
                                  onClick={() => {
                                    setActiveReadingArticle(item);
                                    markAsRead(item.url);
                                  }}
                                  className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-300 hover:text-[#5194ec] transition-colors group/btn font-sans cursor-pointer"
                                >
                                  Read Intelligence
                                  <ChevronRight className="w-3.5 h-3.5 text-neutral-500 group-hover/btn:translate-x-0.5 transition-transform" />
                                </button>
                              </div>
                            </motion.div>
                          );
                        })}</>)}
                    </>
                  )}
                </div>

                {/* Right Column: Bento Widgets (4 columns on large screens) */}
                <div className="col-span-1 lg:col-span-4 space-y-6">
                  
                  {/* Dynamic Sidebar Switcher Navigation */}
                  <div className={`p-1.5 rounded-2xl border ${theme === 'dark' ? 'bg-[#060606]/85 border-neutral-900' : 'bg-neutral-50 border-neutral-200'} flex items-center justify-between gap-1 shadow-sm`}>
                    {[
                      { id: 'chat', label: 'Copilot', icon: MessageSquare },
                      { id: 'voice', label: 'Voice Anchor', icon: Volume2 },
                      { id: 'radar', label: 'Radar Index', icon: Activity },
                      { id: 'outlook', label: 'Sector Brief', icon: TrendingUp },
                      { id: 'workspace', label: 'Workspace', icon: BookOpen }
                    ].map((tab) => {
                      const Icon = tab.icon;
                      const isSelected = sidebarTab === tab.id;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setSidebarTab(tab.id as any)}
                          className={`flex-1 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest flex flex-col sm:flex-row items-center justify-center gap-1.5 transition-all duration-300 cursor-pointer ${
                            isSelected 
                              ? 'bg-gradient-to-b from-neutral-800 to-neutral-950 border border-neutral-800 text-[#5194ec] shadow-md shadow-black/40' 
                              : 'text-neutral-500 hover:text-neutral-300 border border-transparent'
                          }`}
                        >
                          <Icon className={`w-3.5 h-3.5 ${isSelected ? 'animate-pulse text-[#5194ec]' : ''}`} />
                          <span className="hidden sm:inline">{tab.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Render Tab Contents */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={sidebarTab}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="w-full"
                    >
                      {/* 1. Grounded Assistant Chat Card */}
                      {sidebarTab === 'chat' && (
                        <div className={`p-6 sm:p-7 rounded-[28px] border ${theme === 'dark' ? 'border-neutral-900/65 bg-neutral-950/35' : 'border-neutral-200 bg-white'} backdrop-blur-xl flex flex-col h-[520px] shadow-2xl relative overflow-hidden`}>
                          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />

                          <div className="flex items-center gap-2 mb-4 text-left">
                            <MessageSquare className="w-5 h-5 text-[#5194ec]" />
                            <h4 className="font-display text-base font-semibold text-white tracking-tight">AI Copilot Desk</h4>
                          </div>

                          {/* Chat messages viewport */}
                          <div className="flex-1 overflow-y-auto space-y-4 pr-1 mb-4 scrollbar-none flex flex-col text-left">
                            {chatHistory.map((msg, i) => (
                              <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end self-end w-[85%]' : 'items-start self-start w-[85%]'}`}>
                                <div className={`p-3.5 rounded-2xl text-xs leading-relaxed font-sans ${
                                  msg.role === 'user'
                                    ? 'bg-[#5194ec] text-white rounded-tr-none text-right'
                                    : 'bg-neutral-900/80 border border-neutral-800/80 text-neutral-300 rounded-tl-none text-left shadow-inner'
                                }`}>
                                  {msg.text}
                                </div>
                                
                                {/* Sources Links */}
                                {msg.sources && msg.sources.length > 0 && (
                                  <div className="flex flex-wrap gap-1.5 mt-1.5 justify-start">
                                    <span className="text-[9px] font-mono text-neutral-500 uppercase self-center mr-1">Sources:</span>
                                    {msg.sources.map((s: any, idx: number) => (
                                      <a
                                        key={idx}
                                        href={s.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        referrerPolicy="no-referrer"
                                        className="text-[9px] text-[#5194ec] hover:underline flex items-center gap-0.5 truncate max-w-[120px] font-sans"
                                      >
                                        {s.title}
                                        <ExternalLink className="w-2 h-2" />
                                      </a>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ))}
                            {chatLoading && (
                              <div className="flex items-center gap-1.5 p-3 rounded-2xl bg-neutral-900/50 border border-neutral-900 text-neutral-500 text-xs w-fit font-sans self-start text-left">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                                Grounding search query...
                              </div>
                            )}
                            <div ref={chatEndRef} />
                          </div>

                          {/* Pre-configured Suggestion Chips */}
                          <div className="flex items-center gap-1.5 overflow-x-auto pb-3 scrollbar-none mb-2">
                            {[
                              "Latest AI regulation",
                              "NVIDIA Blackwell",
                              "Compute standards"
                            ].map((chip) => (
                              <button
                                key={chip}
                                type="button"
                                onClick={() => {
                                  setChatMessage(chip);
                                }}
                                className="text-[9px] font-semibold text-neutral-400 bg-neutral-900 hover:text-white hover:bg-neutral-800 border border-neutral-800/80 px-2.5 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap font-sans"
                              >
                                {chip}
                              </button>
                            ))}
                          </div>

                          {/* Chat Form */}
                          <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                            <input
                              type="text"
                              placeholder="Ask about live announcements..."
                              value={chatMessage}
                              onChange={(e) => setChatMessage(e.target.value)}
                              disabled={chatLoading}
                              className="flex-grow bg-neutral-900/60 border border-neutral-800 focus:border-[#5194ec]/80 focus:outline-none text-xs text-white placeholder-neutral-500 px-3 py-2.5 rounded-xl transition-all font-sans"
                            />
                            <button
                              type="submit"
                              disabled={chatLoading || !chatMessage.trim()}
                              className="p-2.5 bg-[#5194ec] hover:bg-blue-600 text-white rounded-xl transition-all cursor-pointer disabled:opacity-40"
                            >
                              <Send className="w-3.5 h-3.5" />
                            </button>
                          </form>
                        </div>
                      )}

                      {/* 2. Voice Anchor Broadcast */}
                      {sidebarTab === 'voice' && (
                        <VoiceAnchor newsItems={news} />
                      )}

                      {/* 3. Trending Radar Index */}
                      {sidebarTab === 'radar' && (
                        <TrendingRadar />
                      )}

                      {/* 4. Insight Bento Card / Sector Outlook */}
                      {sidebarTab === 'outlook' && (
                        <div className={`p-6 sm:p-7 rounded-[28px] border ${theme === 'dark' ? 'border-neutral-900/65 bg-neutral-950/35' : 'border-neutral-200 bg-white'} backdrop-blur-xl relative overflow-hidden shadow-2xl text-left`}>
                          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl pointer-events-none" />
                          
                          <div className="flex items-center gap-2 mb-6">
                            <TrendingUp className="w-5 h-5 text-[#5194ec]" />
                            <h4 className="font-display text-base font-semibold text-white tracking-tight">AI Sector Outlook</h4>
                          </div>

                          {insightsLoading ? (
                            <div className="space-y-5 animate-pulse">
                              <div className="flex items-center gap-4">
                                <div className="w-16 h-16 bg-neutral-900 rounded-full" />
                                <div className="space-y-2 flex-grow">
                                  <div className="w-20 h-4 bg-neutral-900 rounded" />
                                  <div className="w-12 h-3 bg-neutral-900 rounded" />
                                </div>
                              </div>
                              <div className="space-y-2">
                                <div className="w-full h-4 bg-neutral-900 rounded" />
                                <div className="w-4/5 h-4 bg-neutral-900 rounded" />
                              </div>
                            </div>
                          ) : insights ? (
                            <div className="space-y-6 text-xs text-neutral-300 font-sans">
                              {/* Gauge widget */}
                              <div className="flex items-center gap-4 bg-neutral-900/30 p-4 rounded-2xl border border-neutral-900/50">
                                <div className="relative flex items-center justify-center w-14 h-14 rounded-full bg-blue-500/5 border-2 border-blue-500/10">
                                  <span className="text-lg font-display font-bold text-glow bg-gradient-to-r from-blue-400 to-indigo-300 bg-clip-text text-transparent">
                                    {insights.heatIndex || 85}
                                  </span>
                                  {/* Spinning outer dotted border */}
                                  <div className="absolute inset-[-4px] border border-dashed border-blue-500/20 rounded-full animate-[spin_40s_linear_infinite]" />
                                </div>
                                <div>
                                  <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest block font-mono">
                                    Sector Heat Index
                                  </span>
                                  <span className="text-[11px] text-neutral-300 font-medium mt-0.5 block font-sans">
                                    Extreme development velocity.
                                  </span>
                                </div>
                              </div>

                              {/* Summary */}
                              <div className="space-y-1">
                                <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider block">Sector Brief</span>
                                <p className="leading-relaxed font-normal">
                                  {insights.summary}
                                </p>
                              </div>

                              {/* Under overarching trend */}
                              <div className="space-y-1">
                                <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider block">Key Sector Trend</span>
                                <p className="leading-relaxed font-normal">
                                  {insights.trend}
                                </p>
                              </div>

                              {/* Hot Topics */}
                              <div className="space-y-2">
                                <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider block">Hot Technologies</span>
                                <div className="flex flex-wrap gap-2">
                                  {insights.hotTopics?.map((topic: string, i: number) => (
                                    <span key={i} className="text-[10px] font-semibold text-neutral-300 bg-neutral-900 border border-neutral-800/80 px-2.5 py-1 rounded-lg">
                                      {topic}
                                    </span>
                                  ))}
                                </div>
                              </div>

                              {/* Developer Impact */}
                              <div className="p-4 rounded-xl bg-blue-950/10 border border-blue-500/10 text-[11px] text-neutral-300 leading-relaxed font-normal">
                                <div className="flex items-center gap-1.5 font-bold text-[#5194ec] mb-1.5 uppercase font-mono tracking-wider text-[10px]">
                                  <Sparkles className="w-3.5 h-3.5" />
                                  Developer Action
                                </div>
                                {insights.developerImpact}
                              </div>
                            </div>
                          ) : (
                            <p className="text-xs text-neutral-500 text-center py-4 font-sans">Sync feed to generate smart sector insights.</p>
                          )}
                        </div>
                      )}

                      {/* 5. Cloud Workspace Hub */}
                      {sidebarTab === 'workspace' && (
                        <div className={`p-6 sm:p-7 rounded-[28px] border ${theme === 'dark' ? 'border-neutral-900/65 bg-neutral-950/35' : 'border-neutral-200 bg-white'} backdrop-blur-xl relative overflow-hidden shadow-2xl text-left flex flex-col h-[520px]`}>
                          <div className="absolute top-0 right-0 w-32 h-32 bg-[#5194ec]/5 rounded-full blur-2xl pointer-events-none" />

                          {/* Sub-tabs Selector */}
                          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-neutral-900/60 border border-neutral-900 mb-4 flex-shrink-0">
                            <button
                              onClick={() => setWorkspaceSubTab('briefing')}
                              className={`flex-1 py-1.5 rounded-lg text-[9px] sm:text-[10px] font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                                workspaceSubTab === 'briefing'
                                  ? 'bg-neutral-800 text-[#5194ec] border border-neutral-700/50 shadow-sm'
                                  : 'text-neutral-400 hover:text-neutral-200'
                              }`}
                            >
                              Briefing Architect
                            </button>
                            <button
                              onClick={() => setWorkspaceSubTab('reading')}
                              className={`flex-1 py-1.5 rounded-lg text-[9px] sm:text-[10px] font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                                workspaceSubTab === 'reading'
                                  ? 'bg-neutral-800 text-[#5194ec] border border-neutral-700/50 shadow-sm'
                                  : 'text-neutral-400 hover:text-neutral-200'
                              }`}
                            >
                              Reading Desk
                            </button>
                            <button
                              onClick={() => {
                                setWorkspaceSubTab('speculations');
                                fetchSpeculations();
                              }}
                              className={`flex-1 py-1.5 rounded-lg text-[9px] sm:text-[10px] font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                                workspaceSubTab === 'speculations'
                                  ? 'bg-neutral-800 text-[#5194ec] border border-neutral-700/50 shadow-sm'
                                  : 'text-neutral-400 hover:text-neutral-200'
                              }`}
                            >
                              Communal Stream
                            </button>
                          </div>

                          {/* SUB-TAB 1: AI Briefing Architect */}
                          {workspaceSubTab === 'briefing' && (
                            <div className="flex flex-col flex-1 overflow-hidden">
                              <div className="flex-1 overflow-y-auto space-y-4 pr-1 mb-4 scrollbar-none">
                                {briefingMarkdown ? (
                                  <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                      <span className="text-[10px] font-bold font-mono text-neutral-400 uppercase tracking-widest">
                                        Custom Report View
                                      </span>
                                      <div className="flex gap-2">
                                        <button
                                          onClick={() => setBriefingMarkdown(null)}
                                          className="flex items-center gap-1 text-[9px] font-bold text-neutral-400 hover:text-white transition-colors uppercase bg-neutral-900 px-2 py-1 rounded-md border border-neutral-800"
                                        >
                                          Clear
                                        </button>
                                        {currentUser && (
                                          <button
                                            onClick={saveBriefingToCloud}
                                            className="flex items-center gap-1 text-[9px] font-bold text-emerald-400 hover:text-emerald-300 transition-colors uppercase bg-emerald-500/5 px-2 py-1 rounded-md border border-emerald-500/10"
                                          >
                                            <Check className="w-2.5 h-2.5" />
                                            Save to Cloud
                                          </button>
                                        )}
                                      </div>
                                    </div>
                                    <div className="p-4 rounded-2xl border border-neutral-900 bg-neutral-950/40 text-xs text-neutral-300 font-sans leading-relaxed space-y-4 select-text">
                                      {/* Parse simple markdown tags: #, ##, -, list items */}
                                      {briefingMarkdown.split("\n").map((line, i) => {
                                        if (line.startsWith("# ")) {
                                          return <h1 key={i} className="text-sm font-bold text-white border-b border-neutral-900 pb-1 mt-4">{line.replace("# ", "")}</h1>;
                                        }
                                        if (line.startsWith("## ")) {
                                          return <h2 key={i} className="text-xs font-bold text-[#5194ec] mt-3">{line.replace("## ", "")}</h2>;
                                        }
                                        if (line.startsWith("- ") || line.startsWith("* ")) {
                                          return <li key={i} className="ml-3 list-disc pl-1">{line.replace(/^[-*]\s+/, "")}</li>;
                                        }
                                        if (line.trim() === "") {
                                          return <div key={i} className="h-2" />;
                                        }
                                        return <p key={i}>{line}</p>;
                                      })}
                                    </div>
                                  </div>
                                ) : (
                                  <div className="flex flex-col items-center justify-center text-center py-8 space-y-4">
                                    <div className="w-12 h-12 rounded-full bg-blue-500/5 border border-blue-500/10 flex items-center justify-center text-blue-400">
                                      <Sparkles className="w-5 h-5 animate-pulse" />
                                    </div>
                                    <div className="space-y-1">
                                      <h5 className="text-xs font-bold text-white font-sans">Synthesize Your Custom Briefing</h5>
                                      <p className="text-[11px] text-neutral-400 max-w-[220px] mx-auto leading-normal">
                                        Compiles your tracked categories and {bookmarks.length} bookmarked high-signal items into an executive strategic outlook report.
                                      </p>
                                    </div>

                                    <button
                                      onClick={generateCustomBriefing}
                                      disabled={briefingLoading}
                                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-b from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white text-xs font-bold transition-all shadow-md cursor-pointer disabled:opacity-50"
                                    >
                                      {briefingLoading ? (
                                        <>
                                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                          <span>Synthesizing...</span>
                                        </>
                                      ) : (
                                        <>
                                          <Sparkles className="w-3.5 h-3.5" />
                                          <span>Compile Custom Briefing</span>
                                        </>
                                      )}
                                    </button>
                                  </div>
                                )}

                                {/* Past Briefings History */}
                                {savedBriefings.length > 0 && (
                                  <div className="border-t border-neutral-900 pt-4 mt-6">
                                    <div className="flex items-center gap-1.5 mb-2.5">
                                      <History className="w-3.5 h-3.5 text-neutral-400" />
                                      <span className="text-[9px] font-bold font-mono text-neutral-500 uppercase tracking-wider">
                                        Saved briefings history ({savedBriefings.length})
                                      </span>
                                    </div>
                                    <div className="space-y-2">
                                      {savedBriefings.map((b: any) => (
                                        <div key={b.id} className="flex items-center justify-between p-2.5 rounded-xl bg-neutral-900/40 border border-neutral-900 text-[11px] transition-all">
                                          <button
                                            onClick={() => setBriefingMarkdown(b.markdown)}
                                            className="font-medium text-neutral-300 hover:text-white truncate text-left max-w-[180px] cursor-pointer"
                                          >
                                            📅 Report - {new Date(b.createdAt).toLocaleDateString()}
                                          </button>
                                          <button
                                            onClick={() => deleteBriefingFromCloud(b.id)}
                                            className="text-[9px] text-rose-400 hover:text-rose-300 cursor-pointer font-bold px-1.5 py-0.5"
                                          >
                                            Delete
                                          </button>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          {/* SUB-TAB: Reading Desk Progress & Queue */}
                          {workspaceSubTab === 'reading' && (
                            <div className="flex flex-col flex-1 overflow-hidden text-left">
                              <div className="flex-1 overflow-y-auto space-y-3.5 pr-1 mb-2 scrollbar-none">
                                <div className="text-left space-y-1 mb-2 select-none">
                                  <span className="text-[9px] font-bold font-mono text-neutral-500 uppercase tracking-widest block">
                                    Tracked Reading Queue
                                  </span>
                                  <p className="text-[10px] text-neutral-400 font-sans leading-normal">Continue skimming or deep reading saved high-signal articles below.</p>
                                </div>

                                {(() => {
                                  // Find articles from the news array that are either bookmarked or have reading progress tracked
                                  const savedItems = news.filter(item => bookmarks.includes(item.url) || (viewedTabs[item.url] && viewedTabs[item.url].length > 0));
                                  
                                  if (savedItems.length === 0) {
                                    return (
                                      <div className="text-center py-12 space-y-2 select-none">
                                        <BookOpen className="w-6 h-6 mx-auto text-neutral-700 animate-pulse" />
                                        <p className="text-[10px] text-neutral-500 font-mono">Your Reading Desk is Empty.</p>
                                        <p className="text-[9px] text-neutral-600 max-w-[180px] mx-auto leading-normal">Bookmark intelligence articles or read summaries to track development nodes here.</p>
                                      </div>
                                    );
                                  }

                                  return savedItems.map((item, idx) => {
                                    const viewed = viewedTabs[item.url] || [];
                                    const progressPercent = Math.min(100, Math.round((viewed.length / 6) * 100));
                                    
                                    return (
                                      <div key={idx} className="p-3.5 rounded-xl border border-neutral-900 bg-neutral-950/40 hover:border-neutral-800/80 hover:bg-[#060606]/90 transition-all duration-300 space-y-3">
                                        <div className="flex justify-between items-start gap-2.5">
                                          <button
                                            onClick={() => {
                                              setActiveReadingArticle(item);
                                              markAsRead(item.url);
                                            }}
                                            className="text-xs font-bold text-neutral-200 hover:text-[#5194ec] transition-colors text-left font-display leading-snug line-clamp-2 cursor-pointer"
                                          >
                                            {item.title}
                                          </button>
                                          <span className="text-[8px] font-bold font-mono text-neutral-500 bg-neutral-900 border border-neutral-800 px-1.5 py-0.5 rounded flex-shrink-0 uppercase tracking-wider">
                                            {item.category}
                                          </span>
                                        </div>

                                        {/* Progress Bar */}
                                        <div className="space-y-1.5">
                                          <div className="flex justify-between items-center text-[9px] font-mono text-neutral-500">
                                            <span>Skim metrics: {viewed.length === 0 ? "Not skimmed" : viewed.length === 6 ? "Analyst Mastered" : `${viewed.length}/6 items viewed`}</span>
                                            <span className="font-bold text-neutral-400">{progressPercent}%</span>
                                          </div>
                                          <div className="h-1 bg-neutral-900 rounded-full overflow-hidden">
                                            <div 
                                              className="h-full bg-gradient-to-r from-blue-500 to-[#5194ec] rounded-full transition-all duration-500" 
                                              style={{ width: `${progressPercent}%` }}
                                            />
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  });
                                })()}
                              </div>
                            </div>
                          )}

                          {/* SUB-TAB 2: Communal Speculations Board */}
                          {workspaceSubTab === 'speculations' && (
                            <div className="flex flex-col flex-1 overflow-hidden">
                              
                              {/* Post speculation form (collapsible / header form) */}
                              {currentUser ? (
                                <form onSubmit={handlePostSpeculation} className="mb-4 p-3.5 rounded-2xl border border-neutral-900 bg-neutral-950/50 flex-shrink-0 space-y-2.5">
                                  <div className="flex items-center justify-between gap-2">
                                    <input
                                      type="text"
                                      required
                                      value={speculationTitle}
                                      onChange={(e) => setSpeculationTitle(e.target.value)}
                                      placeholder="Speculation Title (e.g. GPT-5 Compute Speculation)"
                                      className="flex-grow px-2.5 py-1.5 text-xs rounded-lg border border-neutral-800 bg-neutral-950 text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-blue-500/40 focus:ring-1 focus:ring-blue-500/20 font-sans"
                                    />
                                    <select
                                      value={speculationCategory}
                                      onChange={(e) => setSpeculationCategory(e.target.value)}
                                      className="px-2 py-1.5 text-[10px] font-bold rounded-lg border border-neutral-800 bg-neutral-950 text-neutral-400 focus:outline-none focus:border-blue-500/40 font-mono uppercase"
                                    >
                                      {["Models", "Hardware", "Regulation", "Business", "Applications"].map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                      ))}
                                    </select>
                                  </div>
                                  <textarea
                                    required
                                    value={speculationContent}
                                    onChange={(e) => setSpeculationContent(e.target.value)}
                                    placeholder="Share your speculative forecasts, hardware production yields, or sector analyses..."
                                    className="w-full h-14 p-2.5 rounded-lg border border-neutral-800 bg-neutral-950 text-xs text-neutral-300 placeholder-neutral-600 focus:outline-none focus:border-blue-500/40 resize-none font-sans"
                                  />
                                  <div className="flex justify-end">
                                    <button
                                      type="submit"
                                      disabled={speculationLoading}
                                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-[10px] font-bold text-white transition-all cursor-pointer shadow-sm active:translate-y-[0.5px]"
                                    >
                                      {speculationLoading ? (
                                        <Loader2 className="w-3 h-3 animate-spin text-white" />
                                      ) : (
                                        <>
                                          <Send className="w-3 h-3" />
                                          <span>Broadcast Speculation</span>
                                        </>
                                      )}
                                    </button>
                                  </div>
                                </form>
                              ) : (
                                <div className="mb-4 p-3.5 rounded-2xl border border-neutral-900/60 bg-neutral-950/25 flex-shrink-0 text-center">
                                  <p className="text-[10px] text-neutral-400 font-sans mb-2">
                                    🔒 Authenticate to join the decentralised technical speculations stream.
                                  </p>
                                  <button
                                    onClick={() => {
                                      setAuthMode('login');
                                      setAuthError(null);
                                      setIsAuthModalOpen(true);
                                    }}
                                    className="px-3 py-1 rounded-lg border border-[#5194ec]/20 bg-[#5194ec]/10 text-[#5194ec] hover:bg-[#5194ec]/15 text-[9px] font-bold uppercase tracking-wider transition-all cursor-pointer"
                                  >
                                    Sign In / Guest Access
                                  </button>
                                </div>
                              )}

                              {/* Speculations Stream Feed list */}
                              <div className="flex-1 overflow-y-auto space-y-3.5 pr-1 mb-2 scrollbar-none">
                                {speculations.length > 0 ? (
                                  speculations.map((spec) => {
                                    const isLiked = currentUser ? (spec.likes || []).includes(currentUser.uid) : false;
                                    return (
                                      <div key={spec.id} className="p-4 rounded-2xl border border-neutral-900 bg-neutral-950/20 text-left space-y-2 relative overflow-hidden transition-all hover:border-neutral-800/80">
                                        <div className="flex items-center justify-between">
                                          <div className="flex items-center gap-2">
                                            <span className="text-[9px] font-bold font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/15 uppercase tracking-wider">
                                              {spec.category}
                                            </span>
                                            <span className="text-[9px] text-neutral-500 font-mono">
                                              posted by @{spec.authorName || "anon"}
                                            </span>
                                          </div>
                                          <span className="text-[9px] text-neutral-600 font-mono">
                                            {spec.createdAt ? new Date(spec.createdAt).toLocaleDateString() : ""}
                                          </span>
                                        </div>

                                        <h6 className="text-xs font-bold text-white tracking-tight">{spec.title}</h6>
                                        <p className="text-[11px] text-neutral-300 leading-normal font-sans select-text">{spec.content}</p>

                                        <div className="flex items-center justify-between pt-1 border-t border-neutral-900/60 mt-1">
                                          <button
                                            onClick={() => handleLikeSpeculation(spec.id, spec.likes || [])}
                                            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border text-[10px] font-mono font-bold transition-all cursor-pointer ${
                                              isLiked 
                                                ? 'bg-rose-500/10 text-rose-400 border-rose-500/20 shadow-inner'
                                                : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:text-neutral-300'
                                            }`}
                                          >
                                            ❤️ <span className="text-[10px]">{spec.likesCount || 0}</span>
                                          </button>
                                          
                                          <span className="text-[8px] font-bold font-mono text-neutral-600 uppercase tracking-widest flex items-center gap-1">
                                            <span className="w-1.5 h-1.5 rounded-full bg-blue-400/60 animate-pulse" />
                                            Signal Verified
                                          </span>
                                        </div>
                                      </div>
                                    );
                                  })
                                ) : (
                                  <div className="text-center py-6">
                                    <p className="text-[10px] text-neutral-500 font-mono">Decentralized Speculations Ledger is Empty.</p>
                                  </div>
                                )}
                              </div>

                            </div>
                          )}

                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>

                </div>

              </div>

            </div>
          </div>

          {/* Real-time Bloomberg-style Global Terminal Footer */}
          <footer className="w-full bg-[#030303]/90 border-t border-neutral-900/80 py-8 px-6 md:px-12 mt-12 relative z-20 backdrop-blur-md">
            <div className="w-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 text-left font-sans">
              {/* Brand & Meta info */}
              <div className="md:col-span-4 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-[#5194ec] font-bold tracking-wider font-mono text-xs">AI X</span>
                  <span className="text-[10px] font-mono text-neutral-600 bg-neutral-900 border border-neutral-800 px-1.5 py-0.5 rounded uppercase">SYSTEM v4.2</span>
                </div>
                <p className="text-xs text-neutral-500 max-w-sm leading-relaxed">
                  The Bloomberg Terminal for Artificial Intelligence. Grounded, real-time machine intelligence tracking, research papers index, model benchmarks, and strategic enterprise reports.
                </p>
                <p className="text-[10px] text-neutral-600 font-mono">
                  © 2026 AI X Corporation. All rights reserved.
                </p>
              </div>

              {/* Subsystem status logs */}
              <div className="md:col-span-5 space-y-2 font-mono text-[10px] text-neutral-500">
                <span className="font-bold text-neutral-600 uppercase tracking-wider block mb-1 select-none">REAL-TIME SUBSYSTEM STATUS</span>
                <div className="grid grid-cols-2 gap-x-6 gap-y-1.5">
                  <div className="flex items-center justify-between border-b border-neutral-900 pb-1">
                    <span>SECURE BOUNDARY CHECK</span>
                    <span className="text-emerald-400 font-bold">ACTIVE</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-neutral-900 pb-1">
                    <span>LLM LATENCY TUNING</span>
                    <span className="text-emerald-400 font-bold">280ms (Avg)</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-neutral-900 pb-1">
                    <span>VECTOR GRAPH ENGINES</span>
                    <span className="text-emerald-400 font-bold">STABLE</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-neutral-900 pb-1">
                    <span>AGI COUNTER CALC</span>
                    <span className="text-blue-400 font-bold">T-MINUS 2.8Y</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>DEEP SEARCH CITATIONS</span>
                    <span className="text-emerald-400 font-bold">ONLINE</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>FIREBASE DATA SYNC</span>
                    <span className="text-emerald-400 font-bold">SYNCHRONIZED</span>
                  </div>
                </div>
              </div>

              {/* Direct quick navigation links */}
              <div className="md:col-span-3 space-y-2">
                <span className="font-mono text-[10px] text-neutral-600 font-bold uppercase tracking-wider block mb-1 select-none">QUICK LINKS</span>
                <div className="flex flex-col gap-2 text-xs">
                  <a href="#stats-section" className="text-neutral-500 hover:text-white transition-colors">AI Intelligence Dashboard</a>
                  <a href="#" className="text-neutral-500 hover:text-white transition-colors" onClick={(e) => { e.preventDefault(); setIsShortcutModalOpen(true); }}>Terminal Keyboard Shortcuts</a>
                  <a href="#" className="text-neutral-500 hover:text-white transition-colors" onClick={(e) => { e.preventDefault(); setIsModalOpen(true); }}>Access Terms & Disclaimers</a>
                </div>
              </div>
            </div>
          </footer>

        </div>
      </motion.div>

      {/* Modern Interactive Onboarding Dialog / Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="relative w-full max-w-md bg-[#0a0a0a] border border-neutral-800 rounded-3xl p-6 sm:p-8 overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.85)] z-10"
            >
              {/* Glare effect inside modal */}
              <div className="absolute -top-[20%] -left-[20%] w-[60%] h-[60%] bg-blue-500/10 rounded-full blur-[60px] pointer-events-none" />

              {/* Title & Description */}
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20">
                  <Sparkles className="w-5 h-5 text-blue-400" />
                </div>
                <h3 className="font-display text-xl font-semibold text-white tracking-tight">Welcome to AI X Intel</h3>
              </div>

              <p className="text-neutral-400 text-sm leading-relaxed mb-6 font-sans">
                Explore the frontier of AI research, breaking news, and industry advancements. Our full-stack engine utilizes real-time Google Search Grounding to extract, synthesize, and categorize critical tech events.
              </p>

              {/* Key Features Quicklist */}
              <div className="space-y-3 mb-6 font-sans">
                <div className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2" />
                  <p className="text-neutral-300 text-xs sm:text-sm">
                    <span className="font-semibold text-white font-sans">Search Grounding:</span> Powered by Gemini with live web results.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2" />
                  <p className="text-neutral-300 text-xs sm:text-sm">
                    <span className="font-semibold text-white font-sans">Sector Outlook:</span> Heat indexes, briefs, and developer impacts.
                  </p>
                </div>
              </div>

              {/* Close / Action button */}
              <div className="flex justify-end">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-white text-black font-semibold text-xs hover:bg-neutral-200 active:scale-95 transition-all cursor-pointer"
                >
                  Dismiss Overview
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Keyboard Shortcuts Modal */}
      <AnimatePresence>
        {isShortcutModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsShortcutModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="relative w-full max-w-sm bg-[#0a0a0a] border border-neutral-800 rounded-3xl p-6 sm:p-7 overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.85)] z-10"
            >
              <div className="absolute -top-[20%] -left-[20%] w-[60%] h-[60%] bg-[#5194ec]/10 rounded-full blur-[60px] pointer-events-none" />

              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                  <Keyboard className="w-5 h-5 text-indigo-400" />
                </div>
                <h3 className="font-display text-lg font-semibold text-white tracking-tight">System Shortcuts</h3>
              </div>

              <div className="space-y-3.5 mb-6 font-mono text-xs text-neutral-400">
                <div className="flex items-center justify-between border-b border-neutral-900/60 pb-2">
                  <span>Search News</span>
                  <kbd className="px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-white font-mono text-[10px] uppercase font-bold shadow-sm">S</kbd>
                </div>
                <div className="flex items-center justify-between border-b border-neutral-900/60 pb-2">
                  <span>Refresh Feed</span>
                  <kbd className="px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-white font-mono text-[10px] uppercase font-bold shadow-sm">R</kbd>
                </div>
                <div className="flex items-center justify-between border-b border-neutral-900/60 pb-2">
                  <span>View Bookmarks</span>
                  <kbd className="px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-white font-mono text-[10px] uppercase font-bold shadow-sm">B</kbd>
                </div>
                <div className="flex items-center justify-between">
                  <span>Toggle Guide</span>
                  <kbd className="px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-white font-mono text-[10px] uppercase font-bold shadow-sm">K</kbd>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => setIsShortcutModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 font-semibold text-xs active:scale-95 transition-all cursor-pointer border border-neutral-800"
                >
                  Dismiss Guide
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Gemini Diagnostics Modal */}
      <AnimatePresence>
        {isGeminiDiagnosticModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsGeminiDiagnosticModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="relative w-full max-w-lg bg-[#0a0a0a] border border-neutral-800 rounded-3xl p-6 sm:p-7 overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.85)] z-10"
            >
              <div className="absolute -top-[20%] -left-[20%] w-[60%] h-[60%] bg-blue-500/10 rounded-full blur-[60px] pointer-events-none" />

              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20">
                    <Activity className="w-5 h-5 text-blue-400" />
                  </div>
                  <h3 className="font-display text-lg font-semibold text-white tracking-tight">AI Key Diagnostics</h3>
                </div>
                <button
                  onClick={() => setIsGeminiDiagnosticModalOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-neutral-900 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                >
                  <CloseIcon className="w-4 h-4" />
                </button>
              </div>

              {/* Status Banner */}
              <div className={`p-4 rounded-2xl border mb-5 flex gap-3 ${
                isDiagnosticRunning 
                  ? 'bg-blue-500/5 border-blue-500/20 text-blue-300' 
                  : geminiStatus?.status === 'quota_exceeded'
                    ? 'bg-amber-500/5 border-amber-500/20 text-amber-300'
                    : geminiStatus?.success 
                      ? 'bg-green-500/5 border-green-500/20 text-green-300' 
                      : 'bg-amber-500/5 border-amber-500/20 text-amber-300'
              }`}>
                {isDiagnosticRunning ? (
                  <Loader2 className="w-5 h-5 animate-spin shrink-0 text-blue-400 mt-0.5" />
                ) : geminiStatus?.status === 'quota_exceeded' ? (
                  <AlertCircle className="w-5 h-5 shrink-0 text-amber-400 mt-0.5" />
                ) : geminiStatus?.success ? (
                  <Check className="w-5 h-5 shrink-0 text-green-400 mt-0.5 border border-green-500/30 rounded-full p-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 shrink-0 text-amber-400 mt-0.5" />
                )}
                <div className="flex flex-col text-xs leading-relaxed text-left">
                  <span className="font-bold text-sm text-white">
                    {isDiagnosticRunning 
                      ? 'Running Live Connection Test...' 
                      : geminiStatus?.status === 'quota_exceeded'
                        ? 'Key Valid (Quota Exceeded)'
                        : geminiStatus?.success 
                          ? 'Active & Connected' 
                          : 'Demo Fallback Mode'}
                  </span>
                  <p className="text-neutral-400 mt-1">
                    {isDiagnosticRunning 
                      ? 'Re-checking credentials and performing a lightweight model generation query.' 
                      : geminiStatus?.message || geminiStatus?.reason || 'The application is running in local offline demo mode.'}
                  </p>
                </div>
              </div>

              {/* Diagnostic Parameters */}
              <div className="space-y-3.5 mb-6 text-xs bg-neutral-950/40 border border-neutral-900 rounded-2xl p-4 font-mono text-neutral-400 text-left">
                <div className="flex items-center justify-between pb-2 border-b border-neutral-900/40">
                  <span className="text-neutral-500 font-sans font-medium">Environment Secret Key</span>
                  <span className={`text-[11px] font-bold ${geminiStatus?.hasKey && !geminiStatus?.isPlaceholder ? 'text-green-400' : 'text-amber-400'}`}>
                    {geminiStatus?.hasKey ? (geminiStatus?.isPlaceholder ? 'Default Placeholder' : 'Key Configured') : 'Not Detected'}
                  </span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-neutral-900/40">
                  <span className="text-neutral-500 font-sans font-medium">Masked Value</span>
                  <span className="text-white text-[11px] bg-neutral-900 px-2 py-0.5 rounded border border-neutral-800">
                    {geminiStatus?.maskedKey || 'None'}
                  </span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-neutral-900/40">
                  <span className="text-neutral-500 font-sans font-medium">Key Character Length</span>
                  <span>{geminiStatus?.keyLength || 0} characters</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-500 font-sans font-medium">Auto-Quotes Stripped</span>
                  <span className={geminiStatus?.hadQuotes ? 'text-amber-400 font-bold' : 'text-neutral-500'}>
                    {geminiStatus?.hadQuotes ? 'Yes (Enclosing Quotes Cleaned!)' : 'No'}
                  </span>
                </div>
              </div>

              {/* Troubleshooting logs if errored */}
              {geminiStatus?.errorMessage && (
                <div className="mb-6 text-left">
                  <span className="text-[10px] font-bold text-rose-400 font-sans uppercase tracking-wider block mb-2">Live Error Details (From Google Servers)</span>
                  <div className="p-3 bg-rose-500/5 border border-rose-500/10 rounded-xl font-mono text-[11px] text-rose-300 max-h-[120px] overflow-y-auto leading-relaxed whitespace-pre-wrap">
                    {geminiStatus.errorName || 'GoogleGenAIError'}: {geminiStatus.errorMessage}
                    {geminiStatus.errorStatus && `\nStatus Code: ${geminiStatus.errorStatus}`}
                  </div>
                </div>
              )}

              {/* Instructions on Setup */}
              <div className="p-4 bg-neutral-950/60 border border-neutral-900 rounded-2xl mb-6 text-xs text-left">
                <span className="font-semibold text-white block mb-2.5">How to set up your API Key:</span>
                <ol className="space-y-2 text-neutral-400 list-decimal pl-4 leading-relaxed">
                  <li>Get a free Gemini API key from the <a href="https://aistudio.google.com/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Google AI Studio console</a>.</li>
                  <li>Click on the <strong className="text-white font-medium">Settings (Gear Icon)</strong> in the top-right corner of this AI Studio sandbox window.</li>
                  <li>Select the <strong className="text-white font-medium">Secrets</strong> tab in the menu.</li>
                  <li>Add a new secret named <code className="text-white bg-neutral-900 px-1 py-0.5 rounded border border-neutral-800 font-mono text-[11px]">GEMINI_API_KEY</code> and paste your key.</li>
                  <li>Click <strong className="text-white font-medium">Save</strong>, then click the <strong className="text-blue-400 hover:underline cursor-pointer" onClick={runGeminiDiagnostic}>Test Connection</strong> button below!</li>
                </ol>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between gap-3">
                <button
                  onClick={runGeminiDiagnostic}
                  disabled={isDiagnosticRunning}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs cursor-pointer active:scale-95 disabled:scale-100 disabled:opacity-50 transition-all shadow-[0_4px_12px_rgba(59,130,246,0.3)]"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isDiagnosticRunning ? 'animate-spin' : ''}`} />
                  <span>{isDiagnosticRunning ? 'Testing...' : 'Re-run Test Connection'}</span>
                </button>
                <button
                  onClick={() => setIsGeminiDiagnosticModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 font-bold text-xs active:scale-95 transition-all cursor-pointer border border-neutral-800"
                >
                  Close Diagnostics
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Universal Search & Discovery Engine */}
      <UniversalSearchOverlay
        isOpen={isSearchPaletteOpen}
        onClose={() => setIsSearchPaletteOpen(false)}
        theme={theme}
        news={news}
        bookmarks={bookmarks}
        onToggleBookmark={toggleBookmark}
        userNotes={userNotes}
        onSaveNote={handleSaveNote}
        onOpenArticle={(item) => {
          setActiveReadingArticle(item);
          markAsRead(item.url);
        }}
        onAskAI={(msg) => {
          setChatMessage(msg);
          setSidebarTab('chat');
          setTimeout(() => {
            document.getElementById('sidebar-tabs-container')?.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }}
        onOpenCompany={(slug) => setActiveCompanySlug(slug)}
        onOpenModel={(slug) => setActiveModelSlug(slug)}
        onOpenResearch={handleOpenResearchPage}
      />

      {/* Full Stack Authentication Modal */}
      <AnimatePresence>
        {isAuthModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAuthModalOpen(false)}
              className="absolute inset-0 bg-black/85 backdrop-blur-md"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="relative w-full max-w-md bg-[#0a0a0a] border border-neutral-800 rounded-3xl p-6 sm:p-8 overflow-hidden shadow-[0_30px_70px_rgba(0,0,0,0.9)] z-10 font-sans"
            >
              {/* Decorative top lights */}
              <div className="absolute -top-[30%] -right-[30%] w-[70%] h-[70%] bg-blue-500/10 rounded-full blur-[80px] pointer-events-none" />
              <div className="absolute -bottom-[30%] -left-[30%] w-[70%] h-[70%] bg-indigo-500/5 rounded-full blur-[80px] pointer-events-none" />

              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl bg-blue-500/10 border border-blue-500/20 shadow-inner">
                    <Users className="w-5 h-5 text-[#5194ec]" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-semibold text-white tracking-tight">AI X Full-Stack Identity</h3>
                    <p className="text-[10px] text-neutral-500 font-mono mt-0.5">SECURE FIREBASE WORKSPACE</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsAuthModalOpen(false)}
                  className="p-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-500 hover:text-white transition-colors cursor-pointer"
                >
                  <CloseIcon className="w-4 h-4" />
                </button>
              </div>

              {authError && (
                <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold leading-normal mb-4 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>{authError}</span>
                </div>
              )}

              <form onSubmit={handleAuthSubmit} className="space-y-4">
                {/* Sign in with Google (Pre-enabled & Recommended) */}
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={authLoading}
                  className="w-full py-3.5 rounded-xl bg-white hover:bg-neutral-150 active:scale-[0.98] text-neutral-950 text-xs font-bold tracking-wider uppercase transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg font-sans"
                >
                  {authLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin text-neutral-900" />
                  ) : (
                    <>
                      <Globe className="w-4 h-4 text-blue-600" />
                      <span>Sign In with Google (Instant Sync)</span>
                    </>
                  )}
                </button>

                <div className="relative flex py-2 items-center">
                  <div className="flex-grow border-t border-neutral-900"></div>
                  <span className="flex-shrink mx-3 text-[10px] font-mono text-neutral-600 uppercase tracking-widest">Or login via credentials</span>
                  <div className="flex-grow border-t border-neutral-900"></div>
                </div>

                <div>
                  <label className="text-[10px] font-bold font-mono text-neutral-500 uppercase tracking-widest block mb-1.5">Email Address</label>
                  <input
                    type="email"
                    required
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full px-4 py-3 rounded-xl border border-neutral-800 bg-neutral-950/80 text-sm text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-[#5194ec]/40 focus:ring-1 focus:ring-[#5194ec]/20 transition-all font-sans"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold font-mono text-neutral-500 uppercase tracking-widest block mb-1.5">Password</label>
                  <input
                    type="password"
                    required
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    placeholder="Enter password (min 6 chars)"
                    className="w-full px-4 py-3 rounded-xl border border-neutral-800 bg-neutral-950/80 text-sm text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-[#5194ec]/40 focus:ring-1 focus:ring-[#5194ec]/20 transition-all font-sans"
                  />
                </div>

                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full py-3 rounded-xl bg-gradient-to-b from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white text-xs font-bold tracking-wider uppercase transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
                >
                  {authLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                  ) : (
                    <span>{authMode === 'login' ? 'Sign In to Workspace' : 'Create Cloud Workspace'}</span>
                  )}
                </button>
              </form>

              {/* Guest option */}
              <div className="relative flex py-4 items-center">
                <div className="flex-grow border-t border-neutral-900"></div>
                <span className="flex-shrink mx-3 text-[10px] font-mono text-neutral-600 uppercase tracking-widest">Or Instant Guest Access</span>
                <div className="flex-grow border-t border-neutral-900"></div>
              </div>

              <button
                type="button"
                onClick={handleGuestLogin}
                disabled={authLoading}
                className="w-full py-3 rounded-xl border border-neutral-800 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white text-xs font-bold tracking-wider uppercase transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                <span>1-Click Anonymous Guest Sign In</span>
              </button>

              {/* Sandbox Bypass option for users blocked by 2SV/domains */}
              <div className="relative flex py-4 items-center">
                <div className="flex-grow border-t border-neutral-900"></div>
                <span className="flex-shrink mx-3 text-[10px] font-mono text-amber-500/80 uppercase tracking-widest">Blocked by 2SV / Domain restrictions?</span>
                <div className="flex-grow border-t border-neutral-900"></div>
              </div>

              <button
                type="button"
                onClick={() => enableSandboxMode("Sandbox Explorer")}
                className="w-full py-3.5 rounded-xl border border-amber-500/20 bg-amber-500/10 hover:bg-amber-500/15 text-amber-400 hover:text-amber-300 text-xs font-bold tracking-wider uppercase transition-all cursor-pointer flex items-center justify-center gap-2 shadow-inner"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                <span>✨ 1-Click Offline Sandbox Bypass</span>
              </button>

              <div className="mt-5 text-center text-xs text-neutral-500">
                {authMode === 'login' ? (
                  <span>
                    New to AI X full-stack?{" "}
                    <button
                      type="button"
                      onClick={() => setAuthMode('signup')}
                      className="text-[#5194ec] hover:underline font-semibold cursor-pointer"
                    >
                      Create Account
                    </button>
                  </span>
                ) : (
                  <span>
                    Already have an account?{" "}
                    <button
                      type="button"
                      onClick={() => setAuthMode('login')}
                      className="text-[#5194ec] hover:underline font-semibold cursor-pointer"
                    >
                      Sign In instead
                    </button>
                  </span>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Floating Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.24, ease: "easeOut" }}
            className="fixed bottom-6 right-6 z-[100] flex items-center gap-3 bg-[#0c0c0c]/90 border border-[#5194ec]/25 px-5 py-3.5 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.7)] text-white text-xs sm:text-sm font-sans backdrop-blur-xl"
          >
            <div className="flex items-center gap-2.5">
              <div className="p-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex-shrink-0">
                <Check className="w-4 h-4 text-emerald-400" />
              </div>
              <span className="font-medium tracking-wide">{toast}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Full Screen Immersive Article Page Reader Overlay */}
      <AnimatePresence>
        {activeReadingArticle && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-0 z-50 overflow-hidden"
          >
            <ArticleReaderPage
              article={activeReadingArticle}
              onClose={() => setActiveReadingArticle(null)}
              isBookmarked={bookmarks.includes(activeReadingArticle.url)}
              isRead={readArticles.includes(activeReadingArticle.url)}
              onToggleBookmark={() => toggleBookmark(activeReadingArticle.url)}
              onToggleRead={() => toggleReadStatus(activeReadingArticle.url)}
              userNotes={userNotes}
              onSaveNote={handleSaveNote}
              allArticles={news}
              onOpenArticle={(art) => {
                setActiveReadingArticle(art);
                markAsRead(art.url);
              }}
              onTranslate={handleTranslateArticle}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Full Screen Immersive Company Profile Overlay */}
      <AnimatePresence>
        {activeCompanySlug && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-0 z-50 overflow-hidden"
          >
            <CompanyProfilePage
              slug={activeCompanySlug}
              onBack={() => setActiveCompanySlug(null)}
              currentUser={currentUser}
              onTriggerToast={(msg) => triggerToast(msg)}
              onOpenArticle={(art) => {
                setActiveReadingArticle(art);
                markAsRead(art.url);
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Full Screen Immersive Model Profile Overlay */}
      <AnimatePresence>
        {activeModelSlug && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-0 z-50 overflow-hidden"
          >
            <ModelProfilePage
              slug={activeModelSlug}
              onBack={() => setActiveModelSlug(null)}
              currentUser={currentUser}
              onTriggerToast={(msg) => triggerToast(msg)}
              onOpenArticle={(art) => {
                setActiveReadingArticle(art);
                markAsRead(art.url);
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Full Screen Immersive Research Paper Overlay */}
      <AnimatePresence>
        {activeResearchSlug && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-0 z-50 overflow-hidden"
          >
            <ResearchPaperPage
              slug={activeResearchSlug}
              onBack={() => {
                setActiveResearchSlug(null);
                window.history.pushState(null, '', '/');
              }}
              onTriggerToast={(msg) => triggerToast(msg)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Full Screen Immersive Benchmark Dashboard Overlay */}
      <AnimatePresence>
        {isBenchmarksPage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-0 z-50 overflow-hidden"
          >
            <BenchmarkDashboardPage
              onBack={() => {
                setIsBenchmarksPage(false);
                window.history.pushState(null, '', '/');
              }}
              onOpenModel={(slug) => setActiveModelSlug(slug)}
              onOpenCompany={(slug) => setActiveCompanySlug(slug)}
              onOpenResearch={(slug) => setActiveResearchSlug(slug)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Full Screen Immersive Workspace Overlay */}
      <AnimatePresence>
        {isWorkspacePage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-0 z-50 overflow-hidden"
          >
            <WorkspacePage
              onBack={() => {
                setIsWorkspacePage(false);
                window.history.pushState(null, '', '/');
              }}
              currentUser={currentUser}
              news={news}
              bookmarks={bookmarks}
              toggleBookmark={toggleBookmark}
              readArticles={readArticles}
              toggleReadStatus={toggleReadStatus}
              onOpenModel={(slug) => setActiveModelSlug(slug)}
              onOpenCompany={(slug) => setActiveCompanySlug(slug)}
              onOpenResearch={(slug) => handleOpenResearchPage(slug)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Full Screen Immersive Community Platform Overlay */}
      <AnimatePresence>
        {currentCommunityPath !== null && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-0 z-50 overflow-hidden"
          >
            <CommunityPage
              onBack={() => {
                setCurrentCommunityPath(null);
                window.history.pushState(null, '', '/');
              }}
              currentUser={currentUser}
              theme={theme}
              currentPath={currentCommunityPath || '/community'}
              onNavigate={(route) => {
                setCurrentCommunityPath(route);
                window.history.pushState(null, '', route);
              }}
              onOpenModel={(slug) => setActiveModelSlug(slug)}
              onOpenCompany={(slug) => setActiveCompanySlug(slug)}
              onOpenResearch={(slug) => handleOpenResearchPage(slug)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Persistent AI Copilot Companion Panel */}
      <AICopilot
        theme={theme}
        activeContextType={
          activeReadingArticle ? 'article' :
          activeModelSlug ? 'model' :
          activeCompanySlug ? 'company' :
          activeResearchSlug ? 'research' :
          isBenchmarksPage ? 'benchmark' :
          isWorkspacePage ? 'workspace' : 'general'
        }
        activeContextData={
          activeReadingArticle ||
          (activeModelSlug ? { id: activeModelSlug, name: activeModelSlug.replace('-', ' ').toUpperCase() } : null) ||
          (activeCompanySlug ? { id: activeCompanySlug, name: activeCompanySlug.replace('-', ' ').toUpperCase() } : null) ||
          (activeResearchSlug ? { id: activeResearchSlug, title: activeResearchSlug.replace('-', ' ').toUpperCase() } : null) ||
          (isBenchmarksPage ? { name: "Live Benchmarks & Leaderboards" } : null) ||
          (isWorkspacePage ? { name: "Personal Workspace & Knowledge Hub" } : null) ||
          null
        }
        onAddNote={handleAddNoteFromCopilot}
        onSwitchTab={(tab) => {
          if (tab === 'workspace') {
            setIsWorkspacePage(true);
            setIsBenchmarksPage(false);
          } else if (tab === 'benchmarks') {
            setIsBenchmarksPage(true);
            setIsWorkspacePage(false);
          } else {
            setIsWorkspacePage(false);
            setIsBenchmarksPage(false);
          }
        }}
        onOpenModel={(slug) => setActiveModelSlug(slug)}
        onOpenCompany={(slug) => setActiveCompanySlug(slug)}
        onOpenResearch={(slug) => setActiveResearchSlug(slug)}
        isOpen={isCopilotOpen}
        setIsOpen={setIsCopilotOpen}
        comparePreset={copilotComparePreset}
        onClearComparePreset={() => setCopilotComparePreset(null)}
      />
    </div>
  );
}
