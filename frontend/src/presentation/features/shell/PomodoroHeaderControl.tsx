import clsx from "clsx";
import { Timer } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "../../../application/hooks/useTranslation";
import { primePomodoroAudio } from "../../../application/hooks/usePomodoroTimer";
import { playPomodoroNotification } from "../../../application/usecases/pomodoroSound";
import {
  formatPomodoroTime,
  usePomodoroStore,
} from "../../../application/stores/pomodoroStore";
import { Button, Icon, Popover } from "../../design-system";

export function PomodoroHeaderControl() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const status = usePomodoroStore((s) => s.status);
  const remainingSeconds = usePomodoroStore((s) => s.remainingSeconds);
  const durationSeconds = usePomodoroStore((s) => s.durationSeconds);
  const start = usePomodoroStore((s) => s.start);
  const reset = usePomodoroStore((s) => s.reset);

  const handleReset = () => {
    reset();
    void playPomodoroNotification("reset");
    setOpen(false);
  };

  const handleStart = () => {
    void primePomodoroAudio();
    start();
    setOpen(false);
  };

  const handleStartAgain = () => {
    void primePomodoroAudio();
    reset();
    start();
    setOpen(false);
  };

  const handleTriggerClick = () => {
    if (status === "idle") {
      handleStart();
      return;
    }
    setOpen((value) => !value);
  };

  const showTimer = status !== "idle";
  const timeLabel = formatPomodoroTime(remainingSeconds);
  const durationLabel = formatPomodoroTime(durationSeconds);

  const statusLabel =
    status === "idle"
      ? t("pomodoro.status.idle")
      : status === "running"
        ? t("pomodoro.status.running")
        : t("pomodoro.status.finished");

  return (
    <Popover
      align="end"
      open={open}
      onOpenChange={setOpen}
      panelClassName="w-[min(100vw-2rem,16rem)] p-3"
      trigger={({ open: isOpen, triggerId, panelId }) => (
        <button
          id={triggerId}
          type="button"
          aria-expanded={isOpen}
          aria-controls={panelId}
          aria-label={t("pomodoro.ariaLabel")}
          onClick={handleTriggerClick}
          className={clsx(
            "inline-flex h-9 items-center gap-2 rounded-panel border px-3 text-meta font-medium transition",
            "border-border0 bg-surfacePanel text-text0 hover:bg-surfaceControl",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent0/60",
            status === "running" && "border-accent0/40 bg-surfaceAccent text-accent0",
            status === "finished" && "border-successBorder/50 bg-successFill/40 text-successIcon",
          )}
        >
          <Icon icon={Timer} size={16} />
          <span>{status === "idle" ? t("pomodoro.start") : t("pomodoro.label")}</span>
          {showTimer ? (
            <span className="font-mono tabular-nums text-meta font-semibold">{timeLabel}</span>
          ) : null}
        </button>
      )}
    >
      <div className="grid gap-3">
        <div>
          <p className="m-0 text-body font-semibold text-text0">{t("pomodoro.label")}</p>
          <p className="m-0 mt-1 text-meta text-text1">
            {t("pomodoro.focusSession", { duration: durationLabel })}
          </p>
        </div>

        <div className="rounded-panel border border-border0 bg-surfacePanel px-3 py-2 text-center">
          <p className="m-0 text-meta text-text1">{t("pomodoro.timeRemaining")}</p>
          <p className="m-0 mt-1 font-mono text-title font-semibold tabular-nums text-text0">
            {timeLabel}
          </p>
          <p className="m-0 mt-1 text-meta text-text2">{statusLabel}</p>
        </div>

        <div className="grid gap-2">
          {status === "idle" ? (
            <Button variant="primary" size="sm" className="w-full" onClick={handleStart}>
              {t("pomodoro.start")}
            </Button>
          ) : null}

          {status === "finished" ? (
            <>
              <Button variant="primary" size="sm" className="w-full" onClick={handleStartAgain}>
                {t("pomodoro.startAgain")}
              </Button>
              <Button variant="secondary" size="sm" className="w-full" onClick={handleReset}>
                {t("pomodoro.reset")}
              </Button>
            </>
          ) : null}

          {status === "running" ? (
            <>
              <p className="m-0 text-center text-meta text-text1">{t("pomodoro.runsInBackground")}</p>
              <Button variant="secondary" size="sm" className="w-full" onClick={handleReset}>
                {t("pomodoro.cancel")}
              </Button>
            </>
          ) : null}
        </div>
      </div>
    </Popover>
  );
}
