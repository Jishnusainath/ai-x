# AI X — DESIGN SYSTEM SPECIFICATION
**Version:** 1.0  
**Status:** System Guideline  
**Author:** Design Systems Team (Head of Product Design, Principal Brand Designer, Staff Engineer)  
**Date:** July 16, 2026

---

## 1. Visual Identity & Mood

The visual identity of AI X is rooted in **Swiss Modernism**, **Minimalism**, and **High-Density Data Clarity**. It is designed to prioritize readability, eliminate clutter, and foster an atmosphere of intelligence, trust, and premium craftsmanship.

```
                  ┌───────────────────────────────────────────────┐
                  │                 THE COGNITIVE                 │
                  │                 SURFACE (Dark)                │
                  ├───────────────────────┬───────────────────────┤
                  │     Deep Slate        │    Muted Borders      │
                  │     #0A0C10           │    #1F242E            │
                  ├───────────────────────┴───────────────────────┤
                  │                 ELEGANT TYPOGRAPHY            │
                  │                 Inter & Space Grotesk         │
                  └───────────────────────────────────────────────┘
```

---

## 2. Color System

AI X utilizes a sophisticated, low-contrast dark-mode palette by default, paired with precise accent colors that signify semantic status, relationship depth, and interactive focal points.

### Primary Canvas Colors
* **Background (Canvas):** `#0A0C10` (Deep charcoal-slate, optimized to prevent eye strain during long-form reading).
* **Surface (Card/Default):** `#11141B` (Subtle grey-blue surface that rises naturally above the background).
* **Surface Hover:** `#171C25` (Interactive state surface for list elements and action panels).
* **Border (Default):** `#1F242E` (Elegant, high-precision border that structures elements without creating visual noise).
* **Border Hover:** `#2D3545` (Indicates component interactivity on focus or hover).

### Typography Gradients (Contrast Hierarchy)
* **Text Primary (Display):** `#F3F4F6` (High contrast, slightly off-white for optimal reading comfort).
* **Text Secondary (Body):** `#9CA3AF` (Muted, warm grey for secondary copy and long-form passages).
* **Text Tertiary (Metadata):** `#6B7280` (Deep grey for labels, citations, and system details).
* **Text Disabled:** `#4B5563` (For inactive components).

### Semantic Accents
* **Accent (Primary):** `#4F46E5` (Indigo, represents technology, models, and intelligence pathways).
* **Success:** `#10B981` (Emerald, represents positive benchmarks, upward trends, and completed tasks).
* **Warning:** `#F59E0B` (Amber, represents regulatory adjustments or minor benchmark deviations).
* **Error:** `#EF4444` (Rose, represents API deprecations, funding drops, or system errors).
* **Info:** `#3B82F6` (Sky Blue, represents news updates, background events, and company metadata).

---

## 3. Typography & Pairings

We use font pairing to create a clear division between **Analytical Display** (Space Grotesk) and **High-Volume Reading** (Inter), with accents of **Technical Metadata** (JetBrains Mono).

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Space+Grotesk:wght@500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
```

### Typography Scale Table

| Level | Size (px) | Line Height | Letter Spacing | Font Family | Usage |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Display 1** | `32px` | `1.2` | `-0.03em` | `Space Grotesk` | Hero headers, major dashboards |
| **Header 1** | `24px` | `1.3` | `-0.02em` | `Space Grotesk` | Section titles, Article headings |
| **Header 2** | `20px` | `1.3` | `-0.01em` | `Space Grotesk` | Card headers, panel titles |
| **Subhead** | `16px` | `1.4` | `0` | `Inter (Medium)` | Sidebar titles, form group labels |
| **Body Large** | `16px` | `1.6` | `0` | `Inter (Regular)` | Long-form reading paragraphs |
| **Body Regular** | `14px` | `1.5` | `0` | `Inter (Regular)` | Grid text, company/model cards |
| **Caption** | `12px` | `1.4` | `0.02em` | `Inter (Medium)` | Tags, small captions, status badges |
| **Technical** | `12px` | `1.4` | `0` | `JetBrains Mono` | Code blocks, logs, parameter counts |

---

## 4. Spacing System (8pt Grid)

To ensure spatial rhythm across all viewports, AI X implements a strict, compounding **8pt Grid System**.

* **`space-1` (4px):** Micro adjustments (badges, inline icons).
* **`space-2` (8px):** Component padding, list-item gap.
* **`space-4` (16px):** Card content padding, minor sidebar gaps.
* **`space-6` (24px):** Main card layout padding, default grid spacing.
* **`space-8` (32px):** Page section margins, large panel offsets.
* **`space-12` (48px):** Outer canvas margins on desktop displays.

---

## 5. Grid System & Layout Architectures

AI X responds fluidly across all breakpoints, matching content density to available horizontal and vertical canvas space.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        AI X Layout Hierarchy                           │
├──────────────────────┬─────────────────────────────────────────────────┤
│ Left Sidebar         │ Main Stage (Bento Grid Dashboard / Reader)     │
│ Navigation & Profile │ Spacing: Fluid, max-w-7xl, px-6                 │
│ Width: 240px         │ Grid: 12 Columns, Gap: 24px                     │
└──────────────────────┴─────────────────────────────────────────────────┘
```

* **Mobile (0px - 640px):** Single-column layout. Sidebar collapses into an overlay drawer. Padding is restricted to `16px` (`space-4`) to maximize active space.
* **Tablet (641px - 1024px):** Double-column dashboard. Padding grows to `24px`. Left navigation becomes a compact icon rail (64px wide).
* **Desktop (1025px - 1440px):** Traditional full workspace with 12-column bento grids, custom details panel, and 240px wide sidebar.
* **Ultra-wide (>1440px):** Content bounds to `1600px` max-width, maintaining centered grid proportion with generous negative borders.

