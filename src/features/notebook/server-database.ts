import "server-only";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { SessionUser } from "@/features/auth/server-session";
import type { StudentLabReport, LabReportSaveInput, TeacherLabNotebook, TeacherNotebookSaveInput, TeacherNotebookShare, ShareWithClassInput } from "./types";

// Convert table column names only; nested JSON uses the application's own keys.
function model<T>(row: Record<string, unknown>): T {
  return Object.fromEntries(Object.entries(row).map(([key, value]) => [key.replace(/_([a-z])/g, (_, letter: string) => letter.toUpperCase()), value])) as T;
}
function columns(value: object) {
  return Object.fromEntries(Object.entries(value).filter(([, v]) => v !== undefined).map(([key, v]) => [key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`), v]));
}
function check(error: { message: string } | null) {
  if (error) throw new Error("Database operation failed. Your changes have not been confirmed saved.");
}
function teacherOnly(user: SessionUser) {
  if (!["teacher", "admin"].includes(user.role)) throw new Error("Teacher authorization required.");
}
export async function readReport(user: SessionUser, slug: string, assignment?: string | null) {
  const db = await createSupabaseServerClient();
  let query = db.from("student_lab_reports").select("*").eq("user_id", user.id).eq("experiment_slug", slug);
  query = assignment ? query.eq("assignment_id", assignment) : query.is("assignment_id", null);
  const { data, error } = await query.maybeSingle(); check(error);
  return data ? model<StudentLabReport>(data) : null;
}
export async function listReports(user: SessionUser, teacher = false, assignment?: string | null) {
  if (teacher) teacherOnly(user);
  const db = await createSupabaseServerClient();
  let query = db.from("student_lab_reports").select("*");
  query = teacher ? query.neq("user_id", user.id).in("status", ["submitted", "reviewed"]) : query.eq("user_id", user.id);
  if (assignment) query = query.eq("assignment_id", assignment);
  const { data, error } = await query.order("updated_at", { ascending: false }); check(error);
  return (data ?? []).map(row => model<StudentLabReport>(row));
}
export async function saveReport(user: SessionUser, input: LabReportSaveInput) {
  const existing = await readReport(user, input.experimentSlug, input.assignmentId);
  if (existing?.status === "reviewed" || input.status === "reviewed") throw new Error("Reviewed reports cannot be edited by students.");
  if (existing?.status === "submitted") throw new Error("Withdraw your submission before editing it.");
  const db = await createSupabaseServerClient();
  const payload = { ...columns(input), assignment_id: input.assignmentId || null, user_id: user.id, status: input.status ?? "draft" };
  const result = existing
    ? await db.from("student_lab_reports").update(payload).eq("id", existing.id).select().single()
    : await db.from("student_lab_reports").insert(payload).select().single();
  check(result.error); return model<StudentLabReport>(result.data!);
}
export async function reportStatus(user: SessionUser, slug: string, assignment: string | null | undefined, status: "submitted" | "draft") {
  const existing = await readReport(user, slug, assignment);
  if (!existing || existing.status === "reviewed") throw new Error("An editable report is required.");
  if (status === "submitted" && (!existing.aim.trim() || !existing.observations.trim() || !existing.conclusion.trim())) throw new Error("Complete the aim, observations and conclusion before submitting.");
  const db = await createSupabaseServerClient();
  const { data, error } = await db.from("student_lab_reports").update({ status }).eq("id", existing.id).select().single(); check(error);
  return model<StudentLabReport>(data!);
}
export async function deleteReport(user: SessionUser, slug: string, assignment?: string | null) {
  const existing = await readReport(user, slug, assignment);
  if (!existing) return false;
  if (existing.status !== "draft") throw new Error("Only drafts can be deleted.");
  const db = await createSupabaseServerClient();
  const { data, error } = await db.from("student_lab_reports").delete().eq("id", existing.id).select("id"); check(error);
  return Boolean(data?.length);
}
export async function reviewReport(user: SessionUser, id: string, feedback: string) {
  teacherOnly(user);
  const db = await createSupabaseServerClient();
  const { data, error } = await db.from("student_lab_reports").update({ teacher_feedback: feedback, status: "reviewed", reviewed_by: user.id, reviewed_at: new Date().toISOString() }).eq("id", id).select().single(); check(error);
  return model<StudentLabReport>(data!);
}
export async function readShares(user: SessionUser, slug?: string, classroom?: string | null, owned = false) {
  const db = await createSupabaseServerClient();
  let query = db.from("teacher_notebook_shares").select("*, learning_classrooms(name)");
  if (slug) query = query.eq("experiment_slug", slug);
  if (classroom && classroom !== "all") query = query.eq("classroom_id", classroom);
  if (owned) query = query.eq("teacher_id", user.id);
  const { data, error } = await query.order("updated_at", { ascending: false }); check(error);
  return (data ?? []).map(row => ({ ...model<TeacherNotebookShare>(row), classroomName: (row.learning_classrooms as unknown as { name: string } | null)?.name ?? "Classroom", teacherName: owned ? user.name : "Teacher" }));
}
export async function readNotebook(user: SessionUser, slug: string) {
  teacherOnly(user);
  const db = await createSupabaseServerClient();
  const [{ data, error }, shares] = await Promise.all([db.from("teacher_lab_notebooks").select("*").eq("teacher_id", user.id).eq("experiment_slug", slug).maybeSingle(), readShares(user, slug, null, true)]);
  check(error);
  return { notebook: data ? { ...model<TeacherLabNotebook>(data), teacherName: user.name } : null, shares };
}
export async function listNotebooks(user: SessionUser) {
  teacherOnly(user);
  const db = await createSupabaseServerClient();
  const [{ data, error }, shares] = await Promise.all([db.from("teacher_lab_notebooks").select("*").eq("teacher_id", user.id).order("updated_at", { ascending: false }), readShares(user, undefined, null, true)]);
  check(error);
  return (data ?? []).map(row => ({ ...model<TeacherLabNotebook>(row), teacherName: user.name, shares: shares.filter(share => share.notebookId === row.id) }));
}
export async function saveNotebook(user: SessionUser, input: TeacherNotebookSaveInput) {
  teacherOnly(user);
  const db = await createSupabaseServerClient();
  const { data: existing, error: readError } = await db.from("teacher_lab_notebooks").select("status").eq("teacher_id", user.id).eq("experiment_slug", input.experimentSlug).maybeSingle();
  check(readError);
  const { status: ignoredStatus, ...content } = input;
  void ignoredStatus;
  const { data, error } = await db.from("teacher_lab_notebooks").upsert({ ...columns(content), status: existing?.status ?? "draft", teacher_id: user.id, updated_at: new Date().toISOString() }, { onConflict: "teacher_id,experiment_slug" }).select().single(); check(error);
  return { ...model<TeacherLabNotebook>(data!), teacherName: user.name };
}
export async function shareNotebook(user: SessionUser, input: ShareWithClassInput) {
  teacherOnly(user);
  const db = await createSupabaseServerClient();
  const { error } = await db.rpc("share_teacher_notebook", { p_slug: input.experimentSlug, p_classrooms: input.classroomIds, p_sections: input.sharedSections }); check(error);
  const result = await readNotebook(user, input.experimentSlug);
  if (!result.notebook) throw new Error("Notebook not found.");
  return { notebook: result.notebook, shares: result.shares };
}
export async function revokeShares(user: SessionUser, slug: string, classroom?: string) {
  teacherOnly(user);
  const db = await createSupabaseServerClient();
  const { data, error } = await db.rpc("revoke_teacher_notebook_shares", { p_slug: slug, p_classroom: classroom ?? null }); check(error);
  return Boolean(data);
}
export async function deleteNotebook(user: SessionUser, slug: string) {
  teacherOnly(user);
  const db = await createSupabaseServerClient();
  const { data, error } = await db.from("teacher_lab_notebooks").delete().eq("teacher_id", user.id).eq("experiment_slug", slug).select("id"); check(error);
  return Boolean(data?.length);
}
