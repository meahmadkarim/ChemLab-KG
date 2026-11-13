import React from "react";
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

export default async function ExperimentDetailPage({
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
    <div className="w-full bg-[#F8F7F4] min-h-screen py-6 sm:py-8">
      <div className="container-page">
        <ExperimentDetailClient
          experiment={experiment}
          topic={topic}
          locale={locale}
          copy={dict.experimentDetail}
          libraryCopy={dict.library}
          featuredCopy={dict.featured}
          safetyLabels={dict.library.safetyLevels}
        />
      </div>
    </div>
  );
}
