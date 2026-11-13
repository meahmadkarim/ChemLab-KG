"use client";

import React, { useEffect, useId, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, X, Play, Clock, ArrowRight, CornerDownLeft } from "lucide-react";
import { EXPERIMENTS, getTopicById } from "@/features/experiments/data";
import { formatDuration } from "@/i18n/format";
import type { Locale } from "@/i18n/config";
import { ChemIllustration } from "@/components/illustrations/ChemIllustration";

export interface ExperimentSearchDialogProps {
  locale: Locale;
  isOpen: boolean;
  onClose: () => void;
  role?: "student" | "teacher" | "public";
}

const SEARCH_PLACEHOLDERS: Record<Locale, string> = {
  en: "Search experiments, topics, or formulas (e.g. acids, pH, electrolysis)...",
  ky: "Тажрыйбаларды, темаларды же формулаларды издөө (мис. кислота, pH)...",
  ru: "Поиск опытов, разделов или формул (напр. кислоты, pH, электролиз)...",
};

const SUGGESTED_QUERIES: Record<Locale, string[]> = {
  en: ["Acids & Bases", "Electrolysis", "Crystallization", "Catalysis", "Flame Tests"],
  ky: ["Кислоталар жана негиздер", "Электролиз", "Кристаллдашуу", "Катализ"],
  ru: ["Кислоты и основания", "Электролиз", "Кристаллизация", "Катализ", "Окрашивание пламени"],
};

