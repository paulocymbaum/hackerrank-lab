import clsx from "clsx";
import { ChevronDown, Languages } from "lucide-react";
import { useState } from "react";
import type { AppLocale } from "../../../domain/types/locale";
import { SUPPORTED_LOCALES } from "../../../domain/types/locale";
import { useTranslation } from "../../../application/hooks/useTranslation";
import { Button, Icon, Popover } from "../../design-system";

const LOCALE_OPTION_KEYS: Record<AppLocale, "locale.en" | "locale.pt" | "locale.es" | "locale.zh"> =
  {
    en: "locale.en",
    pt: "locale.pt",
    es: "locale.es",
    zh: "locale.zh",
  };

export function LanguageSelector() {
  const { locale, setLocale, t } = useTranslation();
  const [open, setOpen] = useState(false);

  return (
    <Popover
      align="end"
      open={open}
      onOpenChange={setOpen}
      panelClassName="w-[min(100vw-2rem,11rem)] p-1"
      trigger={({ open: isOpen, toggle, triggerId, panelId }) => (
        <button
          id={triggerId}
          type="button"
          aria-expanded={isOpen}
          aria-controls={panelId}
          aria-haspopup="listbox"
          aria-label={t("locale.label")}
          onClick={toggle}
          className={clsx(
            "inline-flex h-9 items-center gap-2 rounded-panel border border-border0 bg-surfacePanel px-2 text-meta font-medium text-text0 transition",
            "hover:bg-surfaceControl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent0/60",
            isOpen && "border-accent0/40 bg-surfaceControl",
          )}
        >
          <Icon icon={Languages} size={16} className="shrink-0 text-text1" aria-hidden />
          <span>{t(LOCALE_OPTION_KEYS[locale])}</span>
          <Icon
            icon={ChevronDown}
            size={14}
            className={clsx("shrink-0 text-text1 transition", isOpen && "rotate-180")}
            aria-hidden
          />
        </button>
      )}
    >
      <div className="grid gap-0.5" role="listbox" aria-label={t("locale.label")}>
        {SUPPORTED_LOCALES.map((value) => (
          <Button
            key={value}
            type="button"
            size="sm"
            variant={locale === value ? "primary" : "ghost"}
            className={clsx("w-full justify-start", locale !== value && "text-text1")}
            role="option"
            aria-selected={locale === value}
            onClick={() => {
              setLocale(value);
              setOpen(false);
            }}
          >
            {t(LOCALE_OPTION_KEYS[value])}
          </Button>
        ))}
      </div>
    </Popover>
  );
}
