import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { z } from "zod";
export async function POST(request: NextRequest) {
  const parsed = z.object({ email: z.email().max(254) }).safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ ok: false, error: "Enter a valid email." }, { status: 400 });
  const client = await createSupabaseServerClient();
  const { error } = await client.auth.resetPasswordForEmail(parsed.data.email, { redirectTo: `${request.nextUrl.origin}/auth/callback?next=/en/reset-password` });
  if (error) return NextResponse.json({ ok: false, error: "Unable to send reset instructions. Please try again later." }, { status: 503 });
  return NextResponse.json({ ok: true, message: "If an account exists, check your email for reset instructions." });
}
