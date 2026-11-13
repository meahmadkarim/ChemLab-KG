/* eslint-disable @next/next/no-img-element */
import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  Play,
  CheckCircle2,
  Users,
  ClipboardCheck,
  Sparkles,
} from "lucide-react";
import { getDictionary, resolveLocale } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import { getFeaturedExperiments, TOPICS } from "@/features/experiments/server-catalog";
import { InteractivePhLab } from "@/components/illustrations/InteractivePhLab";
import { InteractiveConceptCheck } from "@/components/home/InteractiveConceptCheck";
import { ExperimentCard } from "@/components/experiments/ExperimentCard";
import { ChemIllustration } from "@/components/illustrations/ChemIllustration";
import { FullWidthSection } from "@/components/layout/FullWidthSection";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { AnimatedProgressBar } from "@/components/ui/AnimatedProgressBar";
import type { IllustrationVariant } from "@/features/experiments/types";
import {
  HomePageHeroCtas,
  HomePageTeacherCta,
} from "@/components/auth/RoleAwareCtas";

const HERO_COPY: Record<
  Locale,
  {
    headline: string;
    subtitle: string;
    primaryCta: string;
    secondaryCta: string;
  }
> = {
  en: {
    headline: "Chemistry Comes to Life.",
    subtitle:
      "Watch real experiments. Discover amazing reactions. Learn by doing.",
    primaryCta: "Explore Experiments",
    secondaryCta: "For Teachers",
  },
  ky: {
    headline: "Химия жандуу илимге айланат.",
    subtitle:
      "Чыныгы тажрыйбаларды көрүңүз. Реакцияларды ачыңыз. Практика аркылуу үйрөнүңүз.",
    primaryCta: "Тажрыйбаларды көрүү",
    secondaryCta: "Мугалимдер үчүн",
  },
  ru: {
    headline: "Химия оживает на глазах.",
    subtitle:
      "Смотрите реальные опыты. Открывайте реакции. Учитесь на практике.",
    primaryCta: "Смотреть эксперименты",
    secondaryCta: "Для учителей",
  },
};

