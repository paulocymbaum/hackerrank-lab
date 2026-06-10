import { useCallback, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import type { CourseTab, DrawerMode, DrawerTab } from "../../domain/types/navigation";
import type { ReaderItem, ReaderTab } from "../../domain/types/reader";
import { criarEstrategiaHierarquia } from "../navigation/estrategiaHierarquia";
import { criarEstrategiaLegacy } from "../navigation/estrategiaLegacy";
import { useCourseExperienceStore } from "../stores/legacy/courseExperienceStore";
import { closeReaderBeforeNavigate } from "../usecases/navigateWithCleanup";

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

export function useAppNavigation() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const setCourseTab = useCourseExperienceStore((s) => s.setTab);

  const deps = useMemo(
    () => ({ navigate, searchParams, setSearchParams, setCourseTab }),
    [navigate, searchParams, setSearchParams, setCourseTab],
  );

  const hierarquia = useMemo(() => criarEstrategiaHierarquia(deps), [deps]);
  const legacy = useMemo(() => criarEstrategiaLegacy(deps), [deps]);

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

  return {
    goCatalog,
    goCourse,
    goModule: hierarquia.goModule,
    goLesson: hierarquia.goLesson,
    openLessonDrawer: hierarquia.openLessonDrawer,
    closeLessonDrawer: hierarquia.closeLessonDrawer,
    setLessonDrawerTab: hierarquia.setLessonDrawerTab,
    setTab: legacy.setTab,
    openReader: legacy.openReader,
    closeReader: legacy.closeReader,
    openModuleQuiz: hierarquia.openModuleQuiz,
    openQuiz: legacy.openQuiz,
    closeQuiz: hierarquia.closeQuiz,
    closeLegacyQuiz: legacy.closeQuiz,
    setReaderTab: legacy.setReaderTab,
    parseCourseTab,
    parseReaderTab,
    parseDrawerMode,
    parseDrawerTab,
  };
}
