import { describe, expect, it } from "vitest";
import type { QuizQuestion } from "./types/quiz";
import { embaralharArray, embaralharPerguntasQuiz } from "./embaralharOpcoesQuiz";

const perguntaExemplo: QuizQuestion = {
  id: "q1",
  prompt: "Pergunta?",
  correctOptionId: "b",
  options: [
    { id: "a", text: "A" },
    { id: "b", text: "B" },
    { id: "c", text: "C" },
  ],
};

describe("embaralharArray", () => {
  it("preserva todos os elementos", () => {
    const original = [1, 2, 3, 4];
    const embaralhado = embaralharArray(original, () => 0.99);

    expect(embaralhado.sort()).toEqual(original.sort());
  });

  it("permite ordem determinística via gerador", () => {
    const sequencia = [0, 0, 0];
    let indice = 0;
    const embaralhado = embaralharArray(["a", "b", "c"], () => sequencia[indice++]);

    expect(embaralhado).toEqual(["b", "c", "a"]);
  });
});

describe("embaralharPerguntasQuiz", () => {
  it("embaralha opções de cada pergunta sem alterar metadados", () => {
    const perguntas = embaralharPerguntasQuiz([perguntaExemplo], () => 0);

    expect(perguntas).toHaveLength(1);
    expect(perguntas[0].id).toBe("q1");
    expect(perguntas[0].correctOptionId).toBe("b");
    expect(perguntas[0].options.map((o) => o.id).sort()).toEqual(["a", "b", "c"]);
    expect(perguntas[0].options.map((o) => o.id)).not.toEqual(["a", "b", "c"]);
  });
});
