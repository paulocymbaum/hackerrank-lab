import type { Course } from "../../../../domain/types/catalog";
import { useCoursePoints } from "../../../../application/hooks/useCoursePoints";
import { PROJECT_POINTS_WEIGHT } from "../../../../domain/types/quizScore";
import { Card, Icon } from "../../../design-system";
import { Trophy } from "lucide-react";
import clsx from "clsx";

export function CourseScoreBadge(props: {
  courseId: string;
  course: Course;
  className?: string;
}) {
  const points = useCoursePoints(props.courseId, props.course);

  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 rounded-pill border border-border0 bg-surfaceControl px-2.5 py-1 text-meta font-medium text-text0",
        props.className,
      )}
    >
      <Icon icon={Trophy} size={14} className="shrink-0 text-accent0" />
      <span>
        {points.totalPoints}
        {points.totalMax > 0 ? ` / ${points.totalMax}` : ""} pts
      </span>
    </span>
  );
}

export function CourseScoreSummary(props: {
  courseId: string;
  course: Course;
  variant?: "full" | "compact";
}) {
  const points = useCoursePoints(props.courseId, props.course);
  const variant = props.variant ?? "full";

  if (variant === "compact") {
    return (
      <Card variant="panel" className="border-border0 bg-surfacePanel px-4 py-3">
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-body font-semibold text-text0">
            <Icon icon={Trophy} className="text-accent0" />
            <span>Course score</span>
            <span className="text-title font-semibold">{points.totalPoints}</span>
            {points.totalMax > 0 ? (
              <span className="text-meta font-normal text-text1">/ {points.totalMax} pts</span>
            ) : null}
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-meta text-text1">
            <span>
              Quiz: <span className="font-medium text-text0">{points.quizPoints}</span>
              {points.quizMax > 0 ? ` / ${points.quizMax}` : ""}
            </span>
            <span>
              Projects: <span className="font-medium text-text0">{points.projectPoints}</span>
              {points.projectMax > 0 ? ` / ${points.projectMax}` : ""}
            </span>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card variant="panel" className="border-border0 bg-surfacePanel p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-body font-semibold text-text0">
          <Icon icon={Trophy} className="text-accent0" />
          <span>Course score</span>
        </div>
        <div className="text-title font-semibold text-text0">
          {points.totalPoints}
          {points.totalMax > 0 ? (
            <span className="text-body font-normal text-text1"> / {points.totalMax}</span>
          ) : null}{" "}
          pts
        </div>
      </div>
      <dl className="mt-3 grid gap-2 text-meta text-text1 sm:grid-cols-2">
        <div className="flex items-center justify-between gap-3 rounded-panel border border-border0 bg-surfaceControl px-3 py-2">
          <dt>Quiz (best answers)</dt>
          <dd className="font-medium text-text0">
            {points.quizPoints}
            {points.quizMax > 0 ? ` / ${points.quizMax}` : ""} pts
          </dd>
        </div>
        <div className="flex items-center justify-between gap-3 rounded-panel border border-border0 bg-surfaceControl px-3 py-2">
          <dt>Projects done (×{PROJECT_POINTS_WEIGHT})</dt>
          <dd className="font-medium text-text0">
            {points.projectPoints}
            {points.projectMax > 0 ? ` / ${points.projectMax}` : ""} pts
          </dd>
        </div>
      </dl>
    </Card>
  );
}

export function CatalogScoreSummary(props: {
  totalPoints: number;
  totalMax: number;
  quizPoints: number;
  projectPoints: number;
}) {
  if (props.totalMax === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-panel border border-border0 bg-surfacePanel px-3 py-2 text-meta text-text1">
      <Icon icon={Trophy} size={16} className="text-accent0" />
      <span className="font-semibold text-text0">
        {props.totalPoints} / {props.totalMax} pts
      </span>
      <span className="hidden sm:inline">·</span>
      <span className="hidden sm:inline">
        quiz {props.quizPoints} · projects {props.projectPoints}
      </span>
    </div>
  );
}
