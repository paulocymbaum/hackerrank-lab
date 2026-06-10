import { FileText } from "lucide-react";
import { ReadmePanel } from "../../shared/ReadmePanel";
import { hasDisplayableReadme } from "../../shared/readmeUtils";
import { getModuleDisplayIndex } from "../../../application/selectors/lessonDisplay";
import { ModuleMainPanel } from "./components/ModuleMainPanel";
import { useModuleLayoutContext } from "./ModuleLayoutContext";

export function ModuleExperienceRoute() {
  const { module: mod } = useModuleLayoutContext();

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
        <ReadmePanel markdown={mod.readmeMarkdown} title={mod.title} variant="inline" />
      ) : (
        <p className="m-0 text-body text-text1">
          Select a lesson from the contents drawer to start learning.
        </p>
      )}
    </ModuleMainPanel>
  );
}
