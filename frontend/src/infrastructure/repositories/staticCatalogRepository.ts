import type { Catalog } from "../../domain/types/catalog";
import catalogJson from "../static/catalog.json";

type CatalogRepository = {
  getCatalog: () => Promise<Catalog>;
};

export const staticCatalogRepository: CatalogRepository = {
  getCatalog: async () => {
    return catalogJson as Catalog;
  },
};

