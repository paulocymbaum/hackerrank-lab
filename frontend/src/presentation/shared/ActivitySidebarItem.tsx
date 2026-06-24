import clsx from "clsx";
import type { ButtonHTMLAttributes } from "react";
import { Button } from "../design-system";

export function ActivitySidebarItem(
  props: ButtonHTMLAttributes<HTMLButtonElement> & {
    title: string;
    scoreLabel?: string;
    active?: boolean;
  },
) {
  const { title, scoreLabel, active, className, ...rest } = props;

  return (
    <Button
      {...rest}
      variant={active ? "primary" : "secondary"}
      size="md"
      className={clsx("h-auto w-full flex-col items-start gap-0.5 py-2.5 text-left", className)}
    >
      <span className="w-full truncate font-medium">{title}</span>
      {scoreLabel ? (
        <span
          className={clsx(
            "w-full truncate text-meta font-normal",
            active ? "text-textOnAccent/80" : "text-text1",
          )}
        >
          {scoreLabel}
        </span>
      ) : null}
    </Button>
  );
}
