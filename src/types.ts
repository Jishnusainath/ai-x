export interface NewsItem {
  title: string;
  source: string;
  summary: string;
  date: string;
  category: string; // "Models", "Hardware", "Regulation", "Business", "Applications", "Cybersecurity", "Space", "Robotics", "Finance"
  sentiment: 'positive' | 'neutral' | 'critical';
  url: string;
  confidenceScore?: number; // 0 - 100
  isDeveloping?: boolean;
  isVerified?: boolean;
  countryCode?: string; // US, UK, JP, TW, IN, KR, EU, etc.
}

export interface TimelineEvent {
  time: string;
  label: string;
  description: string;
}

export interface ArticleSummaryGroup {
  oneLine: string;
  thirtySec: string;
  detailed: string;
  eli15: string;
  technical: string;
}

export interface TrendingItem {
  name: string;
  type: 'company' | 'technology' | 'topic';
  mentions: number;
  change: number; // positive or negative percentage
  sparkline: number[];
}

export interface BookmarkItem {
  title: string;
  url: string;
  dateAdded: string;
}

export interface WorkspaceBookmark {
  id: string;
  title: string;
  url: string;
  type: 'article' | 'company' | 'model' | 'research' | 'benchmark' | 'dataset' | 'repository' | 'hardware';
  category?: string;
  dateAdded: string;
  pinned?: boolean;
  favorite?: boolean;
  notes?: string;
}

export interface Collection {
  id: string;
  name: string;
  description?: string;
  pinned?: boolean;
  favorite?: boolean;
  createdAt: string;
  color?: string;
}

export interface NoteVersion {
  timestamp: string;
  content: string;
  title: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  pinned?: boolean;
  favorite?: boolean;
  collectionId?: string;
  projectId?: string;
  versions?: NoteVersion[];
}

export interface ProjectTimelineEvent {
  date: string;
  title: string;
  description: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  pinned?: boolean;
  favorite?: boolean;
  timeline?: ProjectTimelineEvent[];
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface AIConversation {
  id: string;
  title: string;
  createdAt: string;
  messages: Message[];
}

export interface Reminder {
  id: string;
  title: string;
  type: 'read_later' | 'review_benchmark' | 'follow_company' | 'research_reminder';
  dueDate: string;
  completed: boolean;
  targetId?: string;
  createdAt: string;
}

export interface ActivityItem {
  id: string;
  type: 'note_create' | 'note_edit' | 'bookmark_add' | 'collection_create' | 'project_create' | 'reminder_add' | 'compare_models';
  title: string;
  description: string;
  timestamp: string;
}

export interface WorkspaceState {
  bookmarks: WorkspaceBookmark[];
  collections: Collection[];
  notes: Note[];
  projects: Project[];
  conversations: AIConversation[];
  reminders: Reminder[];
  activities: ActivityItem[];
  comparedModels: string[];
  updatedAt: number;
}

export interface MapMarker {
  id: string;
  country: string;
  coordinates: [number, number]; // [x, y] on SVG map
  newsCount: number;
}

