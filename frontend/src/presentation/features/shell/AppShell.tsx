import { useEffect } from "react";
import type { ReactNode } from "react";
import { Container } from "./Container";

export function AppShell(props: {
  title: ReactNode;
  subtitle?: ReactNode;
  breadcrumb?: ReactNode;
  right?: ReactNode;
  children: ReactNode;
  theme?: "light" | "dark";
}) {
  const theme = props.theme ?? "dark";

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
  }, [theme]);

  return (
    <div className="min-h-dvh text-text0" data-theme={theme}>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-panel focus:bg-surfaceControl focus:px-3 focus:py-2"
      >
        Skip to content
      </a>
      <div className="py-6 sm:py-10">
        <Container>
          <header className="mb-5 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0">
              <h1 className="text-title font-semibold tracking-[-0.01em]">{props.title}</h1>
              {props.breadcrumb ? <div className="mt-2">{props.breadcrumb}</div> : null}
              {props.subtitle ? <p className="mt-1 text-meta text-text1">{props.subtitle}</p> : null}
            </div>
            {props.right ? <div className="shrink-0">{props.right}</div> : null}
          </header>

          <main id="main-content">{props.children}</main>
        </Container>
      </div>
    </div>
  );
}
