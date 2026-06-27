import { describe, expect, it } from "vitest";
import {
  aplicarDeltaZoomArraste,
  limitarFatorZoom,
  suavizarFatorZoom,
} from "./controleZoomCameraMascote";

const OPCOES = { minimo: 0.5, maximo: 1.4, sensibilidadeArraste: 0.0025 };

describe("controleZoomCameraMascote", () => {
  it("limita fator de zoom aos extremos", () => {
    expect(limitarFatorZoom(0.2, OPCOES)).toBe(0.5);
    expect(limitarFatorZoom(2, OPCOES)).toBe(1.4);
  });

  it("arrastar para cima aproxima a câmera", () => {
    expect(aplicarDeltaZoomArraste(1, -80, OPCOES)).toBeCloseTo(0.8, 5);
  });

  it("arrastar para baixo afasta a câmera", () => {
    expect(aplicarDeltaZoomArraste(1, 80, OPCOES)).toBeCloseTo(1.2, 5);
  });

  it("suaviza transição em direção ao alvo", () => {
    const proximo = suavizarFatorZoom(1, 0.5, 0.1, 10);
    expect(proximo).toBeLessThan(1);
    expect(proximo).toBeGreaterThan(0.5);
  });
});
