import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { usePomodoroStore } from "./pomodoroStore";

describe("pomodoroStore", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-01T12:00:00Z"));
    usePomodoroStore.getState().reset();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("counts down via sync using wall-clock deadline", () => {
    usePomodoroStore.getState().start();
    expect(usePomodoroStore.getState().status).toBe("running");

    vi.advanceTimersByTime(2000);
    usePomodoroStore.getState().sync();

    const remaining = usePomodoroStore.getState().remainingSeconds;
    expect(remaining).toBe(25 * 60 - 2);
  });

  it("marks session finished when deadline passes", () => {
    usePomodoroStore.getState().start();

    vi.advanceTimersByTime(25 * 60 * 1000 + 1);
    usePomodoroStore.getState().sync();

    expect(usePomodoroStore.getState().status).toBe("finished");
    expect(usePomodoroStore.getState().remainingSeconds).toBe(0);
  });

  it("reset returns to idle with full duration", () => {
    usePomodoroStore.getState().start();
    vi.advanceTimersByTime(5000);
    usePomodoroStore.getState().sync();
    usePomodoroStore.getState().reset();

    const state = usePomodoroStore.getState();
    expect(state.status).toBe("idle");
    expect(state.remainingSeconds).toBe(25 * 60);
    expect(state.endsAt).toBeNull();
  });
});
