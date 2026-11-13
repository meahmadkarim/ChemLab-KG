import { createSupabaseServerClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { SESSION_COOKIE_NAME } from "@/features/auth/server-session";

export async function POST() {
  const client = await createSupabaseServerClient();
  await client.auth.signOut();
  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return response;
}
