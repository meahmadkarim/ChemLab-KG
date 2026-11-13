import { localeTags, type Locale } from "./config";

export type PluralForms = {
  one?: string;
  few?: string;
  many?: string;
  other: string;
};

/**
 * Picks the grammatically correct plural form using Intl.PluralRules.
 * Russian needs one/few/many ("1 эксперимент", "2 эксперимента", "5 экспериментов");
 * Kyrgyz nouns after numerals do not change, so only `other` is required.
 * `{n}` in the chosen string is replaced with the number.
 */
export function plural(locale: Locale, n: number, forms: PluralForms): string {
  const rule = new Intl.PluralRules(localeTags[locale]).select(n) as keyof PluralForms;
  const template = forms[rule] ?? forms.other;
  return template.replace("{n}", String(n));
}

/** Formats seconds as m:ss (e.g. 225 → "3:45"). */
export function formatDuration(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}
