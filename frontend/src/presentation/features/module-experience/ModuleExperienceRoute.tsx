import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import {
  getModuleById,
  getProjectsForLesson,
  getQuizzesForLesson,
  getQuizzesForModule,
} from "../../../application/selectors/catalogSelectors";
import { getQuizById } from "../../../application/selectors/quizSelectors";
import { useCatalog } from "../../../application/hooks/useCatalog";
import { useCourse } from "../../../application/hooks/useCourse";
import { useAppNavigation } from "../../../application/hooks/useAppNavigation";
import { useQuizProgressStore } from "../../../application/stores/quizSessionStore";
import { loadCourseScores } from "../../../application/usecases/courseScores";
import { Button, Card, ErrorPanel, Icon, LoadingState } from "../../design-system";
import { MarkdownView } from "../../shared/MarkdownView";
import { LessonCard } from "../lesson-workspace/components/LessonCard";
import { QuizList } from "../quiz/components/QuizList";

export function ModuleExperienceRoute() {
  const { courseId = "", moduleId = "" } = useParams();
  const { course, status, error, load, reload } = useCourse(courseId);
  const { goCourse, goLesson, openLessonDrawer } = useAppNavigation();
  const getProgress = useQuizProgressStore((s) => s.getProgress);

  useEffect(() => {
    if (status === "idle") void load();
  }, [status, load]);

  useEffect(() => {
    if (!courseId || status !== "ready") return;
    void loadCourseScores(courseId);
  }, [courseId, status]);

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

  const moduleQuizzes = getQuizzesForModule(course, moduleId);

  return (
    <section className="grid gap-4">
      <Button variant="secondary" onClick={() => goCourse(courseId)} title="Back to course">
        <Icon icon={ArrowLeft} />
        Back to course
      </Button>

      <Card variant="panel" className="p-4">
        <h1 className="m-0 mb-3 text-title font-semibold text-text0">{mod.title}</h1>
        <MarkdownView markdown={mod.readmeMarkdown} />
      </Card>

      <div className="grid gap-3">
        <h2 className="m-0 text-body font-semibold text-text0">Lessons</h2>
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
      </div>

      {moduleQuizzes.length > 0 ? (
        <QuizList
          quizzes={moduleQuizzes}
          getProgress={(quizId) => {
            const quiz = getQuizById(course, quizId);
            return getProgress(courseId, quizId, quiz?.lessonId);
          }}
          onStart={(quiz) => {
            if (quiz.lessonId) {
              openLessonDrawer(courseId, moduleId, quiz.lessonId, "quiz", quiz.id);
            }
          }}
        />
      ) : null}
    </section>
  );
}
