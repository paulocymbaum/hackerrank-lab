import { ReadmePanel } from "../../../shared/ReadmePanel";

/** @deprecated Use ReadmePanel variant="scroll" */
export function LessonExplanationPanel(props: {
  title: string;
  markdown: string;
  showTitle?: boolean;
}) {
  return (
    <ReadmePanel
      title={props.title}
      markdown={props.markdown}
      showTitle={props.showTitle !== false}
      variant="scroll"
    />
  );
}
