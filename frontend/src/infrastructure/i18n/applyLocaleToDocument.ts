import type { AppLocale } from "../../domain/types/locale";

export function applyLocaleToDocument(locale: AppLocale): void {
  document.documentElement.lang = locale;
}

export function readPersistedLocale(): AppLocale | null {
  try {
    const raw = localStorage.getItem("hackerrank-study-locale");
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { state?: { locale?: unknown } };
    const locale = parsed?.state?.locale;
    if (locale === "en" || locale === "pt" || locale === "es" || locale === "zh") return locale;
    return null;
  } catch {
    return null;
  }
}
