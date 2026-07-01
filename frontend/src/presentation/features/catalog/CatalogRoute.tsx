import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useCatalog } from "../../../application/hooks/useCatalog";
import { useCatalogPoints } from "../../../application/hooks/useCatalogPoints";
import { useAppNavigation } from "../../../application/hooks/useAppNavigation";
import { useTranslation } from "../../../application/hooks/useTranslation";
import { loadAllCourseScores } from "../../../application/usecases/loadAllCourseScores";
import { migrateProgressKeysFromCatalog } from "../../../application/usecases/migrateProgressKeys";
import { ErrorPanel, LoadingState } from "../../design-system";
import { ContentMapPanel } from "../content-map/ContentMapPanel";
import { CatalogCoursesPanel } from "./CatalogCoursesPanel";
import { CatalogTabBar, parseCatalogTab } from "./CatalogTabBar";

export function CatalogRoute() {
  const { status, courses, error, load, reload } = useCatalog();
  const { goCourse } = useAppNavigation();
  const { t } = useTranslation();
  const catalogPoints = useCatalogPoints(courses);
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = parseCatalogTab(searchParams.get("tab"));

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (status !== "ready" || courses.length === 0) return;
    migrateProgressKeysFromCatalog({ courses });
    void loadAllCourseScores(courses);
  }, [status, courses]);

  const setTab = (nextTab: "courses" | "content-map") => {
    if (nextTab === "courses") {
      setSearchParams({});
      return;
    }
    setSearchParams({ tab: nextTab });
  };

  if (status === "loading" || status === "idle") {
    return <LoadingState message={t("catalog.loading")} />;
  }

  if (status === "error") {
    return (
      <ErrorPanel
        title={t("catalog.error")}
        message={error ?? undefined}
        onRetry={() => void reload()}
      />
    );
  }

  return (
    <section className="grid gap-4">
      <CatalogTabBar value={tab} onValueChange={setTab} />
      {tab === "courses" ? (
        <CatalogCoursesPanel
          courses={courses}
          catalogPoints={catalogPoints}
          onOpenCourse={goCourse}
        />
      ) : (
        <ContentMapPanel />
      )}
    </section>
  );
}
