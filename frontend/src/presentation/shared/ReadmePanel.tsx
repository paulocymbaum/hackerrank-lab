import clsx from "clsx";
import { stripDuplicateReadmeTitle } from "./readmeUtils";
import { MarkdownView } from "./MarkdownView";
import { Card } from "../design-system";

export type ReadmePanelVariant = "inline" | "scroll" | "card";

export function ReadmePanel(props: {
  markdown: string;
  title?: string;
  showTitle?: boolean;
  variant?: ReadmePanelVariant;
  className?: string;
}) {
  const variant = props.variant ?? "inline";
  const markdown = props.title
    ? stripDuplicateReadmeTitle(props.markdown, props.title)
    : props.markdown;

  const body = (
    <>
      {props.showTitle && props.title ? (
        <h1 className="mb-4 mt-0 text-title font-semibold text-text0">{props.title}</h1>
      ) : null}
      <MarkdownView markdown={markdown} />
    </>
  );

  if (variant === "card") {
    return (
      <Card variant="panel" className={clsx("p-4", props.className)}>
        {body}
      </Card>
    );
  }

  if (variant === "scroll") {
    return (
      <div className={clsx("min-h-0 flex-1 overflow-auto p-4", props.className)}>
        {body}
      </div>
    );
  }

  return <div className={props.className}>{body}</div>;
}

/** @deprecated Use ReadmePanel */
export function ReadmeContent(props: { markdown: string; title?: string; className?: string }) {
  return (
    <ReadmePanel
      markdown={props.markdown}
      title={props.title}
      variant="inline"
      className={props.className}
    />
  );
}
