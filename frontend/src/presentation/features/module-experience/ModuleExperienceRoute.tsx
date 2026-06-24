import { FileText } from "lucide-react";
import { useTranslation } from "../../../application/hooks/useTranslation";
import { getModuleDisplayIndex } from "../../../application/selectors/lessonDisplay";
import { ReadmePanel } from "../../shared/ReadmePanel";
import { hasDisplayableReadme } from "../../shared/readmeUtils";
import { ModuleMainPanel } from "./components/ModuleMainPanel";
import { useModuleLayoutContext } from "./ModuleLayoutContext";

export function ModuleExperienceRoute() {
  const { t } = useTranslation();
  const { module: mod } = useModuleLayoutContext();

  const showReadme = hasDisplayableReadme(mod.readmeMarkdown, mod.title);
  const moduleIndex = getModuleDisplayIndex(mod);

  return (
    <ModuleMainPanel
      meta={t("module.contextMeta")}
      indexLabel={moduleIndex}
      title={t("module.contextTitle")}
      subtitle={mod.title}
      icon={FileText}
    >
      {showReadme ? (
        <ReadmePanel markdown={mod.readmeMarkdown} title={mod.title} variant="inline" />
      ) : (
        <p className="m-0 text-body text-text1">{t("module.pickLesson")}</p>
      )}
    </ModuleMainPanel>
  );
}
