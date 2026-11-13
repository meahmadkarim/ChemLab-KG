"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  X,
  BookOpen,
  CheckCircle2,
  MessageSquare,
  AlertCircle,
  FlaskConical,
  ChevronRight,
  ExternalLink,
  Loader2,
  Check,
} from "lucide-react";
import type { StudentLabReport } from "../types";
import type { Locale } from "@/i18n/config";
import { EXPERIMENTS } from "@/features/experiments/data";

interface TeacherNotebookReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  locale: Locale;
}

export function TeacherNotebookReviewModal(props: TeacherNotebookReviewModalProps) {
  return props.isOpen ? <TeacherNotebookReviewForm {...props} /> : null;
}

function TeacherNotebookReviewForm({
  isOpen,
  onClose,
  locale,
}: TeacherNotebookReviewModalProps) {
  const [reports, setReports] = useState<StudentLabReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedReport, setSelectedReport] = useState<StudentLabReport | null>(null);
  const [feedbackInput, setFeedbackInput] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;

    fetch("/api/teacher/reports")
      .then((res) => {
        if (!res.ok) throw new Error("Could not load reports");
        return res.json();
      })
      .then((data) => {
        if (isMounted) {
          const list: StudentLabReport[] = data.reports || [];
          setReports(list);
          if (list.length > 0) {
            setSelectedReport(list[0]);
            setFeedbackInput(list[0].teacherFeedback || "");
          }
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Failed to load reports.");
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen]);

  const handleSelectReport = (rep: StudentLabReport) => {
    setSelectedReport(rep);
    setFeedbackInput(rep.teacherFeedback || "");
    setReviewSuccess(false);
  };

  const handleSubmitReview = async () => {
    if (!selectedReport || !feedbackInput.trim()) return;

    setSubmittingReview(true);
    setError(null);

    try {
      const res = await fetch("/api/teacher/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reportId: selectedReport.id,
          feedbackText: feedbackInput.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit review.");
      }

      const updatedReport: StudentLabReport = data.report;
      setReports((prev) =>
        prev.map((r) => (r.id === updatedReport.id ? updatedReport : r))
      );
      setSelectedReport(updatedReport);
      setReviewSuccess(true);
      setTimeout(() => setReviewSuccess(false), 4000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Could not submit review.");
    } finally {
      setSubmittingReview(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-[#142D40]/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl border border-[#142D40]/15 shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4.5 bg-[#142D40] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-xl bg-white/10 flex items-center justify-center">
              <BookOpen className="size-5 text-[#88D49E]" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold">
                Student Lab Notebooks · Teacher Evaluation
              </h2>
              <p className="text-xs text-white/70">
                Review submitted experimental reports, inspect observations, and provide qualitative feedback.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Modal Content Split: List on Left, Detail & Grading on Right */}
        <div className="flex-1 min-h-0 flex flex-col md:flex-row overflow-hidden divide-y md:divide-y-0 md:divide-x divide-slate-200">
          {/* LEFT: Submissions List */}
          <div className="w-full md:w-80 lg:w-96 flex flex-col shrink-0 bg-[#F8F7F4]/50 overflow-y-auto">
            <div className="p-3.5 border-b border-slate-200/80 bg-white sticky top-0 z-10 flex items-center justify-between">
              <span className="text-xs font-bold text-[#142D40] uppercase tracking-wider">
                Submitted Reports ({reports.length})
              </span>
              <span className="text-[11px] text-[#536574]">
                {reports.filter((r) => r.status === "submitted").length} awaiting review
              </span>
            </div>

            {loading ? (
              <div className="p-8 text-center text-slate-500 flex flex-col items-center justify-center gap-2">
                <Loader2 className="size-6 animate-spin text-[#087F8C]" />
                <span className="text-xs">Loading classroom reports...</span>
              </div>
            ) : reports.length === 0 ? (
              <div className="p-8 text-center space-y-2 text-[#536574]">
                <FlaskConical className="size-8 mx-auto text-slate-400 stroke-[1.5]" />
                <p className="text-xs font-semibold text-[#142D40]">No reports submitted yet</p>
                <p className="text-[11px] text-[#536574] leading-relaxed">
                  When students complete their lab notebook and click &quot;Submit Report to Teacher&quot;, their entries will appear here for grading.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {reports.map((rep) => {
                  const exp = EXPERIMENTS.find((e: { slug: string; title: Record<Locale, string> }) => e.slug === rep.experimentSlug);
                  const expTitle = exp?.title[locale] || rep.experimentSlug;
                  const isSelected = selectedReport?.id === rep.id;

                  return (
                    <button
                      key={rep.id}
                      type="button"
                      onClick={() => handleSelectReport(rep)}
                      className={`w-full text-left p-3.5 transition-colors cursor-pointer flex items-start justify-between gap-2.5 ${
                        isSelected
                          ? "bg-white border-l-4 border-l-[#087F8C] shadow-2xs"
                          : "hover:bg-slate-100/70"
                      }`}
                    >
                      <div className="min-w-0 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-[#142D40] truncate">
                            {rep.studentName || "Student"}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              rep.status === "reviewed"
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-sky-100 text-sky-800"
                            }`}
                          >
                            {rep.status === "reviewed" ? "Reviewed" : "Needs Review"}
                          </span>
                        </div>
                        <p className="text-xs font-medium text-[#087F8C] truncate">
                          {expTitle}
                        </p>
                        <p className="text-[10px] text-[#536574]">
                          {rep.submittedAt
                            ? new Date(rep.submittedAt).toLocaleDateString()
                            : new Date(rep.updatedAt).toLocaleDateString()}
                          {" · "}
                          {rep.mode === "supervised_lab" ? "Practical Lab" : "Video"}
                        </p>
                      </div>
                      <ChevronRight className={`size-4 mt-1 shrink-0 ${isSelected ? "text-[#087F8C]" : "text-slate-300"}`} />
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* RIGHT: Selected Report Detail & Grading Panel */}
          <div className="flex-1 min-w-0 flex flex-col bg-white overflow-y-auto p-5 sm:p-7">
            {selectedReport ? (
              <div className="space-y-6">
                {/* Header Summary */}
                <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-slate-200">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-base sm:text-lg font-bold text-[#142D40]">
                        {selectedReport.studentName || "Student"} · Laboratory Report
                      </span>
                      <span
                        className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                          selectedReport.status === "reviewed"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-sky-100 text-sky-800"
                        }`}
                      >
                        {selectedReport.status === "reviewed" ? "Reviewed" : "Pending Evaluation"}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-[#536574]">
                      Experiment:{" "}
                      <Link
                        href={`/${locale}/teacher-dashboard/experiments/${selectedReport.experimentSlug}`}
                        target="_blank"
                        className="font-bold text-[#087F8C] hover:underline inline-flex items-center gap-1"
                      >
                        <span>
                          {EXPERIMENTS.find((e: { slug: string; title: Record<Locale, string> }) => e.slug === selectedReport.experimentSlug)?.title[locale] ||
                            selectedReport.experimentSlug}
                        </span>
                        <ExternalLink className="size-3" />
                      </Link>
                    </p>
                  </div>

                  <div className="text-right text-xs text-[#536574]">
                    <div>
                      Mode: <span className="font-semibold text-[#142D40]">{selectedReport.mode === "supervised_lab" ? "Supervised Practical Lab" : "Video Observation"}</span>
                    </div>
                    <div>
                      Submitted: <span className="font-semibold text-[#142D40]">{selectedReport.submittedAt ? new Date(selectedReport.submittedAt).toLocaleString() : new Date(selectedReport.updatedAt).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Section 1: Aim & Hypothesis */}
                <div className="space-y-2">
                  <h3 className="text-xs font-bold text-[#142D40] uppercase tracking-wider flex items-center gap-1.5">
                    <span className="size-2 rounded-full bg-[#087F8C]" />
                    1. Aim & Hypothesis
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="bg-[#F8F7F4] rounded-2xl p-3.5 border border-[#142D40]/10 text-xs">
                      <div className="font-semibold text-[#142D40] mb-1">Experiment Aim:</div>
                      <p className="text-[#536574] whitespace-pre-wrap">
                        {selectedReport.aim || <span className="italic text-slate-400">No aim recorded</span>}
                      </p>
                    </div>
                    <div className="bg-[#F8F7F4] rounded-2xl p-3.5 border border-[#142D40]/10 text-xs">
                      <div className="font-semibold text-[#142D40] mb-1">Hypothesis / Prediction:</div>
                      <p className="text-[#536574] whitespace-pre-wrap">
                        {selectedReport.hypothesis || <span className="italic text-slate-400">No hypothesis recorded</span>}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Section 2: Student Procedure */}
                <div className="space-y-2">
                  <h3 className="text-xs font-bold text-[#142D40] uppercase tracking-wider flex items-center gap-1.5">
                    <span className="size-2 rounded-full bg-[#087F8C]" />
                    2. Student Procedure Steps ({selectedReport.procedureSteps?.length || 0})
                  </h3>
                  <div className="bg-[#F8F7F4] rounded-2xl p-3.5 border border-[#142D40]/10 space-y-2 text-xs">
                    {selectedReport.procedureSteps && selectedReport.procedureSteps.length > 0 ? (
                      selectedReport.procedureSteps.map((s, idx) => (
                        <div key={s.id || idx} className="flex items-start gap-2.5 bg-white p-2.5 rounded-xl border border-slate-200">
                          <span className="size-5 rounded-md bg-[#142D40] text-white font-bold text-[10px] flex items-center justify-center shrink-0">
                            {idx + 1}
                          </span>
                          <div className="flex-1">
                            <p className="text-[#142D40]">{s.text}</p>
                            <span className="text-[10px] text-[#536574] font-medium">
                              Source: {s.source === "personally_performed" ? "Personally performed" : "Video observation"}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-[#536574] italic">No custom steps recorded.</p>
                    )}
                  </div>
                </div>

                {/* Section 3: Observations */}
                <div className="space-y-2">
                  <h3 className="text-xs font-bold text-[#142D40] uppercase tracking-wider flex items-center gap-1.5">
                    <span className="size-2 rounded-full bg-[#087F8C]" />
                    3. Qualitative Observations
                  </h3>
                  <div className="bg-[#F8F7F4] rounded-2xl p-4 border border-[#142D40]/10 text-xs text-[#142D40] whitespace-pre-wrap">
                    {selectedReport.observations || <span className="italic text-slate-400">No observations entered.</span>}
                  </div>
                </div>

                {/* Section 4: Results & Data */}
                <div className="space-y-2">
                  <h3 className="text-xs font-bold text-[#142D40] uppercase tracking-wider flex items-center gap-1.5">
                    <span className="size-2 rounded-full bg-[#087F8C]" />
                    4. Results & Quantitative Data
                  </h3>
                  <div className="bg-[#F8F7F4] rounded-2xl p-4 border border-[#142D40]/10 text-xs text-[#142D40] whitespace-pre-wrap">
                    {selectedReport.results || <span className="italic text-slate-400">No results entered.</span>}
                  </div>
                </div>

                {/* Section 5: Conclusion */}
                <div className="space-y-2">
                  <h3 className="text-xs font-bold text-[#142D40] uppercase tracking-wider flex items-center gap-1.5">
                    <span className="size-2 rounded-full bg-[#087F8C]" />
                    5. Conclusion & Scientific Reflection
                  </h3>
                  <div className="bg-[#F8F7F4] rounded-2xl p-4 border border-[#142D40]/10 text-xs text-[#142D40] whitespace-pre-wrap">
                    {selectedReport.conclusion || <span className="italic text-slate-400">No conclusion entered.</span>}
                  </div>
                </div>

                {/* TEACHER EVALUATION & FEEDBACK PANEL */}
                <div className="pt-4 border-t-2 border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-[#142D40] flex items-center gap-2">
                      <MessageSquare className="size-4 text-[#087F8C]" />
                      Teacher Review & Feedback
                    </h3>
                    {selectedReport.reviewedAt && (
                      <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                        Reviewed on {new Date(selectedReport.reviewedAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>

                  <textarea
                    rows={4}
                    value={feedbackInput}
                    onChange={(e) => setFeedbackInput(e.target.value)}
                    placeholder="Write constructive guidance, commend rigorous observations, or provide correction on stoichiometry / safety..."
                    className="w-full text-xs sm:text-sm p-3.5 rounded-2xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-[#087F8C] bg-white text-[#142D40] leading-relaxed resize-y"
                  />

                  {error && (
                    <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
                      <AlertCircle className="size-4 shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  {reviewSuccess && (
                    <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                      <Check className="size-4 shrink-0" />
                      <span>Feedback successfully saved and marked as Reviewed! The student can now view your notes in their notebook.</span>
                    </div>
                  )}

                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={handleSubmitReview}
                      disabled={submittingReview || !feedbackInput.trim()}
                      className="cursor-pointer inline-flex items-center gap-2 rounded-xl bg-[#087F8C] hover:bg-[#066670] disabled:bg-slate-300 text-white px-5 py-2.5 text-xs sm:text-sm font-semibold transition-colors shadow-2xs"
                    >
                      {submittingReview ? (
                        <>
                          <Loader2 className="size-4 animate-spin" />
                          <span>Saving Evaluation...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="size-4" />
                          <span>Save Feedback & Mark Reviewed</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-slate-400 space-y-2">
                <BookOpen className="size-12 stroke-[1.25]" />
                <p className="text-sm font-semibold text-[#142D40]">Select a report on the left</p>
                <p className="text-xs text-center max-w-sm">
                  Click any submitted student lab notebook to inspect their procedure, observations, results, and provide feedback.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
