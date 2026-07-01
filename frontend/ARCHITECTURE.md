# Frontend architecture

Technical reference for routes, layers, and scores. For navigation UX and student journey, see [`ARCHITECTURE-FRONT.md`](./ARCHITECTURE-FRONT.md).

## Route hierarchy

| Route | Component | Purpose |
|-------|-----------|---------|
| `/` | `CatalogRoute` | Course list (default tab) |
| `/?tab=content-map` | `CatalogRoute` → `ContentMapPanel` | Curriculum mind map with scores and collapsible branches |
| `/course/:courseId` | `CourseExperienceRoute` | Branches: hierarchy overview or legacy tabs |
| `/course/:courseId/module/:moduleId` | `ModuleLayoutRoute` | Module shell: drawer + outlet |
| `/course/:courseId/module/:moduleId` (index) | `ModuleExperienceRoute` | Module README |
| `/course/:courseId/module/:moduleId/lesson/:lessonId` | `LessonWorkspaceRoute` | Lesson explanation + activity drawer |

### Lesson workspace drawer (URL state)

- `?drawer=quiz&quiz=<id>` — quiz session in drawer (`QuizHost` layout `drawer`)
- `?drawer=project&project=<id>` — project workspace in drawer (`ProjectReader` layout `drawer`)
- `?drawerTab=files|delivery` — project drawer tab

When a quiz or project drawer is open, the main explanation pane is hidden; the drawer occupies the main column on desktop.

### Module-level quiz

- `?quiz=<id>` on module route — full-page `QuizHost` layout `page`

### Legacy courses

Courses with `structure: "legacy"` use flat tabs and `ContentReaderDialog` overlay. Mounted in `AppLayout` only when `course.structure === "legacy"`. See `features/course-legacy/`.

## Layer structure

```text
frontend/src/
  domain/types/           # catalog, quiz, navigation, reader
  domain/repositories/    # CourseScoreRepository interface
  application/
    hooks/                # useCourseRouteData, useQuizSessionFromUrl, useAppNavigation
    navigation/           # estrategiaHierarquia, estrategiaLegacy
    stores/               # catalog, quiz session, quiz progress, project progress
    stores/legacy/        # contentReaderStore, courseExperienceStore
    selectors/
    usecases/
  infrastructure/
    repositories/
    static/catalog.json
    static/content-graph.json
  presentation/
    app/                  # AppRouter, AppLayout
    features/             # catalog, course-experience, course-legacy, module-experience, etc.
    shared/               # ReadmePanel, AsyncRouteBoundary, MarkdownView
    design-system/
```

## Score and deliverables

- Score file: `course/<courseSlug>/quiz/score.json` (one file per course)
- Progress keys (localStorage): `${courseId}:quiz:${lessonId|_}:${quizId}` and `${courseId}:project:${lessonId|_}:${projectId}`
- Score file storage keys use `${lessonId}/${id}` when scoped to a lesson
- Dev API plugins validate course slugs (`javascript`) and hierarchy `rootPath` values

## Manual checklist (hierarchy)

1. Open `/course/javascript` — module cards appear
2. Open a module — side drawer shows sections, lessons, quiz/project links
3. Open a lesson — explanation visible in main pane
4. Click a project — drawer opens; main explanation hidden; lesson progress stays in drawer footer
5. Switch drawer tabs (Files, Delivery) — drawer content updates
6. Complete quiz in drawer — results shown; close returns to lesson explanation
7. Reload page — drawer state restored from URL; progress syncs from `score.json`
8. Module quiz (`?quiz=`) — full-page quiz; back returns to module README

## Manual checklist (legacy, if present in catalog)

1. Tabs README / Examples / Projects / Quiz work
2. `ContentReaderDialog` opens from Examples/Projects; Escape closes and restores tab
3. Project delivery panel works in overlay
