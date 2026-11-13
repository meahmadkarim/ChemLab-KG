"use client";

import { ClassroomControls } from "./ClassroomControls";
import React, { useState } from "react";
import Link from "next/link";
import {
  Users,
  GraduationCap,
  ClipboardList,
  ArrowRight,
  Plus,
  User,
  CheckCircle2,
  X,
  Copy,
  Check,
  BookOpen,
  MoreVertical,
  Edit,
  Archive,
  Trash2,
  RotateCcw,
  Download,
} from "lucide-react";
import type { Experiment } from "@/features/experiments/types";
import type { Locale } from "@/i18n/config";
import { useLearningStore } from "@/features/progress/learning-store";
import { useAuthStore } from "@/features/auth/auth-store";
import type { DashboardActiveTab } from "@/components/dashboard/DashboardLayout";
import { ChemIllustration } from "@/components/illustrations/ChemIllustration";
import { TeacherNotebookReviewModal } from "@/features/notebook/components/TeacherNotebookReviewModal";

interface TeacherDashboardClientProps {
  experiments: Experiment[];
  locale: Locale;
  activeTab?: DashboardActiveTab;
}

export function TeacherDashboardClient({
  experiments,
  locale,
  activeTab = "dashboard",
}: TeacherDashboardClientProps) {
  const {
    state,
    createClassroom,
    createAssignment,
    editClassroom,
    archiveClassroom,
    deleteClassroom,
    rotateJoinCode,
    updateAssignmentDeadline,
  } = useLearningStore();
  const { user } = useAuthStore();

  // Modals
  const [showCreateAssignmentModal, setShowCreateAssignmentModal] = useState(false);
  const [showManageClassesModal, setShowManageClassesModal] = useState(false);
  const [showLabReportsModal, setShowLabReportsModal] = useState(false);

  // Classroom management state
  const [classroomTabFilter, setClassroomTabFilter] = useState<"active" | "archived">("active");
  const [activeMenuClassId, setActiveMenuClassId] = useState<string | null>(null);
  const [editingClass, setEditingClass] = useState<{ id: string; name: string } | null>(null);
  const [archivingClass, setArchivingClass] = useState<{ id: string; name: string; archived?: boolean } | null>(null);
  const [deletingClass, setDeletingClass] = useState<{ id: string; name: string } | null>(null);
  const [rosterModal, setRosterModal] = useState<{
    classroomId: string;
    classroomName: string;
    students: Array<{ id: string; name: string; email?: string }>;
    loading: boolean;
  } | null>(null);
  const [editingAssignment, setEditingAssignment] = useState<{
    classroomId: string;
    assignmentId: string;
    title: string;
    dueDate: string;
  } | null>(null);
  const [mgmtError, setMgmtError] = useState<string | null>(null);

  // Form states for Create Classroom
  const [newClassName, setNewClassName] = useState("");
  const [newJoinCode, setNewJoinCode] = useState("");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Form states for Create Assignment
  const [selectedClassId, setSelectedClassId] = useState(
    state.classrooms[0]?.id ?? ""
  );
  const [selectedExpSlug, setSelectedExpSlug] = useState(
    experiments[0]?.slug ?? "red-cabbage-ph-indicator"
  );
  const [dueDate, setDueDate] = useState("");
  const [assignmentNotice, setAssignmentNotice] = useState(false);

  const isDemo = user?.isDemo ?? false;
  const isPendingApproval = user?.teacherStatus === "pending_approval";
  const teacherDisplayName = user?.name || (isDemo ? "Aigul Asanova" : "Teacher");

  // Real Database calculations
  const classrooms = state.classrooms || [];
  const totalClassrooms = isDemo ? (classrooms.length || 4) : classrooms.length;
  const totalStudents = isDemo
    ? (classrooms.reduce((acc, c) => acc + (c.studentCount || 0), 0) || 92)
    : classrooms.reduce((acc, c) => acc + (c.studentCount || 0), 0);
  const totalAssignments = isDemo
    ? (classrooms.reduce((acc, c) => acc + (c.assignments?.length || 0), 0) || 7)
    : classrooms.reduce((acc, c) => acc + (c.assignments?.length || 0), 0);

  // Primary Featured Classroom (Matching Image 2 for demo, real records for registered teachers)
  const featuredClass = classrooms[0] || (isDemo ? {
    id: "cls-naryn-01",
    name: "Naryn Lyceum · Practical Chemistry Lab",
    teacherName: teacherDisplayName,
    studentCount: 26,
    assignments: [
      {
        id: "asgn-01",
        experimentSlug: "red-cabbage-ph-indicator",
        dueDate: "Feb 7, 2025",
        completionPercent: 78,
      },
      {
        id: "asgn-02",
        experimentSlug: "electrolysis-of-water-hoffman",
        dueDate: "Feb 12, 2025",
        completionPercent: 61,
      },
    ],
  } : null);

  // Student Progress records (Matching Image 2 table)
  const studentProgressList = isDemo ? [
    {
      id: "std-1",
      name: "Aibek Zholdoshov",
      completed: "2 / 2",
      quizScore: "92%",
      status: "On Track",
      statusTone: "teal",
    },
    {
      id: "std-2",
      name: "Meerim Abdykadyrova",
      completed: "2 / 2",
      quizScore: "88%",
      status: "On Track",
      statusTone: "teal",
    },
    {
      id: "std-3",
      name: "Erlan Turgunbekov",
      completed: "1 / 2",
      quizScore: "76%",
      status: "In Progress",
      statusTone: "gray",
    },
    {
      id: "std-4",
      name: "Aizada Kadyrova",
      completed: "1 / 2",
      quizScore: "72%",
      status: "In Progress",
      statusTone: "gray",
    },
  ] : state.teacherProgress ?? [];

  // Recent Activity Feed (Matching Image 2)
  const recentActivities = isDemo ? [
    {
      id: "act-1",
      icon: ClipboardList,
      text: "Aibek submitted Red Cabbage pH quiz",
      time: "Today, 10:24 AM",
    },
    {
      id: "act-2",
      icon: Users,
      text: "Meerim joined Naryn Lyceum class",
      time: "Today, 9:17 AM",
    },
    {
      id: "act-3",
      icon: CheckCircle2,
      text: "3 students completed Electrolysis of Water",
      time: "Yesterday, 4:36 PM",
    },
  ] : [];

  // Upcoming Deadlines (Matching Image 2)
  const upcomingDeadlines = classrooms.filter(c=>!c.archived).flatMap(c=>c.assignments).map(a=>({
    id:a.id,
    classroomId: a.classroomId,
    rawDueDate: a.dueDate.slice(0, 10),
    title:experiments.find(e=>e.slug===a.experimentSlug)?.title[locale]??a.experimentSlug,
    dueDate:new Date(a.dueDate).toLocaleDateString(locale),
    href:`/${locale}/teacher-dashboard/experiments/${a.experimentSlug}?assignment=${a.id}`,
  }));

  function handleCopy(code: string) {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  }

  async function handleCreateClassSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!newClassName.trim()) return;
    try {
    await createClassroom({
      name: newClassName.trim(),
      teacherName: teacherDisplayName,
      joinCode: newJoinCode.trim().toUpperCase() || undefined,
    });
    setNewClassName("");
    setNewJoinCode("");
    } catch(error) { window.alert(error instanceof Error ? error.message : "Unable to create classroom."); }
  }

  async function handleCreateAssignmentSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedExpSlug) return;
    try {
    await createAssignment(selectedClassId || classrooms[0]?.id, {
      experimentSlug: selectedExpSlug,
      dueDate,
      permissions: {
        allowHints: true,
        allowAiExplanations: true,
        showImmediateFeedback: true,
        showCorrectAnswers: true,
        allowRetries: true,
      },
    });
    setAssignmentNotice(true);
    setTimeout(() => {
      setAssignmentNotice(false);
      setShowCreateAssignmentModal(false);
    }, 1200);
    } catch(error) { window.alert(error instanceof Error ? error.message : "Unable to create assignment."); }
  }

  async function openRosterModal(classroomId: string, classroomName: string) {
    setMgmtError(null);
    if (isDemo) {
      setRosterModal({
        classroomId,
        classroomName,
        students: studentProgressList.map((s) => ({ id: s.id, name: s.name })),
        loading: false,
      });
      return;
    }
    setRosterModal({ classroomId, classroomName, students: [], loading: true });
    try {
      const res = await fetch("/api/classrooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "roster", classroomId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Unable to load roster.");
      const students = Array.isArray(data.students)
        ? data.students.map((s: { student_id?: string; id?: string; display_name?: string; name?: string; email?: string }) => ({
            id: s.student_id || s.id || "",
            name: s.display_name || s.name || "Student",
            email: s.email,
          }))
        : [];
      setRosterModal({ classroomId, classroomName, students, loading: false });
    } catch (err) {
      setMgmtError(err instanceof Error ? err.message : "Unable to load roster.");
      setRosterModal((prev) => (prev ? { ...prev, loading: false } : null));
    }
  }

  async function handleRemoveStudent(classroomId: string, studentId: string) {
    setMgmtError(null);
    if (!isDemo) {
      try {
        const res = await fetch("/api/classrooms", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "remove-member", classroomId, studentId }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Unable to remove student.");
      } catch (err) {
        setMgmtError(err instanceof Error ? err.message : "Unable to remove student.");
        return;
      }
    }
    setRosterModal((prev) =>
      prev
        ? { ...prev, students: prev.students.filter((s) => s.id !== studentId) }
        : null
    );
  }

  return (
    <div className="w-full space-y-6 sm:space-y-7">
      {/* =========================================================================
          TAB: DEFAULT DASHBOARD (Matches Approved Teacher Dashboard Image 2 Exactly)
          ========================================================================= */}
      {activeTab === "dashboard" && (
        <div className="space-y-6 sm:space-y-7">
          {/* TOP GREETING AREA */}
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#142D40] tracking-tight ">
              {locale === "ky"
                ? `Кайрадан кош келиңиз, ${teacherDisplayName}!`
                : locale === "ru"
                ? `С возвращением, ${teacherDisplayName}!`
                : `Welcome back, ${teacherDisplayName}!`}
            </h1>
            <p className="text-xs sm:text-sm text-[#536574]">
              {locale === "ky"
                ? "Класстарыңызды, тапшырмаларды жана окуучулардын прогрессин бир жерден башкарыңыз."
                : locale === "ru"
                ? "Управляйте классами, заданиями и успеваемостью учеников в одном месте."
                : "Manage your classes, assignments, and student progress in one place."}
            </p>
          </div>

          {/* Pending Verification Notice (if teacher registration is pending approval) */}
          {isPendingApproval && (
            <div className="rounded-xl border border-amber-200 bg-amber-50/80 p-4 text-xs text-amber-900 flex items-start gap-3">
              <div className="size-5 rounded-full bg-amber-200 text-amber-800 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                i
              </div>
              <div className="space-y-0.5">
                <p className="font-semibold">
                  {locale === "ky"
                    ? "Мугалимдик каттоо: Текшерүүдө (Pending Approval)"
                    : locale === "ru"
                    ? "Статус аккаунта: На проверке (Pending Approval)"
                    : "Account Status: Pending Administrator Verification"}
                </p>
                <p className="text-amber-800/90 leading-relaxed">
                  {locale === "ky"
                    ? "Сиздин мугалимдик аккаунтуңуз катталды. Администратор ырастагандан кийин жаңы класстарды түзүү активдешет. Бардык эксперименттер жана материалдар толук жеткиликтүү."
                    : locale === "ru"
                    ? "Ваш учительский аккаунт зарегистрирован. После проверки администратором активируется создание классов и публикация заданий. Все лабораторные материалы доступны для работы."
                    : "Your teacher account is registered. Full classroom management will activate upon administrator verification. All curriculum guides, experiments, and lesson tools are accessible now."}
                </p>
              </div>
            </div>
          )}

          {/* HORIZONTAL SUMMARY METRICS STRIP (Matches Image 2 exactly) */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-xs grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
            {/* Metric 1: Classes */}
            <div className="flex items-center gap-3.5 sm:px-4 py-2 sm:py-0">
              <div className="size-11 rounded-xl bg-slate-100 text-[#536574] flex items-center justify-center shrink-0">
                <Users className="size-5" />
              </div>
              <div>
                <div className="text-xs text-[#536574] font-medium">
                  {locale === "ky" ? "Класстар" : locale === "ru" ? "Классы" : "Classes"}
                </div>
                <div className="text-2xl font-bold text-[#142D40]">
                  {totalClassrooms}
                </div>
              </div>
            </div>

            {/* Metric 2: Students */}
            <div className="flex items-center gap-3.5 sm:px-6 py-2 sm:py-0">
              <div className="size-11 rounded-xl bg-slate-100 text-[#536574] flex items-center justify-center shrink-0">
                <GraduationCap className="size-5" />
              </div>
              <div>
                <div className="text-xs text-[#536574] font-medium">
                  {locale === "ky" ? "Окуучулар" : locale === "ru" ? "Ученики" : "Students"}
                </div>
                <div className="text-2xl font-bold text-[#142D40]">
                  {totalStudents}
                </div>
              </div>
            </div>

            {/* Metric 3: Active assignments */}
            <div className="flex items-center gap-3.5 sm:px-6 py-2 sm:py-0">
              <div className="size-11 rounded-xl bg-slate-100 text-[#536574] flex items-center justify-center shrink-0">
                <ClipboardList className="size-5" />
              </div>
              <div>
                <div className="text-xs text-[#536574] font-medium">
                  {locale === "ky" ? "Активдүү тапшырмалар" : locale === "ru" ? "Активные задания" : "Active assignments"}
                </div>
                <div className="text-2xl font-bold text-[#142D40]">
                  {totalAssignments}
                </div>
              </div>
            </div>
          </div>

          {/* MAIN CONTENT: 2 COLUMNS (LEFT 62%, RIGHT 38%) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
            {/* LEFT COLUMN: FEATURED CLASSROOM + STUDENT PROGRESS */}
            <div className="lg:col-span-7 xl:col-span-8 space-y-6">
              {/* COMPONENT 1: FEATURED CLASSROOM */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <h2 className="text-base sm:text-lg font-bold text-[#142D40]">
                    {locale === "ky"
                      ? "Тандалган класс"
                      : locale === "ru"
                      ? "Избранный класс"
                      : "Featured Classroom"}
                  </h2>
                  <button
                    type="button"
                    onClick={() => setShowManageClassesModal(true)}
                    className="text-xs sm:text-sm font-semibold text-[#087F8C] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>
                      {locale === "ky"
                        ? "Классты көрүү"
                        : locale === "ru"
                        ? "Открыть класс"
                        : "View Classroom"}
                    </span>
                    <ArrowRight className="size-3.5" />
                  </button>
                </div>

                {/* White Card Container */}
                <div className="bg-white rounded-none border border-slate-200 p-5 sm:p-6 shadow-none space-y-4">
                  {featuredClass ? (
                    <>
                      {/* Top Classroom Title + Thumbnail */}
                      <div className="flex items-center gap-4">
                        <div className="w-20 sm:w-24 h-14 sm:h-16 rounded-xl overflow-hidden shrink-0 border border-slate-200 bg-slate-900">
                          <ChemIllustration
                            variant="indicator-flask"
                            slug="red-cabbage-ph-indicator"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="text-base sm:text-lg font-bold text-[#142D40]">
                            {featuredClass.name}
                          </h3>
                          <div className="text-xs text-[#536574] flex items-center gap-1.5 mt-0.5">
                            <User className="size-3.5 text-[#536574]" />
                            <span>Teacher: {teacherDisplayName}</span>
                          </div>
                        </div>
                      </div>

                      <div className="divide-y divide-slate-100">{featuredClass.assignments.map(assignment=><Link key={assignment.id} className="flex items-center justify-between gap-3 py-3 text-sm" href={`/${locale}/teacher-dashboard/experiments/${assignment.experimentSlug}?assignment=${assignment.id}`}><span className="font-semibold">{experiments.find(e=>e.slug===assignment.experimentSlug)?.title[locale]??assignment.experimentSlug}</span><span>Due {new Date(assignment.dueDate).toLocaleDateString(locale)}</span></Link>)}{featuredClass.assignments.length===0&&<p className="py-3 text-sm text-ink-soft">No assignments yet.</p>}</div>
                    </>
                  ) : (
                    <div className="py-8 px-4 text-center space-y-3">
                      <div className="size-12 rounded-full bg-slate-100 text-[#536574] flex items-center justify-center mx-auto">
                        <Users className="size-6" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-sm font-bold text-[#142D40]">
                          {locale === "ky" ? "Азырынча класстар жок" : locale === "ru" ? "У вас пока нет классов" : "No classrooms yet"}
                        </h3>
                        <p className="text-xs text-[#536574] max-w-sm mx-auto leading-relaxed">
                          {locale === "ky"
                            ? "Окуучуларды кошуп, лабораториялык тапшырмаларды берүү үчүн биринчи классыңызды түзүңүз."
                            : locale === "ru"
                            ? "Создайте свой первый класс, чтобы приглашать учеников и назначать лабораторные работы."
                            : "Set up your first classroom to invite students and assign interactive experiments."}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowManageClassesModal(true)}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-[#087F8C] hover:bg-[#066670] text-white px-4 py-2 text-xs font-semibold cursor-pointer transition-colors shadow-2xs"
                      >
                        <Plus className="size-3.5" />
                        <span>{locale === "ky" ? "Класс түзүү" : locale === "ru" ? "Создать класс" : "Create Classroom"}</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* COMPONENT 2: STUDENT PROGRESS TABLE (Matches Image 2) */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <h2 className="text-base sm:text-lg font-bold text-[#142D40]">
                    {locale === "ky"
                      ? "Окуучулардын прогресси"
                      : locale === "ru"
                      ? "Успеваемость учеников"
                      : "Student Progress"}
                  </h2>
                  <Link
                    href={`/${locale}/teacher-dashboard?tab=progress`}
                    className="text-xs sm:text-sm font-semibold text-[#087F8C] hover:underline flex items-center gap-1"
                  >
                    <span>
                      {locale === "ky"
                        ? "Толук көрүү"
                        : locale === "ru"
                        ? "Подробный отчёт"
                        : "View Full Progress"}
                    </span>
                    <ArrowRight className="size-3.5" />
                  </Link>
                </div>

                {/* White Table Container */}
                <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-xs overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs sm:text-sm">
                    <thead>
                      <tr className="border-b border-slate-100 text-xs font-semibold text-[#536574]">
                        <th className="pb-3 font-semibold">Student</th>
                        <th className="pb-3 font-semibold">Completed</th>
                        <th className="pb-3 font-semibold">Quiz Score</th>
                        <th className="pb-3 font-semibold text-right sm:text-left">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {studentProgressList.map((std) => (
                        <tr key={std.id} className="hover:bg-[#F8F7F4]/60 transition-colors">
                          <td className="py-3 font-bold text-[#142D40]">
                            {std.name}
                          </td>
                          <td className="py-3 text-[#536574] font-medium">
                            {std.completed}
                          </td>
                          <td className="py-3 font-semibold text-[#142D40]">
                            {std.quizScore}
                          </td>
                          <td className="py-3 text-right sm:text-left">
                            <span
                              className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full inline-block ${
                                std.statusTone === "teal"
                                  ? "bg-teal-50 text-[#087F8C] border border-teal-100"
                                  : "bg-slate-100 text-slate-600"
                              }`}
                            >
                              {std.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: QUICK ACTIONS + RECENT ACTIVITY + UPCOMING DEADLINES */}
            <div className="lg:col-span-5 xl:col-span-4 space-y-6">
              {/* COMPONENT 1: QUICK ACTIONS */}
              <div className="space-y-2.5">
                <h2 className="text-base sm:text-lg font-bold text-[#142D40]">
                  {locale === "ky"
                    ? "Ыкчам аракеттер"
                    : locale === "ru"
                    ? "Быстрые действия"
                    : "Quick Actions"}
                </h2>

                <div className="space-y-2.5">
                  <button
                    type="button"
                    onClick={() => setShowCreateAssignmentModal(true)}
                    className="w-full py-3 px-4 rounded-xl bg-[#087F8C] hover:bg-[#066670] text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-2xs"
                  >
                    <Plus className="size-4 stroke-[2.5]" />
                    <span>Create Assignment</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowManageClassesModal(true)}
                    className="w-full py-3 px-4 rounded-xl bg-white hover:bg-slate-50 text-[#142D40] border border-slate-200/80 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-2xs"
                  >
                    <Users className="size-4 text-[#536574]" />
                    <span>Manage Classes</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowLabReportsModal(true)}
                    className="w-full py-3 px-4 rounded-xl bg-white hover:bg-slate-50 text-[#087F8C] border border-[#087F8C]/30 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-2xs"
                  >
                    <BookOpen className="size-4 text-[#087F8C]" />
                    <span>Review Lab Notebooks</span>
                  </button>
                </div>
              </div>

              {/* COMPONENT 2: RECENT ACTIVITY */}
              <div className="space-y-2.5">
                <h2 className="text-base sm:text-lg font-bold text-[#142D40]">
                  {locale === "ky"
                    ? "Акыркы аракеттер"
                    : locale === "ru"
                    ? "Недавняя активность"
                    : "Recent Activity"}
                </h2>

                {/* White Card Container */}
                <div className="bg-white rounded-2xl border border-slate-200/80 p-3 sm:p-4 shadow-xs divide-y divide-slate-100">
                  {recentActivities.map((act) => {
                    const Icon = act.icon;
                    return (
                      <div key={act.id} className="py-2.5 first:pt-1 last:pb-1 flex items-start gap-3">
                        <div className="size-8 rounded-lg bg-slate-100 text-[#536574] flex items-center justify-center shrink-0 mt-0.5">
                          <Icon className="size-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-semibold text-[#142D40] leading-snug">
                            {act.text}
                          </div>
                          <div className="text-[11px] text-[#536574] mt-0.5">
                            {act.time}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* COMPONENT 3: UPCOMING DEADLINES */}
              <div className="space-y-2.5">
                <h2 className="text-base sm:text-lg font-bold text-[#142D40]">
                  {locale === "ky"
                    ? "Алдадагы мөөнөттөр"
                    : locale === "ru"
                    ? "Ближайшие дедлайны"
                    : "Upcoming Deadlines"}
                </h2>

                {/* White Card Container */}
                <div className="bg-white rounded-2xl border border-slate-200/80 p-3 sm:p-4 shadow-xs divide-y divide-slate-100">
                  {upcomingDeadlines.map((dl) => (
                    <Link
                      key={dl.id}
                      href={dl.href}
                      className="py-2.5 first:pt-1 last:pb-1 flex items-center gap-3 hover:bg-[#F8F7F4] rounded-lg px-2 -mx-2 transition-colors group cursor-pointer"
                    >
                      <div className="size-8 rounded-lg bg-slate-100 text-[#536574] group-hover:text-[#087F8C] flex items-center justify-center shrink-0 transition-colors">
                        <ClipboardList className="size-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-[#142D40] group-hover:text-[#087F8C] transition-colors truncate">
                          {dl.title}
                        </div>
                        <div className="text-[11px] text-[#536574]">
                          {dl.dueDate}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB: CLASSROOMS FULL VIEW
          ========================================================================= */}
      {activeTab === "classrooms" && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-[#142D40]">Manage Classrooms</h2>
              <p className="text-sm text-[#536574] mt-1">
                Create classes, invite students with codes, and view enrolled rosters.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="inline-flex p-1 rounded-xl bg-[#F8F7F4] border border-slate-200/80 text-xs">
                <button
                  type="button"
                  onClick={() => setClassroomTabFilter("active")}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
                    classroomTabFilter === "active"
                      ? "bg-white text-[#142D40] shadow-xs"
                      : "text-[#536574] hover:text-[#142D40]"
                  }`}
                >
                  Active ({classrooms.filter((c) => !c.archived).length})
                </button>
                <button
                  type="button"
                  onClick={() => setClassroomTabFilter("archived")}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
                    classroomTabFilter === "archived"
                      ? "bg-white text-[#142D40] shadow-xs"
                      : "text-[#536574] hover:text-[#142D40]"
                  }`}
                >
                  Archived ({classrooms.filter((c) => c.archived).length})
                </button>
              </div>
              <button
                type="button"
                onClick={() => setShowManageClassesModal(true)}
                className="rounded-lg bg-[#087F8C] hover:bg-[#066670] text-white px-4 py-2 text-xs font-bold transition-colors cursor-pointer"
              >
                + New Classroom
              </button>
            </div>
          </div>

          {(() => {
            const displayList = classrooms.filter((cls) =>
              classroomTabFilter === "archived" ? Boolean(cls.archived) : !cls.archived
            );

            if (displayList.length === 0) {
              return (
                <div className="p-10 rounded-2xl border border-dashed border-slate-200 bg-[#F8F7F4]/40 text-center space-y-2">
                  <p className="text-sm font-semibold text-[#142D40]">
                    {classroomTabFilter === "archived"
                      ? "No archived classrooms"
                      : "No active classrooms yet"}
                  </p>
                  <p className="text-xs text-[#536574]">
                    {classroomTabFilter === "archived"
                      ? "Classrooms you archive will appear here safely preserved."
                      : "Create a classroom above and share the join code with your students."}
                  </p>
                </div>
              );
            }

            return (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {displayList.map((cls) => (
                  <div
                    key={cls.id}
                    className="relative rounded-xl border border-slate-200/80 p-5 space-y-3 bg-[#F8F7F4]/40 hover:border-slate-300 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-sm text-[#142D40]">{cls.name}</h3>
                          {cls.archived && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-200 text-[#536574]">
                              Archived
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-[#536574] mt-0.5">Teacher: {cls.teacherName}</p>
                      </div>

                      {!isDemo && <ClassroomControls classroom={cls} />}
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleCopy(cls.joinCode)}
                          className="inline-flex items-center gap-1 font-mono text-xs bg-white border border-slate-200 px-2 py-1 rounded text-[#087F8C] font-semibold hover:bg-slate-50 cursor-pointer"
                        >
                          <span>{cls.joinCode}</span>
                          {copiedCode === cls.joinCode ? (
                            <Check className="size-3 text-emerald-600" />
                          ) : (
                            <Copy className="size-3 text-slate-400" />
                          )}
                        </button>

                        {/* Three-dot Contextual Action Menu */}
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
                                    setEditingClass({ id: cls.id, name: cls.name });
                                  }}
                                  className="w-full text-left px-3.5 py-1.5 text-[#142D40] hover:bg-slate-50 flex items-center gap-2 cursor-pointer font-medium"
                                >
                                  <Edit className="size-3.5 text-[#087F8C]" />
                                  <span>Edit Name</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setActiveMenuClassId(null);
                                    void openRosterModal(cls.id, cls.name);
                                  }}
                                  className="w-full text-left px-3.5 py-1.5 text-[#142D40] hover:bg-slate-50 flex items-center gap-2 cursor-pointer font-medium"
                                >
                                  <Users className="size-3.5 text-[#087F8C]" />
                                  <span>Manage Roster</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={async () => {
                                    setActiveMenuClassId(null);
                                    try {
                                      await rotateJoinCode(cls.id);
                                    } catch (err) {
                                      window.alert(err instanceof Error ? err.message : "Unable to rotate join code.");
                                    }
                                  }}
                                  className="w-full text-left px-3.5 py-1.5 text-[#142D40] hover:bg-slate-50 flex items-center gap-2 cursor-pointer font-medium"
                                >
                                  <RotateCcw className="size-3.5 text-[#087F8C]" />
                                  <span>Rotate Join Code</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setActiveMenuClassId(null);
                                    setArchivingClass({
                                      id: cls.id,
                                      name: cls.name,
                                      archived: cls.archived,
                                    });
                                  }}
                                  className="w-full text-left px-3.5 py-1.5 text-[#142D40] hover:bg-slate-50 flex items-center gap-2 cursor-pointer font-medium"
                                >
                                  {cls.archived ? (
                                    <>
                                      <RotateCcw className="size-3.5 text-[#087F8C]" />
                                      <span>Restore Class</span>
                                    </>
                                  ) : (
                                    <>
                                      <Archive className="size-3.5 text-amber-600" />
                                      <span>Archive Class</span>
                                    </>
                                  )}
                                </button>
                                <div className="border-t border-slate-100 my-1" />
                                <button
                                  type="button"
                                  onClick={() => {
                                    setActiveMenuClassId(null);
                                    setDeletingClass({ id: cls.id, name: cls.name });
                                  }}
                                  className="w-full text-left px-3.5 py-1.5 text-rose-600 hover:bg-rose-50 flex items-center gap-2 cursor-pointer font-medium"
                                >
                                  <Trash2 className="size-3.5" />
                                  <span>Delete Class</span>
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="text-xs text-[#536574] flex items-center justify-between pt-2 border-t border-slate-200/60">
                      <span>{cls.studentCount || 26} Students Enrolled</span>
                      <span>{cls.assignments?.length || 2} Assignments</span>
                    </div>
                  </div>
                ))}
              </div>
            );
          })()}
        </div>
      )}

      {/* =========================================================================
          TAB: ASSIGNMENTS FULL VIEW
          ========================================================================= */}
      {activeTab === "assignments" && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-[#142D40]">Classroom Assignments</h2>
              <p className="text-sm text-[#536574] mt-1">
                Assign experiments, set deadlines, and configure AI tutor support.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowCreateAssignmentModal(true)}
              className="rounded-lg bg-[#087F8C] hover:bg-[#066670] text-white px-4 py-2 text-xs font-bold transition-colors cursor-pointer"
            >
              + Create Assignment
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {upcomingDeadlines.map((dl) => (
              <div key={dl.id} className="py-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="size-10 rounded-lg bg-slate-100 text-[#536574] flex items-center justify-center">
                    <ClipboardList className="size-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[#142D40]">{dl.title}</h4>
                    <p className="text-xs text-[#536574]">{dl.dueDate}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setEditingAssignment({
                        classroomId: dl.classroomId,
                        assignmentId: dl.id,
                        title: dl.title,
                        dueDate: dl.rawDueDate,
                      })
                    }
                    className="rounded-lg border border-slate-200 hover:bg-slate-50 text-[#536574] hover:text-[#142D40] px-3 py-2 text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Edit Deadline
                  </button>
                  <Link
                    href={dl.href}
                    className="rounded-lg bg-slate-100 hover:bg-slate-200 text-[#142D40] px-4 py-2 text-xs font-semibold transition-colors"
                  >
                    Review Lab
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB: STUDENT PROGRESS FULL VIEW
          ========================================================================= */}
      {activeTab === "progress" && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-[#142D40]">Full Student Roster & Progress</h2>
              <p className="text-sm text-[#536574] mt-1">
                Real-time completion rates, quiz scores, and student status.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                const escapeCsv = (val: string) => {
                  const safe = /^[=+\-@]/.test(val) ? `'${val}` : val;
                  return `"${safe.replace(/"/g, '""')}"`;
                };
                const headers = ["Student Name", "Experiments Completed", "Average Quiz Score", "Overall Status"];
                const rows = studentProgressList.map((std) =>
                  [std.name, String(std.completed), String(std.quizScore), std.status]
                    .map(escapeCsv)
                    .join(",")
                );
                const csv = "\uFEFF" + [headers.map(escapeCsv).join(","), ...rows].join("\r\n");
                const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `chemlab-class-progress-${new Date().toISOString().slice(0, 10)}.csv`;
                a.click();
                URL.revokeObjectURL(url);
              }}
              disabled={studentProgressList.length === 0}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-[#142D40] hover:bg-slate-50 disabled:opacity-50 transition-colors cursor-pointer"
            >
              <Download className="h-3.5 w-3.5" />
              {locale === "ky" ? "CSV жүктөп алуу" : locale === "ru" ? "Скачать CSV" : "Export CSV"}
            </button>
          </div>

          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-xs font-semibold text-[#536574]">
                <th className="pb-3 font-semibold">Student Name</th>
                <th className="pb-3 font-semibold">Experiments Completed</th>
                <th className="pb-3 font-semibold">Average Quiz Score</th>
                <th className="pb-3 font-semibold">Overall Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {studentProgressList.map((std) => (
                <tr key={std.id} className="hover:bg-[#F8F7F4]/60">
                  <td className="py-3.5 font-bold text-[#142D40]">{std.name}</td>
                  <td className="py-3.5 text-[#536574] font-medium">{std.completed}</td>
                  <td className="py-3.5 font-semibold text-[#142D40]">{std.quizScore}</td>
                  <td className="py-3.5">
                    <span
                      className={`text-xs font-semibold px-2.5 py-0.5 rounded-full inline-block ${
                        std.statusTone === "teal"
                          ? "bg-teal-50 text-[#087F8C] border border-teal-100"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {std.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* =========================================================================
          MODAL 1: CREATE ASSIGNMENT
          ========================================================================= */}
      {showCreateAssignmentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-lg w-full p-6 shadow-2xl relative">
            <button
              type="button"
              onClick={() => setShowCreateAssignmentModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
            >
              <X className="size-5" />
            </button>

            <h3 className="text-lg font-bold text-[#142D40] mb-1">
              Create New Lab Assignment
            </h3>
            <p className="text-xs text-[#536574] mb-5">
              Select an experiment and assign it to your chemistry classroom.
            </p>

            {assignmentNotice ? (
              <div className="p-4 rounded-xl bg-teal-50 border border-teal-100 text-[#087F8C] text-sm font-semibold flex items-center gap-2">
                <Check className="size-4" />
                <span>Assignment published successfully!</span>
              </div>
            ) : (
              <form onSubmit={handleCreateAssignmentSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#142D40] mb-1">
                    Select Classroom
                  </label>
                  <select
                    value={selectedClassId}
                    onChange={(e) => setSelectedClassId(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs text-[#142D40] bg-white focus:outline-none focus:border-[#087F8C]"
                  >
                    {classrooms.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#142D40] mb-1">
                    Select Chemistry Experiment
                  </label>
                  <select
                    value={selectedExpSlug}
                    onChange={(e) => setSelectedExpSlug(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs text-[#142D40] bg-white focus:outline-none focus:border-[#087F8C]"
                  >
                    {experiments.map((e) => (
                      <option key={e.slug} value={e.slug}>
                        {e.title[locale]}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#142D40] mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    required
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs text-[#142D40] bg-white focus:outline-none focus:border-[#087F8C]"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setShowCreateAssignmentModal(false)}
                    className="px-4 py-2 rounded-lg text-xs font-semibold text-[#536574] hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-lg bg-[#087F8C] hover:bg-[#066670] text-white text-xs font-bold transition-colors cursor-pointer"
                  >
                    Publish Assignment
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 2: MANAGE CLASSES
          ========================================================================= */}
      {showManageClassesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-lg w-full p-6 shadow-2xl relative">
            <button
              type="button"
              onClick={() => setShowManageClassesModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
            >
              <X className="size-5" />
            </button>

            <h3 className="text-lg font-bold text-[#142D40] mb-1">
              Classroom Management
            </h3>
            <p className="text-xs text-[#536574] mb-4">
              Share join codes with students to invite them to your lab roster.
            </p>

            <div className="space-y-3 max-h-56 overflow-y-auto pr-1 mb-5">
              {classrooms.map((c) => (
                <div
                  key={c.id}
                  className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-[#F8F7F4]/50"
                >
                  <div>
                    <h4 className="text-xs font-bold text-[#142D40]">{c.name}</h4>
                    <p className="text-[11px] text-[#536574]">
                      {c.studentCount || 26} students enrolled
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(c.joinCode)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded bg-white border border-slate-200 font-mono text-xs font-semibold text-[#087F8C] hover:bg-slate-50 cursor-pointer"
                  >
                    <span>{c.joinCode}</span>
                    {copiedCode === c.joinCode ? (
                      <Check className="size-3 text-emerald-600" />
                    ) : (
                      <Copy className="size-3 text-slate-400" />
                    )}
                  </button>
                </div>
              ))}
            </div>

            <form onSubmit={handleCreateClassSubmit} className="pt-4 border-t border-slate-100 space-y-3">
              <h4 className="text-xs font-bold text-[#142D40]">Add New Class</h4>
              <div className="flex gap-2">
                <input
                  type="text"
                  required
                  placeholder="e.g. Grade 10-A Chemistry"
                  value={newClassName}
                  onChange={(e) => setNewClassName(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-lg border border-slate-200 text-xs text-[#142D40] focus:outline-none focus:border-[#087F8C]"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#087F8C] hover:bg-[#066670] text-white text-xs font-bold cursor-pointer"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT CLASSROOM */}
      {editingClass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full p-6 shadow-2xl relative space-y-4">
            <h3 className="text-base font-bold text-[#142D40]">Edit Classroom Name</h3>
            <p className="text-xs text-[#536574]">
              Updating the name will update it for all enrolled students without altering student rosters or the join code.
            </p>
            <input
              type="text"
              value={editingClass.name}
              onChange={(e) => setEditingClass({ ...editingClass, name: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-[#142D40] focus:ring-2 focus:ring-[#087F8C] focus:outline-none"
              placeholder="Classroom Name"
            />
            {mgmtError && <p className="text-xs text-rose-600 font-medium">{mgmtError}</p>}
            <div className="pt-2 flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setEditingClass(null);
                  setMgmtError(null);
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-[#536574] hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  if (!editingClass.name.trim()) return;
                  try {
                    await editClassroom(editingClass.id, editingClass.name.trim());
                    setEditingClass(null);
                    setMgmtError(null);
                  } catch (err: unknown) {
                    setMgmtError(err instanceof Error ? err.message : "Failed to update classroom.");
                  }
                }}
                className="px-4 py-2 rounded-xl bg-[#087F8C] hover:bg-[#066670] text-white text-xs font-bold"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ARCHIVE CLASSROOM */}
      {archivingClass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full p-6 shadow-2xl relative space-y-4">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                <Archive className="size-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#142D40]">
                  {archivingClass.archived ? "Restore Classroom?" : "Archive Classroom?"}
                </h3>
                <p className="text-xs text-[#536574] mt-0.5">
                  {archivingClass.archived
                    ? `Restore "${archivingClass.name}" back to your active classrooms list.`
                    : `Archive "${archivingClass.name}". It will be hidden from active lists, but all historical assignments, scores, and submissions are preserved.`}
                </p>
              </div>
            </div>
            {mgmtError && <p className="text-xs text-rose-600 font-medium">{mgmtError}</p>}
            <div className="pt-2 flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setArchivingClass(null);
                  setMgmtError(null);
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-[#536574] hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  try {
                    await archiveClassroom(archivingClass.id, !archivingClass.archived);
                    setArchivingClass(null);
                    setMgmtError(null);
                  } catch (err: unknown) {
                    setMgmtError(err instanceof Error ? err.message : "Failed to archive classroom.");
                  }
                }}
                className="px-4 py-2 rounded-xl bg-[#087F8C] hover:bg-[#066670] text-white text-xs font-bold"
              >
                {archivingClass.archived ? "Restore Classroom" : "Archive Classroom"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: DELETE CLASSROOM */}
      {deletingClass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full p-6 shadow-2xl relative space-y-4">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                <Trash2 className="size-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#142D40]">Delete Classroom?</h3>
                <p className="text-xs text-[#536574] mt-0.5">
                  Are you sure you want to permanently delete &quot;{deletingClass.name}&quot;? If you simply want to close the semester, archiving is recommended instead.
                </p>
              </div>
            </div>
            {mgmtError && <p className="text-xs text-rose-600 font-medium">{mgmtError}</p>}
            <div className="pt-2 flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setDeletingClass(null);
                  setMgmtError(null);
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-[#536574] hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  try {
                    await deleteClassroom(deletingClass.id);
                    setDeletingClass(null);
                    setMgmtError(null);
                  } catch (err: unknown) {
                    setMgmtError(err instanceof Error ? err.message : "Failed to delete classroom.");
                  }
                }}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold"
              >
                Delete Classroom
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: MANAGE CLASSROOM ROSTER */}
      {rosterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full p-6 shadow-2xl relative space-y-4">
            <button
              type="button"
              onClick={() => {
                setRosterModal(null);
                setMgmtError(null);
              }}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
            >
              <X className="size-4" />
            </button>

            <div>
              <h3 className="text-base font-bold text-[#142D40]">Classroom Roster</h3>
              <p className="text-xs text-[#536574] mt-0.5">{rosterModal.classroomName}</p>
            </div>

            {rosterModal.loading ? (
              <div className="py-6 text-center text-xs text-[#536574]">Loading enrolled students...</div>
            ) : rosterModal.students.length === 0 ? (
              <div className="py-6 text-center text-xs text-[#536574] bg-[#F8F7F4]/60 rounded-xl border border-dashed border-slate-200">
                No students are currently enrolled in this classroom.
              </div>
            ) : (
              <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto pr-1">
                {rosterModal.students.map((student) => (
                  <div key={student.id} className="py-2.5 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold text-[#142D40]">{student.name}</p>
                      {student.email && (
                        <p className="text-[11px] text-[#536574]">{student.email}</p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => void handleRemoveStudent(rosterModal.classroomId, student.id)}
                      className="px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-rose-50 hover:border-rose-200 text-[11px] font-semibold text-rose-600 transition-colors cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}

            {mgmtError && <p className="text-xs text-rose-600 font-medium">{mgmtError}</p>}

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setRosterModal(null);
                  setMgmtError(null);
                }}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-[#142D40] cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: EDIT ASSIGNMENT DEADLINE */}
      {editingAssignment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full p-6 shadow-2xl relative space-y-4">
            <h3 className="text-base font-bold text-[#142D40]">Edit Assignment Deadline</h3>
            <p className="text-xs text-[#536574]">{editingAssignment.title}</p>
            <div>
              <label className="block text-xs font-bold text-[#142D40] mb-1">Due Date</label>
              <input
                type="date"
                value={editingAssignment.dueDate}
                onChange={(e) =>
                  setEditingAssignment({ ...editingAssignment, dueDate: e.target.value })
                }
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-[#142D40] focus:ring-2 focus:ring-[#087F8C] focus:outline-none"
              />
            </div>
            {mgmtError && <p className="text-xs text-rose-600 font-medium">{mgmtError}</p>}
            <div className="pt-2 flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setEditingAssignment(null);
                  setMgmtError(null);
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-[#536574] hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  if (!editingAssignment.dueDate) return;
                  try {
                    await updateAssignmentDeadline(
                      editingAssignment.classroomId,
                      editingAssignment.assignmentId,
                      editingAssignment.dueDate
                    );
                    setEditingAssignment(null);
                    setMgmtError(null);
                  } catch (err) {
                    setMgmtError(err instanceof Error ? err.message : "Failed to update deadline.");
                  }
                }}
                className="px-4 py-2 rounded-xl bg-[#087F8C] hover:bg-[#066670] text-white text-xs font-bold cursor-pointer"
              >
                Save Deadline
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lab Notebooks Review Modal */}
      <TeacherNotebookReviewModal
        isOpen={showLabReportsModal}
        onClose={() => setShowLabReportsModal(false)}
        locale={locale}
      />
    </div>
  );
}
