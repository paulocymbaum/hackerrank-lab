import {
  computeLessonProgress,
  type LessonActivityItem,
} from "../../../../application/selectors/lessonProgress";
import { ProgressBar } from "../../../design-system";

/** Compact progress bar inside a lesson card in the module contents drawer. */
export function LessonCardProgress(props: { items: LessonActivityItem[] }) {
  const { done, total } = computeLessonProgress(props.items);

  if (total === 0) return null;

  return (
    <div
      className="flex w-full items-center gap-2 pl-14 pr-6"
      onClick={(event) => event.stopPropagation()}
    >
      <ProgressBar
        value={done}
        max={total}
        size="xs"
        className="min-w-0 flex-1"
        aria-label={`${done} of ${total} lesson activities complete`}
      />
      <span className="shrink-0 text-meta text-text2">
        {done}/{total}
      </span>
    </div>
  );
}
