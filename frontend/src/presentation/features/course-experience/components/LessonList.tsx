import type { Lesson } from "../../../../domain/types/catalog";
import { getLessonDisplayIndex, sortByGraphIndex } from "../../../../application/selectors/lessonDisplay";
import { Card, EmptyState, Icon } from "../../../design-system";
import { BookOpenText } from "lucide-react";

export function LessonList(props: { lessons: Lesson[]; onOpenLesson: (lesson: Lesson) => void }) {
  return (
    <Card variant="panel" className="p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-meta font-semibold text-text1">
          <Icon icon={BookOpenText} />
          <span>Examples</span>
        </div>
        <div className="text-meta text-text1">{props.lessons.length}</div>
      </div>

      {props.lessons.length === 0 ? (
        <EmptyState title="No examples yet." description="This module has no example lessons." />
      ) : (
        <ol className="m-0 grid list-none gap-2 p-0">
          {sortByGraphIndex(props.lessons).map((lesson) => (
            <li key={lesson.path}>
              <button
                type="button"
                className="flex min-h-11 w-full items-center gap-2 text-left text-body font-medium text-text0 underline decoration-border0 underline-offset-4 hover:decoration-text1"
                onClick={() => props.onOpenLesson(lesson)}
              >
                <span className="shrink-0 rounded-pill border border-border0 bg-surfaceControl px-2 py-0.5 font-mono text-meta text-text1">
                  {getLessonDisplayIndex(lesson)}
                </span>
                <span>{lesson.title}</span>
              </button>
            </li>
          ))}
        </ol>
      )}
    </Card>
  );
}
