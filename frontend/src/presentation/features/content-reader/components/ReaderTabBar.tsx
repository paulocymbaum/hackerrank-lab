import { BookOpenText, FileText, FolderTree, Package } from "lucide-react";
import type { ReaderTab } from "../../../../domain/types/reader";
import { useTranslation } from "../../../../application/hooks/useTranslation";
import { Icon, Tabs } from "../../../design-system";

export function ReaderTabBar(props: {
  value: ReaderTab;
  onValueChange: (tab: ReaderTab) => void;
  showFolders: boolean;
  showDelivery?: boolean;
}) {
  const { t } = useTranslation();

  const items = [
    { value: "explanation", label: t("tabs.explanation"), icon: <Icon icon={BookOpenText} /> },
    ...(props.showFolders
      ? [{ value: "folders", label: t("tabs.folders"), icon: <Icon icon={FolderTree} /> }]
      : []),
    { value: "files", label: t("tabs.files"), icon: <Icon icon={FileText} /> },
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
