import type { ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { Card } from "../Card";
import { Icon } from "../../icons/Icon";

export function Accordion(props: { title: ReactNode; children: ReactNode; defaultOpen?: boolean }) {
  return (
    <Card className="p-3" variant="panel">
      <details className="group" {...(props.defaultOpen ? { open: true } : {})}>
        <summary className="flex min-h-11 list-none cursor-pointer select-none items-center justify-between gap-3 rounded-panel px-2 py-2">
          <div className="min-w-0">{props.title}</div>
          <Icon
            icon={ChevronDown}
            className="text-text1 transition group-open:rotate-180"
            size={16}
          />
        </summary>
        <div className="mt-2 px-2 pb-1 text-text0">{props.children}</div>
      </details>
    </Card>
  );
}
