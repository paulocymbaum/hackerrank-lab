# Design (Apple-like, tinted glass UI)

This frontend aims for an **Apple-like UI**: calm typography, strong hierarchy, generous whitespace, subtle depth, and **tinted “colored glass” surfaces** that stay readable (not “clear glassmorphism” where content behind harms contrast).

## Design goals
- **Clarity first**: content is primary; decoration is secondary.
- **Soft depth**: layered surfaces with subtle blur + shadow, not heavy skeuomorphism.
- **High legibility**: tinted glass panels with stable contrast in light/dark.
- **Fast scanning**: consistent spacing, section headers, and progressive disclosure (accordions).

## UX choices for the web interface
- **Information architecture**
  - Left-to-right reading with a single primary column (max width).
  - Course list as **accordion**: “overview first, details on demand”.
- **Navigation**
  - Start simple: one screen (Catalog).
  - Add later: course detail view, lesson reader, search.
- **Interaction patterns**
  - Large hit targets (minimum 44px).
  - Visible focus rings and keyboard navigation.
  - Motion is optional and subtle (short, low-distance transitions).
- **Accessibility**
  - Maintain WCAG-friendly contrast on all surfaces.
  - Prefer `prefers-reduced-motion` safe animations.

---

## Visual language: “Colored glass” (not clear glass)

**Rule**: glass panels must be **tinted and sufficiently opaque** so text is readable regardless of what’s behind.

Recommended surface recipe:
- **Background**: soft gradient “wallpaper” layer (low frequency, no high-contrast noise).
- **Panels**: tinted fill + blur + hairline border + soft shadow.
- **Controls**: slightly more opaque than panels; clear hover/pressed states.

Guidance:
- Use blur as a **secondary** effect; tint/opacity does the heavy lifting for readability.
- Prefer **one** accent color per surface family (e.g., indigo/cyan) rather than rainbow gradients.

---

## Design tokens

Tokens are listed as **CSS custom properties** for portability (works with plain CSS, Tailwind, or any CSS-in-JS).

### Color (semantic-first)
Light mode (example values):
- `--bg-0`: `#0B1020` (deep “wallpaper” base when using dark-first backgrounds) **or** `#F5F6F8` for light-first.
- `--text-0`: `#0B1220`
- `--text-1`: `#3B4457`
- `--border-0`: `rgba(255,255,255,0.35)` (hairline)
- `--shadow-ink`: `rgba(8, 12, 20, 0.18)`
- `--glass-tint`: `rgba(99, 102, 241, 0.18)` (indigo tint)
- `--glass-fill`: `rgba(255, 255, 255, 0.55)` (panel base opacity)
- `--glass-fill-strong`: `rgba(255, 255, 255, 0.72)` (controls)
- `--accent-0`: `#6366F1` (indigo)
- `--accent-1`: `#22D3EE` (cyan highlight, sparingly)
- `--danger-0`: `#E11D48`
- `--success-0`: `#10B981`

Dark mode: keep text bright and **increase panel opacity slightly**:
- `--text-0`: `rgba(255,255,255,0.92)`
- `--text-1`: `rgba(255,255,255,0.72)`
- `--glass-fill`: `rgba(12, 16, 28, 0.62)`
- `--glass-fill-strong`: `rgba(12, 16, 28, 0.78)`
- `--border-0`: `rgba(255,255,255,0.14)`

### Typography
- **Font stack** (Apple-like, no licensing issues):
  - `ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Segoe UI", Inter, Roboto, Arial, sans-serif`
- **Sizes**
  - `--fs-0`: 12px (meta)
  - `--fs-1`: 14px (body)
  - `--fs-2`: 16px (body+)
  - `--fs-3`: 18px (section)
  - `--fs-4`: 22px (page title)
- **Line heights**
  - `--lh-tight`: 1.25
  - `--lh-body`: 1.5

### Spacing
Use an 8px base scale:
- `--space-1`: 4px
- `--space-2`: 8px
- `--space-3`: 12px
- `--space-4`: 16px
- `--space-5`: 24px
- `--space-6`: 32px

### Radius
Apple-like rounding: moderate, consistent.
- `--r-1`: 10px (cards/panels)
- `--r-2`: 14px (modals/sheets)
- `--r-pill`: 999px (chips)

### Blur
Tinted blur (avoid extreme blur values):
- `--blur-1`: 10px
- `--blur-2`: 16px

### Shadows
Soft, wide, low-opacity.
- `--shadow-1`: `0 10px 30px rgba(8,12,20,0.18)`
- `--shadow-2`: `0 16px 50px rgba(8,12,20,0.22)`

### Borders / hairlines
- 1px hairline with subtle alpha; avoid thick outlines.
- Hover uses slightly stronger border alpha rather than changing layout.

---

## Core components (and how they should feel)

### Layout
- **Page container**: max-width 900–1024px, centered.
- **Section headings**: small, calm, consistent spacing above/below.

### Surfaces
- `Card / Panel`: tinted glass with hairline border + shadow.
- `Toolbar`: stronger fill, sticky optional later.

### Controls
- `Button`: subtle gradient optional; clear hover/pressed; focus ring.
- `Input`: strong fill; placeholder de-emphasized.
- `Accordion`: summary row is the “button”; chevron on the right; smooth open/close optional.

### States
- `Loading`: lightweight skeletons or single-line “Loading…”.
- `Empty`: friendly empty-state copy with next step.
- `Error`: compact error panel (no huge stack traces by default).

---

## Recommended libraries (when you choose to integrate)

You can keep the current hand-rolled UI, but when you want consistency + accessibility:

- **Component primitives**: Radix UI (`@radix-ui/react-*`)
  - Best-in-class accessibility primitives (dialog, dropdown, accordion, etc.)
- **Styling**
  - **Option A**: Tailwind CSS (fast iteration, token mapping via `theme.extend`)
  - **Option B**: CSS variables + vanilla CSS (simple, explicit)
- **Utility**: `clsx` (conditional class names) if using utility classes
- **Animation** (optional): Framer Motion (keep transitions subtle)

---

## Icon library

Preferred:
- **Lucide** (`lucide-react`): clean, consistent stroke icons.

Alternatives:
- **Heroicons**: good set, slightly different visual voice.
- Avoid bundling Apple SF Symbols directly unless you’re sure your usage/licensing matches your distribution needs; for a web app, Lucide is the simplest.

---

## Public assets

- **Favicon/app icons**
  - `public/favicon.svg` (simple mark)
  - `public/apple-touch-icon.png`
  - `public/site.webmanifest`
- **Background**
  - Subtle gradient background in CSS (preferred) instead of heavy images.
  - If using images, keep them low-contrast and optimized (webp/avif).

---

## Implementation notes (to keep the look consistent)
- Prefer **semantic tokens** (e.g., `--surface-panel`) over raw colors in components.
- One component = one surface style; do not invent new shadows/radii per component.
- Keep microcopy short and calm (“Loading catalog…”, “No lessons yet.”).

