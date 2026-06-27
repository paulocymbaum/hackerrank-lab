const raioPlaneta = 2;

export const CONFIGURACAO_MASCOTE = {
  modelo: {
    caminho: "/models/mascote/exported-model.glb",
    euler: [0, 0, 0] as const,
    offsetPe: 0,
    escalaSobrePlaneta: raioPlaneta * 0.22,
    posicaoAncoragem: [0, raioPlaneta, 0] as const,
  },
  planeta: {
    raio: raioPlaneta,
    inclinacaoRad: -0.15,
    grama: {
      corBase: "#3f8f52",
      gradiente: ["#2d6a3e", "#3f8f52", "#2f7040"] as const,
      manchas: ["#357a46", "#4ca861"] as const,
    },
    arbustos: {
      posicoes: [
        { lat: 18, lon: 35, escala: 1.05 },
        { lat: 8, lon: 120, escala: 0.9 },
        { lat: -6, lon: 210, escala: 0.85 },
        { lat: 22, lon: 280, escala: 0.95 },
        { lat: -12, lon: 75, escala: 0.75 },
      ] as const,
      cores: ["#2f6b3f", "#3a7a4d", "#356f44"] as const,
      geometria: {
        corpo: { raio: 0.11, segmentos: [8, 6] as const, altura: 0.14, roughness: 0.92 },
        folhaEsquerda: {
          raio: 0.07,
          segmentos: [6, 5] as const,
          posicao: [-0.07, 0.09, 0.04] as const,
          roughness: 0.9,
        },
        folhaDireita: {
          raio: 0.06,
          segmentos: [6, 5] as const,
          posicao: [0.06, 0.08, -0.05] as const,
          roughness: 0.9,
        },
      },
    },
  },
  cena: {
    azimuteCaminhadaGraus: 20,
    correcaoYawMascoteRad: 0,
    camera: {
      distancia: 1.75,
      pitchGraus: 16,
      alturaOlhar: 0.12,
      deslocamentoAzimuteGraus: 32,
      sentido: "frente" as const,
      zoom: {
        inicial: 1,
        minimo: 0.38,
        maximo: 1.45,
        sensibilidadeArraste: 0.0035,
        suavizacao: 9,
      },
    },
  },
  ambiente: {
    corCeu: "#8ec5e8",
    neblina: { cor: "#8ec5e8", near: 5, far: 16 },
    fov: 38,
    near: 0.1,
    far: 100,
    posicaoCameraInicial: [0, 2.5, -3] as const,
    luzHemisferio: { sky: "#dff5e8", ground: "#1a3a52", intensity: 0.95, posicao: [0, 8, 0] as const },
    luzDirecional: { intensity: 1.5, posicao: [4, 6, 3] as const },
    luzAmbiente: { intensity: 0.35 },
  },
  emocao: {
    limiarQuizConcluido: 0.7,
    temposMs: {
      idle: 30_000,
      saudacao: 4_000,
      celebracao: 6_000,
      preocupacao: 8_000,
      caminhada: 12_000,
    },
    crossfadeSegundos: 0.35,
  },
  ui: {
    confetti: ["#f97316", "#22c55e", "#3b82f6", "#eab308", "#ec4899", "#a855f7"] as const,
    particulasConfetti: 24,
    zIndex: 40,
  },
} as const;
