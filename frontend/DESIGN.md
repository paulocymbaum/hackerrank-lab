# Design (Apple-like, tinted glass UI)

Calm typography, strong hierarchy, generous whitespace, and **tinted glass surfaces** with stable contrast (not clear glassmorphism).

## Design goals
- **Clarity first**: content is primary.
- **Soft depth**: tinted fill + blur + hairline borders.
- **High legibility**: opaque enough panels for WCAG-friendly contrast.
- **Fast scanning**: consistent spacing and progressive disclosure.

## Information architecture

- **Catalog**: card grid per module (title, example/project/quiz counts, “See course”). Cards are fully clickable for faster entry.
- **Course**: README / Examples / Projects / **Quiz** tabs (Radix Tabs, URL-synced via `?tab=`).
- **Reader**: overlay dialog (Radix Dialog) with Explanation / Folders (projects only) / Files.
- **Quiz**: list → session (`?tab=quiz&quiz=:id`) → results; progress stored in localStorage.

## Interaction
- Hit targets **≥ 44px** on primary controls (`Button` md, tab triggers).
- Visible focus rings; keyboard: Escape closes reader; skip link in shell.
- Motion respects `prefers-reduced-motion`.

## Visual language: colored glass

- **Background**: soft indigo gradient wallpaper (`foundation/base.css`, pseudo-element — no `background-attachment: fixed` on mobile).
- **Panels**: `--surface-panel` (tinted fill + blur + border + shadow).
- **Controls**: `--surface-control` (more opaque than panels).
- **Feedback** (quiz): dedicated success/danger tints — never raw `#10b981` / `#e11d48` fills at full opacity on glass.

---

## Design tokens

CSS custom properties live under `presentation/design-system/tokens/`:

| File | Contents |
|------|----------|
| `colors.css` | `--bg-0`, `--text-*`, `--accent-*`, glass fills, **feedback palette** |
| `typography.css` | `--fs-0`…`--fs-4`, line heights, font stack |
| `spacing.css` | `--space-1`…`--space-6` |
| `radius.css` | `--r-1`, `--r-2`, `--r-pill` |
| `effects.css` | blur, shadows |
| `semantic.css` | surfaces + **quiz feedback aliases** |

### Feedback tokens (quiz + status)

Base colors in `colors.css` (per theme):

| Token | Purpose |
|-------|---------|
| `--success-border` | Hairline on correct option / success panel |
| `--success-fill` | Tinted glass background (correct) |
| `--success-text` | Headline / label on success surfaces |
| `--success-icon` | Check icon accent |
| `--danger-border` | Hairline on wrong selection |
| `--danger-fill` | Tinted glass background (incorrect) |
| `--danger-text` | Headline / label on error surfaces |
| `--danger-icon` | X icon accent |
| `--neutral-muted-fill` | Unselected options after check |

Semantic aliases in `semantic.css`:

| Alias | Maps to |
|-------|---------|
| `--surface-success` | `--success-fill` |
| `--surface-danger` | `--danger-fill` |
| `--surface-muted` | `--neutral-muted-fill` |
| `--border-success` | `--success-border` |
| `--border-danger` | `--danger-border` |
| `--text-on-success` | `--success-text` |
| `--text-on-danger` | `--danger-text` |

Tailwind utilities: `bg-successFill`, `border-successBorder`, `text-successText`, `text-successIcon`, and the matching `danger*` set. **Use these in quiz UI** — not `bg-success0/10` or ad-hoc opacity on `--success-0`.

---

## Quiz feedback (correct / incorrect)

Feedback appears **after** the student clicks **Check answer**. Color carries meaning; icons reinforce state for color-blind users.

### Option states

| State | When | Border | Fill | Badge | Notes |
|-------|------|--------|------|-------|-------|
| **Default** | Before check, not selected | `--border-0` | `--surface-panel` | Option letter (`a`, `b`, …) | Hover: slight brightness |
| **Selected** | Before check, picked | `--accent-0` @ 50% | `--surface-control` | Letter | Primary focus ring |
| **Correct** | After check | `--border-success` | `--surface-success` | ✓ (Lucide `CheckCircle2`) | Always shown on the right answer |
| **Incorrect** | After check, wrong pick | `--border-danger` | `--surface-danger` | ✗ (Lucide `XCircle`) | Only the student’s wrong choice |
| **Muted** | After check, other options | `--border-0` | `--surface-muted` | Letter, reduced opacity | Not distracting |

Rules:
- On a **wrong** answer, highlight **both** the incorrect selection and the **correct** option (student sees the right answer).
- Do not animate option colors; keep transitions subtle (`prefers-reduced-motion` safe).
- Explanation block mirrors outcome: success tint + “Correct” or danger tint + “Not quite — review the explanation”.

### Explanation panel

| Outcome | Classes (Tailwind) | Copy |
|---------|-------------------|------|
| Correct | `border-successBorder bg-successFill`, `text-successText` | “Correct” |
| Incorrect | `border-dangerBorder bg-dangerFill`, `text-dangerText` | “Not quite — review the explanation” |

Body text inside the panel uses normal `MarkdownView` styling (`text-text0` on tinted fill).

### Results screen (end of quiz)

Score tier drives panel tint (not binary pass/fail only):

| Score | Tier | Panel treatment |
|-------|------|-----------------|
| ≥ 80% | Success | `--surface-success` / `--border-success`, trophy icon `--icon-success` |
| 50–79% | Neutral | `--surface-panel`, accent icon |
| &lt; 50% | Danger | `--surface-danger` / `--border-danger`, trophy icon `--icon-danger` |

---

## Design system layout

```text
design-system/
  tokens/           # CSS variables
  foundation/       # base.css (body, wallpaper, focus)
  components/       # Button, Card, Accordion, Tabs, Dialog, Icon
  patterns/         # LoadingState, EmptyState, ErrorPanel
  index.ts          # barrel exports
  index.css         # entry (imported once in main.tsx)
```

Rules:
- Design system components are **stateless** (props only).
- Use **Lucide** icons via `Icon` wrapper.
- **Radix UI** for Dialog and Tabs (accessibility).

---

## Core components

| Component | Role |
|-----------|------|
| `Card` | Tinted glass panel |
| `Button` | primary / secondary / ghost; sm (36px) for dense UI, md (44px) default |
| `Tabs` | Course and reader tab bars |
| `Dialog` | Content reader overlay |
| `Accordion` | Progressive disclosure inside courses (optional grouping) |
| `LoadingState` | Skeleton + calm copy |
| `EmptyState` | Friendly empty + optional CTA |
| `ErrorPanel` | Compact error + retry (`text-danger0` for system errors, not quiz answers) |

Quiz-specific UI lives in `features/quiz/` and **must** use feedback tokens above.

---

## Public assets

- `public/favicon.svg`
- `public/site.webmanifest`

---

## Implementation notes
- Prefer semantic tokens (`surface-panel`, `surface-success`) over raw colors in components.
- One accent family (indigo) on wallpaper; cyan only as link/highlight in markdown.
- **Quiz success/danger** use the feedback token set — separate from `ErrorPanel` (load failures) and `danger0` text in alerts.
- Microcopy: short and calm (“Loading catalog…”, “Pick a file to preview.”).

See [`ARCHITECTURE-FRONT.md`](./ARCHITECTURE-FRONT.md) for navigation flows.
