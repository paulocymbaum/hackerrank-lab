import { MarkdownView } from "../../../shared/MarkdownView";

export function LessonExplanationPanel(props: { title: string; markdown: string }) {
  return (
    <div className="min-h-0 flex-1 overflow-auto p-4">
      <h1 className="mb-4 mt-0 text-title font-semibold text-text0">{props.title}</h1>
      <MarkdownView markdown={props.markdown} />
    </div>
  );
}
