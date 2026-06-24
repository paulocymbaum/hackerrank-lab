import { BookOpenText, Brain, ClipboardList, FileText } from "lucide-react";
import type { CourseTab } from "../../../../domain/types/navigation";
import { useCourseTabLabels } from "../../../../application/hooks/useLocalizedLabels";
import { Icon, Tabs } from "../../../design-system";

export function CourseTabBar(props: {
  value: CourseTab;
  onValueChange: (tab: CourseTab) => void;
}) {
  const labels = useCourseTabLabels();

  const tabItems = [
    { value: "readme" as const, label: labels.readme, icon: <Icon icon={FileText} /> },
    { value: "examples" as const, label: labels.examples, icon: <Icon icon={BookOpenText} /> },
    { value: "projects" as const, label: labels.projects, icon: <Icon icon={ClipboardList} /> },
    { value: "quiz" as const, label: labels.quiz, icon: <Icon icon={Brain} /> },
  ];

  return (
    <Tabs
      items={tabItems}
      value={props.value}
      onValueChange={(value) => props.onValueChange(value as CourseTab)}
      listClassName="max-w-full"
    />
  );
}
