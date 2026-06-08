import type { Catalog } from "../types/catalog";

export type CatalogRepository = {
  getCatalog: () => Promise<Catalog>;
};
