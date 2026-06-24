import { useParams, useSearchParams } from "react-router-dom";
import { useAppNavigation } from "./useAppNavigation";

/** URL-derived selection state shared by module shell and contents drawer. */
export function useModuleUrlState() {
  const { lessonId: activeLessonId = "" } = useParams();
  const [searchParams] = useSearchParams();
  const { parseDrawerMode } = useAppNavigation();

  const activeQuizId = searchParams.get("quiz");
  const activeProjectId = searchParams.get("project");
  const drawerMode = parseDrawerMode(searchParams.get("drawer"));

  const isModuleContextActive =
    !activeLessonId && !activeQuizId && !activeProjectId && !drawerMode;

  return {
    activeLessonId,
    activeQuizId,
    activeProjectId,
    drawerMode,
    isModuleContextActive,
  };
}
