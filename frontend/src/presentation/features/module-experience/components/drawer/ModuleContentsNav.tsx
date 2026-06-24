import { useMemo } from "react";
import { FileText } from "lucide-react";
import type { Course, Lesson } from "../../../../../domain/types/catalog";
import {
  getProjectsForLesson,
  getQuizzesForLesson,
} from "../../../../../application/selectors/catalogSelectors";
import { getModuleLevelQuizzes } from "../../../../../application/selectors/moduleSelectors";
import {
  getModuleDisplayIndex,
  groupLessonsBySection,
} from "../../../../../application/selectors/lessonDisplay";
import { useLessonActivityItems } from "../../../../../application/hooks/useLessonActivityItems";
import { useTranslation } from "../../../../../application/hooks/useTranslation";
import { useQuizProgressStore } from "../../../../../application/stores/quizProgressStore";
import { useModuleLayoutContext } from "../../ModuleLayoutContext";
import { useModuleContentsNavigation } from "../../hooks/useModuleContentsNavigation";
import { useModuleUrlState } from "../../../../../application/hooks/useModuleUrlState";
import { ModulePanelHeader } from "../ModulePanelHeader";
import { ModuleLessonAccordion } from "./ModuleLessonAccordion";
import { ModuleQuizzesAccordion } from "./ModuleQuizzesAccordion";
import { ModuleSectionAccordion } from "./ModuleSectionAccordion";

export function ModuleContentsNav() {
  const { t } = useTranslation();
  const { courseId, moduleId, course, module: mod } = useModuleLayoutContext();
  const navigation = useModuleContentsNavigation();
  const { activeLessonId, activeQuizId, activeProjectId, isModuleContextActive } =
    useModuleUrlState();

  const quizByKey = useQuizProgressStore((s) => s.byKey);

  const lessonSections = useMemo(() => groupLessonsBySection(mod.lessons), [mod.lessons]);
  const moduleQuizzes = useMemo(() => getModuleLevelQuizzes(mod), [mod]);
  const moduleIndex = getModuleDisplayIndex(mod);

  return (
    <nav className="flex min-h-0 flex-1 flex-col" aria-label={t("module.contentsAria")}>
      <ModulePanelHeader
        meta={t("module.contentsMeta")}
        indexLabel={moduleIndex}
        title={t("module.contextTitle")}
        subtitle={mod.title}
        icon={FileText}
        active={isModuleContextActive}
        onClick={navigation.openModuleContext}
      />

      <div className="min-h-0 flex-1 overflow-auto p-2">
        {lessonSections.map((section) => (
          <ModuleSectionAccordion
            key={section.sectionKey}
            sectionKey={section.sectionKey}
            sectionLabel={section.sectionLabel}
            defaultOpen={
              section.lessons.some((lesson) => lesson.id === activeLessonId) ||
              section.sectionKey === lessonSections[0]?.sectionKey
            }
          >
            {section.lessons.map((lesson) => (
              <ModuleLessonNavItem
                key={lesson.id}
                courseId={courseId}
                moduleId={moduleId}
                course={course}
                lesson={lesson}
                isActiveLesson={lesson.id === activeLessonId}
                activeQuizId={lesson.id === activeLessonId ? activeQuizId : null}
                activeProjectId={lesson.id === activeLessonId ? activeProjectId : null}
                defaultOpen={lesson.id === activeLessonId}
                onOpenLesson={() => navigation.openLesson(lesson.id)}
                onOpenQuiz={(quizId) => navigation.openLessonQuiz(lesson.id, quizId)}
                onOpenProject={(projectId) => navigation.openLessonProject(lesson.id, projectId)}
              />
            ))}
          </ModuleSectionAccordion>
        ))}

        <ModuleQuizzesAccordion
          courseId={courseId}
          quizzes={moduleQuizzes}
          quizByKey={quizByKey}
          activeQuizId={activeQuizId}
          onOpenQuiz={navigation.openModuleQuiz}
        />
      </div>
    </nav>
  );
}

function ModuleLessonNavItem(props: {
  courseId: string;
  moduleId: string;
  course: Course;
  lesson: Lesson;
  isActiveLesson: boolean;
  activeQuizId: string | null;
  activeProjectId: string | null;
  defaultOpen?: boolean;
  onOpenLesson: () => void;
  onOpenQuiz: (quizId: string) => void;
  onOpenProject: (projectId: string) => void;
}) {
  const quizzes = getQuizzesForLesson(props.course, props.moduleId, props.lesson.id);
  const projects = getProjectsForLesson(props.course, props.moduleId, props.lesson.id);
  const items = useLessonActivityItems({
    courseId: props.courseId,
    lessonId: props.lesson.id,
    quizzes,
    projects,
  });

  return (
    <ModuleLessonAccordion
      lesson={props.lesson}
      items={items}
      isActiveLesson={props.isActiveLesson}
      activeQuizId={props.activeQuizId}
      activeProjectId={props.activeProjectId}
      defaultOpen={props.defaultOpen}
      onOpenLesson={props.onOpenLesson}
      onOpenQuiz={props.onOpenQuiz}
      onOpenProject={props.onOpenProject}
    />
  );
}
