import * as RadixTabs from "@radix-ui/react-tabs";
import clsx from "clsx";
import type { ReactNode } from "react";

export type TabItem = {
  value: string;
  label: ReactNode;
  icon?: ReactNode;
};

export function Tabs(props: {
  items: TabItem[];
  value: string;
  onValueChange: (value: string) => void;
  className?: string;
  listClassName?: string;
}) {
  return (
    <RadixTabs.Root value={props.value} onValueChange={props.onValueChange} className={props.className}>
      <RadixTabs.List
        className={clsx(
          "flex flex-wrap items-center gap-2 overflow-x-auto",
          props.listClassName,
        )}
        aria-label="Tabs"
      >
        {props.items.map((item) => (
          <RadixTabs.Trigger
            key={item.value}
            value={item.value}
            className={clsx(
              "inline-flex h-11 min-w-[44px] items-center justify-center gap-2 rounded-panel border px-3 text-body font-medium transition",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent0/60",
              "data-[state=active]:border-accent0/50 data-[state=active]:bg-surfaceControl data-[state=active]:text-text0 data-[state=active]:shadow-glass1",
              "data-[state=inactive]:border-border0 data-[state=inactive]:bg-surfacePanel data-[state=inactive]:text-text1",
            )}
          >
            {item.icon}
            {item.label}
          </RadixTabs.Trigger>
        ))}
      </RadixTabs.List>
    </RadixTabs.Root>
  );
}
