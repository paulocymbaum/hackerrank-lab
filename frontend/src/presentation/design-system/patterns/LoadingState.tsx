import clsx from "clsx";

export function LoadingState(props: { message?: string; className?: string }) {
  return (
    <div className={clsx("grid gap-3", props.className)} role="status" aria-live="polite">
      <div className="h-4 w-40 animate-pulse rounded-panel bg-surfacePanel" />
      <div className="h-24 animate-pulse rounded-panel bg-surfacePanel" />
      <p className="m-0 text-meta text-text1">{props.message ?? "Loading…"}</p>
    </div>
  );
}
