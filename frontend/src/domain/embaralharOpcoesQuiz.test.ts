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
  it("embaralha opções e renumeria ids pela posição exibida", () => {
    const perguntas = embaralharPerguntasQuiz([perguntaExemplo], () => 0);

    expect(perguntas).toHaveLength(1);
    expect(perguntas[0].id).toBe("q1");
    expect(perguntas[0].options.map((o) => o.id)).toEqual(["a", "b", "c"]);
    expect(perguntas[0].options.map((o) => o.text)).toEqual(["B", "C", "A"]);
    expect(perguntas[0].correctOptionId).toBe("a");
  });

  it("distribui a resposta correta entre letras diferentes", () => {
    const sequencia = [0.99, 0.99, 0, 0.99, 0.99, 0];
    let indice = 0;
    const aleatorio = () => sequencia[indice++ % sequencia.length];

    const resultados = Array.from({ length: 30 }, () =>
      embaralharPerguntasQuiz([perguntaExemplo], aleatorio)[0].correctOptionId,
    );

    expect(new Set(resultados).size).toBeGreaterThan(1);
  });
});
