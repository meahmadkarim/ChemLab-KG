import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { SessionUser } from "@/features/auth/server-session";
import { COLD_START_LEARNER_STATE, INITIAL_ACTIVE_LEARNER_STATE, type StudentLearningState } from "./learning-state";

export async function readLearningState(user: SessionUser): Promise<StudentLearningState> {
  if (user.isDemo) return structuredClone(INITIAL_ACTIVE_LEARNER_STATE);
  const client = await createSupabaseServerClient();
  const [preferences, attempts, classrooms] = await Promise.all([
    client.from("learning_preferences").select("*").eq("user_id", user.id).maybeSingle(),
    client.from("learning_attempts").select("*").eq("user_id", user.id).order("completed_at", { ascending: false }),
    client.from("learning_classrooms").select("*, learning_assignments(*)"),
  ]);
  if (preferences.error || attempts.error || classrooms.error) throw new Error("Unable to load learning records.");
  const quizAttempts = (attempts.data ?? []).map(a => ({ id: a.id, experimentSlug: a.experiment_slug, topicId: a.topic_id, score: a.score, total: a.total, completedAt: a.completed_at, assignmentId: a.assignment_id, responses: a.responses }));
  const teacher = ["teacher", "admin"].includes(user.role) ? await client.rpc("get_teacher_progress") : null;
  if (teacher?.error) throw new Error("Unable to load classroom progress.");
  const counts = new Map<string, number>((teacher?.data?.classrooms ?? []).map((c: { id: string; studentCount: number }) => [c.id, c.studentCount]));
  return {
    ...COLD_START_LEARNER_STATE,
    teacherProgress: teacher?.data?.students ?? [],
    profileMode: quizAttempts.length ? "active_learner" : "cold_start",
    viewedSlugs: preferences.data?.viewed_slugs ?? [],
    bookmarkedSlugs: preferences.data?.bookmarked_slugs ?? [],
    explicitInterests: preferences.data?.interests ?? [],
    completedSlugs: [...new Set<string>(quizAttempts.map(a => a.experimentSlug))],
    quizAttempts,
    classrooms: (classrooms.data ?? []).map(c => ({ id: c.id, name: c.name, archived: c.archived, teacherName: c.teacher_id === user.id ? user.name : "Classroom teacher", joinCode: c.join_code, studentCount: counts.get(c.id) ?? 0, assignments: (c.learning_assignments ?? []).map((a: { id: string; experiment_slug: string; due_date: string; permissions: StudentLearningState["classrooms"][number]["assignments"][number]["permissions"] }) => ({ id: a.id, classroomId: c.id, experimentSlug: a.experiment_slug, dueDate: a.due_date, permissions: a.permissions })) })),
  };
}
