/* eslint-disable @next/next/no-img-element */
import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  Play,
  Users,
  ClipboardList,
  CheckCircle2,
} from "lucide-react";
import { resolveLocale } from "@/i18n/dictionaries";
import { getFeaturedExperiments } from "@/features/experiments/server-catalog";
import { ExperimentCard } from "@/components/experiments/ExperimentCard";
import { FullWidthSection } from "@/components/layout/FullWidthSection";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import {
  TeacherPageHeroCtas,
  TeacherPageBottomCtas,
} from "@/components/auth/RoleAwareCtas";

export default async function PublicTeachersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = resolveLocale(rawLocale);
  const sampleExperiments = (await getFeaturedExperiments()).slice(0, 3);

  const copy = {
    eyebrow:
      locale === "ky"
        ? "Мугалимдер үчүн"
        : locale === "ru"
        ? "Для учителей химии"
        : "For Chemistry Teachers",
    title:
      locale === "ky"
        ? "Классыңызда химияны жандандырыңыз"
        : locale === "ru"
        ? "Оживите уроки химии в вашем классе"
        : "Bring Chemistry to Life in Your Classroom",
    subtitle:
      locale === "ky"
        ? "Тажрыйбалар, тесттер жана класс куралдары менен практикалык химияны жеткиликтүү кылыңыз."
        : locale === "ru"
        ? "Сделайте практическую химию доступнее с видеоопытами, тестами и удобными инструментами для класса."
        : "Make practical chemistry more accessible with experiments, quizzes, and classroom tools.",
    createAccountCta:
      locale === "ky"
        ? "Мугалим аккаунтун түзүү"
        : locale === "ru"
        ? "Создать аккаунт учителя"
        : "Create a Teacher Account",
    exploreResourcesCta:
      locale === "ky"
        ? "Окутуу материалдарын көрүү"
        : locale === "ru"
        ? "Смотреть учебные материалы"
        : "Explore Teaching Resources",
  };

  const steps = [
    {
      icon: Play,
      pastel: "#E6F2F5",
      title:
        locale === "ky"
          ? "1. Сабакта тажрыйба көрсөтүңүз"
          : locale === "ru"
          ? "1. Демонстрируйте опыты на уроке"
          : "1. Project Experiments in Class",
      desc:
        locale === "ky"
          ? "24 лабораториялык тажрыйбаны каалаган баскычтан токтотуп, реакциянын жүрүшүн талкуулаңыз."
          : locale === "ru"
          ? "Используйте 24 готовых видеоопыта с тайм-кодами ключевых этапов реакции."
          : "Use 24 curriculum-ready experiments with timestamped reaction stages.",
    },
    {
      icon: Users,
      pastel: "#F8F7F4",
      title:
        locale === "ky"
          ? "2. Класс түзүп, код бөлүшүңүз"
          : locale === "ru"
          ? "2. Создайте класс по коду"
          : "2. Create Classrooms in Seconds",
      desc:
        locale === "ky"
          ? "Окуучулар 6 орундуу код (мисалы, NARYN7) аркылуу класска кошулат."
          : locale === "ru"
          ? "Ученики присоединяются к вашему классу по короткому 6-значному коду."
          : "Students join your classroom effortlessly with a 6-character code.",
    },
    {
      icon: ClipboardList,
      pastel: "#E6F2F5",
      title:
        locale === "ky"
          ? "3. Түшүнүүнү текшериңиз"
          : locale === "ru"
          ? "3. Проверяйте понимание"
          : "3. Check Student Understanding",
      desc:
        locale === "ky"
          ? "Тажрыйбаларды дайындап, окуучулардын тест упайларын бир жерден көрүңүз."
          : locale === "ru"
          ? "Назначайте видеоопыты и просматривайте результаты каждого ученика."
          : "Assign interactive quizzes and review completed scores across your class.",
    },
  ];

  return (
    <div className="w-full">
      {/* 1. FULL-WIDTH IMMERSIVE TEACHER HERO */}
      <section className="relative min-h-[460px] sm:min-h-[540px] w-full flex items-center overflow-hidden bg-[#142D40]">
        <img
          src="/images/teacher-hero.jpg"
          alt="Teacher guiding students in a school science classroom"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(95deg, rgba(20, 45, 64, 0.93) 0%, rgba(20, 45, 64, 0.78) 54%, rgba(20, 45, 64, 0.34) 100%)",
          }}
        />
        <div className="container-page relative z-10 py-20 sm:py-28">
          <ScrollReveal variant="fade-up" className="max-w-2xl space-y-5">
            <span className="inline-block rounded-full bg-white/15 border border-white/25 px-3.5 py-1 text-xs font-semibold text-white">
              {copy.eyebrow}
            </span>
            <h1 className="heading-hero text-white">{copy.title}</h1>
            <p className="body-lead text-white/90 max-w-xl">{copy.subtitle}</p>
            <TeacherPageHeroCtas
              locale={locale}
              createAccountLabel={copy.createAccountCta}
              exploreResourcesLabel={copy.exploreResourcesCta}
            />
          </ScrollReveal>
        </div>
      </section>

      {/* 2. HOW CHEMLAB KG WORKS IN THE CLASSROOM (FULL-WIDTH PURE WHITE #FFFFFF) */}
      <FullWidthSection tone="white" size="spacious">
        <div className="space-y-10">
          <ScrollReveal variant="fade-up" className="max-w-xl space-y-2">
            <h2 className="heading-section text-[#142D40]">
              {locale === "ky"
                ? "Сабак өтүү үчүн жөнөкөй куралдар"
                : locale === "ru"
                ? "Простые инструменты для живых уроков"
                : "Built for Everyday Classroom Teaching"}
            </h2>
            <p className="body-lead text-[#536574]">
              {locale === "ky"
                ? "Ашыкча татаалдыгы жок, мектеп программасына ылайыктуу."
                : locale === "ru"
                ? "Без сложных настроек — открывайте опыт и начинайте урок."
                : "Practical tools designed for teachers across Kyrgyzstan."}
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <ScrollReveal key={i} variant="fade-up" delayMs={i * 90}>
                  <div className="rounded-3xl bg-white border border-[#142D40]/10 p-7 space-y-4 h-full">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center text-[#142D40]"
                      style={{ backgroundColor: step.pastel }}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="heading-sub text-[#142D40]">{step.title}</h3>
                    <p className="text-sm sm:text-base text-[#536574] leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </FullWidthSection>

      {/* 3. SAMPLE CLASSROOM-READY EXPERIMENTS (FULL-WIDTH WARM WHITE #F8F7F4) */}
      <FullWidthSection tone="warm" size="spacious">
        <div className="space-y-10">
          <ScrollReveal
            variant="fade-up"
            className="flex flex-col sm:flex-row sm:items-end justify-between gap-4"
          >
            <div className="space-y-2">
              <h2 className="heading-section text-[#142D40]">
                {locale === "ky"
                  ? "Сабакка даяр тажрыйбалар"
                  : locale === "ru"
                  ? "Готовые опыты для демонстрации"
                  : "Ready to Project in Class"}
              </h2>
              <p className="body-lead text-[#536574]">
                {locale === "ky"
                  ? "Бардык 24 тажрыйбаны каттоосуз эле дароо ачып көрсөтө аласыз."
                  : locale === "ru"
                  ? "Все 24 эксперимента доступны для показа на уроке без регистрации."
                  : "Every experiment is free to project in class—no login required."}
              </p>
            </div>
            <Link
              href={`/${locale}/experiments`}
              className="inline-flex items-center gap-1.5 text-base font-bold text-[#087F8C] hover:underline"
            >
              {locale === "ky"
                ? "Бардык 24 тажрыйба"
                : locale === "ru"
                ? "Все 24 эксперимента"
                : "Browse all 24 experiments"}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
            {sampleExperiments.map((exp, idx) => (
              <ScrollReveal key={exp.id} variant="fade-up" delayMs={idx * 90}>
                <ExperimentCard experiment={exp} locale={locale} />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </FullWidthSection>

      {/* 4. TEACHER WORKSPACE CTA (FULL-WIDTH PURE WHITE #FFFFFF) */}
      <FullWidthSection tone="white" size="default">
        <ScrollReveal
          variant="fade-up"
          className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8"
        >
          <div className="space-y-3 max-w-xl">
            <h2 className="heading-section text-[#142D40]">
              {locale === "ky"
                ? "Жеке класс түзүүгө даярсызбы?"
                : locale === "ru"
                ? "Готовы создать свой учебный класс?"
                : "Ready to set up your classroom?"}
            </h2>
            <div className="flex flex-wrap gap-5 text-sm font-medium text-[#142D40]">
              <span className="inline-flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#087F8C]" />
                6-character student join codes
              </span>
              <span className="inline-flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#087F8C]" />
                Assign experiments & quizzes
              </span>
              <span className="inline-flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#087F8C]" />
                Student score overview
              </span>
            </div>
          </div>

          <TeacherPageBottomCtas
            locale={locale}
            createAccountLabel={copy.createAccountCta}
          />
        </ScrollReveal>
      </FullWidthSection>
    </div>
  );
}
