import type { Project } from "../../../../domain/types/catalog";
import { Card, EmptyState, Icon } from "../../../design-system";
import { ClipboardList } from "lucide-react";

export function ProjectList(props: {
  projects: Project[];
  onOpenProject: (project: Project) => void;
}) {
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
        <ol className="m-0 grid gap-2 pl-5">
          {props.projects.map((project) => (
            <li key={project.readmePath}>
              <button
                type="button"
                className="min-h-11 text-left text-body font-medium text-text0 underline decoration-border0 underline-offset-4 hover:decoration-text1"
                onClick={() => props.onOpenProject(project)}
              >
                {project.title}
              </button>
            </li>
          ))}
        </ol>
      )}
    </Card>
  );
}
