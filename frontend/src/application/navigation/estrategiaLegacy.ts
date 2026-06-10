import type { CourseTab } from "../../domain/types/navigation";
import type { ReaderItem, ReaderTab } from "../../domain/types/reader";
import { useContentReaderStore } from "../stores/legacy/contentReaderStore";
import { useQuizSessionStore } from "../stores/quizSessionStore";
import { closeReaderBeforeNavigate } from "../usecases/navigateWithCleanup";
import type { EstrategiaNavegacaoCurso, NavegacaoCursoDeps } from "./tiposNavegacaoCurso";

export function criarEstrategiaLegacy(deps: NavegacaoCursoDeps): Pick<
  EstrategiaNavegacaoCurso,
  "setTab" | "openReader" | "closeReader" | "openQuiz" | "setReaderTab" | "closeQuiz"
> {
  const { navigate, searchParams, setSearchParams, setCourseTab } = deps;

  return {
    setTab: (courseId, tab) => {
      setCourseTab(courseId, tab);
      const params = new URLSearchParams(searchParams);
      if (tab === "readme") params.delete("tab");
      else params.set("tab", tab);
      params.delete("reader");
      params.delete("readerTab");
      params.delete("quiz");
      closeReaderBeforeNavigate();
      setSearchParams(params, { replace: true });
    },

    openReader: (courseId, item, tab, readerTab) => {
      useContentReaderStore.getState().open(item, { tab: readerTab });
      const params = new URLSearchParams();
      if (tab !== "readme") params.set("tab", tab);
      params.set("reader", item.path);
      if (readerTab && readerTab !== "explanation") params.set("readerTab", readerTab);
      navigate(`/course/${encodeURIComponent(courseId)}?${params.toString()}`);
    },

    closeReader: () => {
      useContentReaderStore.getState().close();
      const params = new URLSearchParams(searchParams);
      params.delete("reader");
      params.delete("readerTab");
      setSearchParams(params, { replace: true });
    },

    openQuiz: (courseId, quizId) => {
      closeReaderBeforeNavigate();
      setCourseTab(courseId, "quiz");
      useQuizSessionStore.getState().start(quizId);
      navigate(
        `/course/${encodeURIComponent(courseId)}?tab=quiz&quiz=${encodeURIComponent(quizId)}`,
      );
    },

    closeQuiz: () => {
      useQuizSessionStore.getState().reset();
      const params = new URLSearchParams(searchParams);
      params.delete("quiz");
      if (params.get("tab") === "quiz") params.set("tab", "quiz");
      setSearchParams(params, { replace: true });
    },

    setReaderTab: (tab) => {
      useContentReaderStore.getState().setTab(tab);
      const params = new URLSearchParams(searchParams);
      if (tab === "explanation") params.delete("readerTab");
      else params.set("readerTab", tab);
      setSearchParams(params, { replace: true });
    },
  };
}
