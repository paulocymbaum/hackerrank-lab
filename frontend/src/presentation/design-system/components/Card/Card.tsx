import type { ReactNode } from "react";
import clsx from "clsx";

export type CardVariant = "panel" | "control";

export function Card(props: { children: ReactNode; variant?: CardVariant; className?: string }) {
  const variant = props.variant ?? "panel";

  return (
    <div
      className={clsx(
        "rounded-panel border border-border0 shadow-glass1 backdrop-blur-[var(--blur-2)]",
        variant === "control" ? "bg-surfaceControl" : "bg-surfacePanel",
        props.className,
      )}
    >
      {props.children}
    </div>
  );
}
