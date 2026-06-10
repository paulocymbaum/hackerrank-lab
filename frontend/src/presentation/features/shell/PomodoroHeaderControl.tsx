import clsx from "clsx";
import { Timer } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { playPomodoroNotification } from "../../../application/usecases/pomodoroSound";
import {
  formatPomodoroTime,
  usePomodoroStore,
} from "../../../application/stores/pomodoroStore";
import { Button, Icon, Popover } from "../../design-system";

export function PomodoroHeaderControl() {
  const [open, setOpen] = useState(false);
  const status = usePomodoroStore((s) => s.status);
  const remainingSeconds = usePomodoroStore((s) => s.remainingSeconds);
  const durationSeconds = usePomodoroStore((s) => s.durationSeconds);
  const start = usePomodoroStore((s) => s.start);
  const reset = usePomodoroStore((s) => s.reset);
  const tick = usePomodoroStore((s) => s.tick);

  const prevStatusRef = useRef(status);

  useEffect(() => {
    if (status !== "running") return;

    const intervalId = window.setInterval(() => {
      tick();
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [status, tick]);

  useEffect(() => {
    const prev = prevStatusRef.current;
    if (prev === "running" && status === "finished") {
      void playPomodoroNotification("finished");
    }
    prevStatusRef.current = status;
  }, [status]);

  const handleReset = () => {
    reset();
    void playPomodoroNotification("reset");
    setOpen(false);
  };

  const handleStart = () => {
    start();
    setOpen(false);
  };

  const showTimer = status !== "idle";
  const timeLabel = formatPomodoroTime(remainingSeconds);

  return (
    <Popover
      align="end"
      open={open}
      onOpenChange={setOpen}
      panelClassName="w-[min(100vw-2rem,16rem)] p-3"
      trigger={({ open: isOpen, toggle, triggerId, panelId }) => (
        <button
          id={triggerId}
          type="button"
          aria-expanded={isOpen}
          aria-controls={panelId}
          aria-label="Pomodoro"
          onClick={toggle}
          className={clsx(
            "inline-flex h-9 items-center gap-2 rounded-panel border px-3 text-meta font-medium transition",
            "border-border0 bg-surfacePanel text-text0 hover:bg-surfaceControl",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent0/60",
            status === "running" && "border-accent0/40 bg-surfaceAccent text-accent0",
            status === "finished" && "border-successBorder/50 bg-successFill/40 text-successIcon",
          )}
        >
          <Icon icon={Timer} size={16} />
          <span>Pomodoro</span>
          {showTimer ? (
            <span className="font-mono tabular-nums text-meta font-semibold">{timeLabel}</span>
          ) : null}
        </button>
      )}
    >
      <div className="grid gap-3">
        <div>
          <p className="m-0 text-body font-semibold text-text0">Pomodoro</p>
          <p className="m-0 mt-1 text-meta text-text1">
            Sessão de foco de {formatPomodoroTime(durationSeconds)}.
          </p>
        </div>

        <div className="rounded-panel border border-border0 bg-surfacePanel px-3 py-2 text-center">
          <p className="m-0 text-meta text-text1">Tempo restante</p>
          <p className="m-0 mt-1 font-mono text-title font-semibold tabular-nums text-text0">
            {timeLabel}
          </p>
          <p className="m-0 mt-1 text-meta text-text2">
            {status === "idle" && "Pronto para iniciar"}
            {status === "running" && "Em andamento"}
            {status === "finished" && "Sessão finalizada"}
          </p>
        </div>

        <div className="grid gap-2">
          {status === "idle" ? (
            <Button variant="primary" size="sm" className="w-full" onClick={handleStart}>
              Iniciar Pomodoro
            </Button>
          ) : null}

          {status === "finished" ? (
            <Button variant="secondary" size="sm" className="w-full" onClick={handleReset}>
              Reiniciar
            </Button>
          ) : null}

          {status === "running" ? (
            <p className="m-0 text-center text-meta text-text1">
              O timer continua com o dropdown fechado.
            </p>
          ) : null}
        </div>
      </div>
    </Popover>
  );
}
