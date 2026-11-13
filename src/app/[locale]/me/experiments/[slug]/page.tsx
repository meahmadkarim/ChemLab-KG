import React, { Suspense } from "react";
import { notFound } from "next/navigation";

import { getDictionary, resolveLocale } from "@/i18n/dictionaries";
import {
  getAllExperiments,
  getExperimentBySlug,
  getTopicById,
} from "@/features/experiments/server-catalog";
import { ExperimentDetailClient } from "@/features/experiments/components/ExperimentDetailClient";

export async function generateStaticParams() {
  return (await getAllExperiments()).map((exp) => ({ slug: exp.slug }));
}

export default async function StudentExperimentDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: rawLocale, slug } = await params;
  const locale = resolveLocale(rawLocale);
  const experiment = await getExperimentBySlug(slug);

  if (!experiment) {
    notFound();
  }

  const dict = await getDictionary(locale);
  const topic = getTopicById(experiment.topicId);

  return (
    <div className="w-full">
      <Suspense
        fallback={
          <div className="h-64 flex items-center justify-center">
            <div className="size-8 rounded-full border-2 border-[#087F8C] border-t-transparent animate-spin" />
          </div>
        }
      >
        <ExperimentDetailClient
          experiment={experiment}
          topic={topic}
          locale={locale}
          copy={dict.experimentDetail}
          libraryCopy={dict.library}
          featuredCopy={dict.featured}
          safetyLabels={dict.library.safetyLevels}
        />
      </Suspense>
    </div>
  );
}
