import type { BreadcrumbSegment } from "../../../shared/Breadcrumb";
import { Breadcrumb } from "../../../shared/Breadcrumb";

export function ReaderHeader(props: { title: string; segments: BreadcrumbSegment[] }) {
  return (
    <div className="min-w-0 border-b border-border0 bg-surfaceControl p-4">
      <div className="text-body font-semibold text-text0">{props.title}</div>
      <Breadcrumb segments={props.segments} className="mt-1" />
    </div>
  );
}
