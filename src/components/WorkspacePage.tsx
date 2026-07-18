import React, { useState, useEffect, useRef } from 'react';
import { 
  motion, AnimatePresence 
} from 'motion/react';
import { 
  Sparkles, ArrowLeft, Bookmark, Folder, FileText, CheckSquare, 
  Search, Clock, Compass, Plus, MoreHorizontal, Pin, Heart, Share2, 
  Trash2, Copy, Edit3, Download, Save, History, Tag, AtSign, Send, 
  BookOpen, HelpCircle, Briefcase, Cpu, Award, Zap, ChevronRight, 
  AlertCircle, Cloud, CloudOff, RefreshCw, Layers, Calendar, Printer, 
  ExternalLink, FileSpreadsheet, FileDown, Check, User
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer 
} from 'recharts';
import { 
  auth, db, doc, setDoc, getDoc
} from '../lib/firebase';
import { 
  WorkspaceBookmark, Collection, Note, Project, Reminder, 
  AIConversation, ActivityItem, WorkspaceState, Message 
} from '../types';

interface WorkspacePageProps {
  onBack: () => void;
  currentUser: any;
  news: any[];
  bookmarks: string[];
  toggleBookmark: (url: string) => void;
  readArticles: string[];
  toggleReadStatus: (url: string, e?: React.MouseEvent) => void;
  onOpenModel: (slug: string) => void;
  onOpenCompany: (slug: string) => void;
  onOpenResearch: (slug: string) => void;
}

// Initial placeholder data for empty state/first time users to provide a luxury experience
const INITIAL_COLLECTIONS: Collection[] = [
  { id: 'col-1', name: 'LLM Frontiers', description: 'Advanced reasoning models & techniques', pinned: true, favorite: true, createdAt: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString(), color: '#5194ec' },
  { id: 'col-2', name: 'Hardware Acceleration', description: 'Silicon, GPUs and cluster performance metrics', pinned: false, favorite: true, createdAt: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(), color: '#10b981' },
  { id: 'col-3', name: 'SaaS Startup Ideas', description: 'Brainstorms and market segments to target', pinned: false, favorite: false, createdAt: new Date().toISOString(), color: '#a855f7' }
];

const INITIAL_NOTES: Note[] = [
  { 
    id: 'note-1', 
    title: 'Benchmarking Gemini 3.5 Ultra vs Claude 3.5 Sonnet', 
    content: `# LLM Reasoning Capability Comparisons\n\nComparing reasoning depths and structured code output latency profiles.\n\n## Gemini 3.5 Ultra\n- **Token window**: 2 Million\n- **Strengths**: Audio-visual context, native web search grounding, high-volume retrieval.\n- **Weaknesses**: Slight formatting verbose overhead.\n\n## Claude 3.5 Sonnet\n- **Token window**: 200k\n- **Strengths**: Strict layout formatting, system-level architecture planning, dry coding.\n- **Weaknesses**: Context window threshold.\n\n### Key Takeaways\nUse Gemini for multi-modal ingestion (e.g., parsing lengthy video logs or massive repos). Use Claude for precise surgical codebase edits.`, 
    createdAt: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(), 
    updatedAt: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(), 
    tags: ['Benchmarks', 'Models', 'Comparison'], 
    pinned: true, 
    favorite: true,
    projectId: 'proj-1',
    versions: [
      { timestamp: new Date(Date.now() - 2 * 24 * 3600 * 1000 - 3600 * 1000).toISOString(), content: '# Initial Draft\nBenchmarking reasoning LLMs.', title: 'Initial Draft' }
    ]
  },
  { 
    id: 'note-2', 
    title: 'Blackwell cluster thermal efficiency research', 
    content: `# NVIDIA Blackwell Cluster Performance\n\nNotes gathered on scale-up performance of GB200 systems.\n\n### Key Metrics\n- **Power Draw**: ~120kW per rack\n- **Cooling requirement**: Liquid-to-air heat exchangers\n- **Interconnect Bandwidth**: 1.8TB/s bidirectional NVLink\n\nNeed to research latency profiles under concurrent MoE execution routing.`, 
    createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(), 
    updatedAt: new Date().toISOString(), 
    tags: ['Hardware', 'NVIDIA'], 
    pinned: false, 
    favorite: false,
    versions: []
  }
];

const INITIAL_PROJECTS: Project[] = [
  { 
    id: 'proj-1', 
    name: 'Compare GPT vs Claude', 
    description: 'Systematic analysis of coding models, pricing structures, and rate limits.', 
    createdAt: new Date(Date.now() - 4 * 24 * 3600 * 1000).toISOString(), 
    pinned: true, 
    favorite: true,
    timeline: [
      { date: '2026-07-12', title: 'Scope definition', description: 'Define benchmark targets, datasets, and testing parameters.' },
      { date: '2026-07-15', title: 'Note synthesis', description: 'Collect early performance notes and developer telemetry logs.' },
      { date: '2026-07-20', title: 'Final Report Drafting', description: 'Compile comparison metrics into printable PDF report.' }
    ]
  }
];

const INITIAL_BOOKMARKS: WorkspaceBookmark[] = [
  { id: 'b-1', title: 'Gemini 3.5 Ultra Unveiled: Redefining Multi-Modal Reasoning', url: 'https://deepmind.google/technologies/gemini-ultra-3.5/', type: 'model', category: 'Models', dateAdded: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString(), pinned: true, notes: 'Groundbreaking 2M token context, incredible multi-step agent scores.' },
  { id: 'b-2', title: 'NVIDIA Blackwell B200 GPUs Enter High Volume Production', url: 'https://www.nvidia.com', type: 'hardware', category: 'Hardware', dateAdded: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(), notes: 'Check liquid cooling specification sheets.' },
  { id: 'b-3', title: 'DeepMind AlphaProof 2 Achieves Gold Medal Score in International Math Olympiad', url: 'https://www.nature.com/alphaproof-2/', type: 'research', category: 'Applications', dateAdded: new Date(Date.now() - 24 * 3600 * 1000).toISOString() }
];

const INITIAL_REMINDERS: Reminder[] = [
  { id: 'rem-1', title: 'Review Blackwell liquid cooling spec sheets', type: 'research_reminder', dueDate: new Date(Date.now() + 2 * 24 * 3600 * 1000).toISOString().split('T')[0], completed: false, createdAt: new Date().toISOString() },
  { id: 'rem-2', title: 'Follow up on Claude 3.5 Sonnet rate adjustments', type: 'follow_company', dueDate: new Date(Date.now() + 5 * 24 * 3600 * 1000).toISOString().split('T')[0], completed: false, createdAt: new Date().toISOString() }
];

const INITIAL_ACTIVITIES: ActivityItem[] = [
  { id: 'act-1', type: 'note_create', title: 'Created note', description: 'Benchmarking Gemini 3.5 Ultra vs Claude 3.5 Sonnet', timestamp: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString() },
  { id: 'act-2', type: 'bookmark_add', title: 'Bookmarked model', description: 'Gemini 3.5 Ultra Announcement', timestamp: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString() }
];

const WEEKLY_LEARNING_DATA = [
  { name: 'Mon', hours: 1.5, notes: 1, bookmarks: 2 },
  { name: 'Tue', hours: 3.2, notes: 2, bookmarks: 4 },
  { name: 'Wed', hours: 2.0, notes: 2, bookmarks: 5 },
  { name: 'Thu', hours: 4.8, notes: 3, bookmarks: 7 },
  { name: 'Fri', hours: 3.5, notes: 4, bookmarks: 8 },
  { name: 'Sat', hours: 5.0, notes: 5, bookmarks: 10 },
  { name: 'Sun', hours: 4.2, notes: 6, bookmarks: 11 },
];

