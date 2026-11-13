import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const parsed = z.object({ experimentSlug: z.string().max(160), assignmentId: z.uuid().optional(), questionId: z.string().max(80), selectedOptionId: z.string().max(80) }).safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid answer." }, { status: 400 });
  const db = await createSupabaseServerClient();
  const { data, error } = await db.rpc("get_quiz_feedback", { p_slug: parsed.data.experimentSlug, p_question: parsed.data.questionId, p_option: parsed.data.selectedOptionId, p_assignment: parsed.data.assignmentId ?? null });
  if (error) return NextResponse.json({ error: error.code === "42501" ? "Assignment unavailable." : "Question or option not found." }, { status: error.code === "42501" ? 403 : 404 });
  return NextResponse.json(data);
}
