import type { ReaderTab } from "../../../../domain/types/reader";
import { BookOpenText, FileText, FolderTree, Package } from "lucide-react";
import { Icon, Tabs } from "../../../design-system";

export function ReaderTabBar(props: {
  value: ReaderTab;
  onValueChange: (tab: ReaderTab) => void;
  showFolders: boolean;
  showDelivery?: boolean;
}) {
  const items = [
    { value: "explanation", label: "Explanation", icon: <Icon icon={BookOpenText} /> },
    ...(props.showFolders
      ? [{ value: "folders", label: "Folders", icon: <Icon icon={FolderTree} /> }]
      : []),
    { value: "files", label: "Files", icon: <Icon icon={FileText} /> },
    ...(props.showDelivery
      ? [{ value: "delivery", label: "Delivery", icon: <Icon icon={Package} /> }]
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
