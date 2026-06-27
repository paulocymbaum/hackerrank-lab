export type EmocaoMascote = "idle" | "walking" | "celebrating" | "concerned" | "greeting";

export type ContextoSaudacaoMascote = "lesson" | "quiz" | "project";

export type EstadoVisualMascote = {
  emocao: EmocaoMascote;
  contextoSaudacao: ContextoSaudacaoMascote | null;
  visivel: boolean;
};
