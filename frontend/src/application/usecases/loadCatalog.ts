import type { CatalogRepository } from "../../domain/repositories/catalogRepository";
import type { Course } from "../../domain/types/catalog";

export type LoadCatalogResult =
  | { ok: true; courses: Course[] }
  | { ok: false; error: string };

export async function loadCatalog(repository: CatalogRepository): Promise<LoadCatalogResult> {
  try {
    const catalog = await repository.getCatalog();
    return { ok: true, courses: catalog.courses };
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    return { ok: false, error: message };
  }
}
