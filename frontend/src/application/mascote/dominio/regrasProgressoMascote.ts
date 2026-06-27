import { CONFIGURACAO_MASCOTE } from "../../../infrastructure/config/mascoteConfig";
import type { ContextoSaudacaoMascote } from "./tiposMascote";

export function montarChaveRota(
  locationPath: string,
  searchParams: URLSearchParams,
): string {
  const drawer = searchParams.get("drawer") ?? "";
  const quiz = searchParams.get("quiz") ?? "";
  const project = searchParams.get("project") ?? "";
  return `${locationPath}?drawer=${drawer}&quiz=${quiz}&project=${project}`;
}

export function detectarContextoAbertura(
  locationPath: string,
  searchParams: URLSearchParams,
): ContextoSaudacaoMascote | null {
  const drawer = searchParams.get("drawer");
  const temQuiz = Boolean(searchParams.get("quiz"));
  const temProjeto = Boolean(searchParams.get("project"));

  if (drawer === "project" || temProjeto) return "project";
  if (drawer === "quiz" || temQuiz) return "quiz";
  if (locationPath.includes("/lesson/")) return "lesson";
  return null;
}

export function quizConcluido(melhorPontuacao: number, total: number): boolean {
  if (total <= 0) return false;
  return melhorPontuacao / total >= CONFIGURACAO_MASCOTE.emocao.limiarQuizConcluido;
}
