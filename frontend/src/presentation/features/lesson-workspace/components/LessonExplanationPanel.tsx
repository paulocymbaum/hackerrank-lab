import { stripDuplicateReadmeTitle } from "../../../shared/readmeUtils";
import { MarkdownView } from "../../../shared/MarkdownView";

export function LessonExplanationPanel(props: {
  title: string;
  markdown: string;
  showTitle?: boolean;
}) {
  const markdown = stripDuplicateReadmeTitle(props.markdown, props.title);

  return (
    <div className="min-h-0 flex-1 overflow-auto p-4">
      {props.showTitle !== false ? (
        <h1 className="mb-4 mt-0 text-title font-semibold text-text0">{props.title}</h1>
      ) : null}
      <MarkdownView markdown={markdown} />
    </div>
  );
}
