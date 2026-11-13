import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getRequestSessionUser } from "@/features/auth/server-session";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const user = await getRequestSessionUser(request);
  if (!user || user.isDemo) return NextResponse.json({ error: "Registered account required." }, { status: 401 });
  const parsed = z.object({ experimentSlug: z.string().max(160), assignmentId: z.uuid().optional(), responses: z.array(z.object({ questionId: z.string().max(80), selectedOptionId: z.string().max(80) })).min(1).max(30) }).safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid quiz submission." }, { status: 400 });
  const client = await createSupabaseServerClient();
  const { data, error } = await client.rpc("submit_learning_quiz", { p_slug: parsed.data.experimentSlug, p_answers: parsed.data.responses, p_assignment: parsed.data.assignmentId ?? null });
  if (error) return NextResponse.json({ error: "Submission could not be saved. Check the assignment deadline and retry policy." }, { status: 400 });
  return NextResponse.json({ attempt: data });
}
