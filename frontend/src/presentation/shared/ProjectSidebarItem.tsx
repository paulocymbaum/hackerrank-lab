import clsx from "clsx";
import type { ProjectStatus } from "../../domain/types/quizScore";
import { useActivityScoreLabels } from "../../application/hooks/useLocalizedLabels";
import { useTranslation } from "../../application/hooks/useTranslation";
import { ProgressBar } from "../design-system";
import { ProjectStatusBadge } from "../features/course-experience/components/ProjectStatusBadge";
import { projectProgressMetrics } from "./score/activityScoreLabels";

export function ProjectSidebarItem(props: {
  title: string;
  status: ProjectStatus;
  points?: number;
  active?: boolean;
  onClick: () => void;
}) {
  const { t } = useTranslation();
  const { formatProjectScoreLabel } = useActivityScoreLabels();
  const points = props.points ?? 0;
  const { value, max } = projectProgressMetrics(props.status, points);
  const scoreLabel = formatProjectScoreLabel(props.status, points);

  return (
    <button
      type="button"
      className={clsx(
        "flex w-full flex-col gap-2 rounded-panel border px-3 py-2.5 text-left transition",
        props.active
          ? "border-transparent bg-accentFill text-textOnAccent"
          : "border-border0 bg-surfaceControl text-text0 hover:brightness-[1.03]",
      )}
      onClick={props.onClick}
    >
      <span className="truncate text-body font-medium">{props.title}</span>
      <div className="flex items-center justify-between gap-2">
        <ProjectStatusBadge value={props.status} size="sm" />
        <span
          className={clsx(
            "truncate text-meta",
            props.active ? "text-textOnAccent/80" : "text-text1",
          )}
        >
          {scoreLabel}
        </span>
      </div>
      <ProgressBar
        value={value}
        max={max}
        size="sm"
        aria-label={t("project.progressAria", { value, max })}
      />
    </button>
  );
}
