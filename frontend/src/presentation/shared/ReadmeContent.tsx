import { stripDuplicateReadmeTitle } from "./readmeUtils";
import { MarkdownView } from "./MarkdownView";

/** Course/module readme body without repeating the page title (breadcrumb shows it). */
export function ReadmeContent(props: { markdown: string; title?: string; className?: string }) {
  const markdown = props.title
    ? stripDuplicateReadmeTitle(props.markdown, props.title)
    : props.markdown;

  return (
    <div className={props.className}>
      <MarkdownView markdown={markdown} />
    </div>
  );
}
