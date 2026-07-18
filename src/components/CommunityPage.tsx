import React, { useState, useEffect } from 'react';
import { 
  motion, AnimatePresence 
} from 'motion/react';
import { 
  Sparkles, ArrowLeft, BookOpen, Users, MessageSquare, FolderHeart, Award, Shield, 
  TrendingUp, Plus, Search, Heart, Share2, Bookmark, Copy, MoreHorizontal, UserPlus, 
  ChevronRight, Clock, Settings, Code, Pin, Trash2, AlertCircle, Key, Download, Check, 
  Globe, Twitter, Linkedin, Bell, Sliders, Eye, RefreshCw, Star, Ban, Flame, ThumbsUp, 
  ThumbsDown, CheckCircle, Database, HelpCircle, Briefcase, ChevronDown, Flag, User, Lock, ExternalLink
} from 'lucide-react';
import { 
  ResponsiveContainer, AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell 
} from 'recharts';

// --- TS INTERFACES ---
export interface CommunityUser {
  uid: string;
  name: string;
  username: string;
  avatar: string;
  bio: string;
  organization: string;
  socials: { twitter?: string; linkedin?: string; github?: string; website?: string };
  expertise: string[];
  followers: number;
  following: number;
  badges: string[];
  contributions: {
    discussions: number;
    upvotes: number;
    collectionsCreated: number;
    papersReviewed: number;
  };
  achievements: {
    id: string;
    title: string;
    description: string;
    progress: number; // 0 to 100
    unlocked: boolean;
    badgeName: string;
  }[];
}

export interface ThreadedComment {
  id: string;
  entityId: string; // url, slug, etc.
  entityType: 'article' | 'company' | 'model' | 'research' | 'benchmark' | 'collection';
  entityName: string;
  authorName: string;
  authorAvatar: string;
  authorUsername: string;
  content: string;
  upvotes: number;
  downvotes: number;
  userVote?: 'up' | 'down';
  pinned: boolean;
  isModerated: boolean;
  isFlagged: boolean;
  timestamp: string;
  replies: {
    id: string;
    authorName: string;
    authorAvatar: string;
    authorUsername: string;
    content: string;
    timestamp: string;
    upvotes: number;
  }[];
}

export interface CommunityCollection {
  id: string;
  name: string;
  description: string;
  authorName: string;
  authorAvatar: string;
  authorUsername: string;
  followersCount: number;
  likesCount: number;
  isFollowing: boolean;
  isLiked: boolean;
  tags: string[];
  items: {
    id: string;
    title: string;
    type: 'article' | 'model' | 'research' | 'company' | 'benchmark';
    slug?: string;
  }[];
}

interface CommunityPageProps {
  onBack: () => void;
  currentUser?: any;
  currentPath?: string; // to track sub-routing
  onNavigate?: (route: string) => void;
  onOpenModel?: (slug: string) => void;
  onOpenCompany?: (slug: string) => void;
  onOpenResearch?: (slug: string) => void;
  theme?: 'light' | 'dark';
}

// --- INITIAL MOCK DATA ---
const INITIAL_COMMUNITY_USER: CommunityUser = {
  uid: 'user-default-1',
  name: 'Devon Reed',
  username: 'devonreed',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  bio: 'Lead AI Engineer at Neuromorphic Labs. Obsessed with high-throughput MoE models, context-window scalability, and latency optimizations.',
  organization: 'Neuromorphic Labs',
  socials: {
    twitter: 'https://twitter.com/devon_codes',
    linkedin: 'https://linkedin.com/in/devonreed',
    website: 'https://neuromorphic.ai'
  },
  expertise: ['Transformer Architecture', 'FP8 Quantization', 'GPU Clustering', 'Vision Transformers'],
  followers: 432,
  following: 189,
  badges: ['Research Explorer', 'AI Analyst', 'Top Contributor', 'Early Adopter'],
  contributions: {
    discussions: 24,
    upvotes: 112,
    collectionsCreated: 3,
    papersReviewed: 8
  },
  achievements: [
    { id: 'ach-1', title: 'Research Explorer', description: 'Read and analyzed 5+ cutting-edge AI research papers', progress: 100, unlocked: true, badgeName: 'Research Explorer' },
    { id: 'ach-2', title: 'AI Analyst', description: 'Run model comparisons using the comparative benchmark suite', progress: 100, unlocked: true, badgeName: 'AI Analyst' },
    { id: 'ach-3', title: 'Benchmark Master', description: 'Submit 3+ custom evaluations to the public leaderboards', progress: 66, unlocked: false, badgeName: 'Benchmark Master' },
    { id: 'ach-4', title: 'Top Contributor', description: 'Receive 50+ community upvotes on model discussion threads', progress: 100, unlocked: true, badgeName: 'Top Contributor' },
    { id: 'ach-5', title: 'Early Adopter', description: 'Profile verified during the official AI X closed beta platform release', progress: 100, unlocked: true, badgeName: 'Early Adopter' },
    { id: 'ach-6', title: 'Knowledge Builder', description: 'Create and release 3+ public curated model collections', progress: 33, unlocked: false, badgeName: 'Knowledge Builder' },
    { id: 'ach-7', title: 'Community Mentor', description: 'Resolve 5+ discussion questions in model or hardware categories', progress: 20, unlocked: false, badgeName: 'Community Mentor' }
  ]
};

const INITIAL_COLLECTIONS: CommunityCollection[] = [
  {
    id: 'cc-1',
    name: 'Best Coding Models',
    description: 'A curated list of LLMs offering the lowest code block generation latency and highest structural correctness.',
    authorName: 'Alex Thorne',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    authorUsername: 'alex_codes',
    followersCount: 154,
    likesCount: 89,
    isFollowing: true,
    isLiked: false,
    tags: ['Coding', 'Efficiency', 'Developer Tooling'],
    items: [
      { id: 'it-1', title: 'Claude 3.5 Sonnet', type: 'model', slug: 'claude-3-5-sonnet' },
      { id: 'it-2', title: 'GPT-4o Professional', type: 'model', slug: 'gpt-4o' },
      { id: 'it-3', title: 'Gemini 3.5 Flash', type: 'model', slug: 'gemini-3-5-flash' }
    ]
  },
  {
    id: 'cc-2',
    name: 'OpenAI Research Papers',
    description: 'Seminal publications documenting OpenAI architectures, RLHF methodology, and safety evaluations.',
    authorName: 'Sarah Jenkins',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    authorUsername: 'sjenkins_ai',
    followersCount: 312,
    likesCount: 204,
    isFollowing: false,
    isLiked: true,
    tags: ['Research', 'OpenAI', 'RLHF'],
    items: [
      { id: 'it-4', title: 'Deep Double Descent', type: 'research', slug: 'deep-double-descent' },
      { id: 'it-5', title: 'Scaling Laws for Neural Language Models', type: 'research', slug: 'scaling-laws' }
    ]
  },
  {
    id: 'cc-3',
    name: 'Vision AI & Image Processing',
    description: 'Leading edge convolutional and transformer networks specialized in multi-object parsing and generative image tags.',
    authorName: 'Kenji Sato',
    authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    authorUsername: 'kenji_cv',
    followersCount: 88,
    likesCount: 41,
    isFollowing: false,
    isLiked: false,
    tags: ['Computer Vision', 'Generative', 'Images'],
    items: [
      { id: 'it-6', title: 'Segment Anything Model (SAM 2)', type: 'model', slug: 'sam-2' },
      { id: 'it-7', title: 'Stable Diffusion 3.5 Medium', type: 'model', slug: 'stable-diffusion-3-5' }
    ]
  },
  {
    id: 'cc-4',
    name: 'Machine Learning Safety & Regulation',
    description: 'Standard guidelines, policy drafts, and evaluation protocols for corporate AI deployments.',
    authorName: 'Elena Rostova',
    authorAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80',
    authorUsername: 'elena_policy',
    followersCount: 220,
    likesCount: 145,
    isFollowing: true,
    isLiked: true,
    tags: ['Safety', 'Regulation', 'Ethics'],
    items: [
      { id: 'it-8', title: 'The EU AI Act Compliance Overview', type: 'article' }
    ]
  }
];

const INITIAL_DISCUSSIONS: ThreadedComment[] = [
  {
    id: 'com-1',
    entityId: 'claude-3-5-sonnet',
    entityType: 'model',
    entityName: 'Claude 3.5 Sonnet',
    authorName: 'Sarah Jenkins',
    authorUsername: 'sjenkins_ai',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    content: `The multi-step logical correctness on Claude 3.5 Sonnet is outstanding. However, I notice a significant increase in latency when handling context sizes above 120k tokens. Is anyone else experiencing these thermal throttling delays, or is this a regional endpoint optimization issue? 

\`\`\`bash
# Benchmarking latency under full load
curl -X POST https://api.anthropic.com/v1/messages \\
  -H "content-type: application/json" \\
  -d '{"model": "claude-3-5-sonnet", "messages": [{"role": "user", "content": "..."}]}'
# Avg TTFB: ~1.2s (under 20k tokens) vs ~4.8s (above 120k tokens)
\`\`\``,
    upvotes: 42,
    downvotes: 2,
    userVote: 'up',
    pinned: true,
    isModerated: false,
    isFlagged: false,
    timestamp: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
    replies: [
      {
        id: 'rep-1',
        authorName: 'Alex Thorne',
        authorUsername: 'alex_codes',
        authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        content: `I am seeing a similar curve. At Neuromorphic, we solved this by pre-segmenting prompts into 30k context groups and doing an assembly routing map. Helps reduce context cost as well!`,
        timestamp: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
        upvotes: 18
      },
      {
        id: 'rep-2',
        authorName: 'Devon Reed',
        authorUsername: 'devonreed',
        authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        content: `Agreed on pre-segmenting. Also verify you're not using legacy system prompts - the new routing handles structured schema caching beautifully if prompt structure matches exactly.`,
        timestamp: new Date(Date.now() - 1 * 3600 * 1000).toISOString(),
        upvotes: 12
      }
    ]
  },
  {
    id: 'com-2',
    entityId: 'deepmind-alphaproof-2',
    entityType: 'research',
    entityName: 'AlphaProof 2 Mathematics Breakthrough',
    authorName: 'Prof. Marcus Vance',
    authorUsername: 'marcus_v',
    authorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    content: `The mathematical reasoning pipeline is incredibly robust. Combining reinforcement learning with formal verification in Lean solves the hallucinations issue completely. I expect this hybrid architecture to merge into LLMs within the next 18 months, leading to completely verifiable math/code generation.`,
    upvotes: 68,
    downvotes: 1,
    pinned: false,
    isModerated: false,
    isFlagged: false,
    timestamp: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
    replies: [
      {
        id: 'rep-3',
        authorName: 'Elena Rostova',
        authorUsername: 'elena_policy',
        authorAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80',
        content: `Agreed! Verification is key. But the compute requirements for generating and verifying billions of Lean statements during search are astronomically high. We need serious hardware efficiency leaps first.`,
        timestamp: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
        upvotes: 21
      }
    ]
  }
];

