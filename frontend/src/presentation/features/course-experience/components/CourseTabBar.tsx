import { BookOpenText, Brain, ClipboardList, FileText } from "lucide-react";
import type { CourseTab } from "../../../../domain/types/navigation";
import { Icon, Tabs } from "../../../design-system";

const TAB_ITEMS = [
  { value: "readme" as const, label: "README", icon: <Icon icon={FileText} /> },
  { value: "examples" as const, label: "Examples", icon: <Icon icon={BookOpenText} /> },
  { value: "projects" as const, label: "Projects", icon: <Icon icon={ClipboardList} /> },
  { value: "quiz" as const, label: "Quiz", icon: <Icon icon={Brain} /> },
];

export function CourseTabBar(props: {
  value: CourseTab;
  onValueChange: (tab: CourseTab) => void;
}) {
  return (
    <Tabs
      items={TAB_ITEMS}
      value={props.value}
      onValueChange={(value) => props.onValueChange(value as CourseTab)}
      listClassName="max-w-full"
    />
  );
}
