import { assignmentPermissions } from "@/features/classrooms/server-permissions";
import { getRequestSessionUser } from "@/features/auth/server-session";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { NextResponse, type NextRequest } from "next/server";
import { isLocale } from "@/i18n/config";
import {
  checkRateLimit,
  generateQuizExplanation,
} from "@/features/ai/service";

export async function POST(request: NextRequest) {
  try {
    const clientIp =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local-demo";
    const rate = checkRateLimit(`quiz-exp:${clientIp}`);
    if (!rate.allowed) {
      return NextResponse.json(
        { error: "Rate limit reached. Please wait a few seconds." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const experimentSlug = String(body.experimentSlug || "").trim();
    const questionId = String(body.questionId || "q1").trim();
    const selectedOptionId = body.selectedOptionId ? String(body.selectedOptionId) : undefined;
    const rawMode = String(body.mode || "mistake");
    const mode: "mistake" | "more" | "hint" =
      rawMode === "more" || rawMode === "hint" ? rawMode : "mistake";
    const rawLocale = String(body.locale || "ky");
    const locale = isLocale(rawLocale) ? rawLocale : "ky";

    if (!experimentSlug) {
      return NextResponse.json({ error: "experimentSlug is required" }, { status: 400 });
    }

    const permissions = await assignmentPermissions(body.assignmentId, experimentSlug);
    if ((mode === "hint" && !permissions.allowHints) || (mode !== "hint" && (!permissions.allowAiExplanations || !permissions.showCorrectAnswers))) return NextResponse.json({ error: "This assistance is disabled for the assignment." }, { status: 403 });

    let liveAllowed = Boolean(process.env.GEMINI_API_KEY);
    if (liveAllowed) {
      const user = await getRequestSessionUser(request);
      if (user && !user.isDemo) {
        const db = await createSupabaseServerClient();
        const { data, error } = await db.rpc("consume_ai_request");
        liveAllowed = !error && data === true;
      }
    }

    const result = await generateQuizExplanation({
      experimentSlug,
      questionId,
      selectedOptionId,
      mode,
      locale,
      permissions,
      assignmentId: body.assignmentId,
      liveAllowed,
    });

    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to generate quiz explanation";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
