import type { AppLocale } from "../../domain/types/locale";
import type { TranslationDictionary } from "./locales/en";
import { en } from "./locales/en";
import { ptWithFallback } from "./locales/pt";
import { esWithFallback } from "./locales/es";
import { zhWithFallback } from "./locales/zh";

export const translationCatalog: Record<AppLocale, TranslationDictionary> = {
  en,
  pt: ptWithFallback,
  es: esWithFallback,
  zh: zhWithFallback,
};

export function getTranslationDictionary(locale: AppLocale): TranslationDictionary {
  return translationCatalog[locale] ?? en;
}
