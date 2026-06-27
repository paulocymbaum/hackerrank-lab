import { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { CONFIGURACAO_MASCOTE } from "../../../../../infrastructure/config/mascoteConfig";

type PropsArbustoPlaneta = {
  lat: number;
  lon: number;
  escala?: number;
  cores: readonly string[];
};

function posicaoEsfera(lat: number, lon: number, raio: number): THREE.Vector3 {
  const phi = THREE.MathUtils.degToRad(90 - lat);
  const theta = THREE.MathUtils.degToRad(lon);
  return new THREE.Vector3(
    raio * Math.sin(phi) * Math.cos(theta),
    raio * Math.cos(phi),
    raio * Math.sin(phi) * Math.sin(theta),
  );
}

function orientarNaEsfera(objeto: THREE.Object3D, posicao: THREE.Vector3): void {
  const normal = posicao.clone().normalize();
  objeto.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), normal);
  objeto.position.copy(posicao);
}

function ArbustoPlaneta(props: PropsArbustoPlaneta) {
  const grupoRef = useRef<THREE.Group>(null);
  const raio = CONFIGURACAO_MASCOTE.planeta.raio;
  const geometria = CONFIGURACAO_MASCOTE.planeta.arbustos.geometria;
  const posicao = useMemo(
    () => posicaoEsfera(props.lat, props.lon, raio * 1.002),
    [props.lat, props.lon, raio],
  );

  useLayoutEffect(() => {
    if (!grupoRef.current) return;
    orientarNaEsfera(grupoRef.current, posicao);
  }, [posicao]);

  const [corPrincipal, corSecundaria, corTerciaria] = props.cores;

  return (
    <group ref={grupoRef} scale={props.escala ?? 1}>
      <mesh castShadow position={[0, geometria.corpo.altura, 0]}>
        <sphereGeometry args={[geometria.corpo.raio, ...geometria.corpo.segmentos]} />
        <meshStandardMaterial
          color={corPrincipal}
          roughness={geometria.corpo.roughness}
          flatShading
        />
      </mesh>
      <mesh castShadow position={geometria.folhaEsquerda.posicao}>
        <sphereGeometry args={[geometria.folhaEsquerda.raio, ...geometria.folhaEsquerda.segmentos]} />
        <meshStandardMaterial
          color={corSecundaria}
          roughness={geometria.folhaEsquerda.roughness}
          flatShading
        />
      </mesh>
      <mesh castShadow position={geometria.folhaDireita.posicao}>
        <sphereGeometry args={[geometria.folhaDireita.raio, ...geometria.folhaDireita.segmentos]} />
        <meshStandardMaterial
          color={corTerciaria}
          roughness={geometria.folhaDireita.roughness}
          flatShading
        />
      </mesh>
    </group>
  );
}

function criarTexturaGramaPlaneta(): THREE.CanvasTexture {
  const { grama } = CONFIGURACAO_MASCOTE.planeta;
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

  const gradiente = ctx.createLinearGradient(0, 0, 512, 256);
  gradiente.addColorStop(0, grama.gradiente[0]);
  gradiente.addColorStop(0.5, grama.gradiente[1]);
  gradiente.addColorStop(1, grama.gradiente[2]);
  ctx.fillStyle = gradiente;
  ctx.fillRect(0, 0, 512, 256);

  for (let indice = 0; indice < 1200; indice += 1) {
    const x = Math.random() * 512;
    const y = Math.random() * 256;
    ctx.fillStyle = Math.random() > 0.5 ? grama.manchas[0] : grama.manchas[1];
    ctx.fillRect(x, y, 2, 4);
  }

  const mapa = new THREE.CanvasTexture(canvas);
  mapa.wrapS = THREE.RepeatWrapping;
  mapa.wrapT = THREE.RepeatWrapping;
  mapa.repeat.set(2, 1);
  mapa.anisotropy = 8;
  return mapa;
}

export function PlanetaMascote() {
  const { planeta } = CONFIGURACAO_MASCOTE;
  const texturaGrama = useMemo(() => criarTexturaGramaPlaneta(), []);

  return (
    <group>
      <mesh castShadow receiveShadow>
        <sphereGeometry args={[planeta.raio, 48, 32]} />
        <meshStandardMaterial
          map={texturaGrama}
          color={planeta.grama.corBase}
          roughness={0.92}
          metalness={0}
        />
      </mesh>

      {planeta.arbustos.posicoes.map((arbusto) => (
        <ArbustoPlaneta
          key={`${arbusto.lat}-${arbusto.lon}`}
          lat={arbusto.lat}
          lon={arbusto.lon}
          escala={arbusto.escala}
          cores={planeta.arbustos.cores}
        />
      ))}
    </group>
  );
}
