# AI X — NAVIGATION & INTERACTION SYSTEM SPECIFICATION
**Version:** 1.0  
**Status:** UX / Interaction Guideline  
**Author:** Navigation Architecture & Interaction Engineering Team  
**Date:** July 16, 2026

---

## 1. Interaction & Navigation Philosophy

Navigation at AI X is treated as an invisible utility. We reject deep, multi-tier nested menus, hamburger icons, and flashy transition effects. Instead, we adhere to three primary constraints:
1. **The Three-Click Rule:** Any piece of intelligence on the platform must be accessible within three clicks from the home dashboard.
2. **Immediate Command Fallback:** A universal command console (`Cmd+K`) is accessible on all screens, offering direct keyboard-first access to all search terms, navigational endpoints, and action commands.
3. **No Dead-Ends:** Every detailed view must feature dynamic, context-aware cross-links to keep the user engaged in an ongoing loop of discovery.

---

## 2. Global Navigation Framework

The AI X workspace utilizes a standard three-panel configuration:

```
┌────────────────────────────────────────────────────────────────────────┐
│                          GLOBAL DESKTOP FRAME                          │
├──────────────┬─────────────────────────────────────────────────────────┤
│ Left Sidebar │ Top Navigation Bar                                      │
│ Workspace    │ Breadcrumbs > Hub ID > Current Entity   Search Action   │
│ Controls     ├─────────────────────────────────────────────────────────┤
│              │ Main Workspace Stage                                    │
│ Navigation   │ (Bento Dashboard Grid / Document Reader)                │
│ Shortcuts    │                                                         │
│              │                                                         │
│ Settings     │                                                         │
└──────────────┴─────────────────────────────────────────────────────────┘
```

### Navigational Panels
* **Left Navigation Sidebar (Width: 240px):**
  * Provides quick access to top-level views: **Global Command Desk**, **Intelligence Hubs**, **My Workspace**, **Saved Reports**, **Personal Settings**.
  * Contains the **Workspace Switcher** to toggle between Personal Intelligence and Enterprise Team workspaces.
* **Top Navigation Bar (Height: 56px):**
  * Displays active breadcrumb pathways tracking the user’s exact contextual path.
  * Features the **Global Search Indicator** box (`Cmd+K`) and **Notification Alert Indicator**.
* **Footer System (Static height):**
  * Compact metadata rail containing platform compliance, status indicators, and quick keyboard-shortcut legends.

---

## 3. The Command Palette (Universal Console)

The Command Palette is the operational core of AI X. Pressed via `Cmd+K` (Mac) or `Ctrl+K` (Windows/Linux), it opens a modal overlay blur window.

```
┌─────────────────────────────────────────────────────────┐
│  Search intelligence, companies, models...         [Esc]│
├─────────────────────────────────────────────────────────┤
│  🎯 NAVIGATE                                            │
│     Go to AI Intelligence Hub                       ⌘1  │
│     Go to Startup Hub                               ⌘2  │
│  🔍 RECENT SEARCHES                                     │
│     "OpenAI GPT-5 benchmarks"                           │
│     "Menlo Ventures portfolio"                          │
│  ⚙️ ACTIONS                                             │
│     Clear workspace bookmarks                       ⌘⌥C │
└─────────────────────────────────────────────────────────┘
```

### Console Search Categories
* **Navigate:** Jump instantly to hubs, folders, or settings.
* **Entities:** Direct matches to `Entity: Company`, `Entity: Model`, etc.
* **Actions:** Trigger system features (e.g., "Toggle Dark Mode", "Export Active List", "Clear Recent History").
* **Keyboard Navigation:** `Up/Down Arrows` to select, `Enter` to confirm, `Escape` to close.

---

## 4. Search Experience Architecture

Our search interface treats natural-language prompts as precise database filters.

* **Autocomplete & Instant Match:** Typing a letter triggers high-performance client-side fuzzy searching against our cached index of popular models and companies, rendering matching entity chips in real time.
* **Fuzzy Matching Logic:** Matches sub-strings across names, metadata, and acronyms (e.g., typing "3.5S" matches "Claude 3.5 Sonnet").
* **Trending Indicators:** When search is active and empty, the drop-down panel lists the day's top 5 trending search terms and recently updated model leaderboards.

---

## 5. Breadcrumb Navigation System

