import type { ReactNode } from "react";

export function Container(props: { children: ReactNode; className?: string }) {
  return (
    <div
      className={[
        "mx-auto w-full max-w-[1024px] px-4 sm:px-6 lg:px-8",
        props.className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {props.children}
    </div>
  );
}
