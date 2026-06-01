# Estrutura do ambiente de aprendizado (JavaScript)

Este documento descreve uma **estrutura de arquivos** cujo ponto de partida é a pasta `course/`.  
O objetivo é organizar o conteúdo em **módulos**, com **explicações detalhadas** em Markdown e **projetos práticos** (PBL) em uma pasta `projects/` por módulo, separados por tópicos e com **numeração sequencial**.

## Visão geral

- **`course/`**: raiz do curso.
- **Um módulo por pasta**: cada módulo possui conteúdo teórico (em Markdown) e um conjunto de exercícios práticos (PBL).
- **PBL (Project/Problem-Based Learning)**: cada exercício é escrito como um problema realista, com requisitos, restrições, critérios de aceite e entregáveis.
- **Numeração**:
  - Módulos: `01-...`, `02-...`, `03-...`
  - Tópicos (dentro de `projects/`): `01-...`, `02-...`
  - Exercícios (dentro de cada tópico): `001-...`, `002-...`, `003-...`

## Árvore de diretórios (modelo)

```text
course/
  00-welcome/
    README.md

  01-fundamentos-de-javascript/
    README.md
    examples/
      01-variaveis-e-tipos.md
      02-funcoes.md
      03-controle-de-fluxo.md
    projects/
      README.md
      01-sintaxe-e-estruturas/
        001-calculadora-cli/
          README.md
          starter/
            index.js
          solution/
            index.js
        002-validador-de-dados/
          README.md
          starter/
          solution/
      02-funcoes-e-modularizacao/
        003-biblioteca-de-utilidades/
          README.md
          starter/
          solution/

  02-qualidade-de-codigo-e-boas-praticas/
    README.md
    examples/
      01-clean-code-em-js.md
      02-validacao-e-erros.md
      03-lint-format-test.md
    projects/
      README.md
      01-lint-format/
        001-configurar-eslint-prettier/
          README.md
          starter/
          solution/
      02-testes/
        002-testes-unitarios-com-jest/
          README.md
          starter/
          solution/

  03-design-e-arquitetura/
    README.md
    examples/
      01-solid-em-js.md
      02-camadas-e-dependencias.md
      03-injecao-de-dependencias.md
    projects/
      README.md
      01-solid/
        001-refatorar-servico-de-pedidos/
          README.md
          starter/
          solution/
```

## Contrato de cada módulo

Cada pasta de módulo em `course/<NN-nome-do-modulo>/` deve conter:

- **`README.md`**: explicação **descritiva e detalhada** do conceito de engenharia de software aplicado ao JavaScript.
  - Deve incluir:
    - Motivação (por que isso importa na prática)
    - Definições e termos
    - Anti-padrões comuns e como evitá-los
    - Boas práticas e trade-offs
    - Checklist do que o aluno deve dominar
- **`examples/`** (opcional, recomendado): exemplos práticos em Markdown.
  - Cada arquivo `.md` deve conter:
    - Contexto do exemplo
    - Código (trechos pequenos e focados)
    - “O que observar” / pitfalls
    - Exercício rápido (mini-desafio)
- **`projects/`**: trilha de prática baseada em problemas.
  - **`projects/README.md`**: visão geral dos projetos do módulo e como executar.
  - Subpastas por **tópico**: `01-...`, `02-...`, etc.
  - Dentro de cada tópico, projetos numerados: `001-...`, `002-...`, etc.
- **`quiz/`** (opcional, recomendado): atividades de quiz por lição.
  - Um arquivo JSON por lição: `NN-nome.quiz.json` (espelha `examples/NN-nome.md`) ou `00-module-overview.quiz.json` para o `README.md` do módulo.
  - Cada arquivo contém **5–10** atividades alinhadas à estrutura da lição (stack-first, predict-first, tiers).
  - Gerar com a skill `.cursor/skills/generate-lesson-quiz/` e a ferramenta `add-lesson-quiz.js`.

## Padrão PBL para cada exercício (`projects/.../<NNN-nome>/README.md`)

O `README.md` de cada projeto deve seguir (no mínimo) esta estrutura:

- **Contexto do problema**: cenário realista (ex.: “um time precisa padronizar validação de inputs”).
- **Objetivo**: o que deve ser construído.
- **Requisitos funcionais**: lista objetiva do comportamento esperado.
- **Requisitos não-funcionais**: qualidade, legibilidade, performance, segurança, manutenibilidade.
- **Restrições**: bibliotecas permitidas/proibidas, limite de tempo, formato de I/O, etc.
- **Critérios de aceite**: itens verificáveis (checklist).
- **Dados de exemplo** (se aplicável): entradas e saídas esperadas.
- **Plano sugerido**: passos recomendados (sem entregar a solução).
- **Entregáveis**:
  - Código em `starter/` (base inicial) e/ou implementação final
  - (Opcional) `solution/` para referência
- **Extensões** (opcional): desafios extras para ir além.

## Convenções de nomenclatura

- **Kebab-case** para pastas: `02-qualidade-de-codigo-e-boas-praticas/`
- **Numeração fixa**:
  - Módulos: sempre 2 dígitos (`01`, `02`, `03`…)
  - Exercícios: sempre 3 dígitos (`001`, `002`, `003`…)
- **Títulos**: pastas e nomes devem descrever o resultado, não a tarefa genérica.
  - Bom: `001-calculadora-cli/`
  - Melhor: `002-validador-de-dados-de-cadastro/`

## Sugestão de “ambiente JavaScript” (como refletir na estrutura)

Opcionalmente, você pode manter um módulo `00-welcome/` com instruções mínimas para execução local:

- Node.js (LTS)
- npm/pnpm/yarn (um padrão por curso)
- Como executar scripts (ex.: `node index.js`)
- (Opcional) padrão de testes/lint por módulo (ex.: Jest/Vitest, ESLint, Prettier)

Se quiser padronizar execução por projeto, cada pasta `001-.../` pode conter:

- `starter/` com `package.json` local (quando fizer sentido) **ou**
- um `package.json` central por módulo em `course/<modulo>/` (quando os projetos compartilham dependências)

