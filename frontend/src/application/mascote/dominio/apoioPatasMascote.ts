import * as THREE from "three";
import type { NomeAnimacaoMascote } from "./resolverAnimacaoMascote";

/** Locomoção no chão — Sit/Bark usam só offset inicial no bind pose. */
const CLIPS_COM_APOIO_PATAS_NO_CHAO: ReadonlySet<NomeAnimacaoMascote> = new Set([
  "Walk",
  "Run",
  "Sneak",
]);

/** Pontas das patas no esqueleto GLB (min Y ≈ chão do modelo). */
const NOMES_PONTAS_PATAS_MASCOTE = [
  "Front_Leg_Tip_L",
  "Front_Leg_Tip_R",
  "Back_Leg_Tip_L",
  "Back_Leg_Tip_R",
] as const;

const vetorPata = new THREE.Vector3();

export function clipExigeApoioPatasNoChao(clip: NomeAnimacaoMascote | null): boolean {
  if (!clip) return false;
  return CLIPS_COM_APOIO_PATAS_NO_CHAO.has(clip);
}

/** Menor Y das patas no espaço local de `referencia` (ex.: grupo de correção Euler). */
export function calcularMenorYLocalPatas(
  raizModelo: THREE.Object3D,
  referencia: THREE.Object3D,
): number | null {
  raizModelo.updateWorldMatrix(true, true);
  let menorY: number | null = null;

  for (const nome of NOMES_PONTAS_PATAS_MASCOTE) {
    const osso = raizModelo.getObjectByName(nome);
    if (!osso) continue;

    vetorPata.setFromMatrixPosition(osso.matrixWorld);
    referencia.worldToLocal(vetorPata);

    if (menorY === null || vetorPata.y < menorY) {
      menorY = vetorPata.y;
    }
  }

  return menorY;
}

/** Deslocamento Y do grupo de apoio para manter patas em y = 0 na referência. */
export function calcularOffsetVerticalPe(
  raizModelo: THREE.Object3D,
  referencia: THREE.Object3D,
  offsetExtra = 0,
): number {
  const menorY = calcularMenorYLocalPatas(raizModelo, referencia);
  if (menorY === null) return offsetExtra;
  return -menorY + offsetExtra;
}

export function aplicarOffsetPeNoModelo(
  grupoApoio: THREE.Object3D,
  raizModelo: THREE.Object3D,
  referencia: THREE.Object3D,
  offsetExtra = 0,
): void {
  grupoApoio.position.y = calcularOffsetVerticalPe(raizModelo, referencia, offsetExtra);
}
