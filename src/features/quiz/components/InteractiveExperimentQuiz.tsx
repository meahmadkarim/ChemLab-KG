"use client";

import React, { useState } from "react";
import {
  CheckCircle2,
  XCircle,
  Sparkles,
  Lightbulb,
  ArrowRight,
  RotateCcw,
  Award,
  BookOpen,
} from "lucide-react";
import type { Experiment } from "@/features/experiments/types";
import { getTopicById } from "@/features/experiments/data";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import type {
  QuizQuestionResponseRecord,
  TeacherQuizPermissions,
} from "@/features/progress/learning-store";
import { useLearningStore } from "@/features/progress/learning-store";
import { useRecommendations } from "@/features/recommendations/use-recommendations";
import { ExperimentCard } from "@/components/experiments/ExperimentCard";

const AI_QUIZ_LABELS: Record<
  Locale,
  {
    getHint: string;
    explainMistake: string;
    explainMore: string;
    loadingAi: string;
    conceptsUnderstood: string;
    topicsToReview: string;
    exploreNextTitle: string;
  }
> = {
  en: {
    getHint: "Need a hint?",
    explainMistake: "Explain with ChemLab AI",
    explainMore: "Tell me more",
    loadingAi: "Thinking...",
    conceptsUnderstood: "What You Mastered",
    topicsToReview: "Helpful Review Tips",
    exploreNextTitle: "Explore Next",
  },
  ky: {
    getHint: "Кеңеш керекпи?",
    explainMistake: "ChemLab AI менен түшүндүрүү",
    explainMore: "Кененирээк билүү",
    loadingAi: "Даярдалууда...",
    conceptsUnderstood: "Эмнени үйрөндүңүз",
    topicsToReview: "Кайталоо үчүн кеңештер",
    exploreNextTitle: "Кийинки тажрыйбалар",
  },
  ru: {
    getHint: "Нужна подсказка?",
    explainMistake: "Объяснить с ChemLab AI",
    explainMore: "Подробнее",
    loadingAi: "Загружаем...",
    conceptsUnderstood: "Что вы освоили",
    topicsToReview: "Полезно повторить",
    exploreNextTitle: "Смотрите далее",
  },
};

