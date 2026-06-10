# Hackerrank Study

Ambiente de **autoestudo** para programação e preparação para testes no estilo HackerRank. O repositório combina conteúdo curado em Markdown, quizzes interativos, projetos práticos (PBL) e um frontend de navegação — tudo pensado para ser usado com o **Cursor Agent** como tutor, revisor e assistente de autoria.

## Objetivo

Preparar você para resolver desafios de código com confiança, não apenas decorar respostas. O material segue uma taxonomia explícita (grafo de tópicos), explicações no formato **predict-first** (prever antes de executar), armadilhas comuns e exercícios que simulam o que aparece em entrevistas e plataformas como HackerRank.

Cada lição cobre um tópico atômico; módulos agrupam temas relacionados; o curso JavaScript mapeia desde fundamentos até assincronismo e além.

## O que há neste repositório

| Parte | Descrição |
|-------|-----------|
| [`course/`](course/) | Conteúdo de estudo: explicações, projetos e quizzes |
| [`graph/course.graph.txt`](graph/course.graph.txt) | Mapa mental (fonte de verdade) da taxonomia do curso |
| [`frontend/`](frontend/) | App web para navegar catálogo, lições, quizzes e projetos |
| [`.cursor/skills/`](.cursor/skills/) | Skills do Cursor Agent — fluxos guiados para estudar, criar e revisar conteúdo |

Hierarquia canônica do conteúdo:

```text
Curso → Módulo → Lição → (explicação, projetos, quiz)
```

Detalhes em [`COURSE_STRUCTURE.md`](COURSE_STRUCTURE.md).

## Como usar como módulo de autoestudo

### 1. Subir o ambiente local

```bash
cd frontend
npm install
npm run catalog:generate   # sincroniza course/ → catálogo estático
npm run dev
```

Abra a URL exibida no terminal (em geral `http://localhost:5173`).

### 2. Percorrer o conteúdo

Fluxo recomendado por lição:

1. **Catálogo** → escolha o curso (ex.: JavaScript)
2. **Módulo** → leia o README do módulo e veja o mapa de lições
3. **Lição** → leia a explicação; faça o mini-exercício *predict-first* antes de rodar o código
4. **Quiz** → abra o quiz da lição e responda; leia as explicações das alternativas
5. **Projeto (PBL)** → implemente em `starter/index.js`, teste com Node.js e registre a entrega na aba **Delivery**

Rotas principais (fluxo `hierarchy`):

```text
/                                                          → Catálogo
/course/javascript                                         → Visão geral do curso
/course/javascript/module/01-javascript-fundamentals       → Módulo
/course/javascript/module/.../lesson/01.8.1-truthy-vs-falsy → Lição
  ?drawer=quiz&quiz=<id>                                   → Quiz no drawer
  ?drawer=project&project=<id>                             → Projeto no drawer
```

Progresso de quiz e projetos é salvo localmente no navegador; scores agregados ficam em `course/<curso>/quiz/score.json`.

### 3. Estudar com o Cursor Agent

Abra este repositório no **Cursor**, inicie o Agent (Chat) e use as **skills** descritas abaixo. Elas ensinam o agente *como* agir — quais scripts rodar, quais regras seguir e qual tom usar — em vez de improvisar a cada conversa.

### 4. Ritmo sugerido

- Uma lição por sessão curta, ou meio módulo por sessão longa
- Sempre **prever** a saída antes de executar exemplos
- Refazer quizzes com score baixo após revisar a explicação
- Nos projetos, iterar até score **> 80** na revisão (critério de aprovação)

---

## Como funcionam as Skills do Cursor

Skills ficam em [`.cursor/skills/<nome>/SKILL.md`](.cursor/skills/). Cada skill define:

- **Quando usar** — gatilhos descritos no frontmatter (`description`)
- **Comportamento** — passos, checklists e restrições
- **Scripts** — comandos que o agente deve executar no terminal

### Invocação automática vs manual

Algumas skills têm `disable-model-invocation: true`. Isso significa que o agente **não** as escolhe sozinho; você precisa pedir explicitamente (mencionar o nome da skill ou usar `@` no chat do Cursor para anexá-la).

| Skill | Invocação | Público |
|-------|-----------|---------|
| `teacher-socratic` | Manual | Estudantes |
| `find-topics-graph` | Manual | Estudantes e autores |
| `review-course-project` | Manual | Estudantes |
| `create-course-module` | Manual | Autores |
| `generate-lesson-teacher` | Manual | Autores |
| `create-course-project` | Automática ou manual | Autores |
| `create-course-quiz` | Automática ou manual | Autores |

### Dicas para promptar o agente

- **Seja específico** — cite curso, módulo, lição ou caminho do projeto quando souber
- **Uma intenção por mensagem** — aprender, revisar entrega ou criar conteúdo são fluxos diferentes
- **Anexe a skill** — no Cursor, digite `@` e selecione a skill (ex.: `@teacher-socratic`) ou escreva “use a skill `teacher-socratic`”
- **Skills manuais** — sempre nomeie a skill; o agente não as ativa por contexto sozinho
- **Não peça a solução completa** se estiver usando `teacher-socratic` — essa skill foi feita para guiar com perguntas e dicas

---

## Skills para estudantes

### `teacher-socratic` — Tutor socrático

