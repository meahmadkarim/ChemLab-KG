/* eslint-disable @next/next/no-img-element */
import React, { Suspense } from "react";
import { getDictionary, resolveLocale } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import { getAllExperiments, TOPICS } from "@/features/experiments/server-catalog";
import { ExperimentGalleryClient } from "@/features/experiments/components/ExperimentGalleryClient";
import { FullWidthSection } from "@/components/layout/FullWidthSection";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export default async function ExperimentsLibraryPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ topic?: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = resolveLocale(rawLocale);
  const dict = await getDictionary(locale);
  const experiments = await getAllExperiments();

  const heading =
    locale === "ky"
      ? "Химиялык тажрыйбаларды изилдөө"
      : locale === "ru"
      ? "Исследуйте химические эксперименты"
      : "Explore Chemistry Experiments";

  const subheading =
    locale === "ky"
      ? "Чыныгы реакцияларды көрүп, алардын артындагы илимди ачыңыз."
      : locale === "ru"
      ? "Смотрите реальные реакции и открывайте науку, стоящую за ними."
      : "See real reactions and discover the science behind them.";

  return (
    <div className="w-full">
      {/* FULL-WIDTH IMMERSIVE EXPERIMENTS HERO */}
      <section className="relative min-h-[380px] sm:min-h-[440px] w-full flex items-center overflow-hidden bg-[#142D40]">
        <img
          src="https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?auto=format&fit=crop&w=2000&q=85"
          alt="Colorful chemistry flasks and laboratory reactions"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(95deg, rgba(20, 45, 64, 0.93) 0%, rgba(20, 45, 64, 0.78) 55%, rgba(20, 45, 64, 0.38) 100%)",
          }}
        />
        <div className="container-page relative z-10 py-16 sm:py-22">
          <ScrollReveal variant="fade-up" className="max-w-2xl space-y-4">
            <h1 className="heading-hero text-white">{heading}</h1>
            <p className="body-lead text-white/90 max-w-xl">{subheading}</p>
          </ScrollReveal>
        </div>
      </section>

      {/* FULL-WIDTH EXPERIMENT GALLERY SECTION */}
      <FullWidthSection tone="warm" size="default">
        <Suspense
          fallback={
            <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div
                  key={n}
                  className="rounded-3xl h-72 animate-pulse bg-white border border-[#142D40]/10"
                />
              ))}
            </div>
          }
        >
          <GalleryWithTopicParam
            searchParams={searchParams}
            experiments={experiments}
            locale={locale}
            libraryCopy={dict.library}
            featuredCopy={dict.featured}
          />
        </Suspense>
      </FullWidthSection>
    </div>
  );
}

async function GalleryWithTopicParam({
  searchParams,
  experiments,
  locale,
  libraryCopy,
  featuredCopy,
}: {
  searchParams: Promise<{ topic?: string }>;
  experiments: Awaited<ReturnType<typeof getAllExperiments>>;
  locale: Locale;
  libraryCopy: Awaited<ReturnType<typeof getDictionary>>["library"];
  featuredCopy: Awaited<ReturnType<typeof getDictionary>>["featured"];
}) {
  const { topic } = await searchParams;
  return (
    <ExperimentGalleryClient
      experiments={experiments}
      topics={TOPICS}
      locale={locale}
      libraryCopy={libraryCopy}
      featuredCopy={featuredCopy}
      initialTopic={topic ?? "all"}
    />
  );
}
