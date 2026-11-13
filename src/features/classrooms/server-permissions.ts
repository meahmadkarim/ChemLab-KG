import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { TeacherQuizPermissions } from "@/features/progress/learning-state";

export const PRACTICE_PERMISSIONS: TeacherQuizPermissions = { allowHints: true, allowAiExplanations: true, showImmediateFeedback: true, showCorrectAnswers: true, allowRetries: true };

export async function assignmentPermissions(id: unknown, slug: string): Promise<TeacherQuizPermissions> {
  if (id === undefined || id === null) return PRACTICE_PERMISSIONS;
  if (typeof id !== "string" || !/^[0-9a-f-]{36}$/i.test(id)) throw new Error("Invalid assignment.");
  const client = await createSupabaseServerClient();
  const { data, error } = await client.from("learning_assignments").select("permissions, due_date").eq("id", id).eq("experiment_slug", slug).single();
  if (error || !data) throw new Error("Assignment is not accessible.");
  if (Date.parse(data.due_date) < Date.now()) throw new Error("Assignment is closed.");
  return { ...PRACTICE_PERMISSIONS, ...data.permissions };
}
