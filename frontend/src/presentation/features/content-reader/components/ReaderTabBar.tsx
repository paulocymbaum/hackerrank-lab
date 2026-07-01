import { BookOpenText, FolderTree, Package } from "lucide-react";
import type { ReaderTab } from "../../../../domain/types/reader";
import { useTranslation } from "../../../../application/hooks/useTranslation";
import { Icon, Tabs } from "../../../design-system";

export function ReaderTabBar(props: {
  value: ReaderTab;
  onValueChange: (tab: ReaderTab) => void;
  showFolders: boolean;
  showContext?: boolean;
  showDelivery?: boolean;
}) {
  const { t } = useTranslation();

  const items = [
    ...(props.showContext
      ? [{ value: "context", label: t("tabs.context"), icon: <Icon icon={BookOpenText} /> }]
      : [{ value: "explanation", label: t("tabs.explanation"), icon: <Icon icon={BookOpenText} /> }]),
    ...(props.showFolders
      ? [{ value: "folders", label: t("tabs.folders"), icon: <Icon icon={FolderTree} /> }]
      : []),
    ...(props.showDelivery
      ? [{ value: "delivery", label: t("tabs.delivery"), icon: <Icon icon={Package} /> }]
      : []),
  ];

  return (
    <Tabs
      items={items}
      value={props.value}
      onValueChange={(value) => props.onValueChange(value as ReaderTab)}
    />
  );
}
