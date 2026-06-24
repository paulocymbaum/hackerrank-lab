import type { Course } from "../../../../domain/types/catalog";
import { countCourseLessons, isHierarchyCourse } from "../../../../application/selectors/catalogSelectors";
import { useTranslation } from "../../../../application/hooks/useTranslation";
import { Button, Card, Icon } from "../../../design-system";
import { ChevronRight } from "lucide-react";
import type { MouseEvent } from "react";
import { CourseScoreBadge } from "../../course-experience/components/CourseScoreSummary";

const LEGACY_DUPLICATE_IDS = new Set(["03-asynchronous-javascript-runtime-model-event-loop"]);

export function CourseCard(props: { course: Course; courseId: string; onOpen: () => void }) {
  const { course } = props;
  const { t } = useTranslation();

  if (LEGACY_DUPLICATE_IDS.has(course.id) && course.structure === "legacy") {
    return null;
  }

  const lessonCount = countCourseLessons(course);
  const moduleCount = course.modules?.length ?? 0;

  return (
    <Card variant="panel" className="p-4">
      <button
        type="button"
        className="flex w-full items-start justify-between gap-3 text-left"
        onClick={props.onOpen}
      >
        <div className="min-w-0">
          <div className="truncate text-body font-semibold text-text0">{course.title}</div>
          <div className="mt-2 flex flex-wrap items-center gap-3 text-meta text-text1">
            {isHierarchyCourse(course) ? (
              <>
                <span>{t("catalog.modules", { count: moduleCount })}</span>
                <span>{t("catalog.lessons", { count: lessonCount })}</span>
              </>
            ) : (
              <span>{t("catalog.examples", { count: course.lessons.length })}</span>
            )}
            <span>{t("catalog.projects", { count: course.projects.length })}</span>
            <span>{t("catalog.quizzes", { count: course.quizzes.length })}</span>
            {course.structure === "legacy" ? <span className="text-text2">legacy</span> : null}
            <CourseScoreBadge courseId={props.courseId} course={course} />
          </div>
        </div>
        <Button
          variant="secondary"
          size="md"
          onClick={(e: MouseEvent<HTMLButtonElement>) => {
            e.stopPropagation();
            props.onOpen();
          }}
          title={t("catalog.openCourse")}
        >
          {t("catalog.seeCourse")}
          <Icon icon={ChevronRight} />
        </Button>
      </button>
    </Card>
  );
}
