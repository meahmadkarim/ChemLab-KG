import { NextResponse, type NextRequest } from "next/server";
import { getRequestSessionUser } from "@/features/auth/server-session";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { z } from "zod";

export async function POST(request: NextRequest) {
  try {
    const user = await getRequestSessionUser(request);
    if (!user || user.isDemo) return NextResponse.json({ recorded: false, error: "Sign in with a registered account to save feedback." }, { status: 401 });
    const input = z.object({ rating: z.enum(["helpful", "not_helpful"]), experimentSlug: z.string().min(1).max(160) }).safeParse(await request.json());
    if (!input.success) return NextResponse.json({ recorded: false }, { status: 400 });
    const { rating, experimentSlug } = input.data;
    const client = await createSupabaseServerClient();
    const { error } = await client.from("learning_feedback").insert({ user_id: user.id, rating, experiment_slug: experimentSlug });
    if (error) return NextResponse.json({ recorded: false }, { status: 503 });

    return NextResponse.json({
      recorded: true,
      rating,
      experimentSlug,
      timestamp: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json({ recorded: false }, { status: 400 });
  }
}
