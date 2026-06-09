import { MarkdownView } from "./MarkdownView";

/** Course/module readme body without repeating the page title (breadcrumb shows it). */
export function ReadmeContent(props: { markdown: string; className?: string }) {
  return (
    <div className={props.className}>
      <MarkdownView markdown={props.markdown} />
    </div>
  );
}
