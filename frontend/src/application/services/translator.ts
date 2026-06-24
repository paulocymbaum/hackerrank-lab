import type { AppLocale } from "../../domain/types/locale";
import type { TranslationParams } from "../../domain/i18n/translate";
import type { TranslationKey } from "../../infrastructure/i18n/locales/en";
import { getTranslationDictionary } from "../../infrastructure/i18n/translationCatalog";

function interpolate(template: string, params?: TranslationParams): string {
  if (!params) return template;
  return Object.entries(params).reduce(
    (text, [key, value]) => text.replaceAll(`{${key}}`, String(value)),
    template,
  );
}

export function createTranslator(locale: AppLocale) {
  const dictionary = getTranslationDictionary(locale);

  return function translate(key: TranslationKey, params?: TranslationParams): string {
    const template = dictionary[key];
    return interpolate(template, params);
  };
}

export type AppTranslator = ReturnType<typeof createTranslator>;
