# Arquitetura Frontend — Navegação Fluida para Estudo

Este documento descreve a **arquitetura modular** do frontend do Hackerrank Study, com foco em **como o aluno navega** pelo conteúdo sem perder contexto.

Complementa [`ARCHITECTURE.md`](./ARCHITECTURE.md) (rotas e camadas técnicas) e [`DESIGN.md`](./DESIGN.md) (linguagem visual).

---

## Objetivos

| Objetivo | O que significa na prática |
|----------|----------------------------|
| **Continuidade** | Breadcrumb e URL refletem catálogo → curso → módulo → lição. |
| **Progressive disclosure** | Visão geral primeiro; quiz, project e arquivos sob demanda (drawer ou overlay). |
| **Um padrão por atividade** | `QuizHost`, `ProjectReader` e `ReadmePanel` unificam shells. |
| **Modularidade** | Features em `presentation/features/` evoluem de forma independente. |
| **Substituibilidade** | Catálogo estático hoje; API e progresso via repositórios injetados. |

---

## Dois fluxos de estudo

O catálogo define `course.structure`:

| Estrutura | Fluxo | Entrada |
|-----------|-------|---------|
| **`hierarchy`** (padrão) | Rotas aninhadas + side drawer | `CourseOverviewRoute` → `ModuleLayoutRoute` |
| **`legacy`** | Abas flat + overlay | `LegacyCourseRoute` + `ContentReaderDialog` |

```mermaid
flowchart TD
  Catalog[CatalogRoute]
  CE[CourseExperienceRoute]
  CO[CourseOverviewRoute]
  ML[ModuleLayoutRoute]
  LW[LessonWorkspaceRoute]
  Legacy[LegacyCourseRoute]
  CRD[ContentReaderDialog]

  Catalog --> CE
  CE -->|hierarchy| CO
  CE -->|legacy| Legacy
  CO --> ML
  ML --> LW
  Legacy --> CRD
```

---

## Jornada hierarchy (fluxo primário)

```text
/                                    → Catálogo
/course/:courseId                    → Overview do curso (módulos)
/course/:courseId/module/:moduleId   → README do módulo + drawer de conteúdos
/course/:courseId/module/:moduleId/lesson/:lessonId → Explanation da lição
  ?drawer=quiz&quiz=<id>             → Quiz no drawer direito
  ?drawer=project&project=<id>       → Project no drawer
  ?drawerTab=files|delivery          → Aba do project no drawer
```

### Nível 1 — Catálogo

- [`CatalogRoute`](src/presentation/features/catalog/CatalogRoute.tsx)
- Lista cursos; ação **See course** → `/course/:courseId`

### Nível 2 — Overview do curso

- [`CourseOverviewRoute`](src/presentation/features/course-overview/CourseOverviewRoute.tsx)
- Cards de módulos com score; README do curso opcional

### Nível 3 — Módulo

- [`ModuleLayoutRoute`](src/presentation/features/module-experience/ModuleLayoutRoute.tsx) — shell com drawer
- [`ModuleExperienceRoute`](src/presentation/features/module-experience/ModuleExperienceRoute.tsx) — README do módulo
- [`ModuleContentsDrawer`](src/presentation/features/module-experience/components/ModuleContentsDrawer.tsx) — navegação por seções, lições, quiz e project
- Quiz de módulo: `?quiz=<id>` substitui o painel principal por [`QuizHost`](src/presentation/features/quiz/components/QuizHost.tsx) (`layout="page"`)

### Nível 4 — Lição

- [`LessonWorkspaceRoute`](src/presentation/features/lesson-workspace/LessonWorkspaceRoute.tsx)
- Painel central: explanation (`ReadmePanel`) quando drawer fechado
- Drawer aberto: quiz/project ocupam a coluna principal; explanation oculta
- Progress bar da lição: rodapé do side drawer (`LessonProgressFooter`)

---

## Jornada legacy (compatibilidade)

Cursos com `structure: "legacy"` (pastas flat sem `modules/` no gerador):

```text
/course/:courseId?tab=readme|examples|projects|quiz
/course/:courseId?tab=examples&reader=<path>  → ContentReaderDialog overlay
```

- [`LegacyCourseRoute`](src/presentation/features/course-legacy/LegacyCourseRoute.tsx) — abas README / Examples / Projects / Quiz
- [`ContentReaderDialog`](src/presentation/features/course-legacy/ContentReaderDialog.tsx) — overlay global montado em [`AppLayout`](src/presentation/app/AppLayout.tsx) quando `course.structure === "legacy"`