export default function WorkspacePage({ 
  onBack, currentUser, news, bookmarks: appBookmarks, toggleBookmark, 
  readArticles, toggleReadStatus, onOpenModel, onOpenCompany, onOpenResearch 
}: WorkspacePageProps) {
  
  // --- CORE SYSTEM STATES ---
  const [workspace, setWorkspace] = useState<WorkspaceState>({
    bookmarks: INITIAL_BOOKMARKS,
    collections: INITIAL_COLLECTIONS,
    notes: INITIAL_NOTES,
    projects: INITIAL_PROJECTS,
    conversations: [],
    reminders: INITIAL_REMINDERS,
    activities: INITIAL_ACTIVITIES,
    comparedModels: ['gemini-3.5-flash', 'claude-3.5-sonnet'],
    updatedAt: Date.now()
  });

  const [activeTab, setActiveTab] = useState<'dashboard' | 'collections' | 'notes' | 'bookmarks' | 'projects' | 'copilot' | 'reminders'>('dashboard');
  const [syncStatus, setSyncStatus] = useState<'synced' | 'saving' | 'offline' | 'loading'>('loading');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [workspaceNotes, setWorkspaceNotes] = useState<Record<string, string>>({});

  // Sub-selected items
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(INITIAL_NOTES[0]?.id || null);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(INITIAL_PROJECTS[0]?.id || null);
  const [selectedCollectionId, setSelectedCollectionId] = useState<string | null>(null);
  
  // UI States
  const [isNoteAssistantOpen, setIsNoteAssistantOpen] = useState(false);
  const [assistantLoading, setAssistantLoading] = useState(false);
  const [assistantOutput, setAssistantOutput] = useState('');
  const [copilotMessage, setCopilotMessage] = useState('');
  const [copilotHistory, setCopilotHistory] = useState<Message[]>([
    { role: 'assistant', content: "Welcome to your AI Copilot. Ask me to compare models, summarize your saved items, recommend research papers, or locate duplicate notes.", timestamp: new Date().toISOString() }
  ]);
  const [copilotLoading, setCopilotLoading] = useState(false);

  // Form creation states
  const [isCreatingCollection, setIsCreatingCollection] = useState(false);
  const [newColName, setNewColName] = useState('');
  const [newColDesc, setNewColDesc] = useState('');
  const [newColColor, setNewColColor] = useState('#5194ec');

  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [newProjName, setNewProjName] = useState('');
  const [newProjDesc, setNewProjDesc] = useState('');

  const [newReminderTitle, setNewReminderTitle] = useState('');
  const [newReminderType, setNewReminderType] = useState<'read_later' | 'review_benchmark' | 'follow_company' | 'research_reminder'>('read_later');
  const [newReminderDue, setNewReminderDue] = useState(new Date(Date.now() + 24 * 3600 * 1000).toISOString().split('T')[0]);

  // Version history viewer state
  const [isVersionsOpen, setIsVersionsOpen] = useState(false);

  // Project chat context state
  const [projectChatMessage, setProjectChatMessage] = useState('');
  const [projectChats, setProjectChats] = useState<Record<string, Message[]>>({});
  const [projectChatLoading, setProjectChatLoading] = useState(false);

  // --- LOCAL PERSISTENCE & CLOUD SYNC ENGINE ---
  useEffect(() => {
    // 1. Load Local Storage
    const savedLocal = localStorage.getItem('aix-workspace-v1');
    let localState: WorkspaceState | null = null;
    if (savedLocal) {
      try {
        localState = JSON.parse(savedLocal);
        if (localState) {
          setWorkspace(localState);
          if (localState.notes?.length > 0) {
            setSelectedNoteId(localState.notes[0].id);
          }
          if (localState.projects?.length > 0) {
            setSelectedProjectId(localState.projects[0].id);
          }
        }
      } catch (e) {
        console.error("Failed to parse local workspace", e);
      }
    }

    // 2. Sync with Firestore if logged in
    if (currentUser) {
      setSyncStatus('loading');
      const syncRef = doc(db, `users/${currentUser.uid}/workspace/state`);
      getDoc(syncRef).then((snapshot) => {
        if (snapshot.exists()) {
          const cloudState = snapshot.data() as WorkspaceState;
          if (localState && localState.updatedAt > (cloudState.updatedAt || 0)) {
            // Local is newer: upload local to Cloud
            setDoc(syncRef, localState, { merge: true }).then(() => {
              setSyncStatus('synced');
            }).catch(() => {
              setSyncStatus('offline');
            });
          } else {
            // Cloud is newer or same: set state
            setWorkspace(cloudState);
            setSyncStatus('synced');
            if (cloudState.notes?.length > 0) {
              setSelectedNoteId(cloudState.notes[0].id);
            }
            if (cloudState.projects?.length > 0) {
              setSelectedProjectId(cloudState.projects[0].id);
            }
          }
        } else {
          // No cloud state yet, initialize with current state
          const stateToSync = localState || {
            bookmarks: INITIAL_BOOKMARKS,
            collections: INITIAL_COLLECTIONS,
            notes: INITIAL_NOTES,
            projects: INITIAL_PROJECTS,
            conversations: [],
            reminders: INITIAL_REMINDERS,
            activities: INITIAL_ACTIVITIES,
            comparedModels: ['gemini-3.5-flash', 'claude-3.5-sonnet'],
            updatedAt: Date.now()
          };
          setDoc(syncRef, stateToSync).then(() => {
            setSyncStatus('synced');
          }).catch(() => {
            setSyncStatus('offline');
          });
        }
      }).catch((err) => {
        console.error("Firestore loading failed", err);
        setSyncStatus('offline');
      });
    } else {
      setSyncStatus('offline'); // offline mode since no user logged in
    }
  }, [currentUser]);

  // Handle immediate state changes with auto-save & sync
  const updateWorkspaceState = (updater: (prev: WorkspaceState) => WorkspaceState) => {
    setWorkspace(prev => {
      const next = updater(prev);
      next.updatedAt = Date.now();
      
      // Save locally
      localStorage.setItem('aix-workspace-v1', JSON.stringify(next));

      // Trigger Cloud sync if user logged in
      if (currentUser) {
        setSyncStatus('saving');
        const syncRef = doc(db, `users/${currentUser.uid}/workspace/state`);
        setDoc(syncRef, next, { merge: true }).then(() => {
          setSyncStatus('synced');
        }).catch((e) => {
          console.error("Auto-save sync failed", e);
          setSyncStatus('offline');
        });
      }

      return next;
    });
  };

  const addActivity = (type: ActivityItem['type'], title: string, description: string) => {
    const act: ActivityItem = {
      id: 'act-' + Math.random().toString(36).substring(2, 11),
      type,
      title,
      description,
      timestamp: new Date().toISOString()
    };
    updateWorkspaceState(prev => ({
      ...prev,
      activities: [act, ...prev.activities].slice(0, 50)
    }));
  };

  // --- COLLECTION ACTIONS ---
  const handleCreateCollection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newColName.trim()) return;

    const col: Collection = {
      id: 'col-' + Math.random().toString(36).substring(2, 11),
      name: newColName,
      description: newColDesc,
      createdAt: new Date().toISOString(),
      color: newColColor
    };

    updateWorkspaceState(prev => ({
      ...prev,
      collections: [...prev.collections, col]
    }));

    addActivity('collection_create', 'Created collection', col.name);
    setNewColName('');
    setNewColDesc('');
    setIsCreatingCollection(false);
  };

  const handleDeleteCollection = (id: string) => {
    const colName = workspace.collections.find(c => c.id === id)?.name || '';
    updateWorkspaceState(prev => ({
      ...prev,
      collections: prev.collections.filter(c => c.id !== id),
      // Clean collectionId reference in notes
      notes: prev.notes.map(n => n.collectionId === id ? { ...n, collectionId: undefined } : n)
    }));
    addActivity('collection_create', 'Deleted collection', colName);
  };

  const handleDuplicateCollection = (id: string) => {
    const target = workspace.collections.find(c => c.id === id);
    if (!target) return;

    const copy: Collection = {
      ...target,
      id: 'col-' + Math.random().toString(36).substring(2, 11),
      name: `${target.name} (Copy)`,
      createdAt: new Date().toISOString()
    };

    updateWorkspaceState(prev => ({
      ...prev,
      collections: [...prev.collections, copy]
    }));
    addActivity('collection_create', 'Duplicated collection', copy.name);
  };

  const handleTogglePinCollection = (id: string) => {
    updateWorkspaceState(prev => ({
      ...prev,
      collections: prev.collections.map(c => c.id === id ? { ...c, pinned: !c.pinned } : c)
    }));
  };

  const handleToggleFavoriteCollection = (id: string) => {
    updateWorkspaceState(prev => ({
      ...prev,
      collections: prev.collections.map(c => c.id === id ? { ...c, favorite: !c.favorite } : c)
    }));
  };

  // --- NOTES ACTIONS ---
  const handleCreateNote = (title = 'Untitled Note', content = '', tags: string[] = [], projectId?: string) => {
    const id = 'note-' + Math.random().toString(36).substring(2, 11);
    const note: Note = {
      id,
      title,
      content,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags,
      projectId,
      collectionId: selectedCollectionId || undefined,
      versions: []
    };

    updateWorkspaceState(prev => ({
      ...prev,
      notes: [note, ...prev.notes]
    }));

    setSelectedNoteId(id);
    addActivity('note_create', 'Created note', note.title);
  };

  const handleUpdateNote = (id: string, fields: Partial<Note>) => {
    updateWorkspaceState(prev => ({
      ...prev,
      notes: prev.notes.map(n => {
        if (n.id === id) {
          // Version snapshot rule: save previous if changing content dramatically
          const nextVersions = n.versions ? [...n.versions] : [];
          if (fields.content !== undefined && fields.content !== n.content && nextVersions.length < 20) {
            nextVersions.push({
              timestamp: new Date().toISOString(),
              content: n.content,
              title: `Edit Snapshot - ${new Date().toLocaleTimeString()}`
            });
          }
          return { 
            ...n, 
            ...fields, 
            versions: nextVersions,
            updatedAt: new Date().toISOString() 
          };
        }
        return n;
      })
    }));
  };

  const handleDeleteNote = (id: string) => {
    const title = workspace.notes.find(n => n.id === id)?.title || '';
    updateWorkspaceState(prev => ({
      ...prev,
      notes: prev.notes.filter(n => n.id !== id)
    }));
    if (selectedNoteId === id) {
      setSelectedNoteId(workspace.notes.find(n => n.id !== id)?.id || null);
    }
    addActivity('note_edit', 'Deleted note', title);
  };

  const handleDuplicateNote = (id: string) => {
    const target = workspace.notes.find(n => n.id === id);
    if (!target) return;

    const copy: Note = {
      ...target,
      id: 'note-' + Math.random().toString(36).substring(2, 11),
      title: `${target.title} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      versions: []
    };

    updateWorkspaceState(prev => ({
      ...prev,
      notes: [copy, ...prev.notes]
    }));
    setSelectedNoteId(copy.id);
    addActivity('note_create', 'Duplicated note', copy.title);
  };

  // --- BOOKMARKS ACTIONS ---
  const handleAddBookmark = (title: string, url: string, type: WorkspaceBookmark['type'], category?: string) => {
    const id = 'b-' + Math.random().toString(36).substring(2, 11);
    const bm: WorkspaceBookmark = {
      id,
      title,
      url,
      type,
      category,
      dateAdded: new Date().toISOString()
    };
    updateWorkspaceState(prev => ({
      ...prev,
      bookmarks: [bm, ...prev.bookmarks]
    }));
    addActivity('bookmark_add', 'Added bookmark', title);
  };

  const handleToggleBookmarkPin = (id: string) => {
    updateWorkspaceState(prev => ({
      ...prev,
      bookmarks: prev.bookmarks.map(b => b.id === id ? { ...b, pinned: !b.pinned } : b)
    }));
  };

  const handleToggleBookmarkFavorite = (id: string) => {
    updateWorkspaceState(prev => ({
      ...prev,
      bookmarks: prev.bookmarks.map(b => b.id === id ? { ...b, favorite: !b.favorite } : b)
    }));
  };

  const handleDeleteBookmark = (id: string) => {
    const title = workspace.bookmarks.find(b => b.id === id)?.title || '';
    updateWorkspaceState(prev => ({
      ...prev,
      bookmarks: prev.bookmarks.filter(b => b.id !== id)
    }));
    addActivity('bookmark_add', 'Removed bookmark', title);
  };

  // --- PROJECTS ACTIONS ---
  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjName.trim()) return;

    const proj: Project = {
      id: 'proj-' + Math.random().toString(36).substring(2, 11),
      name: newProjName,
      description: newProjDesc,
      createdAt: new Date().toISOString(),
      timeline: [
        { date: new Date().toISOString().split('T')[0], title: 'Project Spawned', description: 'Personal research workspace initiated.' }
      ]
    };

    updateWorkspaceState(prev => ({
      ...prev,
      projects: [...prev.projects, proj]
    }));

    setSelectedProjectId(proj.id);
    addActivity('project_create', 'Created project', proj.name);
    setNewProjName('');
    setNewProjDesc('');
    setIsCreatingProject(false);
    setActiveTab('projects');
  };

  const handleAddProjectTimelineEvent = (projectId: string, title: string, description: string) => {
    updateWorkspaceState(prev => ({
      ...prev,
      projects: prev.projects.map(p => {
        if (p.id === projectId) {
          const ev = { date: new Date().toISOString().split('T')[0], title, description };
          return { ...p, timeline: [...(p.timeline || []), ev] };
        }
        return p;
      })
    }));
  };

  const handleDeleteProject = (id: string) => {
    const name = workspace.projects.find(p => p.id === id)?.name || '';
    updateWorkspaceState(prev => ({
      ...prev,
      projects: prev.projects.filter(p => p.id !== id),
      // Decouple notes from this project
      notes: prev.notes.map(n => n.projectId === id ? { ...n, projectId: undefined } : n)
    }));
    if (selectedProjectId === id) {
      setSelectedProjectId(workspace.projects.find(p => p.id !== id)?.id || null);
    }
    addActivity('project_create', 'Deleted project', name);
  };

  // --- REMINDERS ACTIONS ---
  const handleCreateReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReminderTitle.trim()) return;

    const rem: Reminder = {
      id: 'rem-' + Math.random().toString(36).substring(2, 11),
      title: newReminderTitle,
      type: newReminderType,
      dueDate: newReminderDue,
      completed: false,
      createdAt: new Date().toISOString()
    };

    updateWorkspaceState(prev => ({
      ...prev,
      reminders: [rem, ...prev.reminders]
    }));

    addActivity('reminder_add', 'Set reminder', rem.title);
    setNewReminderTitle('');
  };

  const handleToggleReminderCompleted = (id: string) => {
    updateWorkspaceState(prev => ({
      ...prev,
      reminders: prev.reminders.map(r => r.id === id ? { ...r, completed: !r.completed } : r)
    }));
  };

  const handleDeleteReminder = (id: string) => {
    updateWorkspaceState(prev => ({
      ...prev,
      reminders: prev.reminders.filter(r => r.id !== id)
    }));
  };

  // --- AI NOTE ASSISTANT ENGINE ---
  const handleNoteAssistantAction = async (action: string) => {
    const currentNote = workspace.notes.find(n => n.id === selectedNoteId);
    if (!currentNote) return;

    setAssistantLoading(true);
    setIsNoteAssistantOpen(true);
    setAssistantOutput('');
    try {
      const res = await fetch('/api/workspace/note-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          noteTitle: currentNote.title,
          noteContent: currentNote.content,
          action
        })
      });
      const data = await res.json();
      setAssistantOutput(data.text || 'Failed to generate content.');
    } catch (err) {
      console.error(err);
      setAssistantOutput('Server error. Unable to connect to backend AI services.');
    } finally {
      setAssistantLoading(false);
    }
  };

  // --- AI COPILOT CHAT ENGINE ---
  const handleSendCopilotMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!copilotMessage.trim() || copilotLoading) return;

    const userMsg: Message = {
      role: 'user',
      content: copilotMessage,
      timestamp: new Date().toISOString()
    };

    const nextHistory = [...copilotHistory, userMsg];
    setCopilotHistory(nextHistory);
    setCopilotMessage('');
    setCopilotLoading(true);

    try {
      const res = await fetch('/api/workspace/copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg.content,
          history: nextHistory.map(m => ({ role: m.role, content: m.content })),
          workspaceContext: {
            notes: workspace.notes,
            bookmarks: workspace.bookmarks,
            collections: workspace.collections,
            projects: workspace.projects,
            comparedModels: workspace.comparedModels
          }
        })
      });
      const data = await res.json();
      setCopilotHistory(prev => [...prev, {
        role: 'assistant',
        content: data.text || 'Unable to scan records.',
        timestamp: new Date().toISOString()
      }]);
    } catch (err) {
      console.error(err);
      setCopilotHistory(prev => [...prev, {
        role: 'assistant',
        content: 'Server error. Operating on offline knowledge models.',
        timestamp: new Date().toISOString()
      }]);
    } finally {
      setCopilotLoading(false);
    }
  };

  // --- PROJECT AI CHAT ENGINE ---
  const handleSendProjectChatMessage = async (e: React.FormEvent, projectId: string) => {
    e.preventDefault();
    if (!projectChatMessage.trim() || projectChatLoading) return;

    const userMsg: Message = {
      role: 'user',
      content: projectChatMessage,
      timestamp: new Date().toISOString()
    };

    const currentHistory = projectChats[projectId] || [
      { role: 'assistant', content: `Project context-aware model compiled. Ask me anything about your items matching project files.`, timestamp: new Date().toISOString() }
    ];

    const nextHistory = [...currentHistory, userMsg];
    setProjectChats(prev => ({ ...prev, [projectId]: nextHistory }));
    setProjectChatMessage('');
    setProjectChatLoading(true);

    try {
      const relatedNotes = workspace.notes.filter(n => n.projectId === projectId);
      const res = await fetch('/api/workspace/copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `${userMsg.content} (Focus entirely on context for project: ${workspace.projects.find(p => p.id === projectId)?.name})`,
          history: nextHistory.map(m => ({ role: m.role, content: m.content })),
          workspaceContext: {
            notes: relatedNotes,
            bookmarks: workspace.bookmarks.filter(b => b.type === 'model'),
            collections: [],
            projects: [],
            comparedModels: []
          }
        })
      });
      const data = await res.json();
      setProjectChats(prev => ({
        ...prev,
        [projectId]: [...(prev[projectId] || []), {
          role: 'assistant',
          content: data.text || 'Analyzed model state.',
          timestamp: new Date().toISOString()
        }]
      }));
    } catch (err) {
      console.error(err);
    } finally {
      setProjectChatLoading(false);
    }
  };

  // --- EXPORT ENGINE ---
  const exportAsMarkdown = (note: Note) => {
    const markdown = `# ${note.title}\n\n*Created: ${new Date(note.createdAt).toLocaleString()}*\n*Tags: ${note.tags.join(', ')}*\n\n---\n\n${note.content}`;
    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${note.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportAsJSON = (note: Note) => {
    const data = JSON.stringify(note, null, 2);
    const blob = new Blob([data], { type: 'application/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${note.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportAsCSV = () => {
    const headers = 'ID,Title,Tags,Created At,Updated At\n';
    const rows = workspace.notes.map(n => 
      `"${n.id}","${n.title.replace(/"/g, '""')}","${n.tags.join(';')}","${n.createdAt}","${n.updatedAt}"`
    ).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `workspace-notes-inventory.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const triggerPrintNote = () => {
    window.print();
  };

  // --- INSTANT SPOTLIGHT SEARCH ---
  const getFilteredSearchResults = () => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    
    const matchedNotes = workspace.notes.filter(n => 
      n.title.toLowerCase().includes(query) || n.content.toLowerCase().includes(query) || n.tags.some(t => t.toLowerCase().includes(query))
    ).map(n => ({ type: 'note' as const, id: n.id, title: n.title, desc: n.tags.join(', ') }));

    const matchedCollections = workspace.collections.filter(c => 
      c.name.toLowerCase().includes(query) || (c.description && c.description.toLowerCase().includes(query))
    ).map(c => ({ type: 'collection' as const, id: c.id, title: c.name, desc: c.description || 'Collection' }));

    const matchedProjects = workspace.projects.filter(p => 
      p.name.toLowerCase().includes(query) || (p.description && p.description.toLowerCase().includes(query))
    ).map(p => ({ type: 'project' as const, id: p.id, title: p.name, desc: p.description || 'Project' }));

    const matchedBookmarks = workspace.bookmarks.filter(b => 
      b.title.toLowerCase().includes(query) || b.url.toLowerCase().includes(query) || (b.notes && b.notes.toLowerCase().includes(query))
    ).map(b => ({ type: 'bookmark' as const, id: b.id, title: b.title, desc: b.type }));

    return [...matchedNotes, ...matchedCollections, ...matchedProjects, ...matchedBookmarks];
  };

  // Sync general followed bookmarks from standard page to Workspace bookmarks
  useEffect(() => {
    if (news && news.length > 0 && appBookmarks && appBookmarks.length > 0) {
      const newsBookmarks = news.filter(n => appBookmarks.includes(n.url));
      
      setWorkspace(prev => {
        let changed = false;
        const nextBookmarks = [...prev.bookmarks];

        newsBookmarks.forEach(art => {
          const exists = nextBookmarks.some(b => b.url === art.url);
          if (!exists) {
            nextBookmarks.push({
              id: 'b-' + Math.random().toString(36).substring(2, 11),
              title: art.title,
              url: art.url,
              type: 'article',
              category: art.category,
              dateAdded: new Date().toISOString()
            });
            changed = true;
          }
        });

        if (changed) {
          const updated = { ...prev, bookmarks: nextBookmarks, updatedAt: Date.now() };
          localStorage.setItem('aix-workspace-v1', JSON.stringify(updated));
          return updated;
        }
        return prev;
      });
    }
  }, [news, appBookmarks]);

  return (
    <div className="w-full h-screen bg-[#070708] text-neutral-100 flex flex-col font-sans relative overflow-hidden select-none">
      
      {/* 1. TOP UTILITY STATUS HEADER */}
      <header className="flex-shrink-0 flex items-center justify-between px-6 py-4 bg-[#0c0c0e] border-b border-neutral-900 z-30 select-none">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-neutral-950 hover:bg-neutral-900 border border-neutral-800 text-xs font-semibold text-neutral-400 hover:text-white transition-all cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Intel Stream</span>
          </button>
          
          <div className="h-4 w-[1px] bg-neutral-800" />
          
          <div className="flex items-center gap-2">
            <span className="font-display font-bold text-lg text-white">Workspace</span>
            <span className="text-[10px] bg-blue-500/10 border border-blue-500/20 text-[#5194ec] font-mono px-2 py-0.5 rounded-lg uppercase tracking-wider font-semibold">
              KNOWLEDGE HUB
            </span>
          </div>
        </div>

        {/* Global Instant Search Bar */}
        <div className="relative max-w-sm w-full hidden md:block">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
          <input 
            type="text" 
            placeholder="Search notes, collections, bookmarks..." 
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsSearchOpen(true);
            }}
            className="w-full bg-neutral-950 border border-neutral-800 focus:border-[#5194ec]/80 text-xs text-neutral-200 placeholder-neutral-500 pl-10 pr-4 py-2 rounded-xl focus:outline-none transition-all font-sans"
          />

          {/* Search Result overlay popup */}
          <AnimatePresence>
            {isSearchOpen && searchQuery.trim() !== '' && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute left-0 right-0 mt-2 bg-neutral-950 border border-neutral-800 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] z-50 overflow-hidden text-left"
              >
                <div className="p-3 border-b border-neutral-900 flex justify-between items-center bg-neutral-900/30">
                  <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest font-bold">Search results</span>
                  <button 
                    onClick={() => { setSearchQuery(''); setIsSearchOpen(false); }}
                    className="text-[10px] text-neutral-400 hover:text-white"
                  >
                    Clear
                  </button>
                </div>
                <div className="max-h-60 overflow-y-auto divide-y divide-neutral-900">
                  {getFilteredSearchResults().length > 0 ? (
                    getFilteredSearchResults().map((res, i) => (
                      <button 
                        key={i}
                        onClick={() => {
                          setIsSearchOpen(false);
                          setSearchQuery('');
                          if (res.type === 'note') {
                            setActiveTab('notes');
                            setSelectedNoteId(res.id);
                          } else if (res.type === 'collection') {
                            setActiveTab('collections');
                            setSelectedCollectionId(res.id);
                          } else if (res.type === 'project') {
                            setActiveTab('projects');
                            setSelectedProjectId(res.id);
                          } else {
                            setActiveTab('bookmarks');
                          }
                        }}
                        className="w-full text-left px-4 py-3 hover:bg-neutral-900 flex items-center justify-between transition-colors cursor-pointer"
                      >
                        <div className="truncate pr-4">
                          <p className="text-xs font-semibold text-neutral-200 truncate">{res.title}</p>
                          <p className="text-[10px] text-neutral-500 font-mono mt-0.5 truncate">{res.desc}</p>
                        </div>
                        <span className="text-[9px] px-2 py-0.5 rounded font-bold uppercase font-mono tracking-widest bg-neutral-900 border border-neutral-800 text-neutral-400">
                          {res.type}
                        </span>
                      </button>
                    ))
                  ) : (
                    <div className="p-6 text-center text-xs text-neutral-600 font-mono">No matching records found.</div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sync Status Badge & User Account */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-900/50 border border-neutral-850">
            {syncStatus === 'synced' && (
              <>
                <Cloud className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                <span className="text-[10px] font-bold text-neutral-300 font-mono uppercase tracking-wider">Synced</span>
              </>
            )}
            {syncStatus === 'saving' && (
              <>
                <RefreshCw className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                <span className="text-[10px] font-bold text-neutral-300 font-mono uppercase tracking-wider">Saving...</span>
              </>
            )}
            {syncStatus === 'offline' && (
              <>
                <CloudOff className="w-3.5 h-3.5 text-rose-400" />
                <span className="text-[10px] font-bold text-neutral-400 font-mono uppercase tracking-wider">Offline</span>
              </>
            )}
            {syncStatus === 'loading' && (
              <>
                <RefreshCw className="w-3.5 h-3.5 text-blue-400 animate-spin" />
                <span className="text-[10px] font-bold text-neutral-400 font-mono uppercase tracking-wider">Retrieving</span>
              </>
            )}
          </div>

          {currentUser ? (
            <div className="flex items-center gap-2 bg-neutral-950 border border-neutral-850 px-3 py-1 rounded-full">
              <div className="w-5 h-5 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-[10px] font-bold text-white shadow-md">
                {currentUser.isAnonymous ? "G" : (currentUser.displayName?.[0]?.toUpperCase() || currentUser.email?.[0]?.toUpperCase() || "U")}
              </div>
              <span className="text-[10px] font-bold text-neutral-300 font-mono">
                {currentUser.isAnonymous ? "Guest Profile" : (currentUser.displayName || currentUser.email?.split('@')[0])}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2 bg-neutral-950 border border-neutral-850 px-3 py-1 rounded-full text-neutral-500 text-[10px] font-bold font-mono">
              <User className="w-3.5 h-3.5 text-neutral-600" />
              <span>Local Storage Mode</span>
            </div>
          )}
        </div>
      </header>

      {/* 2. BODY SECTION (LEFT SIDEBAR + MAIN STAGE) */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* LEFT WORKSPACE NAVIGATION SIDEBAR */}
        <aside className="w-64 bg-[#0a0a0c] border-r border-neutral-900 flex flex-col justify-between flex-shrink-0 z-20 overflow-y-auto select-none">
          <div className="p-4 space-y-6">
            
            {/* Main Tabs Group */}
            <div className="space-y-1">
              <button 
                onClick={() => { setActiveTab('dashboard'); setSelectedCollectionId(null); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer ${
                  activeTab === 'dashboard' ? 'bg-[#5194ec]/10 text-[#5194ec] border border-neutral-800' : 'text-neutral-400 hover:text-white hover:bg-neutral-900/40 border border-transparent'
                }`}
              >
                <Compass className="w-4 h-4" />
                <span>Research Dashboard</span>
              </button>

              <button 
                onClick={() => setActiveTab('collections')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer ${
                  activeTab === 'collections' ? 'bg-[#5194ec]/10 text-[#5194ec] border border-neutral-800' : 'text-neutral-400 hover:text-white hover:bg-neutral-900/40 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Folder className="w-4 h-4" />
                  <span>Collections</span>
                </div>
                <span className="text-[10px] font-mono bg-neutral-900 border border-neutral-800 px-1.5 py-0.5 rounded font-bold text-neutral-500">
                  {workspace.collections.length}
                </span>
              </button>

              <button 
                onClick={() => setActiveTab('notes')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer ${
                  activeTab === 'notes' ? 'bg-[#5194ec]/10 text-[#5194ec] border border-neutral-800' : 'text-neutral-400 hover:text-white hover:bg-neutral-900/40 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-4 h-4" />
                  <span>Notes Desk</span>
                </div>
                <span className="text-[10px] font-mono bg-neutral-900 border border-neutral-800 px-1.5 py-0.5 rounded font-bold text-neutral-500">
                  {workspace.notes.length}
                </span>
              </button>

              <button 
                onClick={() => setActiveTab('bookmarks')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer ${
                  activeTab === 'bookmarks' ? 'bg-[#5194ec]/10 text-[#5194ec] border border-neutral-800' : 'text-neutral-400 hover:text-white hover:bg-neutral-900/40 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Bookmark className="w-4 h-4" />
                  <span>Bookmarks</span>
                </div>
                <span className="text-[10px] font-mono bg-neutral-900 border border-neutral-800 px-1.5 py-0.5 rounded font-bold text-neutral-500">
                  {workspace.bookmarks.length}
                </span>
              </button>

              <button 
                onClick={() => setActiveTab('copilot')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer ${
                  activeTab === 'copilot' ? 'bg-[#5194ec]/10 text-[#5194ec] border border-neutral-800' : 'text-neutral-400 hover:text-white hover:bg-neutral-900/40 border border-transparent'
                }`}
              >
                <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
                <span>AI Copilot Chat</span>
              </button>

              <button 
                onClick={() => setActiveTab('reminders')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer ${
                  activeTab === 'reminders' ? 'bg-[#5194ec]/10 text-[#5194ec] border border-neutral-800' : 'text-neutral-400 hover:text-white hover:bg-neutral-900/40 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4" />
                  <span>Reminders</span>
                </div>
                <span className="text-[10px] font-mono bg-neutral-900 border border-neutral-800 px-1.5 py-0.5 rounded font-bold text-neutral-500">
                  {workspace.reminders.filter(r => !r.completed).length}
                </span>
              </button>
            </div>

            {/* PROJECTS SECTION */}
            <div className="space-y-2">
              <div className="flex items-center justify-between px-3 py-1">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-neutral-500">Research Projects</span>
                <button 
                  onClick={() => setIsCreatingProject(true)}
                  className="p-1 rounded bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 hover:text-white text-neutral-400 transition-colors cursor-pointer"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>

              <div className="space-y-0.5">
                {workspace.projects.map(proj => (
                  <button 
                    key={proj.id}
                    onClick={() => {
                      setSelectedProjectId(proj.id);
                      setActiveTab('projects');
                    }}
                    className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer truncate ${
                      activeTab === 'projects' && selectedProjectId === proj.id ? 'bg-neutral-900 text-[#5194ec] border-l-2 border-[#5194ec] pl-2' : 'text-neutral-400 hover:text-neutral-200'
                    }`}
                  >
                    <span className="truncate pr-2">{proj.name}</span>
                    <ChevronRight className="w-3 h-3 flex-shrink-0 text-neutral-600" />
                  </button>
                ))}
              </div>
            </div>

            {/* QUICK COLLECTIONS SHORTCUT */}
            <div className="space-y-2">
              <div className="flex items-center justify-between px-3 py-1">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-neutral-500">Collections</span>
                <button 
                  onClick={() => setIsCreatingCollection(true)}
                  className="p-1 rounded bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 hover:text-white text-neutral-400 transition-colors cursor-pointer"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>

              <div className="space-y-0.5">
                {workspace.collections.map(col => (
                  <button 
                    key={col.id}
                    onClick={() => {
                      setSelectedCollectionId(col.id);
                      setActiveTab('collections');
                    }}
                    className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer truncate ${
                      activeTab === 'collections' && selectedCollectionId === col.id ? 'bg-neutral-900 text-[#5194ec]' : 'text-neutral-400 hover:text-neutral-200'
                    }`}
                  >
                    <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: col.color || '#5194ec' }} />
                    <span className="truncate">{col.name}</span>
                  </button>
                ))}
              </div>
            </div>

          </div>

          <div className="p-4 border-t border-neutral-950 bg-neutral-950/40 text-[10px] text-neutral-500 text-center font-mono uppercase tracking-wider select-text">
            © AI X workspace 2026
          </div>
        </aside>

        {/* MAIN DISPLAY WINDOW */}
        <main className="flex-1 flex flex-col bg-[#020202] overflow-y-auto select-text">
          
          {/* SCREEN 1: RESEARCH DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto w-full">
              
              {/* Header welcome card */}
              <div className="relative p-8 rounded-[28px] border border-neutral-900 bg-neutral-950/40 backdrop-blur-xl overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />
                <div className="space-y-2 relative z-10 text-left">
                  <h1 className="font-display font-bold text-2xl sm:text-3xl text-white tracking-tight">
                    Welcome back to AI X Workspace
                  </h1>
                  <p className="text-sm text-neutral-400 font-sans leading-relaxed">
                    Track parameters, model comparisons, and study guides in your unified database.
                  </p>
                </div>
                
                <div className="flex gap-3 relative z-10">
                  <button 
                    onClick={() => handleCreateNote('Untitled Deep Research Note', '# Research Log\n\nDraft specs here...', ['Research'])}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#5194ec] hover:bg-blue-600 text-white font-bold text-xs transition-all shadow-md shadow-blue-500/10 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>New Research Note</span>
                  </button>
                </div>
              </div>

              {/* BENTO GRID DASHBOARD */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                
                {/* CARD 1: CONTINUE READING QUEUE */}
                <div className="p-6 rounded-2xl border border-neutral-900 bg-neutral-950/30 flex flex-col h-80 justify-between text-left">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-blue-400" />
                      <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Continue Reading</h3>
                    </div>
                    <p className="text-xs text-neutral-400">Skim bookmarked articles awaiting study.</p>
                  </div>

                  <div className="flex-1 overflow-y-auto mt-4 space-y-3 pr-1 scrollbar-none">
                    {workspace.bookmarks.filter(b => b.type === 'article').slice(0, 4).map((b, i) => (
                      <div key={i} className="flex items-center justify-between p-2.5 rounded-xl bg-neutral-950/60 border border-neutral-900 text-xs">
                        <span className="truncate pr-2 text-neutral-300 font-medium">{b.title}</span>
                        <a href={b.url} target="_blank" rel="noreferrer" className="text-[10px] text-[#5194ec] hover:underline font-bold flex-shrink-0 flex items-center gap-1">
                          Open <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      </div>
                    ))}
                    {workspace.bookmarks.filter(b => b.type === 'article').length === 0 && (
                      <div className="text-center py-8 text-neutral-600 text-xs font-mono">No reading logs remaining.</div>
                    )}
                  </div>
                </div>

                {/* CARD 2: RECENT NOTES */}
                <div className="p-6 rounded-2xl border border-neutral-900 bg-neutral-950/30 flex flex-col h-80 justify-between text-left">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-[#5194ec]" />
                      <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Recent Research Notes</h3>
                    </div>
                    <p className="text-xs text-neutral-400">Pick up where you left off writing.</p>
                  </div>

                  <div className="flex-1 mt-4 space-y-3 overflow-y-auto pr-1 scrollbar-none">
                    {workspace.notes.slice(0, 3).map((note) => (
                      <button 
                        key={note.id}
                        onClick={() => { setSelectedNoteId(note.id); setActiveTab('notes'); }}
                        className="w-full text-left p-3 rounded-xl bg-neutral-950/60 border border-neutral-900 hover:border-neutral-850 hover:bg-neutral-900/40 transition-all cursor-pointer block"
                      >
                        <h4 className="text-xs font-bold text-neutral-200 truncate">{note.title}</h4>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-[9px] text-neutral-500 font-mono">
                            Updated {new Date(note.updatedAt).toLocaleDateString()}
                          </span>
                          <div className="flex gap-1">
                            {note.tags.slice(0, 2).map((t, idx) => (
                              <span key={idx} className="text-[9px] px-1.5 py-0.2 bg-neutral-900 text-neutral-400 border border-neutral-800 rounded">
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* CARD 3: TRENDING SAVED TOPICS */}
                <div className="p-6 rounded-2xl border border-neutral-900 bg-neutral-950/30 flex flex-col h-80 justify-between text-left">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-purple-400" />
                      <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Trending Saved Topics</h3>
                    </div>
                    <p className="text-xs text-neutral-400">Analysis of your highest frequency tags.</p>
                  </div>

                  <div className="flex-1 mt-4 flex flex-wrap gap-2.5 content-start overflow-y-auto">
                    {Array.from(new Set(workspace.notes.flatMap(n => n.tags))).map((tag, i) => (
                      <span key={i} className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                        {tag}
                      </span>
                    ))}
                    {workspace.notes.flatMap(n => n.tags).length === 0 && (
                      <div className="text-center w-full py-12 text-neutral-600 text-xs font-mono">Add tags inside notes.</div>
                    )}
                  </div>
                </div>

                {/* CARD 4: WEEKLY PROGRESS CHART */}
                <div className="p-6 rounded-2xl border border-neutral-900 bg-neutral-950/30 flex flex-col h-80 justify-between text-left lg:col-span-2">
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-emerald-400" />
                      <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Weekly Research Productivity</h3>
                    </div>
                    <p className="text-xs text-neutral-400">Your research activities and metrics logged over the past 7 days.</p>
                  </div>

                  <div className="flex-1 min-h-[160px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={WEEKLY_LEARNING_DATA} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#5194ec" stopOpacity={0.2}/>
                            <stop offset="95%" stopColor="#5194ec" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="name" stroke="#525252" fontSize={10} tickLine={false} />
                        <YAxis stroke="#525252" fontSize={10} tickLine={false} />
                        <Tooltip contentStyle={{ backgroundColor: '#0c0c0e', border: '1px solid #1f1f23', borderRadius: '12px', fontSize: '11px', color: '#fff' }} />
                        <Area type="monotone" dataKey="hours" stroke="#5194ec" strokeWidth={2} fillOpacity={1} fill="url(#colorHours)" name="Study Hours" />
                        <Area type="monotone" dataKey="bookmarks" stroke="#10b981" strokeWidth={1} fillOpacity={0} name="Assets Logged" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* CARD 5: FAVORITE COMPANIES & ACTIVITY */}
                <div className="p-6 rounded-2xl border border-neutral-900 bg-neutral-950/30 flex flex-col h-80 justify-between text-left">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-rose-400" />
                      <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Tracked Company Profiles</h3>
                    </div>
                    <p className="text-xs text-neutral-400">Access companies saved for market research.</p>
                  </div>

                  <div className="flex-1 mt-4 space-y-3 overflow-y-auto pr-1 scrollbar-none">
                    {workspace.bookmarks.filter(b => b.type === 'company').map((bm) => (
                      <div key={bm.id} className="p-2.5 rounded-xl bg-neutral-950/60 border border-neutral-900 flex justify-between items-center text-xs">
                        <span className="font-semibold text-neutral-300">{bm.title}</span>
                        <button 
                          onClick={() => {
                            const slug = bm.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                            onOpenCompany(slug);
                          }}
                          className="text-[#5194ec] hover:underline font-bold"
                        >
                          View Board
                        </button>
                      </div>
                    ))}
                    {workspace.bookmarks.filter(b => b.type === 'company').length === 0 && (
                      <div className="text-center py-12 text-neutral-600 text-xs font-mono">
                        No company cards bookmarked yet.
                      </div>
                    )}
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* SCREEN 2: COLLECTION SYSTEM */}
          {activeTab === 'collections' && (
            <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full text-left">
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <h1 className="text-2xl font-bold tracking-tight text-white">Collections</h1>
                  <p className="text-xs text-neutral-400">Organize bookmarks, specs, and resources inside visual folders.</p>
                </div>
                <button 
                  onClick={() => setIsCreatingCollection(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-xs font-bold text-white cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-[#5194ec]" />
                  <span>Create Collection</span>
                </button>
              </div>

              {/* Collections Grid Layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {workspace.collections.map(col => {
                  const relativeNotes = workspace.notes.filter(n => n.collectionId === col.id);
                  const relativeBookmarks = workspace.bookmarks.filter(b => b.category === col.name);
                  
                  return (
                    <div 
                      key={col.id}
                      className="p-6 rounded-2xl border bg-neutral-950/40 relative overflow-hidden group flex flex-col justify-between h-56 hover:border-neutral-800 transition-all"
                      style={{ borderTop: `4px solid ${col.color || '#5194ec'}` }}
                    >
                      <div>
                        <div className="flex justify-between items-start">
                          <h3 className="font-bold text-base text-neutral-200">{col.name}</h3>
                          <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={() => handleTogglePinCollection(col.id)}
                              className={`p-1 rounded bg-neutral-900 border border-neutral-800 cursor-pointer ${col.pinned ? 'text-amber-400' : 'text-neutral-500'}`}
                            >
                              <Pin className="w-3.5 h-3.5" />
                            </button>
                            <button 
                              onClick={() => handleToggleFavoriteCollection(col.id)}
                              className={`p-1 rounded bg-neutral-900 border border-neutral-800 cursor-pointer ${col.favorite ? 'text-rose-500' : 'text-neutral-500'}`}
                            >
                              <Heart className="w-3.5 h-3.5" />
                            </button>
                            <button 
                              onClick={() => handleDuplicateCollection(col.id)}
                              className="p-1 rounded bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white cursor-pointer"
                              title="Duplicate"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                            <button 
                              onClick={() => handleDeleteCollection(col.id)}
                              className="p-1 rounded bg-neutral-900 border border-neutral-800 text-rose-400 hover:bg-rose-500/10 cursor-pointer"
                              title="Delete"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                        <p className="text-xs text-neutral-400 mt-2 line-clamp-2">{col.description || 'No description supplied.'}</p>
                      </div>

                      <div className="border-t border-neutral-900 pt-3 mt-4 flex items-center justify-between text-[11px] text-neutral-500">
                        <span className="font-mono">
                          {relativeNotes.length} notes · {relativeBookmarks.length} links
                        </span>
                        
                        <button 
                          onClick={() => {
                            setSelectedCollectionId(col.id);
                            setActiveTab('notes');
                          }}
                          className="text-[#5194ec] hover:underline font-bold"
                        >
                          Explore desk ↗
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          )}

          {/* SCREEN 3: NOTES desk (EDITOR & NOTES LEDGER) */}
          {activeTab === 'notes' && (
            <div className="flex-1 flex overflow-hidden">
              
              {/* Notes List Panel */}
              <div className="w-80 border-r border-neutral-900 flex flex-col justify-between flex-shrink-0 bg-neutral-950/40 text-left select-none">
                <div className="p-4 flex-1 flex flex-col overflow-hidden">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-400">Notes ledger</span>
                    <button 
                      onClick={() => handleCreateNote()}
                      className="p-1.5 rounded-lg bg-[#5194ec] hover:bg-blue-600 text-white cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Filter by Active Collection if selected */}
                  {selectedCollectionId && (
                    <div className="mb-3 p-2 bg-[#5194ec]/10 border border-[#5194ec]/20 rounded-xl flex justify-between items-center text-xs text-neutral-300">
                      <span className="font-semibold">Collection: {workspace.collections.find(c => c.id === selectedCollectionId)?.name}</span>
                      <button onClick={() => setSelectedCollectionId(null)} className="text-[10px] text-rose-400 hover:underline font-bold">Clear</button>
                    </div>
                  )}

                  {/* Note Cards List */}
                  <div className="flex-1 overflow-y-auto space-y-2 pr-1 scrollbar-none">
                    {workspace.notes
                      .filter(n => !selectedCollectionId || n.collectionId === selectedCollectionId)
                      .map(note => (
                        <button 
                          key={note.id}
                          onClick={() => setSelectedNoteId(note.id)}
                          className={`w-full text-left p-3.5 rounded-2xl border transition-all cursor-pointer block ${
                            selectedNoteId === note.id ? 'bg-[#5194ec]/5 border-[#5194ec]/30 shadow-inner' : 'bg-neutral-950/40 border-neutral-900 hover:border-neutral-850'
                          }`}
                        >
                          <div className="flex justify-between items-start gap-2">
                            <h4 className="text-xs font-bold text-neutral-200 line-clamp-1 flex-1">{note.title}</h4>
                            {note.pinned && <Pin className="w-3 h-3 text-amber-400 flex-shrink-0 mt-0.5" />}
                          </div>
                          
                          <p className="text-[10px] text-neutral-500 mt-1 line-clamp-2 leading-relaxed">
                            {note.content.replace(/[#*`\-_[\]()]+/g, '')}
                          </p>

                          <div className="flex items-center justify-between mt-3 text-[9px] text-neutral-500 font-mono">
                            <span>{new Date(note.updatedAt).toLocaleDateString()}</span>
                            <div className="flex gap-1">
                              {note.tags.slice(0, 2).map((t, i) => (
                                <span key={i} className="px-1.5 py-0.2 rounded border border-neutral-800 bg-neutral-900 text-neutral-400 font-mono">
                                  {t}
                                </span>
                              ))}
                            </div>
                          </div>
                        </button>
                      ))}
                    
                    {workspace.notes.filter(n => !selectedCollectionId || n.collectionId === selectedCollectionId).length === 0 && (
                      <div className="text-center py-12 text-neutral-600 text-xs font-mono select-none">No notes logged. Create one now.</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Note Content Editor Area */}
              {(() => {
                const note = workspace.notes.find(n => n.id === selectedNoteId);
                if (!note) {
                  return (
                    <div className="flex-1 flex flex-col items-center justify-center text-neutral-600 p-8 select-none">
                      <FileText className="w-12 h-12 mb-3 text-neutral-800 animate-pulse" />
                      <p className="text-sm font-semibold font-mono">No note selected</p>
                      <button onClick={() => handleCreateNote()} className="mt-4 px-4 py-2 rounded-xl border border-neutral-800 text-xs text-neutral-300 hover:bg-neutral-900 cursor-pointer">
                        Write a Note
                      </button>
                    </div>
                  );
                }

                return (
                  <div className="flex-1 flex overflow-hidden relative">
                    
                    {/* Writing stage */}
                    <div className="flex-1 flex flex-col justify-between overflow-y-auto p-6 md:p-8 space-y-6 text-left">
                      
                      {/* Top Action Ribbon */}
                      <div className="flex justify-between items-center border-b border-neutral-900 pb-4 select-none">
                        <div className="flex items-center gap-3">
                          <button 
                            onClick={() => handleUpdateNote(note.id, { pinned: !note.pinned })}
                            className={`p-1.5 rounded-xl border border-neutral-800 hover:bg-neutral-900 cursor-pointer ${note.pinned ? 'text-amber-400' : 'text-neutral-500'}`}
                            title="Pin Note"
                          >
                            <Pin className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleUpdateNote(note.id, { favorite: !note.favorite })}
                            className={`p-1.5 rounded-xl border border-neutral-800 hover:bg-neutral-900 cursor-pointer ${note.favorite ? 'text-rose-500' : 'text-neutral-500'}`}
                            title="Favorite Note"
                          >
                            <Heart className="w-4 h-4" />
                          </button>
                          <div className="h-4 w-[1px] bg-neutral-800" />
                          
                          {/* Export / Print */}
                          <button 
                            onClick={() => exportAsMarkdown(note)}
                            className="p-1.5 rounded-xl border border-neutral-800 hover:bg-neutral-900 text-neutral-400 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 text-xs"
                            title="Export as Markdown"
                          >
                            <Download className="w-4 h-4" />
                            <span>Export</span>
                          </button>
                          
                          <button 
                            onClick={triggerPrintNote}
                            className="p-1.5 rounded-xl border border-neutral-800 hover:bg-neutral-900 text-neutral-400 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 text-xs"
                            title="Print Note"
                          >
                            <Printer className="w-4 h-4" />
                            <span>Print</span>
                          </button>
                          
                          <button 
                            onClick={() => setIsVersionsOpen(true)}
                            className="p-1.5 rounded-xl border border-neutral-800 hover:bg-neutral-900 text-neutral-400 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 text-xs"
                            title="Version History"
                          >
                            <History className="w-4 h-4" />
                            <span>History ({note.versions?.length || 0})</span>
                          </button>
                        </div>

                        {/* Collapsible Note AI Assistant button */}
                        <button 
                          onClick={() => setIsNoteAssistantOpen(!isNoteAssistantOpen)}
                          className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-purple-500/25 bg-purple-500/10 hover:bg-purple-500/15 text-purple-400 text-xs font-bold transition-all cursor-pointer shadow-[0_0_12px_rgba(168,85,247,0.15)]"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>AI Assistant</span>
                        </button>
                      </div>

                      {/* Editing inputs */}
                      <div className="space-y-4 flex-1 flex flex-col">
                        <input 
                          type="text" 
                          value={note.title}
                          onChange={(e) => handleUpdateNote(note.id, { title: e.target.value })}
                          className="w-full bg-transparent border-none text-2xl font-display font-bold text-white focus:outline-none placeholder-neutral-700 tracking-tight"
                          placeholder="Untitled Research Document"
                        />

                        {/* Tags list editor */}
                        <div className="flex items-center gap-2 flex-wrap select-none">
                          <Tag className="w-3.5 h-3.5 text-neutral-500" />
                          {note.tags.map((tag, i) => (
                            <span key={i} className="text-[10px] font-mono font-bold bg-neutral-900 border border-neutral-800 text-neutral-300 px-2 py-0.5 rounded-lg flex items-center gap-1">
                              {tag}
                              <button 
                                onClick={() => handleUpdateNote(note.id, { tags: note.tags.filter(t => t !== tag) })}
                                className="text-rose-400 hover:text-rose-300 cursor-pointer"
                              >
                                ×
                              </button>
                            </span>
                          ))}
                          <button 
                            onClick={() => {
                              const t = prompt('Add custom tag:');
                              if (t && t.trim() && !note.tags.includes(t.trim())) {
                                handleUpdateNote(note.id, { tags: [...note.tags, t.trim()] });
                              }
                            }}
                            className="text-[10px] text-[#5194ec] hover:underline font-bold font-mono uppercase cursor-pointer"
                          >
                            + Add Tag
                          </button>
                        </div>

                        <div className="h-[1px] bg-neutral-900 select-none" />

                        {/* Rich Editor Actions toolbar */}
                        <div className="flex flex-wrap items-center gap-1 bg-neutral-950/80 border border-neutral-900 p-2 rounded-xl text-neutral-400 text-xs select-none">
                          <button onClick={() => handleUpdateNote(note.id, { content: note.content + '\n# Heading 1' })} className="px-2.5 py-1 rounded hover:bg-neutral-900 hover:text-white font-bold cursor-pointer">H1</button>
                          <button onClick={() => handleUpdateNote(note.id, { content: note.content + '\n## Heading 2' })} className="px-2.5 py-1 rounded hover:bg-neutral-900 hover:text-white font-bold cursor-pointer">H2</button>
                          <button onClick={() => handleUpdateNote(note.id, { content: note.content + ' **Bold Text**' })} className="px-2.5 py-1 rounded hover:bg-neutral-900 hover:text-white font-bold cursor-pointer">B</button>
                          <button onClick={() => handleUpdateNote(note.id, { content: note.content + ' *Italic Text*' })} className="px-2.5 py-1 rounded hover:bg-neutral-900 hover:text-white italic cursor-pointer">I</button>
                          <button onClick={() => handleUpdateNote(note.id, { content: note.content + '\n- Bullet Item' })} className="px-2.5 py-1 rounded hover:bg-neutral-900 hover:text-white cursor-pointer">List</button>
                          <button onClick={() => handleUpdateNote(note.id, { content: note.content + '\n- [ ] Task checkbox' })} className="px-2.5 py-1 rounded hover:bg-neutral-900 hover:text-white cursor-pointer">Todo</button>
                          <button onClick={() => handleUpdateNote(note.id, { content: note.content + '\n> Quote statement' })} className="px-2.5 py-1 rounded hover:bg-neutral-900 hover:text-white cursor-pointer">Quote</button>
                          <button onClick={() => handleUpdateNote(note.id, { content: note.content + '\n\`\`\`ts\n// Code block\n\`\`\`' })} className="px-2.5 py-1 rounded hover:bg-neutral-900 hover:text-white font-mono cursor-pointer">Code</button>
                        </div>

                        {/* Text Editor TextArea */}
                        <textarea 
                          value={note.content}
                          onChange={(e) => handleUpdateNote(note.id, { content: e.target.value })}
                          className="w-full flex-1 bg-transparent border-none text-neutral-300 font-sans leading-relaxed text-sm focus:outline-none resize-none placeholder-neutral-800 min-h-[300px]"
                          placeholder="# Write using Markdown..."
                        />
                      </div>

                      {/* Footer Info / Auto Save State */}
                      <div className="flex justify-between items-center text-[10px] text-neutral-500 font-mono pt-4 border-t border-neutral-900 select-none">
                        <span>Characters: {note.content.length} | Words: {note.content.split(/\s+/).filter(Boolean).length}</span>
                        <div className="flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                          <span>Auto-save active</span>
                        </div>
                      </div>
                    </div>

                    {/* AI NOTE ASSISTANT SIDE PANEL */}
                    <AnimatePresence>
                      {isNoteAssistantOpen && (
                        <motion.div 
                          initial={{ width: 0, opacity: 0 }}
                          animate={{ width: 340, opacity: 1 }}
                          exit={{ width: 0, opacity: 0 }}
                          transition={{ duration: 0.28, ease: "easeInOut" }}
                          className="border-l border-neutral-900 bg-[#0a0a0c] h-full flex flex-col justify-between overflow-hidden relative z-10"
                        >
                          <div className="p-4 border-b border-neutral-900 flex justify-between items-center bg-neutral-950/20 select-none">
                            <div className="flex items-center gap-2">
                              <Sparkles className="w-4 h-4 text-purple-400" />
                              <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">AI Note Copilot</span>
                            </div>
                            <button onClick={() => setIsNoteAssistantOpen(false)} className="text-neutral-500 hover:text-white text-xs p-1">×</button>
                          </div>

                          <div className="p-4 flex-1 overflow-y-auto space-y-4">
                            
                            {/* Command tools list */}
                            <div className="space-y-2 select-none">
                              <span className="text-[9px] font-mono font-bold text-neutral-500 uppercase tracking-widest block">Note Actions</span>
                              <div className="grid grid-cols-2 gap-2">
                                <button onClick={() => handleNoteAssistantAction('summarize')} className="px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-850 hover:bg-neutral-900 hover:text-white text-left text-[11px] font-semibold text-neutral-300 transition-colors cursor-pointer flex items-center gap-1.5">
                                  <span>📝 Summarize</span>
                                </button>
                                <button onClick={() => handleNoteAssistantAction('improve')} className="px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-850 hover:bg-neutral-900 hover:text-white text-left text-[11px] font-semibold text-neutral-300 transition-colors cursor-pointer flex items-center gap-1.5">
                                  <span>✨ Refine Draft</span>
                                </button>
                                <button onClick={() => handleNoteAssistantAction('flashcards')} className="px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-850 hover:bg-neutral-900 hover:text-white text-left text-[11px] font-semibold text-neutral-300 transition-colors cursor-pointer flex items-center gap-1.5">
                                  <span>🎴 Flashcards</span>
                                </button>
                                <button onClick={() => handleNoteAssistantAction('actions')} className="px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-850 hover:bg-neutral-900 hover:text-white text-left text-[11px] font-semibold text-neutral-300 transition-colors cursor-pointer flex items-center gap-1.5">
                                  <span>✅ Action items</span>
                                </button>
                                <button onClick={() => handleNoteAssistantAction('study_plan')} className="px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-850 hover:bg-neutral-900 hover:text-white text-left text-[11px] font-semibold text-neutral-300 transition-colors cursor-pointer flex items-center gap-1.5">
                                  <span>📅 Study Plan</span>
                                </button>
                                <button onClick={() => handleNoteAssistantAction('questions')} className="px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-850 hover:bg-neutral-900 hover:text-white text-left text-[11px] font-semibold text-neutral-300 transition-colors cursor-pointer flex items-center gap-1.5">
                                  <span>❓ Self-Check</span>
                                </button>
                              </div>
                            </div>

                            <div className="h-[1px] bg-neutral-900 select-none" />

                            {/* Output Panel */}
                            <div className="space-y-2 text-left">
                              <span className="text-[9px] font-mono font-bold text-neutral-500 uppercase tracking-widest block select-none">AI Intelligence Output</span>
                              
                              {assistantLoading ? (
                                <div className="space-y-4 py-8 animate-pulse text-center select-none">
                                  <RefreshCw className="w-6 h-6 mx-auto text-purple-400 animate-spin" />
                                  <p className="text-[11px] text-neutral-500 font-mono">Gemini executing neural inference...</p>
                                </div>
                              ) : assistantOutput ? (
                                <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-900 text-xs text-neutral-300 leading-relaxed space-y-4 select-text max-h-[360px] overflow-y-auto">
                                  {assistantOutput.split('\n').map((line, i) => {
                                    if (line.startsWith('# ')) {
                                      return <h4 key={i} className="font-bold text-white mt-3 border-b border-neutral-900 pb-1">{line.replace('# ', '')}</h4>;
                                    }
                                    if (line.startsWith('## ')) {
                                      return <h5 key={i} className="font-bold text-[#5194ec] mt-2">{line.replace('## ', '')}</h5>;
                                    }
                                    if (line.startsWith('### ')) {
                                      return <h5 key={i} className="font-bold text-purple-400 mt-2">{line.replace('### ', '')}</h5>;
                                    }
                                    if (line.startsWith('- ') || line.startsWith('* ')) {
                                      return <li key={i} className="ml-3 list-disc text-neutral-300">{line.replace(/^[-*]\s+/, '')}</li>;
                                    }
                                    return <p key={i}>{line}</p>;
                                  })}
                                </div>
                              ) : (
                                <div className="p-6 rounded-xl border border-dashed border-neutral-850 text-center text-xs text-neutral-600 font-mono select-none">
                                  Trigger an action to begin.
                                </div>
                              )}
                            </div>

                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* VERSION HISTORY OVERLAY POPUP */}
                    <AnimatePresence>
                      {isVersionsOpen && (
                        <div className="absolute inset-0 bg-[#000]/70 backdrop-blur-sm z-40 flex items-center justify-center p-4 select-none">
                          <motion.div 
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-neutral-950 border border-neutral-800 rounded-3xl p-6 max-w-lg w-full max-h-[480px] flex flex-col justify-between"
                          >
                            <div className="flex justify-between items-center border-b border-neutral-900 pb-3">
                              <h3 className="font-bold text-base text-white">Version Backups</h3>
                              <button onClick={() => setIsVersionsOpen(false)} className="text-neutral-500 hover:text-white">×</button>
                            </div>

                            <div className="flex-1 overflow-y-auto mt-4 space-y-2.5">
                              {note.versions && note.versions.length > 0 ? (
                                note.versions.map((ver, idx) => (
                                  <div key={idx} className="p-3 bg-neutral-900/60 border border-neutral-850 rounded-xl flex items-center justify-between">
                                    <div className="text-left">
                                      <p className="text-xs font-bold text-neutral-200">{ver.title}</p>
                                      <p className="text-[10px] text-neutral-500 mt-0.5">{new Date(ver.timestamp).toLocaleString()}</p>
                                    </div>
                                    <button 
                                      onClick={() => {
                                        handleUpdateNote(note.id, { content: ver.content });
                                        setIsVersionsOpen(false);
                                      }}
                                      className="text-xs text-[#5194ec] hover:underline font-bold cursor-pointer"
                                    >
                                      Revert to this
                                    </button>
                                  </div>
                                ))
                              ) : (
                                <div className="text-center py-12 text-neutral-600 text-xs font-mono">No previous backups saved. Backups are saved automatically as you edit content.</div>
                              )}
                            </div>
                          </motion.div>
                        </div>
                      )}
                    </AnimatePresence>

                  </div>
                );
              })()}
            </div>
          )}

          {/* SCREEN 4: BOOKMARK SYSTEM */}
          {activeTab === 'bookmarks' && (
            <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full text-left">
              <div className="space-y-1">
                <h1 className="text-2xl font-bold tracking-tight text-white">Syncable Bookmarks Ledger</h1>
                <p className="text-xs text-neutral-400">Add, track and categorize high-signal articles, benchmark dashboards, datasets and code repositories.</p>
              </div>

              {/* Add custom Bookmark quick form */}
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  const t = prompt('Bookmark Title:');
                  const u = prompt('Bookmark URL (e.g. https://...):');
                  if (t && u) {
                    handleAddBookmark(t, u, 'article', 'General');
                  }
                }}
                className="flex justify-end select-none"
              >
                <button type="submit" className="flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-900 border border-neutral-800 hover:bg-neutral-850 text-xs font-bold text-white cursor-pointer">
                  <Plus className="w-4 h-4 text-emerald-400" />
                  <span>Bookmark Custom URL</span>
                </button>
              </form>

              {/* Bookmarks Tabbed ledger */}
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2 border-b border-neutral-900 pb-3 select-none">
                  <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-[#5194ec]/10 text-[#5194ec]">All bookmarks ({workspace.bookmarks.length})</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {workspace.bookmarks.map(bm => (
                    <div key={bm.id} className="p-5 rounded-2xl bg-neutral-950/40 border border-neutral-900 hover:border-neutral-850 transition-all flex flex-col justify-between min-h-36">
                      <div className="space-y-2">
                        <div className="flex justify-between items-start gap-2">
                          <span className="text-[9px] px-2 py-0.5 rounded-md border border-neutral-800 bg-neutral-900 font-bold font-mono uppercase tracking-widest text-neutral-500">
                            {bm.type}
                          </span>
                          
                          {/* Quick controls */}
                          <div className="flex gap-1.5 opacity-0 hover:opacity-100 group-hover:opacity-100 transition-opacity select-none">
                            <button onClick={() => handleToggleBookmarkPin(bm.id)} className={`p-1 rounded bg-neutral-900 border border-neutral-800 cursor-pointer ${bm.pinned ? 'text-amber-400' : 'text-neutral-500'}`}><Pin className="w-3 h-3" /></button>
                            <button onClick={() => handleToggleBookmarkFavorite(bm.id)} className={`p-1 rounded bg-neutral-900 border border-neutral-800 cursor-pointer ${bm.favorite ? 'text-rose-500' : 'text-neutral-500'}`}><Heart className="w-3 h-3" /></button>
                            <button onClick={() => handleDeleteBookmark(bm.id)} className="p-1 rounded bg-neutral-900 border border-neutral-800 text-rose-400 hover:bg-rose-500/10 cursor-pointer"><Trash2 className="w-3 h-3" /></button>
                          </div>
                        </div>

                        <h3 className="font-bold text-sm text-neutral-200 line-clamp-1">{bm.title}</h3>
                        {bm.notes && <p className="text-xs text-neutral-400 font-sans leading-relaxed italic">"{bm.notes}"</p>}
                      </div>

                      <div className="border-t border-neutral-900 pt-3 mt-4 flex items-center justify-between text-[10px] text-neutral-500 font-mono">
                        <span>Added {new Date(bm.dateAdded).toLocaleDateString()}</span>
                        <a 
                          href={bm.url} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="text-[#5194ec] hover:underline font-bold flex items-center gap-1 select-none"
                        >
                          Visit Intel ↗
                        </a>
                      </div>
                    </div>
                  ))}

                  {workspace.bookmarks.length === 0 && (
                    <div className="col-span-2 text-center py-20 text-neutral-600 text-xs font-mono select-none">No bookmarks synced. Open some intelligence feed items to add.</div>
                  )}
                </div>
              </div>

            </div>
          )}

          {/* SCREEN 5: PROJECTS SYSTEM */}
          {activeTab === 'projects' && (
            <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto w-full text-left">
              {(() => {
                const proj = workspace.projects.find(p => p.id === selectedProjectId);
                if (!proj) {
                  return (
                    <div className="text-center py-20 text-neutral-600 text-xs font-mono select-none">
                      <Layers className="w-12 h-12 mx-auto mb-3 text-neutral-800" />
                      <p>No project selected. Create a project using the sidebar '+' trigger.</p>
                    </div>
                  );
                }

                // Gather elements relating to this project
                const relatedNotes = workspace.notes.filter(n => n.projectId === proj.id);
                const chatHistory = projectChats[proj.id] || [
                  { role: 'assistant', content: `Project context-aware model compiled. Ask me anything about your items matching project files.`, timestamp: new Date().toISOString() }
                ];

                return (
                  <div className="space-y-8">
                    
                    {/* Project Header card */}
                    <div className="p-8 rounded-[28px] border border-neutral-900 bg-neutral-950/40 flex justify-between items-start">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#5194ec]" />
                          <h1 className="text-2xl font-bold text-white tracking-tight">{proj.name}</h1>
                        </div>
                        <p className="text-sm text-neutral-400 max-w-2xl">{proj.description || 'System comparison task folder.'}</p>
                        <p className="text-[10px] text-neutral-500 font-mono">CREATED: {new Date(proj.createdAt).toLocaleDateString()}</p>
                      </div>

                      <div className="flex gap-2 select-none">
                        <button 
                          onClick={() => {
                            const title = prompt('Timeline Action Event Title:');
                            const desc = prompt('Timeline Action Event Description:');
                            if (title && desc) {
                              handleAddProjectTimelineEvent(proj.id, title, desc);
                            }
                          }}
                          className="px-3.5 py-1.5 rounded-xl border border-neutral-800 hover:bg-neutral-900 text-xs font-bold text-neutral-300 transition-colors cursor-pointer"
                        >
                          + Add Timeline Event
                        </button>
                        <button 
                          onClick={() => handleDeleteProject(proj.id)}
                          className="px-3.5 py-1.5 rounded-xl border border-rose-500/10 hover:bg-rose-500/10 text-xs font-bold text-rose-400 transition-colors cursor-pointer"
                        >
                          Delete Project
                        </button>
                      </div>
                    </div>

                    {/* Outer bento columns split */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                      
                      {/* Left: Notes & Files related */}
                      <div className="lg:col-span-2 space-y-6">
                        
                        {/* Note attachments */}
                        <div className="p-6 rounded-2xl border border-neutral-900 bg-neutral-950/20">
                          <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-sm text-neutral-200">Attached Notes</h3>
                            <button 
                              onClick={() => handleCreateNote('Compare GPT pricing models', 'Draft comparison tables...', ['Pricing'], proj.id)}
                              className="text-xs text-[#5194ec] hover:underline font-bold cursor-pointer"
                            >
                              + Create Note
                            </button>
                          </div>

                          <div className="space-y-3">
                            {relatedNotes.map(n => (
                              <div key={n.id} className="p-3.5 rounded-xl bg-neutral-950/60 border border-neutral-900 flex justify-between items-center text-xs">
                                <div className="truncate pr-4">
                                  <p className="font-bold text-neutral-200 truncate">{n.title}</p>
                                  <p className="text-[10px] text-neutral-500 mt-1">Updated {new Date(n.updatedAt).toLocaleDateString()}</p>
                                </div>
                                <button 
                                  onClick={() => {
                                    setSelectedNoteId(n.id);
                                    setActiveTab('notes');
                                  }}
                                  className="text-[#5194ec] hover:underline font-bold"
                                >
                                  Open Note ↗
                                </button>
                              </div>
                            ))}
                            {relatedNotes.length === 0 && (
                              <div className="text-center py-6 text-neutral-600 text-xs font-mono">No notes linked. Attach a note to begin.</div>
                            )}
                          </div>
                        </div>

                        {/* Interactive Timeline */}
                        <div className="p-6 rounded-2xl border border-neutral-900 bg-neutral-950/20">
                          <h3 className="font-bold text-sm text-neutral-200 mb-6">Project Progress Timeline</h3>
                          
                          <div className="relative border-l border-neutral-800 pl-6 ml-3 space-y-6">
                            {proj.timeline && proj.timeline.map((ev, i) => (
                              <div key={i} className="relative">
                                <div className="absolute -left-[31px] top-0.5 w-2.5 h-2.5 rounded-full bg-[#5194ec] border-2 border-[#000]" />
                                <span className="text-[10px] font-mono text-neutral-500 font-bold block">{ev.date}</span>
                                <h4 className="text-xs font-bold text-neutral-200 mt-1">{ev.title}</h4>
                                <p className="text-xs text-neutral-400 mt-1 leading-relaxed">{ev.description}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                      </div>

                      {/* Right: Project Scoped AI Chat */}
                      <div className="space-y-6">
                        <div className="p-6 rounded-2xl border border-neutral-900 bg-neutral-950/20 flex flex-col h-[480px] justify-between">
                          <div className="space-y-2 mb-4 text-left border-b border-neutral-900 pb-3 select-none">
                            <h3 className="font-bold text-xs text-neutral-400 font-mono uppercase tracking-wider">Project Neural Assistant</h3>
                            <p className="text-[10px] text-neutral-500 font-sans leading-normal">Answers are dynamically customized to files within this project folder.</p>
                          </div>

                          {/* Chat Box */}
                          <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-left scrollbar-none">
                            {chatHistory.map((m, i) => (
                              <div key={i} className={`p-3 rounded-xl max-w-[85%] text-xs leading-relaxed ${m.role === 'user' ? 'bg-neutral-900 text-neutral-100 ml-auto' : 'bg-[#5194ec]/10 border border-[#5194ec]/10 text-neutral-300'}`}>
                                {m.content}
                              </div>
                            ))}
                            {projectChatLoading && (
                              <div className="flex items-center gap-2 p-3 bg-neutral-950 border border-neutral-900 rounded-xl max-w-[85%] text-xs text-neutral-500 select-none">
                                <RefreshCw className="w-3 animate-spin text-purple-400" />
                                <span>Scanning project context...</span>
                              </div>
                            )}
                          </div>

                          {/* Input field */}
                          <form onSubmit={(e) => handleSendProjectChatMessage(e, proj.id)} className="flex items-center gap-2 mt-4 select-none">
                            <input 
                              type="text" 
                              placeholder="Ask anything about these notes..." 
                              value={projectChatMessage}
                              onChange={(e) => setProjectChatMessage(e.target.value)}
                              disabled={projectChatLoading}
                              className="flex-grow bg-neutral-950 border border-neutral-850 focus:border-[#5194ec]/80 focus:outline-none text-xs text-neutral-200 placeholder-neutral-600 px-3 py-2.5 rounded-xl transition-all"
                            />
                            <button type="submit" disabled={!projectChatMessage.trim() || projectChatLoading} className="p-2.5 rounded-xl bg-[#5194ec] text-white hover:bg-blue-600 transition-colors cursor-pointer">
                              <Send className="w-3.5 h-3.5" />
                            </button>
                          </form>
                        </div>
                      </div>

                    </div>

                  </div>
                );
              })()}
            </div>
          )}

          {/* SCREEN 6: AI COPILOT CHAT */}
          {activeTab === 'copilot' && (
            <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col justify-between p-6 md:p-8 h-full">
              <div className="space-y-2 border-b border-neutral-900 pb-4 text-left select-none">
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-5 h-5 text-purple-400 animate-pulse" />
                  <h1 className="text-xl font-bold text-white tracking-tight">AI Workspace Copilot</h1>
                </div>
                <p className="text-xs text-neutral-400 leading-normal">Gemini scans everything saved in your workspace to answer comprehensive research questions.</p>
              </div>

              {/* Suggestions grid */}
              {copilotHistory.length === 1 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 my-8 text-left select-none">
                  <button 
                    onClick={() => { setCopilotMessage("Summarize all my saved research papers and notes this week."); }}
                    className="p-4 rounded-xl bg-neutral-950 border border-neutral-900 hover:border-neutral-800 hover:bg-neutral-900/30 text-left transition-all text-xs font-semibold text-neutral-300 flex items-center gap-2.5 cursor-pointer"
                  >
                    <span>📑 Summarize all notes written this week</span>
                  </button>
                  <button 
                    onClick={() => { setCopilotMessage("Compare all the AI models I have bookmarked so far."); }}
                    className="p-4 rounded-xl bg-neutral-950 border border-neutral-900 hover:border-neutral-800 hover:bg-neutral-900/30 text-left transition-all text-xs font-semibold text-neutral-300 flex items-center gap-2.5 cursor-pointer"
                  >
                    <span>⚖️ Compare my bookmarked models</span>
                  </button>
                  <button 
                    onClick={() => { setCopilotMessage("Find any duplicate notes or related research streams."); }}
                    className="p-4 rounded-xl bg-neutral-950 border border-neutral-900 hover:border-neutral-800 hover:bg-neutral-900/30 text-left transition-all text-xs font-semibold text-neutral-300 flex items-center gap-2.5 cursor-pointer"
                  >
                    <span>🔍 Scan duplicates & redundant files</span>
                  </button>
                  <button 
                    onClick={() => { setCopilotMessage("Draft revision guides and study schedules from my notes."); }}
                    className="p-4 rounded-xl bg-neutral-950 border border-neutral-900 hover:border-neutral-800 hover:bg-neutral-900/30 text-left transition-all text-xs font-semibold text-neutral-300 flex items-center gap-2.5 cursor-pointer"
                  >
                    <span>🗂️ Build structured revision flashcards</span>
                  </button>
                </div>
              )}

              {/* Conversations Scroller */}
              <div className="flex-1 overflow-y-auto space-y-4 my-6 pr-1 text-left scrollbar-none">
                {copilotHistory.map((m, i) => (
                  <div key={i} className={`p-4 rounded-2xl text-xs leading-relaxed max-w-[85%] ${m.role === 'user' ? 'bg-neutral-900 text-neutral-100 ml-auto' : 'bg-neutral-950 border border-neutral-900 text-neutral-300'}`}>
                    <div className="font-bold mb-1 font-mono uppercase tracking-widest text-[9px] text-neutral-500">
                      {m.role === 'user' ? 'Technologist' : 'AI Copilot'}
                    </div>
                    
                    {m.role === 'user' ? (
                      <p>{m.content}</p>
                    ) : (
                      <div className="space-y-3">
                        {m.content.split('\n').map((line, idx) => {
                          if (line.startsWith('### ')) {
                            return <h4 key={idx} className="font-bold text-[#5194ec] mt-3">{line.replace('### ', '')}</h4>;
                          }
                          if (line.startsWith('- ')) {
                            return <li key={idx} className="ml-3 list-disc text-neutral-300">{line.replace('- ', '')}</li>;
                          }
                          return <p key={idx}>{line}</p>;
                        })}
                      </div>
                    )}
                  </div>
                ))}
                {copilotLoading && (
                  <div className="flex items-center gap-2 p-4 bg-neutral-950 border border-neutral-900 rounded-2xl max-w-[85%] text-xs text-neutral-500 select-none">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-purple-400" />
                    <span>Gemini is scanning personal files...</span>
                  </div>
                )}
              </div>

              {/* Chat form */}
              <form onSubmit={handleSendCopilotMessage} className="flex items-center gap-2 select-none">
                <input 
                  type="text" 
                  placeholder="Ask anything about your stored models, notes, and research..." 
                  value={copilotMessage}
                  onChange={(e) => setCopilotMessage(e.target.value)}
                  disabled={copilotLoading}
                  className="flex-grow bg-neutral-950 border border-neutral-900 focus:border-[#5194ec]/80 focus:outline-none text-xs text-neutral-200 placeholder-neutral-600 px-4 py-3 rounded-xl transition-all"
                />
                <button type="submit" disabled={!copilotMessage.trim() || copilotLoading} className="p-3.5 rounded-xl bg-[#5194ec] text-white hover:bg-blue-600 transition-colors cursor-pointer">
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}

          {/* SCREEN 7: REMINDERS LIST */}
          {activeTab === 'reminders' && (
            <div className="p-6 md:p-8 space-y-6 max-w-4xl mx-auto w-full text-left">
              <div className="space-y-1">
                <h1 className="text-2xl font-bold tracking-tight text-white">Task Reminders</h1>
                <p className="text-xs text-neutral-400">Add schedule alerts for deep-reading papers, following company releases, or checking benchmark models.</p>
              </div>

              {/* Add reminder Form */}
              <form onSubmit={handleCreateReminder} className="p-5 rounded-2xl border border-neutral-900 bg-neutral-950/20 grid grid-cols-1 md:grid-cols-4 gap-4 items-end select-none">
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] font-mono font-bold text-neutral-500 uppercase tracking-widest">Reminder Title</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Read AlphaProof Nature paper" 
                    value={newReminderTitle}
                    onChange={(e) => setNewReminderTitle(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-850 text-xs text-white placeholder-neutral-700 p-2.5 rounded-xl focus:outline-none focus:border-[#5194ec]/80 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-mono font-bold text-neutral-500 uppercase tracking-widest">Type</label>
                  <select 
                    value={newReminderType}
                    onChange={(e: any) => setNewReminderType(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-850 text-xs text-white p-2.5 rounded-xl focus:outline-none focus:border-[#5194ec]/80 transition-all cursor-pointer"
                  >
                    <option value="read_later">📖 Read Later</option>
                    <option value="review_benchmark">📊 Review Benchmark</option>
                    <option value="follow_company">🏢 Follow Company</option>
                    <option value="research_reminder">🧬 Research reminder</option>
                  </select>
                </div>

                <button type="submit" className="w-full py-2.5 rounded-xl bg-[#5194ec] hover:bg-blue-600 text-white font-bold text-xs transition-colors cursor-pointer">
                  Set reminder
                </button>
              </form>

              {/* Reminders List */}
              <div className="space-y-3">
                {workspace.reminders.map(rem => (
                  <div key={rem.id} className={`p-4 rounded-xl border flex items-center justify-between transition-all ${rem.completed ? 'bg-neutral-950/20 border-neutral-950 text-neutral-600' : 'bg-neutral-950/40 border-neutral-900 text-neutral-200'}`}>
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => handleToggleReminderCompleted(rem.id)}
                        className={`p-1 rounded-md border cursor-pointer transition-all ${rem.completed ? 'border-emerald-500/20 text-emerald-500 bg-emerald-500/5' : 'border-neutral-800 hover:border-neutral-750 text-neutral-500 hover:text-white'}`}
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                      
                      <div className="text-left">
                        <p className={`text-xs font-bold ${rem.completed ? 'line-through text-neutral-600' : 'text-neutral-200'}`}>{rem.title}</p>
                        <span className="text-[9px] font-mono text-neutral-500 uppercase font-bold mt-1 block">
                          {rem.type.replace('_', ' ')} · DUE: {rem.dueDate}
                        </span>
                      </div>
                    </div>

                    <button 
                      onClick={() => handleDeleteReminder(rem.id)}
                      className="text-neutral-500 hover:text-rose-400 p-1.5 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}

                {workspace.reminders.length === 0 && (
                  <div className="text-center py-12 text-neutral-600 text-xs font-mono select-none">No reminders active. Add one above.</div>
                )}
              </div>

            </div>
          )}

        </main>
      </div>

      {/* MODAL: CREATE COLLECTION */}
      <AnimatePresence>
        {isCreatingCollection && (
          <div className="fixed inset-0 bg-[#000]/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 select-none">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-neutral-950 border border-neutral-900 rounded-3xl p-6 max-w-md w-full text-left"
            >
              <h3 className="font-bold text-base text-white border-b border-neutral-900 pb-3">Create Collection</h3>
              
              <form onSubmit={handleCreateCollection} className="mt-4 space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-mono font-bold text-neutral-500 uppercase tracking-widest">Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. LLM Frontiers" 
                    value={newColName}
                    onChange={(e) => setNewColName(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 text-xs text-white p-2.5 rounded-xl focus:outline-none"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-mono font-bold text-neutral-500 uppercase tracking-widest">Description</label>
                  <textarea 
                    placeholder="Briefly state target topics..." 
                    value={newColDesc}
                    onChange={(e) => setNewColDesc(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 text-xs text-white p-2.5 rounded-xl focus:outline-none resize-none h-20"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-mono font-bold text-neutral-500 uppercase tracking-widest block">Color Tag</label>
                  <div className="flex gap-2">
                    {['#5194ec', '#10b981', '#a855f7', '#f59e0b', '#f43f5e', '#ec4899'].map(c => (
                      <button 
                        key={c}
                        type="button"
                        onClick={() => setNewColColor(c)}
                        className={`w-6 h-6 rounded-full border-2 cursor-pointer ${newColColor === c ? 'border-white scale-110' : 'border-transparent'}`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-2.5 pt-3">
                  <button type="button" onClick={() => setIsCreatingCollection(false)} className="px-4 py-2 rounded-xl border border-neutral-850 hover:bg-neutral-900 text-xs font-semibold text-neutral-400">
                    Cancel
                  </button>
                  <button type="submit" className="px-4 py-2 rounded-xl bg-[#5194ec] hover:bg-blue-600 text-white font-bold text-xs">
                    Create Folder
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: CREATE PROJECT */}
      <AnimatePresence>
        {isCreatingProject && (
          <div className="fixed inset-0 bg-[#000]/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 select-none">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-neutral-950 border border-neutral-900 rounded-3xl p-6 max-w-md w-full text-left"
            >
              <h3 className="font-bold text-base text-white border-b border-neutral-900 pb-3">Spawn Research Project</h3>
              
              <form onSubmit={handleCreateProject} className="mt-4 space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-mono font-bold text-neutral-500 uppercase tracking-widest">Project Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Compare GPT vs Claude" 
                    value={newProjName}
                    onChange={(e) => setNewProjName(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 text-xs text-white p-2.5 rounded-xl focus:outline-none"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-mono font-bold text-neutral-500 uppercase tracking-widest">Description</label>
                  <textarea 
                    placeholder="e.g. Benchmark latencies, token parameters and pricing structures..." 
                    value={newProjDesc}
                    onChange={(e) => setNewProjDesc(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 text-xs text-white p-2.5 rounded-xl focus:outline-none resize-none h-20"
                  />
                </div>

                <div className="flex justify-end gap-2.5 pt-3">
                  <button type="button" onClick={() => setIsCreatingProject(false)} className="px-4 py-2 rounded-xl border border-neutral-850 hover:bg-neutral-900 text-xs font-semibold text-neutral-400">
                    Cancel
                  </button>
                  <button type="submit" className="px-4 py-2 rounded-xl bg-[#5194ec] hover:bg-blue-600 text-white font-bold text-xs">
                    Spawn Project
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
