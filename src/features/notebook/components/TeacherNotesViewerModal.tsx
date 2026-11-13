"use client";

import React from "react";
import {
  X,
  BookOpen,
  Target,
  ListOrdered,
  Eye,
  FileCheck2,
  Lock,
  ArrowLeft,
  Calendar,
  Users,
  } from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { TeacherNotebookShare } from "../types";

interface TeacherNotesViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  shares: TeacherNotebookShare[];
  experimentTitle: string;
  locale: Locale;
  isPreviewMode?: boolean;
}

export function TeacherNotesViewerModal({
  isOpen,
  onClose,
  shares,
  experimentTitle,
  isPreviewMode = false,
}: TeacherNotesViewerModalProps) {
  if (!isOpen) return null;

  // If there are multiple shares (e.g. from different classrooms), pick the first or let user toggle
  const activeShare = shares[0];

  if (!activeShare) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#142D40]/60 backdrop-blur-xs">
        <div className="w-full max-w-md bg-white rounded-3xl p-6 text-center space-y-4 shadow-2xl">
          <div className="size-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
            <Lock className="size-6" />
          </div>
          <h3 className="text-base font-bold text-[#142D40]">No Published Notes Available</h3>
          <p className="text-xs text-[#536574]">
            Your teacher has not published shared notes for this experiment yet.
          </p>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-[#142D40]"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  const { publishedSnapshot, sharedSections } = activeShare;

  const hasAim = sharedSections.includes("aim_hypothesis") && (publishedSnapshot.aim || publishedSnapshot.researchQuestion || publishedSnapshot.hypothesis);
  const hasProcedure = sharedSections.includes("procedure") && (publishedSnapshot.procedureSteps && publishedSnapshot.procedureSteps.length > 0);
  const hasObservations = sharedSections.includes("observations") && (publishedSnapshot.expectedObservations || publishedSnapshot.actualObservations || publishedSnapshot.measurements || publishedSnapshot.explanatoryNotes);
  const hasConclusion = sharedSections.includes("conclusion") && (publishedSnapshot.conclusion || publishedSnapshot.results);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#142D40]/65 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl border border-slate-200/90 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-start justify-between gap-4 bg-white sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="size-11 rounded-2xl bg-[#E6F2F5] text-[#087F8C] flex items-center justify-center shrink-0">
              <BookOpen className="size-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-bold text-[#142D40]">
                  {isPreviewMode ? "Preview: Student View" : "Teacher Lab Notes"}
                </h3>
                <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#E6F2F5] text-[#087F8C] border border-[#087F8C]/20">
                  Read-Only
                </span>
              </div>
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

        {/* Notice Banner */}
        <div className="px-5 sm:px-6 py-3 bg-[#F8F7F4] border-b border-slate-200/60 flex flex-wrap items-center justify-between gap-3 text-xs text-[#536574]">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 font-medium text-[#142D40]">
              <Users className="size-3.5 text-[#087F8C]" />
              Classroom: <span className="font-bold">{activeShare.classroomName}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="size-3.5 text-slate-400" />
              Published: {new Date(activeShare.publishedAt).toLocaleDateString()}
            </span>
          </div>
          {isPreviewMode && (
            <span className="font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 text-[11px]">
              🔒 Private teacher notes are excluded
            </span>
          )}
        </div>

        {/* Scrollable Content: 4 Stages Vertical Timeline */}
        <div className="p-5 sm:p-7 space-y-6 overflow-y-auto">
          {/* Timeline Wrapper */}
          <div className="relative pl-7 sm:pl-9 space-y-6">
            <div className="absolute left-[13px] sm:left-[17px] top-4 bottom-4 w-0.5 bg-[#087F8C]/30" />

            {/* STAGE 1: AIM & HYPOTHESIS */}
            {hasAim ? (
              <div className="relative bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 space-y-3">
                <div className="absolute -left-[35px] sm:-left-[43px] top-4 size-7 -translate-x-1/2 rounded-full bg-[#142D40] text-white font-bold text-xs flex items-center justify-center border-2 border-white shadow-xs">
                  1
                </div>
                <div className="flex items-center gap-2.5">
                  <Target className="size-4.5 text-[#087F8C]" />
                  <h4 className="font-bold text-base text-[#142D40]">1 — Aim & Hypothesis</h4>
                </div>

                {publishedSnapshot.aim && (
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-[#536574] uppercase tracking-wider block">
                      Aim of the Experiment
                    </span>
                    <p className="text-xs sm:text-sm text-[#142D40] bg-[#F8F7F4] p-3 rounded-xl border border-slate-200/60 leading-relaxed whitespace-pre-wrap">
                      {publishedSnapshot.aim}
                    </p>
                  </div>
                )}

                {publishedSnapshot.researchQuestion && (
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-[#536574] uppercase tracking-wider block">
                      Research Question
                    </span>
                    <p className="text-xs sm:text-sm text-[#142D40] bg-[#F8F7F4] p-3 rounded-xl border border-slate-200/60 leading-relaxed whitespace-pre-wrap">
                      {publishedSnapshot.researchQuestion}
                    </p>
                  </div>
                )}

                {publishedSnapshot.hypothesis && (
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-[#536574] uppercase tracking-wider block">
                      Hypothesis & Predicted Outcome
                    </span>
                    <p className="text-xs sm:text-sm text-[#142D40] bg-[#F8F7F4] p-3 rounded-xl border border-slate-200/60 leading-relaxed whitespace-pre-wrap">
                      {publishedSnapshot.hypothesis}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="relative bg-slate-50/60 rounded-2xl border border-dashed border-slate-200 p-4 text-xs text-[#536574] italic">
                <div className="absolute -left-[35px] sm:-left-[43px] top-3 size-7 -translate-x-1/2 rounded-full bg-slate-200 text-slate-500 font-bold text-xs flex items-center justify-center border-2 border-white">
                  1
                </div>
                Section 1 (Aim & Hypothesis) was not included in this edition.
              </div>
            )}

            {/* STAGE 2: PROCEDURE */}
            {hasProcedure ? (
              <div className="relative bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 space-y-3">
                <div className="absolute -left-[35px] sm:-left-[43px] top-4 size-7 -translate-x-1/2 rounded-full bg-[#142D40] text-white font-bold text-xs flex items-center justify-center border-2 border-white shadow-xs">
                  2
                </div>
                <div className="flex items-center gap-2.5">
                  <ListOrdered className="size-4.5 text-[#087F8C]" />
                  <h4 className="font-bold text-base text-[#142D40]">2 — Procedure Instructions</h4>
                </div>

                <div className="space-y-2 pt-1">
                  {publishedSnapshot.procedureSteps?.map((step) => (
                    <div
                      key={step.id}
                      className="p-3 rounded-xl border border-slate-200/80 bg-[#F8F7F4] flex items-start gap-3"
                    >
                      <span className="size-6 rounded-lg bg-[#087F8C] text-white text-xs font-bold flex items-center justify-center shrink-0">
                        {step.stepNumber}
                      </span>
                      <p className="text-xs sm:text-sm text-[#142D40] leading-relaxed pt-0.5">
                        {step.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="relative bg-slate-50/60 rounded-2xl border border-dashed border-slate-200 p-4 text-xs text-[#536574] italic">
                <div className="absolute -left-[35px] sm:-left-[43px] top-3 size-7 -translate-x-1/2 rounded-full bg-slate-200 text-slate-500 font-bold text-xs flex items-center justify-center border-2 border-white">
                  2
                </div>
                Section 2 (Procedure) was not included in this edition.
              </div>
            )}

            {/* STAGE 3: OBSERVATIONS */}
            {hasObservations ? (
              <div className="relative bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 space-y-3">
                <div className="absolute -left-[35px] sm:-left-[43px] top-4 size-7 -translate-x-1/2 rounded-full bg-[#142D40] text-white font-bold text-xs flex items-center justify-center border-2 border-white shadow-xs">
                  3
                </div>
                <div className="flex items-center gap-2.5">
                  <Eye className="size-4.5 text-[#087F8C]" />
                  <h4 className="font-bold text-base text-[#142D40]">3 — Observations & Measurements</h4>
                </div>

                {publishedSnapshot.expectedObservations && (
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-[#536574] uppercase tracking-wider block">
                      Expected Observations
                    </span>
                    <p className="text-xs sm:text-sm text-[#142D40] bg-[#F8F7F4] p-3 rounded-xl border border-slate-200/60 leading-relaxed whitespace-pre-wrap">
                      {publishedSnapshot.expectedObservations}
                    </p>
                  </div>
                )}

                {publishedSnapshot.actualObservations && (
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-[#536574] uppercase tracking-wider block">
                      Demonstration Observations
                    </span>
                    <p className="text-xs sm:text-sm text-[#142D40] bg-[#F8F7F4] p-3 rounded-xl border border-slate-200/60 leading-relaxed whitespace-pre-wrap">
                      {publishedSnapshot.actualObservations}
                    </p>
                  </div>
                )}

                {publishedSnapshot.measurements && (
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-[#536574] uppercase tracking-wider block">
                      Measurements & Data Values
                    </span>
                    <p className="text-xs sm:text-sm font-mono text-[#142D40] bg-[#F8F7F4] p-3 rounded-xl border border-slate-200/60 leading-relaxed whitespace-pre-wrap">
                      {publishedSnapshot.measurements}
                    </p>
                  </div>
                )}

                {publishedSnapshot.explanatoryNotes && (
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-[#536574] uppercase tracking-wider block">
                      Scientific Explanations & Notes
                    </span>
                    <p className="text-xs sm:text-sm text-[#142D40] bg-[#F8F7F4] p-3 rounded-xl border border-slate-200/60 leading-relaxed whitespace-pre-wrap">
                      {publishedSnapshot.explanatoryNotes}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="relative bg-slate-50/60 rounded-2xl border border-dashed border-slate-200 p-4 text-xs text-[#536574] italic">
                <div className="absolute -left-[35px] sm:-left-[43px] top-3 size-7 -translate-x-1/2 rounded-full bg-slate-200 text-slate-500 font-bold text-xs flex items-center justify-center border-2 border-white">
                  3
                </div>
                Section 3 (Observations) was not included in this edition.
              </div>
            )}

            {/* STAGE 4: CONCLUSION & RESULTS */}
            {hasConclusion ? (
              <div className="relative bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 space-y-3">
                <div className="absolute -left-[35px] sm:-left-[43px] top-4 size-7 -translate-x-1/2 rounded-full bg-[#142D40] text-white font-bold text-xs flex items-center justify-center border-2 border-white shadow-xs">
                  4
                </div>
                <div className="flex items-center gap-2.5">
                  <FileCheck2 className="size-4.5 text-[#087F8C]" />
                  <h4 className="font-bold text-base text-[#142D40]">4 — Conclusion & Results</h4>
                </div>

                {publishedSnapshot.results && (
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-[#536574] uppercase tracking-wider block">
                      Results Summary
                    </span>
                    <p className="text-xs sm:text-sm text-[#142D40] bg-[#F8F7F4] p-3 rounded-xl border border-slate-200/60 leading-relaxed whitespace-pre-wrap">
                      {publishedSnapshot.results}
                    </p>
                  </div>
                )}

                {publishedSnapshot.conclusion && (
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-[#536574] uppercase tracking-wider block">
                      Scientific Conclusion
                    </span>
                    <p className="text-xs sm:text-sm text-[#142D40] bg-[#F8F7F4] p-3 rounded-xl border border-slate-200/60 leading-relaxed whitespace-pre-wrap">
                      {publishedSnapshot.conclusion}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="relative bg-slate-50/60 rounded-2xl border border-dashed border-slate-200 p-4 text-xs text-[#536574] italic">
                <div className="absolute -left-[35px] sm:-left-[43px] top-3 size-7 -translate-x-1/2 rounded-full bg-slate-200 text-slate-500 font-bold text-xs flex items-center justify-center border-2 border-white">
                  4
                </div>
                Section 4 (Conclusion & Results) was not included in this edition.
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-100 bg-[#F8F7F4]/60 flex items-center justify-between">
          <p className="text-xs text-[#536574]">
            {isPreviewMode
              ? "Close preview to resume editing your teacher notes."
              : "Teacher notes are provided as an educational reference."}
          </p>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-[#142D40] hover:bg-[#1f3a52] text-white text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="size-3.5" />
            <span>{isPreviewMode ? "Return to Editing" : "Close Notes"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
