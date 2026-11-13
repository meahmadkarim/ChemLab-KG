import { test } from "node:test";
import assert from "node:assert/strict";
import { getPersonalizedRecommendations, computeTopicMastery } from "../src/features/recommendations/recommendation-service";
import { COLD_START_LEARNER_STATE, type QuizAttemptRecord } from "../src/features/progress/learning-state";
import { EXPERIMENTS } from "../src/features/experiments/data";

test("cold start is explicitly curated and spans distinct topics", () => {
  const result = getPersonalizedRecommendations({ state: COLD_START_LEARNER_STATE, limit: 4 });
  assert.equal(result.isColdStart, true);
  assert.equal(result.recommendations.length, 4);
  assert.equal(new Set(result.recommendations.map(r => r.experiment.topicId)).size, 4);
  assert.ok(result.recommendations.every(r => r.reasonType === "cold_start_starter"));
});

test("repeated questions do not inflate mastery and latest answer replaces older evidence", () => {
  const attempt: QuizAttemptRecord = { id: "old", experimentSlug: EXPERIMENTS[0].slug, topicId: "acids-bases", score: 0, total: 1, completedAt: "2026-01-01", responses: [{ questionId: "q1", selectedOptionId: "a", isCorrect: false }] };
  const latest = { ...attempt, id: "new", completedAt: "2026-02-01", responses: [{ ...attempt.responses[0], isCorrect: true }] };
  const result = computeTopicMastery({ quizAttempts: [attempt, latest] })["acids-bases"];
  assert.equal(result.questionCount, 1);
  assert.equal(result.correctCount, 1);
  assert.equal(result.evidenceStatus, "preliminary");
});

test("public catalog carries no quiz answers or explanations", () => {
  assert.equal(EXPERIMENTS.length, 24);
  assert.equal(new Set(EXPERIMENTS.map(e => e.slug)).size, 24);
  for (const experiment of EXPERIMENTS) for (const question of experiment.quiz) for (const option of question.options) {
    assert.equal("isCorrect" in option, false);
    assert.equal("explanation" in option, false);
  }
});
