import type { DrawerTab } from "../../domain/types/navigation";
import { useQuizSessionStore } from "../stores/quizSessionStore";
import { closeReaderBeforeNavigate } from "../usecases/navigateWithCleanup";
import type { EstrategiaNavegacaoCurso, NavegacaoCursoDeps } from "./tiposNavegacaoCurso";

function lessonPath(courseId: string, moduleId: string, lessonId: string): string {
  return `/course/${encodeURIComponent(courseId)}/module/${encodeURIComponent(moduleId)}/lesson/${encodeURIComponent(lessonId)}`;
}

export function criarEstrategiaHierarquia(deps: NavegacaoCursoDeps): Pick<
  EstrategiaNavegacaoCurso,
  | "goModule"
  | "goLesson"
  | "openLessonDrawer"
  | "closeLessonDrawer"
  | "setLessonDrawerTab"
  | "openModuleQuiz"
  | "closeQuiz"
> {
  const { navigate, searchParams, setSearchParams } = deps;

  return {
    goModule: (courseId, moduleId) => {
      closeReaderBeforeNavigate();
      navigate(
        `/course/${encodeURIComponent(courseId)}/module/${encodeURIComponent(moduleId)}`,
      );
    },

    goLesson: (courseId, moduleId, lessonId) => {
      navigate(lessonPath(courseId, moduleId, lessonId));
    },

    openLessonDrawer: (courseId, moduleId, lessonId, mode, id, drawerTab) => {
      const params = new URLSearchParams();
      params.set("drawer", mode);
      if (mode === "quiz") params.set("quiz", id);
      if (mode === "project") params.set("project", id);
      if (drawerTab && drawerTab !== "explanation") params.set("drawerTab", drawerTab);
      if (mode === "quiz") useQuizSessionStore.getState().start(id, lessonId);
      navigate(`${lessonPath(courseId, moduleId, lessonId)}?${params.toString()}`);
    },

    closeLessonDrawer: (courseId, moduleId, lessonId) => {
      useQuizSessionStore.getState().reset();
      navigate(lessonPath(courseId, moduleId, lessonId));
    },

    setLessonDrawerTab: (drawerTab) => {
      const params = new URLSearchParams(searchParams);
      if (drawerTab === "explanation") params.delete("drawerTab");
      else params.set("drawerTab", drawerTab);
      setSearchParams(params, { replace: true });
    },

    openModuleQuiz: (courseId, moduleId, quizId) => {
      useQuizSessionStore.getState().start(quizId);
      navigate(
        `/course/${encodeURIComponent(courseId)}/module/${encodeURIComponent(moduleId)}?quiz=${encodeURIComponent(quizId)}`,
      );
    },

    closeQuiz: () => {
      useQuizSessionStore.getState().reset();
      const params = new URLSearchParams(searchParams);
      params.delete("quiz");
      setSearchParams(params, { replace: true });
    },
  };
}
