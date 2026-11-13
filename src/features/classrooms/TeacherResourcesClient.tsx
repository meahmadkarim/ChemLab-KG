"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

import {
  FlaskConical,
  FileText,
  ShieldAlert,
  HelpCircle,
  Download,
  Clock,
  ArrowRight,
  Copy,
  Check,
  Search,
  BookOpen,
  Users,
  Lock,
  Eye,
  CheckCircle2,
  Calendar,
  MoreVertical,
  Trash2,
  Share2,
  Edit,
  Plus,
  ArrowLeft,
  Play,
  } from "lucide-react";
import type { Experiment } from "@/features/experiments/types";
import { TOPICS, getTopicById } from "@/features/experiments/data";
import type { Locale } from "@/i18n/config";
import { ChemIllustration } from "@/components/illustrations/ChemIllustration";
import { formatDuration } from "@/i18n/format";
import type { TeacherLabNotebook, TeacherNotebookShare } from "@/features/notebook/types";
import { TeacherNotesViewerModal } from "@/features/notebook/components/TeacherNotesViewerModal";
import { ShareWithClassModal } from "@/features/notebook/components/ShareWithClassModal";
import type { QuestionBankItem } from "@/features/questions/server-questions";

interface TeacherResourcesClientProps {
  experiments: Experiment[];
  locale: Locale;
}

type ResourceTab = "experiments" | "saved_notes" | "curriculum" | "safety" | "quizzes";

