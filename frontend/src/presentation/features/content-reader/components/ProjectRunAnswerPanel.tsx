import type { ProjectRunErrorCode, ProjectRunResult } from "../../../../domain/types/projectRun";
import { useTranslation } from "../../../../application/hooks/useTranslation";
import { Button } from "../../../design-system";

function runErrorMessage(
  t: ReturnType<typeof useTranslation>["t"],
  error: ProjectRunErrorCode | "dev_server",
): string {
  if (error === "dev_server") return t("delivery.runSampleDevServerRequired");
  if (error === "missing_sample_input") return t("delivery.missingTestFile");
  if (error === "missing_starter") return t("delivery.runSampleUnavailable");
  return t("delivery.runSampleDevServerRequired");
}

export function ProjectRunAnswerPanel(props: {
  canRun: boolean;
  running: boolean;
  result: ProjectRunResult | null;
  error: ProjectRunErrorCode | "dev_server" | null;
  onRun: () => void;
}) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-2 rounded-panel border border-border0 bg-surfacePanel p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="m-0 text-meta text-text1">{t("delivery.runAnswerHint")}</p>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          disabled={!props.canRun || props.running}
          title={props.canRun ? t("delivery.runAnswerTooltip") : t("delivery.runSampleUnavailable")}
          onClick={props.onRun}
        >
          {props.running ? t("delivery.runningSample") : t("delivery.runAnswer")}
        </Button>
      </div>

      {props.error ? (
        <p className="m-0 text-meta text-text1">{runErrorMessage(t, props.error)}</p>
      ) : null}

      {props.result ? (
        <div className="overflow-hidden rounded-panel border border-border0 bg-surfaceControl">
          <div className="border-b border-border0 px-3 py-2 font-mono text-meta text-text1">
            {props.result.command}
            {props.result.timedOut ? ` · ${t("delivery.runSampleTimedOut")}` : null}
          </div>
          <pre className="m-0 max-h-64 overflow-auto whitespace-pre-wrap break-words p-3 font-mono text-meta text-text0">
            {[props.result.stdout, props.result.stderr].filter(Boolean).join("") ||
              t("delivery.runSampleNoOutput")}
            {"\n"}
            {t("delivery.runSampleExitCode", { code: String(props.result.exitCode) })}
          </pre>
          {!props.result.stdout && !props.result.stderr && props.result.exitCode === 0 ? (
            <p className="m-0 border-t border-border0 px-3 py-2 text-meta text-text1">
              {t("delivery.runSampleInsufficientInput")}
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
