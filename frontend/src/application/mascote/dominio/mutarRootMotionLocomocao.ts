import * as THREE from "three";
import type { NomeAnimacaoMascote } from "./resolverAnimacaoMascote";

const CLIPS_LOCOMOCAO_IN_PLACE: NomeAnimacaoMascote[] = ["Walk", "Run", "Sneak"];

/** Remove translação de Hips dos clips locomotion (esteira / treadmill). */
export function prepararAnimacoesInPlace(clips: THREE.AnimationClip[]): THREE.AnimationClip[] {
  return clips.map((clip) => {
    if (!CLIPS_LOCOMOCAO_IN_PLACE.includes(clip.name as NomeAnimacaoMascote)) {
      return clip;
    }

    const faixas = clip.tracks.filter((faixa) => !faixa.name.startsWith("Hips.position"));
    return new THREE.AnimationClip(clip.name, clip.duration, faixas);
  });
}
