import { describe, expect, it } from "vitest";
import { CONFIGURACAO_MASCOTE } from "./mascoteConfig";

describe("mascoteConfig", () => {
  it("deriva escala do modelo a partir do raio do planeta", () => {
    const { raio } = CONFIGURACAO_MASCOTE.planeta;
    expect(CONFIGURACAO_MASCOTE.modelo.escalaSobrePlaneta).toBe(raio * 0.22);
  });

  it("ancora o mascote no polo superior do planeta", () => {
    const { raio } = CONFIGURACAO_MASCOTE.planeta;
    expect(CONFIGURACAO_MASCOTE.modelo.posicaoAncoragem).toEqual([0, raio, 0]);
  });
});
