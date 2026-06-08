import { useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import type { CourseTab } from "../../../domain/types/navigation";
import {
  lessonToReaderItem,
  projectToReaderItem,
  findReaderItemByPath,
} from "../../../application/selectors/catalogSelectors";
import { getQuizById } from "../../../application/selectors/quizSelectors";
import { useCatalog } from "../../../application/hooks/useCatalog";
import { useCourse } from "../../../application/hooks/useCourse";
import { useAppNavigation } from "../../../application/hooks/useAppNavigation";
import { useCourseExperienceStore } from "../../../application/stores/courseExperienceStore";
import { useContentReaderStore } from "../../../application/stores/contentReaderStore";
import { useQuizSessionStore, useQuizProgressStore } from "../../../application/stores/quizSessionStore";
import { Button, ErrorPanel, Icon, LoadingState } from "../../design-system";
import { CourseTabBar } from "./components/CourseTabBar";
import { CourseReadmePanel } from "./components/CourseReadmePanel";
import { LessonList } from "./components/LessonList";
import { ProjectList } from "./components/ProjectList";
import { QuizList } from "../quiz/components/QuizList";
import { QuizSessionPanel } from "../quiz/components/QuizSessionPanel";

export function CourseExperienceRoute() {
  const { courseId = "" } = useParams();
  const [searchParams] = useSearchParams();
  const { course, status, error, load, reload } = useCourse(courseId);
  const { courses } = useCatalog();
  const { goCatalog, setTab, openReader, openQuiz, closeQuiz, parseCourseTab, parseReaderTab } =
    useAppNavigation();
  const storedTab = useCourseExperienceStore((s) => s.getTab(courseId));
  const urlTab = parseCourseTab(searchParams.get("tab"));
  const tab: CourseTab = searchParams.has("tab") ? urlTab : storedTab;
  const activeQuizId = searchParams.get("quiz");
  const getProgress = useQuizProgressStore((s) => s.getProgress);

  useEffect(() => {
    if (status === "idle") void load();
  }, [status, load]);

  useEffect(() => {
    const readerPath = searchParams.get("reader");
    if (!readerPath || !course) return;

    const item = findReaderItemByPath(courses, readerPath);
    if (!item) return;

    const readerTab = parseReaderTab(searchParams.get("readerTab"));
    const current = useContentReaderStore.getState();
    if (current.isOpen && current.item?.path === item.path) {
      if (current.tab !== readerTab) current.setTab(readerTab);
      return;
    }
    useContentReaderStore.getState().open(item, { tab: readerTab });
  }, [searchParams, course, courses, parseReaderTab]);

  useEffect(() => {
    if (tab !== "quiz" || !activeQuizId || !course) {
      return;
    }
    const quiz = getQuizById(course, activeQuizId);
    if (!quiz) return;
    const session = useQuizSessionStore.getState();
    if (session.quizId !== activeQuizId) {
      session.start(activeQuizId);
    }
  }, [tab, activeQuizId, course]);

  useEffect(() => {
    if (tab !== "quiz" && useQuizSessionStore.getState().quizId) {
      useQuizSessionStore.getState().reset();
    }
  }, [tab]);

  if (status === "loading" || status === "idle") {
    return <LoadingState message="Loading course…" />;
  }

  if (status === "error") {
    return (
      <ErrorPanel
        title="Failed to load course catalog."
        message={error ?? undefined}
        onRetry={() => void reload()}
      />
    );
  }

  if (!course) {
    return (
      <ErrorPanel
        title="Course not found."
        message="The course may have been removed or the link is invalid."
        action={
          <Button variant="secondary" onClick={goCatalog}>
            <Icon icon={ArrowLeft} />
            Back to catalog
          </Button>
        }
      />
    );
  }

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

      {tab === "readme" ? <CourseReadmePanel course={course} /> : null}
      {tab === "examples" ? (
        <LessonList
          lessons={course.lessons}
          onOpenLesson={(lesson) => openReader(courseId, lessonToReaderItem(lesson), "examples")}
        />
      ) : null}
      {tab === "projects" ? (
        <ProjectList
          projects={course.projects}
          onOpenProject={(project) =>
            openReader(courseId, projectToReaderItem(project), "projects")
          }
        />
      ) : null}
      {tab === "quiz" ? (
        activeQuiz ? (
          <QuizSessionPanel
            courseId={courseId}
            quiz={activeQuiz}
            onBackToList={closeQuiz}
          />
        ) : (
          <QuizList
            quizzes={course.quizzes}
            getProgress={(quizId) => getProgress(courseId, quizId)}
            onStart={(quiz) => openQuiz(courseId, quiz.id)}
          />
        )
      ) : null}
    </section>
  );
}
