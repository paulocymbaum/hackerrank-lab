import { FileText } from "lucide-react";
import { useParams } from "react-router-dom";
import { getModuleById } from "../../../application/selectors/catalogSelectors";
import { getModuleDisplayIndex } from "../../../application/selectors/lessonDisplay";
import { useCourse } from "../../../application/hooks/useCourse";
import { ErrorPanel, LoadingState } from "../../design-system";
import { ReadmeContent } from "../../shared/ReadmeContent";
import { hasDisplayableReadme } from "../../shared/readmeUtils";
import { ModuleMainPanel } from "./components/ModuleMainPanel";

export function ModuleExperienceRoute() {
  const { courseId = "", moduleId = "" } = useParams();
  const { course, status, error, reload } = useCourse(courseId);

  if (status === "loading" || status === "idle") {
    return <LoadingState message="Loading module…" />;
  }

  if (status === "error") {
    return (
      <ErrorPanel
        title="Failed to load course."
        message={error ?? undefined}
        onRetry={() => void reload()}
      />
    );
  }

  if (!course) {
    return <ErrorPanel title="Course not found." />;
  }

  const mod = getModuleById(course, moduleId);
  if (!mod) {
    return <ErrorPanel title="Module not found." />;
  }

  const showReadme = hasDisplayableReadme(mod.readmeMarkdown, mod.title);
  const moduleIndex = getModuleDisplayIndex(mod);

  return (
    <ModuleMainPanel
      meta="Module Context"
      indexLabel={moduleIndex}
      title="Module Context"
      subtitle={mod.title}
      icon={FileText}
    >
      {showReadme ? (
        <ReadmeContent markdown={mod.readmeMarkdown} title={mod.title} />
      ) : (
        <p className="m-0 text-body text-text1">
          Select a lesson from the contents drawer to start learning.
        </p>
      )}
    </ModuleMainPanel>
  );
}
