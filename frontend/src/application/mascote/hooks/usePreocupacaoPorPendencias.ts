import { useEffect, useRef } from "react";
import { CONFIGURACAO_MASCOTE } from "../../../infrastructure/config/mascoteConfig";
import { useCatalog } from "../../hooks/useCatalog";
import { useTranslation } from "../../hooks/useTranslation";
import { contarAtividadesPendentes } from "../selectors/mascotePending";
import { useMascoteStore } from "../store/mascoteStore";
import { useProjectProgressStore } from "../../stores/projectProgressStore";
import { useQuizProgressStore } from "../../stores/quizProgressStore";

type RefIgnorarInicial = { current: boolean };

export function usePreocupacaoPorPendencias(ignorarEventosIniciaisRef: RefIgnorarInicial) {
  const { courses } = useCatalog();
  const { t } = useTranslation();
  const progressoQuizPorChave = useQuizProgressStore((estado) => estado.byKey);
  const progressoProjetoPorChave = useProjectProgressStore((estado) => estado.byKey);

  useEffect(() => {
    const pendentes = contarAtividadesPendentes({
      cursos: courses,
      progressoQuizPorChave,
      progressoProjetoPorChave,
    });

    if (ignorarEventosIniciaisRef.current) {
      ignorarEventosIniciaisRef.current = false;
      if (pendentes > 0) {
        useMascoteStore
          .getState()
          .acionarPreocupacao(pendentes, t("mascote.concerned", { count: pendentes }));
      }
    }

    if (pendentes <= 0) return;

    const intervalo = setInterval(() => {
      const emocaoAtual = useMascoteStore.getState().emocao;
      if (emocaoAtual === "celebrating" || emocaoAtual === "greeting") return;

      useMascoteStore
        .getState()
        .acionarPreocupacao(pendentes, t("mascote.concerned", { count: pendentes }));
    }, CONFIGURACAO_MASCOTE.emocao.temposMs.caminhada);

    return () => clearInterval(intervalo);
  }, [courses, ignorarEventosIniciaisRef, progressoProjetoPorChave, progressoQuizPorChave, t]);
}