To give the user constant spatial awareness, breadcrumbs update with exact context-pathing.

* **Format:** `Home` / `Hub` / `Category` / `Entity`
* **Interactive Behavior:** Each segment of the breadcrumb acts as an active dropdown. Clicking `Category` shows alternative categories within that hub, while clicking `Hub` lets users jump straight to other vertical hubs.
* **Visual Style:** Caption-weight typography in medium grey (`#6B7280`), separated by a slim chevron icon (`strokeWidth={1}`).

---

## 6. Page Transitions & Loading Strategy

To ensure instant interaction, AI X uses a multi-layered asset delivery system:

### Asset Delivery Pipeline
```
1. Instant Visual Box (Skeleton Loader) ──► 2. Local Index Hydration ──► 3. API Stream Ingestion
   (Muted gray blocks)                      (Fills text from memory)      (Populates live analytics)
```

1. **Skeleton Screen Loader:** We do not use spinning circle graphics. When a page is requested, the interface immediately draws static skeleton cards styled with muted grey layout shapes (`#1F242E`).
2. **Instant Local Index Hydration:** Navigation loads basic entity text, headers, and metadata from local memory first, before querying remote databases.
3. **Optimistic UI Updates:** Action buttons (such as Bookmark) toggle their visual state instantly, rolling back with a subtle error message only if the backend database writes fail.

---

## 7. Precise Keyboard Navigation Grid

Every major action on AI X is mapped to a dedicated keyboard shortcut.

| Shortcut | Action | Scope |
| :--- | :--- | :--- |
| `⌘ + K` or `Ctrl + K` | Toggle Universal Command Console | Global |
| `⌘ + 1` | Open AI Intelligence Hub | Global |
| `⌘ + 2` | Open Financial & Market Hub | Global |
| `⌘ + B` | Hide/Show Left Navigation Sidebar | Global |
| `⌘ + D` | Bookmark Current Entity / Report | Page Context |
| `Esc` | Close Modal / Return to Previous Page | Global |
| `Left Arrow` | Go to Previous Node in Timeline | Timeline View |
| `Right Arrow` | Go to Next Node in Timeline | Timeline View |

---

## 8. Notification Engine

Notifications keep professionals connected to market shifts without cluttering their focus.

* **Breaking Intelligence:** Real-time visual toast notifications (top-right overlay) for critical global events (e.g., "OpenAI announces CEO leadership shift").
* **Quiet-Mode Alerts:** Non-intrusive metadata indicator dots in the Left Sidebar for followed companies and model score changes.
* **Subtle Delivery:** Employs low-frequency notifications, aggregating minor updates into a unified daily brief.

---

## 9. Personalization Entry Points (Following & Watchlists)

* **The Follow Loop:** Every Company, Model, and Industry dossier has a clear **Follow** toggle in the header.
* **Watchlist Folders:** Users can categorize followed entities into multiple sub-watchlists (e.g., "Competitor Models," "My API Stack").
* **Navigational Impact:** Following an entity prioritizes its updates in global search results, lists it under "Favorites" in the sidebar, and adjusts the dynamic homepage content block to match.

---

## 10. Responsive Adaptations

To retain high utility on smaller screens, navigation adapts intelligently instead of simply hiding features:

```
┌─────────────────────────────────────────────────────────┐
│                      MOBILE INTERFACE                   │
├─────────────────────────────────────────────────────────┤
│ [Menu]              AI X Global Stage             [Search]│
├─────────────────────────────────────────────────────────┤
│ Active Bento Grid Carousel (Swipe left/right)           │
│                                                         │
│                                                         │
├─────────────────────────────────────────────────────────┤
│ [Global]     [Hubs]     [Workspace]     [Notifications] │
│                      Mobile Nav Bar                     │
└─────────────────────────────────────────────────────────┘
```

* **Sidebar Collapse:** On mobile screens, the left sidebar collapses completely. A bottom tab navigation bar is introduced, containing four core tabs: **Global Stage**, **Hubs**, **Workspace**, and **Notifications**.
* **Bento Swiping:** Grid components wrap into single column stacks, and wide data tables convert to swipeable carousel views.
* **Touch Optimization:** Hover states are completely disabled on touch devices. Selection menus open as full-screen bottom sheets instead of small floating popovers to ensure comfortable touch targeting.
