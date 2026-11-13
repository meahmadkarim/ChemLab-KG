import { getRequestSessionUser } from "@/features/auth/server-session";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { NextResponse, type NextRequest } from "next/server";
import { isLocale } from "@/i18n/config";
import {
  checkRateLimit,
  generateTutorResponse,
  type TutorStyle,
} from "@/features/ai/service";

export const maxDuration = 40;

export async function POST(request: NextRequest) {
  try {
    const clientIp =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local-demo";
    const rate = checkRateLimit(`tutor:${clientIp}`);
    if (!rate.allowed) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Please wait a moment before asking another question." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const experimentSlug = String(body.experimentSlug || "").trim();
    const question = String(body.question || "").trim();
    const rawLocale = String(body.locale || "ky");
    const locale = isLocale(rawLocale) ? rawLocale : "ky";
    const rawStyle = String(body.style || "simple");
    const style: TutorStyle =
      rawStyle === "detailed" || rawStyle === "example" ? rawStyle : "simple";
    const timestampSeconds =
      typeof body.timestampSeconds === "number" && Number.isFinite(body.timestampSeconds)
        ? Math.max(0, Math.round(body.timestampSeconds))
        : null;
    const history = Array.isArray(body.history)
      ? body.history
          .slice(-10)
          .filter(
            (m: unknown): m is { role: "user" | "assistant"; text: string } =>
              Boolean(m) &&
              typeof m === "object" &&
              ((m as { role?: string }).role === "user" ||
                (m as { role?: string }).role === "assistant") &&
              typeof (m as { text?: string }).text === "string" &&
              (m as { text: string }).text.trim().length > 0
          )
      : [];

    if (!experimentSlug || !question) {
      return NextResponse.json(
        { error: "Both experimentSlug and question are required." },
        { status: 400 }
      );
    }

    let liveAllowed = Boolean(process.env.GEMINI_API_KEY);
    if (liveAllowed) {
      const user = await getRequestSessionUser(request);
      if (user && !user.isDemo) {
        const db = await createSupabaseServerClient();
        const { data, error } = await db.rpc("consume_ai_request");
        liveAllowed = !error && data === true;
      }
    }
    const result = await generateTutorResponse({
      liveAllowed,
      experimentSlug,
      question,
      history,
      style,
      timestampSeconds,
      locale,
    });

    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to generate tutor response";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
