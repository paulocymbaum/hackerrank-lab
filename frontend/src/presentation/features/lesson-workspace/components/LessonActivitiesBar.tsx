import type { Project } from "../../../../domain/types/catalog";
import type { Quiz } from "../../../../domain/types/quiz";
import { useProjectProgressStore } from "../../../../application/stores/projectProgressStore";
import { useQuizProgressStore } from "../../../../application/stores/quizSessionStore";
import { Button } from "../../../design-system";

export function LessonActivitiesBar(props: {
  courseId: string;
  lessonId: string;
  quizzes: Quiz[];
  projects: Project[];
  activeQuizId: string | null;
  activeProjectId: string | null;
  onOpenQuiz: (quizId: string) => void;
  onOpenProject: (projectId: string) => void;
}) {
  const getQuizProgress = useQuizProgressStore((s) => s.getProgress);
  const getProjectStatus = useProjectProgressStore((s) => s.getStatus);

  if (props.quizzes.length === 0 && props.projects.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 border-t border-border0 p-4">
      <span className="mr-1 text-meta font-semibold text-text1">Activities</span>
      {props.quizzes.map((quiz) => {
        const progress = getQuizProgress(props.courseId, quiz.id, props.lessonId);
        const done = (progress?.bestScore ?? 0) > 0;
        return (
          <Button
            key={quiz.id}
            variant={props.activeQuizId === quiz.id ? "primary" : "secondary"}
            size="md"
            onClick={() => props.onOpenQuiz(quiz.id)}
          >
            {quiz.title}
            {done ? " ✓" : ""}
          </Button>
        );
      })}
      {props.projects.map((project) => {
        const status = getProjectStatus(props.courseId, project.id, project.lessonId);
        const label = status === "done" ? `${project.title} ✓` : project.title;
        return (
          <Button
            key={project.id}
            variant={props.activeProjectId === project.id ? "primary" : "secondary"}
            size="md"
            onClick={() => props.onOpenProject(project.id)}
          >
            {label}
          </Button>
        );
      })}
    </div>
  );
}
