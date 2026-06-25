import type { QuizQuestion } from "./types/quiz";

/** Fisher-Yates; `aleatorio` injetável para testes. */
export function embaralharArray<T>(
  itens: readonly T[],
  aleatorio: () => number = Math.random,
): T[] {
  const resultado = [...itens];
  for (let i = resultado.length - 1; i > 0; i -= 1) {
    const j = Math.floor(aleatorio() * (i + 1));
    [resultado[i], resultado[j]] = [resultado[j], resultado[i]];
  }
  return resultado;
}

export function embaralharPerguntasQuiz(
  perguntas: QuizQuestion[],
  aleatorio?: () => number,
): QuizQuestion[] {
  return perguntas.map((pergunta) => ({
    ...pergunta,
    options: embaralharArray(pergunta.options, aleatorio),
  }));
}
