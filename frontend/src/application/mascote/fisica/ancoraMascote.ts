import {
  copiarVetor3,
  direcaoAzimuteHorizontal,
  grausParaRad,
  normalizar,
  projetarNoPlano,
  rotacionarEmX,
  vetor3,
} from "./vetoresMascote";
import type { Vetor3 } from "./tiposFisicaMascote";

export type AncoraMascote = {
  posicao: Vetor3;
  normal: Vetor3;
  yawRad: number;
};

/** Polo local [0, raio, 0] com inclinação do grupo pai → posição + normal radial. */
export function calcularAncoraNoPolo(
  raio: number,
  inclinacaoRad: number,
  azimuteCaminhadaGraus: number,
  correcaoYawRad = 0,
): AncoraMascote {
  const poloLocal = vetor3(0, raio, 0);
  const posicao = rotacionarEmX(poloLocal, inclinacaoRad);
  const normal = normalizar(posicao);
  const yawRad = grausParaRad(azimuteCaminhadaGraus) + correcaoYawRad;

  return { posicao, normal, yawRad };
}

/**
 * Direção de caminhada no espaço inclinado, projetada no plano tangente da esfera.
 */
export function calcularDirecaoTangenteCaminhada(
  azimuteCaminhadaGraus: number,
  inclinacaoRad: number,
  normal: Vetor3,
): Vetor3 {
  const direcaoLocal = direcaoAzimuteHorizontal(azimuteCaminhadaGraus);
  const direcaoInclinada = rotacionarEmX(direcaoLocal, inclinacaoRad);
  return normalizar(projetarNoPlano(direcaoInclinada, normal), copiarVetor3(direcaoInclinada));
}
