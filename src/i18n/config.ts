/**
 * Locale configuration shared by proxy.ts, server components, and client components.
 * Supports Kyrgyz (ky), Russian (ru), and English (en) for schools in Kyrgyzstan
 * and international portfolio reviewers.
 */
export const locales = ["ky", "ru", "en"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "ky";

/** Cookie remembering an explicit language choice made with the switcher. */
export const LOCALE_COOKIE = "NEXT_LOCALE";

export function isLocale(value: string | undefined | null): value is Locale {
  return !!value && (locales as readonly string[]).includes(value);
}

/** Native names shown in the language switcher (never translated). */
export const localeLabels: Record<Locale, { short: string; long: string }> = {
  ky: { short: "КЫР", long: "Кыргызча" },
  ru: { short: "РУС", long: "Русский" },
  en: { short: "ENG", long: "English" },
};

/** BCP-47 tags for Intl APIs and <html lang>. */
export const localeTags: Record<Locale, string> = {
  ky: "ky-KG",
  ru: "ru-KG",
  en: "en-US",
};
