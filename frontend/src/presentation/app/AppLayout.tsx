import { Outlet, useParams, useSearchParams, useLocation, matchPath } from "react-router-dom";
import { useMemo } from "react";
import { ContentReaderDialog } from "../features/content-reader/ContentReaderDialog";
import { CourseScoreBadge } from "../features/course-experience/components/CourseScoreSummary";
import { AppShell } from "../features/shell/AppShell";
import { Breadcrumb } from "../shared/Breadcrumb";
import { useCatalog } from "../../application/hooks/useCatalog";
import {
  getCourseById,
  getLessonById,
  getModuleById,
  isHierarchyCourse,
} from "../../application/selectors/catalogSelectors";
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
  const { goCatalog, goCourse, goModule, goLesson, parseCourseTab } = useAppNavigation();

  const courseId = params.courseId;
  const moduleId = params.moduleId;
  const lessonId = params.lessonId;
  const isCourseRoute = location.pathname.startsWith("/course/");

  const course = useMemo(
    () => (courseId ? getCourseById(courses, courseId) : null),
    [courses, courseId],
  );

  const mod = useMemo(
    () => (course && moduleId ? getModuleById(course, moduleId) : null),
    [course, moduleId],
  );

  const lesson = useMemo(
    () => (course && moduleId && lessonId ? getLessonById(course, moduleId, lessonId) : null),
    [course, moduleId, lessonId],
  );

  const tab = courseId ? parseCourseTab(searchParams.get("tab")) : null;
  const lessonMatch = matchPath(
    "/course/:courseId/module/:moduleId/lesson/:lessonId",
    location.pathname,
  );

  const breadcrumbSegments = useMemo(() => {
    if (!isCourseRoute || !course) return [{ label: "Catalog" }];

    const segments: { label: string; onClick?: () => void }[] = [
      { label: "Catalog", onClick: goCatalog },
      { label: course.title, onClick: () => goCourse(course.id) },
    ];

    if (mod) {
      segments.push({ label: mod.title, onClick: () => goModule(course.id, mod.id) });
    }

    if (lesson && moduleId) {
      segments.push({
        label: lesson.title,
        onClick: () => goLesson(course.id, moduleId, lesson.id),
      });
    }

    if (!isHierarchyCourse(course) && tab && tab !== "readme") {
      segments.push({ label: TAB_LABELS[tab] });
    }

    return segments;
  }, [
    isCourseRoute,
    course,
    mod,
    lesson,
    moduleId,
    tab,
    lessonMatch,
    searchParams,
    goCatalog,
    goCourse,
    goModule,
    goLesson,
  ]);

  return (
    <AppShell
      title="Hackerrank Study"
      breadcrumb={<Breadcrumb segments={breadcrumbSegments} />}
      right={
        isCourseRoute && course ? (
          <CourseScoreBadge courseId={course.id} course={course} />
        ) : null
      }
    >
      <Outlet />
      {course && !isHierarchyCourse(course) ? <ContentReaderDialog /> : null}
    </AppShell>
  );
}
