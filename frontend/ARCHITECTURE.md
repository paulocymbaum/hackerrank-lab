# Frontend Architecture (React + Zustand, 3 layers)

This folder is a **future frontend** for this repo. For now, it is designed to **load the current project statically** (no backend, no runtime integration, no auth) so you can build the UI and state management safely before wiring it to real data sources.

## Goal (right now)
- **Render the existing course/project content statically** (e.g., from a JSON manifest committed to the repo).
- Keep the design **integration-friendly** so swapping the static loader for a real loader later is a small change.

## Non-goals (for now)
- No server-side API integration.
- No filesystem reads in the browser (the browser can’t read your repo directly).
- No deployment/pipeline assumptions.

---

## The 3 layers

### 1) Presentation layer (UI)
**Responsibility**: Display data and capture user intent.

- **Contains**: React components, pages/routes, UI-only hooks, view models (derived props), styling.
- **Does not contain**: Fetching logic, persistence logic, business rules, Zustand store mutation logic outside of actions.

Typical elements:
- `pages/` or `routes/` (top-level screens)
- `components/` (reusable UI)
- `ui/` (design system primitives)

Key rules:
- Keep components **pure** when possible: input props → render.
- Components can call `useStore(...)` selectors, but prefer selecting **already-shaped** data from the Application layer.

### 2) Application layer (state + use-cases)
**Responsibility**: Orchestrate user flows, manage client state, and expose actions.

- **Contains**:
  - Zustand stores (slices) and actions
  - use-cases (functions that implement app behavior)
  - selectors and derived state
  - app-level hooks like `useCourseCatalog()` (thin wrappers around store/use-cases)
- **Does not contain**:
  - UI rendering concerns
  - low-level IO details (HTTP, localStorage, file formats) beyond calling the Infrastructure layer

Zustand guidance:
- Treat stores as the **application boundary**: the UI asks for state and triggers actions.
- Keep actions small and predictable; prefer “command-style” methods like `loadCatalog()`, `selectProject(id)`.
- Centralize shaping/normalization here so UI stays simple.

### 3) Infrastructure layer (IO + adapters)
**Responsibility**: Provide concrete implementations for data access and persistence.

- **Contains**:
  - static data loaders (e.g., `catalog.json` loader)
  - adapters for future integrations (HTTP clients, storage, etc.)
  - data mapping helpers (DTO ↔ domain)
- **Does not contain**:
  - UI code
  - Zustand stores

This is where you’ll later swap:
- `StaticCatalogRepository` → `ApiCatalogRepository`
- `InMemoryPreferencesStore` → `LocalStoragePreferencesStore`

---

## Suggested folder structure

```text
frontend/
  ARCHITECTURE.md
  src/
    presentation/
      routes/
      components/
      ui/
    application/
      stores/
      usecases/
      selectors/
    infrastructure/
      repositories/
      static/
      storage/
    domain/
      models/
      types/
```

Notes:
- `domain/` is optional but recommended. It keeps core types stable while the UI and data sources evolve.
- If you prefer fewer folders, you can merge `domain/` into `application/` early on and split later.

---

## Static loading approach (not integrated yet)

Because the frontend can’t “read the repo” at runtime, static loading should come from **committed assets**, for example:

- `frontend/src/infrastructure/static/catalog.json`
  - a manifest describing the courses, projects, and key paths you want to display.

Example shape (illustrative only):

```json
{
  "courses": [
    {
      "id": "01-javascript-fundamentals",
      "title": "JavaScript Fundamentals",
      "projects": [
        {
          "id": "001-cli-input-validator",
          "readmePath": "course/01-javascript-fundamentals/projects/01-coercion-and-validation/001-cli-input-validator/README.md"
        }
      ]
    }
  ]
}
```

Then:
- Infrastructure loads the JSON (and later could fetch it).
- Application normalizes it into stable models and stores it in Zustand.
- Presentation renders lists/detail pages using selectors.

---

## Contracts between layers

### Data access via repositories (recommended)
Define interfaces in Application/Domain:
- `CatalogRepository.getCatalog(): Promise<Catalog>`

Implement in Infrastructure:
- `StaticCatalogRepository` reads the committed JSON asset.

The store/use-case depends on the interface, not the implementation:
- `loadCatalog(repository)` or `createCatalogStore({ catalogRepository })`

### Error handling
- Infrastructure should return typed errors or throw domain-friendly errors.
- Application decides what the UI needs (loading states, error messages).
- UI only renders based on state: `idle | loading | ready | error`.

---

## Minimal checklist
- [ ] UI never imports from `infrastructure/` directly (only Application).
- [ ] Stores/actions never import from `presentation/`.
- [ ] Infrastructure never imports from `presentation/` or Application stores.
- [ ] Static loader is replaceable without rewriting UI components.

