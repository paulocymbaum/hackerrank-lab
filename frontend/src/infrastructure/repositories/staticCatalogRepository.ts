import type { CatalogRepository } from "../../domain/repositories/catalogRepository";
import type { Catalog } from "../../domain/types/catalog";
import catalogJson from "../static/catalog.json";

export const staticCatalogRepository: CatalogRepository = {
  getCatalog: async (): Promise<Catalog> => catalogJson as Catalog,
};
