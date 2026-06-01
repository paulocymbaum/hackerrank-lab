import type { ButtonHTMLAttributes } from "react";

export type ButtonVariant = "primary" | "secondary" | "ghost";
export type ButtonSize = "sm" | "md";

export function Button(
  props: ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: ButtonVariant;
    size?: ButtonSize;
  },
) {
  const { className, variant = "secondary", size = "md", ...rest } = props;

  const base =
    "inline-flex items-center justify-center gap-2 select-none whitespace-nowrap " +
    "rounded-[12px] border transition " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent0/60 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent " +
    "disabled:opacity-50 disabled:cursor-not-allowed";

  const sizes =
    size === "sm"
      ? "h-9 px-3 text-[13px]"
      : "h-11 px-4 text-[14px]";

  const variants: Record<ButtonVariant, string> = {
    primary:
      "bg-accent0 text-white border-border0 shadow-glass1 hover:brightness-110 active:brightness-95",
    secondary:
      "bg-glassFillStrong text-text0 border-border0 shadow-glass1 hover:brightness-[1.03] active:brightness-95",
    ghost:
      "bg-transparent text-text0 border-transparent hover:bg-glassFill active:bg-glassFillStrong",
  };

  return (
    <button
      {...rest}
      className={[base, sizes, variants[variant], className].filter(Boolean).join(" ")}
    />
  );
}