export function TeacherResourcesClient({
  experiments,
  locale,
}: TeacherResourcesClientProps) {

  const [activeTab, setActiveTab] = useState<ResourceTab>("experiments");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  // Saved Notebooks state
  const [savedNotebooks, setSavedNotebooks] = useState<TeacherLabNotebook[]>([]);
  const [loadingNotebooks, setLoadingNotebooks] = useState(false);
  const [notebookFilter, setNotebookFilter] = useState<"all" | "published" | "draft">("all");
  const [viewerState, setViewerState] = useState<{
    isOpen: boolean;
    shares: TeacherNotebookShare[];
    title: string;
  }>({ isOpen: false, shares: [], title: "" });

  // Saved Notes management states
  const [activeMenuNbId, setActiveMenuNbId] = useState<string | null>(null);
  const [shareModalState, setShareModalState] = useState<{
    isOpen: boolean;
    slug: string;
    title: string;
    shares: TeacherNotebookShare[];
  }>({ isOpen: false, slug: "", title: "", shares: [] });
  const [stopSharingState, setStopSharingState] = useState<{
    slug: string;
    title: string;
  } | null>(null);
  const [deletingNotebookState, setDeletingNotebookState] = useState<{
    slug: string;
    title: string;
  } | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Question Bank states
  const [selectedTopicIdForQuestions, setSelectedTopicIdForQuestions] = useState<string | null>(null);
  const [topicQuestions, setTopicQuestions] = useState<QuestionBankItem[]>([]);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [questionSearch, setQuestionSearch] = useState("");
  const [selectedExpFilter, setSelectedExpFilter] = useState<string>("all");
  const [activeMenuQuestionId, setActiveMenuQuestionId] = useState<string | null>(null);

  // Add / Edit Question modal state
  const [questionModalState, setQuestionModalState] = useState<{
    isOpen: boolean;
    isEditing: boolean;
    questionId?: string;
    experimentSlug: string;
    promptText: string;
    options: Array<{ id: string; text: string; isCorrect: boolean; explanation: string }>;
  } | null>(null);
  const [deletingQuestionId, setDeletingQuestionId] = useState<string | null>(null);

  // Preview Quiz modal state
  const [previewQuizState, setPreviewQuizState] = useState<{
    isOpen: boolean;
    currentIndex: number;
    selectedOptions: Record<string, string>;
    checkedQuestions: Record<string, boolean>;
    isFinished: boolean;
  }>({
    isOpen: false,
    currentIndex: 0,
    selectedOptions: {},
    checkedQuestions: {},
    isFinished: false,
  });

  useEffect(() => {
    if (activeTab === "saved_notes") {
      fetchTeacherNotebooks();
    }
  }, [activeTab]);

  useEffect(() => {
    if (selectedTopicIdForQuestions) {
      fetchTopicQuestions(selectedTopicIdForQuestions);
    }
  }, [selectedTopicIdForQuestions]);

  async function fetchTopicQuestions(topicId: string) {
    setLoadingQuestions(true);
    try {
      const res = await fetch(`/api/teacher/questions?topicId=${encodeURIComponent(topicId)}`, {
        cache: "no-store",
      });
      const data = await res.json();
      if (data.ok && Array.isArray(data.questions)) {
        setTopicQuestions(data.questions);
      }
    } catch (err) {
      console.error("Failed to fetch questions:", err);
    } finally {
      setLoadingQuestions(false);
    }
  }

  async function handleStopSharingConfirm() {
    if (!stopSharingState) return;
    setActionLoading(true);
    try {
      const res = await fetch(
        `/api/notebook/teacher/share?slug=${encodeURIComponent(stopSharingState.slug)}&all=true`,
        { method: "DELETE" }
      );
      if (res.ok) {
        await fetchTeacherNotebooks();
        setStopSharingState(null);
      }
    } catch (err) {
      console.error("Failed to stop sharing:", err);
    } finally {
      setActionLoading(false);
    }
  }

  async function handleDeleteNotebookConfirm() {
    if (!deletingNotebookState) return;
    setActionLoading(true);
    try {
      const res = await fetch(
        `/api/notebook/teacher?slug=${encodeURIComponent(deletingNotebookState.slug)}`,
        { method: "DELETE" }
      );
      if (res.ok) {
        await fetchTeacherNotebooks();
        setDeletingNotebookState(null);
      }
    } catch (err) {
      console.error("Failed to delete notebook draft:", err);
    } finally {
      setActionLoading(false);
    }
  }

  async function handleSaveQuestionSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!questionModalState) return;
    const { isEditing, questionId, experimentSlug, promptText, options } = questionModalState;
    if (!promptText.trim()) return;

    try {
      const res = await fetch("/api/teacher/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: isEditing ? questionId : undefined,
          topicId: selectedTopicIdForQuestions,
          experimentSlug,
          promptText: promptText.trim(),
          options,
        }),
      });
      if (res.ok) {
        if (selectedTopicIdForQuestions) {
          await fetchTopicQuestions(selectedTopicIdForQuestions);
        }
        setQuestionModalState(null);
      }
    } catch (err) {
      console.error("Failed to save question:", err);
    }
  }

  async function handleDeleteQuestionConfirm() {
    if (!deletingQuestionId) return;
    try {
      const res = await fetch(`/api/teacher/questions?id=${encodeURIComponent(deletingQuestionId)}`, {
        method: "DELETE",
      });
      if (res.ok) {
        if (selectedTopicIdForQuestions) {
          await fetchTopicQuestions(selectedTopicIdForQuestions);
        }
        setDeletingQuestionId(null);
      }
    } catch (err) {
      console.error("Failed to delete question:", err);
    }
  }

  async function fetchTeacherNotebooks() {
    setLoadingNotebooks(true);
    try {
      const res = await fetch("/api/notebook/teacher?all=true", { cache: "no-store" });
      const data = await res.json();
      if (data.ok && Array.isArray(data.notebooks)) {
        setSavedNotebooks(data.notebooks);
      }
    } catch (err) {
      console.error("Failed to fetch teacher notebooks:", err);
    } finally {
      setLoadingNotebooks(false);
    }
  }

  function handleCopyShareLink(slug: string) {
    if (typeof window !== "undefined") {
      const url = `${window.location.origin}/${locale}/experiments/${slug}`;
      navigator.clipboard.writeText(url);
      setCopiedSlug(slug);
      setTimeout(() => setCopiedSlug(null), 2000);
    }
  }

  const filteredExperiments = experiments.filter((exp) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const topic = getTopicById(exp.topicId);
    return (
      exp.title[locale]?.toLowerCase().includes(q) ||
      exp.shortDescription[locale]?.toLowerCase().includes(q) ||
      topic.title[locale]?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 sm:space-y-7">
      {/* HEADER */}
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#142D40] tracking-tight ">
          {locale === "ky"
            ? "Мугалимдер үчүн ресурстар жана окуу материалдары"
            : locale === "ru"
            ? "Ресурсы для учителей и учебные материалы"
            : "Teacher Resources & Curriculum Library"}
        </h1>
        <p className="text-xs sm:text-sm text-[#536574]">
          {locale === "ky"
            ? "Окуу пландарын, видео тажрыйбаларды, коопсуздук эрежелерин жана практикалык тапшырмаларды колдонуңуз."
            : locale === "ru"
            ? "Методические руководства, лабораторные видео, правила безопасности и раздаточные материалы."
            : "Access curriculum-aligned lab videos, teaching guides, safety protocols, and downloadable classroom handouts."}
        </p>
      </div>

      {/* RESOURCE TABS */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-px overflow-x-auto">
        {(
          [
            { id: "experiments", label: "Virtual Experiments", icon: FlaskConical },
            { id: "saved_notes", label: "My Saved Lab Notes", icon: BookOpen },
            { id: "curriculum", label: "Lesson Plans & Guides", icon: FileText },
            { id: "safety", label: "Lab Safety Protocols", icon: ShieldAlert },
            { id: "quizzes", label: "Quiz Banks & Rubrics", icon: HelpCircle },
          ] as const
        ).map((tab) => {
          const Icon = tab.icon;
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition-colors cursor-pointer shrink-0 ${
                isSelected
                  ? "border-[#087F8C] text-[#087F8C]"
                  : "border-transparent text-[#536574] hover:text-[#142D40]"
              }`}
            >
              <Icon className="size-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB: MY SAVED LAB NOTES */}
      {activeTab === "saved_notes" && (
        <div className="space-y-5">
          {/* Top Bar with Filter & Search */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="size-4 text-[#536574] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={
                  locale === "ky"
                    ? "Тажрыйба же тема боюнча издөө..."
                    : locale === "ru"
                    ? "Поиск по названию опыта или теме..."
                    : "Search saved lab notes by experiment title or topic..."
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm text-[#142D40] bg-slate-50 border border-slate-200 rounded-xl placeholder-slate-400 focus:outline-none focus:border-[#087F8C]"
              />
            </div>

            {/* Filter pills */}
            <div className="flex items-center gap-1.5 self-start sm:self-auto">
              {(
                [
                  { id: "all", label: "All Notes" },
                  { id: "published", label: "Shared with Classes" },
                  { id: "draft", label: "Private Drafts" },
                ] as const
              ).map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setNotebookFilter(f.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    notebookFilter === f.id
                      ? "bg-[#142D40] text-white"
                      : "bg-slate-100 text-[#536574] hover:bg-slate-200"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {loadingNotebooks ? (
            <div className="py-16 flex flex-col items-center justify-center gap-2">
              <div className="size-8 rounded-full border-2 border-[#087F8C] border-t-transparent animate-spin" />
              <p className="text-xs text-[#536574]">Loading your saved lab notes...</p>
            </div>
          ) : (
            (() => {
              const filtered = savedNotebooks.filter((nb) => {
                const exp = experiments.find((e) => e.slug === nb.experimentSlug);
                const title = exp?.title[locale]?.toLowerCase() || nb.experimentSlug.toLowerCase();
                const topic = exp ? getTopicById(exp.topicId).title[locale]?.toLowerCase() : "";
                const matchesSearch =
                  !searchQuery.trim() ||
                  title.includes(searchQuery.toLowerCase()) ||
                  topic.includes(searchQuery.toLowerCase());

                const isPublished = nb.status === "published" || (nb.shares && nb.shares.length > 0);
                const matchesFilter =
                  notebookFilter === "all" ||
                  (notebookFilter === "published" && isPublished) ||
                  (notebookFilter === "draft" && !isPublished);

                return matchesSearch && matchesFilter;
              });

              if (filtered.length === 0) {
                return (
                  <div className="bg-white rounded-2xl border border-slate-200/80 p-10 text-center space-y-3">
                    <div className="size-12 rounded-2xl bg-sky-50 text-[#087F8C] flex items-center justify-center mx-auto">
                      <BookOpen className="size-6" />
                    </div>
                    <h3 className="font-bold text-base text-[#142D40]">
                      {searchQuery
                        ? "No matching lab notes found"
                        : "No saved teacher lab notes yet"}
                    </h3>
                    <p className="text-xs text-[#536574] max-w-md mx-auto">
                      {searchQuery
                        ? "Try clearing your search query or switching filters."
                        : "You can write customized lesson procedures, expected observations, and classroom guidance for any experiment. Choose an experiment to begin."}
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery("");
                        setActiveTab("experiments");
                      }}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#087F8C] text-white text-xs font-bold hover:bg-[#066670] transition-colors cursor-pointer"
                    >
                      <span>Browse Virtual Experiments</span>
                      <ArrowRight className="size-3.5" />
                    </button>
                  </div>
                );
              }

              return (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filtered.map((nb) => {
                    const exp = experiments.find((e) => e.slug === nb.experimentSlug);
                    const topic = exp ? getTopicById(exp.topicId) : null;
                    const isShared = nb.status === "published" || (nb.shares && nb.shares.length > 0);
                    const shareCount = nb.shares?.length || 0;

                    return (
                      <div
                        key={nb.id}
                        className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition-all gap-4"
                      >
                        <div className="space-y-3">
                          {/* Status, Topic, and Actions */}
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[11px] font-semibold text-[#087F8C] uppercase tracking-wider truncate">
                              {topic ? topic.title[locale] : "Chemistry"}
                            </span>
                            <div className="flex items-center gap-1.5 shrink-0">
                              {isShared ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                  <Users className="size-3" />
                                  <span>
                                    Shared ({shareCount} {shareCount === 1 ? "class" : "classes"})
                                  </span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-[#536574] border border-slate-200">
                                  <Lock className="size-3" />
                                  <span>Private Draft</span>
                                </span>
                              )}

                              {/* Three-dot Contextual Menu */}
                              <div className="relative">
                                <button
                                  type="button"
                                  onClick={() =>
                                    setActiveMenuNbId((prev) => (prev === nb.id ? null : nb.id))
                                  }
                                  className="p-1 rounded-lg text-slate-400 hover:text-[#142D40] hover:bg-slate-100 transition-colors cursor-pointer"
                                  title="Options"
                                >
                                  <MoreVertical className="size-4" />
                                </button>

                                {activeMenuNbId === nb.id && (
                                  <>
                                    <div
                                      className="fixed inset-0 z-40"
                                      onClick={() => setActiveMenuNbId(null)}
                                    />
                                    <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl border border-slate-200 shadow-xl py-1.5 z-50 text-xs">
                                      <Link
                                        href={`/${locale}/teacher-dashboard/experiments/${nb.experimentSlug}`}
                                        onClick={() => setActiveMenuNbId(null)}
                                        className="w-full text-left px-3.5 py-1.5 text-[#142D40] hover:bg-slate-50 flex items-center gap-2 cursor-pointer font-medium"
                                      >
                                        <BookOpen className="size-3.5 text-[#087F8C]" />
                                        <span>Open in Lab Notebook</span>
                                      </Link>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setActiveMenuNbId(null);
                                          setShareModalState({
                                            isOpen: true,
                                            slug: nb.experimentSlug,
                                            title: exp?.title[locale] || nb.experimentSlug,
                                            shares: nb.shares || [],
                                          });
                                        }}
                                        className="w-full text-left px-3.5 py-1.5 text-[#142D40] hover:bg-slate-50 flex items-center gap-2 cursor-pointer font-medium"
                                      >
                                        <Share2 className="size-3.5 text-[#087F8C]" />
                                        <span>Manage Sharing</span>
                                      </button>
                                      {isShared && (
                                        <button
                                          type="button"
                                          onClick={() => {
                                            setActiveMenuNbId(null);
                                            setStopSharingState({
                                              slug: nb.experimentSlug,
                                              title: exp?.title[locale] || nb.experimentSlug,
                                            });
                                          }}
                                          className="w-full text-left px-3.5 py-1.5 text-amber-700 hover:bg-amber-50 flex items-center gap-2 cursor-pointer font-medium"
                                        >
                                          <Lock className="size-3.5" />
                                          <span>Stop Sharing</span>
                                        </button>
                                      )}
                                      <div className="border-t border-slate-100 my-1" />
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setActiveMenuNbId(null);
                                          setDeletingNotebookState({
                                            slug: nb.experimentSlug,
                                            title: exp?.title[locale] || nb.experimentSlug,
                                          });
                                        }}
                                        className="w-full text-left px-3.5 py-1.5 text-rose-600 hover:bg-rose-50 flex items-center gap-2 cursor-pointer font-medium"
                                      >
                                        <Trash2 className="size-3.5" />
                                        <span>Delete Draft</span>
                                      </button>
                                    </div>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Title */}
                          <h3 className="font-bold text-base text-[#142D40] leading-snug line-clamp-2">
                            {exp?.title[locale] || nb.experimentSlug}
                          </h3>

                          {/* Completed Sections Chips */}
                          <div className="space-y-1.5 pt-1">
                            <div className="text-[11px] font-bold text-[#536574] uppercase tracking-wider">
                              Customized Content:
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                              {Boolean(nb.aim || nb.hypothesis) && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-sky-50 text-[#087F8C] text-[11px] font-semibold">
                                  <CheckCircle2 className="size-3" />
                                  <span>Aim & Hypothesis</span>
                                </span>
                              )}
                              {(nb.procedureSteps?.length || 0) > 0 && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-sky-50 text-[#087F8C] text-[11px] font-semibold">
                                  <CheckCircle2 className="size-3" />
                                  <span>{nb.procedureSteps?.length} Steps</span>
                                </span>
                              )}
                              {Boolean(nb.expectedObservations || nb.actualObservations) && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-sky-50 text-[#087F8C] text-[11px] font-semibold">
                                  <CheckCircle2 className="size-3" />
                                  <span>Observations</span>
                                </span>
                              )}
                              {Boolean(nb.conclusion || nb.results) && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-sky-50 text-[#087F8C] text-[11px] font-semibold">
                                  <CheckCircle2 className="size-3" />
                                  <span>Conclusion</span>
                                </span>
                              )}
                              {Boolean(nb.teachingGuidance) && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-purple-50 text-purple-700 text-[11px] font-semibold">
                                  <Lock className="size-3" />
                                  <span>Guidance (Private)</span>
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Timestamp */}
                          <div className="flex items-center gap-1.5 text-[11px] text-[#536574] pt-1">
                            <Calendar className="size-3" />
                            <span>
                              Updated {new Date(nb.updatedAt).toLocaleDateString(locale === "ky" ? "ky-KG" : locale === "ru" ? "ru-RU" : "en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="space-y-2 pt-2 border-t border-slate-100">
                          <Link
                            href={`/${locale}/teacher-dashboard/experiments/${nb.experimentSlug}`}
                            className="w-full py-2.5 px-3.5 rounded-xl bg-[#087F8C] hover:bg-[#066670] text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                          >
                            <span>Open in Lab Notebook</span>
                            <ArrowRight className="size-3.5" />
                          </Link>

                          {isShared && (
                            <button
                              type="button"
                              onClick={() => {
                                setViewerState({
                                  isOpen: true,
                                  shares: nb.shares || [],
                                  title: exp?.title[locale] || nb.experimentSlug,
                                });
                              }}
                              className="w-full py-1.5 px-3 rounded-lg border border-slate-200 hover:bg-slate-50 text-[11px] font-semibold text-[#536574] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                            >
                              <Eye className="size-3.5" />
                              <span>Preview Shared Student View</span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })()
          )}
        </div>
      )}

      {/* TAB 1: EXPERIMENTS REPOSITORY */}
      {activeTab === "experiments" && (
        <div className="space-y-5">
          {/* Search bar */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex items-center gap-3">
            <Search className="size-4 text-[#536574] shrink-0" />
            <input
              type="text"
              placeholder="Search experiments by title, topic, or reagent..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs sm:text-sm text-[#142D40] placeholder-slate-400 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredExperiments.map((exp) => {
              const topic = getTopicById(exp.topicId);
              const isCopied = copiedSlug === exp.slug;

              return (
                <div
                  key={exp.id}
                  className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Thumbnail */}
                    <div className="h-40 bg-slate-900 relative overflow-hidden">
                      <ChemIllustration
                        variant={exp.illustration}
                        slug={exp.slug}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-2.5 left-3 bg-black/60 backdrop-blur-xs text-white text-[11px] font-semibold px-2 py-0.5 rounded flex items-center gap-1">
                        <Clock className="size-3" />
                        <span>{formatDuration(exp.durationSeconds)}</span>
                      </div>
                      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-xs text-[#142D40] text-[10px] font-bold px-2 py-0.5 rounded shadow-2xs">
                        Demonstration resource
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4 space-y-2">
                      <div className="text-xs font-semibold text-[#087F8C]">
                        {topic.title[locale]}
                      </div>
                      <h3 className="font-bold text-sm text-[#142D40] line-clamp-1">
                        {exp.title[locale]}
                      </h3>
                      <p className="text-xs text-[#536574] leading-relaxed line-clamp-2">
                        {exp.shortDescription[locale]}
                      </p>
                    </div>
                  </div>

                  {/* Actions: Open in Dashboard vs Copy Share Link */}
                  <div className="p-4 pt-0 space-y-2">
                    <Link
                      href={`/${locale}/teacher-dashboard/experiments/${exp.slug}`}
                      className="w-full py-2.5 px-3.5 rounded-xl bg-[#087F8C] hover:bg-[#066670] text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                    >
                      <span>Open Experiment Lab</span>
                      <ArrowRight className="size-3.5" />
                    </Link>

                    <button
                      type="button"
                      onClick={() => handleCopyShareLink(exp.slug)}
                      className="w-full py-1.5 px-3 rounded-lg border border-slate-200 hover:bg-slate-50 text-[11px] font-semibold text-[#536574] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      {isCopied ? (
                        <>
                          <Check className="size-3 text-teal-600" />
                          <span className="text-teal-600 font-bold">Copied student link!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="size-3" />
                          <span>Copy Student Link</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: CURRICULUM & LESSON PLANS */}
      {activeTab === "curriculum" && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-[#142D40]">Curriculum Lesson Plans & Worksheets</h2>
              <p className="text-xs text-[#536574] mt-1">
                Sample teaching outlines for independent portfolio demonstration; subject-expert review is pending.
              </p>
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {[
              {
                title: "Acids, Bases & pH Indicators Unit Plan",
                desc: "Sample teaching outline covering anthocyanin natural indicators, neutralization, and safety.",
                pages: "Demo content",
                type: "Markdown outline",
              },
              {
                title: "Electrolysis & Redox Chemistry Lab Manual",
                desc: "Step-by-step student activity sheet for Hoffman apparatus simulation and Faraday principles.",
                pages: "Demo content",
                type: "Handout",
              },
              {
                title: "Thermochemistry & Energy Changes Demonstration Guide",
                desc: "Teacher demonstration guide for magnesium ribbon combustion and enthalpy calculations.",
                pages: "Demo content",
                type: "Teacher Guide",
              },
              {
                title: "Solutions, Solubility Curves & Crystal Growth Protocol",
                desc: "Pre-lab discussion questions, observational templates, and rubric for copper sulfate crystallization.",
                pages: "Demo content",
                type: "Worksheet",
              },
            ].map((item, idx) => (
              <div key={idx} className="py-4 flex items-center justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="size-10 rounded-xl bg-sky-50 text-[#087F8C] flex items-center justify-center shrink-0 mt-0.5">
                    <FileText className="size-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[#142D40]">{item.title}</h4>
                    <p className="text-xs text-[#536574] mt-0.5">{item.desc}</p>
                    <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400">
                      <span>{item.type}</span>
                      <span>·</span>
                      <span>{item.pages}</span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const content = `# ${item.title}\n\nIndependent ChemLab KG demonstration resource. Expert review pending.\n\n${item.desc}\n\n## Observation worksheet\n- What changed during the video?\n- What evidence supports your explanation?\n- Which variables would need to be controlled?\n\n## Discussion\nConnect your observations to the experiment equation and objectives.\n\n## Safety\nUse this outline for video observation. Practical work requires an approved risk assessment and qualified supervision.\n`;
                    const url = URL.createObjectURL(new Blob([content], { type: "text/markdown;charset=utf-8" }));
                    const link = document.createElement("a"); link.href = url; link.download = `chemlab-teaching-outline-${idx + 1}.md`; link.click(); URL.revokeObjectURL(url);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-[#087F8C] hover:text-white text-xs font-semibold text-[#142D40] transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer"
                >
                  <Download className="size-3.5" />
                  <span>Download</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: LAB SAFETY PROTOCOLS */}
      {activeTab === "safety" && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
          <div>
            <h2 className="text-lg font-bold text-[#142D40]">School Laboratory Safety Protocols</h2>
            <p className="text-xs text-[#536574] mt-1">
              Safety classification and risk prevention guidance for classroom experiments.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="p-5 rounded-2xl border border-emerald-200 bg-emerald-50/40 space-y-2">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Level 1 · Low Risk</span>
              <h3 className="font-bold text-sm text-[#142D40]">Student Hands-On Labs</h3>
              <p className="text-xs text-[#536574] leading-relaxed">
                Uses everyday household reagents (red cabbage indicator, vinegar, baking soda). Safe for supervised student bench execution.
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-amber-200 bg-amber-50/40 space-y-2">
              <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">Level 2 · Moderate Risk</span>
              <h3 className="font-bold text-sm text-[#142D40]">Teacher-Led Demonstrations</h3>
              <p className="text-xs text-[#536574] leading-relaxed">
                Uses dilute laboratory reagents (0.1M HCl, 0.1M NaOH). Eye goggles and protective aprons mandatory.
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-rose-200 bg-rose-50/40 space-y-2">
              <span className="text-xs font-bold text-rose-800 uppercase tracking-wider">Level 3 · Fume Hood Required</span>
              <h3 className="font-bold text-sm text-[#142D40]">Virtual Simulation Preferred</h3>
              <p className="text-xs text-[#536574] leading-relaxed">
                Concentrated acids or vigorous exothermic reactions (burning magnesium, concentrated H2O2). Students should observe via ChemLab KG virtual lab.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: QUIZ BANKS */}
      {activeTab === "quizzes" && (
        <div className="space-y-6">
          {!selectedTopicIdForQuestions ? (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
              <div>
                <h2 className="text-lg font-bold text-[#142D40]">Curriculum Quiz Banks & Answer Rubrics</h2>
                <p className="text-xs text-[#536574] mt-1">
                  Automated scoring rubrics and conceptual question banks for chemistry units.
                </p>
              </div>

              <div className="divide-y divide-slate-100">
                {TOPICS.map((topic) => (
                  <div key={topic.id} className="py-4 flex items-center justify-between gap-4">
                    <div>
                      <h4 className="font-bold text-sm text-[#142D40]">{topic.title[locale]}</h4>
                      <p className="text-xs text-[#536574] mt-0.5">{topic.description[locale]}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedTopicIdForQuestions(topic.id);
                        setQuestionSearch("");
                        setSelectedExpFilter("all");
                      }}
                      className="px-3.5 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-[#087F8C] hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      View Question Bank
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            (() => {
              const selectedTopic = TOPICS.find(topic => topic.id === selectedTopicIdForQuestions) ?? TOPICS[0];
              const topicExps = experiments.filter((e) => e.topicId === selectedTopicIdForQuestions);

              const filteredQuestions = topicQuestions.filter((q) => {
                const matchesExp =
                  selectedExpFilter === "all" || q.experimentSlug === selectedExpFilter;
                const promptText = q.prompt[locale] || q.prompt.en || "";
                const matchesSearch =
                  !questionSearch.trim() ||
                  promptText.toLowerCase().includes(questionSearch.toLowerCase()) ||
                  q.options.some((opt) =>
                    (opt.text[locale] || opt.text.en || "").toLowerCase().includes(questionSearch.toLowerCase())
                  );
                return matchesExp && matchesSearch;
              });

              return (
                <div className="space-y-6">
                  {/* Top Bar with Back Button */}
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setSelectedTopicIdForQuestions(null)}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#087F8C] hover:text-[#066670] transition-colors cursor-pointer"
                    >
                      <ArrowLeft className="size-4" />
                      <span>Back to Curriculum Units</span>
                    </button>
                    <span className="text-xs text-[#536574] font-medium">
                      {selectedTopic.title[locale]} · {filteredQuestions.length} Questions
                    </span>
                  </div>

                  {/* Header Box */}
                  <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-7 shadow-xs space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-sky-50 text-[#087F8C] border border-sky-100 mb-2">
                          <BookOpen className="size-3" />
                          <span>Unit Question Bank</span>
                        </div>
                        <h2 className="text-xl font-bold text-[#142D40]">
                          {selectedTopic.title[locale]} — Question Bank
                        </h2>
                        <p className="text-xs text-[#536574] mt-1 max-w-2xl">
                          Review standard curriculum items, add custom teacher-authored questions, inspect misconceptions, or test the quiz in preview mode.
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            if (filteredQuestions.length > 0) {
                              setPreviewQuizState({
                                isOpen: true,
                                currentIndex: 0,
                                selectedOptions: {},
                                checkedQuestions: {},
                                isFinished: false,
                              });
                            }
                          }}
                          disabled={filteredQuestions.length === 0}
                          className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 disabled:opacity-50 text-xs font-semibold text-[#142D40] transition-colors flex items-center gap-1.5 cursor-pointer"
                        >
                          <Play className="size-3.5 text-[#087F8C]" />
                          <span>Preview Quiz</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setQuestionModalState({
                              isOpen: true,
                              isEditing: false,
                              experimentSlug: topicExps[0]?.slug || "",
                              promptText: "",
                              options: [
                                { id: "opt-1", text: "", isCorrect: true, explanation: "" },
                                { id: "opt-2", text: "", isCorrect: false, explanation: "" },
                                { id: "opt-3", text: "", isCorrect: false, explanation: "" },
                                { id: "opt-4", text: "", isCorrect: false, explanation: "" },
                              ],
                            });
                          }}
                          className="px-4 py-2 rounded-xl bg-[#087F8C] hover:bg-[#066670] text-white text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                        >
                          <Plus className="size-3.5" />
                          <span>Add Question</span>
                        </button>
                      </div>
                    </div>

                    {/* Filter and Search Bar */}
                    <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center gap-3">
                      <div className="flex-1 w-full flex items-center gap-2 bg-[#F8F7F4]/60 rounded-xl px-3 py-2 border border-slate-200/80">
                        <Search className="size-4 text-[#536574] shrink-0" />
                        <input
                          type="text"
                          placeholder="Search questions by prompt or answer options..."
                          value={questionSearch}
                          onChange={(e) => setQuestionSearch(e.target.value)}
                          className="w-full text-xs text-[#142D40] placeholder-slate-400 bg-transparent focus:outline-none"
                        />
                      </div>

                      <div className="w-full sm:w-auto">
                        <select
                          value={selectedExpFilter}
                          onChange={(e) => setSelectedExpFilter(e.target.value)}
                          className="w-full sm:w-64 px-3 py-2 rounded-xl border border-slate-200/80 text-xs text-[#142D40] bg-[#F8F7F4]/60 focus:bg-white focus:outline-none"
                        >
                          <option value="all">All Experiments ({topicExps.length})</option>
                          {topicExps.map((e) => (
                            <option key={e.slug} value={e.slug}>
                              {e.title[locale]}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Question Cards List */}
                  {loadingQuestions ? (
                    <div className="p-12 text-center text-xs text-[#536574] bg-white rounded-2xl border border-slate-200">
                      Loading unit question bank...
                    </div>
                  ) : filteredQuestions.length === 0 ? (
                    <div className="p-10 text-center space-y-2 bg-white rounded-2xl border border-slate-200/80">
                      <p className="text-sm font-semibold text-[#142D40]">No questions found</p>
                      <p className="text-xs text-[#536574]">
                        Try adjusting your search query, selecting another experiment, or add a new question above.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredQuestions.map((q, idx) => {
                        const exp = experiments.find((e) => e.slug === q.experimentSlug);
                        return (
                          <div
                            key={q.id}
                            className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-4 hover:border-slate-300 transition-colors"
                          >
                            {/* Card Top Row */}
                            <div className="flex items-center justify-between gap-3">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="font-mono text-xs font-bold text-[#087F8C] bg-sky-50 px-2 py-0.5 rounded">
                                  Q{idx + 1}
                                </span>
                                <span className="text-xs font-semibold text-[#536574] bg-slate-100 px-2 py-0.5 rounded">
                                  {exp?.title[locale] || q.experimentTitle || q.experimentSlug}
                                </span>
                                {q.isTeacherAuthored ? (
                                  <span className="text-[11px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-100">
                                    Teacher Authored
                                  </span>
                                ) : (
                                  <span className="text-[11px] font-semibold text-slate-500 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                                    Curriculum Standard
                                  </span>
                                )}
                              </div>

                              {/* Three-dot menu */}
                              <div className="relative">
                                <button
                                  type="button"
                                  onClick={() =>
                                    setActiveMenuQuestionId((prev) => (prev === q.id ? null : q.id))
                                  }
                                  className="p-1 rounded-lg text-slate-400 hover:text-[#142D40] hover:bg-slate-100 transition-colors cursor-pointer"
                                  title="Question options"
                                >
                                  <MoreVertical className="size-4" />
                                </button>

                                {activeMenuQuestionId === q.id && (
                                  <>
                                    <div
                                      className="fixed inset-0 z-40"
                                      onClick={() => setActiveMenuQuestionId(null)}
                                    />
                                    <div className="absolute right-0 top-full mt-1 w-44 bg-white rounded-xl border border-slate-200 shadow-xl py-1.5 z-50 text-xs">
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setActiveMenuQuestionId(null);
                                          setQuestionModalState({
                                            isOpen: true,
                                            isEditing: true,
                                            questionId: q.id,
                                            experimentSlug: q.experimentSlug,
                                            promptText: q.prompt[locale] || q.prompt.en || "",
                                            options: q.options.map((opt) => ({
                                              id: opt.id,
                                              text: opt.text[locale] || opt.text.en || "",
                                              isCorrect: opt.isCorrect,
                                              explanation: opt.explanation[locale] || opt.explanation.en || "",
                                            })),
                                          });
                                        }}
                                        className="w-full text-left px-3.5 py-1.5 text-[#142D40] hover:bg-slate-50 flex items-center gap-2 cursor-pointer font-medium"
                                      >
                                        <Edit className="size-3.5 text-[#087F8C]" />
                                        <span>Edit Question</span>
                                      </button>
                                      <div className="border-t border-slate-100 my-1" />
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setActiveMenuQuestionId(null);
                                          setDeletingQuestionId(q.id);
                                        }}
                                        className="w-full text-left px-3.5 py-1.5 text-rose-600 hover:bg-rose-50 flex items-center gap-2 cursor-pointer font-medium"
                                      >
                                        <Trash2 className="size-3.5" />
                                        <span>Remove Question</span>
                                      </button>
                                    </div>
                                  </>
                                )}
                              </div>
                            </div>

                            {/* Prompt */}
                            <p className="text-sm font-bold text-[#142D40] leading-relaxed">
                              {q.prompt[locale] || q.prompt.en}
                            </p>

                            {/* Options */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                              {q.options.map((opt, optIdx) => {
                                const optLetter = String.fromCharCode(65 + optIdx);
                                const isCorrect = opt.isCorrect;
                                return (
                                  <div
                                    key={opt.id}
                                    className={`p-3 rounded-xl border text-xs flex items-start gap-2.5 transition-colors ${
                                      isCorrect
                                        ? "bg-emerald-50/70 border-emerald-300 text-emerald-950 font-medium"
                                        : "bg-[#F8F7F4]/60 border-slate-200/80 text-[#142D40]"
                                    }`}
                                  >
                                    <span
                                      className={`size-5 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0 ${
                                        isCorrect
                                          ? "bg-emerald-600 text-white"
                                          : "bg-slate-200 text-[#536574]"
                                      }`}
                                    >
                                      {optLetter}
                                    </span>
                                    <div className="flex-1">
                                      <span>{opt.text[locale] || opt.text.en}</span>
                                      {isCorrect && (
                                        <span className="block mt-1 text-[10px] font-bold text-emerald-700">
                                          ✓ Correct Answer
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>

                            {/* Explanation */}
                            {(() => {
                              const correctOpt = q.options.find((o) => o.isCorrect);
                              const explanationText =
                                correctOpt?.explanation[locale] || correctOpt?.explanation.en;
                              if (!explanationText) return null;
                              return (
                                <div className="p-3 rounded-xl bg-[#E6F2F5]/60 border border-[#087F8C]/20 text-xs text-[#142D40] space-y-1">
                                  <div className="font-bold text-[#087F8C] flex items-center gap-1.5 text-[11px]">
                                    <HelpCircle className="size-3.5" />
                                    <span>Explanation & Rubric:</span>
                                  </div>
                                  <p className="text-[#536574] leading-relaxed text-[11px]">
                                    {explanationText}
                                  </p>
                                </div>
                              );
                            })()}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })()
          )}
        </div>
      )}

      {/* MODAL 1: SHARE WITH CLASS MODAL */}
      <ShareWithClassModal
        isOpen={shareModalState.isOpen}
        onClose={() => setShareModalState((prev) => ({ ...prev, isOpen: false }))}
        experimentSlug={shareModalState.slug}
        experimentTitle={shareModalState.title}
        locale={locale}
        existingShares={shareModalState.shares}
        onSharesUpdated={() => {
          fetchTeacherNotebooks();
        }}
      />

      {/* MODAL 2: STOP SHARING CONFIRMATION MODAL */}
      {stopSharingState && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full p-6 shadow-2xl relative space-y-4">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                <Lock className="size-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#142D40]">Stop Sharing Notes?</h3>
                <p className="text-xs text-[#536574] mt-0.5">
                  Are you sure you want to stop sharing notes for &quot;{stopSharingState.title}&quot;? The notes will be hidden from student views, but your private draft will remain saved.
                </p>
              </div>
            </div>
            <div className="pt-2 flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setStopSharingState(null)}
                disabled={actionLoading}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-[#536574] hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleStopSharingConfirm}
                disabled={actionLoading}
                className="px-4 py-2 rounded-xl bg-[#087F8C] hover:bg-[#066670] text-white text-xs font-bold"
              >
                {actionLoading ? "Stopping..." : "Stop Sharing"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: DELETE NOTEBOOK DRAFT MODAL */}
      {deletingNotebookState && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full p-6 shadow-2xl relative space-y-4">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                <Trash2 className="size-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#142D40]">Delete Saved Draft?</h3>
                <p className="text-xs text-[#536574] mt-0.5">
                  Are you sure you want to delete your saved notes for &quot;{deletingNotebookState.title}&quot;? All written guidance and observations will be removed.
                </p>
              </div>
            </div>
            <div className="pt-2 flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setDeletingNotebookState(null)}
                disabled={actionLoading}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-[#536574] hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteNotebookConfirm}
                disabled={actionLoading}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold"
              >
                {actionLoading ? "Deleting..." : "Delete Draft"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: ADD / EDIT QUESTION MODAL */}
      {questionModalState && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-xl w-full p-6 shadow-2xl relative my-8 space-y-4">
            <h3 className="text-base font-bold text-[#142D40]">
              {questionModalState.isEditing ? "Edit Quiz Question" : "Add New Quiz Question"}
            </h3>

            <form onSubmit={handleSaveQuestionSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-[#142D40] block mb-1">
                  Linked Experiment
                </label>
                <select
                  value={questionModalState.experimentSlug}
                  onChange={(e) =>
                    setQuestionModalState({
                      ...questionModalState,
                      experimentSlug: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-[#142D40] bg-white focus:ring-2 focus:ring-[#087F8C] focus:outline-none"
                >
                  {experiments
                    .filter((e) => e.topicId === selectedTopicIdForQuestions)
                    .map((e) => (
                      <option key={e.slug} value={e.slug}>
                        {e.title[locale]}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-[#142D40] block mb-1">
                  Question Statement / Prompt
                </label>
                <textarea
                  rows={3}
                  required
                  value={questionModalState.promptText}
                  onChange={(e) =>
                    setQuestionModalState({
                      ...questionModalState,
                      promptText: e.target.value,
                    })
                  }
                  placeholder="e.g. Which observation confirms that the equivalence point in an acid-base titration has been reached?"
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs text-[#142D40] focus:ring-2 focus:ring-[#087F8C] focus:outline-none"
                />
              </div>

              <div className="space-y-2.5">
                <label className="text-xs font-bold text-[#142D40] block">
                  Answer Options (Select the correct option with the radio button)
                </label>
                {questionModalState.options.map((opt, oIdx) => (
                  <div key={opt.id} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="correctOption"
                      checked={opt.isCorrect}
                      onChange={() => {
                        const updated = questionModalState.options.map((o, idx) => ({
                          ...o,
                          isCorrect: idx === oIdx,
                        }));
                        setQuestionModalState({ ...questionModalState, options: updated });
                      }}
                      className="text-[#087F8C] focus:ring-[#087F8C] size-4 cursor-pointer"
                      title="Mark as correct"
                    />
                    <span className="font-mono text-xs font-bold text-[#536574] w-4">
                      {String.fromCharCode(65 + oIdx)}
                    </span>
                    <input
                      type="text"
                      required
                      value={opt.text}
                      onChange={(e) => {
                        const updated = [...questionModalState.options];
                        updated[oIdx] = { ...updated[oIdx], text: e.target.value };
                        setQuestionModalState({ ...questionModalState, options: updated });
                      }}
                      placeholder={`Option ${String.fromCharCode(65 + oIdx)}`}
                      className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-[#142D40] focus:ring-2 focus:ring-[#087F8C] focus:outline-none"
                    />
                  </div>
                ))}
              </div>

              <div>
                <label className="text-xs font-bold text-[#142D40] block mb-1">
                  Explanation & Scientific Rationale
                </label>
                <textarea
                  rows={2}
                  value={questionModalState.options.find((o) => o.isCorrect)?.explanation || ""}
                  onChange={(e) => {
                    const text = e.target.value;
                    const updated = questionModalState.options.map((o) =>
                      o.isCorrect ? { ...o, explanation: text } : o
                    );
                    setQuestionModalState({ ...questionModalState, options: updated });
                  }}
                  placeholder="Explain why the correct answer is valid and what chemical principle is demonstrated..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-[#142D40] focus:ring-2 focus:ring-[#087F8C] focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setQuestionModalState(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#536574] hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#087F8C] hover:bg-[#066670] text-white text-xs font-bold cursor-pointer"
                >
                  Save Question
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 5: DELETE QUESTION CONFIRMATION MODAL */}
      {deletingQuestionId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full p-6 shadow-2xl relative space-y-4">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                <Trash2 className="size-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#142D40]">Remove Question?</h3>
                <p className="text-xs text-[#536574] mt-0.5">
                  Are you sure you want to remove this question from the question bank? Historical student quiz submissions will not be affected.
                </p>
              </div>
            </div>
            <div className="pt-2 flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setDeletingQuestionId(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-[#536574] hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteQuestionConfirm}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 6: INTERACTIVE PREVIEW QUIZ MODAL */}
      {previewQuizState.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-lg w-full p-6 shadow-2xl relative space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="size-7 rounded-lg bg-sky-50 text-[#087F8C] flex items-center justify-center">
                  <Play className="size-3.5" />
                </span>
                <span className="text-xs font-bold text-[#142D40]">
                  Teacher Quiz Preview (Student Mode)
                </span>
              </div>
              <button
                type="button"
                onClick={() =>
                  setPreviewQuizState((prev) => ({ ...prev, isOpen: false }))
                }
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {(() => {
              const questions = topicQuestions;
              if (questions.length === 0) return null;

              if (previewQuizState.isFinished) {
                // Calculate score
                let correctCount = 0;
                questions.forEach((q) => {
                  const selected = previewQuizState.selectedOptions[q.id];
                  const correctOpt = q.options.find((o) => o.isCorrect);
                  if (selected === correctOpt?.id) correctCount++;
                });

                return (
                  <div className="text-center py-6 space-y-4">
                    <div className="size-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                      <CheckCircle2 className="size-7" />
                    </div>
                    <h3 className="text-lg font-bold text-[#142D40]">Preview Complete!</h3>
                    <p className="text-xs text-[#536574]">
                      You scored {correctCount} out of {questions.length} (
                      {Math.round((correctCount / questions.length) * 100)}%) in preview mode.
                    </p>
                    <div className="pt-2 flex justify-center gap-3">
                      <button
                        type="button"
                        onClick={() =>
                          setPreviewQuizState({
                            isOpen: true,
                            currentIndex: 0,
                            selectedOptions: {},
                            checkedQuestions: {},
                            isFinished: false,
                          })
                        }
                        className="px-4 py-2 rounded-xl bg-[#087F8C] text-white text-xs font-bold hover:bg-[#066670]"
                      >
                        Test Again
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setPreviewQuizState((prev) => ({ ...prev, isOpen: false }))
                        }
                        className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-[#536574] hover:bg-slate-50"
                      >
                        Close Preview
                      </button>
                    </div>
                  </div>
                );
              }

              const currentQ = questions[previewQuizState.currentIndex];
              if (!currentQ) return null;

              const selectedOptId = previewQuizState.selectedOptions[currentQ.id];
              const isChecked = previewQuizState.checkedQuestions[currentQ.id];
              const correctOpt = currentQ.options.find((o) => o.isCorrect);

              return (
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs text-[#536574]">
                    <span>
                      Question {previewQuizState.currentIndex + 1} of {questions.length}
                    </span>
                    <span className="font-semibold text-[#087F8C]">
                      {currentQ.experimentTitle || currentQ.experimentSlug}
                    </span>
                  </div>

                  <p className="text-sm font-bold text-[#142D40] leading-relaxed">
                    {currentQ.prompt[locale] || currentQ.prompt.en}
                  </p>

                  <div className="space-y-2 pt-1">
                    {currentQ.options.map((opt, oIdx) => {
                      const isSelected = selectedOptId === opt.id;
                      const isThisCorrect = opt.isCorrect;

                      let style = "bg-white border-slate-200 text-[#142D40] hover:bg-slate-50";
                      if (isChecked) {
                        if (isThisCorrect) {
                          style = "bg-emerald-50 border-emerald-300 text-emerald-950 font-medium";
                        } else if (isSelected && !isThisCorrect) {
                          style = "bg-rose-50 border-rose-300 text-rose-950";
                        }
                      } else if (isSelected) {
                        style = "bg-sky-50 border-[#087F8C] text-[#087F8C] font-semibold";
                      }

                      return (
                        <button
                          key={opt.id}
                          type="button"
                          disabled={isChecked}
                          onClick={() => {
                            setPreviewQuizState((prev) => ({
                              ...prev,
                              selectedOptions: {
                                ...prev.selectedOptions,
                                [currentQ.id]: opt.id,
                              },
                            }));
                          }}
                          className={`w-full p-3 rounded-xl border text-xs text-left flex items-start gap-2.5 transition-colors cursor-pointer ${style}`}
                        >
                          <span className="size-5 rounded-full bg-slate-100 flex items-center justify-center font-bold text-[10px] shrink-0 text-[#536574]">
                            {String.fromCharCode(65 + oIdx)}
                          </span>
                          <span className="flex-1">{opt.text[locale] || opt.text.en}</span>
                        </button>
                      );
                    })}
                  </div>

                  {isChecked && (
                    <div className="p-3 rounded-xl bg-[#E6F2F5]/60 border border-[#087F8C]/20 text-xs text-[#142D40] space-y-1 animate-in fade-in">
                      <div className="font-bold text-[#087F8C] flex items-center gap-1.5 text-[11px]">
                        <HelpCircle className="size-3.5" />
                        <span>Explanation:</span>
                      </div>
                      <p className="text-[#536574] leading-relaxed text-[11px]">
                        {correctOpt?.explanation[locale] || correctOpt?.explanation.en || "Correct scientific concept verified."}
                      </p>
                    </div>
                  )}

                  <div className="pt-2 flex justify-between items-center">
                    <button
                      type="button"
                      disabled={previewQuizState.currentIndex === 0}
                      onClick={() =>
                        setPreviewQuizState((prev) => ({
                          ...prev,
                          currentIndex: Math.max(0, prev.currentIndex - 1),
                        }))
                      }
                      className="px-3.5 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-[#536574] hover:bg-slate-50 disabled:opacity-40"
                    >
                      Previous
                    </button>

                    {!isChecked ? (
                      <button
                        type="button"
                        disabled={!selectedOptId}
                        onClick={() =>
                          setPreviewQuizState((prev) => ({
                            ...prev,
                            checkedQuestions: {
                              ...prev.checkedQuestions,
                              [currentQ.id]: true,
                            },
                          }))
                        }
                        className="px-4 py-2 rounded-xl bg-[#087F8C] hover:bg-[#066670] disabled:bg-slate-300 text-white text-xs font-bold transition-colors"
                      >
                        Check Answer
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          if (previewQuizState.currentIndex + 1 < questions.length) {
                            setPreviewQuizState((prev) => ({
                              ...prev,
                              currentIndex: prev.currentIndex + 1,
                            }));
                          } else {
                            setPreviewQuizState((prev) => ({ ...prev, isFinished: true }));
                          }
                        }}
                        className="px-4 py-2 rounded-xl bg-[#087F8C] hover:bg-[#066670] text-white text-xs font-bold transition-colors"
                      >
                        {previewQuizState.currentIndex + 1 < questions.length
                          ? "Next Question"
                          : "Finish Preview"}
                      </button>
                    )}
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* READ-ONLY VIEWER MODAL FOR TEACHER PREVIEW */}
      <TeacherNotesViewerModal
        isOpen={viewerState.isOpen}
        onClose={() => setViewerState((s) => ({ ...s, isOpen: false }))}
        shares={viewerState.shares}
        experimentTitle={viewerState.title}
        locale={locale}
        isPreviewMode={true}
      />
    </div>
  );
}
