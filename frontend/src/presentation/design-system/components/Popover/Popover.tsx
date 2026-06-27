import clsx from "clsx";
import { useEffect, useId, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { createPortal } from "react-dom";

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
  const panelRef = useRef<HTMLDivElement>(null);
  const skipDismissRef = useRef(false);
  const triggerId = useId();
  const panelId = useId();
  const align = props.align ?? "start";
  const open = props.open ?? false;
  const [panelStyle, setPanelStyle] = useState<CSSProperties | null>(null);

  const updatePanelPosition = () => {
    const anchor = rootRef.current;
    if (!anchor) return;

    const rect = anchor.getBoundingClientRect();
    if (align === "end") {
      setPanelStyle({
        top: rect.bottom + 8,
        right: Math.max(8, window.innerWidth - rect.right),
      });
      return;
    }

    setPanelStyle({
      top: rect.bottom + 8,
      left: Math.max(8, rect.left),
    });
  };

  useLayoutEffect(() => {
    if (!open) {
      setPanelStyle(null);
      return;
    }

    updatePanelPosition();
    window.addEventListener("resize", updatePanelPosition);
    window.addEventListener("scroll", updatePanelPosition, true);
    return () => {
      window.removeEventListener("resize", updatePanelPosition);
      window.removeEventListener("scroll", updatePanelPosition, true);
    };
  }, [open, align]);

  useEffect(() => {
    if (!open) return;

    const onDocumentClick = (event: MouseEvent) => {
      if (skipDismissRef.current) {
        skipDismissRef.current = false;
        return;
      }

      const target = event.target as Node;
      if (rootRef.current?.contains(target) || panelRef.current?.contains(target)) return;
      props.onOpenChange?.(false);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") props.onOpenChange?.(false);
    };

    document.addEventListener("click", onDocumentClick, true);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("click", onDocumentClick, true);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, props.onOpenChange]);

  const toggle = () => {
    const next = !open;
    if (next) skipDismissRef.current = true;
    props.onOpenChange?.(next);
  };

  const panel =
    open && panelStyle
      ? createPortal(
          <div
            ref={panelRef}
            id={panelId}
            role="dialog"
            aria-labelledby={triggerId}
            className={clsx(
              "fixed z-[var(--z-popover)] w-[min(100vw-2rem,22rem)] rounded-panel border border-border0 bg-surfaceModal p-2 shadow-glass2",
              props.panelClassName,
            )}
            style={panelStyle}
          >
            {props.children}
          </div>,
          document.body,
        )
      : null;

  return (
    <div ref={rootRef} className={clsx("relative", props.className)}>
      {props.trigger({ open, toggle, triggerId, panelId })}
      {panel}
    </div>
  );
}
