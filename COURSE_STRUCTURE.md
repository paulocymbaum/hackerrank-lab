# Estrutura do ambiente de aprendizado (JavaScript)

Este documento descreve a **hierarquia canônica** de conteúdo sob `course/`.

```
Course > Module > Lesson > (explanation, projects, quiz)
```

O grafo em `graph/course.graph.txt` é a fonte de verdade para taxonomia. Cada entidade no disco deve ter `graphIndex` em seu `*.meta.json`.

Schemas detalhados: [docs/meta-schemas.md](docs/meta-schemas.md)

## Visão geral

- **`course/<course-slug>/`**: um curso por root do grafo (ex.: `javascript`)
- **`modules/<NN-slug>/`**: módulo alinhado a seção do grafo (`01`–`07`)
- **`lessons/<graphIndex>-<slug>/`**: lesson = folha do grafo (`01.8.1`, `03.1.2`)
- Cada lesson contém explicação, projetos e quiz opcionais

## Árvore de diretórios (modelo)

```text
course/
  javascript/
    README.md
    course.meta.json
    modules/
      01-javascript-fundamentals/
        README.md
        module.meta.json
        lessons/
          01.8.1-truthy-vs-falsy/
            README.md              # explicação (predict-first)
            lesson.meta.json
            .cursor-created.json
            projects/
              README.md
              001-cli-input-validator/
                README.md
                starter/index.js
                solution/
            quiz/
              quiz.json
      02-objects-references-and-copying/
        ...
```

## Contrato por entidade

### Curso (`course/<slug>/`)

- `README.md` — visão geral do curso
- `course.meta.json` — `{ id, graphRootLabel, title }`

### Módulo (`modules/<NN-slug>/`)

- `README.md` — motivação, mapa de lessons, checklist agregado
- `module.meta.json` — `{ id, graphIndex, graphNodeId, title }`
- `lessons/` — pastas de lesson (folhas do grafo)
- `quiz/` (opcional) — quiz de módulo (fallback legado)

### Lesson (`lessons/<graphIndex>-<slug>/`)

- `README.md` — explicação detalhada (predict-first, pitfalls, mini-desafio)
- `lesson.meta.json` — `{ id, graphIndex, graphNodeId, title, prerequisites, status }`
- `projects/` (opcional) — projetos PBL escopados à lesson
- `quiz/` (opcional) — avaliação da lesson

## Padrão PBL para projetos

O `README.md` de cada projeto segue o contrato canônico em inglês: [`.cursor/skills/create-course-project/reference.md`](.cursor/skills/create-course-project/reference.md).

Numeração de projetos (`NNN`) é **sequencial dentro da lesson** (`001`, `002`, …).

### Arquivos em `starter/`

| Arquivo | Papel |
|---------|-------|
| `index.js` | Scaffold incompleto — importar na entrega; o aluno completa a solução |
| `tests.json` | Casos de validação — aba Delivery **Executar resposta** (matriz Pass/Fail) |
| `sample.input` | Exemplo de stdin para `node starter/index.js < starter/sample.input` |

O starter **não** resolve o problema; `tests.json` define a saída esperada. Contrato completo: [`.cursor/skills/create-course-project/reference.md`](.cursor/skills/create-course-project/reference.md).

### Visão da lesson (`projects/README.md`)

Template: [`.cursor/skills/create-course-project/templates/lesson-projects-readme.md`](.cursor/skills/create-course-project/templates/lesson-projects-readme.md)

## Convenções de nomenclatura

- **Kebab-case** para pastas
- **Lesson id**: `{graphIndex}-{slug}` → `01.8.1-truthy-vs-falsy`
- **Módulo**: `NN-kebab-case` → `01-javascript-fundamentals`
- **Projeto**: `NNN-kebab-case` → `001-cli-input-validator`

## Estrutura legada (compat)

Pastas flat `course/NN-*` (sem `modules/lessons/`) ainda são suportadas pelo catálogo via compat layer. Novo conteúdo deve usar a hierarquia canônica.

## Ferramentas de authoring

| Ação | Comando |
|------|---------|
| Scaffold do grafo | `node scripts/graph/scaffold-from-graph.mjs "01.8.1"` |
| Scaffold módulo + folhas | `node scripts/graph/scaffold-from-graph.mjs --module "01"` |
| Mapa grafo↔disco | `node scripts/graph/generate-content-map.mjs` |
| Validar lesson | `node scripts/validate-lesson.mjs --lesson <path>` |
| Validar módulo | `node scripts/validate-module.mjs --module <id>` |
| Gerar catálogo | `cd frontend && npm run catalog:generate` |

## Ambiente JavaScript

Opcionalmente, manter instruções de execução no README do curso:

- Node.js (LTS)
- `node starter/index.js` por projeto
- Aba Delivery no frontend para entregas
