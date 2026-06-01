import type { ReactNode } from "react";
import { Card } from "./Card";

export function Accordion(props: { title: ReactNode; children: ReactNode; defaultOpen?: boolean }) {
  return (
    <Card className="p-3" variant="panel">
      <details className="group" open={props.defaultOpen}>
        <summary
          className="min-h-11 list-none cursor-pointer select-none items-center justify-between gap-3 rounded-[12px] px-2 py-2 flex"
        >
          <div className="min-w-0">{props.title}</div>
          <div className="flex items-center gap-2 text-[12px] text-text1">
            <span className="hidden sm:inline">Toggle</span>
            <span className="transition group-open:rotate-180">▾</span>
          </div>
        </summary>

        <div className="mt-2 px-2 pb-1 text-text0">{props.children}</div>
      </details>
    </Card>
  );
}

