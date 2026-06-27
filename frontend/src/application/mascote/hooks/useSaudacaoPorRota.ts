import { useEffect, useRef } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { useTranslation } from "../../hooks/useTranslation";
import { detectarContextoAbertura, montarChaveRota } from "../dominio/regrasProgressoMascote";
import { useMascoteStore } from "../store/mascoteStore";

export function useSaudacaoPorRota() {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { t } = useTranslation();
  const chaveRotaAnteriorRef = useRef<string | null>(null);

  useEffect(() => {
    const chaveAtual = montarChaveRota(location.pathname, searchParams);
    if (chaveRotaAnteriorRef.current === chaveAtual) return;

    chaveRotaAnteriorRef.current = chaveAtual;
    const contexto = detectarContextoAbertura(location.pathname, searchParams);
    if (!contexto) return;

    const mensagens = {
      lesson: t("mascote.greeting.lesson"),
      quiz: t("mascote.greeting.quiz"),
      project: t("mascote.greeting.project"),
    } as const;

    useMascoteStore.getState().acionarSaudacao(contexto, mensagens[contexto]);
  }, [location.pathname, searchParams, t]);
}
