import { describe, expect, it } from "vitest";
import { prepararAnimacoesInPlace } from "./mutarRootMotionLocomocao";

describe("prepararAnimacoesInPlace", () => {
  it("remove faixa Hips.position de Walk e Run", () => {
    const walk = {
      name: "Walk",
      duration: 1,
      tracks: [
        { name: "Hips.position" },
        { name: "Hips.quaternion" },
        { name: "Spine_1.quaternion" },
      ],
    } as unknown as import("three").AnimationClip;

    const run = {
      name: "Run",
      duration: 1,
      tracks: [{ name: "Hips.position" }, { name: "root.rotation" }],
    } as unknown as import("three").AnimationClip;

    const sit = {
      name: "Sit",
      duration: 1,
      tracks: [{ name: "Hips.position" }],
    } as unknown as import("three").AnimationClip;

    const sneak = {
      name: "Sneak",
      duration: 1,
      tracks: [{ name: "Hips.position" }, { name: "Spine.quaternion" }],
    } as unknown as import("three").AnimationClip;

    const [walkInPlace, runInPlace, sneakInPlace, sitClip] = prepararAnimacoesInPlace([
      walk,
      run,
      sneak,
      sit,
    ]);

    expect(walkInPlace.tracks.some((t) => t.name === "Hips.position")).toBe(false);
    expect(runInPlace.tracks.some((t) => t.name === "Hips.position")).toBe(false);
    expect(sneakInPlace.tracks.some((t) => t.name === "Hips.position")).toBe(false);
    expect(sitClip.tracks.some((t) => t.name === "Hips.position")).toBe(true);
  });
});
