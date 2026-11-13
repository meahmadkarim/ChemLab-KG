/* eslint-disable @next/next/no-img-element */
import React from "react";
import Link from "next/link";
import { resolveLocale } from "@/i18n/dictionaries";
import { EXPERIMENTS } from "@/features/experiments/data";
import { ExperimentCard } from "@/components/experiments/ExperimentCard";
import { FullWidthSection } from "@/components/layout/FullWidthSection";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { InteractivePhLab } from "@/components/illustrations/InteractivePhLab";
import { Play, HelpCircle, Sparkles, Users, ArrowRight } from "lucide-react";
import { StudentPageHeroCtas } from "@/components/auth/RoleAwareCtas";

export default async function StudentsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = resolveLocale(rawLocale);
  const starterExperiments = EXPERIMENTS.slice(0, 3);

  const copy = {
    eyebrow:
      locale === "ky"
        ? "Окуучулар үчүн"
        : locale === "ru"
        ? "Для учеников"
        : "For Students",
    title:
      locale === "ky"
        ? "Тажрыйбалар аркылуу химияны ачыңыз."
        : locale === "ru"
        ? "Откройте для себя химию через эксперименты."
        : "Discover Chemistry Through Experiments.",
    subtitle:
      locale === "ky"
        ? "Чыныгы лабораториялык видеолор жана интерактивдүү көнүгүүлөр аркылуу химияны көрүңүз, изилдеңиз жана түшүнүңүз."
        : locale === "ru"
        ? "Наблюдайте, исследуйте и понимайте химию с помощью реальных опытов и интерактивного обучения."
        : "Watch, explore, and understand chemistry through real experiments and interactive learning.",
    startLearningBtn:
      locale === "ky"
        ? "Окуучу аккаунтун түзүү"
        : locale === "ru"
        ? "Создать аккаунт ученика"
        : "Create Student Account",
    exploreBtn:
      locale === "ky"
        ? "Тажрыйбаларды көрүү"
        : locale === "ru"
        ? "Смотреть эксперименты"
        : "Explore Experiments",
    openAccessNote:
      locale === "ky"
        ? "Бардык тажрыйбалар каттоосуз эле ачык. Прогрессти сактоо үчүн аккаунт түзүңүз."
        : locale === "ru"
        ? "Все эксперименты доступны без регистрации. Создайте аккаунт, чтобы сохранять прогресс."
        : "No registration required to browse and watch. Create a free account anytime to save your progress.",
    starterTitle:
      locale === "ky"
        ? "Ушул тажрыйбалардан баштаңыз"
        : locale === "ru"
        ? "Начните с этих экспериментов"
        : "Start with These Experiments",
  };

  const features = [
    {
      icon: Play,
      pastel: "#E6F2F5",
      title:
        locale === "ky"
          ? "Чыныгы видео тажрыйбалар"
          : locale === "ru"
          ? "Реальные видеоопыты"
          : "Real Lab Videos",
      desc:
        locale === "ky"
          ? "24 химиялык реакцияны кадам сайын көрүңүз."
          : locale === "ru"
          ? "24 лабораторных опыта с пошаговым разбором."
          : "24 high-definition experiments filmed step by step.",
    },
    {
      icon: HelpCircle,
      pastel: "#F8F7F4",
      title:
        locale === "ky"
          ? "Интерактивдүү суроолор"
          : locale === "ru"
          ? "Интерактивные вопросы"
          : "Interactive Practice",
      desc:
        locale === "ky"
          ? "Ар бир суроого дароо жооп жана түшүндүрмө алыңыз."
          : locale === "ru"
          ? "Проверяйте понимание сразу после просмотра."
          : "Test your intuition with instant visual feedback.",
    },
    {
      icon: Users,
      pastel: "#F8F7F4",
      title:
        locale === "ky"
          ? "Класска кошулуу"
          : locale === "ru"
          ? "Учебные классы"
          : "Join Classrooms",
      desc:
        locale === "ky"
          ? "Мугалимдин 6 орундуу коду менен тапшырмаларды аткарыңыз."
          : locale === "ru"
          ? "Входите в класс по 6-значному коду учителя."
          : "Enter your teacher's 6-character code for class assignments.",
    },
    {
      icon: Sparkles,
      pastel: "#F8F7F4",
      title:
        locale === "ky"
          ? "ChemLab AI жардамчысы"
          : locale === "ru"
          ? "Помощник ChemLab AI"
          : "Ask ChemLab AI",
      desc:
        locale === "ky"
          ? "Кыргыз, орус же англис тилинде түшүндүрмө алыңыз."
          : locale === "ru"
          ? "Понятные объяснения на кыргызском, русском и английском."
          : "Friendly explanations in Kyrgyz, Russian, and English.",
    },
  ];

  return (
    <div className="w-full">
      {/* 1. FULL-WIDTH IMMERSIVE STUDENT HERO */}
      <section className="relative min-h-[460px] sm:min-h-[540px] w-full flex items-center overflow-hidden bg-[#142D40]">
        <img
          src="/images/student-hero.jpg"
          alt="Students exploring and observing a chemistry experiment in a school laboratory"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(95deg, rgba(20, 45, 64, 0.92) 0%, rgba(20, 45, 64, 0.76) 55%, rgba(20, 45, 64, 0.32) 100%)",
          }}
        />
        <div className="container-page relative z-10 py-20 sm:py-28">
          <ScrollReveal variant="fade-up" className="max-w-2xl space-y-5">
            <span className="inline-block rounded-full bg-white/15 border border-white/25 px-3.5 py-1 text-xs font-semibold text-white">
              {copy.eyebrow}
            </span>
            <h1 className="heading-hero text-white">{copy.title}</h1>
            <p className="body-lead text-white/90 max-w-xl">{copy.subtitle}</p>
            <StudentPageHeroCtas
              locale={locale}
              exploreBtnLabel={copy.exploreBtn}
              startLearningBtnLabel={copy.startLearningBtn}
            />
            <p className="text-xs sm:text-sm text-white/75 pt-1">
              {copy.openAccessNote}
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* 2. HOW STUDENTS LEARN (FULL-WIDTH PURE WHITE #FFFFFF) */}
      <FullWidthSection tone="white" size="spacious">
        <div className="space-y-10">
          <ScrollReveal variant="fade-up" className="max-w-xl space-y-2">
            <h2 className="heading-section text-[#142D40]">
              {locale === "ky"
                ? "Лабораториясыз да чыныгы химия"
                : locale === "ru"
                ? "Наглядная химия без сложной зубрёжки"
                : "Learn by Seeing and Doing"}
            </h2>
            <p className="body-lead text-[#536574]">
              {locale === "ky"
                ? "Формулаларды жаттабастан, кубулуштардын маңызын түшүнүңүз."
                : locale === "ru"
                ? "Понимайте суть реакций, а не просто заучивайте формулы."
                : "Understand how reactions work through visual observation."}
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <ScrollReveal
                  key={idx}
                  variant="fade-up"
                  delayMs={idx * 80}
                >
                  <div className="bg-white rounded-3xl p-6 border border-[#142D40]/10 space-y-3 h-full">
                    <div
                      className="w-11 h-11 rounded-2xl flex items-center justify-center text-[#142D40]"
                      style={{ backgroundColor: feat.pastel }}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="heading-sub text-[#142D40]">{feat.title}</h3>
                    <p className="text-sm text-[#536574] leading-relaxed">
                      {feat.desc}
                    </p>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </FullWidthSection>

      {/* 3. INTERACTIVE LAB PREVIEW (FULL-WIDTH WARM WHITE #F8F7F4) */}
      <FullWidthSection tone="warm" size="spacious">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          <ScrollReveal variant="fade-up" className="lg:col-span-5 space-y-4">
            <h2 className="heading-section text-[#142D40]">
              {locale === "ky"
                ? "Азыр сынап көрүңүз"
                : locale === "ru"
                ? "Попробуйте прямо сейчас"
                : "Try It Right Now"}
            </h2>
            <p className="body-lead text-[#536574]">
              {locale === "ky"
                ? "pH деңгээлин өзгөртүп, индикатордун түсүн байкаңыз."
                : locale === "ru"
                ? "Переключайте pH и наблюдайте за сменой окраски индикатора."
                : "Tap a pH level to see how natural red cabbage pigment changes color."}
            </p>
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

      {/* 4. STARTER EXPERIMENTS (FULL-WIDTH PURE WHITE #FFFFFF) */}
      <FullWidthSection tone="white" size="spacious">
        <div className="space-y-10">
          <ScrollReveal
            variant="fade-up"
            className="flex flex-col sm:flex-row sm:items-end justify-between gap-4"
          >
            <h2 className="heading-section text-[#142D40]">
              {copy.starterTitle}
            </h2>
            <Link
              href={`/${locale}/experiments`}
              className="inline-flex items-center gap-1.5 text-base font-bold text-[#087F8C] hover:underline"
            >
              {copy.exploreBtn}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
            {starterExperiments.map((exp, idx) => (
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
    </div>
  );
}
