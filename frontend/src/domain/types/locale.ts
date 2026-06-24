export const SUPPORTED_LOCALES = ["en", "pt", "es", "zh"] as const;

export type AppLocale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: AppLocale = "en";

export function isAppLocale(value: unknown): value is AppLocale {
  return typeof value === "string" && (SUPPORTED_LOCALES as readonly string[]).includes(value);
}

export function detectBrowserLocale(): AppLocale {
  if (typeof navigator === "undefined") return DEFAULT_LOCALE;
  const primary = navigator.language.split("-")[0]?.toLowerCase();
  if (primary === "pt" || primary === "es" || primary === "zh") return primary;
  return DEFAULT_LOCALE;
}
