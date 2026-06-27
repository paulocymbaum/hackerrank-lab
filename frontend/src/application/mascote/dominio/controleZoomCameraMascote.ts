export type LimitesZoomCameraMascote = {
  minimo: number;
  maximo: number;
};

export type OpcoesZoomArrasteMascote = LimitesZoomCameraMascote & {
  /** Fator de zoom por pixel arrastado (arrastar para cima aproxima). */
  sensibilidadeArraste: number;
};

export function limitarFatorZoom(
  fator: number,
  limites: LimitesZoomCameraMascote,
): number {
  return Math.min(limites.maximo, Math.max(limites.minimo, fator));
}

/** deltaYPixels < 0 (arrastar para cima) aproxima; deltaYPixels > 0 afasta. */
export function aplicarDeltaZoomArraste(
  fatorAtual: number,
  deltaYPixels: number,
  opcoes: OpcoesZoomArrasteMascote,
): number {
  if (deltaYPixels === 0) return fatorAtual;
  const delta = deltaYPixels * opcoes.sensibilidadeArraste;
  return limitarFatorZoom(fatorAtual + delta, opcoes);
}

export function suavizarFatorZoom(
  atual: number,
  alvo: number,
  deltaSegundos: number,
  velocidade: number,
): number {
  if (deltaSegundos <= 0) return atual;
  const t = 1 - Math.exp(-velocidade * deltaSegundos);
  return atual + (alvo - atual) * t;
}
