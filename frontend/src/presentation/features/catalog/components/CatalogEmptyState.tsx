import { EmptyState } from "../../../design-system";

export function CatalogEmptyState() {
  return (
    <EmptyState
      title="No courses found."
      description="Add modules under course/ and run npm run catalog:generate."
    />
  );
}
