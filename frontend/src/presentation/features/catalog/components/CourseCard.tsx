import type { Course } from "../../../../domain/types/catalog";
import { Button, Card, Icon } from "../../../design-system";
import { ChevronRight } from "lucide-react";
import type { MouseEvent } from "react";

export function CourseCard(props: { course: Course; onOpen: () => void }) {
  const { course } = props;

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
            <span>{course.lessons.length} examples</span>
            <span>{course.projects.length} projects</span>
            <span>{course.quizzes.length} quizzes</span>
          </div>
        </div>
        <Button
          variant="secondary"
          size="md"
          onClick={(e: MouseEvent<HTMLButtonElement>) => {
            e.stopPropagation();
            props.onOpen();
          }}
          title="Open course"
        >
          See course
          <Icon icon={ChevronRight} />
        </Button>
      </button>
    </Card>
  );
}