// --- TEAM WORKSPACE MOCK DATA ---
interface TeamWorkspace {
  id: string;
  name: string;
  members: {
    email: string;
    role: 'Owner' | 'Admin' | 'Editor' | 'Viewer';
    status: 'Active' | 'Pending';
    joinedAt: string;
  }[];
  sharedCollections: string[]; // collection IDs
  sharedNotesCount: number;
  sharedBookmarksCount: number;
  sharedProjectsCount: number;
}

const INITIAL_TEAM_WORKSPACES: TeamWorkspace[] = [
  {
    id: 'team-1',
    name: 'Neuromorphic Labs',
    members: [
      { email: 'EDA.NANCHARAREDDY@gmail.com', role: 'Owner', status: 'Active', joinedAt: '2026-06-01' },
      { email: 'sarah.j@neuromorphic.ai', role: 'Admin', status: 'Active', joinedAt: '2026-06-15' },
      { email: 'alex.t@neuromorphic.ai', role: 'Editor', status: 'Active', joinedAt: '2026-07-02' },
      { email: 'guest.researcher@neuromorphic.ai', role: 'Viewer', status: 'Pending', joinedAt: '2026-07-16' }
    ],
    sharedCollections: ['cc-1', 'cc-3'],
    sharedNotesCount: 14,
    sharedBookmarksCount: 29,
    sharedProjectsCount: 5
  }
];

// --- AUDIT LOGS & ADMIN DATA ---
interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  severity: 'low' | 'medium' | 'high';
  ipAddress: string;
}

const INITIAL_AUDIT_LOGS: AuditLog[] = [
  { id: 'al-1', timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), user: 'admin@aix.io', action: 'Update Global API Gateway Rate Limit to 5000req/min', severity: 'medium', ipAddress: '34.120.45.22' },
  { id: 'al-2', timestamp: new Date(Date.now() - 1000 * 60 * 34).toISOString(), user: 'sjenkins_ai', action: 'Flagged Comment Dismissed (Moderation Bypass Check)', severity: 'low', ipAddress: '192.168.1.104' },
  { id: 'al-3', timestamp: new Date(Date.now() - 1000 * 60 * 75).toISOString(), user: 'system_daemon', action: 'Automated PWA Background Caching Swarm Sync Initiated', severity: 'low', ipAddress: '127.0.0.1' },
  { id: 'al-4', timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(), user: 'admin@aix.io', action: 'Rotated JWT Encryption Master Key Profile', severity: 'high', ipAddress: '34.120.45.22' }
];

// --- WEEKLY ACTIVE USERS CHART DATA ---
const DAILY_PLATFORM_METRICS = [
  { name: 'Mon', activeUsers: 4890, apiRequests: 145000, modelInferences: 82000, copilotConversations: 12000 },
  { name: 'Tue', activeUsers: 5120, apiRequests: 162000, modelInferences: 89000, copilotConversations: 14200 },
  { name: 'Wed', activeUsers: 6400, apiRequests: 198000, modelInferences: 110000, copilotConversations: 19800 },
  { name: 'Thu', activeUsers: 5900, apiRequests: 185000, modelInferences: 99000, copilotConversations: 16500 },
  { name: 'Fri', activeUsers: 7100, apiRequests: 230000, modelInferences: 140000, copilotConversations: 24500 },
  { name: 'Sat', activeUsers: 4300, apiRequests: 125000, modelInferences: 68000, copilotConversations: 11000 },
  { name: 'Sun', activeUsers: 4900, apiRequests: 141000, modelInferences: 74000, copilotConversations: 13500 },
];

