import clsx from "clsx";
import { Languages } from "lucide-react";
import type { AppLocale } from "../../../domain/types/locale";
import { SUPPORTED_LOCALES } from "../../../domain/types/locale";
import { useTranslation } from "../../../application/hooks/useTranslation";
import { Icon } from "../../design-system";

const LOCALE_OPTION_KEYS: Record<AppLocale, "locale.en" | "locale.pt" | "locale.es" | "locale.zh"> =
  {
    en: "locale.en",
    pt: "locale.pt",
    es: "locale.es",
    zh: "locale.zh",
  };

export function LanguageSelector() {
  const { locale, setLocale, t } = useTranslation();

  return (
    <label
      className={clsx(
        "inline-flex items-center gap-2 rounded-panel border border-border0 bg-surfacePanel px-2 py-1",
      )}
    >
      <Icon icon={Languages} size={16} className="shrink-0 text-text1" aria-hidden />
      <span className="sr-only">{t("locale.label")}</span>
      <select
        value={locale}
        aria-label={t("locale.label")}
        className="min-w-[6.5rem] cursor-pointer border-0 bg-transparent text-meta font-medium text-text0 outline-none"
        onChange={(event) => setLocale(event.target.value as AppLocale)}
      >
        {SUPPORTED_LOCALES.map((value) => (
          <option key={value} value={value}>
            {t(LOCALE_OPTION_KEYS[value])}
          </option>
        ))}
      </select>
    </label>
  );
}
