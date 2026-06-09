import type { TextareaHTMLAttributes } from "react";
import clsx from "clsx";

export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const { className, ...rest } = props;

  return (
    <textarea
      {...rest}
      className={clsx(
        "w-full resize-y rounded-panel border border-border0 bg-surfaceControl px-3 py-2 text-body text-text0 shadow-glass1",
        "placeholder:text-text2",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent0/60 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
    />
  );
}
