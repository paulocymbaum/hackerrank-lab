import { CourseCatalogRoute } from "./routes/CourseCatalogRoute";
import { AppShell } from "./core/layout/AppShell";

export function App() {
  return (
    <AppShell
      theme="dark"
      title="Hackerrank Study"
      subtitle="Static catalog view (not integrated yet)"
    >
      <CourseCatalogRoute />
    </AppShell>
  );
}

