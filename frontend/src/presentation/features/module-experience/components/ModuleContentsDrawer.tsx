import clsx from "clsx";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "../../../../application/hooks/useTranslation";
import { Button, Icon } from "../../../design-system";
import { useModuleUrlState } from "../../../../application/hooks/useModuleUrlState";
import { ModuleContentsNav } from "./drawer/ModuleContentsNav";

export function ModuleContentsDrawer() {
  const { t } = useTranslation();
  const { activeLessonId, activeQuizId, activeProjectId, drawerMode } = useModuleUrlState();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [activeLessonId, activeQuizId, activeProjectId, drawerMode]);

  return (
    <>
      <div className="mb-3 flex items-center justify-between gap-2 lg:mb-0 lg:hidden">
        <p className="m-0 text-meta font-semibold text-text1">{t("module.contentsNav")}</p>
        <Button
          variant="secondary"
          size="md"
          onClick={() => setMobileOpen((open) => !open)}
          title={mobileOpen ? t("module.contentsToggleHide") : t("module.contentsToggleShow")}
        >
          <Icon icon={mobileOpen ? PanelLeftClose : PanelLeftOpen} />
          {mobileOpen ? t("module.contentsHide") : t("module.contentsShow")}
        </Button>
      </div>

      {mobileOpen ? (
        <div
          className="fixed inset-0 z-[var(--z-gaveta-fundo)] bg-black/30 lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden
        />
      ) : null}

      <aside
        className={clsx(
          "flex min-h-0 w-full shrink-0 flex-col overflow-hidden border-border0 bg-surfacePanel",
          "lg:relative lg:z-auto lg:w-80 lg:self-stretch lg:rounded-l-panel lg:border lg:border-r-0",
          mobileOpen
            ? "fixed inset-y-0 left-0 z-[var(--z-gaveta)] max-w-[min(100vw-1rem,20rem)] rounded-panel border shadow-glass2 lg:static lg:shadow-none"
            : "hidden lg:flex",
        )}
      >
        <ModuleContentsNav />
      </aside>
    </>
  );
}
