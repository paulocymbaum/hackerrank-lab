import { useLayoutEffect, useRef, type MutableRefObject, type RefObject } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import {
  aplicarOffsetPeNoModelo,
  clipExigeApoioPatasNoChao,
} from "../../../../../application/mascote/dominio/apoioPatasMascote";
import {
  type ConfigAnimacaoMascote,
  type NomeAnimacaoMascote,
} from "../../../../../application/mascote/dominio/resolverAnimacaoMascote";
import type { EstadoFrameCenaMascote } from "../../../../../application/mascote/dominio/resolverEstadoCenaMascote";
import { CONFIGURACAO_MASCOTE } from "../../../../../infrastructure/config/mascoteConfig";

type ParametrosAnimacao = {
  frameRef: MutableRefObject<EstadoFrameCenaMascote | null>;
  grupoRef: RefObject<THREE.Group | null>;
  correcaoRef: RefObject<THREE.Group | null>;
  apoioPeRef: RefObject<THREE.Group | null>;
  raizRef: RefObject<THREE.Group | null>;
  actions: Record<string, THREE.AnimationAction | null>;
  names: string[];
};

function aplicarModoClip(acao: THREE.AnimationAction, config: ConfigAnimacaoMascote): void {
  acao.enabled = true;
  acao.timeScale = config.escalaTempo;
  if (config.modo === "once") {
    acao.setLoop(THREE.LoopOnce, 1);
    acao.clampWhenFinished = true;
  } else {
    acao.setLoop(THREE.LoopRepeat, Infinity);
    acao.clampWhenFinished = false;
  }
}

function obterConfigAnimacao(frameRef: MutableRefObject<EstadoFrameCenaMascote | null>): ConfigAnimacaoMascote | null {
  const frame = frameRef.current;
  if (!frame) return null;
  return frame.animacao;
}

export function useAnimacaoGatoMascote(parametros: ParametrosAnimacao) {
  const clipAtivoRef = useRef<NomeAnimacaoMascote | null>(null);
  const crossfade = CONFIGURACAO_MASCOTE.emocao.crossfadeSegundos;
  const offsetPe = CONFIGURACAO_MASCOTE.modelo.offsetPe;

  function reproduzirClipAtual(): void {
    const config = obterConfigAnimacao(parametros.frameRef);
    if (!config || parametros.names.length === 0 || !parametros.grupoRef.current) return;

    const proxima = parametros.actions[config.clip];
    if (!proxima) return;

    if (clipAtivoRef.current === config.clip) {
      proxima.timeScale = config.escalaTempo;
      if (!proxima.isRunning()) proxima.play();
      return;
    }

    const anterior = clipAtivoRef.current ? parametros.actions[clipAtivoRef.current] : null;
    aplicarModoClip(proxima, config);

    if (clipAtivoRef.current === null) {
      proxima.reset().play();
    } else {
      anterior?.fadeOut(crossfade);
      proxima.reset().fadeIn(crossfade).play();
    }

    clipAtivoRef.current = config.clip;
  }

  useLayoutEffect(() => {
    clipAtivoRef.current = null;
    reproduzirClipAtual();
  }, [parametros.names]);

  useFrame(() => {
    reproduzirClipAtual();
  }, 1);

  useLayoutEffect(() => {
    const apoioPe = parametros.apoioPeRef.current;
    const correcao = parametros.correcaoRef.current;
    const raiz = parametros.raizRef.current;
    if (!apoioPe || !correcao || !raiz) return;

    raiz.traverse((filho) => {
      if (!(filho instanceof THREE.Mesh)) return;
      filho.castShadow = true;
      filho.receiveShadow = true;
      filho.frustumCulled = false;
    });

    aplicarOffsetPeNoModelo(apoioPe, raiz, correcao, offsetPe);
  }, [parametros.names]);

  useFrame(() => {
    const apoioPe = parametros.apoioPeRef.current;
    const correcao = parametros.correcaoRef.current;
    const raiz = parametros.raizRef.current;
    if (!apoioPe || !correcao || !raiz) return;
    if (!clipExigeApoioPatasNoChao(clipAtivoRef.current)) return;
    aplicarOffsetPeNoModelo(apoioPe, raiz, correcao, offsetPe);
  }, 2);
}
