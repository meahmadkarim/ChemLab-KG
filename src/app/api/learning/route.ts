import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getRequestSessionUser } from "@/features/auth/server-session";
import { readLearningState } from "@/features/progress/server-learning";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { EXPERIMENTS, TOPICS } from "@/features/experiments/data";

export async function GET(request: NextRequest) {
  const user = await getRequestSessionUser(request);
  if (!user) return NextResponse.json({ error: "Sign in first." }, { status: 401 });
  try { return NextResponse.json({ state: await readLearningState(user) }, { headers: { "Cache-Control": "private, no-store" } }); }
  catch { return NextResponse.json({ error: "Unable to load your learning records." }, { status: 503 }); }
}

export async function PUT(request: NextRequest) {
  const user = await getRequestSessionUser(request);
  if (!user || user.isDemo) return NextResponse.json({ error: "A registered account is required." }, { status: 401 });
  const slug = z.string().refine(s => EXPERIMENTS.some(e => e.slug === s));
  const parsed = z.object({ viewedSlugs: z.array(slug).max(30), bookmarkedSlugs: z.array(slug).max(30), explicitInterests: z.array(z.string().refine(s => TOPICS.some(t => t.id === s))).max(8) }).safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid learning preferences." }, { status: 400 });
  const client = await createSupabaseServerClient();
  const { error } = await client.from("learning_preferences").upsert({ user_id: user.id, viewed_slugs: parsed.data.viewedSlugs, bookmarked_slugs: parsed.data.bookmarkedSlugs, interests: parsed.data.explicitInterests, updated_at: new Date().toISOString() });
  return NextResponse.json(error ? { error: "Unable to save your preferences." } : { ok: true }, { status: error ? 503 : 200 });
}
