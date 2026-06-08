import * as RadixDialog from "@radix-ui/react-dialog";
import clsx from "clsx";
import type { ReactNode } from "react";

export function Dialog(props: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: ReactNode;
  header?: ReactNode;
  className?: string;
}) {
  return (
    <RadixDialog.Root open={props.open} onOpenChange={props.onOpenChange}>
      <RadixDialog.Portal>
        <RadixDialog.Overlay className="fixed inset-0 z-50 bg-black/50" />
        <RadixDialog.Content
          className={clsx(
            "fixed left-1/2 top-1/2 z-50 flex max-h-[90vh] w-[calc(100%-2rem)] max-w-[980px] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-sheet border border-border0 bg-surfaceModal shadow-glass2 outline-none",
            props.className,
          )}
          aria-describedby={props.description ? "dialog-description" : undefined}
        >
          <RadixDialog.Title className="sr-only">{props.title}</RadixDialog.Title>
          {props.description ? (
            <RadixDialog.Description id="dialog-description" className="sr-only">
              {props.description}
            </RadixDialog.Description>
          ) : null}
          {props.header}
          {props.children}
        </RadixDialog.Content>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  );
}
