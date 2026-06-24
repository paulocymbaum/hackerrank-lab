import type { Project } from "../../../../domain/types/catalog";
import type { DrawerTab } from "../../../../domain/types/navigation";
import { ProjectReader } from "../../content-reader/ProjectReader";

/** @deprecated Use ProjectReader layout="drawer" */
export function ProjectWorkspacePanel(props: {
  courseId: string;
  courseTitle: string;
  project: Project;
  drawerTab: DrawerTab;
  onDrawerTabChange: (tab: DrawerTab) => void;
  embedded?: boolean;
}) {
  return (
    <ProjectReader
      layout="drawer"
      courseId={props.courseId}
      courseTitle={props.courseTitle}
      project={props.project}
      drawerTab={props.drawerTab}
      onDrawerTabChange={props.onDrawerTabChange}
      embedded={props.embedded}
    />
  );
}
