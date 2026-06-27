import * as THREE from "three";
import type { EstadoFisicaFrameMascote, Vetor3 } from "../../../../../application/mascote/fisica/tiposFisicaMascote";

type AlvosFisicaThree = {
  camera: THREE.Camera;
  planeta: THREE.Object3D | null;
  mascote: THREE.Object3D | null;
};

const vetorPosicao = new THREE.Vector3();
const vetorOlhar = new THREE.Vector3();
const vetorCima = new THREE.Vector3();
const vetorEixo = new THREE.Vector3();
const vetorMundo = new THREE.Vector3();

function copiarVetor3ParaThree(v: Vetor3, destino: THREE.Vector3): THREE.Vector3 {
  return destino.set(v[0], v[1], v[2]);
}

function vetor3Valido(v: Vetor3): boolean {
  return Number.isFinite(v[0]) && Number.isFinite(v[1]) && Number.isFinite(v[2]);
}

/** Posição mundial do objeto — fallback seguro para câmera/olhar. */
export function obterPosicaoMundialThree(objeto: THREE.Object3D, destino = vetorMundo): Vetor3 {
  objeto.getWorldPosition(destino);
  return [destino.x, destino.y, destino.z];
}

/** Centro da bbox do mascote no mundo — mantém o olhar no gato durante animações. */
export function calcularCentroOlharModeloThree(mascote: THREE.Object3D): Vetor3 | null {
  mascote.updateWorldMatrix(true, true);
  const caixa = new THREE.Box3().setFromObject(mascote);
  if (caixa.isEmpty()) {
    return obterPosicaoMundialThree(mascote);
  }
  const centro = caixa.getCenter(new THREE.Vector3());
  return [centro.x, centro.y, centro.z];
}

export function aplicarEstadoFisicaThree(
  estado: EstadoFisicaFrameMascote,
  alvos: AlvosFisicaThree,
): void {
  if (alvos.mascote) {
    alvos.mascote.rotation.set(0, estado.ancora.yawRad, 0);
  }

  if (alvos.planeta && Math.abs(estado.esteira.anguloDelta) > 1e-10) {
    copiarVetor3ParaThree(estado.esteira.eixo, vetorEixo);
    alvos.planeta.rotateOnWorldAxis(vetorEixo, estado.esteira.anguloDelta);
  }

  if (
    !vetor3Valido(estado.camera.posicao) ||
    !vetor3Valido(estado.camera.olhar) ||
    !vetor3Valido(estado.camera.cima)
  ) {
    return;
  }

  copiarVetor3ParaThree(estado.camera.cima, vetorCima);
  alvos.camera.up.copy(vetorCima);
  copiarVetor3ParaThree(estado.camera.posicao, vetorPosicao);
  copiarVetor3ParaThree(estado.camera.olhar, vetorOlhar);

  if (vetorPosicao.distanceToSquared(vetorOlhar) < 1e-8) {
    vetorOlhar.y += 0.01;
  }

  alvos.camera.position.copy(vetorPosicao);
  alvos.camera.lookAt(vetorOlhar);
  alvos.camera.updateMatrixWorld(true);
}
