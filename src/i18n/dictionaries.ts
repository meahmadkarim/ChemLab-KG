import { notFound } from "next/navigation";
import { defaultLocale, isLocale, type Locale } from "./config";
import type en from "./dictionaries/en.json";

export type Dictionary = typeof en;

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  ky: () => import("./dictionaries/ky.json").then((m) => m.default),
  ru: () => import("./dictionaries/ru.json").then((m) => m.default),
  en: () => import("./dictionaries/en.json").then((m) => m.default),
};

/** Validates a route param string as a supported Locale or triggers 404. */
export function resolveLocale(value: string | undefined | null): Locale {
  if (!isLocale(value)) {
    notFound();
  }
  return value;
}

/** Resolves a locale string (or defaults to defaultLocale). */
export async function getLocale(value?: string | null): Promise<Locale> {
  if (value && isLocale(value)) {
    return value;
  }
  return defaultLocale;
}

/** UI dictionary for the given locale (Server Components). */
export async function getDictionary(locale: Locale = defaultLocale): Promise<Dictionary> {
  const loader = dictionaries[locale] ?? dictionaries[defaultLocale];
  return loader();
}
