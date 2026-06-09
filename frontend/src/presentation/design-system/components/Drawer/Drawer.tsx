import clsx from "clsx";
import type { ReactNode } from "react";
import { X } from "lucide-react";
import { Button } from "../Button";
import { Icon } from "../../icons/Icon";

export function Drawer(props: {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  className?: string;
}) {
  if (!props.open) return null;

  return (
    <>
      <button
        type="button"
        aria-label="Close drawer overlay"
        className="fixed inset-0 z-40 bg-black/30 lg:hidden"
        onClick={props.onClose}
      />
      <aside
        className={clsx(
          "fixed inset-x-0 bottom-0 z-50 flex max-h-[85vh] flex-col overflow-hidden rounded-t-sheet border border-border0 bg-surfaceModal shadow-glass2",
          "lg:static lg:inset-auto lg:max-h-none lg:w-[min(480px,40vw)] lg:shrink-0 lg:rounded-panel lg:border-l lg:border-t-0",
          props.className,
        )}
      >
        <div className="flex items-center justify-between gap-3 border-b border-border0 px-4 py-3">
          {props.title ? (
            <div className="truncate text-body font-semibold text-text0">{props.title}</div>
          ) : (
            <div />
          )}
          <Button variant="ghost" size="md" onClick={props.onClose} title="Close drawer">
            <Icon icon={X} />
            <span className="lg:hidden">Back to explanation</span>
          </Button>
        </div>
        <div className="min-h-0 flex-1 overflow-auto">{props.children}</div>
      </aside>
    </>
  );
}
