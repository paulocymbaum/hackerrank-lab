import { useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  getModuleById,
  getProjectsForLesson,
  getQuizzesForLesson,
  getQuizzesForModule,
} from "../../../application/selectors/catalogSelectors";
import { useCourse } from "../../../application/hooks/useCourse";
import { useAppNavigation } from "../../../application/hooks/useAppNavigation";
import { useTranslation } from "../../../application/hooks/useTranslation";
import { loadCourseScores } from "../../../application/usecases/courseScores";
import { ErrorPanel, LoadingState } from "../../design-system";
import { ReadmeContent } from "../../shared/ReadmeContent";
import { hasSubstantiveMarkdown } from "../../shared/utils/markdownContent";
import { workspaceSplitClassName } from "../../shared/workspaceLayout";
import { ModuleLessonsSidebar } from "./components/ModuleLessonsSidebar";

export function ModuleExperienceRoute() {
  const { courseId = "", moduleId = "" } = useParams();
  const { t } = useTranslation();
  const { course, status, error, load, reload } = useCourse(courseId);
  const { goLesson, goModuleQuiz } = useAppNavigation();

  useEffect(() => {
    if (status === "idle") void load();
  }, [status, load]);

  useEffect(() => {
    if (!courseId || status !== "ready") return;
    void loadCourseScores(courseId);
  }, [courseId, status]);

  if (status === "loading" || status === "idle") {
    return <LoadingState message={t("module.loading")} />;
  }

  if (status === "error") {
    return (
      <ErrorPanel
        title={t("error.loadCourse")}
        message={error ?? undefined}
        onRetry={() => void reload()}
      />
    );
  }

  if (!course) {
    return <ErrorPanel title={t("error.courseNotFound")} />;
  }

  const mod = getModuleById(course, moduleId);
  if (!mod) {
    return <ErrorPanel title={t("error.moduleNotFound")} />;
  }

  const moduleQuizzes = getQuizzesForModule(course, moduleId).filter((q) => !q.lessonId);
  const lessonNavItems = mod.lessons.map((lesson) => ({
    lesson,
    quizzes: getQuizzesForLesson(course, moduleId, lesson.id),
    projects: getProjectsForLesson(course, moduleId, lesson.id),
  }));

  return (
    <section className={workspaceSplitClassName}>
      <main className="min-h-0 overflow-y-auto p-4">
        {hasSubstantiveMarkdown(mod.readmeMarkdown) ? (
          <ReadmeContent markdown={mod.readmeMarkdown} />
        ) : (
          <p className="m-0 text-meta text-text1">{t("module.pickLesson")}</p>
        )}
      </main>

      <ModuleLessonsSidebar
        courseId={courseId}
        moduleTitle={mod.title}
        lessons={lessonNavItems}
        moduleQuizzes={moduleQuizzes}
        onOpenLesson={(lessonId) => goLesson(courseId, moduleId, lessonId)}
        onOpenModuleQuiz={(quizId) => goModuleQuiz(courseId, moduleId, quizId)}
      />
    </section>
  );
}
