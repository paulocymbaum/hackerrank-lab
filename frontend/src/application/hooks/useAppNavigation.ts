import { useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import type { CourseTab, DrawerMode, DrawerTab } from "../../domain/types/navigation";
import type { ReaderItem, ReaderTab } from "../../domain/types/reader";
import { closeReaderBeforeNavigate } from "../usecases/navigateWithCleanup";
import { useContentReaderStore } from "../stores/contentReaderStore";
import { useCourseExperienceStore } from "../stores/courseExperienceStore";
import { useQuizSessionStore } from "../stores/quizSessionStore";

const VALID_TABS: CourseTab[] = ["readme", "examples", "projects", "quiz"];
const VALID_READER_TABS: ReaderTab[] = ["folders", "explanation", "files", "delivery"];
const VALID_DRAWER_MODES: DrawerMode[] = ["quiz", "project"];
const VALID_DRAWER_TABS: DrawerTab[] = ["explanation", "files", "delivery"];

function parseCourseTab(value: string | null): CourseTab {
  if (value && VALID_TABS.includes(value as CourseTab)) return value as CourseTab;
  return "readme";
}

function parseReaderTab(value: string | null): ReaderTab {
  if (value && VALID_READER_TABS.includes(value as ReaderTab)) return value as ReaderTab;
  return "explanation";
}

function parseDrawerMode(value: string | null): DrawerMode | null {
  if (value && VALID_DRAWER_MODES.includes(value as DrawerMode)) return value as DrawerMode;
  return null;
}

function parseDrawerTab(value: string | null): DrawerTab {
  if (value && VALID_DRAWER_TABS.includes(value as DrawerTab)) return value as DrawerTab;
  return "explanation";
}

function lessonPath(courseId: string, moduleId: string, lessonId: string): string {
  return `/course/${encodeURIComponent(courseId)}/module/${encodeURIComponent(moduleId)}/lesson/${encodeURIComponent(lessonId)}`;
}

export function useAppNavigation() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const setCourseTab = useCourseExperienceStore((s) => s.setTab);

  const goCatalog = useCallback(() => {
    closeReaderBeforeNavigate();
    navigate("/");
  }, [navigate]);

  const goCourse = useCallback(
    (courseId: string, tab?: CourseTab) => {
      closeReaderBeforeNavigate();
      if (tab) setCourseTab(courseId, tab);
      const params = new URLSearchParams();
      if (tab && tab !== "readme") params.set("tab", tab);
      const query = params.toString();
      navigate(`/course/${encodeURIComponent(courseId)}${query ? `?${query}` : ""}`);
    },
    [navigate, setCourseTab],
  );

  const goModule = useCallback(
    (courseId: string, moduleId: string) => {
      closeReaderBeforeNavigate();
      navigate(
        `/course/${encodeURIComponent(courseId)}/module/${encodeURIComponent(moduleId)}`,
      );
    },
    [navigate],
  );

  const goLesson = useCallback(
    (courseId: string, moduleId: string, lessonId: string, drawer?: DrawerMode) => {
      const params = new URLSearchParams();
      if (drawer) params.set("drawer", drawer);
      const query = params.toString();
      navigate(`${lessonPath(courseId, moduleId, lessonId)}${query ? `?${query}` : ""}`);
    },
    [navigate],
  );

  const openLessonDrawer = useCallback(
    (
      courseId: string,
      moduleId: string,
      lessonId: string,
      mode: DrawerMode,
      id: string,
      drawerTab?: DrawerTab,
    ) => {
      const params = new URLSearchParams();
      params.set("drawer", mode);
      if (mode === "quiz") params.set("quiz", id);
      if (mode === "project") params.set("project", id);
      if (drawerTab && drawerTab !== "explanation") params.set("drawerTab", drawerTab);
      if (mode === "quiz") useQuizSessionStore.getState().start(id);
      navigate(`${lessonPath(courseId, moduleId, lessonId)}?${params.toString()}`);
    },
    [navigate],
  );

  const closeLessonDrawer = useCallback(
    (courseId: string, moduleId: string, lessonId: string) => {
      useQuizSessionStore.getState().reset();
      navigate(lessonPath(courseId, moduleId, lessonId));
    },
    [navigate],
  );

  const setLessonDrawerTab = useCallback(
    (drawerTab: DrawerTab) => {
      const params = new URLSearchParams(searchParams);
      if (drawerTab === "explanation") params.delete("drawerTab");
      else params.set("drawerTab", drawerTab);
      setSearchParams(params, { replace: true });
    },
    [searchParams, setSearchParams],
  );

  const setTab = useCallback(
    (courseId: string, tab: CourseTab) => {
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
    [searchParams, setCourseTab, setSearchParams],
  );

  const openReader = useCallback(
    (courseId: string, item: ReaderItem, tab: CourseTab, readerTab?: ReaderTab) => {
      useContentReaderStore.getState().open(item, { tab: readerTab });
      const params = new URLSearchParams();
      if (tab !== "readme") params.set("tab", tab);
      params.set("reader", item.path);
      if (readerTab && readerTab !== "explanation") params.set("readerTab", readerTab);
      navigate(`/course/${encodeURIComponent(courseId)}?${params.toString()}`);
    },
    [navigate],
  );

  const closeReader = useCallback(() => {
    useContentReaderStore.getState().close();
    const params = new URLSearchParams(searchParams);
    params.delete("reader");
    params.delete("readerTab");
    setSearchParams(params, { replace: true });
  }, [searchParams, setSearchParams]);

  const openModuleQuiz = useCallback(
    (courseId: string, moduleId: string, quizId: string) => {
      useQuizSessionStore.getState().start(quizId);
      navigate(
        `/course/${encodeURIComponent(courseId)}/module/${encodeURIComponent(moduleId)}?quiz=${encodeURIComponent(quizId)}`,
      );
    },
    [navigate],
  );

  const openQuiz = useCallback(
    (courseId: string, quizId: string) => {
      closeReaderBeforeNavigate();
      setCourseTab(courseId, "quiz");
      useQuizSessionStore.getState().start(quizId);
      navigate(
        `/course/${encodeURIComponent(courseId)}?tab=quiz&quiz=${encodeURIComponent(quizId)}`,
      );
    },
    [navigate, setCourseTab],
  );

  const closeQuiz = useCallback(() => {
    useQuizSessionStore.getState().reset();
    const params = new URLSearchParams(searchParams);
    params.delete("quiz");
    if (params.get("tab") === "quiz") params.set("tab", "quiz");
    setSearchParams(params, { replace: true });
  }, [searchParams, setSearchParams]);

  const setReaderTab = useCallback(
    (tab: ReaderTab) => {
      useContentReaderStore.getState().setTab(tab);
      const params = new URLSearchParams(searchParams);
      if (tab === "explanation") params.delete("readerTab");
      else params.set("readerTab", tab);
      setSearchParams(params, { replace: true });
    },
    [searchParams, setSearchParams],
  );

  return {
    goCatalog,
    goCourse,
    goModule,
    goLesson,
    openLessonDrawer,
    closeLessonDrawer,
    setLessonDrawerTab,
    setTab,
    openReader,
    closeReader,
    openModuleQuiz,
    openQuiz,
    closeQuiz,
    setReaderTab,
    parseCourseTab,
    parseReaderTab,
    parseDrawerMode,
    parseDrawerTab,
  };
}
