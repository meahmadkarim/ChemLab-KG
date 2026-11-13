import React from "react";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import type { Experiment } from "@/features/experiments/types";
import { getTopicById } from "@/features/experiments/data";
import type { Locale } from "@/i18n/config";
import { formatDuration } from "@/i18n/format";
import { ChemIllustration } from "@/components/illustrations/ChemIllustration";

export function ExperimentCard({
  experiment,
  locale,
  href,
  recommendationReason,
  isCompleted = false,
}: {
  experiment: Experiment;
  locale: Locale;
  href?: string;
  safetyLabels?: {
    observe: string;
    teacher_demo: string;
    student_lab: string;
  };
  watchLabel?: string;
  questionsCountLabel?: string;
  recommendationReason?: string;
  isCompleted?: boolean;
}) {
  const topic = getTopicById(experiment.topicId);

  return (
    <Link
      href={href ?? `/${locale}/experiments/${experiment.slug}`}
      className="group flex flex-col overflow-hidden rounded-3xl bg-white border border-[#142D40]/10 transition-all duration-200 hover:-translate-y-1 hover:border-[#087F8C]/40 hover:shadow-md focus-visible:ring-2 focus-visible:ring-[#087F8C]"
    >
      {/* Large Visual Thumbnail */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#F8F7F4]">
        <ChemIllustration
          variant={experiment.illustration}
          slug={experiment.slug}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />

        {/* Subtle Video Duration in Bottom-Right */}
        <span className="absolute bottom-3 right-3 inline-flex items-center rounded-full bg-[#142D40]/85 px-2.5 py-1 text-xs font-medium text-white">
          {formatDuration(experiment.durationSeconds)}
        </span>
      </div>

      {/* Minimal Card Body: Short Title + Muted Topic */}
      <div className="flex flex-1 flex-col justify-between p-5">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-medium text-[#536574]">
              {topic.title[locale]}
            </span>
            {isCompleted && (
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#15803D]">
                <CheckCircle2 className="size-3.5" />
                {locale === "ky" ? "Аткарылды" : locale === "ru" ? "Пройдено" : "Done"}
              </span>
            )}
          </div>

          <h3 className="text-lg font-bold text-[#142D40] leading-snug">
            {experiment.title[locale]}
          </h3>

          {recommendationReason && (
            <p className="pt-1 text-xs text-[#536574] line-clamp-1">
              {recommendationReason}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
