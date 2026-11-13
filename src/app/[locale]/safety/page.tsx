import React from "react";
import Link from "next/link";
import { Eye, GraduationCap, FlaskConical, ArrowRight } from "lucide-react";
import { getDictionary, resolveLocale } from "@/i18n/dictionaries";
import { FullWidthSection } from "@/components/layout/FullWidthSection";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export default async function SafetyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = resolveLocale(rawLocale);
  const dict = await getDictionary(locale);

  return (
    <div className="w-full">
      {/* FULL-WIDTH SAFETY HERO (SOFT PEACH #F7DED0) */}
      <FullWidthSection tone="peach" size="default">
        <ScrollReveal variant="fade-up" className="max-w-2xl space-y-3">
          <span className="text-xs font-semibold text-[#536574]">
            {dict.nav.safety}
          </span>
          <h1 className="heading-hero text-[#142D40]">
            {dict.safetyBanner.title}
          </h1>
          <p className="body-lead text-[#536574]">
            {dict.safetyBanner.description}
          </p>
        </ScrollReveal>
      </FullWidthSection>

      {/* FULL-WIDTH SAFETY LEVELS SECTION (WARM WHITE #F8F7F4) */}
      <FullWidthSection tone="warm" size="spacious">
        <div className="space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
            <ScrollReveal variant="fade-up" delayMs={0}>
              <div className="bg-white rounded-3xl p-7 border border-[#142D40]/10 space-y-3.5 h-full">
                <div className="inline-flex w-11 h-11 items-center justify-center rounded-2xl bg-[#F7DED0] text-[#142D40]">
                  <Eye className="w-5 h-5" />
                </div>
                <h2 className="heading-sub text-[#142D40]">
                  {dict.library.safetyLevels.observe}
                </h2>
                <p className="text-sm sm:text-base text-[#536574] leading-relaxed">
                  High-reactivity demonstrations (such as alkali metals in
                  water) are provided strictly for video observation. Students
                  must never attempt these outside specialized facilities.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal variant="fade-up" delayMs={90}>
              <div className="bg-white rounded-3xl p-7 border border-[#142D40]/10 space-y-3.5 h-full">
                <div className="inline-flex w-11 h-11 items-center justify-center rounded-2xl bg-[#EAE3F5] text-[#142D40]">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <h2 className="heading-sub text-[#142D40]">
                  {dict.library.safetyLevels.teacher_demo}
                </h2>
                <p className="text-sm sm:text-base text-[#536574] leading-relaxed">
                  Performed only by a trained chemistry teacher at the
                  demonstration bench using protective eyewear, gloves, and
                  proper ventilation.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal variant="fade-up" delayMs={180}>
              <div className="bg-white rounded-3xl p-7 border border-[#142D40]/10 space-y-3.5 h-full">
                <div className="inline-flex w-11 h-11 items-center justify-center rounded-2xl bg-[#DCE9DF] text-[#142D40]">
                  <FlaskConical className="w-5 h-5" />
                </div>
                <h2 className="heading-sub text-[#142D40]">
                  {dict.library.safetyLevels.student_lab}
                </h2>
                <p className="text-sm sm:text-base text-[#536574] leading-relaxed">
                  Suitable for school laboratory work under direct teacher
                  supervision with splash goggles, lab coats, and labeled waste
                  disposal.
                </p>
              </div>
            </ScrollReveal>
          </div>

          <div>
            <Link
              href={`/${locale}/experiments`}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#087F8C] hover:bg-[#066670] text-white font-bold text-sm transition-colors"
            >
              {dict.nav.exploreCta}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </FullWidthSection>
    </div>
  );
}
