import { describe, expect, it } from "vitest";
import {
  normalizar,
  produtoEscalar,
  produtoVetorial,
  projetarNoPlano,
  vetor3,
} from "./vetoresMascote";

describe("vetoresMascote", () => {
  it("produto vetorial de X e Y aponta em Z", () => {
    const z = produtoVetorial([1, 0, 0], [0, 1, 0]);
    expect(z[2]).toBeCloseTo(1, 5);
  });

  it("normalizar retorna vetor unitário", () => {
    const u = normalizar([3, 0, 4]);
    expect(u[0]).toBeCloseTo(0.6, 5);
    expect(u[2]).toBeCloseTo(0.8, 5);
  });

  it("projetarNoPlano remove componente na normal", () => {
    const v = projetarNoPlano([1, 1, 0], [0, 1, 0]);
    expect(v[0]).toBeCloseTo(1, 5);
    expect(v[1]).toBeCloseTo(0, 5);
  });

  it("projetarNoPlano é perpendicular à normal", () => {
    const normal = normalizar([0, 2, 0]);
    const v = projetarNoPlano([1, 1, 1], normal);
    expect(produtoEscalar(v, normal)).toBeCloseTo(0, 5);
  });
});

describe("ancoraMascote", () => {
  it("polo inclinado gera normal unitária radial", async () => {
    const { calcularAncoraNoPolo } = await import("./ancoraMascote");
    const ancora = calcularAncoraNoPolo(2, -0.15, 20);

    const n = normalizar(ancora.posicao);
    expect(ancora.normal[0]).toBeCloseTo(n[0], 5);
    expect(ancora.normal[1]).toBeCloseTo(n[1], 5);
    expect(ancora.normal[2]).toBeCloseTo(n[2], 5);
  });
});

describe("esteiraPlanetaMascote", () => {
  it("eixo é perpendicular à normal e à tangente", async () => {
    const { calcularRotacaoEsteiraPlaneta } = await import("./esteiraPlanetaMascote");
    const normal = vetor3(0, 1, 0);
    const tangente = vetor3(0, 0, 1);
    const { eixo, anguloDelta } = calcularRotacaoEsteiraPlaneta(0.5, 1.25, normal, tangente);

    expect(produtoEscalar(eixo, normal)).toBeCloseTo(0, 5);
    expect(produtoEscalar(eixo, tangente)).toBeCloseTo(0, 5);
    expect(anguloDelta).toBeCloseTo(-0.4, 5);
  });

  it("frente +Z gera eixo de rotação em X", async () => {
    const { calcularRotacaoEsteiraPlaneta } = await import("./esteiraPlanetaMascote");
    const { eixo } = calcularRotacaoEsteiraPlaneta(1, 1, [0, 1, 0], [0, 0, 1]);

    expect(Math.abs(eixo[0])).toBeCloseTo(1, 5);
    expect(Math.abs(eixo[1])).toBeCloseTo(0, 5);
    expect(Math.abs(eixo[2])).toBeCloseTo(0, 5);
  });
});

describe("cameraFisicaMascote", () => {
  const PARAMETROS = {
    distancia: 2.85,
    pitchGraus: 52,
    azimuteCaminhadaGraus: 45,
  };
  const ANCORAGEM = vetor3(0, 1.25, 0);

  it("offset da câmera respeita o pitch configurado", async () => {
    const { calcularOffsetCamera } = await import("./cameraFisicaMascote");
    const offset = calcularOffsetCamera(PARAMETROS, "frente");
    const elevacao = Math.asin(offset[1] / PARAMETROS.distancia);
    expect((elevacao * 180) / Math.PI).toBeCloseTo(PARAMETROS.pitchGraus, 0);
  });

  it("deslocamento de azimute desloca lateralmente sem alterar elevação", async () => {
    const { calcularOffsetCamera } = await import("./cameraFisicaMascote");
    const base = calcularOffsetCamera(PARAMETROS, "frente");
    const deslocada = calcularOffsetCamera(
      { ...PARAMETROS, deslocamentoAzimuteGraus: 32 },
      "frente",
    );

    expect(deslocada[1]).toBeCloseTo(base[1], 5);
    expect(deslocada[0] !== base[0] || deslocada[2] !== base[2]).toBe(true);
  });

  it("câmera à frente da caminhada fica em +X e +Z na diagonal 45°", async () => {
    const { calcularPosicaoCamera } = await import("./cameraFisicaMascote");
    const camera = calcularPosicaoCamera(ANCORAGEM, PARAMETROS, "frente");
    expect(camera[0]).toBeGreaterThan(ANCORAGEM[0]);
    expect(camera[2]).toBeGreaterThan(ANCORAGEM[2]);
    expect(camera[1]).toBeGreaterThan(ANCORAGEM[1]);
  });

  it("câmera atrás inverte o offset horizontal em relação à frente", async () => {
    const { calcularOffsetCamera } = await import("./cameraFisicaMascote");
    const frente = calcularOffsetCamera(PARAMETROS, "frente");
    const atras = calcularOffsetCamera(PARAMETROS, "atras");
    expect(atras[0]).toBeCloseTo(-frente[0], 5);
    expect(atras[1]).toBeCloseTo(frente[1], 5);
    expect(atras[2]).toBeCloseTo(-frente[2], 5);
  });
});

describe("simuladorFisicaMascote", () => {
  it("walking produz deslocamento de esteira positivo", async () => {
    const { avancarSimulacaoFisicaMascote } = await import("./simuladorFisicaMascote");
    const { resolverEstadoFrameCenaMascote } = await import("../dominio/resolverEstadoCenaMascote");

    const frame = resolverEstadoFrameCenaMascote({
      emocao: "walking",
      contextoSaudacao: null,
      fatorZoom: 1,
    });

    const estado = avancarSimulacaoFisicaMascote({
      frame,
      deltaSegundos: 1,
      alturaOlhar: 0.12,
    });

    expect(estado.esteira.deslocamento).toBeGreaterThan(0);
    expect(estado.animacao.clip).toBe("Walk");
  });

  it("idle produz esteira lenta", async () => {
    const { avancarSimulacaoFisicaMascote } = await import("./simuladorFisicaMascote");
    const { resolverEstadoFrameCenaMascote } = await import("../dominio/resolverEstadoCenaMascote");

    const frame = resolverEstadoFrameCenaMascote({
      emocao: "idle",
      contextoSaudacao: null,
      fatorZoom: 1,
    });

    const estado = avancarSimulacaoFisicaMascote({
      frame,
      deltaSegundos: 1,
      alturaOlhar: 0.12,
    });

    expect(estado.esteira.deslocamento).toBeCloseTo(0.12, 5);
    expect(estado.animacao.clip).toBe("Sit");
  });
});
