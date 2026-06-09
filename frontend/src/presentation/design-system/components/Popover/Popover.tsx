import clsx from "clsx";
import { useEffect, useId, useRef, type ReactNode } from "react";

export function Popover(props: {
  trigger: (args: {
    open: boolean;
    toggle: () => void;
    triggerId: string;
    panelId: string;
  }) => ReactNode;
  children: ReactNode;
  className?: string;
  panelClassName?: string;
  align?: "start" | "end";
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerId = useId();
  const panelId = useId();
  const align = props.align ?? "start";
  const open = props.open ?? false;

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        props.onOpenChange?.(false);
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") props.onOpenChange?.(false);
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, props.onOpenChange]);

  const toggle = () => props.onOpenChange?.(!open);

  return (
    <div ref={rootRef} className={clsx("relative", props.className)}>
      {props.trigger({ open, toggle, triggerId, panelId })}
      {open ? (
        <div
          id={panelId}
          role="dialog"
          aria-labelledby={triggerId}
          className={clsx(
            "absolute z-30 mt-2 w-[min(100vw-2rem,22rem)] rounded-panel border border-border0 bg-surfaceModal p-2 shadow-glass2",
            align === "start" ? "left-0" : "right-0",
            props.panelClassName,
          )}
        >
          {props.children}
        </div>
      ) : null}
    </div>
  );
}
