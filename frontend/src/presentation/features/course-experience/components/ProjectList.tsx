import type { Project } from "../../../../domain/types/catalog";
import { Card, EmptyState, Icon } from "../../../design-system";
import { ClipboardList } from "lucide-react";
import { useProjectProgressStore } from "../../../../application/stores/projectProgressStore";
import { ProjectStatusBadge } from "./ProjectStatusBadge";

export function ProjectList(props: {
  courseId: string;
  projects: Project[];
  onOpenProject: (project: Project) => void;
}) {
  const getStatus = useProjectProgressStore((s) => s.getStatus);

  return (
    <Card variant="panel" className="p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-meta font-semibold text-text1">
          <Icon icon={ClipboardList} />
          <span>Projects</span>
        </div>
        <div className="text-meta text-text1">{props.projects.length}</div>
      </div>

      {props.projects.length === 0 ? (
        <EmptyState title="No projects yet." description="This module has no PBL exercises." />
      ) : (
        <ol className="m-0 grid gap-3 pl-0">
          {props.projects.map((project) => {
            const status = getStatus(props.courseId, project.id, project.lessonId);
            return (
              <li
                key={project.readmePath}
                className="rounded-panel border border-border0 bg-surfaceControl p-3"
              >
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                  <button
                    type="button"
                    className="min-h-11 text-left text-body font-medium text-text0 underline decoration-border0 underline-offset-4 hover:decoration-text1"
                    onClick={() => props.onOpenProject(project)}
                  >
                    {project.title}
                  </button>
                  <ProjectStatusBadge value={status} showPoints />
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </Card>
  );
}
