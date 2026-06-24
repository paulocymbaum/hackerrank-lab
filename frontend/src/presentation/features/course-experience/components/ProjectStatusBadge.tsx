import clsx from "clsx";
import type { ProjectStatus } from "../../../../domain/types/quizScore";
import { PROJECT_POINTS_WEIGHT } from "../../../../domain/types/quizScore";
import { useProjectStatusLabels } from "../../../../application/hooks/useLocalizedLabels";

export function ProjectStatusBadge(props: {
  value: ProjectStatus;
  showPoints?: boolean;
  size?: "sm" | "md";
}) {
  const statusLabels = useProjectStatusLabels();
  const size = props.size ?? "sm";

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span
        className={clsx(
          "inline-flex items-center rounded-pill border font-medium",
          size === "sm" ? "px-2.5 py-1 text-meta" : "px-3 py-1.5 text-body",
          props.value === "pending" && "border-border0 bg-surfacePanel text-text1",
          props.value === "doing" && "border-accent0/30 bg-surfaceAccent text-text0",
          props.value === "done" &&
            "border-successBorder bg-successFill text-successText",
        )}
      >
        {statusLabels[props.value]}
      </span>
      {props.showPoints && props.value === "done" ? (
        <span className="text-meta font-medium text-successText">+{PROJECT_POINTS_WEIGHT} pts</span>
      ) : null}
    </div>
  );
}
