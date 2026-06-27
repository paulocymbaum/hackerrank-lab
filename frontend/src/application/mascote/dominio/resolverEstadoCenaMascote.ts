import { CONFIGURACAO_MASCOTE } from "../../../infrastructure/config/mascoteConfig";
import type { ParametrosCameraCena } from "../fisica/tiposFisicaMascote";
import { resolverAnimacaoMascote, type ConfigAnimacaoMascote } from "./resolverAnimacaoMascote";
import type { ContextoSaudacaoMascote, EmocaoMascote } from "./tiposMascote";

export type EstadoFrameCenaMascote = {
  animacao: ConfigAnimacaoMascote;
  camera: ParametrosCameraCena & { fatorZoom: number };
  ancora: {
    posicao: readonly [number, number, number];
    azimuteCaminhadaGraus: number;
    inclinacaoPlanetaRad: number;
    correcaoYawMascoteRad: number;
    sentidoCamera: "frente" | "atras";
  };
};

export function resolverEstadoFrameCenaMascote(input: {
  emocao: EmocaoMascote;
  contextoSaudacao: ContextoSaudacaoMascote | null;
  fatorZoom: number;
}): EstadoFrameCenaMascote {
  const { cena, planeta } = CONFIGURACAO_MASCOTE;

  return {
    animacao: resolverAnimacaoMascote(input),
    camera: {
      distancia: cena.camera.distancia * input.fatorZoom,
      pitchGraus: cena.camera.pitchGraus,
      azimuteCaminhadaGraus: cena.azimuteCaminhadaGraus,
      deslocamentoAzimuteGraus: cena.camera.deslocamentoAzimuteGraus,
      fatorZoom: input.fatorZoom,
    },
    ancora: {
      posicao: CONFIGURACAO_MASCOTE.modelo.posicaoAncoragem,
      azimuteCaminhadaGraus: cena.azimuteCaminhadaGraus,
      inclinacaoPlanetaRad: planeta.inclinacaoRad,
      correcaoYawMascoteRad: cena.correcaoYawMascoteRad,
      sentidoCamera: cena.camera.sentido,
    },
  };
}
