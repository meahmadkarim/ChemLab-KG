"use client";

import React, { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import type { Experiment, TopicId, TopicInfo } from "../types";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { useLearningStore } from "@/features/progress/learning-store";
import { ExperimentCard } from "@/components/experiments/ExperimentCard";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export function ExperimentGalleryClient({
  experiments,
  topics,
  locale,
  libraryCopy,
  initialTopic = "all",
}: {
  experiments: Experiment[];
  topics: TopicInfo[];
  locale: Locale;
  libraryCopy: Dictionary["library"];
  featuredCopy?: Dictionary["featured"];
  initialTopic?: string;
}) {
  const { state } = useLearningStore();
  const [query, setQuery] = useState("");
  const [selectedTopic, setSelectedTopic] = useState<TopicId | "all">(
    topics.some((t) => t.id === initialTopic)
      ? (initialTopic as TopicId)
      : "all"
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return experiments.filter((exp) => {
      if (selectedTopic !== "all" && exp.topicId !== selectedTopic) return false;
      if (!q) return true;
      const haystack = [
        exp.title.en,
        exp.title.ky,
        exp.title.ru,
        exp.shortDescription.en,
        exp.shortDescription.ky,
        exp.shortDescription.ru,
        exp.chemicalEquation,
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [experiments, query, selectedTopic]);

  function resetAll() {
    setQuery("");
    setSelectedTopic("all");
  }

  return (
    <div className="space-y-10">
      {/* Prominent Search + Compact Topic Filter Bar */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#536574] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label={libraryCopy.searchPlaceholder}
              placeholder={libraryCopy.searchPlaceholder}
              className="w-full rounded-full border border-[#142D40]/15 bg-white pl-11 pr-10 py-3.5 text-sm sm:text-base text-[#142D40] placeholder:text-[#536574]/70 focus:border-[#087F8C] focus:outline-none transition-colors shadow-2xs"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Clear search"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#536574] hover:text-[#142D40] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {(query || selectedTopic !== "all") && (
            <button
              type="button"
              onClick={resetAll}
              className="text-xs font-bold text-[#087F8C] hover:underline px-3 py-2 cursor-pointer shrink-0"
            >
              {libraryCopy.clearFilters}
            </button>
          )}
        </div>

        {/* Compact Topic Pills */}
        <div
          className="flex items-center gap-2 overflow-x-auto pb-1"
          role="tablist"
          aria-label="Filter by chemistry topic"
        >
          <button
            type="button"
            role="tab"
            aria-selected={selectedTopic === "all"}
            onClick={() => setSelectedTopic("all")}
            className={`shrink-0 rounded-full px-4 py-2 text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
              selectedTopic === "all"
                ? "bg-[#142D40] text-white"
                : "bg-white text-[#536574] border border-[#142D40]/12 hover:text-[#142D40]"
            }`}
          >
            {libraryCopy.allTopics} ({experiments.length})
          </button>
          {topics.map((topic) => {
            const active = selectedTopic === topic.id;
            return (
              <button
                key={topic.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setSelectedTopic(topic.id)}
                className={`shrink-0 rounded-full px-4 py-2 text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
                  active
                    ? "bg-[#142D40] text-white"
                    : "bg-white text-[#536574] border border-[#142D40]/12 hover:text-[#142D40]"
                }`}
              >
                {topic.title[locale]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Spacious 3-Column Video Gallery Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {filtered.map((exp, idx) => (
            <ScrollReveal
              key={exp.id}
              variant="fade-up"
              delayMs={(idx % 6) * 60}
            >
              <ExperimentCard
                experiment={exp}
                locale={locale}
                isCompleted={state.completedSlugs.includes(exp.slug)}
              />
            </ScrollReveal>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-[#142D40]/10 p-12 text-center max-w-lg mx-auto space-y-4">
          <div className="text-xl font-bold text-[#142D40]">
            {libraryCopy.emptyTitle}
          </div>
          <p className="text-sm text-[#536574]">{libraryCopy.emptySubtitle}</p>
          <button
            type="button"
            onClick={resetAll}
            className="px-6 py-2.5 rounded-full bg-[#087F8C] text-white text-sm font-bold hover:bg-[#066670] transition-colors cursor-pointer"
          >
            {libraryCopy.clearFilters}
          </button>
        </div>
      )}
    </div>
  );
}
