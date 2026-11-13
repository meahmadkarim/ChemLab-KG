/* eslint-disable @next/next/no-img-element */
import React from "react";
import Link from "next/link";
import {
  CheckCircle2,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Globe,
} from "lucide-react";
import { getDictionary, resolveLocale } from "@/i18n/dictionaries";
import { FullWidthSection } from "@/components/layout/FullWidthSection";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = resolveLocale(rawLocale);
  const dict = await getDictionary(locale);

  return (
    <div className="w-full">
      {/* FULL-WIDTH IMMERSIVE ABOUT HERO */}
      <section className="relative min-h-[380px] sm:min-h-[440px] w-full flex items-center overflow-hidden bg-[#142D40]">
        <img
          src="https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=2000&q=85"
          alt="Laboratory glassware and chemical solutions"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(95deg, rgba(20, 45, 64, 0.93) 0%, rgba(20, 45, 64, 0.78) 55%, rgba(20, 45, 64, 0.35) 100%)",
          }}
        />
        <div className="container-page relative z-10 py-16 sm:py-22">
          <ScrollReveal variant="fade-up" className="max-w-2xl space-y-4">
            <span className="inline-block rounded-full bg-white/15 border border-white/25 px-3.5 py-1 text-xs font-semibold text-white">
              {dict.nav.about} · ChemLab KG
            </span>
            <h1 className="heading-hero text-white">{dict.hero.tagline}</h1>
            <p className="body-lead text-white/90 max-w-xl">
              {dict.hero.subtitle}
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* FULL-WIDTH MISSION SECTION (PURE WHITE #FFFFFF) */}
      <FullWidthSection tone="white" size="spacious">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <ScrollReveal variant="fade-up" className="lg:col-span-6 space-y-4">
            <div className="inline-flex w-12 h-12 items-center justify-center rounded-2xl bg-white text-[#142D40] shadow-2xs">
              <Sparkles className="w-5 h-5 text-[#087F8C]" />
            </div>
            <h2 className="heading-section text-[#142D40]">
              {locale === "ky"
                ? "Биздин билим берүү миссиябыз"
                : locale === "ru"
                ? "Наша образовательная миссия"
                : "Our Educational Mission"}
            </h2>
            <p className="body-lead text-[#536574]">
              {locale === "ky"
                ? "ChemLab KG Кыргызстандагы окуучулар жана мугалимдер үчүн 24 чыныгы лабораториялык видео тажрыйбаны, интерактивдүү тесттерди жана коопсуздук эрежелерин жеткиликтүү кылат."
                : locale === "ru"
                ? "ChemLab KG делает практическую химию наглядной и доступной благодаря 24 реальным видеоопытам, понятным объяснениям и интерактивным заданиям."
                : "ChemLab KG makes practical chemistry easier to see, understand, and teach through 24 real laboratory experiment videos, clear explanations, and interactive quizzes."}
            </p>
          </ScrollReveal>

          <ScrollReveal
            variant="scale-in"
            delayMs={120}
            className="lg:col-span-6"
          >
            <div className="rounded-3xl bg-white border border-[#142D40]/10 p-7 sm:p-9 space-y-4">
              <ul className="space-y-4 text-base font-medium text-[#142D40]">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#087F8C] shrink-0 mt-0.5" />
                  <span>
                    Organized by 8 chemistry topics so anyone can explore freely
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#087F8C] shrink-0 mt-0.5" />
                  <span>
                    Open public access — watch videos and practice quizzes
                    without an account
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Globe className="w-5 h-5 text-[#087F8C] shrink-0 mt-0.5" />
                  <span>Available in Kyrgyz, Russian, and English</span>
                </li>
                <li className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-[#087F8C] shrink-0 mt-0.5" />
                  <span>
                    Interactive quizzes, ChemLab AI Tutor, and classroom tools
                    for teachers
                  </span>
                </li>
              </ul>
            </div>
          </ScrollReveal>
        </div>
      </FullWidthSection>

      {/* FULL-WIDTH DISCLAIMER & CTA SECTION (WARM WHITE #F8F7F4) */}
      <FullWidthSection tone="warm" size="default">
        <ScrollReveal
          variant="fade-up"
          className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8"
        >
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 text-sm font-bold text-[#142D40]">
              <ShieldCheck className="w-5 h-5 text-[#087F8C]" />
              {dict.footer.disclaimerTitle}
            </div>
            <p className="text-base text-[#536574] leading-relaxed">
              {dict.footer.disclaimerText}
            </p>
          </div>
          <Link
            href={`/${locale}/experiments`}
            className="inline-flex items-center gap-2 px-7 py-4 rounded-full bg-[#087F8C] hover:bg-[#066670] text-white font-bold text-base transition-colors shrink-0"
          >
            {dict.nav.exploreCta}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </ScrollReveal>
      </FullWidthSection>
    </div>
  );
}
