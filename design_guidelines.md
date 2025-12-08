# Design Guidelines - Remon Romany Genius

## Design Approach: Material Design 3 + Developer-Focused Enhancements

**Rationale:** This is a productivity platform requiring clarity, efficiency, and information density. Material Design 3 provides excellent patterns for complex dashboards while maintaining accessibility and consistency across RTL/LTR layouts.

**Key Principles:**
- **Efficiency First:** Every pixel serves a purpose - maximize information density without clutter
- **Code-Centric:** Design around code readability and AI interaction patterns
- **Bilingual Excellence:** Seamless RTL/LTR switching without layout breaks
- **Progressive Disclosure:** Show complexity only when needed

---

## Typography

**Font Families:**
- **UI/Body:** Inter (CDN: Google Fonts) - exceptional readability at all sizes, excellent Arabic support
- **Code/Monospace:** JetBrains Mono (CDN: Google Fonts) - optimized for developers with ligatures
- **Headings:** Inter SemiBold/Bold

**Scale (Tailwind units):**
- Hero headings: `text-4xl` to `text-6xl` (48-60px)
- Section headings: `text-2xl` to `text-3xl` (24-30px)
- Body: `text-base` (16px)
- Code: `text-sm` (14px)
- Captions/metadata: `text-xs` (12px)

**Hierarchy:**
- Primary headings: SemiBold, tight letter-spacing
- Body text: Regular weight, balanced line-height (1.6)
- Code blocks: Monospace, slightly reduced line-height (1.4)

---

## Layout System

**Spacing Primitives:** Use Tailwind units of **2, 4, 8, 12, 16** for consistent rhythm
- Micro spacing (within components): `p-2`, `gap-2`
- Component padding: `p-4`, `p-6`  
- Section spacing: `py-8`, `py-12`, `py-16`
- Page margins: `px-4` mobile, `px-8` desktop

**Grid Structure:**
- Dashboard: Sidebar (280px fixed) + Main content (fluid)
- Content max-width: `max-w-7xl` (1280px) for readability
- Cards/panels: `max-w-4xl` for code displays
- Chat interface: `max-w-3xl` centered for optimal reading

**RTL Considerations:**
- Mirror all layouts automatically using `dir="rtl"` attribute
- Icons flip horizontally (arrows, chevrons)
- Code blocks remain LTR even in RTL context
- Padding/margins auto-flip via Tailwind's RTL support

---

## Component Library

### Navigation & Shell
**Top Bar:**
- Fixed height: `h-16`
- Logo left (LTR) / right (RTL), language switcher, theme toggle, user menu right/left
- Glass effect: `backdrop-blur-md bg-white/70 dark:bg-gray-900/70`

**Sidebar:**
- Collapsible drawer (mobile: overlay, desktop: persistent)
- Nav items: Icon + label, active state with accent color background
- Quota meters at bottom (compact progress rings)

### AI Chat Interface
**Message Container:**
- User messages: Align right (LTR) / left (RTL), navy blue bubble
- AI messages: Align left (LTR) / right (RTL), glass effect card
- Code blocks: Full-width, dark background, syntax highlighting via Prism.js
- Streaming indicator: Pulsing cursor at message end

**Input Area:**
- Fixed bottom bar with `backdrop-blur`
- Multi-line textarea, auto-expand up to 200px
- Model selector dropdown (left of input)
- Send button (right of input)

### Cards & Panels
**Standard Card:**
- Glass effect: `backdrop-blur-lg bg-white/80 dark:bg-gray-800/80`
- Border: `border border-gray-200/50 dark:border-gray-700/50`
- Rounded corners: `rounded-xl`
- Shadow: `shadow-lg shadow-navy-500/10`

**Analysis Results Card (WordPress Doctor):**
- Three-column layout (Security / Performance / Code Quality)
- Score badges: Circular progress (0-100)
- Issue list: Expandable accordion items with severity color coding

### Forms & Inputs
**Text Inputs:**
- Height: `h-12`
- Padding: `px-4`
- Border: `border-2 focus:border-navy-500`
- Rounded: `rounded-lg`

**File Upload Zone:**
- Dashed border dropzone: `border-2 border-dashed border-gray-300`
- Height: `min-h-[200px]`
- Center-aligned icon + text
- Drag-over state: Border changes to navy blue

### Code Editor (Monaco)
**Container:**
- Full viewport height minus header/footer
- Split view option: 50/50 or 60/40 adjustable
- Minimap on right (LTR) / left (RTL)

**File Tree:**
- Width: `w-64`
- Icons via VS Code icon library
- Indent: `pl-4` per level

### Buttons
**Primary Action:**
- Navy blue background: `bg-navy-600 hover:bg-navy-700`
- Height: `h-11`
- Padding: `px-6`
- Rounded: `rounded-lg`

**Secondary:**
- Ghost style: `border-2 border-navy-500 text-navy-500 hover:bg-navy-50`

**Icon Buttons:**
- Square: `w-10 h-10`
- Rounded: `rounded-lg`
- Ghost or subtle fill

### Quota Meters
**Visual Style:**
- Horizontal progress bar: Height `h-2`, rounded ends
- Color gradient: Green (0-60%) → Yellow (60-85%) → Red (85-100%)
- Label above: Provider name + remaining count
- Stacked layout showing all 5 providers

---

## Images

**Hero Section (Landing/Marketing):**
- Large hero image: AI-generated abstract tech/code visualization (1920x800px)
- Overlay: `bg-gradient-to-r from-navy-900/90 to-purple-900/80`
- CTA buttons on hero: Blurred background `backdrop-blur-md bg-white/20`

**Dashboard:**
- No hero images - prioritize functional density
- Empty states: Minimal illustration (300x200px) for "no projects yet"
- AI avatar icons: Circular (48px) next to AI messages

**WordPress Doctor Results:**
- Placeholder thumbnails for uploaded theme previews (200x150px)
- Icon-based illustrations for issue types (no photos)

---

## Special Considerations

**Glassmorphism:**
- Primary surfaces: `backdrop-blur-lg` with `bg-white/80` (light) / `bg-gray-900/80` (dark)
- Accent cards: `backdrop-blur-md` with subtle navy tint

**Dark Mode:**
- Base: `bg-gray-950` (almost black)
- Cards: `bg-gray-900/80`
- Text: `text-gray-100`
- Accents remain navy blue

**Animations:**
- Minimize distractions - use only for:
  - Page transitions: Subtle fade (200ms)
  - Loading states: Skeleton screens or spinner
  - Notification toasts: Slide-in from top-right
- No parallax, no continuous animations

**Accessibility:**
- All interactive elements: Minimum `h-11` tap target
- Focus rings: `ring-2 ring-navy-500 ring-offset-2`
- Color contrast: WCAG AAA for text
- Keyboard navigation: Full support for all features

---

## Layout Examples

**Dashboard Home:**
- Top: Welcome header + quick stats (4 cards: Requests Today, Cost Saved, Active Projects, Quota Status)
- Main: Recent chats list (left 60%) + Quota meters sidebar (right 40%)

**Chat Interface:**
- Full-height split: Chat messages (70%) + Context panel (30%, collapsible)
- Bottom: Fixed input bar with model selector

**WordPress Doctor:**
- Three-step wizard: Upload → Analysis (progress) → Results
- Results: Tabbed interface (Security / Performance / Code) with issue details below

**IDE Mode:**
- Classic three-panel: File tree (20%) | Editor (60%) | AI Assistant (20%)
- All panels resizable with drag handles