Ajuda a **aprender conceitos** com perguntas, diagramas e uma escada de dicas — sem entregar a solução pronta de imediato. Persona inspirada em “Deep Thought”: calmo, visual e interativo.

**Quando usar:** dúvidas teóricas, travou em um exercício, quer entender *por quê* algo funciona.

**Exemplos de prompt:**

```text
@teacher-socratic Estou na lição 01.8.1 truthy vs falsy. Por que [] é truthy?
```

```text
Use a skill teacher-socratic: estou no projeto 001-cli-input-validator e não entendo
como validar string vazia sem usar ==. Me dê uma dica, não a solução.
```

```text
@teacher-socratic Explique o event loop com um diagrama simples antes de falar de microtasks.
```

---

### `find-topics-graph` — Localizar tópicos no grafo

Busca tópicos em [`graph/course.graph.txt`](graph/course.graph.txt), mostra pré-requisitos, filhos e se já existe conteúdo no disco.

**Quando usar:** “onde aprendo X?”, “o que vem antes de Promises?”, planejar ordem de estudo.

**Exemplos de prompt:**

```text
@find-topics-graph Onde fica "Async/Await" no grafo e quais lições existem no disco?
```

```text
Use find-topics-graph: liste os subtópicos de "03 Asynchronous JavaScript".
```

```text
@find-topics-graph Qual o graphIndex de "Strict Equality" e qual lição corresponde?
```

---

### `review-course-project` — Revisar entrega de projeto

Avalia sua implementação contra o README do projeto e a lição. Gera **score 0–100** e comentário curto; score **> 80** marca o projeto como concluído.

**Quando usar:** terminou (ou quer feedback parcial) em um projeto PBL.

**Exemplos de prompt:**

```text
@review-course-project Revise meu projeto
course/javascript/modules/01-javascript-fundamentals/lessons/01.8.1-truthy-vs-falsy/projects/001-cli-input-validator
```

```text
Use a skill review-course-project para corrigir a entrega mais recente do projeto
001-cli-input-validator e salvar o review.
```

```text
@review-course-project Avalie starter/index.js do projeto 019-access-gate-validator
e diga o que falta para passar de 80 pontos.
```

---

## Skills para autores de conteúdo

Se você mantém ou expande o curso (não apenas estuda), use estas skills.

### `create-course-module` — Criar módulo e lições vazias

Scaffold de pastas a partir do grafo para uma seção inteira (ex.: módulo `01`).

**Exemplos de prompt:**

```text
@create-course-module Faça scaffold do módulo 02 Objects, References and Copying (dry-run primeiro).
```

---

### `generate-lesson-teacher` — Gerar conteúdo de uma lição

Cria ou atualiza explicação e estrutura de projetos para **uma** lição, seguindo `COURSE_STRUCTURE.md`.

**Exemplos de prompt:**

```text
@generate-lesson-teacher Gere a explicação predict-first para a lição 01.4.2 Comparison Operators.
```

---

### `create-course-project` — Criar projeto PBL

Scaffold, README com critérios de aceite, `starter/index.js` e validação.

**Exemplos de prompt:**

```text
@create-course-project Crie o projeto 002 na lição 01.8.2-strict-equality:
"Record Filter" — filtrar registros com ===.
```

```text
Use create-course-project para validar todos os projetos da lição 01.6.1-for-loop.
```

---

### `create-course-quiz` — Criar ou atualizar quiz

Quiz JSON alinhado ao README da lição, com validação de schema.

**Exemplos de prompt:**

```text
@create-course-quiz Crie quiz.json para a lição 01.8.1-truthy-vs-falsy com 5 questões sobre falsy values.
```

```text
Use create-course-quiz para revisar o quiz da lição 03.1.2-event-loop e adicionar uma questão sobre ordem de saída.
```

---

## Estrutura resumida do repositório

```text
hackerrank-lab/
├── course/javascript/          # Curso principal
│   └── modules/<modulo>/lessons/<lição>/
│       ├── README.md           # Explicação
│       ├── projects/           # Projetos PBL
│       └── quiz/quiz.json      # Avaliação
├── graph/                      # Grafo e mapa de conteúdo
├── frontend/                   # App Vite + React
├── .cursor/skills/             # Skills do Agent
├── scripts/                    # Validação, grafo, catálogo
└── tests/                      # Testes do pipeline de conteúdo
```

## Comandos úteis

```bash
# Raiz — testes do pipeline de conteúdo e grafo
npm test

# Frontend — desenvolvimento
cd frontend && npm run dev

# Regenerar catálogo após editar course/
cd frontend && npm run catalog:generate

# Testes do frontend
cd frontend && npm test
```

## Documentação adicional

- [`COURSE_STRUCTURE.md`](COURSE_STRUCTURE.md) — contrato de pastas e metadados
- [`frontend/ARCHITECTURE-FRONT.md`](frontend/ARCHITECTURE-FRONT.md) — jornada do aluno na UI
- [`frontend/ARCHITECTURE.md`](frontend/ARCHITECTURE.md) — rotas e camadas técnicas
- [`.cursor/rules/course-hierarchy.mdc`](.cursor/rules/course-hierarchy.mdc) — regras de hierarquia para o Agent

## Licença e contribuição

Este repositório é privado (`"private": true` nos `package.json`). Para propor conteúdo novo, siga o grafo em `graph/course.graph.txt` e as skills de autoria — nunca invente tópicos fora do nó correspondente no grafo.
