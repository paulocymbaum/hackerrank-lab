import type { ReactNode } from "react";

export type CardVariant = "panel" | "control";

export function Card(props: { children: ReactNode; variant?: CardVariant; className?: string }) {
  const variant = props.variant ?? "panel";
  const base =
    "rounded-panel border border-border0 shadow-glass1 backdrop-blur-[var(--blur-2)]";
  const fill = variant === "control" ? "bg-glassFillStrong" : "bg-glassFill";

  return <div className={[base, fill, props.className].filter(Boolean).join(" ")}>{props.children}</div>;
}

