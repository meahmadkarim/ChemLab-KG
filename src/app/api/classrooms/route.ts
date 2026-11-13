import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getRequestSessionUser } from "@/features/auth/server-session";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getExperimentBySlug } from "@/features/experiments/server-catalog";

const permissions = z.object({ allowHints: z.boolean(), allowAiExplanations: z.boolean(), showImmediateFeedback: z.boolean(), showCorrectAnswers: z.boolean(), allowRetries: z.boolean() });
const command = z.discriminatedUnion("action", [
  z.object({ action: z.literal("rotate"), classroomId: z.uuid() }),
  z.object({ action: z.literal("roster"), classroomId: z.uuid() }),
  z.object({ action: z.literal("remove-member"), classroomId: z.uuid(), studentId: z.uuid() }),
  z.object({ action: z.literal("deadline"), assignmentId: z.uuid(), dueDate: z.string().refine(s=>Number.isFinite(Date.parse(s)) && Date.parse(s)>Date.now()) }),
  z.object({ action: z.literal("create"), name: z.string().trim().min(1).max(120) }),
  z.object({ action: z.literal("join"), code: z.string().trim().min(6).max(20) }),
  z.object({ action: z.literal("assign"), classroomId: z.string().min(1), experimentSlug: z.string().min(1).max(160), dueDate: z.string().refine(s => Number.isFinite(Date.parse(s)) && Date.parse(s) > Date.now()), permissions }),
  z.object({ action: z.literal("permissions"), assignmentId: z.string().min(1), permissions }),
  z.object({ action: z.literal("edit"), classroomId: z.string().min(1), name: z.string().trim().min(1).max(120) }),
  z.object({ action: z.literal("archive"), classroomId: z.string().min(1), archived: z.boolean() }),
  z.object({ action: z.literal("delete"), classroomId: z.string().min(1) }),
  z.object({ action: z.literal("leave"), classroomId: z.string().min(1) }),
]);

export async function POST(request: NextRequest) {
  const user = await getRequestSessionUser(request);
  if (!user || user.isDemo) return NextResponse.json({ error: "Registered account required." }, { status: 401 });
  const parsed = command.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Check the classroom details and choose a future deadline." }, { status: 400 });
  const input = parsed.data;

  // Authorization checks
  if (input.action !== "join" && input.action !== "leave" && !["teacher", "admin"].includes(user.role)) {
    return NextResponse.json({ error: "Teacher approval required." }, { status: 403 });
  }
  if (input.action !== "join" && input.action !== "leave" && user.teacherStatus === "pending_approval") {
    return NextResponse.json(
      { error: "Classroom management requires verified teacher credentials. Your account is currently pending administrator verification." },
      { status: 403 }
    );
  }

  const client = await createSupabaseServerClient();
  let result;

  switch (input.action) {
    case "roster": {
      const {data,error}=await client.rpc("get_classroom_roster",{p_class:input.classroomId});
      return NextResponse.json(error?{error:"Unable to load roster."}:{students:data},{status:error?403:200});
    }
    case "remove-member":
      result=await client.rpc("remove_classroom_member",{p_class:input.classroomId,p_student:input.studentId}); break;
    case "rotate":
      result=await client.from("learning_classrooms").update({join_code:crypto.randomUUID().replaceAll("-","").slice(0,10).toUpperCase()}).eq("id",input.classroomId).eq("teacher_id",user.id).select("id").single(); break;
    case "deadline":
      result=await client.from("learning_assignments").update({due_date:new Date(input.dueDate).toISOString()}).eq("id",input.assignmentId).select("id").single(); break;
    case "create":
      result = await client.from("learning_classrooms").insert({ name: input.name, teacher_id: user.id }).select("id").single();
      break;
    case "join":
      result = await client.rpc("join_learning_classroom", { p_code: input.code });
      break;
    case "assign":
      if (!await getExperimentBySlug(input.experimentSlug)) return NextResponse.json({ error: "Published experiment required." }, { status: 400 });
      result = await client.from("learning_assignments").insert({ classroom_id: input.classroomId, experiment_slug: input.experimentSlug, due_date: new Date(input.dueDate).toISOString(), permissions: input.permissions }).select("id").single();
      break;
    case "permissions":
      result = await client.from("learning_assignments").update({ permissions: input.permissions }).eq("id", input.assignmentId).select("id").single();
      break;
    case "edit":
      result = await client.from("learning_classrooms").update({ name: input.name }).eq("id", input.classroomId).select("id").single();
      break;
    case "archive":
      result = await client.from("learning_classrooms").update({ archived: input.archived }).eq("id", input.classroomId).select("id").single();
      break;
    case "delete":
      result = await client.from("learning_classrooms").delete().eq("id", input.classroomId);
      break;
    case "leave":
      result = await client.from("learning_memberships").delete().eq("classroom_id", input.classroomId).eq("student_id", user.id);
      break;
  }

  return NextResponse.json(result.error ? { error: "Unable to update classroom. Check your access and entered details." } : { ok: true }, { status: result.error ? 400 : 200 });
}
