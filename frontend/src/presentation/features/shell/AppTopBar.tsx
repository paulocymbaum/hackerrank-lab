import { useTranslation } from "../../../application/hooks/useTranslation";
import { Container } from "./Container";
import { LanguageSelector } from "./LanguageSelector";
import { PomodoroHeaderControl } from "./PomodoroHeaderControl";
import { ThemeToggle } from "./ThemeToggle";

export function AppTopBar() {
  const { t } = useTranslation();

  return (
    <div className="sticky top-0 z-50 border-b border-border0 bg-glassFillStrong backdrop-blur-[var(--blur-2)]">
      <Container className="flex h-12 items-center justify-between gap-3">
        <span className="truncate text-meta font-semibold text-text0">{t("app.title")}</span>
        <div className="flex shrink-0 items-center gap-2">
          <LanguageSelector />
          <PomodoroHeaderControl />
          <ThemeToggle />
        </div>
      </Container>
    </div>
  );
}
