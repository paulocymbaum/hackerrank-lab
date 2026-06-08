import clsx from "clsx";
import type { ProjectStatus } from "../../../../domain/types/quizScore";
import { PROJECT_POINTS_WEIGHT } from "../../../../domain/types/quizScore";
import { Button } from "../../../design-system";

const STATUS_OPTIONS: { value: ProjectStatus; label: string }[] = [
  { value: "pending", label: "Pending" },
  { value: "doing", label: "Doing" },
  { value: "done", label: "Done" },
];

export function ProjectStatusControl(props: {
  value: ProjectStatus;
  onChange: (status: ProjectStatus) => void;
  size?: "sm" | "md";
  showPoints?: boolean;
}) {
  const size = props.size ?? "sm";

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div
        className="inline-flex rounded-panel border border-border0 bg-surfacePanel p-0.5"
        role="group"
        aria-label="Project status"
      >
        {STATUS_OPTIONS.map((option) => (
          <Button
            key={option.value}
            type="button"
            size={size}
            variant={props.value === option.value ? "primary" : "ghost"}
            className={clsx(
              size === "sm" && "min-w-[4.5rem]",
              props.value !== option.value && "text-text1",
            )}
            aria-pressed={props.value === option.value}
            onClick={() => props.onChange(option.value)}
          >
            {option.label}
          </Button>
        ))}
      </div>
      {props.showPoints && props.value === "done" ? (
        <span className="text-meta font-medium text-successText">+{PROJECT_POINTS_WEIGHT} pts</span>
      ) : null}
    </div>
  );
}
