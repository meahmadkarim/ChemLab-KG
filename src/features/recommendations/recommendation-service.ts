import {
  EXPERIMENTS,
  TOPICS,
  getTopicById,
} from "@/features/experiments/data";
import type { Experiment, TopicId } from "@/features/experiments/types";
import type { StudentLearningState } from "@/features/progress/learning-state";
import type { Locale } from "@/i18n/config";

export type EvidenceStatus =
  | "no_data"
  | "preliminary"
  | "needs_practice"
  | "proficient";

export interface TopicMasterySummary {
  topicId: TopicId;
  questionCount: number;
  correctCount: number;
  accuracyPercent: number | null;
  evidenceStatus: EvidenceStatus;
  recentMisconceptionTags: string[];
}

export interface RankedRecommendation {
  experiment: Experiment;
  score: number;
  reasonType:
    | "practice_topic"
    | "address_misconception"
    | "related_experiment"
    | "explicit_interest"
    | "continue_topic"
    | "cold_start_starter";
  reason: Record<Locale, string>;
}

export const RECOMMENDATION_WEIGHTS = {
  needsPracticeTopic: 45,
  recentMisconceptionMatch: 35,
  sameAsCurrentTopic: 32,
  recentlyViewedTopic: 22,
  explicitInterestTopic: 20,
  notYetCompletedBonus: 18,
  alreadyCompletedPenalty: -35,
  featuredCuratedBonus: 12,
  minQuestionsForEstablishedPattern: 3,
} as const;

/**
 * Calculates per-topic mastery while distinguishing preliminary evidence (< 3 questions)
 * from established patterns (>= 3 questions).
 */
export function computeTopicMastery(
  state: Pick<StudentLearningState, "quizAttempts">
): Record<TopicId, TopicMasterySummary> {
  const summaries = {} as Record<TopicId, TopicMasterySummary>;

  for (const topic of TOPICS) {
    summaries[topic.id] = {
      topicId: topic.id,
      questionCount: 0,
      correctCount: 0,
      accuracyPercent: null,
      evidenceStatus: "no_data",
      recentMisconceptionTags: [],
    };
  }

  const seenQuestions = new Set<string>();
  const newestFirst = [...state.quizAttempts].sort((a, b) => b.completedAt.localeCompare(a.completedAt));
  for (const attempt of newestFirst) {
    for (const resp of attempt.responses) {
      const key = `${attempt.experimentSlug}:${resp.questionId}`;
      if (seenQuestions.has(key)) continue;
      seenQuestions.add(key);
      const topicId = resp.conceptTag ?? attempt.topicId;
      const entry = summaries[topicId];
      if (!entry) continue;

      entry.questionCount += 1;
      if (resp.isCorrect) {
        entry.correctCount += 1;
      } else if (
        resp.misconceptionTag &&
        !entry.recentMisconceptionTags.includes(resp.misconceptionTag)
      ) {
        entry.recentMisconceptionTags.push(resp.misconceptionTag);
      }
    }
  }

  for (const topic of TOPICS) {
    const entry = summaries[topic.id];
    if (entry.questionCount === 0) {
      entry.evidenceStatus = "no_data";
      entry.accuracyPercent = null;
    } else {
      const pct = Math.round((entry.correctCount / entry.questionCount) * 100);
      entry.accuracyPercent = pct;
      if (entry.questionCount < RECOMMENDATION_WEIGHTS.minQuestionsForEstablishedPattern) {
        entry.evidenceStatus = "preliminary";
      } else if (pct < 70) {
        entry.evidenceStatus = "needs_practice";
      } else {
        entry.evidenceStatus = "proficient";
      }
    }
  }

  return summaries;
}

/**
 * Deterministic, transparent content-based recommendation engine for ChemLabKG.
 */
