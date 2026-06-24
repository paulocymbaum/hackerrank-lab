import { useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  getLessonById,
  getModuleById,
  getProjectsForLesson,
  getQuizzesForLesson,
} from "../../../application/selectors/catalogSelectors";
import { useCourse } from "../../../application/hooks/useCourse";
import { useAppNavigation } from "../../../application/hooks/useAppNavigation";
import { loadCourseScores } from "../../../application/usecases/courseScores";
import { ErrorPanel, LoadingState } from "../../design-system";
import { workspaceSplitClassName } from "../../shared/workspaceLayout";
import { LessonExplanationPanel } from "./components/LessonExplanationPanel";
import { LessonActivitiesSidebar } from "./components/LessonActivitiesSidebar";

export function LessonWorkspaceRoute() {
  const { courseId = "", moduleId = "", lessonId = "" } = useParams();
  const { course, status, error, load, reload } = useCourse(courseId);
  const { goLessonQuiz, goLessonProject } = useAppNavigation();

  useEffect(() => {
    if (status === "idle") void load();
  }, [status, load]);

  useEffect(() => {
    if (!courseId || status !== "ready") return;
    void loadCourseScores(courseId);
  }, [courseId, status]);

  if (status === "loading" || status === "idle") {
    return <LoadingState message="Loading lesson…" />;
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
  const lesson = getLessonById(course, moduleId, lessonId);
  if (!mod || !lesson) {
    return <ErrorPanel title="Lesson not found." />;
  }

  const lessonQuizzes = getQuizzesForLesson(course, moduleId, lessonId);
  const lessonProjects = getProjectsForLesson(course, moduleId, lessonId);

  return (
    <section className={workspaceSplitClassName}>
      <main className="min-h-0 overflow-y-auto">
        <LessonExplanationPanel
          title={lesson.title}
          markdown={lesson.markdown}
          showTitle
        />
      </main>

      <LessonActivitiesSidebar
        courseId={courseId}
        lessonId={lessonId}
        lessonTitle={lesson.title}
        quizzes={lessonQuizzes}
        projects={lessonProjects}
        onOpenQuiz={(quizId) => goLessonQuiz(courseId, moduleId, lessonId, quizId)}
        onOpenProject={(projectId) =>
          goLessonProject(courseId, moduleId, lessonId, projectId, "files")
        }
      />
    </section>
  );
}