const FEATURED_TOPIC_PREVIEWS: Array<{
  id: string;
  illustration: IllustrationVariant;
  slug: string;
  pastelBg: string;
}> = [
  {
    id: "acids-bases",
    illustration: "indicator-flask",
    slug: "red-cabbage-ph-indicator",
    pastelBg: "#E6F2F5",
  },
  {
    id: "reactions",
    illustration: "peroxide-foam",
    slug: "catalytic-decomposition-hydrogen-peroxide",
    pastelBg: "#F8F7F4",
  },
  {
    id: "electrochemistry",
    illustration: "electrolysis-tubes",
    slug: "electrolysis-of-water-hoffman",
    pastelBg: "#E6F2F5",
  },
  {
    id: "solutions",
    illustration: "crystal-lattice",
    slug: "growing-copper-sulfate-single-crystals",
    pastelBg: "#F8F7F4",
  },
];

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = resolveLocale(rawLocale);
  const dict = await getDictionary(locale);
  const hero = HERO_COPY[locale];
  const featured = (await getFeaturedExperiments()).slice(0, 3);

  return (
    <div className="w-full">
      {/* SECTION 1 — IMMERSIVE FULL-WIDTH PHOTOGRAPHIC HERO */}
      <section className="relative min-h-[560px] sm:min-h-[640px] lg:min-h-[700px] w-full flex items-center overflow-hidden bg-[#142D40]">
        <img
          src="/images/hero-chemistry.jpg"
          alt="Students and teacher observing chemistry laboratory experiments"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />

        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(95deg, rgba(20, 45, 64, 0.92) 0%, rgba(20, 45, 64, 0.74) 52%, rgba(20, 45, 64, 0.28) 100%)",
          }}
        />

        <div className="container-page relative z-10 py-24 sm:py-32">
          <ScrollReveal variant="fade-up" className="max-w-2xl space-y-6">
            <h1 className="heading-hero text-white">{hero.headline}</h1>

            <p className="body-lead text-white/90 max-w-xl">{hero.subtitle}</p>

            <HomePageHeroCtas
              locale={locale}
              primaryCta={hero.primaryCta}
              secondaryCta={hero.secondaryCta}
            />
          </ScrollReveal>
        </div>
      </section>

      {/* SECTION 2 — FEATURED EXPERIMENTS (FULL-WIDTH PURE WHITE #FFFFFF) */}
      <FullWidthSection tone="white" size="spacious">
        <div className="space-y-10">
          <ScrollReveal
            variant="fade-up"
            className="flex flex-col sm:flex-row sm:items-end justify-between gap-4"
          >
            <div className="space-y-2">
              <h2 className="heading-section text-[#142D40]">
                {locale === "ky"
                  ? "Тандалган тажрыйбалар"
                  : locale === "ru"
                  ? "Избранные эксперименты"
                  : "Featured Experiments"}
              </h2>
              <p className="body-lead text-[#536574] max-w-xl">
                {locale === "ky"
                  ? "Чыныгы лабораториялык реакцияларды кадам сайын көрүңүз."
                  : locale === "ru"
                  ? "Наглядные лабораторные видеоопыты для изучения в классе и дома."
                  : "Start with three classic laboratory reactions filmed step by step."}
              </p>
            </div>
            <Link
              href={`/${locale}/experiments`}
              className="inline-flex items-center gap-2 text-base font-bold text-[#087F8C] hover:underline shrink-0"
            >
              {locale === "ky"
                ? "Бардык тажрыйбаларды көрүү"
                : locale === "ru"
                ? "Смотреть все эксперименты"
                : "View All Experiments"}
              <ArrowRight className="size-4" />
            </Link>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
            {featured.map((exp, idx) => (
              <ScrollReveal
                key={exp.id}
                variant="fade-up"
                delayMs={idx * 90}
              >
                <ExperimentCard experiment={exp} locale={locale} />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </FullWidthSection>

      {/* SECTION 3 — EXPLORE CHEMISTRY (FULL-WIDTH WARM WHITE #F8F7F4) */}
      <FullWidthSection tone="warm" size="spacious">
        <div className="space-y-10">
          <ScrollReveal
            variant="fade-up"
            className="flex flex-col sm:flex-row sm:items-end justify-between gap-4"
          >
            <div className="space-y-2">
              <h2 className="heading-section text-[#142D40]">
                {locale === "ky"
                  ? "Химияны изилдеңиз"
                  : locale === "ru"
                  ? "Изучайте химию"
                  : "Explore Chemistry"}
              </h2>
              <p className="body-lead text-[#536574] max-w-lg">
                {locale === "ky"
                  ? "Негизги химиялык кубулуштарды визуалдык тажрыйбалар аркылуу ачыңыз."
                  : locale === "ru"
                  ? "Переходите к наглядным реакциям по ключевым темам."
                  : "Visual experiments across core chemical phenomena."}
              </p>
            </div>
            <Link
              href={`/${locale}/experiments`}
              className="inline-flex items-center gap-2 text-base font-bold text-[#142D40] hover:text-[#087F8C] shrink-0"
            >
              {locale === "ky"
                ? "Бардык темалар"
                : locale === "ru"
                ? "Все разделы"
                : "All 8 Topics"}
              <ArrowRight className="size-4" />
            </Link>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURED_TOPIC_PREVIEWS.map((preview, idx) => {
              const topic =
                TOPICS.find((t) => t.id === preview.id) ?? TOPICS[0];
              return (
                <ScrollReveal
                  key={topic.id}
                  variant="scale-in"
                  delayMs={idx * 80}
                >
                  <Link
                    href={`/${locale}/experiments?topic=${topic.id}`}
                    className="group rounded-3xl overflow-hidden border border-[#142D40]/10 bg-white transition-all duration-200 hover:-translate-y-1 hover:shadow-md flex flex-col h-full"
                  >
                    <div
                      className="h-48 w-full overflow-hidden flex items-center justify-center"
                      style={{ backgroundColor: preview.pastelBg }}
                    >
                      <ChemIllustration
                        variant={preview.illustration}
                        slug={preview.slug}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-6 space-y-1.5 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="heading-sub text-[#142D40]">
                          {topic.title[locale]}
                        </h3>
                        <p className="mt-1 text-sm text-[#536574] leading-relaxed">
                          {topic.description[locale]}
                        </p>
                      </div>
                    </div>
                  </Link>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </FullWidthSection>

      {/* SECTION 4 — SEE CHEMISTRY IN ACTION (FULL-WIDTH PURE WHITE #FFFFFF) */}
      <FullWidthSection tone="white" size="spacious">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          <ScrollReveal variant="fade-up" className="lg:col-span-5 space-y-4">
            <h2 className="heading-section text-[#142D40]">
              {locale === "ky"
                ? "Химияны иш жүзүндө көрүңүз"
                : locale === "ru"
                ? "Химия в действии"
                : "See Chemistry in Action"}
            </h2>
            <p className="body-lead text-[#536574] max-w-md">
              {locale === "ky"
                ? "Тажрыйба жасаңыз, байкаңыз жана ачылыш кылыңыз."
                : locale === "ru"
                ? "Экспериментируйте, наблюдайте и открывайте новое."
                : "Experiment, observe, and discover."}
            </p>
            <div className="pt-2">
              <Link
                href={`/${locale}/experiments/red-cabbage-ph-indicator`}
                className="inline-flex items-center gap-2 rounded-full bg-[#142D40] hover:bg-[#087F8C] text-white px-6 py-3.5 text-sm font-bold transition-colors"
              >
                <Play className="size-4 fill-current" />
                {locale === "ky"
                  ? "Толук тажрыйбаны көрүү"
                  : locale === "ru"
                  ? "Открыть эксперимент"
                  : "Watch This Experiment"}
              </Link>
            </div>
          </ScrollReveal>

          <ScrollReveal
            variant="scale-in"
            delayMs={120}
            className="lg:col-span-7"
          >
            <InteractivePhLab locale={locale} />
          </ScrollReveal>
        </div>
      </FullWidthSection>

      {/* SECTION 5 — TEST YOUR INTUITION (FULL-WIDTH WARM WHITE #F8F7F4) */}
      <InteractiveConceptCheck locale={locale} copy={dict.interactivePreview} />

      {/* SECTION 6 — AI CHEMISTRY TUTOR (FULL-WIDTH PURE WHITE #FFFFFF) */}
      <FullWidthSection tone="white" size="spacious">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          <ScrollReveal variant="fade-up" className="lg:col-span-5 space-y-4">
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#142D40]">
              <Sparkles className="size-4 text-[#087F8C]" />
              ChemLab AI
            </span>
            <h2 className="heading-section text-[#142D40]">
              {locale === "ky"
                ? "Кызыкпы? Жөн гана сураңыз."
                : locale === "ru"
                ? "Интересно? Просто спросите."
                : "Curious? Just Ask."}
            </h2>
            <p className="body-lead text-[#536574] max-w-md">
              {locale === "ky"
                ? "Ар бир реакциянын илимий маңызын түшүнүүгө жардам алыңыз."
                : locale === "ru"
                ? "Получите понятное объяснение науки за каждой реакцией."
                : "Get help understanding the science behind every reaction."}
            </p>
          </ScrollReveal>

          <div className="lg:col-span-7 space-y-4">
            <ScrollReveal variant="fade-up" delayMs={80}>
              <div className="flex justify-end">
                <div className="rounded-3xl rounded-tr-sm bg-[#142D40] text-white px-6 py-4 text-base max-w-md shadow-xs">
                  {locale === "ky"
                    ? "Эмне үчүн кызыл кочандын ширеси сода кошкондо жашыл-көк болуп калды?"
                    : locale === "ru"
                    ? "Почему сок красной капусты стал сине-зелёным, когда мы добавили соду?"
                    : "Why did the red cabbage juice turn blue-green when baking soda was added?"}
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal variant="fade-up" delayMs={200}>
              <div className="flex justify-start">
                <div className="rounded-3xl rounded-tl-sm bg-white border border-[#142D40]/10 p-6 sm:p-7 text-base text-[#142D40] space-y-2 max-w-lg shadow-sm">
                  <p className="font-bold text-[#142D40]">
                    {locale === "ky"
                      ? "Сода эритмени щелочтуу кылат (pH > 8)."
                      : locale === "ru"
                      ? "Питьевая сода создаёт щелочную среду (pH > 8)."
                      : "Baking soda makes the water basic (above pH 8)."}
                  </p>
                  <p className="text-[#536574] leading-relaxed">
                    {locale === "ky"
                      ? "Табигый пигмент молекулалары суутек ионун (H⁺) жоготуп, формасын өзгөртөт — ошондуктан кызыл эмес, көгүш-жашыл жарыкты чагылдырат."
                      : locale === "ru"
                      ? "Молекулы природного пигмента отдают ион водорода (H⁺) и меняют форму, отражая сине-зелёный свет вместо красного."
                      : "The pigment molecules lose a hydrogen ion (H⁺) in basic water and change shape, reflecting blue-green light instead of red."}
                  </p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </FullWidthSection>

      {/* SECTION 7 — TRACK YOUR PROGRESS (FULL-WIDTH WARM WHITE #F8F7F4) */}
      <FullWidthSection tone="warm" size="spacious">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          <ScrollReveal variant="fade-up" className="lg:col-span-5 space-y-4">
            <h2 className="heading-section text-[#142D40]">
              {locale === "ky"
                ? "Өз темпиңизде үйрөнүңүз"
                : locale === "ru"
                ? "Учитесь в своём темпе"
                : "Build Lasting Intuition"}
            </h2>
            <p className="body-lead text-[#536574] max-w-md">
              {locale === "ky"
                ? "Токтогон жериңизден улантып, ар бир тажрыйба сайын билимиңизди бекемдеңиз."
                : locale === "ru"
                ? "Продолжайте с того места, где остановились, шаг за шагом."
                : "Pick up right where you left off and see your chemistry journey grow."}
            </p>
            <div className="pt-2">
              <Link
                href={`/${locale}/students`}
                className="inline-flex items-center gap-2 rounded-full bg-[#087F8C] hover:bg-[#142D40] text-white px-6 py-3.5 text-sm font-bold transition-colors"
              >
                {locale === "ky"
                  ? "Окуучулар үчүн"
                  : locale === "ru"
                  ? "Для учеников"
                  : "For Students"}
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </ScrollReveal>

          <ScrollReveal
            variant="scale-in"
            delayMs={120}
            className="lg:col-span-7"
          >
            <div className="rounded-3xl bg-white border border-[#142D40]/10 p-6 sm:p-9 space-y-6 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-sm font-medium text-[#536574]">
                    {locale === "ky"
                      ? "Химиялык сапар"
                      : locale === "ru"
                      ? "Путь в химии"
                      : "Your Chemistry Journey"}
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold text-[#142D40] mt-0.5">
                    {locale === "ky"
                      ? "Acids & Bases · 3 тажрыйба"
                      : locale === "ru"
                      ? "Кислоты и основания · 3 опыта"
                      : "Acids & Bases · 3 Experiments"}
                  </div>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white border border-[#142D40]/10 px-3.5 py-1.5 text-xs font-bold text-[#142D40]">
                  <CheckCircle2 className="size-4 text-[#087F8C]" />
                  2 / 3
                </span>
              </div>

              <AnimatedProgressBar
                percent={67}
                heightClass="h-3.5"
                trackClass="bg-[#F8F7F4] border border-[#142D40]/10"
                fillClass="bg-[#087F8C]"
              />

              <div className="rounded-2xl bg-[#F8F7F4] border border-[#142D40]/10 p-4 sm:p-5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-14 rounded-xl overflow-hidden bg-white shrink-0">
                    <ChemIllustration
                      variant="indicator-flask"
                      slug="acid-base-titration-phenolphthalein"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-[#536574]">
                      {locale === "ky"
                        ? "Кийинки тажрыйба"
                        : locale === "ru"
                        ? "Следующий опыт"
                        : "Up Next"}
                    </div>
                    <div className="text-base font-bold text-[#142D40]">
                      {locale === "ky"
                        ? "Кислота-негиз титрлөө"
                        : locale === "ru"
                        ? "Кислотно-основное титрование"
                        : "Acid–Base Titration"}
                    </div>
                  </div>
                </div>
                <Link
                  href={`/${locale}/experiments/acid-base-titration-phenolphthalein`}
                  className="rounded-full bg-[#142D40] hover:bg-[#087F8C] text-white px-5 py-2.5 text-xs font-bold transition-colors shrink-0"
                >
                  {locale === "ky" ? "Баштоо" : locale === "ru" ? "Начать" : "Start"}
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </FullWidthSection>

      {/* SECTION 8 — TEACHING WITH CHEMLAB KG (FULL-WIDTH PURE WHITE #FFFFFF) */}
      <FullWidthSection tone="white" size="spacious">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          <ScrollReveal variant="fade-up" className="lg:col-span-6 space-y-5">
            <h2 className="heading-section text-[#142D40]">
              {locale === "ky"
                ? "Сабакта чыныгы химияны көрсөтүңүз"
                : locale === "ru"
                ? "Наглядная химия для каждого класса"
                : "Teaching with ChemLab KG"}
            </h2>
            <p className="body-lead text-[#536574] max-w-lg">
              {locale === "ky"
                ? "Видеолорду класста көрсөтүп, окуучуларга тапшырма бериңиз."
                : locale === "ru"
                ? "Демонстрируйте опыты на уроке и отслеживайте понимание учеников."
                : "Bring safe laboratory demonstrations and interactive questions into any school."}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="rounded-2xl bg-[#F8F7F4] border border-[#142D40]/10 p-4 space-y-1.5">
                <Users className="size-5 text-[#087F8C]" />
                <div className="font-bold text-sm text-[#142D40]">
                  {locale === "ky"
                    ? "Класс түзүү"
                    : locale === "ru"
                    ? "Создавайте классы"
                    : "Create classrooms"}
                </div>
              </div>
              <div className="rounded-2xl bg-[#F8F7F4] border border-[#142D40]/10 p-4 space-y-1.5">
                <Play className="size-5 text-[#087F8C]" />
                <div className="font-bold text-sm text-[#142D40]">
                  {locale === "ky"
                    ? "Тажрыйба дайындоо"
                    : locale === "ru"
                    ? "Назначайте опыты"
                    : "Assign experiments"}
                </div>
              </div>
              <div className="rounded-2xl bg-[#F8F7F4] border border-[#142D40]/10 p-4 space-y-1.5">
                <ClipboardCheck className="size-5 text-[#087F8C]" />
                <div className="font-bold text-sm text-[#142D40]">
                  {locale === "ky"
                    ? "Түшүнүүнү текшерүү"
                    : locale === "ru"
                    ? "Проверяйте знания"
                    : "Check understanding"}
                </div>
              </div>
            </div>

            <div className="pt-2">
              <HomePageTeacherCta
                locale={locale}
                defaultLabel={
                  locale === "ky"
                    ? "Мугалимдер бөлүмү"
                    : locale === "ru"
                    ? "Возможности для учителей"
                    : "Explore Teacher Features"
                }
              />
            </div>
          </ScrollReveal>

          <ScrollReveal
            variant="scale-in"
            delayMs={120}
            className="lg:col-span-6"
          >
            <div className="rounded-3xl overflow-hidden bg-[#F8F7F4] border border-[#142D40]/10 shadow-sm p-6 sm:p-8 space-y-5">
              <div className="rounded-2xl overflow-hidden h-56 bg-white">
                <ChemIllustration
                  variant="flame-spectrum"
                  slug="flame-tests-metal-cations"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-medium text-[#536574]">
                    {locale === "ky"
                      ? "Химия сабагы · Нарын"
                      : locale === "ru"
                      ? "Урок химии · Нарын"
                      : "Chemistry Class · Naryn"}
                  </div>
                  <div className="text-lg font-bold text-[#142D40]">
                    {locale === "ky"
                      ? "Жалындын түсү боюнча металлдарды аныктоо"
                      : locale === "ru"
                      ? "Окрашивание пламени ионами металлов"
                      : "Flame Tests of Metal Ions"}
                  </div>
                </div>
                <span className="font-mono text-xs font-bold rounded-xl bg-white border border-[#142D40]/15 px-3 py-1.5 text-[#142D40]">
                  NARYN7
                </span>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </FullWidthSection>
    </div>
  );
}
