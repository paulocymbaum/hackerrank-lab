import { useEffect } from "react";
import type { ReactNode } from "react";
import { Container } from "./Container";

export function AppShell(props: {
  title: ReactNode;
  subtitle?: ReactNode;
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
    <div className="min-h-dvh text-text0">
      <div className="py-6 sm:py-10">
        <Container>
          <header className="mb-5 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0">
              <h1 className="text-[22px] font-semibold tracking-[-0.01em]">{props.title}</h1>
              {props.subtitle ? (
                <p className="mt-1 text-[13px] text-text1">{props.subtitle}</p>
              ) : null}
            </div>
            {props.right ? <div className="shrink-0">{props.right}</div> : null}
          </header>

          <main>{props.children}</main>
        </Container>
      </div>
    </div>
  );
}

