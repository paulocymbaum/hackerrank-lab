import { Outlet } from "react-router-dom";
import { ModuleContentsDrawer } from "./components/ModuleContentsDrawer";

/** Module shell: side drawer + main column outlet. */
export function ModuleShellLayout() {
  return (
    <section className="flex min-h-[70vh] flex-col lg:flex-row lg:items-stretch">
      <ModuleContentsDrawer />

      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden border-border0 bg-surfacePanel lg:border lg:border-l-0 lg:rounded-r-panel">
        <Outlet />
      </div>
    </section>
  );
}