export function getPersonalizedRecommendations(options: {
  state: Pick<
    StudentLearningState,
    "viewedSlugs" | "completedSlugs" | "bookmarkedSlugs" | "explicitInterests" | "quizAttempts"
  >;
  currentExperimentSlug?: string;
  limit?: number;
  catalog?: Experiment[];
}): {
  isColdStart: boolean;
  recommendations: RankedRecommendation[];
  topicMastery: Record<TopicId, TopicMasterySummary>;
} {
  const { state, currentExperimentSlug, limit = 3, catalog = EXPERIMENTS } = options;
  const topicMastery = computeTopicMastery(state);

  const hasAnyHistory =
    state.viewedSlugs.length > 0 ||
    state.completedSlugs.length > 0 ||
    state.quizAttempts.length > 0 ||
    state.explicitInterests.length > 0;

  const currentExperiment = currentExperimentSlug
    ? catalog.find((e) => e.slug === currentExperimentSlug)
    : undefined;

  // Cold-start behavior: diverse starter experiments across distinct topics without claiming personalization
  if (!hasAnyHistory && !currentExperiment) {
    const seenTopics = new Set<TopicId>();
    const starters: RankedRecommendation[] = [];

    for (const exp of catalog) {
      if (seenTopics.has(exp.topicId) && starters.length < TOPICS.length) {
        continue;
      }
      seenTopics.add(exp.topicId);
      const topic = getTopicById(exp.topicId);
      starters.push({
        experiment: exp,
        score: exp.featured ? 95 : 80,
        reasonType: "cold_start_starter",
        reason: {
          en: `Curated starter experiment: Explore ${topic.title.en}`,
          ky: `Баштоо үчүн тандалган тажрыйба: «${topic.title.ky}» темасы менен таанышыңыз`,
          ru: `Рекомендуемый стартовый опыт: Познакомьтесь с темой «${topic.title.ru}»`,
        },
      });
      if (starters.length >= limit) break;
    }

    return {
      isColdStart: true,
      recommendations: starters.slice(0, limit),
      topicMastery,
    };
  }

  // Recently viewed topics
  const recentTopics = new Set<TopicId>();
  for (const slug of state.viewedSlugs.slice(0, 4)) {
    const exp = catalog.find((e) => e.slug === slug);
    if (exp) recentTopics.add(exp.topicId);
  }

  const candidates = catalog.filter((e) => e.slug !== currentExperimentSlug);

  const ranked: RankedRecommendation[] = candidates.map((exp) => {
    let score = 0;
    const topic = getTopicById(exp.topicId);
    const mastery = topicMastery[exp.topicId];
    const isCompleted = state.completedSlugs.includes(exp.slug);

    let reasonType: RankedRecommendation["reasonType"] = "cold_start_starter";
    let reason: Record<Locale, string> = {
      en: `Explore a new topic: ${topic.title.en}`,
      ky: `Жаңы теманы изилдеңиз: «${topic.title.ky}»`,
      ru: `Изучите новую тему: «${topic.title.ru}»`,
    };

    // 1. Check if current experiment context is active ("Related Experiments" or "Explore Next")
    if (currentExperiment && exp.topicId === currentExperiment.topicId) {
      score += RECOMMENDATION_WEIGHTS.sameAsCurrentTopic;
      reasonType = "related_experiment";
      reason = {
        en: `Recommended because you just explored ${currentExperiment.title.en}`,
        ky: `«${currentExperiment.title.ky}» тажрыйбасына байланыштуу сунушталат`,
        ru: `Рекомендовано, так как вы изучали опыт «${currentExperiment.title.ru}»`,
      };
    }

    // 2. Check established topic practice need (>= 3 questions and < 70%)
    if (mastery.evidenceStatus === "needs_practice") {
      score += RECOMMENDATION_WEIGHTS.needsPracticeTopic;
      reasonType = "practice_topic";
      reason = {
        en: `Strengthen your understanding of ${topic.title.en} with another visual experiment`,
        ky: `«${topic.title.ky}» темасы боюнча билимди бекемдөө үчүн сунушталат`,
        ru: `Укрепите понимание темы «${topic.title.ru}» на новом наглядном опыте`,
      };
    } else if (mastery.recentMisconceptionTags.length > 0) {
      // 3. Recent misconception in this topic
      score += RECOMMENDATION_WEIGHTS.recentMisconceptionMatch;
      reasonType = "address_misconception";
      reason = {
        en: `Practice key concepts in ${topic.title.en} to build confidence`,
        ky: `«${topic.title.ky}» концепцияларын тереңирээк түшүнүү үчүн тажрыйба`,
        ru: `Потренируйте ключевые понятия темы «${topic.title.ru}» на практике`,
      };
    } else if (state.explicitInterests.includes(exp.topicId)) {
      // 4. Explicit student interest
      score += RECOMMENDATION_WEIGHTS.explicitInterestTopic;
      if (reasonType === "cold_start_starter") {
        reasonType = "explicit_interest";
        reason = {
          en: `Matches your selected interest in ${topic.title.en}`,
          ky: `Сиз тандаган «${topic.title.ky}» багытына дал келет`,
          ru: `Соответствует вашему интересу к теме «${topic.title.ru}»`,
        };
      }
    } else if (recentTopics.has(exp.topicId)) {
      // 5. Recently viewed topic affinity
      score += RECOMMENDATION_WEIGHTS.recentlyViewedTopic;
      if (reasonType === "cold_start_starter") {
        reasonType = "continue_topic";
        reason = {
          en: `Continue exploring ${topic.title.en}`,
          ky: `«${topic.title.ky}» бөлүмүн улантып көрүңүз`,
          ru: `Продолжите знакомство с темой «${topic.title.ru}»`,
        };
      }
    }

    // 6. Completion & novelty adjustment
    if (!isCompleted) {
      score += RECOMMENDATION_WEIGHTS.notYetCompletedBonus;
    } else {
      score += RECOMMENDATION_WEIGHTS.alreadyCompletedPenalty;
    }

    // 7. Curated featured quality
    if (exp.featured) {
      score += RECOMMENDATION_WEIGHTS.featuredCuratedBonus;
    }

    return {
      experiment: exp,
      score,
      reasonType,
      reason,
    };
  });

  ranked.sort((a, b) => b.score - a.score);

  return {
    isColdStart: false,
    recommendations: ranked.slice(0, limit),
    topicMastery,
  };
}
