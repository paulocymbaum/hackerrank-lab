import type { NavigateFunction } from "react-router-dom";
import type { CourseTab, DrawerMode, DrawerTab } from "../../domain/types/navigation";
import type { ReaderItem, ReaderTab } from "../../domain/types/reader";

export type NavegacaoCursoDeps = {
  navigate: NavigateFunction;
  searchParams: URLSearchParams;
  setSearchParams: (
    params: URLSearchParams,
    options?: { replace?: boolean },
  ) => void;
  setCourseTab: (courseId: string, tab: CourseTab) => void;
};

export type EstrategiaNavegacaoCurso = {
  goModule: (courseId: string, moduleId: string) => void;
  goLesson: (courseId: string, moduleId: string, lessonId: string) => void;
  openLessonDrawer: (
    courseId: string,
    moduleId: string,
    lessonId: string,
    mode: DrawerMode,
    id: string,
    drawerTab?: DrawerTab,
  ) => void;
  closeLessonDrawer: (courseId: string, moduleId: string, lessonId: string) => void;
  setLessonDrawerTab: (drawerTab: DrawerTab) => void;
  openModuleQuiz: (courseId: string, moduleId: string, quizId: string) => void;
  closeQuiz: () => void;
  setTab: (courseId: string, tab: CourseTab) => void;
  openReader: (
    courseId: string,
    item: ReaderItem,
    tab: CourseTab,
    readerTab?: ReaderTab,
  ) => void;
  closeReader: () => void;
  openQuiz: (courseId: string, quizId: string) => void;
  setReaderTab: (tab: ReaderTab) => void;
};
