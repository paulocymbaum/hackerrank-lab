import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import type { Course } from "../../../domain/types/catalog";
import type { CourseTab } from "../../../domain/types/navigation";
import {
  lessonToReaderItem,
  projectToReaderItem,
  findReaderItemByPath,
} from "../../../application/selectors/catalogSelectors";
import { getQuizById } from "../../../application/selectors/quizSelectors";
import { useCatalog } from "../../../application/hooks/useCatalog";
import { useQuizSessionFromUrl } from "../../../application/hooks/useQuizSessionFromUrl";
import { useAppNavigation } from "../../../application/hooks/useAppNavigation";
import { useCourseExperienceStore } from "../../../application/stores/legacy/courseExperienceStore";
import { useContentReaderStore } from "../../../application/stores/legacy/contentReaderStore";
import { useQuizProgressStore } from "../../../application/stores/quizProgressStore";
import { Button, Icon } from "../../design-system";
import { CourseTabBar } from "../course-experience/components/CourseTabBar";
import { CourseScoreSummary } from "../course-experience/components/CourseScoreSummary";
import { CourseReadmePanel } from "../course-experience/components/CourseReadmePanel";
import { LessonList } from "../course-experience/components/LessonList";
import { ProjectList } from "../course-experience/components/ProjectList";
import { QuizList } from "../quiz/components/QuizList";
import { QuizHost } from "../quiz/components/QuizHost";

export function LegacyCourseRoute(props: { courseId: string; course: Course }) {
  const { courseId, course } = props;
  const [searchParams] = useSearchParams();
  const { courses } = useCatalog();
  const { goCatalog, setTab, openReader, openQuiz, closeLegacyQuiz, parseCourseTab, parseReaderTab } =
    useAppNavigation();
  const storedTab = useCourseExperienceStore((s) => s.getTab(courseId));
  const urlTab = parseCourseTab(searchParams.get("tab"));
  const tab: CourseTab = searchParams.has("tab") ? urlTab : storedTab;
  const activeQuizId = searchParams.get("quiz");
  const getProgress = useQuizProgressStore((s) => s.getProgress);

  useEffect(() => {
    const readerPath = searchParams.get("reader");
    if (!readerPath) return;

    const item = findReaderItemByPath(courses, readerPath);
    if (!item) return;

    const readerTab = searchParams.has("readerTab")
      ? parseReaderTab(searchParams.get("readerTab"))
      : item.kind === "project"
        ? "delivery"
        : parseReaderTab(null);
    const current = useContentReaderStore.getState();
    if (current.isOpen && current.item?.path === item.path) {
      if (current.tab !== readerTab) current.setTab(readerTab);
      return;
    }
    useContentReaderStore.getState().open(item, { tab: readerTab });
  }, [searchParams, courses, parseReaderTab]);

  useQuizSessionFromUrl({
    quizId: activeQuizId,
    lessonId: activeQuizId ? getQuizById(course, activeQuizId)?.lessonId : undefined,
    enabled: tab === "quiz" && Boolean(activeQuizId),
    resetWhenDisabled: true,
  });

  const activeQuiz = activeQuizId ? getQuizById(course, activeQuizId) : null;

  return (
    <section className="grid gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <Button variant="secondary" onClick={goCatalog} title="Back to catalog">
          <Icon icon={ArrowLeft} />
          Back
        </Button>
        <CourseTabBar value={tab} onValueChange={(next) => setTab(courseId, next)} />
      </div>

      <CourseScoreSummary courseId={courseId} course={course} variant="compact" />

      {tab === "readme" ? <CourseReadmePanel course={course} /> : null}
      {tab === "examples" ? (
        <LessonList
          lessons={course.lessons}
          onOpenLesson={(lesson) => openReader(courseId, lessonToReaderItem(lesson), "examples")}
        />
      ) : null}
      {tab === "projects" ? (
        <ProjectList
          courseId={courseId}
          projects={course.projects}
          onOpenProject={(project) =>
            openReader(courseId, projectToReaderItem(project), "projects", "delivery")
          }
        />
      ) : null}
      {tab === "quiz" ? (
        activeQuiz ? (
          <QuizHost
            layout="page"
            courseId={courseId}
            course={course}
            quiz={activeQuiz}
            onClose={closeLegacyQuiz}
          />
        ) : (
          <QuizList
            quizzes={course.quizzes}
            getProgress={(quizId) => {
              const quiz = getQuizById(course, quizId);
              return getProgress(courseId, quizId, quiz?.lessonId);
            }}
            onStart={(quiz) => openQuiz(courseId, quiz.id)}
          />
        )
      ) : null}
    </section>
  );
}
