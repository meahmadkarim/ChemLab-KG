"use client";

import React, { useState } from "react";
import {
  X,
  CheckCircle2,
  AlertCircle,
  Share2,
  Lock,
  Check,
} from "lucide-react";
import type { Locale } from "@/i18n/config";
import { useLearningStore } from "@/features/progress/learning-store";
import { TEACHER_NOTEBOOK_DICTIONARY } from "../notebook-dictionary";
import type {
  TeacherNotebookShare,
  NotebookSectionKey,
} from "../types";

interface ShareWithClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  experimentSlug: string;
  experimentTitle: string;
  locale: Locale;
  existingShares: TeacherNotebookShare[];
  onSharesUpdated: (updated: TeacherNotebookShare[]) => void;
}

export function ShareWithClassModal(props: ShareWithClassModalProps) {
  return props.isOpen ? <ShareWithClassForm {...props} /> : null;
}

function ShareWithClassForm({
  isOpen,
  onClose,
  experimentSlug,
  experimentTitle,
  locale,
  existingShares,
  onSharesUpdated,
}: ShareWithClassModalProps) {
  const dict = TEACHER_NOTEBOOK_DICTIONARY[locale].shareModal;
  const { state } = useLearningStore();
  const classrooms = state.classrooms || [];

  const [chosenClassroomIds, setSelectedClassroomIds] = useState<string[] | null>(null);
  const selectedClassroomIds = chosenClassroomIds ?? (existingShares.length ? existingShares.map(share => share.classroomId) : classrooms.map(classroom => classroom.id));
  const [selectedSections, setSelectedSections] = useState<NotebookSectionKey[]>(existingShares[0]?.sharedSections?.length ? existingShares[0].sharedSections : [
    "aim_hypothesis",
    "procedure",
    "observations",
    "conclusion",
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [revokingId, setRevokingId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const toggleClassroom = (id: string) => {
    setSelectedClassroomIds(
      selectedClassroomIds.includes(id) ? selectedClassroomIds.filter((cId) => cId !== id) : [...selectedClassroomIds, id]
    );
  };

  const toggleSection = (sectionKey: NotebookSectionKey) => {
    setSelectedSections((prev) =>
      prev.includes(sectionKey)
        ? prev.filter((k) => k !== sectionKey)
        : [...prev, sectionKey]
    );
  };

  const handleConfirmShare = async () => {
    if (selectedClassroomIds.length === 0) {
      setErrorMessage("Please select at least one classroom.");
      return;
    }
    if (selectedSections.length === 0) {
      setErrorMessage("Please select at least one section to share.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/notebook/teacher/share", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          experimentSlug,
          classroomIds: selectedClassroomIds,
          sharedSections: selectedSections,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to share with classrooms.");
      }

      const json = await res.json();
      onSharesUpdated(json.shares || []);
      setSuccessMessage(
        `Successfully published immutable snapshot for ${selectedClassroomIds.length} classroom(s)!`
      );
      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : "Sharing failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRevokeShare = async (classroomId: string) => {
    setRevokingId(classroomId);
    setErrorMessage(null);

    try {
      const res = await fetch(
        `/api/notebook/teacher/share?slug=${encodeURIComponent(
          experimentSlug
        )}&classroomId=${encodeURIComponent(classroomId)}`,
        { method: "DELETE" }
      );

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to revoke classroom access.");
      }

      const updated = existingShares.filter((s) => s.classroomId !== classroomId);
      onSharesUpdated(updated);
      setSelectedClassroomIds(selectedClassroomIds.filter((id) => id !== classroomId));
      setSuccessMessage("Classroom access revoked.");
      setTimeout(() => setSuccessMessage(null), 2500);
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : "Revocation failed.");
    } finally {
      setRevokingId(null);
    }
  };

  const selectedClassroomNames = classrooms
    .filter((c) => selectedClassroomIds.includes(c.id))
    .map((c) => c.name);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#142D40]/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white rounded-3xl border border-slate-200/90 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="size-11 rounded-2xl bg-[#E6F2F5] text-[#087F8C] flex items-center justify-center shrink-0">
              <Share2 className="size-5" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-[#142D40] leading-snug">
                {dict.title}
              </h3>
              <p className="text-xs text-[#536574] mt-0.5">
                {experimentTitle}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="size-8 rounded-full flex items-center justify-center text-[#536574] hover:text-[#142D40] hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 sm:p-6 space-y-6 overflow-y-auto">
          {/* 1. Classroom Selection */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold text-[#142D40] uppercase tracking-wider block">
              {dict.selectClassrooms}
            </label>
            <div className="space-y-2">
              {classrooms.map((cls) => {
                const isSelected = selectedClassroomIds.includes(cls.id);
                const isAlreadyShared = existingShares.some((s) => s.classroomId === cls.id);
                return (
                  <div
                    key={cls.id}
                    className={`p-3 sm:p-3.5 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                      isSelected
                        ? "border-[#087F8C] bg-[#E6F2F5]/30 ring-1 ring-[#087F8C]/20"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                  >
                    <label className="flex items-center gap-3 cursor-pointer select-none flex-1">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleClassroom(cls.id)}
                        className="size-4 rounded text-[#087F8C] focus:ring-[#087F8C] accent-[#087F8C] cursor-pointer"
                      />
                      <div>
                        <span className="text-xs sm:text-sm font-bold text-[#142D40] block">
                          {cls.name}
                        </span>
                        <span className="text-[11px] text-[#536574]">
                          {cls.studentCount || 26} students · Code: {cls.joinCode}
                        </span>
                      </div>
                    </label>

                    {isAlreadyShared && (
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                          <Check className="size-3" />
                          Published
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRevokeShare(cls.id)}
                          disabled={revokingId === cls.id}
                          className="text-[11px] font-semibold text-rose-600 hover:text-rose-700 px-2 py-0.5 rounded hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Revoke access for this classroom"
                        >
                          {revokingId === cls.id ? "Revoking..." : "Revoke"}
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* 2. Section Selection */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#142D40] uppercase tracking-wider block">
                {dict.selectSections}
              </label>
              <span className="text-[11px] text-[#536574]">
                Choose which parts students can view
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {[
                { key: "aim_hypothesis", label: dict.aimHypothesis },
                { key: "procedure", label: dict.procedure },
                { key: "observations", label: dict.observations },
                { key: "conclusion", label: dict.conclusion },
              ].map((sec) => {
                const checked = selectedSections.includes(sec.key as NotebookSectionKey);
                return (
                  <label
                    key={sec.key}
                    className={`p-3 rounded-xl border flex items-center gap-2.5 cursor-pointer transition-all ${
                      checked
                        ? "border-[#087F8C] bg-[#E6F2F5]/40 text-[#142D40]"
                        : "border-slate-200 bg-white text-[#536574] hover:border-slate-300"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleSection(sec.key as NotebookSectionKey)}
                      className="size-4 rounded text-[#087F8C] focus:ring-[#087F8C] accent-[#087F8C] cursor-pointer"
                    />
                    <span className="text-xs sm:text-sm font-semibold">{sec.label}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* 3. Summary & Privacy Notice */}
          <div className="rounded-2xl bg-[#F8F7F4] border border-slate-200/90 p-4 space-y-2 text-xs">
            <div className="flex items-center gap-2 text-[#142D40] font-bold">
              <Lock className="size-3.5 text-[#087F8C]" />
              <span>{dict.summaryTitle}</span>
            </div>
            <p className="text-[#536574] leading-relaxed">
              {selectedClassroomNames.length > 0 ? (
                <>
                  Publishing <strong className="text-[#142D40]">{selectedSections.length} section(s)</strong> to{" "}
                  <strong className="text-[#142D40]">{selectedClassroomNames.join(", ")}</strong>.
                </>
              ) : (
                "No classrooms selected."
              )}
            </p>
            <p className="text-[11px] text-[#536574]/80 leading-normal border-t border-slate-200/60 pt-2">
              {dict.confirmNotice}
            </p>
          </div>

          {/* Feedback Alerts */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle className="size-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="size-4 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-100 bg-[#F8F7F4]/50 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-[#536574] hover:text-[#142D40] hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            {dict.cancel}
          </button>
          <button
            type="button"
            onClick={handleConfirmShare}
            disabled={isSubmitting}
            className="px-5 py-2.5 rounded-xl bg-[#087F8C] hover:bg-[#066670] disabled:bg-slate-300 text-white text-xs font-semibold transition-all shadow-xs flex items-center gap-2 cursor-pointer"
          >
            <Share2 className="size-3.5" />
            <span>{isSubmitting ? dict.updatingBtn : dict.confirmBtn}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