export default function CommunityPage({ 
  onBack, currentUser, currentPath, onNavigate, onOpenModel, onOpenCompany, onOpenResearch 
}: CommunityPageProps) {
  
  // Tab Routing
  const getTabFromPath = (path?: string | null): 'community' | 'profile' | 'discussions' | 'collections' | 'leaderboards' | 'teams' | 'admin' => {
    if (!path) return 'community';
    if (path.startsWith('/profile')) return 'profile';
    if (path.startsWith('/discussions')) return 'discussions';
    if (path.startsWith('/collections')) return 'collections';
    if (path.startsWith('/leaderboards')) return 'leaderboards';
    if (path.startsWith('/teams')) return 'teams';
    if (path.startsWith('/admin')) return 'admin';
    return 'community';
  };
  
  const activeTab = getTabFromPath(currentPath);

  // --- LOCAL STATES ---
  const [profile, setProfile] = useState<CommunityUser>(() => {
    const saved = localStorage.getItem('aix-community-profile');
    return saved ? JSON.parse(saved) : INITIAL_COMMUNITY_USER;
  });

  const [discussions, setDiscussions] = useState<ThreadedComment[]>(() => {
    const saved = localStorage.getItem('aix-community-discussions');
    return saved ? JSON.parse(saved) : INITIAL_DISCUSSIONS;
  });

  const [collections, setCollections] = useState<CommunityCollection[]>(() => {
    const saved = localStorage.getItem('aix-community-collections');
    return saved ? JSON.parse(saved) : INITIAL_COLLECTIONS;
  });

  const [teams, setTeams] = useState<TeamWorkspace[]>(() => {
    const saved = localStorage.getItem('aix-community-teams');
    return saved ? JSON.parse(saved) : INITIAL_TEAM_WORKSPACES;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);

  // Notifications State
  const [notifications, setNotifications] = useState<any[]>(() => {
    const saved = localStorage.getItem('aix-notifications');
    return saved ? JSON.parse(saved) : [
      { id: 'notif-1', title: 'Sarah Jenkins mentioned you', body: 'Sarah Jenkins tagged you in a debate on Claude 3.5 Sonnet context scaling.', timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(), read: false, type: 'mention' },
      { id: 'notif-2', title: 'New Model Released: OpenAI GPT-5o', body: 'GPT-5o has been deployed and comparative evaluation profiles are now live.', timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(), read: false, type: 'model' },
      { id: 'notif-3', title: 'Collection duplicated', body: 'Your collection "Best Coding Models" was duplicated by 12 developers today.', timestamp: new Date(Date.now() - 1000 * 60 * 240).toISOString(), read: true, type: 'system' }
    ];
  });

  // UI States
  const [isNotifDrawerOpen, setIsNotifDrawerOpen] = useState(false);
  const [activeDiscussEntity, setActiveDiscussEntity] = useState<string>('claude-3-5-sonnet');
  const [newCommentText, setNewCommentText] = useState('');
  const [replyText, setReplyText] = useState<Record<string, string>>({});
  const [activeReplyInputId, setActiveReplyInputId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [newColTitle, setNewColTitle] = useState('');
  const [newColDesc, setNewColDesc] = useState('');
  const [newColTags, setNewColTags] = useState('AI Agents, Vision');
  const [isColModalOpen, setIsColModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Team Collaboration Form States
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'Owner' | 'Admin' | 'Editor' | 'Viewer'>('Editor');
  const [inviteError, setInviteError] = useState('');

  // Enterprise API keys states
  const [apiKeys, setApiKeys] = useState<{ key: string; scope: string; createdAt: string; id: string }[]>([
    { id: 'key-1', key: 'aix_live_0a23bc8ff889218abcc890', scope: 'Read/Write Inferences', createdAt: '2026-07-01' }
  ]);
  const [newKeyScope, setNewKeyScope] = useState('Read Inferences');

  // Announcement Manager States (Admin only)
  const [announcements, setAnnouncements] = useState([
    { id: 'ann-1', title: 'System Upgraded to LLM Router Version 4.8', content: 'Latency profiles are down by an average of 42ms globally.', date: '2026-07-16' },
    { id: 'ann-2', title: 'Community Beta Program Launched', content: 'You can now share custom bookmarks and review papers publicly.', date: '2026-07-15' }
  ]);
  const [newAnnTitle, setNewAnnTitle] = useState('');
  const [newAnnContent, setNewAnnContent] = useState('');

  // Feature flags
  const [featureFlags, setFeatureFlags] = useState({
    enableDynamicVesting: true,
    enableWebRTCVoiceStream: false,
    enableGeminiPreloading: true,
    strictDataIsolation: true
  });

  // Offline Simulator Mode state
  const [isSimulatingOffline, setIsSimulatingOffline] = useState(false);

  // SEO schemas toggle preview
  const [showSeoMeta, setShowSeoMeta] = useState(false);

  // Save changes helper
  const saveState = (key: string, data: any) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // --- COMPONENT HANDLERS ---
  const handleLikeCollection = (id: string) => {
    const updated = collections.map(col => {
      if (col.id === id) {
        return {
          ...col,
          isLiked: !col.isLiked,
          likesCount: col.isLiked ? col.likesCount - 1 : col.likesCount + 1
        };
      }
      return col;
    });
    setCollections(updated);
    saveState('aix-community-collections', updated);
    triggerToast("Preferences updated.");
  };

  const handleFollowCollection = (id: string) => {
    const updated = collections.map(col => {
      if (col.id === id) {
        return {
          ...col,
          isFollowing: !col.isFollowing,
          followersCount: col.isFollowing ? col.followersCount - 1 : col.followersCount + 1
        };
      }
      return col;
    });
    setCollections(updated);
    saveState('aix-community-collections', updated);
    triggerToast(updated.find(c => c.id === id)?.isFollowing ? "Added to followed list" : "Removed from followed list");
  };

  const handleDuplicateCollection = (col: CommunityCollection) => {
    // Sync with workspace-v1 notes or collections
    const workspaceLocal = localStorage.getItem('aix-workspace-v1');
    let ws = { collections: [], notes: [], updatedAt: Date.now() };
    if (workspaceLocal) {
      try { ws = JSON.parse(workspaceLocal); } catch (e) {}
    }
    const newWorkspaceCol = {
      id: `col-${Date.now()}`,
      name: col.name,
      description: col.description,
      pinned: false,
      favorite: true,
      createdAt: new Date().toISOString(),
      color: '#a855f7'
    };
    ws.collections = [newWorkspaceCol as any, ...(ws.collections || [])];
    localStorage.setItem('aix-workspace-v1', JSON.stringify(ws));
    triggerToast(`Cloned "${col.name}" to your Personal Workspace Collections!`);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    const newComment: ThreadedComment = {
      id: `com-${Date.now()}`,
      entityId: activeDiscussEntity,
      entityType: 'model', // default for general discussions page
      entityName: discussions.find(d => d.entityId === activeDiscussEntity)?.entityName || activeDiscussEntity,
      authorName: profile.name,
      authorUsername: profile.username,
      authorAvatar: profile.avatar,
      content: newCommentText,
      upvotes: 1,
      downvotes: 0,
      userVote: 'up',
      pinned: false,
      isModerated: false,
      isFlagged: false,
      timestamp: new Date().toISOString(),
      replies: []
    };

    const updated = [newComment, ...discussions];
    setDiscussions(updated);
    saveState('aix-community-discussions', updated);
    setNewCommentText('');
    triggerToast("Your thread contribution has been published!");

    // Achievements progress updater
    const updatedAchievements = profile.achievements.map(ach => {
      if (ach.id === 'ach-4') {
        return { ...ach, progress: Math.min(100, ach.progress + 15), unlocked: ach.progress + 15 >= 100 };
      }
      return ach;
    });
    const updatedProfile = {
      ...profile,
      contributions: {
        ...profile.contributions,
        discussions: profile.contributions.discussions + 1
      },
      achievements: updatedAchievements
    };
    setProfile(updatedProfile);
    saveState('aix-community-profile', updatedProfile);
  };

  const handleAddReply = (commentId: string) => {
    const text = replyText[commentId];
    if (!text || !text.trim()) return;

    const updated = discussions.map(com => {
      if (com.id === commentId) {
        return {
          ...com,
          replies: [
            ...com.replies,
            {
              id: `rep-${Date.now()}`,
              authorName: profile.name,
              authorUsername: profile.username,
              authorAvatar: profile.avatar,
              content: text,
              timestamp: new Date().toISOString(),
              upvotes: 0
            }
          ]
        };
      }
      return com;
    });

    setDiscussions(updated);
    saveState('aix-community-discussions', updated);
    setReplyText({ ...replyText, [commentId]: '' });
    setActiveReplyInputId(null);
    triggerToast("Reply posted successfully.");
  };

  const handleVoteComment = (commentId: string, direction: 'up' | 'down') => {
    const updated = discussions.map(com => {
      if (com.id === commentId) {
        let upAdd = 0;
        let downAdd = 0;
        if (com.userVote === direction) {
          // undo vote
          if (direction === 'up') upAdd = -1;
          else downAdd = -1;
          return { ...com, upvotes: com.upvotes + upAdd, downvotes: com.downvotes + downAdd, userVote: undefined };
        } else {
          // override vote
          if (com.userVote === 'up') upAdd = -1;
          if (com.userVote === 'down') downAdd = -1;
          if (direction === 'up') upAdd += 1;
          else downAdd += 1;
          return { ...com, upvotes: com.upvotes + upAdd, downvotes: com.downvotes + downAdd, userVote: direction };
        }
      }
      return com;
    });
    setDiscussions(updated);
    saveState('aix-community-discussions', updated);
  };

  const handleInviteTeamMember = (e: React.FormEvent) => {
    e.preventDefault();
    setInviteError('');
    if (!inviteEmail.trim()) return;
    
    // basic validation
    if (!inviteEmail.includes('@') || inviteEmail.length < 5) {
      setInviteError('Please provide a valid enterprise email address');
      return;
    }

    const updated = teams.map(t => {
      if (t.id === 'team-1') {
        return {
          ...t,
          members: [
            ...t.members,
            { email: inviteEmail, role: inviteRole, status: 'Pending' as 'Active' | 'Pending', joinedAt: new Date().toISOString().split('T')[0] }
          ]
        };
      }
      return t;
    });

    setTeams(updated);
    saveState('aix-community-teams', updated);
    setInviteEmail('');
    triggerToast(`Invitation sent to ${inviteEmail}!`);
  };

  const handleGenerateApiKey = () => {
    const secureRandHex = () => Math.floor((1 + Math.random()) * 0x100000000).toString(16).substring(1);
    const newKey = `aix_live_${secureRandHex()}${secureRandHex()}`;
    const updated = [...apiKeys, { id: `key-${Date.now()}`, key: newKey, scope: newKeyScope, createdAt: new Date().toISOString().split('T')[0] }];
    setApiKeys(updated);
    triggerToast("Enterprise API credential successfully minted!");
  };

  const handleAddAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnnTitle || !newAnnContent) return;
    const updated = [{ id: `ann-${Date.now()}`, title: newAnnTitle, content: newAnnContent, date: new Date().toISOString().split('T')[0] }, ...announcements];
    setAnnouncements(updated);
    setNewAnnTitle('');
    setNewAnnContent('');
    triggerToast("Announcement posted globally.");
  };

  const handleCreateCollection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newColTitle.trim()) return;

    const newCol: CommunityCollection = {
      id: `cc-${Date.now()}`,
      name: newColTitle,
      description: newColDesc || 'No description provided.',
      authorName: profile.name,
      authorAvatar: profile.avatar,
      authorUsername: profile.username,
      followersCount: 1,
      likesCount: 1,
      isFollowing: true,
      isLiked: true,
      tags: newColTags.split(',').map(t => t.trim()),
      items: [
        { id: `it-${Date.now()}`, title: 'Claude 3.5 Sonnet', type: 'model', slug: 'claude-3-5-sonnet' }
      ]
    };

    const updated = [newCol, ...collections];
    setCollections(updated);
    saveState('aix-community-collections', updated);
    setIsColModalOpen(false);
    setNewColTitle('');
    setNewColDesc('');
    triggerToast(`curated collection "${newColTitle}" published!`);
  };

  return (
    <div className="fixed inset-0 z-50 bg-neutral-950 text-white overflow-y-auto flex flex-col font-sans select-none scrollbar-none">
      
      {/* Toast Alert overlay */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-amber-500 text-neutral-950 font-mono text-xs px-4 py-2.5 rounded-full shadow-2xl font-bold flex items-center gap-2"
          >
            <Sparkles className="w-3.5 h-3.5 animate-spin" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Structured SEO Schema generator (renders dynamically when preview is opened) */}
      {showSeoMeta && (
        <div className="bg-neutral-900 border border-neutral-800 p-4 font-mono text-xs text-neutral-400 max-w-4xl mx-auto my-4 rounded-xl leading-relaxed">
          <div className="flex justify-between items-center pb-2 border-b border-neutral-800 mb-2">
            <span className="text-amber-500 font-bold">SEO ARTICLE SCHEMA PREVIEW (JSON-LD WCAG 2.2 compliant)</span>
            <button onClick={() => setShowSeoMeta(false)} className="hover:text-white">✕ Close</button>
          </div>
          <pre className="overflow-x-auto">
{JSON.stringify({
  "@context": "https://schema.org",
  "@type": "CommunityPlatform",
  "name": "AI X Collective Space",
  "description": "Premium collaborative workspace, benchmarking suite, and real-time knowledge base.",
  "publisher": {
    "@type": "Organization",
    "name": "AI X Corporation",
    "logo": "https://aix.io/logo.png"
  }
}, null, 2)}
          </pre>
        </div>
      )}

      {/* HEADER BAR */}
      <header className="sticky top-0 z-40 bg-neutral-950/85 backdrop-blur-md border-b border-neutral-900 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2.5 hover:bg-neutral-900 rounded-full border border-neutral-900 transition-colors"
            aria-label="Back to central timeline"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-neutral-500 font-mono tracking-widest font-semibold uppercase">AI Intelligence Network</span>
              <span className="bg-amber-500/10 text-amber-500 text-[10px] font-mono px-2 py-0.5 rounded-full font-bold">BETA 1.12</span>
              {isSimulatingOffline && (
                <span className="bg-rose-500/15 text-rose-500 text-[10px] font-mono px-2 py-0.5 rounded-full font-bold">SIMULATED OFFLINE MODE</span>
              )}
            </div>
            <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-neutral-300 to-neutral-500 bg-clip-text text-transparent">
              Community Platform & Launch Hub
            </h1>
          </div>
        </div>

        {/* NAVIGATION PIPES */}
        <nav className="hidden lg:flex items-center gap-1 bg-neutral-900/50 p-1 rounded-full border border-neutral-900" role="tablist">
          <button 
            onClick={() => onNavigate?.('/community')}
            className={`px-4 py-1.5 rounded-full text-xs font-medium font-mono transition-all ${activeTab === 'community' ? 'bg-amber-500 text-neutral-950 font-bold shadow-md' : 'text-neutral-400 hover:text-white'}`}
          >
            Community
          </button>
          <button 
            onClick={() => onNavigate?.('/discussions')}
            className={`px-4 py-1.5 rounded-full text-xs font-medium font-mono transition-all ${activeTab === 'discussions' ? 'bg-amber-500 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-white'}`}
          >
            Discussions
          </button>
          <button 
            onClick={() => onNavigate?.('/collections')}
            className={`px-4 py-1.5 rounded-full text-xs font-medium font-mono transition-all ${activeTab === 'collections' ? 'bg-amber-500 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-white'}`}
          >
            Collections
          </button>
          <button 
            onClick={() => onNavigate?.('/leaderboards')}
            className={`px-4 py-1.5 rounded-full text-xs font-medium font-mono transition-all ${activeTab === 'leaderboards' ? 'bg-amber-500 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-white'}`}
          >
            Leaderboards
          </button>
          <button 
            onClick={() => onNavigate?.('/teams')}
            className={`px-4 py-1.5 rounded-full text-xs font-medium font-mono transition-all ${activeTab === 'teams' ? 'bg-amber-500 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-white'}`}
          >
            Workspaces
          </button>
          <button 
            onClick={() => onNavigate?.('/profile')}
            className={`px-4 py-1.5 rounded-full text-xs font-medium font-mono transition-all ${activeTab === 'profile' ? 'bg-amber-500 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-white'}`}
          >
            Profile
          </button>
          <button 
            onClick={() => onNavigate?.('/admin')}
            className={`px-4 py-1.5 rounded-full text-xs font-medium font-mono transition-all ${activeTab === 'admin' ? 'bg-amber-500 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-white'}`}
          >
            Admin Panel
          </button>
        </nav>

        {/* TOP CONTROLS */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsSimulatingOffline(!isSimulatingOffline)}
            className={`p-2.5 rounded-full border transition-all ${isSimulatingOffline ? 'bg-rose-500/10 border-rose-500/30 text-rose-500' : 'hover:bg-neutral-900 border-neutral-900 text-neutral-400'}`}
            title="Simulate network offline state to audit offline PWA capabilities"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setShowSeoMeta(!showSeoMeta)}
            className="p-2.5 hover:bg-neutral-900 rounded-full border border-neutral-900 text-neutral-400 transition-colors"
            title="Toggle SEO JSON-LD Verification Engine"
          >
            <Globe className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setIsNotifDrawerOpen(true)}
            className="relative p-2.5 hover:bg-neutral-900 rounded-full border border-neutral-900 transition-colors"
            aria-label="Notification Center"
          >
            <Bell className="w-4 h-4" />
            {notifications.some(n => !n.read) && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-amber-500 rounded-full" />
            )}
          </button>
        </div>
      </header>

      {/* OFFLINE COMPONENT OVERLAY */}
      {isSimulatingOffline ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-neutral-950 max-w-lg mx-auto">
          <div className="w-16 h-16 bg-neutral-900/50 rounded-full flex items-center justify-center border border-neutral-800 mb-6">
            <Sliders className="w-8 h-8 text-neutral-500 animate-pulse" />
          </div>
          <h3 className="text-xl font-bold font-mono tracking-tight text-white">Local Sandbox Environment Offline</h3>
          <p className="text-sm text-neutral-400 mt-2 mb-6 leading-relaxed">
            AI X uses Service Workers and dynamic client caching strategies to keep model indices and public collections readable during outages.
          </p>
          <button 
            onClick={() => setIsSimulatingOffline(false)} 
            className="px-6 py-2.5 bg-amber-500 text-neutral-950 font-bold font-mono text-xs rounded-full hover:bg-amber-400 transition-colors"
          >
            Restore Connection
          </button>
        </div>
      ) : (
        <main className="flex-1 p-6 max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 pb-16">
          
          {/* RENDER ACTIVE SCREEN based on Path State */}
          <div className="lg:col-span-12">
            
            {/* 1. COMMUNITY HUB CENTRAL FEED */}
            {activeTab === 'community' && (
              <div className="space-y-8">
                
                {/* HERO PROMOTION BAR */}
                <div className="relative rounded-3xl border border-neutral-900 bg-gradient-to-br from-neutral-900 to-neutral-950 p-8 overflow-hidden">
                  <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 blur-[120px] rounded-full" />
                  <div className="relative max-w-2xl">
                    <span className="bg-amber-500/10 text-amber-500 font-mono text-[10px] px-2.5 py-1 rounded-full font-bold">Featured Platform Update</span>
                    <h2 className="text-2xl lg:text-3xl font-extrabold mt-4 mb-2 tracking-tight">AI X Collective launch: build & publish intelligence bundles</h2>
                    <p className="text-sm text-neutral-400 leading-relaxed">
                      Sync folders, share bookmark arrays with your team, and build public collections of specialized machine learning papers. Engage in verified discussions regarding hardware thermal efficiency and reasoning model benchmarks.
                    </p>
                    <div className="flex flex-wrap gap-3 mt-6">
                      <button onClick={() => onNavigate?.('/collections')} className="px-5 py-2 bg-amber-500 text-neutral-950 font-bold font-mono text-xs rounded-full hover:bg-amber-400 transition-all flex items-center gap-1.5">
                        <FolderHeart className="w-3.5 h-3.5" /> Curate Collections
                      </button>
                      <button onClick={() => onNavigate?.('/discussions')} className="px-5 py-2 bg-neutral-900 border border-neutral-800 text-white font-bold font-mono text-xs rounded-full hover:bg-neutral-800 transition-all flex items-center gap-1.5">
                        <MessageSquare className="w-3.5 h-3.5" /> Join discussions
                      </button>
                    </div>
                  </div>
                </div>

                {/* TWO-COLUMN GRID */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  
                  {/* LEFT: HOT DISCUSSION TOPICS */}
                  <div className="lg:col-span-7 space-y-6">
                    <div className="flex justify-between items-center pb-2 border-b border-neutral-900">
                      <h3 className="font-bold font-mono text-sm tracking-tight flex items-center gap-2">
                        <Flame className="w-4 h-4 text-amber-500 animate-pulse" /> TRENDING DISCUSSIONS
                      </h3>
                      <button onClick={() => onNavigate?.('/discussions')} className="text-xs text-amber-500 hover:underline flex items-center gap-1 font-mono">
                        View All <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="space-y-4">
                      {discussions.map(com => (
                        <div key={com.id} className="p-6 rounded-3xl border border-neutral-900 bg-neutral-950/20 hover:border-neutral-800 transition-all space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <img src={com.authorAvatar} alt={com.authorName} className="w-9 h-9 rounded-full object-cover border border-neutral-800" />
                              <div>
                                <h4 className="text-xs font-bold text-white leading-none">{com.authorName}</h4>
                                <span className="text-[10px] text-neutral-500 font-mono">@{com.authorUsername}</span>
                              </div>
                            </div>
                            <span className="bg-neutral-900 text-neutral-400 text-[10px] font-mono px-2.5 py-1 rounded-full">
                              {com.entityName}
                            </span>
                          </div>

                          <p className="text-xs text-neutral-300 leading-relaxed line-clamp-3">
                            {com.content}
                          </p>

                          <div className="flex items-center justify-between pt-2 border-t border-neutral-900">
                            <div className="flex items-center gap-4 text-neutral-400">
                              <button onClick={() => handleVoteComment(com.id, 'up')} className={`flex items-center gap-1.5 text-xs font-mono hover:text-white transition-colors ${com.userVote === 'up' ? 'text-amber-500 font-bold' : ''}`}>
                                <ThumbsUp className="w-3.5 h-3.5" /> {com.upvotes}
                              </button>
                              <button onClick={() => handleVoteComment(com.id, 'down')} className="flex items-center gap-1.5 text-xs font-mono hover:text-white transition-colors">
                                <ThumbsDown className="w-3.5 h-3.5" /> {com.downvotes}
                              </button>
                              <span className="text-xs font-mono flex items-center gap-1">
                                <MessageSquare className="w-3.5 h-3.5" /> {com.replies.length}
                              </span>
                            </div>
                            <span className="text-[10px] text-neutral-500 font-mono">
                              {new Date(com.timestamp).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* RIGHT: TOP CURATORS & BENCHMARK HIGHLIGHTS */}
                  <div className="lg:col-span-5 space-y-8">
                    <div className="p-6 rounded-3xl border border-neutral-900 bg-neutral-950/40">
                      <h3 className="font-bold font-mono text-sm mb-4 tracking-tight text-white flex items-center gap-2">
                        <Award className="w-4 h-4 text-amber-500" /> TOP CONTRIBUTING RESEARCHERS
                      </h3>
                      <div className="space-y-4">
                        {[
                          { name: 'Dr. Evelyn Carter', org: 'Stanford NLP', points: '1,420 XP', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80', badge: 'Research Explorer' },
                          { name: 'Yuki Takahashi', org: 'Kyoto ML Group', points: '1,150 XP', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&auto=format&fit=crop&q=80', badge: 'AI Analyst' },
                          { name: 'Devon Reed', org: 'Neuromorphic Labs', points: '980 XP', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80', badge: 'Top Contributor' }
                        ].map((user, i) => (
                          <div key={user.name} className="flex items-center justify-between p-2.5 rounded-2xl hover:bg-neutral-900/30 transition-all">
                            <div className="flex items-center gap-3">
                              <span className="text-xs font-mono text-neutral-500 font-bold w-4">#{i+1}</span>
                              <img src={user.avatar} alt={user.name} className="w-8.5 h-8.5 rounded-full object-cover border border-neutral-800" />
                              <div>
                                <h4 className="text-xs font-bold text-white">{user.name}</h4>
                                <span className="text-[10px] text-neutral-500">{user.org}</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="text-xs font-mono text-amber-500 font-bold">{user.points}</span>
                              <div className="text-[9px] text-neutral-500 font-mono uppercase">{user.badge}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* ACTIVE COMMITS / ANNOUNCEMENTS */}
                    <div className="p-6 rounded-3xl border border-neutral-900 bg-neutral-950/20">
                      <h3 className="font-bold font-mono text-sm mb-4 text-white flex items-center gap-2">
                        <Sliders className="w-4 h-4 text-amber-500" /> PLATFORM RELEASE LOGS
                      </h3>
                      <div className="space-y-4 text-xs">
                        {announcements.map(ann => (
                          <div key={ann.id} className="pb-3 border-b border-neutral-900 last:border-none">
                            <div className="flex justify-between items-center mb-1">
                              <span className="font-bold text-neutral-200">{ann.title}</span>
                              <span className="text-[10px] text-neutral-500 font-mono">{ann.date}</span>
                            </div>
                            <p className="text-neutral-400 text-xs leading-relaxed">{ann.content}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* 2. THREADED DISCUSSIONS TAB */}
            {activeTab === 'discussions' && (
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-neutral-900">
                  <div>
                    <h3 className="font-extrabold text-xl tracking-tight">Threaded Discussions Hub</h3>
                    <p className="text-sm text-neutral-400">Engage with community members regarding benchmarks, performance anomalies, or policy updates.</p>
                  </div>
                  
                  {/* CONTEXT CHANGER PIPES */}
                  <div className="flex items-center gap-2 overflow-x-auto pb-1">
                    {[
                      { id: 'claude-3-5-sonnet', label: 'Claude 3.5 Sonnet' },
                      { id: 'deepmind-alphaproof-2', label: 'AlphaProof 2' },
                      { id: 'gpu-performance', label: 'GPU Throttling' }
                    ].map(btn => (
                      <button
                        key={btn.id}
                        onClick={() => setActiveDiscussEntity(btn.id)}
                        className={`px-3 py-1.5 rounded-full text-xs font-mono font-bold transition-all whitespace-nowrap ${activeDiscussEntity === btn.id ? 'bg-amber-500 text-neutral-950' : 'bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white'}`}
                      >
                        {btn.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* INPUT FORM */}
                <form onSubmit={handleAddComment} className="p-6 rounded-3xl border border-neutral-900 bg-neutral-950/40 space-y-4">
                  <div className="flex items-start gap-4">
                    <img src={profile.avatar} alt="Me" className="w-9 h-9 rounded-full object-cover border border-neutral-800" />
                    <div className="flex-1 space-y-2">
                      <textarea
                        value={newCommentText}
                        onChange={(e) => setNewCommentText(e.target.value)}
                        placeholder={`Start a thread regarding ${activeDiscussEntity.replace('-', ' ')}... markdown and code blocks supported`}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-2xl p-4 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500 placeholder-neutral-500 h-24 resize-none"
                      />
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-neutral-500 font-mono">Publishing to public discussion boards as @{profile.username}</span>
                    <button type="submit" className="px-5 py-2 bg-amber-500 text-neutral-950 font-bold font-mono text-xs rounded-full hover:bg-amber-400 transition-colors flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" /> Post Thread
                    </button>
                  </div>
                </form>

                {/* THREADS LIST */}
                <div className="space-y-6">
                  {discussions
                    .filter(d => d.entityId === activeDiscussEntity)
                    .map(com => (
                      <div key={com.id} className="p-6 rounded-3xl border border-neutral-900 bg-neutral-950/20 space-y-4">
                        
                        {/* Thread Head */}
                        <div className="flex items-start justify-between">
                          <div className="flex gap-3">
                            <img src={com.authorAvatar} alt={com.authorName} className="w-10 h-10 rounded-full object-cover border border-neutral-800" />
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="text-sm font-extrabold text-white">{com.authorName}</h4>
                                <span className="text-[10px] text-neutral-500 font-mono">@{com.authorUsername}</span>
                                {com.pinned && (
                                  <span className="bg-amber-500/10 text-amber-500 text-[9px] font-mono font-bold px-1.5 py-0.5 rounded flex items-center gap-1">
                                    <Pin className="w-2.5 h-2.5" /> PINNED BY AUTHOR
                                  </span>
                                )}
                              </div>
                              <span className="text-[10px] text-neutral-500 font-mono">{new Date(com.timestamp).toLocaleString()}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1 text-neutral-400">
                            <button onClick={() => handleVoteComment(com.id, 'up')} className={`p-2 hover:bg-neutral-900 rounded-full transition-colors ${com.userVote === 'up' ? 'text-amber-500' : ''}`}>
                              <ThumbsUp className="w-3.5 h-3.5" />
                            </button>
                            <span className="text-xs font-mono font-bold">{com.upvotes}</span>
                            <button onClick={() => handleVoteComment(com.id, 'down')} className={`p-2 hover:bg-neutral-900 rounded-full transition-colors ${com.userVote === 'down' ? 'text-amber-500' : ''}`}>
                              <ThumbsDown className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="pl-13 text-xs text-neutral-300 leading-relaxed whitespace-pre-wrap">
                          {com.content}
                        </div>

                        {/* Actions (Reply trigger) */}
                        <div className="pl-13 flex items-center gap-4 text-xs font-mono text-neutral-400">
                          <button 
                            onClick={() => setActiveReplyInputId(activeReplyInputId === com.id ? null : com.id)}
                            className="text-amber-500 hover:underline flex items-center gap-1"
                          >
                            <MessageSquare className="w-3.5 h-3.5" /> Reply ({com.replies.length})
                          </button>
                        </div>

                        {/* Nested Replies */}
                        {com.replies.length > 0 && (
                          <div className="pl-13 space-y-4 pt-4 border-t border-neutral-900">
                            {com.replies.map(rep => (
                              <div key={rep.id} className="flex gap-3 text-xs bg-neutral-900/30 p-3.5 rounded-2xl border border-neutral-900">
                                <img src={rep.authorAvatar} alt={rep.authorName} className="w-7 h-7 rounded-full object-cover border border-neutral-800" />
                                <div className="flex-1 space-y-1">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-1.5">
                                      <span className="font-bold text-white">{rep.authorName}</span>
                                      <span className="text-[10px] text-neutral-500 font-mono">@{rep.authorUsername}</span>
                                    </div>
                                    <span className="text-[10px] text-neutral-500 font-mono">{new Date(rep.timestamp).toLocaleTimeString()}</span>
                                  </div>
                                  <p className="text-neutral-300 leading-relaxed">{rep.content}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Reply Input block */}
                        {activeReplyInputId === com.id && (
                          <div className="pl-13 flex gap-3 items-center mt-2">
                            <input
                              type="text"
                              value={replyText[com.id] || ''}
                              onChange={(e) => setReplyText({ ...replyText, [com.id]: e.target.value })}
                              placeholder="Write a nested logical response..."
                              className="flex-1 bg-neutral-900 border border-neutral-800 rounded-full px-4 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500 text-white placeholder-neutral-500"
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleAddReply(com.id);
                              }}
                            />
                            <button 
                              onClick={() => handleAddReply(com.id)}
                              className="p-2 bg-amber-500 text-neutral-950 hover:bg-amber-400 rounded-full transition-colors"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}

                      </div>
                    ))}
                </div>

              </div>
            )}

            {/* 3. PUBLIC CURATED COLLECTIONS TAB */}
            {activeTab === 'collections' && (
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-neutral-900">
                  <div>
                    <h3 className="font-extrabold text-xl tracking-tight">Public Curated Collections</h3>
                    <p className="text-sm text-neutral-400">Collaboratively created bundles containing standard model references, benchmarks, and research.</p>
                  </div>
                  <button 
                    onClick={() => setIsColModalOpen(true)}
                    className="px-5 py-2.5 bg-amber-500 text-neutral-950 font-bold font-mono text-xs rounded-full hover:bg-amber-400 transition-colors flex items-center gap-1.5 md:self-center self-start"
                  >
                    <Plus className="w-4 h-4" /> Create Bundle
                  </button>
                </div>

                {/* SEARCH BAR */}
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                  <input
                    type="text"
                    placeholder="Search curated templates (e.g. Prompt Engineering, OpenAI Research...)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-2xl pl-12 pr-4 py-3 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                {/* COLLECTIONS GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {collections
                    .filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.description.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map(col => (
                      <div key={col.id} className="p-6 rounded-3xl border border-neutral-900 bg-neutral-950/20 hover:border-neutral-800 transition-all flex flex-col justify-between">
                        
                        <div className="space-y-4">
                          {/* Header info */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <img src={col.authorAvatar} alt={col.authorName} className="w-6 h-6 rounded-full object-cover border border-neutral-800" />
                              <span className="text-[10px] text-neutral-400 font-mono">curated by @{col.authorUsername}</span>
                            </div>
                            <div className="flex gap-1">
                              {col.tags.slice(0, 2).map(tag => (
                                <span key={tag} className="bg-neutral-900 text-neutral-400 text-[9px] font-mono px-2 py-0.5 rounded">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Body */}
                          <div>
                            <h4 className="text-base font-extrabold text-white tracking-tight">{col.name}</h4>
                            <p className="text-xs text-neutral-400 mt-1 leading-relaxed">{col.description}</p>
                          </div>

                          {/* Curated list preview */}
                          <div className="bg-neutral-900/40 rounded-2xl p-3 border border-neutral-900 space-y-2">
                            <span className="text-[9px] text-neutral-500 font-mono uppercase tracking-wider block">Bundle Content ({col.items.length} items)</span>
                            {col.items.map(item => (
                              <div key={item.id} className="flex items-center justify-between text-xs py-1 first:pt-0 last:pb-0 border-b border-neutral-900 last:border-none">
                                <span className="font-medium text-neutral-300">{item.title}</span>
                                <span className="text-[9px] font-mono text-neutral-500 uppercase px-1.5 py-0.5 bg-neutral-900 rounded">{item.type}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Bottom Actions */}
                        <div className="flex items-center justify-between mt-6 pt-4 border-t border-neutral-900 text-xs font-mono text-neutral-400">
                          <div className="flex items-center gap-3">
                            <button onClick={() => handleLikeCollection(col.id)} className={`flex items-center gap-1 hover:text-rose-500 transition-colors ${col.isLiked ? 'text-rose-500 font-bold' : ''}`}>
                              <Heart className="w-3.5 h-3.5" /> {col.likesCount}
                            </button>
                            <button onClick={() => handleFollowCollection(col.id)} className={`flex items-center gap-1 hover:text-amber-500 transition-colors ${col.isFollowing ? 'text-amber-500 font-bold' : ''}`}>
                              <Bookmark className="w-3.5 h-3.5" /> {col.followersCount}
                            </button>
                          </div>
                          
                          <div className="flex items-center gap-1.5">
                            <button 
                              onClick={() => handleDuplicateCollection(col)}
                              className="px-3 py-1.5 bg-neutral-900 border border-neutral-800 text-neutral-300 rounded-full hover:text-white transition-all text-[11px] flex items-center gap-1"
                            >
                              <Copy className="w-3 h-3" /> Duplicate
                            </button>
                            <button 
                              onClick={() => triggerToast(`Temporary link copied: aix.io/bundles/${col.id}`)}
                              className="p-1.5 hover:bg-neutral-900 rounded-full"
                            >
                              <Share2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                      </div>
                    ))}
                </div>

                {/* MODAL WINDOW FOR NEW BUNDLE */}
                {isColModalOpen && (
                  <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-neutral-950 border border-neutral-900 p-6 rounded-3xl max-w-md w-full space-y-4">
                      <div className="flex justify-between items-center">
                        <h4 className="font-extrabold text-base tracking-tight text-white">Create Curated Bundle</h4>
                        <button onClick={() => setIsColModalOpen(false)} className="text-neutral-400 hover:text-white">✕</button>
                      </div>
                      <form onSubmit={handleCreateCollection} className="space-y-4 text-xs">
                        <div className="space-y-1">
                          <label className="text-neutral-400 font-mono">BUNDLE TITLE</label>
                          <input
                            type="text"
                            required
                            value={newColTitle}
                            onChange={(e) => setNewColTitle(e.target.value)}
                            placeholder="e.g. Prompt Engineering"
                            className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2.5 text-white"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-neutral-400 font-mono">DESCRIPTION</label>
                          <textarea
                            value={newColDesc}
                            onChange={(e) => setNewColDesc(e.target.value)}
                            placeholder=" curation scope and target audience details..."
                            className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-3 text-white h-20 resize-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-neutral-400 font-mono">TAGS (comma separated)</label>
                          <input
                            type="text"
                            value={newColTags}
                            onChange={(e) => setNewColTags(e.target.value)}
                            placeholder="AI Agents, Logic, Vision"
                            className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2.5 text-white"
                          />
                        </div>
                        <div className="pt-2 flex justify-end gap-2">
                          <button 
                            type="button" 
                            onClick={() => setIsColModalOpen(false)}
                            className="px-4 py-2 rounded-full border border-neutral-800 font-mono"
                          >
                            Cancel
                          </button>
                          <button 
                            type="submit" 
                            className="px-5 py-2 bg-amber-500 text-neutral-950 font-bold font-mono rounded-full"
                          >
                            Release Bundle
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}

              </div>
            )}

            {/* 4. LEADERBOARDS TAB */}
            {activeTab === 'leaderboards' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* LEFT: WEEKLY CONTRIBUTORS LEADERBOARD */}
                <div className="p-6 rounded-3xl border border-neutral-900 bg-neutral-950/40 space-y-6">
                  <div>
                    <h3 className="font-bold font-mono text-sm tracking-tight text-white flex items-center gap-2">
                      <Award className="w-4 h-4 text-amber-500 animate-bounce" /> TOP CONTRIBUTING DEVELOPERS
                    </h3>
                    <p className="text-xs text-neutral-500 mt-1">Updated weekly based on discussion threads, bookmark shares, and paper evaluations.</p>
                  </div>

                  <div className="space-y-4">
                    {[
                      { name: 'Dr. Evelyn Carter', org: 'Stanford NLP', level: 'Level 14', xp: '1,420 XP', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80', badge: 'Research Explorer' },
                      { name: 'Yuki Takahashi', org: 'Kyoto ML Group', level: 'Level 11', xp: '1,150 XP', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&auto=format&fit=crop&q=80', badge: 'AI Analyst' },
                      { name: 'Devon Reed', org: 'Neuromorphic Labs', level: 'Level 9', xp: '980 XP', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80', badge: 'Top Contributor' },
                      { name: 'Sarah Jenkins', org: 'AI Safety Alliance', level: 'Level 8', xp: '870 XP', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80', badge: 'Early Adopter' },
                      { name: 'Kenji Sato', org: 'Tohoku CV', level: 'Level 7', xp: '720 XP', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80', badge: 'Knowledge Builder' }
                    ].map((user, idx) => (
                      <div key={user.name} className="flex items-center justify-between p-3.5 rounded-2xl bg-neutral-950/50 border border-neutral-900 hover:border-neutral-800 transition-all">
                        <div className="flex items-center gap-3">
                          <span className={`text-xs font-mono font-bold w-5 text-center ${idx === 0 ? 'text-amber-500' : idx === 1 ? 'text-neutral-300' : idx === 2 ? 'text-amber-700' : 'text-neutral-600'}`}>
                            {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : idx + 1}
                          </span>
                          <img src={user.avatar} alt={user.name} className="w-8.5 h-8.5 rounded-full object-cover border border-neutral-800" />
                          <div>
                            <h4 className="text-xs font-bold text-white">{user.name}</h4>
                            <span className="text-[10px] text-neutral-500">{user.org}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-mono text-amber-500 font-bold">{user.xp}</span>
                          <div className="text-[9px] text-neutral-400 font-mono uppercase">{user.level}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* RIGHT: MOST ACTIVE COLLECTIONS & TRENDING DISCUSSIONS */}
                <div className="space-y-6">
                  <div className="p-6 rounded-3xl border border-neutral-900 bg-neutral-950/40 space-y-4">
                    <h3 className="font-bold font-mono text-sm text-white flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-amber-500" /> MOST FOLLOWED COMMUNITY BUNDLES
                    </h3>
                    <div className="space-y-3">
                      {collections.slice(0, 3).map((col, idx) => (
                        <div key={col.id} className="flex items-center justify-between p-3 bg-neutral-900/30 rounded-2xl border border-neutral-900">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-neutral-500 font-mono font-bold">{idx + 1}.</span>
                            <div>
                              <h4 className="text-xs font-bold text-white">{col.name}</h4>
                              <p className="text-[10px] text-neutral-500">by @{col.authorUsername}</p>
                            </div>
                          </div>
                          <span className="text-[10px] font-mono text-amber-500 font-bold bg-amber-500/10 px-2 py-0.5 rounded-full">
                            {col.followersCount} followers
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-6 rounded-3xl border border-neutral-900 bg-neutral-950/40 space-y-4">
                    <h3 className="font-bold font-mono text-sm text-white flex items-center gap-2">
                      <Star className="w-4 h-4 text-amber-500" /> WEEKLY HIGHLIGHT REVIEWS
                    </h3>
                    <div className="bg-neutral-900/30 rounded-2xl p-4 border border-neutral-900 text-xs text-neutral-300 space-y-3">
                      <div className="flex justify-between items-center pb-2 border-b border-neutral-900">
                        <span className="font-bold text-white">Recommended Paper of the Week</span>
                        <span className="text-[9px] bg-emerald-500/15 text-emerald-500 px-1.5 py-0.5 rounded font-mono">SELECTED</span>
                      </div>
                      <p className="italic">"Optimizing speculative decoding pipelines for Edge Devices: Latency reduction by 42% through structured code-size pruning."</p>
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-neutral-500">Curated by Stanford NLP</span>
                        <button onClick={() => triggerToast("Launching reading template...")} className="text-amber-500 hover:underline">Read Now</button>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* 5. TEAM WORKSPACES TAB */}
            {activeTab === 'teams' && (
              <div className="space-y-6">
                <div className="p-6 rounded-3xl border border-neutral-900 bg-neutral-950/40 space-y-6">
                  <div>
                    <h3 className="font-bold font-mono text-sm tracking-tight text-white flex items-center gap-2">
                      <Users className="w-4 h-4 text-amber-500" /> ENTERPRISE TEAM COLLABORATION
                    </h3>
                    <p className="text-xs text-neutral-400">Co-author collections, evaluate private benchmarks, and invite engineering teammates.</p>
                  </div>

                  {teams.map(team => (
                    <div key={team.id} className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4">
                      
                      {/* Left: Teammates */}
                      <div className="lg:col-span-6 space-y-4">
                        <h4 className="text-xs font-mono text-neutral-400 uppercase tracking-wider">Workspace Teammates ({team.members.length})</h4>
                        
                        <div className="space-y-3">
                          {team.members.map(member => (
                            <div key={member.email} className="flex items-center justify-between p-3 bg-neutral-950/60 rounded-2xl border border-neutral-900">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center">
                                  <User className="w-4 h-4 text-neutral-500" />
                                </div>
                                <div>
                                  <div className="text-xs font-bold text-white truncate max-w-[180px]">{member.email}</div>
                                  <span className="text-[9px] text-neutral-500 font-mono">Joined {member.joinedAt}</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="bg-neutral-900 text-neutral-400 text-[9px] font-mono px-2 py-0.5 rounded uppercase">
                                  {member.role}
                                </span>
                                <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full font-bold ${member.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500 animate-pulse'}`}>
                                  {member.status}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Invite Form */}
                        <form onSubmit={handleInviteTeamMember} className="p-4 bg-neutral-900/30 rounded-2xl border border-neutral-900 space-y-3">
                          <span className="text-[10px] text-neutral-400 font-mono uppercase tracking-wider block">Invite Collaborator</span>
                          <div className="flex gap-2">
                            <input
                              type="email"
                              required
                              placeholder="colleague@neuromorphic.ai"
                              value={inviteEmail}
                              onChange={(e) => setInviteEmail(e.target.value)}
                              className="flex-1 bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-1.5 text-xs text-white"
                            />
                            <select 
                              value={inviteRole}
                              onChange={(e: any) => setInviteRole(e.target.value)}
                              className="bg-neutral-950 border border-neutral-800 rounded-xl px-2 py-1.5 text-xs text-neutral-300"
                            >
                              <option value="Editor">Editor</option>
                              <option value="Viewer">Viewer</option>
                              <option value="Admin">Admin</option>
                            </select>
                            <button type="submit" className="px-4 py-1.5 bg-amber-500 text-neutral-950 font-bold font-mono text-xs rounded-xl hover:bg-amber-400">
                              Invite
                            </button>
                          </div>
                          {inviteError && <p className="text-[10px] text-rose-500 font-mono">{inviteError}</p>}
                        </form>
                      </div>

                      {/* Right: Shared stats */}
                      <div className="lg:col-span-6 space-y-6">
                        <h4 className="text-xs font-mono text-neutral-400 uppercase tracking-wider">Shared Assets Overview</h4>
                        <div className="grid grid-cols-2 gap-4 text-center">
                          <div className="p-4 bg-neutral-950/60 rounded-2xl border border-neutral-900">
                            <span className="text-2xl font-extrabold text-amber-500 font-mono">{team.sharedNotesCount}</span>
                            <div className="text-[10px] text-neutral-500 font-mono mt-1">SHARED NOTES</div>
                          </div>
                          <div className="p-4 bg-neutral-950/60 rounded-2xl border border-neutral-900">
                            <span className="text-2xl font-extrabold text-amber-500 font-mono">{team.sharedBookmarksCount}</span>
                            <div className="text-[10px] text-neutral-500 font-mono mt-1">SHARED BOOKMARKS</div>
                          </div>
                          <div className="p-4 bg-neutral-950/60 rounded-2xl border border-neutral-900">
                            <span className="text-2xl font-extrabold text-amber-500 font-mono">{team.sharedProjectsCount}</span>
                            <div className="text-[10px] text-neutral-500 font-mono mt-1">ACTIVE COLLAB PROJECTS</div>
                          </div>
                          <div className="p-4 bg-neutral-950/60 rounded-2xl border border-neutral-900">
                            <span className="text-2xl font-extrabold text-emerald-500 font-mono">OKTA</span>
                            <div className="text-[10px] text-neutral-500 font-mono mt-1">SSO GATEWAY STATUS</div>
                          </div>
                        </div>

                        {/* ENTERPRISE SECURITY CARD */}
                        <div className="p-5 bg-gradient-to-r from-neutral-900 to-neutral-950 rounded-2xl border border-neutral-900 space-y-3">
                          <div className="flex items-center gap-2">
                            <Shield className="w-4 h-4 text-emerald-500" />
                            <span className="text-xs font-mono font-bold text-white">SSO READINESS & AUDIT LOGS</span>
                          </div>
                          <p className="text-xs text-neutral-400 leading-relaxed">
                            Neuromorphic Labs domain is locked to SAML 2.0. Users must sign in via organization credentials. Export all platform activity in standard SOC-2 formats.
                          </p>
                          <div className="flex gap-2">
                            <button onClick={() => triggerToast("Generating audit CSV export...")} className="px-3.5 py-1.5 bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white rounded-lg text-xs font-mono flex items-center gap-1">
                              <Download className="w-3.5 h-3.5" /> Export logs
                            </button>
                            <button onClick={() => triggerToast("Enterprise credentials up to date")} className="px-3.5 py-1.5 bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white rounded-lg text-xs font-mono flex items-center gap-1">
                              <Key className="w-3.5 h-3.5" /> Key Manager
                            </button>
                          </div>
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 6. PROFILE TAB */}
            {activeTab === 'profile' && (
              <div className="space-y-8 animate-fade-in">
                
                {/* PROFILE HERO */}
                <div className="p-8 rounded-3xl border border-neutral-900 bg-gradient-to-br from-neutral-900 to-neutral-950 flex flex-col md:flex-row items-center gap-6 justify-between relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 blur-[100px] rounded-full" />
                  
                  <div className="flex flex-col md:flex-row items-center gap-5 relative">
                    <img src={profile.avatar} alt={profile.name} className="w-24 h-24 rounded-full object-cover border-2 border-amber-500 shadow-2xl" />
                    <div className="text-center md:text-left space-y-1">
                      <div className="flex items-center justify-center md:justify-start gap-2">
                        <h2 className="text-2xl font-extrabold text-white tracking-tight">{profile.name}</h2>
                        <span className="bg-amber-500/10 text-amber-500 text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase">Pro Expert</span>
                      </div>
                      <span className="text-xs text-neutral-400 font-mono block">@{profile.username} • {profile.organization}</span>
                      <p className="text-xs text-neutral-300 leading-relaxed max-w-md mt-1">{profile.bio}</p>
                    </div>
                  </div>

                  {/* STATS */}
                  <div className="flex gap-4 border-t md:border-t-0 md:border-l border-neutral-800 pt-4 md:pt-0 md:pl-6 text-center md:text-left relative">
                    <div>
                      <span className="text-xl font-extrabold text-white font-mono">{profile.followers}</span>
                      <div className="text-[10px] text-neutral-500 font-mono">FOLLOWERS</div>
                    </div>
                    <div>
                      <span className="text-xl font-extrabold text-white font-mono">{profile.following}</span>
                      <div className="text-[10px] text-neutral-500 font-mono">FOLLOWING</div>
                    </div>
                    <div>
                      <span className="text-xl font-extrabold text-amber-500 font-mono">{profile.contributions.discussions}</span>
                      <div className="text-[10px] text-neutral-500 font-mono">THREADS</div>
                    </div>
                  </div>
                </div>

                {/* TWO COLUMN GRID: BADGES & EXPERIENCE PIPES */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  
                  {/* Left Column: Achievements & Badges */}
                  <div className="lg:col-span-8 space-y-6">
                    <h3 className="font-bold font-mono text-sm tracking-tight text-white flex items-center gap-2">
                      <Award className="w-4 h-4 text-amber-500" /> GAMIFIED ACHIEVEMENTS & MILESTONES
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {profile.achievements.map(ach => (
                        <div key={ach.id} className={`p-5 rounded-3xl border ${ach.unlocked ? 'border-neutral-900 bg-neutral-950/20' : 'border-neutral-900/30 bg-neutral-950/5 opacity-60'} flex flex-col justify-between space-y-3`}>
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="text-xs font-mono text-white font-bold">{ach.title}</h4>
                              <p className="text-[11px] text-neutral-400 leading-relaxed mt-1">{ach.description}</p>
                            </div>
                            <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full ${ach.unlocked ? 'bg-emerald-500/10 text-emerald-500' : 'bg-neutral-800 text-neutral-500'}`}>
                              {ach.unlocked ? 'UNLOCKED' : 'LOCKED'}
                            </span>
                          </div>

                          <div className="space-y-1">
                            <div className="flex justify-between text-[10px] font-mono text-neutral-500">
                              <span>Milestone Progress</span>
                              <span>{ach.progress}%</span>
                            </div>
                            <div className="w-full bg-neutral-900 h-1.5 rounded-full overflow-hidden">
                              <div className="bg-amber-500 h-full transition-all duration-500" style={{ width: `${ach.progress}%` }} />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right Column: Social Connection & Bio Editor */}
                  <div className="lg:col-span-4 space-y-6">
                    <div className="p-6 rounded-3xl border border-neutral-900 bg-neutral-950/40 space-y-4">
                      <h3 className="font-bold font-mono text-sm tracking-tight text-white flex items-center gap-2">
                        <Sliders className="w-4 h-4 text-amber-500" /> SYSTEM SETTINGS
                      </h3>
                      
                      <div className="space-y-3 text-xs">
                        <div className="flex justify-between items-center pb-2 border-b border-neutral-900">
                          <span className="text-neutral-400">Expertise Tags</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {profile.expertise.map(tag => (
                            <span key={tag} className="bg-neutral-900 text-neutral-400 text-[10px] font-mono px-2 py-1 rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                        
                        <div className="pt-2 border-t border-neutral-900 flex justify-between items-center text-xs">
                          <span className="text-neutral-400">Social Links</span>
                        </div>
                        <div className="flex gap-2.5 text-neutral-400">
                          {profile.socials.twitter && (
                            <a href={profile.socials.twitter} target="_blank" rel="noopener noreferrer" className="p-2 hover:bg-neutral-950 hover:text-white rounded-full border border-neutral-900 transition-colors">
                              <Twitter className="w-4 h-4" />
                            </a>
                          )}
                          {profile.socials.linkedin && (
                            <a href={profile.socials.linkedin} target="_blank" rel="noopener noreferrer" className="p-2 hover:bg-neutral-950 hover:text-white rounded-full border border-neutral-900 transition-colors">
                              <Linkedin className="w-4 h-4" />
                            </a>
                          )}
                          {profile.socials.website && (
                            <a href={profile.socials.website} target="_blank" rel="noopener noreferrer" className="p-2 hover:bg-neutral-950 hover:text-white rounded-full border border-neutral-900 transition-colors">
                              <Globe className="w-4 h-4" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                </div>

              </div>
            )}

            {/* 7. ADMIN DASHBOARD PANEL */}
            {activeTab === 'admin' && (
              <div className="space-y-8">
                
                {/* 3 PANEL METRIC OVERVIEW */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-6 rounded-3xl border border-neutral-900 bg-neutral-950/40">
                    <span className="text-xs text-neutral-500 font-mono uppercase tracking-wider block">Daily Active Curators</span>
                    <span className="text-3xl font-extrabold text-amber-500 font-mono mt-1 block">14,289</span>
                    <span className="text-[10px] text-emerald-500 font-mono">+12% vs yesterday</span>
                  </div>
                  <div className="p-6 rounded-3xl border border-neutral-900 bg-neutral-950/40">
                    <span className="text-xs text-neutral-500 font-mono uppercase tracking-wider block">Reported Discussion Items</span>
                    <span className="text-3xl font-extrabold text-white font-mono mt-1 block">0</span>
                    <span className="text-[10px] text-neutral-500 font-mono">Verified SOC-2 compliant</span>
                  </div>
                  <div className="p-6 rounded-3xl border border-neutral-900 bg-neutral-950/40">
                    <span className="text-xs text-neutral-500 font-mono uppercase tracking-wider block">Network Ingress Latency</span>
                    <span className="text-3xl font-extrabold text-emerald-500 font-mono mt-1 block">22ms</span>
                    <span className="text-[10px] text-emerald-500 font-mono">100% cloud health uptime</span>
                  </div>
                </div>

                {/* GRAPH SECTION - RECHARTS */}
                <div className="p-6 rounded-3xl border border-neutral-900 bg-neutral-950/20">
                  <h3 className="font-bold font-mono text-sm mb-4 tracking-tight text-white flex items-center gap-2">
                    <Database className="w-4 h-4 text-amber-500" /> REAL-TIME DAILY USAGE METRICS (LAST 7 DAYS)
                  </h3>
                  
                  <div className="h-64 w-full text-xs">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={DAILY_PLATFORM_METRICS}>
                        <defs>
                          <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2}/>
                            <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="colorRequests" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="name" stroke="#525252" />
                        <YAxis stroke="#525252" />
                        <Tooltip contentStyle={{ backgroundColor: '#171717', borderColor: '#262626', borderRadius: '12px' }} />
                        <Legend />
                        <Area type="monotone" dataKey="activeUsers" stroke="#f59e0b" fillOpacity={1} fill="url(#colorUsers)" name="Active Users" />
                        <Area type="monotone" dataKey="copilotConversations" stroke="#10b981" fillOpacity={1} fill="url(#colorRequests)" name="Copilot Chats" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* AUDIT LOG TRAIL & CONFIG CONTROLS */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  
                  {/* Left: Audit Trail */}
                  <div className="lg:col-span-7 p-6 rounded-3xl border border-neutral-900 bg-neutral-950/40 space-y-4">
                    <h4 className="text-xs font-mono text-neutral-400 uppercase tracking-wider">Secured System Audit Log (SOC-2 Compliance)</h4>
                    
                    <div className="space-y-3 text-xs font-mono">
                      {auditLogs.map(log => (
                        <div key={log.id} className="p-3 bg-neutral-950 rounded-2xl border border-neutral-900 space-y-1">
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] text-neutral-500">{new Date(log.timestamp).toLocaleString()}</span>
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${log.severity === 'high' ? 'bg-rose-500/10 text-rose-500' : log.severity === 'medium' ? 'bg-amber-500/10 text-amber-500' : 'bg-neutral-800 text-neutral-400'}`}>
                              {log.severity.toUpperCase()}
                            </span>
                          </div>
                          <div className="text-neutral-200">{log.action}</div>
                          <div className="text-[10px] text-neutral-500">Initiator: {log.user} ({log.ipAddress})</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right: Feature flags & Announcement Maker */}
                  <div className="lg:col-span-5 space-y-6">
                    <div className="p-6 rounded-3xl border border-neutral-900 bg-neutral-950/40 space-y-4">
                      <h4 className="text-xs font-mono text-neutral-400 uppercase tracking-wider">Feature Flags / Deployment Toggles</h4>
                      
                      <div className="space-y-3 text-xs">
                        {[
                          { key: 'enableDynamicVesting', label: 'Dynamic Model Weight Caching' },
                          { key: 'enableWebRTCVoiceStream', label: 'Live voice call streaming' },
                          { key: 'enableGeminiPreloading', label: 'Gemini Context pre-warming' },
                          { key: 'strictDataIsolation', label: 'GDPR Encrypted Data Erasure' }
                        ].map(flag => (
                          <div key={flag.key} className="flex justify-between items-center">
                            <span className="text-neutral-300">{flag.label}</span>
                            <button
                              onClick={() => {
                                setFeatureFlags(prev => ({
                                  ...prev,
                                  [flag.key]: !prev[flag.key as keyof typeof featureFlags]
                                }));
                                triggerToast("Feature flag state synchronized.");
                              }}
                              className={`w-10 h-5.5 rounded-full p-0.5 transition-colors ${featureFlags[flag.key as keyof typeof featureFlags] ? 'bg-emerald-500' : 'bg-neutral-800'}`}
                            >
                              <div className={`w-4.5 h-4.5 bg-neutral-950 rounded-full transition-transform ${featureFlags[flag.key as keyof typeof featureFlags] ? 'translate-x-4.5' : 'translate-x-0'}`} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Announcement Form */}
                    <div className="p-6 rounded-3xl border border-neutral-900 bg-neutral-950/40 space-y-4">
                      <h4 className="text-xs font-mono text-neutral-400 uppercase tracking-wider">Post Platform Announcement</h4>
                      
                      <form onSubmit={handleAddAnnouncement} className="space-y-3 text-xs">
                        <input
                          type="text"
                          required
                          placeholder="Announcement title"
                          value={newAnnTitle}
                          onChange={(e) => setNewAnnTitle(e.target.value)}
                          className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-white"
                        />
                        <textarea
                          required
                          placeholder="Markdown or system release text details..."
                          value={newAnnContent}
                          onChange={(e) => setNewAnnContent(e.target.value)}
                          className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-white h-16 resize-none"
                        />
                        <button type="submit" className="w-full py-2 bg-amber-500 text-neutral-950 font-bold font-mono rounded-xl hover:bg-amber-400">
                          Post Logs
                        </button>
                      </form>
                    </div>
                  </div>

                </div>

              </div>
            )}

          </div>
        </main>
      )}

      {/* NOTIFICATION DRAWER CENTER */}
      <AnimatePresence>
        {isNotifDrawerOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end">
            <motion.div 
              initial={{ x: 400 }}
              animate={{ x: 0 }}
              exit={{ x: 400 }}
              className="w-full max-w-sm bg-neutral-950 border-l border-neutral-900 h-full p-6 flex flex-col justify-between"
            >
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h4 className="font-extrabold text-base tracking-tight text-white flex items-center gap-2">
                    <Bell className="w-4 h-4 text-amber-500" /> Notifications ({notifications.filter(n => !n.read).length})
                  </h4>
                  <button onClick={() => setIsNotifDrawerOpen(false)} className="text-neutral-400 hover:text-white">✕</button>
                </div>

                <div className="space-y-3 overflow-y-auto max-h-[500px] scrollbar-none">
                  {notifications.map(n => (
                    <div 
                      key={n.id} 
                      onClick={() => {
                        setNotifications(prev => prev.map(item => item.id === n.id ? { ...item, read: true } : item));
                        triggerToast("Notification marked as read");
                      }}
                      className={`p-4 rounded-2xl border ${n.read ? 'border-neutral-900 bg-neutral-950/20' : 'border-amber-500/20 bg-amber-500/5'} cursor-pointer transition-colors space-y-1.5`}
                    >
                      <div className="flex justify-between items-start">
                        <span className="text-xs font-extrabold text-neutral-200">{n.title}</span>
                        {!n.read && <span className="w-1.5 h-1.5 bg-amber-500 rounded-full" />}
                      </div>
                      <p className="text-[11px] text-neutral-400 leading-relaxed">{n.body}</p>
                      <span className="text-[9px] text-neutral-500 font-mono block">{new Date(n.timestamp).toLocaleTimeString()}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-900">
                <button 
                  onClick={() => {
                    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
                    triggerToast("All notifications cleared");
                  }} 
                  className="w-full py-2 bg-neutral-900 text-neutral-300 font-mono text-xs rounded-xl hover:text-white transition-colors"
                >
                  Mark all read
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
