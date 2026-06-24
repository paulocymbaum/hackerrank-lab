import { EmptyState } from "../../../design-system";
import { useTranslation } from "../../../../application/hooks/useTranslation";

export function CatalogEmptyState() {
  const { t } = useTranslation();

  return (
    <EmptyState
      title={t("catalog.empty.title")}
      description={t("catalog.empty.description")}
    />
  );
}
