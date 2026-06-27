import { CONFIGURACAO_MASCOTE } from "../../../infrastructure/config/mascoteConfig";
import { calcularAncoraNoPolo, calcularDirecaoTangenteCaminhada } from "./ancoraMascote";
import {
  calcularOlharCamera,
  calcularPosicaoCamera,
} from "./cameraFisicaMascote";
import { calcularRotacaoEsteiraPlaneta } from "./esteiraPlanetaMascote";
import type { EntradaSimulacaoFisica, EstadoFisicaFrameMascote, Vetor3 } from "./tiposFisicaMascote";
import { CIMA_MUNDO_MASCOTE } from "./tiposFisicaMascote";

export function avancarSimulacaoFisicaMascote(
  entrada: EntradaSimulacaoFisica,
): EstadoFisicaFrameMascote {
  const { frame, deltaSegundos, alturaOlhar, centroOlharModelo, posicaoAncoraMundial } = entrada;
  const { ancora: ancoraFrame, camera: cameraFrame, animacao } = frame;
  const raioPlaneta = CONFIGURACAO_MASCOTE.planeta.raio;

  const ancoraCalculada = calcularAncoraNoPolo(
    raioPlaneta,
    ancoraFrame.inclinacaoPlanetaRad,
    ancoraFrame.azimuteCaminhadaGraus,
    ancoraFrame.correcaoYawMascoteRad,
  );

  const posicaoAncora: Vetor3 = posicaoAncoraMundial ?? ancoraCalculada.posicao;
  const normal: Vetor3 = posicaoAncoraMundial
    ? normalizarRadial(posicaoAncora)
    : ancoraCalculada.normal;

  const tangente = calcularDirecaoTangenteCaminhada(
    ancoraFrame.azimuteCaminhadaGraus,
    ancoraFrame.inclinacaoPlanetaRad,
    normal,
  );

  const deslocamento = animacao.velocidadeCaminhada * deltaSegundos;
  const esteira = calcularRotacaoEsteiraPlaneta(
    deslocamento,
    raioPlaneta,
    normal,
    tangente,
  );

  const posicaoCamera = calcularPosicaoCamera(
    posicaoAncora,
    {
      distancia: cameraFrame.distancia,
      pitchGraus: cameraFrame.pitchGraus,
      azimuteCaminhadaGraus: cameraFrame.azimuteCaminhadaGraus,
      deslocamentoAzimuteGraus: cameraFrame.deslocamentoAzimuteGraus,
    },
    ancoraFrame.sentidoCamera,
  );

  const olhar = calcularOlharCamera(posicaoAncora, alturaOlhar, centroOlharModelo);

  return {
    ancora: {
      posicao: posicaoAncora,
      normal,
      yawRad: ancoraCalculada.yawRad,
    },
    esteira,
    camera: {
      posicao: posicaoCamera,
      olhar,
      cima: CIMA_MUNDO_MASCOTE,
    },
    animacao,
  };
}

function normalizarRadial(posicao: Vetor3): Vetor3 {
  const n = Math.hypot(posicao[0], posicao[1], posicao[2]);
  if (n < 1e-10) return [0, 1, 0];
  return [posicao[0] / n, posicao[1] / n, posicao[2] / n];
}