export function ExperimentSearchDialog({
  locale,
  isOpen,
  onClose,
  role = "public",
}: ExperimentSearchDialogProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const searchInputId = useId();

  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  function getExperimentUrl(slug: string) {
    if (role === "student") {
      return `/${locale}/me/experiments/${slug}`;
    }
    if (role === "teacher") {
      return `/${locale}/teacher-dashboard/experiments/${slug}`;
    }
    return `/${locale}/experiments/${slug}`;
  }

  // Filter experiments based on title, description, topic, and chemical equation
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      // Suggest first 5 featured/popular experiments
      return EXPERIMENTS.slice(0, 5);
    }
    return EXPERIMENTS.filter((exp) => {
      const topic = getTopicById(exp.topicId);
      const text = [
        exp.title.en,
        exp.title.ky,
        exp.title.ru,
        exp.shortDescription.en,
        exp.shortDescription.ky,
        exp.shortDescription.ru,
        topic.title.en,
        topic.title.ky,
        topic.title.ru,
        exp.chemicalEquation,
      ]
        .join(" ")
        .toLowerCase();
      return text.includes(q);
    });
  }, [query]);

  // Safe clamped index during render
  const safeIndex =
    results.length === 0 ? 0 : Math.min(selectedIndex, results.length - 1);

  // Focus input when dialog opens
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  function handleClose() {
    setQuery("");
    setSelectedIndex(0);
    onClose();
  }

  // Keyboard navigation
  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") {
      e.preventDefault();
      handleClose();
      return;
    }

    if (results.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + results.length) % results.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      const target = results[safeIndex];
      if (target) {
        handleClose();
        router.push(getExperimentUrl(target.slug));
      }
    }
  }

  // Scroll active item into view
  useEffect(() => {
    if (!listRef.current) return;
    const items = listRef.current.querySelectorAll<HTMLElement>("[data-search-item]");
    const activeItem = items[safeIndex];
    if (activeItem) {
      activeItem.scrollIntoView({ block: "nearest" });
    }
  }, [safeIndex]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Search experiments"
      className="fixed inset-0 z-50 flex items-start justify-center p-3 sm:p-6 sm:pt-20 bg-[#142D40]/55 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div
        className="w-full max-w-2xl overflow-hidden rounded-3xl bg-white border border-[#142D40]/10 shadow-2xl animate-in zoom-in-95 duration-150 flex flex-col max-h-[82vh]"
        onKeyDown={handleKeyDown}
      >
        {/* Search Input Bar */}
        <div className="relative flex items-center border-b border-[#142D40]/10 px-5 py-4">
          <Search className="size-5 text-[#087F8C] shrink-0 pointer-events-none" />
          <input
            id={searchInputId}
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder={SEARCH_PLACEHOLDERS[locale]}
            aria-label="Search experiments"
            autoComplete="off"
            spellCheck="false"
            className="w-full bg-transparent px-3 text-base sm:text-lg text-[#142D40] placeholder:text-[#536574]/60 focus:outline-none"
          />

          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setSelectedIndex(0);
                inputRef.current?.focus();
              }}
              aria-label="Clear search"
              className="mr-2 text-[#536574] hover:text-[#142D40] p-1 rounded-lg cursor-pointer"
            >
              <X className="size-4" />
            </button>
          )}

          <button
            type="button"
            onClick={handleClose}
            className="rounded-lg bg-[#F8F7F4] border border-[#142D40]/10 px-2 py-1 text-xs font-semibold text-[#536574] hover:text-[#142D40] cursor-pointer"
          >
            ESC
          </button>
        </div>

        {/* Suggested Quick Filter Chips (shown when query is empty) */}
        {!query && (
          <div className="px-5 pt-3 pb-2 flex items-center gap-1.5 overflow-x-auto text-xs border-b border-[#142D40]/6 bg-[#F8F7F4]/60">
            <span className="text-[#536574] font-medium shrink-0">
              {locale === "ky" ? "Сунуштар:" : locale === "ru" ? "Темы:" : "Quick ideas:"}
            </span>
            {SUGGESTED_QUERIES[locale].map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => {
                  setQuery(tag);
                  setSelectedIndex(0);
                  inputRef.current?.focus();
                }}
                className="rounded-full bg-white border border-[#142D40]/12 px-3 py-1 text-xs font-semibold text-[#142D40] hover:border-[#087F8C] transition-colors cursor-pointer shrink-0"
              >
                {tag}
              </button>
            ))}
          </div>
        )}

        {/* Results List */}
        <div
          ref={listRef}
          role="listbox"
          aria-label="Search results"
          className="flex-1 overflow-y-auto p-3 space-y-1.5"
        >
          {results.length > 0 ? (
            results.map((exp, idx) => {
              const topic = getTopicById(exp.topicId);
              const isSelected = idx === safeIndex;
              return (
                <div
                  key={exp.id}
                  data-search-item
                  role="option"
                  aria-selected={isSelected}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  onClick={() => {
                    handleClose();
                    router.push(getExperimentUrl(exp.slug));
                  }}
                  className={`group flex items-center gap-3.5 rounded-2xl p-2.5 transition-colors cursor-pointer ${
                    isSelected
                      ? "bg-[#F8F7F4] border border-[#087F8C]/40"
                      : "hover:bg-[#F8F7F4] border border-transparent"
                  }`}
                >
                  {/* Thumbnail */}
                  <div className="relative size-14 sm:size-16 rounded-xl overflow-hidden bg-white shrink-0 border border-[#142D40]/10 shadow-2xs">
                    <ChemIllustration
                      variant={exp.illustration}
                      slug={exp.slug}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="min-w-0 flex-1 space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-[#536574]">
                        {topic.title[locale]}
                      </span>
                      <span className="text-[#536574]/40">·</span>
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#536574]">
                        <Clock className="size-3 text-[#536574]" />
                        {formatDuration(exp.durationSeconds)}
                      </span>
                    </div>

                    <h4 className="text-sm sm:text-base font-bold text-[#142D40] truncate">
                      {exp.title[locale]}
                    </h4>

                    <p className="text-xs text-[#536574] line-clamp-1">
                      {exp.shortDescription[locale]}
                    </p>
                  </div>

                  {/* Action indicator */}
                  <div className="shrink-0 pr-1">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold transition-colors ${
                        isSelected
                          ? "bg-[#087F8C] text-white"
                          : "text-[#536574] group-hover:text-[#142D40]"
                      }`}
                    >
                      <Play className="size-3 fill-current" />
                      <span className="hidden sm:inline">
                        {locale === "ky" ? "Көрүү" : locale === "ru" ? "Открыть" : "View"}
                      </span>
                    </span>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-12 px-6 text-center space-y-2">
              <p className="text-base font-bold text-[#142D40]">
                {locale === "ky"
                  ? "Эч нерсе табылган жок"
                  : locale === "ru"
                  ? "Ничего не найдено"
                  : "No experiments found"}
              </p>
              <p className="text-xs sm:text-sm text-[#536574] max-w-sm mx-auto">
                {locale === "ky"
                  ? `"${query}" суроосу боюнча тажрыйба табылган жок. Башка сөздөрдү байкап көрүңүз.`
                  : locale === "ru"
                  ? `По запросу «${query}» ничего не нашлось. Попробуйте ввести другое ключевое слово.`
                  : `We couldn't find experiments matching "${query}". Try searching by topic or chemical name.`}
              </p>
            </div>
          )}
        </div>

        {/* Footer Shortcut Bar */}
        <div className="flex items-center justify-between border-t border-[#142D40]/8 bg-[#F8F7F4] px-5 py-2.5 text-xs text-[#536574]">
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline-flex items-center gap-1">
              <kbd className="rounded border border-[#142D40]/15 bg-white px-1.5 py-0.5 font-mono text-[10px]">
                ↑
              </kbd>
              <kbd className="rounded border border-[#142D40]/15 bg-white px-1.5 py-0.5 font-mono text-[10px]">
                ↓
              </kbd>
              to navigate
            </span>
            <span className="inline-flex items-center gap-1">
              <kbd className="rounded border border-[#142D40]/15 bg-white px-1.5 py-0.5 font-mono text-[10px]">
                <CornerDownLeft className="size-2.5 inline" /> Enter
              </kbd>
              to select
            </span>
          </div>

          <div
            onClick={() => {
              onClose();
              router.push(`/${locale}/experiments`);
            }}
            className="font-bold text-[#087F8C] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>
              {locale === "ky"
                ? "Бардык тажрыйбалар"
                : locale === "ru"
                ? "Все 24 опыта"
                : "Browse all 24"}
            </span>
            <ArrowRight className="size-3" />
          </div>
        </div>
      </div>
    </div>
  );
}
