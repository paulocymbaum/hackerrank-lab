import { useRef, type MutableRefObject, type RefObject } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { suavizarFatorZoom } from "../../../../../application/mascote/dominio/controleZoomCameraMascote";
import { avancarSimulacaoFisicaMascote } from "../../../../../application/mascote/fisica/simuladorFisicaMascote";
import {
  resolverEstadoFrameCenaMascote,
  type EstadoFrameCenaMascote,
} from "../../../../../application/mascote/dominio/resolverEstadoCenaMascote";
import type { ContextoSaudacaoMascote, EmocaoMascote } from "../../../../../application/mascote/dominio/tiposMascote";
import { CONFIGURACAO_MASCOTE } from "../../../../../infrastructure/config/mascoteConfig";
import {
  aplicarEstadoFisicaThree,
  calcularCentroOlharModeloThree,
  obterPosicaoMundialThree,
} from "./aplicadorFisicaThreeMascote";

type PropsEmocao = {
  emocao: EmocaoMascote;
  contextoSaudacao: ContextoSaudacaoMascote | null;
};

type ParametrosLoop = {
  propsRef: MutableRefObject<PropsEmocao>;
  fatorZoomAlvoRef: MutableRefObject<number>;
  frameRef: MutableRefObject<EstadoFrameCenaMascote | null>;
  planetaRef: RefObject<THREE.Group | null>;
  mascoteRef: RefObject<THREE.Group | null>;
};

const cena = CONFIGURACAO_MASCOTE.cena;

export function useLoopCenaMascote(parametros: ParametrosLoop) {
  const fatorZoomAtualRef = useRef<number>(cena.camera.zoom.inicial);
  const { camera } = useThree();

  useFrame((_, delta) => {
    const props = parametros.propsRef.current;

    fatorZoomAtualRef.current = suavizarFatorZoom(
      fatorZoomAtualRef.current,
      parametros.fatorZoomAlvoRef.current,
      delta,
      cena.camera.zoom.suavizacao,
    );

    const frame = resolverEstadoFrameCenaMascote({
      emocao: props.emocao,
      contextoSaudacao: props.contextoSaudacao,
      fatorZoom: fatorZoomAtualRef.current,
    });

    parametros.frameRef.current = frame;

    const centroOlharModelo = parametros.mascoteRef.current
      ? calcularCentroOlharModeloThree(parametros.mascoteRef.current)
      : null;

    const posicaoAncoraMundial = parametros.mascoteRef.current
      ? obterPosicaoMundialThree(parametros.mascoteRef.current)
      : null;

    const estadoFisica = avancarSimulacaoFisicaMascote({
      frame,
      deltaSegundos: delta,
      alturaOlhar: cena.camera.alturaOlhar,
      centroOlharModelo,
      posicaoAncoraMundial,
    });

    aplicarEstadoFisicaThree(estadoFisica, {
      camera,
      planeta: parametros.planetaRef.current,
      mascote: parametros.mascoteRef.current,
    });
  });
}
