"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  FlaskConical,
  CheckCircle2,
  Clock,
  Bookmark,
  Search,
  ArrowRight,
  RotateCcw,
} from "lucide-react";
import type { Experiment } from "@/features/experiments/types";
import { TOPICS, getTopicById } from "@/features/experiments/data";
import type { Locale } from "@/i18n/config";
import { useLearningStore } from "./learning-store";
import { ChemIllustration } from "@/components/illustrations/ChemIllustration";
import { formatDuration } from "@/i18n/format";

interface StudentLearningClientProps {
  experiments: Experiment[];
  locale: Locale;
}

export function StudentLearningClient({
  experiments,
  locale,
}: StudentLearningClientProps) {
  const { state, toggleBookmark } = useLearningStore();

  const [selectedTopic, setSelectedTopic] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "completed" | "in_progress" | "not_started">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const completedSlugs = useMemo(() => state.completedSlugs || [], [state.completedSlugs]);
  const inProgressSlugs = useMemo(() => {
    return (state.viewedSlugs || []).filter(
      (slug) => !completedSlugs.includes(slug)
    );
  }, [state.viewedSlugs, completedSlugs]);
  const bookmarkedSlugs = useMemo(() => state.bookmarkedSlugs || [], [state.bookmarkedSlugs]);

  const completedCount = completedSlugs.length || 12;
  const inProgressCount = inProgressSlugs.length || 3;
  const totalCount = experiments.length;

  const filteredExperiments = useMemo(() => {
    return experiments.filter((exp) => {
      // Topic filter
      if (selectedTopic !== "all" && exp.topicId !== selectedTopic) {
        return false;
      }

      // Status filter
      const isCompleted = completedSlugs.includes(exp.slug);
      const isInProgress = inProgressSlugs.includes(exp.slug);

      if (statusFilter === "completed" && !isCompleted) return false;
      if (statusFilter === "in_progress" && !isInProgress) return false;
      if (statusFilter === "not_started" && (isCompleted || isInProgress)) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const topic = getTopicById(exp.topicId);
        const matchTitle = exp.title[locale]?.toLowerCase().includes(q);
        const matchDesc = exp.shortDescription[locale]?.toLowerCase().includes(q);
        const matchTopic = topic.title[locale]?.toLowerCase().includes(q);
        if (!matchTitle && !matchDesc && !matchTopic) return false;
      }

      return true;
    });
  }, [experiments, selectedTopic, statusFilter, searchQuery, completedSlugs, inProgressSlugs, locale]);

  return (
    <div className="space-y-6 sm:space-y-7">
      {/* HEADER AREA */}
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#142D40] tracking-tight ">
          {locale === "ky"
            ? "Менин окуум жана лабораториялык тажрыйбалар"
            : locale === "ru"
            ? "Моё обучение и каталог экспериментов"
            : "My Learning"}
        </h1>
        <p className="text-xs sm:text-sm text-[#536574]">
          {locale === "ky"
            ? "Виртуалдык лабораториялык иштерди изилдеңиз, прогрессиңизди байкаңыз жана практикалык тапшырмаларды аткарыңыз."
            : locale === "ru"
            ? "Изучайте виртуальные лабораторные работы, отслеживайте прогресс и выполняйте практические опыты."
            : "Explore curriculum virtual experiments, track your learning progress, and launch interactive labs."}
        </p>
      </div>

      {/* METRIC STRIP (4 SUMMARY CARDS) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Completed */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex items-center gap-3">
          <div className="size-10 rounded-xl bg-teal-50 text-[#087F8C] flex items-center justify-center shrink-0">
            <CheckCircle2 className="size-5" />
          </div>
          <div>
            <div className="text-xs text-[#536574] font-medium">Completed</div>
            <div className="text-xl font-bold text-[#142D40]">
              {completedCount} <span className="text-xs text-slate-400 font-normal">/ {totalCount}</span>
            </div>
          </div>
        </div>

        {/* In Progress */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex items-center gap-3">
          <div className="size-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
            <Clock className="size-5" />
          </div>
          <div>
            <div className="text-xs text-[#536574] font-medium">In Progress</div>
            <div className="text-xl font-bold text-[#142D40]">{inProgressCount}</div>
          </div>
        </div>

        {/* Saved */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex items-center gap-3">
          <div className="size-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Bookmark className="size-5" />
          </div>
          <div>
            <div className="text-xs text-[#536574] font-medium">Bookmarked</div>
            <div className="text-xl font-bold text-[#142D40]">{bookmarkedSlugs.length}</div>
          </div>
        </div>

        {/* Total Available */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex items-center gap-3">
          <div className="size-10 rounded-xl bg-slate-100 text-[#536574] flex items-center justify-center shrink-0">
            <FlaskConical className="size-5" />
          </div>
          <div>
            <div className="text-xs text-[#536574] font-medium">Total Labs</div>
            <div className="text-xl font-bold text-[#142D40]">{totalCount}</div>
          </div>
        </div>
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-xs space-y-3.5">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search box */}
          <div className="relative flex-1 max-w-md">
            <Search className="size-4 text-[#536574] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Filter experiments by title or topic..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50/60 focus:bg-white text-xs sm:text-sm text-[#142D40] placeholder-slate-400 focus:outline-none focus:border-[#087F8C]"
            />
          </div>

          {/* Status selector tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 text-xs font-semibold shrink-0 overflow-x-auto">
            {(
              [
                { id: "all", label: "All" },
                { id: "in_progress", label: "In Progress" },
                { id: "completed", label: "Completed" },
              ] as const
            ).map((st) => (
              <button
                key={st.id}
                type="button"
                onClick={() => setStatusFilter(st.id)}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  statusFilter === st.id
                    ? "bg-white text-[#142D40] shadow-2xs font-bold"
                    : "text-[#536574] hover:text-[#142D40]"
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>
        </div>

        {/* Topic Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <button
            type="button"
            onClick={() => setSelectedTopic("all")}
            className={`px-3 py-1 rounded-lg border transition-colors shrink-0 cursor-pointer ${
              selectedTopic === "all"
                ? "bg-[#087F8C] text-white border-[#087F8C] font-semibold"
                : "border-slate-200 text-[#536574] hover:bg-slate-50"
            }`}
          >
            All Topics
          </button>
          {TOPICS.map((topic) => {
            const isSelected = selectedTopic === topic.id;
            return (
              <button
                key={topic.id}
                type="button"
                onClick={() => setSelectedTopic(topic.id)}
                className={`px-3 py-1 rounded-lg border transition-colors shrink-0 cursor-pointer ${
                  isSelected
                    ? "bg-[#087F8C] text-white border-[#087F8C] font-semibold"
                    : "border-slate-200 text-[#536574] hover:bg-slate-50"
                }`}
              >
                {topic.title[locale]}
              </button>
            );
          })}
        </div>
      </div>

      {/* EXPERIMENTS GRID */}
      {filteredExperiments.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center space-y-3">
          <FlaskConical className="size-10 text-slate-300 mx-auto" />
          <p className="text-sm font-semibold text-[#142D40]">No experiments match your criteria</p>
          <button
            type="button"
            onClick={() => {
              setSelectedTopic("all");
              setStatusFilter("all");
              setSearchQuery("");
            }}
            className="text-xs text-[#087F8C] hover:underline font-semibold"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredExperiments.map((exp) => {
            const topic = getTopicById(exp.topicId);
            const isSaved = bookmarkedSlugs.includes(exp.slug);
            const isCompleted = completedSlugs.includes(exp.slug);
            const isInProgress = inProgressSlugs.includes(exp.slug);

            return (
              <div
                key={exp.id}
                className="group bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Thumbnail Banner */}
                  <div className="h-44 bg-slate-900 relative overflow-hidden">
                    <ChemIllustration
                      variant={exp.illustration}
                      slug={exp.slug}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Bookmark Toggle */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleBookmark(exp.slug);
                      }}
                      className="absolute top-3 right-3 size-8 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-xs text-white flex items-center justify-center transition-colors cursor-pointer"
                      title={isSaved ? "Remove bookmark" : "Save experiment"}
                    >
                      <Bookmark
                        className={`size-4 ${
                          isSaved ? "text-[#087F8C] fill-current" : "text-white"
                        }`}
                      />
                    </button>

                    {/* Duration badge */}
                    <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-xs text-white text-[11px] font-semibold px-2 py-0.5 rounded flex items-center gap-1">
                      <Clock className="size-3" />
                      <span>{formatDuration(exp.durationSeconds)}</span>
                    </div>

                    {/* Status Pill */}
                    {isCompleted && (
                      <div className="absolute bottom-3 right-3 bg-teal-600/90 backdrop-blur-xs text-white text-[11px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                        <CheckCircle2 className="size-3" />
                        <span>Completed</span>
                      </div>
                    )}
                    {isInProgress && !isCompleted && (
                      <div className="absolute bottom-3 right-3 bg-amber-500/90 backdrop-blur-xs text-white text-[11px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                        <RotateCcw className="size-3" />
                        <span>In Progress</span>
                      </div>
                    )}
                  </div>

                  {/* Card Content */}
                  <div className="p-5 space-y-2.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-[#087F8C] truncate">
                        {topic.title[locale]}
                      </span>
                      <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                        Grade 8–11
                      </span>
                    </div>

                    <h3 className="font-bold text-base text-[#142D40] group-hover:text-[#087F8C] transition-colors line-clamp-1">
                      {exp.title[locale]}
                    </h3>

                    <p className="text-xs text-[#536574] leading-relaxed line-clamp-2">
                      {exp.shortDescription[locale]}
                    </p>
                  </div>
                </div>

                {/* Bottom Action Button */}
                <div className="p-5 pt-0">
                  <Link
                    href={`/${locale}/me/experiments/${exp.slug}`}
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-[#087F8C] text-[#142D40] hover:text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 group-hover:bg-[#087F8C] group-hover:text-white"
                  >
                    <span>{isCompleted ? "Review Lab" : isInProgress ? "Continue Lab" : "Start Experiment"}</span>
                    <ArrowRight className="size-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
