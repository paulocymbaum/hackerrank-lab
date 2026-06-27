import { describe, expect, it } from "vitest";
import * as THREE from "three";
import {
  aplicarOffsetPeNoModelo,
  calcularOffsetVerticalPe,
  clipExigeApoioPatasNoChao,
} from "./apoioPatasMascote";

describe("apoioPatasMascote", () => {
  it("Walk/Run exigem apoio dinâmico; Sit, Jump e null não", () => {
    expect(clipExigeApoioPatasNoChao("Walk")).toBe(true);
    expect(clipExigeApoioPatasNoChao("Run")).toBe(true);
    expect(clipExigeApoioPatasNoChao("Sneak")).toBe(true);
    expect(clipExigeApoioPatasNoChao("Sit")).toBe(false);
    expect(clipExigeApoioPatasNoChao("Jump")).toBe(false);
    expect(clipExigeApoioPatasNoChao(null)).toBe(false);
  });

  it("calcularOffsetVerticalPe usa menor Y local das pontas das patas", () => {
    const referencia = new THREE.Group();
    const apoio = new THREE.Group();
    const raiz = new THREE.Group();
    referencia.add(apoio);
    apoio.add(raiz);

    const pata = new THREE.Object3D();
    pata.name = "Front_Leg_Tip_L";
    pata.position.y = -0.4;
    raiz.add(pata);

    expect(calcularOffsetVerticalPe(raiz, referencia)).toBeCloseTo(0.4, 5);
  });

  it("aplicarOffsetPeNoModelo ajusta o grupo de apoio", () => {
    const referencia = new THREE.Group();
    const apoio = new THREE.Group();
    const raiz = new THREE.Group();
    referencia.add(apoio);
    apoio.add(raiz);

    const pata = new THREE.Object3D();
    pata.name = "Back_Leg_Tip_R";
    pata.position.y = -0.25;
    raiz.add(pata);

    aplicarOffsetPeNoModelo(apoio, raiz, referencia, 0.05);
    expect(apoio.position.y).toBeCloseTo(0.3, 5);
  });
});
