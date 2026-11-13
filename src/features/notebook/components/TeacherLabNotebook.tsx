"use client";

import { createWriteQueue } from "../write-queue";
import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  BookOpen,
  FlaskConical,
  Video,
  CheckCircle2,
  Save,
  Plus,
  Trash2,
  Lock,
  Share2,
  Eye,
  ChevronDown,
  Check,
  Target,
  ListOrdered,
  FileCheck2,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import type { Experiment } from "@/features/experiments/types";
import type { Locale } from "@/i18n/config";
import { useAuthStore } from "@/features/auth/auth-store";
import { TEACHER_NOTEBOOK_DICTIONARY } from "../notebook-dictionary";
import type {
  LabReportMode,
  LabProcedureStep,
  TeacherLabNotebook as ITeacherLabNotebook,
  TeacherNotebookShare,
  TeacherNotebookSaveInput,
} from "../types";
import { ShareWithClassModal } from "./ShareWithClassModal";
import { TeacherNotesViewerModal } from "./TeacherNotesViewerModal";

interface TeacherLabNotebookProps {
  experiment: Experiment;
  locale: Locale;
}

export function TeacherLabNotebook({
  experiment,
  locale,
}: TeacherLabNotebookProps) {
  const { user } = useAuthStore();
  const dict = TEACHER_NOTEBOOK_DICTIONARY[locale];

  // Fields state
  const [mode, setMode] = useState<LabReportMode>("video_observation");
  const [aim, setAim] = useState("");
  const [researchQuestion, setResearchQuestion] = useState("");
  const [hypothesis, setHypothesis] = useState("");
  const [procedureSteps, setProcedureSteps] = useState<LabProcedureStep[]>([]);
  const [expectedObservations, setExpectedObservations] = useState("");
  const [actualObservations, setActualObservations] = useState("");
  const [measurements, setMeasurements] = useState("");
  const [explanatoryNotes, setExplanatoryNotes] = useState("");
  const [results, setResults] = useState("");
  const [conclusion, setConclusion] = useState("");
  const [teachingGuidance, setTeachingGuidance] = useState("");
  const [status, setStatus] = useState<"draft" | "published">("draft");
  const [shares, setShares] = useState<TeacherNotebookShare[]>([]);

  // UI & Autosave state
  const [saveState, setSaveState] = useState<"saved" | "saving" | "unsaved" | "offline">("saved");
  const [lastSavedTime, setLastSavedTime] = useState<string | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Content management modals
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showStopSharingModal, setShowStopSharingModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isStoppingSharing, setIsStoppingSharing] = useState(false);

  // Accordion state (all collapsed by default)
  const [expandedStages, setExpandedStages] = useState<Record<string, boolean>>({
    aim: false,
    procedure: false,
    observations: false,
    conclusion: false,
  });

  const toggleStage = (key: string) => {
    setExpandedStages((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const initialLoadDone = useRef(false);
  const saveQueue = useRef(createWriteQueue());
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const storageKey = `chemlab_teacher_nb_${user?.id || "demo"}_${experiment.slug}`;

  // 1. Initial Load: Fetch from API or localStorage
  useEffect(() => {
    let active = true;

    async function loadNotebook() {
      // Try local storage cache first
      try {
        const cached = localStorage.getItem(storageKey);
        if (cached) {
          const data = JSON.parse(cached);
          if (active && data) populateForm(data);
        }
      } catch {}

      // Fetch latest from API
      try {
        const res = await fetch(`/api/notebook/teacher?slug=${encodeURIComponent(experiment.slug)}`);
        if (res.ok) {
          const json = await res.json();
          if (active) {
            if (json.notebook) {
              populateForm(json.notebook);
            }
            if (json.shares) {
              setShares(json.shares);
            }
            initialLoadDone.current = true;
            return;
          }
        }
      } catch (err) {
        console.warn("[Teacher Notebook] API fetch error:", err);
      }

      initialLoadDone.current = true;
    }

    function populateForm(nb: ITeacherLabNotebook) {
      setMode(nb.mode || "video_observation");
      setAim(nb.aim || "");
      setResearchQuestion(nb.researchQuestion || "");
      setHypothesis(nb.hypothesis || "");
      setProcedureSteps(nb.procedureSteps || []);
      setExpectedObservations(nb.expectedObservations || "");
      setActualObservations(nb.actualObservations || "");
      setMeasurements(nb.measurements || "");
      setExplanatoryNotes(nb.explanatoryNotes || "");
      setResults(nb.results || "");
      setConclusion(nb.conclusion || "");
      setTeachingGuidance(nb.teachingGuidance || "");
      setStatus(nb.status || "draft");
      if (nb.updatedAt) {
        setLastSavedTime(
          new Date(nb.updatedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        );
      }
    }

    void loadNotebook();

    return () => {
      active = false;
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, [experiment.slug, storageKey]);

  // 2. Perform Save
  const performSave = useCallback(async () => {
    if (!initialLoadDone.current) return false;

    const payload: TeacherNotebookSaveInput = {
      experimentSlug: experiment.slug,
      mode,
      aim,
      researchQuestion,
      hypothesis,
      procedureSteps,
      expectedObservations,
      actualObservations,
      measurements,
      explanatoryNotes,
      results,
      conclusion,
      teachingGuidance,
      status,
    };

    // Cache locally
    try {
      localStorage.setItem(
        storageKey,
        JSON.stringify({
          ...payload,
          id: `cached-${Date.now()}`,
          teacherId: user?.id || "demo",
          updatedAt: new Date().toISOString(),
        })
      );
    } catch {}

    setSaveState("saving");

    try {
      const res = await saveQueue.current(() => fetch("/api/notebook/teacher", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }));

      if (!res.ok) throw new Error("Server rejected notebook save");

      const json = await res.json();
      setSaveState("saved");
      setLastSavedTime(
        new Date(json.notebook.updatedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      );
      return true;
    } catch (err) {
      console.warn("[Teacher Notebook] Autosave offline:", err);
      setSaveState("offline");
      return false;
    }
  }, [
    initialLoadDone,
    experiment.slug,
    mode,
    aim,
    researchQuestion,
    hypothesis,
    procedureSteps,
    expectedObservations,
    actualObservations,
    measurements,
    explanatoryNotes,
    results,
    conclusion,
    teachingGuidance,
    status,
    user,
    storageKey,
  ]);

  const latestSave = useRef(performSave);
  useEffect(() => { latestSave.current = performSave; }, [performSave]);

  // 3. Debounced Autosave Trigger
  const triggerAutosave = useCallback(() => {
    if (!initialLoadDone.current) return;
    setSaveState("unsaved");
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => {
      void latestSave.current();
    }, 1500);
  }, []);

  // Delete Teacher Draft
  async function handleDeleteDraft() {
    setIsDeleting(true);
    setErrorMessage(null);
    try {
      const res = await fetch(`/api/notebook/teacher?slug=${encodeURIComponent(experiment.slug)}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || "Failed to delete teacher notes.");
      }
      if (typeof window !== "undefined") {
        localStorage.removeItem(storageKey);
      }
      setAim("");
      setResearchQuestion("");
      setHypothesis("");
      setProcedureSteps([]);
      setExpectedObservations("");
      setActualObservations("");
      setMeasurements("");
      setExplanatoryNotes("");
      setResults("");
      setConclusion("");
      setTeachingGuidance("");
      setStatus("draft");
      setShares([]);
      setShowDeleteModal(false);
      setSaveState("saved");
      setLastSavedTime(null);
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : "Failed to delete teacher notes.");
    } finally {
      setIsDeleting(false);
    }
  }

  // Stop Sharing across all classrooms
  async function handleStopSharingAll() {
    setIsStoppingSharing(true);
    setErrorMessage(null);
    try {
      const res = await fetch(
        `/api/notebook/teacher/share?slug=${encodeURIComponent(experiment.slug)}&all=true`,
        { method: "DELETE" }
      );
      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || "Failed to revoke sharing.");
      }
      setShares([]);
      setStatus("draft");
      setShowStopSharingModal(false);
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : "Failed to stop sharing.");
    } finally {
      setIsStoppingSharing(false);
    }
  }

  // Step Management
  const addStep = () => {
    const nextNumber = procedureSteps.length + 1;
    const newStep: LabProcedureStep = {
      id: `step-${Date.now()}-${nextNumber}`,
      stepNumber: nextNumber,
      text: "",
      source: mode === "supervised_lab" ? "personally_performed" : "video_observation",
    };
    setProcedureSteps([...procedureSteps, newStep]);
    triggerAutosave();
  };

  const updateStepText = (id: string, text: string) => {
    setProcedureSteps((prev) =>
      prev.map((s) => (s.id === id ? { ...s, text } : s))
    );
    triggerAutosave();
  };

  const removeStep = (id: string) => {
    const remaining = procedureSteps.filter((s) => s.id !== id);
    const renumbered = remaining.map((s, idx) => ({ ...s, stepNumber: idx + 1 }));
    setProcedureSteps(renumbered);
    triggerAutosave();
  };

  const moveStep = (index: number, direction: "up" | "down") => {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === procedureSteps.length - 1)
    ) {
      return;
    }
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    const copy = [...procedureSteps];
    const [moved] = copy.splice(index, 1);
    copy.splice(targetIndex, 0, moved);
    const renumbered = copy.map((s, idx) => ({ ...s, stepNumber: idx + 1 }));
    setProcedureSteps(renumbered);
    triggerAutosave();
  };

  // Preview snapshot generator based on current shares or draft
  const previewSnapshot = {
    aim,
    researchQuestion,
    hypothesis,
    procedureSteps,
    expectedObservations,
    actualObservations,
    measurements,
    explanatoryNotes,
    results,
    conclusion,
  };

  const previewShares: TeacherNotebookShare[] = shares.length > 0
    ? shares
    : [
        {
          id: "preview-share",
          notebookId: "preview",
          teacherId: user?.id || "teacher",
          teacherName: user?.name || "Teacher",
          classroomId: "preview-class",
          classroomName: "Preview Class",
          experimentSlug: experiment.slug,
          sharedSections: ["aim_hypothesis", "procedure", "observations", "conclusion"],
          publishedSnapshot: previewSnapshot,
          version: 1,
          publishedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
      {errorMessage && <p role="alert" className="m-5 rounded-xl bg-red-50 p-4 text-sm text-red-800">{errorMessage}</p>}
      {/* =========================================================================
          1. TEACHER NOTEBOOK HEADER (Continuous white document header)
          ========================================================================= */}
      <div className="p-5 sm:p-6 border-b border-slate-200 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Left: Title + Subtitle + Badges */}
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="size-9 rounded-xl bg-[#E6F2F5] text-[#087F8C] flex items-center justify-center shrink-0">
                <BookOpen className="size-5" />
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#142D40] tracking-tight">
                {dict.notebookTitle}
              </h2>

              {/* Status Badges */}
              {status === "published" ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <CheckCircle2 className="size-3" />
                  <span>{dict.status.published}</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-[#536574] border border-slate-200">
                  <Save className="size-3" />
                  <span>{dict.status.privateDraft}</span>
                </span>
              )}

              {shares.length > 0 && (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#E6F2F5] text-[#087F8C] border border-[#087F8C]/20">
                  <Share2 className="size-3" />
                  <span>{dict.status.sharedWith(shares.length)}</span>
                </span>
              )}
            </div>

            <p className="text-xs sm:text-sm text-[#536574]">
              {dict.notebookSubtitle}
            </p>
          </div>

          {/* Right: Autosave Status & Teacher Actions */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Real Autosave Status Indicator */}
            <div className="text-[11px] px-3 py-1.5 rounded-lg border flex items-center gap-1.5 bg-[#F8F7F4] border-slate-200 text-[#536574]">
              {saveState === "saving" && (
                <>
                  <span className="size-2 rounded-full bg-amber-500 animate-ping" />
                  <span>{dict.actions.saving}</span>
                </>
              )}
              {saveState === "saved" && (
                <>
                  <Check className="size-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-medium">{dict.actions.saved}</span>
                  {lastSavedTime && <span className="text-slate-400">· {lastSavedTime}</span>}
                </>
              )}
              {saveState === "unsaved" && (
                <>
                  <span className="size-2 rounded-full bg-amber-500" />
                  <span className="text-amber-700 font-medium">{dict.actions.unsaved}</span>
                </>
              )}
              {saveState === "offline" && (
                <>
                  <Check className="size-3.5 text-slate-500" />
                  <span>{dict.actions.offline}</span>
                </>
              )}
            </div>

            {/* Save Notes Button */}
            <button
              type="button"
              onClick={() => void performSave()}
              className="cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-xs font-semibold text-[#142D40] transition-colors shadow-2xs"
            >
              <Save className="size-3.5 text-[#087F8C]" />
              <span>{dict.actions.saveNotes}</span>
            </button>

            {/* Share with Class Button */}
            <button
              type="button"
              onClick={async () => {
                if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
                if (await performSave()) setIsShareModalOpen(true);
                else setErrorMessage("Save your latest notes before sharing. Check your connection and retry.");
              }}
              className="cursor-pointer inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#087F8C] hover:bg-[#066670] text-white text-xs font-semibold transition-colors shadow-2xs"
            >
              <Share2 className="size-3.5" />
              <span>{dict.actions.shareWithClass}</span>
            </button>

            {/* Stop Sharing Button (if currently shared) */}
            {(status === "published" || shares.length > 0) && (
              <button
                type="button"
                onClick={() => setShowStopSharingModal(true)}
                className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-amber-50 border border-slate-200 hover:border-amber-200 text-xs font-semibold text-[#536574] hover:text-amber-800 transition-colors"
              >
                <span>{locale === "ky" ? "Бөлүшүүнү токтотуу" : locale === "ru" ? "Остановить доступ" : "Stop Sharing"}</span>
              </button>
            )}

            {/* Delete Draft Button */}
            {Boolean(aim || hypothesis || procedureSteps.length > 0 || expectedObservations || actualObservations || results || conclusion || teachingGuidance) && (
              <button
                type="button"
                onClick={() => setShowDeleteModal(true)}
                title="Delete teacher notes"
                className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-200 text-xs font-semibold text-[#536574] hover:text-rose-700 transition-colors"
              >
                <Trash2 className="size-3.5" />
                <span>{locale === "ky" ? "Жазууларды өчүрүү" : locale === "ru" ? "Удалить черновик" : "Delete Draft"}</span>
              </button>
            )}

            {/* Preview Student View Button */}
            <button
              type="button"
              onClick={() => setIsPreviewModalOpen(true)}
              className="cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#F8F7F4] hover:bg-slate-200/60 border border-slate-200 text-xs font-semibold text-[#142D40] transition-colors"
            >
              <Eye className="size-3.5 text-[#536574]" />
              <span>{dict.actions.previewStudentView}</span>
            </button>
          </div>
        </div>

        {/* Mode Selector Strip */}
        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[#142D40]">Investigation Protocol:</span>
            <div className="inline-flex p-1 rounded-xl bg-[#F8F7F4] border border-slate-200/80 gap-1">
              <button
                type="button"
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
      </div>

      {/* =========================================================================
          2. VERTICAL TIMELINE WITH 4 EXPANDABLE STAGES (Continuous Document)
          ========================================================================= */}
      <div className="relative pl-12 sm:pl-16 pr-4 sm:pr-6 py-2">
        {/* Connecting Teal Line */}
        <div className="absolute left-[24px] sm:left-[32px] top-6 bottom-6 w-0.5 bg-[#087F8C]/25" />

        {/* -----------------------------------------------------------------------
            STAGE 1: AIM & HYPOTHESIS
            ----------------------------------------------------------------------- */}
        <div className="relative border-b border-slate-200/70 py-1">
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
                  {dict.sections.aimHypothesis.title}
                </h3>
                <p className="text-xs text-[#536574] truncate">
                  {dict.sections.aimHypothesis.subtitle}
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
                  {dict.sections.aimHypothesis.aimLabel}
                </label>
                <textarea
                  rows={2}
                  value={aim}
                  onChange={(e) => {
                    setAim(e.target.value);
                    triggerAutosave();
                  }}
                  placeholder={dict.sections.aimHypothesis.aimPlaceholder}
                  className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-200 bg-[#F8F7F4]/60 text-[#142D40] focus:outline-hidden focus:ring-2 focus:ring-[#087F8C] focus:bg-white resize-y"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#142D40] block">
                  {dict.sections.aimHypothesis.questionLabel}
                </label>
                <input
                  type="text"
                  value={researchQuestion}
                  onChange={(e) => {
                    setResearchQuestion(e.target.value);
                    triggerAutosave();
                  }}
                  placeholder={dict.sections.aimHypothesis.questionPlaceholder}
                  className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-200 bg-[#F8F7F4]/60 text-[#142D40] focus:outline-hidden focus:ring-2 focus:ring-[#087F8C] focus:bg-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#142D40] block">
                  {dict.sections.aimHypothesis.hypothesisLabel}
                </label>
                <textarea
                  rows={2}
                  value={hypothesis}
                  onChange={(e) => {
                    setHypothesis(e.target.value);
                    triggerAutosave();
                  }}
                  placeholder={dict.sections.aimHypothesis.hypothesisPlaceholder}
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
                  {dict.sections.procedure.title}
                </h3>
                <p className="text-xs text-[#536574] truncate">
                  {dict.sections.procedure.subtitle}
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
              <div className="space-y-3 pt-2">
                {procedureSteps.length === 0 ? (
                  <div className="text-xs text-[#536574] p-4 rounded-xl bg-[#F8F7F4] border border-dashed border-slate-200 text-center">
                    {dict.sections.procedure.emptySteps}
                  </div>
                ) : (
                  procedureSteps.map((step, idx) => (
                    <div
                      key={step.id}
                      className="p-3.5 rounded-xl border border-slate-200 bg-[#F8F7F4]/40 space-y-2"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-[#142D40] flex items-center gap-1.5">
                          <span className="size-5 rounded-full bg-[#087F8C] text-white text-[10px] flex items-center justify-center">
                            {step.stepNumber}
                          </span>
                          Step {step.stepNumber}
                        </span>

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => moveStep(idx, "up")}
                            disabled={idx === 0}
                            className="size-7 rounded hover:bg-slate-200/60 disabled:opacity-30 text-[#536574] flex items-center justify-center cursor-pointer"
                            title="Move up"
                          >
                            <ArrowUp className="size-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => moveStep(idx, "down")}
                            disabled={idx === procedureSteps.length - 1}
                            className="size-7 rounded hover:bg-slate-200/60 disabled:opacity-30 text-[#536574] flex items-center justify-center cursor-pointer"
                            title="Move down"
                          >
                            <ArrowDown className="size-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => removeStep(step.id)}
                            className="size-7 rounded hover:bg-rose-50 text-rose-500 flex items-center justify-center cursor-pointer"
                            title="Remove step"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                      </div>

                      <textarea
                        rows={2}
                        value={step.text}
                        onChange={(e) => updateStepText(step.id, e.target.value)}
                        placeholder={dict.sections.procedure.stepPlaceholder}
                        className="w-full text-xs sm:text-sm p-2.5 rounded-lg border border-slate-200 bg-white text-[#142D40] focus:ring-1 focus:ring-[#087F8C] resize-y"
                      />
                    </div>
                  ))
                )}

                <button
                  type="button"
                  onClick={addStep}
                  className="w-full py-2.5 px-4 rounded-xl border border-dashed border-[#087F8C]/40 hover:border-[#087F8C] bg-[#E6F2F5]/40 text-[#087F8C] text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Plus className="size-4" />
                  <span>{dict.sections.procedure.addStep}</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* -----------------------------------------------------------------------
            STAGE 3: OBSERVATIONS
            ----------------------------------------------------------------------- */}
        <div className="relative border-b border-slate-200/70 py-1">
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
                  {dict.sections.observations.title}
                </h3>
                <p className="text-xs text-[#536574] truncate">
                  {dict.sections.observations.subtitle}
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
              <div className="space-y-1.5 pt-2">
                <label className="text-xs font-bold text-[#142D40] block">
                  {dict.sections.observations.expectedLabel}
                </label>
                <textarea
                  rows={2}
                  value={expectedObservations}
                  onChange={(e) => {
                    setExpectedObservations(e.target.value);
                    triggerAutosave();
                  }}
                  placeholder={dict.sections.observations.expectedPlaceholder}
                  className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-200 bg-[#F8F7F4]/60 text-[#142D40] focus:ring-2 focus:ring-[#087F8C] focus:bg-white resize-y"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#142D40] block">
                  {dict.sections.observations.actualLabel}
                </label>
                <textarea
                  rows={2}
                  value={actualObservations}
                  onChange={(e) => {
                    setActualObservations(e.target.value);
                    triggerAutosave();
                  }}
                  placeholder={dict.sections.observations.actualPlaceholder}
                  className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-200 bg-[#F8F7F4]/60 text-[#142D40] focus:ring-2 focus:ring-[#087F8C] focus:bg-white resize-y"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#142D40] block">
                    {dict.sections.observations.measurementsLabel}
                  </label>
                  <textarea
                    rows={2}
                    value={measurements}
                    onChange={(e) => {
                      setMeasurements(e.target.value);
                      triggerAutosave();
                    }}
                    placeholder={dict.sections.observations.measurementsPlaceholder}
                    className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-200 bg-[#F8F7F4]/60 font-mono text-[#142D40] focus:ring-2 focus:ring-[#087F8C] focus:bg-white resize-y"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#142D40] block">
                    {dict.sections.observations.explanatoryLabel}
                  </label>
                  <textarea
                    rows={2}
                    value={explanatoryNotes}
                    onChange={(e) => {
                      setExplanatoryNotes(e.target.value);
                      triggerAutosave();
                    }}
                    placeholder={dict.sections.observations.explanatoryPlaceholder}
                    className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-200 bg-[#F8F7F4]/60 text-[#142D40] focus:ring-2 focus:ring-[#087F8C] focus:bg-white resize-y"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* -----------------------------------------------------------------------
            STAGE 4: CONCLUSION & RESULTS
            ----------------------------------------------------------------------- */}
        <div className="relative border-b border-slate-200/70 last:border-b-0 py-1">
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
                  {dict.sections.conclusion.title}
                </h3>
                <p className="text-xs text-[#536574] truncate">
                  {dict.sections.conclusion.subtitle}
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
                  {dict.sections.conclusion.resultsLabel}
                </label>
                <textarea
                  rows={2}
                  value={results}
                  onChange={(e) => {
                    setResults(e.target.value);
                    triggerAutosave();
                  }}
                  placeholder={dict.sections.conclusion.resultsPlaceholder}
                  className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-200 bg-[#F8F7F4]/60 text-[#142D40] focus:ring-2 focus:ring-[#087F8C] focus:bg-white resize-y"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#142D40] block">
                  {dict.sections.conclusion.conclusionLabel}
                </label>
                <textarea
                  rows={3}
                  value={conclusion}
                  onChange={(e) => {
                    setConclusion(e.target.value);
                    triggerAutosave();
                  }}
                  placeholder={dict.sections.conclusion.conclusionPlaceholder}
                  className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-200 bg-[#F8F7F4]/60 text-[#142D40] focus:ring-2 focus:ring-[#087F8C] focus:bg-white resize-y"
                />
              </div>

              {/* Private Teaching Guidance */}
              <div className="space-y-1.5 p-4 rounded-xl bg-amber-50/60 border border-amber-200/70">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                    <Lock className="size-3.5 text-amber-700" />
                    <span>{dict.sections.conclusion.teachingGuidanceLabel}</span>
                  </label>
                  <span className="text-[10px] text-amber-700 font-medium">
                    Strictly Hidden from Students
                  </span>
                </div>
                <textarea
                  rows={2}
                  value={teachingGuidance}
                  onChange={(e) => {
                    setTeachingGuidance(e.target.value);
                    triggerAutosave();
                  }}
                  placeholder={dict.sections.conclusion.teachingGuidancePlaceholder}
                  className="w-full text-xs sm:text-sm p-3 rounded-lg border border-amber-200 bg-white text-[#142D40] focus:ring-2 focus:ring-amber-500 resize-y"
                />
                <p className="text-[11px] text-amber-800">
                  {dict.sections.conclusion.privateNotice}
                </p>
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
                  {locale === "ky" ? "Мугалимдин конспектисин өчүрөсүзбү?" : locale === "ru" ? "Удалить конспект преподавателя?" : "Delete Teacher Notes?"}
                </h3>
                <p className="text-xs text-[#536574] mt-0.5">
                  {locale === "ky"
                    ? "Бул тажрыйба боюнча бардык көрсөтмөлөр, эталондук байкоолор жана жашыруун эскертүүлөр биротоло өчүрүлөт."
                    : locale === "ru"
                    ? "Все подготовленные эталонные наблюдения, шаги урока и методические указания для этого эксперимента будут удалены."
                    : "All prepared guidance, expected observations, and lesson notes for this experiment will be permanently deleted."}
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
                {isDeleting ? "Deleting..." : locale === "ky" ? "Өчүрүү" : locale === "ru" ? "Удалить" : "Delete Notes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stop Sharing Confirmation Modal */}
      {showStopSharingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full p-6 shadow-2xl relative space-y-4">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                <Lock className="size-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#142D40]">
                  {locale === "ky" ? "Бардык класстар менен бөлүшүүнү токтотуу?" : locale === "ru" ? "Прекратить доступ для всех классов?" : "Stop Sharing with All Classes?"}
                </h3>
                <p className="text-xs text-[#536574] mt-0.5">
                  {locale === "ky"
                    ? "Бул конспект окуучуларга көрүнбөй калат, бирок сиздин жеке черновигиңиз толук сакталат."
                    : locale === "ru"
                    ? "Конспект перестанет отображаться у учеников во всех классах, но ваш личный черновик и все записи сохранятся."
                    : "Your published snapshot will be removed from all student views, while your private draft and notes remain safely intact."}
                </p>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setShowStopSharingModal(false)}
                disabled={isStoppingSharing}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-[#536574] hover:bg-slate-100 transition-colors cursor-pointer"
              >
                {locale === "ky" ? "Жокко чыгаруу" : locale === "ru" ? "Отмена" : "Cancel"}
              </button>
              <button
                type="button"
                onClick={handleStopSharingAll}
                disabled={isStoppingSharing}
                className="px-4 py-2 rounded-xl bg-[#087F8C] hover:bg-[#066670] disabled:bg-slate-300 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                {isStoppingSharing ? "Stopping..." : locale === "ky" ? "Бөлүшүүнү токтотуу" : locale === "ru" ? "Остановить доступ" : "Stop Sharing"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Share With Class Modal */}
      <ShareWithClassModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        experimentSlug={experiment.slug}
        experimentTitle={experiment.title[locale]}
        locale={locale}
        existingShares={shares}
        onSharesUpdated={(updated) => {
          setShares(updated);
          if (updated.length > 0) setStatus("published");
        }}
      />

      {/* Preview Student View Modal */}
      <TeacherNotesViewerModal
        isOpen={isPreviewModalOpen}
        onClose={() => setIsPreviewModalOpen(false)}
        shares={previewShares}
        experimentTitle={experiment.title[locale]}
        locale={locale}
        isPreviewMode={true}
      />
    </div>
  );
}
