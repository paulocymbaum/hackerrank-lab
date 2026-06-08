import type { Course } from "../../../../domain/types/catalog";
import { useCoursePoints } from "../../../../application/hooks/useCoursePoints";
import { Trophy } from "lucide-react";
import {
  AggregatedScoreDisplay,
  toAggregatedScoreMetrics,
} from "../../../shared/score";

export function CourseScoreBadge(props: {
  courseId: string;
  course: Course;
  className?: string;
}) {
  const points = useCoursePoints(props.courseId, props.course);

  return (
    <AggregatedScoreDisplay
      variant="badge"
      icon={Trophy}
      className={props.className}
      metrics={toAggregatedScoreMetrics(points)}
    />
  );
}

export function CourseScoreSummary(props: {
  courseId: string;
  course: Course;
  variant?: "full" | "compact";
}) {
  const points = useCoursePoints(props.courseId, props.course);

  return (
    <AggregatedScoreDisplay
      variant={props.variant ?? "full"}
      title="Course score"
      icon={Trophy}
      metrics={toAggregatedScoreMetrics(points)}
    />
  );
}

export function CatalogScoreSummary(props: {
  totalPoints: number;
  totalMax: number;
  quizPoints: number;
  quizMax: number;
  projectPoints: number;
  projectMax: number;
}) {
  return (
    <AggregatedScoreDisplay
      variant="catalog"
      icon={Trophy}
      metrics={toAggregatedScoreMetrics(props)}
    />
  );
}
