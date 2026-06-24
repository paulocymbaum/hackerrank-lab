import type { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import { Button, Icon } from "../design-system";

export function ActivityScreenLayout(props: {
  title: string;
  backLabel: string;
  onBack: () => void;
  children: ReactNode;
}) {
  return (
    <section className="flex min-h-[calc(100dvh-11rem)] flex-col overflow-hidden rounded-panel border border-border0">
      <div className="flex shrink-0 items-center gap-3 border-b border-border0 px-4 py-3">
        <Button variant="secondary" size="md" onClick={props.onBack}>
          <Icon icon={ArrowLeft} />
          {props.backLabel}
        </Button>
        <h2 className="min-w-0 truncate text-body font-semibold text-text0">{props.title}</h2>
      </div>
      <div className="min-h-0 flex-1 overflow-auto">{props.children}</div>
    </section>
  );
}
