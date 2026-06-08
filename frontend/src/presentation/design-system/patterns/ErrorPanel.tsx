import type { ReactNode } from "react";
import clsx from "clsx";
import { Button } from "../components/Button";

export function ErrorPanel(props: {
  title?: string;
  message?: string;
  onRetry?: () => void;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={clsx(
        "rounded-panel border border-border0 bg-surfacePanel p-4 shadow-glass1 backdrop-blur-[var(--blur-2)]",
        props.className,
      )}
      role="alert"
    >
      <p className="m-0 text-body font-medium text-danger0">
        {props.title ?? "Something went wrong."}
      </p>
      {props.message ? <p className="mt-2 text-meta text-text1">{props.message}</p> : null}
      <div className="mt-3 flex flex-wrap gap-2">
        {props.onRetry ? (
          <Button variant="secondary" size="md" onClick={props.onRetry}>
            Try again
          </Button>
        ) : null}
        {props.action}
      </div>
    </div>
  );
}
