"use client";

import { createWriteQueue } from "../write-queue";
import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import {
  BookOpen,
  FlaskConical,
  Video,
  CheckCircle2,
  Clock,
  Send,
  Save,
  Plus,
  Trash2,
  Sparkles,
  MessageSquare,
  HelpCircle,
  FileCheck2,
  AlertCircle,
  RotateCcw,
  Target,
  ListOrdered,
  Eye,
  ChevronDown,
  Check,
} from "lucide-react";
import type { Experiment } from "@/features/experiments/types";
import type { Locale } from "@/i18n/config";
import { useAuthStore } from "@/features/auth/auth-store";
import type {
  LabReportMode,
  LabReportStatus,
  LabProcedureStep,
  StudentLabReport,
  LabReportSaveInput,
  TeacherNotebookShare,
} from "../types";
import { TeacherNotesViewerModal } from "./TeacherNotesViewerModal";

interface StudentLabNotebookProps {
  experiment: Experiment;
  locale: Locale;
  assignmentId?: string | null;
}

export function StudentLabNotebook({
  experiment,
  locale,
  assignmentId,
}: StudentLabNotebookProps) {
  const { user } = useAuthStore();

  // Report fields state
  const [mode, setMode] = useState<LabReportMode>("video_observation");
  const [aim, setAim] = useState("");
  const [researchQuestion, setResearchQuestion] = useState("");
  const [hypothesis, setHypothesis] = useState("");
  const [procedureSteps, setProcedureSteps] = useState<LabProcedureStep[]>([]);
  const [observations, setObservations] = useState("");
  const [results, setResults] = useState("");
  const [conclusion, setConclusion] = useState("");
  const [status, setStatus] = useState<LabReportStatus>("draft");
  const [teacherFeedback, setTeacherFeedback] = useState<string>("");
  const [reviewedByName, setReviewedByName] = useState<string>("");
  const [reviewedAt, setReviewedAt] = useState<string>("");

  // Autosave & UI state
  const [saveState, setSaveState] = useState<"saved" | "saving" | "unsaved" | "offline">("saved");
  const [lastSavedTime, setLastSavedTime] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Content management modals
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  // Published Teacher Notes for this experiment
  const [teacherShares, setTeacherShares] = useState<TeacherNotebookShare[]>([]);
  const [isTeacherNotesOpen, setIsTeacherNotesOpen] = useState(false);

  useEffect(() => {
    let active = true;
    async function fetchTeacherNotes() {
      try {
        const res = await fetch(`/api/notebook/teacher/shared?slug=${encodeURIComponent(experiment.slug)}`);
        if (res.ok) {
          const json = await res.json();
          if (active && json.shares && json.shares.length > 0) {
            setTeacherShares(json.shares);
          }
        }
      } catch {}
    }
    void fetchTeacherNotes();
    return () => {
      active = false;
    };
  }, [experiment.slug]);

  // Accordion expansion state for the 4 timeline stages (all collapsed by default)
  const [expandedStages, setExpandedStages] = useState<Record<string, boolean>>({
    aim: false,
    procedure: false,
    observations: false,
    conclusion: false,
  });

  const toggleStage = (stageKey: string) => {
    setExpandedStages((prev) => ({
      ...prev,
      [stageKey]: !prev[stageKey],
    }));
  };

  const initialLoadDone = useRef(false);
  const saveQueue = useRef(createWriteQueue());
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const storageKey = `chemlab_nb_${user?.id || "guest"}_${experiment.slug}_${assignmentId || "personal"}`;

  // 1. Initial Load: Fetch from API or localStorage
  useEffect(() => {
    let active = true;

    async function loadReport() {
      if (!user) {
        // Guest mode - try localStorage
        try {
          const cached = localStorage.getItem(storageKey);
          if (cached) {
            const data = JSON.parse(cached) as StudentLabReport;
            if (active) populateForm(data);
          }
        } catch {}
        initialLoadDone.current = true;
        return;
      }

      try {
        const queryParams = new URLSearchParams({ slug: experiment.slug });
        if (assignmentId) queryParams.set("assignmentId", assignmentId);

        const res = await fetch(`/api/notebook?${queryParams.toString()}`);
        if (res.ok) {
          const json = await res.json();
          if (active && json.report) {
            populateForm(json.report);
            initialLoadDone.current = true;
            return;
          }
        }
      } catch (err) {
        console.warn("[Notebook] Failed to fetch cloud report, falling back to local cache:", err);
      }

      // Fallback to local storage if API didn't return report
      try {
        const cached = localStorage.getItem(storageKey);
        if (cached && active) {
          const data = JSON.parse(cached) as StudentLabReport;
          populateForm(data);
          setSaveState("offline");
        }
      } catch {}

      initialLoadDone.current = true;
    }

    function populateForm(report: StudentLabReport) {
      setMode(report.mode || "video_observation");
      setAim(report.aim || "");
      setResearchQuestion(report.researchQuestion || "");
      setHypothesis(report.hypothesis || "");
      setProcedureSteps(report.procedureSteps || []);
      setObservations(report.observations || "");
      setResults(report.results || "");
      setConclusion(report.conclusion || "");
      setStatus(report.status || "draft");
      setTeacherFeedback(report.teacherFeedback || "");
      setReviewedByName(report.reviewedByName || "");
      setReviewedAt(report.reviewedAt || "");
      if (report.updatedAt) {
        setLastSavedTime(
          new Date(report.updatedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        );
      }
    }

    void loadReport();

    return () => {
      active = false;
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, [user, experiment.slug, assignmentId, storageKey]);

  // 2. Perform Save
  const performSave = useCallback(
    async (explicitStatus?: LabReportStatus) => {
      if (!initialLoadDone.current) return false;
      const targetStatus = explicitStatus || status;

      const payload: LabReportSaveInput = {
        experimentSlug: experiment.slug,
        assignmentId,
        mode,
        aim,
        researchQuestion,
        hypothesis,
        procedureSteps,
        observations,
        results,
        conclusion,
        status: targetStatus,
      };

      // Always cache in localStorage first for zero-loss recovery
      try {
        localStorage.setItem(
          storageKey,
          JSON.stringify({
            ...payload,
            id: `cached-${Date.now()}`,
            userId: user?.id || "guest",
            updatedAt: new Date().toISOString(),
          })
        );
      } catch {}

      if (!user) {
        setSaveState("saved");
        setLastSavedTime(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
        return true;
      }

      setSaveState("saving");

      try {
        const res = await saveQueue.current(() => fetch("/api/notebook", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }));

        if (!res.ok) throw new Error("Server rejected save request");

        const json = await res.json();
        setSaveState("saved");
        setLastSavedTime(
          new Date(json.report.updatedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        );
        if (explicitStatus) setStatus(explicitStatus);
        return true;
      } catch (err) {
        console.warn("[Notebook] Autosave sync warning:", err);
        setSaveState("offline");
        return false;
      }
    },
    [
      initialLoadDone,
      status,
      experiment.slug,
      assignmentId,
      mode,
      aim,
      researchQuestion,
      hypothesis,
      procedureSteps,
      observations,
      results,
      conclusion,
      user,
      storageKey,
    ]
  );

  const latestSave = useRef(performSave);
  useEffect(() => { latestSave.current = performSave; }, [performSave]);

  // 3. Debounced Autosave Trigger on Any Field Change
  const triggerAutosave = useCallback(() => {
    if (!initialLoadDone.current) return;
    setSaveState("unsaved");

    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => {
      void latestSave.current();
    }, 1500);
  }, []);

  // 4. Procedure step management
  function addProcedureStep() {
    const nextNum = procedureSteps.length + 1;
    const newStep: LabProcedureStep = {
      id: `step-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      stepNumber: nextNum,
      text: "",
      source: mode === "supervised_lab" ? "personally_performed" : "video_observation",
    };
    const updated = [...procedureSteps, newStep];
    setProcedureSteps(updated);
    triggerAutosave();
  }

  function updateStepText(id: string, text: string) {
    const updated = procedureSteps.map((s) => (s.id === id ? { ...s, text } : s));
    setProcedureSteps(updated);
    triggerAutosave();
  }

  function updateStepSource(id: string, source: "video_observation" | "personally_performed") {
    const updated = procedureSteps.map((s) => (s.id === id ? { ...s, source } : s));
    setProcedureSteps(updated);
    triggerAutosave();
  }

  function removeProcedureStep(id: string) {
    const filtered = procedureSteps.filter((s) => s.id !== id);
    const renumbered = filtered.map((s, idx) => ({ ...s, stepNumber: idx + 1 }));
    setProcedureSteps(renumbered);
    triggerAutosave();
  }

  // 5. Submit to Teacher
  async function handleSubmitReport() {
    if (!user) {
      setErrorMessage("Please sign in to submit your report to your teacher.");
      return;
    }

    if (!aim.trim() || !observations.trim() || !conclusion.trim()) {
      setErrorMessage("Please complete your aim, observations, and conclusion before submitting.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
      if (!await performSave()) throw new Error("Save your latest changes before submitting. Check your connection and retry.");
      const res = await fetch("/api/notebook/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          experimentSlug: experiment.slug,
          assignmentId,
        }),
      });

      if (!res.ok) {
        const errJson = await res.json();
        throw new Error(errJson.error || "Submission failed.");
      }

      setStatus("submitted");
      setSubmitSuccess(true);
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : "Failed to submit report.");
    } finally {
      setIsSubmitting(false);
    }
  }

  // 6. Delete Draft
  async function handleDeleteDraft() {
    setIsDeleting(true);
    setErrorMessage(null);
    try {
      const res = await fetch(
        `/api/notebook?slug=${encodeURIComponent(experiment.slug)}${
          assignmentId ? `&assignmentId=${encodeURIComponent(assignmentId)}` : ""
        }`,
        { method: "DELETE" }
      );
      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || "Failed to delete draft.");
      }
      if (typeof window !== "undefined") {
        localStorage.removeItem(storageKey);
      }
      setAim("");
      setResearchQuestion("");
      setHypothesis("");
      setProcedureSteps([]);
      setObservations("");
      setResults("");
      setConclusion("");
      setStatus("draft");
      setSaveState("saved");
      setLastSavedTime(null);
      setShowDeleteModal(false);
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : "Failed to delete draft.");
    } finally {
      setIsDeleting(false);
    }
  }

  // 7. Withdraw Submission (reverts to draft)
  async function handleWithdrawReport() {
    setIsWithdrawing(true);
    setErrorMessage(null);
    try {
      const res = await fetch(
        `/api/notebook?slug=${encodeURIComponent(experiment.slug)}&action=withdraw${
          assignmentId ? `&assignmentId=${encodeURIComponent(assignmentId)}` : ""
        }`,
        { method: "DELETE" }
      );
      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || "Failed to withdraw report.");
      }
      setStatus("draft");
      setShowWithdrawModal(false);
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : "Failed to withdraw report.");
    } finally {
      setIsWithdrawing(false);
    }
  }

  const isReadOnly = status === "submitted" || status === "reviewed";

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
      {/* =========================================================================
          1. INTRODUCTORY HEADER & TOOLBAR (Continuous white document header)
          ========================================================================= */}
      <div className="p-5 sm:p-6 border-b border-slate-200 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <span className="size-8 rounded-lg bg-[#E6F2F5] text-[#087F8C] flex items-center justify-center shrink-0">
                <BookOpen className="size-4.5" />
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-[#142D40] tracking-tight">
                My Lab Notebook
              </h2>
              {/* Report status badge */}
              {status === "reviewed" ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  <CheckCircle2 className="size-3" />
                  <span>Reviewed</span>
                </span>
              ) : status === "submitted" ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800 border border-sky-200">
                  <Clock className="size-3" />
                  <span>Submitted</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-[#536574] border border-slate-200">
                  <Save className="size-3" />
                  <span>Draft</span>
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-[#536574]">
              Record and organize your experiment following the scientific process.
            </p>
          </div>

          {/* Right: Autosave status & Action buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Real Autosave Status Indicator */}
            <div className="text-[11px] px-3 py-1.5 rounded-lg border flex items-center gap-1.5 bg-[#F8F7F4] border-slate-200 text-[#536574]">
              {saveState === "saving" && (
                <>
                  <span className="size-2 rounded-full bg-amber-500 animate-ping" />
                  <span>Saving...</span>
                </>
              )}
              {saveState === "saved" && (
                <>
                  <Check className="size-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-medium">Saved to cloud</span>
                  {lastSavedTime && <span className="text-slate-400">· {lastSavedTime}</span>}
                </>
              )}
              {saveState === "unsaved" && (
                <>
                  <span className="size-2 rounded-full bg-amber-500" />
                  <span className="text-amber-700 font-medium">Unsaved changes</span>
                </>
              )}
              {saveState === "offline" && (
                <>
                  <Check className="size-3.5 text-slate-500" />
                  <span>Saved locally</span>
                </>
              )}
            </div>

            {/* Teacher Notes Button (if shared by teacher) */}
            {teacherShares.length > 0 && (
              <button
                type="button"
                onClick={() => setIsTeacherNotesOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#E6F2F5] hover:bg-[#d8ebf0] border border-[#087F8C]/20 text-xs font-semibold text-[#087F8C] transition-colors shadow-2xs cursor-pointer"
              >
                <BookOpen className="size-3.5 text-[#087F8C]" />
                <span>
                  {locale === "ru"
                    ? "Заметки учителя"
                    : locale === "ky"
                    ? "Мугалимдин жазуулары"
                    : "Teacher Notes"}
                </span>
              </button>
            )}

            {/* Manual Save Draft Button */}
            {!isReadOnly && (
              <button
                type="button"
                onClick={() => void performSave()}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-xs font-semibold text-[#142D40] transition-colors cursor-pointer"
              >
                <Save className="size-3.5 text-[#087F8C]" />
                <span>Save Draft</span>
              </button>
            )}

            {/* Delete Draft Button (when editing a draft) */}
            {!isReadOnly && Boolean(aim || hypothesis || procedureSteps.length > 0 || observations || conclusion) && (
              <button
                type="button"
                onClick={() => setShowDeleteModal(true)}
                title="Delete draft"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-200 text-xs font-semibold text-[#536574] hover:text-rose-700 transition-colors cursor-pointer"
              >
                <Trash2 className="size-3.5" />
                <span>{locale === "ky" ? "Черновикти өчүрүү" : locale === "ru" ? "Удалить черновик" : "Delete Draft"}</span>
              </button>
            )}

            {/* Withdraw Submission Button (if submitted but not yet reviewed) */}
            {status === "submitted" && (
              <button
                type="button"
                onClick={() => setShowWithdrawModal(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-xs font-semibold text-[#142D40] transition-colors cursor-pointer"
              >
                <RotateCcw className="size-3.5 text-[#087F8C]" />
                <span>{locale === "ky" ? "Кайтарып алуу" : locale === "ru" ? "Отозвать отчет" : "Withdraw Submission"}</span>
              </button>
            )}

            {/* Submit to Teacher Button (students only) */}
            {!isReadOnly && user?.role !== "teacher" && (
              <button
                type="button"
                onClick={handleSubmitReport}
                disabled={isSubmitting}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#087F8C] hover:bg-[#066670] disabled:bg-slate-300 text-white text-xs font-semibold transition-colors shadow-2xs cursor-pointer"
              >
                <Send className="size-3.5" />
                <span>{isSubmitting ? "Submitting..." : "Submit to Teacher"}</span>
              </button>
            )}
          </div>
        </div>

        {/* Mode Selector Strip */}
        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[#142D40]">Investigation Mode:</span>
            <div className="inline-flex p-1 rounded-xl bg-[#F8F7F4] border border-slate-200/80 gap-1">
              <button
                type="button"
                disabled={isReadOnly}
                onClick={() => {
                  setMode("video_observation");
                  triggerAutosave();
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${
                  mode === "video_observation"
                    ? "bg-white text-[#142D40] shadow-xs border border-slate-200/60"
                    : "text-[#536574] hover:text-[#142D40]"
                }`}
              >
                <Video className="size-3.5 text-[#087F8C]" />
                <span>Video Observation</span>
              </button>
              <button
                type="button"
                disabled={isReadOnly}
                onClick={() => {
                  setMode("supervised_lab");
                  triggerAutosave();
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${
                  mode === "supervised_lab"
                    ? "bg-white text-[#142D40] shadow-xs border border-slate-200/60"
                    : "text-[#536574] hover:text-[#142D40]"
                }`}
              >
                <FlaskConical className="size-3.5 text-[#087F8C]" />
                <span>Supervised Practical Lab</span>
              </button>
            </div>
          </div>

          <div className="text-[#536574]">
            Experiment: <span className="font-semibold text-[#142D40]">{experiment.title[locale]}</span>
          </div>
        </div>

        {/* Teacher Feedback Callout (if reviewed) */}
        {teacherFeedback && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/90 p-4 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                <MessageSquare className="size-4 text-emerald-700" />
                Teacher Evaluation & Feedback
              </span>
              {reviewedByName && <span className="text-xs text-slate-600">{reviewedByName}</span>}
              {reviewedAt && (
                <span className="text-[10px] text-emerald-700 font-medium">
                  {new Date(reviewedAt).toLocaleDateString()}
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-emerald-900 whitespace-pre-wrap leading-relaxed">
              &quot;{teacherFeedback}&quot;
            </p>
          </div>
        )}

        {/* Unauthenticated notice */}
        {!user && (
          <div className="rounded-xl border border-amber-200 bg-amber-50/80 p-3.5 text-xs text-amber-900 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="size-4 text-amber-700 shrink-0" />
              <span>You are viewing this notebook as a guest. Changes are saved to this browser.</span>
            </div>
            <Link
              href={`/${locale}/login`}
              className="font-bold underline text-amber-900 hover:text-amber-950 shrink-0"
            >
              Sign In to Sync
            </Link>
          </div>
        )}

        {errorMessage && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700 flex items-center gap-2">
            <AlertCircle className="size-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {submitSuccess && (
          <div className="rounded-xl border border-sky-200 bg-sky-50 p-3 text-xs text-sky-800 flex items-center gap-2">
            <Check className="size-4 shrink-0" />
            <span>Your laboratory report has been submitted to your teacher for review!</span>
          </div>
        )}
      </div>

      {/* =========================================================================
          2. VERTICAL TIMELINE WITH 4 NUMBERED EXPANDABLE STAGES (Continuous Document)
          ========================================================================= */}
      <div className="relative pl-12 sm:pl-16 pr-4 sm:pr-6 py-2">
        {/* The thin vertical connecting teal timeline line */}
        <div className="absolute left-[24px] sm:left-[32px] top-6 bottom-6 w-0.5 bg-[#087F8C]/25" />

        {/* -----------------------------------------------------------------------
            STAGE 1: AIM & HYPOTHESIS
            ----------------------------------------------------------------------- */}
        <div className="relative border-b border-slate-200/70 py-1">
          {/* Numbered circle marker on timeline */}
          <div className="absolute -left-[38px] sm:-left-[48px] top-4.5 size-7 sm:size-8 rounded-full bg-[#142D40] text-white font-bold text-xs sm:text-sm flex items-center justify-center border-2 border-white shadow-xs z-10">
            1
          </div>

          <button
            type="button"
            onClick={() => toggleStage("aim")}
            className="w-full py-4 px-2 sm:px-3 flex items-center justify-between gap-3 text-left hover:bg-slate-50/70 transition-colors cursor-pointer select-none rounded-lg"
            aria-expanded={expandedStages.aim}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="size-8 sm:size-9 rounded-lg bg-[#E6F2F5] text-[#087F8C] flex items-center justify-center shrink-0">
                <Target className="size-4 sm:size-4.5" />
              </div>
              <div className="min-w-0">
                <h3 className="text-base sm:text-lg font-bold text-[#142D40] leading-snug">
                  1 — Aim & Hypothesis
                </h3>
                <p className="text-xs text-[#536574] truncate">
                  Define the objective, scientific question, and predicted outcome.
                </p>
              </div>
            </div>
            <div className="size-8 rounded-lg flex items-center justify-center text-[#536574] shrink-0">
              <ChevronDown
                className={`size-4.5 transition-transform duration-200 ${
                  expandedStages.aim ? "rotate-180" : ""
                }`}
              />
            </div>
          </button>

          {expandedStages.aim && (
            <div className="px-2 sm:px-3 pb-6 pt-1 space-y-4 animate-in fade-in duration-150">
              <div className="space-y-1.5 pt-2">
                <label className="text-xs font-bold text-[#142D40] block">
                  Aim of the Experiment
                </label>
                <textarea
                  rows={2}
                  disabled={isReadOnly}
                  value={aim}
                  onChange={(e) => {
                    setAim(e.target.value);
                    triggerAutosave();
                  }}
                  placeholder="What is the scientific purpose of this reaction? (e.g. To observe the decomposition rate of hydrogen peroxide when catalyzed by KI...)"
                  className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-200 bg-[#F8F7F4]/60 text-[#142D40] focus:outline-hidden focus:ring-2 focus:ring-[#087F8C] focus:bg-white resize-y"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#142D40] block">
                  Research Question
                </label>
                <input
                  type="text"
                  disabled={isReadOnly}
                  value={researchQuestion}
                  onChange={(e) => {
                    setResearchQuestion(e.target.value);
                    triggerAutosave();
                  }}
                  placeholder="e.g. How does adding a catalyst alter the decomposition activation energy and rate?"
                  className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-200 bg-[#F8F7F4]/60 text-[#142D40] focus:outline-hidden focus:ring-2 focus:ring-[#087F8C] focus:bg-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#142D40] block">
                  Hypothesis & Prediction
                </label>
                <textarea
                  rows={3}
                  disabled={isReadOnly}
                  value={hypothesis}
                  onChange={(e) => {
                    setHypothesis(e.target.value);
                    triggerAutosave();
                  }}
                  placeholder="Formulate your testable hypothesis. If [reactant/condition], then [expected chemical outcome] because [chemical principle]..."
                  className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-200 bg-[#F8F7F4]/60 text-[#142D40] focus:outline-hidden focus:ring-2 focus:ring-[#087F8C] focus:bg-white resize-y"
                />
              </div>
            </div>
          )}
        </div>

        {/* -----------------------------------------------------------------------
            STAGE 2: MY PROCEDURE
            ----------------------------------------------------------------------- */}
        <div className="relative border-b border-slate-200/70 py-1">
          {/* Numbered circle marker on timeline */}
          <div className="absolute -left-[38px] sm:-left-[48px] top-4.5 size-7 sm:size-8 rounded-full bg-[#142D40] text-white font-bold text-xs sm:text-sm flex items-center justify-center border-2 border-white shadow-xs z-10">
            2
          </div>

          <button
            type="button"
            onClick={() => toggleStage("procedure")}
            className="w-full py-4 px-2 sm:px-3 flex items-center justify-between gap-3 text-left hover:bg-slate-50/70 transition-colors cursor-pointer select-none rounded-lg"
            aria-expanded={expandedStages.procedure}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="size-8 sm:size-9 rounded-lg bg-[#E6F2F5] text-[#087F8C] flex items-center justify-center shrink-0">
                <ListOrdered className="size-4 sm:size-4.5" />
              </div>
              <div className="min-w-0">
                <h3 className="text-base sm:text-lg font-bold text-[#142D40] leading-snug">
                  2 — My Procedure
                </h3>
                <p className="text-xs text-[#536574] truncate">
                  Outline the sequential steps followed during the investigation.
                </p>
              </div>
            </div>
            <div className="size-8 rounded-lg flex items-center justify-center text-[#536574] shrink-0">
              <ChevronDown
                className={`size-4.5 transition-transform duration-200 ${
                  expandedStages.procedure ? "rotate-180" : ""
                }`}
              />
            </div>
          </button>

          {expandedStages.procedure && (
            <div className="px-2 sm:px-3 pb-6 pt-1 space-y-4 animate-in fade-in duration-150">
              <div className="pt-2 flex items-center justify-between">
                <span className="text-xs font-semibold text-[#536574]">
                  {procedureSteps.length} {procedureSteps.length === 1 ? "step" : "steps"} documented
                </span>
                {!isReadOnly && (
                  <button
                    type="button"
                    onClick={addProcedureStep}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#087F8C] hover:bg-[#066670] text-white text-xs font-semibold transition-colors cursor-pointer shadow-2xs"
                  >
                    <Plus className="size-3.5" />
                    <span>Add Step</span>
                  </button>
                )}
              </div>

              {procedureSteps.length === 0 ? (
                <div className="p-6 text-center rounded-xl border border-dashed border-slate-200 bg-[#F8F7F4]/50 space-y-2">
                  <p className="text-xs font-semibold text-[#142D40]">No steps added yet</p>
                  <p className="text-[11px] text-[#536574] max-w-sm mx-auto">
                    Click &quot;Add Step&quot; above to record the sequential actions you took or observed during the experiment.
                  </p>
                  {!isReadOnly && (
                    <button
                      type="button"
                      onClick={addProcedureStep}
                      className="inline-flex items-center gap-1 text-xs text-[#087F8C] font-bold hover:underline cursor-pointer pt-1"
                    >
                      <Plus className="size-3.5" />
                      <span>Create Step 1</span>
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  {procedureSteps.map((step, idx) => (
                    <div
                      key={step.id}
                      className="p-3.5 rounded-xl border border-slate-200 bg-[#F8F7F4]/40 flex items-start gap-3"
                    >
                      <div className="size-6 rounded-lg bg-[#142D40] text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </div>

                      <div className="flex-1 space-y-2">
                        <textarea
                          rows={2}
                          disabled={isReadOnly}
                          value={step.text}
                          onChange={(e) => updateStepText(step.id, e.target.value)}
                          placeholder={`Describe action for step ${idx + 1}...`}
                          className="w-full text-xs sm:text-sm p-2.5 rounded-lg border border-slate-200 bg-white text-[#142D40] focus:outline-hidden focus:ring-2 focus:ring-[#087F8C] resize-y"
                        />

                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-semibold text-[#536574]">Source:</span>
                            <button
                              type="button"
                              disabled={isReadOnly}
                              onClick={() =>
                                updateStepSource(
                                  step.id,
                                  step.source === "personally_performed"
                                    ? "video_observation"
                                    : "personally_performed"
                                )
                              }
                              className={`text-[10px] font-semibold px-2 py-0.5 rounded border transition-colors cursor-pointer ${
                                step.source === "personally_performed"
                                  ? "bg-teal-50 border-teal-200 text-[#087F8C]"
                                  : "bg-slate-100 border-slate-200 text-[#536574]"
                              }`}
                            >
                              {step.source === "personally_performed"
                                ? "Personally performed"
                                : "Video observation"}
                            </button>
                          </div>

                          {!isReadOnly && (
                            <button
                              type="button"
                              onClick={() => removeProcedureStep(step.id)}
                              className="text-slate-400 hover:text-rose-600 p-1 rounded transition-colors cursor-pointer"
                              title="Delete step"
                            >
                              <Trash2 className="size-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* -----------------------------------------------------------------------
            STAGE 3: OBSERVATIONS
            ----------------------------------------------------------------------- */}
        <div className="relative border-b border-slate-200/70 py-1">
          {/* Numbered circle marker on timeline */}
          <div className="absolute -left-[38px] sm:-left-[48px] top-4.5 size-7 sm:size-8 rounded-full bg-[#142D40] text-white font-bold text-xs sm:text-sm flex items-center justify-center border-2 border-white shadow-xs z-10">
            3
          </div>

          <button
            type="button"
            onClick={() => toggleStage("observations")}
            className="w-full py-4 px-2 sm:px-3 flex items-center justify-between gap-3 text-left hover:bg-slate-50/70 transition-colors cursor-pointer select-none rounded-lg"
            aria-expanded={expandedStages.observations}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="size-8 sm:size-9 rounded-lg bg-[#E6F2F5] text-[#087F8C] flex items-center justify-center shrink-0">
                <Eye className="size-4 sm:size-4.5" />
              </div>
              <div className="min-w-0">
                <h3 className="text-base sm:text-lg font-bold text-[#142D40] leading-snug">
                  3 — Observations
                </h3>
                <p className="text-xs text-[#536574] truncate">
                  Document sensory changes, gas evolution, color transitions, and measurements.
                </p>
              </div>
            </div>
            <div className="size-8 rounded-lg flex items-center justify-center text-[#536574] shrink-0">
              <ChevronDown
                className={`size-4.5 transition-transform duration-200 ${
                  expandedStages.observations ? "rotate-180" : ""
                }`}
              />
            </div>
          </button>

          {expandedStages.observations && (
            <div className="px-2 sm:px-3 pb-6 pt-1 space-y-4 animate-in fade-in duration-150">
              {/* Quick Scientific Observation Helper Chips */}
              <div className="pt-2 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#142D40]">
                  <Sparkles className="size-3.5 text-[#087F8C]" />
                  <span>Quick Observation Helper (click to insert):</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Color change / transition",
                    "Gas evolution / Bubbling",
                    "Temperature rise / Heat",
                    "Precipitate formed",
                    "Smell / Odor noted",
                    "No visible reaction",
                  ].map((chip) => (
                    <button
                      key={chip}
                      type="button"
                      disabled={isReadOnly}
                      onClick={() => {
                        const appendText = observations ? `${observations}\n• ${chip}: ` : `• ${chip}: `;
                        setObservations(appendText);
                        triggerAutosave();
                      }}
                      className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-[#F8F7F4] hover:bg-[#E6F2F5] text-[#142D40] hover:text-[#087F8C] border border-slate-200 transition-colors cursor-pointer"
                    >
                      + {chip}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#142D40] block">
                  Detailed Experimental Notes
                </label>
                <textarea
                  rows={5}
                  disabled={isReadOnly}
                  value={observations}
                  onChange={(e) => {
                    setObservations(e.target.value);
                    triggerAutosave();
                  }}
                  placeholder="Record qualitative macroscopic observations: initial appearance, reaction initiation, bubbling intensity, color sequence, precipitate sedimentation, and heat emitted..."
                  className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-200 bg-[#F8F7F4]/60 text-[#142D40] focus:outline-hidden focus:ring-2 focus:ring-[#087F8C] focus:bg-white resize-y leading-relaxed"
                />
              </div>
            </div>
          )}
        </div>

        {/* -----------------------------------------------------------------------
            STAGE 4: CONCLUSION / RESULTS
            ----------------------------------------------------------------------- */}
        <div className="relative border-b border-slate-200/70 last:border-b-0 py-1">
          {/* Numbered circle marker on timeline */}
          <div className="absolute -left-[38px] sm:-left-[48px] top-4.5 size-7 sm:size-8 rounded-full bg-[#142D40] text-white font-bold text-xs sm:text-sm flex items-center justify-center border-2 border-white shadow-xs z-10">
            4
          </div>

          <button
            type="button"
            onClick={() => toggleStage("conclusion")}
            className="w-full py-4 px-2 sm:px-3 flex items-center justify-between gap-3 text-left hover:bg-slate-50/70 transition-colors cursor-pointer select-none rounded-lg"
            aria-expanded={expandedStages.conclusion}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="size-8 sm:size-9 rounded-lg bg-[#E6F2F5] text-[#087F8C] flex items-center justify-center shrink-0">
                <FileCheck2 className="size-4 sm:size-4.5" />
              </div>
              <div className="min-w-0">
                <h3 className="text-base sm:text-lg font-bold text-[#142D40] leading-snug">
                  4 — Conclusion / Results
                </h3>
                <p className="text-xs text-[#536574] truncate">
                  Analyze results, test hypothesis validity, and explain chemical mechanisms.
                </p>
              </div>
            </div>
            <div className="size-8 rounded-lg flex items-center justify-center text-[#536574] shrink-0">
              <ChevronDown
                className={`size-4.5 transition-transform duration-200 ${
                  expandedStages.conclusion ? "rotate-180" : ""
                }`}
              />
            </div>
          </button>

          {expandedStages.conclusion && (
            <div className="px-2 sm:px-3 pb-6 pt-1 space-y-4 animate-in fade-in duration-150">
              <div className="space-y-1.5 pt-2">
                <label className="text-xs font-bold text-[#142D40] block">
                  Results & Quantitative Data
                </label>
                <textarea
                  rows={3}
                  disabled={isReadOnly}
                  value={results}
                  onChange={(e) => {
                    setResults(e.target.value);
                    triggerAutosave();
                  }}
                  placeholder="Record numerical data, reaction duration, volume of gas collected, temperature differences, or final synthesized mass..."
                  className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-200 bg-[#F8F7F4]/60 text-[#142D40] focus:outline-hidden focus:ring-2 focus:ring-[#087F8C] focus:bg-white resize-y"
                />
              </div>

              {/* Guided Reflection Prompts Helper */}
              <div className="p-3.5 rounded-xl bg-[#E6F2F5]/60 border border-[#087F8C]/20 text-xs text-[#142D40] space-y-1">
                <div className="font-bold text-[#087F8C] flex items-center gap-1.5">
                  <HelpCircle className="size-3.5" />
                  <span>Guiding Reflection Questions:</span>
                </div>
                <ul className="list-disc list-inside text-[#536574] space-y-0.5 text-[11px] leading-relaxed">
                  <li>Was your original hypothesis supported or refuted by the observations?</li>
                  <li>What core chemical concepts or mechanisms explain this behavior?</li>
                  <li>Were there any sources of experimental error, heat dissipation, or side reactions?</li>
                  <li>What key takeaway will you apply to future chemistry practicals?</li>
                </ul>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#142D40] block">
                  Scientific Conclusion & Reflection
                </label>
                <textarea
                  rows={4}
                  disabled={isReadOnly}
                  value={conclusion}
                  onChange={(e) => {
                    setConclusion(e.target.value);
                    triggerAutosave();
                  }}
                  placeholder="Summarize your final deduction: connect your observations back to chemical reaction principles and the initial hypothesis..."
                  className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-200 bg-[#F8F7F4]/60 text-[#142D40] focus:outline-hidden focus:ring-2 focus:ring-[#087F8C] focus:bg-white resize-y leading-relaxed"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Draft Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full p-6 shadow-2xl relative space-y-4">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                <Trash2 className="size-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#142D40]">
                  {locale === "ky" ? "Черновикти өчүрүүнү каалайсызбы?" : locale === "ru" ? "Удалить черновик отчета?" : "Delete Lab Report Draft?"}
                </h3>
                <p className="text-xs text-[#536574] mt-0.5">
                  {locale === "ky"
                    ? "Бул тажрыйба боюнча жазылган бардык гипотеза, кадамдар жана жыйынтыктар өчүрүлөт."
                    : locale === "ru"
                    ? "Все введенные цели, гипотезы, шаги и наблюдения для этого эксперимента будут безвозвратно удалены."
                    : "This will remove your draft aim, hypothesis, steps, and observations for this experiment."}
                </p>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-[#536574] hover:bg-slate-100 transition-colors cursor-pointer"
              >
                {locale === "ky" ? "Жокко чыгаруу" : locale === "ru" ? "Отмена" : "Cancel"}
              </button>
              <button
                type="button"
                onClick={handleDeleteDraft}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:bg-rose-300 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                {isDeleting ? "Deleting..." : locale === "ky" ? "Өчүрүү" : locale === "ru" ? "Удалить черновик" : "Delete Draft"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Withdraw Submission Confirmation Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full p-6 shadow-2xl relative space-y-4">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-sky-50 text-[#087F8C] flex items-center justify-center shrink-0">
                <RotateCcw className="size-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#142D40]">
                  {locale === "ky" ? "Отчетту кайтарып алууну каалайсызбы?" : locale === "ru" ? "Отозвать отчет на доработку?" : "Withdraw Laboratory Report?"}
                </h3>
                <p className="text-xs text-[#536574] mt-0.5">
                  {locale === "ky"
                    ? "Сиздин отчетуңуз кайра черновикке айланат, мугалим текшере электе оңдоп чыксаңыз болот."
                    : locale === "ru"
                    ? "Отчет вернется в статус черновика, что позволит вам внести правки перед повторной отправкой преподавателю."
                    : "This will return your submitted report back to draft status so you can continue editing before your teacher reviews it."}
                </p>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setShowWithdrawModal(false)}
                disabled={isWithdrawing}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-[#536574] hover:bg-slate-100 transition-colors cursor-pointer"
              >
                {locale === "ky" ? "Жокко чыгаруу" : locale === "ru" ? "Отмена" : "Cancel"}
              </button>
              <button
                type="button"
                onClick={handleWithdrawReport}
                disabled={isWithdrawing}
                className="px-4 py-2 rounded-xl bg-[#087F8C] hover:bg-[#066670] disabled:bg-slate-300 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                {isWithdrawing ? "Withdrawing..." : locale === "ky" ? "Кайтарып алуу" : locale === "ru" ? "Отозвать в черновик" : "Withdraw to Draft"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Published Teacher Notes Modal */}
      <TeacherNotesViewerModal
        isOpen={isTeacherNotesOpen}
        onClose={() => setIsTeacherNotesOpen(false)}
        shares={teacherShares}
        experimentTitle={experiment.title[locale]}
        locale={locale}
        isPreviewMode={false}
      />
    </div>
  );
}
