import type { Vetor3 } from "./tiposFisicaMascote";

export function vetor3(x: number, y: number, z: number): Vetor3 {
  return [x, y, z];
}

export function copiarVetor3(origem: Vetor3): Vetor3 {
  return [origem[0], origem[1], origem[2]];
}

export function adicionarVetor3(a: Vetor3, b: Vetor3): Vetor3 {
  return [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
}

export function escalarVetor3(v: Vetor3, s: number): Vetor3 {
  return [v[0] * s, v[1] * s, v[2] * s];
}

export function adicionarEscalado(v: Vetor3, escala: number, direcao: Vetor3): Vetor3 {
  return [v[0] + escala * direcao[0], v[1] + escala * direcao[1], v[2] + escala * direcao[2]];
}

export function produtoEscalar(a: Vetor3, b: Vetor3): number {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}

export function produtoVetorial(a: Vetor3, b: Vetor3): Vetor3 {
  return [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0],
  ];
}

export function quadradaNorma(v: Vetor3): number {
  return v[0] * v[0] + v[1] * v[1] + v[2] * v[2];
}

export function norma(v: Vetor3): number {
  return Math.sqrt(quadradaNorma(v));
}

export function normalizar(v: Vetor3, fallback: Vetor3 = [1, 0, 0]): Vetor3 {
  const n = norma(v);
  if (n < 1e-10) return copiarVetor3(fallback);
  return [v[0] / n, v[1] / n, v[2] / n];
}

/** Projeta `v` no plano perpendicular a `normalPlano`. */
export function projetarNoPlano(v: Vetor3, normalPlano: Vetor3): Vetor3 {
  const n = normalizar(normalPlano);
  const d = produtoEscalar(v, n);
  return [v[0] - d * n[0], v[1] - d * n[1], v[2] - d * n[2]];
}

export function grausParaRad(graus: number): number {
  return (graus * Math.PI) / 180;
}

export function radParaGraus(rad: number): number {
  return (rad * 180) / Math.PI;
}

/** Rotação em torno do eixo X (inclinação do planeta). */
export function rotacionarEmX(v: Vetor3, anguloRad: number): Vetor3 {
  const cos = Math.cos(anguloRad);
  const sin = Math.sin(anguloRad);
  return [v[0], v[1] * cos - v[2] * sin, v[1] * sin + v[2] * cos];
}

export function direcaoAzimuteHorizontal(azimuteGraus: number): Vetor3 {
  const az = grausParaRad(azimuteGraus);
  return [Math.sin(az), 0, Math.cos(az)];
}
