import type { ReactNode } from "react";
import clsx from "clsx";

export function EmptyState(props: {
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={clsx("grid gap-2 rounded-panel border border-border0 bg-surfacePanel p-4", props.className)}>
      <p className="m-0 text-body font-medium text-text0">{props.title}</p>
      {props.description ? <p className="m-0 text-meta text-text1">{props.description}</p> : null}
      {props.action ? <div className="mt-1">{props.action}</div> : null}
    </div>
  );
}
