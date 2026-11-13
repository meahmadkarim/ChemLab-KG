import React from "react";
import type { Experiment } from "../types";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { ExperimentCard as RedesignedExperimentCard } from "@/components/experiments/ExperimentCard";

export function ExperimentCard({
  experiment,
  locale,
  featuredCopy,
  safetyLabels,
  recommendationReason,
  isCompleted = false,
}: {
  experiment: Experiment;
  locale: Locale;
  featuredCopy: Dictionary["featured"];
  safetyLabels: Dictionary["library"]["safetyLevels"];
  recommendationReason?: string;
  isCompleted?: boolean;
}) {
  return (
    <RedesignedExperimentCard
      experiment={experiment}
      locale={locale}
      safetyLabels={safetyLabels}
      watchLabel={featuredCopy.watchBtn}
      questionsCountLabel={featuredCopy.questionsCount.replace(
        "{n}",
        String(experiment.quiz.length)
      )}
      recommendationReason={recommendationReason}
      isCompleted={isCompleted}
    />
  );
}
