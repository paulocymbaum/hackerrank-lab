import { useMemo } from "react";
import type { AppLocale } from "../../domain/types/locale";
import type { TranslationParams } from "../../domain/i18n/translate";
import type { TranslationKey } from "../../infrastructure/i18n/locales/en";
import { createTranslator } from "../services/translator";
import { useLocaleStore } from "../stores/localeStore";

export function useTranslation() {
  const locale = useLocaleStore((s) => s.locale);
  const setLocale = useLocaleStore((s) => s.setLocale);

  const t = useMemo(() => createTranslator(locale), [locale]);

  return {
    locale,
    setLocale,
    t: (key: TranslationKey, params?: TranslationParams) => t(key, params),
  };
}

export function useLocale(): AppLocale {
  return useLocaleStore((s) => s.locale);
}
