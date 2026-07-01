import { BookOpenText, Map } from "lucide-react";
import { Icon, Tabs } from "../../design-system";

export type CatalogTab = "courses" | "content-map";

export function parseCatalogTab(raw: string | null): CatalogTab {
  return raw === "content-map" ? "content-map" : "courses";
}

export function CatalogTabBar(props: {
  value: CatalogTab;
  onValueChange: (tab: CatalogTab) => void;
}) {
  const tabItems = [
    { value: "courses" as const, label: "Courses", icon: <Icon icon={BookOpenText} /> },
    { value: "content-map" as const, label: "Content Map", icon: <Icon icon={Map} /> },
  ];

  return (
    <Tabs
      items={tabItems}
      value={props.value}
      onValueChange={(value) => props.onValueChange(value as CatalogTab)}
      listClassName="max-w-full"
    />
  );
}
