import { create } from "zustand";

export const POMODORO_DURATION_SECONDS = 25 * 60;

export type PomodoroStatus = "idle" | "running" | "finished";

type PomodoroState = {
  status: PomodoroStatus;
  remainingSeconds: number;
  durationSeconds: number;
  /** Wall-clock deadline while running — keeps countdown accurate when the tab is backgrounded. */
  endsAt: number | null;
  start: () => void;
  reset: () => void;
  sync: () => void;
};

export const usePomodoroStore = create<PomodoroState>((set, get) => ({
  status: "idle",
  remainingSeconds: POMODORO_DURATION_SECONDS,
  durationSeconds: POMODORO_DURATION_SECONDS,
  endsAt: null,

  start: () => {
    const { durationSeconds } = get();
    set({
      status: "running",
      remainingSeconds: durationSeconds,
      endsAt: Date.now() + durationSeconds * 1000,
    });
  },

  reset: () => {
    const { durationSeconds } = get();
    set({
      status: "idle",
      remainingSeconds: durationSeconds,
      endsAt: null,
    });
  },

  sync: () => {
    const { status, endsAt, durationSeconds } = get();
    if (status !== "running" || endsAt === null) return;

    const remaining = Math.max(0, Math.ceil((endsAt - Date.now()) / 1000));
    if (remaining <= 0) {
      set({ status: "finished", remainingSeconds: 0, endsAt: null });
      return;
    }

    if (remaining !== get().remainingSeconds) {
      set({ remainingSeconds: remaining });
    }
  },
}));

export function formatPomodoroTime(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}
