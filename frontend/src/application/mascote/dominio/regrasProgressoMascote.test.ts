import { describe, expect, it } from "vitest";
import {
  detectarContextoAbertura,
  montarChaveRota,
  quizConcluido,
} from "./regrasProgressoMascote";

describe("regrasProgressoMascote", () => {
  it("monta chave de rota estável", () => {
    const params = new URLSearchParams("drawer=quiz&quiz=abc");
    expect(montarChaveRota("/course/js/lesson/1", params)).toBe(
      "/course/js/lesson/1?drawer=quiz&quiz=abc&project=",
    );
  });

  it("detecta contexto de abertura", () => {
    expect(
      detectarContextoAbertura("/course/js/lesson/1", new URLSearchParams()),
    ).toBe("lesson");
    expect(
      detectarContextoAbertura("/course/js", new URLSearchParams("drawer=quiz")),
    ).toBe("quiz");
    expect(
      detectarContextoAbertura("/course/js", new URLSearchParams("project=p1")),
    ).toBe("project");
  });

  it("quizConcluido respeita limiar configurado", () => {
    expect(quizConcluido(7, 10)).toBe(true);
    expect(quizConcluido(6, 10)).toBe(false);
    expect(quizConcluido(0, 0)).toBe(false);
  });
});
