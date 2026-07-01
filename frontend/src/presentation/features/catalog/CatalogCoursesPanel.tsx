import { BookOpenText } from "lucide-react";
import type { Course } from "../../../domain/types/catalog";
import { Icon } from "../../design-system";
import { CatalogScoreSummary } from "../course-experience/components/CourseScoreSummary";
import { CourseCard } from "./components/CourseCard";
import { CatalogEmptyState } from "./components/CatalogEmptyState";

export function CatalogCoursesPanel(props: {
  courses: Course[];
  catalogPoints: {
    totalPoints: number;
    totalMax: number;
    quizPoints: number;
    quizMax: number;
    projectPoints: number;
    projectMax: number;
  };
  onOpenCourse: (courseId: string) => void;
}) {
  return (
    <>
      <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="m-0 text-body font-semibold text-text0">Courses</h2>
        <div className="flex flex-wrap items-center gap-3">
          <CatalogScoreSummary
            totalPoints={props.catalogPoints.totalPoints}
            totalMax={props.catalogPoints.totalMax}
            quizPoints={props.catalogPoints.quizPoints}
            quizMax={props.catalogPoints.quizMax}
            projectPoints={props.catalogPoints.projectPoints}
            projectMax={props.catalogPoints.projectMax}
          />
          <div className="flex items-center gap-2 text-meta text-text1">
            <Icon icon={BookOpenText} />
            <span>{props.courses.length}</span>
          </div>
        </div>
      </div>

      {props.courses.length === 0 ? <CatalogEmptyState /> : null}

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        {props.courses.map((course) => (
          <CourseCard
            key={course.id}
            courseId={course.id}
            course={course}
            onOpen={() => props.onOpenCourse(course.id)}
          />
        ))}
      </div>
    </>
  );
}
