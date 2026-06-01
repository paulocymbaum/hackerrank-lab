import { CourseCatalogRoute } from "./routes/CourseCatalogRoute";
import { AppShell } from "./core/layout/AppShell";
import { ContentReaderDialog } from "./components/ContentReaderDialog";
import { useNavigationStore } from "../application/stores/navigationStore";
import { CourseExperienceRoute } from "./routes/CourseExperienceRoute";

export function App() {
  const route = useNavigationStore((s) => s.route);

  return (
    <AppShell
      theme="dark"
      title="Hackerrank Study"
      subtitle={route.name === "catalog" ? "Static catalog view (not integrated yet)" : undefined}
    >
      {route.name === "catalog" ? (
        <CourseCatalogRoute />
      ) : (
        <CourseExperienceRoute courseId={route.courseId} />
      )}
      <ContentReaderDialog />
    </AppShell>
  );
}

