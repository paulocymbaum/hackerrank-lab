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

function idOpcaoPorIndice(indice: number): string {
  return String.fromCharCode(97 + indice);
}

/** Embaralha opções e renumeria ids (a, b, c…) pela posição exibida. */
export function embaralharPerguntasQuiz(
  perguntas: QuizQuestion[],
  aleatorio?: () => number,
): QuizQuestion[] {
  return perguntas.map((pergunta) => {
    const opcoesEmbaralhadas = embaralharArray(pergunta.options, aleatorio);
    const indiceCorreto = opcoesEmbaralhadas.findIndex(
      (opcao) => opcao.id === pergunta.correctOptionId,
    );

    return {
      ...pergunta,
      correctOptionId: idOpcaoPorIndice(indiceCorreto),
      options: opcoesEmbaralhadas.map((opcao, indice) => ({
        ...opcao,
        id: idOpcaoPorIndice(indice),
      })),
    };
  });
}
