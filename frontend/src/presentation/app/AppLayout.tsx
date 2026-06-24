import { Outlet, useParams, useSearchParams, useLocation } from "react-router-dom";
import { useMemo } from "react";
import { ContentReaderDialog } from "../features/content-reader/ContentReaderDialog";
import { CourseScoreBadge } from "../features/course-experience/components/CourseScoreSummary";
import { AppShell } from "../features/shell/AppShell";
import { Breadcrumb } from "../shared/Breadcrumb";
import { useCatalog } from "../../application/hooks/useCatalog";
import { useCourseTabLabels } from "../../application/hooks/useLocalizedLabels";
import { useTranslation } from "../../application/hooks/useTranslation";
import {
  getCourseById,
  getLessonById,
  getModuleById,
  getProjectById,
  isHierarchyCourse,
} from "../../application/selectors/catalogSelectors";
import { getQuizById } from "../../application/selectors/quizSelectors";
import { useAppNavigation } from "../../application/hooks/useAppNavigation";
import type { CourseTab } from "../../domain/types/navigation";

export function AppLayout() {
  const { courses } = useCatalog();
  const { t } = useTranslation();
  const tabLabels = useCourseTabLabels();
  const params = useParams();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const { goCatalog, goCourse, goModule, goLesson, parseCourseTab } = useAppNavigation();

  const courseId = params.courseId;
  const moduleId = params.moduleId;
  const lessonId = params.lessonId;
  const quizId = params.quizId;
  const projectId = params.projectId;
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

  const quiz = useMemo(
    () => (course && quizId ? getQuizById(course, quizId) : null),
    [course, quizId],
  );

  const project = useMemo(
    () =>
      course && moduleId && projectId ? getProjectById(course, moduleId, projectId) : null,
    [course, moduleId, projectId],
  );

  const tab = courseId ? parseCourseTab(searchParams.get("tab")) : null;

  const breadcrumbSegments = useMemo(() => {
    if (!isCourseRoute || !course) return [{ label: t("nav.catalog") }];

    const segments: { label: string; onClick?: () => void }[] = [
      { label: t("nav.catalog"), onClick: goCatalog },
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

    if (quiz) {
      segments.push({ label: quiz.title });
    } else if (project) {
      segments.push({ label: project.title });
    }

    if (!isHierarchyCourse(course) && tab && tab !== "readme") {
      segments.push({ label: tabLabels[tab as CourseTab] });
    }

    return segments;
  }, [
    isCourseRoute,
    course,
    mod,
    lesson,
    quiz,
    project,
    moduleId,
    tab,
    tabLabels,
    t,
    goCatalog,
    goCourse,
    goModule,
    goLesson,
  ]);

  return (
    <AppShell
      title={t("app.title")}
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
