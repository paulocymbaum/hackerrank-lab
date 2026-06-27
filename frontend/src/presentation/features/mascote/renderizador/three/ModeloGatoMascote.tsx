import { useMemo, useRef, type MutableRefObject } from "react";
import { useAnimations, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { clone } from "three/examples/jsm/utils/SkeletonUtils.js";
import { prepararAnimacoesInPlace } from "../../../../../application/mascote/dominio/mutarRootMotionLocomocao";
import type { EstadoFrameCenaMascote } from "../../../../../application/mascote/dominio/resolverEstadoCenaMascote";
import { CONFIGURACAO_MASCOTE } from "../../../../../infrastructure/config/mascoteConfig";
import { useAnimacaoGatoMascote } from "./useAnimacaoGatoMascote";

const caminhoModelo = CONFIGURACAO_MASCOTE.modelo.caminho;

type PropsModelo = {
  frameRef: MutableRefObject<EstadoFrameCenaMascote | null>;
};

/** Deve ficar dentro de `<Suspense>` — useGLTF suspende até o GLB carregar. */
export function ModeloGatoMascote(props: PropsModelo) {
  const grupoRef = useRef<THREE.Group>(null);
  const correcaoRef = useRef<THREE.Group>(null);
  const apoioPeRef = useRef<THREE.Group>(null);
  const raizRef = useRef<THREE.Group>(null);

  const euler = CONFIGURACAO_MASCOTE.modelo.euler;

  const { scene, animations } = useGLTF(caminhoModelo);
  const cenaClonada = useMemo(() => clone(scene) as THREE.Group, [scene]);
  const animacoesInPlace = useMemo(
    () => prepararAnimacoesInPlace(animations),
    [animations],
  );
  const { actions, names } = useAnimations(animacoesInPlace, grupoRef);

  useAnimacaoGatoMascote({
    frameRef: props.frameRef,
    grupoRef,
    correcaoRef,
    apoioPeRef,
    raizRef,
    actions,
    names,
  });

  return (
    <group ref={grupoRef}>
      <group ref={correcaoRef} rotation={[euler[0], euler[1], euler[2]]}>
        <group ref={apoioPeRef}>
          <primitive ref={raizRef} object={cenaClonada} />
        </group>
      </group>
    </group>
  );
}
