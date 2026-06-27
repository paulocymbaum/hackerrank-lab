import type { ConfigAnimacaoMascote } from "../dominio/resolverAnimacaoMascote";

/** Tupla imutável [x, y, z] — sem dependência de Three.js. */
export type Vetor3 = readonly [number, number, number];

export type SentidoVistaCaminhada = "frente" | "atras";

export type ParametrosCameraCena = {
  distancia: number;
  pitchGraus: number;
  azimuteCaminhadaGraus: number;
  /** Gira a câmera no plano horizontal em relação à frente da caminhada (só posição). */
  deslocamentoAzimuteGraus?: number;
};

export type EstadoFisicaFrameMascote = {
  ancora: {
    posicao: Vetor3;
    normal: Vetor3;
    yawRad: number;
  };
  esteira: {
    eixo: Vetor3;
    anguloDelta: number;
    deslocamento: number;
  };
  camera: {
    posicao: Vetor3;
    olhar: Vetor3;
    cima: Vetor3;
  };
  animacao: ConfigAnimacaoMascote;
};

export type EntradaSimulacaoFisica = {
  frame: import("../dominio/resolverEstadoCenaMascote").EstadoFrameCenaMascote;
  deltaSegundos: number;
  alturaOlhar: number;
  centroOlharModelo?: Vetor3 | null;
  /** Sobrescreve ancoragem matemática com posição mundial do grupo do mascote. */
  posicaoAncoraMundial?: Vetor3 | null;
};

/** Cima do mundo (Y-up). */
export const CIMA_MUNDO_MASCOTE: Vetor3 = [0, 1, 0];
