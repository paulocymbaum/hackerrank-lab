import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CONFIGURACAO_MASCOTE } from "../../../infrastructure/config/mascoteConfig";
import { criarAgendadorEmocaoMascote } from "../dominio/agendadorEmocaoMascote";
import type { ContextoSaudacaoMascote, EmocaoMascote } from "../dominio/tiposMascote";

export type { ContextoSaudacaoMascote, EmocaoMascote };

type EstadoMascote = {
  emocao: EmocaoMascote;
  mensagem: string | null;
  visivel: boolean;
  mostrarConfetti: boolean;
  contextoSaudacao: ContextoSaudacaoMascote | null;
  acionarCelebracao: (motivo: string) => void;
  acionarPreocupacao: (quantidadePendente: number, mensagem: string) => void;
  acionarSaudacao: (contexto: ContextoSaudacaoMascote, mensagem: string) => void;
  definirEmocao: (emocao: EmocaoMascote) => void;
  dispensarMensagem: () => void;
  alternarVisibilidade: () => void;
  definirVisibilidade: (visivel: boolean) => void;
};

const agendador = criarAgendadorEmocaoMascote();
const tempos = CONFIGURACAO_MASCOTE.emocao.temposMs;

function agendarRetornoEmocao(
  duracaoMs: number,
  proximaEmocao: EmocaoMascote,
  aoConcluir?: () => void,
): void {
  agendador.agendar(duracaoMs, () => {
    useMascoteStore.getState().definirEmocao(proximaEmocao);
    if (aoConcluir) aoConcluir();
  });
}

export const useMascoteStore = create<EstadoMascote>()(
  persist(
    (set, get) => ({
      emocao: "idle",
      mensagem: null,
      visivel: true,
      mostrarConfetti: false,
      contextoSaudacao: null,
      acionarCelebracao: (motivo) => {
        agendador.limpar();
        set({
          emocao: "celebrating",
          mensagem: motivo,
          mostrarConfetti: true,
          contextoSaudacao: null,
        });
        agendarRetornoEmocao(tempos.celebracao, "walking", () => {
          set({ mostrarConfetti: false, mensagem: null });
        });
      },
      acionarPreocupacao: (quantidadePendente, mensagem) => {
        if (quantidadePendente <= 0) return;
        if (get().emocao === "celebrating" || get().emocao === "greeting") return;
        agendador.limpar();
        set({
          emocao: "concerned",
          mensagem,
          mostrarConfetti: false,
          contextoSaudacao: null,
        });
        agendarRetornoEmocao(tempos.preocupacao, "walking", () => {
          set({ mensagem: null });
        });
      },
      acionarSaudacao: (contexto, mensagem) => {
        agendador.limpar();
        set({
          emocao: "greeting",
          mensagem,
          mostrarConfetti: false,
          contextoSaudacao: contexto,
        });
        agendarRetornoEmocao(tempos.saudacao, "walking", () => {
          set({ mensagem: null, contextoSaudacao: null });
        });
      },
      definirEmocao: (emocao) => {
        if (emocao === "idle") {
          agendador.limpar();
          set({ emocao, mostrarConfetti: false });
          agendarRetornoEmocao(tempos.idle, "walking");
          return;
        }
        if (emocao === "walking") {
          agendador.limpar();
          set({ emocao });
          agendarRetornoEmocao(tempos.idle, "idle");
          return;
        }
        set({ emocao });
      },
      dispensarMensagem: () => set({ mensagem: null }),
      alternarVisibilidade: () => set((estado) => ({ visivel: !estado.visivel })),
      definirVisibilidade: (visivel) => set({ visivel }),
    }),
    {
      name: "hackerrank-study-mascote",
      partialize: (estado) => ({ visivel: estado.visivel }),
    },
  ),
);

/** Expõe o agendador para testes unitários. */
export const agendadorEmocaoMascoteParaTestes = agendador;
