"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  FlaskConical,
  Layers,
  ArrowRight,
  ClipboardList,
  Bookmark,
  BookOpen,
  Users,
  Eye,
  Calendar,
  MoreVertical,
  LogOut,
} from "lucide-react";
import type { Experiment } from "@/features/experiments/types";
import { getTopicById } from "@/features/experiments/data";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { useLearningStore } from "./learning-store";
import { useAuthStore } from "@/features/auth/auth-store";
import type { DashboardActiveTab } from "@/components/dashboard/DashboardLayout";
import { ChemIllustration } from "@/components/illustrations/ChemIllustration";
import { StudentNotebookSummary } from "@/features/notebook/components/StudentNotebookSummary";
import type { TeacherNotebookShare } from "@/features/notebook/types";
import { TeacherNotesViewerModal } from "@/features/notebook/components/TeacherNotesViewerModal";

interface StudentDashboardClientProps {
  experiments: Experiment[];
  locale: Locale;
  activeTab?: DashboardActiveTab;
  libraryCopy?: Dictionary["library"];
  featuredCopy?: Dictionary["featured"];
}

export function StudentDashboardClient({
  experiments,
  locale,
  activeTab = "dashboard",
}: StudentDashboardClientProps) {
  const { state, leaveClassroom, joinClassroom } = useLearningStore();
  const { user } = useAuthStore();

  const [leavingClass, setLeavingClass] = useState<{ id: string; name: string } | null>(null);
  const [activeMenuClassId, setActiveMenuClassId] = useState<string | null>(null);
  const [joinCode, setJoinCode] = useState("");
  const [joinNotice, setJoinNotice] = useState("");
  const [joining, setJoining] = useState(false);
  const [leaveError, setLeaveError] = useState<string | null>(null);

  const [sharedTeacherNotes, setSharedTeacherNotes] = useState<TeacherNotebookShare[]>([]);
  const [viewerState, setViewerState] = useState<{
    isOpen: boolean;
    shares: TeacherNotebookShare[];
    title: string;
  }>({ isOpen: false, shares: [], title: "" });

  useEffect(() => {
    fetch("/api/notebook/teacher/shared", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (data.ok && Array.isArray(data.shares)) {
          setSharedTeacherNotes(data.shares);
        }
      })
      .catch((err) => console.error("Failed to load shared teacher notes:", err));
  }, []);

  // 1. Student Name & Display Info
  const studentDisplayName = user?.name || "Learner";
  const firstName = studentDisplayName.split(" ")[0] || "Amina";

  // 2. Dynamic Progress Metrics from Real Student Store
  const completedCount = state.completedSlugs.length;
  const totalExperiments = experiments.length;
  const displayCompleted = Math.min(completedCount, totalExperiments);
  const remainingCount = Math.max(0, totalExperiments - displayCompleted);
  const progressPercent = totalExperiments ? Math.round((displayCompleted / totalExperiments) * 100) : 0;

  // 3. Continue Learning Experiment (matching Image 1 centerpiece)
  // Target experiment: Acid-Base Titration or student's active experiment
  const continueExp =
    experiments.find(
      (e) =>
        e.slug === "red-cabbage-ph-indicator" ||
        e.slug.includes("titration") ||
        e.slug.includes("acid")
    ) || experiments[0];
  const continueTopic = continueExp ? getTopicById(continueExp.topicId) : null;

  // 4. Upcoming Assignments (from classrooms or realistic student curriculum)
  const upcomingAssignments = state.classrooms.filter(c=>!c.archived).flatMap(c=>c.assignments).map(a=>({
    id:a.id,title:experiments.find(e=>e.slug===a.experimentSlug)?.title[locale]??a.experimentSlug,
    dueDate:new Date(a.dueDate).toLocaleDateString(locale),status:state.quizAttempts.some(attempt=>attempt.assignmentId===a.id)?"Submitted":"Assigned",statusTone:"teal",
    href:`/${locale}/me/experiments/${a.experimentSlug}?assignment=${a.id}&tab=quiz`,
  }));
  const savedSlugs = state.bookmarkedSlugs;

  const savedExperiments = savedSlugs
    .map((slug: string) => experiments.find((e) => e.slug === slug))
    .filter(Boolean) as Experiment[];

  if (!continueExp || !continueTopic) return <p role="status" className="p-6">{locale === "ru" ? "Пока нет опубликованных опытов." : locale === "ky" ? "Азырынча жарыяланган тажрыйбалар жок." : "No experiments have been published yet."}</p>;

  return (
    <div className="w-full space-y-6 sm:space-y-7">
      {/* =========================================================================
          TAB: DEFAULT DASHBOARD (Matches Approved Student Dashboard Image 1 Exactly)
          ========================================================================= */}
      {activeTab === "dashboard" && (
        <div className="space-y-6 sm:space-y-7">
          {/* TOP GREETING AREA */}
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#142D40] tracking-tight ">
              {locale === "ky"
                ? `Кайрадан кош келиңиз, ${firstName}!`
                : locale === "ru"
                ? `С возвращением, ${firstName}!`
                : `Welcome back, ${firstName}!`}
            </h1>
            <p className="text-xs sm:text-sm text-[#536574]">
              {locale === "ky"
                ? "Химия боюнча билимиңизди улантыңыз, прогрессиңизди байкаңыз жана классыңыз менен бирге болуңуз."
                : locale === "ru"
                ? "Продолжайте обучение химии, отслеживайте прогресс и выполняйте задания класса."
                : "Continue your chemistry learning, track your progress, and keep up with your class."}
            </p>
          </div>

          {/* MAIN ROW: CONTINUE LEARNING (LEFT) + YOUR PROGRESS (RIGHT) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-stretch">
            {/* Left: Continue Learning Card (60-65% width) */}
            <div className="lg:col-span-7 xl:col-span-8 space-y-2.5 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <h2 className="text-base sm:text-lg font-bold text-[#142D40]">
                  {locale === "ky"
                    ? "Окууну улантуу"
                    : locale === "ru"
                    ? "Продолжить обучение"
                    : "Continue learning"}
                </h2>
                <Link
                  href={`/${locale}/me/learning`}
                  className="text-xs sm:text-sm font-semibold text-[#087F8C] hover:underline flex items-center gap-1"
                >
                  <span>
                    {locale === "ky"
                      ? "Менин окуум"
                      : locale === "ru"
                      ? "Моё обучение"
                      : "View My Learning"}
                  </span>
                  <ArrowRight className="size-3.5" />
                </Link>
              </div>

              {/* White Card Container */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs flex-1 flex flex-col md:flex-row items-center gap-5 sm:gap-6">
                {/* Left Thumbnail (Beaker with liquid / ChemIllustration) */}
                <div className="w-full md:w-56 lg:w-64 h-40 sm:h-44 rounded-xl overflow-hidden shrink-0 bg-slate-900 border border-slate-200/60 relative group">
                  <ChemIllustration
                    variant={continueExp.illustration}
                    slug={continueExp.slug}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                {/* Right Experiment Meta */}
                <div className="flex-1 min-w-0 space-y-2.5">
                  <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded-sm">
                    EXPERIMENT
                  </span>

                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-[#142D40] tracking-tight">
                      {continueExp.title[locale]}
                    </h3>
                    <p className="text-xs font-medium text-[#536574] mt-0.5">
                      {locale === "ky" ? "Тема: " : locale === "ru" ? "Тема: " : "Topic: "}
                      {continueTopic.title[locale]}
                    </p>
                  </div>

                  <p className="text-xs text-[#536574] leading-relaxed line-clamp-2">
                    {continueExp.shortDescription[locale]}
                  </p>

                  <div className="pt-1">
                    <Link
                      href={`/${locale}/me/experiments/${continueExp.slug}`}
                      className="inline-flex items-center gap-2 rounded-lg bg-[#087F8C] hover:bg-[#066670] text-white px-5 py-2.5 text-xs sm:text-sm font-semibold transition-colors shadow-2xs cursor-pointer"
                    >
                      <span>
                        {locale === "ky"
                          ? "Улантуу"
                          : locale === "ru"
                          ? "Продолжить"
                          : "Continue"}
                      </span>
                      <ArrowRight className="size-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Your Progress Card (35-40% width) */}
            <div className="lg:col-span-5 xl:col-span-4 space-y-2.5 flex flex-col justify-between">
              <h2 className="text-base sm:text-lg font-bold text-[#142D40]">
                {locale === "ky"
                  ? "Сиздин прогресс"
                  : locale === "ru"
                  ? "Ваш прогресс"
                  : "Your Progress"}
              </h2>

              {/* White Progress Card Container */}
              <div className="bg-white rounded-none border border-slate-200 p-5 sm:p-6 shadow-none flex-1 flex flex-col justify-between space-y-5">
                <div>
                  <div className="flex items-baseline justify-between">
                    <div>
                      <div className="text-2xl sm:text-3xl font-extrabold text-[#142D40]">
                        {displayCompleted} of {totalExperiments}
                      </div>
                      <div className="text-xs text-[#536574] font-medium mt-0.5">
                        {locale === "ky"
                          ? "тажрыйба аяктады"
                          : locale === "ru"
                          ? "экспериментов завершено"
                          : "experiments completed"}
                      </div>
                    </div>
                    <div className="text-lg sm:text-xl font-extrabold text-[#142D40]">
                      {progressPercent}%
                    </div>
                  </div>

                  {/* Horizontal Progress Bar */}
                  <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden mt-4">
                    <div
                      className="h-full rounded-full bg-[#087F8C] transition-all duration-500"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                {/* Bottom 2 Metrics */}
                <div className="grid grid-cols-2 gap-4 pt-3 border-t border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <FlaskConical className="size-5 text-[#142D40] shrink-0 stroke-[1.75]" />
                    <div>
                      <div className="text-sm font-bold text-[#142D40]">
                        {displayCompleted}
                      </div>
                      <div className="text-[11px] text-[#536574] leading-tight">
                        {locale === "ky"
                          ? "Аяктаган"
                          : locale === "ru"
                          ? "Завершено"
                          : "Completed experiments"}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <Layers className="size-5 text-[#142D40] shrink-0 stroke-[1.75]" />
                    <div>
                      <div className="text-sm font-bold text-[#142D40]">
                        {remainingCount}
                      </div>
                      <div className="text-[11px] text-[#536574] leading-tight">
                        {locale === "ky"
                          ? "Калган"
                          : locale === "ru"
                          ? "Осталось"
                          : "Remaining experiments"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* LOWER ROW: UPCOMING ASSIGNMENTS (LEFT) + SAVED EXPERIMENTS (RIGHT) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6 items-start">
            {/* Left: Upcoming Assignments Card */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <h2 className="text-base sm:text-lg font-bold text-[#142D40]">
                  {locale === "ky"
                    ? "Алдадагы тапшырмалар"
                    : locale === "ru"
                    ? "Предстоящие задания"
                    : "Upcoming Assignments"}
                </h2>
                <Link
                  href={`/${locale}/me?tab=assignments`}
                  className="text-xs sm:text-sm font-semibold text-[#087F8C] hover:underline flex items-center gap-1"
                >
                  <span>
                    {locale === "ky" ? "Баары" : locale === "ru" ? "Все" : "View All"}
                  </span>
                  <ArrowRight className="size-3.5" />
                </Link>
              </div>

              {/* White Assignments List Container */}
              <div className="bg-white rounded-none border border-slate-200 p-2 sm:p-3 shadow-none divide-y divide-slate-100">
                {upcomingAssignments.map((asgn) => (
                  <Link
                    key={asgn.id}
                    href={asgn.href}
                    className="flex items-center justify-between gap-3 p-3 rounded-xl hover:bg-[#F8F7F4] transition-colors group cursor-pointer"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="size-9 rounded-lg bg-slate-100 text-[#536574] group-hover:text-[#087F8C] flex items-center justify-center shrink-0 transition-colors">
                        <ClipboardList className="size-4.5" />
                      </div>
                      <div className="min-w-0 space-y-0.5">
                        <h4 className="text-xs sm:text-sm font-bold text-[#142D40] truncate group-hover:text-[#087F8C] transition-colors">
                          {asgn.title}
                        </h4>
                        <div className="text-[11px] text-[#536574]">
                          {asgn.dueDate}
                        </div>
                      </div>
                    </div>

                    <span
                      className={`text-[11px] font-semibold px-2.5 py-1 rounded-md shrink-0 ${
                        asgn.statusTone === "teal"
                          ? "bg-teal-50 text-[#087F8C] border border-teal-100"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {asgn.status}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Right: Saved Experiments Card */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <h2 className="text-base sm:text-lg font-bold text-[#142D40]">
                  {locale === "ky"
                    ? "Сакталган тажрыйбалар"
                    : locale === "ru"
                    ? "Сохранённые эксперименты"
                    : "Saved Experiments"}
                </h2>
                <Link
                  href={`/${locale}/me?tab=saved`}
                  className="text-xs sm:text-sm font-semibold text-[#087F8C] hover:underline flex items-center gap-1"
                >
                  <span>
                    {locale === "ky"
                      ? "Сакталгандар"
                      : locale === "ru"
                      ? "Сохранённые"
                      : "View Saved"}
                  </span>
                  <ArrowRight className="size-3.5" />
                </Link>
              </div>

              {/* White Saved Experiments List Container */}
              <div className="bg-white rounded-none border border-slate-200 p-2 sm:p-3 shadow-none divide-y divide-slate-100">
                {savedExperiments.slice(0, 3).map((exp) => {
                  const topic = getTopicById(exp.topicId);
                  return (
                    <Link
                      key={exp.id}
                      href={`/${locale}/me/experiments/${exp.slug}`}
                      className="flex items-center justify-between gap-3 p-3 rounded-xl hover:bg-[#F8F7F4] transition-colors group cursor-pointer"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className="size-12 rounded-lg overflow-hidden shrink-0 border border-slate-200/60 bg-slate-900">
                          <ChemIllustration
                            variant={exp.illustration}
                            slug={exp.slug}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="min-w-0 space-y-0.5">
                          <h4 className="text-xs sm:text-sm font-bold text-[#142D40] truncate group-hover:text-[#087F8C] transition-colors">
                            {exp.title[locale]}
                          </h4>
                          <div className="text-[11px] text-[#536574] truncate">
                            {locale === "ky" ? "Тема: " : locale === "ru" ? "Тема: " : "Topic: "}
                            {topic.title[locale]}
                          </div>
                        </div>
                      </div>

                      <Bookmark className="size-4.5 text-[#087F8C] fill-current shrink-0" />
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          {/* MY LAB NOTEBOOKS SECTION */}
          <StudentNotebookSummary locale={locale} />
        </div>
      )}

      {/* =========================================================================
          TAB: SAVED EXPERIMENTS FULL VIEW
          ========================================================================= */}
      {activeTab === "saved" && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-[#142D40]">
                {locale === "ky" ? "Сакталган тажрыйбалар" : locale === "ru" ? "Сохранённые эксперименты" : "Saved Experiments"}
              </h2>
              <p className="text-sm text-[#536574] mt-1">
                {savedExperiments.length} experiments bookmarked for easy reference
              </p>
            </div>
            <Link
              href={`/${locale}/me/learning`}
              className="rounded-lg bg-[#087F8C] hover:bg-[#066670] text-white px-4 py-2 text-xs font-bold transition-colors"
            >
              Browse Library
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {savedExperiments.map((exp) => (
              <Link
                key={exp.id}
                href={`/${locale}/me/experiments/${exp.slug}`}
                className="group rounded-xl border border-slate-200/70 overflow-hidden hover:shadow-md transition-all flex flex-col"
              >
                <div className="h-36 bg-slate-900 overflow-hidden relative">
                  <ChemIllustration
                    variant={exp.illustration}
                    slug={exp.slug}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <Bookmark className="absolute top-3 right-3 size-5 text-[#087F8C] fill-current drop-shadow-sm" />
                </div>
                <div className="p-4 space-y-1">
                  <div className="text-xs font-semibold text-[#087F8C]">
                    {getTopicById(exp.topicId).title[locale]}
                  </div>
                  <h3 className="font-bold text-sm text-[#142D40] group-hover:text-[#087F8C] transition-colors">
                    {exp.title[locale]}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB: MY CLASSROOMS FULL VIEW
          ========================================================================= */}
      {activeTab === "classrooms" && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-[#142D40]">
                {locale === "ky" ? "Менин класстарым" : locale === "ru" ? "Мои классы" : "My Classrooms"}
              </h2>
              <p className="text-sm text-[#536574] mt-1">
                Active classrooms and teacher-led assignments
              </p>
            </div>
          </div>

          <form className="flex flex-wrap gap-3" onSubmit={async e=>{e.preventDefault();setJoining(true);setJoinNotice("");try{await joinClassroom(joinCode);setJoinCode("");setJoinNotice("Classroom joined.");}catch(error){setJoinNotice(error instanceof Error?error.message:"Unable to join classroom.");}finally{setJoining(false);}}}><label className="text-sm">Classroom code<input required className="ml-2 rounded border border-input p-2" value={joinCode} onChange={e=>setJoinCode(e.target.value)} /></label><button type="submit" disabled={joining} className="btn-tactile-primary px-4 py-2">{joining?"Joining…":"Join classroom"}</button><p role="status" className="w-full text-sm">{joinNotice}</p></form>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {(state.classrooms || []).map((cls) => (
              <div
                key={cls.id}
                className="relative rounded-xl border border-slate-200/80 p-5 space-y-3 bg-[#F8F7F4]/40 hover:border-slate-300 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-lg bg-sky-50 text-[#087F8C] flex items-center justify-center font-bold shrink-0">
                      <Users className="size-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-[#142D40]">{cls.name}</h3>
                      <p className="text-xs text-[#536574]">Teacher: {cls.teacherName}</p>
                    </div>
                  </div>

                  {/* Contextual three-dot menu */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() =>
                        setActiveMenuClassId((prev) => (prev === cls.id ? null : cls.id))
                      }
                      className="p-1 rounded-lg text-slate-400 hover:text-[#142D40] hover:bg-white border border-transparent hover:border-slate-200 transition-colors cursor-pointer"
                      title="Classroom options"
                    >
                      <MoreVertical className="size-4" />
                    </button>

                    {activeMenuClassId === cls.id && (
                      <>
                        <div
                          className="fixed inset-0 z-40"
                          onClick={() => setActiveMenuClassId(null)}
                        />
                        <div className="absolute right-0 top-full mt-1 w-44 bg-white rounded-xl border border-slate-200 shadow-lg py-1.5 z-50 text-xs">
                          <button
                            type="button"
                            onClick={() => {
                              setActiveMenuClassId(null);
                              setLeavingClass({ id: cls.id, name: cls.name });
                            }}
                            className="w-full text-left px-3.5 py-1.5 text-rose-600 hover:bg-rose-50 flex items-center gap-2 cursor-pointer font-medium"
                          >
                            <LogOut className="size-3.5" />
                            <span>Leave Classroom</span>
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs text-[#536574]">
                  <span>{cls.assignments?.length || 0} Assignments</span>
                  <span className="font-mono bg-white px-2 py-0.5 rounded border border-slate-200 text-[#142D40]">
                    Code: {cls.joinCode}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* LEAVE CLASSROOM MODAL */}
          {leavingClass && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
              <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full p-6 shadow-2xl relative space-y-4">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                    <LogOut className="size-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#142D40]">Leave Classroom?</h3>
                    <p className="text-xs text-[#536574] mt-0.5">
                      Are you sure you want to leave &quot;{leavingClass.name}&quot;? You will no longer see assignments or notes from this class. Your personal experiment records will remain saved.
                    </p>
                  </div>
                </div>
                {leaveError && <p className="text-xs text-rose-600 font-medium">{leaveError}</p>}
                <div className="pt-2 flex justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      setLeavingClass(null);
                      setLeaveError(null);
                    }}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-[#536574] hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        await leaveClassroom(leavingClass.id);
                        setLeavingClass(null);
                        setLeaveError(null);
                      } catch (err: unknown) {
                        setLeaveError(err instanceof Error ? err.message : "Failed to leave classroom.");
                      }
                    }}
                    className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold"
                  >
                    Leave Classroom
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* SHARED TEACHER LAB NOTES SECTION */}
          <div className="pt-6 border-t border-slate-200/80 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-[#142D40] flex items-center gap-2">
                  <BookOpen className="size-5 text-[#087F8C]" />
                  <span>
                    {locale === "ky"
                      ? "Мугалим бөлүшкөн лабораториялык конспекттер"
                      : locale === "ru"
                      ? "Лабораторные конспекты от преподавателя"
                      : "Shared Teacher Lab Notes"}
                  </span>
                </h3>
                <p className="text-xs text-[#536574] mt-0.5">
                  {locale === "ky"
                    ? "Сиздин мугалимиңиз тарабынан берилген расмий колдонмолор жана тажрыйба көрсөтмөлөрү."
                    : locale === "ru"
                    ? "Официальные указания, шаги методологии и эталонные наблюдения от вашего преподавателя."
                    : "Official lesson guidance, steps, and expected observations published by your teacher."}
                </p>
              </div>
            </div>

            {sharedTeacherNotes.length === 0 ? (
              <div className="p-6 rounded-xl border border-dashed border-slate-200 bg-[#F8F7F4]/50 text-center text-xs text-[#536574]">
                No teacher lab notes have been published for your classrooms yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sharedTeacherNotes.map((share) => {
                  const exp = experiments.find((e) => e.slug === share.experimentSlug);
                  const expTitle = exp?.title[locale] || share.experimentSlug;
                  const topic = exp ? getTopicById(exp.topicId).title[locale] : "Chemistry";

                  return (
                    <div
                      key={share.id}
                      className="rounded-xl border border-slate-200 p-4 bg-white hover:border-[#087F8C]/60 hover:shadow-xs transition-all space-y-3 flex flex-col justify-between"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-semibold text-[#087F8C] uppercase tracking-wider">{topic}</span>
                          <span className="text-[#536574] flex items-center gap-1">
                            <Calendar className="size-3" />
                            {new Date(share.publishedAt).toLocaleDateString(locale === "ky" ? "ky-KG" : locale === "ru" ? "ru-RU" : "en-US", {
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                        </div>

                        <h4 className="font-bold text-sm text-[#142D40] leading-snug">{expTitle}</h4>

                        <div className="text-xs text-[#536574] flex items-center gap-1">
                          <Users className="size-3.5 text-slate-400" />
                          <span>
                            {share.teacherName} · {share.classroomName}
                          </span>
                        </div>

                        {/* Shared sections chips */}
                        <div className="flex flex-wrap gap-1 pt-1">
                          {share.sharedSections.map((sec) => (
                            <span
                              key={sec}
                              className="px-2 py-0.5 rounded bg-sky-50 text-[#087F8C] text-[10px] font-semibold capitalize"
                            >
                              ✓ {sec}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setViewerState({
                              isOpen: true,
                              shares: [share],
                              title: expTitle,
                            });
                          }}
                          className="flex-1 py-1.5 px-3 rounded-lg bg-[#087F8C] hover:bg-[#066670] text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Eye className="size-3.5" />
                          <span>View Notes</span>
                        </button>

                        <Link
                          href={`/${locale}/me/experiments/${share.experimentSlug}`}
                          className="py-1.5 px-3 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-[#142D40] transition-colors flex items-center gap-1"
                        >
                          <span>Open Lab</span>
                          <ArrowRight className="size-3" />
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB: ASSIGNMENTS FULL VIEW
          ========================================================================= */}
      {activeTab === "assignments" && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
          <div>
            <h2 className="text-xl font-bold text-[#142D40]">
              {locale === "ky" ? "Тапшырмалар" : locale === "ru" ? "Все задания" : "All Assignments"}
            </h2>
            <p className="text-sm text-[#536574] mt-1">
              Active chemistry assignments and lab quizzes
            </p>
          </div>

          <div className="divide-y divide-slate-100">
            {upcomingAssignments.map((asgn) => (
              <div key={asgn.id} className="py-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="size-10 rounded-lg bg-slate-100 text-[#536574] flex items-center justify-center">
                    <ClipboardList className="size-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[#142D40]">{asgn.title}</h4>
                    <p className="text-xs text-[#536574]">Due date: {asgn.dueDate}</p>
                  </div>
                </div>
                <Link
                  href={asgn.href}
                  className="rounded-lg bg-[#087F8C] hover:bg-[#066670] text-white px-4 py-2 text-xs font-semibold transition-colors"
                >
                  Start Lab
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* READ-ONLY TEACHER NOTES VIEWER MODAL */}
      <TeacherNotesViewerModal
        isOpen={viewerState.isOpen}
        onClose={() => setViewerState((s) => ({ ...s, isOpen: false }))}
        shares={viewerState.shares}
        experimentTitle={viewerState.title}
        locale={locale}
        isPreviewMode={false}
      />
    </div>
  );
}
