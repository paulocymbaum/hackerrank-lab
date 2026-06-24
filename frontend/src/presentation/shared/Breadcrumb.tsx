import clsx from "clsx";
import { useTranslation } from "../../application/hooks/useTranslation";

export type BreadcrumbSegment = {
  label: string;
  href?: string;
  onClick?: () => void;
};

export function Breadcrumb(props: { segments: BreadcrumbSegment[]; className?: string }) {
  const { t } = useTranslation();

  if (props.segments.length === 0) return null;

  return (
    <nav aria-label={t("nav.breadcrumb")} className={clsx("min-w-0", props.className)}>
      <ol className="m-0 flex flex-wrap items-center gap-1 p-0 text-meta text-text1">
        {props.segments.map((segment, index) => {
          const isLast = index === props.segments.length - 1;
          return (
            <li key={`${segment.label}-${index}`} className="flex min-w-0 items-center gap-1">
              {index > 0 ? <span aria-hidden="true">›</span> : null}
              {segment.onClick && !isLast ? (
                <button
                  type="button"
                  className="truncate text-text1 underline decoration-border0 underline-offset-2 hover:text-text0"
                  onClick={segment.onClick}
                >
                  {segment.label}
                </button>
              ) : (
                <span className={clsx("truncate", isLast ? "font-medium text-text0" : "text-text1")}>
                  {segment.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
