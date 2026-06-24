import clsx from "clsx";
import type { ProjectStatus } from "../../../domain/types/quizScore";
import { useActivityScoreLabels } from "../../../application/hooks/useLocalizedLabels";
import { useTranslation } from "../../../application/hooks/useTranslation";
import { ProgressBar, type ProgressBarSize } from "../../design-system";
import { ProjectStatusBadge } from "../../features/course-experience/components/ProjectStatusBadge";
import { projectProgressMetrics } from "./activityScoreLabels";

export function ProjectScoreProgress(props: {
  status: ProjectStatus;
  points?: number;
  layout?: "stack" | "inline";
  barSize?: ProgressBarSize;
  className?: string;
}) {
  const { t } = useTranslation();
  const { formatProjectScoreLabel } = useActivityScoreLabels();
  const points = props.points ?? 0;
  const { value, max } = projectProgressMetrics(props.status, points);
  const scoreLabel = formatProjectScoreLabel(props.status, points);
  const layout = props.layout ?? "stack";
  const barSize = props.barSize ?? "sm";

  if (layout === "inline") {
    return (
      <div className={clsx("flex min-w-[10rem] flex-col gap-1.5", props.className)}>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <ProjectStatusBadge value={props.status} size="sm" />
          <span className="shrink-0 text-meta font-medium text-text1">{scoreLabel}</span>
        </div>
        <ProgressBar
          value={value}
          max={max}
          size={barSize}
          aria-label={t("project.progressAria", { value, max })}
        />
      </div>
    );
  }

  return (
    <div className={clsx("grid min-w-[8rem] gap-1.5", props.className)}>
      <div className="flex items-center justify-between gap-2">
        <ProjectStatusBadge value={props.status} size="sm" />
        <span className="shrink-0 text-meta font-medium text-text1">{scoreLabel}</span>
      </div>
      <ProgressBar
        value={value}
        max={max}
        size={barSize}
        aria-label={t("project.progressAria", { value, max })}
      />
    </div>
  );
}
