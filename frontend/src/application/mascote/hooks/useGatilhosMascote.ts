import { useRef } from "react";
import { useCelebracaoPorProgresso } from "./useCelebracaoPorProgresso";
import { usePreocupacaoPorPendencias } from "./usePreocupacaoPorPendencias";
import { useSaudacaoPorRota } from "./useSaudacaoPorRota";

export function useGatilhosMascote() {
  const ignorarEventosIniciaisRef = useRef(true);

  useSaudacaoPorRota();
  useCelebracaoPorProgresso(ignorarEventosIniciaisRef);
  usePreocupacaoPorPendencias(ignorarEventosIniciaisRef);
}
