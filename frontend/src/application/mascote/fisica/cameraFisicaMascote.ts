import { adicionarEscalado, adicionarVetor3, copiarVetor3, grausParaRad } from "./vetoresMascote";
import type { ParametrosCameraCena, SentidoVistaCaminhada, Vetor3 } from "./tiposFisicaMascote";
import { CIMA_MUNDO_MASCOTE } from "./tiposFisicaMascote";

const FATOR_HORIZONTAL_SENTIDO: Record<SentidoVistaCaminhada, number> = {
  frente: 1,
  atras: -1,
};

/**
 * Offset esférico da câmera em relação ao anchor.
 * `frente` = na direção da caminhada (vista ¾); `atras` = sentido oposto.
 */
export function calcularOffsetCamera(
  parametros: ParametrosCameraCena,
  sentido: SentidoVistaCaminhada = "frente",
): Vetor3 {
  const { distancia, pitchGraus, azimuteCaminhadaGraus, deslocamentoAzimuteGraus = 0 } =
    parametros;
  const pitch = grausParaRad(pitchGraus);
  const azimute = grausParaRad(azimuteCaminhadaGraus + deslocamentoAzimuteGraus);
  const raioHorizontal = distancia * Math.cos(pitch);
  const fator = FATOR_HORIZONTAL_SENTIDO[sentido];

  return [
    fator * raioHorizontal * Math.sin(azimute),
    distancia * Math.sin(pitch),
    fator * raioHorizontal * Math.cos(azimute),
  ];
}

export function calcularPosicaoCamera(
  pontoAncoragem: Vetor3,
  parametros: ParametrosCameraCena,
  sentido: SentidoVistaCaminhada = "frente",
): Vetor3 {
  const offset = calcularOffsetCamera(parametros, sentido);
  return adicionarVetor3(pontoAncoragem, offset);
}

export function calcularPontoOlharCamera(
  pontoAncoragem: Vetor3,
  alturaOlhar: number,
): Vetor3 {
  return adicionarEscalado(pontoAncoragem, alturaOlhar, CIMA_MUNDO_MASCOTE);
}

export function calcularOlharCamera(
  pontoAncoragem: Vetor3,
  alturaOlhar: number,
  centroOlharModelo?: Vetor3 | null,
): Vetor3 {
  if (centroOlharModelo) {
    return copiarVetor3(centroOlharModelo);
  }
  return calcularPontoOlharCamera(pontoAncoragem, alturaOlhar);
}
