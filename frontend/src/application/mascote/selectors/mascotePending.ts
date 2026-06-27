import type { Course } from "../../../domain/types/catalog";
import { quizProgressKey } from "../../../domain/types/quiz";
import { projectProgressKey } from "../../../domain/types/quizScore";
import { CONFIGURACAO_MASCOTE } from "../../../infrastructure/config/mascoteConfig";
import { getAllProjectsForCourse, getAllQuizzesForCourse } from "../../selectors/catalogSelectors";

export function contarAtividadesPendentes(input: {
  cursos: Course[];
  progressoQuizPorChave: Record<string, { bestScore: number; bestTotal: number } | undefined>;
  progressoProjetoPorChave: Record<string, { status: string } | undefined>;
}): number {
  let pendentes = 0;
  const limiar = CONFIGURACAO_MASCOTE.emocao.limiarQuizConcluido;

  for (const curso of input.cursos) {
    const quizzes = getAllQuizzesForCourse(curso);
    const projetos = getAllProjectsForCourse(curso);

    for (const quiz of quizzes) {
      const chave = quizProgressKey(curso.id, quiz.id, quiz.lessonId);
      const progresso = input.progressoQuizPorChave[chave];
      const melhorPontuacao = progresso?.bestScore ?? 0;
      const total = progresso?.bestTotal ?? quiz.questions.length;
      const percentual = total > 0 ? melhorPontuacao / total : 0;
      if (percentual < limiar) pendentes += 1;
    }

    for (const projeto of projetos) {
      const chave = projectProgressKey(curso.id, projeto.id, projeto.lessonId);
      const status = input.progressoProjetoPorChave[chave]?.status ?? "pending";
      if (status !== "done") pendentes += 1;
    }
  }

  return pendentes;
}
