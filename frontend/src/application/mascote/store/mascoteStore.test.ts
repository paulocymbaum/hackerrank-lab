import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { useMascoteStore, agendadorEmocaoMascoteParaTestes } from "./mascoteStore";

describe("mascoteStore", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    agendadorEmocaoMascoteParaTestes.limpar();
    useMascoteStore.setState({
      emocao: "idle",
      mensagem: null,
      mostrarConfetti: false,
      contextoSaudacao: null,
    });
  });

  afterEach(() => {
    agendadorEmocaoMascoteParaTestes.limpar();
    vi.useRealTimers();
  });

  it("transição walking → idle após tempo configurado", () => {
    useMascoteStore.getState().definirEmocao("walking");
    expect(useMascoteStore.getState().emocao).toBe("walking");

    vi.advanceTimersByTime(30_000);
    expect(useMascoteStore.getState().emocao).toBe("idle");
  });

  it("celebração retorna a walking e limpa confetti", () => {
    useMascoteStore.getState().acionarCelebracao("Parabéns!");
    expect(useMascoteStore.getState().emocao).toBe("celebrating");
    expect(useMascoteStore.getState().mostrarConfetti).toBe(true);

    vi.advanceTimersByTime(6_000);
    expect(useMascoteStore.getState().emocao).toBe("walking");
    expect(useMascoteStore.getState().mostrarConfetti).toBe(false);
  });
});
