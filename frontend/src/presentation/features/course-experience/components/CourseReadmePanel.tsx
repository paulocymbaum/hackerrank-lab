import type { Course } from "../../../../domain/types/catalog";
import { ReadmePanel } from "../../../shared/ReadmePanel";

/** @deprecated Use ReadmePanel variant="card" */
export function CourseReadmePanel(props: { course: Course }) {
  return <ReadmePanel markdown={props.course.readmeMarkdown} variant="card" />;
}
