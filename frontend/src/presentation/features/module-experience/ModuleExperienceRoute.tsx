import { useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import {
  getModuleById,
  getProjectsForLesson,
  getQuizzesForLesson,
  getQuizzesForModule,
} from "../../../application/selectors/catalogSelectors";
import { getQuizById } from "../../../application/selectors/quizSelectors";
import { useCourse } from "../../../application/hooks/useCourse";
import { useAppNavigation } from "../../../application/hooks/useAppNavigation";
import { useQuizSessionStore, useQuizProgressStore } from "../../../application/stores/quizSessionStore";
import { loadCourseScores } from "../../../application/usecases/courseScores";
import { Card, ErrorPanel, LoadingState } from "../../design-system";
import { ReadmeContent } from "../../shared/ReadmeContent";
import { LessonCard } from "../lesson-workspace/components/LessonCard";
import { QuizList } from "../quiz/components/QuizList";
import { QuizSessionPanel } from "../quiz/components/QuizSessionPanel";

export function ModuleExperienceRoute() {
  const { courseId = "", moduleId = "" } = useParams();
  const [searchParams] = useSearchParams();
  const { course, status, error, load, reload } = useCourse(courseId);
  const { goLesson, openModuleQuiz, closeQuiz } = useAppNavigation();
  const getProgress = useQuizProgressStore((s) => s.getProgress);
  const activeQuizId = searchParams.get("quiz");

  useEffect(() => {
    if (status === "idle") void load();
  }, [status, load]);

  useEffect(() => {
    if (!courseId || status !== "ready") return;
    void loadCourseScores(courseId);
  }, [courseId, status]);

  useEffect(() => {
    if (!activeQuizId || !course) return;
    const session = useQuizSessionStore.getState();
    if (session.quizId !== activeQuizId) session.start(activeQuizId);
  }, [activeQuizId, course]);

  if (status === "loading" || status === "idle") {
    return <LoadingState message="Loading module…" />;
  }

  if (status === "error") {
    return (
      <ErrorPanel
        title="Failed to load course."
        message={error ?? undefined}
        onRetry={() => void reload()}
      />
    );
  }

  if (!course) {
    return <ErrorPanel title="Course not found." />;
  }

  const mod = getModuleById(course, moduleId);
  if (!mod) {
    return <ErrorPanel title="Module not found." />;
  }

  const moduleQuizzes = getQuizzesForModule(course, moduleId).filter((q) => !q.lessonId);
  const activeQuiz = activeQuizId ? getQuizById(course, activeQuizId) : null;

  if (activeQuiz && moduleQuizzes.some((q) => q.id === activeQuiz.id)) {
    return (
      <QuizSessionPanel
        courseId={courseId}
        course={course}
        quiz={activeQuiz}
        onBackToList={closeQuiz}
      />
    );
  }

  return (
    <section className="grid gap-4">
      {mod.readmeMarkdown.trim() ? (
        <Card variant="panel" className="p-4">
          <ReadmeContent markdown={mod.readmeMarkdown} />
        </Card>
      ) : null}

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        {mod.lessons.map((lesson) => (
          <LessonCard
            key={lesson.id}
            courseId={courseId}
            lesson={lesson}
            quizzes={getQuizzesForLesson(course, moduleId, lesson.id)}
            projects={getProjectsForLesson(course, moduleId, lesson.id)}
            onOpen={() => goLesson(courseId, moduleId, lesson.id)}
          />
        ))}
      </div>

      {moduleQuizzes.length > 0 ? (
        <QuizList
          quizzes={moduleQuizzes}
          getProgress={(quizId) => getProgress(courseId, quizId)}
          onStart={(quiz) => openModuleQuiz(courseId, moduleId, quiz.id)}
        />
      ) : null}
    </section>
  );
}
