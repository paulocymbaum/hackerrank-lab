import { ArrowLeft, CheckCircle2 } from "lucide-react";
import type { Quiz } from "../../../../domain/types/quiz";
import { useCoursePoints } from "../../../../application/hooks/useCoursePoints";
import { useQuizSessionStore } from "../../../../application/stores/quizSessionStore";
import { Button, Icon } from "../../../design-system";
import { QuizProgressBar } from "./QuizProgressBar";
import { QuizQuestionView } from "./QuizQuestionView";
import { QuizResultsPanel } from "./QuizResultsPanel";
import type { Course } from "../../../../domain/types/catalog";

export function QuizSessionPanel(props: {
  courseId: string;
  course: Course;
  quiz: Quiz;
  onBackToList: () => void;
  compact?: boolean;
}) {
  const currentIndex = useQuizSessionStore((s) => s.currentIndex);
  const answers = useQuizSessionStore((s) => s.answers);
  const checkedQuestions = useQuizSessionStore((s) => s.checkedQuestions);
  const isComplete = useQuizSessionStore((s) => s.isComplete);
  const lastAttempt = useQuizSessionStore((s) => s.lastAttempt);
  const lastQuizPointsDelta = useQuizSessionStore((s) => s.lastQuizPointsDelta);
  const coursePoints = useCoursePoints(props.courseId, props.course);
  const selectAnswer = useQuizSessionStore((s) => s.selectAnswer);
  const checkCurrent = useQuizSessionStore((s) => s.checkCurrent);
  const goNext = useQuizSessionStore((s) => s.goNext);
  const goPrev = useQuizSessionStore((s) => s.goPrev);
  const finish = useQuizSessionStore((s) => s.finish);
  const start = useQuizSessionStore((s) => s.start);

  const total = props.quiz.questions.length;
  const question = props.quiz.questions[currentIndex];
  const isChecked = question ? Boolean(checkedQuestions[question.id]) : false;
  const hasAnswer = question ? Boolean(answers[question.id]) : false;
  const isLast = currentIndex >= total - 1;

  if (isComplete && lastAttempt) {
    return (
      <QuizResultsPanel
        attempt={lastAttempt}
        quizTitle={props.quiz.title}
        coursePoints={coursePoints}
        quizPointsDelta={lastQuizPointsDelta}
        onRetry={() => start(props.quiz.id)}
        onBackToList={props.onBackToList}
      />
    );
  }

  if (!question) return null;

  return (
    <section className="grid gap-4">
      {!props.compact ? (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Button variant="ghost" size="md" onClick={props.onBackToList}>
            <Icon icon={ArrowLeft} />
            All quizzes
          </Button>
          <div className="text-meta text-text1">{props.quiz.title}</div>
        </div>
      ) : (
        <div className="text-meta font-semibold text-text0">{props.quiz.title}</div>
      )}

      <QuizProgressBar current={currentIndex} total={total} />

      <QuizQuestionView
        question={question}
        questionNumber={currentIndex + 1}
        selectedOptionId={answers[question.id]}
        isChecked={isChecked}
        onSelect={(optionId) => selectAnswer(question.id, optionId)}
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button variant="secondary" size="md" onClick={() => goPrev()} disabled={currentIndex === 0}>
          Previous
        </Button>

        <div className="flex flex-wrap gap-2">
          {!isChecked ? (
            <Button
              variant="primary"
              size="md"
              disabled={!hasAnswer}
              onClick={() => checkCurrent(question.id)}
            >
              Check answer
            </Button>
          ) : isLast ? (
            <Button
              variant="primary"
              size="md"
              onClick={() => finish(props.quiz, props.courseId)}
            >
              <Icon icon={CheckCircle2} />
              Finish quiz
            </Button>
          ) : (
            <Button variant="primary" size="md" onClick={() => goNext(total)}>
              Next
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
