import type { Course } from "../../../domain/types/catalog";
import type { Quiz } from "../../../domain/types/quiz";
import { useAppNavigation } from "../../../application/hooks/useAppNavigation";
import { QuizHost } from "../quiz/components/QuizHost";

/** Full-page module quiz (`?quiz=` on module route). */
export function ModuleQuizPage(props: {
  courseId: string;
  course: Course;
  quiz: Quiz;
}) {
  const { closeQuiz } = useAppNavigation();

  return (
    <QuizHost
      layout="page"
      courseId={props.courseId}
      course={props.course}
      quiz={props.quiz}
      onClose={closeQuiz}
    />
  );
}
