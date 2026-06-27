import type { EmocaoMascote, ContextoSaudacaoMascote } from "./tiposMascote";

export type NomeAnimacaoMascote = "Bark" | "Jump" | "Run" | "Sit" | "Sneak" | "Walk";

export type ModoReproducaoAnimacao = "loop" | "once";

export type ConfigAnimacaoMascote = {
  clip: NomeAnimacaoMascote;
  modo: ModoReproducaoAnimacao;
  escalaTempo: number;
  velocidadeCaminhada: number;
};

const MAPA_SAUDACAO: Record<ContextoSaudacaoMascote, NomeAnimacaoMascote> = {
  lesson: "Walk",
  quiz: "Bark",
  project: "Run",
};

export function resolverAnimacaoMascote(input: {
  emocao: EmocaoMascote;
  contextoSaudacao: ContextoSaudacaoMascote | null;
}): ConfigAnimacaoMascote {
  if (input.emocao === "greeting") {
    const clip = input.contextoSaudacao ? MAPA_SAUDACAO[input.contextoSaudacao] : "Bark";
    const caminhada = clip === "Run" ? 1.35 : clip === "Walk" ? 0.95 : 0;
    return {
      clip,
      modo: clip === "Walk" || clip === "Run" ? "loop" : "once",
      escalaTempo: clip === "Run" ? 1.15 : 1,
      velocidadeCaminhada: caminhada,
    };
  }

  switch (input.emocao) {
    case "walking":
      return { clip: "Walk", modo: "loop", escalaTempo: 1, velocidadeCaminhada: 0.85 };
    case "celebrating":
      return { clip: "Jump", modo: "loop", escalaTempo: 1.1, velocidadeCaminhada: 0.55 };
    case "concerned":
      return { clip: "Sneak", modo: "loop", escalaTempo: 0.75, velocidadeCaminhada: 0.35 };
    case "idle":
    default:
      return { clip: "Sit", modo: "loop", escalaTempo: 1, velocidadeCaminhada: 0.12 };
  }
}
