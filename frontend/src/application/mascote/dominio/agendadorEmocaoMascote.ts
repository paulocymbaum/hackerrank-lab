export type AgendadorEmocaoMascote = {
  agendar: (duracaoMs: number, callback: () => void) => void;
  limpar: () => void;
};

export function criarAgendadorEmocaoMascote(): AgendadorEmocaoMascote {
  let temporizador: ReturnType<typeof setTimeout> | null = null;

  return {
    agendar(duracaoMs, callback) {
      if (temporizador) clearTimeout(temporizador);
      temporizador = setTimeout(() => {
        temporizador = null;
        callback();
      }, duracaoMs);
    },
    limpar() {
      if (temporizador) {
        clearTimeout(temporizador);
        temporizador = null;
      }
    },
  };
}
