import { useEffect, useRef } from "react";
import { playPomodoroNotification, resumePomodoroAudio } from "../usecases/pomodoroSound";
import { usePomodoroStore } from "../stores/pomodoroStore";

/** Keeps the pomodoro countdown running for the whole app session (not tied to popover mount). */
export function usePomodoroTimer() {
  const status = usePomodoroStore((s) => s.status);
  const sync = usePomodoroStore((s) => s.sync);
  const prevStatusRef = useRef(status);

  useEffect(() => {
    if (status !== "running") return;

    sync();
    const intervalId = window.setInterval(sync, 1000);

    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") sync();
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      window.clearInterval(intervalId);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [status, sync]);

  useEffect(() => {
    const prev = prevStatusRef.current;
    if (prev === "running" && status === "finished") {
      void playPomodoroNotification("finished");
    }
    prevStatusRef.current = status;
  }, [status]);
}

export async function primePomodoroAudio(): Promise<void> {
  await resumePomodoroAudio();
}
