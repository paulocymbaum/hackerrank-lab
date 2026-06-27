import { Suspense, useRef, type MutableRefObject, type RefObject } from "react";
import { Canvas } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { useControleZoomMascote } from "../../../../../application/mascote/hooks/useControleZoomMascote";
import type { EstadoFrameCenaMascote } from "../../../../../application/mascote/dominio/resolverEstadoCenaMascote";
import type {
  ContextoSaudacaoMascote,
  EmocaoMascote,
  EstadoVisualMascote,
} from "../../../../../application/mascote/dominio/tiposMascote";
import { CONFIGURACAO_MASCOTE } from "../../../../../infrastructure/config/mascoteConfig";
import { AmbienteMascoteThree } from "./AmbienteMascoteThree";
import { ModeloGatoMascote } from "./ModeloGatoMascote";
import { PlanetaMascote } from "./PlanetaMascote";
import { useLoopCenaMascote } from "./useLoopCenaMascote";

useGLTF.preload(CONFIGURACAO_MASCOTE.modelo.caminho);

type PropsCanvas = EstadoVisualMascote & {
  tituloZoom: string;
};

type PropsLoopR3F = {
  emocao: EmocaoMascote;
  contextoSaudacao: ContextoSaudacaoMascote | null;
  fatorZoomAlvo: number;
  planetaRef: RefObject<THREE.Group | null>;
  mascoteRef: RefObject<THREE.Group | null>;
  frameRef: MutableRefObject<EstadoFrameCenaMascote | null>;
};

function LoopR3F(props: PropsLoopR3F) {
  const propsRef = useRef({
    emocao: props.emocao,
    contextoSaudacao: props.contextoSaudacao,
  });
  const fatorZoomAlvoRef = useRef(props.fatorZoomAlvo);

  propsRef.current = {
    emocao: props.emocao,
    contextoSaudacao: props.contextoSaudacao,
  };
  fatorZoomAlvoRef.current = props.fatorZoomAlvo;

  useLoopCenaMascote({
    propsRef,
    fatorZoomAlvoRef,
    frameRef: props.frameRef,
    planetaRef: props.planetaRef,
    mascoteRef: props.mascoteRef,
  });

  return null;
}

export function CanvasMascoteThree(props: PropsCanvas) {
  const zoom = CONFIGURACAO_MASCOTE.cena.camera.zoom;
  const ambiente = CONFIGURACAO_MASCOTE.ambiente;
  const { inclinacaoRad } = CONFIGURACAO_MASCOTE.planeta;
  const { posicaoAncoragem, escalaSobrePlaneta } = CONFIGURACAO_MASCOTE.modelo;
  const rotacaoEsteira: [number, number, number] = [inclinacaoRad, 0, 0];

  const planetaRef = useRef<THREE.Group>(null);
  const mascoteRef = useRef<THREE.Group>(null);
  const frameRef = useRef<EstadoFrameCenaMascote | null>(null);

  const {
    fatorZoomAlvo,
    aoIniciarArrasteZoom,
    aoMoverArrasteZoom,
    aoEncerrarArrasteZoom,
    redefinirZoom,
  } = useControleZoomMascote({
    inicial: zoom.inicial,
    minimo: zoom.minimo,
    maximo: zoom.maximo,
    sensibilidadeArraste: zoom.sensibilidadeArraste,
  });

  return (
    <div
      className="mascote-zoom"
      onPointerDown={aoIniciarArrasteZoom}
      onPointerMove={aoMoverArrasteZoom}
      onPointerUp={aoEncerrarArrasteZoom}
      onPointerCancel={aoEncerrarArrasteZoom}
      onDoubleClick={redefinirZoom}
      title={props.tituloZoom}
    >
      <Canvas
        className="mascote-three-canvas"
        shadows
        frameloop={props.visivel ? "always" : "demand"}
        dpr={[1, 1.5]}
        gl={{
          alpha: false,
          antialias: true,
          powerPreference: "high-performance",
        }}
        onCreated={({ gl }) => {
          gl.outputColorSpace = THREE.SRGBColorSpace;
        }}
        camera={{
          fov: ambiente.fov,
          near: ambiente.near,
          far: ambiente.far,
          position: ambiente.posicaoCameraInicial,
        }}
      >
        <AmbienteMascoteThree />
        <LoopR3F
          emocao={props.emocao}
          contextoSaudacao={props.contextoSaudacao}
          fatorZoomAlvo={fatorZoomAlvo}
          planetaRef={planetaRef}
          mascoteRef={mascoteRef}
          frameRef={frameRef}
        />

        <group rotation={rotacaoEsteira}>
          <group ref={planetaRef}>
            <PlanetaMascote />
          </group>
        </group>

        <Suspense fallback={null}>
          <group rotation={rotacaoEsteira}>
            <group
              ref={mascoteRef}
              position={[...posicaoAncoragem]}
              scale={escalaSobrePlaneta}
            >
              <ModeloGatoMascote frameRef={frameRef} />
            </group>
          </group>
        </Suspense>
      </Canvas>
    </div>
  );
}