export function InteractiveExperimentQuiz({
  experiment,
  locale,
  quizCopy,
  assignmentId,
  permissions = {
    allowHints: true,
    allowAiExplanations: true,
    showImmediateFeedback: true,
    showCorrectAnswers: true,
    allowRetries: true,
  },
}: {
  experiment: Experiment;
  locale: Locale;
  quizCopy: Dictionary["experimentDetail"]["quiz"];
  libraryCopy?: Dictionary["library"];
  featuredCopy?: Dictionary["featured"];
  permissions?: TeacherQuizPermissions;
  assignmentId?: string;
}) {
  const aiLabels = AI_QUIZ_LABELS[locale];
  const { state, recordQuizAttempt } = useLearningStore();
  const recommendations = useRecommendations(experiment.slug);
  const questions = experiment.quiz;
  const topic = getTopicById(experiment.topicId);

  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [responses, setResponses] = useState<QuizQuestionResponseRecord[]>([]);
  const [completed, setCompleted] = useState(false);

  const [hintText, setHintText] = useState<string | null>(null);
  const [aiExplanation, setAiExplanation] = useState<{
    text: string;
    misconception: string | null;
    detailedLoaded: boolean;
  } | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState<{ explanation: Record<Locale,string>; correctOptionId?: string } | null>(null);

  const currentQuestion = questions[currentIdx] ?? questions[0];
  const selectedOption = currentQuestion.options.find(
    (o) => o.id === selectedOptionId
  );

  async function requestAiHelp(mode: "hint" | "mistake" | "more") {
    if (loadingAi) return;
    setLoadingAi(true);
    try {
      const res = await fetch("/api/ai/quiz-explanation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          experimentSlug: experiment.slug,
          questionId: currentQuestion.id,
          selectedOptionId: selectedOptionId ?? undefined,
          mode,
          locale,
          assignmentId,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Unable to load explanation.");
      if (data.explanation) {
        if (mode === "hint") {
          setHintText(data.explanation);
        } else {
          setAiExplanation({
            text: data.explanation,
            misconception: data.misconceptionAddressed ?? null,
            detailedLoaded: mode === "more",
          });
        }
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Unable to load explanation.");
    } finally {
      setLoadingAi(false);
    }
  }

  async function handleCheckAnswer() {
    if (!selectedOption || submitted || busy) return;
    setBusy(true); setError("");
    try {
      const response = await fetch("/api/quiz/check", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ experimentSlug: experiment.slug, questionId: currentQuestion.id, selectedOptionId: selectedOption.id, assignmentId }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Unable to check answer.");
      setFeedback(result);
      setResponses(previous => [...previous.filter(r => r.questionId !== currentQuestion.id), result.response]);
      setSubmitted(true);
    } catch (error) { setError(error instanceof Error ? error.message : "Unable to check answer."); }
    finally { setBusy(false); }
  }
  async function handleNext() {
    if (busy) return;
    if (currentIdx + 1 < questions.length) {
      setHintText(null); setAiExplanation(null); setSelectedOptionId(null); setSubmitted(false); setFeedback(null);
      setCurrentIdx(previous => previous + 1);
    } else {
      setBusy(true); setError("");
      try {
        const saved = await recordQuizAttempt({ experimentSlug: experiment.slug, topicId: experiment.topicId, score: responses.filter(r => r.isCorrect).length, total: questions.length, responses, assignmentId });
        if (saved) setResponses(saved);
        setCompleted(true);
      } catch (error) { setError(error instanceof Error ? error.message : "Unable to save result. Try again."); }
      finally { setBusy(false); }
    }
  }

  function handleResetQuiz() {
    setFeedback(null); setError("");
    setCurrentIdx(0);
    setSelectedOptionId(null);
    setSubmitted(false);
    setResponses([]);
    setCompleted(false);
    setHintText(null);
    setAiExplanation(null);
  }

  const selectedCorrect = responses.find(response => response.questionId === currentQuestion.id)?.isCorrect;
  if (completed) {
    const score = responses.filter((r) => r.isCorrect).length;
    const wrongResponses = responses.filter((r) => !r.isCorrect);


    return (
      <div className="space-y-8 max-w-4xl mx-auto">
        {/* Results Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#142D40]/10 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#142D40]/10">
            <div className="flex items-center gap-4">
              <div className="inline-flex w-14 h-14 items-center justify-center rounded-2xl bg-[#DCE9DF] text-[#142D40]">
                <Award className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-2xl sm:text-3xl font-bold text-[#142D40]">
                  {quizCopy.scoreTitle}
                </h3>
                <p className="text-sm text-[#536574]">
                  {quizCopy.scoreSubtitle
                    .replace("{score}", String(score))
                    .replace("{total}", String(questions.length))}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-[#F8F7F4] px-5 py-3 border border-[#142D40]/10 text-center">
                <div className="text-2xl font-bold text-[#142D40]">
                  {score} / {questions.length}
                </div>
              </div>

              {permissions.allowRetries && (
                <button
                  type="button"
                  onClick={handleResetQuiz}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[#142D40] hover:bg-[#087F8C] text-white text-sm font-bold transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  {quizCopy.retryQuiz}
                </button>
              )}
            </div>
          </div>

          {/* Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-2xl bg-[#DCE9DF]/65 border border-[#142D40]/10 p-5 space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#142D40]">
                <CheckCircle2 className="w-4 h-4 text-[#15803D]" />
                {aiLabels.conceptsUnderstood}
              </div>
              <p className="text-base font-bold text-[#142D40]">
                {topic.title[locale]}
              </p>
              <p className="text-xs text-[#536574] leading-relaxed">
                {experiment.objectives[locale][0]}
              </p>
            </div>

            <div className="rounded-2xl bg-[#F7DED0]/65 border border-[#142D40]/10 p-5 space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#142D40]">
                <BookOpen className="w-4 h-4 text-[#142D40]" />
                {aiLabels.topicsToReview}
              </div>
              {wrongResponses.length > 0 ? (
                <ul className="space-y-1.5 text-xs text-[#142D40]">
                  {wrongResponses.map((wr) => {
                    const q = questions.find((item) => item.id === wr.questionId);
                    const opt = q?.options.find(
                      (o) => o.id === wr.selectedOptionId
                    );
                    return (
                      <li key={wr.questionId} className="font-medium">
                        • {opt?.misconceptionLabel?.[locale] ?? topic.title[locale]}
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="text-xs font-medium text-[#142D40]">
                  {locale === "ky"
                    ? "Бардык суроолорго туура жооп бердиңиз!"
                    : locale === "ru"
                    ? "Вы ответили правильно на все вопросы!"
                    : "You answered every question accurately!"}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Explore Next */}
        <div className="space-y-4">
          <h4 className="text-xl font-bold text-[#142D40]">
            {aiLabels.exploreNextTitle}
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recommendations.map((rec) => (
              <ExperimentCard
                key={rec.experiment.id}
                experiment={rec.experiment}
                locale={locale}
                isCompleted={state.completedSlugs.includes(rec.experiment.slug)}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-3xl p-6 sm:p-10 border border-[#142D40]/10 space-y-6">
      {/* Header & Progress Bar */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs font-semibold text-[#536574]">
            {quizCopy.eyebrow}
          </span>
          <span className="text-xs font-semibold text-[#536574]">
            {quizCopy.questionProgress
              .replace("{current}", String(currentIdx + 1))
              .replace("{total}", String(questions.length))}
          </span>
        </div>

        <div className="h-2 w-full rounded-full bg-[#F8F7F4] border border-[#142D40]/10 overflow-hidden">
          <div
            className="h-full bg-[#087F8C] transition-all duration-300 rounded-full"
            style={{
              width: `${
                ((currentIdx + (submitted ? 1 : 0.35)) / questions.length) * 100
              }%`,
            }}
          />
        </div>
      </div>

      {/* Question Prompt */}
      <div className="space-y-5">
        <h3 className="text-xl sm:text-2xl font-bold text-[#142D40] leading-snug">
          {currentQuestion.prompt[locale]}
        </h3>

        {/* Optional Hint Trigger */}
        {!submitted && permissions.allowHints && (
          <div>
            {hintText ? (
              <div className="rounded-2xl bg-[#F7DED0]/65 border border-[#142D40]/10 p-4 text-sm text-[#142D40] flex items-start gap-3">
                <Lightbulb className="w-4 h-4 shrink-0 mt-0.5 text-[#142D40]" />
                <span>{hintText}</span>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => requestAiHelp("hint")}
                disabled={loadingAi}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#087F8C] hover:underline cursor-pointer"
              >
                <Lightbulb className="w-4 h-4" />
                {aiLabels.getHint}
              </button>
            )}
          </div>
        )}

        {/* Answer Options */}
        <div
          className="space-y-3"
          role="radiogroup"
          aria-label={currentQuestion.prompt[locale]}
        >
          {currentQuestion.options.map((opt) => {
            const isSelected = selectedOptionId === opt.id;
            const showCorrect =
              submitted &&
              ((isSelected && selectedCorrect === true) ||
                (permissions.showCorrectAnswers && feedback?.correctOptionId === opt.id));
            const showWrong = submitted && isSelected && selectedCorrect === false;

            return (
              <button
                key={opt.id}
                type="button"
                role="radio"
                aria-checked={isSelected}
                disabled={submitted || busy}
                onClick={() => setSelectedOptionId(opt.id)}
                className={`w-full text-left rounded-2xl p-4 sm:p-5 border transition-all duration-150 flex items-start gap-4 cursor-pointer ${
                  showCorrect
                    ? "border-[#15803D] bg-[#DCE9DF]/65 text-[#142D40]"
                    : showWrong
                    ? "border-[#B91C1C] bg-[#F7DED0]/65 text-[#142D40]"
                    : isSelected
                    ? "border-[#087F8C] bg-[#DCECF6]/45 text-[#142D40]"
                    : "border-[#142D40]/12 bg-white hover:border-[#087F8C] text-[#142D40]"
                }`}
              >
                <span
                  className={`mt-0.5 inline-flex w-7 h-7 shrink-0 items-center justify-center rounded-full text-xs font-bold uppercase ${
                    showCorrect
                      ? "bg-[#15803D] text-white"
                      : showWrong
                      ? "bg-[#B91C1C] text-white"
                      : isSelected
                      ? "bg-[#087F8C] text-white"
                      : "bg-[#F8F7F4] text-[#142D40] border border-[#142D40]/15"
                  }`}
                >
                  {opt.id}
                </span>
                <span className="text-base font-medium leading-snug flex-1 text-[#142D40]">
                  {opt.text[locale]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Immediate Feedback + Optional AI Explanation */}
      {submitted && selectedOption && permissions.showImmediateFeedback && (
        <div
          className={`rounded-2xl p-5 border space-y-3 ${
            selectedCorrect
              ? "bg-[#DCE9DF]/55 border-[#15803D]/30 text-[#142D40]"
              : "bg-[#F7DED0]/60 border-[#B45309]/30 text-[#142D40]"
          }`}
          role="status"
        >
          <div className="flex items-center gap-2 text-base font-bold text-[#142D40]">
            {selectedCorrect ? (
              <>
                <CheckCircle2 className="w-5 h-5 text-[#15803D]" />
                <span>{quizCopy.correctTitle}</span>
              </>
            ) : (
              <>
                <XCircle className="w-5 h-5 text-[#B91C1C]" />
                <span>{quizCopy.incorrectTitle}</span>
              </>
            )}
          </div>

          <p className="text-sm text-[#536574] leading-relaxed">
            {feedback?.explanation[locale]}
          </p>

          {!selectedCorrect && permissions.allowAiExplanations && (
            <div className="pt-2 border-t border-[#142D40]/10 space-y-2.5">
              {!aiExplanation ? (
                <button
                  type="button"
                  onClick={() => requestAiHelp("mistake")}
                  disabled={loadingAi}
                  className="inline-flex items-center gap-1.5 rounded-full bg-white border border-[#142D40]/15 px-4 py-2 text-xs font-bold text-[#142D40] hover:border-[#087F8C] transition-colors cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#087F8C]" />
                  {loadingAi ? aiLabels.loadingAi : aiLabels.explainMistake}
                </button>
              ) : (
                <div className="rounded-2xl bg-white border border-[#142D40]/10 p-4 space-y-2 text-xs">
                  <div className="font-bold text-[#142D40] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#087F8C]" />
                    ChemLab AI
                  </div>
                  <p className="text-[#536574] leading-relaxed text-sm">
                    {aiExplanation.text}
                  </p>
                  {!aiExplanation.detailedLoaded && (
                    <button
                      type="button"
                      onClick={() => requestAiHelp("more")}
                      disabled={loadingAi}
                      className="text-[#087F8C] font-bold hover:underline cursor-pointer"
                    >
                      {loadingAi ? aiLabels.loadingAi : `${aiLabels.explainMore} →`}
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">{error}</p>}
      {/* Action Footer */}
      <div className="flex items-center justify-end gap-3 pt-2">
        {!submitted ? (
          <button
            type="button"
            disabled={!selectedOptionId || busy}
            onClick={handleCheckAnswer}
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#087F8C] hover:bg-[#066670] text-white text-sm font-bold disabled:opacity-50 transition-colors cursor-pointer"
          >
            {quizCopy.checkAnswer}
          </button>
        ) : (
          <button
            type="button"
            disabled={busy}
            onClick={handleNext}
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#142D40] hover:bg-[#087F8C] text-white text-sm font-bold transition-colors cursor-pointer"
          >
            {currentIdx + 1 < questions.length
              ? quizCopy.nextQuestion
              : quizCopy.seeResults}
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