**Regra:** novas features vão apenas no fluxo hierarchy; legacy recebe apenas correções.

---

## Estado e stores

| Store / hook | Responsabilidade |
|--------------|------------------|
| React Router (`pathname`, `searchParams`) | Rota canônica; URLs compartilháveis |
| [`useAppNavigation`](src/application/hooks/useAppNavigation.ts) | Facade de navegação; delega para estratégias hierarchy/legacy |
| [`courseCatalogStore`](src/application/stores/courseCatalogStore.ts) | Catálogo + status de carga |
| [`quizSessionStore`](src/application/stores/quizSessionStore.ts) | Sessão ativa do quiz |
| [`quizProgressStore`](src/application/stores/quizProgressStore.ts) | Melhor score e tentativas (localStorage) |
| [`projectProgressStore`](src/application/stores/projectProgressStore.ts) | Status de entrega de projects |
| [`contentReaderStore`](src/application/stores/legacy/contentReaderStore.ts) | Overlay legacy: item, aba, cwd, arquivo |
| [`courseExperienceStore`](src/application/stores/legacy/courseExperienceStore.ts) | Tab persistida (legacy) |

---

## Arquitetura em camadas

```text
presentation/features/     → rotas e UI por domínio
presentation/shared/         → ReadmePanel, AsyncRouteBoundary, MarkdownView
application/hooks/           → useCourseRouteData, useQuizSessionFromUrl
application/navigation/      → estrategiaHierarquia, estrategiaLegacy
application/stores/        → Zustand (uma responsabilidade por store)
application/selectors/       → catalogSelectors, lessonProgress, quizSelectors
application/usecases/        → courseScores, loadCatalog, projectDeliveries
infrastructure/              → staticCatalogRepository, httpCourseScoreRepository
domain/types/                → contratos estáveis
```

**Regra:** `presentation/` importa apenas `application/` e `domain/`, nunca `infrastructure/` diretamente.

---

## Shells unificados

| Shell | Layouts | Usado em |
|-------|---------|----------|
| `QuizHost` | `page` \| `drawer` | Module quiz, lesson drawer, legacy tab |
| `ProjectReader` | `overlay` \| `drawer` | ContentReaderDialog, lesson drawer |
| `ReadmePanel` | `inline` \| `scroll` \| `card` | Lição, módulo, curso, explanation em projects |

---

## Pipeline de conteúdo

```text
course/ → npm run catalog:generate → catalog.json → courseCatalogStore
```

Após editar conteúdo em `course/`, regenerar o catálogo antes de `dev` ou `build`.

---

## Checklist de conformidade

- [ ] UI importa apenas `application/` e `domain/`
- [ ] Novo estado tem store ou hook dedicado com responsabilidade clara
- [ ] Cursos hierarchy: quiz/project via URL + drawer (sem overlay)
- [ ] Cursos legacy: overlay via `contentReaderStore` até remoção do gerador legacy
- [ ] Tipos novos em `domain/types/` antes da UI
- [ ] Conteúdo novo passa por `catalog:generate` antes do deploy

---

## Gate de remoção legacy

Remover `course-legacy/` somente quando:

1. `catalog.json` não contiver cursos `structure: "legacy"`
2. `generate-static-catalog.mjs` não emitir `loadLegacyModule`
3. Smoke manual do fluxo hierarchy cobrir 100% dos cursos publicados

---

## Mapa mental de arquivos

| Peça | Arquivo |
|------|---------|
| Composição raiz | `src/presentation/app/AppRouter.tsx`, `AppLayout.tsx` |
| Catálogo | `features/catalog/CatalogRoute.tsx` |
| Entrada do curso | `features/course-experience/CourseExperienceRoute.tsx` |
| Hierarchy | `features/course-overview/`, `module-experience/`, `lesson-workspace/` |
| Legacy | `features/course-legacy/` |
| Quiz | `features/quiz/QuizHost.tsx`, `QuizSessionPanel.tsx` |
| Navegação | `application/hooks/useAppNavigation.ts` |
| Catálogo (dados) | `application/stores/courseCatalogStore.ts` |

Para detalhes de rotas e scores, ver [`ARCHITECTURE.md`](./ARCHITECTURE.md). Para tokens visuais, ver [`DESIGN.md`](./DESIGN.md).
