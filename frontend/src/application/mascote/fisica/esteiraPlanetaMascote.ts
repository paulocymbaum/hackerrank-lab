import { copiarVetor3, normalizar, produtoVetorial, vetor3 } from "./vetoresMascote";
import type { Vetor3 } from "./tiposFisicaMascote";

export type RotacaoEsteiraPlaneta = {
  eixo: Vetor3;
  anguloDelta: number;
  deslocamento: number;
};

/**
 * Rolagem da esfera oposta à velocidade do mascote (ω ∝ normal × tangente).
 */
export function calcularRotacaoEsteiraPlaneta(
  deslocamento: number,
  raioPlaneta: number,
  normalSuperficie: Vetor3,
  direcaoTangente: Vetor3,
): RotacaoEsteiraPlaneta {
  const eixoBruto = produtoVetorial(normalSuperficie, direcaoTangente);

  if (eixoBruto[0] * eixoBruto[0] + eixoBruto[1] * eixoBruto[1] + eixoBruto[2] * eixoBruto[2] < 1e-10) {
    return { eixo: vetor3(1, 0, 0), anguloDelta: 0, deslocamento };
  }

  const anguloDelta = raioPlaneta > 0 ? -deslocamento / raioPlaneta : 0;

  return {
    eixo: normalizar(eixoBruto),
    anguloDelta,
    deslocamento,
  };
}
