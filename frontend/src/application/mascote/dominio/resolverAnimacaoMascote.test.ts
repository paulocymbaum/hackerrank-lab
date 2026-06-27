import { describe, expect, it } from "vitest";
import { resolverAnimacaoMascote } from "./resolverAnimacaoMascote";

describe("resolverAnimacaoMascote", () => {
  it("mapeia emoções base para clips corretos", () => {
    expect(resolverAnimacaoMascote({ emocao: "idle", contextoSaudacao: null }).clip).toBe("Sit");
    expect(resolverAnimacaoMascote({ emocao: "walking", contextoSaudacao: null }).clip).toBe(
      "Walk",
    );
    expect(resolverAnimacaoMascote({ emocao: "celebrating", contextoSaudacao: null }).clip).toBe(
      "Jump",
    );
    expect(resolverAnimacaoMascote({ emocao: "concerned", contextoSaudacao: null }).clip).toBe(
      "Sneak",
    );
  });

  it("usa todas as animações de saudação por contexto", () => {
    expect(
      resolverAnimacaoMascote({ emocao: "greeting", contextoSaudacao: "lesson" }).clip,
    ).toBe("Walk");
    expect(resolverAnimacaoMascote({ emocao: "greeting", contextoSaudacao: "quiz" }).clip).toBe(
      "Bark",
    );
    expect(
      resolverAnimacaoMascote({ emocao: "greeting", contextoSaudacao: "project" }).clip,
    ).toBe("Run");
  });

  it("define velocidadeCaminhada por emoção", () => {
    expect(
      resolverAnimacaoMascote({ emocao: "idle", contextoSaudacao: null }).velocidadeCaminhada,
    ).toBe(0.12);
    expect(
      resolverAnimacaoMascote({ emocao: "walking", contextoSaudacao: null }).velocidadeCaminhada,
    ).toBe(0.85);
    expect(
      resolverAnimacaoMascote({ emocao: "greeting", contextoSaudacao: "quiz" }).velocidadeCaminhada,
    ).toBe(0);
  });
});
