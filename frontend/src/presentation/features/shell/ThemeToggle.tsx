import clsx from "clsx";
import { Moon, Sun } from "lucide-react";
import type { AppTheme } from "../../../domain/types/theme";
import { useTranslation } from "../../../application/hooks/useTranslation";
import { useThemeStore } from "../../../application/stores/themeStore";
import { Button, Icon } from "../../design-system";

const OPTIONS: { value: AppTheme; labelKey: "theme.light" | "theme.dark"; icon: typeof Sun }[] =
  [
    { value: "light", labelKey: "theme.light", icon: Sun },
    { value: "dark", labelKey: "theme.dark", icon: Moon },
  ];

export function ThemeToggle() {
  const { t } = useTranslation();
  const theme = useThemeStore((s) => s.theme);
  const setTheme = useThemeStore((s) => s.setTheme);

  return (
    <div
      className="inline-flex rounded-panel border border-border0 bg-surfacePanel p-0.5"
      role="group"
      aria-label={t("theme.label")}
    >
      {OPTIONS.map((option) => (
        <Button
          key={option.value}
          type="button"
          size="sm"
          variant={theme === option.value ? "primary" : "ghost"}
          className={clsx(
            "min-w-[4.75rem]",
            theme !== option.value && "text-text1",
          )}
          aria-pressed={theme === option.value}
          onClick={() => setTheme(option.value)}
        >
          <Icon icon={option.icon} size={16} />
          {t(option.labelKey)}
        </Button>
      ))}
    </div>
  );
}
