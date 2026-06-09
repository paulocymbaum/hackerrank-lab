import type { Course } from "../../../../domain/types/catalog";
import type { Quiz } from "../../../../domain/types/quiz";
import { QuizSessionPanel } from "../../quiz/components/QuizSessionPanel";

export function QuizDrawerPanel(props: {
  courseId: string;
  course: Course;
  quiz: Quiz;
  onClose: () => void;
}) {
  return (
    <QuizSessionPanel
        courseId={props.courseId}
        course={props.course}
        quiz={props.quiz}
        onBackToList={props.onClose}
      compact
    />
  );
}
