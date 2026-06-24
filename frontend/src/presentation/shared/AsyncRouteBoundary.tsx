import type { ReactNode } from "react";
import { ErrorPanel, LoadingState } from "../design-system";

type AsyncStatus = "idle" | "loading" | "ready" | "error";

export function AsyncRouteBoundary(props: {
  status: AsyncStatus;
  error?: string | null;
  onRetry?: () => void;
  loadingMessage: string;
  errorTitle?: string;
  notFoundTitle?: string;
  notFoundMessage?: string;
  isEmpty?: boolean;
  children: ReactNode;
}) {
  const {
    status,
    error,
    onRetry,
    loadingMessage,
    errorTitle = "Failed to load.",
    notFoundTitle = "Not found.",
    isEmpty,
    children,
  } = props;

  if (status === "loading" || status === "idle") {
    return <LoadingState message={loadingMessage} />;
  }

  if (status === "error") {
    return (
      <ErrorPanel
        title={errorTitle}
        message={error ?? undefined}
        onRetry={onRetry ? () => void onRetry() : undefined}
      />
    );
  }

  if (isEmpty) {
    return (
      <ErrorPanel
        title={notFoundTitle}
        message={props.notFoundMessage}
      />
    );
  }

  return <>{children}</>;
}
