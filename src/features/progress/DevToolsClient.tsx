"use client";

import React from "react";
import Link from "next/link";
import { SlidersHorizontal, ArrowLeft, Sparkles, RotateCcw } from "lucide-react";
import type { Locale } from "@/i18n/config";
import { useLearningStore } from "./learning-store";
import { getPersonalizedRecommendations } from "@/features/recommendations/recommendation-service";

export function DevToolsClient({ locale }: { locale: Locale }) {
  const { state, switchProfileMode } = useLearningStore();
  const { isColdStart, recommendations, topicMastery } = getPersonalizedRecommendations({
    state,
    limit: 6,
  });

  return (
    <div className="min-h-screen bg-[#F7F9F8] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <div>
          <Link
            href={`/${locale}/me`}
            className="inline-flex items-center gap-1.5 text-sm font-bold text-[#087F8C] hover:text-[#142D40] mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Student Learning
          </Link>
          <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#8B5CF6]">
            <SlidersHorizontal className="w-4 h-4" />
            Developer & Portfolio Inspection Tools
          </div>
          <h1 className="font-display text-3xl font-extrabold text-[#142D40] mt-1">
            ChemLab KG Sandbox Controls
          </h1>
          <p className="text-sm text-[#4A6070] mt-1">
            Isolated developer utility for testing learner states (Active Learner vs. Cold-Start)
            without cluttering the student-facing interface.
          </p>
        </div>

        {/* Profile State Switcher */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E2E8F0] shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-display text-xl font-extrabold text-[#142D40]">
                Simulated Learner State
              </h2>
              <p className="text-sm text-[#4A6070]">
                Current state: <strong>{state.profileMode}</strong> (Cold-start:{" "}
                {isColdStart ? "Yes" : "No"})
              </p>
            </div>

            <div className="inline-flex rounded-2xl bg-[#F7F9F8] p-1.5 border border-[#E2E8F0]">
              <button
                type="button"
                onClick={() => switchProfileMode("active_learner")}
                className={`rounded-xl px-4 py-2.5 text-xs font-extrabold transition-all cursor-pointer ${
                  state.profileMode === "active_learner"
                    ? "bg-[#142D40] text-white shadow-xs"
                    : "text-[#4A6070] hover:text-[#142D40]"
                }`}
              >
                Active Student Profile
              </button>
              <button
                type="button"
                onClick={() => switchProfileMode("cold_start")}
                className={`rounded-xl px-4 py-2.5 text-xs font-extrabold transition-all cursor-pointer ${
                  state.profileMode === "cold_start"
                    ? "bg-[#142D40] text-white shadow-xs"
                    : "text-[#4A6070] hover:text-[#142D40]"
                }`}
              >
                <RotateCcw className="w-3.5 h-3.5 inline mr-1" />
                New Student (Cold-Start)
              </button>
            </div>
          </div>
        </div>

        {/* Recommendation Inspector */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E2E8F0] shadow-xs space-y-4">
          <h2 className="font-display text-xl font-extrabold text-[#142D40] flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#087F8C]" />
            Recommendation Output Inspector
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recommendations.map((rec) => (
              <div
                key={rec.experiment.id}
                className="rounded-2xl border border-[#E2E8F0] bg-[#F7F9F8] p-4 space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-display font-bold text-sm text-[#142D40]">
                    {rec.experiment.title[locale]}
                  </span>
                  <span className="font-mono text-xs font-bold text-[#087F8C]">
                    Score: {rec.score.toFixed(2)}
                  </span>
                </div>
                <p className="text-xs text-[#4A6070]">{rec.reason[locale]}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Topic Mastery Telemetry */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E2E8F0] shadow-xs space-y-4">
          <h2 className="font-display text-xl font-extrabold text-[#142D40]">
            Topic Mastery Evidence State
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {Object.values(topicMastery).map((tm) => (
              <div
                key={tm.topicId}
                className="rounded-xl border border-[#E2E8F0] bg-[#F7F9F8] p-3 flex items-center justify-between"
              >
                <span className="font-bold text-[#142D40]">{tm.topicId}</span>
                <span className="font-mono text-[#4A6070]">
                  {tm.questionCount} q · {tm.accuracyPercent ?? 0}% · {tm.evidenceStatus}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
