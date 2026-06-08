import { useCourseCatalogStore } from "../stores/courseCatalogStore";

export function useCatalog() {
  const status = useCourseCatalogStore((s) => s.status);
  const courses = useCourseCatalogStore((s) => s.courses);
  const error = useCourseCatalogStore((s) => s.error);
  const load = useCourseCatalogStore((s) => s.load);
  const reload = useCourseCatalogStore((s) => s.reload);

  return { status, courses, error, load, reload };
}
