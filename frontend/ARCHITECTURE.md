# Frontend architecture

## Route hierarchy

| Route | Component | Purpose |
|-------|-----------|---------|
| `/` | `CatalogRoute` | Course list |
| `/course/:courseId` | `CourseExperienceRoute` | Legacy tab UI or hierarchy overview |
| `/course/:courseId/module/:moduleId` | `ModuleExperienceRoute` | Module README + lesson list |
| `/course/:courseId/module/:moduleId/lesson/:lessonId` | `LessonWorkspaceRoute` | Lesson explanation + drawer |

### Lesson workspace drawer (URL state)

- `?drawer=quiz&quiz=<id>` — quiz session in right drawer
- `?drawer=project&project=<id>` — project workspace in drawer
- `?drawerTab=files|delivery` — project drawer tab

Legacy courses (`structure: "legacy"`) keep the flat tab layout and `ContentReaderDialog` modal.

## Score and deliverables

- Score file: `course/<courseSlug>/quiz/score.json` (one file per course)
- Progress keys (localStorage): `${courseId}:quiz:${lessonId|_}:${quizId}` and `${courseId}:project:${lessonId|_}:${projectId}`
- Score file storage keys use `${lessonId}/${id}` when scoped to a lesson
- Dev API plugins validate course slugs (`javascript`) and hierarchy `rootPath` values

## Manual checklist (lesson workspace)

1. Open `/course/javascript` — module cards appear
2. Open a module — lesson cards with progress bars
3. Open a lesson — explanation visible in main pane
4. Click a project — drawer opens; explanation remains visible; scroll position preserved
5. Switch drawer tabs (Files, Delivery) — main pane unchanged
6. Complete quiz in drawer — results shown; explanation still visible
7. Reload page — drawer state restored from URL; progress syncs from `score.json`
