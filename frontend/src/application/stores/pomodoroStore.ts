import { create } from "zustand";

export const POMODORO_DURATION_SECONDS = 25 * 60;

export type PomodoroStatus = "idle" | "running" | "finished";

type PomodoroState = {
  status: PomodoroStatus;
  remainingSeconds: number;
  durationSeconds: number;
  start: () => void;
  reset: () => void;
  tick: () => void;
};

export const usePomodoroStore = create<PomodoroState>((set, get) => ({
  status: "idle",
  remainingSeconds: POMODORO_DURATION_SECONDS,
  durationSeconds: POMODORO_DURATION_SECONDS,
  start: () => {
    const { durationSeconds } = get();
    set({
      status: "running",
      remainingSeconds: durationSeconds,
    });
  },
  reset: () => {
    const { durationSeconds } = get();
    set({
      status: "idle",
      remainingSeconds: durationSeconds,
    });
  },
  tick: () => {
    const { status, remainingSeconds } = get();
    if (status !== "running") return;

    if (remainingSeconds <= 1) {
      set({ status: "finished", remainingSeconds: 0 });
      return;
    }

    set({ remainingSeconds: remainingSeconds - 1 });
  },
}));

export function formatPomodoroTime(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}
