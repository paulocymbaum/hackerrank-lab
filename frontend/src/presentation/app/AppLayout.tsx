import { Outlet, useParams, useSearchParams, useLocation } from "react-router-dom";
import { useMemo } from "react";
import { ContentReaderDialog } from "../features/content-reader/ContentReaderDialog";
import { AppShell } from "../features/shell/AppShell";
import { Breadcrumb } from "../shared/Breadcrumb";
import { useCatalog } from "../../application/hooks/useCatalog";
import { getCourseById } from "../../application/selectors/catalogSelectors";
import { useAppNavigation } from "../../application/hooks/useAppNavigation";
import type { CourseTab } from "../../domain/types/navigation";

const TAB_LABELS: Record<CourseTab, string> = {
  readme: "README",
  examples: "Examples",
  projects: "Projects",
  quiz: "Quiz",
};

export function AppLayout() {
  const { courses } = useCatalog();
  const params = useParams();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const { goCatalog, parseCourseTab } = useAppNavigation();

  const courseId = params.courseId;
  const isCourseRoute = location.pathname.startsWith("/course/");

  const course = useMemo(
    () => (courseId ? getCourseById(courses, courseId) : null),
    [courses, courseId],
  );

  const tab = courseId ? parseCourseTab(searchParams.get("tab")) : null;

  const breadcrumbSegments = isCourseRoute && course
    ? [
        { label: "Catalog", onClick: goCatalog },
        { label: course.title },
        ...(tab && tab !== "readme" ? [{ label: TAB_LABELS[tab] }] : []),
      ]
    : [{ label: "Catalog" }];

  return (
    <AppShell title="Hackerrank Study" breadcrumb={<Breadcrumb segments={breadcrumbSegments} />}>
      <Outlet />
      <ContentReaderDialog />
    </AppShell>
  );
}
