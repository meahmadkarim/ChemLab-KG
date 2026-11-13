import type { Locale } from "@/i18n/config";

export const siteConfig = {
  name: "ChemLab KG",
  shortName: "ChemLab",
  countryBadge: "KG",
  maxCatalogExperiments: 30,
  tagline: {
    en: "Learn Chemistry Through Real Experiments",
    ky: "Чыныгы тажрыйбалар аркылуу химияны үйрөнүңүз",
    ru: "Изучайте химию через реальные эксперименты",
  } satisfies Record<Locale, string>,
  description: {
    en: "An interactive chemistry experiment library for students and teachers across Kyrgyzstan — watch real laboratory reactions, explore visual explanations, and test your understanding.",
    ky: "Кыргызстандагы окуучулар жана мугалимдер үчүн интерактивдүү химиялык тажрыйбалар китепканасы — чыныгы лабораториялык реакцияларды көрүп, илимий түшүндүрмөлөрдү окуп, билимиңизди текшериңиз.",
    ru: "Интерактивная библиотека химических экспериментов для учеников и учителей Кыргызстана — смотрите реальные лабораторные реакции, разбирайте наглядные объяснения и проверяйте знания.",
  } satisfies Record<Locale, string>,
} as const;
