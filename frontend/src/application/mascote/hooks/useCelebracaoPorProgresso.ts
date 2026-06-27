import { useEffect, useRef } from "react";
import { useTranslation } from "../../hooks/useTranslation";
import { quizConcluido } from "../dominio/regrasProgressoMascote";
import { useMascoteStore } from "../store/mascoteStore";
import { useProjectProgressStore } from "../../stores/projectProgressStore";
import { useQuizProgressStore } from "../../stores/quizProgressStore";

type RefIgnorarInicial = { current: boolean };

export function useCelebracaoPorProgresso(ignorarEventosIniciaisRef: RefIgnorarInicial) {
  const { t } = useTranslation();
  const progressoQuizPorChave = useQuizProgressStore((estado) => estado.byKey);
  const progressoProjetoPorChave = useProjectProgressStore((estado) => estado.byKey);
  const progressoQuizAnteriorRef = useRef(progressoQuizPorChave);
  const progressoProjetoAnteriorRef = useRef(progressoProjetoPorChave);

  useEffect(() => {
    if (ignorarEventosIniciaisRef.current) {
      progressoQuizAnteriorRef.current = progressoQuizPorChave;
      return;
    }

    const progressoAnterior = progressoQuizAnteriorRef.current;
    progressoQuizAnteriorRef.current = progressoQuizPorChave;

    for (const chave of Object.keys(progressoQuizPorChave)) {
      const atual = progressoQuizPorChave[chave];
      const anterior = progressoAnterior[chave];
      if (!atual?.lastAttempt) continue;

      const tentativaNova =
        !anterior?.lastAttempt ||
        anterior.lastAttempt.completedAt !== atual.lastAttempt.completedAt;
      if (!tentativaNova) continue;

      const { score, total } = atual.lastAttempt;
      if (!quizConcluido(score, total)) continue;

      useMascoteStore
        .getState()
        .acionarCelebracao(t("mascote.celebration.quiz", { score, total }));
    }
  }, [ignorarEventosIniciaisRef, progressoQuizPorChave, t]);

  useEffect(() => {
    if (ignorarEventosIniciaisRef.current) {
      progressoProjetoAnteriorRef.current = progressoProjetoPorChave;
      return;
    }

    const progressoAnterior = progressoProjetoAnteriorRef.current;
    progressoProjetoAnteriorRef.current = progressoProjetoPorChave;

    for (const chave of Object.keys(progressoProjetoPorChave)) {
      const atual = progressoProjetoPorChave[chave];
      const anterior = progressoAnterior[chave];
      if (atual?.status !== "done" || anterior?.status === "done") continue;

      useMascoteStore.getState().acionarCelebracao(t("mascote.celebration.project"));
    }
  }, [ignorarEventosIniciaisRef, progressoProjetoPorChave, t]);
}
