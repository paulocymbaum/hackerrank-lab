import type { ButtonHTMLAttributes } from "react";
import clsx from "clsx";

export type ButtonVariant = "primary" | "secondary" | "ghost";
export type ButtonSize = "sm" | "md";

export function Button(
  props: ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: ButtonVariant;
    size?: ButtonSize;
  },
) {
  const { className, variant = "secondary", size = "md", ...rest } = props;

  return (
    <button
      {...rest}
      className={clsx(
        "inline-flex select-none items-center justify-center gap-2 whitespace-nowrap rounded-panel border transition",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent0/60 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent",
        "disabled:cursor-not-allowed disabled:opacity-50",
        size === "sm" ? "h-9 px-3 text-meta" : "h-11 px-4 text-body",
        variant === "primary" &&
          "border-border0 bg-accent0 text-white shadow-glass1 hover:brightness-110 active:brightness-95",
        variant === "secondary" &&
          "border-border0 bg-surfaceControl text-text0 shadow-glass1 hover:brightness-[1.03] active:brightness-95",
        variant === "ghost" &&
          "border-transparent bg-transparent text-text0 hover:bg-surfacePanel active:bg-surfaceControl",
        className,
      )}
    />
  );
}
