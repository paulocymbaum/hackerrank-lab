import type { Course } from "../../../../domain/types/catalog";
import { Card } from "../../../design-system";
import { MarkdownView } from "../../../shared/MarkdownView";

export function CourseReadmePanel(props: { course: Course }) {
  return (
    <Card variant="panel" className="p-4">
      <MarkdownView markdown={props.course.readmeMarkdown} />
    </Card>
  );
}
