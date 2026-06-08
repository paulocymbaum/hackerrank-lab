# Frontend Architecture (React + Zustand, 3 layers)

This folder is the **study UI** for the repo. It loads course content from a **static catalog** (`catalog.json`) generated from `course/`. No backend or auth for now; the structure supports swapping the data source later.

## Goal
- Render modules, examples, and PBL projects with **fluid navigation** (catalog → course → reader).
- Keep **layer boundaries** so UI, state, and IO evolve independently.

## Non-goals (for now)
- Server-side API integration.
- Filesystem reads in the browser.
- Deployment assumptions.

---

## The 3 layers

### 1) Presentation (`src/presentation/`)
**Responsibility**: Display data and capture user intent.

```text
presentation/
  app/                    # App.tsx, AppRouter, AppLayout
  features/               # Feature modules (catalog, course-experience, content-reader, shell)
  shared/                 # MarkdownView, Breadcrumb, path utils
  design-system/          # Tokens, primitives, patterns (no stores)
```

Rules:
- Components import from `application/` hooks/stores and `domain/` types only — **never** `infrastructure/`.
- Feature routes are thin orchestrators; subcomponents receive props when possible.

### 2) Application (`src/application/`)
**Responsibility**: Orchestrate flows, client state, selectors, use-cases.

```text
application/
  stores/                 # Zustand: navigation, catalog, course experience, content reader
  usecases/               # loadCatalog, navigateWithCleanup
  selectors/              # getCourseById, lessonToReaderItem, …
  hooks/                  # useCatalog, useCourse, useAppNavigation, …
```

### 3) Infrastructure (`src/infrastructure/`)
**Responsibility**: Concrete IO (static JSON today; API later).

```text
infrastructure/
  repositories/
    staticCatalogRepository.ts
  static/
    catalog.json          # generated — run npm run catalog:generate
```

### Domain (`src/domain/`)
Stable types and repository interfaces:

```text
domain/
  types/                  # catalog, navigation, reader
  repositories/           # CatalogRepository interface
```

---

## Feature modules

| Module | Route | Store(s) |
|--------|-------|----------|
| **Shell** | layout wrapper | — |
| **Catalog** | `/` | `courseCatalogStore` |
| **Course experience** | `/course/:courseId?tab=` | `courseExperienceStore` |
| **Content reader** | query `?reader=&readerTab=` | `contentReaderStore` |

Navigation uses **React Router** with URL-synced tabs and reader state. `navigateWithCleanup` closes the reader when leaving a course or returning to the catalog.

---

## Static catalog pipeline

```text
course/  →  npm run catalog:generate  →  catalog.json  →  staticCatalogRepository  →  courseCatalogStore
```

Regenerate after editing content under `course/`.

---

## Checklist
- [x] UI never imports from `infrastructure/` directly.
- [x] Stores never import from `presentation/`.
- [x] Infrastructure never imports stores or UI.
- [x] Design system has no Zustand or feature imports.
- [x] Reader closes on top-level navigation changes.

See also: [`ARCHITECTURE-FRONT.md`](./ARCHITECTURE-FRONT.md) (student journey), [`DESIGN.md`](./DESIGN.md) (visual system).