---

## 6. Unified Component Specifications

Every interactive component across the AI X ecosystem conforms to identical active states, transitions, and hover configurations to ensure operational familiarity.

### A. Action Buttons
* **Primary Button:** Solid background color (`#4F46E5`), text primary (`#F3F4F6`), subtle bottom border shadow, 6px border-radius. On hover, background shifts to `#4338CA` with a transition timing of `150ms ease-in-out`.
* **Secondary Button:** Surface background (`#11141B`), border default (`#1F242E`). On hover, border shifts to `#2D3545` and background highlights to `#171C25`.
* **Focus State:** White ring (`#F3F4F6`) with `offset-2 offset-background`.

### B. Interactive Cards
* **Visual Frame:** Dark grey background (`#11141B`), border default (`#1F242E`), border radius `8px`.
* **Hover Interaction:** Subtle vertical scale (`scale-[1.01]`), border transition to `#2D3545`, and a progressive drop shadow (`shadow-md`).
* **Active Press:** Slight scale-down (`scale-[0.99]`).

### C. Data Tables
* **Header:** Deep grey text (`#6B7280`), uppercase caption style font (`12px`), bottom-border partition (`1px solid #1F242E`).
* **Rows:** Surface background with zebra alternate striping. Hover state highlights the entire row with a transition background (`#171C25`).

---

## 7. Iconography Guidelines

* **Library:** Standardized exclusively on **Lucide React**.
* **Visual Weight:** Light weight (`strokeWidth={1.5}`) for all default displays.
* **Size Hierarchy:**
  - Micro Actions / Metadata indicators: `14px`
  - Inline navigation / Form prefix: `18px`
  - Large Section Headers / Empty States: `24px`
* **Rule of Usage:** Icons should always be accompanied by descriptive text, unless in tight navigation rails with explicit tooltip labels. Never use icons purely as decorative clutter.

---

## 8. Data Visualization Standards

Charts are engineered to translate mathematical trends into structural, aesthetic intelligence.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Data Visualization Map                         │
├─────────────────────┬──────────────────────────┬───────────────────────┤
│ Trend Chart         │ Recharts Line / Area     │ Muted Indigo/Emerald  │
├─────────────────────┼──────────────────────────┼───────────────────────┤
│ Entity Performance  │ Horizontal Bar Chart     │ Dense, high-contrast  │
├─────────────────────┼──────────────────────────┼───────────────────────┤
│ Network Graph       │ Force-directed Canvas    │ Accents on active node│
└─────────────────────┴──────────────────────────┴───────────────────────┘
```

* **Color Palette:**
  - Line 1: `#4F46E5` (Indigo)
  - Line 2: `#10B981` (Emerald)
  - Line 3: `#3B82F6` (Sky Blue)
  - Gridlines: `#1F242E` (Dotted pattern)
* **Design Pattern:** Tooltips must render in elegant custom HTML cards matching the `#11141B` surface style, styled with deep shadow borders and formatted JetBrains Mono parameters.

---

## 9. Motion & Micro-Interactions

Motion in AI X is functional, helping the user map spatial layout shifts rather than distracting them.

### Motion Constants
* **Transition Fast:** `150ms cubic-bezier(0.4, 0, 0.2, 1)` (used for buttons, icon hovers, and tab switches).
* **Transition Normal:** `250ms cubic-bezier(0.4, 0, 0.2, 1)` (used for card entries, sidebar collapses, and modal openings).
* **Stagger Delay:** `30ms` per list item to create elegant entry rhythms during dashboard loading.

### Core Transitions
* **Page Route Switch:** Smooth vertical slide-fade (`y: [10, 0], opacity: [0, 1]`).
* **Search Command Entry:** Quick, centered pop-in (`scale: [0.95, 1], opacity: [0, 1]`) with active shadow blur backdrop.

---

## 10. Design Tokens (JSON Reference)

These tokens serve as the unified configuration mapping design system metrics to tailwind, CSS, and component definitions.

```json
{
  "colors": {
    "background": "#0A0C10",
    "surface": "#11141B",
    "surfaceHover": "#171C25",
    "border": "#1F242E",
    "borderHover": "#2D3545",
    "text": {
      "primary": "#F3F4F6",
      "secondary": "#9CA3AF",
      "tertiary": "#6B7280"
    },
    "accents": {
      "indigo": "#4F46E5",
      "emerald": "#10B981"
    }
  },
  "radius": {
    "small": "4px",
    "medium": "8px",
    "large": "12px"
  },
  "fonts": {
    "sans": "Inter, sans-serif",
    "display": "Space Grotesk, sans-serif",
    "mono": "JetBrains Mono, monospace"
  }
}
```

---

## 11. Accessibility & Compliance (WCAG 2.1 AA)

1. **Color Contrast:** Every combination of text and background colors is systematically checked to exceed a contrast ratio of **4.5:1** (for body text) and **3:1** (for display headings).
2. **Interactive States:** Focus rings must always remain visible, avoiding the use of `outline: none` unless replaced by a custom high-visibility visual accent.
3. **Touch Sizing:** Touch elements are kept above a minimum of **44x44px** on mobile breakpoints, with safe margins of `8px` between adjacent interactive elements.
4. **Reduced Motion:** Fully supports the `prefers-reduced-motion` media query, disabling complex page slides and scaling transitions for users with motion sensitivity.
