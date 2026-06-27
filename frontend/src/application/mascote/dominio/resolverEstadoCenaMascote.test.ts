import { describe, expect, it } from "vitest";
import { CONFIGURACAO_MASCOTE } from "../../../infrastructure/config/mascoteConfig";
import { resolverEstadoFrameCenaMascote } from "./resolverEstadoCenaMascote";

describe("resolverEstadoFrameCenaMascote", () => {
  it("snapshot por emoção e zoom", () => {
    const emocoes = ["idle", "walking", "celebrating", "concerned", "greeting"] as const;

    for (const emocao of emocoes) {
      const frame = resolverEstadoFrameCenaMascote({
        emocao,
        contextoSaudacao: emocao === "greeting" ? "quiz" : null,
        fatorZoom: 1,
      });

      expect(frame).toMatchSnapshot(`${emocao}-zoom-1`);
    }
  });

  it("aplica fator de zoom na distância da câmera", () => {
    const base = resolverEstadoFrameCenaMascote({
      emocao: "idle",
      contextoSaudacao: null,
      fatorZoom: 1,
    });
    const aproximado = resolverEstadoFrameCenaMascote({
      emocao: "idle",
      contextoSaudacao: null,
      fatorZoom: 0.6,
    });

    const distanciaBase = CONFIGURACAO_MASCOTE.cena.camera.distancia;
    expect(base.camera.distancia).toBeCloseTo(distanciaBase, 5);
    expect(aproximado.camera.distancia).toBeCloseTo(distanciaBase * 0.6, 5);
  });
});
